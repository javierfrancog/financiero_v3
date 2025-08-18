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
                >mdi-view-headline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Inconsistencias Emsa</v-list-item-title
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
            </v-row>
            <v-row> </v-row>
            <v-row class="d-flex justify-end">
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
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
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
              <template v-slot:item.estado_rep="{ item }">
                {{ format_estado(item.estado_rep) }}
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
        { text: "Hora", align: "center", value: "hora_rep" },
        { text: "Inconsistencia", align: "center", value: "inconsis_rep" },
        { text: "Punto Recaudo", align: "left", value: "agencia_rep" },
        { text: "Entidad", align: "left", value: "entidad_rep" },
        { text: "Factura", align: "left", value: "factura_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Cajero", align: "left", value: "cajero_rep" },
        { text: "F_Ingreso", align: "center", value: "ingreso_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        convenio: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.consultar_convenios();
    this.cargaragencias();
  },
  methods: {
    consultar_convenios() {
      this.loader = true;
      let data = [sessionStorage.Sesion];
      this.postData({
        url: "Recaudos/dlls/CfConveniorcJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.convenios = JSON.parse(JSON.stringify(data));
          this.convenios.unshift({
            cod_rep: "0",
            descrip_rep: "Todas",
          });

          this.form.convenios = {
            cod_rep: "0",
            descrip_rep: "Todas",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },
    format_convenios(val) {
      return `${parseInt(val.cod_rep) || 0} - ${val.descrip_rep.trim()}`;
    },

    cargaragencias: function () {
      post
        .postData({
          url: "Recaudos/dlls/CfAgenciasJ.dll",
          data: 0 + "|" + "1" + "|",
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
            descripcion_agc: "Todos",
          };
        })
        .catch((err) => {
          this.send_error("Error al cargar Puntos de Recaudo");
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
      var data_parse = data.map((el) => {
        el.cantidad_rep = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
        el.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        return el;
      });
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Hora",
          value: "hora_rep",
          format: "string",
        },
        {
          title: "Punto Recaudo",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Entidad",
          value: "entidad_rep",
          format: "string",
        },
        {
          title: "Cantidad",
          value: "cantidad_rep",
        },
        {
          title: "Factura",
          value: "factura_rep",
          format: "string",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Estado",
          value: "estado_rep",
          format: "string",
        },
        {
          title: "Asobanca",
          value: "asobanca_rep",
          format: "string",
        },

        {
          title: "Cajero",
          value: "cajero_rep",
          format: "string",
        },
        {
          title: "Cierre",
          value: "cierre_rep",
          format: "string",
        },
        {
          title: "Inconsistencia",
          value: "inconsis_rep",
          format: "string",
        },
        {
          title: "F_Ingreso",
          value: "ingreso_rep",
          format: "string",
        },
        {
          title: "Radicado",
          value: "radicado_rep",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "consecutivo_rep",
          format: "string",
        },

        {
          title: "Codigo Barra",
          value: "barra_rep",
          format: "string",
        },
        {
          title: "Factura_Barra",
          value: "factbarra_rep",
          format: "string",
        },
        {
          title: "Dif_Barras",
          value: "difbarra_rep",
          format: "string",
        },
        {
          title: "Caracteres_Barras",
          value: "carbarra_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "RECAUDO DETALLADO", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Recaudo Detallado",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `RECAUDO DETALLADO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultar_reporte() {
      this.loader = true;
      var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let data = [
        sessionStorage.Sesion,
        fechaInicial,
        fechaFinal,
        "0",
        "8920022106",
      ];
      this.postData({
        url: "Recaudos/dlls/RpEmsa1J.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
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
