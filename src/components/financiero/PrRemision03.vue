<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cash-100</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Remisión de Mercancías para Facturar</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Entrega"
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
              <!-- <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Prefijo"
                  outlined
                  v-model="form.prefijo"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col> -->
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Fecha"
                  outlined
                  v-model="form.fecha"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
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
              <v-col class="d-flex" cols="10" sm="4" v-if="empresa.molino_empr">
                <v-autocomplete
                  label="Placa"
                  v-model="form.placa"
                  :items="vehiculos"
                  item-text="placa_rep"
                  item-value="placa_rep"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="validar_placa()"
                  :error="errores.placa"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Cliente"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  hide-details
                  return-object
                  outlined
                  @change="
                    errores.clientes = false;
                    validar_cliente();
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
            </v-row>
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

                <template v-slot:item.present_producto="{ item }">{{
                  item.producto.present_pr
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
                  <td colspan="6" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.sub_total || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
                <!-- <template v-slot:item.present_producto="{ item }">{{
                  item.producto.present_pr
                }}</template> -->
              </v-data-table>
            </div>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Remisión</v-card-subtitle
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
                    { text: 'Efectivo', value: 10 },
                    { text: 'Tarjeta Débito', value: 49 },
                    { text: 'Tarjeta Crédito', value: 48 },
                    { text: 'Transferencia', value: 30 },
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
              <!-- <v-col sm="3" cols="12">
                <v-select
                  :items="[
                    { text: 'Pesos Colombianos', value: 1 },
                    { text: 'Dólar Americano', value: 2 },
                  ]"
                  label="Moneda"
                  outlined
                  clearable
                  hide-details
                  v-model="form.moneda"
                ></v-select>
              </v-col> -->
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
            <v-col class="pa-0 px-0 d-flex align-center justify-center">
              <v-btn
                color="green darken-1"
                class="white--text mr-2"
                large
                depressed
                @click="dato_pago"
                >Grabar Remisión</v-btn
              >
              <v-btn
                color="blue darken-1"
                class="white--text mr-2"
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Imprimir Remisión</v-btn
              >
              <v-btn
                color="orange darken-1"
                class="white--text"
                large
                depressed
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Enviar Remisión
                <v-icon dark right> mdi-mail </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.pago" max-width="600" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
        color="#6D99E1"
        :style="{
          border: '2px solid #FFF',
        }"
      >
        <div class="pa-4 px-8">
          <v-row>
            <v-col>
              <div
                :style="{
                  background:
                    'url(https://titansoluciones.cloud/img/cambio.png)',
                  height: '100%',
                  width: '100%',
                  'background-repeat': 'no-repeat',
                  'background-size': '100% auto',
                  'background-position': 'center',
                }"
              ></div>
            </v-col>
            <v-col>
              <v-row justify="center">
                <v-col cols="12" class="text-left font-weight-bold">
                  Total Factura
                </v-col>
                <v-col cols="12">
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
                <v-col cols="12" class="text-left font-weight-bold">
                  Valor Recibido
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    outlined
                    hide-details
                    clearable
                    height="80"
                    class="inputBig"
                    v-money="money"
                    suffix="$"
                    v-model="form.pago_recibo"
                    @input="calcularPago()"
                    v-on:keyup="dato_cerrar"
                    background-color="#FFF"
                    tabindex="1"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12" class="text-left font-weight-bold">
                  Valor Cambio
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    outlined
                    hide-details
                    disabled
                    height="80"
                    v-model="form.pago_cambio"
                    class="inputBig"
                    suffix="$"
                    background-color="#FFF"
                    tabindex="2"
                    @keydown.enter="cierre_pago()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-center">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="white darken-4 "
                class
                block
                ref="boton_cerrar"
                v-model="btn_cerrar"
                @keyup.enter.native="cierre_pago"
                @click="cierre_pago"
                tabindex="3"
                >Cerrar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado" max-width="700" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
      >
        <!-- <v-card-title>
          <v-row justify="end">
            <v-btn
              color="light-blue accent-4 white--text"
              class
              @click="get_listas2()"
              depressed
            >
              <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
            </v-btn>
          </v-row>
        </v-card-title> -->
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <!-- <v-row sm="12">
              <v-col sm="6">
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
 -->
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
                  @change="change_articulo_modal"
                ></v-autocomplete>

                <!-- <v-autocomplete
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
                  @change="change_articulo_modal"
                  :loading="load.servicios"
                  :search-input.sync="search"
                  v-if="input_articulo"
                ></v-autocomplete> -->

                <!-- <v-autocomplete
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
                ></v-autocomplete> -->
              </v-col>
            </v-row>
            <v-row sm="6" no-gutters v-if="empresa.presentprod_empr == 1">
              <v-col>
                <v-autocomplete
                  label="Presentación"
                  :items="presentacion"
                  outlined
                  clearable
                  return-object
                  required
                  item-value="codigo_rep"
                  v-model="articulo_select.presentacion"
                  :item-text="format_presentacion"
                  @input="change_articulo_modal()"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex">
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

              <v-col sm="4" v-if="!empresa.molino_empr">
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
              <v-col sm="5" v-if="!empresa.molino_empr">
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
              <v-col>
                <v-simple-table height="150" fixed-header dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left indigo--text blue lighten-5">
                          Ubicación
                        </th>
                        <th class="text-left indigo--text blue lighten-5">
                          Saldo
                        </th>
                        <th class="text-left indigo--text blue lighten-5">
                          Vlr. Minimo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in articulo_select.ubicaciones"
                        :key="item.key"
                      >
                        <td class="text-center">
                          {{ item.ubicacion_rep.trim() }}
                        </td>
                        <td class="text-center">
                          {{ item.cantsaldo_rep.trim() }}
                        </td>
                        <td class="text-center">{{ item.valor_minimo }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row sm="12" no-gutters>
              <v-col>
                <v-autocomplete
                  label="Ubicacion"
                  :items="ubica"
                  outlined
                  clearable
                  return-object
                  persistent-hint
                  required
                  disabled
                  item-value="codigo_ubic"
                  v-model="articulo_select.ubicacion"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
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
                color="indigo darken-1"
                dark
                block
                depressed
                :disabled="disabled.agregar_serv"
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
<style scoped>
.inputBig {
  font-size: 36px !important;
}
</style>


<script>

import post from "../../methods.js";
import { remision_molino } from "../../_formatos_mol.js";
export default {

  data() {
    return {
      agencias: [],
      ubica: [],
      vehiculos: [],
      clientes: [],
      empresa: [],
      productos: [],
      listas: [],
      presentacion: [],
      error: [],
      rut_predt: null,
      saldoinv: 0,
      btn_cerrar: null,

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

      form: {
        fpago: 1,
      },
      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
        pago: false,
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
        agregar_serv: false,
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
      menu: null,
    };
  },

  async created() {
    this.cargarTablaAg();
    await this.cargar_empresa();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaubica();
    this.cargarPresentacion();
    this.get_consecutivo();
    this.cargarVehiculos();

    // this.$watch("form.fpago", this.re_calcular);

    // this.get_menu()
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
    cierre_pago() {
      this.grabar_factura();
    },
    get_menu() {
      post
        .postData({
          url: "Financiero/dlls/menuJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((datos) => {
          let modulos = datos[0];
          this.menu = modulos;
        });
    },
    validar_cliente() {
      var empresa = this.empresa;
      this.input_articulo = false;
      this.get_listas();
    },
    calcularPago() {
      let vrl_fact = this.form.pago_factura.replace(/\,/g, "");
      let vlr_rec = this.form.pago_recibo.replace(/\,/g, "");
      let vlr_cambio = vlr_rec - vrl_fact;
      this.form.pago_cambio = vlr_cambio;
    },
    clear_pago() {
      this.form.pago_factura = "0";
      this.form.pago_recibo = "0";
      this.form.pago_cambio = "0";
    },

    cargarPresentacion: function () {
      post
        .postData({
          url: "PtoVta/dlls/CfunidadprJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.presentacion = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    cargarVehiculos: function () {
      post
        .postData({
          url: "Molinos/dlls/CfvehiculoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.vehiculos = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_presentacion: function (val) {
      return `${val.codigo_rep} - ${val.descripcion_rep}`;
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
    get_pdf_pos(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.telefono_empresa = this.empresa.telefono_empr;
        var format = this.pdfs.remision_pos(data, logo);
        pdfMake.createPdf(format).print();
      });
    },
    format_impresion(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.prcotizacion(data, logo);
        pdfMake.createPdf(format).print();
      });
    },
    async grabar_factura() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;

      this.disabled.btn_enviar = true;
      this.load.btn_enviar = true;

      this.get_plano(detalle)
        .then((plano) => {
          var sesion = sessionStorage.Sesion;
          var puntoFact = data.punto_fact.codigo_agc;
          var doccontaFact = data.punto_fact.docconta_agc;
          var consecutivo = data.consecutivo.trim();
          var fecha = data.fecha.replace(/\-/g, "");
          var cliente = data.clientes.identificacion_rut;
          var formaPago = data.fpago;
          var diasPlazo = formaPago != 2 ? "0" : data.plazo;
          var tipoper = data.punto_fact.tipoper_agc;
          var metodoPago = data.mpago || "0";
          var moneda = data.moneda || "0";
          var placa = data.placa ? data.placa.placa_rep : "0";
          var observaciones = data.observaciones || "";
          var datosEnvio =
            sesion +
            "|" +
            puntoFact +
            "|" +
            "REMI" +
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
            "|" +
            placa +
            "|";
          post
            .postData({
              url: "Ptovta/dlls/PrRemision03.dll",
              data: { importarhtml: datosEnvio, ...plano },
              method: "",
              json: true,
            })
            .then((data) => {
              this.load.btn_enviar = false;
              this.disabled.btn_enviar = false;
              this.disabled.imprimir_factura = false;
              this.print.comprobante = data[0];
              this.reset_formulario();
              this.$emit("snack", {
                color: "success",
                text: "Remisión guardada correctamente",
                estado: true,
              });

              this.dialogo.pago = false;
            })
            .catch((err) => {
              this.load.btn_enviar = false;
              this.disabled.btn_enviar = false;
              console.error(err);
              this.send_error("Error al grabar la Remisión");
            });
        })
        .catch((err) => {
          this.disabled.btn_enviar = false;
          this.load.btn_enviar = false;
          this.dialogo.pago = false;
          console.error(err);
          this.send_error(err);
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

      this.get_consecutivo();
    },
    impresion_molino() {
      let fecha = this.form.fecha.substr(0, 4);
      let agencia = this.form.punto_fact.codigo_agc;
      let prefijo = "REMI";

      let numero = this.print.comprobante;
      let datosEnvio = sessionStorage.Sesion + "|" + numero + fecha + "|";
      post
        .postData({
          url: "Ptovta/dlls/PrRemision01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    impresion_comercial() {
      this.disabled.imprimir_factura = true;
      this.load.imprimir_factura = true;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio =
        sessionStorage.Sesion + "|" + this.print.comprobante + fecha + "|";

      var agencia = this.form.punto_fact;
      let prefijo = this.form.punto_fact.prefijo_agc;
      post
        .postData({
          url: "Ptovta/dlls/PrRemision01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let data_impresion = data[0];
          let nombre64 = " ";
          let detalles = data_impresion.productos.map((item) => {
            nombre64 = window.atob(
              item.base1_pr.trim() +
                item.base2_pr.trim() +
                item.base3_pr.trim() +
                item.base4_pr.trim() +
                item.base5_pr.trim()
            );
            if (nombre64) {
              item.nombre_servicio = nombre64;
            }
            return item;
          });

          data_impresion.productos = detalles;

          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          if (this.empresa.posremis_empr == 1) {
            this.get_pdf_pos(data_impresion);
          } else {
            this.format_impresion(data_impresion);
          }
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    get_impresion() {
      if (this.empresa.molino_empr) {
        this.impresion_molino();
      } else {
        this.impresion_comercial();
      }
    },
    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = _this.empresa[0];
        var nuevo = {};
        detalle.forEach((el, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          var cantidad = parseFloat(el.cantidad);
          var valorst = el.subtotal * 1;
          var valor = valorst / (1 + parseFloat(el.iva) / 100);
          var valorDescuento =
            parseFloat(el.valorDescuento.toString().replace(/\,/g, "")) || 0;
          var valorIva = valorst - valor;
          var descuento = valorDescuento * cantidad;
          var iva = valorIva;
          let ubicacion = this.empresa.ubicaperfil_empr;
          var codigo = "";
          if (el.producto.codigopr_list)
            codigo = el.producto.codigopr_list.trim();
          else if (el.producto.codigo_pr) codigo = el.producto.codigo_pr.trim();

          let presentacion = el.presentacion ? el.presentacion.codigo_rep : "0";

          nuevo[`DATOJ-${format_index}`] = `${codigo}|${cantidad.toFixed(
            2
          )}|${valor.toFixed(2)}|${descuento.toFixed(2)}|${iva.toFixed(
            2
          )}|${presentacion}|${ubicacion}|`;
        });

        resolve(nuevo);
        // var formData = new FormData();
        // formData.append("tipo", "Cotiza01");
        // formData.append("data", JSON.stringify(nuevo));

        // fetch("https://server1ts.net//financiero/inc/planos.php", {
        //   method: "POST",
        //   body: formData,
        // })
        //   .then((response) => response.json())
        //   .then((result) => {
        //     if (result.code == "0") resolve(result.mensaje);
        //     else reject(result.mensaje);
        //   })
        //   .catch((error) => reject(error));
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

        let ubicacion = this.ubica.find(
          (el) => el.codigo_ubic == this.empresa.ubicaperfil_empr
        );
        this.articulo_select.ubicacion = ubicacion;
      } else {
        this.send_error("Debes seleccionar un cliente");
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

              // if (empresa.carguepr_empr == "0") {
              //   this.articulo_select.lista = producto.descripcionpr_list.trim();
              // } else {
              //   this.articulo_select.lista = producto.descripcion_pr.trim();
              // }
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

              var valorPorcentaje = (base * porcentaje) / 100;
              var subtotal = base + incremento + valorPorcentaje;
              subtotalProducto = subtotal;
              valorProducto = subtotal * iva;
              this.articulo_select.valorIva = iva;
              this.articulo_select.factorImpoc = impoconsumo;

              this.articulo_select.subtotal = subtotalProducto;
              this.articulo_select.valor = subtotal;
              this.articulo_select.cantidad = 1;
              this.calcularSubtotal();
            } else {
              this.clear_form();
            }
          })
          .catch((err) => {
            console.log("err", err);
            this.clear_form();
          });
      } else {
        this.clear_form();
      }
    },
    calcularSubtotal() {
      var item = this.articulo_select;

      this.error.precio = 0;
      let conversion = 1;

      if (this.articulo_select.presentacion) {
        conversion = this.articulo_select.presentacion.cantidad_rep.replace(
          /\,/g,
          ""
        );
      }
      item.ubicacion = this.empresa.ubicaperfil_empr;

      if (!item.ubicacion) {
        setTimeout(() => {
          // this.articulo_select.cantidad = 0;
          // this.articulo_select.valor = 0;
        }, 500);
        this.send_error("Selecciona una ubicacion");
      } else if (
        (parseInt(item.valor) < parseInt(item.vlrmin)) &
        (this.empresa.ctrvta_empr === "1")
      ) {
        this.error.precio = 0;
      } else {
        var saldo_array = item.ubicaciones.find(
          (el) => el.codubica_rep.trim() == item.ubicacion.codigo_ubic
        );

        var cantidad = parseFloat(item.cantidad) || 0;
        if (this.empresa.ctrsdoinv_empr == 0) {
          this.saldoinv = cantidad;
        }
        if (cantidad > this.saldoinv) {
          setTimeout(() => {
            this.articulo_select.cantidad = 0;
          }, 200);
          this.send_error("La cantidad supera el valor del saldo");
          // this.disabled.agregar_serv = true;
        } else {
          var valorFormat =
            parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
          // this.articulo_select.valor = this.formatNumero(valorFormat);

          var descuento =
            parseFloat(item.valorDescuento.toString().replace(/\,/g, "")) || 0;
          var valorDescuento = descuento;

          var iva = parseInt(item.iva) / 100 + 1;

          let baseiva = (valorFormat - descuento) * cantidad;
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
            this.formatNumero(valorDescuento);
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
    get_listas() {
      let ciudad = this.empresa.codciudad_empr;
      let id = this.empresa.id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/listaprecios.json";
      this.tablaDetalle.data = [];
      if (this.form.clientes) {
        post
          .postData({
            url: ruta,
            data: "",
            method: "GET",
          })
          .then((data) => {
            var data_parse = data.Lista;

            data_parse.pop();
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

    leer_producto() {
      return new Promise((resolve, reject) => {
        // console.log(this.articulo_select.presentacion)
        var empresa = this.empresa[0];
        var barra = this.articulo_select.barras || "";
        var producto = this.articulo_select.producto;
        let ubicacion = this.empresa.ubicaperfil_empr;
        let presentacion = this.articulo_select.presentacion
          ? this.articulo_select.presentacion.codigo_rep
          : "0";
        var codigo = null;
        if (producto) {
          if (producto.codigopr_list) codigo = producto.codigopr_list.trim();
          else if (producto.codigo_pr) codigo = producto.codigo_pr.trim();
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
              "|" +
              presentacion +
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
              this.saldoinv = parseFloat(
                articulo.ubicaciones_rep[0].cantsaldo_rep
              );
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
    format_productos(val) {
      return `${val.codigopr_list} - ${
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
          let rut_predt = this.empresa.clientepred_empr;
          let busqueda = this.clientes.find(
            (el) => el.identificacion_rut == rut_predt
          );
          this.form.clientes = busqueda;
          this.validar_cliente();
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
      return new Promise((resolve) => {
        post
          .postData({
            url: "Financiero/dlls/CfEmpresaJ.dll",
            data: sessionStorage.Sesion + "|",
            method: "",
          })
          .then((data) => {
            this.empresa = data[0];
            let punto = this.empresa.ptoperfil_empr;
            let busqueda = this.agencias.find((el) => el.codigo_agc == punto);
            this.form.punto_fact = busqueda;
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar empresa",
              estado: true,
            });
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
            "REM" +
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
          this.form.fpago = 1;
          this.form.mpago = 1;
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
    generar_pdf(data) {
      let data_impresion = data;
      let nombre64 = " ";
      let detalles = data_impresion.productos.map((item) => {
        nombre64 = window.atob(
          item.base1_pr.trim() +
            item.base2_pr.trim() +
            item.base3_pr.trim() +
            item.base4_pr.trim() +
            item.base5_pr.trim()
        );
        if (nombre64) {
          item.nombre_servicio = nombre64;
        }
        return item;
      });

      let empresa = this.empresa;
      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: empresa.ideditado_empr,
        direccionEmpresa: empresa.direccion_empr,
        ciudadEmpresa: empresa.Ciudad + "-" + empresa.Departamento,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data_impresion.logo = logo;
        remision_molino(data_impresion).then((el) => {
          console.log("Impresion terminada");
        });
      });
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    async dato_pago() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de Cotización");
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
      } else {
        if (this.empresa.poscambio_empr == "1") {
          this.dialogo.pago = true;
        }
      }
    },
    dato_cerrar: function (e) {
      if (e.keyCode === 13) {
        this.$refs.boton_cerrar.$el.focus();
        // alert('Enter was pressed');
      }
    },
    get_key() {
      return Math.random().toString(36);
    },
  },
};
</script>
