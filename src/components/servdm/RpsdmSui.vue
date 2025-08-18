<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Reporte SUI Superservicios</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.cloud/img/superservicios.png"
                  contain
                  width="250"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row class="d-flex mb-4">
          <v-col class="d-flex" cols="3">
            <v-menu
              v-model="pickerMesfin"
              close-on-content-click
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechafin"
                  label="Periodo de Reporte"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechafin"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechafin"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechafin = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="3">
            <v-btn
              color="orange"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="generar_Grc1"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              GRC_1
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              color="purple"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="generar_Grtt2"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              GRTT_2
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              color="indigo"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="generar_Grcs7"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              GRCS_7
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
        <v-row> </v-row>

        <v-divider color="#FF6F00"></v-divider>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
      </v-card>
    </v-dialog>
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
      loader: false,
      pickerMes: false,
      pickerMesfin: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      anexos: [],
      search: "",
      form: {},
      headers: [],

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        fechafin: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
    };
  },
  created() {},
  computed: {},
  methods: {
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    generar_Grc1() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.loader = true;
        var periodo = this.form.fechafin.replace(/\-/g, "");
        let url = `Servdm/dlls/RpsdmSuiJ.dll`;
        post
          .postData({
            url,
            data: sessionStorage.Sesion + "|" + periodo + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.print_excel_grc1(data);
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.dialogoModificar.load = false;
            this.send_error("Error al generar reporte");
          });
      }
    },
    async print_excel_grc1(datos) {
      var data = JSON.parse(JSON.stringify(datos));
      let subsidio = 0;

      data.forEach((el) => {
        subsidio = parseFloat(el.vlrsubsidio_rep);
        subsidio = subsidio * -1;
        if (el.porcsubsidio_rep == 0.089) {
          subsidio = subsidio * -1;
        }

        el.vlrsubsidio_rep = subsidio;
        if (el.vlrsubsidio_rep == "-0") {
          el.vlrsubsidio_rep = "0";
        }
      });

      var data_parse = data;

      var columnas = [
        {
          title: "NIU",
          value: "nui_rep",
          format: "string",
        },
        {
          title: "TIPO GAS",
          value: "tipogas_rep",
          format: "string",
        },
        {
          title: "ID FACTURA",
          value: "idfact_rep",
          format: "string",
        },
        {
          title: "TIPO FACTURA",
          value: "tipofactura_rep",
        },
        {
          title: "FECHA EXPEDICION",
          value: "fechaexpedicion_rep",
          format: "string",
        },
        {
          title: "FECHA DE INICIO PERIODO DE FACTURACION",
          value: "fechainic_rep",
          format: "string",
        },
        {
          title: "FECHA DE TERMINACION PERIODO DE FACTURACION",
          value: "fechafin_rep",
          format: "string",
        },
        {
          title: "CONDICION PREDIO",
          value: "condicion_rep",
        },
        {
          title: "TIPO DE LECTURA",
          value: "tipolectura_rep",
        },
        {
          title: "FACTOR CALORIFICO",
          value: "factorcalorifico_rep",
          format: "string",
        },
        {
          title: "LECTURA ANTERIOR",
          value: "lectanterior_rep",
        },
        {
          title: "FECHA LECT ANT",
          value: "fechalectant_rep",
          format: "string",
        },
        {
          title: "LECTURA ACTUAL",
          value: "lectactual_rep",
        },
        {
          title: "FECHA LECT ACT",
          value: "fechalectact_rep",
          format: "string",
        },
        {
          title: "DIAS FACTURADOS",
          value: "diasfact_rep",
        },
        {
          title: "FACTOR CORRECCION",
          value: "factorcorr_rep",
        },
        {
          title: "CONSUMO",
          value: "consumo_rep",
        },
        {
          title: "CUV APLICADO",
          value: "cuvaplicado_rep",
        },
        {
          title: "FACTURACION CONSUMO",
          value: "vlrconsumo_rep",
        },
        {
          title: "FACTURACION CARGO FIJO",
          value: "vlrcargofijo_rep",
        },
        {
          title: "VALOR POR MORA ACUMULADA",
          value: "vlrmora_rep",
        },
        {
          title: "INTERESES POR MORA ACUMULADA",
          value: "vlrinteresesmora_rep",
        },
        {
          title: "VALOR DEL SUBSIDIO O CONTRIBUCION",
          value: "vlrsubsidio_rep",
          format: "string",
        },
        {
          title: "PORCENTAJE DE SUBSIDIO O CONTRIBUCION APLICADO",
          value: "porcsubsidio_rep",
        },
        {
          title: "CUOTA CONEXION",
          value: "cuotaconex_rep",
        },
        {
          title: "INTERES FINANCIACION CONEXION",
          value: "intercuotaconex_rep",
        },
        {
          title: "SUSPENSION Y RECONEXION",
          value: "vlrsuspenconex_rep",
        },
        {
          title: "CORTE Y REINSTALACION",
          value: "vlrcorte_rep",
        },
        {
          title: "TIPO REVISION INTERNA",
          value: "tiporevision_rep",
        },
        {
          title: "FECHA REVISION",
          value: "fecharevision_rep",
          format: "string",
        },
        {
          title: "VALOR OTROS CONCEPTOS",
          value: "vlrotros_rep",
        },
        {
          title: "INTERES OTROS CONCEPTOS",
          value: "intotros_rep",
        },
        {
          title: "DESCRIPCION OTROS",
          value: "descrotros_rep",
        },
        {
          title: "REFACTURACION M3",
          value: "refactm3_rep",
        },
        {
          title: "VALOR REFACTURACION",
          value: "vlrrefact_rep",
        },
        {
          title: "VALOR REFACTURACION SUBSIDIO",
          value: "vlrrefacsub_rep",
        },
        {
          title: "FECHA LIMITE DE PAGO",
          value: "fechalimite_rep",
          format: "string",
        },
        {
          title: "FECHA DE SUSPENSION",
          value: "fechasuspens_rep",
          format: "string",
        },
        {
          title: "VALOR TOTAL FACTURADO",
          value: "vlrtotal_rep",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "REPORTE SUI_GRC1", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Grc1",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE SUI_GRC1-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    generar_Grtt2() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.loader = true;
        var periodo = this.form.fechafin.replace(/\-/g, "");
        let url = `Servdm/dlls/RpSuigrtt2J.dll`;
        post
          .postData({
            url,
            data: sessionStorage.Sesion + "|" + periodo + "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.print_excel_grtt2(data);
          })
          .catch((err) => {
            this.loader = false;
            console.log(err);
            this.dialogoModificar.load = false;
            this.send_error("Error al generar reporte");
          });
      }
    },
    generar_Grcs7() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.loader = true;
        var periodo = this.form.fechafin.replace(/\-/g, "");
        let url = `Servdm/dlls/RpSuigrtt7J.dll`;
        post
          .postData({
            url,
            data: sessionStorage.Sesion + "|" + periodo + "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.print_excel_grtt7(data);
          })
          .catch((err) => {
            this.loader = false;
            console.log(err);
            this.dialogoModificar.load = false;
            this.send_error("Error al generar reporte");
          });
      }
    },
    async print_excel_grtt2(datos) {
      var data = JSON.parse(JSON.stringify(datos));

      var data_parse = data;

      var columnas = [
        {
          title: "NIU",
          value: "nui_rep",
          format: "string",
        },
        {
          title: "TIPO DE USUARIO",
          value: "tipousuario_rep",
        },
        {
          title: "ID COMERCIALIZADOR",
          value: "idcomercializa_rep",
          format: "number",
        },
        {
          title: "ID MERCADO",
          value: "idmercado_rep",
        },
        {
          title: "CODIGO DANE",
          value: "codigodane_rep",
          format: "string",
        },
        {
          title: "UBICACION",
          value: "ubicacion_rep",
        },
        {
          title: "DIRECCION",
          value: "direccion_rep",
          format: "string",
        },
        {
          title: "PREDIAL UTILIZADO",
          value: "predialutil_rep",
        },
        {
          title: "CEDULA CATASTRAL",
          value: "cedulacatast_rep",
          format: "string",
        },
        {
          title: "ESTRATO SECTOR",
          value: "estrato_rep",
          format: "number",
        },
        {
          title: "ALTITUD",
          value: "altitud_rep",
          format: "string",
        },
        {
          title: "LONGITUD",
          value: "longitud_rep",
          format: "string",
        },
        {
          title: "LATITUD",
          value: "latitud_rep",
          format: "string",
        },
        {
          title: "ESTADO",
          value: "estado_rep",
        },
        {
          title: "FECHA AJUSTE",
          value: "fechaajuste_rep",
          format: "fecha",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "REPORTE SUI_GRTT2", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Grtt2",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE SUI_GRTT2-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    async print_excel_grtt7(datos) {
      var data = JSON.parse(JSON.stringify(datos));

      var data_parse = data;

      var columnas = [
        {
          title: "NIU",
          value: "nui_rep",
          format: "string",
        },
        {
          title: "GRUPO",
          value: "grupo_rep",
        },
        {
          title: "NRO MEDIDOR",
          value: "nromedidor_rep",
          format: "string",
        },
        {
          title: "TIPO REVISION",
          value: "tiporevision_rep",
        },
        {
          title: "FECHA REVISION",
          value: "fecharevision_rep",
          format: "fecha",
        },
        {
          title: "NRO CERTIFICADO",
          value: "nrocertificado_rep",
          format: "string",
        },
        {
          title: "ORGANISMO DE CERTIFICACION",
          value: "orgcert_rep",
          format: "string",
        },
      ];

      var fecha_corte = this.form.fechafin;

      var header_format = [
        { text: "REPORTE SUI_GRCS7", bold: true, size: 16 },
        `Periodo: ${fecha_corte}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Grcs7",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE SUI_GRcs7-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
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