<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Agendamiento de pacientes</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Servicio"
                  outlined
                  hide-details
                  v-model="servicio"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
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

              <v-col class="d-flex" cols="4">
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
              <!-- <v-col class="d-flex" cols="12" sm="8">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col> -->
              <v-col class="d-flex" cols="4">
                <v-select
                  outlined
                  label="Medio de Agendamiento"
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
              <!-- <v-col class="d-flex" cols="12" sm="9">
                <v-autocomplete
                  outlined
                  hide-details
                  label="Pacientes"
                  :items="selectObjpacientes"
                  v-model="selectPaciente"
                ></v-autocomplete>
              </v-col> -->
            </v-row>

            <v-row v-if="selectContrato != null">
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
                    @change="cargar_cups()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="7">
                <v-autocomplete
                  outlined
                  label="Médico"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="selectMedico"
                  return-object
                  clearable
                  @change="cargar_cups()"
                  :error="errores.medico"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-switch
                  v-model="disponibles"
                  label="Solo disponibles"
                  @change="cargar_cups()"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Id_Paciente"
                  outlined
                  v-model="selectPaciente"
                  hide-details
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
                  <span>Agregar Paciente</span>
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
              <v-col
                class="d-flex"
                cols="12"
                sm="6"
                v-if="selectMedico != null"
              >
                <v-autocomplete
                  outlined
                  label="Servicio"
                  :items="selectObjEstudios"
                  v-model="selectEstudio"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4" v-if="selectMedico != null">
                <v-btn
                  color="purple"
                  class="ma-2 white--text"
                  @click="dialogo.habilitar = true"
                  >Habilitar Horario</v-btn
                >
              </v-col>
            </v-row>
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="
                selectMedico != null &&
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
            <!-- calendario -->

            <!-- <v-row>
              <v-col>
                <v-sheet height="64">
                  <v-toolbar flat>
                    <v-btn
                      outlined
                      class="mr-4"
                      color="grey darken-2"
                      @click="setToday"
                    >
                      Hoy
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="prev">
                      <v-icon small> mdi-chevron-left </v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next">
                      <v-icon small> mdi-chevron-right </v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">
                      {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-menu bottom right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          outlined
                          color="grey darken-2"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <span>{{ typeToLabel[type] }}</span>
                          <v-icon right> mdi-menu-down </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="type = 'day'">
                          <v-list-item-title>Dia</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'week'">
                          <v-list-item-title>Semanal</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'month'">
                          <v-list-item-title>Mensual</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-toolbar>
                </v-sheet>
                <div>
                  <v-sheet height="600">
                    <v-calendar
                      ref="calendar"
                      v-model="focus"
                      color="primary"
                      :events="events"
                      :event-color="getEventColor"
                      :type="type"
                      @click:event="showEvent"
                      @click:more="viewDay"
                      @click:date="viewDay"
                      @change="updateRange"
                    ></v-calendar>
                  </v-sheet>
                </div>
              </v-col>
            </v-row> -->

            <!-- fincalendario -->

            <v-data-table
              v-if="selectMedico != null && selectContrato != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
            <template v-slot:item.id_paciente="{ item }">
                {{ parseInt(item.id_paciente) }}
              </template>
              <template v-slot:item.edit="{ item }">
                <v-btn
                  v-if="parseInt(item.estado) == 9"
                  disabled
                  color="success"
                  class="ma-2 white--text"
                  @click="asignarAgenda('0', item.nro)"
                  >Bloqueada</v-btn
                >
                <v-btn
                  v-else-if="parseInt(item.id_paciente) == 0"
                  color="success"
                  class="ma-2 white--text"
                  @click="asignarAgenda('0', item.nro)"
                  >Agregar</v-btn
                >
                <v-btn
                  v-else
                  color="error"
                  class="ma-2 white--text"
                  :disabled="item.nroprserv_rep > 0"
                  @click="asignarAgenda('1', item.nro)"
                  >Eliminar</v-btn
                >
                <div v-show="item.id_paciente > 0" >
                  <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  @click="motivoAgenda(item)"
                  >{{ item.estado == "2" ? "Cancelada" : "Canc_Agenda" }}</v-btn
                >
                </div>
                
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogopac.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Agregar Paciente</span>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />
        </v-card-title>

        <v-card-text class="pb-0" ref="form">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="tipoident"
                label="Tipo identificacion"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipoid"
                :error="errores.tipoid"
                @input="errores.tipoid = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Id_Paciente"
                outlined
                required
                v-model="form.idpaciente"
                hide-details
                :error="errores.idpaciente"
                @input="errores.idpaciente = false"
                @change="errores.idpaciente = false"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="1er apellido"
                clearable
                outlined
                required
                v-model="form.primerApellido"
                :error="errores.primerApellido"
                @input="errores.primerApellido = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="2do apellido"
                clearable
                outlined
                v-model="form.segundoApellido"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Primer Nombre"
                clearable
                outlined
                v-model="form.nombre1"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Segundo Nombre"
                clearable
                outlined
                v-model="form.nombre2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Correo"
                clearable
                outlined
                v-model="form.correo"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Telefono"
                clearable
                outlined
                v-model="form.telefono"
                counter="10"
                :rules="[(v) => (v && v.length <= 10) || 'Maximo 15 digitos']"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="5">
              <v-text-field
                label="Direccion"
                clearable
                outlined
                required
                v-model="form.direccion"
                :rules="[(v) => (v && v.length <= 60) || 'Maximo 60 digitos']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Departamento"
                v-model="form.departamento"
                :items="departamentos"
                item-value="value"
                outlined
                :error="errores.departamento"
                @change="
                  errores.departamento = false;
                  get_municipios();
                "
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Ciudad"
                v-model="form.ciudad"
                :items="filterMunicipios"
                item-value="value"
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                ref="menu"
                v-model="pickerNacimiento"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.nacimiento"
                    :value="format_fecha_nacimiento"
                    label="Fecha de nacimiento"
                    append-icon="event"
                    outlined
                    v-on="on"
                    @change="calcularEdadpac"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :error="errores.nacimiento"
                  v-model="form.nacimiento"
                  @input="pickerNacimiento = false"
                  @change="calcularEdadpac"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Soltero', value: 0 },
                  { text: 'Casado', value: 1 },
                  { text: 'Union libre', value: 3 },
                ]"
                label="Estado civil"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.estadoCivil"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Contributivo', value: 8 },
                  { text: 'Subsidiado', value: 1 },
                  { text: 'Particular', value: 2 },
                  { text: 'Especial', value: 3 },
                  { text: 'Excepción', value: 4 },
                  { text: 'Otro', value: 9 },
                ]"
                label="Regimen"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.regimen"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Eps"
                v-model="form.eps"
                :items="eps"
                item-value="value"
                outlined
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Masculino', value: 0 },
                  { text: 'Femenino', value: 1 },
                ]"
                label="Genero"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.genero"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Edad"
                disabled
                outlined
                type="text"
                v-model="form.edad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Urbana', value: 0 },
                  { text: 'Rural', value: 1 },
                ]"
                label="Zona"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.zona"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Nivel 1', value: 1 },
                  { text: 'Nivel 2', value: 2 },
                  { text: 'Nivel 3', value: 3 },
                ]"
                label="Nivel"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.nivel"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
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
            @click="guardar_paciente()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogopac.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.habilitar" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Habilitar Agenda</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Hora Inicio"
                clearable
                outlined
                type="time"
                v-model="hora_ini"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Hora Final"
                clearable
                outlined
                type="time"
                v-model="hora_fin"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="habilitar()"
                >Habilitar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="dialogo.habilitar = false"
                >Cancelar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogocanc.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Cancelar Agenda</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Motivo"
                clearable
                outlined
                type="text"
                v-model="motivocanc"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="grabar_canc()"
                >Grabar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="dialogocanc.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
