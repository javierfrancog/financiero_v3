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
                >Nota Crédito desde Cufe</v-list-item-title
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
                  hide-details
                  type="text"
                  :loading="load.consecutivo"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="form.punto_fact">
              <v-col class="d-flex" cols="12">
                <v-text-field
                  label="Cufe"
                  outlined
                  v-model="form.cufe"
                  hide-details
                  type="text"
                  errores.cufe="false;"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center col-12" v-if="form.punto_fact">
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="indigo"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="get_factura"
                  >Consultar Factura</v-btn
                >
              </v-col>
            </v-row>

            <v-row v-if="form.punto_fact">
              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="Cliente"
                  outlined
                  v-model="form.cliente"
                  disabled
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Id.Cliente"
                  outlined
                  v-model="form.idcliente"
                  disabled
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Factura"
                  outlined
                  v-model="form.factura"
                  disabled
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="form.punto_fact">
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
            </v-row>
            <div class="pa-0 px-0" v-if="form.punto_fact">
              <v-data-table
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
                <template v-slot:body.append>
                  <td colspan="4" class="text-right">
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

            <v-row v-if="form.punto_fact">
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
        <v-card-actions v-if="form.punto_fact">
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
    <v-overlay :value="!!loader" class="mi-overlay">
      <v-card
        class="pa-4 d-flex align-center"
        flat
        tile
        elevation="0"
        color="transparent"
      >
        <flower-spinner
          class="mr-3"
          :animation-duration="2500"
          color="#0d47a1"
        />
        <span class="white--text font-weight-medium">
          {{ loader }}
        </span>
      </v-card>
    </v-overlay>
  </v-layout>
