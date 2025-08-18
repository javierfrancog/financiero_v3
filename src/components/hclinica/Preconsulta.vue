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
                >mdi-account-search-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                <v-row class="d-flex mb-4 justify-center" no-gutters>
                  <v-col class="d-flex mt-3" cols="4"
                    >Preconsulta MÃ©dica
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-3"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
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
                      label="Fecha Agenda"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @change="cargarAgendamiento()"
                    @input="pickerActual = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  outlined
                  label="MÃ©dico"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="form.medico"
                  return-object
                  clearable
                  @change="cargarAgendamiento()"
                  :error="errores.medico"
                ></v-autocomplete>
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
              v-if="agendaPaciente"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.btn_atencion="{ item }">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="abrir_historia(item)"
                  >{{ (text = "Preconsulta") }}</v-btn
                >
              </template>

              <!-- <template v-slot:item.btn_atender="{ item }">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  :disabled="item.nrohcl == 0"
                  @click="imprimir_hc(item, 1)"
                  >Imprimir</v-btn
                >
              </template> -->
              <template v-slot:item.id_paciente="{ item }">
                {{ item.id_paciente.trim().replace(/^0+/, "") }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="mt-3 px-6">
        <v-toolbar class="mt-1 px-6" color="indigo">
          <span class="title col-12 white--text">{{ dialogo.titulo }}</span>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />
        </v-toolbar>
        <v-card-text>
          <template>
            <v-expansion-panels v-model="panel" multiple focusable>
              <v-expansion-panel v-show="secc_enfactual">
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
                  <v-row class="px-6 mt-1">
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        clearable
                        label="Enfermedad Actual"
                        v-model="form.enf_actual"
                        hide-details
                        auto-grow
                        rows="1"
                        row-height="5"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel v-show="secc_signos">
                <v-expansion-panel-header>
                  <v-row class="px-6 mt-0">
                    <v-icon class="px-6 mr-1" color="red" x-large
                      >mdi-clipboard-pulse-outline</v-icon
                    >
                    <span class="Heading 3 font-weight-medium"
                      >4.Signos Vitales</span
                    >
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="2">
                      <span class="subtitle-1">TensiÃ³n</span>
                      <v-icon
                        class="px-6 mr-1"
                        :style="{
                          color: getColorTension,
                        }"
                        >mdi-heart-pulse</v-icon
                      >
                    </v-col>
                    <v-col cols="2">
                      <span class="subtitle-1">F.CardÃ­aca</span>
                      <v-icon
                        class="px-6 mr-1"
                        :style="{
                          color: getColorFC,
                        }"
                        >mdi-pulse</v-icon
                      >
                    </v-col>
                    <v-col cols="2">
                      <span class="subtitle-1">F.Respiratoria</span>
                      <v-icon
                        class="px-6 mr-2"
                        :style="{
                          color: getColorFresp,
                        }"
                        >mdi-lungs</v-icon
                      >
                    </v-col>
                    <v-col cols="2">
                      <span class="subtitle-1">Temperatura</span>
                      <v-icon
                        class="px-6 mr-1"
                        :style="{
                          color: getColorTemp,
                        }"
                        >mdi-emoticon-sick-outline</v-icon
                      >
                    </v-col>
                    <v-col cols="2">
                      <span class="subtitle-1">SaturaciÃ³n</span>
                      <v-icon
                        class="px-6 mr-1"
                        :style="{
                          color: getColorTemp,
                        }"
                        >mdi-emoticon-sick-outline</v-icon
                      >
                    </v-col>

                    <v-col cols="2">
                      <span class="subtitle-1">Peso</span>
                      <v-icon class="px-6 mr-1" :style="{ color: getColorImc }"
                        >mdi-weight-kilogram</v-icon
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="d-flex">
                        <v-text-field
                          label="Sys"
                          hide-details
                          v-model="form.systole"
                        ></v-text-field>
                        <v-text-field
                          label="Diast"
                          hide-details
                          v-model="form.diastole"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="2">
                      <div>
                        <v-text-field
                          label="F.c."
                          hide-details="auto"
                          v-model="form.frecard"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="2">
                      <div>
                        <v-text-field
                          label="F.Respiratoria"
                          hide-details="auto"
                          v-model="form.freresp"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="2">
                      <div>
                        <v-text-field
                          label="Temperatura"
                          hide-details="auto"
                          v-model="form.tempera"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="2">
                      <div>
                        <v-text-field
                          label="O2Sat"
                          hide-details="auto"
                          v-model="form.saturacion"
                        ></v-text-field>
                      </div>
                    </v-col>

                    <v-col cols="2">
                      <div>
                        <v-text-field
                          label="Peso"
                          hide-details="auto"
                          v-model="form.peso"
                          @change="get_imc()"
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-divider
                      class="mt-6"
                      :style="{
                        'border-width': '1px',
                        'border-color': 'indigo',
                      }"
                    />
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <span class="subtitle-1">Talla</span>
                      <v-icon class="px-6 mr-1"
                        >mdi-human-male-height-variant</v-icon
                      >
                    </v-col>
                    <v-col cols="1">
                      <span class="subtitle-1">I.M.C</span>
                      <v-icon
                        class="px-6 mr-1"
                        :style="{
                          color: getColorImc,
                        }"
                        >mdi-human-handsdown</v-icon
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <div>
                        <v-text-field
                          label="Talla"
                          hide-details="auto"
                          v-model="form.talla"
                          @change="get_imc()"
                        ></v-text-field>
                      </div>
                    </v-col>

                    <v-col cols="1">
                      <div>
                        <v-text-field
                          label="Imc"
                          disabled
                          hide-details="auto"
                          v-model="form.imc"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <div>
                        <v-text-field
                          label="ClasificaciÃ³n"
                          hide-details="auto"
                          v-model="form.clasificaimc"
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-divider
                      class="mt-6"
                      :style="{
                        'border-width': '1px',
                        'border-color': 'orange',
                      }"
                    />
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- paraclinicos -->
              <v-expansion-panel>
                <v-expansion-panel-header color="#e2e2f3">
                  <v-row class="px-6 mt-0">
                    <v-icon class="px-6 mr-1" color="orange" x-large
                      >mdi-account-search</v-icon
                    >
                    <span class="Heading 3 font-weight-medium"
                      >7.ParaclÃ­nicos</span
                    >
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row class="px-6 mt-1">
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        clearable
                        label="Paraclinicos"
                        v-model="form.paraclinicos"
                        hide-details
                        auto-grow
                        rows="1"
                        row-height="5"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- analisis -->
              <v-expansion-panel>
                <v-expansion-panel-header color="#e2e2f3">
                  <v-row class="px-6 mt-0">
                    <v-icon class="px-6 mr-1" color="grey darken-4" x-large
                      >mdi-clipboard-text-search-outline</v-icon
                    >
                    <span class="Heading 3 font-weight-medium">9.AnÃ¡lisis</span>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row class="px-6 mt-1">
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        clearable
                        label="AnÃ¡lisis"
                        v-model="form.analisis"
                        hide-details
                        auto-grow
                        rows="1"
                        row-height="5"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>

          <!-- <v-row class="mt-2">
            <v-col cols="12">
              <v-textarea
                label="Enfermedad Actual"
                outlined
                clearable
                hide-details
                v-model="form.enf_actual"
                auto-grow
                rows="1"
                row-height="10"
                :error="errores.enf_actual"
                @input="errores.enf_actual = false"
                @change="errores.enf_actual = false"
              ></v-textarea>
            </v-col>
          </v-row> -->

          <v-row class="d-flex justify-center">
            <v-col class="mt-4 d-flex" cols="2">
              <v-btn
                color="green"
                class="white--text mr-3"
                @click="guardar_preconsulta()"
                large
                depressed
              >
                Grabar
              </v-btn>
            </v-col>

            <v-col class="mt-4 d-flex" cols="2">
              <v-btn
                color="red"
                class="white--text mr-3"
                @click="dialogo.estado = false"
                large
                depressed
              >
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row class="mb-3">
        <v-spacer></v-spacer>
      </v-row>
    </v-dialog>
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
      load_table: false,
      texto_descripcion: null,
      pickeFechaIni: false,

      idpaciente: 0,

      edadpaciente: "",
      epspaciente: "",
      sede: "0001",
      profesional: 0,

      medicos: [],
      datosagenda: [],
      agendaPaciente: [],
      panel: [],
      secc_signos: true,
      secc_enfactual: true,

      disabled: {
        guardar_hc: true,
        imprimir_hc: true,
        sgte_paciente: true,
        salirsin_hc: false,
      },

      form: {
        enf_actual: "",
        paraclinicos: "",
        analisis: "",
        systole: "",
        diastole: "",
        frecard: "",
        freresp: "",
        tempera: "",
        peso: "",
        talla: "",
        imc: "",
        clasifimc: "",
        saturacion: "",
      },
      fechaag: null,
      horaag: null,
      consecutivo: 0,
      item_select: null,

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
      errores: {
        enf_actual: false,
      },
      headers: [
        {
          text: "AcciÃ³n",
          align: "center",
          value: "btn_atencion",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Nro",
          align: "center",
          value: "nro",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion paciente",
          align: "center",
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
          text: "Fecha",
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
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Entidad",
          align: "center",
          value: "contrato",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Estado",
          align: "center",
          value: "preconsulta_rep",
          class: "indigo--text blue lighten-5",
        },
      ],
      load_card: false,
    };
  },
  created() {
    this.get_empresa();
    this.get_profesionales();
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.form.espera = true;
          this.form.atendidos = false;
          this.form.todos = false;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_profesionales() {
      this.loader = true;
      let agencia = 0;
      let dll = "Clinico/dlls/CfAsistecJ.dll";
      post
        .postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + agencia + "|",
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
            text: "Error al cargar Profesionales",
            estado: true,
          });
        });
    },
    async guardar_preconsulta() {
      if (!this.form.enf_actual) {
        this.errores.enf_actual = true;
        this.send_error("Debe registrar la enfermedad actual !!");
      } else {
        var sesion = sessionStorage.Sesion;
        let fecha_ag = this.item_select.fecha;
        let hora_ag = this.item_select.id_hora.replace(/\:/g, "");
        let paciente = parseFloat(this.item_select.id_paciente);
        let profesional = this.form.medico.id;
        let plano = {};
        let index = 0;
        let cantidad_lineas = 0;
        let num = 0;
        let name = "";
        let end = 0;

        let enf_actual = this.form.enf_actual;
        let textoenf_actual = window.btoa(
          unescape(encodeURIComponent(enf_actual))
        );
        cantidad_lineas = Math.ceil(textoenf_actual.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_002-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textoenf_actual.substring(end - 900, end)}`;
        }

        let systole = this.form.systole;
        let diastole = this.form.diastole;
        let frecard = this.form.frecard;
        let freresp = this.form.freresp;
        let tempera = this.form.tempera;
        let peso = this.form.peso;
        let talla = this.form.talla;
        let imc = this.form.imc;
        let sato2 = this.form.saturacion;

        let paraclinicos = this.form.paraclinicos;
        let textoparac64 = window.btoa(
          unescape(encodeURIComponent(paraclinicos))
        );
        cantidad_lineas = Math.ceil(textoparac64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_007-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textoparac64.substring(end - 900, end)}`;
        }

        let analisis = this.form.analisis;
        let textoanalis64 = window.btoa(unescape(encodeURIComponent(analisis)));
        cantidad_lineas = Math.ceil(textoanalis64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_009-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textoanalis64.substring(end - 900, end)}`;
        }

        let datosEnvio =
          sesion +
          "|" +
          paciente +
          "|" +
          profesional +
          "|" +
          fecha_ag +
          "|" +
          hora_ag +
          "|" +
          systole +
          "|" +
          diastole +
          "|" +
          frecard +
          "|" +
          freresp +
          "|" +
          tempera +
          "|" +
          sato2 +
          "|" +
          peso +
          "|" +
          talla +
          "|" +
          imc +
          "|";
        let data = {
          url: "Clinico/dlls/Preconsulta.dll",
          data: { importarhtml: datosEnvio, ...plano },
          method: "",
          json: true,
        };

        post.postData(data).then((response) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.dialogo.estado = false;
          this.disabled.guardar_hc = true;
          this.disabled.imprimir_hc = false;
          this.clear_form;
          this.cargarAgendamiento();
        });
      }
    },
    abrir_historia(item) {
      this.clear_form();

      this.item_select = item;
      this.dialogo.titulo =
        item.descrip_paciente.trim() +
        " Años:" +
        item.anosedad_rep.trim() +
        " Meses:" +
        item.mesesedad_rep.trim() +
        " Dias:" +
        item.diasedad_rep.trim();
      this.form.enf_actual = "";

      this.dialogo.estado = true;

      let base64String =
        item.base1_rep.trim() +
        item.base2_rep.trim() +
        item.base3_rep.trim() +
        item.base4_rep.trim() +
        item.base5_rep.trim() +
        item.base6_rep.trim() +
        item.base7_rep.trim() +
        item.base8_rep.trim() +
        item.base9_rep.trim() +
        item.base10_rep.trim() +
        item.base11_rep.trim() +
        item.base12_rep.trim() +
        item.base13_rep.trim() +
        item.base14_rep.trim() +
        item.base15_rep.trim() +
        item.base16_rep.trim() +
        item.base17_rep.trim() +
        item.base18_rep.trim() +
        item.base19_rep.trim() +
        item.base20_rep.trim() +
        item.base21_rep.trim() +
        item.base22_rep.trim() +
        item.base23_rep.trim() +
        item.base24_rep.trim() +
        item.base25_rep.trim() +
        item.base26_rep.trim() +
        item.base27_rep.trim() +
        item.base28_rep.trim() +
        item.base29_rep.trim() +
        item.base30_rep.trim() +
        item.base31_rep.trim() +
        item.base32_rep.trim() +
        item.base33_rep.trim() +
        item.base34_rep.trim() +
        item.base35_rep.trim() +
        item.base36_rep.trim() +
        item.base37_rep.trim() +
        item.base38_rep.trim() +
        item.base39_rep.trim();

      let binaryData = atob(base64String);

      let byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }
      let decoder = new TextDecoder("utf-8");
      let preconsulta = decoder.decode(byteArray);
      this.form.enf_actual = preconsulta;
    },

    cerrar_dialogo() {
      this.historia.estado = false;
      this.cargarAgendamiento();
      this.clear_form();
    },

    cargarAgendamiento: function (value) {
      this.load_table = true;
      this.loader = true;
      let profesional = parseFloat(this.form.medico.id);

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        profesional +
        "|" +
        1 +
        "|" +
        3 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/Preconsulta01J.dll",
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
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
            estado: true,
          });
        });
    },
    clear_form() {
      this.form.enf_actual = null;
      this.form.paraclinicos = null;
      this.form.analisis = null;

      this.form.systole = null;
      this.form.diastole = null;
      this.form.frecard = null;
      this.form.freresp = null;
      this.form.tempera = null;
      this.form.saturacion = null;
      this.form.peso = null;
      this.form.talla = null;
      this.form.imc = null;
      this.form.clasificaimc = null;
    },
    getColorCardiaca() {
      if (!this.form.diastole) return "rgba(0, 0, 0, 0.54)";

      let diastole = parseInt(this.form.diastole) || 0;
      if (diastole > 0 && diastole < 10) return "#63a713";
      if (diastole > 10) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorTension() {
      if (!this.form.systole) return "rgba(0, 0, 0, 0.54)";
      let systole = parseInt(this.form.systole) || 0;
      let diastole = parseInt(this.form.diastole) || 0;
      if (systole > 90 && systole < 121 && diastole > 60 && diastole < 81)
        return "#63a713";
      if (systole > 120 || diastole > 80) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorFC() {
      if (!this.form.frecard) return "rgba(0, 0, 0, 0.54)";
      let frecard = parseInt(this.form.frecard) || 0;

      if (frecard > 59 && frecard < 101) return "#63a713";
      if (frecard < 60 || frecard > 100) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorFresp() {
      if (!this.form.freresp) return "rgba(0, 0, 0, 0.54)";
      let freresp = parseInt(this.form.freresp) || 0;

      if (freresp > 11 && freresp < 21) return "#63a713";
      if (freresp < 12 || freresp > 20) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorTemp() {
      if (!this.form.tempera) return "rgba(0, 0, 0, 0.54)";
      let tempera = parseInt(this.form.tempera) || 0;

      if (tempera > 35 && tempera < 38) return "#63a713";
      if (tempera < 36 || tempera > 37) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorImc() {
      if (!this.form.imc) return "rgba(0, 0, 0, 0.54)";

      let indice_mc = this.form.imc;

      if (indice_mc > 18.4 && indice_mc < 24.9) return "#63a713";
      if (indice_mc < 18.5 || indice_mc > 24.9) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    get_imc() {
      this.form.imc = 0;
      let peso = parseFloat(this.form.peso) || 0;
      let talla = parseFloat(this.form.talla) || 0;
      talla = (talla * talla).toFixed(2);
      let imc = ((peso / talla) * 10000).toFixed(2);
      this.form.imc = imc;
      let clasificacion = "";

      if (imc < 18.5) {
        clasificacion = "Bajo Peso";
      } else if (imc < 25) {
        clasificacion = "Peso Normal";
      } else if (imc < 30) {
        clasificacion = "SobrePeso";
      } else if (imc < 35) {
        clasificacion = "Obesidad Grado I";
      } else if (imc < 40) {
        clasificacion = "Obesidad Grado II";
      } else {
        clasificacion = "Obesidad Grado III";
      }
      if (talla == 0) {
        clasificacion = "";
        this.form.imc = 0;
      }

      this.form.clasificaimc = clasificacion;
    },
    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
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
<style scoped>
.blanco {
  color: white;
}
</style>
