<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="13">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-file-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Registro contable</v-list-item-title
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
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_doc"
                    @change="(dialogPicker = false), getConsecutivo()"
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
                    getConsecutivo();
                    error.tipoDocumento = false;
                  "
                  :error="error.tipoDocumento"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Consecutivo"
                  clearable
                  outlined
                  type="text"
                  disabled
                  v-model="form.consecutivo"
                  :loading="loader.consecutivo"
                ></v-text-field>
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
                    comprobante.conc_conta = null;
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
                show-expand
                disable-pagination
                hide-default-footer
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
                    <td colspan="5" class="text-right">
                      <v-btn
                        @click="add_item"
                        depressed
                        color="primary"
                        :disabled="!form.tipoDocumento"
                        >Agregar item</v-btn
                      >
                    </td>
                    <td colspan="2" class="text-right">
                      <strong>TOTALES</strong>
                    </td>
                    <td class="text-xs-right text-right">
                      {{ formatNumero(detalleTotales.debitos.toFixed(2)) }}
                    </td>
                    <td class="text-xs-right text-right">
                      {{ formatNumero(detalleTotales.creditos.toFixed(2)) }}
                    </td>
                    <td></td>
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
            <v-col>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="light-blue accent-4 white--text"
                    class="mr-2"
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

              <v-tooltip
                bottom
                v-if="
                  form.tipoDocumento &&
                  (form.tipoDocumento.codigo_docc == '001' ||
                    form.tipoDocumento.codigo_docc == '003')
                "
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="green white--text"
                    class="mr-2"
                    @click="dialogo_csv.estado = true"
                    depressed
                  >
                    <v-icon size="30" center>mdi-file-excel</v-icon>
                  </v-btn>
                </template>
                <span>Cargar desde CSV</span>
              </v-tooltip>
            </v-col>
            <!-- <v-spacer></v-spacer> -->

            <v-col class="pa-0 px-0 d-flex justify-end">
              <v-btn
                color="green darken-1"
                class="white--text mr-3"
                large
                depressed
                @click="grabar_registro"
                :loading="loader.btn_grabar"
                :disabled="disabled.btn_grabar"
                >Guardar registro</v-btn
              >
              <v-btn
                color="indigo"
                class="white--text"
                large
                depressed
                @click="get_impresion"
                :loading="loader.btn_imprimir"
                :disabled="disabled.btn_imprimir"
                >Imprimir Comprobante</v-btn
              >
              <v-btn
                color="blue darken-1"
                class="white--text ml-3"
                large
                depressed
                @click="subir_soportes"
                :loading="loader.btn_up_soporte"
                :disabled="disabled.btn_up_soporte"
                >Subir soporte</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
        <v-divider color="#FF6F00"></v-divider>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogoEditar.estado" persistent max-width="600">
      <v-card class="pa-2">
        <!-- <v-card-title>
          <span class="title">{{ dialogoEditar.titulo }}</span>
        </v-card-title> -->
        <v-card-text class="pb-0">
          <v-form>
            <div class="pa-2 px-0">
              <v-row>
                <v-col class="d-flex pb-0" cols="12">
                  <v-autocomplete
                    label="Código de cuenta"
                    v-model="comprobanteEditar.cuentaContable"
                    :items="cuentasContables"
                    :item-text="format_cuentac"
                    item-value="cod_puc"
                    hide-details
                    clearable
                    return-object
                    outlined
                    @change="
                      validarFacturas();
                      get_facturas2();
                      facturasPendientes = [];
                    "
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
                <v-col class="d-flex pb-0" cols="12">
                  <v-autocomplete
                    label="Rut"
                    v-model="comprobanteEditar.rut"
                    item-value="descripcion_rut"
                    :items="tablaruts"
                    :item-text="format_ruts"
                    hide-details
                    return-object
                    clearable
                    outlined
                    :error="error.rut"
                    @change="
                      error.rut = false;
                      get_facturas2();
                      validar_ctr();
                      facturasPendientes = [];
                    "
                  >
                    <!-- <template v-slot:item="{ item }">
                      <table
                        font-family="arial, sans-serif"                       
                        border-collapse="collapse"
                        width="80%"
                      >
                        <tr background-color="#6589cd">
                          <td text-align="left" 
                             padding="5px">
                             {{ item.descripcion_rut.trim() }}</td>
                          <td></td>
                          <td>
                            {{ parseInt(item.identificacion_rut.trim()) }}
                          </td>
                        </tr>
                      </table>
                    </template> -->
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex pb-0" cols="6">
                  <v-text-field
                    label="Nro_Documento"
                    outlined
                    v-model="comprobanteEditar.documento"
                    hide-details
                    type="text"
                    required
                    :disabled="disabled.documento"
                    :error="error.documento"
                    @change="error.documento = false"
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
              </v-row>
              <v-row>
                <v-col
                  class="d-flex align-center mx-auto pb-0"
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
                  class="d-flex align-center mx-auto pb-0"
                  cols="12"
                  v-if="mostrarSelectFacturas"
                >
                  <v-autocomplete
                    label="Facturas pendientes_M"
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
                <v-col class="d-flex pb-0" cols="6">
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
                <v-col class="d-flex pb-0" cols="6">
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
                <v-col class="d-flex pb-0" cols="12">
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
                <v-col class="d-flex pb-0" cols="12">
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
              <v-row>
                <v-col cols="8" class="pb-0">
                  <v-text-field
                    outlined
                    label="Diferencia"
                    :value="`${formatNumero(
                      detalleTotales.debitos - detalleTotales.creditos
                    )}`"
                    hide-details
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="d-flex align-center justify-center pb-0">
                  <v-btn
                    small
                    color="red darken-2 white--text"
                    @click="cerrar_registro"
                    >Cargar Diferencia</v-btn
                  >
                </v-col>
              </v-row>
            </div>
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
              dialogoEditar.estado = false;
              initModificar();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ml-2"
            color="indigo"
            depressed
            dark
            text
            @click="guardarModificar"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_cxp.estado" persistent max-width="80%">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Cancelación Cuentas por Pagar</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col>
                  <v-autocomplete
                    label="Proveedor"
                    outlined
                    v-model="comprobante.rut"
                    :items="tablaruts"
                    :item-text="format_ruts"
                    return-object
                    @change="get_facturas_cxp()"
                    clearable
                  />
                </v-col>
              </v-row>
              <v-divider color="#FF6F00"></v-divider>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Facturas pendientes_C"
                    dense
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    v-model="buscar_pendientes"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    dense
                    :search="buscar_pendientes"
                    :headers="[
                      { text: 'Cuenta', value: 'descta_prov' },
                      { text: 'Fecha', value: 'fecha_prov' },
                      {
                        text: 'Factura',
                        value: 'documento_prov',
                        align: 'center',
                      },
                      //                      { text: 'Vence', value: 'fecha_prov' },
                      { text: 'Saldo', value: 'valor_prov', align: 'right' },
                      { text: 'Seleccionar', value: 'btn', align: 'center' },
                    ]"
                    :items="facturasPendientes_cancelacion"
                  >
                    <template v-slot:body.append>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="text-right"><b>Total: </b></td>
                        <td class="text-right">
                          $ {{ formatNumero(valor_total_pendientes_cxp) }}
                        </td>
                        <td></td>
                      </tr>
                    </template>
                    <template v-slot:item.btn="{ item }">
                      <v-btn
                        color="green"
                        fab
                        class="white--text mx-auto"
                        x-small
                        depressed
                        @click="seleccionar_item_cancelacion(item)"
                      >
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col>
                  <v-text-field
                    label="Detalle"
                    v-model="dialogo_cxp.detalle"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-divider color="#FF6F00"></v-divider>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Facturas seleccionadas"
                    dense
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    dense
                    :headers="[
                      { text: 'Fecha', value: 'fecha_prov' },
                      { text: 'Factura', value: 'documento_prov' },
                      { text: 'Vence', value: 'fecha_prov' },
                      { text: 'Saldo', value: 'valor_prov', align: 'right' },
                      { text: 'Modificar', value: 'btn', align: 'center' },
                      {
                        text: 'Quitar',
                        value: 'btn_eliminar',
                        align: 'center',
                      },
                    ]"
                    :items="dialogo_cxp.tabla_seleccionados"
                  >
                    <template v-slot:body.append>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="text-right"><b>Total: </b></td>
                        <td class="text-right">
                          $ {{ formatNumero(valor_total_seleccionados_cxp) }}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </template>
                    <template v-slot:item.factura="{ item }">
                      {{ item.pref_cart.trim() }}{{ item.numero_cart.trim() }}
                    </template>
                    <template v-slot:item.btn="{ item }">
                      <v-btn
                        color="blue"
                        fab
                        class="white--text mx-auto"
                        x-small
                        depressed
                        @click="modificar_item_cancelacion(item)"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:item.btn_eliminar="{ item }">
                      <v-btn
                        color="red"
                        fab
                        class="white--text mx-auto"
                        x-small
                        depressed
                        @click="eliminar_seleccion_cancelacion(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider color="#FF6F00"></v-divider>
          <v-row>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Valor Pagado"
                :value="formatNumero(dialogo_cxp.recibido)"
                outlined
                hide-details
                type="text"
                disabled
              ></v-text-field>
            </v-col>

            <v-col class="d-flex pb-0" cols="4">
              <v-autocomplete
                label="-Cuenta de Pago-"
                v-model="dialogo_cxp.cuentaPago"
                :items="cuentasContables"
                :item-text="format_cuentac"
                item-value="cod_puc"
                hide-details
                clearable
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-divider color="#FF6F00"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class
            color="red"
            text
            @click="
              dialogo_cxp.estado = false;
              facturasPendientes_cancelacion = [];
              dialogo_cxp.tabla_seleccionados = [];
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="white--text"
            color="indigo"
            @click="guardar_tabla_ctx"
            depressed
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_recaudo.estado" persistent max-width="80%">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Recaudo de cartera</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col>
                  <v-autocomplete
                    label="Cliente"
                    outlined
                    v-model="comprobante.rut"
                    :items="tablaruts"
                    :item-text="format_ruts"
                    return-object
                    @change="get_facturas(), clear_tabla_rec()"
                    clearable
                  />
                </v-col>
              </v-row>
              <v-divider color="#FF6F00"></v-divider>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Facturas pendientes"
                    dense
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    v-model="buscar_pendientes"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    dense
                    :search="buscar_pendientes"
                    :headers="[
                      { text: 'Fecha', value: 'fecha_cart' },
                      { text: 'Prefijo', value: 'pref_cart' },
                      { text: 'Factura', value: 'numero_cart' },
                      { text: 'Cuota', value: 'cuota_cart' },
                      { text: 'Vence', value: 'fechavence_cart' },
                      { text: 'Saldo', value: 'valor_cart', align: 'right' },
                      { text: 'Seleccionar', value: 'btn', align: 'center' },
                    ]"
                    :items="facturasPendientes"
                  >
                    <template v-slot:body.append>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="text-right"><b>Total: </b></td>
                        <td class="text-right">
                          $ {{ formatNumero(valor_total_facturas_pend) }}
                        </td>
                        <td></td>
                      </tr>
                    </template>

                    <template v-slot:item.btn="{ item }">
                      <v-btn
                        color="green"
                        fab
                        class="white--text mx-auto"
                        x-small
                        depressed
                        @click="seleccionar_item(item)"
                      >
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col>
                  <v-text-field
                    label="Detalle"
                    v-model="dialogo_recaudo.detalle"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-divider color="#FF6F00"></v-divider>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Facturas seleccionadas"
                    dense
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    dense
                    :headers="[
                      { text: 'Fecha', value: 'fecha_cart' },
                      { text: 'Prefijo', value: 'pref_cart' },
                      { text: 'Factura', value: 'numero_cart' },
                      { text: 'Cuota', value: 'cuota_cart' },

                      { text: 'Vence', value: 'fecha_cart' },
                      { text: 'Saldo', value: 'valor_cart', align: 'right' },
                      { text: 'Modificar', value: 'btn', align: 'center' },
                      {
                        text: 'Quitar',
                        value: 'btn_eliminar',
                        align: 'center',
                      },
                    ]"
                    :items="dialogo_recaudo.tabla_seleccionados"
                  >
                    <template v-slot:body.append>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="text-right"><b>Total: </b></td>
                        <td class="text-right">
                          $ {{ formatNumero(valor_total_seleccionados) }}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </template>
                    <template v-slot:item.factura="{ item }">
                      {{ item.pref_cart.trim() }}{{ item.numero_cart.trim() }}
                    </template>
                    <template v-slot:item.btn="{ item }">
                      <v-btn
                        color="blue"
                        fab
                        class="white--text mx-auto"
                        x-small
                        depressed
                        @click="modificar_item(item)"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:item.btn_eliminar="{ item }">
                      <v-btn
                        color="red"
                        fab
                        class="white--text mx-auto"
                        x-small
                        depressed
                        @click="eliminar_seleccion(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider color="#FF6F00"></v-divider>
          <v-row>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Rte.Fuente"
                v-model="form.rtefte"
                outlined
                hide-details
                type="text"
                @input="calcular_diferencia"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Rte.Ica"
                v-model="form.rteica"
                outlined
                hide-details
                type="text"
                @input="calcular_diferencia"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Dctos Comerciales"
                v-model="form.dctos"
                outlined
                hide-details
                type="text"
                @input="calcular_diferencia"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Dctos Estampillas"
                v-model="form.dctosestamp"
                outlined
                hide-details
                type="text"
                @input="calcular_diferencia"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                label="Valor Recibido"
                :value="formatNumero(recibido)"
                outlined
                hide-details
                type="text"
                disabled
              ></v-text-field>
            </v-col>

            <v-col class="d-flex pb-0" cols="4">
              <v-autocomplete
                label="Cuenta de Pago"
                v-model="comprobanteEditar.cuentaPago"
                :items="cuentasContables"
                :item-text="format_cuentac"
                item-value="cod_puc"
                hide-details
                clearable
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-divider color="#FF6F00"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class
            color="red"
            text
            @click="(dialogo_recaudo.estado = false), clear_tabla_rec()"
            >Cancelar</v-btn
          >
          <v-btn
            class="white--text"
            color="green"
            @click="guardar_tabla"
            depressed
            >Aceptar</v-btn
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
                      label="Documento_Nro"
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
                      label="Facturas pendientes"
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

    <v-dialog v-model="dialogo_modificar.estado" persistent max-width="400">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Modificar valor</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Valor"
                outlined
                clearable
                hide-details
                :value="formatNumero(dialogo_modificar.valor)"
                @input="input_mask()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="red darken-2"
                outlined
                depressed
                class="mr-2"
                @click="
                  dialogo_modificar.estado = false;
                  dialogo_modificar.index = null;
                  dialogo_modificar.valor = null;
                "
                >Cancelar</v-btn
              >
              <v-btn
                color="indigo"
                depressed
                class="white--text"
                @click="modificar_valor_item"
                >Aceptar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogo_modificar_cancelacion.estado"
      persistent
      max-width="400"
    >
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Modificar valor</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Valor"
                outlined
                clearable
                hide-details
                :value="formatNumero(dialogo_modificar_cancelacion.valor)"
                @input="input_mask_cancelacion()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="red darken-2"
                outlined
                depressed
                class="mr-2"
                @click="
                  dialogo_modificar_cancelacion.estado = false;
                  dialogo_modificar_cancelacion.index = null;
                  dialogo_modificar_cancelacion.valor = null;
                "
                >Cancelar</v-btn
              >
              <v-btn
                color="indigo"
                depressed
                class="white--text"
                @click="modificar_valor_item_ctx"
                >Aceptar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <div id="impresion_comp">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <table id="pdf_header_comp">
        <thead>
          <tr>
            <th>
              <img class="logo" :src="logoSrc" />
            </th>
            <th>
              <a class="nombre_print"></a>
              <br />Nit
              <a class="nit_print"></a>
            </th>
            <th colspan="5">
              <b class="nombredoc_print"></b>
              <br />
              <b>
                Número:
                <a class="consecutivo_print"></a>
              </b>
              <br />
              <b>Fecha:</b>
              <a class="fecha_print"></a>
              <br />
            </th>
          </tr>
        </thead>
      </table>
      <table id="pdf_body_comp">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cuenta</th>
            <th>Rut</th>
            <th>Documento</th>
            <th>c. costo</th>
            <th>Débito</th>
            <th>Crédito</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr style="border-top: 1px solid">
            <td colspan="5" style="padding-bottom: 40px">
              <b>TOTALES:</b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_debito"></b>
            </td>
            <td style="padding-bottom: 40px">
              <b class="total_credito"></b>
            </td>
            <td style="padding-bottom: 40px"></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <b>Revisó:</b>
            </td>
            <td colspan="2">
              <b>Generó:</b>
              <br />
              <a class="impreso_print"></a>
              <br />
              <a class="fechagen_print"></a>
            </td>
          </tr>
        </tfoot>
      </table>
    </div> -->

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
                clearable
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
            color="red darken-1"
            text
            @click="
              dialogo_csv.estado = false;
              dialogo_csv.archivo_csv = null;
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="indigo" text @click="validar_csv"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogo_archivo.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar documento</v-card-title>
        <v-card-text>
          <v-file-input
            label="Buscar PDF"
            outlined
            chips
            counter
            color="blue darken-1"
            hide-details
            :show-size="1000"
            accept="application/pdf"
            v-model="dialogo_archivo.model"
            id="archivo_pdf"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
          <v-btn
            depressed
            color="indigo"
            class="white--text px-12 mx-5"
            @click="up_file"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader_spinner">
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
import { formato_contable } from "../../_formatos.pdf.js";

export default {

  components: {
    FlowerSpinner,
    //JsonExcel
  },
  data() {
    return {
      pickerVence: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      loader_spinner: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      concep_envio: "0",
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
      search: "",
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 40) || "Maximo 40 digitos",
      ],
      validField: [(v) => !!v || "Campo es obligatorio"],

      recibido: 0,

      form: {
        rtefte: 0,
      },
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
        { text: "Documento", align: "center", value: "documento" },
        { text: "C.Costo", align: "center", value: "centroCosto" },
        { text: "Débitos", align: "right", value: "debitos" },
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
        btn_up_soporte: false,
      },
      disabled: {
        debitos: false,
        creditos: false,
        btn_grabar: false,
        btn_imprimir: true,
        btn_up_soporte: true,
        documento: false,
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
        fechavence: false,
        facturas: false,
      },
      print: {
        documento: null,
        consecutivo: null,
        fecha: null,
      },
      facturasPendientes: [],
      facturasPendientes_cancelacion: [],
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
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      dialogo_recaudo: {
        estado: false,
        tabla_seleccionados: [],
      },
      dialogo_cxp: {
        estado: false,
        tabla_seleccionados: [],
      },
      dialogo_modificar: {
        estado: false,
        index: null,
        valor: null,
      },
      dialogo_modificar_cancelacion: {
        estado: false,
        index: null,
        valor: null,
      },
      valor_total_seleccionados: 0,
      valor_total_seleccionados_cxp: 0,
      valor_total_facturas_pend: 0,
      buscar_pendientes: null,
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
    };
    this.cargar_empresa();
    this.cargarTabladocc();
    this.cargarTablaconceptos();
    this.cargarTablaruts();
    this.cargarTablaccostos();
    this.cargarTablactas();
    // this.cargarTablaconsec();
    this.$watch("detalle", (detalle) => {
      let tot_debitos = 0;
      let tot_creditos = 0;

      this.detalleTotales.debitos = 0;
      this.detalleTotales.creditos = 0;

      detalle.forEach((val) => {
        tot_debitos = parseFloat(val.debitos);
        tot_creditos = parseFloat(val.creditos);

        this.detalleTotales.debitos += tot_debitos;
        this.detalleTotales.creditos += tot_creditos;
      });
    });

    const _this = this;
    this.$watch(
      "facturasPendientes",
      (e) => {
        _this.valor_total_facturas_pend = 0;
        e.forEach((el) => {
          let valor =
            parseFloat(
              el.valor_cart.replace(/\,/g, "").replace(/\s\s+/g, "")
            ) || 0;
          _this.valor_total_facturas_pend += valor;
        });

        // _this.calcular_diferencia();
      },
      { deep: true }
    );

    this.$watch(
      "facturasPendientes_cancelacion",
      (e) => {
        _this.valor_total_pendientes_cxp = 0;
        e.forEach((el) => {
          let valor =
            parseFloat(
              el.valor_prov.replace(/\,/g, "").replace(/\s\s+/g, "")
            ) || 0;
          _this.valor_total_pendientes_cxp += valor;
        });

        // _this.calcular_diferencia();
      },
      { deep: true }
    );

    this.$watch(
      "dialogo_recaudo.tabla_seleccionados",
      (e) => {
        _this.valor_total_seleccionados = 0;
        e.forEach((el) => {
          let valor = parseFloat(el.valor_cart.replace(/\,/g, "")) || 0;
          _this.valor_total_seleccionados += valor;
        });

        _this.calcular_diferencia();
      },
      { deep: true }
    );

    this.$watch(
      "dialogo_cxp.tabla_seleccionados",
      (e) => {
        _this.valor_total_seleccionados_cxp = 0;
        e.forEach((el) => {
          let valor = parseFloat(el.valor_prov.replace(/\,/g, "")) || 0;
          _this.valor_total_seleccionados_cxp += valor;
        });

        _this.dialogo_cxp.recibido = _this.valor_total_seleccionados_cxp;
      },
      { deep: true }
    );
  },
  methods: {
    guardar_tabla_ctx() {
      const _this = this;
      let recibido = this.dialogo_cxp.recibido;
      let cuentaPago = this.dialogo_cxp.cuentaPago;

      if (recibido < 0) {
        this.send_error("El valor recibido debe ser mayor a 0");
      } else if (!cuentaPago) {
        this.send_error("Debe seleccionar la cuenta de pago");
      } else {
        let detalle = this.dialogo_cxp.tabla_seleccionados;
        let itemctapago = detalle.length - 1;
        let recibido = parseFloat(this.dialogo_cxp.recibido) || 0;
        let impuestos = [
          {
            codigoCuenta: cuentaPago.cod_puc,
            fvence: this.form.fecha_doc,
            valor: recibido,
            documento: detalle[itemctapago].documento_prov,
          },
        ];
        let detalle_recaudo = this.dialogo_cxp.detalle;
        let cliente = this.comprobante.rut;
        detalle.forEach((item) => {
          let debitos = parseFloat(item.valor_prov.replace(/\,/g, "")) || 0;
          let cuenta_cartera = this.cuentasContables.find(
            (el) => el.cod_puc == item.cuenta_prov
          );

          let obj = {
            centroCosto: "1001",
            codigoCuenta: item.cuenta_prov,
            fvence: item.fecha_prov,
            comprobante: {
              rut: cliente,
            },
            creditos: 0,
            debitos,
            descripcionCuenta: cuenta_cartera
              ? cuenta_cartera.descrip_puc.trim()
              : "",
            detalle: detalle_recaudo || "",
            documento: item.documento_prov,
            key: _this.get_key(),
            rut:
              cliente.identificacion_rut.trim() +
              " - " +
              cliente.descripcion_rut.trim(),
          };
          this.detalle.push(obj);
        });

        impuestos.forEach((item) => {
          if (item.valor) {
            let cuenta_cartera = this.cuentasContables.find(
              (el) => el.cod_puc == item.codigoCuenta
            );

            let obj = {
              centroCosto: "1001",
              codigoCuenta: item.codigoCuenta,
              fvence: item.fvence,
              comprobante: {
                rut: cliente,
              },
              creditos: item.valor,
              debitos: 0,
              descripcionCuenta: cuenta_cartera
                ? cuenta_cartera.descrip_puc.trim()
                : "",
              detalle: detalle_recaudo || "",
              documento: item.documento,
              key: _this.get_key(),
              rut:
                cliente.identificacion_rut.trim() +
                " - " +
                cliente.descripcion_rut.trim(),
            };

            this.detalle.push(obj);
          }
        });

        this.dialogo_cxp.estado = false;
        this.dialogo_cxp.tabla_seleccionados = [];
        this.facturasPendientes_cancelacion = [];
      }
    },
    guardar_tabla() {
      const _this = this;
      let recibido = this.recibido;
      let cuentaPago = this.comprobanteEditar.cuentaPago;

      if (recibido < 0) {
        this.send_error("El valor recibido debe ser mayor a 0");
      } else if (cuentaPago.length == 0) {
        this.send_error("Debe seleccionar la cuenta de pago");
      } else {
        let detalle = this.dialogo_recaudo.tabla_seleccionados;

        let rtefte = parseFloat(this.form.rtefte) || 0;
        let rteica = parseFloat(this.form.rteica) || 0;
        let rteestamp = parseFloat(this.form.dctosestamp) || 0;
        let dctos = parseFloat(this.form.dctos) || 0;
        let recibido = parseFloat(this.recibido) || 0;

        let impuestos = [
          {
            codigoCuenta: _this.empresa[0].ctartefte_empr,
            valor: rtefte,
          },
          {
            codigoCuenta: _this.empresa[0].ctarteica_empr,
            valor: rteica,
          },
          {
            codigoCuenta: _this.empresa[0].ctadctos_empr,
            valor: dctos,
          },
          {
            codigoCuenta: "5115950102",
            valor: rteestamp,
          },

          {
            codigoCuenta: _this.comprobanteEditar.cuentaPago.cod_puc,
            valor: recibido,
          },
        ];

        let detalle_recaudo = this.dialogo_recaudo.detalle;
        let cliente = this.comprobante.rut;

        detalle.forEach((item) => {
          let creditos = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;
          let cuenta_cartera = this.cuentasContables.find(
            (el) => el.cod_puc == _this.empresa[0].ctacartera_empr
          );

          let prefijo = item.pref_cart.padStart("4", " ");
          let obj = {
            centroCosto: "1001",
            codigoCuenta: _this.empresa[0].ctacartera_empr,
            comprobante: {
              rut: cliente,
            },
            creditos,
            debitos: 0,
            fvence: this.form.fecha_doc,
            descripcionCuenta: cuenta_cartera
              ? cuenta_cartera.descrip_puc.trim()
              : "",
            detalle: detalle_recaudo || "",
            documento: prefijo + item.numero_cart,
            key: _this.get_key(),
            rut:
              cliente.identificacion_rut.trim() +
              " - " +
              cliente.descripcion_rut.trim(),
          };
          this.detalle.push(obj);
        });

        impuestos.forEach((item) => {
          if (item.valor) {
            let cuenta_cartera = this.cuentasContables.find(
              (el) => el.cod_puc == item.codigoCuenta
            );

            let obj = {
              centroCosto: "1001",
              codigoCuenta: item.codigoCuenta,
              comprobante: {
                rut: cliente,
              },
              creditos: 0,
              debitos: item.valor,
              descripcionCuenta: cuenta_cartera
                ? cuenta_cartera.descrip_puc.trim()
                : "",
              detalle: detalle_recaudo || "",
              documento: "1",
              key: _this.get_key(),
              rut:
                cliente.identificacion_rut.trim() +
                " - " +
                cliente.descripcion_rut.trim(),
            };

            this.detalle.push(obj);
          }
        });

        this.dialogo_recaudo.estado = false;
        this.dialogo_recaudo.tabla_seleccionados = [];
      }
    },
    async calcular_diferencia() {
      let valor_total = this.valor_total_seleccionados;

      let rtefte = 0;
      this.netorecibido = 0;
      let porcrtefte = parseFloat(this.comprobante.rut.porcrtefte_rut);
      if (porcrtefte > 0) {
        rtefte = ((valor_total * porcrtefte) / 100).toFixed(0);
        this.form.rtefte = rtefte;
      } else {
        rtefte = parseFloat(this.form.rtefte);
      }

      let rteica = 0;
      let porcrteica = parseFloat(this.comprobante.rut.porcrteica_rut);
      if (porcrteica > 0) {
        rteica = ((valor_total * porcrteica) / 100).toFixed(0);
        this.form.rteica = rteica;
      } else {
        rteica = parseFloat(this.form.rteica);
      }

      let rteestamp = 0;
      let porcestamp = parseFloat(this.comprobante.rut.porcrteest_rut);
      if (porcestamp > 0) {
        rteestamp = ((valor_total * porcestamp) / 100).toFixed(0);
        this.form.dctosestamp = rteestamp;
      } else {
        rteestamp = parseFloat(this.form.dctosestamp);
      }

      let dctos = this.form.dctos || 0;

      let total =
        parseFloat(valor_total) -
        parseFloat(rtefte) -
        parseFloat(rteica) -
        parseFloat(rteestamp) -
        parseFloat(dctos);
      this.recibido = total;
    },

    modificar_valor_item_ctx() {
      let index = this.dialogo_modificar_cancelacion.index;
      let valor = this.formatNumero(this.dialogo_modificar_cancelacion.valor);

      this.$set(
        this.dialogo_cxp.tabla_seleccionados[index],
        "valor_prov",
        valor
      );

      this.dialogo_modificar_cancelacion.estado = false;
      this.dialogo_modificar_cancelacion.index = null;
      this.dialogo_modificar_cancelacion.valor = null;
    },
    modificar_valor_item() {
      let index = this.dialogo_modificar.index;
      let valor = this.formatNumero(this.dialogo_modificar.valor);

      this.$set(
        this.dialogo_recaudo.tabla_seleccionados[index],
        "valor_cart",
        valor
      );

      this.dialogo_modificar.estado = false;
      this.dialogo_modificar.index = null;
      this.dialogo_modificar.valor = null;
    },
    input_mask_cancelacion() {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.dialogo_modificar_cancelacion, "valor", val_edit);
    },
    input_mask() {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.dialogo_modificar, "valor", val_edit);
    },
    modificar_item_cancelacion(item) {
      let index = this.dialogo_cxp.tabla_seleccionados.indexOf(item);
      let valor = parseFloat(item.valor_prov.replace(/\,/g, "")) || 0;

      this.dialogo_modificar_cancelacion.index = index;
      this.dialogo_modificar_cancelacion.valor = valor;
      this.dialogo_modificar_cancelacion.estado = true;
    },
    modificar_item(item) {
      let index = this.dialogo_recaudo.tabla_seleccionados.indexOf(item);
      let valor = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;

      this.dialogo_modificar.index = index;
      this.dialogo_modificar.valor = valor;
      this.dialogo_modificar.estado = true;
    },
    eliminar_seleccion_cancelacion(item) {
      let array = JSON.parse(
        JSON.stringify(this.dialogo_cxp.tabla_seleccionados)
      );

      let index = this.dialogo_cxp.tabla_seleccionados.indexOf(item);
      array.splice(index, 1);

      this.dialogo_cxp.tabla_seleccionados = [];
      this.$set(this.dialogo_cxp, "tabla_seleccionados", array);
    },
    eliminar_seleccion(item) {
      let array = JSON.parse(
        JSON.stringify(this.dialogo_recaudo.tabla_seleccionados)
      );

      let index = this.dialogo_recaudo.tabla_seleccionados.indexOf(item);
      array.splice(index, 1);

      this.dialogo_recaudo.tabla_seleccionados = [];
      this.$set(this.dialogo_recaudo, "tabla_seleccionados", array);
    },
    seleccionar_item_cancelacion(item) {
      let copia = JSON.parse(JSON.stringify(item));
      let existe = this.dialogo_cxp.tabla_seleccionados.find(
        (el) =>
          el.agencia_prov.trim() == item.agencia_prov.trim() &&
          el.documento_prov.trim() == item.documento_prov.trim()
      );
      if (!existe) {
        this.dialogo_cxp.tabla_seleccionados.push(copia);
      }
    },
    seleccionar_item(item) {
      let copia = JSON.parse(JSON.stringify(item));
      let existe = this.dialogo_recaudo.tabla_seleccionados.find(
        (el) =>
          el.pref_cart.trim() == item.pref_cart.trim() &&
          el.cuota_cart.trim() == item.cuota_cart.trim() &&
          el.numero_cart.trim() == item.numero_cart.trim()
      );
      if (!existe) {
        this.dialogo_recaudo.tabla_seleccionados.push(copia);
      }
    },
    cerrar_registro() {
      let debitos = parseFloat(this.detalleTotales.debitos).toFixed(2);
      let creditos = parseFloat(this.detalleTotales.creditos).toFixed(2);
      let total = debitos - creditos;

      if (total > 0) {
        this.comprobanteEditar.creditos = total;
        this.disabled.creditos = false;
        this.disabled.debitos = true;
      } else {
        this.comprobanteEditar.debitos = total * -1;
        this.disabled.debitos = false;
        this.disabled.creditos = true;
      }
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
            // array.pop();

            var rut = _this.dialogo_csv.rut;
            var fecha = null;

            array.forEach((el, index) => {
              let parse = el.split(",");

              if (index == 0) {
                let fecha_temp = parse[3].split("/");
                fecha_temp = fecha_temp.reverse();
                fecha_temp[2] = fecha_temp[2].padStart(2, "0");
                fecha = fecha_temp.join("-");
                // _this.form.fecha_doc = fecha;
              }
              var comprobante = JSON.parse(JSON.stringify(_this.comprobante));
              comprobante.rut = rut;

              var busqueda_ccosto = _this.tablaccosto.find(
                (item) => item.centro_cost + item.subcentro_cost == "1001"
              );
              comprobante.ccosto = busqueda_ccosto;

              let parse_documento = parse[6].match(/[a-zA-Z]+|[0-9]+/g);

              var documento =
                parse_documento[0].padEnd(4, " ") + parse_documento[1];
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
    up_file() {
      var file = this.dialogo_archivo.model;
      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        var ruta = `${this.dialogo_archivo.ruta_pdf}`;
        var archivo = new FormData();
        archivo.append("pdf", file);
        archivo.append("nombre_pdf", ruta);

        fetch("https://server100ts.net/up.pdf.php", {
          method: "POST",
          body: archivo,
        })
          .then((res) => res.json())
          .catch((err) => {
            this.dialogo_archivo.loader = false;
            this.send_error("Ha ocurrido un error subiendo el PDF");
          })
          .then((res) => {
            this.dialogo_archivo.loader = false;
            if (res.code == 0) {
              this.cancelar_subida();

              this.$emit("snack", {
                color: "success",
                text: res.msj,
                estado: true,
              });
            } else {
              this.cancelar_subida();
              this.send_error(res.msj);
            }
          });
      }
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
    },
    subir_soportes() {
      let data = this.form;

      if (!data.tipoDocumento) {
        this.send_error("Debe seleccionar un tipo de documento");
      } else {
        this.dialogo_archivo.estado = true;
        let empresa = sessionStorage.Sesion.substr(0, 15);
        let tipoDocumento =
          data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
        let consecutivo = this.print.consecutivo;
        var fecha = data.fecha_doc.split("-")[0] + data.fecha_doc.split("-")[1];

        this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo
          .trim()
          .padStart(12, "0")}_${fecha}`;
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
          rut: null,
          centroCosto: null,
          fvence: this.$moment().format("YYYY-MM-DD"),
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
    },
    grabar_registro() {
      var data = this.form;
      let tot_debitos = parseFloat(this.detalleTotales.debitos).toFixed(2);
      let tot_creditos = parseFloat(this.detalleTotales.creditos).toFixed(2);

      if (!data.tipoDocumento) {
        this.error.tipoDocumento = true;
        this.send_error("Debe seleccionar un tipo de documento");
      } else if (this.detalle.length == 0) {
        this.send_error("Debe agregar al menos un comprobante");
      } else if (tot_debitos != tot_creditos) {
        this.send_error("El total de débitos y créditos deben ser iguales");
      } else {
        var sesion = sessionStorage.Sesion;
        var fecha = data.fecha_doc.replace(/\-/g, "");
        var agencia = data.tipoDocumento.agencia_docc;
        var tipodoc = data.tipoDocumento.codigo_docc;
        var tipoDocumento =
          data.tipoDocumento.agencia_docc + data.tipoDocumento.codigo_docc;
        var consecutivo = data.consecutivo;
        var tipoconsec = data.tipoDocumento.numeracion_docc;
        let concep_envio = this.concep_envio ? this.concep_envio : "0";
        let nrorotativo = 0;

        if (this.rotativo == 1) {
          nrorotativo = parseFloat(this.dato_rotativo.nro_rotativo);
        }
        let tiponumer = data.tipoDocumento.numeracion_docc;

        let datosEnvio =
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
          tipoconsec +
          "|" +
          concep_envio +
          "|" +
          tiponumer +
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
          el.iva = el.iva.toFixed(2);
          el.debitos = el.debitos.toFixed(2);
          el.creditos = el.creditos.toFixed(2);
          el.fvence = el.fvence ? el.fvence : "";
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
        this.format_envio(datosEnvio, detalle_format, tipoDocumento, fecha);
      }
    },
    format_envio(importarhtml, data, tipoDocumento, fecha) {
      let tablaEnvio = {};
      let indextab = 0;
      data.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(5, "0");
        let codigo = item.codigoCuenta;
        let rut = item.numRut;
        let prefijo = item.prefijo;
        let documento = item.documento.trim();
        let debitos = item.debitos;
        let creditos = item.creditos;
        let centroCosto = item.centroCosto;
        let iva = item.iva;
        let detalle = item.detalle;
        let fvence = item.fvence;
        let nrocredito = item.nrocredito;
        let cuota = item.nrocuota;
        indextab = format_index;

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${codigo}|${rut}|${prefijo}|${documento}|${debitos}|${creditos}|${centroCosto}|${iva}|${detalle}|${fvence}|${nrocredito}|${cuota}`;
      });

      importarhtml = importarhtml + indextab + "|";

      let datos = {
        url: "Financiero/dlls/PrRegcont.dll",
        data: { importarhtml, ...tablaEnvio },
        method: "",
        json: true,
      };
      post
        .postData(datos)
        .then((data) => {
          this.loader.btn_grabar = false;
          this.disabled.btn_grabar = false;
          this.disabled.btn_imprimir = false;
          this.disabled.btn_up_soporte = false;

          this.print.documento = tipoDocumento;
          this.print.consecutivo = data[0];
          this.print.fecha = fecha.substring(0, 6);
          this.resetFormulario();
          this.getConsecutivo();
        })
        .catch((error) => {
          console.log(error);
          this.loader.btn_grabar = false;
          this.disabled.btn_grabar = false;
          this.send_error("Error al grabar el registro contable");
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
          this.generar_pdf(data[0]);
        })
        .catch((err) => {
          this.disabled.btn_imprimir = false;
          this.loader.btn_imprimir = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    generar_pdf(data) {
      let tipo_documento = this.form.tipoDocumento.descrip_docc;

      data.tipo_documento = tipo_documento;
      data.empresa = this.empresa[0];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        formato_contable(data).then(() => {
          console.log("Impresión finalizada");
        });
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
          busqueda.documento =
            item.facturas.pref_cart + item.facturas.numero_cart.trim();
          // busqueda.creditos =
          //   parseFloat(item.facturas.valor_cart.replace(/\,/g, "")) || 0;
        } else {
          busqueda.documento = item.documento;
          // let creditos =
          //   parseFloat(item.creditos.toString().replace(/\,/g, "")) || 0;
          // busqueda.creditos = creditos;
        }

        let rut = parseInt(item.rut.identificacion_rut) || 0;
        let debitos =
          parseFloat(item.debitos.toString().replace(/\,/g, "")) || 0;
        busqueda.debitos = debitos;

        let creditos =
          parseFloat(item.creditos.toString().replace(/\,/g, "")) || 0;
        busqueda.creditos = creditos;

        busqueda.codigoCuenta =
          item.cuentaContable.cod_puc || item.cuentaContable;
        busqueda.descripcionCuenta =
          item.cuentaContable.descrip_puc || item.descripCuenta;
        // busqueda.rut = rut + " - " + item.rut.descripcion;
        busqueda.rut = rut + " - " + item.rut.descripcion_rut;
        busqueda.centroCosto =
          item.ccosto.centro_cost + "" + item.ccosto.subcentro_cost;
        busqueda.detalle = item.detalle;

        busqueda.comprobante.rut = item.rut;
        busqueda.fvence = item.fvence;
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

            let porcentaje_base = porc_puc / 100;
            let valor = (base_rte * porcentaje_base).toFixed(0);

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
        var carteraEmpresa = this.empresa[0].mayorcartera_empr;
        let mayorpuc = item.cod_puc.trim().substring(0, 4);

        if (carteraEmpresa == mayorpuc) {
          this.mostrarSelectFacturas = true;
          this.disabled.documento = true;
        } else {
          this.mostrarSelectFacturas = false;
          this.disabled.documento = false;
        }
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
      var cta = this.comprobanteEditar.cuentaContable.cod_puc;
      var rut = this.comprobanteEditar.rut;
      var sesion = sessionStorage.Sesion;
      var fecha = this.form.fecha_doc.replace(/\-/g, "");

      if (cuenta.ctrdoc_puc == "1" && rut) {
        var datosEnvio =
          sesion + "|" + rut.identificacion_rut + "|" + fecha + "|" + cta + "|";
        post
          .postData({
            url: "Financiero/dlls/PrDocumentoJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.mostrarSelectFacturas = true;
            var filtro = data.filter((e) => e.numero_cart);
            this.loader.facturas = false;
            if (filtro.length == 0) {
              this.send_error("No hay documentos para descargar");
              this.facturasPendientes = [];
            } else this.facturasPendientes = filtro;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Sin facturas pendientes");
          });
      }
    },
    asignar_faacturaModificar() {
      let tipocta = parseInt(
        this.comprobanteEditar.cuentaContable.cod_puc.substring(0, 1)
      );
      let factura = this.comprobanteEditar.facturas;

      if (factura) {
        let valor =
          parseFloat(
            factura.valor_cart.replace(/\s\s+/g, "").replace(/\,/g, "")
          ) || 0;
        let creditos = 0;
        let debitos = 0;

        switch (tipocta) {
          case 1:
            if (valor > 0) {
              creditos = valor;
            } else {
              debitos = valor * 1;
            }
            break;
          case 2:
            if (valor > 0) {
              debitos = valor;
            } else {
              creditos = valor * -1;
            }
            break;
          case 3:
            if (valor > 0) {
              debitos = valor;
            } else {
              creditos = valor * -1;
            }
            break;
          case 4:
            if (valor > 0) {
              debitos = valor;
            } else {
              creditos = valor * -1;
            }
            break;
          case 5:
            if (valor < 0) {
              creditos = valor;
            } else {
              debitos = valor;
            }
            break;
          case 6:
            if (valor < 0) {
              creditos = valor;
            } else {
              debitos = valor;
            }
            break;
          case 7:
            if (valor < 0) {
              creditos = valor;
            } else {
              debitos = valor;
            }
            break;
        }

        this.comprobanteEditar.documento =
          factura.pref_cart.trim() + factura.numero_cart.trim();
        this.comprobanteEditar.fvence = factura.fechavence_cart;
        this.comprobanteEditar.creditos = creditos;
        this.comprobanteEditar.debitos = debitos;
      } else {
        this.comprobanteEditar.documento = null;
      }
    },
    getDetalleConcepto() {
      let codigo = this.comprobante.conc_conta
        ? this.comprobante.conc_conta.codigo_conc
        : false;
      this.concep_envio = codigo;

      if (codigo === "0001") {
        this.dialogo.estado = false;
        this.dialogo_cxp.estado = true;
      }

      if (codigo === "0002") {
        this.dialogo.estado = false;
        this.dialogo_recaudo.estado = true;
      }

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
        this.validarDatos(datos);
        this.initComprobante();
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

        // Agregar reteica
        var reteica = concepto.ctaicav_conc;
        var porcReteica = parseFloat(reteica.porc_conc) || 0;
        var baseReteica = parseFloat(reteica.base_conc) || 0;
        var valorPorcica = 0;
        var valorReteica = 0;

        if (porcReteica > 0) {
          if (baseReteica == 0) {
            valorPorcica = porcReteica / 1000;
            valorReteica = valorPorcica * valor;
          } else {
            if (baseReteica < valor) {
              valorPorcica = porcReteica / 1000;
              valorReteica = valorPorcica * valor;
            }
          }

          if (valorReteica > 0) {
            this.detalle.push({
              codigoCuenta: comprobante.conc_conta.ctaicav_conc.codigo_conc,
              descripcionCuenta:
                comprobante.conc_conta.ctaicav_conc.descripcta_conc,
              documento,
              rut,
              centroCosto,
              debitos: 0,
              creditos: parseFloat(valorReteica.toFixed(0)),
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
        var valorCredito = valor + iva - valorRetencion - valorReteica;
        if (valorCredito > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctacre_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctacre_conc.descripcta_conc,
            documento,
            rut,
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
                el.codigoCuenta == this.empresa[0].ctacartera_empr.trim() &&
                el.documento == key_factura
            );

            if (!verificar) {
              var valor = parseFloat(item.valor_cart.replace(/\,/g, "")) || 0;

              this.detalle.push({
                codigoCuenta: cuentaFacturas.cod_puc,
                descripcionCuenta: cuentaFacturas.descrip_puc,
                documento: key_factura,
                rut,
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
      return (
        parseFloat(`${val.identificacion_rut}`) + "-" + `${val.descripcion_rut}`
      );
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_factPendientes: function (val) {
      return `${val.pref_cart.trim()}${val.numero_cart.trim()} - ${val.valor_cart.trim()} - Fecha: ${val.fecha_cart.trim()}`;
    },
    get_facturas_csv() {
      this.dialogo_csv.estado = false;
      var _this = this;
      this.loader_spinner = true;
      return new Promise((resolve, reject) => {
        var rut = this.dialogo_csv.rut;
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        var datosEnvio =
          sesion + "|" + rut.identificacion_rut + "|" + fecha + "|";
        post
          .postData({
            url: "Plazos/dlls/PrCarteraJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader_spinner = false;
            data.pop();
            var filtro = data.filter((e) => e.numero_cart);
            resolve(filtro);
          })
          .catch((err) => {
            this.loader_spinner = false;
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
            url: "Plazos/dlls/PrCarteraJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.numero_cart);
            filtro = filtro.map((el) => {
              el.factura = el.pref_cart.trim() + el.numero_cart.trim();

              return el;
            });

            this.loader.facturas = false;
            this.facturasPendientes = filtro;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
    },
    get_facturas_cxp() {
      this.facturasPendientes_cancelacion = [];
      this.dialogo_cxp.tabla_seleccionados = [];

      this.comprobante.facturas = null;
      var rut = this.comprobante.rut;
      this.loader.facturas = true;

      if (rut) {
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        var cuenta = "9999999999";
        var sesion = sessionStorage.Sesion;
        var datosEnvio =
          sesion +
          "|" +
          rut.identificacion_rut +
          "|" +
          fecha +
          "|" +
          cuenta +
          "|";

        post
          .postData({
            url: "Financiero/dlls/PrProveedorJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            var filtro = data.filter((e) => e.agencia_prov);
            // filtro = filtro.map((el) => {
            //   el.factura = el.pref_cart.trim() + el.numero_cart.trim();

            //   return el;
            // });

            this.loader.facturas = false;
            this.facturasPendientes_cancelacion = filtro;
          })
          .catch((err) => {
            this.loader.facturas = false;
            this.send_error("Error al cargar facturas pendientes");
          });
      }
    },
    get_facturas2() {
      var cuenta = this.comprobanteEditar.cuentaContable;
      let mayor_puc = cuenta.cod_puc.trim().substring(0, 4);
      var ctacartera_empr = this.empresa[0].mayorcartera_empr;
      if (mayor_puc == ctacartera_empr) {
        this.comprobanteEditar.facturas = null;
        var rut = this.comprobanteEditar.rut;

        if (rut && cuenta.ctrdoc_puc != "1") {
          this.loader.facturas = true;
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

              this.loader.facturas = false;
              this.facturasPendientes = filtro;
            })
            .catch((err) => {
              this.loader.facturas = false;
              this.send_error("Error al cargar facturas pendientes");
            });
        }
      }
    },
    cargarTabladocc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfDoccontabJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|" + "0" + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.docc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Documento Contable");
        });
    },
    getConsecutivo() {
      var tipoDocumento = this.form.tipoDocumento;
      if (tipoDocumento) {
        // var puntoFact = tipoDocumento.agencia_docc + tipoDocumento.codigo_docc;
        var agencia = tipoDocumento.agencia_docc;
        var documento = tipoDocumento.codigo_docc;
        var tipo_cons = tipoDocumento.numeracion_docc;
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        this.loader.consecutivo = true;
        this.form.consecutivo = null;
        post
          .postData({
            url: "Financiero/dlls/PrConsecutivoJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              1 +
              "|" +
              agencia +
              "|" +
              documento +
              "|" +
              tipo_cons +
              "|" +
              fecha +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader.consecutivo = false;
            let bloqueo = data[0].bloqueo_cons;
            if (bloqueo === "1") {
              this.send_error(
                "Mes con Bloqueo!! No puede agregar más documentos"
              );
              this.disabled.btn_grabar = true;
            } else {
              this.form.consecutivo = data[0].nro_cons.trim();
              this.disabled.btn_grabar = false;
            }
          })
          .catch((err) => {
            this.loader.consecutivo = false;
            this.send_error("Error al cargar Consecutivo");
          });
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

    clear_tabla_rec() {
      this.comprobanteEditar.cuentaPago = [];
      this.form.recibido = 0;
      this.form.dctosestamp = 0;
      this.form.dctos = 0;
      this.form.rteica = 0;
      this.form.rtefte = 0;
      this.dialogo_recaudo.tabla_seleccionados = [];
      this.dialogo_recaudo.detalle = "";
      this.facturasPendientes = [];
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
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
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
