<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-face-man-shimmer</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                <v-col cols="12" align="center">
                  <h3 class="text-h5 font-weight-medium">
                    Dispensación Mipres {{ punto_recaudo }}
                  </h3>
                </v-col>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row class="ml-2 justify-center">
          <v-col class="d-flex" cols="12">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
          </v-col>
        </v-row>

        <v-card>
          <v-toolbar color="primary" title="Opening from the bottom">
            <span class="blanco">Seleccione el Tipo de Contrato</span>
          </v-toolbar>
          <v-col class="d-flex" cols="12" md="6">
            <v-text-field
              background-color="white"
              color="black"
              outlined
              v-model="form.paciente"
              hide-details
              clearable
              :error="errores.identificacion"
              class="text-h4"
              height="70px"
              label="Buscar por Cedula"
              @keyup.enter="buscar_cedula()"
            >
            </v-text-field>
          </v-col>

          <v-row class="justify-center"
          v-if="form.paciente"
          >
            <v-col class="d-flex" cols="8">
              <v-select
                :items="[
                  { text: 'Capitado', value: 2 },
                  { text: 'Evento', value: 1 },
                ]"
                label="Tipo Contrato"
                clearable
                hide-details
                return-object
                v-model="form.tipocontr"
                item-text="text"
                item-value="value"
                @change="get_historial()"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>

          <v-row
            class="justify-center"
            v-if="form.tipocontr ? form.tipocontr.value == 1 : false"
          >
            <v-col class="d-flex" cols="8">
              <v-select
                :items="[
                  { text: 'Mipres', value: 1 },
                  { text: 'Voucher', value: 2 },
                  { text: 'Masiva', value: 3 },
                ]"
                label="Tipo Orden"
                clearable
                hide-details
                return-object
                v-model="form.tipoorden"
                item-text="text"
                item-value="value"
                required
                :error="errores.tipoorden"
                @change="errores.tipoorden = false"
              ></v-select>
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn color="indigo white--text" @click="abrir_dispensacion()"
              >Continuar</v-btn
            >
          </v-card-actions>

          <v-row class="justify-center"
          v-if="form.tipocontr"
          >
            <v-card-subtitle
              v-if="form.tipocontr"
              class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
              >Historial de Entregas</v-card-subtitle
            >
          </v-row>

          <v-row class="justify-center" v-if="form.tipocontr">
            <v-col class="mb-4" cols="6" sm="6">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-col>

            <v-data-table
              :headers="headers_paciente"
              sort-by="fecha_rep"
              :sort-desc="true"
              :items="contenido_paciente"
              :search="search"
              v-if="form.tipocontr"              
            >
              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>
            </v-data-table>
          </v-row>
        </v-card>        
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog
      v-model="dialogodispensa.estado"
      persistent
      max-width="1100px"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-toolbar color="primary" class="mt-2">
          <v-row>
            <v-col cols="4">
              <span class="text-h6 white--text"
                >Dispensación de Medicamentos</span
              >
            </v-col>
            <v-col cols="3" class="mt-4">
              <v-text-field v-model="form.sede" disabled dark hide-details
                ><template v-slot:label>
                  <span class="blanco">Sede</span>
                </template></v-text-field
              >
            </v-col>
            <v-col cols="2" class="mt-4">
              <v-text-field v-model="form.fecha" hide-details disabled dark>
                <template v-slot:label>
                  <span class="blanco">Fecha</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="2" class="mt-4">
              <v-text-field
                v-model="form.consecutivo"
                disabled
                hide-details
                dark
                ><template v-slot:label>
                  <span class="blanco">Consecutivo</span>
                </template></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="text-h6 blanco"
                v-model="form.texttipocontr"
                hide-details
                disabled
                dark
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-card-title class="headline"> </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="d-flex">
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Telefono"
                hide-details
                clearable
                v-model="form.telpaciente"
                :error="errores.telpaciente"
                @input="errores.telpaciente = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Dirección"
                hide-details
                clearable
                v-model="form.direccpaciente"
                :error="errores.direccpaciente"
                @input="errores.direccpaciente = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Barrio"
                hide-details
                clearable
                v-model="form.barriopaciente"
                :error="errores.barriopaciente"
                @input="errores.barriopaciente = false"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                :items="filtro_eps"
                :item-text="format_contrato"
                item-value="nro"
                hide-details
                v-model="form.contrato"
                clearable
                return-object
                @change="get_servicios(), (errores.contrato = false)"
                :error="errores.contrato"
                ><template v-slot:label>
                  <span class="color-personalizado">Contrato</span>
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field v-model="form.idpaciente" hide-details disabled
                ><template v-slot:label>
                  <span class="color-personalizado">Id_Paciente</span>
                </template></v-text-field
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field v-model="form.descrippac" disabled hide-details
                ><template v-slot:label>
                  <span class="color-personalizado">Descripción</span>
                </template></v-text-field
              >
            </v-col>

            <!-- <v-col class="d-flex justify-start align-center" cols="12" sm="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="blue"
                    fab
                    small
                    icon
                    v-on="on"
                    @click="abrir_qr()"
                  >
                    <v-icon>mdi-qrcode-scan</v-icon>
                  </v-btn>
                </template>
                <span>Escanear QR</span>
              </v-tooltip>
            </v-col> -->
          </v-row>

          <v-row>
            <!-- <v-col class="d-flex justify-start align-center" cols="1">
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
            </v-col> -->
          </v-row>
          <v-row>
            <v-col
              class="d-flex"
              cols="3"
              v-if="form.tipocontr ? form.tipocontr.value == 1 : false"
            >
              <v-text-field
                v-model="form.autorizacion"
                hide-details
                :error="errores.autorizacion"
                @input="errores.autorizacion = false"
                clearable
                ><template v-slot:label>
                  <span class="color-personalizado">Autorización</span>
                </template></v-text-field
              >
            </v-col>

            <v-col
              class="d-flex"
              sm="3"
              v-if="form.tipocontr ? form.tipocontr.value == 1 : false"
            >
              <v-menu
                v-model="pickerFechaauto"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaauto"
                    label="Fecha Autorización:"
                    hide-details
                    v-on="on"
                    :error="errores.fechaauto"
                    @input="errores.fechaauto = false"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaauto"
                  @change="validarautoriza()"
                  @input="
                    pickerFechaauto = false;
                    errores.fechaauto = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickerFechaformula"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaformula"
                    label="Fecha Formula:"
                    hide-details
                    v-on="on"
                    :error="errores.fechaformula"
                    @input="errores.fechaformula = false"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaformula"
                  @input="
                    pickerFechaformula = false;
                    errores.fechaformula = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              class="d-flex"
              cols="3"
              v-if="form.tipoorden ? form.tipoorden.value == 1 : false"
            >
              <v-text-field
                v-model="form.nromipres"
                hide-details
                :error="errores.nromipres"
                @input="errores.nromipres = false"
                clearable
                ><template v-slot:label>
                  <span class="color-personalizado">Mipres</span>
                </template></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6">
              <v-autocomplete
                :items="diagnosticos"
                :item-text="format_diagnostico"
                item-value="codigo"
                label="Diagnostico"
                clearable
                hide-details
                v-model="form.diagnostico"
                :error="errores.diagnostico"
                @change="errores.diagnostico = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickerFechamantis"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechamantis"
                    label="Fecha Pendiente 2023"
                    hide-details
                    v-on="on"
                    :error="errores.fechamantis"
                    @input="errores.fechamantis = false"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechamantis"
                  @input="pickerFechamantis = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6">
              <v-autocomplete
                :items="ipsremite"
                :item-text="format_ipsremite"
                item-value="cod_rep"
                label="Ips Remitente"
                clearable
                hide-details
                v-model="form.ipsremite"
                :error="errores.ipsremite"
                @change="errores.ipsremite = false"
              ></v-autocomplete>
            </v-col>
            <v-col sm="6">
              <v-autocomplete
                :items="medremite"
                :item-text="format_medremite"
                item-value="cod_rep"
                label="Médico Remitente"
                clearable
                hide-details
                v-model="form.medremite"
                :error="errores.medremite"
                @change="errores.medremite = false"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="ml-4 justify-center">
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Nro. Entrega"
                hide-details
                :error="errores.nroentrega"
                @change="errores.nroentrega = false"
                v-model="form.nroentrega"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Observaciones"
                hide-details
                v-model="form.observacciones"
              ></v-text-field>
            </v-col>

            <v-col class="mt-3 d-flex justify-end" cols="4">
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="get_ipsremite(), get_medremite()"
                depressed
              >
                <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
              </v-btn>
            </v-col>
          </v-row>
          <v-col class="d-flex" cols="12">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1.5px', 'border-color': 'orange' }"
            />
          </v-col>

          <v-row class="ml-2 justify-center">
            <v-col class="d-flex" cols="2">
              <v-switch
                v-model="form.domicilio"
                label="Entrega a Domicilio"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.tutela" label="Tutela"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.pqr" label="PQR"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.gestante" label="Gestante"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-switch v-model="form.pyp" label="Pyp"></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                outlined
                v-model="form.molecula"
                :item-text="format_moleculas"
                :items="moleculas"
                clearable
                return-object
                @change="get_medicamento"
                ><template v-slot:label>
                  <span class="color-personalizado">Molécula</span>
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                outlined
                v-model="form.medicamento"
                :item-text="format_medicam"
                :items="medicamentos"
                @change="get_saldo()"
                clearable
                return-object
                ><template v-slot:label>
                  <span class="color-personalizado">Medicamento</span>
                </template></v-autocomplete
              >
            </v-col>
          </v-row>

          <v-row class="px-6 mt-0 justify-left">
            <v-col class="text-center font-weight-bold"> Indicación </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                clearable
                v-model="form.cantidad"
                hide-details
                @change="errores.cantidad = false"
                @keyup.enter="focusNextField('cada')"
                :error="errores.cantidad"
                ><template v-slot:label>
                  <span class="color-personalizado">Cantidad</span>
                </template></v-text-field
              >
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                clearable
                v-model="form.cada"
                hide-details
                :error="errores.cada"
                @keyup.enter="focusNextField('frecuencia')"
                @change="errores.cada = false"
                id="cada"
                ><template v-slot:label>
                  <span class="color-personalizado">Cada</span>
                </template></v-text-field
              >
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-autocomplete
                v-model="form.frecuencia"
                :items="frecuencia"
                hide-details
                filled
                shaped
                @keyup.enter="focusNextField('duracion')"
                id="frecuencia"
                :error="errores.frecuencia"
                @change="errores.frecuencia = false"
                ><template v-slot:label>
                  <span class="color-personalizado">Frecuencia</span>
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                clearable
                v-model="form.duracion"
                hide-details
                :error="errores.duracion"
                @change="errores.duracion = false"
                @keyup.enter="focusNextField('tiempo')"
                id="duracion"
                ><template v-slot:label>
                  <span class="color-personalizado">Duración</span>
                </template></v-text-field
              >
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-autocomplete
                v-model="form.tiempo"
                :items="tiempo"
                hide-details
                @change="errores.tiempo = false"
                @keyup.enter="focusNextField('totalform')"
                id="tiempo"
                :error="errores.tiempo"
                filled
                shaped
                ><template v-slot:label>
                  <span class="color-personalizado">Tiempo</span>
                </template></v-autocomplete
              >
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                clearable
                v-model="form.totalform"
                :error="errores.totalform"
                @change="errores.totalform = false"
                id="totalform"
                hide-details
                ><template v-slot:label>
                  <span class="color-personalizado">T. Solicitado</span>
                </template></v-text-field
              >
            </v-col>
          </v-row>

          <v-row class="ml-2 justify-center">
            <v-data-table
              :headers="headers_tabla_saldos"
              :items="items_tabla_saldos"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon
                  class="mr-2"
                  @click="add_medicamento(item)"
                  color="green"
                  >mdi-check-circle</v-icon
                >
              </template>
              <template v-slot:item.vence_rep="{ item }">
                <p
                  :style="{ backgroundColor: item.color_rep }"
                  style="color: white"
                >
                  {{ item.vence_rep }}
                </p>
              </template>

              <template v-slot:item.entrega_rep="props">
                <v-edit-dialog :return-value.sync="props.item.entrega_rep">
                  {{ props.item.entrega_rep }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.entrega_rep"
                      label="Cantidad Entregada"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
            </v-data-table>
          </v-row>
          <v-row class="ml-2 justify-center">
            <v-col class="d-flex" cols="12">
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '2px', 'border-color': 'orange' }"
              />
            </v-col>
          </v-row>
          <v-row class="ml-2 justify-center">
            <v-data-table
              :headers="headers_tabla_entrega"
              :items="items_tabla_entrega"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="borrar_medic(item)"
                  color="red"
                  >delete</v-icon
                >
              </template>
            </v-data-table>
          </v-row>
          <v-row class="ml-2 justify-center">
            <v-col class="d-flex" cols="12">
              <v-divider color="orange"></v-divider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="d-flex ml-2">
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Copago"
              outlined
              hide-details
              v-model="form.copago"
              v-money="money"
              ref="input_valor"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Cuota Moderadora"
              outlined
              hide-details
              v-model="form.cuotam"
              v-money="money"
              ref="input_valor"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-select
              :items="[
                { text: 'Usuario', value: 1 },
                { text: 'Otra Persona', value: 2 },
              ]"
              label="Medicamento Retirado por:"
              clearable
              hide-details
              return-object
              v-model="form.reclama"
              item-text="text"
              item-value="value"
              required
              :error="errores.reclama"
              @change="errores.reclama = false"
            >
            </v-select>
          </v-col>

          <v-col class="d-flex mt-4" cols="4">
            <div class="pa-2">Calificación</div>
            <div class="text-center">
              <v-rating
                v-model="form.califica"
                hover
                label="Calificación"
                :error="errores.califica"
                @change="errores.califica = false"
              ></v-rating>
            </div>
          </v-col>
        </v-row>

        <v-row
          class="ml-2 justify-center"
          v-if="form.reclama ? form.reclama.value == 2 : false"
        >
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Id_Reclama"
              hide-details
              v-model="form.idreclama"
              :error="errores.idreclama"
              @change="errores.idreclama = false"
            ></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="4">
            <v-text-field
              label="Apellidos y Nombres Reclama"
              hide-details
              v-model="form.descripreclama"
              :error="errores.descripreclama"
              @change="errores.descripreclama = false"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Parentezco"
              hide-details
              v-model="form.parentezcoreclama"
              :error="errores.parentezcoreclama"
              @change="errores.parentezcoreclama = false"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Telefono"
              hide-details
              clearable
              v-model="form.telreclama"
              :error="errores.telreclama"
              @change="errores.telreclama = false"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ml-2 justify-center">
          <v-col class="d-flex" cols="12">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
          </v-col>
        </v-row>

        <v-row class="d-flex ml-2 justify-end">
          <v-card-actions>
            <v-btn
              class="ma-2 white--text"
              color="red"
              text
              @click="dialogodispensa.estado = false"
              >Regresar a Turnos</v-btn
            >
            <v-btn
              class="ma-2 white--text"
              color="green"
              depressed
              large
              :disabled="disabled.guardar"
              @click="cerrar_atencion()"
              >Guardar Dispensación</v-btn
            >
            <v-btn
              class="ma-2 white--text"
              color="orange"
              depressed
              :disabled="disabled.imprimirdsp"
              large
              @click="get_impresion()"
              >Imprimir</v-btn
            >

            <v-col class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="white--text px-12"
                depressed
                large
                :disabled="disabled.subirpdf"
                @click="get_file()"
              >
                Subir soporte
                <v-icon>mdi-cloud-arrow-up-outline</v-icon>
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogocargue.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Cargue Documentos</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="4">
              <v-select
                :items="[
                  { text: 'Soporte Entrega', value: 1 },
                  { text: 'Tirilla Pendientes', value: 2 },
                ]"
                label="Tipo Documento"
                clearable
                hide-details
                return-object
                v-model="form.tipodocum"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-file-input
                label="Cargar Documentos"
                accept=".pdf"
                outlined
                hide-details
                v-model="form.pdf"
              ></v-file-input>
            </v-col>
            <v-col class="d-flex justify-end mt-3">
              <v-btn
                color="purple"
                class="white--text px-12"
                depressed
                @click="subir_pdf"
              >
                Grabar Soporte
              </v-btn>
            </v-col>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex justify-center" cols="6">
              <v-btn
                color="red accent-4"
                class="white--text"
                depressed
                @click="sgte_paciente()"
              >
                Siguiente Paciente
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-center" cols="6">
              <v-btn
                color="orange"
                class="white--text"
                depressed
                @click="dialogocargue.estado = false"
              >
                Replicar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

