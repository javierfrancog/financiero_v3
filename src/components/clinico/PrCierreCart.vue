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
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  return-object
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
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY"),
      contenido: [],
      search: "",
      form: null,
      drawer: false,
      detalle: [],
      años_select: [],
      errores: {
        anoselect: false,
      },
      loader: {
        tabla_datos: false,
      },
    };
  },

  created() {
    this.cargar_años();    

    this.loader = false;
    this.form = {
      fecha_doc: this.$moment().format("YYYY"),
    };
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 5; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 5; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },
    cargarPeriodos: function () {
      var fecha = this.form.periodo_cargue.value;
      this.loader = true;      
      post
        .postData({
          url: "Clinico/dlls/ClprCierreCart.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit(
            "msj", data[0] ,
            "green",
          );
        })
        .catch((err) => {
          this.loader = false;          
          console.log(err)          
          this.$emit(
            "msj", "Error al Cerrar Cartera" ,
          );
        });
    },
  },
};
</script>
