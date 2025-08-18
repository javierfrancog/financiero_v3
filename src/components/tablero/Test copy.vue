<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-finance</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Tablero Comercial</v-list-item-title
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
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="get_consultar()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Consultar
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <canvas id="grafico_ventas" width="100" height="50"></canvas>
              </v-col>
            </v-row>
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
import Chart from 'chart.js/auto'

export default {

  data() {
    return {
      loader: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      expanded: [],
      contenido: [],
      search: "",
      form: null,
      drawer: false,
      headers: [],
      detalle: [],
    };
  },
  mounted() {},
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    this.get_consultar();
  },
  methods: {
    graficar(parent, labels, data, tipo, titulo) {
      new Chart(document.getElementById(parent), {
        type: tipo,
        data: {
          // labels: ["Red", "Blue"],
          labels,
          datasets: [
            {
              // label: titulo,
              // data: [12, 19],
              data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
              borderWidth: 2,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: titulo,
            fontSize: 18
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontSize: 18,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  fontSize: 18,
                },
              },
            ],
          },
        },
      });
    },
    get_consultar() {
      this.get_ventas();
    },
    get_ventas() {
      this.loader = true;
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      post
        .postData({
          url: "Financiero/dlls/RpGrafTestJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((res) => {
          this.loader = false;
          // res = res.filter((el) => el.perido_rep.trim());

          // labels = posicion X
          // data = posicion Y

          let labels = [];
          let data = [];
          res.forEach((el) => {
            let valor = el.ejey_rep;
            let periodo = el.ejex_rep;

            data.push(parseFloat(valor));
            labels.push(periodo);
          });

          this.graficar("grafico_ventas", labels, data, "line", "Ventas (Millones de $)");
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ventas",
            estado: true,
          });
        });
    },

  },
};
</script>
