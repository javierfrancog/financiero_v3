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
                  @change="
                    get_resolucion();
                    errores.punto_fact = false;
                  "
                  outlined
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="descrip_rep"
                  hide-details
                  outlined
                  clearable
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  ref="menu"
                  v-model="pickeFechaIni"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      outlined
                      hide-details
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
                <v-btn
                  color="purple"
                  class="ml-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="
                    dialogo_rango.estado = true;
                    dialogo_rango.tipo = 1;
                  "
                >
                  Envio masivo Dian
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
                            @click="abrir_adjunto(item)"
                            color="orange accent-3"
                            fab
                            small
                            icon
                          >
                            <v-icon>mdi-send</v-icon>
                          </v-btn>
                          <span>Reenviar DIAN</span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <v-btn
                            @click="get_dian(item)"
                            :disabled="item.iddian_fact.trim() ? false : false"
                            color="purple"
                            fab
                            small
                            icon
                          >
                            <v-icon>mdi-send</v-icon>
                          </v-btn>
                          <span>Aplicar id</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <v-data-table
                    :headers="enviosHeaders"
                    :items="item.envios"
                    hide-default-footer
                  ></v-data-table>
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
                      @click="abrir_adjunto(item)"
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
    <v-dialog v-model="dialogoenvio.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title class="d-flex justify-center">
          <span class="title col-12">Envío de Factura a la Dian</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="d-flex justify-center col-12">
            <v-col cols="8" class="d-flex align-center">
              <v-file-input
                label="Buscar archivo"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                type="file"
                v-model="adjunto"
                accept="application/pdf"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center col-12">
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="mr-8 white--text"
                @click="montar_adjunto()"
                >Enviar Factura</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogoenvio.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
    <v-dialog v-model="dialogo_rango.estado" persistent max-width="400">
      <v-card :disabled="dialogo_rango.loader" :loading="dialogo_rango.loader">
        <v-card-title class="headline"> Rango a Procesar</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Número inicial"
                outlined
                hide-details
                v-model="dialogo_rango.numInicial"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Número final"
                outlined
                hide-details
                v-model="dialogo_rango.numFinal"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="init_dialogo_rango">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="procesar_rango">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import { factura_titan, factura_gyro } from "../../_formatos.pdf";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
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
      dialogoenvio: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      item_envio: null,
      item_mail: 0,
      item_select: null,

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      logo_b64: "",
      expanded: [],
      contenido: [],
      prefijos: [],

      correo: [],
      correodestino: "",
      correodestino2: "",
      correodestino3: "",
      search: "",
      form: {},
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: 0,
        numFinal: 0,
        loader: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "left", value: "cliente_fact" },
        { text: "Valor", align: "right", value: "valor_fact" },
        { text: "F_Pago", align: "center", value: "fpago_fact" },

        { text: "Estado", align: "center", value: "estado_fact" },
        { text: "Observaciones", align: "center", value: "observaciones_fact" },
      ],
      enviosHeaders: [
        { text: "Correo Destino", align: "center", value: "destino_corr" },
        { text: "Fecha Envio", align: "center", value: "fecha_corr" },
        { text: "Hora Envio", align: "center", value: "hora_corr" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
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
      dialogocorreo: {
        estado: false,
      },
      texto_b64: "",
      base64String: null,
      adjunto: null,
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
    procesar_rango() {
      if (this.dialogo_rango.numInicial && this.dialogo_rango.numFinal) {
        var tipo = this.dialogo_rango.tipo;
        var numInicial = parseInt(this.dialogo_rango.numInicial);
        var numFinal = parseInt(this.dialogo_rango.numFinal);
        var data = this.contenido.filter(
          (el) => el.numero_fact >= numInicial && el.numero_fact <= numFinal
        );
        this.enviar_masivo(data);
      }
    },

    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },
    get_resolucion() {
      var $this = this;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + prefijo + "|" + "4" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
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
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
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
            item.base5_pr +
            item.base6_pr +
            item.base7_pr +
            item.base8_pr +
            item.base9_pr +
            item.base10_pr
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
    abrir_adjunto(item) {
      this.dialogoenvio.estado = true;
      this.adjunto = null;
      this.item_select = item;
    },
    async montar_adjunto() {
      if (this.adjunto) {
        const pdfBase64 = await this.blobToBase64(this.adjunto);
        this.texto_b64 = pdfBase64;
      }
      this.texto_b64 = this.texto_b64 ? this.texto_b64.split(",")[1] : "";
      //  console.log("base",this.texto_b64);
      this.dialogoenvio.estado = false;
      await this.get_json_dian(this.item_select);
    },
    async send_mail(new_index) {
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
            { email: correo },
            { email: correo2 },
            { email: correo3 },
          ],
          base64graphicrepresentation: pdfb64,
        });

        let urlEnvio = "https://server1ts.net/financiero/inc/email_fact.php";
        let formData = new FormData();
        formData.append("token", token);
        formData.append("correo", JSON.stringify(this.correo[0]));

        fetch(urlEnvio, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json()) // ⬅️ Cambiar a .text() si el PHP devuelve texto plano
          .then((data) => {
            console.log("Respuesta del servidor:", data);
            if (data.success === true) {
              this.$emit("snack", {
                color: "orange",
                text: "Correo enviado con éxito",
                estado: true,
              });

              this.grabar_mail(this.item_envio, correo, correo2, correo3);
            } else {
              this.get_status(item.iddian_fact.trim(), item.token_fact.trim(), new_index);
            }

            if (new_index > 0) {
              this.cargar_json(new_index);
            }
          })
          .catch((error) => {
            console.error("Error en envío:", error);
            $this.send_error(error);
          })
          .finally(() => {
            // ✅ Manejo de loaders en un solo sitio
            this.card.loader = false;
            this.loader = false;
            this.card.disabled = false;
            this.dialogocorreo.estado = false;
          });
      }
    },

    async get_status(cufe, token, index) {
      let urlEnvio = "https://server1ts.net/financiero/inc/api_dian/get_status_fact.php";
      let formData = new FormData();
      formData.append("token", token);
      formData.append("cufe", cufe);

      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json()) // ⬅️ Cambiar a .text() si el PHP devuelve texto plano
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          if (data.ResponseDian.Envelope.Body.GetStatusResponse.GetStatusResult.IsValid === true) {
            this.send_mail(index);
          }
        })
        .catch((error) => {
          console.error("Error en envío:", error);
          $this.send_error(error);
        })
        .finally(() => {
          // ✅ Manejo de loaders en un solo sitio
          this.card.loader = false;
          this.loader = false;
          this.card.disabled = false;
          this.dialogocorreo.estado = false;
        });
    },
    async grabar_mail(item, correo, correo2, correo3) {
      if (correo2 == "facturae@titansoluciones.net") {
        correo2 = "";
      }
      if (correo3 == "facturae@titansoluciones.net") {
        correo3 = "";
      }

      var agencia = item.agencia_fact;
      var prefijo = item.pref_fact.trim();
      var consecutivo = item.numero_fact;
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        "1|" +
        agencia +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        correo +
        "|" +
        correo2 +
        "|" +
        correo3 +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrMail.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          // this.cargarcontenido();
        })
        .catch((err) => {
          console.log("error", err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Ha ocurrido un error grabando correo.");
        });
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
    async get_json_dian(item, new_index) {
      this.card.loader = true;
      this.card.disabled = true;
      this.item_mail = 1;
      let maquina = parseFloat(item.maqpos_fact);
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = null;
      // this.datosEmpresa.provfact_empr = "3";

      if (this.datosEmpresa.provfact_empr == "1") {
        urlconsulta = "Ptovta/dlls/PrFact01FEJ.dll";
      } else if (this.datosEmpresa.provfact_empr == "2") {
        urlconsulta = "Ptovta/dlls/PrFactEmisionJ.dll";
      } else if (item.maqpos_fact == "000") {
        urlconsulta = "Ptovta/dlls/PrFactTitanJ.dll";
      } else {
        urlconsulta = "Ptovta/dlls/PrFactPosTitanJ.dll";
      }
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
          //          let textob64 = " ";
          let valido = false;
          let mensaje = null;
          let cufe = null;
          //        let errordian = null;
          //       let error_fecha = null;
          let texto_msg = null;

          factura = data[0];
          if (this.datosEmpresa.provfact_empr == "1") {
            if (this.datosEmpresa.felectronica_empr == "0")
              urlEnvio = "https://server1ts.net/facturae/consulta.php";
            else urlEnvio = "https://server1ts.net/facturae/consulta.prod.php";

            let detalles = factura.Detalles.map((item) => {
              nombre64 = window.atob(
                item.base1_pr.trim() +
                  item.base2_pr.trim() +
                  item.base3_pr.trim() +
                  item.base4_pr.trim() +
                  item.base5_pr.trim() +
                  item.base6_pr.trim() +
                  item.base7_pr.trim() +
                  item.base8_pr.trim() +
                  item.base9_pr.trim() +
                  item.base10_pr.trim()
              );
              if (nombre64) {
                item.Nombre = nombre64;
              }
              item.Nombre = item.Nombre + item.Detalleprod;

              return item;
            });
            factura.Detalles = detalles;
            observacion64 = window.atob(
              factura.Comprobante.Observaciones64.trim()
            );
            if (observacion64) {
              factura.Comprobante.Observaciones = observacion64;
            }
          } else {
            if (maquina > 0) {
              urlEnvio =
                "https://server1ts.net/financiero/inc/electPos.titan.php";
            } else {
              urlEnvio = "https://server1ts.net/financiero/inc/elect.titan.php";
              //urlEnvio = "https://server1ts.net/financiero/inc/api_titan/elect.titanT.php";
            }

            let detalles = factura.invoice_lines.map((item) => {
              nombre64 = window.atob(
                item.base1_pr.trim() +
                  item.base2_pr.trim() +
                  item.base3_pr.trim() +
                  item.base4_pr.trim() +
                  item.base5_pr.trim() +
                  item.base6_pr.trim() +
                  item.base7_pr.trim() +
                  item.base8_pr.trim() +
                  item.base9_pr.trim() +
                  item.base10_pr.trim()
              );

              if (nombre64) {
                item.description = nombre64;
              }
              item.description = item.description + item.notes;

              return item;
            });
            let textob64 = factura.Observaciones64.trim();

            observacion64 = window.atob(textob64);
            if (observacion64) {
              factura.Observaciones64 = observacion64;
            }
          }

          factura.socios.pop();

          let textoSocios = "";
          if (factura.socios.length > 0) {
            textoSocios =
              "_ Consorciados:\n" +
              factura.socios
                .filter((s) => s.descr_socio && s.nit_socio && s.porc_socio) // Ignora los vacíos
                .map((s) => {
                  const nombre = s.descr_socio.trim();
                  const nit = s.nit_socio.trim();
                  const porcentaje = s.porc_socio;
                  return `${nombre} - NIT: ${nit} - Participación: ${porcentaje}`;
                })
                .join("\n");
          }
          if (this.datosEmpresa.tipoconsorc_empr == 9) {
            textoSocios = "";
          }

          factura.notes = factura.Observaciones64
            ? factura.Observaciones64 + "\n" + textoSocios
            : textoSocios;

          if (this.texto_b64) {
            factura.annexes[0].document = this.texto_b64;
            factura.annexes[0].extension = "pdf";
          } else if (this.datosEmpresa.provfact_empr == "1") {
            console.log("facse");
          } else {
            factura.annexes.shift();
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
                      .SendBillSyncResult.ErrorMessage.string;
                  console.log(mensaje);
                  if (
                    mensaje ===
                    "Regla: 90, Rechazo: Documento procesado anteriormente."
                  ) {
                    cufe =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.XmlDocumentKey;
                    this.grabar_cufe(item, cufe, new_index);
                  } else {
                    this.send_error(mensaje);
                  }
                }
                this.grabar_cufe(item, cufe, new_index);
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
          console.log(err);
          this.send_error(err);
        });
    },
    grabar_cufe(item, cufe, new_index) {
      if (cufe == "undefined") {
        cufe = "";
      }
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
          url: "Ptovta/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          if (!cufe == "") {
            this.item_envio = item;
            this.loader = true;
            this.send_mail(new_index);
            this.$emit("snack", {
              color: "success",
              text: "Factura enviada a la Dian ",
              estado: true,
            });
            this.$emit("snack", {
              color: "success",
              text: "Cufe Grabado",
              estado: true,
            });
          }

          if (!new_index) {
            this.cargarcontenido();
            this.card.loader = false;
            this.card.disabled = false;
          }
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
          url: "Ptovta/dlls/PrFact01J.dll",
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
      if (item.provdian_fact == "") {
        this.get_pdf_facse(item);
      } else {
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
            url: "Ptovta/dlls/PrFact01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then(async (data) => {
            this.correodestino = data[0].email_cliente.trim();
            this.correodestino2 = data[0].email2_cliente.trim();
            this.correodestino3 = data[0].email3_cliente.trim();
            this.card.loader = false;
            this.card.disabled = false;
            tipoimpresion = data[0].impresion_fact;

            if (this.item_mail == 1) {
              tipoimpresion = 0;
            }
            if (tipoimpresion == "1") {
              this.get_pdf_pos(data[0]);
            } else if (this.item_mail == 1) {
              this.item_mail = 0;
              return await this.generar_pdf_2(data[0], getBase64);
            } else {
              return await this.generar_pdf_2(data[0], getBase64);
              // this.generar_pdf(data[0]);
            }
          })
          .catch((err) => {
            console.log(err);
            this.card.loader = false;
            this.card.disabled = false;
            this.send_error("Error al imprimir el documento");
          });
      }
    },
    async leerArchivo() {
      try {
        let urlArchivo = `./../../datos/Image/clientes/901289171.png`;
        var formData = new FormData();
        formData.append("ruta", urlArchivo);

        const response = await fetch(
          "https://server1ts.net/Financiero/INC/get.file.php",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar el archivo.");
        }

        const logo = await response.text();
        return logo;
      } catch (error) {
        console.error("Error al leer el archivo:", error);
        this.send_error("Error al cargar logo");
        return null; // o puedes lanzar el error de nuevo si deseas manejarlo en otro lugar
      }
    },

    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      // const logo = await this.leerArchivo();

      // if (logo) {
      //   data.logo = "data:image/png;base64," + logo;
      //   data.condicion = this.condicion_pdf;

      //   if (data.formato_fact === "02") {
      //     if (getBase64) return await factura_gyro(data, getBase64);
      //     else factura_gyro(data);
      //   } else {
      //     if (getBase64) return await factura_titan(data, getBase64);
      //     else factura_titan(data);
      //   }
      // }

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
      this.contenido = [];

      if (!this.form.punto_fact) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona un punto de facturación",
          estado: true,
        });
      } else if (!this.form.pref_fact) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona un prefijo",
          estado: true,
        });
      } else {
        var agencia = this.form.punto_fact;
        let prefijo = this.form.pref_fact.prefijo_resd;
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        let cliente = this.form.clientes.identificacion_rut;
        let pendientes = this.form.pendientes ? "1" : "0";

        this.loader = true;

        post
          .postData({
            url: "ptovta/dlls/PrFact02J.dll",
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
              "|" +
              prefijo +
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
    cargarTablaAg() {
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
    enviar_masivo(datos) {
      let usuario = parseFloat(sessionStorage.Sesion.substr(15, 15));

      if (usuario === 86007243) {
        datos.forEach((el) => {
          if (el.iddian_fact && el.iddian_fact.trim() !== "") {
            el.iddian_fact = "";
          }
        });
      }
      var data = datos.filter((el) => !el.iddian_fact.trim());

      this.masivo.data = JSON.parse(JSON.stringify(data));
      if (data.length > 0) {
        this.cargar_json(0);
      } else {
        this.$emit("snack", {
          color: "error",
          text: "No hay datos para procesar",
          estado: true,
        });
      }
    },
    async cargar_json(index) {
      this.dialogo_rango.estado = false;
      var item = this.masivo.data[index];
      // this.get_json_dian(item);

      let new_index = index + 1;

      if (new_index == this.masivo.data.length) {
        await this.get_json_dian(item);
      } else await this.get_json_dian(item, new_index);
    },
    init_dialogo_rango() {
      this.dialogo_rango = {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      };
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
    async get_dian(item) {
      this.loader = true;
      let cufe = item.iddian_fact.trim();
      let idempr = this.datosEmpresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/statusfact.php";
      var formData = new FormData();
      formData.append("token", idempr);
      formData.append("cufe", cufe);
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.loader = false;
        })
        .then(async (response) => {
          this.loader = false;
          this.$emit("snack", {
            color: "indigo",
            text: "Id Actualizado Correctamente",
            estado: true,
          });
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
