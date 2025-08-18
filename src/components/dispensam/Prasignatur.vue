<template>
  <v-layout wrap>
    <v-container class="blue-background" fluid>
      <v-row>
        <v-col cols="12" align="center">
          <v-img :src="logo_empresa" max-width="300" />
        </v-col>
        <v-col cols="12" align="center">
          <h2 class="text-h4 font-weight-medium blue--text">
            ASIGNACIÓN DE TURNOS
          </h2>
          <h3 class="text-h5 font-weight-medium">{{ punto_recaudo }}</h3>
        </v-col>
        <v-col cols="12" align="center">
          <v-card
            elevation="10"
            class="py-10"
            outlined
            shaped
            tiled
            max-width="1100"
            color="#2196f3"
          >
            <v-card-text class="pb-0">
              <v-tabs v-model="tab" centered slider-color="green">
                <v-tab>Turno</v-tab>
                <v-tab>Entregas</v-tab>
                <v-tab>Pendientes</v-tab>
              </v-tabs>
              <v-divider color="succes"></v-divider>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card color="basil" flat>
                    <v-row class="d-flex mt-3 mb-2 justify-center">
                      <v-col cols="3" align="center">
                        <v-chip
                          variant="flat"
                          color="orange"
                          class="white--text"
                          @click="buscar_cedula()"
                          @keyup.enter="buscar_cedula()"
                          fab
                          depressed
                          id="buscar_cedula"
                          size="x-large"
                        >
                          Buscar Paciente
                        </v-chip>
                      </v-col>
                      <v-col
                        cols="3"
                        align="center"
                        v-if="paciente.identificacion"
                      >
                        <v-chip
                          variant="flat"
                          color="purple"
                          class="white--text"
                          @click="print_turno()"
                          fab
                          depressed
                          size="x-large"
                        >
                          Imprimir Turno
                        </v-chip>
                      </v-col>

                      <v-col cols="3" align="center">
                        <v-chip
                          variant="flat"
                          color="red"
                          class="white--text"
                          @click="abrir_novedad()"
                          depressed
                          size="x-large"
                          density="comfortable"
                        >
                          Novedad Rechazo
                        </v-chip>
                      </v-col>

                      <v-col
                        cols="3"
                        align="center"
                        v-if="paciente.identificacion"
                      >
                        <v-chip
                          variant="flat"
                          color="green"
                          class="white--text"
                          @click="valida_medisalud()"
                          depressed
                          size="large"
                        >
                          <!-- <a href="https://medisalud.sga.com.co/41/index.php?scrolly=&scrollx=&iden=CC-21190798&control=" download="proposed_file_name">Download</a> -->
                          Validar Medisalud
                        </v-chip>
                      </v-col>

                      <!-- <v-col class="d-flex justify-start align-center" cols="3" sm="1">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="buscar_cedula()"
                              fab
                              depressed
                              id="buscar_cedula"
                              large
                              icon
                              outlined
                              v-on="on"
                              style="color: rgb(0, 0, 0) !important"
                              class="mr-10"
                            >
                              <v-icon>mdi-account-search-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>Buscar Paciente</span>
                        </v-tooltip>
                      </v-col> -->

                      <!-- <v-col
                        class="d-flex justify-start align-center"
                        cols="3"
                        sm="1"
                        v-if="paciente.identificacion"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="print_turno()"
                              fab
                              depressed
                              id="buscar_cedulax"
                              large
                              icon
                              outlined
                              v-on="on"
                              style="color: purple !important"
                              class="ml-5"
                            >
                              <v-icon>mdi-cloud-print-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>Imprimir Turno</span>
                        </v-tooltip>
                      </v-col> -->
                      <!-- <v-col
                        class="d-flex justify-start align-center"
                        cols="1"
                        v-if="paciente.identificacion"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="abrir_novedad()"
                              fab
                              large
                              icon
                              outlined
                              v-on="on"
                              style="color: red !important"
                              class="ml-10"
                            >
                              <v-icon>mdi-close-box</v-icon>
                            </v-btn>
                          </template>
                          <span>Novedad Rechazo</span>
                        </v-tooltip>
                      </v-col> -->
                    </v-row>
                    <v-row class="d-flex mt-3 mb-2 justify-center">
                      <v-col class="d-flex" cols="5">
                        <v-text-field
                          background-color="white"
                          color="black"
                          outlined
                          v-model="form.paciente"
                          hide-details
                          clearable
                          type="number"
                          :error="errores.identificacion"
                          class="text-h4"
                          height="70px"
                          label="Buscar por Cedula"
                          @keyup.enter="buscar_cedula()"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row v-if="paciente.identificacion">
                      <v-col>
                        <p class="text-h4">
                          {{
                            paciente.primerApellido.trim() +
                            " " +
                            paciente.nombres.trim()
                          }}
                        </p>
                      </v-col>
                    </v-row>
                    <v-row v-if="paciente.identificacion">
                      <v-col>
                        <p class="text-h3 purple--text flex bg-surface-variant">
                          {{ paciente.descripeps.trim() }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-row class="justify-center" v-if="paciente.identificacion">
                    <v-col class="mb-4" cols="6" sm="6">
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Buscar"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>

                    <v-data-table
                      :headers="headers_paciente"
                      sort-by="fecha_rep"
                      :sort-desc="true"
                      :items="contenido_paciente"
                      :search="search"
                    >
                      <template v-slot:item.consec_rep="{ item }">
                        {{ parseInt(item.consec_rep) }}
                      </template>
                    </v-data-table>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row class="justify-center" v-if="paciente.identificacion">
                    <v-col class="mb-4" cols="6" sm="6">
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Buscar"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>

                    <v-data-table
                      :headers="tablaPendientes.headers"
                      sort-by="fecha_rep"
                      :sort-desc="true"
                      :items="tablaPendientes.datos"
                      :search="search"
                    >
                      <template v-slot:item.consec_rep="{ item }">
                        {{ parseInt(item.consec_rep) }}
                      </template>
                    </v-data-table>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>

            <v-divider color="#FF6F00"></v-divider>

            <v-divider color="#FF6F00"></v-divider>

            <!-- <v-card-text class="mt-0 pt-0">
              <v-col cols="12" v-if="filaturno.cod_rep">
                <v-btn
                  outlined
                  dark
                  class="text-h4 font-weight-medium"
                  @click="asignarTurno()"
                >
                  {{ filaturno.descrip_rep.trim() }}
                </v-btn>
              </v-col>
            </v-card-text> -->

            <v-card-text class="mt-0 pt-0" v-if="filaturno.length != 0">
              <v-col cols="12" v-for="turno in filaturno" :key="turno.cod_rep">
                <v-btn
                  outlined
                  dark
                  class="text-h4 font-weight-medium"
                  @click="asignarTurno(turno, 0)"
                >
                  {{ turno.descrip_rep.trim() }}
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#ffffff" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" color="blue darken-2">
        <v-card-title>
          <span class="title col-12 white--text">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0 text-center">
          <v-col cols="12" v-for="subfila in subfilas" :key="subfila.cod_rep">
            <v-btn
              outlined
              dark
              class="text-h4 font-weight-medium"
              @click="asignarTurno(subfila, 1)"
            >
              {{ subfila.descrip_rep.trim() }}
            </v-btn>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            dark
            color="red darken-1"
            @click="
              dialogo.estado = false;
              dialogo.titulo = '';
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="space-around">
      <v-dialog
        v-model="dialogonovedad.estado"
        transition="dialog-bottom-transition"
        width="600"
      >
        <v-card>
          <v-toolbar color="amber" title="Opening from the bottom">
            <span class="blanco">Seleccione el Tipo de Novedad</span>
          </v-toolbar>
          <v-row class="justify-center">
            <v-col class="d-flex" cols="8">
              <v-select
                :items="novedad"
                label="Novedad"
                :item-text="format_novedad"
                clearable
                hide-details
                return-object
                v-model="form.novedad"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-col class="mb-4" cols="10">
              <v-text-field
                label="Observacion"
                clearable
                type="text"
                required
                v-model="form.observacion"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-card-actions class="justify-center">
            <v-btn
              color="red white--text"
              @click="dialogonovedad.estado = false"
              >Cancelar</v-btn
            >
            <v-btn color="indigo white--text" @click="guardar_novedad()"
              >Grabar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row class="justify-center">
      <v-card-subtitle
        v-if="paciente.identificacion"
        class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
        >Historial de Entregas</v-card-subtitle
      >
    </v-row>

    <v-col cols="12" align="center" class="mt-3">
      <v-img
        :src="require('@/assets/titan_logo.png')"
        max-height="120"
        max-width="120"
      />
    </v-col>

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
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="tipoid"
                label="Tipo identificacion"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipoid"
                :error="errores.tipoid"
                @input="errores.tipoid = false"
                required
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
            <v-col class="d-flex" cols="12" sm="3">
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
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="2do apellido"
                clearable
                outlined
                v-model="form.segundoApellido"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Primer Nombre"
                clearable
                outlined
                required
                v-model="form.nombres"
                :error="errores.nombres"
                @input="errores.nombres = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Segundo Nombre"
                clearable
                outlined
                required
                v-model="form.nombre2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
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
                :items="regimen"
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
                :items="items_eps"
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
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { turnos_pos } from "../../_formatos_disp.js";
import { novedad_pos } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      pickerNacimiento: false,
      sortKey: "consec_rep",
      sortDesc: false,
      search: "",
      tab: 0,
      loader: false,
      agencia: "",
      contenido: [],
      contenido_paciente: [],
      novedad: [],
      filaturno: {},
      turno: [],
      eps: null,
      logo_empresa: null,
      punto_recaudo: null,
      card_estado: false,

      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],
      items_eps: [],

      format_fecha_nacimiento: null,
      errores: {
        contrato: false,
        paciente: false,
        autorizacion: false,
        consultorio: false,
        tipopago: false,
        copago: false,
        cuota: false,
        observaciones: false,
        cita: false,
        diagnostico: false,
        idpaciente: false,
        nombres: false,
        primerApellido: false,
        departamento: false,
        ciudad: false,
        nacimiento: false,
        regimen: false,
        eps: false,
        genero: false,
        zona: false,
        punto_fact: false,
        tipoidbusq: false,
        identificacion: false,
      },

      tipoid: [
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
      regimen: [
        { text: "Subsidiado", value: 1 },
        { text: "Contributivo", value: 8 },
        { text: "Particular", value: 2 },
        { text: "Especial", value: 3 },
        { text: "Excepción", value: 4 },
        { text: "Plan Complementario", value: 5 },
        { text: "Otro", value: 9 },
      ],

      error: {
        identificacion: false,
      },
      form: {
        tipoid: null,
        paciente: null,
        idpaciente: null,
      },
      paciente: {},

      dialogo: {
        estado: false,
        titulo: "",
      },
      dialogonovedad: {
        estado: false,
        titulo: "",
      },

      subfilas: [],
      tablaPendientes: {
        headers: [
          { text: "Fecha", align: "center", value: "fecha_rep" },
          { text: "Dispensación", align: "center", value: "consec_rep" },
          { text: "Sede", align: "center", value: "agencia_rep" },
          { text: "Medicamento", align: "left", value: "descripprod_rep" },
          { text: "Cantidad", align: "center", value: "cant_rep" },
        ],
        datos: [],
      },

      headers_paciente: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Número", align: "center", value: "consec_rep" },
        { text: "Sede", align: "center", value: "agencia_rep" },
        { text: "Medicamento", align: "left", value: "descripprod_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        // { text: "Seleccionar", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
    this.cargarnovedad();
    this.cargarEps();
    this.cargarCiudades();

    this.logo_empresa =
      "https://server3ts.com/datos/image/clientes/" +
      `${parseFloat(sessionStorage.Sesion.substr(0, 15))}` +
      ".png";
  },
  computed: {},
  methods: {
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
    cargarEps: function () {
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k, v) => {
            this.items_eps.push({
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
    async valida_medisalud() {
      // ?scrolly=""&scrollx=""&iden=CC-21190798&control="

      let idpac = "CC-" + this.form.paciente;

      let data = new FormData();
      data.append("scrolly", "");
      data.append("scrollx", "");
      data.append("iden", idpac);
      data.append("control", "");

      let response = await fetch("https://medisalud.sga.com.co/41/index.php", {
        method: "POST",
        body: data,
      }).then((res) => res.json());
      console.log(res).catch((err) => {
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar Empresa",
          estado: true,
        });
      });
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          this.punto_recaudo = this.empresa.descragencia_rep.trim();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
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
    abrir_novedad() {
      this.dialogonovedad.estado = true;
    },
    guardar_novedad() {
      const cod_sede = this.agencia;
      let paciente = this.form.paciente;
      let novedad = this.form.novedad.cod_rep;
      let eps = this.paciente.eps;
      let observacion = this.form.observacion.trim();
      post
        .postData({
          url: "Dispensa/dlls/PrNovedad.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            cod_sede +
            "|" +
            paciente +
            "|" +
            novedad +
            "|" +
            eps +
            "|" +
            observacion +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Novedad Grabada Correctamente",
            estado: true,
          });
          this.dialogonovedad.estado = false;
          this.print_novedad(data[0].msg);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Novedades",
            estado: true,
          });
        });
    },
    print_novedad(consecutivo) {
      post
        .postData({
          url: "Dispensa/dlls/PrNovedad01J.dll",
          data: sessionStorage.Sesion + "|" + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            data.fecha = this.get_date();
            novedad_pos(data).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir Novedad",
            estado: true,
          });
        });
    },
    get_date() {
      var actual = new Date();
      var fecha_format = actual.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      var hora_format = actual.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      return fecha_format + " " + hora_format;
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    buscar_cedula() {
      let paciente = this.form.paciente;

      if (!paciente) {
        this.errores.paciente = true;
        this.send_error("Debe registrar una identificación");
      } else this.buscar(" ", paciente);
      this.get_historial(paciente);
      this.get_pendientes(paciente);
    },
    buscar(inicial, paciente) {
      this.inicial = inicial;
      this.loader = true;
      this.filaturno = [];
      post
        .postData({
          url: "Clinico/dlls/Clcfpaciente24J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.paciente = JSON.parse(JSON.stringify(data[0]));

          if (this.paciente.estado == 2) {
            this.$emit("snack", {
              color: "error",
              text: "Paciente Inactivo",
              estado: true,
            });
          } else {
            if (this.paciente.servicio_contr == 1) {
              this.filaturno = this.contenido.filter(
                (el) =>
                  parseFloat(el.cod_rep) == 2 ||
                  parseFloat(el.cod_rep) == 3 ||
                  parseFloat(el.cod_rep) == 4
              );
            } else {
              this.filaturno = this.contenido.filter(
                (el) =>
                  parseFloat(el.cod_rep) == 2 ||
                  parseFloat(el.cod_rep) == 3 ||
                  parseFloat(el.cod_rep) == 4
              );
            }

            this.filaturno.push(
              this.contenido.find((el) => parseFloat(el.cod_rep) == 5)
            );
            this.filaturno.push(
              this.contenido.find((el) => parseFloat(el.cod_rep) == 6)
            );
            this.filaturno.push(
              this.contenido.find((el) => parseFloat(el.cod_rep) == 7)
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          if (err.Code == 3) {
            this.logout();
          }
          if (err.Code == 4) {
            this.$emit("snack", {
              color: "error",
              text: "Paciente No Registrado en Base de Datos",
              estado: true,
            });
            //            this.dialogopac.estado = true;
          } else {
            this.$emit("snack", {
              color: "error",
              text: "Paciente No Capitado",
              estado: true,
            });
          }
          this.paciente = {};
          if (err.Code == 0) {
            this.activar_evento();
            this.filaturno.push(
              this.contenido.find((el) => parseFloat(el.cod_rep) == 5)
            );
          }
        });
    },
    get_historial(paciente) {
      this.loader = true;
      this.contenido_paciente = [];
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa05J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido_paciente = data;
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente Sin historial",
            estado: true,
          });
        });
    },
    get_pendientes(paciente) {
      this.loader = true;
      this.contenido_paciente = [];
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente03J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.tablaPendientes.datos = data;
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente Sin historial",
            estado: true,
          });
        });
    },
    logout() {
      let ruta = null;
      let data_auth = sessionStorage.data_auth
        ? JSON.parse(atob(sessionStorage.data_auth))
        : false;
      if (!data_auth) {
        ruta = "/";
      } else if (data_auth && data_auth?.modulo === "rc")
        ruta = { name: "loginrc" };
      else if (data_auth && data_auth?.modulo === "tr")
        ruta = { name: "logintr" };
      else if (data_auth && data_auth?.modulo === "pr")
        ruta = { name: "loginpr" };
      else if (data_auth && data_auth?.modulo === "resmed")
        ruta = { name: "Loginresmerakids" };

      sessionStorage.clear();
      this.$router.push(ruta);
    },
    activar_evento() {
      this.paciente.identificacion = null;
      this.filaturno.length = 0;

      this.filaturno = this.contenido.filter(
        (el) => parseFloat(el.cod_rep) == 3
      );
    },
    print_turno() {
      let paciente = this.form.paciente ? this.form.paciente.trim() : 0;
      let cod_sede = this.agencia;
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente03J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|" + cod_sede + "|",
          method: "",
        })
        .then((dataTurno) => {
          this.loader = false;
          let datos = dataTurno[0];

          const data = {
            cod_rep: datos.consec_rep,
            descrip_rep: datos.descrfila_rep
              ? datos.descrfila_rep
              : datos.descrfila_rep,
            idturno_rep: datos.abreviafila_rep,
            paciente: this.paciente,
            turnonro: parseFloat(datos.consec_rep),
            punto_turno: this.punto_recaudo,
          };
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            data.fecha = this.get_date();
            turnos_pos(data).then(() => {
              console.log("Impresion terminada");
              this.paciente = {};
              this.filaturno = [];
              this.form.paciente = "";
              this.dialogo = {};
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir turno",
            estado: true,
          });
        });
    },
    asignarTurno(turno, subfila) {
      if (subfila == 0) {
        this.turno = turno;
      }

      this.loader = true;
      let cod_turno = turno.cod_rep;

      if (parseFloat(cod_turno) !== 5) {
        const cod_sede = this.agencia;
        let codsubfila = 0;
        if (subfila == 1) {
          cod_turno = this.turno.cod_rep;
          codsubfila = turno.cod_rep;
        }
        this.turno = [];

        let paciente = this.form.paciente ? this.form.paciente.trim() : 0;
        post
          .postData({
            url: "Dispensa/dlls/Prfilaturno.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cod_sede +
              "|" +
              cod_turno +
              "|" +
              paciente +
              "|" +
              codsubfila +
              "|",
            method: "",
          })
          .then((dataTurno) => {
            this.loader = false;

            const data = {
              cod_rep: turno.cod_rep,
              descrip_rep: turno.descripMayor_rep
                ? turno.descripMayor_rep
                : turno.descrip_rep,
              idturno_rep: turno.idturno_rep,
              paciente: this.paciente,
              turnonro: parseFloat(dataTurno[0]),
              punto_turno: this.punto_recaudo,
            };
            var logo_src = require(`../../assets/image/clientes/${parseFloat(
              sessionStorage.Sesion.substr(0, 15)
            )}.png`);

            this.pdfs.getBase64(logo_src).then((logo) => {
              data.logo = logo;
              data.fecha = this.get_date();
              turnos_pos(data).then(() => {
                console.log("Impresion terminada");
                this.paciente = {};
                this.filaturno = [];
                this.form.paciente = "";
                this.dialogo = {};
              });
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al asignar turno",
              estado: true,
            });
          });
      } else {
        this.cargarsubfila(turno);
      }
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CffilaturnoJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.agencia = data[0].agencia_rep;
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Filas",
            estado: true,
          });
        });
    },
    cargarnovedad() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfNovedadesJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.novedad = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Novedades",
            estado: true,
          });
        });
    },
    cargarsubfila(fila) {
      this.loader = true;
      const codSubfila = fila.cod_rep;
      post
        .postData({
          url: "Dispensa/dlls/CfSubfilaturnoJ.dll",
          data: sessionStorage.Sesion + "|" + codSubfila + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();

          this.subfilas = data.map((el) => ({
            ...el,
            idturno_rep: fila.idturno_rep,
            descripMayor_rep: fila.descrip_rep,
          }));

          this.dialogo = {
            estado: true,
            titulo: "Subfilas",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Filas",
            estado: true,
          });
        });
    },
    format_novedad: function (val) {
      return `${val.descrip_rep}`;
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
        this.send_error("Campo Obligatorio!");
      } else if (!data.nombres) {
        this.errores.nombres = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nacimiento) {
        this.errores.nacimiento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.regimen) {
        this.errores.regimen = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.eps) {
        this.errores.eps = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.envio_paciente(data);
      }
    },
    envio_paciente() {
      this.dialogopac.estado = false;
      let segundoApellido = this.form.segundoApellido
        ? this.form.segundoApellido.trim()
        : "";
      let nombre2 = this.form.nombre2 ? this.form.nombre2.trim() : "";

      let eliminar = this.form.eliminar ? 1 : 0,
        nacimiento = this.form.nacimiento.split("-");
      nacimiento = nacimiento[0] + nacimiento[1] + nacimiento[2];
      var datos = {
        url: "Dispensa/dlls/Cfpaciente.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.form.idpaciente.trim() +
          "|" +
          this.form.nombres +
          "|" +
          this.form.primerApellido +
          "|" +
          segundoApellido +
          "|" +
          this.form.tipoid.value +
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
          this.form.estadoCivil.value +
          "|" +
          this.form.regimen.value +
          "|" +
          this.form.eps +
          "|" +
          this.form.genero.value +
          "|" +
          this.form.zona.value +
          "|" +
          this.form.nivel.value +
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
          this.form.paciente = this.form.idpaciente.trim();
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
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>

