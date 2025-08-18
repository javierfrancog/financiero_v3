<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-pill-multiple</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Productos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar
                  <v-icon right dark class="ml-4">mdi-cart-plus</v-icon>
                </v-btn>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="get_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
              <!-- <v-btn
              class="ma-2 white--text"
              color="orange"
              depressed
              large
              @click="cargarMoleculas(), cargarNombrecom()"
              >Actualiza Agrpmolecula</v-btn
            > -->
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
              item-key="cod_rep"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Codigo</b>
                        </td>
                        <td>{{ item.cod_rep }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>

              <template v-slot:item.estado_rep="{ item }">
                {{ item.estado_rep === "1" ? "Inactivo" : "Activo" }}
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="get_item(item)">edit</v-icon>
              </template>

              <template v-slot:item.elimina="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
        <v-overlay :value="loader">
          <flower-spinner
            :animation-duration="2500"
            :size="100"
            color="#0d47a1"
          />
        </v-overlay>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogo.estado" persistent max-width="1300px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-row class="ml-2">
            <v-col class="d-flex" cols="5">
              <span class="title col-12">{{ dialogo.titulo }}</span>
            </v-col>
            <v-col class="d-flex align-left" cols="4">
              <v-btn
                class="ma-2"
                color="red"
                text
                @click="
                  dialogo.estado = false;
                  init_form();
                "
                >Cancelar</v-btn
              >
              <v-btn
                class="ma-2 px-4 white--text"
                color="indigo"
                depressed
                large
                @click="guardar()"
                >Guardar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider color="#FF6F00"></v-divider>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información Básica</v-tab>
            <v-tab>Información Contable</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      clearable
                      type="text"
                      required
                      disabled
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                      hide-details
                    >
                      <template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Consecutivo</span
                        >
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- <v-col class="d-flex" cols="10">
                    <v-autocomplete
                      :items="basejson"
                      clearable
                      hide-details
                      v-model="form.basejson"
                      :item-text="format_basejson"
                      :error="errores.basejson"
                      return-object
                      required
                      @change="asignar_nombre(1)"
                    >
                      <template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Descripción General</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col> -->
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      :items="moleculas"
                      clearable
                      hide-details
                      v-model="form.molecula"
                      :item-text="format_moleculas"
                      :error="errores.molecula"
                      @change="asignar_nombre(1)"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Molécula N2</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      :items="nombrecom"
                      clearable
                      hide-details
                      v-model="form.nombrecom"
                      :item-text="format_nombrecom"
                      :error="errores.nombrecom"
                      @change="asignar_nombre(2)"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Nombre Comercial</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      :items="formafarmac"
                      clearable
                      hide-details
                      v-model="form.formafarmac"
                      :item-text="format_formafarma"
                      :error="errores.formafarmac"
                      return-object
                      @change="asignar_nombre(3)"
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Forma Farmaceutica</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      :items="presentaciones"
                      clearable
                      hide-details
                      v-model="form.presentaciones"
                      :item-text="format_presentaciones"
                      :error="errores.presentaciones"
                      return-object
                      @change="asignar_nombre(4)"
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Presentación</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      :items="laboratorios"
                      clearable
                      hide-details
                      v-model="form.laboratorios"
                      @change="asignar_nombre(5)"
                      :item-text="format_laboratorios"
                      :error="errores.laboratorios"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Laboratorio</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      clearable
                      type="text"
                      required
                      v-model="form.cum"
                      :error="errores.cum"
                      @input="errores.cum = false"
                      hide-details
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important">C.U.M.</span>
                      </template></v-text-field
                    >
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-autocomplete
                      :items="expediente"
                      clearable
                      hide-details
                      v-model="form.expediente"
                      :item-text="format_expediente"
                      :error="errores.expediente"
                      return-object
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Nro Expediente</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>

                <v-row class="ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      disabled
                      required
                      clearable
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Descripción</span
                        >
                      </template></v-text-field
                    >
                  </v-col>
                </v-row>

                <v-row class="ml-2"> </v-row>
                <!-- <v-row class="ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      disabled
                      required
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Descripción</span
                        >
                      </template></v-text-field
                    >
                  </v-col>
                </v-row> -->
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      clearable
                      type="text"
                      required
                      v-model="form.invima"
                      :error="errores.invima"
                      @input="errores.invima = false"
                      hide-details
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important">Invima</span>
                      </template></v-text-field
                    >
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      clearable
                      type="text"
                      v-model="form.barras"
                      counter="15"
                      max
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Código Barras</span
                        >
                      </template></v-text-field
                    >
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      clearable
                      type="text"
                      required
                      v-model="form.codinterno"
                      hide-details
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Codigo Interno</span
                        >
                      </template></v-text-field
                    >
                  </v-col>
                </v-row>

                <v-divider class="mt-5" color="#FF6F00"></v-divider>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.tpmedicamento"
                      label="Medicamento"
                    ></v-switch>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.dispositivo"
                      label="Dispositivo Médico"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.regulado"
                      label="Prod.Regulado"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.controlado"
                      label="Controlado"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.frio"
                      label="Cadena de Frío"
                    ></v-switch>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.liquido"
                      label="Prod.Líquido"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch v-model="form.pyp" label="PyP"></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.altocto"
                      label="Alto Costo"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row class="ml-2">
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="genero"
                      label="Género"
                      outlined
                      clearable
                      return-object
                      hide-details
                      :error="errores.genero"
                      v-model="form.genero"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.ctavtas"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Cuenta Ventas</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.ctacosto"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Cuenta Costo</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      v-model="form.ctacompra"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                      return-object
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Cuenta Compras</span
                        >
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-select
                      :items="[
                        { text: 'Iva 19%', value: 19 },
                        { text: 'Iva 16%', value: 16 },
                        { text: 'Iva 5%', value: 5 },
                        { text: 'Iva Exento 0%', value: 0 },
                        { text: 'Iva Excluido', value: 99 },
                      ]"
                      outlined
                      clearable
                      hide-details
                      v-model="form.tariva"
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Tarifa Iva</span
                        >
                      </template></v-select
                    >
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-select
                      :items="[
                        { text: '0%', value: 0 },
                        { text: '8%', value: 8 },
                        { text: '16%', value: 16 },
                      ]"
                      outlined
                      clearable
                      hide-details
                      v-model="form.tarcons"
                      required
                      ><template v-slot:label>
                        <span style="color: #0033b3 !important"
                          >Impoconsumo</span
                        >
                      </template></v-select
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.bloquear" label="Bloquear"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogo_confirma.estado"
      persistent
      width="600"
      height="200"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"></v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          <v-row justify="center">
            <v-col class="d-flex justify-center" cols="12">
              <span class="title col-12">{{ dialogo_confirma.titulo }}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-row justify="center">
          <v-col class="d-flex justify-center" cols="6">
            <v-card-text class="text-h6"> Eliminar Medicamento?</v-card-text>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row justify="center">
            <v-col class="d-flex justify-center" cols="2">
              <v-btn
                color="red"
                variant="text"
                @click="dialogo_confirma.estado = false"
                class="white--text"
              >
                Cancelar
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center" cols="8">
              <v-btn
                color="green"
                variant="text"
                @click="get_eliminar()"
                class="white--text"
              >
                Aceptar
              </v-btn>
            </v-col>
          </v-row>
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
      dialogo_confirma: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      genero: [
        { text: "Femenino", value: 1 },
        { text: "Masculino", value: 2 },
        { text: "Otros", value: 3 },

        { text: "Todos", value: 9 },
      ],
      styleObject: { border: "2px solid #01579B" },
      dialog: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      data_excel:[],
      contenido: [],
      grpfarma: [],
      grpfarma_items: [],
      concentrac: [],
      ffarmac: [],
      basejson: [],
      expediente: [],
      moleculas: [],
      presentaciones: [],
      formafarmac: [],
      proceso: 0,
      laboratorios: [],
      nombrecom: [],
      datosctas: [],
      datosEmpresa: [],
      item_select: [],
      empaque: [
        { text: "Unidad", value: 1 },
        { text: "Caja", value: 2 },
        { text: "Blister", value: 13 },
      ],

      tab: 0,
      search: null,
      respuesta: 0,
      form: {
        consecutivo: null,
        molecula: null,
        descripcion: null,
        basevta: 0,
        cantempaque: null,
        cum: null,
      },
      headers: [
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },
        { text: "Cum", align: "center", value: "cum_rep" },
        {
          text: "Laboratorio",
          align: "center",
          value: "descriplaboratorio_rep",
        },
        { text: "Barras", align: "center", value: "barras_rep" },

        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Eliminar", value: "elimina", align: "center" },
        { text: "Codigo", align: "left", value: "cod_rep" },

      ],
      errores: {
        molecula: false,
        cum: false,
        presentaciones: false,
        nombrecom: false,
        descripcion: false,
        basejson: false,
        genero: false,
        expediente: false,

        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    // this.cargar_base();
    this.cargarMoleculas();
    this.cargarcontenido();
    this.cargarTablactas();

    this.cargarPresent();
    this.cargarformafarmac();
    this.cargarNombrecom();
    this.cargarLaborat();
    this.cargarExpediente();
  },
  computed: {},
  methods: {
    cargar_base() {
      this.loader = true;
      let ciudad = this.datosEmpresa.codciudad_empr;
      let id = this.datosEmpresa.id_empr;
      let ruta = "Datos/Base/MEDICAMENTOS.JSON";
      post
        .postData({
          url: ruta,
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.loader = false;
          var data_parse = data;
          this.basejson = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar productos",
            estado: true,
          });
        });
    },
    anular_item(item) {
      this.item_select = item;
      this.dialogo_confirma.estado = true;
      this.dialogo_confirma.titulo = item.descripcion_rep.trim();
    },
    get_eliminar() {
      let codigo = this.item_select.cod_rep.trim();
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentosX.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let msg = data[0];
          this.$emit("snack", {
            color: "success",
            text: msg,
            estado: true,
          });
          this.dialogo.estado = false;
          this.dialogo_confirma.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.dialogo.estado = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al Eliminar AgrpMoleculas",
            estado: true,
          });
          this.loader = false;
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
    cargarMoleculas() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.moleculas = JSON.parse(JSON.stringify(data));
          this.loader = false;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Moleculas",
            estado: true,
          });
          this.loader = false;
        });
    },
    cargarformafarmac() {
      post
        .postData({
          url: "Dispensa/dlls/CfformafarmacJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.formafarmac = JSON.parse(JSON.stringify(data));
          this.formafarmac.unshift({
            cod_rep: "00000",
            descrip_rep: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Forma Farmaceutica",
            estado: true,
          });
        });
    },
    cargarPresent() {
      post
        .postData({
          url: "Dispensa/dlls/CfPresentmedicJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.presentaciones = JSON.parse(JSON.stringify(data));
          this.presentaciones.unshift({
            cod_rep: "0000",
            descrip_rep: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Presentaciones",
            estado: true,
          });
        });
    },
    cargarLaborat() {
      post
        .postData({
          url: "Dispensa/dlls/CfLaboratorioJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.laboratorios = JSON.parse(JSON.stringify(data));
          this.laboratorios.unshift({
            cod_rep: "0000",
            descrip_rep: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Laboratorios",
            estado: true,
          });
        });
    },
    cargarExpediente() {
      post
        .postData({
          url: "Dispensa/dlls/CfExpedienteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.expediente = JSON.parse(JSON.stringify(data));
          this.expediente.unshift({
            cod_rep: "0000",
            descrip_rep: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Laboratorios",
            estado: true,
          });
        });
    },
    cargarNombrecom() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfNombcomercJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.nombrecom = JSON.parse(JSON.stringify(data));
          this.nombrecom.unshift({
            cod_rep: "0000",
            descrip_rep: "No Aplica",
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Nombre comercial",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      this.form.eliminar = false;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentoLtJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    get_item(item) {
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentos01J.dll",
          data: sessionStorage.Sesion + "|" + item.cod_rep + "|",
          method: "",
        })
        .then((data) => {
          this.editar_item(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al validar Cum",
            estado: true,
          });
        });
    },
    editar_item(item) {
      this.proceso = 1
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";

      this.form.codigo = parseFloat(item.cod_rep);
      let busqueda_molecula = this.moleculas.find(
        (el) => el.codigo_rep == item.molecula_rep
      );
      this.form.molecula = busqueda_molecula;
      this.form.descripcion = item.descripcion_rep.trim();

      let busqueda_select = this.nombrecom.find(
        (el) => el.cod_rep == item.codcomerc_rep
      );
      this.form.nombrecom = busqueda_select;

      busqueda_select = this.formafarmac.find(
        (el) => el.cod_rep == item.formafarma_rep
      );
      this.form.formafarmac = busqueda_select;

      busqueda_select = this.presentaciones.find(
        (el) => el.cod_rep == item.prcomerc_rep
      );
      this.form.presentaciones = busqueda_select;

      busqueda_select = this.expediente.find(
        (el) => parseFloat(el.cod_rep) == parseFloat(item.expediente_rep)
      );
      this.form.expediente = busqueda_select;

      this.form.barras = item.barras_rep.trim();

      let busqueda_laboratorios = this.laboratorios.find(
        (el) => el.cod_rep == item.laborat_rep
      );
      this.form.laboratorios = busqueda_laboratorios;

      this.form.cum = item.cum_rep.trim() || 0;
      this.form.invima = item.invima_rep.trim() || 0;
      this.form.codinterno = item.cod_externo_rep.trim() || "";

      this.form.tariva = parseInt(item.tiva_rep);
      this.form.tarcons = parseInt(item.tcons_rep);
      this.form.ctavtas = item.ctavtas_rep;
      this.form.ctacosto = item.ctactos_rep;
      this.form.ctacompra = item.ctacompras_rep;
      this.form.bloquear = item.estado_rep == "1" ? true : false;

      let busqueda_vta = this.datosctas.find(
        (el) => el.cod_puc == item.ctavtas_rep
      );
      this.form.ctavtas = busqueda_vta;

      let busqueda_costo = this.datosctas.find(
        (el) => el.cod_puc == item.ctactos_rep
      );
      this.form.ctacosto = busqueda_costo;

      let busqueda_compras = this.datosctas.find(
        (el) => el.cod_puc == item.ctacompras_rep
      );
      this.form.ctacompra = busqueda_compras;

      this.form.tpmedicamento = item.tpmedicam_rep == "1" ? true : false;
      this.form.dispositivo = item.disposit_rep == "1" ? true : false;
      this.form.regulado = item.regulado_rep == "1" ? true : false;
      this.form.controlado = item.controlado_rep == "1" ? true : false;
      this.form.frio = item.frio_rep == "1" ? true : false;
      this.form.liquido = item.liquido_rep == "1" ? true : false;
      this.form.pyp = item.pyp_rep == "1" ? true : false;
      this.form.altocto = item.altocto_rep == "1" ? true : false;

      let busqueda_genero = this.genero.find(
        (el) => el.value == item.genero_rep
      );
      this.form.genero = busqueda_genero;
    },
    async guardar() {
      var data_envio = JSON.parse(JSON.stringify(this.form));

      if (!data_envio.molecula) {
        this.errores.molecula = true;
        this.send_error("Error en molecula!");
      } else if (!data_envio.nombrecom) {
        this.errores.nombrecom = true;
        this.send_error("Error en Nombre Comercial!");
      } else if (!data_envio.presentaciones) {
        this.errores.presentaciones = true;
        this.send_error("Error en Presentacion!");
      } else if (!data_envio.laboratorios) {
        this.errores.laboratorios = true;
        this.send_error("Error en Laboratorio!");
      } else if (!data_envio.cum) {
        this.errores.cum = true;
        this.send_error("Error en Cum!");
      } else if (!data_envio.expediente) {
        this.errores.expediente = true;
        this.send_error("Error en Expediente!");
      } else if (!data_envio.genero) {
        this.errores.genero = true;
        this.send_error("Debe seleccionar un género!");
      } else {
        this.respuesta = 0;
        let molecula_val = data_envio.molecula.codigo_rep;
        let codcom_val = data_envio.nombrecom
          ? data_envio.nombrecom.cod_rep
          : "0";
        let cum_val = data_envio.cum ? data_envio.cum : "";
        let exp_val = parseFloat(data_envio.expediente.cod_rep);
        let codigo = parseFloat(data_envio.codigo);
        if (cum_val) {
          post
            .postData({
              url: "Dispensa/dlls/ValcumJ.DLL",
              data:
                sessionStorage.Sesion +
                "|" +
                molecula_val +
                "|" +
                codcom_val +
                "|" +
                cum_val +
                "|" +
                exp_val +
                "|" +
                codigo +
                "|",
              method: "",
            })
            .then((data) => {
              this.respuesta = parseFloat(data[0].msg);

              if (this.respuesta == 1) {
                let texto = data[0].texto.trim();
                this.$emit("snack", {
                  color: "error",
                  text: "Cum ya Registrado!! " + texto,
                  estado: true,
                });
              } else {
                this.format_envio(data_envio);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$emit("snack", {
                color: "error",
                text: "Error al validar Cum",
                estado: true,
              });
            });
        }
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let consec = data.codigo;
      let molecula = data.molecula.codigo_rep;
      let codcom = data.nombrecom ? data.nombrecom.cod_rep : "0";

      let laboratorio = data.laboratorios ? data.laboratorios.cod_rep : "0";
      let formafarmac = data.formafarmac ? data.formafarmac.cod_rep : "0";

      let cum = data.cum ? data.cum : "";
      let expediente = parseFloat(data.expediente.cod_rep);
      let barras = data.barras ? data.barras.trim() : "";
      let invima = data.invima ? data.invima.trim() : "";
      let codinterno = data.codinterno;
      let descripcion = data.descripcion.trim();

      let presentacion = data.presentaciones
        ? data.presentaciones.cod_rep
        : "0";
      let ctavtas = data.ctavtas ? data.ctavtas.cod_puc : "9999999999";
      let ctacosto = data.ctacosto ? data.ctacosto.cod_puc : "9999999999";
      let ctacompra = data.ctacompra ? data.ctacompra.cod_puc : "9999999999";
      let tariva = data.tariva || "0";
      let tarcons = data.tarcons || "0";
      let bloquear = data.bloquear ? "1" : "0";
      let eliminar = data.eliminar ? "1" : "0";

      let altocto = data.altocto ? "1" : "0";
      let frio = data.frio ? "1" : "0";
      let dispositivo = data.dispositivo ? "1" : "0";
      let controlado = data.controlado ? "1" : "0";
      let liquido = data.liquido ? "1" : "0";
      let pyp = data.pyp ? "1" : "0";
      let regulado = data.regulado ? "1" : "0";
      let tpmedicamento = data.tpmedicamento ? "1" : "0";
      let genero = data.genero.value;
      let proceso = this.proceso;

      let datos = {
        url: "Dispensa/dlls/CfMedicamentos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consec +
          "|" +
          molecula +
          "|" +
          codcom +
          "|" +
          cum +
          "|" +
          expediente +
          "|" +
          descripcion +
          "|" +
          presentacion +
          "|" +
          barras +
          "|" +
          laboratorio +
          "|" +
          invima +
          "|" +
          ctavtas +
          "|" +
          ctacosto +
          "|" +
          ctacompra +
          "|" +
          tariva +
          "|" +
          tarcons +
          "|" +
          altocto +
          "|" +
          frio +
          "|" +
          dispositivo +
          "|" +
          controlado +
          "|" +
          liquido +
          "|" +
          pyp +
          "|" +
          regulado +
          "|" +
          tpmedicamento +
          "|" +
          genero +
          "|" +
          codinterno +
          "|" +
          bloquear +
          "|" +
          eliminar +
          "|" +
          formafarmac +
          "|" +
          proceso +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          let msg = data[0];
          this.$emit("snack", {
            color: "success",
            text: msg,
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    agregar_item() {
      this.proceso = 0;
      this.init_form();
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentosN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.estado = 0;
          this.form.activacion = this.$moment().format("YYYY-MM-DD");
          this.dialogo.titulo = "Agregar nuevo Registro";
          this.dialogo.estado = true;
          this.dialogo.tipo = 0;
          this.form.codigo = parseFloat(data[0].msg);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Numeración",
            estado: true,
          });
        });
    },
    init_form() {
      this.form.molecula = "";
      this.form.descripcion = "";
      this.form.barras = "";
      this.form.grpfarma = "";
      this.form.concentrac = "";
      this.form.ffarmac = "";
      this.form.presentaciones = "";
      this.form.nombrecom = "";
      this.form.laboratorios = "";
      this.form.cum = "";
      this.form.invima = "";
      this.form.expediente = "";
      this.form.basejson = null;
      this.form.genero = null;
      this.form.basevta = "0";
      this.form.codinterno = null;
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_basejson(val) {
      return `${val.descripcion_invima}`;
    },
    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    format_formafarma(val) {
      return `${val.descrip_rep}`;
    },
    format_presentaciones(val) {
      return `${val.descrip_rep}`;
    },
    format_nombrecom(val) {
      return `${val.descrip_rep}`;
    },
    format_laboratorios(val) {
      return `${val.descrip_rep}`;
    },
    format_expediente(val) {
      return `${val.descrip_rep.trim()}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    asignar_nombre(tipo) {
      if (tipo == 1) {
        this.form.descripcion = "";
      }
      let descripcion = this.form.descripcion.trim();
      let nombre_comercial = this.form.nombrecom
        ? this.form.nombrecom.descrip_rep.trim()
        : "";
      let forma_farmac = this.form.formafarmac
        ? this.form.formafarmac.descrip_rep.trim()
        : "";
      let presentaciones = this.form.presentaciones
        ? this.form.presentaciones.descrip_rep.trim()
        : "";
      let laboratorios = this.form.laboratorios
        ? this.form.laboratorios.descrip_rep.trim()
        : "";

      if (this.form.nombrecom) {
        if (this.form.nombrecom.cod_rep == "0000") {
          nombre_comercial = "";
        }
      }

      if (this.form.formafarmac) {
        if (this.form.formafarmac.cod_rep == "00000") {
          forma_farmac = "";
        }
      }

      if (this.form.presentaciones) {
        if (this.form.presentaciones.cod_rep == "0000") {
          presentaciones = "";
        }
      }

      if (this.form.laboratorios) {
        if (this.form.laboratorios.cod_rep == "0000") {
          laboratorios = "";
        }
      }

      if (tipo == 1) {
        if (descripcion == "") {
          descripcion = this.form.molecula.descripcion_rep.trim();
        } else {
          descripcion =
            descripcion + "+" + this.form.molecula.descrip_rep.trim();
        }
      }
      if (tipo == 2) {
        descripcion =
          this.form.molecula.descripcion_rep.trim() + " " + nombre_comercial;
        this.form.presentaciones = "";
        this.form.formafarmac = "";
        this.form.laboratorios = "";
      }
      if (tipo == 3) {
        descripcion =
          this.form.molecula.descripcion_rep.trim() +
          " " +
          nombre_comercial +
          " " +
          forma_farmac.trim();
        this.form.presentaciones = "";
        this.form.laboratorios = "";
      }
      if (tipo == 4) {
        descripcion =
          this.form.molecula.descripcion_rep.trim() +
          " " +
          nombre_comercial +
          " " +
          forma_farmac.trim() +
          " " +
          presentaciones.trim();
        this.form.laboratorios = "";
      }

      if (tipo == 5) {
        descripcion =
          this.form.molecula.descripcion_rep.trim() +
          " " +
          nombre_comercial +
          " " +
          forma_farmac.trim() +
          " " +
          presentaciones.trim() +
          " " +
          laboratorios.trim();
      }
      this.form.descripcion = descripcion;
    },
    choseColor() {
      return this.counter % 2 !== 0 ? `blue` : "white";
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    get_reporte_excel() {
      this.form.eliminar = false;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.usuario_rep = el.usuario_rep.trim();
              el.index = index;
            }
            return el;
          });

          this.data_excel = data_parse;
          this.print_reporte_excel();
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.data_excel;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        if (copia.tpmedicam_rep == 1) {
          copia.tpmedicam_rep = "S";
        } else {
          copia.tpmedicam_rep = "N";
        }
        if (copia.disposit_rep == 1) {
          copia.disposit_rep = "S";
        } else {
          copia.disposit_rep = "N";
        }
        if (copia.regulado_rep == 1) {
          copia.regulado_rep = "S";
        } else {
          copia.regulado_rep = "N";
        }
        if (copia.controlado_rep == 1) {
          copia.controlado_rep = "S";
        } else {
          copia.controlado_rep = "N";
        }
        if (copia.frio_rep == 1) {
          copia.frio_rep = "S";
        } else {
          copia.frio_rep = "N";
        }
        if (copia.liquido_rep == 1) {
          copia.liquido_rep = "S";
        } else {
          copia.liquido_rep = "N";
        }
        if (copia.pyp_rep == 1) {
          copia.pyp_rep = "S";
        } else {
          copia.pyp_rep = "N";
        }
        if (copia.altocto_rep == 1) {
          copia.altocto_rep = "S";
        } else {
          copia.altocto_rep = "N";
        }
        if (copia.genero_rep == 1) {
          copia.genero_rep = "F";
        } else {
          copia.genero_rep = "M";
        }

        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Codigo",
          value: "cod_rep",
          format: "string",
        },
        {
          title: "Nombre",
          value: "descripcion_rep",
          format: "string",
        },
        {
          title: "Descripcion Agrp molecula",
          value: "descmolecula_rep",
          format: "string",
        },

        {
          title: "Cum",
          value: "cum_rep",
          format: "string",
        },
        {
          title: "Barras",
          value: "barras_rep",
          format: "string",
        },
        {
          title: "Invima",
          value: "invima_rep",
          format: "string",
        },
        {
          title: "Laboratorio",
          value: "descriplaboratorio_rep",
          format: "string",
        },
        {
          title: "nombre Comercial",
          value: "descripcomercial_rep",
          format: "string",
        },
        {
          title: "Medicamento",
          value: "tpmedicam_rep",
          format: "string",
        },
        {
          title: "Dispositivo Medico",
          value: "disposit_rep",
          format: "string",
        },
        {
          title: "Producto Regulado",
          value: "regulado_rep",
          format: "string",
        },
        {
          title: "Producto controlado",
          value: "controlado_rep",
          format: "string",
        },
        {
          title: "Cadena Frio",
          value: "frio_rep",
          format: "string",
        },
        {
          title: "Producto Liquido",
          value: "liquido_rep",
          format: "string",
        },

        {
          title: "P Y P",
          value: "pyp_rep",
          format: "string",
        },
        {
          title: "Alto Costo",
          value: "altocto_rep",
          format: "string",
        },
        {
          title: "Genero",
          value: "genero_rep",
          format: "string",
        },
        {
          title: "Tar.Iva",
          value: "tiva_rep",
          format: "string",
        },
        {
          title: "Cod.Interno",
          value: "codinterno_rep",
          format: "string",
        },

        {
          title: "Usuario",
          value: "usuario_rep",
          format: "string",
        },
        {
          title: "Fecha Creacion",
          value: "fcrea_rep",
          format: "string",
        },

      ];
      var header_format = [
        { text: "REPORTE MEDICAMENTOS", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Medicamentos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE MEDICAMENTOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
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
