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
                >Comprobantes de Pago</v-list-item-title
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
                  label="Fecha de NÃ³mina"
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

          <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="justify-end">
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
          <v-btn
            color="success"
            class="ma-2 white--text px-12 d-flex justify-end"
            large
            depressed
            @click="enviarMasivo"
          >
            Envio masivo
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
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
              :expanded.sync="expanded"
              show-expand
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-btn
                  @click="print_item(item, false)"
                  color="blue accent-3"
                  fab
                  small
                  icon
                >
                  <v-icon>print</v-icon>
                </v-btn>
                <v-btn
                  @click="print_item(item, true)"
                  color="blue accent-3"
                  fab
                  small
                  icon
                >
                  <v-icon>mail</v-icon>
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
import { pago_nomina } from "@/_formatos_gth.js";

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
      agencias: [],
      contenido: [],

      search: "",
      form: {},
      periodos: [
        { text: "Mensual", value: 1 },
        { text: "1ra Quincena", value: 2 },
        { text: "2da Quincena", value: 3 },
        { text: "Nomina Adicional", value: 4 },
        { text: "Prima 1er Semestre", value: 6 },
        { text: "Prima 2do Semestre", value: 7 },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "IdentificaciÃ³n", align: "left", value: "idnomina_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Opciones", value: "edit", align: "center" },
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
        precision: 2,
        masked: false,
      },
      empresa: {},
      loadCard: false,
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    async enviarMasivo() {
      let items = this.contenido;

      for (const item of items) {
        await this.print_item(item, true);
      }
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
          this.agencias.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas las Agencias",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        });
    },
    async print_item(item, sendEmail) {
      var fecha = this.form.fecha.replace(/\-/g, "");
      var tipo = this.form.periodo.value;
      var idNomina = item.idnomina_rep;
      var sesion = sessionStorage.Sesion;

      var datosEnvio = sesion + "|" + fecha + "|" + tipo + "|" + idNomina + "|";
      this.loadCard = true;
      await post
        .postData({
          url: "Financiero/dlls/RpGthCpagoJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          await this.format_impresion(data[0], sendEmail);
        })
        .catch((err) => {
          this.loadCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar los datos",
            estado: true,
          });
        });
    },
    async format_impresion(data, sendEmail) {
      var _this = this;
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      await this.pdfs.getBase64(logo_src).then(async (logo) => {
        data.empresa = _this.empresa;
        data.logo = logo;

        await pago_nomina(data, sendEmail).then(async (blob) => {
          if (sendEmail) {
            await _this.enviarCorreo(blob, data);
          } else {
            _this.loadCard = false;
          }
        });

        return true;
      });
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
      const pdfBase64 = await blobToBase64(blob);
      let descrip_envio = this.empresa.descrip_empr.trim();
      let periodo = this.form.periodo.text + " " + this.form.fecha;

      var urlEnvio =
        "https://server1ts.net//financiero/inc/envio.nomina.aws.php";
      var formData = new FormData();
      formData.append("correo_destino", data.correonomina_rep.trim());
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
            text: "Error al cargar Cargos",
            estado: true,
          });
        });
    },
    init_form() {
      this.form = {
        codigo: null,
      };

      this.errores = {
        codigo: false,
      };
    },
    cargarcontenido() {
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.form.periodo.value || "0";
      let agencia = this.form.agencia.codigo_agc;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpGthCpagobJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            periodo +
            "|" +
            agencia +
            "|",
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
            text: "Error al cargar Cargos",
            estado: true,
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

