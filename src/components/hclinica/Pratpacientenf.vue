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
                >Enfermerí­a -Atención del Paciente-</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <!-- <v-col class="d-flex" cols="4">
                <v-text-field
                  label="Profesional MÃ©dico"
                  outlined
                  hide-details
                  filled
                  v-model="form.descripPersonal"
                  disabled
                ></v-text-field>
              </v-col> -->
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  outlined
                  label="Consultorio"
                  :items="consultorios"
                  :item-text="format_consultorios"
                  item-value="codigo_rep"
                  hide-details
                  v-model="form.consultorio"
                  return-object
                  clearable
                  @change="cargarAgendamiento"
                  :error="errores.consultorio"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
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
                      label="Fecha AtenciÃ³n"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @input="
                      pickerActual = false;
                      fecha_fin = fecha_actual;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-menu
                  v-model="pickerFin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_fin"
                      label="Fecha AtenciÃ³n"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_fin"
                    @input="pickerFin = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
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
              <v-col class="d-flex justify-center" cols="3">
                <v-switch
                  v-model="form.atendidos"
                  @change="cargarAgendamiento()"
                  label="Ver Solo Atendidos"
                ></v-switch>
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
                    <v-btn
                      :hidden="item.fechaataux === '00000000' ? true : false"
                      color="green"
                      class="ma-2 white--text"
                      @click="grabar_atencion(item)"
                      v-on="on"
                      depressed
                      small
                      :disabled="
                        parseInt(item.prservicio) == 0 || item.fechaataux > 0
                      "
                    >
                      Atender
                    </v-btn>
                    <v-btn
                      color="orange"
                      class="ma-2 white--text"
                      :disabled="item.turno < 1 || item.turno == 0"
                      @click="llamar_cita(item, 1)"
                      >Llamar</v-btn
                    >
                  </template>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="item.fechaataux === '00000000' ? true : false"
                      color="purple"
                      class="ma-2 white--text"
                      @click="subir_soportes(item)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir Pdf</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-show="item.id_at_reporte > 0">
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
      <v-dialog
        v-model="dialogo_archivo.estado"
        width="600"
        max-width="90%"
        persistent
      >
        <v-card
          :loading="dialogo_archivo.loader"
          :disabled="dialogo_archivo.loader"
        >
          <v-card-title>Adjuntar documento</v-card-title>
          <v-card-text>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex" cols="12">
                <v-autocomplete
                  outlined
                  label="MÃ©dico Firmante"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="form.medico"
                  return-object
                  clearable
                  :error="errores.medico"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-file-input
                  label="Buscar PDF"
                  outlined
                  chips
                  counter
                  color="blue darken-1"
                  hide-details
                  :show-size="1000"
                  accept="application/pdf"
                  v-model="dialogo_archivo.model"
                  id="archivo_pdf"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
            <v-btn
              depressed
              color="blue darken-2"
              class="white--text px-12 mx-5"
              @click="up_file_drive"
              >Subir archivo</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      agendaPaciente: [],
      medicos: [],
      consultorios: [],

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
          class: "indigo--text blue lighten-5",
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
    this.get_consultorios();
    this.get_medicos();
  },
  computed: {},
  methods: {
    subir_soportes(item) {
      this.dialogo_archivo.estado = true;
      this.dialogo_archivo.ruta_pdf = item.rutapdf;
      this.dialogo_archivo.consecutivo = item.prservicio.replace(/\ /g, "");
      this.form.medico = "";
      this.sala = item.identificacion;
      this.fechaag = item.fecha;
      this.horaag = item.id_hora.replace(":", "");
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    format_consultorios(val) {
      return `${val.descripcion_rep}`;
    },
    async up_file_drive() {
      let file = this.dialogo_archivo.model;
      if (!file) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        // this.card_estado = true;
        let session = sessionStorage.Sesion;
        let agencia = sessionStorage.Sede;
        let empresa = parseFloat(this.datosEmpresa.id_empr);
        let idagenda = this.sala + this.fechaag + this.horaag;
        let medico = this.form.medico ? this.form.medico.id : "";
        let consecutivo = this.dialogo_archivo.consecutivo;
        let cargue_pdf = this.dialogo_archivo.model.name;
        let tipodoc = 2;
        let item = 1;
        let nombre_pdf = empresa + "_ENF_" + consecutivo + ".pdf";

        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("file", this.dialogo_archivo.model);
        data.append("fecha", this.fechaag);
        data.append("id_agenda", idagenda);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/salud.php",
          // "https://server1ts.net//financiero/inc/cargue.drive.enf.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.dialogo_archivo.loader = false;
        this.dialogo_archivo.estado = false;
        this.grabar_medico();
        this.cancelar_subida();

        this.$emit("snack", {
          color: "success",
          text: "Soporte Guardado Correctamente",
          estado: true,
        });
        this.cargarAgendamiento();
      }
    },
    up_file() {
      let fecha = this.fechaag.substr(0, 4);
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let medico = this.form.medico ? this.form.medico.id : "";
      let tipoDocumento = "PRS" + fecha;
      let consecutivo = this.dialogo_archivo.consecutivo;
      this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      let file = this.dialogo_archivo.model;

      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else if (!medico) {
        this.send_error("Debe Seleccionar un MÃ©dico");
      } else {
        this.dialogo_archivo.loader = true;
        this.dialogo_archivo.estado = false;

        var ruta = `${this.dialogo_archivo.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/up.pdf.php", {
          method: "POST",
          body: archivo,
        }).then((res) => res.json());
        this.grabar_medico();
        this.cancelar_subida();

        this.$emit("snack", {
          color: "success",
          text: res.msj,
          estado: true,
        })

          .catch((err) => {
            this.dialogo_archivo.loader = false;
            this.dialogo_archivo.estado = false;
            this.send_error("Ha ocurrido un error subiendo el PDF");
          })
          .then((res) => {
            this.dialogo_archivo.loader = false;
            this.dialogo_archivo.estado = false;
            if (res.code == 0) {
              this.grabar_medico();
              this.cancelar_subida();

              this.$emit("snack", {
                color: "success",
                text: res.msj,
                estado: true,
              });
            } else {
              this.cancelar_subida();
              this.send_error(res.msj);
            }
          });
      }
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.consecutivo = null;
    },
    get_pdf(item) {
      if (item.fecha < 20240520) {
        this.get_pdf_anterior(item);
      } else if (item.fecha < 20241101) {
        this.get_pdf_anterior_2(item);
      } else {
        let empresa = parseFloat(this.datosEmpresa.id_empr);
        let consecutivo = item.prservicio;
        let nombre_pdf = empresa + "_ENF_" + consecutivo + ".pdf";
        const url =
          "https://storage.googleapis.com/documentos_titan/SALUD/" + nombre_pdf;

        const timestamp = new Date().getTime(); // Genera un timestamp Ãºnico
        const urlSinCache = `${url}?_=${timestamp}`;
        window.open(urlSinCache, "_blank"); // Abre el PDF
      }
    },
    get_pdf_anterior_2(item) {
      let ruta = item.iddriverep_docs;
      const url =
        `https://drive.google.com/file/d/` +
        ruta.trim() +
        `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
    },
    get_pdf_anterior(item) {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let fecha = item.fecha.substr(0, 4);
      let fechasop = item.fechasop;
      let tipoDocumento = "PRS";
      if (fecha > 20240220 || fechasop > 0) {
        tipoDocumento = "PRS" + fecha;
      }
      let consecutivo = item.prservicio.replace(/\ /g, "");
      let nombrePdf = `${empresa}_${tipoDocumento}_${consecutivo}`;
      var ruta2 = `https://server100ts.net/pdfs/${nombrePdf}.pdf`;
      window.open(ruta2, "_blank");
    },

    cerrar_dialogo() {
      this.historia.estado = false;
      this.cargarAgendamiento();
      this.clear_form();
    },
    get_consultorios() {
      this.profesional = sessionStorage.Sesion.substr(15, 15);

      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfConsultJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.consultorios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consultorios",
            estado: true,
          });
        });
    },
    get_medicos() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + 9 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.medicos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consultorios",
            estado: true,
          });
        });
    },
    cargarAgendamiento: function (value) {
      this.load_table = true;
      // this.fecha_actual = "2022-10-29";

      let atendidos = this.form.atendidos ? "9" : "0";
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.fecha_fin.split("-").join("") +
        "|" +
        atendidos +
        "|" +
        +1 +
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
    llamar_cita(item, tipo) {
      let agenciatr = item.turno.substr(8, 4);
      let codtr = item.turno.substr(12, 6);
      let idtr = item.turno.substr(18, 4);
      let agenciavt = agenciatr;
      let idvt = item.identificacion;
      let consultorio = this.form.consultorio.descripcion_rep.trim();
      let total = 1;
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/Prfilaturno01.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agenciatr +
            "|" +
            codtr +
            "|" +
            idtr +
            "|" +
            agenciavt +
            "|" +
            idvt +
            "|" +
            tipo +
            "|" +
            total +
            "|" +
            consultorio +
            "|",
          method: "",
        })
        .then((data) => {
          let mensaje = "En llamado";
          this.$emit("snack", {
            color: "success",
            text: mensaje,
            estado: true,
          });
          // this.buscar_turnos(9);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al llamar Turno",
            estado: true,
          });
        });
    },
    grabar_medico: function () {
      let medico = this.form.medico ? this.form.medico.id : "";
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
    grabar_atencion(item) {
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
          this.atender(item);
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
    atender(item, tipo, evento) {
      let agenciatr = item.turno.substr(8, 4);
      let codtr = item.turno.substr(12, 6);
      let idtr = item.turno.substr(18, 4);
      let agenciavt = agenciatr;
      let idvt = item.identificacion;

      let total = 1;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/Prfilaturno01.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agenciatr +
            "|" +
            codtr +
            "|" +
            idtr +
            "|" +
            agenciavt +
            "|" +
            idvt +
            "|" +
            2 +
            "|" +
            total +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Paciente Atendido",
            estado: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al llamar Turno",
            estado: true,
          });
        });
    },
    format_medico(val) {
      return `${val.descripcion}`;
    },
  },
};
</script>

