<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="load.card"
        :disabled="load.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-chart-bar</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline"
                >Reporte Consumo documentos Electrónicos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-left">
              <v-col cols="12">
                <v-btn
                  color="indigo"
                  class="mr-2 white--text px-12"
                  large
                  depressed
                  @click="get_contenido"
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
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center align-center">
              <v-col cols="6">
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
              :search="search"
            >
              <template v-slot:item.id_rep="{ item }">
                {{ parseInt(item.id_rep) }}
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

export default {
    components: {
    FlowerSpinner,
  },
  data() {
    return {
            loader: false,
      search: "",
      formulario: {},
      errores: {},
      contenido: [],
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      load: {
        card: false,
      },
      headers: [
        { text: "Cliente", align: "left", value: "descripcion_rep" },
        { text: "Identificación", align: "center", value: "id_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Tipo Documento", align: "center", value: "tipo_rep" },
        { text: "Cantidad", align: "center", value: "total_rep" },
        { text: "Ultimo Envio", align: "center", value: "fecha_rep" },
      ],
    };
  },
  created() {
    this.get_contenido();
  },
  methods: {
    get_contenido() {
      this.loader = true;
      this.contenido = [];
      post
        .postData({
          url: "Financiero/dlls/RpdocselecJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Alistamientos",
            estado: true,
          });
        });
    },
    descargar_excel() {
      let data = this.contenido;
      let data_parse = [];

      data.forEach((el, i) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.total_rep = parseFloat(el.total_rep.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Descripción",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Tipo Documento",
          value: "tipo_rep",
          format: "string",
        },
        {
          title: "Cantidad",
          value: "total_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
      ];

      let header_format = [
        { text: "CONSUMO DOCUMENTOS ELECTRONICOS", bold: true, size: 12 },
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte consumos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              heightRow: 15,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE CONSUMOS DOCS ELECTRONICOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
  },
};
</script>