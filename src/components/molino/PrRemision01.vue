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
              <v-icon size="30" color="blue darken-4 "
                >mdi-rocket-launch-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Remisión de Mercancías</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
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
                    get_consecutivo();
                    get_pesaje();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="justify-end d-flex" cols="4">
                <v-text-field
                  label="Fecha"
                  outlined
                  v-model="form.fecha"
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="4">
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
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  label="Placa"
                  v-model="form.placa"
                  :items="pesajes"
                  :item-text="format_placa"
                  item-value="consecutivo_rep"
                  hide-details
                  clearable
                  outlined
                  @change="cargar_datos()"
                  return-object
                  :error="errores.placa"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-select
                  :items="origen"
                  label="Documento Origen"
                  outlined
                  return-object
                  hide-details
                  v-model="form.doc_origen"
                  @change="buscarpedidos"
                  :error="errores.doc_origen"
                ></v-select>
              </v-col>

              <v-col cols="4" v-if="this.docum_origen">
                <v-select
                  :items="lista_pedidos"
                  label="Pedidos"
                  outlined
                  hide-details
                  v-model="form.pedido"
                  clearable
                  return-object
                  item-value="numero_fact"
                  :item-text="format_pedido"
                  @change="get_infoRemision"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider color="#FF6F00"></v-divider>
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
              </v-data-table>
            </div>

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
            <v-col class="pa-0 px-0 d-flex align-center justify-center">
              <v-btn
                color="green darken-1"
                class="white--text mr-2"
                large
                depressed
                :disabled="disabled.btn_enviar"
                :loading="load.btn_enviar"
                @click="grabar_remision"
                >Grabar Remisión</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                @click="get_impresion"
                >Imprimir Remisión</v-btn
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
import { remision_molino } from "../../_formatos_mol.js";
import { cloneDeep } from "lodash";

