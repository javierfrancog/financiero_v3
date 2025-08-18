<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-credit-card-clock-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generar Financiaciones
              </v-list-item-title>
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="2">
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
                    label="Fecha Financiación"
                    outlined
                    v-model="form.fecha"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha"
                  @input="dialogPicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              label="Usuario"
              v-model="form.medidor"
              :items="usuarios"
              :item-text="format_usuarios"
              item-value="cod_rep"
              clearable
              hide-details
              return-object
              outlined
              @change="errores.medidor = false"
              :error="errores.medidor"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6" v-if="form.medidor">
            <v-select
              :items="conceptos"
              :item-text="format_cargos"
              item-value="descrbase_rep"
              label="Concepto"
              outlined
              hide-details
              clearable
              return-object
              @change="select_concepto()"
              v-model="form.concepto"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="sdofactura" class="mr-2 mt-2">
          <v-col class="d-flex" cols="3">
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
                  v-model="form.periodo"
                  label="Periodo"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.periodo"
                scrollable
                no-title
                @change="cargarciclos()"
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="4">
            <v-select
              label="Ciclo"
              :items="ciclos"
              :item-text="format_ciclos"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.ciclo"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>

          <v-col cols="2">
            <v-text-field
              label="Factura"
              outlined
              hide-details
              clearable
              v-model="form.factura"
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
              label="saldo Deuda"
              outlined
              hide-details
              disabled
              clearable
              v-model="form.sdofactura"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-btn
              color="purple"
              class="ml-2 ma-2 white--text"
              large
              depressed
              @click="buscar_factura()"
            >
              Validar Factura
              <v-icon right dark class="ml-2"
                >mdi-calculator-variant-outline</v-icon
              >
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          v-if="form.concepto"
          class="ml-2 mr-2 mt-2"
          style="border: 1px solid #ff6f00; border-radius: 5px"
        >
          <v-row class="ml-2 mt-2">
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
            <v-col cols="2">
              <v-text-field
                label="Valor a Financiar"
                outlined
                hide-details
                clearable
                v-model="form.valor"
                v-money="money"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Cuotas"
                outlined
                clearable
                hide-details
                v-model="form.cuotas"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Interés Mensual"
                outlined
                hide-details
                v-model="form.tasa"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Factor', value: 1 },
                  { text: 'Cuota Manual', value: 2 },
                ]"
                label="Tipo Liquidación"
                outlined
                clearable
                v-model="form.tipoliq"
                @change="get_cuotas"
                required
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="this.form.tipoliq == 2">
            <v-col cols="4">
              <v-text-field
                label="Cuota Capital"
                outlined
                hide-details
                v-model="form.vlrcapital"
                v-money="money"
                @change="total_cuota"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Cuota Intereses"
                outlined
                hide-details
                v-model="form.vlrinteres"
                @change="total_cuota"
                v-money="money"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Total Cuota Mensual"
                outlined
                hide-details
                disabled
                v-model="form.valorcuota"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn
                color="orange"
                class="ml-2 ma-2 white--text"
                large
                depressed
                @click="generar_liquidacion()"
              >
                Generar Liquidación
                <v-icon right dark class="ml-2"
                  >mdi-calculator-variant-outline</v-icon
                >
              </v-btn>
            </v-col>
          </v-row>
        </v-row>

        <div class="mt-4 pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table :items="table.items" :headers="table.headers">
            </v-data-table>
          </v-card-text>
        </div>

        <v-row class="d-flex justify-end">
          <v-col cols="auto">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="grabar_financiacion()"
            >
              Grabar financiación
              <v-icon right dark class="ml-2">mdi-content-save-settings</v-icon>
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
import { formato_amortiza } from "../../_formatos_sdm.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      ciclos: [],
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      Picker_perini: false,
      Picker_perfin: false,
      dialogPickerini: false,

      dialogPickerfin: false,
      singleExpand: true,
      sdofactura: false,
      expanded: [],
      agencias: [],
      ruts3: [],
      contenido: [],
      usuarios: [],
      conceptos: [],
      datosEmpresa: [],

      search: "",
      motivosliq: null,
      proceso: 0,
      total_factura: 0,

      form: {
        tasa: "0",
        valorcuota: 0,
        vlrcapital: 0,
        vlrinteres: 0,
        valor: 0,
        cuotas: 0,
      },

      motivos: [
        { text: "Terminación de Contrato", value: 1 },
        { text: "Renuncia", value: 2 },
      ],
      headers_historico: [
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Nombre", align: "left", value: "nombres_rep" },
        { text: "Acciones", align: "center", value: "accion" },
      ],
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Descripción", align: "left", value: "descrip_liq" },
        { text: "Base", align: "center", value: "vlrbase_liq" },
        { text: "Cantidad", align: "center", value: "cantidad_liq" },
        { text: "Valor", align: "left", value: "valor_liq" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        colabora: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
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

      dialogoModificar: {
        estado: false,
        data: false,
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
      historico: {
        estado: false,
      },
      datos_historico: [],
      table: {
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
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.get_consecutivo();
    this.get_empresa();
    this.cargar_usuarios();
    this.cargar_cargos();
    // this.form.valor = 10000;
    this.form.cuotas = 12;
    // this.form.tasa = 2;
    this.form.fechaini = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
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
      let factura = data.factura ? data.factura.trim() : 0;
      let periodo = this.form.periodo
        ? this.form.periodo.replace(/\-/g, "")
        : "";
      let ciclo = this.form.ciclo? this.form.ciclo.cod_rep : "0";

      post
        .postData({
          url: "Servdm/dlls/Prsdmfinancia.dll",
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
              "|" +
              factura +
              "|" +
              periodo +
              "|" +
              ciclo +
              "|",
            ...tabla_cuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.get_consecutivo();
          this.form.vlrinteres = "0";

          this.imprimir_documento(consecutivo);
          this.clear_form();

          this.$emit("snack", {
            color: "success",
            text: "Documento Grabado Correctamente",
            estado: true,
          });
        });
    },
    clear_form() {
      this.table.items = [];
      this.form.cuotas = null;
      this.form.valor = null;
      this.form.tasa = null;
      this.form.vlrcapital = null;
      this.form.vlrinteres = "0";
      this.form.valorcuota = null;
    },
    get_cuotas() {
      let tipo = parseInt(this.form.tipoliq);
      if (tipo === 2) {
        let valor = this.form.valor.replace(/\,/g, "");
        let cuotas = parseInt(this.form.cuotas);
        this.form.vlrcapital = (valor / cuotas).toFixed(0);
      }
    },
    total_cuota() {
      let capital = parseFloat(
        this.form.vlrcapital.toString().replace(/\,/g, "")
      );
      let interes = parseFloat(
        this.form.vlrinteres.toString().replace(/\,/g, "")
      );

      let total = capital + interes;

      this.formatNumero(total);
      this.form.valorcuota = total;
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.table.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");

          let saldo = item.saldo.replace(/\,/g, "");
          let pago_capital = item.pago_capital.replace(/\,/g, "");
          let interes = item.interes.replace(/\,/g, "");
          // let monto_pago = item.monto_pago.replace(/\,/g, "");
          // let saldo_capital = item.saldo_capital.replace(/\,/g, "");
          let pago_no = item.pago_no;
          let fecha = item.fecha.replace(/\-/g, "");

          tablajson[
            `DATOJ-${format_index}`
          ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${fecha}|`;
        });
        res(tablajson);
      });
    },
    generar_liquidacion() {
      let tipo = parseInt(this.form.tipoliq);

      if (tipo === 1) {
        this.liquidacion_bancaria();
      } else {
        this.liquidacion_cuota();
      }
    },
    liquidacion_bancaria() {
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      let tasabase = this.form.tasa.replace(/\./g, "");
      let tasa_interes = parseFloat(this.form.tasa);
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
        let nrocuota = i + 1;
        // if (mes > 1) {
        //   fecha = this.$moment(fecha_inicial)
        //     .add(i + 1, "months")
        //     .format("YYYY-MM-DD");
        // } else {
        fecha = this.$moment(fecha_inicial)
          .add(i, "months")
          .format("YYYY-MM-DD");
        // }

        if (cuotas == 1) {
          monto_pago = capital;
        }
        // let fecha = this.$moment(fecha_inicial)
        //   .add(i + 1, "months")
        //   .format("YYYY-MM-DD");

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
      let tcuota = (valor * tasa_interes).toFixed(0);
      if (cuotas === 1) {
        tcuota = valor;
      }

      let vlrcapital = (valor / cuotas).toFixed(0);
      let vlrinter = (tcuota - vlrcapital).toFixed(0);

      if (tasa_interes === 0) {
        tcuota = vlrcapital;
        vlrinter = 0;
      }

      let list = [];
      let capital = parseFloat(valor);
      let saldo_capital = 0;
      for (let i = 0; i < cuotas; i++) {
        let interes = vlrinter;
        let monto_pago = tcuota;
        let pago_capital = vlrcapital;

        if (i === cuotas - 1) {
          pago_capital = saldo_capital;
          interes = monto_pago - pago_capital;
        }

        saldo_capital = capital - pago_capital;

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
    liquidacion_factor2() {
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      this.form.tasa = "0.00";

      switch (cuotas) {
        case 1:
          this.form.tasa = "0.00";
          break;
        case 2:
          this.form.tasa = "0.51882";
          break;
        case 3:
          this.form.tasa = "0.35014";
          break;
        case 4:
          this.form.tasa = "0.26582";
          break;
        case 5:
          this.form.tasa = "0.21525";
          break;
        case 6:
          this.form.tasa = "0.18155";
          break;
        case 7:
          this.form.tasa = "0.15755";
          break;
        case 8:
          this.form.tasa = "0.13947";
          break;
        case 9:
          this.form.tasa = "0.12548";
          break;
        case 10:
          this.form.tasa = "0.11426";
          break;
        case 11:
          this.form.tasa = "0.10511";
          break;
        case 12:
          this.form.tasa = "0.09749";
          break;
        case 18:
          this.form.tasa = "0.06967";
          break;
        case 24:
          this.form.tasa = "0.05591";
          break;
        case 36:
          this.form.tasa = "0.04245";
          break;
      }

      let tasa_interes = parseFloat(this.form.tasa);
      let fecha_inicial = this.form.fechaini;

      let tcuota = (valor * tasa_interes).toFixed(0);
      if (cuotas === 1) {
        tcuota = valor;
      }

      let vlrcapital = (valor / cuotas).toFixed(0);
      let vlrinter = (tcuota - vlrcapital).toFixed(0);

      if (tasa_interes === 0) {
        tcuota = vlrcapital;
        vlrinter = 0;
      }

      let list = [];
      let capital = parseFloat(valor);
      let saldo_capital = 0;
      for (let i = 0; i < cuotas; i++) {
        let interes = vlrinter;
        let monto_pago = tcuota;
        let pago_capital = vlrcapital;

        if (i === cuotas - 1) {
          pago_capital = saldo_capital;
          interes = monto_pago - pago_capital;
        }

        saldo_capital = capital - pago_capital;

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
    get_fechaini() {},
    liquidacion_cuota() {
      let cuotames = this.form.valorcuota;
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      let tasabase = this.form.tasa.replace(/\./g, "");
      let tasa_interes = parseFloat(this.form.tasa);
      let fecha_inicial = this.form.fechaini;

      let capitalmes = valor / cuotas;
      let intermes = cuotames - capitalmes;
      let tcuota = cuotames;

      let list = [];
      let capital = parseFloat(valor);
      for (let i = 0; i < cuotas; i++) {
        // let pago_capital = (capital / cuotas).toFixed(0);
        // let interes = (capital * (tasa_interes / 100)).toFixed(0);
        // let monto_pago = parseFloat(pago_capital) + parseFloat(interes);
        // let saldo_capital = capital - pago_capital;

        let interes = intermes.toFixed(0);
        let monto_pago = tcuota;
        let pago_capital = capitalmes.toFixed(0);
        let saldo_capital = capital - pago_capital;
        let fecha = 0;
        let nrocuota = i + 1;
        if (nrocuota > 1) {
          fecha = this.$moment(fecha_inicial)

            .add(i + 1, "months")
            .format("YYYY-MM-DD");
        } else {
          fecha = this.$moment(fecha_inicial)

            .add(i + 0, "months")
            .format("YYYY-MM-DD");
        }

        if (cuotas === nrocuota) {
          pago_capital = capital;
          interes = monto_pago - pago_capital;
          saldo_capital = 0;
        }

        list.push({
          pago_no: i + 1,
          saldo: this.formatNumero(capital),
          pago_capital: this.formatNumero(pago_capital),
          interes: this.formatNumero(interes),
          monto_pago: this.formatNumero(monto_pago),
          saldo_capital: this.formatNumero(saldo_capital),
          fecha,
        });

        capital = saldo_capital;
      }

      this.table.items = list;
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

    buscar_factura() {
      let factura = this.form.factura.trim();

      if (factura > 0) {
        let periodo = this.form.periodo
          ? this.form.periodo.replace(/\-/g, "")
          : "";
        let ciclo = this.form.ciclo.cod_rep || "0";
        let consec = factura;
        this.loader = true;
        post
          .postData({
            url: "Servdm//dlls/PrFact05J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              ciclo +
              "|" +
              consec +
              "|",
            method: "",
          })
          .then((data) => {
            let data_cargos = data[0].basesfactura_rep;
            let subsidio = data[0].subsidio_rep.trim();
            subsidio = parseFloat(subsidio.replace(/,/g, ""));

            data_cargos.pop();
            this.loader = false;
            const safeNumber = (value) => {
              if (typeof value === "string") {
                return parseFloat(value.trim().replace(/,/g, "")) || 0;
              }
              return typeof value === "number" ? value : 0; // Si ya es número, lo devuelve
            };

            let totalVlrIni = 0;
            data_cargos.forEach((item) => {
              let vlrcapital = safeNumber(item.vlrini_rep);
              let vlrinteres = safeNumber(item.vlrint_rep);
              let vlrfactant = safeNumber(item.factant_rep);
              let vlrbase = safeNumber(item.vlrbase_rep);
              let vlrexceso = safeNumber(item.vlrexceso_rep);
              if (item.codigo_rep == "1101") {
                vlrinteres = safeNumber(item.valor_rep);
              }
              totalVlrIni +=
                vlrcapital + vlrinteres + vlrfactant + vlrbase + vlrexceso;
            });
            totalVlrIni = totalVlrIni - subsidio;
            this.form.sdofactura = this.formatNumero(totalVlrIni);
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Factura",
              estado: true,
            });
          });
      }
    },
    format_cargos: function (val) {
      return `${val.descrbase_rep.trim()} `;
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    cargar_cargos() {
      post
        .postData({
          url: "Servdm/dlls/CfsdmbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
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
    cargarciclos() {
      let fecha = this.form.periodo.replace(/\-/g, "");
      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/Cfciclos01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.ciclos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ciclos",
            estado: true,
          });
        });
    },
    imprimir_documento(consecutivo) {
      var key = consecutivo.trim() + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
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
          this.send_error("Error al imprimir el documento");
        });
    },
    get_consecutivo() {
      var fecha = this.form.fecha.replace(/-/g, "");
      post
        .postData({
          url: "Servdm/dlls/PrFinanciaN.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.$set(this.form, "consecutivo", parseFloat(data[0].nro));
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
    select_concepto() {
      let codigo = this.form.concepto.llavebase_rep;
      if (codigo == 1100) {
        this.sdofactura = true;
      } else {
        this.sdofactura = false;
      }
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
