<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-auto-upload</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Alistamiento de Mercancías</v-list-item-title
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
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Ubicacion Origen"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="form.ubica_orig"
                  @change="errores.ubica_orig = false"
                  :item-text="format_ubicacion"
                  :error="errores.ubica_orig"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Ubicacion Destino"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="form.ubica_destino"
                  @change="errores.ubica_destino = false"
                  :item-text="format_ubicacion"
                  :error="errores.ubica_destino"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2">
              <v-col sm="6">
                <v-text-field
                  label="Codigo de barras"
                  outlined
                  hide-details
                  class="inputbarra"
                  filled
                  shaped
                  clearable
                  v-model="form.barras"
                  @keyup.enter="verificar_codigo()"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-center" cols="6">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto x Nombre"
                  clearable
                  hide-details
                  :item-text="format_medicamento"
                  v-model="form.producto"
                  @change="get_saldo()"
                  return-object
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2 justify-center">
              <v-data-table
                :headers="headers_tabla_saldos"
                :items="items_tabla_saldos"
              >
                <template v-slot:item.edit="{ item }">
                  <v-icon class="mr-2" @click="add_item(item)" color="green"
                    >mdi-check-circle</v-icon
                  >
                </template>
                <template v-slot:item.vence_rep="{ item }">
                  <p
                    :style="{ backgroundColor: item.color_rep }"
                    style="color: white"
                  >
                    {{ item.vence_rep }}
                  </p>
                </template>

                <template v-slot:item.entrega_rep="props">
                  <v-edit-dialog :return-value.sync="props.item.entrega_rep">
                    {{ props.item.entrega_rep }}
                    <template v-slot:input>
                      <v-text-field
                        clearable
                        v-model="props.item.entrega_rep"
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="tablaProduccion.headers"
                  :items="tablaProduccion.datos"
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
                      @click="borrar_item(item, 'tablaProduccion')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:item.tab_cantidad="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_cantidad">
                      {{ props.item.tab_cantidad }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_cantidad"
                          clearable
                          label="Cantidad"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-slot:item.tab_lote_="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_lote_">
                      {{ props.item.tab_lote_ }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_lote_"
                          clearable
                          label="Lote"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-slot:item.tab_vence="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_vence">
                      {{ props.item.tab_vence }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_vence"
                          clearable
                          label="Vence"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaProduccion.datos"
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
            </v-row>
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
          <v-row class="ml-2 justify-end">
            <span class="title col-4 d-flex justify-left">Alistamiento de Mercancías</span>

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
          </v-row>

        </v-card-title>
        <v-card-text class="pb-0">

            <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Ubicacion Origen"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="form.ubica_orig"
                  @change="errores.ubica_orig = false"
                  :item-text="format_ubicacion"
                  :error="errores.ubica_orig"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Ubicacion Destino"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="form.ubica_destino"
                  @change="errores.ubica_destino = false"
                  :item-text="format_ubicacion"
                  :error="errores.ubica_destino"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2">
              <v-col sm="6">
                <v-text-field
                  label="Codigo de barras"
                  outlined
                  hide-details
                  class="inputbarra"
                  filled
                  shaped
                  clearable
                  v-model="form.barras"
                  @keyup.enter="verificar_codigo()"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-center" cols="6">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto x Nombre"
                  clearable
                  hide-details
                  :item-text="format_medicamento"
                  v-model="form.producto"
                  @change="get_saldo()"
                  return-object
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2 justify-center">
              <v-data-table
                :headers="headers_tabla_saldos"
                :items="items_tabla_saldos"
              >
                <template v-slot:item.edit="{ item }">
                  <v-icon class="mr-2" @click="add_item(item)" color="green"
                    >mdi-check-circle</v-icon
                  >
                </template>
                <template v-slot:item.vence_rep="{ item }">
                  <p
                    :style="{ backgroundColor: item.color_rep }"
                    style="color: white"
                  >
                    {{ item.vence_rep }}
                  </p>
                </template>

                <template v-slot:item.entrega_rep="props">
                  <v-edit-dialog :return-value.sync="props.item.entrega_rep">
                    {{ props.item.entrega_rep }}
                    <template v-slot:input>
                      <v-text-field
                        clearable
                        v-model="props.item.entrega_rep"
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="tablaProduccion.headers"
                  :items="tablaProduccion.datos"
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
                      @click="borrar_item(item, 'tablaProduccion')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:item.tab_cantidad="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_cantidad">
                      {{ props.item.tab_cantidad }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_cantidad"
                          clearable
                          label="Cantidad"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-slot:item.tab_lote_="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_lote_">
                      {{ props.item.tab_lote_ }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_lote_"
                          clearable
                          label="Lote"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-slot:item.tab_vence="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_vence">
                      {{ props.item.tab_vence }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_vence"
                          clearable
                          label="Vence"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaProduccion.datos"
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
            </v-row>
          </v-card-text>
        </div>





        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-btn
              class="ma-2 white--text"
              color="red"
              text
              @click="dialogo.estado = false"
              >Cancelar</v-btn
            >
            <v-btn
              class="ma-2 white--text"
              color="indigo"
              depressed
              large
              @click="turno_atendido()"
              >Guardar</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { alistamiento } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogo: {
        estado: true,
        titulo: null,
        tipo: null,
        metodo: null,
        index: null,
      },
      disabled: {
        grabar: true,
        imprimir: true,
      },

      dialogPicker: false,
      dialogPickervence: false,
      singleExpand: true,
      pickerPeriodo: false,
      contenido: [],
      agencias: [],
      medicamentos: [],
      ubica: [],
      search: "",
      form: {
        cantidad: 0,
        lote: 0,
        fechavence: this.$moment().format("YYYY-MM-DD"),
      },
      drawer: false,
      detalle: [],
      empresa: [],
      items_tabla_saldos: [],
      conteo: [
        { text: "Primer Conteo", value: 1 },
        { text: "Segundo Conteo", value: 2 },
        { text: "Tercer Conteo", value: 3 },
      ],

      card_estado: false,
      load: {
        btn_enviar: false,
        impresion: false,
        consecutivo: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      headers_tabla_saldos: [
        { text: "Medicamento", align: "left", value: "descripprod_rep" },
        { text: "Lote", align: "left", value: "lote_rep" },
        { text: "Saldo", align: "center", value: "cant_rep" },
        { text: "Despacho", align: "center", value: "entrega_rep" },
        { text: "Vence", align: "center", value: "vence_rep", width: "130px" },
        { text: "Laboratorio", align: "left", value: "laboratorio_rep" },
        { text: "Seleccionar", value: "edit", align: "center" },
      ],

      tablaProduccion: {
        headers: [
          { text: "Descripción", align: "left", value: "tab_medicamento" },
          { text: "Cum", align: "left", value: "tab_cum" },
          { text: "Lote", align: "left", value: "tab_lote_" },
          { text: "Vence", align: "left", value: "tab_vence" },
          { text: "Cantidad", value: "tab_cantidad", align: "center" },
          { text: "Acción", value: "boton", align: "center" },
        ],
        datos: [],
      },
      errores: {
        punto_fact: false,
        lote: false,
        cantidad: false,
        ubica_orig: false,
        ubica_destino: false,
      },
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      comprobante: null,
    };
  },

  created() {
    this.loader = false;
    this.get_empresa();
    this.cargarTablaAg();
    this.cargarTablaubica();
    this.get_medicamentos();

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    get_saldo() {
      console.log(this.form.ubica_orig);
      let medicamento = this.form.producto.cum_rep;
      let agencia = sessionStorage.Sede;
      agencia = this.form.ubica_orig;
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.items_tabla_saldos = [];
      post
        .postData({
          url: "Ptovta/dlls/RpSaldos1J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            medicamento +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.items_tabla_saldos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Saldos",
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
    get_medicamentos() {
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentoLtJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.medicamentos = [];
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

          this.medicamentos = data_parse;
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
    format_ubicacion: function (val) {
      return `${val.descrip_ubic}`;
    },
    edit_item(item, tabla) {
      let index = this[tabla].datos.indexOf(item);
      let obj = {
        producto_prod: item.producto,
        cantidad_prod: item.cantidad,
        kilos_prod: item.kilos,
        ubica_prod: item.ubica_prod,
      };

      this.form = { ...this.form, ...obj };
      this.dialogo.estado = true;
      this.dialogo.tipo = 2;
      this.dialogo.index = index;
      this.dialogo.tabla = tabla;
    },
    borrar_item(item, tabla) {
      let index = this[tabla].datos.indexOf(item);
      this[tabla].datos.splice(index, 1);
    },
    add_item(item) {
      const index = this.tablaProduccion.datos.length;
      let cantidad = parseFloat(item.entrega_rep);

      if (this.form.producto) {
        this.tablaProduccion.datos.push({
          tab_codigo: item.codprod_rep.trim(),
          tab_medicamento: item.descripprod_rep.trim(),
          tab_lote_: item.lote_rep.trim(),
          id: index + 1,
          tab_cantidad: cantidad,
          tab_cum: item.cum_rep.trim(),
          tab_vence: item.vence_rep.replace(/\-/g, ""),
        });
      }
    },
    grabar_comprobante: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (this.tablaProduccion.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Agencia sin Seleccionar!");
      } else if (!data.ubica_orig) {
        this.errores.ubica_orig = true;
        this.send_error("Ubicación de Origen sin Seleccionar!");
      } else if (!data.ubica_destino) {
        this.errores.ubica_destino = true;
        this.send_error("Ubicación de Destino sin Seleccionar!");
      } else {
        this.format_envio(data);
      }
    },
    verificar_codigo() {
      var codigo = this.form.barras;
      this.dialogo.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfProductosJB.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.loader = false;

          var busqueda_codigo = this.medicamentos.find(
            (el) => el.cod_rep == data[0].codmedicam_pr
          );
          this.form.producto = busqueda_codigo;
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
    format_medicamento(val) {
      return `${val.descripcion_rep}`;
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let origen = data.ubica_orig;
      let destino = data.ubica_destino;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;

      let tablaOrigen = {};
      this.tablaProduccion.datos.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        item.tab_vence = item.tab_vence.replace(/\-/g, "");
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${item.tab_codigo}|${item.tab_cantidad}|${item.tab_lote_}|${item.tab_vence}|`;
      });

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        origen +
        "|" +
        destino +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|";
      let datos = {
        url: "Ptovta/dlls/PrAlista.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Conteo Registrado Correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = JSON.parse(JSON.stringify(data));

          this.disabled.imprimir = false;
          this.load.imprimir = false;
          let comprobante = data[0];
          this.comprobante = comprobante;
          this.get_consecutivo();
          this.tablaProduccion.datos = [];
          this.tablaConsumo.datos = [];
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    get_plano() {
      const _this = this;
      return new Promise((resolve, reject) => {
        let tablaProduccion = _this.tablaProduccion.datos;
        let tablaConsumo = _this.tablaConsumo.datos;
        let detalle = [];
        tablaProduccion.forEach((el) =>
          detalle.push({
            producto: el.producto.codigo_pr.trim(),
            cantidad: el.cantidad,
            ubicacion: el.cod_ubica,
            tipo: 2,
          })
        );

        tablaConsumo.forEach((el) =>
          detalle.push({
            producto: el.producto.codigo_pr.trim(),
            cantidad: el.cantidad,
            ubicacion: el.cod_ubica,
            tipo: 1,
          })
        );

        var formData = new FormData();
        formData.append("tipo", "prProd");
        formData.append("data", JSON.stringify(detalle));

        fetch("https://server3ts.com//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    async get_impresion() {
      let agencia = this.form.punto_fact.codigo_agc;
      let consecutivo = `00000${this.form.consecutivo - 1}`;
      console.log(agencia);
      console.log(consecutivo);

      var key = agencia + "|" + consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Ptovta/dlls/PrAlista01J.dll",
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
            alistamiento(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    inicializar_dialogo() {
      this.dialogo = {
        estado: false,
        tipo: null,
        index: null,
        tabla: null,
      };

      this.form.producto_prod = null;
      this.form.cantidad_prod = null;
      this.form.kilos_prod = null;
      this.form.ubica_prod = null;
    },
    get_consecutivo() {
      var $this = this;
      let agencia = this.form.punto_fact;
      if (agencia) {
        this.load.consecutivo = true;

        post
          .postData({
            url: "Ptovta/dlls/PrAlistaN.dll",
            data: sessionStorage.Sesion + "|" + agencia.codigo_agc + "|",
            method: "POST",
          })
          .then((data) => {
            this.load.consecutivo = false;
            this.form.consecutivo = parseFloat(data[0].nro);
          })
          .catch((err) => {
            this.load.consecutivo = false;
            console.error("Error: ", err);
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
              estado: true,
            });
          });
      }
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
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
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
