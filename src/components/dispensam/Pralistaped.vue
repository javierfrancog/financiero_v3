<!-- ******PROCESA PEDIDOS***** -->

<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-elevator-up</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Procesar PreCargue Puntos Dispensación</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
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
                  label="Fecha Inicial"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  @input="pickeFechaIni = false"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_ini"
                @input="pickeFechaIni = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="3">
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
                  v-model="fecha_final"
                  label="Fecha Final"
                  append-icon="event"
                  outlined
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_final"
                @input="pickerFechaFinal = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn
              color="indigo"
              class="white--text px-12"
              depressed
              large
              @click="cargarcontenido"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="item.color_rep"
                  >{{ item.estado_rep }}</v-chip
                >
              </template>

              <template v-slot:item.consecutivo_rep="{ item }">
                {{ parseInt(item.consecutivo_rep) }}
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_alista(item, 'imprimir')"
                      color="#337DFF"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Precargue</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="alistar_pedido(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="parseFloat(item.idalista_rep) > 0"
                    >
                      <v-icon>mdi-barcode-scan</v-icon>
                    </v-btn>
                  </template>
                  <span>Proceso Alistamiento</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_pedido(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.pedido_rep == 0 ? true : false"
                    >
                      <v-icon>mdi-printer-pos-play</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="empacar_pedido(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="parseFloat(item.idempaca_rep) > 0"
                    >
                      <v-icon>mdi-dolly</v-icon>
                    </v-btn>
                  </template>
                  <span>Proceso Empacado</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="generar_guia(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="parseFloat(item.idguia_rep) > 0"
                    >
                      <v-icon>mdi-truck-fast-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Guia Despacho</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="recepcion_mcia(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="parseFloat(item.estadorecep_rep) == 0"
                    >
                      <v-icon>mdi-hand-coin-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Recepción Mercancía</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_alista(item, 'rotulo')"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="parseFloat(item.idrotulo_rep) < 1"
                    >
                      <v-icon>mdi-printer-pos-stop-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Reimprimir Rótulos</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="imprimir_alista(item, 'guia')"
                      color="brown"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="parseFloat(item.idguia_rep) < 2"
                    >
                      <v-icon>mdi-printer-pos-play-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Reimprimir Guia</span>
                </v-tooltip>

                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.estadoanula_rep == 1 ? true : false"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular</span>
                </v-tooltip> -->
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-elevator-up</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Alistamiento de Pedido</v-list-item-title
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
                    disabled
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
            <v-row class="mt-1">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Solicita"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_destino"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Despacha"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_orig"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="mt-1">
              <v-col class="d-flex" cols="5">
                <v-autocomplete
                  outlined
                  v-model="form.medicamento"
                  :item-text="format_medicam_alista"
                  :items="medicamentos_alista"
                  clearable
                  return-object
                  label="Medicamento"
                  @change="get_cantidad()"
                >
                </v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Saldo Actual"
                  outlined
                  v-model="form.saldo"
                  hide-details
                  type="text"
                  disabled
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Cantidad"
                  outlined
                  v-model="form.cantidad"
                  hide-details
                  @keyup.enter="add_item()"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-chip
                  color="indigo"
                  class="white--text mr-3 mt-3"
                  label
                  depressed
                  @click="ver_seleccionados(item)"
                >
                  Ver Seleccionados
                </v-chip>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="8">
                <v-text-field
                  label="Ultimo Producto en Alistamiento"
                  v-model="form.prodalista"
                  hide-details
                  type="text"
                  disabled
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Cant. Solicitada"
                  v-model="form.cantalista"
                  hide-details
                  disabled
                  @keyup.enter="add_item()"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="purple" class="white--text mr-3" label depressed>
                  Solicitado
                </v-chip>
              </v-col>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="orange" class="white--text mr-3" label depressed>
                  A despachar
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-chip>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="tablaSolicitado.headers"
                  :items="tablaSolicitado.datos"
                  item-key="index"
                  single-expand
                >
                  <template v-slot:item.botonsolic="{ item }">
                    <v-btn
                      color="green"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="get_medicamento_alista(item)"
                    >
                      <v-icon>mdi-check-circle</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:body.append>
                    <tr>
                      <td colspan="1" class="text-right">
                        <strong>Total:</strong>
                      </td>
                      <td class="text-center">
                        {{ formatNumero(total_solicitado) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-data-table
                  :headers="tablaDespacho.headers"
                  :items="tablaDespacho.datos"
                  item-key="item_rep"
                  single-expand
                >
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="red"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="borrar_item(item, 'tablaDespacho')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:body.append>
                    <tr>
                      <td colspan="4" class="text-right">
                        <strong>Total:</strong>
                      </td>
                      <td class="text-center">
                        {{ formatNumero(total_despacho) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters> </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="10">
                <v-text-field
                  label="Observacion"
                  clearable
                  type="text"
                  required
                  outlined
                  v-model="form.observacion"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaDespacho.datos"
                  @click="grabar_alistamiento()"
                  >Grabar Alistamiento</v-btn
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
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogo.estado = false"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-divider color="#FF6F00" class="mt-5"></v-divider>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoempaca.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-hand-coin-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Proceso Empacado de Mercancías</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="2">
              <v-menu
                ref="menu"
                v-model="dialogPickerempaca"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Registro"
                    outlined
                    v-model="form.fechaempaca"
                    disabled
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaempaca"
                  @input="dialogPickerempaca = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecempaca"
                hide-details
                type="text"
                :loading="load.consecempaca"
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
            <v-row class="mt-2">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia que Recibe"
                  v-model="form.punto_empaca"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  disabled
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Recibe"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_destinoempaca"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Despacha"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_origempaca"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2 justify-center">
              <v-col sm="6">
                <v-text-field
                  label="Codigo de barras_Empacado"
                  outlined
                  hide-details
                  class="inputbarra"
                  filled
                  shaped
                  clearable
                  :disabled="disabled.barra_emp"
                  v-model="form.barrasempaca"
                  @keyup.enter="verificar_codigo(1)"
                  type="text"
                ></v-text-field>
              </v-col>

              <!-- <v-col class="d-flex justify-center" cols="6">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto x Nombre"
                  clearable
                  hide-details
                  :item-text="format_medicamento"
                  v-model="form.productorecep"
                  @change="validar_recepcion()"
                  return-object
                  required
                ></v-autocomplete>
              </v-col> -->
            </v-row>

            <v-row class="ml-2 justify-center">
              <v-col class="d-flex justify-center" cols="10">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto Empacado"
                  clearable
                  hide-details
                  :item-text="format_medicamento_emp"
                  v-model="form.productoempaca"
                  @change="validar_recepcion(1)"
                  return-object
                  :disabled="disabled.produc_emp"
                  :loading="load.medicamentos"
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="indigo" class="white--text mr-3" label depressed>
                  Alistado
                </v-chip>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tablaRegistrado.headers"
                  :items="tablaRegistrado.datos"
                  item-key="item_rep"
                  single-expand
                >
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="orange" class="white--text mr-3" label depressed>
                  A Empacar
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tablaEmpacar.headers"
                  :items="tablaEmpacar.datos"
                  item-key="item_rep"
                  single-expand
                >
                  <template v-slot:item.item_rep="{ item }">
                    {{ parseInt(item.item_rep) }}
                  </template>

                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="red"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="borrar_itemempaca(item, 'tablaRecibo')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:item.tab_cantotal="props">
                    <v-edit-dialog :return-value.sync="props.item.tab_cantotal">
                      {{ props.item.tab_cantotal }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.tab_cantotal"
                          label="Cantidad Empacada"
                          @keyup.enter="validar_saldo(props.item)"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                    <hr color="orange" />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="8">
                <v-text-field
                  label="Observacion"
                  clearable
                  type="text"
                  required
                  v-model="form.observacionempaca"
                  hide-details
                ></v-text-field>
              </v-col>
              <span> </span>
              <v-col> </v-col>

              <v-col class="mb-4" cols="2">
                <v-text-field
                  label="Total Cajas"
                  clearable
                  type="number"
                  required
                  v-model="form.cajas"
                  hide-details
                  @change="errores.cajas = false"
                  :error="errores.cajas"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="disabled.grabar_emp"
                  @click="grabar_empacado()"
                  >Grabar Empacado</v-btn
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
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogoempaca.estado = false"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogorecibo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-hand-coin-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Proceso Recibo de Mercancías</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="2">
              <v-menu
                ref="menu"
                v-model="dialogPickerrecep"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Registro"
                    outlined
                    v-model="form.fecharecep"
                    disabled
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecharecep"
                  @input="dialogPickerrecep = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecrecep"
                hide-details
                type="text"
                :loading="load.consecrecep"
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="mt-2">
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Agencia que Recibe"
                  v-model="form.punto_factrecep"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  disabled
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Recibe"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_destinorecep"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ubicacion que Despacha"
                  :items="ubica"
                  outlined
                  disabled
                  persistent-hint
                  item-value="codigo_ubic"
                  v-model="form.ubica_origrecep"
                  :item-text="format_ubicacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="ml-2 justify-center">
              <v-col sm="6">
                <v-text-field
                  label="Codigo de barras_recibo"
                  outlined
                  hide-details
                  class="inputbarra"
                  filled
                  shaped
                  clearable
                  v-model="form.barrasrecep"
                  @keyup.enter="verificar_codigo(2)"
                  type="text"
                ></v-text-field>
              </v-col>
              <!-- <v-col class="d-flex" cols="3">
                <v-chip
                  color="purple"
                  class="white--text mr-4 mt-3"
                  label
                  depressed
                  @click="ver_seleccionados()"
                >
                  Ver Seleccionados
                </v-chip>
              </v-col> -->

              <!-- <v-col class="d-flex justify-center" cols="6">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto x Nombre"
                  clearable
                  hide-details
                  :item-text="format_medicamento"
                  v-model="form.productorecep"
                  @change="validar_recepcion()"
                  return-object
                  required
                ></v-autocomplete>
              </v-col> -->
            </v-row>

            <v-row class="ml-2 justify-center">
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Agrp_Molecula"
                  outlined
                  v-model="form.molecula_recibe"
                  :item-text="format_moleculas"
                  :items="items_moleculas"
                  clearable
                  item-value="cod_rep"
                  return-object
                  @change="get_medicamento_recibe"
                >
                </v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  :items="medicamentos"
                  label="Producto x Nombre"
                  clearable
                  hide-details
                  :item-text="format_medicamentorecep"
                  v-model="form.productorecep"
                  @change="validar_recepcion(3)"
                  return-object
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="indigo" class="white--text mr-3" label depressed>
                  Despachado
                </v-chip>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tablaSolicitado.headers"
                  :items="tablaSolicitado.datos"
                  item-key="item_rep"
                  single-expand
                >
                  <template v-slot:item.item_rep="{ item }">
                    {{ parseInt(item.item_rep) }}
                  </template>

                  <template v-slot:body.append>
                    <tr>
                      <td colspan="1" class="text-right">
                        <strong>Total:</strong>
                      </td>
                      <td class="text-center">
                        {{ formatNumero(total_solicitado) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex justify-center" cols="6">
                <v-chip color="orange" class="white--text mr-3" label depressed>
                  A Recibir
                  <v-icon right dark>mdi-debug-step-into</v-icon>
                </v-chip>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tablaRecibo.headers"
                  :items="tablaRecibo.datos"
                  item-key="id"
                  single-expand
                >
                  <template v-slot:item.boton="{ item }">
                    <v-btn
                      color="red"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="borrar_itemrecep(item, 'tablaRecibo')"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:body.append>
                    <tr>
                      <td colspan="4" class="text-right">
                        <strong>Total:</strong>
                      </td>
                      <td class="text-center">
                        {{ formatNumero(total_recibido) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
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
                  v-model="form.observacionrecep"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaRecibo.datos"
                  @click="grabar_recibido()"
                  >Grabar</v-btn
                >
              </v-col>
              <!-- <v-col class="pa-0 px-0" sm="3">
                <v-btn
                  color="blue darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="disabled.imprimir"
                  :loading="load.imprimir"
                  @click="get_impresion_rec"
                  >Imprimir</v-btn
                >
              </v-col> -->
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogorecibo.estado = false"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoguia.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Guia Traslado de Mercancías</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="3">
              <v-menu
                ref="menu"
                v-model="dialogPickerguia"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha de Envio"
                    outlined
                    v-model="form.fechaguia"
                    hide-details
                    disabled
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaguia"
                  @input="dialogPickerguia = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecguia"
                hide-details
                type="text"
                :loading="load.consecguia"
                disabled
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mt-3" no-gutters>
              <v-col class="mb-4" cols="3">
                <v-text-field
                  label="Cajas Cadena Frío"
                  clearable
                  type="text"
                  required
                  outlined
                  v-model="form.frioguia"
                  hide-details
                  @change="errores.frio = false"
                  :error="errores.frio"
                ></v-text-field>
              </v-col>
              <v-col class="mb-4" cols="3">
                <v-text-field
                  label="Pacas Pañales"
                  clearable
                  type="text"
                  required
                  outlined
                  v-model="form.pañalguia"
                  @change="errores.pañalguia = false"
                  :error="errores.pañalguia"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col class="mb-4" cols="3">
                <v-text-field
                  label="Paquetes"
                  clearable
                  type="text"
                  required
                  outlined
                  v-model="form.paquetesguia"
                  @change="errores.paquetesguia = false"
                  :error="errores.paquetesguia"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6">
                <v-text-field
                  label="Recibe"
                  clearable
                  type="text"
                  required
                  v-model="form.recibeguia"
                  @change="errores.recibeguia = false"
                  :error="errores.recibeguia"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="10">
                <v-text-field
                  label="Observacion"
                  clearable
                  type="text"
                  required
                  v-model="form.observacionguia"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 mr-6" sm="3">
                <v-btn
                  color="green darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  :disabled="!tablaDespacho.datos"
                  @click="grabar_guia()"
                  >Grabar Guia</v-btn
                >
              </v-col>
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogoguia.estado = false"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
            <v-divider class="mt-2 mb-5" color="#FF6F00"></v-divider>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogoseleccioando.estado"
      persistent
      max-width="1100px"
    >
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Productos Seleccionados</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-divider color="#FF6F00"></v-divider>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mt-3" no-gutters>
              <v-col>
                <v-data-table
                  :headers="tabla_marcados.headers"
                  :items="tabla_marcados.datos"
                  item-key="docinter_rep"
                  single-expand
                >
                  <template v-slot:item.btnrestaura="{ item }">
                    <v-btn
                      color="green"
                      fab
                      class="white--text mx-auto"
                      x-small
                      depressed
                      outlined
                      @click="get_restaura(item)"
                    >
                      <v-icon>mdi-check-circle</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center col-12">
              <v-col class="pa-0 px-0 ml-6" sm="3">
                <v-btn
                  color="red darken-1"
                  class="white--text"
                  block
                  large
                  depressed
                  @click="dialogoseleccioando.estado = false"
                  >Cerrar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogomotivo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Motivo Anulacion</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="10">
              <v-text-field
                hide-details
                clearable
                v-model="form.motivo"
                :error="errores.motivo"
                @input="errores.motivo = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-btn
              color="purple"
              class="white--text mr-3 px-12"
              depressed
              large
              :disabled="!form.motivo"
              @click="grabar_anular"
            >
              Guardar
            </v-btn>

            <v-btn
              color="red accent-4"
              class="white--text px-12"
              depressed
              large
              @click="dialogomotivo.estado = false"
            >
              Cerrar
            </v-btn>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="12">
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1.5px', 'border-color': 'orange' }"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogograbar.estado" max-width="600">
      <v-card>
        <v-card-title>
          <span class="title col-12"
            >Desea grabar sin completar el empacado?</span
          >
        </v-card-title>
        <v-card-text>
          <v-row class="mt-2 justify-center" dense>
            <v-btn
              color="purple"
              class="white--text mr-3 px-12"
              depressed
              large
              @click="envio_empacado(data_guardar)"
            >
              Guardar
            </v-btn>

            <v-btn
              color="red accent-4"
              class="white--text px-12"
              depressed
              large
              @click="dialogograbar.estado = false"
            >
              Cancelar
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { precargue, rotulodesp, guia, pedido } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      load: {
        btn_enviar: false,
        impresion: false,
        consecutivo: false,
        medicamentos: false,
        consecutivorecep: false,
      },
      dialogomotivo: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoguia: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogoseleccioando: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogograbar: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogorecibo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoempaca: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      pickeFechaIni: false,
      dialogPickerguia: false,
      dialogPickerrecep: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      data_guardar: [],
      styleObject: { border: "2px solid #01579B" },
      pickerFecha_reg: false,
      pickerFecha_acta: false,
      dialogPickerempaca: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      datosEmpresa: [],
      agencias: [],
      ubica: [],
      medicamentos: [],
      molecula: [],
      medicamentos_alista: [],
      dato_solicitud: [],
      items_moleculas: [],
      ruts3: [],

      tab: 0,
      total_solicitado: 0,
      total_despacho: 0,
      total_recibido: 0,
      search: null,
      item_selec: null,
      item_parcial: null,

      form: {
        molecula_alista: null,
        medicamento: null,
        productoempaca: null,
        motivo: null,
        saldo: 0,
        cantidad: 0,
        fechaempaca: null,
        consecempaca: 0,
      },
      producto: false,
      disabled: {
        barra_emp: false,
        produc_emp: false,
        grabar_emp: false,
        grabar: true,
        imprimir: true,
      },
      error: {
        ccosto: false,
      },

      tablaSolicitado: {
        headers: [
          { text: "Item", value: "item_rep", align: "center" },
          { text: "Descripción", align: "left", value: "descripcion_rep" },
          { text: "Lote", align: "left", value: "lote_rep" },
          { text: "Observacion", align: "left", value: "detalleitem_rep" },
          { text: "Cantidad", value: "cantidad_rep", align: "center" },
          { text: "Barras", value: "barras_rep", align: "center" },
          { text: "Acción", value: "botonsolic", align: "center" },

        ],
        datos: [],
      },
      tabla_marcados: {
        headers: [
          { text: "Item", value: "item_rep", align: "center" },
          { text: "Descripción", align: "left", value: "descripcion_rep" },
          { text: "Cantidad", value: "cantidad_rep", align: "center" },
          { text: "Restaurar", value: "btnrestaura", align: "center" },
        ],
        datos: [],
      },

      tablaRecibo: {
        headers: [
          { text: "Item", value: "id", align: "center" },
          { text: "Descripción", align: "left", value: "tab_medicamento" },
          { text: "Cum", align: "left", value: "tab_cum" },
          { text: "Lote", align: "left", value: "tab_lote_medicamento" },
          { text: "Vence", align: "left", value: "tab_vence" },
          { text: "Cantidad", value: "tab_cantotal", align: "center" },
          { text: "Acción", value: "botonsolic", align: "center" },
        ],
        datos: [],
      },
      tablaRegistrado: {
        headers: [
          { text: "Item", value: "item_rep", align: "center" },
          { text: "Descripción", align: "left", value: "descripcion_rep" },
          { text: "Cum", align: "left", value: "cum_rep" },
          { text: "Lote", align: "left", value: "lote_rep" },
          { text: "Vence", align: "left", value: "vence_rep" },
          { text: "Cantidad", value: "cantidad2_rep", align: "center" },
          { text: "Barras", value: "barras_rep", align: "center" },

          { text: "Acción", value: "boton", align: "center" },
        ],
        datos: [],
      },

      tablaEmpacar: {
        headers: [
          { text: "Item", value: "item_rep", align: "center" },
          { text: "Descripción", align: "left", value: "tab_medicamento" },
          { text: "Cum", align: "left", value: "tab_cum" },
          { text: "Lote", align: "left", value: "tab_lote_medicamento" },
          { text: "Vence", align: "left", value: "tab_vence" },
          { text: "Cantidad", value: "tab_cantotal", align: "center" },
          { text: "Acción", value: "boton", align: "center" },
        ],
        datos: [],
      },

      tablaDespacho: {
        headers: [
          { text: "Item", value: "item_rep", align: "center" },
          { text: "Descripción", align: "left", value: "tab_medicamento" },
          { text: "Cum", align: "left", value: "tab_cum" },
          { text: "Lote", align: "left", value: "tab_lote_medicamento" },
          { text: "Vence", align: "left", value: "tab_vence" },
          { text: "Cantidad", value: "tab_cantotal", align: "center" },
          { text: "Acción", value: "boton", align: "center" },
        ],
        datos: [],
      },

      headers: [
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Precargue", align: "center", value: "consecutivo_rep" },
        { text: "Solicita", align: "left", value: "destino_rep" },
        { text: "Despacha", align: "left", value: "origen_rep" },
        { text: "Pedido", align: "center", value: "pedido_rep" },

        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Acciones", value: "imprimir", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        recibe: false,
        cajas: false,
        funcalista: false,
        frio: false,
        pañalguia: false,
        paquetesguia: false,
        recibeguia: false,
      },
      card_estado: false,
    };
  },
  watch: {
    "tablaSolicitado.datos": function (newVal) {
      if (this.tablaSolicitado.datos) {
        const _this = this;
        _this.total_solicitado = 0;
        newVal.forEach((el) => {
          _this.total_solicitado += parseFloat(el.cantidad_rep.trim());
        });
      }
    },

    "tablaDespacho.datos": function (newVal) {
      if (this.tablaDespacho.datos) {
        const _this = this;
        _this.total_despacho = 0;
        newVal.forEach((el) => {
          _this.total_despacho += parseFloat(el.tab_cantotal);
        });
      }
    },
    // "tablaRecibo.datos": function (newVal) {
    //   if (this.tablaRecibo.datos) {
    //     const _this = this;
    //     _this.total_recibido = 0;
    //     newVal.forEach((el) => {
    //       _this.total_recibido += parseFloat(el.tab_cantotal.trim());
    //     });
    //   }
    // },
  },
  async created() {
    await this.get_empresa();
    this.get_molecula();
    // this.get_medicamentos();
    this.cargarTablaAg();
    this.cargarTablaubica();
    this.get_ruts3();
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    validar_saldo(item) {
      let ubicacion = this.form.ubica_origempaca.codigo_ubic;
      let medicamento = item.tab_codigo;
      let lote = item.tab_lote_medicamento;
      let cantidad = parseFloat(item.tab_cantotal);
      post
        .postData({
          url: "Dispensa/dlls/RpSaldoProdBJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            ubicacion +
            "|" +
            medicamento +
            "|" +
            lote +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let saldo = 0;
          saldo = parseFloat(data[0].cant_rep.trim());
          if (saldo < cantidad) {
            this.$emit("snack", {
              color: "error",
              text: "Cantidad mayor a saldo actual",
              estado: true,
            });
            this.disabled.produc_emp = true;
            this.disabled.barra_emp = true;
            this.disabled.grabar_emp = true;
          } else {
            this.disabled.produc_emp = false;
            this.disabled.barra_emp = false;
            this.disabled.grabar_emp = false;
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
          this.items_moleculas = JSON.parse(JSON.stringify(data));
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
    get_medicamento_empaca() {
      let molecula = 0;
      this.form.productorecep = null;
      let agencia = this.item_selec.agcgenera_rep;
      let fecha = this.item_selec.fecha_rep.replace(/\-/g, "");
      this.medicamentos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpSdoEmpJ.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            molecula +
            "|" +
            fecha +
            "|" +
            "0" +
            "|" +
            "1" +
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
    },
    get_medicamento_recibe() {
      let molecula = this.form.molecula_recibe.codigo_rep;
      this.form.productorecep = null;
      this.medicamentos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpMedMolecJ.DLL",
          data: sessionStorage.Sesion + "|" + molecula + "|",
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
    },
    get_medicamentos() {
      this.load.medicamentos = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.load.medicamentos = false;
          this.medicamentos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.load.medicamentos = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Medicamentos",
            estado: true,
          });
        });
    },
    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts3",
            estado: true,
          });
        });
    },
    async alistar_pedido(item) {
      this.item_selec = item;
      await this.get_alista(item);
      this.form = {
        fecha: this.$moment().format("YYYY-MM-DD"),
      };
      this.dialogo.estado = true;
      this.form.barras = 7703038065937;
      this.form.consecutivo = parseFloat(item.consecutivo_rep);
      // this.get_consecutivo();

      let busqueda = this.agencias.find(
        (el) => el.codigo_agc == item.agenciadest_rep
      );
      this.form.punto_fact = busqueda;

      busqueda = this.ubica.find(
        (el) => el.codigo_ubic == item.agenciadest_rep
      );
      this.form.ubica_destino = busqueda;

      busqueda = this.ubica.find((el) => el.codigo_ubic == item.agcgenera_rep);
      this.form.ubica_orig = busqueda;
      this.tablaDespacho.datos = [];
      this.tabla_marcados.datos = [];
      // this.get_consecutivo();
    },
    async empacar_pedido(item) {
      this.item_selec = item;
      this.get_medicamento_empaca();

      await this.get_pedido(item);
      this.form.fechaempaca = this.$moment().format("YYYY-MM-DD");
      this.form.consecempaca = item.pedido_rep;
      this.dialogoempaca.estado = true;

      let busqueda = this.agencias.find(
        (el) => el.codigo_agc == item.agenciadest_rep
      );
      this.form.punto_empaca = busqueda;

      busqueda = this.ubica.find(
        (el) => el.codigo_ubic == item.agenciadest_rep
      );
      this.form.ubica_destinoempaca = busqueda;

      busqueda = this.ubica.find((el) => el.codigo_ubic == item.agcgenera_rep);
      this.form.ubica_origempaca = busqueda;
      this.tablaEmpacar.datos = [];
    },
    async get_recibe(item) {
      this.tablaSolicitado.datos = [];
      this.tablaRecibo.datos = [];
      let consecutivo = this.item_selec.pedido_rep;

      var key = item.agcgenera_rep + "|" + consecutivo + "|" + 1 + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrPedido01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data[0].productos.pop();
          data[0].productos.forEach((el, index) => {
            data[0].productos[index].cantidad_rep = el.cantempaca_rep;
          });
          this.tablaSolicitado.datos = data[0].productos;
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al consultar el documento");
        });
    },
    async get_alista(item) {
      this.tablaSolicitado.datos = [];
      this.tablaRecibo.datos = [];

      var key = item.agcgenera_rep + "|" + item.consecutivo_rep + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrPrecargue01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data[0].productos.pop();
          this.tablaSolicitado.datos = data[0].productos;
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al consultar el documento");
        });
    },
    async verificar_codigo(tipo) {
      let codigo = "";
      if (tipo == 1) {
        codigo = this.form.barrasempaca;
      }
      if (tipo == 2) {
        codigo = this.form.barrasrecep;
      }
      this.dialogo.loader = true;
      await post
        .postData({
          url: "Dispensa/dlls/CfProductosJB.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then(async (data) => {
          this.dialogo.loader = false;
          this.form.productoempaca = null;
          let molecula = data[0].molecula_pr.trim();
          let medicamento = data[0].codigo_pr.trim();
          let cum = data[0].cum_pr.trim();
          let busqueda_barra = null;
          if (tipo == 1) {
            busqueda_barra = this.tablaRegistrado.datos.find(
              (el) => el.cum_rep.trim() == cum.trim()
            );
            if (!busqueda_barra) {
              this.$emit("snack", {
                color: "error",
                text: "Medicamento no Incluido en el Pedido!!",
                estado: true,
              });
            } else {
              this.form.productoempaca = busqueda_barra;
              this.validar_recepcion(1);
            }
          } else {
            busqueda_barra = this.tablaSolicitado.datos.find(
              (el) => el.cum_rep.trim() == cum.trim()
            );
            if (!busqueda_barra) {
              this.$emit("snack", {
                color: "error",
                text: "Medicamento no Incluido en el Pedido!!",
                estado: true,
              });
            } else {
              this.form.productorecep = busqueda_barra;
              this.validar_recepcion(2);
            }
          }
          if (tipo == 2 || tipo == 3) {
            this.form.barrasrecep = null;
            this.form.molecula_recibe = "";
            this.form.productorecep = null;
          }
          this.form.barras = "";
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al validar Barra",
            estado: true,
          });
        });
    },
    ver_seleccionados() {
      this.dialogoseleccioando.estado = true;
    },

    grabar_alistamiento: function () {
      var data = JSON.parse(JSON.stringify(this.form));

      if (this.tablaDespacho.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else {
        this.format_alistamiento(data);
      }
    },
    format_alistamiento(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = this.item_selec.agcgenera_rep;
      let origen = this.item_selec.agcgenera_rep;
      let agencia_pre = this.item_selec.agcgenera_rep;
      let solicita = this.item_selec.idelabora_rep;
      let fechasolic = this.item_selec.fechaelabora_rep;
      let horasolic = this.item_selec.horaelabora_rep;
      let consecutivo_pre = this.item_selec.consecutivo_rep;
      let destino = this.item_selec.agenciadest_rep;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let observacion = data.observacion ? data.observacion.trim() : "";

      let tablaOrigen = {};
      this.tablaDespacho.datos.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let codigo = item.tab_codigo;
        let cantidad = parseFloat(item.tab_cantotal);
        let lote = item.tab_lote_medicamento;
        let vence = item.tab_vence.replace(/\-/g, "");
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${codigo}|${cantidad}|${lote}|${vence}|`;
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
        observacion +
        "|" +
        agencia_pre +
        "|" +
        consecutivo_pre +
        "|" +
        solicita +
        "|" +
        fechasolic +
        "|" +
        horasolic +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrprocPedido.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Alistamiento Procesado Correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.disabled.imprimir = false;
          this.load.imprimir = false;
          this.tablaDespacho.datos = [];
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    grabar_recibido: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let saldo = this.total_solicitado - this.total_recibido;

      if (this.tablaRecibo.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else {
        this.format_enviorecep(data);
      }
    },
    anular_item(item) {
      this.dialogomotivo.estado = true;
      this.form.motivo = "";
      this.item_selec = item;
    },
    async grabar_anular() {
      let agencia = this.item_selec.agcgenera_rep;
      let consecutivo = this.item_selec.consecutivo_rep;
      let motivo = this.form.motivo.trim();
      this.dialogomotivo.estado = false;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        motivo +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrPrecargueX.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Procesado",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al anular Traslado");
        });
    },

    grabar_empacado: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let saldo = this.total_solicitado - this.total_recibido;

      if (this.tablaEmpacar.datos.length == 0) {
        this.send_error("Sin Datos para Grabar");
      } else if (!data.cajas) {
        this.errores.cajas = true;
        this.send_error("Debe Registrar Cantidad de Cajas!");
      } else if (this.tablaRegistrado.datos.length > 0) {
        this.send_error("Diferencia en Empacado!");
        this.dialogograbar.estado = true;
        this.data_guardar = data;
      } else {
        this.envio_empacado(data);
      }
    },
    envio_empacado(data) {
      this.dialogograbar.estado = false;
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = data.ubica_origempaca.codigo_ubic;
      let fecha = data.fechaempaca.replace(/\-/g, "");
      let consecutivo = data.consecempaca;
      let cajas = data.cajas;
      let observacion = data.observacionempaca
        ? data.observacionempaca.trim()
        : "";

      let tablaOrigen = {};
      this.tablaEmpacar.datos.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let codigo = item.tab_codigo.trim();
        let cantidad = parseFloat(item.tab_cantotal);
        let lote = item.tab_lote_medicamento.trim();
        let vence = item.tab_vence.replace(/\-/g, "");
        tablaOrigen[
          `DATOJ-${format_index}`
        ] = `${codigo}|${cantidad}|${lote}|${vence}|`;
      });

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        cajas +
        "|" +
        observacion +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrEmpacaPed.dll",
        data: { importarhtml, ...tablaOrigen },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Empacado Registrado Correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogoempaca.estado = false;
          this.cargarcontenido();
          this.tablaSolicitado.datos = [];
          this.tablaRecibo.datos = [];
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    get_consecutivo() {
      this.dialogograbar.estado = false;
      var $this = this;
      let agencia = this.item_selec.agcgenera_rep;
      if (agencia) {
        this.load.consecutivo = true;

        post
          .postData({
            url: "Dispensa/dlls/PrPedidoN.dll",
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
    grabar_guia() {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.frioguia) {
        this.errores.frio = true;
        this.send_error("Debe regstrar Cajas Cadena de frio!");
      } else if (!data.pañalguia) {
        this.errores.pañalguia = true;
        this.send_error("Debe regstrar paquetes de Pañales!");
      } else if (!data.paquetesguia) {
        this.errores.paquetesguia = true;
        this.send_error("Debe regstrar Cantidad de Paquetes!");
      } else if (!data.recibeguia) {
        this.errores.recibeguia = true;
        this.send_error("Debe regstrar quien recibe!");
      } else {
        this.format_envioguia(data);
      }
    },
    format_envioguia(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = this.item_selec.agcgenera_rep;
      let fecha = data.fechaguia.replace(/\-/g, "");
      let consecutivo = data.consecguia;
      let observacion = data.observacionguia ? data.observacionguia.trim() : "";
      let frio = data.frioguia;
      let pañalguia = data.pañalguia;
      let paquetesguia = data.paquetesguia;
      let recibeguia = data.recibeguia;

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        frio +
        "|" +
        pañalguia +
        "|" +
        paquetesguia +
        "|" +
        recibeguia +
        "|" +
        observacion +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrGuiaPed.dll",
        data: { importarhtml },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Guia Registrada Correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogoguia.estado = false;
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    format_enviorecep(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = this.item_selec.agcgenera_rep;
      let fecha = data.fecharecep.replace(/\-/g, "");
      let consecutivo = this.item_selec.pedido_rep;
      let observacion = data.observacionrecep
        ? data.observacionrecep.trim()
        : "";

      let importarhtml =
        sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        observacion +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrRecepTraslado2.dll",
        data: { importarhtml },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Recepcion Registrada Correctamente",
            estado: true,
          });
          this.cargarcontenido();
          this.card_estado = false;
          this.dialogorecibo.estado = false;
          this.disabled.imprimir = false;
          this.load.imprimir = false;
          this.tablaSolicitado.datos = [];
          this.tablaRecibo.datos = [];
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    async recepcion_mcia(item) {
      this.item_selec = item;
      await this.get_recibe(item);

      this.dialogorecibo.estado = true;
      this.form = {
        fecharecep: this.$moment().format("YYYY-MM-DD"),
      };
      this.form.consecrecep = item.consecutivo_rep;

      let busqueda = this.agencias.find(
        (el) => el.codigo_agc == item.agenciadest_rep
      );
      this.form.punto_factrecep = busqueda;

      busqueda = this.ubica.find(
        (el) => el.codigo_ubic == item.agenciadest_rep
      );
      this.form.ubica_destinorecep = busqueda;

      busqueda = this.ubica.find((el) => el.codigo_ubic == item.agcgenera_rep);
      this.form.ubica_origrecep = busqueda;
      this.tablaRecibo.datos = [];
    },
    validar_recepcion(tipo) {
      this.form.barrasempaca = "";
      let cum_enviar = "";
      let index_recep;

      if (tipo == 1) {
        cum_enviar = this.tablaRegistrado.datos.find(
          // (el) => el.cum_rep.trim() == this.form.productoempaca.cum_rep.trim()
          (el) => el.lote_rep.trim() == this.form.productoempaca.lote_rep.trim()
        );
        if (!cum_enviar) {
          this.$emit("snack", {
            color: "orange",
            text: "Medicamento No incluido en el alistamiento!",
            estado: true,
          });
        }
      } else if (tipo == 2) {
        cum_enviar = this.tablaSolicitado.datos.find(
          (el) => el.lote_rep.trim() == this.form.productorecep.lote_rep.trim()
        );
      } else if (tipo == 3) {
        cum_enviar = this.tablaSolicitado.datos.find(
          (el) => el.cum_rep.trim() == this.form.productorecep.cum_rep.trim()
        );
        if (!cum_enviar) {
          this.$emit("snack", {
            color: "orange",
            text: "Medicamento No incluido en el despacho!",
            estado: true,
          });
        } else {
          this.form.barrasrecep = "";
          this.form.molecula_recibe = "";
          this.form.productorecep = "";
          this.medicamentos = [];
        }
      }
      let busqueda = 0;
      let index_selec = 0;
      let busq_index = null;

      if (tipo == 1) {
        busq_index = this.tablaRegistrado.datos.findIndex(
          (el) => el.lote_rep.trim() === cum_enviar.lote_rep.trim()
        );
      } else {
        busq_index = this.tablaSolicitado.datos.findIndex(
          (el) => el.lote_rep.trim() === cum_enviar.lote_rep.trim()
        );
      }

      if (!cum_enviar) {
        this.$emit("snack", {
          color: "error",
          text: "Medicamento No incluido en el despacho!",
          estado: true,
        });
      } else if (tipo == 1) {
        const index = this.tablaEmpacar.datos.length;
        this.tablaEmpacar.datos.push({
          tab_codigo: cum_enviar.codigo_rep.trim(),
          tab_medicamento: cum_enviar.descripcion_rep.trim(),
          tab_lote_medicamento: cum_enviar.lote_rep.trim(),
          id: index + 1,
          tab_cantotal: cum_enviar.cantidad2_rep.trim(),
          tab_vence: cum_enviar.vence_rep,
          tab_cum: cum_enviar.cum_rep,
        });
        this.tablaRegistrado.datos.splice(busq_index, 1);

        this.$emit("snack", {
          color: "indigo",
          text: "Producto Empacado",
          estado: true,
        });
        this.form.barrasempaca = "";
        this.form.productoempaca = "";
      } else if (tipo == 2 || tipo == 3) {
        const index = this.tablaRecibo.datos.length;
        this.tablaRecibo.datos.push({
          tab_codigo: cum_enviar.codigo_rep.trim(),
          tab_medicamento: cum_enviar.descripcion_rep.trim(),
          tab_lote_medicamento: cum_enviar.lote_rep.trim(),
          id: index + 1,
          tab_cantotal: cum_enviar.cantidad_rep.trim(),
          tab_vence: cum_enviar.vence_rep,
          tab_cum: cum_enviar.cum_rep,
        });
        this.$emit("snack", {
          color: "indigo",
          text: "Producto Recibido",
          estado: true,
        });

        this.tablaSolicitado.datos.splice(busq_index, 1);
        // console.log(this.tablaSolicitado.datos)
      }
    },
    generar_guia(item) {
      this.item_selec = item;
      this.dialogoguia.estado = true;
      this.form.fechaguia = this.$moment().format("YYYY-MM-DD");
      this.form.consecguia = item.pedido_rep;
      this.form.frioguia = "";
      this.form.pañalguia = "";
      this.form.paquetesguia = "";
      this.form.recibeguia = "";
      this.form.observacionguia = "";
    },
    format_medicamentorecep(val) {
      return `${val.descripprod_rep} -Cum:${val.cum_rep}`;
    },
    format_moleculas(val) {
      return `${val.descripcion_rep.trim()}`;
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    imprimir_pedido(item, tipo) {
      var key = item.agcgenera_rep + "|" + item.pedido_rep + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrPedido01J.dll",
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

            pedido(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    get_pedido(item) {
      var key = item.agcgenera_rep + "|" + item.pedido_rep + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      this.tablaRegistrado.datos = [];
      post
        .postData({
          url: "Dispensa/dlls/PrPedido01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data[0].productos.pop();
          this.tablaRegistrado.datos = data[0].productos;
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    imprimir_alista(item, tipo) {
      let consecutivo = 0;
      let dll = null;
      if (tipo === "rotulo" || tipo === "guia") {
        consecutivo = item.pedido_rep;
        dll = "Dispensa/dlls/PrPedido01J.dll";
      }
      if (tipo === "imprimir") {
        consecutivo = item.consecutivo_rep;
        dll = "Dispensa/dlls/PrPrecargue01J.dll";
      }
      var key = item.agcgenera_rep + "|" + consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: dll,
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
            if (tipo === "imprimir") {
              precargue(data).then(() => {
                console.log("Impresión terminada");
              });
            } else if (tipo === "rotulo") {
              rotulodesp(data).then(() => {
                console.log("Impresión terminada");
              });
            } else if (tipo === "guia") {
              guia(data).then(() => {
                console.log("Impresión terminada");
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      this.contenido = [];
      let fechaini = this.fecha_ini.split("-").join("");
      let fechafin = this.fecha_final.split("-").join("");
      let agencia = this.datosEmpresa.agencia_empr;
      post
        .postData({
          url: "Dispensa/dlls/PrPrecargueJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let data_parse = JSON.parse(JSON.stringify(data));
          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Alistamientos",
            estado: true,
          });
        });
    },
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
    async get_medicamento_alista(item) {
      return new Promise((resolve, reject) => {
        this.medicamentos_alista = [];

        let molecula = item.codigo_rep.substr(0, 18);
        let ubicacion = this.form.ubica_orig.codigo_ubic;
        let fecha = this.form.fecha.replace(/\-/g, "");
        this.item_parcial = item;
        post
          .postData({
            url: "Dispensa/dlls/Rpsaldos5J.DLL",
            data:
              sessionStorage.Sesion +
              "|" +
              ubicacion +
              "|" +
              molecula.trim() +
              "|" +
              fecha +
              "|",
            method: "POST",
          })
          .then((data) => {
            data.pop();
            this.medicamentos_alista = data;
            resolve();
            this.seleccionar_item(item, 1);
          })
          .catch((err) => {
            this.loader = false;
            this.load.servicios = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Medicamentos",
              estado: true,
            });
            reject();
          });
      });
    },
    seleccionar_item(item, tipo) {
      let copia = JSON.parse(JSON.stringify(item));
      this.form.prodalista = item.descripcion_rep.trim();
      this.form.cantalista = item.cantidad_rep.trim();

      let existe = "";
      if (tipo == 1) {
        existe = this.tabla_marcados.datos.find(
          (el) => el.codigo_rep.trim() == item.codigo_rep.trim()
        );
        if (!existe) {
          this.tabla_marcados.datos.push(copia);
          const index = this.tablaSolicitado.datos.indexOf(item);
          this.tablaSolicitado.datos.splice(index, 1);
        }
      }
    },
    get_restaura(item) {
      this.form.medicamento = "";
      this.medicamentos_alista = [];
      this.form.saldo = 0;

      let copia = JSON.parse(JSON.stringify(item));
      let existe = this.tablaSolicitado.datos.find(
        (el) => el.codigo_rep.trim() == item.codigo_rep.trim()
      );
      if (!existe) {
        this.tablaSolicitado.datos.push(copia);
        const index = this.tablaSolicitado.datos.indexOf(item);
        this.tabla_marcados.datos.splice(index, 1);
      }
    },
    format_ubicacion: function (val) {
      return `${val.descrip_ubic}`;
    },
    format_medicamento(val) {
      return `${val.descripcion_rep}`;
    },
    format_medicamento_emp(val) {
      return `${val.descripprod_rep.trim()} -Lote:${val.lote_rep} -Lab:${
        val.laboratorio_rep
      }
      `;
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
    format_punto_fact: function (val) {
      return `${val.descripcion_agc}`;
    },
    async get_impresion() {
      let agencia = this.form.punto_fact.codigo_agc;
      let consecutivo = `00000${this.form.consecutivo - 1}`;
      var key = agencia + "|" + consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Dispensa/dlls/PrSolTraslado01J.dll",
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
            solicita_traslado(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir el documento");
        });
    },
    borrar_item(item) {
      const index = this.tablaDespacho.datos.indexOf(item);
      this.tablaDespacho.datos.splice(index, 1);
    },
    borrar_itemrecep(item) {
      const index = this.tablaRecibo.datos.indexOf(item);
      this.tablaRecibo.datos.splice(index, 1);
    },
    borrar_itemempaca(item) {
      const index = this.tablaEmpacar.datos.indexOf(item);
      this.tablaEmpacar.datos.splice(index, 1);
      this.disabled.produc_emp = false;
      this.disabled.barra_emp = false;
      this.disabled.grabar_emp = false;
    },
    format_medicam(val) {
      return val.descripcion.trim();
    },
    get_cantidad() {
      this.form.saldo = this.form.medicamento.cant_rep.trim();
    },
    format_medicam_alista(val) {
      return `${val.descripprod_rep.trim()}-${val.laboratorio_rep.trim()}-Lote:${val.lote_rep.trim()}-Saldo:${val.cant_rep.trim()} `;
    },
    ocultar_itemalista(item) {
      const index = this.tablaSolicitado.datos.indexOf(item);
      this.tablaSolicitado.datos(index, 1);
      row.Visible = false;
    },
    add_item() {
      const index = this.tablaDespacho.datos.length;
      let saldo = parseFloat(this.form.saldo.replace(/\,/g, ""));
      let cantidad = this.form.cantidad ? parseFloat(this.form.cantidad) : 0;
      let solicitado = parseFloat(
        this.item_parcial.cantidad_rep.replace(/\,/g, "")
      );

      if (cantidad > saldo || cantidad == 0 || cantidad > solicitado) {
        this.send_error_2("Cantidad Registrada diferente a la solicitada!");
      }

      if (cantidad > saldo || cantidad == 0) {
        this.send_error("Cantidad no puede ser cero o excede el saldo actual!");
      } else {
        if (this.form.medicamento) {
          this.tablaDespacho.datos.push({
            tab_codigo: this.form.medicamento.codprod_rep.trim(),
            tab_medicamento: this.form.medicamento.descripprod_rep.trim(),
            id: index + 1,
            tab_cantotal: cantidad,
            tab_cum: this.form.medicamento.cum_rep.trim(),
            tab_lote_medicamento: this.form.medicamento.lote_rep.trim(),
            tab_vence: this.form.medicamento.vence_rep.trim(),
          });
          this.form.medicamento = "";
          this.form.cantidad = "";
          this.form.saldo = "";
        }
      }
    },
    async get_saldo() {
      this.medicamentos_alista = [];
      let agencia = sessionStorage.Sede;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let idmolecula = this.form.molecula_alista.cod_rep;
      post
        .postData({
          url: "Dispensa/dlls/RpSaldos5J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            idmolecula +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;

          let cod_enviar = this.tablaSolicitado.datos.find(
            (el) => el.codigo_rep.trim() == this.form.molecula_alista.cod_rep
          );

          if (cod_enviar) {
            this.medicamentos_alista = data;
          } else {
            this.$emit("snack", {
              color: "error",
              text: "Medicamento no incluído en el pedido",
              estado: true,
            });
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
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    send_error_2(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "orange",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
