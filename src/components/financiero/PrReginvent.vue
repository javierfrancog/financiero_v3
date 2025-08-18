<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1600" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-folder-swap-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Registro de Mercancias</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Tipo de Operación"
                  v-model="form.tipo_oper"
                  :items="toperacion"
                  :item-text="format_operacion"
                  item-value="llave_tpoper"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_consecutivo();
                    errores.tipo_oper = false;
                  "
                  :error="errores.tipo_oper"
                ></v-autocomplete>
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
            </v-row>
            <v-row>
              <!-- <v-col class="d-flex" cols="2">

                  <v-date-picker v-model="form.fecha" @input="dialogPicker = false"></v-date-picker>
              </v-col>-->

              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker3"
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
                    @input="dialogPicker3 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  class="ma-2 px-4 white--text"
                  color="orange"
                  depressed
                  large
                  @click="validar"
                  >Validar</v-btn
                >
              </v-col>
 -->
              <v-col cols="3">
                <v-select
                  :items="[
                    { text: 'Factura Electronica', value: 1 },
                    { text: 'Registro Manual', value: 2 },
                  ]"
                  label="Documento Origen"
                  outlined
                  hide-details
                  :disabled="select_tipo"
                  v-model="form.doc_origen"
                  @change="
                    form.plazo = null;
                    errores.doc_origen = false;
                    reset_form();
                  "
                  :error="errores.doc_origen"
                ></v-select>
              </v-col>
              <v-col
                class="d-flex"
                cols="6"
                v-if="
                  form.doc_origen
                    ? form.doc_origen == 1
                      ? true
                      : false
                    : false
                "
              >
                <v-file-input
                  outlined
                  accept="application/xml"
                  show-size
                  label="XML Factura"
                  @change="
                    get_xml($event);
                    errores.xml = false;
                  "
                  hide-details
                  v-model="form.xml"
                  :error="errores.xml"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="d-flex"
                cols="12"
                sm="6"
                v-if="
                  form.doc_origen ? (form.doc_origen == 1 ? false : true) : true
                "
              >
                <v-autocomplete
                  label="Proveedor"
                  v-model="form.proveedor"
                  :item-text="format_operador"
                  item-value="identificacion_rut"
                  :items="clientes"
                  hide-details
                  clearable
                  outlined
                  :error="errores.clientes"
                  @change="get_pesaje(), (errores.clientes = false)"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6" v-else>
                <v-text-field
                  label="Proveedor"
                  v-model="form.proveedor_input"
                  hide-details
                  clearable
                  type="text"
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Centro de costos"
                  v-model="form.ccosto"
                  :items="tablaccosto"
                  :item-text="format_ccosto"
                  hide-details
                  return-object
                  outlined
                  :error="errores.ccosto"
                  @change="errores.ccosto = false"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Pesajes"
                  v-model="form.pesajes"
                  :items="tablapesajes"
                  :item-text="format_pesajes"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>

              <!-- <v-col class="d-flex" cols="3">
                  <v-autocomplete
                    label="Actividad Producción"
                    v-model="form.actprod"
                    :items="tablaactprod"
                    :item-text="format_actprod"
                    hide-details
                    return-object
                    outlined
                  ></v-autocomplete>
                </v-col> -->
            </v-row>
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="indigo"
                  class="white--text"
                  depressed
                  @click="abrir_popup()"
                  :disabled="
                    form.doc_origen
                      ? form.doc_origen == 1
                        ? true
                        : false
                      : true
                  "
                >
                  <v-icon size="20" left>mdi-cart-plus</v-icon>Agregar
                  Producto/Servicio
                </v-btn>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.idItem="{ item }">
                  {{ tablaDetalle.data.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.sub_total="{ item }">
                  {{ formatNumero(item.sub_total * item.cantidad) }}
                </template>
                <template v-slot:item.valorBase="{ item }">
                  {{ formatNumero(item.valorBase) }}
                </template>
                <template v-slot:item.valorDescuento="{ item }">
                  {{ formatNumero(item.valorDescuento) }}
                </template>
                <template v-slot:item.valorIva="{ item }">
                  {{ formatNumero(item.valorIva) }}
                </template>
                <template v-slot:item.valorTotal="{ item }">
                  {{
                    formatNumero(
                      item.valorTotal + item.valorIva - item.valorDescuento
                    )
                  }}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="modificar_item(item)"
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Modificar item</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red darken-4"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="delete_item(item)"
                        :disabled="
                          form.doc_origen
                            ? form.doc_origen == 1
                              ? true
                              : false
                            : false
                        "
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar item</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        small
                        icon
                        v-on="on"
                        @click="cargar_registroProd(item)"
                        color="red accent-3"
                        outlined
                        :disabled="!item.registrar"
                      >
                        <v-icon>mdi-alpha-r-circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Registrar item</span>
                  </v-tooltip>
                </template>
                <template v-slot:body.append>
                  <td colspan="4" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <!-- <td
                    class="text-xs-right text-center"
                  >{{ formatNumero(tablaDetalle.totales.total_descuentos || 0) }}</td>-->
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_subtotal || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_total || 0) }}
                  </td>
                  <td></td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mt-1">
              <v-col cols="2">
                <v-text-field
                  label="Subtotal"
                  outlined
                  hide-details
                  @change="input_mask('subtotal_format')"
                  :value="formatNumero(subtotal_format)"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Otros Descuentos"
                  outlined
                  hide-details
                  @input="input_mask('otrosdctos_format')"
                  :value="formatNumero(form.otrosdctos_format)"
                >
                </v-text-field>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    {
                      text: 'Compras Generales (Declarantes) 2.5%',
                      value: 2.5,
                    },
                    {
                      text: 'Compras Generales (No Declarantes) 3.5%',
                      value: 3.5,
                    },
                    { text: 'Compras Productos Agricolas) 1.5%', value: 1.5 },
                    { text: 'Compras Combustibles 0.1%', value: 0.1 },
                    { text: 'Bolsa Nacional Agropecuaria', value: 99 },

                    { text: 'No Aplica', value: 0 },
                  ]"
                  label="% Retención/BNA"
                  outlined
                  hide-details
                  v-model="form.retencion"
                  return-object
                  :error="errores.retencion"
                  @change="
                    calcular_retencion();
                    errores.retencion = false;
                  "
                ></v-select>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Retención"
                  outlined
                  hide-details
                  disabled
                  v-model="form.valorRetencion"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Aux.Iva 19% (Débito)"
                  v-model="form.ctaiva"
                  :items="tablaPuc"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Iva 19%"
                  outlined
                  hide-details
                  @input="input_mask('total_iva_format')"
                  :value="formatNumero(form.total_iva_format)"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Aux.Iva 5% (Débito)"
                  v-model="form.ctaiva5"
                  :items="tablaPuc"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Iva 5%"
                  outlined
                  hide-details
                  @input="input_mask('total_iva5_format')"
                  :value="formatNumero(form.total_iva5_format)"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Aux.RteIva (Pasivo)"
                  v-model="form.ctarteivapas"
                  :items="tablaPuc"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Retención de Iva"
                  outlined
                  hide-details
                  @input="input_mask('valorReteiva')"
                  :value="formatNumero(form.valorReteiva)"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Aux.RteIca (Pasivo)"
                  v-model="form.ctarteicapas"
                  :items="tablaPuc"
                  :item-text="format_cuentac"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Retención de Ica"
                  outlined
                  hide-details
                  @input="input_mask('valorReteica')"
                  :value="formatNumero(form.valorReteica)"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Proceso</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Nro.Doc/Factura"
                  outlined
                  v-model="form.documento"
                  hide-details
                  type="text"
                  :error="errores.documento"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker2"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Fecha factura"
                      outlined
                      v-model="form.fechaFactura"
                      hide-details
                      v-on="on"
                      :error="errores.fechaFactura"
                      @input="errores.fechaFactura = false"
                      @chance="errores.fechaFactura = false"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFactura"
                    @input="dialogPicker2 = false"
                    @chance="errores.fechaFactura = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

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
                      label="Fecha Vencimiento"
                      outlined
                      v-model="form.fechavence"
                      hide-details
                      v-on="on"
                      :error="errores.fechavence"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechavence"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  label="Ubicacion"
                  :items="ubicaciones"
                  outlined
                  clearable
                  return-object
                  persistent-hint
                  hide-details
                  required
                  item-value="codigo_ubic"
                  :item-text="format_ubicacion"
                  v-model="form.ubicacion"
                  v-if="
                    form.doc_origen
                      ? form.doc_origen == 1
                        ? true
                        : false
                      : true
                  "
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="form.observaciones"
                  hide-details
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-end col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                :loading="load.btn_enviar"
                :disabled="disabled.btn_enviar"
                @click="grabar_documento()"
                >Grabar Documento</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.imprimir_factura"
                :loading="load.imprimir_factura"
                @click="imprimir_documento"
              >
                Imprimir Documento</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="orange darken-1"
                class="white--text"
                large
                depressed
                block
                @click="subir_soportes"
                :loading="load.btn_up_soporte"
                :disabled="disabled.btn_up_soporte"
                >Subir soporte</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo.estado" max-width="700" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>{{
          dialogo.tipo
            ? "Agregar item"
            : "Modificar item " + (articulo_select.index + 1)
        }}</v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12">
              <v-col sm="8">
                <v-text-field
                  label="Codigo de barras"
                  outlined
                  hide-details
                  v-model="articulo_select.barras"
                  @keyup.enter="verificar_codigo()"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row sm="12" no-gutters>
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
                v-model="articulo_select.producto"
                :item-text="format_productos"
                :loading="load.servicios"
              >
              </v-autocomplete>
            </v-row>
            <v-row sm="12" no-gutters>
              <v-autocomplete
                label="Ubicacion"
                :items="ubicaciones"
                outlined
                clearable
                return-object
                persistent-hint
                required
                item-value="codigo_ubic"
                v-model="articulo_select.ubicacion"
                :item-text="format_ubicacion"
              >
              </v-autocomplete>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  v-model="articulo_select.cantidad"
                  @input="calcularSubtotal"
                  type="number"
                  :disabled="form.doc_origen == 1"
                ></v-text-field>
              </v-col>

              <v-col sm="6">
                <v-text-field
                  label="Valor unitario"
                  outlined
                  hide-details
                  suffix="$"
                  v-model="articulo_select.valor"
                  @input="calcularSubtotal"
                  :disabled="form.doc_origen == 1"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="articulo_select.total"
                  ref="input_total"
                  suffix="$"
                ></v-text-field>
              </v-col>
            </v-row> -->
          </div>
        </v-form>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-row class="d-flex">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="get_productos()"
                depressed
              >
                <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
              </v-btn>
            </v-col>

            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="red darken-4 "
                text
                class
                block
                @click="dialogo.estado = false"
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="4" sm="4">
              <v-btn
                v-if="dialogo.tipo"
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_producto(1)"
              >
                Agregar Producto</v-btn
              >
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_producto(2)"
                >Modificar Producto
              </v-btn>
            </v-col>
          </v-row>
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
            color="green darken-2"
            class="white--text px-12 mx-5"
            @click="up_file"
            >Aceptar</v-btn
          >
        </v-card-actions>
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
              <b>
                <a class="nombredoc_print"></a>
              </b>
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
            <th>Producto</th>
            <th>Rut</th>
            <th>Documento</th>
            <th>Cantidad</th>
            <th>Valor</th>
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
    <v-dialog wrap v-model="dialogoregistro.estado" persistent max-width="1200">
      <v-flex xs12 md12>
        <v-card class="mx-auto col-12" max-width="600" elevation="2">
          <v-card-title>
            <span class="title col-12" v-html="dialogoregistro.titulo"> </span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-autocomplete
                  :items="productos"
                  clearable
                  hide-details
                  v-model="form.regprod"
                  :item-text="format_productos"
                  :error="errores.regprod"
                  @input="errores.regprod = false"
                  return-object
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class
              color="red"
              text
              @click="
                dialogoregistro.estado = false;
                form.regprod = null;
                errores.regprod = false;
              "
              >Cancelar</v-btn
            >
            <v-btn
              class="ml-2"
              color="green darken-1"
              depressed
              dark
              text
              @click="registrar()"
              >Registrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import { comprobantes_inv } from "../../_formatos.pdf";

