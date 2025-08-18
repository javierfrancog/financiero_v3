<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2" :loading="card.loader" :disabled="card.disabled">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-golf-cart</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Reporte Propiedades Planta y Equipo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu v-model="pickeFechaIni" :close-on-content-click="false" transition="scale-transition" offset-y
                  max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="form.fechaInicial" label="Fecha Corte" append-icon="event" hide-details
                      outlined v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="form.fechaInicial" @input="pickeFechaIni = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-select :items="tipoubica" label="Ubicación a Procesar" outlined clearable hide-details return-object
                  v-model="form.ubicacion" :disabled="disabledTipoUbicacion" required></v-select>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete label="Ubicación" v-model="form.codUbicacion" :items="codigoUbicacion"
                  :item-text="format_ubicaciones" item-value="codigo_ubic" hide-details return-object outlined
                  :disabled="disabledUbicacion" v-if="this.form.ubicacion === 1 ? false : true">
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-select :items="tipoprod" label="Producto a Procesar" outlined clearable hide-details return-object
                  v-model="form.producto" required></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete label="Producto" v-model="form.codProducto" :items="tablaproductos"
                  :item-text="format_productos" item-value="codigo_pr" hide-details return-object outlined
                  v-if="form.producto.value == 1 ? false : true"></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="justify-end">
              <v-btn color="indigo" class="ml-2 white--text px-12" large depressed @click="cargarcontenido"
                :loading="btnEnvio.loader" :disabled="btnEnvio.disabled">
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
              <v-btn color="success" class="ml-2 white--text px-12" large depressed :disabled="contenido.length == 0"
                @click="generar_excel">
                Generar Excel
              </v-btn>
              <v-btn color="red darken-2" class="ml-2 white--text px-12" large depressed
                :disabled="contenido.length == 0" @click="generar_pdf">
                Imprimir PDF
              </v-btn>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details>
                </v-text-field>
              </v-col>
            </v-row>

            <v-data-table :headers="headers" :items="contenido" item-key="key" :single-expand="singleExpand"
              :search="search">
              <template v-slot:item.codcta_rep="{ item }">
                <label v-if="item.docinter_rep">{{ item.codcta_rep }} - {{ item.descripcta_rep }}</label>
              </template>
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
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
              </template>
              <template v-slot:body.append>
                <td colspan="4" class="text-right">
                  <strong>TOTALES</strong>
                </td>
                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales.cantidad) }}</strong>
                </td>
                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales.valor) }}</strong>
                </td>
                <td></td>
                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales.depremes) }}</strong>
                </td>
                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales.depreacum) }}</strong>
                </td>

                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales.neto) }}</strong>
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
      expanded: [],
      contenido: [],
      tablaruts: [],
      tablaproductos: [],
      codigoUbicacion: [],
      codigoProducto: [],
      tipoubica: [
        { text: 'Todas las Ubicaciones', value: 1 },
        { text: 'Seleccion Unica', value: 2 },
      ],
      tipoprod: [
        { text: 'Todos los Productos', value: 1 },
        { text: 'Seleccion Unica', value: 2 },
      ],
      empresa: {},
      totales: {
        depremes: 0,        
        depreacum: 0,                
        neto: 0,                
        cantidad: 0,
        valor: 0,
      },

      ubica: [],
      search: "",
      form: {
        cuenta: null,
        codUbicacion: null,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
        // ubicacion: null,
        producto: null
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Ubicación", align: "left", value: "ubicacion_rep",class: "indigo--text blue lighten-5" },
        { text: "Id_Producto", align: "left", value: "codprod_rep" ,class: "indigo--text blue lighten-5"},
        { text: "Descripción", align: "left", value: "descripprod_rep",class: "indigo--text blue lighten-5" },
        { text: "Cantidad", align: "center", value: "cant_rep",class: "indigo--text blue lighten-5" },
        { text: "Costo Historico", align: "center", value: "valor_rep",class: "indigo--text blue lighten-5" },
        { text: "Vida Util(Meses)", align: "center", value: "vutil_rep",class: "indigo--text blue lighten-5" },
        { text: "Depreciación Mes", align: "center", value: "dpremes_rep",class: "indigo--text blue lighten-5" },
        { text: "Depreciación Acum", align: "center", value: "dpreacum_rep",class: "indigo--text blue lighten-5" },
        { text: "Valor Neto", align: "center", value: "saldo_rep",class: "indigo--text blue lighten-5" },                
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
      disabledUbicacion: false,
      disabledTipoUbicacion: false

    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaubica();
    this.cargarTablaruts();
    this.cargarTablaproductos();
  },
  methods: {
    infoEmpresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          console.log("xx",this.form.ubicacion)

        });
    },
    generar_pdf() {
      var _this = this;
      var contenido = this.contenido;
      var fecha = this.form.fechaInicial;
      var datosTabla = [];
      var totalCant = 0;
      var totalMes = 0;      
      var totalAcum = 0;      
      var totalSaldo = 0;      
      var totalValor = 0;


      contenido.forEach((el) => {
        totalCant +=
          parseFloat(
            el.cant_rep === undefined
              ? 0
              : el.cant_rep.replace(/\ /g, "").replace(/\,/g, "")
          ) || 0;
        totalValor +=
          parseFloat(
            el.valor_rep === undefined
              ? 0
              : el.valor_rep.replace(/\ /g, "").replace(/\,/g, "")
          ) || 0;
        totalMes +=
          parseFloat(
            el.dpremes_rep === undefined
              ? 0
              : el.dpremes_rep.replace(/\ /g, "").replace(/\,/g, "")
          ) || 0;    
        totalAcum +=
          parseFloat(
            el.dpreacum_rep === undefined
              ? 0
              : el.dpreacum_rep.replace(/\ /g, "").replace(/\,/g, "")
          ) || 0;    
        totalSaldo +=
          parseFloat(
            el.saldo_rep === undefined
              ? 0
              : el.saldo_rep.replace(/\ /g, "").replace(/\,/g, "")
          ) || 0;    
          
          
        datosTabla.push([
          {
            fontSize: 8,
            alignment: "left",
            text: el.codprod_rep.trim(),
          },
          {
            fontSize: 8,
            alignment: "left",
            text: el.ubicacion_rep,
          },
          {
            fontSize: 8,
            alignment: "left",
            text: el.descripprod_rep.trim(),
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.cant_rep === undefined ? 0 : el.cant_rep,
          },

          {
            fontSize: 8,
            alignment: "center",
            text: el.vutil_rep === undefined ? 0 : el.vutil_rep,
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.valor_rep || 0,
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.dpremes_rep === undefined ? 0 : el.dpremes_rep,
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.dpreacum_rep || 0,
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.saldo_rep || 0,
          },

        ]);
      });

      datosTabla.push([
        {},
        {},
        {
          bold: true,
          fontSize: 10,
          alignment: "center",
          text: "Totales".toUpperCase(),
        },
        {
          bold: true,          
          fontSize: 10,
          alignment: "right",
          text: _this.formatNumero(totalCant),
        },
        {},        
        {
          bold: true,          
          fontSize: 10,
          alignment: "right",
          text: _this.formatNumero(totalValor),
        },
        {
          bold: true,          
          fontSize: 10,
          alignment: "right",
          text: _this.formatNumero(totalMes),
        },
        {
          bold: true,          
          fontSize: 10,
          alignment: "right",
          text: _this.formatNumero(totalAcum),
        },
        {
          bold: true,          
          fontSize: 10,
          alignment: "right",
          text: _this.formatNumero(totalSaldo),
        },

      ]);

      datosTabla.unshift([
        {
          fontSize: 10,
          text: "Id Producto",
        },
        {
          fontSize: 10,
          text: "Ubicación",
        },
        {
          fontSize: 10,
          text: "Descripción Producto",
        },
        {
          fontSize: 10,
          text: "Cantidad Saldo",
        },
        {
          fontSize: 10,
          text: "Vida Util",
        },
        {
          fontSize: 10,
          text: "Costo Historico",
        },
        {
          fontSize: 10,
          text: "Depreciación Mes",
          alignment: "center",
        },
        {
          fontSize: 10,
          text: "Depreciación Acumulada",
        },
        {
          fontSize: 10,          
          text: "Neto",
        },
      ]);

      var margin = {
        left: 40,
        right: 40,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        var dd = {
          pageOrientation: "landscape",
          pageMargins: [margin.left, 100, margin.right, 60],
          header: function (currentPage, pageCount, pageSize) {
            return [
              {
                margin: [margin.left, 40, margin.right, 0],
                columns: [
                  {
                    width: "25%",
                    margin: [0, -10, 0, 0],
                    alignment: "center",
                    stack: [
                      {
                        image: "logo",
                        fit: [80, 80],
                      },
                    ],
                  },
                  {
                    width: "40%",
                    bold: true,
                    fontSize: 12,
                    stack: [
                      `${_this.empresa.descrip_empr.trim()}`,
                      `NIT. ${_this.formatNumero(
                        parseInt(_this.empresa.id_empr)
                      )}`,
                    ],
                  },
                  {
                    width: "35%",
                    bold: true,
                    fontSize: 12,
                    alignment: "left",
                    stack: [
                      "Reporte Saldo Propiedades, Planta y Equipos".toUpperCase(),
                      "Fecha corte: " + _this.form.fechaInicial,
                      "Ubicación: " + (_this.form.ubicacion === 1)
                        ? "Todas las Ubicaciones"
                        : _this.form.codUbicacion.codigo_ubic +
                        " - " +
                        _this.form.codUbicacion.descrip_ubic,
                    ],
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                canvas: [
                  {
                    type: "line",
                    x1: margin.left,
                    x2: pageSize.width - margin.right,
                    y1: 0,
                    y2: 0,
                    lineWidth: 2,
                  },
                ],
              },
            ];
          },
          content: [
            {
              table: {
                headerRows: 1,
                widths: [
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",                                    
                  "auto",
                ],
                body: datosTabla,
              },
              layout: "lightHorizontalLines",
            },
          ],
          styles: {},
          images: {
            logo: logo,
          },
        };

        pdfMake.createPdf(dd).open();
      });
    },
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var ubicacion =
        this.form.ubicacion == 1
          ? "Todas las Ubicaciones"
          : this.form.codUbicacion.codigo_ubic +
          " - " +
          this.form.codUbicacion.descrip_ubic;
      var data_parse = [];
      var columnas = [
        {
          title: "Id Producto",
          value: "codprod_rep",
        },
        {
          title: "Ubicación",
          value: "ubicacion_rep",
        },
        {
          title: "Clasificación",
          value: "clasifica_rep",
        },
        {
          title: "Descripción Producto",
          value: "descripprod_rep",
        },
        {
          title: "Cantidad Saldo",
          value: "cant_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Vida Util",
          value: "vutil_rep",
        },
        {
          title: "Valor Saldo",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Depreciacion Mes",
          value: "dpremes_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Depreciacion Acumulada",
          value: "dpreacum_rep",
          format: "number",
          totalsRowFunction: "sum",
        },
        {
          title: "Neto",
          value: "saldo_rep",
          format: "number",
          totalsRowFunction: "sum",
        },

      ];

      data.forEach((el) => {
        data_parse.push({
          codprod_rep: el.codprod_rep.trim(),
          ubicacion_rep: el.ubicacion_rep,
          clasifica_rep: el.clasifica_rep,
          descripprod_rep: el.descripprod_rep,
          cant_rep: el.cant_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
          vutil_rep: el.vutil_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,          
          valor_rep: el.valor_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
          saldo_rep: el.saldo_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,          
          dpremes_rep: el.dpremes_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,                    
          dpreacum_rep: el.dpreacum_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,                    
        });
      });

      // data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        "Reporte PPE".toUpperCase(),
        "Fecha Corte: " + this.form.fechaInicial,
        "Ubicación: " + ubicacion,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Propiedad, planta y Equipo",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `PPEQUIPOS-${new Date().getTime()}`,
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
          this.form.ubicacion = 1;
          this.form.producto = 1;
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
        var producto = 0;
        console.log(data)
        if (data.producto == 2) {
          producto = data.codProducto ? data.codProducto.codigo_pr : 0
        }
        var ubicacion = data.codUbicacion ? data.codUbicacion.codigo_ubic : 0;
        var fechaInicial = data.fechaInicial.replace(/\-/g, "");
        var datosEnvio =
          sesion + "|" + ubicacion + "|" + producto + "|" + fechaInicial + "|";
        post
          .postData({
            url: "Ptovta/dlls/RpSaldos2J.DLL",
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
            this.totales.depremes = 0;
            this.totales.depreacum = 0;
            this.totales.neto = 0;
            let acumcantidad = 0;
            let acumvalor = 0;
            let acumdpremes = 0;
            let acumdpreacum = 0;
            let acumneto = 0;

            json.forEach((element, index) => {
              json[index].key = index;
            });
            this.contenido = json;
            let nombre64 = " ";
            let detalles = this.contenido.map((item) => {
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
            data.forEach((item) => {
              let tcantidad =
                parseFloat(item.cant_rep.replace(/\,/g, "")) || 0;
              let tvalor =
                parseFloat(item.valor_rep.replace(/\,/g, "")) || 0;
              let tdepremes =
                parseFloat(item.dpremes_rep.replace(/\,/g, "")) || 0;
              let tdpreacum =
                parseFloat(item.dpreacum_rep.replace(/\,/g, "")) || 0;
              let tsaldo =
                parseFloat(item.saldo_rep.replace(/\,/g, "")) || 0;

              acumcantidad += tcantidad;
              acumvalor += tvalor;
              acumdpremes += tdepremes;
              acumdpreacum += tdpreacum;
              acumneto += tsaldo;

              this.totales.cantidad = acumcantidad;
              this.totales.valor = acumvalor;
              this.totales.depremes = acumdpremes;
              this.totales.depreacum = acumdpreacum;
              this.totales.neto = acumneto;                                          
            });
          })
          .catch((err) => {
            console.log(err)
            this.btnEnvio.loader = false;
            this.btnEnvio.disabled = false;
            this.send_error("Error al cargar el reporte");
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
          this.send_error("Error al cargar Ruts");
        });
    },

    cargarTablaproductos: function () {
      post
        .postData({
          url: "PtoVta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaproductos = data;
          let nombre64 = " ";
          let detalles = this.tablaproductos.map((item) => {
            nombre64 = window.atob(
              item.base1_pr.trim() +
              item.base2_pr.trim() +
              item.base3_pr.trim() +
              item.base4_pr.trim() +
              item.base5_pr.trim()
            );
            if (nombre64) {
              item.descripcion_pr = nombre64;
            }
            return item;
          });
        })
        .catch((err) => {
          console.log(err);
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
