<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-order-numeric-descending</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Resumen Libro de Viajes</v-list-item-title
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
                  label="Fecha Inicial"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaInicial"
                @input="pickeFechaIni = false;"
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
          <v-col class="d-flex" cols="4" md="4">
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

          <v-col class="d-flex" cols="2" md="5">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="consultar_lviajes()"
            >
              Consultar
              <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn
              color="green darken-2"
              class="ma-2 white--text"
              large
              depressed
              @click="print_reporte_excel()"
              :disabled="contenido.length == 0"
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
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="id_cargue"
              :search="search"
              class="elevation-1"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <modalLibroViaje
      :estado="dialogo.estado"
      :data="libro"
      @newLibroViajes="updatePtosrecaudo"
      @newEstado="updateEstadoRecaudo"
      @error="send_error"
    />

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import modalLibroViaje from "./componentes/modal.libro-viaje.vue";
import {
  get_libroViaje,
  contabilizar,
} from "@/components/transporte/mixins/contab";

export default {
  components: {
    FlowerSpinner,
    modalLibroViaje,
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
      headers: [
        { text: "Agencia", align: "left", value: "nombreagencia_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Producido", align: "center", value: "ventas_rep" },
        { text: "Seguro", align: "center", value: "seguro_rep" },
        { text: "Total", align: "center", value: "total_rep" },
        { text: " ", align: "center", value: "action" },
      ],
      errores: {},
    };
  },

  created() {
    this.cargar_placas();
    // this.dialogo.estado = true;
    let punto_taquilla = sessionStorage.llave_punto;
    let data = JSON.parse(atob(punto_taquilla));
    this.punto_taquilla.codigo = data.id;
    this.punto_taquilla.texto = data.text;
    this.punto_taquilla.turno = data.turno;

    this.cargaragencias();
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
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
      var data = JSON.parse(JSON.stringify(this.contenido));
      let total_valor = 0;

      var data_parse = data.map((el) => {
        let seguro = parseFloat(el.seguro_rep.replace(/\,/g, "")) || 0;
        let ventas = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
        let total = parseFloat(el.total_rep.replace(/\,/g, "")) || 0;

        el.ventas_rep = ventas;
        el.seguro_rep = seguro;
        el.total_rep = total;

        // if (el.id != 99) {
        //   total_valor += ventas;
        // }

        return el;
      });

      var columnas = [
        {
          title: "Agencia",
          value: "nombreagencia_rep",
          format: "string",
        },

        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Producido",
          value: "ventas_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Seguro",
          value: "seguro_rep",
          format: "money",         
          totalsRowFunction: "sum",                     
        },
        {
          title: "Total",
          value: "total_rep",
          format: "money",         
          totalsRowFunction: "sum",                     
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var taquilla = this.form.puntos.descripcion_agc;
      var placas = this.form.placas.placa_veh;

      var header_format = [
        { text: "RESUMEN LIBRO DE VIAJES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Taquilla: ${taquilla} - Placa: ${placas}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Resumen Libro de Viajes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `RESUMEN-LIBROVIAJES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultar_lviajes() {
      if (this.form.puntos) {
        this.loader = true;
        let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let placa = this.form.placas.placa_veh;
        if (placa === "Todas las placas") placa = 0;
        let agencia = this.form.puntos.codigo_agc;

        var datos = {
          url: "Transporte/dlls/RpResLViajes02J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaInicial +
            "|" +
            fechaFinal +
            "|" +
            agencia +
            "|" +
            placa +
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = data;
          })
          .catch((error) => {
            this.loader = false;
            this.send_error("Error al consultar viajes");
          });
      } else {
        this.errores.puntos = true;
        this.send_error("Debe seleccionar una taquilla");
      }
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
              efectivo,
              avance,
              totalPagar: totalValor,
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
      let libro = item.id_lvia.trim();
      post
        .postData({
          url: "/transporte/dlls/PrLviajesAV.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + libro + "|",
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
