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
              <v-icon size="30" color="blue darken-4 ">mdi-needle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Registro Anestesia</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  @keyup.enter="buscar_paciente()"
                  type="number"
                  required
                  v-model="form.id_numero"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="buscar_paciente()"
                  >Buscar</v-btn
                >
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-text-field
                  label="Descripcion Paciente"
                  outlined
                  disabled
                  v-model="form.descripaciente"
                  hide-details
                  clearable
                ></v-text-field>
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
              :items="infopaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.descrip_paciente="{ item }">
                {{
                  item.apellido1_rep +
                  " " +
                  item.apellido2_rep +
                  " " +
                  item.nombre1_rep +
                  " " +
                  item.nombre2_rep
                }}
              </template>

              <template v-slot:item.idpaciente_rep="{ item }">
                {{ parseInt(item.idpaciente_rep) }}
              </template>

              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
              </template>

              <template v-slot:item.btn_print="{ item }">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  @click="imprimir_hc(item)"
                  >{{ (text = "Imprimir HC") }}</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>

        <v-dialog v-model="dialogo.estado" persistent max-width="1200px">
          <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
            <v-toolbar class="mt-2" color="indigo darken-1" dark>
              <v-row class="px-6 mt- justify-left">
                <span class="subtitle-1">Paciente: {{ dialogo.paciente }}</span>

                <div class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Edad: {{ edad }} </span>
                </div>
              </v-row>
            </v-toolbar>

            <v-divider color="orange"></v-divider>
            <v-spacer></v-spacer>

            <v-card-text class="mt-2 pb-0">
              <v-tabs
                v-model="tab"
                centered
                slider-color="red"
                background-color="light-blue lighten-4"
              >
                <v-tab grow>Registro Anestesia</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab" class="mb-2">
                <v-tab-item>
                  <v-card color="basil" flat class="mt-3">
                    <v-row class="mt-2 ml-2">
                      <v-col cols="11">
                        <v-autocomplete
                          :items="cups"
                          :item-text="format_cups"
                          item-value="codigo"
                          label="Procedimiento"
                          outlined
                          clearable
                          hide-details
                          return-object
                          v-model="form.cups"
                          :error="errores.cups"
                          @change="errores.cups = false"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 align-center">
                      <v-col cols="3" class="justify-center">
                        <td><strong>Fecha Inicio:</strong></td>
                        <v-text-field
                          v-model="form.fecha_entrega2"
                          type="date"
                          dense
                          hide-details
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3" class="justify-center">
                        <td><strong>Hora Inicio:</strong></td>
                        <v-text-field
                          v-model="form.hora_salida3"
                          type="time"
                          dense
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-divider
                      class="mt-4 align-center"
                      color="#FF6F00"
                    ></v-divider>

                    <v-row class="ml-2 align-center">
                      <v-col cols="3" class="d-flex">
                        <span class="mt-4">Anestesia General</span>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.gral_1 === 1"
                          @change="form.gral_1 = 1"
                          label="Inhalatoria"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.gral_1 === 2"
                          @change="form.gral_1 = 2"
                          label="Intravenosa"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 align-center">
                      <v-col cols="3" class="d-flex">
                        <span class="mt-4">Anestesia Regional</span>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.reg_1 === 1"
                          @change="form.reg_1 = 1"
                          label="Peridural"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.reg_1 === 2"
                          @change="form.reg_1 = 2"
                          label="Espinal"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col class="d-flex mt-3" cols="2">
                        <v-text-field
                          label="Nivel de la Puncion"
                          clearable
                          type="number"
                          required
                          v-model="form.nivelpuncion"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-2 ml-2">
                      <v-col class="d-flex" cols="3">
                        <v-text-field
                          label="Nivel de Anestesia"
                          clearable
                          type="number"
                          required
                          v-model="form.nivelanest"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Cateter"
                          clearable
                          type="number"
                          required
                          v-model="form.cateter"
                        ></v-text-field>
                      </v-col>

                      <v-col class="d-flex" cols="3">
                        <v-text-field
                          label="Manejo del Dolor"
                          clearable
                          required
                          v-model="form.mdolor"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Bloqueo Plejo"
                          clearable
                          type="number"
                          required
                          v-model="form.bloqueop"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-2 ml-2">
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Via"
                          clearable
                          required
                          v-model="form.via"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Otros"
                          clearable
                          required
                          v-model="form.otros"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-divider
                      class="mt-4 align-center"
                      color="#FF6F00"
                    ></v-divider>

                    <v-col cols="3" class="justify-center">
                      <td><strong>MONITOREO</strong></td>
                    </v-col>
                    <v-row class="ml-2">
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="RsCs"
                          clearable
                          type="number"
                          required
                          v-model="form.rscs"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Precordial"
                          clearable
                          type="number"
                          required
                          v-model="form.precordial"
                        ></v-text-field>
                      </v-col>

                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="EsofÃ¡gico"
                          clearable
                          required
                          v-model="form.esofagico"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Pa:Indirecta"
                          clearable
                          type="number"
                          required
                          v-model="form.indirecta"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Doppler"
                          clearable
                          type="number"
                          required
                          v-model="form.dopler"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Dir.Arterial"
                          clearable
                          type="number"
                          required
                          v-model="form.darterial"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2">
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="ECG"
                          clearable
                          type="number"
                          required
                          v-model="form.ecg"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="DerivaciÃ³n"
                          clearable
                          type="number"
                          required
                          v-model="form.derivacion"
                        ></v-text-field>
                      </v-col>

                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="SaO2"
                          clearable
                          required
                          v-model="form.sao2"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="FI:O2"
                          clearable
                          type="number"
                          required
                          v-model="form.fio2"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Est"
                          clearable
                          type="number"
                          required
                          v-model="form.est"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Nerv.Periferico"
                          clearable
                          type="number"
                          required
                          v-model="form.periferico"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-divider
                      class="mt-4 align-center"
                      color="#FF6F00"
                    ></v-divider>

                    <v-col cols="3" class="justify-center">
                      <td><strong>INDUCCION</strong></td>
                    </v-col>
                    <v-row class="ml-2">
                      <v-col cols="3" class="d-flex">
                        <span class="mt-4">Secuencia RÃ¡pida</span>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.sec_1 === 1"
                          @change="form.sec_1 = 1"
                          label="Si"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.sec_1 === 2"
                          @change="form.sec_1 = 2"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row class="ml-2">
                      <v-col cols="2" class="d-flex">
                        <span class="mt-4">InducciÃ³n</span>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.induc_1 === 1"
                          @change="form.induc_1 = 1"
                          label="Intravenosa"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.induc_1 === 2"
                          @change="form.induc_1 = 2"
                          label="InhalaciÃ³n"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.induc_1 === 3"
                          @change="form.induc_1 = 3"
                          label="Intramuscular"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.induc_1 === 4"
                          @change="form.induc_1 = 4"
                          label="Rectal"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2">
                      <v-col cols="2" class="d-flex">
                        <span class="mt-4">IntubaciÃ³n</span>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.intub_1 === 1"
                          @change="form.intub_1 = 1"
                          label="FÃ¡cil"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.intub_1 === 2"
                          @change="form.intub_1 = 2"
                          label="Dificil"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="TET"
                          clearable
                          type="number"
                          required
                          v-model="form.tet"
                        ></v-text-field>
                      </v-col>

                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="OT"
                          clearable
                          type="number"
                          required
                          v-model="form.ot"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="NT"
                          clearable
                          type="number"
                          required
                          v-model="form.nt"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="ml-2">
                      <v-col class="d-flex" cols="2" offset="2">
                        <v-text-field
                          label="Despierto"
                          clearable
                          required
                          v-model="form.despierto"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="2">
                        <v-text-field
                          label="Otras"
                          clearable
                          required
                          v-model="form.otras"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-col cols="3" class="justify-center">
                        <td><strong>VENTILACION</strong></td>
                      </v-col>

                    <v-row class="ml-2">

                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.venti_1 === 1"
                          @change="form.venti_1 = 1"
                          label="Manual"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.venti_1 === 2"
                          @change="form.venti_1 = 2"
                          label="MecÃ¡nica"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.venti_1 === 3"
                          @change="form.venti_1 = 3"
                          label="Vc"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.venti_1 === 4"
                          @change="form.venti_1 = 4"
                          label="Vm"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.venti_1 === 5"
                          @change="form.venti_1 = 5"
                          label="PIM"
                          hide-details
                        ></v-checkbox>
                      </v-col>



                    </v-row>
                    <v-divider
                      class="mt-4 align-center"
                      color="#FF6F00"
                    ></v-divider>

                    <v-row class="mt-2 ml-2">
                      <v-col class="d-flex" cols="11">
                        <v-textarea
                          outlined
                          clearable
                          label="Complicaciones y Observaciones"
                          v-model="form.descrqx"
                          rows="3"
                          auto-grow
                        ></v-textarea>
                      </v-col>
                    </v-row>

                  </v-card>
                </v-tab-item>
              </v-tabs-items>
              <v-row>
                <v-divider
                  class="mt-6"
                  :style="{
                    'border-width': '1px',
                    'border-color': 'indigo',
                  }"
                />
              </v-row>
            </v-card-text>
            <v-row class="mt-3 justify-center d-flex pb-4">
              <div class="justify-end d-flex pb-4">
                <div class="d-flex ml-10">
                  <v-btn
                    @click="cerrar_dialogo()"
                    color="indigo"
                    class="white--text"
                    >Grabar
                  </v-btn>
                </div>

                <div class="d-flex ml-3">
                  <v-btn
                    @click="cerrar_dialogo()"
                    color="red darken-1"
                    class="white--text"
                    >Salir sin Grabar
                  </v-btn>
                </div>
              </div>
            </v-row>
          </v-card>
        </v-dialog>
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
      tab2: null,
      search: null,
      load_table: false,
      texto_descripcion: null,
      pickerFechaFinal: false,
      pickeFechaIni: false,

      infopaciente: [],
      diagnosticos: [],
      cups: [],
      selectObjEstudios: [],

      image: null, // Variable para la imagen cargada
      imagePreviews: [], // Array para almacenar las vist

      form: {
        id_numero: null,
        descripaciente: null,
        reg_1: null,
        gral_1: null,
        sec_1: null,
        induc_1: null,
        intub_1: null,
      },
      errores: {
        dxpre: false,
        dxpost: false,
        cups: false,
      },
      card_estado: false,
      tab: 0,
      edad: null,

      dialogo: {
        estado: false,
        paciente: null,
      },
      headers: [
        {
          text: "AcciÃ³n",
          align: "center",
          value: "btn_atencion",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion paciente",
          align: "left",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha Historia",
          align: "center",
          value: "fecha_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Nro_Historia",
          align: "center",
          value: "nro_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "idpaciente_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "MÃ©dico",
          align: "center",
          value: "medico_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Imprimir",
          align: "center",
          value: "btn_print",
          class: "indigo--text blue lighten-5",
        },
      ],
      load_card: false,
    };
  },
  created() {
    this.get_empresa();
    this.get_diagnosticos();
    this.cargar_cups();
  },

  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo_cargue = anioActual;
    },

    previewImage() {
      if (this.image) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target.result); // Añadir la vista previa al array
        };
        reader.readAsDataURL(this.image); // Convierte la imagen en una URL de datos
      }
      this.image = null;
    },
    removeImage(index) {
      // Eliminar la imagen del array por su Ã­ndice
      this.imagePreviews.splice(index, 1);
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
    buscar_paciente() {
      let paciente = this.form.id_numero.trim();

      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.paciente = data[0];
          this.form.descripaciente = this.paciente.descrip_rep.trim();
          this.dialogo.paciente = this.paciente.descrip_rep.trim();
          this.tab = 0;
          this.dialogo.estado = true;
        })
        .catch((err) => {
          console.log(err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },

    clear_form() {
      this.form = {
        id_numero: null,
        descripaciente: null,
      };
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
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion.trim();
    },
    format_cups(val) {
      return val.codserv_cups + " - " + val.descripcion_cups.trim();
    },
    cargar_cups() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfServProcJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cups = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cups",
            estado: true,
          });
        });
    },
    cerrar_dialogo() {
      this.dialogo.estado = false;
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

