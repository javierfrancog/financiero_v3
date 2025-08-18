<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-digital-ocean</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Reportes Cajacopi</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha_ini"
                      label="Periodo Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="3">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha_final"
                      label="Periodo Final"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center">
                <v-btn
                  class="ma-2 px-4"
                  color="indigo white--text"
                  depressed
                  large
                  @click="generar_reporte()"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                  ><v-icon size="20" left>mdi-book-outline</v-icon>Generar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  FlowerSpinner,

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      pickerUltimoPeriodo: false,

      singleExpand: true,
      agencias: [],
      expanded: [],
      contenido: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      headers: [],
      detalle: [],
      adjunto: null,
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
    };
  },
  created() {
    this.form = {
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      fecha_final: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    generar_reporte() {
      var fechaini = this.form.fecha_ini.replace(/\-/g, "");
      var fechafin = this.form.fecha_final.replace(/\-/g, "");
      this.btnEnvio.loader = true;
      post
        .postData({
          url: "Clinico/dlls/RpCajacopi1J.dll",
          data: sessionStorage.Sesion + "|" + fechaini + "|" + fechafin + "|",
          method: "",
        })
        .then((data) => {
          this.excel_formato1(data);
          this.btnEnvio.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.btnEnvio.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar reporte",
            estado: true,
          });
        });
    },
    excel_formato1(data) {
      var data_parse = JSON.parse(JSON.stringify(data));

      var columnas = [
        {
          title: "Municipio",
          value: "municipio_rep",
        },
        {
          title: "Tipo Documento",
          value: "tipoid_rep",
        },
        {
          title: "Número Documento",
          value: "idpaciente_rep",
        },
        {
          title: "Fecha de Autorización",
          value: "",
        },
        {
          title: "Numero Autorización",
          value: "autorizacion_rep",
          format: "string",
        },
        {
          title: "Servicio Autorizado",
          value: "cups_rep",
          format: "string",          
        },
        {
          title: "Fecha Prestacion de Servicio",
          value: "fechaserv_rep",
          format: "string",
        },
        {
          title: "Ips que presta el Servicio",
          value: "ipsserv_rep",
        },
        {
          title: "Observación",
          value: "",
        },
      ];

      var fecha_inicial = this.form.fecha_ini;
      var fecha_final = this.form.fecha_final;
      var header_format = [
        { text: "REPORTE CAJACOPI", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato 2",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `FORMATO_CAJACOPI_${new Date().getTime()}`,
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
