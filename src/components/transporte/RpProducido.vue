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
              <v-icon size="30" color="blue darken-4 ">mdi-cash-100</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Producido</v-list-item-title
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
                    @input="
                      pickeFechaIni = false;
                      form.fechaFinal = form.fechaInicial;
                    "
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
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="4" md="3">
                <v-autocomplete
                  :items="placas"
                  label="Placa"
                  v-model="form.placas"
                  :item-text="format_placas"
                  item-value="codigo_agc"
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
              <v-btn
                color="orange darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="contabilizar()"
                :disabled="contenido.length == 0"
              >
                Contabilizar
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
                  <td colspan="1"></td>
                  <td class="font-weight-medium text-right">Totales</td>
                  <td class="font-weight-medium text-right"></td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_valor) }}
                  </td>
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

      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Placa", align: "center", value: "placa_tiq" },
        { text: "Vlr_Pasaje", align: "center", value: "vlrssg_tiq" },
        { text: "Vlr Seguro", align: "center", value: "seguro_tiq" },
        { text: "Total", align: "center", value: "vlr_tiq" },
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
            (el) => el.placa_veh == "Todas las placas"
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
        let vlrssg = parseFloat(el.vlrssg_tiq.replace(/\,/g, "")) || 0;
        let seguro = parseFloat(el.seguro_tiq.replace(/\,/g, "")) || 0;
        let total = parseFloat(el.vlr_tiq.replace(/\,/g, "")) || 0;

        el.vlr_tiq = total;
        el.vlrssg_tiq = vlrssg;
        el.seguro_tiq = seguro;

        if (el.id != 99) {
          total_valor += total;
        }

        return el;
      });

      var columnas = [
        {
          title: "Vehiculo",
          value: "placa_tiq",
        },
        {
          title: "Pasaje",
          value: "vlrssg_tiq",
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
          title: "Total",
          value: "vlr_tiq",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE PRODUCIDO", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Producido",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PRODUCIDO-${new Date().getTime()}`,
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
      let placa = this.form.placas.placa_veh;
      if (placa === "Todas las placas") placa = "000000";
      let data = [sessionStorage.Sesion, fechaInicial, fechaFinal, placa];
      this.postData({
        url: "Transporte/dlls/RpTiquetes02J.dll",
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

    async contabilizar() {
      this.loader = true;
      let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      // let archivo = "archivo.txt";
      let detalle = this.contenido;
      let archivo = await this.get_plano(detalle);
      let data = [fechaInicial, fechaFinal, archivo];
      this.postData({
        url: "taxmeta/app//TAX133.dll",
        setUrl: "https://server2ts.net/taxmeta/inc/index.php",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          console.log("Error", err);
        });
    },

    get_plano(detalle) {
      return new Promise((resolve, reject) => {
        var nuevo = [];
        detalle.forEach((el) => {
          var base =
            parseFloat(el.vlrssg_tiq.toString().replace(/\,/g, "")) || 0;
          var seguro =
            parseFloat(el.seguro_tiq.toString().replace(/\,/g, "")) || 0;

          nuevo.push({
            placa: el.placa_tiq || "",
            base: base,
            seguro: seguro,
            porcemp: el.porcempres_tiq.trim(),
            porcfondo: el.porcfondo_tiq.trim(),
            porcfondor: el.porcfondor_tiq.trim(),
            propietario: parseFloat(el.idpropietario_tiq) || "0",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "Producido");
        formData.append("data", JSON.stringify(nuevo));

        fetch("https://server2ts.net/taxmeta/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => {
            reject(error);
            console.log(error);
            this.$emit("snack", {
              color: "error",
              text: "Error al Contabilizar Producido",
              estado: true,
            });
            this.loader = false;
          });

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
