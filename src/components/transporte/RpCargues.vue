<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-bus-clock</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Cargues</v-list-item-title
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
              <template v-slot:item.id_lvia="{ item }">
                {{ parseInt(item.id_lvia) }}
              </template>

              <template v-slot:item.cargue_lvia="{ item }">
                {{ parseInt(item.cargue_lvia) }}
              </template>

              <template v-slot:item.estado_lvia="{ item }">{{
                item.estado_lvia == "1" ? "Anulado" : "Activo"
              }}</template>
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
        titulo2: null,
        tipo: null,
      },
      dialogo_editar: {
        estado: false,
        tipo: 0,
      },
      itemselecc: [],
      ptosrecaudo: [],
      punto_taquilla: [],

      contenido: [],
      placas: [],
      search: "",
      form: {
        avances: 0,
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },

      libro: {},
      headers: [
        { text: "Fecha", align: "center", value: "fecha_lvia" },
        { text: "Nro Cargue", align: "center", value: "id_lvia" },
        { text: "Agencia", align: "center", value: "descagencia_lvia" },
        { text: "Id_Interno", align: "center", value: "nrointerno_lvia" },
        { text: "Placa", align: "center", value: "placa_lvia" },
        { text: "Valor", align: "center", value: "valor_lvia" },
        { text: "Origen", align: "center", value: "origen_lvia" },
        { text: "Destino", align: "center", value: "destino_lvia" },
        { text: "Estado", align: "center", value: "estado_lvia" },
        { text: "Taquillero", align: "center", value: "descuser_lvia" },
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
        let valor = parseFloat(el.valor_lvia.replace(/\,/g, "")) || 0;
        let valorpago = parseFloat(el.vlrpago_lvia.replace(/\,/g, "")) || 0;
        let sdocartera = parseFloat(el.sdocartera_lvia.replace(/\,/g, "")) || 0;
        let excluido = parseFloat(el.excluido_lvia.replace(/\,/g, "")) || 0;        
        
        let nrolibro = parseFloat(el.id_lvia.trim()) || 0;

        el.valor_lvia = valor;
        el.id_lvia = nrolibro;
        el.vlrpago_lvia = valorpago;
        el.sdocartera_lvia = sdocartera;
        el.excluido_lvia = excluido;
        return el;
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_lvia",
          format: "string",
        },
        {
          title: "Nro Cargue",
          value: "id_lvia",
          format: "string",
        },
        {
          title: "Agencia",
          value: "descagencia_lvia",
          format: "string",
        },
        {
          title: "Placa",
          value: "placa_lvia",
        },
        {
          title: "Nro Interno",
          value: "nrointerno_lvia",
        },
        {
          title: "Origen",
          value: "origen_lvia",
        },
        {
          title: "Destino",
          value: "destino_lvia",
        },
        {
          title: "Valor",
          value: "valor_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Motivo",
          value: "motivo_lvia",
        },
        {
          title: "Autoriza",
          value: "autoriza_lvia",
        },
        {
          title: "Valor Pagado",
          value: "vlrpago_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Saldo Cartera",
          value: "sdocartera_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Valor Excluido",
          value: "excluido_lvia",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Despachador",
          value: "descuser_lvia",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      var taquilla = this.form.puntos.descripcion_agc;
      var placas = this.form.placas.placa_veh;

      var header_format = [
        { text: "REPORTE CARGUES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Taquilla: ${taquilla} - Placa: ${placas}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Cargues",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-CARGUES-${new Date().getTime()}`,
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
          url: "Transporte/dlls/RpCarguesJ.dll",
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
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
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
