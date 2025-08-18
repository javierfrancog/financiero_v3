<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">Cierre Nómina</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-row class= "d-flex mb-4 justify-center" no-gutters>
              <h4
                class="font-weight-bold text-h6 subtitles"
              >
                Genera comprobante de Contabilización de la nómina
              </h4>
            </v-row>

        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Periodo de Nómina"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"

                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="pickerMes = false"
                @change="cargarPeriodos()"              

              ></v-date-picker>
            </v-menu>
          </v-col>

              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="cargarPeriodos()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="false"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.item_cierre="{ item }">
                  {{ get_tipo(item.item_cie) }}
                </template>

                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-4"
                        :color="`${item.estado_cie == '1' ? 'red' : 'green'} accent-5`"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="send_cerrar(item)"
                      >
                        <v-icon>mdi-lock-alert</v-icon>
                      </v-btn>
                    {{ item.estado_cie == "1" ? "Cerrado" : "Abierto"  }}                  

                    </template>
                    <span>Cerrar Mes</span>
                  </v-tooltip>
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
  components: {
    FlowerSpinner
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false
      },
      dialogPicker: false,
      pickerMes: false,
      singleExpand: true,
      pickerPeriodo: false,
      contenido: [],
      search: "",
      form: null,
      drawer: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "left", value: "descripcion_cie" },        
        { text: "Periodo", align: "left", value: "periodo_cie" },
        { text: "Tipo", align: "left", value: "item_cierre" },        

        { text: "F.Cierre", align: "left", value: "fechacie_cie" },        
        { text: "Op_Cierre", align: "left", value: "usercie_cie" },
        { text: "F.Elaboración", align: "left", value: "fechaelab_cie" },
        { text: "Op_Elabora", align: "left", value: "userelab_cie" },
        { text: "Opción", align: "center", value: "action", width: "15%" },        

      ],
      detalle: [],
      periodo_cargue: " ",      
      errores: {
        anoselect: false,
      },

      loader: {
        tabla_datos: false,
        tipoDocumento: false
      }
    };
  },
  created() {
    this.loader = false;
    this.form = {
      fecha_doc: this.$moment().format("YYYY")
    };
  },
  methods: {
    get_tipo(tipo){
      switch (tipo) {
        case 'C1':
          return 'CESANTIAS'

        case 'P1':
          return 'PRIMA PRIMER SEMESTRE'

        case 'P2':
          return 'PRIMA SEGUNDO SEMESTRE'
        case 'Q1':
          return 'NOMINA PRIMERA QUINCENA'
        case 'Q2':
          return 'NOMINA SEGUNDA QUINCENA'
        case 'MS':
          return 'NOMINA MENSUAL'

        default:
          return 'N/A'

      }
    },    

    cargarPeriodos: function() {
      var fecha = this.form.fecha.replace(/\-/g, "");   
      this.contenido = [];
      post
        .postData({
          url: "Financiero/dlls//PrGthCierreJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: ""
        })
        .then(data => {
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          console.log(err)
          // this.loader.tipoDocumento = false;
          this.send_error("Error al cargar Nominas");
        });
    },
    send_cerrar(data) {
      var item = JSON.parse(JSON.stringify(data));
      var periodo = item.periodo_cie ? item.periodo_cie.replace(/\-/g, "") : "";      
      var itemper =  item.item_cie;
      var agencia = item.agencia_cie;

      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthCierre.dll",
          data: sessionStorage.Sesion +
          "|" +
          periodo + 
          "|" +
          itemper +          
          "|" +
          agencia +          
          "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.cargarPeriodos();
          this.$emit("snack", {
            color: "success",
            text: "Periodo procesado",
            estado: true
          });
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true
          });
        });
    }
  }
};
</script>
