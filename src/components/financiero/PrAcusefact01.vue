<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1400" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-check-bold</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Acuse Facturas Compra a Crédito</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="3">
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
                      v-model="fecha_ini"
                      label="Fecha Busqueda"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                    @change="get_facturas()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="mb-4" cols="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="get_facturas()"
                >
                  Consultar Acuse
                  <v-icon right dark class="ml-4"
                    >mdi-card-search-outline</v-icon
                  >
                </v-btn>
              </v-col>

              <v-col class="mb-3" cols="3">
                <v-btn
                  color="red"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="buscar_correos()"
                >
                  Cargar Correos
                  <v-icon right dark class="ml-4"
                    >mdi-card-search-outline</v-icon
                  >
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="form.pendientes"
                  @change="get_facturas"
                  label="Solo Pendientes de Acuse"
                ></v-switch>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col class="mb-4" cols="5">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row> -->
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
            <v-divider color="#FF6F00"></v-divider>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="nrofact_rep"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <b>Recibido Factura:</b>
                        </td>
                        <td>{{ item.LgRec }}</td>

                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="pdffact_item(item, '1')"
                              color="blue accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-hand-extended-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>Acuse Recibo de Factura</span>
                        </v-tooltip>
                      </tr>

                      <tr>
                        <td>
                          <b>Recibo Servicio/Mercancías:</b>
                        </td>
                        <td>{{ item.LgRem }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="pdffact_item(item, '3')"
                              color="orange accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-package-variant</v-icon>
                            </v-btn>
                          </template>
                          <span>Recibo de Bienes/Servicios</span>
                        </v-tooltip>
                      </tr>
                      <tr>
                        <td>
                          <b>Aceptación Factura</b>
                        </td>
                        <td>{{ item.LgAce }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="pdffact_item(item, '4')"
                              color="green darken-1"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-check-bold</v-icon>
                            </v-btn>
                          </template>
                          <span>Aceptacion de la Factura</span>
                        </v-tooltip>
                      </tr>
                      <tr>
                        <td>
                          <b>Rechazo Factura:</b>
                        </td>
                        <td>{{ item.LgReh }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="get_rechazo(item, '2')"
                              color="purple accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-alert-remove</v-icon>
                            </v-btn>
                          </template>
                          <span>Rechazo de la Factura</span>
                        </v-tooltip>
                      </tr>
                      
                      <tr>
                        <td>
                          <b>Eliminar Registro:</b>
                        </td>
                        <td>{{ item.LgReh }}</td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              @click="get_elimina(item)"
                              color="red accent-3"
                              fab
                              x-large
                              icon
                              v-on="on"
                              :disabled="!parseFloat(item.iddrive.trim()) == 0"
                            >
                              <v-icon>mdi-delete-empty</v-icon>
                            </v-btn>
                          </template>
                          <span>Eliminar Registro</span>
                        </v-tooltip>
                      </tr>

                    </tbody>
                  </table>
                </td>
              </template>

              <template v-slot:item.pdffact="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '6')"
                      color="red accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Pdf</span>
                </v-tooltip>
              </template>

              <template v-slot:item.recibof="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '1')"
                      color="blue accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fecharecfact_rep ? true : false"
                    >
                      <v-icon>mdi-hand-extended-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Acuse Recibo de Factura</span>
                </v-tooltip>
              </template>
              <template v-slot:item.recibob="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '3')"
                      color="orange accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fecharecmfact_rep ? true : false"
                    >
                      <v-icon>mdi-package-variant</v-icon>
                    </v-btn>
                  </template>
                  <span>Recibo de Bienes/Servicios</span>
                </v-tooltip>
              </template>

              <template v-slot:item.aceptaf="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="pdffact_item(item, '4')"
                      color="green darken-1"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fechaacepfact_rep ? true : false"
                    >
                      <v-icon>mdi-check-bold</v-icon>
                    </v-btn>
                  </template>
                  <span>Aceptacion de la Factura</span>
                </v-tooltip>
              </template>

              <template v-slot:item.rechazof="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_rechazo(item, '2')"
                      color="red accent-3"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.fecharechfact_rep ? true : false"
                    >
                      <v-icon>mdi-alert-remove</v-icon>
                    </v-btn>
                  </template>
                  <span>Rechazo de la Factura</span>
                </v-tooltip>
              </template>

              <template v-slot:item.estadodian="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="consultadian_item(item)"
                      color="green"
                      fab
                      x-large
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Estado RaDian</span>
                </v-tooltip>
              </template>
              <template v-slot:item.idcont_rep="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="contabiliza_item(item)"
                      color="purple"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="!item.idcont_rep.trim() == ''"
                    >
                      <v-icon>mdi-human-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Contabilizar Factura</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" md="8">
              <v-autocomplete
                :items="tipos"
                label="Motivo Devolucion"
                outlined
                clearable
                hide-details
                v-model="form.tipo"
                item-value="value"
                required
                :error="errores.tipo"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="rechazo_item()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog wrap v-model="dialogocontab.estado" persistent max-width="1200">
      <v-flex xs12 md12>
        <v-card class="mx-auto col-12" max-width="1400" elevation="2">
          <v-card-title>
            <span class="title">Contabilización Factura Eléctronica</span>
            <v-col class="d-flex align-items-center justify-end">
              <v-btn
                color="red accent-3 white--text"
                @click="printfact_item()"
                depressed
              >
                <v-icon size="20" left>mdi-file-pdf-box</v-icon>Ver Factura
              </v-btn>
            </v-col>

            <v-col class="d-flex align-items-center justify-end">
              <v-btn
                color="light-blue accent-4 white--text"
                @click="
                  cargarcuentas(),
                    cargarcuentaica(),
                    cargarcuentaiva(),
                    cargarcuentarte()
                "
                depressed
              >
                <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
              </v-btn>
            </v-col>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-form ref="formComprobante">
              <v-row justify="center">
                <div class="pa-0 px-8">
                  <v-card-text class="px-0 pa-0">
                    <v-data-table
                      :headers="headersfact"
                      :items="contenidofact"
                      :loading="contenido.length > 0 ? false : true"
                      item-key="id"
                      :search="search"
                    >
                    </v-data-table>
                  </v-card-text>
                </div>
              </v-row>
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1px', 'border-color': 'orange' }"
              />
              <v-row>
                <v-col class="d-flex" cols="6">
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
                      comprobante.rut = null;
                      seleccionar_concepto();
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="4">
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
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1px', 'border-color': 'orange' }"
              />

              <v-row>
                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="id.Proveedor"
                    clearable
                    required
                    v-model="form.idproveedor"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="4">
                  <v-text-field
                    label="Proveedor"
                    clearable
                    required
                    v-model="form.proveedor"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    label="Factura"
                    clearable
                    required
                    v-model="form.factura"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    label="Fecha Factura"
                    clearable
                    required
                    v-model="form.fechafactura"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex indigo--text blue lighten-5" cols="3">
                  <v-text-field
                    label="Vence Factura"
                    clearable
                    required
                    v-model="form.vencefactura"
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    label="SubTotal"
                    clearable
                    required
                    :value="formatNumero(form.subtotal)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    label="Total Factura"
                    clearable
                    required
                    :value="formatNumero(form.totalfactura)"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="4">
                  <v-autocomplete
                    label="Cuenta Iva_19%"
                    v-model="form.ctaiva1"
                    :items="cuentasiva"
                    :item-text="format_cuentas"
                    item-value="cod_puc"
                    clearable
                    @change="calcular_saldo(1), (errores.ctaiva1 = false)"
                    :error="errores.ctaiva1"
                    return-object
                    hide-details
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Iva_19%"
                    clearable
                    required
                    :value="formatNumero(form.vlriva1)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="4">
                  <v-autocomplete
                    label="Cuenta Iva_5%"
                    v-model="form.ctaiva2"
                    :items="cuentasiva"
                    :item-text="format_cuentas"
                    item-value="cod_puc"
                    @change="errores.ctaiva2 = false"
                    :error="errores.ctaiva2"
                    clearable
                    return-object
                    hide-details
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Iva_5%"
                    clearable
                    required
                    :value="formatNumero(form.vlriva2)"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="4">
                  <v-autocomplete
                    label="Cuenta Retencion"
                    v-model="form.ctartefte"
                    :items="cuentasrte"
                    :item-text="format_cuentas"
                    @change="calcular_retefuente(), (errores.ctartefte = false)"
                    :error="errores.ctartefte"
                    item-value="cod_puc"
                    clearable
                    return-object
                    hide-details
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Retefte"
                    clearable
                    required
                    :value="formatNumero(form.vlrretefte)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="4">
                  <v-autocomplete
                    label="Cuenta Reteica"
                    v-model="form.ctarteica"
                    :items="cuentasica"
                    :item-text="format_cuentas"
                    item-value="cod_puc"
                    @change="calcular_reteica(), (errores.ctarteica = false)"
                    :error="errores.ctarteica"
                    clearable
                    return-object
                    hide-details
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor ReteIca"
                    clearable
                    required
                    :value="formatNumero(form.vlrrteica)"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="4">
                  <v-autocomplete
                    label="Cuenta Compra"
                    v-model="form.ctacompra"
                    :items="cuentas"
                    :item-text="format_cuentas"
                    item-value="cod_puc"
                    clearable
                    return-object
                    hide-details
                    @change="errores.ctacompra = false"
                    :error="errores.ctacompra"
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Compra"
                    clearable
                    required
                    :value="formatNumero(form.vlrcompra)"
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="4">
                  <v-autocomplete
                    label="Cuenta Pasivo"
                    v-model="form.ctapasivo"
                    :items="cuentas"
                    :item-text="format_cuentas"
                    item-value="cod_puc"
                    clearable
                    return-object
                    hide-details
                    @change="errores.ctapasivo = false"
                    :error="errores.ctapasivo"
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Pasivo"
                    clearable
                    required
                    :value="formatNumero(form.vlrpasivo)"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1px', 'border-color': 'orange' }"
              />

              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-textarea
                    label="Detalle Contabilidad"
                    clearable
                    outlined
                    v-model="comprobante.detalle"
                    counter="60"
                    max
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row> </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class color="red" text @click="dialogocontab.estado = false"
              >Cancelar</v-btn
            >
            <v-btn
              class="ml-2"
              color="green darken-1"
              depressed
              dark
              text
              @click="grabar_contabilidad"
              >Contabilizar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogocontab: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      item_selecc: [],
      loader: false,
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      vlr_iva0: 0,
      vlr_iva1: 0,
      vlr_iva2: 0,
      expanded: [],
      contenido: [],
      contenidofact: [],
      conceptosc: [],
      cuentas: [],
      cuentasica: [],
      cuentasiva: [],
      cuentasrte: [],
      tablaruts: [],
      tablaccosto: [],
      headersfact: [
        { text: "Item", align: "center", value: "id" },
        { text: "Código", align: "center", value: "codigo" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Unid", align: "center", value: "unit" },
        { text: "Cantidad", align: "center", value: "cantidad" },
        { text: "Vlr. Unit", align: "center", value: "vlrUnit" },
        { text: "Vlr. Total", align: "center", value: "vlrTotal" },
      ],
      Item: [],
      datos_proveedor: {
        direccion_proveedor: null,
        telefono_proveedor: 0,
        correo_proveedor: null,
        ciudad_proveedor: 0,
      },
      tipos: [
        { text: "1. Documento con inconsistencias", value: 1 },
        { text: "2. Mercancía no entregada totalmente", value: 2 },
        { text: "3. Mercancía no entregada parcialmente", value: 3 },
        { text: "4. Servicio no prestado", value: 4 },
      ],
      errores: {
        ctacompra: false,
        ctapasivo: false,
        ctartefte: false,
        ctarteica: false,
        ctaiva1: false,
        ctaiva2: false,
        conc_conta: false,
        ccosto: false,
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

      search: "",
      id_file: "",
      form: {},
      card_estado: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Proveedor", align: "left", value: "nombreprov_rep" },
        { text: "Factura", align: "center", value: "nrofact_rep" },
        { text: "Fecha Factura", align: "center", value: "fechafact_rep" },
        { text: "Pdf", align: "center", value: "pdffact" },
        { text: "Recibo Factura", value: "recibof", align: "center" },
        { text: "Recibo Bienes/Servicios", value: "recibob", align: "center" },
        { text: "Aceptación Factura", value: "aceptaf", align: "center" },
        { text: "Rechazo Factura", value: "rechazof", align: "center" },
        { text: "Estado Dian", value: "estadodian", align: "center" },
        { text: "Contabilizar", value: "idcont_rep", align: "center" },
      ],
    };
  },
  async created() {
    await this.get_empresa();
    this.cargarcuentas();
    this.cargarcuentaica();
    this.cargarcuentaiva();
    this.cargarcuentarte();

    //await this.consultar_xml();
    this.form.pendientes = false;
    await this.get_facturas();
    this.cargarTablaconceptos();
    this.cargarTablaccostos();
  },

  computed: {},
  methods: {
    async buscar_correos() {
      this.form.pendientes = true;
      let idempresa = this.datosEmpresa.id_empr;
      if (idempresa == "000000901289171") {
        this.consultar_test();
      } else {
        await this.consultar_xml();
        this.get_facturas();
      }
    },
    consultadian_item(item) {
      let cufe = item.cufe_rep;
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    async seleccionar_concepto() {
      let ctadeb_conc = this.comprobante.conc_conta.ctadeb_conc.codigo_conc;
      var busqueda_deb = this.cuentas.find((el) => el.cod_puc == ctadeb_conc);
      this.form.ctacompra = busqueda_deb;

      let cta_retfte = this.comprobante.conc_conta.ctaret_conc.codigo_conc;
      var busqueda_retfte = this.cuentas.find((el) => el.cod_puc == cta_retfte);
      this.form.ctartefte = busqueda_retfte;

      let cta_retica = this.comprobante.conc_conta.ctaicav_conc.codigo_conc;
      var busqueda_retica = this.cuentasica.find(
        (el) => el.cod_puc == cta_retica
      );
      this.form.ctarteica = busqueda_retica;

      let cta_iva = this.comprobante.conc_conta.ctaiva_conc.codigo_conc;
      var busqueda_iva = this.cuentasiva.find((el) => el.cod_puc == cta_iva);
      this.form.ctaiva = busqueda_iva;

      let cta_pasivo = this.comprobante.conc_conta.ctacre_conc.codigo_conc;
      var busqueda_pasivo = this.cuentas.find((el) => el.cod_puc == cta_pasivo);
      this.form.ctapasivo = busqueda_pasivo;

      this.comprobante.detalle =
        this.comprobante.conc_conta.detalle_conc.trim();
      this.form.vlrretefte = 0;
      this.form.vlrrteica = 0;
      this.form.ctaiva1 = "";
      this.form.ctaiva2 = "";
      this.form.ctartefte = "0";
      this.form.ctarteica = "0";
      this.form.vlrretefte = 0;
      this.form.vlrrteica = 0;
    },
    async get_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          let tokenemail = this.datosEmpresa.tokenacuse_empr.trim();
          if (!tokenemail) {
            this.$emit("snack", {
              color: "error",
              text: "Token Titan sin Registrar",
              estado: true,
            });
          }
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    async consultar_xml() {
      this.loader = true;
      let hostname = this.datosEmpresa.hostacuse_empr.trim();
      let username = this.datosEmpresa.correoacuse_empr.trim();
      let tokenemail = this.datosEmpresa.tokenacuse_empr.trim();
      let fecha = this.fecha_ini.split("-").join("");
      let empresa = this.datosEmpresa.descrip_empr.trim();
      let session = sessionStorage.Sesion;

      let data = new FormData();
      data.append("hostname", hostname);
      data.append("username", username);
      data.append("tokenemail", tokenemail);
      data.append("fecha", fecha);
      data.append("empresa", empresa);
      data.append("session", session);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/acuse.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      for (const item of response) {
        let fechacorreo = this.fecha_ini.split("-").join("");
        let acuseRes = await post.postData({
          url: "Financiero/dlls//PrAcuse.dll",
          data:
            [
              sessionStorage.Sesion,
              item.cufe,
              item.idProv,
              item.nombreProv,
              item.nrofact,
              item.fecha,
              item.file,
              item.idpdf,
              item.idbase64,
              fechacorreo,
            ].join("|") + "|",
          method: "",
        });
        this.loader = false;
      }
    },
    get_elimina(item){
      this.loader = true;
      var cufe = item.cufe_rep;

       post
        .postData({
          url: "Financiero/dlls//PrAcuseX.dll",
          data: sessionStorage.Sesion + "|" + cufe + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Registro Eliminado",
            estado: true,
          });

          this.get_facturas();
        })
        .catch((err) => {
          console.error(err);
          this.loader = false;
          this.send_error("Error al eliminar factura");
        });

    },
    async get_facturas() {
      this.loader = true;
      var fecha = this.fecha_ini.split("-").join("");
      let pendientes = this.form.pendientes ? "1" : "0";
      await post
        .postData({
          url: "Financiero/dlls//PrAcuseJ.dll",
          data: sessionStorage.Sesion + "|" + pendientes + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.error(err);
          this.loader = false;
          this.send_error("Error al consultar facturas");
        });
    },
    get_rechazo(item, evento) {
      //(item, '2')
      this.Item = item;
      this.id_file = item.idbase64.trim();
      this.dialogo.estado = true;
    },
    async rechazo_item() {
      this.dialogo.estado = false;
      // console.log(this.form.tipo)
      let motivo = this.form.tipo;
      let item = this.Item;
      let idFile = this.id_file;
      let data = new FormData();
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "xml") {
        this.acuse_rechazo(item, 2, motivo, response.content);
      }
    },
    async acuse_rechazo(item, evento, motivo, base64) {
      this.loader = true;
      let tipo = this.form.tipo;
      let token = this.datosEmpresa.tokentitan_empr.trim();
      let xml = item.nombrexml.trim();
      let data = new FormData();
      data.append("event", evento);
      data.append("file", xml);
      data.append("token", token);
      data.append("base64", base64);
      data.append("type_rejection", motivo);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_dian/eventos.dian.php",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) =>
          res.json().catch((err) => {
            this.loader = false;
          })
        )
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
        });

      if (response) {
        let cufe = item.cufe_rep.trim();
        let codresp = 1;
        post
          .postData({
            url: "Financiero/dlls//PrAcuse01.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cufe +
              "|" +
              evento +
              "|" +
              codresp +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Evento grabado correctamente",
              estado: true,
            });
            this.get_facturas();
          })
          .catch((err) => {
            console.error(err);
            this.loader = false;
            this.send_error("Error al generar evento");
          });
      } else {
        this.loader = false;
        this.send_error("Error al generar evento");
      }
    },
    async acusefact_item(item, evento, base64) {
      this.loader = true;
      let motivo = "";
      let token = this.datosEmpresa.tokentitan_empr.trim();
      let xml = item.nombrexml.trim();
      let data = new FormData();
      data.append("event", evento);
      data.append("file", xml);
      data.append("token", token);
      data.append("base64", base64);
      data.append("type_rejection", motivo);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_dian/eventos.dian.php",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) =>
          res.json().catch((err) => {
            this.loader = false;
          })
        )
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
        });

      if (response) {
        let cufe = item.cufe_rep.trim();
        let codresp = 1;
        post
          .postData({
            url: "Financiero/dlls//PrAcuse01.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cufe +
              "|" +
              evento +
              "|" +
              codresp +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Evento grabado correctamente",
              estado: true,
            });
            this.get_facturas();
          })
          .catch((err) => {
            console.error(err);
            this.loader = false;
            this.send_error("Error al generar evento");
          });
      } else {
        this.loader = false;
        this.send_error("Error al generar evento");
      }
    },
    async consultar_test() {
      let hostname = this.datosEmpresa.hostacuse_empr.trim();
      let username = this.datosEmpresa.correoacuse_empr.trim();
      let tokenemail = this.datosEmpresa.tokenacuse_empr.trim();
      let fecha = this.fecha_ini.split("-").join("");
      let empresa = this.datosEmpresa.descrip_empr.trim();
      let session = sessionStorage.Sesion;

      let data = new FormData();
      data.append("hostname", hostname);
      data.append("username", username);
      data.append("tokenemail", tokenemail);
      data.append("fecha", fecha);
      data.append("empresa", empresa);
      data.append("session", session);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/acuse_test.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      for (const item of response) {
        let fechacorreo = this.fecha_ini.split("-").join("");
        let acuseRes = await post.postData({
          url: "Financiero/dlls//PrAcuse.dll",
          data:
            [
              sessionStorage.Sesion,
              item.cufe,
              item.idProv,
              item.nombreProv,
              item.nrofact,
              item.fecha,
              item.file,
              item.idpdf,
              item.idbase64,
              fechacorreo,
            ].join("|") + "|",
          method: "",
        });
        this.loader = false;
      }
      this.get_facturas();
    },
    format_conceptos: function (val) {
      return `${val.codigo_conc} - ${val.descrip_conc}`;
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_cuentas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    async pdffact_item(item, evento) {
      let idFile = "";
      if (evento === "6") idFile = item.iddrive.trim();
      else if (
        evento === "1" ||
        evento === "2" ||
        evento === "3" ||
        evento === "4"
      )
        idFile = item.idbase64.trim();

      let data = new FormData();
      // data.append("idFile", "11C186WqAX03-_sagkqfW7-6qIGHb4A8k") // PDF
      // data.append("idFile", "1PSCDTl__HzUZJXTKDm0o-4s4sepxLbT8") // XML
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "pdf") {
        const url = `https://server1ts.net//tmp/${response.fileName}`;
        window.open(url, "_blank").focus();
      } else if (response.type === "xml") {
        this.acusefact_item(item, evento, response.content);
      }
    },
    async printfact_item() {
      let idFile = "";
      idFile = this.item_selecc.iddrive.trim();

      let data = new FormData();
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "pdf") {
        const url = `https://server1ts.net//tmp/${response.fileName}`;
        window.open(url, "_blank").focus();
      }
    },
    async contabiliza_item(item) {
      this.loader = true;
      this.form.vlrretefte = 0;
      this.form.vlrrteica = 0;
      this.form.ctaiva1 = "";
      this.form.ctaiva2 = "";
      this.form.ctartefte = "0";
      this.form.ctarteica = "0";
      this.form.ctacompra = 0;
      this.form.vlrretefte = 0;
      this.form.vlrrteica = 0;
      this.form.vlriva1 = 0;
      this.form.vlriva2 = 0;
      this.form.vlrcompra = 0;
      this.form.vlrpasivo = 0;
      this.comprobante.detalle = "";

      this.comprobante.conc_conta = null;
      this.comprobante.ccosto = null;

      this.item_selecc = item;
      let idFile = item.idbase64.trim();

      let data = new FormData();
      data.append("idFile", idFile);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/getFile.drive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (response.type === "xml") {
        let datoxml = atob(response.content);
        this.loader = false;

        await this.loadXMLDoc(datoxml);
        this.calcular_saldo(0);
      }
      this.dialogocontab.estado = true;
    },

    async loadXMLDoc(datoxml) {
      this.comprobante.detalle = "";

      const _this = this;
      const xhr = new XMLHttpRequest();

      let parser = new DOMParser();

      let xml = parser.parseFromString(datoxml, "application/xml");

      const registrationNameElement = xml
        .getElementsByTagName("cac:Attachment")[0]
        .getElementsByTagName("cbc:Description")[0].textContent;

      let xmlParseado = parser.parseFromString(
        registrationNameElement,
        "application/xml"
      );
      // console.log("xmlParseado: ", xmlParseado);

      const xmlproveedor = xmlParseado.getElementsByTagName(
        "cac:AccountingSupplierParty"
      );
      let nombre_proveedor = xmlproveedor[0].getElementsByTagName("cac:Party");
      nombre_proveedor =
        nombre_proveedor[0].getElementsByTagName("cac:PartyName");
      nombre_proveedor = nombre_proveedor[0].getElementsByTagName("cbc:Name");
      this.form.proveedor = nombre_proveedor[0].textContent;

      let id_proveedor = xmlproveedor[0].getElementsByTagName("cac:Party");
      id_proveedor = id_proveedor[0].getElementsByTagName("cac:PartyTaxScheme");
      id_proveedor = id_proveedor[0].getElementsByTagName("cbc:CompanyID");
      this.form.idproveedor = id_proveedor[0].textContent;

      let tipo_proveedor = 0;

      if (
        this.form.idproveedor < 799999999 ||
        this.form.idproveedor > 999999999
      ) {
        tipo_proveedor = 13;
      } else {
        tipo_proveedor = 31;
      }

      this.datos_proveedor.direccion_proveedor = xmlproveedor[0]
        .getElementsByTagName("cac:Party")[0]
        .getElementsByTagName("cac:PhysicalLocation")[0]
        .getElementsByTagName("cac:Address")[0]
        .getElementsByTagName("cac:AddressLine")[0]
        .getElementsByTagName("cbc:Line")[0].textContent;

      this.datos_proveedor.ciudad_proveedor = xmlproveedor[0]
        .getElementsByTagName("cac:Party")[0]
        .getElementsByTagName("cac:PhysicalLocation")[0]
        .getElementsByTagName("cac:Address")[0]
        .getElementsByTagName("cbc:ID")[0].textContent;

      this.datos_proveedor.telefono_proveedor = xmlproveedor[0]
        .getElementsByTagName("cac:Party")[0]
        .getElementsByTagName("cac:Contact")[0]
        .getElementsByTagName("cbc:Telephone")[0].textContent;

      this.datos_proveedor.correo_proveedor = xmlproveedor[0]
        .getElementsByTagName("cac:Party")[0]
        .getElementsByTagName("cac:Contact")[0]
        .getElementsByTagName("cbc:ElectronicMail")[0].textContent;

      let nrofactura = xmlParseado.getElementsByTagName("cbc:ID");
      nrofactura = nrofactura[0].textContent;
      this.form.factura = nrofactura;

      let fechafactura = xmlParseado.getElementsByTagName("cbc:IssueDate");
      fechafactura = fechafactura[0].textContent;
      this.form.fechafactura = fechafactura;

      let vencefactura = xmlParseado.getElementsByTagName("cac:PaymentMeans");
      vencefactura = vencefactura[0].getElementsByTagName("cbc:PaymentDueDate");
      vencefactura = vencefactura[0].textContent;
      this.form.vencefactura = vencefactura;
      let tax0 = 0;
      let tax1 = 0;
      let tax2 = 0;
      let tax3 = 0;
      let tax4 = 0;

      xmlParseado.getElementsByTagName("cac:TaxTotal")[0]
        ? (tax0 = 1)
        : (tax0 = 0);

      xmlParseado.getElementsByTagName("cac:TaxTotal")[1]
        ? (tax1 = 1)
        : (tax1 = 0);
      xmlParseado.getElementsByTagName("cac:TaxTotal")[2]
        ? (tax2 = 1)
        : (tax2 = 0);
      xmlParseado.getElementsByTagName("cac:TaxTotal")[3]
        ? (tax3 = 1)
        : (tax3 = 0);
      xmlParseado.getElementsByTagName("cac:TaxTotal")[4]
        ? (tax4 = 1)
        : (tax4 = 0);

      let iva0 = 0;
      let iva1 = 0;
      let iva2 = 0;
      let iva3 = 0;
      let iva4 = 0;
      let tarifa0 = 0;
      let tarifa1 = 0;
      let tarifa2 = 0;

      if (tax0 == 1) {
        iva0 = xmlParseado
          .getElementsByTagName("cac:TaxTotal")[0]
          .getElementsByTagName("cac:TaxSubtotal")[0]
          .getElementsByTagName("cbc:TaxAmount")[0].textContent;
        tarifa0 = xmlParseado
          .getElementsByTagName("cac:TaxTotal")[0]
          .getElementsByTagName("cac:TaxSubtotal")[0]
          .getElementsByTagName("cac:TaxCategory")[0]
          .getElementsByTagName("cbc:Percent")[0].textContent;
      }
      this.vlr_iva0 = parseFloat(iva0);

      if (tax1 == 1) {
        iva1 = xmlParseado
          .getElementsByTagName("cac:TaxTotal")[1]
          .getElementsByTagName("cac:TaxSubtotal")[0]
          .getElementsByTagName("cbc:TaxAmount")[0].textContent;

        tarifa1 = xmlParseado
          .getElementsByTagName("cac:TaxTotal")[1]
          .getElementsByTagName("cac:TaxSubtotal")[0]
          .getElementsByTagName("cac:TaxCategory")[0]
          .getElementsByTagName("cbc:Percent")[0].textContent;
      }
      this.vlr_iva1 = parseFloat(iva1);

      if (tax2 == 1) {
        iva2 = xmlParseado
          .getElementsByTagName("cac:TaxTotal")[2]
          .getElementsByTagName("cac:TaxSubtotal")[0]
          .getElementsByTagName("cbc:TaxAmount")[0].textContent;
        tarifa2 = xmlParseado
          .getElementsByTagName("cac:TaxTotal")[2]
          .getElementsByTagName("cac:TaxSubtotal")[0]
          .getElementsByTagName("cac:TaxCategory")[0]
          .getElementsByTagName("cbc:Percent")[0].textContent;
      }
      this.vlr_iva2 = parseFloat(iva2);

      // console.log("tarifas", tarifa0, tarifa1);
      // console.log("iva0", iva0, iva1);

      if ((tarifa0 == tarifa1) & (tarifa1 == tarifa2)) {
        tarifa1 = 0;
        iva1 = 0;
        tarifa2 = 0;
        iva2 = 0;
      }

      switch (tarifa0) {
        case "16.00":
          this.form.vlriva1 = iva0;
          break;
        case "5.00":
          this.form.vlriva2 = iva0;
          break;
        case "19.00":
          this.form.vlriva1 = this.vlr_iva0;
          break;
      }

      switch (tarifa1) {
        case "19.00":
          this.form.vlriva1 = iva1;
          break;
        case "5.00":
          this.form.vlriva2 = iva1;
          break;
      }

      switch (tarifa2) {
        case "19.00":
          this.form.vlriva1 = iva2;
          break;
        case "5.00":
          this.form.vlriva2 = iva2;
          break;
      }

      let subtotal = xmlParseado.getElementsByTagName("cac:LegalMonetaryTotal");
      subtotal = subtotal[0].getElementsByTagName("cbc:LineExtensionAmount");
      subtotal = subtotal[0].textContent;

      this.form.subtotal = subtotal;

      let total_factura =
        parseFloat(subtotal) +
        parseFloat(iva0) +
        parseFloat(iva1) +
        parseFloat(iva2);
      this.form.totalfactura = parseFloat(total_factura).toFixed(2);

      const invoiceLines = xmlParseado.getElementsByTagName("cac:InvoiceLine");

      let data = [];

      for (let i = 0; i < invoiceLines.length; i++) {
        let invoiceLine = invoiceLines[i];
        let busq_codigo = 0;
        let id = i + 1;
        let descripcion =
          invoiceLine.getElementsByTagName("cbc:Description")[0].textContent;
        let codigoitem = 0;

        invoiceLine
          .getElementsByTagName("cac:Item")[0]
          .getElementsByTagName("cac:SellersItemIdentification")[0]
          ? (busq_codigo = 1)
          : (busq_codigo = 0);

        if (busq_codigo == 1) {
          codigoitem = invoiceLine
            .getElementsByTagName("cac:Item")[0]
            .getElementsByTagName("cac:SellersItemIdentification")[0]
            .getElementsByTagName("cbc:ID")[0].textContent;
        } else {
          codigoitem = invoiceLine
            .getElementsByTagName("cac:Item")[0]
            .getElementsByTagName(
              "cac:StandardItemIdentification"
            )[0].textContent;
        }

        let invoicedQuantity = invoiceLine.getElementsByTagName(
          "cbc:InvoicedQuantity"
        )[0].textContent;
        invoicedQuantity = parseFloat(invoicedQuantity).toFixed(2);
        let unitCode = invoiceLine
          .getElementsByTagName("cbc:InvoicedQuantity")[0]
          .getAttribute("unitCode");
        let priceAmount =
          invoiceLine.getElementsByTagName("cbc:PriceAmount")[0].textContent;
        let lineExtensionAmount = invoiceLine.getElementsByTagName(
          "cbc:LineExtensionAmount"
        )[0].textContent;

        let itemData = {
          id,
          codigo: codigoitem,
          descripcion,
          unit: unitCode == "94" ? "UN" : "MT",
          cantidad: invoicedQuantity,
          vlrUnit: _this.formatNumero(priceAmount),
          vlrTotal: _this.formatNumero(lineExtensionAmount),
        };

        data.push(itemData);
      }
      _this.contenidofact = data;
    },
    grabar_contabilidad() {
      var data = this.form;
      if (!this.comprobante.conc_conta) {
        this.errores.conc_conta = true;
        this.send_error("Selecciona un Concepto Contable");
      } else if (!this.comprobante.ccosto) {
        this.errores.ccosto = true;
        this.send_error("Selecciona un Centro de Costo");
      } else if (!data.ctaiva1) {
        this.errores.ctaiva1 = true;
        this.send_error("Selecciona una cuenta Iva 19%");
      } else if (!data.ctaiva2) {
        this.errores.ctaiva2 = true;
        this.send_error("Selecciona una cuenta Iva 5%");
      } else if (!data.ctartefte) {
        this.errores.ctartefte = true;
        this.send_error("Selecciona una cuenta Rtefuente");
      } else if (!data.ctarteica) {
        this.errores.ctarteica = true;
        this.send_error("Selecciona una cuenta RteIca");
      } else if (!data.ctacompra) {
        this.errores.ctacompra = true;
        this.send_error("Selecciona una cuenta de compra");
      } else if (!data.ctapasivo) {
        this.errores.ctapasivo = true;
        this.send_error("Selecciona una cuenta Pasiva");
      } else {
        let idproveedor = this.form.idproveedor.trim();
        let descproveedor = this.form.proveedor.trim();
        let direccion = this.datos_proveedor.direccion_proveedor;
        let telefono = this.datos_proveedor.telefono_proveedor.replace(
          /\|/g,
          ""
        );
        let ciudad = this.datos_proveedor.ciudad_proveedor;
        let correo = this.datos_proveedor.correo_proveedor;
        let cufe = this.item_selecc.cufe_rep;

        let factura = this.form.factura.trim();
        let fechafact = this.form.fechafactura.replace(/\-/g, "");
        let vencefactura = this.form.vencefactura.replace(/\-/g, "");
        let vlriva1 = this.form.vlriva1 ? this.form.vlriva1 : 0;
        let vlriva2 = this.form.vlriva2 ? this.form.vlriva2 : 0;
        let vlrretefte = this.form.vlrretefte ? this.form.vlrretefte : 0;
        let vlrrteica = this.form.vlrrteica ? this.form.vlrrteica : 0;
        let vlrcompra = this.form.vlrcompra ? this.form.vlrcompra : 0;
        let vlrpasivo = this.form.vlrpasivo ? parseInt(this.form.vlrpasivo) : 0;
        let ctaiva1 = this.form.ctaiva1.cod_puc;
        let ctaiva2 = this.form.ctaiva2.cod_puc;
        let ctartefte = this.form.ctartefte.cod_puc;
        let ctarteica = this.form.ctarteica.cod_puc;
        let ctacompra = this.form.ctacompra.cod_puc;
        let ctapasivo = this.form.ctapasivo.cod_puc;

        let detalle = this.comprobante.detalle
          ? this.comprobante.detalle.trim()
          : "";
        detalle = detalle.replace(/\"/g, "pg");
        detalle = detalle.replace(/\*/g, "x");

        let ccosto = this.comprobante.ccosto.llavecentro_cost;

        let totxml = parseFloat(this.form.totalfactura);

        let total_fact =
          parseFloat(vlrcompra) + parseFloat(vlriva1) + parseFloat(vlriva2);
        total_fact = total_fact.toFixed(2);

        if (vlrpasivo < 1) {
          total_fact = 0;
        }

        if (total_fact > totxml || total_fact < totxml) {
          let msj =
            "Total diferente al facturado o Total valor Pasivo no puede ser Cero  " +
            total_fact;
          this.send_error(msj);
        } else {
          var datosEnvio =
            sessionStorage.Sesion +
            "|" +
            fechafact +
            "|" +
            idproveedor +
            "|" +
            factura +
            "|" +
            vencefactura +
            "|" +
            vlriva1 +
            "|" +
            vlriva2 +
            "|" +
            vlrretefte +
            "|" +
            vlrrteica +
            "|" +
            vlrcompra +
            "|" +
            vlrpasivo +
            "|" +
            detalle +
            "|" +
            ccosto +
            "|" +
            ctacompra +
            "|" +
            ctapasivo +
            "|" +
            ctartefte +
            "|" +
            ctarteica +
            "|" +
            ctaiva1 +
            "|" +
            ctaiva2 +
            "|" +
            descproveedor +
            "|" +
            direccion +
            "|" +
            telefono +
            "|" +
            ciudad +
            "|" +
            correo +
            "|" +
            cufe +
            "|";
          post
            .postData({
              url: "Financiero/dlls/PrContElectr.dll",
              data: datosEnvio,
              method: "",
            })
            .then((data) => {
              // _this.load.btn_enviar = false;
              // _this.disabled.btn_enviar = false;
              // _this.disabled.imprimir_factura = false;
              // _this.print.comprobante = data[0];
              // _this.reset_formulario();

              this.dialogocontab.estado = false;

              this.$emit("snack", {
                color: "success",
                text: "Documento Contabilizado correctamente",
                estado: true,
              });
              this.get_facturas();
            })
            .catch((err) => {
              console.error(err);
              this.disabled.btn_enviar = false;
              this.load.btn_enviar = false;
              // this.send_error(err);
              this.send_error("Error al contabilizar Documento");
            });
        }
      }
    },
    async calcular_retefuente() {
      if (!this.form.vlrrteica) {
        this.form.vlrrteica = 0;
      }
      let rte_sel = this.form.ctartefte ? this.form.ctartefte.cod_puc : 0;
      if (rte_sel == 0) {
        this.$set(this.form, "vlrretefte", 0);
      } else {
        let porcentaje = this.form.ctartefte.porc_puc;
        porcentaje = parseFloat(porcentaje / 100);
        let base = parseFloat(this.form.subtotal) || 0;
        let retefuente = parseFloat(base * porcentaje).toFixed(0);
        this.formatNumero(retefuente);
        this.$set(this.form, "vlrretefte", retefuente);
      }
      setTimeout(() => {
        this.calcular_saldo(1);
      }, 1000);
    },
    async calcular_reteica() {
      let ica_sel = this.form.ctarteica.cod_puc;
      if (ica_sel == 0) {
        this.$set(this.form, "vlrrteica", 0);
      } else {
        let porcentaje = this.form.ctarteica.porc_puc;
        porcentaje = parseFloat(porcentaje / 1000);
        let base = parseFloat(this.form.subtotal) || 0;
        let retefuente = parseFloat(base * porcentaje).toFixed(0);
        this.formatNumero(retefuente);
        this.$set(this.form, "vlrrteica", retefuente);
      }
      setTimeout(() => {
        this.calcular_saldo(1);
      }, 1000);
    },
    calcular_saldo(proceso) {
      if (!this.form.vlrretefte) {
        this.form.vlrretefte = 0;
      }
      if (!this.form.vlrrteica) {
        this.form.vlrrteica = 0;
      }

      let subtotal = parseFloat(this.form.subtotal);
      let total = parseFloat(this.form.totalfactura);
      let iva0 = parseFloat(this.vlr_iva0);
      let iva1 = this.form.vlriva1 ? parseFloat(this.form.vlriva1) : 0;
      let iva2 = this.form.vlriva2 ? parseFloat(this.form.vlriva2) : 0;
      let retfte = this.form.vlrretefte ? parseFloat(this.form.vlrretefte) : 0;
      let retica = this.form.vlrrteica ? parseFloat(this.form.vlrrteica) : 0;

      if (proceso > 0) {
        if (!this.form.ctaiva1) {
          (iva1 = 0), (iva0 = 0);
        }
        if (!this.form.ctaiva2) {
          iva2 = 0;
        }
      }else{
        (iva1 = 0)
      }

      let tot_compra = total - iva0 - iva1;

      this.formatNumero(tot_compra);
      this.$set(this.form, "vlrcompra", tot_compra);

      let vlrpasivo = subtotal + iva0 + iva1 + iva2 - retfte - retica;
      this.formatNumero(vlrpasivo);
      this.$set(this.form, "vlrpasivo", vlrpasivo);
    },

    cargarTablaconceptos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfconceptosJ.dll",
          data: sessionStorage.Sesion + "|" + "9" + "|",
          method: "",
        })
        .then((data) => {
          this.conceptosc = data;
          this.conceptosc.push({
            codigo_conc: "9999",
            descrip_conc: "No Contabilizar",
          });
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
    cargarcuentas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },
    cargarcuentaica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data:
            sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|" + "2368" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasica = data;
          this.cuentasica.unshift({
            cod_puc: "0",
            descrip_puc: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },
    cargarcuentaiva: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data:
            sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|" + "2408" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasiva = data;
          this.cuentasiva.unshift({
            cod_puc: "0",
            descrip_puc: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },
    cargarcuentarte: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data:
            sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|" + "2365" + "|",
          method: "",
        })
        .then((data) => {
          this.cuentasrte = data;
          this.cuentasrte.unshift({
            cod_puc: "0",
            descrip_puc: "No Aplica",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
