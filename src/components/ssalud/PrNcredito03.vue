<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-arrow-up-bold-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">Reprocesar Notas Crédito</v-list-item-title>
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

              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto Nota Crédito"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_resolucion ();
                    errores.punto_fact = false;
                  "

                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>



              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
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
      agencias: [],
      expanded: [],
      contenido: [],
      prefijos: [],      
      data: [],      
      search: "",
      form: null,
      drawer: false,
      headers: [
      ],
      detalle: [],
      errores: {
        punto_fact: false,
        consecutivo: false,
        clientes: false,
        plazo: false,
        mpago: false,
      },

    };
  },
  created()
    {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM")
    };
    this.cargarTablaAg();


  },
  methods: {
    cargarTablaAg: function() {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          var filtro = data.filter(el => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true
          });
        });
    },
    format_punto_fact: function(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },

    get_resolucion() {
      var $this = this;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.prefijos = data;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },


    get_comprobantes() {
      var data = this.form;      
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var agencia = data.punto_fact.codigo_agc;

      this.loader = true;      
      post
        .postData({
          url: "Clinico/dlls/PrNCreditoR.DLL",
          data: sessionStorage.Sesion + "|" + fecha + "|" + agencia + "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar comprobantes",
            estado: true
          });
        });
    }
  }
};
</script>
