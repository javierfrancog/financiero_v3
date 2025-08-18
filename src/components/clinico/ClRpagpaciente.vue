<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1500" elevation="5">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-clock-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Consulta Agenda de Paciente Cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="años_select"
                  label="Año a Consultar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  type="number"
                  required
                  v-model="id_numero"
                  @keyup.enter="procesarbusqueda()"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="procesarbusqueda()"
                  >Buscar</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-btn
                  v-if="agendas.length != 0"
                  class="ma-2 white--text"
                  color="purple"
                  @click="imprimir_masivo()"
                  >Recordatorio Masivo</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  v-if="agendas.length != 0"
                  @click="print_reporte_excel()"
                >
                  Generar Excel</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center"></v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="agendas.length != 0"
            >
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
              v-if="agendas.length != 0"
              :loading="load_table"
              :headers="headers"
              :items="agendas"
              item-key="numero"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado_ag="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${item.estado_ag == 2 ? 'red' : 'green'} darken-1`"
                  >{{ item.estado_ag == 2 ? "Cancelada" : "Activa" }}</v-chip
                >
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
import { PDFDocument } from "pdf-lib";
import { recordatorioCitas } from "../../_formatos_sal.js";
export default {
  data() {
    return {
      search: null,
      load_table: false,
      id_numero: "",
      agendas: [],
      años_select: [],
      form: {},

      errores: {
        anoselect: false,
      },

      headers: [
        { text: "Fecha", align: "left", value: "fecha_ag", width: "110px" },
        { text: "Hora", align: "center", value: "hora_ag" },

        { text: "Estado", align: "center", value: "estado_ag" },
        { text: "Profesional/Sala", align: "left", value: "sala_rep" },
        { text: "Contrato", align: "left", value: "contrato_rep" },
        { text: "Paciente", align: "left", value: "descrip_paciente" },
        { text: "F_Atención", align: "center", value: "fecha_at" },
        { text: "Hora_Atención", align: "center", value: "hora_at" },
        { text: "Servicio", align: "left", value: "servicio" },
        { text: "Régimen", align: "left", value: "regimen" },
        { text: "Autorización", align: "left", value: "autorizacion" },
        { text: "Aut. Eps", align: "left", value: "autoeps" },
        { text: "Agendó", align: "left", value: "agendo_rep" },
        { text: "Fecha_Registro", align: "center", value: "fechaagendo_rep" },
      ],
    };
  },
  created() {
    this.cargar_años();
  },
  watch: {},
  computed: {},
  methods: {
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.agendas));
      var data_parse = data;

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_ag",
          format: "string",
        },
        {
          title: "Hora",
          value: "hora_ag",
          format: "string",
        },
        {
          title: "Servicio",
          value: "servicio",
          format: "string",
        },
        {
          title: "Estado",
          value: "descrestado_rep",
          format: "string",
        },

        {
          title: "Profesional",
          value: "sala_rep",
          format: "string",
        },
      ];
      columnas.forEach((col) => {
        let maxLength = Math.max(
          col.title.length, // Longitud del título de la columna
          ...data_parse.map((row) => row[col.value]?.toString().length || 0)
        );
        col.width = `${maxLength + 2}ch`; // Añadir margen adicional
      });

      let paciente = this.agendas[0].descrip_paciente.trim();

      var header_format = [
        { text: "AGENDAMIENTO PACIENTE", bold: true, size: 14 },
        `Paciente: ${paciente}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Agenda Paciente",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `AGENDAMIENTO PACIENTE-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo_cargue = anioActual;
    },
    evaluar_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Anulado";
      else if (estado == "2") return "Pte x Facturar";
    },
    procesarbusqueda: function () {
      post
        .postData({
          url: "Clinico/dlls/ClRpagepaciente.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.id_numero +
            "|" +
            this.form.periodo_cargue +
            "|",
          method: "",
        })
        .then((data) => {
          this.agendas = data;
        })
        .then((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar datos paciente",
            estado: false,
          });
        });
    },
    async imprimir_masivo() {
      // Obtén el logo en formato base64
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      let logo = await this.pdfs.getBase64(logo_src);

      // Filtra los datos según el estado
      let data = this.agendas.filter((dato) => dato.estado_ag === "0");
      let pdfs = [];

      for (const dato of data) {
        let fecha = dato.fecha_ag.replace(/-/g, "");
        let horaagenda = dato.hora_ag.replace(/:/g, "");
        let fecha_actual = this.$moment().format("YYYYMMDD");

        if (fecha === fecha_actual || fecha > fecha_actual) {
          try {
            // Llama a la API para obtener los datos necesarios
            let response = await post.postData({
              url: "Clinico/dlls/Rpagepac01J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                dato.idagenda_ag +
                "|" +
                fecha +
                "|" +
                horaagenda +
                "|",
              method: "",
            });

            let dataFactura = response[0];
            dataFactura.logo = logo;

            // Genera el PDF en buffer y agrega a la lista
            let buffer = await this.bufferCita(dataFactura);
            pdfs.push(buffer);
          } catch (err) {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al imprimir Agenda",
              estado: true,
            });
          }
        }
      }

      // Combina todos los buffers en un único PDF
      const pdfDoc = await PDFDocument.create();
      for (const item of pdfs) {
        const donorPdfDoc = await PDFDocument.load(item);
        const docLength = donorPdfDoc.getPageCount();
        for (let i = 0; i < docLength; i++) {
          const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [i]);
          pdfDoc.addPage(donorPage);
        }
      }

      // Descarga el PDF final
      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfDataUri;
      downloadLink.download = "AGENDA_CITAS.pdf";
      downloadLink.click();
    },

    async bufferCita(data) {
      return new Promise((resolve) => {
        recordatorioCitas(data, true).then((buffer) => {
          resolve(buffer);
        });
      });
    },
  },
};
</script>
