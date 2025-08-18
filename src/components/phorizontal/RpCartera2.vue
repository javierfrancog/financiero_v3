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
                >mdi-invoice-text-arrow-right-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cartera por Concepto</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="ruts"
                  label="Rut a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ruts"
                  return-object
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                  v-if="form.ruts && form.ruts.value != 1"
                ></v-autocomplete>
              </v-col>
            </v-row>
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
                      label="Fecha Corte"
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
              <v-col cols="3">
                <v-btn
                  color="indigo"
                  class="mr-2 white--text px-12"
                  large
                  depressed
                  @click="cargarcontenido"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn
                  color="green"
                  class="mr-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                  @click="descargar_excel()"
                >
                  <v-icon right class="mr-2">mdi-file-excel-box</v-icon>
                  Descargar EXCEL
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mb-4">
              <v-col cols="12" md="10" class="d-flex justify-center">
                <div class="chart-wrap">
                  <canvas ref="graficoCartera"></canvas>
                </div>
              </v-col>
            </v-row>
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

import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar todos los elementos, escalas y controladores
Chart.register(...registerables);

// Registrar el plugin de datalabels
Chart.register(ChartDataLabels);


import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      chartInstance: null,
      errores: {
        punto_fact: false,
      },
      agencias: [],
      pickeFechaIni: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      tablasesor: [],
      empresa: [],
      search: "",
      form: {
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        ruts: null,
        asesor: null,
      },
      headers: [
        {
          text: "Id",
          align: "center",
          value: "id_rep",
        },
        {
          text: "Propietario",
          align: "left",
          value: "descripcion_rep",
        },
        {
          text: "Concepto",
          align: "left",
          value: "descrcargo_rep",
        },
        {
          text: "Saldo Cartera",
          align: "center",
          value: "valor_rep",
        },
        {
          text: "Saldo Contabilidad",
          align: "center",
          value: "sdocontab_rep",
        },
      ],
      ruts: [
        { text: "Todos los Ruts", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],
      asesor: [
        { text: "Todos los Asesores", value: 1 },
        { text: "Seleccion Unica", value: 2 },
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
      totales: {
        saldoCartera: 0,
        saldoContabilidad: 0,
      },
      disabledSelect: false,
    };
  },
  async created() {
    await this.cargar_empresa();
    this.cargarTablaruts();
    this.cargarTablasesor();
    this.cargarTablaAg();
  },
  methods: {
    cargar_empresa() {
      return new Promise((resolve) => {
        post
          .postData({
            url: "Financiero/dlls/CfEmpresaJ.dll",
            data: sessionStorage.Sesion + "|",
            method: "",
          })
          .then((data) => {
            this.empresa = data[0];
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar empresa",
              estado: true,
            });
          });
      });
    },

    // descargar_pdf() {
    //   let data = this.contenido;
    //   let data_format = [];
    //   let fecha_corte = this.form.fechaInicial.replace(/\-/g, "/");
    //   let granTotalxVencer = this.totales.xvencer;
    //   let granTotalVencido = this.totales.vencido;
    //   let granTotal = this.totales.total;

    //   data_format.push([
    //     { text: "Agencia", style: "header_table" },
    //     { text: "Descripción", style: "header_table" },
    //     { text: "Factura", style: "header_table" },
    //     { text: "Fecha", style: "header_table" },
    //     { text: "Vencimiento", style: "header_table" },
    //     { text: "Días", style: "header_table" },
    //     { text: "Por vencer", style: "header_table" },
    //     { text: "Vencido", style: "header_table" },
    //     { text: "Total", style: "header_table" },
    //   ]);

    //   data.forEach((el) => {
    //     let item;

    //     if (el.vence_rep.trim() != "Sub-total:") {
    //       item = [
    //         el.id_rep.trim(),
    //         el.descripcion_rep.trim(),
    //         el.pref_rep.trim() + " " + el.factura_rep.trim(),
    //         el.fecha_rep.trim(),
    //         el.vence_rep.trim(),
    //         el.dias_rep.replace(/ /g, ""),
    //         el.xvencer_rep.replace(/ /g, ""),
    //         el.vencido_rep.replace(/ /g, ""),
    //         { text: el.total_rep.trim(), alignment: "center" },
    //       ];
    //     } else {
    //       item = [
    //         "",
    //         "",
    //         "",
    //         "",
    //         {
    //           text: "Sub-total: ",
    //           bold: true,
    //           margin: [0, 0, 0, 20],
    //           fontSize: 9,
    //         },
    //         "",
    //         { text: el.xvencer_rep.replace(/ /g, ""), bold: true },
    //         { text: el.vencido_rep.replace(/ /g, ""), bold: true },
    //         { text: el.total_rep.trim(), bold: true, alignment: "center" },
    //       ];
    //     }

    //     data_format.push(item);
    //   });

    //   data_format.push([
    //     "",
    //     "",
    //     "",
    //     "",
    //     {
    //       text: "Totales: ",
    //       bold: true,
    //       fontSize: 10,
    //     },
    //     "",
    //     { text: this.formatNumero(granTotalxVencer), bold: true },
    //     { text: this.formatNumero(granTotalVencido), bold: true },
    //     { text: this.formatNumero(granTotal), bold: true, alignment: "center" },
    //   ]);

    //   let logo_src = require(`../../assets/image/clientes/${parseFloat(
    //     sessionStorage.Sesion.substr(0, 15)
    //   )}.png`);
    //   this.pdfs.getBase64(logo_src).then((logo) => {
    //     this.pdfs._informe({
    //       data: data_format,
    //       header_pdf: [
    //         {
    //           text: [{ text: "Fecha corte: ", bold: true }, fecha_corte],
    //         },
    //       ],
    //       titulo: "Reporte Cartera",
    //       logo,
    //       fontSize: 8,
    //     });
    //   });
    // },

    async descargar_excel() {
      let data = [...this.contenido];

      // === Paso 1: tu código actual de agrupación ===
      let groupedData = {};
      data.forEach((item) => {
        let id_rep_sin_ceros = item.id_rep.replace(/^0+/, "");
        if (!groupedData[id_rep_sin_ceros]) {
          groupedData[id_rep_sin_ceros] = {
            id_rep: id_rep_sin_ceros,
            propietario_rep: item.descripcion_rep.trim(),
            observaciones_rep: window.atob(
              item.base1_pr.trim() +
                item.base2_pr.trim() +
                item.base3_pr.trim() +
                item.base4_pr.trim() +
                item.base5_pr.trim() +
                item.base6_pr.trim()
            ),
          };
        }
        groupedData[id_rep_sin_ceros][item.descrcargo_rep.trim()] = parseFloat(
          item.valor_rep.replace(/,/g, "")
        );

        let sdocontab_value = parseFloat(
          item.sdocontab_rep.replace(/,/g, "").replace(/\s+/g, "")
        );
        if (sdocontab_value < 0) sdocontab_value = 0;

        groupedData[id_rep_sin_ceros].total_sdocontab =
          (groupedData[id_rep_sin_ceros].total_sdocontab || 0) +
          sdocontab_value;
      });

      let columnas = [
        { title: "Inmueble", value: "id_rep", format: "string" },
        { title: "Propietario", value: "propietario_rep", format: "string" },
      ];

      let uniqueDescrcargo = [
        ...new Set(data.map((item) => item.descrcargo_rep.trim())),
      ];

      uniqueDescrcargo.forEach((descr) => {
        columnas.push({
          title: descr,
          value: descr,
          format: "money",
          totalsRowFunction: "sum",
        });
      });

      columnas.push({
        title: "TOTAL",
        value: "total",
        format: "money",
        totalsRowFunction: "sum",
      });

      columnas.push({
        title: "TOTAL Sdo. Contab",
        value: "total_sdocontab",
        format: "money",
        totalsRowFunction: "sum",
      });

      columnas.push({
        title: "Observaciones",
        value: "observaciones_rep",
        format: "string",
      });

      let data_parse = Object.values(groupedData).map((item) => {
        let total = uniqueDescrcargo.reduce((sum, descr) => {
          return sum + (item[descr] || 0);
        }, 0);
        return { ...item, total };
      });

      data_parse.sort((a, b) => parseFloat(a.id_rep) - parseFloat(b.id_rep));

      // === Paso 2: Calcular totales para el gráfico ===
      let labels = uniqueDescrcargo;
      let totales = labels.map((col) =>
        data_parse.reduce((sum, row) => sum + (row[col] || 0), 0)
      );

      // === Paso 3: Crear gráfico con Chart.js en canvas oculto ===
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Totales por concepto",
              data: totales,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
        options: { responsive: false, plugins: { legend: { display: false } } },
      });

      // Esperar a que Chart.js termine de renderizar
      await new Promise((r) => setTimeout(r, 500));
      let graficoBase64 = canvas.toDataURL("image/png");

      // === Paso 4: Encabezado e inserción de imágenes ===
      let header_format = [
        { text: this.empresa.descrip_empr, bold: true, size: 16 },
        { text: this.empresa.ideditado_empr, bold: true, size: 14 },
        { text: `CARTERA POR CONCEPTOS`, size: 14 },
        { text: `${this.form.fechaInicial}`, size: 12 },
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      let logoBase64 = await this.pdfs.getBase64(logo_src);

      this.excel
        ._informe({
          sheetName: "Cartera por Conceptos",
          header: header_format,
          logo: logoBase64,
          extraImages: [graficoBase64], // ⬅ si _informe soporta más de una imagen
          tabla: {
            columnas,
            totalsRow: true,
            data: data_parse,
            theme: "TableStyleMedium2",
          },
          archivo: `CARTERA_CONCEPTOS-${new Date().getTime()}`,
        })
        .then(() => {
          console.log("Excel generado con gráfico");
        });
    },

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

          let ubica_perfil = this.empresa.ubicaperfil_empr;
          let ubica_rut = 1;
          let ubica_asesor = 1;

          if (this.empresa.contarem_empr == 1) {
            let busqueda_ubica = this.agencias.find(
              (el) => el.codigo_agc == ubica_perfil
            );
            this.form.punto_fact = busqueda_ubica;

            let busqueda_rut = this.ruts.find((el) => el.value == ubica_rut);
            this.form.ruts = busqueda_rut;

            let busqueda_ases = this.asesor.find(
              (el) => el.value == ubica_asesor
            );
            this.form.asesor = busqueda_ases;
            this.disabledSelect = true;
          }
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
    cargarcontenido() {
      var data = this.form;

      if (!data.ruts) {
        this.send_error("Selecciona el tipo de Ruts");
      } else if (data.ruts.value != 1 && !data.selruts) {
        this.send_error("Selecciona el código del Rut");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;
        var sesion = sessionStorage.Sesion;
        var selrut = data.selruts ? data.selruts.identificacion_rut : null;
        var asesor = 0;
        var punto = "0001";
        var tiporut = data.ruts.value;
        var tipoases = 1;
        let resumen = this.form.resumen ? "1" : "0";
        var fechaFinal = data.fechaInicial.replace(/\-/g, "");
        let calldll = "Phorizontal/dlls/RpCartera2J.DLL";

        var datosEnvio =
          sesion +
          "|" +
          punto +
          "|" +
          (tiporut == 1 ? "0" : selrut) +
          "|" +
          fechaFinal +
          "|" +
          (tipoases == 1 ? "0" : asesor) +
          "|" +
          resumen +
          "|";
        post
          .postData({
            url: calldll,
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.loader = false;

            data.pop();

            this.contenido = data;
            if (this.chartInstance) {
              this.chartInstance.destroy();
              this.chartInstance = null;
            }

            this.$nextTick(() => {
              this.mostrarGrafico();
            });

            let totales = { saldoCar: 0, saldoCont: 0 };

            data.forEach((el) => {
              totales.saldoCar +=
                parseFloat(el.valor_rep.replace(/,/g, "")) || 0;
              totales.saldoCont +=
                parseFloat(el.sdocontab_rep.replace(/,/g, "")) || 0;
            });

            this.totales = {
              saldoCartera: totales.saldoCar,
              saldoContabilidad: totales.saldoCont,
            };

            // var new_data = [];
            // var cuentaActual = null;
            // var cuentaSiguiente = null;
            // var subtotal_vencido = 0;
            // var subtotal_vencer = 0;
            // this.totales.xvencer = 0;
            // this.totales.vencido = 0;

            // data.forEach((item, index) => {
            //   cuentaActual = item.descripcion_rep;
            //   if (index + 1 != data.length)
            //     cuentaSiguiente = data[index + 1].descripcion_rep;

            //   item.index = index;
            //   item.descripcion_rep = item.descripcion_rep.replace(
            //     / +(?= )/g,
            //     ""
            //   );
            //   new_data.push(item);

            //   let vencido =
            //     parseFloat(item.vencido_rep.replace(/\,/g, "")) || 0;
            //   let xvencer =
            //     parseFloat(item.xvencer_rep.replace(/\,/g, "")) || 0;

            //   subtotal_vencido += vencido;
            //   subtotal_vencer += xvencer;

            //   this.totales.xvencer += xvencer;
            //   this.totales.vencido += vencido;

            //   let total = xvencer + vencido;
            //   item.valor_rep = this.formatNumero(total);

            //   if (cuentaActual != cuentaSiguiente || index + 1 == data.length) {
            //     let subtotal_total = subtotal_vencer + subtotal_vencido;

            //     new_data.push({
            //       separador: true,
            //       agencia_rep: "",
            //       descripcion_rep: "",
            //       direccion_rep: "",
            //       id_rep: "",
            //       pref_rep: "",
            //       factura_rep: "",
            //       fecha_rep: "",
            //       vence_rep: "Sub-total:",
            //       dias_rep: "",
            //       xvencer_rep: this.formatNumero(subtotal_vencer.toFixed(2)),
            //       vencido_rep: this.formatNumero(subtotal_vencido.toFixed(2)),
            //       total_rep: this.formatNumero(subtotal_total),
            //     });

            //     subtotal_vencido = 0;
            //     subtotal_vencer = 0;
            //   }
            // });

            // this.totales.total = this.totales.xvencer + this.totales.vencido;
          })
          .catch((err) => {
            console.log(err);
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte Cartera");
          });
      }
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    format_asesor: function (val) {
      return `${val.idases} - ${val.descripases}`;
    },
    cargarTablasesor: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAsesorJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablasesor = [];
          this.tablasesor = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
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
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    mostrarGrafico() {
      // Agrupar totales por concepto
      const totalesPorConcepto = this.contenido.reduce((acc, item) => {
        const concepto = (item.descrcargo_rep || "").trim();
        const valor =
          parseFloat(String(item.valor_rep || "0").replace(/,/g, "")) || 0;
        acc[concepto] = (acc[concepto] || 0) + valor;
        return acc;
      }, {});

      const conceptos = Object.keys(totalesPorConcepto);
      const totales = conceptos.map((c) => totalesPorConcepto[c]);

      // Abreviar labels largos (evita solapamiento)
      const abreviar = (s, n = 14) =>
        s.length > n ? s.slice(0, n - 1) + "…" : s;
      const labelsAbrev = conceptos.map((c) => abreviar(c));

      // Limpiar gráfico previo
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }

      const ctx = this.$refs.graficoCartera.getContext("2d");
      const fmtCOP = (v) =>
        new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(v);
      const maxVal = Math.max(...totales, 0);
      const umbralEtiqueta = maxVal * 0.08; // solo muestra etiqueta si la barra >= 8% del máximo

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labelsAbrev,
          datasets: [
            {
              label: "Total por concepto",
              data: totales,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              categoryPercentage: 0.7,
              barPercentage: 0.9,
              maxBarThickness: 42,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // usa el alto del contenedor .chart-wrap
          legend: { display: false },
          title: { display: true, text: "Cartera por Concepto" },
          layout: { padding: { top: 28, right: 8, left: 8, bottom: 8 } },
          scales: {
            xAxes: [
              {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 8, // no muestres más de 8 categorías visibles
                  maxRotation: 30,
                  minRotation: 0,
                  fontSize: 11,
                },
                gridLines: { display: false },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value) => fmtCOP(value),
                  fontSize: 11,
                },
              },
            ],
          },
          tooltips: {
            callbacks: { label: (ti) => fmtCOP(ti.yLabel) },
          },
          plugins: {
            datalabels: {
              display: (ctx) =>
                ctx.dataset.data[ctx.dataIndex] >= umbralEtiqueta, // evita ruido
              anchor: "end",
              align: "end",
              offset: 6,
              clamp: true,
              color: "#000",
              font: { weight: "bold", size: 11 },
              formatter: (value) => fmtCOP(value),
            },
          },
        },
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

<style scoped>
.chart-wrap {
  width: 100%;
  max-width: 900px; /* más ancho */
  height: 420px; /* más alto */
  margin: 16px auto;
  position: relative; /* requerido por Chart.js */
}
.chart-wrap canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
