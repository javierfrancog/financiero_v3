<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-greeting-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Solicitud de Servicio
                <v-row class="d-flex justify-end">
                  <v-col cols="2" class="justify-end d-flex align-center">
                    <v-text-field
                      label="Consecutivo"
                      outlined
                      v-model="form.consecutivo"
                      disabled
                      hide-details
                      type="text"
                      :loading="load.consecutivo"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <!-- <v-divider class="mb-1"  color="orange"></v-divider>   -->

            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Sede"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-title="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @update:model-value="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Cliente"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  hide-details
                  return-object
                  outlined
                  @change="errores.clientes = false"
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>

              <v-spacer></v-spacer>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Fecha"
                  outlined
                  v-model="form.fecha"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-2" color="orange"></v-divider>
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn color="indigo" dark class @click="abrir_popup" depressed>
                  <v-icon size="20" left>mdi-cart-plus</v-icon>Agregar
                  Producto/Servicio
                </v-btn>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                item-key="key"
                show-expand
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <b>Observación: </b> {{ item.observacion }}
                  </td>
                </template>
                <template v-slot:item.key="{ item }">{{
                  tablaDetalle.data.indexOf(item) + 1
                }}</template>
                <template v-slot:item.valor="{ item }">
                  {{ item.valor }}
                </template>
                <template v-slot:item.total="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.total.toString().replace(/\,/g, ""))
                    )
                  }}
                </template>
                <template v-slot:item.sub_total="{ item }">
                  {{ formatNumero(item.subtotal) }}
                </template>

                <template v-slot:item.ivaTotal="{ item }">{{
                  item.ivaTotal
                }}</template>

                <template v-slot:item.action="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="
                          edit_item(item);
                          dialogo.tipo = false;
                        "
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Modificar Producto</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red darken-4"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="delete_item(item)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar Producto</span>
                  </v-tooltip>
                </template>
                <template v-slot:body.append>
                  <td colspan="5" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.sub_total || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>{{
                      formatNumero(tablaDetalle.totales.total_impoc || 0)
                    }}</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="succes"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Solicitud</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col sm="3" cols="12">
                <v-select
                  :items="[
                    { text: 'Contado', value: 1 },
                    { text: 'Crédito', value: 2 },
                    { text: 'Anticipado', value: 3 },
                  ]"
                  label="Forma de pago"
                  outlined
                  hide-details
                  v-model="form.fpago"
                  @change="
                    form.plazo = null;
                    errores.plazo = false;
                    set_diasPlazo();
                  "
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2" v-if="form.fpago == 2">
                <v-text-field
                  label="Dias Plazo"
                  type="number"
                  counter="3"
                  outlined
                  v-model="form.plazo"
                  hide-details
                  :error="errores.plazo"
                  @input="errores.plazo = false"
                ></v-text-field>
              </v-col>

              <v-col sm="3" cols="12" v-if="form.fpago != 2">
                <v-select
                  :items="[
                    { text: 'Efectivo', value: 1 },
                    { text: 'Tarjeta Débito', value: 2 },
                    { text: 'Tarjeta Crédito', value: 3 },
                    { text: 'Transferencia', value: 4 },
                    { text: 'Anticipado', value: 5 },
                    { text: 'Bono', value: 6 },
                  ]"
                  label="Medio de pago"
                  outlined
                  clearable
                  hide-details
                  v-model="form.mpago"
                  :error="errores.mpago"
                  @change="errores.mpago = false"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="O.Servicio"
                  outlined
                  hide-details
                  v-model="form.ocompra"
                  :error="errores.ocompra"
                  @change="errores.ocompra = false"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker3"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Orden"
                      outlined
                      v-model="form.fechaorden"
                      :error="errores.fechaorden"
                      hide-details
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaorden"
                    @input="dialogPicker3 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="form.observaciones"
                  hide-details
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-center col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                @click="grabar_factura"
                >Grabar Solicitud</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Imprimir Solicitud</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.estado" max-width="700" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
      >
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12">
              <v-col cols="12">
                <v-switch
                  v-model="articulo_select.ivainc"
                  @change="calcularSubtotal"
                  label="Impuesto Incluido en Vlr Unitario"
                  disabled
                  hide-details
                ></v-switch>
              </v-col>
            </v-row>

            <v-row sm="12" no-gutters>
              <v-col class="d-flex mt-2">
                <v-autocomplete
                  label="Producto"
                  :items="productos"
                  outlined
                  clearable
                  return-object
                  hint="Busca por código o descripción"
                  persistent-hint
                  item-value="codigo_pr"
                  v-model="articulo_select.producto"
                  @change="change_articulo_modal"
                  :item-text="format_productos2"
                  :loading="load.servicios"
                  v-if="!input_articulo"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Origen"
                  v-model="articulo_select.origen"
                  :items="list_origen"
                  :item-text="format_origen"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="errores.origen = false"
                  :error="errores.origen"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Destino"
                  v-model="articulo_select.destino"
                  :items="list_destino"
                  :item-text="format_destino"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="errores.destino = false"
                  :error="errores.destino"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col sm="3">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  v-model="articulo_select.cantidad"
                  @input="calcularSubtotal"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col sm="3">
                <v-text-field
                  label="Vlr Ton Km"
                  outlined
                  hide-details
                  suffix="$"
                  :value="formatNumero(articulo_select.valor)"
                  @input="input_mask('valor', calcularSubtotal)"
                >
                </v-text-field>
              </v-col>

              <v-col sm="3">
                <v-text-field
                  label="Peso Material"
                  outlined
                  hide-details
                  disabled
                  suffix="$"
                  :value="formatNumero(articulo_select.pesomat)"
                  @input="input_mask('pesomat', calcularSubtotal)"
                >
                </v-text-field>
              </v-col>
              <v-col sm="3">
                <v-text-field
                  label="Mts3 Km"
                  outlined
                  disabled
                  hide-details
                  suffix="$"
                  v-model="articulo_select.mts3"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="3">
                <v-text-field
                  label="Kilometros"
                  outlined
                  hide-details
                  suffix="$"
                  :value="formatNumero(articulo_select.km)"
                  @input="input_mask('km', calcularSubtotal)"
                >
                </v-text-field>
              </v-col>

              <v-col sm="6">
                <v-text-field
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="articulo_select.total"
                  ref="input_total"
                  suffix="$"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="12">
                <v-text-field
                  label="Observacion Producto"
                  clearable
                  outlined
                  counter="90"
                  v-model="articulo_select.observacion"
                  type="text"
                  autocomplete="off"
                  max="90"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col sm="4">
                <v-text-field
                  label="Pago x Km(proveedor)"
                  outlined
                  hide-details
                  v-model="articulo_select.pagokm"
                  @keyup.enter="verificar_codigo()"
                  @input="errores.pagokm = false"
                  :error="errores.pagokm"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row> -->
          </div>
        </v-form>
        <v-card-actions>
          <v-row class="d-flex justify-end">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="red darken-4 "
                text
                class
                block
                @click="
                  dialogo.estado = false;
                  clear_form();
                "
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                v-if="dialogo.tipo"
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_servicio"
                >Agregar
              </v-btn>
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                @click="modificar_producto"
                depressed
                >Modificar Producto
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import { pedido } from "../../_formatos.pdf";

