<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-file-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Libro Diario Detallado</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
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
                      label="Periodo"
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
                    @change="get_comprobantes()"
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-btn
                color="indigo"
                class="ma-2 white--text px-12 d-flex justify-end"
                large
                depressed
                @click="get_comprobantes()"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
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
                :disabled="detalle.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
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
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                item-key="consecutivo"
                show-expand
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      expanded: [],
      empresa: [],
      docc: [],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      search: "",
      form: null,
      drawer: false,
      headers: [
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          align: "center",
        },
        {
          text: "Documento",
          align: "center",
          value: "nombredoc",
          width: "15%",
        },

        {
          text: "Consecutivo",
          align: "center",
          value: "consecutivo",
          width: "15%",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripc",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
    };
  },
  created() {
    this.get_empresa();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
  },
  methods: {
    print_reporte_excel() {
      const _this = this;
      let data = [];
      let nombredocum = "";
  
      this.detalle.forEach((el) => {
        el.registros.pop();
        nombredocum = el.nombredoc;
        
        el.registros.forEach((item) => {
          let obj = {
            ...item,
            comprobante: el.consecutivo.trim(),
            descripdoc: nombredocum,
            fechadoc: el.fechadoc,
            tipodoc: item.tipodoc,
            idrut: item.idrut,
          };
          data.push(obj);
        });
      });

      var columnas = [
        {
          title: "Tipo Comprobante",
          value: "tipodoc",
        },

        {
          title: "Comprobante",
          value: "descripdoc",
        },
        {
          title: "Fecha",
          value: "fechadoc",
        },
        {
          title: "Consecutivo",
          value: "comprobante",
        },
        {
          title: "Item",
          value: "item",
        },
        {
          title: "Cuenta",
          value: "cuenta",
        },
        // {
        //   title: "Id_Rut",
        //   value: "nit",
        // },

        {
          title: "RUT",
          value: "rut",
        },
        {
          title: "Id RUT",
          value: "idrut",
        },
        {
          title: "Documento",
          value: "nroext",
        },
        {
          title: "Centro de costos",
          value: "ccosto",
        },
        {
          title: "Débito",
          value: "debito",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Crédito",
          value: "credito",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Detalle",
          value: "detalle",
        },
      ];

      let data_parse = [];
      data.forEach((el) => {
        data_parse.push({
          item: el.item.trim(),
          descripdoc: el.descripdoc.trim(),
          cuenta: el.cuenta.trim(),
          rut: el.rut.trim(),
          fechadoc: el.fechadoc,
          idrut: el.idrut,
          tipodoc: el.tipodoc,
          nroext: el.nroext.trim(),
          ccosto: el.ccosto.trim(),
          debito: el.debito,
          credito: el.credito,
          detalle: el.detalle.trim(),
          comprobante: el.comprobante,
        });
      });

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Diario_Detallado",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Diario_Detallado-${new Date().getTime()}`,
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
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    get_comprobantes() {
      this.detalle = [];
      this.loader.tabla_datos = true;
      var fecha = this.periodo_cargue.replace(/\-/g, "");

      var datosEnvio = sessionStorage.Sesion + "|" + fecha + "|";
      post
        .postData({
          url: "Financiero/dlls/RpLbDiariodetJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader.tabla_datos = false;
          data = data.map((el) => {
            el.consecutivo = el.consecutivo.replace(/\,/g, "");
            return el;
          });

          data.pop();
          this.detalle = data;
        })
        .catch((err) => {
          this.loader.tabla_datos = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
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
