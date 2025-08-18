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
                    class="
                      font-weight-medium
                      headline
                      px-5
                      pa-0
                      pb-5
                      d-flex
                      justify-center
                    "
                    >Comprar Tiquete</v-card-title
                  >
                  <v-form ref="obj">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          :items="embarques"
                          label="Origen"
                          outlined
                          clearable
                          :item-title="format_embarques"
                          hide-details
                          v-model="form.origen"
                          item-value="value"
                          return-object
                          required
                          @update:model-value="bloquear_pago()"
                          :error="errores.origen"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          :items="embarques"
                          label="Destino"
                          outlined
                          clearable
                          :item-title="format_embarques"
                          hide-details
                          v-model="form.destino"
                          item-value="value"
                          return-object
                          @update:model-value="get_valor()"
                          :error="errores.destino"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row class="d-flex align-center justify-center">
                      <v-col sm="8">
                        <v-text-field
                          label="Valor Pasaje"
                          outlined
                          hide-details
                          disabled
                          height="100"
                          class="inputPeso"
                          v-model="form.valor"
                          preffix="$"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="d-flex align-center justify-center">
                      <v-col cols="6">
                        <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="ml-4"
                          @click=condiciones()
                        >
                          Condiciones de Viaje
                        </v-btn>
                      </v-col>
                      <v-col cols="6">
                        <v-checkbox
                          v-model="form.checkbox"
                          :label="`Acepto Condiciones`"
                          class="ml-2"
                          @change=condiciones2()                          
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row class="d-flex align-center justify-center">
                      <v-btn
                        color="blue darken-3"
                        large
                        block
                        class="mt-3 mb-3 white--text"
                        depressed
                        @click="get_pago"
                        :loading="loader"
                        :disabled="disabled.btn_enviar"
                        >Pagar</v-btn
                      >
                    </v-row>
                  </v-form>
                </v-card>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-dialog v-model="dialogo" persistent max-width="600">
                <v-card>
                  <v-card-title class="text-h5">
                    Condiciones de Viaje
                  </v-card-title>
                  <v-card-text>
                    1.En caso de daño imprevisto del vehículo al presentarse cualquier inconveniente en la vía,
                    el conductor hará lo posible para que los pasajeros puedan continuar el viaje, la empresa no
                    asume responsabilidad por perjuicios ocasionados por esta causa.
                    2.El pasajero declara conocer las condiciones de la empresa y asume la responsabilidad y 
                    riesgo del transporte.
                    3.Todo pasajero tiene derecho a llevar 15 kilos de equipaje pero la empresa no se responsabiliza
                    por el contenido, perdida o cambios de maletas u otros objetos.
                    4.Pasajero que no se presenta a la hora de salida perderá el valor del pasaje.
                    5.Si su equipaje contiene objetos de valor deberá aforarlos
                    6.Si lleva equipaje reclame su sticker.
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click=acepto()>
                      Acepto
                    </v-btn>
                    <v-btn color="red darken-1" text @click=rechazo()>
                      No Acepto
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>
<style lang="sass" scoped>
.main-content
  box-shadow: 0 17px 17px 0 rgba(0, 0, 0, 0.2)

.v-application .error--text
  color: var(--v-error-darken1) !important
  caret-color: var(--v-error-darken1) !important
</style>
<style>
.inputPeso {
  font-size: 24px !important;
}
</style>
<script>
import post from "../methods.js";

export default {
  name: "login",
  data() {
    return {
      snackbar: [],

      dialogo: {
        estado: true,
      },
      checkbox: false,
      loader: false,
      // empresa: "901099286",
      empresa: "",
      embarques: [],
      errores: {},
      form: {},
      disabled: {
        btn_enviar: false,
      },

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
    this.dialogo = false;    
    this.disabled.btn_enviar = true;
    this.form.checkbox = false;

    this.get_embarques();
  },
  methods: {
    get_pago() {
      const url = `https://www.avalpaycenter.com/wps/portal/portal-de-pagos/web/pagos-aval/resultado-busqueda/realizar-pago/!ut/p/a1/lZDNVoMwEIVfRRcuJcM_LEnVgqitWlDYeFJIa5QQpIA9Pr2hPbZqtR6zmszcO_dLUIruUVqSjs1Jw0RJiv6eWg-Oa1qBAVroxAYGL4jcswvfV-ESpCCRAvjlePDVPzKuT3q_j4cm1mH04d8IhpNVQHir-ThUYWDs9Q-0Hb_hWlIwuhzEcaQC_Ne_C_iH_w6lXyU_vOCbYBdxJdjzh4mEtD9HuKdyA3aDq4mugmOj237HE-nIUlnQuitoo7AyK9qcKhVpHh9YORMoOQLcLjKSi3pcyzGrSHFGMrqIGX1Vlo8NL_o1meAKm3Jl1o-UStRNv46LnKKkk0qU-CiNM33GZRlsy_NtuRd3ZK1xM5GzuRiwNic5SmDVIg2dS8aXluZk0-OV-OhhlDRkecBpQ76nQGh7MsXE5z6-kr9m72CE4II3kYrT0NOGprrGqF9aJvNVyzJMW9NMTTfMNV7Z0ZKJoIeTR3V1QBWPouge2JhzR3--OSbTNzp1niY08Q7fAWUhgCs!/#Z7_8956I402K0K7A0AI5BJHBN00A7`;
      window.open(url, "_blank").focus();
    },
    condiciones(){
      this.dialogo = true;
      this.form.checkbox = false;
    },
    condiciones2(){
      let aceptar = this.form.checkbox ? "1" : "0";
      if (aceptar == 1){
        this.disabled.btn_enviar = false;     
      } else{
        this.disabled.btn_enviar = true;     
      }
    },

    acepto(){
      this.dialogo = false;
      this.form.checkbox = true;
      this.disabled.btn_enviar = false;     
    },
    rechazo(){
      this.dialogo = false;
      this.form.checkbox = false;
      this.disabled.btn_enviar = true;     
    },

    bloquear_pago() {
      this.disabled.btn_enviar = true;
    },
    get_valor() {
      this.bloquear_pago();
      this.form.valor = 0;
      let origen = this.form.origen.id_emb;
      let destino = this.form.destino.id_emb;
      this.loader = true;
      post
        .postData({
          url: "transporte/dlls/CfDestinos01J.dll",
          data:
            "0000008920001130000000860072432022101717510001" +
            "|" +
            origen +
            "|" +
            destino +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.form.valor = data[0].valor_rep;
          this.disabled.btn_enviar = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },

    get_embarques() {
      this.loader = true;
      post
        .postData({
          url: "transporte/dlls/PrembarquesJ.dll",
          data: "0000008920001130000000860072432022101717510001" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.embarques = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },
    format_embarques: function (val) {
      return val.descrip_emb;
    },

    ingresar: function () {
      if (this.$refs.obj.validate()) {
        this.loader = true;
        let punto_recaudo = this.puntos.codigo_agc;
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
  },
};
</script>


