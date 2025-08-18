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
                >mdi-file-document-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Consulta de Historia Clinica</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ultimo digito del Id del paciente"
                  v-model="form.indice"
                  :items="indice"
                  hide-details
                  return-object
                  @change="get_contenido()"
                  filled
                  shaped
                ></v-autocomplete>
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
              :loading="load_table"
              :headers="headers"
              :items="contenido"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.idpaciente_rep="{ item }">
                {{ parseInt(item.idpaciente_rep) }}
              </template>
              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
              </template>

              <template v-slot:item.btn_atender="{ item }">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  :disabled="item.nrohcl == 0"
                  @click="imprimir_hc(item, 1)"
                  >Imprimir</v-btn
                >
              </template>
              <template v-slot:item.descrip_paciente="{ item }">
                {{ item.nombre1_rep + " " + item.apellido1_rep }}
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
import { historiaClinica } from "../../_formatos_sal.js";
import { OrdenMedica, incapacidad } from "../../_formatos_sal.js";
import PDFMerger from "pdf-merger-js/browser";

export default {
  components: {},
  data() {
    return {
      search: null,
      pickerActual: false,
      load_personal: true,
      selectPersonal: null,
      load_table: false,
      texto_descripcion: null,

      idpaciente: 0,
      nro_hist: 0,

      indice: [
        { text: "0", value: 0 },
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "6", value: 6 },
        { text: "7", value: 7 },
        { text: "8", value: 8 },
        { text: "9", value: 9 },
      ],
      seccion: [],
      contenido: [],

      form: {
        motivo: null,
      },
      tab: 0,

      fecha_actual: this.$moment().format("YYYY-MM-DD"),

      headers: [
        {
          text: "Fecha",
          align: "center",
          value: "fecha_rep",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Nro_Historia",
          align: "center",
          value: "nro_rep",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Id paciente",
          align: "center",
          value: "idpaciente_rep",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Imprimir",
          align: "center",
          value: "btn_atender",
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
  methods: {
    get_contenido() {
      this.loader = true;
      let indice = this.form.indice.value;
      post
        .postData({
          url: "/Clinico/dlls/RpHclinicaIJ.dll",
          data: sessionStorage.Sesion + "|" + indice + "|",
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
            text: "Error al cargar Historias",
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    async imprimir_hc(item, estado) {
      let paciente = item.idpaciente_rep;
      this.idpaciente = paciente;
      let consecutivo = item.nro_rep;

      let profesional = parseInt(item.idprofesional_rep);
      if (item.firma_rep == "2") {
        profesional = "0000000000";
      }

      post
        .postData({
          url: "Clinico/dlls/ClHclinicaJ.dll",
          data:
            sessionStorage.Sesion + "|" + paciente + "|" + consecutivo + "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          data = JSON.parse(JSON.stringify(data))[0];
          data.edad_rep = data.edad_rep.replace("n", "ñ");
          data.empresa = this.datosEmpresa;
          let profesional2 = parseInt(data.idprofes2_rep);

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = require(`../../assets/image/firmas/${parseFloat(
            profesional
          )}.png`);

          if (parseInt(profesional2) > 0) {
            let firma2_src = require(`../../assets/image/firmas/${parseFloat(
              profesional2
            )}.png`);

            let firma2 = await this.pdfs.getBase64(firma2_src);
            data.firma2 = firma2;
          }
          let logo = await this.pdfs.getBase64(logo_src);
          let firma = await this.pdfs.getBase64(firma_src);

          data.logo = logo;
          data.firma = firma;
          let blobHistoriaClinica = await historiaClinica(data, true);

          // let arrBlob = await this.procesar_ordenes(consecutivo, profesional);
          // arrBlob.unshift(blobHistoriaClinica);

          // const merger = new PDFMerger();
          // for (const file of arrBlob) {
          //   if (file) await merger.add(file);
          // }

          // const mergedPdf = await merger.saveAsBlob();
          // const url = URL.createObjectURL(mergedPdf);

          // window.open(url);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir Historia",
            estado: true,
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

