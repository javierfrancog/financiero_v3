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
                >mdi-printer-check</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reimpresión de Facturación.</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-menu
                  v-model="pickerMes"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      Autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    scrollable
                    no-title
                    type="month"
                    @change="cargarciclos()"
                    @input="pickerMes = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-select
                  label="Ciclo"
                  :items="ciclos"
                  outlined
                  clearable
                  return-object
                  persistent-hint
                  v-model="form.ciclo"
                  :item-text="format_ciclos"
                  :error="errores.ciclo"
                  @change="errores.ciclo = false"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="form.pendientes"
                  @change="cargarcontenido"
                  label="Solo Pendientes Envio Dian"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
                <v-btn
                  color="success"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="dialogo_rango_print.estado = true"
                >
                  Impresión masiva
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
                <v-btn
                  color="purple"
                  class="mt-2 ml-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="
                    dialogo_rango.estado = true;
                    dialogo_rango.tipo = 1;
                  "
                >
                  Envio masivo Dian
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
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="`${item.estado_rep == 1 ? 'red' : 'green'} darken-1`"
                  >{{ item.estado_rep == 1 ? "Anulado" : "Activo" }}</v-chip
                >
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  @click="cargarfactura(item)"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <template v-slot:item.dian="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item, 0)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.iddian_rep.trim() == ''"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar DIAN</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="consultadian_item(item, 0)"
                      color="green"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.iddian_rep.trim() == ''"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item, 0)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Reenviar DIAN</span>
                </v-tooltip>
              </template>
              <template v-slot:item.anular="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="red"
                  class="white--text"
                  @click="anularfactura(item)"
                >
                  <v-icon>mdi-delete-empty</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="loader_periodos" persistent max-width="300">
      <v-card>
        <v-card-title class="headline"> Procesando </v-card-title>
        <v-card-text>
          <v-col class="subtitle-1 text-center" cols="12">
            Documento : <b>{{ periodo_label }}</b>
          </v-col>
          <v-progress-linear
            v-model="periodos_progreso"
            color="blue darken-1"
            height="25"
          >
            <template v-slot:default="{ value }">
              <strong>{{ value }}%</strong>
            </template>
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo_rango.estado" persistent max-width="400">
      <v-card :disabled="dialogo_rango.loader" :loading="dialogo_rango.loader">
        <v-card-title class="headline"> Rango a Enviar Dian</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Número inicial"
                outlined
                hide-details
                v-model="dialogo_rango.numInicial"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Número final"
                outlined
                hide-details
                v-model="dialogo_rango.numFinal"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="init_dialogo_rango">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="procesar_rango">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo_rango_print.estado" persistent max-width="400">
      <v-card
        :disabled="dialogo_rango_print.loader"
        :loading="dialogo_rango_print.loader"
      >
        <v-card-title class="headline"> Rango a Imprimir</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Número inicial"
                outlined
                hide-details
                v-model="dialogo_rango.numInicial"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Número final"
                outlined
                hide-details
                v-model="dialogo_rango.numFinal"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="init_dialogo_rango_print">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="procesar_rango_print">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import { PDFDocument } from "pdf-lib";
import Chart from 'chart.js/auto'

