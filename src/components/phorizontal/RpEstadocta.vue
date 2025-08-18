<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-qrcode-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Estado de Cuenta</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="3">
            <v-menu
              ref="menu"
              v-model="pickeFechaIni"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
              required
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fecha_ini"
                  label="Periodo Inicial"
                  outlined
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                type="month"
                v-model="fecha_ini"
                @input="pickeFechaIni = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex" cols="6">
            <v-autocomplete
              label="Propietario"
              v-model="form.clientes"
              :items="clientes"
              :item-text="format_clientes"
              hide-details
              return-object
              clearable
              outlined
              :error="errores.clientes"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex">
            <v-btn
              color="indigo"
              class="white--text px-12"
              depressed
              large
              @click="cargarcontenido"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex">
            <v-btn
              color="success"
              class="ml-2 white--text px-12"
              large
              depressed
              :disabled="contenido.length == 0"
              @click="print_reporte_excel"
            >
              Imprimir excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex">
            <v-btn
              color="red darken-1"
              class="ml-2 white--text px-12"
              large
              depressed
              :disabled="contenido.length == 0"
              @click="descargar_pdf"
            >
              Imprimir PDF
              <v-icon right dark>mdi-file-pdf-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              item-key="numero_fact"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>
              <template v-slot:item.idcliente_fact="{ item }">
                {{ parseInt(item.idcliente_fact) }}
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  @click="cargarfactura(item)"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
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

