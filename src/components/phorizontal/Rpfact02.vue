<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-clipboard-list-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Facturación Detallada</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
            <v-menu
              ref="menu"
              v-model="pickeFechaIni"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
              required
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fecha_ini"
                  label="Fecha Inicial"
                  outlined
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_ini"
                @input="pickeFechaIni = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="3">
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
                  v-model="fecha_final"
                  label="Fecha Final"
                  append-icon="event"
                  outlined
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_final"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex" cols="6">
            <v-autocomplete
              label="Cliente"
              v-model="form.clientes"
              :items="clientes"
              :item-text="format_clientes"
              hide-details
              return-object
              clearable
              outlined
              @change="
                errores.clientes = false;
                cargarcontenido();
              "
              :error="errores.clientes"
            ></v-autocomplete>
          </v-col>

          <v-col cols="4">
            <v-select
              label="Cargos / Descuentos"
              :items="tablaBases"
              :item-text="format_bases"
              item-value="cod_puc"
              v-model="form.cargos"
              return-object
              outlined
              hide-details
              @change="cargarcontenido()"
              clearable
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex">
            <v-btn
              color="indigo"
              class="white--text px-12"
              depressed
              large
              @click="cargarcontenido"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex">
            <v-btn
              color="success"
              class="ml-2 white--text px-12"
              large
              depressed
              :disabled="contenido.length == 0"
              @click="print_reporte_excel"
            >
              Imprimir excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>
              <template v-slot:item.idcliente_fact="{ item }">
                {{ parseInt(item.idcliente_fact) }}
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
import { factura_titan } from "../../_formatos_ph.js";
import { PDFDocument } from "pdf-lib";
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
      pickeFechaIni: false,
      dialogPickerfin: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),

      singleExpand: true,
      expanded: [],
      contenido: [],
      datosEmpresa: [],
      clientes: [],
      ruts3: [],
      search: "",
      form: {},

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Unidad", align: "center", value: "unidadph_fact" },
        { text: "Id_Unidad", align: "center", value: "idcliente_fact" },

        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "cliente_fact",
        },
        { text: "Factura", align: "center", value: "numero_fact" },
        { text: "Concepto", align: "center", value: "descrconcepto_rep" },

        { text: "Valor", align: "center", value: "valor_rep" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
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
      dialogoModificar: {
        estado: false,
        data: {},
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
    };
  },
  created() {
    this.get_empresa();
    this.get_Clientes();
    this.get_basico();
  },
  methods: {
    get_basico: function () {
      post
        .postData({
          url: "Phorizontal/dlls/CfCargosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;

          this.tablaBases.unshift({
            llavebase_rep: "0",
            descrbase_rep: "Todos",
          });

          this.form.clientes = {
            llavebase_rep: "0",
            descrbase_rep: "Todos",
          };
        })
        .catch((err) => {
          this.send_error("Error al consultar bases");
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;

          this.clientes.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });

          this.form.clientes = {
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          };
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      // data.valor_rep = parseFloat(data.valor_rep.replace(/\,/g, "")) || 0;
      data_parse = data;

      var columnas = [
        {
          title: "Unidad",
          value: "unidadph_fact",
        },
        {
          title: "Cliente",
          value: "cliente_fact",
        },
        {
          title: "Identificación",
          value: "idcliente_fact",
        },
        {
          title: "Admon Mensual",
          value: "admon_fact",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Fecha",
          value: "fecha_fact",
          format: "fecha",
        },
        {
          title: "Factura",
          value: "numero_fact",
        },
        {
          title: "Concepto",
          value: "descrconcepto_rep",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cod_Concepto",
          value: "codigo_rep",
        },
      ];

      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var rut_procesado = this.form.clientes.descripcion_rut;
      var header_format = [
        { text: "REPORTE FACTURACION", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Rut procesado: ${rut_procesado}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Facturación",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-FACTURACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    cargarfactura(item) {
      let consec = item.numero_fact;
      let prefijo = "PH";
      let agencia = "0001";
      let fecha = item.fecha_fact.substring(0, 4);
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            prefijo +
            "|" +
            consec +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.imprimir_factura(data[0]);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Factura",
            estado: true,
          });
        });
    },
    async imprimir_factura(data, getBase64) {
      let descripcion64 = " ";

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      await factura_titan(data);
    },
    format_bases: function (val) {
      return `${val.llavebase_rep.trim()} - ${val.descrbase_rep.trim()}`;
    },

    cargarcontenido() {
      this.contenido = [];

      var fechaini = this.fecha_ini.split("-").join("");
      var fechafin = this.fecha_final.split("-").join("");
      let cliente = this.form.clientes.identificacion_rut;
      let cargo = this.form.cargos.llavebase_rep;

      this.loader = true;

      post
        .postData({
          url: "Phorizontal/dlls/RpFact02J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            cliente +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            cargo +
            "|",
          method: "",
        })
        .then((data) => {
          data = data.filter((item) => item.numero_fact);
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "No se encontraron facturas",
            estado: true,
          });
        });
    },
  },
};
</script>
