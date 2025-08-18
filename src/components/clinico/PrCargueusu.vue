<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loaderCard"
        :disabled="loaderCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-reactivate-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Cargue Pacientes Base de Datos Eps cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col sm="4" cols="12">
                <v-select
                  :items="[
                    { text: 'Magisterio Guaviare', value: 1 },
                    { text: 'Formato Titan', value: 2 },
                  ]"
                  label="Origen"
                  outlined
                  hide-details
                  v-model="form.origen"
                ></v-select>
              </v-col>

              <v-col cols="5" v-if="form.origen">
                <v-file-input
                  label="Buscar archivo"
                  outlined
                  chips
                  counter
                  color="blue darken-1"
                  hide-details
                  :show-size="1000"
                  accept=".csv"
                  v-model="adjunto"
                  id="archivo_adjunto"
                ></v-file-input>
              </v-col>

              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              :expanded.sync="expanded"
              item-key="idnomina_rep"
              :search="search"
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
      },

      card_estado: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      detalle: [],
      adjunto: null,
      loaderCard: false,

      headers: [
        { text: "Descripcion", align: "left", value: "error_rep" },
        { text: "Base", align: "left", value: "base_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1_rep" },
        { text: "Nombre", align: "left", value: "nombres_rep" },
      ],
    };
  },
  created() {
    this.form = {
      fecha: this.$moment().format("YYYY-MM"),
    };
  },
  methods: {
    subir_archivo() {
      this.contenido = [];
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        let origen = this.form.origen;
        let nombre_adjunto = "";

        if (origen === 1) {
          nombre_adjunto = "MAGISTERIO";
        } else if (origen === 2) {
          nombre_adjunto = "PACIENTES_TITAN";
        }

        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch("https://server1ts.net//financiero/services/adjunto.impInv.php", {
          method: "POST",
          body: archivo,
        })
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            console.log("Res", res);
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    validar: function () {
      let fecha = this.form.fecha.replace(/\-/g, "");
      var nom_plano = `D:\\TITAN\\Log\\${fecha}.txt`;
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
            type: "text/txt;charset=utf-8;",
          });
          var url = URL.createObjectURL(blob);
          var pom = document.createElement("a");
          pom.href = url;
          pom.setAttribute("download", fecha + ".txt");
          pom.click();
        });
    },

    procesar_plano(nombre_adjunto) {
      let origen = this.form.origen;

      let dll = "0";
      if (origen === 1) {
        dll = "Clinico/dlls/PrCargue1.dll";
      } else if (origen === 2) {
        dll = "Clinico/dlls/PrCargueT.dll";
      }
      post
        .postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + nombre_adjunto + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Pacientes Actualizados correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar Archivo",
            estado: true,
          });
        });
    },
  },
};
</script>
