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
                >mdi-bus-stop-uncovered</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Tiquetes Convenios</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                    @input="pickeFechaIni = false; form.fechaFinal = form.fechaInicial"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
              <v-col cols="4">
                <v-autocomplete
                  :items="convenios"
                  label="Convenio"
                  outlined
                  clearable
                  hide-details
                  v-model="form.convenio"
                  item-value="value"
                  required
                  :error="errores.convenio"
                  @change="errores.ciudadorig = false"
                >
                </v-autocomplete>
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
              <template v-slot:body.append>
                <tr>
                  <td colspan="5"></td>
                  <td class="font-weight-medium text-right">Totales</td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_cantidad) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_valor) }}
                  </td>
                </tr>
              </template>

              <template v-slot:item.estado_tiq="{ item }">{{
                item.estado_tiq == "1" ? "Anulado" : "Activo"
              }}</template>

              <template v-slot:item.libroviaje_tiq="{ item }">
                {{ parseInt(item.libroviaje_tiq) }}
              </template>

              <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="imprimir_tiquete(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Tiquete</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red darken-4"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="anular_tiquete(item)"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{ item.estado_tiq == "0" ? "Anular" : "Reactivar" }}
                  </span>
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
import { tiquete_transporte } from "../../_formatos_trans.js";

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
      placas: [],
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
      convenios: [
        { text: "1. Brasilia", value: 1 },
        { text: "2. Red Bus", value: 2 },
        { text: "3. PinBus", value: 3 },
        { text: "4. Gamarra", value: 11 },
      ],


      fpago: [
        { text: "Todas la formas de Pago", value: 0 },
        { text: "Efectivo", value: 1 },
        { text: "Yates", value: 6 },
        { text: "Convenio Brasilia", value: 9 },
        { text: "Redbus", value: 7 },
        { text: "PinBus", value: 10 },
        { text: "Tarjeta Crédito", value: 2 },
        { text: "Tarjeta Débito", value: 3 },
        { text: "Reserva", value: 8 },
        { text: "Otro", value: 4 },
      ],

      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Fecha", align: "left", value: "fechaelab_tiq" },
        { text: "Taquilla", align: "left", value: "nombreagencia_tiq" },
        { text: "Tiquete", align: "center", value: "nro_tiq" },
        { text: "Placa", align: "center", value: "placa_tiq" },
        { text: "Libro", align: "center", value: "libroviaje_tiq" },
        { text: "Pasajero", align: "left", value: "nombrepasaj_tiq" },
        { text: "Destino", align: "center", value: "destino_tiq" },
        { text: "Valor", align: "center", value: "vlr_tiq" },
        { text: "F_Pago", align: "center", value: "fpago_tiq" },
        { text: "Estado", align: "center", value: "estado_tiq" },
        { text: "Elaboró", align: "center", value: "nombreuser_tiq" },
        { text: " ", align: "center", value: "action" },
      ],
      errores: {
        placas: false,
      },
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
        var busqueda_placa = this.placas.find(
        (el) =>
          el.placa_veh == "Todas las placas"
        );
        this.placas.value = busqueda_placa;
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
    anular_tiquete(item) {
      let tiquete = item.nro_tiq;
      let agencia = item.agencia_tiq;
      post
        .postData({
          url: "/transporte/dlls/PrAnulaTiq.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso correcto",
            estado: true,
          });
          this.consultar_reporte();
        })
        .catch((err) => {
          console.log("Error", err);
          this.loaderTable = false;
          this.send_error("Error al anular el tiquete");
        });
    },
    imprimir_tiquete(item) {
      let tiquete = item.nro_tiq;
      let agencia = item.agencia_tiq;
      post
        .postData({
          url: "/transporte/dlls/PrTiquetesJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          console.log(data)
          const _this = this;
          let fecha = this.$moment().format("YYYY-MM-DD");
          let hora = this.$moment().format("HH:mm");

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            this.pdfs.getBase64(logoSuper_src).then((logoSuper) => {
              data.logoSuper = logoSuper;
              tiquete_transporte(data, fecha, hora).then(() => {
                console.log("Impresión terminada");
              });
            });
          });
        });
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      let total_valor = 0;

      var data_parse = data.map((el) => {
        // let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
        let ventas = parseFloat(el.vlr_tiq.replace(/\,/g, "")) || 0;
        let seguro = parseFloat(el.seguro_tiq.replace(/\,/g, "")) || 0;

        el.vlr_tiq = ventas;
        el.seguro_tiq = seguro;

        if (el.id != 99) {
          total_valor += ventas;
        }

        return el;
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fechaelab_tiq",
          format: "string",
        },
        {
          title: "Taquilla",
          value: "nombreagencia_tiq",
          format: "string",
        },
        {
          title: "Tiquete",
          value: "nro_tiq",
        },
        {
          title: "Placa",
          value: "placa_tiq",
        },
        {
          title: "Libro",
          value: "libroviaje_tiq",
        },
        {
          title: "Pasajero",
          value: "nombrepasaj_tiq",
        },
        {
          title: "Destino",
          value: "destino_tiq",
        },
        {
          title: "Valor",
          value: "vlr_tiq",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Seguro",
          value: "seguro_tiq",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cantidad",
          value: "pasajeros_tiq",
          totalsRowFunction: "sum",
        },
        {
          title: "F_Pago",
          value: "fpago_tiq",
        },
        {
          title: "Despachador",
          value: "nombreuser_tiq",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE DE TIQUETES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Tiquetes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-TIQUETES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
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
      let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let convenio = this.form.convenio;
      
      let data = [
        sessionStorage.Sesion,
        fechaInicial,
        fechaFinal,
        convenio,
        
      ];
      this.postData({
        url: "Transporte/dlls/RpTiqueteconvJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.contenido.forEach((el) => {
            let valor = parseFloat(el.vlr_tiq.replace(/\,/g, "")) || 0;
            this.total_valor += valor;
            let cantidad = parseFloat(el.pasajeros_tiq.replace(/\,/g, "")) || 0;
            this.total_cantidad += cantidad;

            // el.vlr_tiq = this.formatNumero(el.vlr_tiq);
            el.pasajeros_tiq = this.formatNumero(el.pasajeros_tiq);
          });
        })
        .catch((err) => {
          this.loader = false;
          console.log("Error", err);
          this.$emit(
            "msj",
            err.Mensaje ? err.Mensaje[0].msg : err,
            "red",
            1000
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
