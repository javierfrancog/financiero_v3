<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cotización Comercial</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Cotización"
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
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Fecha"
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
            <!-- <v-row>
              <v-col class="pa-2 px-2 d-flex align-center justify-left">
              <v-btn
                color="indigo"
                class="white--text mr-2"
                depressed
                @click="globalizar()"
                >Globalizar</v-btn
              >
              <v-btn
                color="indigo"
                class="white--text mr-2"
                depressed
                @click="abrirVentanaProductos()"
                >Globalizar</v-btn
              >
            </v-col>
          </v-row>             -->
            <v-row> </v-row>

            <v-divider color="#FF6F00"></v-divider>

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
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Cotización</v-card-subtitle
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
              <v-col sm="3" cols="12">
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
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="form.observaciones"
                  hide-details="auto"
                  :counter="90"
                  :rules="[
                    (v) =>
                      (v ? v.length <= 90 : true) || 'Máximo 90 caracteres',
                  ]"
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
                @click="grabar_factura"
                >Grabar Cotización</v-btn
              >
              <v-btn
                color="blue darken-1"
                class="white--text mr-2"
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Imprimir Cotización</v-btn
              >
              <v-btn
                color="orange darken-1"
                class="white--text"
                large
                depressed
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Enviar Cotización
                <v-icon dark right> mdi-mail </v-icon>
              </v-btn>
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
            <v-btn
              color="light-blue accent-4 white--text"
              class
              @click="get_listas2()"
              depressed
            >
              <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
            </v-btn>
          </v-row>
        </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12">
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

            <!-- <template>
              <td>
                <table class="col-6 mx-auto">
                  <thead>
                    <tr>
                      <th>Ubicación</th>
                      <th></th>                      
                      <th colspan="2">Saldo</th>
                      <th></th>                      
                      <th colspan="2">Minimo Vta</th>                      
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Punto Principal</td>
                      <td></td>
                      <td></td>
                      <td>15</td>                                            
                      <td></td>                      
                      <td>6.800</td>
                    </tr>

                  </tbody>
                </table>
              </td>
            </template>-->

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
                  item-value="codigo_ubic"
                  v-model="articulo_select.ubicacion"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
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
            <!-- <v-row class="d-flex justify-end">
              <v-col sm="3">
                <v-text-field
                  label="Desc."
                  type="number"
                  outlined
                  hide-details
                  suffix="%"
                  v-model="articulo_select.descuento"
                  @input="calcularSubtotal"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  outlined
                  hide-details
                  suffix="$"
                  v-model="articulo_select.valorDescuento"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>-->
            <!-- <v-row class="d-flex justify-end">
              <v-col sm="3">
                <v-text-field
                  label="IVA"
                  outlined
                  disabled
                  hide-details
                  v-model="articulo_select.iva"
                  suffix="%"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="articulo_select.ivaTotal"
                  suffix="$"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>-->
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
    <v-dialog v-model="dialogo1.estado" persistent max-width="1000px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center">
            <v-data-table
              :headers="headers"
              :items="cotizaciones"
              item-key="numero_fact"
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_item(item, false)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-altimeter</v-icon>
                    </v-btn>
                  </template>
                  <span>Consolidar Cotización</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-row>

          <v-row sm="6" no-gutters>
            <v-col>
              <v-autocomplete
                label="Producto Destino"
                :items="productos"
                outlined
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                item-value="codigo_pr"
                v-model="form.producto_dest"
                @change="change_articulo_modal"
                :item-text="format_productos2"
                :loading="load.servicios"
                :error="errores.producto_dest"
                @input="errores.producto_dest = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 white--text"
            color="red"
            depressed
            @click="dialogo1.estado = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ventanaProductosVue ref="modalProductos" />
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import ventanaProductosVue from "../modals/ventanaProductos.vue";

