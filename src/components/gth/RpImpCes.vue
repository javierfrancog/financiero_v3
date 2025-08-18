<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cash-usd-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >ImpresiÃ³n Cesantias</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Periodo CesantÃ­as"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          .
        </v-row>

        <v-row class="justify-center">
          <!-- <v-btn
            color="blue darken-2"
            class="white--text mr-3"
            large
            depressed
            @click="get_soporte"
            v-if="
              form.periodo
                ? form.periodo.value == 6 || form.periodo.value == 7
                : false
            "
          >
            Descargar soporte
            <v-icon right>mdi-file-excel-box</v-icon>
          </v-btn> -->
          <v-btn
            color="indigo"
            class="white--text mr-3"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>

          <!-- <v-btn
            color="red darken-2"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="generar_pdf"
          >
            Generar PDF
            <v-icon right>mdi-file-pdf</v-icon>
          </v-btn> -->

          <v-btn
            color="success"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="generar_excel"
          >
            Generar EXCEL
            <v-icon right>mdi-file-excel-box</v-icon>
          </v-btn>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              :expanded.sync="expanded"
              show-expand
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      // periodos: [
      //   { text: "Prima 1er Semestre", value: 6 },
      //   { text: "Prima 2do Semestre", value: 7 },
      // ],

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Apellido2", align: "left", value: "Apellido2nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "CesantÃ­as", align: "left", value: "netonomina_rep" },
        // { text: "Intereses", align: "left", value: "interes_rep" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      empresa: {},
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    get_soporte() {
      var usuario = sessionStorage.Sesion.substr(15, 15);
      var periodo = this.form.periodo;
      var nombre_archivo = `${usuario}_P${periodo.value}.txt`;
      var formData = new FormData();
      formData.append("ruta", "D:\\TITAN\\TMP\\" + nombre_archivo);
      fetch("https://server1ts.net//financiero/inc/get.plano.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((result) => {
          var csvContent = result;
          var blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          var url = URL.createObjectURL(blob);
          var pom = document.createElement("a");
          pom.href = url;
          pom.setAttribute("download", `SOPORTE_PRIMA.csv`);
          pom.click();
          this.$emit("snack", {
            color: "success",
            text: "Archivo generado correctamente",
            estado: true,
          });
        });
    },
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];
      var titColumnas = [];
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.tomarPeriodo(fecha);
      var columnas = [
        {
          title: "  Documento",
          value: "idnomina_rep",
        },
        {
          title: " Apellido 1",
          value: "Apellido1nomina_rep",
        },
        {
          title: " Apellido 2",
          value: "Apellido2nomina_rep",
        },
        {
          title: "  Nombres",
          value: "nombresnomina_rep",
        },
        {
          title: "Neto pagado",
          value: "netoPagado",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];

      data.forEach((el) => {
        var datosInternos = el.basesnomina_rep;
        var nPagado = 0;
        var reg = {
          idnomina_rep: el.idnomina_rep,
          Apellido1nomina_rep: el.Apellido1nomina_rep,
          Apellido2nomina_rep: el.Apellido2nomina_rep,
          nombresnomina_rep: el.nombresnomina_rep,
        };

        // se cargan las columnas primero
        datosInternos.forEach((item) => {
          if (
            !titColumnas.includes(
              item.codigo_rep.trim() + " - " + item.descripcion_rep.trim()
            )
          ) {
            titColumnas.push(
              item.codigo_rep.trim() + " - " + item.descripcion_rep.trim()
            );
            columnas.push({
              title:
                item.codigo_rep.trim() +
                " - " +
                item.descripcion_rep.trim().toLowerCase(),
              value: item.codigo_rep.trim(),
              format: "money",
            });
            columnas.push({
              title: item.codigo_rep.trim() + " Cant",
              value: "cant" + item.codigo_rep,
              format: "number",
            });
          }
        });
        columnas.sort(function (a, b) {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
          return 0;
        });

        //se cargan los datos
        datosInternos.forEach((item) => {
          reg[item.codigo_rep] =
            parseFloat(item.valor_rep.replace(/\ /g, "").replace(/\,/g, "")) ||
            0;
          reg["cant" + item.codigo_rep] = item.cantidad_rep;
          nPagado +=
            parseFloat(item.valor_rep.replace(/\ /g, "").replace(/\,/g, "")) ||
            0;
        });
        reg["netoPagado"] = nPagado;

        data_parse.push(reg);
      });
      // data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        `NIT. ${parseInt(_this.empresa.id_empr)}`,
        "PLANILLA CESANTIAS",
        periodo,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Planilla Cesantias",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `PLANILLA-CESANTIAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    tomarPeriodo(fecha) {
      let msg = "Mes de ";
      switch (fecha.substr(4, 2)) {
        case "01":
          msg += "Enero";
          break;
        case "02":
          msg += "Febrero";
          break;
        case "03":
          msg += "Marzo";
          break;
        case "04":
          msg += "Abril";
          break;
        case "05":
          msg += "Mayo";
          break;
        case "06":
          msg += "Junio";
          break;
        case "07":
          msg += "Julio";
          break;
        case "08":
          msg += "Agosto";
          break;
        case "09":
          msg += "Septiembre";
          break;
        case "10":
          msg += "Octubre";
          break;
        case "11":
          msg += "Noviembre";
          break;
        case "12":
          msg += "Diciembre";
          break;
        default:
          msg += "";
          break;
      }
      msg += "/" + fecha.substr(0, 4);
      return msg;
    },
    generar_pdf() {
      var _this = this;
      var contenido_tabla = this.contenido;
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.tomarPeriodo(fecha);
      var datosTabla = [];

      var totalBasico = 0;
      var totalIntereses  = 0;
      var totalSumaDevengado = 0;
      var totalOtrosDevengos = 0;
      var totalDeduSalud = 0;
      var totalDeduPension = 0;
      var totalOtrosDeducibles = 0;
      var totalSumaDeducciones = 0;
      var totalNetoPagado = 0;

      contenido_tabla.forEach((el) => {
        let id = parseInt(el.idnomina_rep);
        var descripcion = `${el.nombresnomina_rep.trim()} ${el.Apellido1nomina_rep.trim()} ${el.Apellido2nomina_rep.trim()}`;
        var sBasico = 0;
        var cantBasico = 0;
        var intereses = 0;
        var cantTransporte = 0;
        var otrosDevengos = 0;
        var deSalud = 0;
        var dePension = 0;
        var otrosDeducibles = 0;
        var devBasico = 0;
        var devIntereses  = 0;
        var dedSalud = 0;
        var dedPension = 0;
        el.basesnomina_rep.forEach((item) => {
          switch (item.codigo_rep) {
            case "1101":
              sBasico = item.valor_rep;
              devBasico =
                parseFloat(
                  item.valor_rep.replace(/\ /g, "").replace(/\,/g, "")
                ) || 0;
              cantBasico = item.cantidad_rep;
              break;
            case "1102":
              intereses = item.valor_rep;
              devIntereses =
                parseFloat(
                  item.valor_rep.replace(/\ /g, "").replace(/\,/g, "")
                ) || 0;
              cantTransporte = item.cantidad_rep;
              break;
            default:
              switch (item.codigo_rep.substr(0, 1)) {
                case "1":
                  otrosDevengos +=
                    parseFloat(
                      item.valor_rep.replace(/\ /g, "").replace(/\,/g, "")
                    ) || 0;
                  break;
                case "2":
                  otrosDeducibles +=
                    parseFloat(
                      item.valor_rep.replace(/\ /g, "").replace(/\,/g, "")
                    ) || 0;
                  break;
              }
          }
        });

        var totalDevengado = devBasico + devIntereses  + otrosDevengos;
        var totalDeducciones = dedSalud + dedPension + otrosDeducibles;
        var netoPagado = totalDevengado + totalDeducciones;

        totalBasico += devBasico;
        totalIntereses += devIntereses;
        totalSumaDevengado += totalDevengado;
        totalOtrosDevengos += otrosDevengos;
        totalDeduSalud += dedSalud;
        totalDeduPension += dedPension;
        totalOtrosDeducibles += otrosDeducibles;
        totalSumaDeducciones += totalDeducciones;
        totalNetoPagado += netoPagado;

        datosTabla.push([
          {
            fontSize: 9,
            alignment: "left",
            text: `${id} - ${descripcion}`,
          },
          {
            style: "bodyNumeros",
            text: sBasico,
          },
          {
            style: "bodyNumeros",
            text: cantBasico,
          },
          {
            fontSize: 9,
            alignment: "left",
            text: intereses,
          },
          {
            style: "bodyNumeros",
            text: devIntereses,
          },


          {
            style: "bodyNumeros",
            text: "",
          },
          {
            style: "bodyNumeros",
            text: this.formatNumero(totalDevengado),
          },
          {
            style: "bodyNumeros",
            text: "",
          },
          {
            style: "bodyNumeros",
            text: "",
          },
          {
            style: "bodyNumeros",
            text: "",
          },
          {
            style: "bodyNumeros",
            text: "",
          },
          {
            style: "bodyNumeros",
            text: this.formatNumero(netoPagado),
          },
        ]);
      });

      datosTabla.push([
        {
          bold: true,
          fontSize: 11,
          alignment: "center",
          text: "Totales".toUpperCase(),
        },
        {
          style: "footerTabla",
          text: this.formatNumero(totalBasico),
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          style: "footerTabla",
          text: this.formatNumero(totalIntereses),
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: this.formatNumero(totalSumaDevengado),
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: "",
        },
        {
          style: "footerTabla",
          text: this.formatNumero(totalNetoPagado),
        },
      ]);

      datosTabla.unshift([
        {
          bold: true,
          fontSize: 11,
          text: "Colaborador",
        },
        {
          style: "headerTabla",
          text: "Valor Cesantias",
        },
        {
          style: "headerTabla",
          text: "Cantidad Dias",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "Total devengado",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "",
        },
        {
          style: "headerTabla",
          text: "Neto pagado",
        },
      ]);

      //console.log("Datos tabla", datosTabla);

      var margin = {
        left: 40,
        right: 40,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var dd = {
          pageOrientation: "landscape",
          pageMargins: [margin.left, 100, margin.right, 60],
          header: function (currentPage, pageCount, pageSize) {
            return [
              {
                margin: [margin.left, 40, margin.right, 0],
                columns: [
                  {
                    width: "40%",
                    stack: [
                      `${_this.empresa.descrip_empr.trim()}`,
                      `NIT. ${parseInt(_this.empresa.id_empr)}`,
                    ],
                  },
                  {
                    width: "25%",
                    margin: [0, -15, 0, 0],
                    alignment: "center",
                    stack: [
                      {
                        image: "logo",
                        fit: [80, 80],
                      },
                    ],
                  },
                  {
                    width: "35%",
                    bold: true,
                    fontSize: 12,
                    alignment: "center",
                    stack: [
                      "Planilla Cesantias".toUpperCase(),
                      periodo,
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
                widths: [
                  "*",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                ],
                body: datosTabla,
              },
              layout: "lightHorizontalLines",
            },
          ],
          styles: {
            headerTabla: {
              fontSize: 8,
              alignment: "center",
            },
            footerTabla: {
              fontSize: 8,
              bold: true,
              alignment: "right",
            },
            bodyNumeros: {
              fontSize: 8,
              alignment: "right",
            },
          },
          images: {
            logo: logo,
          },
        };

        pdfMake.createPdf(dd).open();
      });
    },
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
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo =  "8";
      let agencia = this.form.agencia.codigo_agc;

      // console.log(periodo);
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpImpNomrJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            periodo +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar NÃ³minas",
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

