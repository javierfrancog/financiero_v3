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
                >mdi-format-align-center</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Detallado de Facturación.</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
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
                      label="Periodo Inicial"
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
                    @input="pickerMes = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerMesfin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechafin"
                      label="Periodo Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      Autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechafin"
                    scrollable
                    no-title
                    type="month"
                    @input="pickerMesfin = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="6">
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
                  @change="(errores.usuario = false), cargarcontenido()"
                  :error="errores.usuario"
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
                  color="green darken-2"
                  class="ma-2 white--text px-12"
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
              <template v-slot:item.estado_rep="{ item }">
                  <v-chip class="white--text" small label :color="`${item.estado_rep==1 ? 'red' : 'green'} darken-1`" >{{item.estado_rep == 1 ? 'Anulado' : 'Activo'}}</v-chip>
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

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;
import Chart from 'chart.js/auto'

import { factura_coingasco } from "../../_formatos_sdm.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickerMes: false,
      pickerMesfin: false,
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
      usuarios: [],
      ciclos: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id_Usuario", align: "center", value: "codcliente_rep" },
        { text: "Ruta", align: "center", value: "rutacliente_rep" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "nombrecliente_rep",
        },
        { text: "Medidor", align: "center", value: "medidor_rep" },
        { text: "Factura", align: "center", value: "nrofact_rep" },
        { text: "Periodo", align: "center", value: "periodo_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        // { text: "Valor", align: "center", value: "totalapagar_rep" },
        { text: "Opciones", value: "edit", align: "center" },
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
    };
  },
  created() {
    this.get_empresa();
    this.cargar_usuarios();
  },
  computed: {},
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
          this.usuarios.unshift({
            cod_rep: "0",
            nombres_rep: "Todos",
            apellido1_rep: "",
          });
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

    async print_reporte_excel() {
      let cargos = await this.get_cargos();
      var data = JSON.parse(JSON.stringify(this.contenido));

      var data_parse = data.map((el) => {
        el.conceptos.pop();

        el.conceptos.forEach((j) => {
          j.totalapagar_rep =
            parseFloat(j.totalapagar_rep.replace(/\,/g, "")) || 0;

          el[j.codigo_rep] = j.totalapagar_rep;
          if (j.descrbase_rep.trim() == "Consumo")
            el.consumoCant_rep = j.consumo_rep;
        });

        return el;
      });

      var columnas = [
        {
          title: "Prefijo",
          value: "prefijo_rep",
        },
        {
          title: "Consecutivo",
          value: "consecutivo_rep",
        },
        {
          title: "Codigo",
          value: "codcliente_rep",
          format: "string",
        },
        {
          title: "Nombre Cliente",
          value: "nombrecliente_rep",
          format: "string",
        },
        {
          title: "Ruta",
          value: "rutacliente_rep",
        },
        {
          title: "Estrato",
          value: "estrato_rep",
        },
        {
          title: "Medidor",
          value: "medidor_rep",
          format: "string",
        },
        {
          title: "Consumo Total",
          value: "consumoTot_rep",
          format: "string",
        },
        {
          title: "Estado",
          value: "descestado_rep",
        },
        {
          title: "Consumo < 7.26",
          value: "consumomin_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr_Consumo < 7.26",
          value: "vrconsumomin_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Consumo > 7.26",
          value: "consumomay_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr_Consumo > 7.26",
          value: "vrconsumomay_rep",
          totalsRowFunction: "sum",
        },

        {
          title: "Cargo Fijo",
          value: "cargofijo_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Contribucion",
          value: "contribucion_rep",
          totalsRowFunction: "sum",
        },

        {
          title: "Subsidio",
          value: "subsidio_rep",
          totalsRowFunction: "sum",
        },

      ];

      cargos.forEach((c) => {
        if (c.descrbase_rep.trim() != "CONSUMO") {
          columnas.push({
            title:
              c.descrbase_rep.trim() == "Consumo"
                ? "Consumo Vlr"
                : c.descrbase_rep,
            value: c.llavebase_rep,
            totalsRowFunction: "sum",
          });
        }
      });

      var fecha_inicial = this.form.fecha;

      var header_format = [
        { text: "DETALLADO FACTURACION", bold: true, size: 16 },
        `Periodo: ${fecha_inicial}`,
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
              theme: "TableStyleMedium2",
            },
            archivo: `DETALLADO FACTURACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async imprimir_factura(item) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      let logo = await this.pdfs.getBase64(logo_src);
      let idempresa = this.datosEmpresa.id_empr;
      let imagenpie = null;
      let superservicios = await this.pdfs.getBase64(
        require(`../../assets/image/clientes/LOGO_SUPERSERVICIOS.png`)
      );
      let firma = await this.pdfs.getBase64(
        require(`../../assets/image/firmas/${parseFloat(
          item.nitemp_rep.replace(/\,/g, "")
        )}.png`)
      );
      if (idempresa == "000000901355090") {
        imagenpie = "assets/image/clientes/LOGOPIE_COINGASCO.png";
      } else if (idempresa == "000000901355090") {
        imagenpie = "assets/image/clientes/LOGOPIE_LOGIGAS.png";
      }

      let logopie = await this.pdfs.getBase64(require(`../../` + imagenpie));
      let grafico = await this.get_grafico(item.historico_rep);

      item.superservicios = superservicios;
      item.firma = firma;
      item.logopie = logopie;
      item.grafico = grafico;
      item.color3 = this.datosEmpresa.color3_empr;
      item.color4 = this.datosEmpresa.color4_empr;

      factura_coingasco(item, logo).then(() => {
        console.log("Impresion terminada");
      });
    },
    async get_grafico(data) {
      return new Promise((resolve) => {
        let labels = data.map((item) => {
          return item.periodo_rep;
        });

        let datasets = data.map((item) => {
          return item.cant_rep;
        });

        let colors = data.map((item) => {
          return "#3f51b5";
        });

        var newDiv = document.createElement("canvas");
        document.body.appendChild(newDiv);

        let chart_bar;
        chart_bar = new Chart(newDiv, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                data: datasets,
                backgroundColor: colors,
              },
            ],
          },
          options: {
            animation: {
              onComplete: function () {
                let url = chart_bar.toBase64Image();
                newDiv.remove();
                resolve(url);
              },
            },
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontSize: 42,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    fontSize: 42,
                  },
                },
              ],
            },
          },
        });
      });
    },
    cargarfactura(item) {
      console.log(item);
      let periodo = item.periodo_rep;
      let ciclo = item.ciclo_rep;
      let consec = item.consecutivo_rep;
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFact03J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            ciclo +
            "|" +
            consec +
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
    cargarcontenido() {
      let periodoini = this.form.fecha
        ? this.form.fecha.replace(/\-/g, "")
        : "";
      let periodofin = this.form.fechafin
        ? this.form.fechafin.replace(/\-/g, "")
        : "";

      let usuario = this.form.usuario.cod_rep;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/RpFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodoini +
            "|" +
            periodofin +
            "|" +
            usuario +
            "|",
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
    async get_cargos() {
      return new Promise((res) => {
        this.loader = true;
        post
          .postData({
            url: "Servdm/dlls/CfsdmbaseJ.dll",
            data: sessionStorage.Sesion + "|" + "1" + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;

            res(JSON.parse(JSON.stringify(data)));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al consultar Cargos",
              estado: true,
            });
          });
      });
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
