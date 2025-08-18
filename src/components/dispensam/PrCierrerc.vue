<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-cash-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cierres de Caja</v-list-item-title
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
                      label="Fecha Cierre"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechacierre"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Sede"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="errores.puntos = false"
                  :error="errores.puntos"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="indigo"
                  class="mt-2 white--text px-12"
                  large
                  depressed
                  @click="consultar()"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="green darken-2"
                  class="mt-2 ml-9 white--text px-12"
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
          </v-card-text>
        </div>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="desccajero_rep"
              :search="search"
              class="elevation-1"
              disable-pagination
            >


              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_anexo(item)"
                      color="green"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                    >
                      <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Anexo</span>
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
import { cierrecaja_pos } from "../../_formatos_disp.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
      },
      money1: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      contenido_anexo:[],
      pickeFechaIni: false,
      perfil: "0",
      search: "",
      puntos: "",
      ptosrecaudo: [],
      form: {
        efectivo: null,
        base: null,
      },
      headers: [
        { text: "Punto Recaudo", align: "left", value: "punto_rep" },
        { text: "Valor Recaudo", align: "center", value: "trecaudo_rep" },
        { text: "Usuario", align: "left", value: "desccajero_rep" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
        puntos: false,
      },
      card_estado: false,
      efectivo: null,
    };
  },
  created() {
    this.get_empresa();
    this.form.fechaInicial = this.$moment().format("YYYY-MM-DD");

    this.cargaragencias();
    this.dialogo.estado = false;
  },
  computed: {},
  methods: {
    cargaragencias: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todos",
          });

        })
        .catch((err) => {
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    print_anexo(item) {
      let usuario = item.iduser_rep;
      let punto = item.idagencia_rep;
      let fecha = this.form.fechaInicial.replace(/\-/g, "");
      post
        .postData({
          url: "Dispensa/dlls/PrCierre02J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + punto + "|" + usuario + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido_anexo = JSON.parse(JSON.stringify(data));   
          this.print_anexo_excel();
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },
    consultar() {
      this.contenido = [];
      let punto = this.form.puntos.codigo_agc;
      let fecha = this.form.fechaInicial.replace(/\-/g, "");
      post
        .postData({
          url: "Dispensa/dlls/PrCierre01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + punto + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));          
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
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
          this.perfil = sessionStorage.Perfil;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Punto de Recaudo",
          value: "punto_rep",
          format: "string",
        },
        {
          title: "Usuario",
          value: "desccajero_rep",
          format: "string",
        },
        {
          title: "Valor",
          value: "totalexcel_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
      ];
      let punto = this.form.puntos.descripcion_agc;
      var fecha_inicial = this.form.fechaInicial;

      var header_format = [
        { text: "REPORTE CIERRE DE CAJA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Sede: ${punto}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Recaudos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE RECAUDOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },    
    print_anexo_excel() {
      var data = this.contenido_anexo;
      var data_parse = data;
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Punto de Recaudo",
          value: "punto_rep",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "consec_rep",
          format: "number",
        },
        {
          title: "Paciente",
          value: "descrip_paciente_rep",
          format: "string",
        },
        {
          title: "Id.Paciente",
          value: "idpaciente_rep",
          format: "string",
        },
        {
          title: "EPS",
          value: "descripeps_rep",
          format: "string",
        },
        {
          title: "Regimen",
          value: "nomregimen",
          format: "string",
        },
        
        {
          title: "Valor",
          value: "totalexcel_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Dispensa",
          value: "desccajero_rep",
          format: "string",
        },
      ];
      let punto = this.form.puntos.descripcion_agc;
      var fecha_inicial = this.form.fechaInicial;

      var header_format = [
        { text: "REPORTE CIERRE DE CAJA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Sede: ${punto}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Recaudos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE RECAUDOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
