<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-boom-gate-up</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Entrada de VehÃ­culos</v-list-item-title
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
                  ></v-text-field>
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
              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Agencia"
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

              <v-col class="d-flex" cols="10" sm="4">
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
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Tipo de OperaciÃ³n"
                  v-model="form.tipo_oper"
                  :items="toperacion"
                  :item-text="format_operacion"
                  item-value="llave_tpoper"
                  hide-details
                  outlined
                  return-object
                  :error="errores.tipo_oper"
                  :disabled="disabled.btn_enviar"                  
                ></v-autocomplete>
              </v-col>

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
              <v-col class="d-flex" cols="12" sm="3">
                <v-autocomplete
                  label="Ciudad de Origen"
                  v-model="form.ciudad"
                  :items="ciudades_dian"
                  item-value="c_digo_dane_del_municipio"
                  item-text="municipio"
                  outlined
                  :error="errores.ciudad"
                  @change="errores.ciudad = false"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Agricultor/Cliente"
                  v-model="form.proveedor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  outlined
                  :error="errores.clientes"
                  @change="errores.clientes = false"
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex align-center justify-center">
              <v-col cols="5">
                <v-text-field
                  label="Peso Entrada"
                  outlined
                  hide-details
                  autocomplete="off"
                  height="150"
                  class="inputPeso"
                  :value="formatNumero(form.pbruto)"
                  @input="input_mask('pbruto')"
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
                        @click="dialogo.tipo = false"
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
                >Cierre de Proceso</v-card-subtitle
              >
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Conductor"
                  v-model="form.conductor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  outlined
                  :error="errores.conductor"
                  @change="errores.conductor = false"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Cantidad Bultos"
                  outlined
                  hide-details
                  autocomplete="off"
                  :value="formatNumero(form.bultos)"
                  @input="input_mask('bultos')"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="10" sm="3">
                <v-autocomplete
                  label="Medio de Llegada"
                  v-model="form.medio"
                  :items="medio"
                  hide-details
                  outlined
                  return-object
                  :error="errores.medio"
                  @change="errores.medio = false"                  
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
                hint="Busca por cÃ³digo o descripciÃ³n"
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
                  disabled
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
.inputPeso {
  font-size: 46px !important;
}

.inputPeso input {
  max-height: initial !important;
  font-size: 95px !important;
}
</style>
<script>

