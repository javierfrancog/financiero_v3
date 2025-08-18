<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-playlist-edit</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Contratos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
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
              item-key="nro"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.nro_rep="{ item }">
                {{ parseInt(item.nro_rep) }}
              </template>

              <template v-slot:item.estado_rep="{ item }">
                {{ item.estado_rep === "1" ? "Bloqueado" : "Activo" }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-border-color</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Contrato</span>
                </v-tooltip>

                <v-tooltip top>
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
                  <span>Cargar Documentos</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogocargue.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Cargue Documentos</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-select
                :items="tipodoc"
                label="Tipo Documento"
                outlined
                clearable
                return-object
                hide-details
                v-model="form.tipodoc"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row justify="center" class="d-flex mb-2">
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
                color="indigo"
                class="white--text px-12"
                depressed
                large
                @click="subir_pdf"
              >
                Subir Contrato
                <v-icon>mdi-cloud-arrow-up-outline</v-icon>
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
                Cancelar
                <v-icon>mdi-hand-back-left</v-icon>
              </v-btn>
            </v-col>

          </v-row>
          
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="orange">
            <v-tab>Información General</v-tab>
            <v-tab>Pólizas</v-tab>
            <v-tab>Municipios</v-tab>
            <v-tab>Otrosi</v-tab>
          </v-tabs>
          <v-divider class="mb-2"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Consecutivo"
                      clearable
                      type="text"
                      required
                      counter="4"
                      v-model="form.codigo"
                      :error="errores.codigo"
                      disabled
                      @input="errores.codigo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <v-btn
                      color="red accent-4"
                      class="white--text px-12"
                      depressed
                      large
                      @click="downloadFile(1)"
                    >
                      Ver Contrato
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex ml-2" cols="12">
                    <v-autocomplete
                      label="Entidad"
                      v-model="form.rut"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      item-value="item.identificacion"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="10">
                    <v-text-field
                      label="Descripción"
                      clearable
                      required
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="[
                        { text: 'Contributivo', value: 8 },
                        { text: 'Subsidiado', value: 1 },
                        { text: 'Contributivo y Subsidiado', value: 7 },
                        { text: 'Reg.Especial', value: 3 },
                        { text: 'Plan Complementario', value: 4 },
                        { text: 'Otro', value: 9 },
                      ]"
                      label="Regimen"
                      clearable
                      hide-details
                      return-object
                      v-model="form.regimen"
                      item-text="text"
                      item-value="value"
                      required
                      :rules="[(v) => !!v || 'Campo es obligatorio']"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="[
                        { text: 'Evento', value: 1 },
                        { text: 'Capitado', value: 2 },
                      ]"
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
                  <v-col class="d-flex" cols="4">
                    <v-switch
                      v-model="form.prorroga"
                      label="Prórroga Automatica"
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row class="d-flex ml-2">
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

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Inicial"
                      outlined
                      hide-details
                      v-model="form.valorini"
                      v-money="money"
                      ref="input_valor"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickeFechaFin"
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
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechaFinal"
                        @input="pickeFechaFin = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickeFechaSusc"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechaSuscr"
                          label="Fecha Suscripción"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechaSuscr"
                        @input="pickeFechaSusc = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Capita"
                      outlined
                      hide-details
                      v-model="form.valorcapita"
                      v-money="money"
                      ref="input_valor"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Eps"
                      v-model="form.eps"
                      :items="tabla_eps"
                      :item-text="format_eps"
                      outlined
                      return-object
                      required
                      :rules="[(v) => !!v || 'Campo es obligatorio']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro Contrato"
                      type="number"
                      outlined
                      hide-details
                      v-model="form.nrocontrato"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center" class="d-flex ml-2">
                  <v-col class="d-flex" cols="4">
                    <v-switch
                      v-model="form.cmoderadora"
                      label="Cuota Moderadora"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-switch v-model="form.copago" label="Copago"></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-switch
                      v-model="form.crecupera"
                      label="Cuota Recuperación"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="px-6 mt-1 justify-center">
                  <span class="subtitle-1">Cumplimiento</span>
                </v-row>
                <v-divider class="mt-2" color="succes"></v-divider>

                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Aseguradora"
                      v-model="form.asgcumplim"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      item-value="item.identificacion"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Nro Póliza"
                      clearable
                      required
                      v-model="form.nrocumpl"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="4">
                    <v-menu
                      v-model="pickeFechacumpl"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechapcumpl"
                          label="Fecha Vencimiento"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechapcumpl"
                        @input="pickeFechacumpl = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <v-btn
                      color="red accent-4"
                      class="white--text px-12"
                      depressed
                      large
                      @click="downloadFile(2)"
                    >
                      Ver Poliza
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider class="mt-2" color="succes"></v-divider>
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1"
                    >Responsabilidad Civil Extracontractual</span
                  >
                </v-row>
                <v-divider class="mt-2" color="succes"></v-divider>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Aseguradora"
                      v-model="form.asegrespextra"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      item-value="item.identificacion"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-2">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Nro Póliza"
                      clearable
                      required
                      v-model="form.nrorespextra"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="4">
                    <v-menu
                      v-model="pickeFecharespextra"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecharespextra"
                          label="Fecha Vencimiento"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecharespextra"
                        @input="pickeFechacumpl = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <v-btn
                      color="red accent-4"
                      class="white--text px-12"
                      depressed
                      large
                      @click="downloadFile(3)"
                    >
                      Ver Poliza
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat class="px-2">
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="12">
                    <v-combobox
                      v-model="form.ciudad"
                      :items="municipiosCompletos"
                      label="Ciudad"
                      multiple
                      chips
                      item-value="codigo_mun"
                      :item-text="formatMunicipio"
                      outlined
                      hide-details
                      clearable
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row
                  v-if="form.ciudad.length !== 0"
                  class="d-flex justify-center"
                >
                  <v-col class="mb-1" cols="6" sm="6">
                    <v-text-field
                      v-model="searchMunicipio"
                      append-icon="search"
                      label="Buscar Municipio"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table
                      :headers="headersMunicipios"
                      :items="form.ciudad"
                      :search="searchMunicipio"
                      item-key="codigo_mun"
                    >
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-row class="mt-1 d-flex ml-2">
                <v-col class="d-flex" sm="3">
                  <v-menu
                    v-model="pickerFechaotro1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.fechaOtrosi1"
                        label="1._Fecha Otrosí"
                        append-icon="event"
                        hide-details
                        outlined
                        :disabled="btn_otrosi"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaOtrosi1"
                      @input="pickerFechaotro1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-file-input
                    label="Buscar PDF"
                    outlined
                    color="blue darken-1"
                    hide-details
                    accept="application/pdf"
                    :disabled="btn_otrosi"
                    v-model="form.pdfotrosi1"
                  ></v-file-input>
                </v-col>
                <v-col class="mt-3 d-flex" cols="3">
                  <v-btn
                    size="small"
                    color="indigo"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="subir_otrosi(4)"
                  >
                    Subir Otrosí
                  </v-btn>
                </v-col>
                <v-col class="mt-3 d-flex justify-end">
                  <v-btn
                    size="small"
                    color="red accent-4"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="down_otrosi(1)"
                  >
                    Ver Otrosí
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mt-1 d-flex ml-2">
                <v-col class="d-flex" sm="3">
                  <v-menu
                    v-model="pickerFechaotro2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.fechaOtrosi2"
                        label="2._Fecha Otrosí"
                        append-icon="event"
                        hide-details
                        outlined
                        :disabled="btn_otrosi"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaOtrosi2"
                      @input="pickerFechaotro2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-file-input
                    label="Buscar PDF"
                    outlined
                    color="blue darken-1"
                    hide-details
                    accept="application/pdf"
                    v-model="form.pdfotrosi2"
                    :disabled="btn_otrosi"
                  ></v-file-input>
                </v-col>
                <v-col class="mt-3 d-flex" cols="3">
                  <v-btn
                    size="small"
                    color="indigo"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="subir_otrosi(5)"
                  >
                    Subir Otrosí
                  </v-btn>
                </v-col>
                <v-col class="mt-3 d-flex justify-end">
                  <v-btn
                    size="small"
                    color="red accent-4"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="down_otrosi(2)"
                  >
                    Ver Otrosí
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mt-1 d-flex ml-2">
                <v-col class="d-flex" sm="3">
                  <v-menu
                    v-model="pickerFechaotro3"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.fechaOtrosi3"
                        label="3._Fecha Otrosí"
                        append-icon="event"
                        hide-details
                        outlined
                        :disabled="btn_otrosi"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaOtrosi3"
                      @input="pickerFechaotro3 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-file-input
                    label="Buscar PDF"
                    outlined
                    color="blue darken-1"
                    hide-details
                    accept="application/pdf"
                    v-model="form.pdfotrosi3"
                    :disabled="btn_otrosi"
                  ></v-file-input>
                </v-col>
                <v-col class="mt-3 d-flex" cols="3">
                  <v-btn
                    size="small"
                    color="indigo"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="subir_otrosi(6)"
                  >
                    Subir Otrosí
                  </v-btn>
                </v-col>
                <v-col class="mt-3 d-flex justify-end">
                  <v-btn
                    size="small"
                    color="red accent-4"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="down_otrosi(3)"
                  >
                    Ver Otrosí
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mt-1 d-flex ml-2">
                <v-col class="d-flex" sm="3">
                  <v-menu
                    v-model="pickerFechaotro4"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.fechaOtrosi4"
                        label="4._Fecha Otrosí"
                        append-icon="event"
                        hide-details
                        :disabled="btn_otrosi"
                        outlined
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaOtrosi4"
                      @input="pickerFechaotro4 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-file-input
                    label="Buscar PDF"
                    outlined
                    color="blue darken-1"
                    hide-details
                    accept="application/pdf"
                    v-model="form.pdfotrosi4"
                    :disabled="btn_otrosi"
                  ></v-file-input>
                </v-col>
                <v-col class="mt-3 d-flex" cols="3">
                  <v-btn
                    size="small"
                    color="indigo"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="subir_otrosi(7)"
                  >
                    Subir Otrosí
                  </v-btn>
                </v-col>
                <v-col class="mt-3 d-flex justify-end">
                  <v-btn
                    size="small"
                    color="red accent-4"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="down_otrosi(4)"
                  >
                    Ver Otrosí
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mt-1 d-flex ml-2">
                <v-col class="d-flex" sm="3">
                  <v-menu
                    v-model="pickerFechaotro5"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.fechaOtrosi5"
                        label="5._Fecha Otrosí"
                        append-icon="event"
                        hide-details
                        :disabled="btn_otrosi"
                        outlined
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaOtrosi5"
                      @input="pickerFechaotro5 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="3">
                  <v-file-input
                    label="Buscar PDF"
                    outlined
                    color="blue darken-1"
                    hide-details
                    :disabled="btn_otrosi"
                    accept="application/pdf"
                    v-model="form.pdfotrosi5"
                  ></v-file-input>
                </v-col>
                <v-col class="mt-3 d-flex" cols="3">
                  <v-btn
                    size="small"
                    color="indigo"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="subir_otrosi(8)"
                  >
                    Subir Otrosí
                  </v-btn>
                </v-col>
                <v-col class="mt-3 d-flex justify-end">
                  <v-btn
                    size="small"
                    color="red accent-4"
                    class="white--text px-12"
                    depressed
                    :disabled="btn_otrosi"
                    @click="down_otrosi(5)"
                  >
                    Ver Otrosí
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>

          <v-divider class="mt-2" color="succes"></v-divider>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
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
            class="ma-2 px-4 white--text"
            color="indigo"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";
