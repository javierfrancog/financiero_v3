<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-alarm-snooze</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Lista de Espera</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
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
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                  depressed
                  large
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col
                class="d-flex mb-4 justify-end"
                v-if="prest_servicios.length != 0"
              >
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="prest_servicios.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider color="succes"></v-divider>

            <v-divider color="succes"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="id_paciente"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
            >
              <template v-slot:item.id_paciente="{ item }">
                {{ parseInt(item.id_paciente) }}
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


// Vue.component("downloadExcel", JsonExcel);
export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      soloanulados: null,
      pteradicar: null,
      ptedian: null,
      prest_servicios: [],
      headerCsv: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      headers: [
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Id_Paciente",
          align: "center",
          value: "id_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Apellido",
          align: "left",
          value: "apellido1_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Nombre",
          align: "left",
          value: "nombre1_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion Servicio",
          align: "left",
          value: "desc_servicio",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Entidad",
          align: "center",
          value: "entidad_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Profesional",
          value: "descripcion",
          class: "indigo--text blue lighten-5",
          align: "center",
        },
        {
          text: "Especialidad",
          value: "descrespc_tipo",
          class: "indigo--text blue lighten-5",
          align: "center",
        },
        {
          text: "Asignó",
          value: "usuarioagenda",
          class: "indigo--text blue lighten-5",
          align: "center",
        },

      ],
      empresa: [],
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      masivo_pdf: {
        data: [],
      },
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      },
    };
  },
  created() {
    this.get_empresa();
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
    print_reporte_excel() {
      var data = this.prest_servicios;
      var data_parse = data;

      var columnas = [
        {
          title: "Fecha de la Cita",
          value: "fecha",
          format: "fecha",
        },
        {
          title: "Id_Paciente",
          value: "id_paciente",
        },

        {
          title: "Primer Nombre",
          value: "nombre1_paciente",
        },
        {
          title: "Segundo Nombre",
          value: "nombre2_paciente",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_paciente",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_paciente",
        },

        {
          title: "Entidad",
          value: "entidad_paciente",
        },

        {
          title: "Descripcion Servicio",
          value: "desc_servicio",
          format: "fecha",
        },
        {
          title: "Profesional",
          value: "descripcion",
        },
        {
          title: "Especialidad",
          value: "descrespc_tipo",
        },
        {
          title: "Asignó",
          value: "usuarioagenda",
        },
      ];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var header_format = [
        { text: "REPORTE LISTA DE ESPERA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "List de espera",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-LISTADE ESPERA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    consultarServicios() {
      this.headerCsv = [
        "Reporte: Fecha inicial: ," +
          this.fecha_ini +
          ", Fecha final: , " +
          this.fecha_final.replace(/-/g, "/"),
        "",
      ];
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/RplistaesperaJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.fecha_ini.split("-").join("") +
            "|" +
            this.fecha_final.split("-").join("") +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.prest_servicios = JSON.parse(JSON.stringify(data));          
        })
        .catch((err) => {
          this.load_contrato = false;
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar reporte",
            estado: true,
          });
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
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar información de la empresa",
            estado: true,
          });
        });
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
<style lang="sass">
.v-data-table__wrapper td
  line-height: 2!important
</style>