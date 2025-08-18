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
              <v-list-item-title class="headline">
                Reimpresión de Facturación
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  clearable
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
                  <v-date-picker v-model="fecha_ini"></v-date-picker>
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
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
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
                    cargarcontenido();
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="form.pendientes"
                  @change="cargarcontenido"
                  label="Solo Pendientes de Envio"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="indigo"
                  class="white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>

              <v-col class="d-flex">
                <v-btn
                  color="success"
                  class="ml-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="print_reporte_excel"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-btn
                            @click="get_json_dian(item)"
                            color="orange accent-3"
                            fab
                            small
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-send</v-icon>
                          </v-btn>
                          <span>Reenviar DIAN</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>

              <template v-slot:item.fpago_fact="{ item }">
                {{ item.fpago_fact == "1" ? "Contado" : "Credito" }}
              </template>
              <template v-slot:item.estado_fact="{ item }">
                {{ item.estado_fact === "1" ? "Anulada" : "Activa" }}
              </template>

              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <!-- <v-btn icon class="mr-2" color="blue darken-2">
                  <v-icon @click="print_item(item)">print</v-icon>
                </v-btn> -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Factura</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.iddian_fact == ''"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar DIAN</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="print_preview(item)"
                      :disabled="item.provdian_fact == '5'"
                    >
                      <v-icon>mdi-printer-settings</v-icon>
                    </v-btn>
                  </template>
                  <span>Pre_Visualizar</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="open_mail(item)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="
                        item.iddian_fact == '' || item.provdian_fact == ''
                      "
                    >
                      <v-icon>mdi-email-fast-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Reenviar Correo</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="consultadian_item(item, 0)"
                      color="green"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="
                        item.iddian_fact == '' || item.provdian_fact == ''
                      "
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
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
          >
            Cancelar
          </v-btn>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogocorreo.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Reenvío Factura</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino"
                clearable
                outlined
                type="text"
                v-model="form.correo"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino2"
                clearable
                outlined
                type="text"
                v-model="form.correo2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino3"
                clearable
                outlined
                type="text"
                v-model="form.correo3"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="mr-8 white--text"
                @click="send_mail()"
                >Reenviar Correo</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogocorreo.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-overlay :value="loader">
        <flower-spinner
          :animation-duration="2500"
          :size="100"
          color="#0d47a1"
        />
      </v-overlay>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import { factura_titan } from "../../_formatos_disp.js";

