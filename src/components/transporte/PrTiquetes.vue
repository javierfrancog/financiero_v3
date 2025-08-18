<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-bus-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generar Tiquete</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex align-center justify-center">
                <div class="text-h5 text-uppercase mx-auto">
                  {{ punto_taquilla.texto }}
                </div>
              </v-col>

              <!-- <v-btn
                color="orange"
                class="ma-2 white--text"
                depressed
                @click="abrir_listAut()"
              >
                Listado autorizaciones
              </v-btn> -->
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-4">
          <v-card-text class="pa-0">
            <v-row class="mb-4">
              <v-col class="mb-4" cols="12" md="8">
                <v-card>
                  <!-- <v-card-title>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="text-subtitle-1"
                          >INFORMACIÓN DE TIQUETE
                        </v-list-item-title>
                      </v-list-item-content>
                      <<v-row justify="end">
                        <v-btn
                          color="blue darken-3"
                          class="ma-2 pa-3 white--text"
                          small
                          depressed
                          @click="agregar_item()"
                        >
                          Verificar QR
                          <v-icon right dark class="ml-2"
                            >mdi-camera-enhance-outline</v-icon
                          >
                        </v-btn>
                      </v-row>
                    </v-list-item>
                  </v-card-title> -->
                  <div class="pa-0 px-4">
                    <v-card-text class="px-0 pa-0">
                      <v-col class="d-flex" cols="5">
                          <v-switch
                            v-model="form.todos"
                            label="Ver todos los Cargues"
                            @change="cargarcargues()"
                          ></v-switch>
                        </v-col>

                      <v-row>
                        <v-col cols="12">
                          <v-autocomplete
                            :items="cargues"
                            label="Cargues"
                            outlined
                            :item-text="format_cargues"
                            hide-details
                            v-model="form.cargue"
                            clearable
                            @change="asignar_valores()"
                            item-value="value"
                            return-object
                            required
                            :error="errores.cargue"
                            @input="errores.cargue = false"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex align-center justify-center">
                          <v-btn
                            color="indigo"
                            class="white--text"
                            depressed
                            @click="cerrar_libro()"
                          >
                            Cerrar Libro.
                          </v-btn>
                          <v-btn
                            color="success"
                            class="ml-2 white--text"
                            depressed
                            @click="cargar_listPasajeros()"
                          >
                            Pasajeros
                          </v-btn>
                          <v-btn
                            color="orange"
                            class="ma-2 white--text"
                            depressed
                            @click="abrir_listAut()"
                          >
                            Autorizaciones
                          </v-btn>
                          <v-btn
                            color="blue-grey"
                            class="ma-2 white--text"
                            depressed
                            @click="abrir_transbordos()"
                          >
                            Transbordos
                          </v-btn>
                        </v-col>
                        <v-col cols="12">
                          <v-menu
                            v-model="pickerFecha"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="form.fecha"
                                @input="cargarcargues()"
                                label="Fecha de viaje"
                                append-icon="event"
                                hide-details
                                outlined
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              :min="form.activacion"
                              v-model="form.fecha"
                              @input="
                                pickerFecha = false;
                                cargarcargues();
                              "
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            :items="embarques"
                            label="Origen"
                            outlined
                            clearable
                            :item-text="format_embarques"
                            hide-details
                            v-model="form.origen"
                            item-value="value"
                            return-object
                            required
                            :error="errores.origen"
                            @input="desactivarErroresEmbarques('origen')"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            :items="embarques"
                            label="Destino"
                            outlined
                            clearable
                            :item-text="format_embarques"
                            hide-details
                            v-model="form.destino"
                            item-value="value"
                            return-object
                            required
                            :error="errores.destino"
                            @input="desactivarErroresEmbarques('destino')"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            :items="horarios"
                            label="Horario de ruta"
                            outlined
                            filled
                            readonly
                            :item-text="format_horarios"
                            hide-details
                            v-model="form.horario"
                            item-value="value"
                            return-object
                            required
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            :items="placas"
                            label="Vehículo"
                            outlined
                            filled
                            readonly
                            :item-text="format_placas"
                            hide-details
                            v-model="form.vehiculo"
                            item-value="value"
                            return-object
                            required
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="8">
                          <v-autocomplete
                            label="Conductor"
                            v-model="form.conductor"
                            :items="conductores"
                            :item-text="format_conductores"
                            clearable
                            outlined
                            hide-details
                            return-object
                            :error="errores.conductor"
                            @input="errores.conductor = false"
                          ></v-autocomplete>
                        </v-col>
                        <v-col class="d-flex justify-end">
                          <v-btn
                            color="indigo"
                            class="ma-2 white--text"
                            depressed
                            @click="actualiza_cargue()"
                          >
                            Actualizar Cargue
                          </v-btn>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            label="Servicio"
                            v-model="form.servicio"
                            outlined
                            hide-details
                            filled
                            readonly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="mt-4" cols="12">
                          <v-divider></v-divider>
                          <h3 class="ml-4 mt-2 text-subtitle-1">DETALLE</h3>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Valor"
                            prefix="$"
                            outlined
                            hide-details
                            clearable
                            :value="formatNumero(form.vlr)"
                            @keypress="lettersDisabled()"
                            @input="input_mask('vlr', calcular_valor)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-menu
                            ref="menu"
                            v-model="pickerHora"
                            :close-on-content-click="false"
                            :return-value.sync="form.horaemb"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="form.horaemb"
                                label="Hora embarque"
                                outlined
                                hide-details
                                append-icon="mdi-clock-outline"
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="pickerHora"
                              v-model="form.horaemb"
                              @click:minute="$refs.menu.save(form.horaemb)"
                            ></v-time-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Descuento por silla"
                            prefix="$"
                            outlined
                            hide-details
                            clearable
                            :value="formatNumero(form.descuento)"
                            @keypress="lettersDisabled()"
                            @input="input_mask('descuento', calcular_valor)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Pasajeros"
                            outlined
                            hide-details
                            clearable
                            disabled
                            :value="sillas_list.length"
                            :error="errores.pasajeros"
                            @input="errores.pasajeros = false"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="mt-4" cols="12">
                          <v-divider></v-divider>
                          <h3 class="ml-4 mt-2 text-subtitle-1">
                            Selección de sillas
                          </h3>
                        </v-col>
                        <v-col cols="12" class="d-flex justify-center">
                          <selectSillas
                            :plantilla="plantillaBus"
                            :sillas_model="sillas_model"
                            @error="send_error"
                            @modelSillas="modelSillas"
                            @deleteSilla="deleteSilla"
                            ref="selectSillas"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card>
                  <v-card-title class="pa-0">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="text-subtitle-1"
                          >INFORMACIÓN GENERAL
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card-title>
                  <div class="pa-0 px-4">
                    <v-card-text class="px-0 pa-0">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            label="Tiquete #"
                            outlined
                            hide-details
                            v-model="form.nrotiq"
                            filled
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col class="mb-4" cols="12">
                          <v-text-field
                            label="Fecha"
                            v-model="form.fechaInfo"
                            outlined
                            hide-details
                            filled
                            readonly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </div>
                </v-card>
                <v-card class="mt-8">
                  <v-card-title class="pa-0">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="text-subtitle-1"
                          >DETALLE DE PAGO
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card-title>
                  <div class="pa-0 px-4">
                    <v-card-text class="px-0 pa-0">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            label="Subtotal"
                            outlined
                            hide-details
                            filled
                            :value="formatNumero(form.subtotal)"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            label="Valor seguro"
                            outlined
                            hide-details
                            :value="formatNumero(form.seguro)"
                            filled
                            readonly
                          ></v-text-field>
                        </v-col>
                        <!-- <v-col class="mb-4" cols="12">
                          <v-text-field
                            label="Valor sub-ruta"
                            outlined
                            hide-details
                            filled
                            readonly
                          ></v-text-field>
                        </v-col> -->
                        <v-col cols="12">
                          <v-text-field
                            label="Valor a pagar"
                            outlined
                            hide-details
                            :value="formatNumero(form.total_tiq)"
                            filled
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            :items="fpago"
                            label="Forma de pago"
                            outlined
                            clearable
                            hide-details
                            v-model="form.fpago"
                            item-value="value"
                            return-object
                            required
                            :error="errores.fpago"
                            @input="errores.fpago = false"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-divider></v-divider>
                        </v-col>
                        <!-- <v-col cols="12">
                          <v-text-field
                            label="Valor recibido"
                            outlined
                            hide-details
                            clearable
                            :value="formatNumero(form.valor_recibido)"
                            @keypress="lettersDisabled()"
                            @input="input_mask('valor_recibido')"
                          ></v-text-field>
                        </v-col> -->
                        <!-- <v-col cols="12">
                          <v-text-field
                            label="Cambio"
                            outlined
                            hide-details
                            filled
                            readonly
                          ></v-text-field>
                        </v-col> -->
                        <v-col class="d-flex justify-end mb-4" cols="12">
                          <v-btn
                            color="blue darken-3"
                            class="white--text"
                            depressed
                            @click="guardar_factura()"
                          >
                            Grabar factura
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center">
            <v-col cols="4">
              <v-autocomplete
                :items="convenios"
                label="Convenio"
                outlined
                clearable
                hide-details
                v-model="form.convenio"
                item-value="value"
                return-object
                required
                :error="errores.convenio"
                @input="errores.convenio = false"
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Nro orden"
                v-model="form_aut.nroOrden"
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Cédula pasajero"
                v-model="form_aut.ccPasajero"
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                color="success"
                class="ma-2 white--text"
                depressed
                block
                large
                @click="cargarAut()"
              >
                Consultar
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            v-if="autorizaciones.length !== 0"
            class="d-flex mb-4 justify-center"
            no-gutters
          >
            <v-col class="mb-4" cols="12" md="6">
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
            :items="autorizaciones"
            item-key="nro_rep"
            :search="search"
            :loading="loaderTable"
            loading-text="Cargando autorizaciones... "
            class="elevation-1"
          >
            <template v-slot:item.nro_rep="{ item }">{{
              parseFloat(item.nro_rep)
            }}</template>
            <template v-slot:item.nombrepasajero_rep="{ item }">{{
              `${item.nombrepasajero_rep}`
            }}</template>
            <template v-slot:item.CiudadOrig="{ item }">{{
              `${item.CiudadOrig}`
            }}</template>
            <template v-slot:item.CiudadDest="{ item }">{{
              `${item.CiudadDest}`
            }}</template>
            <template v-slot:item.estado_rep="{ item }"
              >{{ item.estado_rep == "1" ? "Usado " : "Pendiente"
              }}<v-btn
                v-if="item.estado_rep !== '1'"
                color="primary"
                icon
                large
                @click="aprobarAut(item)"
              >
                <v-icon x-large>mdi-pencil-box</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            @click="
              dialogo.estado = false;
              init_formAut();
            "
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado2" persistent max-width="700px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center">
            <v-col cols="12">
              <v-text-field
                label="Observaciones"
                v-model="observaciones"
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="blue-grey lighten-4"
            depressed
            @click="
              dialogo.estado2 = false;
              observaciones = null;
            "
          >
            Cancelar
          </v-btn>
          <v-btn
            class="ma-2 white--text"
            color="blue darken-1"
            depressed
            @click="guardarAut()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado3" persistent max-width="1200px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-col class="mb-4" cols="12" md="6">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-end" cols="12" sm="4">
              <v-switch
                v-model="form.anulados"
                label="Incluir Anulados"
                @change="cargar_listPasajeros()"
              ></v-switch>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="list_pasajeros"
            item-key="nro_tiq"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.nro_tiq="{ item }"
              >{{ parseFloat(item.nro_tiq) }}
            </template>
            <template v-slot:item.ruta_tiq="{ item }"
              >{{ `${item.origen_tiq} - ${item.destino_tiq}` }}
            </template>
            <template v-slot:item.estado_tiq="{ item }"
              >{{ item.estado_tiq === "0" ? "Activo" : "Anulado" }}
            </template>
            <template v-slot:item.edit="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="blue accent-3"
                    class="mr-2"
                    icon
                    depressed
                    v-on="on"
                    @click="imprimir(item)"
                  >
                    <v-icon>print</v-icon>
                  </v-btn>
                </template>
                <span>Imprimir</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="red accent-3"
                    icon
                    depressed
                    v-on="on"
                    @click="anular(item)"
                  >
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ item.estado_tiq === "0" ? "Anular" : "Reactivar" }}
                </span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            @click="
              dialogo.estado3 = false;
              cerrar_listPasajeros();
            "
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <modalLibroViaje
      :estado="dialogo.estado4"
      :data="libroViajes"
      @newLibroViajes="updateLibroViajes"
      @newEstado="updateEstadoViajes"
      @error="send_error"
    />

    <v-dialog v-model="dialogo.estado5" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center">
            <v-col cols="12" md="4">
              <v-text-field
                label="Viaje"
                :value="form_transbordos.viaje"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                label="Vehículo"
                :value="form_transbordos.vehiculo"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Conductor"
                :value="form_transbordos.conductor"
                outlined
                hide-details
                filled
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            v-if="list_pasajeros.length !== 0"
            class="d-flex mb-4 justify-center"
            no-gutters
          >
            <v-col cols="12" md="6">
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
            :items="list_pasajeros"
            item-key="nro_tiq"
            :search="search"
            class="elevation-1"
            show-select
            v-model="form_transbordos.list_select"
          >
          </v-data-table>
          <v-row class="mt-5" no-gutters>
            <v-col cols="12">
              <span class="ml-2 text-subtitle-1 font-weight-bold">
                Información de transbordo
              </span>
            </v-col>
            <v-col cols="12" class="mt-3">
              <v-autocomplete
                :items="cargues"
                label="Viaje destino"
                outlined
                :item-text="format_cargues"
                hide-details
                v-model="form_transbordos.viajeDestino"
                :error="errorTransbordos"
                @input="errorTransbordos = false"
                clearable
                item-value="value"
                return-object
              >
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            @click="
              dialogo.estado5 = false;
              init_transbordos();
            "
          >
            Cerrar
          </v-btn>
          <v-btn
            class="ma-2 white--text"
            color="teal accent-4"
            depressed
            @click="transbordar_tiquetes()"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Transbordar tiquetes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import selectSillas from "./comp.sillas.vue";
