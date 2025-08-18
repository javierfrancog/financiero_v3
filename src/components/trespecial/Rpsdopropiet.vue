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
                >mdi-account-cash-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Saldo Anticipos Propietarios</v-list-item-title
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
                    @input="calcular_final()"
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

              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todas las Placas', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Placa a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.placas"
                  required
                ></v-select>
              </v-col>

            
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Placas"
                  v-model="form.selplaca"
                  :items="tablaccosto"
                  :item-text="format_ccosto"
                  hide-details
                  return-object
                  outlined
                  :error="errores.ccosto"
                  @change="errores.ccosto = false"
                  v-if="form.placas ? (form.placas == 1 ? false : true) : true"

                  ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="[
                    { text: 'Todos los Ruts', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Rut a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ruts"
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="cargarcontenido"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end"> </v-row>

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

            <v-row>
              <v-col>
                <v-btn
                  color="red darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte()"
                  :disabled="contenido.length == 0"
                >
                  Imprimir PDF
                  <v-icon right dark>mdi-pdf-box</v-icon>
                </v-btn>

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
                      <!-- <tr>
                        <td>
                          <b>Registro</b>
                        </td>
                        <td>{{ item.registro_rep }}</td>
                      </tr> -->

                      <tr>
                        <td>
                          <b>Detalle</b>
                        </td>
                        <td>{{ item.detalle_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Nit/CC</b>
                        </td>
                        <td>{{ item.rut_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            color="indigo darken-2"
                            class="ma-2 white--text px-12"
                            depressed
                            @click="reimprimir(item)"
                          >
                            <span>Imprimir Comprobante</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
    <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <table id="pdf_header_comp">
        <thead>
          <tr>
            <th>
              <img class="logo" :src="logoSrc" />
            </th>
            <th>
              <a class="nombre_print"></a>
              <br />Nit
              <a class="nit_print"></a>
            </th>
            <th colspan="5">
              <b class="nombredoc_print"></b>
              <br />
              <b>
                Número:
                <a class="consecutivo_print"></a>
              </b>
              <br />
              <b>Fecha:</b>
              <a class="fecha_print"></a>
              <br />
            </th>
          </tr>
        </thead>
      </table>
      <table id="pdf_body_comp">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cuenta</th>
            <th>Rut</th>
            <th>Documento</th>
            <!-- <th>Doc_Ext</th>             -->
            <th>c. costo</th>
            <th>Débito</th>
            <th>Crédito</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr style="border-top: 1px solid">
            <td colspan="5" style="padding-bottom: 40px">
              <b>TOTALES:</b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_debito"></b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_credito"></b>
            </td>
            <td style="padding-bottom: 40px"></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <b>Revisó:</b>
            </td>
            <td colspan="2">
              <b>Generó:</b>
              <br />
              <a class="impreso_print"></a>
              <br />
              <a class="fechagen_print"></a>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { formato_contable } from "../../_formatos.pdf.js";
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    // JsonExcel
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      show_select: false,
      expanded: [],
      contenido: [],
      empresa: [],
      tablaruts: [],
      search: "",
      form: {
        placas: null,
        selplaca: null,
        fechaInicial: this.$moment().format("YYYY-MM-01"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "", value: "data-table-expand" },
        {
          text: "Cuenta",
          align: "left",
          value: "codcta_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fechacomp_rep",
          class: "white--text white blue darken-3",
          width: "100px",
        },
        // { text: "Id", align: "center", value: "rut_rep" },
        {
          text: "Descripción",
          align: "left",
          value: "descriprut_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Centro Costo",
          align: "left",
          value: "descripcosto_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Doc_Interno",
          align: "center",
          value: "docabrev_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Doc_Externo",
          align: "center",
          value: "docextr_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Vlr_Débito",
          align: "right",
          value: "debito_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: "Vlr_Credito",
          align: "right",
          value: "credito_rep",
          class: "white--text white blue darken-3",
        },
        {
          text: " ",
          align: "center",
          class: "white--text white blue darken-3",
        },
        {
          text: "Saldo",
          align: "right",
          value: "saldo_rep",
          class: "white--text white blue darken-3",
        },
      ],
      card_estado: false,
      tablaccosto: [],
      errores: {
        ccosto: false,
      },

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
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaruts();
    this.cargarTablaccostos();
    this.form.placas = 1;
    this.form.ruts = 2;
    
  },
  methods: {
    cargarTablaccostos: function () {
      post
        .postData({
          url: "trespecial/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    format_ccosto: function (val) {
      return `${val.descrip_cost}`;
    },

    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        if (el.index || typeof el.index == "number") {
          copia.debito_rep = parseFloat(el.debito_rep.replace(/\,/g, "")) || 0;
          copia.credito_rep =
            parseFloat(
              el.credito_rep.replace(/\,/g, "").replace(/\s\s+/g, "")
            ) || 0;
          copia.saldo_rep =
            parseFloat(el.saldo_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
            0;
        }

        data_parse.push(copia);
      });
      data_parse.pop();

      var columnas = [
        {
          title: "Cuenta",
          value: "codcta_rep",
        },
        {
          title: "Descripción cuenta",
          value: "descripcta_rep",
        },
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Descripcion",
          value: "descriprut_rep",
        },
        {
          title: "Centro Costo",
          value: "descripcosto_rep",
        },

        {
          title: "Doc. interno",
          value: "docabrev_rep",
        },
        {
          title: "Doc.Externo",
          value: "docextr_rep",
          format: "string",
        },

        {
          title: "Vlr débito",
          value: "debito_rep",
          format: "money",
        },
        {
          title: "Vlr crédito",
          value: "credito_rep",
          format: "money",
        },
        {
          title: "Saldo",
          value: "saldo_rep",
          format: "money",
        },
        {
          title: "Detalle",
          value: "detalle_rep",
          format: "string",
        },
        {
          title: "Doc.Contable",
          value: "coddoc_rep",
          format: "string",
        },
        {
          title: "Nro.Identificaciónn",
          value: "rut_rep",
        },
      ];

      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var cuenta_contable = this.form.cuentaContable
        ? `${
            this.form.cuentaContable.cod_puc.trim() +
            " - " +
            this.form.cuentaContable.descrip_puc.trim()
          }`
        : "Todas las cuentas";
      var rut_procesado = this.form.selruts
        ? `${
            this.form.selruts.identificacion_rut.trim() +
            " - " +
            this.form.selruts.descripcion_rut.trim()
          }`
        : "Todos los ruts";
      var header_format = [
        { text: "REPORTE SALDO PROPIETARIOS CTA 1330", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Cuenta a procesar: ${cuenta_contable}`,
        `Rut procesado: ${rut_procesado}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte auxiliares",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-AUXILIARES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_reporte() {
      var data = this.contenido;
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var cuenta_contable = this.form.cuentaContable
        ? `${
            this.form.cuentaContable.cod_puc.trim() +
            " - " +
            this.form.cuentaContable.descrip_puc.trim()
          }`
        : "Todas las cuentas";
      var rut_procesado = this.form.selruts
        ? `${
            this.form.selruts.identificacion_rut.trim() +
            " - " +
            this.form.selruts.descripcion_rut.trim()
          }`
        : "Todos los ruts";

      var data_parse = [];
      data.forEach((el) => {
        if (el.codcta_rep) {
          let item = [
            el.codcta_rep.trim() + " - " + el.descripcta_rep.trim(),
            el.fecha_rep.trim(),
            el.descriprut_rep.trim(),
            el.descripcosto_rep.trim(),
            el.docabrev_rep.trim(),
            el.docextr_rep.trim(),
            { text: el.debito_rep.trim(), alignment: "right" },
            { text: el.credito_rep.trim(), alignment: "right" },
            { text: el.saldo_rep.trim(), alignment: "right" },
            el.detalle_rep.trim(),
          ];
          data_parse.push(item);
        } else {
          data_parse.push(["\n\n", "", "", "", "", "", "", "", "", ""]);
        }
      });
      data_parse.unshift([
        { text: "Cuenta", style: "header_table" },
        { text: "Fecha", style: "header_table" },
        { text: "Descripcion", style: "header_table" },
        { text: "Centro Costo", style: "header_table" },
        { text: "Doc. interno", style: "header_table" },
        { text: "Doc. Externo", style: "header_table" },
        { text: "Vlr débito", style: "header_table" },
        { text: "Vlr crédito", style: "header_table" },
        { text: "Saldo", style: "header_table" },
        { text: "Detalle", style: "header_table" },
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
            {
              text: [
                { text: "Cuenta a procesar: ", bold: true },
                cuenta_contable,
              ],
            },
            {
              text: [{ text: "Rut procesado: ", bold: true }, rut_procesado],
            },
          ],
          orientation: "landscape",
          logo,
          titulo: "Reporte Saldo Propietario cta 1330",
          fontSize: 8,
        });
      });
    },
    calcular_final() {
      let fecha = this.form.fechaInicial;
      let año = fecha.substring(0, 4);
      let mes = fecha.substring(5, 7);
      let dia = fecha.substring(8, 10);

      let today = new Date(año, mes, 0);
      let lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      let f_final = año.concat("-", mes, "-", lastDay);
      this.form.fechaFinal = f_final;
      this.pickeFechaIni = false;
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    reimprimir(item) {
      var documento = item.docinter_rep.substring(0, 7);
      var consecutivo = item.docinter_rep.substring(7);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        documento +
        "|" +
        consecutivo +
        "|" +
        item.fecha_rep +
        "|";

      post
        .postData({
          url: "Financiero/dlls/PrRegcontJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_pdf(data) {
      let tipo_documento = data.nombredoc;
      data.tipo_documento = tipo_documento;
      data.empresa = this.empresa;

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        formato_contable(data).then(() => {
          console.log("Impresión finalizada");
        });
      });
    },
    cargarcontenido() {
      var data = this.form;

      if (data.placas === 2 && !data.selplaca) {
        this.send_error("Selecciona una placa");
      } else if (data.ruts === 2 && !data.selruts) {
        this.send_error("Debe seleccionar un Propietario");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var selrut = data.selruts
          ? data.selruts.identificacion_rut
          : 99999999999999;

        var tiporut = data.ruts;
        var tipoplacas = data.placas;
        
        if (tiporut === "1") {
          selrut = 99999999999999;
        }
        let ccosto = 9999;
     
        if (tipoplacas == 1) {
          ccosto = 9999;
        }else{
          ccosto = data.selplaca.llavecentro_cost;
             }
        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        var fechaFinal = data.fechaFinal.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          ccosto +
          "|" +
          selrut +
          "|" +
          fechaInicial +
          "|" +
          fechaFinal +
          "|";
        post

          .postData({
            url: "trespecial/dlls/RpsdopropietJ.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;

            var new_data = [];
            var cuentaActual = null;
            var cuentaSiguiente = null;
            data.forEach((item, index) => {
              cuentaActual = item.codcta_rep;
              if (index + 1 != data.length)
                cuentaSiguiente = data[index + 1].codcta_rep;

              item.index = index;
              new_data.push(item);
              if (cuentaActual != cuentaSiguiente) new_data.push({});
            });

            this.contenido = new_data;
          })
          .catch((err) => {
            console.log(err)
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al generar reporte ");
          });
      }
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cambio_auxiliar() {
      this.show_select = false;
      this.form.cod_puc = "";

      if (this.form.cuenta === 3) {
        this.show_select = true;
      }
    },

    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },

    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasContables = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
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

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_print")[0].innerHTML = "";
  document.getElementsByClassName("nombredoc_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_print")[0].innerHTML = "";
  document.getElementsByClassName("consecutivo_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_print")[0].innerHTML = "";
  document.getElementsByClassName("total_debito")[0].innerHTML = "";
  document.getElementsByClassName("total_credito")[0].innerHTML = "";
  document.getElementsByClassName("impreso_print")[0].innerHTML = "";
  document.getElementsByClassName("fechagen_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body_comp")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}
</script>
