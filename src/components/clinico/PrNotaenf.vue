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
                >mdi-account-details-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Nota Enfermería</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
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

              <v-col class="d-flex" cols="12" sm="7">
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
                    { text: 'Sala rx', value: '9001' },
                    { text: 'Sala mamografia', value: '9002' },
                    { text: 'Sala ecografia', value: '9003' },
                    { text: 'Sala Biopsias', value: '9004' },
                    { text: 'Sala Densitomeria', value: '9005' },
                  ]"
                  v-model="selectSala"
                  return-object
                ></v-select>
              </v-col> -->
            </v-row>
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="selectSala != null"
            >
              <v-col>
                <JsonExcel :data="agendaPaciente" type="csv" :title="headerCsv">
                  <v-btn color="success" class="ma-2 white--text">
                    Exportar Excel
                    <v-icon right dark>mdi-file-table-outline</v-icon>
                  </v-btn>
                </JsonExcel>
              </v-col>
              <v-col class="pa-0 px-0 mr-6">
                <v-btn
                  color="purple darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="cargarAgendamiento"
                  >Refrescar</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
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
              v-if="selectSala != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.btn_atender="{ item }">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  :disabled="item.turno < 1 || item.turno == 0"
                  @click="llamar_cita(item, 1)"
                  >Llamar</v-btn
                >
              </template>
              <template v-slot:item.btn_atencion="{ item }">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="_atendido(item)"
                  >{{
                    (text = item.estado == 1 ? "Atendido" : "Reactivar")
                  }}</v-btn
                >
              </template>
              <template v-slot:item.acciones="{ item }">
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="item.link_docs.trim() ? false : true"
                      color="blue"
                      class="ma-2 white--text"
                      :href="`https://docs.google.com/document/d/${item.link_docs}/edit`"
                      icon
                      v-on="on"
                      target="_blank"
                    >
                      <v-icon>mdi-google-drive</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar documento</span>
                </v-tooltip> -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="item.link_docs.trim() ? false : true"
                      color="red"
                      class="ma-2 white--text"
                      :disabled="item.estado == 2 || item.estado == 0"
                      @click="get_pdf(item.link_docs)"
                      icon
                      v-on="on"
                      target="_blank"
                    >
                      <v-icon>mdi-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar PDF</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="green"
                      class="ma-2 white--text"
                      @click="editar_item(item)"
                      icon
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Lectura</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue"
                      class="ma-2 white--text"
                      @click="print_item(item)"
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir reporte</span>
                </v-tooltip>
              </template>
              <!-- <template v-slot:item="props">
                <tr
                  :class="{
                    'green lighten-4': props.item.estado == 1,
                    'blue lighten-4': props.item.estado == 2
                  }"
                >
                  <td>{{ props.item.nro }}</td>
                  <td>
                    <v-btn
                      color="success"
                      class="ma-2 white--text"
                      :disabled="
                        props.item.estado == 2 || props.item.estado == 0
                      "
                    >Llamar</v-btn>
                  </td>
                  <td>{{ props.item.descrip_paciente }}</td>
                  <td>{{ props.item.desc_servicio }}</td>
                  <td>{{ props.item.fecha }}</td>
                  <td>{{ props.item.id_hora }}</td>
                  <td>{{ parseInt(props.item.id_paciente) }}</td>
                  <td>
                    <v-btn
                      color="error"
                      class="ma-2 white--text"
                      :disabled="props.item.estado == 0"
                      @click="_atendido(props.item)"
                    >
                      {{ text = props.item.estado == 2? 'Desatender' : 'Atender' }}
                    </v-btn>
                  </td>
                </tr>
              </template>-->
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.estado" persistent max-width="100%" width="1100">
      <v-card>
        <v-card-title class="headline">
          <span class="title col-8" v-html="dialogo.titulo"> </span>
        </v-card-title>
        <v-row class="ml-5">
          <v-col class="d-flex" cols="6" sm="5">
            <v-autocomplete
              label="Personal Asistencial"
              clearable
              :loading="load_personal"
              :items="selectObjPersonal"
              item-value="value"
              hide-details
              v-model="selectPersonal"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="6">
            <v-text-field
              outlined
              label="Acompañante"
              filled
              hide-details
              v-model="form.acompañante"
            ></v-text-field>
          </v-col>

        </v-row>
        <v-row dense class="ml-5">
          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.embarazada"
              hide-details
              label="Embarazada"
            ></v-switch>
          </v-col>

          <v-col class="d-flex" cols="2">
            <v-text-field
              outlined
              label="Creatinina"
              filled
              hide-details
              v-model="form.creatinina"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              outlined
              label="Iopramida"
              filled
              hide-details
              v-model="form.iopramida"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              outlined
              label="Bun"
              filled
              hide-details
              v-model="form.bun"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <div>
              <v-text-field
                label="Peso"
                outlined
                hide-details="auto"
                v-model="form.peso"
                filled
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
        <v-row dense class="ml-5">
          <v-col cols="12">
            <v-autocomplete
              :items="diagnosticos"
              :item-text="format_diagnostico"
              item-value="codigo"
              label="Diagnostico"
              outlined
              clearable
              hide-details
              v-model="form.dx"
              return-object
              :error="errores.diagnostico"
              @change="errores.diagnostico = false"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
        <v-row class="d-flex ml-5 mt-5 justify-center" no-gutters>
          <v-col class="d-flex justify-center" cols="6">
            <v-chip color="purple" class="white--text mr-3" label depressed>
              I n g r e s o
            </v-chip>
          </v-col>
        </v-row>

        <v-card class="ml-5 mr-5 mt-2">
          <v-row class="d-flex ml-5">
            <v-col cols="3">
              <v-autocomplete
                label="Condicion de Ingreso"
                v-model="form.ingreso"
                :items="items_ingreso"
                hide-details
                return-object
                @change="errores.ingreso = false"
                :error="errores.ingreso"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">TensiÃ³n</span>
              <v-icon class="px-6 mr-1">mdi-heart-pulse</v-icon>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">F.CardÃ­aca</span>
              <v-icon class="px-6 mr-1">mdi-pulse</v-icon>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">Temperatura</span>
              <v-icon class="px-6 mr-1">mdi-emoticon-sick-outline</v-icon>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">SaturaciÃ³n</span>
              <v-icon class="px-6 mr-1">mdi-emoticon-sick-outline</v-icon>
            </v-col>
          </v-row>
          <v-row class="d-flex ml-5">
            <v-col cols="3"> </v-col>
            <v-col cols="2">
              <div class="d-flex">
                <v-text-field
                  label="Sys"
                  hide-details
                  v-model="form.systole_ing"
                ></v-text-field>
                <v-text-field
                  label="Diast"
                  hide-details
                  v-model="form.diastole_ing"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="2">
              <div>
                <v-text-field
                  label="F.c."
                  hide-details="auto"
                  v-model="form.frecard_ing"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="2">
              <div>
                <v-text-field
                  label="Temperatura"
                  hide-details="auto"
                  v-model="form.tempera_ing"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="2">
              <div>
                <v-text-field
                  label="O2Sat"
                  hide-details="auto"
                  v-model="form.satura_ing"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-divider color="succes"></v-divider>
        <v-row class="d-flex ml-5 mt-5 justify-center" no-gutters>
          <v-col class="d-flex justify-center" cols="6">
            <v-chip color="orange" class="white--text mr-3" label depressed>
              E g r e s o
            </v-chip>
          </v-col>
        </v-row>

        <v-card class="ml-5 mr-5 mt-2">
          <v-row class="d-flex ml-5">
            <v-col cols="3">
              <v-autocomplete
                label="Condicion de Egreso"
                v-model="form.egreso"
                :items="items_egreso"
                hide-details
                return-object
                @change="errores.egreso = false"
                :error="errores.egreso"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">TensiÃ³n</span>
              <v-icon class="px-6 mr-1">mdi-heart-pulse</v-icon>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">F.CardÃ­aca</span>
              <v-icon class="px-6 mr-1">mdi-pulse</v-icon>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">Temperatura</span>
              <v-icon class="px-6 mr-1">mdi-emoticon-sick-outline</v-icon>
            </v-col>
            <v-col cols="2">
              <span class="subtitle-1">SaturaciÃ³n</span>
              <v-icon class="px-6 mr-1">mdi-emoticon-sick-outline</v-icon>
            </v-col>
          </v-row>
          <v-row class="d-flex ml-5">
            <v-col cols="3"> </v-col>
            <v-col cols="2">
              <div class="d-flex">
                <v-text-field
                  label="Sys"
                  hide-details
                  v-model="form.systole_egr"
                ></v-text-field>
                <v-text-field
                  label="Diast"
                  hide-details
                  v-model="form.diastole_egr"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="2">
              <div>
                <v-text-field
                  label="F.c."
                  hide-details="auto"
                  v-model="form.frecard_egr"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="2">
              <div>
                <v-text-field
                  label="Temperatura"
                  hide-details="auto"
                  v-model="form.tempera_egr"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="2">
              <div>
                <v-text-field
                  label="O2Sat"
                  hide-details="auto"
                  v-model="form.satura_egr"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- <div class="document-editor">
          <div class="document-editor__toolbar"></div>
          <div class="document-editor__editable-container">
            <div class="document-editor__editable">
               <p>The initial editor data.</p> 
            </div>
          </div>
        </div> -->
        <v-card class="d-flex ml-5 mr-5 mt-2">
          <quill-editor
            v-model="contenidoEditor"
            ref="myQuillEditor"
          ></quill-editor>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              class="white--text"
              text
              @click="cerrar_dialogo"
            >
              Cancelar
            </v-btn>
            <v-btn
              class="ma-2 white--text"
              color="green darken-1"
              text
              @click="guardar_lectura"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import JsonExcel from "vue-json-excel";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


