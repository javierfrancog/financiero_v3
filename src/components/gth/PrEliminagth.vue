<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-delete-forever-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Eliminación de Nómina</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                      v-model="form.periodo_cargue"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      Autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.periodo_cargue"
                    scrollable
                    no-title
                    type="month"
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.agencia_ori"
                  :items="agencias"
                  :item-text="format_agencias"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="errores.agencia = false"
                  :error="errores.agencia"
                ></v-autocomplete>
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
                        :color="`${
                          item.estado_cie == '1' ? 'red' : 'green'
                        } accent-5`"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="send_eliminar(item)"
                      >
                        <v-icon color="red darken-4">
                          mdi-delete-forever-outline</v-icon
                        >
                      </v-btn>
                      <!-- {{ item.estado_cie == "1" ? "Cerrado" : "Abierto"  }}                   -->
                    </template>
                    <span>Eliminar Nómina</span>
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
      contenido: [],
      agencias: [],      
      search: "",
      form: null,
      drawer: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "left", value: "nombreagenc_cie" },

        { text: "Periodo", align: "center", value: "periodo_cie" },
        { text: "Tipo", align: "left", value: "item_cierre" },
        { text: "F.Cierre", align: "left", value: "fechacie_cie" },
        { text: "Op_Cierre", align: "left", value: "usercie_cie" },
        { text: "F.Elaboración", align: "left", value: "fechaelab_cie" },
        { text: "Op_Elabora", align: "left", value: "userelab_cie" },
        { text: "Opción", align: "center", value: "action", width: "15%" },
      ],
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
    this.cargarTablaAg();    
    this.form = {
      fecha_doc: this.$moment().format("YYYY"),
    };
    this.cargar_años();
  },
  methods: {
    get_tipo(tipo) {
      switch (tipo) {
        case "C1":
          return "CESANTIAS";

        case "P1":
          return "PRIMA PRIMER SEMESTRE";

        case "P2":
          return "PRIMA SEGUNDO SEMESTRE";
        case "Q1":
          return "NOMINA PRIMERA QUINCENA";
        case "Q2":
          return "NOMINA SEGUNDA QUINCENA";
        case "Q3":
          return "NOMINA ADICIONAL";

        case "MS":
          return "NOMINA MENSUAL";

        default:
          return "N/A";
      }
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
          this.agencias.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas las Agencias",
          });

        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },

    cargarPeriodos: function () {
      var fecha = this.form.periodo_cargue.replace(/\-/g, "");
      let agencia = this.form.agencia_ori.codigo_agc;
      this.contenido = [];
      post
        .postData({
          url: "Financiero/dlls//PrGthEliminarJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          // this.loader.tipoDocumento = false;
          this.send_error("Error al cargar Nominas");
        });
    },
    send_eliminar(data) {
      var item = JSON.parse(JSON.stringify(data));
      var periodo = item.periodo_cie;
      var itemper = item.item_cie;
      var agencia = item.agencia_cie;

      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthEliminar.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            agencia +
            "|" +
            itemper +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargarPeriodos();
          this.$emit("snack", {
            color: "success",
            text: "Periodo Eliminado",
            estado: true,
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
  },
};
</script>
