<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-collapse-horizontal</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Homogolar Productos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
            >
              <template v-slot:item.edit="{ item }">
                <v-btn
                  color="red darken-4"
                  fab
                  small
                  icon
                  v-on="on"
                  @click="delete_item(item)"
                >
                  <v-icon>mdi-delete-circle-outline</v-icon>
                  <span>Eliminar</span>

                </v-btn>

              </template>

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
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      agencias: [],
      search: "",
      form: {
        agencia: null,
        descripcion: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Proveedor", align: "center", value: "proveedor_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Cod.Interno", align: "left", value: "codlocal_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        agencia: false,
        descripcion: false,
        ubica: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    delete_item (item) {
      this.loader = true;
      let codigo = item.cod_rep.trim();
      post
        .postData({
          url: "Financiero/dlls/CfProvProdX.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          console.log(err)
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al eliminar Producto",
            estado: true,
          });
        });

    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfProvProdJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Productos",
            estado: true,
          });
        });
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
