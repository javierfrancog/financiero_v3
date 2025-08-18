<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
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
                >mdi-clipboard-pulse-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Toma de Peso y Tensión</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-menu
                  ref="menu"
                  v-model="pickerFecha"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha"
                      label="Fecha"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                      @change="errores.fecha = false"
                      :error="errores.fecha"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="pickerFecha = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Colaborador"
                  v-model="form.colaborador"
                  :items="colaborador"
                  :item-text="format_colabora"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="(errores.colaborador = false), get_historial()"
                  :error="errores.colaborador"
                ></v-autocomplete>
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="red"
                  dark
                  class="mr-3"
                  @click="get_impresion"
                  depressed
                >
                  <v-icon size="20" left>mdi-file-pdf-box</v-icon>Imprimir
                </v-btn>

                <v-btn color="indigo" dark class @click="abrir_popup" depressed>
                  <v-icon size="20" left>mdi-cart-plus</v-icon>Agregar Registro
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="mt-3" color="#FF6F00"></v-divider>

            <div class="mt-2 pa-0 px-0">
              <v-data-table
                item-key="key"
                show-expand
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
                hide-default-footer
                disable-pagination
                :search-input.sync="search"
              >
                <template v-slot:item.action="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="
                          edit_item(item);
                          dialogo.tipo = false;
                        "
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Modificar Producto</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red darken-4"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="delete_item(item)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Anular Registro</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" max-width="800" persistent>
      <v-card
        class="text--white pa-2"
        :loading="dialogo.loader"
        :disabled="dialogo.loader"
      >
        <v-card-title>
          <v-row justify="end">
            <v-col class="d-flex" cols="6">
              <span class="title col-12">{{ dialogo.titulo }} </span>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Consecutivo"
                disabled
                v-model="form.consecutivo"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider class="mt-2" color="orange"></v-divider>

        <v-row class="mt-2" justify="center">
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Estatura cm"
              outlined
              v-model="form.estatura"
              hide-details
              @input="errores.estatura = false"
              :error="errores.estatura"
            ></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Peso"
              outlined
              v-model="form.peso"
              hide-details
              @input="errores.peso = false"
              :error="errores.peso"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Diástole"
              outlined
              v-model="form.diastole"
              hide-details
              @input="errores.diastole = false"
              :error="errores.diastole"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Systole"
              outlined
              v-model="form.systole"
              hide-details
              @input="errores.systole = false"
              :error="errores.systole"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="F.Cardiaca"
              outlined
              v-model="form.cardiaca"
              hide-details
              @input="errores.cardiaca = false"
              :error="errores.cardiaca"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-2" justify="center">
          <v-col class="d-flex" cols="4">
            <v-text-field
              label="Cantidad Ejercicio Semanal"
              outlined
              type="number"
              v-model="form.ejercicio"
              hide-details
              @input="errores.ejercicio = false"
              :error="errores.ejercicio"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ml-2 white--text px-12"
            color="indigo"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template><style scoped>
.inputBig {
  font-size: 36px !important;
}
</style>


<script>

import post from "../../methods.js";
import { pesoytalla } from "../../_formatos_hseq.js";
import { FlowerSpinner } from "epic-spinners";
import Chart from 'chart.js/auto'

