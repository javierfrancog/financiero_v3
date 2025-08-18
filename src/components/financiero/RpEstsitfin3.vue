<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loader.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-cash</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Balance por Rut</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo de cargue"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                    @change="limpiar_datos(), get_reporte(1)"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  clearable
                  @change="get_reporte(1)"
                  return-object
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Codigo"
                  v-model="form.ctacontab"
                  :items="datosctas"
                  :item-text="format_ctas"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  @change="get_reporte(1)"
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="3">
                <v-btn
                  color="green darken-1"
                  class="white--text px-6"
                  @click="imprimir_excel"
                  large
                  depressed
                  v-if="contenido.length"
                >
                  Generar EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </div>
        <div>
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
          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="contenido"
                item-key="index"
                :search="search"
                disable-pagination
              >
                <template v-slot:body.append>
                  <td colspan="5" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-right">
                    <strong> {{ formatNumero(totales.total) }}</strong>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-row>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import ExcelJS from "exceljs";
import post from "../../methods.js";
export default {
  data() {
    return {
      periodo_cargue: this.$moment().format("YYYY-MM"),
      condition: false,
      search: null,
      pickerPeriodo: false,
      pickerCargue: false,
      pickerActual: false,
      tablaruts: [],
      datosctas: [],
      form: [],
      contenido: [],
      totales: {
        total: 0,
      },
      loader: {
        card: false,
      },
      datosEmpresa: null,
      headers: [
        {
          text: "Cuenta",
          align: "left",
          value: "CTAPUC",
          class: "white--text white blue darken-3",
        },
        {
          text: "Descripción",
          align: "left",
          value: "DESCRIPCION",
          class: "white--text white blue darken-3",
        },
        {
          text: "Saldo Inicial",
          align: "right",
          value: "SDO_ANTER",
          class: "white--text white blue darken-3",
        },
        {
          text: "Débitos",
          align: "right",
          value: "DEBITOS",
          class: "white--text white blue darken-3",
        },
        {
          text: "Creditos",
          align: "right",
          value: "CREDITOS",
          class: "white--text white blue darken-3",
        },
        {
          text: "Nuevo Saldo",
          align: "right",
          value: "SALDO",
          class: "white--text white blue darken-3",
        },
      ],
    };
  },
  created() {
    this.cargarTablaruts();
    this.cargarTablactas();

    this.$watch("contenido", (contenido) => {
      let total_rep = 0;
      contenido.forEach((val) => {
        total_rep = parseFloat(val.SALDO.replace(/\,/g, ""));
        this.totales.total += total_rep;
      });
    });
  },
  methods: {
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },

    format_ruts: function (val) {
      return `${parseInt(val.identificacion_rut)} - ${val.descripcion_rut}`;
    },

    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];
      let perini = this.periodo_cargue;
      let rut = this.form.selruts.descripcion_rut;

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.ant_excel =
          parseFloat(el.SDO_ANTER.replace(/\,/g, "").replace(/\ /g, "")) || 0;
        copia.deb_excel =
          parseFloat(el.DEBITOS.replace(/\,/g, "").replace(/\ /g, "")) || 0;
        copia.cre_excel =
          parseFloat(el.CREDITOS.replace(/\,/g, "").replace(/\ /g, "")) || 0;
        copia.saldo_excel =
          parseFloat(el.SALDO.replace(/\,/g, "").replace(/\ /g, "")) || 0;

        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Cuenta",
          value: "CTAPUC",
          format: "string",
        },
        {
          title: "Descripción",
          value: "DESCRIPCION",
          format: "string",
        },
        {
          title: "Saldo Anterior",
          value: "ant_excel",
          format: "money",
        },

        {
          title: "Debitos",
          value: "deb_excel",
          format: "money",
        },
        {
          title: "Créditos",
          value: "cre_excel",
          format: "money",
        },
        {
          title: "Saldo",
          value: "saldo_excel",
          format: "money",
        },
      ];

      let header_format = [
        {
          text: "BALANCE POR RUT",
          bold: true,
          size: 16,
        },
        `Periodo Corte:${perini}`,
        `Rut:${rut}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Balance Por Rut",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              heightRow: 15,
              theme: "TableStyleMedium2",
            },
            archivo: `BALANCE POR RUT-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;

          this.datosctas.unshift({
            cod_puc: "0",
            descrip_puc: "Todas",
          });

          this.form.ctacontab = {
            cod_puc: "0",
            descrip_puc: "Todas",
          };


        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc.trim()}`;
    },
    limpiar_datos() {
      this.contenido = [];
    },

    get_reporte(tipo) {
      let cta = this.form.ctacontab ? this.form.ctacontab.cod_puc.trim() : 0;
      let rut = this.form.selruts ? this.form.selruts.identificacion_rut : "0";
      this.totales.total = 0;

      this.loader.card = true;
      this.contenido = [];
      var datos = {
        url: "Financiero/dlls/RpEstsitfin3J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.periodo_cargue.split("-").join("") +
          "|" +
          rut +
          "|" +
          cta +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader.card = false;
          this.contenido = JSON.parse(JSON.stringify(data[0].BALANCE));
        })
        .catch((error) => {
          console.error(error);
          this.loader.card = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar estado",
            estado: true,
          });
        });
    },
  },
};
</script>
