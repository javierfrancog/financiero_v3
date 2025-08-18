<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :disabled="load_card"
        :loading="load_card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-checkbox-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Check CirugÃ­a Segura</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  @keyup.enter="buscar_paciente()"
                  type="number"
                  required
                  v-model="form.id_numero"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="buscar_paciente()"
                  >Buscar</v-btn
                >
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-text-field
                  label="Descripcion Paciente"
                  outlined
                  disabled
                  v-model="form.descripaciente"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="success"
                  class="ma-2 white--text"
                  @click="open_check()"
                  >Nuevo Check</v-btn
                >
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
              :loading="load_table"
              :headers="headers"
              :items="infopaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.descrip_paciente="{ item }">
                {{
                  item.apellido1_rep +
                  " " +
                  item.apellido2_rep +
                  " " +
                  item.nombre1_rep +
                  " " +
                  item.nombre2_rep
                }}
              </template>

              <template v-slot:item.idpaciente_rep="{ item }">
                {{ parseInt(item.idpaciente_rep) }}
              </template>

              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
              </template>

              <template v-slot:item.btn_print="{ item }">
                <v-btn
                  color="orange"
                  class="ma-2 white--text"
                  @click="imprimir_hc(item)"
                  >{{ (text = "Imprimir HC") }}</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>

        <v-dialog v-model="dialogo.estado" persistent max-width="1200px">
          <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
            <v-toolbar class="mt-2" color="indigo darken-1" dark>
              <v-row class="px-6 mt- justify-left">
                <span class="subtitle-1">Paciente: {{ dialogo.paciente }}</span>

                <div class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Edad: {{ edad }} </span>
                </div>
              </v-row>
            </v-toolbar>

            <v-divider color="orange"></v-divider>
            <v-spacer></v-spacer>

            <v-card-text class="mt-2 pb-0">
              <v-tabs
              v-model="tab"              
                centered
                slider-color="red"
                background-color="light-blue lighten-4"
              >
                <v-tab grow>Entrada Transfer</v-tab>
                <v-tab grow>Procedimientos</v-tab>
                <v-tab grow>Salida</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab" class="mb-2">
                    <!-- Pestaña Entrada Transfer -->
                <v-tab-item>
                  <v-card color="basil" flat class="mt-3">
                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                      <strong><span class="mr-2">Responsable</span></strong>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                      <v-col cols="6">
                                  <tr>
                                  <td><strong>Hora Ingreso:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_ingreso"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                              </v-col >
                            </v-row>
                             
                
                  

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Pregunte al paciente nombres, apellidos y numero de
                          identificaciÃ³n Verifique con la manilla de
                          identificacion, coincide ??</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion === 'si'"
                          @change="form.verificacion = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion === 'no'"
                          @change="form.verificacion = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2">
                      <v-col cols="12" class="d-flex">
                        <span class="mt-8"
                          >Pregunte al paciente si sabe que procedimiento se va
                          realizar,</span
                        >
                        <span class="mt-4"></span>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion2 === 'si'"
                          @change="form.verificacion2 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion2 === 'no'"
                          @change="form.verificacion2 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2">
                      <v-col cols="12" class="d-flex">
                        <span class="mt-8"
                          >Pregunte al paciente el sitio que se va intervenir
                          (En intervenciones de lateralidad y estructuras
                          mÃºltiples).</span
                        >
                        <span class="mt-4"></span>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion3 === 'si'"
                          @change="form.verificacion3 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion3 === 'no'"
                          @change="form.verificacion3 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2">
                      <v-col cols="12" class="d-flex">
                        <span class="mt-8"
                          >Verifique la demarcaciÃ³n del sitio quirÃºrgico,debe
                          estar identificado con el sello institucional (En
                          intervenciones de lateralidad y estructuras
                          mÃºltiples).</span
                        >
                        <span class="mt-4"></span>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion4 === 'si'"
                          @change="form.verificacion4 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion4 === 'no'"
                          @change="form.verificacion4 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2">
                      <v-col cols="10" class="d-flex">
                        <span class="mt-8"
                          >Verifique cuÃ¡l fue el o los Ãºltimos medicamentos que
                          tomÃ³.</span>
                        <div style="margin-left: auto; width: fit-content">
                          <v-simple-table class="mt-4">
                            <v-simple-table class="mt-40">
                              <thead></thead>
                              <tbody>
                                <tr>
                                  <td><strong>Nombre:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.nombre_medicamento"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Dosis:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.dosis_medicamento"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Fecha:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.fecha_medicamento"
                                      type="date"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Hora:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_medicamento"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                              </tbody>
                            </v-simple-table>
                          </v-simple-table>
                        </div>
                      </v-col>
                        <v-row class="ml-1">

                        <v-col cols="6">
                          <span></span>
                        </v-col>
                      </v-row>

                      <v-row ></v-row>
                          <v-col cols="12">
                            <span>
                              Verifique que la identificaciÃ³n del paciente corresponde con el consentimiento informado y dejo totalmente diligenciado</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion5 === 'si'"
                          @change="form.verificacion5 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion5 === 'no'"
                          @change="form.verificacion5 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              Verifique que la identificaciÃ³n del paciente corresponde con los estudios de imÃ¡genes</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion6 === 'si'"
                          @change="form.verificacion6 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion6 === 'no'"
                          @change="form.verificacion6 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion6 === 'NA'"
                          @change="form.verificacion6 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              El paciente tiene antecedentes de alergia (medicamentos, alimentos, dispositivos y otros)</span
                            >
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion5 === 'si'"
                          @change="form.verificacion5 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion5 === 'no'"
                          @change="form.verificacion5 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              EscrÃ­balos:</span
                            >
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                  <v-row class="ml-2 align-center">
                    <v-text-field
                            dense
                            hide-details
                            v-model="form.antecedentes"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </v-row>
                        <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              La reserva sanguÃ­nea ha sido enviada y confirmada a banco de sangre</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion7 === 'si'"
                          @change="form.verificacion7 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion7 === 'no'"
                          @change="form.verificacion7 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion7 === 'NA'"
                          @change="form.verificacion7 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row >
                          <v-col cols="12" class="d-flex justify-center">
                            <span class=" ml-4" bold: true>
                            <strong>VERIFÃQUE:</strong></span
                            >
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                        <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              Acompañante</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion8 === 'si'"
                          @change="form.verificacion8 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion8 === 'no'"
                          @change="form.verificacion8 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion8 === 'NA'"
                          @change="form.verificacion8 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