export default {
  data() {
    return {
      search: null,
      pickerNacimiento: false,
      servicio: "Consultas",
      load_contrato: true,
      load_table: false,
      pickerActual: false,
      selectContrato: null,
      selectPaciente: null,
      descripaciente: null,
      selectMedico: null,
      hora_ini: this.$moment().format("HH:mm"),
      hora_fin: this.$moment().format("HH:mm"),

      tipoident: [
        { text: "Cedula Ciudadania", value: "CC" },
        { text: "Tarjeta Identidad", value: "TI" },
        { text: "Registro Civil", value: "RC" },
        { text: "Permiso Esp.Permanencia", value: "PE" },
        { text: "Cedula Extranjería", value: "CE" },
        { text: "Adulto Sin Identificar", value: "AS" },
        { text: "Menor Sin Identificar", value: "MS" },
        { text: "Certificado Nacido Vivo", value: "NV" },
        { text: "Pasaporte", value: "PA" },
        { text: "Carnet Diplomatico", value: "CD" },
        { text: "Salvo Conducto", value: "SC" },
        { text: "Permiso por Proteccion Temporal", value: "PT" },
      ],
      selectMedio: [],
      medicos: [],
      format_fecha_nacimiento: null,
      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      eps: [],
      ciudades_dian: [],
      agencias: [],
      departamentos: [],
      filterMunicipios: [],
      card_estado: false,

      errores: {
        paciente: false,
        punto_fact: false,
        tipoid: false,
        idpaciente: false,
        primerApellido: false,
        nombre1: false,
        departamento: false,
        ciudad: false,
        nacimiento: false,
      },
      dialogo: {
        habilitar: false,
      },
      dialogocanc: {
        estado: false,
      },

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
      selectEstudio: null,
      disponibles: null,
      motivocanc:null,
      itemnro:null,
      form: {
        descripaciente: null,
        tipoid: null,
      },
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        { text: "Descripcion", align: "left", value: "desc_servicio" },
        { text: "Identificacion paciente", align: "center", value: "id_paciente"},
        { text: "Descripcion paciente", align: "left", value: "descrip_paciente"},
        { text: "Telefono", align: "center", value: "tel_paciente"},
        { text: "Entidad", align: "left", value: "entidad_paciente"},
        
        { text: "Sede", align: "center", value: "sede" },
        { text: "Opciones", value: "edit", align: "center" },
      ],

      focus: "",
      type: "month",
      typeToLabel: {
        month: "Mes",
        week: "Semana",
        day: "Dia",
        "4day": "4 Days",
      },
      fechaini_ag: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
    };
  },
  created() {
    this.cargarContratos();
    this.cargarCiudades();
    this.cargarEps();
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
          this.estudios = data[0].servicios;
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
      if (this.selectPaciente && this.selectMedico) {
        this.cargarAgendamiento(this.selectMedico);
      }
    },
  },
  methods: {
    habilitar() {
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.selectMedico.id +
        "|" +
        this.hora_ini.split(":").join("") +
        "|" +
        this.hora_fin.split(":").join("") +
        "|" +
        0 +
        "|" +
        0 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/clPrHabagend.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.dialogo.habilitar = false;
          this.cargar_cups();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al crear Agenda",
            estado: true,
          });
        });
    },
    clear_paciente() {
      this.form.departamento = "";
      this.form.descripaciente = "";
      this.form.tipoid = "";
      this.form.primerApellido = "";
      this.form.segundoApellido = "";
      this.form.nombre1 = "";
      this.form.nombre2 = "";
      this.form.correo = "";
      this.form.telefono = "";
      this.form.direccion = "";
      this.form.tipoid = "";
      this.form.ciudad = "";
      this.form.nacimiento = "";
      this.form.estadoCivil = "";
      this.form.regimen = "";
      this.form.eps = "";
      this.form.genero = "";
      this.form.zona = "";
      this.form.nivel = "";
    },
    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
    },

    buscar_paciente() {
      let $this = this;
      this.form.idpaciente = this.selectPaciente.trim();
      this.descripaciente = null;
      let paciente = $this.selectPaciente.trim();
      this.clear_paciente();
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data[0];
          this.form.departamento = $this.pacientes.ciudad.substring(0, 2);
          this.get_municipios();
          this.form.descripaciente =
            $this.pacientes.nombres.trim() +
            " " +
            $this.pacientes.primerApellido.trim();
          this.form.tipoid = $this.pacientes.tipoid.trim();
          this.form.primerApellido = $this.pacientes.primerApellido.trim();
          this.form.segundoApellido = $this.pacientes.segundoApellido.trim();
          this.form.nombre1 = $this.pacientes.nombres.trim();
          this.form.nombre2 = $this.pacientes.nombre2.trim();
          this.form.correo = $this.pacientes.correo.trim();
          this.form.telefono = $this.pacientes.telefono.trim();
          this.form.direccion = $this.pacientes.direccion.trim();
          this.form.tipoid = $this.pacientes.tipoid.trim();
          this.form.ciudad = $this.pacientes.ciudad.trim() || null;
          this.form.nacimiento = this.$moment(
            $this.pacientes.nacimiento
          ).format("YYYY-MM-DD");
          this.form.estadoCivil = {
            value: parseInt($this.pacientes.estadoCivil),
          };
          this.form.regimen = { value: parseInt($this.pacientes.regimen) };
          this.form.eps = $this.pacientes.eps;
          this.form.genero = { value: parseInt($this.pacientes.genero) };
          this.form.zona = { value: parseInt($this.pacientes.zona) };
          this.form.nivel = { value: parseInt($this.pacientes.nivel) };
          this.calcularEdadpac();
        })
        .catch((err) => {
          this.clear_paciente();

          console.log(err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    cargar_cups() {
      this.estudios.forEach((k, v) => {
        this.selectObjEstudios.push({
          text: k.codigo + " - " + k.descripcion,
          value: k.codigo,
        });
      });

      this.cargarAgendamiento(this.medicos.id);
    },

    get_profesionales() {
      this.loader = true;
      let agencia = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
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
    envio_paciente() {
      console.log(this.form)
      this.dialogopac.estado = false;
      let eliminar = this.form.eliminar ? 1 : 0;
      let nombre2 = this.form.nombre2 ? this.form.nombre2.trim() : "";
      let tipoid = this.form.tipoid.value? this.form.tipoid.value : this.form.tipoid ;
      let estadoCivil = this.form.estadoCivil ? this.form.estadoCivil.value : 0;
      let regimen = this.form.regimen ? this.form.regimen.value : 0;
      let genero = this.form.genero ? this.form.genero.value : 0;
      let zona = this.form.zona ? this.form.zona.value : 0;
      let nivel = this.form.nivel ? this.form.nivel.value : 0;

      let nacimiento = this.form.nacimiento.split("-");
      nacimiento = nacimiento[0] + nacimiento[1] + nacimiento[2];
      var datos = {
        url: "Clinico/dlls/titcl301.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.form.idpaciente +
          "|" +
          this.form.nombre1 +
          "|" +
          this.form.primerApellido +
          "|" +
          this.form.segundoApellido +
          "|" +
          tipoid +
          "|" +
          this.form.direccion +
          "|" +
          this.form.telefono +
          "|" +
          this.form.correo +
          "|" +
          this.form.ciudad +
          "|" +
          this.form.nacimiento.split("-").join("") +
          "|" +
          estadoCivil +
          "|" +
          regimen +
          "|" +
          this.form.eps +
          "|" +
          genero +
          "|" +
          zona +
          "|" +
          nivel +
          "|" +
          "0" +
          "|" +
          "9" +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          nombre2 +
          "|" +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Paciente Guardado",
            estado: true,
          });
          this.selectPaciente = this.form.idpaciente.trim();

          this.buscar_paciente();
        })
        .catch((error) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al guardar paciente",
            estado: true,
          });
        });
    },
    get_municipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
    },
    guardar_paciente() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Tipo Id Obligatorio!");
      } else if (!data.idpaciente) {
        this.errores.idpaciente = true;
        this.send_error("Id Paciente Obligatorio!");
      } else if (!data.primerApellido) {
        this.errores.primerApellido = true;
        this.send_error("Primer Apellido Obligatorio!");
      } else if (!data.nombre1) {
        this.errores.nombre1 = true;
        this.send_error("Nombres Obligatorio!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Departamento Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Ciudad Obligatorio!");
      } else if (!data.nacimiento) {
        this.errores.nacimiento = true;
        this.send_error("Nacimiento Obligatorio!");
      } else if (!data.regimen) {
        this.errores.regimen = true;
        this.send_error("Regimen Obligatorio!");
      } else if (!data.eps) {
        this.errores.eps = true;
        this.send_error("Eps Obligatorio!");
      } else {
        this.envio_paciente(data);
      }
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k, v) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    cargarEps() {
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k, v) => {
            this.eps.push({
              value: k.codigo,
              text: k.nombre,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
        });
    },
    calcularEdadpac() {
      let fecha_nac = this.$moment(this.form.nacimiento).format("YYYY-MM-DD");
      // let hoy = this.$moment().format("YYYY-MM-DD");
      let dias = this.$moment().diff(fecha_nac, "days");
      let edad = null;

      if (dias < 30) {
        edad = dias + " - " + "dias";
      } else {
        if (dias < 365) {
          edad = this.$moment().diff(fecha_nac, "months") + " - meses";
        } else {
          edad = this.$moment().diff(fecha_nac, "years") + " - años";
        }
      }

      this.form.edad = edad;
    },
    crear_paciente() {
      this.buscar_paciente();
      console.log(this.pacientes)
      this.form.descripaciente = null;
      this.dialogopac.estado = true;
      this.form.departamento = this.pacientes
        ? this.pacientes.ciudad.substring(0, 2)
        : 0;
      this.get_municipios();
      this.form.idpaciente = this.selectPaciente.trim();
      this.form.primerApellido = this.pacientes.primerApellido.trim();
      this.form.segundoApellido = this.pacientes.segundoApellido.trim();
      this.form.nombres = this.pacientes.nombres.trim();
      this.form.correo = this.pacientes.correo.trim();
      this.form.telefono = this.pacientes.telefono.trim();
      this.form.direccion = this.pacientes.direccion.trim();

      this.form.tipoid = this.pacientes.tipoid.trim();
      this.form.ciudad = this.pacientes.ciudad.trim() || null;
      this.form.nacimiento = this.$moment(this.pacientes.nacimiento).format(
        "YYYY-MM-DD"
      );
      this.form.estadoCivil = { value: parseInt(this.pacientes.estadoCivil) };
      this.form.regimen = { value: parseInt(this.pacientes.regimen) };
      this.form.eps = this.pacientes.eps;
      this.form.genero = { value: parseInt(this.pacientes.genero) };
      this.form.zona = { value: parseInt(this.pacientes.zona) };
      this.form.nivel = { value: parseInt(this.pacientes.nivel) };
      this.calcularEdadpac();

      // var busqueda_tipo = this.ruts3.find(
      //   (el) => el.identificacion_rut == item.idcolabora_rep
      // );

      // this.form.nacimiento = this.pacientes.nacimiento.trim();
    },
    cargarAgendamiento: function (value) {
      this.load_table = true;
      let medico = parseFloat(this.selectMedico.id);
      let disponibles = this.disponibles ? 1 : 0;
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        medico +
        "|" +
        "0" +
        "|" +
        "0" +
        "|" +
        "0" +
        "|" +
        disponibles +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl102j.dll",
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

          // this.cargarAgendamiento2();
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
    showEvent(data) {
      console.log("Click evento", data);
    },

    cargarAgendamiento2: function (value) {
      this.load_table = true;
      let medico = parseFloat(this.selectMedico.id);
      let disponibles = this.disponibles ? 1 : 0;
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        medico +
        "|" +
        "0" +
        "|" +
        "0" +
        "|" +
        "0" +
        "|" +
        disponibles +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrAgendaJ.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.fechaini_ag = data[0].events[0].start;
          this.events = data[0].events.map((item) => {
            return {
              name: item.name,
              start: new Date(item.start),
              end: new Date(item.end),
              color: "blue",
            };
          });

          this.load_table = false;
        })
        .catch((err) => {
          console.log("error", err);
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
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: parseInt(k.nro) + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
          // this.cargarPacientes();
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
    cargarPacientes() {
      post
        .postData({
          url: "Clinico/dlls/titcl301j.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.pacientes = data;
          this.pacientes.forEach((k, v) => {
            this.selectObjpacientes.push({
              value: k.identificacion,
              text:
                k.identificacion +
                " - " +
                k.primerApellido +
                " " +
                k.segundoApellido +
                " " +
                k.nombres,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true,
          });
        });
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T11:00:00`);
      const max = new Date(`${end.date}T18:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      // for (let i = 0; i < eventCount; i++) {
      //   const allDay = this.rnd(0, 3) === 0;
      //   const firstTimestamp = this.rnd(min.getTime(), max.getTime());
      //   const first = new Date(firstTimestamp - (firstTimestamp % 900000));
      //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
      //   const second = new Date(first.getTime() + secondTimestamp);

      // }

      events.push({
        name: "Evento",
        start: min,
        end: new Date(),
        color: this.colors[this.rnd(0, this.colors.length - 1)],
        // timed: !allDay,
      });

      // this.events = events;
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    asignarAgenda(opc, nro) {
      let punto_fact = this.form.punto_fact;

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

        if (this.selectEstudio || opc == "1") {
          let data =
            sessionStorage.Sesion +
            "|" +
            this.selectMedico.id +
            "|" +
            item[0].fecha +
            "|" +
            item[0].id_hora.split(":").join("") +
            "|" +
            this.selectPaciente +
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
              url: "Clinico/dlls/titcl102.dll",
              data: data,
              method: "",
            })
            .then((data) => {
              this.selectPaciente = null;
              this.selectEstudio = null;
              this.descripaciente = null;
              this.cargar_cups();

              this.$emit("snack", {
                color: "success",
                text: "Agenda modificada correctamente",
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
    },
    motivoAgenda(item) {
      console.log(item)
      this.itemnro = item.nro;
      this.motivocanc = "";
      this.dialogocanc.estado = true;
      this.selectPaciente = item.id_paciente;
    },

    grabar_canc() {
      this.dialogocanc.estado = false;

      let punto_fact = this.form.punto_fact;
      let nro = this.itemnro;

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

        if (this.selectMedico) {
          let data =
            sessionStorage.Sesion +
            "|" +
            this.selectMedico.id +
            "|" +
            item[0].fecha +
            "|" +
            item[0].id_hora.split(":").join("") +
            "|" +
            this.selectPaciente +
            "|" +
            itemContrato[0].identificacion +
            "|" +
            itemContrato[0].nro +
            "|" +
             0 +
            "|" +
            medio +
            "|" +
            punto +
            "|" +
            2 +
            "|" +
            this.motivocanc +
            "|";
          post
            .postData({
              url: "Clinico/dlls/titcl102.dll",
              data: data,
              method: "",
            })
            .then((data) => {
              this.selectPaciente = null;
              this.selectMedico = null;
              this.selectEstudio = null;
              this.descripaciente = null;

              this.$emit("snack", {
                color: "success",
                text: "Agenda modificada correctamente",
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
            text: "Falta selecionar un Medico",
            estado: true,
          });
        }
      }
    },
  },
};
</script>
