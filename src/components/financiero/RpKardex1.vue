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

              <v-col class="d-flex" cols="3">
                <v-select
                  :items="ubicaciones"
                  label="Ubicación a Procesar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ubicacion"
                  required
                  return-object
                ></v-select>
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
                  v-if="form.ubicacion && form.ubicacion.value == 2"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="tipo_producto"
                  label="Producto a Procesar"
                  outlined
                  clearable
                  hide-details
                  @change="form.codProducto = null"
                  v-model="form.producto"
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Producto"
                  v-model="form.codProducto"
                  :items="tablaproductos"
                  :item-text="format_productos"
                  item-value="codigo_pr"
                  hide-details
                  clearable
                  return-object
                  outlined
                  v-if="
                    form.producto ? (form.producto == 1 ? false : true) : true
                  "
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="ruts"
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
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  outlined
                  v-if="
                    form.ruts ? (form.ruts.value == 1 ? false : true) : true
                  "
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
      datosEmpresa: [],
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
          text: "Nombre",
          align: "left",
          value: "descriprut_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Tipo_Op",
          align: "left",
          value: "docabrev_rep",
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
          text: "Vlr_Entrada",
          align: "center",
          value: "vlr_ent_rep",
          class: "green--text blue lighten-5",
        },
        {
          text: "Cant_Salida",
          align: "right",
          value: "cant_sal_rep",
          class: "red--text blue lighten-5",
        },
        {
          text: "Vlr_Salida",
          align: "center",
          value: "vlr_sal_rep",
          class: "red--text blue lighten-5",
        },
        {
          text: "Cant_Saldo",
          align: "center",
          value: "cant_saldo_rep",
          class: "orange--text blue lighten-5",
        },
        {
          text: "Vlr_Saldo",
          align: "center",
          value: "vlr_saldo_rep",
          class: "orange--text blue lighten-5",
        },
        {
          text: "Prom_Unit.",
          align: "center",
          value: "promed_rep",
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
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaubica();
    this.cargarTablaruts();
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
          this.datosEmpresa = data[0];
          this.cargarTablaproductos();
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
      // data_parse.pop();

      var columnas = [
        {
          title: "Id_Producto",
          value: "codprod_rep",
          format: "string",
        },
        {
          title: "Ubicación",
          value: "ubicacion_rep",
        },
        {
          title: "Clasificación",
          value: "descrip_clasif_pr",
        },
        {
          title: "Descripción Producto",
          value: "descripprod_rep",
          format: "string",
        },
        {
          title: "Descripcion",
          value: "descriprut_rep",
        },
        {
          title: "Tipo_Operación",
          value: "docabrev_rep",
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
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cant. Saldo",
          value: "cant_saldo_rep",
        },
        {
          title: "Valor Saldo",
          value: "vlr_saldo_rep",
          format: "money",
        },
        {
          title: "Promedio",
          value: "promed_rep",
          format: "money",
        },
        {
          title: "Registro",
          value: "registro_rep",
          format: "string",
        },
      ];

      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var ubicacion =
        this.form.ubicacion.value == 1
          ? this.form.ubicacion.text
          : this.form.codUbicacion.descrip_ubic;

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

          let sel_ubica = 1;
          let busqueda_ubica = this.ubicaciones.find(
            (el) => el.value == sel_ubica
          );
          this.form.ubicacion = busqueda_ubica;

          let sel_producto = 1;
          let busqueda_producto = this.tipo_producto.find((el) => el.value == sel_producto);
          this.form.producto = busqueda_producto;

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

      if (!data.producto) {
        this.send_error("Selecciona el producto a procesar");
      } else {
        this.contenido = [];
        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var sesion = sessionStorage.Sesion;
        var producto = data.codProducto ? data.codProducto.codigo_pr : 0;

        var ubicacion = data.codUbicacion ? data.codUbicacion.codigo_ubic : 0;
        var rut = data.selruts ? data.selruts.identificacion_rut : 0;
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
            url: "Ptovta/dlls/RpKardex1J.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            var data_parse = JSON.parse(JSON.stringify(data));
            let nombre64 = " ";
            let detalles = data_parse.map((item) => {
              nombre64 = window.atob(
                item.base1_pr +
                  item.base2_pr +
                  item.base3_pr +
                  item.base4_pr +
                  item.base5_pr
              );
              if (nombre64) {
                item.descripprod_rep = nombre64;
              }
              return item;
            });
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
      return `${val.codigo_pr} - ${val.descripcion_completa}`;
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
      let ciudad = this.datosEmpresa.codciudad_empr;
      let id = this.datosEmpresa.id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/PRODUCTOS.JSON";
      post
        .postData({
          url: ruta,
          data: "",
          method: "GET",
          // url: "Ptovta/dlls/CfProductosJ.dll",
          // data: sessionStorage.Sesion + "|" + "0" + "|",
          // method: "",
        })
        .then((data) => {
          // var data_parse = JSON.parse(JSON.stringify(data));
          var data_parse = data.productos;        
          data_parse.pop();
  
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              //   prueba =
              //   el.base1_pr.trim() +
              //       el.base2_pr.trim() +
              //       el.base3_pr.trim() +
              //       el.base4_pr.trim() +
              //       el.base5_pr.trim() +
              //       el.base6_pr.trim() +
              //       el.base6a_pr.trim() +
              //       el.base7_pr.trim() +
              //       el.base8_pr.trim() +
              //       el.base9_pr.trim() +
              //       el.base10_pr.trim()
              //  console.log(el.codigo_pr,prueba)

              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base6a_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.tablaproductos = data_parse;
        })
        .catch((err) => {
          console.log(err)
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
