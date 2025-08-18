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
                >mdi-printer-check</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reimpresion Suspensiones/Reconexiones</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="2">
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
                      label="Fecha Inicial"
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

              <v-col class="d-flex" sm="2">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Usuario"
                  v-model="form.usuario"
                  :items="usuarios"
                  :item-text="format_usuarios"
                  item-value="cod_rep"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="(errores.medidor = false), cargarcontenido()"
                  :error="errores.medidor"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
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
              item-key="identificacion"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${item.estado_rep == 1 ? 'red' : 'green'} darken-1`"
                  >{{ item.estado_rep == "1" ? "Anulado" : "Activo" }}</v-chip
                >
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  @click="imprimir_documento(item)"
                  v-if="item.consec_rep"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <template v-slot:item.anula="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="red darken-2"
                  class="white--text"
                  @click="anular_documento(item)"
                >
                  <v-icon>mdi-delete-empty-outline</v-icon>
                </v-btn>
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
// import JsonExcel from "vue-json-excel";
import { PDFDocument } from "pdf-lib";
import Chart from 'chart.js/auto'

import { suspension } from "../../_formatos_sdm.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickerMes: false,
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      dialogPickerini: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      ciclos: [],
      usuarios: [],
      conceptos: [],
      tipoliq: [
        { text: "Factor", value: 1 },
        { text: "Tasa Mensual", value: 2 },
      ],
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 5,
        masked: false,
      },
      search: "",
      form: {
        fechaini: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Tipo", align: "center", value: "desctipo_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Codigo", align: "center", value: "codcli_rep" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "nombrecliente_rep",
        },
        { text: "Estado", value: "estado_rep", align: "center" },
        { text: "Imprimir", value: "edit", align: "center" },
        { text: "Anular", value: "anula", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.get_empresa();
    this.cargar_usuarios();
    this.form.fechaInicial = this.$moment().format("YYYY-MM-01");
    this.form.fechaFinal = this.$moment().format("YYYY-MM-DD");
  },
  computed: {},
  methods: {
    anular_documento(item) {
      let tipo = item.tipo_rep;
      let consecutivo = item.consec_rep.trim();
      var datosEnvio =
        sessionStorage.Sesion + "|" + tipo + "|" + consecutivo + "|";
      post
        .postData({
          url: "Servdm/dlls/PrsuspensionX.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();
          this.$emit("snack", {
            color: "success",
            text: "Registro Procesado",
            estado: true,
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar Registro",
            estado: true,
          });
        });
    },
    imprimir_documento(item) {
      let tipo = item.tipo_rep;
      let consecutivo = item.consec_rep.trim();
      var datosEnvio =
        sessionStorage.Sesion + "|" + tipo + "|" + consecutivo + "|";
      post
        .postData({
          url: "Servdm/dlls/PrsuspensionJ.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            suspension(data).then(() => {
              console.log("ImpresiÃ³n terminada");
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al Generar ImpresiÃ³n",
            estado: true,
          });
        });
    },

    cargarcontenido() {
      var data = this.form;
      var fechaInicial = data.fechaInicial.replace(/\-/g, "");
      var fechaFinal = data.fechaFinal.replace(/\-/g, "");
      let usuario = this.form.usuario.cod_rep.trim();
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/Prsuspension01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaInicial +
            "|" +
            fechaFinal +
            "|" +
            usuario +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Financiaciones",
            estado: true,
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
    cargar_usuarios() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfusuariosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.usuarios = JSON.parse(JSON.stringify(data));
          this.usuarios.unshift({
            cod_rep: "0",
            apellido1_rep: " los Usuarios",
            nombres_rep: "Todos",
          });

          this.form.clientes = {
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Usuarios",
            estado: true,
          });
        });
    },

    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      var data_parse = data.map((el) => {
        el.consec_rep = parseFloat(el.consec_rep);
        el.codcli_rep = parseFloat(el.codcli_rep);

        return el;
      });

      var columnas = [
        {
          title: "Consecutivo",
          value: "consec_rep",
          format: "string",
        },
        {
          title: "Tipo",
          value: "desctipo_rep",
          format: "string",
        },

        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },

        {
          title: "Codigo",
          value: "codcli_rep",
        },
        {
          title: "Nombre Cliente",
          value: "nombrecliente_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "SUSPENSIONES_RECONEXIONES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Suspension/reconexion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `SUSP_RECONEX-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    format_usuarios: function (val) {
      return `${
        val.cod_rep.trim() +
        " - " +
        val.nombres_rep.trim() +
        " - " +
        val.apellido1_rep.trim()
      } `;
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
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>

