<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid class="px-0 pa-0" fill-height no-gutters>
        <v-layout align-center justify-center fill-height>
          <v-flex xs11 sm8 md9 lg8>
            <v-row
              class="fill-height main-content"
              no-gutters
              :style="{
                position: 'relative',
                background:
                  'url(https://titansoluciones.cloud/img/taxmeta_login.png)',
                'background-size': '100% auto',
                'background-position': 'center',
              }"
            >
              <v-col
                cols="12"
                sm="12"
                md="4"
                class="d-flex align-center justify-center pl-3"
              >
                <!-- <v-img
                  :src="require('../assets/titan_logo_2.png')"
                  contain
                  max-width="80%"
                ></v-img> -->
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="8"
                class="px-0 pa-4 bg-white d-flex justify-center"
              >
                <v-card
                  flat
                  elevation="0"
                  class="px-5 pa-5 col-8 col-lg-8 col-xl-6 col-md-10"
                >
                  <v-card-title
                    class="font-weight-medium headline px-5 pa-0 pb-5"
                    >Acceso a Propietarios</v-card-title
                  >
                  <v-card-subtitle class="px-5 pa-0 pb-5"
                    >Bienvenido a Titán Soluciones</v-card-subtitle
                  >
                  <v-form ref="obj">
                    <!-- <v-text-field
                      label="Empresa"
                      prepend-inner-icon="person_outline"
                      type="number"
                      clearable
                      outlined
                      color="blue darken-4"
                      required
                      v-model="empresa"
                    ></v-text-field> -->
                    <v-text-field
                      label="Usuario"
                      prepend-inner-icon="person_outline"
                      type="number"
                      clearable
                      outlined
                      color="blue darken-4"
                      required
                      :rules="rules"
                      v-model="usuario"
                    ></v-text-field>

                    <v-text-field
                      label="Contraseña"
                      prepend-inner-icon="lock_outline"
                      color="blue darken-4"
                      outlined
                      :append-icon="show1 ? 'visibility' : 'visibility_off'"
                      :type="show1 ? 'text' : 'password'"
                      @click:append="show1 = !show1"
                      class="mb-0"
                      required
                      :rules="rules"
                      v-model="clave"
                    ></v-text-field>
                    <!-- <p class="text-right">
                      <router-link to="/recuperar">Recuperar contraseña</router-link>
                    </p> -->
                    <v-alert
                      text
                      type="error"
                      :hidden="alerta.alertState"
                      dismissible
                      >{{ alerta.mensajeError }}</v-alert
                    >
                    <v-btn
                      color="blue darken-3"
                      large
                      block
                      class="mt-3 mb-3 white--text"
                      depressed
                      @click="ingresar"
                      :loading="loader"
                      :disabled="loader"
                      >Ingresar</v-btn
                    >
                  </v-form>
                </v-card>
              </v-col>
            </v-row>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <v-snackbar
      v-model="snackbar.estado"
      :color="snackbar.color"
      :timeout="10000"
      top="top"
    >
      {{ snackbar.text }}
      <v-btn dark text @click="snackbar.estado = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>
<style lang="sass" scoped>
.main-content
  box-shadow: 0 17px 17px 0 rgba(0, 0, 0, 0.2)

.v-application .error--text
  color: var(--v-error-darken1) !important
  caret-color: var(--v-error-darken1) !important
</style>
<script>
import post from "../methods.js";

export default {
  name: "login",
  data() {
    return {
      snackbar: [],
      loader: false,
      // empresa: "901099286",
      empresa: "",
      usuario: "",
      clave: "",
      puntos: "",
      ptosrecaudo: [],
      turnos: [],      
      show1: false,
      loginValidate: false,
      rules: [(v) => !!v || "Campo requerido"],
      alerta: {
        alertState: true,
        mensajeError: "Sin Conexion",
      },
    };
  },
  created() {
    var $this = this;
  },
  methods: {
    ingresar: function () {
      if (this.$refs.obj.validate()) {
        this.loader = true;
        let punto_recaudo = 9999;
        var data = {
          url: "Financiero/dlls/login.dll",
          data:
            "892000113" +
            "|" +
            this.usuario +
            "|" +
            this.clave +
            "|" +
            "0" +
            "|" +
            punto_recaudo +
            "|",
          method: "",
        };

        post
          .postData(data)
          .then((datos) => {
            this.loader = false;
            sessionStorage.Sesion = datos.data[0];
            sessionStorage.User = datos.data[1];
            sessionStorage.Form = datos.Form;
            sessionStorage.data_auth = btoa(JSON.stringify({ modulo: "pr" }));

            let punto_recaudo = this.puntos;
            let turno = this.turnos;
            if (punto_recaudo) {
              let llave_punto = {
                id: punto_recaudo.id_agc,
                text: punto_recaudo.descrip_agc,
                turno: turno.id_rep
              };
              let base64 = btoa(JSON.stringify(llave_punto));
              sessionStorage["llave_punto"] = base64;
            }
            this.$router.replace(`${datos.Form}`);
          })
          .catch((error) => {
            console.log(error);
            this.loader = false;
            this.alerta.alertState = false;
            this.alerta.mensajeError = error.Mensaje[0];
          });
      }
    },
    format_ptos(val) {
      return `${val.id_agc} - ${val.descrip_agc}`;
    },
    format_turnos(val) {
      return `${val.descrip_rep}`;
    },    
  },
};
</script>


