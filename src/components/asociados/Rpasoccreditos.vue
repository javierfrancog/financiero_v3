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
              <v-icon size="30" color="blue darken-4 ">mdi-abjad-arabic</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Financiaciones</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
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
                  item-value="identificacion_rut"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="(errores.usuario = false), cargarcontenido()"
                  :error="errores.usuario"
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
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
                >
                  <v-icon>mdi-printer</v-icon>
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

import { formato_amortiza } from "../../_formatos_sdm.js";

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
        { text: "Nro Cuota", align: "center", value: "nrocuota_rep" },
        { text: "Fecha Cuota", align: "center", value: "fechacuota_rep" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "nombrecliente_rep",
        },
        { text: "Valor Cuota", align: "center", value: "vlrcuota_rep" },
        { text: "Capital Pagado", align: "center", value: "pagocapital_rep" },
        { text: "Saldo Capital", align: "center", value: "sdocapital_rep" },
        { text: "Opciones", value: "edit", align: "center" },
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

    this.form.fechaFinal = this.$moment().format("YYYY-MM-DD");
  },
  computed: {},
  methods: {
    imprimir_documento(item) {
      let consecutivo = item.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            formato_amortiza(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));

      const safeNumber = (value) => {
        if (typeof value === "string") {
          const cleanedValue = value.replace(/\s+/g, "").replace(/,/g, "");
          const parsedValue = parseFloat(cleanedValue);
          return isNaN(parsedValue) ? 0 : parsedValue;
        }
        return typeof value === "number" ? value : 0;
      };

      var data_parse = data.map((el) => {
        el.vlrcuota_rep = safeNumber(el.vlrcuota_rep);
        el.pagocapital_rep = safeNumber(el.pagocapital_rep);
        el.sdocapital_rep = safeNumber(el.sdocapital_rep);
        el.pagointer_rep = safeNumber(el.pagointer_rep);
        el.pagomora_rep = safeNumber(el.pagomora_rep);
        el.pagoseg_rep = safeNumber(el.pagoseg_rep);
     

        return el;
      });

      var columnas = [
        {
          title: "Consecutivo",
          value: "consec_rep",
        },
        {
          title: "Nro Cuota",
          value: "nrocuota_rep",
        },

        {
          title: "Fecha Cuota",
          value: "fechacuota_rep",
          format: "string",
        },

        {
          title: "Codigo",
          value: "rut_rep",
          format: "string",
        },
        {
          title: "Nombre Cliente",
          value: "nombrecliente_rep",
          format: "string",
        },
        {
          title: "Valor Capital Cuota",
          value: "vlrcuota_rep",
          format: "money",
        },
        {
          title: "Valor Pagado Capital",
          value: "pagocapital_rep",
          format: "money",
        },
        {
          title: "Saldo Capital",
          value: "sdocapital_rep",
          format: "money",
        },

        {
          title: "Valor Pagado Intereses",
          value: "pagointer_rep",
          format: "money",
        },
        {
          title: "Valor Pagado Mora",
          value: "pagomora_rep",
          format: "money",
        },
        {
          title: "Valor Pagado Seguro",
          value: "pagoseg_rep",
          format: "money",
        },


      ];
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "FINANCIACIONES", bold: true, size: 16 },
        `Fecha de Corte: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Financiaciones",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `FINANCIACIONES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarcontenido() {
      var data = this.form;
      var fechaFinal = data.fechaFinal.replace(/\-/g, "");
      let usuario = this.form.usuario.identificacion_rut;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/RpFinancia01J.dll",
          data:
            sessionStorage.Sesion +
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
          this.contenido = [];
          var new_data = [];
          var cuentaActual = null;
          var cuentaSiguiente = null;
          data.forEach((item, index) => {
            cuentaActual = item.consec_rep;
            if (index + 1 != data.length)
              cuentaSiguiente = data[index + 1].consec_rep;

            item.index = index;
            new_data.push(item);
            if (cuentaActual != cuentaSiguiente) new_data.push({});
          });
          this.contenido = new_data;
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
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|" + "5" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.usuarios = JSON.parse(JSON.stringify(data));
          this.usuarios.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos los Usuarios",
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

    format_usuarios: function (val) {
      return `${val.descripcion_rut} `;
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

