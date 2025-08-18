<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-heart-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Historial Atención de Paciente</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field
              label="Año Consulta"
              outlined
              hide-details
              v-model="año"
            ></v-text-field>
          </v-col>

              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  type="number"
                  required
                  v-model="id_numero"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-btn
                  color="success"
                  class="ma-2 white--text"
                  @click="procesarbusqueda()"
                  >Buscar</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center"></v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="agendas.length != 0"
            >
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

            <v-data-table
              v-if="agendas.length != 0"
              :loading="load_table"
              :headers="headers"
              :items="agendas"
              item-key="numero"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado="{ item }">
                <!-- {{ item.estado == "0" ? "Activo" : "Desactivado" }} -->
                  {{evaluar_estado(item.estado) }}                
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
export default {
  data() {
    return {
      search: null,
      load_table: false,
      id_numero: "",
      agendas: [],
      headers: [
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Sede", align: "center", value: "sede" },
        { text: "Numero", align: "center", value: "numero" },        
        { text: "Descripcion", align: "center", value: "descrip_paciente" },
        { text: "Identificacion", align: "center", value: "identificacion" },
        { text: "Régimen", align: "center", value: "regimen" },        
        { text: "Factura", align: "center", value: "factura" },
        { text: "Nro_Rips", align: "center", value: "rips" },
        
        { text: "Autorizacion", align: "center", value: "autorizacion" },
        { text: "Estado", align: "center", value: "estado" }
      ]
    };
  },
  created() {},
  watch: {},
  computed: {},
  methods: {

  evaluar_estado(estado) {
    if(estado== "0") return "Activo"
    else if(estado== "1") return "Anulado"
    else if(estado== "2") return "Pte x Facturar"
    },

    procesarbusqueda: function() {
      post
        .postData({
          url: "Clinico/dlls/ClRphispaciente.dll",
          data: sessionStorage.Sesion + "|" + this.id_numero + "|" + this.año + "|" ,
          method: ""
        })
        .then(data => {
          console.log(data);
          this.agendas = data;
        })
        .then(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar datos paciente",
            estado: false
          });
        });
    }
  }
};
</script>
