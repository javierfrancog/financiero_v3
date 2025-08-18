<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generación de Factura</v-list-item-title
              >
            </v-list-item-content>
            <v-card-actions>
              <v-col class="d-flex" cols="3">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="get_Clientes()"
                  depressed
                >
                  <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
                </v-btn>
              </v-col>

              <v-spacer></v-spacer>
            </v-card-actions>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  clearable
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_resolucion();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="descrip_rep"
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
              <v-col class="d-flex" cols="2">
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
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Fecha"
                  outlined
                  disabled
                  v-model="form.fecha"
                  hide-details
                ></v-text-field>
              </v-col>
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
                    set_diasPlazo();
                    validar_cliente();
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
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
                <template v-slot:item.descripcion_cups="{ item }">{{
                  item.producto.descripcion_cups ||
                  item.producto.descripcion_cups
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
                  <td colspan="3" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <!-- <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.sub_total || 0) }}
                  </td> -->
                  <td class="text-xs-right text-center">
                    <strong>{{
                      formatNumero(tablaDetalle.totales.total_iva || 0)
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
                >Cierre de Factura</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2" v-if="form.fpago == 2">
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

              <v-col cols="3">
                <v-select
                  :items="[
                    { text: 'Efectivo', value: 10 },
                    { text: 'Consignación', value: 42 },
                    { text: 'Transferencia', value: 30 },
                    { text: 'Tarjeta Débito', value: 49 },
                    { text: 'Tarjeta Crédito', value: 48 },
                    { text: 'Bono', value: 71 },
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
                  counter="500"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-center col-12">
            <v-col class="pa-0 px-0 mr-4" sm="2">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                :disabled="disabled.grabar_factura"
                depressed
                @click="grabar_factura"
                >Grabar Factura</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0 mr-9" sm="2">
              <v-btn
                color="indigo"
                class="white--text form-control"
                large
                depressed
                ref="printprefactura"
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="imprimir_factura"
                >Imprimir Pre_Factura</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0 mr-4" sm="2">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                @click="get_enviardian"
                >Enviar Dian</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0 mr-4" sm="2">
              <v-btn
                color="red darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                @click="imprimir_factura"
                >PDF Factura</v-btn
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
          <v-row sm="12" v-if="empresa.barras_empr == '1'"> </v-row>
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
            <v-col cols="6" class="d-flex align-items-center justify-end">
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="refrescar()"
                depressed
              >
                <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row v-if="!input_articulo">
              <v-col>
                <v-autocomplete
                  label="Seleccione el Servicio"
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
                >
                </v-autocomplete>
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
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="articulo_select.total"
                  @change="input_mask('total', calcularSubtotal)"
                  ref="input_total"
                  suffix="$"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="12">
                <v-text-field
                  label="Observacion"
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
          <v-row sm="12" v-if="empresa.barras_empr == '1'"> </v-row>
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

    <v-dialog v-model="dialogo.pago" max-width="600" persistent>
      <v-card :loading="dialogo.loader" :disabled="dialogo.loader">
        <v-card-title>
          <v-list-item>
            <v-list-item-content justify="center">
              <v-list-item-title class="headline"
                >VALOR RECIBIDO</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-4 px-8">
          <v-row justify="center">
            <v-col class="text-center font-weight-bold text--white mt-6">
              Total Factura
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.pago_factura"
                disabled
                hide-details
                v-money="money"
                outlined
                height="80"
                class="inputBig"
                background-color="#FFF"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col class="text-center font-weight-bold text--white mt-6">
              Valor Recibido
            </v-col>

            <v-col cols="6">
              <v-text-field
                outlined
                hide-details
                clearable
                height="80"
                class="inputBig"
                v-money="money"
                v-model="form.pago_recibo"
                @input="calcularPago()"
                v-on:keyup.enter="foco_cerrar"
                background-color="#FFF"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="text-center font-weight-bold text--white mt-6">
              Valor Cambio
            </v-col>

            <v-col cols="6">
              <v-text-field
                ref="valorcambio"
                outlined
                hide-details
                disabled
                height="80"
                v-model="form.pago_cambio"
                class="inputBig"
                suffix="$"
                background-color="#FFF"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <v-card-actions>
          <v-row justify="center">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="orange darken-1"
                class="white--text px-6 form-control"
                large
                ref="cerrarcambio"
                depressed
                @click="cerrar_pago()"
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
import { factura_titan } from "../../_formatos_sal";
import { FlowerSpinner } from "epic-spinners";

export default {

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      dialogPicker3: false,
      agencias: [],
      maquina: [],
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
      proceso_imp: 0,
      tipo_pos: 0,
      item_mail: 0,
      proforma: 0,
      correodestino: "",
      correodestino2: "",
      correodestino3: "",
      ccosto_fact: 0,
      datos_fact: {
        consecutivo: 0,
        prefijo: null,
        fecha: null,
      },

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
            value: "descripcion_cups",
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
            text: "IVA",
            align: "center",
            value: "ivaTotal",
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
      dialogo_proforma: {
        estado: false,
        tipo: true,
        loader: false,
        pago: false,
        proforma: false,
      },

      articulo_select: {
        barras: null,
        producto: null,
        lista: null,
        ivainc: null,
        iva: 0,
        unidadmed: 0,
        impoconsumo: 0,
        ccosto: [],
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
        umedida: false,
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
        maquina: false,
        ocompra: false,
        fechaorden: false,
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
      lista_proforma: [],
      unidad_med: [
        { text: "Dia", value: 9 },
        { text: "Dias", value: 89 },
        { text: "Mes", value: 10 },
        { text: "Horas", value: 81 },
        { text: "Hora", value: 1 },
        { text: "Km", value: 12 },
        { text: "Viajes", value: 13 },
      ],
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
    this.form.fpago = 1;

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

          let subtotal =
            parseFloat(val.subtotal.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.sub_total += subtotal;
        });
      },
      { deep: true }
    );
  },
  methods: {
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
    async get_enviardian() {
      let prefijo = this.datos_fact.prefijo;
      let numero = this.datos_fact.consecutivo;
      let fecha = this.datos_fact.fecha.substring(0, 4);

      let key = prefijo + "|" + numero + "|" + fecha;
      let datosEnvio = sessionStorage.Sesion + "|" + key + "|";

      fecha = fecha.substring(0, 4);
      let urlconsulta = "Clinico/dlls/PrFactTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });
        const resultado = await this.envio_json_titan(data[0]);
        return resultado;
      } catch (err) {
        this.dialogo_rango.loader = false;
        console.log("error", err);
        this.masivo.jsonEnvio.push({ error: true });
      }
    },
    async envio_json_titan(index) {
      this.loader = true;

      let factura = index;
      let items_fact = factura.invoice_lines.length;
      if (items_fact > 1) {
        factura.invoice_lines.pop();
      }
      factura.customer.name = factura.customer.name.trim();
      var _this = this;
      let urlEnvio = "https://server1ts.net/financiero/inc/elect.titan.php";
      let observacion64 = window.atob(factura.Observaciones64.trim());
      if (observacion64) {
        factura.Observaciones64 = observacion64;
      }
      var formData = new FormData();
      formData.append("factura", JSON.stringify(factura));
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.dialogo_rango.loader = false;
          console.log("error_1");
        })
        .then(async (response) => {
          this.card.loader = false;
          this.card.disabled = false;
          let valido = false;
          let mensaje = "";
          let cufe = response.cufe;

          let item_envio = {
            prefijo: null,
            consecutivo: null,
            fecha: null,
          };
          if (response.success) {
            if (response.success == false) {
              mensaje = response.message;
              if (
                mensaje ===
                "Este documento ya fue enviado anteriormente, se registra en la base de datos."
              ) {
                cufe = response.cufe;
                valido = true;
              }
            } else {
              mensaje =
                response.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.ErrorMessage.string;
              if (
                mensaje ===
                "Regla: 90, Rechazo: Documento procesado anteriormente."
              ) {
                cufe =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.XmlDocumentKey;
                // cufe = response.cufe;
                valido = true;
              } else {
                console.log("Respuesta:", response);

                mensaje =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.StatusDescription;
                console.log("2222", mensaje);

                if (mensaje === "Procesado Correctamente.") {
                  cufe = response.cufe;
                  valido = true;
                }
              }
            }
          } else {
            let respuesta_dian = response.message;
            if (
              respuesta_dian ==
              "Este documento ya fue enviado anteriormente, se registra en la base de datos."
            ) {
              cufe = response.cufe;
              cufe = response.cufe;
              valido = true;
            } else {
              mensaje =
                response.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.ErrorMessage.string;
              if (
                mensaje ===
                "Regla: 90, Rechazo: Documento procesado anteriormente."
              ) {
                cufe =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.XmlDocumentKey;
                valido = true;
              } else {
                cufe = response.cufe;
                valido = true;
              }
            }
          }
          this.loader = false;
          console.log("333", valido);
          if (valido === true) {
            item_envio.prefijo = factura.prefix;
            item_envio.consecutivo = factura.number;
            item_envio.fecha = factura.date.substring(0, 4);
            await _this.grabar_cufe(item_envio, cufe, 1);
            await _this.send_mail(item_envio, cufe, 1);
          }
        });
    },
    async grabar_cufe(item, cufe, tipo) {
      var prefijo = item.prefijo;
      var consecutivo = item.consecutivo;
      var fecha = item.fecha;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClPrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.item_envio = item;
          this.$emit("snack", {
            color: "success",
            text: "Factura enviada a la Dian ",
            estado: true,
          });
          this.$emit("snack", {
            color: "success",
            text: "Cufe Grabado",
            estado: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.dialogo_rango.loader = false;
          this.send_error("Ha ocurrido un error grabando el CUFE del Tiquete.");
        });
    },
    async send_mail(item_envio, tipo) {
      if (tipo == 1) {
        this.loader = true;
        this.dialogocorreo.estado = false;
        item_envio = {
          prefijo: item_envio.pref.trim(),
          consecutivo: parseFloat(item_envio.numero),
          fecha: item_envio.fecha_Factura.substring(0, 4),
        };
      }
      const $this = this;
      const blob = await this.print_item(item_envio, true);
      const pdfBase64 = await this.blobToBase64(blob);
      let pdfb64 = pdfBase64.split(",")[1];
      let urlEnvio = null;
      var prefijo = item_envio.prefijo.trim();

      let numero = parseFloat(item_envio.consecutivo);
      let correo = this.form.correo
        ? this.form.correo.trim()
        : this.correodestino.trim();
      let correo2 = this.form.correo2
        ? this.form.correo2.trim()
        : "facturae@titansoluciones.net";
      let correo3 = this.form.correo3
        ? this.form.correo3.trim()
        : "facturae@titansoluciones.net";

      let token = this.empresa.tokentitan_empr;

      this.correo.unshift({
        prefix: prefijo,
        number: "" + numero + "",
        showacceptrejectbuttons: false,
        email_cc_list: [
          {
            email: correo,
          },
          {
            email: correo2,
          },
          {
            email: correo3,
          },
        ],
        base64graphicrepresentation: pdfb64,
      });

      urlEnvio = "https://server1ts.net/financiero/inc/email_fact.php";

      var formData = new FormData();
      formData.append("token", token);
      formData.append("correo", JSON.stringify(this.correo[0]));
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          this.loader = false;
          this.$emit("snack", {
            color: "orange",
            text: "Correo Envíado con éxito",
            estado: true,
          });
        })
        .catch((error) => {
          this.dialogo_rango.loader = false;
          $this.send_error(error);
        })
        .then((data) => {
          this.loader = false;
        });
    },
    validar_cliente() {
      this.form.fpago = 1;
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
      let sesion = sessionStorage.Sesion;
      var detalle = this.tablaDetalle.data;
      let puntoFact = data.punto_fact.codigo_agc;
      let prefijo = data.pref_fact.prefijo_resd;
      let consecutivo = data.consecutivo;
      let fecha = data.fecha.replace(/\-/g, "");
      let cliente = data.clientes.identificacion_rut;
      // let formaPago = data.fpago;
      let formaPago = 1;
      let diasPlazo = formaPago != 2 ? "0" : data.plazo;
      let metodoPago = data.mpago || "0";
      this.form.pago_factura = this.tablaDetalle.totales.total;
      let observaciones64 = data.observaciones
        ? window.btoa(data.observaciones)
        : "";
      let observaciones = observaciones64 || "";

      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de facturación");
      } else if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Selecciona un prefijo de facturación");
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
      } else if (observaciones && observaciones.length > 500) {
        this.send_error(
          "La observación excede la cantidad de caracteres permitidos"
        );
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        let datosEnvio =
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
          observaciones.replace(/\"/g, "pg") +
          "|";

        var detalle_new = JSON.parse(JSON.stringify(this.tablaDetalle.data));
        this.format_envio(datosEnvio, detalle_new);
      }
    },
    format_envio(importarhtml, data) {
      let tablaEnvio = {};
      let indextab = 0;
      data.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let codigo = item.producto.identificacion_cups.trim();
        let cantidad = item.cantidad.replace(/\,/g, "");
        let unitario = item.valor.replace(/\,/g, "");
        indextab = format_index;

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${codigo}|${cantidad}|${unitario}|`;
      });

      importarhtml = importarhtml + indextab + "|";

      let datos = {
        url: "Clinico/dlls/PrFact01.dll",
        data: { importarhtml, ...tablaEnvio },
        method: "",
        json: true,
      };
      post
        .postData(datos)
        .then((data) => {
          this.datos_fact.consecutivo = data[0];
          this.datos_fact.prefijo = this.form.pref_fact.prefijo_resd;
          this.datos_fact.fecha = this.form.fecha.replace(/\-/g, "");
          this.disabled.grabar_factura = true;
          this.disabled.imprimir_factura = false;
          this.reset_formulario();
          this.get_consecutivo();
        })
        .catch((error) => {
          console.log(error);
          this.send_error("Error al grabar factura");
        });
    },
    reset_formulario() {
      this.form.clientes = null;
      this.tablaDetalle.data = [];
      this.form.fpago = 2;
      this.form.plazo = null;
      this.form.mpago = null;
      this.clear_form();
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
          url: "Ptovta/dlls/PrFact01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          let descripcion = "";

          this.format_impresion(data[0]);
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.send_error("Error al imprimir el documento");
        });
    },

    imprimir_factura() {
      let prefijo = this.datos_fact.prefijo;
      let numero = this.datos_fact.consecutivo;
      let fecha = this.datos_fact.fecha;
      post
        .postData({
          url: "Clinico/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|" +
            numero +
            "|" +
            fecha.substring(0, 4) +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          data = data[0];
          this.generar_pdf_2(data);
        })
        .catch((err) => {
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
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

      if (data.formato_fact === "02") {
        if (getBase64) return await factura_gyro(data, getBase64);
        else factura_gyro(data);
      } else {
        if (getBase64) return await factura_titan(data, getBase64);
        else factura_titan(data);
      }

      // if (getBase64) return await factura_titan(data, getBase64);
      // else factura_titan(data);
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
          // this.empresa.ccostofact_empr = 1

          // console.log("cierre", this.proforma)
          // if (this.empresa.ccostofact_empr == '1' && this.proforma == 1){
          //   let nvo_ccosto = el.ccosto
          //   el.ccosto.push({
          //     llavecentro_cost: nvo_ccosto
          //   })
          // }
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
            ubicacion: el.ubicacion.codigo_ubic || "0001",
            codigo,
            cantidad: cantidad.toFixed(2),
            valor: el.subtotal.toFixed(2),
            descuento: valorDescuento.toFixed(2),
            iva: ivaTotal.toFixed(2),
            observacion: el.observacion || "",
            origen: el.ciudadorig?.codigo_rep || "",
            destino: el.ciudaddest?.codigo_rep || "",
            placas: el.placas || "",
            remision: nro_remision || "",
            ccosto: el.ccosto ? el.ccosto.llavecentro_cost : "0000",
            impoconsumo: el.impoconsumo ? el.impoconsumo.toFixed(2) : 0,
            presentacion,
            prefremis: prefremision || "",
            agcremision: agenremision || "",
            unidadmed: el.unidadmed || "0",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrFact01");
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

          // //          var subtotal = base + incremento + valorPorcentaje;
          //           unitario = unitario / iva
          //           console.log(unitario)

          //           var valorDescuento = unitario * (descuento / 100);
          //           var total = (unitario - valorDescuento) * item.valorIva;

          //           var valorIva = total - (unitario - valorDescuento);

          //           // item.subtotal = unitario ;
          //           item.valorDescuento = valorDescuento;
          //           item.ivaTotal = valorIva.toFixed(2);
          //           item.total = this.formatNumero(total * item.cantidad);
          //           // item.valor = this.formatNumero(subtotal * iva);
          //           // item.subtotal = unitario * item.cantidad;
          //           console.log(detalle)
        }
      });

      this.tablaDetalle.data = [];
      this.tablaDetalle.data = detalle;
    },
    abrir_popup() {
      // this.articulo_select.ivainc = false;
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
        this.send_error("Debe seleccionar un cliente");
      }

      if (!this.form.fpago) {
        this.dialogo.estado = false;
        this.dialogo.tipo = false;
        this.disabled.grabar_factura = true;

        this.send_error("Debe seleccionar una Forma de Pago");
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
      }
      if (
        articulo.ccosto.llavecentro_cost == "0000" &&
        this.empresa.ccostofact_empr == "1"
      ) {
        this.errores.ccosto = true;
        this.send_error("Debe Seleccionar un Centro de Costo");
      } else if (!articulo.umedida && this.empresa.ccostofact_empr == "1") {
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
        this.articulo_select.unidadmed = articulo.umedida
          ? articulo.umedida
          : "0";
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
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.articulo_select, index, val_edit);
      if (callback) callback();
    },
    calcularSubtotal() {
      var item = this.articulo_select;
      let cantidad = parseFloat(item.cantidad) || 0;
      let vlr_unitario =
        parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
      var iva = 0;
      this.articulo_select.total = cantidad * vlr_unitario;
    },
    cargar_servicios() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfServProcJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.productos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cups",
            estado: true,
          });
        });
    },

    refrescar() {
      this.get_Clientes();
      this.cargar_servicios();
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_productos(val) {
      return `${val.descripcion_cups.trim()}`;
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
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
          let cliente = "000222222222222";
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
          this.form.clientes = null;
          this.empresa = data[0];
          let forma_pago = parseInt(this.empresa.fpagocont_empr) || 2;
          this.form.fpago = forma_pago;
          this.cargar_servicios();
          this.carguepresentacion = 0;
          this.form.observaciones = this.empresa.observacion_empr.trim();
        })

        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    get_resolucion() {
      var $this = this;
      this.load.consecutivo = true;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + prefijo + "|" + "4" + "|",
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
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    get_consecutivo() {
      var $this = this;
      this.load.consecutivo = true;
      var fecha = this.form.fecha.replace(/-/g, "");
      var prefijo = $this.form.pref_fact.prefijo_resd;
      this.tipo_pos = "";

      if (this.form.pref_fact.poselect_resd == "1") {
        this.tipo_pos = 1;
      } else {
        this.form.maquinapos = null;
        this.tipo_pos = 0;
      }
      post
        .postData({
          url: "Clinico/dlls/PrFacturaN.dll",
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
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    get_dian() {
      var id_factura = this.cufedian;
      var $this = this;

      var urlEnvio = null;
      let itemprint = "";
      if (this.empresa.provfact_empr == "5") {
        this.print_item(itemprint);
      } else {
        if (this.empresa.felectronica_empr == "0")
          urlEnvio = "https://server1ts.net/facturae/consulta_pdf.php";
        else urlEnvio = "https://server1ts.net/facturae/consulta_pdf.prod.php";

        var formData = new FormData();
        formData.append("key_factura", id_factura);
        fetch(urlEnvio, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
        this.loader = false;
        this.card.disabled = false

          .catch((error) => {
            this.loader = false;
            this.card.disabled = false;
            $this.send_error(error);
          })
          .then((data) => {
            this.loader = false;
            this.card.disabled = false;

            var response = JSON.parse(data.res);
            if (response.Respuesta) {
              const linkSource = `data:application/pdf;base64,${response.PdfBase64}`;
              const downloadLink = document.createElement("a");
              const fileName = id_factura + ".pdf";
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            } else {
              $this.send_error("Error: " + response.MensajeRespuesta);
            }
          });
      }
    },
    foco_cerrar() {
      this.$refs.cerrarcambio.$el.focus();
    },
    cerrar_pago() {
      this.dialogo.pago = false;
      this.$refs.printprefactura.$el.focus();
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