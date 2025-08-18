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
              <v-icon size="30" color="blue darken-4 ">mdi-draw</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Orden de Compra</v-list-item-title
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
                    label="Fecha Orden"
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
              <v-col class="d-flex mt-2" cols="6">
                <v-autocomplete
                  label="Proveedor"
                  v-model="form.clientes"
                  :items="clientes"
                  :item-text="format_clientes"
                  clearable
                  hide-details
                  return-object
                  outlined
                  @change="errores.clientes = false"
                  :error="errores.clientes"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider class="mt-2" color="#FF6F00"></v-divider>
            <v-row class="mt-2">
              <v-col class="d-flex" cols="4 ">
                <v-autocomplete
                  outlined
                  label="AgrpMolecula"
                  v-model="form.molecula"
                  :item-text="format_moleculas"
                  :items="moleculas"
                  @change="get_medicamento()"
                  clearable
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  outlined
                  v-model="form.medicamento"
                  :item-text="format_medicam"
                  :items="medicamentos"
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
                      {{ format_medicam(item) }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="px-6 mt-0 justify-left">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Cantidad"
                  v-model="form.cantidad"
                  hide-details
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Vlr_Unitario"
                  v-model="form.unitar"
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
            <v-divider class="d-flex mt-4" color="#FF6F00"></v-divider>
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

                  <template v-slot:item.total_rep="{ item }">
                  {{
                    formatNumero(
                      parseFloat(item.total_rep.toString().replace(/\,/g, ""))
                    )
                  }}
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
            <v-row class="d-flex mb-0" no-gutters>
              <v-col class="mb-0" cols="10">
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
            <v-row class="d-flex mb-3">
              <v-col sm="4" cols="4">
                <v-text-field
                  clearable
                  label="Dirección de entrega"
                  v-model="form.sitioentrega"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickerFechaentr"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaentrega"
                      label="Fecha Entrega"
                      append-icon="event"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaentrega"
                    @input="pickerFechaentr = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-divider class="mt-3 mb-3" color="#FF6F00"></v-divider>
            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="tablaProduccion.datos.length == 0"
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
import { orden_compra } from "../../_formatos_disp.js";

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
      pickerFechaentr: false,
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
      clientes: [],
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
          { text: "Descripción", align: "left", value: "descripc_rep" },
          { text: "Cant.Solicitada", value: "solicita_rep", align: "center" },
          { text: "Vlr_Unit", value: "unitario_rep", align: "center" },
          { text: "Total", value: "total_rep", align: "center" },
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
        clientes: false,
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
    this.get_Clientes();
    this.get_molecula();

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

    borrar_item(item, tabla) {
      let index = this[tabla].datos.indexOf(item);
      this[tabla].datos.splice(index, 1);
    },
    add_item() {
      const index = this.tablaProduccion.datos.length;
      let cantidad = this.form.cantidad ? parseFloat(this.form.cantidad) : 0;
      let vlr_unit = this.form.unitar ? parseFloat(this.form.unitar) : 0;
      let vlr_total = (cantidad * vlr_unit).toFixed(2);

      let totalCantidadTabla = this.tablaProduccion.datos
        .filter((prod) => prod.cod_rep == this.form.molecula.codigo_rep.trim()) // filtra los productos de la tabla con el mismo codigo de la molecula seleccionada
        .reduce((total, prod) => total + prod.solicita_rep, 0); // Suma las cantidades de los productos de ese mismo codigo de la tabla

      if (this.form.medicamento && cantidad > 0 ) {
        this.tablaProduccion.datos.push({
          cod_rep: this.form.medicamento.codprod_rep.trim(),
          descripc_rep: this.form.medicamento.descripprod_rep.trim(),
          id: index + 1,
          solicita_rep: cantidad,
          total_rep: vlr_total,
          unitario_rep: vlr_unit,
        });
        this.form.molecula = null;
        this.form.cantidad = null;
        this.form.unitar = null;
        this.form.medicamento = null;
      }
    },
    async grabar_comprobante() {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.clientes) {
        this.errores.clientes = true;
        this.send_error("Seleccione un proveedor!");
      } else if (this.tablaProduccion.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else {
        this.format_envio(data);
      }
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_envio(data) {
      console.log(data);
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let fecha = data.fecha.replace(/\-/g, "");
      let proveedor = data.clientes.identificacion_rut;
      let consecutivo = data.consecutivo;
      let observacion = data.observacion ? data.observacion.trim() : "";
      let fechaentrega = data.fechaentrega ? data.fechaentrega.replace(/\-/g, "") : "";
      let sitioentr = data.sitioentrega ? data.sitioentrega.trim() : "";      

      let tablaOrigen = {};
      this.tablaProduccion.datos.forEach((item, index) => {
        let cantidad = item.solicita_rep ? parseFloat(item.solicita_rep) : 0;
        let unitario = item.unitario_rep ? parseFloat(item.unitario_rep) : 0;
        if (cantidad > 0) {
          let format_index = (index + 1).toString().padStart(3, "0");
          let codigo = item.cod_rep.trim();
          let observacion = item.observaitem_rep
            ? item.observaitem_rep.trim()
            : "";
          tablaOrigen[
            `DATOJ-${format_index}`
          ] = `${codigo}|${cantidad}|${unitario}|${observacion}|`;
        }
      });

      let importarhtml =
        sesion +
        "|" +
        proveedor +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        observacion +
        "|" +
        fechaentrega +
        "|" +
        sitioentr +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrOCompra.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Orden Registrada Correctamente",
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
      var agencia = "0001";
      let consecutivo = parseFloat(this.comprobante) - 1;
      let fecha = this.form.fecha.substr(0, 4);

      var key = agencia + "|" + consecutivo + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrOrdCompraJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.generar_pdf_2(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async generar_pdf_2(data) {
      let descripcion64 = " ";

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      await orden_compra(data);
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
            url: "Dispensa/dlls/PrOCompraN.dll",
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
    format_medicam(val) {
      return `${val.descripprod_rep}`;
    },
    get_medicamento() {
      if (this.form.molecula) {
        let molecula = this.form.molecula.codigo_rep;
        this.form.medicamento = null;
        this.medicamentos = [];     
        post
          .postData({
            url: "Dispensa/dlls/PrMedicam01J.DLL",
            data:
              sessionStorage.Sesion +
              "|" +
              molecula +
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
      }
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Proveedores",
            estado: true,
          });
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
