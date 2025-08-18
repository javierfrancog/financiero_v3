<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-chemical-weapon</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Actualizar Comprobante</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
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
                      v-model="form.fecha_doc"
                      label="Fecha"
                      append-icon="event"
                      outlined
                      v-on="on"
                      @change="getBloqueo()"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_doc"
                    @input="dialogPicker = false"
                    @change="
                      getBloqueo(),
                        (form.tipoDocumento = null),
                        (error.tipoDocumento = false)
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Tipo Documento"
                  v-model="form.tipoDocumento"
                  :items="docc"
                  :item-text="format_docc"
                  hide-details
                  return-object
                  outlined
                  clearable
                  @change="
                    get_comprobantes();
                    error.tipoDocumento = false;
                  "
                  :error="error.tipoDocumento"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Consecutivos"
                  clearable
                  outlined
                  type="text"
                  :items="consecutivos"
                  item-value="consecutivo"
                  :item-text="format_consecutivos"
                  v-model="form.consecutivo"
                  :loading="loader.consecutivo"
                  @change="cargar_tabla"
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Comprobante</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="
                    dialogo.estado = true;
                    dialogo.titulo = 'Agregar comprobante';
                  "
                  depressed
                  :disabled="!form.tipoDocumento"
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Usar Conceptos
                </v-btn>
              </v-col>
            </v-row>
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
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                :expanded.sync="expanded"
                item-key="key"
                hide-default-footer
                disable-pagination
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4">
                    <b>Detalle:</b>
                    {{ item.detalle }}
                  </td>
                </template>
                <template v-slot:item.index="{ item }">
                  {{ detalle.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.debitos="{ item }">{{
                  formatNumero(item.debitos)
                }}</template>
                <template v-slot:item.creditos="{ item }">{{
                  formatNumero(item.creditos)
                }}</template>
                <template v-slot:body.append>
                  <tr>
                    <td colspan="4" class="text-right">
                      <v-btn
                        @click="add_item"
                        depressed
                        color="primary"
                        :disabled="!form.tipoDocumento"
                        >Agregar item</v-btn
                      >
                    </td>
                    <td colspan="1" class="text-right">
                      <strong>TOTALES</strong>
                    </td>
                    <td></td>
                    <td class="text-xs-right text-right">
                      <strong>{{
                        formatNumero(detalleTotales.debitos.toFixed(2))
                      }}</strong>
                    </td>
                    <td colspan="1" class="text-right"></td>
                    <td class="text-xs-right text-right">
                      <strong>{{
                        formatNumero(detalleTotales.creditos.toFixed(2))
                      }}</strong>
                    </td>
                  </tr>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red darken-4"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="deleteItem(item)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar item</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="editItem(item)"
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar item</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
        <v-divider color="#FF6F00"></v-divider>
        <v-card-actions>
          <v-row class="d-flex justify-end col-12">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="light-blue accent-4 white--text"
                  class
                  @click="
                    cargarTablaruts(),
                      cargarTablaconceptos(),
                      cargarTablaccostos(),
                      cargarTablactas()
                  "
                  depressed
                >
                  <v-icon size="30" center>mdi-autorenew</v-icon>
                </v-btn>
              </template>
              <span>Actualiza Tablas</span>
            </v-tooltip>
            <v-spacer></v-spacer>

            <v-tooltip
              bottom
              v-if="
                form.tipoDocumento && form.tipoDocumento.codigo_docc == '001'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="amber accent-4 white--text"
                  class
                  @click="dialogo_csv.estado = true"
                  depressed
                >
                  <v-icon size="30" center
                    >mdi-arrow-up-bold-circle-outline</v-icon
                  >
                </v-btn>
              </template>
              <span>Cargar CSV</span>
            </v-tooltip>

            <v-spacer></v-spacer>

            <v-col class="pa-0 px-0 mr-4" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                @click="grabar_registro"
                :loading="loader.btn_grabar"
                :disabled="disabled.btn_grabar"
                >Guardar registro</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                @click="get_impresion"
                :loading="loader.btn_imprimir"
                :disabled="disabled.btn_imprimir"
                >Imprimir registro</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
        <v-divider color="#FF6F00"></v-divider>
      </v-card>
    </v-flex>
    <v-overlay :value="loaderspiner">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogoEditar.estado" persistent max-width="600">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">{{ dialogoEditar.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form>
            <div class="pa-2 px-0">
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Código de cuenta"
                    v-model="comprobanteEditar.cuentaContable"
                    :items="cuentasContables"
                    :item-text="format_cuentac"
                    item-value="cod_puc"
                    hide-details
                    return-object
                    outlined
                    @change="validarFacturas"
                  ></v-autocomplete>
                  <!-- <v-text-field
                    label="Código de cuenta"
                    v-model="comprobanteEditar.codCuenta"
                    outlined
                    type="number"
                    hide-details
                    ref="inputIva"
                  ></v-text-field>-->
                </v-col>
              </v-row>
              <!-- <v-row>
                <v-col class="d-flex" cols="12">
                  <v-text-field
                    label="Descripción de cuenta"
                    v-model="comprobanteEditar.descripCuenta"
                    outlined
                    type="text"
                    hide-details
                    ref="inputIva"
                  ></v-text-field>
                </v-col>
              </v-row>-->
              <v-row sm="12">
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Rut"
                    v-model="comprobanteEditar.rut"
                    :items="tablaruts"
                    :item-text="format_ruts"
                    hide-details
                    return-object
                    outlined
                    clearable
                    :error="error.rut"
                    @change="
                      error.rut = false;
                      get_facturas2();
                      validar_ctr();
                    "
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex align-center mx-auto" cols="6">
                  <v-text-field
                    label="Nro_Documento"
                    outlined
                    v-model="comprobanteEditar.documento"
                    hide-details
                    type="text"
                    required
                    :error="error.documento"
                    @change="error.documento = false"
                    :disabled="mostrarSelectFacturas"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex pb-0" cols="6">
                  <v-menu
                    ref="menu"
                    v-model="pickerVence"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    required
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        label="Fecha Vencimiento"
                        outlined
                        v-model="comprobanteEditar.fvence"
                        hide-details
                        v-on="on"
                        :error="error.fechavence"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="comprobanteEditar.fvence"
                      @input="pickerVence = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col
                  class="d-flex align-center mx-auto"
                  cols="6"
                  v-if="showBaseRetencion"
                >
                  <v-text-field
                    label="Base Retención"
                    outlined
                    v-model="comprobanteEditar.baserte"
                    hide-details
                    type="number"
                    required
                    @input="calcularBaseRetencion"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="d-flex align-center mx-auto"
                  cols="12"
                  v-if="mostrarSelectFacturas"
                >
                  <v-autocomplete
                    label="Facturas pendientes x 1"
                    v-model="comprobanteEditar.facturas"
                    :items="facturasPendientes"
                    :item-text="format_factPendientes"
                    hide-details
                    return-object
                    outlined
                    :loading="loader.facturas"
                    chips
                    small-chips
                    :error="error.facturas"
                    @change="
                      error.facturas = false;
                      asignar_faacturaModificar();
                    "
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="6">
                  <v-text-field
                    label="Débitos"
                    outlined
                    type="text"
                    required
                    v-model="comprobanteEditar.debitos"
                    suffix="$"
                    hide-details
                    ref="inputDebitos"
                    :disabled="disabled.debitos"
                    v-on:input="
                      formatInputEditar('debitos');
                      validar_debito();
                    "
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="6">
                  <v-text-field
                    label="Créditos"
                    outlined
                    type="text"
                    required
                    v-model="comprobanteEditar.creditos"
                    v-on:input="
                      formatInputEditar('creditos');
                      validar_credito();
                    "
                    suffix="$"
                    hide-details
                    ref="inputCreditos"
                    :disabled="disabled.creditos"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-textarea
                    label="Detalle"
                    outlined
                    v-model="comprobanteEditar.detalle"
                    counter="60"
                    max
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Centro de costos"
                    v-model="comprobanteEditar.ccosto"
                    :items="tablaccosto"
                    :item-text="format_ccosto"
                    hide-details
                    return-object
                    outlined
                    :error="error.ccosto"
                    @change="error.ccosto = false"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-card-actions>
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="
                    cargarTablaruts(),
                      cargarTablaconceptos(),
                      cargarTablaccostos(),
                      cargarTablactas()
                  "
                  depressed
                >
                  <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class
            color="red"
            text
            @click="
              dialogoEditar.estado = false;
              initModificar();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ml-2"
            color="green darken-1"
            depressed
            dark
            text
            @click="guardarModificar"
            >Modificar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado" persistent max-width="600">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="formComprobante">
            <v-col class="pa-2 px-0">
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Concepto Contable"
                    v-model="comprobante.conc_conta"
                    :items="conceptosc"
                    :item-text="format_conceptos"
                    hide-details
                    return-object
                    outlined
                    clearable
                    :error="error.conc_conta"
                    @change="
                      error.conc_conta = false;
                      getDetalleConcepto();
                      comprobante.rut = null;
                      facturasPendientes = [];
                    "
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <div
                v-if="
                  comprobante.conc_conta
                    ? comprobante.conc_conta.codigo_conc == '0001'
                    : false
                "
              >
                <v-row sm="12">
                  <v-col class="d-flex mx-auto" cols="6">
                    <v-autocomplete
                      label="Cantidad de registros"
                      v-model="comprobante.cantidadItems"
                      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </div>
              <div
                v-if="
                  comprobante.conc_conta
                    ? comprobante.conc_conta.codigo_conc != '0001'
                    : true
                "
              >
                <v-row sm="12">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Rut"
                      v-model="comprobante.rut"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      hide-details
                      return-object
                      outlined
                      :error="error.rut"
                      @change="
                        error.rut = false;
                        get_facturas();
                      "
                      :disabled="comprobante.conc_conta ? false : true"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    class="d-flex align-center mx-auto"
                    cols="6"
                    v-if="
                      comprobante.conc_conta
                        ? comprobante.conc_conta.cartera_conc == '0'
                        : false
                    "
                  >
                    <v-text-field
                      label="Documento"
                      clearable
                      outlined
                      v-model="comprobante.documento"
                      hide-details
                      :error="error.documento"
                      @change="error.documento = false"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex align-center mx-auto" cols="12" v-else>
                    <v-autocomplete
                      label="Facturas pendientes x c"
                      v-model="comprobante.facturas"
                      :items="facturasPendientes"
                      :item-text="format_factPendientes"
                      hide-details
                      return-object
                      outlined
                      :loading="loader.facturas"
                      multiple
                      chips
                      small-chips
                      :error="error.facturas"
                      @change="error.facturas = false"
                      :disabled="comprobante.conc_conta ? false : true"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row
                  v-if="
                    comprobante.conc_conta
                      ? comprobante.conc_conta.cartera_conc == '0'
                      : false
                  "
                >
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Vlr (Antes de Iva)"
                      outlined
                      type="text"
                      required
                      v-model="comprobante.valor"
                      suffix="$"
                      hide-details
                      ref="inputValor"
                      clearable
                      v-on:input="formatInput('valor')"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Valor Iva"
                      outlined
                      type="text"
                      required
                      v-model="comprobante.iva"
                      suffix="$"
                      hide-details
                      clearable
                      v-on:input="formatInput('iva')"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-textarea
                    label="Detalle"
                    clearable
                    outlined
                    v-model="comprobante.detalle"
                    counter="60"
                    max
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-autocomplete
                    label="Centro de costos"
                    v-model="comprobante.ccosto"
                    :items="tablaccosto"
                    :item-text="format_ccosto"
                    hide-details
                    return-object
                    outlined
                    :error="error.ccosto"
                    @change="error.ccosto = false"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="light-blue accent-4 white--text"
            class
            @click="
              cargarTablaruts(),
                cargarTablaconceptos(),
                cargarTablaccostos(),
                cargarTablactas()
            "
            depressed
          >
            <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class
            color="red"
            text
            @click="
              dialogo.estado = false;
              initComprobante();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ml-2"
            color="green darken-1"
            depressed
            dark
            text
            @click="guardarFormulario"
            >Agregar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_csv.estado" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"> Subir movimiento (.csv) </v-card-title>
        <v-card-text>
          <v-row sm="12">
            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="Rut"
                v-model="dialogo_csv.rut"
                :items="tablaruts"
                :item-text="format_ruts"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                label="Seleccionar CSV"
                accept=".csv"
                outlined
                hide-details
                v-model="dialogo_csv.archivo_csv"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="
              dialogo_csv.estado = false;
              dialogo_csv.archivo_csv = null;
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="validar_csv">
            Aceptar
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
      pickerVence: false,
      loaderspiner: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      dialogo: {
        estado: false,
        tipo: true,
        titulo: null,
      },
      dialogoEditar: {
        estado: false,
        tipo: true,
        titulo: null,
      },
      valid: false,
      contenido: [],
      docc: [],
      conceptosc: [],
      tablaruts: [],
      tablaccosto: [],
      cuentasContables: [],
      concep_envio: "0",
      search: "",
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 40) || "Maximo 40 digitos",
      ],
      validField: [(v) => !!v || "Campo es obligatorio"],
      form: {},
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false,
      },
      headers: [
        { text: "Registro", align: "center", value: "index" },
        { text: "Codigo Cta", align: "left", value: "codigoCuenta" },
        {
          text: "Descripción Cuenta",
          align: "left",
          value: "descripcionCuenta",
        },
        { text: "Rut", align: "left", value: "rut" },
        { text: "Nro_Ext", align: "center", value: "documento" },
        { text: "C.Costo", align: "center", value: "centroCosto" },
        { text: "Débitos", align: "right", value: "debitos" },
        { text: "" },
        { text: "Créditos", align: "right", value: "creditos" },
        { text: "Opciones", align: "center", value: "action" },
      ],
      detalle: [],
      detalleTotales: {
        debitos: 0,
        creditos: 0,
      },
      loader: {
        consecutivo: false,
        btn_grabar: false,
        btn_imprimir: false,
        facturas: false,
      },
      disabled: {
        debitos: false,
        creditos: false,
        btn_grabar: false,
        btn_imprimir: true,
      },
      comprobante: {
        conc_conta: null,
        rut: null,
        ccosto: null,
        valor: null,
        iva: null,
        detalle: null,
        documento: 0,
        facturas: null,
      },
      comprobanteEditar: {
        codCuenta: null,
        descripCuenta: null,
        rut: null,
        ccosto: null,
        debitos: null,
        creditos: null,
        detalle: null,
        documento: null,
        key: null,
        facturas: null,
      },
      error: {
        conc_conta: false,
        rut: false,
        ccosto: false,
        valor: false,
        iva: false,
        detalle: false,
        documento: false,
        tipoDocumento: false,
        facturas: false,
      },
      print: {
        documento: null,
        consecutivo: null,
        fecha: null,
      },
      facturasPendientes: [],
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      mostrarSelectFacturas: false,
      showBaseRetencion: false,
      dialogo_csv: {
        estado: false,
        archivo_csv: null,
        rut: null,
      },
      consecutivos: [],
    };
  },
  async created() {
    await this.cargarTablaruts();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
    };

    this.cargar_empresa();
    this.cargarTabladocc();
    this.cargarTablaconceptos();
    this.cargarTablaccostos();
    this.cargarTablactas();
    // this.cargarTablaconsec();
    this.$watch("detalle", (detalle) => {
      this.detalleTotales.debitos = 0;
      this.detalleTotales.creditos = 0;
      detalle.forEach((val) => {
        this.detalleTotales.debitos += val.debitos;
        this.detalleTotales.creditos += val.creditos;
      });

      let tdebitos = this.detalleTotales.debitos.toFixed(2);
      let tcreditos = this.detalleTotales.creditos.toFixed(2);
      this.detalleTotales.debitos = parseFloat(tdebitos);
      this.detalleTotales.creditos = parseFloat(tcreditos);
    });
  },
  methods: {
    cargar_tabla() {
      var item = this.form.consecutivo;
      this.form.fecha_doc = this.$moment(item.fechadoc).format("YYYY-MM-DD");

      var detalle = JSON.parse(JSON.stringify(item.registros));

      detalle.pop();
      var nuevo_detalle = [];
      detalle.forEach((el) => {
        let ccosto = el.ccosto.split("-")[0].trim();
        let codCuenta = el.cuenta.split("-")[0].trim();
        let descripcionCuenta = el.cuenta.split("-")[1].trim();
        let creditos = parseFloat(el.credito.trim().replace(/\,/g, "")) || 0;
        let debitos = parseFloat(el.debito.trim().replace(/\,/g, "")) || 0;
        let detalle = el.detalle.trim();
        let fvence = el.fvence;
        let documento = "0";
        let item_cartera = el.item_ph;

        var carteraEmpresa = this.empresa[0].ctacartera_empr;
        if (carteraEmpresa == codCuenta) {
          documento = el.nroext;
        } else {
          documento = el.nroext.trim();
        }

        // documento = el.nroext.replace(/\s\s+/g, "");
        // let documento = el.nroext.trim().replace(/\s\s+/g, "");
        let rut = parseFloat(el.idrut).toString() + " - " + el.rut.trim();
        let busquedaRut = this.tablaruts.find(
          (rut) => rut.identificacion_rut == el.idrut
        );
        let centroCosto = this.tablaccosto.find(
          (cc) => cc.llavecentro_cost == ccosto
        );
        // let cuentaContable = this.cuentasContables.find(cuenta => cuenta.cod_puc.trim() == codCuenta.trim())

        let obj = {
          centroCosto: ccosto,
          codigoCuenta: codCuenta,
          comprobante: {
            rut: busquedaRut,
            ccosto: centroCosto,
          },
          creditos,
          debitos,
          descripcionCuenta,
          fvence,
          detalle,
          documento,
          item_cartera,
          key: this.get_key(),
          rut,
        };

        nuevo_detalle.push(obj);
      });

      this.detalle = JSON.parse(JSON.stringify(nuevo_detalle));
    },
    format_consecutivos(item) {
      return item.numero.trim() + " - " + item.descripc.trim();
    },
    validar_csv() {
      var _this = this;
      var csv = this.dialogo_csv.archivo_csv;
      if (csv) {
        this.get_facturas_csv().then((facturas) => {
          var reader = new FileReader();
          reader.onload = function () {
            var data = reader.result;
            var array = data.split(/\r?\n/);
            var nuevo = [];
            array.shift();
            array.pop();

            var rut = _this.dialogo_csv.rut;
            var fecha = null;

            array.forEach((el, index) => {
              let parse = el.split(",");

              if (index == 0) {
                let fecha_temp = parse[3].split("/");
                fecha_temp = fecha_temp.reverse();
                fecha_temp[2] = fecha_temp[2].padStart(2, "0");
                fecha = fecha_temp.join("-");
                _this.form.fecha_doc = fecha;
              }
              var comprobante = JSON.parse(JSON.stringify(_this.comprobante));
              comprobante.rut = rut;

              var busqueda_ccosto = _this.tablaccosto.find(
                (item) => item.centro_cost + item.subcentro_cost == "1001"
              );
              comprobante.ccosto = busqueda_ccosto;

              var documento = parse[6];
              var busqueda_factura = facturas.find(
                (fac) =>
                  fac.pref_cart.trim() + fac.numero_cart.trim() == documento
              );
              var valor_credito = busqueda_factura
                ? busqueda_factura.valor_cart.trim().replace(/\,/g, "")
                : parse[4];

              nuevo.push({
                centroCosto: "1001",
                codigoCuenta: _this.empresa[0].ctacartera_empr,
                comprobante: comprobante,
                creditos: parseFloat(valor_credito),
                debitos: 0,
                descripcionCuenta: _this.empresa[0].descrippuc_empr,
                detalle: "ABONO PAGO FACTURA",
                documento,
                key: _this.get_key(),
                rut: rut.identificacion_rut + " - " + rut.descripcion_rut,
              });
            });
            _this.detalle = nuevo;

            _this.dialogo_csv.estado = false;
            _this.dialogo_csv.rut = null;
            _this.dialogo_csv.csv = null;
          };
          reader.readAsBinaryString(csv);
        });
      }
    },
    validar_debito() {
      if (this.comprobanteEditar.debitos == "0") {
        this.disabled.debitos = true;
        this.disabled.creditos = false;
      } else if (this.comprobanteEditar.debitos > "0") {
        this.disabled.debitos = false;
        this.disabled.creditos = true;
      }
    },
    validar_credito() {
      if (this.comprobanteEditar.creditos == "0") {
        this.disabled.creditos = true;
        this.disabled.debitos = false;
      } else if (this.comprobanteEditar.creditos > "0") {
        this.disabled.creditos = false;
        this.disabled.debitos = true;
      }
    },
    add_item() {
      if (this.detalle.length > 0) {
        var copia = JSON.parse(
          JSON.stringify(this.detalle[this.detalle.length - 1])
        );
        copia.key = this.get_key();
        copia.debitos = 0;
        copia.creditos = 0;
        this.detalle.push(copia);
      } else {
        this.detalle.push({
          codigoCuenta: null,
          descripcionCuenta: null,
          documento: null,
          fvence: this.$moment().format("YYYY-MM-DD"),
          rut: null,
          centroCosto: null,
          debitos: 0,
          creditos: 0,
          detalle: null,
          key: this.get_key(),
          comprobante: {},
        });
      }
    },
    formatInput(el) {
      if (this.comprobante[el]) {
        let val = parseFloat(this.comprobante[el].replace(/\,/g, "")) || 0;
        var format = this.formatNumero(val.toString());
        this.comprobante[el] = null;
        this.comprobante[el] = format;
      }
    },
    formatInputEditar(el) {
      if (this.comprobanteEditar[el]) {
        let val =
          parseFloat(this.comprobanteEditar[el].replace(/\,/g, "")) || 0;
        var format = this.formatNumero(val.toString());
        this.comprobanteEditar[el] = null;
        this.comprobanteEditar[el] = format;
      }
    },
    resetFormulario() {
      // this.form = {
      //   fecha_doc: this.$moment().format("YYYY-MM-DD")
      // };
      this.detalle = [];
      this.detalleTotales = {
        debitos: 0,
        creditos: 0,
      };
      this.initModificar();
      this.initComprobante();
      this.form.consecutivo = null;
    },
    grabar_registro() {
      var data = this.form;
      if (!data.tipoDocumento) {
        this.error.tipoDocumento = true;
        this.send_error("Debe seleccionar un tipo de documento");
      } else if (this.detalle.length == 0) {
        this.send_error("Debe agregar al menos un comprobante");
      } else if (this.detalleTotales.debitos != this.detalleTotales.creditos) {
        this.send_error("El total de débitos y créditos deben ser iguales");
      } else {
        var sesion = sessionStorage.Sesion;
        var fecha = data.fecha_doc.replace(/\-/g, "");
        var agencia = data.tipoDocumento.agencia_docc;
        var tipodoc = data.tipoDocumento.codigo_docc;
        var tipoDocumento =
          data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
        var consecutivo = data.consecutivo.consecutivo.trim();
        consecutivo = consecutivo.replace(/\,/g, "");

        var tipoconsec = data.tipoDocumento.numeracion_docc;
        var datosEnvio =
          sesion +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          tipodoc +
          "|" +
          consecutivo +
          "|" +
          0 +
          "|";

        var detalle_new = JSON.parse(JSON.stringify(this.detalle));
        var detalle_filtro = detalle_new.filter((el) => el.codigoCuenta);
        var detalle_format = detalle_filtro.map((el) => {
          el.iva =
            parseFloat(
              el.comprobante.iva ? el.comprobante.iva.replace(/\,/g, "") : "0"
            ) || 0;
          el.iva = el.iva.toFixed(2) + ".";
          el.debitos = el.debitos.toFixed(2) + ".";
          el.creditos = el.creditos.toFixed(2) + ".";
          el.numRut = el.comprobante.rut.identificacion_rut;
          el.prefijo = el.documento ? el.documento.substr(0, 4) : " ";
          el.documento = el.documento
            ? el.documento.substr(4, el.documento.length)
            : "0";

          delete el.comprobante;
          return el;
        });
        this.loader.btn_grabar = true;
        this.disabled.btn_grabar = true;
        var tiponumer = data.tipoDocumento.numeracion_docc;
        this.get_plano(detalle_format)
          .then((data) => {
            datosEnvio += data + "|" + tiponumer + "|";
            post
              .postData({
                url: "Phorizontal/dlls/PrActRegcont.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.loader.btn_grabar = false;
                this.disabled.btn_grabar = false;
                this.disabled.btn_imprimir = false;

                this.print.documento = tipoDocumento;
                this.print.consecutivo = data[0];
                this.print.fecha = fecha.substring(0, 6);
                this.cargar_tabla();
                this.resetFormulario();
                this.get_comprobantes();
              })
              .catch((err) => {
                this.loader.btn_grabar = false;
                this.disabled.btn_grabar = false;
                this.send_error("Error al grabar el registro contable");
              });
          })
          .catch((err) => {
            this.loader.btn_grabar = false;
            this.disabled.btn_grabar = false;
            this.send_error(err);
          });
      }
    },
    get_plano(array) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("tipo", "PhcompContab");
        formData.append("data", JSON.stringify(array));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          // fetch("https://server1ts.net//financiero/inc/compContab_plano.php", {
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
      this.disabled.btn_imprimir = true;
      this.loader.btn_imprimir = true;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        this.print.documento +
        "|" +
        this.print.consecutivo.trim() +
        "|" +
        this.print.fecha +
        "|";

      post
        .postData({
          url: "Financiero/dlls/PrRegcontJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader.btn_imprimir = false;
          this.disabled.btn_imprimir = false;
          this.format_imprimir(data);
        })
        .catch((err) => {
          this.disabled.btn_imprimir = false;
          this.loader.btn_imprimir = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    format_imprimir(data) {
      data = data[0];
      Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
        try {
          if (val == "registros") {
            var parent = document
              .getElementById("pdf_body_comp")
              .getElementsByTagName("tbody")[0];

            var registros = data[val];
            var debitos = 0;
            var creditos = 0;

            registros.forEach((item) => {
              var actual_row = parent.rows.length;
              var row = parent.insertRow(actual_row);

              row.insertCell(0).appendChild(document.createTextNode(item.item));
              row
                .insertCell(1)
                .appendChild(document.createTextNode(item.cuenta));
              row.insertCell(2).appendChild(document.createTextNode(item.rut));
              row
                .insertCell(3)
                .appendChild(document.createTextNode(item.nroext));
              row
                .insertCell(4)
                .appendChild(document.createTextNode(item.ccosto));
              row
                .insertCell(5)
                .appendChild(document.createTextNode(item.debito));
              row
                .insertCell(6)
                .appendChild(document.createTextNode(item.credito));
              row
                .insertCell(7)
                .appendChild(document.createTextNode(item.detalle));

              debitos += parseFloat(item.debito.replace(/\,/g, "")) || 0;
              creditos += parseFloat(item.credito.replace(/\,/g, "")) || 0;
            });

            document.getElementsByClassName("total_debito")[0].innerHTML +=
              " " + this.formatNumero(debitos.toFixed(2));

            document.getElementsByClassName("total_credito")[0].innerHTML +=
              " " + this.formatNumero(creditos.toFixed(2));
          } else {
            var el = val + "_print";
            document.getElementsByClassName(el)[0].innerHTML +=
              " " + data[val].trim();
          }
        } catch (error) {
          console.error(`Parametro: ${val} - Error`, error);
        }
      });

      imprimir_pdf();
    },
    guardarModificar() {
      var item = JSON.parse(JSON.stringify(this.comprobanteEditar));
      var detalle_old = JSON.parse(JSON.stringify(this.detalle));
      var busqueda = detalle_old.find((val) => val.key == item.key);

      if (busqueda) {
        if (item.facturas) {
          let numero = parseInt(item.facturas.numero_cart);
          numero = numero.toString().padStart(6, "0");
          // var carteraEmpresa = item.facturas.cta_cart;
          var carteraEmpresa = this.empresa[0].mayorcartera_empr;

          if (carteraEmpresa == item.facturas.cta_cart.substring(0, 4)) {
            busqueda.documento = item.facturas.pref_cart + numero;
            item.codCuenta = item.facturas.cta_cart;
          } else {
            busqueda.documento = item.facturas.documento_prov;

            // busqueda.documento =
            //   item.facturas.pref_cart.trim() + parseInt(numero).toString();
          }
          // busqueda.creditos =
          //   parseFloat(item.facturas.valor_cart.replace(/\,/g, "")) || 0;
        } else {
          busqueda.documento = item.documento;
        }

        let creditos =
          parseFloat(item.creditos.toString().replace(/\,/g, "")) || 0;
        busqueda.creditos = creditos;

        let rut = parseInt(item.rut.identificacion_rut) || 0;
        let debitos =
          parseFloat(item.debitos.toString().replace(/\,/g, "")) || 0;
        busqueda.debitos = debitos;

        if (item.facturas) {
          if (carteraEmpresa == item.facturas.cta_cart.substring(0, 4)) {
            busqueda.codigoCuenta = item.facturas.cta_cart;
            busqueda.descripcionCuenta = item.facturas.descrcargo_cart;

            busqueda.item_cartera = item.facturas.item_cart;
            busqueda.comprobante.item_cartera = item.facturas.item_cart;
          } else {
            busqueda.codigoCuenta =
              item.cuentaContable.cod_puc || item.cuentaContable;
            busqueda.descripcionCuenta =
              item.cuentaContable.descrip_puc || item.descripCuenta;
              busqueda.comprobante.item_cartera = item.facturas.item_cart;
          }
        } else {
          busqueda.codigoCuenta =
            item.cuentaContable.cod_puc || item.cuentaContable;
          busqueda.descripcionCuenta =
            item.cuentaContable.descrip_puc || item.descripCuenta;
        }

        // busqueda.rut = rut + " - " + item.rut.descripcion;
        busqueda.rut = rut + " - " + item.rut.descripcion_rut;
        busqueda.centroCosto =
          item.ccosto.centro_cost + "" + item.ccosto.subcentro_cost;
        busqueda.detalle = item.detalle;
        busqueda.fvence = item.fvence;
        busqueda.comprobante.rut = item.rut;
        busqueda.comprobante.ccosto = item.ccosto;
      }
      var detalleNew = JSON.parse(JSON.stringify(detalle_old));
      this.detalle = [];
      this.detalle = detalleNew;
      this.dialogoEditar.estado = false;
      this.initModificar();
    },
    calcularBaseRetencion() {
      var item = this.comprobanteEditar.cuentaContable;
      if (item) {
        let porc_puc = parseFloat(item.porc_puc.trim()) || 0;
        if (porc_puc > 0) {
          let base_rte = parseFloat(this.comprobanteEditar.baserte) || 0;
          if (base_rte == 0) {
            this.disabled.debitos = false;
          } else {
            this.disabled.debitos = true;
            this.disabled.creditos = true;

            let porcentaje_uc = porc_puc / 100;
            let valor = (base_rte * porcentaje_uc).toFixed(0);

            if (valor > 0) {
              this.comprobanteEditar.debitos = valor;
              this.comprobanteEditar.creditos = "0";
            } else {
              this.comprobanteEditar.creditos = valor * -1;
              this.comprobanteEditar.debitos = "0";
            }
          }
        }
      }
    },
    getBloqueo() {
      var fecha = this.form.fecha_doc.replace(/\-/g, "");
      post
        .postData({
          url: "Financiero/dlls/PrConsecutivoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            1 +
            "|" +
            "0001" +
            "|" +
            "001" +
            "|" +
            0 +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader.consecutivo = false;
          let bloqueo = data[0].bloqueo_cons;
          if (bloqueo === "1") {
            this.send_error("Mes con Bloqueo!! No puede modificar documentos");
            this.disabled.btn_grabar = true;
          } else {
            this.disabled.btn_grabar = false;
          }
        })
        .catch((err) => {
          this.loader.consecutivo = false;
          this.send_error("Error al consultar Bloqueo");
        });
    },
    validarFacturas() {
      var item = this.comprobanteEditar.cuentaContable;
      if (item) {
        let porc_puc = parseFloat(item.porc_puc.trim()) || 0;
        if (porc_puc > 0) {
          this.showBaseRetencion = true;
          this.disabled.debitos = true;
          this.disabled.creditos = true;
        } else {
          this.disabled.debitos = false;
          this.disabled.creditos = false;
          this.showBaseRetencion = false;
        }

        // var carteraEmpresa = this.empresa[0].ctacartera_empr;
        var carteraEmpresa = this.empresa[0].mayorcartera_empr;
        let mayorpuc = item.cod_puc.trim().substring(0, 4);

        if (carteraEmpresa == mayorpuc) this.mostrarSelectFacturas = true;
        else this.mostrarSelectFacturas = false;
        // if (item.ctacart_puc == "1") this.mostrarSelectFacturas = true;
        // else this.mostrarSelectFacturas = false;
      }
    },
    editItem(item) {
      this.dialogoEditar.estado = true;
      this.dialogoEditar.titulo = "Modificar item";
      var datos = JSON.parse(JSON.stringify(item));

      var busquedaCuenta = datos.codigoCuenta
        ? this.cuentasContables.find(
            (el) => el.cod_puc.trim() == datos.codigoCuenta.trim()
          )
        : null;

      this.comprobanteEditar.cuentaContable = busquedaCuenta;
      this.validarFacturas();

      this.comprobanteEditar.codCuenta = datos.codigoCuenta;
      this.comprobanteEditar.descripCuenta = datos.descripcionCuenta;
      this.comprobanteEditar.rut = datos.comprobante.rut;
      this.comprobanteEditar.ccosto = datos.comprobante.ccosto;
      this.comprobanteEditar.documento = datos.documento;

      if (datos.fvence < 0) {
        datos.fvence = this.$moment().format("YYYY-MM-DD");
      }
      this.comprobanteEditar.fvence = datos.fvence;
      this.comprobanteEditar.detalle = datos.detalle;
      this.comprobanteEditar.key = datos.key;

      this.comprobanteEditar.debitos = datos.debitos;
      this.comprobanteEditar.creditos = datos.creditos;

      if (datos.debitos == 0 && datos.creditos == 0) {
        this.disabled.debitos = false;
        this.disabled.creditos = false;
      } else {
        if (datos.debitos == 0) this.disabled.debitos = true;
        if (datos.creditos == 0) this.disabled.creditos = true;
      }
    },
    validar_ctr() {
      var cuenta = this.comprobanteEditar.cuentaContable;
      var rut = this.comprobanteEditar.rut;
      var sesion = sessionStorage.Sesion;
      var fecha = this.form.fecha_doc.replace(/\-/g, "");

      if (cuenta.ctrdoc_puc == "1") {
        var datosEnvio =
          sesion +
          "|" +
          rut.identificacion_rut +
          "|" +
          fecha +
          "|" +
          cuenta.cod_puc +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrProveedorJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.mostrarSelectFacturas = true;
            var filtro = data.filter((e) => e.numero_cart);
            this.loader.facturas = false;
            this.facturasPendientes = data;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
    },
    asignar_faacturaModificar() {
      let factura = this.comprobanteEditar.facturas;
      if (factura) {
        let creditos =
          parseFloat(factura.valor_cart.trim().replace(/\,/g, "")) || 0;
        this.comprobanteEditar.documento =
          factura.pref_cart.trim() + factura.numero_cart.trim();

        if (factura.vence_prov) {
          this.comprobanteEditar.fvence = factura.vence_prov;
        } else {
          this.comprobanteEditar.fvence = factura.fecha_cart;
        }
        if (factura.pref_cart) {
          this.comprobanteEditar.creditos = creditos;
        }
      } else {
        this.comprobanteEditar.documento = null;
      }
    },
    getDetalleConcepto() {
      if (this.comprobante.conc_conta)
        this.comprobante.detalle = this.comprobante.conc_conta.detalle_conc;
      else this.comprobante.detalle = null;
    },
    deleteItem: function (item) {
      const index = this.detalle.indexOf(item);
      this.detalle.splice(index, 1);
    },
    initModificar() {
      this.comprobanteEditar = {
        cuentaContable: null,
        rut: null,
        ccosto: null,
        debitos: null,
        creditos: null,
        detalle: null,
        documento: null,
        key: null,
        facturas: null,
      };

      this.disabled.debitos = false;
      this.disabled.creditos = false;
    },
    initComprobante() {
      this.comprobante = {
        conc_conta: null,
        rut: null,
        ccosto: null,
        valor: null,
        iva: null,
        detalle: null,
        documento: null,
        facturas: null,
      };

      // this.facturasPendientes = [];
    },
    guardarFormulario() {
      var datos = this.comprobante;
      if (!datos.conc_conta) {
        this.send_error("Selecciona un concepto contable");
        this.error.conc_conta = true;
      } else if (!datos.rut && datos.conc_conta.codigo_conc != "0001") {
        this.send_error("Selecciona un rut");
        this.error.rut = true;
        // } else if (
        //   !datos.facturas
        // ) {
        //   this.send_error("Debes seleccionar al menos una factura");
        //   this.error.facturas = true;
      } else if (!datos.ccosto && datos.conc_conta.codigo_conc != "0001") {
        this.send_error("Selecciona un centro de costo");
        this.error.ccosto = true;
        // } else if (!datos.documento && datos.conc_conta.codigo_conc != "0001") {
        //   this.send_error("Ingresa un número de documento");
        //   this.error.documento = true;
      } else {
        this.dialogo.estado = false;
        this.initComprobante();
        this.validarDatos(datos);
      }
    },
    validarDatos(comprobante) {
      var concepto = comprobante.conc_conta;
      var detalle = comprobante.detalle;
      if (concepto.codigo_conc == "0001") {
        var items = comprobante.cantidadItems;

        for (var i = 0; i < items; i++) {
          this.detalle.push({
            codigoCuenta: null,
            descripcionCuenta: null,
            documento: null,
            rut: null,
            fvence: null,
            centroCosto: null,
            debitos: 0,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
      } else {
        var valor =
          parseFloat(
            comprobante.valor ? comprobante.valor.replace(/\,/g, "") : "0"
          ) || 0;
        var iva =
          parseFloat(
            comprobante.iva ? comprobante.iva.replace(/\,/g, "") : "0"
          ) || 0;

        var rutFormat = parseInt(comprobante.rut.identificacion_rut);
        var rut = rutFormat + " - " + comprobante.rut.descripcion_rut;
        var centroCosto =
          comprobante.ccosto.centro_cost +
          "" +
          comprobante.ccosto.subcentro_cost;
        var documento = comprobante.documento;

        var valorDebito = valor;
        // Agregar débito
        if (valorDebito > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctadeb_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctadeb_conc.descripcta_conc,
            documento,
            rut,
            fvence,
            centroCosto,
            debitos: valorDebito,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
        // !Agregar débito

        // Agregar retención
        var retencion = concepto.ctaret_conc;
        var porcentajeRet = parseFloat(retencion.porc_conc) || 0;
        var baseRet = parseFloat(retencion.base_conc) || 0;
        var valorPorcentaje = 0;
        var valorRetencion = 0;

        if (porcentajeRet > 0) {
          if (baseRet == 0) {
            valorPorcentaje = porcentajeRet / 100;
            valorRetencion = valorPorcentaje * valor;
          } else {
            if (baseRet < valor) {
              valorPorcentaje = porcentajeRet / 100;
              valorRetencion = valorPorcentaje * valor;
            }
          }

          if (valorRetencion > 0) {
            this.detalle.push({
              codigoCuenta: comprobante.conc_conta.ctaret_conc.codigo_conc,
              descripcionCuenta:
                comprobante.conc_conta.ctaret_conc.descripcta_conc,
              documento,
              rut,
              fvence,
              centroCosto,
              debitos: 0,
              creditos: parseFloat(valorRetencion.toFixed(0)),
              detalle,
              key: this.get_key(),
              comprobante,
            });
          }
        }
        // !Agregar retención

        // Agregar iva
        if (iva > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctaiva_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctaiva_conc.descripcta_conc,
            documento,
            rut,
            fvence,
            centroCosto,
            debitos: iva,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
        // !Agregar iva

        // Agregar crédito
        var valorCredito = valor + iva - valorRetencion;
        if (valorCredito > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctacre_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctacre_conc.descripcta_conc,
            documento,
            rut,
            fevence,
            centroCosto,
            debitos: 0,
            creditos: parseFloat(valorCredito.toFixed(0)),
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
        // !Agregar crédito

        var facturas = comprobante.facturas;
        var cuentaFacturas = this.cuentasContables.find(
          // (e) => e.cod_puc == "1305050101" || e.cod_puc == "1302060401"
          (e) => {
            return e.cod_puc.trim() == this.empresa[0].ctacartera_empr.trim();
          }
        );
        if (facturas && facturas.length > 0) {
          facturas.forEach((item) => {
            var key_factura =
              item.pref_cart.trim() + "" + item.numero_cart.trim();

            var verificar = this.detalle.find(
              (el) =>
                (el.codigoCuenta == "1305050101" &&
                  el.documento == key_factura) ||
                (el.codigoCuenta == "1302060401" && el.documento == key_factura)
            );

            if (!verificar) {
              var valor = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;

              this.detalle.push({
                codigoCuenta: cuentaFacturas.cod_puc,
                descripcionCuenta: cuentaFacturas.descrip_puc,
                documento: key_factura,
                rut,
                fvence,
                centroCosto,
                debitos: 0,
                creditos: valor,
                detalle,
                key: this.get_key(),
                comprobante,
              });
            }
          });

          this.detalle.push({
            codigoCuenta: null,
            descripcionCuenta: null,
            documento: null,
            rut: null,
            fvence: null,
            centroCosto: null,
            debitos: 0,
            creditos: 0,
            detalle,
            key: this.get_key(),
            comprobante,
          });
        }
      }
    },
    get_key() {
      return Math.random().toString(36);
      // .substring(10);
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    format_docc: function (val) {
      return `${val.agencia_docc + val.codigo_docc} - ${val.descrip_docc}`;
    },
    format_conceptos: function (val) {
      return `${val.codigo_conc} - ${val.descrip_conc}`;
    },
    format_ruts: function (val) {
      return `${val.identificacion_rut} - ${val.descripcion_rut}`;
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_factPendientes: function (val) {
      return `${val.pref_cart.trim()}${val.numero_cart.trim()} - ${val.valor_cart.trim()} - ${val.descrcargo_cart.trim()}`;
    },
    get_facturas_csv() {
      var _this = this;
      return new Promise((resolve, reject) => {
        var rut = this.dialogo_csv.rut;
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        var datosEnvio =
          sesion + "|" + rut.identificacion_rut + "|" + fecha + "|";
        post
          .postData({
            url: "Financiero/dlls/PrCarteraJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.numero_cart);
            resolve(filtro);
          })
          .catch((err) => {
            _this.send_error("Error al cargar facturas pendientes");
            resolve();
          });
      });
    },
    get_facturas() {
      this.comprobante.facturas = null;
      var rut = this.comprobante.rut;
      this.loader.facturas = true;

      if (rut) {
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        var datosEnvio =
          sesion + "|" + rut.identificacion_rut + "|" + fecha + "|";

        post
          .postData({
            url: "Phorizontal/dlls/PrCarteraJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.numero_cart);

            this.loader.facturas = false;
            this.facturasPendientes = filtro;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
    },
    get_facturas2() {
      this.facturasPendientes = [];
      var cuenta = this.comprobanteEditar.cuentaContable;
      this.comprobanteEditar.facturas = null;
      var rut = this.comprobanteEditar.rut;
      this.loader.facturas = true;

      if (rut && cuenta.ctrdoc_puc != "1") {
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        var datosEnvio =
          sesion + "|" + rut.identificacion_rut + "|" + fecha + "|";

        post
          .postData({
            url: "Phorizontal/dlls/PrCarteraJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.numero_cart);

            this.loader.facturas = false;
            this.facturasPendientes = filtro;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
    },
    cargarTabladocc: function () {
      this.docc.unshift({
        codigo_docc: "006",
        agencia_docc: "0001",
        descrip_docc: "CRUCES CARTERA",
      });
      this.docc.unshift({
        codigo_docc: "001",
        agencia_docc: "0001",
        descrip_docc: "RECIBOS DE CAJA",
      });
    },
    get_comprobantes() {
      this.detalle = [];
      var tipoDocumento = this.form.tipoDocumento;
      if (tipoDocumento) {
        this.loader.consecutivo = true;
        var fecha = this.form.fecha_doc.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          tipoDocumento.agencia_docc +
          tipoDocumento.codigo_docc +
          "|" +
          fecha +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrReimpcbJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader.consecutivo = false;
            data.pop();
            this.consecutivos = data;
            this.form.consecutivo = null;
          })
          .catch((err) => {
            this.loader.consecutivo = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.detalle = [];
      }
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasContables = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    cargarTablaconsec: function () {
      post
        .postData({
          url: "Financiero/dlls/PrConsecutivoJ.dll",
          data: sessionStorage.Sesion + "|" + this.form.punt_fact + "|",
          method: "",
        })
        .then((data) => {
          this.docc = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consecutivo",
            estado: true,
          });
        });
    },
    cargarTablaconceptos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfconceptosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.conceptosc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar conceptos");
        });
    },
    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    cargarTablaruts() {
      this.loaderspiner = true;
      return new Promise((resolve) => {
        post
          .postData({
            url: "Financiero/dlls/CfRutsLiteJ.dll",
            data: sessionStorage.Sesion + "|",
            method: "",
          })
          .then((data) => {
            this.loaderspiner = false;
            this.tablaruts = data;
            resolve(true);
          })
          .catch((err) => {
            this.loaderspiner = false;
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar ruts",
              estado: true,
            });
          });
      });
    },
  },
};

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print_comp").innerHTML}</style>`
  );
  impresion.document.write(document.getElementById("impresion_comp").innerHTML);
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    // location.reload();
    reset_impresion();
  }, 500);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_print")[0].innerHTML = "";
  document.getElementsByClassName("nombredoc_print")[0].innerHTML = "";
  document.getElementsByClassName("nit_print")[0].innerHTML = "";
  document.getElementsByClassName("consecutivo_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_print")[0].innerHTML = "";
  document.getElementsByClassName("total_debito")[0].innerHTML = "";
  document.getElementsByClassName("total_credito")[0].innerHTML = "";
  document.getElementsByClassName("impreso_print")[0].innerHTML = "";
  document.getElementsByClassName("fechagen_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body_comp")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}
</script>
