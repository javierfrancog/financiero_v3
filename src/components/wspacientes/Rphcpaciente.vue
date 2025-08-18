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
                <v-text-field
                  label="Id_Paciente"
                  outlined
                  hide-details
                  disabled
                  v-model="form.id_paciente"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargarAgendamiento()"
                  >Consultar</v-btn
                >
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
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
              </template>

              <template v-slot:item.idpaciente_rep="{ item }">
                {{ parseInt(item.idpaciente_rep) }}
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

      datosagenda: [],
      plantilla: [],

      seccion: [],
      agendaPaciente: [],

      form: {
        motivo: null,
      },
      tab: 0,

      personal: [],
      fechaag: null,
      horaag: null,
      consecutivo: 0,

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
      historia: {
        estado: false,
        plantila: null,
      },
      medicamentos: {
        estado: false,
        plantila: null,
      },
      examenes: {
        estado: false,
        plantila: null,
      },
      remision: {
        estado: false,
        plantila: null,
      },

      errores: {
        salas: false,
        cldx: false,
        condicion: false,
        causaing: false,
        diagnostico: false,
      },

      headers: [
        {
          text: "Nro_Historia",
          align: "center",
          value: "nro_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha",
          align: "center",
          value: "fecha_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "idpaciente_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Imprimir",
          align: "center",
          value: "btn_atender",
          class: "indigo--text blue lighten-5",
        },

        // { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
      panel: [],
    };
  },
  created() {
    // this.form.id_paciente = 1121842825;
    this.get_empresa();
    this.form.id_paciente = `${parseFloat(
      sessionStorage.Sesion.substr(16, 14)
    )}`;
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|" + 98 + "|",
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
    cargarAgendamiento: function (value) {
      this.load_table = true;
      let paciente = this.form.id_paciente;

      let datos = sessionStorage.Sesion + "|" + paciente + "|" + 98 + "|";
      post
        .postData({
          url: "Clinico/dlls/ClHclinica02J.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.agendaPaciente = data;
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
    async imprimir_hc(item, estado) {
      let paciente = item.idpaciente_rep;
      this.idpaciente = paciente;
      let consecutivo = item.nro_rep;
      let profesional = parseInt(item.idprofesional_rep);
      post
        .postData({
          url: "Clinico/dlls/ClHclinicaJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            paciente +
            "|" +
            consecutivo +
            "|" +
            98 +
            "|",
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

          let arrBlob = await this.procesar_ordenes(consecutivo, profesional);
          arrBlob.unshift(blobHistoriaClinica);

          const merger = new PDFMerger();
          for (const file of arrBlob) {
            if (file) await merger.add(file);
          }

          const mergedPdf = await merger.saveAsBlob();
          const url = URL.createObjectURL(mergedPdf);

          window.open(url);
          // var a = document.createElement("a");
          // document.body.appendChild(a);
          // a.style = "display: none";
          // a.href = url;
          // a.download = "file.pdf";
          // a.click();
          // window.URL.revokeObjectURL(url);
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
    async procesar_ordenes(consecutivo, profesional) {
      let seccion = 111;
      let print1 = await this.imprimir_ordenes(
        seccion,
        consecutivo,
        profesional
      );
      seccion = 112;
      let print2 = await this.imprimir_ordenes(
        seccion,
        consecutivo,
        profesional
      );
      seccion = 113;
      let print3 = await this.imprimir_ordenes(
        seccion,
        consecutivo,
        profesional
      );
      seccion = 114;
      let print4 = await this.imprimir_ordenes(
        seccion,
        consecutivo,
        profesional
      );
      seccion = 115;
      let print5 = await this.imprimir_ordenes(
        seccion,
        consecutivo,
        profesional
      );

      return [print1, print2, print3, print4, print5];
    },
    async imprimir_ordenes(seccion, consecutivo, profesional) {
      return new Promise((res) => {
        post
          .postData({
            url: "Clinico/dlls/ClHclinica01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              seccion +
              "|" +
              this.idpaciente +
              "|" +
              98 +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;

            data = JSON.parse(JSON.stringify(data))[0];
            let secciones = data.secciones_rep;
            const resultado = await this.verificarSecciones(secciones, seccion);
            data.empresa = this.datosEmpresa;

            var logo_src = require(`../../assets/image/clientes/${parseFloat(
              sessionStorage.Sesion.substr(0, 15)
            )}.png`);

            let firma_src = require(`../../assets/image/firmas/${parseFloat(
              profesional
            )}.png`);
            let logo = await this.pdfs.getBase64(logo_src);
            let firma = await this.pdfs.getBase64(firma_src);
            data.logo = logo;
            data.firma = firma;

            await this.pdfs.getBase64(logo_src).then(async (logo) => {
              data.logo = logo;

              if (seccion === 114) {
                await incapacidad(data, true, resultado).then((blob) => {
                  console.log("Impresion Incapacidad", seccion);
                  if (resultado == false) {
                    blob = resultado;
                  }
                  res(blob);
                });
              } else {
                await OrdenMedica(data, true, resultado).then((blob) => {
                  console.log("Impresion Orden", seccion);
                  if (resultado == false) {
                    blob = resultado;
                  }
                  res(blob);
                });
              }

              // await OrdenMedica(data, true, resultado).then((blob) => {
              //   console.log("Impresion terminada");
              //   if (resultado == false) {
              //     blob = resultado;
              //   }
              //   res(blob);
              // });
            });

            console.log(resultado);
          })
          .catch((err) => {
            res(null);
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Historia",
              estado: true,
            });
          });
      });
    },
    async verificarSecciones(data, seccion) {
      return data.some((item) => {
        if (!item.seccion_rep || item.seccion_rep.trim() === "") {
          return false;
        }
        const seccion = String(item.seccion_rep).trim();
        return seccion !== "008";
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

