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
                >mdi-calculator-variant-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Hoja de Gastos Cirugía</v-list-item-title
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
            <v-row class="mt-2 d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  @keyup.enter="buscar_paciente()"
                  type="number"
                  required
                  v-model="form.id_numero"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="buscar_paciente()"
                  >Buscar</v-btn
                >
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-text-field
                  label="Descripcion Paciente"
                  outlined
                  disabled
                  v-model="form.descripaciente"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>


            <v-row class="mt-2 d-flex justify-center" no-gutters>
              <v-col class="d-flex justify-center mb-3" cols="4">
                <v-btn
                  color="organge"
                  class="white--text mr-3"
                  large
                  depressed
                  @click="cargar('tablaConsumo')"
                >
                  Seleccionar Productos
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>

              <v-col>
                <v-data-table
                  :headers="tablaConsumo.headers"
                  :items="tablaConsumo.datos"
                  item-key="docinter_rep"
                  single-expand
                >
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
              <v-col class="pa-0 px-0 mt-3 mr-6" sm="3">
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

  created() {
    this.loader = false;
    this.get_empresa();
    this.get_productos();

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
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

    agregar_item() {
      let data = this.form;
      let item = {
        producto: data.producto_prod,
        cantidad: data.cantidad_prod,
      };

      this.tablaConsumo.datos.push(item);

      this.dialogo = {
        estado: false,
        tipo: null,
        index: null,
        tabla: null,
      };

      this.form.producto_prod = null;
      this.form.cantidad_prod = null;
    },
    cargar(tabla) {
      this.dialogo.estado = true;
      this.dialogo.tipo = 1;
      this.dialogo.tabla = tabla;
    },

    inicializar_dialogo() {
      this.dialogo = {
        estado: false,
        tipo: null,
        index: null,
        tabla: null,
      };
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

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    buscar_paciente() {
      let paciente = this.form.id_numero.trim();

      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.paciente = data[0];
          this.form.descripaciente = this.paciente.descrip_rep.trim();
          this.dialogo.paciente = this.paciente.descrip_rep.trim();
          this.tab = 0;
          this.dialogo.estado = true;
        })
        .catch((err) => {
          console.log(err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
  },
};
</script>
