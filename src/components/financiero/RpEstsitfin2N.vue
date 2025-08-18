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
              <v-icon size="30" color="blue darken-4 ">mdi-currency-inr</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Estado de situación Financiera del Mes
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
                      label="Periodo"
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
                    @change="clear_tabla()"
                    @input="
                      pickerPeriodoini = false;
                      periodo_fin = periodo_ini;
                    "
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
                  @change="clear_tabla(), (errores.nivel = false)"
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
                  @change="clear_tabla(), (errores.selcta = false)"
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
                  @change="clear_tabla()"
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-if="this.datosEmpresa.consorcio_empr == 1">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Consorciado"
                  v-model="form.consorciado"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  @change="clear_tabla()"
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="% Participación"
                  clearable
                  outlined
                  @change="clear_tabla()"
                  type="number"
                  v-model="form.porcentaje"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="3">
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
              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="3">
                <v-btn
                  color="red darken-1"
                  class="white--text px-6"
                  @click="print_pdf()"
                  large
                  depressed
                >
                  Generar PDF
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="3">
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
            <h4
              v-if="mensaje != 0"
              style="color: red"
              class="font-weight-bold text-h6 subtitles"
            >
              Balance con Descuadre!
            </h4>
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
    <div id="impresion_estados">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <div id="page_activos">
        <div class="titulo_doc">
          <b>Estados</b>
          de situación financiera
        </div>
        <table id="activos_table">
          <tbody></tbody>
        </table>
      </div>
      <div id="page_pasivos">
        <div class="titulo_doc">
          <b>Estados</b>
          de situación financiera
        </div>
        <table id="pasivos_table">
          <tbody></tbody>
        </table>
      </div>
      <!-- <div id="page_ingresos">
        <div class="titulo_doc">
          <b>Estados</b>
          de resultados integrales
        </div>
        <table id="ingresos_table">
          <tbody></tbody>
        </table>
      </div>-->
      <div id="page_footer">
        <div>
          <a class="firma1_footer"></a>
          <br />
          <a class="cargo1_footer"></a>
        </div>
        <div>
          <a class="firma2_footer"></a>
          <br />
          <a class="cargo2_footer"></a>
        </div>
        <div>
          <a class="firma3_footer"></a>
          <br />
          <a class="cargo3_footer"></a>
        </div>
      </div>
    </div>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import { FlowerSpinner } from "epic-spinners";
