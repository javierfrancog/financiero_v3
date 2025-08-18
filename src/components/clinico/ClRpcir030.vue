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
                >Reporte Circular 030</v-list-item-title
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
              <v-col cols="3">
                <v-menu
                  v-model="pickerUltimoPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.ultimo_periodo"
                      label="Ultimo Corte Reportado"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.ultimo_periodo"
                    @input="pickerUltimoPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center">
                <v-btn
                  class="ma-2 px-4"
                  color="light-blue accent-4 white--text"
                  depressed
                  large
                  @click="guardar()"
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
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      this.format_envio(data);
    },

    format_envio(data) {
      this.card_estado = true;
      var fechaini = data.fecha_ini.replace(/\-/g, "");
      var fechafin = data.fecha_final.replace(/\-/g, "");
      var ultcorte = data.ultimo_periodo.replace(/\-/g, "");

      this.btnEnvio.loader = true;
      this.btnEnvio.disabled = true;

      let datos = {
        url: "Clinico/dlls/ClRpCir030J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          ultcorte +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader = false;
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;

          var nom_plano = data[0].archivo_rep;
          var formData = new FormData();
          formData.append("ruta", nom_plano.trim());

          fetch("https://server1ts.net//financiero/inc/get.plano.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((result) => {
              var csvContent = result;
              var blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              var url = URL.createObjectURL(blob);
              var pom = document.createElement("a");
              pom.href = url;
              pom.setAttribute("download", "CIRCULAR030.txt");
              pom.click();
              this.$emit("snack", {
                color: "success",
                text: "Archivo generado correctamente",
                estado: true,
              });

              this.loader = false;
              this.btnEnvio.loader = false;
              this.btnEnvio.disabled = false;
            });
        })
        .catch((error) => {
          this.loader = false;
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;

          this.send_error(error.Mensaje[0].msg);
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