</template>
<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      loader: false,
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
            text: "Codigo",
            align: "center",
            value: "codigo",
          },
          {
            text: "Descripción",
            align: "left",
            value: "nombre_servicio",
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
        ],
        data: [],
        totales: {},
      },
      dataCliente: {
        idcliente: "",
        cliente: "",
        direccion: "",
        telefono: "",
        email: "",
      },
      form: {
        fpago: 1,
        cliente: "",
        idcliente: "",
        cufe: "",
        punto_fact: null,
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
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      search: null,
      input_articulo: false,


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
            urlEnvio = "https://server1ts.net/facturae/consulta.prod.php";
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
            urlEnvio = "https://server1ts.net/financiero/inc/ncelect.titan.php";

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
              let cude = response.cude;

              if (cude) {
                cude =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.XmlDocumentKey;
                this.grabar_cufe(cude);
                this.card.loader = false;
                this.card.disabled = false;
                this.$emit("snack", {
                  color: "success",
                  text: "Cune actualizado",
                  estado: true,
                });
              } else {
                this.card.loader = false;
                this.card.disabled = false;
                this.send_error("Error enviando la Nota Credito electrónica");
              }
            });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.error(err);
          this.send_error(err);
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
        2 +
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
      if (!data.idcliente) {
        this.send_error("Selecciona un cliente");
      } else if (!data.factura) {
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
            var consecutivo = data.consecutivo;
            var numero = data.factura.trim();
            var fecha = data.fecha.replace(/-/g, "");
            var cliente = data.idcliente;
            var observaciones = data.observaciones || "";
            let causal = data.causal;
            let cufe = data.cufe || "";

            var datosEnvio =
              sesion +
              "|" +
              puntoFact +
              "|" +
              this.dataCliente.prefijo +
              "|" +
              consecutivo +
              "|" +
              numero +
              "|" +
              fecha +
              "|" +
              cliente +
              "|" +
              this.dataCliente.dv +
              "|" +
              observaciones.replace(/\"/g, "pg") +
              "|" +
              plano +
              "|" +
              causal +
              "|" +
              cufe +
              "|" +
              this.dataCliente.cliente +
              "|" +
              this.dataCliente.direccion +
              "|" +
              this.dataCliente.tipoid +
              "|" +
              this.dataCliente.ciudad +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrNcredito01C.dll",
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
          var descuento = 0;
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
            descproducto: el.nombre_servicio || "",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrNcredito01");
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

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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

    async get_factura(item) {
      this.loader = "Extrayendo datos de la factura...";

      this.tablaDetalle.data = [];
      this.loader = "Obteniendo el Xml...";
      let cufe = this.form.cufe.trim();
      let infoxml = null;
      let idempr = this.datosEmpresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/xml_fact.php";
      var formData = new FormData();
      formData.append("token", idempr);
      formData.append("cufe", cufe);
      const response = await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      infoxml =
        response.ResponseDian.Envelope.Body.GetXmlByDocumentKeyResponse
          .GetXmlByDocumentKeyResult.XmlBytesBase64;
      infoxml = window.atob(infoxml);
      const data = this.parseFacturaXML(infoxml);
      this.form.cliente = data.cliente.nombre;
      this.form.idcliente = data.cliente.nit;
      this.form.factura = data.numeroFactura;

      this.tablaDetalle.data = data.productos;

      this.dataCliente.idcliente = data.cliente.nit;
      this.dataCliente.cliente = data.cliente.nombre;
      this.dataCliente.direccion = data.cliente.direccion || "";
      this.dataCliente.tipoid = data.cliente.tipoid || "13";
      this.dataCliente.ciudad = data.cliente.ciudad || "50001";
      this.dataCliente.prefijo = data.numeroFactura.substring(0, 4);
      this.calculardv(data.cliente.nit);
      this.loader = false;
    },
    parseFacturaXML(xmlString) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
      const getAttribute = (xpath, attrName) => {
        const node = xmlDoc.evaluate(
          xpath,
          xmlDoc,
          nsResolver,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return node?.getAttribute(attrName) || null;
      };

      const nsResolver = (prefix) => {
        const ns = {
          cbc: "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
          cac: "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        };
        return ns[prefix] || null;
      };

      const textContent = (xpath) => {
        const result = xmlDoc.evaluate(
          xpath,
          xmlDoc,
          nsResolver,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        return result.singleNodeValue?.textContent.trim() || null;
      };
      const schemeNameCliente = getAttribute(
        "//cac:AccountingCustomerParty//cac:PartyTaxScheme//cbc:CompanyID",
        "schemeName"
      );

      const json = {
        numeroFactura: textContent("//cbc:ID"),
        fechaEmision: textContent("//cbc:IssueDate"),
        horaEmision: textContent("//cbc:IssueTime"),
        moneda: textContent("//cbc:DocumentCurrencyCode"),
        proveedor: {
          nombre: textContent(
            "//cac:AccountingSupplierParty//cbc:RegistrationName"
          ),
          nit: textContent("//cac:AccountingSupplierParty//cbc:CompanyID"),
          direccion: textContent("//cac:AccountingSupplierParty//cbc:Line"),
        },
        cliente: {
          nombre: textContent(
            "//cac:AccountingCustomerParty//cbc:RegistrationName"
          ),
          nit: textContent("//cac:AccountingCustomerParty//cbc:CompanyID"),
          direccion: textContent("//cac:AccountingCustomerParty//cbc:Line"),
          ciudad: textContent(
            "//cac:AccountingCustomerParty//cac:PartyTaxScheme//cac:RegistrationAddress//cbc:ID"
          ),

          tipoid: schemeNameCliente,
        },

        totales: {
          subtotal: textContent("//cbc:LineExtensionAmount"),
          impuestos: textContent("//cac:TaxTotal//cbc:TaxAmount"),
          retenciones: textContent("//cac:WithholdingTaxTotal//cbc:TaxAmount"),
          total: textContent("//cbc:PayableAmount"),
        },
        productos: [],
      };

      const items = xmlDoc.evaluate(
        "//cac:InvoiceLine",
        xmlDoc,
        nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
      );
      let item = items.iterateNext();
      let index = 1;
      const factura = json.numeroFactura;

      while (item) {
        const codigo = `${factura}-${index}`;
        const nombre_servicio = item
          .getElementsByTagNameNS(
            "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "Description"
          )[0]
          ?.textContent.trim();
        const cantidadRaw = item
          .getElementsByTagNameNS(
            "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "InvoicedQuantity"
          )[0]
          ?.textContent.trim();
        const cantidad = cantidadRaw
          ? parseFloat(cantidadRaw).toFixed(2)
          : "0.00";

        const vlr_subtotal = item
          .getElementsByTagNameNS(
            "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "LineExtensionAmount"
          )[0]
          ?.textContent.trim();
        const Impoconsumo = 0;
        json.productos.push({
          codigo,
          nombre_servicio,
          cantidad,
          vlr_unit: vlr_subtotal,
          vlr_subtotal,
          Impoconsumo: Impoconsumo.toFixed(2),
          vlr_iva: "0.00",
          vlr_total: vlr_subtotal,
        });
        item = items.iterateNext();
      }

      return json;
    },
    calculardv(numero) {
      var arreglo, x, y, documentoElementos, i, documento, dv1;
      documento = numero;
      if (!documento) {
        alert("Debe escribir el número de Identificación sin puntos.");
      } else {
        arreglo = [];
        x = 0;
        y = 0;
        documentoElementos = documento.length;
        arreglo[1] = 3;
        arreglo[2] = 7;
        arreglo[3] = 13;
        arreglo[4] = 17;
        arreglo[5] = 19;
        arreglo[6] = 23;
        arreglo[7] = 29;
        arreglo[8] = 37;
        arreglo[9] = 41;
        arreglo[10] = 43;
        arreglo[11] = 47;
        arreglo[12] = 53;
        arreglo[13] = 59;
        arreglo[14] = 67;
        arreglo[15] = 71;
        for (i = 0; i < documentoElementos; i++) {
          y = documento.substr(i, 1);
          x += y * arreglo[documentoElementos - i];
        }
        y = x % 11;
        if (y > 1) {
          dv1 = 11 - y;
        } else {
          dv1 = y;
        }
        this.dataCliente.dv = parseInt(dv1);
      }
    },
  },
};
</script>
