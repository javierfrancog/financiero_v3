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
              <v-list-item-title class="headline"
                >Reimpresión Nota Crédito Cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Punto de Nota"
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
            </v-row>

            <v-row>
              <v-col class="d-flex justify-left" cols="6">
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
              <v-col class="d-flex justify-end" cols="6">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex" cols="5">
                <v-switch
                  v-model="form.pendientes"
                  label="Solo Pendientes DIAN"
                  @change="cargarcontenido"
                ></v-switch>
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
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            @click="open_idfact(item)"
                            color="indigo accent-3"
                            fab
                            small
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-send</v-icon>
                          </v-btn>
                          <span>Cufe Factura</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="send_dian(item, 1)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar Dian</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf_titan(item)"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir PDF</span>
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
                      @click="send_dian(item, 2)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.iddian_fact == ''"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar Dian sin Referencia</span>
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

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_rips(item, 0)"
                      color="indigo"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="
                        item.iddian_fact == '' || item.provdian_fact == ''
                      "
                    >
                      <v-icon>mdi-alpha-r-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Rips Res.2275</span>
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
    <v-dialog v-model="dialogoidfact.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Actualiza Cufe Factura</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Idenfificador"
                clearable
                outlined
                type="text"
                v-model="form.idfact"
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
                @click="actualiza_idfact()"
                >Actualizar Id</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogoidfact.estado = false"
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
import { ncredito_titan } from "../../_formatos_sal.js";
import { appendQuadraticCurve } from "pdf-lib";
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
      dialogocorreo: {
        estado: false,
      },

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
      correo: [],
      search: "",
      form: {},
      dialogoidfact: {
        estado: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Nro Nota", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "center", value: "cliente_fact" },
        { text: "Factura", align: "center", value: "llave_fact" },
        { text: "Valor", align: "right", value: "valor_fact" },

        // { text: "Estado", align: "center", value: "estado_fact" },
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
    this.cargarTablaAg();
    this.get_empresa();
  },
  computed: {},
  methods: {
    open_idfact(item) {
      this.item_envio = item;
      this.form.idfact = this.item_envio.cufe_fact;
      this.dialogoidfact.estado = true;
    },
    actualiza_idfact() {
      this.dialogoidfact.estado = false;
      var agencia = this.item_envio.agencia_fact;
      var prefijo = this.item_envio.pref_fact;
      var consecutivo = this.item_envio.numero_fact;
      var fecha = this.item_envio.fecha_fact.substr(0, 4);
      let cufe = this.form.idfact.trim();

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
        3 +
        "|";

      post
        .postData({
          url: "Ptovta/dlls/PrNcredito01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: "Nota enviada a la Dian ",
            estado: true,
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    consultadian_item(item, tipo) {
      let cufe = item.iddian_fact.trim();

      if (tipo === 1) {
        cufe = item.idajustedian_fact;
      }

      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    get_pdf_pos(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.prfact02_pos(data, logo);
        pdfMake.createPdf(format).open();
      });
    },
    open_mail(item) {
      this.item_envio = item;
      this.item_envio.Comprobante = {
        Prefijo: item.pref,
        Numero: item.numero,
        Fecha: item.fecha_Factura,
        Token_fact: this.datosEmpresa.tokentitan_empr,
      };

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
      const blob = await this.get_pdf_titan(item, true);
      const pdfBase64 = await this.blobToBase64(blob);
      let pdfb64 = pdfBase64.split(",")[1];

      if (this.datosEmpresa.provfact_empr == "5") {
        let urlEnvio = null;
        let prefijo = item.Comprobante.Prefijo;
        let numero = parseFloat(item.Comprobante.Numero);
        let correo = this.form.correo
          ? this.form.correo.trim()
          : this.correodestino.trim();
        let correo2 = this.form.correo2
          ? this.form.correo2.trim()
          : "facturae@titansoluciones.net";
        let correo3 = this.form.correo3
          ? this.form.correo3.trim()
          : "facturae@titansoluciones.net";

        let token = item.Comprobante.Token_fact.trim();

        this.correo.unshift({
          prefix: item.pref_fact,
          number: item.numero_fact,
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

        urlEnvio = "https://server1ts.net/financiero/inc/email_fact.php";

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
    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
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
    async send_dian(item) {
      if (this.datosEmpresa.provfact_empr == "1") {
        await this.send_dian_facse(item);
      } else {
        this.tipo_envio = 1;
        await this.send_dian_titan(item);
      }
    },
    async send_dian_titan(item) {
      this.item_envio = item;
      var prefijo = item.pref_fact.trim();
      var numero = item.numero_fact;
      var fecha = item.fecha_fact.substring(0, 4);
      let referencia = 1;
      let agencia = item.agencia_fact;
      this.card.loader = true;
      this.card.disabled = true;
      let datosEnvio = null;
      datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        prefijo +
        "|" +
        numero +
        "|" +
        fecha +
        "|" +
        referencia +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrNcredTitanJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = data[0];
          this.envio_json_titan(factura);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error durante el envio",
            estado: true,
          });
        });
    },
    envio_json_titan(factura) {
      let nombre64 = " ";
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/ncelect.titan.php";

      let detalles = factura.credit_note_lines.map((item) => {
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
      factura.Detalles = detalles;
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
          $this.send_error(
            "Ha ocurrido un error durante el envío de la factura: " + error
          );
        })
        .then((response) => {
          let cufe = null;
          let envio_ok = false;
          if (response.ResponseDian) {
            envio_ok =
              response.ResponseDian.Envelope.Body.SendBillSyncResponse
                .SendBillSyncResult.IsValid === "true";
          }

          if (response.success === false) {
            envio_ok = true;
            cufe = response.cufe;
          } else if (response.ResponseDian.Envelope.Body) {
            cufe =
              response.ResponseDian.Envelope.Body.SendBillSyncResponse
                .SendBillSyncResult.XmlDocumentKey;
          }

          if (cufe) {
            if (envio_ok === false) {
              cufe = "";
              let mensaje =
                response.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.ErrorMessage;
              this.send_error(mensaje);
            }
            let item = this.item_envio;
            this.grabar_cufe(item, cufe);
          } else {
            this.card.loader = false;
            this.card.disabled = false;
            this.send_error("Error enviando la factura electrónica");
          }
        });
    },
    send_dian_facse(item, referencia) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio =
        sessionStorage.Sesion + "|" + key + fecha + "|" + referencia + "|";

      post
        .postData({
          url: "clinico/dlls/PrNCreditoFEJ.dll",
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
                "Ha ocurrido un error durante el envío de la factura: " + error
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
                this.send_error("Error enviando la factura electrónica");
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
    grabar_cufe(item, cude) {
      var agencia = item.agencia_fact;
      var prefijo = item.pref_fact;
      var consecutivo = item.numero_fact;
      var fecha = item.fecha_fact.substr(0, 4);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        cude +
        "|" +
        fecha +
        "|" +
        "2" +
        "|";

      post
        .postData({
          url: "Ptovta/dlls/PrNcredito01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: "Cude Actualizado",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    async get_pdf_titan(item, getBase64) {
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
          url: "Clinico/dlls/PrNcredito01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.correodestino = data[0].email_cliente.trim();
          this.card.loader = false;
          this.card.disabled = false;
          return await this.generar_pdf_2(data[0], getBase64);
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

      if (getBase64) return await ncredito_titan(data, getBase64);
      else ncredito_titan(data);
    },

    async get_rips(item) {
      let ruta_url = "Clinico/dlls/Rips2275.dll";
      let prefijo = item.pref_fact;
      let consecutivo = parseFloat(item.llave_fact.substr(5, 14));
      let periodo = item.fecha_fact.substr(0, 6);
      let contrato = item.contrato;
      let time = new Date();
      let hora = time.getMinutes() + time.getSeconds();
      let datos =
        `${sessionStorage.Sesion}|` +
        `0` +
        `|` +
        periodo +
        `|` +
        prefijo +
        `|` +
        consecutivo +
        `|` +
        contrato +
        `|`;
      try {
        let data = await post.postData({
          url: ruta_url,
          data: datos,
          method: "",
        });

        let data_envio = data;
        await this.get_attach_dian(item);
        await this.get_text(data_envio);
      } catch (err) {
        console.log(err);
        this.$emit("snack", {
          color: "error",
          text: "Error al generar Rips",
          estado: true,
        });
      }
    },
    async get_attach_dian(item) {
      let idempresa = this.datosEmpresa.id_empr.substr(5, 15);
      let prefijo = "NC";
      let numero = parseFloat(item.numero_fact);
      let consecutivo = prefijo + numero;
      let fileName = "Attachment-" + consecutivo + ".xml";
      let idempr = this.datosEmpresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/attach_fact.php";

      var formData = new FormData();
      formData.append("token", idempr);
      formData.append(
        "factura",
        parseFloat(idempresa) + "/" + fileName + "/BASE64"
      );

      try {
        const response = await fetch(urlEnvio, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        if (response.filebase64) {
          this.downloadBase64Attach(response.filebase64, fileName);
        } else {
          console.error("Error: No se recibió un archivo en base64.");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    },
    async get_text(data) {
      var formData = new FormData();
      let archivos = data[0].archivos;
      let nro_factura = null;

      archivos.forEach((archivo, index) => {
        formData.append(`archivo${index}`, archivo.archivo);
        nro_factura = archivo.archivo.substr(34, 46);
      });

      fetch("https://server1ts.net/financiero/inc/clear_json.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data[0] && data[0].contenido) {
            try {
              let contenidoLimpio = Array.from(data[0].contenido)
                .filter((char) => {
                  return char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127;
                })
                .join("");
              let contenidoJSON = JSON.parse(contenidoLimpio);
              let resultados = [
                {
                  contenido: contenidoJSON,
                },
              ];

              let jsonResult = JSON.stringify(resultados[0].contenido);
              const blob = new Blob([jsonResult], { type: "application/json" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = nro_factura;
              link.click();
            } catch (error) {
              console.error("Error al parsear el contenido:", error);
            }
          }
        })
        .catch((error) => {
          console.error("Error al leer los archivos:", error);
        });
    },
    downloadBase64Attach(base64, fileName) {
      const link = document.createElement("a");
      link.href = "data:application/xml;base64," + base64;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          title: "Fecha",
          value: "fechacorta_fact",
          format: "fecha",
        },

        {
          title: "Cliente",
          value: "cliente_fact",
          format: "string",
        },
        {
          title: "Prefijo",
          value: "pref_fact",
        },
        {
          title: "Numero",
          value: "numero_fact",
        },
        {
          title: "Valor",
          value: "valor_fact",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Factura",
          value: "llave_fact",
          format: "string",
        },

        {
          title: "Cufe",
          value: "cufe_fact",
          format: "string",
        },
      ];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var header_format = [
        { text: "REPORTE NOTAS CREDITO", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte notas crédito",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-NOTAS CREDITO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
      let pendientes = this.form.pendientes ? 1 : 0;
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
            url: "ptovta/dlls/PrNCredito02J.dll",
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
              "|" +
              pendientes +
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
              text: "Error al cargar Notas Credito",
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
