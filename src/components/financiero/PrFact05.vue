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
                >Cargue de Cartera</v-list-item-title
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
                  @change="errores.pref_fact = false"
                  :error="errores.pref_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="form.consecutivo"
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

            <v-divider color="#FF6F00"></v-divider>

            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col sm="4">
                <v-text-field
                  label="Vlr Saldo"
                  outlined
                  hide-details
                  clearable
                  suffix="$"
                  :value="formatNumero(articulo_select.valor)"
                  @input="input_mask('valor')"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
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
                >Grabar Cartera</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template><style scoped>
.inputBig {
  font-size: 36px !important;
}
</style>


<script>

import post from "../../methods.js";
// import { factura } from "../../_formatos.pdf";
import { factura_titan, factura_gyro } from "../../_formatos.pdf";
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
            value: "descrip_producto",
          },
          {
            text: "Presentación",
            align: "left",
            value: "presentacion.descripcion_rep",
          },
          {
            text: "Ubicación",
            align: "left",
            value: "ubicacion.descrip_ubic",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "valor",
          },
          // {
          //   text: "Sub-total",
          //   align: "center",
          //   value: "sub_total",
          // },
          {
            text: "V.Descuento",
            align: "center",
            value: "descuento",
          },
          {
            text: "IVA",
            align: "center",
            value: "ivaTotal",
          },
          {
            text: "Impoconsumo",
            align: "center",
            value: "impocTotal",
          },

          {
            text: " ",
            align: "center",
          },
          {
            text: "Total",
            align: "center",
            value: "total",
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
        ccosto: false,
        tasa: false,
        presentacion: false,
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
        { text: "Bolsa Nacional Agropecuaria", value: 99 },
        { text: "No Aplica", value: 9 },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_fecha();
    this.get_Clientes();
    var $this = this;
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
    set_diasPlazo() {
      if (this.form.fpago == 2) this.form.plazo = this.form.clientes.diaspl_rut;
      else this.form.plazo = 0;
      this.disabled.grabar_factura = false;
    },
    grabar_factura() {
      var data = this.form;

      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un punto de facturación");
      } else if (!data.pref_fact) {
        this.errores.pref_fact = true;
        this.send_error("Selecciona un prefijo de facturación");
      } else if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Digita un numero de Factura");
      } else if (!data.consecutivo) {
        this.errores.consecutivo = true;
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;
        var puntoFact = data.punto_fact.codigo_agc;
        var prefijo = data.pref_fact.prefijo_resd;
        var consecutivo = data.consecutivo;
        var fecha = data.fecha.replace(/\-/g, "");
        var cliente = data.clientes.identificacion_rut;
        var diasPlazo = data.plazo;
        var valor = this.articulo_select.valor.replace(/\,/g, "");
        var sesion = sessionStorage.Sesion;

        var datosEnvio =
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
          diasPlazo +
          "|" +
          valor +
          "|";
        post
          .postData({
            url: "Ptovta/dlls/PrFact01C.dll",
            data: datosEnvio,
            method: "",
          })

          .then((data) => {
            this.reset_formulario();

            this.$emit("snack", {
              color: "success",
              text: "Cartera guardada correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar registro",
              estado: true,
            });
          });
      }
    },

    reset_formulario() {
      this.clear_form();
      this.form.clientes = null;
      this.form.consecutivo = null;
      this.form.plazo = null;
    },

    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.articulo_select, index, val_edit);
      if (callback) callback();
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
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
          this.empresa = data[0];
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
          urlEnvio = "https://server1ts.net/facturae/consulta_pdf.php";
        else urlEnvio = "https://server1ts.net/facturae/consulta_pdf.prod.php";

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
    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
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