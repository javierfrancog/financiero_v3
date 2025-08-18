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
                >mdi-file-document-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >ActualizaciÃ³n de Historia Clinica ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-autocomplete
                  label="MÃ©dico"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="form.medico"
                  return-object
                  clearable
                  @change="agendaPaciente = []"
                  :error="errores.medico"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  :items="items_especialidad"
                  :item-text="format_especialidad"
                  hide-details
                  label="Especialidad"
                  v-model="form.especialidad"
                  return-object
                  @change="agendaPaciente = []"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Id_Paciente"
                  hide-details
                  v-model="form.id_paciente"
                  @keyup.enter="cargarAgendamiento()"
                ></v-text-field>
              </v-col>

              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargarAgendamiento()"
                  >Consultar</v-btn
                >
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
              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
              </template>
              <template v-slot:item.idpaciente_rep="{ item }">
                {{ parseInt(item.idpaciente_rep) }}
              </template>

              <template v-slot:item.btn_atender="{ item }">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  :disabled="item.nrohcl == 0"
                  @click="imprimir_hc(item, 1)"
                  >Imprimir</v-btn
                >
              </template>
              <template v-slot:item.btn_actualiza="{ item }">
                <v-btn
                  color="purple"
                  class="ma-2 white--text"
                  :disabled="item.nrohcl == 0"
                  @click="actualiza_hc(item, 1)"
                  >Actualizar</v-btn
                >
              </template>

              <template v-slot:item.descrip_paciente="{ item }">
                {{ item.nombre1_rep + " " + item.apellido1_rep }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="historia_gonom.estado"
      persistent
      width="1200"
      overflow-hidden
      scrollable
    >
      <v-card
        color="#3861ad"
        class="overflow-hidden white--text"
        :style="{
          position: 'relative',
        }"
      >
        <v-card-title color="indigo darken-1" dark>
          <v-row class="px-6 mt-0 justify-left">
            <span class="subtitle-1"
              >Paciente: {{ historia_gonom.paciente }}</span
            >
            <span class="subtitle-1 ml-10"
              >Edad: {{ edad.anos }} Años {{ edad.meses }} Meses{{
                edad.dias
              }}
              Dias</span
            >
            <span class="subtitle-1 ml-10 justify-end"
              >Acompañante: {{ historia_gonom.acompañante }}</span
            >
          </v-row>
          <v-row class="px-6 mt-6 justify-center">
            <div class="justify-end d-flex pb-4">
              <div class="d-flex ml-10">
                <v-btn
                  @click="func_expandir"
                  color="black darken-1"
                  class="white--text"
                  >Expandir
                </v-btn>
              </div>
              <div class="d-flex ml-5">
                <v-btn
                  @click="func_ocultar"
                  color="green darken-1"
                  class="white--text"
                >
                  Contraer</v-btn
                >
              </div>
            </div>
          </v-row>
        </v-card-title>

        <v-card-text
          :style="{
            overflow: 'auto',
          }"
        >
          <v-tabs
            v-model="tab"
            centered
            slider-color="red"
            background-color="#dde2f4"
          >
            <v-tab class="black--text" grow>Historia Clinica</v-tab>
            <v-tab class="black--text" grow v-model="tab2" ref="tab2"
              >Cierre Historia</v-tab
            >
          </v-tabs>
          <v-row>
            <v-divider
              class="mt-6"
              :style="{
                'border-width': '1px',
                'border-color': 'indigo',
              }"
            />
          </v-row>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <template>
                  <v-row class="d-flex mt-4 justify-center">
                    <v-col class="d-flex" cols="3">
                      <v-menu
                        v-model="pickeFechaIni"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="fecha_historia"
                            label="Fecha Historia"
                            append-icon="event"
                            hide-details
                            outlined
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>

                        <v-date-picker
                          v-model="fecha_historia"
                          @input="pickeFechaIni = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>

                  <v-expansion-panels v-model="panel" multiple focusable>
                    <!-- motivo de consulta                     -->
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <v-row class="px-6 mt-0">
                          <v-icon
                            class="px-6 mr-1"
                            color="orange accent-3"
                            x-large
                            >mdi-chat-alert-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >Motivo de Consulta</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <div>
                              <v-textarea
                                label="Motivo"
                                outlined
                                clearable
                                hide-details
                                v-model="form.motivo"
                                auto-grow
                                rows="1"
                                row-height="5"
                              ></v-textarea>
                            </div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- enfermedad actual -->
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="indigo" x-large
                            >mdi-emoticon-sick-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >2.Enfermedad Actual</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Enfermedad Actual"
                              v-model="form.enfactual"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Examen Fisico -->
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="green" x-large
                            >mdi-format-list-checks</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >ExÃ¡men FÃ­sico</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="ExÃ¡men fisico"
                              v-model="form.ex_fisico"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Incapacidad -->
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="red" x-large
                            >mdi-account-injury-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >Incapacidad</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row class="d-flex mt-4">
                          <v-col class="d-flex" cols="3">
                            <v-menu
                              v-model="pickeFechaIniinc"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.fechaini_inc"
                                  label="Fecha Inicial:"
                                  append-icon="event"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.fechaini_inc"
                                @change="calcular_fecha()"
                                @input="
                                  (errores.fechaini_inc = false),
                                    (pickeFechaIniinc = false)
                                "
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col class="d-flex" cols="2">
                            <v-autocomplete
                              label="Cantidad"
                              v-model="form.cantidad_inc"
                              :items="diasincapac"
                              hide-details
                              return-object
                              filled
                              @change="
                                calcular_fecha(), (errores.cantidad_inc = false)
                              "
                              shaped
                            ></v-autocomplete>
                          </v-col>

                          <v-col cols="3">
                            <v-text-field
                              v-model="form.fechafinal_inc"
                              label="Fecha Final"
                              append-icon="event"
                              hide-details
                              disabled
                              v-on="on"
                            ></v-text-field>
                          </v-col>

                          <v-col class="d-flex" cols="2">
                            <v-autocomplete
                              label="PrÃ³rroga"
                              v-model="form.prorroga"
                              :items="prorroga"
                              hide-details
                              return-object
                              filled
                              @change="errores.prorroga = false"
                              shaped
                            ></v-autocomplete>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col class="d-flex" cols="4">
                            <v-autocomplete
                              label="Origen"
                              v-model="form.origen"
                              :items="origen"
                              hide-details
                              return-object
                              filled
                              shaped
                              @change="
                                select_origen(), (errores.origen = false)
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete
                              :items="diagnosticos"
                              :item-text="format_diagnostico"
                              item-value="codigo"
                              label="Diagnostico"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.dx_inc"
                              :error="errores.diagnostico_inc"
                              @change="errores.diagnostico_inc = false"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row class="d-flex mt-4">
                          <v-col class="d-flex" cols="8">
                            <v-text-field
                              label="Observacion"
                              clearable
                              type="text"
                              v-model="form.observacion_inc"
                              hide-details
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-row class="mt-3 justify-center d-flex pb-4">
                    <div class="justify-end d-flex pb-4">
                      <div class="d-flex ml-10">
                        <v-btn
                          @click="tab_cerrar()"
                          color="indigo"
                          class="white--text"
                          >Cerrar Historia
                        </v-btn>
                      </div>
                    </div>
                  </v-row>
                </template>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-row class="d-flex justify-center col-12">
                <div class="justify-end d-flex pb-4">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <div class="d-flex mr-3">
                      <v-btn
                        @click="guardar_historia()"
                        color="indigo darken-1"
                        class="white--text"
                        :disabled="disabled.guardar_hc"
                        >Guardar Historia g
                      </v-btn>
                    </div>
                    <div class="d-flex mr-3">
                      <v-btn
                        @click="imprimir_hc"
                        :disabled="disabled.imprimir_hc"
                        color="orange darken-1"
                        class="white--text"
                        >Imprimir Historia
                      </v-btn>
                    </div>

                    <div class="d-flex mr-3">
                      <v-btn
                        @click="cerrar_dialogo_gonom"
                        color="green darken-1"
                        class="white--text"
                        :disabled="disabled.sgte_paciente"
                        >Cerrar
                      </v-btn>
                    </div>
                    <div class="d-flex mr-3">
                      <v-btn
                        @click="cerrar_dialogo_gonom"
                        color="red darken-1"
                        class="white--text"
                        :disabled="disabled.salirsin_hc"
                        >Salir sin Grabar
                      </v-btn>
                    </div>
                  </v-card-actions>
                </div>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <!-- <v-card color="blue-grey lighten-4" class="overflow-hidden"> -->
        <!-- <v-card-text class="pb-0"> -->

        <!-- </v-card-text> -->
        <!-- </v-card> -->
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;
import { historiaClinica } from "../../_formatos_sal.js";
import { OrdenMedica, incapacidad } from "../../_formatos_sal.js";
import PDFMerger from "pdf-merger-js/browser";

