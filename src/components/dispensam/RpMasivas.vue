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
                >mdi-text-box-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Masivas</v-list-item-title
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
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="form.ressede"
            >
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
              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>
              <template v-slot:item.idpac_rep="{ item }">
                {{ parseInt(item.idpac_rep) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogocargue.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Cargue Documentos</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Soporte Entrega', value: 1 },
                  { text: 'Tirilla Pendientes', value: 2 },
                ]"
                label="Tipo Documento"
                clearable
                hide-details
                return-object
                v-model="form.tipodocum"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-file-input
                label="Cargar Documentos"
                accept=".pdf"
                outlined
                hide-details
                v-model="form.pdf"
              ></v-file-input>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn
                color="purple"
                class="white--text px-12"
                depressed
                large
                @click="subir_pdf"
              >
                Grabar Soporte
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-end">
              <v-btn
                color="red accent-4"
                class="white--text px-12"
                depressed
                large
                @click="dialogocargue.estado = false"
              >
                Cerrar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import Chart from 'chart.js/auto'
import { FlowerSpinner } from "epic-spinners";
import { dispensacion } from "../../_formatos_disp.js";
import { dispensacion_pos } from "../../_formatos_disp.js";
import { pendientes_pos } from "../../_formatos_disp.js";
import { copago_pos } from "../../_formatos_disp.js";

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
      item_sel: [],
      expanded: [],
      contenido: [],
      tablaruts: [],
      convenios: [],
      ptosrecaudo: [],
      empresa: [],
      dialogocargue: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Fecha", align: "left", value: "fechaentrega_rep" },
        { text: "Apellidos", align: "center", value: "apellidos_rep" },
        { text: "Nombres", align: "center", value: "nombres_rep" },
        { text: "Id Paciente", align: "center", value: "idpac_rep" },
        { text: "Medicamento", align: "center", value: "descripprod_rep" },
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
    this.get_empresa();
    this.cargaragencias();
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
          this.empresa = data[0];
          this.idusuario = parseFloat(sessionStorage.Sesion.substr(15, 15));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
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
            descripcion_agc: "Todas",
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

    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Nitc / Codigo IPS",
          value: "codips_rep",
          format: "string",
        },
        {
          title: "Ips Nombre",
          value: "nombips_rep",
          format: "string",
        },
        {
          title: "Ciudad",
          value: "ciudadips_rep",
          format: "string",
        },
        {
          title: "TipoDoc",
          value: "tipodoc_rep",
          format: "string",
        },
        {
          title: "No Documento",
          value: "idpac_rep",
        },
        {
          title: "Nombres",
          value: "nombres_rep",
          format: "string",
        },
        {
          title: "Apellidos",
          value: "apellidos_rep",
          format: "string",
        },
        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Nombre del Servicio",
          value: "descripprod_rep",
          format: "string",
        },
        {
          title: "CIE-10",
          value: "cie_rep",
          format: "string",
        },
        {
          title: "Diagnostico",
          value: "diagnostico_rep",
          format: "string",
        },
        {
          title: "Cantidad",
          value: "cant_rep",
        },
        {
          title: "Dias Tratamiento 1 mes , 2 meses, 3 meses",
          value: "canttto_rep",
          format: "string",
        },

        {
          title: "Quien Ordena el Medicamento (Medico especialista)",
          value: "mdremite_rep",
          format: "string",
        },
        {
          title: "Fecha Formula Medica",
          value: "fechaform_rep",
          format: "string",
        },
        {
          title: "Fecha entrega Medicamento",
          value: "fechaentrega_rep",
          format: "string",
        },
        {
          title: "Valor Total",
          value: "valor_rep",
          format: "string",
        },
        {
          title: "NAP AUTORIZADO",
          value: "nap_rep",
          format: "string",
        },
        {
          title: "IPS QUE ATIENDE",
          value: "ipsremite_rep",
          format: "string",
        },
        {
          title: "MUNICIPIO",
          value: "ciudadips_rep",
          format: "string",
        },
        {
          title: "COPAGO/CUOTA",
          value: "valor_rep",
          format: "string",
        },


      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE MASIVAS", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Masivas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE MASIVAS-${new Date().getTime()}`,
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
          url: "dispensa/dlls/RpMasivasJ.dll",
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
