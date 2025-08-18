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
                >Cargue Creditos
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
            <v-text-field
              label="Consecutivo"
              outlined
              v-model="form.consecutivo"
              hide-details
              @change="errores.consecutivo = false"
              :error="errores.consecutivo"
            ></v-text-field>
          </v-col>

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
          <v-col class="d-flex" cols="4">
            <v-autocomplete
              label="Modalidad"
              v-model="form.modalidad"
              :items="modalidad"
              :item-text="format_modalidad"
              item-value="cod_rep"
              clearable
              hide-details
              return-object
              outlined
              @change="errores.modalidad = false"
              :error="errores.modalidad"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex" sm="3">
            <v-menu
              v-model="dialogPickerini"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechaini"
                  label="Fecha Emisión"
                  hide-details
                  outlined
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
              @change="errores.valor = false"
              :error="errores.valor"
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
              label="Efectivo Anual"
              outlined
              hide-details
              v-model="form.tasaanual"
              @change="errores.tasaanual = false"
              :error="errores.tasaanual"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="Mora Mensual"
              outlined
              hide-details
              v-model="form.morames"
              @change="errores.morames = false"
              :error="errores.morames"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="E.A"
              outlined
              hide-details
              v-model="form.tasaea"
              @change="errores.tasaea = false"
              :error="errores.tasaea"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-text-field
              label="Seguro Vida"
              outlined
              hide-details
              v-model="form.segvida"
              @change="errores.segvida = false"
              :error="errores.segvida"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="Seguro Fianza"
              outlined
              hide-details
              v-model="form.segfianza"
              @change="errores.segfianza = false"
              :error="errores.segfianza"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn
              color="indigo"
              class="ma-2 mr-0 white--text"
              large
              depressed
              @click="grabar_financiacion()"
            >
              Grabar financiación
              <v-icon right dark class="ml-2">mdi-content-save-settings</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              label="Seleccionar CSV"
              accept=".csv"
              outlined
              hide-details
              v-model="dialogo_csv.archivo_csv"
            ></v-file-input>
          </v-col>

          <v-col cols="4">
            <v-btn
              color="orange"
              class="ma-2 mr-0 white--text"
              large
              depressed
              @click="validar_csv()"
            >
              Validar Archivo
            </v-btn>
          </v-col>

          <div class="pa-0 px-8">
            <v-card-text class="px-0 pa-0">
              <v-data-table :items="table.items" :headers="table.headers">
              </v-data-table>
            </v-card-text>
          </div>

          <!-- <v-col cols="4">
              <v-btn
                color="orange"
                class="ma-2 mr-0 white--text"
                large
                depressed
                @click="generar_liquidacion()"
              >
                Cargar Archivo
              </v-btn>
            </v-col> -->
          <!-- <v-col cols="auto">
            <v-btn
              color="indigo"
              class="ma-2 mr-0 white--text"
              large
              depressed
              @click="grabar_financiacion()"
            >
              Grabar financiación
              <v-icon right dark class="ml-2">mdi-content-save-settings</v-icon>
            </v-btn>
          </v-col> -->
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
import { formato_amortiza } from "../../_formatos_sdm.js";

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
      titular: 0,
      expanded: [],
      modalidad: [],
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
            value: "cuota_rep",
            align: "center",
          },
          {
            text: "Fecha",
            value: "fechac_rep",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "inicial_rep",
            align: "center",
          },
          {
            text: "Pago capital",
            value: "vlrcapital_rep",
            align: "center",
          },
          {
            text: "Pago Int.",
            value: "vlrintereses_rep",
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
            value: "vlrcuota_rep",
            align: "center",
          },
          {
            text: "Estado Cuota",
            value: "descrestado_rep",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "saldo_rep",
            align: "center",
          },

          {
            text: "Categoria",
            value: "categoria_rep",
            align: "center",
          },
          {
            text: "Saldo Base",
            value: "sdobase_rep",
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
        asociado: null,
        modalidad: null,
        fechaini: null,
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
    this.cargar_modalidad();
  },
  methods: {
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
    async grabar_financiacion() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Consecutivo Obligatorio!");
      } else if (!data.asociado) {
        this.errores.asociado = true;
        this.send_error("Asociado Obligatorio!");
      } else if (!data.modalidad) {
        this.errores.modalidad = true;
        this.send_error("Modalidad Obligatoria!");
      } else if (!data.fechaini) {
        this.errores.fechaini = true;
        this.send_error("Fecha Emision Obligatoria!");
      } else if (data.valor < 1) {
        this.errores.valor = true;
        this.send_error("Valor Obligatorio!");
      } else if (!data.cuotas) {
        this.errores.cuotas = true;
        this.send_error("Cuotas Obligatoria!");
      } else if (!data.tasaanual) {
        this.errores.tasaanual = true;
        this.send_error("Tasa Obligatoria!");
      } else if (!data.morames) {
        this.errores.morames = true;
        this.send_error("Mora Obligatoria!");
      } else if (!data.tasaea) {
        this.errores.tasaea = true;
        this.send_error("Tasa E.A. Obligatoria!");
      } else if (!data.segvida) {
        this.errores.segvida = true;
        this.send_error("Porc. Seguro Obligatorio!");
      } else if (!data.segfianza) {
        this.errores.segfianza = true;
        this.send_error("Porc. Seguro Fianza Obligatorio!");
      } else if (this.table.items.length == 0) {
        this.send_error("Sin Datos para Grabar!");
      } else {
        let tabla_cuotas = await this.enviar_tabla();
        let consecutivo = data.consecutivo;
        let rut = data.asociado.identificacion_rut.trim();
        let modalidad = data.modalidad.codigo_rep.trim();
        let fechaini = data.fechaini.replace(/\-/g, "");
        let valorini = data.valor;
        let cuotas = data.cuotas;
        let tasaanual = data.tasaanual;
        let morames = data.morames;
        let tasaea = data.tasaea;
        let segvida = data.segvida;
        let segfianza = data.segfianza;
        post
          .postData({
            url: "Asociados/dlls/PrCarguefinanc.dll",
            data: {
              importarhtml:
                sessionStorage.Sesion +
                "|" +
                consecutivo +
                "|" +
                rut +
                "|" +
                modalidad +
                "|" +
                fechaini +
                "|" +
                valorini +
                "|" +
                cuotas +
                "|" +
                tasaanual +
                "|" +
                morames +
                "|" +
                tasaea +
                "|" +
                segvida +
                "|" +
                segfianza +
                "|",
              ...tabla_cuotas,
            },
            json: true,
            method: "",
          })
          .then((data) => {
            this.clear_form();

            this.$emit("snack", {
              color: "success",
              text: "Financiacion Grabada Correctamente",
              estado: true,
            });
          });
      }
    },
    validar_csv() {
      this.table.items = [];
      var _this = this; // Guarda la referencia correcta a Vue
      var csv = this.dialogo_csv.archivo_csv;

      if (csv) {
        var reader = new FileReader();
        reader.onload = function () {
          var data = reader.result;
          var array = data.split(/\r?\n/);
          var nuevo = [];
          array.shift();
          array.forEach((el, index) => {
            let parse = el.split(";");
            let cuota = parse[0];

            if (cuota > 0) {
              if (_this.titular < 1) {
                _this.titular = parseFloat(parse[13]);
              }

              let fechacuota = parse[1];
              let vlrinicial = parseFloat(parse[2].replace(/\,/g, "")) || 0;
              let vlrcuota = parseFloat(parse[4].replace(/\,/g, "")) || 0;
              let vlrcapital = parseFloat(parse[5].replace(/\,/g, "")) || 0;
              let vlrintereses = parseFloat(parse[6].replace(/\,/g, "")) || 0;
              let vlrsegdeudor = parseFloat(parse[15].replace(/\,/g, "")) || 0;
              let vlrsegotros = parseFloat(parse[20].replace(/\,/g, "")) || 0;
              let saldobase = parseFloat(parse[29].replace(/\,/g, "")) || 0;
              let codeudor1 = parseFloat(parse[30]) || 0;
              let codeudor2 = parseFloat(parse[31]) || 0;
              let codeudor3 = parseFloat(parse[32]) || 0;

              let descripestado = "";
              let estado = parse[27];

              if (estado == 1) {
                descripestado = "Pagada";
              } else {
                descripestado = "Pendiente";
              }
              let categoria = parse[28];
              let saldo = vlrinicial - vlrcapital;
              if (index == 1) {
                _this.form.consecutivo = parse[16];
                _this.form.fechaini = parse[11].replace(/\./g, "-");
                _this.form.valor = parseFloat(parse[21]);
                _this.form.cuotas = parse[14];
                _this.form.tasaanual = parse[18];
                _this.form.tasaea = parse[19];
                _this.form.morames = parse[24];
                _this.form.segvida = parse[26];
              }
              nuevo.push({
                cuota_rep: cuota,
                fechac_rep: fechacuota,
                inicial_rep: vlrinicial,
                vlrcuota_rep: vlrcuota,
                vlrcapital_rep: vlrcapital,
                vlrintereses_rep: vlrintereses,
                vlrsegdeudor_rep: vlrsegdeudor,
                vlrsegotros_rep: vlrsegotros,
                saldo_rep: saldo,
                estado_rep: estado,
                categoria_rep: categoria,
                sdobase_rep: saldobase,
                codeudor1_rep: codeudor1,
                codeudor2_rep: codeudor2,
                codeudor3_rep: codeudor3,
                descrestado_rep: descripestado,
                key: _this.get_key(),
              });
              _this.table.items = nuevo;
            }
          });

          var busq_titular = _this.usuarios.find(
            (el) => parseFloat(el.identificacion_rut) == _this.titular
          );
          _this.form.asociado = busq_titular;
          _this.form.segfianza = 1;
        };

        reader.readAsBinaryString(csv);
      }
    },

    get_key() {
      return Math.random().toString(36);
      // .substring(10);
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
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.table.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let cuota = item.cuota_rep.replace(/\,/g, "");
          let fecha = item.fechac_rep.replace(/\./g, "");
          let vlrcuota = item.vlrcuota_rep;
          let saldo = item.inicial_rep;
          let pago_capital = item.vlrcapital_rep;
          let interes = item.vlrintereses_rep;
          let segdeudor = item.vlrsegdeudor_rep;
          let segotros = item.vlrsegotros_rep;
          let estado = item.estado_rep;
          let categoria = item.categoria_rep;
          let saldobase = item.sdobase_rep;
          let codeudor1 = item.codeudor1_rep;
          let codeudor2 = item.codeudor2_rep;
          let codeudor3 = item.codeudor3_rep;
          tablajson[
            `DATOJ-${format_index}`
          ] = `${cuota}|${fecha}|${vlrcuota}|${saldo}|${pago_capital}|${interes}|${segdeudor}|${segotros}|${estado}|${categoria}|${saldobase}|${codeudor1}|${codeudor2}|${codeudor3}|`;
        });
        res(tablajson);
      });
    },
    cargar_usuarios() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/CfusuariosJ.dll",
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
    cargar_modalidad() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/CftiposJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.modalidad = JSON.parse(JSON.stringify(data));
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
      return `${val.primerApellido_rut.trim() + " " + val.nombres_rut.trim()} `;
    },
    format_modalidad: function (val) {
      return `${val.descripcion_rep.trim()} `;
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