export default {
  components: {},
  data() {
    return {
      search: null,
      pickerActual: false,
      load_personal: true,
      selectPersonal: null,
      load_table: false,
      texto_descripcion: null,
      fecha_historia: this.$moment().format("YYYY-MM-DD"),
      pickeFechaIni: false,
      pickeFechaIniinc: false,
      idpaciente: 0,
      nro_hist: 0,
      medicos: [],
      item_select: [],
      datosagenda: [],
      plantilla: [],
      diagnosticos: [],

      seccion: [],
      agendaPaciente: [],
      items_especialidad: [],

      form: {
        motivo: null,
        medico: null,
        fechaini_inc: null,
        fechafinal_inc: null,
        cantidad_inc: null,
      },
      tab: 0,
      tab2: 0,

      personal: [],
      fechaag: null,
      horaag: null,
      consecutivo: 0,

      historia_gonom: {
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
      historia: {
        estado: false,
        plantila: null,
      },
      origen: [
        { text: "Enfermedad General", value: 1 },
        { text: "Enfermedad Laboral", value: 2 },
        { text: "Accidente Laboral", value: 3 },
        { text: "Accidente de TrÃ¡nsito", value: 4 },
        { text: "Otro", value: 9 },
      ],
      items_cldx: [
        { text: "ImpresiÃ³n Diagnostica", value: 1 },
        { text: "Confirmado Nuevo", value: 2 },
        { text: "Confirmado Repetido", value: 3 },
      ],
      disabled: {
        guardar_hc: true,
        imprimir_hc: true,
        sgte_paciente: true,
        salirsin_hc: false,
      },
      medicamentos: {
        estado: false,
        plantila: null,
      },
      examenes: {
        estado: false,
        plantila: null,
      },
      remision: {
        estado: false,
        plantila: null,
      },

      errores: {
        salas: false,
        cldx: false,
        condicion: false,
        causaing: false,
        diagnostico: false,
        medico: false,
      },

      headers: [
        {
          text: "Nro_Historia",
          align: "center",
          value: "nro_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha_rep",
          class: "indigo--text blue lighten-5",
          width: "120px",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "idpaciente_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Profesional",
          align: "center",
          value: "descrprofesional_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Especialidad",
          align: "center",
          value: "especialidad_rep",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Imprimir",
          align: "center",
          value: "btn_atender",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Actualizar",
          align: "center",
          value: "btn_actualiza",
          class: "indigo--text blue lighten-5",
        },

        // { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
      panel: [],
      diasincapac: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "6", value: 6 },
        { text: "7", value: 7 },
        { text: "8", value: 8 },
        { text: "9", value: 9 },
        { text: "10", value: 10 },
        { text: "11", value: 11 },
        { text: "12", value: 12 },
        { text: "13", value: 13 },
        { text: "14", value: 14 },
        { text: "15", value: 15 },
        { text: "16", value: 16 },
        { text: "17", value: 17 },
        { text: "18", value: 18 },
        { text: "19", value: 19 },
        { text: "20", value: 20 },
        { text: "21", value: 21 },
        { text: "22", value: 22 },
        { text: "23", value: 23 },
        { text: "24", value: 24 },
        { text: "25", value: 25 },
        { text: "26", value: 26 },
        { text: "27", value: 27 },
        { text: "28", value: 28 },
        { text: "29", value: 29 },
        { text: "30", value: 30 },
      ],
      prorroga: [
        { text: "Si", value: 1 },
        { text: "No", value: 2 },
      ],
    };
  },
  created() {
    this.get_empresa();
    this.get_profesionales();
    this.get_especialidad();
    this.get_diagnosticos();

    // this.form.id_paciente = 1121842825;
  },
  methods: {
    get_profesionales() {
      this.loader = true;
      let agencia = "0001";
      let dll = sessionStorage.Sesion.substring(0, 15);
      if (
        dll === "000000901099286" ||
        dll === "000000900767863" ||
        dll === "000000999999999"
      ) {
        dll = "Clinico/dlls/ClCfSalasJ.dll";
      } else {
        dll = "Clinico/dlls/CfAsistecJ.dll";
      }
      post
        .postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.medicos = JSON.parse(JSON.stringify(data));

          this.medicos.unshift({
            id: "0",
            descripcion: "Todos",
            descr_tipo: "",
          });

          this.form.medico = {
            id: "0",
            descripcion: "Todos",
            descr_tipo: "",
          };
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
    get_diagnosticos() {
      var $this = this;
      post
        .postData({
          url: "datos/base/CIE10.json",
          data: sessionStorage.Sesion + "|",
          method: "GET",
        })
        .then((data) => {
          $this.diagnosticos = data.cie10;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    async guardar_historia() {
      var sesion = sessionStorage.Sesion;
      let plano = {};
      let index = 0;
      let cantidad_lineas = 0;
      let num = 0;
      let name = "";
      let end = 0;
      let consec = 0;
      let nro_hc = this.item_select.nro_rep;
      let idpaciente = parseFloat(this.item_select.idpaciente_rep);
      let textob64 = "";
      let fecha_hc = this.fecha_historia.split("-").join("");
      let motivo = this.form.motivo;
      let textomotivo64 = window.btoa(unescape(encodeURIComponent(motivo)));
      cantidad_lineas = Math.ceil(textomotivo64.length / 900);
      let fechaini_inc = this.form.fechaini_inc
        ? this.form.fechaini_inc.split("-").join("")
        : 0;
      let fechafin_inc = this.form.fechafinal_inc
        ? this.form.fechafinal_inc.split("-").join("")
        : 0;
      let cant_inc = this.form.cantidad_inc ? this.form.cantidad_inc.value : 0;
      let prorroga = this.form.prorroga ? this.form.prorroga.value : 0;
      let origen = this.form.origen ? this.form.origen.value : 0;
      let dx_inc = this.form.dx_inc? this.form.dx_inc.codigo: "";

      let observ64 = window.btoa(
        unescape(encodeURIComponent(this.form.observacion_inc))
      );

      for (let index = 0; index < cantidad_lineas; index++) {
        num = parseFloat(index + 1);
        name = `DATOJ_001-${String(num).padStart(3, "0")}`;
        end = parseFloat(parseFloat(index + 1) * 900);
        plano[name] = `${num}|${textomotivo64.substring(end - 900, end)}`;
      }

      let enfactual = this.form.enfactual;
      let textoenfactual64 = window.btoa(
        unescape(encodeURIComponent(enfactual))
      );
      cantidad_lineas = Math.ceil(textoenfactual64.length / 900);

      for (let index = 0; index < cantidad_lineas; index++) {
        num = parseFloat(index + 1);
        name = `DATOJ_002-${String(num).padStart(3, "0")}`;
        end = parseFloat(parseFloat(index + 1) * 900);
        plano[name] = `${num}|${textoenfactual64.substring(end - 900, end)}`;
      }

      consec = 1;
      let ex_fisico = this.form.ex_fisico;
      textob64 = window.btoa(unescape(encodeURIComponent(ex_fisico)));
      cantidad_lineas = Math.ceil(textob64.length / 900);

      for (let index = 0; index < cantidad_lineas; index++) {
        num = parseFloat(index + 1);
        name = `DATOJ_006-${String(num).padStart(3, "0")}`;
        end = parseFloat(parseFloat(index + 1) * 900);
        plano[name] = `${num}|${textob64.substring(end - 900, end)}`;
      }
      let datosEnvio =
        sesion +
        "|" +
        idpaciente +
        "|" +
        nro_hc +
        "|" +
        fecha_hc +
        "|" +
        fechaini_inc +
        "|" +
        fechafin_inc +
        "|" +
        cant_inc +
        "|" +
        prorroga +
        "|" +
        origen +
        "|" +
        dx_inc +
        "|" +
        observ64 +
        "|";
      let data = {
        url: "Clinico/dlls/PrActHc.dll",
        data: { importarhtml: datosEnvio, ...plano },
        method: "",
        json: true,
      };

      post.postData(data).then((response) => {
        this.disabled.guardar_hc = true;
        this.disabled.imprimir_hc = false;
        this.disabled.sgte_paciente = false;
        this.disabled.salirsin_hc = true;
        this.clear_form;
        this.nro_hist = response[0];
      });
    },
    format_medico(val) {
      return (
        parseFloat(val.id) +
        " - " +
        val.descripcion.trim() +
        " - " +
        val.descr_tipo.trim()
      );
    },
    get_especialidad() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfespecialidadJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.items_especialidad = JSON.parse(JSON.stringify(data));

          this.items_especialidad.unshift({
            codigo_rep: "0",
            descripcion_rep: "Todas",
          });

          this.form.especialidad = {
            codigo_rep: "0",
            descripcion_rep: "Todas",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error en Especialidades",
            estado: true,
          });
        });
    },
    format_especialidad(val) {
      return `${val.descripcion_rep}`;
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
    cargarAgendamiento: function (value) {
      this.load_table = true;
      this.agendaPaciente = [];
      let paciente = this.form.id_paciente.trim();
      let profesional = parseFloat(this.form.medico.id);
      let especialidad = this.form.especialidad.codigo_rep;

      let datos =
        sessionStorage.Sesion +
        "|" +
        paciente +
        "|" +
        "0" +
        "|" +
        profesional +
        "|" +
        especialidad +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClHclinica02J.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.agendaPaciente = data;
          this.load_table = false;
        })
        .catch((err) => {
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Historias",
            estado: true,
          });
        });
    },
    calcular_fecha() {
      const fechafinal = new Date(this.form.fechaini_inc);
      let dias = this.form.cantidad_inc.value;
      fechafinal.setDate(fechafinal.getDate() + dias);
      const anio = fechafinal.getFullYear();
      const mes = String(fechafinal.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0
      const dia = String(fechafinal.getDate()).padStart(2, "0");
      this.form.fechafinal_inc = anio + "-" + mes + "-" + dia;
    },
    async actualiza_hc(item, estado) {
      this.item_select = item;
      let paciente = item.idpaciente_rep;
      this.idpaciente = paciente;
      let consecutivo = item.nro_rep;
      this.form.fechaini_inc = "";
      this.form.fechafinal_inc = "";
      this.form.prorroga = null;
      this.form.origen = null;
      this.form.dx_inc = null;
      this.form.observacion_inc = null;
      this.form.motivo = null;
      this.form.enfactual = null;
      this.form.ex_fisico = null;
      this.form.cantidad_inc = null;


      post
        .postData({
          url: "Clinico/dlls/ClHclinicaJ.dll",
          data:
            sessionStorage.Sesion + "|" + paciente + "|" + consecutivo + "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;

          data = JSON.parse(JSON.stringify(data))[0];
          data.edad_rep = data.edad_rep.replace("n", "ñ");
          this.historia_gonom.estado = true;
          let resultado = "";
          this.fecha_historia = item.fecha_rep;
          const motivo = data.secciones_rep.filter(
            (seccion_rep) => seccion_rep.seccion_rep === "001"
          );
          if (motivo) {
            motivo.forEach((item) => {
              resultado +=
                item.base1_rep +
                item.base2_rep +
                item.base3_rep +
                item.base4_rep +
                item.base5_rep +
                item.base6_rep +
                item.base7_rep +
                item.base8_rep +
                item.base9_rep +
                item.base10_rep +
                item.base11_rep +
                item.base12_rep +
                item.base13_rep +
                item.base14_rep +
                item.base15_rep +
                item.base16_rep +
                item.base17_rep +
                item.base18_rep +
                item.base19_rep +
                item.base20_rep +
                item.base21_rep +
                item.base22_rep +
                item.base23_rep +
                item.base24_rep +
                item.base25_rep +
                item.base26_rep +
                item.base27_rep +
                item.base28_rep +
                item.base29_rep +
                item.base30_rep;
            });
            const textoDecodificado = this.decodificar(resultado);
            this.form.motivo = textoDecodificado;
          } else {
            this.form.motivo = null;
          }
          resultado = "";

          const enf_actual = data.secciones_rep.filter(
            (seccion_rep) => seccion_rep.seccion_rep === "002"
          );
          if (enf_actual) {
            enf_actual.forEach((item) => {
              resultado +=
                item.base1_rep +
                item.base2_rep +
                item.base3_rep +
                item.base4_rep +
                item.base5_rep +
                item.base6_rep +
                item.base7_rep +
                item.base8_rep +
                item.base9_rep +
                item.base10_rep +
                item.base11_rep +
                item.base12_rep +
                item.base13_rep +
                item.base14_rep +
                item.base15_rep +
                item.base16_rep +
                item.base17_rep +
                item.base18_rep +
                item.base19_rep +
                item.base20_rep +
                item.base21_rep +
                item.base22_rep +
                item.base23_rep +
                item.base24_rep +
                item.base25_rep +
                item.base26_rep +
                item.base27_rep +
                item.base28_rep +
                item.base29_rep +
                item.base30_rep;
            });
            const textoDecodificado = this.decodificar(resultado);
            this.form.enfactual = textoDecodificado;
          } else {
            this.form.enfactual = null;
          }
          resultado = "";
          const exfisico = data.secciones_rep.filter(
            (seccion_rep) => seccion_rep.seccion_rep === "006"
          );
          if (exfisico) {
            exfisico.forEach((item) => {
              resultado +=
                item.base1_rep +
                item.base2_rep +
                item.base3_rep +
                item.base4_rep +
                item.base5_rep +
                item.base6_rep +
                item.base7_rep +
                item.base8_rep +
                item.base9_rep +
                item.base10_rep +
                item.base11_rep +
                item.base12_rep +
                item.base13_rep +
                item.base14_rep +
                item.base15_rep +
                item.base16_rep +
                item.base17_rep +
                item.base18_rep +
                item.base19_rep +
                item.base20_rep +
                item.base21_rep +
                item.base22_rep +
                item.base23_rep +
                item.base24_rep +
                item.base25_rep +
                item.base26_rep +
                item.base27_rep +
                item.base28_rep +
                item.base29_rep +
                item.base30_rep;
            });
            const textoDecodificado = this.decodificar(resultado);
            this.form.ex_fisico = textoDecodificado;
          } else {
            this.form.ex_fisico = null;
          }
          resultado = "";
          const incapacidad = data.secciones_rep.filter(
            (seccion_rep) => seccion_rep.seccion_rep === "114"
          );
          console.log(incapacidad)
          if (incapacidad.length > 0) {
            this.form.fechaini_inc = incapacidad[0].finiincap_rep;
            let cantidad = parseFloat(incapacidad[0].cantinc_rep);
            if (cantidad > 0) {
              this.form.cantidad_inc = this.diasincapac.find(
                (item) => item.value === cantidad
              );
            } else {
              this.form.cantidad_inc = null;
            }

            let origen = parseFloat(incapacidad[0].idorigen_rep);
            if (origen > 0) {
              this.form.origen = this.origen.find(
                (item) => item.value === origen
              );
            } else {
              this.form.origen = null;
            }
            let prorroga = parseFloat(incapacidad[0].prorroga_rep);
            if (prorroga > 0) {
              this.form.prorroga = this.prorroga.find(
                (item) => item.value === prorroga
              );
            } else {
              this.form.prorroga = null;
            }
            let dx_inc = incapacidad[0].dx1inc_rep.substring(0, 4);
            console.log(dx_inc);
            this.form.dx_inc = this.diagnosticos.find(
              (item) => item.codigo.trim() === dx_inc
            );
            let observacion = incapacidad[0].base2_rep;
            this.form.observacion_inc = this.decodificar(observacion);

            this.form.fechafinal_inc = incapacidad[0].ffinincap_rep;
            this.form.fechafinal_inc = incapacidad[0].ffinincap_rep;
          } else {
            this.form.fechaini_inc = null;
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al editar Historia",
            estado: true,
          });
        });
    },
    decodificar(textob64) {
      let binaryData = atob(textob64);

      let byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      let decoder = new TextDecoder("utf-8");
      return decoder.decode(byteArray);
    },
    async imprimir_hc(item, estado) {
      if (this.item_select) {
        item = this.item_select;
      }
      let paciente = item.idpaciente_rep;
      this.idpaciente = paciente;
      let consecutivo = item.nro_rep;

      let profesional = parseInt(item.idprofesional_rep);
      if (item.firma_rep == "2") {
        profesional = "0000000000";
      }

      post
        .postData({
          url: "Clinico/dlls/ClHclinicaJ.dll",
          data:
            sessionStorage.Sesion + "|" + paciente + "|" + consecutivo + "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;

          data = JSON.parse(JSON.stringify(data))[0];
          data.edad_rep = data.edad_rep.replace("n", "ñ");
          data.empresa = this.datosEmpresa;
          let profesional2 = parseInt(data.idprofes2_rep);

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = require(`../../assets/image/firmas/${parseFloat(
            profesional
          )}.png`);

          if (parseInt(profesional2) > 0) {
            let firma2_src = require(`../../assets/image/firmas/${parseFloat(
              profesional2
            )}.png`);

            let firma2 = await this.pdfs.getBase64(firma2_src);
            data.firma2 = firma2;
          }

          let logo = await this.pdfs.getBase64(logo_src);
          let firma = await this.pdfs.getBase64(firma_src);

          data.logo = logo;
          data.firma = firma;
          let blobHistoriaClinica = await historiaClinica(data, true);
          let arrBlob = await this.procesar_ordenes(
            consecutivo,
            profesional,
            1
          );
          arrBlob.unshift(blobHistoriaClinica);

          const merger = new PDFMerger();
          for (const file of arrBlob) {
            if (file) await merger.add(file);
          }

          const mergedPdf = await merger.saveAsBlob();
          const url = URL.createObjectURL(mergedPdf);

          window.open(url);

          await this.procesar_ordenes(consecutivo, profesional, 2);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir Historia",
            estado: true,
          });
        });
    },
    async procesar_ordenes(consecutivo, profesional, proceso) {
      let array = [];
      for await (const section of [111, 112, 113, 114]) {
        let print = await this.imprimir_ordenes_hc(
          section,
          consecutivo,
          profesional,
          proceso
        );
        if (print) array.push(print);
        if (proceso == 1) {
          return array;
        }
      }
    },
    tab_cerrar() {
      this.tab = 1;
      this.disabled.guardar_hc = false;
    },
    async imprimir_ordenes_hc(seccion, consecutivo, profesional, proceso) {
      return new Promise((res) => {
        post
          .postData({
            url: "Clinico/dlls/ClHclinica01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              seccion +
              "|" +
              this.idpaciente +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            data = JSON.parse(JSON.stringify(data))[0];
            let print_seccion = false;

            if (!data.idpaciente_rep) return res(false);

            // Si no encuentra seccion acaba todo

            for (let i = 0; i < data.secciones_rep.length; i++) {
              const el = data.secciones_rep[i];

              if (parseFloat(el.seccion_rep) === seccion) {
                print_seccion = true;
                if (proceso == 2) {
                  break;
                }
              } else {
                if (proceso == 1) {
                  return res(false);
                }
              }
            }
            if (!print_seccion) {
              return res(false);
            } else {
              data.empresa = this.datosEmpresa;

              try {
                // Cargar logos y firmas
                var logo_src = require(`../../assets/image/clientes/${parseFloat(
                  sessionStorage.Sesion.substr(0, 15)
                )}.png`);

                let firma_src = require(`../../assets/image/firmas/${parseFloat(
                  profesional
                )}.png`);
                let logo = await this.pdfs.getBase64(logo_src);
                let firma = await this.pdfs.getBase64(firma_src);
                data.logo = logo;
                data.firma = firma;

                // ImpresiÃ³n segÃºn la secciÃ³n
                if (seccion === 114) {
                  await incapacidad(data).then(() => {
                    console.log("ImpresiÃ³n de incapacidad terminada");
                    res(true); // Resuelve en caso de Ã©xito
                  });
                } else {
                  await OrdenMedica(data).then(() => {
                    console.log("ImpresiÃ³n de orden mÃ©dica terminada");
                    res(true); // Resuelve en caso de Ã©xito
                  });
                }
              } catch (error) {
                console.error("Error al procesar la orden:", error);
                res(false); // Resuelve en caso de error
              }
            }
          })
          .catch((err) => {
            console.error("Error en el servidor:", err);
            res(null);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Historia",
              estado: true,
            });
          });
      });
    },
    func_expandir() {
      this.panel = [...Array(10).keys()].map((k, i) => i);
    },
    func_ocultar() {
      this.panel = [];
    },
    cerrar_dialogo_gonom() {
      this.item_select = null;
      this.historia_gonom.estado = false;
      this.cargarAgendamiento();
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion.trim();
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

