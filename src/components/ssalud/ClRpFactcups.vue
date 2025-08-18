<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cart-arrow-right</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Facturación por Cups</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
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
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="green darken-2"
                  outlined
                  class="ma-2 white--text px-12"
                  depressed
                  @click="print_reporte_excel"
                  :disabled="prest_servicios.length == 0 ? true : false"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="resumcat"
                  @change ="consultarServicios"
                  label="Resumen por Categoría"
                ></v-switch>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="resumsubcat"
                  @change ="consultarServicios"                  
                  label="Resumen por Sub_Categoría"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="nro"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
            ></v-data-table>
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
export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      rescups: null,
      resumgrupo: null,
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      prest_servicios: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      headers: [
        { text: "Codigo", align: "left", value: "codigo" },
        { text: "Descripcion", align: "left", value: "desc_servicio" },
        { text: "Categoría", align: "left", value: "categoria" },        
        { text: "SubCategoría", align: "left", value: "subcategoria" },                
        { text: "Cantidad", align: "center", value: "cant" },
        { text: "Valor", align: "center", value: "valor" },
      ],
    };
  },
  created() {
    this.cargarContratos();
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
    fecha_ini() {
      this.fecha_final = this.fecha_ini;
    },
  },
  methods: {
    formatNumero: function (val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: ".",
      });

      mask.resolve(val.toString());
      return "$ " + mask.value;
    },
    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "01" + "|",
          method: "",
        })
        .then((data) => {
          console.log(data);
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },

    print_reporte_excel() {
      var data = this.prest_servicios;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        // if (el.index || typeof el.index == "number") {
        copia.valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;
        copia.codigo = parseFloat(el.codigo.replace(/\./g, "")) || 0;
        // }

        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Codigo",
          value: "codigo",
          filterButton: false,
        },
        {
          title: "Descripción",
          value: "desc_servicio",
        },
        {
          title: "Categoría",
          value: "categoria",
        },
        {
          title: "Sub_Categoría",
          value: "subcategoria",
        },

        {
          title: "Cantidad",
          value: "cant",
          filterButton: false,
          totalsRowFunction: "sum",
        },
        {
          title: "Valor",
          value: "valor",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];
      var contrato = this.descripContrato;
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var header_format = [
        { text: "Reporte Facturacion por Cups", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Contrato: ${contrato}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Facturacion Cups",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-FACT-CUPS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultarServicios() {
      let consulta = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e;
        }
      });
      let resumcat = this.resumcat ? 1 : 0;
      let resumsubcat = this.resumsubcat ? 1 : 0,
        estado_fecha = this._validarFechas();
      consulta = consulta[0];
      if (consulta) {
        if (estado_fecha) {
          this.loader = true;
          post
            .postData({
              url: "Clinico/dlls/ClRpFactcupsJ.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                consulta.nro +
                "|" +
                consulta.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                resumcat +
                "|" +
                resumsubcat +
                "|",
              method: "",
            })
            .then((data) => {
              this.loader = false;
              this.prest_servicios = data;
            })
            .catch((err) => {
              this.loader = false;
              this.load_contrato = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios",
                estado: true,
              });
            });
        }
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un contrato",
          estado: true,
        });
      }
    },
  },
};
</script>
