<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">flip_to_front</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Documento Soporte No Obligados a Facturar</v-list-item-title
              >
            </v-list-item-content>
            <v-btn
              color="light-blue accent-4 white--text"
              class
              @click="get_Clientes(), cargarcuentas(), cargarcuentaica()"
              depressed
            >
              <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
            </v-btn>
          </v-list-item>
        </v-card-title>
        <v-divider color="succes"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="mt-2">
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="
                    get_resolucion();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Prefijo"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="form.consecutivo"
                  :disabled="disable_consec == false"
                  hide-details
                  type="text"
                  :loading="load.consecutivo"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Registro"
                      outlined
                      v-model="form.fecha"
                      @change="get_consecutivo()"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
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
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Pasivo Retención"
                  v-model="form.ctaret"
                  :items="cuentas"
                  :item-text="format_cuentas"
                  item-value="cod_puc"
                  @change="calcular_retefuente"
                  clearable
                  outlined
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="% Retefuente"
                  outlined
                  hide-details
                  clearable
                  disabled
                  v-model="form.porcRetencion"
                  @input="calcular_retefuente"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Vlr_Retefuente"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.valorRetencion)"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  v-model="form.asumida"
                  color="red"
                  label="Retefuente Asumida"
                  @change="calcular_retefuente"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Pasivo ReteIca"
                  v-model="form.ctaretica"
                  :items="cuentasica"
                  :item-text="format_cuentas"
                  item-value="cod_puc"
                  @change="calcular_reteica"
                  clearable
                  outlined
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="% ReteIca"
                  outlined
                  hide-details
                  disabled
                  v-model="form.porcRteica"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Vlr_ReteIca"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.valorRteica)"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  label="Vlr_Anticipos"
                  outlined
                  clearable
                  hide-details
                  v-model="form.valorAnticipos"
                  @input="calcular_neto"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex align-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="light-blue accent-4 white--text"
                      class
                      @click="consultar_anticipo()"
                      depressed
                    >
                      <v-icon size="30" center>mdi-account-cash</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Anticipos</span>
                </v-tooltip>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Doc_Anticipo"
                  outlined
                  disabled
                  hide-details
                  v-model="form.docAnticipo"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  label="Otros Descuentos"
                  outlined
                  hide-details
                  clearable
                  v-model="form.otrosDctos"
                  @input="calcular_neto"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  label="Neto a cancelar"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.valorNeto)"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="3" cols="4">
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
          <v-spacer />
          <v-btn
            color="indigo darken-1"
            class="white--text"
            large
            depressed
            @click="grabar_documento"
            >Grabar Documento</v-btn
          >
          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            large
            :disabled="disabled.imprimir_factura"
            :loading="load.imprimir_factura"
            @click="get_impresion"
            >Pre_Imprimir</v-btn
          >
          <!-- <v-btn
            color="orange darken-1"
            class="white--text"
            large
            depressed
            :disabled="disabled.imprimir_factura"
            @click="dialogoconcepto.estado = true"
            >Contabilizar
            </v-btn> -->
          <!-- <v-btn
            color="green darken-1"
            class="white--text"
            large
            depressed
            :disabled="disabled.imprimir_factura"
            @click="send_dian()"
            >Enviar Dian
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogoconcepto.estado" persistent max-width="600">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Contabilización</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="formComprobante">
            <v-col class="pa-2 px-0">
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Concepto Contable"
                    v-model="comprobante.conc_conta"
                    :items="conceptosc"
                    :item-text="format_conceptos"
                    hide-details
                    return-object
                    outlined
                    clearable
                    :error="error.conc_conta"
                    @change="
                      error.conc_conta = false;
                      comprobante.rut = null;
                    "
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" v-if="caja_comision">
                  <v-text-field
                    label="Vlr_Comisión"
                    outlined
                    clearable
                    hide-details
                    v-model="comprobante.valorComision"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-textarea
                    label="Detalle Contabilidad"
                    clearable
                    outlined
                    v-model="comprobante.detalle"
                    counter="60"
                    max
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Centro de costos"
                    v-model="comprobante.ccosto"
                    :items="tablaccosto"
                    :item-text="format_ccosto"
                    hide-details
                    return-object
                    outlined
                    :error="error.ccosto"
                    @change="error.ccosto = false"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class
            color="red"
            text
            @click="
              dialogoconcepto.estado = false;
              initComprobante();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ml-2"
            color="green darken-1"
            depressed
            dark
            text
            @click="grabar_contabilidad"
            >Contabilizar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado" max-width="700" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
      >
        <v-card-title> </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-col class="d-flex" cols="12" sm="12">
                <v-text-field
                  label="Producto/Servicio"
                  clearable
                  outlined
                  counter="290"
                  v-model="articulo_select.producto"
                  type="text"
                  autocomplete="off"
                  max="90"
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
    <v-dialog v-model="modal_anticipos.estado" persistent max-width="600">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Anticipos pendientes</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-data-table
            :items="modal_anticipos.data"
            :headers="[
              { text: 'Documento', value: 'docabrev_prov', align: 'left' },
              { text: 'Fecha', value: 'fecha_cart' },
              { text: 'Nro Control', value: 'numero_cart', align: 'center' },
              { text: 'Valor', value: 'valor_cart', align: 'right' },
              { text: '', value: 'action', align: 'right' },
            ]"
          >
            <template v-slot:item.action="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="blue accent-3"
                    fab
                    small
                    icon
                    v-on="on"
                    @click="seleccionar_anticipo(item)"
                  >
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </template>
                <span>Seleccionar anticipo</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class color="red" text @click="modal_anticipos.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import { doc_soporte } from "../../_formatos.pdf.js";