export default {

  data() {
    return {
      agencias: [],
      clientes: [],
      toperacion: [],
      productos: [],
      tablaccosto: [],
      tablaactprod: [],
      tablapesajes: [],
      vlrIva: "0",
      porcbolsa: 0,
      error_registro: false,
      select_tipo: true,

      listas: [],
      tablaPuc: [],
      ubicaciones: [],
      load: {
        btn_enviar: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
        consecutivo: false,
        btn_up_soporte: false,
      },
      dialogoregistro: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "idItem",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descr_producto",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "V.Unitario",
            align: "center",
            value: "valorBase",
          },

          // {
          //   text: "V.Descuento",
          //   align: "center",
          //   value: "valorDescuento"
          // },

          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Iva",
            align: "center",
            value: "valorIva",
          },
          {
            text: "Total",
            align: "center",
            value: "valorTotal",
          },
          {
            text: " ",
            align: "center",
            value: "action",
          },
          {
            text: "Descripción Factura",
            align: "left",
            value: "descripcion",
          },
        ],
        data: [],
        totales: {},
      },
      form: {
        proveedor_input: null,
        documento: null,
        fechavence: null,
        observaciones: null,
        ubicacion: null,
        retencion: null,
        valorRetencion: null,
        total_iva_format: null,
        total_iva5_format: null,
      },
      dialogo: {
        estado: false,
        tipo: false,
        item: null,
      },
      articulo_select: {
        producto: null,
        lista: null,
        iva: 0,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        generar_factura: true,
        imprimir_factura: true,
        btn_enviar: false,
        btn_up_soporte: true,
      },
      errores: {
        punto_fact: false,
        tipo_oper: false,
        fpago: false,
        retencion: false,
        documento: false,
        doc_origen: false,
        fechaFactura: false,
        fechavence: false,
        ccosto: false,
        regprod: false,

        xml: false,
        clientes: false,
      },
      print: {
        comprobante: null,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      data_xml: null,
      dialogPicker: false,
      dialogPicker2: false,
      dialogPicker3: false,
      total_iva_format: null,
      total_iva5_format: null,
      valorRetencion: null,
      subtotal_format: null,
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
        agencia: null,
        tipo_operacion: null,
        fecha: null,
      },

      producto_cod: "",
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaAg();
    this.cargarTablaccostos();
    this.cargaroperaciones();
    this.get_fecha();
    this.get_Clientes();
    //    this.get_productos();
    this.get_ubicaciones();

    // this.cargarTablaAct();
    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        // $this.tablaDetalle.totales.total_descuentos = 0;
        $this.tablaDetalle.totales.total_subtotal = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total_total = 0;

        e.forEach((val) => {
          var cantidad = parseInt(val.cantidad);
          // $this.tablaDetalle.totales.total_descuentos += val.valorDescuento;
          $this.tablaDetalle.totales.total_subtotal += val.sub_total * cantidad;
          $this.tablaDetalle.totales.total_iva += val.valorIva;
          $this.tablaDetalle.totales.total_total +=
            val.valorTotal + val.valorIva - val.valorDescuento;
        });
        var sbtotal = parseInt($this.tablaDetalle.totales.total_subtotal);
        $this.subtotal_format = sbtotal;

        // $this.tablaDetalle.totales.total_iva = $this.tablaDetalle.totales.total_iva.toFixed(2);
        $this.form.total_iva_format =
          $this.tablaDetalle.totales.total_iva.toFixed(2);
      },
      { deep: true }
    );
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.porcbolsa = this.datosEmpresa.porcbolsa_empr;
          this.get_puc();
          this.get_productos();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_puc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc = data;
          var busq_ctarteiva = this.tablaPuc.find(
            (el) =>
              el.cod_puc.trim() == this.datosEmpresa.ctarteivapas_empr.trim()
          );
          this.form.ctarteivapas = busq_ctarteiva;

          var busq_ctarteica = this.tablaPuc.find(
            (el) =>
              el.cod_puc.trim() == this.datosEmpresa.ctarteicapas_empr.trim()
          );
          this.form.ctarteicapas = busq_ctarteica;

          let busq_cta = this.tablaPuc.find(
            (el) =>
              el.cod_puc.trim() == this.datosEmpresa.ctaiva5pas_empr.trim()
          );
          this.form.ctaiva5 = busq_cta;

          busq_cta = this.tablaPuc.find(
            (el) =>
              el.cod_puc.trim() == this.datosEmpresa.ctaiva19pas_empr.trim()
          );
          this.form.ctaiva = busq_cta;
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    verificar_codigo() {
      var codigo = this.articulo_select.barras;
      this.dialogo.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfProductosJB.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|1|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.loader = false;
          let busqueda = this.productos.find(
            (el) => el.codigo_pr.trim() == data[0].codigo_pr.trim()
          );
          this.articulo_select.producto = busqueda;
        })
        .catch((err) => {
          this.dialogo.loader = false;
          this.load.servicios = false;
        });
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.model = null;
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
    subir_soportes() {
      if (!this.dialogo_archivo.tipo_operacion) {
        this.send_error("Debe seleccionar un tipo de documento");
      } else {
        this.dialogo_archivo.estado = true;
        let empresa = sessionStorage.Sesion.substr(0, 15);
        let tipoDocumento =
          this.dialogo_archivo.codigo_agc + this.dialogo_archivo.tipo_operacion;
        let consecutivo = this.dialogo_archivo.consecutivo;
        var fecha = this.dialogo_archivo.fecha;

        this.dialogo_archivo.ruta_pdf = `${empresa}_${tipoDocumento}_${consecutivo
          .trim()
          .padStart(12, "0")}_${fecha}`;
      }
    },
    cargarTablaAct: function () {
      post
        .postData({
          url: "Financiero/dlls/CfActivProdJ.DLL",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaactprod = [];
          this.tablaactprod = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar actividades Produccion",
            estado: true,
          });
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
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_actprod: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    modificar_item(item) {
      let documentoOrigen = this.form.doc_origen;
      let index = this.tablaDetalle.data.indexOf(item);
      let item_copia = JSON.parse(JSON.stringify(item));
      let obj_editar = null;

      if (documentoOrigen == 2) {
        obj_editar = item_copia;
      } else {
        let busqueda_articulo = this.productos.find(
          (el) => el.codigo_pr.trim() == item_copia.codigo_articulo
        );

        obj_editar = {
          producto: busqueda_articulo || null,
          lista: null,
          iva: 0,
          valor: item_copia.valorBase.toString(),
          cantidad: item_copia.cantidad,
          subtotal: item_copia.valorBase,
          total: item_copia.valorTotal.toString(),
          descuento: 0,
          valorDescuento: item_copia.valorDescuento.toString(),
          valorIva: item_copia.valorIva,
          ubicacion: {
            codigo_ubic: "0001",
            consigna_ubic: "",
            estado_ubic: "0",
            descrip_ubic: "PUNTO PRINCIPAL",
          },
          ivaTotal: item_copia.valorIva / item_copia.cantidad,
          valorBase: item_copia.valorBase,
          sub_total: item_copia.valorBase,
          valorTotal: item_copia.valorTotal,
          descripcion: item_copia.descripcion,
          codigo_articulo: item_copia.codigo_articulo,
        };
      }

      this.articulo_select = obj_editar;
      this.articulo_select.index = index;
      this.dialogo.estado = true;
      this.dialogo.tipo = false;
    },
    imprimir_documento() {
      var sesion = sessionStorage.Sesion;
      var datosEnvio = sesion + "|" + this.print.comprobante;
      this.load.imprimir_factura = true;
      this.disabled.imprimir_factura = true;
      post
        .postData({
          url: "Ptovta/dlls/PrReimpinvj.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          data.pop();
          let factura = data;

          let detalles = factura.map((item) => {
            item.registros.pop();
            item.registros = item.registros.map((el) => {
              el.producto = el.base1_pr
                ? window.atob(
                    el.base1_pr.trim() +
                      el.base2_pr.trim() +
                      el.base3_pr.trim() +
                      el.base4_pr.trim() +
                      el.base5_pr.trim()
                  )
                : "";
              return el;
            });
          });
          this.detalle = detalles;
          this.print_doc(factura[0]);
        })
        .catch((err) => {
          console.log(err);
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.load.btn_enviar = false;
          this.disabled.btn_enviar = false;
          this.send_error("Ha ocurrido un error durante la impresión");
        });
    },
    print_doc(item) {
      var data = JSON.parse(JSON.stringify(item));
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.fecha_impr = this.$moment().format("YYYY-MM-DD");
        0;
        data.hora_impr = this.$moment().format("HH:mm");
        comprobantes_inv(data).then(() => {
          console.log("Impresión terminada");
        });
      });
    },
    calcular_retencion() {
      var subTotal = parseFloat(this.subtotal_format);
      let retencion = this.form.retencion.value;

      if (retencion === 99) {
        retencion = this.porcbolsa;
      }
      var porcentaje_ret = retencion / 100;
      var valorRetencion = subTotal * porcentaje_ret;
      this.form.valorRetencion =
        this.formatNumero(valorRetencion.toFixed(0)) || null;
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    agregar_producto(tipo) {
      var articulo = this.articulo_select;
      let tipoOperacion = this.form.tipo_oper.llave_tpoper;

      if (!articulo.producto) {
        this.send_error("Debes seleccionar un producto");
      } else if (!articulo.ubicacion) {
        this.send_error("Seleccione una ubicación");
      } else if (!articulo.cantidad) {
        this.send_error("Ingresa una cantidad");
      } else {
        var item = JSON.parse(JSON.stringify(articulo));
        if (tipoOperacion === "E23" || tipoOperacion === "E24") {
          item.ivaTotal = 0;
          articulo.cantidad = 0;
        }

        let iva = parseFloat(item.ivaTotal.toString().replace(/\,/g, "")) || 0;
        // let iva = "0";
        item.valorBase = item.subtotal;
        item.sub_total = item.subtotal;
        item.valorIva = iva * item.cantidad;
        item.valorTotal = item.subtotal * item.cantidad;

        if (this.form.doc_origen == 2) {
          item.descr_producto = item.producto.descripcion_pr.trim();
        } else {
          item.descripcion = item.producto.descripcion_pr.trim();
        }

        item.codigo_articulo = item.producto.codigo_pr.trim();

        if (tipo == 1) this.tablaDetalle.data.push(item);
        else {
          const tabla = JSON.parse(JSON.stringify(this.tablaDetalle.data));
          const index = articulo.index;
          delete item.index;

          tabla[index] = item;
          this.tablaDetalle.data = [];
          this.tablaDetalle.data = tabla;
        }

        this.dialogo.estado = false;
        this.clear_form();
      }
    },
    cargar_registroProd(cod) {
      this.dialogoregistro.estado = true;
      this.dialogoregistro.titulo = cod.descripcion.trim();
      this.producto_cod = cod; //cod.cod
    },
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
    calcularSubtotal() {
      var item = this.articulo_select;
      var valorFormat =
        parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
      this.articulo_select.valor = this.formatNumero(valorFormat);
      var iva = parseInt(item.producto.tiva_pr) / 100;
      var subtotal = valorFormat;
      var descuento =
        parseFloat(item.descuento.toString().replace(/\,/g, "")) || 0;
      var valorDescuento = subtotal * (descuento / 100);
      var subValor = subtotal - valorDescuento;

      // var valorIva = (subValor * iva).toFixed(2);
      // var valor = subValor + parseFloat(valorIva);
      var valor = subValor;
      post
        .postData({
          url: "Ptovta/dlls/PrDecimal.dll",
          data: sessionStorage.Sesion + "|" + subValor + "|" + iva + "|",
          method: "",
        })
        .then((data) => {
          var valorIva = parseFloat(data[0].valor_rep.trim());
          this.articulo_select.ivaTotal = this.formatNumero(valorIva);
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al calcular Iva",
            estado: true,
          });
        });

      var cantidad = parseFloat(item.cantidad) || 0;

      var total = valor * cantidad;

      this.articulo_select.descuento = descuento;
      this.articulo_select.cantidad = cantidad;

      this.articulo_select.valorDescuento = this.formatNumero(valorDescuento);
      this.articulo_select.total = this.formatNumero(total);
      this.articulo_select.subtotal = subtotal;
    },
    async validar_productos(proveedor, productos) {
      const promesas = productos.map((p) =>
        post
          .postData({
            url: "Financiero/dlls/PrvalidaprodJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              proveedor +
              "|" +
              p.codigo_articulo +
              "|",
            method: "",
          })
          .then(
            (data) => (
              (this.error_registro = true),
              {
                ...p,
                registrar: false,
                cod_producto: data[0].cod_rep.trim(),
                descr_producto: data[0].descr_rep.trim(),
              }
            )
          )
          .catch((err) => {
            this.error_registro = false;
            return { ...p, registrar: true };
          })
      );

      const productosContabilizados = await Promise.all(promesas);

      this.tablaDetalle.data = productosContabilizados;
    },

    async validar() {
      let partesProveedor = this.form.proveedor_input.split(" - ");

      // Obtener el idProveedor
      let idProveedor = partesProveedor[0];

      await this.validar_productos(idProveedor, this.tablaDetalle.data);
    },

    async grabar_documento() {
      var data = this.form;

      if (this.form.doc_origen == 1) {
        let partesProveedor = this.form.proveedor_input.split(" - ");
        let idProveedor = partesProveedor[0];
        this.error_registro = false;

        await this.validar_productos(idProveedor, this.tablaDetalle.data); // funcion validar
      } else {
        this.error_registro = true;
      }

      if (!data.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error(" Selecciona una agencia");
      } else if (!this.error_registro) {
        this.send_error("Productos sin Homologar en Proveedores");
      } else if (!data.tipo_oper) {
        this.errores.tipo_oper = true;
        this.send_error(" Selecciona un tipo de operación");
      } else if (!data.ccosto) {
        this.errores.ccosto = true;
        this.send_error(" Selecciona un Centro de costo");
      } else if (!data.documento) {
        this.errores.documento = true;
        this.send_error(" Selecciona un numero de factura");
      } else if (!data.retencion) {
        this.errores.retencion = true;
        this.send_error(" Selecciona tarifa retencion");
      } else if (!data.doc_origen) {
        this.errores.doc_origen = true;
        this.send_error(" Selecciona un documento de origen");
      } else if (!data.fechaFactura) {
        this.errores.fechaFactura = true;
        this.send_error(" Digite Fecha de la Factura");
      } else if (data.doc_origen == 1 && !data.xml) {
        this.errores.xml = true;
        this.send_error(" Selecciona un archivo XML");
      } else if (data.doc_origen == 1 && !data.xml) {
        this.errores.xml = true;
        this.send_error(" Selecciona un archivo XML");
      } else if (data.doc_origen == 2 && !data.proveedor) {
        this.errores.clientes = true;
        this.send_error("Selecciona un proveedor");
      } else if (data.doc_origen == 2 && this.tablaDetalle.data.length == 0) {
        this.send_error("Debes ingresar el detalle de la factura");
      } else if (!data.fechavence) {
        this.send_error("Ingresa la fecha de vencimiento");
      } else if (data.doc_origen == 1 && !data.ubicacion) {
        this.send_error("Selecciona una ubicación");
      } else {
        var detalle = this.tablaDetalle.data;
        this.load.btn_enviar = true;
        this.disabled.btn_enviar = true;
        this.get_plano(detalle)
          .then((plano) => {
            var sesion = sessionStorage.Sesion;
            var agencia = data.punto_fact.codigo_agc;
            var ccosto = data.ccosto.llavecentro_cost;
            // var actprod = data.actprod.cod_rep;
            var tipoOperacion = data.tipo_oper.llave_tpoper;
            var consecutivo = data.consecutivo;
            var fecha = data.fecha.replace(/\-/g, "");
            var documentoOrigen = data.doc_origen;
            var nombreXml = data.xml ? data.xml.name : "";
            var documento = data.documento;
            var rtefte = (data.valorRetencion || "0").replace(/,/g, "").trim();
            var porcrte = data.retencion.value;
            var rteica = (data.valorReteica || "0").replace(/,/g, "").trim();
            var rteiva = (data.valorReteiva || "0").replace(/,/g, "").trim();
            var iva = data.total_iva_format
              ? data.total_iva_format.replace(/,/g, "").trim()
              : 0;
            var iva5 = data.total_iva5_format
              ? data.total_iva5_format.replace(/,/g, "").trim()
              : 0;
            var nomtipoper = data.tipo_oper.descrip_tpoper;
            var otrosdctos = (data.otrosdctos_format || "0")
              .replace(/,/g, "")
              .trim();

            var proveedor_name =
              data.doc_origen == 2
                ? data.proveedor
                : data.proveedor_input.split("-")[0].trim();
            var proveedor = proveedor_name;
            var fechaVencimiento = data.fechavence.replace(/\-/g, "");
            var fechaFactura = data.fechaFactura.replace(/\-/g, "");
            var observaciones = data.observaciones || "";
            var tipocons = 0;
            var ctaiva = data.ctaiva ? data.ctaiva.cod_puc.trim() : 0;
            var ctaiva5 = data.ctaiva5 ? data.ctaiva5.cod_puc.trim() : 0;
            var ctarteiva = data.ctarteivapas
              ? data.ctarteivapas.cod_puc.trim()
              : 0;
            var ctaica = data.ctarteicapas
              ? data.ctarteicapas.cod_puc.trim()
              : 0;

            var datosEnvio =
              sesion +
              "|" +
              agencia +
              "|" +
              tipoOperacion +
              "|" +
              tipocons +
              "|" +
              consecutivo +
              "|" +
              fecha +
              "|" +
              documentoOrigen +
              "|" +
              nombreXml +
              "|" +
              documento +
              "|" +
              proveedor +
              "|" +
              rtefte +
              "|" +
              porcrte +
              "." +
              "|" +
              iva +
              "|" +
              otrosdctos +
              "|" +
              fechaVencimiento +
              "|" +
              observaciones +
              "|" +
              plano +
              "|" +
              nomtipoper +
              "|" +
              ccosto +
              "|" +
              "0" +
              "|" +
              fechaFactura +
              "|" +
              rteica +
              "|" +
              rteiva +
              "|" +
              ctaiva +
              "|" +
              ctarteiva +
              "|" +
              ctaica +
              "|" +
              ctaiva5 +
              "|" +
              iva5 +
              "|";
            post
              .postData({
                url: "Ptovta/dlls/PrRegInv.dll",
                data: datosEnvio,
                method: "",
              })
              .then((data) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.disabled.imprimir_factura = false;

                this.dialogo_archivo.agencia = agencia;
                this.dialogo_archivo.tipo_operacion = tipoOperacion;
                this.dialogo_archivo.consecutivo = consecutivo;
                this.dialogo_archivo.fecha = fecha;
                this.disabled.btn_up_soporte = false;

                this.print.comprobante = data[0];
                this.$emit("snack", {
                  color: "success",
                  text: "Inventario grabado correctamente",
                  estado: true,
                });
                this.reiniciar_formulario();
                this.get_consecutivo();
              })
              .catch((err) => {
                this.load.btn_enviar = false;
                this.disabled.btn_enviar = false;
                this.send_error("Error al grabar el inventario");
              });
          })
          .catch((err) => {
            this.disabled.btn_enviar = false;
            this.load.btn_enviar = false;
            this.send_error(err);
          });
      }
    },
    get_plano(detalle) {
      var $this = this;
      return new Promise((resolve, reject) => {
        var nuevo = [];

        detalle.forEach((el, idx) => {
          nuevo.push({
            codigo_articulo: el.cod_producto
              ? el.cod_producto
              : el.codigo_articulo,
            idItem: el.idItem || idx + 1,
            descripcion: el.descr_producto ? el.descr_producto : el.descripcion,
            cantidad: el.cantidad.toFixed(2) + ".",
            unitario: el.valorBase.toFixed(2) + ".",
            descuento: parseFloat(el.valorDescuento).toFixed(2) + ".",
            valorIva: (el.valorIva / el.cantidad).toFixed(2) + ".",
            ubicacion: el.ubicacion ? el.ubicacion.codigo_ubic : "001",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "PrReginvent");
        formData.append("data", JSON.stringify(nuevo));

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
    abrir_popup() {
      this.dialogo.estado = true;
      this.dialogo.tipo = true;
    },
    get_pesaje() {
      let tipooper = this.form.documento;
      if (tipooper == "E23") {
        this.consultar_pesaje();
      }
      this.form.total_iva_format = null;
      this.form.total_iva5_format = null;
    },
    consultar_pesaje: function () {
      let agencia = this.form.punto_fact.codigo_agc;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let rut = this.form.proveedor;
      post
        .postData({
          url: "Molinos/dlls/PrPesajeServJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            fecha +
            "|" +
            rut +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.tablapesajes = data;
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
    format_pesajes: function (val) {
      return `Nro_${parseInt(val.nro_pes)}  Kgs:${val.pesocomp_pes} Fecha:${
        val.fecha_pes
      }`;
    },

    get_xml(data) {
      var $this = this;
      if (data) {
        var reader = new FileReader();
        reader.readAsText(data);
        reader.onloadend = function () {
          var XML = reader.result;
          // console.log(xmlData);
          // var XML = new DOMParser().parseFromString(xmlData, "text/xml");
          var nitUser = sessionStorage.Sesion.substring(0, 15);
          var nitFactura = XML.match(
            /<cbc:CompanyID [^>]+>(.*?)<\/cbc:CompanyID>/g
          )[1].replace(/(<.+?>)/g, "");
          // var nitFactura = XML.getElementsByTagName("cac:ReceiverParty")[0]
          //   .childNodes[1].childNodes[3].childNodes[0].nodeValue;

          if (parseInt(nitUser) == parseInt(nitFactura))
            $this.get_data_xml(XML);
          else {
            $this.send_error(
              "El NIT del documento no corresponde a la empressa."
            );
            $this.form.xml = null;
          }
        };
      } else {
        this.form.proveedor_input = null;
        this.form.documento = null;
        this.form.fechavence = null;
        this.form.observaciones = null;
        this.form.observaciones = null;
        this.tablaDetalle.data = [];
        this.form.retencion = null;
        this.form.valorRetencion = null;
      }
    },
    get_data_xml(XML) {
      var _this = this;
      var XML_OBJ = new DOMParser().parseFromString(XML, "text/xml");

      var idFactura = XML.match(
        /<cbc:ParentDocumentID>(.*?)<\/cbc:ParentDocumentID>/g
      )[0].replace(/(<.+?>)/g, "");

      var idProveedor = XML.match(
        /<cbc:CompanyID [^>]+>(.*?)<\/cbc:CompanyID>/g
      )[0].replace(/(<.+?>)/g, "");

      post
        .postData({
          url: "Financiero/dlls/Cfruts2J.dll",
          data: sessionStorage.Sesion + "|" + idProveedor + "|",
          method: "",
        })
        .then((data) => {
          let code = data[0].code;
          if (code == 4) {
            _this.form.xml = null;
            _this.$emit("snack", {
              color: "error",
              text: "Proveedor sin registrar",
              estado: true,
            });
          } else {
            var idCliente = XML.match(
              /<cbc:CompanyID [^>]+>(.*?)<\/cbc:CompanyID>/g
            )[1].replace(/(<.+?>)/g, "");

            var descripcionProveedor = XML.match(
              /<cbc:RegistrationName>(.*?)<\/cbc:RegistrationName>/g
            )[0].replace(/(<.+?>)/g, "");

            var fechaFactura = XML.match(
              /<cbc:IssueDate>(.*?)<\/cbc:IssueDate>/g
            )[0].replace(/(<.+?>)/g, "");

            var vencimiento = XML.match(/<cbc:DueDate>(.*?)<\/cbc:DueDate>/g)
              ? XML.match(/<cbc:DueDate>(.*?)<\/cbc:DueDate>/g)[0].replace(
                  /(<.+?>)/g,
                  ""
                )
              : null;

            var items = XML.match(
              /<cac:InvoiceLine>([\s\S]*?)<\/cac:InvoiceLine>/g
            );
            var items_table = [];

            items.forEach((item, index) => {
              let codigo_articulo = null;
              let id = item.match(
                /<cac:SellersItemIdentification><cbc:ID([\s\S]*?)>([\s\S]*?)<\/cbc:ID><\/cac:SellersItemIdentification>/g
              );

              if (id) {
                codigo_articulo = id[0].replace(/(<.+?>)/g, "");
              } else {
                item = item.replace(/\s\s+/g, " ");
                let id2 = item.match(
                  /<cac:StandardItemIdentification> <cbc:ID([\s\S]*?)>([\s\S]*?)<\/cbc:ID> <\/cac:StandardItemIdentification>/g
                );
                if (id2) {
                  codigo_articulo = id2[0].replace(/(<.+?>)/g, "");
                  codigo_articulo = codigo_articulo.trim();
                } else {
                  let id3 = item.match(
                    /<cac:ManufacturersItemIdentification>([\s\S]*?)<\/cac:ManufacturersItemIdentification>/g
                  );

                  if (id3) {
                    codigo_articulo = id3[0]
                      .match(/<cbc:ID([\s\S]*?)>([\s\S]*?)<\/cbc:ID>/g)[0]
                      .replace(/(<.+?>)/g, "");
                  }
                }
              }

              let idItem = index + 1;

              let descripcion = item
                .match(/<cbc:Description>([\s\S]*?)<\/cbc:Description>/g)[0]
                .replace(/(<.+?>)/g, "");

              let cantidad = item
                .match(
                  /<cbc:InvoicedQuantity([\s\S]*?)>([\s\S]*?)<\/cbc:InvoicedQuantity>/g
                )[0]
                .replace(/(<.+?>)/g, "");

              let valor = item
                .match(
                  /<cbc:PriceAmount([\s\S]*?)>([\s\S]*?)<\/cbc:PriceAmount>/g
                )[0]
                .replace(/(<.+?>)/g, "");

              let iva = item
                .match(
                  /<cbc:TaxAmount([\s\S]*?)>([\s\S]*?)<\/cbc:TaxAmount>/g
                )[0]
                .replace(/(<.+?>)/g, "");

              let porcentajeIva = item
                .match(/<cbc:Percent([\s\S]*?)>([\s\S]*?)<\/cbc:Percent>/g)[0]
                .replace(/(<.+?>)/g, "");

              let descuento = item.match(
                /<cbc:Amount([\s\S]*?)>([\s\S]*?)<\/cbc:Amount>/g
              )
                ? item
                    .match(/<cbc:Amount([\s\S]*?)>([\s\S]*?)<\/cbc:Amount>/g)[0]
                    .replace(/(<.+?>)/g, "")
                : "0";

              items_table.push({
                codigo_articulo,
                idItem,
                descripcion,
                cantidad: parseFloat(cantidad),
                valorBase: parseFloat(valor),
                valorIva: parseFloat(iva),
                porcentajeIva: parseFloat(porcentajeIva),
                valorTotal: parseFloat(valor) * parseFloat(cantidad),
                valorDescuento: parseFloat(descuento),
                sub_total: parseFloat(valor) - 0,
              });
            });

            this.data_xml = {
              idFactura,
              idProveedor,
              descripcionProveedor,
              idCliente,
              vencimiento,
              detalle: items_table,
              observaciones: null,
              fechaFactura,
            };

            this.form.proveedor_input =
              idProveedor + " - " + descripcionProveedor;
            this.form.documento = this.data_xml.idFactura;
            this.form.fechavence = this.data_xml.vencimiento;
            this.form.observaciones = this.data_xml.observaciones;
            this.form.fechaFactura = this.data_xml.fechaFactura;
            this.tablaDetalle.data = this.data_xml.detalle;
            this.validar_productos(idProveedor, this.tablaDetalle.data); // funcion validar
          }
        })
        .catch((err) => {
          console.log("Err", err);
        });
    },
    reset_form() {
      this.validar_tipo();
      this.form.proveedor_input = null;
      this.form.documento = null;
      this.form.fechavence = null;
      this.form.observaciones = null;
      this.form.xml = null;
      this.form.fechaFactura = null;
      this.tablaDetalle.data = [];
      this.form.retencion = null;
      this.form.valorRetencion = null;
    },
    reiniciar_formulario() {
      this.form.consecutivo = null;
      this.form.fpago = null;
      this.form.xml = null;
      this.form.proveedor = null;
      this.form.valorReteica = null;
      this.form.valorReteiva = null;
      this.form.valorRetencion = null;
      this.form.total_iva_format = null;
      this.form.total_iva5_format = null;
      this.form.otrosdctos_format = null;

      this.form.proveedor_input = null;
      this.form.documento = null;
      this.form.documento = null;
      this.form.fechavence = null;
      this.form.observaciones = null;
      this.tablaDetalle.data = [];
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
    cargaroperaciones() {
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          this.toperacion = data;
          this.form.doc_origen = 2;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar operaciones",
            estado: true,
          });
        });
    },
    validar_tipo() {
      var tipoOperacion = this.form.tipo_oper;
      if (tipoOperacion.llave_tpoper == "E01") {
        this.select_tipo = false;
      } else {
        this.form.doc_origen = 2;
        this.select_tipo = true;
      }
    },
    registrar() {
      const repetido = this.tablaDetalle.data.some(
        (el) => el.cod_producto == this.form.regprod.codigo_pr
      );

      if (this.form.regprod && !repetido) {
        this.loader = true;

        let partesProveedor = this.form.proveedor_input.split(" - ");

        // Obtener el idProveedor
        let idProveedor = partesProveedor[0];
        const idproveedor = idProveedor;
        // const codproducto = this.producto_cod;

        const codproducto = this.producto_cod.codigo_articulo;
        const codproduc = this.form.regprod.codigo_pr;
        const descmedicamento = this.form.regprod.descripcion_pr;
        post
          .postData({
            url: "Financiero/dlls/Prvalidaprod.Dll",
            data:
              sessionStorage.Sesion +
              "|" +
              idproveedor +
              "|" +
              codproducto +
              "|" +
              codproduc +
              "|" +
              descmedicamento +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            // let producto = this.tablaDetalle.data.find(
            //   (el) => el.codigo === codproducto
            // );
            // producto.cod_producto = codproduc;
            // producto.registrar = false;

            this.dialogoregistro.estado = false;
            this.form.regprod = null;
            this.validar();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al validar productos",
              estado: true,
            });
          });
      } else {
        this.send_error(
          !this.form.regprod
            ? "Producto obligatorio!"
            : "Este Producto ya registrado!"
        );
        this.errores.regprod = true;
      }
    },
    get_consecutivo() {
      var $this = this;
      var agencia = this.form.punto_fact;
      var tipoOperacion = this.form.tipo_oper;
      this.validar_tipo();
      if (agencia && tipoOperacion) {
        this.load.consecutivo = true;
        var fecha = this.form.fecha.replace(/\-/g, "");

        var documento = tipoOperacion.llave_tpoper;
        if (!this.form.documento) {
          this.form.documento = documento;
        }
        var tipocons = tipoOperacion.tiponumer_tpoper;
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
              documento +
              "|" +
              tipocons +
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    get_productos() {
      this.loader = true;
      let ciudad = this.datosEmpresa.codciudad_empr;
      let id = this.datosEmpresa.id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/PRODUCTOS.JSON";
      post
        .postData({
          url: ruta,
          data: "",
          method: "GET",
        })
        .then((data) => {
          var data_parse = data.productos;
          data_parse.pop();
          // var data_parse = JSON.parse(JSON.stringify(data));
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
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    get_ubicaciones: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubicaciones = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    get_fecha() {
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
      this.form.fechaFactura = this.$moment().format("YYYY-MM-DD");
      this.form.fechavence = this.$moment().format("YYYY-MM-DD");
    },
    clear_form() {
      this.articulo_select = {
        producto: null,
        lista: null,
        iva: 0,
        valor: 0,
        cantidad: 0,
        subtotal: 0,
        total: 0,
        descuento: 0,
        valorDescuento: 0,
        valorIva: 0,
      };
    },
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_pr.trim()}`;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_operacion: function (val) {
      return `${val.llave_tpoper} - ${val.descrip_tpoper}`;
    },
    format_operador: function (val) {
      let string = null;
      if (val) {
        string = `${parseInt(val.identificacion_rut)} - ${
          val.descripcion_rut ? val.descripcion_rut.trim() : ""
        }`;
      }

      return string;
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
  document.getElementsByClassName("nit_print")[0].innerHTML = "";
  document.getElementsByClassName("nombredoc_print")[0].innerHTML = "";
  document.getElementsByClassName("consecutivo_print")[0].innerHTML = "";
  document.getElementsByClassName("fecha_print")[0].innerHTML = "";
  // document.getElementsByClassName("total_debito")[0].innerHTML = "";
  document.getElementsByClassName("total_credito")[0].innerHTML = "";
  document.getElementsByClassName("impreso_print")[0].innerHTML = "";
  document.getElementsByClassName("fechagen_print")[0].innerHTML = "";
  document
    .getElementById("pdf_body_comp")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}
</script>
