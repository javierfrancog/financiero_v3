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
              <v-icon size="30" color="blue darken-4 "
                >mdi-hand-coin-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Movimiento Aportes Asociados</v-list-item-title
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
                    @input="pickerPeriodo = false"
                    @change="limpiar_datos()"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Asociado"
                  v-model="form.asociado"
                  :items="ruts3"
                  :item-text="format_ruts"
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="generar_reporte(), (errores.asociado = false)"
                  :error="errores.asociado"
                ></v-autocomplete>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="get_reporte()"
                  >Buscar</v-btn
                >
              </v-col> -->

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
              -->
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
      ruts3: [],
      contenido: [],
      errores: {
        asociado: false,
      },
      loader: {
        card: false,
      },
      datosEmpresa: null,
      headers: [
        {
          text: "Asociado",
          align: "left",
          value: "descripcion_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Total Aportes Periodo",
          value: "vlrapor_rep",
          class: "white--text white blue darken-3",
          align: "center",
        },
      ],
    };
  },
  created() {
    this.cargarTablaruts();
  },
  methods: {
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|" + "5" + "|",
          method: "",
        })
        .then((data) => {
          data.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });

          this.ruts3 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts(val) {
      return `${val.descripcion_rut.trim()}`;
    },
    imprimir_excel() {
      let periodo_corte = this.periodo_cargue;
      //let periodo_separado = periodo_corte.split("-");

      let data_parse = [];
      let origenes = new Set(); // Usamos un Set para almacenar los valores únicos de origen_rep

      this.contenido.forEach((el) => {
        let ult_pago = "";

        let copia = {
          identificacion_rep: el.identificacion_rep,
          descripcion_rep: el.descripcion_rep
        };

        el.periodos_rep.pop(); 
        el.periodos_rep.forEach((p) => {
          let vlr_pago = parseFloat(p.valor_rep.replace(/\,/g, "")) || 0;

          // Agregar el origen como clave en el objeto
          copia[p.origen_rep.trim()] = vlr_pago;

          // Guardar los valores únicos de origen_rep
          origenes.add(p.origen_rep.trim());

          if (vlr_pago > 0) {
            ult_pago = p.ultpago_rep;
          }
        });

        copia.totalap_rep = parseFloat(el.vlrapor_rep.replace(/\,/g, ""));
        copia.ult_pago_rep = ult_pago;

        data_parse.push(copia);
      });

      // Definir las columnas base
      let columnas = [
        { title: "Id Asociado", value: "identificacion_rep", format: "string" },
        { title: "Nombre", value: "descripcion_rep", format: "string" },
        { title: "Fecha Ult.Pago", value: "ult_pago_rep", format: "string" },
      ];

      // Agregar dinámicamente las columnas según los valores únicos de origen_rep
      origenes.forEach((origen) => {
        columnas.push({
          title: origen, // Nombre de la columna
          value: origen, // Clave usada en los objetos de data_parse
          format: "money", // Se asume que son valores numéricos
        });
      });

      columnas.push({ title: "Total", value: "totalap_rep", format: "money" });

      let header_format = [
        { text: "MOVIMIENTO APORTES", bold: true, size: 16 },
        { text: `Periodo de corte: ${periodo_corte}`, bold: true, size: 14 },
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Movimiento Aportes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `MOVIMIENTO APORTES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    limpiar_datos() {
      this.contenido = [];
    },
    generar_reporte() {
      this.loader.card = true;
      this.contenido = [];
      let rut = this.form.asociado.identificacion_rut;

      var datos = {
        url: "Asociados/dlls/RpAportes02J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.periodo_cargue.split("-").join("") +
          "|" +
          rut +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          data.pop();
          this.loader.card = false;
          this.contenido = JSON.parse(JSON.stringify(data));
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
