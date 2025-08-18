<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-bank-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Emisión de Créditos</v-list-item-title
              >
            </v-list-item-content>
                                        <v-col class="d-flex" cols="5">
                <v-switch
                  v-model="form.pendientes"
                  label="Pendientes por Desembolsar"
                  @change="cargarcontenido"
                ></v-switch>
              </v-col>

          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
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
              item-key="nro_rep"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${item.color_rep}`"
                  >{{ item.descestado_rep }}
                </v-chip>
              </template>

              <template v-slot:item.print_aprob="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_soporte(item)"
                      color="orange"
                      fab
                      small
                      icon
                      :disabled="item.estado_rep == 1 ? false : true"
                      v-on="on"
                    >
                      <v-icon>mdi-text-box-check-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Soporte Aprobación</span>
                </v-tooltip>
              </template>

              <template v-slot:item.validar_firmas="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_validar(item)"
                      color="deep-purple"
                      fab
                      small
                      icon
                      :disabled="item.valida_rep == 1 ? true : false"
                      v-on="on"
                    >
                      <v-icon>mdi-check-decagram</v-icon>
                    </v-btn>
                  </template>
                  <span>Validar Firmas</span>
                </v-tooltip>
              </template>

              <template v-slot:item.activar_desemb="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="open_activar(item)"
                      color="deep-purple"
                      fab
                      small
                      icon
                      :disabled="
                        item.desembolso_rep == 1
                          ? true
                          : false || item.estado_rep == 0
                          ? true
                          : false
                      "
                      v-on="on"
                    >
                      <v-icon>mdi-currency-usd</v-icon>
                    </v-btn>
                  </template>
                  <span>Activar Desembolso</span>
                </v-tooltip>
              </template>
              <template v-slot:item.contab_desemb="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="contabilizar(item)"
                      color="deep-purple"
                      fab
                      small
                      icon
                      :disabled="!item.banco_rep.trim()"
                      v-on="on"
                    >
                      <v-icon>mdi-human-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Contabilizar Desembolso</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="800px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="mb-2">
            <v-col class="d-flex" cols="5">
              <v-select
                :items="categorias"
                label="Categoria"
                outlined
                clearable
                hide-details
                v-model="form.categoria"
                required
                :error="errores.categoria"
                @change="errores.categoria = false"
                return-object
              >
              </v-select>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Cuenta Bancaria"
                v-model="form.ctabanco"
                :items="tablaPuc"
                :item-text="format_cuentac"
                item-value="cod_puc"
                hide-details
                return-object
                :error="errores.ctabanco"
                @change="errores.ctabanco = false"
                outlined
              ></v-autocomplete>
            </v-col>
            <v-row class="d-flex mt-3 justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Valor Aprobado"
                  clearable
                  outlined
                  type="text"
                  v-model="form.vlr_aprobado"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Tasa Mensual"
                  clearable
                  outlined
                  type="text"
                  v-model="form.tasa"
                  hide-details
                ></v-text-field>
              </v-col>

            </v-row>
          </v-row>

          <v-row class="d-flex mt-3 mb-3 justify-center" no-gutters>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Consecutivo"
                clearable
                type="text"
                v-model="form.consecutivo"
                hide-details
                @input="errores.consecutivo = false"
                :error="errores.consecutivo"
              ></v-text-field>
            </v-col>

            <v-col class="ml-3 d-flex" sm="4">
              <v-menu
                v-model="pickerFechaini"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaemis"
                    label="Fecha Emisión:"
                    append-icon="event"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaemis"
                  @input="
                    pickerFechaini = false;
                    errores.fechaini = false;
                  "
                ></v-date-picker>
              </v-menu>
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
            @click="activar_item()"
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
        <v-card-title>Validar Firmas</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-switch
                v-model="form.aprobar_val"
                hide-details
                label="Aprobar Validación"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-btn
                depressed
                color="red"
                class="white--text px-12 mx-5"
                @click="print_firmados(item)"
                >Ver Firmados</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" text @click="grabar_validar">Validar</v-btn>
          <v-btn color="indigo" text @click="cancelar_pdfs">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { formato_amortiza } from "../../_formatos_asoc.js";

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

      styleObject: { border: "2px solid #01579B" },
      pickerFecha_reg: false,
      pickerFecha_acta: false,
      pickerFechaini: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      consecutivo: null,
      expanded: [],
      contenido: [],
      tablaPuc: [],
      item_select: null,

      categorias: [
        { text: "Categoria A", value: "A" },
        { text: "Categoria B", value: "B" },
        { text: "Categoria C", value: "C" },
        { text: "Categoria D", value: "D" },
        { text: "Categoria E", value: "E" },
      ],
      estado: [
        { text: "Aprobado", value: 1 },
        { text: "Aplazado", value: 2 },
        { text: "Negado", value: 3 },
      ],

      datosEmpresa: [],
      tab: 0,
      item: null,
      search: null,
      form: {},
      error: {
        ccosto: false,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Linea", align: "center", value: "desclinea_rep" },
        { text: "Descripción", align: "left", value: "solicitante_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Imprimir Aprobación", value: "print_aprob", align: "center" },
        { text: "Validar Firmas", value: "validar_firmas", align: "center" },
        {
          text: "Activar Desembolso",
          value: "activar_desemb",
          align: "center",
        },
        { text: "Contabilizar", value: "contab_desemb", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        categoria: false,
        ctabanco: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.get_puc();
    this.form.fechaemis = this.$moment().format("YYYY-MM-DD");
    this.form.pendientes = true;
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
    get_puc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "1" + "|" + 4 + "|" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
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
    async grabar_validar() {
      let consecutivo = parseFloat(this.item_select.nro_rep);
      let solicitud = parseFloat(this.item_select.solicitud_rep);

      let validado = this.form.aprobar_val ? "1" : "0";
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrEstcred02.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            consecutivo +
            "|" +
            validado +
            "|" +
            solicitud +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.dialogo_archivo.estado = false;
          this.cargarcontenido();
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

    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    print_soporte(item) {
      const url =
        `https://drive.google.com/file/d/` +
        item.iddriveaprob_rep.trim() +
        `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
    },
    print_firmados() {
      const url =
        `https://drive.google.com/file/d/` +
        this.item_select.iddrivesopor_rep.trim() +
        `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
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
      let pendientes = this.form.pendientes ? "1" : "0";
      post
        .postData({
          url: "Asociados/dlls/PrEstcredJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + pendientes + "|",
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
    get_validar(item) {
      this.item_select = item;
      this.consecutivo = item.nro_rep.replace(/\ /g, "");
      this.dialogo_archivo.estado = true;
      this.dialogo_archivo.ruta_pdf = item.nro_rep.trim();
      this.dialogo_archivo.consecutivo = item.nro_rep.trim();
    },
    cancelar_pdfs() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
    },
    open_activar(item) {
      this.item = item;
      console.log(item);

      this.dialogo.estado = true;
      this.form.vlr_aprobado = this.formatNumero(item.valor_rep.trim());
      this.form.tasa = item.intercte_rep.trim();
      this.form.consecutivo = 12825;
    },
    contabilizar(item) {
      let categoria = item.catdesemb_rep;
      let cuenta = item.banco_rep;
      let consecutivo = item.nro_rep.trim();
      let tasa = this.form.tasa.replace(/\-/g, "").trim();

      this.card_estado = true;

      let datos = {
        url: "Asociados/dlls/PrDesembolso.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consecutivo +
          "|" +
          categoria +
          "|" +
          cuenta +
          "|" +
          tasa +
          "|",

        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Desembolso Activado correctamente",
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

    activar_item() {
      if (!this.form.categoria) {
        this.errores.categoria = true;
        this.send_error("Debe Seleccionar una categoria");
      } else if (!this.form.ctabanco) {
        this.errores.ctabanco = true;
        this.send_error("Debe Seleccionar una cuenta de desembolso");
      } else {
        let categoria = this.form.categoria.value;
        let cuenta = this.form.ctabanco.cod_puc;
        let fecha = this.form.fechaemis.replace(/\-/g, "");
              let tasa = this.form.tasa.replace(/\-/g, "").trim();
        let consecutivo = this.item.nro_rep.trim();
        let nro_cred = this.form.consecutivo
          ? this.form.consecutivo.trim()
          : "0";
        this.card_estado = true;

        let datos = {
          url: "Asociados/dlls/PrDesembolso.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            consecutivo +
            "|" +
            categoria +
            "|" +
            cuenta +
            "|" +
            nro_cred +
            "|" +
            fecha +
            "|" +
            tasa +
            "|",

          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: "Desembolso Activado correctamente",
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