import { factura_logigas, factura_coingasco } from "../../_formatos_sdm.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickerMes: false,
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
      ciclos: [],
      search: "",
      form: {},
      item_envio: {},
      envio_masivo: 0,
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: 0,
        numFinal: 0,
        loader: false,
      },
      dialogo_rango_print: {
        estado: false,
        tipo: 0,
        numInicial: 0,
        numFinal: 0,
        loader: false,
      },
      headers: [
        { text: "Imprimir", value: "edit", align: "center" },
        { text: "Dian", align: "center", value: "dian" },
        { text: "Id_Usuario", align: "center", value: "codcliente_rep" },
        { text: "Ruta", align: "center", value: "rutacliente_rep" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "nombrecliente_rep",
        },
        { text: "Medidor", align: "center", value: "medidor_rep" },
        { text: "Factura", align: "center", value: "nrofact_rep" },
        { text: "Consumo", align: "center", value: "consumo_rep" },
        { text: "Valor", align: "center", value: "totalapagar_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Anular", value: "anular", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      usuarios: [],

      titulo_print: null,
      loader_periodos: false,
      periodos_progreso: 0,
      periodo_label: null,
    };
  },
  created() {
    this.get_empresa();

    // let factura = JSON.parse(
    //   `{"empresa_rep":"LOGIGAS COLOMBIA S.A. E.S.P.                                ","nitemp_rep":" 901,122,935","regimenemp_rep":"REGIMEN COMUN     ","direccempr_rep":"CL 14 18 82 P 2                                             ","ciudemp_rep":"ACACIAS -META                                     ","nrofact_rep":"FE       1","fechafact_rep":" Abril      15 de 2021","fcorta_rep":"2021-04-15","fechavence_rep":" Abril      00 de 0000","nrores_dian":"Sin resolucion       de             00 de 0000","rango_dian":"desde FE         hasta FE        ","codcliente_rep":"      5000","rutacliente_rep":"120106      ","uso_rep":"Residencial","estrato_rep":" 1","nombrecliente_rep":"  DE                                                                            ","direccliente_rep":"                                                            ","barrio_rep":"CASABLANCA                                                  ","telefcliente_rep":"            ","ciudadcliente_rep":"CASTILLA LA NUEVA -META                           ","emailcliente_rep":"                                                                                ","observaciones_rep":"                                                                                          ","compgm_rep":"       4,610.94","comptm_rep":"           0.00","compdm_rep":"       4,815.96","compfpc_rep":"           1.00","compcvm_rep":"           0.00","compccm_rep":"           0.00","compcuvm_rep":"       7,953.73","compcuf_rep":"       4,028.85","compp_rep":"           0.00","medidor_rep":"201711003411        ","consumo_rep":"         5","lectact_rep":"        91","lectant_rep":"        86","factorcorr_rep":"           1.00","consumocorr_rep":"           5.00","consumom3eq_rep":"       139","valorkw_rep":"           0.00","motivo_rep":"-","ultpago_rep":"0000-00-00","factvencidas_rep":"           0","subse1_rep":"          47.29","subse2_rep":"          39.50","contre5_rep":"          20.00","contrcom_rep":"           8.90","est1resd_rep":"       9,332.78","consmayorr_rep":"       7,956.73","est1com_rep":"       7,953.73","consmayorc_rep":"       7,953.73","cargofijo_rep":"           0.00","consumomin_rep":"      45,189.00","consumomay_rep":"0","subsidio_rep":"      21,369.00","subtotal_rep":"      23,820.00","otrosconcep_rep":"           0.00","ajustedec_rep":"           0.00","totalapagar_rep":"      23,820.00","fechaoport_rep":"0015-04-00","fechasusp_rep":"0016-04-00","perini_rep":"2021-03-03","perfin_rep":"2021-04-02","recsuspens_rep":"      22,600.00","reccorte_rep":"      68,652.00","elaboro_rep":"JAVIER FRANCO GONZALEZ                  "}`
    // );
    // this.imprimir_factura(factura);
  },
  computed: {},
  methods: {
    async impresion_masiva() {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      let logo = await this.pdfs.getBase64(logo_src);
      // let data = this.contenido.slice(0,5);

      let data = this.contenido;
      let pdfs = [];
      for (const item of data) {
        let dataFactura = await this.dataFactura(item);
        this.loader_periodos = false;

        let buffer = await this.bufferFactura(dataFactura[0]);
        pdfs.push(buffer);
      }

      const pdfDoc = await PDFDocument.create();
      for (const item of pdfs) {
        const donorPdfDoc = await PDFDocument.load(item);
        const docLength = donorPdfDoc.getPageCount();
        for (var k = 0; k < docLength; k++) {
          const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
          pdfDoc.addPage(donorPage);
        }
      }

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      const downloadLink = document.createElement("a");
      const fileName = "FACTURACION SERVICIOS.pdf";
      downloadLink.href = pdfDataUri;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    async dataFactura(item) {
      this.periodo_label = null;
      this.loader_periodos = true;
      let periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ciclo = this.form.ciclo.cod_rep || "0";
      let consec = item.consecutivo_rep;
      this.periodo_label = parseFloat(consec);

      return await post.postData({
        url: "Servdm//dlls/PrFact03J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          periodo +
          "|" +
          ciclo +
          "|" +
          consec +
          "|",
        method: "",
      });
    },
    async bufferFactura(item) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      let logo = await this.pdfs.getBase64(logo_src);
      let idempresa = this.datosEmpresa.id_empr;
      let imagenpie = null;
      let superservicios = await this.pdfs.getBase64(
        require(`../../assets/image/clientes/LOGO_SUPERSERVICIOS.png`)
      );
      let firma = await this.pdfs.getBase64(
        require(`../../assets/image/firmas/${parseFloat(
          item.nitemp_rep.replace(/\,/g, "")
        )}.png`)
      );
      if (idempresa == "000000901355090") {
        imagenpie = "assets/image/clientes/LOGOPIE_COINGASCO.png";
      } else if (idempresa == "000000901122935") {
        imagenpie = "assets/image/clientes/LOGOPIE_LOGIGAS.png";
      }

      let logopie = await this.pdfs.getBase64(require(`../../` + imagenpie));
      let grafico = await this.get_grafico(item.historico_rep);

      item.superservicios = superservicios;
      item.firma = firma;
      item.logopie = logopie;
      item.grafico = grafico;
      item.color3 = this.datosEmpresa.color3_empr;
      item.color4 = this.datosEmpresa.color4_empr;

      if (idempresa == "000000901355090") {
        return await factura_coingasco(item, logo, true);
      } else {
        return await factura_logigas(item, logo, true);
      }
    },
    async imprimir_factura(item) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      let logo = await this.pdfs.getBase64(logo_src);
      let idempresa = this.datosEmpresa.id_empr;
      let imagenpie = null;
      let superservicios = await this.pdfs.getBase64(
        require(`../../assets/image/clientes/LOGO_SUPERSERVICIOS.png`)
      );
      let firma = await this.pdfs.getBase64(
        require(`../../assets/image/firmas/${parseFloat(
          item.nitemp_rep.replace(/\,/g, "")
        )}.png`)
      );
      if (idempresa == "000000901355090") {
        imagenpie = "assets/image/clientes/LOGOPIE_COINGASCO.png";
      } else if (idempresa == "000000901122935") {
        imagenpie = "assets/image/clientes/LOGOPIE_LOGIGAS.png";
      }

      let logopie = await this.pdfs.getBase64(require(`../../` + imagenpie));
      let grafico = await this.get_grafico(item.historico_rep);

      item.superservicios = superservicios;
      item.firma = firma;
      item.logopie = logopie;
      item.grafico = grafico;
      item.color3 = this.datosEmpresa.color3_empr;
      item.color4 = this.datosEmpresa.color4_empr;

      if (idempresa == "000000901355090") {
        factura_coingasco(item, logo).then(() => {
          console.log("Impresion terminada");
        });
      } else {
        factura_logigas(item, logo).then(() => {
          console.log("Impresion terminada");
        });
      }
    },
    async get_grafico(data) {
      return new Promise((resolve) => {
        let labels = data.map((item) => {
          return item.periodo_rep;
        });

        let datasets = data.map((item) => {
          return item.cant_rep;
        });

        let colors = data.map((item) => {
          return "#3f51b5";
        });

        var newDiv = document.createElement("canvas");
        document.body.appendChild(newDiv);

        let chart_bar;
        chart_bar = new Chart(newDiv, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                data: datasets,
                backgroundColor: colors,
              },
            ],
          },
          options: {
            animation: {
              onComplete: function () {
                let url = chart_bar.toBase64Image();
                newDiv.remove();
                resolve(url);
              },
            },
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontSize: 42,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    fontSize: 42,
                  },
                },
              ],
            },
          },
        });
      });
    },
    async get_json_dian(item, masivo) {
      this.envio_masivo = masivo;
      let periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ciclo = this.form.ciclo.cod_rep || "0";
      let consec = parseFloat(item.consecutivo_rep);

      var key = periodo + "|" + ciclo + "|" + consec + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Servdm/dlls/PrFactTitanJ.dll";
      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = null;
          var urlEnvio = null;

          factura = data[0];
          if (factura.spd[0].subscriber_consumption.payment_agreements) {
            factura.spd[0].subscriber_consumption.payment_agreements.pop();
          }

          let nro_envio = factura.number;
          urlEnvio =
            "https://server1ts.net/financiero/inc/api_dian/elect_sdm.titan.phpxx";

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              console.log(error);
              this.loader = false;
              this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              this.card.loader = false;
              this.card.disabled = false;
              let cufe = null;
              let valido = false;
              let errordian = null;
              let error_fecha = null;

              if (response.cufe) {
                cufe = response.cufe;
                this.grabar_cufe(item, cufe);
              } else {
                valido =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.IsValid;
              }
              if (valido == "false") {
                cufe = "";

                this.grabar_cufe(item, cufe);
              } else {
                if (response.errors) {
                  const jsonObject = response;
                  if (jsonObject.errors["customer.email"]) {
                    errordian = jsonObject.errors["customer.email"];
                  } else if (
                    jsonObject.errors["spd.0.agency_information.issue_date"]
                  ) {
                    errordian = "Error en la fecha de la matricula! ";
                  } else {
                    errordian = response;
                  }
                  valido = false;
                } else {
                  if (!response.ResponseDian) {
                    valido = response.success;
                    errordian = response.message;
                    cufe = response.cufe;
                  } else {
                    if (response.ResponseDian.Envelope) {
                      cufe =
                        response.ResponseDian.Envelope.Body.SendBillSyncResponse
                          .SendBillSyncResult.XmlDocumentKey;
                      valido = true;
                      errordian =
                        response.ResponseDian.Envelope.Body.SendBillSyncResponse
                          .SendBillSyncResult.ErrorMessage.string;
                    } else {
                      error_fecha = response.errors.date[0];
                    }
                  }
                }
                if (valido === false) {
                  if (
                    errordian ==
                    "Este documento ya fue enviado anteriormente, se registra en la base de datos."
                  ) {
                    this.grabar_cufe(item, cufe, 1);
                  } else {
                    this.send_error(errordian);
                  }
                } else {
                  cufe = response.cufe;
                  this.grabar_cufe(item, cufe);
                }
              }
            });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.log(err);
          this.send_error(err);
        });
    },
    cargarciclos() {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");

      post
        .postData({
          url: "servdm/dlls/Cfciclos01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.ciclos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ciclos",
            estado: true,
          });
        });
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    cargarfactura(item) {
      let periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ciclo = this.form.ciclo.cod_rep || "0";
      let consec = item.consecutivo_rep;
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFact03J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            ciclo +
            "|" +
            consec +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.imprimir_factura(data[0]);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Factura",
            estado: true,
          });
        });
    },
    anularfactura(item) {
      let periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ciclo = this.form.ciclo.cod_rep || "0";
      let consec = item.consecutivo_rep;
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrAnulaFact.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            ciclo +
            "|" +
            consec +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargarcontenido();
          this.$emit("snack", {
            color: "success",
            text: "Factura Procesada",
            estado: true,
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al Procesar Factura",
            estado: true,
          });
        });
    },
    cargar_usuarios() {
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfusuariosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.usuarios = JSON.parse(JSON.stringify(data));
          this.usuarios.unshift({
            cod_rep: "0",
            nombres_rep: "Todos",
            apellido1_rep: "",
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Usuarios",
            estado: true,
          });
        });
    },
    format_usuarios: function (val) {
      return `${
        val.cod_rep.trim() +
        " - " +
        val.nombres_rep.trim() +
        " - " +
        val.apellido1_rep.trim()
      } `;
    },
    cargarcontenido() {
      this.envio_masivo = 0;
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var ciclo = this.form.ciclo.cod_rep || "0";
      let pendientes = this.form.pendientes ? "1" : "0";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            ciclo +
            "|" +
            pendientes +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = [];
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Facturación",
            estado: true,
          });
        });
    },
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    consultadian_item(item, tipo) {
      let cufe = item.iddian_rep.trim();
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    grabar_cufe(item, cufe) {
      var agencia = item.agencia_rep;
      var prefijo = item.prefijo_rep;
      var consecutivo = item.consecutivo_rep;
      var fecha = item.fecha_rep.substr(0, 4);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        "0|" +
        agencia +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";

      post
        .postData({
          url: "Servdm/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          if (this.envio_masivo == 0) {
            this.cargarcontenido();
            this.card.loader = false;
            this.card.disabled = false;
          }
          let texto = "Cufe Grabado consecutivo: " + parseFloat(consecutivo);
          this.$emit("snack", {
            color: "success",
            text: texto,
            estado: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    procesar_rango() {
      if (this.dialogo_rango.numInicial && this.dialogo_rango.numFinal) {
        var tipo = this.dialogo_rango.tipo;
        var numInicial = parseInt(this.dialogo_rango.numInicial);
        var numFinal = parseInt(this.dialogo_rango.numFinal);
        var data = this.contenido.filter(
          (el) =>
            el.consecutivo_rep >= numInicial && el.consecutivo_rep <= numFinal
        );
        this.dialogo_rango.loader = true;
        this.enviar_masivo(data);
      }
    },
    procesar_rango_print() {
      if (this.dialogo_rango.numInicial && this.dialogo_rango.numFinal) {
        var numInicial = parseInt(this.dialogo_rango.numInicial);
        var numFinal = parseInt(this.dialogo_rango.numFinal);
        var data = this.contenido.filter(
          (el) =>
            el.consecutivo_rep >= numInicial && el.consecutivo_rep <= numFinal
        );
        this.dialogo_rango_print.loader = true;
        this.print_masivo(data);
      }
    },
    async print_masivo(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      let logo = await this.pdfs.getBase64(logo_src);
      // let data = this.contenido.slice(0,5);

      let pdfs = [];
      for (const item of data) {
        let dataFactura = await this.dataFactura(item);
        this.loader_periodos = false;

        let buffer = await this.bufferFactura(dataFactura[0]);
        pdfs.push(buffer);
      }

      const pdfDoc = await PDFDocument.create();
      for (const item of pdfs) {
        const donorPdfDoc = await PDFDocument.load(item);
        const docLength = donorPdfDoc.getPageCount();
        for (var k = 0; k < docLength; k++) {
          const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
          pdfDoc.addPage(donorPage);
        }
      }

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      const downloadLink = document.createElement("a");
      const fileName = "FACTURACION SERVICIOS.pdf";
      downloadLink.href = pdfDataUri;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    async enviar_masivo(datos) {
      this.envio_masivo = 1;
      var data = datos.filter((el) => !el.iddian_rep.trim());
      this.masivo.data = JSON.parse(JSON.stringify(data));
      let index = 0;
      if (data.length > 0) {
        for (const elemento of data) {
          const resultado = await this.cargar_json_masivo(elemento, index);
          index++;
          if (index === data.length) {
            this.dialogo_rango.loader = false;
            this.cargarcontenido();
            this.init_dialogo_rango();
          }
        }
      } else {
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "No hay datos para procesar",
          estado: true,
        });
      }
    },
    async cargar_json_masivo(item, index) {
      this.item_envio = item;
      let periodo = item.fecha_rep;
      let ciclo = item.ciclo_rep;
      let consec = parseFloat(item.consecutivo_rep);

      var key = periodo + "|" + ciclo + "|" + consec + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Servdm/dlls/PrFactTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });
        const resultado = await this.envio_json_titan(data[0]);
        return resultado;
      } catch (err) {
        this.loader = false;
        console.log("error", err);
        this.masivo.jsonEnvio.push({ error: true });

        let new_index = index + 1;
        if (new_index <= this.masivo.data.length) {
          await this.envio_json_titan(new_index);
        }
        //  else {
        //   await this.cargar_json(new_index);
        // }
      }
    },
    async envio_json_titan(index) {
      let factura = index;

      if (typeof factura === "number") {
        console.log("Numerico", factura);
      } else {
        if (factura.spd[0].subscriber_consumption.payment_agreements) {
          factura.spd[0].subscriber_consumption.payment_agreements.pop();
        }

        let urlEnvio =
          "https://server1ts.net/financiero/inc/api_dian/elect_sdm.titan.php";

        var formData = new FormData();
        formData.append("factura", JSON.stringify(factura));
        await fetch(urlEnvio, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .catch((error) => {
            this.loader = false;
            console.log("error_1");
          })
          .then(async (response) => {
            this.card.loader = false;
            this.card.disabled = false;
            let cufe = null;
            let valido = false;
            let errordian = null;
            let mensaje = "";
            if (response.errors) {
              // this.send_error(response.errors);
              let new_index = index + 1;
              if (new_index == this.masivo.data.length) {
                await this.envio_json_titan(0);
              } else await this.cargar_json(new_index);

              this.cargar_json();
              valido = false;
            } else {
              if (!response.ResponseDian) {
                valido = response.success;
                errordian = response.message;
                cufe = response.cufe;
              } else {
                if (response.ResponseDian) {
                  cufe =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.XmlDocumentKey;
                  valido = true;
                  errordian =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.ErrorMessage.string;
                } else {
                  error_fecha = response.errors.date[0];
                }
              }
            }
            if (valido === false) {
              if (
                errordian ==
                "Este documento ya fue enviado anteriormente, se registra en la base de datos."
              ) {
                this.grabar_cufe(this.item_envio, cufe, 1);
              } else {
                this.send_error(errordian);
              }
            } else {
              cufe = response.cufe;
              this.grabar_cufe(this.item_envio, cufe);
            }
          });

        this.loader = false;
      }
    },
    async cargar_json(index) {
      var item = this.masivo.data[index];

      let periodo = item.fecha_rep;
      let ciclo = item.ciclo_rep;
      let consec = parseFloat(item.consecutivo_rep);

      var key = periodo + "|" + ciclo + "|" + consec + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Servdm/dlls/PrFactTitanJ.dll";

      await post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.masivo.jsonEnvio.push(data[0]);
          let new_index = index + 1;
          if (new_index == this.masivo.data.length) {
            await this.envio_json_titan(0);
          } else await this.cargar_json(new_index);
        })
        .catch(async (err) => {
          console.log("error", err);
          this.masivo.jsonEnvio.push({ error: true });
          let new_index = index + 1;
          if (new_index == this.masivo.data.length) {
            await this.envio_json_titan(new_index);
          } else await this.cargar_json(new_index);
        });
    },

    init_dialogo_rango_print() {
      this.envio_masivo = 0;
      this.dialogo_rango_print = {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      };
    },

    init_dialogo_rango() {
      this.envio_masivo = 0;
      this.dialogo_rango = {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      };
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
