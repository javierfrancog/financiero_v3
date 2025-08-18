<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-function-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Consultar Factura</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  return-object
                  hide-details
                  outlined
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-select
                  :items="años_select"
                  label="Año Factura"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo"
                  item-text="text"
                  item-value="value"
                  required
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Prefijo"
                  outlined
                  hide-details
                  v-model="form.prefijo"
                  text-transform:uppercase
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  hide-details
                  v-model="form.consecutivo"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargarTablaFacturas()"
                >
                  Consultar
                  <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="orange"
                  class="ma-2 white--text"
                  @click="imprimir_factura()"
                >
                  Imprimir
                  <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-text-field
                  v-if="facturas.length != 0"
                  label="Asesor"
                  disabled
                  hide-details
                  v-model="form.asesor"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            ></v-divider>

            <v-data-table
              v-if="form.consecutivo != null"
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

            <v-data-table
              v-if="form.consecutivo != null"
              :loading="load_table"
              :headers="headerpago"
              :items="pagos"
              item-key="nro"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn color="indigo" icon v-on="on">
                      {{ item.docabrev_rep }}
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="green"
                      icon
                      v-on="on"
                      @click="imprimir_pago(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>

              <template v-slot:item.borrar="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red"
                      icon
                      v-on="on"
                      @click="borrar_pago(item)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>

              <template v-slot:body.append>
                <tr>
                  <td></td>
                  <td class="text-right"><b>Total Pagos: </b></td>
                  <td class="text-center">$ {{ formatNumero(total_pagos) }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td class="text-right"><b>Saldo Factura: </b></td>
                  <td class="text-center">$ {{ formatNumero(valor_saldo) }}</td>
                  <td></td>
                </tr>
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
import { factura_titan, factura_gyro } from "../../_formatos.pdf";
import { formato_contable } from "../../_formatos.pdf.js";

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
        codigo: false,
        estado: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      facturas: [],
      agencias: [],
      pagos: [],
      total_pagos: 0,
      valor_saldo: 0,
      total_factura: 0,

      form: [],
      años_select: [],

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_factura" },
        { text: "Cliente", align: "center", value: "nombre_cliente" },
        { text: "Estado", align: "center", value: "estado_factura" },
        { text: "Neto", align: "center", value: "netofact" },
      ],
      headerpago: [
        { text: "Fecha Registro", align: "center", value: "fecha_rep" },
        { text: "Fecha Recaudo", align: "center", value: "fecharecaudo_rep" },
        { text: "Valor Pago", align: "center", value: "valorpg_rep" },
        { text: "Documento", value: "edit", align: "center" },
        { text: "Imprimir", align: "center", value: "imprimir", width: "15%" },
        { text: "Eliminar", align: "center", value: "borrar", width: "15%" },
      ],
    };
  },
  created() {
    this.get_empresa();
    this.cargar_años();
    this.cargarTablaAg();
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
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo_cargue = anioActual;
    },

    borrar_pago(item) {
      let pref = this.form.prefijo.trim();
      let factura = this.form.consecutivo.trim();
      let registro = item.registro_rep.trim();
      post
        .postData({
          url: "PtoVta/dlls/PrBorrapago.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            pref +
            "|" +
            factura +
            "|" +
            registro +
            "|",
          method: "",
        })
        .then((data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Registro eliminado",
            estado: true,
          });
          this.consultar_pagos();
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al eliminar pago",
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
            this.form.prefijo +
            "|" +
            this.form.consecutivo +
            "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.pagos = data;
          this.total_pagos = 0;

          this.pagos.forEach((el) => {
            let valor = parseFloat(el.valorpg_rep.replace(/\,/g, "")) || 0;
            this.total_pagos += valor;
          });
          this.total_factura =
            parseFloat(this.total_factura.replace(/\,/g, "")) || 0;
          this.valor_saldo = this.total_factura - this.total_pagos;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pagos",
            estado: true,
          });
        });
    },
    imprimir_pago(item) {
      let documento = item.documento_rep.substring(0, 7);
      let consecutivo = item.documento_rep.substring(7);

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
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          console.error(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_pdf(data) {
      let tipo_documento = data.nombredoc;
      data.tipo_documento = tipo_documento;
      data.empresa = this.empresa;

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        formato_contable(data).then(() => {
          console.log("Impresión finalizada");
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    imprimir_factura(item) {
      let fecha = this.form.periodo;
      let agencia = this.form.punto_fact.codigo_agc;
      let prefijo = this.form.prefijo.trim();
      let numero = this.form.consecutivo.trim();
      let tipoimpresion = 0;
      var key = agencia + "|" + prefijo + "|" + numero + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrFact01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          if (tipoimpresion == "1") {
            this.get_pdf_pos(data[0]);
          } else {
            this.generar_pdf_2(data[0]);
            // this.generar_pdf(data[0]);
          }
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
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

      if (data.formato_fact === "02") {
        if (getBase64) return await factura_gyro(data, getBase64);
        else factura_gyro(data);
      } else {
        if (getBase64) return await factura_titan(data, getBase64);
        else factura_titan(data);
      }
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    print_recaudo(item) {
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
    cargarTablaFacturas() {
      this.facturas = [];
      this.pagos = [];
      let agencia = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "Ptovta/dlls/PrFact04J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            this.form.prefijo +
            "|" +
            this.form.consecutivo +
            "|" +
            this.form.periodo +
            "|",
          method: "",
        })
        .then((data) => {
          let id = 1;
          data.map((elem) => {
            elem.nro = id++;
          });
          this.facturas = data;
          this.total_factura = this.facturas[0].sinnetofact;
          this.form.asesor = this.facturas[0].nombre_asesor;
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
  },
};
</script>
  