<v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              PreparaciÃ³n</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion9 === 'si'"
                          @change="form.verificacion9 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion9 === 'no'"
                          @change="form.verificacion9 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion9 === 'NA'"
                          @change="form.verificacion9 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              Ayuno</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion10 === 'si'"
                          @change="form.verificacion10 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion10 === 'no'"
                          @change="form.verificacion10 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion10 === 'NA'"
                          @change="form.verificacion10 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              No Maquillaje, Esmalte, Uñas AcrÃ­licas, No Joyas, No PrÃ³tesis dentales</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion11 === 'si'"
                          @change="form.verificacion11 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion11 === 'no'"
                          @change="form.verificacion11 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion11 === 'NA'"
                          @change="form.verificacion11 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              AutorizaciÃ³n del procedimiento</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion12 === 'si'"
                          @change="form.verificacion12 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion12 === 'no'"
                          @change="form.verificacion12 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion12 === 'NA'"
                          @change="form.verificacion12 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              Historia ClÃ­nica, Consentimiento</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion13 === 'si'"
                          @change="form.verificacion13 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion13 === 'no'"
                          @change="form.verificacion13 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion13 === 'NA'"
                          @change="form.verificacion13 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              Realizo Vx PreanestÃ©sico</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion14 === 'si'"
                          @change="form.verificacion14 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion14 === 'no'"
                          @change="form.verificacion14 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion14 === 'NA'"
                          @change="form.verificacion14 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row >
                          <v-col cols="12">
                            <span class=" ml-4">
                              Acceso Venoso</span
                            >
                            <span class="mt-4"></span>
                          </v-col>
                        </v-row>
                        <v-row class="ml-2 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion15 === 'si'"
                          @change="form.verificacion15 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion15 === 'no'"
                          @change="form.verificacion15 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion15 === 'NA'"
                          @change="form.verificacion15 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Nombres Auxiliar de transferencia (Entrega)</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.auxiliar"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>

                  <v-row class="ml-4 align-center">
                    <tr>
                                  <td><strong>Fecha:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.fecha_entrega"
                                      type="date"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                  </tr>
                                  <tr>
                                  <td><strong>Hora Salida:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_salida2"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                              </v-row>

                              <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Nombres Auxiliar de Salas (Recibo)</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.recibo"
                            style="max-width: 600px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>
                    <v-simple-table class="mt-4">

      
  <thead>
    <v-row class="ml-4 align-center"></v-row>
    <tr>
      <th>OBSERVACIONES</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <v-textarea
          v-model="form.observaciones"
          outlined
          fontSize=" 12"
          auto-grow
          rows="3"
          hide-details
        ></v-textarea>
      </td>
    </tr>
  </tbody>
