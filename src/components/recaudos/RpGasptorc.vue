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
                >mdi-sprinkler-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Llano Gas / Punto Recaudo</v-list-item-title
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
            </v-row>
            <v-row>
              <!-- <v-col class="d-flex" cols="12" sm="5">
                <v-autocomplete
                  label="Entidad"
                  v-model="form.convenio"
                  :items="convenios"
                  :item-text="format_convenios"
                  item-value="cod_rep"
                  hide-details
                  clearable
                  return-object
                  outlined
                  @change="errores.convenio = false"
                  :error="errores.convenio"
                ></v-autocomplete>
              </v-col> -->
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
            <v-row>
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
              item-key="index"
              :search="search"
            >
              <template v-slot:item.cantidad_rep="{ item }">
                <span
                  :class="
                    item.id ? (item.id == 99 ? 'font-weight-bold' : '') : ''
                  "
                  v-html="item.cantidad_rep"
                ></span>
              </template>
              <template v-slot:item.valor_rep="{ item }">
                <span
                  :class="
                    item.id ? (item.id == 99 ? 'font-weight-bold' : '') : ''
                  "
                  v-html="item.valor_rep"
                ></span>
              </template>
              <template v-slot:item.entidad_rep="{ item }">
                <span
                  :class="
                    item.id ? (item.id == 99 ? 'font-weight-bold' : '') : ''
                  "
                  v-html="item.entidad_rep"
                ></span>
              </template>

              <template v-slot:body.append>
                <tr>
                  <td></td>
                  <td></td>
                  <td class="font-weight-medium text-right">Total:</td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_cantidad) }}
                  </td>
                  <td>{{ formatNumero(total_tabla) }}</td>
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
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    // JsonExcel
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
      convenios: [],
      ptosrecaudo: [],
      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Entidad", align: "left", value: "entidad_rep" },
        { text: "Agencia", align: "left", value: "agencia_rep" },
        { text: "Municipio", align: "left", value: "ciudad_rep" },
        { text: "Cantidad", align: "center", value: "cantidad_rep" },
        { text: "Valor", align: "right", value: "valor_rep" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        convenio: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      total_tabla: 0,
      total_cantidad: 0,
    };
  },
  created() {
    this.consultar_convenios();
    this.cargaragencias();
  },
  methods: {
    consultar_convenios() {
      this.loader = true;
      let data = [sessionStorage.Sesion];
      this.postData({
        url: "Recaudos/dlls/CfConveniorcJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.convenios = JSON.parse(JSON.stringify(data));
          this.convenios.unshift({
            cod_rep: "0",
            descrip_rep: "Todas",
          });

          this.form.convenios = {
            cod_rep: "0",
            descrip_rep: "Todas",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },
    format_convenios(val) {
      return `${parseInt(val.cod_rep) || 0} - ${val.descrip_rep.trim()}`;
    },

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
      var data = this.contenido;
      var data_parse = data.map((el) => {
        el.cantidad_rep = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
        el.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        return el;
      });

      var columnas = [
        {
          title: "Entidad",
          value: "entidad_rep",
          format: "string",
        },
        {
          title: "Agencia",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Ciudad",
          value: "ciudad_rep",
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
        { text: "RECAUDO POR ENTIDAD", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Recaudo por Entidad",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-ENTIDAD-${new Date().getTime()}`,
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
          { text: el.entidad_rep, bold: el.id ? el.id == 99 : false },
          el.agencia_rep ? el.agencia_rep.trim() : "",
          el.ciudad_rep || "",
          {
            text: el.cantidad_rep.trim(),
            alignment: "center",
            bold: el.id ? el.id == 99 : false,
          },
          {
            text: el.valor_rep.trim(),
            alignment: "right",
            bold: el.id ? el.id == 99 : false,
          },
        ];

        data_parse.push(item);
      });

      data_parse.push([
        { text: "Total: ", colSpan: "2", alignment: "right" },
        null,
        null,
        { text: cantidad_total, alignment: "center" },
        { text: this.formatNumero(valor_total) },
      ]);

      data_parse.unshift([
        { text: "Entidad", style: "header_table" },
        { text: "Agencia", style: "header_table" },
        { text: "Ciudad", style: "header_table" },
        { text: "Cantidad", style: "header_table", alignment: "center" },
        { text: "Valor", style: "header_table" },
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
          width_table: ["*", "auto", "*", "*", "*"],
          logo,
          titulo: "Recaudo Por Entidad",
          fontSize: 8,
        });
      });
    },
    consultar_reporte() {
      this.loader = true;
      var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let punto = this.form.puntos.codigo_agc;
      let convenio = 800021272;
      let data = [
        sessionStorage.Sesion,
        fechaInicial,
        fechaFinal,
        punto,
        convenio,
      ];

      this.total_tabla = 0;
      this.total_cantidad = 0;
      this.postData({
        url: "Recaudos/dlls/RpRecxentptoJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((res) => {
          this.loader = false;
          res.pop();
          let data = JSON.parse(JSON.stringify(res));
          data.forEach((el) => {
            let valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
            this.total_tabla += valor;
            let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
            this.total_cantidad += cantidad;
          });

          let format_data = [];
          let anterior = null;
          let sub_cantidad = 0;
          let sub_valor = 0;
          data.forEach((item, index) => {
            let entidad = item.entidad_rep.trim();
            let cantidad =
              parseFloat(item.cantidad_rep.replace(/\,/g, "")) || 0;
            let valor = parseFloat(item.valor_rep.replace(/\,/g, "")) || 0;

            if (
              !anterior ||
              (anterior == entidad && index != data.length - 1)
            ) {
              anterior = entidad;
              sub_cantidad += cantidad;
              sub_valor += valor;
            } else if (anterior != entidad) {
              anterior = entidad;

              format_data.push({
                id: 99,
                entidad_rep: "Subtotal",
                cantidad_rep: `${this.formatNumero(sub_cantidad)}`,
                valor_rep: `${this.formatNumero(sub_valor)}`,
              });

              if (index != data.length - 1) {
                sub_cantidad = cantidad;
                sub_valor = valor;
              } else {
                sub_cantidad = 0;
                sub_valor = 0;
              }
            }

            format_data.push(item);

            if (index == data.length - 1) {
              sub_cantidad += cantidad;
              sub_valor += valor;

              format_data.push({
                id: 99,
                entidad_rep: "Subtotal",
                cantidad_rep: `${this.formatNumero(sub_cantidad)}`,
                valor_rep: `${this.formatNumero(sub_valor)}`,
              });
            }
          });

          this.contenido = format_data;
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
