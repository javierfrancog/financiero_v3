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
              <v-icon size="30" color="blue darken-4 "
                >mdi-circle-multiple</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Informe por Centro de Costo</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
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
                      v-model="form.fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_ini"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-menu
                  v-model="pickerPeriodoFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha_fin"
                      label="Fecha Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_fin"
                    no-title
                    scrollable
                    @input="pickerPeriodoFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
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
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
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
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="4"
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
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Centro de costos"
                  v-model="form.ccosto"
                  :items="tablaccosto"
                  :item-text="format_ccosto"
                  hide-details
                  return-object
                  outlined
                  :error="error.ccosto"
                  @change="error.ccosto = false"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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
              class="white--text px-6"
              @click="get_reporte(2)"
              large
              depressed
            >
              Generar EXCEL
              <v-icon right dark>mdi-cloud-upload</v-icon>
            </v-btn>
            <div>
              <v-btn
                color="primary"
                class="ma-2 white--text px-12 d-flex justify-end"
                large
                depressed
                @click="cargaranexos"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Descargar Anexos
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </div>
          </v-card-actions>
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
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      fecha_fin: this.$moment().format("YYYY-MM-DD"),
      condition: false,
      search: null,
      pickerPeriodo: false,
      pickerPeriodoFinal: false,
      pickerCargue: false,
      pickerActual: false,
      datosctas: [],
      form: [],
      tablaccosto: [],
      headers: [{ text: "Opciones", value: "edit", align: "center" }],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      loader: {
        card: false,
      },
      error: {
        ccosto: false,
      },

      datosEmpresa: null,
    };
  },
  created() {
    this.cargarTablactas();
    this.get_empresa();
    this.cargarTablaccostos();
  },
  methods: {
    format_excel(data) {
      console.log(this.form.fecha_ini)
      var fecha = this.form.fecha_ini;
      var fechafin = this.form.fecha_fin;      

      var anoActual = parseInt(fecha.split("-")[0]);
      var anoAnterior = anoActual - 1;
      var balance = data[0].BALANCE;
      var ccosto = this.form.ccosto.descrip_cost.trim();
      var workbook = new ExcelJS.Workbook();
      var worksheet = workbook.addWorksheet("Movimiento por Centro de Costos");
      worksheet.columns = [
        { key: "nivel", hidden: true },
        { key: "cta_puc", header: "" },
        { key: "columna1", header: "Movimiento por Centro de Costos" },
        { key: "columna2", header: "Periodo Inicial: " + "_" + fecha + "Periodo Final:" +fechafin},
        { key: "columna3", header: "Centro de Costo:" + ccosto },
        { key: "columna4", header: "" },
        { key: "columna5", header: "" },
      ];

      var totales = {
        4: {
          activos: 0,
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
        3: {
          activos: 0,
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
        2: {
          activos: 0,
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
        1: {
          activos: 0,
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
      };

      var count = {
        activos: 0,
        pasivos: 0,
      };

      var balance_old = JSON.parse(JSON.stringify(balance));
      let nivel_anterior = "";
      balance_old.forEach((item, i) => {
        let nivel = item.NIVEL.trim();
        let nivel_actual = nivel.substr(0, 1);

        if (nivel.substr(0, 1) == "1" && nivel.substr(-1) == "T") {
          count.activos++;
          totales["1"].activos +=
            parseFloat(item.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")) ||
            0;
          totales["2"].activos +=
            parseFloat(item.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["3"].activos +=
            parseFloat(item.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["4"].activos +=
            parseFloat(item.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;

          if (count.activos == 2) {
            balance.insert(i + 1, {
              NIVEL: "99T",
              DESCRIPCION: "TOTAL ACTIVO",
              // SDO_ANTER: this.formatNumero2(totales["1"].activos.toFixed(2)),
              DEBITOS: this.formatNumero2(totales["2"].activos.toFixed(2)),
              CREDITOS: this.formatNumero2(totales["3"].activos.toFixed(2)),
              SALDO: this.formatNumero2(totales["4"].activos.toFixed(2)),
            });
            balance.insert(i + 2, {
              NIVEL: "99T",
              DESCRIPCION: "",
              // SDO_ANTER: "",
              DEBITOS: "",
              CREDITOS: "",
              SALDO: "",
            });
          }
        } else if (nivel.substr(0, 1) == "2" && nivel.substr(-1) == "T") {
          count.pasivos++;
          totales["1"].pasivo +=
            parseFloat(item.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")) ||
            0;
          totales["2"].pasivo +=
            parseFloat(item.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["3"].pasivo +=
            parseFloat(item.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["4"].pasivo +=
            parseFloat(item.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;

          if (count.pasivos == 2) {
            balance.insert(i + 3, {
              NIVEL: "99T",
              DESCRIPCION: "TOTAL PASIVO",
              // SDO_ANTER: this.formatNumero2(totales["1"].pasivo.toFixed(2)),
              DEBITOS: this.formatNumero2(totales["2"].pasivo.toFixed(2)),
              CREDITOS: this.formatNumero2(totales["3"].pasivo.toFixed(2)),
              SALDO: this.formatNumero2(totales["4"].pasivo.toFixed(2)),
            });
            balance.insert(i + 4, {
              NIVEL: "99T",
              DESCRIPCION: "",
              // SDO_ANTER: "",
              DEBITOS: "",
              CREDITOS: "",
              SALDO: "",
            });
          }
          // } else if (nivel.length === 3 && nivel.substr(0, 1) == "3") {
        } else {
          console.log("patrimonio")
        //   nivel.length === 3 &&
        //   nivel_anterior == "3" &&
        //   nivel_actual == nivel_anterior
        // ) {
        //   totales["1"].patrimonio +=
        //     parseFloat(item.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")) ||
        //     0;
        //   totales["2"].patrimonio +=
        //     parseFloat(item.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
        //   totales["3"].patrimonio +=
        //     parseFloat(item.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
        //   totales["4"].patrimonio +=
        //     parseFloat(item.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;
        // } else if (nivel_actual == 9) {
        //   balance.insert(i + 4, {
        //     NIVEL: "99T",
        //     DESCRIPCION: "TOTAL PATRIMONIO",
        //     // SDO_ANTER: this.formatNumero2(totales["1"].patrimonio.toFixed(2)),
        //     DEBITOS: this.formatNumero2(totales["2"].patrimonio.toFixed(2)),
        //     CREDITOS: this.formatNumero2(totales["3"].patrimonio.toFixed(2)),
        //     SALDO: this.formatNumero2(totales["4"].patrimonio.toFixed(2)),
        //   });

          // balance.insert(i + 5, {
          //   NIVEL: "99T",
          //   DESCRIPCION: "TOTAL PASIVOS + PATRIMONIO",
          //   SDO_ANTER: this.formatNumero2(
          //     totales["1"].patrimonio + totales["1"].pasivo
          //   ),
          //   DEBITOS: this.formatNumero2(
          //     totales["2"].patrimonio + totales["2"].pasivo
          //   ),
          //   CREDITOS: this.formatNumero2(
          //     totales["3"].patrimonio + totales["3"].pasivo
          //   ),
          //   SALDO: this.formatNumero2(
          //     totales["4"].patrimonio + totales["4"].pasivo
          //   ),
          // });

          // balance.insert(i + 6, {
          //   NIVEL: "99T",
          //   DESCRIPCION: "",
          //   // SDO_ANTER: "",
          //   DEBITOS: "",
          //   CREDITOS: "",
          //   SALDO: "",
          }
         if (nivel.substr(0, 1) > "3" && nivel.length == 2) {
              if (nivel.substr(0, 1) == "4") {

          totales["1"].resultado +=
            parseFloat(item.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")) ||
            0;
          totales["2"].resultado +=
            parseFloat(item.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["3"].resultado +=
            parseFloat(item.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["4"].resultado +=
            parseFloat(item.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;

              } else {
          totales["1"].resultado -=
            parseFloat(item.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")) ||
            0;
          totales["2"].resultado -=
            parseFloat(item.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["3"].resultado -=
            parseFloat(item.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
          totales["4"].resultado -=
            parseFloat(item.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;
              }






        //   totales["1"].resultado +=
        //     parseFloat(item.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")) ||
        //     0;
        //   totales["2"].resultado +=
        //     parseFloat(item.DEBITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
        //   totales["3"].resultado +=
        //     parseFloat(item.CREDITOS.replace(/\,/g, "").replace(/ /g, "")) || 0;
        //   totales["4"].resultado +=
        //     parseFloat(item.SALDO.replace(/\,/g, "").replace(/ /g, "")) || 0;
        // }

        nivel_anterior = nivel.substr(0, 1);
      }});

      balance.push({
        NIVEL: "99T",
        DESCRIPCION: "RESULTADO DEL EJERCICIO",
        // SDO_ANTER: this.formatNumero2(totales["1"].resultado.toFixed(2)),
        DEBITOS: this.formatNumero2(totales["2"].resultado.toFixed(2)),
        CREDITOS: this.formatNumero2(totales["3"].resultado.toFixed(2)),
        SALDO: this.formatNumero2(totales["4"].resultado.toFixed(2)),
      });

      balance.forEach((item, i) => {
        let columna1 = item.DESCRIPCION.trim();
        // let columna2 =
        //   parseFloat(item.SDO_ANTER.replace(/  +/g, "").replace(/\,/g, "")) ||
        //   0;
        let columna3 =
          parseFloat(
            item.DEBITOS.toString().replace(/  +/g, "").replace(/\,/g, "")
          ) || 0;
        let columna4 =
          parseFloat(
            item.CREDITOS.toString().replace(/  +/g, "").replace(/\,/g, "")
          ) || 0;
        let columna5 =
          parseFloat(
            item.SALDO.toString().replace(/  +/g, "").replace(/\,/g, "")
          ) || 0;

        let nivel = item.NIVEL.trim();

        if (nivel.length == 1) {
          // columna2 = "Saldo inicial";
          columna3 = "Débitos";
          columna4 = "Créditos";
          columna5 = "Neto Movimiento";
        } else if (nivel.length == 2) {
          // columna2 = null;
          columna3 = null;
          columna4 = null;
          columna5 = null;
        }

        columna1 = columna1.padStart(columna1.length + nivel.length * 4);

        var obj = {
          nivel,
          cta_puc: parseInt(item.CTAPUC) != 0 ? item.CTAPUC : "",
          idrut: parseInt(item.CTAPUC) != 0 ? item.CTAPUC : "",
          columna1,
          // columna2,
          columna3,
          columna4,
          columna5,
        };

        if (nivel.substring(0, 1) != "0") {
          worksheet.addRow(obj);
        }
      });

      worksheet.eachRow(function (row, rowNumber) {
        var nivel = row.values[1];
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          if (
            // cell._column._key == "columna2" ||
            cell._column._key == "columna3" ||
            cell._column._key == "columna4" ||
            cell._column._key == "columna5"
          ) {
            cell.numFmt = "$#,##0.00;[Red]-$#,##0.00";
          }

          if (row._number == 1) {
            if (cell._address == "B1") {
              cell.font = {
                bold: true,
                size: 24,
                color: { argb: "FF808080" },
              };
              row.height = 50;
            } else {
              cell.font = {
                bold: true,
                size: 12,
                color: { argb: "FF808080" },
              };
              row.height = 50;
            }
          }

          if (nivel && nivel.length == 1) {
            cell.font = {
              bold: true,
            };

            cell.border = {
              top: { style: "medium", color: { argb: "FF228B22" } },
              // left: { style: "thin" },
              bottom: { style: "medium", color: { argb: "FF228B22" } },
              // right: { style: "thin" },
            };

            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else if (nivel && nivel.length == 2) {
            cell.font = {
              bold: true,
              color: { argb: "FF228B22" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            row.height = 40;
          } else if (nivel && nivel.substr(-1) == "T") {
            if (nivel.substr(0, 1) == "9") {
              cell.border = {
                top: { style: "medium", color: { argb: "FF00BFFF" } },
              };
            } else {
              cell.border = {
                top: { style: "medium", color: { argb: "FFFF8C00" } },
              };
            }

            if (cell._column._key == "columna1") {
              cell.font = {
                bold: true,
                color: { argb: "FF228B22" },
              };

              if (nivel.substr(0, 1) == "9")
                cell.alignment = { vertical: "middle", horizontal: "right" };
              else
                cell.alignment = { vertical: "middle", horizontal: "center" };
            } else {
              cell.font = {
                bold: true,
              };
              cell.alignment = { vertical: "middle", horizontal: "right" };
            }

            if (!row.values[3].toString().trim()) row.hidden = true;
            row.height = 30;
          } else {
            if (cell._column._key != "columna1")
              cell.alignment = { vertical: "middle", horizontal: "right" };
          }
        });
      });

      worksheet.columns.forEach((column) => {
        var width = 0;
        column.eachCell({ includeEmpty: false }, (cell) => {
          let mayor = cell.value ? (cell.value.length || 10) + 5 : 10;
          if (mayor > width) width = mayor;
        });

        column.width = width;
      });

      worksheet.views = [
        {
          showGridLines: false,
        },
      ];

      writexlsx().then(() => {
        console.log("Impresion terminada");
      });

      async function writexlsx() {
        await workbook.xlsx.writeBuffer().then((data) => {
          var blob = new Blob([data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `${new Date().getTime()}.xlsx`;
          anchor.click();
          window.URL.revokeObjectURL(url);
        });
      }
    },
    format_pdf(data) {
      var $this = this;
      var balance = data[0].BALANCE;
      var info = balance.reduce((r, a) => {
        var key = a.NIVEL.trim().substr(0, 1);
        r[key] = r[key] || [];
        if (key == key) r[key].push(a);
        return r;
      }, Object.create(null));

      var fecha = this.fecha_ini;
      var añoActual = parseInt(fecha.split("-")[0]);
      var añoAnterior = añoActual - 1;
      var mes = fecha.split("-")[1];
      // var mesText = this.get_mes(mes);
      var mesText = this.form.fecha_ini;      
      var mesfinText = this.form.fecha_fin;            

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
            text: "Reporte",
            bold: true,
          },
          " por Centro de Costos",
        ],
      };

      var total_row = (
        descripcion,
        total1,
        total2,
        total3,
        total4,
        padding_top
      ) => {
        return {
          margin: [0, padding_top ? 30 : 0, 0, 0],
          stack: [
            get_line(),
            {
              margin: [0, 5, 0, 5],
              columns: [
                {
                  width: "50%",
                  alignment: "right",
                  fontSize: 10,
                  bold: true,
                  color: "#ff5722",
                  text: descripcion,
                },
                {
                  width: "12.5%",
                  alignment: "right",
                  fontSize: 8,
                  bold: true,
                  text: this.formatNumero2(total1.toFixed(2)),
                },
                {
                  width: "12.5%",
                  alignment: "right",
                  fontSize: 8,
                  bold: true,
                  text: this.formatNumero2(total2.toFixed(2)),
                },
                {
                  width: "12.5%",
                  alignment: "right",
                  fontSize: 8,
                  bold: true,
                  text: this.formatNumero2(total3.toFixed(2)),
                },
                {
                  width: "12.5%",
                  alignment: "right",
                  fontSize: 8,
                  bold: true,
                  text: this.formatNumero2(total4.toFixed(2)),
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
          resultado: 0,
        },
        2020: {
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
        creditos: {
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
        saldo: {
          pasivo: 0,
          patrimonio: 0,
          resultado: 0,
        },
      };

      Object.getOwnPropertyNames(info).forEach((el, index) => {
        var item = info[el];
        var stack = [];
        // stack.push(titulo);

        var total1 = 0;
        var total2 = 0;
        var total3 = 0;
        var total4 = 0;
        item.forEach((val) => {
          let nivel = val.NIVEL.trim();
          let padding = {
            left: nivel.length * 8,
            right: 0,
            top: 0,
            bottom: 0,
          };

          if (nivel.substr(0, 1) != "3") {
            if (nivel.length === 1) {
              stack.push({
                style: "titulo",
                stack: [
                  get_line(),
                  {
                    margin: [0, 5, 0, 5],
                    columns: [
                      {
                        width: "50%",
                        text: val.DESCRIPCION.trim(),
                      },
                      {
                        width: "12.5%",
                        alignment: "right",
                        text: "Saldo inicial".toUpperCase(),
                      },
                      {
                        width: "12.5%",
                        alignment: "right",
                        text: "Débitos".toUpperCase(),
                      },
                      {
                        width: "12.5%",
                        alignment: "right",
                        text: "Créditos".toUpperCase(),
                      },
                      {
                        width: "12.5%",
                        alignment: "right",
                        text: "Saldo final".toUpperCase(),
                      },
                    ],
                  },
                  get_line(),
                ],
              });
            } else if (
              nivel.length === 2 &&
              nivel.trim() !== "31" &&
              nivel.substr(0, 1) > "3"
            ) {
              stack.push({
                style: "titulo",
                margin: [padding.left, 10, padding.right, 0],
                text: val.DESCRIPCION.trim(),
              });

              if (nivel.substr(0, 1) == "4") {
                totales["2019"].resultado +=
                  parseFloat(
                    val.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totales["2020"].resultado +=
                  parseFloat(
                    val.DEBITOS.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totales["creditos"].resultado +=
                  parseFloat(
                    val.CREDITOS.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totales["saldo"].resultado +=
                  parseFloat(val.SALDO.replace(/\,/g, "").replace(/ /g, "")) ||
                  0;
              } else {
                totales["2019"].resultado -=
                  parseFloat(
                    val.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totales["2020"].resultado -=
                  parseFloat(
                    val.DEBITOS.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totales["creditos"].resultado -=
                  parseFloat(
                    val.CREDITOS.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totales["saldo"].resultado -=
                  parseFloat(val.SALDO.replace(/\,/g, "").replace(/ /g, "")) ||
                  0;
              }
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
                      val.SDO_ANTER.replace(/\,/g, "").replace(/ /g, "")
                    ) || 0;
                  total2 +=
                    parseFloat(
                      val.DEBITOS.replace(/\,/g, "").replace(/ /g, "")
                    ) || 0;
                  total3 +=
                    parseFloat(
                      val.CREDITOS.replace(/\,/g, "").replace(/ /g, "")
                    ) || 0;
                  total4 +=
                    parseFloat(
                      val.SALDO.replace(/\,/g, "").replace(/ /g, "")
                    ) || 0;

                  if (nivel.substr(0, 1) !== "3") {
                    total = true;
                    stack.push(get_line());
                  }
                } else {
                  padding.top = 15;
                }

                valor1 = val.SDO_ANTER.trim().replace(/ /g, "") || 0;
                valor2 = val.DEBITOS.trim().replace(/ /g, "") || 0;
                valor3 = val.CREDITOS.trim().replace(/ /g, "") || 0;
                valor4 = val.SALDO.trim().replace(/ /g, "") || 0;
                // } else if (nivel.length === 4) {
                //   valor1 = val.VALOR1.trim().replace(/ /g, "") || 0;
              } else {
                // valor1 = val.VALOR1.trim().replace(/ /g, "") || 0;
                valor1 = val.SDO_ANTER.trim().replace(/ /g, "") || 0;
                valor2 = val.DEBITOS.trim().replace(/ /g, "") || 0;
                valor3 = val.CREDITOS.trim().replace(/ /g, "") || 0;
                valor4 = val.SALDO.trim().replace(/ /g, "") || 0;
              }
              var cuentaPuc = parseInt(val.CTAPUC) != 0 ? val.CTAPUC : "";
              var idrut = parseInt(val.CTAPUC) != 0 ? val.CTAPUC : "";
              stack.push({
                margin: [0, padding.top, 0, padding.bottom],
                columns: [
                  {
                    margin: [0, 0, 0, 0],
                    width: "10%",
                    style: total ? "titulo" : null,
                    text: cuentaPuc,
                  },

                  {
                    margin: [padding.left, 0, padding.right, 0],
                    width: "40%",
                    style: total ? "titulo" : null,
                    text: val.DESCRIPCION.trim(),
                  },
                  {
                    width: "12.5%",
                    alignment: "right",
                    bold: total,
                    text: valor1,
                  },
                  {
                    width: "12.5%",
                    alignment: "right",
                    bold: total,
                    text: valor2,
                  },
                  {
                    width: "12.5%",
                    alignment: "right",
                    bold: total,
                    text: valor3,
                  },
                  {
                    width: "12.5%",
                    alignment: "right",
                    bold: total,
                    text: valor4,
                  },
                ],
              });
            }
          }
        });

        let descripcion_nivel = item[0].DESCRIPCION.trim();
        // Add total
        stack.push(
          total_row(
            `TOTAL ${descripcion_nivel}`,
            total1,
            total2,
            total3,
            total4
          )
        );

        if (el == "2") {
          totales["2020"].pasivo = total1;
          totales["2019"].pasivo = total2;
          totales.creditos.pasivo = total3;
          totales.saldo.pasivo = total4;
        } else if (el == "3") {
          totales["2020"].patrimonio = total1;
          totales["2019"].patrimonio = total2;
          totales.creditos.patrimonio = total3;
          totales.saldo.patrimonio = total4;
        }

        // if (el == "3") {
        //   let label = null;
        //   let valor1 = 0;
        //   let valor2 = 0;
        //   let valor3 = 0;
        //   let valor4 = 0;

        //   if (el == "3") {
        //     label = "TOTAL PASIVOS + PATRIMONIO";
        //     valor1 = totales["2020"].pasivo + totales["2020"].patrimonio;
        //     valor2 = totales["2019"].pasivo + totales["2019"].patrimonio;
        //     valor3 = totales.creditos.pasivo + totales.creditos.patrimonio;
        //     valor4 = totales.saldo.pasivo + totales.saldo.patrimonio;
        //   }

        //   stack.push(total_row(label, valor1, valor2, valor3, valor4, true));
        // }

        if (el != "3") {
          content.push({
            pageBreak:
              index + 1 === Object.getOwnPropertyNames(info).length
                ? null
                : "after",
            stack,
          });
        }
      });

      let label = null;
      let valor1 = 0;
      let valor2 = 0;
      let valor3 = 0;
      let valor4 = 0;
      label = "RESULTADO DEL EJERCICIO";
      valor1 = totales["2019"].resultado;
      valor2 = totales["2020"].resultado;
      valor3 = totales.creditos.resultado;
      valor4 = totales.saldo.resultado;
      let stack2 = [];
      stack2.push(total_row(label, valor1, valor2, valor3, valor4, true));
      content.push({ pageBreak: null, stack: stack2 });

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
                        fontSize: 10,                        
                        text: [
                          {
                            text: "Balance",
                            bold: true,
                          },
                          " por Centro de Costos Fecha Inicial:",
                          mesText.toUpperCase() + " Fecha Final:" + mesfinText,
                        ],
                      },
                      {
                        style: "tituloHeader",
                        fontSize: 12,
                        text: [
                          "Centro de costos: ",
                          _this.form.ccosto.descrip_cost.trim(),
                        ],
                      },
                      // {
                      //   alignment: 'center',
                      //   text: `${mesText.toUpperCase()}`,
                      // },
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
          images: {
            logo,
          },
        };

        pdfMake.createPdf(dd).open();
      });
    },

    cargaranexos() {
      if (!this.form.fecha_ini) {
        this.errores.fecha_ini = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar un periodo",
          estado: true,
        });
      } else {
        var cuentaContable = this.form.ctacontab
          ? this.form.ctacontab.cod_puc
          : "0";

        var ccosto = this.form.ccosto ? this.form.ccosto.llavecentro_cost : "0";

        var fechaini = this.form.fecha_ini ? this.form.fecha_ini.replace(/\-/g, "") : "";
        var fechafin = this.form.fecha_fin ? this.form.fecha_fin.replace(/\-/g, "") : "";        
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpAuxiliarccJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cuentaContable +
              "|" +
              ccosto +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.anexos = JSON.parse(JSON.stringify(data));
            this.print_reporte_excel();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar anexo",
              estado: true,
            });
          });
      }
    },

    print_reporte_excel() {
      var data = this.anexos;
      var data_parse = [];
      var anterior = null;
      var siguiente = false;

      var totales = {
        debitos: 0,
        creditos: 0,
      };

      data.forEach((el, index) => {
        anterior = el.codcta_rep;
        if (!siguiente) siguiente = el.codcta_rep;

        let copia = JSON.parse(JSON.stringify(el));
        let debito = parseFloat(el.debito_rep.replace(/\,/g, "")) || 0;
        let credito =
          parseFloat(el.credito_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
          0;

        copia.debito_rep = debito;
        copia.credito_rep = credito;

        // copia.base_rep =
        //   parseFloat(el.base_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
        //   0;

        if (anterior != siguiente) {
          data_parse.push({
            codcta_rep: null,
            descripcta_rep: null,
            fecha_rep: null,
            descriprut_rep: "Total Auxiliar",
            docinter_rep: null,
            debito_rep: totales.debitos,
            credito_rep: totales.creditos,
            base_rep: null,            
            detalle_rep: null,
            // docabrev_rep: null,
            // nombredoc_rep: null,
            // registro_rep: null,
            // rut_rep: null,
          });

          totales = {
            debitos: debito,
            creditos: credito,
          };
        } else {
          totales.debitos += debito;
          totales.creditos += credito;
        }
        data_parse.push(copia);

        siguiente = anterior;
      });

      var columnas = [
        {
          title: "Cuenta",
          value: "codcta_rep",
        },
        {
          title: "Descripción cuenta",
          value: "descripcta_rep",
        },
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Descripcion",
          value: "descriprut_rep",
        },
        {
          title: "Doc. interno",
          value: "docabrev_rep",
        },
        {
          title: "Vlr débito",
          value: "debito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr crédito",
          value: "credito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Detalle",
          value: "detalle_rep",
        },
      ];

      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var cuenta_contable = this.form.cuentaContable
        ? `${
            this.form.cuentaContable.cod_puc.trim() +
            " - " +
            this.form.cuentaContable.descrip_puc.trim()
          }`
        : "Todas las cuentas";
      var rut_procesado = this.form.selruts
        ? `${
            this.form.selruts.identificacion_rut.trim() +
            " - " +
            this.form.selruts.descripcion_rut.trim()
          }`
        : "Todos los ruts";
      var header_format = [
        { text: "ANEXO CENTRO DE COSTOS", bold: true, size: 16 },
        `Fecha Inicial: ${this.form.fecha_ini} Fecha Final: ${this.form.fecha_fin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo Ccostos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `ANEXO CCOSTOS-${new Date().getTime()}`,
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
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "3" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
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
      this.loader.card = true;
      var cuentaContable = this.form.ctacontab
        ? this.form.ctacontab.cod_puc
        : "0";

      var ccosto = this.form.ccosto ? this.form.ccosto.llavecentro_cost : "0";
      var fechaini = this.form.fecha_ini.replace(/-/g, "");
      var fechafin = this.form.fecha_fin.replace(/-/g, "");      
      var datos = {
        url: "Financiero/dlls/RpBalancecc1J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          this.form.nivel.value +
          "|" +
          this.form.selcta.value +
          "|" +
          cuentaContable +
          "|" +
          0 +
          "|" +
          1 +
          "|" +
          ccosto +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader.card = false;
          if (tipo == 1) this.format_pdf(data);
          else this.format_excel(data);
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
  }, 1000);
}

function reset_impresion() {
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
</script>
