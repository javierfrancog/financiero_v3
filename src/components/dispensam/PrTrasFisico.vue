<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-right-top</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Traslado Inventario Físico</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
            <v-row class="mt-1">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  :disabled="disabled.linea"
                  @change="errores.punto_fact = false"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Ubicacion Origen"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  return-object
                  item-value="codigo_ubic"
                  :disabled="disabled.linea"
                  v-model="form.ubica_orig"
                  :item-text="format_ubicacion"
                  :error="errores.ubica_orig"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha Registro"
                      outlined
                      v-model="form.fecha"
                      hide-details
                      v-on="on"
                      :disabled="disabled.linea"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Nro Conteo"
                  :items="conteo"
                  :disabled="disabled.linea"
                  outlined
                  clearable
                  persistent-hint
                  @change="select_ubicacion(), (errores.ubica_orig = false)"
                  required
                  v-model="form.conteo"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="tablaProduccion.datos_orig.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="4">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-data-table
                  :headers="tablaProduccion.headers"
                  :items="tablaProduccion.datos_orig"
                  item-key="codprod_rep"
                  single-expand
                  :search="search"
                >
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaProduccion.datos_orig"
                  @click="grabar_comprobante()"
                  >Grabar</v-btn
                >
              </v-col>
              <!-- <v-col class="pa-0 px-0" sm="3">
                <v-btn
                  color="blue darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="disabled.imprimir"
                  :loading="load.imprimir"
                  @click="get_impresion"
                  >Imprimir</v-btn
                >
              </v-col> -->
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { doc_invent_fisico } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
        metodo: null,
        index: null,
      },
      disabled: {
        grabar: true,
        imprimir: true,
        agregar: false,
        linea: false,
      },

      dialogPicker: false,
      dialogPickervence: false,
      singleExpand: true,
      pickerPeriodo: false,
      contenido: [],
      agencias: [],
      medicamentos: [],
      ubica: [],
      search: "",
      form: {
        barras: null,
        cantidad: 0,
        lote: 0,
        fechavence: this.$moment().format("YYYY-MM-DD"),
      },
      drawer: false,
      detalle: [],
      empresa: [],
      conteo: [
        { text: "Primer Conteo", value: 1 },
        { text: "Segundo Conteo", value: 2 },
        { text: "Tercer Conteo", value: 3 },
      ],

      card_estado: false,
      load: {
        btn_enviar: false,
        impresion: false,
        consecutivo: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      tablaProduccion: {
        headers: [
          { text: "Descripción", align: "left", value: "descripprod_rep" },
          { text: "Cum", align: "left", value: "cum_rep" },
          { text: "Lote", align: "left", value: "lote_rep" },
          { text: "Cant.Actual", value: "sactual_rep", align: "center" },
          { text: "Cant.Fisico", value: "sfisico_rep", align: "center" },
          { text: "Ajuste", value: "difer_rep", align: "center" },
        ],
        datos_orig: [],
      },
      errores: {
        punto_fact: false,
        lote: false,
        cantidad: false,
        ubica_orig: false,
      },
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      comprobante: null,
    };
  },

  created() {
    this.loader = false;
    this.get_empresa();
    this.cargarTablaAg();
    this.cargarTablaubica();

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    get_impresion() {},
    print_reporte_excel() {
      var data = this.tablaProduccion.datos_orig;
      var data_parse = data;
      var columnas = [
        {
          title: "Codigo",
          value: "codprod_rep",
          format: "string",
        },
        {
          title: "Nombre",
          value: "descripprod_rep",
          format: "string",
        },
        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Lote",
          value: "lote_rep",
          format: "string",
        },
        {
          title: "Vence",
          value: "vence_rep",
          format: "string",
        },

        

        {
          title: "Saldo Sistema",
          value: "sactual_rep",
        },
        {
          title: "Saldo Fisico",
          value: "sfisico_rep",
        },
        {
          title: "Diferencia",
          value: "difer_rep",
        },
      ];
      let ubicacion = this.form.ubica_orig.descrip_ubic.trim();
      let fecha = this.form.fecha;
      let conteo = this.form.conteo;

      var header_format = [
        { text: "REGISTRO INVENTARIO FISICO", bold: true, size: 16 },
        { text: "Fecha: " + fecha, bold: true, size: 12 },
        { text: "Ubicación: " + ubicacion, bold: true, size: 12 },
        { text: "Conteo: " + conteo, bold: true, size: 12 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Registro Inventario Fisico",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REGISTRO INVENTARIO FISICO-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    select_ubicacion() {
      let agencia = this.form.punto_fact.descripcion_agc.trim();
      let ubicacion = this.form.ubica_orig.descrip_ubic.trim();
      let idubica = this.form.ubica_orig.codigo_ubic;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let conteo = this.form.conteo;
      this.tablaProduccion.datos_orig = [];
      if (agencia == ubicacion) {
        post
          .postData({
            url: "Dispensa/dlls/RpSaldoFis01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              idubica +
              "|" +
              fecha +
              "|" +
              conteo +
              "|",
            method: "",
          })
          .then((data) => {
            this.tablaProduccion.datos_orig = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar ubicaciones",
              estado: true,
            });
          });
      } else {
        this.disabled.agregar = true;
        this.send_error(
          "Seleccione la ubicacion que corresponda a la agencia!"
        );
      }
    },
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubica = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    format_ubicacion: function (val) {
      return `${val.descrip_ubic}`;
    },

    grabar_comprobante: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (this.tablaProduccion.datos_orig.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Agencia sin Seleccionar!");
      } else if (!data.ubica_orig) {
        this.errores.ubica_orig = true;
        this.send_error("Ubicación sin Seleccionar!");
      } else if (!data.conteo) {
        this.errores.conteo = true;
        this.send_error("Conteo sin Seleccionar!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let ubicacion = data.ubica_orig.codigo_ubic;
      let fecha = data.fecha.replace(/\-/g, "");
      let conteo = data.conteo;

      let tablaOrigen = {};
      this.tablaProduccion.datos_orig.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(4, "0");
        item.codprod_rep = item.codprod_rep.trim();
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${item.codprod_rep}|${item.sactual_rep}|${item.sfisico_rep}|${item.lote_rep}|`;
      });

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        ubicacion +
        "|" +
        fecha +
        "|" +
        conteo +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrInvFisicoAj.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Conteo Registrado Correctamente",
            estado: true,
          }); 
          this.rec_saldos(sesion, fecha, 0);
          this.tablaProduccion.datos_orig = [];
          this.disabled.linea = false;
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = JSON.parse(JSON.stringify(data));

          this.disabled.imprimir = false;
          this.load.imprimir = false;
          let comprobante = parseFloat(data[0].nro);
          this.comprobante = comprobante;
          this.get_consecutivo();
          this.tablaProduccion.datos = [];
          this.form.cantidad = 0;
          this.form.lote = "";
          this.form.fechavence = 0;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    rec_saldos(sesion, fecha, conteo) {
      fecha = fecha.substr(0, 6);
      post
        .postData({
          url: "Dispensa/dlls/PrcierreInv.dll",
          data:
            sesion + "|" + fecha + "|" + "0" + "|" + "0" + "|" + conteo + "|",
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
            text: "Error al recalcular Saldo",
            estado: true,
          });
        });
    },
    get_plano() {
      const _this = this;
      return new Promise((resolve, reject) => {
        let tablaProduccion = _this.tablaProduccion.datos;
        let tablaConsumo = _this.tablaConsumo.datos;
        let detalle = [];
        tablaProduccion.forEach((el) =>
          detalle.push({
            producto: el.producto.codigo_pr.trim(),
            cantidad: el.cantidad,
            ubicacion: el.cod_ubica,
            tipo: 2,
          })
        );

        tablaConsumo.forEach((el) =>
          detalle.push({
            producto: el.producto.codigo_pr.trim(),
            cantidad: el.cantidad,
            ubicacion: el.cod_ubica,
            tipo: 1,
          })
        );

        var formData = new FormData();
        formData.append("tipo", "prProd");
        formData.append("data", JSON.stringify(detalle));

        fetch("https://server3ts.com//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    inicializar_dialogo() {
      this.dialogo = {
        estado: false,
        tipo: null,
        index: null,
        tabla: null,
      };
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
    format_punto_fact: function (val) {
      return `${val.descripcion_agc}`;
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
