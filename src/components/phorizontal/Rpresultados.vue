<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="load.card"
        :disabled="load.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-chart-bar</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline">Resultados</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center">
              <v-col cols="6">
                <v-select
                  label="Selecciona una asamblea"
                  clearable
                  :items="asambleas"
                  outlined
                  v-model="formulario.asamblea"
                  return-object
                  :error="errores.asamblea"
                  @change="errores.asamblea = false"
                  :loading="load.asambleas"
                  hide-details
                  item-value="id"
                  item-text="descripcion"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Fecha asamblea"
                  outlined
                  disabled
                  hide-details
                  v-model="fecha_asamblea"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col cols="9">
                <v-select
                  label="Selecciona una pregunta"
                  clearable
                  :items="preguntas"
                  outlined
                  v-model="formulario.preguntas"
                  return-object
                  :loading="load.preguntas"
                  hide-details
                  item-value="id"
                  item-text="descripcion"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col cols="8" v-show="mostrar_grafico">
                <apexchart
                  ref="realtimeChart"
                  type="bar"
                  height="350"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col>
                    <span class="title">Detalle de votaciones</span>
                  </v-col>
                  <v-col class="d-flex align-end justify-end">
                    <v-btn
                      depressed
                      small
                      outlined
                      color="red"
                      class="white--text mr-3"
                      @click="get_pdf"
                      :disabled="!formulario.preguntas"
                    >
                      <v-icon>mdi-pdf-box</v-icon>Exportar
                    </v-btn>
                    <v-btn
                      depressed
                      small
                      outlined
                      color="green"
                      class="white--text"
                      @click="mostrar_detalle = !mostrar_detalle"
                      >Mostrar / ocultar detalles</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" v-show="mostrar_detalle">
                <v-data-table
                  :headers="tabla.headers"
                  :items="this.formulario.respuestas"
                  item-key="id"
                  :sort-by="['fechaRegistro']"
                  :sort-desc="[true]"
                >
                  <template v-slot:item.token="{ item }">
                    <v-chip
                      label
                      small
                      color="blue darken-2"
                      class="white--text overline"
                      >{{ item.usuario.token }}</v-chip
                    >
                  </template>
                  <template v-slot:item.respuestas="{ item }">
                    <v-chip
                      v-for="(el, key) in item.respuestas"
                      :key="key"
                      label
                      class="white--text"
                      color="green darken-3"
                      small
                      v-show="item.respondio"
                      >{{ String.fromCharCode(97 + el.id).toUpperCase() }} -
                      {{ el.descripcion }}</v-chip
                    >
                    <v-chip
                      v-show="!item.respondio"
                      label
                      small
                      class="white--text"
                      color="red darken-3"
                      >Vencido</v-chip
                    >
                  </template>
                  <template v-slot:item.fechaRegistro="{ item }">{{
                    format_fecha(item.fechaRegistro.toDate())
                  }}</template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import VueApexCharts from "vue3-apexcharts";
