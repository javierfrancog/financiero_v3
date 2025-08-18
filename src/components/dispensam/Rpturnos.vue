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
                >mdi-view-grid-plus-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Proceso de Turnos</v-list-item-title
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
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Sede"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="errores.puntos = false"
                  :error="errores.puntos"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col>
                <v-btn
                  color="indigo darken-3 white--text"
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
              </v-col>

              <v-col>
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
            <v-row class="d-flex justify-center">
              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.ressede"
                  @change="seleccion_resumen(1)"
                  hide-details
                  label="Resumen por Agencia"
                ></v-switch>
              </v-col>
              <!-- <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.resfunc"
                  @change="seleccion_resumen(2)"
                  hide-details
                  label="Resumen por Funcionario"
                ></v-switch>
              </v-col> -->
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-row class="d-flex mb-4 justify-center" no-gutters v-if="form.ressede">
              <v-col cols="12">
                <canvas id="grafico1"></canvas>
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
              <template v-slot:item.codusuario_rep="{ item }">
                {{ parseInt(item.codusuario_rep) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import Chart from 'chart.js/auto'
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
      pterad: null,
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
        { text: "", value: "data-table-expand" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Hora Turno", align: "left", value: "hturno_rep" },
        { text: "Hora Llamado", align: "center", value: "hllamado_rep" },
        { text: "Minutos de Espera", align: "center", value: "tllamado_rep" },
        { text: "Hora Atencion", align: "center", value: "hatencion_rep" },
        { text: "Minutos en Atencion", align: "center", value: "tatenc_rep" },
        { text: "Total Minutos", align: "center", value: "ttotal_rep" },
        { text: "Usuario Atiende", align: "center", value: "usuario_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        puntos: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.cargaragencias();
  },
  methods: {
    async seleccion_resumen(tipo) {
      if (tipo === 1) {
        this.form.resfunc = false;
        this.consultar_reporte();
      } else {
        this.form.resfunc = true;
      }
    },
    async graficar(data) {
      const colors = ["#FF5733", "#33FF57", "#3366FF"];

      return new Promise((resolve) => {
        const myChart = new Chart(document.getElementById("grafico1"), {
          type: "bar",
          data: {
            labels: data.map((sede) => sede.agencia_rep.trim()),
            datasets: [
              {
                label: "Minutos en espera",
                data: data.map((sede) => parseFloat(sede.tllamado_rep)),
                backgroundColor: colors[0],
              },
              {
                label: "Minutos en atención",
                data: data.map((sede) => parseFloat(sede.tatenc_rep)),
                backgroundColor: colors[1],
              },
              {
                label: "Minutos totales",
                data: data.map((sede) => parseFloat(sede.ttotal_rep)),
                backgroundColor: colors[2],
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: "Tiempo de espera y atención por sede",
              fontSize: 18,
              fontColor: "black",
              fontStyle: "bold",
            },
            legend: {
              display: true,
              position: "top",
            },
            scales: {
              xAxes: [
                {
                  stacked: false,
                  scaleLabel: {
                    display: true,
                    labelString: "Sedes",
                  },
                },
              ],
              yAxes: [
                {
                  stacked: false,
                  scaleLabel: {
                    display: true,
                    labelString: "Minutos",
                  },
                },
              ],
            },
          },
        });

        // myChart.canvas.parentNode.style.height = "400px";
        myChart.render();
        let url = myChart.toBase64Image();
        resolve(url);
      });
    },

    format_convenios(val) {
      return `${parseInt(val.cod_rep) || 0} - ${val.descrip_rep.trim()}`;
    },
    cargaragencias: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
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
            descripcion_agc: "Todas",
          };
        })
        .catch((err) => {
          this.send_error("Error al cargar Sedes");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Bloqueado";
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Sede",
          value: "agencia_rep",
          format: "string",
          totalsRowFunction: "count",
        },
        {
          title: "Fila",
          value: "fila_rep",
          format: "string",
        },

        {
          title: "Hora Turno",
          value: "hturno_rep",
          format: "string",
        },
        {
          title: "Hora Llamado",
          value: "hllamado_rep",
          format: "string",
        },
        {
          title: "Minutos Espera llamado",
          value: "tllamado_rep",
          format: "string",
        },
        {
          title: "Hora Atencion",
          value: "hatencion_rep",
          format: "string",
        },
        {
          title: "Minutos en Atención",
          value: "tatenc_rep",
          format: "string",
        },
        {
          title: "Tiempo Total",
          value: "ttotal_rep",
          format: "string",
        },
        {
          title: "Cant. Formulas",
          value: "cant_rep",
          format: "string",
        },
        {
          title: "Id_Paciente",
          value: "idpac_rep",
          format: "string",
        },
        {
          title: "Tipo_Id_Paciente",
          value: "tipoid_rep",
          format: "string",
        },

        {
          title: "Estado",
          value: "estado_rep",
          format: "string",
        },
        {
          title: "Funcionario",
          value: "usuario_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE TURNOS", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Turnos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE TURNOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultar_reporte() {
      if (!this.form.puntos) {
        this.errores.puntos = true;
        this.send_error("Selecciona una sede");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.puntos.codigo_agc;
        let ressede = this.form.ressede ? 1 : 0;
        let resfunc = this.form.resfunc ? 1 : 0;

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          ressede,
          resfunc,
        ];
        this.postData({
          url: "dispensa/dlls/RpTurnosJ.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));

            if (this.form.ressede) this.graficar(this.contenido);
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
      }
    },
    calcular_final() {
      this.form.fechaFinal = this.form.fechaInicial;
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
