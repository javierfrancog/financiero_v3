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
                >Reimprimir Facturas</v-list-item-title
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
              <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-4"
                        color="red accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="borrar_pago(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar Pago</span>
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
import { factura_titan } from "../../_formatos_sal";

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
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      facturas: [],
      pagos: [],
      form: [],
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
        { text: "Fecha Radicado", align: "center", value: "fecharad_factura" },
      ],
      headerpago: [
        { text: "Fecha Pago", align: "center", value: "fecha_rep" },
        { text: "Valor Pago", align: "center", value: "valorpg_rep" },
        { text: "Documento", value: "edit", align: "center" },
        { text: "Registro", align: "center", value: "registro_rep" },
        { text: "Opciones", align: "center", value: "action", width: "15%" }        

      ],

    };
  },
  created() {
    this.periodo = this.$moment().format("YYYY");
  },
  watch: {},
  computed: {},

  methods: {
    borrar_pago(item) {
      post
        .postData({
          url: "Clinico/dlls/PrAnulapago.dll",
          data: sessionStorage.Sesion +
           "|" +
           item.registro_rep +
           "|" ,
          method: ""
        })
        .then(data => {
            this.dialog = false;
            this.$emit("snack", {
              color: "success",
              text: "Registro anulado",
              estado: true
            });
            this._cargarTablaFacturas();
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true
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
    imprimir_excel() {
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
          data = data[0];
          data.productos.pop()
          let url_firma =
            "https://server1ts.net/Datos/50001/" +
            sessionStorage.Sesion.substr(0, 15) +
            "/FACT000000901099286.jpg";

          let pacientes = data.productos;
          let data_parse = [];
          let granTotal = 0;

          pacientes.forEach((pac) => {
              let total = pac.tot_producto.replace(/\,/g, "");
              pac.idpaciente = pac.idpaciente.replace(/\,/g, "");

              data_parse.push({
                fecha: pac.fservicio,
                sede: pac.sede,
                nroserv: pac.nro_servicio,
                nombre: pac.descpaciente,
                id: pac.idpaciente,
                regimen: pac.regimen,
                codigo: pac.cups,
                descripcion: pac.nombre_servicio,
                autorizacion: pac.autorizacion,
                cantidad: pac.cantidad,
                vlr_unit: pac.vlr_unit.replace(/\,/g, ""),
                subtotal: pac.vlr_subtotal.replace(/\,/g, ""),
                copago: pac.copago.replace(/\,/g, ""),
                vlr_iva: pac.vlr_iva,
                
                total,
              });

              granTotal += parseFloat(total) || 0;

          });

          data_parse.push({
            fecha: "",
            sede: "",
            nroserv: "",
            nombre: "",
            id: "",
            regimen: "",
            codigo: "",
            descripcion: "",
            autorizacion: "",
            cantidad: "",
            vlr_unit: "",
            subtotal: "",
            copago: "",
            cuotam: "",
            vlr_iva: "Gran total: ",
            total: granTotal,
          });

          let columnas = [
          {
              title: "Fecha Servicio",
              value: "fecha",
            },

            {
              title: "Sede Servicio",
              value: "sede",
              format: "string",
            },
            {
              title: "Nro Servicio",
              value: "nroserv",
            },
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
              title: "Cuota M.",
              value: "moderadora",
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
          console.log(err)
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
          data = data[0];
          // let url_firma =
          //   "https://server1ts.net/Datos/50001/" +
          //   sessionStorage.Sesion.substr(0, 15) +
          //   "/FACT000000901099999.jpg";
          this.generar_pdf_2(data)
          
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
    async generar_pdf_2(data) {
      // let descripcion64 = " ";
      // descripcion64 = window.atob(data.Observaciones64);
      // if (descripcion64) {
      //   data.observaciones = descripcion64;
      // }
      data.observaciones = ""

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      let getBase64 = null;
      // data.condicion = this.condicion_pdf;

      // if (getBase64) return await factura_titan(data, getBase64);
      factura_titan(data, getBase64);
    },
  },
};













</script>
