<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-ab-testing</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Tipo de Créditos</v-list-item-title
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
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="cargarcontenido()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.anterior" hide-details label="Clonar Año Anterior"></v-switch>
            </v-col> -->
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
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
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
          <v-tabs v-model="tab" centered slider-color="orange">
            <v-tab>Basico</v-tab>
            <v-tab>Tasas</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Año"
                      outlined
                      hide-details
                      v-model="form.anolinea"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="modalidad"
                      label="Modalidad"
                      hide-details
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.modalidad"
                      return-object
                      :error="errores.modalidad"
                      @input="errores.modalidad = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="linea"
                      label="Linea"
                      hide-details
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.linea"
                      return-object
                      :error="errores.linea"
                      @input="errores.linea = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="clasificacion"
                      label="Clasificación"
                      hide-details
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.clasificacion"
                      return-object
                      :error="errores.clasificacion"
                      @input="buscarNumero(), errores.clasificacion = false"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Codigo"
                      clearable
                      outlined
                      type="text"
                      required
                      disabled
                      counter="4"
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="7">
                    <v-text-field
                      label="Descripción"
                      clearable
                      outlined
                      required
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>

                <v-row class="ml-1 mr-1">
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Monto Máximo"
                      clearable
                      outlined
                      required
                      @input="input_mask('montomax')"
                      :value="formatNumero(form.montomax)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Plazo Máximo"
                      clearable
                      outlined
                      required
                      @input="input_mask('plazomax')"
                      :value="formatNumero(form.plazomax)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-switch
                      v-model="form.codeudor"
                      label="Requiere Codeudor"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-switch
                      v-model="form.rotativo"
                      label="Rotativo"
                    ></v-switch>
                  </v-col>

                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Vlr Estudio"
                      clearable
                      outlined
                      required
                      @input="input_mask('vlrestudio')"
                      :value="formatNumero(form.vlrestudio)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Papeleria"
                      clearable
                      outlined
                      required
                      @input="input_mask('vlrpapeleria')"
                      :value="formatNumero(form.vlrpapeleria)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="DataCrédito"
                      clearable
                      outlined
                      required
                      @input="input_mask('datacredito')"
                      :value="formatNumero(form.datacredito)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="% S.Vida Deudores"
                      clearable
                      outlined
                      required
                      @input="input_mask('porcseguro')"
                      :value="formatNumero(form.porcseguro)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="% Fianza"
                      clearable
                      outlined
                      required
                      @input="input_mask('vlrfianza')"
                      :value="formatNumero(form.vlrfianza)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch v-model="form.estado" label="Bloquear"></v-switch>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.eliminar"
                      label="Eliminar"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Enero: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte01')"
                      :value="formatNumero(form.intcte01)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora01')"
                      :value="formatNumero(form.intmora01)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Febrero: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte02')"
                      :value="formatNumero(form.intcte02)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora02')"
                      :value="formatNumero(form.intmora02)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Marzo: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte03')"
                      :value="formatNumero(form.intcte03)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora03')"
                      :value="formatNumero(form.intmora03)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Abril: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte04')"
                      :value="formatNumero(form.intcte04)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora04')"
                      :value="formatNumero(form.intmora04)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Mayo: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte05')"
                      :value="formatNumero(form.intcte05)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora05')"
                      :value="formatNumero(form.intmora05)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Junio: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte06')"
                      :value="formatNumero(form.intcte06)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora06')"
                      :value="formatNumero(form.intmora06)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Julio: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte07')"
                      :value="formatNumero(form.intcte07)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora07')"
                      :value="formatNumero(form.intmora07)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Agosto: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte08')"
                      :value="formatNumero(form.intcte08)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora08')"
                      :value="formatNumero(form.intmora08)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Septiembre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte09')"
                      :value="formatNumero(form.intcte09)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora09')"
                      :value="formatNumero(form.intmora09)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Octubre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte10')"
                      :value="formatNumero(form.intcte10)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora10')"
                      :value="formatNumero(form.intmora10)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Noviembre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte11')"
                      :value="formatNumero(form.intcte11)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora11')"
                      :value="formatNumero(form.intmora11)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <span class="subtitle-1">Diciembre: </span>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Corriente"
                      required
                      @input="input_mask('intcte12')"
                      :value="formatNumero(form.intcte12)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Mora"
                      required
                      @input="input_mask('intmora12')"
                      :value="formatNumero(form.intmora12)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
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
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
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
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      agencias: [],
      categorias: [],
      tab: 0,
      search: "",
      form: {
        anolinea: null,
        codigo: 0,
        periodo_cargue: null,
        montomax: 0,
        datacredito: 0,
      },
      modalidad: [{ text: "Consumo", value: "1" }],
      linea: [
        { text: "Crédito Personal", value: "1" },
        { text: "Crédito Libranza", value: "2" },
      ],

      clasificacion: [
        { text: "Ordinario", value: 1 },
        { text: "ExtraOrdinario", value: 2 },
        { text: "Convenio", value: 3 },
        { text: "Prima", value: 4 },
        { text: "Empleados Propios", value: 5 },
      ],
      tipoord: [
        { text: "Ordinario", value: "1" },
        { text: "Crédito Sobre Aportes", value: "2" },
        { text: "Compra de Cartera", value: "3" },
        { text: "Educativo", value: "4" },
      ],
      tipoextra: [
        { text: "Especial", value: "1" },
        { text: "Rotativo", value: "2" },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Año", align: "center", value: "ano_rep" },
        { text: "Codigo", align: "center", value: "codigo_rep" },
        { text: "Descripción", align: "left", value: "descripcion_rep" },

        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        anoselect: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargar_años();
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;

      this.form.periodo_cargue = anioActual;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.form.anolinea = item.ano_rep;

      let busqueda_modalidad = this.modalidad.find(
        (el) => el.value == parseInt(data.modalidad_rep)
      );
      this.form.modalidad = busqueda_modalidad;

      let busq_linea = this.linea.find(
        (el) => el.value == parseInt(data.linea_rep)
      );
      this.form.linea = busq_linea;

      let busq_clasifica = this.clasificacion.find(
        (el) => el.value == parseInt(data.clasifica_rep)
      );
      this.form.clasificacion = busq_clasifica;


      this.form.codigo = item.codigo_rep;
      this.form.codigo = item.codigo_rep;
      this.form.codigo = item.codigo_rep;

      this.form.descripcion = item.descripcion_rep;
      this.form.plazomax = item.maxmeses_rep;
      this.form.montomax = item.maxmonto_rep;
      this.form.vlrestudio = item.estudio_rep;
      this.form.vlrpapeleria = item.papeleria_rep;
      this.form.datacredito = item.datacredito_rep;
      this.form.porcseguro = item.seguro1_rep;

      this.form.intcte01 = item.tcte01_rep;
      this.form.intmora01 = item.tmora01_rep;
      this.form.intcte02 = item.tcte02_rep;
      this.form.intmora02 = item.tmora02_rep;
      this.form.intcte03 = item.tcte03_rep;
      this.form.intmora03 = item.tmora03_rep;
      this.form.intcte04 = item.tcte04_rep;
      this.form.intmora04 = item.tmora04_rep;
      this.form.intcte05 = item.tcte05_rep;
      this.form.intmora05 = item.tmora05_rep;
      this.form.intcte06 = item.tcte06_rep;
      this.form.intmora06 = item.tmora06_rep;
      this.form.intcte07 = item.tcte07_rep;
      this.form.intmora07 = item.tmora07_rep;
      this.form.intcte08 = item.tcte08_rep;
      this.form.intmora08 = item.tmora08_rep;
      this.form.intcte09 = item.tcte09_rep;
      this.form.intmora09 = item.tmora09_rep;
      this.form.intcte10 = item.tcte10_rep;
      this.form.intmora10 = item.tmora10_rep;
      this.form.intcte11 = item.tcte11_rep;
      this.form.intmora11 = item.tmora11_rep;
      this.form.intcte12 = item.tcte12_rep;
      this.form.intmora12 = item.tmora12_rep;

      this.form.codeudor = item.codeudor_rep == "1" ? true : false;
      this.form.rotativo = item.rotativo_rep == "1" ? true : false;
      this.form.estado = item.estado_rep == "1" ? true : false;
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      console.log(data);
      this.card_estado = true;
      let anolinea = data.anolinea;
      let codigo = data.codigo;
      let modalidad = data.modalidad.value;
      let linea = data.linea.value;
      let clasifica = data.clasificacion.value;

      let descripcion = data.descripcion;
      let montomax = data.montomax ? data.montomax.trim() : 0;
      let plazomax = data.plazomax ? data.plazomax.trim() : 0;
      let porcseguro = data.porcseguro ? data.porcseguro.trim() : 0;
      let vlrestudio = data.vlrestudio ? data.vlrestudio.trim() : 0;
      let vlrpapeleria = data.vlrpapeleria ? data.vlrpapeleria.trim() : 0;
      let datacredito = data.datacredito ? data.datacredito.trim() : 0;

      let intcte01 = data.intcte01 ? data.intcte01.trim() : 0;
      let intmora01 = data.intmora01 ? data.intmora01.trim() : 0;
      let intcte02 = data.intcte02 ? data.intcte02.trim() : 0;
      let intmora02 = data.intmora02 ? data.intmora02.trim() : 0;
      let intcte03 = data.intcte03 ? data.intcte03.trim() : 0;
      let intmora03 = data.intmora03 ? data.intmora03.trim() : 0;
      let intcte04 = data.intcte04 ? data.intcte04.trim() : 0;
      let intmora04 = data.intmora04 ? data.intmora04.trim() : 0;
      let intcte05 = data.intcte05 ? data.intcte05.trim() : 0;
      let intmora05 = data.intmora05 ? data.intmora05.trim() : 0;
      let intcte06 = data.intcte06 ? data.intcte06.trim() : 0;
      let intmora06 = data.intmora06 ? data.intmora06.trim() : 0;
      let intcte07 = data.intcte07 ? data.intcte07.trim() : 0;
      let intmora07 = data.intmora07 ? data.intmora07.trim() : 0;
      let intcte08 = data.intcte08 ? data.intcte08.trim() : 0;
      let intmora08 = data.intmora08 ? data.intmora08.trim() : 0;
      let intcte09 = data.intcte09 ? data.intcte09.trim() : 0;
      let intmora09 = data.intmora09 ? data.intmora09.trim() : 0;
      let intcte10 = data.intcte10 ? data.intcte10.trim() : 0;
      let intmora10 = data.intmora10 ? data.intmora10.trim() : 0;
      let intcte11 = data.intcte11 ? data.intcte11.trim() : 0;
      let intmora11 = data.intmora11 ? data.intmora11.trim() : 0;
      let intcte12 = data.intcte12 ? data.intcte12.trim() : 0;
      let intmora12 = data.intmora12 ? data.intmora12.trim() : 0;

      let codeudor = data.codeudor ? "1" : "0";
      let rotativo = data.rotativo ? "1" : "0";
      let estado = data.estado ? "1" : "0";
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Asociados/dlls/Cftipos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          anolinea +
          "|" +
          codigo +
          "|" +
          modalidad +
          "|" +
          linea +
          "|" +
          clasifica +
          "|" +
          descripcion +
          "|" +
          montomax +
          "|" +
          plazomax +
          "|" +
          porcseguro +
          "|" +
          vlrestudio +
          "|" +
          vlrpapeleria +
          "|" +
          datacredito +
          "|" +
          codeudor +
          "|" +
          intcte01 +
          "|" +
          intmora01 +
          "|" +
          intcte02 +
          "|" +
          intmora02 +
          "|" +
          intcte03 +
          "|" +
          intmora03 +
          "|" +
          intcte04 +
          "|" +
          intmora04 +
          "|" +
          intcte05 +
          "|" +
          intmora05 +
          "|" +
          intcte06 +
          "|" +
          intmora06 +
          "|" +
          intcte07 +
          "|" +
          intmora07 +
          "|" +
          intcte08 +
          "|" +
          intmora08 +
          "|" +
          intcte09 +
          "|" +
          intmora09 +
          "|" +
          intcte10 +
          "|" +
          intmora10 +
          "|" +
          intcte11 +
          "|" +
          intmora11 +
          "|" +
          intcte12 +
          "|" +
          intmora12 +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          rotativo +
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
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.form.anolinea = this.form.periodo_cargue;
      this.form.clasificacion = "";

      
    },
    init_form() {
      this.form.descripcion = "";
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
          url: "Asociados/dlls/CftiposJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tipo de Creditos",
            estado: true,
          });
        });
    },

    buscarNumero() {
      this.form.anolinea = this.form.periodo_cargue;
      let anolinea = this.form.periodo_cargue;
      let modalidad = this.form.modalidad.value;
      let linea = this.form.linea.value;
      let clasifica = this.form.clasificacion.value;

      post
        .postData({
          url: "Asociados/dlls/CfTiposN.dll",
          data: sessionStorage.Sesion + 
          "|" +
          anolinea +
          "|" +
          modalidad +
          "|" +
          linea +
          "|" +
          clasifica +
          "|",
          method: "",
        })
        .then((data) => {
          console.log(data[0].nro);
          this.form.codigo = data[0].nro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
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
