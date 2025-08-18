<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-cowboy-hat-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Rpc Propietarios</v-list-item-title
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

          <v-col class="d-flex" cols="2" md="5">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="consultar_rpc()"
            >
              Consultar
              <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn
              color="red darken-2"
              class="ma-2 white--text"
              large
              depressed
              @click="print_reporte()"
              :disabled="contenido.length == 0"
            >
              Generar Pdf
              <v-icon right dark>mdi-file-pdf-box</v-icon>
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
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Numero", align: "center", value: "consecutivo_rep" },
        { text: "Agencia", align: "center", value: "descripagc_rep" },
        { text: "Concepto", align: "center", value: "concepto_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Taquillero", align: "center", value: "descrelabora_rep" },
      ],
      errores: {},
    };
  },

  created() {
    this.cargar_placas();
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    cargar_placas() {
      this.loader = true;
      // let propietario = 21191129;
      let propietario = sessionStorage.Sesion.substr(15,15)
      post
        .postData({
          url: "Transporte/dlls/PrVehiculosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + propietario + "|" ,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.placas = JSON.parse(JSON.stringify(data));
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
    print_reporte() {
      var data = this.contenido;
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      let placa = this.form.placas.placa_veh;
      var data_parse = [];
      let total_total = 0

      data.forEach((el) => {
        if (el.consecutivo_rep) {
          let item = [
            el.fecha_rep.trim(),
            el.consecutivo_rep.trim(),
            el.descripagc_rep.trim(),
            el.concepto_rep.trim(),
            el.valor_rep.trim(),
            el.descrelabora_rep.trim(),                                                                                    
          ];
          data_parse.push(item);
          total_total += parseFloat(el.valor_rep.trim().replace(/\,/g, ""))
        } else {
          data_parse.push(["\n\n", "", "","","","", ]);
        }
      });
      data_parse.unshift([
        { text: "Fecha", style: "header_table" },
        { text: "Numero", style: "header_table" },
        { text: "Agencia", style: "header_table" },
        { text: "Concepto", style: "header_table" },
        { text: "Valor", style: "header_table" },
        { text: "Taquillero", style: "header_table" },        
      ]);
      data_parse.push([
        { text: "", style: "header_table" },
        { text: "", style: "header_table" },
        { text: "", style: "header_table" },
        { text: "TOTAL: ", style: "header_table" },
        { text: this.formatNumero(total_total), style: "header_table" },
        { text: "", style: "header_table" },        
      ]);
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_parse,
          header_pdf: [
            {
              text: [
                { text: "Fecha inicial: ", bold: true },
                fecha_inicial,
                { text: " - Fecha final: ", bold: true },
                fecha_final,
              ],
            },
            {
              text: [
                { text: "Placa: ", bold: true },
                placa,
              ],
            },
          ],
//          orientation: "landscape",
          logo,
          titulo: "Reporte Rpc -Propietarios-",
          fontSize: 8,
        });
      });
    },    

    format_placas: function (val) {
      return `${val.placa_veh.trim()}`;
    },
    consultar_rpc() {
      let data = this.form;      
      if (!data.placas) {
        this.errores.placas = true;
        this.send_error("Selecciona una Placa");}
        else{
        this.loader = true;
        let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let placa = this.form.placas.placa_veh;
        let agencia = 0;

        var datos = {
          url: "Transporte/dlls/RPRpcJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaInicial +
            "|" +
            fechaFinal +
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

        }

    },
    formatComas: function (index, longitud, string) {
      return index + 1 === longitud ? string : string + ", ";
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
