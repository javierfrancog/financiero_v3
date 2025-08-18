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
                >mdi-timer-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Pendientes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="2">
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

              <v-col class="d-flex" sm="2">
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
              <v-col class="d-flex" cols="5">
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

            <v-col class="d-flex" cols="3">
              <v-select
                :items="[
                  { text: 'Solo Pendientes', value: 0 },
                  { text: 'Solo Entregados', value: 2 },
                  { text: 'Todos', value: 9 },
                ]"
                label="Estado"
                clearable
                hide-details
                outlined
                return-object
                v-model="form.tipoestado"
                item-text="text"
                item-value="value"
                required
                @change="errores.tipoestado = false"
                :error="errores.tipoestado"

              ></v-select>
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
              <template v-slot:item.consec_dsp="{ item }">
                {{ parseInt(item.consec_dsp) }}
              </template>
              <template v-slot:item.idpac_rep="{ item }">
                {{ parseInt(item.idpac_rep) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printpend_item(item)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-cloud-print-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Pendientes</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <!-- <v-dialog v-model="dialogocargue.estado" persistent max-width="900px">
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
    </v-dialog> -->
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import Chart from 'chart.js/auto'
import { FlowerSpinner } from "epic-spinners";
import { dispensacion } from "../../_formatos_disp.js";
import { dispensacion_pos } from "../../_formatos_disp.js";
import { pendientes_pos } from "../../_formatos_disp.js";

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
      { text: "Opciones", value: "edit", align: "center" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Nro Dispensación", align: "center", value: "consec_dsp" },

        { text: "Medicamento", align: "center", value: "medicamento_rep" },
        { text: "Cant.Pendiente", align: "center", value: "cantidad_rep" },
        { text: "Paciente", align: "center", value: "descrpaciente_rep" },
        { text: "Id Paciente", align: "center", value: "idpac_rep" },

        // { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        puntos: false,
        tipoestado: false,
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
    async printdisp_item(item) {
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            dispensacion(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printpend_item(item) {
      console.log(item);
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            pendientes_pos(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
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
    format_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Bloqueado";
    },
    print_reporte_excel() {
      if (!this.form.puntos) {
        this.errores.puntos = true;
        this.send_error("Selecciona una sede");
      } else if (!this.form.tipoestado) {
        this.errores.tipoestado = true;
        this.send_error("Selecciona un Estado");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.puntos.codigo_agc;
        let estado = this.form.tipoestado.value;
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          estado,
        ];
        this.postData({
          url: "dispensa/dlls/RpPendientesExJ.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            let data_parse = JSON.parse(JSON.stringify(data));
            this.montar_excel(data_parse);

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

    montar_excel(data) {
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
        },
        {
          title: "Id_Paciente",
          value: "idpac_rep",
          format: "number",
        },
        {
          title: "Paciente",
          value: "descrpaciente_rep",
          format: "string",
        },

        {
          title: "Medicamento",
          value: "medicamento_rep",
          format: "string",
        },
        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },

        {
          title: "Nombre comercial",
          value: "nomcomerc_rep",
          format: "string",
        },

        {
          title: "Cantidad Solicitada",
          value: "cantsolic_rep",
          format: "number",
        },
        {
          title: "Cantidad Entregada",
          value: "cantentreg_rep",
          format: "number",          
        },
        {
          title: "Cantidad Ajuste",
          value: "cantajuste_rep",
          format: "number",
        },
        {
          title: "Cantidad Pendiente",
          value: "cantidad_rep",
          format: "number",
        },
        {
          title: "Eps",
          value: "eps_rep",
          format: "string",
        },
        {
          title: "Nro_pendiente",
          value: "consec_rep",
          format: "string",
        },
        // {
        //   title: "Servicio",
        //   value: "servicio_rep",
        //   format: "string",
        // },

        {
          title: "Nro_dispensacion",
          value: "consecdsp_dsp",
          format: "string",
        },
        {
          title: "Fecha Formula",
          value: "fechaformula_rep",
          format: "string",
        },
        {
          title: "Fecha Autorización",
          value: "fechaautoriza_rep",
          format: "string",
        },

        {
          title: "Estado",
          value: "estado_rep",
          format: "string",
        },
        {
          title: "Funcionario",
          value: "elabora_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE DISPENSACIONES PENDIENTES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Dispensaciones Pendientes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE DISPENSACIONES PENDIENTES-${new Date().getTime()}`,
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
      } else if (!this.form.tipoestado) {
        this.errores.tipoestado = true;
        this.send_error("Selecciona un Estado");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.puntos.codigo_agc;
        let estado = this.form.tipoestado.value;

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          estado,
        ];
        this.postData({
          url: "dispensa/dlls/RpPendientes01J.dll",
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
