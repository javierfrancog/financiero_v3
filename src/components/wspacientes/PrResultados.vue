
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
              <v-icon size="30" color="blue darken-4 ">mdi-prescription</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Resultados Médicos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  :items="anios_select"
                  label="Año de la factura"
                  outlined
                  clearable
                  hide-details
                  v-model="form.anoserv"
                  item-text="text"
                  item-value="value"
                  required
                  @change="cargarAgendamiento()"
                  :error="errores.anoserv"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col class="mb-4" cols="6">
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
              v-if="agendaPaciente.length > 0"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="item_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.id_paciente="{ item }">
                {{ parseInt(item.id_paciente) }}
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>

              <template v-slot:item.btn_cargue1="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="indigo"
                      class="ma-2 white--text"
                      @click="get_imagen(item, 1)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-google-classroom</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Imagen</span>
                </v-tooltip>
              </template>
              <template v-slot:item.btn_cargue2="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red"
                      class="ma-2 white--text"
                      @click="get_imagen(item, 2)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Pdf</span>
                </v-tooltip>
              </template>
              <template v-slot:item.btn_cargue3="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="purple"
                      class="ma-2 white--text"
                      @click="get_reporte(item)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-abjad-hebrew</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Reporte</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="!!loader" fixed style="z-index: 3000">
      <v-card
        color="primary"
        dark
        flat
        class="d-flex flex-column align-center pa-6"
      >
        <v-progress-circular indeterminate color="white" size="50" />
        <span v-if="typeof loader === 'string'" class="mt-4">{{ loader }}</span>
      </v-card>
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { lecturas_rx } from "../../_formatos_sal.js";

import { PDFDocument } from "pdf-lib";

export default {
  // components: {
  //   FlowerSpinner,
  // },

  data() {
    return {
      loader: false,

      search: "",
      pickerActual: false,
      load_table: false,
      selectSala: null,
      load_card: false,
      agendaPaciente: [],
      archivos: [],
      anios_select: [],
      tipo_cargue: 0,
      preview_files: [],
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        año: 0,
        item: 0,
        ruta: null,
        consecutivo: null,
        tituloDialogo: "",
      },
      form: {
        anioserv: null,
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      errores: {
        salas: false,
      },
      headers: [
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Examen", align: "center", value: "desc_servicio" },

        { text: "Reporte", align: "center", value: "btn_cargue3" },
        { text: "Imagenes", align: "center", value: "btn_cargue1" },
        { text: "Anexos", align: "center", value: "btn_cargue2" },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.cargar_años();
  },

  methods: {
    async get_imagen(item, tipo) {
      this.loader = "Obteniendo Imagénes...";
      if (tipo == 2) {
        this.loader = "Obteniendo Pdfs...";
      }

      const consecutivo = parseFloat(item.consec_rep);
      const item_envio = item.item_rep;
      const año = item.fecha.substring(0, 4);
      const empresa = parseFloat(sessionStorage.Sesion.substring(0, 15));
      const extension = tipo === 2 ? ".pdf" : ".bmp";

      let index = 1;
      let encontrados = 0;
      const urls_encontradas = [];

      while (index < 20) {
        const nro_item = String(index).padStart(3, "0");
        const nombre_archivo = `${empresa}_${año}_RX_${consecutivo}_${item_envio}_${nro_item}${extension}`;
        const url = `https://storage.googleapis.com/documentos_titan/SALUD/${nombre_archivo}`;

        const existe = await this.verificarConArchivo(url, tipo);
        if (!existe) break;

        urls_encontradas.push(`${url}?_=${Date.now()}`);
        encontrados++;
        index++;
      }

      if (encontrados === 0) {
        this.$emit("snack", {
          color: "error",
          text: "No se encontraron archivos disponibles.",
          estado: true,
        });
        this.loader = false;
        return;
      }

      if (tipo === 1) {
        // Mostrar imágenes como galería
        const ventana = window.open("", "_blank");
        const contenidoHTML = `
      <html>
        <head>
          <title>Imágenes</title>
          <style>
            body { font-family: sans-serif; text-align: center; background: #f4f4f4; }
            img { max-width: 90%; margin: 20px auto; display: block; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
          </style>
        </head>
        <body>
          <h2>Archivos encontrados (${encontrados})</h2>
          ${urls_encontradas.map((url) => `<img src="${url}" />`).join("")}
        </body>
      </html>
    `;
        ventana.document.write(contenidoHTML);
        ventana.document.close();
      } else {
        // Combinar PDFs en uno solo
        const mergedPdf = await PDFDocument.create();

        for (const url of urls_encontradas) {
          const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
          );
          const pdf = await PDFDocument.load(existingPdfBytes);
          const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();

        // Crear blob y abrirlo en nueva pestaña
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      }

      this.loader = false;
    },
    async verificarConArchivo(url, tipo) {
      if (tipo === 1) {
        // Verificación con <img> para imágenes
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url + "?_=" + Date.now(); // Previene caché
        });
      }

      if (tipo === 2) {
        // Verificación HEAD para PDF
        try {
          const response = await fetch(url, {
            method: "HEAD",
            cache: "no-store",
          });

          return response.ok; // true si 200, false si 404
        } catch (error) {
          console.log("Error al verificar PDF:", error);
          return false;
        }
      }

      return false;
    },
    cargarAgendamiento() {
      this.load_table = true;
      this.agendaPaciente = [];
      let fecha = this.form.anoserv;
      let paciente = sessionStorage.Sesion.substring(15, 30);
      let datos = sessionStorage.Sesion + "|" + fecha + "|" + paciente + "|";
      post
        .postData({
          url: "Clinico/dlls/ClRpPrestrx02J.dll",
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
            text: "Error al cargar agendamiento",
            estado: true,
          });
        });
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
      this.form.anoserv = anioActual;
      this.cargarAgendamiento();
    },
    async cargar_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|" + "98" + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    get_reporte(item) {
      //1122537806
      let fecha = item.fecha.substr(0, 4);
      let datosEnvio =
        sessionStorage.Sesion +
        "|" +
        item.prservicio +
        "|" +
        fecha +
        "|" +
        98 +
        "|";

      post
        .postData({
          url: "Clinico/dlls/ClprLect01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          var base64 = "";
          data[0].lectura.forEach((el) => {
            Object.getOwnPropertyNames(el).forEach((item) => {
              let string = el[item];
              base64 += string;
            });
          });
          let html = Buffer.from(base64, "base64").toString("utf-8");
          var html_pdfmake = htmlToPdfmake(html);

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          // var firma_src = require(`../../assets/image/firmas/${parseFloat(
          //   this.selectPersonal
          // )}.png`);
          var firma_src = require(`../../assets/image/firmas/vacio.png`);

          let dataParse = {
            ...item,
            ciudad_empr: this.empresa[0].Ciudad,
            telefono_empr: this.empresa[0].telefono_empr,
            direccion_empr: this.empresa[0].direccion_empr,
            nombre_per: data[0].medico,
            nro_per: data[0].nro_registro,
            consec: parseFloat(item.consec_rep),
          };

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataParse.logo = logo;
            this.pdfs.getBase64(firma_src).then((firma) => {
              dataParse.firma = firma;
              lecturas_rx(dataParse, html_pdfmake).then(() => {
                console.log("Impresión terminada");
              });
            });
          });
        })
        .catch((error) => {
          console.error("Error", error);
          this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error consultando la información",
            estado: true,
          });
        });
    },
  },
};
</script>