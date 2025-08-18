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
              <v-icon size="30" color="blue darken-4 ">mdi-scale</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Pesajes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  label="Agencia"
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
              <v-col cols="3">
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
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="3">
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
                      hide-details
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
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Tipo de OperaciÃ³n"
                  v-model="form.tipo_oper"
                  :items="toperacion"
                  :item-text="format_operacion"
                  item-value="llave_tpoper"
                  hide-details
                  outlined
                  return-object
                  :error="errores.tipo_oper"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Agricultor/Cliente"
                  v-model="form.cliente"
                  :item-text="format_clientes"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  outlined
                  :error="errores.clientes"
                  @change="errores.clientes = false"
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end" cols="3">
                <v-btn
                  color="indigo darken-3 white--text"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="print_reporte_excel"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6">
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
              item-key="nro_pes"
              :search="search"
            >
              <template v-slot:item.estado_pes="{ item }">{{
                item.estado_pes == "1" ? "Anulado" : "Activo"
              }}</template>

              <template v-slot:item.entrada="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_entrada(item, 'entrada')"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Entrada</span>
                </v-tooltip>
              </template>
              <template v-slot:item.salida="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_entrada(item, 'salida')"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.pesodes_pes.trim()"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Salida</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                disabled
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="DescripciÃ³n"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { pesaje_salida, pesaje_entrada } from "../../_formatos_mol.js";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {
    FlowerSpinner,
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
      toperacion: [],
      clientes: [],

      search: "",
      form: {
        punto_fact: null,
      },

      headers: [
      { text: "Imprime Entrada", value: "entrada", align: "center" },
        { text: "Imprime Salida", value: "salida", align: "center" },

        { text: "Placa", align: "center", value: "placa_pes" },
        { text: "Pesaje", align: "center", value: "nro_pes" },
        { text: "Fecha", align: "center", value: "fecha_pes" },
        { text: "DescripciÃ³n", align: "left", value: "rut_pes" },
        { text: "Agencia", align: "center", value: "agencia_pes" },
        { text: "Producto", align: "left", value: "producto_pes" },
        { text: "Peso Ingreso", align: "center", value: "pesoini_pes" },
        { text: "Peso Salida", align: "center", value: "pesodes_pes" },
        { text: "T.OperaciÃ³n", align: "left", value: "tipoper_pes" },
        { text: "Peso Neto", align: "center", value: "pesoneto_pes" },

        // { text: "Humedad", align: "center", value: "humini_pes" },
        // { text: "Impureza", align: "center", value: "impini_pes" },

        // { text: "P.Compra", align: "left", value: "pesocomp_pes" },
        { text: "Estado", align: "center", value: "estado_pes" },
        { text: "Nro_Liq", align: "center", value: "liquidacion_pes" },
      ],
      errores: {
        codigo: false,
        estado: false,
        tipo_oper: false,
        clientes:false,
      },
      card_estado: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
    };
  },
  created() {
    this.cargarTablaAg();
    this.get_empresa();
    this.get_Clientes();

    this.cargaroperaciones();
  },
  computed: {},
  methods: {
    print_entrada(item, origen) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fechacorta_pes.substr(0, 4);
      var agencia = this.form.punto_fact.codigo_agc;
      var key = agencia + "|" + item.nro_pes.trim() + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Molinos/dlls/RPesaje02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.generar_pdf(data[0], origen);
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        if (copia.estado_pes === "1") {
          copia.estado_pes = "Anulado";
        } else {
          copia.estado_pes = "Activo";
        }
        copia.pesoini_pes = parseFloat(el.pesoini_pes.replace(/\,/g, "")) || 0;
        copia.pesoneto_pes =
          parseFloat(el.pesoneto_pes.replace(/\,/g, "")) || 0;
        copia.pesodes_pes = parseFloat(el.pesodes_pes.replace(/\,/g, "")) || 0;
        copia.pesocomp_pes =
          parseFloat(el.pesocomp_pes.replace(/\,/g, "")) || 0;
        copia.empaques_pes =
          parseFloat(el.empaques_pes.replace(/\,/g, "")) || 0;
        copia.valor_pes = parseFloat(el.valor_pes.replace(/\,/g, "")) || 0;
        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Agencia",
          value: "descripcion_agc",
        },
        {
          title: "Tiquete",
          value: "nro_pes",
        },
        {
          title: "Tipo OperaciÃ³n",
          value: "tipoper_pes",
        },

        {
          title: "Estado",
          value: "estado_pes",
        },
        {
          title: "Nombre",
          value: "rut_pes",
        },
        {
          title: "Placa",
          value: "placa_pes",
        },
        {
          title: "Producto",
          value: "producto_pes",
        },
        {
          title: "Peso Entrada",
          value: "pesoini_pes",
          totalsRowFunction: "sum",
        },
        {
          title: "Tara",
          value: "pesodes_pes",
          totalsRowFunction: "sum",
        },
        {
          title: "Empaques",
          value: "empaques_pes",
          totalsRowFunction: "sum",
        },

        {
          title: "Peso Neto",
          value: "pesoneto_pes",
          totalsRowFunction: "sum",
        },
        {
          title: "Hum.Entrada",
          value: "humini_pes",
        },
        {
          title: "Imp.Entrada",
          value: "impini_pes",
        },

        {
          title: "Kilos Compra/Servicio",
          value: "pesocomp_pes",
          totalsRowFunction: "sum",
        },
        {
          title: "Valor Compra",
          value: "valor_pes",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Fecha Entrada",
          value: "fechaent_pes",
          format: "fecha",
        },
        {
          title: "Fecha Salida",
          value: "fechasal_pes",
          format: "fecha",
        },
        {
          title: "LiquidaciÃ³n",
          value: "liquidacion_pes",
        },
        {
          title: "Fecha LiquidaciÃ³n",
          value: "fechaliq_pes",
          format: "fecha",
        },
      ];

      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var header_format = [
        { text: "REPORTE PESAJES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Pesajes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PESAJES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    generar_pdf(data, origen) {
      var _this = this;
      var agencia = this.form.punto_fact;
      data.agencia = agencia;
      data.empresa = _this.datosEmpresa;
      let registros = data.registros.map((el) => {
        el.agencia_pes_desc = _this.getAgencia(el.agencia_pes);
        el.producto_pes = el.base1_pr
          ? window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            )
          : "";
        return el;
      });

      data.registros = registros;

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;

        let metodo = origen === "entrada" ? pesaje_entrada : pesaje_salida;
        metodo(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    cargaroperaciones() {
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
          data: sessionStorage.Sesion + "|" + "3" + "|",
          method: "",
        })
        .then((data) => {
          data.unshift({
            llave_tpoper: "000",
            descrip_tpoper: "Todos",
          });

          this.toperacion = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar operaciones",
            estado: true,
          });
        });
    },
    format_operacion: function (val) {
      return `${val.llave_tpoper} - ${val.descrip_tpoper}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Anulado" : "Activo";
    },
    cargarcontenido() {
      var estado_fecha = this._validarFechas();
      var agencia = this.form.punto_fact;

      this.contenido = [];

      if (!agencia) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona una Agencia",
          estado: true,
        });
      } else if (!this.form.tipo_oper) {
        this.$emit("snack", {
          color: "error",
          text: "Seleccione un Tipo de OperaciÃ³n",
          estado: true,
        });
      } else {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        let tipoper = this.form.tipo_oper.llave_tpoper;
        let cliente = this.form.cliente.identificacion_rut;

        this.loader = true;

        post
          .postData({
            url: "Molinos/dlls/RPesaje01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|" +
              tipoper +
              "|" +
               cliente +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop();

            var data_parse = JSON.parse(JSON.stringify(data));
            let descripcion64 = " ";

            data_parse.map((el, index) => {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim()
              );
              if (descripcion64) {
                el.producto_pes = descripcion64;
              }
              return el;
            });

            this.contenido = data_parse;
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Pesajes",
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
          this.datosEmpresa = data[0];
          let punto = this.datosEmpresa.ptoperfil_empr;
          let busqueda = this.agencias.find((el) => el.codigo_agc == punto);
          this.form.punto_fact = busqueda;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.unshift({
            identificacion_rut: "000",
            descripcion_rut: "Todos",
          });
          this.clientes = data;

        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    format_clientes: function (val) {
      let string = null;
      if (val) {
        string = `${parseInt(val.identificacion_rut)} - ${
          val.descripcion_rut ? val.descripcion_rut.trim() : ""
        }`;
      }

      return string;
    },

    getAgencia(codAgencia) {
      var msg = "";
      this.agencias.forEach((el) => {
        if (el.codigo_agc === codAgencia) {
          msg = el.descripcion_agc;
        }
      });
      return msg;
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
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    toObjectUrl(url) {
      return fetch(url, { mode: "no-cors" })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          return URL.createObjectURL(blob);
        });
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

