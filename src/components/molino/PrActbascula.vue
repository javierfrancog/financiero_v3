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
                >Actualiza Pesaje</v-list-item-title
              >
            </v-list-item-content>
            <v-col cols="3">
              <v-menu
                v-model="pickeFechaIni"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                @change="get_pesaje()"
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fecha_ini"
                    label="Fecha Inicial"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fecha_ini"
                  @input="pickeFechaIni = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="3">
              <v-menu
                v-model="pickerFechaFinal"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fecha_final"
                    label="Fecha Final"
                    append-icon="event"
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fecha_final"
                  @input="pickerFechaFinal = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- <v-col class="d-flex" cols="12" sm="3">
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
                    disabled
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha"
                  @input="dialogPicker3 = false"
                ></v-date-picker>
              </v-menu>
            </v-col> -->
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
                  outlined
                  clearable
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
                  outlined
                  clearable
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
                ></v-text-field>
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
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Proveedor/Cliente"
                  v-model="form.agricultor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  clearable
                  outlined
                  :error="errores.agricultor"
                  @change="errores.agricultor = false"
                  return-object
                ></v-autocomplete>
              </v-col>
              <!-- 
              <v-col class="d-flex" cols="12" sm="5">
                <v-text-field
                  label="Cliente/Proveedor"
                  v-model="form.proveedor"
                  outlined
                  hide-details
                  disabled
                  type="text"
                ></v-text-field>
              </v-col> -->
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Conductor"
                  v-model="form.conductor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  clearable
                  outlined
                  :error="errores.conductor"
                  @change="errores.conductor = false"
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex">
              <v-col cols="2">
                <v-text-field
                  label="Peso Bruto"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.pbruto"
                  height="80"
                  class="inputPesolab"
                  :disabled="disabled.pbruto"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Destara"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.destara"
                  height="80"
                  class="inputPesolab"
                  :disabled="disabled.destara"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Empaques"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.empaques"
                  height="80"
                  class="inputPesolab"
                  :disabled="disabled.empaques"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Peso Neto"
                  outlined
                  hide-details
                  :disabled="disabled.pneto"
                  v-model="form.pneto"
                  height="80"
                  class="inputPesolab"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Kilos Compra"
                  outlined
                  hide-details
                  :disabled="disabled.kcompra"
                  v-model="form.kgscompra"
                  height="80"
                  class="inputPesolab"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row>
              <v-col>
                <v-card-subtitle
                  class="
                    subtitle-1
                    font-weight-medium
                    grey--text
                    text--darken-2
                    m0
                  "
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4"
                  class="white--text"
                  depressed
                  @click="abrir_popup()"
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
                <template v-slot:item.cantidad="{ item }">
                  {{ item.cantidad }}
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
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="
                  subtitle-1
                  font-weight-medium
                  grey--text
                  text--darken-2
                  ma-0
                  mx-0
                "
                >Laboratorio</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Humedad"
                  v-model="form.humedad"
                  outlined
                  hide-details
                  disabled
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Impureza"
                  v-model="form.impureza"
                  outlined
                  disabled
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano Rojo"
                  v-model="form.grojo"
                  outlined
                  disabled
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano Partido"
                  v-model="form.gpartido"
                  outlined
                  disabled
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Grano Yesado"
                  v-model="form.gyesado"
                  outlined
                  hide-details
                  disabled
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Kilos Compra"
                  outlined
                  hide-details
                  v-model="form.kfcompra"
                  disabled
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col
                class="d-flex justify-center align-center"
                cols="12"
                sm="2"
              >
                <v-btn
                  @click="calcular_kilos"
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  large
                  block
                >
                  Calcular
                </v-btn>
              </v-col> -->
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="
                  subtitle-1
                  font-weight-medium
                  grey--text
                  text--darken-2
                  ma-0
                  mx-0
                "
                >Cargues y Descargues</v-card-subtitle
              >
            </v-row>
            <v-row>
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
                  label="Tot.Descargue Molino"
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
            <v-col class="d-flex" cols="12">
              <v-switch v-model="form.anular" label="Anular"></v-switch>
            </v-col>
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
            <!-- <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
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
                label="Producto"
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
                label="Variedad"
                :items="variedad"
                outlined
                clearable
                return-object
                persistent-hint
                required
                item-value="cod_rep"
                v-model="articulo_select.variedad"
                :item-text="format_variedad"
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
                @click="agregar_producto"
                >Agregar Producto</v-btn
              >
              <v-btn v-else color="green darken-1" dark block depressed
                >Modificar Producto</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style>
.inputPesolab {
  font-size: 44px !important;
}

.inputPeso input {
  max-height: initial !important;
  font-size: 60px !important;
}
</style>

