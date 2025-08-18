<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Reporte Ingresos por Municipio</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/ICA.png"
                  contain
                  width="250"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="2">
            <v-menu
              v-model="pickerMesfin"
              close-on-content-click
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechafin"
                  label="Fecha de Corte"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechafin"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechafin"
                scrollable
                no-title
                @change="consultarExog()"
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechafin = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-btn
              color="teal lighten-1"
              class="ma-2 white--text px-12"
              large
              depressed
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
              @click="print_excel"
            >
              Formato Excel
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>

        <v-divider color="#FF6F00"></v-divider>
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
          :search="search"
        >
        </v-data-table>
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
      pickerMesfin: false,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogo_1100102: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      selbta: false,
      selvcio: false,
      expanded: [],
      contenido: [],
      data_excel: [],
      conceptosdian_filtro: [],
      conceptosdian: [],
      clientes: [],
      tab: 0,
      search: "",
      form: {},
      headers: [
        { text: "Id Reportado", align: "left", value: "rut_rep" },
        { text: "Descripcion", align: "left", value: "descriprut_rep" },
        { text: "Valor", align: "center", value: "saldo_rep" },
        { text: "Municipio", align: "left", value: "ciudad_rep" },

        
      ],

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        fechafin: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 1,
        masked: false,
      },
    };
  },
  created() {},
  computed: {},
  methods: {
    init_form() {
      this.errores = {
        codigo: false,
      };
    },

    consultarExog() {
      this.contenido = [];
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let url = `Financiero/dlls/RpIcamunj.dll`;
        post
          .postData({
            url,
            data: sessionStorage.Sesion + "|" + periodo + "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },
    print_excel() {
      var data = this.contenido;
      let data_parse = [];

      const safeNumber = (value) => {
        if (typeof value === "string") {
          return parseFloat(value.trim().replace(/,/g, "")) || 0;
        }
        return typeof value === "number" ? value : 0;
      };
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.saldo_rep = safeNumber(el.saldo_rep);

        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Numero Identificacion",
          value: "rut_rep",
        },
        {
          title: "Descripción",
          value: "descriprut_rep",
          format: "string",
        },
        {
          title: "Total Ingreso",
          value: "saldo_rep",
          format: "money",
        },
        {
          title: "Municipio",
          value: "ciudad_rep",
          format: "string",

        },
      ];

      var header_format = [
        {
          text: "Reporte Ingresos por Municipio",
          bold: true,
          size: 16,
        },
        `Periodo Corte: ${this.form.fechafin}`,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Ingresos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Reporte ingresos-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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