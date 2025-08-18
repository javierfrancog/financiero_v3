<template>
  <v-layout wrap justify-center class="pa-6">
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
              <v-icon size="30" color="blue darken-4 ">mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Remisiones Pendientes por Facturar</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
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
              <v-col class="d-flex justify-end" cols="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>              
            </v-row>
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
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="numero_fact"
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <!-- <v-btn icon class="mr-2" color="blue darken-2">
                  <v-icon @click="print_item(item)">print</v-icon>
                </v-btn>-->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"                      
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Facturar Remisión</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="generar_factura(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.llavefact_fact != ''"
                    >
                      <v-icon>mdi-file-sign</v-icon>
                    </v-btn>
                  </template>
                  <span>Generar Factura</span>
                </v-tooltip>

                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.iddian_fact ? true : false"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar Correo</span>
                </v-tooltip> -->

                <!-- <v-btn icon class="mr-2" color="blue darken-2">
                  <v-icon @click="get_json_dian(item)">send</v-icon>
                </v-btn>-->
                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf(item)"
                      :disabled="item.iddian_fact ? false : true"
                    >
                      <v-icon>mdi-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir PDF</span>
                </v-tooltip> -->
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                disabled
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { doc_remision } from "../../_formatos.pdf.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      prest_facturas: [],
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      prefijos: [],      
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        // { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "center", value: "cliente_fact" },
        { text: "Valor", align: "center", value: "valor_fact" },
        { text: "Estado", align: "center", value: "estado_fact" },
        { text: "Factura", align: "center", value: "llavefact_fact" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_empresa();
  },
  computed: {},
  methods: {
    get_pdf(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var id_factura = item.iddian_fact;
      var $this = this;

      var urlEnvio = null;
      if (this.datosEmpresa.felectronica_empr == "0")
        urlEnvio = "https://server1ts.net/facturae/consulta_pdf.php";
      else urlEnvio = "https://server1ts.net/facturae/consulta_pdf.prod.php";

      var formData = new FormData();
      formData.append("key_factura", id_factura);
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.card.loader = false;
          this.card.disabled = false;
          $this.send_error(error);
        })
        .then((data) => {
          $this.card.loader = false;
          $this.card.disabled = false;
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
    },
    generar_factura(item) {
      console.log(item);
      console.log(this.form)
      let prefijofact = this.form.pref_fact.prefijo_resd;
      let ptofact = this.form.punto_fact.codigo_agc;
      let prefijorem = item.pref_fact;
      let ptorem = item.agencia_fact;
      
      let nro = item.numero_fact.trim();
      let fecha = item.fecha_fact;
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        ptofact +
        "|" +
        prefijofact +
        "|" +
        ptorem +
        "|" +
        prefijorem +
        "|" +
        fecha +
        "|" +
        nro +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrRemision04.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();          
          // this.get_enviardian();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al generar factura");
        });
    }, 
    get_resolucion() {
      var $this = this;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + prefijo + "|" + "3" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar Resolucion: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },    

    print_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);
      var agencia = this.form.punto_fact;
      var tipoimpresion = item.impresion_fact;
      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrRemision01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let data_impresion = data[0];
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

          data_impresion.productos = detalles;
          let empresa = this.datosEmpresa;

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: parseInt(empresa.id_empr),
            direccionEmpresa: empresa.direccion_empr,
          };

          if (this.empresa.posremis_empr == 1) {
            this.get_pdf_pos(data_impresion);
          } else {
            this.impresion_carta(data_impresion);
          }

          // var logo_src = require(`../../assets/image/clientes/${parseFloat(
          //   sessionStorage.Sesion.substr(0, 15)
          // )}.png`);

          // this.pdfs.getBase64(logo_src).then((logo) => {
          //   data_impresion.logo = logo

          //   doc_remision(data_impresion).then((el) => {
          this.card.loader = false;
          this.card.disabled = false;
          //   });
          // });
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    get_pdf_pos(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.telefono_empresa = this.empresa.telefono_empr;
        var format = this.pdfs.remision_pos(data, logo);
        pdfMake.createPdf(format).print();
      });
    },
    impresion_carta(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.doc_remision(data, logo);
        pdfMake.createPdf(format).print();
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    print_item_ant(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);
      var agencia = this.form.punto_fact;
      var tipoimpresion = item.impresion_fact;
      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrRemision01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          if (this.empresa[0].posremis_empr == 1) {
            this.get_pdf_pos(data[0]);
          } else {
            this.format_impresion(data[0]);
          }
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    format_impresion(data) {
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        var el = val + "_print";
        try {
          if (val == "productos") {
            var productos = data[val];
            var parent = document
              .getElementById("pdf_body")
              .getElementsByTagName("tbody")[0];

            var subtotal = 0;
            var descuentoTotal = 0;
            var totalIva = parseFloat(data.total_iva.replace(/\,/g, "")) || 0;

            productos.forEach((item) => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              var subTotal =
                parseFloat(item.vlr_subtotal.replace(/\,/g, "")) || 0;
              var descuento = parseFloat(item.vlr_dcto.replace(/\,/g, "")) || 0;

              row
                .insertCell(0)
                .appendChild(document.createTextNode(item.codigo));
              row
                .insertCell(1)
                .appendChild(document.createTextNode(item.nombre_servicio));
              row.insertCell(2).appendChild(document.createTextNode(""));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.cantidad));
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.vlr_unit));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.vlr_dcto));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.vlr_subtotal));

              subtotal += subTotal;
              descuentoTotal += descuento;
            });

            var subtotal_total = subtotal - descuentoTotal;
            var total_factura = subtotal_total + totalIva;

            document.getElementsByClassName("subtotal_final")[0].innerHTML =
              this.formatNumero(subtotal.toString());
            document.getElementsByClassName("descuento_final")[0].innerHTML =
              this.formatNumero(descuentoTotal.toString());
            document.getElementsByClassName("subtotal_total")[0].innerHTML =
              this.formatNumero(subtotal_total.toString());
            document.getElementsByClassName("total_factura")[0].innerHTML =
              this.formatNumero(total_factura.toString());

            var letras = numeroALetras(total_factura);
            document.getElementsByClassName("numeroLetras")[0].innerHTML =
              letras.toString();
          } else {
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          console.log(error);
        }
      });

      var titulo_doc = this.agencias.find(
        (el) => el.codigo_agc == this.form.punto_fact.codigo_agc
      );

      this.titulo_print = titulo_doc.descripdoc_agc;
      setTimeout(imprimir_pdf, 100);
      // imprimir_pdf();
      // this.titulo_print = null;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      var estado_fecha = this._validarFechas();
      var agencia = this.form.punto_fact;
      this.contenido = [];

      if (!agencia) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona un Punto y Prefijo de Facturación",
          estado: true,
        });
      } else {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        this.loader = true;

        post
          .postData({
            url: "ptovta/dlls/PrRemision02J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              0 +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Remisiones",
              estado: true,
            });
          });
      }
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
        })
        .catch((err) => {
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },

    toObjectUrl(url) {
      return fetch(url, { mode: "no-cors" })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          return URL.createObjectURL(blob);
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

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_prfact01").innerHTML}</style>`
  );

  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("regimen_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("direccion_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("ciudad_empresa_print")[0].innerHTML = "";
  document.getElementsByClassName("numero_fact_print")[0].innerHTML = "";
  document.getElementsByClassName("nombre_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("direccion_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("telefono_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("ciudad_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("email_cliente_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_factura_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_vence_print")[0].innerHTML = "";
  document.getElementsByClassName("numeroLetras")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_final")[0].innerHTML = "";
  document.getElementsByClassName("descuento_final")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_total")[0].innerHTML = "";
  document.getElementsByClassName("total_iva_print")[0].innerHTML = "";
  document.getElementsByClassName("total_factura")[0].innerHTML = "";
  document.getElementsByClassName("observaciones_print")[0].innerHTML = "";
  document.getElementsByClassName("elaboro_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  console.log(
    "Reset",
    (document
      .getElementById("pdf_body")
      .getElementsByTagName("tbody")[0].innerHTML = "")
  );
}

var numeroALetras = (function () {
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }

    return "";
  } //Unidades()

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOSCIENTOS " + Decenas(decenas);
      case 3:
        return "TRESCIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let letras = "";

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += "";

    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;

    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "PESOS M/CTE", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || "PESO M/CTE", //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || "M/CTE",
      letrasMonedaCentavoSingular: currency.centSingular || "M/CTE",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  };
})();
</script>
