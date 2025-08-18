<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-boom-gate-down</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Salida Vehiculos</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Fecha Entrada"
                outlined
                v-model="form.fechaentr"
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Fecha Salida"
                outlined
                v-model="form.fecha"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  clearable
                  outlined
                  return-object
                  @change="
                    get_pesaje();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Consecutivo"
                  v-model="form.consecutivo"
                  :items="pesajes"
                  :item-text="format_consecutivo"
                  item-value="consecut_pes"
                  hide-details
                  clearable
                  outlined
                  @change="cargar_datos"
                  return-object
                  :error="errores.consecutivo"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="10" sm="2">
                <v-text-field
                  label="Placa"
                  v-model="form.placa"
                  hide-details
                  outlined
                  clearable
                  disabled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="10" sm="5">
                <v-text-field
                  label="Tipo Operación"
                  v-model="form.tipo_oper"
                  hide-details
                  outlined
                  disabled
                >
                </v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Documento"
                  outlined
                  v-model="form.documento"
                  hide-details
                  disabled
                  type="text"
                  :error="errores.documento"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Ciudad de Origen"
                  v-model="form.ciudad"
                  outlined
                  hide-details
                  disabled
                  type="text"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="5">
                <v-text-field
                  label="Cliente/Proveedor"
                  v-model="form.proveedor"
                  outlined
                  hide-details
                  disabled
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="5">
                <v-text-field
                  label="Conductor"
                  v-model="form.conductor"
                  outlined
                  hide-details
                  disabled
                  type="text"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex mt-1">
              <v-col cols="3">
                <v-text-field
                  label="Peso Entrada"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.pentra"
                  height="80"
                  class="inputPeso"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Destara"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.destara"
                  @keyup="calcular_peso"
                  height="80"
                  class="inputPeso"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Empaques"
                  outlined
                  hide-details
                  v-model="form.empaques"
                  height="80"
                  type="text"
                  @keyup="calcular_peso"
                  class="inputPeso"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  label="Peso Neto"
                  outlined
                  hide-details
                  v-model="form.pneto"
                  height="80"
                  disabled
                  type="text"
                  class="inputPeso"
                ></v-text-field>
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
                item-key="codigo"
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.idItem="{ item }">
                  {{ tablaDetalle.data.indexOf(item) + 1 }}
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
                        @click="edit_item(item)"
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
                    <span>Eliminar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </div>

            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Proceso</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-text-field
                  label="Cant.Bultos"
                  outlined
                  hide-details
                  autocomplete="off"
                  :value="formatNumero(form.bultos)"
                  @input="input_mask('bultos')"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Desc.Molino/Kilo"
                  outlined
                  hide-details
                  v-model="form.desckg"
                  @keyup="calcular_desckg"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Tot.Descargue"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.tdesc)"
                  @input="input_mask('tdesc')"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Flete Molino x Kilo"
                  outlined
                  hide-details
                  v-model="form.fletekg"
                  @keyup="calcular_fletekg"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Total Flete"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.tflete)"
                  @input="input_mask('tflete')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-text-field
                  label="Desc.Canoas/Kilo"
                  outlined
                  hide-details
                  v-model="form.desckgcan"
                  @keyup="calcular_desckgcan"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Tot.Descargue"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.tdescan)"
                  @input="input_mask('tdescan')"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Flete Canoas/Kilo"
                  outlined
                  hide-details
                  v-model="form.fletekgcan"
                  @keyup="calcular_fletekgcan"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Tot.Flete"
                  outlined
                  hide-details
                  disabled
                  :value="formatNumero(form.tfletecan)"
                  @input="input_mask('tfletecan')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mt-1 justify-center">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Humedad"
                  v-model="form.humedad"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                  @change="errores.humedad = false"
                  :error="errores.humedad"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Impureza"
                  v-model="form.impureza"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                  @change="errores.impureza = false"
                  :error="errores.impureza"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano Rojo"
                  v-model="form.grojo"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>

              <v-col cols="1">
                <v-divider color="blue" vertical></v-divider>
              </v-col>
              <v-col cols="2" class="mt-4" >
                <v-btn
                  @click="calcular_kilos"
                  depressed
                  color="orange"
                  class="white--text"
                  large
                  block
                >
                  Calcular Kilos
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Kilos Compra"
                  outlined
                  hide-details
                  v-model="form.kcompra"
                  disabled
                  height="80"
                  type="text"
                  class="inputPeso"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex mt-1 justify-left">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano entero"
                  v-model="form.gentero"
                  outlined
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano partido"
                  v-model="form.gpartido"
                  outlined
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano Dañado"
                  v-model="form.gdañado"
                  outlined
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-divider color="blue" vertical></v-divider>
              </v-col>

            </v-row>


            <v-row class="d-flex mt-1 justify-left">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano Nuez Entera"
                  v-model="form.gnentera"
                  outlined
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Temperatura"
                v-model="form.temperatura"
                outlined
                hide-details
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-divider color="blue" vertical></v-divider>
              </v-col>

          </v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                clearable
                label="Observaciones"
                v-model="form.observaciones"
                hide-details
              >
              </v-textarea>
            </v-col>
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
                @click="validar_documento()"
                >Grabar Documento</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="indigo"
                class="white--text"
                block
                large
                depressed
                @click="print_item()"
                >Imprimir Documento
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
                  suffix="$"
                  v-model="articulo_select.cantidad"
                >
                </v-text-field>
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
                >Agregar
              </v-btn>
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                @click="modificar_producto"
                depressed
                >Modificar Producto
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style>
.inputPeso {
  font-size: 46px !important;
}

