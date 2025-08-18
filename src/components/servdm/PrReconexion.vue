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
              <v-icon size="30" color="blue darken-4 "
                >mdi-upload-network-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >ReconexiÃ³n de Servicio</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="5">
              <v-menu
                v-model="pickerMes"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_doc"
                    label="Fecha SuspensiÃ³n"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    class="fecha"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_doc"
                  scrollable
                  no-title
                  @input="pickerMes = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
                <v-menu
                  ref="menu"
                  v-model="pickerHora"
                  :close-on-content-click="false"
                  :return-value.sync="form.hora"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.hora"
                      label="Hora"
                      outlined
                      class="fecha"
                      hide-details
                      append-icon="mdi-clock-outline"
                      v-bind="attrs"
                      v-on="on"
                      :error="errores.hora"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="pickerHora"
                    v-model="form.hora"
                    @click:minute="
                      $refs.menu.save(form.hora);
                      errores.hora = false;
                    "
                  ></v-time-picker>
                </v-menu>
              </v-col>

          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  label="Usuario"
                  v-model="form.usuario"
                  :items="usuarios"
                  :item-text="format_usuarios"
                  item-value="cod_rep"
                  clearable
                  hide-details
                  return-object
                  @change="(errores.usuario = false), select_usuario()"
                  :error="errores.usuario"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Medidor"
                  disabled
                  type="text"
                  v-model="form.medidor"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="DescripciÃ³n"
                  disabled
                  type="text"
                  v-model="form.descripcion"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="DirecciÃ³n"
                  disabled
                  type="text"
                  v-model="form.direccion"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="Barrio"
                  disabled
                  type="text"
                  v-model="form.barrio"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Ciudad"
                  disabled
                  type="text"
                  v-model="form.ciudad"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Morosidad"
                  clearable
                  type="text"
                  v-model="form.morosidad"
                  @change="errores.morosidad = false"
                  :error="errores.morosidad"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Lectura"
                  clearable
                  type="text"
                  v-model="form.lectura"
                  @change="errores.lectura = false"
                  :error="errores.lectura"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-row>
          <v-col class="d-flex justify-end" cols="12">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="guardar_reconexion()"
            >
              Grabar ReconexiÃ³n
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;
// import JsonExcel from "vue-json-excel";
import { PDFDocument } from "pdf-lib";
import Chart from 'chart.js/auto'

