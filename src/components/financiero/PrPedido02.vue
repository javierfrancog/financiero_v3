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
              <v-icon size="30" color="blue darken-4 ">mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">ReimpresiÃ³n de Pedidos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Punto de Pedido"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  return-object
                  hide-details
                  outlined
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
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
                  <v-date-picker v-model="fecha_ini" @input="pickeFechaIni = false"></v-date-picker>
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
                  <v-date-picker v-model="fecha_final" @input="pickerFechaFinal = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
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
              <template v-slot:item.fpago_fact="{ item }">
                {{ item.fpago_fact == "1" ? "Contado" : "Credito" }}
              </template>
              <template v-slot:item.estado_fact="{ item }">
                {{ item.estado == "1" ? "Anulado" : "Activo" }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="print_item(item)" color="blue accent-3" fab small icon v-on="on">
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Pedido</span>
                </v-tooltip>
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
          <span class="title col-12">{{ dialogo.titulo}}</span>
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
                label="DescripciÃ³n"
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
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false;init_form()">Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="guardar()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { pedido } from "../../_formatos.pdf";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;
// import JsonExcel from "vue-json-excel";

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
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "center", value: "cliente_fact" },
        { text: "Valor", align: "right", value: "valor_fact" },
        { text: "F_Pago", align: "center", value: "fpago_fact" },

        { text: "Estado", align: "center", value: "estado_fact" },
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
    // this.cargarcontenido();
    this.cargarTablaAg();
    this.get_empresa();
  },
  computed: {},
  methods: {
    get_pdf_pos(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.prfact02_pos(data, logo);
        pdfMake.createPdf(format).open();
      });
    },
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
    get_json_dian(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";

      post
        .postData({
          url: "Ptovta/dlls/PrFact01FEJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          var urlEnvio = null;
          if (this.datosEmpresa.felectronica_empr == "0")
            urlEnvio = "https://server1ts.net/facturae/consulta.php";
          else urlEnvio = "https://server1ts.net/facturae/consulta.prod.php";

          var formData = new FormData();
          formData.append("factura", JSON.stringify(data[0]));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.card.loader = false;
              this.card.disabled = false;
              $this.send_error(
                "Ha ocurrido un error durante el envÃ­o de la factura: " + error
              );
            })
            .then((response) => {
              var res = JSON.parse(response.res);
              if (response.codigo == "0") {
                if (res.IdDocumento.Respuesta) {
                  this.grabar_cufe(item, res);
                } else {
                  this.card.loader = false;
                  this.card.disabled = false;
                  this.$emit("snack", {
                    color: "success",
                    text: res.RespuestaFacse,
                    estado: true,
                  });
                }
              } else {
                this.card.loader = false;
                this.card.disabled = false;
                this.send_error("Error enviando la factura electrÃ³nica");
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
          url: "Ptovta/dlls/PrPedido01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          if (tipoimpresion == "1") {
            this.get_pdf_pos(data[0]);
          } else {
            this.generar_pdf_2(data[0]);
            // this.generar_pdf(data[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },    
    generar_pdf_2(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.telefono_empresa = this.datosEmpresa.telefono_empr;
        data.email_empresa = this.datosEmpresa.email_empr;        
        data.condicion = this.condicion_pdf;

        pedido(data).then(() => {
          console.log("ImpresiÃ³n terminada");
        });
      });
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
          text: "Selecciona un punto de Pedido",
          estado: true,
        });
      } else {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        this.loader = true;

        post
          .postData({
            url: "ptovta/dlls/PrPedido02J.dll",
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
              text: "Error al cargar Pedidos",
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

    // toObjectUrl(url) {
    //   return fetch(url, { mode: "no-cors" })
    //     .then((response) => {
    //       return response.blob();
    //     })
    //     .then((blob) => {
    //       return URL.createObjectURL(blob);
    //     });
    // },
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

