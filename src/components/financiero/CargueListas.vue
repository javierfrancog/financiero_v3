<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-basket-fill</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue Listas de Precios</v-list-item-title
              >
            </v-list-item-content>

            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Actualizar Precios
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>

          <v-row justify="start">
            <v-btn
              color="success"
              class="ma-2 white--text"
              large
              depressed
              @click="cargar_productos()"
            >
              Cargar Productos
              <v-icon right dark class="ml-4">mdi-basket-fill</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="8" sm="6">
                <v-autocomplete
                  label="Lista de precios"
                  v-model="form.encab"
                  :items="encabezado"
                  :item-text="format_encab"
                  item-value="codigoenc"
                  outlined
                  hide-details
                  @change="cargarcontenido(form.encab)"
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
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>% Contado</th>
                        <th>$ Contado</th>
                        <th>% Credito</th>
                        <th>$ Credito</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.porccontado_list }}</td>
                        <td>{{ item.inccontado_list }}</td>
                        <td>{{ item.porccredito_list }}</td>
                        <td>{{ item.inccredito_list }}</td>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-autocomplete
                label="Lista de precios"
                v-model="form.encab"
                :items="encabezado"
                :item-text="format_encab"
                item-value="codigoenc"
                :error="errores.lista"
                outlined
                hide-details
                @change="cargarcontenido(form.encab)"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Productos"
                v-model="form.productos"
                :items="productos"
                :item-text="format_productos"
                item-value="codigo_pr"
                :error="errores.productos"
                hide-details
                outlined
                return-object
                @change="selectProducto(form.productos)"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Valor Base"
                clearable
                outlined
                type="text"
                required
                v-model="form.base"
                ref="base_venta"
                prefix="$"
                v-money="money"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="form.encab && form.productos">
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="% Inc.Contado"
                clearable
                outlined
                type="text"
                required
                v-model="form.incporc"
                suffix="%"
                v-money="money"
                @change="evaluar_contado"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Vlr Inc.Contado"
                clearable
                outlined
                type="text"
                required
                v-model="form.inc_cont"
                v-money="money"
                suffix="$"
                @change="evaluar_contado"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Valor Contado"
                clearable
                outlined
                type="text"
                required
                v-model="form.tcontado"
                disabled
                v-money="money"
                prefix="$"
                ref="total_contado"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="form.encab && form.productos">
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="% Inc.Crédito"
                clearable
                outlined
                type="text"
                required
                v-model="form.creditoporc"
                v-money="money"
                suffix="%"
                @change="evaluar_credito"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Vlr Inc.Crédito"
                clearable
                outlined
                type="text"
                required
                v-model="form.creditovlr"
                v-money="money"
                suffix="$"
                @change="evaluar_credito"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Valor Crédito"
                clearable
                outlined
                type="text"
                required
                v-model="form.tcredito"
                disabled
                v-money="money"
                prefix="$"
                ref="total_credito"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="form.encab && form.productos">
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                  { text: 'Activo', value: 0 },
                  { text: 'Desactivado', value: 1 },
                ]"
                label="Estado"
                outlined
                clearable
                hide-details
                v-model="form.estado"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      encabezado: [],
      expanded: [],
      contenido: [],
      productos: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo Lista", align: "left", value: "codigo_list" },
        { text: "Descripción", align: "left", value: "descripcion_list" },
        { text: "Cod.Producto", align: "left", value: "codigopr_list" },
        { text: "Producto", align: "left", value: "descripcionpr_list" },
        { text: "Vlr Contado", align: "center", value: "basecontado_list" },
        { text: "Vlr Crédito", align: "center", value: "basecredito_list" },
        {
          text: "Estado",
          align: "center",
          value: "estado",
        },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarTablaenc();
    this.cargarTablaprod();
  },
  computed: {},
  methods: {
    format_estado(estado) {
      var retornar = {};
      // O se puede usar un swich case
      if (estado == "0") {
        retornar.text = "Activo";
        retornar.color = "green";
      } else {
        retornar.text = "Desactivado";
        retornar.color = "gray";
      }

      return retornar;
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;

      let descripcion64 = " ";
      descripcion64 = window.atob(
      item.base1_pr.trim() +
      item.base2_pr.trim() +
      item.base3_pr.trim() +
      item.base4_pr.trim() +
      item.base4_pr.trim() +
      item.base5_pr.trim() +
      item.base7_pr.trim() +
      item.base8_pr.trim() +
      item.base9_pr.trim() +
      item.base10_pr.trim());
      if (descripcion64) {
         item.descripcionpr_list = descripcion64;
      }

      this.form.encab = item.codigo_list;

      var buscar_producto = this.productos.find(
        (el) => el.codigo_pr.trim() == item.codigopr_list.trim()
      );
      this.form.productos = buscar_producto;

      let base_producto = parseFloat(item.baseproducto_list.replace(/\,/g, "")
      ).toFixed(0);

      setTimeout(() => {
        if (this.$refs.base_venta) {
          this.$refs.base_venta.$el.getElementsByTagName("input")[0].value =
            base_producto;

          this.form.base = base_producto.toString();
        }
      }, 200);

      this.form.incporc = parseFloat(
        item.porccontado_list.replace(/\,/g, "").replace(/\s\s+/g, "")
      ).toFixed(0);

      this.form.inc_cont = parseFloat(
        item.inccontado_list.replace(/\,/g, "").replace(/\s\s+/g, "")
      ).toFixed(0);
      this.form.creditoporc = parseFloat(
        item.porccredito_list.replace(/\,/g, "").replace(/\s\s+/g, "")
      ).toFixed(0);
      this.form.creditovlr = parseFloat(
        item.inccredito_list.replace(/\,/g, "").replace(/\s\s+/g, "")
      ).toFixed(0);

      // this.form.incporc = item.porccontado_list;
      // this.form.inc_cont = item.inccontado_list;
      // this.form.creditoporc = item.porccredito_list;
      // this.form.creditovlr = item.inccredito_list;
      this.form.estado = parseInt(item.estado_list);
      // this.evaluar_contado();
      // this.evaluar_credito();
      this.selectProducto(item.codigopr_list);
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.encab) {
        this.errores.lista = true;
        this.send_error("Lista Obligatoria!");
      } else if (!data.productos) {
        this.errores.productos = true;
        this.send_error("Producto Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var lista = data.encab;
      var codigo = this.form.productos.codigo_pr.trim();
      var porccontado = parseFloat(data.incporc.replace(/\,/g, "")).toFixed(2);
      var vlrccontado = parseFloat(data.inc_cont.replace(/\,/g, "")).toFixed(2);
      var basecontado = parseFloat(data.tcontado.replace(/\,/g, "")).toFixed(2);
      var porccredito = parseFloat(data.creditoporc.replace(/\,/g, "")).toFixed(
        2
      );
      var vlrccredito = parseFloat(data.creditovlr.replace(/\,/g, "")).toFixed(
        2
      );
      var basecredito = parseFloat(data.tcredito.replace(/\,/g, "")).toFixed(2);
      var estado = data.estado;
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/Cfcarglistas.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          lista +
          "|" +
          codigo +
          "|" +
          porccontado +
          "|" +
          vlrccontado +
          "|" +
          basecontado +
          "|" +
          porccredito +
          "|" +
          vlrccredito +
          "|" +
          basecredito +
          "|" +
          estado +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      var lista = this.form.encab;
      this.form = {
        encab: lista,
        eliminar: false,
      };

      this.errores = {
        lista: false,
        productos: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      var lista = this.form.encab;
      post
        .postData({
          url: "Financiero/dlls/CfcarglistasJ.DLL",
          data: sessionStorage.Sesion + "|" + "1" + "|" + lista + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            descripcion64 = window.atob(
              el.base1_pr +
                el.base2_pr +
                el.base3_pr +
                el.base4_pr +
                el.base5_pr +
                el.base6_pr +
                el.base7_pr +
                el.base8_pr +
                el.base9_pr +
                el.base10_pr
            );
            if (descripcion64) {
              el.descripcionpr_list = descripcion64;
            } else {
              el.index = index;
            }
            return el;
          });

          this.contenido = data_parse;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Listas de Precios",
            estado: true,
          });
        });
    },

    cargarTablaenc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfenclistasJ.DLL",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.encabezado = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar encabezados",
            estado: true,
          });
        });
    },

    format_encab(val) {
      return `${val.codigoenc} - ${val.descripcionenc}`;
    },

    cargarTablaprod: function () {
      post
        .postData({
          url: "Financiero/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.map((el) => {
            el.value = el.clasifica_pr.trim() + el.codigo_pr.trim();
            el.codigo_pr = el.codigo_pr.trim();
            return el;
          });

          this.productos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Productos",
            estado: true,
          });
        });
    },

  async cargar_productos () {
      this.loader = true;
      var lista = this.form.encab;
      return post
        .postData({
          url: "Financiero/dlls/CfCargueProd.dll",
          data: sessionStorage.Sesion + "|" + lista + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
            this.carguejson();
            this.cargarcontenido();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al agregar productos",
            estado: true,
          });
        });
    },

    async carguejson () {
      this.loader = true;
      var lista = "0001";
      return post
        .postData({
          url: "Financiero/dlls/CflistasJson.dll",
          data: sessionStorage.Sesion + "|" + lista + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
        })
        .catch((err) => {
          console.log(err)
          this.$emit("snack", {
            color: "error",
            text: "Error al agregar productos",
            estado: true,
          });
        });
    },    
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_pr.trim()}`;
    },

    selectProducto: function (item) {
      setTimeout(() => {
        // this.$refs.base_venta.$el.getElementsByTagName("input")[0].value =
        // item.bventa_pr;
        // this.form.base = item.bventa_pr;
        this.evaluar_contado();
        this.evaluar_credito();
      }, 200);
    },

    evaluar_credito: function () {
      let base_venta = parseFloat(this.form.base.replace(/\,/g, ""));
      let incporc = this.form.creditoporc || "0";
      let inc_cont = this.form.creditovlr || "0";

      let inc_porc_credito = parseFloat(incporc.replace(/\,/g, "")).toFixed(0);

      let inc_credito = parseFloat(inc_cont.replace(/\,/g, "")).toFixed(0);
      let valor_credito = 0;

      inc_porc_credito = (parseFloat(inc_porc_credito) + 100) / 100;
      valor_credito = parseFloat(base_venta) * inc_porc_credito;
      valor_credito =
        valor_credito == 0 ? parseFloat(base_venta) : valor_credito;
      valor_credito = valor_credito + parseFloat(inc_credito);

      if (this.$refs.total_credito) {
        this.$refs.total_credito.$el.getElementsByTagName("input")[0].value =
          valor_credito.toFixed(0);
        this.form.tcredito = valor_credito.toFixed(0);
      }
    },

    evaluar_contado: function () {
      let base_venta = parseFloat(this.form.base.replace(/\,/g, ""));
      let incporc = this.form.incporc || "0";
      let inc_cont = this.form.inc_cont || "0";

      let inc_porc_contado = parseFloat(incporc.replace(/\,/g, "")).toFixed(0);
      let inc_contado = parseFloat(inc_cont.replace(/\,/g, "")).toFixed(0);
      let valor_contado = 0;

      inc_porc_contado = (parseFloat(inc_porc_contado) + 100) / 100;
      valor_contado = parseFloat(base_venta) * inc_porc_contado;
      valor_contado =
        valor_contado == 0 ? parseFloat(base_venta) : valor_contado;
      valor_contado = valor_contado + parseFloat(inc_contado);

      if (this.$refs.total_contado) {
        this.$refs.total_contado.$el.getElementsByTagName("input")[0].value =
          valor_contado.toFixed(0);
        this.form.tcontado = valor_contado.toFixed(0);
      }
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
