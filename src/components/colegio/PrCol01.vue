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
              <v-icon size="30" color="blue darken-4 ">mdi-square-root</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Facturación Individual Colegios</v-list-item-title
              >
            </v-list-item-content>
              <v-card-actions>
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="
                    this.get_Clientes();
                  "
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
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Facturacion"
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
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Prefijo"
                  outlined
                  v-model="form.prefijo"
                  hide-details
                  disabled
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
            <v-row>
              <v-col cols="3" v-if="form.clientes">
                <!-- <v-select
                  :items="[
                    { text: 'No Aplica', value: 0 },
                    { text: 'Pedido', value: 1 },
                    { text: 'Cotización', value: 2 },
                  ]"
                  label="Documento Origen"
                  outlined
                  hide-details
                  v-model="form.doc_origen"
                  @change="validar_docOrigen"
                  :error="errores.doc_origen"
                ></v-select> -->
              </v-col>
              <v-col cols="4" v-if="form.doc_origen == 1">
                <v-select
                  :items="lista_pedidos"
                  label="Pedidos"
                  outlined
                  hide-details
                  v-model="form.pedido"
                  return-object
                  item-value="numero_fact"
                  :item-text="format_pedido"
                  @change="get_infoPedido"
                  :disabled="productos.length == 0"
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
                <template v-slot:item.descrip_producto="{ item }">{{
                  item.producto.descripcion_pr ||
                  item.producto.descripcionpr_list
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
          <v-row class="d-flex justify-center col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                @click="grabar_factura"
                >Grabar Factura</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-5" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="get_enviardian"
                >Enviar Dian</v-btn
              >
            </v-col>

            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="get_impresion"
                >Imprimir Factura</v-btn
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
          <v-row sm="12">
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

  </v-layout>
</template>
<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      agencias: [],
      pedidos: [],
      ubica: [],
      clientes: [],
      empresa: [],
      productos: [],
      listas: [],
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
        doc_origen: 0,
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
              // console.log(_this.productos, el.codigo);
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

            // console.log("Nuevo", nuevo_detalle);
            _this.tablaDetalle.data = [];
            _this.tablaDetalle.data = nuevo_detalle;
          });
      }
    },
    validar_docOrigen() {
      var _this = this;
      var docOrigen = this.form.doc_origen;
      if (docOrigen == 1) {
        var cliente = this.form.clientes.identificacion_rut;
        var datosEnvio = `${sessionStorage.Sesion}|0|${cliente}|`;
        post
          .postData({
            url: "ptovta/dlls/PrPedido02J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            _this.lista_pedidos = res;
          });
      }
    },
    format_pedido(item) {
      return item.fecha_fact + " - " + item.numero_fact;
    },
    get_enviardian() {
      this.card.loader = true;
      this.card.disabled = true;
      var $this = this;
      var key = this.print.comprobante;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      post
        .postData({
          url: "Ptovta/dlls/PrFact01FEJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          var urlEnvio = null;
          if (this.empresa.felectronica_empr == "0")
            urlEnvio = "https://server1ts.net/facturae/consulta.php";
          else urlEnvio = "https://server1ts.net/facturae/consulta.prod.php";

          var formData = new FormData();
          formData.append("factura", JSON.stringify(data[0]));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.card.loader = false;
              this.card.disabled = false;
              $this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              var res = JSON.parse(response.res);
              if (response.codigo == "0") {
                if (res.IdDocumento.Respuesta) {
                  $this.grabar_cufe(res);
                } else {
                  this.card.loader = false;
                  this.card.disabled = false;
                  $this.$emit("snack", {
                    color: "success",
                    text: res.RespuestaFacse,
                    estado: true,
                  });
                }
              } else {
                this.card.loader = false;
                this.card.disabled = false;
                $this.send_error("Error enviando la factura electrónica");
              }
            });
        });
    },
    grabar_cufe(res) {
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = `${sessionStorage.Sesion}|0|${this.print.comprobante}${res.IdDocumento.Contenido}|${fecha}|`;

      post
        .postData({
          url: "Ptovta/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: res.RespuestaFacse,
            estado: true,
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    validar_cliente() {
      this.form.doc_origen = 0;
      this.form.pedido = null;
      this.tablaDetalle.data = [];

      var empresa = this.empresa;
      if (empresa[0].carguepr_empr == "0") {
        this.input_articulo = false;
        this.get_listas();
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
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        var el = val + "_print";
        try {
          if (val == "productos") {
            var productos = data[val];
            var parent = document
              .getElementById("pdf_body")
              .getElementsByTagName("tbody")[0];

            var subtotal = 0;
            var descuentoTotal = 0;
            var totalIva = parseFloat(data.total_iva.replace(/\,/g, "")) || 0;

            productos.forEach((item) => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              var subTotal =
                parseFloat(item.vlr_subtotal.replace(/\,/g, "")) || 0;
              var descuento = parseFloat(item.vlr_dcto.replace(/\,/g, "")) || 0;

              row
                .insertCell(0)
                .appendChild(document.createTextNode(item.codigo));

              let row_item = row.insertCell(1);
              row_item.innerHTML = `${item.nombre_servicio} <br> ${item.detprod}`;

              row.insertCell(2).appendChild(document.createTextNode(""));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.cantidad));
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.vlr_unit));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.vlr_dcto));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.vlr_subtotal));

              subtotal += subTotal;
              descuentoTotal += descuento;
            });

            var subtotal_total = subtotal - descuentoTotal;
            var total_factura = subtotal_total + totalIva;

            document.getElementsByClassName(
              "subtotal_final"
            )[0].innerHTML = this.formatNumero(subtotal.toString());
            document.getElementsByClassName(
              "descuento_final"
            )[0].innerHTML = this.formatNumero(descuentoTotal.toString());
            document.getElementsByClassName(
              "subtotal_total"
            )[0].innerHTML = this.formatNumero(subtotal_total.toString());
            document.getElementsByClassName(
              "total_factura"
            )[0].innerHTML = this.formatNumero(total_factura.toString());

            var letras = numeroALetras(total_factura);
            document.getElementsByClassName(
              "numeroLetras"
            )[0].innerHTML = letras.toString();
          } else {
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          // console.error(`Parametro: ${el} - Error`, error);
        }
      });

      imprimir_pdf();
    },
    grabar_factura() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de facturación");
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
        if (!data.pedido) data.pedido = {};

        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var puntoFact = data.punto_fact.codigo_agc;
            var doccontaFact = data.punto_fact.docconta_agc;
            var prefijo = data.punto_fact.prefijo_agc;
            var consecutivo = data.consecutivo;
            var fecha = data.fecha.replace(/\-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var formaPago = data.fpago;
            var diasPlazo = formaPago != 2 ? "0" : data.plazo;
            var tipoper = data.punto_fact.tipoper_agc;
            var metodoPago = data.mpago || "0";
            var observaciones = data.observaciones || "";
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
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrFact01.dll",
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
      this.form.mpago = null;
      this.form.observaciones = null;
      this.productos = [];
      this.form.doc_origen = 0;

      this.get_consecutivo();
    },
    get_pdf_pos(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.prfact02_pos(data, logo);
        pdfMake.createPdf(format).print();
      });
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
          if (data[0].impresion_fact == "1") {
            this.get_pdf_pos(data[0]);
          } else {
            this.format_impresion(data[0]);
          }
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.send_error("Error al imprimir el documento");
        });
    },

    get_json_dian(item) {},

    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = _this.empresa[0];
        var nuevo = [];
        detalle.forEach((el) => {
          var cantidad = parseFloat(el.cantidad);
          // var valor = el.subtotal * cantidad;
          var valorst = el.subtotal * cantidad;
          // var valor =  (valort / (1 + (el.iva / 100).toFixed(0)));
          var valor = valorst / (1 + parseFloat(el.iva) / 100);
          var valorDescuento =
            parseFloat(el.valorDescuento.toString().replace(/\,/g, "")) || 0;
          // var valorIva = parseFloat(el.ivaTotal.replace(/\,/g, "")) || 0;
          var valorIva = valorst - valor;
          // var descuento = valorDescuento * cantidad;
          var descuento = valorDescuento * cantidad;
          var iva = valorIva;

          var codigo = "";
          if (el.producto.codigopr_list)
            codigo = el.producto.codigopr_list.trim();
          else if (el.producto.codigo_pr) codigo = el.producto.codigo_pr.trim();

          // if (empresa.carguepr_empr == "0") codigo = el.producto.codigopr_list;
          // else codigo = el.producto.codigo_pr;
          // codigo = el.producto.codigo_pr;

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
        this.articulo_select.ubicacion = {
          codigo_ubic: "0001",
          estado_ubic: "0",
          descrip_ubic: "BODEGA PRINCIPAL",
        };
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
      } else if (articulo.observacion && articulo.observacion.length > 90) {
        this.send_error("La observación no puede exceder 90 carácteres");
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
        // console.log("Item tabla", item);
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
              this.articulo_select.subtotal = subtotalProducto;
              this.articulo_select.valor = this.formatNumero(subtotal);
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
          this.articulo_select.valorDescuento = this.formatNumero(
            valorDescuento
          );
          this.articulo_select.total = this.formatNumero(total);
          this.articulo_select.subtotal = subtotal;
        }
      }
    },
    get_listas() {
      this.tablaDetalle.data = [];
      if (this.form.clientes) {
        var listaCliente = this.form.clientes.listpr_rut;
        post
          .postData({
            url: "Colegios/dlls/CfcarglistasJ.dll",
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
    get_listas2() {
      if (this.form.clientes) {
        var listaCliente = this.form.clientes.listpr_rut;
        post
          .postData({
            url: "Colegios/dlls/CfcarglistasJ.dll",
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
                text:
                  "No se ha encontrado ningún producto con el código de barras.",
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

    buscarpedidos() {
      this.pedidos = [];

      {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        var cliente = this.form.clientes;
        this.loader = true;

        post
          .postData({
            url: "ptovta/dlls/PrPedido02J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              0 +
              "|" +
              cliente +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.pedidos = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Pedidos",
              estado: true,
            });
          });
      }
    },
    get_consecutivo() {
      var $this = this;
      this.load.consecutivo = true;
      this.form.prefijo =
        this.form.punto_fact.prefijo_agc +
        " - " +
        this.form.punto_fact.descripdoc_agc;
      var fecha = this.form.fecha.replace(/-/g, "");
      var prefijo = $this.form.punto_fact.prefijo_agc;

      post
        .postData({
          url: "financiero/dlls/PrConsecutivoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            2 +
            "|" +
            this.form.punto_fact.codigo_agc +
            "|" +
            this.form.punto_fact.docconta_agc +
            "|" +
            0 +
            "|" +
            fecha +
            "|" +
            prefijo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = data[0].nro_cons.trim();
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
    formatNumero: function (val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: ".",
      });

      mask.resolve(val.toString());
      return mask.value;
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

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_prfact01").innerHTML}</style>`
  );

  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("regimen_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("direccion_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("ciudad_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("numero_fact_print")[0].innerHTML = "";
  document.getElementsByClassName("nombre_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("direccion_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("telefono_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("ciudad_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("email_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_factura_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_vence_print")[0].innerHTML = "";
  document.getElementsByClassName("nrores_dian_print")[0].innerHTML = "";
  document.getElementsByClassName("rango_dian_print")[0].innerHTML = "";
  document.getElementsByClassName("numeroLetras")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_final")[0].innerHTML = "";
  document.getElementsByClassName("descuento_final")[0].innerHTML = "";
  document.getElementsByClassName("base_gravada2")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_total")[0].innerHTML = "";
  document.getElementsByClassName("total_iva_print")[0].innerHTML = "";
  document.getElementsByClassName("total_factura")[0].innerHTML = "";
  document.getElementsByClassName("observaciones_print")[0].innerHTML = "";
  document.getElementsByClassName("elaboro_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}

var numeroALetras = (function () {
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }

    return "";
  } //Unidades()

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOSCIENTOS " + Decenas(decenas);
      case 3:
        return "TRESCIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let letras = "";

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += "";

    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;

    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "PESOS M/CTE", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || "PESO M/CTE", //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || "M/CTE",
      letrasMonedaCentavoSingular: currency.centSingular || "M/CTE",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  };
})();
</script>
<style scoped>
hr {
  border-width: 15% !important;
}
</style>