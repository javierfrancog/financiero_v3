<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loader.card"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-numeric</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Presupuesto Ejecutado
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodoini"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_ini"
                      label="Periodo Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_ini"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodoini = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodofin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_fin"
                      label="Periodo Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_fin"
                    type="month"
                    no-title
                    scrollable
                    @input="
                      pickerPeriodofin = false;
                      periodo_fin = periodo_fin;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6">
                <v-btn
                  color="indigo"
                  class="white--text px-6"
                  @click="get_reporte(0)"
                  large
                  depressed
                >
                  Consultar
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="this.contenido.length != 0" class="mb-4" cols="6">
                <v-btn
                  color="green darken-1"
                  class="ml-3 white--text px-6"
                  @click="imprimir_excel"
                  large
                  depressed
                >
                  Generar EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
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
            <h4
              v-if="mensaje != 0"
              style="color: red"
              class="font-weight-bold text-h6 subtitles"
            >
              Balance con Descuadre! (Puedes validar por Reportes-Comprobantes)
            </h4>
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

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <canvas
      ref="graficoCanvas"
      width="800"
      height="300"
      style="display: none"
    ></canvas>
  </v-layout>
</template>



<script>
import { FlowerSpinner } from "epic-spinners";

import ExcelJS from "exceljs";
import post from "../../methods.js";
export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      periodo_ini: this.$moment().format("YYYY-01"),
      periodo_fin: this.$moment().format("YYYY-12"),
      styleObject: { border: "2px solid #01579B" },
      condition: false,
      search: null,
      mensaje: 0,
      pickerPeriodoini: false,
      pickerPeriodofin: false,
      pickerCargue: false,
      pickerActual: false,
      loader: false,
      datosctas: [],
      contenido: [],
      json_1: [],
      json_2: [],
      json_3: [],
      json_4: [],
      json_grafico: [],
      errores: {
        nivel: false,
        selcta: false,
      },

      form: {
        nivel: "",
      },

      headers: [
        {
          text: "Codigo",
          align: "left",
          value: "codigo_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripcion_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Enero",
          align: "right",
          value: "ene_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Febrero",
          align: "right",
          value: "feb_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Marzo",
          align: "right",
          value: "mar_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Abril",
          align: "right",
          value: "abr_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Mayo",
          align: "right",
          value: "may_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Junio",
          align: "right",
          value: "jun_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Julio",
          align: "right",
          value: "jul_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Agosto",
          align: "right",
          value: "agt_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Septiembre",
          align: "right",
          value: "sep_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Octubre",
          align: "right",
          value: "oct_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Noviembre",
          align: "right",
          value: "nov_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Diciembre",
          align: "right",
          value: "dic_rep",
          class: "white--text white blue darken-3",
        },

        {
          text: "Total",
          align: "right",
          value: "SALDO",
          class: "white--text white blue darken-3",
        },
      ],

      datosEmpresa: null,
    };
  },
  created() {
    this.get_empresa();
  },

  methods: {
    get_reporte(tipo) {
      this.mensaje = 0;
      let perini = this.periodo_ini.split("-").join("");
      let perfin = this.periodo_fin.split("-").join("");
      let anoini = perini.substr(0, 4);
      let anofin = perfin.substr(0, 4);
      if (perfin < perini || anoini < 2000 || anofin < 2000) {
        this.send_error("Error en Periodos");
      } else {
        this.contenido = [];
        this.procesar_orden();
      }
    },

    async procesar_orden(consecutivo, profesional) {
      await this.imprimir_balance();
    },

    async imprimir_balance() {
      this.loader = true;
      let perini = this.periodo_ini.split("-").join("");
      let perfin = this.periodo_fin.split("-").join("");
      let cuentaContable = "0";
      let nivel = 4;

      return new Promise((res) => {
        post
          .postData({
            url: "Phorizontal/dlls/RpPresupJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              perini +
              "|" +
              perfin +
              "|" +
              nivel +
              "|",
            method: "",
          })
          .then(async (data) => {
            data.pop();
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
            this.json_grafico = this.contenido;
          })
          .catch((err) => {
            res(null);
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      });
    },
    async generarGraficoBase64() {
      return new Promise((resolve) => {
        const ctx = document.getElementById("graficoExcel").getContext("2d");

        const ingresos = this.contenido.find(
          (el) => el.codigo_rep.trim() === "1"
        );
        const gastos = this.contenido.find(
          (el) => el.codigo_rep.trim() === "2"
        );

        const meses = [
          "ene",
          "feb",
          "mar",
          "abr",
          "may",
          "jun",
          "jul",
          "agt",
          "sep",
          "oct",
          "nov",
          "dic",
        ];

        const valoresIngreso = meses.map((m) =>
          this._safeNumber(ingresos?.[`${m}_rep`])
        );
        const valoresGasto = meses.map((m) =>
          this._safeNumber(gastos?.[`${m}_rep`])
        );

        // Limpia canvas anterior
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: meses.map((m) => m.toUpperCase()),
            datasets: [
              {
                label: "Ingresos",
                data: valoresIngreso,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
              {
                label: "Gastos",
                data: valoresGasto,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            legend: {
              display: true,
              position: "top",
            },
            scales: {
              yAxes: [{ ticks: { beginAtZero: true } }],
            },
          },
        });

        setTimeout(() => {
          const base64 = ctx.canvas.toDataURL("image/png");
          resolve(base64);
        }, 1000); // Espera breve para asegurar que se renderice el gráfico
      });
    },
    extraerEjecucionPorCodigo(codigo) {
      const meses = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "agt",
        "jul",
        "sep",
        "oct",
        "nov",
        "dic",
      ];
      const item = this.contenido.find((el) => el.codigo_rep.trim() === codigo);
      return item
        ? meses.map((mes) => this._safeNumber(item[`${mes}_rep`]))
        : new Array(12).fill(0);
    },
    async imprimir_excel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ejecución Presupuestal");

      // Logo
      const logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      const logoBase64 = await this.pdfs.getBase64(logo_src);
      const imageId = workbook.addImage({
        base64: logoBase64,
        extension: "png",
      });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 200, height: 80 },
      });

      // Gráfico
      const canvas = this.$refs.graficoCanvas;
      const ctx = canvas.getContext("2d");
      const meses = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "agt",
        "sep",
        "oct",
        "nov",
        "dic",
      ];
      const valoresPorCodigo = { 1: [], 2: [] };

      meses.forEach((mes) => {
        let val1 = 0,
          val2 = 0;
        this.contenido.forEach((el) => {
          const codigo = el.codigo_rep.trim();
          if (codigo === "1") val1 += this._safeNumber(el[`${mes}_rep`]);
          else if (codigo === "2") val2 += this._safeNumber(el[`${mes}_rep`]);
        });
        valoresPorCodigo["1"].push(val1);
        valoresPorCodigo["2"].push(val2);
      });

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: meses.map((m) => m.toUpperCase()),
          datasets: [
            {
              label: "Ingresos",
              data: valoresPorCodigo["1"],
              backgroundColor: "#4caf50",
            },
            {
              label: "Gastos",
              data: valoresPorCodigo["2"],
              backgroundColor: "#2196f3",
            },
          ],
        },
        options: {
          responsive: false,
          legend: { position: "top" },
          title: { display: true, text: "Ejecución Mensual" },
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      const graficoBase64 = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, "");
      const graficoId = workbook.addImage({
        base64: graficoBase64,
        extension: "png",
      });
      worksheet.addImage(graficoId, {
        tl: { col: 4, row: 1 },
        ext: { width: 800, height: 300 },
      });

      // Título
      const fechaInicio = this.periodo_ini || "...";
      const fechaFin = this.periodo_fin || "...";
      const titulo = `EJECUCIÓN PRESUPUESTAL - Periodo desde ${fechaInicio} hasta ${fechaFin}`;
      const totalCols = 2 + 12 * 3 + 1;
      const lastColLetter = worksheet.getColumn(totalCols).letter;
      worksheet.mergeCells(`A6:${lastColLetter}6`);
      const cell = worksheet.getCell("A6");
      cell.value = titulo;
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.font = { size: 16, bold: true, color: { argb: "000000" } };

      // Encabezado de meses
      const mesesTitulo = ["", ""];
      meses.forEach((mes) => mesesTitulo.push(mes.toUpperCase(), "", ""));
      mesesTitulo.push("Total");
      worksheet.insertRow(18, mesesTitulo);
      let col = 3;
      for (let i = 0; i < 12; i++) {
        worksheet.mergeCells(18, col, 18, col + 2);
        col += 3;
      }
      worksheet.mergeCells("A18:A18");
      worksheet.mergeCells("B18:B18");

      // Datos
      const data = this.contenido.map((el) => {
        const fila = [el.codigo_rep, el.descripcion_rep];
        let total = 0;
        meses.forEach((mes) => {
          const presupuesto = this._safeNumber(el[`pres${mes}_rep`]);
          const ejecucion = this._safeNumber(el[`${mes}_rep`]);
          const porcentaje = this._safeNumber(el[`eje${mes}_rep`]);
          fila.push(presupuesto, ejecucion, porcentaje);
          total += ejecucion;
        });
        fila.push(total);
        return fila;
      });

      const headers = [
        { name: "Código", filterButton: true },
        { name: "Descripción", filterButton: true },
      ];
      meses.forEach((mes) => {
        headers.push(
          { name: `Presupuesto ${mes}`, filterButton: true },
          { name: `Ejecución ${mes}`, filterButton: true },
          { name: `% ${mes}`, filterButton: false }
        );
      });
      headers.push({ name: "Total", filterButton: false });

      worksheet.addTable({
        name: "TablaEjecucion",
        ref: "A19",
        headerRow: true,
        totalsRow: false,
        style: { theme: "TableStyleMedium2", showRowStripes: true },
        columns: headers.map((col) => ({
          name: col.name,
          filterButton: col.filterButton,
        })),
        rows: data,
      });

      worksheet.columns.forEach((col, idx) => {
        const text = worksheet.getRow(9).getCell(idx + 1).value || "";
        col.width = Math.max(text.toString().length + 2, 12);
      });

      worksheet.getColumn(2).width =
        Math.max(
          ...this.contenido.map((el) => el.descripcion_rep?.length || 10)
        ) + 5;

      // Formato
      const totalColumnCount = worksheet.getRow(9).actualCellCount;
      for (let i = 3; i <= totalColumnCount; i++) {
        worksheet
          .getColumn(i)
          .eachCell({ includeEmpty: false }, (cell, rowNumber) => {
            const isHeader = rowNumber <= 9;
            const isPorcentaje = (i - 3) % 3 === 2;
            if (!isHeader && typeof cell.value === "number") {
              cell.numFmt = isPorcentaje ? "0%" : "#,##0";
            }
          });
      }

      // Totales
      const filaTotales = 19 + data.length;
      const totalRow = ["", ""];

      worksheet.insertRow(filaTotales, totalRow);

      worksheet
        .getRow(filaTotales)
        .eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "DDEBF7" },
          };
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          const isTexto = colNumber === 1 || colNumber === 2;
          const isPorcentaje = (colNumber - 3) % 3 === 2;
          if (!isTexto && typeof cell.value === "number") {
            cell.numFmt = isPorcentaje ? "0%" : "#,##0";
          }
        });

      worksheet.spliceRows(filaTotales + 1, 1);

      // Fondo blanco global excepto tabla
      // Forzar fondo blanco a un rango amplio de celdas
      for (let row = 1; row <= 18; row++) {
        for (let col = 1; col <= 50; col++) {
          const cell = worksheet.getCell(row, col);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF" },
          };
        }
      }

      // Exportar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `EJECUCION_PRESUPUESTAL_${new Date().getTime()}.xlsx`);
    },

    _safeNumber(value) {
      if (typeof value === "string") {
        const cleaned = value.replace(/\s+/g, "").replace(/,/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof value === "number" ? value : 0;
    },

    // imprimir_excel() {
    //   let data = this.contenido;
    //   let data_parse = [];
    //   let perini = this.periodo_ini;
    //   let perfin = this.periodo_fin;

    //   const safeNumber = (value) => {
    //     if (typeof value === "string") {
    //       const cleanedValue = value.replace(/\s+/g, "").replace(/,/g, "");
    //       const parsedValue = parseFloat(cleanedValue);
    //       return isNaN(parsedValue) ? 0 : parsedValue;
    //     }
    //     return typeof value === "number" ? value : 0;
    //   };

    //   data.forEach((el) => {
    //     let copia = JSON.parse(JSON.stringify(el));
    //     let total_rep = 0;
    //     copia.ene_rep = safeNumber(el.ene_rep);
    //     copia.feb_rep = safeNumber(el.feb_rep);
    //     copia.mar_rep = safeNumber(el.mar_rep);
    //     copia.abr_rep = safeNumber(el.abr_rep);
    //     copia.may_rep = safeNumber(el.may_rep);
    //     copia.jun_rep = safeNumber(el.jun_rep);
    //     copia.jul_rep = safeNumber(el.jul_rep);
    //     copia.agt_rep = safeNumber(el.agt_rep);
    //     copia.sep_rep = safeNumber(el.sep_rep);
    //     copia.oct_rep = safeNumber(el.oct_rep);
    //     copia.nov_rep = safeNumber(el.nov_rep);
    //     copia.dic_rep = safeNumber(el.dic_rep);
    //     copia.presene_rep = safeNumber(el.presene_rep);
    //     copia.presfeb_rep = safeNumber(el.presfeb_rep);
    //     copia.presmar_rep = safeNumber(el.presmar_rep);
    //     copia.presabr_rep = safeNumber(el.presabr_rep);
    //     copia.presmay_rep = safeNumber(el.presmay_rep);
    //     copia.presjun_rep = safeNumber(el.presjun_rep);
    //     copia.presjul_rep = safeNumber(el.presjul_rep);
    //     copia.presagt_rep = safeNumber(el.presagt_rep);
    //     copia.pressep_rep = safeNumber(el.pressep_rep);
    //     copia.presoct_rep = safeNumber(el.presoct_rep);
    //     copia.presnov_rep = safeNumber(el.presnov_rep);
    //     copia.presdic_rep = safeNumber(el.presdic_rep);

    //     copia.total_rep =
    //       copia.ene_rep +
    //       copia.feb_rep +
    //       copia.mar_rep +
    //       copia.abr_rep +
    //       copia.may_rep +
    //       copia.jun_rep +
    //       copia.jul_rep +
    //       copia.agt_rep +
    //       copia.sep_rep +
    //       copia.oct_rep +
    //       copia.nov_rep +
    //       copia.dic_rep;
    //     data_parse.push(copia);
    //   });

    //   let columnas = [
    //     {
    //       title: "Codigo",
    //       value: "codigo_rep",
    //       format: "string",
    //     },
    //     {
    //       title: "Descripción",
    //       value: "descripcion_rep",
    //       format: "string",
    //     },
    //     {
    //       title: "Presupuesto Enero",
    //       value: "presene_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Enero",
    //       value: "ene_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "% Ejecución",
    //       value: "ejeene_rep",
    //       format: "string",
    //     },

    //     {
    //       title: "Febrero",
    //       value: "feb_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Marzo",
    //       value: "mar_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Abril",
    //       value: "abr_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Mayo",
    //       value: "may_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Junio",
    //       value: "jun_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Julio",
    //       value: "jul_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Agosto",
    //       value: "agt_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Septiembre",
    //       value: "sep_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Octubre",
    //       value: "oct_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Noviembre",
    //       value: "nov_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Diciembre",
    //       value: "dic_rep",
    //       format: "money",
    //     },
    //     {
    //       title: "Total",
    //       value: "total_rep",
    //       format: "money",
    //     },
    //   ];

    //   let header_format = [
    //     {
    //       text: "EJECUCION PRESUPUESTAL",
    //       bold: true,
    //       size: 16,
    //     },
    //     `Periodo Inicial:${perini}`,
    //     `Periodo Final:${perfin}`,
    //     "",
    //   ];

    //   let logo_src = require(`../../assets/image/clientes/${parseFloat(
    //     sessionStorage.Sesion.substr(0, 15)
    //   )}.png`);
    //   this.pdfs.getBase64(logo_src).then((logo) => {
    //     this.excel
    //       ._informe({
    //         sheetName: "Ejecución Presupuestal",
    //         header: header_format,
    //         logo,
    //         tabla: {
    //           columnas,
    //           totalsRow: false,
    //           data: data_parse,
    //           // heightRow: 35,
    //           theme: "TableStyleMedium2",
    //         },
    //         archivo: `EJECUCION PRESUPUESTAL-${new Date().getTime()}`,
    //       })
    //       .then((data) => {
    //         console.log("Impresion terminada");
    //       });
    //   });
    // },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_mes(id) {
      var meses = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        10: "Octubre",
        11: "Noviembre",
        12: "Diciembre",
      };

      return meses[id];
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

