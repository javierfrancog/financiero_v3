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
                >mdi-cookie-clock-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cartera por Estado</v-list-item-title
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
            </v-row>

            <v-row class="d-flex justify-left">
              <v-col cols="12">
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
                <!-- <v-btn
                  color="green"
                  class="mr-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                  @click="descargar_excel()"
                >
                  <v-icon right class="mr-2">mdi-file-excel-box</v-icon>
                  Descargar EXCEL
                </v-btn> -->
                <v-btn
                  @click="descargar_pdf()"
                  color="red darken-2"
                  class="white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                >
                  <v-icon right dark>mdi-pdf-box</v-icon> Descargar .PDF
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center align-center">
              <v-col cols="6" lg="6" md="12" sm="12">
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
              <template v-slot:item.id_rep="{ item }">
                {{ parseInt(item.id_rep) }}
              </template>

              <!-- <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep"
                  >{{ item.codcta_rep }} - {{ item.descripcta_rep }}</label
                >
              </template> -->
              <!-- <template v-slot:item.dias_rep="{ item }">
                <label v-html="item.dias_rep"></label>
              </template>
              <template v-slot:item.vence_rep="{ item }">
                <b v-if="item.separador">{{ item.vence_rep }}</b>
                <label v-else>{{ item.vence_rep }}</label>
              </template>
              <template v-slot:item.xvencer_rep="{ item }">
                <b v-if="item.separador">{{ item.xvencer_rep }}</b>
                <label v-else>{{ item.xvencer_rep }}</label>
              </template>
              <template v-slot:item.vencido_rep="{ item }">
                <b v-if="item.separador">{{ item.vencido_rep }}</b>
                <label v-else>{{ item.vencido_rep }}</label>
              </template> -->
              <template v-slot:item.valor_rep="{ item }">
                <b v-if="item.separador">{{ item.valor_rep }}</b>
                <label v-else>{{ item.valor_rep }}</label>
              </template>

              <!-- <template v-slot:item.docinter_rep="{ item }">
                <v-btn
                  depressed
                  small
                  rounded
                  color="primary"
                  outlined
                  v-if="item.descripcta_rep"
                  @click="reimprimir(item)"
                  >{{ item.docinter_rep }}</v-btn
                >
              </template> -->
              <!-- <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Imprimir Factura</b>
                        </td>
                        <td>{{ item.codcta_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Pagos</b>
                        </td>
                        <td>{{ item.pagos_rep }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template> -->
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
              <template v-slot:body.append>
                <td colspan="1" class="text-right">
                  <strong>TOTALES</strong>
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.saldoCartera) }}
                </td>
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

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { reporteCartera } from "../../_formatos_ph.js";
import Chart from 'chart.js/auto'

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
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
          text: "Estado",
          align: "left",
          value: "estado_rep",
        },
        {
          text: "Saldo Cartera",
          align: "center",
          value: "valor_rep",
        },
        {
          text: "Cantidad",
          align: "center",
          value: "cant_rep",
        },
        {
          text: "%",
          align: "center",
          value: "porc_rep",
        },
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
  },
  methods: {
    generarColores(numColores) {
      const colores = [];
      const baseColores = ['#36A2EB','#FF6384',  '#FFCE56', '#4BC0C0'];
      for (let i = 0; i < numColores; i++) {
        colores.push(baseColores[i % baseColores.length]);
      }
      return colores;
    },

    async generarGraficoPastel() {
      return new Promise((resolve) => {
        // Crear y agregar el canvas al DOM
        const canvas = document.createElement('canvas');
        canvas.width = 200; // Ajusta el ancho del canvas
        canvas.height = 200; // Ajusta el alto del canvas
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const dataGrafico = this.contenido;

        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: dataGrafico.map(item => item.estado_rep.trim()),
            datasets: [{
              data: dataGrafico.map(item => parseFloat(item.porc_rep)),
              backgroundColor: ['#36A2EB','#FF6384', '#FFCE56'] // Colores de los segmentos
            }]
          },
          options: {
            responsive: false, // Desactivar el ajuste responsivo para usar el tamaño del canvas
            maintainAspectRatio: false,
            animation: {
              onComplete: () => {
                // Convertir el gráfico a imagen (base64)
                const chartImage = canvas.toDataURL('image/png');
                resolve(chartImage);
                document.body.removeChild(canvas); // Eliminar el canvas del DOM
              }
            }
          }
        });
      });
    },

    async descargar_pdf() {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const data = {
        logo: await this.pdfs.getBase64(logo_src),
        graficoPastel: await this.generarGraficoPastel(),
        nombre_empr: this.empresa.descrip_empr,
        nit_empr: parseInt(this.empresa.id_empr),
        fecha_rep: this.form.fechaInicial,
        carteras_rep: [...this.contenido],
      };

      await reporteCartera(data);
    },
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

    descargar_excel() {
      let data = [...this.contenido];

      // Agrupa datos por 'id_rep'
      let groupedData = {};
      data.forEach((item) => {
        // Elimina los ceros a la izquierda de 'id_rep' y manténlo como string
        let id_rep_sin_ceros = item.id_rep.replace(/^0+/, "");

        if (!groupedData[id_rep_sin_ceros]) {
          groupedData[id_rep_sin_ceros] = { id_rep: id_rep_sin_ceros };
        }
        groupedData[id_rep_sin_ceros][item.descrcargo_rep.trim()] = parseFloat(
          item.valor_rep.replace(/,/g, "")
        );

        // Procesa el valor de 'sdocontab_rep'
        let sdocontab_value = parseFloat(
          item.sdocontab_rep.replace(/,/g, "").replace(/\s+/g, "")
        );

        // Si el valor es negativo, lo reemplaza con 0
        if (sdocontab_value < 0) {
          sdocontab_value = 0;
        }

        // Suma el valor de 'sdocontab_rep' al total por id_rep
        groupedData[id_rep_sin_ceros].total_sdocontab =
          (groupedData[id_rep_sin_ceros].total_sdocontab || 0) +
          sdocontab_value;
      });

      console.log(groupedData);

      // Crea columnas dinámicas basadas en 'descrcargo_rep'
      let columnas = [
        {
          title: "Inmueble",
          value: "id_rep",
          format: "string",
        },
        {
          title: "Propietario",
          value: "descripcion_rep",
          format: "string",
        },
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

      // Agrega la columna de "TOTAL"
      columnas.push({
        title: "TOTAL",
        value: "total",
        format: "money",
        totalsRowFunction: "sum",
      });

      // Agrega la columna de "TOTAL Sdo. Contab"
      columnas.push({
        title: "TOTAL Sdo. Contab",
        value: "total_sdocontab",
        format: "money",
        totalsRowFunction: "sum",
      });

      // Crea el arreglo final de datos para la tabla
      let data_parse = Object.values(groupedData).map((item) => {
        let total = uniqueDescrcargo.reduce((sum, descr) => {
          return sum + (item[descr] || 0);
        }, 0);

        return { ...item, total };
      });

      // Ordena por 'id_rep' de menor a mayor
      data_parse.sort((a, b) => {
        return parseFloat(a.id_rep) - parseFloat(b.id_rep);
      });

      let header_format = [
        {
          text: this.empresa.descrip_empr,
          bold: true,
          size: 16,
        },
        {
          text: this.empresa.ideditado_empr,
          bold: true,
          size: 14,
        },
        {
          text: `CARTERA POR CONCEPTOS`,
          size: 14,
        },
        {
          text: `${this.form.fechaInicial}`,
          size: 12,
        },
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Cartera por Conceptos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `CARTERA_CONCEPTOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresión de Excel terminada");
          });
      });
    },
    cargarcontenido() {
      var data = this.form;

      if (!data.fechaInicial) {
        this.send_error("Selecciona una fecha de corte");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;
        var sesion = sessionStorage.Sesion;
        var fechaFinal = data.fechaInicial.replace(/\-/g, "");
        let calldll = "Phorizontal/dlls/RpCartera3J.DLL";

        var datosEnvio = sesion + "|" + fechaFinal + "|";
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
            let totales = { saldoCar: 0, saldoCont: 0 };

            data.forEach((el) => {
              totales.saldoCar +=
                parseFloat(el.valor_rep.replace(/,/g, "")) || 0;
            });

            this.totales = {
              saldoCartera: totales.saldoCar,
            };
          })
          .catch((err) => {
            console.log(err);
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte Cartera");
          });
      }
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