// import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { notas_rx } from "../../_formatos_sal.js";

import "quill/dist/quill.snow.css"; // Importa los estilos de Quill
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    JsonExcel,
    quillEditor,
  },
  data() {
    return {
      search: null,
      pickerActual: false,
      load_personal: true,
      selectPersonal: null,
      load_table: false,
      selectSala: null,
      selectObjPersonal: [],
      headerCsv: [],
      datosagenda: [],
      agendaPaciente: [],
      diagnosticos: [],
      empresa: [],
      form: [],
      items_ingreso: [
        { text: "Consciente", value: "1" },
        { text: "InConsciente", value: "2" },
        { text: "Muerto", value: "3" },
      ],
      items_egreso: [
        { text: "Vivo", value: "1" },
        { text: "Cons.Externa", value: "2" },
        { text: "Remitido", value: "3" },
      ],

      salas: [
        { identificacion: "9001", descripcion: "Sala rx", grupo: "RX" },
        { identificacion: "9002", descripcion: "Sala mamografia", grupo: "MM" },
        { identificacion: "9003", descripcion: "Sala ecografia", grupo: "EK" },
        { identificacion: "9004", descripcion: "Sala Biopsias", grupo: "BP" },
        {
          identificacion: "9005",
          descripcion: "Sala Densitometria",
          grupo: "DT",
        },
      ],
      personal: [],
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
        item: {},
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      errores: {
        salas: false,
        ingreso: false,
        egreso: false,
        diagnostico: false,
      },
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        {
          text: "Atender",
          align: "center",
          value: "btn_atender",
        },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
        },
        { text: "Examen", align: "center", value: "desc_servicio" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
        { text: "Estado AtenciÃ³n", align: "center", value: "btn_atencion" },
        { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,

      contenidoEditor: "",
    };
  },
  created() {
    this.cargar_empresa();

    this.cargarPersonal();
    this.get_profesionales();
    this.get_diagnosticos();
  },
  watch: {
    selectSala: function (value) {
      if (value) this.cargarAgendamiento();
    },
  },
  methods: {
    async cargar_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;

          this.division = parseFloat(this.empresa[0].id_empr);
          //         var busqueda_sede = this.agencias.find(
          //          (el) => el.codigo_agc == this.empresa[0].agencia_empr
          //         );
          //        this.form.punto_fact = busqueda_sede;
          // this.get_contratos();
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    get_turnos() {
      let tipo = 9;
      let fila = parseFloat(this.selectSala.id);
      let agencia = this.selectSala.agencia_sala;
      post
        .postData({
          url: "Dispensa/dlls/PrturnosJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fila +
            "|" +
            agencia +
            "|" +
            tipo +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          // if (this.timer_ini == true) {
          //   console.log("buscar", this.timer_ini);
          //   this.startTimer();
          //   this.timer_ini = false;
          // }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Turnos",
            estado: true,
          });
        });
    },
    format_salas(val) {
      return val.descrip_sala;
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

    cerrar_dialogo() {
      this.dialogo.estado = false;
      this.contenidoEditor = "";
    },
    guardar_lectura() {
      var _this = this;
      var item = this.dialogo.item;
      var lectura = this.contenidoEditor;

      let textob64 = Buffer.from(lectura).toString("base64");
      this.get_plano(textob64).then((plano) => {
        var radiologo = _this.selectPersonal.value;
        var fecha = _this.fecha_actual.replace(/\-/g, "");
        var prservicio = item.prservicio;
        var paciente = item.id_paciente;
        var tecnologo = 0;
        var cups = item.cod_servicio;
        var archivo = "";
        var estado = 0;
        let embarazada = this.form.embarazada ? "1" : "0";
        let creatinina = this.form.creatinina;
        let iopramida = this.form.iopramida;
        let bun = this.form.bun;
        let peso = this.form.peso;
        let dx = this.form.dx.codigo;
        let cond_ing = this.form.ingreso.value;
        let cond_egr = this.form.egreso.value;
        let systole_ing = this.form.systole_ing;
        let systole_egr = this.form.systole_egr;
        let diastole_ing = this.form.diastole_ing;
        let diastole_egr = this.form.diastole_egr;
        let frecard_ing = this.form.frecard_ing;
        let frecard_egr = this.form.frecard_egr;
        let tempera_ing = this.form.tempera_ing;
        let tempera_egr = this.form.tempera_egr;
        let satura_ing = this.form.satura_ing;
        let satura_egr = this.form.satura_egr;
        let acompañante = this.form.acompañante;
        post
          .postData({
            url: "Clinico/dlls/ClprLect02.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              prservicio +
              "|" +
              "1" +
              "|" +
              fecha +
              "|" +
              paciente +
              "|" +
              radiologo +
              "|" +
              tecnologo +
              "|" +
              cups +
              "|" +
              dx +
              "|" +
              archivo +
              "|" +
              estado +
              "|" +
              plano +
              "|" +
              embarazada +
              "|" +
              creatinina +
              "|" +
              iopramida +
              "|" +
              bun +
              "|" +
              peso +
              "|" +
              cond_ing +
              "|" +
              systole_ing +
              "|" +
              diastole_ing +
              "|" +
              frecard_ing +
              "|" +
              tempera_ing +
              "|" +
              satura_ing +
              "|" +
              cond_egr +
              "|" +
              systole_egr +
              "|" +
              diastole_egr +
              "|" +
              frecard_egr +
              "|" +
              tempera_egr +
              "|" +
              satura_egr +
              "|" +
              acompañante +
              "|",
            method: "",
          })
          .then((data) => {
            this.llamar_cita(item, 2);
            _this.cerrar_dialogo();
            _this.$emit("snack", {
              color: "success",
              text: "Proceso exitoso",
              estado: false,
            });
          })
          .catch(() => {
            _this.$emit("snack", {
              color: "error",
              text: "Ha ocurrido un error durante el guardado",
              estado: true,
            });
          });
      });
    },
    get_plano(data) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("tipo", "plano_titcl105");
        formData.append("data", JSON.stringify({ data }));
        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },

    print_item(item) {
      let fecha = item.fecha.substr(0, 4);
      let datosEnvio =
        sessionStorage.Sesion + "|" + item.prservicio + "|" + fecha + "|";

      post
        .postData({
          url: "Clinico/dlls/ClprLect02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          var base64 = "";
          let datos_lect = data[0];
          data.shift();
          data.forEach((el) => {
            Object.getOwnPropertyNames(el).forEach((item) => {
              let string = el[item];
              base64 += string;
            });
          });
          let html = Buffer.from(base64, "base64").toString("utf-8");
          var html_pdfmake = htmlToPdfmake(html);

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          // var firma_src = require(`../../assets/image/firmas/${parseFloat(
          //   this.selectPersonal
          // )}.png`);
          var firma_src = require(`../../assets/image/firmas/vacio.png`);

          const personal = this.personal.find(
            (el) => el.id === datos_lect.idpersonal_lect
          );
          
          let dataParse = {
            ...item,
            ciudad_empr: this.empresa[0].Ciudad,
            telefono_empr: this.empresa[0].telefono_empr,
            direccion_empr: this.empresa[0].direccion_empr,
            nit_empr: parseFloat(this.empresa[0].id_empr),
            descrip_empr: this.empresa[0].descrip_empr,
            nombre_per: personal.descripcion,
            nro_per: parseFloat(personal.id),
            datos_lectura: datos_lect,
          };

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataParse.logo = logo;
            this.pdfs.getBase64(firma_src).then((firma) => {
              dataParse.firma = firma;
              notas_rx(dataParse, html_pdfmake).then(() => {
                console.log("ImpresiÃ³n terminada");
              });
            });
          });
        })
        .catch((error) => {
          console.error("Error", error);
          this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error consultando la informaciÃ³n",
            estado: true,
          });
        });
    },
    editar_item(item) {
      let fecha = item.fecha.substr(0, 4);
      let datosEnvio =
        sessionStorage.Sesion + "|" + item.prservicio + "|" + fecha + "|";

      post
        .postData({
          url: "Clinico/dlls/ClprLect02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let datos_lect = data[0];
          data.shift();

          var base64 = "";
          data.forEach((el) => {
            Object.getOwnPropertyNames(el).forEach((item) => {
              let string = el[item];
              base64 += string;
            });
          });
          let html = Buffer.from(base64, "base64").toString("utf-8");
          // var html = atob(base64);

          this.dialogo.estado = true;
          this.dialogo.titulo =
            item.descrip_paciente + "</br>" + item.desc_servicio;
          this.dialogo.item = item;

          var busqueda = this.selectObjPersonal.find(
            (el) => el.value == datos_lect.idpersonal_lect
          );
          this.selectPersonal = busqueda;
          this.form.embarazada =
            datos_lect.embarazada_lect == "1" ? true : false;
          this.form.creatinina = datos_lect.creatinina_lect;
          this.form.iopramida = datos_lect.iopramida_lect;
          this.form.bun = datos_lect.bun_lect;
          this.form.peso = datos_lect.peso_lect;

          busqueda = this.diagnosticos.find(
            (el) => el.codigo.trim() == datos_lect.dx_lect.trim()
          );
          this.form.dx = busqueda;

          busqueda = this.items_ingreso.find(
            (el) => el.value.trim() == datos_lect.condingr_lect
          );
          this.form.ingreso = busqueda;

          busqueda = this.items_egreso.find(
            (el) => el.value.trim() == datos_lect.condegre_lect
          );
          this.form.egreso = busqueda;

          this.form.systole_ing = datos_lect.systing_lect;
          this.form.systole_egr = datos_lect.systegr_lect;
          this.form.diastole_ing = datos_lect.diasting_lect;
          this.form.diastole_egr = datos_lect.diastegr_lect;
          this.form.frecard_ing = datos_lect.fcarding_lect;
          this.form.frecard_egr = datos_lect.fcardegr_lect;
          this.form.tempera_ing = datos_lect.temping_lect;
          this.form.tempera_egr = datos_lect.tempegr_lect;
          this.form.satura_ing = datos_lect.o2sating_lect;
          this.form.satura_egr = datos_lect.o2sategr_lect;
          this.contenidoEditor = html;
        })
        .catch((error) => {
          console.error("Error", error);
          this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error consultando la informaciÃ³n",
            estado: true,
          });
        });
    },
    get_pdf(key) {
      this.load_card = true;
      var formData = new FormData();
      formData.append("key", key);

      fetch("https://server1ts.net//financiero/services/docs/get_pdf.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .catch((error) => {
          this.load_card = false;
          $this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error consultando el PDF",
            estado: true,
          });
        })
        .then((result) => {
          this.load_card = false;
          if (result.code == 0) {
            var ruta = `https://server1ts.net//financiero/pdf/${result.msj}.pdf`;
            var win = window.open(ruta, "_blank");
            win.focus();
          } else {
            $this.$emit("snack", {
              color: "error",
              text: "Ha ocurrido un error consultando el PDF",
              estado: true,
            });
          }
        });
    },
    llamar_cita(item, tipo) {
      let agenciatr = item.turno.substr(8, 4);
      let codtr = item.turno.substr(12, 6);
      let idtr = item.turno.substr(18, 4);
      let agenciavt = agenciatr;
      let idvt = item.identificacion;
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
    get_profesionales() {
      this.loader = true;
      let agencia = "01";
      post
        .postData({
          url: "Clinico/dlls/ClCfSalasJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
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
    cargarPersonal() {
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.personal = data;
          this.personal.forEach((k, v) => {
            this.selectObjPersonal.push({
              value: k.id,
              text: k.descr_tipo + "-" + k.descripcion,
            });
          });
          this.load_personal = false;
        })
        .catch((err) => {
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar personal",
            estado: true,
          });
        });
    },
    cargarAgendamiento: function () {
      this.load_table = true;

      this.headerCsv = [
        "Reporte: , Agenda por Sala," +
          "Sala: ," +
          this.selectSala.descrip_sala +
          " , Fecha: ," +
          this.fecha_actual,
        "",
      ];

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.selectSala.codigo_sala +
        "|" +
        1 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl105J.dll",
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

          // console.log(this.agendaPaciente);
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
    _atendido: function (item) {
      var $this = this;
      let datos =
        sessionStorage.Sesion +
        "|" +
        item.id_paciente +
        "|" +
        item.identificacion +
        "|" +
        item.fecha +
        "|" +
        item.id_hora.split(":").join("") +
        "|";

      post
        .postData({
          url: "Clinico/dlls/titcl105a.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso exitoso",
            estado: false,
          });

          if (item.estado != 2) $this.llamar_cita(item, 3);
          // else $this.llamar_cita(item, 2);
          this.cargarAgendamiento();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al eliminar atendido",
            estado: true,
          });
        });
    },
  },
};
</script>