import post from "../../methods.js";
import { pesaje_entrada } from "../../_formatos_mol.js";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {

  data() {
    return {
      agencias: [],
      vehiculos: [],
      variedad: [],
      clientes: [],
      toperacion: [],
      productos: [],
      filterMunicipios: [],
      ubicaciones: [],
      empresa: {},
      load: {
        btn_enviar: false,
        impresion: false,
        consecutivo: false,
      },
      medio: [
        { text: "Terrestre", value: 1 },
        { text: "Fluvial", value: 2 },
        { text: "No Aplica", value: 9 },
      ],
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "idItem",
          },
          {
            text: "DescripciÃ³n",
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
        medio: null,
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
        variedad: null,
        valorIva: 0,
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
        tipo_oper: false,
        fpago: false,
        retencion: false,
        documento: false,
        doc_origen: false,
        fechaFactura: false,
        fechavence: false,
        conductor: false,
        medio: false,
        clientes: false,
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
      ciudades_dian: null,
    };
  },
  created() {
    this.get_empresa();
    // this.infoEmpresa();
    this.cargarTablaAg();
    this.cargarVehiculos();
    this.cargarVariedad();
    this.cargaroperaciones();
    this.get_fecha();
    this.get_Clientes();
    this.get_productos();
    this.get_ubicaciones();
    this.cargarCiudades();

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
    calcular_peso() {
      var pbruto = parseFloat(this.form.pbruto) || 0;
      var destara = parseFloat(this.form.destara) || 0;

      var subtotal = pbruto - destara;
      this.form.pneto = subtotal;
    },
    validar_placa() {
      let placa = this.form.placa.placa_rep;
      post
        .postData({
          url: "Molinos/dlls/Prpesaje02J.dll",
          data:
            sessionStorage.Sesion + "|" + "0" + "|" + placa + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.disabled.btn_enviar = false;
        })
        .catch((err) => {
          this.form.tipo_oper = null;
          this.disabled.btn_enviar = true;
          this.send_error("Vehiculo ya estÃ¡ ingresado");
        });
    },
    getCiudad(ciudad) {
      var nombreCiudad = "";
      this.ciudades_dian.forEach((el) => {
        if (el["c_digo_dane_del_municipio"] === ciudad) {
          nombreCiudad = el["municipio"].trim();
        }
      });
      return nombreCiudad;
    },
    print_item(item) {
      var fecha = new Date().getFullYear(); //item.fechacorta_pes.substr(0, 4);
      var agencia = this.form.punto_fact.codigo_agc;
      var key = agencia + "|" + (this.form.consecutivo - 1) + "|" + fecha + "|";
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
          this.get_consecutivo();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    generar_pdf(data) {
      var _this = this;
      var agencia = this.form.punto_fact;
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
        pesaje_entrada(data).then(() => {
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
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    getFecha(fecha) {
      var anio = fecha.substr(0, 4);
      var mes = fecha.substr(5, 2);
      var dia = fecha.substr(8, 2);
      var msg = dia + " de ";

      switch (mes) {
        case 0:
          msg += "Enero";
          break;
        case 1:
          msg += "Febrero";
          break;
        case 2:
          msg += "Marzo";
          break;
        case 3:
          msg += "Abril";
          break;
        case 4:
          msg += "Mayo";
          break;
        case 5:
          msg += "Junio";
          break;
        case 6:
          msg += "Julio";
          break;
        case 7:
          msg += "Agosto";
          break;
        case 8:
          msg += "Septiembre";
          break;
        case 9:
          msg += "Octubre";
          break;
        case 10:
          msg += "Noviembre";
          break;
        case 11:
          msg += "Diciembre";
          break;
        default:
          msg += mes;
          break;
      }
      msg += " de " + anio;
      return msg;
    },
    agregar_producto() {
      var articulo = this.articulo_select;
      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.ubicacion) {
        this.send_error("Seleccione una ubicaciÃ³n");
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
    grabar_documento() {
      var data = this.form;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error(" Selecciona una agencia");
      } else if (!data.tipo_oper) {
        this.errores.tipo_oper = true;
        this.send_error(" Selecciona un tipo de operaciÃ³n");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error(" Selecciona una ciudad");
      } else if (!data.placa) {
        this.errores.placa = true;
        this.send_error(" Selecciona una placa");
      } else if (!data.conductor) {
        this.errores.conductor = true;
        this.send_error(" Seleccione un conductor");
      } else if (!data.proveedor) {
        this.errores.clientes = true;
        this.send_error("Selecciona un Agricultor/Cliente");
      } else if (data.doc_origen == 1 && !data.ubicacion) {
        this.send_error("Selecciona una ubicaciÃ³n");
      } else if (this.tablaDetalle.data.length === 0) {
        this.send_error("Seleccione un producto");
      } else if (!data.pbruto || data.pbruto == 0) {
        this.send_error("Ingrese un peso");
      } else if (!data.medio) {
        this.send_error("Ingrese un medio de llegada");
      } else {
        var detalle = this.tablaDetalle.data;
        this.load.btn_enviar = true;
        this.disabled.btn_enviar = true;
        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var fecha = data.fecha.replace(/\-/g, "");
            var consecutivo = data.consecutivo.trim();
            var agencia = data.punto_fact.codigo_agc;
            var placa = data.placa.placa_rep;
            var tipoOperacion = data.tipo_oper.llave_tpoper;
            var documento = data.documento || "1";
            var origen = data.ciudad;
            var proveedor = data.proveedor.identificacion_rut;
            var pbruto = data.pbruto;
            var destara = data.destara || 0;
            var empaque = data.empaque || 0;
            var bultos = data.bultos || 0;
            var conductor = data.conductor.identificacion_rut;
            var medio = data.medio.value;            
            var observaciones = data.observaciones || "";
            var datosEnvio =
              sesion +
              "|" +
              fecha +
              "|" +
              consecutivo +
              "|" +
              agencia +
              "|" +
              placa +
              "|" +
              tipoOperacion +
              "|" +
              documento +
              "|" +
              origen +
              "|" +
              proveedor +
              "|" +
              pbruto +
              "|" +
              destara +
              "|" +
              conductor +
              "|" +
              "0" +
              "|" +
              observaciones +
              "|" +
              "1" +
              "|" +
              plano +
              "|" +
              "1" +
              "|" +
              medio +              
              "|" +
              empaque +
              "|" +
              bultos + 
              "|";
            post
              .postData({
                url: "Molinos/dlls/PrPesajeini.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                let llave_impre = data[0].split("|");
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.print.comprobante = data[0];
                this.$emit("snack", {
                  color: "success",
                  text: "Pesaje grabado correctamente",
                  estado: true,
                });
                this.get_consecutivo();
                this.reiniciar_formulario();
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.send_error("Error al grabar el pesaje");
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
    reset_form() {
      this.tablaDetalle.data = [];
    },
    reiniciar_formulario() {
      this.form.placa = null;
      this.form.tipo_oper = null;
      this.form.documento = null;
      this.form.ciudad = null;
      this.form.proveedor = null;      
      this.form.conductor = null;
      this.form.bultos = null;
      this.form.medio = null;
      this.form.pbruto = null;
      this.form.observaciones = null;
      this.tablaDetalle.data = [];
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
          data: sessionStorage.Sesion + "|" + "3" + "|",
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
    get_consecutivo() {
      var $this = this;
      var agencia = this.form.punto_fact;
      var tipoOperacion = "001";
      if (agencia && tipoOperacion) {
        this.load.consecutivo = true;
        var fecha = this.form.fecha.replace(/\-/g, "");

        var documento = tipoOperacion.llave_tpoper;
        var tipocons = tipoOperacion.tiponumer_tpoper;
        post
          .postData({
            url: "financiero/dlls/PrConsecutivoJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              "6" +
              "|" +
              agencia.codigo_agc +
              "|" +
              "PES" +
              "|" +
              "0" +
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
    format_variedad: function (val) {
      return `${val.cod_var} - ${val.descrip_var}`;
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
          console.log("Error ->", err);
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

