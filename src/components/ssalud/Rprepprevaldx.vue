<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :disabled="load_card"
        :loading="load_card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi:emoticon-sick-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Prevalencias</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerActual"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_actual"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @input="pickerActual = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerFin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_fin"
                      label="Fecha Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_fin"
                    @input="pickerFin = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex justify-end" cols="6">
                <v-btn
                  color="indigo darken-3 white--text"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarReporte"
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
            <v-row> </v-row>
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
              :loading="load_table"
              :headers="headers"
              :items="contenido"
              item-key="codcie_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-show="item.id_at_reporte > 0">
                      <v-btn
                        :hidden="item.fechaataux === '00000000' ? false : true"
                        color="indigo"
                        class="ma-2 white--text"
                        @click="get_pdf(item)"
                        small
                        v-on="on"
                        depressed
                        :disabled="parseInt(item.prservicio) == 0"
                      >
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <span>Descargar Soporte</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {},
  data() {
    return {
      search: null,
      pickerActual: false,
      pickerFin: false,
      load_table: false,

      contenido: [],
      form: {
        motivo: null,
      },
      tab: 0,

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      fecha_fin: this.$moment().format("YYYY-MM-DD"),
      headers: [
        {
          text: "Codigo CIE",
          align: "center",
          value: "codcie_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion",
          align: "left",
          value: "descripcie_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Cantidad",
          align: "center",
          value: "cant_rep",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Especialidad",
          align: "center",
          value: "especialidad_rep",
          class: "indigo--text blue lighten-5",
        },
      ],
      load_card: false,
      panel: [],
    };
  },
  created() {
    this.get_empresa();
  },
  computed: {},
  methods: {
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    cargarReporte: function (value) {
      this.load_table = true;

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.fecha_fin.split("-").join("") +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrSsaprevaldxJ.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.contenido = data;
          this.load_table = false;
        })
        .catch((err) => {
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Reporte",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      this.contenido = this.contenido.map((item) => {
        return {
          ...item,
          cant_rep: item.cant_rep
            ? item.cant_rep.toString().replace(/,/g, "")
            : "0",
        };
      });
      var data = JSON.parse(JSON.stringify(this.contenido));
      let total_valor = 0;

      var data_parse = data;

      var columnas = [
        {
          title: "Codigo CIE",
          value: "codcie_rep",
        },
        {
          title: "Descripcion",
          value: "descripcie_rep",
        },
        {
          title: "Cantidad",
          value: "cant_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Especialidad",
          value: "especialidad_rep",
        },
      ];
      var fecha_inicial = this.fecha_actual;
      var fecha_final = this.fecha_fin;

      var header_format = [
        { text: "REPORTE PREVALENCIAS", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Prevalencias",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PREVALENCIAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
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

