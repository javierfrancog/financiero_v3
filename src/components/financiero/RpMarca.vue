<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alpha-r-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Consulta por Marca</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Marca"
                  v-model="form.marca"
                  :items="tablamarcas"
                  :item-text="format_marcas"
                  item-value="cod_rep"
                  hide-details
                  return-object
                  clearable
                  @change="cargarcontenido"
                  outlined
                ></v-autocomplete>
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

            <v-data-table
              class="mt-3"
              :headers="headers_saldo"
              :items="contenido_saldo"
              item-key="key"
              :search="search"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_compra(item)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Compra</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-data-table
              class="mt-3"
              :headers="headers"
              :items="contenido"
              item-key="key"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
            >
              <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep"
                  >{{ item.codcta_rep }} - {{ item.descripcta_rep }}</label
                >
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
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    // JsonExcel
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      contenido_saldo: [],
      tablaruts: [],
      tablamarcas: [],
      codigoUbicacion: [],
      codigoProducto: [],
      datosEmpresa: [],
      textob64: false,

      ubica: [],
      search: "",
      form: {
        cuenta: null,
        codUbicacion: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Proveedor", align: "left", value: "proveedor_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        { text: "Valor Unitario", align: "center", value: "valor_rep" },
      ],
      headers_saldo: [
        { text: "Ubicacion", align: "left", value: "ubicacion_rep" },
        { text: "Producto", align: "left", value: "descripprod_rep" },
        { text: "Saldo", align: "left", value: "cantsaldo_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.get_empresa();
    this.get_marcas();
  },
  methods: {
    get_marcas() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfMarcasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.tablamarcas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clasificaciones",
            estado: true,
          });
        });
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_saldo() {
      var producto = this.form.codProducto.codigo_pr;
      var fecha = this.$moment().format("YYYYMMDD");
      post
        .postData({
          url: "Ptovta/dlls/PrFact01P.dll",
          data:
            sessionStorage.Sesion +
            "|0|" +
            "" +
            "|" +
            producto +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          let tablasdo = data[0].ubicaciones_rep;
          tablasdo.pop();
          this.contenido_saldo = tablasdo;
        })
        .catch((err) => {
          this.dialogo.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Producto",
            estado: true,
          });
        });
    },
    get_compra(item) {
      var sesion = sessionStorage.Sesion;
      var producto = item.codigo_rep;
      this.contenido = [];
      post
        .postData({
          url: "Ptovta/dlls/RpProductoJ.DLL",
          data: sessionStorage.Sesion + "|" + producto + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data[0].periodos_rep));
          this.contenido.pop();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Producto",
            estado: true,
          });
        });
    },

    cargarcontenido() {
      var data = this.form;
      let marca = data.marca ? data.marca.cod_rep : 0;
      var fecha = this.$moment().format("YYYYMMDD");
      if (marca == 0) {
        console.log(marca);
      } else {
        post
          .postData({
            url: "Ptovta/dlls/RpMarcasJ.DLL",
            data: sessionStorage.Sesion + "|" + marca + "|" + fecha + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            let data_parse = JSON.parse(JSON.stringify(data));
            data_parse.pop();
            let nombre64 = "";
            let base64 = "";

            let detalles = data_parse.map((item) => {
              this.isBase64(item.descripprod_rep.trim());
              if (this.textob64 == true) {
                base64 = window.atob(item.descripprod_rep.trim());
                item.descripprod_rep = base64
              }
            });
            this.contenido_saldo = data_parse;

            // this.get_saldo();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Producto",
              estado: true,
            });
          });
      }
    },
    isBase64(str) {
      var base64regex =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

      if (base64regex.test(str)) {
        this.textob64 = true;
      } else {
        this.textob64 = false;
      }
    },

    format_marcas: function (val) {
      return `${val.descrip_rep}`;
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
