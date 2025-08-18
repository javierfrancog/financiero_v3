<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-currency-cny</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Cuentas Contables</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
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
              <v-col class="d-flex justify-left">
                <v-switch
                  v-model="form.auxiliar"
                  label="Mostrar Solo Auxiliares"
                  @change="cargarcontenido()"
                ></v-switch>
              </v-col>

              <v-col class="d-flex justify-end">
                <v-btn
                  depressed
                  color="red"
                  class="white--text mr-3"
                  @click="imprimir_pdf"
                  >Imprimir PDF</v-btn
                >
                <v-btn
                  depressed
                  color="green darken-2"
                  class="white--text"
                  @click="imprimir_excel"
                >
                  Imprimir EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
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
                  hide-details2
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-col cols="6" class="d-flex justify-center">
            <span class="title col-12">{{ dialogo.titulo }}</span>
          </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-btn
              class="ma-2 white--text"
              color="red"
              depressed
              large
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
        </v-card-title>
        <v-divider color="succes"></v-divider>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Tributario</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex mt-3">
                  <v-col class="d-flex" cols="8" sm="3">
                    <v-select
                      :items="[
                        { text: 'Auxiliar', value: 4 },
                        { text: 'División', value: 3 },
                        { text: 'Subcuenta', value: 2 },
                        { text: 'Mayor', value: 1 },
                      ]"
                      label="Tipo Cuenta"
                      v-model="form.tipocod"
                      outlined
                      required
                      hide-details
                      :error="errores.tipocod"
                      @change="
                        errores.tipocod = false;
                        cambioCuenta();
                      "
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Codigo"
                      clearable
                      outlined
                      type="text"
                      required
                      counter="10"
                      max
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="datosniif"
                      label="Clasificación Niif"
                      v-model="form.niif"
                      :item-text="format_niif"
                      item-value="cod_niif"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex mb-3">
                  <v-col class="d-flex" cols="6F" sm="6">
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
                  <v-col class="d-flex" cols="5" v-if="show_select">
                    <v-autocomplete
                      :items="datospresup"
                      label="Rubro Presupuestal"
                      v-model="form.presup"
                      :item-text="format_presup"
                      item-value="cod_rep"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card>
                <v-row class="mt-2">
                  <v-col class="d-flex" cols="12" sm="4" v-if="show_select">
                    <v-text-field
                      label="Base Mínima Retención"
                      clearable
                      outlined
                      v-model="form.baserte"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2" v-if="show_select">
                    <v-text-field
                      label="% Retención"
                      clearable
                      outlined
                      type="text"
                      v-model="form.porcrte"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="id_Municipio Ica"
                      v-model="form.municipio"
                      :items="ruts"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="datosfrte"
                      label="Renglon Formulario 350 Retención"
                      v-model="form.frtefte"
                      :item-text="format_frtefte"
                      item-value="renglon_rte"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="datosfiva"
                      label="Renglon Formulario 300 Iva"
                      v-model="form.friva"
                      :item-text="format_iva"
                      item-value="renglon_iva"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="6" v-if="show_select">
                    <v-autocomplete
                      :items="datosrenta"
                      label="Renglon Formulario 110 Renta"
                      v-model="form.frrenta"
                      :item-text="format_frrenta"
                      item-value="renglon_rte"
                      hide-details
                      clearable
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6" v-if="show_select">
                    <v-autocomplete
                      :items="datosrenta"
                      label="Renglon Formulario 110 Renta"
                      v-model="form.frrenta2"
                      :item-text="format_frrenta"
                      item-value="renglon_rte"
                      hide-details
                      clearable
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="6" v-if="show_select">
                    <v-autocomplete
                      :items="datosrenta"
                      label="Renglon Formulario 110 Renta"
                      v-model="form.frrenta3"
                      :item-text="format_frrenta"
                      item-value="renglon_rte"
                      hide-details
                      clearable
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-divider color="#FF6F00"></v-divider>

                <v-row>
                  <!-- <v-toolbar
    dark
    color="teal"
  >                   -->

                  <v-col class="text-center font-weight-bold">
                    Exogena Formato 1
                  </v-col>
                  <!-- </v-toolbar>                                -->
                  <v-col class="text-center font-weight-bold">
                    Exogena Formato 2
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="formatos"
                      label="Formato Exógena"
                      v-model="form.format_exogena"
                      hide-details
                      return-object
                      outlined
                      @change="filtrar_conceptos"
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="formatos"
                      label="Formato Exógena"
                      v-model="form.format_exogena2"
                      hide-details
                      return-object
                      outlined
                      clearable
                      @change="filtrar_conceptos2"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="conceptosdian_filtro"
                      label="Concepto Exógena"
                      v-model="form.concepto_exogena"
                      :item-text="format_conceptos"
                      item-value="concepto_rep"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="conceptosdian2_filtro"
                      label="Concepto Exógena"
                      v-model="form.concepto_exogena2"
                      :item-text="format_conceptos"
                      item-value="concepto_rep"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="tiporeg"
                      label="Tipo Reporte"
                      v-model="form.tiporeg"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="tiporeg"
                      label="Tipo Reporte"
                      v-model="form.tiporeg2"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="ruts"
                      :item-text="format_ruts"
                      label="Rut a Reportar"
                      v-model="form.rutrep"
                      clearable
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="ruts"
                      :item-text="format_ruts"
                      label="Rut a Reportar"
                      v-model="form.rutrep2"
                      clearable
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-col class="text-center font-weight-bold">
                  Exogena Formato 3
                </v-col>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="formatos"
                      label="Formato Exógena"
                      v-model="form.format_exogena3"
                      hide-details
                      return-object
                      outlined
                      @change="filtrar_conceptos3"
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="conceptosdian3_filtro"
                      label="Concepto Exógena"
                      v-model="form.concepto_exogena3"
                      :item-text="format_conceptos"
                      item-value="concepto_rep"
                      hide-details
                      return-object
                      outlined
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="tiporeg"
                      label="Tipo Reporte"
                      v-model="form.tiporeg3"
                      hide-details
                      return-object
                      outlined
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" v-if="show_select">
                    <v-autocomplete
                      :items="ruts"
                      :item-text="format_ruts"
                      label="Rut a Reportar"
                      v-model="form.rutrep3"
                      clearable
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row>
            <v-col class="d-flex" cols="12" sm="3" v-if="show_select">
              <v-switch
                v-model="form.ctacart"
                label="Cuenta Cartera"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3" v-if="show_select">
              <v-switch
                v-model="form.ctrdoc"
                label="Control x Documento"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      datosniif: [],
      datosfrte: [],
      datosrenta: [],
      datosfiva: [],
      datospresup: [],
      ruts: [],
      conceptosdian: [],
      conceptosdian2: [],
      conceptosdian3_filtro: [],

      auxiliar: 0,
      tab: 0,
      formatos: [
        {
          text: "No Aplica-",
          value: 9999,
        },

        {
          text: "Formato 1001 -Pagos/Abonos en cuenta y Retenciones Practicadas-",
          value: 1001,
        },
        {
          text: "Formato 1003 -Retenciones en la fuente que le practicaron-",
          value: 1003,
        },
        {
          text: "Formato 1004 -Descuentos Tributarios Solicitados-",
          value: 1004,
        },
        {
          text: "Formato 1005 -Impuesto a las Ventas Descontable-",
          value: 1005,
        },
        { text: "Formato 1006 -Impuesto a las Ventas Generado", value: 1006 },
        { text: "Formato 1007 -Ingresos Recibidos-", value: 1007 },
        { text: "Formato 1008 -Saldo Cuentas por cobrar-", value: 1008 },
        { text: "Formato 1009 -Saldo Cuentas por Pagar-", value: 1009 },
        {
          text: "Formato 1010 -Información de Socios/Accionistas-",
          value: 1010,
        },
        {
          text: "Formato 1011 -Información de las Declaraciones Tributarias-",
          value: 1011,
        },
        {
          text: "Formato 1012 -Información Declaraciones Tributarias, Aportes e inversiones en bonos-",
          value: 1012,
        },
        // {
        //   text: "Formato 1037 -Información Facturas de Venta o Documentos Equivalentes-",
        //   value: 1037,
        // },

        {
          text: "Formato 2275 -Ingresos No constitutivos de Renta-",
          value: 2275,
        },
        {
          text: "Formato 2276 -Información Rentas de trabajo y Pensiones-",
          value: 2276,
        },
        {
          text: "Formato 5247 -Consorcios Pagos/Abonos en cuenta y Retenciones Practicadas-",
          value: 5247,
        },
        { text: "Formato 5248 -Consorcios Ingresos Recibidos-", value: 5248 },
        {
          text: "Formato 5249 -Consorcios Impuesto a las Ventas Descontable-",
          value: 5249,
        },
        {
          text: "Formato 5250 -Consorcios Impuesto a las Ventas Generado",
          value: 5250,
        },
        {
          text: "Formato 5251 -Consorcios Saldo Cuentas por cobrar-",
          value: 5251,
        },
        {
          text: "Formato 5252 -Consorcios Saldo Cuentas por Pagar-",
          value: 5252,
        },
      ],
      tiporeg: [
        { text: "No Aplica", value: 99 },
        { text: "Pago Deducible", value: 1 },
        { text: "Pago No Deducible", value: 2 },
        { text: "Iva Deducible", value: 3 },
        { text: "Iva No Deducible", value: 4 },
        { text: "Retención Practicada", value: 5 },
        { text: "Retención Asumida", value: 6 },
        { text: "Retencion Iva", value: 7 },
        { text: "Retencion Iva No Dom.", value: 8 },
        { text: "Devolucion en Ventas.", value: 9 },
        { text: "IVA recuperado Dev.en Compras anuladas,rescindidas o resueltas", value: 80 },        
        { text: "IVA recuperado Dev.en Ventas anuladas,rescindidas o resueltas", value: 81 },                
      ],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Editar", value: "edit", align: "center" },
        { text: "Codigo", align: "left", value: "cod_puc" },
        { text: "Descripción", align: "left", value: "descrip_puc" },
        { text: "Tipo", align: "center", value: "tipo_puc" },
        { text: "Cod.Niif", align: "left", value: "codniif_puc" },
        { text: "Nombre Niif", align: "left", value: "descripniif_puc" },
        { text: "Base Retención", align: "center", value: "base_puc" },
        { text: "Cta Control", align: "center", value: "ctrdoc_puc" },
        { text: "% Retención", align: "center", value: "porc_puc" },
        { text: "Formato", align: "center", value: "formato_puc" },
        { text: "Concepto", align: "center", value: "concepto_puc" },
        { text: "Renglon Iva", align: "center", value: "iva_puc" },
        { text: "Renglon RteFte", align: "center", value: "rfte_puc" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      show_select: true,
      conceptosdian_filtro: [],
      conceptosdian2_filtro: [],
    };
  },
  created() {
    var $this = this;
    this.get_ruts();
    this.cargarcontenido();
    this.cargarTablaniif();
    this.cargarTablartefte();
    // this.cargarTablaexogena();
    this.cargarTablarenta();
    this.cargarConcDian();
    this.cargarTablaIva();
    this.cargarPresup();

    this.$watch(
      "form.tipocod",
      (e) => {
        $this.cambioCuenta();
      },
      { deep: true }
    );
  },
  methods: {
    imprimir_pdf() {
      let data = this.contenido;
      let data_format = [];
      data_format.push([
        { text: "Codigo", style: "header_table" },
        { text: "Descripción", style: "header_table" },
        { text: "Tipo", style: "header_table" },
        { text: "Cod. Niif", style: "header_table" },
        { text: "Nombre Niif", style: "header_table" },
      ]);

      data.forEach((el) => {
        let item = [
          el.cod_puc.trim(),
          el.descrip_puc.trim(),
          el.tipo_puc.trim(),
          el.codniif_puc.trim(),
          el.descripniif_puc.trim(),
        ];

        data_format.push(item);
      });

      let header = [];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_format,
          header_pdf: header,
          titulo: "Informe configuración de cuentas",
          logo,
          fontSize: 8,
        });
      });
    },
    cargarPresup() {
      post
        .postData({
          url: "Phorizontal/dlls/CfCodPresupJ.DLL",
          data: sessionStorage.Sesion + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datospresup = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Presupuesto",
            estado: true,
          });
        });
    },
    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts = data;
          this.ruts.unshift({
            identificacion_rut: "0",
            descripcion_rut: "Todos",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },

    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];

      data_parse = [...data];

      let columnas = [
        {
          title: "Codigo",
          value: "cod_puc",
        },
        {
          title: "Descripción",
          value: "descrip_puc",
          format: "string",
        },
        {
          title: "Tipo",
          value: "tipo_puc",
        },
        {
          title: "Cod. Niif",
          value: "codniif_puc",
        },
        {
          title: "Nombre Niif",
          value: "descripniif_puc",
          format: "string",
        },
        {
          title: "Base Retención",
          value: "base_puc",
        },
        {
          title: "% Retención",
          value: "porc_puc",
        },
        {
          title: "Formato",
          value: "formato_puc",
        },
        {
          title: "Concepto",
          value: "concepto_puc",
        },
        {
          title: "Renglon Iva",
          value: "iva_puc",
        },
        {
          title: "Renglon RteFte",
          value: "rfte_puc",
        },
      ];

      let header_format = [
        { text: "INFORME CONFIGURACIÓN DE CUENTAS", bold: true, size: 16 },
        "",
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Informe configuración de cuentas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `INFORME CONFIGURACIÓN DE CUENTAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    filtrar_conceptos() {
      if (this.form.format_exogena) {
        this.conceptosdian_filtro = [];
        let formato = this.form.format_exogena.value;
        if (formato && !isNaN(parseFloat(formato))) {
          this.conceptosdian_filtro = this.conceptosdian.filter((concepto) => {
            return parseFloat(concepto.formato_rep) === parseFloat(formato);
          });
        } else {
          console.warn("⚠️ El valor de formato no es válido:", formato);
        }
      }

      // let formato = this.form.format_exogena;
      // if (formato) {
      //   this.form.concepto_exogena = null;
      //   let filtro = this.conceptosdian.filter(
      //     (el) => el.formato_rep == formato.value
      //   );

      //   this.conceptosdian_filtro = filtro;
      // }
    },
    filtrar_conceptos2() {
      if (this.form.format_exogena2) {
        this.conceptosdian2_filtro = [];
        let formato = this.form.format_exogena2.value;
        if (formato && !isNaN(parseFloat(formato))) {
          this.conceptosdian2_filtro = this.conceptosdian.filter((concepto) => {
            return parseFloat(concepto.formato_rep) === parseFloat(formato);
          });
        } else {
          console.warn("⚠️ El valor de formato no es válido:", formato);
        }
      }
    },

    filtrar_conceptos3() {
      if (this.form.format_exogena3) {
        this.conceptosdian3_filtro = [];
        let formato = this.form.format_exogena3.value;
        if (formato && !isNaN(parseFloat(formato))) {
          this.conceptosdian3_filtro = this.conceptosdian.filter((concepto) => {
            return parseFloat(concepto.formato_rep) === parseFloat(formato);
          });
        } else {
          console.warn("⚠️ El valor de formato no es válido:", formato);
        }
      }
    },

    cambioCuenta() {
      if (
        (this.form.tipocod && this.form.tipocod.value == 4) ||
        this.form.tipocod == 4
      )
        this.show_select = true;
      else this.show_select = false;
    },
    format_niif(val) {
      return `${val.cod_niif} - ${val.descrip_niif}`;
    },
    format_frtefte(val) {
      return `${val.renglon_for} - ${val.descripcion_for}`;
    },
    format_iva(val) {
      return `${val.renglon_for} - ${val.descripcion_for}`;
    },
    format_frrenta(val) {
      return `${val.renglon_for} - ${val.descripcion_for}`;
    },

    format_presup(val) {
      return `${val.descrip_rep}`;
    },

    format_conceptos(val) {
      return val.concepto_rep + " - " + val.descripcion_rep.trim();
    },

    cargarConcDian: function () {
      let codigo = 0;
      let periodo = 0;
      let tipo = 1;

      post
        .postData({
          url: "financiero/dlls/CfConcDianJ.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            codigo +
            "|" +
            periodo +
            "|" +
            tipo +
            "|",
          method: "",
        })
        .then((data) => {
          this.conceptosdian = [];
          this.conceptosdian2 = [];
          this.conceptosdian = JSON.parse(JSON.stringify(data));
          this.conceptosdian2 = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ceonceptos Dian",
            estado: true,
          });
        });
    },
    cargarTablaniif: function () {
      post
        .postData({
          url: "Financiero/dlls/CfClasniifJ.DLL",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.datosniif = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Codigos Niif",
            estado: true,
          });
        });
    },
    cargarTablartefte: function () {
      var fecha = this.$moment().format("YYYY");
      post
        .postData({
          url: "Financiero/dlls/CfFrDianJ.DLL",
          data: sessionStorage.Sesion + "|" + 350 + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.datosfrte = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tabla Retefte",
            estado: true,
          });
        });
    },
    cargarTablarenta: function () {
      var fecha = this.$moment().format("YYYY");
      post
        .postData({
          url: "Financiero/dlls/CfFrDianJ.DLL",
          data: sessionStorage.Sesion + "|" + 110 + "|" + 2022 + "|",
          method: "",
        })
        .then((data) => {
          this.datosrenta = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tabla Retefte",
            estado: true,
          });
        });
    },
    cargarTablaexogena: function () {
      var fecha = this.$moment().format("YYYY");
      post
        .postData({
          url: "Financiero/dlls/CfFrDianJ.DLL",
          data: sessionStorage.Sesion + "|" + 350 + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.datosfrte = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tabla Retefte",
            estado: true,
          });
        });
    },
    cargarTablaIva: function () {
      var fecha = this.$moment().format("YYYY");
      post
        .postData({
          url: "Financiero/dlls/CfFrDianJ.DLL",
          data: sessionStorage.Sesion + "|" + 300 + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.datosfiva = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tabla Retefte",
            estado: true,
          });
        });
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = item.cod_puc + "-" + item.descrip_puc;
      this.form.tipocod = parseInt(item.tipo_puc);
      this.form.codigo = item.cod_puc;
      this.form.descripcion = item.descrip_puc;
      this.form.niif = item.codniif_puc;
      this.form.baserte = parseInt(item.base_puc);
      this.form.porcrte = item.porc_puc.trim();
      this.form.ctrdoc = parseInt(item.ctrdoc_puc);
      this.form.ctacart = parseInt(item.ctacart_puc);

      var busqueda_niif = this.datosniif.find(
        (el) => el.cod_niif == parseInt(item.codniif_puc)
      );
      this.form.niif = busqueda_niif;

      var busqueda_presup = this.datospresup.find(
        (el) => parseInt(el.cod_rep) == parseInt(item.codpresup_puc)
      );
      this.form.presup = busqueda_presup;

      var busqueda_frtefte = this.datosfrte.find(
        (el) => el.renglon_for == item.rfte_puc
      );
      this.form.frtefte = busqueda_frtefte;

      var busqueda_codiva = this.datosfiva.find(
        (el) => el.renglon_for == item.iva_puc
      );
      this.form.friva = busqueda_codiva;

      var busqueda_codrenta = this.datosrenta.find(
        (el) => el.renglon_for == item.rrenta_puc
      );
      this.form.frrenta = busqueda_codrenta;

      var busqueda_cod2renta = this.datosrenta.find(
        (el) => el.renglon_for == item.rrenta2_puc
      );
      this.form.frrenta2 = busqueda_cod2renta;

      var busqueda_cod3renta = this.datosrenta.find(
        (el) => el.renglon_for == item.rrenta3_puc
      );
      this.form.frrenta3 = busqueda_cod3renta;

      var busqueda_formato = this.formatos.find(
        (el) => el.value == item.formato_puc
      );
      this.form.format_exogena = busqueda_formato;
      this.filtrar_conceptos();

      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_puc
      );
      this.form.concepto_exogena = busqueda_concepto;

      var busqueda_tiporeg = this.tiporeg.find(
        (el) => el.value == item.tipoexog_puc
      );
      this.form.tiporeg = busqueda_tiporeg;

      var busqueda_formato2 = this.formatos.find(
        (el) => el.value == item.formato2_puc
      );
      this.form.format_exogena2 = busqueda_formato2;
      this.filtrar_conceptos2();

      var busqueda_concepto2 = this.conceptosdian2_filtro.find(
        (el) => el.concepto_rep == item.concepto2_puc
      );
      this.form.concepto_exogena2 = busqueda_concepto2;

      var busqueda_tiporeg2 = this.tiporeg.find(
        (el) => el.value == item.tipoexog2_puc
      );
      this.form.tiporeg2 = busqueda_tiporeg2;

      var busqueda_formato3 = this.formatos.find(
        (el) => el.value == item.formato3_puc
      );
      this.form.format_exogena3 = busqueda_formato3;
      this.filtrar_conceptos3();

      var busqueda_concepto3 = this.conceptosdian3_filtro.find(
        (el) => el.concepto_rep == item.concepto3_puc
      );
      this.form.concepto_exogena3 = busqueda_concepto3;

      var busqueda_tiporeg3 = this.tiporeg.find(
        (el) => el.value == item.tipoexog3_puc
      );
      this.form.tiporeg3 = busqueda_tiporeg3;

      var busqueda_cta = this.ruts.find(
        (el) => el.identificacion_rut == item.rutica_puc
      );
      this.form.municipio = busqueda_cta;

      var busqueda_rut1 = this.ruts.find(
        (el) => el.identificacion_rut == item.rutexo1_puc
      );
      this.form.rutrep = busqueda_rut1;

      var busqueda_rut2 = this.ruts.find(
        (el) => el.identificacion_rut == item.rutexo2_puc
      );
      this.form.rutrep2 = busqueda_rut2;

      this.cambioCuenta();
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let tipo_cod = this.form.tipocod;
      let niif = this.form.niif;

      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (tipo_cod == 4 && !niif) {
        this.send_error("Clasificación obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var eliminar = data.eliminar ? "1" : "0";
      var codigo = data.codigo;
      var tipocod = data.tipocod;
      var descripcion = data.descripcion;
      var niif = data.niif ? data.niif.cod_niif : "0";
      var rfte = data.frtefte ? data.frtefte.renglon_for : "0";
      var presup = data.presup ? data.presup.cod_rep : "0";

      var codiva = data.friva ? data.friva.renglon_for : "0";
      var rutica = data.municipio ? data.municipio.identificacion_rut : "0";
      var codrenta = data.frrenta ? data.frrenta.renglon_for : "0";
      var codrenta2 = data.frrenta2 ? data.frrenta2.renglon_for : "0";
      var codrenta3 = data.frrenta3 ? data.frrenta3.renglon_for : "0";

      var formatoex = data.format_exogena ? data.format_exogena.value : "0";
      var rutexog1 = data.rutrep ? data.rutrep.identificacion_rut : "0";
      var rutexog2 = data.rutrep2 ? data.rutrep2.identificacion_rut : "0";
      var rutexog3 = data.rutrep3 ? data.rutrep3.identificacion_rut : "0";

      var conceptoex = data.concepto_exogena
        ? data.concepto_exogena.concepto_rep
        : "0";
      var tiporeg = data.tiporeg ? data.tiporeg.value : "0";

      var formatoex2 = data.format_exogena2 ? data.format_exogena2.value : "0";
      var conceptoex2 = data.concepto_exogena2
        ? data.concepto_exogena2.concepto_rep
        : "0";
      var tiporeg2 = data.tiporeg2 ? data.tiporeg2.value : "0";

      var formatoex3 = data.format_exogena3 ? data.format_exogena3.value : "0";
      var conceptoex3 = data.concepto_exogena3
        ? data.concepto_exogena3.concepto_rep
        : "0";
      var tiporeg3 = data.tiporeg3 ? data.tiporeg3.value : "0";

      var base = data.baserte ? data.baserte : "0";
      var rte = data.porcrte ? data.porcrte : "0";
      var ctrdoc = data.ctrdoc ? "1" : "0";
      var ctacart = data.ctacart ? "1" : "0";
      let datos = {
        url: "Financiero/dlls/CfCuentas.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          tipocod +
          "|" +
          descripcion +
          "|" +
          niif +
          "|" +
          base +
          "|" +
          rte +
          "|" +
          ctrdoc +
          "|" +
          ctacart +
          "|" +
          rfte +
          "|" +
          eliminar +
          "|" +
          codiva +
          "|" +
          formatoex +
          "|" +
          conceptoex +
          "|" +
          tiporeg +
          "|" +
          rutica +
          "|" +
          formatoex2 +
          "|" +
          conceptoex2 +
          "|" +
          tiporeg2 +
          "|" +
          rutexog1 +
          "|" +
          rutexog2 +
          "|" +
          codrenta +
          "|" +
          codrenta2 +
          "|" +
          codrenta3 +
          "|" +
          presup +
          "|" +
          formatoex3 +
          "|" +
          conceptoex3 +
          "|" +
          tiporeg3 +
          "|" +
          rutexog3 +
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
          if (this.auxiliar == 4) {
            this.form.auxiliar = true;
          }
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
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
      this.auxiliar = this.form.auxiliar ? 4 : 0;
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + this.auxiliar + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas",
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