export default {

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      agencias: [],
      ubica: [],
      empresa: [],
      productos: [],
      colaborador: [],
      tablaccosto: [],
      estatura_ant: 0,
      pickerFecha: false,
      error: [],
      proceso_imp: 0,
      ccosto_fact: 0,
      form: {
        peso: null,
        diastole: null,
        systole: null,
        colaborador: null,
        consecutivo: null,
        cardiaca: null,
        ejercicio: null,
      },
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },

      load: {
        btn_enviar: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
        consecutivo: false,
        servicios: false,
      },
      tablaDetalle: {
        headers: [
          {
            text: "Consecutivo",
            align: "left",
            value: "cod_rep",
          },
          {
            text: "Fecha",
            align: "left",
            value: "fecha_rep",
          },
          {
            text: "Estatura",
            align: "center",
            value: "estatura_rep",
          },
          {
            text: "Peso",
            align: "center",
            value: "peso_rep",
          },
          {
            text: "Imc",
            align: "center",
            value: "imc_rep",
          },
          {
            text: "Estado Imc",
            align: "center",
            value: "estadoimc_rep",
          },

          {
            text: "T/A",
            align: "center",
            value: "tension_rep",
          },
          {
            text: "F.Cardíaca",
            align: "center",
            value: "fcardiaca_rep",
          },
          {
            text: "Ejercicio Semanal",
            align: "center",
            value: "ejercicio_rep",
          },
        ],
        data: [],
        totales: {},
      },

      dialogo: {
        estado: false,
        tipo: true,
        loader: false,
        pago: false,
        remision: false,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        guardar: true,
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
      },
      errores: {
        peso: false,
        diastole: false,
        systole: false,
        colaborador: false,
        estatura: false,
        cardiaca: false,
        ejercicio: false,
      },
      print: {
        comprobante: null,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      search: null,
      input_articulo: false,
      card: {
        loader: false,
        disabled: false,
      },
      titulo_print: null,
      condicion_pdf: true,
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarcolaborador();
  },
  methods: {
    generarChart(data) {
      return new Promise((resolve) => {
        let canvas = document.createElement("canvas");
        canvas.id = "chartCanvas";
        canvas.width = 400; // Ancho del canvas
        canvas.height = 350; // Alto del canvas

        document.body.appendChild(canvas);

        let labels = data.map((_, index) => (index + 1).toString());

        let pesoData = data.map((d) => parseFloat(d.peso_rep));
        let fcData = data.map((d) => parseFloat(d.fcardiaca_rep));
        let tensionData = data.map((d) => {
          let tensionValues = d.tension_rep.split("/");
          return parseFloat(tensionValues[0]);
        });

        let ctx = canvas.getContext("2d");
        let myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels, // Eje X, ajusta según la cantidad de datos
            datasets: [
              {
                label: "PESO",
                data: pesoData, // Datos de PESO
                borderColor: "blue",
                fill: false,
              },
              {
                label: "FC",
                data: fcData, // Datos de FC
                borderColor: "green",
                fill: false,
              },
              {
                label: "Tensión Arterial",
                data: tensionData, // Datos de Tensión
                borderColor: "red",
                fill: false,
              },
            ],
          },
          options: {
            responsive: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            maintainAspectRatio: true,
            animation: {
              onComplete: function () {
                // Convertir el gráfico a imagen (base64)
                let chartImage = myChart.toBase64Image();
                resolve(chartImage);

                document.body.removeChild(canvas); // Elimina el canvas del DOM
              },
            },
          },
        });
      });
    },

    async get_impresion() {
      let data = {
        nombre:
          this.form.colaborador.nombrescolabora_rep.trim() +
          " " +
          this.form.colaborador.Apellido1colabora_rep.trim(),
        cargo: this.form.colaborador.nombrecargo_rep.trim(),
        registros: this.tablaDetalle.data,
      };
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const chartImage = await this.generarChart(data.registros);
      data.chartImage = chartImage; // Guardamos la imagen del gráfico en data

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;

      await pesoytalla(data);
      console.log("Impresion terminada");
    },
    get_historial() {
      let sesion = sessionStorage.Sesion;
      let colaborador = this.form.colaborador.idcolabora_rep;
      this.tablaDetalle.data = [];
      var datosEnvio = sesion + "|" + colaborador + "|";
      post
        .postData({
          url: "Hseq/dlls/PrpesoJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.tablaDetalle.data = JSON.parse(JSON.stringify(data));
          this.estatura_ant = this.tablaDetalle.data[0].estatura_rep;
        })
        .catch((err) => {
          console.log(err);
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
          this.send_error("Error al cargar el reporte");
        });
    },
    get_consecutivo() {
      post
        .postData({
          url: "Hseq/dlls/PrpesoN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.form.consecutivo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo",
            estado: true,
          });
        });
    },
    cargarcolaborador() {
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
      this.loader = true;
      let ano = this.form.fecha.substring(0, 4);
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|" + ano + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },
    format_colabora(val) {
      return `${val.Apellido1colabora_rep.trim()} ${val.nombrescolabora_rep.trim()}`;
    },
    async guardar() {
      var data = this.form;
      let estatura = parseFloat(data.estatura)
      if (!data.colaborador) {
        this.errores.colaborador = true;
        this.send_error("Selecciona un colaborador");
      } else if (!data.estatura || estatura < 140) {
        this.errores.estatura = true;
        this.send_error("Error en la Estatura");
        this.errores.estatura = true;
      } else if (!data.peso) {
        this.errores.peso = true;
        this.send_error("Debe registrar el peso");
      } else if (!data.diastole) {
        this.errores.diastole = true;
        this.send_error("Debe registrar la Diastóle");
      } else if (!data.systole) {
        this.errores.systole = true;
        this.send_error("Debe registrar la Sístole");
      } else if (!data.cardiaca) {
        this.errores.cardiaca = true;
        this.send_error("Debe registrar la Frecuencia Cardíaca");
      } else if (!data.ejercicio) {
        this.errores.ejercicio = true;
        this.send_error("Debe registrar el ejercicio semanal");
      } else {
        this.disabled.btn_enviar = true;
        this.load.btn_enviar = true;
        var sesion = sessionStorage.Sesion;
        let colaborador = data.colaborador.idcolabora_rep;
        let peso = data.peso.trim();
        let diastole = data.diastole.trim();
        let systole = data.systole.trim();
        let estatura = data.estatura.trim();
        let cardiaca = data.cardiaca.trim();
        let ejercicio = data.ejercicio;
        let consec = data.consecutivo;
        let fecha = data.fecha.replace(/\-/g, "");

        let datos = {
          url: "Hseq/dlls/Prpeso.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            consec +
            "|" +
            colaborador +
            "|" +
            fecha +
            "|" +
            peso +
            "|" +
            diastole +
            "|" +
            systole +
            "|" +
            estatura +
            "|" +
            cardiaca +
            "|" +
            ejercicio +
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.load.btn_enviar = false;
            this.disabled.btn_enviar = false;
            this.disabled.imprimir_factura = false;
            this.disabled.guardar = true;
            this.print.comprobante = data[0];
            this.dialogo.estado = false;

            this.$emit("snack", {
              color: "success",
              text: "Comprobante guardado correctamente",
              estado: true,
            });
            this.get_historial();
          })
          .catch((err) => {
            console.log(err);
            this.load.btn_enviar = false;
            this.disabled.btn_enviar = false;
            this.disabled.guardar = true;
            this.send_error("Error al grabar comprobante");
          });
      }
    },
    abrir_popup() {
      if (this.form.colaborador) {
        this.init_form();
        this.dialogo.estado = true;
        this.dialogo.tipo = true;
        this.disabled.guardar = false;
        let colaborador =
          this.form.colaborador.Apellido1colabora_rep.trim() +
          " " +
          this.form.colaborador.nombrescolabora_rep.trim();
        this.dialogo.titulo = colaborador;
        this.get_consecutivo();
        this.form.estatura = this.estatura_ant;
      } else {
        this.send_error("Debes seleccionar un colaborador");
      }
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          let forma_pago = parseInt(this.empresa.fpagocont_empr) || 2;
          this.form.fpago = forma_pago;
        })

        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    init_form() {
      (this.form.peso = null),
        (this.form.diastole = null),
        (this.form.systole = null);
      this.form.estatura = null;
      this.form.cardiaca = null;
      this.form.ejercicio = null;
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
