F<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cash-usd-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Compra Productos Agrícolas</v-list-item-title
              >
            </v-list-item-content>
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
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha"
                  @input="dialogPicker3 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                hide-details
                type="text"
                :loading="load.consecutivo"
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  clearable
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

              <v-col class="d-flex" cols="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPickerini"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Inicial"
                      outlined
                      v-model="form.fechaini"
                      hide-details
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaini"
                    @input="calcular_final()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPickerfin"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Final"
                      outlined
                      v-model="form.fechafin"
                      hide-details
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechafin"
                    @input="dialogPickerfin = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="2">
                <v-select
                  :items="asociado"
                  label="Producto"
                  outlined
                  hide-details
                  :disabled="disabled.asociado"
                  v-model="form.asociado"
                  @change = "get_consecutivo()"
                >
                </v-select>
              </v-col>

              <v-col class="d-flex justify-end" cols="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="get_pesaje"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Proveedor"
                  v-model="form.proveedor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="pesajes"
                  clearable
                  hide-details
                  outlined
                  return-object
                  :error="errores.clientes"
                  @change="
                    (errores.clientes = false),
                      reiniciar_formulario(),
                      get_facturas()
                  "
                  :disabled="pesajes.length == 0"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col> </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4"
                  class="white--text"
                  depressed
                  @click="abrir_popup()"
                >
                  <v-icon size="20" left>mdi-cart-plus</v-icon>Agregar Pesaje
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
                <template v-slot:item.valorDescuento="{ item }">
                  {{ formatNumero(item.valorDescuento) }}
                </template>
                <template v-slot:item.valorIva="{ item }">
                  {{ formatNumero(item.valorIva) }}
                </template>
                <template v-slot:item.vlrtotal_pes="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.vlrtotal_pes.replace(/\,/g, ""))
                    )
                  }}
                </template>
                <template v-slot:item.pesoini_pes="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.pesoini_pes.replace(/\,/g, ""))
                    )
                  }}
                </template>
                <template v-slot:item.pesocomp_pes="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.pesocomp_pes.replace(/\,/g, ""))
                    )
                  }}
                </template>
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
                  <td>
                    <strong></strong>
                  </td>

                  <td colspan="2" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-center">
                    <strong>{{
                      tablaDetalle.totales.kilos_ingreso || 0
                    }}</strong>
                  </td>
                  <td colspan="3"></td>
                  <td></td>
                  <td></td>
                  <td class="text-center">
                    <strong>{{ tablaDetalle.totales.kilos_neto || 0 }}</strong>
                  </td>
                  <td></td>
                  <td class="text-center">
                    <strong>{{ tablaDetalle.totales.valor_total || 0 }}</strong>
                  </td>
                  <td></td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Descuentos</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col cols="2" v-if="form.asociado != 1">
                <v-select
                  :items="[
                    { text: 'Descontar', value: 1 },
                    { text: 'No Aplica', value: 9 },
                  ]"
                  label="Fenalce"
                  outlined
                  hide-details
                  v-model="form.fenalce"
                  @change="fenalce_change"
                >
                </v-select>
              </v-col>
              <v-col class="d-flex" cols="2" v-if="form.asociado != 1">
                <v-text-field
                  label="Valor Fenalce"
                  v-model="form.vlrfenalce"
                  outlined
                  disabled
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="3" v-if="form.asociado == 1">
                <v-text-field
                  label="Fomento Arrocero"
                  v-model="form.farrocero"
                  outlined
                  disabled
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Cargue"
                  outlined
                  hide-details
                  clearable
                  v-model="form.cargue"
                  @input="retencion_change"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Descargue"
                  v-model="form.descargue"
                  outlined
                  hide-details
                  clearable
                  @input="retencion_change"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="[
                    { text: 'Bolsa Nal Agropecuaria', value: 1 },
                    { text: 'Retención en la Fuente', value: 2 },
                    { text: 'No Aplica', value: 9 },
                  ]"
                  label="RteFte/Bolsa"
                  outlined
                  hide-details
                  v-model="form.impuesto"
                  @change="retencion_change"
                >
                </v-select>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="impuesto"
                  v-model="form.textimpuesto"
                  outlined
                  disabled
                  hide-details
                  type="text"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col cols="12" class="d-flex justify-center">
                <v-btn
                  color="orange"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="get_facturas"
                >
                  Cargue/Cartera
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  dense
                  :search="buscar_pendientes"
                  :headers="[
                    { text: 'Fecha', value: 'fecha_cart' },
                    { text: 'Prefijo', value: 'pref_cart' },
                    { text: 'Factura', value: 'numero_cart', align: 'center' },
                    { text: 'Cuenta', value: 'cuenta_cart' },
                    { text: 'Nombre Cuenta', value: 'descrcuenta_cart' },
                    { text: 'Saldo', value: 'valor_cart', align: 'right' },
                    { text: 'Editar', value: 'btn', align: 'center' },
                  ]"
                  :items="facturasPendientes"
                >
                  <template v-slot:body.append>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td class="text-right"><b>Total: </b></td>
                      <td></td>
                      <td class="text-right">
                        <b> $ {{ formatNumero(valor_total_facturas_pend) }}</b>
                      </td>
                      <td></td>
                    </tr>
                  </template>

                  <template v-slot:item.btn="{ item }">
                    <v-btn
                      color="green"
                      fab
                      class="white--text mx-auto mr-2"
                      x-small
                      depressed
                      @click="editar_item(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      color="red darken-4"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      @click="eliminar_seleccion(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex justify-end">
              <v-col cols="auto">
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                  >Total Compra</v-card-subtitle
                >
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  outlined
                  hide-details
                  disabled
                  v-model="form.compra"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col cols="3">
                <v-select
                  :items="[
                    { text: 'Tarifa 5%', value: 5 },
                    { text: 'No Aplica', value: 9 },
                  ]"
                  label="Iva"
                  outlined
                  hide-details
                  v-model="form.iva"
                  @change="iva_change(), (errores.iva = false)"
                  :error="errores.iva"
                >
                </v-select>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="impuesto"
                  v-model="form.textiva"
                  outlined
                  disabled
                  hide-details
                  type="text"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col cols="auto">
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                  >Descuentos</v-card-subtitle
                >
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  outlined
                  hide-details
                  disabled
                  v-model="form.descuentos"
                  :value="formatNumero(this.descuentos)"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col cols="auto">
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                  >Neto a Cancelar</v-card-subtitle
                >
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  outlined
                  hide-details
                  v-model="form.neto_cancelar"
                  disabled
                  :value="formatNumero(neto_cancelar)"
                ></v-text-field>
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
          <v-row class="d-flex justify-end col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
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
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                @click="print_item()"
                >Imprimir Documento</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.estado" max-width="800" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Agregar Pesaje</v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-col class="mb-0" cols="8" sm="8">
                <v-autocomplete
                  label="Pesaje"
                  :items="pesajes_filtro"
                  outlined
                  clearable
                  return-object
                  multiple
                  hint="Buscar tiquetes"
                  persistent-hint
                  required
                  item-value="nro_pes"
                  v-model="articulo_select.producto"
                  :item-text="format_pesaje"
                  :loading="load.servicios"
                >
                </v-autocomplete>
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
                >Cancelar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                v-if="dialogo.tipo"
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_producto"
                >Agregar
              </v-btn>
              <v-btn v-else color="green darken-1" dark block depressed
                >Modificar Pesaje</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoEditar.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Editar Descuentos</v-card-title>
        <v-card-content>
          <v-text-field
            label="Saldo"
            outlined
            v-model="dialogoEditar.saldo"
            v-money="money0"
          ></v-text-field>
        </v-card-content>
        <v-card-footer>
          <v-btn
            outlined
            color="red"
            class="white--text mr-2"
            @click="
              dialogoEditar.estado = false;
              dialogoEditar.saldo = 0;
              dialogoEditar.index = null;
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="green" class="white--text" @click="guardar_editar()">
            Guardar cambios
          </v-btn>
        </v-card-footer>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style scoped>
