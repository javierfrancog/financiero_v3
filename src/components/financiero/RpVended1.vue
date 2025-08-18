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
                >mdi-finance</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Rentabilidad de Asesor</v-list-item-title
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

            <v-row class="d-flex justify-end">
              <v-col>
                <v-btn
                  small
                  color="green darken-2"
                  outlined
                  class="ma-2 white--text px-12"
                  depressed
                  @click="print_reporte_excel"
                  :disabled="contenido.length == 0 ? true : false"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>

              <v-btn
                color="success"
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
              item-key="key"
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
              <!-- <template v-slot:item.docinter_rep="{ item }">
                <v-btn
                  depressed
                  small
                  rounded
                  color="primary"
                  outlined
                  v-if="item.descripcta_rep"
                  @click="reimprimir(item)"
                >{{item.docinter_rep}}</v-btn>
              </template> -->
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
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
                          <v-btn outlined small @click="reimprimir(item)">{{
                            item.docinter_rep
                          }}</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
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
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      tablaproductos: [],
      codigoUbicacion: [],
      codigoProducto: [],

      ubica: [],
      search: "",
      form: {
        cuenta: null,
        codUbicacion: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Asesor", align: "left", value: "asesor_rep" },
        { text: "Producto", align: "left", value: "descripprod_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        { text: "Venta", align: "center", value: "venta_rep" },
        { text: "Costo", align: "right", value: "costo_rep" },
        { text: "Resultado", align: "center", value: "neto_rep" },
        { text: "%", align: "center", value: "porc_rep" },
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
    this.cargarTablaubica();
    this.cargarTablaruts();
    this.cargarTablaproductos();
  },
  methods: {
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.pop()
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));        
        copia.cant_ent_rep =
          parseFloat(el.cant_ent_rep.replace(/\,/g, "")) || 0;
        copia.vlr_ent_rep =
          parseFloat(el.vlr_ent_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
          0;
        copia.cant_sal_rep =
          parseFloat(
            el.cant_sal_rep.replace(/\,/g, "").replace(/\s\s+/g, "")
          ) || 0;
        copia.vlr_sal_rep =
          parseFloat(el.vlr_sal_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
          0;
        copia.cant_saldo_rep =
          parseFloat(
            el.cant_saldo_rep.replace(/\,/g, "").replace(/\s\s+/g, "")
          ) || 0;
        copia.vlr_saldo_rep =
          parseFloat(
            el.vlr_saldo_rep.replace(/\,/g, "").replace(/\s\s+/g, "")
          ) || 0;
        copia.promed_rep =
          parseFloat(el.promed_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) ||
          0;

        data_parse.push(copia);
      });
      data_parse.pop();

      var columnas = [
        {
          title: "Id_Producto",
          value: "codprod_rep",
        },
        {
          title: "Ubicación",
          value: "ubicacion_rep",
        },
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha_rep",
        },
        {
          title: "Clasificación",
          value: "descrip_clasif_pr",
        },
        {
          title: "Descripción Producto",
          value: "descripprod_rep",
        },
        {
          title: "Tipo_Operación",
          value: "docabrev_rep",
        },
        {
          title: "Nro_Interno",
          value: "docinter_rep",
        },
        {
          title: "Descripcion",
          value: "descriprut_rep",
        },
        {
          title: "Doc.Externo",
          value: "docext_rep",
        },
        {
          title: "Cant.Entrada",
          value: "cant_ent_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Vlr Entrada",
          value: "vlr_ent_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cant. Salida",
          value: "cant_sal_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Valor Salida",
          value: "vlr_sal_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Cant. Saldo",
          value: "cant_saldo_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Valor Saldo",
          value: "vlr_saldo_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Promedio",
          value: "promed_rep",
        },
      ];

      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      console.log(this.form.ubicacion.value,this.form.ubicacion.text , this.form.codUbicacion)
      var ubicacion = this.form.ubicacion.value == 1 ? this.form.ubicacion.text : this.form.codUbicacion.descrip_ubic
      
      var rut_procesado = this.form.selruts
        ? `${
            this.form.selruts.identificacion_rut.trim() +
            " - " +
            this.form.selruts.descripcion_rut.trim()
          }`
        : "Todos los ruts";
      var header_format = [
        { text: "KARDEX", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Ubicación: ${ubicacion}`,
        `Rut Procesado: ${rut_procesado}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Kardex",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `KARDEX-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.codigoUbicacion = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },

    cargarcontenido() {
      var data = this.form;
      {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        var fechaFinal = data.fechaFinal.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          fechaInicial +
          "|" +
          fechaFinal +
          "|";
        post
          .postData({
            url: "Ptovta/dlls/RpVended1J.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            var json = JSON.parse(JSON.stringify(data));

            json.forEach((element, index) => {
              json[index].key = index;
            });
            this.contenido = json;
          })
          .catch((err) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte Vendedor");
          });
      }
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },

    format_ubicaciones: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },

    format_productos: function (val) {
      return `${val.codigo_pr} - ${val.descripcion_pr}`;
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

    cargarTablaproductos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaproductos = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Productos");
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