export default {

  data() {
    return {
      agencias: [],
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      listas: [],

      list_origen: [],
      list_destino: [],
      load: {
        btn_enviar: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
        consecutivo: false,
        servicios: false,
      },
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "key",
          },
          {
            text: "Descripción",
            align: "left",
            value: "producto.descripcion_pr",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "valor",
          },
          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Iva",
            align: "center",
            value: "ivaTotal",
          },
          {
            text: "Impoconsumo",
            align: "center",
            value: "impocTotal",
          },
          {
            text: "Total",
            align: "center",
            value: "total",
          },
          {
            text: " ",
            align: "center",
            value: "action",
          },
        ],
        data: [],
        totales: {},
      },
      form: {
        fpago: 1,
        embarque: null,
        fechaorden: null,
        ocompra: null,
      },

      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
      },
      articulo_select: {
        barras: null,
        producto: null,
        lista: null,
        iva: 0,
        ivainc: null,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        factorImpoc: 0,
        valorIva: 0,
        ubicaciones: [],
        observacion: null,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
      },
      errores: {
        punto_fact: false,
        clientes: false,
        plazo: false,
        mpago: false,
        precio: false,
        ocompra: false,
        fechaorden: false,
        destino: false,
        pagokm: false,
        origen: false,
      },
      print: {
        comprobante: null,
      },
      dialogPicker3: null,

      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      search: null,
      input_articulo: false,
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();
    this.get_productos();
    this.cargarTablaubica();
    this.get_origen();
    this.get_destino();

    this.$watch("form.fpago", this.re_calcular);

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          let total = parseFloat(val.total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total += total;

          let iva = parseFloat(val.ivaTotal.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total_iva += iva;

          let impoc = val.impocTotal
            ? parseFloat(val.impocTotal.toString().replace(/\,/g, "")) || 0
            : 0;
          $this.tablaDetalle.totales.total_impoc += impoc;

          let descuento =
            parseFloat(val.valorDescuento.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.descuentos += descuento;

          let subtotal =
            parseFloat(val.subtotal.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.sub_total += subtotal;
        });
      },
      { deep: true }
    );
  },
  watch: {
    search(val) {
      if (this.articulo_select.producto) return;
      if (val && val.length == 3) {
        this.productos = [];
        this.consulta(val);
      }
    },
  },
  methods: {
    get_origen() {
      this.loader = true;
      post
        .postData({
          url: "Trmcias/dlls/CfEmbarquesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.list_origen = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Embarques",
            estado: true,
          });
        });
    },
    get_destino() {
      this.loader = true;
      post
        .postData({
          url: "Trmcias/dlls/CfEmbarquesJ.dll",
          data: sessionStorage.Sesion + "|" + 2 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.list_destino = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Embarques",
            estado: true,
          });
        });
    },
    validar_cliente() {
      var empresa = this.empresa;
      // console.log("Cliente", empresa);
      if (empresa[0].carguepr_empr == "0") {
        this.input_articulo = false;
        this.get_listas();
      } else {
        this.input_articulo = true;
      }
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.articulo_select, index, val_edit);
      if (callback) callback();
    },
    get_productos() {
      post
        .postData({
          url: "Ptovta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = "";
          data_parse.map((el, index) => {
            if (el.base1_pr.trim() == "") {
              descripcion64 = window.atob(el.descripcion_pr.trim());
            } else {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            el.descripcion_pr = descripcion64;
            el.index = index;
            return el;
          });

          this.productos = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar los productos",
            estado: true,
          });
        });
    },
    verificar_codigo() {
      var codigo = this.articulo_select.barras;
      var listaCliente = this.form.clientes.listpr_rut;
      this.dialogo.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfProductosJB.dll",
          data:
            sessionStorage.Sesion + "|" + listaCliente + "|1|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.loader = false;
          let busqueda = this.productos.find(
            (el) => el.codigopr_list.trim() == data[0].codigo_pr.trim()
          );
          // console.log(busqueda);
          // this.productos = data;
          this.articulo_select.producto = busqueda;
          this.change_articulo_modal();
        })
        .catch((err) => {
          this.dialogo.loader = false;
          this.load.servicios = false;
          // console.log("Error", err);
        });
    },
    consulta(val) {
      this.load.servicios = true;
      var listaCliente = this.form.clientes.listpr_rut;
      post
        .postData({
          url: "Financiero/dlls/CfProductosJB.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            listaCliente +
            "|0|" +
            val.toUpperCase() +
            "|",
          method: "",
        })
        .then((data) => {
          this.load.servicios = false;
          this.productos = data;
        })
        .catch((err) => {
          this.load.servicios = false;
          // console.log("Error", err);
        });
    },
    set_diasPlazo() {
      if (this.form.fpago == 2) this.form.plazo = this.form.clientes.diaspl_rut;
      else this.form.plazo = 0;
    },
    format_impresion(data) {
      let descripcion64 = " ";
      // descripcion64 = window.atob(data.Observaciones64);
      // if (descripcion64) {
      //   data.observaciones = descripcion64;
      // }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.condicion = this.condicion_pdf;
        pedido(data).then(() => {
          console.log("Impresión terminada");
        });
      });
    },
    grabar_factura() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona una Agencia");
      } else if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Selecciona un cliente");
      } else if (detalle.length == 0) {
        this.send_error("Ingresa al menos un articulo en el detalle");
      } else if (data.fpago == 2 && !data.plazo) {
        this.errores.plazo = true;
        this.send_error("Ingresa los días de plazo");
      } else if (data.fpago != 2 && !data.mpago) {
        this.errores.mpago = true;
        this.send_error("Selecciona un medio de pago");
      } else if (!data.ocompra) {
        this.errores.ocompra = true;
        this.send_error("Registre numero de la orden");
      } else if (!data.fechaorden) {
        this.errores.fechaorden = true;
        this.send_error("Registre Fecha de la Orden");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        var sesion = sessionStorage.Sesion;
        var puntoFact = data.punto_fact.codigo_agc;
        var consecutivo = data.consecutivo.trim();
        var fecha = data.fecha.replace(/\-/g, "");
        var cliente = data.clientes.identificacion_rut;
        var formaPago = data.fpago;
        var diasPlazo = formaPago != 2 ? "0" : data.plazo;
        var ocompra = data.ocompra.trim();
        var fechaorden = data.fechaorden.replace(/\-/g, "");
        var metodoPago = data.mpago || "0";
        var observaciones = data.observaciones || "";
        observaciones.replace(/\*/g, "x");

        var datosEnvio =
          sesion +
          "|" +
          puntoFact +
          "|" +
          "01" +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          cliente +
          "|" +
          formaPago +
          "|" +
          diasPlazo +
          "|" +
          metodoPago +
          "|" +
          ocompra +
          "|" +
          fechaorden +
          "|" +
          observaciones.replace(/\"/g, "pg") +
          "|";

        this.format_envio(datosEnvio, detalle);
      }
    },
    reset_formulario() {
      this.clear_form();
      this.form.clientes = null;
      this.tablaDetalle.data = [];
      this.form.fpago = 1;
      this.form.plazo = null;
      this.form.mpago = null;
      this.form.observaciones = null;
      this.get_consecutivo();
    },
    get_impresion() {
      this.disabled.imprimir_factura = true;
      this.load.imprimir_factura = true;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio =
        sessionStorage.Sesion + "|" + this.print.comprobante + fecha + "|";

      var agencia = this.form.punto_fact;

      post
        .postData({
          url: "Trmcias/dlls/PrPedido01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;

          if (agencia.tipofact_agc == "2") {
            this.get_pdf_pos(data[0]);
          } else {
            this.format_impresion(data[0]);
          }
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    format_envio(importarhtml, data) {
      let tablaEnvio = {};
      let indextab = 0;
      data.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let ubicacion = "0001";
        let codigo = item.producto.codigo_pr;
        let cantidad = parseFloat(item.cantidad);
        let valor = parseFloat(item.subtotal);
        let vlr_iva = parseFloat(item.valorIva);
        let vlr_km = parseFloat(item.valor);
        let peso_mat = parseFloat(item.pesomat);
        let cant_km = parseFloat(item.km);
        let descuento = parseFloat(item.descuento);
        let observacion = item.observacion ? item.observacion : "";
        let origen = item.origen.codigo_rep;
        let destino = item.destino.codigo_rep;

        indextab = format_index;

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${ubicacion}|${codigo}|${cantidad}|${valor}|${descuento}|${vlr_iva}|${vlr_km}|${peso_mat}|${cant_km}|${observacion}|${origen}|${destino}|`;
      });

      importarhtml = importarhtml + indextab + "|";

      let datos = {
        url: "Trmcias/dlls/PrPedido01.dll",
        data: { importarhtml, ...tablaEnvio },
        method: "",
        json: true,
      };
      post
        .postData(datos)
        .then((data) => {
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = false;
          this.disabled.imprimir_factura = false;
          this.print.comprobante = data[0];
          this.reset_formulario();
          this.$emit("snack", {
            color: "success",
            text: "Solicitud guardada correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = false;
          console.error(err);
          this.send_error("Error al grabar Solicitud");
        });
    },
    re_calcular() {
      var detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
      var formaPago = this.form.fpago;

      detalle.forEach((item) => {
        if (!item.manual) {
          var producto = item.producto;
          var subtotalProducto = 0;
          var ivaProducto = 0;
          var valorProducto = 0;
          var base = 0;
          var incremento = 0;
          var porcentaje = 0;

          var descuento = parseFloat(item.descuento.toString()) || 0;

          var porcentajeIva =
            parseFloat(producto.porciva_list.replace(/\,/g, "")) || 0;
          var iva = porcentajeIva / 100 + 1;

          if (formaPago == 1 || formaPago == 3) {
            base =
              parseFloat(producto.basecontado_list.replace(/\,/g, "")) || 0;
            incremento =
              parseFloat(producto.inccontado_list.replace(/\,/g, "")) || 0;
            porcentaje =
              parseFloat(producto.porccontado_list.replace(/\,/g, "")) || 0;
          } else if (formaPago == 2) {
            base =
              parseFloat(producto.basecredito_list.replace(/\,/g, "")) || 0;
            incremento =
              parseFloat(producto.inccredito_list.replace(/\,/g, "")) || 0;
            porcentaje =
              parseFloat(producto.porccredito_list.replace(/\,/g, "")) || 0;
          }
          var valorPorcentaje = (base * porcentaje) / 100;
          var subtotal = base + incremento + valorPorcentaje;
          var valorDescuento = subtotal * (descuento / 100);
          var total = (subtotal - valorDescuento) * item.valorIva;
          var valorIva = total - (subtotal - valorDescuento);

          item.subtotal = subtotal;
          item.valorDescuento = valorDescuento;
          item.ivaTotal = valorIva.toFixed(0);
          item.total = this.formatNumero(total * item.cantidad);
          item.valor = this.formatNumero(subtotal * iva);
        }
      });

      this.tablaDetalle.data = [];
      this.tablaDetalle.data = detalle;
    },
    abrir_popup() {
      this.articulo_select.ivainc = false;
      if (this.form.clientes) {
        this.dialogo.estado = true;
        this.dialogo.tipo = true;
        if (this.empresa.ivainc_empr == "1") {
          this.articulo_select.ivainc = true;
        }
      } else {
        this.send_error("Debes seleccionar un cliente");
      }
    },
    agregar_servicio() {
      var articulo = this.articulo_select;
      let unit_vta = parseFloat(articulo.valor);
      let unit_compra = parseFloat(articulo.pagokm);
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.origen) {
        this.send_error("Ingresa un punto de origen");
        this.errores.origen = true;
      } else if (!articulo.destino) {
        this.errores.destino = true;
        this.send_error("Ingresa un punto de destino");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 90) {
        this.send_error("La observación no puede exceder 90 carácteres");
      } else if (unit_vta < unit_compra) {
        this.errores.pagokm = true;
        this.send_error("Error en valor unitario");
      } else if (!articulo.valor) {
        this.errores.valor = true;
        this.send_error("Debe ingresar un valor por Km");
      } else if (!articulo.pesomat) {
        this.errores.pesomat = true;
        this.send_error("Debe ingresar el peso del material");
      } else if (!articulo.km) {
        this.errores.km = true;
        this.send_error("Debe ingresar el kilometraje");
      } else {
        let info_ubicacion = articulo.ubicaciones.find(
          (el) => el.codubica_rep.trim() == articulo.ubicacion.codigo_ubic
        );
        let valor =
          parseFloat(articulo.valor.toString().replace(/\,/g, "")) || 0;

        // if (valor < info_ubicacion.basevta_rep) {
        //   this.send_error(
        //     "El valor unitario no puede ser menor a la base de venta"
        //   );
        // } else {
        var item = JSON.parse(JSON.stringify(articulo));

        if (item.producto.descripcionpr_list)
          item.producto.descripcion_pr = item.producto.descripcionpr_list;

        // if (this.empresa[0].carguepr_empr == "0")
        //   item.producto.descripcion_pr = item.producto.descripcionpr_list;

        item.key = this.get_key();
        this.tablaDetalle.data.push(item);
        this.dialogo.estado = false;
        this.clear_form();
        // }
      }
    },
    change_articulo_modal() {
      var empresa = this.empresa;
      if (this.articulo_select.producto) {
        this.leer_producto();
        let producto = JSON.parse(
          JSON.stringify(this.articulo_select.producto)
        );
        let lista = "";

        lista = producto.descripcion_pr.trim();

        this.articulo_select.lista = lista;
        this.articulo_select.pesomat = producto.factorcant_pr;
      }
    },
    leer_producto() {
      return new Promise((resolve, reject) => {
        var empresa = this.empresa[0];
        var barra = this.articulo_select.barras || "";
        var producto = this.articulo_select.producto;
        let ubicacion = this.empresa.ubicaperfil_empr;
        var codigo = null;
        if (producto) {
          if (producto.codigopr_list) codigo = producto.codigopr_list;
          else if (producto.codigo_pr) codigo = producto.codigo_pr;
        }

        var fecha = this.form.fecha.replace(/\-/g, "");
        this.dialogo.loader = true;
        post
          .postData({
            url: "Ptovta/dlls/PrFact01P.dll",
            data:
              sessionStorage.Sesion +
              "|0|" +
              barra +
              "|" +
              codigo +
              "|" +
              fecha +
              "|" +
              ubicacion +
              "|",
            method: "",
          })
          .then((data) => {
            this.dialogo.loader = false;
            var articulo = data[0];
            var codigo_pr = articulo.codigo_rep.trim();
            var busqueda = this.productos.find((el) => {
              let codigo = null;

              if (el.codigopr_list) codigo = el.codigopr_list.trim();
              else if (el.codigo_pr) codigo = el.codigo_pr.trim();
              return codigo == codigo_pr;
            });
            if (codigo_pr) {
              this.articulo_select.producto = busqueda;
              var ubicaciones = [];
              articulo.ubicaciones_rep.forEach((el, index) => {
                if (el.ubicacion_rep.trim()) {
                  el.key = index;
                  el.valor_minimo = articulo.vlrmin_rep.trim();
                  el.basevta_rep =
                    parseFloat(
                      articulo.basevta_rep.toString().replace(/\,/g, "")
                    ) || 0;
                  ubicaciones.push(el);
                }
              });

              this.articulo_select.ubicaciones = ubicaciones;
              this.articulo_select.vlrmin = parseInt(articulo.vlrmin_rep);
              resolve();
            } else {
              reject();
              // this.articulo_select.producto = null;
              console.log("error", error);
              this.$emit("snack", {
                color: "error",
                text: "No se ha encontrado ningún producto con el código de barras.",
                estado: true,
              });
            }
          })
          .catch((err) => {
            this.dialogo.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Producto",
              estado: true,
            });
          });
      });
    },
    calcularSubtotal() {
      var item = this.articulo_select;
      item.iva = item.producto.tiva_pr;
      item.factorImpoc = parseInt(item.producto.timpocons_pr);

      this.errores.precio = 0;
      let conversion = 1;
      console.log(item);

      if (
        (parseInt(item.valor) < parseInt(item.vlrmin)) &
        (this.empresa.ctrvta_empr === "1")
      ) {
        this.errores.precio = 0;
      } else {
        let valorFormat =
          parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
        // this.articulo_select.valor = this.formatNumero(valorFormat);
        var iva = parseInt(item.iva) / 100 + 1;
        var cantidad = parseFloat(item.cantidad) || 0;
        var valorunit = parseFloat(item.valor) || 0;
        var factor = parseFloat(item.pesomat) || 0;
        let mts3 = valorunit * factor;
        var km = parseFloat(item.km) || 0;
        let valor_prod = cantidad * valorunit * factor * km;

        let baseiva = valor_prod;

        let vlriva_prod = 0;
        let vlrimpoc_prod = 0;
        let subtotal = 0;
        let subValor = 0;
        let totalprod = 0;

        if (this.articulo_select.ivainc) {
          vlrimpoc_prod = baseiva - baseiva / item.factorImpoc;
          vlriva_prod = baseiva - baseiva / iva;
          subtotal = baseiva - vlriva_prod - vlrimpoc_prod;
          totalprod = baseiva;

          // subtotal = baseiva - vlrimpoc_prod;
          // totalprod = totalprod + vlrimpoc_prod
        } else {
          let tariva = parseInt(item.iva);
          item.iva = tariva;
          if (item.iva == 0) {
            vlriva_prod = 0;
          } else {
            vlriva_prod = (baseiva * parseInt(item.iva)) / 100;
          }
          subtotal = baseiva + vlriva_prod;
          subValor = subtotal;
          totalprod = baseiva + vlriva_prod;

          // item.factorImpoc = (item.factorImpoc - 1) * 100
          if (item.factorImpoc == 0) {
            vlrimpoc_prod = 0;
          } else {
            vlrimpoc_prod = baseiva * (item.factorImpoc - 1);
          }
          subtotal = baseiva + vlrimpoc_prod;
          subValor = subtotal;
          totalprod = totalprod + vlrimpoc_prod;
        }
        var valorIva = vlriva_prod.toFixed(2);
        var valorImpoc = vlrimpoc_prod.toFixed(2);

        // this.articulo_select.cantidad = cantidad;
        this.articulo_select.Totaliva = vlriva_prod;
        this.articulo_select.ivaTotal = this.formatNumero(valorIva);
        this.articulo_select.impocTotal = this.formatNumero(valorImpoc);
        this.articulo_select.impoconsumo = vlrimpoc_prod;
        this.articulo_select.total = this.formatNumero(totalprod);
        this.articulo_select.subtotal = subtotal;
        this.articulo_select.mts3 = this.formatNumero(mts3);
      }
    },
    get_listas() {
      this.tablaDetalle.data = [];
      //        var listaCliente = this.form.clientes.listpr_rut;
      post
        .postData({
          url: "Financiero/dlls/CfcarglistasJ.dll",
          data: sessionStorage.Sesion + "|1|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.productos = data;
          // console.log("Listas", this.productos);
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar lista de precios",
            estado: true,
          });
        });
    },
    get_listas2() {
      if (this.form.clientes) {
        var listaCliente = this.form.clientes.listpr_rut;
        post
          .postData({
            url: "Financiero/dlls/CfcarglistasJ.dll",
            data: sessionStorage.Sesion + "|1|" + listaCliente + "|",
            method: "",
          })
          .then((data) => {
            this.productos = data;
            // console.log("Listas", this.productos);
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar lista de precios",
              estado: true,
            });
          });
      }
    },
    format_punto_fact: function (val) {
      return `${val.descripcion_agc}`;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    format_origen(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    format_destino(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_productos(val) {
      return `${val.codigo_pr} - ${
        val.descripcion_pr
          ? val.descripcion_pr.trim()
          : val.descripcionpr_list.trim()
      }`;
    },
    format_productos2(val) {
      return `${val.codigopr_list ? val.codigopr_list : val.codigo_pr} - ${
        val.descripcionpr_list ? val.descripcionpr_list : val.descripcion_pr
      }`;
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubica = data;
          this.articulo_select.ubicacion = {
            codigo_ubic: "0001",
            estado_ubic: "0",
            descrip_ubic: "BODEGA PRINCIPAL",
          };
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    get_consecutivo() {
      var $this = this;
      this.load.consecutivo = true;
      var fecha = this.form.fecha.replace(/-/g, "");

      post
        .postData({
          url: "financiero/dlls/PrConsecutivoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            4 +
            "|" +
            this.form.punto_fact.codigo_agc +
            "|" +
            "PED" +
            "|" +
            0 +
            "|" +
            fecha +
            "|" +
            "01" +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = data[0].nro_cons;
        })
        .catch((err) => {
          this.load.consecutivo = false;
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    get_fecha() {
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
    },
    clear_form() {
      this.articulo_select = {
        producto: null,
        lista: null,
        iva: 0,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
        ubicaciones: [],
        observacion: null,
      };
    },
    modificar_producto() {
      var $this = this;
      var index = this.edit_index;
      if (index > -1) {
        var item = JSON.parse(JSON.stringify(this.articulo_select));
        var detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
        detalle[index] = item;
        this.tablaDetalle.data = [];
        this.tablaDetalle.data = detalle;
      }

      this.dialogo.estado = false;
      this.clear_form();
    },
    edit_item(item) {
      this.dialogo.estado = true;
      this.articulo_select = JSON.parse(JSON.stringify(item));
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    get_key() {
      return Math.random().toString(36);
    },
  },
};
</script>