// Importación correcta para Vite desde node_modules
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      asambleas: [],
      fecha_asamblea: null,
      formulario: {},
      errores: {},
      load: {
        card: false,
        asambleas: true,
        preguntas: false,
      },
      tabla: {
        headers: [
          { text: "Participante", align: "left", value: "usuario.nombres" },
          { text: "Fecha y hora", align: "center", value: "fechaRegistro" },
        ],
        data: [],
      },
      preguntas: [],
      series: [
        {
          name: "Votos",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        title: {
          text: null,
          style: {
            fontSize: "18px",
            fontWeight: "600",
            fontFamily: undefined,
            color: "#0D47A1",
          },
        },
        subtitle: {
          text: "Total votos: - Actualización: ",
          align: "left",
          offsetX: 20,
          offsetY: 30,
          floating: false,
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            fontFamily: undefined,
            color: "#222",
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      },
      mostrar_grafico: false,
      mostrar_detalle: false,
    };
  },
  created() {
    this.consultar_asambleas();
    this.init_formulario();
  },
  watch: {
    "formulario.asamblea": function (data) {
      if (data) {
        this.fecha_asamblea = data.fecha + " " + data.hora;
        this.consultar_preguntas(data.id);
      } else {
        this.preguntas = [];
        this.formulario.preguntas = null;
        this.fecha_asamblea = null;
        this.tabla.data = [];
      }
    },
    "formulario.preguntas": function (data) {
      this.mostrar_detalle = false;
      if (data) {
        this.mostrar_grafico = true;
        this.graficar(data);
        this.consultar_resultados(data.id);
      } else {
        this.mostrar_grafico = false;
        this.formulario.respuestas = [];
      }
    },
  },
  methods: {
    get_pdf() {
      var currentdate = new Date();
      var dateString =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " - " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      var asamblea = this.formulario.asamblea;
      var pregunta = this.formulario.preguntas;
      var resultados = this.formulario.resultados;
      var respuestas = this.formulario.respuestas;
      var total = respuestas.length || 0;
      var anulados = respuestas.filter((el) => !el.respondio);
      let id_pregunta = pregunta.id;
      console.log("Pregunta", id_pregunta);

      var array_pdf = [];
      respuestas.forEach((el) => {
        let opc_respuesta =
          el.respuestas.length > 0 ? el.respuestas[0].id : false;
        let respuesta =
          el.respondio && opc_respuesta
            ? String.fromCharCode(97 + el.respuestas[0].id).toUpperCase() +
              " - " +
              el.respuestas[0].descripcion
            : "Anulado";

        if (
          (id_pregunta == "RMdEEuFQF2rsHAzbqDAf" ||
            id_pregunta == "RrHj09KLNNcSZ8nAjG8U") &&
          respuesta == "Anulado"
        )
          respuesta = "A - SI";

        let obj = [
          el.usuario.nombres,
          respuesta,
          this.format_fecha(el.fechaRegistro.toDate()),
        ];
        array_pdf.push(obj);
      });

      array_pdf.unshift([
        { text: "Participante", bold: true },
        { text: "Respuesta", bold: true },
        { text: "Registro", bold: true },
      ]);

      var respuestas_pdf = [];
      pregunta.respuestas.forEach((el, index) => {
        let votos = resultados[index];

        if (
          (id_pregunta == "RMdEEuFQF2rsHAzbqDAf" ||
            id_pregunta == "RrHj09KLNNcSZ8nAjG8U") &&
          index == 0
        )
          votos += anulados.length;

        let porcentaje = (votos * 100) / total;
        let obj = {
          text: [
            { text: el, bold: true },
            ` - ${votos} votos (${porcentaje.toFixed(1)}%)`,
          ],
        };
        respuestas_pdf.push(obj);
      });

      if (
        id_pregunta == "RMdEEuFQF2rsHAzbqDAf" ||
        id_pregunta == "RrHj09KLNNcSZ8nAjG8U"
      )
        anulados = [];

      let porcentaje = (anulados.length * 100) / total;
      let obj = {
        text: [
          { text: "Anulados", bold: true },
          ` - ${anulados.length} votos (${porcentaje.toFixed(1)}%)`,
        ],
      };
      respuestas_pdf.push(obj);

      var docDefinition = {
        // pageOrientation: "landscape",
        header: function (currentPage, pageCount, pageSize) {
          return [
            {
              text: `Reporte de resultados - ${dateString}`.toUpperCase(),
              bold: true,
              alignment: "left",
              fontSize: 10,
              lineHeight: 1,
              margin: [40, 20, 0, 0],
            },
          ];
        },
        footer: function (currentPage, pageCount) {
          return [
            {
              text: currentPage.toString() + " de " + pageCount,
              alignment: "right",
              margin: [0, 0, 50, 0],
            },
          ];
        },
        content: [
          {
            text: [{ text: "Asamblea: ", bold: true }, asamblea.descripcion],
          },
          {
            text: [
              { text: "Fecha asamblea: ", bold: true },
              asamblea.fecha + " " + asamblea.hora,
            ],
          },
          {
            canvas: [
              { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.1 },
            ],
            margin: [0, 10, 0, 10],
          },
          { text: [{ text: "Pregunta: ", bold: true }, pregunta.descripcion] },
          { text: [{ text: "Total votos: ", bold: true }, respuestas.length] },
          {
            ul: respuestas_pdf,
            margin: [20, 5, 0, 0],
            fontSize: 12,
          },
          {
            canvas: [
              { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.1 },
            ],
            margin: [0, 10, 0, 10],
          },
          {
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 0],
            table: {
              headerRows: 1,
              widths: ["*", "*", "auto"],
              body: array_pdf,
            },
          },
        ],
      };

      pdfMake
        .createPdf(docDefinition)
        // .download(`REPORTE_RESULTADOS_${new Date().getTime()}.pdf`);
        .open();
    },
    format_fecha(fecha) {
      var currentdate = new Date(fecha);
      var dateString =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " - " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      return dateString;
    },
    show_datos() {
      var respuestas = this.formulario.respuestas;
      var resultados = this.formulario.resultados;
      resultados.forEach((el, index) => {
        resultados[index] = 0;
      });

      respuestas.forEach((el) => {
        el.respuestas.forEach((item) => {
          resultados[item.id] += 1;
        });
      });

      var currentdate = new Date();
      var dateString =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " - " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      this.chartOptions.subtitle.text = `Total votos: ${respuestas.length} - Actualización: ${dateString}`;

      if (this.$refs.realtimeChart) {
        this.$refs.realtimeChart.updateOptions(this.chartOptions);
        this.$refs.realtimeChart.updateSeries(
          [
            {
              name: "Votos",
              data: resultados,
            },
          ],
          false,
          true
        );
      }
    },
    graficar(pregunta) {
      var labels = [];
      var resultados = [];
      pregunta.respuestas.forEach((el, index) => {
        labels.push(el.split(" "));
        resultados.push(0);
      });

      this.chartOptions.xaxis.categories = labels;
      this.chartOptions.title.text = pregunta.descripcion;
      this.formulario.resultados = resultados;
      if (this.$refs.realtimeChart) {
        this.$refs.realtimeChart.updateOptions(this.chartOptions);
        this.$refs.realtimeChart.updateSeries(
          [
            {
              data: this.series[0].data,
            },
          ],
          false,
          true
        );
      }
    },
    consultar_resultados(idPregunta) {
      var $this = this;
      $this.load.card = true;
      $this.formulario.respuestas = [];
      this.fb.$respuestas.where("pregunta.id", "==", idPregunta).onSnapshot(
        (snapshot) => {
          $this.formulario.respuestas = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            $this.formulario.respuestas.push(data);
          });

          $this.load.card = false;
          $this.show_datos();
        },
        (err) => {
          $this.load.card = false;
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    consultar_preguntas(idAsamblea) {
      var $this = this;
      $this.load.preguntas = true;
      this.fb.$preguntas.where("asamblea.id", "==", idAsamblea).onSnapshot(
        (snapshot) => {
          $this.preguntas = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            data.activar = data.estado == 1 ? false : true;
            $this.preguntas.push(data);
          });

          $this.load.preguntas = false;
        },
        (err) => {
          $this.load.preguntas = false;
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    consultar_asambleas() {
      var $this = this;
      this.fb.$asambleas.where("estado", "==", 0).onSnapshot(
        (snapshot) => {
          $this.asambleas = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            $this.asambleas.push(data);
          });

          $this.load.asambleas = false;
        },
        (err) => {
          $this.load.asambleas = false;
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    init_formulario() {
      this.formulario = {
        asamblea: null,
        preguntas: null,
        respuestas: [],
        resultados: [],
      };

      this.errores = {
        asamblea: false,
        preguntas: null,
      };
    },
  },
};
</script>