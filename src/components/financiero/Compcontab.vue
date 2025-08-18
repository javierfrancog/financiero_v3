<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="1400" elevation="8" rounded="xl">
          <v-card-title class="bg-gradient-primary text-white pa-6">
            <v-row align="center" no-gutters>
              <v-col class="d-flex align-center">
                <div class="icon-wrapper me-4">
                  <v-icon size="24" color="white"
                    >mdi-file-document-edit</v-icon
                  >
                </div>
                <div>
                  <h2 class="text-h4 font-weight-bold mb-1">
                    Registro Contable
                  </h2>
                  <p class="text-subtitle-1 mb-0 text-blue-lighten-4">
                    Sistema de comprobantes financieros
                  </p>
                </div>
              </v-col>
              <v-col cols="auto">
                <v-chip
                  color="white"
                  text-color="primary"
                  variant="elevated"
                  size="small"
                >
                  <v-icon start size="16">mdi-shield-check</v-icon>
                  Seguro
                </v-chip>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row class="mb-4">
              <v-col class="d-flex" cols="12" md="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="form.fecha_doc"
                      label="Fecha"
                      prepend-inner-icon="mdi-calendar"
                      variant="outlined"
                      density="comfortable"
                      v-bind="props"
                      color="primary"
                      class="rounded-lg"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_doc"
                    @update:model-value="onFechaChange"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" md="6">
                <v-autocomplete
                  label="Tipo Documento"
                  v-model="form.tipoDocumento"
                  :items="docc"
                  :item-title="format_docc"
                  variant="outlined"
                  density="comfortable"
                  return-object
                  clearable
                  @update:model-value="onTipoDocumentoChange"
                  :error="error.tipoDocumento"
                  prepend-inner-icon="mdi-file-document"
                  color="primary"
                  class="rounded-lg"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" md="3">
                <v-text-field
                  label="Consecutivo"
                  clearable
                  variant="outlined"
                  density="comfortable"
                  type="text"
                  disabled
                  v-model="form.consecutivo"
                  :loading="loader.consecutivo"
                  class="rounded-lg"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6" color="primary" thickness="2"></v-divider>

            <v-row class="mb-4" align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="me-3" size="20"
                    >mdi-clipboard-list</v-icon
                  >
                  <h3 class="text-h6 font-weight-medium text-primary mb-0">
                    Detalle del Comprobante
                  </h3>
                </div>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="
                    dialogo.estado = true;
                    dialogo.titulo = 'Agregar comprobante_';
                    comprobante.conc_conta = null;
                  "
                  :disabled="!form.tipoDocumento"
                  class="px-6"
                >
                  <v-icon size="18" start>mdi-book-plus</v-icon>
                  Usar Conceptos
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="mb-4" justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Buscar en registros"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  color="primary"
                  class="rounded-lg"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card variant="outlined" class="rounded-lg overflow-hidden">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                v-model:expanded="expanded"
                item-key="key"
                show-expand
                disable-pagination
                hide-default-footer
                class="elevation-0"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4">
                    <b>Detalle:</b>
                    {{ item.detalle }}
                    <b>Cuota:</b>
                    {{ item.cuota }}
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
                  <div class="d-flex ga-2">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="error"
                          variant="text"
                          size="small"
                          icon
                          v-bind="props"
                          @click="deleteItem(item)"
                        >
                          <v-icon size="18">mdi-delete-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Eliminar item</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          icon
                          v-bind="props"
                          @click="editItem(item)"
                        >
                          <v-icon size="18">mdi-pencil-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar Registro</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>

          <v-divider class="my-0" color="primary" thickness="1"></v-divider>

          <v-card-actions class="pa-6 bg-grey-lighten-5">
            <v-row align="center" no-gutters>
              <v-col>
                <div class="d-flex gap-3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="primary"
                        variant="outlined"
                        size="large"
                        icon
                        @click="
                          cargarTablaruts(),
                            cargarTablaconceptos(),
                            cargarTablaccostos(),
                            cargarTablactas()
                        "
                      >
                        <v-icon size="20">mdi-refresh</v-icon>
                      </v-btn>
                    </template>
                    <span>Actualizar Tablas</span>
                  </v-tooltip>

                  <v-tooltip
                    bottom
                    v-if="
                      form.tipoDocumento &&
                      (form.tipoDocumento.codigo_docc == '001' ||
                        form.tipoDocumento.codigo_docc == '003')
                    "
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="success"
                        variant="outlined"
                        size="large"
                        icon
                        @click="open_csv()"
                      >
                        <v-icon size="20">mdi-file-excel</v-icon>
                      </v-btn>
                    </template>
                    <span>Cargar desde CSV</span>
                  </v-tooltip>
                </div>
              </v-col>

              <v-col class="d-flex justify-end gap-3">
                <v-btn
                  color="success"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="grabar_registro"
                  :loading="loader.btn_grabar"
                  :disabled="disabled.btn_grabar"
                  class="px-8"
                >
                  <v-icon start size="18">mdi-content-save</v-icon>
                  Guardar Registro
                </v-btn>

                <v-btn
                  color="info"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="get_impresion"
                  :loading="loader.btn_imprimir"
                  :disabled="disabled.btn_imprimir"
                  class="px-8"
                >
                  <v-icon start size="18">mdi-printer</v-icon>
                  Imprimir
                </v-btn>

                <v-btn
                  color="purple"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  @click="subir_soportes"
                  :loading="loader.btn_up_soporte"
                  :disabled="disabled.btn_up_soporte"
                  class="px-8"
                >
                  <v-icon start size="18">mdi-cloud-upload</v-icon>
                  Subir Soporte
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>

          <v-divider class="my-0" color="primary" thickness="1"></v-divider>
        </v-card>
      </v-col>

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
                      :item-title="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      clearable
                      return-object
                      @keyup.enter="focusNextField('rut-1')"
                      @update:model-value="
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
                      label="Rut-1"
                      v-model="comprobanteEditar.rut"
                      item-value="descripcion_rut"
                      :items="tablaruts"
                      :item-title="format_ruts"
                      hide-details
                      return-object
                      clearable
                      id="rut-1"
                      :error="error.rut"
                      @keyup.enter="focusNextField('nro_doc')"
                      @update:model-value="
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
                      id="nro_doc"
                      required
                      :disabled="disabled.documento"
                      :error="error.documento"
                      @update:model-value="error.documento = false"
                      @keyup.enter="focusNextField('fvence')"
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
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          label="Fecha Vencimiento"
                          v-model="comprobanteEditar.fvence"
                          hide-details
                          v-bind="props"
                          id="fvence"
                          @keyup.enter="focusNextField('inputDebitos')"
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
                      :item-title="format_factPendientes"
                      hide-details
                      return-object
                      :loading="loader.facturas"
                      chips
                      small-chips
                      :error="error.facturas"
                      @update:model-value="
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
                      id="inputDebitos"
                      @keyup.enter="focusNextField('detalle')"
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
                      @keyup.enter="focusNextField('detalle')"
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
                      id="detalle"
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
                      :item-title="format_ccosto"
                      hide-details
                      return-object
                      :error="error.ccosto"
                      @update:model-value="error.ccosto = false"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
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
                  <v-col
                    cols="5"
                    class="d-flex mt-2 ml-11 justify-end "
                  >
                    <v-btn
                      class="text"
                      depressed
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
              @click="validar_documento"
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
                      v-model="comprobante.rut"
                      :items="tablaruts"
                      :item-title="format_ruts"
                      return-object
                      @update:model-value="get_facturas_cxp()"
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
                        { title: 'Cuenta', value: 'descta_prov' },
                        { title: 'Fecha', value: 'fecha_prov' },
                        {
                          title: 'Factura',
                          value: 'documento_prov',
                          align: 'center',
                        },
                        //                      { title: 'Vence', value: 'fecha_prov' },
                        { title: 'Saldo', value: 'valor_prov', align: 'right' },
                        { title: 'Seleccionar', value: 'btn', align: 'center' },
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
                        { title: 'Fecha', value: 'fecha_prov' },
                        { title: 'Factura', value: 'documento_prov' },
                        { title: 'Vence', value: 'fecha_prov' },
                        { title: 'Saldo', value: 'valor_prov', align: 'right' },
                        { title: 'Modificar', value: 'btn', align: 'center' },
                        {
                          title: 'Quitar',
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
            <v-row class="mt-2 mb-1">
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
                  :item-title="format_cuentac"
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
                      v-model="comprobante.rut"
                      :items="tablaruts"
                      :item-title="format_ruts"
                      return-object
                      @update:model-value="get_facturas(), clear_tabla_rec()"
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
                        { title: 'Fecha', value: 'fecha_cart' },
                        { title: 'Prefijo', value: 'pref_cart' },
                        { title: 'Factura', value: 'numero_cart' },
                        { title: 'Vence', value: 'fechavence_cart' },
                        { title: 'Saldo', value: 'valor_cart', align: 'right' },
                        { title: 'Seleccionar', value: 'btn', align: 'center' },
                      ]"
                      :items="facturasPendientes"
                    >
                      <template v-slot:body.append>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="text-right"><b>Total: </b></td>
                          <td class="text-right">
                            <b>
                              $ {{ formatNumero(valor_total_facturas_pend) }}</b
                            >
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
                        { title: 'Fecha', value: 'fecha_cart' },
                        { title: 'Prefijo', value: 'pref_cart' },
                        { title: 'Factura', value: 'numero_cart' },
                        { title: 'Vence', value: 'fecha_cart' },
                        { title: 'Saldo', value: 'valor_cart', align: 'right' },
                        { title: 'Modificar', value: 'btn', align: 'center' },
                        {
                          title: 'Quitar',
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
                          <td></td>
                          <td class="text-right"><b>Total: </b></td>
                          <td class="text-right">
                            <b>
                              $ {{ formatNumero(valor_total_seleccionados) }}</b
                            >
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
                          <v-icon>mdi-pencil-outline</v-icon>
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
            <v-row class="mt-1">
              <!-- <v-col class="d-flex pb-0" cols="2">
              <v-switch
                v-model="form.calc_imptos"
                label="No Calcular Impuestos"
                hide-details
                @change="calcular_diferencia()"
              ></v-switch>
            </v-col>
 -->
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Rte.Fuente"
                  v-model="form.rtefte"
                  outlined
                  hide-details
                  type="text"
                  @input="calcular_diferencia()"
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
            </v-row>
            <v-row class="mt-1 mb-1">
              <v-col class="d-flex pb-0" cols="4">
                <v-autocomplete
                  label="Cuenta de Pago"
                  v-model="comprobanteEditar.cuentaPago"
                  :items="cuentasContables"
                  :item-title="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  clearable
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-divider class="mt-4" color="#FF6F00"></v-divider>
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
                      :item-title="format_conceptos"
                      hide-details
                      return-object
                      outlined
                      clearable
                      :error="error.conc_conta"
                      @update:model-value="onConceptoChange"
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
                        label="Rut-x"
                        v-model="comprobante.rut"
                        :items="tablaruts"
                        :item-title="format_ruts"
                        hide-details
                        return-object
                        outlined
                        clearable
                        :error="error.rut"
                        @keyup.enter="focusNextField('nrodoc')"
                        @update:model-value="
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
                        id="nrodoc"
                        clearable
                        outlined
                        v-model="comprobante.documento"
                        hide-details
                        @keyup.enter="focusNextField('antesiva')"
                        :error="error.documento"
                        @update:model-value="error.documento = false"
                      ></v-text-field>
                    </v-col>

                    <v-col class="d-flex align-center mx-auto" cols="12" v-else>
                      <v-autocomplete
                        label="Facturas/Cuotas pendientes"
                        v-model="comprobante.facturas"
                        :items="facturasPendientes"
                        :item-title="format_factPendientes"
                        hide-details
                        return-object
                        outlined
                        :loading="loader.facturas"
                        multiple
                        chips
                        small-chips
                        :error="error.facturas"
                        @update:model-value="error.facturas = false"
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
                        id="antesiva"
                        required
                        v-model="comprobante.valor"
                        suffix="$"
                        hide-details
                        ref="inputValor"
                        clearable
                        @keyup.enter="focusNextField('vlriva')"
                        v-on:input="formatInput('valor')"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="6">
                      <v-text-field
                        label="Valor Iva"
                        outlined
                        type="text"
                        required
                        id="vlriva"
                        v-model="comprobante.iva"
                        suffix="$"
                        hide-details
                        clearable
                        @keyup.enter="focusNextField('detalle')"
                        v-on:input="formatInput('iva')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <v-row>
                  <v-col class="d-flex" cols="12">
                    <v-textarea
                      label="Detalle"
                      id="detalle"
                      clearable
                      outlined
                      v-model="comprobante.detalle"
                      @keyup.enter="focusNextField('ccosto')"
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
                      id="ccosto"
                      v-model="comprobante.ccosto"
                      :items="tablaccosto"
                      :item-title="format_ccosto"
                      hide-details
                      return-object
                      outlined
                      :error="error.ccosto"
                      @update:model-value="error.ccosto = false"
                      @keyup.enter="focusNextField('agregar')"
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
              <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas cp
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
              id="agregar"
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

      <v-dialog v-model="dialogo_csv.estado" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">
            Subir movimiento (.csv)
          </v-card-title>
          <v-card-text>
            <v-row sm="12">
              <v-col class="d-flex" cols="12">
                <v-autocomplete
                  label="Rut"
                  v-model="dialogo_csv.rut"
                  :items="tablaruts"
                  :item-title="format_ruts"
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

      <v-dialog v-model="dialogo_valor.estado" persistent max-width="900">
        <v-card class="pa-2">
          <v-card-title>
            <span class="title">Recaudo Créditos</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-row sm="12">
              <v-col class="d-flex" cols="12">
                <v-autocomplete
                  label="Rut-credito"
                  v-model="dialogo_valor.rut"
                  :items="tablaruts"
                  :item-title="format_ruts"
                  hide-details
                  return-object
                  outlined
                  clearable
                  :error="error.rut"
                  @update:model-value="get_nrocreditos(), (error.rut = false)"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <div class="mt-2 pa-0 px-0">
                <v-data-table
                  :headers="tablaNroCreditos.headers"
                  :items="tablaNroCreditos.data"
                  item-value="id"
                  show-select
                  v-model="tablaNroCreditos.selected"
                  disable-pagination
                  hide-default-footer
                  @input="get_creditos()"
                >
                  <template #data-table-select-header></template>
                </v-data-table>
              </div>
            </v-row>

            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex mt-3 justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Valor Recibido"
                  outlined
                  clearable
                  hide-details
                  :value="formatNumero(dialogo_valor.recibido)"
                  @input="input_mask_valor(1)"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex ml-3" cols="3">
                <v-text-field
                  label="Vlr Pago Aportes"
                  outlined
                  clearable
                  hide-details
                  :value="formatNumero(dialogo_valor.aportes)"
                  @input="input_mask_valor(2)"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <h3 class="ml-4 mt-4">
                  Total Selección:
                  {{ formatCurrency(totalSeleccionados) }}
                </h3>
              </v-col>
            </v-row>

            <v-row class="d-flex ml-3 mt-4 justify-center" no-gutters>
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="red"
                  class="white--text"
                  large
                  depressed
                  @click="cerrar_dialogo_valor()"
                  >Cancelar</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-btn
                  color="indigo"
                  class="white--text"
                  large
                  depressed
                  @click="llenarCreditos()"
                  >Aceptar</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="mt-3" color="#FF6F00"></v-divider>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search_cred"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-container>
                <v-data-table
                  :headers="tabla_cuotas.headers"
                  :items="tabla_cuotas.data"
                  item-value="id_cart"
                  show-select
                  v-model="selected_cuotas"
                  :search="search_cred"
                  class="elevation-1"
                >
                  <template v-slot:item.capital_cart="props">
                    <!-- TODO: Implementar diálogo de edición personalizado para Vuetify 3 -->
                    <div @click="openEditDialog('capital_cart', props.item)">
                      {{ props.item.capital_cart }}
                    </div>
                    <hr color="red" />
                  </template>
                  <template v-slot:item.interes_cart="props">
                    <!-- TODO: Implementar diálogo de edición personalizado para Vuetify 3 -->
                    <div @click="openEditDialog('interes_cart', props.item)">
                      {{ props.item.interes_cart }}
                    </div>
                    <hr color="red" />
                  </template>

                  <template v-slot:item.vlrmora_cart="props">
                    <!-- TODO: Implementar diálogo de edición personalizado para Vuetify 3 -->
                    <div @click="openEditDialog('vlrmora_cart', props.item)">
                      {{ props.item.vlrmora_cart }}
                    </div>
                    <hr color="red" />
                  </template>

                  <template v-slot:item.vlrseguro_cart="props">
                    <!-- TODO: Implementar diálogo de edición personalizado para Vuetify 3 -->
                    <div @click="openEditDialog('vlrseguro_cart', props.item)">
                      {{ props.item.vlrseguro_cart }}
                    </div>
                    <hr color="red" />
                  </template>
                </v-data-table>
              </v-container>
            </v-row>
          </v-card-text>
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
        <flower-spinner
          :animation-duration="2500"
          :size="100"
          color="#0d47a1"
        />
      </v-overlay>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Gradiente moderno para el header */
.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
}

