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
                >Reimprimir Facturas S.S.</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Año Factura"
                  outlined
                  hide-details
                  v-model="periodo"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="6" sm="2">
                <v-text-field
                  label="Prefijo"
                  outlined
                  hide-details
                  v-model="prefijo"
                  text-transform:uppercase
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  hide-details
                  v-model="consecutivo"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Año Prestación Servicios"
                  outlined
                  hide-details
                  v-model="periodo_prserv"
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
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="purple"
                  class="ma-2 white--text"
                  @click="imprimir_factura()"
                >
                  Imprimir
                  <v-icon right dark>mdi-printer-check</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="facturas.length != 0">
                <v-btn
                  depressed
                  color="green darken-2"
                  class="ma-2 white--text"
                  @click="imprimir_excel"
                >
                  Anexo EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="facturas.length != 0">
                <v-btn
                  depressed
                  color="orange darken-2"
                  class="ma-2 white--text"
                  @click="descarga_pdf(1)"
                >
                  Anexo H. Clinica
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="facturas.length != 0">
                <v-btn
                  depressed
                  color="blue grey-darken-1"
                  class="ma-2 white--text"
                  @click="descarga_pdf(2)"
                >
                  Reportes Médicos
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
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
import { historiaClinica, factura_titan} from "../../_formatos_sal.js";
import { OrdenMedica } from "../../_formatos_sal.js";
import PDFMerger from "pdf-merger-js/browser";

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
      idpaciente: 0,
      nro_hist: 0,

      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      facturas: [],
      historias: [],
      pagos: [],
      form: [],
      datosEmpresa: [],

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "nro_factura" },
        { text: "Fecha", align: "center", value: "fecha_factura" },
        { text: "Cliente", align: "center", value: "nombre_cliente" },
        { text: "Servicio", align: "center", value: "nro_servicio" },
        { text: "Estado", align: "center", value: "estado_factura" },
        { text: "Rips", align: "center", value: "nro_rips" },
        { text: "Paciente", align: "center", value: "descrip_paciente" },
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
    this.periodo_prserv = this.periodo;
    this.get_empresa();
  },
  watch: {},
  computed: {},

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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
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
    descarga_pdf(tipo) {
      this.loader = true;
      var numero = this.consecutivo;
      var prefijo = this.prefijo;
      let per_prserv = this.periodo_prserv;
      post
        .postData({
          url: "Clinico/dlls/Titcl103H.dll",
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
            "|" +
            per_prserv +
            "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.historias = data;
          if (tipo == 1) {
            this.descarga_hc();
          } else {
            this.descarga_reportes();
          }
        })
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al descargar Historia");
        });
    },
    async descarga_reportes() {
      const DescargaMasiva = this.historias.filter(
        (el) => el.nroprestac_rep > 0
      );
      for await (const item of DescargaMasiva) {
        try {
          await this.pdf_resultado(item);
        } catch (error) {
          console.log("Error get_pdf_2: ", error);
        }
      }
    },

    pdf_resultado(item) {
      if (item.fecha_rep < 20240520) {
        this.pdf_resultado_ant(item);
      } else {
        let ruta = item.iddriverep_docs;
        const url =
          `https://drive.google.com/file/d/` +
          ruta.trim() +
          `/view?usp=drive_link`;
        window.open(url, "_blank").focus();
      }
    },

    async pdf_resultado_ant(item) {
      return new Promise((resolve, reject) => {
        let empresa = sessionStorage.Sesion.substr(0, 15);
        let fecha = item.fecha_rep.substr(0, 4);
        let tipoDocumento = "PRS";

        if (item.fecha_rep > 20240220) {
          tipoDocumento = "PRS" + fecha;
        }
        let consecutivo = item.nroprestac_rep.replace(/\ /g, "");
        let nombrePdf = `./pdfs/${empresa}_${tipoDocumento}_${consecutivo}.pdf`;

        var formData = new FormData();
        formData.append("ruta", nombrePdf);
        fetch("https://server100ts.net/get.file.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.text())
          .then((response) => {
            const linkSource = `data:application/pdf;base64,${response}`;
            const downloadLink = document.createElement("a");
            let name_file =
              "REP_" + item.apellido1_rep.trim() + "_" + item.nombre_rep.trim();

            downloadLink.href = linkSource;
            downloadLink.download = name_file;
            downloadLink.click();
            resolve();
          });
      });

      // fetch(nombrePdf)
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error(
      //         `Error: ${response.status} - ${response.statusText}`
      //       );
      //     }
      //     return response.blob();
      //   })
      //   .then((blob) => {

      //   })
      //   .catch((error) => {
      //     console.error("Error al descargar el archivo:", error);
      //   });
    },
    async descarga_hc() {
      const DescargaMasiva = this.historias.filter((el) => el.nrohc_rep > 0);

      for await (const item of DescargaMasiva) {
        try {
          await this.get_pdf(item);
        } catch (error) {
          console.log("Error get_pdf_2: ", error);
        }
      }
    },
    async get_pdf(item) {
      return new Promise((resolve, reject) => {
        let paciente = item.idpaciente_rep;
        this.idpaciente = paciente;
        let consecutivo = item.nrohc_rep;

        post
          .postData({
            url: "Clinico/dlls/ClHclinicaJ.dll",
            data:
              sessionStorage.Sesion + "|" + paciente + "|" + consecutivo + "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            data = JSON.parse(JSON.stringify(data))[0];
            let name_file =
              data.apellido1_rep.trim() + "_" + data.nombre1_rep.trim();

            data.edad_rep = data.edad_rep.replace("n", "ñ");
            data.empresa = this.datosEmpresa;
            let profesional = data.idprofes_rep;
            let profesional2 = parseInt(data.idprofes2_rep);

            var logo_src = require(`../../assets/image/clientes/${parseFloat(
              sessionStorage.Sesion.substr(0, 15)
            )}.png`);

            let firma_src = require(`../../assets/image/firmas/${parseFloat(
              profesional
            )}.png`);

            if (parseInt(profesional2) > 0) {
              let firma2_src = require(`../../assets/image/firmas/${parseFloat(
                profesional2
              )}.png`);

              let firma2 = await this.pdfs.getBase64(firma2_src);
              data.firma2 = firma2;
            }
            let logo = await this.pdfs.getBase64(logo_src);
            let firma = await this.pdfs.getBase64(firma_src);
            data.logo = logo;
            data.firma = firma;
            let blobHistoriaClinica = await historiaClinica(data, true);

            let arrBlob = await this.procesar_ordenes(consecutivo, profesional);
            arrBlob.unshift(blobHistoriaClinica);

            const merger = new PDFMerger();
            for await (const file of arrBlob) {
              if (file) await merger.add(file);
            }

            const mergedPdf = await merger.saveAsBlob();
            const url = URL.createObjectURL(mergedPdf);

            // window.open(url);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = name_file;
            a.click();
            window.URL.revokeObjectURL(url);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al imprimir Historia",
              estado: true,
            });

            reject();
          });
      });
    },
    async procesar_ordenes(consecutivo, profesional) {
      // let seccion = 111;
      let array = [];

      for await (const section of [111, 112, 113]) {
        let print = await this.imprimir_ordenes(
          section,
          consecutivo,
          profesional
        );
        if (print) array.push(print);
      }
      // let print1 = await this.imprimir_ordenes(seccion, consecutivo, profesional);
      // seccion = 112;
      // let print2 = await this.imprimir_ordenes(seccion, consecutivo, profesional);
      // seccion = 113;
      // let print3 = await this.imprimir_ordenes(seccion, consecutivo, profesional);

      return array;
    },
    async imprimir_ordenes(seccion, consecutivo, profesional) {
      return new Promise((res) => {
        post
          .postData({
            url: "Clinico/dlls/ClHclinica01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              seccion +
              "|" +
              this.idpaciente +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;

            data = JSON.parse(JSON.stringify(data))[0];
            if (!data.idpaciente_rep) return res(false);
            data.empresa = this.datosEmpresa;

            var logo_src = require(`../../assets/image/clientes/${parseFloat(
              sessionStorage.Sesion.substr(0, 15)
            )}.png`);

            let firma_src = require(`../../assets/image/firmas/${parseFloat(
              profesional
            )}.png`);
            let logo = await this.pdfs.getBase64(logo_src);
            let firma = await this.pdfs.getBase64(firma_src);
            data.logo = logo;
            data.firma = firma;

            await this.pdfs.getBase64(logo_src).then(async (logo) => {
              data.logo = logo;
              await OrdenMedica(data, true).then((blob) => {
                console.log("Impresion terminada");
                res(blob);
              });
            });
          })
          .catch((err) => {
            res(null);
            console.log(seccion, err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Historia",
              estado: true,
            });
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
                copago: art.copago.replace(/\,/g, ""),
                cuotam: art.cuotam.replace(/\,/g, ""),
                prestacion: parseFloat(art.nro_pr),
                

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
            prestacion: "",
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
            {
              title: "Copago",
              value: "copago",
              format: "money",
            },
            {
              title: "Cuota Moderadora",
              value: "vlr_iva",
              format: "money",
            },
            {
              title: "Prestacion",
              value: "prestacion",
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

    _cargarTablaFacturas() {
      this.facturas = [];
      (this.pagos = []),
        post
          .postData({
            url: "Clinico/dlls/ClprAnulafJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              this.prefijo +
              "|" +
              this.consecutivo +
              "|" +
              this.periodo +
              "|",
            method: "",
          })
          .then((data) => {
            let id = 1;
            data.map((elem) => {
              elem.nro = id++;
            });
            this.facturas = data;
            this.consultar_pagos();
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar facturas",
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
          url: "Clinico/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
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
          this.loader = false;
          data = data[0];
          this.generar_pdf_2(data);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      if (getBase64) return await factura_titan(data, getBase64);
      else factura_titan(data);
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