.inputPeso input {
  max-height: initial !important;
  font-size: 60px !important;
}
</style>

<script>

import post from "../../methods.js";
import { pesaje_salida } from "../../_formatos_mol.js";

export default {

  data() {
    return {
      agencias: [],
      pesajes: [],
      ubica: [],
      productos: [],
      consec_print: null,

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
            text: "Kilos",
            align: "center",
            value: "kilos",
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
      articulo_select: {
        barras: null,
        producto: null,
        lista: null,
        iva: 0,
        valor: 0,
        cantidad: 0,
        facturadas: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
        ubicaciones: [],
        observacion: null,
      },
      form: {
        observaciones: null,
        ubicacion: null,
        pneto: null,
        punto_fact: null,
        tflete: null,
        tdesc: null,
        tfletecan: null,
        tdescan: null,
      },
      dialogo: {
        estado: false,
        tipo: false,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        btn_enviar: false,
      },
      errores: {
        punto_fact: false,
        consecutivo: false,
        impureza: false,
        humedad: false,
      },
      print: {
        comprobante: null,
      },
      input_articulo: false,
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
    this.get_empresa();
    this.get_fecha();
    this.cargarTablaAg();
    this.get_listas2();

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        // $this.tablaDetalle.totales.total_descuentos = 0;
        $this.tablaDetalle.totales.cantidad = 0;
        $this.tablaDetalle.totales.kilos = 0;

        e.forEach((val) => {
          var cantidad = parseFloat(val.cantidad.replace(/\,/g, "")) || 0;
          var kilos = parseFloat(val.kilos.replace(/\,/g, "")) || 0;

          $this.tablaDetalle.totales.cantidad += cantidad;
          $this.tablaDetalle.totales.kilos += kilos;
        });
      },
      { deep: true }
    );
  },
  methods: {
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    abrir_popup() {
      if (this.form.consecutivo) {
        this.dialogo.estado = true;
        this.dialogo.tipo = true;
        var destara = parseFloat(this.form.destara) || 0;
        this.articulo_select.cantidad = destara;
      } else {
        this.send_error("Debes seleccionar un tiquete");
      }
    },
    get_listas2() {
      post
        .postData({
          url: "Financiero/dlls/CfcarglistasJ.dll",
          data: sessionStorage.Sesion + "|1|" + "|1|" + "|",
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
                el.base5_pr.trim() +
                el.base6_pr.trim() +
                el.base7_pr.trim() +
                el.base8_pr.trim() +
                el.base9_pr.trim() +
                el.base10_pr.trim()
            );
            if (descripcion64) {
              el.descripcionpr_list = descripcion64;
            }
            return el;
          });
          this.productos = data_parse;

          // this.productos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar lista de precios",
            estado: true,
          });
        });
    },
    calcular_kilos() {
      let detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
      let humedad = this.form.humedad || 0;
      let impureza = this.form.impureza || 0;
      let grano_partido = 0;
      let grano_yeso = 0;
      let grano_rojo = this.form.grojo || 0;
      let cliente = parseFloat(this.form.consecutivo.cliente_rep.replace(/\,/g, ""));
      let asociado = detalle[0].asociado || 0;

      if (humedad < 1) {
        this.errores.humedad = true;
        this.send_error("Debe Registrar humedad!");
      } else if (impureza < 1) {
        this.errores.impureza = true;
        this.send_error("Debe Registrar Impureza!");
      } else if (!this.form.destara) {
        this.send_error("Debe Registrar la destara!");
      } else {
        let peso_neto = this.form.pneto.replace(/\,/g, "") || 0;
        post
          .postData({
            url: "Molinos/dlls/PrLaborat2.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              peso_neto +
              "|" +
              humedad +
              "|" +
              impureza +
              "|" +
              grano_partido +
              "|" +
              asociado +
              "|" +
              grano_rojo +
              "|" +
              grano_yeso +
              "|" +
              cliente +
              "|",
            method: "",
          })
          .then((data) => {
            let copia = JSON.parse(JSON.stringify(this.form));
            copia.kcompra = data[0];
            this.form = copia;
            this.disabled.btn_enviar = false;
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al calcular Tabla",
              estado: true,
            });
          });
      }
    },
    print_item(item) {
      var fecha = new Date().getFullYear(); //item.fechacorta_pes.substr(0, 4);
      var agencia = this.form.punto_fact.codigo_agc;
      var key = agencia + "|" + this.consec_print + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Molinos/dlls/RPesaje02J.dll",
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
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
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
    generar_pdf(data) {
      var _this = this;
      var agencia = this.form.punto_fact.codigo_agc;
      data.agencia = agencia;
      data.empresa = _this.datosEmpresa;
      let registros = data.registros.map((el) => {
        el.agencia_pes_desc = _this.getAgencia(el.agencia_pes);
        el.producto_pes = el.base1_pr
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
        pesaje_salida(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    getAgencia(codAgencia) {
      var msg = "";
      this.agencias.forEach((el) => {
        if (el.codigo_agc === codAgencia) {
          msg = el.descripcion_agc;
        }
      });
      return msg;
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
    agregar_servicio() {
      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else if (articulo.observacion && articulo.observacion.length > 90) {
        this.send_error("La observación no puede exceder 90 carácteres");
      } else {
        var item = JSON.parse(JSON.stringify(articulo));

        let cantidad = item.cantidad;
        let codigo_producto = item.producto.codigopr_list;
        let descripcion = item.producto.descripcionpr_list;
        let unidad = item.producto.unidad_list.trim();

        let item_tabla = {
          cantidad,
          codigo_producto,
          descripcion,
          kilos: unidad * cantidad,
          asociado: item.producto.asociado_list,
        };
        this.tablaDetalle.data.push(item_tabla);

        this.dialogo.estado = false;
        this.clear_form();
      }
    },
    format_productos(val) {
      return `${val.codigopr_list} - ${
        val.descripcion_pr
          ? val.descripcion_pr.trim()
          : val.descripcionpr_list.trim()
      }`;
    },
    edit_item(item) {
      this.dialogo.estado = true;
      var articulo = JSON.parse(JSON.stringify(item));

      let producto = this.productos.find(
        (el) => el.codigopr_list.trim() === articulo.codigo_producto.trim()
      );

      articulo.producto = producto;
      articulo.cantidad = articulo.cantidad.trim();
      articulo.kilod = articulo.kilos.trim();

      this.articulo_select = articulo;
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },

    validar_documento() {
      let tipoperacion = this.pesajes[0].tipoper_rep;
      let tperacion = this.form.consecutivo.tipoper_rep.substring(0, 1);

      if (tipoperacion == "E20" || tipoperacion == "E21") {
        if (!this.form.kcompra && tperacion == "E") {
          this.send_error("Debe calcular Kilos");
        } else {
          this.grabar_documento();
        }
      } else {
        this.grabar_documento();
      }
    },

    grabar_documento() {
      var data = this.form;
      let tipoOperacion = data.consecutivo.tipoper_rep.substring(0, 1);
      let tara = parseFloat(data.destara.replace(/\,/g, "")) || "0";
      let pesoentrada = parseFloat(data.pentra.replace(/\,/g, "")) || "0";
      pesoentrada = pesoentrada - tara;

      if (!data.destara) {
        this.send_error("Debe Registrar la destara!");
      } else if (!data.consecutivo.tipoper_rep === "S04") {
        this.send_error("Debe Calcular laboratorio!");
      } else if (tipoOperacion.trim() === "E" && pesoentrada < 1) {
        this.send_error("Error en Destare");
      } else if (tipoOperacion.trim() === "S" && pesoentrada > 1) {
        this.send_error("Error en Destare");
      } else {
        let detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
        let detalle_format = detalle.map((el) => {
          el.cantidad = parseFloat(el.cantidad.replace(/\,/g, "")) || 0;
          el.kilos = parseFloat(el.kilos.replace(/\,/g, "")) || 0;

          return el;
        });

        this.get_plano(detalle_format).then((plano) => {
          this.format_envio(data, plano);
        });
      }
    },
    get_plano(detalle) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("tipo", "PrSalidavh");
        formData.append("data", JSON.stringify(detalle));

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
    format_envio(data, plano) {
      this.card_estado = true;
      var agencia = data.punto_fact.codigo_agc;
      var consecutivo = data.consecutivo.consecutivo_rep.trim();
      var fecha = data.fecha.replace(/\-/g, "");
      var humedad = data.humedad ? data.humedad : "0";
      var impureza = data.impureza ? data.impureza : "0";
      var grojo = data.grojo ? data.grojo : "0";
      var gentero = data.gentero ? data.gentero : "0";
      var gpartido = data.gpartido ? data.gpartido : "0";
      var gdañado = data.gdañado ? data.gdañado : "0";
      var gnentera = data.gnentera ? data.gnentera : "0";
      var temperatura = data.temperatura ? data.temperatura : "0";

      var gyesado = "0";
      var kcompra = data.kcompra
        ? data.kcompra.replace(/,/g, "").trim()
        : data.pneto.replace(/\,/g, "") || 0;
      var destara = parseFloat(data.destara.replace(/\,/g, "")) || "0";
      var fletemol = data.tflete || "0";
      var descmol = data.tdesc || "0";
      var fletecan = data.tfletecan || "0";
      var desccan = data.tdescan || "0";
      var empaques = data.empaques || "0";
      var bultos = data.bultos || 0;

      var descripcion = data.observaciones || "";
      let datos = {
        url: "Molinos/dlls/PrPesajefin.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          consecutivo +
          "|" +
          destara +
          "|" +
          humedad +
          "|" +
          impureza +
          "|" +
          gpartido +
          "|" +
          kcompra +
          "|" +
          descripcion +
          "|" +
          plano +
          "|" +
          grojo +
          "|" +
          gyesado +
          "|" +
          fletemol +
          "|" +
          descmol +
          "|" +
          fletecan +
          "|" +
          desccan +
          "|" +
          empaques +
          "|" +
          bultos +
          "|" +
          gentero +
          "|" +
          gdañado +
          "|" +
          gnentera +
          "|" +
          temperatura +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.reiniciar_formulario();
          this.get_pesaje();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
          console.log("Error al grabar Registro", error);
        });
    },
    calcular_peso() {
      var pbruto = parseFloat(this.form.pentra.replace(/\,/g, "")) || 0;
      var destara = parseFloat(this.form.destara) || 0;
      var empaque = parseFloat(this.form.empaques) || 0;
      var subtotal = 0;

      if (pbruto < destara) subtotal = destara - pbruto;
      else subtotal = pbruto - destara - empaque;

      setTimeout(() => {
        let format = this.formatNumero(subtotal);
        this.tablaDetalle.data[0].cantidad = format;
        this.tablaDetalle.data[0].kilos = format;
        this.$set(this.form, "pneto", format);
      }, 100);
    },
    calcular_desckg() {
      var pneto = parseFloat(this.form.pneto.replace(/\,/g, "")) || 0;
      var unitdesc = parseFloat(this.form.desckg) || 0;
      var vlrdesckg = 0;
      
      if (pneto > 0) vlrdesckg = pneto * unitdesc;
      else vlrdesckg = "";
     
      this.form.tdesc = vlrdesckg;
    },
    calcular_fletekg() {
      var pneto = parseFloat(this.form.pneto.replace(/\,/g, "")) || 0;
      var unitflete = parseFloat(this.form.fletekg) || 0;
      var vlrfletekg = 0;

      if (pneto > 0) vlrfletekg = pneto * unitflete;
      else vlrfletekg = "";
      this.form.tflete = vlrfletekg;
    },
    calcular_desckgcan() {
      var pneto = parseFloat(this.form.pneto.replace(/\,/g, "")) || 0;
      var unitdesc = parseFloat(this.form.desckgcan) || 0;
      var vlrdesckg = 0;

      if (pneto > 0) vlrdesckg = pneto * unitdesc;
      else vlrdesckg = "";

      this.form.tdescan = vlrdesckg;
    },
    calcular_fletekgcan() {
      var pneto = parseFloat(this.form.pneto.replace(/\,/g, "")) || 0;
      var unitflete = parseFloat(this.form.fletekgcan) || 0;
      var vlrfletekg = 0;

      if (pneto > 0) vlrfletekg = pneto * unitflete;
      else vlrfletekg = "";
      this.form.tfletecan = vlrfletekg;
    },
    format_consecutivo(item) {
      return (
        item.consecutivo_rep.trim() +
        " - " +
        item.placa_rep.trim() +
        " - " +
        item.nombre_rep.trim()
      );
    },
    reiniciar_formulario() {
      this.form.consecutivo = null;
      this.form.placa = null;
      this.form.tipo_oper = null;
      this.form.documento = null;
      this.form.ciudad = null;
      this.form.proveedor = null;
      this.form.conductor = null;
      this.form.pentra = null;
      this.form.destara = null;
      this.form.empaques = null;
      this.form.pneto = null;
      this.form.bultos = null;
      this.form.desckg = null;
      this.form.tdesc = null;
      this.form.fletekg = null;
      this.form.tflete = null;
      this.form.desckgcan = null;
      this.form.tdescan = null;
      this.form.fletekgcan = null;
      this.form.tfletecan = null;
      this.form.humedad = null;
      this.form.impureza = null;
      this.form.grojo = null;
      this.form.kcompra = null;
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
    get_fecha() {
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
    },
    cargar_datos() {
      this.consec_print = this.form.consecutivo.consecutivo_rep.trim();
      var item = this.form.consecutivo;
      this.form.fechaentr = item.fecha_rep.trim();
      this.form.placa = item.placa_rep;
      this.form.tipo_oper = item.nombredoc_rep;
      this.form.documento = item.docext_rep.trim();
      this.form.ciudad = item.descrciudad_rep.trim();
      this.form.proveedor = item.nombre_rep.trim();
      this.form.conductor = item.descrconductor_rep.trim();
      this.form.pentra = this.formatNumero(item.pesoent_rep.trim());
      this.form.bultos = item.bultos_rep.replace(/\,/g, "");
      this.form.destara = null;
      // this.disabled.btn_enviar = true;

      let nuevo_detalle = [];
      item.registros.pop();

      // this.tablaDetalle.data = item.registros;

      item.registros.forEach((el, index) => {
        let obj = {
          descripcion: el.producto_pes.trim(),
          cantidad: el.cantidad_pes.trim(),
          codigo_producto: el.codigo_pes,
          // kilos: el.pesoneto_pes.trim(),
          kilos: "0",
          asociado: el.asociado_pes,
        };
        if (obj.codigo_producto.trim() != "9999") nuevo_detalle.push(obj);
      });
      this.tablaDetalle.data = nuevo_detalle;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    get_pesaje() {
      var $this = this;
      this.pesajes = [];
      var agencia = this.form.punto_fact;
      if (agencia) {
        this.load.consecutivo = true;
        post
          .postData({
            url: "Molinos/dlls/Prpesaje02J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              "0" +
              "|" +
              "2" +
              "|",
            method: "POST",
          })
          .then((data) => {
            this.load.consecutivo = false;
            let dataParse = JSON.parse(JSON.stringify(data));
            data = dataParse.map((item) => {
              item.registros = item.registros.map((el) => {
                el.producto_pes = el.base1_pr
                  ? window.atob(
                      el.base1_pr.trim() +
                        el.base2_pr.trim() +
                        el.base3_pr.trim() +
                        el.base4_pr.trim() +
                        el.base5_pr.trim()
                    )
                  : el.producto_pes;
                return el;
              });

              return item;
            });

            this.pesajes = data;
            this.form.pneto = null;
          })
          .catch((err) => {
            this.load.consecutivo = false;
            console.error("Error: ", err);
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar pesajes: " + err.Mensaje[0].Error,
              estado: true,
            });
          });
      }
    },
    clear_form() {
      this.articulo_select = {
        valor: 0,
        cantidad: 0,
        subtotal: 0,
      };
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
