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
                >Recaudo de Financiaciones</v-list-item-title
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

            <v-row v-if="this.contenido" class="mb-1">
              <v-col class="d-flex" cols="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPickerini"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Primera Cuota"
                      outlined
                      v-model="form.fechaini"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaini"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
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
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>


              <template v-slot:item.anula="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anula_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-empty</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
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
        <v-row>
          <v-col class="d-flex justify-end" cols="12">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="guardar_recaudo()"
              :disabled="contenido.length == 0"
            >
              Grabar Recaudo
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogoModificar.estado" max-width="600" persistent>
      <v-card
        :loading="dialogoModificar.load"
        :disabled="dialogoModificar.load"
      >
        <v-card-title class="headline">Modificar Pago</v-card-title>

        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Valor Capital"
                outlined
                hide-details
                v-model="form.vlr_capital"
                type="number"
                ref="input_cantidad"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Valor Intereses"
                outlined
                hide-details
                v-model="form.vlr_intereses"
                type="number"
                ref="input_cantidad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            @click="cancelar_modificar"
            >Cancelar</v-btn
          >
          <v-btn
            color="green"
            class="white--text"
            depressed
            @click="guardar_cambios"
            >Guardar cambios</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoFinancia.estado" max-width="900" persistent>
      <v-flex xs12 md12>
        <v-card
          :loading="dialogoFinancia.load"
          :disabled="dialogoFinancia.load"
        >
          <v-card-title class="headline">Generación Financiación</v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Usuario"
                  hide-details
                  disabled
                  v-model="form.usuariorefinanc"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Concepto"
                  hide-details
                  disabled
                  v-model="form.concepto"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-row>
            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="dialogPickerini"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Inicio"
                    outlined
                    disabled
                    v-model="form.fechaini"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaini"
                  @input="pickeFechaIni = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Valor a Financiar"
                outlined
                hide-details
                clearable
                v-model="form.valorfinanc"
              ></v-text-field>
            </v-col>

            <v-col cols="2">
              <v-text-field
                label="Cuotas"
                outlined
                clearable
                hide-details
                v-model="form.cuotasfinanc"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Interés Mensual"
                outlined
                hide-details
                v-model="form.tasafinanc"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mt-2" color="#FF6F00"></v-divider>
          <div class="mt-2 pa-0 px-8">
            <v-card-text class="px-0 pa-0">
              <v-data-table
                :items="tablefinanc.items"
                :headers="tablefinanc.headers"
              >
              </v-data-table>
            </v-card-text>
          </div>

          <v-row> </v-row>
          <v-row> </v-row>
          <v-row> </v-row>
          <v-row> </v-row>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="red darken-1"
              class="white--text"
              depressed
              @click="cancelar_financia"
              >Cancelar</v-btn
            >
            <v-btn
              color="green"
              class="white--text"
              depressed
              @click="guardar_financia"
              >Guardar Financiación</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { PDFDocument } from "pdf-lib";
