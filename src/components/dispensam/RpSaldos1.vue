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
                >mdi-clipboard-list-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Saldo Mercancías
              </v-list-item-title>
            </v-list-item-content>
            <!-- <v-switch
              v-model="form.fisico"
              @change="change_fisico()"
              hide-details
              label="Conteo Fisico"
            ></v-switch> -->
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
                      label="Fecha Corte"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="tipoubica"
                  label="Ubicación a Procesar"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.ubicacion"
                  :disabled="disabledTipoUbicacion"
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
                  clearable
                  outlined
                  :error="errores.codUbicacion"
                  @change="errores.codUbicacion = false"
                  :disabled="disabledUbicacion"
                  v-if="form.ubicacion.value == 1 ? false : true"
                >
                </v-autocomplete>
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
                  :error="errores.codProducto"
                  @change="errores.codProducto = false"
                  v-if="form.producto.value == 1 ? false : true"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Tipo Vencimiento"
                  :items="tipovence"
                  outlined
                  clearable
                  persistent-hint
                  required
                  v-model="form.tipovence"
                  :error="errores.tipovence"
                  @change="errores.tipovence = false"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Numero conteo"
                  :items="conteo"
                  outlined
                  clearable
                  persistent-hint
                  required
                  v-model="form.conteo"
                  v-if = "this.select_conteo"
                  :error="errores.conteo"

                  @change="errores.conteo = false"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="justify-end">
              <v-btn
                color="blue darken-2"
                class="ml-2 white--text px-12"
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
                color="success"
                class="ml-2 white--text px-12"
                large
                depressed
                :disabled="contenido.length == 0"
                @click="generar_excel"
              >
                Generar Excel
              </v-btn>
              <v-btn
                color="red darken-2"
                class="ml-2 white--text px-12"
                large
                depressed
                v-show="bloquea_rec"
                @click="recalcular_sdo"
              >
                Recalcular
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
                >
                </v-text-field>
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
              <template v-slot:item.vence_rep="{ item }">
                <p
                  :style="{ backgroundColor: item.color_rep }"
                  style="color: white"
                >
                  {{ item.vence_rep }}
                </p>
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Fecha compra</b>
                        </td>
                        <td>{{ item.fcompra_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Valor compra</b>
                        </td>
                        <td>{{ item.vlrcompra_rep }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            color="green"
                            fab
                            x-large
                            icon
                            class="ma-2 white--text px-12"
                            depressed
                            @click="verfactura(item)"
                          >
                            <span>Ver Factura</span>
                          </v-btn>
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
              <template v-slot:body.append>
                <td colspan="6" class="text-right">
                  <strong>TOTAL</strong>
                </td>
                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales.cantidad) }}</strong>
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
      loader: false,
      singleExpand: true,
      bloquea_rec: false,
      select_conteo: false,
      expanded: [],
      contenido: [],
      tablaruts: [],
      tablaproductos: [],
      codigoUbicacion: [],
      codigoProducto: [],
      tipoubica: [
        { text: "Todas las Ubicaciones", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],
      tipoprod: [
        { text: "Todos los Productos", value: 1 },
        { text: "Seleccion Unica", value: 2 },
      ],
      tipovence: [
        { text: "Todos", value: 1 },
        { text: "Vigentes", value: 2 },
        { text: "Por Vencer", value: 3 },
        { text: "Vencidos", value: 4 },
      ],
      conteo: [
        { text: "Primer Conteo", value: 1 },
        { text: "Segundo Conteo", value: 2 },
        { text: "Tercer Conteo", value: 3 },
      ],

      empresa: {},
      totales: {
        cantidad: 0,
        valor: 0,
      },

      ubica: [],
      search: "",
      form: {
        codUbicacion: "",
        ubicacion: "",
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
        producto: "",
      },
      headers: [
        { text: "", value: "data-table-expand" },

        { text: "Ubicación", align: "left", value: "ubicacion_rep" },
        { text: "Descripción", align: "left", value: "descripprod_rep" },
        { text: "Lote", align: "center", value: "lote_rep" },
        { text: "Laboratorio", align: "center", value: "laboratorio_rep" },
        { text: "Cum", align: "center", value: "cum_rep" },

        { text: "Cantidad", align: "center", value: "cant_rep" },
        { text: "Vence", align: "center", value: "vence_rep", width: "130px" },
        { text: "Proveedor", align: "center", value: "proveedor_rep" },
        // { text: "Codigo", align: "center", value: "codprod_rep" },
        // { text: "Valor", align: "center", value: "valor_rep" },
        // { text: "Prom_Unit.", align: "center", value: "promed_rep" },
        // { text: "Id_Producto", align: "left", value: "codprod_rep" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        tipovence: false,
        codProducto: false,
        codUbicacion: false,
        conteo: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      disabledUbicacion: false,
      disabledTipoUbicacion: false,
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaubica();
    this.cargarTablaruts();
    this.cargarTablaproductos();
  },
  methods: {
    verfactura(item) {
      let cufe = item.cufe_rep.trim();
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          let ubicaperfil_empr = this.empresa.ubicaperfil_empr;
          let busqueda_tipo = this.tipoubica.find((el) => el.value == 2);
          this.form.ubicacion = busqueda_tipo;
          busqueda_tipo = this.tipoprod.find((el) => el.value == 2);
          this.form.producto = busqueda_tipo;

          let idus = sessionStorage.Sesion.substr(15, 15);
          console.log(idus);

          if (idus == "000001121890607" || idus == "000000086007243") {
            this.bloquea_rec = true;
          }
        });
    },
    // change_fisico() {
    //   if (this.form.fisico == true) {
    //     this.select_conteo = true;
    //   } else {
    //     this.select_conteo = false;
    //     this.fom.conteo = null;
    //   }
    // },
    recalcular_sdo() {
      var data = this.form;
      this.contenido = [];
      var sesion = sessionStorage.Sesion;
      let producto = 0;
      let tipoproducto = this.form.codProducto.cod_rep;
      let tipoubica = this.form.ubicacion.value;

      if (tipoproducto == 0 && tipoubica == 1) {
        this.errores.codProducto = true;
        this.send_error(
          "Debe debe seleccionar un producto diferente a ´Todos´!"
        );
      } else if (tipoubica == 2 && !this.form.codUbicacion) {
        this.errores.codUbicacion = true;
        this.send_error("Debe debe seleccionar una ubicacion!");
      } else if (!this.form.codProducto) {
        this.errores.codProducto = true;
        this.send_error("Debe debe seleccionar un Producto!");
      } else if (!this.form.tipovence) {
        this.errores.tipovence = true;
        this.send_error("Debe debe seleccionar un tipo de vencimiento!");
      } else {
        var ubicacion = 0;
        producto = data.codProducto.cod_rep.trim();

        if (data.codUbicacion) {
          ubicacion = data.codUbicacion ? data.codUbicacion.codigo_ubic : 0;
        }

        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        let fisico = this.form.fisico ? "1" : "0";
        let tipovence = this.form.tipovence;

        var datosEnvio =
          sesion + "|" + fechaInicial + "|" + producto + "|" + ubicacion + "|";
        post
          .postData({
            url: "Dispensa/dlls/PrRecSaldo.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
          })
          .catch((err) => {
            console.log(err);
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte");
          });
      }
    },
    cargarcontenido() {
      var data = this.form;
      console.log(data);
      this.contenido = [];
      var sesion = sessionStorage.Sesion;
      let producto = 0;
      let tipoproducto = this.form.codProducto.codigo_rep;
      let tipoubica = this.form.ubicacion.value;
      let fisico = this.form.fisico ? "1" : "0";

      if (tipoproducto == 0 && tipoubica == 1) {
        this.errores.codProducto = true;
        this.send_error(
          "Debe debe seleccionar un producto diferente a ´Todos´!"
        );
      } else if (tipoubica == 2 && !this.form.codUbicacion) {
        this.errores.codUbicacion = true;
        this.send_error("Debe debe seleccionar una ubicacion!");
      } else if (!this.form.codProducto) {
        this.errores.codProducto = true;
        this.send_error("Debe debe seleccionar un Producto!");
      } else if (!this.form.tipovence) {
        this.errores.tipovence = true;
        this.send_error("Debe debe seleccionar un tipo de vencimiento!");
      } else if (fisico == 1 && !this.form.conteo) {
        this.errores.conteo = true;
        this.send_error("Debe debe seleccionar un numero de conteo!");
      } else {
        var ubicacion = 0;
        producto = data.codProducto.codigo_rep.trim();

        if (data.codUbicacion) {
          ubicacion = data.codUbicacion ? data.codUbicacion.codigo_ubic : 0;
        }

        this.btnEnvio.loader = true;
        this.btnEnvio.disabled = true;

        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        
        let tipovence = this.form.tipovence;
        let url_envio = "Dispensa/dlls/RpSaldos5J.DLL";
        let conteo = this.form.conteo? this.form.conteo : 0

        if (fisico == 1) {
          url_envio = "Dispensa/dlls/RpSaldoFisJ.DLL";
        }

        var datosEnvio =
          sesion +
          "|" +
          ubicacion +
          "|" +
          producto +
          "|" +
          fechaInicial +
          "|" +
          conteo +
          "|" +
          tipovence +
          "|";
        post
          .postData({
            url: url_envio,
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            var json = JSON.parse(JSON.stringify(data));

            this.totales.cantidad = 0;
            this.totales.valor = 0;
            let acumcantidad = 0;
            let acumvalor = 0;

            json.forEach((element, index) => {
              json[index].key = index;
            });
            this.contenido = json;

            data.forEach((item) => {
              let tcantidad = parseFloat(item.cant_rep.replace(/\,/g, "")) || 0;
              let tvalor = parseFloat(item.valor_rep.replace(/\,/g, "")) || 0;

              acumcantidad += tcantidad;
              acumvalor += tvalor;
              this.totales.cantidad = acumcantidad;
              this.totales.valor = acumvalor;
            });
          })
          .catch((err) => {
            console.log(err);
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte");
          });
      }
    },
    cargarTablaubica() {
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
    cargarTablaruts() {
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
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ubicaciones: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    cargarTablaproductos: function () {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",

          // url: "Dispensa/dlls/CfMedicamentosJ.dll",
          // data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaproductos = data;
          this.tablaproductos.unshift({
            codigo_rep: "0",
            descripcion_rep: "Todos",
          });
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          this.send_error("Error al cargar Productos");
        });
    },
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];
      var columnas = [
        {
          title: "Ubicación",
          value: "ubicacion_rep",
        },
        {
          title: "Descripción Producto",
          value: "descripprod_rep",
        },
        {
          title: "Lote",
          value: "lote_rep",
          format: "string",
        },
        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Laboratorio",
          value: "laboratorio_rep",
          format: "string",
        },
        {
          title: "Cantidad Saldo",
          value: "cant_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vence",
          value: "vence_rep",
          format: "string",
        },
      ];

      data.forEach((el) => {
        data_parse.push({
          codprod_rep: el.codprod_rep.trim(),
          ubicacion_rep: el.ubicacion_rep,
          clasifica_rep: el.clasifica_rep,
          lote_rep: el.lote_rep,
          cum_rep: el.cum_rep,
          laboratorio_rep: el.laboratorio_rep,
          vence_rep: el.vence_rep,
          descripprod_rep: el.descripprod_rep,
          cant_rep: el.cant_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
          // cant_rep: el.cant_rep === undefined ? 0 : el.cant_rep,

          valor_rep: el.valor_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
          promed_rep:
            el.promed_rep === undefined
              ? 0
              : el.promed_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
        });
      });
      // data_parse.pop();
      let conteo = this.form.conteo? " CONTEO FISICO: " + this.form.conteo: "" 
      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        "Reporte Saldo Inventarios".toUpperCase() + conteo,
        "Fecha Corte: " + this.form.fechaInicial,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Saldos de Inventarios",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `SALDO_INVENTARIO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    format_productos: function (val) {
      return `${val.descripcion_rep}`;
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
