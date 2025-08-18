<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-printer-check</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Impresión Facturación</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row>
          <v-col class="d-flex" cols="3">
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
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @change="cargarcontenido"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="4" v-if="contenido.length">
            <v-btn
              color="indigo"
              class="ma-2 white--text px-12"
              depressed
              large
              @click="impresion_masiva"
            >
              Impresión masiva
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-end" cols="4" v-if="contenido.length">
            <v-btn
              color="orange"
              class="ma-2 white--text px-12"
              depressed
              large
              @click="enviarMasivo"
            >
              Envio Masivo
              <v-icon right dark>mdi-gmail</v-icon>
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
              item-key="numero_fact"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>

              <template v-slot:item.idcliente_fact="{ item }">
                {{ parseInt(item.idcliente_fact) }}
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  @click="cargarfactura(item)"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <template v-slot:item.email="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="orange"
                  class="white--text"
                  @click="cargarfactura(item, true)"
                >
                  <v-icon>mdi-email-arrow-right-outline</v-icon>
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
import { factura_titan } from "../../_formatos_ph.js";
import { PDFDocument } from "pdf-lib";
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
      datosEmpresa: [],
      ruts3: [],
      search: "",
      form: {},

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id.Unidad", align: "center", value: "idcliente_fact" },
        { text: "Unidad", align: "center", value: "unidadph_fact" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "cliente_fact",
        },
        { text: "Email", align: "left", value: "email_fact" },
        { text: "Factura", align: "center", value: "numero_fact" },
        { text: "Valor", align: "center", value: "valor_fact" },
        { text: "Imprimir", value: "imprimir", align: "center" },
        { text: "Correo", value: "email", align: "center" },
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
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogoModificar: {
        estado: false,
        data: {},
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
    };
  },
  created() {
    this.get_empresa();
  },
  methods: {
    async enviarMasivo() {
      let items = this.contenido;

      for (const item of items) {
        if (item.email_fact && item.email_fact.trim() !== "") {
          await this.cargarfactura(item, true);
        }
      }

      console.log("proceso terminado");
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
    async impresion_masiva() {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      let logo = await this.pdfs.getBase64(logo_src);

      let data = this.contenido;
      let pdfs = [];
      for (const item of data) {
        let dataFactura = await this.dataFactura(item);
        this.loader = false;
        let buffer = await this.bufferFactura(dataFactura[0]);
        // let buffer = await this.imprimir_factura(dataFactura[0]);

        pdfs.push(buffer);
      }

      const pdfDoc = await PDFDocument.create();
      for (const item of pdfs) {
        const donorPdfDoc = await PDFDocument.load(item);
        const docLength = donorPdfDoc.getPageCount();
        for (var k = 0; k < docLength; k++) {
          const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
          pdfDoc.addPage(donorPage);
        }
      }

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      const downloadLink = document.createElement("a");
      const fileName = "FACTURACION_PH.pdf";
      downloadLink.href = pdfDataUri;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    async dataFactura(data) {
      let consec = data.numero_fact;
      let prefijo = "PH";
      let agencia = "0001";
      let fecha = data.fecha_fact.substring(0, 4);
      this.loader = true;

      return await post.postData({
        url: "Phorizontal/dlls/PrFact01J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          prefijo +
          "|" +
          consec +
          "|" +
          fecha +
          "|",
        method: "",
      });
    },
    async bufferFactura(item) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      let logo = await this.pdfs.getBase64(logo_src);
      item.logo = logo;

      return await factura_titan(item, logo, true);
    },
    async cargarfactura(item, sendEmail) {
      try {
        let consec = item.numero_fact;
        let prefijo = item.pref_fact;
        let agencia = "0001";
        let fecha = item.fecha_fact.substring(0, 4);
        this.loader = true;

        const data = await post.postData({
          url: "Phorizontal/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            prefijo +
            "|" +
            consec +
            "|" +
            fecha +
            "|",
          method: "",
        });

        this.loader = false;

        await this.imprimir_factura(data[0], sendEmail);
      } catch (err) {
        console.log(err);
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar Factura",
          estado: true,
        });
      }
    },

    async imprimir_factura(data, sendEmail) {
      let descripcion64 = " ";

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      // const logo = await this.pdfs.getBase64(logo_src);
      await this.pdfs.getBase64(logo_src).then(async (logo) => {
        data.logo = logo;
        data.condicion = this.condicion_pdf;

        await factura_titan(data, false, sendEmail).then(async (blobData) => {
          if (blobData instanceof Uint8Array) {
            blobData = new Blob([blobData], { type: "application/pdf" });
          }

          if (sendEmail) {
            await this.enviarCorreo(blobData, data);
          } else {
            _this.loadCard = false;
          }
        });

        return true;
      });
    },
    async enviarCorreo(blob, data) {
      function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64data = reader.result.split(",")[1]; // quitar el encabezado data:application/pdf;base64,
            resolve(base64data);
          };

          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      let descrip_envio = this.datosEmpresa.descrip_empr.trim();
      let periodo = this.form.fecha;
      const pdfBase64 = await blobToBase64(blob);

      data.usuario_rep = "propiedadhorizontal@titansoluciones.cloud";
      data.servidor_rep = "smtp.hostinger.com";
      data.clave_rep = "T1tan2050.";

      var urlEnvio = "https://server1ts.net//financiero/inc/envio.ph.aws.php";

      var formData = new FormData();
      formData.append("correo_destino", data.email_cliente.trim());
      formData.append("logo", parseFloat(sessionStorage.Sesion.substr(0, 15)));
      formData.append("remitente_email", descrip_envio);
      formData.append("periodo", periodo);
      formData.append("pdf_base64", pdfBase64);

      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          this.loadCard = false;
          if (res.code == 0) {
            this.$emit("snack", {
              color: "green",
              text: res.msj,
              estado: true,
            });
          } else {
            this.$emit("snack", {
              color: "error",
              text: res.msj,
              estado: true,
            });
          }
        })
        .catch((err) => {
          this.loadCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al enviar correo",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/PrFact02J.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = [];
          let res = JSON.parse(JSON.stringify(data));
          this.contenido = res.map((el) => {
            el.basesfactura_rep = [];
            return el;
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Facturación",
            estado: true,
          });
        });
    },
  },
};
</script>
