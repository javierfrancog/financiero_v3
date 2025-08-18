<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Orden de Compra</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-divider color="succes"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickerFecha"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha"
                      label="Fecha"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="pickerFecha = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex justify-end d-flex" cols="12" sm="2">
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
            <v-row>
              <v-col cols="3">
                <v-select
                  :items="[
                    { text: 'No Aplica', value: 1 },
                    { text: 'Orden Cotización', value: 2 },
                  ]"
                  label="Documento Origen"
                  outlined
                  hide-details
                  v-model="form.doc_origen"
                  @change="
                    form.plazo = null;
                    errores.doc_origen = false;
                  "
                  :error="errores.doc_origen"
                ></v-select>
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="3"
                v-if="
                  form.doc_origen ? (form.doc_origen == 1 ? false : true) : true
                "
              >
                <v-menu
                  v-model="pickermes"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaord"
                      label="Periodo Orden Cotizacion"
                      append-icon="event"
                      hide-details
                      required
                      outlined
                      v-on="on"
                      autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaord"
                    scrollable
                    no-title
                    type="month"
                    @input="
                      pickerMes = false;
                      get_cotizaciones();
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="6"
                v-if="
                  form.doc_origen ? (form.doc_origen == 1 ? false : true) : true
                "
              >
                <v-autocomplete
                  label="Numero Orden"
                  v-model="form.ordenes"
                  :items="ordenes"
                  :item-text="format_orden"
                  hide-details
                  return-object
                  outlined
                  @change="get_ordencotiza"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Proveedor"
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
            </v-row>

            <v-divider color="succes"></v-divider>
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4"
                  dark
                  class
                  @click="abrir_popup"
                  depressed
                >
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
                  {{
                    formatNumero(
                      (
                        (parseFloat(item.total.toString().replace(/\,/g, "")) -
                          parseFloat(
                            (
                              parseFloat(
                                item.total.toString().replace(/\,/g, "")
                              ) -
                              parseFloat(
                                item.total.toString().replace(/\,/g, "")
                              ) /
                                item.valorIva
                            ).toFixed(0)
                          )) /
                        item.cantidad
                      ).toFixed(2)
                    )
                  }}
                </template>
                <template v-slot:item.total="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.total.toString().replace(/\,/g, ""))
                    )
                  }}
                </template>
                <template v-slot:item.valorDescuento="{ item }">
                  {{
                    formatNumero(
                      parseFloat(
                        item.valorDescuento.toString().replace(/\,/g, "")
                      )
                    )
                  }}
                </template>
                <template v-slot:item.sub_total="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.total.toString().replace(/\,/g, "")) -
                        parseFloat(
                          (
                            parseFloat(
                              item.total.toString().replace(/\,/g, "")
                            ) -
                            parseFloat(
                              item.total.toString().replace(/\,/g, "")
                            ) /
                              item.valorIva
                          ).toFixed(0)
                        )
                    )
                  }}
                </template>
                <template v-slot:item.ivaTotal="{ item }">
                  {{
                    formatNumero(
                      (
                        parseFloat(item.total.toString().replace(/\,/g, "")) -
                        parseFloat(item.total.toString().replace(/\,/g, "")) /
                          item.valorIva
                      ).toFixed(0)
                    )
                  }}
                </template>
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
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="succes"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre del Documento</v-card-subtitle
              >
            </v-row>

            <v-row>
              <v-col sm="4" cols="4">
                <v-text-field
                  outlined
                  clearable
                  label="Dirección de entrega"
                  v-model="form.sitioentrega"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickerFechaentr"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaentrega"
                      label="Fecha Entrega"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaentrega"
                    @input="pickerFechaentr = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col sm="3" cols="5">
                <v-text-field
                  outlined
                  clearable
                  label="Area de Destino"
                  v-model="form.destino"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="4" cols="4">
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
                  "
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="4" sm="2" v-if="form.fpago == 2">
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

              <v-col sm="3" cols="3">
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
            <v-col class="d-flex pb-0" cols="4">
              <v-autocomplete
                label="Centro de costos"
                v-model="form.ccosto"
                :items="tablaccosto"
                :item-text="format_ccosto"
                item-value="llavecentro_cost"
                hide-details
                return-object
                outlined
                :error="errores.ccosto"
                @change="errores.ccosto = false"
              ></v-autocomplete>
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
                ></v-textarea>
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
                @click="grabar_documento"
                >Grabar Documento</v-btn
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
                >Imprimir Documento</v-btn
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
        <v-card-title>
          <v-row justify="end">
            <v-btn color="light-blue accent-4 white--text" class depressed>
              <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
            </v-btn>
          </v-row>
        </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-col class="d-flex" cols="12" sm="12">
                <v-text-field
                  label="Producto/Servicio"
                  clearable
                  outlined
                  counter="360"
                  v-model="articulo_select.producto"
                  type="text"
                  autocomplete="off"
                  max="360"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  v-model="articulo_select.cantidad"
                  @input="calcularSubtotal"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col sm="6">
                <v-text-field
                  label="Valor unitario"
                  outlined
                  hide-details
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
            <v-row> </v-row>
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
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import { doc_ordencompra } from "../../_formatos.pdf.js";

