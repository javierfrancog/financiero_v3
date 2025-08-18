<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-file-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">Resumen Comprobantes Mercancias</v-list-item-title>
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
                  color="indigo white--text"
                  class
                  @click="get_comprobantes()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.resumen"
                      label="Resumen por Documento"
                    ></v-switch>
                  </v-col>
            </v-row>

            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="true"
                item-key="codigo"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['codigo']"
                :sort-desc="[true, false]"
                
              >
                <template v-slot:expanded-item="{headers,item}">
                  <td :colspan="headers.length" class="pl-4">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr></tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in item.registros" :key="row.item"></tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </template>
              </v-data-table>
            </div>
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
      search: "",
      form: null,
      drawer: false,
      headers: [
        {
          text: "",
          value: "data-table-expand",
          align: "center"
        },
        {
          text: "Codigo",
          align: "center",
          value: "codigo_doc",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripcion_doc",
        },
        {
          text: "Inicial",
          align: "center",
          value: "nroini_doc",
        },
        {
          text: "Final",
          align: "center",
          value: "nrofin_doc",
        },

        {
          text: "Cantidad",
          align: "center",
          value: "cant_doc",
        },

        {
          text: "Costo",
          align: "right",
          value: "valor_doc",
        },

      ],
      detalle: [],
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM")
    };
    this.form.resumen = true;
  },
  methods: {
    get_comprobantes() {
      this.loader = true;
      let resumen = this.form.resumen ? "1" : "0";
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      post
        .postData({
          url: "Ptovta/dlls/RpResmercJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + resumen + "|",
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
