<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-sheep</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Clonación Documentos Contables</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="2">
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
                      v-model="form.fecha_doc"
                      label="Fecha Origen"
                      append-icon="event"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_doc"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Documento Origen"
                  v-model="form.tipoDocumento"
                  :items="docc"
                  :item-text="format_docc"
                  hide-details
                  return-object
                  outlined
                  clearable
                  @change="
                    get_comprobantes();
                    error.tipoDocumento = false;
                  "
                  :error="error.tipoDocumento"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
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
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Comprobante</v-card-subtitle
                >
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                :expanded.sync="expanded"
                item-key="key"
                show-expand
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4">
                    <b>Detalle:</b>
                    {{ item.detalle }}
                  </td>
                </template>
                <template v-slot:item.index="{ item }">
                  {{ detalle.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.debitos="{ item }">{{
                  formatNumero(item.debitos)
                }}</template>
                <template v-slot:item.creditos="{ item }">{{
                  formatNumero(item.creditos)
                }}</template>
                <template v-slot:body.append>
                  <tr>
                    <td colspan="5" class="text-right"></td>
                    <td colspan="2" class="text-right">
                      <strong>TOTALES</strong>
                    </td>
                    <td class="text-xs-right text-right">
                      {{ formatNumero(detalleTotales.debitos.toFixed(2)) }}
                    </td>
                    <td class="text-xs-right text-right">
                      {{ formatNumero(detalleTotales.creditos.toFixed(2)) }}
                    </td>
                    <td></td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
        <v-divider color="#FF6F00"></v-divider>
        <v-card-actions>
          <v-row class="d-flex col-12">
            <v-col class="d-flex" cols="2">
              <v-menu
                ref="menu"
                v-model="dialogPickerdest"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechadest_doc"
                    label="Fecha Destino"
                    append-icon="event"
                    outlined
                    v-on="on"
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechadest_doc"
                  @input="dialogPickerdest = false"
                  @change="get_comprobantedest()"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="5">
              <v-autocomplete
                label="Documento Destino"
                v-model="form.tipoDocumentodest"
                :items="docc"
                :item-text="format_docc"
                hide-details
                return-object
                outlined
                clearable
                @change="
                  get_comprobantedest();
                  error.tipoDocumento = false;
                "
                :error="error.tipoDocumento"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo Destino"
                outlined
                type="text"
                v-model="form.consecutivodest"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="pa-0 justify-end px-0 d-flex align-center" cols="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                @click="grabar_registro"
                :loading="loader.btn_grabar"
                :disabled="disabled.btn_grabar"
                >Clonar Documento</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
        <v-divider color="#FF6F00"></v-divider>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogPicker: false,
      dialogPickerdest: false,
      singleExpand: true,
      expanded: [],
      dialogo: {
        estado: false,
        tipo: true,
        titulo: null,
      },
      dialogoEditar: {
        estado: false,
        tipo: true,
        titulo: null,
      },
      valid: false,
      contenido: [],
      docc: [],
      conceptosc: [],
      tablaruts: [],
      tablaccosto: [],
      cuentasContables: [],
      search: "",
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 40) || "Maximo 40 digitos",
      ],
      validField: [(v) => !!v || "Campo es obligatorio"],
      form: {},
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false,
      },
      headers: [
        { text: "Registro", align: "center", value: "index" },
        { text: "Codigo Cta", align: "left", value: "codigoCuenta" },
        {
          text: "Descripción Cuenta",
          align: "left",
          value: "descripcionCuenta",
        },
        { text: "Rut", align: "left", value: "rut" },
        { text: "Nro_Ext", align: "center", value: "documento" },
        { text: "C.Costo", align: "center", value: "centroCosto" },
        { text: "Débitos", align: "right", value: "debitos" },
        { text: "Créditos", align: "right", value: "creditos" },
      ],
      detalle: [],
      detalleTotales: {
        debitos: 0,
        creditos: 0,
      },
      loader: {
        consecutivo: false,
        btn_grabar: false,
        btn_imprimir: false,
        facturas: false,
      },
      disabled: {
        debitos: false,
        creditos: false,
        btn_grabar: false,
        btn_imprimir: true,
      },
      comprobante: {
        conc_conta: null,
        rut: null,
        ccosto: null,
        valor: null,
        iva: null,
        detalle: null,
        documento: 0,
        facturas: null,
      },
      comprobanteEditar: {
        codCuenta: null,
        descripCuenta: null,
        rut: null,
        ccosto: null,
        debitos: null,
        creditos: null,
        detalle: null,
        documento: null,
        key: null,
        facturas: null,
      },
      error: {
        conc_conta: false,
        rut: false,
        ccosto: false,
        valor: false,
        iva: false,
        detalle: false,
        documento: false,
        tipoDocumento: false,
        facturas: false,
      },
      print: {
        documento: null,
        consecutivo: null,
        fecha: null,
      },
      facturasPendientes: [],
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      mostrarSelectFacturas: false,
      showBaseRetencion: false,
      dialogo_csv: {
        estado: false,
        archivo_csv: null,
        rut: null,
      },
      consecutivos: [],
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
    };
    this.cargar_empresa();
    this.cargarTabladocc();
    this.cargarTablaruts();
    this.$watch("detalle", (detalle) => {
      this.detalleTotales.debitos = 0;
      this.detalleTotales.creditos = 0;
      detalle.forEach((val) => {
        this.detalleTotales.debitos += val.debitos;
        this.detalleTotales.creditos += val.creditos;
      });

      let tdebitos = this.detalleTotales.debitos.toFixed(2);
      let tcreditos = this.detalleTotales.creditos.toFixed(2);
      this.detalleTotales.debitos = parseFloat(tdebitos);
      this.detalleTotales.creditos = parseFloat(tcreditos);
    });
  },
  methods: {
    cargar_tabla() {
      var item = this.form.consecutivo;
      this.form.fecha_doc = this.$moment(item.fechadoc).format("YYYY-MM-DD");

      var detalle = JSON.parse(JSON.stringify(item.registros));

      detalle.pop();
      var nuevo_detalle = [];
      detalle.forEach((el) => {
        let ccosto = el.ccosto.split("-")[0].trim();
        let codCuenta = el.cuenta.split("-")[0].trim();
        let descripcionCuenta = el.cuenta.split("-")[1].trim();
        let creditos = parseFloat(el.credito.trim().replace(/\,/g, "")) || 0;
        let debitos = parseFloat(el.debito.trim().replace(/\,/g, "")) || 0;
        let detalle = el.detalle.trim();
        let documento = "0";

        var carteraEmpresa = this.empresa[0].ctacartera_empr;
        if (carteraEmpresa == codCuenta) {
          documento = el.nroext;
        } else {
          documento = el.nroext.trim().replace(/\s\s+/g, "");
        }
        // let documento = el.nroext.trim().replace(/\s\s+/g, "");

        // let rut = parseFloat(el.idrut).toString() + " - " + el.rut.trim();
        // let busquedaRut = this.tablaruts.find(
        //   (rut) => parseFloat(rut.identificacion_rut) == el.idrut
        // );
        let busquedaRut = el.idrut;
        let rut = el.idrut;

        let centroCosto = this.tablaccosto.find(
          (cc) => cc.llavecentro_cost == ccosto
        );

        // let cuentaContable = this.cuentasContables.find(cuenta => cuenta.cod_puc.trim() == codCuenta.trim())

        let obj = {
          centroCosto: ccosto,
          codigoCuenta: codCuenta,
          comprobante: {
            rut: busquedaRut,
            ccosto: centroCosto,
          },
          creditos,
          debitos,
          descripcionCuenta,
          detalle,
          documento,
          key: this.get_key(),
          rut,
        };
        nuevo_detalle.push(obj);
      });

      this.detalle = JSON.parse(JSON.stringify(nuevo_detalle));
    },
    format_consecutivos(item) {
      return item.consecutivo.trim() + " - " + item.descripc.trim();
    },

    resetFormulario() {
      // this.form = {
      //   fecha_doc: this.$moment().format("YYYY-MM-DD")
      // };
      this.detalle = [];
      this.detalleTotales = {
        debitos: 0,
        creditos: 0,
      };
      this.initModificar();
      this.initComprobante();
      this.form.consecutivo = null;
    },
    grabar_registro() {
      var data = this.form;
      if (!data.tipoDocumento) {
        this.error.tipoDocumento = true;
        this.send_error("Debe seleccionar documento de Origen");
      } else if (!data.consecutivo) {
        this.send_error("Debe Seleccionar un Numero de Origen");
      } else if (!data.fechadest_doc) {
        this.send_error("Debe indicar fecha de Destino");
      } else if (!data.tipoDocumentodest) {
        this.send_error("Debe indicar un Documento de Destino");
      } else {
        var sesion = sessionStorage.Sesion;
        var fecha = data.fechadest_doc.replace(/\-/g, "");
        var agencia = data.tipoDocumentodest.agencia_docc;
        var tipodoc = data.tipoDocumentodest.codigo_docc;
        var tipoDocumento =
          data.tipoDocumentodest.agencia_docc +
          data.tipoDocumentodest.codigo_docc;
        var consecutivo = data.consecutivodest.trim();
        var tipoconsec = data.tipoDocumentodest.numeracion_docc;
        var datosEnvio =
          sesion +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          tipodoc +
          "|" +
          consecutivo +
          "|" +
          tipoconsec +
          "|";

        var detalle_new = JSON.parse(JSON.stringify(this.detalle));
        var detalle_filtro = detalle_new.filter((el) => el.codigoCuenta);
        var detalle_format = detalle_filtro.map((el) => {
          el.iva =
            parseFloat(
              el.comprobante.iva ? el.comprobante.iva.replace(/\,/g, "") : "0"
            ) || 0;
          el.iva = el.iva.toFixed(2) + ".";
          el.debitos = el.debitos.toFixed(2) + ".";
          el.creditos = el.creditos.toFixed(2) + ".";
          el.numRut = el.rut;
          el.fvence = " " + ".";
          el.prefijo = el.documento ? el.documento.substr(0, 4) : " ";
          el.documento = el.documento
            ? el.documento.substr(4, el.documento.length)
            : "0";

          delete el.comprobante;
          return el;
        });
        this.loader.btn_grabar = true;
        this.disabled.btn_grabar = true;
        var tiponumer = data.tipoDocumentodest.numeracion_docc;
        this.get_plano(detalle_format)
          .then((data) => {
            datosEnvio += data + "|" + tiponumer + "|";
            post
              .postData({
                url: "Financiero/dlls/PrClonaCb.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.$emit("snack", {
                  color: "success",
                  text: "Registro guardado correctamente",
                  estado: true,
                });

                this.loader.btn_grabar = false;
                this.disabled.btn_grabar = false;
                this.disabled.btn_imprimir = false;

                this.print.documento = tipoDocumento;
                this.print.consecutivo = data[0];
                this.print.fecha = fecha.substring(0, 6);
                this.cargar_tabla();
                this.resetFormulario();
                this.get_comprobantes();
              })
              .catch((err) => {
                this.loader.btn_grabar = false;
                this.disabled.btn_grabar = false;
                this.send_error("Error al grabar el registro contable");
              });
          })
          .catch((err) => {
            this.loader.btn_grabar = false;
            this.disabled.btn_grabar = false;
            this.send_error(err);
          });
      }
    },
    validarDatos(comprobante) {
      var concepto = comprobante.conc_conta;
      var detalle = comprobante.detalle;
      if (concepto.codigo_conc == "0001") {
        var items = comprobante.cantidadItems;

        for (var i = 0; i < items; i++) {
          this.detalle.push({
            codigoCuenta: null,
            descripcionCuenta: null,
            documento: null,
            rut: null,
            centroCosto: null,
            debitos: 0,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
      } else {
        var valor =
          parseFloat(
            comprobante.valor ? comprobante.valor.replace(/\,/g, "") : "0"
          ) || 0;
        var iva =
          parseFloat(
            comprobante.iva ? comprobante.iva.replace(/\,/g, "") : "0"
          ) || 0;

        var rutFormat = parseInt(comprobante.rut.identificacion_rut);
        var rut = rutFormat + " - " + comprobante.rut.descripcion_rut;
        var centroCosto =
          comprobante.ccosto.centro_cost +
          "" +
          comprobante.ccosto.subcentro_cost;
        var documento = comprobante.documento;

        var valorDebito = valor;
        // Agregar débito
        if (valorDebito > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctadeb_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctadeb_conc.descripcta_conc,
            documento,
            rut,
            centroCosto,
            debitos: valorDebito,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
        // !Agregar débito

        // Agregar retención
        var retencion = concepto.ctaret_conc;
        var porcentajeRet = parseFloat(retencion.porc_conc) || 0;
        var baseRet = parseFloat(retencion.base_conc) || 0;
        var valorPorcentaje = 0;
        var valorRetencion = 0;

        if (porcentajeRet > 0) {
          if (baseRet == 0) {
            valorPorcentaje = porcentajeRet / 100;
            valorRetencion = valorPorcentaje * valor;
          } else {
            if (baseRet < valor) {
              valorPorcentaje = porcentajeRet / 100;
              valorRetencion = valorPorcentaje * valor;
            }
          }

          if (valorRetencion > 0) {
            this.detalle.push({
              codigoCuenta: comprobante.conc_conta.ctaret_conc.codigo_conc,
              descripcionCuenta:
                comprobante.conc_conta.ctaret_conc.descripcta_conc,
              documento,
              rut,
              centroCosto,
              debitos: 0,
              creditos: parseFloat(valorRetencion.toFixed(0)),
              detalle,
              key: this.get_key(),
              comprobante,
            });
          }
        }
        // !Agregar retención

        // Agregar iva
        if (iva > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctaiva_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctaiva_conc.descripcta_conc,
            documento,
            rut,
            centroCosto,
            debitos: iva,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
        // !Agregar iva

        // Agregar crédito
        var valorCredito = valor + iva - valorRetencion;
        if (valorCredito > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctacre_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctacre_conc.descripcta_conc,
            documento,
            rut,
            centroCosto,
            debitos: 0,
            creditos: parseFloat(valorCredito.toFixed(0)),
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
        // !Agregar crédito

        var facturas = comprobante.facturas;
        var cuentaFacturas = this.cuentasContables.find(
          // (e) => e.cod_puc == "1305050101" || e.cod_puc == "1302060401"
          (e) => {
            return e.cod_puc.trim() == this.empresa[0].ctacartera_empr.trim();
          }
        );
        if (facturas && facturas.length > 0) {
          facturas.forEach((item) => {
            var key_factura =
              item.pref_cart.trim() + "" + item.numero_cart.trim();

            var verificar = this.detalle.find(
              (el) =>
                (el.codigoCuenta == "1305050101" &&
                  el.documento == key_factura) ||
                (el.codigoCuenta == "1302060401" && el.documento == key_factura)
            );

            if (!verificar) {
              var valor = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;

              this.detalle.push({
                codigoCuenta: cuentaFacturas.cod_puc,
                descripcionCuenta: cuentaFacturas.descrip_puc,
                documento: key_factura,
                rut,
                centroCosto,
                debitos: 0,
                creditos: valor,
                detalle,
                key: this.get_key(),
                comprobante,
              });
            }
          });

          this.detalle.push({
            codigoCuenta: null,
            descripcionCuenta: null,
            documento: null,
            rut: null,
            centroCosto: null,
            debitos: 0,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
      }
    },

    initModificar() {
      this.comprobanteEditar = {
        cuentaContable: null,
        rut: null,
        ccosto: null,
        debitos: null,
        creditos: null,
        detalle: null,
        documento: null,
        key: null,
        facturas: null,
      };

      this.disabled.debitos = false;
      this.disabled.creditos = false;
    },
    initComprobante() {
      this.comprobante = {
        conc_conta: null,
        rut: null,
        ccosto: null,
        valor: null,
        iva: null,
        detalle: null,
        documento: null,
        facturas: null,
      };

      // this.facturasPendientes = [];
    },
    guardarFormulario() {
      var datos = this.comprobante;
      if (!datos.conc_conta) {
        this.send_error("Selecciona un concepto contable");
        this.error.conc_conta = true;
      } else if (!datos.rut && datos.conc_conta.codigo_conc != "0001") {
        this.send_error("Selecciona un rut");
        this.error.rut = true;
        // } else if (
        //   !datos.facturas
        // ) {
        //   this.send_error("Debes seleccionar al menos una factura");
        //   this.error.facturas = true;
      } else if (!datos.ccosto && datos.conc_conta.codigo_conc != "0001") {
        this.send_error("Selecciona un centro de costo");
        this.error.ccosto = true;
        // } else if (!datos.documento && datos.conc_conta.codigo_conc != "0001") {
        //   this.send_error("Ingresa un número de documento");
        //   this.error.documento = true;
      } else {
        this.dialogo.estado = false;
        this.initComprobante();
        this.validarDatos(datos);
      }
    },

    get_key() {
      return Math.random().toString(36);
      // .substring(10);
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    format_docc: function (val) {
      return `${val.agencia_docc + val.codigo_docc} - ${val.descrip_docc}`;
    },

    cargarTabladocc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfDoccontabJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.docc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Documento Contable");
        });
    },
    get_comprobantes() {
      this.detalle = [];
      var tipoDocumento = this.form.tipoDocumento;
      if (tipoDocumento) {
        this.loader.consecutivo = true;
        var fecha = this.form.fecha_doc.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          tipoDocumento.agencia_docc +
          tipoDocumento.codigo_docc +
          "|" +
          fecha +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrReimpcbJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader.consecutivo = false;
            data.pop();
            this.consecutivos = data;
            this.form.consecutivo = null;
          })
          .catch((err) => {
            this.loader.consecutivo = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.detalle = [];
      }
    },

    get_comprobantedest() {
      var tipoDocumento = this.form.tipoDocumentodest;
      if (tipoDocumento) {
        var fecha = this.form.fechadest_doc.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          tipoDocumento.agencia_docc +
          tipoDocumento.codigo_docc +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrClonaCb01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.$set(this.form, "consecutivodest", data[0]);
            // this.form.consecutivodest = data[0];
          })
          .catch((err) => {
            console.error(err);
            this.send_error("Error al procesar comprobante");
          });
      }
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    get_plano(array) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("tipo", "compContab");
        formData.append("data", JSON.stringify(array));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          // fetch("https://server1ts.net//financiero/inc/compContab_plano.php", {
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
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
  },
};
</script>
