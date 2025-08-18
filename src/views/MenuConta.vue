<template>
  <v-app>
    <appBar @toggleNav="toggleNav" />
    <v-main>
      <v-layout wrap justify-center class="pa-6">
        <v-flex xs12 md12>
          <v-row class="justify-center">
            <v-col
              class="d-flex"
              cols="12"
              sm="4"
              v-for="(item, index) in menus"
              :key="index"
            >
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-card
                    class="mx-auto d-flex align-center justify-center"
                    max-width="300"
                  >
                    <v-img :src="item.src" max-width="90%"></v-img>
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute color="#dfeef2">
                        <v-btn
                          color="red darken-3"
                          depressed
                          @click="navegar(item)"
                          >Ingresar</v-btn
                        >
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </template>
              </v-hover>
            </v-col>
          </v-row>

          <template>
            <v-container fluid>
              <v-row justify="space-around">
                <v-col
                  cols="5"
                  class="align-center d-flex align-content-center justify-center"
                >
                  <v-img
                    :src="logo"
                    height="150px"
                    max-width="400px"
                    contain
                  ></v-img>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-flex>
      </v-layout>
    </v-main>
    <v-footer app></v-footer>
    <v-snackbar
      v-model="snackbar.estado"
      :color="snackbar.color"
      :timeout="10000"
      top="top"
    >
      {{ snackbar.text }}
      <v-btn dark text @click="snackbar.estado = false">cerrar</v-btn>
    </v-snackbar>
  </v-app>
</template>

<style lang="sass">
main
  background: #f1f5fb

.personal-shadow
  box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.1) !important
</style>
<script>
import appBar from "@/components/appBar.vue";
import post from "../methods.js";

export default {
  name: "Home",
  data: () => ({
    drawer: true,
    overlay: false,
    snackbar: [],
    logo: null,
    menus: [],
  }),
  created() {
    if (sessionStorage.Sesion_anterior) {
      sessionStorage.Sesion = sessionStorage.Sesion_anterior;
      sessionStorage.removeItem("Sesion_anterior");
    }

    this.logo = `https://server1ts.net//Datos/image/clientes/${parseFloat(
      sessionStorage.Sesion.substr(0, 15)
    )}.png`;

    this.validar_modulos();
  },
  components: {
    appBar,
  },
  methods: {
    navegar(item) {
      let datos = sessionStorage.Sesion + "|" + item.nit + "|";
      let anterior = sessionStorage.Sesion;

      post
        .postData({
          url: "Financiero/dlls/logincont.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          let sesion_nueva = data[0];
          let usuario_nueva = data[1];

          sessionStorage.Sesion_anterior = anterior;
          sessionStorage.Sesion = sesion_nueva;
          sessionStorage.User = usuario_nueva;

          this.$router.push(item.to);
        });
    },
    validar_modulos() {
      var _this = this;
      var menus = [];

      post
        .postData({
          url: "Financiero/dlls/MConta.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((datos) => {
          let res = datos[0];
          // if (res.configura_rep == "1") {
          //   this.menus.push({
          //     nro: 1,
          //     titleBtn: "Configuración",
          //     src: "https://server1ts.net//Datos/image/botonfin.png",
          //     to: { name: "menu", params: { modulo: "contador" } },
          //   });
          // }

          res.opciones.forEach((el, index) => {
            this.menus.push({
              nro: 2 + index,
              titleBtn: el.titempresa_rep.trim(),
              src: `https://server1ts.net/datos/image/clientes/${parseInt(
                el.idempresa_rep
              )}.png`,
              to: { name: "menubase" },
              nit: el.idempresa_rep,
            });
          });
          // let modulos = datos[0];
          // let filtro = menus.filter((el) => {
          //   let item = modulos[el.name] || false;
          //   return item == "1" ? el : false;
          // });
          // _this.menus = filtro;
        });
    },
    toggleNav(data) {
      this.drawer = !this.drawer;
    },
    snack(data) {
      this.snackbar = data;
    },
  },
};
</script>

