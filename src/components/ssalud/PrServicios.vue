<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-row>
                <v-col class="d-flex" cols="10">
                  <v-list-item-title class="headline"
                    >Prestación de servicios Salud
                  </v-list-item-title>
                </v-col>
                <v-col class="d-flex align-end justify-end" cols="2">
                  <v-btn
                    id="btn_grabar"
                    color="purple darken-1 white--text"
                    depressed
                    @click="abrir_factura()"
                  >
                    Facturación
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-divider
          class="mb-5"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFecha"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="info_servicios.fecha"
                      label="Fecha"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="info_servicios.fecha"
                    @input="pickeFecha = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  clearable
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
                <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="info_servicios.consecutivo"
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro"
                  hide-details
                  :loading="load.contratos"
                  v-model="contrato_select"
                  @change="get_servicios"
                  clearable
                  return-object
                  :error="errores.contrato"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Autorización Agendada"
                  outlined
                  v-model="info_servicios.autorizacion"
                  hide-details
                  :error="errores.autorizacion"
                  @input="errores.autorizacion = false"
                  @keyup.enter="focusNextField('Id_Paciente')"
                  @change="disabled.soportes == true"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="12" sm="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue"
                      fab
                      small
                      outlined
                      icon
                      v-on="on"
                      @click="abrir_qr()"
                    >
                      <v-icon>mdi-qrcode-scan</v-icon>
                    </v-btn>
                  </template>
                  <span>Escanear QR</span>
                </v-tooltip>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Autorización Eps"
                  outlined
                  v-model="info_servicios.autorizaeps"
                  hide-details
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
            <v-row class="mt-1 d-flex">
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Id_Paciente"
                  id="Id_Paciente"
                  outlined
                  v-model="info_servicios.paciente"
                  hide-details
                  :error="errores.paciente"
                  @input="errores.paciente = false"
                  @change="errores.paciente = false"
                  @keyup.enter="buscar_paciente()"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="buscar_paciente()"
                      color="indigo accent-3"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      class="mr-10"
                    >
                      <v-icon>mdi-account-search-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Buscar Paciente</span>
                </v-tooltip>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="crear_paciente()"
                      color="green"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      class="mr-1"
                    >
                      <v-icon>mdi-plus-box-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar Paciente</span>
                </v-tooltip>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="open_consentimiento()"
                      color="purple"
                      fab
                      small
                      icon
                      outlined
                      :disabled="disabled.btn_consent"
                      v-on="on"
                      class="mr-1"
                    >
                      <v-icon>mdi-alpha-c-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Consentimientos</span>
                </v-tooltip>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_soporte()"
                      color="red"
                      fab
                      small
                      icon
                      outlined
                      :disabled="disabled.btn_consent"
                      v-on="on"
                      class="mr-1"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Soporte Agenda</span>
                </v-tooltip>
              </v-col>

              <!-- <v-col class="d-flex justify-start align-center" cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="firmaDialog = true"
                      color="red accent-3"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      class="mr-10"
                    >
                      <v-icon>mdi-account-search-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Firmar Consentimiento</span>
                </v-tooltip>
              </v-col> -->
              <v-col class="d-flex" cols="5">
                <v-text-field
                  label="Descripcion Paciente"
                  outlined
                  disabled
                  v-model="info_servicios.descripaciente"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="d-flex"
                cols="6"
                sm="6"
                v-if="info_servicios.paciente"
              >
                <v-autocomplete
                  outlined
                  label="Citas"
                  clearable
                  :items="citas"
                  hide-details
                  return-object
                  multiple
                  :loading="load.citas"
                  :item-value="format_val_cita"
                  :item-text="format_cita"
                  v-model="info_servicios.cita"
                  :error="errores.cita"
                  chips
                  @change="select_cita(), (errores.cita = false)"
                ></v-autocomplete>
              </v-col>
              <v-col sm="3" cols="3">
                <v-select
                  :items="[
                    { text: 'Nivel 1', value: 1 },
                    { text: 'Nivel 2', value: 2 },
                    { text: 'Nivel 3', value: 3 },
                  ]"
                  label="Nivel"
                  outlined
                  clearable
                  hide-details
                  @change="calcular_abono()"
                  v-model="info_servicios.nivel"
                ></v-select>
              </v-col>
              <v-col sm="3" cols="3">
                <v-select
                  :items="regimen"
                  label="Régimen"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.regimen"
                ></v-select>
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
                  >Detalle servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4"
                  dark
                  class
                  @click="
                    dialogo.estado = true;
                    dialogo.tipo = true;
                  "
                  depressed
                >
                  <v-icon size="20" left>mdi-basket-outline</v-icon>Agregar
                  servicio
                </v-btn>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.index="{ item }">
                  {{
                    tablaDetalle.data
                      .map(function (x) {
                        return x.codigo;
                      })
                      .indexOf(item.codigo) + 1
                  }}
                </template>
                <template v-slot:item.descripcion="{ item }">
                  <b>{{ item.descripcion.trim() }}</b>
                </template>
                <template v-slot:item.valor_iva="{ item }">
                  {{ formatNumero(item.iva_total) }}
                </template>
                <template v-slot:item.subtotal="{ item }">
                  {{
                    formatNumero(item.valor.replace(/\,/g, "") * item.cantidad)
                  }}
                </template>
                <template v-slot:item.sub_total="{ item }">
                  {{ formatNumero(item.sub_total) }}
                </template>
                <template v-slot:item.total="{ item }">
                  {{ formatNumero(item.total) }}
                </template>
                <template v-slot:item.action="{ item }">
                  <!-- <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="
                          edit_item(item);
                          dialogo.tipo = false;
                        "
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Modificar item</span>
                  </v-tooltip> -->
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red darken-4"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="delete_item(item)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar item</span>
                  </v-tooltip>
                </template>
                <template v-slot:body.append>
                  <td colspan="5" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.sub_total || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Cierre de Servicio</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  :items="[
                    { text: 'Copago', value: 1 },
                    { text: 'Cuota Moderadora', value: 2 },
                    { text: 'Total Servicio', value: 3 },
                    { text: 'Sin Pago', value: 4 },
                  ]"
                  label="Tipo Pago"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.tipopago"
                  :error="errores.tipopago"
                  @change="calcular_abono(), (errores.tipopago = false)"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-select
                  label="Consultorio/Sala"
                  v-model="info_servicios.consultorio"
                  :items="consultorios"
                  :item-text="format_consultorios"
                  hide-details
                  outlined
                  return-object
                  @change="errores.consultorio = false"
                  :error="errores.consultorio"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="5" v-if="dato_profesional">
                <v-select
                  label="Profesional"
                  v-model="info_servicios.profesional"
                  :items="profesional"
                  :item-text="format_profesional"
                  hide-details
                  outlined
                  return-object
                  @change="errores.profesional = false"
                  :error="errores.profesional"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Copago"
                  outlined
                  hide-details
                  prefix="$"
                  v-model="info_servicios.copago"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Cuota moderadora"
                  outlined
                  hide-details
                  prefix="$"
                  v-model="info_servicios.cuotaModeradora"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Descuento"
                  outlined
                  hide-details
                  prefix="$"
                  v-model="info_servicios.descto"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Pago Total"
                  outlined
                  hide-details
                  prefix="$"
                  v-model="info_servicios.pago"
                ></v-text-field>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Descuento"
                  outlined
                  hide-details
                  prefix="$"
                  v-money="money"
                  v-model="info_servicios.descuento"
                ></v-text-field>
              </v-col> -->
              <v-col sm="3" cols="3">
                <v-select
                  :items="[
                    { text: 'Efectivo', value: 1 },
                    { text: 'Crédito', value: 2 },
                    { text: 'Cortesia', value: 3 },
                  ]"
                  label="Medio de pago"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.medio_pago"
                ></v-select>
              </v-col>
              <v-row></v-row>
              <v-col sm="12">
                <v-autocomplete
                  :items="diagnosticos"
                  :item-text="format_diagnostico"
                  item-value="codigo"
                  label="Diagnostico"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="info_servicios.diagnostico"
                  :error="errores.diagnostico"
                  @change="errores.diagnostico = false"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="Acompañante"
                  outlined
                  hide-details
                  v-model="info_servicios.acompañante"
                  :error="errores.acompañante"
                  @input="errores.acompañante = false"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Telefóno"
                  outlined
                  hide-details
                  v-model="info_servicios.telacompañante"
                  :error="errores.telacompañante"
                  @input="errores.telacompañante = false"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="info_servicios.observaciones"
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-center col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="indigo"
                class="white--text"
                block
                large
                depressed
                @click="grabar_servicio"
                :loading="load.btn_enviar"
                :disabled="grabar.disabled"
                >Grabar Servicio</v-btn
              >
            </v-col>
            <v-col class="mr-4 pa-0 px-0" sm="3">
              <v-btn
                color="orange"
                class="white--text"
                block
                large
                depressed
                @click="imprimir"
                :loading="load.impresion"
                >Imprimir servicio</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="purple"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.soportes"
                @click="open_soporte()"
                >Subir Soportes</v-btn
              >
            </v-col>

            <v-col class="mt-3" sm="3">
              <v-btn
                color="red"
                class="white--text"
                block
                large
                depressed
                :disabled="disabled.fact_copago"
                @click="imprimir_fact_copago()"
                >Factura Copagos/Cuotas M.</v-btn
              >
            </v-col>
          </v-row>
          <!-- :disabled="impresion.disabled" -->
        </v-card-actions>
        <v-card-actions>
          <v-row class="d-flex justify-center col-12">
            <!-- <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                :loading="load.generar_factura"
                :disabled="disabled.generar_factura"
                @click="generar_factura"
                >Generar Factura</v-btn
              >
            </v-col> -->
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                :loading="load.imprimir_factura"
                :disabled="disabled.imprimir_factura"
                @click="imprimir_factura"
                >Imprimir Factura</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog max-width="1000" v-model="dialogocargue.estado">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>
            <span class="title col-12">Cargue Soportes</span>
          </v-card-title>

          <v-card-text>
            <v-row justify="center" class="d-flex">
              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Cargue Unico', value: 9 },

                    // { text: 'Cedula', value: 1 },
                    // { text: 'Autorización', value: 2 },
                    // { text: 'Orden Médica', value: 3 },
                    // { text: 'Historia Clinica', value: 4 },
                  ]"
                  label="Tipo Documento"
                  clearable
                  hide-details
                  return-object
                  v-model="form.tipodocum"
                  item-value="value"
                  :error="errores.tipocargue"
                  @change="errores.tipocargue = false"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-file-input
                  label="Cargar Documentos"
                  accept=".pdf"
                  outlined
                  hide-details
                  :error="errores.pdf"
                  @change="errores.pdf = false"
                  v-model="form.pdf"
                ></v-file-input>
              </v-col>
              <v-col class="d-flex justify-end mt-3">
                <v-btn
                  :loading="card_estado"
                  color="indigo"
                  class="white--text px-12"
                  depressed
                  @click="downloadFile"
                >
                  Ver Soporte
                </v-btn>
              </v-col>

              <v-col class="d-flex justify-end mt-3">
                <v-btn
                  :loading="card_estado"
                  color="purple"
                  class="white--text px-12"
                  depressed
                  @click="subir_pdf"
                >
                  Grabar Soporte
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-end mt-3">
                <v-btn
                  :loading="card_estado"
                  color="red"
                  class="white--text px-12"
                  depressed
                  @click="dialogocargue.estado = false"
                >
                  Cerrar
                </v-btn>
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="qr.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Escanea el código QR</v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Código"
            hide-details
            ref="codigo_qr"
            @keyup.enter="leer_qr"
            v-model="qr.codigo"
            clearable
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text large depressed @click="qr.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="firmaDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Firma Consentimientox</v-card-title>
        <v-card-text>
          <FirmaManuscrito @firmaGuardada="imprimirPDF" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text large depressed @click="firmaDialog = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="facturaDialog" max-width="1200" persistent>
      <v-card>
        <v-card-text>
          <PrFact01 v-if="PrFact01" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            large
            depressed
            @click="facturaDialog = false"
            class="white--text"
            >Regresar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="consent.estado"
      max-width="600"
      transition="dialog-bottom-transition"
    >
      <template>
        <v-card class="mt-3 px-6">
          <v-card-title>Impresión de Consentimientos</v-card-title>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                :items="consentimientos"
                label="Seleccione"
                clearable
                hide-details
                return-object
                v-model="form.select_consent"
                item-text="text"
                item-value="value"
                required
                @change="handleConsentImpresion"
              ></v-select>
            </v-col>
          </v-row>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />

          <v-card-actions class="justify-center">
            <v-btn
              color="red"
              class="white--text"
              depressed
              large
              @click="consent.estado = false"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="dialogo.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Agregar item</v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-autocomplete
                label="Servicio"
                :items="servicios"
                outlined
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="servicio_select.codigo"
                :item-text="format_servicios"
                @change="change_servicio_modal"
                :loading="load.servicios"
              ></v-autocomplete>
            </v-row>
            <v-row>
              <v-col sm="6">
                <v-text-field
                  label="Grupo"
                  outlined
                  disabled
                  hide-details
                  v-model="servicio_select.grupo"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  label="IVA"
                  outlined
                  disabled
                  hide-details
                  v-model="servicio_select.tar_iva"
                  suffix="%"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Valor"
                  outlined
                  hide-details
                  suffix="$"
                  v-money="money"
                  v-model="servicio_select.valor"
                  :disabled="disabled.valor"
                  @input="calcularSubtotal"
                  ref="input_valor"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  v-model="servicio_select.cantidad"
                  @input="calcularSubtotal"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="servicio_select.total"
                  ref="input_total"
                  v-money="money2"
                  suffix="$"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-form>
        <v-card-actions>
          <v-row class="d-flex justify-end">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="red darken-4 "
                text
                class
                block
                @click="
                  dialogo.estado = false;
                  clear_form();
                "
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                v-if="dialogo.tipo"
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_servicio"
                >Agregar servicio</v-btn
              >
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                @click="modificar_servicio"
                >Modificar articulo</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogopac.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Agregar Paciente</span>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />
        </v-card-title>

        <v-card-text class="pb-0" ref="form">
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="tipoid"
                label="Tipo identificacion"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipoid"
                :error="errores.tipoid"
                @input="errores.tipoid = false"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Id_Paciente"
                outlined
                required
                v-model="form.idpaciente"
                hide-details
                :error="errores.idpaciente"
                @input="errores.idpaciente = false"
                @change="errores.idpaciente = false"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="1er apellido"
                clearable
                outlined
                required
                v-model="form.primerApellido"
                :error="errores.primerApellido"
                @input="errores.primerApellido = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="2do apellido"
                clearable
                outlined
                v-model="form.segundoApellido"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Primer Nombre"
                clearable
                outlined
                required
                v-model="form.nombres"
                :error="errores.nombres"
                @input="errores.nombres = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Segundo Nombre"
                clearable
                outlined
                required
                v-model="form.nombre2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Correo"
                clearable
                outlined
                v-model="form.correo"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Telefono"
                clearable
                outlined
                v-model="form.telefono"
                counter="10"
                :rules="[(v) => (v && v.length <= 10) || 'Maximo 15 digitos']"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="5">
              <v-text-field
                label="Direccion"
                clearable
                outlined
                required
                :error="errores.direccion"
                @input="errores.direccion = false"
                v-model="form.direccion"
                :rules="[(v) => (v && v.length <= 60) || 'Maximo 60 digitos']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Departamento"
                v-model="form.departamento"
                :items="departamentos"
                item-value="value"
                outlined
                :error="errores.departamento"
                @change="
                  errores.departamento = false;
                  get_municipios();
                "
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Ciudad"
                v-model="form.ciudad"
                :items="filterMunicipios"
                item-value="value"
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                ref="menu"
                v-model="pickerNacimiento"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.nacimiento"
                    :value="format_fecha_nacimiento"
                    label="Fecha de nacimiento"
                    append-icon="event"
                    outlined
                    v-on="on"
                    :error="errores.nacimiento"
                    @change="calcularEdadpac, (errores.nacimiento = false)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.nacimiento"
                  @input="pickerNacimiento = false"
                  @change="calcularEdadpac"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Soltero', value: 0 },
                  { text: 'Casado', value: 1 },
                  { text: 'Union libre', value: 3 },
                  { text: 'Viudez', value: 5 },
                ]"
                label="Estado civil"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.estadoCivil"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="regimen"
                label="Regimen"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.regimen"
                item-text="text"
                item-value="value"
                required
                :error="errores.regimen"
                @change="errores.regimen = false"
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Eps"
                v-model="form.eps"
                :items="eps"
                item-value="value"
                outlined
                required
                :error="errores.eps"
                @change="errores.eps = false"
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Masculino', value: 0 },
                  { text: 'Femenino', value: 1 },
                ]"
                label="Genero"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.genero"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Edad"
                disabled
                outlined
                type="text"
                v-model="form.edad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Urbana', value: 0 },
                  { text: 'Rural', value: 1 },
                ]"
                label="Zona"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.zona"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Nivel 1', value: 1 },
                  { text: 'Nivel 2', value: 2 },
                  { text: 'Nivel 3', value: 3 },
                ]"
                label="Nivel"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.nivel"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-select
                :items="[
                  { text: 'Contributivo cotizante', value: 1 },
                  { text: 'Contributivo beneficiario', value: 2 },
                  { text: 'Contributivo adicional', value: 3 },
                  { text: 'Subsidiado', value: 4 },
                  { text: 'No afiliado', value: 5 },
                  { text: 'Especial o Excepcion cotizante', value: 6 },
                  { text: 'Especial o Excepcion beneficiario', value: 7 },
                  {
                    text: 'Personas privadas de la libertad a cargo del Fondo Nacional de Salud',
                    value: 8,
                  },
                  { text: 'Tomador / Amparado ARL', value: 9 },
                  { text: 'Tomador / Amparado SOAT', value: 10 },
                ]"
                label="Tipo Usuario"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipousuario"
                item-text="text"
                item-value="value"
                required
                :error="errores.tipousuario"
                @change="errores.tipousuario = false"
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <v-card-actions>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_paciente()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogopac.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

