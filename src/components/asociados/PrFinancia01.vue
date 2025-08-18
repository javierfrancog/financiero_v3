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
                >mdi-printer-check</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >ReimpresiÃ³n de Financiaciones</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="2">
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
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="2">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
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
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
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
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${item.estado_rep == 1 ? 'red' : 'indigo'} darken-1`"
                  >{{ item.estado_rep == "1" ? "Anulado" : "Activo" }}</v-chip
                >
              </template>

              

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_documento(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Pdf Plan de Pagos</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="excel_documento(item)"
                      color="success"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                  </template>
                  <span>Excel Detallado</span>
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
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                label="Medidor"
                v-model="form.medidor"
                :items="usuarios"
                :item-text="format_usuarios"
                item-value="medidor_rep"
                clearable
                hide-details
                return-object
                outlined
                @change="errores.medidor = false"
                :error="errores.medidor"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
              <v-select
                :items="conceptos"
                :item-text="format_cargos"
                item-value="llavebase_rep"
                label="Concepto"
                outlined
                hide-details
                clearable
                return-object
                v-model="form.concepto"
              ></v-select>
            </v-col>
          </v-row>
          <v-row
            class="ml-2 mr-2 mt-2"
            style="border: 1px solid #ff6f00; border-radius: 5px"
          >
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
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
              <v-col cols="3">
                <v-text-field
                  label="Valor a Financiar"
                  outlined
                  hide-details
                  v-model="form.valor"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Cuotas"
                  outlined
                  hide-details
                  v-model="form.cuotas"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="InterÃ©s Mensual"
                  outlined
                  hide-details
                  v-model="form.tasa"
                ></v-text-field>
              </v-col>
              <!-- <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="tipoliq"
                      label="Tipo LiquidaciÃ³n"
                      outlined
                      clearable
                      v-model="form.tipoliq"
                      required
                      hide-details
                    ></v-select>
                  </v-col>             -->
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="generar_liquidacion()"
                >
                  Generar LiquidaciÃ³n
                  <v-icon right dark class="ml-2"
                    >mdi-calculator-variant-outline</v-icon
                  >
                </v-btn>
              </v-col>
              <v-col cols="4">
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
              </v-col>
              <v-col cols="4">
                <v-btn
                  class="ma-2 px-4"
                  color="success"
                  depressed
                  large
                  @click="grabar_financiacion()"
                  >Guardar</v-btn
                >
              </v-col>
            </v-row>
          </v-row>
          <v-row class="justify-left"> </v-row>
          <v-divider color="#FF6F00"></v-divider>
          <div class="pa-0 px-8">
            <v-card-text class="px-0 pa-0">
              <v-data-table :items="table.items" :headers="table.headers">
              </v-data-table>
            </v-card-text>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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

import { formato_amortiza } from "../../_formatos_asoc.js";

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
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      dialogPickerini: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      ciclos: [],
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
            text: "Sdo. capital",
            value: "sdocapital_rep",
            align: "right",
            format: "money",
          },
          {
            text: "Pago capital",
            value: "pagocapital_rep",
            align: "right",
          },
          {
            text: "Pago Int.",
            value: "pagointer_rep",
            align: "right",
          },
          {
            text: "Total Cuota",
            value: "totalcuota_rep",
            align: "right",
          },
          {
            text: "Sdo. Capital",
            value: "saldocuota_rep",
            align: "right",
          },
          {
            text: "Fecha",
            value: "fechacuota_rep",
            align: "center",
          },
        ],
      },

      search: "",
      form: {
        fechaini: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Id_Usuario", align: "center", value: "codcliente_rep" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "nombrecliente_rep",
        },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
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
    this.cargar_cargos();
    this.form.fechaInicial = this.$moment().format("YYYY-MM-01");
    this.form.fechaFinal = this.$moment().format("YYYY-MM-DD");
  },
  computed: {},
  methods: {
    anulardocumento(item) {
      let consecutivo = item.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrAnulaFinanc.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Documento Procesado Correctamente",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al Anular el documento");
        });
    },

    imprimir_documento(item) {
      let consecutivo = item.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Asociados//dlls/PrFinanciaJ.dll",
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
    excel_documento(item) {
      let consecutivo = item.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Asociados//dlls/PrFinanciaexJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_parse = [];
          let perini = this.form.fechaInicial;
          let perfin = this.form.fechaFinal;

          data.forEach((el) => {
            let copia = JSON.parse(JSON.stringify(el));
            copia.pagocapital_rep = el.pagocapital_rep.trim();

            data_parse.push(copia);
          });

          let columnas = [
            {
              title: "Cuota",
              value: "nrocuota_rep",
            },
            {
              title: "Fecha Cuota",
              value: "fechacuota_rep",
              format: "string",
            },
            {
              title: "Plan Pagos Saldo Capital",
              value: "sdocapital_rep",
              format: "money",
            },
            {
              title: "Plan Pagos Capital",
              value: "pagocapital_rep",
              format: "money",
            },
            {
              title: "Plan Pagos intereses",
              value: "pagointer_rep",
              format: "money",
            },
            {
              title: "Plan Pagos Seguro",
              value: "segurodeud_rep",
              format: "money",
            },
            {
              title: "Plan Pagos Total Cuota",
              value: "totalcuota_rep",
              format: "money",
            },
            {
              title: "Estado Cuota",
              value: "estadocuota_rep",
              format: "string",
            },
            {
              title: "Fecha Pago",
              value: "fechapago_rep",
              format: "string",
            },
            {
              title: "Pago a Capital",
              value: "pagocap_rep",
              format: "money",
            },
            {
              title: "Pago Interes Cte",
              value: "pagoint_rep",
              format: "money",
            },
            {
              title: "Pago Mora",
              value: "pagomora_rep",
              format: "money",
            },
            {
              title: "Pago Seguro",
              value: "pagoseguro_rep",
              format: "money",
            },

          ];

          let header_format = [
            {
              text: "DETALLE FINANCIACION",
              bold: true,
              size: 16,
            },
            `Periodo Inicial:${perini}`,
            `Periodo Final:${perfin}`,
            "",
          ];

          let logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          this.pdfs.getBase64(logo_src).then((logo) => {
            this.excel
              ._informe({
                sheetName: "Detalle Financiacion",
                header: header_format,
                logo,
                tabla: {
                  columnas,
                  totalsRow: false,
                  data: data_parse,
                  // heightRow: 35,
                  theme: "TableStyleMedium2",
                },
                archivo: `DETALLE FINANCIACION-${new Date().getTime()}`,
              })
              .then((data) => {
                console.log("Impresion terminada");
              });
          });
        })
        .catch((err) => {
          console.log(err)
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_liquidacion() {
      // let tipo = parseInt(this.form.tipoliq);
      let tipo = 1;
      if (tipo === 1) {
        this.liquidacion_factor();
      } else {
        this.liquidacion_tasa();
      }
    },

    liquidacion_tasa() {
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      let tasabase = this.form.tasa.replace(/\./g, "");
      let tasa_interes = parseFloat(this.form.tasa);
      let fecha_inicial = this.form.fechaini;

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

        let fecha = this.$moment(fecha_inicial)
          .add(i + 1, "months")
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

      this.table.items = list;
    },
    liquidacion_factor() {
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      let tasa_interes = parseFloat(this.form.tasa);
      let fecha_inicial = this.form.fechaini;

      let ano = fecha_inicial.substring(0, 4);
      let mes = fecha_inicial.substring(5, 7);
      let dia = fecha_inicial.substring(8, 10);
      if (mes > 1) {
        mes = mes - 1;
      }
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
        let interes = (capital * (tasa_interes / 100)).toFixed(0);
        let monto_pago = tcuota;
        let pago_capital = (monto_pago - interes).toFixed(0);

        if (i === cuotas - 1) {
          pago_capital = saldo_capital;
          interes = monto_pago - pago_capital;
        }
        let saldo_capital = capital - pago_capital;

        let fecha = this.$moment(fecha_inicial)
          .add(i + 1, "months")
          .format("YYYY-MM-DD");

        list.push({
          sdocapital_rep: this.formatNumero(capital),
          pagocapital_rep: this.formatNumero(pago_capital),
          pagointer_rep: this.formatNumero(interes),
          totalcuota_rep: this.formatNumero(monto_pago),
          saldocuota_rep: this.formatNumero(saldo_capital),
          nrocuota_rep: i + 1,
          fechacuota_rep: fecha,
        });

        capital = saldo_capital;
      }

      this.table.items = list;
    },

    editar_documento(item) {
      this.dialogo.estado = true;
      let consecutivo = item.consec_rep.trim();
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Asociados//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
          let medidor = data[0].medidor_rep;
          let valor = data[0].valor_rep.trim();
          this.form.consecutivo = consecutivo;
          this.form.fechaini = data[0].fecha_rep;
          this.form.valor = valor;
          this.form.cuotas = data[0].tcuotas_rep.trim();
          this.form.tasa = data[0].tasacte_rep.trim();

          var busqueda_medidor = this.usuarios.find(
            (el) => el.medidor_rep == medidor
          );
          this.form.medidor = busqueda_medidor;

          var busqueda_concepto = this.conceptos.find(
            (el) => el.llavebase_rep == data[0].concepto_rep
          );
          this.form.concepto = busqueda_concepto;

          this.table.items = data[0].cuotas_rep;
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async grabar_financiacion() {
      var data = JSON.parse(JSON.stringify(this.form));
      let tabla_cuotas = await this.enviar_tabla();
      let consecutivo = data.consecutivo;
      let rut = data.medidor.idcontab_rep.trim();
      let medidor = data.medidor.medidor_rep.trim();
      let codigo = data.medidor.cod_rep.trim();
      let concepto = data.concepto.llavebase_rep;
      let fechaini = data.fechaini.replace(/\-/g, "");
      let cuotas = data.cuotas;
      let valorini = data.valor.replace(/\,/g, "");
      let tasa = data.tasa.replace(/\,/g, "");
      post
        .postData({
          url: "Servdm/dlls/Prsdmfinanciam.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              rut +
              "|" +
              medidor +
              "|" +
              codigo +
              "|" +
              concepto +
              "|" +
              fechaini +
              "|" +
              cuotas +
              "|" +
              valorini +
              "|" +
              tasa +
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
          this.cargarcontenido();
        });
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.table.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");

          let saldo = item.sdocapital_rep.replace(/\,/g, "");
          let pago_capital = item.pagocapital_rep.replace(/\,/g, "");
          let interes = item.pagointer_rep.replace(/\,/g, "");
          // let monto_pago = item.monto_pago.replace(/\,/g, "");
          // let saldo_capital = item.saldo_capital.replace(/\,/g, "");
          let pago_no = item.nrocuota_rep;
          let fecha = item.fechacuota_rep.replace(/\-/g, "");

          tablajson[
            `DATOJ-${format_index}`
          ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${fecha}|`;
        });
        res(tablajson);
      });
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      var data_parse = data.map((el) => {
        if (el.estado_rep == 1) {
          el.estado_rep = "Anulado";
        } else {
          el.estado_rep = "Activo";
        }
        el.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        el.vlrcuota_rep = parseFloat(el.vlrcuota_rep.replace(/\,/g, "")) || 0;

        return el;
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "consec_rep",
        },

        {
          title: "Codigo",
          value: "codcli_rep",
          format: "string",
        },
        {
          title: "Nombre Cliente",
          value: "nombrecliente_rep",
          format: "string",
        },
        {
          title: "Identificacion",
          value: "rut_rep",
        },

        {
          title: "Medidor",
          value: "medidor_rep",
          format: "string",
        },
        {
          title: "Concepto",
          value: "descrbase_rep",
          format: "string",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
        },
        {
          title: "T.Cuotas",
          value: "cuotas_rep",
        },

        {
          title: "Valor cuota",
          value: "vlrcuota_rep",
          format: "money",
        },
        {
          title: "Inicio financiaciÃ³n",
          value: "finifin_rep",
          format: "string",
        },

        {
          title: "Fecha Cuota 1",
          value: "fcuota1_rep",
          format: "string",
        },

        {
          title: "Estado",
          value: "estado_rep",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "FINANCIACIONES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Financiaciones",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `FINANCIACIONES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarcontenido() {
      var data = this.form;
      var fechaInicial = data.fechaInicial.replace(/\-/g, "");
      var fechaFinal = data.fechaFinal.replace(/\-/g, "");
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFinancia01J.dll",
          data:
            sessionStorage.Sesion + "|" + fechaInicial + "|" + fechaFinal + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = [];
          this.contenido = JSON.parse(JSON.stringify(data));
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
        val.medidor_rep +
        " - " +
        val.nombres_rep.trim() +
        " - " +
        val.apellido1_rep.trim() +
        " - " +
        val.cod_rep.trim()
      } `;
    },
    cargar_cargos() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfsdmbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.conceptos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Cargos",
            estado: true,
          });
        });
    },
    format_cargos: function (val) {
      return `${val.descrbase_rep.trim()} `;
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