export default {

  data() {
    return {
      agencias: [],
      pesajes: [],
      ubica: [],
      clientes: [],
      datosEmpresa: [],
      productos: [],
      listas: [],
      lista_pedidos: [],
      docum_origen : false,
      origen: [
        { text: "No Aplica", value: 9 },
        { text: "Pedido", value: 1 },
      ],
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
            text: "Codigo",
            align: "center",
            value: "codigo_producto",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descripcion",
          },
          {
            text: "Pedido",
            align: "center",
            value: "cant_ped",
          },
          {
            text: "Despachos",
            align: "center",
            value: "cant_desp",
          },
          {
            text: "Pendiente",
            align: "center",
            value: "cant_pte",
            class: "red--text"
          },
          {
            text: "A Despachar",
            align: "center",
            value: "cant_rem",
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
        facturadas: 0,
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
        doc_origen: false,
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
      loader: {
        facturas: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      infoRemision: [],
      infoPedido: [],
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
    buscarpedidos() {
      let tipo = this.form.doc_origen.value;
      this.lista_pedidos = [];

      if (tipo < 9) {
        this.docum_origen = true;
        let fechaini = this.form.fecha.split("-").join("");
        let cliente = this.form.placa.cliente_rep;
        this.loader = true;
        post
          .postData({
            url: "molinos/dlls/PrPedido02J.dll",
            data: sessionStorage.Sesion + "|" + cliente + "|" + fechaini + "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.lista_pedidos = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Pedidos",
              estado: true,
            });
          });
      } else {
        this.docum_origen = false;        
      }
    },
    get_pesaje() {
      var $this = this;
      var agencia = this.form.punto_fact;
      if (agencia) {
        this.load.consecutivo = true;
        post
          .postData({
            url: "Molinos/dlls/Prpesaje03J.dll",
            data: sessionStorage.Sesion + "|" + agencia.codigo_agc + "|",
            method: "POST",
          })
          .then((data) => {
            data.pop();
            this.load.consecutivo = false;
            var data_parse = JSON.parse(JSON.stringify(data));

            data = data_parse.map((item) => {
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
    cargar_datos() {
      var item = this.form.placa;
      let nuevo_detalle = [];
      this.tablaDetalle.data = [];
      this.lista_pedidos = [];

      if (this.form.placa) {
        item.registros.pop();

        item.registros.forEach((el, index) => {
          let obj = {
            descripcion: el.producto_pes.trim(),
            cant_rem: el.cantidad_pes.trim(),
            codigo_producto: el.codigo_pes,
            kilos: "0",
          };
          if (obj.codigo_producto.trim() != "9999") nuevo_detalle.push(obj);
        });

        this.tablaDetalle.data = nuevo_detalle;
      }
    },
    format_placa: function (val) {
      return `${val.consecutivo_rep} - ${val.placa_rep} - ${val.nombre_rep}`;
    },
    grabar_remision() {
      var data = this.form;
      var detalle = this.tablaDetalle.data;
      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de Remisión");
      } else if (detalle.length == 0) {
        this.send_error("Ingresa al menos un articulo en el detalle");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;
        let tablajson = {};

        detalle.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let cantidad = parseFloat(item.cant_rem.replace(/\,/g, "")) || 0;
          let producto = item.codigo_producto.trim();
          let valor = 0;
          tablajson[
            `DATOJ-${format_index}`
          ] = `${producto}|${cantidad}|${valor}|`;
        });

        let sesion = sessionStorage.Sesion;
        let puntoFact = data.punto_fact.codigo_agc;
        let prefijo = "REMI";
        let consecutivo = data.consecutivo;
        let fecha = data.fecha.replace(/\-/g, "");
        let cliente = data.placa.cliente_rep;
        let agc_pedido = data.pedido? data.pedido.agencia_fact :0;
        let pref_pedido = data.pedido? data.pedido.pref_fact :0;
        let nro_pedido = data.pedido? data.pedido.numero_fact :0;
        let nro_pesaje = data.placa.consecutivo_rep;
        let observaciones = data.observaciones || "";

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
          agc_pedido +
          "|" +
          pref_pedido +
          "|" +
          nro_pedido +
          "|" +
          nro_pesaje +
          "|" +
          observaciones.replace(/\"/g, "pg") +
          "|";
        let datos = {
          url: "Molinos/dlls/PrRemision.dll",
          data: { importarhtml, ...tablajson },
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
            this.tablaDetalle.data = [];
            this.$emit("snack", {
              color: "success",
              text: "Remisión guardada correctamente",
              estado: true,
            });
            this.tablaDetalle.data = [];
            this.lista_pedidos = [];
            this.get_consecutivo ();
          })
          .catch((err) => {
            this.load.btn_enviar = false;
            this.disabled.btn_enviar = false;
            this.disabled.imprimir_factura = false;
            console.error(err);
            this.send_error("Error al grabar Remisión");
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
    get_impresion() {
      this.card.loader = true;
      this.card.disabled = true;
      let fecha = this.form.fecha.substr(0, 4);
      let agencia = this.form.punto_fact.codigo_agc;
      let prefijo = "REMI";

      let numero = this.print.comprobante;
      let datosEnvio = sessionStorage.Sesion + "|" + agencia + "|" + prefijo + "|" + numero + "|" + fecha + "|";
      post
        .postData({
          url: "Ptovta/dlls/PrRemision01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.card.loader = false;
          this.card.disabled = false;
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_pdf(data) {
      // var _this = this;
      // var agencia = this.form.punto_fact;
      // data.agencia = agencia;
      let data_impresion = data;
          let nombre64 = " ";
          let detalles = data_impresion.productos.map((item) => {
            nombre64 = window.atob(
              item.base1_pr.trim() +
                item.base2_pr.trim() +
                item.base3_pr.trim() +
                item.base4_pr.trim() +
                item.base5_pr.trim()
            );
            if (nombre64) {
              item.nombre_servicio = nombre64;
            }
            return item;
          });


      let empresa = this.datosEmpresa;
      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: empresa.ideditado_empr,
        direccionEmpresa: empresa.direccion_empr,
        ciudadEmpresa: empresa.Ciudad + "-" + empresa.Departamento,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data_impresion.logo = logo;
        remision_molino(data_impresion).then((el) => {
          console.log("Impresion terminada");
        });
      });
    },
    get_plano(detalle) {
      var _this = this;
      return new Promise((resolve, reject) => {
        let tablajson = {};
        detalle.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let cantidad = parseFloat(item.cant_rem.replace(/\,/g, "")) || 0;
          let producto = item.codigo_producto.trim();
          let valor = 0;
          tablajson[
            `DATOJ-${format_index}`
          ] = `${producto}|${cantidad}|${valor}|`;
        });
        res(tablajson);
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
      this.tablaDetalle.data = [];
      this.lista_pedidos = [];
      this.pesajes = [];
      this.docum_origen = false;      
      var busqueda_origen = this.origen.find((el) => el.value == 9);
      this.form.doc_origen = busqueda_origen;

      var $this = this;
      this.load.consecutivo = true;
      var fecha = this.form.fecha.replace(/-/g, "");

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
            "REM" +
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
          this.form.consecutivo = data[0].nro_cons.trim();
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
    format_pedido(item) {
      return (
        "Nro_" + parseInt(item.numero_fact) + "    Fecha_" + item.fecha_fact
      );
    },
    get_infoPedido() {
      var _this = this;
      var pedido = this.form.pedido;
      if (pedido) {
        let detalleOld = cloneDeep(this.form.placa);
        var fecha = pedido.fecha_fact.substr(0, 4);
        var datosEnvio = `${sessionStorage.Sesion}|${pedido.agencia_fact}|${pedido.pref_fact}|${pedido.numero_fact}|${fecha}|`;
        post
          .postData({
            url: "Ptovta/dlls/PrPedido01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            var lista = res[0].productos;
            var nuevo_detalle = [];
            lista.forEach((el) => {
              let codigo = el.codigo.trim();
              let cantidad = parseFloat(el.cantidad.replace(/\,/g, "").trim());
              let descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim()
              );

              let cant_rem = 0;

              if (
                parseInt(detalleOld.registros[0].codigo_pes) == parseInt(codigo)
              ) {
                cant_rem = detalleOld.registros[0].cantidad_pes.trim();
              }
              let despachos = this.infoRemision.find(
                (el) => parseInt(el.cod_rep) === parseInt(codigo)
              );
              let cant_desp = 0;
              let cant_pte = 0;

              if (despachos) {
                cant_desp = despachos.cant_rep.trim();
                let cantidadDesp = parseFloat(
                  despachos.cant_rep.replace(/\,/g, "").trim()
                );
                cant_pte = parseInt(cantidad) - cantidadDesp;
              } else {
                cant_pte = parseInt(cantidad);
              }

              nuevo_detalle.push({
                codigo_producto: codigo,
                cant_ped: this.formatNumero(cantidad),
                key: _this.get_key(),
                descripcion: descripcion64,
                cant_desp,
                cant_pte: this.formatNumero(cant_pte),
                cant_rem,
              });
            });

            _this.tablaDetalle.data = [];
            _this.tablaDetalle.data = nuevo_detalle;
            //  this.get_infoRemision();
          });
      }
    },
    get_infoRemision() {
      var _this = this;
      var pedido = this.form.pedido;
      if (pedido) {
        var fecha = pedido.fecha_fact.substr(0, 4);
        var datosEnvio = `${sessionStorage.Sesion}|${pedido.agencia_fact}|${pedido.pref_fact}|${pedido.numero_fact}|${fecha}|`;
        post
          .postData({
            url: "Molinos/dlls/PrRemision03J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((res) => {
            this.infoRemision = res;
            console.log("this.infoRemision",this.infoRemision)
            this.get_infoPedido();
          });
      }
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