import ExcelJS from "exceljs";
import post from "../../methods.js";
import { esfm } from "../../_formatos.pdf.js";

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
        {
          text: "Saldo Inicial",
          align: "right",
          value: "SDO_ANTER",
          class: "white--text white blue darken-3",
        },
        {
          text: "Débitos",
          align: "right",
          value: "DEBITOS",
          class: "white--text white blue darken-3",
        },
        {
          text: "Creditos",
          align: "right",
          value: "CREDITOS",
          class: "white--text white blue darken-3",
        },
        // {
        //   text:  " ",
        //   width: "15%"
        // },
        {
          text: "Nuevo Saldo",
          align: "right",
          value: "SALDO",
          class: "white--text white blue darken-3",
        },
      ],

      datosEmpresa: null,
      datarep: null,
    };
  },
  created() {
    this.mensaje = 0;
    this.cargarTablactas();
    this.get_empresa();
  },
  methods: {
    clear_tabla() {
      this.contenido = [];
    },
    // get_pdf() {
    //   let data = this.datarep;
    //   let totalActivos = {};
    //   let totalPasivos = {};
    //   let totalPatrimonio = {};

    //   this.contenido.forEach((v) => {
    //     if (parseFloat(v.NIVEL) == 1) {
    //       totalActivos = { ...v };
    //     }

    //     if (parseFloat(v.NIVEL) == 2) {
    //       totalPasivos = { ...v };
    //     }
    //     if (parseFloat(v.NIVEL) == 3) {
    //       totalPatrimonio = { ...v };
    //     }
    //   });

    //   var $this = this;
    //   var balance = data[0].BALANCE;

    //   var info = balance.reduce((r, a) => {
    //     var key = a.NIVEL.trim().substr(0, 1);
    //     r[key] = r[key] || [];
    //     if (key == key) r[key].push(a);
    //     return r;
    //   }, Object.create(null));

    //   var fecha = this.periodo_ini;
    //   var añoActual = parseInt(fecha.split("-")[0]);
    //   var añoAnterior = añoActual - 1;
    //   var mes = fecha.split("-")[1];
    //   var mesText = this.get_mes(mes);

    //   delete info["0"];

    //   var get_line = () => {
    //     return {
    //       canvas: [
    //         {
    //           type: "line",
    //           lineColor: "#01579b",
    //           x1: 0,
    //           y1: 0,
    //           x2: 515,
    //           y2: 0,
    //           lineWidth: 1,
    //         },
    //       ],
    //     };
    //   };

    //   var titulo = {
    //     margin: [0, 0, 0, 50],
    //     style: "titulo_main",
    //     text: [
    //       {
    //         text: "Estados",
    //         bold: true,
    //       },
    //       " de situación financiera",
    //     ],
    //   };

    //   var total_row = (
    //     descripcion,
    //     total1,
    //     total2,
    //     total3,
    //     total4,
    //     padding_top
    //   ) => {
    //     return {
    //       margin: [0, padding_top ? 30 : 0, 0, 0],
    //       stack: [
    //         get_line(),
    //         {
    //           margin: [0, 5, 0, 5],
    //           columns: [
    //             {
    //               width: "50%",
    //               alignment: "right",
    //               fontSize: 10,
    //               bold: true,
    //               color: "#ff5722",
    //               text: descripcion,
    //             },
    //             {
    //               width: "12.5%",
    //               alignment: "right",
    //               fontSize: 8,
    //               bold: true,
    //               text: this.formatNumero2(total1.toFixed(2)),
    //             },
    //             {
    //               width: "11.5%",
    //               alignment: "right",
    //               fontSize: 8,
    //               bold: true,
    //               text: this.formatNumero2(total2.toFixed(2)),
    //             },
    //             {
    //               width: "12.5%",
    //               alignment: "right",
    //               fontSize: 8,
    //               bold: true,
    //               text: this.formatNumero2(total3.toFixed(2)),
    //             },

    //             {
    //               width: "13.5%",
    //               alignment: "right",
    //               fontSize: 8,
    //               bold: true,
    //               text: this.formatNumero2(total4.toFixed(2)),
    //             },
    //           ],
    //         },
    //       ],
    //     };
    //   };

    //   var content = [];

    //   var totales = {
    //     2019: {
    //       pasivo: 0,
    //       patrimonio: 0,
    //       resultado: 0,
    //     },
    //     2020: {
    //       pasivo: 0,
    //       patrimonio: 0,
    //       resultado: 0,
    //     },
    //     creditos: {
    //       pasivo: 0,
    //       patrimonio: 0,
    //       resultado: 0,
    //     },
    //     saldo: {
    //       pasivo: 0,
    //       patrimonio: 0,
    //       resultado: 0,
    //     },
    //   };

    //   Object.getOwnPropertyNames(info).forEach((el, index) => {
    //     var item = info[el];
    //     var stack = [];
    //     // stack.push(titulo);

    //     var total1 = 0;
    //     var total2 = 0;
    //     var total3 = 0;
    //     var total4 = 0;

    //     item.forEach((val) => {
    //       let nivel = val.NIVEL.trim();

    //       let padding = {
    //         left: nivel.length * 8,
    //         right: 0,
    //         top: 0,
    //         bottom: 0,
    //       };

    //       if (nivel.length === 1) {
    //         stack.push({
    //           style: "titulo",
    //           stack: [
    //             get_line(),
    //             {
    //               margin: [0, 5, 0, 5],
    //               columns: [
    //                 {
    //                   width: "40%",
    //                   text: val.DESCRIPCION.trim(),
    //                 },
    //                 {},
    //                 {
    //                   width: "12.5%",
    //                   alignment: "right",
    //                   text: "Saldo inicial".toUpperCase(),
    //                 },
    //                 {
    //                   width: "12.5%",
    //                   alignment: "right",
    //                   text: "Débitos".toUpperCase(),
    //                 },
    //                 {
    //                   width: "12.5%",
    //                   alignment: "right",
    //                   text: "Crédito".toUpperCase(),
    //                 },
    //                 {
    //                   width: "2%",
    //                   alignment: "right",
    //                   text: " ",
    //                 },
    //                 {
    //                   width: "12.5%",
    //                   alignment: "right",
    //                   text: "Saldo final".toUpperCase(),
    //                 },
    //               ],
    //             },
    //             get_line(),
    //           ],
    //         });
    //       } else if (
    //         nivel.length === 2 &&
    //         nivel.trim() !== "31" &&
    //         nivel.substr(0, 1) > "3"
    //       ) {
    //         stack.push({
    //           style: "titulo",
    //           margin: [padding.left, 10, padding.right, 0],
    //           text: val.DESCRIPCION.trim(),
    //         });

    //         if (nivel.substr(0, 1) == "4") {
    //           totales["2019"].resultado +=
    //             parseFloat(
    //               val.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")
    //             ) || 0;
    //           totales["2020"].resultado +=
    //             parseFloat(val.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) ||
    //             0;
    //           totales["creditos"].resultado +=
    //             parseFloat(val.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) ||
    //             0;
    //           totales["saldo"].resultado +=
    //             parseFloat(val.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;
    //         } else {
    //           totales["2019"].resultado -=
    //             parseFloat(
    //               val.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")
    //             ) || 0;
    //           totales["2020"].resultado -=
    //             parseFloat(val.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) ||
    //             0;
    //           totales["creditos"].resultado -=
    //             parseFloat(val.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) ||
    //             0;
    //           totales["saldo"].resultado -=
    //             parseFloat(val.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;
    //         }
    //       } else {
    //         let valor1 = null;
    //         let valor2 = null;
    //         let valor3 = null;
    //         let valor4 = null;
    //         let total = false;

    //         padding.top = 2;
    //         padding.bottom = 2;
    //         if (nivel.length === 3 || nivel.trim() === "31") {
    //           if (
    //             nivel.substr(-1) === "T" ||
    //             nivel.substr(0, 1) === "3" ||
    //             nivel.substr(0, 1) === "4" ||
    //             nivel.substr(0, 1) === "5"
    //           ) {
    //             total1 +=
    //               parseFloat(
    //                 val.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")
    //               ) || 0;
    //             total2 +=
    //               parseFloat(
    //                 val.DEBITOS.replace(/\,/g, "").replace(/ /g, "")
    //               ) || 0;
    //             total3 +=
    //               parseFloat(
    //                 val.CREDITOS.replace(/\,/g, "").replace(/ /g, "")
    //               ) || 0;
    //             total4 +=
    //               parseFloat(val.SALDO.replace(/\,/g, "").replace(/ /g, "")) ||
    //               0;

    //             if (nivel.substr(0, 1) !== "3") {
    //               total = true;
    //               stack.push(get_line());
    //             }
    //           } else {
    //             padding.top = 15;
    //           }

    //           valor1 = val.SDO_ANTER.trim().replace(/ /g, "") || 0;
    //           valor2 = val.DEBITOS.trim().replace(/ /g, "") || 0;
    //           valor3 = val.CREDITOS.trim().replace(/ /g, "") || 0;
    //           valor4 = val.SALDO.trim().replace(/ /g, "") || 0;
    //           // } else if (nivel.length === 4) {
    //           //   valor1 = val.VALOR1.trim().replace(/ /g, "") || 0;
    //         } else {
    //           // valor1 = val.VALOR1.trim().replace(/ /g, "") || 0;
    //           valor1 = val.SDO_ANTER.trim().replace(/ /g, "") || 0;
    //           valor2 = val.DEBITOS.trim().replace(/ /g, "") || 0;
    //           valor3 = val.CREDITOS.trim().replace(/ /g, "") || 0;
    //           valor4 = val.SALDO.trim().replace(/ /g, "") || 0;
    //         }
    //         var cuentaPuc = parseInt(val.CTAPUC) != 0 ? val.CTAPUC : "";
    //         var idrut = parseInt(val.CTAPUC) != 0 ? val.CTAPUC : "";
    //         stack.push({
    //           margin: [0, padding.top, 0, padding.bottom],
    //           columns: [
    //             {
    //               margin: [0, 0, 0, 0],
    //               width: "10%",
    //               style: total ? "titulo" : null,
    //               text: cuentaPuc,
    //             },

    //             {
    //               margin: [padding.left, 0, padding.right, 0],
    //               width: "40%",
    //               style: total ? "titulo" : null,
    //               text: val.DESCRIPCION.trim(),
    //             },
    //             {
    //               width: "12.5%",
    //               alignment: "right",
    //               bold: total,
    //               text: valor1,
    //             },
    //             {
    //               width: "11.5%",
    //               alignment: "right",
    //               bold: total,
    //               text: valor2,
    //             },
    //             {
    //               width: "12.5%",
    //               alignment: "right",
    //               bold: total,
    //               text: valor3,
    //             },
    //             {
    //               width: "13.5%",
    //               alignment: "right",
    //               bold: total,
    //               text: valor4,
    //             },
    //           ],
    //         });
    //       }
    //     });

    //     let descripcion_nivel = item[0].DESCRIPCION.trim();
    //     let neto = total1 + total2 + total3 + total4;

    //     if (parseFloat(item[0].NIVEL) == 1) {
    //       stack.push(
    //         total_row(
    //           `TOTAL ${descripcion_nivel}`,
    //           parseFloat(totalActivos.SDO_ANTER.replace(/\,/g, "")) || 0,
    //           parseFloat(totalActivos.DEBITOS.replace(/\,/g, "")) || 0,
    //           parseFloat(totalActivos.CREDITOS.replace(/\,/g, "")) || 0,
    //           parseFloat(totalActivos.SALDO.replace(/\,/g, "")) || 0
    //         )
    //       );
    //     } else if (parseFloat(item[0].NIVEL) == 2) {
    //       stack.push(
    //         total_row(
    //           `TOTAL ${descripcion_nivel}`,
    //           parseFloat(totalPasivos.SDO_ANTER.replace(/\,/g, "")) || 0,
    //           parseFloat(totalPasivos.DEBITOS.replace(/\,/g, "")) || 0,
    //           parseFloat(totalPasivos.CREDITOS.replace(/\,/g, "")) || 0,
    //           parseFloat(totalPasivos.SALDO.replace(/\,/g, "")) || 0
    //         )
    //       );
    //     } else if (parseFloat(item[0].NIVEL) == 3) {
    //       stack.push(
    //         total_row(
    //           `TOTAL ${descripcion_nivel}`,
    //           parseFloat(totalPatrimonio.SDO_ANTER.replace(/\,/g, "")) || 0,
    //           parseFloat(totalPatrimonio.DEBITOS.replace(/\,/g, "")) || 0,
    //           parseFloat(totalPatrimonio.CREDITOS.replace(/\,/g, "")) || 0,
    //           parseFloat(totalPatrimonio.SALDO.replace(/\,/g, "")) || 0
    //         )
    //       );
    //     } else {
    //       stack.push(
    //         total_row(
    //           `TOTAL ${descripcion_nivel}`,
    //           total1,
    //           total2,
    //           total3,
    //           total4
    //         )
    //       );
    //     }
    //     // Add total

    //     if (el == "2") {
    //       totales["2020"].pasivo = total1;
    //       totales["2019"].pasivo = total2;
    //       totales.creditos.pasivo = total3;
    //       totales.saldo.pasivo = total4;
    //     } else if (el == "3") {
    //       totales["2020"].patrimonio = total1;
    //       totales["2019"].patrimonio = total2;
    //       totales.creditos.patrimonio = total3;
    //       totales.saldo.patrimonio = total4;
    //     }

    //     if (el == "3") {
    //       let label = null;
    //       let valor1 = 0;
    //       let valor2 = 0;
    //       let valor3 = 0;
    //       let valor4 = 0;

    //       if (el == "3") {
    //         label = "TOTAL PASIVOS + PATRIMONIO";
    //         valor1 =
    //           parseFloat(totalPasivos.SDO_ANTER.replace(/\,/g, "")) +
    //           parseFloat(totalPatrimonio.SDO_ANTER.replace(/\,/g, ""));
    //         valor2 =
    //           parseFloat(totalPasivos.DEBITOS.replace(/\,/g, "")) +
    //           parseFloat(totalPatrimonio.DEBITOS.replace(/\,/g, ""));
    //         valor3 =
    //           parseFloat(totalPasivos.CREDITOS.replace(/\,/g, "")) +
    //           parseFloat(totalPatrimonio.CREDITOS.replace(/\,/g, ""));
    //         valor4 =
    //           parseFloat(totalPasivos.SALDO.replace(/\,/g, "")) +
    //           parseFloat(totalPatrimonio.SALDO.replace(/\,/g, ""));
    //       }

    //       stack.push(total_row(label, valor1, valor2, valor3, valor4, true));
    //     }

    //     content.push({
    //       pageBreak:
    //         index + 1 === Object.getOwnPropertyNames(info).length
    //           ? null
    //           : "after",
    //       stack,
    //     });
    //   });
    //   let label = null;
    //   let valor1 = 0;
    //   let valor2 = 0;
    //   let valor3 = 0;
    //   let valor4 = 0;
    //   label = "RESULTADO DEL EJERCICIO";
    //   valor1 = totales["2019"].resultado;
    //   valor2 = totales["2020"].resultado;
    //   valor3 = totales.creditos.resultado;
    //   valor4 = totales.saldo.resultado;
    //   let stack2 = [];
    //   stack2.push(total_row(label, valor1, valor2, valor3, valor4, true));
    //   content.push({ pageBreak: null, stack: stack2 });

    //   var _this = this;
    //   var logo_src = require(`../../assets/image/clientes/${parseFloat(
    //     sessionStorage.Sesion.substr(0, 15)
    //   )}.png`);
    //   this.pdfs.getBase64(logo_src).then((logo) => {
    //     var dd = {
    //       pageMargins: [40, 110, 40, 40],
    //       header: function (currentPage, pageCount, pageSize) {
    //         return [
    //           {
    //             margin: [40, 40, 40, 0],
    //             columns: [
    //               {
    //                 stack: [
    //                   {
    //                     image: "logo",
    //                     fit: [70, 70],
    //                   },
    //                 ],
    //               },
    //               {
    //                 width: "80%",
    //                 style: "tituloHeader",
    //                 stack: [
    //                   {
    //                     text: _this.datosEmpresa.descrip_empr
    //                       .trim()
    //                       .toUpperCase(),
    //                   },
    //                   {
    //                     text: `Nit. ${parseInt(_this.datosEmpresa.id_empr)}`,
    //                   },
    //                   {
    //                     style: "titulo_main",
    //                     text: [
    //                       {
    //                         text: "Estados",
    //                         bold: true,
    //                       },
    //                       " de situación financiera ",
    //                       mesText.toUpperCase() + " " + añoActual,
    //                     ],
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         ];
    //       },
    //       footer: function (currentPage, pageCount) {
    //         return {
    //           margin: [0, 0, 40, 0],
    //           alignment: "right",
    //           text: currentPage.toString() + " / " + pageCount,
    //         };
    //       },
    //       content,
    //       defaultStyle: {
    //         fontSize: 8,
    //       },
    //       styles: {
    //         titulo: {
    //           color: "#ff5722",
    //           bold: true,
    //         },
    //         titulo_main: {
    //           fontSize: 14,
    //           color: "#01579b",
    //         },
    //         tituloHeader: {
    //           bold: true,
    //           fontSize: 14,
    //         },
    //       },
    //       images: {
    //         logo,
    //       },
    //     };

    //     pdfMake.createPdf(dd).open();
    //   });
    // },

    print_pdf() {
      let data = {};
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      data.nivel = this.form.nivel;
      data.titulo_empr = this.datosEmpresa.descrip_empr;
      data.nit_empr = this.datosEmpresa.id_empr;

      var fecha = this.periodo_ini;

      let mes = fecha.split("-")[1];
      data.mesText = this.get_mes(mes);
      data.añoActual = parseInt(fecha.split("-")[0]);


      var balance = this.datarep[0].BALANCE;
      data.cierre = this.datarep[1].CIERRE;

      var info = balance.reduce((r, a) => {
        var key = a.NIVEL.trim().substr(0, 1);
        r[key] = r[key] || [];
        if (key == key) r[key].push(a);
        return r;
      }, Object.create(null));

      data.info = info;

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        esfm(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },

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
      let perfin = this.periodo_ini.split("-").join("");
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
      let perini = this.periodo_ini.split("-").join("");
      let perfin = this.periodo_fin.split("-").join("");
      var cuentaContable = this.form.ctacontab
        ? this.form.ctacontab.cod_puc
        : "0";

      return new Promise((res) => {
        post
          .postData({
            url: "Financiero/dlls/RpEstsitfin2J.dll",
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
            this.datarep = data;
            this.contenido = JSON.parse(JSON.stringify(data[0].BALANCE));
            let activos = 0;
            let pasivos = 0;
            let patrimonio = 0;

            this.contenido.forEach((item, index) => {
              let nivel = item.NIVEL.trim();
              if (nivel === "1") {
                activos = parseFloat(item.saldo_excel).toFixed(2);
              }
              if (nivel === "2") {
                pasivos = parseFloat(item.saldo_excel).toFixed(2);
              }
              if (nivel === "3") {
                patrimonio = parseFloat(item.saldo_excel).toFixed(2);
              }
            });
            let neto = parseFloat(activos - pasivos - patrimonio).toFixed(2);
            neto = neto.replace(/\-/g, "");
            if (neto === "0.00") {
              console.log("descuadre", neto);
            } else {
              this.mensaje = 1;
            }
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

    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];
      let perini = this.periodo_ini;
      let perfin = this.periodo_fin;
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.ant_excel = parseFloat(el.ant_excel.replace(/\,/g, "")) || 0;
        copia.deb_excel = parseFloat(el.deb_excel.replace(/\,/g, "")) || 0;
        copia.cre_excel =
          parseFloat(el.cre_excel.replace(/\,/g, "").trim()) || 0;
        copia.saldo_excel = parseFloat(el.saldo_excel.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Cuenta",
          value: "CTAPUC",
          format: "string",
        },
        {
          title: "Descripción",
          value: "DESCRIPCION",
          format: "string",
        },
        {
          title: "Saldo Anterior",
          value: "ant_excel",
          format: "money",
        },

        {
          title: "Debitos",
          value: "deb_excel",
          format: "money",
        },
        {
          title: "Créditos",
          value: "cre_excel",
          format: "money",
        },
        {
          title: "Saldo",
          value: "saldo_excel",
          format: "money",
        },
      ];

      let header_format = [
        {
          text: "BALANCE DE PRUEBA",
          bold: true,
          size: 16,
        },
        `Periodo Inicial:${perini}`,
        `Periodo Final:${perfin}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Balance de Prueba",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `BALANCE DE PRUEBA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    formatNumero2: function (val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: ".",
        min: -999999999999,
      });

      mask.resolve(val.toString());
      return mask.value;
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
    get_mes(id) {
      var meses = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        10: "Octubre",
        11: "Noviembre",
        12: "Diciembre",
      };

      return meses[id];
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

// function imprimir_pdf() {
//   var impresion = window.open("test_titulo", "_blank");
//   impresion.document.write(
//     `<style>${document.getElementById("css_estados").innerHTML}</style>`
//   );
//   impresion.document.write(
//     document.getElementById("impresion_estados").innerHTML
//   );
//   setTimeout(() => {
//     impresion.document.close();
//     impresion.focus();
//     impresion.print();
//     impresion.close();
//     reset_impresion();
//   }, 500);
// }

// function reset_impresion() {
//   // console.log('Reset')
//   document
//     .getElementById("activos_table")
//     .getElementsByTagName("tbody")[0].innerHTML = "";
//   document
//     .getElementById("pasivos_table")
//     .getElementsByTagName("tbody")[0].innerHTML = "";
//   // document
//   //   .getElementById("ingresos_table")
//   //   .getElementsByTagName("tbody")[0].innerHTML = "";

//   document.getElementsByClassName("firma1_footer")[0].innerHTML = "";
//   document.getElementsByClassName("cargo1_footer")[0].innerHTML = "";
//   document.getElementsByClassName("firma2_footer")[0].innerHTML = "";
//   document.getElementsByClassName("cargo2_footer")[0].innerHTML = "";
//   document.getElementsByClassName("firma3_footer")[0].innerHTML = "";
//   document.getElementsByClassName("cargo3_footer")[0].innerHTML = "";
// }
//xavier
// Array.prototype.insert = function (index, item) {
//   this.splice(index, 0, item);
// };
</script>
