<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2" :loading="loader.card">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-fast-forward-5</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Estado Cambios en el Patrimonio</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                      label="Periodo"
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
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-2"
              class="white--text px-6"
              large
              @click="get_reporte(2)"
              depressed
            >
              Generar Excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
            <v-btn 
              color="red darken-2" 
              class="white--text px-6" 
              @click="get_reporte(1)" 
              large 
              depressed
            >
              Generar PDF
              <v-icon right dark>mdi-pdf-box</v-icon>
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
    <div id="impresion_estados">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <!-- <div id="page_activos">
        <div class="titulo_doc">
          <b>Estados</b>
          de situación financiera
        </div>
        <table id="activos_table">
          <tbody></tbody>
        </table>
      </div> -->
      <!-- <div id="page_pasivos">
        <div class="titulo_doc">
          <b>Estados</b>
          de situación financiera
        </div>
        <table id="pasivos_table">
          <tbody></tbody>
        </table>
      </div> -->
      <div id="page_ingresos">
        <div class="titulo_doc">
          <b>Estados</b>
          de resultados integrales
        </div>
        <table id="ingresos_table">
          <tbody></tbody>
        </table>
      </div>
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
      periodo_cargue: this.$moment().format("YYYY-MM"),
      condition: false,
      search: null,
      pickerPeriodo: false,
      pickerCargue: false,
      pickerActual: false,
      datosctas: [],
      empresa: {},
      form: [],
      headers: [{ text: "Opciones", value: "edit", align: "center" }],
      loader: {
        card: false
      }
    };
  },
  created() {
    this.cargarTablactas();
    this.infoEmpresa();
  },
  methods: {
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        });
    },
    generar_pdf(data){
      var _this = this;
      var totalSaldo = 
        (parseFloat(data.saldoinicial[0].capital.replace(/\,/g, ""))||0) + 
        (parseFloat(data.saldoinicial[0].reservas.replace(/\,/g, ""))||0) + 
        (parseFloat(data.saldoinicial[0].resacum.replace(/\,/g, ""))||0) + 
        (parseFloat(data.saldoinicial[0].resejer.replace(/\,/g, ""))||0);
      var totalMov = 
        (parseFloat(data.movimientos[0].capital.replace(/\,/g, ""))||0) + 
        (parseFloat(data.movimientos[0].reservas.replace(/\,/g, ""))||0) + 
        (parseFloat(data.movimientos[0].resacum.replace(/\,/g, ""))||0) + 
        (parseFloat(data.movimientos[0].resejer.replace(/\,/g, ""))||0);
      var totalRes = 
        (parseFloat(data.resultado[0].capital.replace(/\,/g, ""))||0) + 
        (parseFloat(data.resultado[0].reservas.replace(/\,/g, ""))||0) + 
        (parseFloat(data.resultado[0].resacum.replace(/\,/g, ""))||0) + 
        (parseFloat(data.resultado[0].resejer.replace(/\,/g, ""))||0);

      var sumCapital =
        (parseFloat(data.saldoinicial[0].capital.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].capital.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].capital.replace(/\,/g, ""))||0);
      var sumReservas =
        (parseFloat(data.saldoinicial[0].reservas.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].reservas.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].reservas.replace(/\,/g, ""))||0);
      var sumResacum = 
        (parseFloat(data.saldoinicial[0].resacum.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].resacum.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].resacum.replace(/\,/g, ""))||0);
      var sumResejer = 
        (parseFloat(data.saldoinicial[0].resejer.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].resejer.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].resejer.replace(/\,/g, ""))||0);

      var totalSumas = sumCapital + sumReservas + sumResacum + sumResejer;

      var margin = {
        left: 40,
        right: 40,
        top: 40,
        bottom: 0,
      };

      var getLineBlue = () => {
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

      var getLineRed = () => {
        return {
          canvas: [
            {
              type: "line",
              lineColor: "#ff0000",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
            },
          ],
        };
      };

      var getLineGreen = () => {
        return {
          canvas: [
            {
              type: "line",
              lineColor: "#228B22",
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
        style: "titulo_main"
      };

      var contPdf = [
        {
          margin: [margin.left, 0, 0, 0],
          stack: [
            //get_line(),
            {
              margin: [310, 5, 0, 0],
              fontSize: 9,
              bold: true,
              italics: true,
              text: "en pesos",
            },
            {
              table: {
                headerRows: 1,
                widths: [130,"*","*","*","*","*"],
                body: [
                  [
                    {},
                    {
                      border: [false, true, false, false],
                      bold: true,
                      alignment: "center",
                      fontSize: 9,
                      text: "Capital suscrito y pagado",
                    },
                    {
                      border: [false, true, false, false],
                      bold: true,
                      alignment: "center",
                      fontSize: 9,
                      text: "Reservas",
                    },
                    {
                      border: [false, true, false, false],
                      bold: true,
                      alignment: "center",
                      fontSize: 9,
                      text: "Resultados Acumulados",
                    },
                    {
                      border: [false, true, false, false],
                      bold: true,
                      alignment: "center",
                      fontSize: 9,
                      text: "Resultado del Ejercicio",
                    },
                    {
                      border: [false, true, false, false],
                      bold: true,
                      alignment: "center",
                      fontSize: 9,
                      text: "Total",
                    },
                  ],
                  [getLineGreen(),{},{},{},{},{}],
                  [
                    {
                      alignment: "left",
                      fontSize: 9,
                      bold: true,
                      color: "#228B22",
                      text: "Saldo a " + _this.get_mes(_this.periodo_cargue.substr(5,2)) + "/" + _this.periodo_cargue.substr(0,4),
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.saldoinicial[0].capital,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.saldoinicial[0].reservas,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.saldoinicial[0].resacum,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.saldoinicial[0].resejer,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(totalSaldo),
                    },
                  ],
                  [getLineGreen(),{},{},{},{},{}],
                  [
                    {
                      alignment: "left",
                      fontSize: 9,
                      text: "Movimientos del periodo",
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.movimientos[0].capital,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.movimientos[0].reservas,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.movimientos[0].resacum,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.movimientos[0].resejer,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(totalMov),
                    },
                  ],
                  [getLineGreen(),{},{},{},{},{}],
                  [
                    {
                      alignment: "left",
                      fontSize: 9,
                      text: "Resultado del periodo",
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.resultado[0].capital,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.resultado[0].reservas,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.resultado[0].resacum,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: data.resultado[0].resejer,
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(totalRes),
                    },
                  ],
                  [getLineRed(),{},{},{},{},{}],
                  [
                    {
                      alignment: "left",
                      fontSize: 9,
                      bold: true,
                      color: "#228B22",
                      text: "Saldo a mes anterior",
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(sumCapital),
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(sumReservas),
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(sumResacum),
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(sumResejer),
                    },
                    {
                      alignment: "right",
                      fontSize: 9,
                      text: _this.formatNumero(totalSumas),
                    },
                  ],
                ],
              },
              layout: {
                defaultBorder: false,
              },
            },
          ],
        },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo)=>{
        var dd = {
          pageMargins: [0, 110, 40, 40],
          header: function(currentPage, pageCount, pageSize){
            return [
              {
                margin: [margin.left, margin.top, margin.right, margin.bottom],
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
                        text: _this.empresa.descrip_empr.trim().toUpperCase(),
                      },
                      {
                        text: `Nit. ${_this.formatNumero(parseInt(_this.empresa.id_empr))}`,
                      },
                      {
                        style: "titulo_main",
                        text: "Estados de cambios en el patrimonio",
                      },
                      {
                        alignment: "center",
                        fontSize: 8,
                        italics: true,
                        margin: [30,0,0,0],
                        text: `${_this.get_mes(_this.periodo_cargue.substr(5.2))} / ${_this.periodo_cargue.substr(0,4)}`,
                      },
                    ],
                  },
                ],
              },
            ];
          }, 
          content: contPdf,
          footer: function(currentPage, pageCount){
            return {
              margin: [0, 0, 40, 0],
              alignment: "right",
              text: currentPage.toString() + " / " + pageCount,
            };
          },
          images: {
            logo,
          },
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
        pdfMake.createPdf(dd).open();
      });

    },
    generar_excel(data) {
      var _this = this;
      var totalSaldo = 
        (parseFloat(data.saldoinicial[0].capital.replace(/\,/g, ""))||0) + 
        (parseFloat(data.saldoinicial[0].reservas.replace(/\,/g, ""))||0) + 
        (parseFloat(data.saldoinicial[0].resacum.replace(/\,/g, ""))||0) + 
        (parseFloat(data.saldoinicial[0].resejer.replace(/\,/g, ""))||0);
      var totalMov = 
        (parseFloat(data.movimientos[0].capital.replace(/\,/g, ""))||0) + 
        (parseFloat(data.movimientos[0].reservas.replace(/\,/g, ""))||0) + 
        (parseFloat(data.movimientos[0].resacum.replace(/\,/g, ""))||0) + 
        (parseFloat(data.movimientos[0].resejer.replace(/\,/g, ""))||0);
      var totalRes = 
        (parseFloat(data.resultado[0].capital.replace(/\,/g, ""))||0) + 
        (parseFloat(data.resultado[0].reservas.replace(/\,/g, ""))||0) + 
        (parseFloat(data.resultado[0].resacum.replace(/\,/g, ""))||0) + 
        (parseFloat(data.resultado[0].resejer.replace(/\,/g, ""))||0);

      var sumCapital =
        (parseFloat(data.saldoinicial[0].capital.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].capital.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].capital.replace(/\,/g, ""))||0);
      var sumReservas =
        (parseFloat(data.saldoinicial[0].reservas.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].reservas.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].reservas.replace(/\,/g, ""))||0);
      var sumResacum = 
        (parseFloat(data.saldoinicial[0].resacum.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].resacum.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].resacum.replace(/\,/g, ""))||0);
      var sumResejer = 
        (parseFloat(data.saldoinicial[0].resejer.replace(/\,/g, ""))||0) +
        (parseFloat(data.movimientos[0].resejer.replace(/\,/g, ""))||0) +
        (parseFloat(data.resultado[0].resejer.replace(/\,/g, ""))||0);

      var totalSumas = sumCapital + sumReservas + sumResacum + sumResejer;

      var workbook = new ExcelJS.Workbook();
      var worksheet = workbook.addWorksheet("Estados de cambio en el Patrimonio");
      worksheet.columns = [
        { key: "nivel", hidden: true},
        { key: "col1", header: "Estados de cambio en el patrimonio"},
        { key: "col2", header: ""},
        { key: "col3", header: ""},
        { key: "col4", header: ""},
        { key: "col5", header: ""},
        { key: "col6", header: ""},
      ];

      var fila1 = {
        col1: "  ",
        col2: "Capital suscrito y pagado",
        col3: "Reservas",
        col4: "Resultados Acumulados",
        col5: "Resultado del Eejercicio",
        col6: "Total",
      };

      var fila2 = {
        col1: "Saldo a " + _this.get_mes(_this.periodo_cargue.substr(5,2)) + " / " + _this.periodo_cargue.substr(0,4),
        col2: parseFloat(data.saldoinicial[0].capital.replace(/\,/g, "")),
        col3: parseFloat(data.saldoinicial[0].reservas.replace(/\,/g, "")),
        col4: parseFloat(data.saldoinicial[0].resacum.replace(/\,/g, "")),
        col5: parseFloat(data.saldoinicial[0].resejer.replace(/\,/g, "")),
        col6: totalSaldo,
      };

      var fila3 = {
        col1: "Movimientos del periodo ",
        col2: parseFloat(data.movimientos[0].capital.replace(/\,/g, "")),
        col3: parseFloat(data.movimientos[0].reservas.replace(/\,/g, "")),
        col4: parseFloat(data.movimientos[0].resacum.replace(/\,/g, "")),
        col5: parseFloat(data.movimientos[0].resejer.replace(/\,/g, "")),
        col6: totalMov,
      };

      var fila4 = {
        col1: "Resultado del periodo ",
        col2: parseFloat(data.resultado[0].capital.replace(/\,/g, "")),
        col3: parseFloat(data.resultado[0].reservas.replace(/\,/g, "")),
        col4: parseFloat(data.resultado[0].resacum.replace(/\,/g, "")),
        col5: parseFloat(data.resultado[0].resejer.replace(/\,/g, "")),
        col6: totalRes,
      };

      var fila5 = {
        col1: "Saldo a mes anterior",
        col2: sumCapital,
        col3: sumReservas,
        col4: sumResacum,
        col5: sumResejer,
        col6: totalSumas,
      };

      worksheet.addRow(fila1);
      worksheet.addRow(fila2);
      worksheet.addRow(fila3);
      worksheet.addRow(fila4);
      worksheet.addRow(fila5);

      worksheet.eachRow(function (row, rowNumber) {
        var nivel = row.values[1];
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          if (row._number == 1) {
            cell.font = {
              bold: true,
              size: 24,
              color: { argb: "FF808080" },
            };
            row.height = 50;
          }else{
            if (cell._column._key == "col1"){
              if(row._number == 3 || row._number == 6){
                cell.font = {
                  bold: true,
                  color: { argb: "FF228B22" },
                };
              }
            }else{
              cell.numFmt = "$#,##0.00;[Red]-$#,##0.00";
            }
            
            if(row._number == 6){
              cell.border = {
                top: {style: "medium", color: {argb: "ffff0000"}},
              };
            }else{
              cell.border = {
                top: {style: "medium", color: {argb: "ff228b22"}},
                bottom: {style: "medium", color: {argb: "ff228b22"}},
              };
            }
          }
        });
      });

      worksheet.columns.forEach((column) => {
        var width = 0;
        column.eachCell({ includeEmpty: false }, (cell) => {
          let actual = cell.value ? (cell.value.length || 10) + 5 : 10;
          width = actual > width ? actual : width;
        });

        column.width = width;
      });

      worksheet.views = [
        {
          showGridLines: false,
        }
      ];

      writexlsx().then(()=>{
        console.log("Impresión terminada");
      });

      async function writexlsx(){
        await workbook.xlsx.writeBuffer().then((data)=>{
          var blob = new Blob([data],{
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `ECP-${new Date().getTime()}.xlsx`;
          anchor.click();
          window.URL.revokeObjectURL(url);
        });
      }
      
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    cargarTablactas: function() {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: ""
        })
        .then(data => {
          this.datosctas = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true
          });
        });
    },
    get_reporte(formatoImpresion) {
      this.loader.card = true;
      var periodo = this.periodo_cargue.replace(/\-/g, "");
      post
        .postData({
          url: "Financiero/dlls/RpEstcambiosJ.dll",
          data: sessionStorage.Sesion + "|" + periodo,
          method: "",
        })
        .then((data) => {
          this.loader.card = false;
          if (formatoImpresion === 1){
            this.generar_pdf(data[0].Datos);
          }else{
            this.generar_excel(data[0].Datos);
          }
        })
        .catch((err) => {
          console.error("error", err);
          this.loader.card = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar estado",
            estado: true
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
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre"
      };

      return meses[id];
    },
    formatNumero: function(val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: ".",
        min: -999999999999
      });

      mask.resolve(val.toString());
      return mask.value;
    }
  }
};

/*function imprimir_pdf() {
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
  }, 1000);
}*/

/*function reset_impresion() {
  document
    .getElementById("activos_table")
    .getElementsByTagName("tbody")[0].innerHTML = "";
  document
    .getElementById("pasivos_table")
    .getElementsByTagName("tbody")[0].innerHTML = "";
  document
    .getElementById("ingresos_table")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  document.getElementsByClassName("firma1_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo1_footer")[0].innerHTML = "";
  document.getElementsByClassName("firma2_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo2_footer")[0].innerHTML = "";
  document.getElementsByClassName("firma3_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo3_footer")[0].innerHTML = "";
}*/
</script>
