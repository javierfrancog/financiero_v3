<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-check-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Traslado de Alistamiento</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
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
                  v-model="fecha_ini"
                  label="Fecha Inicial"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fecha_ini"></v-date-picker>
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
                  v-model="fecha_final"
                  label="Fecha Final"
                  append-icon="event"
                  outlined
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_final"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn
              color="indigo"
              class="white--text px-12"
              depressed
              large
              @click="cargarcontenido"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
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
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${
                    item.estado_rep == 1 ? 'indigo' : 'green'
                  } darken-1`"
                  >{{ item.estado_rep == 2 ? "Aprobado" : "Activo" }}</v-chip
                >
              </template>

              <template v-slot:item.consecutivo_rep="{ item }">
                {{ parseInt(item.consecutivo_rep) }}
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_alista(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="despachar_alista(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-truck-fast-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Generar Despacho</span>
                </v-tooltip>
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
import { alistamiento } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),

      dialogo_firmado: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      styleObject: { border: "2px solid #01579B" },
      pickerFecha_reg: false,
      pickerFecha_acta: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      datosEmpresa: [],
      tab: 0,
      search: null,
      form: {},
      error: {
        ccosto: false,
      },
      headers: [
        { text: "Consecutivo", align: "center", value: "consecutivo_rep" },
        { text: "Origen", align: "left", value: "origen_rep" },
        { text: "Destino", align: "center", value: "destino_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Acciones", value: "imprimir", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    imprimir_alista(item) {
      var key = item.agencia_rep + "|" + item.consecutivo_rep + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrAlista01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0]
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            alistamiento(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    despachar_alista(item) {},
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      let fechaini = this.fecha_ini.split("-").join("");
      let fechafin = this.fecha_final.split("-").join("");

      post
        .postData({
          url: "Ptovta/dlls/PrAlistaJ.dll",
          data: sessionStorage.Sesion + "|" + fechaini + "|" + fechafin + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let data_parse = JSON.parse(JSON.stringify(data));
          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Alistamientos",
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
