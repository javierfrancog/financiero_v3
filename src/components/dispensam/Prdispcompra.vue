<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1400" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Registro Facturas de Compra</v-list-item-title
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
                              color="red accent-3"
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
                  <span>Registrar Factura</span>
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
    <v-dialog wrap v-model="dialogocontab.estado" persistent max-width="1400">
      <v-flex xs12 md12>
        <v-card class="mx-auto col-12" max-width="1400" elevation="2">
          <v-card-title>
            <v-row class="ml-2">
              <v-col class="d-flex justify-left">
                <span class="title">Registro Mercancias</span>
              </v-col>
              <v-col class="d-flex align-items-center">
                <v-btn
                  color="red accent-3 white--text"
                  @click="printfact_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-file-pdf-box</v-icon>Ver Factura
                </v-btn>
              </v-col>
              <v-col class="mt-0 d-flex justify-end" cols="4">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  :loading="btnRefresh.loader"
                  @click="get_medicamentos(), cargarTablaruts()"
                  depressed
                >
                  <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Proveedor"
                  outlined
                  v-model="form.proveed_sel"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  return-object
                  clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-title>
          <!-- <v-row sm="12">
            <v-col sm="6">
              <v-text-field
                label="Codigo de barras"
                outlined
                hide-details
                class="inputbarra"
                filled
                shaped
                clearable
                v-model="form.barras"
                @keyup.enter="verificar_codigo()"
                type="text"
              ></v-text-field>
            </v-col>
          </v-row> -->
          <v-row class="ml-2">
            <v-col class="d-flex justify-center" cols="8">
              <v-autocomplete
                :items="medicamentos"
                label="Producto x Nombre"
                clearable
                hide-details
                :item-text="format_medicamento"
                v-model="form.producto"
                return-object
                required
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex align-items-center justify-end">
              <v-btn color="green white--text" @click="add_item()" depressed>
                <v-icon size="20" left>mdi-arrow-left-bottom</v-icon>Agregar
                Producto
              </v-btn>
            </v-col>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />

          <v-card-text class="pb-0">
            <v-form ref="formComprobante">
              <v-row justify="center">
                <div class="pa-0 px-8">
                  <v-card-text class="px-0 pa-0">
                    <v-data-table
                      :headers="headersfact"
                      :items="contenidofact"
                      :loading="contenidofact.length > 0 ? false : true"
                      item-key="id"
                    >
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
                      </template>

                      <template v-slot:item.cum="props">
                        <v-edit-dialog :return-value.sync="props.item.cum">
                          {{ props.item.cum }}
                          <template v-slot:input>
                            <v-text-field
                              v-model="props.item.cum"
                              label="Editar CUM"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                        <hr color="red" />
                      </template>
                      <template v-slot:item.lote="props">
                        <v-edit-dialog :return-value.sync="props.item.lote">
                          {{ props.item.lote }}
                          <template v-slot:input>
                            <v-text-field
                              v-model="props.item.lote"
                              label="Editar lote"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                        <hr color="red" />
                      </template>
                      <template v-slot:item.fechaVenc="props">
                        <v-edit-dialog
                          :return-value.sync="props.item.fechaVenc"
                        >
                          {{ props.item.fechaVenc }}
                          <template v-slot:input>
                            <v-text-field
                              v-model="props.item.fechaVenc"
                              label="Editar Vence"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                        <hr color="red" />
                      </template>
                      <template v-slot:item.cantidad="props">
                        <v-edit-dialog :return-value.sync="props.item.cantidad">
                          {{ props.item.cantidad }}
                          <template v-slot:input>
                            <v-text-field
                              v-model="props.item.cantidad"
                              label="Editar Cantidad"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                        <hr color="red" />
                      </template>
                      <template v-slot:item.vlrTotal="props">
                        <v-edit-dialog :return-value.sync="props.item.vlrTotal">
                          {{ props.item.vlrTotal }}
                          <template v-slot:input>
                            <v-text-field
                              v-model="props.item.vlrTotal"
                              label="Editar Valor Total"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                      </template>

                      <template v-slot:item.option="{ item }">
                        <v-btn
                          @click="cargar_registroMedic(item)"
                          :color="item.repetido ? 'orange' : 'red accent-3'"
                          outlined
                          :disabled="!item.registrar"
                          class="mr-2"
                        >
                          Registrar
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </div>
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
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
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
                        v-model="form.fechafactura"
                        label="Fecha Factura"
                        append-icon="event"
                        outlined
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechafactura"
                      @change="(dialogPicker = false), getConsecutivo()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col class="d-flex" cols="3">
                  <v-menu
                    ref="menu"
                    v-model="dialogPickervence"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    required
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.vencefactura"
                        label="Vence Factura"
                        append-icon="event"
                        outlined
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.vencefactura"
                      @change="(dialogPickervence = false), getConsecutivo()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="3">
                  <v-text-field
                    label="SubTotal"
                    clearable
                    required
                    :value="formatNumero(form.subtotal)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Iva_19%"
                    clearable
                    required
                    :value="formatNumero(form.vlriva19)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Iva_5%"
                    clearable
                    required
                    v-model="form.vlriva5"
                    v-money="money"
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
                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Retefte"
                    clearable
                    required
                    v-model="form.vlrretefte"
                    v-money="money"
                    hide-details
                  ></v-text-field>
                </v-col>
                <!-- <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor ReteIca"
                    clearable
                    required
                    v-model="form.vlrrteica"
                    v-money="money"
                    hide-details
                  ></v-text-field>
                </v-col> -->
                <!-- <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Compra"
                    clearable
                    required
                    v-model="form.vlrcompra"
                    v-money="money"
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Valor Pasivo"
                    clearable
                    v-model="form.vlrpasivo"
                    v-money="money"
                    required
                    hide-details
                  ></v-text-field>
                </v-col> -->
              </v-row>
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1px', 'border-color': 'orange' }"
              />

              <v-row>
                <v-col class="d-flex" cols="12">
                  <v-textarea
                    label="Observaciones"
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
              class="ma-2 px-4 white--text"
              color="orange"
              depressed
              large
              @click="validar"
              >Validar</v-btn
            >

            <v-btn
              class="ma-2 px-4 white--text"
              color="indigo"
              depressed
              large
              @click="grabar_contabilidad"
              :disabled="!registros_validados"
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>

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
                  :items="medicamentos"
                  clearable
                  hide-details
                  v-model="medicamento"
                  :item-text="format_medicamento"
                  :error="errores.medicamento"
                  @input="errores.medicamento = false"
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
                medicamento = null;
                errores.medicamento = false;
              "
              >Cancelar</v-btn
            >
            <v-btn
              class="ml-2"
              color="green darken-1"
              depressed
              dark
              text
              @click="registrar"
              >Registrar_y</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1700" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.inputbarra fieldset
  border-width: 2px!important
  color: #ffa500
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
      pickeFechaIni: false,
      dialogPicker: false,
      dialogPickervence: false,
      fecha_ini: this.$moment().format("YYYY-MM-02"),
      // fecha_ini: this.$moment().format("2023-10-17"),
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      btnRefresh: {
        loader: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      dialogocontab: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoregistro: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      item_selecc: [],
      loader: false,
      dialog: true,
      valid: false,
      singleExpand: true,
      vlr_iva0: 0,
      vlr_iva19: 0,
      vlr_iva5: 0,
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
        // { text: "Cod_Proveedor", align: "center", value: "cod" },
        { text: "Opciones", align: "center", value: "action" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Presentación", align: "left", value: "press" },
        { text: "Cum", align: "left", value: "cum" },
        { text: "Laboratorio", align: "left", value: "laboratorio" },
        { text: "Lote", align: "left", value: "lote" },
        { text: "Vence", align: "left", value: "fechaVenc" },
        // { text: "Unid", align: "center", value: "unit" },
        { text: "Cantidad", align: "center", value: "cantidad" },
        { text: "Vlr. Unit", align: "center", value: "vlrUnit" },
        { text: "Vlr. Total", align: "center", value: "vlrTotal" },
        { text: "Opciones", value: "option", align: "center" },
        { text: "Nombre Interno", align: "center", value: "descr_med" },
        // { text: "Homologado", align: "center", value: "descr_rep" },
        // { text: "Código", align: "center", value: "codigo" },
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
        medicamento: false,
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
      form: {
        vlriva19: 0,
        vlriva5: 0,
        vlrretefte: 0,
        vlrrteica: 0,
        vlrcompra: 0,
        vlrpasivo: 0,
        producto: null,
        subtotal: 0,
        proveed_sel: null,
      },
      card_estado: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Proveedor", align: "left", value: "nombreprov_rep" },
        { text: "Factura", align: "center", value: "nrofact_rep" },
        { text: "Fecha Factura", align: "center", value: "fechafact_rep" },
        { text: "Pdf", align: "center", value: "pdffact" },
        { text: "Registrar Mercancias", value: "idcont_rep", align: "center" },

        { text: "Recibo Factura", value: "recibof", align: "center" },
        { text: "Recibo Bienes/Servicios", value: "recibob", align: "center" },
        { text: "Aceptación Factura", value: "aceptaf", align: "center" },
        { text: "Rechazo Factura", value: "rechazof", align: "center" },
        { text: "Estado Dian", value: "estadodian", align: "center" },
      ],

      medicamentos: [],
      medicamento: null,
      producto_cod: "",
    };
  },
  async created() {
    await this.get_empresa();
    this.get_medicamentos();
    await this.consultar_xml();
    this.form.pendientes = false;
    await this.get_facturas();
    this.cargarTablaruts();

    // await this.loadXMLDoc(); // Prueba, cargando el xml localmente
  },

  computed: {
    registros_validados() {
      return this.contenidofact.every((elemento) => elemento.cod_med);
    },
  },
  methods: {
    validarFecha(item) {
      // Expresión regular para validar el formato aaaa-mm-dd
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      
      if (!regex.test(item.fechaVenc)) {

        return false;
      }
      return true;
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
    format_ruts: function (val) {
      return `${val.descripcion_rut.trim()}`;
    },

    verificar_codigo() {
      var codigo = this.form.barras;
      this.dialogo.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfProductosJB.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.loader = false;

          var busqueda_codigo = this.medicamentos.find(
            (el) => el.cod_rep == data[0].codmedicam_pr
          );
          this.form.producto = busqueda_codigo;
          this.add_item();
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
    get_medicamentos() {
      this.btnRefresh.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfMedicamentoLtJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.btnRefresh.loader = false;
          this.medicamentos = [];
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              descripcion64 = window.atob(
                el.base1_pr.trim() +
                  el.base2_pr.trim() +
                  el.base3_pr.trim() +
                  el.base4_pr.trim() +
                  el.base5_pr.trim() +
                  el.base6_pr.trim() +
                  el.base7_pr.trim() +
                  el.base8_pr.trim() +
                  el.base9_pr.trim() +
                  el.base10_pr.trim()
              );
            }
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.medicamentos = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.btnRefresh.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    add_item() {
      const index = this.contenidofact.length;

      let cod_producto = this.form.producto.cod_rep.trim();
      let desc_producto = this.form.producto.descripcion_rep.trim();
      let cum = this.form.producto.cum_rep.trim();
      this.contenidofact.push({
        cantidad: 0,
        cod: cod_producto,
        cum: cum,
        descripcion: desc_producto,
        fechaVenc: this.$moment().format("YYYY-MM-DD"),
        id: index + 1,
        lote: 0,
        press: 0,
        unit: 0,
        vlrTotal: 0,
        vlrUnit: 0,
      });
    },
    get_key() {
      return Math.random().toString(36);
    },
    format_medicamento(val) {
      return `${val.descripcion_rep}`;
    },
    deleteItem: function (item) {
      const index = this.contenidofact.indexOf(item);
      this.contenidofact.splice(index, 1);
    },
    registrar() {
    console.log("1",this.contenidofact)
    console.log("2",this.medicamento)
    let cod2 = null;
      const repetido = this.contenidofact.some(
        (el) => parseFloat(el.cod_med) == parseFloat(this.medicamento.cod_rep) &&  parseFloat(el.cod) == parseFloat(this.medicamento.cod_rep)
      );

      if (this.medicamento && !repetido) {
        this.loader = true;
        const idproveedor = this.form.idproveedor.trim();
        const codproducto = this.producto_cod;
        const codmedicamento = this.medicamento.cod_rep.trim();
        const descmedicamento = this.medicamento.descripcion_rep.trim();
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
              codmedicamento +
              "|" +
              descmedicamento,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            let producto = this.contenidofact.find(
              (el) => el.cod === codproducto
            );
            producto.cod_med = codmedicamento;
            producto.registrar = false;

            this.dialogoregistro.estado = false;
            this.medicamento = null;
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
          !this.medicamento
            ? "Medicamento obligatorio!"
            : "Este Medicamento ya está!"
        );
        this.errores.medicamento = true;
      }
    },
    cargar_registroMedic(cod) {
      this.dialogoregistro.estado = true;
      this.dialogoregistro.titulo = cod.descripcion.trim();
      this.producto_cod = cod.cod;
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
        "https://server1ts.net//financiero/inc/eventos.dian.php",
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
        "https://server1ts.net//financiero/inc/eventos.dian.php",
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
      this.dialogocontab.estado = true;
      // this.loader = true;
      this.form.vlrretefte = 0;
      this.form.vlrrteica = 0;
      this.form.vlriva19 = 0;
      this.form.vlriva5 = 0;
      this.form.vlrcompra = 0;
      this.form.vlrpasivo = 0;

      this.comprobante.detalle = "";
      this.contenidofact = [];
      this.form.idproveedor = null;
      this.form.proveedor = null;
      this.factura = 0;
      this.fechafactura = null;
      this.vencefactura = null;
      this.form.subtotal = 0;
      this.form.totalfactura = 0;
      this.form.idproveedor = null;
      this.form.proveedor = null;
      this.form.factura = null;
      this.form.fechafactura = null;

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
      this.loader = false;

      if (response.type === "xml") {
        let datoxml = atob(response.content);

        await this.loadXMLDoc(datoxml);
        this.calcular_saldo(0);
      }
      this.dialogocontab.estado = true;
    },
    async loadXMLDoc(datoxml) {
      this.comprobante.detalle = "";

      let parser = new DOMParser();
      const _this = this;

      let xml = parser.parseFromString(datoxml, "application/xml"); // Este es el que trae produccion
      let tipo_xml = 0;
      // console.log("XML:", xml);

      if (xml.getElementsByTagName("cac:Attachment").length > 0) {
        this.tipo_xml_1(xml);
      } else {
        tipo_xml = 0;
        this.tipo_xml_0(xml);
      }
    },
    tipo_xml_1(xml) {
      // console.log("Tipo_1");
      const xmlproveedor = xml.getElementsByTagName("cac:SenderParty");
      let nombre_proveedor = xml
        .getElementsByTagName("cac:PartyTaxScheme")[0]
        .getElementsByTagName("cbc:RegistrationName")[0].textContent;
      this.form.proveedor = nombre_proveedor;

      let id_proveedor = xml
        .getElementsByTagName("cac:PartyTaxScheme")[0]
        .getElementsByTagName("cbc:CompanyID")[0].textContent;
      this.form.idproveedor = id_proveedor;

      var busqueda_rut = this.tablaruts.find(
        (el) => parseFloat(el.identificacion_rut) == id_proveedor
      );
      this.form.proveed_sel = busqueda_rut;

      let factura = xml.getElementsByTagName("cbc:ParentDocumentID")[0]
        .textContent;
      this.form.factura = factura;

      let fecha = xml.getElementsByTagName("cbc:IssueDate")[0].textContent;
      this.form.fechafactura = fecha;

      // console.log("Salto_1");

      let linea_productos = xml
        .getElementsByTagName("cac:Attachment")[0]
        .getElementsByTagName("cac:ExternalReference")[0]
        .getElementsByTagName("cbc:Description")[0].textContent;

      let parser = new DOMParser();
      const _this = this;

      let xml_factura = parser.parseFromString(
        linea_productos,
        "application/xml"
      );

      let vence = "";
      // console.log("Salto_2:", xml_factura);

      if (xml_factura.getElementsByTagName("cbc:DueDate").length > 0) {
        vence = xml_factura.getElementsByTagName("cbc:DueDate")[0].textContent;
      } else if (
        xml_factura.getElementsByTagName("cac:PaymentMeans").length > 0
      ) {
        vence = xml_factura
          .getElementsByTagName("cac:PaymentMeans")[0]
          .getElementsByTagName("cbc:PaymentDueDate")[0].textContent;
      } else {
        vence = xml_factura
          .getElementsByTagName("cac:PaymentMeans")[0]
          .getElementsByTagName("cbc:PaymentDueDate")[0].textContent;
      }
      this.form.vencefactura = vence;
      // console.log("Salto_3:", xml_factura);

      let subtotal = xml_factura
        .getElementsByTagName("cac:LegalMonetaryTotal")[0]
        .getElementsByTagName("cbc:LineExtensionAmount")[0].textContent;
      subtotal = parseFloat(subtotal);
      this.form.subtotal = subtotal;

      // console.log("Salto_4:", xml_factura);
      let vlr_iva = 0;
      if (xml_factura.getElementsByTagName("cac:TaxTotal").length > 0) {
        vlr_iva = xml_factura
          .getElementsByTagName("cac:TaxTotal")[0]
          .getElementsByTagName("cbc:TaxAmount")[0].textContent;
      }
      vlr_iva = parseFloat(vlr_iva);
      this.form.vlriva19 = vlr_iva;

      let g_total = subtotal + vlr_iva;
      this.form.totalfactura = g_total;

      let data = [];
      let invoiceLines = xml_factura.getElementsByTagNameNS("*", "InvoiceLine");

      // console.log("Salto_5:", invoiceLines);

      for (let i = 0; i < invoiceLines.length; i++) {
        let linea_detalle = invoiceLines[i];
        let codigo_lin = "";
        codigo_lin = linea_detalle.getElementsByTagName("cac:Item")[0];

        if (
          codigo_lin.getElementsByTagName("cac:SellersItemIdentification")
            .length > 0
        ) {
          codigo_lin = linea_detalle
            .getElementsByTagName("cac:Item")[0]
            .getElementsByTagName("cac:SellersItemIdentification")[0]
            .getElementsByTagName("cbc:ID")[0].textContent;
        }

        if (id_proveedor == 900580962) {
          codigo_lin = linea_detalle
            .getElementsByTagName("cac:Item")[0]
            .getElementsByTagName("cac:StandardItemIdentification")[0]
            .getElementsByTagName("cbc:ID")[0].textContent;
        } 

        let cantidad_lin = linea_detalle.getElementsByTagName(
          "cbc:InvoicedQuantity"
        )[0].textContent;
        cantidad_lin = parseFloat(cantidad_lin);

        let descripcion = linea_detalle
          .getElementsByTagName("cac:Item")[0]
          .getElementsByTagName("cbc:Description")[0].textContent;

        let tot_producto = linea_detalle.getElementsByTagName(
          "cbc:LineExtensionAmount"
        )[0].textContent;
        tot_producto = parseFloat(tot_producto);

        let presentacion_lin = "";
        let cum_lin = "";
        let lote_lin = "";
        let lab_lin = "";
        let vence_lin = "";
        let unitCode_lin = "";
        let vlrUnit_lin = 0;

        let note = linea_detalle.getElementsByTagName("cbc:Note").length > 0;

        if (note) {
          note = linea_detalle.getElementsByTagName("cbc:Note")[0].textContent;

          const noteArray = note.split("|");

          if (noteArray[0] == "") {
            if (id_proveedor == 900826662) {
              // console.log("linea_detalle_2:", linea_detalle.getElementsByTagName("cac:Price")[0]);
              cum_lin = linea_detalle
                .getElementsByTagName("cac:Item")[0]
                .getElementsByTagName("cac:SellersItemIdentification")[0]
                .getElementsByTagName("cbc:ID")[0].textContent;

              lote_lin = linea_detalle
                .getElementsByTagName("cac:Item")[0]
                .getElementsByTagName("cac:ItemInstance")[0]
                .getElementsByTagName("cac:LotIdentification")[0]
                .getElementsByTagName("cbc:LotNumberID")[0].textContent;

              vence_lin = linea_detalle
                .getElementsByTagName("cac:Item")[0]
                .getElementsByTagName("cac:ItemInstance")[0]
                .getElementsByTagName("cac:LotIdentification")[0]
                .getElementsByTagName("cbc:ExpiryDate")[0].textContent;

              vlrUnit_lin = linea_detalle
                .getElementsByTagName("cac:Price")[0]
                .getElementsByTagName("cbc:PriceAmount")[0].textContent;
            }
          } else if (id_proveedor == 890300466) {
            console.log("Note:", noteArray);
          } else {
            // console.log("Salto2_note:", noteArray);
            presentacion_lin = noteArray[1];
            cum_lin = noteArray[2];
            lab_lin = noteArray[3];
            lote_lin =
              linea_detalle.getElementsByTagName("cbc:LotNumberID")[0]
                .textContent;
            vence_lin =
              linea_detalle.getElementsByTagName("cbc:ExpiryDate")[0]
                .textContent;
          }
        }
        // console.log("Salto_final");

        if (codigo_lin) {
          let itemData = {
            id: i,
            cod: codigo_lin,
            descripcion: descripcion,
            press: presentacion_lin,
            cum: cum_lin,
            laboratorio: lab_lin,
            lote: lote_lin,
            fechaVenc: vence_lin,
            unit: unitCode_lin == "94" ? "UN" : "MT",
            cantidad: cantidad_lin,
            vlrUnit: vlrUnit_lin,
            vlrTotal: _this.formatNumero(tot_producto),
          };

          data.push(itemData);
        }
      }
      _this.contenidofact = data;
      // console.log("contenidofact:", _this.contenidofact);
    },

    tipo_xml_0(xml) {
      // console.log("Tipo_0");
      let linea_productos = xml
        .getElementsByTagName("cac:Attachment")[0]
        .getElementsByTagName("cac:ExternalReference")[0]
        .getElementsByTagName("cbc:Description")[0].textContent;

      let parser = new DOMParser();
      const _this = this;

      let xml_factura = parser.parseFromString(
        linea_productos,
        "application/xml"
      );

      // console.log("xml_factura:", xml_factura);

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
      _this.vlr_iva2 = parseFloat(iva2);

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
          _this.form.vlriva16 = iva0;
          break;
        case "5.00":
          _this.form.vlriva5 = iva0;
          break;
        case "19.00":
          _this.form.vlriva19 = this.vlr_iva0;
          break;
      }

      switch (tarifa1) {
        case "19.00":
          _this.form.vlriva19 = iva1;
          break;
        case "5.00":
          _this.form.vlriva5 = iva1;
          break;
      }

      switch (tarifa2) {
        case "19.00":
          _this.form.vlriva19 = iva2;
          break;
        case "5.00":
          _this.form.vlriva5 = iva2;
          break;
      }

      let subtotal = xmlParseado.getElementsByTagName("cac:LegalMonetaryTotal");
      subtotal = subtotal[0].getElementsByTagName("cbc:LineExtensionAmount");
      subtotal = subtotal[0].textContent;

      _this.form.subtotal = subtotal;

      let total_factura =
        parseFloat(subtotal) +
        parseFloat(iva0) +
        parseFloat(iva1) +
        parseFloat(iva2);
      _this.form.totalfactura = parseFloat(total_factura).toFixed(2);

      const invoiceLines = xmlParseado.getElementsByTagName("cac:InvoiceLine");

      let data = [];

      for (let i = 0; i < invoiceLines.length; i++) {
        let invoiceLine = invoiceLines[i];
        let busq_codigo = 0;
        let id = i + 1;
        let descripcion =
          invoiceLine.getElementsByTagName("cbc:Description")[0].textContent;

        let note = invoiceLine.getElementsByTagName("cbc:Note")[0].textContent;

        const noteArray = note.split("|");
        let press = noteArray[1];
        let cum = noteArray[2];
        let lote =
          invoiceLine.getElementsByTagName("cbc:LotNumberID")[0].textContent;

        let fechaVenc =
          invoiceLine.getElementsByTagName("cbc:ExpiryDate")[0].textContent;

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
          press,
          cum,
          lote,
          fechaVenc,
          unit: unitCode == "94" ? "UN" : "MT",
          cantidad: invoicedQuantity,
          vlrUnit: _this.formatNumero(priceAmount),
          vlrTotal: _this.formatNumero(lineExtensionAmount),
        };

        data.push(itemData);
      }
      _this.contenidofact = data;
    },

    async validar() {
      let idproveedor = this.form.idproveedor.trim();
      await this.validar_productos(idproveedor, this.contenidofact);
    },

    async validar_productos(proveedor, productos) {
      let pendientes = this.form.pendientes ? "1" : "0";

      const promesas = productos.map((p) =>
        post
          .postData({
            url: "Financiero/dlls//PrvalidaprodJ.dll",
            data: sessionStorage.Sesion + "|" + proveedor + "|" + p.cod + "|",
            method: "",
          })
          .then((data) => ({
            ...p,
            registrar: false,
            cod_med: data[0].cod_rep.trim(),
            descr_med: data[0].descr_rep.trim(),
            cum:  data[0].cum_rep.trim(),
          }))
          .catch((err) => {
            return { ...p, registrar: true };
          })
      );

      const productosContabilizados = await Promise.all(promesas);

      // Verificar y actualizar duplicados
      const codMedVistos = {};
      productosContabilizados.forEach((p) => {
        if (p.cod_med) {
          codMedVistos[p.cod_med] = (codMedVistos[p.cod_med] || 0) + 1;
        }
      });

      Object.keys(codMedVistos).forEach((el) => {
        if (codMedVistos[el] > 1) {
          productosContabilizados.forEach((p) => {
            if (p.cod_med === el) {
              p.registrar = true;
              p.repetido = true;
            }
          });
        }
      });

      this.contenidofact = productosContabilizados;
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        // console.log(this.contenidofact);

        this.contenidofact.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let codigo = item.cod_med;
          let cantidad = item.cantidad;
          let total = item.vlrTotal.replace(/\,/g, "");
          let unitario = item.vlrUnit ? item.vlrUnit : total / cantidad;
          let cum = item.cum;
          let lote = item.lote;
          let vence = item.fechaVenc.replace(/\-/g, "");

          if (unitario < 1) {
            unitario = total / cantidad;
          }
          tablajson[
            `DATOJ-${format_index}`
          ] = `${codigo}|${cantidad}|${unitario}|${total}|${cum}|${lote}|${vence}|`;
        });
        res(tablajson);
      });
    },

    async grabar_contabilidad() {
      let idproveedor = this.form.idproveedor.trim();
      await this.validar_productos(idproveedor, this.contenidofact);
      let tabla_productos = await this.enviar_tabla();
      let descproveedor = this.form.proveedor.trim();
      // let direccion = this.datos_proveedor.direccion_proveedor.replace(
      //   /\|/g,
      //   ""
      // );
      // let telefono = this.datos_proveedor.telefono_proveedor.replace(/\|/g, "");
      // let ciudad = this.datos_proveedor.ciudad_proveedor;
      // let correo = this.datos_proveedor.correo_proveedor;

      let direccion = "";
      let telefono = "";
      let ciudad = "";
      let correo = "";

      let cufe = this.item_selecc.cufe_rep;

      let factura = this.form.factura.trim();
      let fechafact = this.form.fechafactura.replace(/\-/g, "");
      let vencefactura = this.form.vencefactura.replace(/\-/g, "");
      let vlriva19 = this.form.vlriva19
        ? parseFloat(this.form.vlriva19.replace(/\,/g, ""))
        : 0;
      let vlriva5 = this.form.vlriva5
        ? parseFloat(this.form.vlriva5.replace(/\,/g, ""))
        : 0;
      let vlrretefte = this.form.vlrretefte
        ? parseFloat(this.form.vlrretefte.replace(/\,/g, ""))
        : 0;
      let vlrrteica = 0;

      let vlrcompra = this.form.subtotal ? parseFloat(this.form.subtotal) : 0;

      let vlrpasivo = vlrcompra + vlriva19 + vlriva5 - vlrretefte - vlrrteica;

      let detalle = this.comprobante.detalle
        ? this.comprobante.detalle.trim()
        : "";
      detalle = detalle.replace(/\"/g, "pg");
      detalle = detalle.replace(/\*/g, "x");

      // let totxml = parseFloat(this.form.totalfactura);

      // let total_fact =
      //   parseFloat(vlrcompra) + parseFloat(vlriva19) + parseFloat(vlriva5);
      // total_fact = total_fact.toFixed(2);

      // if (vlrpasivo < 1) {
      //   total_fact = 0;
      // }
      // console.log("grabar_1", this.form);

      if (!this.form.proveed_sel) {
        let msj = "Debe Seleccionar un Proveedor ";
        this.send_error(msj);
      } else {
        // if (total_fact > totxml || total_fact < totxml) {
        //   let msj =
        //     "Total diferente al facturado o Total valor Pasivo no puede ser Cero  " +
        //     total_fact;
        //   this.send_error(msj);
        // } else {
        post
          .postData({
            url: "Dispensa/dlls/PrContElectr.dll",
            data: {
              importarhtml:
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
                vlriva19 +
                "|" +
                vlriva5 +
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
                "|",
              ...tabla_productos,
            },
            json: true,
            method: "",
          })
          .then((data) => {
            //this.dialogocontab.estado = false;
            this.$emit("snack", {
              color: "success",
              text: "Factura Registrada Correctamente",
              estado: true,
            });
            this.dialogocontab.estado = false;
          })
          .catch((err) => {
            console.error(err);
            this.load.btn_enviar = false;
            // this.send_error(err);
            this.send_error("Error al contabilizar Documento");
          });
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
      let iva1 = this.form.vlriva19 ? parseFloat(this.form.vlriva19) : 0;
      let iva2 = this.form.vlriva5 ? parseFloat(this.form.vlriva5) : 0;
      let retfte = this.form.vlrretefte ? parseFloat(this.form.vlrretefte) : 0;
      let retica = this.form.vlrrteica ? parseFloat(this.form.vlrrteica) : 0;

      if (proceso > 0) {
        if (!this.form.ctaiva1) {
          (iva1 = 0), (iva0 = 0);
        }
        if (!this.form.ctaiva2) {
          iva2 = 0;
        }
      } else {
        iva1 = 0;
      }

      let tot_compra = total - iva0 - iva1;

      this.formatNumero(tot_compra);
      this.$set(this.form, "vlrcompra", tot_compra);

      let vlrpasivo = subtotal + iva0 + iva1 + iva2 - retfte - retica;
      this.formatNumero(vlrpasivo);
      this.$set(this.form, "vlrpasivo", vlrpasivo);
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
