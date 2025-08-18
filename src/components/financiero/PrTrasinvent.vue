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
                >mdi-application-export</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Traslados de Mercancías</v-list-item-title
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
              <v-col class="d-flex" cols="12" sm="2">
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
            <v-row>
              <v-col class="d-flex justify-center" cols="4">
                <v-autocomplete
                  label="Ubicacion Origen"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="form.ubica_orig"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex justify-center" cols="4">
                <v-btn
                  color="indigo"
                  class="white--text mr-3"
                  large
                  depressed
                  @click="cargar('tablaConsumo')"
                >
                  Seleccionar Productos
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-center" cols="4">
                <v-autocomplete
                  label="Ubicacion Destino"
                  :items="ubica"
                  outlined
                  clearable
                  persistent-hint
                  required
                  item-value="codigo_ubic"
                  v-model="form.ubica_dest"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center font-weight-bold">
                Salida de Productos
              </v-col>
              <v-col class="text-center font-weight-bold">
                Entrada de Producto
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
                  <!-- <template v-slot:body.append>
                    <tr>
                      <td colspan="2" class="text-right">Totales:</td>
                      <td class="text-center">
                        {{ total_kilos.prod }}
                      </td>
                      <td></td>
                    </tr>
                  </template> -->
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
                  <!-- <template v-slot:body.append>
                    <tr>
                      <td colspan="2" class="text-right">Totales:</td>
                      <td class="text-center">
                        {{ total_kilos.consumo }}
                      </td>
                      <td></td>
                    </tr>
                  </template> -->
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
                  </template></v-data-table
                >
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
            <!-- <v-col>
              <v-autocomplete
                label="Ubicacion"
                :items="ubica"
                outlined
                clearable
                persistent-hint
                required
                item-value="codigo_ubic"
                v-model="form.ubica_prod"
                :item-text="format_ubicacion"
              ></v-autocomplete>
            </v-col> -->
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
            <!-- <v-col class="d-flex" cols="6" sm="4">
              <v-text-field
                label="Kilos"
                clearable
                outlined
                type="text"
                required
                v-model="form.kilos_prod"
                disabled
                hide-details
              ></v-text-field>
            </v-col> -->
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
            >Agregar
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
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      contenido: [],
      agencias: [],
      productos: [],
      ubica: [],
      search: "",
      form: [],
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
          // {
          //   text: "Kilos",
          //   value: "kilos",
          //   align: "center",
          // },
          {
            text: "Ubicación",
            value: "ubica_prod",
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
          // {
          //   text: "Kilos",
          //   value: "kilos",
          //   align: "center",
          // },
          {
            text: "Ubicación",
            value: "ubica_prod",
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
      comprobante: null,
    };
  },
  watch: {
    "tablaProduccion.datos": function (newVal) {
      const _this = this;
      _this.total_kilos.prod = 0;
      newVal.forEach((el) => {
        _this.total_kilos.prod += el.kilos;
      });
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

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
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
    calcular_kilos() {
      let producto = this.form.producto_prod;

      if (producto) {
        let { unidad_pr } = producto;
        let cantidad = this.form.cantidad_prod || 0;

        let kilos = parseFloat(unidad_pr) * cantidad;
        this.form.kilos_prod = kilos;
      } else this.form.kilos_prod = 0;
    },
    agregar_item() {
      let data = this.form;
      let { tipo, tabla, index } = this.dialogo;

      let item = {
        producto: data.producto_prod,
        cantidad: data.cantidad_prod,
        kilos: data.kilos_prod || 0,
        cod_ubica: data.ubica_prod,
        ubica_prod: data.ubica_prod,
      };

      let ubicacion_origen = this.form.ubica_orig;
      let ubicacion_destino = this.form.ubica_dest;

      let item2 = JSON.parse(JSON.stringify(item));
      item2.ubica_prod = ubicacion_origen;
      item.ubica_prod = ubicacion_destino;

      let copy = JSON.parse(JSON.stringify(this[tabla].datos));
      if (tipo == 1) {
        this.tablaConsumo.datos.push(item);

        this.tablaProduccion.datos.push(item2);
      } else if (tipo == 2) {
        copy[index] = item;
        this[tabla].datos = [];
        this[tabla].datos = copy;
      }

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
      this.dialogo.estado = true;
      this.dialogo.tipo = 1;
      this.dialogo.tabla = tabla;
    },
    grabar_comprobante: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Fecha Obligatoria!");
      } else if (this.tablaConsumo.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.punto_fact.codigo_agc;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo.trim();

      let tablaOrigen = {};
      this.tablaProduccion.datos.forEach((item, index) => {
        let format_index = (index + 100 + 1).toString().padStart(3, "0");
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `1|${item.producto.codigo_pr}|${item.cantidad}|${item.ubica_prod}|`;
      });

      let tablaDestino = {};
      this.tablaConsumo.datos.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        tablaDestino[
          `DATOJ-${format_index}`
        ] = `2|${item.producto.codigo_pr}|${item.cantidad}|${item.ubica_prod}|`;
      });

      let importarhtml =
        sesion + "|" + agencia + "|" + consecutivo + "|" + fecha + "|";
      let datos = {
        url: "Ptovta/dlls/PrTrasInv.dll",
        data: { importarhtml, ...tablaOrigen, ...tablaDestino },
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
    async get_impresion(item) {
      let comprobante = this.comprobante;
      await this.imprimir_documento(comprobante);

      let arr = comprobante.split("|");
      arr[0] = arr[0].replace("E", "S");

      await this.imprimir_documento(arr.join("|"));
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
              "3" +
              "|" +
              agencia.codigo_agc +
              "|" +
              "E51" +
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
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          var data_parse = JSON.parse(JSON.stringify(data));
          data_parse.map((el, index) => {
            el.descripcion64 = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            );
            if (el.descripcion64) {
              el.descripcion_pr = el.descripcion64;
            }
            el.index = index;
            return el;
          });

          this.productos = data_parse;

          // this.productos = data;
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
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    async imprimir_documento(comprobante) {
      var sesion = sessionStorage.Sesion;
      var datosEnvio = sesion + "|" + comprobante;
      await post
        .postData({
          url: "Ptovta/dlls/PrReimpinvj.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data.pop();
          let factura = data;
          factura = factura.map((item) => {
            item.registros.pop();
            item.registros = item.registros.map((el) => {
              let nombre64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim()
              );

              if (nombre64) el.producto = nombre64;
              return el;
            });
            return item;
          });

          await this.print_doc(factura[0]);
        })
        .catch((err) => {
          console.error("error", err);
          this.send_error("Ha ocurrido un error durante la impresión");
        });
    },
    async print_doc(item) {
      var data = JSON.parse(JSON.stringify(item));
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      await this.pdfs.getBase64(logo_src).then(async (logo) => {
        data.logo = logo;
        data.fecha_impr = this.$moment().format("YYYY-MM-DD");
        0;
        data.hora_impr = this.$moment().format("HH:mm");
        if (item.toper.trim() == "E51" || item.toper.trim() == "S51") {
          await comprobantes_inv_pos(data).then(() => {
            console.log("Impresión terminada");
          });
        } else {
          await comprobantes_inv(data).then(() => {
            console.log("Impresión terminada");
          });
        }
      });
    },
  },
};
</script>
