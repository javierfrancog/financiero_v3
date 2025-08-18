<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-reactivate-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Lista de Espera de Pacientes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_profesionales();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  outlined
                  label="Medio de Solicitud"
                  :items="[
                    { text: 'Telefónico', value: '1' },
                    { text: 'Whatsapp', value: '2' },
                    { text: 'Presencial', value: '3' },
                    { text: 'Correo', value: '4' },
                  ]"
                  v-model="selectMedio"
                  return-object
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Id_Paciente"
                  outlined
                  v-model="selectPaciente"
                  hide-details
                  @keyup.enter="buscar_paciente()"
                  :error="errores.paciente"
                  @input="errores.paciente = false"
                  @change="errores.paciente = false"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="12" sm="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="buscar_paciente()"
                      color="indigo accent-3"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      class="mr-10"
                    >
                      <v-icon>mdi-account-search-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Buscar Paciente</span>
                </v-tooltip>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="12" sm="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="crear_paciente()"
                      color="green"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      class="mr-1"
                    >
                      <v-icon>mdi-plus-box-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar/Modificar Paciente</span>
                </v-tooltip>
              </v-col>

              <v-col class="d-flex" cols="12" sm="6">
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
                      label="Fecha"
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
            </v-row>

            <v-row class="mt-0">
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  outlined
                  label="Médico"
                  :items="salas"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="selectMedico"
                  @change="cargarAgendamiento()"
                  return-object
                  clearable
                  :error="errores.medico"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" v-if="selectMedico != null">
                <v-autocomplete
                  outlined
                  label="Servicio"
                  :items="selectObjEstudios"
                  :item-text="format_servicios"
                  v-model="selectEstudio"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="mt-0 mb-3" justify="center">
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="indigo "
                  class="ma-2 white--text"
                  @click="asignarAgenda()"
                  >Agregar</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="agendaPaciente.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="
                selectSala != null &&
                selectPaciente != null &&
                selectContrato != null
              "
            >
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
              v-if="selectContrato != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.asignar="{ item }">
                <v-btn
                  color="purple"
                  class="ma-2 white--text"
                  @click="registrar_cita(item)"
                  >Actualizar</v-btn
                >
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn
                  color="error"
                  class="ma-2 white--text"
                  @click="borrarAgenda('1', item.nro, item)"
                  >Borrar</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogoasignar.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Activar cita</span>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />
        </v-card-title>

        <v-card-text class="pb-0" ref="form">
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                ref="menu"
                v-model="fechacita"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechacita"
                    label="Fecha Asignada"
                    append-icon="event"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechacita"
                  @input="fechacita = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Observaciones"
                outlined
                hide-details
                v-model="form.observacioncita"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <v-card-actions>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_cita()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogoasignar.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <v-dialog
        v-model="mostrarFormularioPaciente"
        max-width="1000px"
        persistent
      >
        <template v-slot:default>
          <PrPacientes
            v-if="mostrarFormularioPaciente"
            :datapaciente="datapaciente"
            @cerrar="cerrarFormularioPaciente"
          />
        </template>
      </v-dialog>
    </div>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import PrPacientes from "../ssalud/PrPacientes.vue";

