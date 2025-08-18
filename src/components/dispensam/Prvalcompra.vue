<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1400" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Validación y Acuse de Compras</v-list-item-title
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
                      label="Fecha Busqueda"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                    @change="get_facturas()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="mb-4" cols="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="get_facturas()"
                >
                  Consultar Acuse
                  <v-icon right dark class="ml-4"
                    >mdi-card-search-outline</v-icon
                  >
                </v-btn>
              </v-col>

              <v-col class="mb-3" cols="3">
                <v-btn
                  color="red"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="buscar_correos()"
                >
                  Cargar Correos
                  <v-icon right dark class="ml-4"
                    >mdi-card-search-outline</v-icon
                  >
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="form.pendientes"
                  @change="get_facturas"
                  label="Solo Pendientes de Acuse"
                ></v-switch>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col class="mb-4" cols="5">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row> -->
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
            <v-divider color="#FF6F00"></v-divider>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="nrofact_rep"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Recibido Factura:</b>
                        </td>
                        <td>{{ item.LgRec }}</td>

                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="pdffact_item(item, '1')"
                              color="blue accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-hand-extended-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>Acuse Recibo de Factura</span>
                        </v-tooltip>
                      </tr>

                      <tr>
                        <td>
                          <b>Recibo Servicio/Mercancías:</b>
                        </td>
                        <td>{{ item.LgRem }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="pdffact_item(item, '3')"
                              color="orange accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-package-variant</v-icon>
                            </v-btn>
                          </template>
                          <span>Recibo de Bienes/Servicios</span>
                        </v-tooltip>
                      </tr>
                      <tr>
                        <td>
                          <b>Aceptación Factura</b>
                        </td>
                        <td>{{ item.LgAce }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="pdffact_item(item, '4')"
                              color="green darken-1"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-check-bold</v-icon>
                            </v-btn>
                          </template>
                          <span>Aceptacion de la Factura</span>
                        </v-tooltip>
                      </tr>
                      <tr>
                        <td>
                          <b>Rechazo Factura:</b>
                        </td>
                        <td>{{ item.LgReh }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="get_rechazo(item, '2')"
                              color="red accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-alert-remove</v-icon>
                            </v-btn>
                          </template>
                          <span>Rechazo de la Factura</span>
                        </v-tooltip>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>

              <template v-slot:item.pdffact="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '6')"
                      color="red accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Pdf</span>
                </v-tooltip>
              </template>

              <template v-slot:item.recibof="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '1')"
                      color="blue accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fecharecfact_rep ? true : false"
                    >
                      <v-icon>mdi-hand-extended-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Acuse Recibo de Factura</span>
                </v-tooltip>
              </template>
              <template v-slot:item.recibob="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '3')"
                      color="orange accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fecharecmfact_rep ? true : false"
                    >
                      <v-icon>mdi-package-variant</v-icon>
                    </v-btn>
                  </template>
                  <span>Recibo de Bienes/Servicios</span>
                </v-tooltip>
              </template>

              <template v-slot:item.aceptaf="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '4')"
                      color="green darken-1"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fechaacepfact_rep ? true : false"
                    >
                      <v-icon>mdi-check-bold</v-icon>
                    </v-btn>
                  </template>
                  <span>Aceptacion de la Factura</span>
                </v-tooltip>
              </template>

              <template v-slot:item.rechazof="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_rechazo(item, '2')"
                      color="red accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fecharechfact_rep ? true : false"
                    >
                      <v-icon>mdi-alert-remove</v-icon>
                    </v-btn>
                  </template>
                  <span>Rechazo de la Factura</span>
                </v-tooltip>
              </template>

              <template v-slot:item.estadodian="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="consultadian_item(item)"
                      color="green"
                      fab
                      x-large
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Estado RaDian</span>
                </v-tooltip>
              </template>
              <template v-slot:item.idcont_rep="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="ver_contab(item)"
                      color="purple"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.idcont_rep.trim() == ''"
                    >
                      <v-icon>mdi-human-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Contabilización</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" md="8">
              <v-autocomplete
                :items="tipos"
                label="Motivo Devolucion"
                outlined
                clearable
                hide-details
                v-model="form.tipo"
                item-value="value"
                required
                :error="errores.tipo"
              ></v-autocomplete>
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
            @click="rechazo_item()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1700" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.inputbarra fieldset
  border-width: 2px!important
  color: #ffa500
</style>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

import { doc_inventario } from "../../_formatos_disp.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      pickeFechaIni: false,
      dialogPicker: false,
      dialogPickervence: false,
      fecha_ini: this.$moment().format("YYYY-MM-02"),
      // fecha_ini: this.$moment().format("2023-10-17"),
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      btnRefresh: {
        loader: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      dialogocontab: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoregistro: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      item_selecc: [],
      loader: false,
      dialog: true,
      valid: false,
      singleExpand: true,
      vlr_iva0: 0,
      vlr_iva19: 0,
      vlr_iva5: 0,
      expanded: [],
      contenido: [],
      contenidofact: [],
      conceptosc: [],
      cuentas: [],
      cuentasica: [],
      cuentasiva: [],
      cuentasrte: [],
      tablaruts: [],
      tablaccosto: [],
      headersfact: [
        // { text: "Cod_Proveedor", align: "center", value: "cod" },
        { text: "Opciones", align: "center", value: "action" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Presentación", align: "left", value: "press" },
        { text: "Cum", align: "left", value: "cum" },
        { text: "Laboratorio", align: "left", value: "laboratorio" },
        { text: "Lote", align: "left", value: "lote" },
        { text: "Vence", align: "left", value: "fechaVenc" },
        // { text: "Unid", align: "center", value: "unit" },
        { text: "Cantidad", align: "center", value: "cantidad" },
        { text: "Vlr. Unit", align: "center", value: "vlrUnit" },
        { text: "Vlr. Total", align: "center", value: "vlrTotal" },
        { text: "Opciones", value: "option", align: "center" },
        { text: "Nombre Interno", align: "center", value: "descr_med" },
        // { text: "Homologado", align: "center", value: "descr_rep" },
        // { text: "Código", align: "center", value: "codigo" },
      ],
      Item: [],
      datos_proveedor: {
        direccion_proveedor: null,
        telefono_proveedor: 0,
        correo_proveedor: null,
        ciudad_proveedor: 0,
      },
      tipos: [
        { text: "1. Documento con inconsistencias", value: 1 },
        { text: "2. Mercancía no entregada totalmente", value: 2 },
        { text: "3. Mercancía no entregada parcialmente", value: 3 },
        { text: "4. Servicio no prestado", value: 4 },
      ],
      errores: {
        ctacompra: false,
        ctapasivo: false,
        ctartefte: false,
        ctarteica: false,
        ctaiva1: false,
        ctaiva2: false,
        conc_conta: false,
        ccosto: false,
        medicamento: false,
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

      search: "",
      id_file: "",
      form: {
        vlriva19: 0,
        vlriva5: 0,
        vlrretefte: 0,
        vlrrteica: 0,
        vlrcompra: 0,
        vlrpasivo: 0,
        producto: null,
        subtotal: 0,
        proveed_sel: null,
      },
      card_estado: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Proveedor", align: "left", value: "nombreprov_rep" },
        { text: "Factura", align: "center", value: "nrofact_rep" },
        { text: "Fecha Factura", align: "center", value: "fechafact_rep" },
        { text: "Pdf", align: "center", value: "pdffact" },
        { text: "Ver Contabilidad", value: "idcont_rep", align: "center" },

        { text: "Recibo Factura", value: "recibof", align: "center" },
        { text: "Recibo Bienes/Servicios", value: "recibob", align: "center" },
        { text: "Aceptación Factura", value: "aceptaf", align: "center" },
        { text: "Rechazo Factura", value: "rechazof", align: "center" },
        { text: "Estado Dian", value: "estadodian", align: "center" },
      ],

      medicamentos: [],
      medicamento: null,
      producto_cod: "",
    };
  },
  async created() {
    await this.get_empresa();
    await this.consultar_xml();
    this.form.pendientes = false;
    await this.get_facturas();
  },

  computed: {
    registros_validados() {
      return this.contenidofact.every((elemento) => elemento.cod_med);
    },
  },
  methods: {
    ver_contab(item) {
      let tipoDocumento = "E01";
      let agencia = "0006";
      let fecha = item.fechafact_rep.replace(/\-/g, "");
      fecha = fecha.substring(0,6)
      let nro = item.idcont_rep.substring(7,13);
      let datosEnvio =
        sessionStorage.Sesion +
        "|" +
        tipoDocumento +
        "|" +
        fecha +
        "|" +
        nro +
        "|" +
        agencia +
        "|" +
        0 +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrReimpinvJ.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.generar_pdf(data[0]);
        });
    },
    generar_pdf(data) {
      data.registros.pop();
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.fecha_impr = this.$moment().format("YYYY-MM-DD");
        data.hora_impr = this.$moment().format("HH:mm");

        doc_inventario(data).then(() => {
          console.log("Impresión terminada");
        });
      });
    },
    async buscar_correos() {
      this.form.pendientes = true;
      await this.consultar_xml();
      this.get_facturas();
    },
    consultadian_item(item) {
      let cufe = item.cufe_rep;
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    async get_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          let tokenemail = this.datosEmpresa.tokenacuse_empr.trim();
          if (!tokenemail) {
            this.$emit("snack", {
              color: "error",
              text: "Token Titan sin Registrar",
              estado: true,
            });
          }
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    async consultar_xml() {
      this.loader = true;
      let hostname = this.datosEmpresa.hostacuse_empr.trim();
      let username = this.datosEmpresa.correoacuse_empr.trim();
      let tokenemail = this.datosEmpresa.tokenacuse_empr.trim();
      let fecha = this.fecha_ini.split("-").join("");
      let empresa = this.datosEmpresa.descrip_empr.trim();
      let session = sessionStorage.Sesion;

      let data = new FormData();
      data.append("hostname", hostname);
      data.append("username", username);
      data.append("tokenemail", tokenemail);
      data.append("fecha", fecha);
      data.append("empresa", empresa);
      data.append("session", session);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/acuse.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      for (const item of response) {
        let fechacorreo = this.fecha_ini.split("-").join("");
        let acuseRes = await post.postData({
          url: "Financiero/dlls//PrAcuse.dll",
          data:
            [
              sessionStorage.Sesion,
              item.cufe,
              item.idProv,
              item.nombreProv,
              item.nrofact,
              item.fecha,
              item.file,
              item.idpdf,
              item.idbase64,
              fechacorreo,
            ].join("|") + "|",
          method: "",
        });
        this.loader = false;
      }
    },
    async get_facturas() {
      this.loader = true;
      var fecha = this.fecha_ini.split("-").join("");
      let pendientes = this.form.pendientes ? "1" : "0";
      await post
        .postData({
          url: "Financiero/dlls//PrAcuseJ.dll",
          data: sessionStorage.Sesion + "|" + pendientes + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.error(err);
          this.loader = false;
          this.send_error("Error al consultar facturas");
        });
    },
    get_rechazo(item, evento) {
      //(item, '2')
      this.Item = item;
      this.id_file = item.idbase64.trim();
      this.dialogo.estado = true;
    },
    async rechazo_item() {
      this.dialogo.estado = false;
      // console.log(this.form.tipo)
      let motivo = this.form.tipo;
      let item = this.Item;
      let idFile = this.id_file;
      let data = new FormData();
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "xml") {
        this.acuse_rechazo(item, 2, motivo, response.content);
      }
    },
    async acuse_rechazo(item, evento, motivo, base64) {
      this.loader = true;
      let tipo = this.form.tipo;
      let token = this.datosEmpresa.tokentitan_empr.trim();
      let xml = item.nombrexml.trim();
      let data = new FormData();
      data.append("event", evento);
      data.append("file", xml);
      data.append("token", token);
      data.append("base64", base64);
      data.append("type_rejection", motivo);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/eventos.dian.php",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) =>
          res.json().catch((err) => {
            this.loader = false;
          })
        )
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
        });

      if (response) {
        let cufe = item.cufe_rep.trim();
        let codresp = 1;
        post
          .postData({
            url: "Financiero/dlls//PrAcuse01.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cufe +
              "|" +
              evento +
              "|" +
              codresp +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Evento grabado correctamente",
              estado: true,
            });
            this.get_facturas();
          })
          .catch((err) => {
            console.error(err);
            this.loader = false;
            this.send_error("Error al generar evento");
          });
      } else {
        this.loader = false;
        this.send_error("Error al generar evento");
      }
    },
    async acusefact_item(item, evento, base64) {
      this.loader = true;
      let motivo = "";
      let token = this.datosEmpresa.tokentitan_empr.trim();
      let xml = item.nombrexml.trim();
      let data = new FormData();
      data.append("event", evento);
      data.append("file", xml);
      data.append("token", token);
      data.append("base64", base64);
      data.append("type_rejection", motivo);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/eventos.dian.php",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) =>
          res.json().catch((err) => {
            this.loader = false;
          })
        )
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
        });

      if (response) {
        let cufe = item.cufe_rep.trim();
        let codresp = 1;
        post
          .postData({
            url: "Financiero/dlls//PrAcuse01.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cufe +
              "|" +
              evento +
              "|" +
              codresp +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Evento grabado correctamente",
              estado: true,
            });
            this.get_facturas();
          })
          .catch((err) => {
            console.error(err);
            this.loader = false;
            this.send_error("Error al generar evento");
          });
      } else {
        this.loader = false;
        this.send_error("Error al generar evento");
      }
    },
    async pdffact_item(item, evento) {
      let idFile = "";
      if (evento === "6") idFile = item.iddrive.trim();
      else if (
        evento === "1" ||
        evento === "2" ||
        evento === "3" ||
        evento === "4"
      )
        idFile = item.idbase64.trim();

      let data = new FormData();
      // data.append("idFile", "11C186WqAX03-_sagkqfW7-6qIGHb4A8k") // PDF
      // data.append("idFile", "1PSCDTl__HzUZJXTKDm0o-4s4sepxLbT8") // XML
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "pdf") {
        const url = `https://server1ts.net//tmp/${response.fileName}`;
        window.open(url, "_blank").focus();
      } else if (response.type === "xml") {
        this.acusefact_item(item, evento, response.content);
      }
    },
    async printfact_item() {
      let idFile = "";
      idFile = this.item_selecc.iddrive.trim();

      let data = new FormData();
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "pdf") {
        const url = `https://server1ts.net//tmp/${response.fileName}`;
        window.open(url, "_blank").focus();
      }
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
