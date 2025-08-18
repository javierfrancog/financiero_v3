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
                >mdi-account-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Agendamiento</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="get_profesionales();                  
                  errores.punto_fact = false"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>


              <v-col class="d-flex" cols="12" sm="4">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-autocomplete
                  outlined
                  label="Sala"
                  :items="salas"
                  :item-text="format_salas"
                  item-value="nro"
                  hide-details
                  v-model="selectSala"
                  return-object
                  clearable
                  :error="errores.salas"
                ></v-autocomplete>
              </v-col>
<!-- 
              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  outlined
                  label="Salas"
                  :items="[
                    { text: 'Todas las Salas', value: '1000' },
                    { text: 'Sala rx', value: '9001' },
                    { text: 'Sala mamografia', value: '9002' },
                    { text: 'Sala ecografia', value: '9003' },
                    { text: 'Sala Biopsias', value: '9004' },
                    { text: 'Sala Densitomeria', value: '9005' },
                  ]"
                  return-object
                  v-model="selectSala"
                ></v-select>
              </v-col> -->

              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerActual"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_actual"
                      label="Fecha agendamiento"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @input="pickerActual = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  outlined
                  @click="print_reporte_excel"
                  :disabled="agendaPaciente.length == 0 ? true : false"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-switch
                  v-model="form.filtrobusq"
                  label="Buscar desde la fecha de agendamiento"
                ></v-switch>
              </v-col>
            </v-row>

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
              v-if="selectSala != null && selectContrato != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <table id="pdf_header_comp">
        <thead>
          <tr>
            <th>
              <img class="logo" :src="logoSrc" />
            </th>
            <th>
              <a class="nombre_print"></a>
              <br />Nit
              <a class="nit_print"></a>
            </th>
            <th colspan="5">
              <b class="nombredoc_print"></b>
              <br />
              <b>
                Número:
                <a class="consecutivo_print"></a>
              </b>
              <br />
              <b>Fecha:</b>
              <a class="fecha_print"></a>
              <br />
            </th>
          </tr>
        </thead>
      </table>
      <table id="pdf_body_comp">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cuenta</th>
            <th>Rut</th>
            <th>Documento</th>
            <th>c. costo</th>
            <th>Débito</th>
            <th>Crédito</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot></tfoot>
      </table>
    </div>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
    // JsonExcel
  },
  data() {
    return {
      condition: false,
      search: "",

      loader: false,
      singleExpand: true,
      expanded: [],
      agencias: [],      
      errores: {
        paciente: false,
        punto_fact: false,
      },


      servicio: "Imagenologia",
      load_contrato: true,
      load_table: false,
      pickerActual: false,
      selectContrato: null,
      selectSala: null,
      salas: [
        { identificacion: "9001", descripcion: "Sala rx", grupo: "RX" },
        { identificacion: "9002", descripcion: "Sala mamografia", grupo: "MM" },
        { identificacion: "9003", descripcion: "Sala ecografia", grupo: "EK" },
        { identificacion: "9004", descripcion: "Sala Biopsias", grupo: "BP" },
        {
          identificacion: "9005",
          descripcion: "Sala Densitomeria",
          grupo: "DT",
        },
      ],
      agendaPaciente: [],
      fecha_actual: this.$moment().format("YYYY-MM-DD"),

      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 60) || "Maximo 20 digitos",
      ],
      selectObjContratos: [],
      contratos: [],
      form: [],
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        {
          text: "Descripcion paciente",
          align: "left",
          value: "descrip_paciente",
        },
        { text: "Telefono", align: "left", value: "tel_paciente" },
        { text: "Sede", align: "center", value: "sede" },
        { text: "Descripcion", align: "left", value: "desc_servicio" },
        { text: "Fecha", align: "left", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
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
    this.cargarContratos();
    this.cargarTablaAg();    
  },
  watch: {
    selectContrato: function (value) {
      this.cargarAgendamiento(this.selectSala);
    },

    selectSala: function (value, text) {
      this.cargarAgendamiento(value);
    },

    fecha_actual: function (value) {
      this.cargarAgendamiento(this.selectSala);
    },
  },

  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  methods: {
    cargarAgendamiento: function (value = {}) {
      this.load_table = true;
      var buscar = this.form.filtrobusq ? "1" : "0";
      let sala = parseFloat(this.selectSala.codigo_sala);
      let itemContrato = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) return e;
      });

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        sala +
        "|" +
        1 +
        "|" +
        itemContrato[0].nro +
        "|" +
        buscar +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl102j.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.agendaPaciente = [];
          data.forEach((k, v) => {
            k.nro = (v + 1).toString().padStart(2, "0");
            this.agendaPaciente.push(k);
          });
          this.load_table = false;
        })
        .catch((err) => {
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
            estado: true,
          });
        });
    },

    format_salas(val) {
      return parseFloat(val.codigo_sala) + " - " + val.descrip_sala;
    },    
    get_profesionales() {
      this.loader = true;
      let agencia = this.form.punto_fact.codigo_agc
      post
        .postData({
          url: "Clinico/dlls/ClCfSalasJ.dll",
          data: sessionStorage.Sesion +
           "|" +          
          agencia +
           "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.salas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Salas",
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },    

    print_reporte_excel() {
      var data = this.agendaPaciente;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.tel_paciente = copia.tel_paciente.replace(/\,/g, "");
        data_parse.push(copia);
      });
      // data_parse.pop();

      var columnas = [
        {
          title: "Sede",
          value: "sede",
        },
        {
          title: "Paciente",
          value: "descrip_paciente",
        },
        {
          title: "Telefono",
          value: "tel_paciente",
        },
        {
          title: "Estudio",
          value: "desc_servicio",
        },
        {
          title: "Fecha",
          value: "fecha",
          format: "fecha",
        },
        {
          title: "Hora",
          value: "id_hora",
          format: "string",
        },
        {
          title: "Id Paciente",
          value: "id_paciente",
        },
        {
          title: "Usuario que Agenda",
          value: "usuarioagenda",
        },
        {
          title: "Fecha de Agendamiento",
          value: "fechareg",
        },
        {
          title: "Hora de Agendamiento",
          value: "horareg",
          format: "string",
        },

      ];

      var fecha_inicial = this.fecha_actual;
      var sala_procesada = this.selectSala.text;

      var header_format = [
        { text: "REPORTE AGENDAMIENTO", bold: true, size: 16 },
        `Fecha: ${fecha_inicial}`,
        `Sala: ${sala_procesada}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte agendas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-AGENDAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },    

    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
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

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    reset_impresion();
  }, 500);
}
</script>
