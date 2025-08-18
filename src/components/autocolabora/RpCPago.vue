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
                  label="Fecha de Nómina"
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
          <v-col class="d-flex" cols="12" sm="3">          
          <v-btn
            color="red"
            class="ma-2 white--text px-12 d-flex justify-end"
            large
            depressed
            @click="print_item"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Generar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
        </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">

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
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { pago_nomina } from "../../_formatos_gth.js";

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
  },
  computed: {},
  methods: {
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
      
      var idNomina = sessionStorage.Sesion.substr(15,15);
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

        return true
        // if (sendEmail) {
        //   const pdfDocGenerator = pdfMake.createPdf(dd);
        //   pdfDocGenerator.getBlob((blob) => {
        //     _this.enviarCorreo(blob, data);
        //   });
        // } else {
        //   _this.loadCard = false;
        //   pdfMake.createPdf(dd).open();
        // }
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
