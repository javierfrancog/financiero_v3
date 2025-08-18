<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-shield-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Certificado Retención en la Fuente</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="7">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>

              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="consultar_rut()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Consultar
                </v-btn>
                <v-btn
                  color="red accent-4 white--text"
                  depressed
                  class="ml-3"
                  @click="generar_pdf()"
                >
                  <v-icon size="20" left>mdi-pdf-box</v-icon> Generar PDF
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters> </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="false"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-4"
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="consultar_rut"
                      >
                        <v-icon>mdi-lock-alert</v-icon>
                      </v-btn>
                      {{ item.estado == "0" ? "Cerrado" : "Abierto" }}
                    </template>
                    <span>Cerrar Mes</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </div>
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
          <v-progress-linear
            v-model="periodos_progreso"
            color="blue-grey"
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
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

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
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      contenido: [],
      tablaruts:[],
      search: "",
      form: {},
      drawer: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Renglon", align: "left", value: "renglon_rte" },
        { text: "Descripción", align: "left", value: "descripcion_rte" },

        { text: "Base", align: "left", value: "base_rte" },
        { text: "Valor", align: "left", value: "rte_rte" },
      ],
      detalle: [],
      años_select: [],
      errores: {
        anoselect: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      loader_periodos: false,
      periodos_progreso: 0,
    };
  },
  created() {
    this.loader = false;
    this.form = {
      fecha_doc: this.$moment().format("YYYY"),
    };
    this.cargar_años();
    this.cargarTablaruts();
    this.cargar_empresa();
  },
  methods: {
    generar_pdf() {
      var _this = this;
      var contenido = this.contenido;
      var datosTabla = [];
      var ano = this.form.periodo_cargue + 1
      var fecha = ano + "-" + "02" + "-" + "28";      

      var itemsTabla = [];

      itemsTabla.unshift([
        {
          fontSize: 10,
          bold: true,
          fillColor: "#000000",
          color: "#ffffff",
          alignment: "center",
          text: "Concepto",
        },
        {
          fontSize: 10,
          bold: true,
          fillColor: "#000000",
          color: "#ffffff",
          alignment: "center",
          text: "Base",
        },
        {
          fontSize: 10,
          bold: true,
          fillColor: "#000000",
          color: "#ffffff",
          alignment: "center",
          text: "Valor Retención",
        },
      ]);

      contenido.forEach((el) => {
        itemsTabla.push([
          {
            fontSize: 9,
            alignment: "left",
            text: el.descripcion_rte.trim(),
          },
          {
            fontSize: 9,
            alignment: "right",
            text: el.base_rte.trim(),
          },
          {
            fontSize: 9,
            alignment: "right",
            text: el.rte_rte.trim(),
          },
        ]);
      });

      itemsTabla.push(
        [{ text: "" }, { text: "" }, { text: "" }],
        [{ text: "" }, { text: "" }, { text: "" }]
      );

      datosTabla.push(
        [
          {
            fontSize: 10,
            bold: true,
            stack: ["Agente Retenedor: ", "Dirección: "],
          },
          {
            fontSize: 9,
            stack: [_this.empresa.descrip_empr, _this.empresa.direccion_empr],
          },
          {
            fontSize: 10,
            bold: true,
            stack: ["Identificación: ", "Ciudad: "],
          },
          {
            fontSize: 9,
            stack: [
              this.formatNumero(parseInt(this.empresa.id_empr)),
              _this.empresa.Ciudad + " - " + _this.empresa.Departamento,
            ],
          },
        ],
        [
          {
            fontSize: 10,
            bold: true,
            text: "Sujeto de Retención: ",
          },
          {
            fontSize: 9,
            text: _this.form.selruts.descripcion_rut.trim(),
          },
          {
            fontSize: 10,
            bold: true,
            text: "Identificación: ",
          },
          {
            fontSize: 9,
            text: this.formatNumero(
              parseInt(_this.form.selruts.identificacion_rut)
            ),
          },
        ],
        [
          {
            colSpan: 4,
            table: {
              headerRows: 1,
              widths: [200, 150, 150],
              body: itemsTabla,
            },
            layout: "noBorders",
          },
          {},
          {},
          {},
        ],
        [
          {
            colSpan: 4,
            table: {
              widths: [150, "auto"],
              body: [
                [
                  {
                    colSpan: 2,
                    fontSize: 10,
                    text:
                      "Los valores retenidos fueron declarados y consignados oportunamente a la dirección de Impuestos y Aduanas Nacionales.",
                  },
                  {
                  },
                ],
                [
                  {
                    fontSize: 10,
                    bold: true,
                    stack: [
                      "\n\n\n",
                      "",
                      "",
                      "",
                      "",
                      "\n",
                      "Este documento no requiere para su validez firma autografa de acuerdo con el articulo 10 del Decreto 836 de 1991.",
                    ],
                  },
                  {},
                ],
                [
                  {},
                  {
                    alignment: "right",
                    fontSize: 8,
                    text:
                      "      Fecha Expedición: " + fecha
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
          {},
          {},
          {},
        ],
        [
          {
            fontSize: 7,
            text: "Plataforma: Titán Soluciones S.A.S.",
          },
          {},
          {},
          {},
        ]
      );

      var margin = {
        left: 40,
        right: 40,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var dd = {
          //pageOrientation: "landscape",
          pageMargins: [margin.left, 120, margin.right, 60],
          header: function (currentPage, pageCount, pageSize) {
            return [
              {
                margin: [margin.left, 25, margin.right, 0],
                columns: [
                  {
                    width: "20%",
                    stack: [
                      {
                        image: logo,
                        width: 80,
                        height: 80,
                      },
                    ],
                  },
                  {
                    width: "80%",
                    bold: true,
                    alignment: "center",
                    fontSize: 13,
                    stack: [
                      "CERTIFICADO DE RETENCIÓN EN LA FUENTE",
                      "AÑO GRAVABLE: " + _this.form.periodo_cargue,
                      /*`NIT. ${_this.formatNumero(parseInt(_this.empresa.id_empr.replace(/\,/g, "")))}`,
                      `Dir. ${_this.empresa.direccion_empr}`,
                      `Tel. ${_this.empresa.telefono_empr}`,
                      `${_this.empresa.Ciudad} - ${_this.empresa.Departamento}`*/
                    ],
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                canvas: [
                  {
                    type: "line",
                    x1: margin.left,
                    x2: pageSize.width - margin.right,
                    y1: 0,
                    y2: 0,
                    lineWidth: 2,
                  },
                ],
              },
            ];
          },
          content: [
            {
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "auto", "auto"],
                body: datosTabla,
              },
              layout: "lightHorizontalLines",
            },
          ],
          styles: {},
          images: {
            logo: logo,
          },
        };

        pdfMake.createPdf(dd).open();
      });
    },

    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },

    cargar_empresa() {
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
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    consultar_rut() {
      if (!this.form.periodo_cargue) {
        this.errores.anoselect = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar un Año",
          estado: true,
        });
      } else {
        var fecha = this.form.periodo_cargue;
        var rut = this.form.selruts.identificacion_rut;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpCertRtefteJ.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + rut + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Información",
              estado: true,
            });
          });
      }
    },

    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          console.log(data)
          this.tablaruts = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },
  },
};
</script>
<style>
#rpformrtefte .v-data-table__wrapper table tbody tr:nth-child(even) {
  background-color: #e2f8e3 !important;
}
</style>