import { factura_titan } from "../../_formatos_sal";
import {
  prestacionServicios,
  prestacionServicios2,
  cons_electromioVeloc,
  cons_anfiltracion,
  cons_infoServicio,
  atencionDomiciliaria,
  compr_prestacionServ,
  planillaAtencion,
} from "../../_formatos_sal.js";

import FirmaManuscrito from "../FirmaManuscrito.vue";
import PrFact01 from "./PrFact01.vue";

export default {

  components: {
    FirmaManuscrito,
    PrFact01,
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      PrFact01: false,
      pickerNacimiento: false,
      pickeFecha: false,
      dato_profesional: false,
      empresa: [],
      form: {},
      eps: [],
      total_citas: 0,
      ciudades_dian: [],
      departamentos: [],
      autorizacion: [],
      profesional: [],
      datos_cons: [],
      card_estado: false,
      filterMunicipios: [],
      item_envio: {},
      datos_pr: {
        id_cliente: 0,
        idpaciente: 0,
        nro_auto: 0,
      },

      consentimientos: [
        { text: "Electromiografía", value: 1 },
        { text: "Infiltración", value: 2 },
        { text: "Servicio", value: 3 },
        { text: "Atención Domiciliaria", value: 4 },
        { text: "Prestacion de Servicio", value: 5 },
        { text: "Planilla de Atención", value: 6 },
      ],
      tipoid: [
        { text: "Cedula Ciudadania", value: "CC" },
        { text: "Tarjeta Identidad", value: "TI" },
        { text: "Registro Civil", value: "RC" },
        { text: "Permiso Esp.Permanencia", value: "PE" },
        { text: "Cedula Extranjería", value: "CE" },
        { text: "Adulto Sin Identificar", value: "AS" },
        { text: "Menor Sin Identificar", value: "MS" },
        { text: "Certificado Nacido Vivo", value: "NV" },
        { text: "Pasaporte", value: "PA" },
        { text: "Carnet Diplomatico", value: "CD" },
        { text: "Salvo Conducto", value: "SC" },
        { text: "Permiso por Proteccion Temporal", value: "PT" },
      ],
      regimen: [
        { text: "Subsidiado", value: 1 },
        { text: "Contributivo", value: 8 },
        { text: "Particular", value: 2 },
        { text: "Especial", value: 3 },
        { text: "Excepción", value: 4 },
        { text: "Plan Complementario", value: 5 },
        { text: "Otro", value: 9 },
      ],

      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 20) || "Maximo 20 digitos",
      ],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+\..+/.test(v) || "E-mail no es valido",
        (v) => (v && v.length <= 60) || "Maximo 60 digitos",
      ],

      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      firmaDialog: false,
      facturaDialog: false,
      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogocargue: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      load_card: false,
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "index",
          },
          {
            text: "Código",
            align: "center",
            value: "codigo",
          },
          {
            text: "Lote",
            align: "center",
            value: "lote",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descripcion",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Iva",
            align: "center",
            value: "valor_iva",
          },
          {
            text: "Total",
            align: "center",
            value: "total",
          },
          {
            text: " ",
            align: "center",
            value: "action",
          },
        ],
        data: [],
        totales: {},
      },

      contratos: [],
      pacientes: [],
      servicios: [],
      agencias: [],
      consultorios: [],
      info_servicios: {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: 0,
        pago: 0,
        consultorio: 0,
        descto: null,
        cuotaModeradora: null,
        paciente: null,
        observaciones: null,
        descuento: null,
        idpaciente: null,
        medio_pago: 1,
        cita: null,
        descripaciente: null,
        diagnostico: null,
      },
      contrato_select: null,
      consent: {
        estado: false,
      },
      dialogo: {
        estado: false,
        tipo: true,
      },
      personal: [],

      servicio_select: {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      },
      edit_index: -1,
      errores: {
        tipocargue: false,
        pdf: false,

        contrato: false,
        paciente: false,
        autorizacion: false,
        consultorio: false,
        tipopago: false,
        copago: false,
        cuota: false,
        observaciones: false,
        cita: false,
        diagnostico: false,
        idpaciente: false,
        nombres: false,
        primerApellido: false,
        departamento: false,
        ciudad: false,
        nacimiento: false,
        regimen: false,
        eps: false,
        genero: false,
        profesional: false,
        zona: false,
        punto_fact: false,
        acompañante: false,
        telacompañante: false,
        direccion: false,
        tipousuario: false,
      },
      citas: [],
      diagnosticos: [],
      impresion: {
        disabled: true,
        consecutivo: null,
        ruta_pdf: null,
        pref_copago: null,
        fact_copago: null,
        // consecutivo: "01000000000006"
      },
      grabar: {
        disabled: false,
      },
      disabled: {
        generar_factura: true,
        imprimir_factura: true,
        valor: false,
        btn_consent: true,
        soportes: true,
        fact_copago: true,
      },
      load: {
        contratos: true,
        pacientes: true,
        servicios: false,
        btn_enviar: false,
        citas: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
      },
      datos_factura: {
        fecha_atencion: null,
        consecutivo: null,
      },
      qr: {
        estado: false,
      },
      format_fecha_nacimiento: null,
    };
  },
  created() {
    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          let sub_total =
            parseFloat(val.sub_total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.sub_total += sub_total;

          let total_iva = parseFloat(val.iva_total) || 0;
          $this.tablaDetalle.totales.total_iva += total_iva;

          let total = parseFloat(val.total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total += total;
        });
      },
      { deep: true }
    );

    this.load_card = true;
    this.cargar_empresa();
    this.cargarTablaAg();
    this.get_consultorios();
    this.get_profesional();

    this.get_diagnosticos();
    this.get_contratos();
    this.get_fecha();
    this.cargarEps();
    this.cargarCiudades();
    // this.registrar_turno();
  },
  watch: {},
  methods: {
    async handleConsentImpresion(selectedValue) {
      if (this.info_servicios.cita == null) {
        this.send_error(
          "No hay cita seleccionada para imprimir el consentimiento!"
        );
        return;
      } else {
        if (selectedValue != null) {
          let data = this.pacientes;
          let select_servicio =
            this.info_servicios.cita[0].desc_servicio.trim();
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          data.desripEmpresa = this.empresa[0].descrip_empr;
          data.logo = await this.pdfs.getBase64(logo_src);
          data.nombrePaciente = `${data.nombres.trim()} ${data.nombre2.trim()} ${data.primerApellido.trim()} ${data.segundoApellido.trim()}`;
          let fecha = this.info_servicios.fecha;

          switch (selectedValue.value) {
            case 1:
              cons_electromioVeloc(data).then(() => {
                console.log("Impresion terminada");
              });
              break;
            case 2:
              cons_anfiltracion(data).then(() => {
                console.log("Impresion terminada");
              });
              break;
            case 3:
              var imagenCuerpo_src = require("../../assets/image/logos/CInformado01.png");
              data.cuerpoImagen = await this.pdfs.getBase64(imagenCuerpo_src);
              cons_infoServicio(data).then(() => {
                console.log("Impresion terminada");
              });
              break;
            case 4:
              atencionDomiciliaria(data).then(() => {
                console.log("Impresion terminada");
              });
              break;
            case 5:
              data.autorizacion = this.info_servicios.autorizacion;
              data.profesional = this.citas[0].descripcion.trim();
              data.servicio = select_servicio;
              data.fechaservicio = this.citas[0].fechaprint;
              compr_prestacionServ(data).then(() => {
                console.log("Impresion terminada");
              });
              break;
            case 6:
              data.fechavence = this.datos_cons.fechavence;
              data.fechaaccid = this.datos_cons.fechaaccid;
              data.imprime = sessionStorage.User.trim();
              data.dx = this.datos_cons.dx;
              data.contrato = this.contrato_select;
              data.fechaauto = this.autorizacion.fechaauto_rep;
              data.autorizacion = this.info_servicios.autorizacion;
              data.totalCitas = this.autorizacion.cant_rep;
              data.profesional = this.datos_cons.descripcion.trim();
              planillaAtencion(data, fecha).then(() => {
                console.log("Impresion terminada");
              });
              break;
          }
        }
      }
    },
    abrir_factura() {
      this.facturaDialog = true;
      this.PrFact01 = true;
    },
    open_soporte() {
      this.dialogocargue.estado = true;
    },
    async subir_pdf() {
      if (!this.form.tipodocum) {
        this.errores.tipocargue = true;
        this.send_error("Seleccione Tipo de Documento!");
      } else if (!this.form.pdf) {
        this.errores.pdf = true;
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        // this.card_estado = true;
        let session = sessionStorage.Sesion;
        let agencia = this.form.punto_fact.codigo_agc;
        let empresa = parseFloat(this.empresa[0].id_empr);
        let cargue_pdf = this.form.pdf.name;
        let consec = parseFloat(this.impresion.consecutivo.substr(3, 10));
        let id_cliente = this.datos_pr.id_cliente;
        let nro_auto = this.datos_pr.nro_auto;
        let idpaciente = this.datos_pr.idpaciente;

        let clasif = this.form.tipodocum.value;
        let consecpte = 0;
        let agcpte = 0;
        let codigo = "";
        let tipodoc = "02";
        let nombre_pdf = "";

        switch (clasif) {
          case 1:
            nombre_pdf = "IDDOC_" + idpaciente + ".pdf";
            break;
          case 2:
            nombre_pdf =
              empresa + "PRAUTO_" + id_cliente + "-" + nro_auto + ".pdf";
            break;
          case 3:
            nombre_pdf =
              empresa + "PRORDENM_" + agencia + "-" + consec + ".pdf";
            break;
          case 4:
            nombre_pdf = empresa + "PRHC_" + agencia + "-" + consec + ".pdf";
            break;
          case 9:
            nombre_pdf = empresa + "PRSERV_" + agencia + "-" + consec + ".pdf";
            break;
        }
        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("clasif", clasif);
        data.append("consecutivo", consec);
        data.append("file", this.form.pdf);
        data.append("agencia", agencia);
        data.append("codigo", codigo);
        data.append("consecpte", consecpte);
        data.append("agcpte", agcpte);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/salud.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.card_estado = false;
        this.cargue_soporte = 1;
        this.$emit("snack", {
          color: "success",
          text: "Soporte Guardado Correctamente",
          estado: true,
        });
        this.form.tipodocum = null;
        this.form.pdf = null;
      }
    },
    async downloadFile() {
      if (!this.form.tipodocum) {
        this.errores.tipocargue = true;
        this.send_error("Seleccione Tipo de Documento!");
      } else {
        let nombre_pdf = "";
        let agencia = this.form.punto_fact.codigo_agc;
        let id_cliente = this.datos_pr.id_cliente;
        let nro_auto = this.datos_pr.nro_auto;
        let idpaciente = this.datos_pr.idpaciente;
        let consec = parseFloat(this.impresion.consecutivo.substr(3, 10));

        let clasif = this.form.tipodocum.value;
        let empresa = parseFloat(this.empresa[0].id_empr);

        switch (clasif) {
          case 1:
            nombre_pdf = "IDDOC_" + idpaciente + ".pdf";
            break;
          case 2:
            nombre_pdf =
              empresa + "PRAUTO_" + id_cliente + "-" + nro_auto + ".pdf";
            break;
          case 3:
            nombre_pdf =
              empresa + "PRORDENM_" + agencia + "-" + consec + ".pdf";
            break;
          case 4:
            nombre_pdf = empresa + "PRHC_" + agencia + "-" + consec + ".pdf";
            break;
        }

        const url =
          "https://storage.googleapis.com/documentos_titan/SALUD/" + nombre_pdf;

        window.open(url, "_blank").focus();
      }
    },
    get_consultorios() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfConsultJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.consultorios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consultorios",
            estado: true,
          });
        });
    },
    get_profesional() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.profesional = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Profesionales",
            estado: true,
          });
        });
    },
    imprimirPDF(firma) {
      let data = {};
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      data.firma = firma;

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;

        consent_infor(data).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    format_fecha() {
      let fecha = this.form.nacimiento || "";
      let format = fecha ? fecha.split("-").reverse().join("-") : null;
      this.format_fecha_nacimiento = format;
      this.calcularEdadpac();
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_profesional: function (val) {
      return `${val.descripcion}`;
    },
    clear() {
      var _this = this;
      _this.$refs.signature.clear();
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    select_cita() {
      this.info_servicios.consultorio = null;
      let index = this.info_servicios.cita.length - 1;
      let consultorio = this.info_servicios.cita[index].consultorio;

      let busqueda = this.consultorios.find(
        (el) => el.codigo_rep == consultorio
      );
      this.info_servicios.consultorio = busqueda;
    },
    calcularEdadpac() {
      let fecha_nac = this.$moment(this.form.nacimiento).format("YYYY-MM-DD");
      // let hoy = this.$moment().format("YYYY-MM-DD");
      let dias = this.$moment().diff(fecha_nac, "days");
      let edad = null;

      if (dias < 30) {
        edad = dias + " - " + "dias";
      } else {
        if (dias < 365) {
          edad = this.$moment().diff(fecha_nac, "months") + " - meses";
        } else {
          edad = this.$moment().diff(fecha_nac, "years") + " - años";
        }
      }

      this.form.edad = edad;
    },
    cargarEps: function () {
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k, v) => {
            this.eps.push({
              value: k.codigo,
              text: k.nombre,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
        });
    },
    crear_paciente() {
      this.dialogopac.estado = true;
      this.form.departamento = this.pacientes.ciudad.substring(0, 2);
      this.get_municipios();
      this.form.idpaciente = this.info_servicios.paciente.trim();
      this.form.primerApellido = this.pacientes.primerApellido.trim();
      this.form.segundoApellido = this.pacientes.segundoApellido.trim();
      this.form.nombres = this.pacientes.nombres.trim();
      this.form.nombre2 = this.pacientes.nombre2.trim();
      this.form.correo = this.pacientes.correo.trim();
      this.form.telefono = this.pacientes.telefono.trim();
      this.form.direccion = this.pacientes.direccion.trim();
      let busqueda_tipo = this.tipoid.find(
        (el) => el.value == this.pacientes.tipoid.trim()
      );
      this.form.tipoid = busqueda_tipo;
      this.form.ciudad = this.pacientes.ciudad.trim() || null;
      this.form.nacimiento = this.$moment(this.pacientes.nacimiento).format(
        "YYYY-MM-DD"
      );
      this.form.estadoCivil = { value: parseInt(this.pacientes.estadoCivil) };
      this.form.regimen = { value: parseInt(this.pacientes.regimen) };
      this.form.eps = this.pacientes.eps;
      this.form.genero = { value: parseInt(this.pacientes.genero) };
      this.form.zona = { value: parseInt(this.pacientes.zona) };
      this.form.nivel = { value: parseInt(this.pacientes.nivel) };
      this.form.tipousuario = { value: parseInt(this.pacientes.tipousuario) };
      this.calcularEdadpac();
    },
    get_municipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
    },
    abrir_qr() {
      this.qr.estado = true;
      this.qr.codigo = null;
      setTimeout(() => {
        this.$refs.codigo_qr.focus();
      }, 200);
    },
    leer_qr() {
      var codigo = this.qr.codigo;
      var format = codigo.substr(1);
      format = format.substr(0, format.length - 1);

      var json = JSON.parse(`{${format}}`);
      var valor = json.Ubicacion + json.Autorizacion.padStart(8, "0");
      this.info_servicios.autorizacion = valor;
      this.qr.estado = false;
    },
    registrar_turno() {
      var paciente = this.info_servicios.paciente;
      var citas = this.info_servicios.cita;
      var consecutivo = this.impresion.consecutivo;

      var nit_paciente = parseInt(paciente);
      var descripcion = this.info_servicios.descripaciente.trim();

      var sede = consecutivo.substr(0, 2);
      var batch = fb.db.batch();
      citas.forEach((el) => {
        let obj = {
          nit_paciente,
          nombre_paciente: descripcion,
          empresa: parseInt(sessionStorage.Sesion.substr(0, 15)),
          fecha_registro: new Date().toLocaleString(),
          fecha_factura: new Date()
            .toLocaleString()
            .split(" ")[0]
            .replace(/,/g, ""),
          sede,
          consecutivo,
          cita_id: el.identificacion,
          cita_fecha: el.fecha,
          cita_hora: el.id_hora,
          estado: 0,
        };

        var docRef = fb.$turnos.doc();
        batch.set(docRef, obj);
      });

      batch
        .commit()
        .then((data) => {
          console.log("Turno agendado correctamente", data);
        })
        .catch((err) => {
          console.error(err);
          this.alerta_error("Ha ocurrido un error registrando el turno");
        });
    },
    buscar_paciente() {
      this.impresion.disabled = true;
      this.disabled.soportes = true;
      this.info_servicios.copago = 0;
      this.info_servicios.cuotaModeradora = 0;
      this.info_servicios.descto = 0;
      this.info_servicios.pago = 0;
      this.disabled.btn_consent = true;
      let $this = this;
      this.info_servicios.descripaciente = null;
      let paciente = this.info_servicios.paciente.trim();

      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data[0];
          this.info_servicios.descripaciente =
            $this.pacientes.descrip_rep.trim();
          this.disabled.btn_consent = false;
          let autorizacion = this.info_servicios.autorizacion;
          let eps = $this.pacientes.eps.trim();
          if (eps == "") {
            this.send_error("Paciente sin Eps Asignada!");
          } else {
            this.get_citas();
            if (this.contrato_select.particular == "1") {
              if (this.empresa[0].id_empr == "000000900108793") {
                this.get_autoriza();
              } else {
                this.info_servicios.autorizacion = "0";
              }
            } else {
              this.get_autoriza();
            }
            this.info_servicios.regimen = null;
          }

          // this.change_regimen();
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
    get_contratos() {
      var $this = this;
      post
        .postData({
          url: "Clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          $this.contratos = data;
          $this.load.contratos = false;
          //this.get_consecutivo();
        })
        .catch((err) => {
          $this.load.contratos = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    get_consecutivo() {
      var $this = this;
      let punto = this.form.punto_fact.codigo_agc;
      let fechaserv = this.info_servicios.fecha.replace(/\-/g, "");
      fechaserv = fechaserv.substring(0, 4);

      post
        .postData({
          url: "clinico/dlls/titCL101j.dll",
          data: sessionStorage.Sesion + "|" + punto + "|" + fechaserv + "|",
          method: "POST",
        })
        .then((data) => {
          $this.info_servicios.consecutivo = parseInt(data[0].nro);
          // $this.get_pacientes();
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo",
            estado: true,
          });
        });
    },
    get_pacientes() {
      var $this = this;
      post
        .postData({
          url: "Clinico/dlls/titCL301j.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data;
          $this.load.pacientes = false;
          $this.get_diagnosticos();
        })
        .catch((err) => {
          $this.load.pacientes = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true,
          });
        });
    },
    get_servicios() {
      this.disabled.soportes = true;
      var $this = this;
      $this.grabar.disabled = false;
      this.get_consecutivo(), ($this.errores.contrato = false);
      if ($this.contrato_select) {
        $this.load.servicios = true;
        post
          .postData({
            url: "Clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + $this.contrato_select.nro + "|",
            method: "POST",
          })
          .then((data) => {
            $this.load.servicios = false;
            $this.servicios = data[0].servicios;
          })
          .catch((err) => {
            $this.load.servicios = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    get_fecha() {
      this.info_servicios.fecha = this.$moment().format("YYYY-MM-DD");
    },
    get_citas() {
      console.log("get_citas", this.contrato_select);
      var $this = this;
      let contrato = this.contrato_select.nro;
      if (this.info_servicios.paciente) {
        $this.load.citas = true;
        $this.citas = [];
        var id_paciente = $this.info_servicios.paciente.trim();
        let fechaserv = this.info_servicios.fecha.replace(/\-/g, "");
        let autorizacion = this.info_servicios.autorizacion;
        post
          .postData({
            url: "Clinico/dlls/titCL102JP.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              id_paciente +
              "|1|" +
              fechaserv +
              "|" +
              autorizacion +
              "|" +
              contrato +
              "|",

              // contrato +
            method: "POST",
          })
          .then((data) => {
            data.pop();
            let datos = JSON.parse(JSON.stringify(data));
            this.datos_cons = [];
            if (datos.length > 0) {
              this.datos_cons = datos[0];
            }
            $this.load.citas = false;
            $this.citas = data;
            if (this.error_auto == "Autorizacion sin Registrar") {
              $this.citas = [];
            }
            if (this.empresa[0].id_empr === "000000901026899") {
              console.log("xxxxxxxx");
            } else {
              let diagn = "";
              let autorizacion = this.info_servicios.autorizacion;
              if (autorizacion < 1000) {
                console.log("sin autorizacion");
              } else {
                console.log("xxxx", data);
                if (data.length > 0) {
                  diagn = data[0].dx.trim();

                  var busqueda_dx = this.diagnosticos.find(
                    (el) => el.codigo.trim() == diagn
                  );

                  this.info_servicios.diagnostico = busqueda_dx;
                }
              }
            }
            $this.citas.push({
              id_hora: "00:00",
              desc_servicio: "Sin Agendar",
              cod_servicio: "0",
              descrip_paciente: "Sin Agendar",
              fecha: "0",
              id_paciente: "0",
              identificacion: "0",
              nro_admon: "111",
            });
          })
          .catch((err) => {
            console.error("Error: ", err);
            $this.load.citas = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar las citas del paciente",
              estado: true,
            });
          });
      } else {
        $this.citas = [];
        $this.info_servicios.cita = [];
      }
    },
    async get_autoriza(valida) {
      return new Promise((resolve) => {
        let valida_auto = 0;
        this.error_auto = null;

        if (this.contrato_select) {
          let eps = parseFloat(this.contrato_select.identificacion);
          let autorizacion = this.info_servicios.autorizacion;
          post
            .postData({
              url: "Clinico/dlls/ClAutorizaJ.dll",
              data:
                sessionStorage.Sesion + "|" + eps + "|" + autorizacion + "|",

              method: "POST",
            })
            .then((data) => {
              let cantidad = parseFloat(data[0].cant_rep) || 0;
              if (cantidad > 0) {
                this.autorizacion = data[0];
                this.total_citas = parseFloat(data[0].cant_rep);

                if (!this.autorizacion.nroautoeps_rep.trim() == "") {
                  this.info_servicios.autorizaeps =
                    this.autorizacion.nroautoeps_rep.trim();
                }
              }

              resolve(valida_auto);
            })
            .catch((err) => {
              console.log(err);
              valida_auto = 1;
              this.error_auto = err.Mensaje[0].msg;
              this.$emit("snack", {
                color: "error",
                text: this.error_auto,
                estado: true,
              });
              resolve(valida_auto);
            });
          // return valida_auto
        } else {
          resolve(valida_auto);
        }
      });
    },
    change_regimen: function () {
      if (this.info_servicios.paciente) {
        var busqueda_regimen = this.regimen.find(
          (el) => el.value == parseInt(this.pacientes.regimen)
        );
        this.info_servicios.regimen = busqueda_regimen;
      }
    },
    get_diagnosticos() {
      var $this = this;
      post
        .postData({
          url: "datos/base/CIE10.json",
          data: sessionStorage.Sesion + "|",
          method: "GET",
        })
        .then((data) => {
          $this.diagnosticos = data.cie10;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    format_val_cita(val) {
      return val.identificacion + val.fecha + val.id_hora;
    },
    format_cita(val) {
      return (
        this.$moment(val.fecha).format("YYYY/MM/DD") +
        " " +
        val.id_hora +
        " - " +
        val.desc_servicio
      );
    },
    format_contrato(val) {
      return parseInt(val.nro.trim()) + " - " + val.detalle.trim();
    },
    format_pacientes(val) {
      return `${val.identificacion} - ${val.primerApellido} ${val.segundoApellido} ${val.nombres}`;
    },
    format_servicios(val) {
      return `${val.codigo} - ${val.descripcion}`;
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    calcularSubtotal() {
      var $this = this;
      var item = this.servicio_select;
      if (item.codigo) {
        var iva = parseFloat(item.tar_iva) || 0,
          parse_iva = iva / 100,
          valor_neto = parseFloat(item.valor.replace(/\,/g, "")) || 0,
          iva_tmp = parse_iva + 1,
          subtotal = valor_neto * iva_tmp,
          cantidad = parseFloat(item.cantidad) || 0,
          total = subtotal * cantidad;

        $this.servicio_select.total = total.toFixed(2);
        this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
          total.toFixed(2);

        var valor_iva = valor_neto * parse_iva;
        $this.servicio_select.valor_iva = valor_iva;
        $this.servicio_select.iva_total = valor_iva * cantidad;
        $this.servicio_select.sub_total = valor_neto * cantidad;
      }
    },
    change_servicio_modal(data) {
      if (data) {
        var copia = JSON.parse(JSON.stringify(data));
        this.servicio_select = copia;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          copia.valor;
        this.servicio_select.cantidad = this.servicio_select.cantidad || 1;
        this.calcularSubtotal();
      } else this.clear_form();
    },
    agregar_servicio() {
      var item = JSON.parse(JSON.stringify(this.servicio_select));
      let valor = item.valor;

      // Validar que no exista un servicio con el mismo código (ignorando espacios)
      const codigoExiste = this.tablaDetalle.data.some(
        (serv) => serv.codigo.trim() === item.codigo.trim()
      );

      if (codigoExiste) {
        this.alerta_error("El servicio ya fue agregado.");
        return; // No continúa si ya existe
      }

      if (valor != 0) {
        item.lote = "00";
        item.total = item.total.replace(/\,/g, "");
        this.tablaDetalle.data.push(item);
        this.dialogo.estado = false;
        this.clear_form();
      } else {
        if (
          this.contrato_select.particular == "1" &&
          this.empresa[0].id_empr == "000000900108793"
        ) {
          item.lote = "00";
          item.total = 0;
          this.tablaDetalle.data.push(item);
          this.dialogo.estado = false;
          this.clear_form();
        } else {
          this.alerta_error("El valor no puede ser Cero");
        }
      }
    },

    clear_formulario() {
      this.disabled.fact_copago = true;
      this.servicio_select = {};
      this.info_servicios = [];
      this.get_fecha();

      this.tablaDetalle.data = [];
      this.servicio_select = {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      };
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = 0;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value = 0;
      this.edit_index = -1;
    },
    clear_form() {
      this.servicio_select = {};
      this.servicio_select = {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      };
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = 0;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value = 0;
      this.edit_index = -1;
    },
    modificar_servicio() {
      var $this = this;
      if (this.edit_index > -1) {
        Object.assign(
          this.tablaDetalle.data[this.edit_index],
          $this.servicio_select
        );
      }

      this.dialogo.estado = false;
      this.clear_form();
    },
    edit_item(item) {
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
        item.valor;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
        parseFloat(item.total.replace(/\,/g, "")).toFixed(2);

      this.dialogo.estado = true;
      this.servicio_select = JSON.parse(JSON.stringify(item));
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    alerta_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    calcularEdad(dateString) {
      var today = new Date();
      var DOB = new Date(dateString);
      var totalMonths =
        (today.getFullYear() - DOB.getFullYear()) * 12 +
        today.getMonth() -
        DOB.getMonth();
      totalMonths += today.getDay() < DOB.getDay() ? -1 : 0;
      var years = today.getFullYear() - DOB.getFullYear();
      if (DOB.getMonth() > today.getMonth()) years = years - 1;
      else if (DOB.getMonth() === today.getMonth())
        if (DOB.getDate() > today.getDate()) years = years - 1;

      var days;
      var months;
      var a;

      if (DOB.getDate() > today.getDate()) {
        months = totalMonths % 12;
        if (months == 0) months = 11;
        var x = today.getMonth();
        switch (x) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12: {
            a = DOB.getDate() - today.getDate();
            days = 31 - a;
            break;
          }
          default: {
            a = DOB.getDate() - today.getDate();
            days = 30 - a;
            break;
          }
        }
      } else {
        days = today.getDate() - DOB.getDate();
        if (DOB.getMonth() === today.getMonth()) months = totalMonths % 12;
        else months = (totalMonths % 12) + 1;
      }

      return { años: years, meses: months, dias: days };
    },

    async grabar_servicio() {
      let empresa = this.empresa[0].id_empr;
      var $this = this;

      if (!$this.contrato_select) {
        $this.errores.contrato = true;
        $this.alerta_error("Debes seleccionar un contrato");
      } else if (!$this.form.punto_fact) {
        $this.errores.punto_fact = true;
        $this.alerta_error("Debes seleccionar una sede");
      } else if (!$this.info_servicios.paciente) {
        $this.errores.paciente = true;
        $this.alerta_error("Debes seleccionar un paciente");
      } else if (!$this.info_servicios.autorizacion) {
        $this.errores.autorizacion = true;
        $this.alerta_error("Ingresa un número de autorización");
      } else if (!$this.info_servicios.cita) {
        $this.errores.cita = true;
        $this.alerta_error("Debes seleccionar una cita");
      } else if ($this.tablaDetalle.data.length <= 0) {
        $this.alerta_error("Debes ingresar al menos un servicio en el detalle");
      } else if (!$this.info_servicios.profesional && this.dato_profesional) {
        $this.errores.profesional = true;
        $this.alerta_error("Selecciona un profesional");
      } else if (!$this.info_servicios.medio_pago) {
        $this.alerta_error("Selecciona un medio de pago");
      } else if (!$this.info_servicios.diagnostico) {
        $this.errores.diagnostico = true;
        $this.alerta_error("Selecciona un diagnostico");
      } else if (!$this.info_servicios.tipopago) {
        $this.errores.tipopago = true;
        $this.alerta_error("Selecciona un tipo de Pago");
      } else if (!$this.info_servicios.consultorio) {
        $this.errores.consultorio = true;
        $this.alerta_error("Selecciona un consultorio");
      } else if (!$this.info_servicios.acompañante) {
        $this.errores.acompañante = true;
        $this.alerta_error("Registre un acompañante");
      } else if (!$this.info_servicios.telacompañante) {
        $this.errores.telacompañante = true;
        $this.alerta_error("Registre un telefono del Acompañante");
      } else {
        if (this.contrato_select.autoriza == "1") {
          let valida = await this.get_autoriza(valida);
          if (valida == 1) {
            this.$emit("snack", {
              color: "error",
              text: "Autorización ya Facturada",
              estado: true,
            });
          } else {
            this.guardar_atencion();
          }
        } else {
          this.guardar_atencion();
        }
      }
    },

    guardar_atencion() {
      var $this = this;
      this.load.btn_enviar = true;

      var fechaserv = this.info_servicios.fecha.replace(/\-/g, "");
      let autorizaeps = this.info_servicios.autorizaeps
        ? this.info_servicios.autorizaeps
        : "";
      // var fecha_serv = this.info_servicios.fecha.replace(/\-/g, "")

      var fecha_actual = new Date(),
        mes = (fecha_actual.getMonth() + 1).toString().padStart(2, "0"),
        dia = fecha_actual.getDate().toString().padStart(2, "0"),
        año = fecha_actual.getFullYear().toString(),
        detalle = $this.tablaDetalle.data;

      // this.info_servicios.paciente.nacimiento = "19970908";
      var fecha = this.$moment($this.pacientes.nacimiento).format("YYYY/MM/DD"),
        edad = $this.calcularEdad(fecha);
      var punto = this.form.punto_fact.codigo_agc;
      let diagnostico = this.info_servicios.diagnostico.codigo;

      let copago = this.info_servicios.copago
        ? this.info_servicios.copago.replace(/\,/g, "")
        : 0;
      let cuotaModeradora = this.info_servicios.cuotaModeradora
        ? this.info_servicios.cuotaModeradora.replace(/\,/g, "")
        : 0;
      let descto = this.info_servicios.descto
        ? this.info_servicios.descto.replace(/\,/g, "")
        : 0;
      let pagototal = this.info_servicios.pago
        ? this.info_servicios.pago.replace(/\,/g, "")
        : 0;
      let acompañante = this.info_servicios.acompañante
        ? this.info_servicios.acompañante.trim()
        : "";
      let telacompañante = this.info_servicios.telacompañante
        ? this.info_servicios.telacompañante.trim()
        : 0;

      let nivel = this.info_servicios.nivel ? this.info_servicios.nivel : 1;
      let ag_consult = this.info_servicios.consultorio.agencia_rep;
      let cod_consult = this.info_servicios.consultorio.codigo_rep;
      let consultorio = ag_consult + cod_consult;
      let profesional = this.info_servicios.profesional
        ? this.info_servicios.profesional.id
        : 0;

      let regimen = this.info_servicios.regimen
        ? this.info_servicios.regimen
        : 1;
      var linea_envio =
        sessionStorage.Sesion +
        "|" +
        this.info_servicios.consecutivo +
        "|" +
        fechaserv +
        // (año + mes + dia) +
        "|" +
        this.info_servicios.paciente +
        "|" +
        this.contrato_select.identificacion +
        "|" +
        edad.años +
        "|" +
        edad.meses +
        "|" +
        edad.dias +
        "|" +
        copago +
        "|" +
        cuotaModeradora +
        "|" +
        descto +
        "|" +
        this.info_servicios.medio_pago +
        "|" +
        this.tablaDetalle.data.length +
        "|" +
        this.contrato_select.nro +
        "|" +
        (this.info_servicios.observaciones || "") +
        "|" +
        this.info_servicios.autorizacion +
        "|" +
        // this.info_servicios.cita.nro_admon +
        0 +
        "|" +
        diagnostico +
        "|" +
        nivel +
        "|" +
        // this.info_servicios.cita.identificacion +
        0 +
        "|" +
        // this.info_servicios.cita.fecha +
        0 +
        "|" +
        // this.info_servicios.cita.id_hora +
        0 +
        "|" +
        0 +
        "|" +
        0 +
        "|" +
        regimen +
        "|" +
        punto +
        "|" +
        pagototal +
        "|" +
        acompañante.replace(/\*/g, "") +
        "|" +
        telacompañante +
        "|" +
        consultorio +
        "|" +
        profesional +
        "|" +
        autorizaeps +
        "|";

      var linea_items = "";
      detalle.forEach((item) => {
        linea_items +=
          item.codigo.trim() +
          ";" +
          item.cantidad +
          ";" +
          item.sub_total.toString() +
          ";" +
          item.iva_total.toString() +
          ";" +
          item.lote +
          ";";
      });

      var tabla_agenda = "";
      this.info_servicios.cita.forEach((obj) => {
        tabla_agenda +=
          obj.identificacion + obj.fecha + obj.id_hora.replace(/\:/g, "") + ";";
      });

      linea_envio += linea_items + "|" + tabla_agenda + "|";
      $this.enviar_servicio(linea_envio);
    },

    async enviar_servicio(linea_envio) {
      var $this = this;
      this.datos_pr.idpaciente = 0;
      this.datos_pr.id_cliente = 0;
      this.datos_pr.nro_auto = 0;

      try {
        let data = await post.postData({
          url: "clinico/dlls/TITCL101S.dll",
          data: linea_envio,
          method: "POST",
        });

        this.info_servicios.autorizacion = "";
        $this.load.btn_enviar = false;
        $this.grabar.disabled = false;
        $this.impresion.disabled = false;
        $this.impresion.consecutivo = data[0].consecutivo;
        $this.impresion.ruta_pdf = data[1].rutapdf;
        $this.impresion.pref_copago = data[2].pref;
        $this.impresion.fact_copago = data[3].factura;

        $this.$emit("snack", {
          color: "success",
          text: "Registro grabado correctamente",
          estado: true,
        });

        this.datos_pr.idpaciente = this.info_servicios.paciente;
        this.datos_pr.id_cliente = this.info_servicios.paciente;
        this.datos_pr.nro_auto = this.info_servicios.autorizacion;
        this.disabled.soportes = false;
        if ($this.impresion.fact_copago > 0) {
          await this.get_json_factura();
        }

        this.clear_formulario();
      } catch (err) {
        $this.load.btn_enviar = false;
        $this.$emit("snack", {
          color: "error",
          text: err.message || err,
          estado: true,
        });
      }
    },

    calcular_abono() {
      let totalsrv = parseInt(this.tablaDetalle.totales.total);
      let tipo = this.info_servicios.tipopago;
      let nivel = this.info_servicios.nivel;
      let liquida = this.contrato_select.liqcopago;
      let valor = 0;
      if (this.total_citas < 1) {
        this.total_citas = 1;
      }

      if (tipo == 1) {
        switch (nivel) {
          case 1:
            valor = ((totalsrv * 11.5) / 100).toFixed(0);
            break;
          case 2:
            valor = ((totalsrv * 17.3) / 100).toFixed(0);
            break;
          case 3:
            valor = ((totalsrv * 23) / 100).toFixed(0);
            break;
          case 4:
            valor = 0;
            break;
        }
        valor = valor * this.total_citas;
        this.info_servicios.copago = this.formatNumero(valor);
        this.info_servicios.cuotaModeradora = 0;
        this.info_servicios.pago = 0;
      }
      if (tipo == 2) {
        switch (nivel) {
          case 1:
            valor = 4700;
            break;
          case 2:
            valor = 19200;
            break;
          case 3:
            valor = 50300;
            break;
        }
        valor = valor * this.total_citas;
        this.info_servicios.copago = 0;
        this.info_servicios.pago = 0;
        this.info_servicios.cuotaModeradora = this.formatNumero(valor);
      }
      if (tipo == 3) {
        totalsrv = totalsrv * this.total_citas;
        this.info_servicios.pago = this.formatNumero(totalsrv);
        this.info_servicios.copago = 0;
        this.info_servicios.cuotaModeradora = 0;
      }
      if (tipo == 4 || liquida == 1) {
        this.info_servicios.pago = 0;
        this.info_servicios.copago = 0;
        this.info_servicios.cuotaModeradora = 0;
      }
    },
    format_info_docs(detalle) {
      return new Promise((resolve, reject) => {
        var consecutivo = parseInt(this.info_servicios.consecutivo)
          .toString()
          .padStart(8, "0");
        var documentos = [];
        detalle.forEach((val, index) => {
          var cod = val.codigo;
          var item = (index + 1).toString().padStart(2, "0");
          var key = `01${consecutivo}${cod}${item}`;
          documentos.push({
            titulo: key,
            // plantilla: cod,
            plantilla: "87.0.0.01",
            index,
          });
        });

        var envio = {
          documentos,
          correo_auth: "contacto@titansoluciones.com",
        };

        var formData = new FormData();
        formData.append("data", JSON.stringify(envio));

        fetch("https://server1ts.net//financiero/services/docs/add_file.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    },
    imprimir() {
      var $this = this;
      var numero = $this.impresion.consecutivo,
        dato1 = numero.substring(0, 2),
        dato2 = numero.substring(2, numero.length);
      var fecha = $this.info_servicios.fecha.replace(/\-/g, "");

      // let dato2 = 2442
      // let fecha = 20240220
      // let dato1 = "01"

      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titCL101R.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            dato1 +
            "|" +
            dato2 +
            "|" +
            fecha +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          data = JSON.parse(JSON.stringify(data))[0];

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          let empresa = sessionStorage.Sesion.substr(0, 15);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            data.fecha_actual = this.$moment().format("YYYY-MM-DD HH:mm");
            if (empresa === "000000901467099") {
              let contrato = parseFloat(this.contrato_select.nro);

              if (contrato > 0) {
                prestacionServicios2(data).then(() => {
                  console.log("Impresion terminada");
                });
              } else {
                console.log("Impresion cancelada");
              }
            } else {
              prestacionServicios(data).then(() => {
                console.log("Impresion terminada");
              });
            }
          });

          // // Habilitar generar factura
          if (empresa === "000000901467099") {
            $this.disabled.generar_factura = true;
            $this.impresion.disabled = true;
          }
        })
        .catch((err) => {
          console.log(err);
          $this.load.impresion = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar JSON de impresión",
            estado: true,
          });
        });
    },

    open_consentimiento() {
      this.consent.estado = true;
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.dato_profesional = false;
          this.empresa = data;
          if (this.empresa[0].id_empr === "000000901467099") {
            this.disabled.valor = true;
          }
          if (this.empresa[0].id_empr === "000000900767863") {
            this.dato_profesional = true;
          }
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k, v) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    guardar_paciente() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Tipo Id Obligatorio!");
      } else if (!data.idpaciente) {
        this.errores.idpaciente = true;
        this.send_error("Id Paciente Obligatorio!");
      } else if (!data.primerApellido) {
        this.errores.primerApellido = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nombres) {
        this.errores.nombres = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nacimiento) {
        this.errores.nacimiento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.regimen) {
        this.errores.regimen = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.eps) {
        this.errores.eps = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.direccion) {
        this.errores.direccion = true;
        this.send_error("Dirección Obligatoria!");
      } else if (!data.tipousuario) {
        this.errores.tipousuario = true;
        this.send_error("Tipo Usuario Obligatorio!");
      } else {
        this.envio_paciente(data);
      }
    },
    envio_paciente() {
      this.dialogopac.estado = false;
      let eliminar = this.form.eliminar ? 1 : 0,
        nacimiento = this.form.nacimiento.split("-");
      nacimiento = nacimiento[0] + nacimiento[1] + nacimiento[2];
      var datos = {
        url: "Clinico/dlls/titcl301.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.form.idpaciente.trim() +
          "|" +
          this.form.nombres +
          "|" +
          this.form.primerApellido +
          "|" +
          this.form.segundoApellido +
          "|" +
          this.form.tipoid.value +
          "|" +
          this.form.direccion +
          "|" +
          this.form.telefono +
          "|" +
          this.form.correo +
          "|" +
          this.form.ciudad +
          "|" +
          this.form.nacimiento.split("-").join("") +
          "|" +
          this.form.estadoCivil.value +
          "|" +
          this.form.regimen.value +
          "|" +
          this.form.eps +
          "|" +
          this.form.genero.value +
          "|" +
          this.form.zona.value +
          "|" +
          this.form.nivel.value +
          "|" +
          "0" +
          "|" +
          "9" +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          this.form.nombre2 +
          "|" +
          "|" +
          this.form.tipousuario.value +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Paciente Guardado",
            estado: true,
          });
          this.info_servicios.paciente = this.form.idpaciente.trim();
          this.buscar_paciente();
        })
        .catch((error) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al guardar paciente",
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
    // reset_impresion() {
    //   this.contrato_select = null;
    //   this.info_servicios.consecutivo = null;
    //   this.info_servicios.autorizacion = null;
    //   this.info_servicios.paciente = null;
    //   this.info_servicios.nivel = null;
    //   this.info_servicios.regimen = null;
    //   this.info_servicios.cita = null;
    //   this.info_servicios.copago = null;
    //   this.info_servicios.cuotaModeradora = null;
    //   this.info_servicios.descuento = null;
    //   this.info_servicios.medio_pago = null;
    //   this.info_servicios.diagnostico = null;
    //   this.info_servicios.observaciones = null;
    //   this.tablaDetalle.data = [];
    // },
    format_consultorios(val) {
      return `${val.descripcion_rep}`;
    },
    generar_factura() {
      var $this = this;
      // var numero = $this.impresion.consecutivo,
      //   dato1 = numero.substring(0, 2),
      //   dato2 = numero.substring(2, numero.length);
      let numero = 35;
      let prefijo = "PRUE";

      var datos = sessionStorage.Sesion + "|" + prefijo + "|" + numero + "|";
      $this.load.generar_factura = true;
      post
        .postData({
          url: "Clinico/dlls/Titcl103F.dll",
          data: datos,
          method: "POST",
        })
        .then((data) => {
          $this.load.generar_factura = false;
          $this.disabled.generar_factura = true;
          $this.disabled.imprimir_factura = false;
          $this.datos_factura.consecutivo = data[0];
        })
        .catch((err) => {
          $this.load.generar_factura = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar la factura",
            estado: true,
          });
        });
    },
    async get_soporte() {
      let empresa = parseFloat(this.empresa[0].id_empr);
      let nro_auto = this.autorizacion.nroauto_rep.trim();
      let id_cliente = parseFloat(this.autorizacion.idcontrato_rep);
      let idFile = empresa + "PRAUTO_" + id_cliente + "_" + nro_auto + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

      const timestamp = new Date().getTime(); // Genera un timestamp único
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank"); // Abre el PDF
    },
    imprimir_fact_copago(vacio, tipo) {
      this.loader = true;
      var numero = parseFloat(this.impresion.fact_copago);
      var prefijo = this.impresion.pref_copago.trim();
      var fechaserv = this.info_servicios.fecha.replace(/\-/g, "");
      var fecha_Factura = fechaserv.substring(0, 4);
      post
        .postData({
          url: "Clinico/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|" +
            numero +
            "|" +
            fecha_Factura.substring(0, 4) +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          data = data[0];
          this.generar_pdf_2(data, tipo);
        })
        .catch((err) => {
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;
      let formato_imp = factura_titan;
      if (getBase64) return await formato_imp(data, getBase64, true);
      else formato_imp(data);
    },
    async get_json_factura() {
      var numero = parseFloat(this.impresion.fact_copago);
      var prefijo = this.impresion.pref_copago.trim();
      var fechaserv = this.info_servicios.fecha.replace(/\-/g, "");
      var fecha = fechaserv.substring(0, 4);

      let key = prefijo + "|" + numero + "|" + fecha;
      let datosEnvio = sessionStorage.Sesion + "|" + key + "|";

      this.loader = false;

      fecha = fecha.substring(0, 4);
      let urlconsulta = "Clinico/dlls/PrFactTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });
        this.loader = false;
        const resultado = await this.envio_json_titan(data[0]);
        return resultado;
      } catch (err) {
        this.dialogo_rango.loader = false;
        console.log("error", err);
        this.masivo.jsonEnvio.push({ error: true });
      }
    },
    async envio_json_titan(index) {
      this.loader = true;
      let factura = index;
      let items_fact = factura.invoice_lines.length;
      if (items_fact > 1) {
        factura.invoice_lines.pop();
      }
      factura.customer.name = factura.customer.name.trim();
      var _this = this;
      let urlEnvio = "https://server1ts.net/financiero/inc/electPos.titan.php";
      let observacion64 = window.atob(factura.Observaciones64.trim());
      if (observacion64) {
        factura.Observaciones64 = observacion64;
      }
      var formData = new FormData();
      formData.append("factura", JSON.stringify(factura));
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          console.log("error_1", error);
          this.loader = false;
        })
        .then(async (response) => {
          this.loader = false;
          let cufe = response.cufe;
          let valido =
            response.ResponseDian.Envelope.Body.SendBillSyncResponse
              .SendBillSyncResult.IsValid.string;

          let item_envio = {
            prefijo: null,
            consecutivo: null,
            fecha: null,
          };

          if (valido == "false") {
            let mensaje =
              response.ResponseDian.Envelope.Body.SendBillSyncResponse
                .SendBillSyncResult.ErrorMessage.string;
            this.send_error(mensaje);
            return;
          } else {
            item_envio.prefijo = factura.prefix;
            item_envio.consecutivo = factura.number;
            item_envio.fecha = factura.date.substring(0, 4);
            await _this.grabar_cufe(item_envio, cufe, 1);
          }
          // if (response.success == true) {
          //   item_envio.prefijo = factura.prefix;
          //   item_envio.consecutivo = factura.number;
          //   item_envio.fecha = factura.date.substring(0, 4);
          //   await _this.grabar_cufe(item_envio, cufe, 1);
          //   //            await _this.send_mail(item_envio, cufe, 1);
          // } else {
          //   let mensaje =
          //     response.ResponseDian.Envelope.Body.SendBillSyncResponse
          //       .SendBillSyncResult.ErrorMessage.string;
          //   this.send_error(mensaje);
          // }
        });
    },
    async grabar_cufe(item, cufe, tipo) {
      var prefijo = item.prefijo;
      var consecutivo = item.consecutivo;
      var fecha = item.fecha;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClPrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.item_envio = item;
          this.disabled.fact_copago = false;
          this.$emit("snack", {
            color: "success",
            text: "Factura enviada a la Dian ",
            estado: true,
          });
          this.$emit("snack", {
            color: "success",
            text: "Cufe Grabado",
            estado: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.send_error("Ha ocurrido un error grabando el CUFE");
        });
    },
    async send_mail(item_envio, tipo) {
      const $this = this;
      // this.impresion.fact_copago = item_envio.consecutivo;
      // this.impresion.pref_copago = item_envio.prefijo;

      this.impresion.fact_copago = 16;
      this.impresion.pref_copago = "FECM";

      const blob = await this.imprimir_fact_copago(this.impresion, true);
      const pdfBase64 = await this.blobToBase64(blob);
      let pdfb64 = pdfBase64.split(",")[1];
      let urlEnvio = null;
      var prefijo = item_envio.prefijo.trim();

      let numero = parseFloat(item_envio.consecutivo);
      let correo = this.form.correo
        ? this.form.correo.trim()
        : this.correodestino.trim();
      let correo2 = this.form.correo2
        ? this.form.correo2.trim()
        : "facturae@titansoluciones.net";
      let correo3 = this.form.correo3
        ? this.form.correo3.trim()
        : "facturae@titansoluciones.net";

      let token = this.empresa.tokentitan_empr;

      this.correo.unshift({
        prefix: prefijo,
        number: "" + numero + "",
        showacceptrejectbuttons: false,
        email_cc_list: [
          {
            email: correo,
          },
          {
            email: correo2,
          },
          {
            email: correo3,
          },
        ],
        base64graphicrepresentation: pdfb64,
      });

      urlEnvio = "https://server1ts.net/financiero/inc/email_fact.php";

      var formData = new FormData();
      formData.append("token", token);
      formData.append("correo", JSON.stringify(this.correo[0]));
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          this.loader = false;
          this.$emit("snack", {
            color: "orange",
            text: "Correo Envíado con éxito",
            estado: true,
          });
        })
        .catch((error) => {
          this.loader = false;
          $this.send_error(error);
        })
        .then((data) => {
          this.loader = false;
          this.loader = false;
        });
    },
    imprimir_factura() {},
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
  },
};
</script>
