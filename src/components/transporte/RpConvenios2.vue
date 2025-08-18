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
                >mdi-bus-stop-uncovered</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Ordenes Convenios</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="
                      pickeFechaIni = false;
                      form.fechaFinal = form.fechaInicial;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  :items="convenios"
                  label="Convenio"
                  outlined
                  clearable
                  hide-details
                  v-model="form.convenio"
                  item-value="value"
                  required
                  :error="errores.convenio"
                  @change="errores.ciudadorig = false"
                >
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="consultar_reporte"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="contenido.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
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
              item-key="index"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_tiq == "1" ? "Anulado" : "Activo"
              }}</template>

              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
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
import { tiquete_transporte } from "../../_formatos_trans.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      placas: [],
      search: "",
      total_valor: 0,
      total_cantidad: 0,
      total_rpc: 0,
      total_egresos: 0,
      total_redbus: 0,
      total_pinbus: 0,
      total_tdebito: 0,
      total_tcredito: 0,
      total_convenios: 0,
      convenios: [
        { text: "1. Brasilia", value: 1 },
        { text: "2. Red Bus", value: 2 },
        { text: "3. PinBus", value: 3 },
        { text: "4. Gamarra", value: 11 },
      ],

      fpago: [
        { text: "Todas la formas de Pago", value: 0 },
        { text: "Efectivo", value: 1 },
        { text: "Yates", value: 6 },
        { text: "Convenio Brasilia", value: 9 },
        { text: "Redbus", value: 7 },
        { text: "PinBus", value: 10 },
        { text: "Tarjeta Crédito", value: 2 },
        { text: "Tarjeta Débito", value: 3 },
        { text: "Reserva", value: 8 },
        { text: "Otro", value: 4 },
      ],

      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Autorizacion", align: "center", value: "nroautor_rep" },
        { text: "Orden", align: "center", value: "nroorden_rep" },
        { text: "Pasajero", align: "left", value: "nombrepasajero_rep" },
        { text: "Origen", align: "center", value: "CiudadOrig" },
        { text: "Destino", align: "center", value: "CiudadDest" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      errores: {
        placas: false,
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
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {

  },

  methods: {
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
  
      var data_parse = data.map((el) => {
        if (el.estado_rep === "1"){
          el.estado_rep = "Usado"
        } else {
          el.estado_rep = "Activo"
        }
          return el;
      });


      var columnas = [
        {
          title: "Fecha",
          value: "fechasol_rep",
          format: "string",
        },
        {
          title: "consecutivo",
          value: "nro_rep",
          format: "number",
        },
        {
          title: "Autorizacion",
          value: "nroautor_rep",
        },
        {
          title: "Orden",
          value: "nroorden_rep",
        },
        {
          title: "Pasajero",
          value: "nombrepasajero_rep",
        },
        {
          title: "Origen",
          value: "CiudadOrig",
        },
        {
          title: "Destino",
          value: "CiudadDest",
        },
        {
          title: "Estado",
          value: "estado_rep",
        },
        {
          title: "Observaciones",
          value: "detalleuso_rep",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE DE ORDENES CONVENIO", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Ordenes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-ORDENES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultar_reporte() {
      this.loader = true;
      let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let convenio = this.form.convenio;

      let data = [sessionStorage.Sesion, fechaInicial, fechaFinal, convenio];
      this.postData({
        url: "Transporte/dlls/RpConvtr02J.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          console.log("Error", err);
          this.$emit(
            "msj",
            err.Mensaje ? err.Mensaje[0].msg : err,
            "red",
            1000
          );
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
