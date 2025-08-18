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
              <v-icon size="30" color="blue darken-4 ">mdi-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Novedad de Inventario</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="2">
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
            <v-row class="mt-1">
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
                  @change="errores.punto_fact = false"
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
                  @change="errores.ubica_orig = false;
                  "
                  :item-text="format_ubicacion"
                  :error="errores.ubica_orig"
                ></v-autocomplete>
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
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Tipo Novedad"
                  :items="tiponovedad"
                  outlined
                  clearable
                  persistent-hint
                  required
                  v-model="form.tiponovedad"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2">
              <v-col class="d-flex justify-center" cols="8">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto x Nombre"
                  clearable
                  hide-details
                  :item-text="format_medicamento"
                  v-model="form.producto"
                  return-object
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex align-items-center justify-center">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  clearable
                  label="Cantidad"
                  v-model="form.cantidad"
                  hide-details
                  @change="errores.cantidad = false"
                  @keyup.enter="focusNextField('lote')"
                  :error="errores.cantidad"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  clearable
                  label="Lote"
                  id="lote"
                  v-model="form.lote"
                  hide-details
                  @change="errores.lote = false"
                  @keyup.enter="focusNextField('fechavence')"
                  :error="errores.lote"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPickervence"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Vence"
                      id="fechavence"
                      v-model="form.fechavence"
                      @keyup.enter="focusNextField('agregar_item')"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechavence"
                    @input="dialogPickervence = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-items-center justify-center">
                <v-btn
                  color="indigo white--text"
                  @click="add_item()"
                  depressed
                  id="agregar_item"
                >
                  <v-icon size="20" left>mdi-arrow-left-bottom</v-icon>Agregar
                  Producto
                </v-btn>
              </v-col>
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
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
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
import { comprobantes_inv } from "../../_formatos.pdf";
import { comprobantes_inv_pos } from "../../_formatos.pdf";

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
        estado: false,
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
      tiponovedad: [
        { text: "Entrada", value: 1 },
        { text: "Salida", value: 2 },
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
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
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
          url: "Dispensa/dlls/CfMedicamentosJ.dll",
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
    add_item() {
      const index = this.tablaProduccion.datos.length;
      let cantidad = parseFloat(this.form.cantidad);
      let vence = this.form.fechavence;

      if (this.form.producto) {
        this.tablaProduccion.datos.push({
          tab_codigo: this.form.producto.cod_rep.trim(),
          tab_medicamento: this.form.producto.descripcion_rep.trim(),
          tab_lote_: this.form.lote.trim(),
          id: index + 1,
          tab_cantidad: cantidad,
          tab_cum: this.form.producto.cum_rep.trim(),
          tab_vence: vence,
        });
        this.form.lote = ""
        this.form.cantidad = ""
        this.form.fechavence = ""
        this.form.producto = null
        
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
        this.send_error("Ubicación sin Seleccionar!");
      } else {
        this.format_envio(data);
      }
    },
    format_medicamento(val) {
      return `${val.descripcion_rep.trim()}-${val.descriplaboratorio_rep.trim()}-Cum:${val.cum_rep.trim()}`;
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let ubicacion = data.ubica_orig;
      let fecha = data.fecha.replace(/\-/g, "");
      let tipo = data.tiponovedad;

      let tablaOrigen = {};
      this.tablaProduccion.datos.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        item.tab_vence = item.tab_vence.replace(/\-/g, "");
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${item.tab_codigo}|${item.tab_cantidad}|${item.tab_lote_}|${item.tab_vence}|${item.tab_cum}|`;
      });

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        ubicacion +
        "|" +
        fecha +
        "|" +
        tipo +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrNovInv.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso Registrado Correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.tablaProduccion.datos = [];
          this.form.cantidad = 0;
          this.form.lote = "";
          this.form.fechavence = 0;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    async get_impresion() {
      let consecutivo = this.comprobante.nro;
      let agencia = this.form.punto_fact.codigo_agc;
      let fecha = this.form.fecha.replace(/\-/g, "");
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        "E27" +
        "|" +
        consecutivo +
        "|" +
        agencia +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Ptovta/dlls/PrReimpfisJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {})
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
