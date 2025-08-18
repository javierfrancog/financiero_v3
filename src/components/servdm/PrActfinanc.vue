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
                >mdi-currency-rupee</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualiza Financiaciones</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="3">
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
                    label="Fecha Recaudo"
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
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Usuario"
                  v-model="form.usuario"
                  :items="usuarios"
                  :item-text="format_usuarios"
                  item-value="cod_rep"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="(errores.medidor = false), cargarcontenido()"
                  :error="errores.medidor"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Financiaciones"
                  v-model="form.financiac"
                  :items="financiaciones"
                  :item-text="format_financiac"
                  item-value="consec_rep"
                  hide-details
                  clearable
                  outlined
                  return-object
                  @change="(errores.financiac = false), cargarfinanciacion()"
                  :error="errores.financiac"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              :expanded.sync="expanded"
              item-key="cuotacr_rep"
              :search="search"
              v-model="list_select"
              disable-pagination
            >
              <template v-slot:item.pagar="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anula_item(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-empty</v-icon>
                    </v-btn>
                  </template>
                  <span>Pagado</span>
                </v-tooltip>
              </template>

              <template v-slot:body.append>
                <tr>
                  <td colspan="2" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td></td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{ formatNumero(total_capital.toFixed(0)) }}
                    </strong>
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{ formatNumero(total_intereses.toFixed(0)) }}
                    </strong>
                  </td>
                  <td class="text-xs-right text-center">
                    <strong>
                      {{ formatNumero(total_recaudo.toFixed(0)) }}
                    </strong>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
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
import { formato_amortiza } from "../../_formatos_sdm.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickerMes: false,
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
        { text: "Marcar Pago", value: "pagar", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
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

    this.$watch(
      "contenido",
      (contenido) => {
        this.total_recaudo = 0;
        this.total_capital = 0;
        this.total_intereses = 0;

        let total_cuota = 0;
        let total_capital = 0;
        let total_interes = 0;

        contenido.forEach((val) => {
          if (/[,]/.test(val.total_rep)) {
            total_cuota = parseFloat(val.total_rep.replace(/\,/g, "").trim());
          } else {
            total_cuota = parseFloat(val.total_rep);
          }

          this.total_recaudo += total_cuota;
          total_capital = val.capital_rep
            ? parseFloat(val.capital_rep.replace(/\,/g, "").trim())
            : 0;
          this.total_capital += total_capital;
          total_interes = parseFloat(
            val.intereses_rep.replace(/\,/g, "").trim()
          );
          this.total_intereses += total_interes;
        });
      },
      { deep: true }
    );
  },
  computed: {},
  methods: {

    anula_item(item) {
      let consecutivo = item.consec_rep.trim();
      let cuota = item.cuotacr_rep;
      post
        .postData({
          url: "Servdm/dlls/PrActfinanc.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              cuota +
              "|",
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.nvo_consec = data[0]
          this.$emit("snack", {
            color: "success",
            text: "Financiación Actualizada",
            estado: true,
          });
          this.cargarfinanciacion();
        });
    },

    async cargarfinanciacion() {
      this.item_selecc = this.form.financiac;
      let consecutivo = this.form.financiac.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + 1 + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinancia04J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = data;
          this.card.loader = false;
          this.card.disabled = false;
          this.cuotas_ptes = this.contenido.length;
        })
        .catch((err) => {
          this.card.loader = false;
          console.log(err);
          this.card.disabled = false;
          this.send_error("Error al consultar Financiacion");
        });
    },

    cargarcontenido() {
      var data = this.form;
      let usuario = data.usuario.idcontab_rep;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFinancia02J.dll",
          data: sessionStorage.Sesion + "|" + usuario + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.financiaciones = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Financiaciones",
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
    format_financiac: function (val) {
      return `${val.consec_rep.trim() + " - " + val.descrbase_rep.trim()}`;
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
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
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
