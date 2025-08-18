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
                >Reimpresión Nota Crédito</v-list-item-title
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
              <v-col class="d-flex justify-end" cols="8">
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
              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.pendientes"
                  @change="cargarcontenido"
                  label="Solo Pendientes de Envio"
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
                        <td>
                          <v-btn
                            @click="open_id(item)"
                            color="green"
                            fab
                            small
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-alpha-f-box-outline</v-icon>
                          </v-btn>
                          <span>Id Facse</span>
                        </td>
                        <td>
                          <v-btn
                            @click="change_date(item)"
                            color="pink"
                            fab
                            small
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-calendar-check-outline</v-icon>
                          </v-btn>
                          <span>Modificar Fecha</span>
                        </td>
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
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf(item)"
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
                      @click="get_json_dian(item, 1)"
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
                  <span>Enviar Dian con Referencia</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item, 2)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.iddian_fact == ''"
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
                      @click="elimina_item(item)"
                      color="red"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="
                        !item.iddian_fact == '' || !item.provdian_fact == ''
                      "
                    >
                      <v-icon> mdi-delete-forever-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
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
    <v-dialog v-model="dialogofecha.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <span class="title col-12">Cambio Fecha a Nota Crédito</span>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
          </v-row>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <h4 style="color: red" class="font-weight-bold text-h7 subtitles">
              Atención!!!. El cambio de Fecha requiere
            </h4>
            <h4 style="color: red" class="font-weight-bold text-h7 subtitles">
              Reprocesar las Notas de los meses afectados
            </h4>
          </v-row>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="5">
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
                    label="Fecha Nota"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_doc"
                  @change="dialogPicker = false"
                ></v-date-picker>
              </v-menu>
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
                @click="guardar_fecha"
                >Guardar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogofecha.estado = false"
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
          <span class="title col-12">Reenvío Nota Crédito</span>
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
    <v-dialog v-model="dialogoid.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Actualiza Id Facse</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Idenfificador"
                clearable
                outlined
                type="text"
                v-model="form.idfacse"
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
                @click="actualiza_id()"
                >Actualizar Id</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogoid.estado = false"
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
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import { ncredito_titan } from "../../_formatos.pdf";
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

      dialogocorreo: {
        estado: false,
      },

      dialogofecha: {
        estado: false,
      },

      dialogoid: {
        estado: false,
      },
      dialogoidfact: {
        estado: false,
      },

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
      correo: [],
      correodestino: "",
      search: "",
      form: {},
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
    // this.cargarcontenido();
    this.cargarTablaAg();
    this.get_empresa();
  },
  computed: {},
  methods: {
    elimina_item(item) {
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
        fecha +
        "|";

      post
        .postData({
          url: "Ptovta/dlls/PrNcreditoX.dll",
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
          this.send_error("Ha ocurrido un error eliminando la Nota");
        });
    },
    change_date(item) {
      this.item_envio = item;
      this.dialogofecha.estado = true;
      this.form.fecha_doc = item.fechacorta_fact;
    },
    guardar_fecha() {
      this.card.loader = true;
      let fecha = this.form.fecha_doc.replace(/\-/g, "");
      let agencia = this.item_envio.agencia_fact;
      let consecutivo = this.item_envio.numero_fact;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrNcredito03.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();
          this.card.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Fecha Actualizada",
            estado: true,
          });
          this.dialogofecha.estado = false;
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Ha ocurrido un error actualizando fecha.");
        });
    },
    open_mail(item) {
      this.item_envio = item;
      this.dialogocorreo.estado = true;
      this.form.correo = item.correo_fact;
    },
    async send_mail() {
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
        let idempresa = parseFloat(this.datosEmpresa.id_empr);
        let prefijo = item.pref_fact;
        if (this.datosEmpresa.id_empr == "000000901393861") {
          console.log(prefijo);
        } else {
          prefijo = "NC";
        }

        let numero = parseFloat(item.numero_fact);
        let correo = this.form.correo
          ? this.form.correo.trim()
          : this.correodestino.trim();
        let token = item.token_fact.trim();

        this.correo.unshift({
          prefix: prefijo,
          number: "" + numero + "",
          showacceptrejectbuttons: false,
          email_cc_list: [
            {
              email: correo,
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
    get_pdf_pos(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var format = this.pdfs.prfact02_pos(data, logo);
        pdfMake.createPdf(format).open();
      });
    },
    async get_pdf(item, getBase64) {
      if (this.datosEmpresa.provfact_empr == "1") {
        this.get_pdf_facse(item);
      } else {
        this.get_pdf_titan(item, getBase64);
      }
    },
    open_id(item) {
      this.item_envio = item;
      this.form.idfacse = this.item_envio.iddian_fact;
      this.dialogoid.estado = true;
    },
    open_idfact(item) {
      this.item_envio = item;
      this.form.idfact = this.item_envio.cufe_fact;
      this.dialogoidfact.estado = true;
    },
    actualiza_id() {
      this.dialogoid.estado = false;
      var agencia = this.item_envio.agencia_fact;
      var prefijo = this.item_envio.pref_fact;
      var consecutivo = this.item_envio.numero_fact;
      var fecha = this.item_envio.fecha_fact.substr(0, 4);
      let cufe = this.form.idfacse.trim();

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
          url: "Ptovta/dlls/PrNcredito01J.dll",
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
    get_pdf_facse(item) {
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
    get_json_dian(item, referencia) {
      this.card.loader = true;
      this.card.disabled = true;
      let maquina = item.maqpos_fact;
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        key +
        fecha +
        "|" +
        referencia +
        "|" +
        maquina +
        "|";
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
            detalles = factura.Detalles.map((item) => {
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
            urlEnvio =
              "https://server1ts.net/financiero/inc/api_dian/ncelect.titan.php";

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
              this.card.loader = false;
              this.card.disabled = false;
              $this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              let cude = null;
              let envio_ok = false;
              if (response.ResponseDian) {
                envio_ok =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.IsValid === "true";
              }

              if (response.success === false) {
                envio_ok = true;
                cude = response.cude;
              } else if (response.ResponseDian.Envelope.Body) {
                cude =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.XmlDocumentKey;
              }
              if (cude) {
                if (envio_ok === false) {
                  cude = "";
                }
                this.grabar_cufe(item, cude);
                this.card.loader = false;
                this.card.disabled = false;
                this.$emit("snack", {
                  color: "success",
                  text: "Cune actualizado",
                  estado: true,
                });
              } else {
                this.send_error("Error enviando la Nota Credito electrónica");
              }

              this.card.loader = false;
              this.card.disabled = false;
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
      let pendientes = this.form.pendientes ? "1" : "0";

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
    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
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
</script>
