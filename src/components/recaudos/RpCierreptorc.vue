<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-door-closed-lock</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cierre de Puntos</v-list-item-title
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
                      label="Fecha Cierre"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechacierre"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-btn
                color="indigo"
                class="ma-5 white--text px-12"
                large
                depressed
                @click="consultar()"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
        <div class="pa-0 px-8">
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

          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-if="item.horacie_rep != '00:00'"
                      @click="delete_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                    >
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar Cierre</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-if="item.horacie_rep != '00:00'"                    
                      @click="reactiva_item(item)"
                      color="green"
                      fab
                      small
                      icon
                      class="ma-5"
                      outlined
                      v-on="on"
                    >
                      <v-icon>mdi-human-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Activa H.Extendido</span>
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
import { rec_cierrecajero } from "../../_formatos.pdf.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      pickeFechaIni: false,
      search: "",
      puntos: "",
      ptosrecaudo: [],
      form: {},
      headers: [
        { text: "Punto Recaudo", align: "left", value: "punto_rep" },
        { text: "Hora Apertura", align: "center", value: "horaini_rep" },
        { text: "Hora Cierre", align: "center", value: "horacie_rep" },
        { text: "Total Entregado", align: "center", value: "trecaudo_rep" },
        { text: "Acciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.form = {
      fechaInicial: this.$moment().format("YYYY-MM-DD"),
    };
  },
  computed: {},
  methods: {
    consultar: function () {
      this.loader = true;
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      post
        .postData({
          url: "Recaudos/dlls/RpCierrepto01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
        })
        .catch((err) => {
          this.loader = false;
          this.send_error(err.Mensaje[0].msg);
        });
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    delete_item(item) {
      var fecha = item.fecha_rep.replace(/\-/g, "");
      var agencia = item.codpunto_rep;
      post
        .postData({
          url: "Recaudos/dlls/PrAnulaCpto.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.consultar();
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },
    reactiva_item(item) {
      var fecha = item.fecha_rep.replace(/\-/g, "");
      var agencia = item.codpunto_rep;
      post
        .postData({
          url: "Recaudos/dlls/PrActivaCpto.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.consultar();
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },    

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Recaudos/dlls/CfConveniorcJ.dll",
          data: sessionStorage.Sesion + "|",
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
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
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
            text: "Error al cargar Agencias",
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
