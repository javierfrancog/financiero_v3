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
                    >Plataforma Empresarial</v-card-title
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
                      @keyup.enter="focusNextField('clave')"
                      v-model="usuario"
                    ></v-text-field>

                    <v-text-field
                      id="clave"
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
                      @keyup.enter="focusNextField('punto')"
                    ></v-text-field>
                    <!-- <p class="text-right">
                      <router-link to="/recuperar">Recuperar contraseña</router-link>
                    </p> -->
                    <v-row>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-autocomplete
                          id="punto"
                          :items="ptosrecaudo"
                          label="Taquilla"
                          v-model="puntos"
                          :item-title="format_ptos"
                          item-value="id_agc"
                          hide-details
                          outlined
                          @update:model-value="cargarturnos()"
                          return-object
                          :rules="rules"
                          @keyup.enter="focusNextField('turno')"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="d-flex" cols="12" sm="12">
                        <v-autocomplete
                          id="turno"
                          :items="turnos"
                          label="Turno"
                          v-model="turnos"
                          clearable
                          :item-title="format_turnos"
                          item-value="id_rep"
                          hide-details
                          outlined
                          return-object
                          @keyup.enter="focusNextField('ingreso')"
                          :rules="rules"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>

                    <v-alert
                      text
                      type="error"
                      :hidden="alerta.alertState"
                      dismissible
                      >{{ alerta.mensajeError }}</v-alert
                    >
                    <v-btn
                      id="ingreso"
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
    this.cargaragencias();
  },
  methods: {
    cargaragencias: function () {
      post
        .postData({
          url: "Transporte/dlls/CfAgencias00J.dll",
          data:
            "0000008920001130000000860072432021010711510301" +
            "|" +
            "901" +
            "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    cargarturnos: function () {
      let agencia = this.puntos.id_agc;
      post
        .postData({
          url: "Transporte/dlls/CfTurnosJ.dll",
          data: agencia + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.turnos = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Turnos");
        });
    },
    ingresar: function () {
      if (this.$refs.obj.validate()) {
        this.loader = true;
        let punto_recaudo = this.puntos.id_agc;
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
            sessionStorage.data_auth = btoa(JSON.stringify({ modulo: "tr" }));

            let punto_recaudo = this.puntos;
            let turno = this.turnos;
            if (punto_recaudo) {
              let llave_punto = {
                id: punto_recaudo.id_agc,
                text: punto_recaudo.descrip_agc,
                turno: turno.id_rep,
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
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
  },
};
</script>


