<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-group-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Buscar Pacientes por Apellido</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-row class="justify-center">
            <v-btn
              @click="buscar('A', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-a </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('B', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-b </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('C', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-c </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('D', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-d </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('E', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-e </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('F', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-f </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('G', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-g </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('H', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-h </v-icon>
            </v-btn>

            <v-btn
              @click="buscar('I', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-i </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('J', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-j </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('K', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-k </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('L', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-l </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('M', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-m </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('N', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-n </v-icon>
            </v-btn>
          </v-row>
          <v-row class="justify-center">
            <v-btn
              @click="buscar('O', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-o </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('P', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-p </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('Q', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-q </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('R', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-r </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('S', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-s </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('T', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-t </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('U', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-u </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('V', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-v </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('W', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-w </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('X', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-x </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('Y', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-y </v-icon>
            </v-btn>
            <v-btn
              @click="buscar('Z', 0)"
              class="mx-2"
              fab
              dark
              color="primary"
            >
              <v-icon dark large> mdi-alpha-z </v-icon>
            </v-btn>
          </v-row>
          <v-divider class="d-flex mt-4" color="#FF6F00"></v-divider>

          <v-row class="d-flex mt-3 mb-4 justify-center">
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Buscar por Cedula"
                outlined
                v-model="form.paciente"
                hide-details
                @keyup.enter="buscar_cedula()"
                clearable
                :error="error.identificacion"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start align-center" cols="12" sm="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="buscar_cedula()"
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
            </v-col>
            <v-col class="d-flex mb-4 justify-end">
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="get_excel()"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-divider class="d-flex mt-4" color="#FF6F00"></v-divider>
        <v-dialog v-model="dialog" persistent max-width="900px">
          <template v-slot:activator="{ on }">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              v-on="on"
              @click="opcionDialog('C', '')"
            >
              Agregar
              <v-icon right dark>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-form lazy-validation v-model="valid" ref="form">
            <v-card :style="styleObject">
              <v-card-title>
                <span class="headline">{{ form.text }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-select
                        :items="[
                          { text: 'Cedula Ciudadania', value: 'CC' },
                          { text: 'Tarjeta Identidad', value: 'TI' },
                          { text: 'Registro Civil', value: 'RC' },
                          { text: 'Permiso Esp.Permanencia', value: 'PE' },
                          { text: 'Cedula Extranjería', value: 'CE' },
                          { text: 'Adulto Sin Identificar', value: 'AS' },
                          { text: 'Menor Sin Identificar', value: 'MS' },
                          { text: 'Certificado Nacido Vivo', value: 'NV' },
                          { text: 'Pasaporte', value: 'PA' },
                          { text: 'Carnet Diplomatico', value: 'CD' },
                          { text: 'Salvo Conducto', value: 'SC' },
                          {
                            text: 'Permiso por Proteccion Temporal',
                            value: 'PT',
                          },
                        ]"
                        label="Tipo identificacion"
                        outlined
                        clearable
                        hide-details
                        return-object
                        v-model="form.tipoid"
                        :error="error.tipoid"
                        required
                        :rules="[(v) => !!v || 'Campo es obligatorio']"
                      ></v-select>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="Identificacion"
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.numero"
                        counter="15"
                        max
                        :rules="[
                          (v) => !!v || 'Campo obligatorio',
                          (v) => (v && v.length <= 15) || 'Maximo 15 digitos',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="1er apellido"
                        clearable
                        outlined
                        required
                        v-model="form.primerApellido"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="2do apellido"
                        clearable
                        outlined
                        v-model="form.segundoApellido"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="Primer Nombre"
                        clearable
                        outlined
                        required
                        v-model="form.nombres"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="Segundo Nombre"
                        clearable
                        outlined
                        required
                        v-model="form.nombres2"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="Telefono"
                        clearable
                        outlined
                        type="number"
                        v-model="form.telefono"
                        counter="10"
                        :rules="[
                          (v) => (v && v.length <= 10) || 'Maximo 15 digitos',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="Telefono 2"
                        clearable
                        outlined
                        type="number"
                        v-model="form.telefono2"
                        counter="10"
                        :rules="[
                          (v) => (v && v.length <= 10) || 'Maximo 15 digitos',
                        ]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field
                        label="Correo"
                        clearable
                        outlined
                        v-model="form.correo"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field
                        label="Direccion"
                        clearable
                        outlined
                        required
                        v-model="form.direccion"
                        :rules="[
                          (v) => (v && v.length <= 60) || 'Maximo 60 digitos',
                        ]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="3">
                      <v-autocomplete
                        label="Departamento"
                        v-model="form.departamento"
                        :items="departamentos"
                        item-value="value"
                        outlined
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
                    <v-col class="d-flex" cols="3">
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
                            label="Fecha de nacimiento"
                            append-icon="event"
                            outlined
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.nacimiento"
                          @input="pickerNacimiento = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col class="d-flex" cols="3">
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
                  <v-row> </v-row>
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
                    <v-col class="d-flex" cols="3">
                      <v-text-field
                        label="Edad"
                        disabled
                        outlined
                        type="text"
                        v-model="calcularEdad"
                      ></v-text-field>
                    </v-col>
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
                    <v-col class="d-flex" cols="3">
                      <v-text-field
                        label="Contrato"
                        clearable
                        outlined
                        required
                        v-model="form.contrato"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="Eps"
                        v-model="form.eps"
                        :items="eps"
                        item-value="value"
                        outlined
                        required
                        return-object
                        :rules="[(v) => !!v || 'Campo es obligatorio']"
                      ></v-autocomplete>
                    </v-col>

                    <v-col class="d-flex" cols="4">
                      <v-select
                        :items="[
                          { text: 'Contributivo', value: 8 },
                          { text: 'Subsidiado', value: 1 },
                          { text: 'Particular', value: 2 },
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
                        @change="select_regimen()"
                        required
                        :rules="[(v) => !!v || 'Campo es obligatorio']"
                      ></v-select>
                    </v-col>

                    <v-col class="d-flex" cols="3" v-if = "regimen_select == 1">
                      <v-select
                        :items="[
                          { text: 'Nivel 1', value: 1 },
                          { text: 'Nivel 2', value: 2 },
                          { text: 'Nivel 3', value: 3 },
                        ]"
                        label="Nivel Sisben"
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
                  <v-row>
                    <v-col class="d-flex" cols="3"  v-if = "regimen_select == 2">
                      <v-select
                        :items="[
                          { text: 'A', value:1 },
                          { text: 'B', value: 2 },
                          { text: 'C', value: 3 },
                        ]"
                        label="Categoria"
                        outlined
                        clearable
                        hide-details
                        return-object
                        v-model="form.categoria"
                        item-text="text"
                        item-value="value"
                        required
                        :rules="[(v) => !!v || 'Campo es obligatorio']"
                      ></v-select>
                    </v-col>

                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        label="Contraseña"
                        clearable
                        outlined
                        required
                        v-model="form.contraseña"
                        :rules="[
                          (v) => !!v || 'Campo obligatorio',
                          (v) => (v && v.length <= 15) || 'Maximo 10 digitos',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-select
                        :items="[
                          { text: 'Activo', value: 0 },
                          { text: 'InacActivo', value: 1 },
                        ]"
                        label="Estado"
                        outlined
                        clearable
                        hide-details
                        return-object
                        v-model="form.estado"
                        item-text="text"
                        item-value="value"
                        required
                        :rules="[(v) => !!v || 'Campo es obligatorio']"
                      ></v-select>
                    </v-col>

                    <v-col class="d-flex" cols="12" sm="3">
                      <v-menu
                        ref="menu"
                        v-model="dialogPicker"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        required
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="form.activacion"
                            label="Fecha de activacion"
                            append-icon="event"
                            outlined
                            disabled
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.activacion"
                          @input="dialogPicker = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-switch
                      v-model="form.eliminar"
                      label="Eliminar"
                    ></v-switch>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="ma-2" color="red" text @click="dialog = false"
                  >Cancelar</v-btn
                >
                <v-btn class="ma-2" color="success" text @click="guardar"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar en la lista"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="pacientes"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Correo</th>
                        <th>Direccion</th>
                        <th>Ciudad</th>
                        <th>Contraseña</th>
                        <th>Fecha_act</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.ciudad }}</td>
                        <td>{{ item.contrasena }}</td>
                        <td>{{ item.fechaAct }}</td>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="opcionDialog('U', item.identificacion)"
                  >edit</v-icon
                >
              </template>
              <template v-slot:item.identificacion="{ item }">
                {{ parseInt(item.identificacion) }}
              </template>
              <template v-slot:item.contrato="{ item }">
                {{ parseInt(item.contrato) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      styleObject: { border: "2px solid #01579B" },
      loader: false,
      dialog: false,
      valid: false,
      pickerNacimiento: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      inicial: "",
      regimen_select: 0,
      error: {
        identificacion: false,
        tipoid: false,
        tipoidbusq: false,
      },
      search: "",
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 20) || "Maximo 20 digitos",
      ],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+\..+/.test(v) || "E-mail no es valido",
        (v) => (v && v.length <= 60) || "Maximo 60 digitos",
      ],
      eps: [],
      pacientes: [],
      ciudades_dian: [],
      departamentos: [],
      form: [],
      headers: [
        { text: "", value: "data-table-expand" },
        {
          text: "Identificacion",
          align: "center",
          sortable: false,
          value: "identificacion",
        },
        { text: "1er Apellido", align: "center", value: "primerApellido" },
        { text: "2do Apellido", align: "center", value: "segundoApellido" },
        { text: "Nombres", align: "center", value: "nombres" },
        { text: "Telefono", align: "center", value: "telefono" },
        { text: "F.Nacimiento", align: "center", value: "nacimiento" },
        { text: "Edad", align: "center", value: "edad" },
        { text: "Contrato", align: "center", value: "contrato" },
        { text: "Categoria", align: "center", value: "categoria" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    // this.cargarPacientes();
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
        this.cargarEps();
      })
      .catch((err) => {
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar ciudades",
          estado: true,
        });
      });
  },
  computed: {
    filterMunicipios() {
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
      return registro;
    },
    calcularEdad() {
      let fecha_nac = this.$moment(this.form.nacimiento).format("YYYY-MM-DD");
      let hoy = this.$moment().format("YYYY-MM-DD");
      let dias = this.$moment().diff(fecha_nac, "days"),
        retornar = "";

      if (dias < 30) {
        retornar = dias + " - " + "dias";
      } else {
        if (dias < 365) {
          retornar = this.$moment().diff(fecha_nac, "months") + " - meses";
        } else {
          retornar = this.$moment().diff(fecha_nac, "years") + " - años";
        }
      }
      return retornar;
    },
  },
  methods: {
    alerta_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    select_regimen(){
      let reg = this.form.regimen.value;
      this.regimen_select = 0;
      if(reg == 1) {
        this.regimen_select = 1
      }
      if(reg == 8) {
        this.regimen_select = 2
      }

    },
    descripcionEstado(e) {
      return e == "0" ? "Desactivado" : "Activo";
    },
    get_excel() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/Clcfpaciente0124J.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let pacientes = JSON.parse(JSON.stringify(data));
          this.print_reporte_excel(pacientes);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true,
          });
        });
    },
    print_reporte_excel(pacientes) {
      var data_parse = pacientes;

      var columnas = [
        {
          title: "Tipo Documento",
          value: "tipoid_rep",
        },
        {
          title: "Nro Documento",
          value: "identificacion_rep",
          format: "string",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Segundo Nombre",
          value: "nombre2_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Telefono",
          value: "telefono_rep",
        },
        {
          title: "Telefono2",
          value: "telefono2_rep",
        },
        {
          title: "Correo",
          value: "correo_rep",
        },
        {
          title: "Dirección",
          value: "direccion_rep",
        },
        {
          title: "Ciudad",
          value: "ciudad_rep",
        },
        {
          title: "Fecha Nacimiento",
          value: "fechanac_rep",
          format: "fecha",
        },
        {
          title: "Estado Civil",
          value: "estadocivil_rep",
        },
        {
          title: "Regimen",
          value: "regimen_rep",
        },
        {
          title: "Eps",
          value: "eps_rep",
        },
        {
          title: "Género",
          value: "genero_rep",
        },
        {
          title: "Zona",
          value: "zona_rep",
        },
        {
          title: "Nivel",
          value: "nivel_rep",
        },
        {
          title: "Categoria",
          value: "categoria",
        },

        {
          title: "Usuario",
          value: "elaboro_rep",
        },
      ];
      var header_format = [
        { text: "CATALOGO DE PACIENTES", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Catalogo Pacientes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-Catalogo Pacientes-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
    buscar_cedula() {
      let paciente = this.form.paciente;
      if (!paciente) {
        this.error.paciente = true;
        this.alerta_error("Debe registrar una identificación");
      } else {
        this.buscar(" ", paciente);
      }
    },

    buscar(inicial, paciente) {
      this.inicial = inicial;
      this.loader = true;
      this.pacientes = [];

      post
        .postData({
          url: "Clinico/dlls/CfPaciente24J.dll",
          data: sessionStorage.Sesion + "|" + inicial + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.pacientes = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar paciente",
            estado: true,
          });
        });
    },
    opcionDialog(opc, key) {
      this.form = {
        text: "Agregar paciente",
        tipoid: null,
        numero: null,
        primerApellido: null,
        segundoApellido: null,
        nombres: null,
        correo: null,
        telefono: null,
        direccion: null,
        departamento: null,
        ciudad: null,
        nacimiento: this.$moment().format("YYYY-MM-DD"),
        estadoCivil: null,
        regimen: null,
        eps: null,
        genero: null,
        edad: null,
        zona: null,
        contraseña: null,
        activacion: this.$moment().format("YYYY-MM-DD"),
        estado: null,
        contrato: null,
        eliminar: false,
      };
      if (opc == "C") {
        this.dialog = true;
      } else {
        var item = this.pacientes.filter((e) => {
          if (e.identificacion == key) {
            return e;
          }
        });
        if (item.length) {
          item = item[0];
          this.form.text = "Modificar paciente";
          this.form.tipoid = { value: item.tipoid.trim() };
          this.form.numero = item.identificacion;
          this.form.primerApellido = item.primerApellido;
          this.form.segundoApellido = item.segundoApellido;
          this.form.nombres = item.nombres;
          this.form.nombres2 = item.nombre2;
          this.form.direccion = item.direccion;
          this.form.departamento = item.ciudad.substr(0, 2);
          this.form.ciudad = item.ciudad;
          let busq_select = this.eps.find((el) => el.value == item.eps);
          this.form.eps = busq_select;

          // this.form.eps = { value: item.eps };
          this.form.estadoCivil = { value: parseInt(item.estadoCivil) };
          this.form.regimen = { value: parseInt(item.regimen) };

          this.form.categoria = parseFloat(item.codcategoria);

          this.select_regimen();
          // this.form.eps = item.eps;
          this.form.genero = { value: parseInt(item.genero) };
          this.form.zona = { value: parseInt(item.zona) };
          this.form.nivel = { value: parseInt(item.nivel) };
          this.form.estado = { value: parseInt(item.estado) };

          this.form.telefono = item.telefono;
          this.form.telefono2 = item.telefono2;
          this.form.correo = item.correo.trim();
          this.form.contraseña = item.contrasena;
          this.form.contrato = parseFloat(item.contrato);
          this.form.nacimiento = this.$moment(item.nacimiento).format(
            "YYYY-MM-DD"
          );

          let fecha_act =
            this.$moment(item.fechaAct).format("YYYY-MM-DD") == "Invalid date"
              ? this.$moment().format("YYYY-MM-DD")
              : this.$moment(item.fechaAct).format("YYYY-MM-DD");

          this.form.activacion = fecha_act;
          this.form.estado = {
            text: item.estado == "0" ? "Desactivado" : "Activo",
            value: parseInt(item.estado),
          };
          this.dialog = true;
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Paciente no encontrado",
            estado: true,
          });
        }
      }
    },
    guardar() {
      if (!this.form.tipoid) {
        this.error.tipoid = true;
        this.$emit("snack", {
          color: "error",
          text: "Tipo Identificacion Obligatoria",
          estado: true,
        });
      } else {
        if (this.$refs.form.validate()) {
          let eliminar = this.form.eliminar ? 1 : 0,
            nacimiento = this.form.nacimiento.split("-");
          nacimiento = nacimiento[0] + nacimiento[1] + nacimiento[2];
          let apellido2 = this.form.segundoApellido
            ? this.form.segundoApellido
            : "";
            let categoria = this.form.categoria? this.form.categoria.value : ""
            let nivel = this.form.nivel? this.form.nivel.value : 0;

          var datos = {
            url: "Clinico/dlls/CfPaciente24.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              this.form.numero +
              "|" +
              this.form.nombres.trim() +
              "|" +
              this.form.primerApellido.trim() +
              "|" +
              apellido2 +
              "|" +
              this.form.tipoid.value +
              "|" +
              this.form.direccion.trim() +
              "|" +
              this.form.telefono +
              "|" +
              this.form.correo.trim() +
              "|" +
              this.form.ciudad +
              "|" +
              this.form.nacimiento.split("-").join("") +
              "|" +
              this.form.estadoCivil.value +
              "|" +
              this.form.regimen.value +
              "|" +
              this.form.eps.value +
              "|" +
              this.form.genero.value +
              "|" +
              this.form.zona.value +
              "|" +
              nivel +
              "|" +
              this.form.contraseña +
              "|" +
              this.form.estado.value +
              "|" +
              this.form.activacion.split("-").join("") +
              "|" +
              eliminar +
              "|" +
              this.form.nombres2.trim() +
              "|" +
              this.form.telefono2.trim() +
              "|" +
              this.form.contrato +
              "|" +
              categoria +
              "|",
            method: "",
          };
          post
            .postData(datos)
            .then((data) => {
              this.dialog = false;
              this.loader = false;
              this.$emit("snack", {
                color: "success",
                text: "Paciente modificado",
                estado: true,
              });
              let inicial = this.inicial;
              this.buscar(" ", this.form.numero, this.form.tipoid.value);
            })
            .catch((error) => {
              console.log(error);
              this.loader = false;

              this.$emit("snack", {
                color: "error",
                text: "Error al modificar paciente",
                estado: true,
              });
            });
        }
      }
    },
  },
};
</script>