/* Contenedor de icono mejorado */
.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

/* Campos de entrada con estilo moderno */
.v-field--outlined {
  border-radius: 12px !important;
}

/* Botones con sombras suaves */
.v-btn {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Cards con efecto glass */
.v-card {
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Tabla con diseño limpio */
.v-data-table {
  border-radius: 12px;
  overflow: hidden;
}

.v-data-table__wrapper {
  border-radius: 12px;
}

/* Dividers modernos */
.v-divider {
  opacity: 0.3;
}

/* Animaciones suaves */
.v-card-actions {
  transition: all 0.3s ease;
}

/* Mejoras de tipografía */
.text-h4 {
  letter-spacing: -0.02em;
}

.text-h6 {
  letter-spacing: -0.01em;
}

/* Espaciado consistente */
.gap-3 {
  gap: 12px;
}

/* Efectos hover para iconos */
.v-icon {
  transition: all 0.2s ease;
}

.v-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Mejoras de accesibilidad */
.v-btn:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* Responsive design mejorado */
@media (max-width: 960px) {
  .v-card-actions .v-col {
    flex-direction: column;
    align-items: stretch !important;
  }

  .gap-3 {
    gap: 8px;
  }

  .v-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* Estado de loading mejorado */
.v-btn--loading {
  opacity: 0.8;
}

/* Chips con estilo moderno */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.02em;
}
</style>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { formato_contable } from "../../_formatos.pdf.js";
import { validar_Fecha } from "../../globalProcess.js";

export default {
  components: {
    FlowerSpinner,
    //JsonExcel
  },
  data() {
    return {
      pickerVence: false,
      facturas_json: {},
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
      dato_rotativo: [],
      rotativo: 0,
      valor_total_pendientes_cxp: 0,
      conceptosc: [],
      tablaruts: [],
      tablaccosto: [],
      cuentasContables: [],
      empresa: [],
      search: "",
      search_cred: "",
      creditos: 0,
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 40) || "Maximo 40 digitos",
      ],
      validField: [(v) => !!v || "Campo es obligatorio"],

      recibido: 0,

      form: {
        rtefte: 0,
        calc_imptos: false,
      },
      drawer: false,
      btn_guardar: {
        loader: false,
        disabled: false,
      },
      headers: [
        { title: "Registro", align: "center", value: "index" },
        { title: "Codigo Cta", align: "left", value: "codigoCuenta" },
        {
          title: "Descripción Cuenta",
          align: "left",
          value: "descripcionCuenta",
        },
        { title: "Rut", align: "left", value: "rut" },
        { title: "Documento", align: "center", value: "documento" },
        { title: "C.Costo", align: "center", value: "centroCosto" },
        { title: "Débitos", align: "right", value: "debitos" },
        { title: "Créditos", align: "right", value: "creditos" },
        { title: "Opciones", align: "center", value: "action" },
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
      dialogo_valor: {
        estado: false,
        recibido: 0,
        rut: 0,
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
      tabla_cuotas: {
        headers: [
          // {
          //   title: "ID interno",
          //   align: "center",
          //   value: "id",
          // },
          {
            title: "Credito",
            align: "center",
            value: "numero_cart",
          },
          {
            title: "Cuota",
            align: "left",
            value: "cuota_cart",
          },
          {
            title: "Dias mora",
            align: "center",
            value: "diasmora_cart",
          },

          {
            title: "Vence Cuota",
            align: "center",
            value: "fecha_cart",
          },
          {
            title: "Capital",
            align: "center",
            value: "capital_cart",
          },
          {
            title: "Int.corriente",
            align: "center",
            value: "interes_cart",
          },
          {
            title: "Int.Mora",
            align: "center",
            value: "vlrmora_cart",
          },
          {
            title: "Seguro",
            align: "center",
            value: "vlrseguro_cart",
          },
        ],
        data: [],
        selected: [],
      },
      tablaNroCreditos: {
        headers: [
          {
            title: "Credito",
            align: "center",
            value: "consec_rep",
          },
          {
            title: "Fecha",
            align: "left",
            value: "fechacuota_rep",
          },
          // {
          //   title: "Saldo Capital",
          //   align: "center",
          //   value: "saldo_rep",
          // },
        ],
        data: [],
        selected: [],
      },
      selected_cuotas: [],

      valor_total_seleccionados: 0,
      valor_total_seleccionados_cxp: 0,
      valor_total_facturas_pend: 0,
      buscar_pendientes: null,
    };
  },
  computed: {
    totalSeleccionados() {
      return this.selected_cuotas.reduce((acum, item) => {
        const capital =
          parseInt(item.capital_cart.toString().replace(/\s/g, ""), 10) || 0;
        const interes =
          parseInt(item.interes_cart.toString().replace(/\s/g, ""), 10) || 0;
        const mora =
          parseInt(item.vlrmora_cart.toString().replace(/\s/g, ""), 10) || 0;
        const seguro =
          parseInt(item.vlrseguro_cart.toString().replace(/\s/g, ""), 10) || 0;

        return acum + capital + interes + mora + seguro;
      }, 0);
    },
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
    // Método temporal para reemplazar v-edit-dialog
    openEditDialog(field, item) {
      // TODO: Implementar un diálogo personalizado para edición
      console.log("Editar campo:", field, "del item:", item);
      // Por ahora, mostrar un prompt simple
      const newValue = prompt(`Editar ${field}:`, item[field]);
      if (newValue !== null) {
        item[field] = newValue;
      }
    },
    formatNumero(value) {
      if (!value && value !== 0) return "0";
      const number = parseFloat(value);
      if (isNaN(number)) return "0";
      return new Intl.NumberFormat("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(number);
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
    },
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
          if (!item.detalle_prov.trim() == "") {
            detalle_recaudo = item.detalle_prov;
          }

          let cuenta_cartera = this.cuentasContables.find(
            (el) => el.cod_puc == item.cuenta_prov
          );
          let obj = {
            centroCosto: 1001,
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
            doc_prov: item.documento_prov,
            key: _this.get_key(),
            rut:
              parseInt(cliente.identificacion_rut.trim()) +
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
              doc_prov: item.documento_prov,
              key: _this.get_key(),
              rut:
                parseInt(cliente.identificacion_rut.trim()) +
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

        console.log("guardar_tabla_yyy", this.form.rtefte);

        let rtefte = parseFloat(this.form.rtefte) || 0;
        let rteica = parseFloat(this.form.rteica) || 0;
        let rteestamp = parseFloat(this.form.dctosestamp) || 0;
        let dctos = parseFloat(this.form.dctos) || 0;
        let recibido = parseFloat(this.recibido) || 0;
        if (this.empresa[0].id_empr == "000000901496778") {
          _this.empresa[0].ctadctos_empr = "1355180102";
        }
        console.log("guardar_tabla_xxx", rtefte);

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

          let obj = {
            centroCosto: 1001,
            codigoCuenta: _this.empresa[0].ctacartera_empr,
            comprobante: {
              rut: cliente,
            },
            creditos,
            debitos: 0,
            fvence: item.fechavence_cart
              ? item.fechavence_cart
              : this.form.fecha_doc,
            descripcionCuenta: cuenta_cartera
              ? cuenta_cartera.descrip_puc.trim()
              : "",
            detalle: detalle_recaudo || "",
            documento: item.pref_cart.trim() + item.numero_cart,
            prefijo: item.pref_cart,
            factcartera: item.numero_cart,
            key: _this.get_key(),
            rut:
              parseInt(cliente.identificacion_rut.trim()) +
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
              prefijo: item.pref_cart,

              fvence: item.fechavence_cart
                ? item.fechavence_cart
                : this.form.fecha_doc,
              key: _this.get_key(),
              rut:
                parseInt(cliente.identificacion_rut.trim()) +
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
      let porcrtefte = parseFloat(this.comprobante.rut.porcrtefte_rut);
      let porcrteica = parseFloat(this.comprobante.rut.porcrteica_rut);
      let porcestamp = parseFloat(this.comprobante.rut.porcrteest_rut);

      this.netorecibido = 0;

      if (this.form.calc_imptos == true) {
        porcrtefte = 0;
        porcrteica = 0;
        porcestamp = 0;
      }

      console.log("calcular_diferencia_111", porcrtefte);

      if (porcrtefte > 0) {
        rtefte = ((valor_total * porcrtefte) / 100).toFixed(0);
        this.form.rtefte = rtefte;
      } else {
        rtefte = parseFloat(this.form.rtefte);
      }

      let rteica = 0;

      if (porcrteica > 0) {
        rteica = ((valor_total * porcrteica) / 100).toFixed(0);
        this.form.rteica = rteica;
      } else {
        rteica = parseFloat(this.form.rteica);
      }

      let rteestamp = 0;
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
    input_mask_valor(tipo) {
      let vlr_label = null;
      if (tipo == 1) {
        vlr_label = "recibido";
      } else {
        vlr_label = "aportes";
      }

      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.dialogo_valor, vlr_label, val_edit);
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
        this.dialogo_cxp.detalle = item.detalle_prov.trim();
      }
    },
    seleccionar_item(item) {
      let copia = JSON.parse(JSON.stringify(item));
      let existe = this.dialogo_recaudo.tabla_seleccionados.find(
        (el) =>
          el.pref_cart.trim() == item.pref_cart.trim() &&
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
    async validar_csv() {
      var _this = this;
      var csv = this.dialogo_csv.archivo_csv;
      let cta_rtefte = this.empresa[0].ctartefte_empr;
      let cta_rteica = this.empresa[0].ctarteica_empr;
      let cta_rteiva = this.empresa[0].ctartefte_empr;
      let cta_cartera = this.empresa[0].ctacartera_empr;
      let descr_cartera = this.empresa[0].descrippuc_empr;

      let desccta_rtefte = "";
      let desccta_rteica = "";
      let desccta_rteiva = "";

      let descrip_cta = this.cuentasContables.find(
        (el) => el.cod_puc == cta_rtefte
      );
      desccta_rtefte = descrip_cta.descrip_puc;

      descrip_cta = this.cuentasContables.find(
        (el) => el.cod_puc == cta_rteica
      );
      desccta_rteica = descrip_cta.descrip_puc;

      descrip_cta = this.cuentasContables.find(
        (el) => el.cod_puc == cta_rteiva
      );
      desccta_rteiva = descrip_cta.descrip_puc;

      if (csv) {
        this.loader_spinner = true;
        await this.get_facturas_csv().then((facturas) => {
          var reader = new FileReader();
          reader.onload = function () {
            var data = reader.result;
            var array = data.split(/\r?\n/);
            var nuevo = [];
            array.shift();
            // array.pop();
            var rut = _this.dialogo_csv.rut;
            var fecha = null;
            // this.loader.consecutivo = true;
            let fin_array = array.length;

            array.forEach((el, index) => {
              let parse = el.split(";");
              var comprobante = JSON.parse(JSON.stringify(_this.comprobante));

              if (index <= fin_array) {
                comprobante.rut = rut;

                var busqueda_ccosto = _this.tablaccosto.find(
                  (item) => item.centro_cost + item.subcentro_cost == "1001"
                );
                comprobante.ccosto = busqueda_ccosto;

                let parse_documento = parse[0].match(/[a-zA-Z]+|[0-9]+/g);
                let prefijo_fact = parse[0];
                let nro_fact = parseFloat(parse[1]);
                let documento = String(nro_fact);

                let vlr_abono = parse[2];
                let vlr_dcto = parse[3];
                let vlr_rtefte = parse[4];
                let vlr_rteiva = parse[5];
                let vlr_rteica = parse[6];

                var busqueda_factura = facturas.find(
                  (fac) => parseFloat(fac.numero_cart.trim()) == nro_fact
                );
                if (busqueda_factura) {
                  var valor_credito = vlr_abono;

                  if (valor_credito > 0) {
                    nuevo.push({
                      centroCosto: "1001",
                      codigoCuenta: cta_cartera,
                      comprobante: comprobante,
                      creditos: parseFloat(valor_credito),
                      debitos: 0,
                      descripcionCuenta: descr_cartera,
                      detalle: "ABONO / PAGO FACTURA",
                      documento,
                      prefijo: prefijo_fact,
                      key: _this.get_key(),
                      rut:
                        parseInt(rut.identificacion_rut) +
                        " - " +
                        rut.descripcion_rut,
                    });
                  }

                  if (vlr_rtefte > 0) {
                    nuevo.push({
                      centroCosto: "1001",
                      codigoCuenta: cta_rtefte,
                      comprobante: comprobante,
                      debitos: parseFloat(vlr_rtefte),
                      creditos: 0,
                      descripcionCuenta: desccta_rtefte,
                      detalle: "ABONO / PAGO FACTURA",
                      documento,
                      key: _this.get_key(),
                      rut:
                        parseInt(rut.identificacion_rut) +
                        " - " +
                        rut.descripcion_rut,
                    });
                  }
                  if (vlr_rteica > 0) {
                    nuevo.push({
                      centroCosto: "1001",
                      codigoCuenta: cta_rteica,
                      comprobante: comprobante,
                      debitos: parseFloat(vlr_rteiva),
                      creditos: 0,
                      descripcionCuenta: desccta_rteica,
                      detalle: "ABONO / PAGO FACTURA",
                      documento,
                      key: _this.get_key(),
                      rut:
                        parseInt(rut.identificacion_rut) +
                        " - " +
                        rut.descripcion_rut,
                    });
                  }
                  if (vlr_rteiva > 0) {
                    nuevo.push({
                      centroCosto: "1001",
                      codigoCuenta: cta_rteiva,
                      comprobante: comprobante,
                      debitos: parseFloat(vlr_rteiva),
                      creditos: 0,
                      descripcionCuenta: desccta_rteiva,
                      detalle: "ABONO / PAGO FACTURA",
                      documento,
                      key: _this.get_key(),
                      rut:
                        parseInt(rut.identificacion_rut) +
                        " - " +
                        rut.descripcion_rut,
                    });
                  }
                  _this.detalle = nuevo;
                }
              }
            });
            _this.dialogo_csv.rut = null;
            _this.dialogo_csv.csv = null;
          };
          reader.readAsBinaryString(csv);
        });
        this.loader_spinner = false;
      }
    },
    up_file_ant() {
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
    async up_file() {
      var file = this.dialogo_archivo.model;
      let digito = this.empresa[0].id_empr.substr(14, 15);
      let idempresa = parseFloat(this.empresa[0].id_empr);
      let idjson = "cargue_" + digito + ".json";
      let session = sessionStorage.Sesion;
      let agencia = this.form.tipoDocumento.agencia_docc;
      let fechadoc = this.form.fecha_doc.replace(/\-/g, "");
      let periodo = fechadoc.substr(0, 6);
      let coddoc = this.form.tipoDocumento.codky_docc;
      let empresa = this.empresa[0].descrip_empr.trim();
      let iddrive = this.empresa[0].iddrive_rep.trim();
      let llavedoc = this.form.tipoDocumento.codky_docc;
      // iddrive = "1V9QwiShda842F6U5UHvh4tOPRqnMsqsq";
      let cargue_pdf = file.name;
      let consec = parseFloat(this.print.consecutivo.trim());
      let clasif = 1;
      let consecpte = 0;
      let agcpte = 0;
      let idrut = 0;
      let codigo = "";
      let tipodoc = "02";
      let nombre_pdf =
        idempresa +
        "_CONT_" +
        periodo +
        "_" +
        coddoc +
        "_" +
        consec +
        "_" +
        clasif +
        ".pdf";

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("clasif", clasif);
      data.append("consecutivo", consec);
      data.append("file", file);
      data.append("agencia", agencia);
      data.append("codigo", codigo);
      data.append("consecpte", consecpte);
      data.append("agcpte", agcpte);
      data.append("iddrive", iddrive);
      data.append("idjson", idjson);
      data.append("llavedoc", llavedoc);
      data.append("fechadoc", fechadoc);
      data.append("idrut", idrut);

      let response = await fetch(
        "https://server1ts.net//financiero/inc/soporte.contab.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;
      this.cancelar_subida();
      this.get_comprobantes();

      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
      });
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
      var fecha = data.fecha_doc.replace(/\-/g, "");

      // Validar fecha antes de continuar
      if (!validar_Fecha(fecha)) {
        this.send_error("La fecha ingresada no es válida");
        return; // Detiene la ejecución
      }

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
          nrorotativo +
          "|";

        var detalle_new = JSON.parse(JSON.stringify(this.detalle));
        let validadoc = "";
        let detalle_filtro = detalle_new.filter((el) => el.codigoCuenta);

        var detalle_format = detalle_filtro.map((el) => {
          validadoc = el.documento.substr(0, 4);
          el.creditos = el.creditos ? parseFloat(el.creditos) : 0;
          el.iva =
            parseFloat(
              el.comprobante.iva ? el.comprobante.iva.replace(/\,/g, "") : "0"
            ) || 0;
          el.iva = el.iva.toFixed(2);
          el.debitos = el.debitos.toFixed(2);
          el.creditos = el.creditos.toFixed(2);
          el.detalle = el.detalle ? el.detalle.trim() : "";
          el.fvence = el.fvence ? el.fvence.replace(/\-/g, "") : "";
          el.numRut = el.comprobante.rut.identificacion_rut;
          el.prefijo = el.prefijo ? el.prefijo : " ";

          // if (validadoc == el.prefijo) {
          //   el.prefijo = "";
          // }
          if (el.factcartera) {
            el.documento = el.factcartera;
          } else {
            el.documento = el.documento ? el.documento.trim() : "0";
          }
          el.nrocuota = el.nrocuota ? parseFloat(el.nrocuota) : 0;
          el.interescte = el.interescte ? parseFloat(el.interescte) : 0;
          el.interesmora = el.interesmora ? parseFloat(el.interesmora) : 0;
          el.seguro = el.seguro ? parseFloat(el.seguro) : 0;

          // el.documento = el.documento
          //   ? el.documento.substr(4, el.documento.length)
          //   : "0";

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
        let doc_prov = item.doc_prov ? item.doc_prov : "0";
        let debitos = item.debitos;
        let creditos = item.creditos;
        let centroCosto = item.centroCosto;
        let iva = item.iva;
        let cuota = item.cuota ? item.cuota : 0;
        let interescte = item.interescte ? item.interescte : 0;
        let interesmora = item.interesmora ? item.interesmora : 0;
        let seguro = item.seguro ? item.seguro : 0;
        let detalle = item.detalle;
        let fvence = item.fvence;
        let nrocredito = item.nrocredito;

        if (prefijo.trim() == documento.trim()) {
          prefijo = "0000";
        }
        indextab = format_index;
        if (this.creditos < 1) {
          nrocredito = 0;
        }

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${codigo}|${rut}|${prefijo}|${documento}|${debitos}|${creditos}|${centroCosto}|${iva}|${detalle}|${fvence}|${nrocredito}|${cuota}|${interescte}|${interesmora}|${seguro}|${doc_prov}|`;
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
    validar_documento() {
      let idrut = this.comprobanteEditar.rut.identificacion_rut;
      let documento = this.comprobanteEditar.documento;
      let datosEnvio =
        sessionStorage.Sesion + "|" + idrut + "|" + documento + "|";
      post
        .postData({
          url: "Financiero/dlls/PrdocextJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          console.log(data[0]);
        })
        .catch((err) => {
          // console.log("error", err);
          this.$emit("snack", {
            color: "orange",
            text: "Error documento externo ya registrado!!",
            estado: true,
          });
        });
      this.guardarModificar();
    },
    guardarModificar() {
      var item = JSON.parse(JSON.stringify(this.comprobanteEditar));
      var detalle_old = JSON.parse(JSON.stringify(this.detalle));
      var busqueda = detalle_old.find((val) => val.key == item.key);

      if (busqueda) {
        if (item.facturas) {
          busqueda.documento = item.facturas.numero_cart.trim();
          busqueda.prefijo = item.facturas.pref_cart.trim();

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

      var busquedaCosto = datos.centroCosto
        ? this.tablaccosto.find((el) => {
            const a = Number(el.llavecentro_cost || 0);
            const b = Number(datos.centroCosto || 0);
            return a === b;
          })
        : null;

      this.comprobanteEditar.ccosto = busquedaCosto;

      this.comprobanteEditar.rut = datos.comprobante.rut;
      // this.comprobanteEditar.ccosto = datos.comprobante.ccosto;
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
      this.creditos = 0;
      this.tabla_cuotas.data = [];
      this.tablaNroCreditos.data = [];

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
        this.form.calc_imptos = false;
      }

      if (this.empresa[0].id_empr == "000000892099339" && codigo == "0003") {
        this.dialogo.estado = false;
        this.clear_creditos();
        this.dialogo_valor.estado = true;
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
      console.log("guardarFormulario", datos);

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
        if (
          this.empresa[0].id_empr == "000000892099339" &&
          datos.conc_conta.codigo_conc == "0003"
        ) {
          this.llenarCreditos(datos);
        } else {
          this.validarDatos(datos);
        }
        this.initComprobante();
      }
    },
    validarDatos(comprobante) {
      var concepto = comprobante.conc_conta;
      var detalle = comprobante.detalle;
      let fecha_vence = this.$moment().format("YYYY-MM-DD");
      if (concepto.codigo_conc == "0001") {
        var items = comprobante.cantidadItems;

        for (var i = 0; i < items; i++) {
          this.detalle.push({
            codigoCuenta: null,
            descripcionCuenta: null,
            documento: null,
            doc_prov: null,
            rut: null,
            fvence: fecha_vence,
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
        var doc_prov = comprobante.documento;
        var valorDebito = valor;

        // Agregar débito
        if (valorDebito > 0) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctadeb_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctadeb_conc.descripcta_conc,
            documento,
            doc_prov,
            rut,
            centroCosto,
            debitos: valorDebito,
            creditos: 0,
            detalle,
            fvence: fecha_vence,
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
              doc_prov,
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
            valorPorcica = porcReteica / 100;
            valorReteica = valorPorcica * valor;
          } else {
            if (baseReteica < valor) {
              valorPorcica = porcReteica / 100;
              valorReteica = valorPorcica * valor;
            }
          }

          if (valorReteica > 0) {
            this.detalle.push({
              codigoCuenta: comprobante.conc_conta.ctaicav_conc.codigo_conc,
              descripcionCuenta:
                comprobante.conc_conta.ctaicav_conc.descripcta_conc,
              documento,
              doc_prov,
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
        if (iva > 0 && comprobante.conc_conta.ctaiva_conc.descripcta_conc) {
          this.detalle.push({
            codigoCuenta: comprobante.conc_conta.ctaiva_conc.codigo_conc,
            descripcionCuenta:
              comprobante.conc_conta.ctaiva_conc.descripcta_conc,
            documento,
            doc_prov,
            rut,
            centroCosto,
            debitos: iva,
            creditos: 0,
            fvence: fecha_vence,
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
            doc_prov,
            rut,
            centroCosto,
            debitos: 0,
            fvence: fecha_vence,
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
                doc_prov,
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
            doc_prov: null,
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
    get_creditos() {
      if (!this.dialogo_valor.aportes) {
        this.dialogo_valor.aportes = 0;
      }
      let cred_1 = 0;
      let cred_2 = 0;
      let cred_3 = 0;
      let cred_4 = 0;
      let cred_5 = 0;

      if (this.tablaNroCreditos.selected.length > 0) {
        cred_1 = this.tablaNroCreditos.selected[0]?.consec_rep.trim() || 0;
        cred_2 = this.tablaNroCreditos.selected[1]?.consec_rep.trim() || 0;
        cred_3 = this.tablaNroCreditos.selected[2]?.consec_rep.trim() || 0;
        cred_4 = this.tablaNroCreditos.selected[3]?.consec_rep.trim() || 0;
        cred_5 = this.tablaNroCreditos.selected[4]?.consec_rep.trim() || 0;
      }

      let recibido = parseFloat(this.dialogo_valor.recibido);
      let aportes = parseFloat(this.dialogo_valor.aportes);
      let rut = this.dialogo_valor.rut.identificacion_rut;
      let valor = recibido - aportes;
      let fecha = this.form.fecha_doc.replace(/\-/g, "");
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        rut +
        "|" +
        valor +
        "|" +
        fecha +
        "|" +
        cred_1 +
        "|" +
        cred_2 +
        "|" +
        cred_3 +
        "|" +
        cred_4 +
        "|" +
        cred_5 +
        "|";

      post
        .postData({
          url: "Asociados/dlls/PrCartera01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();

          // Guardamos los ids de las cuotas seleccionadas
          const idsSeleccionados = this.selected_cuotas.map(
            (cuota) => cuota.id
          );

          // Recorremos data nueva y actualizamos solo los que NO están seleccionados
          const nuevaData = data.map((item, index) => {
            const id = index + 1;

            // Verificamos si el id ya está en los seleccionados
            const yaSeleccionado = idsSeleccionados.includes(id);

            if (yaSeleccionado) {
              // Buscamos el objeto original que estaba seleccionado
              const cuotaOriginal = this.selected_cuotas.find(
                (c) => c.id === id
              );
              return { ...cuotaOriginal }; // mantenemos intacto
            } else {
              // Si no estaba seleccionado, actualizamos con el nuevo item
              return { ...JSON.parse(JSON.stringify(item)), id };
            }
          });

          // Actualizamos tabla
          this.tabla_cuotas.data = nuevaData;

          // Reconstruimos selected_cuotas asegurándonos que existan en la nueva data
          this.selected_cuotas = this.tabla_cuotas.data.filter((item) =>
            idsSeleccionados.includes(item.id)
          );

          this.loader.btn_imprimir = false;
        })
        .catch((err) => {
          this.loader.btn_imprimir = false;
          this.send_error("Error al consultar creditos");
        });
    },
    llenarCreditos(comprobante) {
      this.creditos = 1;
      //      this.detalle = [];
      this.tabla_cuotas.data.pop();
      var iva = 0;
      let cc_costo = {
        centro_cost: "10",
        subcentro_cost: "01",
        llavecentro_cost: "1001",
        estado_cost: "0",
        tipo_cost: "2",
        descrip_cost: "ADMINISTRATIVO",
      };

      var rutFormat = parseInt(this.dialogo_valor.rut.identificacion_rut);
      let rut = rutFormat + " - " + this.dialogo_valor.rut.descripcion_rut;
      let numRut = parseFloat(this.dialogo_valor.rut.identificacion_rut);
      var doc_ext = this.selected_cuotas[0].numero_cart.trim();
      let vence = this.selected_cuotas[0].fecha_cart;
      let detalle = "PAGO CUOTA CREDITO";
      let cuota = 0;
      var valor =
        parseFloat(
          this.dialogo_valor.recibido
            ? this.dialogo_valor.recibido.replace(/\,/g, "")
            : "0"
        ) || 0;

      var vlr_aportes =
        parseFloat(
          this.dialogo_valor.aportes
            ? this.dialogo_valor.aportes.replace(/\,/g, "")
            : "0"
        ) || 0;
      var valorDebito = valor;

      if (valorDebito > 0) {
        this.detalle.push({
          centroCosto: cc_costo.llavecentro_cost,
          codigoCuenta: "1105050101",
          descripcionCuenta: "Caja General",
          iva: 0,
          rut,
          numRut,
          cuota,
          documento: doc_ext,
          nrocredito: doc_ext,
          debitos: valorDebito,
          creditos: 0,
          detalle,
          fvence: vence,
          key: this.get_key(),
          comprobante: {
            rut: this.dialogo_valor.rut,
            ccosto: cc_costo,
          },
        });
      }

      if (this.selected_cuotas.length > 0) {
        this.selected_cuotas.forEach((item) => {
          // Agregar credito cartera
          let valorCredito = parseFloat(item.capital_cart);
          let vlrInteres = parseFloat(item.interes_cart);
          let vlrmora = parseFloat(item.vlrmora_cart);
          let vlrseguro = parseFloat(item.vlrseguro_cart);
          doc_ext = item.numero_cart.trim();

          if (valorCredito > 0) {
            this.detalle.push({
              codigoCuenta: item.ctacart_cart,
              descripcionCuenta: "Credito ordinario personal",
              iva: 0,
              rut,
              numRut,
              cuota: parseFloat(item.cuota_cart),
              documento: doc_ext,
              nrocredito: doc_ext,
              centroCosto: cc_costo.llavecentro_cost,
              debitos: 0,
              creditos: valorCredito.toFixed(0),
              interescte: vlrInteres,
              interesmora: vlrmora,
              seguro: vlrseguro,
              detalle,
              fvence: item.fecha_cart,
              key: this.get_key(),
              comprobante: {
                rut: this.dialogo_valor.rut,
                documento: item.numero_cart.trim(),
                ccosto: cc_costo,
              },
            });
          }
          // Agregar credito seguro
          valorCredito = parseFloat(item.vlrseguro_cart);
          if (valorCredito > 0) {
            this.detalle.push({
              codigoCuenta: item.ctaseg_cart,
              descripcionCuenta: "Poliza de seguro de vida deudores",
              iva: 0,
              rut,
              numRut,
              cuota: parseFloat(item.cuota_cart),
              documento: item.numero_cart.trim(),
              nrocredito: doc_ext,
              centroCosto: cc_costo.llavecentro_cost,
              debitos: 0,
              creditos: valorCredito.toFixed(0),
              detalle,
              fvence: item.fecha_cart,
              key: this.get_key(),
              comprobante: {
                rut: this.dialogo_valor.rut,
                documento: item.numero_cart,
                ccosto: cc_costo,
              },
            });
          }
          // Agregar credito int corrientes
          valorCredito = parseFloat(item.interes_cart);
          if (valorCredito > 0) {
            this.detalle.push({
              codigoCuenta: item.ctaint_cart,
              descripcionCuenta: "Intereses de créditos consumo",
              iva: 0,
              rut,
              numRut,
              cuota: parseFloat(item.cuota_cart),
              documento: item.numero_cart.trim(),
              nrocredito: doc_ext,
              centroCosto: cc_costo.llavecentro_cost,
              debitos: 0,
              creditos: valorCredito.toFixed(0),
              detalle,
              fvence: item.fecha_cart,
              key: this.get_key(),
              comprobante: {
                documento: item.numero_cart.trim(),
                rut: this.dialogo_valor.rut,
                ccosto: cc_costo,
              },
            });
          }
          // Agregar credito int mora
          valorCredito = parseFloat(item.vlrmora_cart);
          if (valorCredito > 0) {
            this.detalle.push({
              codigoCuenta: item.ctamora_cart,
              descripcionCuenta: "Int. mora créditos",
              iva: 0,
              rut,
              numRut,
              cuota: parseFloat(item.cuota_cart),
              centroCosto: cc_costo.llavecentro_cost,
              documento: item.numero_cart.trim(),
              nrocredito: doc_ext,
              debitos: 0,
              creditos: valorCredito.toFixed(0),
              detalle,
              fvence: item.fecha_cart,
              key: this.get_key(),
              comprobante: {
                documento: item.numero_cart.trim(),
                rut: this.dialogo_valor.rut,
                ccosto: cc_costo,
              },
            });
          }
        });
      }
      if (vlr_aportes > 0) {
        this.detalle.push({
          codigoCuenta: "3105050101",
          descripcionCuenta: "Aportes Ordinarios",
          iva: 0,
          rut,
          numRut,
          cuota: 0,
          documento: doc_ext,
          nrocredito: doc_ext,
          centroCosto: cc_costo.llavecentro_cost,
          debitos: 0,
          creditos: vlr_aportes,
          detalle,
          fvence: vence,
          key: this.get_key(),
          comprobante: {
            rut: this.dialogo_valor.rut,
            documento: doc_ext,
            ccosto: cc_costo,
          },
        });
      }

      this.dialogo_valor.estado = false;
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
    async get_facturas_csv() {
      this.dialogo_csv.estado = false;
      let sesion = sessionStorage.Sesion;
      let hora_sesion = new Date().getTime();
      let archivo_json = sesion + hora_sesion + ".json";
      var _this = this;
      return new Promise((resolve, reject) => {
        var rut = this.dialogo_csv.rut;
        var fecha = this.form.fecha_doc.replace(/\-/g, "");

        var datosEnvio =
          sesion +
          "|" +
          rut.identificacion_rut +
          "|" +
          fecha +
          "|" +
          archivo_json +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrCartera2J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.get_json_cart(archivo_json);
            post
              .postData({
                url: "../Tmp/" + archivo_json,
                data: "",
                method: "GET",
              })
              .then((data) => {
                data.Cartera.pop();
                var filtro = data.Cartera.filter((e) => e.numero_cart);
                this.facturas_json = filtro;
                resolve(filtro);
              })
              .catch((err) => {
                this.loader_spinner = false;
                console.log(err);
                this.$emit("snack", {
                  color: "error",
                  text: "Error al cargar cartera",
                  estado: true,
                });
              });
          })
          .catch((err) => {
            this.loader_spinner = false;
            _this.send_error("Error al cargar facturas pendientes");
            resolve();
          });
      });
    },
    get_json_cart(archivo_json) {
      post
        .postData({
          url: "../Tmp/" + archivo_json,
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.Cartera.pop();
          var filtro = data.Cartera.filter((e) => e.numero_cart);
          filtro = filtro.map((el) => {
            el.factura = el.pref_cart.trim() + el.numero_cart.trim();

            return el;
          });

          this.loader.facturas = false;
          this.facturasPendientes = filtro;
          if (this.rotativo == 1) {
            this.dato_rotativo = data[0];
          }
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cartera",
            estado: true,
          });
        });
    },
    get_facturas() {
      this.comprobante.facturas = null;
      var rut = this.comprobante.rut;
      this.rotativo = 0;
      this.dato_rotativo = [];
      this.loader.facturas = true;
      let concepto = this.comprobante.conc_conta.codigo_conc;
      let url_envio = "Financiero/dlls/PrCarteraJ.dll";
      if (this.empresa[0].id_empr == "000000892099339") {
        if (this.comprobante.conc_conta.codigo_conc == "0003") {
          this.comprobante.conc_conta.cartera_conc = 1;
          url_envio = "Asociados/dlls/PrCarteraJ.dll";
        }

        // if (this.comprobante.conc_conta.codigo_conc == "0004") {
        //   this.comprobante.conc_conta.cartera_conc = 1;
        //   this.rotativo = 1;
        //   url_envio = "Asociados/dlls/PrRotativoJ.dll";
        // } else {
        //   this.comprobante.conc_conta.cartera_conc = 1;
        //   url_envio = "Asociados/dlls/PrCarteraJ.dll";
        // }
      }

      if (rut) {
        var fecha = this.form.fecha_doc.replace(/\-/g, "");
        var sesion = sessionStorage.Sesion;
        let hora_sesion = new Date().getTime();
        let archivo_json = sesion + hora_sesion + ".json";

        //        if(concepto == 3){
        //          url_envio = "Asociados/dlls/PrCarteraJ.dll";
        //        }
        var datosEnvio =
          sesion +
          "|" +
          rut.identificacion_rut +
          "|" +
          fecha +
          "|" +
          archivo_json +
          "|";

        post
          .postData({
            url: url_envio,
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            // this.get_json_cart(archivo_json);
            var filtro = data.filter((e) => e.numero_cart);
            filtro = filtro.map((el) => {
              el.factura = el.pref_cart.trim() + el.numero_cart.trim();

              return el;
            });

            this.loader.facturas = false;
            this.facturasPendientes = filtro;
            if (this.rotativo == 1) {
              this.dato_rotativo = data[0];
            }
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
    onConceptoChange() {
      console.log("onConceptoChange llamado");
      this.error.conc_conta = false;
      this.getDetalleConcepto();
      this.comprobante.rut = null;
      this.facturasPendientes = [];
    },
    onFechaChange() {
      console.log("onFechaChange llamado");
      this.dialogPicker = false;
      this.getConsecutivo();
    },
    onTipoDocumentoChange() {
      console.log("onTipoDocumentoChange llamado");
      this.getConsecutivo();
      this.error.tipoDocumento = false;
    },
    getConsecutivo() {
      console.log("getConsecutivo() llamada");
      var tipoDocumento = this.form.tipoDocumento;
      console.log("tipoDocumento:", tipoDocumento);
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
    open_csv() {
      this.dialogo_csv.archivo_csv = null;
      this.dialogo_csv.rut = null;
      this.dialogo_csv.estado = true;
    },

    onSeleccionCambio(seleccionados) {
      // Si se seleccionan todos automáticamente, limpiamos y forzamos el cambio manual
      if (seleccionados.length > 1) {
        // Verificamos si se seleccionaron todos por error
        const todosIguales = seleccionados.every(
          (item) => item.numero_cart === seleccionados[0].numero_cart
        );

        if (todosIguales) {
          // Si hay algo raro, dejamos solo el primero
          this.tablaCreditos.selected = [seleccionados[0]];
        }
      }
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
    get_nrocreditos() {
      let rut = this.dialogo_valor.rut.identificacion_rut;
      this.tablaNroCreditos.data = [];
      this.dialogo_valor.recibido = 0;
      this.dialogo_valor.aportes = 0;
      this.creditos = 0;
      post
        .postData({
          url: "Asociados/dlls/RpFinancia02J.dll",
          data: sessionStorage.Sesion + "|" + rut + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.tablaNroCreditos.data = JSON.parse(JSON.stringify(data));
          this.tablaNroCreditos.data = data.map((item, index) => ({
            ...item,
            id: index + 1, // id único
            consec_rep: String(item.consec_rep || "").trim(),
          }));
        })
        .catch((err) => {
          console.log(err);
          this.loader.facturas = false;
          this.send_error("Error al cargar creditos pendientes");
        });
    },

    cerrar_dialogo_valor() {
      this.dialogo_valor.estado = false;
      this.clear_creditos();
    },
    clear_creditos() {
      this.creditos = 0;
      this.selected_cuotas = [];
      this.tabla_cuotas.data = [];
      this.tablaNroCreditos.selected = [];
      this.tablaNroCreditos.data = [];
      this.dialogo_valor.recibido = 0;
      this.dialogo_valor.aportes = 0;
      this.dialogo_valor.rut = null;
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
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
    // Funciones de formateo para v-autocomplete
    format_docc(item) {
      if (!item) return "";
      return `${item.agencia_docc + item.codigo_docc} - ${item.descrip_docc}`;
    },
    format_conceptos(item) {
      if (!item) return "";
      return `${item.codigo_conc} - ${item.descrip_conc}`;
    },
    format_ruts(item) {
      if (!item) return "";
      return (
        parseFloat(`${item.identificacion_rut}`) +
        "-" +
        `${item.descripcion_rut}`
      );
    },
    format_cuentac(item) {
      if (!item) return "";
      return `${item.cod_puc} - ${item.descrip_puc}`;
    },
    format_factPendientes(item) {
      if (!item) return "";
      return `${
        item.pref_cart
      }${item.numero_cart.trim()} - ${item.valor_cart.trim()} - Fecha: ${item.fecha_cart.trim()}- Cuota: ${item.nrocuota_cart.trim()}`;
    },
    format_ccosto(item) {
      if (!item) return "";
      return `${item.centro_cost + item.subcentro_cost} - ${item.descrip_cost}`;
    },
  },
};
</script>