import {
  dispensacion,
  dispensacion_pos,
  copago_pos,
  pendientes_pos,
} from "../../_formatos_disp.js";

export default {

  beforeDestroy() {
    console.log("cerrado");
    clearInterval(this.intervalId);
    this.intervalId = null;
  },
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      sortKey: "consec_rep",
      sortDesc: false,
      search: "",

      timer: null,
      loader: false,
      dialog: true,
      comprobante: null,
      nropte: null,
      valid: false,
      idusuario: 0,
      dialogPicker: false,
      singleExpand: true,
      pickerFechaauto: false,
      pickerFechaformula: false,
      pickerFechamantis: false,
      punto_recaudo: null,
      expanded: [],
      contenido: [],
      ventanillas: [],
      diagnosticos: [],
      contratos: [],
      filtro_tipocontrato: [],
      filtro_eps: [],

      medicamentosCompletos: [],
      medicamentos: [],
      moleculas: [],
      ipsremite: [],
      medremite: [],
      empresa: [],
      items_tabla_saldos: [],
      items_tabla_entrega: [],
      contenido_paciente: [],

      dialogocargue: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      disabled: {
        imprimirdsp: true,
        subirpdf: true,
        guardar: false,
      },

      filas: [],
      itemselec: null,
      timer_ini: false,
      intervalId: null,
      tipo_contrato: null,
      tipo_timer: 0,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      frecuencia: [
        { text: "Minutos", value: 1 },
        { text: "Horas", value: 2 },
        { text: "Dias", value: 3 },
        { text: "Semanas", value: 4 },
        { text: "Meses", value: 5 },
        { text: "Años", value: 6 },
        { text: "Unica", value: 8 },
        { text: "S/g Respuesta al Tto", value: 7 },
      ],

      tiempo: [
        { text: "Dias", value: 3 },
        { text: "Semanas", value: 4 },
        { text: "Meses", value: 5 },
        { text: "Minutos", value: 1 },
        { text: "Horas", value: 2 },
        { text: "Años", value: 6 },
        { text: "Unica", value: 8 },
        { text: "S/g Respuesta al Tto", value: 7 },
      ],
      headers_paciente: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Dispensación", align: "center", value: "consec_rep" },
        { text: "Sede", align: "center", value: "agencia_rep" },
        { text: "Medicamento", align: "left", value: "descripprod_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        // { text: "Seleccionar", value: "edit", align: "center" },
      ],

      headers_tabla_saldos: [
        { text: "Medicamento", align: "left", value: "descripprod_rep" },
        { text: "Lote", align: "center", value: "lote_rep" },
        { text: "Saldo", align: "center", value: "cant_rep" },
        { text: "Entrega", align: "center", value: "entrega_rep" },
        { text: "Vence", align: "left", value: "vence_rep" },
        { text: "Laboratorio", align: "center", value: "laboratorio_rep" },
        { text: "Seleccionar", value: "edit", align: "center" },
      ],
      headers_tabla_entrega: [
        { text: "Medicamento", align: "left", value: "tab_medicamento" },
        { text: "Lote", align: "left", value: "tab_lote_medicamento" },
        { text: "Solicitado", align: "center", value: "tab_cantotal" },
        { text: "Entregado", align: "center", value: "tab_entregado" },
        { text: "Pendiente", align: "center", value: "tab_pendiente" },
        { text: "Opciones", value: "edit", align: "center" },
      ],

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogodispensa: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogotipocontrato: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      errores: {
        autorizacion: false,
        codigo: false,
        estado: false,
        diagnostico: false,
        ipsremite: false,
        medremite: false,
        cantidad: false,
        nroentrega: false,
        cada: false,
        frecuencia: false,
        fechaauto: false,
        fechaformula: false,
        duracion: false,
        telpaciente: false,
        direccpaciente: false,
        barriopaciente: false,
        tiempo: false,
        totalform: false,
        tipoorden: false,
        contrato: false,
        nromipres: false,
        reclama: false,
        idreclama: false,
        identificacion: false,
        descripreclama: false,
        parentezcoreclama: false,
        telreclama: false,
        califica: false,
      },

      form: {
        espera: true,
        noresponde: false,
        atendidos: false,
        todos: false,
        descrippac: null,
        consecutivo: 0,
        frecuencia: null,
        duracion: null,
        totalform: 0,
        reclama: null,
        tipocontr: null,
      },
      intervalo: null,

      selectedVoice: null,
      voices: [],

      card_estado: false,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Turno", align: "center", value: "consec_rep", sortable: true },
        { text: "Fila", align: "left", value: "descrip_rep" },
        { text: "SubFila", align: "left", value: "descripsubfila_rep" },
        { text: "Hora turno", align: "center", value: "horaturno_rep" },
        { text: "Paciente", align: "left", value: "paciente_rep" },
        { text: "Id_Paciente", align: "center", value: "idpaciente_rep" },
        { text: "Tiempo Espera", align: "center", value: "tiempoespera_rep" },
        { text: "Funcionario", align: "left", value: "usuario_rep" },

        { text: "Opciones", value: "action", align: "center" },
        { text: "Estado", align: "left", value: "descestado_rep" },
      ],
    };
  },
  created() {
    this.get_empresa();
    this.get_molecula();
    this.get_ipsremite();
    this.get_medremite();
    this.get_contratos();
    this.get_diagnosticos();
    this.iniciar_dispensacion();
  },
  computed: {},
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          this.idusuario = parseFloat(sessionStorage.Sesion.substr(15, 15));
          this.punto_recaudo = this.empresa.descragencia_rep.trim();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_historial() {
      this.contenido_paciente = [];
      this.loader = true;
      let paciente = this.paciente.identificacion;
      post
        .postData({
          url: "Dispensa/dlls/RpDispensa02J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido_paciente = data;
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente Sin historial",
            estado: true,
          });
        });
    },
    get_file(item) {
      this.dialogocargue.estado = true;
      // this.item_sel = item;
      this.form.pdf = null;
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    async subir_pdf() {
      this.card_estado = true;

      let session = sessionStorage.Sesion;
      let agencia = sessionStorage.Sede;
      let empresa = this.empresa.descrip_empr.trim();
      let cargue_pdf = this.form.pdf.name;
      let consec = parseFloat(this.comprobante);
      let clasif = this.form.tipodocum.value;
      let consecpte = 0;
      let agcpte = 0;
      let codigo = "";
      let tipodoc = "02";
      let nombre_pdf = "DSP_" + consec + "_" + clasif + ".pdf";

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
        "https://server3ts.com//financiero/inc/cargue.googledrive.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());
      this.card_estado = false;
      this.$emit("snack", {
        color: "success",
        text: "Soporte Guardado Correctamente",
        estado: true,
      });
    },
    async get_impresion() {
      let agencia = sessionStorage.Sede;
      let consecutivo = `00000${this.form.consecutivo - 1}`;
      // consecutivo = 1;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          // this.pdfs.getBase64(logo_src).then((logo) => {
          //   data.logo = logo;
          //   dispensacion(data).then(() => {
          //     console.log("Impresión terminada");

          //   });

          // });
          const logo = await this.pdfs.getBase64(logo_src);
          data.logo = logo;
          if (this.form.tipocontr.value == 1) {
            await dispensacion(data);
          }
          await dispensacion_pos(data);
          let recibido = parseFloat(data.vlr_recibido);
          if (recibido > 0) {
            await copago_pos(data);
          }
          datosEnvio =
            sessionStorage.Sesion + "|" + agencia + "|" + this.nropte + "|";
          post
            .postData({
              url: "Dispensa/dlls/PrPendiente01J.dll",
              data: datosEnvio,
              method: "",
            })
            .then(async (data2) => {
              data2 = data2[0];
              data2.logo = logo;
              pendientes_pos(data2).then(() => {
                console.log("Impresión terminada");
              });
            })
            .catch((err) => {
              console.log(err);
              this.send_error("Error al imprimir Dispensacion de pendientes");
            });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printpend_item(item) {
      let agencia = item.idagencpte_rep;
      let consecutivo = item.consecpte_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente01J.dll",
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
            pendientes_pos(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    iniciar_dispensacion(item) {
      this.contenido_paciente = [];
      this.form.tipocontr = null;
      this.intervalId = null;
      this.form.paciente = null;
    },
    add_medicamento(item) {
      if (!this.form.cantidad) {
        this.errores.cantidad = true;
        this.send_error("Cantidad Obligatorio!");
      } else if (!this.form.cada) {
        this.errores.cada = true;
        this.send_error("Cada Obligatorio!");
      } else if (!this.form.frecuencia) {
        this.errores.frecuencia = true;
        this.send_error("frecuencia Obligatorio!");
      } else if (!this.form.duracion) {
        this.errores.duracion = true;
        this.send_error("duracion Obligatorio!");
      } else if (!this.form.tiempo) {
        this.errores.tiempo = true;
        this.send_error("tiempo Obligatorio!");
      } else if (!this.form.totalform) {
        this.errores.totalform = true;
        this.send_error("Total Obligatorio!");
      } else {
        const index = this.items_tabla_entrega.length;
        let cant_solicitado = parseFloat(this.form.totalform.trim());
        let cant_entregado = item.entrega_rep;
        let saldo = parseFloat(item.cant_rep.trim());

        if (saldo < cant_entregado || cant_entregado > cant_solicitado) {
          this.$emit("snack", {
            color: "error",
            text: "Error en cantidad entregada!!",
            estado: true,
          });
        } else {
          if (cant_entregado < 1) {
            this.$emit("snack", {
              color: "error",
              text: "Cantidad entregada en Ceros!. Se genera pendiente por el total Formulado",
              estado: true,
            });
          }
          let cant_pendiente = cant_solicitado - cant_entregado;
          {
            this.items_tabla_entrega.push({
              tab_codigo: item.codprod_rep.trim(),
              tab_medicamento: item.descripprod_rep.trim(),
              tab_lote_medicamento: item.lote_rep.trim(),
              id: index + 1,
              tab_cantotal: cant_solicitado,
              tab_entregado: cant_entregado,
              tab_pendiente: cant_pendiente,
              tab_vence: item.vence_rep,
              tab_cum: item.cum_rep,
              cant_formu: this.form.cantidad.trim(),
              cada_formu: this.form.cada.trim(),
              frecuencia_formu: this.form.frecuencia,
              duracion_formu: this.form.duracion,
              tiempo_formu: this.form.tiempo,
              cod_med_eps: "",
            });
          }
          this.form.cantidad = "";
          this.form.cada = "";
          this.form.frecuencia = null;
          this.form.duracion = "";
          this.form.tiempo = null;
          this.form.totalform = "";
          this.items_tabla_saldos = [];
          this.form.molecula = null;
          this.form.medicamento = null;
        }
      }

    },
    borrar_medic(item) {
      const index = this.items_tabla_entrega.indexOf(item);
      this.items_tabla_entrega.splice(index, 1);
    },
    get_medicamento() {
      let molecula = this.form.molecula.cod_rep;
      let contrato = this.form.contrato.nro_rep;
      this.medicamentos = [];      
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa03J.DLL",
          data: sessionStorage.Sesion + "|" + molecula + "|"  + contrato + "|",
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
    get_saldo() {
      let medicamento = this.form.medicamento.codigo.trim();
      let agencia = sessionStorage.Sede;
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.items_tabla_saldos = [];

      post
        .postData({
          url: "Dispensa/dlls/RpSaldos3J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            medicamento +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.items_tabla_saldos = JSON.parse(JSON.stringify(data));
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
    selectMedicamento() {
      let medicamentos = [];

      if (this.form.molecula) {
        this.medicamentosCompletos.forEach((m) => {
          const medi = m.servicios.filter(
            (s) => s.codmolecula === this.form.molecula.cod_rep
          );
          if (medi) medicamentos.push(...medi);
        });

        this.medicamentos = medicamentos;
      } else {
        this.form.medicamento = null;
        this.medicamentos = [];
      }
    },
    async get_numerodisp() {
      this.form.cantidad = "";
      this.form.cada = "";
      this.form.frecuencia = null;
      this.form.duracion = "";
      this.form.tiempo = null;
      this.form.totalform = "";

      this.items_tabla_entrega = [];
      this.form.copago = "";
      this.form.cuotam = "";
      this.items_tabla_saldos = [];
      this.items_tabla_pendientes = [];

      let agencia = sessionStorage.Sede;
      post
        .postData({
          url: "Dispensa/dlls/PrDispensaN.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          let consec = parseFloat(data[0].nro);
          this.form.consecutivo = consec;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar filas",
            estado: true,
          });
        });
    },
    sgte_paciente() {
      this.contenido_paciente = [];      
      this.dialogodispensa.estado = false;
      this.dialogocargue.estado = false;
    },
    async abrir_dispensacion() {
      let tipocontr = this.form.tipocontr.value;
      if (tipocontr == 1 && !this.form.tipoorden) {
        this.errores.tipoorden = true;
        this.send_error("Seleccione Tipo de orden!");
      } else {
        this.asignar_contrato();
        this.dialogotipocontrato.estado = false;
        this.dialogodispensa.estado = true;

        this.form.idpaciente = parseFloat(this.paciente.identificacion);
        this.form.descrippac = this.paciente.nombres.trim();
        this.form.fecha = this.$moment().format("YYYY-MM-DD");
        this.form.sede = "";
        this.form.idreclama = this.paciente.idreclama_rep;
        this.form.descripreclama = this.paciente.descripreclama_rep;
        this.form.parentezcoreclama = this.paciente.parentezco_rep;
        this.form.telpaciente = this.paciente.telpaciente_rep.trim();
        this.form.direccpaciente = this.paciente.direccionpaciente_rep.trim();
        this.form.barriopaciente = this.paciente.barriopaciente_rep.trim();

        this.form.texttipocontr = this.form.tipocontr.text;
        await this.get_numerodisp();
        this.form.contrato = [];
        this.items_tabla_pendientes = [];
        this.form.autorizacion = null;
        this.form.fechaauto = null;
        this.form.fechamantis = null;
        this.form.nromipres = null;
        this.form.observacciones = null;
        this.form.califica = null;
        this.medicamentos = [];
        this.form.reclama = null;
        this.form.copago = null;
        this.form.cuotam = null;
      }
    },
    validar_paciente() {
      console.log("valida paciente", this.form);
    },
    validarautoriza() {
      console.log("valida autoriza", this.form);
    },
    cerrar_atencion() {
      var data = JSON.parse(JSON.stringify(this.form));
      let tipocontr = data.tipocontr ? data.tipocontr.value : 0;
      let tipoorden = data.tipoorden ? data.tipoorden.value : 0;
      let reclama = data.reclama ? data.reclama.value : 0;

      if (!data.contrato) {
        this.errores.contrato = true;
        this.send_error("Seleccione un Contrato!");
      } else if (!data.telpaciente) {
        this.errores.telpaciente = true;
        this.send_error("Debe registrar Nro Telefono!");
      } else if (!data.direccpaciente) {
        this.errores.direccpaciente = true;
        this.send_error("Debe registrar Direccion del Paciente!");
      } else if (!data.barriopaciente) {
        this.errores.barriopaciente = true;
        this.send_error("Debe registrar un Barrio del Paciente!");
      } else if (tipocontr == 1 && !data.autorizacion) {
        this.errores.autorizacion = true;
        this.send_error("Debe registrar Nro de Autorización");
      } else if (tipocontr == 1 && !data.fechaauto) {
        this.errores.fechaauto = true;
        this.send_error("Seleccione una Fecha de Autorizacion!");
      } else if (!data.fechaformula) {
        this.errores.fechaformula = true;
        this.send_error("Seleccione una Fecha de Fórmula!");
      } else if (tipoorden == 1 && !data.nromipres) {
        this.errores.nromipres = true;
        this.send_error("Debe registrar Nro Mipres");
      } else if (!data.diagnostico) {
        this.errores.diagnostico = true;
        this.send_error("Seleccione un Diagnostico!");
      } else if (!data.ipsremite) {
        this.errores.ipsremite = true;
        this.send_error("Seleccione Ips que Remite!");
      } else if (!data.medremite) {
        this.errores.medremite = true;
        this.send_error("Seleccione Medico que Remite!");
      } else if (reclama == 2 && !data.idreclama) {
        this.errores.idreclama = true;
        this.send_error("Debe registrar Id Reclama");
      } else if (reclama == 2 && !data.descripreclama) {
        this.errores.descripreclama = true;
        this.send_error("Debe registrar nombre Reclama");
      } else if (reclama == 2 && !data.parentezcoreclama) {
        this.errores.parentezcoreclama = true;
        this.send_error("Debe registrar Parentezco");
      } else if (reclama == 2 && !data.telreclama) {
        this.errores.telreclama = true;
        this.send_error("Debe registrar Telefono quien Reclama");
      } else if (!data.califica) {
        this.errores.califica = true;
        this.send_error("Marcar una calificación");
      } else if (this.items_tabla_entrega.length == 0) {
        this.send_error("Sin Medicamentos para dispensar!");
      } else if (!this.form.nroentrega) {
        this.errores.nroentrega = true;
        this.send_error("Nro entrega Obligatoria!");
      } else {
        this.format_envio(data);
        this.dialogo.estado = false;
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = sessionStorage.Sede;
      let cliente = data.contrato.identificacion_rep;
      let nroentrega = data.nroentrega.trim();
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let idpaciente = data.idpaciente;
      let ubicacion = sessionStorage.Sede;
      let contrato = data.contrato.nro_rep;
      let tipocontr = data.tipocontr.value;
      let tipoorden = data.tipoorden ? data.tipoorden.value : 0;
      let direccion = data.direccpaciente.trim();
      let barrio = data.barriopaciente.trim();
      let telefono = data.telpaciente.trim();
      let eps = this.paciente.eps;
      let copago = data.copago ? data.copago.replace(/\,/g, "") : 0;
      let cuotam = data.cuotam ? data.cuotam.replace(/\,/g, "") : 0;
      let años = this.paciente.anosedad_rep;
      let meses = this.paciente.mesesedad_rep;
      let dias = this.paciente.diasedad_rep;
      let dx = data.diagnostico.trim();
      let ipsremite = data.ipsremite;
      let medremite = data.medremite;
      let domicilio = data.domicilio ? "1" : "0";
      let tutela = data.tutela ? "1" : "0";
      let pqr = data.pqr ? "1" : "0";
      let gestante = data.gestante ? "1" : "0";
      let pyp = data.pyp ? "1" : "0";
      let idretira = data.idreclama ? data.idreclama : 0;
      let descretira = data.descripreclama ? data.descripreclama.trim() : "";
      let paciente = data.descrippac.trim();
      let parentezco = data.parentezcoreclama
        ? data.parentezcoreclama.trim()
        : "";
      let telreclama = data.telreclama ? data.telreclama : 0;

      let mipres = data.nromipres ? data.nromipres : 0;
      let fformula = data.fechaformula.replace(/\-/g, "");
      let nroautoriza = data.autorizacion ? data.autorizacion : 0;
      let fautoriza = data.fechaauto ? data.fechaauto.replace(/\-/g, "") : 0;
      let fechamantis = data.fechamantis
        ? data.fechamantis.replace(/\-/g, "")
        : 0;
      let fturno = fecha;
      let agenciaturno = 0;
      let fila = 0;
      let consecturno = 0;
      let detalle = data.observacciones ? data.observacciones.trim() : "";
      let califica = data.califica;

      let tablaEnvio = {};
      this.items_tabla_entrega.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");

        let codigo = item.tab_codigo.trim();
        let lote = item.tab_lote_medicamento.trim();
        let vencelote = item.tab_vence ? item.tab_vence.replace(/\-/g, "") : 0;
        let cum = item.tab_cum.trim();
        let cant_total = parseFloat(item.tab_cantotal);
        let cant_entrega = parseFloat(item.tab_entregado);
        let cant_formula = parseFloat(item.cant_formu);
        let cada_formula = parseFloat(item.cada_formu);
        let frecuencia_formula = parseFloat(item.frecuencia_formu);
        let duracion_formula = parseFloat(item.duracion_formu);
        let tiempo_formula = parseFloat(item.tiempo_formu);
        let cod_med_eps = item.cod_med_eps.trim();

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${codigo}|${cant_total}|${cant_entrega}|${lote}|${vencelote}|${cum}
        |${cant_formula}|${cada_formula}|${frecuencia_formula}|${duracion_formula}|${tiempo_formula}|${cod_med_eps}|`;
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
        idpaciente +
        "|" +
        ubicacion +
        "|" +
        contrato +
        "|" +
        tipocontr +
        "|" +
        tipoorden +
        "|" +
        direccion +
        "|" +
        telefono +
        "|" +
        barrio +
        "|" +
        eps +
        "|" +
        copago +
        "|" +
        cuotam +
        "|" +
        años +
        "|" +
        meses +
        "|" +
        dias +
        "|" +
        dx +
        "|" +
        ipsremite +
        "|" +
        medremite +
        "|" +
        domicilio +
        "|" +
        tutela +
        "|" +
        pqr +
        "|" +
        gestante +
        "|" +
        pyp +
        "|" +
        idretira +
        "|" +
        descretira +
        "|" +
        parentezco +
        "|" +
        telreclama +
        "|" +
        mipres +
        "|" +
        fformula +
        "|" +
        nroautoriza +
        "|" +
        fautoriza +
        "|" +
        fturno +
        "|" +
        agenciaturno +
        "|" +
        fila +
        "|" +
        consecturno +
        "|" +
        califica +
        "|" +
        cliente +
        "|" +
        nroentrega +
        "|" +
        detalle +
        "|" +
        paciente +
        "|" +
        fechamantis +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrDispensa.dll",
        data: { importarhtml, ...tablaEnvio },
        method: "",
        json: true,
      };

      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Dispensación Registrada Correctamente",
            estado: true,
          });
          this.card_estado = false;
          // this.dialogo.estado = false;
          // this.disabled.imprimir = false;
          // this.load.imprimir = false;
          this.comprobante = data[0].nrodsp;
          this.nropte = data[0].nropte;
          this.get_numerodisp();

          this.items_tabla_entrega = [];
          this.form.copago = "";
          this.form.cuotam = "";
          this.disabled.imprimirdsp = false;
          this.disabled.subirpdf = false;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },

    buscar_cedula() {
      this.paciente = [];
      this.contenido_paciente = [];
      this.form.tipocontr = null;
      let paciente = this.form.paciente;
      if (!paciente) {
        this.error.paciente = true;
        this.alerta_error("Debe registrar una identificación");
      } else {
        this.buscar(paciente);
      }
    },
    buscar(paciente) {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClcfpacienteJ.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.paciente = JSON.parse(JSON.stringify(data[0]));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente No Capitado",
            estado: true,
          });
          this.paciente = {};
        });
    },
    asignar_contrato() {
      let tipo_sel = this.form.tipocontr.value;
      this.filtro_tipocontrato = this.contratos.filter(
        (el) => parseFloat(el.tipocontr_rep) == tipo_sel
      );

      let eps = this.paciente.eps;
      this.filtro_eps = this.filtro_tipocontrato.filter((el) => el.eps === eps);
    },
    get_contratos() {
      post
        .postData({
          url: "Dispensa/dlls/PrEnccontratoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.contratos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    get_diagnosticos() {
      post
        .postData({
          url: "datos/base/CIE10.json",
          data: sessionStorage.Sesion + "|",
          method: "GET",
        })
        .then((data) => {
          this.diagnosticos = data.cie10;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    format_contrato(val) {
      return val.descripcion_rep + " - " + val.detalle_rep;
    },
    get_ipsremite() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfipsremiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.ipsremite = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ips",
            estado: true,
          });
        });
    },
    format_ipsremite(val) {
      return val.descrip_rep.trim();
    },
    get_medremite() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfmedremiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.medremite = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Medicos",
            estado: true,
          });
        });
    },
    ver_evento() {
      console.log("evento", this.form.reclama);
    },
    format_medremite(val) {
      return val.descrip_rep.trim();
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
    get_servicios() {
      if (this.form.contrato) {
        this.loader = true;
        let contrato = this.form.contrato.nro_rep;
        post
          .postData({
            url: "Dispensa/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + contrato + "|",
            method: "POST",
          })
          .then((data) => {
            this.loader = false;
            data.forEach((d) => {
              d.servicios.pop();
            });

            this.medicamentosCompletos = data;
            this.selectMedicamento();
            this.validar_paciente();
          })
          .catch((err) => {
            this.loader = false;
            this.load.servicios = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },

    format_medicam(val) {
      return val.descripcion.trim();
    },
    buscar_paciente() {
      let paciente = this.form.idpaciente;
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.descrippac =
            data[0].primerApellido.trim() + " " + data[0].nombres.trim();
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

    async validar_saldo() {
      let ubicacion = "";
      let codigo = "";
      let lote = "";
      let fecha = "";
      post
        .postData({
          url: "Dispensa/dlls/PrvalidasdoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            ubicacion +
            "|" +
            codigo +
            "|" +
            lote +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => ({}))
        .catch((err) => {});
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
<style scoped>
.dialogodispensa {
  border: 2px solid #2196f3; /* Cambia el color y el grosor del borde según tus preferencias */
  border-radius: 50px; /* Ajusta el radio de borde según tus preferencias */
}

.blanco {
  color: white;
}
</style>
