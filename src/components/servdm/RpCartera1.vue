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
                >Reporte Cartera</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
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
                  :disabled="disabledSelect"
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


              <v-col class="d-flex" cols="4">
                <v-select
                  :items="ruts"
                  label="Rut a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ruts"
                  return-object
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                  v-if="form.ruts && form.ruts.value != 1"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-left">
              <v-col cols="12">
                <v-btn
                  color="indigo"
                  class="mr-2 white--text px-12"
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
                  color="green"
                  class="mr-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                  @click="descargar_excel()"
                >
                  <v-icon right class="mr-2">mdi-file-excel-box</v-icon>
                  Descargar EXCEL
                </v-btn>
                <v-btn
                  @click="descargar_pdf()"
                  color="red darken-2"
                  class="white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                >
                  <v-icon right dark>mdi-pdf-box</v-icon> Descargar .PDF
                </v-btn>
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
              <template v-slot:item.vence_rep="{ item }">
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
              </template>
              <template v-slot:item.total_rep="{ item }">
                <b v-if="item.separador">{{ item.total_rep }}</b>
                <label v-else>{{ item.total_rep }}</label>
              </template>

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
                        <td>{{ item.pagos_rep }}</td>
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
                  {{ formatNumero(totales.vrlfact) }}
                </td>

                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.xvencer) }}
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.vencido) }}
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.total) }}
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
      },
      agencias: [],
      pickeFechaIni: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      empresa: [],
      search: "",
      form: {
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        ruts: null,
        asesor: null,        
      },
      headers: [
        {
          text: "Agencia",
          align: "center",
          value: "agencia_rep",
          width: "5%",
        },
        {
          text: "Descripción",
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
          text: "Valor Factura",
          align: "center",
          value: "valor_rep",
          width: "10%",
        },

        {
          text: "Saldo Deuda",
          align: "center",
          value: "saldo_rep",
          width: "10%",
        },
        {
          text: "Vencido",
          align: "center",
          value: "vencido_rep",
          width: "10%",
        },
        {
          text: "Total",
          align: "center",
          value: "total_rep",
          width: "10%",
        },
      ],
      ruts: [
        { text: "Todos los Ruts", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],
      asesor: [
        { text: "Todos los Asesores", value: 1 },
        { text: "Seleccion Unica", value: 2 },
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
        total: 0,
      },
      disabledSelect: false
    };
  },
  async created() {
    await this.cargar_empresa();
    this.cargarTablaruts();
    this.cargarTablaAg();
  },
  methods: {
    cargar_empresa() {
      return new Promise((resolve) => {
        post
          .postData({
            url: "Financiero/dlls/CfEmpresaJ.dll",
            data: sessionStorage.Sesion + "|",
            method: "",
          })
          .then((data) => {
            this.empresa = data[0];
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar empresa",
              estado: true,
            });
          });
      });
    },

    descargar_pdf() {
      let data = this.contenido;
      let data_format = [];
      let fecha_corte = this.form.fechaInicial.replace(/\-/g, "/");
      let granTotalxVencer = this.totales.xvencer;
      let granTotalVencido = this.totales.vencido;
      let granTotal = this.totales.total;

      data_format.push([
        { text: "Agencia", style: "header_table" },
        { text: "Descripción", style: "header_table" },
        { text: "Factura", style: "header_table" },
        { text: "Fecha", style: "header_table" },
        { text: "Vencimiento", style: "header_table" },
        { text: "Días", style: "header_table" },
        { text: "Por vencer", style: "header_table" },
        { text: "Vencido", style: "header_table" },
        { text: "Total", style: "header_table" },
      ]);

      data.forEach((el) => {
        let item;

        if (el.vence_rep.trim() != "Sub-total:") {
          item = [
            el.agencia_rep.trim(),
            el.descripcion_rep.trim(),
            el.pref_rep.trim() + " " + el.factura_rep.trim(),
            el.fecha_rep.trim(),
            el.vence_rep.trim(),
            el.dias_rep.replace(/ /g, ""),
            el.xvencer_rep.replace(/ /g, ""),
            el.vencido_rep.replace(/ /g, ""),
            { text: el.total_rep.trim(), alignment: "center" },
          ];
        } else {
          item = [
            "",
            "",
            "",
            "",
            {
              text: "Sub-total: ",
              bold: true,
              margin: [0, 0, 0, 20],
              fontSize: 9,
            },
            "",
            { text: el.xvencer_rep.replace(/ /g, ""), bold: true },
            { text: el.vencido_rep.replace(/ /g, ""), bold: true },
            { text: el.total_rep.trim(), bold: true, alignment: "center" },
          ];
        }

        data_format.push(item);
      });

      data_format.push([
        "",
        "",
        "",
        "",
        {
          text: "Totales: ",
          bold: true,
          fontSize: 10,
        },
        "",
        { text: this.formatNumero(granTotalxVencer), bold: true },
        { text: this.formatNumero(granTotalVencido), bold: true },
        { text: this.formatNumero(granTotal), bold: true, alignment: "center" },
      ]);

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_format,
          header_pdf: [
            {
              text: [{ text: "Fecha corte: ", bold: true }, fecha_corte],
            },
          ],
          titulo: "Reporte Cartera",
          logo,
          fontSize: 8,
        });
      });
    },

    descargar_excel() {
      let data = this.contenido;
      data.pop();
      let data_parse = [];
      let fecha_corte = this.form.fechaInicial.replace(/\-/g, "/");
      let granTotfact = this.totales.vrlfact;
      let granTotal = this.totales.total;

      data.forEach((el, i) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.dias_rep = el.dias_rep.replace(/ /g, "");
        copia.factura_rep = parseFloat(el.factura_rep.replace(/\,/g, "")) || 0;
        copia.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        copia.saldo_rep = parseFloat(el.saldo_rep.replace(/\,/g, "")) || 0;
//        copia.total_rep = parseFloat(el.total_rep.replace(/\,/g, "")) || 0;
        data_parse.push(copia);
      });

      data_parse.push({
        agencia_rep: "",
        descripcion_rep: "",
        pref_rep: "",
        factura_rep: "",
        fecha_rep: "",
        vence_rep: "Totales: ",
        dias_rep: "",
        valor_rep: granTotfact,
        total_rep: granTotal,
      });

      let columnas = [
        {
          title: "Agencia",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Descripción",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Prefijo",
          value: "pref_rep",
          format: "string",
        },
        {
          title: "Documento",
          value: "factura_rep",
          format: "number",
        },
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Vencimiento",
          value: "vence_rep",
          format: "string",
        },
        {
          title: "Días",
          value: "dias_rep",
          format: "number",
        },
        {
          title: "Valor Factura",
          value: "valor_rep",
          format: "money",
        },

        {
          title: "Saldo Deuda",
          value: "xvencer_rep",
          format: "money",
        },
        {
          title: "Vencido",
          value: "saldo_rep",
          format: "money",
        },
        {
          title: "Total",
          value: "total_rep",
          format: "money",
        },
        {
          title: "Id",
          value: "id_rep",
        },
      ];

      let header_format = [
        { text: "REPORTE DE CARTERA SEGUN FACTURACION", bold: true, size: 16 },
        { text: `Fecha corte: ${fecha_corte}`, bold: true, size: 14 },
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte cartera Facturacion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE CARTERA-${new Date().getTime()}`,
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

          let ubica_perfil = this.empresa.ubicaperfil_empr;
          let ubica_rut = 1;
          let ubica_asesor = 1;

          if (this.empresa.contarem_empr == 1) {
            let busqueda_ubica = this.agencias.find(
              (el) => el.codigo_agc == ubica_perfil
            );
            this.form.punto_fact = busqueda_ubica;

            let busqueda_rut = this.ruts.find((el) => el.value == ubica_rut);
            this.form.ruts = busqueda_rut;

            let busqueda_ases = this.asesor.find(
              (el) => el.value == ubica_asesor
            );
            this.form.asesor = busqueda_ases;
            this.disabledSelect = true
          }
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

      if (!data.ruts) {
        this.send_error("Selecciona el tipo de Ruts");
      } else if (data.ruts.value != 1 && !data.selruts) {
        this.send_error("Selecciona el código del Rut");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;
        var sesion = sessionStorage.Sesion;
        var selrut = data.selruts ? data.selruts.identificacion_rut : null;
        var punto = data.punto_fact.codigo_agc;
        var tiporut = data.ruts.value;
        var fechaFinal = data.fechaInicial.replace(/\-/g, "");
        let calldll = "Servdm/dlls/RpCarteraJ.DLL";

        var datosEnvio =
          sesion +
          "|" +
          punto +
          "|" +
          (tiporut == 1 ? "0" : selrut) +
          "|" +
          fechaFinal +
          "|" +
          "0" +
          "|";
        post
          .postData({
            url: calldll,
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;

            var new_data = [];
            var cuentaActual = null;
            var cuentaSiguiente = null;
            var subtotal_vencido = 0;
            var subtotal_vencer = 0;
            var subtotal_vlrfact = 0;
            this.totales.xvencer = 0;
            this.totales.vencido = 0;
            this.totales.vrlfact = 0;

            data.forEach((item, index) => {
              cuentaActual = item.descripcion_rep;
              if (index + 1 != data.length)
                cuentaSiguiente = data[index + 1].descripcion_rep;

              item.index = index;
              item.descripcion_rep = item.descripcion_rep.replace(
                / +(?= )/g,
                ""
              );
              new_data.push(item);

              let vlr_fact =
                parseFloat(item.valor_rep.replace(/\,/g, "")) || 0;

              // let vencido =
              //   parseFloat(item.vencido_rep.replace(/\,/g, "")) || 0;
              // let xvencer =
              //   parseFloat(item.xvencer_rep.replace(/\,/g, "")) || 0;

              // subtotal_vencido += vencido;
              // subtotal_vencer += xvencer;
              subtotal_vlrfact += vlr_fact;


              // this.totales.xvencer += xvencer;
              // this.totales.vencido += vencido;
              this.totales.vrlfact += vlr_fact;

              // let total = xvencer + vencido + vlr_fact;
              //item.total_rep = this.formatNumero(total);

              if (cuentaActual != cuentaSiguiente || index + 1 == data.length) {
                let subtotal_total = subtotal_vencer + subtotal_vencido + subtotal_vlrfact;

                new_data.push({
                  separador: true,
                  agencia_rep: "",
                  descripcion_rep: "",
                  direccion_rep: "",
                  telefono_rep: "",
                  pref_rep: "",
                  factura_rep: "",
                  fecha_rep: "",
                  vence_rep: "",
                  dias_rep: "",
                  valor_rep: "",
                  xvencer_rep: "",
                  vencido_rep: "",
                  total_rep: "",
                });

                subtotal_vencido = 0;
                subtotal_vencer = 0;
              }
            });

            this.totales.total = this.totales.vrlfact + this.totales.xvencer + this.totales.vencido;
            this.contenido = new_data;
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

    format_asesor: function (val) {
      return `${val.idases} - ${val.descripases}`;
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
