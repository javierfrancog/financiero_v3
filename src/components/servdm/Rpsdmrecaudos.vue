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
                >mdi-cash-sync</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Recaudos.</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
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
                      v-model="form.fecha"
                      label="Periodo Facturación"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      Autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    scrollable
                    no-title
                    type="month"
                    @change="get_ciclos()"  
                    @input="pickerMes = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Punto de Recaudo"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ciclo"
                  :items="ciclos"
                  :item-text="format_ciclos"
                  return-object
                  outlined
                  clearable
                  hide-details
                  v-model="form.ciclo"
                  :error="errores.ciclo"
                  @change="errores.ciclo = false"
                ></v-autocomplete>
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
                  color="success"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
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
                  <v-chip class="white--text" small label :color="`${item.estado_rep==1 ? 'red' : 'green'} darken-1`" >{{item.estado_rep == 1 ? 'Anulado' : 'Activo'}}</v-chip>
                </template>

              <template v-slot:item.edit="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  @click="cargarfactura(item)"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <template v-slot:item.idusuario_rep="{ item }">
                {{ parseInt(item.idusuario_rep) }}
              </template>

            </v-data-table>

          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="loader_periodos" persistent max-width="300">
      <v-card>
        <v-card-title class="headline"> Procesando </v-card-title>
        <v-card-text>
          <v-col class="subtitle-1 text-center" cols="12">
            Documento : <b>{{ periodo_label }}</b>
          </v-col>
          <v-progress-linear
            v-model="periodos_progreso"
            color="blue darken-1"
            height="25"
          >
            <template v-slot:default="{ value }">
              <strong>{{ value }}%</strong>
            </template>
          </v-progress-linear>
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
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      ptosrecaudo: [],
      ciclos: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id_Usuario", align: "center", value: "idusuario_rep" },
        { text: "Nombres y Apellidos", align: "left", value: "descripcion_rep"},
        { text: "Medidor", align: "center", value: "medidor_rep" },
        { text: "Factura", align: "center", value: "factura_rep" },
        { text: "Vlr_Factura", align: "center", value: "valor_rep" },
        { text: "Vlr_Recaudo", align: "center", value: "pagos_rep" },
        { text: "Fecha Recuado", align: "center", value: "fecha_rep" },
        
        { text: "Vlr_Pendiente", align: "center", value: "pendiente_rep" },
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
      loader_periodos: false,
      periodos_progreso: 0,
      periodo_label: null,

    };
  },
  created() {
    this.get_empresa();
    this.cargaragencias();
  },
  computed: {},
  methods: {
    get_ciclos() {
      let fecha =this.form.fecha.replace(/\-/g, "");
      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/Cfciclos01J.dll",
          data: sessionStorage.Sesion + "|" + fecha +  "|" ,
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
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    cargarcontenido() {
      let agencia = this.form.puntos.codigo_agc
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var ciclo = this.form.ciclo.cod_rep || "0";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/RpRecaudo01J.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" + ciclo + "|"  + agencia + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = [];
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Facturación",
            estado: true,
          });
        });
    },
    async print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));

      var data_parse = data.map((el) => {
        el.idusuario_rep = parseFloat(el.idusuario_rep); 
        el.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        el.pagos_rep = parseFloat(el.pagos_rep.replace(/\,/g, "")) || 0;
        el.pendiente_rep = parseFloat(el.pendiente_rep.replace(/\,/g, "")) || 0;
        return el;
      });


      var columnas = [
        {
          title: "Codigo",
          value: "idusuario_rep",
          format: "string",
        },
        {
          title: "Nombre Cliente",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Medidor",
          value: "medidor_rep",
          format: "string",
        },
        {
          title: "Factura",
          value: "factura_rep",
        },
        {
          title: "Vlr Factura",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Recaudo",
          value: "pagos_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Pendiente",
          value: "pendiente_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

      ];

      var fecha_inicial = this.form.fecha;
      let ciclo = this.form.ciclo.descrip_rep;

      var header_format = [
        { text: "REPORTE RECAUDOS FACTURACION", bold: true, size: 16 },
        `Periodo: ${fecha_inicial}`,
        `Ciclo: ${ciclo}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Recaudos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE RECAUDOS FACTURACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
    cargaragencias: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todos",
          };
        })
        .catch((err) => {
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
