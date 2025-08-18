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
              <v-icon size="30" color="blue darken-4 ">mdi-rotate-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualiza Factura Comercial</v-list-item-title
              >
            </v-list-item-content>
            <v-card-actions>
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="this.get_Clientes()"
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
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                    @change="cargar_facturas"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4" sm="4">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
                  hide-details
                  clearable
                  outlined
                  @change="cargar_facturas"
                  return-object
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Consecutivos"
                  clearable
                  outlined
                  type="text"
                  :items="consecutivos"
                  item-value="consecutivo"
                  :item-text="format_consecutivos"
                  v-model="form.consecutivo"
                  :loading="loader.consecutivo"
                  return-object
                  @change="consultar_factura"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Fecha Factura"
                  outlined
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
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="
                    errores.clientes = false;
                    set_diasPlazo();
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
                <template v-slot:item.descrip_producto="{ item }">{{
                  item.lista
                }}</template>

                <!-- <template v-slot:item.valor="{ item }">

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
                            ).toFixed(2)
                          )) /
                        item.cantidad
                      ).toFixed(2)
                    )
                  }}
                </template> -->

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
                          ).toFixed(2)
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
                      ).toFixed(2)
                    )
                  }}
                </template>
                <template v-slot:item.impoTotal="{ item }">
                  {{
                    formatNumero(
                      (
                        parseFloat(item.total.toString().replace(/\,/g, "")) -
                        parseFloat(item.total.toString().replace(/\,/g, "")) /
                          item.valorIva
                      ).toFixed(2)
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
                    <span>Modificar</span>
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
                  <td></td>

                  <!-- <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.sub_total || 0) }}
                  </td> -->

                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>

                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_impoc || 0) }}
                  </td>
                  <td></td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
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
                  return-object
                  hide-details
                  v-model="form.mpago"
                  :error="errores.mpago"
                  @change="errores.mpago = false"
                ></v-select>
              </v-col>
              <v-col cols="2" v-if="empresa.plazocuotas_empr == 1">
                <v-text-field
                  label="Nro Cuotas"
                  type="number"
                  counter="3"
                  outlined
                  v-model="form.nrocuotas"
                  hide-details
                  :error="errores.nrocuotas"
                  @input="errores.nrocuotas = false"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="4">
                <v-select
                  :items="tablaretefte"
                  label="% Retención/BNA"
                  outlined
                  hide-details
                  v-model="form.retencion"
                  :error="errores.retencion"
                  @change="
                    calcular_retencion();
                    errores.retencion = false;
                  "
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="2" v-if="form.retencion == 1">
                <v-text-field
                  label="Porcentaje"
                  v-model="form.porcrtefte"
                  outlined
                  hide-details
                  @input="calcular_retencion()"
                  type="text"
                >
                </v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2" v-if="form.retencion == 1">
                <v-text-field
                  label="Retención"
                  v-model="form.textimpuesto"
                  outlined
                  disabled
                  hide-details
                  type="text"
                >
                </v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3" v-if="maqpos != 0">
                <v-text-field
                  label="Maquina Pos"
                  v-model="form.maquinapos"
                  hide-details
                  clearable
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Nro O.Compra"
                  outlined
                  hide-details
                  v-model="form.ocompra"
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
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-center col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="indigo darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.grabar_factura"
                @click="grabar_factura"
                >Grabar Factura</v-btn
              >
            </v-col>
            <!-- <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Imprimir Factura</v-btn
              >
            </v-col> -->
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
          <!-- <v-row sm="12">
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
          </v-row> -->

          <v-row>
            <v-col cols="6">
              <v-switch
                v-model="articulo_select.ivainc"
                @change="calcularSubtotal"
                label="Impto Incluido en Vlr Unitario"
                disabled
                hide-details
              ></v-switch>
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
                  @change="change_articulo_modal"
                  :loading="load.servicios"
                  :search-input.sync="search"
                  v-if="input_articulo"
                ></v-autocomplete>

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

            <v-row v-if="articulo_select.ubicaciones.length > 0">
              <v-col>
                <v-simple-table height="150" fixed-header dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Ubicación</th>
                        <th class="text-left">Saldo</th>
                        <th class="text-left">Vlr. Minimo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in articulo_select.ubicaciones"
                        :key="item.key"
                      >
                        <td>{{ item.ubicacion_rep.trim() }}</td>
                        <td>{{ item.cantsaldo_rep.trim() }}</td>
                        <td class="text-right">{{ item.valor_minimo }}</td>
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
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="articulo_select.ubicacion"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="d-flex"
                cols="7"
                v-if="empresa.ccostofact_empr == '1'"
              >
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
              <v-col
                class="d-flex"
                cols="5"
                v-if="empresa.ccostofact_empr == '1'"
              >
                <v-select
                  :items="unidad_med"
                  label="Unidad Medida"
                  outlined
                  hide-details
                  v-model="articulo_select.unidadmed"
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
                  v-model="articulo_select.cantidad"
                  @input="calcularSubtotal"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col sm="6">
                <v-text-field
                  label="Vlr unitario (Iva incluido)"
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
              <!-- <v-col sm="3">
                <v-text-field
                  label="Desc."
                  type="number"
                  outlined
                  hide-details
                  suffix="%"
                  v-model="articulo_select.descuento"
                  @input="calcularSubtotal"
                ></v-text-field>
              </v-col> -->
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