import { tiquete_transporte } from "../../_formatos_trans.js";
import modalLibroViaje from "./componentes/modal.libro-viaje.vue";

export default {
  components: {
    FlowerSpinner,
    selectSillas,
    modalLibroViaje,
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        estado2: false,
        estado3: false,
        estado4: false,
        estado5: false,
        titulo: null,
        tipo: null,
      },
      fpago: [
        { text: "Efectivo", value: 1 },
        { text: "Yates", value: 6 },
        { text: "Convenio Brasilia", value: 9 },
        { text: "Redbus", value: 7 },
        { text: "PinBus", value: 10 },
        { text: "Gamarra", value: 11 },
        { text: "Codigo QR", value: 3 },

        { text: "Tarjeta Crédito", value: 2 },
        { text: "Reserva", value: 8 },
        // { text: "Otro", value: 4 },
      ],

      convenios: [
        { text: "Redbus", value: 7 },
        { text: "PinBus", value: 10 },
        { text: "Gamarra", value: 11 },
      ],

      punto_taquilla: [],
      pickerFecha: false,
      pickerHora: false,
      autorizacion: null,
      convenio: null,

      cargues: [],
      placas: [],
      conductores: [],
      embarques: [],
      fechas: [],
      horarios: [],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      form: {
        vlr: 0,
        descuento: 0,
        valor_recibido: 0,
      },
      errores: {},
      errorTransbordos: false,
      card_estado: false,
      input_otros_mpios: true,
      label_recaudo: "",
      plantillaBus: "plantilla8",

      headers: [],
      loaderTable: null,
      search: null,

      form_aut: {},
      autorizaciones: [],
      observaciones: null,
      list_pasajeros: [],
      libroViajes: {},
      form_transbordos: {},

      sillas_list: [],
      sillas_model: [],
      embarquesIguales: false,
    };
  },
  watch: {
    sillas_list: {
      handler(newVal) {
        this.calcular_valor();
      },
    },
    sillas_model: {
      handler(newVal) {},
    },
  },
  created() {
    let punto_taquilla = sessionStorage.llave_punto;
    let data = JSON.parse(atob(punto_taquilla));
    this.punto_taquilla.codigo = data.id;
    this.punto_taquilla.texto = data.text;
    this.punto_taquilla.turno = data.turno;

    this.form.fpago = {
      text: "Efectivo",
      value: 1,
    };
    this.form.activacion = this.$moment().format("YYYY-MM-DD");
    this.form.fecha = this.form.activacion;
    this.montar_consecutivo();
    this.cargarcargues();
    this.cargar("placas", "Transporte/dlls/PrVehiculosJ.dll", "Vehículos");
    this.cargar(
      "conductores",
      "Financiero/dlls/Cfrutsj.dll",
      "Conductores principales"
    );
    this.cargar("embarques", "/transporte/dlls/PrembarquesJ.dll", "Embarques");
    this.cargar("horarios", "/transporte/dlls/PrhorariosJ.dll", "Horarios");

    this.form.horaemb = this.$moment().format("HH:mm");
    this.form.fechaInfo = `${this.form.fecha}  ${this.form.horaemb}`;
    this.liberar_sillas();
    this.errores = {
      cargue: false,
      origen: false,
      destino: false,
      conductor: false,
      fpago: false,
      pasajeros: false,
    };
    this.loaderTable = false;
  },
  methods: {
    init_campos() {
      this.sillas_list = [];
    },
    desactivarErroresEmbarques(emb) {
      if (this.embarquesIguales) {
        this.errores.origen = false;
        this.errores.destino = false;
        this.embarquesIguales = false;
      } else this.errores[emb] = false;
    },
    validarCampo(campo, data) {
      if (!data[campo]) {
        this.errores[campo] = true;
        this.send_error("Campo Obligatorio!");
      }
    },
    async guardar_factura() {
      var data = JSON.parse(JSON.stringify(this.form));
      let camposllenos = true;
      const _this = this;
      let valor = data.total_tiq;
      let unitario = parseFloat(this.form.vlr);

      let pasajeros = this.sillas_list.length;
      pasajeros = valor / unitario;

      if (pasajeros > 3) {
        this.send_error("Error supera máximo de pasajeros por tiquete");
      } else {
        if (!this.embarquesIguales) {
          Object.keys(this.errores).forEach((el) => {
            if (el !== "pasajeros") this.validarCampo(el, data);
            else {
              if (this.sillas_list.length <= 0) {
                this.errores.pasajeros = true;
                this.send_error("Campo Obligatorio!");
              }
            }
            if (this.errores[el]) camposllenos = false;
          });
        }

        if (camposllenos) {
          if (data.origen.id_emb == data.destino.id_emb) {
            this.errores.origen = true;
            this.errores.destino = true;
            this.send_error("Origen y destino no pueden ser iguales!");
            this.embarquesIguales = true;
          } else if (valor == 0) {
            this.send_error("Valor Obligatorio!");
          } else {
            this.loader = true;
            let turno = this.punto_taquilla.turno;
            let cantidad = this.sillas_list.length;
            let descto_unit = data.descuento.toString().replace(/\,/g, "0");
            let descto = descto_unit * cantidad;

            // let descto_unit = 0;
            let pasajeros = await this.format_pasajeros();
            let agencia = this.punto_taquilla.codigo;
            let numero = data.nrotiq.trim();
            let fecha = data.fecha.replace(/\-/g, "");
            let horaemb = data.horario.horasal_hor.replace(/\:/g, "");
            let cargue = data.cargue.id_via;
            let origen = data.origen.id_emb;
            let destino = data.destino.id_emb;
            let placas = data.vehiculo.placa_veh;
            let conductor = data.conductor.identificacion_rut;
            let servicio = data.servicio;
            let total = data.subtotal;
            let seguro = data.seguro;
            let fpago = data.fpago.value;
            let convenio = this.convenio;
            post
              .postData({
                url: "/transporte/dlls/PrTiquetesW.dll",
                data: {
                  importarhtml:
                    sessionStorage.Sesion +
                    "|" +
                    agencia +
                    "|" +
                    numero +
                    "|" +
                    fecha +
                    "|" +
                    horaemb +
                    "|" +
                    placas +
                    "|" +
                    cargue +
                    "|" +
                    origen +
                    "|" +
                    destino +
                    "|" +
                    conductor +
                    "|" +
                    servicio +
                    "|" +
                    fpago +
                    "|" +
                    cantidad +
                    "|" +
                    total +
                    "|" +
                    descto +
                    "|" +
                    seguro +
                    "|" +
                    turno +
                    "|" +
                    convenio +
                    "|",
                  ...pasajeros,
                },
                json: true,
                method: "",
              })
              .then(async (data) => {
                this.loader = false;
                this.convenio = 0;
                let res = data[0];
                let agencia = res.substr(0, 4);
                let consecutivo = res.substr(4);
                this.form.fpago = {
                  text: "Efectivo",
                  value: 1,
                };

                await _this.marcar_sillas();
                await _this.get_json_dian(agencia, consecutivo);
                // _this.impresion_guardado(agencia, consecutivo, true);
              });
          }
        }
      }
    },
    async marcar_sillas() {
      let { $db } = this.fb;
      let list = JSON.parse(JSON.stringify(this.sillas_list));

      for (const el of list) {
        await $db
          .collection("tax_sillas")
          .doc(el.ref)
          .update({ type: "ocuped" });
      }

      return true;
    },
    actualiza_cargue() {
      let cargue = this.form.cargue.id_via;
      let conductor = this.form.conductor.identificacion_rut;
      post
        .postData({
          url: "/transporte/dlls/PrcarguesMV.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion + "|" + cargue + "|" + conductor + "|",
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.cargarcargues();
          this.$emit("snack", {
            color: "success",
            text: "Conductor Actualizado correctamente",
            estado: true,
          });
        });
    },
    async get_json_dian(agencia, consecutivo) {
      this.loader = true;
      this.item_mail = 1;
      let prefijo = "T001";
      let fecha = this.form.fecha.substr(0, 4);
      var key = agencia + "|" + prefijo + "|" + consecutivo + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Transporte/dlls/PrFactTitanJ.dll";
      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = null;
          var urlEnvio = null;
          let nombre64 = " ";
          let observacion64 = null;
          let textob64 = " ";
          factura = data[0];

          urlEnvio = "https://server1ts.net/financiero/inc/elect_tr.titan.php";
          let detalles = factura.invoice_lines.map((item) => {
            item.description = item.description + item.notes;

            return item;
          });
          textob64 = factura.Observaciones64.trim();

          observacion64 = window.atob(textob64);
          if (observacion64) {
            factura.Observaciones64 = observacion64;
          }

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.loader = false;
              this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              this.loader = false;
              let cufe = null;
              let valido = false;
              let errordian = null;
              let error_fecha = null;

              if (response.errors) {
                this.send_error(response.errors);
                valido = false;
              } else {
                if (!response.ResponseDian) {
                  valido = response.success;
                  errordian = response.message;
                  cufe = response.cufe;
                } else {
                  if (response.ResponseDian) {
                    cufe =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.XmlDocumentKey;

                    valido =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.IsValid;
                    errordian =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.ErrorMessage.string;
                  } else {
                    error_fecha = response.errors.date[0];
                  }
                }
              }
              if (valido === false) {
                if (
                  errordian ==
                  "Este documento ya fue enviado anteriormente, se registra en la base de datos."
                ) {
                  this.grabar_cufe(agencia, consecutivo, cufe, fecha);
                } else {
                  this.send_error("Error enviando a la Dian");
                }
              } else {
                cufe = response.cufe;
                this.grabar_cufe(agencia, consecutivo, cufe, fecha);
              }
              this.impresion_guardado(agencia, consecutivo, true);
            });
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          this.send_error(err);
        });
    },
    grabar_cufe(agencia, consecutivo, cufe, fecha) {
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        "0|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";

      post
        .postData({
          url: "Transporte/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Tiquete enviado a la Dian ",
            estado: true,
          });
          this.$emit("snack", {
            color: "success",
            text: "Tiquete enviado a la Dian",
            estado: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.send_error("Ha ocurrido un error grabando el CUFE del Tiquete.");
        });
    },
    impresion_guardado(agencia, consecutivo, reload) {
      const _this = this;
      post
        .postData({
          url: "/transporte/dlls/prtiquetesvj.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|",
          },
          json: true,
          method: "",
        })
        .then((data) => {
          data[0].pasajeros.pop();
          _this.imprimir(data[0], reload);
          this.iniciar_tiquetes();
          this.montar_consecutivo();
        });
    },
    calcular_valor() {
      let minimo = 200;
      let maximo = 500;
      let pasajeros = this.sillas_list.length;

      let valor = this.form.vlr;
      let descuento = this.form.descuento;

      let seguro = 0;
      let seguro_acum = 0;
      if (this.form.seguro) {
        seguro_acum = this.form.seguro;
      }
      let subtotal = (valor - descuento) * pasajeros;
      if (subtotal < 5001) seguro = minimo * pasajeros;
      else seguro = maximo * pasajeros;

      let total = subtotal - seguro;

      this.form.subtotal = total;
      this.form.seguro = seguro;
      this.form.total_tiq = subtotal;
    },
    format_pasajeros() {
      return new Promise((res) => {
        let pasajeros_list = this.sillas_list;
        let obj = {};
        pasajeros_list.forEach((el, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          obj[`DATOJ-${format_index}`] = `${
            el.pasajero.id.id_pas
              ? el.pasajero.id.id_pas.trim()
              : el.pasajero.id
          }|${el.silla.silla}|${el.pasajero.temperatura}|${
            el.pasajero.nombre
          }|`;
        });

        res(obj);
      });
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
    },
    async anular(item) {
      let tiquete = item.nro_tiq;
      let agencia = item.agencia_tiq;
      post
        .postData({
          url: "/transporte/dlls/PrAnulaTiq.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then(async (data) => {
          let viaje = item.nroviaje_tiq;
          let silla = item.sillas;

          let sillasArr = silla.split(",");
          for (const el of sillasArr) {
            await this.anularSilla({ silla: el, viaje });
          }

          this.$emit("snack", {
            color: "success",
            text: "Proceso correcto",
            estado: true,
          });
          this.cargar_listPasajeros();
        })
        .catch((err) => {
          console.log("Error", err);
          this.loaderTable = false;
          this.send_error("Error al anular el tiquete");
        });
    },
    async anularSilla({ silla, viaje }) {
      let { $db } = this.fb;

      let list = [];
      await $db
        .collection("tax_sillas")
        .where("viaje", "==", viaje)
        .where("silla.silla", "==", parseInt(silla))
        .get()
        .then(async (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            let data = doc.data();
            data.id = doc.id;

            list.push(data);
          });
        });

      for (let el of list) {
        await $db.collection("tax_sillas").doc(el.id).delete();
      }

      this.consultarSillas();
    },
    async deleteSilla({ ref }) {
      const _this = this;
      let { $db } = this.fb;
      let { cargue } = this.form;

      let list = [];
      await $db
        .collection("tax_sillas")
        .where("viaje", "==", cargue.id_via)
        .where("silla.ref", "==", ref)
        .where("sesion", "==", sessionStorage.Sesion)
        .get()
        .then(async (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            let data = doc.data();
            data.id = doc.id;

            list.push(data);
          });
        });

      for (let el of list) {
        await $db.collection("tax_sillas").doc(el.id).delete();
      }
      _this.consultarSillas();
    },
    async liberar_sillas() {
      let { $db } = this.fb;
      let list = [];

      await $db
        .collection("tax_sillas")
        .where("type", "==", "selected")
        .where("sesion", "==", sessionStorage.Sesion)
        .get()
        .then(async (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            let data = doc.data();
            data.id = doc.id;

            list.push(data);
          });
        });

      for (let el of list) {
        await $db.collection("tax_sillas").doc(el.id).delete();
      }

      this.sillas_list = [];
      return true;
    },
    modelSillas(data) {
      this.sillas_list = data;
      this.update_sillas();
      if (this.errores.pasajeros) this.errores.pasajeros = false;
    },
    async update_sillas() {
      let { $db } = this.fb;
      let { cargue } = this.form;
      let list = JSON.parse(JSON.stringify(this.sillas_list));

      for (const el of list) {
        let { type } = el.silla;

        if (type === "selected" && !el.id) {
          let obj = JSON.parse(JSON.stringify(el));
          let ref = await $db.collection("tax_sillas").add({
            ...obj,
            viaje: cargue.id_via,
            fecha: new Date().getTime(),
            sesion: sessionStorage.Sesion,
            type,
          });

          el.ref = ref.id;
        }
      }

      this.sillas_list = list;
    },
    abrir_listAut() {
      // this.form.estado = true;
      this.dialogo.titulo = "Listado Autorizaciones";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.init_formAut();
    },
    init_formAut() {
      this.card_estado = this.dialogo.estado ? false : true;
      this.headers = this.dialogo.estado
        ? [
            { text: "ID", align: "center", value: "nro_rep" },
            { text: "Pasajero", align: "center", value: "nombrepasajero_rep" },
            { text: "Autorización", align: "center", value: "nroautor_rep" },
            { text: "Orden", align: "center", value: "nroorden_rep" },
            { text: "Origen", align: "center", value: "CiudadOrig" },
            { text: "Destino", align: "center", value: "CiudadDest" },
            { text: "Estado", align: "center", value: "estado_rep" },
            { text: "Detalle", align: "center", value: "detalleuso_rep" },
            { text: "Acompañante", align: "center", value: "nombreacomp_rep" },
            { text: "Modificó", align: "center", value: "useruso_rep" },
          ]
        : [];
      this.form_aut = {};
      this.autorizaciones = [];
      this.loaderTable = this.dialogo.estado ? false : null;
      this.search = null;
    },
    montar_consecutivo() {
      let agencia = this.punto_taquilla.codigo;
      post
        .postData({
          url: "/transporte/dlls/PrconsecutivoJ.dll",
          data: sessionStorage.Sesion + "|" + "10" + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.form.nrotiq = data[0].nro_cons.trim();
        })
        .catch((err) => {
          this.loaderTable = false;
          this.send_error("Error al cargar consecutivos");
        });
    },
    cargarAut() {
      let data = { ...this.form_aut };
      let cedulaPasajero = data.ccPasajero || "0";
      let numeroOrden = data.nroOrden || "";
      if (!this.form.convenio) {
        this.send_error("Selecciona un convenio");
      } else {
        let convenio = this.form.convenio.value;
        this.loaderTable = true;

        post
          .postData({
            url: "/transporte/dlls/PrConvtr01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cedulaPasajero +
              "|" +
              numeroOrden +
              "|" +
              convenio +
              "|",
            method: "",
          })
          .then((data) => {
            this.loaderTable = false;
            this.autorizaciones = JSON.parse(JSON.stringify(data));
            this.autorizaciones.pop();
            this.search = this.autorizaciones.length !== 0 ? "" : null;
          })
          .catch((err) => {
            this.loaderTable = false;
            this.send_error("Error al cargar autorizaciones");
          });
      }
    },
    aprobarAut(item) {
      this.autorizacion = item.nro_rep;
      this.convenio = item.codconv_rep;
      this.dialogo.estado = false;
      this.init_formAut();

      this.dialogo.estado2 = true;
      this.dialogo.titulo = "Aprobar autorización";
      this.observaciones = "";
    },
    guardarAut() {
      this.loader = true;
      let numeroOrden = this.autorizacion;
      let agencia = this.punto_taquilla.codigo;
      let observaciones = this.observaciones;
      post
        .postData({
          url: "/transporte/dlls/PrConvtrM.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "0" +
            "|" +
            numeroOrden +
            "|" +
            observaciones +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          this.dialogo.estado2 = false;
          this.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.dialogo.estado2 = false;
          this.loader = false;
          this.send_error("Error al grabar autorizaciones");
        });
    },
    init_transbordos() {
      this.card_estado = this.dialogo.estado5 ? false : true;
      this.headers = this.dialogo.estado5
        ? [
            { text: "", align: "center", value: "data-table-expand" },
            { text: "Tiquete", align: "center", value: "nro_tiq" },
            { text: "Pasajero", align: "center", value: "nombres" },
            { text: "Destino", align: "center", value: "destino_tiq" },
            { text: "Sillas", align: "center", value: "sillas" },
          ]
        : [];
      this.form_transbordos = {};
      this.list_pasajeros = [];
      this.search = null;
      this.errorTransbordos = false;
    },
    iniciar_tiquetes() {
      this.$refs.selectSillas.reset_pasajeros();
      this.form.valor_recibido = {};
      this.sillas_list = [];
      this.form.vlr = 0;
      this.form.subtotal = 0;
      this.form.seguro = 0;
      this.form.descuento = 0;
    },
    abrir_transbordos() {
      if (this.form.cargue) {
        this.cargarcargues();
        this.loader = true;
        let id_via = parseFloat(this.form.cargue.id_via);

        post
          .postData({
            url: "/transporte/dlls/PrTiquetes02J.dll",
            data: sessionStorage.Sesion + "|" + id_via + "|" + 1 + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.dialogo.estado5 = true;
            this.dialogo.titulo = "Transbordar pasajeros";
            this.init_transbordos();

            this.form_transbordos = {
              viaje: id_via,
              vehiculo: this.format_placas(this.form.vehiculo),
              conductor: this.format_conductores(this.form.conductor),
            };

            this.list_pasajeros = JSON.parse(JSON.stringify(data));
            let list = this.list_pasajeros;
            if (list[0].agencia_tiq === undefined) this.list_pasajeros = [];
            else {
              list.forEach((el, index) => {
                let nombres = "";
                let sillas = "";

                list[index].pasajeros.pop();
                let longPas = el.pasajeros.length;
                el.pasajeros.forEach((pa, i) => {
                  nombres += this.formatComas(
                    i,
                    longPas,
                    pa.nombrepasajero_tiq.trim()
                  );
                  sillas += this.formatComas(i, longPas, pa.silla_tiq.trim());
                });

                list[index] = {
                  ...list[index],
                  nombres,
                  sillas,
                };
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error("Cargue no contiene pasajeros");
          });
      } else this.send_error("Debes seleccionar un viaje");
    },
    async transbordar_tiquetes() {
      let data = JSON.parse(JSON.stringify(this.form_transbordos));

      if (!data.viajeDestino) {
        this.errorTransbordos = true;
        this.send_error("Campo Obligatorio!");
      } else if (parseFloat(data.viajeDestino.id_via) == data.viaje) {
        this.errorTransbordos = true;
        this.send_error("Destino no puede ser igual al viaje!");
      } else if (!data.list_select) {
        this.errorTransbordos = true;
        this.send_error("No hay tiquetes seleccionados");
      } else {
        let tiquetes = data.list_select;
        let tiquetes_envio = {};
        this.btnEnvio.loader = true;

        tiquetes.forEach((item, idx) => {
          let index = (idx + 1).toString().padStart(3, "0");
          tiquetes_envio[
            `DATOJ-${index}`
          ] = `${item.nro_tiq}|${item.agencia_tiq}|`;
        });
        let origen = data.list_select[0].nroviaje_tiq;
        let destino = data.viajeDestino.id_via;
        let agencia = this.punto_taquilla.codigo;

        let sillas_trans = [];
        tiquetes.forEach((el) => {
          let sillas = el.sillas.split(",");
          sillas_trans = [...sillas_trans, ...sillas];
        });

        post
          .postData({
            url: "/transporte/dlls/PrTransbTiqV.dll",
            data: {
              importarhtml:
                sessionStorage.Sesion +
                "|" +
                origen +
                "|" +
                destino +
                "|" +
                agencia +
                "|",
              ...tiquetes_envio,
            },
            json: true,
            method: "",
          })
          .then(async (res) => {
            this.btnEnvio.loader = false;

            await this.transbordarSillas({
              sillas: sillas_trans,
              origen,
              destino,
              // cantidad_sillas: data.viajeDestino.cantidadSillas,
              cantidad_sillas: 30,
            });
            this.dialogo.estado5 = false;
            this.btnEnvio.loader = false;

            this.$emit("snack", {
              color: "green",
              text: "Transbordo realizado correctamente",
              estado: true,
            });
          });
      }
    },
    async transbordarSillas({ sillas, origen, destino, cantidad_sillas }) {
      this.btnEnvio.loader = true;
      let { $db } = this.fb;
      let sillas_viaje = async (viaje) => {
        let list = [];
        await $db
          .collection("tax_sillas")
          .where("viaje", "==", viaje)
          .get()
          .then(async (querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
              let data = doc.data();
              data.id = doc.id;

              list.push(data);
            });
          });

        return list;
      };

      let list_destino = await sillas_viaje(destino);
      let ocupadas = list_destino.map((el) => {
        return el.silla.silla;
      });

      let list_origen = await sillas_viaje(origen);
      let info_sillas = list_origen.filter((el) => {
        let exist = sillas.find((e) => parseInt(e) === el.silla.silla);
        return exist;
      });

      let sillas_carro = [];
      for (let i = 1; i <= cantidad_sillas; i++) sillas_carro.push(i);
      for (const el of info_sillas) {
        let oldSilla = el;
        let sillas_disp_destino = sillas_carro.filter(
          (item) => !ocupadas.includes(item)
        );
        let ocuped = ocupadas.find((item) => item === el.silla.silla);
        if (ocuped) {
          let newSilla = sillas_disp_destino[0];
          oldSilla.silla.silla = newSilla;
          ocupadas.push(newSilla);
        }

        oldSilla.viaje = destino;
        await $db.collection("tax_sillas").add(oldSilla);
        await this.anularSilla({ silla: el.silla.silla, viaje: origen });
      }
    },
    cargarcargues() {
      let fecha = this.form.fecha;
      let todos = this.form.todos ? "1" : "0";      

      if (fecha === this.form.activacion) {
        fecha = fecha.replace(/\-/g, "");
        this.loader = true;
        post
          .postData({
            url: "Transporte/dlls/PrviajesJ.dll",
            data: sessionStorage.Sesion + "|" + fecha + "|" + todos + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.cargues = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.send_error("Error al cargar Cargues");
          });
      } else {
        this.cargues = [];
        this.form.cargue = undefined;
        this.vaciarValores();
      }
    },
    cargar(cosa, url, msg) {
      this.loader = true;
      post
        .postData({
          url,
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this[cosa] = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar " + msg);
        });
    },
    format_placas: function (val) {
      return `${parseFloat(val.nrointer_veh)} - ${val.placa_veh.trim()}`;
    },
    format_conductores: function (val) {
      return `${parseFloat(
        val.identificacion_rut
      )} - ${val.descripcion_rut.trim()}`;
    },
    format_embarques: function (val) {
      return val.descrip_emb;
    },
    format_horarios: function (val) {
      return val.horasal_hor;
    },
    format_hora: function (hora) {
      let arrHor = hora.split("");
      arrHor.splice(2, 0, ":");
      return arrHor.join("");
    },
    formatComas: function (index, longitud, string) {
      return index + 1 === longitud ? string : string + ", ";
    },
    format_cargues: function (val) {
      return `${parseFloat(val.id_via)}. ${this.format_hora(
        val.horario_via
      )} - ${val.placa_via} - ${parseFloat(val.nrointer_via)} - ${
        val.fecha_via
      } - ${val.destino_lvia.trim()}`;
    },
    async asignar_valores() {
      let _this = this;

      await this.liberar_sillas();
      if (this.form.cargue) {
        let cargue = { ...this.form.cargue };
        let busq_origen = this.embarques.find(
          (el) => parseInt(el.id_emb) == parseInt(cargue.codorigen_via)
        );
        this.form.origen = busq_origen;

        this.horarios.forEach((hor) => {
          if (this.format_hora(cargue.horario_via) === hor.horasal_hor)
            this.form.horario = hor;
        });

        this.placas.forEach((pla) => {
          if (cargue.placa_via === pla.placa_veh) this.form.vehiculo = pla;
        });

        this.conductores.forEach((cond) => {
          if (cond.identificacion_rut === cargue.conductor1_via) {
            this.form.conductor = cond;
            if (this.errores.conductor) this.errores.conductor = false;
          }
        });

        switch (cargue.tipoveh2_via) {
          case "01":
            this.form.servicio = "1. Microbus - 16 pasajeros";
            this.plantillaBus = "plantilla1";
            break;
          case "02":
            this.form.servicio = "2. Microbus - 17 pasajeros";
            this.plantillaBus = "plantilla2";
            break;
          case "03":
            this.form.servicio = "3. Taxi - 8 pasajeros";
            this.plantillaBus = "plantilla3";
            break;
          case "04":
            this.form.servicio = "4. Microbus - 15 pasajeros";
            this.plantillaBus = "plantilla4";
            break;
          case "05":
            this.form.servicio = "5. Bus preferencial - 44 pasajeros";
            this.plantillaBus = "plantilla5";
            break;
          case "06":
            this.form.servicio = "6. Microbus - 14 pasajeros";
            this.plantillaBus = "plantilla6";
            break;
          case "07":
            this.form.servicio = "7. Taxi - 4 pasajeros";
            this.plantillaBus = "plantilla7";
            break;
          case "08":
            this.form.servicio = "8. Microbus - 18 pasajeros";
            this.plantillaBus = "plantilla8";
            break;
          case "09":
            this.form.servicio = "9. Bus - 36 pasajeros";
            this.plantillaBus = "plantilla9";
            break;
          case "11":
            this.form.servicio = "11. Bus - 40 pasajeros";
            this.plantillaBus = "plantilla11";
            break;
          case "12":
            this.form.servicio = "12. Bus - 42 pasajeros";
            this.plantillaBus = "plantilla12";
            break;
          case "13":
            this.form.servicio = "13. Bus - 44 pasajeros";
            this.plantillaBus = "plantilla13";
            break;
          case "14":
            this.form.servicio = "14. Taxi     -9 Pasajeros";
            this.plantillaBus = "plantilla14";
            break;
          case "19":
            this.form.servicio = "19. Microbus - 15 pasajeros";
            this.plantillaBus = "plantilla19";
            break;
        }

        _this.consultarSillas();
      } else this.vaciarValores();
    },
    vaciarValores() {
      this.form.horario = undefined;
      this.form.conductor = undefined;
      this.form.vehiculo = undefined;
      this.form.servicio = undefined;
    },
    async consultarSillas() {
      // Get sillas
      const _this = this;

      let cargue = { ...this.form.cargue };

      let { $db } = this.fb;
      await $db
        .collection("tax_sillas")
        .where("viaje", "==", cargue.id_via)
        // .get()
        // .then((query) => {
        .onSnapshot(function (querySnapshot) {
          let list = [];

          querySnapshot.forEach(function (doc) {
            let data = doc.data();

            data.id = doc.id;
            list.push(data);
          });
          _this.sillas_model = list;
        });
    },
    init_listPasajeros() {
      this.headers = this.dialogo.estado3
        ? [
            { text: "Tiquete", align: "center", value: "nro_tiq" },
            { text: "Ruta", align: "center", value: "ruta_tiq" },
            { text: "Fecha embarque", align: "center", value: "fechaemb_tiq" },
            { text: "Pasajeros", align: "center", value: "nombres" },
            { text: "Sillas", align: "center", value: "sillas" },
            { text: "Valor", align: "center", value: "valor" },
            { text: "Estado", align: "center", value: "estado_tiq" },
            {
              text: "Fecha elaboración",
              align: "center",
              value: "fechaelab_tiq",
            },
            { text: "Opciones", align: "center", value: "edit" },
          ]
        : [];
      this.list_pasajeros = [];
      this.search = null;
    },
    cerrar_listPasajeros() {
      this.form.anulados = 0;
      this.init_listPasajeros();
    },
    cargar_listPasajeros() {
      if (this.form.cargue) {
        this.loader = true;
        let id_via = parseFloat(this.form.cargue.id_via);
        let anulados = this.form.anulados ? "0" : "1";

        post
          .postData({
            url: "/transporte/dlls/PrTiquetesV02J.dll",
            data: sessionStorage.Sesion + "|" + id_via + "|" + anulados + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.dialogo.estado3 = true;
            this.dialogo.titulo = "Listado de pasajeros";
            this.init_listPasajeros();

            this.list_pasajeros = JSON.parse(JSON.stringify(data));
            let list = this.list_pasajeros;
            if (list[0].agencia_tiq === undefined) this.list_pasajeros = [];
            else {
              list.forEach((el, index) => {
                let nombres = "";
                let sillas = "";
                let valor = 0;

                list[index].pasajeros.pop();
                let longPas = el.pasajeros.length;
                el.pasajeros.forEach((pa, i) => {
                  nombres += this.formatComas(
                    i,
                    longPas,
                    pa.nombrepasajero_tiq.trim()
                  );
                  sillas += this.formatComas(i, longPas, pa.silla_tiq.trim());
                  valor += parseFloat(pa.vlrneto_tiq.replace(/\,/g, "")) || 0;
                });

                list[index] = {
                  ...list[index],
                  nombres,
                  sillas,
                  valor: "$" + this.formatNumero(valor),
                };
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error("Cargue no contiene pasajeros");
          });
      } else this.send_error("Debes seleccionar un viaje");
    },
    imprimir(data, reload) {
      const _this = this;
      let fecha = this.$moment().format("YYYY-MM-DD");
      let hora = this.$moment().format("HH:mm");

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        this.pdfs.getBase64(logoSuper_src).then((logoSuper) => {
          data.logoSuper = logoSuper;
          tiquete_transporte(data, fecha, hora).then(() => {
            console.log("Impresión terminada");
            if (reload) {
              _this.consultarSillas();
              _this.init_campos();
            }
          });
        });
      });
    },
    cerrar_libro() {
      if (this.form.cargue) {
        this.loader = true;
        let cargue = { ...this.form.cargue };
        let agencia = this.punto_taquilla.codigo;
        let cargueId = cargue.id_via;
        post
          .postData({
            url: "/transporte/dlls/PrTiquetes03VJ.dll",
            data: sessionStorage.Sesion + "|" + agencia + "|" + cargueId + "|",
            method: "",
          })
          .then((data) => {
            this.dialogo.estado4 = true;
            this.loader = false;
            let tiquetes = JSON.parse(JSON.stringify(data));

            let totalSeguro = 0;
            let totalCantidad = 0;
            let totalValor = 0;
            let efectivo = 0;
            let tdebito = 0;
            let redBus = 0;
            let pinBus = 0;
            let brasilia = 0;
            let avances = 0;
            let avance_agc = 0;
            let gamarra = 0;

            if (tiquetes[0].agencia_tiq === undefined) tiquetes = [];
            else {
              tiquetes.forEach((el, index) => {
                let nombres = "";
                let sillas = "";
                let valor = 0;
                let formapago = "";
                let cantidad = 0;

                switch (el.fpago_tiq) {
                  case "01":
                    formapago = "Efectivo";
                    break;
                  case "02":
                    formapago = "Tarjeta crédito";
                    break;
                  case "03":
                    formapago = "Tarjeta débito";
                    break;
                  case "04":
                    formapago = "Otro";
                    break;
                  case "06":
                    formapago = "Yates";
                    break;
                  case "07":
                    formapago = "Redbus";
                    break;
                  case "08":
                    formapago = "Reserva";
                    break;
                  case "09":
                    formapago = "Convenio Brasilia";
                    break;
                  case "10":
                    formapago = "Pin Bus";
                    break;
                  case "11":
                    formapago = "Gamarra";
                    break;
                }

                tiquetes[index].pasajeros.pop();
                let longPas = el.pasajeros.length;
                el.pasajeros.forEach((pa, i) => {
                  nombres += this.formatComas(
                    i,
                    longPas,
                    pa.nombrepasajero_tiq.trim()
                  );
                  sillas += this.formatComas(i, longPas, pa.silla_tiq.trim());
                  cantidad +=
                    parseFloat(pa.cantidad_tiq.replace(/\,/g, "")) || 0;

                  valor += parseFloat(pa.vlrtotal_tiq.replace(/\,/g, "")) || 0;
                  totalSeguro +=
                    parseFloat(pa.seguro_tiq.replace(/\,/g, "")) || 0;
                  totalValor += parseFloat(pa.vlr_tiq.replace(/\,/g, "")) || 0;
                });

                efectivo += el.fpago_tiq === "01" ? valor : 0;
                tdebito += el.fpago_tiq === "03" ? valor : 0;
                redBus += el.fpago_tiq === "07" ? valor : 0;
                pinBus += el.fpago_tiq === "10" ? valor : 0;
                gamarra += el.fpago_tiq === "11" ? valor : 0;
                brasilia += el.fpago_tiq === "09" ? valor : 0;

                if (agencia === "0006") {
                  avance_agc = efectivo;
                }

                totalCantidad += cantidad;
                // totalValor += valor - gamarra;

                tiquetes[index] = {
                  ...tiquetes[index],
                  nombres,
                  sillas,
                  formapago,
                  cantidad,
                  valor: "$" + this.formatNumero(valor),
                };
              });
            }

            this.libroViajes = {
              estado: 1,
              agencia: this.punto_taquilla.codigo,
              origen: cargue.origen_lvia.trim(),
              destino: cargue.destino_lvia.trim(),
              fecha: cargue.fecha_via,
              hora: this.format_hora(cargue.horario_via),
              nroCargue: parseFloat(cargueId),
              vehiculo: cargue.placa_via,
              conductor: `${
                cargue.conductor1_via
              } - ${cargue.desconductor_tiq.trim()}`,
              tiquetes,
              totalSeguro,
              totalCantidad,
              totalValor,
              efectivo,
              tdebito,
              redBus,
              pinBus,
              avance: avances + avance_agc,
              brasilia,
              gamarra,

              totalPagar: totalValor - avances - gamarra - redBus - pinBus,
            };
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error("Error al cargar tiquetes");
          });
      } else this.send_error("Debes seleccionar un viaje");
    },
    updateLibroViajes(data) {
      this.libroViajes = data;
    },
    updateEstadoViajes(dialogo) {
      this.dialogo.estado4 = dialogo.estado;
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
