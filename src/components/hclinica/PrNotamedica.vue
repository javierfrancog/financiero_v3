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
                >mdi-account-details-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Nota MÃ©dica</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="4">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  @keyup.enter="procesarbusqueda()"
                  type="number"
                  required
                  v-model="form.id_numero"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="procesarbusqueda()"
                  >Buscar</v-btn
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
              <template v-slot:item.btn_atencion="{ item }">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="abrir_nota(item)"
                  >{{ (text = "Crear Nota") }}</v-btn
                >
              </template>

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

        <v-dialog v-model="historia.estado" persistent width="1200">
          <v-toolbar color="indigo darken-1" dark>
            <v-row class="px-6 mt-0 justify-left">
              <span class="subtitle-1">Paciente: {{ dialogo.paciente }}</span>

              <div class="px-6 mt-0 justify-center">
                <span class="subtitle-1">Edad: {{ edad }} </span>
              </div>
              <div class="justify-end d-flex pb-4">
                <div class="d-flex ml-10">
                  <v-btn
                    @click="func_expandir"
                    color="black darken-1"
                    class="white--text"
                    >Ver Todo
                  </v-btn>
                </div>
                <div class="d-flex ml-5">
                  <v-btn
                    @click="func_ocultar"
                    color="green darken-1"
                    class="white--text"
                  >
                    Contraer</v-btn
                  >
                </div>
              </div>
            </v-row>
          </v-toolbar>

          <v-divider color="orange"></v-divider>
          <v-spacer></v-spacer>

          <v-card-text class="pb-0">
            <v-tabs
              v-model="tab"
              centered
              slider-color="red"
              background-color="light-blue lighten-4"
            >
              <v-tab grow>Historia Clinica</v-tab>
              <v-tab grow v-model="tab2" ref="tab2">Cierre Historia</v-tab>
            </v-tabs>
            <v-row>
              <v-divider
                class="mt-6"
                :style="{
                  'border-width': '1px',
                  'border-color': 'indigo',
                }"
              />
            </v-row>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card color="basil" flat>
                  <template>
                    <v-expansion-panels v-model="panel" multiple focusable>
                      <!-- motivo de consulta                     -->
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          @click="get_secc(1)"
                          color="blue lighten-5"
                        >
                          <v-row class="px-6 mt-0">
                            <v-icon
                              class="px-6 mr-1"
                              color="orange accent-3"
                              x-large
                              >mdi-chat-alert-outline</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >1.Motivo de Consulta</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col class="d-flex" cols="4">
                              <v-select
                                :items="plantilla"
                                :item-text="format_subseccion"
                                hide-details
                                label="Plantilla"
                                v-model="form.plant_motivo"
                                return-object
                                clearable
                                @change="select_plantilla(1)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12">
                              <div>
                                <v-textarea
                                  label="Motivo"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.motivo"
                                  auto-grow
                                  rows="1"
                                  row-height="5"
                                ></v-textarea>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <!-- enfermedad actual -->
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="indigo" x-large
                              >mdi-emoticon-sick-outline</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >2.Enfermedad Actual</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                clearable
                                label="Enfermedad Actual"
                                v-model="form.enfactual"
                                hide-details
                                auto-grow
                                rows="1"
                                row-height="5"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <!-- antecedentes                     -->
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          @click="get_secc(3)"
                          color="blue lighten-5"
                        >
                          <v-row class="px-6 mt-0">
                            <v-icon
                              class="px-6 mr-1"
                              color="grey darken-4"
                              x-large
                              >mdi-allergy</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >3.Antecedentes</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col class="d-flex" cols="5">
                              <v-select
                                :items="plant_antecedentes"
                                :item-text="format_plantilla"
                                hide-details
                                label="Plantilla"
                                v-model="form.plant_antecedentes"
                                return-object
                                multiple
                                @change="select_plantilla(3)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                              cols="12"
                              v-for="(item, index) in tab_antecedentes"
                              :key="index"
                            >
                              <div>
                                <div class="d-flex justify-content-end">
                                  <v-btn
                                    class="mx-2 mb-2"
                                    fab
                                    dark
                                    x-small
                                    color="red"
                                    depressed
                                    @click="removeExamen(3, index)"
                                  >
                                    <v-icon dark> mdi-delete-outline </v-icon>
                                  </v-btn>
                                </div>
                                <v-textarea
                                  :label="item.label"
                                  outlined
                                  hide-details
                                  v-model="item.value"
                                  auto-grow
                                  rows="1"
                                  row-height="5"
                                ></v-textarea>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <!-- signos vitales -->
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="red" x-large
                              >mdi-clipboard-pulse-outline</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >4.Signos Vitales</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="2">
                              <span class="subtitle-1">TensiÃ³n</span>
                              <v-icon
                                class="px-6 mr-1"
                                :style="{
                                  color: getColorTension,
                                }"
                                >mdi-heart-pulse</v-icon
                              >
                            </v-col>
                            <v-col cols="2">
                              <span class="subtitle-1">F.CardÃ­aca</span>
                              <v-icon
                                class="px-6 mr-1"
                                :style="{
                                  color: getColorFC,
                                }"
                                >mdi-pulse</v-icon
                              >
                            </v-col>
                            <v-col cols="2">
                              <span class="subtitle-1">F.Respiratoria</span>
                              <v-icon
                                class="px-6 mr-2"
                                :style="{
                                  color: getColorFresp,
                                }"
                                >mdi-lungs</v-icon
                              >
                            </v-col>
                            <v-col cols="2">
                              <span class="subtitle-1">Temperatura</span>
                              <v-icon
                                class="px-6 mr-1"
                                :style="{
                                  color: getColorTemp,
                                }"
                                >mdi-emoticon-sick-outline</v-icon
                              >
                            </v-col>
                            <v-col cols="2">
                              <span class="subtitle-1">SaturaciÃ³n</span>
                              <v-icon
                                class="px-6 mr-1"
                                :style="{
                                  color: getColorTemp,
                                }"
                                >mdi-emoticon-sick-outline</v-icon
                              >
                            </v-col>

                            <v-col cols="2">
                              <span class="subtitle-1">Peso</span>
                              <v-icon
                                class="px-6 mr-1"
                                :style="{
                                  color: getColorImc,
                                }"
                                >mdi-weight-kilogram</v-icon
                              >
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="2">
                              <div class="d-flex">
                                <v-text-field
                                  label="Sys"
                                  hide-details
                                  v-model="form.systole"
                                ></v-text-field>
                                <v-text-field
                                  label="Diast"
                                  hide-details
                                  v-model="form.diastole"
                                ></v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="2">
                              <div>
                                <v-text-field
                                  label="F.c."
                                  hide-details="auto"
                                  v-model="form.frecard"
                                ></v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="2">
                              <div>
                                <v-text-field
                                  label="F.Respiratoria"
                                  hide-details="auto"
                                  v-model="form.freresp"
                                ></v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="2">
                              <div>
                                <v-text-field
                                  label="Temperatura"
                                  hide-details="auto"
                                  v-model="form.tempera"
                                ></v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="2">
                              <div>
                                <v-text-field
                                  label="O2Sat"
                                  hide-details="auto"
                                  v-model="form.saturacion"
                                ></v-text-field>
                              </div>
                            </v-col>

                            <v-col cols="2">
                              <div>
                                <v-text-field
                                  label="Peso"
                                  hide-details="auto"
                                  v-model="form.peso"
                                ></v-text-field>
                              </div>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-divider
                              class="mt-6"
                              :style="{
                                'border-width': '1px',
                                'border-color': 'indigo',
                              }"
                            />
                          </v-row>
                          <v-row>
                            <v-col cols="1">
                              <span class="subtitle-1">Talla</span>
                              <v-icon class="px-6 mr-1"
                                >mdi-human-male-height-variant</v-icon
                              >
                            </v-col>
                            <v-col cols="1">
                              <span class="subtitle-1">I.M.C</span>
                              <v-icon
                                class="px-6 mr-1"
                                :style="{
                                  color: getColorImc,
                                }"
                                >mdi-human-handsdown</v-icon
                              >
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="1">
                              <div>
                                <v-text-field
                                  label="Talla"
                                  hide-details="auto"
                                  v-model="form.talla"
                                ></v-text-field>
                              </div>
                            </v-col>

                            <v-col cols="1">
                              <div>
                                <v-text-field
                                  label="Imc"
                                  disabled
                                  hide-details="auto"
                                  v-model="form.imc"
                                ></v-text-field>
                              </div>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-divider
                              class="mt-6"
                              :style="{
                                'border-width': '1px',
                                'border-color': 'orange',
                              }"
                            />
                          </v-row>

                          <!-- <v-row>
                          <span class="subtitle-1">PerÃ­metro Abdominal</span>
                          <v-icon class="px-6 mr-1">mdi-radiobox-marked</v-icon>
                        </v-row> -->
                          <!-- <v-row>
                          <v-col cols="3">
                            <div>
                              <v-text-field
                                label="PerÃ­metro"
                                hide-details="auto"
                                v-model="form.per_abdom"
                              ></v-text-field>
                            </div>
                          </v-col>

                          <v-col class="d-flex ml-10" cols="3">
                            <v-autocomplete
                              label="Riesgo"
                              v-model="form.riesgo"
                              :items="riesgo"
                              return-object
                              :error="errores.riesgo"
                              @change="errores.riesgo = false"
                            ></v-autocomplete>
                          </v-col>
                          <v-col class="d-flex ml-10" cols="3">
                            <v-autocomplete
                              label="Lateralidad"
                              v-model="form.lateral"
                              :items="lateral"
                              return-object
                              :error="errores.lateral"
                              @change="errores.lateral = false"
                            ></v-autocomplete>
                          </v-col>
                        </v-row> -->
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <!-- revision por sistemas                     -->
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          @click="get_secc(5)"
                          color="blue lighten-5"
                        >
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="green" x-large
                              >mdi-stethoscope</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >5.RevisiÃ³n Por Sistemas</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col class="d-flex" cols="4">
                              <v-select
                                :items="plant_revsistemas"
                                :item-text="format_plantilla"
                                hide-details
                                label="Plantilla"
                                v-model="form.plant_revsistemas"
                                return-object
                                multiple
                                @change="select_plantilla(5)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                              cols="12"
                              v-for="(item, index) in tab_revsistemas"
                              :key="index"
                            >
                              <div>
                                <div class="d-flex justify-content-end">
                                  <v-btn
                                    class="mx-2 mb-2"
                                    fab
                                    dark
                                    x-small
                                    color="red"
                                    depressed
                                    @click="removeExamen(5, index)"
                                  >
                                    <v-icon dark> mdi-delete-outline </v-icon>
                                  </v-btn>
                                </div>
                                <v-textarea
                                  :label="item.label"
                                  outlined
                                  hide-details
                                  v-model="item.value"
                                  auto-grow
                                  rows="1"
                                  row-height="5"
                                ></v-textarea>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <!-- examen fisico -->
                      <v-expansion-panel>
                        <v-expansion-panel-header @click="get_secc(6)">
                          <v-row class="px-6 mt-0">
                            <v-icon
                              class="px-6 mr-1"
                              color="deep-purple"
                              x-large
                              >mdi-format-list-checks</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >6.ExÃ¡men FÃ­sico</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col class="d-flex" cols="4">
                              <v-select
                                :items="plant_exfisico"
                                :item-text="format_plantilla"
                                hide-details
                                label="Plantilla"
                                v-model="form.plant_exfisico"
                                return-object
                                multiple
                                @change="select_plantilla(6)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                              cols="12"
                              v-for="(item, index) in tab_examenesFisicos"
                              :key="index"
                            >
                              <div>
                                <div class="d-flex justify-content-end">
                                  <v-btn
                                    class="mx-2 mb-2"
                                    fab
                                    dark
                                    x-small
                                    color="red"
                                    depressed
                                    @click="removeExamen(6, index)"
                                  >
                                    <v-icon dark> mdi-delete-outline </v-icon>
                                  </v-btn>
                                </div>
                                <v-textarea
                                  :label="item.label"
                                  outlined
                                  hide-details
                                  v-model="item.value"
                                  auto-grow
                                  rows="1"
                                  row-height="5"
                                ></v-textarea>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <!-- paraclinicos -->
                      <v-expansion-panel>
                        <v-expansion-panel-header color="blue lighten-5">
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="orange" x-large
                              >mdi-account-search</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >7.ParaclÃ­nicos</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                clearable
                                label="Paraclinicos"
                                v-model="form.paraclinicos"
                                hide-details
                                auto-grow
                                rows="1"
                                row-height="5"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <!-- diagnostico -->
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="indigo" x-large
                              >mdi-account-question-outline</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >8.Diagnostico</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="12">
                              <v-btn
                                dark
                                small
                                color="blue"
                                depressed
                                @click="addDiagnostico"
                              >
                                Agregar diagnostico
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row
                            v-for="(item, index) in listDiagnosticos"
                            :key="index"
                          >
                            <v-col cols="12">
                              <v-autocomplete
                                :items="diagnosticos"
                                :item-text="format_diagnostico"
                                item-value="codigo"
                                label="Diagnostico"
                                outlined
                                clearable
                                hide-details
                                v-model="item.value"
                                :error="errores.diagnostico"
                                @change="errores.diagnostico = false"
                              ></v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <!-- analisis -->
                      <v-expansion-panel>
                        <v-expansion-panel-header color="blue lighten-5">
                          <v-row class="px-6 mt-0">
                            <v-icon
                              class="px-6 mr-1"
                              color="grey darken-4"
                              x-large
                              >mdi-clipboard-text-search-outline</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >9.AnÃ¡lisis</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                clearable
                                label="AnÃ¡lisis"
                                v-model="form.analisis"
                                hide-details
                                auto-grow
                                rows="1"
                                row-height="5"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <!-- plan tratamiento -->
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="green" x-large
                              >mdi-human-edit</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >10.Plan de Tratamiento</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                clearable
                                label="Plan de Tratamiento"
                                v-model="form.plantto"
                                hide-details
                                auto-grow
                                rows="1"
                                row-height="5"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <!-- ordenes medicas -->
                      <v-expansion-panel>
                        <v-expansion-panel-header color="blue lighten-5">
                          <v-row class="px-6 mt-0">
                            <v-icon class="px-6 mr-1" color="red" x-large
                              >mdi-border-color</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >11_Ordenes MÃ©dicas</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="3">
                              <v-select
                                :items="[
                                  { text: 'Medicamentos', value: 1 },
                                  { text: 'ExÃ¡menes', value: 2 },
                                  { text: 'Ordenes', value: 3 },
                                  { text: 'Incapacidades', value: 4 },
                                ]"
                                label="Ordenes"
                                outlined
                                hide-details
                                clearable
                                v-model="form.ordenes"
                                @change="select_ordenes"
                              ></v-select>
                            </v-col>
                          </v-row>

                          <div class="pa-0 px-0">
                            <v-data-table
                              item-key="key"
                              show-expand
                              :headers="tablaOrdenes.headers"
                              :items="tablaOrdenes.data"
                              hide-default-footer
                              disable-pagination
                            >
                              <template v-slot:item.action="{ item }">
                                <v-tooltip top>
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
                                  <span>Modificar Producto</span>
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
                                    >
                                      <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Eliminar Producto</span>
                                </v-tooltip>
                              </template>
                            </v-data-table>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <!-- recomendaciones -->
                      <v-expansion-panel>
                        <v-expansion-panel-header @click="get_secc(12)">
                          <v-row class="px-6 mt-0">
                            <v-icon
                              class="px-6 mr-1"
                              color="deep-purple"
                              x-large
                              >mdi-file-document-edit-outline</v-icon
                            >
                            <span class="Heading 3 font-weight-medium"
                              >12.Recomendaciones</span
                            >
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col class="d-flex" cols="4">
                              <v-select
                                :items="plant_recomendaciones"
                                :item-text="format_plantilla"
                                hide-details
                                label="Plantilla"
                                v-model="form.plant_recomendaciones"
                                return-object
                                multiple
                                @change="select_plantilla(12)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                              cols="12"
                              v-for="(item, index) in tab_recomendaciones"
                              :key="index"
                            >
                              <div>
                                <div class="d-flex justify-content-end">
                                  <v-btn
                                    class="mx-2 mb-2"
                                    fab
                                    dark
                                    x-small
                                    color="red"
                                    depressed
                                    @click="removeExamen(12, index)"
                                  >
                                    <v-icon dark> mdi-delete-outline </v-icon>
                                  </v-btn>
                                </div>
                                <v-textarea
                                  :label="item.label"
                                  outlined
                                  hide-details
                                  v-model="item.value"
                                  auto-grow
                                  rows="1"
                                  row-height="5"
                                ></v-textarea>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-row class="mt-2 justify-center d-flex pb-4">
                      <div class="justify-end d-flex pb-4">
                        <div class="d-flex ml-10">
                          <v-btn
                            @click="tab_cerrar()"
                            color="indigo"
                            class="white--text"
                            >Cerrar Historia
                          </v-btn>
                        </div>
                      </div>
                    </v-row>
                  </template>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card color="basil" flat>
                  <v-row class="d-flex justify-center col-12">
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="Diagnostico de Ingreso"
                        v-model="form.cldx"
                        :items="items_cldx"
                        hide-details
                        return-object
                        @change="errores.cldx = false"
                        :error="errores.cldx"
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="Condicion de Salida"
                        v-model="form.condicion"
                        :items="items_condicion"
                        hide-details
                        return-object
                        @change="errores.condicion = false"
                        :error="errores.condicion"
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="Causa de Ingreso"
                        v-model="form.causaing"
                        :items="items_causaing"
                        hide-details
                        return-object
                        @change="errores.causaing = false"
                        :error="errores.causaing"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row> </v-row>
                  <v-row class="d-flex justify-center col-12">
                    <div class="justify-end d-flex pb-4">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="d-flex mr-3">
                          <v-btn
                            @click="guardar_historia"
                            color="indigo darken-1"
                            class="white--text"
                            :disabled="disabled.guardar_hc"
                            >Guardar Historia
                          </v-btn>
                        </div>
                        <!-- <div class="d-flex mr-3">
                        <v-btn
                          @click="imprimir_hc"
                          :disabled="disabled.imprimir_hc"
                          color="orange darken-1"
                          class="white--text"
                          >Imprimir Historia
                        </v-btn>
                      </div>

                      <div class="d-flex mr-3">
                        <v-btn
                          @click="cerrar_dialogo"
                          color="green darken-1"
                          class="white--text"
                          :disabled="disabled.sgte_paciente"
                          >Siguiente Paciente
                        </v-btn>
                      </div> -->
                        <div class="d-flex mr-3">
                          <v-btn
                            @click="cerrar_nota"
                            color="red darken-1"
                            class="white--text"
                            :disabled="disabled.salirsin_hc"
                            >Salir sin Grabar
                          </v-btn>
                        </div>
                      </v-card-actions>
                    </div>
                  </v-row>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-dialog>
      </v-card>

      <v-dialog v-model="medicamentos.estado" persistent max-width="1000px">
        <v-card class="px-6">
          <v-card-title>
            <v-toolbar color="blue darken-1" dark>
              <v-row class="px-6 mt-0 justify-center">
                <span class="subtitle-1">Medicamentos</span>
              </v-row>
            </v-toolbar>
          </v-card-title>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="Medicamento"
                :items="item_medicamentos"
                outlined
                clearable
                return-object
                hint="Busca por DescripciÃ³n Atc Ã³ Medicamento"
                persistent-hint
                item-value="codigo_rep"
                v-model="form.medicamentos"
                :item-text="format_medicamentos"
                @change="clear_medicamentos()"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-autocomplete
                label="PresentaciÃ³n"
                v-model="form.presentmed"
                :items="presentmed"
                :item-text="format_presentmed"
                filled
                shaped
                hide-details
                return-object
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Dosis"
                clearable
                type="number"
                v-model="form.cantidad"
                hide-details
                @change="errores.cantmedic = false"
                :error="errores.cantmedic"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Unidad AdministraciÃ³n"
                v-model="form.unidadmon"
                :items="unidadmon"
                hide-details
                return-object
                filled
                shaped
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cada"
                clearable
                type="number"
                v-model="form.cada"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Frecuencia"
                v-model="form.frecuencia"
                :items="frecuencia"
                hide-details
                return-object
                filled
                shaped
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Via"
                v-model="form.via"
                :items="viaadmon"
                :item-text="format_vias"
                hide-details
                return-object
                filled
                shaped
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant.DuraciÃ³n"
                clearable
                type="number"
                v-model="form.duracion"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Tiempo"
                v-model="form.tiempo"
                :items="tiempo"
                hide-details
                return-object
                @change="validar_tiempo(), (errores.tiempo = false)"
                :error="errores.tiempo"
                filled
                shaped
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Total Formulado"
                clearable
                type="number"
                v-model="form.totalform"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider color="#FF6F00"></v-divider>
          <v-row>
            <v-col class="d-flex" cols="8">
              <v-textarea
                label="Indicaciones"
                clearable
                outlined
                counter="4200"
                :rules="[
                  (v) => (v && v.length <= 4200) || 'Maximo 4200 caracteres',
                ]"
                type="text"
                v-model="form.indicaciones"
              ></v-textarea>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Nro_Mipres"
                clearable
                outlined
                type="text"
                v-model="form.mipres"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                depressed
                color="blue"
                small
                dark
                @click="agregarMedicamento"
              >
                Agregar
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-divider
              class="mt-6"
              :style="{
                'border-width': '1px',
                'border-color': 'orange',
              }"
            />
          </v-row>

          <v-row>
            <v-data-table
              :headers="headers_tabla_medicam"
              :items="items_tabla_medicam"
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
          <v-card-actions>
            <!-- <v-btn
            color="orange white--text"
            class
            @click="get_medicamentos()"
            depressed
          >
            <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
          </v-btn> -->

            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cerrar_ordenes">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="examenes.estado" persistent max-width="1000px">
        <v-card class="px-6">
          <v-card-title>
            <v-toolbar color="orange darken-1" dark>
              <v-row class="px-2 mt-0 justify-center">
                <span class="subtitle-1">ExÃ¡menes</span>
                <v-col class="pa-0 px-0 d-flex justify-end">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        color="light-blue accent-4 white--text"
                        class="mr-2"
                        @click="get_examenes()"
                        depressed
                      >
                        <v-icon size="30" center>mdi-autorenew</v-icon>
                      </v-btn>
                    </template>
                    <span>Actualiza Tablas</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-toolbar>
          </v-card-title>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="ExÃ¡men"
                :items="item_examen"
                outlined
                clearable
                return-object
                hint="Busca por DescripciÃ³n"
                persistent-hint
                item-value="codigo_rep"
                v-model="form.examenes"
                :item-text="format_examenes"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cantidad"
                clearable
                type="number"
                v-model="form.excantidad"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8">
              <v-text-field
                label="Indicaciones"
                clearable
                type="text"
                v-model="form.exindicaciones"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Nro_Mipres"
                clearable
                type="text"
                v-model="form.exmipres"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn depressed color="blue" small dark @click="agregarExamen">
                Agregar
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-divider
              class="mt-6"
              :style="{
                'border-width': '1px',
                'border-color': 'orange',
              }"
            />
          </v-row>

          <v-row>
            <v-data-table
              :headers="headers_tabla_examenes"
              :items="items_tabla_examenes"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="borrar_examen(item)"
                  color="red"
                  >delete</v-icon
                >
              </template>
            </v-data-table>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cerrar_ordenes">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="remision.estado" persistent max-width="1000px">
        <v-card class="px-6">
          <v-card-title>
            <v-toolbar color="indigo darken-2" dark>
              <v-row class="px-6 mt-0 justify-center">
                <span class="subtitle-1">Orden MÃ©dica</span>
                <v-col class="pa-0 px-0 d-flex justify-end">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        color="light-blue accent-4 white--text"
                        class="mr-2"
                        @click="get_ordenes()"
                        depressed
                      >
                        <v-icon size="30" center>mdi-autorenew</v-icon>
                      </v-btn>
                    </template>
                    <span>Actualiza Tablas</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-toolbar>
          </v-card-title>
          <v-row>
            <v-col class="d-flex" cols="10">
              <v-autocomplete
                label="Orden"
                :items="item_orden"
                outlined
                clearable
                return-object
                hint="Busca por DescripciÃ³n"
                persistent-hint
                item-value="codigo_rep"
                v-model="form.ordenmed"
                :item-text="format_ordenmed"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cantidad"
                clearable
                type="number"
                v-model="form.ordcantidad"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8">
              <v-text-field
                label="Indicaciones"
                clearable
                type="text"
                v-model="form.ordindicaciones"
                hide-details
              ></v-text-field>
            </v-col>
            <!-- <v-col class="d-flex" cols="2">
            <v-text-field
              label="Nro_Mipres"
              clearable
              type="text"
              v-model="form.exmipres"
              hide-details
            ></v-text-field>
          </v-col> -->
          </v-row>
          <v-row>
            <v-col>
              <v-btn depressed color="blue" small dark @click="agregarOrden">
                Agregar
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-divider
              class="mt-6"
              :style="{
                'border-width': '1px',
                'border-color': 'orange',
              }"
            />
          </v-row>

          <v-row>
            <v-data-table
              :headers="headers_tabla_ordenes"
              :items="items_tabla_ordenes"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="borrar_orden(item)"
                  color="red"
                  >delete</v-icon
                >
              </template>
            </v-data-table>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cerrar_ordenes">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="incapacidad.estado" persistent max-width="1000px">
        <v-card class="px-6">
          <v-card-title>
            <v-toolbar color="cyan darken-1" dark>
              <v-row class="px-2 mt-0 justify-center">
                <span class="subtitle-1">Incapacidades</span>
              </v-row>
            </v-toolbar>
          </v-card-title>

          <v-row class="d-flex mt-1">
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Paciente:"
                disabled
                type="text"
                v-model="form.paciente_inc"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Historia:"
                disabled
                type="text"
                v-model="form.historia_inc"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Entidad:"
                disabled
                type="text"
                v-model="form.entidad_inc"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-divider
              class="mt-6"
              :style="{
                'border-width': '1px',
                'border-color': 'orange',
              }"
            />
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                :items="diagnosticos"
                :item-text="format_diagnostico"
                item-value="codigo"
                label="Diagnostico"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.dx_inc"
                :error="errores.diagnostico_inc"
                @change="(errores.diagnostico_inc = false), agregarDxInc()"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="px-2 mt-2 justify-center">
            <v-data-table
              :headers="headers_dx_incapac"
              :items="items_tabla_dxincapc"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:item.edit="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="borrar_dxinc(item)"
                  color="red"
                  >delete</v-icon
                >
              </template>
            </v-data-table>
          </v-row>

          <v-row class="d-flex mt-4">
            <v-col class="d-flex" cols="3">
              <v-menu
                ref="menu"
                v-model="pickeFechaIni"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaini_inc"
                    label="Fecha Inicial"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaini_inc"
                  @input="pickeFechaIni = false"
                  @change="calcularDias(), (errores.fechaini_inc = false)"
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
                    v-model="form.fechafinal_inc"
                    label="Fecha Final"
                    append-icon="event"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechafinal_inc"
                  @input="pickerFechaFinal = false"
                  @change="calcularDias(), (errores.fechafinal_inc = false)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cantidad"
                disabled
                type="number"
                v-model="form.cantidad_inc"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-autocomplete
                label="PrÃ³rroga"
                v-model="form.prorroga"
                :items="prorroga"
                hide-details
                return-object
                filled
                @change="errores.prorroga = false"
                shaped
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-autocomplete
                label="Origen"
                v-model="form.origen"
                :items="origen"
                hide-details
                return-object
                filled
                shaped
                @change="errores.origen = false"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="8">
              <v-text-field
                label="Observacion"
                clearable
                type="text"
                v-model="form.observacion_inc"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-divider
              class="mt-6"
              :style="{
                'border-width': '1px',
                'border-color': 'orange',
              }"
            />
          </v-row>
          <v-row class="mt-3 mb-3">
            <v-col class="pa-0 px-0 d-flex justify-end">
              <v-btn
                color="indigo"
                class="white--text mr-3"
                @click="cerrar_ordenes"
                large
                depressed
              >
                Cerrar
              </v-btn>
            </v-col>

            <v-col class="pa-0 px-0 d-flex justify-end">
              <v-btn
                color="red darken-1"
                @click="cancelar_inc()"
                class="white--text mr-3"
                large
                depressed
              >
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-row class="mb-3">
          <v-spacer></v-spacer>
        </v-row>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { historiaClinica } from "../../_formatos_sal.js";
