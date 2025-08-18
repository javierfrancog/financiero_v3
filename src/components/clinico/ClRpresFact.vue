<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-view-dashboard-edit</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Resumen de Facturación cl.</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-select
                  :items="[
                    { text: 'Todos los Ruts', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
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
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="2">
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
                    @input="pickeFechaIni = false;"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="2">
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
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                  depressed
                  large
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="2">
  
              <v-btn v-if="prest_servicios.length != 0"
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="prest_servicios.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>
  
            </v-row>
           <v-row class="mb-2">
            <v-divider   color="succes"></v-divider>

          </v-row>

            <v-row v-if="prest_servicios.length != 0">
            </v-row>
            <v-divider color="succes"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="numero"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
              show-expand
            >
              <template v-slot:item.numero="{ item }">
                {{ parseInt(item.numero) }}
              </template>

              <template v-slot:item.identificacion="{ item }">
                {{ parseInt(item.identificacion) }}
              </template>

              <template v-slot:item.estado="{ item }">{{
                item.estado == "1" ? "Anulada" : "Activa"
              }}</template>
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

export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      soloanulados: null,
      pteradicar: null,
      ptedian: null,      
      prest_servicios: [],
      headerCsv: [],
      tablaruts: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      form: {
        ruts: null,
      },

      headers: [
        { text: "Prefijo", align: "center", value: "pref" },
        { text: "Numero", align: "center", value: "numero" },
        { text: "Fecha", align: "left", value: "fecha_Factura" },
        { text: "Cliente", align: "left", value: "Cliente" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Vlr N.Crédito", align: "center", value: "vlrnotacr" },
        { text: "Estado", align: "center", value: "estado" },
        { text: "Fecha Radicado", align: "center", value: "fecharad_factura" },

      ],
      empresa: [],
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      masivo_pdf: {
        data: [],
      },
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      },
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaruts();
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
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
    format_ruts: function (val) {
      return `${val.descripcion_rut}`;
    },

    print_reporte_excel() {
      var data = this.prest_servicios;
      var data_parse = [];

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
         copia.valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;
         copia.vlrnotacr = parseFloat(el.vlrnotacr.replace(/\,/g, "")) || 0;
         copia.vlrcopago = parseFloat(el.vlrcopago.replace(/\,/g, "")) || 0;
         copia.vlrcuotas = parseFloat(el.vlrcuotas.replace(/\,/g, "")) || 0;
        
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Cliente",
          value: "Cliente",
        },
        {
          title: "Prefijo",
          value: "pref",
        },
        {
          title: "Numero",
          value: "numero",
        },
        {
          title: "Fecha Factura",
          value: "fecha_Factura",
          format: "fecha",
        },
        {
          title: "Valor",
          value: "valor",
          format: "money",
          totalsRowFunction: "sum",          
        },
        {
          title: "Vlr Copago",
          value: "vlrcopago",
          format: "money",
          totalsRowFunction: "sum",          
        },
        {
          title: "Vlr Moderadora",
          value: "vlrcuotas",
          format: "money",
          totalsRowFunction: "sum",          
        },

        {
          title: "Vlr Notas Crédito",
          value: "vlrnotacr",
          format: "money",
          totalsRowFunction: "sum",          
        },

        {
          title: "Estado Factura",
          value: "estado",
        },

        {
          title: "Fecha Radicado",
          value: "fecharad_factura",
          format: "fecha",
        },



      ];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      let tipo = this.form.ruts
      let rut = "Todos los Clientes";
      if (tipo === 2){
        rut = this.form.selruts.descripcion_rut
      }
      var header_format = [
        { text: "REPORTE FACTURACION", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Cliente: ${rut}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte facturación",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-FACTURACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },

    consultarServicios() {
      let tipo = this.form.ruts
      let rut = 0;
      if (tipo === 2){
        rut = this.form.selruts.identificacion_rut
      }

         
      let estado_fecha = this._validarFechas();

      this.headerCsv = [
        "Reporte: , Facturacion por paciente," +
          " , Fecha inicial: ," +
          this.fecha_ini +
          ", Fecha final: , " +
          this.fecha_final.replace(/-/g, "/"),
        "",
      ];
        if (estado_fecha) {
          this.loader = true;
          post
            .postData({
              url: "Clinico/dlls/ClRpFact0102J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                rut +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|",
              method: "",
            })
            .then((data) => {
              this.loader = false;
              data.pop();
              this.prest_servicios = data;
            })
            .catch((err) => {
              this.load_contrato = false;
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: err.Mensaje[0].msg,
                estado: true,
              });
            });
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
            text: "Error al cargar información de la empresa",
            estado: true,
          });
        });
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    imprimir_factura(key, pref, fecha_Factura) {
      var $this = this;
      post
        .postData({
          url: "Clinico/dlls/Titcl103R.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "01" +
            "|" +
            pref +
            "|" +
            key +
            "|" +
            fecha_Factura +
            "|",
          method: "POST",
        })
        .then((data) => {
          data = data[0];
          let url_firma =
            "https://server1ts.net/Datos/50001/" +
            sessionStorage.Sesion.substr(0, 15) +
            "/FACT00000090109999.jpg";

          document.getElementsByClassName("imf_firma")[0].src = url_firma;
          Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
            var obj = document.getElementsByClassName(val + "2")[0];
            if (val == "servicios") {
              var pacientes = data[val].dato_paciente;
              var parent = document
                .getElementById("pdf2_body_titcl101")
                .getElementsByTagName("tbody")[0];

              var subtotal = 0,
                subtotal_iva = 0,
                subtotal_total = 0,
                subtotal_descuento = 0;

              pacientes.forEach((el) => {
                var actual_row = parent.rows.length;
                var row = parent.insertRow(actual_row);

                var cell = row.insertCell(0);
                cell.innerHTML = `<br> <b>Paciente :</b> ${el.nombre_paciente} <b>${el.tipo_id} :</b> ${el.id_paciente} <b>Régimen :</b> ${el.regimen_paciente}`;
                cell.colSpan = 6;
                cell.style = "border-bottom: 1px solid;text-align: left;";

                var articulos = el.articulos;
                articulos.forEach((item) => {
                  var actual_row = parent.rows.length;
                  var row = parent.insertRow(actual_row);
                  row
                    .insertCell(0)
                    .appendChild(document.createTextNode(item.codigo));
                  row
                    .insertCell(1)
                    .appendChild(document.createTextNode(item.nombre_servicio));

                  var cell = row.insertCell(2);
                  cell.innerHTML = "<b>" + item.autorizacion + "</b>";

                  row
                    .insertCell(3)
                    .appendChild(document.createTextNode(item.cantidad));
                  row
                    .insertCell(4)
                    .appendChild(document.createTextNode(item.vlr_unit));
                  row
                    .insertCell(5)
                    .appendChild(document.createTextNode(item.subtotal));
                  row
                    .insertCell(6)
                    .appendChild(document.createTextNode(item.vlr_iva));
                  row
                    .insertCell(7)
                    .appendChild(document.createTextNode(item.vlr_total));

                  subtotal += parseFloat(item.subtotal.replace(/\,/g, "")) || 0;
                  subtotal_iva +=
                    parseFloat(item.vlr_iva.replace(/\,/g, "")) || 0;
                  subtotal_total +=
                    parseFloat(item.vlr_total.replace(/\,/g, "")) || 0;
                  subtotal_descuento +=
                    parseFloat(item.vlr_dcto.replace(/\,/g, "")) || 0;
                });
              });

              var subtotal_final = subtotal_total - subtotal_descuento;

              document.getElementsByClassName("subtotal_final")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_final.toString());

              document.getElementsByClassName(
                "factura_subtotal"
              )[0].innerHTML += " " + $this.formatNumero(subtotal.toString());

              document.getElementsByClassName("factura_iva")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_iva.toString());

              document.getElementsByClassName("factura_total")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_total.toString());

              document.getElementsByClassName(
                "factura_descuento"
              )[0].innerHTML +=
                " " + $this.formatNumero(subtotal_descuento.toString());

              var copago_total =
                parseFloat(data.copago.replace(/\,/g, "")) || 0;
              var cuotam_total =
                parseFloat(data.cuotam.replace(/\,/g, "")) || 0;

              var total_final = subtotal_final - copago_total - cuotam_total;

              document.getElementsByClassName("total_final")[0].innerHTML +=
                " " + $this.formatNumero(total_final.toString());

              var letras = numeroALetras(total_final, {
                plural: "",
                singular: "",
                centPlural: "pesos",
                centSingular: "pesos",
              });
              // document.getElementsByClassName("total_final")[0].innerHTML +=
              //   " " + $this.formatNumero(total_final.toString());
              document.getElementsByClassName(
                "valorLetras_impresion"
              )[0].innerHTML += " " + letras;
            } else if (obj) obj.innerHTML += " " + data[val].trim();
          });
          imprimir_pdf2();
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
    downloadPdf: function () {
      var tabla = JSON.parse(JSON.stringify(this.prest_servicios));
      for (var i = 0; i < tabla.length; i++) {
        var parent = document
          .getElementById("download_pdf_body")
          .getElementsByTagName("tbody")[0];
        var actual_row = parent.rows.length;
        var row = parent.insertRow(actual_row);
        var obj = tabla[i];
        row.insertCell(0).appendChild(document.createTextNode(obj.pref));
        row.insertCell(1).appendChild(document.createTextNode(obj.numero));
        row.insertCell(2).appendChild(document.createTextNode(obj.fecha));
        row
          .insertCell(3)
          .appendChild(document.createTextNode(obj.identificacion));
        row
          .insertCell(4)
          .appendChild(document.createTextNode(obj.descrip_paciente));
        row.insertCell(5).appendChild(document.createTextNode(obj.valor));
        row.insertCell(6).appendChild(document.createTextNode(obj.regimen));
        row
          .insertCell(7)
          .appendChild(document.createTextNode(obj.autorizacion));
        row.insertCell(8).appendChild(document.createTextNode(obj.nroprserv));
        row.insertCell(9).appendChild(document.createTextNode(obj.estado));
      }
      let contrato = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });

      document.getElementById("tipo_reporte").innerHTML =
        "Reporte facturacion - " + contrato.descripcion;
      document.getElementById("fecha_ini_reporte").innerHTML =
        "Fecha inicial: " + this.fecha_ini;
      document.getElementById("fecha_fin_reporte").innerHTML =
        "Fecha final: " + this.fecha_final;
      exportPdf();
    },
  },
}
;
</script>
<style lang="sass">
.v-data-table__wrapper td
  line-height: 2!important
</style>