<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :disabled="load_card"
        :loading="load_card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-hand-heart-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Consulta de Reportes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex justify-end" cols="6">
                <v-btn
                  color="indigo darken-3 white--text"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="cargarAgendamiento"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
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
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
               <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-show="item.id_at_reporte > 0" >

                    <v-btn
                      :hidden="item.fechaataux === '00000000' ? false : true"
                      color="indigo"
                      class="ma-2 white--text"
                      @click="get_pdf(item)"
                      small
                      v-on="on"
                      depressed
                      :disabled="parseInt(item.prservicio) == 0"
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </div>

                  </template>
                  <span>Descargar Soporte</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {},
  data() {
    return {
      search: null,
      pickerActual: false,
      pickerFin: false,

      load_personal: true,
      selectPersonal: null,
      load_table: false,
      texto_descripcion: null,
      fechaag: null,
      horaag: null,

      idpaciente: 0,
      nro_hist: 0,

      edadpaciente: "",
      epspaciente: "",
      sede: "0001",
      profesional: 0,
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },

      selectObjPersonal: [],
      datosagenda: [],
      consultorios: [],
      agendaPaciente: [],
      medicos: [],

      disabled: {
        guardar_hc: true,
        imprimir_hc: true,
        sgte_paciente: true,
        salirsin_hc: false,
      },

      form: {
        motivo: null,
      },
      tab: 0,
      personal: [],
      consecutivo: 0,
      sala: 0,

      tab2: null,
      dialogo: {
        estado: false,
        titulo: null,
        paciente: null,
        tipo: null,
        item: {},
      },
      edad: {
        anos: 0,
        meses: 0,
        dias: 0,
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      fecha_fin: this.$moment().format("YYYY-MM-DD"),
      historia: {
        estado: false,
        plantila: null,
      },
      errores: {
        salas: false,
        medico: false,
        condicion: false,
        causaing: false,
        diagnostico: false,
      },
      data: [],
      totales: {},
      headers: [
        {
          text: "AcciÃ³n",
          align: "left",
          value: "edit",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Descripcion paciente",
          align: "left",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Servicio",
          align: "center",
          value: "desc_servicio",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha Agenda",
          align: "center",
          value: "fecha",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Hora",
          align: "center",
          value: "id_hora",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Entidad",
          align: "center",
          value: "contrato",
          class: "indigo--text blue lighten-5" 
        },

        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Nro_AtenciÃ³n",
          align: "center",
          value: "prservicio",
          class: "indigo--text blue lighten-5",
        },

        // { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
      panel: [],
    };
  },
  created() {
    this.get_empresa();
    this.idpaciente = `${parseFloat(sessionStorage.Sesion.substr(16, 14))}`        
  },
  computed: {},
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|" + 98 + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_pdf(item) {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento = "PRS";
      let consecutivo = item.prservicio.replace(/\ /g, "");
      let nombrePdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      var ruta2 = `https://server100ts.net/pdfs/${nombrePdf}.pdf`;
      window.open(ruta2, "_blank");
    },

    cargarAgendamiento: function (value) {
      this.load_table = true;
      let atendidos = 9;
      let datos =
        sessionStorage.Sesion +
        "|" +
         0 +
        "|" +
         0 +
        "|" +
        atendidos +
        "|" + 
         1 +
         "|" + 
         this.idpaciente +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrAtencionJ.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.datosagenda = data;
          this.agendaPaciente = [];
          data.forEach((k, v) => {
            k.nro = (v + 1).toString().padStart(2, "0");
            if (k.identificacion) this.agendaPaciente.push(k);
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
    clear_form() {},

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    grabar_medico: function () {
      let medico = this.form.medico ? this.form.medico.codigo_sala : "";
      let fechaag = this.fechaag;
      let horaag = this.horaag;
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.profesional +
        "|" +
        this.sala +
        "|" +
        fechaag +
        "|" +
        horaag +
        "|" +
        medico +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrAtencion.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso exitoso",
            estado: false,
          });
          this.cargarAgendamiento();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al Grabar AtenciÃ³n",
            estado: true,
          });
        });
    },
    grabar_atencion: function (item) {
      let sala = item.identificacion;
      let fechaag = item.fecha;
      let horaag = item.id_hora.replace(":", "");
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.profesional +
        "|" +
        sala +
        "|" +
        fechaag +
        "|" +
        horaag +
        "|" +
        0 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrAtencion.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso exitoso",
            estado: false,
          });
          this.cargarAgendamiento();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al Grabar AtenciÃ³n",
            estado: true,
          });
        });
    },

    format_medico(val) {
      return `${val.descrip_sala}`;
    },
  },
};
</script>

