<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-rotate-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">Recalcular Cartera</v-list-item-title>
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
                  v-model="periodo_cargue"
                  item-text="text"
                  item-value="value"
                  return-object
                  required
                  :error="errores.anoselect"
                ></v-select>
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
                disable-pagination                
                hide-default-footer

              >
                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-4"
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="recalcular_mes(item)"
                      >
                        <v-icon>mdi-reiterate</v-icon>
                      </v-btn>

                    </template>
                    <span>Recalcular Pagos</span>
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
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY"),
      contenido: [],
      empresa: [],    
      años_select: [],      
      errores: {
        anoselect: false,
      },        
      search: "",
      form: null,
      drawer: false,
      headers: [
        { text: "", value: "data-table-expand", width: "5%", align: "center" },
        {
          text: "Periodo",
          align: "center",
          value: "periodo_cie",
          width: "15%"
        },
        { text: "Opciones", align: "center", value: "action", width: "15%" }


      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false
      }
    };
  },
  created() {
    this.loader = false;
    this.cargar_años();        
    this.cargar_empresa();    
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },    
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },    
    cargarPeriodos: function() {
      var fecha = this.periodo_cargue.value;
      post
        .postData({
          url: "Financiero/dlls//PrCierreCbJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: ""
        })
        .then(data => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          this.loader.tipoDocumento = false;
          this.send_error("Error al cargar Documento Contable");
        });
    },
    recalcular_mes(data) {
      var item = JSON.parse(JSON.stringify(data));
      var periodo = item.periodo_cie;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrRecCartera.dll",
          data: sessionStorage.Sesion +
          "|" +
          periodo + 
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