export default {

  data() {
    return {
      agencias: [],
      prefijos: [],
      pedidos: [],
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      listas: [],
      tablaccosto: [],
      consecutivos: [],
      unidad_med: [
        { text: "Dia", value: 9 },
        { text: "Dias", value: 89 },
        { text: "Mes", value: 10 },
        { text: "Horas", value: 81 },
        { text: "Hora", value: 1 },
        { text: "Km", value: 12 },
      ],
      dialogPicker3: false,
      maqpos: null,
      loader: {
        consecutivo: false,
        btn_grabar: false,
        btn_imprimir: false,
        facturas: false,
      },

      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
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
            value: "descrip_producto",
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
        mpago: null,
        doc_origen: 0,
        nrocuotas: null,
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
        unidadmed: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
        factorImpoc: 0,
        impoconsumo: 0,
        ubicaciones: [],
        ccosto: [],
        observacion: null,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      tablaretefte: [
        { text: "Porcentaje", value: 1 },
        { text: "Bolsa Nacional Agropecuaria", value: 99 },
        { text: "No Aplica", value: 9 },
      ],
      disabled: {
        grabar_factura: true,
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
      },
      errores: {
        punto_fact: false,
        consecutivo: false,
        clientes: false,
        nrocuotas: false,
        plazo: false,
        mpago: false,
        umedida: false,
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
      card: {
        loader: false,
        disabled: false,
      },
      lista_pedidos: [],
      titulo_print: null,
      condicion_pdf: true,
      pref_fact: [],
    };
  },
  created() {
    this.cargar_empresa();
    this.get_resolucion();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaubica();
    this.cargarTablaccostos();
    this.$watch("form.fpago", this.re_calcular);

    let nit = parseInt(sessionStorage.Sesion.substring(0, 15));
    if (nit == 999999901) this.condicion_pdf = false;

    var $this = this;

    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_impoc = 0;
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

          // let subtotal =
          //   parseFloat(val.subtotal.toString().replace(/\,/g, "")) || 0;
          // $this.tablaDetalle.totales.sub_total += subtotal;

          // var descuento = parseFloat(
          //   val.valorDescuento.toString().replace(/\,/g, "")
          // );

          // let total_iva =
          //   parseFloat(val.ivaTotal.toString().replace(/\,/g, "")) || 0;

          // let total_impoc =
          //   parseFloat(val.impoTotal.toString().replace(/\,/g, "")) || 0;

          // let total = parseFloat(val.total.toString().replace(/\,/g, "")) || 0;

          // $this.tablaDetalle.totales.total += total.toFixed(2);
          // let iva = total - (total / val.valorIva).toFixed(2);
          // $this.tablaDetalle.totales.total_iva += iva;
          // $this.tablaDetalle.totales.sub_total += (total - iva).toFixed(2);
        });
        this.calcular_retencion();
      },
      { deep: true }
    );
  },

  methods: {
    consultar_factura() {
      // this.disabled.grabar_factura = false;

      let item = this.form.consecutivo;
      var fecha = item.fecha_fact.substr(0, 4);
      this.tablaDetalle.data = [];

      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrFact01MJ.dll",
          data: datosEnvio,
          method: "",
        })

        .then((data) => {
          this.disabled.grabar_factura = false;
          this.disabled.btn_imprimir = false;
          let res = data[0];
          this.maqpos = res.maqpos_fact;
          let descripcion64 = " ";
          descripcion64 = window.atob(res.Observaciones64);
          if (descripcion64) {
            res.observaciones = descripcion64;
          }

          let nit_cliente = res.nit_cliente.replace(/\,/g, "");
          this.form.fecha = res.fechacorta_factura;

          let busqueda_cliente = this.clientes.find(
            (el) => parseInt(el.identificacion_rut) === parseInt(nit_cliente)
          );
          if (busqueda_cliente)
            this.$set(this.form, "clientes", busqueda_cliente);

          res.productos.forEach((el) => {
            let producto = this.productos.find(
              (art) => art.codigopr_list.trim() == el.codigo
            );

            let nombre_servicio = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            );

            let iva = parseInt(el.iva) || 0;
            let ccosto = el.ccostoprod;
            let umedida = el.codumedida;
            let impoc = parseInt(el.porcimpoc) || 0;
            // let iva = 19;
            let total_pr = parseFloat(el.tot_producto.replace(/\,/g, "")) || 0;
            let descto_pr = parseFloat(el.vlr_dcto.replace(/\,/g, "")) || 0;
            total_pr = total_pr - descto_pr;

            // let vlr_unitario = parseFloat(el.vlr_unit.replace(/\,/g, "")) || 0;
            let unit_iva = parseFloat(el.vlr_unitiva.replace(/\,/g, "")) || 0;
            let vlr_iva = parseFloat(el.vlr_iva.replace(/\,/g, "")) || 0;
            let vlr_impoconsumo =
              parseFloat(el.vlr_impoconsumo.replace(/\,/g, "")) || 0;
            let cantidad_fact = parseFloat(el.cantidad.replace(/\,/g, "")) || 0;
            let vlr_unitario = 0;
            let porcentaje_iva = iva / 100 + 1;
            let porcimpoc = impoc / 100 + 1;
            let subtotal = 0;

            let vlr_subtotal =
              parseFloat(el.vlr_subtotal.replace(/\,/g, "")) || 0;

            // let subtotal = vlr_subtotal + vlr_iva;
            if (res.ivaincluido_fact == "1") {
              subtotal = parseFloat(el.vlr_subtotal.replace(/\,/g, "")) || 0;
            } else {
              subtotal = parseFloat(el.tot_producto.replace(/\,/g, "")) || 0;
            }
            vlr_unitario = parseFloat(subtotal / cantidad_fact).toFixed(2) || 0;

            let obj = {
              barras: null,
              cantidad: parseInt(cantidad_fact),
              descuento: el.vlr_dcto.trim(),
              iva,
              ccosto: ccosto,
              impoconsumo: 0,
              factorImpoc: porcimpoc,
              ivaTotal: vlr_iva,
              impocTotal: vlr_impoconsumo,
              key: this.get_key(),
              lista: nombre_servicio || el.nombre_servicio,
              manual: true,
              observacion: null,
              producto: producto,
              subtotal: parseInt(vlr_subtotal),
              total: total_pr,
              ubicacion: "0001",
              ubicaciones: [],
              valor: vlr_unitario,
              valorDescuento: el.vlr_dcto.trim(),
              valorIva: porcentaje_iva, // *
              unidadmed: umedida,
            };
            this.tablaDetalle.data.push(obj);
          });
          // this.form.mpago = parseInt(res.codmedio_pago);
          this.form.observaciones = res.observaciones.trim();
          this.form.maquinapos = this.maqpos;
          this.form.fechaorden = res.fechaorden_rep;
          this.form.ocompra = res.nroorden_rep;
        });
    },
    cargar_facturas() {
      this.contenido = [];
      var periodo = this.periodo_cargue.split("-").join("");
      var prefijo = this.pref_fact.prefijo_resd;

      this.loader = true;
      post
        .postData({
          url: "ptovta/dlls/PrFact03J.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" + prefijo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          // data.pop();
          this.consecutivos = data;
          // this.form.consecutivo = null;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Facturas",
            estado: true,
          });
        });
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
    grabar_factura() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.consecutivo) {
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
      } else if (!data.fpago) {
        this.errores.plazo = true;
        this.send_error("Ingresa los días de plazo");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;
        if (!data.pedido) data.pedido = {};

        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var puntoFact = data.consecutivo.agencia_fact;
            var doccontaFact = this.pref_fact.doconta_resd;
            var prefijo = this.pref_fact.prefijo_resd;
            var consecutivo = data.consecutivo.numero_fact;
            var fecha = data.fecha.replace(/\-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var formaPago = data.fpago;
            var diasPlazo = formaPago != 2 ? "0" : data.plazo;
            var maqpos = data.maquinapos;
            var tipoper = this.pref_fact.tipoper_resd;
            var metodoPago = data.mpago ? data.mpago.value : "0";
            let plazocuotas = data.nrocuotas ? data.nrocuotas.trim() : "0";
            let porcrtefte = data.porcrtefte ? data.porcrtefte.trim() : "0";
            var fechaorden = data.fechaorden.replace(/\-/g, "");
            var nroorden = data.ocompra;

            var observaciones64 = data.observaciones
              ? window.btoa(data.observaciones)
              : "";
            var observaciones = observaciones64 || "";
            // var observaciones = data.observaciones || "";
            var prefped = data.pedido.pref_fact || "0";
            var nroped = data.pedido.numero_fact || "0";

            var datosEnvio =
              sesion +
              "|" +
              puntoFact +
              "|" +
              doccontaFact +
              "|" +
              tipoper +
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
              plano +
              "|" +
              prefped +
              "|" +
              nroped +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|" +
              plazocuotas +
              "|" +
              porcrtefte +
              "|" +
              maqpos +
              "|" +
              nroorden +
              "|" +
              fechaorden +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrFact01M.dll",
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
                  text: "Factura guardada correctamente",
                  estado: true,
                });
              })
              .catch((err) => {
                console.log(err);
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
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
      this.form.fpago = 1;
      this.form.plazo = null;
      this.form.observaciones = null;
      if (this.empresa.listaspr_empr == "2") {
        this.productos = [];
      }
      this.form.doc_origen = 0;
    },
    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = _this.empresa;
        var nuevo = [];

        detalle.forEach((el) => {
          var total = parseFloat(el.valor.toString().replace(/\,/g, "")) || 0;
          var ivaTotal = el.Totaliva
            ? parseFloat(el.Totaliva.toString().replace(/\,/g, ""))
            : parseFloat(el.ivaTotal.toString().replace(/\,/g, ""));
          var impocTotal =
            parseFloat(el.impocTotal.toString().replace(/\,/g, "")) || 0;
          var valorDescuento =
            parseFloat(el.valorDescuento.toString().replace(/\,/g, "")) || 0;
          var cantidad = parseFloat(el.cantidad);
          var valorst = el.subtotal;

          // var valor = el.subtotal * cantidad;

          // var valorst = parseFloat(el.total.toString().replace(/\,/g, "")) || 0;

          // var valor =  (valort / (1 + (el.iva / 100).toFixed(0)));
          // ****var valor = valorst / (1 + parseFloat(el.iva) / 100);
          // var valorIva = parseFloat(el.ivaTotal.replace(/\,/g, "")) || 0;

          // ***var valorIva = valorst - valor;

          // var descuento = valorDescuento * cantidad;
          // ***var iva = valorIva;

          if (this.empresa.ivainc_empr == "1") {
            el.ivainc = true;
          }

          var valorIva = 0;
          var valor = 0;
          //          pruebax = 1

          if (el.ivainc) {
            valorst = total - valorDescuento;
            if (el.iva == 0) {
              valor = valorst;
              if (el.factorImpoc == 0) {
                valor = valorst;
              } else {
                valor = valorst / el.factorImpoc;
              }
            } else {
              valor = valorst / (1 + parseFloat(el.iva) / 100);
            }

            valorIva = valorst - valor;
          } else {
            if (ivaTotal == 0) {
              valor = el.subtotal / cantidad;
              valorIva = ivaTotal;
            } else {
              valor = el.subtotal / cantidad;
              valorIva = ivaTotal;
            }
          }
          var descuento = valorDescuento * cantidad;
          var iva = ivaTotal;
          var presentacion = el.presentacion ? el.presentacion.codigo_rep : 0;
          let unidadmed = el.unidadmed? el.unidadmed.value : 0;
          if(!unidadmed){
             unidadmed = "0"
          }
          let costo = el.ccosto.llavecentro_cost || "0000";
          var codigo = "";
          codigo = el.producto.codigopr_list.trim();

          nuevo.push({
            ubicacion: el.ubicacion || "0001",
            codigo,
            cantidad: cantidad.toFixed(2) + ".",
            valor: valor.toFixed(2) + ".",
            descuento: valorDescuento.toFixed(2) + ".",
            iva: iva.toFixed(2) + ".",
            observacion: el.observacion ? el.observacion : "",
            origen: "0",
            destino: "0",
            placas: "",
            remision: "0",
            ccosto: costo,
            impoconsumo: el.impoconsumo.toFixed(2),
            presentacion: "0",
            prefremis: "0",
            agcremision: "0",
            unidadmed: unidadmed,
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
          var subtotal = base + incremento + valorPorcentaje;
          var valorDescuento = subtotal * (descuento / 100);
          var total = (subtotal - valorDescuento) * item.valorIva;
          var valorIva = total - (subtotal - valorDescuento);

          item.subtotal = subtotal;
          item.valorDescuento = valorDescuento;
          item.ivaTotal = valorIva.toFixed(2);
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
        this.articulo_select.ubicacion = "0001";
        // this.articulo_select.ubicacion = {
        //   codigo_ubic: ,
        //   estado_ubic: "0",
        //   descrip_ubic: "BODEGA PRINCIPAL",
        // };

        if (this.empresa.ivainc_empr == "1") {
          this.articulo_select.ivainc = true;
        }
      } else {
        this.send_error("Debes seleccionar un cliente");
      }
    },
    agregar_servicio() {
      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.ubicacion) {
        this.send_error("Seleccione una ubicación");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 270) {
        this.send_error("La observación no puede exceder 270 carácteres");
      } else {
        if (articulo.valor == "0") {
          this.send_error("Valor unitario en 0");
        }

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
    calcular_retencion() {
      let total = parseFloat(this.tablaDetalle.totales.total);
      let total_iva = parseFloat(this.tablaDetalle.totales.total_iva);
      let subTotal = total - total_iva;
      let porcentaje_ret = parseFloat(this.form.porcrtefte);
      porcentaje_ret = porcentaje_ret / 100;

      let retencion = 0;

      if (this.form.retencion === 1) {
        retencion = subTotal * porcentaje_ret;
      }
      this.form.textimpuesto = this.formatNumero(retencion.toFixed(0)) || 0;
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
              subtotalProducto = subtotal;
              valorProducto = subtotal * iva;
              this.articulo_select.valorIva = iva;
              this.articulo_select.factorImpoc = impoconsumo;

              this.articulo_select.subtotal = subtotalProducto;
              this.articulo_select.valor = this.formatNumero(subtotal);
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
    calcularSubtotal() {
      var item = this.articulo_select;
      this.articulo_select.ivainc = false;
      if (this.empresa.ivainc_empr == "1") {
        this.articulo_select.ivainc = true;
      }
      let conversion = 1;

      if (!item.ubicacion) {
        setTimeout(() => {
          this.articulo_select.cantidad = 0;
          this.articulo_select.valor = 0;
        }, 500);
        this.send_error("Selecciona una ubicacion");
      } else {
        var saldo_array = item.ubicaciones.find(
          (el) => el.codubica_rep.trim() == item.ubicacion.codigo_ubic
        );
        // var saldo = parseInt(saldo_array.cantsaldo_rep);
        var saldo = parseFloat(item.cantidad) || 0;

        var cantidad = parseFloat(item.cantidad) || 0;
        if (cantidad > saldo) {
          setTimeout(() => {
            this.articulo_select.cantidad = saldo;
          }, 200);
          this.send_error("La cantidad supera el valor del saldo");
        } else {
          var valorFormat = parseFloat(item.valor.replace(/\,/g, "")) || 0;
          this.articulo_select.valor = this.formatNumero(valorFormat);

          var descuento = 0;

          if (item.totalDescuento) {
            descuento = parseFloat(item.totalDescuento) || 0;
          }
          var vlrDctoUnitario = descuento / cantidad;

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
            vlriva_prod = parseFloat(vlriva_prod);

            subtotal = baseiva - vlriva_prod - vlrimpoc_prod;
            totalprod = baseiva;
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

          var valorIva = vlriva_prod;
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
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar lista de precios",
              estado: true,
            });
          });
      }
    },

    get_listas_json(tipo) {
      let ciudad = this.empresa.codciudad_empr;
      let id = this.empresa.id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/listaprecios.json";
      this.tablaDetalle.data = [];
      if (this.form.clientes || tipo == 1) {
        var listaCliente = tipo == 2 ? this.form.clientes.listpr_rut : "001";
        post
          .postData({
            url: ruta,
            data: "",
            method: "GET",
          })
          .then((data) => {
            // this.productos = data;
            var data_parse = data.Lista;
            //            data.pop();
            //var data_parse = JSON.parse(JSON.stringify(data));

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
                  el.valor_minimo = articulo.vlrcompra_rep.trim();
                  el.basevta_rep =
                    parseFloat(
                      articulo.basevta_rep.toString().replace(/\,/g, "")
                    ) || 0;
                  ubicaciones.push(el);
                }
              });

              this.articulo_select.ubicaciones = ubicaciones;
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
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_productos(val) {
      return `${
        val.codigopr_list
          ? val.codigopr_list + val.descripcionpr_list
          : val.codigo_pr
      }`;
    },
    format_productos2(val) {
      return `${val.codigopr_list ? val.codigopr_list : val.codigo_pr} - ${
        val.descripcionpr_list ? val.descripcionpr_list : val.descripcion_pr
      }`;
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
          this.empresa = data[0];
          if (this.empresa.listaspr_empr == "1") {
            this.get_listas_json(1);
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
    get_resolucion() {
      var $this = this;
      this.load.consecutivo = true;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "POST",
        })
        .then((data) => {
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
    format_consecutivos(item) {
      return (
        parseFloat(item.numero_fact.trim()) + " - " + item.cliente_fact.trim()
      );
    },

    modificar_producto() {
      var $this = this;
      var index = this.edit_index;
      if (index > -1) {
        var item = JSON.parse(JSON.stringify(this.articulo_select));
        if (item.valor == "0") {
          this.send_error("Valor unitario en 0");
        }
        var detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
        detalle[index] = item;
        this.tablaDetalle.data = [];
        this.tablaDetalle.data = detalle;
      }
      this.dialogo.estado = false;
      this.clear_form();
    },
    edit_item(item) {
      item.ivainc = false;
      this.dialogo.estado = true;
      this.articulo_select = JSON.parse(JSON.stringify(item));

      this.articulo_select.totalDescuento = parseFloat(
        this.articulo_select.descuento
      );

      let busqueda = this.tablaccosto.find(
        (el) => el.llavecentro_costo == item.ccostoprod
      );
      this.articulo_select.ccosto = busqueda;

      busqueda = this.unidad_med.find((el) => el.value == item.unidadmed);
      this.articulo_select.unidadmed = busqueda;

      this.edit_index = this.tablaDetalle.data.indexOf(item);
      this.articulo_select.ivainc = false;
      if (this.empresa.ivainc_empr == "1") {
        this.articulo_select.ivainc = true;
        item.ivainc = true;
      }
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
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