import { OrdenMedica, incapacidad } from "../../_formatos_sal.js";


import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  components: {},
  data() {
    return {
      tab2: null,
      search: null,
      load_table: false,
      texto_descripcion: null,
      pickerFechaFinal: false,
      pickeFechaIni: false,

      infopaciente: [],
      plantilla: [],
      plant_exfisico: [],
      plant_antecedentes: [],
      plant_revsistemas: [],
      plant_paraclinic: [],
      plant_analisis: [],
      plant_plantto: [],
      plant_recomendaciones: [],
      tab_motivo: [],
      tab_examenesFisicos: [],
      tab_antecedentes: [],
      tab_revsistemas: [],
      tab_paraclinic: [],
      tab_analisis: [],
      tab_plantto: [],
      tab_recomendaciones: [],
      listDiagnosticos: [],
      listDiagnosticos_inc: [],
      diagnosticos: [],
      item_medicamentos: [],
      item_examen: [],
      item_orden: [],
      seccion: [],
      items_tabla_medicam: [],
      items_tabla_examenes: [],
      items_tabla_dxincapc: [],
      items_tabla_ordenes: [],

      medicamentos: {
        estado: false,
        plantila: null,
      },
      examenes: {
        estado: false,
        plantila: null,
      },
      remision: {
        estado: false,
        plantila: null,
      },

      incapacidad: {
        estado: false,
        plantila: null,
      },

      disabled: {
        guardar_hc: true,
        imprimir_hc: true,
        sgte_paciente: true,
        salirsin_hc: false,
      },
      form: {
        motivo: null,
      },
      tab: 0,
      dialogo: {
        estado: false,
        titulo: null,
        paciente: null,
        tipo: null,
        item: {},
      },
      edad: "",
      entidad: null,
      fecha_actual: "",
      nrohc: 0,
      profesional: 0,
      paciente: 0,

      historia: {
        estado: false,
        plantila: null,
      },
      errores: {
        condicion: false,
        causaing: false,
        diagnostico: false,
        diagnostico_inc: false,
        prorroga: false,
        cantidad_inc: false,
        origen: false,
        fechaini_inc: false,
        fechafinal_inc: false,
      },
      headers_tabla_medicam: [
        { text: "Medicamento", align: "left", value: "tab_medicamento" },
        { text: "PresentaciÃ³n", align: "left", value: "tab_presentacion" },
        { text: "Dosis", align: "center", value: "tab_cantidad" },
        { text: "Unidad Admon", align: "center", value: "tab_unidad" },
        { text: "Cada", align: "center", value: "tab_cada" },
        { text: "Frecuencia", align: "center", value: "tab_frecuencia" },
        { text: "VÃ­a", align: "center", value: "tab_via" },
        { text: "DuraciÃ³n ", align: "center", value: "tab_duracion" },
        { text: "Tiempo", align: "center", value: "tab_tiempo" },
        { text: "Cant.Total", align: "center", value: "tab_cantotal" },
        { text: "Indicaciones", align: "left", value: "tab_indicaciones" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      headers_tabla_examenes: [
        { text: "ExÃ¡men", align: "left", value: "tab_examen" },
        { text: "Cantidad", align: "center", value: "tab_excantidad" },
        { text: "Indicaciones", align: "left", value: "tab_exindicaciones" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      headers_dx_incapac: [
        { text: "Codigo", align: "left", value: "tab_coddxinc" },
        { text: "DescripciÃ³n", align: "left", value: "tab_descrdxinc" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      headers_tabla_ordenes: [
        { text: "Orden", align: "left", value: "tab_orden" },
        { text: "Cantidad", align: "center", value: "tab_ordcantidad" },
        { text: "Indicaciones", align: "left", value: "tab_ordindicaciones" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      tablaOrdenes: {
        headers: [
          {
            text: "Tipo",
            align: "left",
            value: "descrip_producto",
          },
          {
            text: "Descripcion",
            align: "left",
            value: "presentacion.descripcion_rep",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
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
      prorroga: [
        { text: "Si", value: 1 },
        { text: "No", value: 2 },
      ],
      origen: [
        { text: "Enfermedad General", value: 1 },
        { text: "Enfermedad Laboral", value: 2 },
        { text: "Accidente Laboral", value: 3 },
        { text: "Accidente de TrÃ¡nsito", value: 4 },
        { text: "Otro", value: 9 },
      ],
      viaadmon: [
        { text: "Oral", value: "048" },
        { text: "Intravenosa", value: "042" },
        { text: "SubcutÃ¡nea", value: "050" },
        { text: "Intramuscular", value: "051" },
      ],

      tiempo: [
        { text: "Meses", value: 5 },
        { text: "Semanas", value: 4 },
        { text: "Dias", value: 3 },
        { text: "Minutos", value: 1 },
        { text: "Horas", value: 2 },
        { text: "Años", value: 6 },
        { text: "Unica", value: 8 },
        { text: "S/g Respuesta al Tto", value: 7 },
      ],

      items_cldx: [
        { text: "ImpresiÃ³n Diagnostica", value: 1 },
        { text: "Confirmado Nuevo", value: 2 },
        { text: "Confirmado Repetido", value: 3 },
      ],
      items_causaing: [
        { text: "Enfermedad General", value: 38 },
        { text: "Enfermedad Laboral", value: 39 },
        { text: "Accidente de Trabajo", value: 21 },
        { text: "Accidente en el Hogar", value: 22 },
        { text: "Riesgo Ambiental", value: 49 },
      ],

      items_condicion: [
        { text: "Con Destino a su Domicilio", value: "01" },
        { text: "Muerto", value: "02" },
        { text: "Hospitalizado a Urgencias", value: "03" },
        { text: "Referido a otra InstituciÃ³n", value: "04" },
        { text: "ContraReferido a otra InstituciÃ³n", value: "05" },
        { text: "Referido Hospitalizacion Domiciliaria", value: "06" },
        { text: "Canalizado Servicio Social", value: "07" },
      ],
      presentmed: [],
      unidadmon: [
        { text: "Dosis", value: 1 },
        { text: "Gotas", value: 2 },
        { text: "Gramos", value: 3 },
        { text: "Microgramos", value: 4 },
        { text: "Miligramos", value: 5 },
        { text: "Nanogramos", value: 6 },
        { text: "Unidades", value: 7 },
        { text: "Litros", value: 8 },
        { text: "Mililitros", value: 9 },
        { text: "Metros", value: 10 },
        { text: "Micromol", value: 11 },
        { text: "Unidad de antÃ­geno", value: 12 },
        { text: "Megabecquerel", value: 13 },
        { text: "Milicurio", value: 14 },
        { text: "Miliequivalente", value: 15 },
        { text: "Millones de unidades formadoras de colonias", value: 16 },
        { text: "Millones de unidadades internacionales", value: 17 },
        { text: "Millon de organismos", value: 18 },
        { text: "Parte por millon", value: 19 },
        { text: "Unidad de tuberculina", value: 20 },
        { text: "Milimol", value: 21 },
        { text: "Unidades de floculaciÃ³n (lime flocculation unit)", value: 22 },
        { text: "Unidad internacional de kilo", value: 23 },
        { text: "Unidad internacional", value: 24 },
        { text: "Gigabecquerel", value: 25 },
        { text: "Unidad de ensayo inmunoenzimÃ¡tico", value: 26 },
        { text: "Metro cÃºbico", value: 27 },
        { text: "Billon de organismos", value: 28 },
        { text: "Billon de unidades formadoras de colonia", value: 29 },
        { text: "Bequerel", value: 30 },
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

      data: [],
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

        // { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
      panel: [],
    };
  },
  created() {
    this.get_empresa();
    this.cargar_años();
    this.get_ordenes();
    this.get_examenes();
    this.get_diagnosticos();
    this.get_medicamentos();
    this.get_vias();
    this.get_present();
  },
  computed: {
    getColorCardiaca() {
      if (!this.form.diastole) return "rgba(0, 0, 0, 0.54)";

      let diastole = parseInt(this.form.diastole) || 0;
      if (diastole > 0 && diastole < 10) return "#63a713";
      if (diastole > 10) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorTension() {
      if (!this.form.systole) return "rgba(0, 0, 0, 0.54)";
      let systole = parseInt(this.form.systole) || 0;
      let diastole = parseInt(this.form.diastole) || 0;
      if (systole > 90 && systole < 121 && diastole > 60 && diastole < 81)
        return "#63a713";
      if (systole > 120 || diastole > 80) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorFC() {
      if (!this.form.frecard) return "rgba(0, 0, 0, 0.54)";
      let frecard = parseInt(this.form.frecard) || 0;

      if (frecard > 59 && frecard < 101) return "#63a713";
      if (frecard < 60 || frecard > 100) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorFresp() {
      if (!this.form.freresp) return "rgba(0, 0, 0, 0.54)";
      let freresp = parseInt(this.form.freresp) || 0;

      if (freresp > 11 && freresp < 21) return "#63a713";
      if (freresp < 12 || freresp > 20) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorTemp() {
      if (!this.form.tempera) return "rgba(0, 0, 0, 0.54)";
      let tempera = parseInt(this.form.tempera) || 0;

      if (tempera > 35 && tempera < 38) return "#63a713";
      if (tempera < 36 || tempera > 37) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
    getColorImc() {
      if (!this.form.peso) return "rgba(0, 0, 0, 0.54)";

      let peso = parseFloat(this.form.peso).toFixed(2) || 0;
      let talla = parseFloat(this.form.talla).toFixed(2) || 0;
      let factor = (talla * talla).toFixed(2);
      let indice_mc = (peso / factor).toFixed(2);

      if (indice_mc > 18.4 && indice_mc < 24.9) return "#63a713";
      if (indice_mc < 18.5 || indice_mc > 24.9) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
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
      // this.form.id_numero = "1122534801";
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
    procesarbusqueda: function () {
      let paciente = parseInt(this.form.id_numero);
      post
        .postData({
          url: "Clinico/dlls/ClHclinica02J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.infopaciente = data;
        })
        .then((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar datos paciente",
            estado: false,
          });
        });
    },
    async imprimir_hc(item) {
      let paciente = item.idpaciente_rep;
      let consecutivo = item.nro_rep;
      let profesional = item.idprofesional_rep;
      post
        .postData({
          url: "Clinico/dlls/ClHclinicaJ.dll",
          data:
            sessionStorage.Sesion + "|" + paciente + "|" + consecutivo + "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;

          data = JSON.parse(JSON.stringify(data))[0];
          data.empresa = this.datosEmpresa;
          data.edad_rep = data.edad_rep.replace("n", "ñ");
          let profesional2 = parseInt(data.idprofes2_rep);

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = require(`../../assets/image/firmas/${parseFloat(
            profesional
          )}.png`);
          if (parseInt(profesional2) > 0) {
            let firma2_src = require(`../../assets/image/firmas/${parseFloat(
              profesional2
            )}.png`);

            let firma2 = await this.pdfs.getBase64(firma2_src);
            data.firma2 = firma2;
          }

          let logo = await this.pdfs.getBase64(logo_src);
          let firma = await this.pdfs.getBase64(firma_src);
          data.logo = logo;
          data.firma = firma;
          historiaClinica(data,false,true).then(() => {
            console.log("Impresion terminada");
          });
          this.procesar_ordenes(consecutivo);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Historia",
            estado: true,
          });
        });
    },
    tab_cerrar() {
      this.tab = 1;
      this.disabled.guardar_hc = false;
    },
    cerrar_nota() {
      this.historia.estado = false;
    },
    abrir_nota(item) {
      this.clear_form();
      let paciente = item.idpaciente_rep;
      this.nrohc = item.nro_rep;
      this.profesional = sessionStorage.Sesion.substr(15, 15);
      post
        .postData({
          url: "Clinico/dlls/ClHclinicaJ.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|" + this.nrohc + "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          data = JSON.parse(JSON.stringify(data))[0];
          this.dialogo.paciente =
            data.nombre1_rep.trim() +
            " " +
            data.nombre2_rep.trim() +
            " " +
            data.apellido1_rep.trim() +
            " " +
            data.apellido2_rep.trim();
          data.edad_rep = data.edad_rep.replace("Anos", "Años");
          this.fecha_actual = data.fechahc_rep;
          this.edad = data.edad_rep;
          this.entidad = data.eps_rep.trim();

          let busq_dxing = this.items_cldx.find(
            (el) => el.value == data.dxingreso_rep
          );
          this.form.cldx = busq_dxing;

          let busq_cond = this.items_condicion.find(
            (el) => el.value == data.condsalida_rep
          );
          this.form.condicion = busq_cond;

          let busq_causa = this.items_causaing.find(
            (el) => el.value == data.causaingreso_rep
          );
          this.form.causaing = busq_causa;
          this.paciente = data.idpaciente_rep;
          this.tab = 0;
          this.historia.estado = true;
        });
    },
    llenar_historia(data) {
      let text_encode = "";
      let text_decode = "";

      text_encode =
        data.secciones_rep[0].base1_rep.trim() +
        data.secciones_rep[0].base2_rep.trim() +
        data.secciones_rep[0].base3_rep.trim() +
        data.secciones_rep[0].base4_rep.trim() +
        data.secciones_rep[0].base5_rep.trim() +
        data.secciones_rep[0].base6_rep.trim() +
        data.secciones_rep[0].base7_rep.trim() +
        data.secciones_rep[0].base8_rep.trim() +
        data.secciones_rep[0].base9_rep.trim() +
        data.secciones_rep[0].base10_rep.trim() +
        data.secciones_rep[0].base11_rep.trim() +
        data.secciones_rep[0].base12_rep.trim() +
        data.secciones_rep[0].base13_rep.trim() +
        data.secciones_rep[0].base14_rep.trim() +
        data.secciones_rep[0].base15_rep.trim() +
        data.secciones_rep[0].base16_rep.trim() +
        data.secciones_rep[0].base17_rep.trim() +
        data.secciones_rep[0].base18_rep.trim() +
        data.secciones_rep[0].base19_rep.trim() +
        data.secciones_rep[0].base20_rep.trim();

      text_decode = window.atob(unescape(encodeURIComponent(text_encode)));
      this.form.motivo = text_decode.trim();
    },
    addDiagnostico() {
      this.listDiagnosticos.push({
        value: null,
      });
    },
    addDiagnostico_inc() {
      this.listDiagnosticos_inc.push({
        value: null,
      });
    },
    select_ordenes() {
      if (this.form.ordenes == 1) {
        this.medicamentos.estado = true;
      }
      if (this.form.ordenes == 2) {
        this.examenes.estado = true;
        this.form.excantidad = 1;
      }
      if (this.form.ordenes == 3) {
        this.remision.estado = true;
        this.form.ordcantidad = 1;
      }
      if (this.form.ordenes == 4) {
        this.form.paciente_inc = this.dialogo.paciente;
        this.form.historia_inc = parseFloat(this.nrohc);
        this.form.entidad_inc = this.entidad;
        this.incapacidad.estado = true;
      }
    },
    format_subseccion(val) {
      return `${val.descrip_rep.trim()}`;
    },
    format_plantilla(val) {
      return `${val.descrip_rep.trim()}`;
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion.trim();
    },

    format_medicamentos(val) {
      // return val.descgral_rep.trim() + " - " + val.concentr_rep.trim();
      return val.descripcion_rep.trim();
    },
    format_examenes(val) {
      return val.descgral_rep.trim() + "_Cups:" + val.codigo_rep;
    },
    format_ordenmed(val) {
      return val.descgral_rep.trim() + "_Cups:" + val.codigo_rep;
    },
    format_vias: function (val) {
      return `${val.descripcion_rep} `;
    },
    format_presentmed: function (val) {
      return `${val.descripcion_rep} `;
    },

    async guardar_historia() {
      if (!this.form.cldx) {
        this.errores.cldx = true;
        this.send_error("Selecciona un Diagnostico de Ingreso");
      } else if (!this.form.condicion) {
        this.errores.condicion = true;
        this.send_error("Selecciona una condiciÃ³n de Salida");
      } else if (!this.form.causaing) {
        this.errores.causaing = true;
        this.send_error("Selecciona una Causa de ingreso");
      } else {
        var sesion = sessionStorage.Sesion;
        let fechahc = this.fecha_actual.replace(/-/g, "");
        let plano = {};
        let index = 0;

        let cantidad_lineas = 0;
        let num = 0;
        let name = "";
        let end = 0;
        this.idpaciente = "undefined";
        if (this.idpaciente === "undefined") {
          this.idpaciente = this.idpacientehc;
        }

        // let motivo = this.form.motivo ? window.btoa(this.form.motivo) : "";
        // let motivo = this.form.motivo ? window.btoa(unescape(encodeURIComponent(this.form.motivo))) : "";
        // let enf_actual = this.form.enfactual? window.btoa(unescape(encodeURIComponent(this.form.enfactual))) : "";

        let motivo = this.form.motivo;
        let textomotivo64 = window.btoa(unescape(encodeURIComponent(motivo)));
        cantidad_lineas = Math.ceil(textomotivo64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_001-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textomotivo64.substring(end - 900, end)}`;
        }

        let enf_actual = this.form.enfactual;
        let textoenf_actual = window.btoa(
          unescape(encodeURIComponent(enf_actual))
        );
        cantidad_lineas = Math.ceil(textoenf_actual.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_002-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textoenf_actual.substring(end - 900, end)}`;
        }

        // let itemenf_actual = 99;
        // let format_indexenf_actual = (index + 1).toString().padStart(3, "0");
        // plano[
        //   `DATOJ_002-${format_indexenf_actual}`
        // ] = `${itemenf_actual}| ${textoenf_actual}`;

        let consec = 1;
        let antecedentes = this.tab_antecedentes;
        antecedentes.forEach((item, index) => {
          let textob64 = window.btoa(unescape(encodeURIComponent(item.value)));
          // let textob64 = item.value;
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_003-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.codigo}|${textob64.substring(
              end - 900,
              end
            )}`;
            consec = consec + 1;
          }

          // plano[`DATOJ_003-${format_index}`] = `${item.codigo}| ${textob64}`;
        });

        consec = 1;
        let rev_sistemas = this.tab_revsistemas;
        rev_sistemas.forEach((item, index) => {
          let textob64 = window.btoa(unescape(encodeURIComponent(item.value)));
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_005-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.codigo}|${textob64.substring(
              end - 900,
              end
            )}`;
            consec = consec + 1;
          }

          // plano[`DATOJ_005-${format_index}`] = `${item.codigo}| ${textob64}`;
        });

        let systole = this.form.systole;
        let diastole = this.form.diastole;
        let frecard = this.form.frecard;
        let freresp = this.form.freresp;
        let tempera = this.form.tempera;
        let peso = this.form.peso;
        let talla = this.form.talla;
        let imc = this.form.imc;
        let sato2 = this.form.saturacion;
        let dxing = this.form.cldx.value;
        let condsalida = this.form.condicion.value;
        let causaing = this.form.causaing.value;

        consec = 1;
        let ex_fisico = this.tab_examenesFisicos;
        ex_fisico.forEach((item, index) => {
          let textob64 = window.btoa(unescape(encodeURIComponent(item.value)));
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_006-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.codigo}|${textob64.substring(
              end - 900,
              end
            )}`;
            consec = consec + 1;
          }

          // plano[`DATOJ_006-${format_index}`] = `${item.codigo}| ${textob64}`;
        });

        let paraclinicos = this.form.paraclinicos;
        let textoparac64 = window.btoa(
          unescape(encodeURIComponent(paraclinicos))
        );
        cantidad_lineas = Math.ceil(textoparac64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_007-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textoparac64.substring(end - 900, end)}`;
        }

        // let itemparac = 99;
        // let format_indexparac = (index + 1).toString().padStart(3, "0");
        // plano[
        //   `DATOJ_007-${format_indexparac}`
        // ] = `${itemparac}| ${textoparac64}`;

        let diagnostico = this.listDiagnosticos;

        diagnostico.forEach((item, index) => {
          let textodx = "vacio";

          if (item.value) {
            let format_index = (index + 1).toString().padStart(3, "0");
            plano[
              `DATOJ_008-${format_index}`
            ] = `${item.value.trim()} | ${textodx}`;
          }
        });

        let analisis = this.form.analisis;
        let textoanalis64 = window.btoa(unescape(encodeURIComponent(analisis)));
        cantidad_lineas = Math.ceil(textoanalis64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_009-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textoanalis64.substring(end - 900, end)}`;
        }

        // let itemanalis = 99;
        // let format_indexanalis = (index + 1).toString().padStart(3, "0");
        // plano[
        //   `DATOJ_009-${format_indexanalis}`
        // ] = `${itemanalis}| ${textoanalis64}`;

        let plantto = this.form.plantto;
        // let textob64 = window.btoa(plantto);
        let textob64 = window.btoa(unescape(encodeURIComponent(plantto)));
        cantidad_lineas = Math.ceil(textob64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_010-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textob64.substring(end - 900, end)}`;
        }

        // let medicamentos = this.items_tabla_medicam;
        // medicamentos.forEach((item, index) => {
        //   let format_index = (index + 1).toString().padStart(3, "0");
        //   let textob64 = window.btoa(unescape(encodeURIComponent(item.tab_indicaciones)));
        //       cantidad_lineas = Math.ceil(textob64.length / 700);

        //   plano[
        //     `DATOJ_111-${format_index}`
        //   ] = `${item.tab_codmedicamento.trim()}| ${item.tab_cantidad}|${
        //     item.tab_cada
        //   }|${item.tab_idfrecuencia}|${item.tab_idvia}
        //   |${item.tab_duracion}|${item.tab_tiempo}|${item.tab_mipres}|${textob64}| `;
        // });

        consec = 1;
        let medicamentos = this.items_tabla_medicam;
        medicamentos.forEach((item, index) => {
          if (item.tab_indicaciones.length == 0) {
            item.tab_indicaciones = ".";
            // item.tab_cantidad = 0;
          } else if (item.tab_cantidad === 0) {
            item.tab_cantidad = 1;
          }
          let textob64 = window.btoa(
            unescape(encodeURIComponent(item.tab_indicaciones))
          );
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_111-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.tab_codmedicamento}|${item.tab_cantidad}|${
              item.tab_cada
            }|${item.tab_idfrecuencia}|${item.tab_idvia}|${item.tab_duracion}|${
              item.tab_idtiempo
            }|${item.tab_idpresentacion}|${item.tab_mipres}|${
              item.tab_idunidad
            }|${item.tab_cantotal}|${textob64.substring(end - 900, end)}|`;
            consec = consec + 1;
          }
        });

        consec = 1;
        let ordexamenes = this.items_tabla_examenes;
        ordexamenes.forEach((item, index) => {
          if (item.tab_exindicaciones.length == 0) {
            item.tab_exindicaciones = ".";
            item.tab_excantidad = 0;
          } else if (item.tab_excantidad === 0) {
            item.tab_excantidad = 1;
          }
          let textob64 = window.btoa(
            unescape(encodeURIComponent(item.tab_exindicaciones))
          );
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_112-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.tab_codmexamen.trim()}|${
              item.tab_excantidad
            }|${item.tab_cada}|${item.tab_exmipres}|${textob64.substring(
              end - 900,
              end
            )}|`;
            consec = consec + 1;
          }
        });

        consec = 1;
        let ordenes = this.items_tabla_ordenes;
        ordenes.forEach((item, index) => {
          if (item.tab_ordindicaciones.length == 0) {
            item.tab_ordindicaciones = ".";
            item.tab_ordcantidad = 0;
          } else if (item.tab_ordcantidad === 0) {
            item.tab_ordcantidad = 1;
          }
          let textob64 = window.btoa(
            unescape(encodeURIComponent(item.tab_ordindicaciones))
          );
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_113-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.tab_codorden.trim()}|${
              item.tab_ordcantidad
            }|${textob64.substring(end - 900, end)}|`;
            consec = consec + 1;
          }
        });

        consec = 1;
        if (this.items_tabla_dxincapc.length > 0) {
          let incapacidad = this.items_tabla_dxincapc;
          let dx1_inc = incapacidad[0].tab_coddxinc.trim();
          let dx2_inc = incapacidad[1]
            ? incapacidad[1].tab_coddxinc.trim()
            : "";
          let dx3_inc = incapacidad[2]
            ? incapacidad[2].tab_coddxinc.trim()
            : "";
          console.log("incapacidad", dx1_inc);

          let observ64 = window.btoa(
            unescape(encodeURIComponent(this.form.observacion_inc))
          );
          let fechaini = this.form.fechaini_inc.replace(/-/g, "");
          let fechafin = this.form.fechafinal_inc.replace(/-/g, "");
          let cantidad = this.form.cantidad_inc;
          let prorroga = this.form.prorroga.value;
          let origen = this.form.origen.value;
          cantidad_lineas = 1;

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_114-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[
              name
            ] = `${fechaini}|${fechafin}|${cantidad}|${prorroga}|${origen}|${dx1_inc}|${dx2_inc}|${dx3_inc}|${observ64.substring(
              end - 900,
              end
            )}|`;
            consec = consec + 1;
          }
        }

        let recomendaciones = this.tab_recomendaciones;
        recomendaciones.forEach((item, index) => {
          let textob64 = window.btoa(unescape(encodeURIComponent(item.value)));
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_012-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.codigo}|${textob64.substring(
              end - 900,
              end
            )}`;
            consec = consec + 1;
          }
        });

        let datosEnvio =
          sesion +
          "|" +
          this.paciente +
          "|" +
          this.nrohc +
          "|" +
          this.profesional +
          "|" +
          systole +
          "|" +
          diastole +
          "|" +
          frecard +
          "|" +
          freresp +
          "|" +
          tempera +
          "|" +
          peso +
          "|" +
          talla +
          "|" +
          imc +
          "|" +
          sato2 +
          "|" +
          dxing +
          "|" +
          condsalida +
          "|" +
          causaing +
          "|";
        let data = {
          url: "Clinico/dlls/ClPrHistoriaM.dll",
          data: { importarhtml: datosEnvio, ...plano },
          method: "",
          json: true,
        };

        post.postData(data).then((response) => {
          this.disabled.guardar_hc = true;
          this.clear_form;
          this.historia.estado = false;
        });
      }
    },
    async select_plantilla(seccion) {
      let plantilla = 0;
      this.texto_descripcion = "";

      if (seccion == 1) {
        let plantilla = this.form.plant_motivo.nro_rep;
        await this.get_plantilla(seccion, plantilla);
        this.form.motivo = this.texto_descripcion.trim();
      }
      if (seccion == 3) {
        if (this.form.plant_antecedentes) {
          this.tab_antecedentes = [];
          for (const item of this.form.plant_antecedentes) {
            plantilla = item.nro_rep;
            await this.get_plantilla(seccion, plantilla);

            if (this.texto_descripcion) {
              this.tab_antecedentes.push({
                label: item.descrip_rep,
                codigo: plantilla,
                value: this.texto_descripcion.trim(),
              });
            }
          }
        }
      }
      if (seccion == 5) {
        if (this.form.plant_revsistemas) {
          this.tab_revsistemas = [];
          for (const item of this.form.plant_revsistemas) {
            plantilla = item.nro_rep;
            await this.get_plantilla(seccion, plantilla);

            if (this.texto_descripcion) {
              this.tab_revsistemas.push({
                label: item.descrip_rep,
                codigo: plantilla,
                value: this.texto_descripcion.trim(),
              });
            }
          }
        }
      }
      if (seccion == 6) {
        if (this.form.plant_exfisico) {
          this.tab_examenesFisicos = [];
          for (const item of this.form.plant_exfisico) {
            plantilla = item.nro_rep;
            await this.get_plantilla(seccion, plantilla);

            if (this.texto_descripcion) {
              this.tab_examenesFisicos.push({
                label: item.descrip_rep,
                codigo: plantilla,
                value: this.texto_descripcion.trim(),
              });
            }
          }
        }
      }

      if (seccion == 12) {
        if (this.form.plant_recomendaciones) {
          this.tab_recomendaciones = [];
          for (const item of this.form.plant_recomendaciones) {
            plantilla = item.nro_rep;
            await this.get_plantilla(seccion, plantilla);

            if (this.texto_descripcion) {
              this.tab_recomendaciones.push({
                label: item.descrip_rep,
                codigo: plantilla,
                value: this.texto_descripcion.trim(),
              });
            }
          }
        }
      }
    },
    async get_plantilla(seccion, plantilla) {
      this.loader = true;
      let tipo = 1;

      await post
        .postData({
          url: "Clinico/dlls/CfHcPlant01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            seccion +
            "|" +
            plantilla +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let descripcion64 =
            data[0].base1_rep.trim() +
            data[0].base2_rep.trim() +
            data[0].base3_rep.trim() +
            data[0].base4_rep.trim() +
            data[0].base5_rep.trim() +
            data[0].base6_rep.trim() +
            data[0].base7_rep.trim();
          this.texto_descripcion = window.atob(descripcion64);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar plantillas",
            estado: true,
          });
        });
    },
    async get_secc(seccion) {
      this.loader = true;
      let tipo = 1;

      await post
        .postData({
          url: "Clinico/dlls/CfHcPlant00J.dll",
          data: sessionStorage.Sesion + "|" + tipo + "|" + seccion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          if (seccion == 1) {
            this.plantilla = data;
          }
          if (seccion == 3) {
            this.plant_antecedentes = data;
          }
          if (seccion == 5) {
            this.plant_revsistemas = data;
          }
          if (seccion == 6) {
            this.plant_exfisico = data;
          }
          if (seccion == 12) {
            this.plant_recomendaciones = data;
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Plantilla",
            estado: true,
          });
        });
    },
    cerrar_dialogo() {
      this.historia.estado = false;
      this.clear_form();
    },
    func_expandir() {
      this.panel = [...Array(10).keys()].map((k, i) => i);
    },
    func_ocultar() {
      this.panel = [];
    },
    clear_form() {
      this.form.plant_motivo = "";
      this.form.motivo = "";
      this.form.enfactual = "";
      this.form.plant_antecedentes = "";
      this.form.plant_revsistemas = "";
      this.form.plant_exfisico = "";
      this.form.paraclinicos = "";
      this.form.analisis = "";
      this.form.plantto = "";
      this.form.plant_recomendaciones = "";

      this.form.cldx = "";
      this.form.condicion = "";
      this.form.causaing = "";

      this.form.systole = "";
      this.form.diastole = "";
      this.form.frecard = "";
      this.form.freresp = "";
      this.form.tempera = "";
      this.form.saturacion = "";
      this.form.peso = "";
      this.form.talla = "";
      this.form.imc = "";

      this.listDiagnosticos = [];

      this.tab_motivo = [];
      this.tab_examenesFisicos = [];
      this.tab_antecedentes = [];
      this.tab_revsistemas = [];
      this.tab_paraclinic = [];
      this.tab_analisis = [];
      this.tab_plantto = [];
      this.tab_recomendaciones = [];

      this.items_tabla_medicam = [];
      this.items_tabla_examenes = [];
      this.items_tabla_ordenes = [];
      this.items_tabla_dxincapc = [];

      this.plantilla = [];
      this.plant_exfisico = [];
      this.plant_antecedentes = [];
      this.plant_revsistemas = [];
      this.plant_paraclinic = [];
      this.plant_analisis = [];
      this.plant_plantto = [];
      this.plant_plantto = [];
      this.plant_recomendaciones = [];
      this.clear_medicamentos();
      this.clear_examenes();
      this.clear_ordenes();
    },

    clear_medicamentos() {
      this.form.indicaciones = "";
      this.form.mipres = "";
      this.form.cantidad = "";
      this.form.frecuencia = "";
      this.form.duracion = "";
    },
    clear_examenes() {
      this.form.exindicaciones = "";
      this.form.exmipres = "";
      this.form.excantidad = "";
    },
    clear_ordenes() {
      this.form.ordindicaciones = "";
      this.form.ordcantidad = "";
    },

    agregarMedicamento() {
      let {
        medicamentos,
        cantidad,
        cada,
        frecuencia,
        via,
        duracion,
        tiempo,
        indicaciones,
        mipres,
        presentmed,
        totalform,
        unidadmon,
      } = this.form;
      let sel_medicamento = medicamentos ? medicamentos.descripcion_rep : "";
      let sel_cod_medicamento = medicamentos ? medicamentos.cod_rep : "";
      let sel_cantidad = cantidad ? cantidad : "0";

      if (sel_cantidad == 0) {
        this.errores.cantmedic = true;
        this.send_error("Debe asignar Cantidad");
      } else {
        let sel_cada = cada ? cada : "0";
        let sel_frecuencia = frecuencia ? frecuencia.text : "";
        let sel_idfrecuencia = frecuencia ? frecuencia.value : "0";
        let sel_presentacion = presentmed ? presentmed.descripcion_rep : "0";
        let sel_idpresentacion = presentmed ? presentmed.codigo_rep : "0";
        let sel_via = via ? via.descripcion_rep : "0";
        let sel_idvia = via ? via.codigo_rep : "0";
        let sel_idtiempo = tiempo ? tiempo.value : "0";
        let sel_tiempo = tiempo ? tiempo.text : "";
        let sel_duracion = duracion ? duracion : "0";
        let sel_indicaciones = indicaciones ? indicaciones : "";
        let sel_mipres = mipres ? mipres : "0";
        let sel_canttotal = totalform ? totalform : "0";
        let sel_unidad = unidadmon ? unidadmon.text : "";
        let sel_idunidad = unidadmon ? unidadmon.value : "0";
        const item = {
          tab_codmedicamento: sel_cod_medicamento,
          tab_medicamento: sel_medicamento,
          tab_cantidad: sel_cantidad,
          tab_cada: sel_cada,
          tab_frecuencia: sel_frecuencia,
          tab_idfrecuencia: sel_idfrecuencia,
          tab_idvia: sel_idvia,
          tab_via: sel_via,
          tab_duracion: sel_duracion,
          tab_tiempo: sel_tiempo,
          tab_idtiempo: sel_idtiempo,
          tab_indicaciones: sel_indicaciones,
          tab_mipres: sel_mipres,
          tab_presentacion: sel_presentacion,
          tab_idpresentacion: sel_idpresentacion,
          tab_cantotal: sel_canttotal,
          tab_unidad: sel_unidad,
          tab_idunidad: sel_idunidad,
        };
        this.items_tabla_medicam.push(item);
      }
    },
    agregarExamen() {
      let { examenes, excantidad, exindicaciones, exmipres } = this.form;

      let sel_examen = examenes ? examenes.descgral_rep : "";
      let sel_cod_examen = examenes ? examenes.codigo_rep : "";
      let sel_excantidad = excantidad ? excantidad : "0";
      let sel_exindicaciones = exindicaciones ? exindicaciones : "";
      let sel_exmipres = exmipres ? exmipres : "0";

      const item = {
        tab_codmexamen: sel_cod_examen,
        tab_examen: sel_examen,
        tab_excantidad: sel_excantidad,
        tab_exindicaciones: sel_exindicaciones,
        tab_exmipres: sel_exmipres,
      };
      this.items_tabla_examenes.push(item);
    },
    agregarDxInc() {
      let sel_coddx = this.form.dx_inc.codigo;
      let sel_descrdx = this.form.dx_inc.descripcion;

      const item = {
        tab_coddxinc: sel_coddx,
        tab_descrdxinc: sel_descrdx,
      };
      this.items_tabla_dxincapc.push(item);
    },
    agregarOrden() {
      let { ordenmed, ordcantidad, ordindicaciones } = this.form;

      let sel_orden = ordenmed ? ordenmed.descgral_rep : "";
      let sel_cod_orden = ordenmed ? ordenmed.codigo_rep : "";
      let sel_cant = ordcantidad ? ordcantidad : "0";
      let sel_indica = ordindicaciones ? ordindicaciones : "";

      const item = {
        tab_codorden: sel_cod_orden,
        tab_orden: sel_orden,
        tab_ordcantidad: sel_cant,
        tab_ordindicaciones: sel_indica,
      };
      this.items_tabla_ordenes.push(item);
    },
    borrar_examen(item) {
      let index = this.items_tabla_examenes.indexOf(item);
      this.items_tabla_examenes.splice(index, 1);
    },
    borrar_dxinc(item) {
      let index = this.items_tabla_dxincapc.indexOf(item);
      this.items_tabla_dxincapc.splice(index, 1);
    },
    borrar_medic(item) {
      let index = this.items_tabla_medicam.indexOf(item);
      this.items_tabla_medicam.splice(index, 1);
    },
    borrar_orden(item) {
      let index = this.items_tabla_ordenes.indexOf(item);
      this.items_tabla_ordenes.splice(index, 1);
    },
    cerrar_ordenes() {
      if (this.form.ordenes == 1) {
        this.medicamentos.estado = false;
      }
      if (this.form.ordenes == 2) {
        this.examenes.estado = false;
      }
      if (this.form.ordenes == 3) {
        this.remision.estado = false;
      }
      if (this.form.ordenes == 4) {
        let cantidad = 0;
        if (this.form.fechaini_inc && this.form.fechafinal_inc) {
          cantidad = parseFloat(this.form.cantidad_inc);
        }
        if (this.items_tabla_dxincapc.length == 0) {
          this.errores.diagnostico_inc = true;
          this.send_error("Debe seleccionar un diagnostico !");
        } else if (cantidad < 1) {
          this.errores.fechaini_inc = true;
          this.errores.fechafinal_inc = true;
          this.send_error(
            "Error en cantidad de dias Verificar Fecha inicial y final !"
          );
        } else if (!this.form.prorroga) {
          this.errores.prorroga = true;
          this.send_error("Debe indicar si es prÃ³rroga !");
        } else if (!this.form.origen) {
          this.errores.origen = true;
          this.send_error("Debe indicar el origen !");
        } else {
          this.incapacidad.estado = false;
        }
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
    get_medicamentos() {
      post
        .postData({
          // url: "Clinico/dlls/prhcmedicamj.dll",
          // data: sessionStorage.Sesion + "|",
          url: "Clinico/dlls/CfMedicamentoHcJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",

          method: "",
        })
        .then((data) => {
          this.load_personal = false;
          data.pop();
          this.item_medicamentos = data;
        })
        .catch((err) => {
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    get_vias() {
      post
        .postData({
          url: "Clinico/dlls/prhcviasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.load_personal = false;
          data.pop();
          this.viaadmon = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vias de Administracion",
            estado: true,
          });
        });
    },
    get_present() {
      post
        .postData({
          url: "Clinico/dlls/prhcpresentJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.load_personal = false;
          data.pop();
          this.presentmed = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Presentaciones",
            estado: true,
          });
        });
    },
    get_examenes() {
      post
        .postData({
          url: "Clinico/dlls/PrexamenhcJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.load_personal = false;
          data.pop();
          this.item_examen = data;
        })
        .catch((err) => {
          console.log(err);
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    get_ordenes() {
      post
        .postData({
          url: "Clinico/dlls/PrOrdhclJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.load_personal = false;
          data.pop();
          this.item_orden = data;
        })
        .catch((err) => {
          console.log(err);
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar medicamentos",
            estado: true,
          });
        });
    },
    async procesar_ordenes(consecutivo) {
      let seccion = 111;
      await this.imprimir_ordenes(seccion, consecutivo);
      seccion = 112;
      await this.imprimir_ordenes(seccion, consecutivo);
      seccion = 113;
      await this.imprimir_ordenes(seccion, consecutivo);
      seccion = 114;
      await this.imprimir_ordenes(seccion, consecutivo);
    },

    async imprimir_ordenes(seccion, consecutivo) {
      let idpaciente = this.infopaciente[0].idpaciente_rep;

      console.log("Iniciando impresiÃ³n para la secciÃ³n:", seccion); // Verifica si llega aquÃ­ correctamente

      await post
        .postData({
          url: "Clinico/dlls/ClHclinica01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            consecutivo +
            "|" +
            seccion +
            "|" +
            idpaciente +
            "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          data = JSON.parse(JSON.stringify(data))[0];
          data.empresa = this.datosEmpresa;

          let profesional = data.idprofes_rep;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = require(`../../assets/image/firmas/${parseFloat(
            profesional
          )}.png`);
          let logo = await this.pdfs.getBase64(logo_src);
          let firma = await this.pdfs.getBase64(firma_src);
          data.logo = logo;
          data.firma = firma;

          if (seccion === 114) {
            await incapacidad(data).then(() => {
              console.log("ImpresiÃ³n de incapacidad terminada");
            });
          } else {
            await OrdenMedica(data).then(() => {
              console.log("ImpresiÃ³n de orden mÃ©dica terminada");
            });
          }
        })
        .catch((err) => {
          console.log("Error en imprimir_ordenes:", err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Historia",
            estado: true,
          });
        });
    },

    validar_tiempo() {
      if (this.form.frecuencia.value == "2" && this.form.tiempo.value == "1") {
        this.errores.tiempo = true;
        this.send_error("Tiempo no Compatible con la frecuencia");
      }
      if (
        this.form.frecuencia.value == "3" &&
        (this.form.tiempo.value == "1" || this.form.tiempo.value == "2")
      ) {
        this.errores.tiempo = true;
        this.send_error("Tiempo no Compatible con la frecuencia");
      }
      if (
        this.form.frecuencia.value == "4" &&
        (this.form.tiempo.value == "1" ||
          this.form.tiempo.value == "2" ||
          this.form.tiempo.value == "3")
      ) {
        this.errores.tiempo = true;
        this.send_error("Tiempo no Compatible con la frecuencia");
      }
      if (
        this.form.frecuencia.value == "5" &&
        (this.form.tiempo.value == "1" ||
          this.form.tiempo.value == "2" ||
          this.form.tiempo.value == "3" ||
          this.form.tiempo.value == "4")
      ) {
        this.errores.tiempo = true;
        this.send_error("Tiempo no Compatible con la frecuencia");
      }
      if (
        this.form.frecuencia.value == "6" &&
        (this.form.tiempo.value == "1" ||
          this.form.tiempo.value == "2" ||
          this.form.tiempo.value == "3" ||
          this.form.tiempo.value == "4" ||
          this.form.tiempo.value == "5")
      ) {
        this.errores.tiempo = true;
        this.send_error("Tiempo no Compatible con la frecuencia");
      }
    },
    cancelar_inc() {
      this.form.paciente_inc = null;
      this.form.historia_inc = null;
      this.form.entidad_inc = null;
      this.items_tabla_dxincapc = [];

      this.form.fechaini_inc = null;
      this.form.fechafinal_inc = null;
      this.form.cantidad_inc = null;
      this.form.observacion_inc = null;
      this.incapacidad.estado = false;
    },
    calcularDias() {
      const fechaInicial = new Date(this.form.fechaini_inc);
      const fechaFinal = new Date(this.form.fechafinal_inc);
      const diferenciaMilisegundos = fechaFinal - fechaInicial;

      const milisegundosPorDia = 1000 * 60 * 60 * 24;
      const diferenciaDias = diferenciaMilisegundos / milisegundosPorDia;
      this.form.cantidad_inc = Math.floor(diferenciaDias) + 1;
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

