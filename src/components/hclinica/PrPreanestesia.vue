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
                >mdi-text-box-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                <v-row class="d-flex mb-4 justify-center" no-gutters>
                  <v-col class="d-flex mt-3" cols="4">Pre Anestesia </v-col>
                </v-row>
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
                <v-divider
                  class="mt-3"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="this.form.consultorio != null"
            >
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
              :items="agendaPaciente"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>


    <v-dialog
      v-model="historia.estado"
      persistent
      width="1200"
      overflow-hidden
      scrollable
    >
      <v-card
        color="#3861ad"
        class="overflow-hidden white--text"
        :style="{
          position: 'relative',
        }"
      >
        <v-card-title color="indigo darken-1" dark>
          <v-row class="px-6 mt-0 justify-left">
            <span class="subtitle-1">Paciente: {{ historia.paciente }}</span>
            <span class="subtitle-1 ml-10"
              >Edad: {{ edad.anos }} Años {{ edad.meses }} Meses{{
                edad.dias
              }}
              Dias</span
            >
            <span class="subtitle-1 ml-10 justify-end"
              >Acompañante: {{ historia.acompañante }}</span
            >
          </v-row>
          <v-row class="px-6 mt-6 justify-left">
            <div class="justify-end d-flex pb-4">
              <div class="d-flex ml-10">
                <v-btn
                  @click="func_expandir"
                  color="black darken-1"
                  class="white--text"
                  >Expandir
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
        </v-card-title>

        <v-card-text
          :style="{
            overflow: 'auto',
          }"
        >
          <v-tabs
            v-model="tab"
            centered
            slider-color="red"
            background-color="#dde2f4"
          >
            <v-tab class="black--text" grow>Pre Anestesia</v-tab>
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
                    <!-- Especialidades-->
                    <v-expansion-panel>
                      <v-expansion-panel-header
                        @click="get_secc(1)"
                        color="#e2e2f3"
                      >
                        <v-row class="px-6 mt-0">
                          <v-icon
                            class="px-6 mr-1"
                            color="orange accent-3"
                            x-large
                            >mdi-chat-alert-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >1.Especialidades</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <div>
                              <v-textarea
                                label="Especialidades"
                                outlined
                                clearable
                                hide-details
                                v-model="form.especialidad"
                                auto-grow
                                rows="1"
                                row-height="5"
                              ></v-textarea>
                            </div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- Procedimiento -->
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="indigo" x-large
                            >mdi-emoticon-sick-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >2.Procedimiento</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Procedimiento"
                              v-model="form.procedimiento"
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
                        color="#e2e2f3"
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
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Anestesicos"
                              v-model="form.anestesicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Complicaciones"
                              v-model="form.complicaciones"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Alergicos"
                              v-model="form.alergicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Farmacologicos"
                              v-model="form.farmacologicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Hemorragicos"
                              v-model="form.hermorragicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Patologicos"
                              v-model="form.patologicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Quirurgicos"
                              v-model="form.quirurgicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Toxicos"
                              v-model="form.toxicos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Transfuncionales"
                              v-model="form.tranfuncionales"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
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
                              :style="{ color: getColorImc }"
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
                                @change="get_imc()"
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
                                @change="get_imc()"
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
                          <v-col cols="3">
                            <div>
                              <v-text-field
                                label="ClasificaciÃ³n"
                                hide-details="auto"
                                v-model="form.clasificaimc"
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
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- examen fisico -->
                    <v-expansion-panel>
                      <v-expansion-panel-header @click="get_secc(6)">
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="deep-purple" x-large
                            >mdi-format-list-checks</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >5.ExÃ¡men FÃ­sico</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Cabeza"
                              v-model="form.cabeza"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="TorÃ¡x"
                              v-model="form.torax"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Abdomen"
                              v-model="form.abdomen"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Otros Hallazgos"
                              v-model="form.otros_hallazgos"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Extremidades"
                              v-model="form.extremidades"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Laboratorios -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="#e2e2f3">
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="orange" x-large
                            >mdi-account-search</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >6.Examenes de Laboratorio</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Examenes de Laboratorio"
                              v-model="form.examen_lab"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Apoyo dx -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="#e2e2f3">
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="orange" x-large
                            >mdi-account-search</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >7.Examenes Apoyo Diagnostico</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Apoyo Diagnostico"
                              v-model="form.apoyo_dx"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Clasificacion asa -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="#e2e2f3">
                        <v-row class="px-6 mt-0">
                          <v-icon
                            class="px-6 mr-1"
                            color="grey darken-4"
                            x-large
                            >mdi-clipboard-text-search-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >8.Clasificacion ASA</span
                          >
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              outlined
                              clearable
                              label="Clasificacion ASA"
                              v-model="form.clase_asa"
                              hide-details
                              auto-grow
                              rows="1"
                              row-height="5"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- recomendaciones -->
                    <v-expansion-panel>
                      <v-expansion-panel-header @click="get_secc(12)">
                        <v-row class="px-6 mt-0">
                          <v-icon class="px-6 mr-1" color="deep-purple" x-large
                            >mdi-file-document-edit-outline</v-icon
                          >
                          <span class="Heading 3 font-weight-medium"
                            >9.Recomendaciones</span
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
                  <v-row class="mt-3 justify-center d-flex pb-4">
                    <div class="justify-end d-flex pb-4">
                      <div class="d-flex ml-10">
                        <v-btn
                          @click="cerrar_dialogo()"
                          color="indigo"
                          class="white--text"
                          >Grabar
                        </v-btn>
                      </div>

                      <div class="d-flex ml-3">
                        <v-btn
                          @click="cerrar_dialogo"
                          color="red darken-1"
                          class="white--text"
                          :disabled="disabled.salirsin_hc"
                          >Salir sin Grabar
                        </v-btn>
                      </div>
                    </div>
                  </v-row>
                </template>
              </v-card>
            </v-tab-item>


          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

import { historiaClinica } from "../../_formatos_sal.js";
import { OrdenMedica, incapacidad } from "../../_formatos_sal.js";
import PDFMerger from "pdf-merger-js/browser";