// Configuración segura del vfs
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


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
      item_envio: null,
      item_mail: 0,

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      correo: [],
      correodestino: "",
      correodestino2: "",
      correodestino3: "",
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "left", value: "cliente_fact" },
        { text: "Valor", align: "right", value: "valor_fact" },
        { text: "F_Pago", align: "center", value: "fpago_fact" },

        { text: "Estado", align: "center", value: "estado_fact" },
        { text: "Observaciones", align: "center", value: "observaciones_fact" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      dialogocorreo: {
        estado: false,
      },

      datosEmpresa: [],
      titulo_print: null,
      condicion_pdf: true,
      clientes: [],
    };
  },
  created() {
    // this.data_msg = true;
    this.get_empresa();
    // this.cargarcontenido();
    this.get_Clientes();
    this.cargarTablaAg();

    let nit = parseInt(sessionStorage.Sesion.substring(0, 15));
  },
  computed: {},
  methods: {
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;

          this.clientes.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });

          this.form.clientes = {
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          };
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    get_pdf_pos(data) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      let nombre64 = " ";
      let detalles = data.productos.map((item) => {
        nombre64 = window.atob(
          item.base1_pr +
            item.base2_pr +
            item.base3_pr +
            item.base4_pr +
            item.base5_pr
        );
        if (nombre64) {
          item.nombre_servicio = nombre64;
        }
        return item;
      });

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs
          .prfact02_pos(data, logo)
          .then(() => console.log("impresion terminada"));
      });
    },

    // async get_pdf(item) {
    //   if (this.datosEmpresa.provfact_empr == "1") {
    //     this.get_pdf_facse(item);
    //   } else {
    //     // this.card.loader = true;
    //     // this.card.disabled = true;
    //     var urlEnvio = null;
    //     let idempresa = parseFloat(this.datosEmpresa.id_empr);
    //     let factura =
    //       item.pref_fact.trim() + parseFloat(item.numero_fact) + ".pdf";
    //     urlEnvio = "https://server3ts.com/financiero/inc/titanfact_pdf.php";

    //     var formData = new FormData();
    //     formData.append("idempresa", idempresa);
    //     formData.append("factura", factura);
    //     return await fetch(urlEnvio, {
    //       method: "POST",
    //       body: formData,
    //     })
    //       .then((res) => res.blob())
    //       .catch((error) => {
    //         this.card.loader = false;
    //         this.card.disabled = false;
    //         this.send_error(error);
    //       })
    //       .then(async (blob) => {
    //         this.card.loader = false;
    //         this.card.disabled = false;
    //         const link = document.createElement("a");
    //         link.href = URL.createObjectURL(blob);
    //         link.download = "FACTURA_" + factura + ".pdf";
    //         document.body.append(link);
    //         link.click();
    //         link.remove();
    //         return true

    //         // setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    //       });
    //   }
    // },

    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    },
    open_mail(item) {
      this.item_envio = item;
      this.dialogocorreo.estado = true;
      this.form.correo = item.correo_fact.trim();
      this.form.correo2 = item.correo2_fact.trim();
      this.form.correo3 = item.correo3_fact.trim();
    },
    async send_mail() {
      this.item_mail = 1;
      const $this = this;
      let item = this.item_envio;
      this.card.loader = true;
      this.card.disabled = true;
      this.loader = true;
      const blob = await this.print_item(item, true);
      const pdfBase64 = await this.blobToBase64(blob);
      let pdfb64 = pdfBase64.split(",")[1];

      if (this.datosEmpresa.provfact_empr == "5") {
        let urlEnvio = null;
        let idempresa = parseFloat(this.datosEmpresa.id_empr);
        let prefijo = item.pref_fact.trim();
        let numero = parseFloat(item.numero_fact);
        let correo = this.form.correo
          ? this.form.correo.trim()
          : this.correodestino.trim();
        let correo2 = this.form.correo2
          ? this.form.correo2.trim()
          : "facturae@titansoluciones.net";
        let correo3 = this.form.correo3
          ? this.form.correo3.trim()
          : "facturae@titansoluciones.net";

        let token = item.token_fact.trim();

        this.correo.unshift({
          prefix: prefijo,
          number: "" + numero + "",
          showacceptrejectbuttons: false,
          email_cc_list: [
            {
              email: correo,
            },
            {
              email: correo2,
            },
            {
              email: correo3,
            },
          ],
          base64graphicrepresentation: pdfb64,
        });

        urlEnvio = "https://server3ts.com/financiero/inc/email_fact.php";

        var formData = new FormData();
        formData.append("token", token);
        formData.append("correo", JSON.stringify(this.correo[0]));
        fetch(urlEnvio, {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            this.card.loader = false;
            this.loader = false;
            this.card.disabled = false;
            this.dialogocorreo.estado = false;
            this.$emit("snack", {
              color: "orange",
              text: "Correo Envíado con éxito",
              estado: true,
            });
          })
          .catch((error) => {
            this.loader = false;
            this.card.loader = false;
            this.card.disabled = false;
            $this.send_error(error);
          })
          .then((data) => {
            this.loader = false;
            $this.card.loader = false;
            $this.card.disabled = false;
          });
      }
    },
    get_pdf_facse(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var id_factura = item.iddian_fact;
      var $this = this;

      var urlEnvio = null;
      if (this.datosEmpresa.felectronica_empr == "0")
        urlEnvio = "https://server3ts.com/facturae/consulta_pdf.php";
      else urlEnvio = "https://server3ts.com/facturae/consulta_pdf.prod.php";

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
      this.item_mail = 1;
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = null;
      urlconsulta = "Dispensa/dlls/PrFactTitanJ.dll";
      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = null;
          var urlEnvio = null;
          let nombre64 = " ";
          let observacion64 = null;
          factura = data[0];
            urlEnvio = "https://server3ts.com/financiero/inc/elect.titan.php";
            let detalles = factura.invoice_lines.map((item) => {
              item.description = item.description + item.notes;

              return item;
            });
            let textob64 = factura.Observaciones64.trim();

            observacion64 = window.atob(textob64);
            if (observacion64) {
              factura.Observaciones64 = observacion64;
            }

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.card.loader = false;
              this.card.disabled = false;
              this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              if (this.datosEmpresa.provfact_empr == "1") {
                var res = JSON.parse(response.res);
                if (response.codigo == "0") {
                  if (res.IdDocumento.Respuesta) {
                    let cufe = res.IdDocumento.Contenido;
                    this.grabar_cufe(item, cufe);
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
                  this.send_error("Error enviando la factura electrónica");
                }
              } else if (this.datosEmpresa.provfact_empr == "5") {
                this.card.loader = false;
                this.card.disabled = false;
                let cufe = null;
                let valido = false;
                let errordian = null;
                let error_fecha = null;

                if (response.ResponseDian) {
                  cufe =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.XmlDocumentKey;

                  valido =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.IsValid;
                  errordian =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.ErrorMessage.string;
                } else {
                  error_fecha = response.errors.date[0];
                }

                if (error_fecha) {
                  errordian = error_fecha;
                }

                if (valido == false) {
                  if (
                    errordian ==
                    "Regla: 90, Rechazo: Documento procesado anteriormente."
                  ) {
                    this.grabar_cufe(item, cufe);
                  } else {
                    this.send_error(errordian);
                  }
                } else {
                  this.grabar_cufe(item, cufe);
                }
              } else {
                if (response.status === "error") {
                  let errores = response.document.errors.join("<br>");
                  this.send_error(errores);
                  this.card.loader = false;
                  this.card.disabled = false;
                } else {
                  let cufe = response.document.uuid;
                  this.grabar_cufe(item, cufe);
                }
              }
            });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.log(err);
          this.send_error(err);
        });
    },
    grabar_cufe(item, cufe) {
      var agencia = item.agencia_fact;
      var prefijo = item.pref_fact;
      var consecutivo = item.numero_fact;
      var fecha = item.fecha_fact.substr(0, 4);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        "0|" +
        agencia +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";

      post
        .postData({
          url: "Dispensa/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          if (this.datosEmpresa.provfact_empr == "5") {
            this.item_envio = item;
            this.send_mail(item);
            this.$emit("snack", {
              color: "success",
              text: "Factura enviada a la Dian ",
              estado: true,
            });
          }
          this.cargarcontenido();
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: "Cufe Grabado",
            estado: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    async print_preview(item) {
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
      return await post
        .postData({
          url: "Dispensa/dlls/PrFact01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.correodestino = data[0].email_cliente.trim();
          this.correodestino2 = data[0].email2_cliente.trim();
          this.correodestino3 = data[0].email3_cliente.trim();
          this.card.loader = false;
          this.card.disabled = false;
          if (tipoimpresion == "1") {
            this.get_pdf_pos(data[0]);
          } else {
            return await this.generar_pdf_2(data[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async print_item(item, getBase64) {
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
        return await post
          .postData({
            url: "Dispensa/dlls/PrFact01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then(async (data) => {
            this.correodestino = data[0].email_cliente.trim();
            this.correodestino2 = data[0].email2_cliente.trim();
            this.correodestino3 = data[0].email3_cliente.trim();
            this.card.loader = false;
            this.card.disabled = false;
            if (this.item_mail == 1) {
              this.item_mail = 0;
              return await this.generar_pdf_2(data[0], getBase64);
            } else if (tipoimpresion == "1") {
              this.get_pdf_pos(data[0]);
            } else {
              return await this.generar_pdf_2(data[0], getBase64);
            }
          })
          .catch((err) => {
            console.log(err);
            this.card.loader = false;
            this.card.disabled = false;
            this.send_error("Error al imprimir el documento");
          });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      if (data.formato_fact === "02") {
        if (getBase64) return await factura_gyro(data, getBase64);
        else factura_gyro(data);
      } else {
        if (getBase64) return await factura_titan(data, getBase64);
        else factura_titan(data);
      }
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
          text: "Selecciona un punto de facturación",
          estado: true,
        });
      } else {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        let cliente = this.form.clientes.identificacion_rut;
        let pendientes = this.form.pendientes ? "1" : "0";

        this.loader = true;

        post
          .postData({
            url: "Dispensa/dlls/PrFact02J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              cliente +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|" +
              pendientes +
              "|",
            method: "",
          })
          .then((data) => {
            data = data.filter((item) => item.numero_fact);
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "No se encontraron facturas",
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
          if (this.datosEmpresa.obligfact_empr == 2) this.condicion_pdf = false;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    consultadian_item(item, tipo) {
      let cufe = item.iddian_fact.trim();
      if (tipo === 1) {
        cufe = item.idajustedian_fact;
      }

      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    calcular_final() {
      let fecha = this.fecha_ini;
      let año = fecha.substring(0, 4);
      let mes = fecha.substring(5, 7);
      let dia = fecha.substring(8, 10);

      let today = new Date(año, mes, 0);
      let lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      let f_final = año.concat("-", mes, "-", lastDay);
      this.fecha_final = f_final;
      this.pickeFechaIni = false;
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
          this.agencias.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todos",
          });
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
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.valor_fact = parseFloat(el.valor_fact.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Agencia",
          value: "agencia_fact",
        },
        {
          title: "Prefijo",
          value: "pref_fact",
        },
        {
          title: "Fecha",
          value: "fecha_fact",
          format: "fecha",
        },
        {
          title: "Cliente",
          value: "cliente_fact",
        },
        {
          title: "Identificación",
          value: "idcliente_fact",
        },
        {
          title: "Factura",
          value: "numero_fact",
        },

        {
          title: "Valor",
          value: "valor_fact",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "F.Pago",
          value: "fpago_fact",
        },

        {
          title: "Estado",
          value: "estado_fact",
        },
        {
          title: "N.Credito",
          value: "numeronc_fact",
        },
      ];

      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var rut_procesado = this.form.clientes.descripcion_rut;
      var header_format = [
        { text: "REPORTE FACTURACION", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Rut procesado: ${rut_procesado}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Facturación",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-FACTURACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
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
</script>
