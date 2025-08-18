<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-send-check-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Entrega Pendientes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Sede"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  clearable
                  hide-details
                  outlined
                  return-object
                  @change="errores.puntos = false"
                  :error="errores.puntos"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col>
                <v-btn
                  color="indigo darken-3 white--text"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="consultar_reporte"
                  :loading="btnEnvio.loader"
                  :disabled="btnEnvio.disabled"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>

              <v-col>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.ressede"
                  @change="seleccion_resumen(1)"
                  hide-details
                  label="Resumen por Agencia"
                ></v-switch>
              </v-col>
            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="form.ressede"
            >
              <v-col cols="12">
                <canvas id="grafico1"></canvas>
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

            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
              :search="search"
            >
              <template v-slot:item.consecdisp_rep="{ item }">
                {{ parseInt(item.consecdisp_rep) }}
              </template>
              <template v-slot:item.idpac_rep="{ item }">
                {{ parseInt(item.idpac_rep) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printdisp_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Acta de Entrega</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="registrar_item(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-clipboard-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Registrar Pendiente</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printdispos_item(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-printer-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Entrega</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printpend_item(item, 1)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-cloud-print-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Pendientes</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="item.idsoporte_rep.trim() == ''"
                      @click="downloadFile(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Soportes</span>
                </v-tooltip>

                <!-- <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_file(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-cloud-arrow-up-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir Soportes</span>
                </v-tooltip> -->
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <!-- <v-dialog v-model="dialogocargue.estado" persistent max-width="900px">
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
                  // { text: 'Tirilla Pendientes', value: 2 },
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
            <v-col class="d-flex justify-end">
              <v-btn
                color="purple"
                class="white--text px-12"
                depressed
                large
                @click="subir_pdf"
              >
                Grabar Soporte
              </v-btn>
            </v-col>

            <v-col class="d-flex justify-end">
              <v-btn
                color="red accent-4"
                class="white--text px-12"
                depressed
                large
                @click="dialogocargue.estado = false"
              >
                Cerrar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog> -->

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
              <v-col class="d-flex justify-end">
                <v-btn
                  color="red accent-4"
                  class="white--text px-12"
                  depressed
                  large
                  @click="dialogocargue.estado = false"
                >
                  Cerrar
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

            <!-- <v-col class="d-flex" cols="3">
              <v-text-field
                label="Nro Mipres"
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
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Diagnostico"
                v-model="form.dx"
                hide-details
                :error="errores.dx"
                @input="errores.dx = false"
                clearable
              ></v-text-field>
            </v-col> -->
          </v-row>

          <!-- <v-row class="d-flex">
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Nro Autorizacion"
                hide-details
                clearable
                v-model="form.nroautoriza"
                :error="errores.nroautoriza"
                @input="errores.nroautoriza = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickeFechapte"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaPte"
                    label="Fecha Pendiente"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaPte"
                  @input="pickeFechapte = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row> -->

          <v-row>
            <v-col class="d-flex" cols="10">
              <v-text-field
                label="Contrato"
                hide-details
                v-model="form.contrato"
                disabled
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row> </v-row>

          <v-row class="ml-2 justify-center">
            <v-data-table
              :headers="headers_tabla_pendientes"
              :items="items_tabla_pendientes"
            >
            </v-data-table>
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

          <v-row class="ml-4 justify-center">
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Observaciones"
                hide-details
                v-model="form.observacciones"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-col class="d-flex" cols="12">
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1.5px', 'border-color': 'orange' }"
            />
          </v-col>
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
                <hr color="red" />
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
            <v-col class="d-flex" cols="12">
              <v-divider color="orange"></v-divider>
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
          class="d-flex ml-2"
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
        <v-spacer></v-spacer>
        <v-row> </v-row>
        <v-row class="d-flex ml-2 justify-end">
          <v-card-actions>
            <v-btn
              class="ma-2 white--text"
              color="red"
              text
              @click="dialogodispensa.estado = false"
              >Regresar</v-btn
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
                @click="get_file(1)"
              >
                Subir soporte
                <v-icon>mdi-cloud-arrow-up-outline</v-icon>
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-dialog>
    <!-- <v-dialog
      v-model="dialogotipocontrato.estado"
      transition="dialog-bottom-transition"
      width="600"
    >
      <template>
        <v-card class="mt-3 px-6">
          <v-toolbar color="primary" title="Opening from the bottom">
            <span class="blanco">Seleccione el Tipo de Contrato</span>
          </v-toolbar>
          <v-row class="justify-center">
            <v-col class="d-flex" cols="8">
              <v-select
                :items="itemstiposerv"
                label="Tipo Contrato"
                clearable
                hide-details
                return-object
                v-model="form.tipocontr"
                item-text="text"
                item-value="value"
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
                :items="itemstipocontr"
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
            <v-btn color=" red white--text" @click="cancela_tipo()"
              >Cancelar</v-btn
            >

            <v-btn color="indigo white--text" @click="abrir_dispensacion()"
              >Continuar</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog> -->

    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";
import { dispensacion } from "../../_formatos_disp.js";
import { dispensacion_pos } from "../../_formatos_disp.js";
import { pendientes_pos } from "../../_formatos_disp.js";


export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      pickerFechaauto: false,
      pickerFechaformula: false,
      pickeFechapte: false,

      pterad: null,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      convenios: [],
      ptosrecaudo: [],
      empresa: [],
      diagnosticos: [],
      contratos: [],
      filtro_tipocontrato: [],
      filtro_eps: [],
      ipsremite: [],
      medremite: [],
      medicamentosCompletos: [],
      medicamentos: [],
      moleculas: [],
      items_tabla_saldos: [],
      items_tabla_entrega: [],
      items_tabla_pendientes: [],
      ventanillas: [],

      itemselec: null,

      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
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

      dialogocargue: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
        espera: true,
        noresponde: false,
        atendidos: false,
        todos: false,
        descrippac: null,
        consecutivo: 0,
        frecuencia: null,
        duracion: null,
        dx: null,
        nromipres: null,
        reclama: null,
        totalform: 0,
        tipocontr: null,
        tipoorden: null,
      },
      datopte: [],
      disabled: {
        imprimirdsp: true,
        subirpdf: true,
        guardar: false,
      },

      itemstiposerv: [
        { text: "Capitado", value: 2 },
        { text: "Evento", value: 1 },
      ],
      itemstipocontr: [
        { text: "Mipres", value: 1 },
        { text: "Voucher", value: 2 },
        { text: "Masiva", value: 3 },
      ],

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
        { text: "Entregado", align: "center", value: "tab_entregado" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      headers_tabla_pendientes: [
        {
          text: "Medicamentos Pendientes",
          align: "left",
          value: "descripcion_rep",
        },
        { text: "Cantidad", align: "center", value: "cantidad_rep" },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Consecutivo", align: "center", value: "consecdisp_rep" },
        { text: "Paciente", align: "center", value: "descrpaciente_rep" },
        { text: "Id Paciente", align: "center", value: "idpac_rep" },
        { text: "Dispensa", align: "center", value: "elabora_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        puntos: false,
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
        tiempo: false,
        totalform: false,
        tipoorden: false,
        contrato: false,
        nromipres: false,
        idreclama: false,
        reclama: false,
        descripreclama: false,
        parentezcoreclama: false,
        telreclama: false,
        califica: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.get_empresa();
    this.cargaragencias();
    this.get_molecula();
    this.get_contratos();
    this.cargarventanillas();
  },
  methods: {
    async registrar_item(item) {
      this.itemselec = item;
      this.intervalId = null;
      await this.printpend_item(item, 2);
    },
    cancela_tipo() {
      this.dialogotipocontrato.estado = false;
    },
    get_medicamento() {
      let molecula = this.form.molecula.codigo_rep;
      let contrato = this.form.contrato.nro_rep;
      let ubicacion = this.ventanillas[0].agencia_rep;
      this.medicamentos = [];
      post
        .postData({
          url: "Dispensa/dlls/RpSaldopte1J.DLL",
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
    async abrir_dispensacion() {
      this.getpend_item();
      // this.asignar_contrato();
      this.dialogotipocontrato.estado = false;
      this.dialogodispensa.estado = true;
      this.form.idpaciente = parseFloat(this.itemselec.idpac_rep);
      this.form.descrippac = this.itemselec.descrpaciente_rep.trim();
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
      this.form.sede = this.ventanillas[0].descragencia_rep.trim();
      this.form.telpaciente = this.itemselec.telpaciente_rep.trim();
      this.form.direccpaciente = this.itemselec.direccionpaciente_rep.trim();
      this.form.molecula = null;
      await this.get_numerodisp();
      let nrocto = parseFloat(this.datopte[0].contrato);

      let busqueda_contrato = this.contratos.find(
        (el) => parseFloat(el.nro_rep) == nrocto
      );
      this.form.contrato = busqueda_contrato.descripcion_rep;

      this.items_tabla_pendientes = [];
      this.form.fechaauto = null;
      this.form.nromipres = null;
      this.form.observacciones = null;
      this.form.califica = null;
      this.medicamentos = [];
      this.form.reclama = null;
      this.form.fechaPte = this.datopte[0].fechapte;
      this.form.nromipres = this.datopte[0].mipres;
      this.form.dx = this.datopte[0].dx;
      this.form.nroautoriza = this.datopte[0].autorizacion.trim();
    },
    async get_numerodisp() {
      this.items_tabla_entrega = [];
      this.form.copago = "";
      this.form.cuotam = "";
      this.items_tabla_saldos = [];
      this.items_tabla_pendientes = [];
      let agencia = this.empresa.agencia_empr;
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
    cerrar_atencion() {
      var data = JSON.parse(JSON.stringify(this.form));
      let tipocontr = data.tipocontr ? data.tipocontr.value : 0;
      let tipoorden = data.tipoorden ? data.tipoorden.value : 0;
      let reclama = data.reclama ? data.reclama.value : 0;
      let cliente = parseFloat(data.contrato.identificacion_rep);

      if (!data.contrato) {
        this.errores.contrato = true;
        this.send_error("Seleccione un Contrato!");
      } else if (cliente < 1) {
        this.errores.contrato = true;
        this.send_error("Seleccione un Contrato!");
      } else if (!data.telpaciente) {
        this.errores.telpaciente = true;
        this.send_error("Debe registrar Nro Telefono!");
      } else if (!data.direccpaciente) {
        this.errores.direccpaciente = true;
        this.send_error("Debe registrar Direccion del Paciente!");
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
      } else {
        this.format_envio(data);
        this.dialogo.estado = false;
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let sesion = sessionStorage.Sesion;
      let agencia = this.empresa.agencia_empr;
      let fecha = data.fecha.replace(/\-/g, "");
      let consecutivo = data.consecutivo;
      let idpaciente = data.idpaciente;
      let ubicacion = this.empresa.agencia_empr;
      let direccion = data.direccpaciente.trim();
      let telefono = data.telpaciente.trim();
      let copago = data.copago ? data.copago : 0;
      let cuotam = data.cuotam ? data.cuotam : 0;
      let consecpte = this.itemselec.consec_rep;
      let disp_pte = this.itemselec.consecdisp_rep;
      let agcdisp_pte = this.itemselec.idagencdisp_rep;
      let fechaPte = this.itemselec.fecha_rep.replace(/\-/g, "");
      let agenciapte = this.itemselec.idagenc_rep;
      let idretira = data.idreclama ? data.idreclama : 0;
      let descretira = data.descripreclama ? data.descripreclama.trim() : "";
      let paciente = data.descrippac.trim();
      let parentezco = data.parentezcoreclama
        ? data.parentezcoreclama.trim()
        : "";
      let telreclama = data.telreclama ? data.telreclama : 0;
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
        ] = `${codigo}|${cant_total}|${cant_entrega}|${lote}|${vencelote}|${cum}|${cant_formula}|${cada_formula}|${frecuencia_formula}|${duracion_formula}|${tiempo_formula}|${cod_med_eps}|`;
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
        direccion +
        "|" +
        telefono +
        "|" +
        copago +
        "|" +
        cuotam +
        "|" +
        idretira +
        "|" +
        descretira +
        "|" +
        parentezco +
        "|" +
        telreclama +
        "|" +
        califica +
        "|" +
        detalle +
        "|" +
        paciente +
        "|" +
        agenciapte +
        "|" +
        consecpte +
        "|" +
        fechaPte +
        "|" +
        disp_pte +
        "|" +
        agcdisp_pte +
        "|";
      let datos = {
        url: "Dispensa/dlls/PrDispensaPte.dll",
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
          this.comprobante = data[0].nro;
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    get_file(item) {
      if (item == 1) {
        this.form.pdf = null;
      } else {
        this.itemselec = item;
      }
      this.dialogocargue.estado = true;
      this.form.pdf = null;
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
    // async subir_pdf() {
    //   this.card_estado = true;
    //   let session = sessionStorage.Sesion;
    //   let agencia = this.empresa.agencia_empr;
    //   let consec = `00000${this.form.consecutivo - 1}`;
    //   let consecpte = this.itemselec.consec_rep;
    //   let agcpte = this.itemselec.agcpte;
    //   let codigo = this.itemselec.codmedica_rep;

    //   let empresa = this.empresa.descrip_empr.trim();
    //   let cargue_pdf = this.form.pdf.name;
    //   let clasif = this.form.tipodocum.value;
    //   let tipodoc = "02";
    //   let nombre_pdf = "DSP_" + agencia + "_" + consec + "_" + clasif + ".pdf";

    //   let data = new FormData();
    //   data.append("empresa", empresa);
    //   data.append("session", session);
    //   data.append("cargue_pdf", cargue_pdf);
    //   data.append("nombre_pdf", nombre_pdf);
    //   data.append("tipodoc", tipodoc);
    //   data.append("clasif", clasif);
    //   data.append("consecutivo", consec);
    //   data.append("file", this.form.pdf);
    //   data.append("agencia", agencia);
    //   data.append("codigo", codigo);
    //   data.append("consecpte", consecpte);
    //   data.append("agcpte", agcpte);

    //   let response = await fetch(
    //     "https://server1ts.net//financiero/inc/api_titan/dispensa.php",
    //     {
    //       method: "POST",
    //       body: data,
    //     }
    //   ).then((res) => res.json());
    //   this.card_estado = false;
    //   this.$emit("snack", {
    //     color: "success",
    //     text: "Soporte Guardado Correctamente",
    //     estado: true,
    //   });
    //   this.form.tipodocum = null;
    //   this.form.pdf = null;
    //   this.marcar_cargue(agencia, consec, clasif);
    // },
    marcar_cargue(agencia, consec, clasif) {
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
          this.loader = false;
          this.consultar_reporte();
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    async printdisp_item(item) {
      let agencia = item.idagencdisp_rep;
      let consecutivo = item.consecdisp_rep;

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

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            dispensacion(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printdispos_item(item) {
      let agencia = item.idagencdisp_rep;
      let consecutivo = item.consecdisp_rep;

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

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            dispensacion_pos(data).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printpend_item(item, tipo) {
      this.loader = true;
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;
      var datosEnvio = sessionStorage.Sesion + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          if (tipo == 1) {
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
          } else {
            this.datopte = data;
            // let tipocto = parseFloat(this.datopte[0].contrato);

            // var busqueda_contrato = this.itemstiposerv.find(
            //   (el) => el.value == tipocto
            // );
            // this.form.tipocontr = busqueda_contrato;
            this.abrir_dispensacion();
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.send_error("Error al imprimir Pendiente");
        });
    },
    async getpend_item() {
      let consecutivo = this.itemselec.consec_rep;
      var datosEnvio = sessionStorage.Sesion + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente02J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data.pop();
          if (data.length) {
            this.items_tabla_pendientes = data;
            this.disabled.guardar = false;
          } else {
            this.disabled.guardar = true;
            this.send_error("Sin Pendientes por Dispensar!");
          }
        })
        .catch((err) => {
          console.log(err);

          this.send_error("Error al consultar Pendiente");
        });
    },
    async downloadFile(item) {
      let idFile = null;
      idFile = item.idsoporte_rep.trim();

      const url =
        `https://drive.google.com/file/d/` + idFile + `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
    },
    cargaragencias: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas",
          });

          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todas",
          };
        })
        .catch((err) => {
          this.send_error("Error al cargar Sedes");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Bloqueado";
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",
        },
        {
          title: "Sede",
          value: "agencia_rep",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "consec_rep",
          format: "string",
        },
        {
          title: "Id_Paciente",
          value: "idpac_rep",
          format: "string",
        },
        {
          title: "Paciente",
          value: "descrpaciente_rep",
          format: "string",
        },

        {
          title: "Estado",
          value: "estado_rep",
          format: "string",
        },
        {
          title: "Id_Soporte",
          value: "idsoporte_rep",
          format: "string",
        },
        {
          title: "Id_Tirilla",
          value: "idtirilla_rep",
          format: "string",
        },

        {
          title: "Funcionario",
          value: "elabora_rep",
          format: "string",
        },
      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE DISPENSACIONES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Dispensacion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE DISPENSACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    consultar_reporte() {
      if (!this.form.puntos) {
        this.errores.puntos = true;
        this.send_error("Selecciona una sede");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.puntos.codigo_agc;
        let ressede = this.form.ressede ? 1 : 0;
        let resfunc = this.form.resfunc ? 1 : 0;

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          ressede,
          resfunc,
        ];
        this.postData({
          url: "dispensa/dlls/PrPendienteJ.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));

            if (this.form.ressede) this.graficar(this.contenido);
          })
          .catch((err) => {
            this.loader = false;
            console.log("Error", err);
            this.$emit(
              "msj",
              err.Mensaje ? err.Mensaje[0].msg : err,
              "red",
              1000
            );
          });
      }
    },
    calcular_final() {
      this.form.fechaFinal = this.form.fechaInicial;
    },
    asignar_contrato() {
      let tipo_sel = parseFloat(this.datopte[0].tipocontrato);
      this.filtro_tipocontrato = this.contratos.filter(
        (el) => parseFloat(el.tipocontr_rep) == tipo_sel
      );
      let eps = this.itemselec.eps_rep;
      this.filtro_eps = this.filtro_tipocontrato.filter(
        (el) => el.eps_rep === eps
      );
      if (eps == "EPSS34" || eps == "EPS017" || eps == "EPS002") {
        console.log("asignar_contrato");
      } else {
        if (tipo_sel == 2) {
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
    format_contrato(val) {
      return val.descripcion_rep.trim() + " - " + val.detalle_rep.trim();
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
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    format_medicam(val) {
      return `${val.descripcion.trim()} -Saldo: ${val.cant_rep.trim()}`;
    },
    add_medicamento(item) {
      let agrpmolecula = this.form.medicamento.codmolecula_rep;

      let medicamento_pte = this.items_tabla_pendientes.find(
        (el) => el.agrpmolecula_rep == agrpmolecula
      );

      if (!medicamento_pte) {
        this.$emit("snack", {
          color: "error",
          text: "Medicamento sin Pendientes de entrega!",
          estado: true,
        });
      }
      const index = this.items_tabla_entrega.length;
      let cant_solicitado = parseFloat(medicamento_pte.cantidad_rep.trim());
      let cant_entregado = parseFloat(item.entrega_rep.trim());
      let saldo = parseFloat(item.cant_rep.trim());

      if (cant_entregado < 1 || cant_entregado > cant_solicitado) {
        this.$emit("snack", {
          color: "error",
          text: "Error en la cantidad a Entregar!",
          estado: true,
        });
      } else if (saldo < cant_entregado || cant_entregado > cant_solicitado) {
        this.$emit("snack", {
          color: "error",
          text: "Sin saldo para entregar !!",
          estado: true,
        });
      } else {
        this.items_tabla_entrega.push({
          tab_codigo: item.codprod_rep.trim(),
          tab_medicamento: item.descripprod_rep.trim(),
          tab_lote_medicamento: item.lote_rep.trim(),
          id: index + 1,
          tab_cantotal: 0,
          tab_entregado: cant_entregado,
          tab_pendiente: 0,
          tab_vence: item.vence_rep,
          tab_cum: item.cum_rep,
          cant_formu: 0,
          cada_formu: 0,
          frecuencia_formu: 0,
          duracion_formu: 0,
          tiempo_formu: 0,
          cod_med_eps: "",
        });
        this.items_tabla_saldos = [];
      }
    },
    borrar_medic(item) {
      const index = this.items_tabla_entrega.indexOf(item);
      this.items_tabla_entrega.splice(index, 1);
    },
    llenar_tabla() {
      console.log(this.form.medicamento);
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
            data.forEach((d) => {
              d.servicios.pop();
            });

            this.medicamentosCompletos = data;
            this.selectMedicamento();
            // this.validar_paciente();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
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
    async get_impresion() {
      let agencia = this.empresa.agencia_empr;
      let consecutivo = `00000${this.form.consecutivo - 1}`;
      // consecutivo = 1;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensaPteJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          data = data[0];
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

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
          await dispensacion_pos(data);
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
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
