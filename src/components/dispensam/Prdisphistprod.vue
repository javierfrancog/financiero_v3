<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alpha-p-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Información de Producto</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Producto"
                  v-model="form.codProducto"
                  :items="tablaproductos"
                  :item-text="format_productos"
                  item-value="codigo_pr"
                  clearable
                  hide-details
                  @change="procesarbusqueda()"
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-btn
                  color="indigo"
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
              :single-expand="singleExpand"
              :search="search"
              hide-default-footer
              class="elevation-1"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      search: null,
      motivocanc: null,
      loader: false,
      contenido_paciente: [],

      load_table: false,
      id_numero: "",
      form: {},
      años_select: [],
      tablaproductos: [],
      expanded: [],
      singleExpand: true,

      dialogocanc: {
        estado: false,
      },

      errores: {
        anoselect: false,
      },

      agendas: [],
      headers: [
        { text: "Proveedor", align: "center", value: "proveedor" },
        { text: "Fecha compra", align: "center", value: "fecha" },
        { text: "Cantidad", align: "center", value: "cant" },
        { text: "Vlr Unitario", align: "center", value: "vlrunitario" },
        { text: "Vlr Total", align: "center", value: "valor" },
        // { text: "Factura", align: "center", value: "nivel" },
      ],
    };
  },
  created() {
    this.cargarTablaproductos();    
  },
  watch: {},
  computed: {},
  methods: {
    cargarTablaproductos: function () {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentoLtJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          this.tablaproductos = data_parse;
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Productos");
        });
    },    
    procesarbusqueda() {
      let producto  = this.form.codProducto.cod_rep
      this.agendas = [];
      post
        .postData({
          url: "Dispensa/dlls/PrHistProd.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            producto +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop()
          this.agendas = data;
          this.get_historial(this.id_numero);
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    format_productos: function (val) {
      return `${val.descripcion_rep} - ${val.descriplaboratorio_rep}-Cum:${val.cum_rep}`;
    },

  },
};
</script>
