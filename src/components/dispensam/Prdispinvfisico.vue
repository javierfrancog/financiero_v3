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
                >mdi-align-vertical-bottom</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Cargue Inventario Físico</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="mt-3 d-flex justify-end" cols="4">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="get_medicamentos()  "
                  depressed
                >
                  <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
                </v-btn>
              </v-col>

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
                  clearable
                  return-object
                  :disabled="disabled.linea"
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
                  return-object
                  item-value="codigo_ubic"
                  :disabled="disabled.linea"
                  v-model="form.ubica_orig"
                  @change="select_ubicacion(), (errores.ubica_orig = false)"
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
                      :disabled="disabled.linea"
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
                  label="Nro Conteo"
                  :items="conteo"
                  :disabled="disabled.linea"
                  outlined
                  clearable
                  persistent-hint
                  @change="get_consecutivo()"
                  required
                  v-model="form.conteo"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2">
              <v-col sm="4">
                <v-text-field
                  id="barras"
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
                  id="cantidad"
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
                      @keyup.enter="
                        (dialogPickervence = false),
                          focusNextField('agregar_item')
                      "
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechavence"
                    @change="dialogPickervence = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-items-center justify-center">
                <v-btn
                  color="indigo white--text"
                  @click="add_item()"
                  @keyup.enter="add_item()"
                  depressed
                  :disabled="disabled.agregar"
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
import { doc_invent_fisico } from "../../_formatos_disp.js";

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
        agregar: false,
        linea: false,
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
        barras: null,
        cantidad: 0,
        lote: 0,
        fechavence: this.$moment().format("YYYY-MM-DD"),
      },
      drawer: false,
      detalle: [],
      empresa: [],
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
    select_ubicacion() {
      let agencia = this.form.punto_fact.descripcion_agc.trim();
      let ubicacion = this.form.ubica_orig.descrip_ubic.trim();
      if (agencia == ubicacion) {
        this.disabled.agregar = false;
      } else {
        this.disabled.agregar = true;
        this.send_error(
          "Seleccione la ubicacion que corresponda a la agencia!"
        );
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
          data: sessionStorage.Sesion + "|" + "9" + "|",
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
      let error_fecha = false;
      let codigo = this.form.producto.cod_rep;
      let lote = this.form.lote.trim();
      this.disabled.linea = true;
      this.tablaProduccion.datos.forEach((item) => {
        if (item.tab_codigo == codigo && item.tab_lote_ == lote) {
          this.form.producto = null;
          this.form.barras = "";
          this.form.cantidad = "";
          this.form.lote = "";
          this.form.fechavence = null;

          this.$emit("snack", {
            color: "orange",
            text: "Este Producto ya tiene conteo!",
            estado: true,
          });
        }
      });
      this.form.fechavence.replace(/\//g, "-");
      this.form.fechavence.replace(/\\/g, "-");

      let val_ano = parseFloat(
        this.form.fechavence.replace(/\-/g, "").substr(0, 4)
      );
      let val_mes = parseFloat(
        this.form.fechavence.replace(/\-/g, "").substr(4, 2)
      );
      let val_dia = parseFloat(
        this.form.fechavence.replace(/\-/g, "").substr(6, 2)
      );

      console.log(val_ano, val_mes, val_dia);

      if (
        val_ano < 2000 ||
        val_mes < 1 ||
        val_mes > 12 ||
        val_dia < 1 ||
        val_mes > 31
      ) {
        error_fecha = true;
      }
      if (
        val_ano == "NaN" ||
        val_mes == "NaN" ||
        val_mes == "NaN" ||
        val_dia == "NaN" ||
        val_mes == "NaN"
      ) {
        error_fecha = true;
      }

      if (error_fecha) {
        this.$emit("snack", {
          color: "orange",
          text: "Error en fecha de vencimiento (Formato AAAA-MM-DD) !",
          estado: true,
        });
        console.log(val_ano, val_mes, val_dia);
      }

      if (this.form.producto && error_fecha == false) {
        this.tablaProduccion.datos.push({
          tab_codigo: this.form.producto.cod_rep,
          tab_medicamento: this.form.producto.descripcion_rep.trim(),
          tab_lote_: this.form.lote.trim(),
          id: index + 1,
          tab_cantidad: cantidad,
          tab_cum: this.form.producto.cum_rep.trim(),
          tab_vence: vence,
        });
        this.form.producto = null;
        this.form.barras = "";
        this.form.cantidad = "";
        this.form.lote = "";
        this.form.fechavence = null;
        this.focusNextField("barras");
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
      } else if (!data.conteo) {
        this.errores.conteo = true;
        this.send_error("Conteo sin Seleccionar!");
      } else {
        this.format_envio(data);
      }
    },
    verificar_codigo() {
      var codigo = this.form.barras.trim();

      if (!codigo) {
        this.focusNextField("barras");
      } else {
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
              (el) => el.barras_rep.trim() == data[0].barras_pr.trim()
            );

            this.form.producto = busqueda_codigo;
            this.form.barras = "";
            this.form.cantidad = "";
            this.form.lote = "";
            this.form.fechavence = "";
            this.focusNextField("cantidad");
          })
          .catch((err) => {
            this.form.producto = null;
            this.form.cantidad = "";
            this.form.lote = "";
            this.form.fechavence = "";
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al validar Barra",
              estado: true,
            });
          });
      }
    },
    format_medicamento(val) {
      return `${val.descripcion_rep}`;
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let ubicacion = data.ubica_orig.codigo_ubic;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let conteo = data.conteo;

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
        consecutivo +
        "|" +
        fecha +
        "|" +
        conteo +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrInvFisico.dll",
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
          this.disabled.linea = false;
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = JSON.parse(JSON.stringify(data));

          this.disabled.imprimir = false;
          this.load.imprimir = false;
          let comprobante = parseFloat(data[0].nro);
          this.comprobante = comprobante;
          this.get_consecutivo();
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
      let consecutivo = this.comprobante;
      let agencia = this.form.punto_fact.codigo_agc;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let conteo = this.form.conteo;
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
        "|" +
        conteo +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrReimpfisJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_pdf(data) {
      data.registros.pop();
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.nombre_empresa = this.empresa.descrip_empr;
        data.nit_empresa = parseFloat(this.empresa.id_empr);
        data.direccion_empresa = this.empresa.direccion_empr;
        data.direccion_empresa = this.empresa.direccion_empr;
        data.ciudad_empresa = this.empresa.Ciudad;
        data.email_empresa = this.empresa.email_empr;

        data.fecha_impr = this.$moment().format("YYYY-MM-DD");
        data.hora_impr = this.$moment().format("HH:mm");
        doc_invent_fisico(data).then(() => {
          console.log("Impresión terminada");
        });
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
      let ubicacion = this.form.ubica_orig.codigo_ubic;
      let conteo = this.form.conteo;

      let fecha = this.form.fecha.replace(/\-/g, "");
      if (agencia) {
        this.load.consecutivo = true;

        post
          .postData({
            url: "Dispensa/dlls/PrInvfisicoN.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              ubicacion +
              "|" +
              fecha +
              "|" +
              conteo +
              "|",
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
