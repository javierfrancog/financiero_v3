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
                >mdi-cash-usd-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cuadre de Caja ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
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
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-switch v-model="resumido" label="Resumido"></v-switch>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Colaborador"
                  v-model="colabora"
                  :items="ruts3"
                  :item-text="format_ruts"
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  outlined
                  @change="errores.colabora = false"
                  :error="errores.colabora"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                  depressed
                  large
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="3" v-if="prest_servicios.length > 0">
                <v-btn
                  color="red"
                  class="ma-2 white--text"
                  @click="imprimir_pdf"
                  depressed
                  large
                >
                  Imprimir
                  <v-icon right dark>mdi-file-pdf-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-divider color="succes"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="numero"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
              show-expand
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>

      <!-- <div id="downloadPdf">
        <div id="cargando_pdf">
          <h3>Cargando impresión...</h3>
        </div>
        <table id="download_pdf_header">
          <thead>
            <tr>
              <th>
                <img
                  class="logo"
                  src="https://server1ts.net/datos/image/clientes/901099286.png"
                />
              </th>
              <th>
                <a id="tipo_reporte"> </a>
              </th>
              <th>
                <a id="fecha_ini_reporte"></a>
                <br />
                <a id="fecha_fin_reporte"></a>
                <br />
              </th>
            </tr>
          </thead>
        </table>
        <table id="download_pdf_body">
          <thead>
            <tr>
              <th>Sede</th>
              <th>Numero</th>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>Nombres</th>
              <th>Valor</th>
              <th>Autorizacion</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div> -->
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
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
      loader: false,
      search: null,
      colabora: null,
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      resumido: null,
      prest_servicios: [],
      selectObjContratos: [],
      contratos: [],
      headerCsv: [],
      ruts3: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Tipo", align: "left", value: "tipo" },
        { text: "Fecha", align: "left", value: "fecha" },
        { text: "Operador", align: "left", value: "operador" },

        { text: "Valor", align: "right", value: "valor" },
        { text: "Sede", align: "center", value: "sede" },
        { text: "Numero", align: "center", value: "numero" },

        { text: "Desc_Paciente", align: "left", value: "descrip_paciente" },
        { text: "Identificacion", align: "left", value: "identificacion" },
        { text: "Servicio", align: "left", value: "servicio" },
        // { text: "Profesional", align: "left", value: "atiende" },
      ],
      empresa: [],
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      errores: {
        colabora: false,
      },

      masivo_pdf: {
        data: [],
      },
    };
  },
  created() {
    this.get_ruts3();
    this.get_empresa();
    this.cargarContratos();
  },
  computed: {},
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
    imprimir_pdf() {
      var data = this.prest_servicios;
      var data_parse = [];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var total = 0;

      data.forEach((el) => {
        let valor = parseFloat(el.valor.trim().replace(/\,/g, "")) || 0;
        if (el.tipo === "C.Egreso") {
          valor = valor * -1;
        }
        total += valor;
        let item = [
          el.tipo.trim(),
          el.fecha.trim(),
          el.operador.trim(),
          { text: el.valor.trim(), alignment: "center" },
          el.sede.trim(),
          parseFloat(el.numero),
          el.descrip_paciente.trim(),
          el.servicio.trim(),
          el.prefcopago + parseFloat(el.nrocopago),
          el.contrato_rep.trim(),
          el.observ.trim(),
        ];

        data_parse.push(item);
      });
      data_parse.push([
        null,
        null,
        { text: "Total Entregado: ", bold: true },
        { text: this.formatNumero(total), bold: true, alignment: "center" },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]);

      data_parse.unshift([
        { text: "Tipo", style: "header_table" },
        { text: "Fecha", style: "header_table" },
        { text: "Operador", style: "header_table" },
        { text: "Valor", style: "header_table", alignment: "center" },
        { text: "Sede", style: "header_table" },
        { text: "Prestacion", style: "header_table" },
        { text: "Paciente", style: "header_table" },
        { text: "Servicio", style: "header_table" },
        { text: "Factura", style: "header_table" },
        { text: "Contrato", style: "header_table" },
        { text: "Observacion", style: "header_table" },
      ]);

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_parse,
          header_pdf: [
            {
              text: [
                { text: "Fecha inicial: ", bold: true },
                fecha_inicial,
                { text: " - Fecha final: ", bold: true },
                fecha_final,
              ],
            },
          ],
          logo,
          orientation: "landscape",
          titulo: "Cuadre Diario de Caja",
          fontSize: 8,
          width_table: [
            "auto",
            "auto",
            "*",
            "*",
            "auto",
            "auto",
            "*",
            "*",
            "*",
            "*",
            "*",
          ],
          pageMargins: [20, 20, 20, 20],
        });
      });
    },
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    consultarServicios() {
      this.loader = true;
      var fechaini = this.fecha_ini.replace(/-/g, "");
      var fechafin = this.fecha_final.replace(/-/g, "");
      var resumido = this.resumido ? 1 : 0;
      var contrato = this.selectContrato ? this.selectContrato : "0";
      var colabora = this.colabora ? this.colabora.identificacion_rut : "0";

      post
        .postData({
          url: "Clinico/dlls/ClRpPrest0102J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            resumido +
            "|" +
            contrato +
            "|" +
            colabora +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.prest_servicios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar servicios",
            estado: true,
          });
        });
    },
    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts3 = data;
          this.ruts3.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });

        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar colaboradores",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar información de la empresa",
            estado: true,
          });
        });
    },
  },
};
</script>
<style lang="sass">
.v-data-table__wrapper td
  line-height: 2!important
</style>