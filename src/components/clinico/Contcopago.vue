<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-alpha-c-box-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">Contabiliza Copagos Prestaciones cl</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="get_comprobantes()"
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
  FlowerSpinner  ,

  components: {
    FlowerSpinner
  },

  data() {
    return {
      loader: false,      
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false
      },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      expanded: [],
      contenido: [],
      resdian: [],      
      search: "",
      form: null,
      drawer: false,
      headers: [
      ],
      detalle: [],
    };
  },
  created()
    {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM")
    };
    this.cargarresdian();

  },
  methods: {
    cargarresdian() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfResdianj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.resdian = data;          
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar resoluciones",
            estado: true
          });
        });

    },
    format_punto_fact: function(val) {
      return `${val.prefijo_resd} - ${val.descripcion_resd}`;
    },

    get_comprobantes() {
      this.loader = true;
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      post
        .postData({
          url: "Clinico/dlls/PrContcopago.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          this.$emit("snack", {
            color: "success",
            text: "Facturas contabilizadas correctamente",
            estado: true
          });

        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al contabilizar comprobantes",
            estado: true
          });
        });
    }
  }
};
</script>
