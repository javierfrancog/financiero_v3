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
                >mdi-text-box-edit</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Historias Clinicas Detalladas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
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
                      label="Fecha AtenciÃ³n"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @input="
                      pickerActual = false;
                      fecha_fin = fecha_actual;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" md="3">
                <v-btn
                  color="indigo darken-3 white--text"
                  class="white--text px-12"
                  depressed
                  large
                  @click="cargarAgendamiento"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  color="green"
                  class="ml-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="print_reporte_excel"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>

              <!-- <v-col class="d-flex" cols="4">
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
                      label="Fecha AtenciÃ³n"
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
              </v-col> -->
            </v-row>
            <v-data-table
              :loading="load_table"
              :headers="headers"
              :items="contenido"
              item-key="nro"
              :search="search"
              class="elevation-1 mt-3"
            >
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

      load_personal: true,
      selectPersonal: null,
      load_table: false,
      texto_descripcion: null,
      fechaag: null,
      horaag: null,

      idpaciente: 0,
      nro_hist: 0,

      selectObjPersonal: [],
      contenido: [],

      form: {
        motivo: null,
      },
      tab: 0,
      personal: [],
      consecutivo: 0,
      sala: 0,

      tab2: null,
      dialogo: {
        estado: false,
        titulo: null,
        paciente: null,
        tipo: null,
        item: {},
      },
      edad: {
        anos: 0,
        meses: 0,
        dias: 0,
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      fecha_fin: this.$moment().format("YYYY-MM-DD"),
      historia: {
        estado: false,
        plantila: null,
      },
      errores: {
        salas: false,
        medico: false,
        condicion: false,
        causaing: false,
        diagnostico: false,
      },
      data: [],
      totales: {},
      headers: [
        {
          text: "Descripcion paciente",
          align: "left",
          value: "nombre1_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Historia",
          align: "center",
          value: "consecutivo_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha",
          align: "center",
          value: "fechahc_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Eps",
          align: "center",
          value: "eps_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "idpaciente_rep",
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

    print_reporte_excel() {
      function isValidBase64(str) {
        if (!str || typeof str !== "string") return false;
        if (str.length % 4 !== 0) return false;
        if (!/^[A-Za-z0-9+/=]+$/.test(str)) return false;

        try {
          atob(str);
          return true;
        } catch (e) {
          return false;
        }
      }

      var data = this.contenido;
      var data_parse = data;

      data_parse.forEach((pac) => {
        pac.secciones_rep.pop();

        pac.secciones_rep.forEach((sec) => {
          let contenido = pac[`seccion_${sec.seccion_rep}`];

          if (
            ["001", "002", "003", "005", "006", "007", "009", "010"].includes(
              sec.seccion_rep
            )
          ) {
            sec.base1_rep =
              (sec.base1_rep || "").trim() +
              (sec.base2_rep || "").trim() +
              (sec.base3_rep || "").trim() +
              (sec.base4_rep || "").trim() +
              (sec.base5_rep || "").trim() +
              (sec.base6_rep || "").trim() +
              (sec.base7_rep || "").trim() +
              (sec.base8_rep || "").trim() +
              (sec.base9_rep || "").trim() +
              (sec.base10_rep || "").trim() +
              (sec.base11_rep || "").trim() +
              (sec.base12_rep || "").trim() +
              (sec.base13_rep || "").trim() +
              (sec.base14_rep || "").trim() +
              (sec.base15_rep || "").trim() +
              (sec.base16_rep || "").trim() +
              (sec.base17_rep || "").trim() +
              (sec.base18_rep || "").trim() +
              (sec.base19_rep || "").trim() +
              (sec.base20_rep || "").trim() +
              (sec.base21_rep || "").trim() +
              (sec.base22_rep || "").trim() +
              (sec.base23_rep || "").trim() +
              (sec.base24_rep || "").trim() +
              (sec.base25_rep || "").trim() +
              (sec.base26_rep || "").trim() +
              (sec.base27_rep || "").trim() +
              (sec.base28_rep || "").trim() +
              (sec.base29_rep || "").trim() +
              (sec.base30_rep || "").trim() +
              (sec.base31_rep || "").trim() +
              (sec.base32_rep || "").trim() +
              (sec.base33_rep || "").trim() +
              (sec.base34_rep || "").trim() +
              (sec.base35_rep || "").trim() +
              (sec.base36_rep || "").trim() +
              (sec.base37_rep || "").trim() +
              (sec.base38_rep || "").trim() +
              (sec.base39_rep || "").trim();

            let textodecode;
            try {
              if (isValidBase64(sec.base1_rep)) {
                const decoded = atob(sec.base1_rep);
                const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
                textodecode = new TextDecoder("utf-8").decode(bytes);
              } else {
                textodecode = sec.base1_rep;
              }
            } catch (err) {
              console.warn(
                "Error decodificando base1_rep:",
                sec.base1_rep,
                err
              );
              textodecode = sec.base1_rep;
            }

            pac[`seccion_${sec.seccion_rep}`] =
              (contenido ? contenido : "") +
              (!contenido ? "" : " - ") +
              textodecode;
          } else {
            pac[`seccion_${sec.seccion_rep}`] =
              (contenido ? contenido : "") +
              (!contenido ? "" : " - ") +
              (sec.seccion_rep === "112"
                ? `${sec.codexamen_rep.trim()} ${sec.base1_rep.trim()}`
                : sec.seccion_rep === "113"
                ? `${sec.codordm_rep.trim()} ${sec.base1_rep.trim()}`
                : sec.seccion_rep === "111"
                ? `${sec.base1_rep.trim()} Cantidad: ${sec.cantmedic_rep.trim()}`
                : "");
          }
        });
      });

      var columnas = [
        { title: "Fecha", value: "fechahc_rep" },
        { title: "Nro Historia", value: "consecutivo_rep" },
        { title: "Id_Paciente", value: "idpaciente_rep" },
        { title: "Apellidos y Nombres", value: "nombre1_rep" },
        { title: "Edad", value: "edad_rep" },
        { title: "Eps", value: "eps_rep" },
        { title: "Profesional", value: "descprofesional" },
        { title: "Especialidad", value: "especialidad_rep" },
        {
          title: "001-Motivo Consulta",
          value: "seccion_001",
          format: "string",
        },
        {
          title: "002-Enfermedad Actual",
          value: "seccion_002",
          format: "string",
        },
        { title: "003-Antecedentes", value: "seccion_003", format: "string" },
        { title: "004-Signos Vitales", value: "seccion_004", format: "string" },
        {
          title: "005-Revision por sistemas",
          value: "seccion_005",
          format: "string",
        },
        { title: "006-Examen Fisico", value: "seccion_006", format: "string" },
        { title: "007-Paraclinicos", value: "seccion_007", format: "string" },
        { title: "008-Diagnostico", value: "seccion_008", format: "string" },
        { title: "009-Analisis", value: "seccion_009", format: "string" },
        {
          title: "010-Plan de Tratamiento",
          value: "seccion_010",
          format: "string",
        },
        { title: "111-Medicamentos", value: "seccion_111", format: "string" },
        { title: "112-Laboratorios", value: "seccion_112", format: "string" },
        { title: "113-Ordenes", value: "seccion_113", format: "string" },
      ];

      var header_format = [
        { text: "REPORTE HISTORIAS CLINICAS", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Historias Clinicas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `DETALLADO HISTORIAS-${new Date().getTime()}`,
          })
          .then(() => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarAgendamiento: function (value) {
      this.load_table = true;
      this.contenido = [];
      let fecha_fin = this.fecha_actual.split("-").join("");

      let atendidos = this.form.atendidos ? "9" : "0";
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        fecha_fin +
        "|" +
        atendidos +
        "|";
      post
        .postData({
          url: "Clinico/dlls/RpHclinicadetJ.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.load_table = false;
        })
        .catch((err) => {
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Historias",
            estado: true,
          });
        });
    },
    clear_form() {},

    decode_uno(base64) {
      return decodeURIComponent(escape(atob(base64)));
    },
    decode_dos(base64) {
      return atob(base64);
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

