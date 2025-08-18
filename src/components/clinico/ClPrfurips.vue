<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card_estado"
        :disabled="card_estado"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-male-height-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Formulario FURIPS Cl</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Fecha"
                outlined
                v-model="form.fecha_actual"
                hide-details
              ></v-text-field>
            </v-col>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" md="4">
                <v-text-field
                  label="Id_Paciente"
                  outlined
                  v-model="form.selectPaciente"
                  hide-details
                  :error="id_err"
                  @input="id_err = false"
                  @keyup.enter="buscar_paciente()"                  
                  @change="id_err = false"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="12" md="1">
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
              </v-col>
            </v-row>

            <v-row v-if="form.estado">
              <v-card flat class="col-12">
                <v-card-title>
                  <span class="title col-12">Formulario Furips</span>
                </v-card-title>
                <v-card-text class="pb-0">
                  <v-tabs
                    v-model="tab"
                    slider-color="green"
                    centered
                    center-active
                    show-arrows
                  >
                    <v-tab>II.Victima</v-tab>
                    <v-tab>III.Sitio del Evento</v-tab>
                    <v-tab>IV.Vehículo de Accidente</v-tab>
                    <v-tab>V.Propietario del vehiculo</v-tab>
                    <v-tab>VI.Conductor Involucrado</v-tab>
                    <v-tab>VII.Remisión</v-tab>
                    <v-tab>VIII.Amparo</v-tab>
                    <v-tab>IX.Certificado</v-tab>
                    <v-tab>X.Reclamación</v-tab>
                  </v-tabs>
                  <v-divider color="succes"></v-divider>

                  <v-tabs-items v-model="tab">
                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer apellido"
                              v-model="form.primerape_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo apellido"
                              v-model="form.segundoape_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer nombre"
                              v-model="form.primernom_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo nombre"
                              v-model="form.segundonom_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="2" md="2">
                            <v-text-field
                              label="Tipo de Documento"
                              v-model="form.tipodoc_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4" md="4">
                            <v-text-field
                              label="N° Documento"
                              v-model="form.nrodoc_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="2" md="3">
                            <v-text-field
                              v-model="form.fecha_vic"
                              label="Fecha de nacimiento"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="2" md="2">
                            <v-text-field
                              label="Sexo"
                              v-model="form.sexo_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="10">
                            <v-text-field
                              label="Dirección"
                              v-model="form.direccion_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="2" md="4">
                            <v-text-field
                              label="Departamento"
                              v-model="form.dpto_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="2" md="4">
                            <v-text-field
                              label="Municipio"
                              v-model="form.munic_vic"
                              outlined
                              hide-details
                              readonly
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              :items="condicionAcc"
                              label="Condición del accidentado"
                              outlined
                              clearable
                              return-object
                              hide-details
                              v-model="form.condicion_vic"
                              :error="errores.condicion_vic"
                              @input="errores.condicion_vic = false"
                            >
                            </v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="12">
                            <v-autocomplete
                              label="Naturaleza del evento"
                              v-model="form.natuEvt_lug"
                              :items="naturalezaEvt"
                              outlined
                              hide-details
                              clearable
                              :error="errores.natuEvt_lug"
                              @input="errores.natuEvt_lug = false"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="5">
                            <v-text-field
                              label="Dirección"
                              v-model="form.direccion_lug"
                              outlined
                              hide-details
                              clearable
                              :error="errores.direccion_lug"
                              @input="errores.direccion_lug = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-menu
                              v-model="pickersFecha.lugar"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.fecha_lug"
                                  label="Fecha Evento/Accidente"
                                  append-icon="event"
                                  hide-details
                                  :error="errores.fecha_lug"
                                  @input="errores.fecha_lug = false"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.fecha_lug"
                                @input="
                                  pickersFecha.lugar = false;
                                  errores.fecha_lug = false;
                                "
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-menu
                              ref="menu"
                              v-model="pickersHora.lugar"
                              :close-on-content-click="false"
                              :return-value.sync="form.hora_lug"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.hora_lug"
                                  label="Hora"
                                  outlined
                                  hide-details
                                  append-icon="mdi-clock-outline"
                                  :error="errores.hora_lug"
                                  @input="errores.hora_lug = false"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="pickersHora.lugar"
                                v-model="form.hora_lug"
                                @input="errores.hora_lug = false"
                                @click:minute="$refs.menu.save(form.hora_lug)"
                              ></v-time-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              label="Departamento"
                              v-model="form.dpto_lug"
                              :items="departamentos"
                              :item-text="format_departamentos"
                              return-object
                              outlined
                              hide-details
                              clearable
                              :error="errores.dpto_lug"
                              @change="
                                errores.dpto_lug = false;
                                get_municipios(form.dpto_lug, 'lugar');
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              label="Municipio"
                              v-model="form.munic_lug"
                              :items="municipios.lugar"
                              :item-text="format_municipios"
                              return-object
                              outlined
                              :error="errores.munic_lug"
                              @input="errores.munic_lug = false"
                              hide-details
                              clearable
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="5">
                            <v-autocomplete
                              :items="zona"
                              label="Zona"
                              outlined
                              clearable
                              hide-details
                              v-model="form.zona_lug"
                              :error="errores.zona_lug"
                              @input="errores.zona_lug = false"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              label="Descripción del evento"
                              v-model="form.descr_lug"
                              clearable
                              outlined
                              hide-details
                              :error="errores.descr_lug"
                              @input="errores.descr_lug = false"
                            >
                            </v-textarea>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="4">
                            <v-autocomplete
                              :items="estadoVehiculo"
                              label="Estado"
                              outlined
                              clearable
                              hide-details
                              v-model="form.estado_veh"
                              :error="errores.estado_veh"
                              @input="errores.estado_veh = false"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <v-text-field
                              label="Placa"
                              v-model="form.placa_veh"
                              outlined
                              hide-details
                              clearable
                              :error="errores.placa_veh"
                              @input="errores.placa_veh = false"
                              maxlength="6"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="4" sm="4" md="5">
                            <v-text-field
                              label="Marca"
                              v-model="form.marca_veh"
                              outlined
                              hide-details
                              clearable
                              :error="errores.marca_veh"
                              @input="errores.marca_veh = false"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="7">
                            <v-autocomplete
                              :items="tipoServicio"
                              label="Tipo de Servicio"
                              outlined
                              clearable
                              hide-details
                              v-model="form.tservicio_veh"
                              :error="errores.tservicio_veh"
                              @input="errores.tservicio_veh = false"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="5">
                            <v-text-field
                              label="Código de la aseguradora"
                              v-model="form.codAseg_veh"
                              outlined
                              hide-details
                              clearable
                              :error="errores.codAseg_veh"
                              @input="errores.codAseg_veh = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="8">
                            <v-text-field
                              label="N° de la Póliza"
                              v-model="form.nropoli_veh"
                              outlined
                              hide-details
                              clearable
                              :error="errores.nropoli_veh"
                              @input="errores.nropoli_veh = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              :items="si_no"
                              label="Intervención de autoridad"
                              outlined
                              clearable
                              hide-details
                              v-model="form.intAutoridad_veh"
                              :error="errores.intAutoridad_veh"
                              @input="errores.intAutoridad_veh = false"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-menu
                              v-model="pickersFecha.vehiculoDesde"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.vigdesde_veh"
                                  label="Vigencia desde"
                                  append-icon="event"
                                  hide-details
                                  :error="errores.vigdesde_veh"
                                  @input="errores.vigdesde_veh = false"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.vigdesde_veh"
                                :error="errores.vigdesde_veh"
                                @input="
                                  pickersFecha.vehiculoDesde = false;
                                  errores.vigdesde_veh = false;
                                "
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-menu
                              v-model="pickersFecha.vehiculoHasta"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.vighasta_veh"
                                  label="Vigencia hasta"
                                  append-icon="event"
                                  hide-details
                                  :error="errores.vighasta_veh"
                                  @input="errores.vighasta_veh = false"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.vighasta_veh"
                                @input="
                                  pickersFecha.vehiculoHasta = false;
                                  errores.vighasta_veh = false;
                                "
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="5">
                            <v-autocomplete
                              :items="si_no"
                              label="Cobro Excedente Póliza"
                              outlined
                              clearable
                              hide-details
                              v-model="form.cobroExc_veh"
                              :error="errores.cobroExc_veh"
                              @input="errores.cobroExc_veh = false"
                            >
                            </v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer apellido"
                              v-model="form.primerape_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo apellido"
                              v-model="form.segundoape_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer nombre"
                              v-model="form.primernom_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo nombre"
                              v-model="form.segundonom_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <v-autocomplete
                              label="Tipo de Documento"
                              :items="tipoDocumento"
                              v-model="form.tipodoc_propv"
                              outlined
                              hide-details
                              clearable
                              return-object
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <v-text-field
                              label="N° Documento"
                              v-model="form.nrodoc_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Dirección"
                              v-model="form.direccion_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Teléfono"
                              v-model="form.telefono_propv"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              label="Departamento"
                              v-model="form.dpto_propv"
                              :items="departamentos"
                              :item-text="format_departamentos"
                              return-object
                              outlined
                              hide-details
                              clearable
                              @change="
                                errores.dpto_propv = false;
                                get_municipios(form.dpto_propv, 'propvehiculo');
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              label="Municipio"
                              v-model="form.munic_propv"
                              :items="municipios.propvehiculo"
                              :item-text="format_municipios"
                              return-object
                              outlined
                              @input="errores.munic_propv = false"
                              hide-details
                              clearable
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer apellido"
                              v-model="form.primerape_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.primerape_cond = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo apellido"
                              v-model="form.segundoape_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.segundoape_cond = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer nombre"
                              v-model="form.primernom_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.primernom_cond = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo nombre"
                              v-model="form.segundonom_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.segundonom_cond = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <v-autocomplete
                              label="Tipo de Documento"
                              :items="tipoDocumento"
                              v-model="form.tipodoc_cond"
                              outlined
                              hide-details
                              clearable
                              return-object
                              @input="errores.tipodoc_cond = false"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <v-text-field
                              label="N° Documento"
                              v-model="form.nrodoc_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.nrodoc_cond = false"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Dirección"
                              v-model="form.direccion_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.direccion_cond = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Teléfono"
                              v-model="form.telefono_cond"
                              outlined
                              hide-details
                              clearable
                              @input="errores.telefono_cond = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              label="Departamento"
                              v-model="form.dpto_cond"
                              :items="departamentos"
                              :item-text="format_departamentos"
                              return-object
                              outlined
                              hide-details
                              clearable
                              @change="
                                errores.dpto_cond = false;
                                get_municipios(form.dpto_cond, 'condvehiculo');
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              label="Municipio"
                              v-model="form.munic_cond"
                              :items="municipios.condvehiculo"
                              :item-text="format_municipios"
                              return-object
                              outlined
                              @input="errores.munic_cond = false"
                              hide-details
                              clearable
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-list-item-content>
                          <v-list-item-title class="headline"
                            >Datos del Segundo Vehiculo:</v-list-item-title
                          >
                        </v-list-item-content>

                        <v-row>
                          <v-col cols="3">
                            <v-autocomplete
                              :items="estadoVehiculo"
                              label="Estado"
                              outlined
                              clearable
                              return-object
                              hide-details
                              v-model="form.estado_veh2"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <v-text-field
                              label="Placa"
                              v-model="form.placa_veh2"
                              outlined
                              hide-details
                              clearable
                              maxlength="6"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="3">
                            <v-autocomplete
                              label="Tipo de Documento"
                              :items="tipoDocumento"
                              v-model="form.tipodoc_cond2"
                              outlined
                              hide-details
                              return-object
                              clearable
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="N° Documento"
                              v-model="form.nrodoc_cond2"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-list-item-content>
                          <v-list-item-title class="headline"
                            >Datos del Tercer Vehiculo:</v-list-item-title
                          >
                        </v-list-item-content>

                        <v-row>
                          <v-col cols="3">
                            <v-autocomplete
                              :items="estadoVehiculo"
                              label="Estado"
                              outlined
                              clearable
                              hide-details
                              return-object
                              v-model="form.estado_veh3"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <v-text-field
                              label="Placa"
                              v-model="form.placa_veh3"
                              outlined
                              hide-details
                              clearable
                              maxlength="6"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="3">
                            <v-autocomplete
                              label="Tipo de Documento"
                              :items="tipoDocumento"
                              v-model="form.tipodoc_cond3"
                              outlined
                              hide-details
                              clearable
                              return-object
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="N° Documento"
                              v-model="form.nrodoc_cond3"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="12" sm="6" md="5">
                            <v-autocomplete
                              :items="tipoReferencia"
                              label="Tipo Referencia"
                              outlined
                              clearable
                              hide-details
                              v-model="form.tipoRef_rem"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-menu
                              v-model="pickersFecha.remision"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.fecha_rem"
                                  label="Fecha remisión"
                                  append-icon="event"
                                  hide-details
                                  @input="errores.fecha_rem = false"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.fecha_rem"
                                @input="
                                  pickersFecha.remision = false;
                                  errores.fecha_rem = false;
                                "
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-menu
                              ref="menu2"
                              v-model="pickersHora.remision"
                              :close-on-content-click="false"
                              :return-value.sync="form.hora_rem"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.hora_rem"
                                  label="Hora"
                                  outlined
                                  hide-details
                                  append-icon="mdi-clock-outline"
                                  @input="errores.hora_rem = false"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="pickersHora.remision"
                                v-model="form.hora_rem"
                                @input="errores.hora_rem = false"
                                @click:minute="$refs.menu2.save(form.hora_rem)"
                              ></v-time-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="7">
                            <v-text-field
                              label="Prestador que remite"
                              v-model="form.prestador_rem"
                              outlined
                              hide-details
                              clearable
                              @input="errores.prestador_rem = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="5">
                            <v-text-field
                              label="Código de Inscripción"
                              v-model="form.codInsc_rem"
                              outlined
                              hide-details
                              clearable
                              @input="errores.codInsc_rem = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Profesional que remite"
                              v-model="form.profesional_rem"
                              outlined
                              hide-details
                              clearable
                              @input="errores.profesional_rem = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Cargo"
                              v-model="form.cargo_rem"
                              outlined
                              hide-details
                              clearable
                              @input="errores.cargo_rem = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Dirección que remite"
                              v-model="form.direccion_rem"
                              outlined
                              hide-details
                              clearable
                              @input="errores.direccion_rem = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Municipio que remite"
                              v-model="form.munic_rem"
                              outlined
                              hide-details
                              clearable
                              @input="errores.munic_rem = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-menu
                              v-model="pickersFecha.remiAcep"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="form.fechaAcep_rem"
                                  label="Fecha aceptación"
                                  append-icon="event"
                                  hide-details
                                  @input="errores.fechaAcep_rem = false"
                                  outlined
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.fechaAcep_rem"
                                @input="
                                  pickersFecha.remiAcep = false;
                                  errores.fechaAcep_rem = false;
                                "
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-menu
                              ref="menu3"
                              v-model="pickersHora.remiAcep"
                              :close-on-content-click="false"
                              :return-value.sync="form.horaAcep_rem"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.horaAcep_rem"
                                  label="Hora"
                                  outlined
                                  hide-details
                                  append-icon="mdi-clock-outline"
                                  @input="errores.horaAcep_rem = false"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="pickersHora.remiAcep"
                                v-model="form.horaAcep_rem"
                                @input="errores.horaAcep_rem = false"
                                @click:minute="
                                  $refs.menu3.save(form.horaAcep_rem)
                                "
                              ></v-time-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="7">
                            <v-text-field
                              label="Prestador que recibe"
                              v-model="form.prestador_rec"
                              outlined
                              hide-details
                              clearable
                              @input="errores.prestador_rec = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="5">
                            <v-text-field
                              label="Código de Inscripción"
                              v-model="form.codInsc_rec"
                              outlined
                              hide-details
                              clearable
                              @input="errores.codInsc_rec = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Profesional que recibe"
                              v-model="form.profesional_rec"
                              outlined
                              hide-details
                              clearable
                              @input="errores.profesional_rec = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Cargo"
                              v-model="form.cargo_rec"
                              outlined
                              hide-details
                              clearable
                              @input="errores.cargo_rec = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Dirección que recibe"
                              v-model="form.direccion_rec"
                              outlined
                              hide-details
                              clearable
                              @input="errores.direccion_rec = false"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Municipio que recibe"
                              v-model="form.munic_rec"
                              outlined
                              hide-details
                              clearable
                              @input="errores.munic_rec = false"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="6" md="6">
                            <v-text-field
                              label="Placa N°"
                              v-model="form.placa_amptr"
                              outlined
                              hide-details
                              clearable
                              @input="errores.placa_amptr = false"
                              maxlength="6"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer apellido"
                              v-model="form.primerape_amp"
                              outlined
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo apellido"
                              v-model="form.segundoape_amp"
                              outlined
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Primer nombre"
                              v-model="form.primernom_amp"
                              outlined
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Segundo nombre"
                              v-model="form.segundonom_amp"
                              outlined
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Transporto la víctima desde"
                              v-model="form.trdesde_amptr"
                              outlined
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="5">
                            <v-text-field
                              label="Hasta"
                              v-model="form.trhasta_amptr"
                              outlined
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="8">
                            <v-autocomplete
                              :items="tipoTransporte"
                              label="Tipo de Transporte"
                              outlined
                              clearable
                              return-object
                              hide-details
                              v-model="form.tipoTrans_amptr"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              :items="zona"
                              label="Zona"
                              outlined
                              return-object
                              clearable
                              hide-details
                              v-model="form.zona_amptr"
                            >
                            </v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-row>
                              <v-col cols="12" sm="6" md="7">
                                <v-menu
                                  v-model="pickersFecha.certIngreso"
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-text-field
                                      v-model="form.fechaing_cer"
                                      label="Fecha ingreso"
                                      append-icon="event"
                                      hide-details
                                      outlined
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="form.fechaing_cer"
                                    @input="
                                      pickersFecha.certIngreso = false;
                                      errores.fechaing_cer = false;
                                    "
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="12" sm="6" md="5">
                                <v-menu
                                  ref="menu4"
                                  v-model="pickersHora.certIngreso"
                                  :close-on-content-click="false"
                                  :return-value.sync="form.horaing_cer"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="form.horaing_cer"
                                      label="Hora ingreso"
                                      outlined
                                      hide-details
                                      append-icon="mdi-clock-outline"
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-if="pickersHora.certIngreso"
                                    v-model="form.horaing_cer"
                                    @input="errores.horaing_cer = false"
                                    @click:minute="
                                      $refs.menu4.save(form.horaing_cer)
                                    "
                                  ></v-time-picker>
                                </v-menu>
                              </v-col>
                              <v-col sm="12" cols="4">
                                <v-autocomplete
                                  :items="diagnosticos"
                                  :item-text="format_diagnostico"
                                  item-value="codigo"
                                  label="Dx Principal de Ingreso"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.dx1_ing"
                                ></v-autocomplete>
                              </v-col>

                              <v-col sm="12" cols="4">
                                <v-autocomplete
                                  :items="diagnosticos"
                                  :item-text="format_diagnostico"
                                  item-value="codigo"
                                  label="Otro Dx de Ingreso"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.dx2_ing"
                                ></v-autocomplete>
                              </v-col>

                              <v-col sm="12" cols="4">
                                <v-autocomplete
                                  :items="diagnosticos"
                                  :item-text="format_diagnostico"
                                  item-value="codigo"
                                  label="Otro Dx de Ingreso"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.dx3_ing"
                                ></v-autocomplete>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-row>
                              <v-col cols="12" sm="6" md="7">
                                <v-menu
                                  v-model="pickersFecha.certEgreso"
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-text-field
                                      v-model="form.fechaeg_cer"
                                      label="Fecha egreso"
                                      append-icon="event"
                                      hide-details
                                      outlined
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="form.fechaeg_cer"
                                    @input="
                                      pickersFecha.certEgreso = false;
                                      errores.fechaeg_cer = false;
                                    "
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="12" sm="6" md="5">
                                <v-menu
                                  ref="menu5"
                                  v-model="pickersHora.certEgreso"
                                  :close-on-content-click="false"
                                  :return-value.sync="form.horaeg_cer"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="form.horaeg_cer"
                                      label="Hora egreso"
                                      outlined
                                      hide-details
                                      append-icon="mdi-clock-outline"
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-if="pickersHora.certEgreso"
                                    v-model="form.horaeg_cer"
                                    @input="errores.horaeg_cer = false"
                                    @click:minute="
                                      $refs.menu4.save(form.horaeg_cer)
                                    "
                                  ></v-time-picker>
                                </v-menu>
                              </v-col>

                              <v-col sm="12" cols="4">
                                <v-autocomplete
                                  :items="diagnosticos"
                                  :item-text="format_diagnostico"
                                  item-value="codigo"
                                  label="Dx Principal de Egreso"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.dx1_egr"
                                ></v-autocomplete>
                              </v-col>

                              <v-col sm="12" cols="4">
                                <v-autocomplete
                                  :items="diagnosticos"
                                  :item-text="format_diagnostico"
                                  item-value="codigo"
                                  label="Otro Dx de Egreso"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.dx2_egr"
                                ></v-autocomplete>
                              </v-col>

                              <v-col sm="12" cols="4">
                                <v-autocomplete
                                  :items="diagnosticos"
                                  :item-text="format_diagnostico"
                                  item-value="codigo"
                                  label="Otro Dx de Egreso"
                                  outlined
                                  clearable
                                  hide-details
                                  v-model="form.dx3_egr"
                                ></v-autocomplete>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col class="d-flex" cols="8" sm="8">
                            <v-autocomplete
                              outlined
                              label="Personal Asistencial"
                              clearable
                              :loading="load_personal"
                              :items="selectObjPersonal"
                              item-value="value"
                              hide-details
                              return-object
                              v-model="form.medico"
                              @change="selectMedico()"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="4" sm="4">
                            <v-text-field
                              label="N° Documento"
                              v-model="form.nrodoc_cer"
                              outlined
                              hide-details
                              disabled
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="N° de Registro Médico"
                              v-model="form.nroreg_cer"
                              outlined
                              hide-details
                              disabled
                              clearable
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card color="basil" flat>
                        <v-row>
                          <v-col cols="4" align-self="center">
                            <span class="text-body-1 font-weight-light"
                              >Gastos médicos quirurgicos</span
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-text-field
                              label="Valor total facturado"
                              v-model="form.mediTotal_amprec"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field
                              label="Valor reclamado al FOSYGA"
                              v-model="form.mediFosyga_amprec"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="4" align-self="center">
                            <span class="text-subtitle-1 font-weight-light"
                              >Gastos de transporte y movilización de
                              victima</span
                            >
                          </v-col>
                          <v-col cols="4">
                            <v-text-field
                              label="Valor total facturado"
                              v-model="form.trTotal_amprec"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field
                              label="Valor reclamado al FOSYGA"
                              v-model="form.trFosyga_amprec"
                              outlined
                              hide-details
                              clearable
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>

                  <v-divider color="succes"></v-divider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="ma-2 px-4"
                    color="success"
                    depressed
                    large
                    @click="guardar()"
                    >Guardar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { furips } from "../../_formatos_sal.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickersFecha: {
        victima: false,
        lugar: false,
        vehiculoDesde: false,
        vehiculoHasta: false,
        remision: false,
        remiAcep: false,
        certIngreso: false,
        certEgreso: false,
      },
      pickersHora: {
        lugar: false,
        remision: false,
        remiAcep: false,
        certIngreso: false,
        certEgreso: false,
      },

      // selectPaciente: null,
      descripaciente: null,
      pacientes: {},

      card_estado: false,
      tab: null,

      id_err: false,
      fecha_actual: this.$moment().format("YYYY-MM-DD"),

      form: {
        estado: false,
        descripaciente: null,
      },
      errores: {
        primernom_vic: false,
        segundonom_vic: false,
        primerape_vic: false,
        segundoape_vic: false,
        tipodoc_vic: false,
        nrodoc_vic: false,
        fecha_vic: false,
        sexo_vic: false,
        direccion_vic: false,
        dpto_vic: false,
        munic_vic: false,
        condicion_vic: false,
        vigdesde_veh: false,
        vighasta_veh: false,

        natuEvt_lug: false,
        direccion_lug: false,
        fecha_lug: false,
        hora_lug: false,
        dpto_lug: false,
        munic_lug: false,
        zona_lug: false,
        descr_lug: false,

        estado_veh: false,
        marca_veh: false,
        placa_veh: false,
        tservicio_veh: false,
        codAseg_veh: false,
        nropoli_veh: false,
        intAutoridad_veh: false,

        cobroExc_veh: false,

        primernom_propv: false,
        segundonom_propv: false,
        primerape_propv: false,
        segundoape_propv: false,
        tipodoc_propv: false,
        nrodoc_propv: false,
        direccion_propv: false,
        telefono_propv: false,
        dpto_propv: false,
        munic_propv: false,

        primernom_cond: false,
        segundonom_cond: false,
        primerape_cond: false,
        segundoape_cond: false,
        tipodoc_cond: false,
        nrodoc_cond: false,
        direccion_cond: false,
        telefono_cond: false,
        dpto_cond: false,
        munic_cond: false,

        tipoRef_rem: false,
        fecha_rem: false,
        hora_rem: false,
        prestador_rem: false,
        codInsc_rem: false,
        profesional_rem: false,
        cargo_rem: false,
        direccion_rem: false,
        munic_rem: false,
        fechaAcep_rem: false,
        horaAcep_rem: false,
        prestador_rec: false,
        codInsc_rec: false,
        profesional_rec: false,
        cargo_rec: false,
        direccion_rec: false,
        munic_rec: false,

        placa_amptr: false,
        trdesde_amptr: false,
        trhasta_amptr: false,
        tipoTrans_amptr: false,
        zona_amptr: false,

        fechaing_cer: false,
        horaing_cer: false,
        codIng_cer: false,
        otroCodIng_cer: false,
        otro2CodIng_cer: false,
        fechaeg_cer: false,
        horaeg_cer: false,
        codEg_cer: false,
        otroCodEg_cer: false,
        otro2CodEg_cer: false,
        nrodoc_cer: false,
        nroreg_cer: false,
        mediTotal_amprec: false,
        mediFosyga_amprec: false,
        trTotal_amprec: false,
        trFosyga_amprec: false,
      },
      selectPersonal: null,
      selectObjPersonal: [],
      diagnosticos: [],

      departamentos: [],
      municipios: {},
      tipoDocumento: [
        { text: "Cédula Ciudadanía", value: "CC" },
        { text: "NIT", value: "NI" },        
        { text: "Cédula Extranjería", value: "CE" },
        { text: "Pasaporte", value: "PA" },
        { text: "Tarjeta Identidad", value: "TI" },
        { text: "Registro Civil", value: "RC" },
        { text: "Adulto Sin Id", value: "AS" },
        { text: "Menor Sin Id", value: "MS" },
        { text: "CD", value: "CD" },
        { text: "TR", value: "TR" },

      ],
      sexo: [
        { text: "Masculino", value: "M" },
        { text: "Femenino", value: "F" },
      ],
      condicionAcc: [
        { text: "Conductor", value: 1 },
        { text: "Peatón", value: 2 },
        { text: "Ocupante", value: 3 },
        { text: "Ciclista", value: 4 },
      ],
      naturalezaEvt: [
        { text: "Accidente de Transito", value: 1 },
        { text: "Sismo", value: 2 },
        { text: "Maremoto", value: 3 },
        { text: "Erupciones Volcánicas", value: 4 },
        { text: "Huracán", value: 5 },
        { text: "Inundaciones", value: 6 },
        { text: "Avalancha", value: 7 },
        { text: "Deslizamiento de Tierra", value: 8 },
        { text: "Incendio Natural", value: 9 },
        { text: "Rayo", value: 10 },
        { text: "Vendaval", value: 11 },
        { text: "Tornado", value: 12 },
        { text: "Explosión", value: 13 },
        { text: "Masacre", value: 14 },
        { text: "Mina Antipersonal", value: 15 },
        { text: "Combate", value: 16 },
        { text: "Incendio", value: 17 },
        { text: "Ataques a Municipios", value: 18 },
        { text: "Otro", value: 19 },
      ],
      zona: [
        { text: "Urbana", value: 1 },
        { text: "Rural", value: 2 },
      ],
      estadoVehiculo: [
        { text: "Asegurado", value: 1 },
        { text: "No Asegurado", value: 2 },
        { text: "Vehículo fantasma", value: 3 },
        { text: "Poliza Falsa", value: 4 },
        { text: "Vehículo en Fuga", value: 5 },
      ],
      tipoServicio: [
        { text: "Particular", value: 1 },
        { text: "Público", value: 2 },
        { text: "Oficial", value: 3 },
        { text: "Vehículo de emergencia", value: 4 },
        { text: "Vehículo de servicio diplomático o consular", value: 5 },
        { text: "Vehículo de transporte masivo", value: 6 },
        { text: "Vehículo escolar", value: 7 },
      ],
      si_no: [
        { text: "Si", value: 1 },
        { text: "No", value: 2 },
      ],
      tipoReferencia: [
        { text: "Remisión", value: 1 },
        { text: "Órden de Servicio", value: 2 },
      ],
      tipoTransporte: [
        { text: "Ambulancia Básica", value: 1 },
        { text: "Ambulancia Medicada", value: 2 },
        { text: "Lugar donde recoge la Victima", value: 3 },
      ],
      primerError: null,
    };
  },
  created() {
    this.get_empresa();
    this.get_fecha();
    this.get_diagnosticos();
    this.cargarCiudades();
    this.cargarPersonal();
    this.primerError = true;
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },

  methods: {
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
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
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
    cargarPersonal() {
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.personal = data;
          this.personal.forEach((k, v) => {
            this.selectObjPersonal.push({
              value: k.id,
              text: k.descr_tipo + "-" + k.descripcion,
              registro: k.nro_registro.trim(),
            });
          });
          this.load_personal = false;
        })
        .catch((err) => {
          this.load_personal = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar personal",
            estado: true,
          });
        });
    },
    selectMedico() {
      this.form.nroreg_cer = this.form.medico.registro;
      this.form.nrodoc_cer = this.form.medico.value;
    },

    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.departamentos = JSON.parse(JSON.stringify(data)).departamentos;
        })
        .catch((err) => {
          this.send_error("Error al cargar ciudades");
        });
    },
    get_municipios(departamento, especificador) {
      if (departamento) {
        this.municipios[especificador] = departamento.municipios;
      } else this.municipios[especificador] = [];
    },
    buscar_paciente() {
      if (!this.form.selectPaciente) {
        this.form = {
          estado: false,
          descripaciente: null,
        };
        this.id_err = true;
        this.send_error("Campo Obligatorio!");
      } else {
        let $this = this;
        this.card_estado = true;
        this.descripaciente = null;
        let paciente = this.form.selectPaciente.trim();
        post
          .postData({
            url: "clinico/dlls/PrCl101J.dll",
            data: sessionStorage.Sesion + "|" + paciente + "|",
            method: "POST",
          })
          .then((data) => {
            this.card_estado = false;
            $this.pacientes = data[0];
            this.form = {
              estado: true,
            };
            this.get_fecha();
            this.form.selectPaciente = paciente;
            this.form.nrodoc_vic = parseInt($this.pacientes.id_rep);
            this.form.primerape_vic = $this.pacientes.primerApellido;
            this.form.segundoape_vic = $this.pacientes.segundoApellido;
            this.form.primernom_vic = $this.pacientes.nombres;
            this.form.segundonom_vic = $this.pacientes.nombre2;
            this.form.tipodoc_vic = $this.pacientes.tipoid;
            this.form.fecha_vic = $this.pacientes.nacimiento;
            this.form.sexo_vic = $this.pacientes.sexo;
            this.form.munic_vic = $this.pacientes.nombreciudad;
            this.form.dpto_vic = $this.pacientes.nombredpto;

            this.form.direccion_vic = $this.pacientes.direccion;
          })
          .catch((err) => {
            console.log(err);
            this.card_estado = false;
            this.form = {
              estado: false,
              descripaciente: null,
            };
            this.$emit("snack", {
              color: "warning",
              text: err.Mensaje[0].msg,
              estado: true,
            });
          });
      }
    },
    validarCampo(campo, data) {
      if (!data[campo]) {
        this.errores[campo] = true;
        if (this.primerError) {
          this.send_error("Campo Obligatorio!");
          this.primerError = false;
        }
      }
    },
    guardar() {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.condicion_vic) {
        this.errores.condicion_vic = true;
        this.send_error("Selecciona Condición del accidentado -II-");
      } else if (!data.natuEvt_lug) {
        this.errores.natuEvt_lug = true;
        this.send_error("Selecciona Naturaleza del evento-III-");
      } else if (!data.direccion_lug) {
        this.errores.direccion_lug = true;
        this.send_error("Indique la Direccion del lugar-III-");
      } else if (!data.fecha_lug) {
        this.errores.fecha_lug = true;
        this.send_error("Indique la fecha del evento-III-");
      } else if (!data.hora_lug) {
        this.errores.hora_lug = true;
        this.send_error("Indique la hora del evento-III-");
      } else if (!data.dpto_lug) {
        this.errores.dpto_lug = true;
        this.send_error("Indique el departamento del evento-III-");
      } else if (!data.munic_lug) {
        this.errores.munic_lug = true;
        this.send_error("Indique el municipio del evento-III-");
      } else if (!data.zona_lug) {
        this.errores.zona_lug = true;
        this.send_error("Indique la zona del evento-III-");
      } else if (!data.descr_lug) {
        this.errores.descr_lug = true;
        this.send_error("Indique la descripcion del evento-III-");
      } else if (!data.estado_veh) {
        this.errores.estado_veh = true;
        this.send_error("Indique el estado del Vehiculo-IV-");
      } else if (!data.placa_veh) {
        this.errores.placa_veh = true;
        this.send_error("Indique la placa del Vehiculo-IV-");
      } else if (!data.marca_veh) {
        this.errores.marca_veh = true;
        this.send_error("Indique la marca del Vehiculo-IV-");
      } else if (!data.tservicio_veh) {
        this.errores.tservicio_veh = true;
        this.send_error("Indique el tipo de servicio-IV-");
      } else if (!data.codAseg_veh) {
        this.errores.codAseg_veh = true;
        this.send_error("Indique el codigo de la aseguradora-IV-");
      } else if (!data.nropoli_veh) {
        this.errores.nropoli_veh = true;
        this.send_error("Indique el numero de póliza-IV-");
      } else if (!data.intAutoridad_veh) {
        this.errores.intAutoridad_veh = true;
        this.send_error("Indique la intervención de Autoridad-IV-");
      } else if (!data.vigdesde_veh) {
        this.errores.intAutorvigdesde_vehidad_veh = true;
        this.send_error("Indique inicio de vigencia-IV-");
      } else if (!data.vighasta_veh) {
        this.errores.vighasta_veh = true;
        this.send_error("Indique final de vigencia-IV-");
      } else if (!data.cobroExc_veh) {
        this.errores.cobroExc_veh = true;
        this.send_error("Indique excedente póliza -IV-");
      } else {
        let fecha_actual = this.form.fecha_actual.replace(/\-/g, "");
        let consecutivo = 1;
        let idpaciente = this.form.selectPaciente.trim();
        let condicion = this.form.condicion_vic.value;
        let naturaleza = this.form.natuEvt_lug;
        let direcc_evt = this.form.direccion_lug;
        let fecha_evt = this.form.fecha_lug.replace(/\-/g, "");
        let hora_evt = this.form.hora_lug;
        let ciudad_evt = this.form.munic_lug.c_digo_dane_del_municipio;
        let zona_evt = this.form.zona_lug;
        // let descripcion_evt = this.form.descr_lug;
        let estado_veh = this.form.estado_veh;
        let placa_veh = this.form.placa_veh;
        let marca_veh = this.form.marca_veh;
        let tiposerv_veh = this.form.tservicio_veh;
        let codaseg_veh = this.form.codAseg_veh;
        let poliza_veh = this.form.nropoli_veh;
        let interv_veh = this.form.intAutoridad_veh;
        let vigdesde_veh = this.form.vigdesde_veh
          ? this.form.vigdesde_veh.replace(/\-/g, "")
          : 0;
        let vighasta_veh = this.form.vighasta_veh
          ? this.form.vighasta_veh.replace(/\-/g, "")
          : 0;
        let cobroex_veh = this.form.cobroExc_veh;

        let apellido1_propv = this.form.primerape_propv
          ? this.form.primerape_propv.trim()
          : "";
        let apellido2_propv = this.form.segundoape_propv
          ? this.form.segundoape_propv.trim()
          : "";
        let nombre1_propv = this.form.primernom_propv
          ? this.form.primernom_propv.trim()
          : "";
        let nombre2_propv = this.form.segundonom_propv
          ? this.form.segundonom_propv.trim()
          : "";
        let tipodoc_propv = this.form.tipodoc_propv
          ? this.form.tipodoc_propv.value
          : "";
        let id_propv = this.form.nrodoc_propv
          ? this.form.nrodoc_propv.trim()
          : "";
        let direccion_propv = this.form.direccion_propv
          ? this.form.direccion_propv.trim()
          : "";
        let telefono_propv = this.form.telefono_propv
          ? this.form.telefono_propv.trim()
          : "0";
        let ciudad_propv = this.form.munic_propv
          ? this.form.munic_propv.c_digo_dane_del_municipio
          : "0";

        let apellido1_cond = this.form.primerape_cond
          ? this.form.primerape_cond.trim()
          : "";
        let apellido2_cond = this.form.segundoape_cond
          ? this.form.segundoape_cond.trim()
          : "";
        let nombre1_cond = this.form.primernom_cond
          ? this.form.primernom_cond.trim()
          : "";
        let nombre2_cond = this.form.segundonom_cond
          ? this.form.segundonom_cond.trim()
          : "";
        let tipodoc_cond = this.form.tipodoc_cond
          ? this.form.tipodoc_cond.value
          : "";

        let id_cond = this.form.nrodoc_cond ? this.form.nrodoc_cond.trim() : "";
        let direccion_cond = this.form.direccion_cond
          ? this.form.direccion_cond.trim()
          : "";
        let telefono_cond = this.form.telefono_cond
          ? this.form.telefono_cond.trim()
          : "";
        let ciudad_cond = this.form.munic_cond
          ? this.form.munic_cond.c_digo_dane_del_municipio
          : "0";

        let estado_veh2 = this.form.estado_veh2
          ? this.form.estado_veh2.value
          : "0";
        let placa_veh2 = this.form.placa_veh2 ? this.form.placa_veh2 : "";
        let tipodoc_cond2 = this.form.tipodoc_cond2
          ? this.form.tipodoc_cond2.value
          : "";
        let id_cond2 = this.form.nrodoc_cond2
          ? this.form.nrodoc_cond2.trim()
          : "";

        let estado_veh3 = this.form.estado_veh3
          ? this.form.estado_veh3.value
          : "0";
        let placa_veh3 = this.form.placa_veh3;
        let tipodoc_cond3 = this.form.tipodoc_cond3
          ? this.form.tipodoc_cond3.value
          : "";
        let id_cond3 = this.form.nrodoc_cond3
          ? this.form.nrodoc_cond3.trim()
          : "";

        let tiporef = this.form.tipoRef_rem;
        let fecharem = this.form.fecha_rem
          ? this.form.fecha_rem.replace(/\-/g, "")
          : 0;
        let horarem = this.form.hora_rem
          ? this.form.hora_rem.replace(/\:/g, "")
          : 0;
        let prestramite = this.form.prestador_rem
          ? this.form.prestador_rem.trim()
          : "";
        let codigoinsc = this.form.codInsc_rem
          ? this.form.codInsc_rem.trim()
          : "";
        let profremite = this.form.profesional_rem
          ? this.form.profesional_rem.trim()
          : "";
        let cargoremite = this.form.cargo_rem ? this.form.cargo_rem.trim() : "";
        let direcremite = this.form.direccion_rem
          ? this.form.direccion_rem.trim()
          : "";
        let municipioremite = this.form.munic_rem
          ? this.form.munic_rem.trim()
          : "";
        let fechaacepremite = this.form.fechaAcep_rem
          ? this.form.fechaAcep_rem.replace(/\-/g, "")
          : 0;
        let horaacepremite = this.form.horaAcep_rem
          ? this.form.horaAcep_rem.replace(/\:/g, "")
          : 0;
        let prestadorrecibe = this.form.prestador_rec
          ? this.form.prestador_rec.trim()
          : "";
        let codinscrecibe = this.form.codInsc_rec
          ? this.form.codInsc_rec.trim()
          : "";
        let profrecibe = this.form.profesional_rec
          ? this.form.profesional_rec.trim()
          : "";
        let cargorecibe = this.form.cargo_rec ? this.form.cargo_rec.trim() : "";
        let direccionrecibe = this.form.direccion_rec
          ? this.form.direccion_rec.trim()
          : "";
        let municipiorecibe = this.form.munic_rec
          ? this.form.munic_rec.trim()
          : "";
        let placa_amptr = this.form.placa_amptr
          ? this.form.placa_amptr.trim()
          : "";
        let apellido1_amp = this.form.primerape_amp
          ? this.form.primerape_amp.trim()
          : "";
        let apellido2_amp = this.form.segundoape_amp
          ? this.form.segundoape_amp.trim()
          : "";
        let nombre1_amp = this.form.primernom_amp
          ? this.form.primernom_amp.trim()
          : "";
        let nombre2_amp = this.form.segundonom_amp
          ? this.form.segundonom_amp.trim()
          : "";
        let trdesde_amp = this.form.trdesde_amptr
          ? this.form.trdesde_amptr.trim()
          : "";
        let trhasta_amp = this.form.trhasta_amptr
          ? this.form.trhasta_amptr.trim()
          : "";
        let tipotr_amp = this.form.tipoTrans_amptr
          ? this.form.tipoTrans_amptr.value
          : "0";
        let zona_amp = this.form.zona_amptr ? this.form.zona_amptr.value : "0";
        let fingreso_cert = this.form.fechaing_cer
          ? this.form.fechaing_cer.replace(/\-/g, "")
          : 0;
        let horaing_cert = this.form.horaing_cer
          ? this.form.horaing_cer.replace(/\:/g, "")
          : 0;
        let fegreso_cert = this.form.fechaeg_cer
          ? this.form.fechaeg_cer.replace(/\-/g, "")
          : 0;
        let horaegr_cert = this.form.horaeg_cer
          ? this.form.horaeg_cer.replace(/\:/g, "")
          : 0;
        let dx1ingr_cert = this.form.dx1_ing ? this.form.dx1_ing : 0;
        let dx2ingr_cert = this.form.dx2_ing ? this.form.dx2_ing : 0;
        let dx3ingr_cert = this.form.dx3_ing ? this.form.dx3_ing : 0;
        let dx1egr_cert = this.form.dx1_egr ? this.form.dx1_egr : 0;
        let dx2egr_cert = this.form.dx2_egr ? this.form.dx2_egr : 0;
        let dx3egr_cert = this.form.dx3_egr ? this.form.dx3_egr : 0;
        let medico_cert = this.form.medico ? this.form.medico.value : "0";

        let vlrfactgto_rec = this.form.mediTotal_amprec
          ? this.form.mediTotal_amprec.trim()
          : 0;
        let vlrrecgto_rec = this.form.mediFosyga_amprec
          ? this.form.mediFosyga_amprec.trim()
          : 0;
        let vlrtrfact_rec = this.form.trTotal_amprec
          ? this.form.trTotal_amprec.trim()
          : 0;
        let vlrtrrecgto_rec = this.form.trFosyga_amprec
          ? this.form.trFosyga_amprec.trim()
          : 0;
        var descr_lug = data.descr_lug
          ? window.btoa(data.descr_lug.trim())
          : "";

        post
          .postData({
            url: "Clinico/dlls/PrFurips01.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              fecha_actual +
              "|" +
              idpaciente +
              "|" +
              condicion +
              "|" +
              naturaleza +
              "|" +
              direcc_evt +
              "|" +
              ciudad_evt +
              "|" +
              fecha_evt +
              "|" +
              hora_evt +
              "|" +
              zona_evt +
              "|" +
              estado_veh +
              "|" +
              placa_veh +
              "|" +
              marca_veh +
              "|" +
              tiposerv_veh +
              "|" +
              codaseg_veh +
              "|" +
              poliza_veh +
              "|" +
              interv_veh +
              "|" +
              vigdesde_veh +
              "|" +
              vighasta_veh +
              "|" +
              cobroex_veh +
              "|" +
              tiporef +
              "|" +
              fecharem +
              "|" +
              horarem +
              "|" +
              prestramite +
              "|" +
              codigoinsc +
              "|" +
              profremite +
              "|" +
              cargoremite +
              "|" +
              direcremite +
              "|" +
              municipioremite +
              "|" +
              fechaacepremite +
              "|" +
              horaacepremite +
              "|" +
              prestadorrecibe +
              "|" +
              codinscrecibe +
              "|" +
              profrecibe +
              "|" +
              cargorecibe +
              "|" +
              direccionrecibe +
              "|" +
              municipiorecibe +
              "|" +
              placa_amptr +
              "|" +
              apellido1_amp +
              "|" +
              apellido2_amp +
              "|" +
              nombre1_amp +
              "|" +
              nombre2_amp +
              "|" +
              trdesde_amp +
              "|" +
              trhasta_amp +
              "|" +
              tipotr_amp +
              "|" +
              zona_amp +
              "|" +
              fingreso_cert +
              "|" +
              horaing_cert +
              "|" +
              fegreso_cert +
              "|" +
              horaegr_cert +
              "|" +
              dx1ingr_cert +
              "|" +
              dx2ingr_cert +
              "|" +
              dx3ingr_cert +
              "|" +
              dx1egr_cert +
              "|" +
              dx2egr_cert +
              "|" +
              dx3egr_cert +
              "|" +
              medico_cert +
              "|" +
              vlrfactgto_rec +
              "|" +
              vlrrecgto_rec +
              "|" +
              vlrtrfact_rec +
              "|" +
              vlrtrrecgto_rec +
              "|" +
              apellido1_propv +
              "|" +
              apellido2_propv +
              "|" +
              nombre1_propv +
              "|" +
              nombre2_propv +
              "|" +
              tipodoc_propv +
              "|" +
              id_propv +
              "|" +
              direccion_propv +
              "|" +
              telefono_propv +
              "|" +
              ciudad_propv +
              "|" +
              apellido1_cond +
              "|" +
              apellido2_cond +
              "|" +
              nombre1_cond +
              "|" +
              nombre2_cond +
              "|" +
              tipodoc_cond +
              "|" +
              id_cond +
              "|" +
              direccion_cond +
              "|" +
              telefono_cond +
              "|" +
              ciudad_cond +
              "|" +
              estado_veh2 +
              "|" +
              placa_veh2 +
              "|" +
              tipodoc_cond2 +
              "|" +
              id_cond2 +
              "|" +
              estado_veh3 +
              "|" +
              placa_veh3 +
              "|" +
              tipodoc_cond3 +
              "|" +
              id_cond3 +
              "|" +
              descr_lug +
              "|",
            method: "POST",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Registro guardado correctamente",
              estado: true,
            });
            this.print_item({ nro_rep: data[0], fecha2_rep: fecha_actual});
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error(err);
          });
      }
    },
    // format_envio(data) {

    // },
    print_item(item) {
      this.loader = true;
      let nro = item.nro_rep.trim();
      let fecha = item.fecha2_rep;

      var key = nro + "|" + fecha + "|" ;
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Clinico/dlls/PrFurips01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          let detalleEvento_base64 = '' 
          for(let i = 1; i <= 10; i++){
            detalleEvento_base64 += data_impresion[`desc${i.toString().padStart(2, '0')}_evt_rep`]
          }
          let detalleEvento = atob(detalleEvento_base64)

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
            detalleEvento
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            furips(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    get_impresion(data) {
      var datosEnvio = sessionStorage.Sesion + "|" + data + "|";
      post
        .postData({
          url: "Clinico/dlls/PrFurips01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          furips(data).then(() => {
            console.log("Impresión terminada");
          });
        })
        .catch((err) => {
          this.load.imprimir_factura = false;
          this.disabled.imprimir_factura = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    format_departamentos: function (val) {
      return val.departamento.trim();
    },
    format_municipios: function (val) {
      return val.municipio.trim();
    },
    get_fecha() {
      this.form.fecha_actual = this.$moment().format("YYYY-MM-DD");
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
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
