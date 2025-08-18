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
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-right-bold-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Solicitud Traslado de Mercancías</v-list-item-title
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
            <v-row class="d-flex mt-1">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia que Solicita"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Solicita"
                  :items="ubicasolic"
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
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Despacha"
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
            </v-row>
            <v-row class="ml-2 justify-center">
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
            </v-row>
            <v-row class="ml-2">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Molecula"
                  outlined
                  v-model="form.molecula"
                  :item-text="format_moleculas"
                  :items="moleculas"
                  clearable
                  return-object
                  item-value="cod_rep"
                  @change="get_medicamento"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  v-model="form.medicamento"
                  :item-text="format_medicamento_sol"
                  :items="medicamentos"
                  @change="get_saldo()"
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
                      {{ format_medicamento_sol(item) }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- 

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
              </v-col> -->
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

                <template v-slot:item.cantsolicita_rep="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.cantsolicita_rep"
                  >
                    {{ props.item.cantsolicita_rep }}
                    <template v-slot:input>
                      <v-text-field
                        clearable
                        v-model="props.item.cantsolicita_rep"
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                  <hr color="red" />
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
                  v-model="form.observacion"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="orange darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaProduccion.datos"
                  @click="
                    (disabled.error_saldo = false),
                      (error_saldo = 0),
                      validar_saldos()
                  "
                  >Validar</v-btn
                >
              </v-col>

              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="disabled.error_saldo"
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
import { solicita_traslado } from "../../_formatos_disp.js";

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
        error_saldo: true,
      },

      dialogPicker: false,
      dialogPickervence: false,
      singleExpand: true,
      pickerPeriodo: false,
      error_saldo: 0,
      contenido: [],
      agencias: [],
      medicamentos: [],
      moleculas: [],
      ubicasolic: [],
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
        { text: "Medicamento", align: "left", value: "tab_medicamento" },
        { text: "Lote", align: "center", value: "tab_lote_" },
        { text: "Saldo", align: "center", value: "tab_cantidad" },
        { text: "Cant Solicitada", align: "center", value: "cantsolicita_rep" },
        { text: "Vence", align: "center", value: "tab_vence", width: "130px" },
        { text: "Laboratorio", align: "center", value: "tab_laboratorio" },
        { text: "Seleccionar", value: "edit", align: "center" },
      ],

      tablaProduccion: {
        headers: [
          { text: "Descripción", align: "left", value: "tab_medicamento" },
          { text: "Cum", align: "left", value: "tab_cum" },
          { text: "Lote", align: "left", value: "tab_lote" },
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
    this.get_molecula();
    this.cargarTablaAg();
    this.cargarTablaubica();

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    get_saldo() {
      let item = this.form.medicamento;

      const index = this.items_tabla_saldos.length;
      let cantidad = parseFloat(item.cant_rep);

      if (this.form.medicamento) {
        this.items_tabla_saldos.push({
          tab_codigo: item.codprod_rep.trim(),
          tab_medicamento: item.descripprod_rep.trim(),
          tab_lote_: item.lote_rep.trim(),
          id: index + 1,
          tab_laboratorio: item.laboratorio_rep.trim(),
          tab_cantidad: cantidad,
          tab_cum: item.cum_rep.trim(),
          tab_vence: item.vence_rep.replace(/\-/g, ""),
        });
      }
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
          let filtro = "";
          if (this.empresa.agencia_empr == "0100") {
            filtro = data;
          } else {
            filtro = data.filter(
              (el) => el.codigo_ubic == this.empresa.agencia_empr
            );
          }

          this.ubicasolic = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },

    async validar_saldos() {
      this.valida_productos = [];
      let productos = this.tablaProduccion.datos;
      this.valida_productos = productos;

      productos.forEach((objeto, index) => {
        let solicita = parseFloat(objeto.solicita_rep);
        let descripcion = objeto.tab_medicamento.trim();

        if (objeto.tab_cantidad < 1) {
          this.disable_grabar = 1;
          this.valida_productos[index].novalidado = true;
          let msg = "Sin Saldo para Despachar " + descripcion;
          this.send_error(msg);
          this.disabled.error_saldo = true;
        } else if (objeto.tab_cantidad > 0) {
          if (this.error_saldo == 1) {
            this.disabled.error_saldo = true;
            let msg = "Error en Saldo para Despachar ";
            this.send_error(msg);
          } else {
            let ubicacion = this.form.ubica_orig;
            // let medicamento = objeto.tab_codigo.substr(0, 18);
            let medicamento = objeto.tab_codigo;
            let lote = objeto.tab_lote;
            let cum = objeto.tab_cum;

            let descr_med = objeto.tab_medicamento;
            let saldo_actual = 0;
            let error_sdo = 0;
            post
              .postData({
                url: "Dispensa/dlls/RpSaldos6J.dll",
                data:
                  sessionStorage.Sesion +
                  "|" +
                  ubicacion +
                  "|" +
                  medicamento +
                  "|" +
                  cum +
                  "|" +
                  lote +
                  "|" +
                  descr_med +
                  "|",
                method: "",
              })
              .then((data) => {
                saldo_actual = data[0].cant_rep;
                if (saldo_actual < objeto.tab_cantidad) {
                  this.disabled.error_saldo = true;
                  this.error_saldo = 1;
                  this.valida_productos[index].novalidado = true;
                  let msg = "Sin Saldo para Despachar " + descripcion;
                  this.send_error(msg);
                } else {
                  this.disabled.error_saldo = false;
                }
              })
              .catch((err) => {
                this.$emit("snack", {
                  color: "error",
                  text: "Error al validar saldo",
                  estado: true,
                });
                this.disabled.error_saldo = true;

                return { error_sdo: 1 };
              });
          }
        }
      });
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
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
      const index = this.items_tabla_saldos.length;
      let saldo = parseFloat(item.tab_cantidad);
      let cantidad = item.cantsolicita_rep
        ? parseFloat(item.cantsolicita_rep)
        : 0;

      if (cantidad > saldo || cantidad == 0) {
        this.send_error("Error en Cantidad Solicitada!");
      } else {
        if (this.form.medicamento) {
          this.tablaProduccion.datos.push({
            tab_codigo: item.tab_codigo.trim(),
            tab_medicamento: item.tab_medicamento.trim(),
            tab_lote: item.tab_lote_.trim(),
            id: index + 1,
            tab_cantidad: cantidad,
            tab_cum: item.tab_cum.trim(),
            tab_vence: item.tab_vence.replace(/\-/g, ""),
          });
        }
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
    async get_medicamento() {
      let molecula = this.form.molecula.codigo_rep;
      let ubicacion = this.form.ubica_orig;
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.medicamentos = [];
      await post
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
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.medicamentos = data;
        })
        .catch((err) => {
          this.loader = false;
          this.load.servicios = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Medicamentos",
            estado: true,
          });
        });
    },
    async verificar_codigo() {
      var codigo = this.form.barras;
      this.dialogo.loader = true;
      await post
        .postData({
          url: "Dispensa/dlls/CfProductosJB.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then(async (data) => {
          this.dialogo.loader = false;

          let molecula = data[0].molecula_pr.trim();
          let medicamento = data[0].codigo_pr.trim();

          var busqueda_molecula = this.moleculas.find(
            (el) => parseFloat(el.cod_rep.trim()) == parseFloat(molecula)
          );
          this.form.molecula = busqueda_molecula;

          await this.get_medicamento_alista();

          var busqueda_medicamento = this.medicamentos.find(
            (el) => el.cod_rep == medicamento
          );
          this.form.medicamento = busqueda_medicamento;
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
    async get_medicamento_alista() {
      return new Promise((resolve, reject) => {
        this.medicamentos_alista = [];

        let molecula = this.form.molecula.cod_rep;
        let contrato = 0;
        this.medicamentos = [];
        post
          .postData({
            url: "Dispensa/dlls/PrDispensa03J.DLL",
            data: sessionStorage.Sesion + "|" + molecula + "|" + contrato + "|",
            method: "POST",
          })
          .then((data) => {
            data.pop();
            this.medicamentos = data;
            resolve();
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
    format_medicamento(val) {
      return `${val.descripcion_rep.trim()} - ${val.descriplaboratorio_rep.trim()}`;
    },
    format_medicamento_sol(val) {
      return `${val.descripprod_rep} -Cum:${val.lote_rep} -Saldo: ${val.cant_rep}`;
    },

    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let origen = data.ubica_orig;
      let destino = data.ubica_destino;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let observacion = data.observacion ? data.observacion.trim() : "";

      let tablaOrigen = {};
      this.tablaProduccion.datos.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let codigo = item.tab_codigo.trim();
        let cantidad = parseFloat(item.tab_cantidad);
        let lote = item.tab_lote.trim();
        let vence = item.tab_vence.replace(/\-/g, "");
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${codigo}|${cantidad}|${lote}|${vence}|`;
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
        "|" +
        observacion +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrSolTraslado.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Solicitud Registrada Correctamente",
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
          this.items_tabla_saldos = [];
          this.form.producto = null;
          this.form.observacion = null;
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
            url: "Dispensa/dlls/PrSolTrasladoN.dll",
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
          let filtro = null;
          if (this.empresa.agencia_empr == "0100") {
            filtro = data;
          } else {
            filtro = data.filter(
              (el) => el.codigo_agc == this.empresa.agencia_empr
            );
          }
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
    get_molecula() {
      post
        .postData({
          url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.moleculas = JSON.parse(JSON.stringify(data));
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
    format_medicam(val) {
      return `${val.descripcion.trim()}-${val.desclaborat_rep.trim()}`;
    },

    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
    },

    format_punto_fact: function (val) {
      return `${val.descripcion_agc} `;
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

