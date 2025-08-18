<!-- ******PROCESA SOLICITUD TRASLADOS***** -->

<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-clock-fast</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Traslado Express de Producto</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row>
          <v-col cols="3">
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
                  @input="pickeFechaIni = false"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_ini"
                @input="pickeFechaIni = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="3">
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
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_final"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-autocomplete
              label="Estado"
              :items="tipoestado"
              outlined
              clearable
              persistent-hint
              required
              v-model="form.tipoestado"
              :error="errores.tipoestado"
              @change="cargarcontenido(), (errores.tipoestado = false)"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="d-flex mt-2">
          <v-col class="d-flex justify-end">
            <v-btn
              color="indigo"
              class="white--text px-12"
              depressed
              large
              @click="cargarcontenido"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-btn
            color="success"
            class="ma-2 white--text"
            large
            depressed
            @click="agregar_item()"
          >
            Agregar Traslado
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>
        </v-row>

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
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="item.color_rep"
                  >{{ item.estado_rep }}</v-chip
                >
              </template>

              <template v-slot:item.consecutivo_rep="{ item }">
                {{ parseInt(item.consecutivo_rep) }}
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_alista(item, 'imprimir')"
                      color="#337DFF"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="recepcion_mcia(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.recep_rep == 1 ? true : false"
                    >
                      <v-icon>mdi-hand-coin-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Recepción Mercancía</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.estadoanula_rep == 1 ? true : false"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular</span>
                </v-tooltip>
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
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-right-bold-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Traslado Express de Productos</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="2">
              <v-menu
                ref="menu"
                v-model="dialogPicker"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Registro"
                    outlined
                    v-model="form.fecha"
                    disabled
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha"
                  @input="dialogPicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                hide-details
                type="text"
                :loading="load.consecutivo"
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
            <v-row class="d-flex mt-2">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia que Solicita"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  :error="errores.punto_fact"
                  @change="errores.punto_fact = false"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion Destino"
                  :items="ubica"
                  outlined
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_destino"
                  :item-text="format_ubicacion"
                  :error="errores.ubica_destino"
                  @change="errores.ubica_destino = false"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Despacha"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_orig"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Funcionario que Recibe"
                  v-model="form.recibe"
                  :items="ruts3"
                  :item-text="format_ruts"
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  outlined
                  @change="errores.recibe = false"
                  :error="errores.recibe"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Funcionario que Despacha"
                  v-model="form.funcalista"
                  :items="ruts3"
                  :item-text="format_ruts"
                  item-value="identificacion_rut"
                  hide-details
                  return-object
                  disabled
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00" class="mt-2"></v-divider>

            <v-row class="ml-2 justify-center mt-1">
              <v-col sm="6">
                <v-text-field
                  id="barra_alista"
                  label="Codigo de barras_Alistamiento"
                  outlined
                  hide-details
                  class="inputbarra"
                  filled
                  shaped
                  clearable
                  v-model="form.barras"
                  @keyup.enter="verificar_codigo(1)"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="ml-2">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  v-model="form.molecula_alista"
                  :item-text="format_moleculas"
                  :items="items_moleculas"
                  clearable
                  item-value="cod_rep"
                  return-object
                  @change="get_medicamento_alista"
                >
                </v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  id="medicamento"
                  outlined
                  v-model="form.medicamento"
                  :item-text="format_medicam_alista"
                  :items="medicamentos_alista"
                  @change="focusNextField('cantidad')"
                  clearable
                  return-object
                  ><template v-slot:label>
                    <span class="color-personalizado">Medicamento</span>
                  </template>

                  <template v-slot:item="{ item }">
                    <div
                      :style="{
                        color: parseFloat(item.cant_rep) > 0 ? 'blue' : 'black',
                      }"
                    >
                      {{ format_medicam_alista(item) }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="justify-center mb-4">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  id="cantidad"
                  label="Cantidad"
                  v-model="form.cantidad"
                  hide-details
                  type="text"
                  @keyup.enter="add_item()"
                ></v-text-field>
              </v-col>
              <v-col
                class="d-flex align-items-center justify-end mt-3"
                cols="2"
              >
                <v-btn color="indigo white--text" @click="add_item()" depressed>
                  <v-icon size="20" left>mdi-arrow-left-bottom</v-icon>Agregar
                </v-btn>
              </v-col>
            </v-row>

            <v-divider color="#FF6F00" class="mt-2"></v-divider>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="orange" class="white--text mr-3" label depressed>
                  A despachar
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tablaDespacho.headers"
                  :items="tablaDespacho.datos"
                  item-key="docinter_rep"
                  single-expand
                >
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="red"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="borrar_item(item, 'tablaDespacho')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="10">
                <v-text-field
                  label="Observacion"
                  clearable
                  type="text"
                  required
                  outlined
                  v-model="form.observacion"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="mb-4" cols="2">
                <v-text-field
                  label="Total Cajas"
                  clearable
                  outlined
                  type="number"
                  required
                  v-model="form.cajas"
                  hide-details
                  @change="errores.cajas = false"
                  :error="errores.cajas"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaDespacho.datos"
                  @click="grabar_comprobante()"
                  >Grabar</v-btn
                >
              </v-col>
              <v-col class="pa-0 px-0" sm="3">
                <v-btn
                  color="blue darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="disabled.imprimir"
                  :loading="load.imprimir"
                  @click="get_impresion"
                  >Imprimir</v-btn
                >
              </v-col>
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogo.estado = false"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogorecibo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-hand-coin-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Recibo de Mercancías Traslado Express</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="2">
              <v-menu
                ref="menu"
                v-model="dialogPickerrecep"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Registro"
                    outlined
                    v-model="form.fecharecep"
                    disabled
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecharecep"
                  @input="dialogPickerrecep = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecrecep"
                hide-details
                type="text"
                :loading="load.consecrecep"
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
            <v-row class="d-flex mt-1">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia que Recibe"
                  v-model="form.punto_factrecep"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  disabled
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Recibe"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_destinorecep"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Despacha"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_origrecep"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-divider></v-divider>
            <v-row class="d-flex mt-3 mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="orange" class="white--text mr-3" label depressed>
                  A Recibir
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tablaRecibo.headers"
                  :items="tablaRecibo.datos"
                  item-key="docinter_rep"
                  single-expand
                >
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="10">
                <v-text-field
                  label="Observacion"
                  clearable
                  type="text"
                  required
                  v-model="form.observacionrecep"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center mb-2 col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaRecibo.datos"
                  @click="grabar_recibido()"
                  >Grabar</v-btn
                >
              </v-col>
              <v-col class="pa-0 px-0" sm="3">
                <v-btn
                  color="blue darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="disabled.imprimir"
                  :loading="load.imprimir"
                  @click="get_impresion"
                  >Imprimir</v-btn
                >
              </v-col>
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogorecibo.estado = false"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogomotivo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Motivo Anulacion</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="10">
              <v-text-field
                hide-details
                clearable
                v-model="form.motivo"
                :error="errores.motivo"
                @input="errores.motivo = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-btn
              color="purple"
              class="white--text mr-3 px-12"
              depressed
              large
              @click="grabar_anular"
            >
              Guardar
            </v-btn>

            <v-btn
              color="red accent-4"
              class="white--text px-12"
              depressed
              large
              @click="dialogomotivo.estado = false"
            >
              Cerrar
            </v-btn>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="12">
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1.5px', 'border-color': 'orange' }"
              />
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
import { acta_entrega } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      load: {
        btn_enviar: false,
        impresion: false,
        consecutivo: false,
        consecutivorecep: false,
      },
      dialogomotivo: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogoactualiza: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      tipoestado: [
        { text: "Todos", value: 9 },
        { text: "Despachado", value: 3 },
        { text: "Recibido", value: 4 },
        { text: "Anulado", value: 1 },
      ],

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoguia: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogorecibo: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      pickeFechaIni: false,
      dialogPickerguia: false,
      dialogPickerrecep: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),

      styleObject: { border: "2px solid #01579B" },
      pickerFecha_reg: false,
      pickerFecha_acta: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      datosEmpresa: [],
      agencias: [],
      ubica: [],
      medicamentos: [],
      medicamentos_alista: [],
      dato_solicitud: [],
      items_moleculas: [],
      ruts3: [],

      tab: 0,
      total_solicitado: 0,
      total_despacho: 0,
      total_recibido: 0,
      search: null,
      item_selec: null,

      form: {
        molecula_alista: {},
        tipoestado: [],
        motivo: "",
      },
      disabled: {
        grabar: true,
        imprimir: true,
      },
      error: {
        ccosto: false,
      },
      tablaRecibo: {
        headers: [
          { text: "Descripción", align: "left", value: "descripcion_rep" },
          { text: "Cum", align: "left", value: "cum_rep" },
          { text: "Lote", align: "left", value: "lote_rep" },
          { text: "Vence", align: "left", value: "vence_rep", width: "130px" },
          { text: "Cantidad", value: "cantidad_rep", align: "center" },
        ],
        datos: [],
      },
      tablaDespacho: {
        headers: [
          { text: "Descripción", align: "left", value: "tab_medicamento" },
          { text: "Cum", align: "left", value: "tab_cum" },
          { text: "Lote", align: "left", value: "tab_lote_medicamento" },
          {
            text: "Vence",
            align: "center",
            value: "tab_vence",
            width: "130px",
          },
          { text: "Cantidad", value: "tab_cantotal", align: "center" },
          { text: "Acción", value: "boton", align: "center" },
        ],
        datos: [],
      },
      headers: [
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Nro Solicitud", align: "center", value: "consecutivo_rep" },
        { text: "Solicita", align: "left", value: "destino_rep" },
        { text: "Despacha", align: "left", value: "origen_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Acciones", value: "imprimir", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        recibe: false,
        cajas: false,
        tipoestado: false,
        funcalista: false,
        ubica_destino: false,
        punto_fact: false,
      },
      card_estado: false,
    };
  },
  async created() {
    await this.get_empresa();
    this.cargarTablaAg();
    this.cargarTablaubica();

    this.get_molecula();
    this.get_ruts3();
    // this.cargarcontenido();
    this.form.tipoestado = 9;
  },
  computed: {},
  methods: {
    add_item() {
      const index = this.tablaDespacho.datos.length;
      let cantidad = this.form.cantidad ? parseFloat(this.form.cantidad) : 0;
      let saldo = parseFloat(this.form.medicamento.cant_rep);
      let codigo = this.form.medicamento.codprod_rep.trim();
      let find_Index = this.tablaDespacho.datos.findIndex(
        (el) => el.cod_rep === codigo
      );

      if (find_Index !== -1) {
        this.send_error("Producto Repetido !!");
      } else {
        if (cantidad > saldo) {
          this.send_error("Cantidad Supera el saldo actual !!");
        } else {
          if (this.form.medicamento && cantidad > 0) {
            this.tablaDespacho.datos.push({
              tab_medicamento: this.form.medicamento.descripprod_rep.trim(),
              tab_cum: this.form.medicamento.cum_rep.trim(),
              tab_lote_medicamento: this.form.medicamento.lote_rep.trim(),
              tab_vence: this.form.medicamento.vence_rep,
              cod_rep: this.form.medicamento.codprod_rep.trim(),
              id: index + 1,
              tab_cantotal: cantidad,
            });
            this.form.molecula_alista = null;
            this.form.cantidad = null;
            this.form.medicamento = null;
            this.form.barras = null;
            this.focusNextField("barra_alista");
          }
        }
      }
    },
    agregar_item() {
      this.get_consecutivo();

      this.form.punto_fact = null;
      this.form.ubica_destino = null;
      this.form.recibe = null;
      this.form.observacion = null;
      this.form.cajas = null;
      this.tablaDespacho.datos = [];

      this.dialogo.estado = true;
      let iddespacha = parseFloat(sessionStorage.Sesion.substr(15, 15));
      let ubicacion = parseFloat(this.datosEmpresa.ubicauser_empr);

      let busqueda = this.ubica.find(
        (el) => parseFloat(el.codigo_ubic) == ubicacion
      );
      this.form.ubica_orig = busqueda;

      busqueda = this.ruts3.find(
        (el) => parseFloat(el.identificacion_rut) == iddespacha
      );
      this.form.funcalista = busqueda;

      this.form.fecha = this.$moment().format("YYYY-MM-DD");
    },
    get_consecutivo() {
      let agencia = this.datosEmpresa.agencia_empr;
      post
        .postData({
          url: "Dispensa/dlls/PrTraslExpN.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.consecutivo = parseFloat(data[0].nro);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consecutivo",
            estado: true,
          });
        });
    },
    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts3",
            estado: true,
          });
        });
    },
    anular_item(item) {
      this.dialogomotivo.estado = true;
      this.form.motivo = "";
      this.item_selec = item;
    },
    async grabar_anular() {
      let agencia = this.item_selec.agenciadest_rep;
      let consecutivo = this.item_selec.consecutivo_rep;
      let motivo = this.form.motivo.trim();
      this.dialogomotivo.estado = false;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        motivo +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrAnulaTraslado.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Procesado",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al anular Traslado");
        });
    },
    async get_alista(item) {
      this.tablaRecibo.datos = [];

      var key = item.agcgenera_rep + "|" + item.consecutivo_rep + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrTrasExpress01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data[0].productos.pop();
          this.tablaRecibo.datos = data[0].productos;
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al consultar el documento");
        });
    },
    async verificar_codigo(tipo) {
      let codigo = "";
      if (tipo == 1) {
        codigo = this.form.barras;
      }
      if (tipo == 2) {
        codigo = this.form.barrasrecep;
      }
      this.dialogo.loader = true;
      await post
        .postData({
          url: "Dispensa/dlls/CfProductosJB.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then(async (data) => {
          this.dialogo.loader = false;
          let molecula = data[0].molecula_pr;
          let medicamento = data[0].codigo_pr;

          if (tipo == 2) {
            this.medicamentos = data;
          } else {
            var busqueda_molecula = this.items_moleculas.find(
              (el) => parseFloat(el.codigo_rep) == parseFloat(molecula)
            );
            this.form.molecula_alista = busqueda_molecula;
            await this.get_medicamento_alista();
            var busqueda_medicamento = this.medicamentos_alista.find(
              (el) => el.cod_rep == medicamento
            );
            this.form.medicamento = busqueda_medicamento;
          }
          this.form.barras = "";
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al validar Barra",
            estado: true,
          });
        });
    },
    get_molecula() {
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.items_moleculas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agrp_Moleculas",
            estado: true,
          });
        });
    },
    grabar_comprobante: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (this.tablaDespacho.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Debe Seleccionar Agencia Solicitante!");
      } else if (!data.ubica_destino) {
        this.errores.ubica_destino = true;
        this.send_error("Debe Seleccionar Ubicacion Destino!");
      } else if (!data.cajas) {
        this.errores.cajas = true;
        this.send_error("Debe Registrar Cantidad de Cajas!");
      } else if (!data.recibe) {
        this.errores.recibe = true;
        this.send_error("Seleccione Funcionario que Recibe!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = this.datosEmpresa.agencia_empr;
      let ubic_orig = data.ubica_orig.codigo_ubic;
      let ubica_dest = data.ubica_destino;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let observacion = data.observacion ? data.observacion.trim() : "";
      let cajas = data.cajas;
      let recibe = data.recibe.identificacion_rut;

      let tablaOrigen = {};
      this.tablaDespacho.datos.forEach((item, index) => {
        let cantidad = item.tab_cantotal ? parseFloat(item.tab_cantotal) : 0;

        if (cantidad > 0) {
          let format_index = (index + 1).toString().padStart(3, "0");
          let codigo = item.cod_rep.trim();
          let lote = item.tab_lote_medicamento.trim();
          tablaOrigen[
            `DATOJ-${format_index}`
          ] = `${codigo}|${cantidad}|${lote}`;
        }
      });

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        ubic_orig +
        "|" +
        ubica_dest +
        "|" +
        consecutivo +
        "|" +
        cajas +
        "|" +
        fecha +
        "|" +
        observacion +
        "|" +
        recibe +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrTrasExpress.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Traslado Registrado Correctamente",
            estado: true,
          });
          this.cargarcontenido();
          this.card_estado = false;
          this.dialogo.estado = false;
          this.disabled.imprimir = false;
          this.load.imprimir = false;
          this.tablaProduccion.datos = [];
          this.tablaConsumo.datos = [];
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    grabar_recibido: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (this.tablaRecibo.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else {
        this.format_enviorecep(data);
      }
    },
    format_enviorecep(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = this.item_selec.agcgenera_rep;
      let fecha = data.fecharecep.replace(/\-/g, "");
      let consecutivo = this.item_selec.consecutivo_rep;

      let observacion = data.observacionrecep
        ? data.observacionrecep.trim()
        : "";

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        observacion +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrRecepExpr.dll",
        data: { importarhtml },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.dialogorecibo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Recepcion Registrada Correctamente",
            estado: true,
          });

          this.cargarcontenido();
          this.card_estado = false;
          this.dialogo.estado = false;
          this.disabled.imprimir = false;
          this.load.imprimir = false;
          this.tablaRecibo.datos = [];
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    async recepcion_mcia(item) {
      this.item_selec = item;
      await this.get_alista(item);

      this.dialogorecibo.estado = true;
      this.form = {
        fecharecep: this.$moment().format("YYYY-MM-DD"),
      };
      this.form.consecrecep = item.consecutivo_rep;

      let busqueda = this.agencias.find(
        (el) => el.codigo_agc == item.agenciadest_rep
      );
      this.form.punto_factrecep = busqueda;

      busqueda = this.ubica.find(
        (el) => el.codigo_ubic == item.agenciadest_rep
      );
      this.form.ubica_destinorecep = busqueda;

      busqueda = this.ubica.find((el) => el.codigo_ubic == item.agcgenera_rep);
      this.form.ubica_origrecep = busqueda;
      this.tablaRecibo.datos = [];
    },
    async get_empresa() {
      await post
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
    imprimir_alista(item, tipo) {
      var key = item.agcgenera_rep + "|" + item.consecutivo_rep + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrTrasExpress01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;

            acta_entrega(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      this.contenido = [];

      let fechaini = this.fecha_ini.split("-").join("");
      let fechafin = this.fecha_final.split("-").join("");
      let agencia = this.datosEmpresa.agencia_empr;
      let tipo = this.form.tipoestado;
      if (tipo < 1) {
        tipo = 9;
      }
      post
        .postData({
          url: "Dispensa/dlls/PrTrasExpressJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            agencia +
            "|" +
            tipo +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let data_parse = JSON.parse(JSON.stringify(data));
          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Alistamientos",
            estado: true,
          });
        });
    },
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubica = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    async get_medicamento_alista() {
      return new Promise((resolve, reject) => {
        let ubicacion = parseFloat(this.datosEmpresa.ubicauser_empr);
        let molecula = this.form.molecula_alista.codigo_rep;
        let fecha = this.form.fecha.replace(/\-/g, "");
        post
          .postData({
            url: "Dispensa/dlls/RpSaldoTrasJ.DLL",
            data:
              sessionStorage.Sesion +
              "|" +
              ubicacion +
              "|" +
              molecula +
              "|" +
              fecha +
              "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.medicamentos_alista = data;
          })
          .catch((err) => {
            this.loader = false;
            this.load.servicios = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Medicamentos",
              estado: true,
            });
            reject();
          });
      });
    },
    format_ubicacion: function (val) {
      return `${val.descrip_ubic}`;
    },
    format_medicamento(val) {
      return `${val.descripcion_rep}`;
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.descripcion_agc}`;
    },
    async get_impresion() {
      let agencia = this.item_selec.agcgenera_rep;
      let consecutivo = `00000${this.form.consecutivo - 1}`;
      var key = agencia + "|" + consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrSolTraslado01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            solicita_traslado(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    borrar_item(item) {
      const index = this.tablaDespacho.datos.indexOf(item);
      this.tablaDespacho.datos.splice(index, 1);
    },
    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
    },
    format_ruts(val) {
      return `${val.descripcion_rut.trim()}`;
    },

    format_medicam_alista(val) {
      return `${val.descripprod_rep}-${val.laboratorio_rep}-Lote:${val.lote_rep} -Saldo: ${val.cant_rep}`;
      // return `${val.descripprod_rep.trim()}-${val.laboratorio_rep.trim()} - ${val.desclaborat_rep.trim()}-Lote:${val.lote_rep.trim()} -Saldo: ${val.cant_rep.trim()}`;
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
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