import { suspension } from "../../_formatos_sdm.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      consecutivo: 0,
      pickerMes: false,
      pickerHora: false,
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoModificar: {
        estado: false,
        data: false,
      },

      dialogoFinancia: {
        estado: false,
        data: false,
      },
      tablefinanc: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "pago_no",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "saldo",
            align: "right",
          },
          {
            text: "Pago capital",
            value: "pago_capital",
            align: "right",
          },
          {
            text: "Pago Int.",
            value: "interes",
            align: "right",
          },
          {
            text: "Total Cuota",
            value: "monto_pago",
            align: "right",
          },
          {
            text: "Sdo. capital",
            value: "saldo_capital",
            align: "right",
          },
          {
            text: "Fecha",
            value: "fecha",
            align: "center",
          },
        ],
      },

      dialog: true,
      valid: false,
      dialogPicker: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      dialogPickerini: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      nvocontenido: [],
      list_select: [],
      total_recaudo: 0,
      total_capital: 0,
      total_intereses: 0,
      cuotas_ptes: 0,
      financia_ant: 0,
      nvo_consec: 0,
      financiaciones: [],
      item_selecc: [],
      usuarios: [],
      conceptos: [],
      tipoliq: [
        { text: "Factor", value: 1 },
        { text: "Tasa Mensual", value: 2 },
      ],
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 5,
        masked: false,
      },
      table: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "nrocuota_rep",
            align: "center",
          },

          {
            text: "Sdo.Capital",
            value: "sdocapital_rep",
            align: "center",
            format: "money",
          },
          {
            text: "Capital",
            value: "pagocapital_rep",
            align: "center",
          },
          {
            text: "Intereses",
            value: "pagointer_rep",
            align: "center",
          },
          {
            text: "Total Cuota",
            value: "totalcuota_rep",
            align: "center",
          },
          {
            text: "Nuevo Capital",
            value: "saldocuota_rep",
            align: "center",
          },
          {
            text: "Fecha",
            value: "fechacuota_rep",
            align: "center",
          },
          {
            text: "Cuota Pagada",
            value: "saldocuota_rep",
            align: "center",
          },
        ],
      },
      search: "",
      form: {
        usuario: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Cuota", align: "center", value: "cuotacr_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Capital", align: "center", value: "capital_rep" },
        { text: "Intereses", align: "center", value: "intereses_rep" },
        { text: "Total", align: "center", value: "total_rep" },
        { text: "Editar", value: "edit", align: "center" },
        { text: "Eliminar", value: "anula", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        usuario: false,
        morosidad: false,
        lectura: false,
        hora: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.get_empresa();
    this.cargar_usuarios();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
    };
  },
  computed: {},
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.agencia_recaudo = this.datosEmpresa.agencia_empr;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargar_usuarios() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfusuariosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.usuarios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Usuarios",
            estado: true,
          });
        });
    },
    format_usuarios: function (val) {
      return `${
        val.cod_rep.trim() +
        " - " +
        val.nombres_rep.trim() +
        " - " +
        val.apellido1_rep.trim()
      } `;
    },
    select_usuario() {
      this.form.medidor = this.form.usuario.medidor_rep.trim();
      this.form.descripcion =
        this.form.usuario.nombres_rep.trim() +
        " " +
        this.form.usuario.apellido1_rep.trim();
      this.form.direccion = this.form.usuario.direccion_rep.trim();
      this.form.barrio = this.form.usuario.descripbarrio_rep.trim();
      this.form.ciudad = this.form.usuario.nombreciudad_rep.trim();
    },
    guardar_reconexion() {
      var data = JSON.parse(JSON.stringify(this.form));
      console.log(data);
      if (!data.usuario) {
        this.errores.usuario = true;
        this.send_error("Debe seleccionar un usuario");
      } else if (!data.hora) {
        this.errores.hora = true;
        this.send_error("Debe ingresar hora");
      } else if (!data.morosidad) {
        this.errores.morosidad = true;
        this.send_error("Debe ingresar morosidad");
      } else if (!data.lectura) {
        this.errores.lectura = true;
        this.send_error("Debe ingresar lectura");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      let usuario = data.usuario.cod_rep.trim();
      let morosidad = data.morosidad.trim();
      let lectura = data.lectura.trim();
      let fecha = data.fecha_doc.replace(/\-/g, "");
      let hora = data.hora.replace(/\:/g, "");

      let datos = {
        url: "Servdm/dlls/Prsuspension.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "2" +
          "|" +
          usuario +
          "|" +
          fecha +
          "|" +
          lectura +
          "|" +
          morosidad +
          "|" +
           hora +
          "|",
        method: "",
      };
      // console.log(datos.data);
      post
        .postData(datos)
        .then((data) => {
          this.consecutivo = data[0];
          this.$emit("snack", {
            color: "success",
            text: "Comprobante guardado correctamente",
            estado: true,
          });

          this.dialogo.estado = false;
          this.init_form();
          this.imprimir();
        })
        .catch((error) => {
          this.send_error("Error al grabar comprobante");
        });
    },
    imprimir() {
      let datos = {
        url: "Servdm/dlls/PrsuspensionJ.dll",
        data: sessionStorage.Sesion + "|" + 2 + "|" + this.consecutivo + "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            suspension(data).then(() => {
              console.log("ImpresiÃ³n terminada");
            });
          });
        })
        .catch((error) => {
          this.send_error("Error al imprmir comprobante");
        });
    },
    init_form() {
      this.form = {
        usuario: null,
        morosidad: null,
        lectura: null,
      };

      this.errores = {
        codigo: false,
      };
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

