<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-animation-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Resumen Ventas por producto</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                  <v-date-picker v-model="fecha_ini" @input="pickeFechaIni = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
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
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="fecha_final" @input="pickerFechaFinal = false"></v-date-picker>
                </v-menu>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="4">
                <v-switch v-model="anulados" label="Incluir Anulados"></v-switch>
              </v-col>-->
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="red darken-2"
                  class="ma-2 white--text"
                  @click="generar_pdf()"
                  depressed
                  :disabled="contenido.length == 0"
                >
                  Imprimr PDF
                  <v-icon right dark>mdi-pdf-box</v-icon>
                </v-btn>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text"
                  @click="generar_excel()"
                  depressed
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
                <v-btn 
                  color="blue darken-2" 
                  class="ma-2 white--text" 
                  @click="cargarcontenido"
                  depressed
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
              <!--<v-col class="d-flex" cols="12" sm="2" v-if="prest_facturas.length != 0">
                <JsonExcel :data="prest_facturas" type="csv" :title="headerCsv">
                  <v-btn color="success" class="ma-2 white--text">
                    Exportar Excel
                    <v-icon right dark>mdi-file-table-outline</v-icon>
                  </v-btn>
                </JsonExcel>
              </v-col>
              <v-col class="d-flex" cols="12" sm="1" v-if="prest_facturas.length != 0">
                <v-btn color="red" class="ma-2 white--text" @click="downloadPdf()">
                  Pdf
                  <v-icon right dark>mdi-file-pdf-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>-->

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
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo}}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                disabled
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false;init_form()">Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="guardar()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
//import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    //JsonExcel
  },
  data() {
    return {
      agencias: [],
      empresa: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      prest_facturas: [],

      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_rep" },        
        { text: "Codigo", align: "center", value: "codigo_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Cantidad", align: "right", value: "cantidad_rep" },
        { text: "Unitario(incluye Iva)", align: "right", value: "unitario_rep" },
        { text: "Total(incluye Iva)", align: "right", value: "total_rep" }        
      ],
      errores: {
        codigo: false,
        estado: false
      },
      card_estado: false
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaAg();
  },
  computed: {},
  methods: {
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];

      var columnas = [
        {
          title: "Agencia",
          value: "agencia_rep",
        },
        {
          title: "Código",
          value: "codigo_rep",
        },
        {
          title: "Descripción",
          value: "descripcion_rep",
        },
        {
          title: "Cantidad",
          value: "cantidad_rep",
          format: "number",
        },
        {
          title: "Unitario (+IVA)",
          value: "unitario_rep",
          format: "money",
        },
        {
          title: "Total",
          value: "total_rep",
          format: "money",
          totalsRowFunction: "sum"
        },
        {
          title: "Costo",
          value: "costo_rep",
          format: "money",
          totalsRowFunction: "sum"
        },

        {
          title: "Resultado",
          value: "resultado_rep",
          format: "money",
          totalsRowFunction: "sum"
        },
        {
          title: "Margen",
          value: "margen_rep",
        },

      ];

      data.forEach((el)=>{
        data_parse.push({
          agencia_rep: (el.agencia_rep === "")?"":el.agencia_rep.trim(),  
          codigo_rep: (el.codigo_rep === "")?"":el.codigo_rep.trim(),
          descripcion_rep: (el.descripcion_rep === "")?"":el.descripcion_rep.trim().replace(/\ /g, ""),

          cantidad_rep: (el.cantidad_rep === "")?0:parseFloat(el.cantidad_rep.replace(/\ /g, "").replace(/\,/g, "")),
          unitario_rep: (el.unitario_rep === "")?0:parseFloat(el.unitario_rep.replace(/\ /g, "").replace(/\,/g, "")),
          costo_rep: (el.costo_rep === "")?0:parseFloat(el.costo_rep.replace(/\ /g, "").replace(/\,/g, "")),
          resultado_rep: (el.resultado_rep === "")?0:parseFloat(el.resultado_rep.replace(/\ /g, "").replace(/\,/g, "")),
          margen_rep: (el.margen_rep === "")?0:parseFloat(el.margen_rep.replace(/\ /g, "").replace(/\,/g, "")),

          total_rep: (el.total_rep === "")?0:parseFloat(el.total_rep.replace(/\ /g, "").replace(/\,/g, "")),
        });
      });

      data_parse.push({
        agencia_rep: "Empty",  
        pref_rep: "",
        contado_rep: "",
        credito_rep: "",
        iva_rep: "",
        total_rep: "",
      });

      data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        "Resumen Ventas por producto".toUpperCase(),
        `Periodo: ${_this.fecha_ini} / ${_this.fecha_final}`,
        _this.format_agencia(_this.form.punto_fact),
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Resumen VtasXProd",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Res-VentasXProd-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    generar_pdf() {
      var _this = this;
      var contenido = this.contenido;
      var datosTabla = [];
      var totalContado = 0;
      var totalCredito = 0;
      var totalIVA = 0;
      var totalDctos = 0;
      var totalT = 0;

      contenido.forEach((el)=>{
        totalT += (el.total_rep === "")?0:parseFloat(el.total_rep.replace(/\ /g, "").replace(/\,/g, ""));

        datosTabla.push([
          {
            fontSize: 8,
            alignment: "right",
            text: el.agencia_rep.trim(),
          },
          {
            fontSize: 8,
            alignment: "left",
            text: el.codigo_rep.trim(),
          },
          {
            fontSize: 8,
            alignment: "left",
            text: el.descripcion_rep.trim(),
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.cantidad_rep.replace(/\ /g, ""),
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.unitario_rep.replace(/\ /g, ""),
          },
          {
            fontSize: 8,
            alignment: "right",
            text: el.total_rep.replace(/\ /g, ""),
          },
        ]);
      });

      datosTabla.push([
        {},
        {},
        {
          fontSize: 10,
          alignment: "left",
          text: "Total",
        },
        {},
        {},
        {
          fontSize: 9,
          alignment: "right",
          text: this.formatNumero(totalT),
        },
      ]);

      datosTabla.unshift([
        {
          fontSize: 10,
          alignment: "center",
          text: "Agencia",
        },
        {
          fontSize: 10,
          alignment: "center",
          text: "Código",
        },
        {
          fontSize: 10,
          alignment: "center",
          text: "Descripción",
        },
        {
          fontSize: 10,
          alignment: "center",
          text: "Cantidad",
        },
        {
          fontSize: 10,
          alignment: "center",
          text: "Unitario (+IVA)",
        },
        {
          fontSize: 10,
          alignment: "center",
          text: "Total (+IVA)",
        }
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
          //pageOrientation: "landscape",
          pageMargins: [margin.left, 100, margin.right, 60],
          header: function (currentPage, pageCount, pageSize) {
            return [
              {
                margin: [margin.left, 20, margin.right, 0],
                columns: [
                  {
                    width: "20%",
                    margin: [0, 0, 0, 0],
                    alignment: "center",
                    stack: [
                      {
                        image: "logo",
                        fit: [80, 80],
                      },
                    ],
                  },
                  {
                    width: "45%",
                    bold: true,
                    fontSize: 11,
                    stack: [
                      _this.empresa.descrip_empr,
                      `NIT. ${_this.formatNumero(parseInt(_this.empresa.id_empr.replace(/\,/g, "")))}`,
                      `Dir. ${_this.empresa.direccion_empr}`,
                      `Tel. ${parseInt(_this.empresa.telefono_empr)}`,
                      `${_this.empresa.Ciudad} - ${_this.empresa.Departamento}`
                    ],
                  },
                  {
                    width: "35%",
                    bold: true,
                    fontSize: 11,
                    alignment: "center",
                    stack: [
                      "Resumen Ventas por producto".toUpperCase(),
                      `Periodo: ${_this.fecha_ini} / ${_this.fecha_final}`,
                      _this.format_agencia(_this.form.punto_fact),
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
    formatNumero: function(val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: "."
      });

      mask.resolve(val.toString());
      return mask.value;
    },
    format_agencia: function(cod){
      var text = "";
      this.agencias.forEach((el)=>{
        if (el.codigo_agc === cod){
          text = `${el.codigo_agc} - ${el.descripcion_agc}`;
        }
      });
      return text;
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    format_punto_fact: function(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      var estado_fecha = this._validarFechas();
      var agencia = this.form.punto_fact;
      var fechaini = this.fecha_ini.split("-").join("");
      var fechafin = this.fecha_final.split("-").join("");
      this.loader = true;
      post
          .postData({
            url: "ptovta/dlls/RpVtaprodJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia +
              "|" +
              0 +
              "|" +              
              fechaini +
              "|" +
              fechafin +
              "|",
            method: ""
          })
        .then(data => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));          
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
                item.descripcion_rep = nombre64;
              }
              return item;
            });
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ubicaciones",
            estado: true
          });
        });
    },


    cargarTablaAg: function() {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          var filtro = data.filter(el => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch(err => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true
          });
        });
    },

    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true
        });
        retornar = false;
      }
      return retornar;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true
      });
    }
  }
};
</script>
