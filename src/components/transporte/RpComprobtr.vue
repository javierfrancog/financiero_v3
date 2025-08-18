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
                >mdi-zip-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Comprobantes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
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
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="3">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Taquilla"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  :error="errores.puntos"
                  @input="errores.puntos = false"
                  hide-details
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-select
                  :items="selcta"
                  label="Tipo a Procesar"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.tipo"
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  :items="placas"
                  label="Placa"
                  v-model="form.placas"
                  :item-text="format_placas"
                  item-value="placa_veh"
                  clearable
                  :error="errores.placas"
                  @input="errores.placas = false"
                  hide-details
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="consultar_reporte"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="contenido.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
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
              item-key="index"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Anulado" : "Activo"
              }}</template>
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Comprobante</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_comp(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular/Reactivar</span>
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
import { recibo_caja } from "../../_formatos_trans.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      ptosrecaudo: [],
      placas: [],
      errores: {},
      search: "",
      total_valor: 0,
      total_cantidad: 0,
      total_rpc: 0,
      total_egresos: 0,
      total_redbus: 0,
      total_pinbus: 0,
      total_tdebito: 0,
      total_tcredito: 0,
      total_convenios: 0,
      selcta: [
        { text: "Todos los tipos", value: 1 },
        { text: "RPC", value: 2 },
        { text: "Egresos", value: 3 },
      ],

      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Tipo", align: "center", value: "tipodoc_rep" },
        { text: "Agencia", align: "center", value: "agencia_rep" },
        { text: "Documento", align: "center", value: "consecutivo_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Concepto", align: "left", value: "concepto_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },

        { text: "Opciones", align: "center", value: "edit" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.cargar_placas();
    this.cargaragencias();
    this.form.tipo = {
      text: "Todos los tipos",
      value: 1,
    };
  },
  methods: {
    cargar_placas() {
      this.loader = true;
      post
        .postData({
          url: "Transporte/dlls/PrVehiculosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.placas = JSON.parse(JSON.stringify(data));
          this.placas.unshift({
            placa_veh: "Todas las placas",
          });
          let placa = this.placas.find(
            (el) => el.placa_veh == "Todas las placas"
          );
          this.form.placas = placa;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },

    format_placas: function (val) {
      return `${val.placa_veh.trim()}`;
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data.map((el) => {
        let consec = parseFloat(el.consecutivo_rep.replace(/\,/g, "")) || 0;
        el.consecutivo_rep = consec;
        let valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
        el.valor_rep = valor;

        return el;
      });
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
        },
        {
          title: "Tipo",
          value: "descrtipodoc_rep",
        },
        {
          title: "Agencia",
          value: "agencia_rep",
        },
        {
          title: "Numero",
          value: "consecutivo_rep",
        },
        {
          title: "Valor",
          value: "valor_rep",
        },
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Placas",
          value: "placa_rep",
          format: "string",
        },
        {
          title: "Nro_Interno",
          value: "interno_rep",
        },
        {
          title: "Detalle",
          value: "detalle_rep",
          format: "string",
        },

        {
          title: "Estado",
          value: "estado_rep",
          format: "string",
        },
      ];
      var header_format = [
        {
          text: "Reporte Comprobantes",
          bold: true,
          size: 16,
        },
        `Placa: ${this.form.placas.placa_veh}`,
        `Periodo Inicial: ${this.form.fechaInicial}`,
        `Periodo Final: ${this.form.fechaFinal}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Comprobantes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Reporte Comprobantes}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    anular_comp(item) {
      let fecha = item.fecha_rep;
      let agencia = item.agencia_rep;
      let consec = item.consecutivo_rep.replace(/\,/g, "").trim();
      let tipo = item.tipodoc_rep;
      post
        .postData({
          url: "/transporte/dlls/PranulacbJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            fecha +
            "|" +
            consec +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Procesado",
            estado: true,
          });
          this.consultar_reporte();
        })
        .catch((err) => {
          this.loader = false;
          this.form.estado = false;
          this.send_error("Error al cargar Contenido");
        });
    },
    cargaragencias: function () {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todos",
          });
          let agencia = this.ptosrecaudo.find((el) => el.codigo_agc == "0");
          this.form.puntos = agencia;
        })

        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    print_item(item) {
      let fecha = item.fecha_rep;
      let agencia = item.agencia_rep;
      let consec = item.consecutivo_rep.replace(/\,/g, "");
      let tipo = item.tipodoc_rep;
      post
        .postData({
          url: "/transporte/dlls/PrReimpcbJV.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            tipo +
            "|" +
            consec +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.estado = true;
          data.pop();
          let datos = JSON.parse(JSON.stringify(data));
          data = datos[0];
          data.fecha_impr = this.$moment().format("YYYY-MM-DD");
          data.hora_impr = this.$moment().format("HH:mm");
          data.registros.pop();
          let valorTotal = 0;
          data.registros.forEach((el_reg) => {
            valorTotal += parseFloat(el_reg.valor.replace(/\,/g, "")) || 0;
          });
          data.valor = "$" + this.formatNumero(valorTotal);
          data.estadoLetras = data.estado == "0" ? "Activo" : "Desactivado";

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");
          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            this.pdfs.getBase64(logoSuper_src).then((logoSuper) => {
              data.logoSuper = logoSuper;
              if (data.estado == 1) {
                data.marca_agua = "Anulado";
              } else {
                data.marca_agua = "Copia";
              }

              recibo_caja(data).then(() => {
                console.log("Impresion terminada");
              });
            });
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.loader = false;
          this.form.estado = false;
          this.send_error("Error al cargar Contenido");
        });
    },
    print_reporte() {
      var data = this.contenido;
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      let valor_total = 0;
      let cantidad_total = 0;

      var data_parse = [];
      data.forEach((el) => {
        let valor = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
        valor_total += valor;
        cantidad_total += parseFloat(el.cantidad_rep);
        let item = [
          el.taquilla_rep.trim(),
          { text: el.cantidad_rep.trim(), alignment: "right" },
          { text: el.ventas_rep.trim(), alignment: "right" },
        ];
        data_parse.push(item);
      });

      data_parse.push([
        { text: "Totales " },
        { text: cantidad_total, alignment: "right" },
        { text: this.formatNumero(valor_total), alignment: "right" },
      ]);
      data_parse.unshift([
        { text: "Agencias", style: "header_table" },
        { text: "Cantidad", style: "header_table", alignment: "right" },
        { text: "Ventas", style: "header_table", alignment: "right" },
      ]);

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_parse,
          header_pdf: [
            {
              text: [{ text: "Fecha inicial: ", bold: true }, fecha_inicial],
            },
            {
              text: [{ text: "Fecha Final: ", bold: true }, fecha_final],
            },
          ],
          width_table: ["*", "*", "*"],
          logo,
          titulo: "Ventas del Dia",
          fontSize: 8,
        });
      });
    },

    consultar_reporte() {
      this.loader = true;
      var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let tipo = this.form.tipo.value;
      let placas = this.form.placas.placa_veh;
      let agencia = this.form.puntos.codigo_agc;

      let data = [
        sessionStorage.Sesion,
        fechaInicial,
        fechaFinal,
        tipo,
        placas,
        agencia,
      ];
      this.total_cantidad = 0;
      this.total_valor = 0;
      this.postData({
        url: "/transporte/dlls/RpReimpcbJV.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          console.log("Error", err);
          this.$emit(
            "msj",
            err.Mensaje ? err.Mensaje[0].msg : err,
            "red",
            3000
          );
        });
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
