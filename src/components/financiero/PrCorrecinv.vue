<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-chemical-weapon</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualizar Inventarios</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
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
                  label="Fecha Registro"
                  outlined
                  v-model="form.fecha"
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                @input="dialogPicker3 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="10" sm="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  outlined
                  return-object
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Tipo de Operación"
                  v-model="form.tipo_oper"
                  :items="toperacion"
                  :item-text="format_operacion"
                  item-value="llave_tpoper"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="get_comprobantes()"
                  :error="errores.tipo_oper"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
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
                  @change="cargar_tabla"
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Documento"
                  outlined
                  v-model="form.documento"
                  hide-details
                  type="text"
                  :error="errores.documento"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12" sm="7">
                <v-autocomplete
                  label="Proveedor"
                  v-model="form.proveedor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  outlined
                  :error="errores.clientes"
                  @change="errores.clientes = false"
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
                  class="white--text"
                  depressed
                  @click="abrir_popup()"
                  :disabled="
                    form.doc_origen
                      ? form.doc_origen == 1
                        ? true
                        : false
                      : true
                  "
                >
                  <v-icon size="20" left>mdi-cart-plus</v-icon>Agregar
                  Producto/Servicio
                </v-btn>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.idItem="{ item }">
                  {{ tablaDetalle.data.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.sub_total="{ item }">
                  {{ formatNumero(item.sub_total * item.cantidad) }}
                </template>
                <template v-slot:item.valorBase="{ item }">
                  {{ formatNumero(item.valorBase) }}
                </template>
                <template v-slot:item.cantidad="{ item }">
                  {{ formatNumero(item.cantidad) }}
                </template>
                <template v-slot:item.valorDescuento="{ item }">
                  {{ formatNumero(item.valorDescuento) }}
                </template>
                <template v-slot:item.valorIva="{ item }">
                  {{ formatNumero(item.valorIva) }}
                </template>
                <template v-slot:item.valorTotal="{ item }">
                  {{
                    formatNumero(
                      item.valorTotal + item.valorIva - item.valorDescuento
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
                        @click="modificar_item(item)"
                        :disabled="
                          form.doc_origen
                            ? form.doc_origen == 1
                              ? true
                              : false
                            : false
                        "
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Modificar item</span>
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
                        :disabled="
                          form.doc_origen
                            ? form.doc_origen == 1
                              ? true
                              : false
                            : false
                        "
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar item</span>
                  </v-tooltip>
                </template>
                <template v-slot:body.append>
                  <td colspan="4" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <!-- <td
                    class="text-xs-right text-center"
                  >{{ formatNumero(tablaDetalle.totales.total_descuentos || 0) }}</td>-->
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_subtotal || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_total || 0) }}
                  </td>
                  <td></td>
                </template>
              </v-data-table>
            </div>
            <v-row class="d-flex">
              <v-col cols="2">
                <v-text-field
                  label="Subtotal"
                  outlined
                  hide-details
                  v-model="subtotal_format"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Otros Descuentos"
                  outlined
                  hide-details
                  v-model="form.otrosdctos_format"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Iva total"
                  outlined
                  hide-details
                  v-model="form.total_iva_format"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    {
                      text: 'Compras Generales (Declarantes) 2.5%',
                      value: 2.5,
                    },
                    {
                      text: 'Compras Generales (No Declarantes) 3.5%',
                      value: 3.5,
                    },
                    { text: 'Compras Productos Agricolas) 1.5%', value: 1.5 },
                    { text: 'Compras Combustibles 0.1%', value: 0.1 },
                    { text: 'No Aplica', value: 0 },
                  ]"
                  label="% Retención"
                  outlined
                  hide-details
                  v-model="form.retencion"
                  return-object
                  :error="errores.retencion"
                  @change="
                    calcular_retencion();
                    errores.retencion = false;
                  "
                ></v-select>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Retefuente"
                  outlined
                  hide-details
                  disabled
                  v-model="form.valorRetencion"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Proceso</v-card-subtitle
              >
            </v-row>
            <v-row class="d-flex justify-end">
              <v-switch
                v-model="form.act_iva"
                label="Adicionar Iva al Activo"
              ></v-switch>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker2"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha factura"
                      outlined
                      v-model="form.fechaFactura"
                      hide-details
                      v-on="on"
                      :error="errores.fechaFactura"
                      @input="errores.fechaFactura = false"
                      @chance="errores.fechaFactura = false"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFactura"
                    @input="dialogPicker2 = false"
                    @chance="errores.fechaFactura = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

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
                      label="Fecha Vencimiento"
                      outlined
                      v-model="form.fechavence"
                      hide-details
                      v-on="on"
                      :error="errores.fechavence"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechavence"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="5">
                <v-autocomplete
                  label="Ubicacion"
                  :items="ubicaciones"
                  outlined
                  clearable
                  return-object
                  persistent-hint
                  hide-details
                  required
                  item-value="codigo_ubic"
                  :item-text="format_ubicacion"
                  v-model="form.ubicacion"
                  v-if="
                    form.doc_origen
                      ? form.doc_origen == 1
                        ? true
                        : false
                      : true
                  "
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
          <v-row class="d-flex justify-end col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="indigo"
                class="white--text"
                block
                large
                depressed
                :loading="load.btn_enviar"
                :disabled="disabled.btn_enviar"
                @click="grabar_documento()"
                >Grabar Documento</v-btn
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
                @click="imprimir_documento"
                >Imprimir Documento</v-btn
              >
            </v-col> -->
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Agregar item</v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-autocomplete
                label="Articulo"
                :items="productos"
                outlined
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo_pr"
                v-model="articulo_select.producto"
                :item-text="format_productos"
                :loading="load.servicios"
              ></v-autocomplete>
            </v-row>
            <v-row sm="12" no-gutters>
              <v-autocomplete
                label="Ubicacion"
                :items="ubicaciones"
                outlined
                clearable
                return-object
                persistent-hint
                required
                item-value="codigo_ubic"
                v-model="articulo_select.ubicacion"
                :item-text="format_ubicacion"
              ></v-autocomplete>
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
                  @input="calcularSubtotal"
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
                @click="dialogo.estado = false"
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
                @click="agregar_producto(1)"
                >Agregar Producto</v-btn
              >
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_producto(2)"
                >Modificar Producto</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <table id="pdf_header_comp">
        <thead>
          <tr>
            <th>
              <img class="logo" :src="logoSrc" />
            </th>
            <th>
              <a class="nombre_print"></a>
              <br />Nit
              <a class="nit_print"></a>
            </th>
            <th colspan="5">
              <b>
                <a class="nombredoc_print"></a>
              </b>
              <br />
              <b>
                Número:
                <a class="consecutivo_print"></a>
              </b>
              <br />
              <b>Fecha:</b>
              <a class="fecha_print"></a>
              <br />
            </th>
          </tr>
        </thead>
      </table>
      <table id="pdf_body_comp">
        <thead>
          <tr>
            <th>Item</th>
            <th>Producto</th>
            <th>Rut</th>
            <th>Documento</th>
            <th>Cantidad</th>
            <th>Valor</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr style="border-top: 1px solid">
            <td colspan="5" style="padding-bottom: 40px">
              <b>TOTALES:</b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_credito"></b>
            </td>
            <td style="padding-bottom: 40px"></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <b>Revisó:</b>
            </td>
            <td colspan="2">
              <b>Generó:</b>
              <br />
              <a class="impreso_print"></a>
              <br />
              <a class="fechagen_print"></a>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </v-layout>
</template>
<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      agencias: [],
      clientes: [],
      toperacion: [],
      productos: [],
      listas: [],
      ubicaciones: [],
      load: {
        btn_enviar: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
        consecutivo: false,
      },
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "idItem",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descripcion",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "valorBase",
          },

          // {
          //   text: "V.Descuento",
          //   align: "center",
          //   value: "valorDescuento"
          // },

          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Iva",
            align: "center",
            value: "valorIva",
          },
          {
            text: "Total",
            align: "center",
            value: "valorTotal",
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
        proveedor_input: null,
        documento: null,
        fechavence: null,
        observaciones: null,
        ubicacion: null,
        retencion: null,
        consecutivo: null,
        valorRetencion: null,
      },
      dialogo: {
        estado: false,
        tipo: false,
      },
      articulo_select: {
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
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      loader: {
        consecutivo: false,
        btn_grabar: false,
        btn_imprimir: false,
        facturas: false,
      },

      disabled: {
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
      },
      errores: {
        punto_fact: false,
        tipo_oper: false,
        fpago: false,
        retencion: false,
        documento: false,
        doc_origen: false,
        fechaFactura: false,
        fechavence: false,

        xml: false,
        clientes: false,
      },
      print: {
        comprobante: null,
      },
      consecutivos: [],
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      data_xml: null,
      dialogPicker: false,
      dialogPicker2: false,
      dialogPicker3: false,
      total_iva_format: null,
      subtotal_format: null,
    };
  },
  created() {
    this.cargarTablaAg();
    this.cargaroperaciones();
    this.get_fecha();
    this.get_Clientes();
    this.get_productos();
    this.get_ubicaciones();
    var $this = this;
    this.form.act_iva = false;

    this.$watch(
      "tablaDetalle.data",
      (e) => {
        // $this.tablaDetalle.totales.total_descuentos = 0;
        $this.tablaDetalle.totales.total_subtotal = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total_total = 0;

        e.forEach((val) => {
          var cantidad = parseInt(val.cantidad);
          // $this.tablaDetalle.totales.total_descuentos += val.valorDescuento;
          $this.tablaDetalle.totales.total_subtotal += val.sub_total * cantidad;
          $this.tablaDetalle.totales.total_iva += val.valorIva;
          $this.tablaDetalle.totales.total_total +=
            val.valorTotal + val.valorIva - val.valorDescuento;
        });
        var sbtotal = parseInt($this.tablaDetalle.totales.total_subtotal);
        $this.subtotal_format = sbtotal;

        $this.tablaDetalle.totales.total_iva =
          $this.tablaDetalle.totales.total_iva.toFixed(0);
        $this.form.total_iva_format = $this.formatNumero(
          $this.tablaDetalle.totales.total_iva
        );
      },
      { deep: true }
    );
  },
  methods: {
    modificar_item(item) {
      let documentoOrigen = this.form.doc_origen;
      let index = this.tablaDetalle.data.indexOf(item);
      let item_copia = JSON.parse(JSON.stringify(item));
      let obj_editar = null;

      if (documentoOrigen == 2) {
        obj_editar = item_copia;
      } else {
        let busqueda_articulo = this.productos.find(
          (el) => el.codigo_pr.trim() == item_copia.codigo_articulo
        );

        obj_editar = {
          producto: busqueda_articulo || null,
          lista: null,
          iva: 0,
          valor: item_copia.valorBase.toString(),
          cantidad: item_copia.cantidad,
          subtotal: item_copia.valorBase,
          total: item_copia.valorTotal.toString(),
          descuento: 0,
          valorDescuento: item_copia.valorDescuento.toString(),
          valorIva: item_copia.valorIva,
          ubicacion: {
            codigo_ubic: "0001",
            consigna_ubic: "",
            estado_ubic: "0",
            descrip_ubic: "PUNTO PRINCIPAL",
          },
          ivaTotal: item_copia.valorIva / item_copia.cantidad,
          valorBase: item_copia.valorBase,
          sub_total: item_copia.valorBase,
          valorTotal: item_copia.valorTotal,
          descripcion: item_copia.descripcion,
          codigo_articulo: item_copia.codigo_articulo,
        };
      }

      this.articulo_select = obj_editar;
      this.articulo_select.index = index;
      this.dialogo.estado = true;
      this.dialogo.tipo = false;
    },
    imprimir_documento() {
      var sesion = sessionStorage.Sesion;
      var datosEnvio = sesion + "|" + this.print.comprobante;
      this.load.imprimir_factura = true;
      this.disabled.imprimir_factura = true;
      post
        .postData({
          url: "Ptovta/dlls/PrReimpinvj.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.print_doc(data[0]);
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = false;
          this.send_error("Ha ocurrido un error durante la impresión");
        });
    },
    print_doc(item) {
      var data = item;
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        try {
          if (val == "registros") {
            var parent = document
              .getElementById("pdf_body_comp")
              .getElementsByTagName("tbody")[0];

            var registros = data[val];
            var valor = 0;
            registros.pop();
            registros.forEach((item) => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              row.insertCell(0).appendChild(document.createTextNode(item.item));
              row
                .insertCell(1)
                .appendChild(document.createTextNode(item.producto));
              row.insertCell(2).appendChild(document.createTextNode(item.rut));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.nroext));
              row;
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.cantidad));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.valor));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.detalle));

              valor += parseFloat(item.valor.replace(/\,/g, "")) || 0;
            });
            document.getElementsByClassName("total_credito")[0].innerHTML +=
              " " + this.formatNumero(valor.toFixed(2));
          } else {
            var el = val + "_print";
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          // console.error(`Parametro: ${val} - Error`, error);
        }
      });

      imprimir_pdf();
    },
    format_consecutivos(item) {
      return item.consecutivo.trim() + " - " + item.rut.trim();
    },
    get_comprobantes() {
      this.detalle = [];
      this.consecutivos = [];
      this.tablaDetalle.data = [];
      this.form.documento = null;
      this.form.fechavence = null;
      this.form.observaciones = null;
      this.form.proveedor = null;
      this.form.fechaFactura = null;

      var tipoDocumento = this.form.tipo_oper.llave_tpoper;
      let agencia = this.form.punto_fact.codigo_agc;

      if (tipoDocumento) {
        this.loader.consecutivos = true;
        var fecha = this.form.fecha.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion + "|" + tipoDocumento + "|" + fecha + "|";
        post
          .postData({
            url: "Ptovta/dlls/PrReimpinv2J.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader.consecutivos = false;
            let filtro = data.filter((el) => el.rut && el.rut.trim());
            this.consecutivos = filtro;
          })
          .catch((err) => {
            this.loader.consecutivos = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.detalle = [];
      }
    },

    cargar_tabla() {
      var item = this.form.consecutivo;
      let toper = item.toper;
      let periodo = item.fechacorta.replace(/\-/g, "");
      let consec = item.consecutivo.trim();
      let agencia = item.codagencia;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        toper +
        "|" +
        periodo +
        "|" +
        consec +
        "|" +
        agencia +
        "|" +
        0 +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrReimpinvJ.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader.consecutivos = false;
          let comprobante = data[0];
          this.cargar_datos(comprobante);
        })
        .catch((err) => {
          this.loader.consecutivos = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
        });
    },

    cargar_datos(comprobante) {
      comprobante.registros.pop();
      this.form.fecha = comprobante.fechacorta;
      this.form.documento = comprobante.docext;
      var busqueda_proveedor = this.clientes.find(
        (el) => el.identificacion_rut == comprobante.idrut
      );
      this.form.proveedor = busqueda_proveedor;

      var nuevo_detalle = [];
      comprobante.registros.forEach((el) => {
        let producto = this.productos.find(
          (art) => art.codigo_pr.trim() == el.codigo.trim()
        );
        let nombre_producto = window.atob(
          el.base1_pr.trim() +
            el.base2_pr.trim() +
            el.base3_pr.trim() +
            el.base4_pr.trim() +
            el.base5_pr.trim()
        );
        if(!nombre_producto){
          nombre_producto = el.producto
        }
        let cantidad = parseInt(el.cantidad.replace(/\,/g, ""));
        let valorTotal = parseFloat(el.valor.replace(/\,/g, "")) || 0;
        let valoriva = parseFloat(el.vlriva.replace(/\,/g, "")) || 0;
        let valorBase = valorTotal / cantidad;
        let codubicacion = el.codubicacion ? el.codubicacion : "001";
        let obj = {
          cantidad,
          codigo_articulo: el.codigo.trim(),
          descripcion: nombre_producto.trim(),
          descuento: 0,
          iva: 0,
          ivaTotal: 0,
          lista: null,
          producto,
          sub_total: valorBase,
          subtotal: valorBase,
          total: el.valor.trim(),
          ubicacion: codubicacion,
          valor: valorBase.toString(),
          valorBase,
          valorDescuento: "0",
          valorIva: valoriva,
          valorTotal: valorBase * cantidad,
        };

        nuevo_detalle.push(obj);
      });
      this.tablaDetalle.data = JSON.parse(JSON.stringify(nuevo_detalle));

      let documento = comprobante.registros;
      this.form.act_iva = parseInt(comprobante.act_iva);
      this.form.documento = comprobante.docext;

      this.form.retencion = parseFloat(comprobante.porcrte);

      this.form.fechaFactura = comprobante.fechafactura;
      this.form.fechavence = comprobante.fechavence;
      this.form.observaciones = comprobante.detalle.trim();

    },
    calcular_retencion() {
      var subTotal = parseFloat(this.subtotal_format);
      var retencion = this.form.retencion.value;
      var porcentaje_ret = retencion / 100;
      var valorRetencion = subTotal * porcentaje_ret;
      this.form.valorRetencion =
        this.formatNumero(valorRetencion.toFixed(0)) || null;
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    agregar_producto(tipo) {
      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.ubicacion) {
        this.send_error("Seleccione una ubicación");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else {
        var item = JSON.parse(JSON.stringify(articulo));
        let iva = parseFloat(item.ivaTotal.toString().replace(/\,/g, "")) || 0;
        item.valorBase = item.subtotal;
        item.sub_total = item.subtotal;
        item.valorIva = iva * item.cantidad;
        item.valorTotal = item.subtotal * item.cantidad;
        item.descripcion = item.producto.descripcion_pr.trim();
        item.codigo_articulo = item.producto.codigo_pr.trim();
        item.ubicacion = item.ubicacion.codigo_ubic;

        if (tipo == 1) this.tablaDetalle.data.push(item);
        else {
          const tabla = JSON.parse(JSON.stringify(this.tablaDetalle.data));
          const index = articulo.index;
          delete item.index;

          tabla[index] = item;
          this.tablaDetalle.data = [];
          this.tablaDetalle.data = tabla;
        }

        this.dialogo.estado = false;
        this.clear_form();
      }
    },
    calcularSubtotal() {
      var item = this.articulo_select;
      var valorFormat =
        parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
      this.articulo_select.valor = this.formatNumero(valorFormat);

      var iva = parseInt(item.producto.tiva_pr) / 100;

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

      var cantidad = parseFloat(item.cantidad) || 0;

      var total = valor * cantidad;

      this.articulo_select.descuento = descuento;
      this.articulo_select.cantidad = cantidad;
      this.articulo_select.ivaTotal = this.formatNumero(valorIva);
      this.articulo_select.valorDescuento = this.formatNumero(valorDescuento);
      this.articulo_select.total = this.formatNumero(total);
      this.articulo_select.subtotal = subtotal;
    },
    grabar_documento() {
      var data = this.form;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error(" Selecciona una agencia");
      } else if (!data.tipo_oper) {
        this.errores.tipo_oper = true;
        this.send_error(" Selecciona un tipo de operación");
      } else if (!data.documento) {
        this.errores.documento = true;
        this.send_error(" Selecciona un numero de factura");
      } else if (!data.retencion) {
        this.errores.retencion = true;
        this.send_error(" Selecciona tarifa retencion");
      } else if (!data.fechaFactura) {
        this.errores.fechaFactura = true;
        this.send_error(" Digite Fecha de la Factura");
      } else if (!data.proveedor) {
        this.errores.clientes = true;
        this.send_error("Selecciona un proveedor");
      } else if (data.doc_origen == 2 && this.tablaDetalle.data.length == 0) {
        this.send_error("Debes ingresar el detalle de la factura");
      } else if (!data.fechavence) {
        this.send_error("Ingresa la fecha de vencimiento");
      } else if (data.doc_origen == 1 && !data.ubicacion) {
        this.send_error("Selecciona una ubicación");
      } else {
        var detalle = this.tablaDetalle.data;
        this.load.btn_enviar = true;
        this.disabled.btn_enviar = true;
        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var agencia = data.punto_fact.codigo_agc;
            var tipoOperacion = data.tipo_oper.llave_tpoper;
            var consecutivo = data.consecutivo.consecutivo.trim();
            var fecha = data.fecha.replace(/\-/g, "");
            var fechafact = data.fechaFactura.replace(/\-/g, "");
            var documento = data.documento;
            var rtefte = (data.valorRetencion || "0").replace(/,/g, "").trim();
            var porcrte = data.retencion.value || "0";
            var iva = data.total_iva_format.replace(/,/g, "").trim();
            var nomtipoper = data.tipo_oper.descrip_tpoper;
            var otrosdctos = (data.otrosdctos_format || "0")
              .replace(/,/g, "")
              .trim();
            var act_iva = data.act_iva ? "1" : "0";

            var proveedor = data.proveedor;
            var fechaVencimiento = data.fechavence.replace(/\-/g, "");
            var observaciones = data.observaciones || "";

            var datosEnvio =
              sesion +
              "|" +
              agencia +
              "|" +
              tipoOperacion +
              "|" +
              "1|" +
              consecutivo +
              "|" +
              fecha +
              "|" +
              documento +
              "|" +
              proveedor +
              "|" +
              rtefte +
              "|" +
              porcrte +
              "." +
              "|" +
              iva +
              "|" +
              otrosdctos +
              "|" +
              fechaVencimiento +
              "|" +
              observaciones +
              "|" +
              plano +
              "|" +
              nomtipoper +
              "|" +
              "1001" +
              "|" +
              "00" +
              "|" +
              fechafact +
              "|" +
              act_iva +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrRegInvM.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.disabled.imprimir_factura = false;
                this.print.comprobante = data[0];
                this.$emit("snack", {
                  color: "success",
                  text: "Inventario grabado correctamente",
                  estado: true,
                });
                // this.reiniciar_formulario();
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.send_error("Error al grabar el inventario");
              });
          })
          .catch((err) => {
            this.disabled.btn_enviar = false;
            this.load.btn_enviar = false;
            this.send_error(err);
          });
      }
    },
    get_plano(detalle) {
      var $this = this;
      return new Promise((resolve, reject) => {
        var nuevo = [];
        detalle.forEach((el, idx) => {
          nuevo.push({
            codigo_articulo: el.codigo_articulo
              ? el.codigo_articulo.trim()
              : "",
            idItem: el.idItem || idx + 1,
            descripcion: el.descripcion,
            cantidad: el.cantidad.toFixed(2) + ".",
            unitario: el.valorBase.toFixed(2) + ".",
            descuento: parseFloat(el.valorDescuento).toFixed(2) + ".",
            valorIva: (el.valorIva / el.cantidad).toFixed(2) + ".",
            ubicacion: el.ubicacion ? el.ubicacion : "001",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrReginvent");
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
    abrir_popup() {
      this.dialogo.estado = true;
      this.dialogo.tipo = true;
    },
    reset_form() {
      this.validar_tipo();
      this.form.proveedor_input = null;
      this.form.documento = null;
      this.form.fechavence = null;
      this.form.observaciones = null;
      this.form.xml = null;
      this.form.fechaFactura = null;
      this.tablaDetalle.data = [];
      this.form.retencion = null;
      this.form.valorRetencion = null;
    },
    reiniciar_formulario() {
      this.form.punto_fact = null;
      this.form.tipo_oper = null;
      this.form.consecutivo = null;
      this.form.fpago = null;
      this.form.xml = null;
      this.form.proveedor = null;
      this.form.proveedor = null;

      this.form.proveedor_input = null;
      this.form.documento = null;
      this.form.fechavence = null;
      this.form.observaciones = null;
      this.tablaDetalle.data = [];
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargaroperaciones() {
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          this.toperacion = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar operaciones",
            estado: true,
          });
        });
    },
    validar_tipo() {
      var tipoOperacion = this.form.tipo_oper;
      var documento = this.form.doc_origen;
      if (tipoOperacion && documento) {
        if (tipoOperacion.llave_tpoper != "E01" && documento == 1) {
          this.form.doc_origen = { value: 2 };
          this.send_error(
            "El documento de origen no puede ser factura electrónica"
          );
        }
      }
    },
    get_consecutivo() {
      var $this = this;
      var agencia = this.form.punto_fact;
      var tipoOperacion = this.form.tipo_oper;
      this.validar_tipo();
      if (agencia && tipoOperacion) {
        this.load.consecutivo = true;
        var fecha = this.form.fecha.replace(/\-/g, "");

        var documento = tipoOperacion.llave_tpoper;
        this.form.documento = documento;
        var tipocons = tipoOperacion.tiponumer_tpoper;
        post
          .postData({
            url: "financiero/dlls/PrConsecutivoJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              "3" +
              "|" +
              agencia.codigo_agc +
              "|" +
              documento +
              "|" +
              tipocons +
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
      }
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
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
          data_parse.map((el, index) => {
            el.descripcion64 = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            );
            if (el.descripcion64) {
              el.descripcion_pr = el.descripcion64;
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
            text: "Error al cargar los productos",
            estado: true,
          });
        });
    },
    get_ubicaciones: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubicaciones = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
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
      };
    },
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_pr.trim()}`;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_operacion: function (val) {
      return `${val.llave_tpoper} - ${val.descrip_tpoper}`;
    },
    format_operador: function (val) {
      let string = null;
      if (val) {
        string = `${parseInt(val.identificacion_rut)} - ${
          val.descripcion_rut ? val.descripcion_rut.trim() : ""
        }`;
      }

      return string;
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

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_print")[0].innerHTML = "";
  document.getElementsByClassName("nombredoc_print")[0].innerHTML = "";
  document.getElementsByClassName("consecutivo_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_print")[0].innerHTML = "";
  // document.getElementsByClassName("total_debito")[0].innerHTML = "";
  document.getElementsByClassName("total_credito")[0].innerHTML = "";
  document.getElementsByClassName("impreso_print")[0].innerHTML = "";
  document.getElementsByClassName("fechagen_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body_comp")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}
</script>