export default {

  components: { ventanaProductosVue },
  data() {
    return {
      agencias: [],
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      listas: [],
      cotizaciones: [],

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
      },
      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
      },
      dialogo1: {
        estado: false,
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
        producto_dest: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "center", value: "cliente_fact" },
        { text: "Valor", align: "right", value: "valor_fact" },
        { text: "Opciones", value: "edit", align: "center" },
      ],

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
    // setTimeout(() => {
    //   this.format_impresion(
    //     JSON.parse(
    //       '{"nombre_empresa":"PRUEBAS CLINICO","nit_empresa":" 800,223,811","regimen_empresa":"REGIMEN COMUN","direccion_empresa":"CRA 4 CLLE 1","ciudad_empresa":"VILLAVICENCIO -META","numero_fact":"FV      17","fecha_factura":" Abril      12 de 2020","nrores_dian":"18763004208730       de  Febrero    12 de 2020","rango_dian":"desde FV       1 hasta FV  999999","nit_cliente":" 901,289,171","nombre_cliente":"TITAN SOLUCIONES SAS","direccion_cliente":"CRA 4 ESTE  15 148","telefono_cliente":"304,168,9955","ciudad_cliente":"VILLAVICENCIO -META","email_cliente":"contacto@titansoluciones.com","medio_pago":"Efectivo","forma_pago":"Contado","observaciones":"Prueba 2","total_iva":"     550,962","elaboro":"DORYS BERMUDEZ GOMEZ","productos":  [{"codigo": "00101","nombre_servicio":"ASESORIA COSTOS","cantidad":"           2","vlr_unit":"   3,190,000","vlr_dcto":"     319,000","vlr_subtotal":"   6,380,000"},{"codigo": "00102","nombre_servicio":"CONFIGURACION Y ACTIVACION  ESCRITORIOS REMOTOS","cantidad":"           2","vlr_unit":"      28,800","vlr_dcto":"","vlr_subtotal":"      57,600"}]}'
    //     )
    //   );
    // }, 500);
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaubica();
    this.$watch("form.fpago", this.re_calcular);

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
    abrirVentanaProductos() {
      this.$refs.modalProductos.abrirProductos();
    },
    globalizar() {
      if (!this.form.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de Cotización");
      } else if (!this.form.clientes) {
        this.errores.clientes = true;
        this.send_error("Selecciona un cliente");
      } else {
        this.cargarcotizacion();
        this.dialogo1.estado = true;
      }
    },
    cargarcotizacion() {
      var cliente = this.form.clientes.identificacion_rut;
      this.loader = true;
      post
        .postData({
          url: "ptovta/dlls/PrCotiza05J.dll",
          data: sessionStorage.Sesion + "|" + cliente + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cotizaciones = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cotizaciones",
            estado: true,
          });
        });
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    getDataContizacion(item) {
      return new Promise((resolve) => {
        var fecha = item.fecha_fact.substr(0, 4);
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
            url: "Ptovta/dlls/PrCotiza01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            resolve(data[0]);
          })
          .catch((err) => {
            console.log(err);
            this.send_error("Error al consolidar el documento");
          });
      });
    },
    validar_cliente() {
      var empresa = this.empresa;
      this.input_articulo = false;
      this.get_listas();
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
          console.log("Error", err);
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
          let data_parse = data.map((el, index) => {
            descripcion64 = window.atob(
              el.base1_pr +
                el.base2_pr +
                el.base3_pr +
                el.base4_pr +
                el.base5_pr
            );
            if (descripcion64) {
              el.descripcionpr = descripcion64;
            } else {
              el.index = index;
            }
            return el;
          });

          this.productos = data_parse;
        })
        .catch((err) => {
          this.load.servicios = false;
          console.log("Error", err);
        });
    },
    set_diasPlazo() {
      if (this.form.fpago == 2) this.form.plazo = this.form.clientes.diaspl_rut;
      else this.form.plazo = 0;
    },
    get_pdf_pos(data) {
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
        data.telefono_empresa = this.empresa.telefono_empr;
        var format = this.pdfs.prcotiza02_pos(data, logo);
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
    grabar_factura() {
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
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var puntoFact = data.punto_fact.codigo_agc;
            var doccontaFact = data.punto_fact.docconta_agc;
            // var prefijo = data.punto_fact.prefijo_agc;
            var consecutivo = data.consecutivo.trim();
            var fecha = data.fecha.replace(/\-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var formaPago = data.fpago;
            var diasPlazo = formaPago != 2 ? "0" : data.plazo;
            var tipoper = data.punto_fact.tipoper_agc;
            var metodoPago = data.mpago || "0";
            var moneda = data.moneda || "0";

            var observaciones = data.observaciones
              ? window.btoa(data.observaciones)
              : "";

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
              moneda +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|" +
              plano +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrCotiza01.dll",
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
                  text: "Cotización guardada correctamente",
                  estado: true,
                });
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                console.error(err);
                this.send_error("Error al grabar la Cotización");
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
      this.productos = [];

      this.get_consecutivo();
    },
    get_impresion() {
      this.disabled.imprimir_factura = true;
      this.load.imprimir_factura = true;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio =
        sessionStorage.Sesion + "|" + this.print.comprobante + fecha + "|";

      var agencia = this.form.punto_fact;
      let prefijo = this.form.punto_fact.prefijo_agc;
      post
        .postData({
          url: "Ptovta/dlls/PrCotiza01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].observaciones = atob(
            data[0].observaciones1 +
              data[0].observaciones2 +
              data[0].observaciones3
          );
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          if (this.empresa[0].poscotiza_empr == 1) {
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

    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = _this.empresa[0];
        var nuevo = [];
        detalle.forEach((el) => {
          var cantidad = parseFloat(el.cantidad);
          var valorst = el.subtotal * cantidad;
          var valor = valorst / (1 + parseFloat(el.iva) / 100);
          var valorDescuento =
            parseFloat(el.valorDescuento.toString().replace(/\,/g, "")) || 0;
          var valorIva = valorst - valor;
          var descuento = valorDescuento * cantidad;
          var iva = valorIva;

          var codigo = "";
          if (el.producto.codigopr_list)
            codigo = el.producto.codigopr_list.trim();
          else if (el.producto.codigo_pr) codigo = el.producto.codigo_pr.trim();

          nuevo.push({
            ubicacion: el.ubicacion.codigo_ubic || "0001",
            codigo,
            cantidad: cantidad.toFixed(2) + ".",
            valor: valor.toFixed(2) + ".",
            descuento: descuento.toFixed(2) + ".",
            iva: iva.toFixed(2) + ".",
            observacion: el.observacion || "",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "Cotiza01");
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
      var empresa = this.empresa[0];
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
                console.log("porcentaje", porcentaje);
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
              this.articulo_select.subtotal = subtotalProducto;
              this.articulo_select.valor = this.formatNumero(subtotal);
            } else {
              this.clear_form();
            }
          })
          .catch((err) => {
            // console.log("Err", err);
            this.clear_form();
          });
      } else {
        this.clear_form();
      }
    },
    calcularSubtotal() {
      var item = this.articulo_select;
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
          var valorFormat =
            parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
          this.articulo_select.valor = this.formatNumero(valorFormat);

          var iva = parseInt(item.iva) / 100;

          // var subtotal = item.subtotal;
          // var subtotal = valorFormat - ivaTotal;
          var subtotal = valorFormat;
          var descuento =
            parseFloat(item.descuento.toString().replace(/\,/g, "")) || 0;
          var valorDescuento = subtotal * (descuento / 100);
          var subValor = subtotal - valorDescuento;

          var valorIva = (subValor * iva).toFixed(0);
          // var valor = subValor + parseFloat(valorIva);
          var valor = subValor;

          var total = valor * cantidad;

          this.articulo_select.descuento = descuento;
          this.articulo_select.cantidad = cantidad;
          this.articulo_select.ivaTotal = this.formatNumero(valorIva);
          this.articulo_select.valorDescuento =
            this.formatNumero(valorDescuento);
          this.articulo_select.total = this.formatNumero(total);
          this.articulo_select.subtotal = subtotal;
        }
      }
    },
    get_listas() {
      let ciudad = this.empresa[0].codciudad_empr;
      let id = this.empresa[0].id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/listaprecios.json";
      this.tablaDetalle.data = [];
      if (this.form.clientes) {
        var listaCliente = "001";
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
    get_listasx() {
      this.tablaDetalle.data = [];
      if (this.form.clientes) {
        var listaCliente = this.form.clientes.listpr_rut;
        post
          .postData({
            url: "Financiero/dlls/CfcarglistasJ.dll",
            data: sessionStorage.Sesion + "|1|" + listaCliente + "|",
            method: "",
          })
          .then((data) => {
            var data_parse = JSON.parse(JSON.stringify(data));
            let descripcion64 = " ";

            data_parse.map((el, index) => {
              descripcion64 = window.atob(
                el.base1_pr +
                  el.base2_pr +
                  el.base3_pr +
                  el.base4_pr +
                  el.base5_pr
              );
              if (descripcion64) {
                el.descripcionpr_list = descripcion64;
              } else {
                el.index = index;
              }
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
            let nombre64 = " ";
            this.productos = this.productos.map((item) => {
              nombre64 = window.atob(
                item.base1_pr +
                  item.base2_pr +
                  item.base3_pr +
                  item.base4_pr +
                  item.base5_pr
              );
              if (nombre64) {
                item.descripcionpr = nombre64;
              }
              return item;
            });
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
        var empresa = this.empresa[0];
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
            console.log("Err", err);
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
      return `${val.codigo_pr ? val.codigo_pr : codigopr_list} - ${
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
      // this.form.prefijo =
      //   this.form.punto_fact.prefijo_agc +
      //   " - " +
      //   this.form.punto_fact.descripdoc_agc;
      var fecha = this.form.fecha.replace(/-/g, "");
      // var prefijo = $this.form.punto_fact.prefijo_agc;

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
            "COT" +
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
    async get_item(item) {
      if (!this.form.producto_dest) {
        this.errores.producto_dest = true;
        this.send_error("Selecciona un Producto Destino");
      } else {
        const prodDestino = this.form.producto_dest;
        const ubicacion = [];

        const cotizacion = await this.getDataContizacion(item);
        const { productos } = cotizacion;

        // console.log('productos', productos)
        // console.log('prodDestino', prodDestino)
        // console.log('cotizaciones', this.cotizaciones)
        // console.log('item', item)

        let cantidad = 0;
        let total =
          parseFloat(item.valor_fact.toString().replace(/\,/g, "")) || 0;
        let subtotal = total;
        let ivaTotal = 0;
        let vlr_unit = 0;
        productos.forEach((item) => {
          cantidad += parseFloat(item.cantidad);
        });
        vlr_unit = parseFloat(total / cantidad).toFixed(2);
        subtotal = vlr_unit;

        prodDestino.descripcion_pr = prodDestino.descripcionpr_list;
        let iva =
          parseFloat(prodDestino.porciva_list.toString().replace(/\,/g, "")) ||
          0;

        let valorIva = 1 + iva / 100;

        ubicacion.codigo_ubic = "0001";
        let itemDetalle = {
          key: this.get_key(),
          producto: prodDestino,
          ubicacion: ubicacion,
          ubicaciones: [],
          subtotal,
          ivaTotal,
          iva,
          vlr_unit,
          total: total,
          valorDescuento: 0,
          valorIva: valorIva,
          cantidad,
        };
        this.tablaDetalle.data.push(itemDetalle);
        this.dialogo1.estado = false;
      }
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
