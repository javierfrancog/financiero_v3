<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-order-numeric-descending</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Comision por Recaudos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Asesor Comercial"
                  v-model="form.asesor"
                  :items="asesor"
                  :item-text="format_asesor"
                  item-value="idases"
                  outlined
                  clearable
                  return-object
                  hide-details
                  :error="errores.asesor"
                  @change="errores.asesor = false, clear_tabla()"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
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
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                    @change="fecha_destino()"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="3">
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
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
            <v-col class="d-flex" cols="4">
              <v-switch v-model="val_unidad" label="Comision por unidad"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch v-model="val_cart" label="Validar Cartera"></v-switch>
            </v-col>
          </v-row>
            <v-row> </v-row>

            <v-row class="mt-0 pa-0">
              <v-col class="d-flex" cols="12" sm="3">
                <!-- <v-btn
                  color="red darken-2"
                  class="ma-2 white--text"
                  @click="generar_pdf()"
                  depressed
                  :disabled="contenido.length == 0"
                >
                  Imprimir PDF
                  <v-icon right dark>mdi-pdf-box</v-icon>
                </v-btn> -->
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
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargarcontenido"
                  depressed
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
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

              <template v-slot:body.append>
                <td colspan="8" class="text-right">
                  <strong>TOTAL</strong>
                </td>
                <td class="text-xs-right text-center">

                </td>

                <td class="text-xs-right text-center">
                  <strong>{{ formatNumero(totales) }}</strong>
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
//import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    //JsonExcel
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
      val_cart: true,
      val_unidad: false,
      totales : 0,

      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      empresa: [],
      search: "",
      form: {},
      asesor: null,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Factura", align: "center", value: "factura_rep" },
        { text: "Fecha Factura", align: "center", value: "fecha_rep" },
        { text: "Cliente", align: "left", value: "descripcion_rep" },
        { text: "Fecha Recaudo", align: "center", value: "fechapago_rep" },
        // { text: "Valor Recaudo", align: "center", value: "vlrrecaudo_rep" },

        { text: "Dias_Recaudo", align: "center", value: "dias_rep" },
        { text: "Producto", align: "left", value: "producto_rep" },
        { text: "Cant.Base", align: "center", value: "cantconv_rep" },
        { text: "Comision x Unid", align: "center", value: "vlrunitcom_rep" },
        { text: "Vlr_Comisión", align: "center", value: "vlrcomision_rep" },
      ],
      errores: {
        codigo: false,
        asesor: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaasesor();
  },
  computed: {},
  methods: {
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];
      // data.pop();      
      let asesor = this.form.asesor.descripases;
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
          copia.factura_rep = parseFloat(el.factura_rep.replace(/\,/g, "")) || 0;        
          copia.cantconv_rep = parseFloat(el.cantconv_rep.replace(/\,/g, "")) || 0;
          copia.vlrunitcom_rep = parseFloat(el.vlrunitcom_rep.replace(/\,/g, "")) || 0;
          copia.vlrcomision_rep = parseFloat(el.vlrcomision_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) || 0;
          copia.efectivo_rep = parseFloat(el.efectivo_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) || 0;          
          copia.bancos_rep = parseFloat(el.bancos_rep.replace(/\,/g, "").replace(/\s\s+/g, "")) || 0;                    
        data_parse.push(copia);
      });
      // data_parse.pop();      
      var columnas = [
        {
          title: "Factura",
          value: "factura_rep",
        },
        {
          title: "Fecha Factura",
          value: "fecha_rep",
          format: "fecha",
        },
        {
          title: "Cliente",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Fecha Recaudo",
          value: "fechapago_rep",
          format: "fecha",          
        },
        {
          title: "Dias Recaudo",
          value: "dias_rep",
        },
        {
          title: "Clasificación",
          value: "clasifica_rep",
          format: "string",
        },

        {
          title: "Producto",
          value: "producto_rep",
          format: "string",
        },
        {
          title: "Cantidad",
          value: "cantconv_rep",
        },

        {
          title: "Base Comisión",
          value: "vlrunitcom_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Comision",
          value: "vlrcomision_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Rec.Efectivo",
          value: "efectivo_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Rec.Bancos",
          value: "bancos_rep",
          format: "money",
          totalsRowFunction: "sum",
        },


      ];

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        "Comisiones por Recaudo".toUpperCase(),
        "Asesor:" + asesor,
        "Fecha Corte: " + this.fecha_ini,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Comisiones por Recaudo",
            header: header,
            logo,
            tabla: {
              columnas: columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Com-Recaudos-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarTablaasesor: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAsesorJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.asesor = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    format_asesor(val) {
      return `${val.idases} - ${val.descripases}`;
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
    format_agencia: function (cod) {
      var text = "";
      this.agencias.forEach((el) => {
        if (el.codigo_agc === cod) {
          text = `${el.codigo_agc} - ${el.descripcion_agc}`;
        }
      });
      return text;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      var estado_fecha = this._validarFechas();
      var asesor = this.form.asesor.idases;
      var fechaini = this.fecha_ini.split("-").join("");
      var fechafin = this.fecha_final.split("-").join("");
      let val_cart = this.val_cart ? 1 : 0;
      let val_unidad = this.val_unidad? 1 : 0;
      this.totales = 0;      
      let g_total = 0;
      let dll = "ptovta/dlls/RpComcartJ.dll";      
      if (this.empresa.id_empr == "000000800223811"){
         dll = "ptovta/dlls/RpComcartYJ.dll";
      }
     

      // if (val_cart === 1) {
      //   dll = "ptovta/dlls/RpComcartJ.dll";
      // }

      this.loader = true;
      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion +
            "|" +
            asesor +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            val_cart +
            "|" +
            val_unidad +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));

          let producto = this.contenido.map((item) => {
            let total =
                parseFloat(item.vlrcomision_rep.replace(/\,/g, "")) || 0;

            g_total += total;                

           { try {if (atob(item.producto_rep)){
            item.producto_rep = atob(item.producto_rep)
           }}           
              catch (e) 
               { return false; }}
          });
          this.totales = g_total;                
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Comisiones",
            estado: true,
          });
        });
    },

    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    fecha_destino(){
      let fecha = this.fecha_ini;
      let año = fecha.substring(0, 4);
      let mes = fecha.substring(5, 7);
      let dia = fecha.substring(8, 10);
      dia = parseFloat(dia);      
      mes = (parseFloat(mes) + 1).toString().padStart(2, "0")
      if (dia > 1 ){
        dia = (dia - 1).toString().padStart(2, "0")
      }
      dia = dia.toString().padStart(2, "0");     

      fecha = año.concat(mes, dia);

      let f_final = año.concat("-", (mes), "-", dia);
      this.fecha_final = f_final;
      this.pickeFechaIni = false;

    },    
    clear_tabla(){
    this.contenido = [];
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