import { gapi } from "gapi-script";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogocargue: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      pickerFechaini: false,
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickeFechaIni: false,
      pickeFechaFin: false,
      pickeFechaSusc: false,
      pickeFecharespextra: false,
      pickeFechacumpl: false,
      pickerFechaotro1: false,
      pickerFechaotro2: false,
      pickerFechaotro3: false,
      pickerFechaotro4: false,
      pickerFechaotro5: false,

      tab: 0,
      item_sel: null,

      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      tabla_eps: [],
      municipiosCompletos: [],

      search: "",
      form: {
        ciudad: [],

        fechaOtrosi1: null,
      },
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      tipodoc: [
        { text: "Contrato", value: 1 },
        { text: "Póliza Cumplimiento", value: 2 },
        { text: "Póliza Responsabilidad Civil", value: 3 },
      ],
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "nro_rep" },
        { text: "Entidad", align: "left", value: "descripcion_rep" },
        { text: "Detalle", align: "left", value: "detalle_rep" },
        { text: "Eps", align: "left", value: "eps_rep" },
        { text: "Contrato", align: "left", value: "nrocontrato_rep" },
        { text: "Vence", align: "left", value: "fechafincont_rep" },

        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        entidad: false,
        estado: false,
      },
      card_estado: false,
      btn_otrosi: false,

      headersMunicipios: [
        { text: "Codigo Departamento", align: "center", value: "codigo_dep" },
        { text: "Departamento", align: "center", value: "departamento" },
        { text: "Codigo Ciudad", align: "center", value: "codigo_mun" },
        { text: "Ciudad", align: "center", value: "municipio" },
      ],
      searchMunicipio: "",
      fileId: "",
      URL_FILE: ""
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();

    this.cargarTablaruts();
    this.cargarCiudades();
    this.cargarEps();
  },
  computed: {},
  methods: {
    cargarEps: function () {
      post
        .postData({
          url: "clinico/dlls/CfEpsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tabla_eps = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
        });
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
    formatMunicipio(val) {
      return `${val.municipio} - ${val.departamento}`;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.item_sel = item;
      this.dialogo.estado = true;
      this.btn_otrosi = false;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = parseFloat(item.nro_rep);

      var busqueda_rut = this.tablaruts.find(
        (el) =>
          parseInt(el.identificacion_rut.trim()) == item.identificacion_rep
      );
      this.form.rut = busqueda_rut;

      this.form.tipocontr = { value: parseInt(item.tipocontr_rep) };

      this.form.regimen = { value: parseInt(item.regimen_rep) };
      this.form.fechaInicial = item.fechacont_rep;
      this.form.fechaFinal = item.fechafincont_rep;
      this.form.valorini = item.valor_rep.trim();
      this.form.valorcapita = item.valorcapita_rep.trim();
      this.form.nrocontrato = parseFloat(item.nrocontrato_rep.trim());
      this.form.fechaSuscr = item.fechasusc_rep;
      this.form.cmoderadora = item.cuotam_rep == "1" ? true : false;
      this.form.prorroga = item.prorroga_rep == "1" ? true : false;
      this.form.copago = item.copago_rep == "1" ? true : false;
      this.form.crecupera = item.cuotar_rep == "1" ? true : false;
      this.form.descripcion = item.detalle_rep.trim();
      this.form.estado = item.estado_rep == "1" ? true : false;

      this.form.fechaOtrosi1 = item.fechaotrosi1_rep;
      this.form.fechaOtrosi2 = item.fechaotrosi2_rep;
      this.form.fechaOtrosi3 = item.fechaotrosi3_rep;
      this.form.fechaOtrosi4 = item.fechaotrosi4_rep;
      this.form.fechaOtrosi5 = item.fechaotrosi5_rep;

      var busqueda_poliza = this.tablaruts.find(
        (el) => parseInt(el.identificacion_rut.trim()) == item.idcumplim_rep
      );
      this.form.asgcumplim = busqueda_poliza;

      this.form.nrocumpl = item.polizacumplim_rep.trim();
      this.form.fechapcumpl = item.fechavcump_rep;

      this.form.asgcumplim = busqueda_poliza;
      this.form.nrorespextra = item.polizaextrac_rep.trim();
      this.form.fecharespextra = item.fechavcext_rep;

      let ciudades = [];

      const ciudadesKeys = Object.keys(item).filter((key) =>
        key.startsWith("ciudad")
      );

      ciudadesKeys.forEach((ciudadKey) => {
        const codigoCiudad = item[ciudadKey];
        const ciudad = this.municipiosCompletos.find(
          (municipio) => municipio.codigo_mun === codigoCiudad
        );
        if (ciudad) ciudades.push(ciudad);
      });

      this.form.ciudad = ciudades;

      busqueda_poliza = this.tablaruts.find(
        (el) => parseInt(el.identificacion_rut.trim()) == item.idextrac_rep
      );
      this.form.asegrespextra = busqueda_poliza;

      let busqueda_eps = this.tabla_eps.find(
        (el) => el.codigo_rep == item.eps_rep
      );
      this.form.eps = busqueda_eps;
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          const municipios = data.departamentos.flatMap((d) =>
            d.municipios.map((m) => ({
              codigo_dep: d.codigo,
              departamento: d.departamento,
              municipio: m.municipio,
              codigo_mun: m.c_digo_dane_del_municipio,
            }))
          );

          this.municipiosCompletos = municipios;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.rut) {
        this.send_error("Cliente Obligatorio!");
      } else if (!data.regimen) {
        this.send_error("Regimen Obligatorio!");
      } else if (!data.tipocontr) {
        this.send_error("tipo Contrato Obligatorio!");
      } else if (!data.descripcion) {
        this.send_error("Descripcion Contrato Obligatorio!");
      } else if (!data.fechaInicial) {
        this.send_error("Fecha Inicial Contrato Obligatoria!");
      } else if (!data.fechaFinal) {
        this.send_error("Fecha Final Contrato Obligatoria!");
      } else if (!data.valorini) {
        this.send_error("Valor Inicial Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },
    get_file(item) {
      this.dialogocargue.estado = true;
      this.item_sel = item;
      this.form.pdf = null;
    },
    async subir_otrosi(item) {
      // this.card_estado = true;
      let session = sessionStorage.Sesion;
      let empresa = this.datosEmpresa.descrip_empr.trim();
      let idempresa = parseFloat(this.datosEmpresa.id_empr);
      let cargue_pdf = null;
      let file_envio = null;
      if (item == 4) {
        cargue_pdf = this.form.pdfotrosi1.name;
        file_envio = this.form.pdfotrosi1;
      } else if (item == 5) {
        cargue_pdf = this.form.pdfotrosi2.name;
        file_envio = this.form.pdfotrosi2;
      } else if (item == 6) {
        cargue_pdf = this.form.pdfotrosi3.name;
        file_envio = this.form.pdfotrosi3;
      } else if (item == 7) {
        cargue_pdf = this.form.pdfotrosi4.name;
        file_envio = this.form.pdfotrosi4;
      } else if (item == 8) {
        cargue_pdf = this.form.pdfotrosi5.name;
        file_envio = this.form.pdfotrosi5;
      }
      if (cargue_pdf) {
        let consec = parseFloat(this.item_sel.nro_rep);
        let clasif = item;
        let tipodoc = "01";
        let codigo = "";
        let nombre_pdf =
          idempresa + "_OTROSI_" + consec + "_" + (clasif - 3) + ".pdf";

        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("file", file_envio);
        data.append("consecutivo", consec);
        data.append("clasif", clasif);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/cargue.drive_contratos.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.card_estado = false;
        let nro_otrosi = item - 3;
        this.actualizar_otrosi(nro_otrosi);
      }
    },
    actualizar_otrosi() {
      let fecha_1 = this.form.fechaOtrosi1
        ? this.form.fechaOtrosi1.replace(/\-/g, "")
        : "";
      let fecha_2 = this.form.fechaOtrosi2
        ? this.form.fechaOtrosi2.replace(/\-/g, "")
        : "";
      let fecha_3 = this.form.fechaOtrosi3
        ? this.form.fechaOtrosi3.replace(/\-/g, "")
        : "";
      let fecha_4 = this.form.fechaOtrosi4
        ? this.form.fechaOtrosi4.replace(/\-/g, "")
        : "";
      let fecha_5 = this.form.fechaOtrosi5
        ? this.form.fechaOtrosi5.replace(/\-/g, "")
        : "";
      let consec = this.item_sel.nro_rep;
      let datos = {
        url: "Dispensa/dlls/ClCfContratosF.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consec +
          "|" +
          fecha_1 +
          "|" +
          fecha_2 +
          "|" +
          fecha_3 +
          "|" +
          fecha_4 +
          "|" +
          fecha_5 +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro actualizado correctamente",
            estado: true,
          });
          // this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.send_error("Error al actualizar Registro");
        });
    },
    async subir_pdf() {
      let session = sessionStorage.Sesion;
      let agencia = sessionStorage.Sede;
      let empresa = this.datosEmpresa.descrip_empr.trim();
      let idempresa = parseFloat(this.datosEmpresa.id_empr);      
      let cargue_pdf = this.form.pdf.name;
      let consec = parseFloat(this.item_sel.nro_rep);
      let clasif = this.form.tipodoc.value;
      let tipodoc = "01";
      let nombre_pdf = "CF_CONTR" + consec + "_" + clasif + ".pdf";
      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", tipodoc);
      data.append("file", this.form.pdf);
      data.append("consecutivo", consec);
      data.append("clasif", clasif);
      let response = await fetch(
        // "https://server1ts.net//financiero/inc/cargue.drive_contratos.php",
        "https://server1ts.net//financiero/inc/api_titan/cargue_contratos.php",
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      console.log('response', response)
      const { bucket, name} = response
      this.URL_FILE = bucket + '/' + name
      this.dialogocargue.estado = false;
      this.cargarcontenido();
    },
    async downloadFile(item) {
      let idFile = null;
      if (item == 1) {
        idFile = this.item_sel.iddrivecontr_rep.trim();
      } else if (item == 2) {
        idFile = this.item_sel.iddrivepol1_rep.trim();
      } else if (item == 3) {
        idFile = this.item_sel.iddrivepol2_rep.trim();
      }

      // const url =
      //   `https://drive.google.com/file/d/` + idFile + `/view?usp=drive_link`;
      const url = `https://storage.googleapis.com/${this.URL_FILE}`
      window.open(url, "_blank").focus();
    },
    format_envio(data) {
      this.card_estado = true;
      let consec = data.codigo;
      let cliente = data.rut.identificacion_rut;
      let regimen = data.regimen.value;
      let tipocontr = data.tipocontr.value;
      let detalle = data.descripcion;
      let fechaInicial = data.fechaInicial.split("-").join("");
      let fechaFinal = data.fechaFinal.split("-").join("");
      let valorini = data.valorini.split(",").join("");
      let valorcapita = data.valorcapita ? data.valorcapita.split(",").join(""): 0;
      let fechaSuscr = data.fechaSuscr? data.fechaSuscr.split("-").join(""): 0;
      let cmoderadora = data.cmoderadora ? "1" : "0";
      let prorroga = data.prorroga ? "1" : "0";
      let copago = data.copago ? "1" : "0";
      let crecupera = data.crecupera ? "1" : "0";
      let asgcumplim = data.asgcumplim ? data.asgcumplim.identificacion_rut : 0;
      let nrocumpl = data.nrocumpl? data.nrocumpl : 0;
      let nrocontrato = data.nrocontrato;
      let fechapcumpl = data.fechapcumpl? data.fechapcumpl.split("-").join("") : 0;
      let asegrespextra = data.asegrespextra
        ? data.asegrespextra.identificacion_rut
        : 0;
      let nrorespextra = data.nrorespextra? data.nrorespextra : 0;
      let fecharespextra = data.fecharespextra? data.fecharespextra.split("-").join("") : 0;
      let municipio_envio = null;
      if (data.ciudad == "00000") {
        municipio_envio = data.ciudad;
      } else {
        const municipio1 =
          data.ciudad.map((c) => c.codigo_mun).join("|") || "|";
        municipio_envio = municipio1;
      }

      let eps = data.eps.codigo_rep;
      let estado = data.estado ? "1" : "0";
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Dispensa/dlls/ClCfcontratos.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consec +
          "|" +
          cliente +
          "|" +
          regimen +
          "|" +
          detalle +
          "|" +
          fechaInicial +
          "|" +
          fechaFinal +
          "|" +
          valorini +
          "|" +
          fechaSuscr +
          "|" +
          cmoderadora +
          "|" +
          copago +
          "|" +
          crecupera +
          "|" +
          asgcumplim +
          "|" +
          nrocumpl +
          "|" +
          fechapcumpl +
          "|" +
          asegrespextra +
          "|" +
          nrorespextra +
          "|" +
          fecharespextra +
          "|" +
          valorcapita +
          "|" +
          prorroga +
          "|" +
          tipocontr +
          "|" +
          eps +
          "|" +
          nrocontrato +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          municipio_envio +
          "|",

        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          console.log(error);
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.buscarNumero();

      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
      this.btn_otrosi = true;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
        ciudad: [],
      };

      this.errores = {
        codigo: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/PrEnccontratoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Contratos",
            estado: true,
          });
        });
    },
    buscarNumero: function () {
      post
        .postData({
          url: "Dispensa/dlls/ClCfContratosN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.form.codigo = data[0].nro;
          this.item_sel = [];
          this.item_sel.nro_rep = data[0].nro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
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
      return `${val.descripcion_rut}`;
    },
    format_eps: function (val) {
      return `${val.descripcion_rep} - ${val.codigo_rep}`;
    },
    down_otrosi(item) {
      let idFile = null;
      if (item == 1) {
        idFile = this.item_sel.iddriveotrosi1_rep.trim();
      } else if (item == 2) {
        idFile = this.item_sel.iddriveotrosi2_rep.trim();
      } else if (item == 3) {
        idFile = this.item_sel.iddriveotrosi3_rep.trim();
      } else if (item == 4) {
        idFile = this.item_sel.iddriveotrosi4_rep.trim();
      } else if (item == 5) {
        idFile = this.item_sel.iddriveotrosi5_rep.trim();
      }

      const url =
        `https://drive.google.com/file/d/` + idFile + `/view?usp=drive_link`;
      window.open(url, "_blank").focus();
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
