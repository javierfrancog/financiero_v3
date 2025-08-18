<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-key-wireless</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Resoluciones Dian</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Doc_Inventario</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.tipoper_resd }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Prefijo</v-tab>
            <v-tab>Facturación</v-tab>
            <v-tab>Documento Soporte</v-tab>
            <v-tab>Nómina Electronica</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex pb-0" cols="6" sm="8">
                    <v-autocomplete
                      label="Agencia Resolución"
                      v-model="form.punto"
                      :items="puntos"
                      :item-text="format_punto"
                      item-value="codigo_agc"
                      outlined
                      hide-details
                      :error="errores.sede"
                      @change="errores.sede = false"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="2" sm="2">
                    <v-text-field
                      label="Prefijo"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.prefijo"
                      :error="errores.prefijo"
                      @input="errores.prefijo = false"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- facturacion -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex pb-0" cols="6" sm="8">
                    <v-autocomplete
                      label="Documento Inventario"
                      v-model="form.docinvent"
                      :items="documentos"
                      :item-text="format_docc"
                      item-value="docinv_resd"
                      outlined
                      clearable
                      hide-details
                      return-object
                      :error="errores.docc"
                      @change="errores.docc = false"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="3" sm="3">
                    <v-text-field
                      label="Doc.Inventario"
                      clearable
                      disabled
                      hide-details
                      type="text"
                      v-model="form.docinv"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1">
                  <v-col class="d-flex pb-0" cols="6" sm="4">
                    <v-text-field
                      label="Numero Resolución"
                      clearable
                      outlined
                      type="text"
                      counter="4"
                      v-model="form.nrores"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="8" sm="4">
                    <v-menu
                      ref="menu"
                      v-model="dialogPicker"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechares"
                          label="Fecha Inicio Resolución:"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechares"
                        @input="dialogPicker = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="8" sm="4">
                    <v-menu
                      ref="menu"
                      v-model="dialogPickerfin"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechafinres"
                          label="Fecha Final Resolución:"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechafinres"
                        @input="dialogPickerfin = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row class="ml-1">
                  <v-col class="d-flex pb-0" cols="4" sm="4">
                    <v-text-field
                      label="Numero Inicial"
                      clearable
                      outlined
                      type="text"
                      v-model="form.nroini"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="4" sm="4">
                    <v-text-field
                      label="Numero Final"
                      clearable
                      outlined
                      type="text"
                      v-model="form.nrofin"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="4" sm="3">
                    <v-text-field
                      label="Vigencia"
                      clearable
                      outlined
                      type="text"
                      v-model="form.vigencia"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="ml-1">
                  <v-col class="d-flex pb-0" cols="12" sm="12">
                    <v-text-field
                      label="Llave Tecnica"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.llavefact"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="ml-1">
                  <v-col cols="12" sm="4">
                    <v-switch
                      v-model="form.felectronica"
                      label="Factura Electrónica"
                      hide-details
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-switch
                      v-model="form.pos"
                      label="Impresion Pos"
                      hide-details
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-switch
                      v-model="form.poselect"
                      label="Pos Electrónico"
                      hide-details
                    ></v-switch>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-switch
                      v-model="form.copagos"
                      label="Facturacion Copagos"
                      hide-details
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row class="ml-1">
                  <v-btn
                    class="ma-2 white--text"
                    color="purple"
                    depressed
                    large
                    @click="get_dian(1)"
                    >Consultar Resoluciones Asociadas Dian</v-btn
                  >
                  <v-btn
                    class="ma-2 white--text"
                    color="indigo"
                    depressed
                    large
                    @click="reg_dian_fact()"
                    >Guardar Resolución-Factura-</v-btn
                  >
                  <v-row justify="center">
                    <v-col class="d-flex pb-0" cols="12">
                      <v-data-table
                        v-if="contenido_dian_fact.length != 0"
                        :headers="header_dian_fact"
                        :items="contenido_dian_fact"
                        :single-expand="singleExpand"
                      >
                        <template v-slot:item.edit="{ item }">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="success"
                                fab
                                class="mr-1"
                                icon
                                v-on="on"
                                outlined
                                small
                                @click="cargar_res_fact(item)"
                              >
                                <v-icon>mdi-tooltip-check</v-icon>
                              </v-btn>
                            </template>
                            <span>Cargar Resolución</span>
                          </v-tooltip>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-row>
              </v-card>
            </v-tab-item>
            <!-- dsp -->
            <v-tab-item>
              <!-- documento soporte-->
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex pb-0" cols="6" sm="4">
                    <v-text-field
                      label="Numero Resolución"
                      clearable
                      outlined
                      type="text"
                      counter="4"
                      v-model="form.nroresdoc"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="8" sm="4">
                    <v-menu
                      ref="menu"
                      v-model="dialogPickerdoc"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecharesdoc"
                          label="Fecha Resolución:"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecharesdoc"
                        @input="dialogPickerdoc = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="8" sm="4">
                    <v-menu
                      ref="menu"
                      v-model="dialogPickerfindoc"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechafinresdoc"
                          label="Fecha Final Resolución:"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechafinresdoc"
                        @input="dialogPickerfindoc = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row class="ml-1">
                  <v-col class="d-flex pb-0" cols="4" sm="4">
                    <v-text-field
                      label="Numero Inicial"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.nroinidoc"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="4" sm="4">
                    <v-text-field
                      label="Numero Final"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.nrofindoc"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="4" sm="3">
                    <v-text-field
                      label="Vigencia"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.vigenciadoc"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1">
                  <v-col class="d-flex pb-0" cols="12" sm="12">
                    <v-text-field
                      label="Llave Tecnica"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.llavedoc"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- <v-btn
                  class="ma-2 white--text"
                  color="purple"
                  depressed
                  large
                  @click="get_dian(2)"
                  >Consultar Resoluciones Asociadas Dian</v-btn
                > -->
                <v-btn
                  class="ma-2 white--text"
                  color="indigo"
                  depressed
                  large
                  @click="reg_dian_dsp()"
                  >Guardar Resolución</v-btn
                >

                <v-row justify="center">
                  <v-col class="d-flex pb-0" cols="12">
                    <v-data-table
                      v-if="contenido_dian_dsp.length != 0"
                      :headers="header_dian_fact"
                      :items="contenido_dian_dsp"
                      :single-expand="singleExpand"
                    >
                      <template v-slot:item.edit="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              color="success"
                              fab
                              class="mr-1"
                              icon
                              v-on="on"
                              outlined
                              small
                              @click="cargar_res_dsp(item)"
                            >
                              <v-icon>mdi-tooltip-check</v-icon>
                            </v-btn>
                          </template>
                          <span>Cargar Resolución</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col class="d-flex pb-0" cols="12">
                    <v-data-table
                      v-if="contenido_dian_dsp.length != 0"
                      :headers="header_dian_dsp"
                      :items="contenido_dian_dsp"
                      :single-expand="singleExpand"
                    >
                      <template v-slot:item.edit="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              color="success"
                              fab
                              class="mr-1"
                              icon
                              v-on="on"
                              outlined
                              small
                              @click="cargar_res(item)"
                            >
                              <v-icon>mdi-tooltip-check</v-icon>
                            </v-btn>
                          </template>
                          <span>Cargar Resolución</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <!-- Nomina Electronica-->
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex pb-0" cols="6" sm="4">
                    <v-text-field
                      label="Numero Resolución"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.nroresnom"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="8" sm="4">
                    <v-menu
                      ref="menu"
                      v-model="dialogPickernom"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecharesnom"
                          label="Fecha Resolución:"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecharesnom"
                        @input="dialogPickernom = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row class="ml-1">
                  <v-col class="d-flex pb-0" cols="4" sm="4">
                    <v-text-field
                      label="Numero Inicial"
                      clearable
                      outlined
                      type="text"
                      v-model="form.nroininom"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="4" sm="4">
                    <v-text-field
                      label="Numero Final"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.nrofinnom"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex pb-0" cols="4" sm="3">
                    <v-text-field
                      label="Vigencia"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.vigencianom"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- <v-btn
                  class="ma-2 white--text"
                  color="purple"
                  depressed
                  large
                  @click="get_dian(3)"
                  >Consultar Resoluciones Asociadas Dian</v-btn
                > -->
                <v-btn
                  class="ma-2 white--text"
                  color="indigo"
                  depressed
                  large
                  @click="reg_dian_nom()"
                  >Guardar Resolución</v-btn
                >

                <v-row justify="center">
                  <v-col class="d-flex pb-0" cols="12">
                    <v-data-table
                      v-if="contenido_dian_nom.length != 0"
                      :headers="header_dian_nom"
                      :items="contenido_dian_nom"
                      :single-expand="singleExpand"
                    >
                      <template v-slot:item.edit="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              color="success"
                              fab
                              class="mr-1"
                              icon
                              v-on="on"
                              outlined
                              small
                              @click="cargar_res_nom(item)"
                            >
                              <v-icon>mdi-tooltip-check</v-icon>
                            </v-btn>
                          </template>
                          <span>Cargar Resolución</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>
          <v-row>
            <v-col class="d-flex pb-0" cols="4">
              <v-switch
                v-model="form.eliminar"
                label="Eliminar"
                hide-details
              ></v-switch>
            </v-col>
            <v-col class="d-flex pb-0" cols="4">
              <v-switch
                v-model="form.bloquear"
                label="Bloquear"
                hide-details
              ></v-switch>
            </v-col>
            <v-col class="d-flex pb-0" cols="4">
              <v-switch
                v-model="form.movim"
                label="Bloquear Registro"
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 white--text"
            color="red"
            depressed
            large
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <!-- <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          > -->
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      tab: 0,
      meses: 0,

      dialogPicker: false,
      dialogPickerfin: false,
      dialogPickerfindoc: false,
      dialogPickerdoc: false,
      dialogPickernom: false,

      singleExpand: true,
      expanded: [],
      contenido: [],
      contenido_dian_fact: [],
      contenido_dian_dsp: [],
      contenido_dian_nom: [],
      puntos: [],
      documentos: [],
      json_id: [],
      search: "",
      form: {
        nrores: null,
        fechares: null,
        fechafinres: null,
        nroini: null,
        nrofin: null,
        llavefact: null,
      },

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Prefijo", align: "center", value: "prefijo_resd" },
        { text: "Cod.Punto", align: "center", value: "sede_resd" },
        {
          text: "Punto Facturación",
          align: "left",
          value: "descripcion_resd",
        },
        { text: "Resolución Factura", align: "center", value: "nrores_resd" },
        {
          text: "Resolución Doc.Soporte",
          align: "center",
          value: "nroresdoc_resd",
        },
        { text: "Resolución Nómina", align: "center", value: "nroresnom_resd" },

        { text: "Estado", align: "center", value: "estado_resd" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      header_dian_fact: [
        { text: "Opciones", value: "edit", align: "center" },
        {
          text: "Número Resolucion",
          align: "center",
          value: "ResolutionNumber",
        },
        { text: "Prefijo", align: "center", value: "Prefix" },
        { text: "Inicio Resolucion", align: "center", value: "ValidDateFrom" },
        { text: "Fin Resolucion", align: "center", value: "ValidDateTo" },
        { text: "Número Inicial", align: "center", value: "FromNumber" },
        { text: "Número Final", align: "center", value: "ToNumber" },
        { text: "Llave Tecnica", align: "center", value: "TechnicalKey" },
      ],
      header_dian_dsp: [
        { text: "Opciones", value: "edit", align: "center" },
        {
          text: "Número Resolucion",
          align: "center",
          value: "ResolutionNumber",
        },
        { text: "Prefijo", align: "center", value: "Prefix" },
        { text: "Inicio Resolucion", align: "center", value: "ValidDateFrom" },
        { text: "Fin Resolucion", align: "center", value: "ValidDateTo" },
        { text: "Número Inicial", align: "center", value: "FromNumber" },
        { text: "Número Final", align: "center", value: "ToNumber" },
        { text: "Llave Tecnica", align: "center", value: "TechnicalKey" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
    this.buscarpuntos();
    this.buscardocumentos();
  },
  computed: {},
  methods: {
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    async get_dian(tipo_doc) {
      let token = this.datosEmpresa.tokentitan_empr.trim();
      let id_Software = "";

      if (tipo_doc == 1) {
        id_Software = this.datosEmpresa.iddian_empr.trim();
      } else if (tipo_doc == 2) {
        id_Software = this.datosEmpresa.iddiandsp_empr.trim();
      } else {
        id_Software = this.datosEmpresa.iddianomina_empr.trim();
      }

      this.json_id.unshift({
        IDSoftware: id_Software,
      });
      var formData = new FormData();
      formData.append("token", token);
      formData.append("idSoftware", JSON.stringify(this.json_id[0]));

      const response = await fetch(
        "https://server1ts.net/financiero/inc/api_dian/get_resdian.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      let texto_respuesta = "";
      let cod_respuesta =
        response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
          .GetNumberingRangeResult.OperationCode;
      texto_respuesta =
        response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
          .GetNumberingRangeResult.OperationDescription;
      if (cod_respuesta == 401) {
        this.$emit("snack", {
          color: "error",
          text: texto_respuesta,
          estado: true,
        });
      } else {
        let respuesta =
          response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
            .GetNumberingRangeResult.ResponseList.NumberRangeResponse;

        if (respuesta.FromNumber) {
          respuesta =
            response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
              .GetNumberingRangeResult.ResponseList;
        } else {
          respuesta =
            response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
              .GetNumberingRangeResult.ResponseList.NumberRangeResponse;
        }
        let clone = structuredClone(respuesta);

        this.contenido_dian_fact = [];
        let contenidodian = Array.isArray(clone)
          ? clone
          : [clone.NumberRangeResponse];

        if (tipo_doc == 1) {
          this.contenido_dian_fact = contenidodian;
        } else if (tipo_doc == 2) {
          this.contenido_dian_dsp = contenidodian;
        }
        if (tipo_doc == 3) {
          this.contenido_dian_nom = contenidodian;
        }
      }
    },
    async reg1_dian(tipo_doc) {
      let token = this.datosEmpresa.tokentitan_empr.trim();
      let id_Software = "";

      if (tipo_doc == 1) {
        id_Software = this.datosEmpresa.iddian_empr.trim();
      } else if (tipo_doc == 2) {
        id_Software = this.datosEmpresa.iddiandsp_empr.trim();
      } else {
        id_Software = this.datosEmpresa.iddianomina_empr.trim();
      }

      this.json_id.unshift({
        IDSoftware: id_Software,
      });
      var formData = new FormData();
      formData.append("token", token);
      formData.append("idSoftware", JSON.stringify(this.json_id[0]));

      const response = await fetch(
        "https://server1ts.net/financiero/inc/api_dian/get_resdian.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      let texto_respuesta = "";
      let cod_respuesta =
        response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
          .GetNumberingRangeResult.OperationCode;
      texto_respuesta =
        response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
          .GetNumberingRangeResult.OperationDescription;
      if (cod_respuesta == 401) {
        this.$emit("snack", {
          color: "error",
          text: texto_respuesta,
          estado: true,
        });
      } else {
        let respuesta =
          response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
            .GetNumberingRangeResult.ResponseList.NumberRangeResponse;

        if (respuesta.FromNumber) {
          respuesta =
            response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
              .GetNumberingRangeResult.ResponseList;
        } else {
          respuesta =
            response.ResponseDian.Envelope.Body.GetNumberingRangeResponse
              .GetNumberingRangeResult.ResponseList.NumberRangeResponse;
        }
        let clone = structuredClone(respuesta);

        this.contenido_dian_fact = [];
        let contenidodian = Array.isArray(clone)
          ? clone
          : [clone.NumberRangeResponse];

        if (tipo_doc == 1) {
          this.contenido_dian_fact = contenidodian;
        } else if (tipo_doc == 2) {
          this.contenido_dian_dsp = contenidodian;
        }
        if (tipo_doc == 3) {
          this.contenido_dian_nom = contenidodian;
        }
      }
    },
    cargar_res_fact(item) {
      this.form.nrores = item.ResolutionNumber.trim();
      this.form.fechares = item.ValidDateFrom.trim();
      this.form.fechafinres = item.ValidDateTo.trim();
      this.form.nroini = item.FromNumber.trim();
      this.form.nrofin = item.ToNumber.trim();
      this.form.llavefact = item.TechnicalKey.trim();
      this.calcularMeses(this.form.fechares, this.form.fechafinres);
      this.form.vigencia = this.meses;
    },
    cargar_res_dsp(item) {
      this.form.nroresdoc = item.ResolutionNumber.trim();
      this.form.fecharesdoc = item.ValidDateFrom.trim();
      this.form.fechafinresdoc = item.ValidDateTo.trim();
      this.form.nroinidoc = item.FromNumber.trim();
      this.form.nrofindoc = item.ToNumber.trim();
      this.form.llavedoc = item.TechnicalKey.trim();
      this.calcularMeses(this.form.fecharesdoc, this.form.fechafinresdoc);
      this.form.vigenciadoc = this.meses;
    },
    calcularMeses(fechaInicio, fechaFin) {
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);

      const mesesDiferencia =
        (fechaFinObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 +
        (fechaFinObj.getMonth() - fechaInicioObj.getMonth());
      this.meses = mesesDiferencia;

      return mesesDiferencia;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      var docinvent = this.documentos.find(
        (el) => el.llave_tpoper == item.tipoper_resd
      );
      this.form.docinvent = docinvent;
      this.form.docinv = item.tipoper_resd;
      this.dialogo.estado = item.estado_resd;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.prefijo = item.prefijo_resd;
      this.form.punto = item.sede_resd;
      this.form.nrores = item.nrores_resd;
      this.form.fechares = item.fecha_resd;
      this.form.fechafinres = item.fechafin_resd;
      this.form.llavefact = item.llavetecnica_resd.trim();

      this.form.nroini = parseFloat(item.nroini_resd);
      this.form.nrofin = parseFloat(item.nrofin_resd);
      this.form.vigencia = parseFloat(item.vigencia_resd);
      this.form.nroresdoc = item.nroresdoc_resd;
      this.form.fecharesdoc = item.fechadoc_resd;
      this.form.nroinidoc = parseFloat(item.nroinidoc_resd);
      this.form.nrofindoc = parseFloat(item.nrofindoc_resd);
      this.form.vigenciadoc = parseFloat(item.vigenciadoc_resd);
      this.form.fechafinresdoc = item.fechafindoc_resd;
      this.form.llavedoc = item.llavetecnicadoc_resd.trim();

      this.form.nroresnom = item.nroresnom_resd;
      this.form.fecharesnom = item.fechanom_resd;
      this.form.nroininom = parseFloat(item.nroininom_resd);
      this.form.nrofinnom = parseFloat(item.nrofinnom_resd);
      this.form.vigencianom = parseFloat(item.vigencianom_resd);

      this.form.pos = item.pos_resd == "1" ? true : false;
      this.form.bloquear = item.estado_resd == "1" ? true : false;
      this.form.movim = item.movim_resd == "1" ? true : false;
      this.form.felectronica = item.felectr_resd == "1" ? true : false;
      this.form.poselect = item.poselect_resd == "1" ? true : false;
      this.form.copagos = item.copago_resd == "1" ? true : false;
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.prefijo) {
        this.errores.prefijo = true;
        this.send_error("Prefijo Obligatorio!");
      } else if (!data.punto) {
        this.errores.sede = true;
        this.send_error("Punto Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var punto = data.punto;
      var prefijo = data.prefijo.trim();
      var docinv = data.docinvent ? data.docinvent.llave_tpoper : "0";
      var nrores = data.nrores ? data.nrores.trim() : "0";
      var fecha = data.fechares ? data.fechares.replace(/-/g, "") : "0";
      var fechafinres = data.fechafinres
        ? data.fechafinres.replace(/-/g, "")
        : "0";
      var llavefact = data.llavefact || null;

      var nroini = data.nroini ? data.nroini.trim() : "0";
      var nrofin = data.nrofin ? data.nrofin.trim() : "0";
      var vigencia = data.vigencia ? data.vigencia : "0";
      var nroresdoc = data.nroresdoc ? data.nroresdoc.trim() : "0";

      var fechadoc = data.fecharesdoc
        ? data.fecharesdoc.replace(/-/g, "")
        : "0";
      var nroinidoc = data.nroinidoc ? data.nroinidoc : "0";
      var nrofindoc = data.nrofindoc ? data.nrofindoc : "0";
      var vigenciadoc = data.vigenciadoc ? data.vigenciadoc : "0";
      var fechafinresdoc = data.fechafinresdoc
        ? data.fechafinresdoc.replace(/-/g, "")
        : "0";
      var llavedoc = data.llavedoc ? data.llavedoc.trim() : "0";

      var nroresnom = data.nroresnom ? data.nroresnom.trim() : "0";
      var fechanom = data.fecharesnom
        ? data.fecharesnom.replace(/-/g, "")
        : "0";
      var nroininom = data.nroininom ? data.nroininom : "0";
      var nrofinnom = data.nrofinnom ? data.nrofinnom : "0";
      var vigencianom = data.vigencianom ? data.vigencianom : "0";
      var felectronica = data.felectronica ? "1" : "0";
      var pos = data.pos ? "1" : "0";

      var estado = data.bloquear ? "1" : "0";
      var movim = data.movim ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      this.contenido_dian_fact = [];
      this.contenido_dian_dsp = [];
      this.contenido_dian_nom = [];

      let datos = {
        url: "Financiero/dlls/CfResdian.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          punto +
          "|" +
          prefijo +
          "|" +
          docinv +
          "|" +
          fecha +
          "|" +
          nrores +
          "|" +
          nroini +
          "|" +
          nrofin +
          "|" +
          vigencia +
          "|" +
          fechadoc +
          "|" +
          nroresdoc +
          "|" +
          nroinidoc +
          "|" +
          nrofindoc +
          "|" +
          vigenciadoc +
          "|" +
          fechanom +
          "|" +
          nroresnom +
          "|" +
          nroininom +
          "|" +
          nrofinnom +
          "|" +
          vigencianom +
          "|" +
          felectronica +
          "|" +
          pos +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          fechafinres +
          "|" +
          llavefact +
          "|" +
          fechafinresdoc +
          "|" +
          llavedoc +
          "|" +
          movim +
          "|" +
          poselect +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          console.log("Error grabando rut: ", error);
          this.send_error("Error al grabar Registro");
        });
    },
    async reg_dian_fact() {
      this.card_estado = true;
      var agencia = this.form.punto;
      var prefijo = this.form.prefijo.trim();
      var docinv = this.form.docinvent ? this.form.docinvent.llave_tpoper : "0";
      var nrores = this.form.nrores ? this.form.nrores.trim() : "0";
      var fechainires = this.form.fechares
        ? this.form.fechares.replace(/-/g, "")
        : "0";
      var fechafinres = this.form.fechafinres
        ? this.form.fechafinres.replace(/-/g, "")
        : "0";
      var llavefact = this.form.llavefact || null;
      var poselect = this.form.poselect ? "1" : "0";
      var nroini = this.form.nroini ? this.form.nroini : "0";
      var nrofin = this.form.nrofin ? this.form.nrofin : "0";
      var vigencia = this.form.vigencia ? this.form.vigencia : "0";
      var nroresdoc = this.form.nroresdoc ? this.form.nroresdoc.trim() : "0";
      var felectronica = this.form.felectronica ? "1" : "0";
      var pos = this.form.pos ? "1" : "0";
      var estado = this.form.bloquear ? "1" : "0";
      this.contenido_dian_fact = [];
      var eliminar = this.form.eliminar ? "1" : "0";
      var copagos = this.form.copagos ? "1" : "0";


      let datos = {
        url: "Financiero/dlls/CfResdian01.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          prefijo +
          "|" +
          docinv +
          "|" +
          fechainires +
          "|" +
          fechafinres +
          "|" +
          nrores +
          "|" +
          nroini +
          "|" +
          nrofin +
          "|" +
          vigencia +
          "|" +
          felectronica +
          "|" +
          pos +
          "|" +
          estado +
          "|" +
          llavefact +
          "|" +
          "1" +
          "|" +
          eliminar +
          "|" +
          poselect +
          "|" +
          copagos +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          fechainires = this.form.fechares;
          fechafinres = this.form.fechafinres;
          let tipofact = 0;
          let tiponc = 0;
          let tipond = 0;

          if (poselect == 0) {
            tipofact = 1;
            tiponc = 4;
            tipond = 5;
          } else {
            tipofact = 15;
            tiponc = 26;
            tipond = 25;
          }

          this.grabar_dian(
            tipofact,
            prefijo,
            nrores,
            fechainires,
            fechafinres,
            llavefact,
            nroini,
            nrofin
          );
          this.grabar_dian(
            tiponc,
            "NC",
            nrores,
            fechainires,
            fechafinres,
            llavefact,
            1,
            999999999
          );
          this.grabar_dian(
            tipond,
            "ND",
            nrores,
            fechainires,
            fechafinres,
            llavefact,
            1,
            999999999
          );

          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          console.log(error);
          this.send_error("Error al grabar Registro");
        });
    },
    async reg_dian_dsp() {
      this.card_estado = true;
      var agencia = this.form.punto;
      var prefijo = this.form.prefijo.trim();
      var docinv = "0";
      var nrores = this.form.nroresdoc ? this.form.nroresdoc.trim() : "0";
      var fechainires = this.form.fecharesdoc
        ? this.form.fecharesdoc.replace(/-/g, "")
        : "0";
      var fechafinres = this.form.fechafinresdoc
        ? this.form.fechafinresdoc.replace(/-/g, "")
        : "0";
      var llavefact = this.form.llavedsp || null;

      var nroini = this.form.nroinidoc ? this.form.nroinidoc : "0";
      var nrofin = this.form.nrofindoc ? this.form.nrofindoc : "0";
      var vigencia = this.form.vigenciadoc ? this.form.vigenciadoc : "0";
      var nroresdoc = this.form.nroresdoc ? this.form.nroresdoc.trim() : "0";
      var felectronica = "0";
      var pos = "0";
      var estado = this.form.bloquear ? "1" : "0";
      this.contenido_dian_dsp = [];
      var eliminar = this.form.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/CfResdian01.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          prefijo +
          "|" +
          docinv +
          "|" +
          fechainires +
          "|" +
          fechafinres +
          "|" +
          nrores +
          "|" +
          nroini +
          "|" +
          nrofin +
          "|" +
          vigencia +
          "|" +
          felectronica +
          "|" +
          pos +
          "|" +
          estado +
          "|" +
          llavefact +
          "|" +
          "2" +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          fechainires = this.form.fecharesdoc;
          fechafinres = this.form.fechafinresdoc;

          this.grabar_dian(
            11,
            prefijo,
            nrores,
            fechainires,
            fechafinres,
            llavefact,
            nroini,
            nrofin
          );
          this.grabar_dian(
            13,
            prefijo,
            nrores,
            fechainires,
            fechafinres,
            llavefact,
            nroini,
            nrofin
          );
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          console.log(error);
          this.send_error("Error al grabar Registro");
        });
    },
    async reg_dian_nom() {
      this.card_estado = true;
      var prefijo = "NI";
      var agencia = this.form.punto;
      var eliminar = this.form.eliminar ? "1" : "0";
      if (eliminar == 1) {
        prefijo = this.form.prefijo;
      }

      var docinv = "0";
      var nrores = "18764048667100";
      var fechainires = "20190101";
      var fechafinres = "20300101";
      var llavefact = null;

      var nroini = 1;
      var nrofin = 99999999;
      var vigencia = 12;
      var felectronica = "0";
      var pos = "0";
      var estado = this.form.bloquear ? "1" : "0";
      this.contenido_dian_dsp = [];

      let datos = {
        url: "Financiero/dlls/CfResdian01.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          prefijo +
          "|" +
          docinv +
          "|" +
          fechainires +
          "|" +
          fechafinres +
          "|" +
          nrores +
          "|" +
          nroini +
          "|" +
          nrofin +
          "|" +
          vigencia +
          "|" +
          felectronica +
          "|" +
          pos +
          "|" +
          estado +
          "|" +
          llavefact +
          "|" +
          "3" +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          fechainires = this.form.fecharesnom;
          fechafinres = this.form.fechafinresnom;
          if (eliminar == 0) {
            this.grabar_dian_nom9(prefijo, nroini, nrofin);
            this.grabar_dian_nom10(prefijo, nroini, nrofin);
          }
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          console.log(error);
          this.send_error("Error al grabar Registro");
        });
    },
    async grabar_dian(
      tipo_doc,
      prefijo,
      nrores,
      fechainires,
      fechafinres,
      llavefact,
      nroini,
      nrofin
    ) {
      let tokendian = this.datosEmpresa.tokentitan_empr;
      let fecha = this.$moment().format();

      let json = {
        type_document_id: tipo_doc,
        prefix: prefijo,
        resolution: nrores,
        technical_key: llavefact,
        resolution_date: fechainires,
        from: nroini,
        to: nrofin,
        generated_to_date: fecha,
        date_from: fechainires,
        date_to: fechafinres,
      };
      const json_put = JSON.stringify(json);

      let data = new FormData();
      data.append("token", tokendian);
      data.append("json", json_put);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_dian/put_resdian.php",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) =>
          res.json().catch((err) => {
            this.loader = false;
          })
        )
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al registrar Resolución");
        });
    },
    async grabar_dian_nc(
      tipo_doc,
      prefijo,
      nrores,
      fechainires,
      fechafinres,
      llavefact,
      nroini,
      nrofin
    ) {
      let tokendian = this.datosEmpresa.tokentitan_empr;
      let fecha = this.$moment().format();
      tipo_doc = 4;
      prefijo = "NC";
      nroini = 1;
      nrofin = 999999999;

      let json = {
        id: "",
        token: tokendian,
        type_document_id: tipo_doc,
        prefix: prefijo,
        n_resolution: nrores,
        resolution_date: fechainires,
        technical_key: "",
        from: nroini,
        to: nrofin,
        date_from: fechainires,
        date_to: fechafinres,
        created_at: fecha,
        updated_at: fecha,
      };

      var formData = new FormData();
      formData.append("json", JSON.stringify(json));

      fetch("https://server1ts.net//financiero/inc/api_dian/reg_restitan.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            this.$emit("snack", {
              color: "error",
              text: "Error al actualizar Info_Dian",
              estado: true,
            });
          } else {
            this.form.token = result.token;
            this.$emit("snack", {
              color: "green",
              text: "Guardado correctamente",
              estado: true,
            });
            this.guardar();
          }
        });
    },
    async grabar_dian_nom9(prefijo, nroini, nrofin) {
      let token_dian = this.datosEmpresa.tokentitan_empr;
      let fecha = this.$moment().format();
      let json = {
        type_document_id: 9,
        prefix: prefijo,
        from: nroini,
        to: nrofin,
      };

      var formData = new FormData();
      const json_put = JSON.stringify(json);
      formData.append("token", token_dian);
      formData.append("json", json_put);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_dian/put_resdian.php",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            this.$emit("snack", {
              color: "error",
              text: "Error al actualizar Info_Dian",
              estado: true,
            });
          } else {
            this.form.token = result.token;
            this.guardar();
            this.$emit("snack", {
              color: "green",
              text: "Guardado correctamente",
              estado: true,
            });
          }
        });
    },
    async grabar_dian_nom10(prefijo, nroini, nrofin) {
      let token_dian = this.datosEmpresa.tokentitan_empr;
      let fecha = this.$moment().format();
      let json = {
        type_document_id: 10,
        prefix: prefijo,
        from: nroini,
        to: nrofin,
      };

      var formData = new FormData();
      const json_put = JSON.stringify(json);
      formData.append("token", token_dian);
      formData.append("json", json_put);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_dian/put_resdian.php",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            this.$emit("snack", {
              color: "error",
              text: "Error al actualizar Info_Dian",
              estado: true,
            });
          } else {
            this.form.token = result.token;
            this.$emit("snack", {
              color: "green",
              text: "Guardado correctamente",
              estado: true,
            });
          }
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfResdianj.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Resoluciones",
            estado: true,
          });
        });
    },

    buscarpuntos() {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.puntos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Puntos de Facturacion",
            estado: true,
          });
        });
    },

    buscardocumentos() {
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.documentos = data;
          // this.documentos.map(el => {
          //   el.docconta = el.llave_tpoper ;
          //   return el;
          // });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Puntos de Documentos",
            estado: true,
          });
        });
    },

    cargar_res(item) {
      this.form.nrores = item.ResolutionNumber;
      this.form.fechares = item.ValidDateFrom;
      this.form.fechafinres = item.ValidDateTo;
      this.form.nroini = item.FromNumber;
      this.form.nrofin = item.ToNumber;
      this.form.llavefact = item.TechnicalKey;
    },

    format_punto(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    format_docc(val) {
      return `${val.llave_tpoper} - ${val.descrip_tpoper}`;
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
