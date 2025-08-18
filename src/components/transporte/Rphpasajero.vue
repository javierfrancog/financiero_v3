<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-seat-recline-extra</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Historial de Viajes/Pasajero</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
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
                @input="pickeFechaIni = false;"
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
        </v-row>

        <v-row>
          <v-col cols="4">
                <v-text-field
                  label="Nro. Identificación"
                  v-model="form.nro_id"
                ></v-text-field>
              </v-col>

          <v-col class="d-flex" cols="2" md="5">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="consultar_reporte()"
            >
              Consultar
              <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
            </v-btn>
            <!-- <v-btn
              color="green darken-2"
              class="ma-2 white--text"
              large
              depressed
              @click="print_reporte_excel()"
              :disabled="contenido.length == 0"
            >
              Generar Excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn> -->
          </v-col>
        </v-row>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="12" md="6">
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
              item-key="id_cargue"
              :search="search"
              class="elevation-1"
            >
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

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      taquilleros: [],
      ptosrecaudo: [],
      punto_taquilla: [],

      contenido: [],
      placas: [],
      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },

      libro: {},
      headers: [
      { text: "Fecha", align: "center", value: "fechaemb_tiq" },
      { text: "Agencia", align: "left", value: "agencia_tiq" },
      { text: "Origen", align: "left", value: "origen_tiq" },
      { text: "Destino", align: "left", value: "destino_tiq" },
      { text: "Hora", align: "center", value: "horaemb_tiq" },
      { text: "Placas", align: "center", value: "placa_tiq" },
      { text: "Silla", align: "center", value: "silla_tiq" },
      { text: "Valor", align: "center", value: "vlr_tiq" },
      { text: " ", align: "center", value: "action" },
      ],
      errores: {},
    };
  },

  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
  },
  methods: {

    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      let total_valor = 0;

      var data_parse = data.map((el) => {
        let seguro = parseFloat(el.seguro_rep.replace(/\,/g, "")) || 0;
        let ventas = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
        let total = parseFloat(el.total_rep.replace(/\,/g, "")) || 0;

        el.ventas_rep = ventas;
        el.seguro_rep = seguro;
        el.total_rep = total;

        // if (el.id != 99) {
        //   total_valor += ventas;
        // }

        return el;
      });

      var columnas = [
        {
          title: "Taquillero",
          value: "nombreusuario_rep",
          format: "string",
        },
        {
          title: "Agencia",
          value: "nombreagencia_rep",
          format: "string",
        },

        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Producido",
          value: "ventas_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Seguro",
          value: "seguro_rep",
          format: "money",         
          totalsRowFunction: "sum",                     
        },
        {
          title: "Total",
          value: "total_rep",
          format: "money",         
          totalsRowFunction: "sum",                     
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var taquilla = this.form.taquilleros.nombres_rep;

      var header_format = [
        { text: "RESUMEN VENTAS POR TAQUILLERO", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Taquillero: ${taquilla}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Resumen Ventas por Taquillero",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `RESUMEN_VTAS_TAQUILLERO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultar_reporte() {

      if (this.form.nro_id) {
        this.loader = true;
        let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let id = this.form.nro_id.trim();

        var datos = {
          url: "Transporte/dlls/RphpasajeroJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaInicial +
            "|" +
            fechaFinal +
            "|" +
            id +
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = data;
          })
          .catch((error) => {
            this.loader = false;
            this.send_error("Error al consultar Historial");
          });
      } else {
        this.errores.puntos = true;
        this.send_error("Debe indicar una identificacion");
      }
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
