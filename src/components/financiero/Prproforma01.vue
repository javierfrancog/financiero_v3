<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
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
                >mdi-file-document-edit</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Pro_Forma</v-list-item-title>
            </v-list-item-content>
            <v-card-actions>
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="get_Clientes()"
                depressed
              >
                <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Fecha"
                  outlined
                  v-model="form.fecha"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="justify-end d-flex" cols="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="form.consecutivo"
                  disabled
                  hide-details
                  type="text"
                  :loading="load.consecutivo"
                  errores.consecutivo="false;"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Cliente"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="
                    errores.clientes = false;
                    get_consecutivo();
                    validar_cliente();
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn color="orange" dark class @click="abrir_popup" depressed>
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
                hide-default-footer
                disable-pagination
                :search-input.sync="search"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <b>Observación: </b> {{ item.observacion }}
                  </td>
                </template>
                <template v-slot:item.key="{ item }">{{
                  tablaDetalle.data.indexOf(item) + 1
                }}</template>
                <template v-slot:item.descrip_producto="{ item }">{{
                  item.producto.descripcion_pr ||
                  item.producto.descripcionpr_list
                }}</template>

                <template v-slot:item.present_producto="{ item }">{{
                  item.producto.present_pr
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
                  <td class="text-md-right text-center"></td>
                  <td colspan="5" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{
                        formatNumero(tablaDetalle.totales.descuentos || 0)
                      }}</strong
                    >
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>{{
                      formatNumero(tablaDetalle.totales.total_iva || 0)
                    }}</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>{{
                      formatNumero(tablaDetalle.totales.total_impoc || 0)
                    }}</strong>
                  </td>
                  <td class="text-xs-right text-center"></td>

                  <td class="text-xs-right text-center">
                    <strong>{{
                      formatNumero(tablaDetalle.totales.total || 0)
                    }}</strong>
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre Proforma</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="form.observaciones"
                  counter="500"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-center col-12">
            <v-col class="pa-0 px-0 mr-0" sm="2">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                :disabled="disabled.grabar_factura"
                depressed
                @click="grabar_factura"
                >Grabar Pro_Forma</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0 mr-2 ml-8" sm="2">
              <v-btn
                color="indigo"
                class="white--text form-control"
                large
                depressed
                ref="printprefactura"
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="imprimir_item"
                >Imprimir Pro_Forma</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" max-width="800" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
      >
        <v-card-title>
          <v-row sm="12" v-if="empresa.barras_empr == '1'">
            <v-col sm="8">
              <v-text-field
                label="Codigo de barras"
                outlined
                hide-details
                v-model="articulo_select.barras"
                @keyup.enter="verificar_codigo()"
                type="text"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="end">
            <v-col cols="6">
              <v-switch
                v-model="articulo_select.ivainc"
                @change="calcularSubtotal"
                label="Impuesto Incluido en Vlr Unitario"
                disabled
                hide-details
              ></v-switch>
            </v-col>
            <!-- <v-col cols="6" class="d-flex align-items-center justify-end">
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="get_listas2()"
                depressed
              >
                <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
              </v-btn>
            </v-col>-->
          </v-row>
        </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters v-if="input_articulo">
              <v-col>
                <v-autocomplete
                  label="Producto_"
                  :items="productos"
                  outlined
                  clearable
                  return-object
                  hint="Busca por código o descripción"
                  persistent-hint
                  item-value="codigo_pr"
                  v-model="articulo_select.producto"
                  :item-text="format_productos"
                  @change="change_articulo_modal"
                  :loading="load.servicios"
                  :search-input.sync="search"
                >
                  <!-- <template v-slot:selection="">
                      Test
                  </template> -->
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="7">
                <v-autocomplete
                  label="Centro de costos"
                  v-model="articulo_select.ccosto"
                  :items="tablaccosto"
                  :item-text="format_ccosto"
                  hide-details
                  return-object
                  outlined
                  :error="errores.ccosto"
                  @change="errores.ccosto = false"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-select
                  :items="unidad_med"
                  label="Unidad Medida"
                  outlined
                  hide-details
                  v-model="articulo_select.umedida"
                  @change="errores.umedida = false"
                ></v-select>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  clearable
                  :value="formatNumero(articulo_select.cantidad)"
                  @input="input_mask('cantidad', calcularSubtotal)"
                  type="text"
                ></v-text-field>
              </v-col>

              <v-col sm="6">
                <v-text-field
                  label="Vlr unitario"
                  outlined
                  hide-details
                  clearable
                  suffix="$"
                  :value="formatNumero(articulo_select.valor)"
                  @input="input_mask('valor', calcularSubtotal)"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="4">
                <v-text-field
                  label="Descuento x Unidad"
                  outlined
                  hide-details
                  suffix="$"
                  disabled
                  v-model="articulo_select.valorDescuento"
                ></v-text-field>
              </v-col>
              <v-col sm="4">
                <v-text-field
                  label="Total Descuento"
                  outlined
                  hide-details
                  suffix="$"
                  clearable
                  v-model="articulo_select.totalDescuento"
                  @input="
                    calcularSubtotal();
                    articulo_select.manual = true;
                  "
                ></v-text-field>
              </v-col>

              <v-col sm="4">
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
                  counter="270"
                  v-model="articulo_select.observacion"
                  type="text"
                  autocomplete="off"
                  max="270"
                  :disabled="disabled.observprod"
                ></v-text-field>
              </v-col>
            </v-row>
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
                color="purple darken-2"
                dark
                block
                depressed
                @click="agregar_servicio"
                >Agregar</v-btn
              >
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                @click="modificar_producto"
                depressed
                >Modificar Producto</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo.precio" max-width="700" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
      >
        <v-card-title>
          <v-row sm="12" v-if="empresa.barras_empr == '1'">
            <v-col sm="8">
              <v-text-field
                label="Codigo de barras"
                outlined
                hide-details
                v-model="articulo_select.barras"
                @keyup.enter="verificar_codigo()"
                type="text"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-col>
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
                  :item-text="format_productos"
                  :loading="load.servicios"
                  :search-input.sync="search"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row justify="center">
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

            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Vlr unitario"
                  outlined
                  hide-details
                  clearable
                  suffix="$"
                  v-model="articulo_select.valor"
                  @input="
                    calcularSubtotal();
                    articulo_select.manual = true;
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
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
                  dialogo.precio = false;
                  clear_form();
                "
                >Cerrar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template><style scoped>
.inputBig {
  font-size: 36px !important;
}
</style>


<script>

import post from "../../methods.js";
// import { factura } from "../../_formatos.pdf";
import { factura_titan, proforma_titan } from "../../_formatos.pdf";
import { FlowerSpinner } from "epic-spinners";

export default {

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      agencias: [],
      prefijos: [],
      pedidos: [],
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      listas: [],
      presentacion: [],
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],
      tablaccosto: [],
      error: [],
      correo: [],
      unidad_med: [
        { text: "Dia", value: 9 },
        { text: "Dias", value: 89 },
        { text: "Mes", value: 10 },
        { text: "Horas", value: 81 },
        { text: "Hora", value: 1 },
        { text: "Km", value: 12 },
        { text: "Viajes", value: 13 },
        { text: "Recorrido", value: 14 },
        
      ],

      proceso_imp: 0,
      correodestino: "",
      ccosto_fact: 0,
      carguepresentacion: null,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },

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
          // {
          //   text: "Item",
          //   align: "center",
          //   value: "key",
          // },
          {
            text: "Descripción",
            align: "left",
            value: "descrip_producto",
          },
          {
            text: "Presentación",
            align: "left",
            value: "presentacion.descripcion_rep",
          },
          {
            text: "Ubicación",
            align: "left",
            value: "ubicacion.descrip_ubic",
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
          // {
          //   text: "Sub-total",
          //   align: "center",
          //   value: "sub_total",
          // },
          {
            text: "V.Descuento",
            align: "center",
            value: "descuento",
          },
          {
            text: "IVA",
            align: "center",
            value: "ivaTotal",
          },
          {
            text: "Impoconsumo",
            align: "center",
            value: "impocTotal",
          },

          {
            text: " ",
            align: "center",
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
        doc_origen: 0,
        moneda: 1,
        pago_recibo: 0,
        pago_cambio: "0",
      },
      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
        pago: false,
        remision: false,
      },
      articulo_select: {
        barras: null,
        producto: null,
        lista: null,
        ivainc: null,
        iva: 0,
        impoconsumo: 0,
        ccosto: [],
        umedida: 0,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
        TotalIva: 0,
        factorImpoc: 0,
        ubicaciones: [],
        observacion: null,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        grabar_factura: true,
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
        observprod: false,
      },
      errores: {
        punto_fact: false,
        consecutivo: false,
        clientes: false,
        plazo: false,
        moneda: false,
        mpago: false,
        ccosto: false,
        umedida: false,
        tasa: false,
        presentacion: false,
      },
      print: {
        comprobante: null,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      search: null,
      input_articulo: false,
      card: {
        loader: false,
        disabled: false,
      },
      lista_pedidos: [],
      lista_remision: [],
      lista_cotizacion: [],
      titulo_print: null,
      condicion_pdf: true,
      correos: [],
      cufedian: "",
      tablaretefte: [
        { text: "Porcentaje", value: 1 },
        { text: "Bolsa Nacional Agropecuaria", value: 99 },
        { text: "No Aplica", value: 9 },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaubica();
    this.cargarCiudades();
    this.cargarTablaccostos();
    this.form.fpago = 2;
    this.$watch("form.fpago", this.re_calcular);
    this.montar_observaciones();

    // this.dialogo.pago = true;
    let nit = parseInt(sessionStorage.Sesion.substring(0, 15));

    if (this.empresa.obligfact_empr == 2) this.condicion_pdf = false;

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total_impoc = 0;
        $this.tablaDetalle.totales.descuentos = 0;
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
            parseFloat(val.totalDescuento.toString().replace(/\,/g, "")) || 0;
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
      this.calcular_retencion();
      // }
    },
  },
  // watch: (
  //   "this.form.porcrtefte", this.calcular_retencion(),
  //   { deep: true }
  // ),

  methods: {
    montar_observaciones() {
      this.form.observaciones =
        "-Tenga presente que así como queda esta proforma, de igal manera quedara la FACTURA ELECTRONICA." +
        `\n` +
        "-SI pasados 5 dias habiles a la fecha de esta FACTURA PRO-FORMA NO hemos recibido confirmacion escrita del recibido y aceptacion de la misma, se da por recibida y aceptada de su parte por lo que procedereremos a facturar electronicamente.";
    },
    cargarCiudades() {
      var datosEnvio = `${sessionStorage.Sesion}|`;
      post
        .postData({
          url: "Financiero/dlls/CfCiudadJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ciudades_dian = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    get_infoPedido() {
      this.tablaDetalle.data = [];

      var _this = this;
      var pedido = this.form.pedido;
      if (pedido) {
        var fecha = pedido.fecha_fact.substr(0, 4);
        var datosEnvio = `${sessionStorage.Sesion}|${pedido.agencia_fact}|${pedido.pref_fact}|${pedido.numero_fact}|${fecha}|`;
        post
          .postData({
            url: "ptovta/dlls/PrPedido04J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            var lista = res[0].productos;
            var nuevo_detalle = [];

            lista.forEach((el) => {
              let cantidad = parseFloat(el.cantidad);
              let iva = parseFloat(el.iva) || 0;
              let ivaTotal = 0;
              let producto = _this.productos.find(
                (item) => item.codigopr_list.trim() == el.codigo.trim()
              );
              let subtotal =
                parseFloat(el.vlr_subtotal.replace(/\,/g, "")) || 0;
              let total = subtotal + ivaTotal;
              let ubicacion = {
                codigo_ubic: "0001",
                descrip_ubic: "BODEGA PRINCIPAL",
                estado_ubic: "0",
              };
              let descuento = el.vlr_dcto || 0;
              let valorIva = iva / 100 + 1;

              nuevo_detalle.push({
                barras: null,
                cantidad,
                descuento: 0,
                iva,
                ivaTotal,
                key: _this.get_key(),
                lista: el.nombre_servicio,
                manual: false,
                observacion: null,
                producto,
                subtotal,
                total: _this.formatNumero(total),
                ubicacion,
                ubicaciones: [],
                valor: _this.formatNumero(subtotal),
                valorDescuento: descuento,
                valorIva,
              });
            });

            _this.tablaDetalle.data = [];
            _this.tablaDetalle.data = nuevo_detalle;
          });
      }
    },
    get_infoCotiza() {
      this.tablaDetalle.data = [];

      var _this = this;
      var pedido = this.form.cotiza;
      if (pedido) {
        var fecha = pedido.fecha_fact.substr(0, 4);
        var datosEnvio = `${sessionStorage.Sesion}|${pedido.agencia_fact}|${pedido.pref_fact}|${pedido.numero_fact}|${fecha}|`;
        post
          .postData({
            url: "ptovta/dlls/PrCotiza04J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            var lista = res[0].productos;
            var nuevo_detalle = [];

            lista.forEach((el) => {
              let cantidad = parseFloat(el.cantidad);
              let iva = parseFloat(el.iva) || 0;
              let ivaTotal = iva;
              let producto = _this.productos.find(
                (item) => item.codigopr_list.trim() == el.codigo.trim()
              );
              let subtotal =
                parseFloat(el.vlr_subtotal.replace(/\,/g, "")) || 0;
              let total = subtotal + ivaTotal;
              let ubicacion = {
                codigo_ubic: "0001",
                descrip_ubic: "BODEGA PRINCIPAL",
                estado_ubic: "0",
              };
              // let descuento = el.vlr_dcto || 0;
              let descuento = 0;
              let valorIva = iva / 100 + 1;

              nuevo_detalle.push({
                barras: null,
                cantidad,
                descuento: 0,
                iva,
                ivaTotal,
                key: _this.get_key(),
                lista: el.nombre_servicio,
                manual: false,
                observacion: null,
                producto,
                subtotal,
                total: _this.formatNumero(total),
                ubicacion,
                origen: "",
                destino: "",
                placas: "",
                remision: "",
                ccosto: "",
                impoconsumo: 0,
                presentacion: "",
                ubicaciones: [],
                valor: _this.formatNumero(subtotal),
                valorDescuento: descuento,
                valorIva,
              });
            });

            // _this.tablaDetalle.data = [];
            _this.tablaDetalle.data = nuevo_detalle;
            this.disabled.grabar_factura = false;
          });
      }
    },
    validar_docOrigen() {
      var _this = this;
      var cliente = this.form.clientes.identificacion_rut;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = `${sessionStorage.Sesion}|0|${cliente}|${fecha}|`;
      var docOrigen = this.form.doc_origen;
      if (docOrigen == 1) {
        post
          .postData({
            url: "ptovta/dlls/PrPedido02J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            _this.lista_pedidos = res;
          });
      } else if (docOrigen == 2) {
        post
          .postData({
            url: "ptovta/dlls/PrCotiza03J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            _this.lista_cotizacion = res;
          });
      } else if (docOrigen == 3) {
        post
          .postData({
            url: "ptovta/dlls/PrRemision05J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            res.pop();
            _this.lista_remision = res;
            this.dialogo.remision = true;
            this.disabled.grabar_factura = false;
          });
      }
    },
    calcular_retencion() {
      let subTotal = parseFloat(this.tablaDetalle.totales.sub_total);
      let porcentaje_ret = parseFloat(this.form.porcrtefte);
      porcentaje_ret = porcentaje_ret / 100;

      let retencion = 0;

      if (this.form.retencion === 1) {
        retencion = subTotal * porcentaje_ret;
      }
      this.form.textimpuesto = this.formatNumero(retencion.toFixed(0)) || 0;
    },
    format_pedido(item) {
      return item.fecha_fact + " - " + item.numero_fact;
    },
    format_cotiza(item) {
      return item.fecha_fact + " - " + item.numero_fact.trim();
    },
    calcularPago() {
      let vrl_fact = this.form.pago_factura.replace(/\,/g, "");
      let vlr_rec = this.form.pago_recibo.replace(/\,/g, "");
      let vlr_cambio = vlr_rec - vrl_fact;
      this.form.pago_cambio = this.formatNumero(vlr_cambio);
    },
    async clear_pago() {
      this.form.pago_factura = "0";
      this.form.pago_recibo = "0";
      this.form.pago_cambio = "0";
    },
    agregar_producto() {
      this.dialogo.remision = false;
      this.form.remision = this.articulo_select.producto;
      this.get_remision();
    },
    get_remision() {
      this.tablaDetalle.data = [];

      var _this = this;
      var remisiones = this.form.remision;
      if (remisiones) {
        remisiones.forEach((remision) => {
          var fecha = remision.fecha_rep.substr(0, 4);
          var datosEnvio = `${sessionStorage.Sesion}|${remision.agencia_rep}|${remision.pref_rep}|${remision.nro_rep}|${fecha}|`;
          let nro_remi =
            "Remision:" +
            remision.agencia_rep +
            "_" +
            remision.pref_rep +
            "_" +
            parseInt(remision.nro_rep);
          this.disabled.observprod = true;
          post
            .postData({
              url: "ptovta/dlls/PrRemision04J.dll",
              data: datosEnvio,
              method: "",
            })
            .then((res) => {
              var lista = res[0].productos;
              var nuevo_detalle = [];

              lista.forEach((el) => {
                let cantidad = parseFloat(el.cantidad.replace(/\,/g, "")) || 0;
                let iva = parseFloat(el.iva) || 0;
                let ivaTotal = 0;
                let subtotal =
                  parseFloat(el.vlr_subtotal.replace(/\,/g, "")) || 0;
                let unitario = subtotal / cantidad;
                let producto = _this.productos.find(
                  (item) => item.codigopr_list.trim() == el.codigo.trim()
                );
                let total = subtotal + ivaTotal;
                let ubicacion = {
                  codigo_ubic: "0001",
                  descrip_ubic: "BODEGA PRINCIPAL",
                  estado_ubic: "0",
                };
                let descuento = el.vlr_dcto || 0;
                let valorIva = iva / 100 + 1;
                let impoconsumo = 0;

                nuevo_detalle.push({
                  barras: null,
                  cantidad,
                  descuento: 0,
                  iva,
                  impoconsumo,
                  ivaTotal,
                  key: _this.get_key(),
                  lista: el.nombre_servicio,
                  manual: false,
                  observacion: nro_remi,
                  producto,
                  factorImpoc: 1,
                  subtotal,
                  total: _this.formatNumero(total),
                  ubicacion,
                  ubicaciones: [],
                  valor: _this.formatNumero(unitario),
                  valorDescuento: descuento,
                  valorIva,
                });
              });

              let newsList = [..._this.tablaDetalle.data, ...nuevo_detalle];

              _this.tablaDetalle.data = [];
              _this.tablaDetalle.data = newsList;
            })
            .catch((error) => {
              console.log("error", error);
            });
        });
      }
    },

    validar_cliente() {
      this.form.doc_origen = 0;
      this.form.pedido = null;
      this.tablaDetalle.data = [];

      var empresa = this.empresa;
      if (empresa.listaspr_empr == "2") {
        this.input_articulo = false;
        this.get_listas(2);
      } else {
        this.input_articulo = true;
      }
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
          this.articulo_select.producto = busqueda;
          this.change_articulo_modal();
        })
        .catch((err) => {
          this.dialogo.loader = false;
          this.load.servicios = false;
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
        });
    },
    set_diasPlazo() {
      if (this.form.fpago == 2) this.form.plazo = this.form.clientes.diaspl_rut;
      else this.form.plazo = 0;
    },
    format_impresion(data) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.condicion = this.condicion_pdf;
        factura(data).then(() => {
          console.log("Impresión terminada");
        });
      });
    },
    async grabar_factura() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      let observaciones = data.observaciones;

      if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Selecciona un prefijo de facturación");
      } else if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Selecciona un cliente");
      } else if (detalle.length == 0) {
        this.send_error("Ingresa al menos un articulo en el detalle");
      } else if (observaciones && observaciones.length > 500) {
        this.send_error(
          "La observación excede la cantidad de caracteres permitidos"
        );
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var puntoFact = "0001";
            var consecutivo = data.consecutivo;
            var fecha = data.fecha.replace(/\-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var observaciones64 = data.observaciones
              ? window.btoa(data.observaciones)
              : "";
            var observaciones = observaciones64 || "";
            var datosEnvio =
              sesion +
              "|" +
              puntoFact +
              "|" +
              consecutivo +
              "|" +
              fecha +
              "|" +
              cliente +
              "|" +
              plano +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/ProForma01.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.disabled.imprimir_factura = false;
                this.disabled.grabar_factura = true;
                this.print.comprobante = data[0];
                this.reset_formulario();

                this.$emit("snack", {
                  color: "success",
                  text: "Factura guardada correctamente",
                  estado: true,
                });
              })
              .catch((err) => {
                console.log(err);
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.disabled.grabar_factura = true;
                this.send_error("Error al grabar la factura");
              });
          })
          .catch((err) => {
            this.disabled.btn_enviar = false;
            this.load.btn_enviar = false;
            this.send_error(err);
          });
      }
    },
    reset_formulario() {
      this.clear_form();
      this.form.clientes = null;
      this.tablaDetalle.data = [];
      if (this.empresa.listaspr_empr == "2") {
        this.productos = [];
      }
      this.get_consecutivo();
    },
    get_pdf_pos(data) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      let nombre64 = " ";
      let detalles = data.productos.map((item) => {
        nombre64 = window.atob(
          item.base1_pr +
            item.base2_pr +
            item.base3_pr +
            item.base4_pr +
            item.base5_pr
        );
        if (nombre64) {
          item.nombre_servicio = nombre64;
        }
        return item;
      });
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.prfact02_pos(data, logo);
      });
    },

    imprimir_item(item) {
      this.proceso_imp = 1;
      this.print_item(item);
    },

    async print_item(item, getBase64) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      let factura = this.print.comprobante.split("|");
      let nrofact = factura[2];
      var agencia = "0001";
      let prefijo = "0001";
      var key = agencia + "|" + prefijo + "|" + nrofact + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Ptovta/dlls/PrProforma01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.correodestino = data[0].email_cliente.trim();
          return await this.generar_pdf_2(data[0], getBase64);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      if (getBase64) return await proforma_titan(data, getBase64);
      else proforma_titan(data);
    },
    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = _this.empresa;
        var nuevo = [];

        detalle.forEach((el) => {
          var ivaTotal =
            parseFloat(el.ivaTotal.toString().replace(/\,/g, "")) || 0;
          var impocTotal =
            parseFloat(el.ivaTotal.toString().replace(/\,/g, "")) || 0;
          var valorDescuento =
            parseFloat(el.totalDescuento.toString().replace(/\,/g, "")) || 0;

          var valorIva = 0;
          var cantidad = parseFloat(el.cantidad);
          var valorst = el.subtotal * cantidad;

          if (el.ivainc) {
            el.subtotal = el.subtotal + 0;
            var valor = valorst / (1 + parseFloat(el.iva) / 100);
            valorIva = valorst - valor;
          } else {
            el.subtotal = el.subtotal + 0;
            valorIva = ivaTotal;
          }
          var descuento = valorDescuento;
          var iva = valorIva;
          var presentacion = el.presentacion ? el.presentacion.codigo_rep : 0;

          var codigo = "";
          if (el.producto.codigopr_list)
            codigo = el.producto.codigopr_list.trim();
          else if (el.producto.codigo_pr) codigo = el.producto.codigo_pr.trim();

          let nro_remision = 0;
          let data_remision = 0;
          let prefremision = "";
          let agenremision = "";

          let docOrigen = this.form.doc_origen ? this.form.doc_origen : 0;

          if (docOrigen == 3) {
            if (el.observacion) {
              data_remision = el.observacion.split(":");
              data_remision = data_remision[1].split("_");
            }
            if (data_remision) {
              agenremision = data_remision[0];
              prefremision = data_remision[1];
              nro_remision = data_remision[2];
            }
          }

          nuevo.push({
            ubicacion: "0001",
            codigo,
            cantidad: cantidad.toFixed(2),
            valor: el.subtotal.toFixed(2),
            descuento: valorDescuento.toFixed(2),
            iva: ivaTotal.toFixed(2),
            observacion: el.observacion || "",
            origen: "",
            destino: "",
            placas: "",
            remision: "",
            ccosto: el.ccosto ? el.ccosto.llavecentro_cost : "0000",
            impoconsumo: 0,
            presentacion,
            prefremis: "",
            agcremision: "",
            unidadmed: el.umedida || "0",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "Proforma");
        formData.append("data", JSON.stringify(nuevo));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
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
          var unitario = base + incremento + valorPorcentaje;
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
        this.disabled.grabar_factura = false;
        this.articulo_select.ubicacion = {
          codigo_ubic: "0001",
          estado_ubic: "0",
          descrip_ubic: "BODEGA PRINCIPAL",
        };
        this.articulo_select.ccosto = {
          centro_cost: "10",
          descrip_cost: "Principal",
          estado_cost: "0",
          llavecentro_cost: "0000",
          subcentro_cost: "01",
          tipo_cost: "2",
        };

        if (this.empresa.ivainc_empr == "1") {
          this.articulo_select.ivainc = true;
        }
      } else {
        this.send_error("Debes seleccionar un cliente");
      }
    },
    abrir_precios() {
      this.dialogo.precio = true;
    },
    agregar_servicio() {
      var articulo = this.articulo_select;
      let presentacion = this.articulo_select.presentacion;

      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.ubicacion) {
        this.send_error("Seleccione una ubicación");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 270) {
        this.send_error("La observación no puede exceder 270 carácteres");
      } else if (this.error.precio === 1) {
        this.send_error("Precio Menor al Autorizado");
      } else if (!presentacion && this.carguepresentacion == 1) {
        this.send_error("Debe Seleccionar una Presentación");
      } else if (
        articulo.ccosto.llavecentro_cost == "0000" &&
        this.empresa.ccostofact_empr == "1"
      ) {
        this.errores.ccosto = true;
        this.send_error("Debe Seleccionar un Centro de Costo");
      } else if (
        articulo.umedida == "0" &&
        this.empresa.ccostofact_empr == "1"
      ) {
        this.errores.umedida = true;
        this.send_error("Debe Seleccionar una Unidad de Medida");
      } else {
        if (articulo.valor == "0") {
          this.send_error("Valor unitario en 0");
        }

        let info_ubicacion = articulo.ubicaciones.find(
          (el) => el.codubica_rep.trim() == articulo.ubicacion.codigo_ubic
        );
        let vrpresent = 1;
        let valor = this.articulo_select.valor;
        this.articulo_select.valor = this.formatNumero(valor * vrpresent);
        var item = JSON.parse(JSON.stringify(articulo));

        if (item.producto.descripcionpr_list)
          item.producto.descripcion_pr = item.producto.descripcionpr_list;

        item.key = this.get_key();
        this.tablaDetalle.data.push(item);
        this.dialogo.estado = false;
        this.clear_form();
        // }
      }
    },
    change_articulo_modal() {
      var empresa = this.empresa;

      if (empresa.id_empr == "000000901496778") {
        this.articulo_select.observacion =
          "PRESTADO A LA EMPRESA I VOUCION PROYECTOS SAS CON RECORRIDO ENTRE MONTERREY CAS - YOPAL EN CAMIONETA NHP 709 CON DISPONIBILIDAD 12 HORAS EL DIA 09 DE MAYO 2024";
      }
      let cantconv = 1;
      if (this.articulo_select.presentacion) {
        cantconv = parseFloat(this.articulo_select.presentacion.cantidad_rep);
      }
      if (this.articulo_select.producto) {
        this.leer_producto()
          .then(() => {
            var producto = JSON.parse(
              JSON.stringify(this.articulo_select.producto)
            );

            if (producto) {
              var formaPago = this.form.fpago;

              var lista = "";
              if (producto.descripcionpr_list)
                lista = producto.descripcionpr_list.trim();
              else if (producto.descripcion_pr)
                lista = producto.descripcion_pr.trim();

              this.articulo_select.lista = lista;
              this.articulo_select.iva = parseFloat(producto.porciva_list) || 0;
              var subtotalProducto = 0;
              var ivaProducto = 0;
              var valorProducto = 0;
              var base = 0;
              var incremento = 0;
              var porcentaje = 0;
              var porcentajeIva =
                parseFloat(producto.porciva_list.replace(/\,/g, "")) || 0;
              var iva = porcentajeIva / 100 + 1;

              var porcentajeImpoc =
                parseFloat(producto.impoconsumo_list.replace(/\,/g, "")) || 0;
              var impoconsumo = porcentajeImpoc / 100 + 1;

              if (formaPago == 1 || formaPago == 3) {
                base =
                  parseFloat(producto.basecontado_list.replace(/\,/g, "")) || 0;
                incremento =
                  parseFloat(producto.inccontado_list.replace(/\,/g, "")) || 0;
                porcentaje =
                  parseFloat(
                    producto.porccontado_list
                      .replace(/\,/g, "")
                      .replace(/\s+/g, "")
                  ) || 0;
              } else if (formaPago == 2) {
                base =
                  parseFloat(producto.basecredito_list.replace(/\,/g, "")) || 0;
                incremento =
                  parseFloat(producto.inccredito_list.replace(/\,/g, "")) || 0;
                porcentaje =
                  parseFloat(
                    producto.porccredito_list
                      .replace(/\,/g, "")
                      .replace(/\s+/g, "")
                  ) || 0;
              }
              base = base * cantconv;
              var valorPorcentaje = (base * porcentaje) / 100;
              var subtotal = base + incremento + valorPorcentaje;
              subtotalProducto = subtotal;

              valorProducto = subtotal * iva;
              this.articulo_select.valorIva = iva;
              this.articulo_select.factorImpoc = impoconsumo;

              this.articulo_select.subtotal = subtotalProducto;
              this.articulo_select.valor = subtotal;
              this.articulo_select.cantidad = 1;
              this.articulo_select.totalDescuento = 0;

              this.calcularSubtotal();
            } else {
              this.clear_form();
            }
          })
          .catch((err) => {
            this.clear_form();
          });
      } else {
        this.clear_form();
      }
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.articulo_select, index, val_edit);
      if (callback) callback();
    },
    calcularSubtotal() {
      var item = this.articulo_select;
      this.error.precio = 0;
      let conversion = 1;

      if (!item.ubicacion) {
        setTimeout(() => {
          // this.articulo_select.cantidad = 0;
          this.articulo_select.totalDescuento = 0;
        }, 500);
        this.$emit("snack", {
          color: "orange",
          text: "Selecciona una ubicacion",
          estado: true,
        });
      } else if (
        (parseInt(item.valor) < parseInt(item.vlrmin)) &
        (this.empresa.ctrvta_empr === "1")
      ) {
        this.error.precio = 0;
      } else {
        var saldo_array = item.ubicaciones.find(
          (el) => el.codubica_rep.trim() == item.ubicacion.codigo_ubic
        );
        var saldo = parseFloat(item.cantidad) || 0;
        var cantidad = parseFloat(item.cantidad) || 0;

        if (cantidad > saldo) {
          setTimeout(() => {
            this.articulo_select.cantidad = saldo;
          }, 200);
          this.send_error("La cantidad supera el valor del saldo");
        } else {
          var valorFormat =
            parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;

          // var descuento =
          //   parseFloat(item.valorDescuento.toString().replace(/\,/g, "")) || 0;
          // var valorDescuento = descuento;

          var descuento =
            parseFloat(item.totalDescuento.toString().replace(/\,/g, "")) || 0;
          var valorDescuento = descuento;
          var vlrDctoUnitario = descuento / cantidad;

          var iva = parseInt(item.iva) / 100 + 1;

          let baseiva = valorFormat * cantidad - descuento;
          baseiva = baseiva * conversion;

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
            vlriva_prod = (baseiva * parseInt(item.iva)) / 100;

            subtotal = baseiva + vlriva_prod;
            subValor = subtotal;
            totalprod = baseiva + vlriva_prod;

            // item.factorImpoc = (item.factorImpoc - 1) * 100
            vlrimpoc_prod = baseiva * (item.factorImpoc - 1);
            subtotal = baseiva + vlrimpoc_prod;
            subValor = subtotal;
            totalprod = totalprod + vlrimpoc_prod;
          }

          var valorIva = vlriva_prod.toFixed(2);
          var valorImpoc = vlrimpoc_prod.toFixed(2);

          this.articulo_select.descuento = descuento;
          // this.articulo_select.cantidad = cantidad;
          this.articulo_select.Totaliva = vlriva_prod;
          this.articulo_select.ivaTotal = this.formatNumero(valorIva);
          this.articulo_select.impocTotal = this.formatNumero(valorImpoc);
          this.articulo_select.impoconsumo = vlrimpoc_prod;
          this.articulo_select.valorDescuento =
            this.formatNumero(vlrDctoUnitario);
          this.articulo_select.total = this.formatNumero(totalprod);
          this.articulo_select.subtotal = subtotal;
        }
        if (this.empresa.ccostofact_empr == "0") {
          this.articulo_select.ccosto = {
            centro_cost: "10",
            descrip_cost: "Principal",
            estado_cost: "0",
            llavecentro_cost: "0000",
            subcentro_cost: "01",
            tipo_cost: "2",
          };
        }
      }
    },
    get_listas(tipo) {
      this.tablaDetalle.data = [];
      if (this.form.clientes || tipo == 1) {
        var listaCliente = tipo == 2 ? this.form.clientes.listpr_rut : "001";
        post
          .postData({
            url: "Financiero/dlls/CfcarglistasJ.dll",
            data: sessionStorage.Sesion + "|1|" + listaCliente + "|",
            method: "",
          })
          .then((data) => {
            // this.productos = data;
            data.pop();
            var data_parse = JSON.parse(JSON.stringify(data));
            data_parse.map((el, index) => {
              el.descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim()
              );
              if (el.descripcion64) {
                el.descripcionpr_list = el.descripcion64;
              }
              el.index = index;
              return el;
            });

            this.productos = data_parse;
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar lista de precios",
              estado: true,
            });
          });
      }
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
    leer_producto() {
      return new Promise((resolve, reject) => {
        var empresa = this.empresa;
        var barra = this.articulo_select.barras || "";
        var producto = this.articulo_select.producto;

        var codigo = null;
        if (producto) {
          if (producto.codigopr_list) codigo = producto.codigopr_list;
          else if (producto.codigo_pr) codigo = producto.codigo_pr;
        }

        // if (empresa.carguepr_empr == "0")
        //   codigo = producto ? producto.codigopr_list : "";
        // else {
        //   codigo = producto ? producto.codigo_pr : "";
        // }

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

              // if (empresa.carguepr_empr == "0")
              //   codigo = el.codigopr_list.trim();
              // else {
              //   codigo = el.codigo_pr.trim();
              // }

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
              this.articulo_select.producto = null;
              this.articulo_select.ubicaciones = [];
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
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    format_ciudad: function (val) {
      return `${val.ciudad_rep.trim()} - ${val.dpto_rep.trim()}`;
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_productos(val) {
      return `${
        val.codigopr_list
          ? val.codigopr_list +
            val.descripcionpr_list.trim() +
            "_iva " +
            val.porciva_list.trim() +
            " %"
          : val.codigo_pr
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
          let cliente = "000000222222222";
          let busqueda_cli = this.clientes.find(
            (el) => el.identificacion_rut.trim() == cliente
          );
          this.form.clientes = busqueda_cli;
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
          this.empresa = data[0];
          let forma_pago = parseInt(this.empresa.fpagocont_empr) || 2;
          this.form.fpago = forma_pago;
          if (this.empresa.listaspr_empr == "1") {
            this.get_listas(1);
          }
          this.carguepresentacion = 0;
          if (this.empresa.id_empr === "000001014185545") {
            this.carguepresentacion = 1;
          }
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
          url: "Ptovta/dlls/PrProformaN.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          this.load.consecutivo = false;
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
        if (item.valor == "0") {
          this.send_error("Valor unitario en 0");
        }
        if (this.error.precio === 1) {
          this.send_error("Precio Menor al Autorizado");
        } else {
          var detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
          detalle[index] = item;
          this.tablaDetalle.data = [];
          this.tablaDetalle.data = detalle;
          this.dialogo.estado = false;
          this.clear_form();
        }
      }
    },
    edit_item(item) {
      let valorunit = item.valor.replace(/\,/g, "");
      item.valor = valorunit;
      this.dialogo.estado = true;
      this.articulo_select = JSON.parse(JSON.stringify(item));
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
      this.calcular_retencion();
    },
    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },

    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
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
<style scoped>
hr {
  border-width: 15% !important;
}
</style>