<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-arrow-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Reporte Resolución 256</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
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

              <v-col class="d-flex" cols="12" sm="3">
                <v-btn color="indigo" class="ma-2 white--text" @click="consultarServicios">
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2" v-if="prest_servicios.length != 0">
                <JsonExcel :data="prest_servicios" type="csv" :title="headerCsv">
                  <v-btn color="success" class="ma-2 white--text">
                    Exportar Excel
                    <v-icon right dark>mdi-file-table-outline</v-icon>
                  </v-btn>
                </JsonExcel>
              </v-col>
              <!-- <v-col class="d-flex" cols="12" sm="1" v-if="prest_servicios.length != 0">
                <v-btn color="red" class="ma-2 white--text" @click="downloadPdf()">
                  Pdf
                  <v-icon right dark>mdi-file-pdf-outline</v-icon>
                </v-btn>
              </v-col> -->
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters v-if="prest_servicios.length != 0">
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
              item-key="nro"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>

      <div id="downloadPdf">
        <div id="cargando_pdf">
          <h3>Cargando impresión...</h3>
        </div>
        <table id="download_pdf_header">
          <thead>
            <tr>
              <th>
                <img class="logo" src="https://server1ts.net/datos/image/clientes/901099286.png" />
              </th>
              <th>
                <a id="tipo_reporte"></a>
              </th>
              <th>
                <a id="fecha_ini_reporte"></a>
                <br />
                <a id="fecha_fin_reporte"></a>
                <br />
              </th>
            </tr>
          </thead>
        </table>
        <table id="download_pdf_body">
          <thead>
            <tr>
              <th>Prefijo</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

import JsonExcel from "vue-json-excel";

// Vue.component("downloadExcel", JsonExcel);
export default {
  components: {
    FlowerSpinner,
    JsonExcel
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
      anulados: null,
      prest_servicios: [],
      headerCsv: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      headers: [
        { text: "DOMINIO", align: "center", value: "dominio256" },
        { text: "CODIGO", align: "center", value: "codigo256"},
        { text: "NOMBRE INDICADOR", align: "center", value: "n_indicador256" },        
        { text: "NUMERADOR", align: "center", value: "numerador256" },        
        { text: "DENOMINADOR", align: "center", value: "denominador256" },                
        { text: "RESULTADO INDICADOR", align: "center", value: "resultado256" }
      ]
    };
  },
  created() {
    this.cargarContratos();
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter(e => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    }
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
    fecha_ini() {
      this.fecha_final = this.fecha_ini;
    }
  },
  methods: {
    formatNumero: function(val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: "."
      });

      mask.resolve(val.toString());
      return "$ " + mask.value;
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
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "01" + "|",
          method: ""
        })
        .then(data => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle
            });
          });
          this.load_contrato = false;
        })
        .catch(err => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true
          });
        });
    },
    consultarServicios() {
      let consulta = this.contratos.filter(e => {
          if (e.nro == this.selectContrato) {
            return e;
          }
        }),
        estado_fecha = this._validarFechas();
      consulta = consulta[0];

      this.headerCsv = [
        "Reporte: , Resolucion 256," +
          "Contrato: ," +
          this.selectContrato +
          " - " +
          this.descripContrato +
          " , Fecha inicial: ," +
          this.fecha_ini +
          ", Fecha final: , " +
          this.fecha_final.replace(/-/g, "/"),
        ""
      ];
      if (consulta) {
        if (estado_fecha) {
          this.loader = true;

          post
            .postData({
              url: "Clinico/dlls/ClRp256J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                consulta.nro +
                "|" +
                consulta.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|",
              method: ""
            })
            .then(data => {
              console.log(data);
              this.loader = false;
              this.prest_servicios = data;
            })
            .catch(err => {
              console.log(err);
              this.load_contrato = false;
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios",
                estado: true
              });
            });
        }
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un contrato",
          estado: true
        });
      }
    },

    downloadPdf: function() {
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
      let contrato = this.contratos.filter(e => {
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
    }
  }
};

function exportPdf() {
  var pdf = window.open("", "_blank");

  pdf.document.write(
    `<style>${document.getElementById("css_download_pdf").innerHTML}</style>`
  );
  pdf.document.write(document.getElementById("downloadPdf").innerHTML);
  setTimeout(() => {
    pdf.document.close();
    pdf.focus();
    pdf.print();
    pdf.close();
    _emptyDownloadPdf();
  }, 2000);
}

function _emptyDownloadPdf() {
  document.getElementById("tipo_reporte").innerHTML = "";
  document.getElementById("fecha_ini_reporte").innerHTML = "";
  document.getElementById("fecha_fin_reporte").innerHTML = "";

  document
    .getElementById("download_pdf_body")
    .getElementsByTagName("tbody").innerHTML = "";
}

function imprimir_pdf2() {
  var impresion = window.open("", "_blank");
  // console.log(impresion);
  impresion.document.write(
    `<style>${document.getElementById("css_print2").innerHTML}</style>`
  );
  impresion.document.write(
    document.getElementById("impresion2_titcl101").innerHTML
  );
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    _emptyImpresion();
  }, 2000);
}

function _emptyImpresion() {
  var header = document
    .getElementById("pdf2_header_titcl101")
    .getElementsByTagName("a");

  header.forEach(value => {
    if (value.className) {
      var text = "";
      if (value.className == "fecha_factura2") text = "<b>Fecha factura :</b>";
      if (value.className == "vence_factura2")
        text = "<b>Fecha vencimiento :</b>";
      if (value.className == "cod_ica2") text = "<b>Actividad económica :</b>";

      document.getElementsByClassName(value.className)[0].innerHTML = text;
    }
  });

  document
    .getElementById("pdf2_body_titcl101")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  var footer = document
    .getElementById("pdf2_body_titcl101")
    .getElementsByTagName("tfoot")[0]
    .getElementsByTagName("td");

  footer.forEach(value => {
    if (value.className) {
      var text = "";
      if (value.className == "base_gravada2") text = "$";
      if (value.className == "copago2") text = "$";
      if (value.className == "base_excluida2") text = "$";
      if (value.className == "cuotam2") text = "$";

      document.getElementsByClassName(value.className)[0].innerHTML = text;
    }
  });

  document.getElementsByClassName("impreso2")[0].innerHTML = "";
  document.getElementsByClassName("fecha_impre2")[0].innerHTML = "";
  document.getElementsByClassName("valorLetras_impresion")[0].innerHTML = "";
}

var numeroALetras = (function() {
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }

    return "";
  } //Unidades()

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOSCIENTOS " + Decenas(decenas);
      case 3:
        return "TRESCIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let letras = "";

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += "";

    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;

    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "PESOS M/CTE", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || "PESO M/CTE", //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || "M/CTE",
      letrasMonedaCentavoSingular: currency.centSingular || "M/CTE"
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function() {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  };
})();
</script>
