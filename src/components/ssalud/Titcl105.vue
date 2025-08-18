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
                >AtenciÃ³n Usuarios</v-list-item-title
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
                  :disabled="item.estado == 2 || item.estado == 0"
                  @click="llamar_cita(item, 1)"
                  >Llamar</v-btn
                >
              </template>
              <template v-slot:item.btn_atencion="{ item }">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  :disabled="item.estado == 0"
                  @click="_atendido(item)"
                  >{{
                    (text = item.estado == 2 ? "Desatender" : "Atender")
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

    <v-dialog v-model="lectura.estado" persistent max-width="100%" width="1100">
      <v-card>
        <v-card-title class="headline">
          <span class="title col-12" v-html="dialogo.titulo"> </span>
        </v-card-title>
        <v-divider color="succes"></v-divider>
        <div class="document-editor">
          <div class="document-editor__toolbar"></div>
          <div class="document-editor__editable-container">
            <div class="document-editor__editable">
              <!-- <p>The initial editor data.</p> -->
            </div>
          </div>
        </div>
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
import JsonExcel from "vue-json-excel";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

export default {
  components: {
    JsonExcel,
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
      lectura: {
        estado: false,
        plantila: null,
      },
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
        { text: "Boton Lectura", align: "center", value: "btn_atencion" },
        { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
    };
  },
  created() {
    this.cargarPersonal();
    this.get_profesionales();
  },
  watch: {
    selectSala: function (value) {
      if (value) this.cargarAgendamiento(this.selectSala.codigo_sala);
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
    format_salas(val) {
      return parseFloat(val.codigo_sala) + " - " + val.descrip_sala;
    },

    cerrar_dialogo() {
      this.lectura.estado = false;
      if (document.querySelector(".document-editor"))
        document.querySelector(".document-editor").innerHTML =
          '<div class="document-editor__toolbar"></div><div class="document-editor__editable-container"><div class="document-editor__editable"></div></div>';
      if (window.editor) window.editor.destroy();
    },
    guardar_lectura() {
      var _this = this;
      var item = this.dialogo.item;
      var lectura = window.editor.getData();
      // var lectura_base64 = btoa(unescape(encodeURIComponent(lectura)));
      var lectura_base64 = btoa(unescape(lectura));

      this.get_plano(lectura_base64).then((plano) => {
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
            console.log("Guardado correctamente", data);
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
          data.forEach((el) => {
            Object.getOwnPropertyNames(el).forEach((item) => {
              let string = el[item];
              base64 += string;
            });
          });

          var html = atob(base64);
          /////////
          var html_pdfmake = htmlToPdfmake(html);
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          this.pdfs.getBase64(logo_src).then((logo) => {
            var dd = {
              pageMargins: [40, 80, 40, 60],
              header: function (currentPage, pageCount, pageSize) {
                return [
                  {
                    margin: [40, 20, 40, 0],
                    columns: [
                      {
                        width: "70%",
                        stack: [
                          {
                            text: `Nombre paciente: ${item.descrip_paciente}`,
                            bold: true,
                          },
                          {
                            text: `Estudio: ${item.desc_servicio}`,
                            bold: true,
                          },
                          { text: "Entidad: ", bold: true },
                        ],
                      },
                      {
                        alignment: "right",
                        image: logo,
                        fit: [80, 80],
                      },
                    ],
                  },
                  {
                    canvas: [
                      {
                        type: "rect",
                        x: 40,
                        y: 0,
                        w: 510,
                        h: 0.5,
                      },
                    ],
                  },
                ];
              },
              content: html_pdfmake,
            };

            pdfMake.createPdf(dd).open();
          });
          /////////
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

          var html = atob(base64);
          this.lectura.estado = true;
          this.dialogo.titulo =
            item.descrip_paciente + "</br>" + item.desc_servicio;
          this.dialogo.item = item;

          setTimeout(() => {
            document.querySelector(".document-editor__editable").innerHTML =
              html;
            DecoupledEditor.create(
              document.querySelector(".document-editor__editable"),
              {
                cloudServices: {},
              }
            )
              .then((editor) => {
                const toolbarContainer = document.querySelector(
                  ".document-editor__toolbar"
                );

                toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                window.editor = editor;
              })
              .catch((err) => {
                console.error(err);
              });
          }, 500);
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
    llamar_cita(item, estado) {
      var $this = this;
      this.load_card = true;
      fb.$turnos
        .where("cita_id", "==", item.identificacion)
        .where("cita_fecha", "==", item.fecha)
        .where("cita_hora", "==", item.id_hora)
        .get()
        .then(function (querySnapshot) {
          if (querySnapshot.empty) {
            $this.load_card = false;
            $this.$emit("snack", {
              color: "error",
              text: "Turno no encontrado",
              estado: true,
            });
          } else {
            querySnapshot.forEach(function (doc) {
              // console.log("Prueba", doc.id, " => ", doc.data());
              fb.$turnos
                .doc(doc.id)
                .set(
                  {
                    estado: estado,
                    sala: item.descripcion,
                  },
                  {
                    merge: true,
                  }
                )
                .then(() => {
                  setTimeout(() => {
                    $this.load_card = false;
                  }, 5000);
                });
            });
          }
        });
    },
    get_profesionales() {
      this.loader = true;
      let agencia = "01"
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
    cargarAgendamiento: function (value) {
      this.load_table = true;
      console.log(this.selectSala)

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
          else $this.llamar_cita(item, 0);
          this.cargarAgendamiento(this.selectSala.codigo_sala);
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
<style>
.document-editor {
  border: 1px solid var(--ck-color-base-border);
  border-radius: var(--ck-border-radius);

  /* Set vertical boundaries for the document editor. */
  max-height: 700px;

  /* This element is a flex container for easier rendering. */
  display: flex;
  flex-flow: column nowrap;
}
.document-editor__toolbar {
  /* Make sure the toolbar container is always above the editable. */
  z-index: 1;

  /* Create the illusion of the toolbar floating over the editable. */
  box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.2);

  /* Use the CKEditor CSS variables to keep the UI consistent. */
  border-bottom: 1px solid var(--ck-color-toolbar-border);
}

/* Adjust the look of the toolbar inside the container. */
.document-editor__toolbar .ck-toolbar {
  border: 0;
  border-radius: 0;
}
/* Make the editable container look like the inside of a native word processor application. */
.document-editor__editable-container {
  padding: calc(2 * var(--ck-spacing-large));
  background: var(--ck-color-base-foreground);

  /* Make it possible to scroll the "page" of the edited content. */
  overflow-y: scroll;
}

.document-editor__editable-container .ck-editor__editable {
  /* Set the dimensions of the "page". */
  width: 21.5cm;
  min-height: 21cm;

  /* Keep the "page" off the boundaries of the container. */
  padding: 1cm 2cm 2cm;

  border: 1px hsl(0, 0%, 82.7%) solid;
  border-radius: var(--ck-border-radius);
  background: white;

  /* The "page" should cast a slight shadow (3D illusion). */
  box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.1);

  /* Center the "page". */
  margin: 0 auto;
}
/* Set the default font for the "page" of the content. */
.document-editor .ck-content,
.document-editor .ck-heading-dropdown .ck-list .ck-button__label {
  font: 16px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif;
}
/* Adjust the headings dropdown to host some larger heading styles. */
.document-editor .ck-heading-dropdown .ck-list .ck-button__label {
  line-height: calc(
    1.7 * var(--ck-line-height-base) * var(--ck-font-size-base)
  );
  min-width: 6em;
}

/* Scale down all heading previews because they are way too big to be presented in the UI.
Preserve the relative scale, though. */
.document-editor
  .ck-heading-dropdown
  .ck-list
  .ck-button:not(.ck-heading_paragraph)
  .ck-button__label {
  transform: scale(0.8);
  transform-origin: left;
}

/* Set the styles for "Heading 1". */
.document-editor .ck-content h2,
.document-editor .ck-heading-dropdown .ck-heading_heading1 .ck-button__label {
  font-size: 2.18em;
  font-weight: normal;
}

.document-editor .ck-content h2 {
  line-height: 1.37em;
  padding-top: 0.342em;
  margin-bottom: 0.142em;
}

/* Set the styles for "Heading 2". */
.document-editor .ck-content h3,
.document-editor .ck-heading-dropdown .ck-heading_heading2 .ck-button__label {
  font-size: 1.75em;
  font-weight: normal;
  color: hsl(203, 100%, 50%);
}

.document-editor
  .ck-heading-dropdown
  .ck-heading_heading2.ck-on
  .ck-button__label {
  color: var(--ck-color-list-button-on-text);
}

/* Set the styles for "Heading 2". */
.document-editor .ck-content h3 {
  line-height: 1.86em;
  padding-top: 0.171em;
  margin-bottom: 0.357em;
}

/* Set the styles for "Heading 3". */
.document-editor .ck-content h4,
.document-editor .ck-heading-dropdown .ck-heading_heading3 .ck-button__label {
  font-size: 1.31em;
  font-weight: bold;
}

.document-editor .ck-content h4 {
  line-height: 1.24em;
  padding-top: 0.286em;
  margin-bottom: 0.952em;
}

/* Set the styles for "Paragraph". */
.document-editor .ck-content p {
  font-size: 1em;
  line-height: 1.63em;
  padding-top: 0.5em;
  margin-bottom: 1.13em;
}
/* Make the block quoted text serif with some additional spacing. */
.document-editor .ck-content blockquote {
  font-family: Arial, serif;
  margin-left: calc(2 * var(--ck-spacing-large));
  margin-right: calc(2 * var(--ck-spacing-large));
}
</style>
