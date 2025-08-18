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
              <v-icon size="30" color="blue darken-4 ">mdi-minus-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Nota Crédito</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Nota Credito"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  clearable
                  outlined
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="justify-end d-flex" cols="12" sm="3">
                <v-text-field
                  label="Fecha"
                  outlined
                  v-model="form.fecha"
                  hide-details
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
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Cliente"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="
                    errores.clientes = false;
                    get_facturas();
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex align-center mx-auto" cols="6">
                <v-autocomplete
                  label="Facturas pendientes"
                  v-model="form.facturas"
                  :items="facturasPendientes"
                  :item-text="format_factPendientes"
                  hide-details
                  clearable
                  return-object
                  outlined
                  chips
                  small-chips
                  :loading="loader.facturas"
                  :error="errores.facturas"
                  @change="get_info_factura"
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
                item-key="codigo"
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.vlr_unit="{ item }">
                  {{ formatNumero(item.vlr_unit) }}
                </template>
                <template v-slot:item.vlr_subtotal="{ item }">
                  {{ formatNumero(item.vlr_subtotal) }}
                </template>
                <template v-slot:item.vlr_iva="{ item }">
                  {{ formatNumero(item.vlr_iva) }}
                </template>
                <template v-slot:item.vlr_total="{ item }">
                  {{ formatNumero(item.vlr_total) }}
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
                  <td></td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
              </v-data-table>
            </div>

            <v-row>
              <v-col cols="4">
                <v-select
                  :items="[
                    { text: 'Anulación de Factura', value: 2 },
                    { text: 'Devolucion parcial', value: 1 },
                    { text: 'Descuento Parcial/Total', value: 3 },
                    { text: 'Ajuste de Precio', value: 4 },
                    { text: 'Otros', value: 5 },
                  ]"
                  label="Causal"
                  outlined
                  hide-details
                  v-model="form.causal"
                  @change="errores.causal = false"
                ></v-select>
              </v-col>

              <v-col cols="8">
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
            <v-col class="pa-0 px-0 d-flex align-center justify-center">
              <v-btn
                color="green darken-1"
                class="white--text mr-2"
                large
                depressed
                :loading="load.btn_enviar"
                @click="grabar_nota"
                >Grabar Nota Crédito</v-btn
              >
              <v-btn
                color="orange darken-1"
                class="white--text"
                large
                depressed
                :disabled="disabled.btn_enviar"
                :loading="load.imprimir_factura"
                @click="get_enviardian"
                >Enviar Dian
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
        <v-card-title> Modificar item </v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
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
                  v-model="articulo_select.vlr_unit"
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
                  v-model="articulo_select.vlr_total"
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
                @click="
                  dialogo.estado = false;
                  clear_form();
                "
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_servicio"
                >Guardar</v-btn
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
      ubica: [],
      clientes: [],
      datosEmpresa: [],
      productos: [],
      listas: [],
      docconsecutivo: false,
      facturasPendientes: [],
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
            text: "Descripción",
            align: "left",
            value: "nombre_servicio",
          },
          {
            text: "Ubicación",
            align: "left",
            value: "ubicacion",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "vlr_unit",
          },
          {
            text: "Sub-total",
            align: "center",
            value: "vlr_subtotal",
          },
          {
            text: "Iva",
            align: "center",
            value: "vlr_iva",
          },
          {
            text: "Impoconsumo",
            align: "center",
            value: "vlr_impoc",
          },

          {
            text: "Total",
            align: "center",
            value: "vlr_total",
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
        facturas: false,
        causal: false,
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
      loader: {
        facturas: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();
    this.cargarTablaubica();
    this.disabled.btn_enviar = true;

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          var cantidad = parseInt(val.cantidad);

          let sub_total =
            parseFloat(val.vlr_subtotal.toString().replace(/\,/g, "")) || 0;
          let total_iva =
            parseFloat(val.vlr_iva.toString().replace(/\,/g, "")) || 0;
          let total =
            parseFloat(val.vlr_total.toString().replace(/\,/g, "")) || 0;

          $this.tablaDetalle.totales.total += total;
          // let iva = total - (total / val.total_iva).toFixed(0);
          $this.tablaDetalle.totales.total_iva += total_iva;
          $this.tablaDetalle.totales.sub_total += sub_total;
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
    get_enviardian() {
      this.card.loader = true;
      this.card.disabled = true;
      var $this = this;
      var key = this.print.comprobante;
      var fecha = this.form.fecha.replace(/-/g, "").substr(0, 4);
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = null;
      if (this.datosEmpresa.provfact_empr == "1") {
        urlconsulta = "Ptovta/dlls/PrNCreditoFEJ.dll";
      } else {
        urlconsulta = "Ptovta/dlls/PrNcredTitanJ.dll";
      }
      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          var urlEnvio = null;
          let nombre64 = " ";
          let factura = data[0];
          let detalles = " ";
          if (this.datosEmpresa.provfact_empr == "1") {
            urlEnvio = "https://server3ts.com/facturae/consulta.prod.php";
            let detalles = factura.Detalles.map((item) => {
              nombre64 = window.atob(
                item.base1_pr.trim() +
                  item.base2_pr.trim() +
                  item.base3_pr.trim() +
                  item.base4_pr.trim() +
                  item.base5_pr.trim()
              );
              if (nombre64) {
                item.Nombre = nombre64;
              }
              return item;
            });
          } else {
            urlEnvio = "https://server3ts.com/financiero/inc/ncelect.titan.php";

            detalles = factura.credit_note_lines.map((item) => {
              nombre64 = window.atob(
                item.base1_pr.trim() +
                  item.base2_pr.trim() +
                  item.base3_pr.trim() +
                  item.base4_pr.trim() +
                  item.base5_pr.trim()
              );

              if (nombre64) {
                item.description = nombre64;
              }
              item.description = item.description + item.notes;

              return item;
            });
          }
          factura.Detalles = detalles;
          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));

          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.load.btn_enviar = false;
              this.disabled.btn_enviar = false;
              $this.send_error(
                "Ha ocurrido un error durante el envío de la Nota: " + error
              );
            })
            .then((response) => {
              if (this.datosEmpresa.provfact_empr == "1") {
                var res = JSON.parse(response.res);
                if (response.codigo == "0") {
                  if (res.IdDocumento.Respuesta) {
                    let cufe = res.IdDocumento.Contenido;
                    this.grabar_cufe(cufe);
                  } else {
                    this.load.btn_enviar = false;
                    this.disabled.btn_enviar = false;
                    this.$emit("snack", {
                      color: "success",
                      text: res.RespuestaFacse,
                      estado: true,
                    });
                  }
                } else {
                  this.load.btn_enviar = false;
                  this.disabled.btn_enviar = false;
                  this.send_error("Error enviando la factura electrónica");
                }
              } else if (this.datosEmpresa.provfact_empr == "5") {
                this.card.loader = false;
                this.card.disabled = false;
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
                    this.grabar_cufe(cufe);
                  } else {
                    this.send_error(errordian);
                  }
                } else {
                  this.grabar_cufe(cufe);
                }
              } else {
                if (response.status === "error") {
                  let errores = response.document.errors.join("<br>");
                  this.send_error(errores);
                  this.load.btn_enviar = false;
                  this.disabled.btn_enviar = false;
                } else {
                  let cufe = response.document.uuid;
                  this.grabar_cufe(cufe);
                }
              }
            });
        });
    },
    grabar_cufe(res) {
      var parse_comp = this.print.comprobante.split("|");
      var agencia = parse_comp[0];
      var consecutivo = parse_comp[2];
      var fecha = this.form.fecha.substr(0, 4);
      let cufe = "";
      if (this.datosEmpresa.provfact_empr == "1") {
        cufe = res.IdDocumento.Contenido;
      } else {
        cufe = res;
      }
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|" +
        1 +
        "|";

      post
        .postData({
          url: "Ptovta/dlls/PrNcredito01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = true;
          this.$emit("snack", {
            color: "success",
            text: "Nota enviada a la Dian ",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    grabar_nota() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.clientes) {
        this.send_error("Selecciona un cliente");
      } else if (!data.facturas) {
        this.send_error("Selecciona una factura");
      } else if (!data.causal) {
        this.send_error("Selecciona una causal");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;

        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var puntoFact = data.punto_fact.codigo_agc;
            var prefijo = data.facturas.pref_cart;
            var fpago = data.facturas.fpago_cart;
            var consecutivo = data.consecutivo;
            var numero = data.facturas.numero_cart.trim();
            var fecha = data.fecha.replace(/-/g, "");
            var cliente = data.clientes.identificacion_rut;
            var docconsec = this.docconsecutivo;
            var observaciones = data.observaciones || "";
            let causal = data.causal;

            var datosEnvio =
              sesion +
              "|" +
              puntoFact +
              "|" +
              consecutivo +
              "|" +
              prefijo +
              "|" +
              numero +
              "|" +
              fecha +
              "|" +
              cliente +
              "|" +
              fpago +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|" +
              plano +
              "|" +
              docconsec +
              "|" +
              causal +
              "|";
            post
              .postData({
                url: "Dispensa/dlls/PrNcredito01.dll",
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
                  text: "Nota Crédito guardada correctamente",
                  estado: true,
                });
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.send_error("Error al grabar Nota Crédito");
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
      this.form = {
        fecha: this.$moment().format("YYYY-MM-DD"),
      };
      this.tablaDetalle.data = [];
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
    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var nuevo = [];
        detalle.forEach((el) => {
          var codigo = el.codigo;
          var cantidad = parseFloat(el.cantidad) || 0;
          var valor = parseFloat(el.vlr_unit) || 0;
          var valort = valor * cantidad;
          var descuento = parseFloat(el.vlr_dcto) || 0;
          var iva = parseFloat(el.vlr_iva) || 0;
          var total = parseFloat(el.vlr_total) || 0;
          var impoconsumo = parseFloat(el.vlr_impoc) || 0;

          nuevo.push({
            ubicacion: el.ubicacion || "0001",
            codigo,
            cantidad: cantidad.toFixed(2),
            valor: valort.toFixed(2),
            descuento: descuento.toFixed(2),
            iva: iva.toFixed(2),
            total: total.toFixed(2),
            impoconsumo: impoconsumo.toFixed(2),
            descproducto: "",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrNcredito01");
        formData.append("data", JSON.stringify(nuevo));

        fetch("https://server3ts.com//financiero/inc/planos.php", {
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
      if (this.form.clientes) {
        this.dialogo.estado = true;
        this.dialogo.tipo = true;
      } else {
        this.send_error("Debes seleccionar un cliente");
      }
    },
    agregar_servicio() {
      var articulo = this.articulo_select;
      if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else {
        var item = JSON.parse(JSON.stringify(this.articulo_select));
        var detalle = JSON.parse(JSON.stringify(this.tablaDetalle.data));
        var busqueda = detalle.findIndex((el) => el.codigo == item.codigo);

        detalle[busqueda] = item;

        this.tablaDetalle.data = [];
        this.tablaDetalle.data = detalle;
        this.dialogo.estado = false;
        this.clear_form();
      }
    },
    change_articulo_modal() {
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
      if (item) {
        var valor_unitario = parseFloat(item.vlr_unit) || 0;
        var cantidad = parseFloat(item.cantidad) || 0;
        var iva = parseFloat(item.iva);
        var porc_iva = iva / 100;

        var valor_neto = valor_unitario * cantidad;

        var valor_iva = valor_neto * porc_iva;
        valor_iva = parseFloat(valor_iva.toFixed(0));

        var total = valor_neto + valor_iva;

        item.vlr_total = total.toFixed(2);
        item.vlr_iva = valor_iva.toString();
        item.vlr_subtotal = valor_neto.toString();
        item.vlr_unit = valor_unitario.toString();
        item.cantidad = cantidad.toString();
      }
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
          this.datosEmpresa = data[0];
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
      this.disabled.btn_enviar = true;
      var fecha = this.form.fecha.replace(/-/g, "");
      post
        .postData({
          url: "Ptovta/dlls/PrNCreditoN.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.form.punto_fact.codigo_agc +
            "|" +
            fecha +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = parseFloat(data[0].nro);
          this.docconsecutivo = parseFloat(data[0].nro);
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
    format_factPendientes: function (val) {
      return `${val.pref_cart.trim()}${val.numero_cart.trim()} - ${val.valor_cart.trim()}`;
    },
    get_info_factura() {
      var factura = this.form.facturas;
      if (factura) {
        var sesion = sessionStorage.Sesion;
        var sede = factura.sede_cart.trim();
        var prefijo = factura.pref_cart.trim();
        var numero = factura.numero_cart.trim();
        var ano = factura.ano_cart.trim();

        var datosEnvio =
          sesion + "|" + sede + "|" + prefijo + "|" + numero + "|" + ano + "|";

        post
          .postData({
            url: "dispensa/dlls/PrNCreditoPJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            let productos = data[0].productos;
            let nombre64 = " ";

            this.tablaDetalle.data = productos;
          })
          .catch((err) => {
            console.log(err);
            this.send_error("Error al cargar información de la factura: ", err);
          });
      }
    },
    get_facturas() {
      var rut = this.form.clientes;
      this.loader.facturas = true;
      this.form.facturas = null;

      if (rut) {
        var fecha = this.form.fecha.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        var datosEnvio =
          sesion + "|" + rut.identificacion_rut + "|" + fecha + "|";

        post
          .postData({
            url: "Dispensa/dlls/PrDspFacturasJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.numero_cart);

            this.loader.facturas = false;
            this.facturasPendientes = filtro;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
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
      var articulo = JSON.parse(JSON.stringify(item));
      articulo.cantidad = articulo.cantidad.trim();
      articulo.vlr_iva = articulo.vlr_iva.trim();
      articulo.vlr_subtotal = articulo.vlr_subtotal.trim();
      articulo.vlr_total = articulo.vlr_total.trim();
      articulo.vlr_unit = articulo.vlr_unit.trim();

      this.articulo_select = articulo;
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