<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),

      agencias: [],
      pesajes: [],
      clientes: [],
      productos: [],
      variedad: [],
      ubicaciones: [],

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
      form: {
        observaciones: null,
        ubicacion: null,
        punto_fact: null,
        conductor: null,
        agricultor: null,
        desckgcan: 0,
        tdesc: 0,
        tflete: 0,
        tdescan: 0,
        tfletecan: 0,
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
        pbruto: false,
        destara: false,
        empaques: false,
        pneto: false,
        kcompra: false,
      },
      errores: {
        punto_fact: false,
        consecutivo: false,
        conductor: false,
        agricultor: false,
      },
      print: {
        comprobante: null,
      },
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
    this.get_Clientes();
    this.cargarTablaAg();
    this.get_productos();
    this.cargarVariedad();
    this.get_ubicaciones();

    var $this = this;
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
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      this.$set(this.form, index, val_edit);
      if (callback) callback();
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
    grabar_documento() {
      var data = this.form;
      this.format_envio(data);
    },
    format_envio(data) {
      let kiloscomp = parseInt(data.kfcompra.trim());
      let pbruto = parseInt(data.pbruto.trim());
      let destara = parseInt(data.destara.trim());
      let empaques = parseInt(data.empaques.trim());
      let kcompra = parseInt(data.kgscompra.trim());

      if (kiloscomp < 1) {
        this.send_error(" Debe Calcular Kilos Compra!");
      } else {
        var detalle = this.tablaDetalle.data;
        // this.load.btn_enviar = true;
        // this.disabled.btn_enviar = true;
        this.get_plano(detalle)
        .then((plano) => {
        this.card_estado = true;
        var agencia = data.punto_fact.codigo_agc;
        var consecutivo = data.consecutivo.consecut_pes.trim();
        var fletemol = data.tflete || "0";
        var descmol = data.tdesc || "0";
        var fletecan = data.tfletecan || "0";
        var desccan = data.tdescan || "0";
        var descripcion = data.observaciones || "0";
        var anular = data.anular ? "1" : "0";
        let conductor = data.conductor.identificacion_rut;
        let agricultor = data.agricultor.identificacion_rut;

        let datos = {
          url: "Molinos/dlls/PrActpesaje.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            consecutivo +
            "|" +
            fletemol +
            "|" +
            descmol +
            "|" +
            fletecan +
            "|" +
            desccan +
            "|" +
            descripcion +
            "|" +
            anular +
            "|" +
            conductor +
            "|" +
            agricultor +
            "|" +
            pbruto +
            "|" +
            destara +
            "|" +
            empaques +
            "|" +
            kcompra +
            "|" +
            plano +
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
        })
      
      }
    },
    get_plano(detalle) {
      var $this = this;
      return new Promise((resolve, reject) => {
        var nuevo = [];
        detalle.forEach((el, idx) => {
          nuevo.push({
            codigo: el.codigo_articulo ? el.codigo_articulo.trim() : "",
            ubicacion: $this.articulo_select.ubicacion
              ? $this.articulo_select.ubicacion.codigo_ubic
              : "001",
            cantidad: el.cantidad ? parseFloat(el.cantidad).toFixed(2) : 0,
              valor: el.valorBase ? parseFloat(el.valorBase).toFixed(2) : 0,
            variedad: $this.articulo_select.variedad
              ? $this.articulo_select.variedad.cod_var
              : "001",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrPesaje");
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
    cargarVariedad: function () {
      post
        .postData({
          url: "Molinos/dlls/CfvariedadJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.variedad = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Variedades",
            estado: true,
          });
        });
    },
    format_variedad: function (val) {
      return `${val.cod_var} - ${val.descrip_var}`;
    },
    calcular_kilos() {
      let humedad = this.form.humedad || 0;
      let impureza = this.form.impureza || 0;
      let grano_partido = this.form.gpartido || 0;
      let grano_yeso = this.form.gyesado || 0;
      let grano_rojo = this.form.grojo || 0;
      let cliente = parseFloat(this.form.consecutivo.nit_pes.replace(/\,/g, ""));


      // let peso_neto = this.form.pneto.replace(/\,/g, "") || 0;
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
            "1" +
            "|" +
            grano_rojo +
            "|" +
            grano_yeso +
            "|",
          method: "",
        })
        .then((data) => {
          let copia = JSON.parse(JSON.stringify(this.form));
          copia.kfcompra = data[0];

          this.form = copia;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al calcular Tabla",
            estado: true,
          });
        });
    },
    abrir_popup() {
      this.dialogo.estado = true;
      this.dialogo.tipo = true;
      this.articulo_select.ubicacion = {
        codigo_ubic: "0001",
        consigna_ubic: "",
        descrip_ubic: "PUNTO PRINCIPAL",
        estado_ubic: "0",
      };

      if (this.tablaDetalle.data.length === 0)
        this.articulo_select.cantidad = this.form.pbruto;
    },
    agregar_producto() {
      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.ubicacion) {
        this.send_error("Seleccione una ubicación");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else {
        var item = JSON.parse(JSON.stringify(articulo));

        item.ivaTotal = item.ivaTotal || 0;
        let iva = parseFloat(item.ivaTotal.toString().replace(/\,/g, "")) || 0;
        item.valorBase = item.subtotal;
        item.sub_total = item.subtotal;
        item.valorIva = iva * item.cantidad;
        item.valorTotal = item.subtotal * item.cantidad;
        item.descripcion = item.producto.descripcion_pr.trim();
        item.codigo_articulo = item.producto.codigo_pr.trim();

        let producto = articulo.producto;
        let unidad = parseFloat(producto.unidad_pr);
        let cantidad = parseFloat(articulo.cantidad);
        let kilos = unidad * cantidad;
        item.kilos = kilos;

        // item.key = this.get_key();
        this.tablaDetalle.data.push(item);
        this.dialogo.estado = false;
        this.clear_form();
      }
    },
    format_consecutivo(item) {
      return item.consecut_pes.trim() + " - " + item.rutpes_pes.trim();
    },
    reiniciar_formulario() {
      this.form.consecutivo = null;
      this.form.placa = null;
      this.form.tipo_oper = null;
      this.form.documento = null;
      this.form.ciudad = null;
      this.form.proveedor = null;
      this.form.conductor = null;
      this.form.agricultor = null;
      this.form.pbruto = null;
      this.form.destara = null;
      this.form.empaques = null;
      this.form.pneto = null;
      this.form.kgscompra = null;
      this.form.humedad = null;
      this.form.impureza = null;
      this.form.grojo = null;
      this.form.gpartido = null;
      this.form.gyesado = null;
      this.form.kfcompra = null;
      this.form.observaciones = null;
      this.form.tflete = null;
      this.form.tdesc = null;
      this.form.tdescan = null;
      this.form.tfletecan = null;
      this.form.desckg = null;
      this.form.fletekg = null;
      this.form.desckgcan = null;
      this.form.fletekgcan = null;

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
    cargar_datos() {
      var item = this.form.consecutivo;
      this.form.tipo_oper = item.nombredoc_pes;
      this.form.proveedor = item.rutpes_pes.trim();
      this.form.placa = item.placa_pes;

      var busq_conductor = this.clientes.find(
        (el) => el.identificacion_rut == parseInt(item.idconductor_pes)
      );
      this.form.conductor = busq_conductor;

      var busq_agricultor = this.clientes.find(
        (el) => el.identificacion_rut == parseInt(item.idproveedor_pes)
      );
      this.form.agricultor = busq_agricultor;

      this.form.documento = item.docext_pes.trim();
      this.form.ciudad = item.ciudad_pes.trim();
      this.form.pbruto = item.registros[0].pesoini_pes.trim();
      this.form.destara = item.registros[0].pesodes_pes.trim();
      this.form.pneto = item.registros[0].pesoneto_pes.trim();
      this.form.empaques = item.empaques_pes.trim();
      this.form.kgscompra = item.registros[0].pesocomp_pes.trim();
      this.form.fecha = item.fechacorta_pes.trim();
      this.form.humedad = item.registros[0].humini_pes.trim();
      this.form.impureza = item.registros[0].impini_pes.trim();
      this.form.gpartido = item.registros[0].gpart_pes.trim();
      this.form.grojo = item.registros[0].rojoini_pes.trim();
      this.form.gyesado = item.registros[0].yesoini_pes.trim();
      this.form.kgscompra = item.registros[0].pesocomp_pes.trim();
      this.form.kfcompra = item.registros[0].pesocomp_pes.trim();

      this.form.desckg = item.unitdescmol_pes.trim();
      this.form.tdesc = item.descmol_pes.trim();
      this.form.fletekg = item.unitfletemol_pes.trim();
      this.form.tflete = item.fletemol_pes.trim();

      this.form.desckgcan = item.unitdesccan_pes.trim();
      this.form.tdescan = item.desccan_pes.trim();
      this.form.fletekgcan = item.unitfletecan_pes.trim();
      this.form.tfletecan = item.fletecan_pes.trim();

      let nuevo_detalle = [];
      this.tablaDetalle.data = [];

      // item.registros.pop();
      item.registros.forEach((el, index) => {
        let obj = {
          idItem: index + 1,
          codigo_articulo: el.codigo_pes.trim(),
          descripcion: el.producto_pes.trim(),
          cantidad: el.cantidad_pes.trim(),
          kilos: el.pesoneto_pes.trim(),
        };
        this.tablaDetalle.data.push(obj);        
        // nuevo_detalle.push(obj);
      });

      // this.tablaDetalle.data = nuevo_detalle;
    },
    get_pesaje() {
      var $this = this;
      var agencia = this.form.punto_fact;
      let fechaini = this.fecha_ini.replace(/\-/g, "");
      let fechafin = this.fecha_final.replace(/\-/g, "");

      if (agencia) {
        this.load.consecutivo = true;
        post
          .postData({
            url: "Molinos/dlls/PrActPesajeJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              "3" +
              "|" +
              "0" +
              "|" +
              fechaini +
              "|" +
              fechafin +
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
    get_productos() {
      post
        .postData({
          url: "PtoVta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
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
              el.descripcion_pr = descripcion64;
            } else {
              el.descripcion_pr =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
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
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_pr.trim()}`;
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
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    calcularSubtotal() {
      var item = this.articulo_select;
      var cantidad = parseFloat(item.cantidad) || 0;
      this.articulo_select.cantidad = cantidad;
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
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
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