export default {
  components: {
    PrPacientes,
  },

  data() {
    return {
      mostrarFormularioPaciente: false,
      datapaciente: {
        pac_tipoid: "",
        pac_identificacion: "",
        pac_apellido1: "",
        pac_apellido2: "",
        pac_nombre1: "",
        pac_nombre2: "",
        pac_telefono1: "",
        pac_telefono2: "",
        pac_email: "",
        pac_direccion: "",
        pac_departamento: "",
        pac_municipio: "",
        pac_fechaNacimiento: "",
        pac_edad: "",
        pac_estadoCivil: "",
        pac_regimen: "",
        pac_tipousuario: "",
        pac_eps: "",
        pac_genero: "",
        pac_zona: "",
        pac_nivel: "",
        pac_contrasena: "",
        pac_factivacion: "",
        pac_estado: "",
      },
      search: null,
      pickerNacimiento: false,
      fechacita: false,
      servicio: "Imagenologia",
      load_contrato: true,
      load_table: false,
      pickerActual: false,
      selectContrato: null,
      selectPaciente: null,
      descripaciente: null,
      selectSala: null,
      selectMedico: null,
      selectMedio: [],
      format_fecha_nacimiento: null,
      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoasignar: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      eps: [],
      ciudades_dian: [],
      agencias: [],
      medicos: [],

      departamentos: [],
      filterMunicipios: [],
      card_estado: false,

      errores: {
        paciente: false,
        punto_fact: false,
      },
      salas: [],
      agendaPaciente: [],
      fecha_actual: this.$moment().format("YYYY-MM-DD"),

      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 60) || "Maximo 20 digitos",
      ],
      selectObjContratos: [],
      contratos: [],
      selectObjpacientes: [],
      pacientes: [],
      estudios: [],
      selectObjEstudios: [],
      item_select: [],
      selectEstudio: null,

      form: {
        descripaciente: null,
      },
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        {
          text: "Primer Apellido",
          align: "center",
          value: "apellido1_paciente",
        },
        {
          text: "Nombre",
          align: "center",
          value: "nombre1_paciente",
        },

        { text: "Sede", align: "center", value: "sede" },
        { text: "Descripcion", align: "center", value: "desc_servicio" },
        { text: "Fecha", align: "center", value: "fecha" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
        { text: "Acciones", value: "asignar", align: "center" },
        { text: "", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarContratos();
    this.cargarTablaAg();
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  watch: {
    selectContrato: function (value, text) {
      post
        .postData({
          url: "Clinico/dlls/titcl304j.dll",
          data: sessionStorage.Sesion + "|" + value + "|",
          method: "",
        })
        .then((data) => {
          this.selectObjEstudios = data[0].servicios;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar servicios",
            estado: true,
          });
        });
    },
    fecha_actual: function (value) {
      if (this.selectPaciente && this.selectSala) {
        this.cargarAgendamiento(this.selectSala);
      }
    },
  },
  methods: {
    print_reporte_excel() {
      var data = this.agendaPaciente;
      var data_parse = data;
      var columnas = [
        {
          title: "Fecha Solicitud",
          value: "fecha",
          format: "date",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_paciente",
          format: "string",
        },
        {
          title: "Segundo Nombre",
          value: "nombre2_paciente",
          format: "string",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_paciente",
          format: "string",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_paciente",
          format: "string",
        },
        {
          title: "Tipo Documento",
          value: "tipodoc_paciente",
          format: "string",
        },
        {
          title: "Numero Documento",
          value: "id_paciente",
          format: "string",
        },
        {
          title: "Especialidad",
          value: "descrespc_tipo",
          format: "string",
        },
        {
          title: "Servicio",
          value: "desc_servicio",
          format: "string",
        },
        {
          title: "Telefono",
          value: "tel_paciente",
          format: "string",
        },
        {
          title: "Correo",
          value: "correo_paciente",
          format: "string",
        },
        {
          title: "Cita Asignada",
          value: "fechacita",
          format: "string",
        },

        {
          title: "Observaciones",
          value: "observacion",
          format: "string",
        },
      ];
      var header_format = [
        { text: "REPORTE LISTA DE ESPERA", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Lista de Espera",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE LISTA DE ESPERA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    registrar_cita(item) {
      this.dialogoasignar.estado = true;
      this.item_select = item;
      this.form.fechacita = item.fecha;
      this.form.observacioncita = item.observacion;
    },
    guardar_cita() {
      this.dialogoasignar.estado = false;
      let idagenda = this.item_select.identificacion;
      let fechagenda = this.item_select.fecha;
      let item = this.item_select.item;
      let fechacita = this.form.fechacita.replace(/\-/g, "");
      let observacion = this.form.observacioncita.trim();
      post
        .postData({
          url: "Clinico/dlls/ClPrListaespM.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            idagenda +
            "|" +
            fechagenda +
            "|" +
            item +
            "|" +
            fechacita +
            "|" +
            observacion +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Lista de espera modificada correctamente",
            estado: true,
          });
          this.cargarAgendamiento();
        })
        .catch((err) => {
          console.log("Error:", err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
          var busqueda_sede = this.agencias.find(
            (el) => el.codigo_agc == this.empresa[0].agencia_empr
          );
          this.form.punto_fact = busqueda_sede;
          this.get_profesionales();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    async clear_paciente() {
      this.pacientes = [];
      this.datapaciente = {
        pac_tipoid: "",
        pac_apellido1: "",
        pac_apellido2: "",
        pac_nombre1: "",
        pac_nombre2: "",
        pac_telefono1: "",
        pac_telefono2: "",
        pac_email: "",
        pac_direccion: "",
        pac_departamento: "",
        pac_municipio: "",
        pac_fechaNacimiento: "",
        pac_edad: "",
        pac_estadoCivil: "",
        pac_regimen: "",
        pac_tipousuario: "",
        pac_eps: "",
        pac_genero: "",
        pac_zona: "",
        pac_nivel: "",
      };
    },
    async buscar_paciente(proceso) {
      let $this = this;
      if (this.selectPaciente) {
        this.form.idpaciente = this.selectPaciente.trim();
        this.descripaciente = null;
        let paciente = $this.selectPaciente.trim();
        await this.clear_paciente();
        return post
          .postData({
            url: "clinico/dlls/PrCl101J.dll",
            data: sessionStorage.Sesion + "|" + paciente + "|",
            method: "POST",
          })
          .then((data) => {
            $this.pacientes = data[0];

            if (proceso == 1) {
              this.asignarAgenda("0");
            } else {
              this.up_paciente();
            }
            return true;
          })
          .catch((err) => {
            this.clear_paciente();
            console.log(err);
            this.card_estado = false;
            this.form.descripaciente = null;
            this.this.selectEstudio = null;
            this.$emit("snack", {
              color: "warning",
              text: err.Mensaje[0].msg,
              estado: true,
            });
            throw new Error("Error en buscar_paciente");
          });
      }
      // Si no hay paciente seleccionado, también lanzar error
      throw new Error("No hay paciente seleccionado");
    },
    get_profesionales() {
      this.loader = true;
      let agencia = this.form.punto_fact.codigo_agc;
      let dll = sessionStorage.Sesion.substring(0, 15);
      if (dll === "000000901099286" || dll === "000000900767863") {
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
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    async crear_paciente() {
      let paciente = parseFloat(this.selectPaciente);

      if (paciente == parseFloat(this.datapaciente.pac_identificacion)) {
        this.up_paciente();
      } else {
        await this.clear_paciente();
        this.datapaciente.pac_identificacion = parseFloat(
          this.selectPaciente.trim()
        );
      }

      this.mostrarFormularioPaciente = true;
    },
    async up_paciente() {
      if (this.pacientes.tipoid) {
        this.form.descripaciente =
          this.pacientes.primerApellido.trim() +
          " " +
          this.pacientes.segundoApellido.trim() +
          " " +
          this.pacientes.nombres.trim();

        this.datapaciente.pac_tipoid = this.pacientes.tipoid.trim();
        this.datapaciente.pac_identificacion = parseFloat(
          this.pacientes.identificacion
        );
        this.datapaciente.pac_apellido1 = this.pacientes.primerApellido.trim();
        this.datapaciente.pac_apellido2 = this.pacientes.segundoApellido.trim();
        this.datapaciente.pac_nombre1 = this.pacientes.nombres.trim();
        this.datapaciente.pac_nombre2 = this.pacientes.nombre2.trim();

        this.datapaciente.pac_telefono1 = this.pacientes.telefono;
        this.datapaciente.pac_telefono2 = this.pacientes.telefono2;
        this.datapaciente.pac_email = this.pacientes.correo;
        this.datapaciente.pac_direccion = this.pacientes.direccion.trim();
        this.datapaciente.pac_municipio = this.pacientes.ciudad;
        this.datapaciente.pac_departamento = this.pacientes.ciudad.substr(0, 2);

        this.datapaciente.pac_fechaNacimiento = this.pacientes.nacimiento;
        this.datapaciente.pac_estadoCivil = parseFloat(
          this.pacientes.estadoCivil
        );
        this.datapaciente.pac_regimen = parseFloat(this.pacientes.regimen);
        this.datapaciente.pac_tipousuario = parseFloat(
          this.pacientes.tipousuario
        );
        this.datapaciente.pac_eps = this.pacientes.eps;
        this.datapaciente.pac_genero = parseFloat(this.pacientes.genero);
        this.datapaciente.pac_zona = parseFloat(this.pacientes.zona);
        this.datapaciente.pac_nivel = parseFloat(this.pacientes.nivel);
        this.datapaciente.pac_contrasena = this.pacientes.contrasena;
        this.datapaciente.pac_factivacion = this.pacientes.fechaAct;
        this.datapaciente.pac_estado = parseFloat(this.pacientes.estado);
        this.mostrarFormularioPaciente = true;
      }
    },
    cargarAgendamiento: function (value) {
      this.load_table = true;
      let sala = parseFloat(this.selectMedico.id);
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        sala +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClPrListaespJ.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.agendaPaciente = [];
          data.forEach((k, v) => {
            k.nro = (v + 1).toString().padStart(2, "0");
            this.agendaPaciente.push(k);
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
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + 2 + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    format_medico(val) {
      return parseFloat(val.id) + " - " + val.descripcion;
    },
    format_servicios(val) {
      return val.codigo + " - " + val.descripcion;
    },

    cerrarFormularioPaciente() {
      this.mostrarFormularioPaciente = false;
    },
    async asignarAgenda(opc, nro, item) {
      let punto_fact = this.form.punto_fact;
      let item_reg = "001";
      if (item) {
        item_reg = item.item;
      }

      if (!punto_fact) {
        this.$emit("snack", {
          color: "error",
          text: "Debe seleccionar una sede",
          estado: true,
        });
      } else {
        let item = this.agendaPaciente.filter((e) => {
          if (e.nro == nro) return e;
        });

        let itemContrato = this.contratos.filter((e) => {
          if (e.nro == this.selectContrato) return e;
        });
        let punto = this.form.punto_fact.codigo_agc;
        let medio = this.selectMedio.value;
        let id_paciente = this.selectPaciente;
        let fecha = this.fecha_actual.replace(/\-/g, "");

        if (opc == 1) {
          id_paciente = item[0].id_paciente;
          fecha = item[0].fecha;
        }
        await this.buscar_paciente(1);
        if (this.selectPaciente) {
          if (this.selectEstudio || opc == "1") {
            let data =
              sessionStorage.Sesion +
              "|" +
              this.selectMedico.id +
              "|" +
              fecha +
              "|" +
              item_reg +
              "|" +
              id_paciente +
              "|" +
              itemContrato[0].identificacion +
              "|" +
              itemContrato[0].nro +
              "|" +
              this.selectEstudio +
              "|" +
              medio +
              "|" +
              punto +
              "|" +
              opc +
              "|";
            post
              .postData({
                url: "Clinico/dlls/ClPrListaesp.dll",
                data: data,
                method: "",
              })
              .then((data) => {
                this.cargarAgendamiento();
                this.selectPaciente = null;
                this.selectSala = null;
                this.selectEstudio = null;
                this.descripaciente = null;

                this.$emit("snack", {
                  color: "success",
                  text: "Lista de espera modificada correctamente",
                  estado: true,
                });
              })
              .catch((err) => {
                this.$emit("snack", {
                  color: "error",
                  text: "Error al modificar agenda",
                  estado: true,
                });
              });
          } else {
            this.$emit("snack", {
              color: "error",
              text: "Falta selecionar un servicio",
              estado: true,
            });
          }
        }
      }
    },
    borrarAgenda(opc, nro, item) {
      let punto_fact = this.form.punto_fact;
      let item_reg = "001";
      if (item) {
        item_reg = item.item;
      }

      if (!punto_fact) {
        this.$emit("snack", {
          color: "error",
          text: "Debe seleccionar una sede",
          estado: true,
        });
      } else {
        let item = this.agendaPaciente.filter((e) => {
          if (e.nro == nro) return e;
        });

        let itemContrato = this.contratos.filter((e) => {
          if (e.nro == this.selectContrato) return e;
        });
        let punto = this.form.punto_fact.codigo_agc;
        let medio = this.selectMedio.value;
        let id_paciente = this.selectPaciente;
        let fecha = this.fecha_actual.replace(/\-/g, "");

        if (opc == 1) {
          id_paciente = item[0].id_paciente;
          fecha = item[0].fecha;
        }

        let data =
          sessionStorage.Sesion +
          "|" +
          this.selectMedico.id +
          "|" +
          fecha +
          "|" +
          item_reg +
          "|" +
          id_paciente +
          "|" +
          itemContrato[0].identificacion +
          "|" +
          itemContrato[0].nro +
          "|" +
          this.selectEstudio +
          "|" +
          medio +
          "|" +
          punto +
          "|" +
          opc +
          "|";
        post
          .postData({
            url: "Clinico/dlls/ClPrListaesp.dll",
            data: data,
            method: "",
          })
          .then((data) => {
            this.cargarAgendamiento();
            this.selectPaciente = null;
            this.selectSala = null;
            this.selectEstudio = null;
            this.descripaciente = null;

            this.$emit("snack", {
              color: "success",
              text: "Lista de espera modificada correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar agenda",
              estado: true,
            });
          });
      }
    },
  },
};
</script>
