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
                >Actualizar Inventario Fisico</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
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
            <v-col class="d-flex" cols="4">
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
          </v-row>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Numero conteo"
                  :items="conteo"
                  outlined
                  clearable
                  persistent-hint
                  required
                  v-model="form.conteo"
                  :error="errores.conteo"
                  @change="select_conteo(),errores.conteo = false"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="5">
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
              <v-col class="d-flex" cols="12" sm="7">
                <v-autocomplete
                  v-model="form.proveedor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  disabled
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
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.cantidad="{ item }">
                  {{ formatNumero(item.cantidad) }}
                </template>
                <template v-slot:item.valorTotal="{ item }">
                  {{
                    formatNumero(
                      item.valorTotal + item.valorIva - item.valorDescuento
                    )
                  }}
                </template>


                  <template v-slot:[`item.cantidad`]="{ item }">
        <div v-if="item.editando">
    <v-text-field
      v-model="item.cantidad"
      label="Cantidad"
      density="compact"
      hide-details
      @blur="item.editando = false"
    />
  </div>
  <div v-else @click="item.editando = true">
    {{ item.cantidad }}
  </div>
  <hr color="purple" />
</template>


<!-- Columna Lote -->
<template v-slot:[`item.lote`]="{ item }">
  <div v-if="item.editandoLote">
    <v-text-field
      v-model="item.lote"
      label="Lote"
      density="compact"
      hide-details
      @blur="item.editandoLote = false"
    />
  </div>
  <div v-else @click="item.editandoLote = true">
    {{ item.lote }}
  </div>
  <hr color="red" />
</template>

<!-- Columna Vence -->
<template v-slot:[`item.vence`]="{ item }">
  <div v-if="item.editandoVence">
    <v-text-field
      v-model="item.vence"
      label="Vence"
      density="compact"
      hide-details
      @blur="item.editandoVence = false"
    />
  </div>
  <div v-else @click="item.editandoVence = true">
    {{ item.vence }}
  </div>
  <hr color="orange" />
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
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Proceso</v-card-subtitle
              >
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
            <v-col class="pa-0 px-0" sm="3">
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
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
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
      ubicacion: null,
      conteo: [
        { text: "Primer Conteo", value: 1 },
        { text: "Segundo Conteo", value: 2 },
        { text: "Tercer Conteo", value: 3 },
      ],

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
            value: "item",
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
            text: "Lote",
            align: "center",
            value: "lote",
          },
          {
            text: "Vence Lote",
            align: "center",
            value: "vence",
          },
          {
            text: "Cum",
            align: "left",
            value: "cum",
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
    select_conteo(){
      this.form.tipo_oper = null;
      this.form.consecutivo = null;
      this.tablaDetalle.data = [];

    },
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

      let conteo = this.form.conteo;
      var tipoDocumento = this.form.tipo_oper.llave_tpoper;
      let agencia = this.form.punto_fact.codigo_agc;

      if (tipoDocumento && this.form.conteo) {
        this.loader.consecutivos = true;
        var fecha = this.form.fecha.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          tipoDocumento +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          conteo +
          "|";
        post
          .postData({
            url: "Dispensa/dlls/PrReimpinvFJ.DLL",
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
      let consec = item.consecutivo.replace(/\,/g, "").trim();
      let agencia = item.codagencia;
      let conteo = this.form.conteo;

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
        "|" +
        conteo +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrReimpinvJ.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader.consecutivos = false;
          let comprobante = data[0];
          this.ubicacion = data[0].registros[0].codubicacion;
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
        let cantidad = parseInt(el.cantidad.replace(/\,/g, ""));
        let obj = {
          item: el.item,
          cantidad,
          codigo_articulo: el.codigo.trim(),
          descripcion: el.producto.trim(),
          lote: el.lote_rep.trim(),
          vence: el.vence_rep,
          cum: el.cum_rep,
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
      } else {
        var detalle = this.tablaDetalle.data;
        this.load.btn_enviar = true;
        this.disabled.btn_enviar = true;

        let tablaEnvio = {};

        this.tablaDetalle.data.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");

          let codigo = item.codigo_articulo.trim();
          let lote = item.lote.trim();
          let cum = item.cum.trim();
          let vencelote = item.vence ? item.vence.replace(/\-/g, "") : 0;
          let cant_total = parseFloat(item.cantidad);

          tablaEnvio[
            `DATOJ-${format_index}`
          ] = `${codigo}|${cant_total}|${lote}|${vencelote}|${cum}|`;
        });

        var sesion = sessionStorage.Sesion;
        var agencia = data.punto_fact.codigo_agc;
        var tipoOperacion = data.tipo_oper.llave_tpoper;
        var consecutivo = data.consecutivo.consecutivo.replace(/\,/g, "");
        var fecha = data.fecha.replace(/\-/g, "");
        var proveedor = data.proveedor.identificacion_rut;
        var observaciones = data.observaciones || "";
        let conteo = this.form.conteo;

        let importarhtml =
          sesion +
          "|" +
          agencia +
          "|" +
          this.ubicacion +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          conteo +
          "|" +
          proveedor +
          "|" +
          observaciones +
          "|";
        let datos = {
          url: "Dispensa/dlls/PrInvFisicoM.dll",
          data: { importarhtml, ...tablaEnvio },
          method: "",
          json: true,
        };

        post
          .postData(datos)
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
            this.rec_saldos(sesion, fecha, conteo);
            this.reiniciar_formulario();
          })
          .catch((err) => {
            this.load.btn_enviar = false;
            this.disabled.btn_enviar = false;
            this.send_error("Error al grabar el inventario");
          });
      }
    },
    rec_saldos(sesion, fecha, conteo) {
      fecha = fecha.substr(0, 6);
      post
        .postData({
          url: "Dispensa/dlls/PrcierreInv.dll",
          data:
            sesion + "|" + fecha + "|" + "0" + "|" + "0" + "|" + conteo + "|",
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
            text: "Error al recalcular Saldo",
            estado: true,
          });
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
      this.form.tipo_oper = null;
      this.form.consecutivo = null;
      this.form.proveedor = null;
      this.form.observaciones = null;
      this.form.conteo = null;
      this.tablaDetalle.data = [];
      this.cargarTablaAg();
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
      this.toperacion.unshift({
        llave_tpoper: "E27",
        descrip_tpoper: "SALDO FISICO",
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
