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
                >mdi-briefcase-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Proveedores</v-list-item-title
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
                  label="Cuentas a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.cuenta"
                  @change="contenido=[]"
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Código de cuenta"
                  v-model="form.cuentaContable"
                  :items="cuentasContables"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                  @change="contenido=[]"                  
                  v-if="form.cuenta ? (form.cuenta == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todos los Ruts', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Rut a Procesar"
                  outlined
                  clearable
                  @change="contenido=[]"
                  hide-details
                  v-model="form.ruts"
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  clearable
                  @change="contenido=[]"
                  return-object
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
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
                      label="Fecha de Corte"
                      append-icon="event"
                      hide-details
                      outlined
                      @change="contenido=[]"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row class="justify-end">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="cargarcontenido"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>

              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="generar_excel()"
                :disabled="contenido.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
              <v-btn
                color="red darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="generar_pdf()"
                :disabled="contenido.length == 0"
              >
                Imprimir PDF
                <v-icon right dark>mdi-pdf-box</v-icon>
              </v-btn>
            </v-row>

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

            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <!-- <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep">{{item.codcta_rep}} - {{item.descripcta_rep}}</label>
              </template> -->
              <template v-slot:item.docinter_rep="{ item }">
                <v-btn
                  depressed
                  small
                  rounded
                  color="primary"
                  outlined
                  v-if="item.descripcta_rep"
                  @click="reimprimir(item)"
                  >{{ item.docinter_rep }}</v-btn
                >
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Cuenta Contable</b>
                        </td>
                        <td>{{ item.codcta_rep }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <table id="pdf_header_comp">
        <thead>
          <tr>
            <th>
              <img class="logo" :src="logoSrc" />
            </th>
            <th>
              <a class="nombre_print"></a>
              <br />Nit
              <a class="nit_print"></a>
            </th>
            <th colspan="5">
              <b class="nombredoc_print"></b>
              <br />
              <b>
                Número:
                <a class="consecutivo_print"></a>
              </b>
              <br />
              <b>Fecha:</b>
              <a class="fecha_print"></a>
              <br />
            </th>
          </tr>
        </thead>
      </table>
      <table id="pdf_body_comp">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cuenta</th>
            <th>Rut</th>
            <th>Documento</th>
            <th>c. costo</th>
            <th>Débito</th>
            <th>Crédito</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr style="border-top: 1px solid">
            <td colspan="5" style="padding-bottom: 40px">
              <b>TOTALES:</b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_debito"></b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_credito"></b>
            </td>
            <td style="padding-bottom: 40px"></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <b>Revisó:</b>
            </td>
            <td colspan="2">
              <b>Generó:</b>
              <br />
              <a class="impreso_print"></a>
              <br />
              <a class="fechagen_print"></a>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      empresa: [],
      pickeFechaIni: false,
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
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Proveedor", align: "left", value: "descriprut_rep" },
        { text: "Factura", align: "center", value: "docexter_rep" },
        { text: "Fecha Vence", align: "center", value: "fecha_rep" },
        { text: "Dias Vencido", align: "center", value: "diasvenc_rep" },
        { text: "Dias Por Vencer", align: "left", value: "diasxvenc_rep" },
        { text: "Saldo", align: "center", value: "saldo_rep" },
        { text: "Nombre_Cta", align: "center", value: "descripcta_rep" },
        { text: "Cuenta", align: "center", value: "codcta_rep" },
      ],
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
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablactas();
    this.cargarTablaruts();
  },
  methods: {
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];
      var rut = "";
      var subTotal = 0;
      var poneSubTot = false;
      var totalSaldo = 0;

      var columnas = [
              
        {
          title: "Id.Proveedor",
          value: "rut_rep",
        },
        {
          title: "Proveedor",
          value: "descriprut_rep",
          bold: true,
        },
        {
          title: "Factura",
          value: "docexter_rep",
        },
        {
          title: "Fecha Vence",
          value: "fecha_rep",
        },
        {
          title: "Días vencido",
          value: "diasvenc_rep",
          format: "number",
        },
        {
          title: "Días por vencer",
          value: "diasxvenc_rep",
          format: "number",
        },
        {
          title: "Valor Saldo",
          value: "saldo_rep",
          format: "money",
        },
        {
          title: "Subtotal",
          value: "subtotal_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Nombre Cuenta",
          value: "descripcta_rep",
        },
        {
          title: "Codigo Cuenta",
          value: "codcta_rep",
        },
      ];

      data.forEach((el, index) => {
        if (el.rut_rep != undefined && el.saldo_rep != undefined) {
          if (rut === el.rut_rep) {
            poneSubTot = false;
          } else {
            if (index > 0) {
              poneSubTot = true;
            }
            rut = el.rut_rep;
          }

          if (poneSubTot) {
            data_parse.push({
              rut_rep: "",
              descriprut_rep: "",
              docexter_rep: "",
              fecha_rep: "",
              diasvenc_rep: "",
              diasxvenc_rep: "",
              saldo_rep: "***SubTotal***" ,bold:true,
              subtotal_rep: subTotal,

            });
            data_parse.push({
              rut_rep: "",
              descriprut_rep: "",
              docexter_rep: "",
              fecha_rep: "",
              diasvenc_rep: "",
              diasxvenc_rep: "",
              saldo_rep: "",
              subtotal_rep: "",

            });
            subTotal = 0;
          }
          subTotal +=
            el.saldo_rep === undefined
              ? 0
              : parseFloat(el.saldo_rep.replace(/\,/g, "").replace(/\ /g, ""));

          data_parse.push({
            rut_rep: el.rut_rep,
            descriprut_rep:
              el.descriprut_rep === undefined ? "" : el.descriprut_rep.trim(),
            docexter_rep:
              el.docexter_rep === undefined
                ? ""
                : el.docexter_rep.replace(/\ /g, ""),
            fecha_rep: el.fecha_rep === undefined ? "" : el.fecha_rep.trim(),
            diasvenc_rep:
              el.diasvenc_rep === undefined
                ? 0
                : parseInt(
                    el.diasvenc_rep.replace(/\,/g, "").replace(/\ /g, "")
                  ),
            diasxvenc_rep:
              el.diasxvenc_rep === undefined
                ? 0
                : parseInt(
                    el.diasxvenc_rep.replace(/\,/g, "").replace(/\ /g, "")
                  ),
            saldo_rep:
              el.saldo_rep === undefined
                ? 0
                : parseFloat(
                    el.saldo_rep.replace(/\,/g, "").replace(/\ /g, "")
                  ),
            codcta_rep: el.codcta_rep === undefined ? "" : el.codcta_rep.trim(),
            descripcta_rep:
              el.descripcta_rep === undefined ? "" : el.descripcta_rep.trim(),
          });
        }
      });

      data_parse.push({
        rut_rep: "",
        descriprut_rep: "",
        docexter_rep: "",
        fecha_rep: "",
        diasvenc_rep: "",
        diasxvenc_rep: "",
        subtotal_rep: subTotal,
        saldo_rep: "***SubTotal***",
      });
      data_parse.push({
        rut_rep: "",
        descriprut_rep: "",
        docexter_rep: "",
        fecha_rep: "",
        diasvenc_rep: "",
        diasxvenc_rep: "",
        subtotal_rep: subTotal,
        saldo_rep: "***SubTotal***",
      });

      data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        "Reporte de Proveedores".toUpperCase(),
        "Fecha Corte: " + this.form.fechaInicial,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte de Proveedores",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `PROVEEDORES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    generar_pdf() {
      var _this = this;
      var contenido = this.contenido;
      var datosTabla = [];
      var totalSaldo = 0;
      var rut = "";
      var subTotal = 0;
      var poneSubTot = false;

      contenido.forEach((el, index) => {
        if (el.rut_rep != undefined && el.saldo_rep != undefined) {
          totalSaldo +=
            el.saldo_rep === undefined
              ? 0
              : parseFloat(el.saldo_rep.replace(/\,/g, "").replace(/\ /g, ""));

          if (rut === el.rut_rep) {
            poneSubTot = false;
          } else {
            if (index > 0) {
              poneSubTot = true;
            }
            rut = el.rut_rep;
          }

          if (poneSubTot) {
            datosTabla.push([
              {},
              {},
              {},
              {
                fontSize: 10,
                colSpan: 2,
                bold: true,
                text: "Subtotal".toUpperCase(),
              },
              {},
              {
                fontSize: 10,
                bold: true,
                alignment: "right",
                text: _this.formatNumero(subTotal),
              },
            ]);
            subTotal = 0;
          }
          subTotal +=
            el.saldo_rep === undefined
              ? 0
              : parseFloat(el.saldo_rep.replace(/\,/g, "").replace(/\ /g, ""));

          datosTabla.push([
            {
              fontSize: 8,
              alignment: "left",
              text:
                el.descriprut_rep === undefined ? "" : el.descriprut_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "right",
              text: el.docexter_rep === undefined ? "" : el.docexter_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "center",
              text: el.fecha_rep === undefined ? "" : el.fecha_rep,
            },
            {
              fontSize: 8,
              alignment: "right",
              text: el.diasvenc_rep === undefined ? "" : el.diasvenc_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "right",
              text:
                el.diasxvenc_rep === undefined ? "" : el.diasxvenc_rep.trim(),
            },
            {
              fontSize: 8,
              alignment: "right",
              text:
                el.saldo_rep === undefined
                  ? ""
                  : el.saldo_rep.replace(/\ /g, ""),
            },
          ]);
        }
      });

      datosTabla.push([
        {},
        {},
        {},
        {
          fontSize: 10,
          colSpan: 2,
          bold: true,
          text: "Total Proveedores".toUpperCase(),
        },
        {},
        {
          fontSize: 10,
          bold: true,
          alignment: "right",
          text: _this.formatNumero(totalSaldo),
        },
      ]);

      datosTabla.unshift([
        {
          fontSize: 10,
          text: "Proveedor",
        },
        {
          fontSize: 10,
          text: "Factura",
        },
        {
          fontSize: 10,
          text: "Fecha Vence",
        },
        {
          fontSize: 10,
          text: "Días vencido",
        },
        {
          fontSize: 10,
          text: "Días por vencer",
        },
        {
          fontSize: 10,
          text: "Valor Saldo",
        },
      ]);

      var margin = {
        left: 40,
        right: 40,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var dd = {
          //pageOrientation: "landscape",
          pageMargins: [margin.left, 100, margin.right, 60],
          header: function (currentPage, pageCount, pageSize) {
            return [
              {
                margin: [margin.left, 20, margin.right, 0],
                columns: [
                  {
                    width: "20%",
                    margin: [0, 0, 0, 0],
                    alignment: "center",
                    stack: [
                      {
                        image: "logo",
                        fit: [80, 80],
                      },
                    ],
                  },
                  {
                    width: "50%",
                    bold: true,
                    fontSize: 11,
                    stack: [
                      _this.empresa.descrip_empr,
                      `NIT. ${_this.formatNumero(
                        parseInt(_this.empresa.id_empr.replace(/\,/g, ""))
                      )}`,
                      `Dir. ${_this.empresa.direccion_empr}`,
                      `Tel. ${_this.empresa.telefono_empr}`,
                      `${_this.empresa.Ciudad} - ${_this.empresa.Departamento}`,
                    ],
                  },
                  {
                    width: "30%",
                    bold: true,
                    fontSize: 11,
                    alignment: "center",
                    stack: [
                      "Reporte de proveedores".toUpperCase(),
                      "Fecha corte: " + _this.form.fechaInicial,
                    ],
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                canvas: [
                  {
                    type: "line",
                    x1: margin.left,
                    x2: pageSize.width - margin.right,
                    y1: 0,
                    y2: 0,
                    lineWidth: 2,
                  },
                ],
              },
            ];
          },
          content: [
            {
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
                body: datosTabla,
              },
              layout: "lightHorizontalLines",
            },
          ],
          styles: {},
          images: {
            logo: logo,
          },
        };

        pdfMake.createPdf(dd).open();
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
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    reimprimir(item) {
      this.card.loader = true;
      this.card.disabled = true;

      var documento = item.docinter_rep.substring(0, 7);
      var consecutivo = item.docinter_rep.substring(7);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        documento +
        "|" +
        consecutivo +
        "|" +
        item.fecha_rep +
        "|";

      post
        .postData({
          url: "Financiero/dlls/PrRegcontJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.format_imprimir(data);
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    format_imprimir(data) {
      data = data[0];
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        try {
          if (val == "registros") {
            var parent = document
              .getElementById("pdf_body_comp")
              .getElementsByTagName("tbody")[0];

            var registros = data[val];
            var debitos = 0;
            var creditos = 0;

            registros.forEach((item) => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              row.insertCell(0).appendChild(document.createTextNode(item.item));
              row
                .insertCell(1)
                .appendChild(document.createTextNode(item.cuenta));
              row.insertCell(2).appendChild(document.createTextNode(item.rut));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.nroext));
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.ccosto));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.debito));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.credito));
              row
                .insertCell(7)
                .appendChild(document.createTextNode(item.detalle));

              debitos += parseFloat(item.debito.replace(/\,/g, "")) || 0;
              creditos += parseFloat(item.credito.replace(/\,/g, "")) || 0;
            });

            document.getElementsByClassName("total_debito")[0].innerHTML +=
              " " + this.formatNumero(debitos.toFixed(2));

            document.getElementsByClassName("total_credito")[0].innerHTML +=
              " " + this.formatNumero(creditos.toFixed(2));
          } else {
            var el = val + "_print";
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          console.error(`Parametro: ${val} - Error`, error);
        }
      });

      imprimir_pdf();
      this.card.loader = false;
      this.card.disabled = false;
    },
    cargarcontenido() {
      var data = this.form;

      if (!data.cuenta) {
        this.send_error("Selecciona el tipo de cuenta a procesar");
      } else if (data.cuenta != 1 && !data.cuentaContable) {
        this.send_error("Selecciona el código de cuenta a procesar");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var cuentaProcesar = data.cuenta;
        var cuentaContable = data.cuentaContable
          ? data.cuentaContable.cod_puc
          : null;

        var selrut = data.selruts ? data.selruts.identificacion_rut : null;

        var tiporut = data.ruts;
        var fechaInicial = data.fechaInicial.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          cuentaProcesar +
          "|" +
          (cuentaProcesar == 1 ? "0" : cuentaContable) +
          "|" +
          (tiporut == 1 ? "0" : selrut) +
          "|" +
          fechaInicial +
          "|";
        post

          .postData({
            url: "Financiero/dlls/RpProveedorJ.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;

            var new_data = [];
            var cuentaActual = null;
            var cuentaSiguiente = null;
            data.forEach((item, index) => {
              cuentaActual = item.rut_rep;
              if (index + 1 != data.length)
                cuentaSiguiente = data[index + 1].rut_rep;

              item.index = index;
              new_data.push(item);
              if (cuentaActual != cuentaSiguiente) new_data.push({});
            });

            this.contenido = new_data;
          })
          .catch((err) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte");
          });
      }
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    format_ruts: function (val) {
      return `${val.descripcion_rut}`;
    },

    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "2" + "|",
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
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_print")[0].innerHTML = "";
  document.getElementsByClassName("nombredoc_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_print")[0].innerHTML = "";
  document.getElementsByClassName("consecutivo_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_print")[0].innerHTML = "";
  document.getElementsByClassName("total_debito")[0].innerHTML = "";
  document.getElementsByClassName("total_credito")[0].innerHTML = "";
  document.getElementsByClassName("impreso_print")[0].innerHTML = "";
  document.getElementsByClassName("fechagen_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body_comp")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}
</script>
