<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
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
                >Reporte Kárdex</v-list-item-title
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
                    @input="(pickeFechaIni = false), calcular_final()"
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

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Ubicación"
                  v-model="form.codUbicacion"
                  :items="codigoUbicacion"
                  :item-text="format_ubicaciones"
                  item-value="codigo_ubic"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Producto"
                  v-model="form.codProducto"
                  :items="tablaproductos"
                  :item-text="format_productos"
                  item-value="codigo_pr"
                  clearable
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex justify-end">
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
              <v-col>
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
      ruts: [
        { text: "Todos los Ruts", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],

      ubicaciones: [
        { text: "Todas las Ubicaciones", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],
      tipo_producto: [
        { text: "Todos los Productos", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],
      tablaruts: [],
      tablaproductos: [],
      codigoUbicacion: [],
      codigoProducto: [],
      datosEmpresa: [],

      ubica: [],
      search: "",
      form: {
        cuenta: null,
        codUbicacion: null,
        producto: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
        ubicacion: null,
        ruts: null,
      },
      headers: [
        { text: "", value: "data-table-expand" },
        {
          text: "Ubicación",
          align: "left",
          value: "ubicacion_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripprod_rep",
          class: "indigo--text background-color: blue lighten-5",
        },
        {
          text: "Lote",
          align: "left",
          value: "lote_rep",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Fecha",
          align: "center",
          value: "fecha_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Nro_Interno",
          align: "right",
          value: "docinter_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Detalle",
          align: "left",
          value: "detalle_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Tipo_Op",
          align: "left",
          value: "descriptipoper_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Doc_Externo",
          align: "right",
          value: "docext_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Cant_Entrada",
          align: "right",
          value: "cant_ent_rep",
          class: "green--text blue lighten-5",
        },
        {
          text: "Cant_Salida",
          align: "right",
          value: "cant_sal_rep",
          class: "red--text blue lighten-5",
        },
        {
          text: "Cant_Saldo",
          align: "center",
          value: "cant_saldo_rep",
          class: "orange--text blue lighten-5",
        },
        {
          text: "Nombre",
          align: "left",
          value: "descriprut_rep",
          class: "indigo--text blue lighten-5",
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
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  async created() {
    await this.get_empresa();
    this.cargarTablaproductos();    
    this.cargarTablaubica();
    this.cargarTablaruts();

  },
  methods: {
    async get_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.pop();
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.cant_ent_rep =
          parseFloat(el.cant_ent_rep.replace(/\,/g, "")) || 0;
        copia.cant_sal_rep =
          parseFloat(
            el.cant_sal_rep.replace(/\,/g, "").replace(/\s\s+/g, "")
          ) || 0;
        copia.cant_saldo_rep =
          parseFloat(
            el.cant_saldo_rep.replace(/\,/g, "").replace(/\s\s+/g, "")
          ) || 0;
        data_parse.push(copia);
      });
      // data_parse.pop();

      var columnas = [
        {
          title: "Ubicación",
          value: "ubicacion_rep",
        },
        {
          title: "Descripción Producto",
          value: "descripprod_rep",
          format: "string",
        },
        {
          title: "Lote",
          value: "lote_rep",
          format: "string",
        },
        {
          title: "Tipo_Operación",
          value: "descriptipoper_rep",
        },
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Nro_Interno",
          value: "docinter_rep",
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
          title: "Cant. Salida",
          value: "cant_sal_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Cant. Saldo",
          value: "cant_saldo_rep",
        },
        {
          title: "Registro",
          value: "registro_rep",
          format: "string",
        },
      ];

      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var ubicacion = this.form.codUbicacion.descrip_ubic;

      var header_format = [
        { text: "KARDEX", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Ubicación: ${ubicacion}`,
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
          var filtro = data.filter(
            (el) => el.codigo_ubic == this.datosEmpresa.agencia_empr
          );
          this.codigoUbicacion = filtro;
          // this.codigoUbicacion = data;
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
      if (!data.codProducto) {
        this.send_error("Selecciona el producto a procesar");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var ubicacion = data.codUbicacion ? data.codUbicacion.codigo_ubic : 0;
        var rut = 0;
        var producto = data.codProducto.cod_rep.trim();
        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        var fechaFinal = data.fechaFinal.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          ubicacion +
          "|" +
          producto +
          "|" +
          rut +
          "|" +
          fechaInicial +
          "|" +
          fechaFinal +
          "|";
        post
          .postData({
            url: "Dispensa/dlls/RpKardex1J.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            var data_parse = JSON.parse(JSON.stringify(data));
            this.contenido = data_parse;
          })
          .catch((err) => {
            console.log(err);
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte Kardex");
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
      return `${val.descripcion_rep} - ${val.descriplaboratorio_rep}-Cum:${val.cum_rep}`;
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
          let sel_rut = 1;
          let busqueda_ruts = this.ruts.find((el) => el.value == sel_rut);
          this.form.ruts = busqueda_ruts;
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },

    cargarTablaproductos: function () {
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentoLtJ.dll",
          data: sessionStorage.Sesion + "|" + "9" + "|",
          method: "",
        })
        .then((data) => {
          var data_parse = JSON.parse(JSON.stringify(data));
          this.tablaproductos = data_parse;
        })
        .catch((err) => {
          this.send_error("Error al cargar Productos");
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