function processContent(content) {
  // const parseNumber = (str) => parseFloat(str.replace(/,/g, "").trim()) || 0;

  function parseNumber(valor) {
    if (!valor) return 0;

    // Elimina espacios
    valor = valor.trim();

    // Detecta si el signo negativo está al final y lo mueve al inicio
    if (valor.endsWith("-")) {
      valor = "-" + valor.slice(0, -1);
    }

    // Elimina comas de miles
    valor = valor.replace(/,/g, "");

    return parseFloat(valor);
  }

  const gruposPorMes = {};
  let saldoInicial = 0;

  // Saldo inicial
  const saldoInicialItem = content.find(
    (item) => item.descripcion_rep?.trim() === "SALDO INICIAL"
  );
  if (saldoInicialItem) {
    saldoInicial = parseNumber(saldoInicialItem.vlrbase_rep);
  }

  // Agrupar por periodo
  content.forEach((item) => {
    const desc = item.descripcion_rep?.trim();
    if (desc === "SALDO INICIAL") return;

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
        alquiler: 0,
        dctos: 0,
        pagos: 0,
        fecha: item.fecha_rep,
        saldo: 0,
      };
    }

    const grupo = gruposPorMes[periodo];
    const fields = [
      { src: item.vradmon_rep, target: "administracion" },
      { src: item.vlrextra_rep, target: "extraordinaria" },
      { src: item.vlrinter_rep, target: "intereses" },
      { src: item.vlrsancion_rep, target: "sanciones" },
      { src: item.vlrhonorarios_rep, target: "honorarios" },
      { src: item.vlralquiler_rep, target: "alquiler" },
      { src: item.vlrpagos_rep, target: "pagos" },
      { src: item.vlrdctos_rep, target: "dctos" },
      { src: item.vlrparqueo_rep, target: "parqueadero" },
    ];

    fields.forEach(({ src, target }) => {
      const value = parseNumber(src);
      if (value > 0) {
        grupo[target] += value;
        if (target === "pagos") grupo.fecha = item.fecha_rep;
      }
    });
  });

  // Calcular saldos acumulados
  let saldoAcumulado = saldoInicial;
  const periodosOrdenados = Object.keys(gruposPorMes).sort();

  periodosOrdenados.forEach((periodo) => {
    const grupo = gruposPorMes[periodo];
    const ingresos =
      grupo.administracion +
      grupo.extraordinaria +
      grupo.intereses +
      grupo.parqueadero +
      grupo.sanciones +
      grupo.honorarios +
      grupo.alquiler;
    grupo.dctos;

    saldoAcumulado = saldoAcumulado + ingresos - grupo.pagos - grupo.dctos;
    grupo.saldo = saldoAcumulado;

    // Formatear fecha
    const fechaStr = grupo.fecha;
    if (fechaStr?.length === 8) {
      const año = parseInt(fechaStr.slice(0, 4));
      const mes = parseInt(fechaStr.slice(4, 6)) - 1;
      const dia = parseInt(fechaStr.slice(6, 8));
      const dateObj = new Date(año, mes, dia);
      grupo.fecha = dateObj.toLocaleDateString("es-ES");
    }
  });

  return { gruposPorMes, saldoInicial, periodosOrdenados };
}

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      pickeFechaIni: false,
      dialogPickerfin: false,
      fecha_ini: this.$moment().format("YYYY-01"),

      singleExpand: true,
      expanded: [],
      contenido: [],
      datosEmpresa: [],
      clientes: [],
      ruts3: [],
      search: "",
      form: {},

      headers: [
        { text: "Periodo", align: "left", value: "periodo_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Valor", align: "center", value: "vlrbase_rep" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.get_Clientes();
  },
  methods: {
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },

    async print_reporte_excel() {
      const { gruposPorMes, saldoInicial, periodosOrdenados } = processContent(
        this.contenido
      );

      // Formatear datos para Excel
      const data_parse = [
        {
          mes: "SALDO INICIAL",
          administracion: 0,
          extraordinaria: 0,
          intereses: 0,
          parqueadero: 0,
          sanciones: 0,
          honorarios: 0,
          alquiler: 0,
          dctos: 0,
          fecha: "",
          pagos: 0,
          saldo: saldoInicial,
        },
        ...periodosOrdenados.map((periodo) => ({
          mes: gruposPorMes[periodo].mes,
          administracion: gruposPorMes[periodo].administracion,
          extraordinaria: gruposPorMes[periodo].extraordinaria,
          intereses: gruposPorMes[periodo].intereses,
          parqueadero: gruposPorMes[periodo].parqueadero,
          sanciones: gruposPorMes[periodo].sanciones,
          honorarios: gruposPorMes[periodo].honorarios,
          alquiler: gruposPorMes[periodo].alquiler,
          dctos: gruposPorMes[periodo].dctos,
          fecha: gruposPorMes[periodo].fecha,
          pagos: gruposPorMes[periodo].pagos,
          saldo: gruposPorMes[periodo].saldo,
        })),
      ];

      // Configurar columnas y encabezados
      const columnas = [
        { title: "MES", value: "mes", format: "string" },
        { title: "ADMINISTRACION", value: "administracion", format: "money" },
        { title: "EXTRAORDINARIA", value: "extraordinaria", format: "money" },
        { title: "INTERESES", value: "intereses", format: "money" },
        { title: "PARQUEADERO", value: "parqueadero", format: "money" },
        { title: "SANCIONES", value: "sanciones", format: "money" },
        { title: "HONORARIOS", value: "honorarios", format: "money" },
        { title: "ALQUILER", value: "alquiler", format: "money" },
        { title: "DESCUENTOS", value: "dctos", format: "money" },
        { title: "FECHA", value: "fecha", format: "string" },
        { title: "PAGOS", value: "pagos", format: "money" },
        { title: "SALDO", value: "saldo", format: "money" },
      ];

      const logoKey = parseFloat(sessionStorage.Sesion.substr(0, 15));
      const logo_src = require(`../../assets/image/clientes/${logoKey}.png`);

      try {
        const logo = await this.pdfs.getBase64(logo_src);
        await this.excel._informe({
          sheetName: "Estado de Cuenta",
          header: [
            { text: "ESTADO DE CUENTA", bold: true, size: 16 },
            `Fecha inicial: ${this.fecha_ini}`,
            `Rut procesado: ${this.form?.clientes?.descripcion_rut || ""}`,
          ],
          logo,
          tabla: { columnas, data: data_parse },
          archivo: `ESTADO DE CUENTA-${Date.now()}`,
        });
        console.log("✅ Impresión terminada");
      } catch (err) {
        console.error("❌ Error al imprimir:", err);
      }
    },
    async descargar_pdf() {
      const { gruposPorMes, saldoInicial, periodosOrdenados } = processContent(
        this.contenido
      );

      // Formatear datos para PDF
      const data_format = [
        [
          { text: "MES", style: "header_table" },
          { text: "ADMINISTRACION", style: "header_table" },
          { text: "EXTRAORDINARIA", style: "header_table" },
          { text: "INTERESES", style: "header_table" },
          { text: "PARQUEADERO", style: "header_table" },
          { text: "SANCIONES", style: "header_table" },
          { text: "HONORARIOS", style: "header_table" },
          { text: "ALQUILER", style: "header_table" },
          { text: "DESCUENTOS", style: "header_table" },
          { text: "FECHA", style: "header_table" },
          { text: "PAGOS", style: "header_table" },
          { text: "SALDO", style: "header_table" },
        ],
        // Fila de saldo inicial
        [
          "SALDO INICIAL",
          this.formatNumero(0),
          this.formatNumero(0),
          this.formatNumero(0),
          this.formatNumero(0),
          this.formatNumero(0),
          this.formatNumero(0),
          this.formatNumero(0),
          this.formatNumero(0),
          "",
          this.formatNumero(0),
          { text: this.formatNumero(saldoInicial), alignment: "right" },
        ],
        // Filas de meses
        ...periodosOrdenados.map((periodo) => {
          const g = gruposPorMes[periodo];
          return [
            g.mes,
            this.formatNumero(g.administracion),
            this.formatNumero(g.extraordinaria),
            this.formatNumero(g.intereses),
            this.formatNumero(g.parqueadero),
            this.formatNumero(g.sanciones),
            this.formatNumero(g.honorarios),
            this.formatNumero(g.alquiler),
            this.formatNumero(g.dctos),
            g.fecha,
            this.formatNumero(g.pagos),
            { text: this.formatNumero(g.saldo), alignment: "right" },
          ];
        }),
      ];

      const logoKey = parseFloat(sessionStorage.Sesion.substr(0, 15));
      const logo_src = require(`../../assets/image/clientes/${logoKey}.png`);

      try {
        const logo = await this.pdfs.getBase64(logo_src);
        this.pdfs._informe({
          data: data_format,
          titulo: "ESTADO DE CUENTA",
          logo,
          fontSize: 7,
          header_pdf: [
            {
              text: [
                { text: "Fecha inicial: ", bold: true },
                this.fecha_ini.replace(/\-/g, "/"),
              ],
            },
            {
              text: [
                { text: "Rut procesado: ", bold: true },
                this.form?.clientes?.descripcion_rut || "",
              ],
            },
          ],
          margin: [35, 35],
          orientation: "landscape",
          fitSizeLogo: [100, 100],
        });
        console.log("✅ PDF generado exitosamente");
      } catch (err) {
        console.error("❌ Error al generar el PDF:", err);
      }
    },

    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    cargarcontenido() {
      this.contenido = [];

      var fechaini = this.fecha_ini.split("-").join("");
      let cliente = this.form.clientes.identificacion_rut;

      this.loader = true;

      post
        .postData({
          url: "Phorizontal/dlls/RpEstadoctaJ.dll",
          data: sessionStorage.Sesion + "|" + fechaini + "|" + cliente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "No se encontraron facturas",
            estado: true,
          });
        });
    },
  },
};
</script>
