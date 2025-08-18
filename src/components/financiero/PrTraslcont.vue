<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-shuffle-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Trasladar Registros Contables</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todas las cuentas', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Cuenta de Origen"
                  outlined
                  clearable
                  hide-details
                  v-model="form.tipoctaorig"
                  required
                  :error="error.tipoctaorig"
                  @change="error.tipoctaorig = false"
                ></v-select>
              </v-col>

              <v-col
                class="d-flex"
                cols="6"
                v-if="form.tipoctaorig && form.tipoctaorig == 2"
              >
                <v-autocomplete
                  label="Código de cuenta"
                  v-model="form.cuentaOrigen"
                  :items="cuentasContables"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mb-1">
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todos los Ruts', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Rut de Origen"
                  outlined
                  clearable
                  hide-details
                  v-model="form.tiporutorig"
                  :error="error.tiporutorig"
                  @change="error.tiporutorig = false"
                ></v-select>
              </v-col>

              <v-col
                class="d-flex"
                cols="6"
                v-if="form.tiporutorig && form.tiporutorig == 2"
              >
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.rutOrigen"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-divider class="mb-1" color="#FF6F00"></v-divider>

            <v-row class="mt-1">
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todas las cuentas', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Cuenta Destino"
                  outlined
                  clearable
                  hide-details
                  v-model="form.tipoctadest"
                  required
                ></v-select>
              </v-col>

              <v-col
                class="d-flex"
                cols="6"
                v-if="form.tipoctadest && form.tipoctadest == 2"
              >
                <v-autocomplete
                  label="Código de cuenta"
                  v-model="form.cuentaDestino"
                  :items="cuentasContables"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mb-1">
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todos los Ruts', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Rut Destino"
                  outlined
                  clearable
                  hide-details
                  v-model="form.tiporutdest"
                  required
                ></v-select>
              </v-col>

              <v-col
                class="d-flex"
                cols="6"
                v-if="form.tiporutdest && form.tiporutdest == 2"
              >
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.rutDestino"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-divider color="#0C1CBB"></v-divider>
            <v-divider color="#0C1CBB"></v-divider>

            <v-row class="mt-1">
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false, calcular_final()"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="cargarcontenido"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Procesar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    // JsonExcel
  },
  data() {
    return {
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      search: "",
      form: {
        cuenta: null,
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      error: {
        tipoctaorig: false,
        tiporutorig: false,
      }
    };
  },
  created() {
    this.cargarTablactas();
    this.cargarTablaruts();
  },
  methods: {
    cargarcontenido() {
      var data = this.form;
      if (!data.tipoctaorig) {
        this.send_error("Selecciona el tipo de cuenta de Origen");
        this.error.tipoctaorig = true
      } else if (!data.tipoctadest) {
        this.send_error("Selecciona el tipo de cuenta de Destino");
        this.error.tiporutorig = true
      } else {
        let sesion = sessionStorage.Sesion;
        let fechaini = data.fechaInicial.replace(/\-/g, "");
        let fechafin = data.fechaFinal.replace(/\-/g, "");
        let ctaorigen = data.tipoctaorig == 1 ? 9 : data.cuentaOrigen.cod_puc.trim();
        let ctadestino = data.tipoctadest == 1 ? 9 : data.cuentaDestino.cod_puc.trim();
        let rutorigen =
          data.tiporutorig == 1 ? 9 : data.rutOrigen.identificacion_rut.trim();
        let rutdestino =
          data.tiporutdest == 1 ? 9 : data.rutDestino.identificacion_rut.trim();
        let datosEnvio = [
          sesion,
          fechaini,
          fechafin,
          ctaorigen,
          ctadestino,
          rutorigen,
          rutdestino,
        ];
        this.postData({
          url: "Financiero/dlls/PrTraslcont.dll",
          data: datosEnvio.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: "Proceso Correcto",
              estado: true,
            });
          })
          .catch((err) => {
            console.log(err)
            this.send_error(err.Mensaje[0].msg);
          });
      }
    },

    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },

    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasContables = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },

    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },
    calcular_final() {
      let fecha = this.form.fechaInicial;
      let año = fecha.substring(0, 4);
      let mes = 12;
      let dia = fecha.substring(8, 10);

      let today = new Date(año, mes, 0);
      let lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      let f_final = año.concat("-", mes, "-", lastDay);
      this.form.fechaFinal = f_final;
      this.pickeFechaIni = false;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