export default {

  data() {
    return {
      dialogPicker: false,
      agencias: [],
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      prefijos: [],
      listas: [],
      conceptosc: [],
      tablaruts: [],
      tablaccosto: [],
      cuentasContables: [],
      cuentas: [],
      cuentasica: [],
      caja_comision: false,
      disable_consec: false,
      rtefteasumida: 0,

      comprobante: {
        conc_conta: null,
        rut: null,
        ccosto: null,
        valor: null,
        iva: null,
        detalle: null,
        documento: 0,
        facturas: null,
      },

      error: {
        conc_conta: false,
        rut: false,
        ccosto: false,
        valor: false,
        iva: false,
        detalle: false,
        documento: false,
        tipoDocumento: false,
        facturas: false,
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
        dataconta: [],
        totales: {},
      },
      form: {
        fpago: 1,
        valorRetencion: 0,
        valorNeto: 0,
      },
      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
      },
      dialogoconcepto: {
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
      datosEmpresa: [],

      modal_anticipos: {
        estado: false,
        data: [],
      },
    };
  },
  created() {
    this.cargar_empresa();
    this.get_Clientes();
    this.cargarTablaAg();
    this.get_fecha();
    this.cargarTablaconceptos();
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

        $this.form.valorNeto = $this.tablaDetalle.totales.total;
        setTimeout(() => {
          $this.calcular_neto();
        }, 500);
      },
      { deep: true }
    );
  },
  watch: {},
  methods: {
    cargarcuentas: function () {
      let cuenta = this.datosEmpresa.mayorrte_empr;
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data:
            sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|" + cuenta + "|",
          method: "",
        })
        .then((data) => {
          this.cuentas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },
    cargarcuentaica: function () {
      let cuenta = this.datosEmpresa.ctarteicapas_empr.substr(0, 4);
      if (cuenta > 0) {
        post
          .postData({
            url: "Financiero/dlls/CfCuentasJ.DLL",
            data:
              sessionStorage.Sesion +
              "|" +
              "2" +
              "|" +
              "4" +
              "|" +
              cuenta +
              "|",
            method: "",
          })
          .then((data) => {
            this.cuentasica = data;
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar cuentas",
              estado: true,
            });
          });
      }
    },
    seleccionar_anticipo(item) {
      let valor = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;
      this.form.valorAnticipos = valor.toString();
      let docanticipo = item.documento_prov.trim();
      this.form.docAnticipo = docanticipo;
      this.modal_anticipos.estado = false;
      this.modal_anticipos.data = [];

      setTimeout(() => {
        this.calcular_neto();
      }, 500);
    },
    consultar_anticipo() {
      var $this = this;
      this.load.consecutivo = true;
      var fecha = this.form.fecha.replace(/\-/g, "");
      var rut = this.form.clientes.identificacion_rut;
      var cuenta = this.empresa[0].ctaantic_empr.trim();
      post
        .postData({
          url: "financiero/dlls/PrAnticiposJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            rut +
            "|" +
            fecha +
            "|" +
            cuenta +
            "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.load.consecutivo = false;
          this.modal_anticipos.data = data;
          this.modal_anticipos.estado = true;
        })
        .catch((err) => {
          this.load.consecutivo = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar Anticipos: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    cargarTablaconceptos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfconceptosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.conceptosc = data;
          this.conceptosc.push({
            codigo_conc: "9999",
            descrip_conc: "No Contabilizar",
          });
        })
        .catch((err) => {
          this.send_error("Error al cargar conceptos");
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
    get_resolucion() {
      var $this = this;
      this.load.consecutivo = true;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data:
            sessionStorage.Sesion + "|" + prefijo + "|" + "1" + "|" + "1" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.load.consecutivo = false;
          this.prefijos = data;
        })
        .catch((err) => {
          this.load.consecutivo = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar Resolución: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },
    calcular_neto() {
      let total = parseFloat(this.tablaDetalle.totales.total) || 0;
      let reteFuente = parseFloat(this.form.valorRetencion) || 0;
      let reteIca = parseFloat(this.form.valorRteica) || 0;
      let anticipos = this.form.valorAnticipos
        ? parseFloat(this.form.valorAnticipos.replace(/\,/g, ""))
        : 0;
      let otrosdctos = parseFloat(this.form.otrosDctos) || 0;
      let neto = 0;
      if (this.form.asumida) {
        neto = parseFloat(total - reteIca - anticipos - otrosdctos).toFixed(0);
        this.rtefteasumida = 1;
      } else {
        neto = parseFloat(
          total - reteFuente - reteIca - anticipos - otrosdctos
        ).toFixed(0);
        this.rtefteasumida = 0;
      }

      this.form.valorNeto = neto;
    },
    calcular_retefuente() {
      this.form.porcRetencion = this.form.ctaret.porc_puc;

      let total = parseFloat(this.tablaDetalle?.totales?.total) || 0;
      let porc_retefuente = parseFloat(this.form.porcRetencion);
      let porcentaje = parseFloat(porc_retefuente / 100);
      let retefuente = parseFloat(total * porcentaje).toFixed(0);

      this.$set(this.form, "valorRetencion", retefuente);
      setTimeout(() => {
        this.calcular_neto();
      }, 1000);
    },
    calcular_reteica() {
      this.form.porcRteica = this.form.ctaretica.porc_puc;

      let total = this.tablaDetalle.totales.total;
      let porc_reteIca = parseFloat(this.form.porcRteica);
      let porcentaje = porc_reteIca / 100;
      let reteIca = total * porcentaje;
      this.form.valorRteica = reteIca.toFixed(0);
      this.calcular_neto();
    },
    grabar_documento() {
      var data = this.form;

      this.dataconta = JSON.parse(JSON.stringify(this.form));
      let total = parseFloat(this.tablaDetalle?.totales?.total) || 0;
      this.dataconta.total = total;

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
            var prefijo = data.pref_fact.prefijo_resd;
            var consecutivo = data.consecutivo.trim();
            var fecha = data.fecha.replace(/\-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var formaPago = data.fpago;
            var diasPlazo = formaPago != "2" ? "0" : data.plazo;
            var porcRetencion = data.porcRetencion || "0";
            var porcRteica = data.porcRteica || "0";
            var comision = data.valorComision
              ? data.valorComision.replace(/\,/g, "")
              : "0";

            var anticipo = data.valorAnticipos
              ? data.valorAnticipos.replace(/\,/g, "")
              : "0";
            var dctos = data.otrosDctos
              ? data.otrosDctos.replace(/\,/g, "")
              : "0";
            var metodoPago = data.mpago ? data.mpago : "1";
            var ctaret = data.ctaret ? data.ctaret.cod_puc : "0";
            var ctaretica = data.ctaretica ? data.ctaretica.cod_puc : "0";

            var observaciones = data.observaciones || "";
            let rtefteasumida = this.rtefteasumida;

            var datosEnvio =
              sesion +
              "|" +
              puntoFact +
              "|" +
              prefijo +
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
              porcRteica +
              "|" +
              porcRetencion +
              "|" +
              anticipo +
              "|" +
              dctos +
              "|" +
              comision +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|" +
              plano +
              "|" +
              ctaret +
              "|" +
              ctaretica +
              "|" +
              rtefteasumida +
              "|";
            post
              .postData({
                url: "Financiero/dlls/PrDocsoporte01.dll",
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
                this.dialogoconcepto.estado = true;
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
    grabar_contabilidad() {
      this.dialogoconcepto.estado = false;
      const _this = this;
      var data = this.dataconta;
      var concepto = this.comprobante.conc_conta.codigo_conc;

      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona una Agencia");
      } else if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Selecciona un Proveedor");
      } else if (concepto == "9999") {
        console.log("concepto");
      } else this.disabled.btn_enviar = true;
      this.load.btn_enviar = true;
      let total = data.total;
      var sesion = sessionStorage.Sesion;
      var puntoFact = data.punto_fact.codigo_agc;
      var consecutivo = this.print.comprobante.trim();
      var fecha = data.fecha.replace(/\-/g, "");
      var cliente = data.clientes.identificacion_rut;
      var ccosto = this.comprobante.ccosto.llavecentro_cost;

      var docanticipo = data.docAnticipo ? data.docAnticipo.trim() : "0";
      var rtefte = data.valorRetencion || "0";
      var rteica = data.valorRteica || "0";
      var descto = data.otrosDctos || "0";
      var ctaret = data.ctaret ? data.ctaret.cod_puc : "0";
      var ctaretica = data.ctaretica ? data.ctaretica.cod_puc : "0";
      let rtefteasumida = this.rtefteasumida;

      var comision = this.comprobante.valorComision
        ? this.comprobante.valorComision.replace(/\,/g, "")
        : "0";
      var anticipo = data.valorAnticipos
        ? data.valorAnticipos.replace(/\,/g, "")
        : "0";
      var detallecont = this.comprobante.detalle || "";

      // this.dataconta = [];
      var datosEnvio =
        sesion +
        "|" +
        fecha +
        "|" +
        puntoFact +
        "|" +
        consecutivo +
        "|" +
        concepto +
        "|" +
        cliente +
        "|" +
        ccosto +
        "|" +
        total +
        "|" +
        rtefte +
        "|" +
        rteica +
        "|" +
        anticipo +
        "|" +
        descto +
        "|" +
        comision +
        "|" +
        docanticipo +
        "|" +
        detallecont.replace(/\"/g, "pg") +
        "|" +
        ctaret +
        "|" +
        ctaretica +
        "|" +
        rtefteasumida +
        "|";
      post
        .postData({
          url: "Financiero/dlls/PrContDocsoporte.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          _this.load.btn_enviar = false;
          _this.disabled.btn_enviar = false;
          _this.disabled.imprimir_factura = false;
          _this.print.comprobante = data[0];
          _this.reset_formulario();

          _this.$emit("snack", {
            color: "success",
            text: "Documento Contabilizado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          console.error(err);
          _this.disabled.btn_enviar = false;
          _this.load.btn_enviar = false;
          // this.send_error(err);
          _this.send_error("Error al contabilizar Documento");
        });
    },
    reset_formulario() {
      this.clear_form();
      this.form.clientes = null;
      this.tablaDetalle.data = [];
      this.form.fpago = 1;
      this.form.plazo = null;
      this.form.mpago = null;
      this.form.observaciones = null;
      this.productos = [];
      this.comprobante.valorComision = null;
      this.form.valorAnticipos = null;

      this.get_consecutivo();
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    async get_impresion() {
      this.disabled.imprimir_factura = true;
      this.load.imprimir_factura = true;
      var agencia = this.form.punto_fact.codigo_agc;
      var prefijo = this.form.pref_fact.prefijo_resd.trim();
      var consecutivo = this.print.comprobante.trim();
      var ano = this.form.fecha.replace(/-/g, "").substr(0, 4);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        ano +
        "|";
      post
        .postData({
          url: "Financiero/dlls/PrDocsoporte01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          let data_impresion = data[0];
          let empresa = this.datosEmpresa;
          await this.format_impresion(data_impresion, empresa);
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    async format_impresion(data_impresion, empresa) {
      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: parseInt(empresa.id_empr),
        direccionEmpresa: empresa.direccion_empr,
        telEmpresa: empresa.telefono_empr,
        ciudadEmpresa:
          empresa.Ciudad.trim() + "-" + empresa.Departamento.trim(),
        correoEmpresa: empresa.email_empr.trim(),
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then(async (logo) => {
        data_impresion.logo = logo;
        await doc_soporte(data_impresion).then(async (el) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.log("Impresión terminada");
        });
      });
    },
    async send_dian() {
      this.disabled.imprimir_factura = true;
      this.load.imprimir_factura = true;
      var agencia = this.form.punto_fact.codigo_agc;
      var prefijo = this.form.pref_fact.prefijo_resd.trim();
      var consecutivo = this.print.comprobante.trim();
      var ano = this.form.fecha.replace(/-/g, "").substr(0, 4);

      var key = agencia + "|" + prefijo + "|" + consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + ano + "|";
      let urlconsulta = "Financiero/dlls/PrDocTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });

        const json = JSON.stringify(data[0]);
        var formData = new FormData();
        formData.append("factura", json);
        const response = await fetch(
          "https://server1ts.net/financiero/inc/dspelect.titan.php",
          {
            method: "POST",
            body: formData,
          }
        ).then((res) => res.json());
        // this.get_impresion();
        console.log("impresion");

        this.disabled.imprimir_factura = false;
        this.load.imprimir_factura = false;
      } catch (error) {
        this.disabled.imprimir_factura = false;
        this.load.imprimir_factura = false;
        console.error(error);
        this.send_error(error);
      }
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
            cantidad: cantidad.toFixed(2) + ".",
            valor: valor.toFixed(2) + ".",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "Docsoporte");
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
        this.articulo_select.cantidad = 1;
        this.dialogo.estado = true;
        this.dialogo.tipo = true;
      } else {
        this.send_error("Debes seleccionar un Proveedor");
      }
    },
    agregar_servicio() {
      let tot_det = this.articulo_select.producto.length;

      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 90) {
        this.send_error("La observación no puede exceder 90 carácteres");
      } else if (tot_det > 290) {
        this.send_error(
          "Excede el máximo de Caracteres permitidos por la Dian"
        );
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
        this.form.observaciones = this.articulo_select.producto;
        this.comprobante.detalle = this.articulo_select.producto;
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
          this.datosEmpresa = data[0];
          this.caja_comision = false;
          let idempresa = parseInt(this.empresa[0].id_empr);
          if (idempresa == 901463277) {
            this.caja_comision = true;
          }
          if (idempresa == 800237815) {
            this.disable_consec = true;
          }

          this.cargarcuentas();
          this.cargarcuentaica();
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
      var prefijo = this.form.pref_fact.prefijo_resd;

      post
        .postData({
          url: "financiero/dlls/PrDspCJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.punto_fact.codigo_agc +
            "|" +
            fecha +
            "|" +
            prefijo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = data[0].Consc;
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
    format_conceptos: function (val) {
      return `${val.codigo_conc} - ${val.descrip_conc}`;
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
      this.form.valorRteica = 0;
      this.form.valorRetencion = 0;
      this.form.porcRetencion = 0;
      this.form.valorNeto = 0;
      this.form.ctaret = 0;
    },

    format_cuentas(val) {
      return `${val.descrip_puc}`;
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
    async grabarCufe(cufe) {
      let urlconsulta = "Financiero/dlls/PrCuds.dll";
      var datosEnvio = sessionStorage.Sesion + "|" + cufe + "|";

      const data = await post.postData({
        url: urlconsulta,
        data: datosEnvio,
        method: "",
      });
    },
  },
};
</script>