.inputPeso {
  font-size: 36px !important;
}
</style>
<script>

import post from "../../methods.js";
import { liquidamol } from "../../_formatos_mol.js";

export default {

  data() {
    return {
      agencias: [],
      clientes: [],
      datosEmpresa: [],
      pesajes: [],
      parametros: [],
      pesajes_filtro: [],
      totdesctos: 0,
      fomento: 0,
      totcartera: 0,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      asociado: [
        { text: "Arroz Paddy", value: 1 },
        { text: "Maiz", value: 2 },
        { text: "Soya", value: 3 },
        { text: "Sorgo", value: 4 },
        { text: "Algodón", value: 5 },
      ],
      load: {
        btn_enviar: false,
        impresion: false,
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
            text: "Nro.Pesaje",
            align: "left",
            value: "nro_pes",
          },
          {
            text: "Producto",
            align: "center",
            value: "producto_pes",
          },
          {
            text: "Kilos Ingreso",
            align: "center",
            value: "pesoneto_pes",
          },
          {
            text: "Humedad",
            align: "center",
            value: "humini_pes",
          },
          {
            text: "Impureza",
            align: "center",
            value: "impini_pes",
          },
          {
            text: "G.Partido",
            align: "center",
            value: "gpart_pes",
          },
          {
            text: "G.Rojo",
            align: "center",
            value: "rojoini_pes",
          },
          {
            text: "G.Yesado",
            align: "center",
            value: "yesoini_pes",
          },

          {
            text: "Kilos Netos",
            align: "center",
            value: "pesocomp_pes",
          },
          {
            text: "vlr Kilo",
            align: "center",
            value: "vlrkilo_pes",
          },
          {
            text: "Valor Total",
            align: "center",
            value: "vlrtotal_pes",
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
        cargue: 0,
        descargue: 0,
        descuentos: 0,
        asociado: null,
        farrocero: null,
        observaciones: null,
        fechafin: null,
        ubicacion: null,
        punto_fact: null,
      },
      dialogo: {
        estado: false,
        tipo: false,
      },
      dialogo_anticipo: {
        estado: false,
        tabla_seleccionados: [],
      },
      dialogo_modificar: {
        estado: false,
        index: null,
        valor: null,
      },
      comprobante: {
        facturas: null,
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
        variedad: null,
        valorIva: 0,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        btn_enviar: false,
        asociado: false,
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
        clientes: false,
        iva: false,
      },
      print: {
        comprobante: null,
      },
      facturasPendientes: [],

      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      data_xml: null,
      dialogPickerini: false,
      dialogPickerfin: false,
      dialogPicker3: false,
      subtotal_format: null,
      ciudades_dian: null,

      total_compra: 0,
      valor_total_seleccionados: 0,
      valor_total_facturas_pend: 0,
      buscar_pendientes: null,

      dialogoEditar: {
        estado: false,
        saldo: 0,
        item: null,
      },
    };
  },
  computed: {
    descuentos() {
      let cartera = this.valor_total_facturas_pend || 0;
      cartera = parseInt(cartera);
      let rtefte = this.form.textimpuesto || 0;
      let cargue = this.form.cargue || 0;
      let descargue = this.form.descargue || 0;
      let vlrcargue = parseFloat(cargue.toString().replace(/,/g, "") || 0);
      let vlrdescargue = parseFloat(
        descargue.toString().replace(/,/g, "") || 0
      );
      let vlrretefte = parseFloat(rtefte.toString().replace(/,/g, "") || 0);
      let tdesctos =
        parseFloat(cartera) +
        parseFloat(vlrretefte) +
        parseFloat(vlrcargue) +
        parseFloat(vlrdescargue);

      return tdesctos;
    },
    neto_cancelar() {
      let valor = this.form.compra || 0;
      let compra = parseFloat(valor.toString().replace(/,/g, "") || 0);
      return parseFloat(compra) - this.descuentos;
    },
  },
  created() {
    this.get_empresa();
    this.cargarParametros();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();

    var $this = this;
    this.$watch("facturasPendientes", (e) => {
      let total = 0;
      e.forEach((val) => {
        let saldo = parseFloat(
          val.valor_cart.toString().replace(/,/g, "") || 0
        );
        total += saldo;
      });

      $this.valor_total_facturas_pend = total;
      this.retencion_change();
      this.iva_change();
    });

    this.$watch(
      "tablaDetalle.data",
      (e) => {
        let kilos_ingreso_t = 0;
        let kilos_neto_t = 0;
        let valor_total_t = 0;
        let unit_desc = 0;
        let desc_mol_t = 0;
        let desc_canoa_t = 0;
        let empaques = parseFloat(e[0].bultos_pes) || 0;

        e.forEach((val) => {
          let kilos_ingreso =
            parseFloat(val.pesoneto_pes.replace(/\,/g, "")) || 0;
          let kilos_neto = parseFloat(val.pesocomp_pes.replace(/\,/g, "")) || 0;
          let valor_total =
            parseFloat(val.vlrtotal_pes.replace(/\,/g, "")) || 0;

          let desc_mol = parseFloat(val.descmol_pes.replace(/\,/g, "")) || 0;
          let desc_canoa =
            parseFloat(val.desccanoa_pes.replace(/\,/g, "")) || 0;

          kilos_ingreso_t += kilos_ingreso;
          kilos_neto_t += kilos_neto;
          desc_mol_t += desc_mol;
          desc_canoa_t += desc_canoa;
          valor_total_t += valor_total;
        });

        $this.tablaDetalle.totales.kilos_ingreso =
          this.formatNumero(kilos_ingreso_t);
        $this.tablaDetalle.totales.kilos_neto = this.formatNumero(kilos_neto_t);
        $this.tablaDetalle.totales.valor_total =
          this.formatNumero(valor_total_t);

        this.form.compra = this.formatNumero(valor_total_t);
        let fomento = 0;
        let sel_asociado = this.form.asociado;

        if (sel_asociado == 1) {
          fomento =
            (valor_total_t * this.parametros[0].farroc_rep.trim()) / 100;
          fomento = fomento.toFixed(0);
        }
        this.fomento = fomento;

        this.form.farrocero = this.formatNumero(fomento);

        // unit_desc = this.parametros[0].descargue_rep.trim();

        let descargue = desc_mol_t + desc_canoa_t;

        this.form.descargue = this.formatNumero(descargue);

        this.total_compra = valor_total_t;
        let cargue = this.form.cargue ? this.form.cargue.replace(/,/g, "") : 0;
        let impuesto = this.form.textimpuesto
          ? this.form.textimpuesto.replace(/,/g, "")
          : 0;
        let totdctos =
          parseInt(this.fomento) +
          parseInt(cargue) +
          parseInt(descargue) +
          parseInt(impuesto);

        let valor_total_facturas_pend = this.valor_total_facturas_pend || 0;
        this.form.descuentos = this.formatNumero(
          totdctos + valor_total_facturas_pend
        );
        let neto = valor_total_t - totdctos;
        this.form.neto_cancelar = this.formatNumero(neto);
        this.retencion_change();
        this.iva_change();
      },
      { deep: true }
    );
  },
  methods: {
    guardar_editar() {
      let array = JSON.parse(JSON.stringify(this.facturasPendientes));      
      let saldo = this.dialogoEditar.saldo;
      let index = this.dialogoEditar.index;
      array[index].valor_cart = saldo;

      this.dialogoEditar.estado = false;
      this.dialogoEditar.saldo = 0;
      this.dialogoEditar.index = null;
      this.$set(this, "facturasPendientes", array);      
    },
    editar_item(item) {
      let index = this.facturasPendientes.indexOf(item);

      this.dialogoEditar.estado = true;
      this.dialogoEditar.saldo = parseFloat(
        item.valor_cart.toString().replace(/,/g, "") || 0
      );
      this.dialogoEditar.index = index;
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    guardar_tabla() {
      this.dialogo_anticipo.estado = false;
    },

    get_facturas() {
      this.comprobante.facturas = null;
      var rut = this.form.proveedor.idrut_pes;
      this.loader = true;

      if (rut) {
        var fecha = this.form.fecha.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        var datosEnvio = sesion + "|" + rut + "|" + fecha + "|";

        post
          .postData({
            url: "Financiero/dlls/PrCartera1J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.numero_cart);
            filtro = filtro.map((el) => {
              el.factura = el.pref_cart.trim() + el.numero_cart.trim();

              return el;
            });

            this.loader = false;
            this.facturasPendientes = filtro;
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
    },
    eliminar_seleccion(item) {
      let array = JSON.parse(JSON.stringify(this.facturasPendientes));

      let index = this.facturasPendientes.indexOf(item);
      array.splice(index, 1);

      this.facturasPendientes = [];
      this.$set(this, "facturasPendientes", array);
    },
    seleccionar_item(item) {
      let copia = JSON.parse(JSON.stringify(item));
      let existe = this.dialogo_anticipo.tabla_seleccionados.find(
        (el) =>
          el.pref_cart.trim() == item.pref_cart.trim() &&
          el.numero_cart.trim() == item.numero_cart.trim()
      );
      if (!existe) this.dialogo_anticipo.tabla_seleccionados.push(copia);
    },
    modificar_item(item) {
      let index = this.dialogo_anticipo.tabla_seleccionados.indexOf(item);
      let valor = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;

      this.dialogo_modificar.index = index;
      this.dialogo_modificar.valor = valor;
      this.dialogo_modificar.estado = true;
    },
    modificar_valor_item() {
      let index = this.dialogo_modificar.index;
      let valor = this.formatNumero(this.dialogo_modificar.valor);

      this.$set(
        this.dialogo_anticipo.tabla_seleccionados[index],
        "valor_cart",
        valor
      );

      this.dialogo_modificar.estado = false;
      this.dialogo_modificar.index = null;
      this.dialogo_modificar.valor = null;
    },

    fenalce_change() {
      let impuesto = this.form.impuesto;
      let valor_total = this.tablaDetalle.totales.valor_total;
      valor_total = parseFloat(valor_total.replace(/\,/g, "")) || 0;

      let vlr_fenalce = 0;
      let factor_fenalce = 0;
      let sel_fenalce = this.form.fenalce;
      let sel_asociado = this.form.asociado;

      if (sel_fenalce == 1) {
        if (sel_asociado == 1) {
          factor_fenalce = 0;
        } else if (sel_asociado == 2) {
          factor_fenalce = 0.75;
        } else if (sel_asociado == 3) {
          factor_fenalce = 0.5;
        } else if (sel_asociado == 4) {
          factor_fenalce = 0.75;
        } else if (sel_asociado == 6) {
          factor_fenalce = 0.5;
        } else {
          factor_fenalce = 0;
        }
      }
      vlr_fenalce = (valor_total * factor_fenalce) / 100;
      this.form.vlrfenalce = this.formatNumero(vlr_fenalce);
      this.form.farrocero = 0;

      let calculo = 0;
      if (impuesto == 1) {
        calculo = valor_total * 0.21;
      } else if (impuesto == 2) {
        calculo = valor_total * 1.5;
      }
      if (impuesto == 9) {
        calculo = 0;
      }
      calculo = (calculo / 100).toFixed(0);
      this.form.textimpuesto = this.formatNumero(calculo);

      this.fomento = 0;
      let fomento = this.fomento;
      let cargue = this.form.cargue ? this.form.cargue.replace(/,/g, "") : 0;
      let descargue = this.form.descargue
        ? this.form.descargue.replace(/,/g, "")
        : 0;
      let totdctos =
        parseInt(fomento) +
        parseInt(cargue) +
        parseInt(descargue) +
        parseInt(vlr_fenalce) +
        parseInt(calculo);

      this.form.cargue = this.formatNumero(cargue);
      let valor_total_facturas_pend = this.valor_total_facturas_pend || 0;
      this.form.descuentos = this.formatNumero(
        totdctos + valor_total_facturas_pend
      );
      let neto = valor_total - (totdctos + valor_total_facturas_pend);
      this.form.neto_cancelar = this.formatNumero(neto);
    },
    retencion_change() {
      this.form.vlrfenalce = 0;
      let impuesto = this.form.impuesto;
      let valor_total = this.tablaDetalle.totales.valor_total;
      valor_total = parseFloat(valor_total.replace(/\,/g, "")) || 0;
      let calculo = 0;
      if (impuesto == 1) {
        calculo = valor_total * 0.21;
      } else if (impuesto == 2) {
        calculo = valor_total * 1.5;
      }
      if (impuesto == 9) {
        calculo = 0;
      }
      calculo = (calculo / 100).toFixed(0);
      this.form.textimpuesto = this.formatNumero(calculo);

      let fomento = this.fomento;
      let cargue = this.form.cargue ? this.form.cargue.replace(/,/g, "") : 0;
      let descargue = this.form.descargue
        ? this.form.descargue.replace(/,/g, "")
        : 0;
      let totdctos =
        parseInt(fomento) +
        parseInt(cargue) +
        parseInt(descargue) +
        parseInt(calculo);

      this.form.cargue = this.formatNumero(cargue);
      this.form.descargue = this.formatNumero(descargue);

      let valor_total_facturas_pend = this.valor_total_facturas_pend || 0;
      this.form.descuentos = this.formatNumero(
        totdctos + valor_total_facturas_pend
      );
      let neto = valor_total - (totdctos + valor_total_facturas_pend);
      this.form.neto_cancelar = this.formatNumero(neto);
      let sel_fenalce = this.form.fenalce ? this.form.fenalce : 9;
      if (sel_fenalce != 9) {
        this.fenalce_change();
      }
    },
    iva_change() {
      this.form.textiva = 0;
      let tarifa = parseFloat(this.form.iva);

      if (tarifa == 9) {
        tarifa = 0;
      }
      let valor_total = this.tablaDetalle.totales.valor_total;
      valor_total = parseFloat(valor_total.replace(/\,/g, "")) || 0;
      let totaliva = parseFloat((valor_total * (tarifa / 100)).toFixed(0));
      this.form.textiva = this.formatNumero(totaliva);

      let fomento = this.fomento;
      let cargue = this.form.cargue ? this.form.cargue.replace(/,/g, "") : 0;
      let bolsa = this.form.textimpuesto
        ? this.form.textimpuesto.replace(/,/g, "")
        : 0;
      let descargue = this.form.descargue
        ? this.form.descargue.replace(/,/g, "")
        : 0;
      let fenalce = this.form.vlrfenalce
        ? this.form.vlrfenalce.replace(/,/g, "")
        : 0;

      let totdctos =
        parseInt(fomento) +
        parseInt(cargue) +
        parseInt(descargue) +
        parseInt(fenalce) +
        parseInt(bolsa);

      this.form.cargue = this.formatNumero(cargue);
      this.form.descargue = this.formatNumero(descargue);

      let valor_total_facturas_pend = this.valor_total_facturas_pend || 0;
      this.form.descuentos = this.formatNumero(
        totdctos + valor_total_facturas_pend
      );

      let neto =
        valor_total + totaliva - (totdctos + valor_total_facturas_pend);
      this.form.neto_cancelar = this.formatNumero(neto);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    agregar_producto() {
      var pesajes = this.articulo_select.producto;
      pesajes.forEach((item, index) => {
        this.tablaDetalle.data.push(item);
      });
      this.dialogo.estado = false;
      this.articulo_select.producto = null;
    },
    cargarParametros() {
      this.loader = true;
      post
        .postData({
          url: "Molinos/dlls/CfparamolJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.parametros = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Parametros",
            estado: true,
          });
        });
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.form.asociado = 1;
          this.disabled.asociado = false;
          this.datosEmpresa = data[0];
          let idempresa = parseInt(this.datosEmpresa.id_empr);
          if (idempresa === 901463277) {
            this.disabled.asociado = false;
            this.form.asociado = 2;
          }
          let punto = this.datosEmpresa.ptoperfil_empr;
          let busqueda = this.agencias.find((el) => el.codigo_agc == punto);
          this.form.punto_fact = busqueda;
          this.get_pesaje();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    async grabar_documento() {
      var data = this.form;
      let t_compra = parseFloat(this.total_compra)
      let t_iva = data.textiva ? data.textiva.replace(/,/g, "") : "0";
      t_iva = parseFloat(t_iva);

      let t_dctos = this.form.descuentos.replace(/,/g, "")
      let neto = (t_compra + t_iva) - t_dctos
      console.log(neto)


      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error(" Selecciona una agencia");
      } else if (neto < 0) {
        this.send_error("Neto a pagar no puede ser Negativo!");
      } else if (!data.proveedor) {
        this.errores.clientes = true;
        this.send_error("Selecciona un proveedor");
      } else if (!data.iva) {
        this.errores.iva = true;
        this.send_error("Selecciona tarifa de Iva");
      } else {
        var detalle = this.tablaDetalle.data;
        this.load.btn_enviar = true;
        this.disabled.btn_enviar = true;
        let cartera = await this.get_cartera();
        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var agencia = data.punto_fact.codigo_agc;
            var consecutivo = data.consecutivo.trim();
            var proveedor = data.proveedor.idrut_pes;
            var fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
            var iva = data.textiva ? data.textiva.replace(/,/g, "") : "0";

            var fomento = data.farrocero
              ? data.farrocero.replace(/,/g, "")
              : "0";
            var fenalce = data.vlrfenalce
              ? data.vlrfenalce.trim().replace(/,/g, "")
              : "0";
            var impto = data.textimpuesto
              ? data.textimpuesto.replace(/,/g, "")
              : "0";
            var cargue = data.cargue ? data.cargue.replace(/,/g, "") : "";
            var descargue = data.descargue
              ? data.descargue.replace(/,/g, "")
              : "0";
            var tipoimpto = data.impuesto;
            var observaciones = data.observaciones || "";
            let sel_asociado = this.form.asociado;

            var datosEnvio =
              sesion +
              "|" +
              agencia +
              "|" +
              consecutivo +
              "|" +
              proveedor +
              "|" +
              fecha +
              "|" +
              fomento +
              "|" +
              fenalce +
              "|" +
              tipoimpto +
              "|" +
              impto +
              "|" +
              cargue +
              "|" +
              descargue +
              "|" +
              observaciones +
              "|" +
              plano +
              "|" +
              cartera +
              "|" +
              iva +
              "|" +
              sel_asociado +
              "|";
            post
              .postData({
                url: "Molinos/dlls/PrLiquida.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.print.comprobante = data[0];
                this.$emit("snack", {
                  color: "success",
                  text: "Liquidación grabada correctamente",
                  estado: true,
                });
                // this.reiniciar_formulario();
                this.get_consecutivo();
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.send_error("Error al grabar Liquidación");
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
          console.log(el)
      
          nuevo.push({
            pesaje: el.nro_pes ? el.nro_pes.trim() : "",
            agencia: el.agencia_pes ? el.agencia_pes.trim() : "",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrLiquidaMol");
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
          .catch((error) => 
           {console.log(error)
       
          reject(error)}
          );
      });
    },
    get_cartera() {
      return new Promise((resolve, reject) => {
        var nuevo = [];

        if (!this.facturasPendientes.length) {
          nuevo.push({
            cuenta: "9999999999",
            prefijo: "",
            factura: "0",
            valor: "0",
            fecha: "0",
          });
        } else {
          this.facturasPendientes.forEach((el, idx) => {
            nuevo.push({
              cuenta: el.cuenta_cart,
              prefijo: el.pref_cart.trim(),
              factura: el.numero_cart.trim(),
              valor: el.valor_cart.replace(/,/g, ""),
              fecha: el.fecha_cart.replace(/-/g, ""),
            });
          });
        }

        var formData = new FormData();
        formData.append("tipo", "PlanoCartera");
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
    print_item() {
      var agencia = this.form.punto_fact.codigo_agc;
      var nro = this.print.comprobante.trim();
      var key = agencia + "|" + nro + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Molinos/dlls/RpLiquida02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          console.log("error si", err);
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_pdf(data) {
      const _this = this;
      var agencia = this.form.punto_fact;
      data.agencia = agencia;
      data.empresa = this.datosEmpresa;

      let registros = data.registros.map((el) => {
        el.producto_liq02 = el.base1_pr
          ? window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            )
          : "";
        return el;
      });

      data.registros = registros;

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        liquidamol(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    abrir_popup() {
      this.dialogo.estado = true;
      this.dialogo.tipo = true;

      var datos_tabla = this.tablaDetalle.data;
      let proveedor = this.form.proveedor || {};
      var filtro = [];
      this.pesajes.forEach((item) => {
        let busqueda = datos_tabla.find(
          (el) => item.nro_pes.trim() == el.nro_pes.trim()
        );
        if (!busqueda && item.idrut_pes === proveedor.idrut_pes)
          filtro.push(item);
      });

      this.pesajes_filtro = filtro;
    },
    reset_form() {
      this.tablaDetalle.data = [];
    },
    reiniciar_formulario() {
      this.tablaDetalle.data = [];
      this.tablaDetalle.totales = [];
      this.facturasPendientes = [];
      this.form.farrocero = "0";
      this.form.textimpuesto = "0";
      this.form.cargue = "0";
      this.form.descargue = "0";
      this.form.compra = "0";
      this.form.descuentos = "0";
      this.form.neto_cancelar = "0";
      this.form.observaciones = "0";
      this.form.textimpuesto = "0";
      this.form.descuentos = "0";
      this.form.neto = "0";
      this.form.textiva = "0";
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
    get_consecutivo() {
      var $this = this;
      this.reiniciar_formulario();
      var agencia = this.form.punto_fact;
      if (agencia) {
        this.load.consecutivo = true;
        var fecha = this.form.fecha.replace(/\-/g, "");
        post
          .postData({
            url: "financiero/dlls/PrConsecutivoJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              "7" +
              "|" +
              agencia.codigo_agc +
              "|" +
              200 +
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
    get_pesaje() {
      var agencia = this.form.punto_fact.codigo_agc;
      var fechaini = this.form.fechaini.replace(/-/g, "");
      var fechafin = this.form.fechafin.replace(/-/g, "");
      let periodoini = fechaini.substring(0, 6);
      let periodofin = fechafin.substring(0, 6);
      let asociado = this.form.asociado;
      this.pesajes = [];

      if (periodoini != periodofin) {
        this.$emit("snack", {
          color: "error",
          text: "Mes inicial debe ser igual a Mes Final",
          estado: true,
        });
      } else {
        post
          .postData({
            url: "Molinos/dlls/PrPesajeJLq.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|" +
              asociado +
              "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            var data_parse = JSON.parse(JSON.stringify(data));
            let descripcion64 = " ";

            data_parse.map((el, index) => {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim()
              );
              if (descripcion64) {
                el.producto_pes = descripcion64;
              }
              return el;
            });
            this.pesajes = data_parse;
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Sin Tiquetes para Liquidar",
              estado: true,
            });
          });
      }
    },
    calcular_final() {
      let fecha = this.form.fechaini;
      let año = fecha.substring(0, 4);
      let mes = fecha.substring(5, 7);
      let dia = fecha.substring(8, 10);

      let today = new Date(año, mes, 0);
      let lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      let f_final = año.concat("-", mes, "-", lastDay);
      this.form.fechafin = f_final;
      this.dialogPickerini = false;
    },
    get_fecha() {
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
      this.form.fechaini = this.$moment().format("YYYY-MM-01");
      this.form.fechafin = this.$moment().format("YYYY-MM-DD");
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
    format_pesaje(val) {
      return `${val.nro_pes.trim()} - ${val.pesocomp_pes.trim()} - ${val.producto_pes.trim()}`;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_operador: function (val) {
      let string = null;
      if (val) {
        string = `${parseInt(val.idrut_pes)} - ${
          val.rut_pes ? val.rut_pes.trim() : ""
        }`;
      }

      return string;
    },
    get_municipios() {
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          var departamentos = data.departamentos;
          var ciudadesTodas = [];
          departamentos.forEach((dep) => {
            let ciudades = dep.municipios;
            ciudadesTodas = ciudadesTodas.concat(ciudades);
          });

          this.ciudades_dian = ciudadesTodas;
        })
        .catch((err) => {
          console.log("Erro ->", err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
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
  },
};
</script>
