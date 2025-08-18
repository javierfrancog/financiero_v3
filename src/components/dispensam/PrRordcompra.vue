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
              <v-icon size="30" color="blue darken-4 ">mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Reimpresión Ordenes de Compra
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="3">
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
                  <v-date-picker v-model="fecha_ini"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="3">
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
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  label="Proveedor"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  hide-details
                  return-object
                  clearable
                  outlined
                  @change="
                    errores.clientes = false;
                    cargarcontenido();
                  "
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
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
              item-key="numero_fact"
              :search="search"
            >
              <template v-slot:item.estado_fact="{ item }">
                {{ item.estado_fact === "1" ? "Anulada" : "Activa" }}
              </template>
              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Orden</span>
                </v-tooltip>
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
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import { orden_compra } from "../../_formatos_disp.js";

// Configuración segura del vfs
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      prest_facturas: [],
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      item_envio: null,
      item_mail: 0,

      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      correo: [],
      correodestino: "",
      correodestino2: "",
      correodestino3: "",
      search: "",
      form: {},
      headers: [
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Cliente", align: "left", value: "cliente_fact" },
        { text: "Estado", align: "center", value: "estado_fact" },
        { text: "Observaciones", align: "center", value: "observaciones_fact" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      dialogocorreo: {
        estado: false,
      },

      datosEmpresa: [],
      titulo_print: null,
      condicion_pdf: true,
      clientes: [],
    };
  },
  created() {
    this.get_empresa();
    this.get_Clientes();
  },
  computed: {},
  methods: {
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;

          this.clientes.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });

          this.form.clientes = {
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          };
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    },
    async print_preview(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);
      var agencia = this.form.punto_fact;
      var tipoimpresion = item.impresion_fact;
      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Dispensa/dlls/PrFact01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.correodestino = data[0].email_cliente.trim();
          this.correodestino2 = data[0].email2_cliente.trim();
          this.correodestino3 = data[0].email3_cliente.trim();
          this.card.loader = false;
          this.card.disabled = false;
          if (tipoimpresion == "1") {
            this.get_pdf_pos(data[0]);
          } else {
            return await this.generar_pdf_2(data[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async print_item(item, getBase64) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);
      var agencia = "0001";
      var key = agencia + "|" + item.numero_fact + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Dispensa/dlls/PrOrdCompraJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.generar_pdf_2(data[0], getBase64);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      await orden_compra(data);
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.contenido = [];
      var fechaini = this.fecha_ini.split("-").join("");
      var fechafin = this.fecha_final.split("-").join("");
      let cliente = this.form.clientes.identificacion_rut;
      this.loader = true;

      post
        .postData({
          url: "Ptovta/dlls/PrOrdcompra02J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            9999 +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            cliente +
            "|",
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
            text: "No se encontraron Ordenes de Compra",
            estado: true,
          });
        });
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          if (this.datosEmpresa.obligfact_empr == 2) this.condicion_pdf = false;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    calcular_final() {
      let fecha = this.fecha_ini;
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
      this.fecha_final = f_final;
      this.pickeFechaIni = false;
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
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.valor_fact = parseFloat(el.valor_fact.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_fact",
          format: "fecha",
        },
        {
          title: "Proveedor",
          value: "cliente_fact",
        },
        {
          title: "Identificación",
          value: "id_fact",
        },
        {
          title: "Nro Orden",
          value: "numero_fact",
        },

        {
          title: "Valor",
          value: "valor_fact",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Estado",
          value: "estado_fact",
        },
      ];

      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var rut_procesado = this.form.clientes.descripcion_rut;
      var header_format = [
        { text: "REPORTE ORDENES DE COMPRA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Rut procesado: ${rut_procesado}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Ordenes de Compra",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-ORDENES DE COMPRA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    toObjectUrl(url) {
      return fetch(url, { mode: "no-cors" })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          return URL.createObjectURL(blob);
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
