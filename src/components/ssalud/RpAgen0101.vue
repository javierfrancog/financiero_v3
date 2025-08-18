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
                >Reporte Agendamiento ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_profesionales();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="4">
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
              <v-col class="d-flex" cols="4">
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
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="Médico"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="selectMedico"
                  return-object
                  clearable
                  :error="errores.medico"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="4">
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
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="cargarAgendamiento()"
                  :disabled="agendaPaciente.length == 0"
                >
                  Refrescar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>

              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="agendaPaciente.length == 0"
                >
                  Generar Excel
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
              <v-col class="d-flex" cols="12" sm="6">
                <v-switch
                  v-model="form.vacios"
                  label="Incluir horarios Vacios"
                  @change="this.cargarAgendamiento"
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
              v-if="selectMedico != null && selectContrato != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              :item-class="row_classes"
              class="elevation-1"
            >
              <template v-slot:item.id_paciente="{ item }">
                {{ parseInt(item.id_paciente) }}
              </template>
              <template v-slot:item.nroprserv_rep="{ item }">
                {{ parseInt(item.nroprserv_rep) }}
              </template>
              <template v-slot:item.nrohc_rep="{ item }">
                {{ parseInt(item.nrohc_rep) }}
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
// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
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
      selectMedico: null,
      medicos: [],
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
        { text: "Fecha", align: "left", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        {
          text: "Descripcion paciente",
          align: "left",
          value: "descrip_paciente",
        },
        { text: "Telefono", align: "left", value: "tel_paciente" },
        { text: "Sede", align: "center", value: "sede" },
        { text: "Descripcion", align: "left", value: "desc_servicio" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
        { text: "Nro Servicio", align: "center", value: "nroprserv_rep" },
        { text: "Nro Historia", align: "center", value: "nrohc_rep" },
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
      this.cargarAgendamiento(this.selectMedico);
    },

    selectMedico: function (value, text) {
      this.cargarAgendamiento(value);
    },

    fecha_actual: function (value) {
      this.cargarAgendamiento(this.selectMedico);
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
    row_classes(item) {
      if (item.nrohc_rep > 0) {
        return "light-green lighten-5";
      }
      if (item.nroprserv_rep > 0 && item.nrohc_rep < 1) {
        return "amber lighten-4";
      }
    },
    cargarAgendamiento: function (value = {}) {
      this.load_table = true;
      var buscar = this.form.filtrobusq ? "1" : "0";
      var vacios = this.form.vacios ? "1" : "0";
      let medico = parseFloat(this.selectMedico.id);
      let itemContrato = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) return e;
      });

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        medico +
        "|" +
        1 +
        "|" +
        itemContrato[0].nro +
        "|" +
        buscar +
        "|" +
        0 +
        "|" +
        vacios +
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

    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
    },
    get_profesionales() {
      this.loader = true;
      let agencia = 1;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.medicos = JSON.parse(JSON.stringify(data));
          this.medicos.unshift({
            id: "0",
            descr_tipo: "Todos",
            descripcion: "",
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Medicos",
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
        copia.tel_paciente = el.tel_paciente.replace(/\,/g, "") || 0;

        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Profesional/Sala",
          value: "descripcion",
        },

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
      var medico = this.selectMedico.descripcion;

      var header_format = [
        { text: "REPORTE AGENDAMIENTO", bold: true, size: 16 },
        `Fecha: ${fecha_inicial}`,
        `Medico: ${medico}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Agendamiento",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-AGENDAMIENTO-${new Date().getTime()}`,
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
              text: parseInt(k.nro) + " - " + k.descripcion + "-" + k.detalle,
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
</script>