export default {

  data() {
    return {
      agencias: [],
      pickerFecha: false,
      pickermes: false,
      pickerFechaentr: false,
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      prefijos: [],
      ordenes: [],
      listas: [],
      tablaccosto: [],      
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
            value: "producto",
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
        doc_origen: 1,
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
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
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
        ccosto: false,        
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
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaccostos();    

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          var cantidad = parseInt(val.cantidad);
          var descuento = parseFloat(
            val.valorDescuento.toString().replace(/\,/g, "")
          );

          let sub_total =
            parseFloat(val.subtotal.toString().replace(/\,/g, "")) || 0;
          let total_iva =
            parseFloat(val.ivaTotal.toString().replace(/\,/g, "")) || 0;
          let total = parseFloat(val.total.toString().replace(/\,/g, "")) || 0;

          $this.tablaDetalle.totales.total += total;
          let iva = total - (total / val.valorIva).toFixed(0);
          $this.tablaDetalle.totales.total_iva += iva;

          $this.tablaDetalle.totales.sub_total += total - iva;
        });
      },
      { deep: true }
    );
  },
  watch: {},
  methods: {
    get_ordencotiza() {
      let data = this.form.ordenes;
      var key =
        data.agencia_fact +
        "|" +
        data.numero_fact +
        "|" +
        data.fecha_fact.substr(0, 4) +
        "|";

      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrOrdCotizaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.form.sitioentrega = data[0].direccentrega_prov;
          this.form.fechaentrega = data[0].fentrega_prov;
          let productos = data[0].productos_prov;
          let tabla = [];
          productos.forEach((el) => {
            let cantidad = parseFloat(el.cantidad_prov) || 0;
            let valor = parseFloat(el.vlrunit_prov.replace(/\,/g, "")) || 0;

            let subtotal = cantidad * valor;

            let obj = {
              barras: null,
              cantidad,
              descuento: 0,
              iva: 0,
              ivaTotal: "0",
              key: this.get_key(),
              lista: null,
              manual: true,
              observacion: null,
              producto: el.nombreservicio_prov,
              subtotal: subtotal,
              total: subtotal,
              ubicaciones: [],
              valor: valor,
              valorDescuento: "0",
              valorIva: 0,
            };

            tabla.push(obj);
          });
          this.tablaDetalle.data = tabla;
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
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
    grabar_documento() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona una Agencia");
      } else if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Selecciona un Proveedor");
      } else if (detalle.length == 0) {
        this.send_error("Ingresa al menos un articulo en el detalle");
      } else if (data.fpago == 2 && !data.plazo) {
        this.errores.plazo = true;
        this.send_error("Ingresa los días de plazo");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var puntoFact = data.punto_fact.codigo_agc;
            var consecutivo = data.consecutivo.trim();
            var fecha = data.fecha.replace(/\-/g, "");
            var fechaentrega = data.fechaentrega.replace(/\-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var formaPago = data.fpago;
            var diasPlazo = formaPago != "2" ? "0" : data.plazo;
            var metodoPago = data.mpago ? data.mpago : "1";
            var observaciones = data.observaciones || "";
            var sitioentr = data.sitioentrega || "";
            var destino = data.destino || "";
            var ccosto = data.ccosto? data.ccosto.llavecentro_cost : "1001";            

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
              formaPago +
              "|" +
              diasPlazo +
              "|" +
              metodoPago +
              "|" +
              fechaentrega +
              "|" +
              sitioentr +
              "|" +
              destino +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|" +
              plano +
              "|" +              
              ccosto +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrOrdCompra01.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.disabled.imprimir_factura = false;
                this.print.comprobante = data[0];
                this.reset_formulario();
                this.$emit("snack", {
                  color: "success",
                  text: "Documento guardado correctamente",
                  estado: true,
                });
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                console.error(err);
                this.send_error("Error al grabar Documento");
              });
          })
          .catch((err) => {
            this.disabled.btn_enviar = false;
            this.load.btn_enviar = false;
            console.error(err);
            this.send_error(err);
          });
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
      this.form.valorRteica = 0;
      this.form.valorRetencion = 0;
      this.form.porcRetencion = 0;
      this.form.valorNeto = 0;

      this.productos = [];

      this.get_consecutivo();
    },

    get_impresion() {
      this.disabled.imprimir_factura = true;
      this.load.imprimir_factura = true;
      var agencia = this.form.punto_fact.codigo_agc;
      var consecutivo = this.print.comprobante.trim();
      var ano = this.form.fecha.replace(/-/g, "").substr(0, 4);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        ano +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrOrdCompraJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let data_impresion = data[0];
          data_impresion.observaciones_prov = data_impresion.observaciones1_prov + data_impresion.observaciones2_prov

          let empresa = this.empresa[0];

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,            
            direccionEmpresa: empresa.direccion_empr,
            telefonoEmpresa: empresa.telefono_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;

            doc_ordencompra(data_impresion).then((el) => {
              this.load.imprimir_factura = false;
              this.disabled.imprimir_factura = false;
            });
          });
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },

    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = _this.empresa[0];
        var nuevo = [];
        detalle.forEach((el) => {
          var cantidad = parseFloat(el.cantidad);
          var valorst = el.subtotal * cantidad;
          var valor = valorst / (1 + parseFloat(el.iva) / 100);

          var codigo = "";
          let producto = el.producto;

          nuevo.push({
            producto,
            cantidad: cantidad.toFixed(2),
            valor: valor.toFixed(2),
          });
        });

        var formData = new FormData();
        formData.append("tipo", "Ordencompra");
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
      if (this.form.clientes) {
        this.dialogo.estado = true;
        this.dialogo.tipo = true;
      } else {
        this.send_error("Debes seleccionar un Proveedor");
      }
    },
    agregar_servicio() {
      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 90) {
        this.send_error("La observación no puede exceder 90 carácteres");
      } else {
        let info_ubicacion = articulo.ubicaciones.find(
          (el) => el.codubica_rep.trim() == articulo.ubicacion.codigo_ubic
        );
        let valor =
          parseFloat(articulo.valor.toString().replace(/\,/g, "")) || 0;

        var item = JSON.parse(JSON.stringify(articulo));

        item.key = this.get_key();
        this.tablaDetalle.data.push(item);
        this.dialogo.estado = false;
        this.clear_form();
      }
    },

    calcularSubtotal() {
      var item = this.articulo_select;
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
        this.articulo_select.valor = this.formatNumero(valorFormat);

        var iva = parseInt(item.iva) / 100;

        var subtotal = valorFormat;
        var descuento =
          parseFloat(item.descuento.toString().replace(/\,/g, "")) || 0;
        var valorDescuento = subtotal * (descuento / 100);
        var subValor = subtotal - valorDescuento;

        var valorIva = (subValor * iva).toFixed(0);
        var valor = subValor;

        var total = valor * cantidad;

        this.articulo_select.descuento = descuento;
        this.articulo_select.cantidad = cantidad;
        this.articulo_select.ivaTotal = this.formatNumero(valorIva);
        this.articulo_select.valorDescuento = this.formatNumero(valorDescuento);
        this.articulo_select.total = this.formatNumero(total);
        this.articulo_select.subtotal = subtotal;
      }
      // }
    },

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    format_orden: function (val) {
      return `${val.numero_fact} - ${val.cliente_fact}`;
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
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
      var agencia = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/PrConsecutivoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            9 +
            "|" +
            agencia +
            "|" +
            "ORC" +
            "|" +
            0 +
            "|" +
            fecha +
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
    get_cotizaciones() {
      this.ordenes = [];

      if (!this.form.fechaord) {
        this.$emit("snack", {
          color: "error",
          text: "Seleccione Fecha de Orden",
          estado: true,
        });
      } else {
        var fechaini = this.form.fechaord.replace(/-/g, "");
        var fechafin = this.form.fechaord.replace(/-/g, "");
        this.loader = true;
        post
          .postData({
            url: "Ptovta/dlls/PrOrdcotiza02J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              999 +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.ordenes = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Cotizaciones",
              estado: true,
            });
          });
      }
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
