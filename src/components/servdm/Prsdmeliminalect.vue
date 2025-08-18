<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-alien</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Eliminar Lecturas</v-list-item-title
              >
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
                    @input="pickerPeriodo = false, cargarciclos()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  label="Ciclo"
                  :items="ciclos"
                  outlined
                  clearable
                  return-object
                  persistent-hint
                  v-model="form.ciclos"
                  :item-text="format_ciclos"
                  :error="errores.ciclos"
                  @change="errores.ciclos = false"
                ></v-select>
              </v-col>

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
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      prefijos: [],
      ciclos: [],
      data: [],
      search: "",
      form: {
        ciclos: null
      },
      drawer: false,
      headers: [],
      detalle: [],
      errores: {
        punto_fact: false,
        consecutivo: false,
        clientes: false,
        plazo: false,
        mpago: false,
        ciclos: false,
      },
    };
  },
  created() {
    // this.form = {
    //   fecha_doc: this.$moment().format("YYYY-MM"),
    // };
    // this.cargarciclos();
  },
  methods: {
    cargarciclos() {
      let periodo = this.periodo_cargue.replace(/\-/g, "")
      this.loader = true;
      this.ciclos =[];
      post
        .postData({
          url: "servdm/dlls/CfciclosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + periodo + "|" ,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ciclos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ciclos",
            estado: true,
          });
        });
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },

    get_comprobantes() {
      var data = this.form;
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var ciclo = data.ciclos.cod_rep;
      let agencia = data.ciclos.agencia_rep;

      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/PrEliminaLect.DLL",
          data: sessionStorage.Sesion + "|" + fecha + "|" + ciclo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "LEcturas eliminadas Correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err)
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0],
            estado: true,
          });
        });
    },
  },
};
</script>
