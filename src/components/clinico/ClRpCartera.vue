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
              <v-icon size="30" color="blue darken-4 ">mdi-cash-100</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cartera</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  :error="errores.punto_fact"
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
                  return-object
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
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
                      label="Fecha Corte"
                      append-icon="event"
                      hide-details
                      outlined
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

              <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="form.selectContrato"
                  :error="errores.contrato"
                ></v-autocomplete>
              </v-col>
            </v-row>

          <v-row>
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
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end"> </v-row>

            <v-row justify="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="form.totales"
                  label="Solo totales por Cliente"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center align-center">
              <v-col cols="6" lg="6" md="12" sm="12">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>

              <!-- <v-col cols="2" lg="2" md="6" sm="6">
                <v-btn
                  @click="get_pdf()"
                  color="red"
                  class="white--text"
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                >
                  <v-icon right class="mr-2">mdi-pdf-box</v-icon>Descargar .PDF
                </v-btn>
              </v-col> -->
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
              <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep"
                  >{{ item.codcta_rep }} - {{ item.descripcta_rep }}</label
                >
              </template>
              <template v-slot:item.dias_rep="{ item }">
                <label v-html="item.dias_rep"></label>
              </template>
              <!-- <template v-slot:item.vence_rep="{ item }">
                <b v-if="item.separador">{{ item.vence_rep }}</b>
                <label v-else>{{ item.vence_rep }}</label>
              </template>
              <template v-slot:item.xvencer_rep="{ item }">
                <b v-if="item.separador">{{ item.xvencer_rep }}</b>
                <label v-else>{{ item.xvencer_rep }}</label>
              </template>
              <template v-slot:item.vencido_rep="{ item }">
                <b v-if="item.separador">{{ item.vencido_rep }}</b>
                <label v-else>{{ item.vencido_rep }}</label>
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
                          <b>Imprimir Factura</b>
                        </td>
                        <td>{{ item.codcta_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Pagos</b>
                        </td>
                        <td>{{ formatNumero(item.pagosfact_rep) }}</td>
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
              <template v-slot:body.append>
                <td colspan="8" class="text-right">
                  <strong>TOTALES</strong>
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.xvencer) }}
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.vencido) }}
                </td>
              </template>
            </v-data-table>
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
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      errores: {
        punto_fact: false,
        contrato:false
      },
      agencias: [],
      pickeFechaIni: false,
      load_contrato:false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      selectObjContratos: [],
      search: "",
      form: {
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        {
          text: "Agencia",
          align: "center",
          value: "agencia_rep",
          width: "5%",
        },
        {
          text: "DescripciÃ³n",
          align: "left",
          value: "descripcion_rep",
          width: "20%",
        },
        { text: "Prefijo", align: "center", value: "pref_rep", width: "5%" },
        {
          text: "Factura",
          align: "center",
          value: "factura_rep",
          width: "10%",
        },
        { text: "Fecha", align: "center", value: "fecha_rep", width: "10%" },
        {
          text: "Vencimiento",
          align: "center",
          value: "vence_rep",
          width: "15%",
        },
        { text: "Dias", align: "center", value: "dias_rep", width: "15%" },
        {
          text: "Por Vencer",
          align: "center",
          value: "xvencer_rep",
          width: "10%",
        },
        {
          text: "Vencido",
          align: "center",
          value: "vencido_rep",
          width: "10%",
        },
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
      totales: {
        xvencer: 0,
        vencido: 0,
      },
    };
  },
  created() {
    this.cargarContratos();    
    this.cargarTablaAg();
    this.cargarTablaruts();
  },
  methods: {
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion.trim() + "-" + k.detalle.trim(),
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },    
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data
      var columnas = [
        {
          title: "Entidad",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Rut Entidad",
          value: "id_rep",
          format: "string",
        },
        {
          title: "Contrato",
          value: "contrato_rep",
        },

        {
          title: "Punto FacturaciÃ³n",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Prefijo",
          value: "pref_rep",
          format: "string",
        },
        {
          title: "Factura",
          value: "factura_rep",
          format: "string",
        },
        {
          title: "Fecha Factura",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Fecha Vencimiento",
          value: "vence_rep",
          format: "string",
        },
        {
          title: "Fecha Radicacion",
          value: "fecharad_rep",
          format: "fecha",
        },
        {
          title: "Dias",
          value: "dias_rep",
        },
        {
          title: "Total Factura",
          value: "brutofact_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Abonos",
          value: "pagosfact_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Pendiente por Radicar",
          value: "xradicar_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Por Vencer",
          value: "xvencer_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Vencido hasta 30 dias",
          value: "venc30_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Vencido hasta 60 dias",
          value: "venc60_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Vencido hasta 90 dias",
          value: "venc90_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Vencido hasta 180 dias",
          value: "venc180_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Vencido hasta 360 dias",
          value: "venc360_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Vencido mayor a 360 dias",
          value: "mayor360_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
        {
          title: "Total",
          value: "totalfact_rep",
          format: "money",
          totalsRowFunction: 'sum'
        },
      ];      
      var fecha_inicial = this.form.fechaInicial;

      var header_format = [
        { text: "REPORTE CARTERA", bold: true, size: 16 },
        `Fecha Corte: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Cartera",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Reporte Cartera-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      var data = this.form;
      console.log(data)

      if (!data.ruts) {
        this.send_error("Selecciona el tipo de Ruts");
      } else if (data.ruts != 1 && !data.selruts) {
        this.send_error("Selecciona el cÃ³digo del Rut");
      }else if (!data.selectContrato) {
        this.send_error("Selecciona el contrato");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;
        var sesion = sessionStorage.Sesion;
        var selrut = data.selruts ? data.selruts.identificacion_rut : null;
        var punto = data.punto_fact.codigo_agc;
        var tiporut = data.ruts;
        let contrato = data.selectContrato;
        var fechaFinal = data.fechaInicial.replace(/\-/g, "");
        var totales = data.totales ? "1" : "0";

        var datosEnvio =
          sesion +
          "|" +
          punto +
          "|" +
          (tiporut == 1 ? "0" : selrut) +
          "|" +
          fechaFinal +
          "|" +
          totales +
          "|" +
          contrato + 
          "|";
        post
          .postData({
            url: "Clinico/dlls/ClRpCarteraJ.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;

            var new_data = [];
            var cuentaActual = null;
            var cuentaSiguiente = null;
            var subtotal_vencido = 0;
            var subtotal_vencer = 0;
            this.totales.xvencer = 0;
            this.totales.vencido = 0;

            data.forEach((item, index) => {
              // cuentaActual = item.descripcion_rep;
            //   if (index + 1 != data.length)
            //     cuentaSiguiente = data[index + 1].descripcion_rep;

            //   item.index = index;
            //   item.descripcion_rep = item.descripcion_rep.replace(
            //     / +(?= )/g,
            //     ""
            //   );
            //   new_data.push(item);

              let vencido =
                parseFloat(item.vencido_rep.replace(/\,/g, "")) || 0;
              let xvencer =
                parseFloat(item.xvencer_rep.replace(/\,/g, "")) || 0;
              subtotal_vencido += vencido;
              subtotal_vencer += xvencer;

              this.totales.xvencer += xvencer;
              this.totales.vencido += vencido;

            //   if (cuentaActual != cuentaSiguiente) {
            //     new_data.push({
            //       separador: true,
            //       agencia_rep: "",
            //       descripcion_rep: "",
            //       direccion_rep: "",
            //       telefono_rep: "",
            //       pref_rep: "",
            //       factura_rep: "",
            //       fecha_rep: "",
            //       vence_rep: "Sub-total:",
            //       dias_rep: "",
            //       xvencer_rep:
            //         "$ " + this.formatNumero(subtotal_vencer.toFixed(2)),
            //       vencido_rep:
            //         "$ " + this.formatNumero(subtotal_vencido.toFixed(2)),
            //     });

                subtotal_vencido = 0;
                subtotal_vencer = 0;
              // }
            });
          this.contenido = JSON.parse(JSON.stringify(data));
            // this.contenido = new_data;
          })
          .catch((err) => {
            console.log(err);
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte Cartera");
          });
      }
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
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

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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