import Chart from 'chart.js/auto'

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
        { text: "Editar", value: "edit", align: "center" },
        { text: "Eliminar", value: "anula", align: "center" },
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
    editar_item(item) {
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = item;
      this.dialogoModificar.index = this.contenido.indexOf(item);

      this.form.vlr_capital = parseFloat(
        item.capital_rep.replace(/\,/g, "").trim()
      );
      this.form.vlr_intereses = parseFloat(
        item.intereses_rep.replace(/\,/g, "").trim()
      );
    },
    anula_item(item) {
      const index = this.contenido.indexOf(item);
      this.contenido.splice(index, 1);
    },
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
    },
    cancelar_financia() {
      this.dialogoFinancia.estado = false;
    },
    async guardar_financia() {
      this.dialogoFinancia.estado = false;
      let tabla_nvascuotas = await this.enviar_nvatabla(1);
      let item = 0;
      let consecutivo = 0;
      let rut = this.form.usuario.idcontab_rep.trim();
      let codigo = this.form.usuario.cod_rep.trim();
      let fechaini = this.tablefinanc.items[0].fecha.replace(/\-/g, "");
      let valorini = this.form.valorfinanc;
      let cuotas = this.form.cuotasfinanc;
      let tasa = this.form.tasafinanc;
      if (this.form.financiac.concepto_rep == 1003) {
        item = 1;
      } else if (this.form.financiac.concepto_rep == 1050) {
        item = 2;
      }

      post
        .postData({
          url: "Servdm/dlls/PrsdmfinanciaU.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              rut +
              "|" +
              codigo +
              "|" +
              fechaini +
              "|" +
              cuotas +
              "|" +
              valorini +
              "|" +
              tasa +
              "|" +
              item +
              "|" +
              "1" +
              "|" +
              this.financia_ant +
              "|",
            ...tabla_nvascuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.nvo_consec = data[0];
          this.$emit("snack", {
            color: "success",
            text: "Financiación Generada Correctamente",
            estado: true,
          });
          this.imprimir_documento(this.nvo_consec);
        });
    },
    enviar_nvatabla(item) {
      return new Promise((res) => {
        let tablajson = {};
        this.tablefinanc.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let saldo = item.saldo.replace(/\,/g, "");
          let pago_capital = item.pago_capital.replace(/\,/g, "");
          let interes = item.interes.replace(/\,/g, "");
          let pago_no = item.pago_no;
          let fecha = item.fecha.replace(/\-/g, "");
          tablajson[
            `DATOJ-${format_index}`
          ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${fecha}|`;
        });
        res(tablajson);
      });
    },
    guardar_cambios() {
      this.dialogoModificar.estado = false;
      let valorcapital = this.form.vlr_capital ? this.form.vlr_capital : 0;
      this.dialogoModificar.data.capital_rep = this.formatNumero(valorcapital);
      let valorintereses = this.form.vlr_intereses
        ? this.form.vlr_intereses
        : 0;
      this.dialogoModificar.data.intereses_rep =
        this.formatNumero(valorintereses);
      this.dialogoModificar.data.total_rep =
        parseFloat(valorcapital) + parseFloat(valorintereses);
    },
    async cargarfinanciacion() {
      this.item_selecc = this.form.financiac;
      let consecutivo = this.form.financiac.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + 1 + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinancia03J.dll",
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
    imprimir_documento(item) {
      let consecutivo = item;
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            formato_amortiza(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async guardar_recaudo() {
      var data = JSON.parse(JSON.stringify(this.form));
      let consecutivo = data.financiac.consec_rep.trim();
      this.financia_ant = consecutivo;
      let tabla_cuotas = await this.enviar_tabla();
      let fecha = data.fecha_doc.replace(/\-/g, "");
      let agencia = this.agencia_recaudo;
      let total_rec = this.total_recaudo;

      post
        .postData({
          url: "Servdm/dlls/Prsdmrecaudo02.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              fecha +
              "|" +
              agencia +
              "|" +
              total_rec +
              "|",

            ...tabla_cuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.dialogo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Documento Grabado Correctamente",
            estado: true,
          });
          this.abrir_financiacion();
        });
    },
    async abrir_financiacion() {
      this.contenido = [];
      this.total_capital = 0;
      let total_nvocapital = 0;
      this.dialogoFinancia.estado = true;
      total_nvocapital = await this.cargar_nuevatabla();

      this.form.fechaini = this.form.fecha_doc;
      this.form.usuariorefinanc = this.item_selecc.nombrecliente_rep.trim();
      this.form.concepto = this.item_selecc.descrbase_rep.trim();
      this.form.cuotasfinanc = this.cuotas_ptes;
      this.form.tasafinanc = this.item_selecc.tasaint_rep.trim();
      this.$set(this.form, "valorfinanc", total_nvocapital);

      // this.form.valorfinanc = total_nvocapital;

      this.table.items = [];
      await this.liquidacion_bancaria();
    },
    cargar_nuevatabla: async function (total_nvocapital) {
      let capital = 0;
      let subtotal = 0;

      this.item_selecc = this.form.financiac;
      let consecutivo = this.form.financiac.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + 1 + "|" + key;
      return await post
        .postData({
          url: "Servdm//dlls/PrFinancia03J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.nvocontenido = data;
          this.card.loader = false;
          this.card.disabled = false;
          this.cuotas_ptes = this.nvocontenido.length;

          this.nvocontenido.forEach((item, index) => {
            let format_index = (index + 1).toString().padStart(3, "0");

            if (/[,]/.test(item.capital_rep)) {
              capital = parseFloat(item.capital_rep.replace(/\,/g, "").trim());
            } else {
              capital = parseFloat(item.capital_rep).trim();
            }
            subtotal = subtotal + capital;
          });
          total_nvocapital = subtotal;
          return total_nvocapital;
        })
        .catch((err) => {
          this.card.loader = false;
          console.log(err);
          this.card.disabled = false;
          this.send_error("Error al consultar Financiacion");
          return false;
        });
    },
    async liquidacion_bancaria() {
      let valor = parseInt(this.form.valorfinanc);
      let cuotas = parseInt(this.form.cuotasfinanc);
      let tasa_interes = parseFloat(this.form.tasafinanc);
      let fecha_inicial = this.form.fechaini;
      let ano = fecha_inicial.substring(0, 4);
      let mes = fecha_inicial.substring(5, 7);
      let dia = fecha_inicial.substring(8, 10);

      (mes = mes.toString().padStart(2, "0")),
        (fecha_inicial = ano + mes + dia);

      let factor1 = (tasa_interes / 100) * valor;
      let basepot = 1 + tasa_interes / 100;
      let potencia = Math.pow(basepot, -cuotas);
      let factor2 = 1 - potencia;
      let tcuota = (factor1 / factor2).toFixed(0);

      let list = [];
      let capital = parseFloat(valor);
      for (let i = 0; i < cuotas; i++) {
        // let pago_capital = (capital / cuotas).toFixed(0);
        // let interes = (capital * (tasa_interes / 100)).toFixed(0);
        // let monto_pago = parseFloat(pago_capital) + parseFloat(interes);
        // let saldo_capital = capital - pago_capital;

        let interes = (capital * (tasa_interes / 100)).toFixed(0);
        let monto_pago = tcuota;
        let pago_capital = (monto_pago - interes).toFixed(0);
        let saldo_capital = capital - pago_capital;

        let fecha = 0;

        fecha = this.$moment(fecha_inicial)
          .add(i, "months")
          .format("YYYY-MM-DD");

        list.push({
          saldo: this.formatNumero(capital),
          pago_capital: this.formatNumero(pago_capital),
          interes: this.formatNumero(interes),
          monto_pago: this.formatNumero(monto_pago),
          saldo_capital: this.formatNumero(saldo_capital),
          pago_no: i + 1,
          fecha,
        });

        capital = saldo_capital;
      }

      this.tablefinanc.items = list;
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.contenido.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let capital = 0;
          let interes = 0;
          let tot_pago = 0;
          let cuota = 0;

          if (/[,]/.test(item.capital_rep)) {
            capital = parseFloat(item.capital_rep.replace(/\,/g, ""));
          } else {
            capital = parseFloat(item.capital_rep);
          }

          if (/[,]/.test(item.intereses_rep)) {
            interes = parseFloat(item.intereses_rep.replace(/\,/g, ""));
          } else {
            interes = parseFloat(item.intereses_rep);
          }

          if (/[,]/.test(item.intereses_rep)) {
            interes = parseFloat(item.intereses_rep.replace(/\,/g, ""));
          } else {
            interes = parseFloat(item.intereses_rep);
          }

          tot_pago = parseFloat(item.total_rep);
          cuota = parseFloat(item.cuotacr_rep.replace(/\,/g, ""));

          tablajson[
            `DATOJ-${format_index}`
          ] = `${cuota}|${tot_pago}|${capital}|${interes}|`;
        });
        res(tablajson);
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
