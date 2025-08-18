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
                    Atención Turnos {{ punto_recaudo }}
                  </h3>
                </v-col>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row class="ml-2 justify-center">
          <v-col class="d-flex" cols="5">
            <v-autocomplete
              label="Ventanilla"
              v-model="form.ventanilla"
              :items="ventanillas"
              :item-text="format_ventanilla"
              item-value="cod_rep"
              hide-details
              return-object
              @change="cargarfilas()"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="5">
            <v-autocomplete
              label="Fila Atención"
              v-model="form.fila"
              :items="filas"
              :item-text="format_filas"
              hide-details
              return-object
              @change="cancelaInterval(), select_filtro(0)"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="ml-2 justify-center">
          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.todos"
              hide-details
              label="Ver Todos"
              @change="select_filtro(9)"
            ></v-switch>
          </v-col>

          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.espera"
              hide-details
              label="Solo en Espera"
              @change="select_filtro(0)"
            ></v-switch>
          </v-col>

          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.noresponde"
              hide-details
              label="Solo No Responde"
              @change="select_filtro(5)"
            ></v-switch>
          </v-col>

          <v-col class="d-flex" cols="3">
            <v-switch
              v-model="form.atendidos"
              hide-details
              label="Solo Atendidos"
              @change="select_filtro(2)"
            ></v-switch>
          </v-col>

          <!-- <v-col class="d-flex" cols="5">
            <v-autocomplete
              label="Voces"
              v-model="form.voces"
              :items="voices"
              :item-text="format_voces"
              hide-details
              return-object
            ></v-autocomplete>
          </v-col> -->
        </v-row>

        <v-row class="ml-2 justify-center">
          <v-col class="d-flex" cols="12">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
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
              item-key="identificacion"
              :search="search"
            >
              <template v-slot:item.idpaciente_rep="{ item }">
                {{ parseInt(item.idpaciente_rep) }}
              </template>

              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="item.estado_rep == '2' ? true : false"
                      class="mr-4"
                      color="success"
                      fab
                      small
                      icon
                      v-on="on"
                      outlined
                      @click="atender(item, 1, 0)"
                    >
                      <v-icon>mdi-bell-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Llamar Paciente</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="mr-4"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                      outlined
                      @click="abrir_atencion(item)"
                      :disabled="item.estado_rep == '2' ? true : false"
                    >
                      <v-icon>mdi-spellcheck</v-icon>
                    </v-btn>
                  </template>
                  <span>Turno Atendido</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="mr-4"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                      outlined
                      @click="iniciar_dispensacion(item)"
                    >
                      <v-icon>mdi-pill</v-icon>
                    </v-btn>
                  </template>
                  <span>Dispensar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="mr-4"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                      outlined
                      @click="atender(item, 4, 9)"
                      :disabled="item.estado_rep == '2' ? true : false"
                    >
                      <v-icon>mdi-account-remove</v-icon>
                    </v-btn>
                  </template>
                  <span>No Responde</span>
                </v-tooltip>
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="600px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Total Dispensado</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Cantidad"
                clearable
                type="text"
                required
                v-model="form.totaldisp"
                :error="errores.totaldisp"
                @input="errores.totaldisp = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-btn
              class="ma-2 white--text"
              color="red"
              text
              @click="dialogo.estado = false"
              >Cancelar</v-btn
            >
            <v-btn
              class="ma-2 white--text"
              color="indigo"
              depressed
              large
              @click="turno_atendido()"
              >Guardar</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Eps"
                hide-details
                clearable
                v-model="form.epspaciente"
                disabled
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Contrato"
                disabled
                hide-details
                clearable
                v-model="form.contrpaciente"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Regimen"
                disabled
                hide-details
                clearable
                v-model="form.regimpaciente"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                :label="labelNivel"
                disabled
                hide-details
                clearable
                v-model="form.nivelpaciente"
              ></v-text-field>
            </v-col>
          </v-row>

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
            <v-col class="d-flex" cols="3">
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
                  @change="validarfecha()"
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
                :loading="card_estado"

                color="light-blue accent-4 white--text"
                class
                @click="get_servicios(), get_diagnosticos(), get_ipsremite(), get_medremite()"
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
                </template>
                <template v-slot:item="{ item }">
                  <div
                    :style="{
                      color: parseFloat(item.cant_rep) > 0 ? 'blue' : 'black',
                    }"
                  >
                    {{ format_medicam(item) }}
                  </div>
                </template>
              </v-autocomplete>
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
                @change="validar_total()"
                id="totalform"
                hide-details
                ><template v-slot:label>
                  <span class="color-personalizado">T. Solicitado</span>
                </template></v-text-field
              >
            </v-col>
          </v-row>
          <v-row class="ml-2 justify-center">
            <v-col cols="3" align="center">
              <v-chip
                variant="flat"
                color="purple"
                class="white--text"
                @click="get_otros()"
                depressed
                size="x-large"
                density="comfortable"
              >
                Saldo Otros Puntos
              </v-chip>
            </v-col>
          </v-row>

          <v-row class="ml-2 justify-center">
            <v-col cols="12" align="center">
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
                  <hr color="red" />
                </template>
              </v-data-table>
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

    <v-dialog
      max-width="1000"
      v-model="dialogotipocontrato.estado"
      transition="dialog-bottom-transition"
    >
      <template>
        <v-card class="mt-3 px-6">
          <v-toolbar
            class="mt-1 px-6"
            color="primary"
            title="Opening from the bottom"
          >
            <span class="blanco">Seleccione el Tipo de Contrato</span>
          </v-toolbar>
          <v-card-text>
            <v-row class="d-flex justify-center">
              <v-col class="mt-3 d-flex" cols="8">
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
            <v-row class="justify-center">
              <v-card-actions class="justify-center">
                <v-btn color=" red white--text" @click="cancela_tipo()"
                  >Cancelar</v-btn
                >
                <v-btn color="indigo white--text" @click="abrir_dispensacion()"
                  >Continuar</v-btn
                >
              </v-card-actions>
            </v-row>

            <v-row class="justify-center">
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
              >
                <template v-slot:item.consec_rep="{ item }">
                  {{ parseInt(item.consec_rep) }}
                </template>
              </v-data-table>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog max-width="1000" v-model="dialogocargue.estado">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          color="surface-variant"
          text="Open Dialog"
          variant="flat"
        ></v-btn>
      </template>

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
                  color="purple"
                  class="white--text px-12"
                  depressed
                  @click="subir_pdf"
                >
                  Grabar Soporte
                </v-btn>
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />

            <v-row justify="center" class="d-flex mt-2">
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

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <!-- <v-dialog v-model="dialogocargue1.estado" max-height="1000">
      <v-card
        class="px-6"
        :loading="card_estado"
        :disabled="card_estado"
        width="400"
      >
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

            <v-col class="mb-3 d-flex justify-center" cols="6">
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
     -->
    <v-dialog v-model="dialogosaldos.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Saldo en otros Puntos</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col>
              <v-data-table
                :headers="tablaSaldos.headers"
                :items="tablaSaldos.datos"
                item-key="docinter_rep"
                single-expand
              >
              </v-data-table>
            </v-col>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex justify-center" cols="6">
              <v-btn
                color="red accent-4"
                class="white--text"
                depressed
                @click="dialogosaldos.estado = false"
              >
                Cerrar
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
      g_total: 0,
      expanded: [],
      contenido: [],
      ventanillas: [],
      diagnosticos: [],
      contratos: [],
      labelNivel: "Nivel",
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

      cargue_soporte: 0,

      dialogocargue1: {
        estado: true,
        titulo: null,
        tipo: null,
      },
      dialogocargue: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogosaldos: {
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
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Dispensación", align: "center", value: "consec_rep" },
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
        tipocargue: false,
        descripreclama: false,
        parentezcoreclama: false,
        telreclama: false,
        califica: false,
        pdf: false,
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
        gtotal: 0,
        reclama: null,
        tipocontr: null,
      },
      intervalo: null,

      selectedVoice: null,
      voices: [],

      card_estado: false,
      tablaSaldos: {
        headers: [
          { text: "Agencia", align: "left", value: "ubicacion_rep" },
          { text: "Descripción", align: "left", value: "descripprod_rep" },
          { text: "Cum", align: "left", value: "cum_rep" },
          { text: "Lote", align: "left", value: "lote_rep" },
          { text: "Vence", align: "left", value: "vence_rep" },
          { text: "Cantidad", value: "cant_rep", align: "center" },
        ],
        datos: [],
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Turno", align: "center", value: "consec_rep", sortable: true },
        { text: "Fila", align: "left", value: "descrip_rep" },
        { text: "SubFila", align: "left", value: "descripsubfila_rep" },
        { text: "Hora turno", align: "center", value: "horaturno_rep" },
        { text: "Entidad", align: "center", value: "descripeps_rep" },

        { text: "Paciente", align: "left", value: "paciente_rep" },
        { text: "Id_Paciente", align: "center", value: "idpaciente_rep" },
        { text: "Tiempo Espera", align: "center", value: "tiempoespera_rep" },
        { text: "Funcionario", align: "left", value: "usuario_rep" },

        { text: "Opciones", value: "action", align: "center" },
        { text: "Estado", align: "left", value: "descestado_rep" },
      ],
    };
  },
  watch: {
    items_tabla_entrega: function (newVal) {
      let copago = 0;
      this.form.cuotam = 0;
      this.form.copago = 0;

      const _this = this;
      _this.g_total = 0;

      newVal.forEach((el) => {
        let total =
          parseFloat(el.tab_vlrtotal.toString().replace(/\,/g, "")) || 0;
        _this.g_total += total;
      });
      if (this.items_tabla_entrega) {
        // console.log("itemselec",this.itemselec)
        // this.itemselec.nivel_rep = 1
        // this.itemselec.nomregimen = "Contributivoxxx"

        if (this.itemselec.nomregimen === "Contributivo") {
          if (this.itemselec.categoria_rep == "A") {
            copago = 4500;
          } else if (this.itemselec.categoria_rep == "B") {
            copago = 18200;
          } else if (this.itemselec.categoria_rep == "C") {
            copago = 47700;
          }
          this.form.cuotam = copago;
          this.form.copago = 0;
        } else {
          if (this.itemselec.nivel_rep == 0) {
            copago = 0;
          } else if (this.itemselec.nivel_rep == 1) {
            copago = (_this.g_total * 11.5) / 100;
          } else if (this.itemselec.nivel_rep == 2) {
            copago = (_this.g_total * 17.3) / 100;
          } else if (this.itemselec.nivel_rep == 3) {
            copago = (_this.g_total * 23) / 100;
          }
          copago = copago.toFixed(0);
          _this.g_total = copago;
          this.form.cuotam = 0;
          this.form.copago = copago;
        }
      }
    },
  },
  created() {
    clearInterval(this.intervalId);
    this.get_empresa();
    // this.get_molecula();
    this.cargarventanillas();
    this.get_ipsremite();
    this.get_medremite();
    this.loadVoices();
    this.tipo_timer = 0;
    this.timer_ini = true;
    this.get_contratos();
    this.get_diagnosticos();

    // this.startTimer();
  },
  computed: {},
  methods: {
    get_otros() {
      this.loader = true;
      let molecula = this.form.molecula.codigo;
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.tablaSaldos.datos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpSaldos5J.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            "0" +
            "|" +
            molecula +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.tablaSaldos.datos = data;
          if (this.tablaSaldos.datos) {
            this.dialogosaldos.estado = true;
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Sin saldo en otros Puntos",
            estado: true,
          });
        });
    },
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
      let tipo = this.form.tipocontr.value;
      if (this.itemselec.evento_rep == 1 && tipo == 2) {
        this.send_error("Atención solo por evento!");
      } else {
        this.contenido_paciente = [];
        this.loader = true;
        let paciente = this.itemselec.idpaciente_rep;
        post
          .postData({
            url: "Dispensa/dlls/PrDispensa05J.DLL",
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
      }
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
      if (!this.form.tipodocum) {
        this.errores.tipocargue = true;
        this.send_error("Seleccione Tipo de Documento!");
      } else if (!this.form.pdf) {
        this.errores.pdf = true;
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        this.card_estado = true;

        let session = sessionStorage.Sesion;
        let agencia = this.form.ventanilla.agencia_rep;
        let empresa = this.empresa.descrip_empr.trim();
        let cargue_pdf = this.form.pdf.name;
        let consec = parseFloat(this.comprobante);
        let clasif = this.form.tipodocum.value;
        let consecpte = 0;
        let agcpte = 0;
        let codigo = "";
        let tipodoc = "02";
        let nombre_pdf =
          "DSP_" + agencia + "_" + consec + "_" + clasif + ".pdf";

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
          "https://server1ts.net//financiero/inc/api_titan/dispensa.php",
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
        this.marcar_cargue(agencia, consec, clasif);
      }
    },
    marcar_cargue(agencia, consec, clasif) {
      this.card_estado = true;
      let nombre_pdf = "DSP_" + agencia + "_" + consec + "_" + clasif + ".pdf";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensaD.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            consec +
            "|" +
            clasif +
            "|" +
            nombre_pdf +
            "|",
          method: "",
        })
        .then((data) => {
          this.card_estado = false;
        })
        .catch((err) => {
          this.card_estado = false;
        });
    },
    async get_impresion() {
      let agencia = this.form.ventanilla.agencia_rep;
      let consecutivo = this.comprobante;
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

          // if (data.id_paciente) {
          //   let idelabora = data.idelabora.trim();
          //   let firma_src = require(`../../assets/image/firmas/vacio.png`);
          //   let firma = await this.pdfs.getBase64(firma_src);

          //   data.firma = firma;
          // }

          let firma_src = "";

          try {
            let idelabora = data.idelabora.trim();
            firma_src = require(`../../assets/image/firmas/${idelabora}.png`);
          } catch (err) {
            firma_src = require(`../../assets/image/firmas/vacio.png`);
          } finally {
            let firma = await this.pdfs.getBase64(firma_src);
            data.firma = firma;
          }

          const logo = await this.pdfs.getBase64(logo_src);
          data.logo = logo;

          if (data.agencia_rep) {
            if (this.form.tipocontr.value == 1) {
              await dispensacion(data);
            }
            await dispensacion_pos(data);
            let recibido = parseFloat(data.vlr_recibido);
            if (recibido > 0) {
              await copago_pos(data);
            }
          }
          datosEnvio = sessionStorage.Sesion + "|" + this.nropte + "|";
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
              this.send_error("Sin Pendientes !");
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

      var datosEnvio = sessionStorage.Sesion + "|" + consecutivo + "|";
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

      this.itemselec = item;
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.dialogotipocontrato.estado = true;
    },
    add_medicamento(item) {
      console.log(this.form.medicamento);

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
        let tipocontr = this.form.tipocontr.value;

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
          let vrl_unitario = 0;
          let cum_cto = this.form.medicamento.cumcto.trim();
          let cum_eps = this.form.medicamento.cumeps.trim();
          if (cum_cto == "undefined" || cum_cto == "") {
            this.form.medicamento.cumcto = item.cum_rep;
          }
          if (cum_eps == "undefined" || cum_eps == "") {
            this.form.medicamento.cumeps = item.cum_rep;
          }

          {
            if (tipocontr == 2) {
              vrl_unitario = parseFloat(this.form.medicamento.costo_rep.trim());
            } else {
              vrl_unitario = parseFloat(this.form.medicamento.valor_rep.trim());
            }
            let vlr_total = cant_entregado * vrl_unitario;

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
              tab_cumcto: this.form.medicamento.cumcto,
              tab_cumeps: this.form.medicamento.cumeps,
              tab_costo: this.form.medicamento.costo_rep,
              tab_vlrtotal: vlr_total,
              cant_formu: this.form.cantidad.trim(),
              cada_formu: this.form.cada.trim(),
              frecuencia_formu: this.form.frecuencia,
              duracion_formu: this.form.duracion,
              tiempo_formu: this.form.tiempo,
              cod_med_eps: "",
            });
          }
          // console.log("aad_2", this.items_tabla_entrega);

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

      // console.log(cant_solicitado, this.form.totalform);
    },
    borrar_medic(item) {
      const index = this.items_tabla_entrega.indexOf(item);
      this.items_tabla_entrega.splice(index, 1);
    },
    get_saldo() {
      let medicamento = this.form.medicamento.codigo.trim();
      let agencia = sessionStorage.Sede;
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.items_tabla_saldos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpSaldodsp1J.dll",
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
    get_medicamento() {
      if (this.form.molecula) {
        let molecula = this.form.molecula.codigo;
        let contrato = this.form.contrato.nro_rep;
        let ubicacion = this.form.ventanilla.ubicacion_rep;
        this.form.medicamento = null;
        this.medicamentos = [];
        post
          .postData({
            url: "Dispensa/dlls/PrDispensa03J.DLL",
            data:
              sessionStorage.Sesion +
              "|" +
              molecula +
              "|" +
              contrato +
              "|" +
              ubicacion +
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
      }
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
    abrir_atencion(item) {
      this.itemselec = item;
      this.dialogo.estado = true;
      this.form.totaldisp = "1";
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

      let agencia = this.form.ventanilla.agencia_rep;
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
    cancela_tipo() {
      this.dialogotipocontrato.estado = false;
      this.startTimer();
    },
    sgte_paciente() {
      if (this.cargue_soporte == 0) {
        this.send_error("Soporte sin Cargar!");
      }

      this.dialogodispensa.estado = false;
      this.dialogocargue.estado = false;
      this.startTimer();
    },
    async abrir_dispensacion() {
      let tipo = this.form.tipocontr.value;

      this.cargue_soporte = 0;
      let tipocontr = this.form.tipocontr.value;
      if (tipocontr == 1 && !this.form.tipoorden) {
        this.errores.tipoorden = true;
        this.send_error("Seleccione Tipo de orden!");
      } else if (this.itemselec.evento_rep == 1 && tipo == 2) {
        this.send_error("Atención solo por evento!");
      } else {
        this.asignar_contrato();
        this.dialogotipocontrato.estado = false;
        this.dialogodispensa.estado = true;

        this.form.idpaciente = parseFloat(this.itemselec.idpaciente_rep);
        this.form.descrippac = this.itemselec.paciente_rep.trim();
        this.form.fecha = this.$moment().format("YYYY-MM-DD");
        this.form.sede = this.form.ventanilla.descragencia_rep.trim();
        this.form.idreclama = this.itemselec.idreclama_rep;
        this.form.descripreclama = this.itemselec.descripreclama_rep;
        this.form.parentezcoreclama = this.itemselec.parentezco_rep;
        this.form.telpaciente = this.itemselec.telpaciente_rep.trim();
        this.form.direccpaciente = this.itemselec.direccionpaciente_rep.trim();
        this.form.barriopaciente = this.itemselec.barriopaciente_rep.trim();
        this.form.epspaciente = this.itemselec.descripeps_rep;
        this.form.contrpaciente = parseFloat(this.itemselec.contrato_rep);
        this.form.regimpaciente = this.itemselec.nomregimen;

        if (tipocontr == 1) {
          this.labelNivel = "Categoria";
          this.form.nivelpaciente = this.itemselec.categoria_rep;
        } else {
          this.labelNivel = "Nivel";
          this.form.nivelpaciente = this.itemselec.nivel_rep;
        }

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
    validarfecha() {
      if (this.form.fechaformula > this.form.fecha) {
        this.send_error("Error en fecha de la Fórmula!");
      }
    },
    validar_total() {
      if (this.form.totalform > 999) {
        this.send_error("Error en Cantidad Formulada");
        this.errores.totalform = true;
      } else this.errores.totalform = false;
    },
    turno_atendido() {
      this.dialogo.estado = false;
      this.atender(this.itemselec, 2, 0);
      this.buscar_turnos(0);
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
      } else if (data.fechaformula > data.fecha) {
        this.send_error("Error en fecha de la Fórmula!");
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
      } else if (!data.reclama) {
        this.errores.reclama = true;
        this.send_error("Seleccione quien realiza el retiro!");
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
      let agencia = data.ventanilla.agencia_rep;
      let cliente = data.contrato.identificacion_rep;
      let nroentrega = data.nroentrega.trim();
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let idpaciente = data.idpaciente;
      let ubicacion = data.ventanilla.ubicacion_rep;
      let contrato = data.contrato.nro_rep;
      let tipocontr = data.tipocontr.value;
      let tipoorden = data.tipoorden ? data.tipoorden.value : 0;
      let direccion = data.direccpaciente.trim();
      let barrio = data.barriopaciente.trim();
      let telefono = data.telpaciente.trim();
      let eps = this.itemselec.eps_rep;
      let copago = data.copago ? data.copago.replace(/\,/g, "") : 0;
      let cuotam = data.cuotam ? data.cuotam.replace(/\,/g, "") : 0;
      let años = this.itemselec.anosedad_rep;
      let meses = this.itemselec.mesesedad_rep;
      let dias = this.itemselec.diasedad_rep;
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
      let agenciaturno = this.itemselec.agencia_rep;
      let fila = this.itemselec.cod_rep;
      let consecturno = this.itemselec.consec_rep;
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
        let cumcto = item.tab_cumcto.trim();
        let cumeps = item.tab_cumeps.trim();
        // let costo = item.tab_costo.trim();
        let valor_total = item.tab_vlrtotal;

        tablaEnvio[
          `DATOJ-${format_index}`
        ] = `${codigo}|${cant_total}|${cant_entrega}|${lote}|${vencelote}|${cum}
        |${cant_formula}|${cada_formula}|${frecuencia_formula}|${duracion_formula}
        |${tiempo_formula}|${cod_med_eps}|${cumcto}|${cumeps}|${valor_total}`;
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
          this.atender(this.itemselec, 2, 9);
          // this.dialogo.estado = false;
          // this.disabled.imprimir = false;
          // this.load.imprimir = false;
          this.comprobante = data[0].nrodsp;
          this.nropte = data[0].nropte;
          this.get_numerodisp();

          this.items_tabla_entrega = [];
          this.form.copago = "";
          this.form.cuotam = "";
          this.form.diagnostico = null;
          this.form.ipsremite = null;
          this.form.medremite = null;

          this.disabled.imprimirdsp = false;
          this.disabled.subirpdf = false;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    // this.atender(this.itemselec, 2);
    startTimer() {
      const interval = 10000;
      this.intervalId = setInterval(() => {
        this.select_filtro(this.tipo_timer);
      }, interval);
      this.timer_ini = false;
    },
    buscar_turnos(tipo) {
      let fila = this.form.fila.cod_rep;
      let agencia = sessionStorage.Sede;
      post
        .postData({
          url: "Dispensa/dlls/PrturnosJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fila +
            "|" +
            agencia +
            "|" +
            tipo +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          if (err.Code == 3) {
            this.beforeDestroy();
            this.logout();
          }

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Turnos",
            estado: true,
          });
        });
    },
    logout() {
      let ruta = null;
      let data_auth = sessionStorage.data_auth
        ? JSON.parse(atob(sessionStorage.data_auth))
        : false;
      if (!data_auth) {
        ruta = "/";
      } else if (data_auth && data_auth?.modulo === "rc")
        ruta = { name: "loginrc" };
      else if (data_auth && data_auth?.modulo === "tr")
        ruta = { name: "logintr" };
      else if (data_auth && data_auth?.modulo === "pr")
        ruta = { name: "loginpr" };
      else if (data_auth && data_auth?.modulo === "resmed")
        ruta = { name: "Loginresmerakids" };

      sessionStorage.clear();
      this.$router.push(ruta);
    },
    cancelaInterval() {
      clearInterval(this.intervalId);
      this.startTimer();
    },
    select_filtro(tipo) {
      this.tipo_timer = tipo;
      this.timer_ini = +1;
      if (tipo == 9) {
        this.form.noresponde = false;
        this.form.espera = false;
        this.form.atendidos = false;
        this.buscar_turnos(tipo);
      } else if (tipo == 0) {
        this.form.espera = true;
        this.form.noresponde = false;
        this.form.todos = false;
        this.form.atendidos = false;
        this.buscar_turnos(tipo);
      } else if (tipo == 5) {
        this.form.espera = false;
        this.form.todos = false;
        this.form.atendidos = false;
        this.buscar_turnos(tipo);
      } else if (tipo == 2) {
        this.form.espera = false;
        this.form.todos = false;
        this.form.noresponde = false;
        this.buscar_turnos(tipo);
      }
    },
    loadVoices() {
      this.voices = window.speechSynthesis.getVoices();
    },
    format_voces(val) {
      return `${val.name}`;
    },
    atender(item, tipo, evento) {
      let agenciatr = item.agencia_rep;
      let codtr = item.cod_rep;
      let idtr = item.consec_rep;
      let agenciavt = this.form.ventanilla.agencia_rep;
      let idvt = this.form.ventanilla.cod_rep;
      let total = this.form.totaldisp ? this.form.totaldisp.trim() : 1;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/Prfilaturno01.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agenciatr +
            "|" +
            codtr +
            "|" +
            idtr +
            "|" +
            agenciavt +
            "|" +
            idvt +
            "|" +
            tipo +
            "|" +
            total +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          if (evento == 9) {
            evento = 0;
          } else {
            let mensaje = "En llamado";
            if (tipo == 4) {
              mensaje = "No Responde";
            }
            this.$emit("snack", {
              color: "success",
              text: mensaje,
              estado: true,
            });
            this.buscar_turnos(9);
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al llamar Turno",
            estado: true,
          });
        });
    },

    asignar_contrato() {
      let eps = this.itemselec.eps_rep;
      let tipo_sel = this.form.tipocontr.value;

      this.filtro_tipocontrato = this.contratos.filter(
        (el) => parseFloat(el.tipocontr_rep) == tipo_sel
      );

      this.filtro_eps = this.filtro_tipocontrato.filter(
        (el) => el.eps_rep === eps
      );

      if (this.filtro_eps.length == 0 && eps == "EPSC34") {
        eps = "EPSS34";
        this.filtro_eps = this.filtro_tipocontrato.filter(
          (el) => el.eps_rep === eps
        );
      }

      if (this.filtro_eps.length == 0 && eps == "EPS017") {
        eps = "EPSS17";
        this.filtro_eps = this.filtro_tipocontrato.filter(
          (el) => el.eps_rep === eps
        );
      }
      
      if (this.filtro_eps.length == 0 && eps == "EPSS17") {
        eps = "EPS017";
        this.filtro_eps = this.filtro_tipocontrato.filter(
          (el) => el.eps_rep === eps
        );
      }
      

      if (
        eps == "EPSS34" ||
        eps == "EPS017" ||
        eps == "EPS002" ||
        eps == "RES004" ||
        eps == "SAN002" ||
        eps == "IPS003"
      ) {
        console.log("tipo_sel", this.filtro_eps);
      } else {
        if (tipo_sel == 2) {
          console.log(
            "this.itemselec.contrato_rep",
            this.itemselec.contrato_rep
          );

          let contrato = parseFloat(this.itemselec.contrato_rep);
          this.filtro_eps = this.filtro_eps.filter(
            (el) => parseFloat(el.nrocontrato_rep) === contrato
          );
        }
      }
    },
    get_contratos() {
      post
        .postData({
          url: "Dispensa/dlls/PrEnccontratoJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|" + "" + "|" + 0 + "|",
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
          // url: "datos/base/CIE10.json",
          url: "datos/base/CIE10V2.json",

          // url: "Clinico/dlls/CfCie10J.dll",
          data: sessionStorage.Sesion + "|",
          // method: "POST",
          method: "GET",
        })
        .then((data) => {
          this.diagnosticos = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
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
      this.card_estado = true;
      post
        .postData({
          url: "Dispensa/dlls/CfmedremiteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.card_estado = false;
          this.medremite = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.card_estado = false;
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
    // get_molecula() {
    //   post
    //     .postData({
    //       url: "Dispensa/dlls/CfAgrpmoleculaJ.dll",
    //       data: sessionStorage.Sesion + "|" + "0" + "|",
    //       method: "",
    //     })
    //     .then((data) => {
    //       data.pop();
    //       this.moleculas = JSON.parse(JSON.stringify(data));
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.$emit("snack", {
    //         color: "error",
    //         text: "Error al cargar Agrp_Moleculas",
    //         estado: true,
    //       });
    //     });
    // },
    format_moleculas(val) {
      return `${val.descmolecula_rep.trim()}`;
    },
    get_servicios() {
      if (this.form.contrato) {
        this.loader = true;
        let contrato = this.form.contrato.nro_rep;
        post
          .postData({
            url: "Dispensa/dlls/PrCarguecttosJ.dll",
            data: sessionStorage.Sesion + "|" + contrato + "|",
            method: "POST",
          })
          .then((data) => {
            this.loader = false;
            data = data[0];
            data.servicios.pop();

            this.moleculas = data.servicios;
            //            this.selectMedicamento();
            //            this.validar_paciente();
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
    cargarventanillas() {
      let sede = sessionStorage.Sede;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfVentanillaJ.dll",
          data: sessionStorage.Sesion + "|" + sede + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.ventanillas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ventanillas",
            estado: true,
          });
        });
    },
    cargarfilas() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CffilaturnoJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.filas = JSON.parse(JSON.stringify(data));
          this.filas.unshift({
            cod_rep: "0",
            descrip_rep: "Todas",
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Filas",
            estado: true,
          });
        });
    },
    format_ventanilla(val) {
      return `${val.descrip_rep}`;
    },
    format_filas(val) {
      return `${val.descrip_rep}`;
    },
    format_medicam(val) {
      return `${val.descripcion} - Saldo: ${val.cant_rep.trim()}`;
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
