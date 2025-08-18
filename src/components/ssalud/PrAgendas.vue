<template>
  <v-layout wrap justify-center class="pa-0">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1600" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Agendamiento de pacientes Ms</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row>
          <v-col class="d-flex" cols="4">
            <v-autocomplete
              label="Sede de Servicio"
              v-model="form.punto_fact"
              :items="agencias"
              :item-text="format_punto_fact"
              item-value="codigo_agc"
              hide-details
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
              label="Contrato"
              clearable
              :loading="load_contrato"
              :items="selectObjContratos"
              item-value="value"
              hide-details
              return-object
              v-model="selectContrato"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-select
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
        <v-row class="mt-0">
          <v-col class="d-flex" cols="12">
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
        </v-row>
        <v-row class="d-flex mb-4 justify-center" no-gutters>
          <v-col class="d-flex" cols="2" v-if="selectMedico != null">
            <v-btn
              color="green darken-1"
              class="ma-2 white--text"
              :disabled="habilitar_agenda == '1'"
              @click="abrir_habilitar()"
              >Habilitar Horario</v-btn
            >
          </v-col>
          <v-col class="d-flex" cols="2" v-if="selectMedico != null">
            <v-btn
              color="orange darken-1"
              class="ma-2 ml-4 white--text"
              @click="Imprimir_agenda(3)"
              >Imprimir Agenda</v-btn
            >
          </v-col>
          <v-col class="d-flex" cols="2" v-if="selectMedico != null">
            <v-btn
              color="purple darken-1"
              class="ma-2 white--text"
              @click="Imprimir_agenda(1)"
              >Imprimir Recordatorios</v-btn
            >
          </v-col>
        </v-row>
        <v-divider color="#3F51B5"></v-divider>
        <v-row justify="space-around">
          <v-col class="text-no-wrap" cols="2">
            <v-chip
              :color="`green darken-1`"
              class="ml-0 mr-1 white--text"
              label
              small
            >
              Libre
            </v-chip>
          </v-col>
          <v-col class="text-no-wrap" cols="2">
            <v-chip
              :color="`orange darken-1`"
              class="ml-0 mr-1 white--text"
              label
              small
            >
              Bloqueada
            </v-chip>
          </v-col>

          <v-col class="text-no-wrap" cols="2">
            <v-chip
              :color="`indigo darken-1`"
              class="ml-0 mr-1 white--text"
              label
              small
            >
              Agendado
            </v-chip>
          </v-col>
          <v-col class="text-no-wrap" cols="2">
            <v-chip
              :color="`purple  darken-1`"
              class="ml-0 mr-1 white--text"
              label
              small
            >
              En Espera
            </v-chip>
          </v-col>
          <v-col class="text-no-wrap" cols="2">
            <v-chip
              :color="`cyan darken-2`"
              class="ml-0 mr-1 white--text"
              label
              small
            >
              Atendido
            </v-chip>
          </v-col>
          <v-col class="text-no-wrap" cols="2">
            <v-chip
              :color="`pink darken-1`"
              class="ml-0 mr-1 white--text"
              label
              small
            >
              Cancelada
            </v-chip>
          </v-col>
        </v-row>
        <v-divider color="#3F51B5"></v-divider>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <Agenda
              :dataEvents="events"
              @cargarAgendamiento="cargarAgendamiento"
              @openDialog="openDialog"
            />
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2000" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-divider
          class="mt-1"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <v-row justify="center" align="center" dense class="mb-3 mt-2">
          <v-btn
            color="indigo"
            class="ma-2 white--text"
            @click="validar_guardar()"
            :disabled="disabled.guardar"
          >
            Guardar
          </v-btn>
          <v-btn color="purple" dark class="mx-2" @click="imprimir_cita()">
            Imprimir
          </v-btn>
          <v-btn color="red" dark class="mx-2" @click="dialogo.estado = false">
            Cerrar
          </v-btn>
        </v-row>

        <v-row class="mt-2 d-flex justify-center" no-gutters>
          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.cancelar"
              label="Cancelar Cita"
              @change="get_cancelar"
            ></v-switch>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-switch v-model="form.citadoble" label="Cita Doble"></v-switch>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.masiva"
              label="Agenda Masiva"
              @change="get_masiva"
            ></v-switch>
          </v-col>
        </v-row>
        <v-divider
          class="mb-4"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <v-card-text class="pb-0" ref="form">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Id_Paciente"
                v-model="selectPaciente"
                hide-details
                :error="errores.paciente"
                @input="errores.paciente = false"
                @change="errores.paciente = false"
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start align-center" cols="1">
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
            <v-col class="d-flex justify-start align-center" cols="2">
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

            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Descripcion Paciente"
                disabled
                v-model="form.descripaciente"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Usuario Agenda"
                disabled
                v-model="form.useragenda"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Usuario Cancela"
                disabled
                v-model="form.usercancela"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Motivo"
                disabled
                v-model="form.motivocancela"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="px-6 mt-4" color="orange"></v-divider>

          <v-row>
            <v-col class="d-flex mt-4" cols="12" v-if="selectMedico != null">
              <v-autocomplete
                outlined
                label="Servicio"
                :items="selectObjEstudios"
                return-object
                clearable
                v-model="selectEstudio"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col class="d-flex" cols="4" v-if="selectMedico != null">
              <v-btn
                color="purple"
                class="ma-2 white--text"
                @click="dialogo.habilitar = true"
                >Habilitar Horario</v-btn
              >
            </v-col> -->
          </v-row>
          <v-row class="d-flex justify-center" no-gutters>
            <v-col class="d-flex justify-start align-center" cols="4">
              <v-switch
                v-model="form.primeravez"
                label="Cita Primera vez"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row v-if="form.autorizacion">
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Autorización"
                v-model="form.autorizacion"
                hide-details
                disabled
                :error="errores.autorizacion"
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Autorizadas"
                v-model="form.totcitas"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Entidad"
                v-model="form.nombre_eps"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-card-text>
              <v-data-table
                :headers="headers_citaspac"
                :items="contenidocitasp"
                item-key="index"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.edit="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="get_soporte(item)"
                        color="red accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                      >
                        <v-icon>mdi-file-pdf-box</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir Soporte</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-row>
        </v-card-text>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.habilitar" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Habilitar Agenda</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Hora Inicio"
                clearable
                outlined
                type="time"
                v-model="hora_ini"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
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
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Correo"
                clearable
                outlined
                v-model="form.correo"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Telefono"
                clearable
                outlined
                v-model="form.telefono"
                counter="10"
                :rules="[(v) => (v && v.length <= 10) || 'Maximo 15 digitos']"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Telefono_2"
                clearable
                outlined
                v-model="form.telefono2"
                counter="10"
                :rules="[(v) => (v && v.length <= 10) || 'Maximo 15 digitos']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Direccion"
                clearable
                outlined
                required
                v-model="form.direccion"
                :error="errores.direccion"
                @input="errores.direccion = false"
                :rules="[(v) => (v && v.length <= 60) || 'Maximo 60 digitos']"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
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
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Ciudad"
                v-model="form.ciudad"
                :items="filterMunicipios"
                item-value="value"
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
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
                  { text: 'Viudez', value: 5 },
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
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
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
            <v-col class="d-flex" cols="3">
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

            <v-col class="d-flex" cols="6">
              <v-select
                :items="[
                  { text: 'Contributivo cotizante', value: 1 },
                  { text: 'Contributivo beneficiario', value: 2 },
                  { text: 'Contributivo adicional', value: 3 },
                  { text: 'Subsidiado', value: 4 },
                  { text: 'No afiliado', value: 5 },
                  { text: 'Especial o Excepcion cotizante', value: 6 },
                  { text: 'Especial o Excepcion beneficiario', value: 7 },
                  {
                    text: 'Personas privadas de la libertad a cargo del Fondo Nacional de Salud',
                    value: 8,
                  },
                  { text: 'Tomador / Amparado ARL', value: 9 },
                  { text: 'Tomador / Amparado SOAT', value: 10 },
                ]"
                label="Tipo Usuario"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipousuario"
                item-text="text"
                item-value="value"
                required
                :error="errores.tipousuario"
                @change="errores.tipousuario = false"
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
    <v-dialog v-model="dialogocanc.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Cancelar Agenda</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-select
                :items="motivos"
                label="Motivo"
                clearable
                return-object
                hide-details
                required
                v-model="form.tipomotivo"
                :error="errores.tipomotivo"
                @change="errores.tipomotivo = false"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción motivo"
                clearable
                outlined
                type="text"
                v-model="motivocanc"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex justify-center" no-gutters>
            <v-col class="d-flex justify-start align-center" cols="4">
              <v-switch
                v-model="form.habilitar_canc"
                label="Habilitar Horario"
              ></v-switch>
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

    <v-dialog v-model="dialogomasiva.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Agendamiento Masivo</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Profesional"
                clearable
                disabled
                type="text"
                v-model="masiva.profesional"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Paciente"
                clearable
                disabled
                type="text"
                v-model="masiva.paciente"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Autorización"
                clearable
                disabled
                type="text"
                v-model="masiva.autoriza"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-btn
                  :disabled="disabled.grab_masivo"
                  color="indigo"
                  class="ma-2 white--text"
                  @click="grabar_masiva()"
                  >Grabar</v-btn
                >
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="red"
                  class="ma-2 white--text"
                  @click="dialogomasiva.estado = false"
                  >Salir</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>

          <v-data-table
            v-if="agendas_pac.length != 0"
            v-model="tabla_pacie"
            :headers="headers_masiva"
            :items="agendas_pac"
            item-key="index_rep"
            :show-select="true"
            hide-default-footer
            disable-pagination
            class="elevation-1"
            @input="onSeleccionTablaPacie($event)"
          >
            <template v-slot:item.id_hora="{ item }">
              {{ item.id_hora }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoauto.estado" max-width="800" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Validación de Autorizaciones</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                outlined
                label="Nro Autorización"
                hide-details
                ref="nroauto_refer"
                v-model="form.nro_validaauto"
                @keyup.enter="get_autoriza()"
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-btn
                id="validaauto_refer"
                class="mt-2 white--text"
                color="orange"
                depressed
                large
                @click="get_autoriza()"
                >Consultar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            large
            depressed
            @click="dialogoauto.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="autorizacion.estado" max-width="1100" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Registro de Autorizaciones</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                outlined
                label="Nro Autorización"
                hide-details
                disabled
                ref="nroauto_refer"
                v-model="form.nro_auto"
                clearable
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickeFecha_auto"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_auto"
                    label="Fecha Autorización"
                    append-icon="event"
                    hide-details
                    outlined
                    :error="errores.fecha_auto"
                    @change="errores.fecha_auto = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_auto"
                  @input="pickeFecha_auto = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickeFecha_venceauto"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_venceauto"
                    label="Fecha Vencimiento"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_venceauto"
                  @input="pickeFecha_venceauto = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickeFecha_autoaccid"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_accid"
                    label="Fecha Accidente"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_accid"
                  @input="pickeFecha_autoaccid = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Id_Paciente"
                v-model="selectPaciente"
                hide-details
                :error="errores.paciente"
                @input="errores.paciente = false"
                @keyup.enter="buscar_paciente(1)"
                @change="errores.paciente = false"
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start align-center" cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="buscar_paciente(1)"
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
            <v-col class="d-flex justify-start align-center" cols="2">
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

            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Descripcion Paciente"
                disabled
                v-model="form.descripaciente"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" sm="12">
              <v-autocomplete
                :items="diagnosticos"
                :item-text="format_diagnostico"
                item-value="codigo"
                label="Diagnostico"
                outlined
                clearable
                hide-details
                v-model="form.dx_auto"
                :error="errores.diagnostico"
                @change="errores.diagnostico = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="12">
              <v-autocomplete
                label="Codigo Paquete para Facturación"
                :items="selectObjEstudios"
                clearable
                return-object
                hint="Si no aplica dejar vacio"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.codpaquete"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-divider class="px-6 mt-4" color="orange"></v-divider>

          <v-row class="px-6 mt-1 justify-center">
            <span class="subtitle-1">Servicios Autorizados</span>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic1_auto"
                @change="errores.servic1_auto = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant_auto"
                hide-details
                clearable
                :error="errores.cant_auto"
                @input="errores.cant_auto = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq_auto"
                hide-details
                clearable
                :error="errores.cantreq_auto"
                @input="errores.cantreq_auto = false"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic2_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant2_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq2_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic3_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant3_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq3_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic4_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant4_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq4_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic5_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant5_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq5_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4">
              <v-file-input
                label="Cargar Autorización"
                accept=".pdf"
                outlined
                hide-details
                v-model="form.pdf"
                @change="errores.pdf = false"
              ></v-file-input>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-textarea
                label="Observaciones"
                clearable
                outlined
                required
                v-model="form.observ_auto"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-col class="d-flex" cols="3">
            <v-btn
              class="mt-2 white--text"
              color="indigo"
              depressed
              :loading="load_guardar"
              large
              @click="grabar_autoriza()"
              >Grabar Autorización</v-btn
            >
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-btn
              class="mt-2 white--text"
              color="red"
              depressed
              large
              @click="autorizacion.estado = false"
              >Cancelar</v-btn
            >
          </v-col>
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
import Agenda from '../common/calendar/index.vue'

import { agenda_medico } from "../../_formatos_sal.js";
import { recordatorioCitas } from "../../_formatos_sal.js";
import { FlowerSpinner } from "epic-spinners";

import PrPacientes from "../ssalud/PrPacientes.vue";

export default {
  inject: ["setLoader", "setLoaderText"],
  components: {
    Agenda,
    FlowerSpinner,
    PrPacientes,
  },
  // data: () => ({
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
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Dia",
        week: "Semana",
        day: "Dia",
        "4dia": "4 Dias",
      },
      selectedEvent: {},
      pacientes: [],
      selectedElement: null,
      selectedOpen: false,
      events: [],
      horaini: 0,
      id_eps: 0,
      total_asignadas: 0,
      copiaval: null,
      pickerNacimiento: false,
      pickeFecha_auto: false,
      pickeFecha_venceauto: false,
      pickeFecha_autoaccid: false,
      format_fecha_nacimiento: null,
      fecha_actual: null,
      select_autorizacion: "",
      select_cups: null,

      eps: [],
      ciudades_dian: [],
      agencias: [],
      departamentos: [],
      filterMunicipios: [],
      selectObjEstudios: [],
      selectObjContratos: [],
      medicos: [],
      selectMedio: [],
      estudios: [],
      servicios: [],
      diagnosticos: [],
      agendas_pac: [],
      tabla_pacie: [],
      loader: false,
      citadoble: false,
      primeravez: false,
      load_guardar: false,
      habilitar_agenda: false,
      nroauto: 0,

      selectEstudio: null,
      selectPaciente: null,
      selectContrato: null,
      load_contrato: true,
      selectMedico: null,
      motivocanc: null,
      hora_ini: null,
      hora_fin: null,
      item_select: {},

      motivos: [
        { text: "Cancela el paciente", value: 1 },
        { text: "Cancelación de Agenda", value: 2 },
        { text: "Devolución del paciente", value: 3 },
        { text: "Traslado de Agenda", value: 4 },
        { text: "Atendido por otro Profesional", value: 5 },
        // { text: "Paciente no Asiste", value: 6 },
      ],

      dialogocanc: {
        estado: false,
      },

      dialogomasiva: {
        estado: false,
      },
      autorizacion: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoauto: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      contenidocitasp: [],
      headers_masiva: [
        { text: "Item", align: "center", value: "index_rep" },
        { text: "Fecha", align: "center", value: "fecha", width: "120px" },
        { text: "Hora", align: "left", value: "id_hora" },
        { text: "Profesional", align: "left", value: "descripcion" },
      ],

      headers_citaspac: [
        { text: "Item", align: "center", value: "item_rep" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        { text: "Estado", align: "left", value: "estado" },
        { text: "Profesional", align: "center", value: "descripcion" },
        { text: "Descripción", align: "left", value: "desc_servicio" },
        { text: "Observaciones", align: "left", value: "desc_observacion" },
        { text: "Autorización", align: "left", value: "autorizacion" },
        { text: "Soporte", align: "left", value: "edit" },
      ],

      card_estado: false,
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

      errores: {
        paciente: false,
        punto_fact: false,
        tipoid: false,
        fecha_auto: false,
        idpaciente: false,
        primerApellido: false,
        nombre1: false,
        departamento: false,
        ciudad: false,
        nacimiento: false,
        tipomotivo: false,
        direccion: false,
        pdf: false,
        cant_auto: false,
        servic1_auto: false,
        cantreq_auto: false,
        tipousuario: false,
      },

      select_masivo: {
        paciente_selected: null,
        primeravez_selected: 0,
        fecha_selected: null,
        hora_selected: null,
      },
      form: {
        punto_fact: null,
        descripaciente: null,
        cancelar: false,
        citadoble: false,
        habilitar_canc: false,
      },

      masiva: {
        estado: false,
        profesional: null,
        paciente: null,
        autoriza: null,
      },
      idagenda: 0,
      fechagenda: 0,
      horaagenda: 0,
      disabled: {
        grab_masivo: false,
        guardar: false,
      },

      dialogo: {
        habilitar: false,
        estado: false,
        titulo: null,
        tipo: null,
      },
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],
    };
  },
  mounted() {},
  created() {
    this.fecha_actual = this.$moment().format("YYYYMMDD");
    this.cargarTablaAg();
    // this.cargar_empresa();
    this.cargarContratos();
    this.cargarCiudades();
    this.cargarEps();
    this.get_diagnosticos();

    // this.cargarAgendamiento();
  },

  watch: {
    selectContrato: function (value, text) {
      post
        .postData({
          url: "Clinico/dlls/titcl304j.dll",
          data: sessionStorage.Sesion + "|" + value.value + "|",
          method: "",
        })
        .then((data) => {
          this.estudios = data[0].servicios;
          this.id_eps = data[0].identificacion;
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
  },
  methods: {
    async cargarTablaAg() {
      try {
        const data = await post.postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        });
        var filtro = data.filter((el) => el.estado_agc == "0");
        this.agencias = filtro;
        await this.cargar_empresa();
      } catch (err) {
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar Agencias",
          estado: true,
        });
      }
    },
    async get_soporte(item) {
      let empresa = parseFloat(this.empresa[0].id_empr);
      let nro_auto = item.autorizacion.trim();
      let id_cliente = parseFloat(item.idcontrato);
      let idFile = empresa + "PRAUTO_" + id_cliente + "_" + nro_auto + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

      const timestamp = new Date().getTime(); // Genera un timestamp único
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank"); // Abre el PDF
    },
    async get_autoriza() {
      let nro_auto = this.form.nro_validaauto;
      let entidad = this.selectContrato.id_entidad;
      this.form.totcitas = 0;
      this.form.nombre_eps = null;
      post
        .postData({
          url: "Clinico/dlls/ClAutoriza01J.dll",
          data: sessionStorage.Sesion + "|" + entidad + "|" + nro_auto + "|",
          method: "",
        })
        .then((data) => {
          let id_paciente = parseFloat(data[0].idpaciente_rep);
          let tot_citas = parseFloat(data[0].total_rep);

          if (id_paciente == 0) {
            this.autorizacion.estado = true;
            this.form.nro_auto = nro_auto;
            this.form.fecha_auto = "";
            this.form.fecha_venceauto = "";
            this.form.fecha_accid = "";
            this.form.servic1_auto = "";
            this.form.cant_auto = "";
            this.form.cantreq_auto = "";
            this.form.servic2_auto = "";
            this.form.cant2_auto = "";
            this.form.cantreq2_auto = "";
            this.form.servic3_auto = "";
            this.form.cant3_auto = "";
            this.form.cantreq3_auto = "";

            this.form.dx_auto = "";
            this.form.observ_auto = "";
            this.selectPaciente = "";
            this.form.descripaciente = "";
            this.form.pdf = "";
            this.form.useragenda = "";
            this.form.usercancela = "";
            this.form.motivocancela = "";
          } else {
            this.dialogoauto.estado = false;
            this.dialogo.estado = true;
            this.form.masiva = false;
            this.selectPaciente = id_paciente;
            this.buscar_paciente();

            this.form.cant_auto = data[0].cant_rep;
            let servicio = data[0].cups_rep.trim();
            let busq_select = "";

            busq_select = this.selectObjEstudios.find(
              (el) => el.value.trim() == servicio
            );
            this.selectEstudio = busq_select;
            this.form.autorizacion = nro_auto;
            this.form.totcitas = tot_citas;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Autorizacion",
            estado: true,
          });
        });
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
    openDialog(tms) {
      if (!this.selectContrato) {
        this.$emit("snack", {
          color: "error",
          text: "Debe seleccionar un contrato",
          estado: true,
        });
      } else {
        this.tms = tms;
        const { event } = tms;
        this.citadoble = false;
        this.primeravez = false;
        //        console.log("show event", event);
        if (event.bloqueo === "9") {
          this.$emit("snack", {
            color: "red",
            text: "Agenda Bloqueada",
            estado: true,
          });
        } else {
          this.selectPaciente = event.id_paciente.trim().replace(/^0+/, "");
          // this.buscar_citas(this.selectPaciente);
          this.cita_select(event);
          this.item_select = event;
          this.form.descripaciente = event.name;
          let busqueda_cups = this.selectObjEstudios.find(
            (el) => el.value.trim() == event.cups
          );
          this.selectEstudio = busqueda_cups;

          this.dialogo.titulo =
            "Fecha: " + event.start + "_" + this.selectMedico.descripcion;

          this.idagenda = event.id_agenda;
          this.fechagenda = event.fecha_agenda;
          this.horaagenda = event.hora_agenda.replace(/\:/g, "");
          this.form.cancelar = false;
          this.form.citadoble = false;
          this.form.habilitar_canc = false;
          // this.form.nombre_eps = this.item_select.nombre_eps;
          // this.form.useragenda = this.item_select.usuarioagenda;
          // this.form.usercancela = this.item_select.usuariocanc;
          // this.form.motivocancela = this.item_select.motivo;

          // this.dialogo.estado = true;
        }
      }
    },
    async cargar_empresa() {
      try {
        const data = await post.postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        });
        this.empresa = data;
        var busqueda_sede = this.agencias.find(
          (el) => el.codigo_agc == this.empresa[0].agencia_empr
        );
        this.form.punto_fact = busqueda_sede;
        await this.get_profesionales();
      } catch (err) {
        console.log(err);
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar empresa",
          estado: true,
        });
      }
    },
    cargarAgendamiento: function (value = null) {
      console.log("cargarAgendamiento", value);
      this.agendaPaciente = [];
      this.events = [];
      this.copiaval = value;
      this.form.autorizacion = "";
      let fechaini = value.start.date.replace(/\-/g, "");
      let fechafin = value.end.date.replace(/\-/g, "");
      this.fechagenda = value.fecha_agenda;
      let date_default = new Date()
        .toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split(",")[0]
        .split("/")
        .reverse()
        .join("");

      this.load_table = true;
      let medico = parseFloat(this.selectMedico.id);

      fechaini = value ? fechaini : date_default;

      let disponibles = 0;
      this.setLoader(true, "Consultando Agendamiento...");

      // let medico = 79617600;
      let datos =
        sessionStorage.Sesion +
        "|" +
        fechaini +
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
        "|" +
        "|" +
        fechafin +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrAgenda01J.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.setLoader(false);

          let result = [];
          this.horaini = data[0].hora;
          if (data[0].bloqueo == 1) {
            this.habilitar_agenda = true;
          } else {
            this.habilitar_agenda = false;
          }
          data.pop();

          let intervalo = 0;
          if (data[0].rango < 10) {
            intervalo = 300;
          } else {
            intervalo = 100;
          }

          data.forEach((item) => {
            let rango = parseFloat(item.rango);
            //rango = 0;
            let tms =
              item.ano +
              "-" +
              item.mes +
              "-" +
              item.dia +
              " " +
              item.hora +
              ":" +
              item.minuto;

            let momentDate = this.$moment(tms);
            let momentEnd = momentDate
              .add(rango, "minutes")
              .format("YYYY-MM-DD HH:mm");

            let createEvent = {
              name:
                item.descrip_paciente.trim() +
                "-" +
                "\n" +
                item.desc_servicio.trim() +
                "-",
              color: item.color,
              start: tms,
              end: momentEnd,
              timed: true,
              servicio: item.desc_servicio.trim(),
              cups: item.cod_servicio.trim(),
              entidad: item.entidad_paciente.trim(),
              id_paciente: item.id_paciente,
              tel_paciente: item.tel_paciente,
              id_agenda: item.identificacion,
              fecha_agenda: item.fecha,
              hora_agenda: item.id_hora,
              hora_inicio: item.hora,
              intervalo: intervalo,
              bloqueo: item.estado,
              useragenda: item.usuarioagenda.trim(),
              usercancela: item.usuariocanc.trim(),
              motivocancela: item.motivo.trim(),
            };
            result.push(createEvent);
          });
          this.setLoader(false);
          this.events = result;
        })
        .catch((err) => {
          this.setLoader(false);

          console.log("Error_dll", err);
          if (err[0].bloqueo) {
            this.habilitar_agenda = true;
          } else {
            this.habilitar_agenda = false;
          }
          this.$emit("snack", {
            color: "error",
            text: "Agenda sin Habilitar",
            estado: true,
          });
        });
    },
    buscar_citas(paciente) {
      this.contenidocitasp = [];
      post
        .postData({
          url: "Clinico/dlls/PrCitasJP.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.contenidocitasp = data;
        })
        .catch((err) => {
          console.error("Error: ", err);
          $this.load.citas = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar las citas del paciente",
            estado: true,
          });
        });
    },
    async cita_select(paciente) {
      this.nroauto = 0;
      let autorizacion = this.form.autorizacion ? this.form.autorizacion : "";
      let idagenda = paciente.id_agenda;
      let idpaciente = parseFloat(paciente.id_paciente);
      let fecha = paciente.fecha_agenda;
      let hora = paciente.hora_agenda.replace(/\:/g, "");
      this.contenidocitasp = [];
      if (idpaciente > 0) {
        post
          .postData({
            url: "Clinico/dlls/PrCitas01JP.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              idagenda +
              "|" +
              idpaciente +
              "|" +
              fecha +
              "|" +
              hora +
              "|" +
              autorizacion +
              "|" +
              1 +
              "|",
            method: "POST",
          })
          .then((data) => {
            let error = null;
            error = data[0].msg;
            data.pop();
            this.contenidocitasp = data;
            const filtrados = this.contenidocitasp.filter(
              (item) => item.estado.trim() === "Activa"
            );
            let citas_asig = filtrados.length;
            this.total_asignadas = citas_asig;
            if (this.empresa[0].id_empr == 900108793) {
              if (this.form.totcitas > 0 && citas_asig >= this.form.totcitas) {
                this.send_error("Supera la cantidad de citas Autorizadas!");
                this.disabled.guardar = true;
              } else {
                this.disabled.guardar = false;
              }
            } else {
              this.disabled.guardar = false;
            }

            // if (parseInt(this.empresa[0].id_empr) == 900108793) {
            //   this.dialogoauto.estado = true;
            // } else {
            //   this.dialogo.estado = true;
            // }

            this.form.useragenda = paciente.useragenda;
            this.form.usercancela = paciente.usercancela;
            this.form.motivocancela = paciente.motivocancela;
            this.buscar_paciente_2();

            if (error == "Paciente No valido") {
              if (parseInt(this.empresa[0].id_empr) == 900108793) {
                this.form.nro_validaauto = "";
                this.dialogoauto.estado = true;
              } else {
                this.dialogo.estado = true;
              }
            } else {
              this.dialogo.estado = true;
            }
          })
          .catch((err) => {
            console.error("Error: ", err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar las citas del paciente",
              estado: true,
            });
          });
      } else {
        if (parseInt(this.empresa[0].id_empr) == 900108793) {
          if (this.selectContrato.autoriza == 0) {
            post
              .postData({
                url: "Clinico/dlls/AutorizaN.dll",
                data: sessionStorage.Sesion + "|",
                method: "",
              })
              .then((data) => {
                this.form.nro_validaauto = parseFloat(data[0].nro);
                this.nroauto = parseFloat(data[0].nro);
                this.dialogoauto.estado = true;
              })
              .catch((err) => {
                this.$emit("snack", {
                  color: "error",
                  text: "Error al cargar consecutivo",
                  estado: true,
                });
              });
          } else {
            this.form.nro_validaauto = "";
            this.dialogoauto.estado = true;
          }
        } else {
          this.dialogo.estado = true;
        }
      }
    },
    buscar_paciente(tipo) {
      let $this = this;
      this.form.idpaciente = $this.selectPaciente;
      this.descripaciente = null;
      let paciente = $this.selectPaciente;
      this.clear_paciente();
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data[0];
          this.form.descripaciente = $this.pacientes.descrip_rep.trim();

          this.form.departamento = $this.pacientes.ciudad.substring(0, 2);
          this.get_municipios();

          this.form.tipoid = $this.pacientes.tipoid.trim();
          this.form.primerApellido = $this.pacientes.primerApellido.trim();
          this.form.segundoApellido = $this.pacientes.segundoApellido.trim();
          this.form.nombre1 = $this.pacientes.nombres.trim();
          this.form.nombre2 = $this.pacientes.nombre2.trim();
          this.form.correo = $this.pacientes.correo.trim();
          this.form.telefono = $this.pacientes.telefono.trim();
          this.form.telefono2 = $this.pacientes.telefono2.trim();
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
          this.form.tipousuario = {
            value: parseInt(this.pacientes.tipousuario),
          };
          this.calcularEdadpac();

          let dato_paciente = {
            id_agenda: this.idagenda,
            id_paciente: this.form.idpaciente,
            fecha_agenda: this.fechagenda,
            hora_agenda: this.horaagenda,
          };
          // this.buscar_citas(paciente);
          if (tipo == 1) {
            console.log(tipo);
          } else {
            this.cita_select(dato_paciente);
          }
        })
        .catch((err) => {
          this.form.descripaciente = "";
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
    async buscar_paciente_2() {
      let $this = this;
      this.form.idpaciente = $this.selectPaciente;
      this.descripaciente = null;
      let paciente = $this.selectPaciente;
      this.clear_paciente();
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data[0];
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
    Imprimir_agenda(origen) {
      this.load_table = true;
      let medico = parseFloat(this.selectMedico.id);
      this.fechagenda = this.copiaval.start.date.replace(/\-/g, "");

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fechagenda +
        "|" +
        medico +
        "|" +
        0 +
        "|" +
        0 +
        "|" +
        0 +
        "|" +
        0 +
        "|" +
        0 +
        "|" +
        1 +
        "|" +
        origen +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl102j.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.load_table = false;

          let dataparse = {
            agendamientos: [...data],
          };

          this.generar_pdf(dataparse);
        })
        .catch((err) => {
          this.load_table = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
            estado: true,
          });
        });
    },
    generar_pdf(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      data.id_empr = parseInt(this.empresa[0].id_empr);
      data.nombre_empr = this.empresa[0].descrip_empr;

      data.profesional_rep = this.selectMedico.descripcion;
      data.especialidad_rep = this.selectMedico.descr_tipo;
      data.fecha_rep = data.agendamientos[0].fecha;

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        agenda_medico(data).then(() => {
          console.log("Impresion terminada");
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
    imprimir_cita() {
      let idpaciente = this.selectPaciente;
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/Rpagepac01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.idagenda +
            "|" +
            this.fechagenda +
            "|" +
            this.horaagenda +
            "|",
          method: "",
        })
        .then((data) => {
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          data = data[0];

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            data.nombre_empresa = this.empresa[0].descrip_empr;
            data.nit_empresa = this.empresa[0].ideditado_empr;
            data.direccion_empresa = this.empresa[0].direccion_empr;
            data.ciudad_empresa = this.empresa[0].Ciudad;
            data.telefono_empresa = this.empresa[0].telefono_empr;
            data.email_empresa = this.empresa[0].email_empr;

            recordatorioCitas(data).then(() => {
              console.log("Impresion terminada");
            });
          });

          this.loader = false;
          this.dialogo.estado = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir Agenda",
            estado: true,
          });
        });
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    validar_guardar() {
      if (this.empresa[0].id_empr == 900108793) {
        let tot_citas = 0;

        this.contenidocitasp.forEach((el, index) => {
          if (el.estado == "Activa    ") {
            tot_citas = tot_citas + 1;
          }
        });

        if (tot_citas == parseFloat(this.form.totcitas)) {
          this.$emit("snack", {
            color: "error",
            text: "Paciente supera Citas Autorizadas",
            estado: true,
          });
        } else {
          this.guardar_agenda();
        }
      } else {
        this.guardar_agenda();
      }
    },
    async guardar_agenda(tipo) {
      if (this.fechagenda < this.fecha_actual) {
        this.$emit("snack", {
          color: "error",
          text: "Error No puede Agendar en fecha anterior a hoy",
          estado: true,
        });
      } else {
        let idpaciente = this.selectPaciente;
        let contrato = this.selectContrato.value;
        let cups = this.selectEstudio.value;
        let medio = this.selectMedio.value;
        let agencia = this.form.punto_fact.codigo_agc;
        let eliminar = this.form.cancelar ? 2 : 0;
        let autorizacion = this.form.autorizacion;
        let motivo = 0;
        let doble = this.form.citadoble ? 1 : 0;
        let primeravez = this.form.primeravez ? 1 : 0;
        let fecha_envio = this.fechagenda;
        let hora_envio = this.horaagenda;
        if (tipo == 1) {
          fecha_envio = this.select_masivo.fecha_selected;
          hora_envio = this.select_masivo.hora_selected;
        }

        this.loader = true;
        post
          .postData({
            url: "Clinico/dlls/titcl102.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              this.idagenda +
              "|" +
              fecha_envio +
              "|" +
              hora_envio +
              "|" +
              idpaciente +
              "|" +
              this.id_eps +
              "|" +
              contrato +
              "|" +
              cups +
              "|" +
              medio +
              "|" +
              agencia +
              "|" +
              eliminar +
              "|" +
              motivo +
              "|" +
              "0" +
              "|" +
              autorizacion +
              "|" +
              doble +
              "|" +
              primeravez +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.dialogo.estado = false;
            this.selectContrato = null;
            this.cargarAgendamiento(this.copiaval);
          })
          .catch((err) => {
            console.log(err.Mensaje[0]);
            this.loader = false;
            this.cargarAgendamiento(this.copiaval);

            this.$emit("snack", {
              color: "error",
              text: err.Mensaje[0],
              estado: true,
            });
          });
      }
    },

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    async get_profesionales() {
      this.loader = true;
      let agencia = this.form.punto_fact.codigo_agc;
      let dll = sessionStorage.Sesion.substring(0, 15);
      if (
        dll === "000000901099286" ||
        dll === "000000900767863"
        // dll === "000000999999999"
      ) {
        dll = "Clinico/dlls/ClCfSalasJ.dll";
      } else {
        dll = "Clinico/dlls/CfAsistecJ.dll";
      }
      try {
        const data = await post.postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        });
        this.medicos = JSON.parse(JSON.stringify(data));
        this.loader = false;
      } catch (err) {
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar Salas",
          estado: true,
        });
      }
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
              id_entidad: parseInt(k.identificacion),
              autoriza: parseInt(k.autoriza),
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
    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
    },
    cargar_cups() {
      this.estudios.forEach((k, v) => {
        this.selectObjEstudios.push({
          text: k.codigo + " - " + k.descripcion,
          value: k.codigo,
        });
      });
      if (!this.copiaval) {
        this.focus = [];
      } else {
        this.cargarAgendamiento(this.copiaval);
      }
    },
    async crear_paciente() {
      this.up_paciente();
      this.mostrarFormularioPaciente = true;
    },
    cerrarFormularioPaciente() {
      this.mostrarFormularioPaciente = false;
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
        this.datapaciente.pac_eps = this.pacientes.eps.trim();
        this.datapaciente.pac_genero = parseFloat(this.pacientes.genero);
        this.datapaciente.pac_zona = parseFloat(this.pacientes.zona);
        this.datapaciente.pac_nivel = parseFloat(this.pacientes.nivel);
        this.datapaciente.pac_contrasena = this.pacientes.contrasena;
        this.datapaciente.pac_factivacion = this.pacientes.fechaAct;
        this.datapaciente.pac_estado = parseFloat(this.pacientes.estado);
      } else {
        this.datapaciente.pac_identificacion = parseFloat(this.selectPaciente);
      }
      this.mostrarFormularioPaciente = true;
    },
    async clear_paciente() {
      this.pacientes = [];
      this.datapaciente = {
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
      };
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
      } else if (!data.direccion) {
        this.errores.direccion = true;
        this.send_error("Dirección Obligatoria!");
      } else if (!data.tipousuario) {
        this.errores.tipousuario = true;
        this.send_error("Tipo Usuario Obligatorio!");
      } else {
        this.envio_paciente(data);
      }
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    envio_paciente() {
      this.dialogopac.estado = false;
      let eliminar = this.form.cancelar ? 2 : 0;
      let nombre2 = this.form.nombre2 ? this.form.nombre2.trim() : "";
      let tipoid = this.form.tipoid.value
        ? this.form.tipoid.value
        : this.form.tipoid;
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
          this.form.telefono2 +
          "|" +
          this.form.tipousuario.value +
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
    habilitar() {
      this.fechagenda = this.copiaval.start.date.replace(/\-/g, "");

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fechagenda +
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
    abrir_habilitar() {
      this.dialogo.habilitar = true;
      let hora = new Date();
      this.hora_ini = hora.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      this.hora_fin = this.hora_ini;
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
    grabar_canc() {
      if (!this.form.tipomotivo) {
        this.errores.tipomotivo = true;
        this.send_error("Seleccione un motivo!");
      } else {
        this.dialogocanc.estado = false;
        let idpaciente = this.selectPaciente;
        let contrato = this.selectContrato.value;
        let cups = this.selectEstudio.value;
        let tipocanc = this.form.tipomotivo.value;

        let medio = this.selectMedio.value;
        let agencia = this.form.punto_fact.codigo_agc;
        let eliminar = this.form.cancelar ? 1 : 0;
        let motivo = 0;
        let autorizac = "";
        let doble = this.form.habilitar_canc ? 2 : 0;

        this.loader = true;
        post
          .postData({
            url: "Clinico/dlls/titcl102.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              this.idagenda +
              "|" +
              this.fechagenda +
              "|" +
              this.horaagenda +
              "|" +
              idpaciente +
              "|" +
              this.id_eps +
              "|" +
              contrato +
              "|" +
              cups +
              "|" +
              medio +
              "|" +
              agencia +
              "|" +
              2 +
              "|" +
              this.motivocanc +
              "|" +
              tipocanc +
              "|" +
              autorizac +
              "|" +
              doble +
              "|" +
              0 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.dialogo.estado = false;
            this.cargarAgendamiento(this.copiaval);
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
      }
    },
    format_servicios(val) {
      return `${val.codigo} - ${val.descripcion}`;
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    get_masiva() {
      let masiva = this.form.masiva ? 2 : 0;
      if (masiva === 2) {
        this.get_agenda_masiva();
        this.masiva.profesional = this.selectMedico.descripcion;
        this.masiva.paciente = this.form.descripaciente;
        this.masiva.autoriza = this.form.autorizacion;

        this.dialogomasiva.estado = true;
      } else {
        this.dialogomasiva.estado = false;
      }
      this.form.cancelar = false;
    },
    get_agenda_masiva() {
      this.setLoader(true, "Consultando Agenda...");

      this.agendas_pac = [];
      let medico = parseFloat(this.selectMedico.id);
      let datos = sessionStorage.Sesion + "|" + medico + "|";
      post
        .postData({
          url: "Clinico/dlls/PrAgenda02J.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          data.pop();
          const dataConIndex = data.map((item, index) => ({
            ...item,
            index_rep: index + 1,
          }));

          this.agendas_pac = dataConIndex;
          this.setLoader(false);
        })
        .catch((err) => {
          this.setLoader(false);
          console.log("Error", err);
          this.$emit("snack", {
            color: "error",
            text: "Agenda sin Habilitar",
            estado: true,
          });
        });
    },
    async grabar_masiva() {
      const seleccionados =
        this.tabla_pacie?.filter((item) => this.agendas_pac.includes(item)) ||
        [];

      if (seleccionados.length === 0) {
        this.$toast?.warning("No hay elementos seleccionados.");
        return;
      }

      this.setLoader(true, "Procesando citas seleccionadas...");

      for (const item of seleccionados) {
        try {
          await this.procesarCita(item);
        } catch (error) {
          console.error("Error al procesar cita:", item, error);
          this.$toast?.error(`Error en la cita: ${item.hora || "desconocida"}`);
        }
      }

      this.setLoader(false);
      this.$toast?.success("Citas procesadas correctamente.");
      this.dialogomasiva.estado = false;
      this.dialogo.estado = false;
      this.tabla_pacie = [];
    },
    async procesarCita(item) {
      this.select_masivo.fecha_selected = item.fecha;
      this.select_masivo.hora_selected = item.id_hora.replace(":", "");
      await this.guardar_agenda(1);
    },
    get_cancelar() {
      let cancela = this.form.cancelar ? 2 : 0;
      if (cancela === 2) {
        this.dialogocanc.estado = true;
      } else {
        this.dialogocanc.estado = false;
      }
      this.form.cancelar = false;
    },
    async grabar_autoriza() {
      if (!this.form.fecha_auto) {
        this.errores.fecha_auto = true;
        this.send_error("Debe indicar una fecha de la autorizacion!");
      } else if (!this.selectPaciente) {
        this.errores.paciente = true;
        this.send_error("Debe indicar una identificacion de paciente!");
      } else if (!this.form.cant_auto) {
        this.errores.cant_auto = true;
        this.send_error("Debe indicar cantidad del servicio!");
      } else if (!this.form.cantreq_auto) {
        this.errores.cantreq_auto = true;
        this.send_error("Debe indicar cantidad citas requeridas!");
      } else if (!this.form.pdf) {
        this.errores.pdf = true;
        this.send_error("Pdf de la autorización Obligatoria!");
      } else if (!this.form.dx_auto) {
        this.errores.diagnostico = true;
        this.send_error("Debe indicar un diagnostico!");
      } else if (!this.form.servic1_auto) {
        this.errores.servic1_auto = true;
        this.send_error("Debe indicar codigo del servicio!");
      } else {
        let nro_auto = this.form.nro_auto;
        let id_cliente = this.selectContrato.id_entidad;
        await this.subir_pdf(id_cliente, nro_auto);
        await this.guardar_autorizacion(id_cliente, nro_auto);
        this.autorizacion.estado = false;

        let busq_select = this.selectObjEstudios.find(
          (el) => el.value.trim() == this.select_cups.trim()
        );

        this.selectEstudio = busq_select;
        this.form.autorizacion = this.select_autorizacion;
        this.form.totcitas = this.form.cant_auto;
      }
    },
    async guardar_autorizacion(id_cliente, nro_auto) {
      let fecha = this.form.fecha_auto.replace(/\-/g, "");
      let fechavence = this.form.fecha_venceauto
        ? this.form.fecha_venceauto.replace(/\-/g, "")
        : 0;
      let fechaaccid = this.form.fecha_accid
        ? this.form.fecha_accid.replace(/\-/g, "")
        : 0;
      let id_paciente = this.form.idpaciente;
      let cantidad = this.form.cant_auto;
      let cant_citas = this.form.cantreq_auto;
      let dx = this.form.dx_auto;
      let servicio = this.form.servic1_auto.value;
      this.select_autorizacion = nro_auto;
      this.select_cups = servicio;
      let contrato = this.selectContrato.value;
      let servicio2 = this.form.servic2_auto
        ? this.form.servic2_auto.value.trim()
        : "";
      let cantidad2 = this.form.cant2_auto ? this.form.cant2_auto : 0;
      let cant_citas2 = this.form.cantreq2_auto ? this.form.cantreq2_auto : 0;
      let servicio3 = this.form.servic3_auto
        ? this.form.servic3_auto.value
        : "";
      let cantidad3 = this.form.cant3_auto ? this.form.cant3_auto : 0;
      let cant_citas3 = this.form.cantreq3_auto ? this.form.cantreq3_auto : 0;

      let servicio4 = this.form.servic4_auto
        ? this.form.servic4_auto.value
        : "";
      let cantidad4 = this.form.cant4_auto ? this.form.cant4_auto : 0;
      let cant_citas4 = this.form.cantreq4_auto ? this.form.cantreq4_auto : 0;

      let servicio5 = this.form.servic5_auto
        ? this.form.servic5_auto.value
        : "";
      let cantidad5 = this.form.cant5_auto ? this.form.cant5_auto : 0;
      let cant_citas5 = this.form.cantreq5_auto ? this.form.cantreq5_auto : 0;

      let paquete = this.form.codpaquete ? this.form.codpaquete.value : "";

      let observacion = this.form.observ_auto;
      observacion = this.form.observ_auto
        ? observacion.replace(/(\r\n|\n|\r)/gm, "")
        : "";
      let textob64 = window.btoa(unescape(encodeURIComponent(observacion)));
      this.card_estado = true;
      post
        .postData({
          url: "Clinico/dlls/PrAutoriza.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            id_cliente +
            "|" +
            nro_auto +
            "|" +
            fecha +
            "|" +
            id_paciente +
            "|" +
            cantidad +
            "|" +
            dx +
            "|" +
            servicio +
            "|" +
            textob64 +
            "|" +
            cant_citas +
            "|" +
            contrato +
            "|" +
            fechavence +
            "|" +
            fechaaccid +
            "|" +
            servicio2 +
            "|" +
            cantidad2 +
            "|" +
            cant_citas2 +
            "|" +
            servicio3 +
            "|" +
            cantidad3 +
            "|" +
            cant_citas3 +
            "|" +
            servicio4 +
            "|" +
            cantidad4 +
            "|" +
            cant_citas4 +
            "|" +
            servicio5 +
            "|" +
            cantidad5 +
            "|" +
            cant_citas5 +
            "|" +
            paquete +
            "|" +
            this.nroauto +
            "|",
          method: "",
        })
        .then((data) => {
          this.card_estado = false;
        })
        .catch((err) => {
          this.card_estado = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Autorizacion_g",
            estado: true,
          });
        });
    },
    onSeleccionTablaPacie(seleccionados) {
      const cantidadSeleccionados = Array.isArray(seleccionados)
        ? seleccionados.length
        : 0;
      // console.log("Cantidad seleccionados:", cantidadSeleccionados);
      // console.log("Total Citas:", this.form.totcitas);
      // console.log("Total Asignadas:", this.total_asignadas);

      let tot_autorizadas = parseFloat(this.form.totcitas);
      let tot_asignadas =
        parseFloat(this.total_asignadas) + cantidadSeleccionados;
      if (tot_asignadas > tot_autorizadas) {
        this.send_error("Supera la cantidad de citas Autorizadas!");
        this.disabled.grab_masivo = true;

        return;
      } else {
        this.disabled.grab_masivo = false;
      }
    },
    format_cups(val) {
      return val.codigo.trim() + " - " + val.descripcion.trim();
    },
    async subir_pdf(id_cliente, nro_auto) {
      // this.load_guardar = true;
      let session = sessionStorage.Sesion;
      let agencia = sessionStorage.Sede;
      let empresa = parseFloat(this.empresa[0].id_empr);
      let cargue_pdf = this.form.pdf.name;
      let tipodoc = 1;
      let item = 1;
      let nombre_pdf =
        empresa + "PRAUTO_" + id_cliente + "_" + nro_auto + ".pdf";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("item", item);
      data.append("agencia", agencia);
      data.append("file", this.form.pdf);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_titan/salud.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.load_guardar = false;
      this.$emit("snack", {
        color: "success",
        text: "Autorización guardada Correctamente",
        estado: true,
      });
    },
  },
};
</script>