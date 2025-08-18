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
                >mdi-briefcase-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >CategorizaciÃ³n de Cartera</v-list-item-title
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
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    type="month"
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
                <v-btn
                  @click="contabiliza()"
                  color="orange darken-2"
                  class="white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length > 0 ? false : true"
                >
                  <v-icon right dark>mdi-pdf-box</v-icon> Contabilizar
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep"
                  >{{ item.codcta_rep }} - {{ item.descripcta_rep }}</label
                >
              </template>
              <template v-slot:item.dias_rep="{ item }">
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
              </template>
              <template v-slot:item.total_rep="{ item }">
                <b v-if="item.separador">{{ item.total_rep }}</b>
                <label v-else>{{ item.total_rep }}</label>
              </template>

              <template v-slot:item.docinter_rep="{ item }">
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
              </template>
              <template v-slot:expanded-item="{ headers, item }">
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
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
              <template v-slot:body.append>
                <td colspan="6" class="text-right">
                  <strong>TOTALES</strong>
                </td>
                <td></td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.xvencer) }}
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.vencido) }}
                </td>
                <td class="text-xs-right text-center">
                  {{ formatNumero(totales.total) }}
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

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      errores: {
        punto_fact: false,
      },
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
        fechaInicial: this.$moment().format("YYYY-MM"),
        ruts: null,
        asesor: null,
      },
      headers: [
        {
          text: "DescripciÃ³n",
          align: "left",
          value: "descripcion_rep",
        },
        {
          text: "Nro Credito",
          align: "center",
          value: "factura_rep",
        },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Categoria Inicial", align: "center", value: "catini_rep" },
        { text: "Categoria Actual", align: "center", value: "catact_rep" },
        {
          text: "Fecha Vencimiento",
          align: "center",
          value: "vence_rep",
        },
        { text: "Dias", align: "center", value: "dias_rep" },
        {
          text: "Valor Inicial",
          align: "center",
          value: "valorini2_rep",
          width: "20%",
        },
        {
          text: "Saldo Capital",
          align: "center",
          value: "sdocap2_rep",
          width: "20%",
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
        xvencer: 0,
        vencido: 0,
        total: 0,
      },
      disabledSelect: false,
    };
  },
  async created() {
    await this.cargar_empresa();
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

    async descargar_pdf() {
      const parseNumber = (str) =>
        parseFloat(str.replace(/,/g, "").trim()) || 0;

      // Obtener el saldo inicial (si existe)
      let saldoInicial = 0;
      const saldoInicialItem = this.contenido.find(
        (item) => item.descripcion_rep.trim() === "SALDO INICIAL"
      );
      if (saldoInicialItem) {
        saldoInicial = parseNumber(saldoInicialItem.vlrbase_rep);
      }

      // Agrupar el resto de los Ã­tems por periodo (periodo_rep)
      const gruposPorMes = {};

      this.contenido.forEach((item) => {
        const desc = item.descripcion_rep.trim();
        if (desc === "SALDO INICIAL") {
          return;
        }

        const periodo = item.periodo_rep;
        if (!gruposPorMes[periodo]) {
          const year = periodo.slice(0, 4);
          const month = periodo.slice(4, 6);
          const dateMes = new Date(year, Number(month) - 1);
          const mesFormateado = dateMes
            .toLocaleString("es-ES", { month: "long", year: "numeric" })
            .toUpperCase();

          gruposPorMes[periodo] = {
            mes: mesFormateado,
            administracion: 0,
            extraordinaria: 0,
            intereses: 0,
            parqueadero: 0,
            sanciones: 0,
            honorarios: 0,
            pagos: 0,
            fecha: item.fecha_rep,
            saldo: 0,
          };
        }

        const grupo = gruposPorMes[periodo];

        const vAdmin = parseNumber(item.vradmon_rep);
        if (vAdmin > 0) {
          grupo.administracion += vAdmin;
        }

        const vExtra = parseNumber(item.vlrextra_rep);
        if (vExtra > 0) {
          grupo.extraordinaria += vExtra;
        }

        const vInter = parseNumber(item.vlrinter_rep);
        if (vInter > 0) {
          grupo.intereses += vInter;
        }

        const vSancion = parseNumber(item.vlrsancion_rep);
        if (vSancion > 0) {
          grupo.sanciones += vSancion;
        }

        const vHonorarios = parseNumber(item.vlrhonorarios_rep);
        if (vHonorarios > 0) {
          grupo.honorarios += vHonorarios;
        }

        const vOtros = parseNumber(item.vlrotros_rep);
        if (vOtros > 0) {
          grupo.parqueadero += vOtros;
        }

        const vPagos = parseNumber(item.vlrpagos_rep);
        if (vPagos > 0) {
          grupo.pagos += vPagos;
          grupo.fecha = item.fecha_rep;
        }
      });

      const periodosOrdenados = Object.keys(gruposPorMes).sort();

      let saldoAcumulado = saldoInicial;
      periodosOrdenados.forEach((periodo) => {
        const grupo = gruposPorMes[periodo];

        const ingresos =
          grupo.administracion +
          grupo.intereses +
          grupo.parqueadero +
          grupo.extraordinaria +
          grupo.sanciones +
          grupo.honorarios;

        const egresos = grupo.pagos;

        saldoAcumulado = saldoAcumulado + ingresos - egresos;
        grupo.saldo = saldoAcumulado;

        const fechaStr = grupo.fecha;
        if (fechaStr && fechaStr.length === 8) {
          const año = parseInt(fechaStr.slice(0, 4), 10);
          const mes = parseInt(fechaStr.slice(4, 6), 10) - 1;
          const dia = parseInt(fechaStr.slice(6, 8), 10);
          const dateObj = new Date(año, mes, dia);
          grupo.fecha = dateObj.toLocaleDateString("es-ES");
        }
      });

      const data_parse = [
        {
          mes: "SALDO INICIAL",
          administracion: 0,
          extraordinaria: 0,
          intereses: 0,
          parqueadero: 0,
          sanciones: 0,
          honorarios: 0,
          fecha: "",
          pagos: 0,
          descuento: 0,
          saldo: saldoInicial,
        },
        ...periodosOrdenados.map((periodo) => {
          const g = gruposPorMes[periodo];
          return {
            mes: g.mes,
            administracion: g.administracion,
            extraordinaria: g.extraordinaria,
            intereses: g.intereses,
            parqueadero: g.parqueadero,
            sanciones: g.sanciones,
            honorarios: g.honorarios,
            fecha: g.fecha,
            pagos: g.pagos,
            descuento: 0,
            saldo: g.saldo,
          };
        }),
      ];

      const tablaPdf = {
        headerRows: 1,
        body: [
          [
            { text: "MES", style: "header" },
            { text: "ADMINISTRACION", style: "header" },
            { text: "EXTRAORDINARIA", style: "header" },
            { text: "INTERESES", style: "header" },
            { text: "PARQUEADEROS", style: "header" },
            { text: "SANCIONES", style: "header" },
            { text: "HONORARIOS", style: "header" },
            { text: "FECHA", style: "header" },
            { text: "PAGOS", style: "header" },
            { text: "SALDO", style: "header" },
          ],
        ],
      };

      data_parse.forEach((fila) => {
        const row = [
          { text: fila.mes },
          { text: this.formatNumero(fila.administracion) },
          { text: this.formatNumero(fila.extraordinaria) },
          { text: this.formatNumero(fila.intereses) },
          { text: this.formatNumero(fila.parqueadero) },
          { text: this.formatNumero(fila.sanciones) },
          { text: this.formatNumero(fila.honorarios) },
          { text: fila.fecha },
          { text: this.formatNumero(fila.pagos) },
          { text: this.formatNumero(fila.saldo) },
        ];
        tablaPdf.body.push(row);
      });

      const logoKey = parseFloat(sessionStorage.Sesion.substr(0, 15));
      const logo_src = require(`../../assets/image/clientes/${logoKey}.png`);

      try {
        const logoBase64 = await this.pdfs.getBase64(logo_src);
        await this.pdfs._informe({
          titulo: "Estado de Cuenta",
          header: [
            { text: "ESTADO DE CUENTA", bold: true, fontSize: 16 },
            `Fecha inicial: ${this.fecha_ini}`,
            `Rut procesado: ${this.form?.clientes?.descripcion_rut || ""}`,
          ],
          logo: logoBase64,
          content: [
            { image: logoBase64, width: 150, margin: [0, 0, 0, 20] },
            tablaPdf,
          ],
          archivo: `ESTADO-DE-CUENTA-${Date.now()}.pdf`,
        });

        console.log("âœ… PDF generado correctamente");
      } catch (err) {
        console.error("âŒ Error al generar PDF:", err);
      }
    },

    descargar_excel() {
      let data = this.contenido;
      let data_parse = [];
      let fecha_corte = this.form.fechaInicial.replace(/\-/g, "/");
      let granTotalxVencer = this.totales.xvencer;
      let granTotalVencido = this.totales.vencido;
      let granTotal = this.totales.total;

      data.forEach((el, i) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.dias_rep = el.dias_rep.replace(/ /g, "");
        copia.factura_rep = parseFloat(el.factura_rep.replace(/\,/g, "")) || 0;
        copia.valorini_rep = parseFloat(el.valorini_rep) || 0;
        copia.sdocap_rep = parseFloat(el.sdocap_rep) || 0;
        copia.deterioro_rep = parseFloat(el.deterioro_rep) || 0;
        copia.dias_rep = parseFloat(el.dias_rep) || 0;
        copia.intermes_rep = parseFloat(el.intermes_rep) || 0;

        data_parse.push(copia);
        if (el.vence_rep === "Total Deudor:") {
          data_parse.push({
            factura_rep: "",
            descripcion_rep: "",
            id_rep: "",
            modalidad_rep: "",
            fecha_rep: "",
            vence_rep: "",
            valorini_rep: "",
            sdocap_rep: "",
            dias_rep: "",
            catini_rep: "",
            catant_rep: "",
            fcatanter_rep: "",
            catact_rep: "",
            fcatact_rep: "",
            xvencer_rep: "",
            vencido_rep: "",
          });
        }
      });

      data_parse.push({
        descripcion_rep: "",
        pref_rep: "",
        factura_rep: "",
        fecha_rep: "",
        vence_rep: "Totales: ",
        dias_rep: "",
        xvencer_rep: granTotalxVencer,
        vencido_rep: granTotalVencido,
      });

      let columnas = [
        {
          title: "Nro. CrÃ©dito",
          value: "factura_rep",
          format: "string",
        },

        {
          title: "Deudor",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Id_Deudor",
          value: "id_rep",
          format: "string",
        },
        {
          title: "Modalidad",
          value: "modalidad_rep",
          format: "string",
        },
        {
          title: "Fecha EmisiÃ³n",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Fecha Vence",
          value: "vence_rep",
          format: "string",
        },

        {
          title: "Valor Inicial",
          value: "valorini_rep",
          format: "money",
        },
        {
          title: "Saldo Capital",
          value: "sdocap_rep",
          format: "money",
        },
        {
          title: "DÃ­as",
          value: "dias_rep",
          format: "number",
        },
        {
          title: "Categoria Inicial",
          value: "catini_rep",
          format: "string",
        },
        {
          title: "Categoria Anterior",
          value: "catant_rep",
          format: "string",
        },
        {
          title: "Fecha Categoria Anterior",
          value: "fcatanter_rep",
          format: "string",
        },
        {
          title: "Categoria Sin Arrastre",
          value: "catact_rep",
          format: "string",
        },
        {
          title: "Categoria Con Arrastre",
          value: "catact_rep",
          format: "string",
        },

        {
          title: "Fecha Categoria Actual",
          value: "fcatact_rep",
          format: "string",
        },
        {
          title: "Categoria A",
          value: "cat_a_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Categoria B",
          value: "cat_b_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Categoria C",
          value: "cat_c_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Categoria D",
          value: "cat_d_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Categoria E",
          value: "cat_e_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Categoria E1",
          value: "cat_e1_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Deterioro x Categoria",
          value: "detcateg_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Deterioro General",
          value: "detgral_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Intereses a Causar",
          value: "intermes_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Seguros a Causar",
          value: "segmes_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Intereses Ctas Orden",
          value: "intorden_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];

      let header_format = [
        { text: "REPORTE CATEGORIZACION DE CARTERA", bold: true, size: 16 },
        { text: `Fecha corte: ${fecha_corte}`, bold: true, size: 14 },
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte categorizaciÃ³n de cartera",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE CATEGORIZACION DE CARTERA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    cargarcontenido() {
      var data = this.form;
      this.contenido = [];
      this.btnEnvio.loader = true;
      this.btnEnvio.disabled = true;
      var sesion = sessionStorage.Sesion;
      var fechaFinal = data.fechaInicial.replace(/\-/g, "");
      let calldll = "Asociados/dlls/PrCategorizaJ.DLL";

      var datosEnvio = sesion + "|" + fechaFinal + "|";
      post
        .postData({
          url: calldll,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = data;
          this.loader = false;
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
        })
        .catch((err) => {
          console.log(err);
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
          this.send_error("Error al cargar el reporte Cartera");
        });
    },
    contabiliza() {
      var data = this.form;
      this.btnEnvio.loader = true;
      this.btnEnvio.disabled = true;
      var sesion = sessionStorage.Sesion;
      var fechaFinal = data.fechaInicial.replace(/\-/g, "");
      let calldll = "Asociados/dlls/PrCategoriza.DLL";

      var datosEnvio = sesion + "|" + fechaFinal + "|";
      post
        .postData({
          url: calldll,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: "Proceso Realizado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.btnEnvio.loader = false;
          this.btnEnvio.disabled = false;
          this.send_error("Error al categorizar Cartera");
        });
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
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

