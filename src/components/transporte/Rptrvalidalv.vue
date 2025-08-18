<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-map-clock-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Validación Libro de Viajes VS Tiquetes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
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
                  label="Fecha"
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

          <v-col class="d-flex" cols="2" md="5">
            <v-btn
              color="green darken-2"
              class="ma-2 white--text"
              large
              depressed
              @click="consultar_lviajes()"
            >
              Generar Excel
              <v-icon right dark>mdi-file-excel-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="12" md="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
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
      pickeFechaIni: false,
      pickerFechaFinal: false,

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      ptosrecaudo: [],
      punto_taquilla: [],

      contenido: [],
      placas: [],
      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },

      libro: {},
      errores: {},
    };
  },

  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      var data_parse = data

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Tiquete",
          value: "tiquete_rep",
          format: "string",
        },
        {
          title: "Agencia Libro",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Forma Pago Libro",
          value: "fpagolv_rep",
        },
        {
          title: "Valor Libro",
          value: "vlrlv_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Seguro Libro",
          value: "seglv_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Forma Pago Tiquete",
          value: "fpagolv_rep",
        },
        {
          title: "Valor Tiquete",
          value: "vlrtiq_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Seguro Tiquete",
          value: "segtiq_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

      ];
      var fecha_inicial = this.form.fechaInicial;

      var header_format = [
        { text: "VALIDACION LIBRO DE VIAJES vs TIQUETES", bold: true, size: 16 },
        `Fecha: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Validación LV",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `VALIDACION-LIBROVIAJES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultar_lviajes() {
      this.loader = true;
      let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      var datos = {
        url: "Transporte/dlls/RpvalidalvJ.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fechaInicial +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = data;
          this.print_reporte_excel()
        })
        .catch((error) => {
          this.loader = false;
          this.send_error("Error al consultar Libros de viajes");
        });
    },
    imprimir_libro: function (item) {
      this.loader = true;
      let agencia = item.agencia_lvia;
      let libro = parseInt(item.id_lvia);
      this.libro = {};
      post
        .postData({
          url: "/transporte/dlls/PrLviajes03VJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + libro + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.estado = true;
          this.loader = false;
          let tiquetes = JSON.parse(JSON.stringify(data[0].tiquetes_lvia));
          let libro = data[0].nro_lvia ? parseInt(data[0].nro_lvia) : 0;

          if (libro === 0) {
            this.libro = data[0];
          } else if (tiquetes[0].agenciatiq_lvia === undefined)
            this.libro = data[0];
          else {
            let totalSeguro =
              parseFloat(data[0].vlrseguro_lvia.replace(/\,/g, "")) || 0;
            let totalCantidad = data[0].cantpasajeros_lvia;
            let totalValor = data[0].vlrbruto_lvia;
            let redBus = data[0].vlrredbus_lvia;
            let pinBus = data[0].vlrpinbus_lvia;
            let brasilia = data[0].vlrbrasilia_lvia;
            let gamarra = data[0].vlrgamarra_lvia;
            let efectivo = parseInt(data[0].vlrefectivo_lvia);
            let avance = parseInt(data[0].vlravances_lvia);

            tiquetes.pop();
            let tiquetes_list = tiquetes.map((item) => {
              let newItem = {};

              let valor = parseFloat(item.vlrtiq_lvia.replace(/\,/g, "")) || 0;

              newItem.nombres = item.pasajero_lvia.trim();
              newItem.sillas = item.sillas_lvia;
              newItem.formapago = item.fpago_lvia;
              newItem.cantidad = parseInt(item.cantidad_lvia);
              newItem.valor = "$" + this.formatNumero(valor);
              newItem.nro_tiq = item.tiquete_lvia;
              newItem.destino_tiq = "";

              return newItem;
            });
            this.libro = {
              estado: 2,
              codigo_agc: "0",
              descripcion_agc: "Todos",
              agencia: data[0].agencia_lvia,
              libroViaje: parseFloat(data[0].nro_lvia),
              origen: item.origen_lvia.trim(),
              destino: item.destino_lvia.trim(),
              fecha: item.fecha_lvia,
              hora: data[0].hora_lvia,
              nroCargue: parseFloat(data[0].nrocargue_lvia),
              vehiculo: item.placa_lvia,
              conductor: `${
                data[0].idconductor_lvia
              } - ${data[0].conductor_lvia.trim()}`,
              tiquetes: tiquetes_list,
              totalSeguro,
              totalCantidad,
              totalValor,
              redBus,
              pinBus,
              brasilia,
              gamarra,
              efectivo,
              avance,

              // avance : 88888,
              totalPagar: totalValor - gamarra,
            };
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.send_error("Error al cargar tiquetes");
        });
    },
    async contabilizar_libro(item) {
      this.loader = true;
      let agencia = item.agencia_lvia;
      let libro = item.id_lvia;

      let info_viaje = await get_libroViaje({ agencia, consecutivo: libro });
      info_viaje.consec_libro = libro;

      await contabilizar(info_viaje)
        .then(() => {
          this.$emit("snack", {
            color: "success",
            text: "Libro Contabilizado Correctamente",
            estado: true,
          });
          this.loader = false;
        })
        .catch((error) => {
          console.log("Error", error);
          this.loader = false;
        });
    },
    anular_libro: function (item) {
      this.loader = true;
      let agencia = this.punto_taquilla.codigo;
      let agclibro = item.agencia_lvia;

      let libro = item.id_lvia.trim();
      post
        .postData({
          url: "/transporte/dlls/PrLviajesAV.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            libro +
            "|" +
            agclibro +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Libro Anulado correctamente",
            estado: true,
          });
          this.consultar_lviajes();
        })
        .catch((err) => {
          console.log("err", err);
          this.send_error("Error al anular libro");
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

          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todos",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    formatComas: function (index, longitud, string) {
      return index + 1 === longitud ? string : string + ", ";
    },

    updatePtosrecaudo(data) {
      this.form.ptosrecaudo = data;
    },
    updateEstadoRecaudo(dialogo) {
      this.dialogo.estado = dialogo.estado;
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
