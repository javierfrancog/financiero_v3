<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-checkbox-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Reporte Recepción Documentos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col cols="4" class="d-flex">
              <v-menu
                v-model="pickerFechaini"
                :close-on-content-click="false"
                transition="scale-transition"
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaini"
                    label="Buscar desde:"
                    append-icon="event"
                    outlined
                    hide-details
                    :error="errores.fechaini"
                    @input="errores.fechaini = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="form.activacion"
                  v-model="form.fechaini"
                  @input="
                    pickerFechaini = false;
                    errores.fechaini = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-btn
                color="indigo"
                class="white--text mr-3 mt-2"
                large
                depressed
                @click="cargarcontenido()"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" md="6">
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.nro_rep="{ item }">
                {{ parseFloat(item.nro_rep) }}
              </template>

              <template v-slot:item.orden_fact="{ item }">
                {{ parseFloat(item.orden_fact) }}
              </template>

              <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      class="mr-2"
                      icon
                      depressed
                      v-on="on"
                      @click="imprimir(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
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
import { recepcion_documentos } from "../../_formatos_trans.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerFechaini: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      search: "",
      form: {
        fecha_ini: this.$moment().format("YYYY-MM-01"),
        fechaini: this.$moment().format("YYYY-MM-01"),
      },
      headers: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Cliente", align: "left", value: "cliente_rep" },
        { text: "Vehículo", align: "left", value: "placa_rep" },
        { text: "Opciones", align: "center", value: "action" },
      ],
      contenido: [],
      errores: {
        fechaini: false,
      },
    };
  },
  created() {
    this.form.fechaini = this.$moment().format("YYYY-MM-01");
  },
  methods: {
    cargarcontenido() {
      if (this.form.fechaini) {
        this.loader = true;
        let fecha = this.form.fechaini.replace(/\-/g, "");
        post
          .postData({
            url: "/Trmcias/dlls/RpRecepcion01J.dll",
            data: sessionStorage.Sesion + "|" + "0001" + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            data.pop()
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Recepciones",
              estado: true,
            });
          });
      } else {
        this.send_error("Debe seleccionar una fecha");
      }
    },
    imprimir(item) {
      var fecha = item.fecha_rep.substr(0, 4);
      var key =
        item.agencia_rep +
        "|" +
        parseFloat(item.nro_rep) +
        "|" +
        fecha +
        "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;

      this.loader = true;
      post
        .postData({
          url: "TrMcias/dlls/RpRecepcionJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.format_impresion(data[0]);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir recepcion",
            estado: true,
          });
        });
    },
    format_impresion(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.condicion = "";
        recepcion_documentos(data).then(() => {
          console.log("Impresión terminada");
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