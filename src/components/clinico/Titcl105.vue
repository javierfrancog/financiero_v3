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
                >mdi-human-greeting</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >AtenciÃ³n Usuarios cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="5">
                <v-autocomplete
                  outlined
                  label="Personal Asistencial"
                  clearable
                  :loading="load_personal"
                  :items="selectObjPersonal"
                  item-value="value"
                  hide-details
                  v-model="selectPersonal"
                  @change="selectSala = null"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4" sm="7">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripPersonal"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
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
              class="d-flex justify-center mt-4"
              no-gutters
              
              v-if="selectSala != null"
            >
              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="datosagenda.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
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
            <v-row class="d-flex justify-center">
              <v-col class="mb-4" cols="6">
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
                      :disabled="item.estado == 2 || item.estado == 0"
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
                      :disabled="item.estado == 2 || item.estado == 0"
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
          <span class="title col-12" v-html="dialogo.titulo"> </span>
        </v-card-title>
        <v-divider color="succes"></v-divider>
        <!-- <div class="document-editor">
          <div class="document-editor__toolbar"></div>
          <div class="document-editor__editable-container">
            <div class="document-editor__editable">
               <p>The initial editor data.</p> 
            </div>
          </div>
        </div> -->
        <quill-editor
          v-model="contenidoEditor"
          ref="myQuillEditor"
        ></quill-editor>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="cerrar_dialogo">
            Cerrar
          </v-btn>
          <v-btn color="green darken-1" text @click="guardar_lectura">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


// import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { lecturas_rx } from "../../_formatos_sal.js";

import "quill/dist/quill.snow.css"; // Importa los estilos de Quill
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
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
      empresa: [],
      form: [],
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
  },
  watch: {
    selectSala: function (value) {
      if (value) this.cargarAgendamiento();
    },
  },
  computed: {
    descripPersonal() {
      if (this.selectPersonal == null) return undefined;
      let retornar = this.personal.filter((e) => {
        if (e.id == this.selectPersonal) {
          return e.descripcion + e.descr_tipo;
        }
      });
      return retornar[0].descripcion + "-" + retornar[0].descr_tipo;
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

    cerrar_dialogo() {
      this.dialogo.estado = false;
      this.contenidoEditor = "";
    },
    guardar_lectura() {
      var _this = this;
      var item = this.dialogo.item;
      var lectura = this.contenidoEditor;
      console.log(lectura);
      let textob64 = Buffer.from(lectura).toString("base64");
      this.get_plano(textob64).then((plano) => {
        var radiologo = _this.selectPersonal;
        var fecha = _this.fecha_actual.replace(/\-/g, "");
        var prservicio = item.prservicio;
        var paciente = item.id_paciente;
        var tecnologo = 0;
        var cups = item.cod_servicio;
        var dx = 0;
        var archivo = "";
        var estado = 0;
        post
          .postData({
            url: "Clinico/dlls/ClprLect01.dll",
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
          url: "Clinico/dlls/ClprLect01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          var base64 = "";
          data[0].lectura.forEach((el) => {
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
            (el) => el.id === this.selectPersonal
          );

          let dataParse = {
            ...item,
            ciudad_empr: this.empresa[0].Ciudad,
            telefono_empr: this.empresa[0].telefono_empr,
            direccion_empr: this.empresa[0].direccion_empr,
            nombre_per: personal.descripcion,
            nro_per: personal.nro_registro,
          };

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataParse.logo = logo;
            this.pdfs.getBase64(firma_src).then((firma) => {
              dataParse.firma = firma;
              lecturas_rx(dataParse, html_pdfmake).then(() => {
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
          url: "Clinico/dlls/ClprLect01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
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

          this.contenidoEditor = html;
          // setTimeout(() => {
          //   document.querySelector(".document-editor__editable").innerHTML =
          //     html;
          //   DecoupledEditor.create(
          //     document.querySelector(".document-editor__editable"),
          //     {
          //       cloudServices: {},
          //       enterMode: "br",
          //       shiftEnterMode: "br",
          //     }
          //   )
          //     .then((editor) => {
          //       const toolbarContainer = document.querySelector(
          //         ".document-editor__toolbar"
          //       );

          //       toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          //       window.editor = editor;
          //     })
          //     .catch((err) => {
          //       console.error(err);
          //     });
          // }, 500);
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
          data.pop()
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
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.datosagenda));

      const safeNumber = (value) => {
        if (typeof value === "string") {
          const cleanedValue = value.replace(/\s+/g, "").replace(/,/g, "");
          const parsedValue = parseFloat(cleanedValue);
          return isNaN(parsedValue) ? 0 : parsedValue;
        }
        return typeof value === "number" ? value : 0;
      };

      var data_parse = data

      var columnas = [
        {
          title: "Fecha",
          value: "fecha",
          format: "string",
        },
        {
          title: "Hora",
          value: "id_hora",
          format: "string",
        },
        {
          title: "Paciente",
          value: "descrip_paciente",
          format: "string",
        },
        {
          title: "Servicio",
          value: "desc_servicio",
          format: "string",
        },

      ];
      var fecha_final = this.form.fecha_actual;

      var header_format = [
        { text: "REPORTE DE AGENDA", bold: true, size: 16 },
        `Fecha de Corte: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Agenda",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE AGENDA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
  },
};
</script>

