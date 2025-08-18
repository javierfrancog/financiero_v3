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
                >mdi-music-accidental-double-flat</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Duplicados</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
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
            </v-row>

            <v-row class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="consultar_reporte"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <!-- <v-row>
              <v-col>
                <v-btn
                  color="red darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte()"
                  :disabled="contenido.length == 0"
                >
                  Imprimir PDF
                  <v-icon right dark>mdi-pdf-box</v-icon>
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
            </v-row> -->

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
              item-key="index"
              :search="search"
            >
              <template v-slot:body.append>
                <tr>
                  <td class="font-weight-medium text-right">Totales</td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_cantidad) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_valor) }}
                  </td>
                </tr>
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

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      ptosrecaudo: [],
      search: "",
      total_valor: 0,
      total_cantidad: 0,

      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Punto Recaudo", align: "left", value: "agencia_rep" },
        { text: "Entidad", align: "center", value: "entidad_rep" },
        { text: "Factura", align: "center", value: "factura_rep" },
        { text: "Cantidad", align: "center", value: "cantidad_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Cajero", align: "center", value: "cajero_rep" },        
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.cargaragencias();
  },
  methods: {
    cargaragencias: function () {
      post
        .postData({
          url: "Recaudos/dlls/CfAgenciasJ.dll",
          data: 0 + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todos",
          });

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

    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));      

      let total_valor = 0;
      let total_cantidad = 0;

      var data_parse = data.map((el) => {
        let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
        let valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;

        el.cantidad_rep = cantidad;
        el.valor_rep = valor;

        if (el.id != 99) {
          total_valor += valor;
          total_cantidad += cantidad;
        }

        return el
      });

      data_parse.push({
        agencia_rep: "Total",
        cantidad_rep: total_cantidad,
        valor_rep: total_valor,
      });

      var columnas = [
        {
          title: "Punto Recaudo",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Cantidad",
          value: "cantidad_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "RECAUDO POR PUNTO", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Recaudo por Punto",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PUNTO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_reporte() {
      var data = this.contenido;
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      let valor_total = 0;
      let cantidad_total = 0;

      var data_parse = [];
      data.forEach((el) => {
        let valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        valor_total += valor;
        cantidad_total += parseFloat(el.cantidad_rep);
        let item = [
          el.agencia_rep.trim(),
          { text: el.cantidad_rep.trim(), alignment: "right" },
          { text: el.valor_rep.trim(), alignment: "right" },
        ];
        data_parse.push(item);
      });

      data_parse.push([
        { text: "Totales " },
        { text: cantidad_total, alignment: "right" },
        { text: this.formatNumero(valor_total), alignment: "right" },
      ]);
      data_parse.unshift([
        { text: "Punto Recaudo", style: "header_table" },
        { text: "Cantidad", style: "header_table", alignment: "right" },
        { text: "Valor", style: "header_table", alignment: "right" },
      ]);

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_parse,
          header_pdf: [
            {
              text: [{ text: "Fecha inicial: ", bold: true }, fecha_inicial],
            },
            {
              text: [{ text: "Fecha Final: ", bold: true }, fecha_final],
            },
          ],
          width_table: ["*", "*", "*"],
          logo,
          titulo: "Recaudo por Punto",
          fontSize: 8,
        });
      });
    },

    consultar_reporte() {
      this.loader = true;
      var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let punto = this.form.puntos.codigo_agc;
      let data = [sessionStorage.Sesion, fechaInicial, fechaFinal, punto];
      this.total_cantidad = 0;
      this.total_valor = 0;
      this.postData({
        url: "Recaudos/dlls/RpDuplicadosJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.contenido.forEach((el) => {
            let valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
            this.total_valor += valor;
            let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
            this.total_cantidad += cantidad;
          });
        })
        .catch((err) => {
          this.loader = false;
          console.log("Error", err);
          this.$emit(
            "msj",
            err.Mensaje ? err.Mensaje[0].msg : err,
            "red",
            1000
          );
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
