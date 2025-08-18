<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-file-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Reimpresión Comprobantes Contables</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @change="get_comprobantes()"
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Tipo Documento"
                  v-model="form.tipoDocumento"
                  :items="docc"
                  :item-text="format_docc"
                  hide-details
                  return-object
                  outlined
                  clearable
                  @change="get_comprobantes()"
                  :loading="loader.tipoDocumento"
                ></v-autocomplete>
              </v-col>

              <v-btn
                color="indigo"
                class="ma-2 white--text px-12 d-flex justify-end"
                large
                depressed
                @click="get_comprobantes()"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
            <v-row>
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="detalle.length == 0"
              >
                Generar Excel
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
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                item-key="consecutivo"
                show-expand
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Item</th>
                            <th class="text-left">Cuenta</th>
                            <th class="text-left">Rut</th>
                            <th class="text-left">Documento</th>
                            <th class="text-left">C. Costo</th>
                            <th class="text-left"></th>
                            <th class="text-left">Débito</th>
                            <th class="text-left"></th>
                            <th class="text-left">Crédito</th>
                            <th class="text-left"></th>
                            <th class="text-left">Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in item.registros" :key="row.item">
                            <td>{{ row.item }}</td>
                            <td class="text-left">{{ row.cuenta }}</td>
                            <td class="text-left">{{ row.rut }}</td>
                            <td>{{ row.nroext }}</td>
                            <td>{{ row.ccosto }}</td>
                            <td>{{ "" }}</td>
                            <td class="text-right">{{ row.debito }}</td>
                            <td>{{ "" }}</td>
                            <td class="text-right">{{ row.credito }}</td>
                            <td>{{ "" }}</td>
                            <td class="text-right">{{ row.detalle }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </template>
                <template v-slot:item.estado="{ item }">
                  {{ item.estado == "1" ? "Anulado" : "Activo" }}
                </template>

                <template v-slot:item.imprimir_pdf="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="generar_pdf(item)"
                        color="red accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                      >
                        <v-icon>mdi-file-pdf-box</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir comprobante en PDF</span>
                  </v-tooltip>
                </template>

                <template v-slot:item.imprimir_exec="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="generar_excel(item)"
                        color="green"
                        fab
                        small
                        icon
                        v-on="on"
                      >
                        <v-icon>mdi-file-excel-box</v-icon>
                      </v-btn>
                    </template>
                    <span>Generar comprobante en Excel</span>
                  </v-tooltip>
                </template>

                <template v-slot:item.subir_sop="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="subir_soportes(item)"
                        color="purple"
                        fab
                        small
                        icon
                        v-on="on"
                      >
                        <v-icon>mdi-file-upload-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Subir soportes</span>
                  </v-tooltip>
                </template>

                <template v-slot:item.bajar_sop="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="descargar_soportes(item)"
                        color="orange"
                        fab
                        small
                        icon
                        v-on="on"
                      >
                        <v-icon>mdi-download-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Descargar soportes</span>
                  </v-tooltip>
                </template>
             </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>

    <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <div id="marca_agua_comp" style="display: none">
        <span>ANULADO</span>
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
              <b>
                <a class="nombredoc_print"></a>
              </b>
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

    <v-dialog
      v-model="dialogo_archivo.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar documento</v-card-title>
        <v-card-text>
          <v-file-input
            label="Buscar PDF"
            outlined
            chips
            counter
            color="blue darken-1"
            hide-details
            :show-size="1000"
            accept="application/pdf"
            v-model="dialogo_archivo.model"
            id="archivo_pdf"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
          <v-btn
            depressed
            color="green darken-2"
            class="white--text px-12 mx-5"
            @click="up_file"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { formato_contable } from "../../_formatos.pdf.js";

export default {

  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      expanded: [],
      empresa: [],
      docc: [],
      item_sel: null,
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      search: "",
      form: null,
      drawer: false,
      headers: [
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          align: "center",
        },
        {
          text: "Consecutivo",
          align: "center",
          value: "consecutivo",
          width: "15%",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripc",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
        {
          text: "Estado",
          align: "left",
          value: "estado",
          width: "20%",
        },
        { text: "Imprimir Pdf", value: "imprimir_pdf", align: "center" },
        { text: "Imprimir Excel", value: "imprimir_exec", align: "center" },
        { text: "Subir Soportes", value: "subir_sop", align: "center" },
        { text: "Ver Soportes", value: "bajar_sop", align: "center" },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
    };
  },
  created() {
    this.get_empresa();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    this.cargarTabladocc();
  },
  methods: {
    print_reporte_excel() {
      const _this = this;
      let tipo_documento = this.form.tipoDocumento.descrip_docc;

      let data = [];

      this.detalle.forEach((el) => {
        el.registros.pop();

        let total_debito = 0;
        let total_credito = 0;

        el.registros.forEach((item) => {
          let debito = parseFloat(item.debito.replace(/\,/g, "")) || 0;
          let credito = parseFloat(item.credito.replace(/\,/g, "")) || 0;

          total_debito += debito;
          total_credito += credito;

          let obj = {
            ...item,
            comprobante: el.consecutivo.trim(),
            debito,
            credito,
          };

          data.push(obj);
        });

        data.push({
          item: "",
          cuenta: "",
          descrcta: "",
          idrut: "",
          rut: "",
          nroext: "",
          ccosto: "Totales: ",
          debito: total_debito,
          credito: total_credito,
          detalle: "",
          comprobante: el.consecutivo,
        });
      });

      var columnas = [
        {
          title: "Comprobante",
          value: "comprobante",
        },
        {
          title: "Item",
          value: "item",
        },
        {
          title: "Cuenta",
          value: "cuenta",
        },
        {
          title: "Nombre Cuenta",
          value: "descrcuenta",
        },
        {
          title: "Id_Rut",
          value: "idrut",
        },

        {
          title: "RUT",
          value: "rut",
        },
        {
          title: "Documento",
          value: "nroext",
        },
        {
          title: "Centro de costos",
          value: "ccosto",
        },
        {
          title: "Débito",
          value: "debito",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Crédito",
          value: "credito",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Detalle",
          value: "detalle",
        },
      ];

      let data_parse = [];
      data.forEach((el) => {
        data_parse.push({
          item: el.item.trim(),
          cuenta: el.cuenta.trim(),
          descrcuenta: el.descrcuenta,
          idrut: el.idrut.trim(),

          rut: el.rut.trim(),
          nroext: el.nroext.trim(),
          ccosto: el.ccosto.trim(),
          debito: el.debito,
          credito: el.credito,
          detalle: el.detalle.trim(),
          comprobante: el.comprobante,
        });
      });

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        tipo_documento.toUpperCase(),
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Comprobantes contables",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Reimp-Combroantes-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    up_file_old() {
      var file = this.dialogo_archivo.model;
      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        var ruta = `${this.dialogo_archivo.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/up.pdf.php", {
          method: "POST",
          body: archivo,
        })
          .then((res) => res.json())
          .catch((err) => {
            this.dialogo_archivo.loader = false;
            this.send_error("Ha ocurrido un error subiendo el PDF");
          })
          .then((res) => {
            this.dialogo_archivo.loader = false;
            if (res.code == 0) {
              this.cancelar_subida();

              this.$emit("snack", {
                color: "success",
                text: res.msj,
                estado: true,
              });
            } else {
              this.cancelar_subida();
              this.send_error(res.msj);
            }
          });
      }
    },
    async up_file() {
      var file = this.dialogo_archivo.model;
      let digito = this.empresa.id_empr.substr(14, 15);
      let idempresa = parseFloat(this.empresa.id_empr);
      let idjson = "cargue_" + digito + ".json";
      let session = sessionStorage.Sesion;
      let agencia = this.item_sel.agencia;
      let fechadoc = this.item_sel.fechadoc;
      let periodo = fechadoc.substr(0,6)
      let coddoc = this.item_sel.coddoc;
      let empresa = this.empresa.descrip_empr.trim();
      let iddrive = this.empresa.iddrive_rep.trim();
      let llavedoc = agencia + this.item_sel.coddoc;
      // iddrive = "1V9QwiShda842F6U5UHvh4tOPRqnMsqsq";
      let cargue_pdf = file.name;
      let consec = parseFloat(this.item_sel.consecutivo.trim());
      let clasif = 1;
      let consecpte = 0;
      let agcpte = 0;
      let idrut = 0;
      let codigo = "";
      let tipodoc = "02";
      let nombre_pdf =
      idempresa + "_CONT_" + periodo + "_" + agencia + coddoc + "_" + consec + "_" + clasif + ".pdf";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("clasif", clasif);
      data.append("consecutivo", consec);
      data.append("file", file);
      data.append("agencia", agencia);
      data.append("codigo", codigo);
      data.append("consecpte", consecpte);
      data.append("agcpte", agcpte);
      data.append("iddrive", iddrive);
      data.append("idjson", idjson);
      data.append("llavedoc", llavedoc);
      data.append("fechadoc", fechadoc);
      data.append("idrut", idrut);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/soporte.contab.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;
      this.cancelar_subida();
      this.get_comprobantes();

      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
      });
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
    },
    subir_soportes(item) {
      this.item_sel = item;
      this.dialogo_archivo.estado = true;

      const data = this.form;
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento =
        data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
      let consecutivo = item.consecutivo;
      let fecha = this.periodo_cargue.replace(/\-/g, "");

      this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo
        .trim()
        .padStart(12, "0")}_${fecha}`;
    },
    descargar_soportes(item) {
      const data = this.form;
      let nit = item.nit.trim().replace(/\,/g, "").padStart(15, "0");
      let documento =
        data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
      let consecutivo = item.consecutivo.trim().padStart(12, "0");
      let fecha = this.periodo_cargue.replace(/\-/g, "");
      console.log("up_file", item);

      if (!item.iddrive.trim()) {
        let llave = `${nit}_${documento}_${consecutivo}_${fecha}`;
        window.open(`https://server100ts.net/pdfs/${llave}.pdf`, "_blank");
      } else {
        const url =
          `https://drive.google.com/file/d/` +
          item.iddrive.trim() +
          `/view?usp=drive_link`;
        window.open(url, "_blank").focus();
      }
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
    generar_excel(data) {
      var _this = this;
      var data_parse = [];
      var items = data.registros;
      let tipo_documento = this.form.tipoDocumento.descrip_docc;

      var columnas = [
        {
          title: "Item",
          value: "item",
        },
        {
          title: "Cuenta",
          value: "cuenta",
          format: "string",
        },
        {
          title: "Id_Rut",
          value: "idrut",
        },

        {
          title: "RUT",
          value: "rut",
        },
        {
          title: "Documento",
          value: "nroext",
        },
        {
          title: "Centro de costos",
          value: "ccosto",
        },
        {
          title: "Débito",
          value: "debito",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Crédito",
          value: "credito",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Detalle",
          value: "detalle",
        },
      ];

      //poner datos en data parse
      items.forEach((el) => {
        data_parse.push({
          item: el.item.trim(),
          idrut: el.idrut,
          cuenta: el.cuenta.trim(),
          rut: el.rut.trim(),
          nroext: el.nroext.trim(),
          ccosto: el.ccosto.trim(),
          debito:
            el.debito === ""
              ? 0
              : parseFloat(el.debito.replace(/\ /g, "").replace(/\,/g, "")),
          credito:
            el.credito === ""
              ? 0
              : parseFloat(el.credito.replace(/\ /g, "").replace(/\,/g, "")),
          detalle: el.detalle.trim(),
        });
      });

      data_parse.push({
        descriprut_rep: "*** SubTotal",
        docexter_rep: "",
        fecha_rep: "",
        diasvenc_rep: "",
        diasxvenc_rep: "",
        saldo_rep: "",
      });

      data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        tipo_documento.toUpperCase(),
        "Fecha: " + data.fechagen.trim(),
        "Número: " + data.consecutivo.trim(),
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Comprobantes contables",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Reimp-Combroantes-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    generar_pdf(data) {
      let tipo_documento = this.form.tipoDocumento.descrip_docc;

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
    get_comprobantes() {
      this.detalle = [];
      var tipoDocumento = this.form.tipoDocumento;
      if (tipoDocumento) {
        this.loader.tabla_datos = true;
        var fecha = this.periodo_cargue.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          tipoDocumento.agencia_docc +
          tipoDocumento.codigo_docc +
          "|" +
          fecha +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrReimpcbJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader.tabla_datos = false;
            data = data.map((el) => {
              el.consecutivo = el.consecutivo.replace(/\,/g, "");
              return el;
            });

            data.pop();
            this.detalle = data;
          })
          .catch((err) => {
            this.loader.tabla_datos = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.detalle = [];
      }
    },
    format_docc: function (val) {
      return `${val.agencia_docc + val.codigo_docc} - ${val.descrip_docc}`;
    },
    cargarTabladocc: function () {
      this.docc.unshift({
        codigo_docc: "006",
        agencia_docc: "0001",
        descrip_docc: "CRUCES CARTERA",
      });
      this.docc.unshift({
        codigo_docc: "001",
        agencia_docc: "0001",
        descrip_docc: "RECIBOS DE CAJA",
      });

    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
