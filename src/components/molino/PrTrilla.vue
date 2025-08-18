<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cog-clockwise</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">
                <v-row>
                  <v-col> Proceso de Trilla </v-col>
                  <v-col col="3">
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
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha"
                        @input="dialogPicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col col="3">
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
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex" cols="10" sm="5">
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

              <v-col class="d-flex" cols="4">
                <v-select
                  :items="ubica"
                  label="Ubicación Consumo Paddy Seco"
                  outlined
                  clearable
                  hide-details
                  v-model="form.ubiconsumo"
                  required
                  :item-text="format_ubicacion"
                  return-object
                  @change="add_item()"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center" cols="6">
                <v-btn
                  color="indigo"
                  class="white--text mr-3"
                  large
                  depressed
                  @click="cargar('tablaProduccion')"
                >
                  Producción
                  <v-icon right dark>mdi-debug-step-out</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-center" cols="6">
                <v-btn
                  color="orange"
                  class="white--text mr-3"
                  large
                  depressed
                  @click="cargar('tablaConsumo')"
                >
                  Consumo
                  <v-icon right dark>mdi-debug-step-into</v-icon>
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
                  <template v-slot:body.append>
                    <tr>
                      <td colspan="2" class="text-right">
                        <strong>Totales:</strong>
                      </td>
                      <td class="text-center">
                        {{ formatNumero(total_kilos.prod) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="blue"
                      fab
                      class="white--text mx-auto mr-2"
                      x-small
                      depressed
                      outlined
                      @click="edit_item(item, 'tablaProduccion')"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
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
              <v-divider vertical></v-divider>
              <v-col>
                <v-data-table
                  :headers="tablaConsumo.headers"
                  :items="tablaConsumo.datos"
                  item-key="docinter_rep"
                  single-expand
                >
                  <template v-slot:body.append>
                    <tr>
                      <td colspan="2" class="text-right">
                        <strong>Totales:</strong>
                      </td>
                      <td class="text-center">
                        {{ formatNumero(total_kilos.consumo) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="blue"
                      fab
                      class="white--text mx-auto mr-2"
                      x-small
                      depressed
                      outlined
                      @click="edit_item(item, 'tablaConsumo')"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                      color="red"
                      fab
                      outlined
                      class="white--text mx-auto"
                      x-small
                      depressed
                      @click="borrar_item(item, 'tablaConsumo')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
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
                  :disabled="!form.punto_fact"
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="10" sm="7">
              <v-autocomplete
                label="Producto"
                :items="productos"
                outlined
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo_pr"
                v-model="form.producto_prod"
                :item-text="format_productos"
                @change="calcular_kilos"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
                label="Ubicacion Destino"
                :items="ubica"
                outlined
                clearable
                return-object
                persistent-hint
                required
                item-value="codigo_ubic"
                v-model="form.ubica_prod"
                :item-text="format_ubicacion"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6" sm="5">
              <v-text-field
                label="Cantidad"
                clearable
                outlined
                type="text"
                required
                v-model="form.cantidad_prod"
                hide-details
                @input="calcular_kilos"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Kilos"
                type="number"
                v-model="kgs_produccion"
                disabled
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="(dialogo.estado = false), inicializar_dialogo()"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="agregar_item()"
            >Agregar_x
            <v-icon right dark>mdi-plus</v-icon>
          </v-btn>
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
import { proceso_trilla } from "../../_formatos_mol.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      timeout: null,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
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
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      contenido: [],
      agencias: [],
      prodIndust: [],
      productos: [],
      kgs_produccion: 0,
      prodconsumo: null,
      ubica: [],
      search: "",
      form: {
        kilos: 0,
        cantidad_prod: 0,
        kilos_prod: 0,
      },
      drawer: false,
      detalle: [],
      empresa: [],
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
          {
            text: "Descripción",
            value: "producto.descripcion_pr",
          },
          {
            text: "Cantidad",
            value: "cantidad",
            align: "center",
          },
          {
            text: "Kilos",
            value: "kilos",
            align: "center",
          },
          {
            text: "Ubicación",
            value: "ubicacion",
            align: "center",
          },
          {
            text: "Acción",
            value: "boton",
            align: "center",
          },
        ],
        datos: [],
      },
      tablaConsumo: {
        headers: [
          {
            text: "Descripción",
            value: "producto.descripcion_pr",
          },
          {
            text: "Cantidad",
            value: "cantidad",
            align: "center",
          },
          {
            text: "Kilos",
            value: "kilos",
            align: "center",
          },
          {
            text: "Ubicación",
            value: "ubicacion",
            align: "center",
          },
          {
            text: "Acción",
            value: "boton",
            align: "center",
          },
        ],
        datos: [],
      },
      errores: {
        punto_fact: false,
      },
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      total_kilos: {
        prod: 0,
        consumo: 0,
      },
    };
  },
  watch: {
    "tablaProduccion.datos": function (newVal) {
      if (this.tablaProduccion.datos) {
        const _this = this;
        _this.total_kilos.prod = 0;
        newVal.forEach((el) => {
          _this.total_kilos.prod += parseFloat(el.kilos);
        });

        let cascpaddy_rep = parseFloat(this.contenido[0].cascpaddy_rep);
        this.tablaConsumo.datos = this.tablaConsumo.datos.map((el) => {
          if (el.producto.codigo_pr.trim() === this.prodconsumo.trim()) {
            let valor = _this.total_kilos.prod / ((100 - cascpaddy_rep) / 100);
            el.kilos = valor.toFixed(0);
            el.cantidad = valor.toFixed(0);
          }

          return el;
        });
      }
    },

    "tablaConsumo.datos": function (newVal) {
      const _this = this;
      _this.total_kilos.consumo = 0;
      newVal.forEach((el) => {
        _this.total_kilos.consumo += el.kilos;
      });
    },
  },
  created() {
    this.loader = false;
    this.get_empresa();
    this.get_productos();
    this.cargarTablaAg();
    this.cargarTablaubica();
    this.cargarparametros();
    this.cargarProdIndust();

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    add_item() {
      let ubicacion = this.form.ubiconsumo;
      let producto = null;
      if (ubicacion) {
        producto = this.prodIndust.find(
          (el) => el.codigo_pr.trim() === this.prodconsumo.trim()
        );
        let cod_ubica = ubicacion.codigo_ubic;
        let ubica = ubicacion.descrip_ubic;
        const item = {
          cantidad: "1",
          cod_ubica,
          kilos: 0,
          producto,
          ubicacion: ubica,
        };

        this.tablaConsumo.datos.push(item);
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
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    cargarProdIndust() {
      this.loader = true;
      var soloind = "2";

      post
        .postData({
          url: "Molinos/dlls/CfProdindJ.dll",
          data: sessionStorage.Sesion + "|" + soloind + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            descripcion64 = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            );
            if (descripcion64) {
              el.descripcion_pr = descripcion64;
            } else {
              el.descripcion_pr =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.prodIndust = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar productos Industriales",
            estado: true,
          });
        });
    },
    cargarparametros() {
      this.loader = true;
      post
        .postData({
          url: "Molinos/dlls/CfparamolJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          this.prodconsumo = this.contenido[0].codpaddyseco_rep;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Parametros",
            estado: true,
          });
        });
    },
    edit_item(item, tabla) {
      let index = this[tabla].datos.indexOf(item);
      let obj = {
        producto_prod: item.producto,
        cantidad_prod: item.cantidad,
        kilos_prod: item.kilos,
        ubica_prod: item.cod_ubica,
      };
      var busqueda_producto = this.productos.find(
        (el) => el.codigo_pr == item.producto.codigo_pr
      );
      this.form.producto_prod = busqueda_producto;

      var busqueda_ubicacion = this.ubica.find(
        (el) => el.codigo_ubic == item.cod_ubica
      );
      this.form.ubica_prod = busqueda_ubicacion;
      this.form.cantidad_prod = item.cantidad;
      this.kgs_produccion = item.kilos;

      // this.form = obj;
      this.dialogo.estado = true;
      this.dialogo.tipo = 2;
      this.dialogo.index = index;
      this.dialogo.tabla = tabla;
    },
    borrar_item(item, tabla) {
      let index = this[tabla].datos.indexOf(item);
      this[tabla].datos.splice(index, 1);
    },
    calcular_kilos() {
      let producto = this.form.producto_prod;

      if (producto) {
        let { unidad_pr } = producto;
        unidad_pr = parseInt(unidad_pr.replace(/\,/g, "").trim());
        let cantidad = this.form.cantidad_prod || 0;
        let kilos = unidad_pr * cantidad;
        kilos = parseInt(kilos);
        this.kgs_produccion = kilos;
      } else this.form.kilos_prod = 0;
    },
    agregar_item() {
      let data = this.form;
      let { tipo, tabla, index } = this.dialogo;

      let item = {
        producto: data.producto_prod,
        cantidad: data.cantidad_prod,
        kilos: this.kgs_produccion || 0,
        cod_ubica: data.ubica_prod.codigo_ubic,
        ubicacion: data.ubica_prod.descrip_ubic,
      };

      let copy = JSON.parse(JSON.stringify(this[tabla].datos));
      if (tipo == 1) copy.push(item);
      else if (tipo == 2) copy[index] = item;

      this[tabla].datos = [];
      this[tabla].datos = copy;

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
    cargar(tabla) {
      console.log("cargar",tabla)

      this.dialogo.estado = true;
      this.dialogo.tipo = 1;
      this.dialogo.tabla = tabla;
      // this.form.producto_prod = null;
      // this.form.ubica_prod = null;
      this.form.cantidad_prod = 0;
      this.form.kilos_prod = 0;
    },
    grabar_comprobante() {
      if (this.tablaProduccion.datos.length){
      var data = this.form;
      this.get_plano().then((plano) => {
        let sesion = sessionStorage.Sesion;
        let agencia = data.punto_fact.codigo_agc;
        let fecha = data.fecha.replace(/\-/g, "");
        let consecutivo = data.consecutivo.trim();
        let datosEnvio = [sesion, agencia, fecha, consecutivo, plano];
        this.postData({
          url: "Molinos/dlls/PrTrilla.dll",
          data: datosEnvio.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: "Proceso guardado correctamente",
              estado: true,
            });
            this.get_consecutivo();
            this.disabled.imprimir = false;
            this.disabled_btn_grabar = true;
            this.tablaProduccion.datos = [];
          })
          .catch((err) => {
            this.send_error("Error al grabar Trilla");
            this.disabled_btn_grabar = false;
          });
      });
    }else{
      this.send_error("No hay produccion para grabar");
    }
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
            tipo: 1,
          })
        );

        tablaConsumo.forEach((el) =>
          detalle.push({
            producto: el.producto.codigo_pr.trim(),
            cantidad: el.cantidad,
            ubicacion: el.cod_ubica,
            tipo: 2,
          })
        );

        var formData = new FormData();
        formData.append("tipo", "prProd");
        formData.append("data", JSON.stringify(detalle));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
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
    get_impresion() {
      var data = this.form;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo.trim();
      let datosEnvio = [sesion, agencia, fecha, "E61", consecutivo];
      this.postData({
        url: "Molinos/dlls/PrImpInd01J.dll",
        data: datosEnvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          let dataParse = JSON.parse(JSON.stringify(data))[0];
          let registros = dataParse.registros.map((el) => {
            el.producto_rep = el.base1_pr
              ? window.atob(
                  el.base1_pr.trim() +
                    el.base2_pr.trim() +
                    el.base3_pr.trim() +
                    el.base4_pr.trim() +
                    el.base5_pr.trim()
                )
              : el.producto_rep;
            return el;
          });

          dataParse.registros = registros;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataParse.logo = logo;
            proceso_trilla(dataParse).then((res) => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          this.send_error("Error al Imprimir Trilla");
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
      var agencia = this.form.punto_fact;
      if (agencia) {
        this.load.consecutivo = true;
        var fecha = this.form.fecha.replace(/\-/g, "");
        post
          .postData({
            url: "financiero/dlls/PrConsecutivoJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              "13" +
              "|" +
              agencia.codigo_agc +
              "|" +
              "E61" +
              "|" +
              1 +
              "|" +
              fecha +
              "|",
            method: "POST",
          })
          .then((data) => {
            this.load.consecutivo = false;
            this.form.consecutivo = data[0].nro_cons;
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
    get_productos() {
      post
        .postData({
          url: "Ptovta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            descripcion64 = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            );
            if (descripcion64) {
              el.descripcion_pr = descripcion64;
            } else {
              el.descripcion_pr =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.productos = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar los productos",
            estado: true,
          });
        });
    },
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_pr.trim()}`;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    calcular_kgs_prod() {
      const _this = this;
      _this.total_kilos.prod = 0;
      newVal.forEach((el) => {
        _this.total_kilos.prod += parseFloat(el.kilos);
      });

      let cascpaddy_rep = parseFloat(this.contenido[0].cascpaddy_rep);
      this.tablaConsumo.datos = this.tablaConsumo.datos.map((el) => {
        if (el.producto.codigo_pr.trim() === this.prodconsumo.trim()) {
          let valor = _this.total_kilos.prod / ((100 - cascpaddy_rep) / 100);
          el.kilos = valor.toFixed(0);
          el.cantidad = valor.toFixed(0);
        }

        return el;
      });
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
