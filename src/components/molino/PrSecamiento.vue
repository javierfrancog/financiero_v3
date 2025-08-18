<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-air-filter</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Secamiento Industrial</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="2">
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
                  label="Periodo"
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
              @change="errores.pickerMes = false"
              :error="errores.pickerMes"

              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.punto_fact"
              :items="agencias"
              :item-text="format_punto_fact"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.punto_fact = false"
              :error="errores.punto_fact"
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="2">
            <v-select
              :items="tipos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.tipo"
              required
              :disabled="dialogo.tipo == 1"
              @change="errores.tipo = false"
              :error="errores.tipo"

            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-btn
              color="indigo"
              class="white--text mr-3"
              large
              depressed
              @click="procesar"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Procesar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-btn
              color="green"
              class="white--text mr-3"
              large
              depressed
              @click="print_reporte_excel"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Imprimir excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="contenido"
          item-key="dia_rep"
          :search="search"
          disable-pagination
        >
        </v-data-table>
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
      tipos: [
        { text: "Arroz Paddy", value: 1 },
        { text: "Soya", value: 2 },
        { text: "MaÃ­z", value: 3 },
      ],

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
      search: "",
      form: {},
      headers: [
        { text: "" },
        { text: "Dia", align: "center", value: "dia_rep" },
        { text: "Kgs Verdes Compra", align: "center", value: "verdesc_rep" },
        { text: "Kgs Secos Compra", align: "center", value: "secosc_rep" },
        { text: "Kgs Verdes Servicio", align: "center", value: "verdess_rep" },
        { text: "Kgs Secos Servicio", align: "center", value: "secoss_rep" },
      ],

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        punto_fact: false,
        pickerMes: false,        
        tipo: false,        
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
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
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

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    procesar() {
      var data = this.form;
      if (!data.fecha) {
        this.errores.pickerMes = true;
        this.send_error(" Selecciona un Periodo");
      } else if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error(" Selecciona una Agencia");
      } else if (!data.tipo) {
        this.errores.tipo = true;
        this.send_error(" Selecciona un Tipo");
      } else {
        var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
        var tipo = this.form.tipo.value || "0";
        var agencia = data.punto_fact.codigo_agc;        
        this.loader = true;
        this.contenido = [];
        post
          .postData({
            url: "Molinos/dlls/PrSecamiento.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + tipo + "|" + agencia + "|",
            method: "",
          })
          .then((data) => {
            this.contenido = JSON.parse(JSON.stringify(data));
            this.loader = false;
            this.$emit("snack", {
              color: "indigo",
              text: "Proceso Terminado",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            console.log(err.Mensaje[0].msg);
            this.$emit("snack", {
              color: "error",
              text: err.Mensaje[0].msg,
              estado: true,
            });
          });
      }
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.verdesc_rep = parseFloat(el.verdesc_rep.replace(/\,/g, "")) || 0;
        copia.secosc_rep = parseFloat(el.secosc_rep.replace(/\,/g, "")) || 0;
        copia.verdess_rep = parseFloat(el.verdess_rep.replace(/\,/g, "")) || 0;
        copia.secoss_rep = parseFloat(el.secoss_rep.replace(/\,/g, "")) || 0;
        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Dia",
          value: "dia_rep",
        },
        {
          title: "Kgs Verdes Compra",
          value: "verdesc_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Kgs Secos Compra",
          value: "secosc_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Kgs Verdes Servicio",
          value: "verdess_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Kgs Secos Servicio",
          value: "secoss_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        // {
        //   title: "Peso Entrada",
        //   value: "pesoini_pes",
        //   totalsRowFunction: "sum",
        // },
      ];

      var fecha_inicial = this.form.fecha;
      var header_format = [
        { text: "REPORTE SECAMIENTO", bold: true, size: 16 },
        `Periodo: ${fecha_inicial} `,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Secamiento",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-SECAMIENTO-${new Date().getTime()}`,
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

