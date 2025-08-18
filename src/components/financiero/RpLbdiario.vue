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
              <v-icon size="30" color="blue darken-4 ">mdi-abacus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Libro Diario
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
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
                      label="Periodo Corte"
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
                    { text: 'Mayor', value: 2 },
                    { text: 'Subcuenta', value: 3 },
                    { text: 'Auxiliar', value: 4 },
                  ]"
                  label="Nivel"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.nivel"
                  :error="errores.nivel"
                  @change="errores.nivel = false;"
                  required
                ></v-select>
              </v-col>
            </v-row>


          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="12">
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

                <!-- <v-btn
              color="red darken-1"
              class="white--text px-6"
              @click="get_reporte(1)"
              large
              depressed
            >
              Generar PDF
              <v-icon right dark>mdi-cloud-upload</v-icon>
            </v-btn> -->
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
  </v-layout>
</template>

<script>
import ExcelJS from "exceljs";
import post from "../../methods.js";
export default {
  data() {
    return {
      periodo_ini: this.$moment().format("YYYY-MM"),
      periodo_fin: this.$moment().format("YYYY-MM"),
      styleObject: { border: "2px solid #01579B" },
      condition: false,
      search: null,
      pickerPeriodoini: false,
      pickerPeriodofin: false,
      pickerCargue: false,
      pickerActual: false,
      datosctas: [],
      contenido: [],
      errores: {
        nivel: false,
        selcta: false,        
      },

      form: {
        nivel: "",
      },

      headers: [
      {
          text: "Fecha",
          align: "left",
          value: "FECHA",
          class: "white--text white blue darken-3",
        },
      {
          text: "Documento",
          align: "left",
          value: "DOCUMENTO",
          class: "white--text white blue darken-3",
        },
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
          text: "Débitos",
          align: "right",
          value: "DEBITOS",
          class: "white--text white blue darken-3",
        },
        {
          text: "  ",
          align: "right",
          value: "  ",
          class: "white--text white blue darken-3",
        },

        {
          text: "Creditos",
          align: "right",
          value: "CREDITOS",
          class: "white--text white blue darken-3",
        },
      ],

      loader: {
        card: false,
      },
      datosEmpresa: null,
    };
  },
  created() {
    this.cargarTablactas();
    this.get_empresa();
    // setTimeout(() => {
    //   this.format_pdf(
    //     JSON.parse(
    //       '[{"BALANCE":[{"NIVEL":"1      ","DESCRIPCION":"ACTIVO                                                      ","CTANIIF":"1    ","VALOR1":"   208,260,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"11     ","DESCRIPCION":"ACTIVO CORRIENTE                                            ","CTANIIF":"101  ","VALOR1":"   201,986,490.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"111    ","DESCRIPCION":"Efectivo y Equivalentes al Efectivo                         ","CTANIIF":"10101","VALOR1":"   201,986,490.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"1111   ","DESCRIPCION":"CAJA                                                        ","CTANIIF":"10101","VALOR1":"     1,986,490.00","VALOR2":"                 ","CTAPUC":"1105000000","NEGRILLA":"N "},{"NIVEL":"11111  ","DESCRIPCION":"CAJA GENERAL                                                ","CTANIIF":"10101","VALOR1":"     1,986,490.00","VALOR2":"                 ","CTAPUC":"1105050000","NEGRILLA":"N "},{"NIVEL":"111111 ","DESCRIPCION":"Caja Villavicencio                                          ","CTANIIF":"10101","VALOR1":"     1,986,490.00","VALOR2":"                 ","CTAPUC":"1105050101","NEGRILLA":"N "},{"NIVEL":"1111111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"10101","VALOR1":"-    1,430,000.00","VALOR2":"                 ","CTAPUC":"1105050101","NEGRILLA":"N "},{"NIVEL":"1111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"10101","VALOR1":"     3,416,490.00","VALOR2":"                 ","CTAPUC":"1105050101","NEGRILLA":"N "},{"NIVEL":"1111   ","DESCRIPCION":"BANCOS                                                      ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110000000","NEGRILLA":"N "},{"NIVEL":"11111  ","DESCRIPCION":"BANCOS NACIONALES                                           ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110050000","NEGRILLA":"N "},{"NIVEL":"111111 ","DESCRIPCION":"Bancolombia Ahorros 4715                                    ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110050101","NEGRILLA":"N "},{"NIVEL":"1111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110050101","NEGRILLA":"N "},{"NIVEL":"11T    ","DESCRIPCION":"Total ACTIVO CORRIENTE                                      ","CTANIIF":"     ","VALOR1":" 1,420,179,110.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"12     ","DESCRIPCION":"ACTIVO NO CORRIENTE                                         ","CTANIIF":"102  ","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"112    ","DESCRIPCION":"Cuentas Comerciales y Otras Cuentas por Cobrar              ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"1121   ","DESCRIPCION":"CLIENTES                                                    ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305000000","NEGRILLA":"N "},{"NIVEL":"11211  ","DESCRIPCION":"CLIENTES NACIONALES                                         ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305050000","NEGRILLA":"N "},{"NIVEL":"112111 ","DESCRIPCION":"Clientes                                                    ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305050101","NEGRILLA":"N "},{"NIVEL":"1121111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305050101","NEGRILLA":"N "},{"NIVEL":"12T    ","DESCRIPCION":"Total ACTIVO NO CORRIENTE                                   ","CTANIIF":"     ","VALOR1":"    37,642,080.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"2      ","DESCRIPCION":"PASIVO                                                      ","CTANIIF":"2    ","VALOR1":"-      547,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"21     ","DESCRIPCION":"PASIVO CORRIENTE                                            ","CTANIIF":"201  ","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"213    ","DESCRIPCION":"Beneficios a Empleados                                      ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"2131   ","DESCRIPCION":"SALARIOS POR PAGAR                                          ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505000000","NEGRILLA":"N "},{"NIVEL":"21311  ","DESCRIPCION":"SALARIOS                                                    ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505010000","NEGRILLA":"N "},{"NIVEL":"213111 ","DESCRIPCION":"Nominas por pagar                                           ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505010101","NEGRILLA":"N "},{"NIVEL":"2131111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505010101","NEGRILLA":"N "},{"NIVEL":"21T    ","DESCRIPCION":"Total PASIVO CORRIENTE                                      ","CTANIIF":"     ","VALOR1":"     6,000,000.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"22     ","DESCRIPCION":"PASIVO NO CORRIENTE                                         ","CTANIIF":"202  ","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"214    ","DESCRIPCION":"Impuestos Diferidos                                         ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"2141   ","DESCRIPCION":"IMPUESTO SOBRE LAS VENTAS POR PAGAR                         ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"2408000000","NEGRILLA":"N "},{"NIVEL":"21411  ","DESCRIPCION":"IVA GENERADO                                                ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"2408010000","NEGRILLA":"N "},{"NIVEL":"214111 ","DESCRIPCION":"Generado al 19%                                             ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"2408010119","NEGRILLA":"N "},{"NIVEL":"2141111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"20204","VALOR1":"-    1,001,680.00","VALOR2":"                 ","CTAPUC":"2408010119","NEGRILLA":"N "},{"NIVEL":"2141111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"20204","VALOR1":"-      545,490.00","VALOR2":"                 ","CTAPUC":"2408010119","NEGRILLA":"N "},{"NIVEL":"22T    ","DESCRIPCION":"Total PASIVO NO CORRIENTE                                   ","CTANIIF":"     ","VALOR1":"-    9,283,020.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"3      ","DESCRIPCION":"PATRIMONIO                                                  ","CTANIIF":"3    ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"31     ","DESCRIPCION":"Capital Social                                              ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"31 1   ","DESCRIPCION":"CAPITAL AUTORIZADO                                          ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105000000","NEGRILLA":"N "},{"NIVEL":"31 11  ","DESCRIPCION":"CAPITAL AUTORIZADO                                          ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105050000","NEGRILLA":"N "},{"NIVEL":"31 111 ","DESCRIPCION":"Acciones pagadas                                            ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105050101","NEGRILLA":"N "},{"NIVEL":"31 1111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105050101","NEGRILLA":"N "},{"NIVEL":"39     ","DESCRIPCION":"3105050101                                                  ","CTANIIF":"39999","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"4      ","DESCRIPCION":"INGRESOS                                                    ","CTANIIF":"4    ","VALOR1":"-    8,143,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"41     ","DESCRIPCION":"INGRESOS ACTIVIDADES ORDINARIAS                             ","CTANIIF":"401  ","VALOR1":"-    8,143,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"411    ","DESCRIPCION":"Ingresos por Ventas                                         ","CTANIIF":"40101","VALOR1":"-    8,143,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"4111   ","DESCRIPCION":"ACTIVIDADES EMPRESARIALES                                   ","CTANIIF":"40101","VALOR1":"-    8,462,000.00","VALOR2":"                 ","CTAPUC":"4155000000","NEGRILLA":"N "},{"NIVEL":"41111  ","DESCRIPCION":"ACTIVIDADES EMPRESARIALES DE CONSULTORIA                    ","CTANIIF":"40101","VALOR1":"-    8,462,000.00","VALOR2":"                 ","CTAPUC":"4155500000","NEGRILLA":"N "},{"NIVEL":"411111 ","DESCRIPCION":"Consultoria en Costos                                       ","CTANIIF":"40101","VALOR1":"-    8,462,000.00","VALOR2":"                 ","CTAPUC":"4155500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"40101","VALOR1":"-    5,272,000.00","VALOR2":"                 ","CTAPUC":"4155500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"40101","VALOR1":"-    3,190,000.00","VALOR2":"                 ","CTAPUC":"4155500101","NEGRILLA":"N "},{"NIVEL":"4111   ","DESCRIPCION":"DEVOLUCIONES Y DESCUENTOS                                   ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175000000","NEGRILLA":"N "},{"NIVEL":"41111  ","DESCRIPCION":"ACTIVIDADES DE CONSULTORIA                                  ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175500000","NEGRILLA":"N "},{"NIVEL":"411111 ","DESCRIPCION":"Descuentos                                                  ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"40101","VALOR1":"                 ","VALOR2":"                 ","CTAPUC":"4175500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175500101","NEGRILLA":"N "},{"NIVEL":"5      ","DESCRIPCION":"GASTOS                                                      ","CTANIIF":"5    ","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"519    ","DESCRIPCION":"5135350101                                                  ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"5191   ","DESCRIPCION":"SERVICIOS                                                   ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135000000","NEGRILLA":"N "},{"NIVEL":"51911  ","DESCRIPCION":"SERVICIOS                                                   ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135350000","NEGRILLA":"N "},{"NIVEL":"519111 ","DESCRIPCION":"SERVICIOS                                                   ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135350101","NEGRILLA":"N "},{"NIVEL":"5191111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135350101","NEGRILLA":"N "},{"NIVEL":"59     ","DESCRIPCION":"5135350101                                                  ","CTANIIF":"59999","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "}]},{"CIERRE":{"FIRMA1":"JAVIER FRANCO GONZALEZ        ","CARGO1":"Representante Legal           ","FIRMA2":"PILA CANO HERRERA             ","CARGO2":"Revisora Fiscal TP 147963-T   ","FIRMA3":"PAOLA ANDREA TELLO            ","CARGO3":"Contadora TP 182471-T         "}}]',
    //     ),
    //   )
    // }, 500)
  },
  methods: {
    format_pdf(data) {
      var $this = this;
      var balance = data[0].BALANCE;
      var info = balance.reduce((r, a) => {
        var key = a.NIVEL.trim().substr(0, 1);
        r[key] = r[key] || [];
        if (key == key) r[key].push(a);
        return r;
      }, Object.create(null));

      var fecha = this.periodo_cargue;
      var añoActual = parseInt(fecha.split("-")[0]);
      var añoAnterior = añoActual - 1;
      var mes = fecha.split("-")[1];
      var mesText = this.get_mes(mes);
      delete info["0"];

      var get_line = () => {
        return {
          canvas: [
            {
              type: "line",
              lineColor: "#01579b",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
            },
          ],
        };
      };

      var titulo = {
        margin: [0, 0, 0, 50],
        style: "titulo_main",
        text: [
          {
            text: "Estados",
            bold: true,
          },
          " de situación financiera",
        ],
      };

      var total_row = (descripcion, total1, total2, padding_top) => {
        return {
          margin: [0, padding_top ? 30 : 0, 0, 0],
          stack: [
            get_line(),
            {
              margin: [0, 5, 0, 5],
              columns: [
                {
                  width: "60%",
                  alignment: "right",
                  fontSize: 10,
                  bold: true,
                  color: "#ff5722",
                  text: descripcion,
                },
                {
                  width: "20%",
                  alignment: "right",
                  fontSize: 10,
                  bold: true,
                  text: this.formatNumero(total1.toFixed(2)),
                },
                {
                  width: "20%",
                  alignment: "right",
                  fontSize: 10,
                  bold: true,
                  text: this.formatNumero(total2.toFixed(2)),
                },
              ],
            },
          ],
        };
      };

      var content = [];

      var totales = {
        2019: {
          pasivo: 0,
          patrimonio: 0,
        },
        2020: {
          pasivo: 0,
          patrimonio: 0,
        },
      };

      Object.getOwnPropertyNames(info).forEach((el, index) => {
        var item = info[el];
        var stack = [];
        // stack.push(titulo);

        var total1 = 0;
        var total2 = 0;

        item.forEach((val) => {
          let nivel = val.NIVEL.trim();
          let padding = {
            left: nivel.length * 8,
            right: 0,
            top: 0,
            bottom: 0,
          };

          if (nivel.length === 1) {
            stack.push({
              style: "titulo",
              stack: [
                get_line(),
                {
                  margin: [0, 5, 0, 5],
                  columns: [
                    {
                      width: "60%",
                      text: val.DESCRIPCION.trim(),
                    },
                    {
                      width: "20%",
                      alignment: "center",
                      text: añoActual,
                    },
                    {
                      width: "20%",
                      alignment: "center",
                      text: añoAnterior,
                    },
                  ],
                },
                get_line(),
              ],
            });
          } else if (nivel.length === 2 && nivel.trim() !== "31") {
            stack.push({
              style: "titulo",
              margin: [padding.left, 10, padding.right, 0],
              text: val.DESCRIPCION.trim(),
            });
          } else {
            let valor1 = null;
            let valor2 = null;
            let valor3 = null;
            let valor4 = null;
            let total = false;

            padding.top = 2;
            padding.bottom = 2;
            if (nivel.length === 3 || nivel.trim() === "31") {
              if (
                nivel.substr(-1) === "T" ||
                nivel.substr(0, 1) === "3" ||
                nivel.substr(0, 1) === "4" ||
                nivel.substr(0, 1) === "5"
              ) {
                total1 +=
                  parseFloat(
                    val.VALOR1.toString().replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                total2 +=
                  parseFloat(
                    val.VALOR2.toString().replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;

                // if (nivel.substr(0, 1) !== "3") {
                total = true;
                stack.push(get_line());
                // }
              } else {
                padding.top = 15;
              }
              valor3 = val.VALOR1.toString().trim().replace(/ /g, "") || 0;
              valor4 = val.VALOR2.toString().trim().replace(/ /g, "") || 0;
            } else if (nivel.length === 4) {
              valor3 = val.VALOR1.toString().trim().replace(/ /g, "") || 0;
            } else {
              valor3 = val.VALOR1.toString().trim().replace(/ /g, "") || 0;
            }

            stack.push({
              margin: [0, padding.top, 0, padding.bottom],
              columns: [
                {
                  margin: [padding.left, 0, padding.right, 0],
                  width: "54%",
                  style: total ? "titulo" : null,
                  text: val.DESCRIPCION.trim(),
                },
                {
                  width: "3%",
                  alignment: "right",
                  text: valor1,
                },
                {
                  width: "3%",
                  alignment: "right",
                  text: valor2,
                },
                {
                  width: "20%",
                  alignment: "right",
                  bold: total,
                  text: valor3,
                },
                {
                  width: "20%",
                  alignment: "right",
                  bold: total,
                  text: valor4,
                },
              ],
            });
          }
        });

        let descripcion_nivel = item[0].DESCRIPCION.trim();
        // Add total
        // stack.push(total_row(`TOTAL ${descripcion_nivel}`, total1, total2));

        if (el == "2") {
          totales["2020"].pasivo = total1;
          totales["2019"].pasivo = total2;
        } else if (el == "3") {
          totales["2020"].patrimonio = total1;
          totales["2019"].patrimonio = total2;
        }

        // if (el == "3" || el == "5") {
        //   let label = null;
        //   let valor1 = 0;
        //   let valor2 = 0;

        //   if (el == "3") {
        //     label = "TOTAL PASIVOS + PATRIMONIO";
        //     valor1 = totales["2020"].pasivo + totales["2020"].patrimonio;
        //     valor2 = totales["2019"].pasivo + totales["2019"].patrimonio;
        //   } else if (el == "5") {
        //     label = "RESULTADO DEL EJERCICIO";
        //     valor1 = totales["2020"].pasivo - totales["2020"].patrimonio;
        //     valor2 = totales["2019"].pasivo - totales["2019"].patrimonio;
        //   }

        //   stack.push(total_row(label, valor1, valor2, true));
        // }

        console.log(
          index + 1 === Object.getOwnPropertyNames(info).length,
          index + 1,
          Object.getOwnPropertyNames(info).length
        );
        content.push({
          pageBreak:
            index + 1 === Object.getOwnPropertyNames(info).length ||
            index + 1 == 4 ||
            index + 1 == 5 ||
            index + 1 == 6 ||
            index + 1 == 7
              ? null
              : "after",
          stack,
        });
      });

      var _this = this;
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        var dd = {
          pageMargins: [40, 110, 40, 40],
          header: function (currentPage, pageCount, pageSize) {
            return [
              {
                margin: [40, 40, 40, 0],
                columns: [
                  {
                    stack: [
                      {
                        image: "logo",
                        fit: [70, 70],
                      },
                    ],
                  },
                  {
                    width: "80%",
                    style: "tituloHeader",
                    stack: [
                      {
                        text: _this.datosEmpresa.descrip_empr
                          .trim()
                          .toUpperCase(),
                      },
                      {
                        text: `Nit. ${parseInt(_this.datosEmpresa.id_empr)}`,
                      },
                      {
                        style: "titulo_main",
                        text: [
                          {
                            text: "Estados",
                            bold: true,
                          },
                          " de situación financiera",
                        ],
                      },
                      {
                        alignment: "center",
                        fontSize: 8,
                        margin: [200, 0, 0, 0],
                        text: `${mesText.toUpperCase()}`,
                      },
                    ],
                  },
                ],
              },
            ];
          },
          footer: function (currentPage, pageCount) {
            return {
              margin: [0, 0, 40, 0],
              alignment: "right",
              text: currentPage.toString() + " / " + pageCount,
            };
          },
          images: {
            logo,
          },
          content,
          defaultStyle: {
            fontSize: 8,
          },
          styles: {
            titulo: {
              color: "#ff5722",
              bold: true,
            },
            titulo_main: {
              fontSize: 14,
              color: "#01579b",
            },
            tituloHeader: {
              bold: true,
              fontSize: 14,
            },
          },
        };

        // console.log("content", JSON.stringify(content));
        pdfMake.createPdf(dd).open();
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
      let perfin = this.periodo_fin.split("-").join("");
      let anofin = perfin.substr(0, 4)
      if (anofin < 2000 ) {
        this.send_error("Error en Periodo");
      } else 
      {
        this.loader.card = true;
        this.contenido = [];
        var cuentaContable = this.form.ctacontab
          ? this.form.ctacontab.cod_puc
          : "0";

        var datos = {
          url: "Financiero/dlls/RpLbDiarioJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            perfin +
            "|" +
            this.form.nivel.value +            
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.loader.card = false;
            this.contenido = JSON.parse(JSON.stringify(data[0].BALANCE));
            // if (tipo == 1) this.format_pdf(data);
            // else this.format_excel(data);
          })
          .catch((error) => {
            console.error(error);
            this.loader.card = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al consultar reporte",
              estado: true,
            });
          });
      }
    },
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];
      let perini = this.periodo_ini;
      let perfin = this.periodo_fin;
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.DEBITOS = parseFloat(el.DEBITOS.replace(/\,/g, "")) || 0;
        copia.CREDITOS = parseFloat(el.CREDITOS.replace(/\,/g, "")) || 0;
        data_parse.push(copia);
      });

      let columnas = [
      {
          title: "Fecha",
          value: "FECHA",
          format: "date",
        },

        {
          title: "Documento",
          value: "DOCUMENTO",
          format: "string",
        },
        {
          title: "Cuenta",
          value: "CTAPUC",
        },
        {
          title: "Descripcion",
          value: "DESCRIPCION",
          format: "string",
        },

        {
          title: "Debitos",
          value: "DEBITOS",
          format: "money",
        },
        {
          title: "Créditos",
          value: "CREDITOS",
          format: "money",
        },
      ];

      let header_format = [
        {
          text: "LIBRO DIARIO",
          bold: true,
          size: 16,
        },
        `Periodo Corte:${perfin}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Libro Diario",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `LIBRO DIARIO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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

function imprimir_pdf() {
  var impresion = window.open("test_titulo", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_estados").innerHTML}</style>`
  );
  impresion.document.write(
    document.getElementById("impresion_estados").innerHTML
  );
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  // console.log('Reset')
  document
    .getElementById("activos_table")
    .getElementsByTagName("tbody")[0].innerHTML = "";
  document
    .getElementById("pasivos_table")
    .getElementsByTagName("tbody")[0].innerHTML = "";
  // document
  //   .getElementById("ingresos_table")
  //   .getElementsByTagName("tbody")[0].innerHTML = "";

  document.getElementsByClassName("firma1_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo1_footer")[0].innerHTML = "";
  document.getElementsByClassName("firma2_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo2_footer")[0].innerHTML = "";
  document.getElementsByClassName("firma3_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo3_footer")[0].innerHTML = "";
}
//xavier
// Array.prototype.insert = function (index, item) {
//   this.splice(index, 0, item);
// };
</script>
