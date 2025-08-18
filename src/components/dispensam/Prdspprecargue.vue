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
                >mdi-invoice-export-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Precargue de Pedido Puntos Dispensación</v-list-item-title
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
        <v-row>
          <v-col class="d-flex" sm="2">
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
                  v-model="form.fechaInicial"
                  label="Periodo Inicial Análisis"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaInicial"
                scrollable
                no-title
                type="month"
                :error="errores.fechaInicial"
                @change="pickeFechaIni = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" sm="2">
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
                  v-model="form.fechaFinal"
                  label="Periodo Final Análisis"
                  outlined
                  v-on="on"
                  hide-details
                  :error="errores.fechaFinal"
                  @change="errores.nroentrega = false"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaFinal"
                scrollable
                no-title
                type="month"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
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
              @change="get_consumos(), (errores.ubica_orig = false)"
              :item-text="format_ubicacion"
              :error="errores.ubica_orig"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="3" offset="4">
            <v-text-field
              label="Saldo Actual Destino"
              v-model="form.saldosolic"
              hide-details
              type="text"
              disabled
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="3" offset="1">
            <v-text-field
              label="Saldo Origen"
              v-model="form.saldo"
              hide-details
              type="number"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>

            <v-row class="ml-2 mt-2 justify-center">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="AgrpMolecula"
                  v-model="form.molecula"
                  :item-text="format_moleculas"
                  :items="moleculas"
                  clearable
                  return-object
                  @change="get_saldo_orig(1), get_saldo_orig(2)"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Cantidad"
                  v-model="form.cantidad"
                  hide-details
                  type="text"
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
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="searchprod"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-data-table
                  :headers="tablaProduccion.headers"
                  :items="tablaProduccion.datos"
                  single-expand
                >
                  <template v-slot:item.observaitem_rep="props">
                    <v-edit-dialog
                      :return-value.sync="props.item.observaitem_rep"
                    >
                      {{ props.item.observaitem_rep }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.observaitem_rep"
                          label="Editar Observacion"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                    <hr color="red" />
                  </template>

                  <template v-slot:item.boton="{ item }">
                    <!-- <v-btn
                      color="green"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="editar_item(item, 'tablaProduccion')"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn> -->
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
                  <!-- <template v-slot:item.solicita_rep="props">
                    <v-edit-dialog :return-value.sync="props.item.solicita_rep">
                      {{ props.item.solicita_rep }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.solicita_rep"
                          label="Cantidad Solicitada"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                    <hr color="orange" />
                  </template>
                  <template v-slot:item.observaitem_rep="props">
                    <v-edit-dialog
                      :return-value.sync="props.item.observaitem_rep"
                    >
                      {{ props.item.observaitem_rep }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.observaitem_rep"
                          label="Observacion"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                    <hr color="orange" />
                  </template> -->
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
      <v-dialog v-model="dialogoitem.estado" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row class="ml-2 justify-center">
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    disabled
                    v-model="editedItem.saldoorig_rep"
                    label="Saldo Actual"
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="6">
                  <v-text-field
                    v-model="editedItem.solicita_rep"
                    label="Cantidad Solicitada"
                    @keyup.enter="focusNextField('observaitem_rep')"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-text-field
                    v-model="editedItem.observaitem_rep"
                    @keyup.enter="focusNextField('guardar')"
                    label="Observación"
                    id="observaitem_rep"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close_item">
              Cancelar
            </v-btn>
            <v-btn
              color="green darken-1"
              class="white--text"
              id="guardar"
              @click="grabar_item"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { precargue } from "../../_formatos_disp.js";

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
      dialogoitem: {
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
      pickeFechaIni: false,
      pickerFechaFinal: false,
      singleExpand: true,
      pickerPeriodo: false,
      error_saldo: 0,
      edit_index: 0,
      contenido: [],
      agencias: [],
      medicamentos: [],
      moleculas: [],
      ubicasolic: [],
      ubica: [],
      formTitle: "",
      search: "",
      searchprod: null,
      form: {
        saldo: 0,
        cant_edit: 0,
        saldosolic: 0,
        cantidad: 0,
        lote: 0,
        fechavence: this.$moment().format("YYYY-MM-DD"),
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      drawer: false,
      detalle: [],
      empresa: [],
      valida_productos: [],

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
          { text: "Codigo", align: "left", value: "cod_rep" },
          { text: "Descripción", align: "left", value: "descripc_rep" },
          { text: "Consumo", value: "cant_rep", align: "center" },
          {
            text: "Saldo Actual Solicita",
            value: "saldo_rep",
            align: "center",
          },
          {
            text: "Saldo Actual Despacho",
            value: "saldoorig_rep",
            align: "center",
          },

          { text: "Cant.Solicitada", value: "solicita_rep", align: "center" },
          { text: "Observacion", value: "observaitem_rep", align: "center" },
          { text: "Acción", value: "boton", align: "center" },
        ],
        datos: [],
      },
      editedItem: {
        descripc_rep: "",
        cant_rep: 0,
        saldo_rep: 0,
        saldoorig_rep: 0,
        solicita_rep: 0,
        observaitem_rep: 0,
      },
      errores: {
        punto_fact: false,
        lote: false,
        fechaInicial: false,
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
    this.cargarTablaubica();

    this.form = {
      fecha: this.$moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    editar_item(item) {
      this.editedIndex = this.tablaProduccion.datos.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.dialogoitem.estado = true;
      this.formTitle = item.observaitem_rep;
    },

    close_item() {
      this.dialogoitem.estado = false;
    },
    grabar_item() {
      if (
        parseFloat(this.editedItem.saldoorig_rep) <
        parseFloat(this.editedItem.solicita_rep)
      ) {
        this.send_error("Error en Cantidad Solicitada!!");
      } else {
        Object.assign(
          this.tablaProduccion.datos[this.editedIndex],
          this.editedItem
        );
        this.dialogoitem.estado = false;
      }
    },
    get_consumos() {
      let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let destino = this.form.ubica_destino;
      let origen = this.form.ubica_orig;
      this.tablaProduccion.datos = [];
      post
        .postData({
          url: "Dispensa/dlls/PrPrecargue02J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaInicial +
            "|" +
            fechaFinal +
            "|" +
            destino +
            "|" +
            origen +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.tablaProduccion.datos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consumos",
            estado: true,
          });
        });
    },
    get_saldo_orig(tipo) {
      let ubicacion = "";
      if (this.form.molecula) {
        if (tipo == 1) {
          ubicacion = this.form.ubica_orig;
        } else {
          ubicacion = this.form.ubica_destino;
        }
        let medicamento = this.form.molecula.codigo_rep.trim();
        post
          .postData({
            url: "Dispensa/dlls/RpSdoPrecJ.dll",
            data:
              sessionStorage.Sesion + "|" + ubicacion + "|" + medicamento + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            let saldo = 0;
            if (tipo == 1) {
              saldo = data[0].cant_rep.trim();
              this.form.saldo = parseFloat(saldo);
            } else {
              this.form.saldosolic = data[0].cant_rep.trim();
            }
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
          this.ubicasolic = data;
          var filtro = data.filter(
            (el) => el.codigo_ubic == this.empresa.agencia_empr
          );
          this.ubica = filtro;
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
    borrar_item(item, tabla) {
      let index = this[tabla].datos.indexOf(item);
      this[tabla].datos.splice(index, 1);
    },
    add_item() {
      let index = this.tablaProduccion.datos.length;
      let saldo = parseFloat(this.form.saldo);
      let cantidad = this.form.cantidad ? parseFloat(this.form.cantidad) : 0;
      let codigo = this.form.molecula.codigo_rep

      let totalCantidadTabla = this.tablaProduccion.datos
        .filter((prod) => prod.cod_rep == this.form.molecula.codigo_rep.trim()) // filtra los productos de la tabla con el mismo codigo de la molecula seleccionada
        .reduce((total, prod) => total + prod.solicita_rep, 0); // Suma las cantidades de los productos de ese mismo codigo de la tabla


      let find_Index = this.tablaProduccion.datos.findIndex(
        (el) => el.cod_rep === codigo
      );

      if (cantidad == 0 || totalCantidadTabla + cantidad > saldo) {
        this.send_error("Error en Cantidad Solicitada!");
      } else {
        if (this.form.molecula) {
          if (find_Index !== -1) {
            this.tablaProduccion.datos[find_Index].solicita_rep = cantidad;
          } else {
            this.tablaProduccion.datos.push({
              cod_rep: this.form.molecula.codigo_rep.trim(),
              descripc_rep: this.form.molecula.descripcion_rep.trim(),
              id: index + 1,
              solicita_rep: cantidad,
            });
          }
          this.form.molecula = null;
          this.form.cantidad = null;
        }
      }
    },
    async grabar_comprobante() {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Fecha Inicial y Final Obligatoria!");
      } else if (this.tablaProduccion.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else if (!data.ubica_orig) {
        this.errores.ubica_orig = true;
        this.send_error("Ubicación de Origen sin Seleccionar!");
      } else if (!data.ubica_destino) {
        this.errores.ubica_destino = true;
        this.send_error("Ubicación de Destino sin Seleccionar!");
      } else if (this.disabled.error_saldo) {
        this.send_error("Saldos incorrectos");
      } else {
        this.format_envio(data);
      }
    },

    async validar_saldos() {
      this.valida_productos = [];
      let productos = this.tablaProduccion.datos;
      this.valida_productos = productos;

      productos.forEach((objeto, index) => {
        let solicita = parseFloat(objeto.solicita_rep);
        let descripcion = objeto.descripc_rep.trim();
        if (objeto.saldoorig_rep == 0 && solicita > 0) {
          this.disable_grabar = 1;
          this.valida_productos[index].novalidado = true;
          let msg = "Sin Saldo para Despachar " + descripcion;
          this.send_error(msg);
          this.disabled.error_saldo = true;
        } else if (solicita > 0) {
          if (this.error_saldo == 1) {
            this.disabled.error_saldo = true;
            let msg = "Error en Saldo para Despachar ";
            this.send_error(msg);
          } else {
            let ubicacion = this.form.ubica_orig;
            let medicamento = objeto.cod_rep.substr(0, 18);
            let descr_med = objeto.descripc_rep;
            let saldo_actual = 0;
            let error_sdo = 0;
            post
              .postData({
                url: "Dispensa/dlls/RpSdoPrecJ.dll",
                data:
                  sessionStorage.Sesion +
                  "|" +
                  ubicacion +
                  "|" +
                  medicamento +
                  "|",
                method: "",
              })
              .then((data) => {
                saldo_actual = parseFloat(data[0].cant_rep);
                if (saldo_actual < solicita) {
                  this.disabled.error_saldo = true;
                  this.error_saldo = 1;
                  this.valida_productos[index].novalidado = true;
                  let msg = "Sin Saldo para Despachar " + descripcion;
                  this.send_error(msg);
                }
              })
              .catch((err) => {
                return { error_sdo: 1 };
              });
          }
        }
      });
    },

    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = sessionStorage.Sede;
      let origen = data.ubica_orig;
      let destino = data.ubica_destino;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let perini = data.fechaInicial.replace(/\-/g, "");
      let perfin = data.fechaFinal.replace(/\-/g, "");
      let observacion = data.observacion ? data.observacion.trim() : "";

      let tablaOrigen = {};
      this.tablaProduccion.datos.forEach((item, index) => {
        let cantidad = item.solicita_rep ? parseFloat(item.solicita_rep) : 0;
        if (cantidad > 0) {
          let format_index = (index + 1).toString().padStart(3, "0");
          let codigo = item.cod_rep.trim();
          let observacion = item.observaitem_rep
            ? item.observaitem_rep.trim()
            : "";
          tablaOrigen[
            `DATOJ-${format_index}`
          ] = `${codigo}|${cantidad}|${observacion}|`;
        }
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
        perini +
        "|" +
        perfin +
        "|" +
        observacion +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrPrecargue.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Precargue Registrado Correctamente",
            estado: true,
          });
          this.disabled.error_saldo = true;

          this.card_estado = false;
          this.dialogo.estado = false;
          this.contenido = JSON.parse(JSON.stringify(data));

          this.disabled.imprimir = false;
          this.load.imprimir = false;
          this.comprobante = data[0].nro;
          this.get_consecutivo();
          this.tablaProduccion.datos = [];
          this.form.producto = null;
          this.form.observacion = null;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    async get_impresion() {
      let agencia = sessionStorage.Sede;
      let consecutivo = parseFloat(this.comprobante) - 1;

      var key = agencia + "|" + consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrPrecargue01J.dll",
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
            precargue(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
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
      let agencia = this.empresa.agencia_empr;
      if (agencia) {
        this.load.consecutivo = true;

        post
          .postData({
            url: "Dispensa/dlls/PrPrecargueN.dll",
            data: sessionStorage.Sesion + "|" + agencia + "|",
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
          this.get_consecutivo();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
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
    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
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
