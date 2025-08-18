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
              <v-icon size="30" color="blue darken-4 ">mdi-cart-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Consulta Ultimas Compras de Producto</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Producto"
                  v-model="form.codProducto"
                  :items="tablaproductos"
                  :item-text="format_productos"
                  item-value="codigo_pr"
                  hide-details
                  return-object
                  clearable
                  @change="cargarcontenido"
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>

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
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Detalle</b>
                        </td>
                        <td>{{ item.detalle_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Id</b>
                        </td>
                        <td>{{ item.rut_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Imprimir</b>
                        </td>
                        <td>
                          <v-btn outlined small @click="reimprimir(item)">{{
                            item.docinter_rep
                          }}</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>

            <v-data-table
              class="mt-3"
              :headers="headers_saldo"
              :items="contenido_saldo"
              item-key="key"
            >
              <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep"
                  >{{ item.codcta_rep }} - {{ item.descripcta_rep }}</label
                >
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Detalle</b>
                        </td>
                        <td>{{ item.detalle_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Id</b>
                        </td>
                        <td>{{ item.rut_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Imprimir</b>
                        </td>
                        <td>
                          <v-btn outlined small @click="reimprimir(item)">{{
                            item.docinter_rep
                          }}</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
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
      tablaproductos: [],
      codigoUbicacion: [],
      codigoProducto: [],
      datosEmpresa: [],

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
        { text: "Saldo", align: "left", value: "cantsaldo_rep" },
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
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.cargarTablaproductos();
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
          let tablasdo = data[0].ubicaciones_rep
          tablasdo.pop()
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
    cargarcontenido() {
      var data = this.form;
      var sesion = sessionStorage.Sesion;
      var producto = data.codProducto ? data.codProducto.codigo_pr : 0;
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
          this.get_saldo();
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
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    format_ubicaciones: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    format_productos: function (val) {
      return `${val.codigo_pr} - ${val.descripcion_pr}`;
    },
    cargarTablaproductos: function () {
      let ciudad = this.datosEmpresa.codciudad_empr;
      let id = this.datosEmpresa.id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/PRODUCTOS.JSON";
      post
        .postData({
          url: ruta,
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.tablaproductos = data.productos;
          let nombre64 = " ";
          let detalles = this.tablaproductos.map((item) => {
            nombre64 = window.atob(
              item.base1_pr +
                item.base2_pr +
                item.base3_pr +
                item.base4_pr +
                item.base5_pr
            );
            if (nombre64) {
              item.descripcion_pr = nombre64;
            }
            return item;
          });
        })
        .catch((err) => {
          this.send_error("Error al cargar Productos");
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
