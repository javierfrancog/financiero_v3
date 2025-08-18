<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cash-multiple</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Cierre de Cartera</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="5">
                  <v-select
                    :items="anos_select"
                    label="Año"
                    outlined
                    clearable
                    hide-details
                    v-model="form.periodo_cargue"
                    item-text="text"
                    item-value="value"
                    required
                    :error="errores.anoselect"
                  ></v-select>
              </v-col>
              <v-col class="justify-center d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="cargarPeriodos()"
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
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      anos_select: [],
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY"),
      contenido: [],
      search: "",
      form: {},
      drawer: false,
      detalle: [],
      errores: {
        anoselect: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
    };
  },
  created() {
    this.loader = false;
    this.form = {
      fecha_doc: this.$moment().format("YYYY"),
    };

    this.cargar_años()
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anos_select = anios;

      this.form.periodo_cargue = anioActual
    },
    cargarPeriodos: function () {
      this.loader = true;

      var fecha = this.form.periodo_cargue;
      post
        .postData({
          url: "Ptovta/dlls//PrCierreCart.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          this.$emit("snack", {
                  color: "green",
                  text: "Proceso Finalizado",
                  estado: true,
                });
        })
        .catch((err) => {
          this.loader = false;          
          this.loader.tipoDocumento = false;
          this.send_error("Error al cerrar Cartera");
        });
    },
  },
};
</script>
