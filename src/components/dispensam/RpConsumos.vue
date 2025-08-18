<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-invoice-export-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Reporte de Consumos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
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
                  label="Periodo Inicial Análisis"
                  hide-details
                  outlined
                  :error="errores.fechaInicial"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaInicial"
                scrollable
                no-title
                type="month"
                :error="errores.fechaInicial"
                @change="pickeFechaIni = false"
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
                  label="Periodo Final Análisis"
                  outlined
                  v-on="on"
                  hide-details
                  :error="errores.fechaFinal"
                  @change="errores.nroentrega = false"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaFinal"
                scrollable
                no-title
                type="month"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-autocomplete
              label="Ubicacion"
              :items="ubicasolic"
              outlined
              clearable
              persistent-hint
              required
              return-object
              item-value="codigo_ubic"
              v-model="form.ubica_destino"
              @change="errores.ubica_destino = false"
              :item-text="format_ubicacion"
              :error="errores.ubica_destino"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>

            <v-row class="mt-2">
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  outlined
                  label="AgrpMolecula"
                  v-model="form.molecula"
                  :item-text="format_moleculas"
                  :items="moleculas"
                  clearable
                  return-object
                  @change="errores.moleculas = false"
                  :error="errores.moleculas"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-btn
                  color="indigo darken-3 white--text"
                  class="white--text px-12"
                  large
                  depressed
                  @click="consultar_reporte"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>

              <v-col cols="3">
                <v-btn
                  color="green darken-2"
                  class="ml-3 white--text px-12"
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
              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="form.detalle"
                  @change="consultar_reporte"
                  hide-details
                  label="Detallar Productos"
                ></v-switch>
              </v-col>
            </v-row>

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

            <v-row>
              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="contenido"
                  item-key="codmedicam_rep"
                  :search="search"
                >
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { precargue } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
        metodo: null,
        index: null,
      },
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      disabled: {
        grabar: true,
        imprimir: true,
        error_saldo: true,
      },

      dialogPicker: false,
      dialogPickervence: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      singleExpand: true,
      pickerPeriodo: false,
      error_saldo: 0,
      edit_index: 0,
      contenido: [],
      agencias: [],
      medicamentos: [],
      moleculas: [],
      ubicasolic: [],
      ubica: [],
      formTitle: "",
      search: "",
      searchprod: null,
      form: {
        detalle: true,
      },
      drawer: false,
      detalle: [],
      empresa: [],

      card_estado: false,
      load: {
        btn_enviar: false,
        impresion: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },

      errores: {
        ubica_destino: false,
        moleculas: false,
        fechaFinal: false,
        fechaInicial: false,
      },
      headers: [
        { text: "Sede", align: "center", value: "agencia_rep" },
        { text: "Agrp_Molecula", align: "left", value: "agrpmolecula_rep" },
        { text: "Producto", align: "left", value: "descripcion_rep" },
        { text: "Consumo", align: "center", value: "cant_rep" },
        { text: "Promedio/Mes", align: "center", value: "prom_rep" },
        { text: "Saldo", align: "center", value: "saldo_rep" },
        { text: "Excedente/Deficit", align: "center", value: "difer_rep" },
      ],
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      comprobante: null,
    };
  },

  created() {
    this.loader = false;
    this.get_empresa();
    this.get_molecula();
    this.cargarTablaubica();
  },
  methods: {
    consultar_reporte() {
      if (!this.form.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Selecciona un periodo Inicial");
      } else if (!this.form.fechaFinal) {
        this.errores.fechaFinal = true;
        this.send_error("Selecciona un periodo Final");
      } else if (!this.form.ubica_destino) {
        this.errores.ubica_destino = true;
        this.send_error("Selecciona una Ubicación");
      } else if (!this.form.molecula) {
        this.errores.molecula = true;
        this.send_error("Selecciona una Molecula");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.ubica_destino.codigo_ubic;
        let molecula = this.form.molecula.codigo_rep;
        let detalle = this.form.detalle ? 1 : 0;
        let url_envio = "dispensa/dlls/RpconsumosJ.dll";
        if (detalle == 0) {
          url_envio = "dispensa/dlls/Rpconsumos3J.dll";
        }

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          molecula,
          detalle,
        ];
        this.postData({
          url: url_envio,
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            console.log("Error", err);
            this.$emit(
              "msj",
              err.Mensaje ? err.Mensaje[0].msg : err,
              "red",
              1000
            );
          });
      }
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Sede",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Agp Molecula",
          value: "agrpmolecula_rep",
          format: "string",
        },
        {
          title: "Producto",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Consumos",
          value: "cant_rep",
          format: "number",
        },
        {
          title: "Promedio Mes",
          value: "prom_rep",
          format: "number",
        },
        {
          title: "Saldo",
          value: "saldo_rep",
          format: "number",
        },
        {
          title: "Excedente/Deficit",
          value: "difer_rep",
          format: "number",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE CONSUMOS", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Consumos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE CONSUMOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubicasolic = data;
          this.ubicasolic.unshift({
            codigo_ubic: "0",
            descrip_ubic: "Todas las ubicaciones",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_molecula() {
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.moleculas = JSON.parse(JSON.stringify(data));
          this.moleculas.unshift({
            codigo_rep: "0",
            descripcion_rep: "Todas las Moléculas",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agrp_Moleculas",
            estado: true,
          });
        });
    },
    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
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
