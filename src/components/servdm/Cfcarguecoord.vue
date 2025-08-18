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
                >mdi-arrow-up-thin-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Actualizar Coordenadas</v-list-item-title
              >
            </v-list-item-content>
            <v-col sm="3" cols="4">
              <v-btn
                color="green white--text"
                class
                @click="plantilla()"
                depressed
              >
                <v-icon size="20" left>mdi-book-outline</v-icon>
                Descargar Plantilla
              </v-btn>
            </v-col>

          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>

              <v-col cols="5">
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
      pickerMes: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      ciclos: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      headers: [],
      detalle: [],
      adjunto: null,
      loaderCard: false,
    };
  },
  created() {
  },
  methods: {

    subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_COORD`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch(
          "https://server1ts.net//financiero/services/adjunto.impFact.php",
          {
            method: "POST",
            body: archivo,
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      post
        .postData({
          url: "Servdm/dlls/cfcoordenadas.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            nombre_adjunto + 
            "|",
          method: "",
        })
        .then((data) => {
          let cantidad = data[0].trim()
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: cantidad + "  Usuarios Actualizados",
            estado: true,
          });
        })
        .catch((err) => {
          let mensaje = err.Mensaje[0]
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: mensaje,
            estado: true,
          });
        });
    },


    plantilla: function () {
    let url = "https://titansoluciones.cloud/plantillas/SDM_COORDENADAS.xlsx"
    window.open(url, '_blank')
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
  },
};
</script>
