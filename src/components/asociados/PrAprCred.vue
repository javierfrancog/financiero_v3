<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-check-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Aprobación de Créditos</v-list-item-title
              >
            </v-list-item-content>
            <!-- <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-cart-plus</v-icon>
              </v-btn>
            </v-row> -->
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${item.color_rep} darken-1`"
                  >{{ item.descestado_rep }}</v-chip
                >
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_soporte(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Soporte Aprobacion</span>
                </v-tooltip>
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="orange"
                      fab
                      small
                      icon
                      :disabled="item.estado_rep == 1"
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Aprobar</span>
                </v-tooltip>
              </template>

              <template v-slot:item.pdffirmas="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_pdfFirmas(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-cloud-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Descarga pdf para Firmas</span>
                </v-tooltip>
              </template>

              <template v-slot:item.firmados="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_firmados(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-sign</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir pdfs Firmados</span>
                </v-tooltip>
              </template>
              <template v-slot:item.bloqueo="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_bloquear(item)"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-block-helper</v-icon>
                    </v-btn>
                  </template>
                  <span>Bloquear</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Estudio Número"
                clearable
                outlined
                required
                disabled
                type="number"
                v-model="form.estudio"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="pickerFecha_reg"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Registro"
                    outlined
                    v-model="form.fechareg"
                    hide-details
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechareg"
                  @input="pickerFecha_reg = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="5">
              <v-select
                :items="aprobado"
                label="Aprobado por:"
                outlined
                clearable
                hide-details
                v-model="form.aprobado"
                required
                return-object
              >
              </v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Acta Número"
                clearable
                outlined
                required
                v-model="form.actaNumero"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="pickerFecha_acta"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Acta"
                    outlined
                    v-model="form.fechaacta"
                    hide-details
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaacta"
                  @input="pickerFecha_acta = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-select
                :items="estado"
                label="Estado:"
                outlined
                clearable
                hide-details
                v-model="form.estado"
                required
                return-object
              >
              </v-select>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-file-input
                label="Buscar PDF"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogo_archivo.model"
                id="archivo_pdf"
              ></v-file-input>
            </v-col>
          </v-row>

          <v-divider color="#FF6F00"></v-divider>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.bloquear" label="Bloquear"></v-switch>
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
            class="ma-2 px-4 white--text"
            color="indigo"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogo_archivo.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar Soporte</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-file-input
                label="Buscar PDF"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogo_archivo.model"
                id="archivo_pdf"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
          <v-btn
            depressed
            color="blue darken-2"
            class="white--text px-12 mx-5"
            @click="up_file"
            >Subir archivo</v-btn
          >
        </v-card-actions>  -->
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogo_firmado.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar Pdf con Firmas del solicitante</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-file-input
                label="Buscar PDF"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogo_firmado.model"
                id="archivo_pdf"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_firmado">Cancelar</v-btn>
          <v-btn
            depressed
            color="blue darken-2"
            class="white--text px-12 mx-5"
            @click="up_firmados"
            >Subir archivo</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo_bloqueado.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo_bloqueado.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Estudio Número"
                clearable
                outlined
                required
                disabled
                type="number"
                v-model="form.bloqestudio"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="5">
              <v-select
                :items="mot_bloqueo"
                label="Motivo Bloqueo:"
                outlined
                clearable
                hide-details
                v-model="form.motbloqueo"
                required
                return-object
              >
              </v-select>
            </v-col>
          </v-row>

          <v-divider color="#FF6F00"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_bloqueado.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4 white--text"
            color="indigo"
            depressed
            large
            @click="guardar_bloqueo()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { aprobacionCred } from "../../_formatos_asoc.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      dialogo_firmado: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      dialogo_bloqueado: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        titulo: null,
        consecutivo: null,
      },
      styleObject: { border: "2px solid #01579B" },
      pickerFecha_reg: false,
      pickerFecha_acta: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      item_select: [],

      mot_bloqueo: [
        { text: "Anulación", value: 2 },
        { text: "Desestimiento", value: 3 },
      ],

      aprobado: [
        { text: "Gerencia", value: 1 },
        { text: "Comité de Crédito", value: 2 },
        { text: "Consejo de Administración", value: 3 },
      ],
      estado: [
        { text: "Aprobado", value: 1 },
        { text: "Aplazado", value: 2 },
        { text: "Negado", value: 3 },
      ],

      datosEmpresa: [],
      tab: 0,
      search: null,
      form: {},
      error: {
        ccosto: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Descripción", align: "left", value: "solicitante_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Aprobar", value: "edit", align: "center" },
        { text: "Imprimir Aprobacion", value: "imprimir", align: "center" },
        { text: "Pdf para Firmas", value: "pdffirmas", align: "center" },
        { text: "Subir Pdf firmado", value: "firmados", align: "center" },
        { text: "Bloquear", value: "bloqueo", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
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
    async cargarconsecutivo(solicitud) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrEstcredC.dll",
          data: sessionStorage.Sesion + "|" + solicitud + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.consecutivo = parseInt(data[0].nro);
        })
        .catch((err) => {
          this.dialogo.estado = false;
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    print_item(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      data.ciudad_emp = this.datosEmpresa.Ciudad;
      data.dpto_emp = this.datosEmpresa.Departamento;
      data.id_emp = this.datosEmpresa.ideditado_empr;

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        solicitudDescuento(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    async buscar_item(consecutivo) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrSolcred01J.dll",
          data: sessionStorage.Sesion + "|" + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.solicitud = data[0];
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Solicitudes",
            estado: true,
          });
        });
    },
    async editar_item(data) {
      this.dialogo.estado = true;
      this.dialogo.titulo = "Aprobación de Crédito";
      this.dialogo.tipo = 1;
      this.form.fechareg = this.$moment().format("YYYY-MM-DD");
      this.form.estudio = data.nro_rep.trim();
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fechareg) {
        this.errores.fechareg = true;
        this.send_error("Fecha Obligatoria!");
      } else if (!data.aprobado) {
        this.errores.aprobado = true;
        this.send_error("Tipo Aprobación Obligatoria!");
      } else if (!data.actaNumero) {
        this.errores.actaNumero = true;
        this.send_error("Nro Acta Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },
    async format_envio(data) {
      // this.card_estado = true;
      await this.up_file();
      let fecha = data.fechareg.replace(/\-/g, "");
      let idestudio = data.estudio.trim();
      let actaNumero = data.actaNumero;
      let ente = data.aprobado.value;
      let estado = data.estado.value;

      let datos = {
        url: "Asociados/dlls/PrAprcred.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          idestudio +
          "|" +
          fecha +
          "|" +
          ente +
          "|" +
          actaNumero +
          "|" +
          estado +
          "|",

        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    async guardar_bloqueo() {
      // this.card_estado = true;
      let idestudio = this.item_select.nro_rep.trim();
      let bloqueo = this.form.motbloqueo.value;

      let datos = {
        url: "Asociados/dlls/PrAprcredB.dll",
        data: sessionStorage.Sesion + "|" + idestudio + "|" + bloqueo + "|",

        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo_bloqueado.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
        clasifica: false,
        descripcion: false,

        consecutivo: false,
        nombre: false,
        compañia: false,
        limiteDesc: false,
        ingEntidad: false,
        salarioAct: false,
        dispoDesc: false,
        ingCia: false,
        otrosDesc: false,
        endeudamiento: false,
        proyContrato: false,
        descEntidad: false,
        ultnomPag: false,
        modalidadAhorro: false,
        saldoAct: false,
        descAcum: false,
        benefiCred: false,
        nrocred: false,
        vlrInicial: false,
        saldoAct_cred: false,
        recogeSal: false,
        modalicred: false,
        ncredDeu: false,
        porcpag: false,
        saldoCap: false,
        saldoInt: false,
        saldoTot: false,
        vlrCuota: false,
        ultAbono: false,
        saldoMora: false,
        nrosolicitud: false,
        fsolicitud: false,
        modaliCred_es: false,
        vlrSolici: false,
        vlrCuota_es: false,
        garantia: false,
        iniDescto: false,
        fpago: false,
        nrocuotas: false,
        tasaMensual: false,
        destino: false,
        prestamosr: false,
        vlrGirar: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/PrEstcredJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let data_parse = JSON.parse(JSON.stringify(data));
          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Solicitudes",
            estado: true,
          });
        });
    },
    // get_docs(item) {
    //   this.dialogo_archivo.estado = true;
    //   this.dialogo_archivo.ruta_pdf = item.nro_rep.trim();
    //   this.dialogo_archivo.consecutivo = item.nro_rep.trim();
    // },
    get_pdfFirmas(item) {
      let data = { ...item };
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      data.fechaActual_rep = this.$moment().format("YYYY-MM-DD");
      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        aprobacionCred(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    get_firmados(item) {
      this.dialogo_firmado.estado = true;
      this.dialogo_firmado.ruta_pdf = item.nro_rep.trim();
      this.dialogo_firmado.consecutivo = item.nro_rep.trim();
    },
    get_bloquear(item) {
      this.item_select = item;
      this.dialogo_bloqueado.estado = true;
      this.form.bloqestudio = item.nro_rep.trim();
      this.dialogo_bloqueado.titulo = item.solicitante_rep.trim();
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.consecutivo = null;
    },
    cancelar_firmado() {
      this.dialogo_firmado.estado = false;
      this.dialogo_firmado.model = null;
      this.dialogo_firmado.loader = false;
      this.dialogo_firmado.ruta_pdf = null;
      this.dialogo_firmado.consecutivo = null;
    },
    async up_file2() {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento = "APROBCR";
      let consecutivo = this.form.estudio.trim();
      this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      let file = this.dialogo_archivo.model;

      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        this.dialogo_archivo.estado = false;

        var ruta = `${this.dialogo_archivo.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/creditos.pdf.php", {
          method: "POST",
          body: archivo,
        }).then((res) => res.json());
        this.dialogo_archivo.loader = false;

        this.$emit("snack", {
          color: "success",
          text: "Archivo subido correctamente ",
          estado: true,
        });
      }
    },
    print_soporte(item) {
      const url =
        `https://drive.google.com/file/d/` +
        item.iddriveaprob_rep.trim() +
        `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
      // let empresa = sessionStorage.Sesion.substr(0, 15);
      // let tipoDocumento = "APROBCR";
      // let consecutivo = item.nro_rep.replace(/\ /g, "");
      // let nombrePdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      // var ruta2 = `https://server100ts.net/creditos/${nombrePdf}.pdf`;
      // window.open(ruta2, "_blank");
    },
    async up_file() {
      if (!this.dialogo_archivo.model) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        this.card_estado = true;

        let session = sessionStorage.Sesion;
        let agencia = sessionStorage.Sede;
        let empresa = parseFloat(this.datosEmpresa.id_empr);
        let cargue_pdf = this.dialogo_archivo.model.name;
        let consec = this.form.estudio.trim();
        let tipodoc = "1";
        let nombre_pdf = "APROBADO_" + agencia + "_" + consec + ".pdf";

        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("consecutivo", consec);
        data.append("agencia", agencia);
        data.append("file", this.dialogo_archivo.model);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/cargue.drive.asoc.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.card_estado = false;
        this.$emit("snack", {
          color: "success",
          text: "Soporte Guardado Correctamente",
          estado: true,
        });
      }
    },
    async up_firmados() {
      if (!this.dialogo_firmado.model) {
        this.errores.pdf = true;
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        this.card_estado = true;
        let session = sessionStorage.Sesion;
        let agencia = sessionStorage.Sede;
        let empresa = parseFloat(this.datosEmpresa.id_empr);
        let cargue_pdf = this.dialogo_firmado.model.name;
        let consec = this.dialogo_firmado.consecutivo;
        let tipodoc = "2";
        let nombre_pdf = "FIRMADO_" + agencia + "_" + consec + ".pdf";

        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("consecutivo", consec);
        data.append("agencia", agencia);
        data.append("file", this.dialogo_firmado.model);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/cargue.drive.asoc.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.cargue_soporte = 1;
        this.dialogo_firmado.estado = false;
        this.card_estado = false;

        this.$emit("snack", {
          color: "success",
          text: "Soporte Guardado Correctamente",
          estado: true,
        });
      }
    },
    xup_firmados() {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento = "FIRMADOSCR";
      let consecutivo = this.dialogo_firmado.consecutivo;
      this.dialogo_firmado.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      let file = this.dialogo_firmado.model;

      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        this.dialogo_firmado.estado = false;

        var ruta = `${this.dialogo_firmado.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/creditos.pdf.php", {
          method: "POST",
          body: archivo,
        }).then((res) => res.json());
        this.dialogo_archivo.loader = false;

        this.$emit("snack", {
          color: "success",
          text: res.msj,
          estado: true,
        })
          .catch((err) => {
            console.log(err);
            this.dialogo_archivo.loader = false;
            this.dialogo_firmado.estado = false;
            this.send_error("Ha ocurrido un error subiendo el PDF");
          })
          .then((res) => {
            this.dialogo_archivo.loader = false;
            this.dialogo_firmado.estado = false;
            if (res.code == 0) {
              this.cancelar_subida();

              this.$emit("snack", {
                color: "success",
                text: res.msj,
                estado: true,
              });
            } else {
              this.cancelar_subida();
              this.send_error(res.msj);
            }
          });
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
