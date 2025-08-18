<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-calculator</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Simulador Creditos
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row> </v-row>
        <v-row
          class="ml-2 mr-2 mt-2"
          style="border: 1px solid #ff6f00; border-radius: 5px"
        >
          <v-row class="mt-1 ml-1">
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Asociado"
                v-model="form.asociado"
                :items="usuarios"
                :item-text="format_usuarios"
                item-value="cod_rep"
                clearable
                hide-details
                return-object
                outlined
                @change="errores.asociado = false"
                :error="errores.asociado"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="8">
              <v-select
                :items="tpcreditos"
                :item-text="format_tiposcr"
                label="Tipo Crédito"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.tpcreditos"
                @change="select_linea()"
                return-object
                :error="errores.tpcreditos"
                @input="errores.tpcreditos = false"
              ></v-select>
            </v-col>

            <v-col cols="3" class="ml-2">
              <v-text-field
                label="Valor a Financiar"
                outlined
                hide-details
                clearable
                @input="input_mask('valor', (errores.valor = false))"
                :value="formatNumero(form.valor)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Cuotas"
                outlined
                clearable
                hide-details
                v-model="form.cuotas"
                @change="errores.cuotas = false"
                :error="errores.cuotas"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Tasa Nominal"
                outlined
                hide-details
                v-model="form.tasaanual"
                @change="errores.tasaanual = false"
                :error="errores.tasaanual"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Seguro Vida"
                outlined
                hide-details
                v-model="form.segvida"
                @change="errores.segvida = false"
                :error="errores.segvida"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Seguro Fianza"
                outlined
                hide-details
                v-model="form.segfianza"
                @change="errores.segfianza = false"
                :error="errores.segfianza"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-col cols="4">
              <v-btn
                color="indigo"
                class="ma-2 mr-0 white--text"
                large
                depressed
                @click="calcular_financiacion()"
              >
                Calcular financiación
                <v-icon right dark class="ml-2"
                  >mdi-content-save-settings</v-icon
                >
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="justify-left"> </v-row>
          <div class="pa-0 px-8">
            <v-card-text class="px-0 pa-0">
              <v-data-table :items="table.items" :headers="table.headers">
              </v-data-table>
            </v-card-text>
          </div>
        </v-row>

        <v-row class="justify-left"> </v-row>
        <v-row class="d-flex justify-end"> </v-row>
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

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
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
      expanded: [],
      modalidad: [],
      tpcreditos: [],
      ruts3: [],
      contenido: [],
      usuarios: [],
      conceptos: [],
      datosEmpresa: [],
      dialogo_csv: {
        estado: false,
        archivo_csv: null,
        rut: null,
      },
      table: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "pago_no",
            align: "center",
          },
          {
            text: "Fecha",
            value: "fecha",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "saldo",
            align: "center",
          },
          {
            text: "Pago capital",
            value: "pago_capital",
            align: "center",
          },
          {
            text: "Pago Int.",
            value: "interes",
            align: "center",
          },
          {
            text: "Seguro Deudor",
            value: "vlrsegdeudor_rep",
            align: "right",
          },

          {
            text: "Seguro Otros",
            value: "vlrsegotros_rep",
            align: "right",
          },
          {
            text: "Total Cuota",
            value: "monto_pago",
            align: "center",
          },
          {
            text: "Sdo. capital",
            value: "saldo_capital",
            align: "center",
          },
        ],
      },
      search: "",
      motivosliq: null,
      proceso: 0,

      form: {
        valorcuota: 0,
        vlrcapital: 0,
        vlrinteres: 0,
        valor: 0,
        cuotas: 0,
        consecutivo: 0,
        tasaanual: 0,
        morames: 0,
        tasaea: 0,
        segvida: 0,
        segfianza: 0,
      },

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        modalidad: false,
        estado: false,
        asociado: false,
        consecutivo: false,
        valor: false,
        cuotas: false,
        tasaanual: false,
        morames: false,
        tasaea: false,
        segvida: false,
        segfianza: false,
        fechaini: false,
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
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.get_empresa();
    this.cargarRuts();
    this.cargartiposcr();
  },
  methods: {
    select_linea() {
      console.log(this.form.tpcreditos);
      this.form.cuotas = parseFloat(this.form.tpcreditos.maxmeses_rep);
      this.form.segvida = parseFloat(this.form.tpcreditos.seguro1_rep);
      this.form.tasaanual = parseFloat(this.form.tpcreditos.tasactual_rep);
    },
    cargartiposcr() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/CftiposJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.tpcreditos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tipo de Creditos",
            estado: true,
          });
        });
    },
    format_tiposcr: function (val) {
      return `${val.descripcion_rep}`;
    },
    get_key() {
      return Math.random().toString(36);
      // .substring(10);
    },
    format_usuarios: function (val) {
      return `${val.primerApellido_rut.trim() + " " + val.nombres_rut.trim()} `;
    },
    cargarRuts() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|" + "10" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.usuarios = JSON.parse(JSON.stringify(data));
          this.usuarios.pop();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    calcular_financiacion() {
      console.log(this.form);

      // let ano = fecha_inicial.substring(0, 4);
      // let mes = fecha_inicial.substring(5, 7);
      // let dia = fecha_inicial.substring(8, 10);
      // if (mes > 1) {
      //   mes = mes - 1;
      // }
      // (mes = mes.toString().padStart(2, "0")),
      //   (fecha_inicial = ano + mes + dia);

      // let factor1 = (tasa_interes / 100) * valor;
      // let basepot = 1 + tasa_interes / 100;
      // let potencia = Math.pow(basepot, -cuotas);
      // let factor2 = 1 - potencia;
      // let tcuota = (factor1 / factor2).toFixed(0);

      // let capital = parseFloat(valor);

      let fecha_inicial = this.$moment().format("YYYY-MM-DD");
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      let tasafin = parseFloat(this.form.tasaanual);
      let porcseguro = parseFloat(this.form.segvida);



      // let porcseguro = parseFloat(this.form.segCartera);

      let tasa_interes = tasafin;
      let vlrseguro = ((valor * porcseguro) / 100 / cuotas).toFixed(0);
      this.seguro = vlrseguro;

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
          saldo: this.formatNumero(capital),
          pago_capital: this.formatNumero(pago_capital),
          interes: this.formatNumero(interes),
          vlrsegdeudor_rep: this.formatNumero(vlrseguro),
          monto_pago: this.formatNumero(monto_pago),
          saldo_capital: this.formatNumero(saldo_capital),
          pago_no: i + 1,
          fecha: fecha,
        });

        capital = saldo_capital;
      }

      this.table.items = list;
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
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
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