</v-simple-table>

                  </v-card>
                </v-tab-item>
                    <!-- Pestaña Procedimientos -->                
                <v-tab-item>
                  <v-card color="basil" flat class="mt-3">
                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                      <strong> <span class="mr-2">Responsable</span></strong>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable2"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                      <v-col cols="6">
                                  <tr>
                                  <td><strong>Hora Ingreso:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_ingreso2"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                              </v-col >
                            </v-row>  
                            
                            <v-row >
                              <v-col cols="12" class="d-flex justify-center text-center">
                              <strong><span class=" ml-4">
                              PAUSA QUIRÃšRGICA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                        
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Grupo QuirÃºrgico liderado por la enfermera Jefe. Confirma y presenta los miembros del equipo quirÃºrgico y su funciÃ³n (Cuando exista personal nuevo)</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_1 === 'si'"
                          @change="form.verificacion_1 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_1 === 'no'"
                          @change="form.verificacion_1 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Se confirma en voz alta: Nombres, apellidos y nÃºmero de identificaciÃ³n del paciente</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_2 === 'si'"
                          @change="form.verificacion_2 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_2 === 'no'"
                          @change="form.verificacion_2 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Procedimiento a Realizar</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_3 === 'si'"
                          @change="form.verificacion_3 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_3 === 'no'"
                          @change="form.verificacion_3 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Sitio QuirÃºrgico a intervenir</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_4 === 'si'"
                          @change="form.verificacion_4 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_4 === 'no'"
                          @change="form.verificacion_4 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Reserva sanguÃ­nea disponible</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_5 === 'si'"
                          @change="form.verificacion_5 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_5 === 'NA'"
                          @change="form.verificacion_5 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >PrevisiÃ³n de Eventos CrÃ­ticos</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_6 === 'si'"
                          @change="form.verificacion_6 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_6 === 'NA'"
                          @change="form.verificacion_6 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Se realizÃ³ previa limpieza y desinfecciÃ³n de la sala</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_7 === 'si'"
                          @change="form.verificacion_7 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_7 === 'no'"
                          @change="form.verificacion_7 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >EnfermerÃ­a VERIFICA: Paciente Monitorizado, OxÃ­geno Disponible, Temperatura de la Sala, Limpieza y desinfecciÃ³n de silla Qx</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_8 === 'si'"
                          @change="form.verificacion_8 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_8 === 'no'"
                          @change="form.verificacion_8 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>


                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma Enfermera Jefe:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_2"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              MÃ‰DICO CIRUJANO CONFIRMA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>



                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Nombres, apellidos y nÃºmero de identificaciÃ³n del paciente</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_9 === 'si'"
                          @change="form.verificacion_9 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_9 === 'no'"
                          @change="form.verificacion_9 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Profilaxis AntibiÃ³tica en los Ãºltimos 00 minutos</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_10 === 'si'"
                          @change="form.verificacion_10 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_10 === 'no'"
                          @change="form.verificacion_10 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Tromboprofilaxis</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_11 === 'si'"
                          @change="form.verificacion_11 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_11 === 'no'"
                          @change="form.verificacion_11 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Procedimiento a Realizar</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_12 === 'si'"
                          @change="form.verificacion_12 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_12 === 'no'"
                          @change="form.verificacion_12 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Sitio QuirÃºrgico a Intervenir</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_13 === 'si'"
                          @change="form.verificacion_13 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_13 === 'no'"
                          @change="form.verificacion_13 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >DemarcaciÃ³n del sitio quirÃºrgico</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_14 === 'si'"
                          @change="form.verificacion_14 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_14 === 'no'"
                          @change="form.verificacion_14 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >RevisiÃ³n de la Historia ClÃ­nica y Consentimiento</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_15 === 'si'"
                          @change="form.verificacion_15 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_15 === 'no'"
                          @change="form.verificacion_15 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >VerificaciÃ³n de requerimientos: (Materiales, ImÃ¡genes, dispositivos, otros)</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_16 === 'si'"
                          @change="form.verificacion_16 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_16 === 'no'"
                          @change="form.verificacion_16 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma Cirujano:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_3"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>
                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              ANESTESIÃ“LOGO CONFIRMA</span
                            >   </strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                        <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Nombres, apellidos y nÃºmero de identificaciÃ³n del paciente</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_17 === 'si'"
                          @change="form.verificacion_17 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_17 === 'no'"
                          @change="form.verificacion_17 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Procedimiento a Realizar</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_18 === 'si'"
                          @change="form.verificacion_18 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_18 === 'no'"
                          @change="form.verificacion_18 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >RevisiÃ³n de mÃ¡quina de anestesia</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_19 === 'si'"
                          @change="form.verificacion_19 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_19 === 'no'"
                          @change="form.verificacion_19 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Tipo de Anestesia</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_20 === 'si'"
                          @change="form.verificacion_20 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_20 === 'no'"
                          @change="form.verificacion_20 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >VÃ­a Ã¡rea difÃ­cial</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_21 === 'si'"
                          @change="form.verificacion_21 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_21 === 'no'"
                          @change="form.verificacion_21 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Problemas especÃ­ficos del paciente:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_4"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma AnestesiÃ³logo:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_5"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>


                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              INSTRUMENTADOR CONFIRMA</span
                            >   </strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                        <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Procedimiento a Realizar</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_22 === 'si'"
                          @change="form.verificacion_22 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_22 === 'no'"
                          @change="form.verificacion_22 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >VerificaciÃ³n de Indicadores de esterilizaciÃ³n</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_23 === 'si'"
                          @change="form.verificacion_23 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_23 === 'no'"
                          @change="form.verificacion_23 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Verifica lavado de manos y uso correcto de EPP</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_24 === 'si'"
                          @change="form.verificacion_24 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_24 === 'no'"
                          @change="form.verificacion_24 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Instrumental quirÃºrgico completo</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_25 === 'si'"
                          @change="form.verificacion_25 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_25 === 'no'"
                          @change="form.verificacion_25 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >RevisiÃ³n y control de compresas y material en la mesa</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_26 === 'si'"
                          @change="form.verificacion_26 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_26 === 'no'"
                          @change="form.verificacion_26 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Dispositivos Especiales</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_27 === 'si'"
                          @change="form.verificacion_27 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_27 === 'no'"
                          @change="form.verificacion_27 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma Instrumentador:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_6"
                            style="max-width: 300px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >                 
                
                               <tr>
                                <v-col cols="4" class= "justify-center"> 
                                  <td><strong>Fecha:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.fecha_entrega2"
                                      type="date"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </v-col>
                                  </tr>
                                  <tr>
                                    <v-col cols="3" class= "justify-center"> 
                                  <td><strong>Hora Salida:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_salida3"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </v-col>
                                </tr>
                              </v-row>


               
                            
                   </v-card>
                  </v-tab-item>
                    <!-- Pestaña Salida -->                  
                    <v-tab-item>
                  <v-card color="basil" flat class="mt-3">
                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                      <strong> <span class="mr-2">Responsable</span></strong>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable3"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                      <v-col cols="6">
                                  <tr>
                                  <td><strong>Hora Ingreso:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_ingreso_2"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </tr>
                              </v-col >
                            </v-row>  
                            
                            <v-row >
                              <v-col cols="12" class="d-flex justify-center text-center">
                              <strong><span class=" ml-4">
                              ENFERMERA CONFIRMA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                        
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >NÃºmero de muestra de patologÃ­a tomadas</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_28 === 'si'"
                          @change="form.verificacion_28 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_28 === 'no'"
                          @change="form.verificacion_28 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >MarcaciÃ³n correcta muestra de patologÃ­a</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_29 === 'si'"
                          @change="form.verificacion_29 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_29 === 'no'"
                          @change="form.verificacion_29 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Verifica datos relevantes durante el procedimiento y redacta</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_30 === 'si'"
                          @change="form.verificacion_30 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_30 === 'no'"
                          @change="form.verificacion_30 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              MÃ‰DICO CIRUJANO CONFIRMA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>


                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Nombre del procedimiento</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_31 === 'si'"
                          @change="form.verificacion_31 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_31 === 'no'"
                          @change="form.verificacion_31 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Complicaciones Presentadas</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_32 === 'si'"
                          @change="form.verificacion_32 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_32 === 'NA'"
                          @change="form.verificacion_32 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Recomendaciones y alta del quirÃ³fano</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_33 === 'si'"
                          @change="form.verificacion_33 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_33 === 'NA'"
                          @change="form.verificacion_33 = 'NA'"
                          label="NA"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma Cirujano:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_3"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              ANESTESIÃ“LOGO CONFIRMA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>


                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Complicaciones presentadas</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_34 === 'si'"
                          @change="form.verificacion_34 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_34 === 'no'"
                          @change="form.verificacion_34 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >ColocaciÃ³n de analgÃ©sico intraoperatoria</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_35 === 'si'"
                          @change="form.verificacion_35 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_35 === 'no'"
                          @change="form.verificacion_35 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">CuÃ¡l:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.observacion_1"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>



                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma AnestesiÃ³logo:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_5"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              INSTRUMENTADORA CONFIRMA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>



                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Recuento de gasas, agujas y compresas</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_36 === 'si'"
                          @change="form.verificacion_36 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_36 === 'no'"
                          @change="form.verificacion_36 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Presencia de drenos</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_37 === 'si'"
                          @change="form.verificacion_37 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_37 === 'no'"
                          @change="form.verificacion_37 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>


                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">CuÃ¡les:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.observacion_2"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Reporte de dispositivos implantados, retirados y/o suplantados</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_38 === 'si'"
                          @change="form.verificacion_38 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_38 === 'no'"
                          @change="form.verificacion_38 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Si hay problemas que resolver con instrumental y equipos</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_39 === 'si'"
                          @change="form.verificacion_39 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_39 === 'no'"
                          @change="form.verificacion_39 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">CuÃ¡les:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.observacion_3"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma Instrumentador:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_6"
                            style="max-width: 400px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >
                    </v-row>

                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              ENFERMERÃA CONFIRMA</span
                            ></strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>

                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Entrega del paciente a recuperaciÃ³n post operatorio</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_40 === 'si'"
                          @change="form.verificacion_40 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_40 === 'no'"
                          @change="form.verificacion_40 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Informa datos relevantes del procedimiento</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_41 === 'si'"
                          @change="form.verificacion_41 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_41 === 'no'"
                          @change="form.verificacion_41 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Informa analgesia instaurada</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_42 === 'si'"
                          @change="form.verificacion_42 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_42 === 'no'"
                          @change="form.verificacion_42 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Informa complicaciones intraoperatorias</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_43 === 'si'"
                          @change="form.verificacion_43 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_43 === 'no'"
                          @change="form.verificacion_43 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>


                        <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Informa requerimientos post operatorios</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_44 === 'si'"
                          @change="form.verificacion_44 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_44 === 'no'"
                          @change="form.verificacion_44 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Informa si se realizÃ³ procedimiento adicional</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_45 === 'si'"
                          @change="form.verificacion_45 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_45 === 'no'"
                          @change="form.verificacion_45 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Entrega informe quirÃºrgico para trÃ¡mite administrativo</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_46 === 'si'"
                          @change="form.verificacion_46 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_46 === 'no'"
                          @change="form.verificacion_46 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Verifica rotulos de medicamentos, equipos, dispositivos</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_47 === 'si'"
                          @change="form.verificacion_47 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_47 === 'no'"
                          @change="form.verificacion_47 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row >
                      <v-col cols="12" class="d-flex justify-center text-center">
                      <strong><span class=" ml-4" bold: true>
                              RECUPERACIÃ“N</span
                            >   </strong>
                            <span class="mt-4"></span>
                           
                          </v-col>
                        </v-row>


                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Verifica signos vitales</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_48 === 'si'"
                          @change="form.verificacion_48 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_48 === 'no'"
                          @change="form.verificacion_48 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                   

                      <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Verifica tolerancia vÃ­a oral</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_49 === 'si'"
                          @change="form.verificacion_49 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_49 === 'no'"
                          @change="form.verificacion_49 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Verifica diuresia</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_50 === 'si'"
                          @change="form.verificacion_50 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_50 === 'no'"
                          @change="form.verificacion_50 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Entrega Recomendaciones al paciente</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_51 === 'si'"
                          @change="form.verificacion_51 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_51 === 'no'"
                          @change="form.verificacion_51 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Retira acceso venoso, y dispositivos segÃºn indicacion mÃ©dica. Para egreso</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_52 === 'si'"
                          @change="form.verificacion_52 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_52 === 'no'"
                          @change="form.verificacion_52 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row class="ml-2 mt-2 align-center">
                      <v-col cols="12">
                        <span
                          >Entrega Historia ClÃ­nica, Ã³rdenes mÃ©dicas, ayuda Dx.</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="ml-2 d-flex mt-0 align-center">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_53 === 'si'"
                          @change="form.verificacion_53 = 'si'"
                          label="SÃ­"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4" class="d-flex">
                        <v-checkbox
                          :value="true"
                          :input-value="form.verificacion_53 === 'no'"
                          @change="form.verificacion_53 = 'no'"
                          label="No"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                   
                    <v-row class="mt-4 align-center justify-space-between">
                      <v-col cols="6">
                        <div
                          class="d-flex align-center"
                          style="margin-left: 16px; flex: 1"
                        >
                          <span class="mr-2">Firma EnfermerÃ­a:</span>
                          <v-text-field
                            dense
                            hide-details
                            v-model="form.responsable_7"
                            style="max-width: 300px; flex: 1"
                          ></v-text-field>
                        </div>
                      </v-col >                 
                
                               <tr>
                                <v-col cols="4" class= "justify-center"> 
                                  <td><strong>Fecha:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.fecha_entrega2"
                                      type="date"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </v-col>
                                  </tr>
                                  <tr>
                                    <v-col cols="3" class= "justify-center"> 
                                  <td><strong>Hora Salida:</strong></td>
                                  <td>
                                    <v-text-field
                                      v-model="form.hora_salida3"
                                      type="time"
                                      dense
                                      hide-details
                                    ></v-text-field>
                                  </td>
                                </v-col>
                                </tr>
                              </v-row>                                      
                   </v-card>
                  </v-tab-item>
              </v-tabs-items>

                     
              <v-row>
                <v-divider
                  class="mt-6"
                  :style="{
                    'border-width': '1px',
                    'border-color': 'indigo',
                  }"
                />
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {},
  data() {
    return {
      search: null,
      load_table: false,
      texto_descripcion: null,
      pickerFechaFinal: false,
      pickeFechaIni: false,
      form: {
        verificacion: "",
        verificacion2: "",
        verificacion3: "",
        verificacion4: "",
        verificacion5: "",
        verificacion6: "",
        verificacion7: "",
        verificacion8: "",
        verificacion9: "",
        verificacion10: "",
        verificacion11: "",
        verificacion12: "",
        verificacion13: "",
        verificacion14: "",
        verificacion15: "",
        verificacion_1: "",
        verificacion_2: "",
        verificacion_3: "",
        verificacion_4: "",
        verificacion_5: "",
        verificacion_6: "",
        verificacion_7: "",
        verificacion_8: "",
        verificacion_9: "",
        verificacion_10: "",
        verificacion_11: "",
        verificacion_12: "",
        verificacion_13: "",
        verificacion_14: "",
        verificacion_15: "",
        verificacion_16: "",
        verificacion_17: "",
        verificacion_18: "",
        verificacion_19: "",
        verificacion_20: "",
        verificacion_21: "",
        verificacion_22: "",
        verificacion_23: "",
        verificacion_24: "",
        verificacion_25: "",
        verificacion_26: "",
        verificacion_27: "",
        verificacion_28: "",
        verificacion_29: "",
        verificacion_30: "",
        verificacion_31: "",
        verificacion_32: "",
        verificacion_33: "",
        verificacion_34: "",
        verificacion_35: "",
        verificacion_36: "",
        verificacion_37: "",
        verificacion_38: "",
        verificacion_39: "",
        verificacion_40: "",
        verificacion_41: "",
        verificacion_42: "",
        verificacion_43: "",
        verificacion_44: "",
        verificacion_45: "",
        verificacion_46: "",
        verificacion_47: "",
        verificacion_48: "",
        verificacion_49: "",
        verificacion_50: "",
        verificacion_51: "",
        verificacion_52: "",
        verificacion_53: "",



        form: {
          nombre_medicamento: "",
          dosis_medicamento: "",
          fecha_entrega: "",
          fecha_entrega2: "",
          fecha_medicamento: "",
          hora_medicamento: "",
          hora_ingreso: "",
          hora_recibo: "",
          observaciones: "",
          observaciones1: "",
          observaciones2: "",
          observaciones3: "",
          auxiliar: "",
          responsable2: "",
          responsable_2: "",
          responsable_3: "",
          responsable_4: "",
          responsable_5: "",
          responsable_6: "",
          hora_ingreso2: "",
          hora_salida2: "",
          hora_salida3: "",
          hora_ingreso_2: "",
          responsable3: "",
          responsable4: "",
          responsable5: "",
          responsable6: "",
          responsable7: "",
        },

        id_numero: null,
        descripaciente: null,

      },
      infopaciente: [],

      card_estado: false,
      tab: 0,
      tab1: 0,
      tab2: 0,
      tab3: 0,
      edad: null,
      dialogo: {
        estado: true,
        paciente: null,
      },
      headers: [
        {
          text: "AcciÃ³n",
          align: "center",
          value: "btn_atencion",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion paciente",
          align: "left",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha Historia",
          align: "center",
          value: "fecha_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Nro_Historia",
          align: "center",
          value: "nro_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "idpaciente_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "MÃ©dico",
          align: "center",
          value: "medico_rep",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Imprimir",
          align: "center",
          value: "btn_print",
          class: "indigo--text blue lighten-5",
        },
      ],
      load_card: false,
    };
  },
  created() {
    this.get_empresa();
  },

  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo_cargue = anioActual;
    },
    get_empresa() {
      post
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    buscar_paciente() {
      let paciente = this.form.id_numero.trim();

      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.paciente = data[0];
          this.form.descripaciente = this.paciente.descrip_rep.trim();
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
    open_check() {
      this.clear_form();
      this.dialogo.paciente = this.paciente.descrip_rep.trim();
      this.tab1 = 0;
      this.dialogo.estado = true;
    },
    clear_form() {
      this.form = {
        id_numero: null,
        descripaciente: null,
      };
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
</script>

