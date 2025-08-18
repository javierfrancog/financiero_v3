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
              <v-icon size="30" color="blue darken-4 ">mdi-playlist-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Reporte Detallado Nómina</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
            <v-select
              :items="años_select"
              label="Año"
              outlined
              clearable
              hide-details
              v-model="form.periodo_cargue"
              @change="cargarcolaborador()"
              item-text="text"
              item-value="value"
              required
              :error="errores.anoselect"
            ></v-select>
          </v-col>


              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Todos los Colaboradores', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Colaborador a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ruts"
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Seleccione el Colaborador"
                  v-model="form.selruts"
                  :items="colaborador"
                  :item-text="format_ruts"
                   item-value="identificacion_rut"
                   hide-details
                  return-object
                  clearable
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ?  false: true) : true"
                ></v-autocomplete>
              </v-col>
            </v-row>

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
                  <v-date-picker v-model="form.fechaInicial" @input="pickeFechaIni = false"></v-date-picker>
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
                  <v-date-picker v-model="form.fechaFinal" @input="pickerFechaFinal = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="ma-1  white--text px-12"
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
                  class="ml-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="print_reporte_excel"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>

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

            <v-row>

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
                <label v-if="item.docinter_rep">{{item.codcta_rep}} - {{item.descripcta_rep}}</label>
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
                >{{item.docinter_rep}}</v-btn>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Registro</b>
                        </td>
                        <td>{{ item.registro_rep }}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Detalle</b>
                        </td>
                        <td>{{ item.detalle_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Id</b>
                        </td>
                        <td>{{ item.rut_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Imprimir</b>
                        </td>
                        <td>
                          <v-btn outlined small @click="reimprimir(item)">{{ item.docinter_rep}}</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
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
          <tr style="border-top: 1px solid;">
            <td colspan="5" style="padding-bottom: 40px">
              <b>TOTALES:</b>
            </td>
            <td style="padding-bottom: 40px;">
              <b class="total_debito"></b>
            </td>
            <td style="padding-bottom: 40px;">
              <b class="total_credito"></b>
            </td>
            <td style="padding-bottom: 40px;"></td>
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
      expanded: [],
      contenido: [],
      ruts3: [],
      colaborador:[],
      tablaruts: [],
      años_select: [],
      search: "",
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      form: {
        cuenta: null,
        cuentaContable: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Colaborador", align: "left", value: "Apellido1nomina_rep" },
        { text: "Periodo Nómina", align: "center", value: "periodo_rep" },
        { text: "Fecha Nómina", align: "center", value: "fechanomina_rep" },
        { text: "Descripción", align: "left", value: "descripbase_rep" },
        { text: "Cantidad", align: "center", value: "cantidad_rep" },
        { text: "Valor", align: "right", value: "valor_rep" },
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
    this.cargar_años();
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },


    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        if (el.index || typeof el.index == "number") {
          copia.valor_rep = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
          copia.vlrparafisc_rep = parseFloat(el.vlrparafisc_rep.replace(/\,/g, "")) || 0;
          copia.vlrprest_rep = parseFloat(el.vlrprest_rep.replace(/\,/g, "")) || 0;
          copia.vlrsegsoc_rep = parseFloat(el.vlrsegsoc_rep.replace(/\,/g, "")) || 0;
          copia.vlrvacion_rep = parseFloat(el.vlrvacion_rep.replace(/\,/g, "")) || 0;                    
          copia.colaborador_rep =el.Apellido1nomina_rep.trim() + " " + el.Apellido2nomina_rep.trim() + " " + el.nombresnomina_rep.trim(); 
        }

        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Colaborador",
          value: "colaborador_rep",
        },
        {
          title: "Periodo",
          value: "periodo_rep",
          format: "string",

        },
        {
          title: "Fecha",
          value: "fechanomina_rep",
          format: "string",
        },
        {
          title: "Descripcion",
          value: "descripbase_rep",
        },

        {
          title: "Cantidad",
          value: "cantidad_rep",
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
        },
        {
          title: "Base Prestacional",
          value: "vlrprest_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cantidad Prestacional",
          value: "cantprest_rep",
          totalsRowFunction: "sum",
        },

        {
          title: "Base Vacaciones",
          value: "vlrvacion_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Base Parafiscales",
          value: "vlrparafisc_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Base Seguridad Social",
          value: "vlrsegsoc_rep",
          totalsRowFunction: "sum",          
          format: "money",
        },

      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var rut_procesado = this.form.selruts
        ? `${
            this.form.selruts.identificacion_rut +
            " - " +
            this.form.selruts.descripcion_rut
          }`
        : "Todos los colaboradores";
      var header_format = [
        { text: "DETALLADO DE NOMINA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Rut procesado: ${rut_procesado}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Detallado Nomina",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `DETALLADO DE NOMNA-${new Date().getTime()}`,
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
            el.docabrev_rep.trim(),
            el.docextr_rep.trim(),
            { text: el.debito_rep.trim(), alignment: "right" },
            { text: el.credito_rep.trim(), alignment: "right" },
            { text: el.saldo_rep.trim(), alignment: "right" },
            el.detalle_rep.trim(),
          ];
          data_parse.push(item);
        } else {
          data_parse.push(["\n\n", "", "", "", "", "", "", "",""]);
        }
      });
      data_parse.unshift([
        { text: "Cuenta", style: "header_table" },
        { text: "Fecha", style: "header_table" },
        { text: "Descripcion", style: "header_table" },
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
          titulo: "Reporte auxiliares",
          fontSize: 8,
        });
      });
    },
 
    cargarcontenido() {
      var data = this.form;

      if (data.ruts != 1 && !data.selruts) {
        this.send_error("Selecciona un colaborador");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var tiporut = data.ruts;
        var colaborador = data.selruts
          ? data.selruts.idcolabora_rep
          : null;

        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        var fechaFinal = data.fechaFinal.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          tiporut +
          "|" +
          (tiporut == 1 ? "0" : colaborador) +
          "|" +
          fechaInicial +
          "|" +
          fechaFinal +
          "|";
        post

          .postData({
            url: "Financiero/dlls/RpGthDetalle1J.DLL",
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
    format_ruts: function (val) {
      return `${val.Apellido1colabora_rep}  ${val.nombrescolabora_rep}`;
    },
    cargarcolaborador() {
      this.loader = true;
      let ano = this.form.periodo_cargue;
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|" + ano + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
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
