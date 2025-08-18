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
              <v-icon size="30" color="blue darken-4 ">mdi-dots-hexagon</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Comprobante Pila</v-list-item-title
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
            @click="get_excel"
          >
            Imprimir excel
            <v-icon right dark>mdi-file-excel-box</v-icon>
          </v-btn>
          <v-btn
            color="orange"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="contabilizar"
          >
            Contabilizar
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
              <template v-slot:body.append>
                <td class="text-md-right text-center"></td>
                <td colspan="3" class="text-right">
                  <strong>TOTAL</strong>
                </td>
                <td class="text-xs-right text-center">
                  <strong> {{ formatNumero(total_pila || 0) }}</strong>
                </td>
              </template>
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
      contenidoexcel: [],
      total_pila: 0,
      ptedian: null,
      card: {
        loader: false,
        disabled: false,
      },

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Tipo", align: "left", value: "tipo_rep" },
        { text: "Entidad", align: "left", value: "entidad_rep" },
        { text: "Cantidad", align: "left", value: "cant_rep" },
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
        precision: 2,
        masked: false,
      },
      empresa: {},
      list_select: [],
    };
  },
  created() {
    var $this = this;
    this.$watch(
      "contenido",
      (e) => {
        $this.total_pila = 0;

        e.forEach((val) => {
          let total =
            parseFloat(val.valor_rep.toString().replace(/\,/g, "")) || 0;
          $this.total_pila += total;
        });
      },
      { deep: true }
    );
  },
  computed: {},
  methods: {
    cargarcontenido() {
      let fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpGthPilaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + fecha + "|",
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
    get_excel() {
      let fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpGthPilaJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenidoexcel = JSON.parse(JSON.stringify(data));
          this.print_reporte_excel();
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

    print_reporte_excel() {
      var data = this.contenidoexcel;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Periodo",
          value: "periodo_rep",
          format: "string",
        },

        {
          title: "Tipo",
          value: "tipo_rep",
        },
        {
          title: "Entidad",
          value: "entidad_rep",
        },
        {
          title: "Colaborador",
          value: "colaborador_rep",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Pila",
          value: 0,
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Diferencia",
          value: 0,
          format: "money",
          totalsRowFunction: "sum",
        },
      ];

      var fecha_inicial = this.form.fecha;
      var header_format = [
        { text: "REPORTE PILA", bold: true, size: 16 },
        `Periodo: ${fecha_inicial} `,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Pila",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PILA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    contabilizar() {
      let fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthPila.dll",
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
            text: "Error al contabilizar Pila",
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

