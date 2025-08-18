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
                >Reportes Clinicos.ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
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
            <v-row class="d-flex justify-end">
              <v-col class="d-flex" cols="12" md="3">
                <v-btn
                  color="indigo darken-3 white--text"
                  class="white--text px-12"
                  depressed
                  large
                  @click="cargarAgendamiento"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ml-3 white--text"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="agendaPaciente.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>

              <v-col
                class="d-flex ml-4"
                cols="12"
                md="3"
                v-if="agendaPaciente.some((el) => el.descarga_masiva === true)"
              >
                <v-btn
                  color="red"
                  class="white--text px-6"
                  depressed
                  large
                  @click="descarga_masiva"
                >
                  Descarga Masiva
                  <v-icon right dark>mdi-pdf</v-icon>
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
              <template v-slot:item.descarga_masiva="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-show="item.id_at_reporte > 0">
                      <v-checkbox
                        :hidden="item.fechaataux === '00000000' ? false : true"
                        v-model="item.descarga_masiva"
                        color="indigo"
                        v-on="on"
                        class="ma-2"
                        hide-details
                        :disabled="parseInt(item.prservicio) == 0"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span>Chequear descarga</span>
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
              @click="up_file"
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
        {
          text: "Chequear ImpresiÃ³n",
          align: "center",
          value: "descarga_masiva",
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
  },
  computed: {},
  methods: {
    descarga_masiva() {
      const agendasDescargaMasiva = this.agendaPaciente.filter(
        (el) => el.descarga_masiva === true
      );
      agendasDescargaMasiva.forEach((item) => {
        this.get_pdf(item);
      });
    },
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
      return `${val.descrip_sala}`;
    },
    print_reporte_excel() {
      var data = this.agendaPaciente;
      var data_parse = [];

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Entidad",
          value: "contrato",
        },
        {
          title: "Id Paciente",
          value: "id_paciente",
        },

        {
          title: "Paciente",
          value: "descrip_paciente",
        },
        {
          title: "Servicio",
          value: "desc_servicio",
        },
        {
          title: "Fecha Agenda",
          value: "fecha",
          format: "fecha",
        },
        {
          title: "Hora",
          value: "id_hora",
          format: "string",
        },
        {
          title: "Nro AtenciÃ³n",
          value: "prservicio",
          format: "string",          
        },

      ];
      var fecha_inicial = this.fecha_actual;

      var header_format = [
        { text: "REPORTES CLINICOS", bold: true, size: 16 },
        `Fecha: ${fecha_inicial}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reportes Clinicos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTES-CLINICOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    up_file() {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let medico = this.form.medico ? this.form.medico.codigo_sala : "";
      let tipoDocumento = "PRS";
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
      console.log(item);
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let tipoDocumento = "PRS";
      let consecutivo = item.prservicio.replace(/\ /g, "");
      let nombrePdf = `./pdfs/${empresa}_${tipoDocumento}_${consecutivo}.pdf`;

      var formData = new FormData();
      formData.append("ruta", nombrePdf);
      fetch("https://server100ts.net/get.file.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((response) => {
          const linkSource = `data:application/pdf;base64,${response}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = item.descrip_paciente;
          downloadLink.click();
        });

      // fetch(nombrePdf)
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error(
      //         `Error: ${response.status} - ${response.statusText}`
      //       );
      //     }
      //     return response.blob();
      //   })
      //   .then((blob) => {

      //   })
      //   .catch((error) => {
      //     console.error("Error al descargar el archivo:", error);
      //   });
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
    cerrar_dialogo() {
      this.historia.estado = false;
      this.cargarAgendamiento();
      this.clear_form();
    },
    get_consultorios() {
      this.profesional = sessionStorage.Sesion.substr(15, 15);
      //      let iduser = 86007243;
      post
        .postData({
          url: "Clinico/dlls/PrAtencJ.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.medicos = data;
          this.load_personal = false;
        })
        .catch((err) => {
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Personal",
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

