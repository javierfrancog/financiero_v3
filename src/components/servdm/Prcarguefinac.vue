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
              label="Usuario"
              v-model="form.usuario"
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

        <v-row>
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
              label="Tasa Mensual"
              outlined
              hide-details
              v-model="form.tasames"
              @change="errores.tasames = false"
              :error="errores.tasames"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
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
      concepto: [],
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
            text: "Total Cuota",
            value: "vlrcuota_rep",
            align: "center",
          },
          {
            text: "Estado Cuota",
            value: "estado_rep",
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
        concepto: null,
        fechaini: null,
        tasames: 0,
      },

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        concepto: false,
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
    this.cargar_usuarios();
    this.cargar_cargos();
    this.get_consecutivo();
  },
  methods: {
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
    async grabar_financiacion() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Consecutivo Obligatorio!");
      } else if (!data.usuario) {
        this.errores.usuario = true;
        this.send_error("Usuario Obligatorio!");
      } else if (!data.concepto) {
        this.errores.concepto = true;
        this.send_error("Concepto Obligatoria!");
      } else if (data.valor < 1) {
        this.errores.valor = true;
        this.send_error("Valor Obligatorio!");
      } else if (!data.cuotas) {
        this.errores.cuotas = true;
        this.send_error("Cuotas Obligatoria!");
      } else if (!data.tasames) {
        this.errores.tasames = true;
        this.send_error("Tasa Obligatoria!");
      } else if (this.table.items.length == 0) {
        this.send_error("Sin Datos para Grabar!");
      } else {
        console.log("Enviando Tabla de Cuotas", data);

        let tabla_cuotas = await this.enviar_tabla();
        let consecutivo = data.consecutivo;
        let rut = data.usuario.idcontab_rep.trim();
        let id_usuario = data.usuario.cod_rep.trim();

        let concepto = data.concepto.llavebase_rep.trim();
        let valorini = data.valor;
        let cuotas = data.cuotas;
        let tasames = data.tasames;
        post
          .postData({
            url: "Servdm/dlls/PrCarguefinanc.dll",
            data: {
              importarhtml:
                sessionStorage.Sesion +
                "|" +
                consecutivo +
                "|" +
                rut +
                "|" +
                id_usuario +
                "|" +
                concepto +
                "|" +
                valorini +
                "|" +
                cuotas +
                "|" +
                tasames +
                "|",
              ...tabla_cuotas,
            },
            json: true,
            method: "",
          })
          .then((data) => {
            this.clear_form();

            this.get_consecutivo();
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
      const _this = this;
      const csv = this.dialogo_csv.archivo_csv;

      if (csv) {
        let vlrinicial = 0;
        let total_cuotas = 0;
        let cod_usuario = 0;
        let cod_concepto = 0;
        const nuevo = [];

        const reader = new FileReader();

        reader.onload = function () {
          const data = reader.result;
          const array = data.split(/\r?\n/);
          array.shift(); // eliminar encabezado

          array.forEach((el) => {
            if (!el.trim()) return; // ignorar líneas vacías

            const parse = el.split(";");
            const cuota = parseInt(parse[1] || 0);
            const fechacuota = parse[2] || "";
            vlrinicial = parseFloat((parse[3] || "0").replace(/,/g, "")) || 0;
            const vlrcapital =
              parseFloat((parse[4] || "0").replace(/,/g, "")) || 0;
            const vlrintereses =
              parseFloat((parse[5] || "0").replace(/,/g, "")) || 0;
            const vlrcuota =
              parseFloat((parse[6] || "0").replace(/,/g, "")) || 0;
            const tasa_mensual = parse[7] || 0;
            cod_usuario = parseFloat(parse[8] || 0);
            cod_concepto = parseFloat(parse[0] || 0);
            let estado = parse[10];

            estado = estado == 1 ? "Pagada" : "Pendiente";

            if (cuota > 0) {
              nuevo.push({
                cuota_rep: cuota,
                fechac_rep: fechacuota,
                inicial_rep: vlrinicial,
                vlrcuota_rep: vlrcuota,
                vlrcapital_rep: vlrcapital,
                vlrintereses_rep: vlrintereses,
                estado_rep: estado,
                key: _this.get_key(),
              });
            }
          });

          // Actualizamos solo una vez después de procesar todo
          _this.table.items = nuevo;
          total_cuotas = nuevo.length;

          const busq_titular = _this.usuarios.find(
            (el) => parseInt(el.cod_rep) === parseInt(cod_usuario)
          );
          _this.form.usuario = busq_titular;

          const busq_concepto = _this.conceptos.find(
            (el) => parseInt(el.llavebase_rep) === parseInt(cod_concepto)
          );
          _this.form.concepto = busq_concepto;

          _this.form.valor = vlrinicial;
          _this.form.cuotas = total_cuotas;
          _this.form.tasames = 2.14;
        };

        reader.readAsBinaryString(csv);
      }
    },

    get_key() {
      return Math.random().toString(36);
      // .substring(10);
    },
    get_consecutivo() {
      post
        .postData({
          url: "Servdm/dlls/PrfinanciaN.dll",
          data: sessionStorage.Sesion + "|" + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.consecutivo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
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
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.table.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let cuota = item.cuota_rep;
          let fecha = item.fechac_rep;
          let vlrcuota = item.vlrcuota_rep;
          let pago_capital = item.vlrcapital_rep;
          let interes = item.vlrintereses_rep;
          let estado = item.estado_rep == "Pagada" ? "1" : "0";
          tablajson[
            `DATOJ-${format_index}`
          ] = `${cuota}|${fecha}|${vlrcuota}|${pago_capital}|${interes}|${estado}|`;
        });
        res(tablajson);
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
    format_cargos: function (val) {
      return `${val.descrbase_rep.trim()} `;
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
