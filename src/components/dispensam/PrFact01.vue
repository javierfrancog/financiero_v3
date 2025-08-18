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
              <v-icon size="30" color="blue darken-4 ">mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Facturación Otros</v-list-item-title
              >
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
              <v-col class="d-flex" cols="6" sm="4">
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
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
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

              <!-- <v-col class="d-flex" cols="12" sm="3">
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
                  errores.consecutivo="false;"
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
              <v-col sm="3" cols="4">
                <v-select
                  :items="[
                    { text: 'Contado', value: 1 },
                    { text: 'Crédito', value: 2 },
                    { text: 'Anticipado', value: 3 },
                  ]"
                  label="Forma de pago"
                  hide-details
                  v-model="form.fpago"
                  @change="
                    form.plazo = null;
                    errores.plazo = false;
                    set_diasPlazo();
                  "
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro"
                  hide-details
                  v-model="form.contrato"
                  clearable
                  return-object
                  @change="errores.contrato = false"
                  :error="errores.contrato"
                  ><template v-slot:label>
                    <span class="color-personalizado">Contrato</span>
                  </template></v-autocomplete
                >
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

                <!-- <template v-slot:item.valor="{ item }">
                  {{ item.valor }}
                </template>

                <template v-slot:item.total="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.total.toString().replace(/\,/g, ""))
                    )
                  }}
                </template> -->
                <template v-slot:item.sub_total="{ item }">
                  {{ formatNumero(item.subtotal) }}
                </template>

                <template v-slot:item.ivaTotal="{ item }">{{
                  item.ivaTotal
                }}</template>

                <template v-slot:item.action="{ item }">
                  <!-- <v-tooltip top>
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
                  </v-tooltip> -->
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
                  <td colspan="6" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
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
                :loading="load.imprimir_factura"
                :disabled="disabled.imprimir_factura"
                @click="imprimir_item"
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
                @click="get_dian"
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
          <v-row justify="end">
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
            <v-row>
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
                  v-model="form.ubicacion"
                  :item-text="format_ubicacion"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  v-model="form.molecula"
                  :item-text="format_moleculas"
                  :items="moleculas"
                  clearable
                  return-object
                  @change="get_medicamento"
                  ><template v-slot:label>
                    <span class="color-personalizado">Molécula</span>
                  </template></v-autocomplete
                >
              </v-col>
            </v-row>

            <v-row sm="12" no-gutters>
              <v-col class="d-flex" cols="12">
                <v-autocomplete
                  outlined
                  v-model="form.medicamento"
                  :item-text="format_medicam"
                  :items="medicamentos"
                  clearable
                  return-object
                  ><template v-slot:label>
                    <span class="color-personalizado">Medicamento</span>
                  </template>
                  <template v-slot:item="{ item }">
                    <div
                      :style="{
                        color: parseFloat(item.cant_rep) > 0 ? 'blue' : 'black',
                      }"
                    >
                      {{ format_medicam(item) }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row justify="center"> </v-row>

            <v-row class="d-flex justify-end">
              <v-col sm="4">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  clearable
                  v-model="form.cantidad"
                  @input="input_mask('cantidad', calcularSubtotal)"
                  type="text"
                ></v-text-field>
              </v-col>

              <v-col sm="4">
                <v-text-field
                  label="Vlr unitario"
                  outlined
                  hide-details
                  clearable
                  v-model="form.valorunit"
                  @input="input_mask('valor', calcularSubtotal)"
                ></v-text-field>
              </v-col>
              <v-col sm="4">
                <v-text-field
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="form.total"
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
                  v-model="form.itemobserva"
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
  </v-layout>
</template><style scoped>
.inputBig {
  font-size: 36px !important;
}
</style>


<script>

import post from "../../methods.js";
// import { factura } from "../../_formatos.pdf";
import { factura_titan } from "../../_formatos_disp.js";
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
      medicamentos: [],
      moleculas: [],
      contratos: [],

      error: [],
      correo: [],
      proceso_imp: 0,
      item_mail: 0,
      proforma: 0,
      correodestino: "",
      correodestino2: "",
      correodestino3: "",
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
            value: "tab_descripc",
          },
          {
            text: "Laboratorio",
            align: "left",
            value: "tab_laboratorio",
          },
          {
            text: "Lote",
            align: "left",
            value: "tab_lote",
          },

          {
            text: "Ubicación",
            align: "left",
            value: "tab_descrubica",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "tab_cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "tab_unitario",
          },
          {
            text: "IVA",
            align: "center",
            value: "tab_iva",
          },
          {
            text: " ",
            align: "center",
          },
          {
            text: "Total",
            align: "center",
            value: "tab_total",
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
        cantidad: 0,
        ubicacion: 0,
        valorunit: 0,
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
        contrato: false,
        ccosto: false,
        tasa: false,
        presentacion: false,
      },
      print: {
        comprobante: null,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
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
      titulo_print: null,
      condicion_pdf: true,
      correos: [],
      cufedian: "",
      tablaretefte: [
        { text: "Porcentaje", value: 1 },
        { text: "No Aplica", value: 9 },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_contratos();
    this.get_molecula();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaubica();
    this.form.fpago = 2;
    this.$watch("form.fpago", this.re_calcular);
    this.proforma = 0;

    // this.dialogo.pago = true;
    let nit = parseInt(sessionStorage.Sesion.substring(0, 15));

    if (this.empresa.obligfact_empr == 2) this.condicion_pdf = false;

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.descuentos = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          let total =
            parseFloat(val.tab_total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total += total;

          let iva = parseFloat(val.tab_iva.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total_iva += iva;

          let subtotal =
            parseFloat(val.tab_total.toString().replace(/\,/g, "")) || 0;
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
      this.loader = true;
      this.card.disabled = true;
      this.item_mail = 1;
      var $this = this;
      this.cufedian = "";
      var key = this.print.comprobante;

      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = "Dispensa/dlls/PrFactTitanJ.dll";

      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = null;
          let item_cufe = null;
          let nombre64 = " ";
          let observacion64 = " ";
          factura = data[0];
          let urlEnvio = "https://server3ts.com/financiero/inc/elect.titan.php";
          let detalles = factura.invoice_lines.map((item) => {
            item.description = item.description + item.notes;
            return item;
          });
          observacion64 = window.atob(factura.Observaciones64.trim());

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));

          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.loader = false;
              this.card.disabled = false;
              $this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              this.loader = false;
              this.card.disabled = false;

              this.card.loader = false;
              this.card.disabled = false;

              let mensaje = response.message;
              if (mensaje === "Unauthenticated.") {
                this.loader = false;
                this.card.disabled = false;
                $this.send_error("Sin Registro para Envio");
              } else {
                let cufe =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.XmlDocumentKey;
                let valido =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.IsValid;
                let errordian =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.ErrorMessage.string;

                if (valido == "false") {
                  if (
                    errordian ==
                    "Regla: 90, Rechazo: Documento procesado anteriormente."
                  ) {
                    this.grabar_cufe(item_cufe, cufe);
                  } else {
                    this.send_error(errordian);
                  }
                } else {
                  this.grabar_cufe(item_cufe, cufe);
                }
              }

              if (response.status === "error") {
                this.loader = false;
                let errores = response.document.errors.join("<br>");
                this.send_error(errores);
                this.card.loader = false;
                this.card.disabled = false;
              } else {
                let cufe = response.document.uuid;
                this.grabar_cufe(item_cufe, cufe);
              }
            });
        });
    },
    async grabar_cufe(res, cufe) {
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = `${sessionStorage.Sesion}|0|${this.print.comprobante}${cufe}|${fecha}|`;

      return await post
        .postData({
          url: "Ptovta/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.card.disabled = false;
          if (this.empresa.provfact_empr == "5") {
            this.send_mail();
            this.$emit("snack", {
              color: "success",
              text: "Factura enviada a la Dian ",
              estado: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    async send_mail() {
      const $this = this;
      let item = null;
      // this.card.loader = true;
      // this.card.disabled = true;
      this.loader = true;
      const blob = await this.print_item(item, true);
      const pdfBase64 = await this.blobToBase64(blob);
      let pdfb64 = pdfBase64.split(",")[1];

      if (this.empresa.provfact_empr == "5") {
        let urlEnvio = null;
        let factura = this.print.comprobante.split("|");
        let prefijo = factura[1].trim();
        let numero = parseFloat(factura[2]);
        let idempresa = parseFloat(this.empresa.id_empr);
        let correodestino = this.correodestino ? this.correodestino : "";
        let correodestino2 = this.correodestino2
          ? this.correodestino2
          : "facturae@titansoluciones.net";
        let correodestino3 = this.correodestino3
          ? this.correodestino3
          : "facturae@titansoluciones.net";
        let token = this.empresa.tokentitan_empr;

        this.correo.unshift({
          prefix: prefijo,
          number: "" + numero + "",
          showacceptrejectbuttons: false,
          email_cc_list: [
            {
              email: correodestino,
            },
            {
              email: correodestino2,
            },
            {
              email: correodestino3,
            },
          ],
          base64graphicrepresentation: pdfb64,
        });

        urlEnvio = "https://server3ts.com/financiero/inc/email_fact.php";

        var formData = new FormData();
        formData.append("token", token);
        formData.append("correo", JSON.stringify(this.correo[0]));
        fetch(urlEnvio, {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            this.card.loader = false;
            this.loader = false;
            this.card.disabled = false;
            this.$emit("snack", {
              color: "orange",
              text: "Correo enviado con éxito",
              estado: true,
            });
          })
          .catch((error) => {
            console.log("error", error);
            this.loader = false;
            this.card.loader = false;
            this.card.disabled = false;
            $this.send_error(error);
          })
          .then((data) => {
            this.loader = false;
            $this.card.loader = false;
            $this.card.disabled = false;
          });
      }
    },
    get_contratos() {
      post
        .postData({
          url: "Dispensa/dlls/PrEnccontratoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.contratos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    validar_cliente() {
      this.tablaDetalle.data = [];
      this.input_articulo = true;

      let cliente = this.form.clientes;
      this.form.observaciones = this.empresa.observacion_empr.trim();
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

      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de facturación");
      } else if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Selecciona un prefijo de facturación");
      } else if (!data.contrato) {
        this.errores.contrato = true;
        this.send_error("Selecciona un contrato");
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
      } else if (data.moneda == 2 && !data.tasa) {
        this.errores.tasa = true;
        this.send_error("Debe asignar tasa de cambio");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let fecha = data.fecha.replace(/\-/g, "");
      let puntoFact = data.punto_fact.codigo_agc;
      let prefijo = data.pref_fact.prefijo_resd;
      let consecutivo = data.consecutivo;
      let cliente = data.clientes.identificacion_rut;
      let formaPago = data.fpago;
      let diasPlazo = formaPago != 2 ? "0" : data.plazo;
      let medioPago = data.mpago || "0";
      let observaciones = data.observaciones || "";
      let contrato = data.contrato.nro_rep;

      let tablaOrigen = {};
      this.tablaDetalle.data.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");

        let ubicacion = item.tab_ubicacion;
        let codigo = item.tab_codigo.trim();
        let cantidad = parseFloat(item.tab_cantidad);
        let valor = parseFloat(item.tab_total);
        let iva = item.tab_iva;
        let lote = item.tab_lote;
        let observacion = item.tab_observacion || "";
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${ubicacion}|${codigo}|${cantidad}|${valor}|${iva}|${lote}|${observacion}|`;
      });

      let importarhtml =
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
        medioPago +
        "|" +
        contrato +
        "|" +
        observaciones +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrFact01.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Factura Registrada Correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = JSON.parse(JSON.stringify(data));

          this.disabled.imprimir = false;
          this.load.imprimir = false;
          let comprobante = data[0];
          this.comprobante = comprobante;
          this.get_consecutivo();
          this.clear_form();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    reset_formulario() {
      this.clear_form();
      this.form.clientes = null;
      this.tablaDetalle.data = [];
      this.form.fpago = 2;
      this.form.plazo = null;
      this.form.mpago = null;
      this.form.porcrtefte = "";
      this.form.retencion = null;

      // this.form.correo = null;
      // (this.correos = []), (this.form.observaciones = null);
      if (this.empresa.listaspr_empr == "2") {
        this.productos = [];
      }
      this.form.doc_origen = 0;

      this.get_consecutivo();
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
    // get_json_dian(item) {},
    imprimir_item(item) {
      this.proceso_imp = 1;
      this.print_item(item);
    },

    async print_item(item, getBase64) {
      this.card.loader = true;
      this.card.disabled = true;
      let factura = this.print.comprobante.split("|");
      let prefijo = factura[1];
      let nrofact = factura[2];
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);

      var agencia = this.form.punto_fact.codigo_agc;
      var key = agencia + "|" + prefijo + "|" + nrofact + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Dispensa/dlls/PrFact01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          this.card.loader = false;
          this.card.disabled = false;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          const logo = await this.pdfs.getBase64(logo_src);
          data.logo = logo;
          return await factura_titan(data);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    get_plano(detalle) {
      let tablaOrigen = {};
      this.detalle.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");

        let ubicacion = item.tab_ubicacion;
        let codigo = item.tab_codigo.trim();
        let cantidad = parseFloat(item.tab_cantidad);
        let valor = parseFloat(item.tab_total);
        let iva = item.tab_iva.trim();
        let lote = item.tab_lote.trim();
        let observacion = item.tab_observacion || "";
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${ubicacion}|${codigo}|${cantidad}|${valor}|${iva}|${lote}|${observacion}|`;
      });
    },
    format_medicam(val) {
      return `${val.descripprod_rep.trim()} - ${val.laboratorio_rep.trim()}-Lote: ${val.lote_rep.trim()} -Saldo: ${val.cant_rep.trim()}`;
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
      } else {
        this.send_error("Debes seleccionar un cliente");
      }
    },
    get_saldo() {
      let medicamento = this.form.medicamento.codigo.trim();
      let agencia = sessionStorage.Sede;
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.items_tabla_saldos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpSaldos3J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            medicamento +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Saldos",
            estado: true,
          });
        });
    },
    agregar_servicio() {
      let articulo = this.form.medicamento;
      let ubicacion = this.form.ubicacion.codigo_ubic;
      let descrubica = this.form.ubicacion.descrip_ubic;
      let cantidad = parseFloat(this.form.cantidad);
      let valorunit = parseFloat(this.form.valorunit);

      if (!articulo) {
        this.send_error("Debes seleccionar un producto");
      } else if (!ubicacion) {
        this.send_error("Seleccione una ubicación");
      } else if (!cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 270) {
        this.send_error("La observación no puede exceder 270 carácteres");
      } else {
        let codigo = this.form.medicamento.codprod_rep;
        let descripc = this.form.medicamento.descripprod_rep;
        let laboratorio = this.form.medicamento.laboratorio_rep;
        let lote = this.form.medicamento.lote_rep;
        let iva = 0;        
        let tot_prod = valorunit

        let tariva = parseFloat(this.form.medicamento.tariva_rep)
        console.log("Titan_2",tariva)

        if (tariva > 0){
          let base_iva = 0
          tariva = 1 + (tariva / 100)
          base_iva = (valorunit / tariva).toFixed(2)
          iva = (tot_prod - base_iva).toFixed(2)
          valorunit = tot_prod - iva
        }

        let total = (cantidad * tot_prod);
        let observacion = this.form.itemobserva
          ? this.form.itemobserva.trim()
          : "";
        this.tablaDetalle.data.push({
          tab_codigo: codigo,
          tab_descripc: descripc,
          tab_laboratorio: laboratorio,
          tab_lote: lote,
          tab_ubicacion: ubicacion,
          tab_descrubica: descrubica,
          tab_cantidad: cantidad,
          tab_unitario: valorunit,
          tab_iva: iva,
          tab_total: total,
          tab_observacion: observacion,
        });
        this.dialogo.estado = false;
        this.clear_item_form();
      }
      // }
    },
    change_articulo_modal() {
      var empresa = this.empresa;
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
      let cantidad = parseFloat(this.form.cantidad) || 0;
      let valorunit = parseFloat(this.form.valorunit);
      let total = cantidad * valorunit;
      this.form.total = this.formatNumero(total);
      this.error.precio = 0;
      console.log("calcularSubtotal");
      let vlriva_prod = 0;
      let vlrimpoc_prod = 0;
      let subtotal = 0;
      let subValor = 0;
      let totalprod = 0;
    },
    refrescar() {
      this.get_Clientes();
      this.get_molecula();
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
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_productos(val) {
      return `${val.descripcion_pr}`;
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
          this.get_notifica();
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
    get_medicamento() {
      let molecula = this.form.molecula.cod_rep;
      let ubicacion = this.form.ubicacion.codigo_ubic;
      let fecha = this.form.fecha.replace(/-/g, "");

      this.form.medicamento = null;
      this.medicamentos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpSaldoMolJ.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            ubicacion +
            "|" +
            molecula +
            "|" +
            fecha +
            "|" +
            "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.medicamentos = data;
        })
        .catch((err) => {
          this.loader = false;
          this.load.servicios = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Medicamentos",
            estado: true,
          });
        });
    },
    get_notifica() {
      post
        .postData({
          url: "financiero/dlls/PrNotificaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          // console.log(data)
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
      post
        .postData({
          url: "Dispensa/dlls/PrFacturaN.dll",
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
    clear_item_form() {
      this.form.medicamento = null;
      this.form.cantidad = null;
      this.form.valorunit = null;
    },
    clear_form() {
      this.tablaDetalle.data = [];
    },

    modificar_producto() {
      let articulo = this.form.medicamento;
      let ubicacion = this.form.ubicacion.codigo_ubic;
      let descrubica = this.form.ubicacion.descrip_ubic;
      let cantidad = parseFloat(this.form.cantidad);
      let valorunit = parseFloat(this.form.valorunit);
      let codigo = this.form.medicamento.codigo;
      let descripc = this.form.medicamento.descripcion;
      let laboratorio = this.form.medicamento.desclaborat_rep;
      let lote = "";
      let iva = 0;
      let total = cantidad * valorunit;

      let index = this.edit_index;
      console.log(index);

      this.tablaDetalle.data.tab_codigo[index] = codigo;
      this.tablaDetalle.data.tab_descripc[index] = descripc;
      this.tablaDetalle.data.tab_laboratorio[index] = laboratorio;
      this.tablaDetalle.data.tab_ubicacion[index] = ubicacion;
      this.tablaDetalle.data.tab_descrubica[index] = descrubica;
      this.tablaDetalle.data.tab_cantidad[index] = cantidad;
      this.tablaDetalle.data.tab_unitario[index] = valorunit;
      this.tablaDetalle.data.tab_iva[index] = iva;
      this.tablaDetalle.data.tab_total[index] = total;

      this.dialogo.estado = false;
      this.clear_form();
    },

    edit_item(item) {
      console.log(item);
      this.form.valorunit = item.tab_unitario;
      this.form.cantidad = item.tab_cantidad;
      this.form.total = item.tab_total;
      this.form.ubicacion = item.tab_ubicacion;
      this.form.molecula.cod_rep = item.tab_codigo.substring(0, 18);

      this.dialogo.estado = true;
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
      this.calcular_retencion();
    },
    get_dian() {
      // this.loader = true;
      // this.card.disabled = true;
      var id_factura = this.cufedian;
      var $this = this;

      var urlEnvio = null;
      let itemprint = "";
      if (this.empresa.provfact_empr == "5") {
        this.print_item(itemprint);
      } else {
        if (this.empresa.felectronica_empr == "0")
          urlEnvio = "https://server3ts.com/facturae/consulta_pdf.php";
        else urlEnvio = "https://server3ts.com/facturae/consulta_pdf.prod.php";

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

    get_molecula() {
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.moleculas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agrp_Moleculas",
            estado: true,
          });
        });
    },
    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    format_contrato(val) {
      return val.descripcion_rep + " - " + val.detalle_rep;
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