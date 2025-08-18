<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-spellcheck</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Habilita Prestacion de Servicios para facturar
                cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Año Prestación"
                  outlined
                  hide-details
                  v-model="form.periodo"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="errores.punto_fact = false"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  hide-details
                  v-model="form.consecutivo"
                  @keyup.enter="focusNextField('consultar')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  id="consultar"
                  class="ma-2 white--text"
                  @click="habilitar()"
                >
                  Habilitar
                  <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
              </v-col>
              <!-- <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="blue darken-4"
                  class="ma-2 white--text"
                  @click="imprimir_factura()"
                >
                  Imprimir
                  <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="facturas.length != 0">
                <v-btn
                  depressed
                  color="green darken-2"
                  class="white--text"
                  @click="imprimir_excel"
                >
                  Imprimir EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col> -->
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-data-table
              v-if="consecutivo != null"
              :loading="load_table"
              :headers="headers"
              :items="facturas"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado_factura="{ item }">
                {{ item.estado_factura == "1" ? "Anulada" : "Activa" }}
              </template>
            </v-data-table>

            <v-divider
              v-if="consecutivo != null"
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'indigo' }"
            />

            <v-data-table
              v-if="consecutivo != null"
              :loading="load_table"
              :headers="headerpago"
              :items="pagos"
              item-key="nro"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn color="blue accent-3" fab small icon v-on="on"
                      >{{ item.docabrev_rep }}
                    </v-btn>
                  </template>
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
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      pickerActual: false,
      selectContrato: null,
      consecutivo: null,
      prefijo: null,
      periodo: null,
      errores: {
        punto_fact: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      facturas: [],
      pagos: [],
      agencias: [],
      form: [],
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Prefijo", align: "center", value: "preffact" },
        { text: "Nro factura", align: "center", value: "nrofact" },
        { text: "Cliente", align: "center", value: "nombre_cliente" },
        { text: "Autorizacion", align: "center", value: "autorizacion" },
        { text: "Estado", align: "center", value: "estado_factura" },
        { text: "Rips", align: "center", value: "nro_rips" },
        { text: "Paciente", align: "center", value: "nombre_paciente" },
        { text: "Id_Paciente", align: "center", value: "id_paciente" },

        { text: "Valor", align: "center", value: "valor_factura" },
      ],
      headerpago: [
        { text: "Fecha Pago", align: "center", value: "fecha_rep" },
        { text: "Valor Pago", align: "center", value: "valorpg_rep" },
        { text: "Documento", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.periodo = this.$moment().format("YYYY");
    this.cargarTablaAg();
  },
  watch: {},
  computed: {},

  methods: {
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    habilitar() {
      console.log(this.form);
      let periodo = this.form.periodo;
      let punto = this.form.punto_fact.codigo_agc;
      let consecutivo = this.form.consecutivo;
      post
        .postData({
          url: "clinico/dlls/Prhabprest.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            punto +
            "|" +
            consecutivo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Prestación Habilitada para Facturar",
            estado: true,
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al habilitar",
            estado: true,
          });
        });
    },

    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
  },
};

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    reset_impresion();
  }, 500);
}

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

  header.forEach((value) => {
    if (value.className) {
      var text = "";
      if (value.className == "nombre_cliente2") text = "<b>Cliente :</b>";
      if (value.className == "nit_cliente2") text = "<b>Nit :</b>";
      if (value.className == "direccion_cliente2") text = "<b>Dirección :</b>";
      if (value.className == "telefono_cliente2") text = "<b>Teléfono :</b>";
      if (value.className == "ciudad_cliente2") text = "<b>Ciudad :</b>";
      if (value.className == "correo_cliente2") text = "<b>E-mail :</b>";
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

  footer.forEach((value) => {
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

var numeroALetras = (function () {
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
      letrasMonedaCentavoSingular: currency.centSingular || "M/CTE",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
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