export default {
  components: {},
  data() {
    return {
      search: null,
      pickerActual: false,
      pickeFechaAcc: false,
      load_personal: true,
      selectPersonal: null,
      load_table: false,
      texto_descripcion: null,
      tipo_hc: null,
      pickerFechaFinal: false,
      pickeFechaIni: false,
      item_envio: {},

      tiposervhc: 0,
      origen_hc: 0,
      tipo_busq: 0,
      secc_motivo: true,
      secc_enfactual: true,
      secc_anteced: true,
      secc_signos: true,
      secc_exfisico: true,
      secc_paraclin: true,
      secc_dx: true,
      secc_analisis: true,
      secc_tratamiento: true,
      secc_ordenes: true,
      secc_recomendacion: true,

      idpaciente: 0,
      idpacientehc: 0,
      nro_hist: 0,

      edadpaciente: "",
      epspaciente: "",
      sede: "0001",
      profesional: 0,

      selectObjPersonal: [],
      datosagenda: [],
      consultorios: [],
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

      diagnosticos: [],
      item_medicamentos: [],
      item_examen: [],
      item_orden: [],
      item_material: [],

      seccion: [],
      agendaPaciente: [],
      card: {
        loader: false,
        disabled: false,
      },

      disabled: {
        guardar_hc: true,
        imprimir_hc: true,
        sgte_paciente: true,
        salirsin_hc: false,
      },

      form: {
        motivo: null,
        imc: null,
        tipohc: null,
        todos: false,
        atendidos: false,
        espera: false,
        descripaciente: null,
      },
      tab: 0,
      viaadmon: [],
      presentmed: [],

      personal: [],
      fechaag: null,
      horaag: null,
      consecutivo: 0,
      item_select: null,
      panel_gonios: false,

      tab2: null,
      dialogo: {
        estado: false,
        titulo: null,
        paciente: null,
        tipo: null,
        item: {},
      },
      dialogocorreo: {
        estado: false,
        titulo: null,
      },
      dialogorechazo: {
        estado: false,
        titulo: null,
      },

      notifica: {
        estado: false,
        paciente: null,
        texto: null,
      },

      dialogo_medicamento: {
        estado: false,
        titulo: null,
      },
      tipohistoria: {
        estado: false,
        titulo: null,
      },

      edad: {
        anos: 0,
        meses: 0,
        dias: 0,
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      historia: {
        estado: false,
        estado2: false,
        plantila: null,
      },
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
      materiales: {
        estado: false,
        plantila: null,
      },
      incapacidad: {
        estado: false,
        plantila: null,
      },

      errores: {
        salas: false,
        cldx: false,
        condicion: false,
        causaing: false,
        clasificacion: false,
        diagnostico: false,
        cantexam: false,
        cantmedic: false,
        cantorden: false,
        tipohistoria: false,
        tiempo: false,
        fechaacc_inc: false,
        fechaini_inc: false,
        finalidad: false,
      },
      items_tabla_medicam: [],
      items_tabla_examenes: [],
      items_tabla_ordenes: [],
      items_tabla_materiales: [],
      items_tabla_dxincapc: [],

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
      headers_tabla_ordenes: [
        { text: "Orden", align: "left", value: "tab_orden" },
        { text: "Cantidad", align: "center", value: "tab_ordcantidad" },
        { text: "Indicaciones", align: "left", value: "tab_ordindicaciones" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      headers_tabla_materiales: [
        { text: "Insumo", align: "left", value: "tab_material" },
        { text: "Cantidad", align: "center", value: "tab_matcantidad" },
        { text: "Indicaciones", align: "left", value: "tab_matindicaciones" },
        { text: "Opciones", value: "edit", align: "center" },
      ],

      headers_dx_incapac: [
        { text: "Codigo", align: "left", value: "tab_coddxinc" },
        { text: "DescripciÃ³n", align: "left", value: "tab_descrdxinc" },
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
      headers: [
        {
          text: "AcciÃ³n",
          align: "center",
          value: "btn_atencion",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Estado",
          align: "center",
          value: "descr_estado",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Servicio",
          align: "center",
          value: "desc_servicio",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Fecha",
          align: "center",
          value: "fecha",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Hora",
          align: "center",
          value: "id_hora",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Entidad",
          align: "center",
          value: "contrato",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Imprimir",
          align: "center",
          value: "btn_atender",
          class: "indigo--text blue lighten-5",
        },
        {
          text: "Correo",
          align: "center",
          value: "btn_correo",
          class: "indigo--text blue lighten-5",
        },

        {
          text: "Nro_Historia",
          align: "center",
          value: "nrohcl",
          class: "indigo--text blue lighten-5",
        },

        // { text: "Acciones", align: "center", value: "acciones" },
        // { text: "Descargar", align: "center", value: "btn_pdf" },
      ],
      load_card: false,
      panel: [],
      panel_1: [],
    };
  },
  created() {
    this.get_empresa();
    this.get_consultorios();

    this.cargarPersonal();
    this.get_ordenes();
    this.get_examenes();
    this.get_diagnosticos();
    this.get_medicamentos();
    this.get_vias();
    this.get_present();
    this.get_materiales();

    // this.examenes.estado = true;
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
      if (!this.form.imc) return "rgba(0, 0, 0, 0.54)";

      let indice_mc = this.form.imc;

      if (indice_mc > 18.4 && indice_mc < 24.9) return "#63a713";
      if (indice_mc < 18.5 || indice_mc > 24.9) return "#FF0000";

      return "rgba(0, 0, 0, 0.54)";
    },
  },
  methods: {
    cerrar_creamedica() {
      this.dialogo_medicamento = false;
    },
    crear_medicamento() {
      this.dialogo_medicamento = true;
    },
    guardar_medicamento() {
      this.dialogo_medicamento = false;
    },
    tab_cerrar() {
      this.tab = 1;
      this.disabled.guardar_hc = false;
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
          this.form.espera = true;
          this.form.atendidos = false;
          this.form.todos = false;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
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

      if (sel_excantidad == 0) {
        this.errores.cantexam = true;
        this.send_error("Debe asignar Cantidad");
      } else {
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
      }
    },

    agregarOrden() {
      let { ordenmed, ordcantidad, ordindicaciones } = this.form;

      let sel_orden = ordenmed ? ordenmed.descgral_rep : "";
      let sel_cod_orden = ordenmed ? ordenmed.codigo_rep : "";
      let sel_cant = ordcantidad ? ordcantidad : "0";
      if (sel_cant == 0) {
        this.errores.cantorden = true;
        this.send_error("Debe asignar Cantidad");
      } else {
        let sel_indica = ordindicaciones ? ordindicaciones : "";

        const item = {
          tab_codorden: sel_cod_orden,
          tab_orden: sel_orden,
          tab_ordcantidad: sel_cant,
          tab_ordindicaciones: sel_indica,
        };
        this.items_tabla_ordenes.push(item);
      }
    },
    agregarMaterial() {
      let { ordenmat, matcantidad, matindicaciones } = this.form;
      let sel_orden = ordenmat ? ordenmat.descgral_rep : "";
      let sel_cod_orden = ordenmat ? ordenmat.codigo_rep : "";
      let sel_cant = matcantidad ? matcantidad : "0";
      if (sel_cant == 0) {
        this.errores.matcantidad = true;
        this.send_error("Debe asignar Cantidad");
      } else {
        let sel_indica = matindicaciones ? matindicaciones : "";

        const item = {
          tab_codmat: sel_cod_orden,
          tab_material: sel_orden,
          tab_matcantidad: sel_cant,
          tab_matindicaciones: sel_indica,
        };
        this.items_tabla_materiales.push(item);
      }
    },
    addDiagnostico() {
      this.listDiagnosticos.push({
        value: null,
      });
    },
    addDiagnostico_cargue(dxing) {
      // Buscar el diagnÃ³stico en la lista de diagnÃ³sticos
      let busqueda_dx = this.diagnosticos.find(
        (el) => el.codigo && el.codigo.trim() == dxing.trim()
      );

      this.listDiagnosticos.push({
        value: busqueda_dx || null,
      });
    },

    format_consultorios(val) {
      return `${val.descripcion_rep}`;
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
      } else if (!this.form.finalidad) {
        this.errores.finalidad = true;
        this.send_error("Selecciona una Finalidad de consulta");
      } else {
        var sesion = sessionStorage.Sesion;
        let fechahc = this.fecha_actual.replace(/-/g, "");
        let plano = {};
        let index = 0;
        this.nro_hist = null;
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
        let finalidad = this.form.finalidad.value;
        let consultorio = this.form.consultorio.codigo_rep;
        let acompañante = this.dialogo.acompañante;
        let telacompañante = this.dialogo.telacompañante;

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
            let codigo_dx = item.value.codigo
              ? item.value.codigo.trim()
              : item.value.trim();
            plano[`DATOJ_008-${format_index}`] = `${codigo_dx} | ${textodx}`;
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

        // let ordenes = this.items_tabla_ordenes;
        // ordenes.forEach((item, index) => {
        //   let format_index = (index + 1).toString().padStart(3, "0");
        //   let textob64 = window.btoa(unescape(encodeURIComponent(item.tab_ordindicaciones)));
        //       cantidad_lineas = Math.ceil(textob64.length / 900);

        //   plano[`DATOJ_113-${format_index}`] = `${item.tab_codorden.trim()}| ${item.tab_ordcantidad}|${textob64}|`;
        // });

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

          // let recomendaciones = this.tab_recomendaciones;
          // recomendaciones.forEach((item, index) => {
          //   let format_index = (index + 1).toString().padStart(3, "0");
          //   let textob64 = window.btoa(unescape(encodeURIComponent(item.value)));
          //   plano[`DATOJ_012-${format_index}`] = `${item.codigo}| ${textob64}`;
        });

        let datosEnvio =
          sesion +
          "|" +
          this.idpaciente +
          "|" +
          this.edad.anos +
          "|" +
          this.edad.meses +
          "|" +
          this.edad.dias +
          "|" +
          this.epspaciente +
          "|" +
          this.profesional +
          "|" +
          this.sede +
          "|" +
          // motivo +
          // "|" +
          // enf_actual +
          // "|" +
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
          "|" +
          consultorio +
          "|" +
          this.fechaag +
          "|" +
          this.horaag +
          "|" +
          fechahc +
          "|" +
          this.prservicio +
          "|" +
          acompañante +
          "|" +
          telacompañante +
          "|" +
          finalidad +
          "|";
        let data = {
          url: "Clinico/dlls/ClPrHistoria.dll",
          data: { importarhtml: datosEnvio, ...plano },
          method: "",
          json: true,
        };

        post.postData(data).then((response) => {
          this.disabled.guardar_hc = true;
          this.disabled.imprimir_hc = false;
          this.disabled.sgte_paciente = false;
          this.disabled.salirsin_hc = true;
          this.clear_form;
          this.cargarAgendamiento();
          this.atender();
          this.nro_hist = response[0];
        });
      }
    },
    atender(item, tipo, evento) {
      let agenciatr = this.item_select.turno.substr(8, 4);
      let codtr = this.item_select.turno.substr(12, 6);
      let idtr = this.item_select.turno.substr(18, 4);
      let agenciavt = agenciatr;
      let idvt = this.item_select.identificacion;

      let total = 1;
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
          this.$emit("snack", {
            color: "success",
            text: "Paciente Atendido",
            estado: false,
          });
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
    llamar_cita(item, tipo) {
      let agenciatr = item.turno.substr(8, 4);
      let codtr = item.turno.substr(12, 6);
      let idtr = item.turno.substr(18, 4);
      let agenciavt = agenciatr;
      let idvt = item.identificacion;
      let consultorio = this.form.consultorio.descripcion_rep.trim();
      let total = 1;
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/Prfilaturno01.dll",
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
            "|" +
            consultorio +
            "|",
          method: "",
        })
        .then((data) => {
          let mensaje = "En llamado";
          this.$emit("snack", {
            color: "success",
            text: mensaje,
            estado: true,
          });
          // this.buscar_turnos(9);
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
    async imprimir_hc(item, sendEmail, proceso) {
      let paciente = 0;
      let consecutivo = 0;

      if (!proceso) {
        proceso = 3;
      }
      // this.nro_hist = 6539;
      // this.idpaciente = 86007243

      if (this.nro_hist > 0) {
        paciente = this.idpaciente;
        consecutivo = this.nro_hist;
      } else {
        paciente = item.id_paciente;
        consecutivo = item.nrohcl;
        this.idpaciente = paciente;
      }
      try {
        this.loader = true;

        if (proceso == 1 || proceso == 3) {
          let response = await post.postData({
            url: "Clinico/dlls/ClHclinicaJ.dll",
            data: `${sessionStorage.Sesion}|${paciente}|${consecutivo}|`,
            method: "",
          });
          let data = JSON.parse(JSON.stringify(response))[0];
          data.empresa = this.datosEmpresa;
          data.edad_rep = data.edad_rep.replace("n", "ñ");
          let profesional2 = parseInt(data.idprofes2_rep);

          if (data.firma_rep === "2") {
            this.profesional = "0000000000";
          }
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = require(`../../assets/image/firmas/${parseFloat(
            this.profesional
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
          let data_envio = data;
          let blob = await historiaClinica(data, sendEmail);
          if (proceso == 3) {
            proceso = 0;
            this.procesar_ordenes(consecutivo);
          }
        }
        this.loader = false;
        if (proceso == 2 || proceso == 3) {
          this.procesar_ordenes(consecutivo);
        }
      } catch (err) {
        console.error("Error Imprimir Hc:", err);
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar Historia",
          estado: true,
        });
      }
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
      seccion = 115;
      await this.imprimir_ordenes(seccion, consecutivo);
    },
    async imprimir_ordenes(seccion, consecutivo) {
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
            this.idpaciente +
            "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;

          data = JSON.parse(JSON.stringify(data))[0];
          data.empresa = this.datosEmpresa;
          let profesional2 = parseInt(data.idprofes2_rep);

          for (let i = 0; i < data.secciones_rep.length; i++) {
            const el = data.secciones_rep[i];

            if (parseFloat(el.seccion_rep) === seccion) {
              var logo_src = require(`../../assets/image/clientes/${parseFloat(
                sessionStorage.Sesion.substr(0, 15)
              )}.png`);

              let firma_src = require(`../../assets/image/firmas/${parseFloat(
                this.profesional
              )}.png`);
              let logo = await this.pdfs.getBase64(logo_src);
              let firma = await this.pdfs.getBase64(firma_src);
              data.logo = logo;
              data.firma = firma;

              if (parseInt(profesional2) > 0) {
                let firma2_src = require(`../../assets/image/firmas/${parseFloat(
                  profesional2
                )}.png`);

                let firma2 = await this.pdfs.getBase64(firma2_src);
                data.firma2 = firma2;
              }

              await this.pdfs.getBase64(logo_src).then(async (logo) => {
                data.logo = logo;

                if (seccion === 114) {
                  await incapacidad(data).then(() => {
                    console.log("ImpresiÃ³n de incapacidad terminada");
                  });
                } else {
                  await OrdenMedica(data).then(() => {
                    console.log("ImpresiÃ³n de orden mÃ©dica terminada");
                  });
                }
              });
            }
          }
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
    cerrar_dialogo() {
      this.historia.estado = false;
      this.cargarAgendamiento();
      this.clear_form();
    },
    cerrar_dialogo_gonom() {
      this.tipohistoria.estado = false;
      this.historia_gonom.estado = false;
      this.cargarAgendamiento();
      this.clear_form();
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
    cargarPersonal() {
      this.profesional = sessionStorage.Sesion.substr(15, 15);
      //      let iduser = 86007243;
      post
        .postData({
          url: "Clinico/dlls/titcl30301j.dll",
          data: sessionStorage.Sesion + "|" + this.profesional + "|",
          method: "",
        })
        .then((data) => {
          this.load_personal = false;
        })
        .catch((err) => {
          console.log(err)
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar personal",
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
    get_medicamentos() {
      post
        .postData({
          url: "Clinico/dlls/CfMedicamentoHcJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",

          // url: "Clinico/dlls/prhcmedicamj.dll",
          // data: sessionStorage.Sesion + "|",
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
    get_materiales() {
      post
        .postData({
          url: "Clinico/dlls/PrOrdMatJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.load_personal = false;
          data.pop();
          this.item_material = data;
        })
        .catch((err) => {
          console.log(err);
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Insumos",
            estado: true,
          });
        });
    },

    change_select(tipo) {
      this.tipo_busq = 0;
      if (tipo == 1 && this.form.espera) {
        this.form.todos = false;
        this.form.atendidos = false;
        this.tipo_busq = tipo;
      }
      if (tipo == 2 && this.form.atendidos) {
        this.form.todos = false;
        this.form.espera = false;
        this.tipo_busq = tipo;
      }
      if (tipo == 3 && this.form.todos) {
        this.form.atendidos = false;
        this.form.espera = false;
        this.tipo_busq = tipo;
      }
      if (this.tipo_busq > 0) {
        this.cargarAgendamiento();
      }
    },
    cargarAgendamiento: function (value) {
      this.load_table = true;
      this.loader = true;
      if (this.tipo_busq == 0) {
        this.tipo_busq = 1;
      }
      // this.fecha_actual = "2022-10-29";
      if (parseInt(this.datosEmpresa.id_empr) == 9001087930) {
        this.fecha_actual = this.$moment().format("YYYY-MM-DD");
      }

      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.profesional +
        "|" +
        1 +
        "|" +
        this.tipo_busq +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl105hcJ.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.datosagenda = data;
          this.agendaPaciente = [];
          data.forEach((k, v) => {
            k.nro = (v + 1).toString().padStart(2, "0");

            if (k.prservicio === "00000000000000000") {
              k.descr_estado = "Sin Asistir";
            }
            if (parseFloat(k.nrohcl) > 0) {
              k.descr_estado = "Atendido";
            }
            if (parseFloat(k.nrohcl) < 1 && parseFloat(k.prservicio) > 1) {
              k.descr_estado = "En Espera";
            }

            if (k.estado_ag === "4") {
              k.descr_estado = "Rechazado";
            }
            if (k.identificacion) this.agendaPaciente.push(k);
          });
          this.load_table = false;
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
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
    async get_subsecc(seccion) {
      this.loader = true;
      let tipo = 1;

      await post
        .postData({
          url: "Financiero/dlls/CfHcseccionJ.dll",
          data: sessionStorage.Sesion + "|" + tipo + "|" + seccion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.plantilla = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Secciones",
            estado: true,
          });
        });
    },
    async select_subseccion(seccion) {
      if (seccion == 3) {
        let selec_seccion = this.form.secc_antecedentes.nro_rep;
        await this.get_plantilla_secc(seccion, selec_seccion);
      }
      if (seccion == 4) {
        let selec_seccion = this.form.secc_revsistemas.nro_rep;
        await this.get_plantilla_secc(seccion, selec_seccion);
      }
      if (seccion == 6) {
        let selec_seccion = this.form.secc_exfisico.nro_rep;
        await this.get_plantilla_secc(seccion, selec_seccion);
      }
      if (seccion == 7) {
        let selec_seccion = this.form.secc_paraclinic.nro_rep;
        await this.get_plantilla_secc(seccion, selec_seccion);
      }
      if (seccion == 9) {
        let selec_seccion = this.form.secc_analisis.nro_rep;
        await this.get_plantilla_secc(seccion, selec_seccion);
      }
      if (seccion == 10) {
        let selec_seccion = this.form.secc_plantto.nro_rep;
        await this.get_plantilla_secc(seccion, selec_seccion);
      }
    },
    async get_plantilla_secc(seccion, selec_seccion) {
      this.loader = true;
      let tipo = 1;

      await post
        .postData({
          url: "Clinico/dlls/CfHcPlantillaJ.dll",
          data: sessionStorage.Sesion + "|" + tipo + "|" + selec_seccion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          if (seccion == 6) {
            this.plant_exfisico = data;
          }
          if (seccion == 3) {
            this.plant_antecedentes = data;
          }
          if (seccion == 4) {
            this.plant_revsistemas = data;
          }
          if (seccion == 7) {
            this.plant_paraclinic = data;
          }
          if (seccion == 9) {
            this.plant_analisis = data;
          }
          if (seccion == 10) {
            this.plant_plantto = data;
          }
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
    removeExamen(item, index) {
      if (item == 3) {
        this.tab_antecedentes.splice(index, 1);
      }
      if (item == 5) {
        this.tab_revsistemas.splice(index, 1);
      }
      if (item == 6) {
        this.tab_examenesFisicos.splice(index, 1);
      }
      if (item == 7) {
        this.tab_paraclinic.splice(index, 1);
      }
      if (item == 9) {
        this.tab_analisis.splice(index, 1);
      }
      if (item == 10) {
        this.tab_plantto.splice(index, 1);
      }
      if (item == 12) {
        this.tab_recomendaciones.splice(index, 1);
      }
    },
    borrar_examen(item) {
      let index = this.items_tabla_examenes.indexOf(item);
      this.items_tabla_examenes.splice(index, 1);
    },
    borrar_medic(item) {
      let index = this.items_tabla_medicam.indexOf(item);
      this.items_tabla_medicam.splice(index, 1);
    },
    borrar_orden(item) {
      let index = this.items_tabla_ordenes.indexOf(item);
      this.items_tabla_ordenes.splice(index, 1);
    },
    borrar_material(item) {
      let index = this.items_tabla_materiales.indexOf(item);
      this.items_tabla_materiales.splice(index, 1);
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
        this.incapacidad.estado = true;
        this.form.paciente_inc = this.item_select.descrip_paciente;
        this.form.entidad_inc = this.item_select.contrato;
        this.form.fechaini_inc = this.fecha_actual;
      }
      if (this.form.ordenes == 5) {
        this.materiales.estado = true;
        this.form.matcantidad = 1;
      }
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
        this.incapacidad.estado = false;
      }
      if (this.form.ordenes == 5) {
        this.materiales.estado = false;
      }
    },
    format_plantilla(val) {
      return `${val.descrip_rep.trim()}`;
    },
    format_subseccion(val) {
      return `${val.descrip_rep.trim()}`;
    },
    format_seccion(val) {
      return `${val.descrip_rep.trim()}`;
    },
    format_vias: function (val) {
      return `${val.descripcion_rep} `;
    },
    format_presentmed: function (val) {
      return `${val.descripcion_rep} `;
    },
    func_expandir() {
      this.panel = [...Array(10).keys()].map((k, i) => i);
    },
    func_ocultar() {
      this.panel = [];
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

    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion.trim();
    },
    format_medicamentos(val) {
      // return val.descgral_rep.trim() + " - " + val.concentr_rep.trim();
      return val.descripcion_rep.trim();
    },
    format_examenes(val) {
      return val.descgral_rep.trim() + "_Cups:" + val.codigo_rep.trim();
    },
    get_imc() {
      this.form.imc = 0;
      let peso = parseFloat(this.form.peso) || 0;
      let talla = parseFloat(this.form.talla) || 0;
      talla = (talla * talla).toFixed(2);
      let imc = ((peso / talla) * 10000).toFixed(2);
      this.form.imc = imc;
      let clasificacion = "";

      if (imc < 18.5) {
        clasificacion = "Bajo Peso";
      } else if (imc < 25) {
        clasificacion = "Peso Normal";
      } else if (imc < 30) {
        clasificacion = "SobrePeso";
      } else if (imc < 35) {
        clasificacion = "Obesidad Grado I";
      } else if (imc < 40) {
        clasificacion = "Obesidad Grado II";
      } else {
        clasificacion = "Obesidad Grado III";
      }
      if (talla == 0) {
        clasificacion = "";
        this.form.imc = 0;
      }

      this.form.clasificaimc = clasificacion;
    },
    select_origen() {
      this.origen_hc = this.form.origen.value;
    },
    clear_form() {
      this.form.motivo = null;
      this.form.enfactual = null;
      this.form.antecedentes = null;
      this.form.systole = null;
      this.form.diastole = null;
      this.form.frecard = null;
      this.form.freresp = null;
      this.form.tempera = null;
      this.form.saturacion = null;
      this.form.peso = null;
      this.form.talla = null;
      this.form.imc = null;
      this.form.clasificaimc = null;
      this.form.ex_fisico = null;
      this.form.paraclinicos = null;
      this.form.analisis = null;
      this.form.plantto = null;

      this.form.ordenmat = null;
      this.form.analisis = null;

      this.form.plant_antecedentes = null;
      this.form.plant_revsistemas = null;
      this.form.plant_exfisico = null;
      this.form.plant_paraclinicos = null;
      this.form.plant_analisis = null;
      this.form.plant_plantto = null;
      this.form.plant_recomendaciones = null;
      this.form.plant_motivo = null;
      this.form.antecedentes = null;

      this.form.cldx = null;
      this.form.condicion = null;
      this.form.causaing = null;
      this.form.finalidad = null;
      this.form.clasificacion = null;

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
      this.items_tabla_materiales = [];

      // this.plantilla = [];
      this.plant_exfisico = [];
      this.plant_antecedentes = [];
      this.plant_revsistemas = [];
      this.plant_paraclinic = [];
      this.plant_analisis = [];
      this.plant_plantto = [];
      this.plant_plantto = [];
      this.plant_recomendaciones = [];

      this.check_manos = null;
      this.form.flexion_ar_i = null;
      this.form.flexion_ar_d = null;
      this.form.extension_ar_i = null;
      this.form.extension_ar_d = null;
      this.form.dradial_ar_i = null;
      this.form.dradial_ar_d = null;
      this.form.dulnar_ar_i = null;
      this.form.dulnar_ar_d = null;
      this.form.abdpulgar_cmc_l = null;
      this.form.abdpulgar_cmc_r = null;
      this.form.adpulgar_cmc_l = null;
      this.form.adpulgar_cmc_r = null;
      this.form.opocpulgar_cmc_l = null;
      this.form.opocpulgar_cmc_r = null;
      this.form.flex_mcf_i = null;
      this.form.flex_mcf_d = null;
      this.form.ext_mcf_i = null;
      this.form.ext_mcf_d = null;
      this.form.flex_iprox_i = null;
      this.form.flex_iprox_d = null;
      this.form.ext_iprox_i = null;
      this.form.ext_iprox_d = null;
      this.form.flex_mtc_d2i = null;
      this.form.flex_mtc_d2d = null;
      this.form.ext_mtc_d2i = null;
      this.form.ext_mtc_d2d = null;
      this.form.flex_ifp_d2i = null;
      this.form.flex_ifp_d2d = null;
      this.form.ext_ifp_d2i = null;
      this.form.ext_ifp_d2d = null;
      this.form.flex_ifd_d2i = null;
      this.form.flex_ifd_d2d = null;
      this.form.ext_ifd_d2i = null;
      this.form.ext_ifd_d2d = null;
      this.form.flex_mtc_d3i = null;
      this.form.flex_mtc_d3d = null;
      this.form.ext_mtc_d3i = null;
      this.form.ext_mtc_d3d = null;
      this.form.flex_ifp_d3i = null;
      this.form.flex_ifp_d3d = null;
      this.form.ext_ifp_d3i = null;
      this.form.ext_ifp_d3d = null;
      this.form.flex_ifd_d3i = null;
      this.form.flex_ifd_d3d = null;
      this.form.ext_ifd_d3i = null;
      this.form.ext_ifd_d3d = null;
      this.form.flex_mtc_d4i = null;
      this.form.flex_mtc_d4d = null;
      this.form.ext_mtc_d4i = null;
      this.form.ext_mtc_d4d = null;
      this.form.flex_ifp_d4i = null;
      this.form.flex_ifp_d4d = null;
      this.form.ext_ifp_d4i = null;
      this.form.ext_ifp_d4d = null;
      this.form.flex_ifd_d4i = null;
      this.form.flex_ifd_d4d = null;
      this.form.ext_ifd_d4i = null;
      this.form.ext_ifd_d4d = null;
      this.form.flex_mtc_d5i = null;
      this.form.flex_mtc_d5d = null;
      this.form.ext_mtc_d5i = null;
      this.form.ext_mtc_d5d = null;
      this.form.flex_ifp_d5i = null;
      this.form.flex_ifp_d5d = null;
      this.form.ext_ifp_d5i = null;
      this.form.ext_ifp_d5d = null;
      this.form.flex_ifd_d5i = null;
      this.form.flex_ifd_d5d = null;
      this.form.ext_ifd_d5i = null;
      this.form.ext_ifd_d5d = null;
      this.form.flex_codo_i = null;
      this.form.flex_codo_d = null;
      this.form.ext_codo_i = null;
      this.form.ext_codo_d = null;
      this.form.pronac_codo_i = null;
      this.form.pronac_codo_d = null;
      this.form.supinac_codo_i = null;
      this.form.supinac_codo_d = null;
      this.form.abd_hombro_i = null;
      this.form.abd_hombro_d = null;
      this.form.aduc_hombro_i = null;
      this.form.aduc_hombro_d = null;
      this.form.flexion_hombro_i = null;
      this.form.flexion_hombro_d = null;
      this.form.extension_hombro_i = null;
      this.form.extension_hombro_d = null;
      this.form.rotext_hombro_i = null;
      this.form.rotext_hombro_d = null;
      this.form.rotint_hombro_i = null;
      this.form.rotint_hombro_d = null;
      this.form.flexion_colcerv = null;
      this.form.extension_colcerv = null;
      this.form.incizq_colcerv = null;
      this.form.incder_colcerv = null;
      this.form.rotizq_colcerv = null;
      this.form.rotder_colcerv = null;
      this.form.flexion_collumb = null;
      this.form.flexiong_collumb = null;
      this.form.extension_collumb = null;
      this.form.incizq_collumb = null;
      this.form.incder_collumb = null;
      this.form.rotizq_collumb = null;
      this.form.rotder_collumb = null;
      this.form.flexion_cadera_i = null;
      this.form.extension_cadera_i = null;
      this.form.abd_cadera_i = null;
      this.form.aduc_cadera_i = null;
      this.form.rotint_cadera_i = null;
      this.form.rotext_cadera_i = null;
      this.form.flexion_cadera_d = null;
      this.form.extension_cadera_d = null;
      this.form.abd_cadera_d = null;
      this.form.aduc_cadera_d = null;
      this.form.rotint_cadera_d = null;
      this.form.rotext_cadera_d = null;
      this.form.flexion_rodilla_i = null;
      this.form.flexion_rodilla_d = null;
      this.form.extension_rodilla_i = null;
      this.form.extension_rodilla_d = null;
      this.form.planflexion_tobillo_i = null;
      this.form.planflexion_tobillo_d = null;
      this.form.dorsflexion_tobillo_i = null;
      this.form.dorsflexion_tobillo_d = null;
      this.form.inver_tobillo_i = null;
      this.form.inver_tobillo_d = null;
      this.form.ever_tobillo_i = null;
      this.form.ever_tobillo_d = null;
      this.form.flex_pie1_i = null;
      this.form.flex_pie1_d = null;
      this.form.ext_pie1_i = null;
      this.form.ext_pie1_d = null;
      this.form.flexif_pie1_i = null;
      this.form.flexif_pie1_d = null;
      this.form.extif_pie1_i = null;
      this.form.extif_pie1_d = null;
      this.form.ext_pie2_i = null;
      this.form.ext_pie2_d = null;
      this.form.mttf_flex_pie2_i = null;
      this.form.mttf_flex_pie2_d = null;
      this.form.mttf_ext_mttf_p2i = null;
      this.form.mttf_ext_mttf_p2d = null;
      this.form.flex_ifp_p2i = null;
      this.form.flex_ifp_p2d = null;
      this.form.ext_ifp_p2i = null;
      this.form.ext_ifp_p2d = null;
      this.form.flex_ifd_p2i = null;
      this.form.flex_ifd_p2d = null;
      this.form.ext_ifd_p2i = null;
      this.form.ext_ifd_p2d = null;
      this.form.ext_pie3_i = null;
      this.form.ext_pie3_d = null;
      this.form.mttf_flex_pie3_i = null;
      this.form.mttf_flex_pie3_d = null;
      this.form.mttf_ext_mttf_p3i = null;
      this.form.mttf_ext_mttf_p3d = null;
      this.form.flex_ifp_p3i = null;
      this.form.flex_ifp_p3d = null;
      this.form.ext_ifp_p3i = null;
      this.form.ext_ifp_p3d = null;
      this.form.flex_ifd_p3i = null;
      this.form.flex_ifd_p3d = null;
      this.form.ext_ifd_p3i = null;
      this.form.ext_ifd_p3d = null;
      this.form.ext_pie4_i = null;
      this.form.ext_pie4_d = null;
      this.form.mttf_flex_pie4_i = null;
      this.form.mttf_flex_pie4_d = null;
      this.form.mttf_ext_mttf_p4i = null;
      this.form.mttf_ext_mttf_p4d = null;
      this.form.flex_ifp_p4i = null;
      this.form.flex_ifp_p4d = null;
      this.form.ext_ifp_p4i = null;
      this.form.ext_ifp_p4d = null;
      this.form.flex_ifd_p4i = null;
      this.form.flex_ifd_p4d = null;
      this.form.ext_ifd_p4i = null;
      this.form.ext_ifd_p4d = null;
      this.form.ext_pie5_i = null;
      this.form.ext_pie5_d = null;
      this.form.mttf_flex_pie5_i = null;
      this.form.mttf_flex_pie5_d = null;
      this.form.mttf_ext_mttf_p5i = null;
      this.form.mttf_ext_mttf_p5d = null;
      this.form.flex_ifp_p5i = null;
      this.form.flex_ifp_p5d = null;
      this.form.ext_ifp_p5i = null;
      this.form.ext_ifp_p5d = null;
      this.form.flex_ifd_p5i = null;
      this.form.flex_ifd_p5d = null;
      this.form.ext_ifd_p5i = null;
      this.form.ext_ifd_p5d = null;

      this.clear_medicamentos();
      this.clear_examenes();
      this.clear_ordenes();
      this.clear_incapacidad();
      this.clear_material();
    },
    clear_incapacidad() {
      this.form.fechaini_inc = "";
      this.form.fechafinal_inc = "";
      this.form.fechaacc_inc = "";
      this.form.cantidad_inc = "";
      this.form.prorroga = "";
      this.form.origen = "";
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
    clear_material() {
      this.form.matindicaciones = "";
      this.form.matcantidad = "";
    },
    format_ordenmed(val) {
      return val.descgral_rep.trim();
    },
    format_ordenmat(val) {
      return val.descgral_rep.trim();
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

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    get_tipohc(idpaciente) {
      this.tipo_hc = 2;
      this.get_notifica(idpaciente);
      this.form.tipohistoria = null;
      this.tipohistoria.estado = true;
    },
    get_notifica(idpaciente) {
      this.loader = true;
      post
        .postData({
          url: "/Clinico/dlls/PrNotificaPJ.dll",
          data: sessionStorage.Sesion + "|" + idpaciente + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let copia = null;
          data.pop();
          if (data[0].base1_rep) {
            data.forEach((el) => {
              copia = JSON.parse(JSON.stringify(el));
              let base64String =
                copia.base1_rep.trim() +
                copia.base2_rep.trim() +
                copia.base3_rep.trim() +
                copia.base3_rep.trim() +
                copia.base4_rep.trim() +
                copia.base5_rep.trim() +
                copia.base6_rep.trim() +
                copia.base7_rep.trim() +
                copia.base8_rep.trim() +
                copia.base9_rep.trim() +
                copia.base10_rep.trim() +
                copia.base11_rep.trim() +
                copia.base12_rep.trim() +
                copia.base13_rep.trim() +
                copia.base14_rep.trim() +
                copia.base15_rep.trim() +
                copia.base16_rep.trim() +
                copia.base17_rep.trim() +
                copia.base18_rep.trim() +
                copia.base19_rep.trim() +
                copia.base20_rep.trim() +
                copia.base21_rep.trim() +
                copia.base22_rep.trim() +
                copia.base23_rep.trim() +
                copia.base24_rep.trim() +
                copia.base25_rep.trim() +
                copia.base26_rep.trim() +
                copia.base27_rep.trim() +
                copia.base28_rep.trim() +
                copia.base29_rep.trim() +
                copia.base30_rep.trim() +
                copia.base31_rep.trim() +
                copia.base32_rep.trim() +
                copia.base33_rep.trim() +
                copia.base34_rep.trim() +
                copia.base35_rep.trim() +
                copia.base36_rep.trim() +
                copia.base37_rep.trim() +
                copia.base38_rep.trim() +
                copia.base39_rep.trim() +
                copia.base40_rep.trim() +
                copia.base41_rep.trim() +
                copia.base42_rep.trim() +
                copia.base43_rep.trim();
              const decodedText = Buffer.from(base64String, "base64").toString(
                "utf8"
              );
              copia.detalle_rep = decodedText;
            });
            this.notifica.estado = true;
            this.form.notifica = copia.detalle_rep.trim();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    change_tipohc() {
      this.secc_motivo = true;
      this.secc_enfactual = true;
      this.secc_anteced = true;
      this.secc_signos = true;
      this.secc_paraclin = true;
      this.secc_tratamiento = true;
      this.secc_ordenes = true;
      this.secc_recomendacion = true;

      this.tiposervhc = this.form.tipohistoria.value;
      this.historia_gonom.paciente = this.item_select.descrip_paciente.trim();
      this.historia_gonom.acompañante = this.item_select.acompanante.trim();
      this.historia_gonom.telacompañante = this.item_select.telacompanante;
      this.edad.anos = this.item_select.anosedad_rep;
      this.edad.meses = this.item_select.mesesedad_rep;
      this.edad.dias = this.item_select.diasedad_rep;
      this.tab = 0;
      this.disabled.salirsin_hc = false;
      this.historia_gonom.estado = true;
      let dxing = this.item_select.dx.trim();
      let tipo_select_hc = this.form.tipohistoria.value;
      if (tipo_select_hc == 2) {
        this.secc_enfactual = true;
        this.secc_motivo = false;
        this.secc_anteced = true;
      }

      if (tipo_select_hc == 3) {
        this.secc_enfactual = false;
        this.secc_motivo = false;
        this.secc_anteced = true;
        this.secc_signos = false;
        this.secc_paraclin = false;
        this.secc_tratamiento = false;
        this.secc_ordenes = false;
        this.secc_recomendacion = false;
      }
      this.addDiagnostico_cargue(dxing);
      this.form.enfactual = "";

      if (tipo_select_hc == 1 || tipo_select_hc == 2) {
        this.get_preconsulta();
      }
    },
    get_preconsulta() {
      let seccion = "002";
      let paciente = this.item_select.id_paciente;
      let fecha = this.item_select.fecha;
      let hora = this.item_select.id_hora.replace(/\:/g, "");
      post
        .postData({
          url: "Clinico/dlls/PreconsultaJT.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            paciente +
            "|" +
            fecha +
            "|" +
            hora +
            "|" +
            seccion +
            "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          let base64String = "";
          let filteredData = data.find((item) => item.seccion_rep === "002");

          if (filteredData) {
            base64String =
              filteredData.base1_rep.trim() +
              filteredData.base2_rep.trim() +
              filteredData.base3_rep.trim() +
              filteredData.base4_rep.trim() +
              filteredData.base5_rep.trim() +
              filteredData.base6_rep.trim() +
              filteredData.base7_rep.trim() +
              filteredData.base8_rep.trim() +
              filteredData.base9_rep.trim() +
              filteredData.base10_rep.trim() +
              filteredData.base11_rep.trim() +
              filteredData.base12_rep.trim() +
              filteredData.base13_rep.trim() +
              filteredData.base14_rep.trim() +
              filteredData.base15_rep.trim() +
              filteredData.base16_rep.trim() +
              filteredData.base17_rep.trim() +
              filteredData.base18_rep.trim() +
              filteredData.base19_rep.trim() +
              filteredData.base20_rep.trim() +
              filteredData.base21_rep.trim() +
              filteredData.base22_rep.trim() +
              filteredData.base23_rep.trim() +
              filteredData.base24_rep.trim() +
              filteredData.base25_rep.trim() +
              filteredData.base26_rep.trim() +
              filteredData.base27_rep.trim() +
              filteredData.base28_rep.trim() +
              filteredData.base29_rep.trim() +
              filteredData.base30_rep.trim() +
              filteredData.base31_rep.trim() +
              filteredData.base32_rep.trim() +
              filteredData.base33_rep.trim() +
              filteredData.base34_rep.trim() +
              filteredData.base35_rep.trim() +
              filteredData.base36_rep.trim() +
              filteredData.base37_rep.trim() +
              filteredData.base38_rep.trim() +
              filteredData.base39_rep.trim();

            let decodedValue = atob(base64String);
            this.form.enfactual = decodedValue;
          }
          filteredData = data.find((item) => item.seccion_rep === "004");

          if (filteredData) {
            this.form.systole = filteredData.sys_rep.trim();
            this.form.diastole = filteredData.diast_rep.trim();
            this.form.frecard = filteredData.fcard_rep.trim();
            this.form.freresp = filteredData.fresp_rep.trim();
            this.form.tempera = filteredData.temp_rep.trim();
            this.form.saturacion = filteredData.satura_rep.trim();
            this.form.peso = filteredData.peso_rep.trim();
            this.form.talla = filteredData.peso_rep.trim();
            this.form.imc = filteredData.imc_rep.trim();
          }

          filteredData = data.find((item) => item.seccion_rep === "007");

          if (filteredData) {
            base64String =
              filteredData.base1_rep.trim() +
              filteredData.base2_rep.trim() +
              filteredData.base3_rep.trim() +
              filteredData.base4_rep.trim() +
              filteredData.base5_rep.trim() +
              filteredData.base6_rep.trim() +
              filteredData.base7_rep.trim() +
              filteredData.base8_rep.trim() +
              filteredData.base9_rep.trim() +
              filteredData.base10_rep.trim() +
              filteredData.base11_rep.trim() +
              filteredData.base12_rep.trim() +
              filteredData.base13_rep.trim() +
              filteredData.base14_rep.trim() +
              filteredData.base15_rep.trim() +
              filteredData.base16_rep.trim() +
              filteredData.base17_rep.trim() +
              filteredData.base18_rep.trim() +
              filteredData.base19_rep.trim() +
              filteredData.base20_rep.trim() +
              filteredData.base21_rep.trim() +
              filteredData.base22_rep.trim() +
              filteredData.base23_rep.trim() +
              filteredData.base24_rep.trim() +
              filteredData.base25_rep.trim() +
              filteredData.base26_rep.trim() +
              filteredData.base27_rep.trim() +
              filteredData.base28_rep.trim() +
              filteredData.base29_rep.trim() +
              filteredData.base30_rep.trim() +
              filteredData.base31_rep.trim() +
              filteredData.base32_rep.trim() +
              filteredData.base33_rep.trim() +
              filteredData.base34_rep.trim() +
              filteredData.base35_rep.trim() +
              filteredData.base36_rep.trim() +
              filteredData.base37_rep.trim() +
              filteredData.base38_rep.trim() +
              filteredData.base39_rep.trim();

            let decodedValue = atob(base64String);
            this.form.paraclinicos = decodedValue;
          }

          filteredData = data.find((item) => item.seccion_rep === "009");

          if (filteredData) {
            base64String =
              filteredData.base1_rep.trim() +
              filteredData.base2_rep.trim() +
              filteredData.base3_rep.trim() +
              filteredData.base4_rep.trim() +
              filteredData.base5_rep.trim() +
              filteredData.base6_rep.trim() +
              filteredData.base7_rep.trim() +
              filteredData.base8_rep.trim() +
              filteredData.base9_rep.trim() +
              filteredData.base10_rep.trim() +
              filteredData.base11_rep.trim() +
              filteredData.base12_rep.trim() +
              filteredData.base13_rep.trim() +
              filteredData.base14_rep.trim() +
              filteredData.base15_rep.trim() +
              filteredData.base16_rep.trim() +
              filteredData.base17_rep.trim() +
              filteredData.base18_rep.trim() +
              filteredData.base19_rep.trim() +
              filteredData.base20_rep.trim() +
              filteredData.base21_rep.trim() +
              filteredData.base22_rep.trim() +
              filteredData.base23_rep.trim() +
              filteredData.base24_rep.trim() +
              filteredData.base25_rep.trim() +
              filteredData.base26_rep.trim() +
              filteredData.base27_rep.trim() +
              filteredData.base28_rep.trim() +
              filteredData.base29_rep.trim() +
              filteredData.base30_rep.trim() +
              filteredData.base31_rep.trim() +
              filteredData.base32_rep.trim() +
              filteredData.base33_rep.trim() +
              filteredData.base34_rep.trim() +
              filteredData.base35_rep.trim() +
              filteredData.base36_rep.trim() +
              filteredData.base37_rep.trim() +
              filteredData.base38_rep.trim() +
              filteredData.base39_rep.trim();

            let decodedValue = atob(base64String);
            this.form.analisis = decodedValue;
          }
        })
        //   let datos = data[0];

        //   let binaryData = atob(base64String);

        //   let byteArray = new Uint8Array(binaryData.length);
        //   for (let i = 0; i < binaryData.length; i++) {
        //     byteArray[i] = binaryData.charCodeAt(i);
        //   }
        //   let decoder = new TextDecoder("utf-8");
        //   let preconsulta = decoder.decode(byteArray);

        //   this.form.enfactual = preconsulta;
        // })
        .catch((err) => {
          console.error("Error: ", err);
        });
    },
    abrir_historia: function (item) {
      this.clear_form();
      this.idpaciente = item.id_paciente;
      this.idpacientehc = item.id_paciente;
      this.prservicio = item.prservicio;
      this.nro_hist = 0;
      this.item_select = item;
      this.epspaciente = item.eps_rep;
      this.fechaag = item.fecha;
      this.horaag = item.id_hora.replace(":", "");

      if (parseInt(this.datosEmpresa.id_empr) == 900108793) {
        this.get_tipohc(this.idpaciente);
      } else {
        this.tipo_hc = 1;

        if (this.tipo_hc == 1) {
          this.dialogo.paciente = item.descrip_paciente.trim();
          this.dialogo.acompañante = item.acompanante.trim();
          this.dialogo.telacompañante = item.telacompanante;
          this.edad.anos = item.anosedad_rep;
          this.edad.meses = item.mesesedad_rep;
          this.edad.dias = item.diasedad_rep;
          this.historia.estado = true;
          this.tab = 0;
          this.historia.estado2 = true;
          this.disabled.salirsin_hc = false;
        }
      }
    },
    calcular_fecha() {
      const fechafinal = new Date(this.form.fechaini_inc);
      let dias = this.form.cantidad_inc.value;
      fechafinal.setDate(fechafinal.getDate() + dias);
      const anio = fechafinal.getFullYear();
      const mes = String(fechafinal.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0
      const dia = String(fechafinal.getDate()).padStart(2, "0");
      this.form.fechafinal_inc = anio + "-" + mes + "-" + dia;
    },
    calcularDias() {
      const fechaInicial = new Date(this.form.fechaini_inc);
      const fechaFinal = new Date(this.form.fechafinal_inc);
      const diferenciaMilisegundos = fechaFinal - fechaInicial;

      const milisegundosPorDia = 1000 * 60 * 60 * 24;
      const diferenciaDias = diferenciaMilisegundos / milisegundosPorDia;
      this.form.cantidad_inc = Math.floor(diferenciaDias) + 1;
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
    borrar_dxinc(item) {
      let index = this.items_tabla_dxincapc.indexOf(item);
      this.items_tabla_dxincapc.splice(index, 1);
    },
    _atendido: function (item) {
      var $this = this;
      let datos =
        sessionStorage.Sesion +
        "|" +
        item.id_paciente +
        "|" +
        item.identificacion +
        "|" +
        item.fecha +
        "|" +
        item.id_hora.split(":").join("") +
        "|";

      post
        .postData({
          url: "Clinico/dlls/titcl105a.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso exitoso",
            estado: false,
          });

          if (item.estado != 2) $this.llamar_cita(item, 3);
          else $this.llamar_cita(item, 0);
          this.cargarAgendamiento(this.profesional);
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al eliminar atendido",
            estado: true,
          });
        });
    },
    async guardar_historia_goniom() {
      if (!this.form.cldx) {
        this.errores.cldx = true;
        this.send_error("Selecciona un Diagnostico de Ingreso");
      } else if (!this.form.condicion) {
        this.errores.condicion = true;
        this.send_error("Selecciona una condiciÃ³n de Salida");
      } else if (!this.form.causaing) {
        this.errores.causaing = true;
        this.send_error("Selecciona una Causa de ingreso");
      } else if (!this.form.clasificacion) {
        this.errores.clasificacion = true;
        this.send_error("Selecciona una ClasificaciÃ³n");
      } else if (!this.form.finalidad) {
        this.errores.finalidad = true;
        this.send_error("Selecciona una Finalidad de consulta");
      } else {
        var sesion = sessionStorage.Sesion;
        let fechahc = this.fecha_actual.replace(/-/g, "");
        let plano = {};
        let index = 0;
        this.nro_hist = null;
        let cantidad_lineas = 0;
        let num = 0;
        let name = "";
        let end = 0;
        let consec = 0;
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

        let antecedentes = this.form.antecedentes;
        textob64 = window.btoa(unescape(encodeURIComponent(antecedentes)));
        cantidad_lineas = Math.ceil(textob64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_003-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textob64.substring(end - 900, end)}`;
        }

        consec = 1;
        if (this.tab_examenesFisicos.length == 0) {
          this.tab_examenesFisicos.push({
            codigo: 23,
            label: "",
            value: "prueba",
          });
        }

        let ex_fisico = this.form.ex_fisico;
        textob64 = window.btoa(unescape(encodeURIComponent(ex_fisico)));
        cantidad_lineas = Math.ceil(textob64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_006-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textob64.substring(end - 900, end)}`;
        }

        // let ex_fisico = this.tab_examenesFisicos;
        // ex_fisico.forEach((item, index) => {
        //   textob64 = window.btoa(unescape(encodeURIComponent(item.value)));
        //   cantidad_lineas = Math.ceil(textob64.length / 900);

        //   for (let index = 0; index < cantidad_lineas; index++) {
        //     let format_index = consec.toString().padStart(3, "0");
        //     name = `DATOJ_006-` + format_index;
        //     end = parseFloat(parseFloat(index + 1) * 900);
        //     plano[name] = `${item.codigo}|${textob64.substring(
        //       end - 900,
        //       end
        //     )}`;
        //     consec = consec + 1;
        //   }
        // });

        let paraclinicos = this.form.paraclinicos;
        textob64 = window.btoa(unescape(encodeURIComponent(paraclinicos)));
        cantidad_lineas = Math.ceil(textob64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_007-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textob64.substring(end - 900, end)}`;
        }

        let diagnostico = this.listDiagnosticos;

        diagnostico.forEach((item, index) => {
          let textodx = "vacio";

          if (item.value) {
            let format_index = (index + 1).toString().padStart(3, "0");
            let codigo_dx = item.value.codigo
              ? item.value.codigo.trim()
              : item.value.trim();
            plano[`DATOJ_008-${format_index}`] = `${codigo_dx} | ${textodx}`;
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
        let plantto = this.form.plantto;
        let textob64 = window.btoa(unescape(encodeURIComponent(plantto)));
        cantidad_lineas = Math.ceil(textob64.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_010-${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${textob64.substring(end - 900, end)}`;
        }

        consec = 1;
        let medicamentos = this.items_tabla_medicam;
        medicamentos.forEach((item, index) => {
          if (item.tab_indicaciones.length == 0) {
            item.tab_indicaciones = ".";
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

          let observ64 = window.btoa(
            unescape(encodeURIComponent(this.form.observacion_inc))
          );
          let fechaini = this.form.fechaini_inc.replace(/-/g, "");
          let fechafin = this.form.fechafinal_inc.replace(/-/g, "");
          let fechaacc = this.form.fechaacc_inc
            ? this.form.fechaacc_inc.replace(/-/g, "")
            : "0";
          let cantidad = this.form.cantidad_inc.value;
          let prorroga = this.form.prorroga.value;
          let origen = this.form.origen.value;
          cantidad_lineas = 1;

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_114-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[
              name
            ] = `${fechaini}|${fechafin}|${cantidad}|${prorroga}|${origen}|${dx1_inc}|${dx2_inc}|${dx3_inc}|${fechaacc}|${observ64.substring(
              end - 900,
              end
            )}|`;
            consec = consec + 1;
          }
        }

        consec = 1;
        let materiales = this.items_tabla_materiales;
        materiales.forEach((item, index) => {
          if (item.tab_matindicaciones.length == 0) {
            item.tab_matindicaciones = ".";
            item.tab_matcantidad = 0;
          } else if (item.tab_matcantidad === 0) {
            item.tab_matcantidad = 1;
          }
          let textob64 = window.btoa(
            unescape(encodeURIComponent(item.tab_matindicaciones))
          );
          cantidad_lineas = Math.ceil(textob64.length / 900);

          for (let index = 0; index < cantidad_lineas; index++) {
            let format_index = consec.toString().padStart(3, "0");
            name = `DATOJ_115-` + format_index;
            end = parseFloat(parseFloat(index + 1) * 900);
            plano[name] = `${item.tab_codmat.trim()}|${
              item.tab_matcantidad
            }|${textob64.substring(end - 900, end)}|`;
            consec = consec + 1;
          }
        });

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
        let finalidad = this.form.finalidad.value;
        let clasificacion = this.form.clasificacion.value;
        let consultorio = this.form.consultorio.codigo_rep;
        let tiposervhc = this.tiposervhc;
        let acompañante = this.historia_gonom.acompañante
          ? this.historia_gonom.acompañante
          : "";
        let telacompañante = this.historia_gonom.telacompañante
          ? this.historia_gonom.telacompañante
          : "";

        let flexion_ar_i = this.form.flexion_ar_i ? this.form.flexion_ar_i : 0;
        let flexion_ar_d = this.form.flexion_ar_d ? this.form.flexion_ar_d : 0;
        let extension_ar_i = this.form.extension_ar_i
          ? this.form.extension_ar_i
          : 0;
        let extension_ar_d = this.form.extension_ar_d
          ? this.form.extension_ar_d
          : 0;
        let dradial_ar_i = this.form.dradial_ar_i ? this.form.dradial_ar_i : 0;
        let dradial_ar_d = this.form.dradial_ar_d ? this.form.dradial_ar_d : 0;
        let dulnar_ar_i = this.form.dulnar_ar_i ? this.form.dulnar_ar_i : 0;
        let dulnar_ar_d = this.form.dulnar_ar_d ? this.form.dulnar_ar_d : 0;
        let abdpulgar_cmc_l = this.form.abdpulgar_cmc_l
          ? this.form.abdpulgar_cmc_l
          : 0;
        let abdpulgar_cmc_r = this.form.abdpulgar_cmc_r
          ? this.form.abdpulgar_cmc_r
          : 0;
        let adpulgar_cmc_l = this.form.adpulgar_cmc_l
          ? this.form.adpulgar_cmc_l
          : 0;
        let adpulgar_cmc_r = this.form.adpulgar_cmc_r
          ? this.form.adpulgar_cmc_r
          : 0;
        let opocpulgar_cmc_l = this.form.opocpulgar_cmc_l
          ? this.form.opocpulgar_cmc_l
          : 0;
        let opocpulgar_cmc_r = this.form.opocpulgar_cmc_r
          ? this.form.opocpulgar_cmc_r
          : 0;
        let flex_mcf_i = this.form.flex_mcf_i ? this.form.flex_mcf_i : 0;
        let flex_mcf_d = this.form.flex_mcf_d ? this.form.flex_mcf_d : 0;
        let ext_mcf_i = this.form.ext_mcf_i ? this.form.ext_mcf_i : 0;
        let ext_mcf_d = this.form.ext_mcf_d ? this.form.ext_mcf_d : 0;
        let flex_iprox_i = this.form.flex_iprox_i ? this.form.flex_iprox_i : 0;
        let flex_iprox_d = this.form.flex_iprox_d ? this.form.flex_iprox_d : 0;
        let ext_iprox_i = this.form.ext_iprox_i ? this.form.ext_iprox_i : 0;
        let ext_iprox_d = this.form.ext_iprox_d ? this.form.ext_iprox_d : 0;

        let flex_mtc_d2i = this.form.flex_mtc_d2i ? this.form.flex_mtc_d2i : 0;
        let flex_mtc_d2d = this.form.flex_mtc_d2d ? this.form.flex_mtc_d2d : 0;
        let ext_mtc_d2i = this.form.ext_mtc_d2i ? this.form.ext_mtc_d2i : 0;
        let ext_mtc_d2d = this.form.ext_mtc_d2d ? this.form.ext_mtc_d2d : 0;
        let flex_ifp_d2i = this.form.flex_ifp_d2i ? this.form.flex_ifp_d2i : 0;
        let flex_ifp_d2d = this.form.flex_ifp_d2d ? this.form.flex_ifp_d2d : 0;
        let ext_ifp_d2i = this.form.ext_ifp_d2i ? this.form.ext_ifp_d2i : 0;
        let ext_ifp_d2d = this.form.ext_ifp_d2d ? this.form.ext_ifp_d2d : 0;
        let flex_ifd_d2i = this.form.flex_ifd_d2i ? this.form.flex_ifd_d2i : 0;
        let flex_ifd_d2d = this.form.flex_ifd_d2d ? this.form.flex_ifd_d2d : 0;
        let ext_ifd_d2i = this.form.ext_ifd_d2i ? this.form.ext_ifd_d2i : 0;
        let ext_ifd_d2d = this.form.ext_ifd_d2d ? this.form.ext_ifd_d2d : 0;

        let flex_mtc_d3i = this.form.flex_mtc_d3i ? this.form.flex_mtc_d3i : 0;
        let flex_mtc_d3d = this.form.flex_mtc_d3d ? this.form.flex_mtc_d3d : 0;
        let ext_mtc_d3i = this.form.ext_mtc_d3i ? this.form.ext_mtc_d3i : 0;
        let ext_mtc_d3d = this.form.ext_mtc_d3d ? this.form.ext_mtc_d3d : 0;
        let flex_ifp_d3i = this.form.flex_ifp_d3i ? this.form.flex_ifp_d3i : 0;
        let flex_ifp_d3d = this.form.flex_ifp_d3d ? this.form.flex_ifp_d3d : 0;
        let ext_ifp_d3i = this.form.ext_ifp_d3i ? this.form.ext_ifp_d3i : 0;
        let ext_ifp_d3d = this.form.ext_ifp_d3d ? this.form.ext_ifp_d3d : 0;
        let flex_ifd_d3i = this.form.flex_ifd_d3i ? this.form.flex_ifd_d3i : 0;
        let flex_ifd_d3d = this.form.flex_ifd_d3d ? this.form.flex_ifd_d3d : 0;
        let ext_ifd_d3i = this.form.ext_ifd_d3i ? this.form.ext_ifd_d3i : 0;
        let ext_ifd_d3d = this.form.ext_ifd_d3d ? this.form.ext_ifd_d3d : 0;

        let flex_mtc_d4i = this.form.flex_mtc_d4i ? this.form.flex_mtc_d4i : 0;
        let flex_mtc_d4d = this.form.flex_mtc_d4d ? this.form.flex_mtc_d4d : 0;
        let ext_mtc_d4i = this.form.ext_mtc_d4i ? this.form.ext_mtc_d4i : 0;
        let ext_mtc_d4d = this.form.ext_mtc_d4d ? this.form.ext_mtc_d4d : 0;
        let flex_ifp_d4i = this.form.flex_ifp_d4i ? this.form.flex_ifp_d4i : 0;
        let flex_ifp_d4d = this.form.flex_ifp_d4d ? this.form.flex_ifp_d4d : 0;
        let ext_ifp_d4i = this.form.ext_ifp_d4i ? this.form.ext_ifp_d4i : 0;
        let ext_ifp_d4d = this.form.ext_ifp_d4d ? this.form.ext_ifp_d4d : 0;
        let flex_ifd_d4i = this.form.flex_ifd_d4i ? this.form.flex_ifd_d4i : 0;
        let flex_ifd_d4d = this.form.flex_ifd_d4d ? this.form.flex_ifd_d4d : 0;
        let ext_ifd_d4i = this.form.ext_ifd_d4i ? this.form.ext_ifd_d4i : 0;
        let ext_ifd_d4d = this.form.ext_ifd_d4d ? this.form.ext_ifd_d4d : 0;

        let flex_mtc_d5i = this.form.flex_mtc_d5i ? this.form.flex_mtc_d5i : 0;
        let flex_mtc_d5d = this.form.flex_mtc_d5d ? this.form.flex_mtc_d5d : 0;
        let ext_mtc_d5i = this.form.ext_mtc_d5i ? this.form.ext_mtc_d5i : 0;
        let ext_mtc_d5d = this.form.ext_mtc_d5d ? this.form.ext_mtc_d5d : 0;
        let flex_ifp_d5i = this.form.flex_ifp_d5i ? this.form.flex_ifp_d5i : 0;
        let flex_ifp_d5d = this.form.flex_ifp_d5d ? this.form.flex_ifp_d5d : 0;
        let ext_ifp_d5i = this.form.ext_ifp_d5i ? this.form.ext_ifp_d5i : 0;
        let ext_ifp_d5d = this.form.ext_ifp_d5d ? this.form.ext_ifp_d5d : 0;
        let flex_ifd_d5i = this.form.flex_ifd_d5i ? this.form.flex_ifd_d5i : 0;
        let flex_ifd_d5d = this.form.flex_ifd_d5d ? this.form.flex_ifd_d5d : 0;
        let ext_ifd_d5i = this.form.ext_ifd_d5i ? this.form.ext_ifd_d5i : 0;
        let ext_ifd_d5d = this.form.ext_ifd_d5d ? this.form.ext_ifd_d5d : 0;

        let flex_codo_i = this.form.flex_codo_i ? this.form.flex_codo_i : 0;
        let flex_codo_d = this.form.flex_codo_d ? this.form.flex_codo_d : 0;
        let ext_codo_i = this.form.ext_codo_i ? this.form.ext_codo_i : 0;
        let ext_codo_d = this.form.ext_codo_d ? this.form.ext_codo_d : 0;

        let pronac_codo_i = this.form.pronac_codo_i
          ? this.form.pronac_codo_i
          : 0;
        let pronac_codo_d = this.form.pronac_codo_d
          ? this.form.pronac_codo_d
          : 0;
        let supinac_codo_i = this.form.supinac_codo_i
          ? this.form.supinac_codo_i
          : 0;
        let supinac_codo_d = this.form.supinac_codo_d
          ? this.form.supinac_codo_d
          : 0;

        let abd_hombro_i = this.form.abd_hombro_i ? this.form.abd_hombro_i : 0;
        let abd_hombro_d = this.form.abd_hombro_d ? this.form.abd_hombro_d : 0;
        let aduc_hombro_i = this.form.aduc_hombro_i
          ? this.form.aduc_hombro_i
          : 0;
        let aduc_hombro_d = this.form.aduc_hombro_d
          ? this.form.aduc_hombro_d
          : 0;
        let flexion_hombro_i = this.form.flexion_hombro_i
          ? this.form.flexion_hombro_i
          : 0;
        let flexion_hombro_d = this.form.flexion_hombro_d
          ? this.form.flexion_hombro_d
          : 0;
        let extension_hombro_i = this.form.extension_hombro_i
          ? this.form.extension_hombro_i
          : 0;
        let extension_hombro_d = this.form.extension_hombro_d
          ? this.form.extension_hombro_d
          : 0;
        let rotext_hombro_i = this.form.rotext_hombro_i
          ? this.form.rotext_hombro_i
          : 0;
        let rotext_hombro_d = this.form.rotext_hombro_d
          ? this.form.rotext_hombro_d
          : 0;
        let rotint_hombro_i = this.form.rotint_hombro_i
          ? this.form.rotint_hombro_i
          : 0;
        let rotint_hombro_d = this.form.rotint_hombro_d
          ? this.form.rotint_hombro_d
          : 0;

        let flexion_colcerv = this.form.flexion_colcerv
          ? this.form.flexion_colcerv
          : 0;
        let extension_colcerv = this.form.extension_colcerv
          ? this.form.extension_colcerv
          : 0;
        let incizq_colcerv = this.form.incizq_colcerv
          ? this.form.incizq_colcerv
          : 0;
        let incder_colcerv = this.form.incder_colcerv
          ? this.form.incder_colcerv
          : 0;
        let rotizq_colcerv = this.form.rotizq_colcerv
          ? this.form.rotizq_colcerv
          : 0;
        let rotder_colcerv = this.form.rotder_colcerv
          ? this.form.rotder_colcerv
          : 0;

        let flexion_collumb = this.form.flexion_collumb
          ? this.form.flexion_collumb
          : 0;
        let flexiong_collumb = this.form.flexiong_collumb
          ? this.form.flexiong_collumb
          : 0;
        let extension_collumb = this.form.extension_collumb
          ? this.form.extension_collumb
          : 0;
        let incizq_collumb = this.form.incizq_collumb
          ? this.form.incizq_collumb
          : 0;
        let incder_collumb = this.form.incder_collumb
          ? this.form.incder_collumb
          : 0;
        let rotizq_collumb = this.form.rotizq_collumb
          ? this.form.rotizq_collumb
          : 0;
        let rotder_collumb = this.form.rotder_collumb
          ? this.form.rotder_collumb
          : 0;

        let flexion_cadera_i = this.form.flexion_cadera_i
          ? this.form.flexion_cadera_i
          : 0;
        let extension_cadera_i = this.form.extension_cadera_i
          ? this.form.extension_cadera_i
          : 0;
        let abd_cadera_i = this.form.abd_cadera_i ? this.form.abd_cadera_i : 0;
        let aduc_cadera_i = this.form.aduc_cadera_i
          ? this.form.aduc_cadera_i
          : 0;
        let rotint_cadera_i = this.form.rotint_cadera_i
          ? this.form.rotint_cadera_i
          : 0;
        let rotext_cadera_i = this.form.rotext_cadera_i
          ? this.form.rotext_cadera_i
          : 0;

        let flexion_cadera_d = this.form.flexion_cadera_d
          ? this.form.flexion_cadera_d
          : 0;
        let extension_cadera_d = this.form.extension_cadera_d
          ? this.form.extension_cadera_d
          : 0;
        let abd_cadera_d = this.form.abd_cadera_d ? this.form.abd_cadera_d : 0;
        let aduc_cadera_d = this.form.aduc_cadera_d
          ? this.form.aduc_cadera_d
          : 0;
        let rotint_cadera_d = this.form.rotint_cadera_d
          ? this.form.rotint_cadera_d
          : 0;
        let rotext_cadera_d = this.form.rotext_cadera_d
          ? this.form.rotext_cadera_d
          : 0;

        let flexion_rodilla_i = this.form.flexion_rodilla_i
          ? this.form.flexion_rodilla_i
          : 0;
        let flexion_rodilla_d = this.form.flexion_rodilla_d
          ? this.form.flexion_rodilla_d
          : 0;
        let extension_rodilla_i = this.form.extension_rodilla_i
          ? this.form.extension_rodilla_i
          : 0;
        let extension_rodilla_d = this.form.extension_rodilla_d
          ? this.form.extension_rodilla_d
          : 0;

        let planflexion_tobillo_i = this.form.planflexion_tobillo_i
          ? this.form.planflexion_tobillo_i
          : 0;
        let planflexion_tobillo_d = this.form.planflexion_tobillo_d
          ? this.form.planflexion_tobillo_d
          : 0;
        let dorsflexion_tobillo_i = this.form.dorsflexion_tobillo_i
          ? this.form.dorsflexion_tobillo_i
          : 0;
        let dorsflexion_tobillo_d = this.form.dorsflexion_tobillo_d
          ? this.form.dorsflexion_tobillo_d
          : 0;
        let inver_tobillo_i = this.form.inver_tobillo_i
          ? this.form.inver_tobillo_i
          : 0;
        let inver_tobillo_d = this.form.inver_tobillo_d
          ? this.form.inver_tobillo_d
          : 0;
        let ever_tobillo_i = this.form.ever_tobillo_i
          ? this.form.ever_tobillo_i
          : 0;
        let ever_tobillo_d = this.form.ever_tobillo_d
          ? this.form.ever_tobillo_d
          : 0;

        let flex_pie1_i = this.form.flex_pie1_i ? this.form.flex_pie1_i : 0;
        let flex_pie1_d = this.form.flex_pie1_d ? this.form.flex_pie1_d : 0;
        let ext_pie1_i = this.form.ext_pie1_i ? this.form.ext_pie1_i : 0;
        let ext_pie1_d = this.form.ext_pie1_d ? this.form.ext_pie1_d : 0;
        let flexif_pie1_i = this.form.flexif_pie1_i
          ? this.form.flexif_pie1_i
          : 0;
        let flexif_pie1_d = this.form.flexif_pie1_d
          ? this.form.flexif_pie1_d
          : 0;
        let extif_pie1_i = this.form.extif_pie1_i ? this.form.extif_pie1_i : 0;
        let extif_pie1_d = this.form.extif_pie1_d ? this.form.extif_pie1_d : 0;

        let ext_pie2_i = this.form.ext_pie2_i ? this.form.ext_pie2_i : 0;
        let ext_pie2_d = this.form.ext_pie2_d ? this.form.ext_pie2_d : 0;
        //   *****MTTF*************
        let mttf_flex_pie2_i = this.form.flex_mttf_p2i
          ? this.form.flex_mttf_p2i
          : 0;
        let mttf_flex_pie2_d = this.form.flex_mttf_p2d
          ? this.form.flex_mttf_p2d
          : 0;
        let mttf_ext_mttf_p2i = this.form.ext_mttf_p2i
          ? this.form.ext_mttf_p2i
          : 0;
        let mttf_ext_mttf_p2d = this.form.ext_mttf_p2d
          ? this.form.ext_mttf_p2d
          : 0;
        //   *****IFP*************
        let flex_ifp_p2i = this.form.flex_ifp_p2i ? this.form.flex_ifp_p2i : 0;
        let flex_ifp_p2d = this.form.flex_ifp_p2d ? this.form.flex_ifp_p2d : 0;
        let ext_ifp_p2i = this.form.ext_ifp_p2i ? this.form.ext_ifp_p2i : 0;
        let ext_ifp_p2d = this.form.ext_ifp_p2d ? this.form.ext_ifp_p2d : 0;
        //   *****IFD*************
        let flex_ifd_p2i = this.form.flex_ifd_p2i ? this.form.flex_ifd_p2i : 0;
        let flex_ifd_p2d = this.form.flex_ifd_p2d ? this.form.flex_ifd_p2d : 0;

        let ext_ifd_p2i = this.form.ext_ifd_p2i ? this.form.ext_ifd_p2i : 0;
        let ext_ifd_p2d = this.form.ext_ifd_p2d ? this.form.ext_ifd_p2d : 0;
        ////D3
        let ext_pie3_i = this.form.ext_pie3_i ? this.form.ext_pie3_i : 0;
        let ext_pie3_d = this.form.ext_pie3_d ? this.form.ext_pie3_d : 0;
        //   *****MTTF*************
        let mttf_flex_pie3_i = this.form.flex_mttf_p3i
          ? this.form.flex_mttf_p3i
          : 0;
        let mttf_flex_pie3_d = this.form.flex_mttf_p3d
          ? this.form.flex_mttf_p3d
          : 0;
        let mttf_ext_mttf_p3i = this.form.ext_mttf_p3i
          ? this.form.ext_mttf_p3i
          : 0;
        let mttf_ext_mttf_p3d = this.form.ext_mttf_p3d
          ? this.form.ext_mttf_p3d
          : 0;
        //   *****IFP*************
        let flex_ifp_p3i = this.form.flex_ifp_p3i ? this.form.flex_ifp_p3i : 0;
        let flex_ifp_p3d = this.form.flex_ifp_p3d ? this.form.flex_ifp_p3d : 0;
        let ext_ifp_p3i = this.form.ext_ifp_p3i ? this.form.ext_ifp_p3i : 0;
        let ext_ifp_p3d = this.form.ext_ifp_p3d ? this.form.ext_ifp_p3d : 0;
        //   *****IFD*************
        let flex_ifd_p3i = this.form.flex_ifd_p3i ? this.form.flex_ifd_p3i : 0;
        let flex_ifd_p3d = this.form.flex_ifd_p3d ? this.form.flex_ifd_p3d : 0;

        let ext_ifd_p3i = this.form.ext_ifd_p3i ? this.form.ext_ifd_p3i : 0;
        let ext_ifd_p3d = this.form.ext_ifd_p3d ? this.form.ext_ifd_p3d : 0;
        ////D4
        let ext_pie4_i = this.form.ext_pie4_i ? this.form.ext_pie4_i : 0;
        let ext_pie4_d = this.form.ext_pie4_d ? this.form.ext_pie4_d : 0;
        //   *****MTTF*************
        let mttf_flex_pie4_i = this.form.flex_mttf_p4i
          ? this.form.flex_mttf_p4i
          : 0;
        let mttf_flex_pie4_d = this.form.flex_mttf_p4d
          ? this.form.flex_mttf_p4d
          : 0;
        let mttf_ext_mttf_p4i = this.form.ext_mttf_p4i
          ? this.form.ext_mttf_p4i
          : 0;
        let mttf_ext_mttf_p4d = this.form.ext_mttf_p4d
          ? this.form.ext_mttf_p4d
          : 0;
        //   *****IFP*************
        let flex_ifp_p4i = this.form.flex_ifp_p4i ? this.form.flex_ifp_p4i : 0;
        let flex_ifp_p4d = this.form.flex_ifp_p4d ? this.form.flex_ifp_p4d : 0;
        let ext_ifp_p4i = this.form.ext_ifp_p4i ? this.form.ext_ifp_p4i : 0;
        let ext_ifp_p4d = this.form.ext_ifp_p4d ? this.form.ext_ifp_p4d : 0;
        //   *****IFD*************
        let flex_ifd_p4i = this.form.flex_ifd_p4i ? this.form.flex_ifd_p4i : 0;
        let flex_ifd_p4d = this.form.flex_ifd_p4d ? this.form.flex_ifd_p4d : 0;

        let ext_ifd_p4i = this.form.ext_ifd_p4i ? this.form.ext_ifd_p4i : 0;
        let ext_ifd_p4d = this.form.ext_ifd_p4d ? this.form.ext_ifd_p4d : 0;

        ////D5
        let ext_pie5_i = this.form.ext_pie5_i ? this.form.ext_pie5_i : 0;
        let ext_pie5_d = this.form.ext_pie5_d ? this.form.ext_pie5_d : 0;
        //   *****MTTF*************
        let mttf_flex_pie5_i = this.form.flex_mttf_p5i
          ? this.form.flex_mttf_p5i
          : 0;
        let mttf_flex_pie5_d = this.form.flex_mttf_p5d
          ? this.form.flex_mttf_p5d
          : 0;
        let mttf_ext_mttf_p5i = this.form.ext_mttf_p5i
          ? this.form.ext_mttf_p5i
          : 0;
        let mttf_ext_mttf_p5d = this.form.ext_mttf_p5d
          ? this.form.ext_mttf_p5d
          : 0;
        //   *****IFP*************
        let flex_ifp_p5i = this.form.flex_ifp_p5i ? this.form.flex_ifp_p5i : 0;
        let flex_ifp_p5d = this.form.flex_ifp_p5d ? this.form.flex_ifp_p5d : 0;
        let ext_ifp_p5i = this.form.ext_ifp_p5i ? this.form.ext_ifp_p5i : 0;
        let ext_ifp_p5d = this.form.ext_ifp_p5d ? this.form.ext_ifp_p5d : 0;
        //   *****IFD*************
        let flex_ifd_p5i = this.form.flex_ifd_p5i ? this.form.flex_ifd_p5i : 0;
        let flex_ifd_p5d = this.form.flex_ifd_p5d ? this.form.flex_ifd_p5d : 0;
        let ext_ifd_p5i = this.form.ext_ifd_p5i ? this.form.ext_ifd_p5i : 0;
        let ext_ifd_p5d = this.form.ext_ifd_p5d ? this.form.ext_ifd_p5d : 0;

        let datosEnvio =
          sesion +
          "|" +
          this.idpaciente +
          "|" +
          this.edad.anos +
          "|" +
          this.edad.meses +
          "|" +
          this.edad.dias +
          "|" +
          this.epspaciente +
          "|" +
          this.profesional +
          "|" +
          this.sede +
          "|" +
          // motivo +
          // "|" +
          // enf_actual +
          // "|" +
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
          "|" +
          consultorio +
          "|" +
          this.fechaag +
          "|" +
          this.horaag +
          "|" +
          fechahc +
          "|" +
          this.prservicio +
          "|" +
          acompañante +
          "|" +
          telacompañante +
          "|" +
          flexion_ar_i +
          "|" +
          flexion_ar_d +
          "|" +
          extension_ar_i +
          "|" +
          extension_ar_d +
          "|" +
          dradial_ar_i +
          "|" +
          dradial_ar_d +
          "|" +
          dulnar_ar_i +
          "|" +
          dulnar_ar_d +
          "|" +
          abdpulgar_cmc_l +
          "|" +
          abdpulgar_cmc_r +
          "|" +
          adpulgar_cmc_l +
          "|" +
          adpulgar_cmc_r +
          "|" +
          opocpulgar_cmc_l +
          "|" +
          opocpulgar_cmc_r +
          "|" +
          flex_mcf_i +
          "|" +
          flex_mcf_d +
          "|" +
          ext_mcf_i +
          "|" +
          ext_mcf_d +
          "|" +
          flex_iprox_i +
          "|" +
          flex_iprox_d +
          "|" +
          ext_iprox_i +
          "|" +
          ext_iprox_d +
          "|" +
          flex_mtc_d2i +
          "|" +
          flex_mtc_d2d +
          "|" +
          ext_mtc_d2i +
          "|" +
          ext_mtc_d2d +
          "|" +
          flex_ifp_d2i +
          "|" +
          flex_ifp_d2d +
          "|" +
          ext_ifp_d2i +
          "|" +
          ext_ifp_d2d +
          "|" +
          flex_ifd_d2i +
          "|" +
          flex_ifd_d2d +
          "|" +
          ext_ifd_d2i +
          "|" +
          ext_ifd_d2d +
          "|" +
          flex_mtc_d3i +
          "|" +
          flex_mtc_d3d +
          "|" +
          ext_mtc_d3i +
          "|" +
          ext_mtc_d3d +
          "|" +
          flex_ifp_d3i +
          "|" +
          flex_ifp_d3d +
          "|" +
          ext_ifp_d3i +
          "|" +
          ext_ifp_d3d +
          "|" +
          flex_ifd_d3i +
          "|" +
          flex_ifd_d3d +
          "|" +
          ext_ifd_d3i +
          "|" +
          ext_ifd_d3d +
          "|" +
          flex_mtc_d4i +
          "|" +
          flex_mtc_d4d +
          "|" +
          ext_mtc_d4i +
          "|" +
          ext_mtc_d4d +
          "|" +
          flex_ifp_d4i +
          "|" +
          flex_ifp_d4d +
          "|" +
          ext_ifp_d4i +
          "|" +
          ext_ifp_d4d +
          "|" +
          flex_ifd_d4i +
          "|" +
          flex_ifd_d4d +
          "|" +
          ext_ifd_d4i +
          "|" +
          ext_ifd_d4d +
          "|" +
          flex_mtc_d5i +
          "|" +
          flex_mtc_d5d +
          "|" +
          ext_mtc_d5i +
          "|" +
          ext_mtc_d5d +
          "|" +
          flex_ifp_d5i +
          "|" +
          flex_ifp_d5d +
          "|" +
          ext_ifp_d5i +
          "|" +
          ext_ifp_d5d +
          "|" +
          flex_ifd_d5i +
          "|" +
          flex_ifd_d5d +
          "|" +
          ext_ifd_d5i +
          "|" +
          ext_ifd_d5d +
          "|" +
          flex_codo_i +
          "|" +
          flex_codo_d +
          "|" +
          ext_codo_i +
          "|" +
          ext_codo_d +
          "|" +
          pronac_codo_i +
          "|" +
          pronac_codo_d +
          "|" +
          supinac_codo_i +
          "|" +
          supinac_codo_d +
          "|" +
          abd_hombro_i +
          "|" +
          abd_hombro_d +
          "|" +
          aduc_hombro_i +
          "|" +
          aduc_hombro_d +
          "|" +
          flexion_hombro_i +
          "|" +
          flexion_hombro_d +
          "|" +
          extension_hombro_i +
          "|" +
          extension_hombro_d +
          "|" +
          rotext_hombro_i +
          "|" +
          rotext_hombro_d +
          "|" +
          rotint_hombro_i +
          "|" +
          rotint_hombro_d +
          "|" +
          flexion_colcerv +
          "|" +
          extension_colcerv +
          "|" +
          incizq_colcerv +
          "|" +
          incder_colcerv +
          "|" +
          rotizq_colcerv +
          "|" +
          rotder_colcerv +
          "|" +
          flexion_collumb +
          "|" +
          flexiong_collumb +
          "|" +
          extension_collumb +
          "|" +
          incizq_collumb +
          "|" +
          incder_collumb +
          "|" +
          rotizq_collumb +
          "|" +
          rotder_collumb +
          "|" +
          flexion_cadera_i +
          "|" +
          extension_cadera_i +
          "|" +
          abd_cadera_i +
          "|" +
          aduc_cadera_i +
          "|" +
          rotint_cadera_i +
          "|" +
          rotext_cadera_i +
          "|" +
          flexion_rodilla_i +
          "|" +
          flexion_rodilla_d +
          "|" +
          extension_rodilla_i +
          "|" +
          extension_rodilla_d +
          "|" +
          planflexion_tobillo_i +
          "|" +
          planflexion_tobillo_d +
          "|" +
          dorsflexion_tobillo_i +
          "|" +
          dorsflexion_tobillo_d +
          "|" +
          inver_tobillo_i +
          "|" +
          inver_tobillo_d +
          "|" +
          ever_tobillo_i +
          "|" +
          ever_tobillo_d +
          "|" +
          flex_pie1_i +
          "|" +
          flex_pie1_d +
          "|" +
          ext_pie1_i +
          "|" +
          ext_pie1_d +
          "|" +
          flexif_pie1_i +
          "|" +
          flexif_pie1_d +
          "|" +
          extif_pie1_i +
          "|" +
          extif_pie1_d +
          "|" +
          ext_pie2_i +
          "|" +
          ext_pie2_d +
          "|" +
          mttf_flex_pie2_i +
          "|" +
          mttf_flex_pie2_d +
          "|" +
          mttf_ext_mttf_p2i +
          "|" +
          mttf_ext_mttf_p2d +
          "|" +
          flex_ifp_p2i +
          "|" +
          flex_ifp_p2d +
          "|" +
          ext_ifp_p2i +
          "|" +
          ext_ifp_p2d +
          "|" +
          flex_ifd_p2i +
          "|" +
          flex_ifd_p2d +
          "|" +
          ext_ifd_p2i +
          "|" +
          ext_ifd_p2d +
          "|" +
          ext_pie3_i +
          "|" +
          ext_pie3_d +
          "|" +
          mttf_flex_pie3_i +
          "|" +
          mttf_flex_pie3_d +
          "|" +
          mttf_ext_mttf_p3i +
          "|" +
          mttf_ext_mttf_p3d +
          "|" +
          flex_ifp_p3i +
          "|" +
          flex_ifp_p3d +
          "|" +
          ext_ifp_p3i +
          "|" +
          ext_ifp_p3d +
          "|" +
          flex_ifd_p3i +
          "|" +
          flex_ifd_p3d +
          "|" +
          ext_ifd_p3i +
          "|" +
          ext_ifd_p3d +
          "|" +
          ext_pie4_i +
          "|" +
          ext_pie4_d +
          "|" +
          mttf_flex_pie4_i +
          "|" +
          mttf_flex_pie4_d +
          "|" +
          mttf_ext_mttf_p4i +
          "|" +
          mttf_ext_mttf_p4d +
          "|" +
          flex_ifp_p4i +
          "|" +
          flex_ifp_p4d +
          "|" +
          ext_ifp_p4i +
          "|" +
          ext_ifp_p4d +
          "|" +
          flex_ifd_p4i +
          "|" +
          flex_ifd_p4d +
          "|" +
          ext_ifd_p4i +
          "|" +
          ext_ifd_p4d +
          "|" +
          ext_pie5_i +
          "|" +
          ext_pie5_d +
          "|" +
          mttf_flex_pie5_i +
          "|" +
          mttf_flex_pie5_d +
          "|" +
          mttf_ext_mttf_p5i +
          "|" +
          mttf_ext_mttf_p5d +
          "|" +
          flex_ifp_p5i +
          "|" +
          flex_ifp_p5d +
          "|" +
          ext_ifp_p5i +
          "|" +
          ext_ifp_p5d +
          "|" +
          flex_ifd_p5i +
          "|" +
          flex_ifd_p5d +
          "|" +
          ext_ifd_p5i +
          "|" +
          ext_ifd_p5d +
          "|" +
          tiposervhc +
          "|" +
          clasificacion +
          "|" +
          finalidad +
          "|" +
          flexion_cadera_d +
          "|" +
          extension_cadera_d +
          "|" +
          abd_cadera_d +
          "|" +
          aduc_cadera_d +
          "|" +
          rotint_cadera_d +
          "|" +
          rotext_cadera_d +
          "|";
        let data = {
          url: "Clinico/dlls/ClPrHistoriaG.dll",
          data: { importarhtml: datosEnvio, ...plano },
          method: "",
          json: true,
        };

        post.postData(data).then((response) => {
          this.disabled.guardar_hc = true;
          this.disabled.imprimir_hc = false;
          this.disabled.sgte_paciente = false;
          this.disabled.salirsin_hc = true;
          this.clear_form;
          this.cargarAgendamiento();
          this.atender();
          this.nro_hist = response[0];
        });
      }
    },
    select_check(tipo) {
      switch (tipo) {
        case 1:
          if (this.check_manos) {
            this.form.flexion_ar_i = 80;
            this.form.flexion_ar_d = 80;
            this.form.extension_ar_i = 70;
            this.form.extension_ar_d = 70;
            this.form.dradial_ar_i = 20;
            this.form.dradial_ar_d = 20;
            this.form.dulnar_ar_i = 30;
            this.form.dulnar_ar_d = 30;
          } else {
            this.form.flexion_ar_i = null;
            this.form.flexion_ar_d = null;
            this.form.extension_ar_i = null;
            this.form.extension_ar_d = null;
            this.form.dradial_ar_i = null;
            this.form.dradial_ar_d = null;
            this.form.dulnar_ar_i = null;
            this.form.dulnar_ar_d = null;
          }
          break;
        case 2:
          if (this.check_dedosmano) {
            this.form.abdpulgar_cmc_l = 70;
            this.form.abdpulgar_cmc_r = 70;
            this.form.adpulgar_cmc_l = 2;
            this.form.adpulgar_cmc_r = 2;
            this.form.opocpulgar_cmc_l = 7;
            this.form.opocpulgar_cmc_r = 7;
            this.form.flex_mcf_i = 60;
            this.form.flex_mcf_d = 60;
            this.form.ext_mcf_i = 0;
            this.form.ext_mcf_d = 0;
            this.form.flex_iprox_i = 80;
            this.form.flex_iprox_d = 80;
            this.form.ext_iprox_i = 20;
            this.form.ext_iprox_d = 20;
            this.form.flex_mtc_d2i = 90;
            this.form.flex_mtc_d2d = 90;
            this.form.ext_mtc_d2i = 45;
            this.form.ext_mtc_d2d = 45;
            this.form.flex_ifp_d2i = 100;
            this.form.flex_ifp_d2d = 100;
            this.form.ext_ifp_d2i = 0;
            this.form.ext_ifp_d2d = 0;
            this.form.flex_ifd_d2i = 90;
            this.form.flex_ifd_d2d = 90;
            this.form.ext_ifd_d2i = 0;
            this.form.ext_ifd_d2d = 0;
            this.form.flex_mtc_d3i = 90;
            this.form.flex_mtc_d3d = 90;
            this.form.ext_mtc_d3i = 45;
            this.form.ext_mtc_d3d = 45;
            this.form.flex_ifp_d3i = 100;
            this.form.flex_ifp_d3d = 100;
            this.form.ext_ifp_d3i = 0;
            this.form.ext_ifp_d3d = 0;
            this.form.flex_ifd_d3i = 90;
            this.form.flex_ifd_d3d = 90;
            this.form.ext_ifd_d3i = 0;
            this.form.ext_ifd_d3d = 0;
            this.form.flex_mtc_d4i = 90;
            this.form.flex_mtc_d4d = 90;
            this.form.ext_mtc_d4i = 45;
            this.form.ext_mtc_d4d = 45;
            this.form.flex_ifp_d4i = 100;
            this.form.flex_ifp_d4d = 100;
            this.form.ext_ifp_d4i = 0;
            this.form.ext_ifp_d4d = 0;
            this.form.flex_ifd_d4i = 90;
            this.form.flex_ifd_d4d = 90;
            this.form.ext_ifd_d4i = 0;
            this.form.ext_ifd_d4d = 0;
            this.form.flex_mtc_d5i = 90;
            this.form.flex_mtc_d5d = 90;
            this.form.ext_mtc_d5i = 45;
            this.form.ext_mtc_d5d = 45;
            this.form.flex_ifp_d5i = 100;
            this.form.flex_ifp_d5d = 100;
            this.form.ext_ifp_d5i = 0;
            this.form.ext_ifp_d5d = 0;
            this.form.flex_ifd_d5i = 90;
            this.form.flex_ifd_d5d = 90;
            this.form.ext_ifd_d5i = 0;
            this.form.ext_ifd_d5d = 0;
          } else {
            this.form.abdpulgar_cmc_l = null;
            this.form.abdpulgar_cmc_r = null;
            this.form.adpulgar_cmc_l = null;
            this.form.adpulgar_cmc_r = null;
            this.form.opocpulgar_cmc_l = null;
            this.form.opocpulgar_cmc_r = null;
            this.form.flex_mcf_i = null;
            this.form.flex_mcf_d = null;
            this.form.ext_mcf_i = null;
            this.form.ext_mcf_d = null;
            this.form.flex_iprox_i = null;
            this.form.flex_iprox_d = null;
            this.form.ext_iprox_i = null;
            this.form.ext_iprox_d = null;
            this.form.flex_mtc_d2i = null;
            this.form.flex_mtc_d2d = null;
            this.form.ext_mtc_d2i = null;
            this.form.ext_mtc_d2d = null;
            this.form.flex_ifp_d2i = null;
            this.form.flex_ifp_d2d = null;
            this.form.ext_ifp_d2i = null;
            this.form.ext_ifp_d2d = null;
            this.form.flex_ifd_d2i = null;
            this.form.flex_ifd_d2d = null;
            this.form.ext_ifd_d2i = null;
            this.form.ext_ifd_d2d = null;
            this.form.flex_mtc_d3i = null;
            this.form.flex_mtc_d3d = null;
            this.form.ext_mtc_d3i = null;
            this.form.ext_mtc_d3d = null;
            this.form.flex_ifp_d3i = null;
            this.form.flex_ifp_d3d = null;
            this.form.ext_ifp_d3i = null;
            this.form.ext_ifp_d3d = null;
            this.form.flex_ifd_d3i = null;
            this.form.flex_ifd_d3d = null;
            this.form.ext_ifd_d3i = null;
            this.form.ext_ifd_d3d = null;
            this.form.flex_mtc_d4i = null;
            this.form.flex_mtc_d4d = null;
            this.form.ext_mtc_d4i = null;
            this.form.ext_mtc_d4d = null;
            this.form.flex_ifp_d4i = null;
            this.form.flex_ifp_d4d = null;
            this.form.ext_ifp_d4i = null;
            this.form.ext_ifp_d4d = null;
            this.form.flex_ifd_d4i = null;
            this.form.flex_ifd_d4d = null;
            this.form.ext_ifd_d4i = null;
            this.form.ext_ifd_d4d = null;
            this.form.flex_mtc_d5i = null;
            this.form.flex_mtc_d5d = null;
            this.form.ext_mtc_d5i = null;
            this.form.ext_mtc_d5d = null;
            this.form.flex_ifp_d5i = null;
            this.form.flex_ifp_d5d = null;
            this.form.ext_ifp_d5i = null;
            this.form.ext_ifp_d5d = null;
            this.form.flex_ifd_d5i = null;
            this.form.flex_ifd_d5d = null;
            this.form.ext_ifd_d5i = null;
            this.form.ext_ifd_d5d = null;
          }
          break;
        case 3:
          if (this.check_codo) {
            this.form.flex_codo_i = 150;
            this.form.flex_codo_d = 150;
            this.form.ext_codo_i = 0;
            this.form.ext_codo_d = 0;
            this.form.pronac_codo_i = 80;
            this.form.pronac_codo_d = 80;
            this.form.supinac_codo_i = 80;
            this.form.supinac_codo_d = 80;
          } else {
            this.form.flex_codo_i = null;
            this.form.flex_codo_d = null;
            this.form.ext_codo_i = null;
            this.form.ext_codo_d = null;
            this.form.pronac_codo_i = null;
            this.form.pronac_codo_d = null;
            this.form.supinac_codo_i = null;
            this.form.supinac_codo_d = null;
          }
          break;
        case 4:
          if (this.check_hombro) {
            this.form.abd_hombro_i = 180;
            this.form.abd_hombro_d = 180;
            this.form.aduc_hombro_i = 30;
            this.form.aduc_hombro_d = 30;
            this.form.flexion_hombro_i = 180;
            this.form.flexion_hombro_d = 180;
            this.form.extension_hombro_i = 60;
            this.form.extension_hombro_d = 60;
            this.form.rotext_hombro_i = 90;
            this.form.rotext_hombro_d = 90;
            this.form.rotint_hombro_i = 70;
            this.form.rotint_hombro_d = 70;
          } else {
            this.form.abd_hombro_i = null;
            this.form.abd_hombro_d = null;
            this.form.aduc_hombro_i = null;
            this.form.aduc_hombro_d = null;
            this.form.flexion_hombro_i = null;
            this.form.flexion_hombro_d = null;
            this.form.extension_hombro_i = null;
            this.form.extension_hombro_d = null;
            this.form.rotext_hombro_i = null;
            this.form.rotext_hombro_d = null;
            this.form.rotint_hombro_i = null;
            this.form.rotint_hombro_d = null;
          }
          break;
        case 5:
          if (this.check_cervical) {
            this.form.flexion_colcerv = 45;
            this.form.extension_colcerv = 45;
            this.form.incizq_colcerv = 45;
            this.form.incder_colcerv = 45;
            this.form.rotizq_colcerv = 60;
            this.form.rotder_colcerv = 60;
          } else {
            this.form.flexion_colcerv = null;
            this.form.extension_colcerv = null;
            this.form.incizq_colcerv = null;
            this.form.incder_colcerv = null;
            this.form.rotizq_colcerv = null;
            this.form.rotder_colcerv = null;
          }
          break;
        case 6:
          if (this.check_lumbar) {
            this.form.flexion_collumb = 5;
            this.form.flexiong_collumb = 90;
            this.form.extension_collumb = 20;
            this.form.incizq_collumb = 35;
            this.form.incder_collumb = 35;
            this.form.rotizq_collumb = 45;
            this.form.rotder_collumb = 45;
          } else {
            this.form.flexion_collumb = null;
            this.form.flexiong_collumb = null;
            this.form.extension_collumb = null;
            this.form.incizq_collumb = null;
            this.form.incder_collumb = null;
            this.form.rotizq_collumb = null;
            this.form.rotder_collumb = null;
          }
          break;
        case 7:
          if (this.check_cadera) {
            this.form.flexion_cadera_i = 120;
            this.form.extension_cadera_i = 30;
            this.form.abd_cadera_i = 45;
            this.form.aduc_cadera_i = 30;
            this.form.rotint_cadera_i = 45;
            this.form.rotext_cadera_i = 45;
            this.form.flexion_cadera_d = 120;
            this.form.extension_cadera_d = 30;
            this.form.abd_cadera_d = 45;
            this.form.aduc_cadera_d = 30;
            this.form.rotint_cadera_d = 45;
            this.form.rotext_cadera_d = 45;
          } else {
            this.form.flexion_cadera_i = null;
            this.form.extension_cadera_i = null;
            this.form.abd_cadera_i = null;
            this.form.aduc_cadera_i = null;
            this.form.rotint_cadera_i = null;
            this.form.rotext_cadera_i = null;
            this.form.flexion_cadera_i = null;
            this.form.extension_cadera_d = null;
            this.form.abd_cadera_d = null;
            this.form.aduc_cadera_d = null;
            this.form.rotint_cadera_d = null;
            this.form.rotext_cadera_d = null;
          }
          break;
        case 8:
          if (this.check_rodilla) {
            this.form.flexion_rodilla_i = 135;
            this.form.flexion_rodilla_d = 135;
            this.form.extension_rodilla_i = 0;
            this.form.extension_rodilla_d = 0;
          } else {
            this.form.flexion_rodilla_i = null;
            this.form.flexion_rodilla_d = null;
            this.form.extension_rodilla_i = null;
            this.form.extension_rodilla_d = null;
          }
          break;
        case 9:
          if (this.check_tobillo) {
            this.form.planflexion_tobillo_i = 50;
            this.form.planflexion_tobillo_d = 50;
            this.form.dorsflexion_tobillo_i = 20;
            this.form.dorsflexion_tobillo_d = 20;
            this.form.inver_tobillo_i = 35;
            this.form.inver_tobillo_d = 35;
            this.form.ever_tobillo_i = 15;
            this.form.ever_tobillo_d = 15;
          } else {
            this.form.planflexion_tobillo_i = null;
            this.form.planflexion_tobillo_d = null;
            this.form.dorsflexion_tobillo_i = null;
            this.form.dorsflexion_tobillo_d = null;
            this.form.inver_tobillo_i = null;
            this.form.inver_tobillo_d = null;
            this.form.ever_tobillo_i = null;
            this.form.ever_tobillo_d = null;
          }
          break;
        case 10:
          if (this.check_pie) {
            this.form.flex_pie1_i = 45;
            this.form.flex_pie1_d = 45;
            this.form.ext_pie1_i = 70;
            this.form.ext_pie1_d = 70;
            this.form.flexif_pie1_i = 90;
            this.form.flexif_pie1_d = 90;
            this.form.extif_pie1_i = 0;
            this.form.extif_pie1_d = 0;
            this.form.ext_pie2_i = 10;
            this.form.ext_pie2_d = 10;
            this.form.ext_pie3_i = 10;
            this.form.ext_pie3_d = 10;
            this.form.ext_pie4_i = 10;
            this.form.ext_pie4_d = 10;
            this.form.ext_pie5_i = 10;
            this.form.ext_pie5_d = 10;
            this.form.flex_mttf_p5i = 40;
            this.form.flex_mttf_p5d = 40;
            this.form.ext_mttf_p5i = 40;
            this.form.ext_mttf_p5d = 40;
            this.form.flex_ifp_p5i = 35;
            this.form.flex_ifp_p5d = 35;
            this.form.ext_ifp_p5i = 0;
            this.form.ext_ifp_p5d = 0;
            this.form.flex_ifd_p5i = 60;
            this.form.flex_ifd_p5d = 60;
            this.form.ext_ifd_p5i = 30;
            this.form.ext_ifd_p5d = 30;
          } else {
            this.form.flex_pie1_i = null;
            this.form.flex_pie1_d = null;
            this.form.ext_pie1_i = null;
            this.form.ext_pie1_d = null;
            this.form.flexif_pie1_i = null;
            this.form.flexif_pie1_d = null;
            this.form.extif_pie1_i = null;
            this.form.extif_pie1_d = null;
            this.form.ext_pie2_i = null;
            this.form.ext_pie2_d = null;
            this.form.ext_pie3_i = null;
            this.form.ext_pie3_d = null;
            this.form.ext_pie4_i = null;
            this.form.ext_pie4_d = null;
            this.form.ext_pie5_i = null;
            this.form.ext_pie5_d = null;
            this.form.flex_mttf_p5i = null;
            this.form.flex_mttf_p5d = null;
            this.form.ext_mttf_p5i = null;
            this.form.ext_mttf_p5d = null;
            this.form.flex_ifp_p5i = null;
            this.form.flex_ifp_p5d = null;
            this.form.ext_ifp_p5i = null;
            this.form.ext_ifp_p5d = null;
            this.form.flex_ifd_p5i = null;
            this.form.flex_ifd_p5d = null;
            this.form.ext_ifd_p5i = null;
            this.form.ext_ifd_p5d = null;
          }
          break;
      }
    },
    open_mail(item) {
      if (item) {
        this.item_envio = item;
      } else {
        item = this.item_select;
        this.item_envio = item;
      }
      this.dialogocorreo.estado = true;
      this.form.correo = item.correo.trim();

      this.dialogocorreo.titulo = item.descrip_paciente.trim();
      this.form.correo2 = null;
      this.form.correo3 = null;
    },
    activar_gonios() {
      if (this.form.ex_fisico) {
        this.panel_gonios = true;
      } else {
        this.panel_gonios = false;
      }
    },
    async send_mail(item) {
      let paciente = item.id_paciente;
      this.idpaciente = paciente;
      let consecutivo = 0;

      if (this.nro_hist > 0) {
        paciente = this.idpaciente;
        consecutivo = this.nro_hist;
      } else {
        paciente = item.id_paciente;
        consecutivo = item.nrohcl;
        this.idpaciente = paciente;
      }
      // item.idpaciente_rep = 86007243;
      // item.nro_rep = 7416;

      item.idprofesional_rep = this.profesional;

      let profesional = parseInt(item.idprofesional_rep);
      if (item.firma_rep == "2") {
        this.profesional = "0000000000";
      }

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
          data.edad_rep = data.edad_rep.replace("n", "ñ");
          data.empresa = this.datosEmpresa;
          let profesional2 = parseInt(data.idprofes2_rep);

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          let firma_src = require(`../../assets/image/firmas/${parseFloat(
            this.profesional
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
          let data_envio = data;
          let blobHistoriaClinica = await historiaClinica(data, true);
          let arrBlob = await this.procesar_ordenes_mail(
            consecutivo,
            profesional,
            1,
            true
          );
          arrBlob.unshift(blobHistoriaClinica);

          const merger = new PDFMerger();
          for (const file of arrBlob) {
            if (file) await merger.add(file);
          }

          try {
            const secciones = [111, 112, 113, 114];
            const pdf_1 = new PDFMerger();

            for (const file of arrBlob) {
              if (file) await pdf_1.add(file);
            }

            for (const seccion of secciones) {
              const response = await post.postData({
                url: "Clinico/dlls/ClHclinica01J.dll",
                data:
                  sessionStorage.Sesion +
                  "|" +
                  consecutivo +
                  "|" +
                  seccion +
                  "|" +
                  this.idpaciente +
                  "|",
                method: "",
              });

              let data = response[0];
              data.empresa = this.datosEmpresa;
              let logo_src = require(`../../assets/image/clientes/${parseFloat(
                sessionStorage.Sesion.substr(0, 15)
              )}.png`);

              let firma_src = require(`../../assets/image/firmas/${parseFloat(
                profesional
              )}.png`);

              let logo = await this.pdfs.getBase64(logo_src);
              let firma = await this.pdfs.getBase64(firma_src);
              data.logo = logo;
              data.firma = firma;

              let blobOrden = await OrdenMedica(data, true);

              if (blobOrden) {
                await pdf_1.add(blobOrden);
              }
            }

            const mergedPdf = await pdf_1.saveAsBlob();
            await this.enviarCorreo(mergedPdf, data_envio);
            // const url = URL.createObjectURL(mergedPdf);
            // window.open(url);
          } catch (error) {
            console.error("Error en Ã³rdenes:", error);
            return false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al Enviar Historia",
            estado: true,
          });
        });
    },
    async procesar_ordenes_mail(consecutivo, profesional, proceso) {
      let array = [];
      for await (const section of [111, 112, 113, 114]) {
        let print = await this.imprimir_ordenes_hc(
          section,
          consecutivo,
          profesional,
          proceso
        );
        if (print) array.push(print);
        if (proceso == 1) {
          return array;
        }
      }
    },
    async imprimir_ordenes_hc(seccion, consecutivo, profesional, proceso) {
      return new Promise((res) => {
        post
          .postData({
            url: "Clinico/dlls/ClHclinica01J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              seccion +
              "|" +
              this.idpaciente +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            data = JSON.parse(JSON.stringify(data))[0];
            let print_seccion = false;

            if (!data.idpaciente_rep) return res(false);

            // Si no encuentra seccion acaba todo

            for (let i = 0; i < data.secciones_rep.length; i++) {
              const el = data.secciones_rep[i];

              if (parseFloat(el.seccion_rep) === seccion) {
                print_seccion = true;
                if (proceso == 2) {
                  break;
                }
              } else {
                if (proceso == 1) {
                  return res(false);
                }
              }
            }
            if (!print_seccion) {
              return res(false);
            } else {
              data.empresa = this.datosEmpresa;

              try {
                // Cargar logos y firmas
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

                // ImpresiÃ³n segÃºn la secciÃ³n
                if (seccion === 114) {
                  await incapacidad(data).then(() => {
                    console.log("ImpresiÃ³n de incapacidad terminada");
                    res(true); // Resuelve en caso de Ã©xito
                  });
                } else {
                  await OrdenMedica(data).then(() => {
                    console.log("ImpresiÃ³n de orden mÃ©dica terminada");
                    res(true); // Resuelve en caso de Ã©xito
                  });
                }
              } catch (error) {
                console.error("Error al procesar la orden:", error);
                res(false); // Resuelve en caso de error
              }
            }
          })
          .catch((err) => {
            console.error("Error en el servidor:", err);
            res(null);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Historia",
              estado: true,
            });
          });
      });
    },
    async enviarCorreo(blob, data) {
      this.card.loader = true;
      data.usuario_rep = this.datosEmpresa.emailhc_empr;
      data.servidor_rep = this.datosEmpresa.hosthc_empr;
      data.clave_rep = this.datosEmpresa.passhc_empr;
      data.puerto_rep = this.datosEmpresa.puertohc_empr;
      data.email_cliente = data.correo_rep.trim();

      // data.usuario_rep = "documentoselectronicos@titansoluciones.co";
      // data.servidor_rep = "smtp.office365.com";
      // data.clave_rep = "kxtknhljsylkcbyv";
      // data.email_cliente = "javierfrancog@gmail.com";

      data.periodo_factura = data.fechahc_rep;

      var urlEnvio = "https://server1ts.net//financiero/inc/enviocorreo_hc.php";
      var formData = new FormData();
      formData.append("pdf", blob, "Historia_Clinica.pdf");
      formData.append("nombre_pdf", "Historia Clinica");
      formData.append("mail_origen", data.usuario_rep.trim());
      formData.append("pass_origen", data.clave_rep.trim());
      formData.append("host_origen", data.servidor_rep.trim());
      formData.append("puerto_origen", data.puerto_rep.trim());
      formData.append("correo_destino", data.email_cliente.trim());
      formData.append("periodo", data.periodo_factura);
      formData.append("logo", parseFloat(sessionStorage.Sesion.substr(0, 15)));

      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          this.card.loader = false;
          this.dialogocorreo.estado = false;
          if (res.code == 0) {
            this.$emit("snack", {
              color: "green",
              text: res.msj,
              estado: true,
            });
          } else {
            this.card.loader = false;
            this.$emit("snack", {
              color: "error",
              text: res.msj,
              estado: true,
            });
          }
        })
        .catch((err) => {
          this.card.loader = false;
          console.error("Error Envio Hc:", err);
          this.$emit("snack", {
            color: "error",
            text: "Error al enviar correo",
            estado: true,
          });
        });
    },
    open_rechazo(item) {
      this.dialogorechazo.estado = true;
      this.item_envio = item;
    },
    guardar_rechazo() {
      if (!this.form.motivo) {
        this.send_error("Debe indicar un motivo de Rechazo");
      } else {
        this.loader = true;
        let idcomprobante = this.item_envio.idagenda;
        let fecha = this.item_envio.fecha;
        let motivo = this.form.motivo.trim();
        let datosEnvio =
          sessionStorage.Sesion +
          "|" +
          idcomprobante +
          "|" +
          motivo +
          "|" +
          fecha +
          "|";
        post
          .postData({
            url: "Clinico/dlls/PrRechazohc.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.dialogorechazo.estado = false;
            this.cargarAgendamiento();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar Rechazo",
              estado: true,
            });
          });
      }
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
          this.historia.estado = true;
          this.historia.paciente = this.paciente.descrip_rep.trim();
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
  },
};
</script>
<style scoped>
.blanco {
  color: white;
}
</style>
