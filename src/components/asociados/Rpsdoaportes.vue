<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loader.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-piggy-bank-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Saldo Aportes Asociado</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo de corte"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                    @change="limpiar_datos()"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Asociado"
                  v-model="form.asociado"
                  :items="ruts3"
                  :item-text="format_ruts"
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="generar_reporte(), (errores.asociado = false)"
                  :error="errores.asociado"
                ></v-autocomplete>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="get_reporte()"
                  >Buscar</v-btn
                >
              </v-col> -->

              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="3">
                <v-btn
                  color="green darken-1"
                  class="white--text px-6"
                  @click="imprimir_excel"
                  large
                  depressed
                  v-if="contenido.length"
                >
                  Generar EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
              -->
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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
  </v-layout>
</template>

<script>
import ExcelJS from "exceljs";
import post from "../../methods.js";
export default {
  data() {
    return {
      periodo_cargue: this.$moment().format("YYYY-MM"),
      condition: false,
      search: null,
      pickerPeriodo: false,
      pickerCargue: false,
      pickerActual: false,
      tablaruts: [],
      datosctas: [],
      form: [],
      ruts3: [],
      contenido: [],
      errores: {
        asociado: false,
      },
      loader: {
        card: false,
      },
      datosEmpresa: null,
      headers: [
        {
          text: "Asociado",
          align: "left",
          value: "descripcion_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Fecha Ingreso",
          value: "fechaaf_rep",
          class: "white--text white blue darken-3",
        },

        {
          text: "Saldo Aportes",
          value: "vlrapor_rep",
          class: "white--text white blue darken-3",
          align: "center",
        },
      ],
    };
  },
  created() {
    this.cargarTablaruts();
  },
  methods: {
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|" + "5" + "|",
          method: "",
        })
        .then((data) => {
          data.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });

          this.ruts3 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts(val) {
      return `${val.descripcion_rut.trim()}`;
    },
    imprimir_excel() {
      let periodo_corte = this.periodo_cargue;
      let periodo_separado = periodo_corte.split("-");

      let data_parse = [];

      this.contenido.forEach((el) => {
        let saldo_ap = 0;
        let ult_pago = "";
        let vlr_pago = 0;

        let copia = JSON.parse(JSON.stringify(el));
        saldo_ap = parseFloat(copia.totalap_rep.replace(/\,/g, "")) || 0;
        let total_apor = parseFloat(copia.vlrapor_rep.replace(/\,/g, ""));

        copia.periodos_rep.pop();
        copia.periodos_rep.forEach((p) => {
          let periodo_array = p.periodo_rep.split("-");
          copia[`per_${periodo_array[0]}_${parseInt(periodo_array[1])}`] =
            parseFloat(p.valor_rep.replace(/\,/g, "")) || 0;
          saldo_ap = saldo_ap + parseFloat(p.valor_rep.replace(/\,/g, "")) || 0;
          vlr_pago = parseFloat(p.valor_rep.replace(/\,/g, ""));
          if (vlr_pago > 0) {
            ult_pago = p.ultpago_rep;
          }
        });

        copia.totalap_rep = total_apor;
        copia.ult_pago_rep = ult_pago;

        delete copia.periodos_rep;

        data_parse.push(copia);
      });

      let columnas = [
      {
          title: "Id Asociado",
          value: "identificacion_rep",
          format: "string",
        },

      {
          title: "Nombre",
          value: "descripcion_rep",
          format: "string",
        },

        {
          title: "Fecha Ingreso",
          value: "fechaaf_rep",
          format: "string",
        },
        {
          title: "Fecha Ult.Pago",
          value: "ult_pago_rep",
          format: "string",
        },
        {
          title: "Total Saldo Aportes",
          value: "totalap_rep",
          format: "money",
        },
      ];

      // Este ciclo almacena dinamicamente las columnas segun los meses que se escojan de informe
      for (let i = 1; i <= parseInt(periodo_separado[1]); i++) {
        columnas.push({
          title: `${periodo_separado[0]}-${i}`,
          value: `per_${periodo_separado[0]}_${i}`,
          format: "money",
          align: "center",
        });
      }

      let header_format = [
        { text: "APORTES ASOCIADO", bold: true, size: 16 },
        { text: `Periodo de corte: ${periodo_corte}`, bold: true, size: 14 },
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Aportes Asociados",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `APORTES ASOCIADO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    limpiar_datos() {
      this.contenido = [];
    },
    generar_reporte() {
      this.loader.card = true;
      this.contenido = [];
      let rut = this.form.asociado.identificacion_rut;

      var datos = {
        url: "Asociados/dlls/RpAportes01J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.periodo_cargue.split("-").join("") +
          "|" +
          rut +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          data.pop();
          this.loader.card = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((error) => {
          console.error(error);
          this.loader.card = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar estado",
            estado: true,
          });
        });
    },
    get_reporte(tipo) {
      this.limpiar_datos();
      this.loader.card = true;
      this.contenido = [];

      var rut = sessionStorage.Sesion.substr(15, 15);

      var datos = {
        url: "Financiero/dlls/RpEstsitfin3J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.periodo_cargue.split("-").join("") +
          "|" +
          rut +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader.card = false;
          this.contenido = JSON.parse(JSON.stringify(data[0].BALANCE));
        })
        .catch((error) => {
          console.error(error);
          this.loader.card = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar estado",
            estado: true,
          });
        });
    },
  },
};
</script>
