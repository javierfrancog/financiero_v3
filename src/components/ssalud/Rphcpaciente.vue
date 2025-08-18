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
                >Consulta de Historia Clinica ss</v-list-item-title
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
                  clearable
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
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  v-show="agendaPaciente.length > 0"
                  color="purple"
                  class="ma-2 white--text"
                  @click="open_rango()"
                  >Impresion por Rango</v-btn
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
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="imprimir_hc(item, 1)"
                    >
                      <v-icon>mdi-card-text-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Historia y Ordenes</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="imprimir_hc(item, 2)"
                    >
                      <v-icon>mdi-alpha-h-box-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Solo Historia</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="imprimir_hc(item, 3)"
                    >
                      <v-icon>mdi-alpha-o-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Solo Ordenes</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="imprimir_hc(item, 4)"
                    >
                      <v-icon>mdi-alpha-n-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Solo Notas</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="open_mail(item)"
                    >
                      <v-icon>mdi-card-account-mail-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar Correo</span>
                </v-tooltip>
              </template>

              <template v-slot:item.descrip_paciente="{ item }">
                {{ item.nombre1_rep + " " + item.apellido1_rep }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
      <v-dialog v-model="dialogo_rango.estado" persistent max-width="800">
        <v-card
          :disabled="dialogo_rango.loader"
          :loading="dialogo_rango.loader"
        >
          <v-card-title class="headline"> Rango a Procesar</v-card-title>
          <v-card-text>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
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

              <v-col class="d-flex" cols="3">
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
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="4">
                <v-text-field
                  v-model="form.autoriza"
                  label="Filtrar Autorizacion"
                  single-line
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  @click="procesar_rango"
                  depressed
                  large
                >
                  Generar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="init_dialogo_rango">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-dialog v-model="dialogocorreo.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">EnvÃ­o Historia Clinica</span>
          <span class="title col-12">{{ dialogocorreo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino"
                clearable
                outlined
                type="text"
                v-model="form.correo"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                :loading="card.loader"
                color="indigo"
                class="mr-8 white--text"
                @click="send_mail(item_envio, 4, true)"
                >Enviar Correo</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogocorreo.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-overlay :value="loader">
        <flower-spinner
          :animation-duration="2500"
          :size="100"
          color="#0d47a1"
        />
      </v-overlay>
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
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      item_envio: {},
      item_select: {},
      proc_rango: false,

      dialogocorreo: {
        estado: false,
        titulo: null,
      },
      card: {
        loader: false,
        disabled: false,
      },

      idpaciente: 0,
      nro_hist: 0,
      medicos: [],

      datosagenda: [],
      plantilla: [],

      seccion: [],
      agendaPaciente: [],
      items_especialidad: [],

      form: {
        motivo: null,
        medico: null,
        autoriza: "",
      },
      tab: 0,

      personal: [],
      fechaag: null,
      horaag: null,
      consecutivo: 0,

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
      historia: {
        estado: false,
        plantila: null,
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
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: 0,
        numFinal: 0,
        loader: false,
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

        // { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
      panel: [],
    };
  },
  created() {
    this.get_empresa();
    this.get_profesionales();
    this.get_especialidad();
    // this.form.id_paciente = 1121842825;
    this.proc_rango = false;
  },
  methods: {
    open_rango() {
      this.dialogo_rango.estado = true;
    },

    init_dialogo_rango() {
      this.dialogo_rango = {
        estado: false,
        tipo: 0,
        loader: false,
      };
    },
    open_mail(item) {
      if (item) {
        this.item_envio = item;
      } else {
        item = this.item_select;
        this.item_envio = item;
      }
      this.dialogocorreo.estado = true;
      this.form.correo = item.correo_rep.trim();
      let descrip_paciente =
        item.nombre1_rep +
        " " +
        item.nombre2_rep +
        " " +
        item.apellido1_rep +
        " ";

      this.dialogocorreo.titulo = descrip_paciente;
      this.form.correo2 = null;
      this.form.correo3 = null;

      // if (this.nro_hist > 0) {
      //   this.item_envio = item;
      //   this.dialogocorreo.estado = true;
      //   this.form.correo = item.correo.trim();

      //   this.dialogocorreo.titulo = item.descrip_paciente.trim();
      //   this.form.correo2 = null;
      //   this.form.correo3 = null;
      // }
    },
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
      this.agendaPaciente = [];
      let paciente = this.form.id_paciente.trim();
      let profesional = parseFloat(this.form.medico.id);
      let especialidad = this.form.especialidad.codigo_rep;
      if (paciente > 0) {
        this.load_table = true;

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
      }
    },
    async send_mail(item, tipo, sendEmail) {
      let paciente = item.idpaciente_rep;
      this.idpaciente = paciente;
      let consecutivo = item.nro_rep;

      let profesional = parseInt(item.idprofesional_rep);
      if (item.firma_rep == "2") {
        profesional = "0000000000";
      }

      if (tipo == 3) {
        await this.procesar_ordenes(consecutivo, profesional, 2);
      } else {
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
            let data_envio = data;
            let blobHistoriaClinica = await historiaClinica(data, sendEmail);

            let arrBlob = await this.procesar_ordenes(
              consecutivo,
              profesional,
              1,
              sendEmail
            );
            arrBlob.unshift(blobHistoriaClinica);

            const merger = new PDFMerger();
            for (const file of arrBlob) {
              if (file) await merger.add(file);
            }

            try {
              const secciones = ["012", 111, 112, 113, 114, 115];
              const pdf_1 = new PDFMerger();

              for (const file of arrBlob) {
                if (file) await pdf_1.add(file);
              }

              for (const seccion of secciones) {
                const response = await post.postData({
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
                });

                let data = response[0];
                data.empresa = this.datosEmpresa;
                let logo_src = require(`../../assets/image/clientes/${parseFloat(
                  sessionStorage.Sesion.substr(0, 15)
                )}.png`);

                let firma_src = require(`../../assets/image/firmas/${parseFloat(
                  profesional
                )}.png`);

                let logo = await this.pdfs.getBase64(logo_src);
                let firma = await this.pdfs.getBase64(firma_src);
                data.logo = logo;
                data.firma = firma;

                let blobOrden = await OrdenMedica(data, sendEmail);

                if (blobOrden) {
                  await pdf_1.add(blobOrden);
                }
              }

              const mergedPdf = await pdf_1.saveAsBlob();
              await this.enviarCorreo(mergedPdf, data_envio);
              // const url = URL.createObjectURL(mergedPdf);
              // window.open(url);
            } catch (error) {
              console.error("Error en Ã³rdenes:", error);
              return false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al Enviar Historia",
              estado: true,
            });
          });
      }
    },
    async enviarCorreo(blob, data) {
      this.card.loader = true;
      data.usuario_rep = this.datosEmpresa.emailhc_empr;
      data.servidor_rep = this.datosEmpresa.hosthc_empr;
      data.clave_rep = this.datosEmpresa.passhc_empr;
      data.puerto_rep = this.datosEmpresa.puertohc_empr;
      data.email_cliente = this.form.correo.trim();

      // data.usuario_rep = "documentoselectronicos@titansoluciones.co";
      // data.servidor_rep = "smtp.office365.com";
      // data.clave_rep = "kxtknhljsylkcbyv";
      // data.email_cliente = "javierfrancog@gmail.com";

      data.periodo_factura = data.fechahc_rep;

      var urlEnvio = "https://server1ts.net//financiero/inc/enviocorreo_hc.php";
      var formData = new FormData();
      formData.append("pdf", blob, "Historia_Clinica.pdf");
      formData.append("nombre_pdf", "Historia Clinica");
      formData.append("mail_origen", data.usuario_rep.trim());
      formData.append("pass_origen", data.clave_rep.trim());
      formData.append("host_origen", data.servidor_rep.trim());
      formData.append("puerto_origen", data.puerto_rep.trim());
      formData.append("correo_destino", data.email_cliente.trim());
      formData.append("periodo", data.periodo_factura);
      formData.append("logo", parseFloat(sessionStorage.Sesion.substr(0, 15)));

      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          this.card.loader = false;
          this.dialogocorreo.estado = false;
          if (res.code == 0) {
            this.$emit("snack", {
              color: "green",
              text: res.msj,
              estado: true,
            });
          } else {
            this.card.loader = false;
            this.$emit("snack", {
              color: "error",
              text: res.msj,
              estado: true,
            });
          }
        })
        .catch((err) => {
          this.card.loader = false;
          console.error("Error Envio Hc:", err);
          this.$emit("snack", {
            color: "error",
            text: "Error al enviar correo",
            estado: true,
          });
        });
    },
    async procesar_rango() {
      this.dialogo_rango.loader = true;
      this.proc_rango = true;
      try {
        const fechaInicial = this.fecha_ini;
        const fechaFinal = this.fecha_final;

        // Filtrar los elementos de agendaPaciente segÃºn el rango de fechas
        const filtrados = this.agendaPaciente.filter((item) => {
          const fechaItem = item.fecha_rep; // AsegÃºrate de que item.fecha_rep estÃ© en formato YYYY-MM-DD
          return fechaItem >= fechaInicial && fechaItem <= fechaFinal;
        });

        const filtradosOrdenados = filtrados.sort((a, b) => {
          return new Date(a.fecha_rep) - new Date(b.fecha_rep);
        });

        const nroRepFiltrados = filtrados.map((item) => item.nro_rep);
        const merger = new PDFMerger();

        for (const nroRep of nroRepFiltrados) {
          const item = this.agendaPaciente.find((i) => i.nro_rep === nroRep);
          if (item) {
            const blobHistoriaClinica = await this.imprimir_hc(
              item,
              0,
              nroRep,
              false
            ); // No abrir los PDFs individuales
            if (blobHistoriaClinica) {
              await merger.add(blobHistoriaClinica); // Solo agregar si es vÃ¡lido
            }
          }
        }

        // Guardar el PDF combinado
        const mergedPdf = await merger.saveAsBlob();
        const url = URL.createObjectURL(mergedPdf);

        // Abrir el PDF combinado al final
        window.open(url);
        this.dialogo_rango.loader = false;
        this.proc_rango = false;
      } catch (err) {
        this.dialogo_rango.loader = false;
        this.proc_rango = false;

        console.error("Error al procesar rango:", err);
        this.$emit("snack", {
          color: "error",
          text: "Error al procesar rango",
          estado: true,
        });
      }
    },

    async imprimir_hc(item, tipo, nro_hist) {
      try {
        let paciente = 0;
        let consecutivo = 0;
        let profesional = 0;
        let buq_autoriza = 0;
        let examen_fisico = "";
        let abrir = true;
        let fecha_inicial = this.fecha_ini.replace(/-/g, "");
        let fecha_final = this.fecha_final.replace(/-/g, "");

        if (!this.form.autoriza || this.form.autoriza.trim() === "") {
          this.proc_rango = false;
        } else {
          buq_autoriza = this.form.autoriza.trim();
        }

        if (nro_hist) {
          abrir = false;
          consecutivo = nro_hist;
          paciente = this.form.id_paciente.trim();
        } else {
          fecha_inicial = 0;
          fecha_final = 0;
          paciente = item.idpaciente_rep;
          this.idpaciente = paciente;
          profesional = parseInt(item.idprofesional_rep);
          consecutivo = item.nro_rep;
          if (item.firma_rep == "2") {
            profesional = "0000000000";
          }
        }

        if (tipo == 3) {
          await this.procesar_ordenes(consecutivo, profesional, 2);
        } else {
          this.loader = true;

          const data = await post.postData({
            url: "Clinico/dlls/ClHclinicaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              paciente +
              "|" +
              consecutivo +
              "|" +
              tipo +
              "|" +
              fecha_inicial +
              "|" +
              fecha_final +
              "|",
            method: "",
          });
          this.loader = false;

          const parsedData = JSON.parse(JSON.stringify(data))[0];

          if (
            this.proc_rango == true &&
            parsedData &&
            Array.isArray(parsedData.secciones_rep)
          ) {
            const seccion006 = parsedData.secciones_rep.filter(
              (sec) => sec.seccion_rep === "006"
            );

            const basesCodificadas = seccion006.flatMap((sec) => {
              const bases = [];
              for (let i = 1; i <= 39; i++) {
                const key = `base${i}_rep`;
                if (sec[key]) {
                  bases.push(sec[key]);
                }
              }
              return bases;
            });

            const base64Completo = basesCodificadas.join("");
            const textoDecodificado = atob(base64Completo); // o Buffer en Node.js
            examen_fisico = textoDecodificado;

            if (examen_fisico.includes(buq_autoriza)) {
              console.log(
                "La variable 'buq_autoriza' SÃ se encuentra en el texto."
              );
            } else {
              return null; // Detener ejecuciÃ³n
            }
          }

          parsedData.edad_rep = parsedData.edad_rep.replace("n", "ñ");
          parsedData.empresa = this.datosEmpresa;
          if (nro_hist) {
            profesional = parsedData.idprofes_rep;
          }
          const logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          const firma_src = require(`../../assets/image/firmas/${parseFloat(
            profesional
          )}.png`);

          const logo = await this.pdfs.getBase64(logo_src);
          const firma = await this.pdfs.getBase64(firma_src);
          parsedData.logo = logo;
          parsedData.firma = firma;

          const blobHistoriaClinica = await historiaClinica(
            parsedData,
            false,
            abrir
          );
          if (tipo == 1) {
            await this.procesar_ordenes(consecutivo, profesional, 2);
          }
          return blobHistoriaClinica; // Devuelve el Blob del PDF generado
        }
      } catch (err) {
        this.dialogo_rango.loader = false;
        this.loader = false;

        console.error("Error al procesar historia:", nro_hist, err);
        this.$emit("snack", {
          color: "error",
          text: `Error al procesar historia ${nro_hist}`,
          estado: true,
        });
        return null; // Devuelve null en caso de error
      }
    },
    async imprimir_hc_ant(item, tipo, nro_hist) {
      let paciente = 0;
      this.idpaciente = paciente;
      let consecutivo = 0;
      let profesional = 0;

      if (nro_hist) {
        consecutivo = nro_hist;
        paciente = this.form.id_paciente.trim();
      } else {
        paciente = item.idpaciente_rep;
        profesional = parseInt(item.idprofesional_rep);
        consecutivo = item.nro_rep;
        if (item.firma_rep == "2") {
          profesional = "0000000000";
        }
      }

      if (tipo == 3) {
        await this.procesar_ordenes(consecutivo, profesional, 2);
      } else {
        post
          .postData({
            url: "Clinico/dlls/ClHclinicaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              paciente +
              "|" +
              consecutivo +
              "|" +
              tipo +
              "|",
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
            let blobHistoriaClinica = await historiaClinica(data);

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

            // window.open(url);

            if (tipo == 1) {
              await this.procesar_ordenes(consecutivo, profesional, 2);
            }
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
      }
    },
    async procesar_ordenes(consecutivo, profesional, proceso) {
      let array = [];
      for await (const section of ["012", 111, 112, 113, 114, 115]) {
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

              if (parseFloat(el.seccion_rep) === parseFloat(seccion)) {

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

