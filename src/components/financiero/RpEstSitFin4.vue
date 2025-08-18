<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loader.card"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alpha-p-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Estado de Situación Financiera por Periodos
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodoini"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_ini"
                      label="Periodo Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_ini"
                    type="month"
                    no-title
                    scrollable
                    @input="
                      pickerPeriodoini = false;
                      periodo_fin = periodo_ini;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodofin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_fin"
                      label="Periodo Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_fin"
                    type="month"
                    no-title
                    scrollable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="[
                    { text: 'Solo Niif', value: 1 },
                    { text: 'Mayor', value: 2 },
                    { text: 'Subcuenta', value: 3 },
                    { text: 'Auxiliar', value: 4 },
                    { text: 'Rut', value: 5 },
                  ]"
                  label="Nivel"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.nivel"
                  :error="errores.nivel"
                  @change="errores.nivel = false"
                  required
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todas las cuentas', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Cuentas a Procesar"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.selcta"
                  required
                  :error="errores.selcta"
                  @change="errores.selcta = false"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="d-flex"
                cols="6"
                v-if="form.selcta ? form.selcta.value == 2 : false"
              >
                <v-autocomplete
                  label="Codigo"
                  v-model="form.ctacontab"
                  :items="datosctas"
                  :item-text="format_ctas"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6">
                <v-btn
                  color="indigo"
                  class="white--text px-6"
                  @click="get_reporte(0)"
                  large
                  depressed
                >
                  Consultar
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>

              </v-col>
              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="6">
                <v-btn
                  color="green darken-1"
                  class="ml-3 white--text px-6"
                  @click="imprimir_excel"
                  large
                  depressed
                >
                  Generar EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </div>
        <div>
          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-col class="mb-4" cols="6" sm="6">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="contenido"
                item-key="index"
                :search="search"
                disable-pagination
              >
              </v-data-table>
            </v-card-text>
          </v-row>
        </div>
      </v-card>
    </v-flex>

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import { FlowerSpinner } from "epic-spinners";
import ExcelJS from "exceljs";
import post from "../../methods.js";

export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      periodo_ini: this.$moment().format("YYYY-MM"),
      periodo_fin: this.$moment().format("YYYY-MM"),
      styleObject: { border: "2px solid #01579B" },
      condition: false,
      search: null,
      mensaje: 0,
      pickerPeriodoini: false,
      pickerPeriodofin: false,
      pickerCargue: false,
      pickerActual: false,
      loader: false,
      datosctas: [],
      contenido: [],
      json_1: [],
      json_2: [],
      json_3: [],
      json_4: [],
      errores: {
        nivel: false,
        selcta: false,
      },

      form: {
        nivel: "",
      },

      headers: [
        {
          text: "Cuenta",
          align: "left",
          value: "CTAPUC",
          class: "white--text white blue darken-3",
        },
        {
          text: "Descripción",
          align: "left",
          value: "DESCRIPCION",
          class: "white--text white blue darken-3",
        },
      ],

      datosEmpresa: null,
    };
  },
  created() {
    this.mensaje = 0;
    this.cargarTablactas();
    this.get_empresa();
  },
  methods: {
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc.trim()}`;
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    get_reporte(tipo) {
      this.mensaje = 0;
      let perini = this.periodo_ini.split("-").join("");
      let perfin = this.periodo_fin.split("-").join("");
      let anoini = perini.substr(0, 4);
      let anofin = perfin.substr(0, 4);
      if (perfin < perini || anoini < 2000 || anofin < 2000) {
        this.send_error("Error en Periodos");
      } else if (!this.form.nivel) {
        this.errores.nivel = true;
        this.send_error("Error en Nivel");
      } else if (!this.form.selcta) {
        this.errores.selcta = true;
        this.send_error("Error en Cuenta");
      } else {
        this.contenido = [];
        this.procesar_orden();
      }
    },
    async procesar_orden(consecutivo, profesional) {
      let seccion = 0;
      let tipo = this.form.selcta.value;
      if (tipo === 1) {
        seccion = 1;
        await this.imprimir_balance(seccion);
        seccion = 2;
        await this.imprimir_balance(seccion);
        seccion = 3;
        await this.imprimir_balance(seccion);
      } else {
        this.json_1 = await this.imprimir_balance(seccion);
      }
    },
    async imprimir_balance(seccion) {
      this.loader = true;
      console.log("seccion", seccion);
      let perini = this.periodo_ini.split("-").join("");
      let perfin = this.periodo_fin.split("-").join("");
      var cuentaContable = this.form.ctacontab
        ? this.form.ctacontab.cod_puc
        : "0";

      return new Promise((res) => {
        post
          .postData({
            url: "Financiero/dlls/RpEstSitFin4J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              perini +
              "|" +
              perfin +
              "|" +
              this.form.nivel.value +
              "|" +
              this.form.selcta.value +
              "|" +
              cuentaContable +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              seccion +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data[0].BALANCE));
            let activos = 0;
            let pasivos = 0;
            let patrimonio = 0;
          })
          .catch((err) => {
            res(null);
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      });
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
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
