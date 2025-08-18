<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loadCard"
        :disabled="loadCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-card-account-details-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Provisiones de NÃ³mina</v-list-item-title
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
                  label="Periodo"
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
          <v-col class="d-flex" cols="12" sm="3">
            <v-btn
              color="indigo"
              class="ma-2 white--text px-12 d-flex justify-end"
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
          <v-col class="d-flex" cols="12" sm="3">
            <v-btn
              color="green"
              class="mt-2 ml-2 white--text px-12"
              large
              depressed
              :disabled="contenido.length == 0"
              @click="print_reporte_excel"
            >
              Imprimir excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-col>
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
      contenido: [],

      search: "",
      form: {},
      headers: [
        { text: "IdentificaciÃ³n", align: "left", value: "idnomina_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Total Devengos", align: "right", value: "devengos_rep" },
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
      loadCard: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    cargarcontenido() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpProvNomJ.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|",
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
            text: "Error al cargar Reporte",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data_parse = this.contenido;
      var columnas = [
        {
          title: "Id Colaborador",
          value: "idnomina_rep",
        },

        {
          title: "Apellido 1",
          value: "Apellido1nomina_rep",
        },
        {
          title: "Apellido 2",
          value: "Apellido2nomina_rep",
        },

        {
          title: "Nombres",
          value: "nombresnomina_rep",
        },
        {
          title: "Cargo",
          value: "descripcargo_rep",
        },

        {
          title: "Total Devengos",
          value: "devengos_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Base Cesantias",
          value: "baseces_rep",
          format: "money",
        },
        {
          title: "Cesantias",
          value: "cesantias_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Base Intereses",
          value: "baseint_rep",
          format: "money",
        },
        {
          title: "Intereses",
          value: "intereses_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Base Prima",
          value: "baseprim_rep",
          format: "money",
        },
        {
          title: "Prima",
          value: "prima_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Base Vacaciones",
          value: "basevac_rep",
          format: "money",
        },
        {
          title: "Vacaciones",
          value: "vacaciones_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Base Salud",
          value: "basesal_rep",
          format: "money",
        },
        {
          title: "Salud",
          value: "salud_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Base PensiÃ³n",
          value: "basepens_rep",
          format: "money",
        },
        {
          title: "PensiÃ³n",
          value: "pension_rep",
          totalsRowFunction: "sum",
          format: "money",
        },
        {
          title: "Arl",
          value: "arl_rep",
          totalsRowFunction: "sum",
          format: "money",
        },
        {
          title: "Base Caja",
          value: "basecaja_rep",
          format: "money",
        },
        {
          title: "Caja",
          value: "caja_rep",
          totalsRowFunction: "sum",
          format: "money",
        },
        {
          title: "Base Icbf",
          value: "baseicbf_rep",
          format: "money",
        },
        {
          title: "Icbf",
          value: "icbf_rep",
          totalsRowFunction: "sum",
          format: "money",
        },
        {
          title: "Base Sena",
          value: "baseicbf_rep",
          format: "money",
        },
        {
          title: "Sena",
          value: "sena_rep",
          totalsRowFunction: "sum",
          format: "money",
        },
      ];
      var fecha_inicial = this.form.fecha;
      var header_format = [
        { text: "PROVISIONES DE NOMINA", bold: true, size: 16 },
        `Periodo: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "PRovisiones de Nomina",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE PROVISIONES DE NOMNA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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

