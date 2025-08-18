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
                >mdi-filter-variant-plus</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Auxiliares</v-list-item-title
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
                    { text: 'Todas las cuentas', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                    { text: 'Seleccion Manual', value: 3 },
                  ]"
                  label="Cuentas a Procesar"
                  outlined
                  clearable
                  hide-details
                  @change="cambio_auxiliar"
                  v-model="form.cuenta"
                  required
                ></v-select>
              </v-col>

              <v-col cols="2" v-if="show_select">
                <v-text-field
                  label="Digite el Codigo"
                  v-model="form.cod_puc"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Código de cuenta"
                  v-model="form.cuentaContable"
                  :items="cuentasContables"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  clearable
                  outlined
                  v-if="form.cuenta ? (form.cuenta == 2 ? true : false) : true"
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
                  @change="form.selruts = null"
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
              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.ordrut"
                  label="Ordenado por Nombre"
                ></v-switch>
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
import { reporte_aux } from "../../_formatos.pdf.js";

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
        cuenta: null,
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
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
          width: "150px",
          class: "white--text white blue darken-3",
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
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablactas();
    this.cargarTablaruts();
    this.form.ordrut = false;
  },
  methods: {
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];

      let vlrCredito = 0;
      let vlrDebito = 0;
      let vlrSaldo = 0;

      let mayor = this.form.cuentaContable
        ? this.form.cuentaContable.cod_puc.substr(0, 4)
        : 0;

      if (mayor == 1105 || mayor == 1110 || mayor == 1120) {
        this.form.ordrut = false;
      }

      data.forEach((el, i) => {
        if (el.codcta_rep != undefined) {
          let copia = JSON.parse(JSON.stringify(el)); // Copia profunda del elemento
          const codigo = copia.codcta_rep || "";
          const is2or3or4 =
            codigo.startsWith("2") ||
            codigo.startsWith("3") ||
            codigo.startsWith("4");

          // Validación necesaria para evitar errores en el 'replace'
          if (el.index || typeof el.index === "number") {
            // Convertir valores numéricos de string a float y manejar valores nulos
            copia.debito_rep = parseFloat(el.debito_rep.replace(/,/g, "")) || 0;
            copia.credito_rep =
              parseFloat(
                el.credito_rep.replace(/,/g, "").replace(/\s\s+/g, "")
              ) || 0;
            // si es saldo inicial, se toma el valor como es y si no, se calcula el saldo segun codigo
//            if (
//              copia.docabrev_rep == "Saldo Inicial" ||
 //             data_parse[i - 1] === undefined
            //) {
              //copia.saldo_rep = parseFloat(
               // el.saldo_rep.replace(/,/g, "").replace(/\s+/g, "")
             // );
           // } else {
            //  copia.saldo_rep =
              //  data_parse[i - 1].saldo_rep +
                //(is2or3or4
                 // ? copia.credito_rep - copia.debito_rep
                  //: copia.debito_rep - copia.credito_rep);
           // }
             copia.saldo_rep = parseFloat(
               el.saldo_rep.replace(/,/g, "").replace(/\s+/g, "")
             ) || 0;

            // Acumular valores
            vlrDebito += copia.debito_rep;
            vlrCredito += copia.credito_rep;
            if (copia.docabrev_rep == "Saldo Inicial")
              vlrSaldo += copia.saldo_rep;
          }

          // Añadir el objeto actual al array resultante
          data_parse.push(copia);

          // Si es el último elemento o si el siguiente elemento tiene una cuenta diferente segun el ordenamiento
          if (i === data.length - 1 || codigo != data[i + 1].codcta_rep) {
            data_parse.push({
              docextr_rep: "TOTALES",
              debito_rep: vlrDebito.toFixed(2),
              credito_rep: vlrCredito.toFixed(2),
              saldo_rep: (
                (is2or3or4 ? vlrCredito - vlrDebito : vlrDebito - vlrCredito) +
                vlrSaldo
              ).toFixed(2),
            });
            data_parse.push({}); // Deja un espacio

            // Reiniciar valores después de agregar el total
            vlrDebito = 0;
            vlrCredito = 0;
            vlrSaldo = 0;
          }
        }
      });

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
        { text: "REPORTE AUXILIARES", bold: true, size: 16 },
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
      let mayor = this.form.cuentaContable
        ? this.form.cuentaContable.cod_puc.substr(0, 4)
        : 0;

      if (mayor == 1105 || mayor == 1110 || mayor == 1120) {
        this.form.ordrut = false;
      }
      let data_impresion = {
        fecha_inicial: this.form.fechaInicial,
        fecha_final: this.form.fechaFinal,
        cuenta_contable: this.form.cuentaContable
          ? `${
              this.form.cuentaContable.cod_puc.trim() +
              " - " +
              this.form.cuentaContable.descrip_puc.trim()
            }`
          : "Todas las cuentas",
        rut_procesado: this.form.selruts
          ? `${
              this.form.selruts.identificacion_rut.trim() +
              " - " +
              this.form.selruts.descripcion_rut.trim()
            }`
          : "Todos los ruts",
        ordrut: this.form.ordrut,
        infoReportes: this.contenido,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data_impresion.logo = logo;
        reporte_aux(data_impresion).then(() => {
          console.log("Impresion terminada");
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
      // this.form.fechaFinal = f_final;
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
      if (!data.cuenta) {
        this.send_error("Selecciona el tipo de cuenta a procesar");
      } else if (data.cuenta === 2 && !data.cuentaContable) {
        this.send_error("Selecciona el código de cuenta a procesar");
      } else if (data.cuenta === 3 && !data.cod_puc) {
        this.send_error("Digita el código de cuenta a procesar");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var cuentaProcesar = data.cuenta;
        let mayor = this.form.cuentaContable
          ? this.form.cuentaContable.cod_puc.substr(0, 4)
          : 0;
        var cuentaContable = data.cuentaContable
          ? data.cuentaContable.cod_puc
          : null;

        let url_envio = "Financiero/dlls/RpAuxiliar2J.DLL";

        if (this.form.ordrut == false) {
          url_envio = "Financiero/dlls/RpAuxiliar1J.DLL";
        }
        if (mayor == 1105 || mayor == 1110 || mayor == 1120) {
          url_envio = "Financiero/dlls/RpAuxiliar1J.DLL";
        }

        let puc = data.cod_puc ? data.cod_puc : "";
        if (puc) {
          cuentaContable = puc;
        }
        var selrut = data.selruts
          ? data.selruts.identificacion_rut
          : 99999999999999;

        var tiporut = data.ruts;
        if (tiporut === "1") {
          selrut = 99999999999999;
        }

        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        var fechaFinal = data.fechaFinal.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          cuentaProcesar +
          "|" +
          (cuentaProcesar == 1 ? "0" : cuentaContable) +
          "|" +
          selrut +
          "|" +
          fechaInicial +
          "|" +
          fechaFinal +
          "|";
        post

          .postData({
            url: url_envio,
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
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte auxiliar");
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
      return `${parseFloat(val.identificacion_rut)} - ${val.descripcion_rut}`;
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
