<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-abugida-thai</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Plano Nueva Eps</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="pickerPeriodoini"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="periodoini_cargue"
                    label="Fecha Inicial"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="periodoini_cargue"
                  no-title
                  scrollable
                  @input="pickerPeriodoini = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="pickerPeriodofin"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="periodofin_cargue"
                    label="Fecha Final"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="periodofin_cargue"
                  no-title
                  scrollable
                  @input="pickerPeriodofin = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-btn
                color="light-blue darken-4"
                class="ma-2 white--text"
                @click="generarArchivos"
              >
                Generar Plano
                <v-icon right dark>mdi-file-download-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider color="succes"></v-divider>
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
      search: null,
      load_contrato: true,
      load_table: false,
      pickerPeriodoini: false,
      pickerPeriodofin: false,
      pickerActual: false,
      selectContrato: null,
      consecutivo: null,
      facturas: [],
      form: [],
      card: {
        loader: false,
        disabled: false,
      },      
      errores: {
        anoserv: false,
      },

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "nro_factura" },
        {
          text: "Fecha",
          align: "center",
          value: "fecha",
        },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.periodoini_cargue = this.$moment().format("YYYY-MM-DD");
    this.periodofin_cargue = this.$moment().format("YYYY-MM-DD");
  },
  watch: {},
  computed: {},

  methods: {
    generarArchivos() {
      this.card.loader = true;
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.periodoini_cargue.replace(/\-/g, "") +
        "|" +
        this.periodofin_cargue.replace(/\-/g, "") +
        "|";
      post
        .postData({
          url: "clinico/dlls/ClrNvaeps.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          let fecha = this.periodoini_cargue.replace(/\-/g, "")
          let archivo = data[0].msg;
          let nom_plano = `${archivo}`;
          var formData = new FormData();
          formData.append("ruta", nom_plano);

          fetch("https://server1ts.net//financiero/inc/get.plano.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((result) => {
              var csvContent = result;
              var blob = new Blob([csvContent], {
                type: "text/txt;charset=utf-8;",
              });
              var url = URL.createObjectURL(blob);
              var pom = document.createElement("a");
              pom.href = url;
              pom.setAttribute("download", `NVAEPS_${fecha}.txt`);
              pom.click();
              res();
            })
            .catch((err) => {
              this.$emit("snack", {
                color: "error",
                text: "Ocurrio error al descargar archivo",
                estado: true,
              });
            });
        })
        .catch((err) => {
          this.card.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al generar plano",
            estado: true,
          });
        });
    },
  },
};
</script>
