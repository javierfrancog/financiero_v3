<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cloud-print-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reimprimir Prestacion de Servicios</v-list-item-title
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
                  v-model="periodo"
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
                  v-model="consecutivo"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="_cargarTablaFacturas"
                >
                  Consultar
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
        { text: "Servicio", align: "center", value: "nro_servicio" },
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
    consultar_pagos() {
      post
        .postData({
          url: "ptovta/dlls/RpPagos01J.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            this.prefijo +
            "|" +
            this.consecutivo +
            "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.pagos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pagos",
            estado: true,
          });
        });
    },
    imprimir_excel() {
      this.loader = true;
      var $this = this;
      var numero = this.consecutivo;
      var prefijo = this.prefijo;

      post
        .postData({
          url: "Clinico/dlls/Titcl103R.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "01" +
            "|" +
            prefijo +
            "|" +
            numero +
            "|" +
            this.periodo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          data = data[0];
          let url_firma =
            "https://server1ts.net/Datos/50001/" +
            sessionStorage.Sesion.substr(0, 15) +
            "/FACT000000901099286.jpg";

          let pacientes = data.servicios.dato_paciente;
          let data_parse = [];
          let granTotal = 0;

          pacientes.forEach((pac) => {
            pac.articulos.forEach((art) => {
              let total = art.vlr_total.replace(/\,/g, "");

              data_parse.push({
                nombre: pac.nombre_paciente,
                id: pac.id_paciente,
                regimen: pac.regimen_paciente,
                codigo: art.codigo,
                descripcion: art.nombre_servicio,
                autorizacion: art.autorizacion,
                cantidad: art.cantidad,
                vlr_unit: art.vlr_unit.replace(/\,/g, ""),
                subtotal: art.subtotal.replace(/\,/g, ""),
                vlr_iva: art.vlr_iva,
                total,
              });

              granTotal += parseFloat(total) || 0;
            });
          });

          data_parse.push({
            nombre: "",
            id: "",
            regimen: "",
            codigo: "",
            descripcion: "",
            autorizacion: "",
            cantidad: "",
            vlr_unit: "",
            subtotal: "",
            vlr_iva: "Gran total: ",
            total: granTotal,
          });

          let columnas = [
            {
              title: "Nombre_Paciente",
              value: "nombre",
            },
            {
              title: "ID_Paciente",
              value: "id",
              format: "string",
            },
            {
              title: "Régimen_Paciente",
              value: "regimen",
            },
            {
              title: "Código",
              value: "codigo",
              format: "string",
            },
            {
              title: "Descripción",
              value: "descripcion",
              format: "string",
            },
            {
              title: "Autorización",
              value: "autorizacion",
              format: "string",
            },
            {
              title: "Cantidad",
              value: "cantidad",
            },
            {
              title: "Vlr. Unitario",
              value: "vlr_unit",
              format: "money",
            },
            {
              title: "Sub total",
              value: "subtotal",
              format: "money",
            },
            {
              title: "Vlr. Iva",
              value: "vlr_iva",
            },
            {
              title: "Total",
              value: "total",
              format: "money",
            },
          ];

          let header_format = [
            { text: "ANEXO FACTURA", bold: true, size: 16 },
            data.nro_factura,
            data.fecha_factura.trim(),
            "",
          ];

          let logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          this.pdfs.getBase64(logo_src).then((logo) => {
            this.excel
              ._informe({
                sheetName: "Anexo factura",
                header: header_format,
                logo,
                tabla: {
                  columnas,
                  totalsRow: false,
                  data: data_parse,
                  // heightRow: 35,
                  theme: "TableStyleMedium2",
                },
                archivo: `ANEXO FACTURA-${new Date().getTime()}`,
              })
              .then((data) => {
                console.log("Impresion de excel terminada");
              });
          });
        })
        .catch((err) => {
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar excel de la factura",
            estado: true,
          });
        });
    },

    print_item(item) {
      var documento = item.documento_rep.substring(0, 7);
      var consecutivo = item.documento_rep.substring(7);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        documento +
        "|" +
        consecutivo +
        "|" +
        item.fechadoc_rep +
        "|";

      post
        .postData({
          url: "Financiero/dlls/PrRegcontJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.format_imprimir(data);
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    format_imprimir(data) {
      data = data[0];
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        try {
          if (val == "registros") {
            var parent = document
              .getElementById("pdf_body_comp")
              .getElementsByTagName("tbody")[0];

            var registros = data[val];
            var debitos = 0;
            var creditos = 0;

            registros.forEach((item) => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              row.insertCell(0).appendChild(document.createTextNode(item.item));
              row
                .insertCell(1)
                .appendChild(document.createTextNode(item.cuenta));
              row.insertCell(2).appendChild(document.createTextNode(item.rut));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.nroext));
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.ccosto));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.debito));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.credito));
              row
                .insertCell(7)
                .appendChild(document.createTextNode(item.detalle));

              debitos += parseFloat(item.debito.replace(/\,/g, "")) || 0;
              creditos += parseFloat(item.credito.replace(/\,/g, "")) || 0;
            });

            document.getElementsByClassName("total_debito")[0].innerHTML +=
              " " + this.formatNumero(debitos.toFixed(2));

            document.getElementsByClassName("total_credito")[0].innerHTML +=
              " " + this.formatNumero(creditos.toFixed(2));
          } else {
            var el = val + "_print";
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          console.error(`Parametro: ${val} - Error`, error);
        }
      });
      imprimir_pdf();
    },

    _cargarTablaFacturas() {
      console.log(this.form)
      let sede = this.form.punto_fact.codigo_agc
      let fecha = this.periodo;
      let nro = this.consecutivo;
      this.facturas = [];
      (this.pagos = []),
        post
          .postData({
          url: "clinico/dlls/titcl101r.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              sede +
              "|" +
              nro +
              "|" +
              fecha +
              "|",
            method: "",
          })
          .then((data) => {
            let id = 1;
            data.map((elem) => {
              elem.nro = id++;
            });
            this.facturas = data;
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar prestación",
              estado: true,
            });
          });
    },

    imprimir_factura() {
      this.loader = true;
      var $this = this;
      var numero = this.consecutivo;
      var prefijo = this.prefijo;

      post
        .postData({
          url: "Clinico/dlls/Titcl103R.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "01" +
            "|" +
            prefijo +
            "|" +
            numero +
            "|" +
            this.periodo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          data = data[0];
          let url_firma =
            "https://server1ts.net/Datos/50001/" +
            sessionStorage.Sesion.substr(0, 15) +
            "/FACT000000901099999.jpg";

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
              document.getElementsByClassName(
                "valorLetras_impresion"
              )[0].innerHTML += " " + letras;
            } else if (obj) obj.innerHTML += " " + data[val].trim();
          });
          imprimir_pdf2();
        })
        .catch((err) => {
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
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
