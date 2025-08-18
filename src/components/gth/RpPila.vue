3<template>
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
                >mdi-dots-hexagon</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >GeneraciÃ³n Archivo Pila</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
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
                  v-model="form.fecha"
                  label="Fecha de NÃ³mina"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row class="justify-end">
          <v-btn
            color="indigo"
            class="white--text mr-3"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
          <v-btn
            color="success"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="generar_excel"
          >
            Generar EXCEL
            <v-icon right>mdi-file-excel-box</v-icon>
          </v-btn>
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
              :expanded.sync="expanded"
              item-key="idnomina_rep"
              :search="search"
              v-model="list_select"
              disable-pagination
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


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
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      ptedian: null,
      card: {
        loader: false,
        disabled: false,
      },

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Apellido1", align: "left", value: "Apellido1colabora_rep" },
        { text: "Apellido2", align: "left", value: "Apellido2colabora_rep" },
        { text: "Nombre", align: "left", value: "nombrescolabora_rep" },
        { text: "Dias", align: "center", value: "diaspension_rep" },        
        { text: "Base Salud", align: "center", value: "basesalud_rep" },
        { text: "Aporte Salud", align: "center", value: "aportesalud_rep" },
        { text: "Base Pension", align: "center", value: "basepension_rep" },
        { text: "Aporte PensiÃ³n", align: "center", value: "aportepension_rep" },
        { text: "Base Arl", align: "center", value: "basearl_rep" },
        { text: "Aporte Arl", align: "center", value: "aportearl_rep" },
        { text: "Base Caja", align: "center", value: "basecaja_rep" },        
        { text: "Aporte Caja", align: "center", value: "aportecaja_rep" },        

      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      periodos: [
        { text: "Mensual", value: 1 },
        { text: "1ra Quincena", value: 2 },
        { text: "2da Quincena", value: 3 },
        { text: "Nomina Adicional", value: 4 },
      ],
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
        precision: 2,
        masked: false,
      },
      empresa: {},
      list_select: [],
    };
  },
  created() {
  },
  computed: {},
  methods: {
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];
      var titColumnas = [];
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.form.fecha;
      var columnas = [
        {
          title: "Nro",
          value: "nombreagencianomina_rep",
        },
        {
          title: "Tipo Id",
          value: "idnomina_rep",
        },

        {
          title: "Nro Id",
          value: "idnomina_rep",
        },
        {
          title: "Primer Apellido",
          value: "Apellido1nomina_rep",
        },
        {
          title: "Segundo Apellido",
          value: "Apellido2nomina_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombresnomina_rep",
        },
        {
          title: "Segundo Nombre",
          value: "nombresnomina_rep",
        },
        {
          title: "Departamento",
          value: "xnombresnomina_rep",
        },
        {
          title: "Ciudad",
          value: "xnombresnomina_rep",
        },
        {
          title: "Tipo de Cotizante",
          value: "xnombresnomina_rep",
        },
        {
          title: "SubTipo de Cotizante",
          value: "xnombresnomina_rep",
        },
        {
          title: "Horas Laboradas",
          value: "xnombresnomina_rep",
        },
        {
          title: "Extranjero",
          value: "xnombresnomina_rep",
        },
        {
          title: "Residente en el Exterior",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fecha Radicacion en el Exterior",
          value: "xnombresnomina_rep",
        },
        {
          title: "ING",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fecha ING",
          value: "xnombresnomina_rep",
        },
        {
          title: "RET",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fecha RET",
          value: "xnombresnomina_rep",
        },
        {
          title: "TDE",
          value: "xnombresnomina_rep",
        },
        {
          title: "TAE",
          value: "xnombresnomina_rep",
        },
        {
          title: "TDP",
          value: "xnombresnomina_rep",
        },
        {
          title: "TAP",
          value: "xnombresnomina_rep",
        },
        {
          title: "VSP",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fecha VSP",
          value: "xnombresnomina_rep",
        },
        {
          title: "VST",
          value: "xnombresnomina_rep",
        },
        {
          title: "SLN",
          value: "xnombresnomina_rep",
        },
        {
          title: "Inicio SLN",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fin SLN",
          value: "xnombresnomina_rep",
        },
        {
          title: "IGE",
          value: "xnombresnomina_rep",
        },
        {
          title: "Inicio IGE",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fin IGE",
          value: "xnombresnomina_rep",
        },
        {
          title: "LMA",
          value: "xnombresnomina_rep",
        },
        {
          title: "Inicio LMA",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fin LMA",
          value: "xnombresnomina_rep",
        },
        {
          title: "VAC-LR",
          value: "xnombresnomina_rep",
        },
        {
          title: "Inicio VAC-LR",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fin VAC-LR",
          value: "xnombresnomina_rep",
        },
        {
          title: "AVP",
          value: "xnombresnomina_rep",
        },
        {
          title: "VCT",
          value: "xnombresnomina_rep",
        },
        {
          title: "Inicio VCT",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fin VCT",
          value: "xnombresnomina_rep",
        },
        {
          title: "IRL",
          value: "xnombresnomina_rep",
        },
        {
          title: "Inicio IRL",
          value: "xnombresnomina_rep",
        },
        {
          title: "Fin IRL",
          value: "xnombresnomina_rep",
        },

        {
          title: "Neto pagado",
          value: "netonomina_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];

      data.forEach((el) => {
        data_parse.push({
          nombreagencianomina_rep: el.nombreagencianomina_rep,          
          idnomina_rep: el.idnomina_rep,
          Apellido1nomina_rep: el.Apellido1nomina_rep,
          Apellido2nomina_rep: el.Apellido2nomina_rep,
          nombresnomina_rep: el.nombresnomina_rep,
          netonomina_rep:
            el.netonomina_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
        });
      });

      // data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        `NIT. ${parseInt(_this.empresa.id_empr)}`,
        "PLANILLA NOMINA ELECTRONICA",
        periodo,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Planilla Nomina Electronica",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `NOMINA-ELECTRONICA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarcontenido() {
      let fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpGthPilaJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Pila",
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

