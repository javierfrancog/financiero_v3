<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-bank-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Escala 0-2 años</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row class="text-center">
              <v-col cols="3">
                <v-btn @click="get_pdf()">Graficos</v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn
                  @click="
                    graficar(
                      labels.titulo1,
                      labels.primero,
                      'grafico1',
                      data1,
                      puntos.primeraGr
                    );
                    graficar(
                      labels.titulo2,
                      labels.segundo,
                      'grafico2',
                      data2,
                      puntos.segundaGr
                    );
                  "
                  >GR</v-btn
                >
              </v-col>
              <v-col cols="12">
                <canvas id="grafico1"></canvas>
              </v-col>
              <v-col cols="12">
                <canvas id="grafico2"></canvas>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import Chart from 'chart.js/auto'
import { escala_2years } from "../../_formatos.pdf";

export default {
  name: "app",

  data() {
    return {
      loader: false,
      data1: [
        { x: 45, y: 2.5 },
        { x: 48, y: 3 },
        { x: 51, y: 3.5 },
        { x: 53, y: 4 },
        { x: 55, y: 4.5 },
        { x: 57, y: 5 },
        { x: 60, y: 6 },
        { x: 62, y: 6.5 },
        { x: 64, y: 7 },
        { x: 68, y: 8 },
        { x: 72.5, y: 9 },
        { x: 75, y: 9.5 },
        { x: 80, y: 10.5 },
        { x: 87, y: 12 },
        { x: 90, y: 12.75 },
        { x: 91, y: 13 },
        { x: 93, y: 13.5 },
        { x: 95.5, y: 14 },
        { x: 99.4, y: 15 },
        { x: 101, y: 15.5 },
        { x: 103, y: 16 },
        { x: 106, y: 17 },
        { x: 107.7, y: 17.5 },
        { x: 110, y: 18.25 },
      ],
      data2: [
        { x: 0, y: 3.4 },
        { x: 1, y: 4.5 },
        { x: 2, y: 5.5 },
        { x: 3, y: 6.4 },
        { x: 4, y: 7 },
        { x: 6, y: 8 },
        { x: 8, y: 8.6 },
        { x: 10, y: 9.2 },
        { x: 11, y: 9.5 },
        { x: 12, y: 9.7 },
        { x: 13.5, y: 10 },
        { x: 16, y: 10.5 },
        { x: 18, y: 10.9 },
        { x: 20, y: 11.3 },
        { x: 22, y: 11.7 },
        { x: 23.3, y: 12 },
        { x: 24, y: 12.2 },
      ],
      puntos: {
        primeraGr: [
          { x: 90, y: 15 },
          { x: 50, y: 2 },
          { x: 80, y: 6 },
          { x: 60, y: 6 },
          { x: 105, y: 18 },
        ],
        segundaGr: [
          { x: 12, y: 11 },
          { x: 5, y: 4.5 },
          { x: 18, y: 14 },
        ],
      },
      labels: {
        titulo1: "PESO para la talla en niños (de 0 a 2 años)",
        titulo2: "PESO para la edad en niños (de 0 a 2 años)",
        primero: { x: "Longitud (cm)", y: "Peso (kg)" },
        segundo: { x: "Edad (en meses)", y: "Peso (kg)" },
      },
    };
  },
  methods: {
    async get_pdf() {
      let data = {};
      data.grafico1 = await this.graficar(
        this.labels.titulo1,
        this.labels.primero,
        "grafico1",
        this.data1,
        this.puntos.primeraGr
      );
      data.grafico2 = await this.graficar(
        this.labels.titulo2,
        this.labels.segundo,
        "grafico2",
        this.data2,
        this.puntos.segundaGr
      );

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        escala_2years(data).then(() => {
          console.log("Impresión terminada");
        });
      });
    },

    async graficar(titulo, labels, element, data, puntos) {
      let datasetsPuntos = puntos.map((el) => {
        return {
          data: [el], // Coordenadas del punto independiente
          backgroundColor: "black",
          borderColor: "black",
          pointStyle: "cross", // Forma del punto
          pointRadius: 8, // Tamaño del punto
          borderWidth: 2,
        };
      });

      return new Promise((resolve) => {
        var myChart = new Chart(document.getElementById(element), {
          type: "line",
          data: {
            datasets: [
              {
                data,
                borderColor: "green",
                fill: false,
                pointRadius: 0,
              },
              ...datasetsPuntos,
            ],
          },
          options: {
            title: {
              display: true,
              text: titulo,
              fontSize: 18,
              fontColor: "black",
              fontStyle: "bold",
            },
            legend: {
              display: false, // Oculta la leyenda
            },
            animation: {
              onComplete: function () {
                let url = myChart.toBase64Image();
                resolve(url);
              },
            },
            scales: {
              xAxes: [
                {
                  type: "linear",
                  position: "bottom",
                  scaleLabel: {
                    display: true,
                    labelString: labels.x,
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: labels.y,
                  },
                },
              ],
            },
          },
        });
      });
    },
  },
};
</script>