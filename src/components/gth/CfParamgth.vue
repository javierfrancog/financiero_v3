<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-tune-vertical</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Parámetros</v-list-item-title
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
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
            <!-- <v-row class="d-flex mb-4" no-gutters>
              <v-col class="d-flex" cols="8" sm="4">
                <v-select
                  :items="años"
                  label="Año"
                  outlined
                  clearable
                  return-object
                  hide-details
                  v-model="form.año"
                  required
                  @change="agregar_item()"
                ></v-select>
              </v-col>
            </v-row>-->
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>General</v-tab>
            <v-tab>Seguridad Social</v-tab>
            <v-tab>Provisiones</v-tab>
            <v-tab>Parafiscales</v-tab>
            <v-tab>Correo</v-tab>
          </v-tabs>

          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab" class="mt-3">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex mb-1 mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Año"
                      clearable
                      outlined
                      required
                      v-model="form.año"
                      :error="errores.año"
                      @input="errores.año = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Salario Mínimo"
                      clearable
                      outlined
                      required
                      v-model="form.salario"
                      :error="errores.salario"
                      @input="errores.salario = false"
                      v-money="money"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="3">
                    <v-text-field
                      label="Auxilio de Transporte"
                      clearable
                      outlined
                      v-model="form.auxiliotr"
                      v-money="money"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="3">
                    <v-text-field
                      label="U.v.t"
                      clearable
                      outlined
                      v-model="form.uvt"
                      v-money="money"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row class="d-flex mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Nómina"
                      v-model="form.pasnomina"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pasnomina"
                      @change="errores.pasnomina = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cta Mayor Costo"
                      v-model="form.mayorcto"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.mayorcto"
                      @change="errores.mayorcto = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Id_Arl"
                      v-model="form.arl"
                      :items="ruts4"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Arl"
                      v-model="form.gtoarl"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtoarl"
                      @change="errores.gtoarl = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Arl"
                      v-model="form.pasarl"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pasarl"
                      @change="errores.pasarl = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Id Pila"
                      v-model="form.idpila"
                      :items="ruts4"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      :error="errores.idpila"
                      @change="errores.idpila = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Pila"
                      v-model="form.paspila"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.paspila"
                      @change="errores.paspila = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Auxilio Transporte"
                      v-model="form.gtoauxtr"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtoauxtr"
                      @change="errores.gtoauxtr = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-col class="d-flex" cols="8">
                  <v-switch
                    v-model="form.omitecnfg"
                    hide-details
                    label="Omitir Configuracion Contable del Colaborador"
                  ></v-switch>
                </v-col>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="succes"></v-divider>
                <v-row>
                  <v-col class="text-center font-weight-bold"
                    >Aportes salud</v-col
                  >
                  <v-col class="text-center font-weight-bold"
                    >Aportes pensión</v-col
                  >
                </v-row>
                <v-row class="d-flex mb-1 mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Empresa"
                      clearable
                      outlined
                      required
                      v-model="form.saludempr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Colaborador"
                      clearable
                      outlined
                      required
                      v-model="form.saludcolab"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Empresa"
                      clearable
                      outlined
                      required
                      v-model="form.pensionempr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Colaborador"
                      clearable
                      outlined
                      required
                      v-model="form.pensioncolab"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row class="d-flex mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Gasto"
                      v-model="form.gtosalud"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtosalud"
                      @change="errores.gtosalud = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Gasto"
                      v-model="form.gtopension"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtopension"
                      @change="errores.gtopension = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Costo"
                      v-model="form.ctosalud"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.ctosalud"
                      @change="errores.ctosalud = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Costo"
                      v-model="form.ctopension"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.ctopension"
                      @change="errores.ctopension = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex mb-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Pasivo"
                      v-model="form.passalud"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.passalud"
                      @change="errores.passalud = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Pasivo"
                      v-model="form.paspension"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.paspension"
                      @change="errores.paspension = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <!-- <v-divider color="succes"></v-divider> -->
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <!-- <v-col class="text-left font-weight-bold">Provisiones</v-col> -->

                <v-row class="d-flex mb-1 mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Cesantias"
                      clearable
                      outlined
                      required
                      v-model="form.cesantias"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Intereses"
                      clearable
                      outlined
                      required
                      v-model="form.intereses"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Prima Servicios"
                      clearable
                      outlined
                      required
                      v-model="form.prima"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Vacaciones"
                      clearable
                      outlined
                      required
                      v-model="form.vacaciones"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row class="d-flex mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Cesantias"
                      v-model="form.gtocesant"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtocesant"
                      @change="errores.gtocesant = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Cesantias"
                      v-model="form.pascesant"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pascesant"
                      @change="errores.pascesant = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Intereses"
                      v-model="form.gtointer"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtointer"
                      @change="errores.gtointer = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Intereses"
                      v-model="form.pasinter"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pasinter"
                      @change="errores.pasinter = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Prima"
                      v-model="form.gtoprima"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Prima"
                      v-model="form.pasprima"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pasprima"
                      @change="errores.pasprima = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex mb-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Vacaciones"
                      v-model="form.gtovacac"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtovacac"
                      @change="errores.gtovacac = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Vacaciones"
                      v-model="form.pasvacac"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pasvacac"
                      @change="errores.pasvacac = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-divider color="succes"></v-divider>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <!-- <v-row>
                  <v-col class="text-left font-weight-bold">Parafiscales</v-col>
                </v-row>-->

                <v-row class="d-flex mb-1 mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Caja Compensación"
                      clearable
                      outlined
                      required
                      v-model="form.caja"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% Sena"
                      clearable
                      outlined
                      required
                      v-model="form.sena"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="% I.c.b.f"
                      clearable
                      outlined
                      required
                      v-model="form.icbf"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-switch
                      v-model="form.exopara"
                      label="Exonerado Sena-Icbf"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row class="d-flex mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Caja"
                      v-model="form.gtocaja"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtocaja"
                      @change="errores.gtocaja = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Icbf"
                      v-model="form.gtoicbf"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtoicbf"
                      @change="errores.gtoicbf = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="d-flex mb-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Gasto Sena"
                      v-model="form.gtosena"
                      :items="tablaPucg5"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.gtosena"
                      @change="errores.gtosena = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Pasivo Parafiscales"
                      v-model="form.pasparaf"
                      :items="tablaPucp4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      required
                      :error="errores.pasparaf"
                      @change="errores.pasparaf = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex mb-1 mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="3" sm="6">
                    <v-text-field
                      label="Servidor de Correo"
                      clearable
                      outlined
                      required
                      v-model="form.servidor"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="2">
                    <v-text-field
                      label="Puerto"
                      clearable
                      outlined
                      required
                      v-model="form.puerto"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex mb-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="3" sm="6">
                    <v-text-field
                      label="Usuario"
                      clearable
                      outlined
                      required
                      v-model="form.usuario"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Contraseña"
                      clearable
                      outlined
                      required
                      v-model="form.clave"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>
          <v-col>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="light-blue accent-4 white--text"
                      class="mr-2"
                      @click="get_ruts4(), get_pucp4()"
                      depressed
                    >
                      <v-icon size="30" center>mdi-autorenew</v-icon>
                    </v-btn>
                  </template>
                  <span>Actualiza Tablas</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
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
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      ruts4: [],
      tablaPuc: [],
      tablaPuc1: [],
      tablaPucg4: [],
      tablaPucg5: [],
      tablaPucp4: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Año", align: "left", value: "ano_rep" },
        { text: "Salario Mínimo", align: "left", value: "salario_rep" },
        { text: "Aux.Transporte", align: "center", value: "auxtr_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        año: false,
        pasnomina: false,
        mayorcto: false,
        gtoarl: false,
        pasarl: false,
        paspila: false,
        idpila: false,
        gtoauxtr: false,
        gtosalud: false,
        gtopension: false,
        ctosalud: false,
        ctopension: false,
        passalud: false,
        paspension: false,
        gtocesant: false,
        gtointer: false,
        pasinter: false,
        gtoprima: false,
        pasprima: false,
        gtovacac: false,
        pasvacac: false,
        gtocaja: false,
        gtoicbf: false,
        gtosena: false,
        pasparaf: false,
      },
      card_estado: false,
      tab: 0,
      años: [],
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    var ano_actual = new Date().getFullYear();
    this.años.push(ano_actual);
    for (let i = 1; i < 3; i++) this.años.push(ano_actual + i);
    for (let i = 1; i < 3; i++) this.años.unshift(ano_actual - i);

    this.cargarcontenido();
    this.get_ruts4();
    this.get_pucp4();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      // console.log(item);

      this.form.año = item.ano_rep;
      this.form.salario = item.salario_rep;
      this.form.auxiliotr = item.auxtr_rep;
      this.form.uvt = item.uvt_rep;
      this.form.saludempr = item.salemp_rep;
      this.form.saludcolab = item.salcol_rep;
      this.form.pensionempr = item.pensemp_rep;
      this.form.pensioncolab = item.penscol_rep;
      this.form.cesantias = item.cesant_rep;
      this.form.intereses = item.inter_rep;
      this.form.prima = item.prima_rep;
      this.form.vacaciones = item.vacac_rep;
      this.form.caja = item.caja_rep;
      this.form.sena = item.sena_rep;
      this.form.icbf = item.icbf_rep;
      this.form.servidor = item.servidor_rep;
      this.form.puerto = item.puerto_rep;
      this.form.usuario = item.usuario_rep;
      this.form.clave = item.clave_rep;
      this.form.exopara = item.exoparaf_rep == "1" ? true : false;

      var busqueda_pasnom = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pasnom_rep.trim()
      );
      this.form.pasnomina = busqueda_pasnom;

      var busqueda_maycosto = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.maycosto_rep.trim()
      );
      this.form.mayorcto = busqueda_maycosto;

      var busqueda_arl = this.ruts4.find(
        (el) => el.identificacion_rut == item.arl_rep
      );
      this.form.arl = busqueda_arl;

      var busqueda_idpila = this.ruts4.find(
        (el) => el.identificacion_rut == item.idpila_rep
      );
      this.form.idpila = busqueda_idpila;

      var busqueda_gtoarl = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtoarl_rep.trim()
      );
      this.form.gtoarl = busqueda_gtoarl;

      var busqueda_pasarl = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pasarl_rep.trim()
      );
      this.form.pasarl = busqueda_pasarl;

      var busqueda_gtoauxtr = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtoauxtr_rep.trim()
      );
      this.form.gtoauxtr = busqueda_gtoauxtr;

      var busqueda_paspila = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.paspila_rep.trim()
      );
      this.form.paspila = busqueda_paspila;

      var busqueda_gtosalud = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtosalud_rep.trim()
      );
      this.form.gtosalud = busqueda_gtosalud;

      var busqueda_gtopension = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtopension_rep.trim()
      );
      this.form.gtopension = busqueda_gtopension;

      var busqueda_ctosalud = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.ctosalud_rep.trim()
      );
      this.form.ctosalud = busqueda_ctosalud;

      var busqueda_ctopension = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.ctopension_rep.trim()
      );
      this.form.ctopension = busqueda_ctopension;

      var busqueda_passalud = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.passalud_rep.trim()
      );
      this.form.passalud = busqueda_passalud;

      var busqueda_paspension = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.paspension_rep.trim()
      );
      this.form.paspension = busqueda_paspension;

      var busqueda_gtocesant = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtocesant_rep.trim()
      );
      this.form.gtocesant = busqueda_gtocesant;

      var busqueda_pascesant = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pascesant_rep.trim()
      );
      this.form.pascesant = busqueda_pascesant;

      var busqueda_gtointer = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtointer_rep.trim()
      );
      this.form.gtointer = busqueda_gtointer;

      var busqueda_pasinter = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pasinter_rep.trim()
      );
      this.form.pasinter = busqueda_pasinter;

      var busqueda_gtoprima = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtoprima_rep.trim()
      );
      this.form.gtoprima = busqueda_gtoprima;

      var busqueda_pasprima = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pasprima_rep.trim()
      );
      this.form.pasprima = busqueda_pasprima;

      var busqueda_gtovacac = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtovacac_rep.trim()
      );
      this.form.gtovacac = busqueda_gtovacac;

      var busqueda_pasvacac = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pasvacac_rep.trim()
      );
      this.form.pasvacac = busqueda_pasvacac;

      var busqueda_gtocaja = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtocaja_rep.trim()
      );
      this.form.gtocaja = busqueda_gtocaja;

      var busqueda_gtoicbf = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtoicbf_rep.trim()
      );
      this.form.gtoicbf = busqueda_gtoicbf;

      var busqueda_gtosena = this.tablaPucg5.find(
        (el) => el.cod_puc.trim() == item.gtosena_rep.trim()
      );
      this.form.gtosena = busqueda_gtosena;

      var busqueda_pasparaf = this.tablaPucp4.find(
        (el) => el.cod_puc.trim() == item.pasparaf_rep.trim()
      );
      this.form.pasparaf = busqueda_pasparaf;

      this.form.omitecnfg = item.omitecnfg_rep == "1" ? true : false;

      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Parámetros";
      this.dialogo.tipo = 1;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.año) {
        this.errores.año = true;
        this.send_error("Año Obligatorio!");
      } else if (!data.gtoicbf) {
        this.errores.gtoicbf = true;
        this.send_error("Cuenta Icbf Obligatoria!");
      } else if (!data.gtocaja) {
        this.errores.gtocaja = true;
        this.send_error("Cuenta Caja Obligatoria!");
      } else if (!data.gtosena) {
        this.errores.gtosena = true;
        this.send_error("Cuenta Sena Obligatoria!");
      } else if (!data.pasparaf) {
        this.errores.pasparaf = true;
        this.send_error("Pasivo Parafiscales Obligatoria!");
      } else if (!data.gtovacac) {
        this.errores.gtovacac = true;
        this.send_error("Cuenta Vacaciones Obligatoria!");
      } else if (!data.pasvacac) {
        this.errores.pasvacac = true;
        this.send_error("Pasivo Vacaciones Obligatoria!");
      } else if (!data.pasprima) {
        this.errores.pasprima = true;
        this.send_error("Pasivo Prima Obligatoria!");
      } else if (!data.pasinter) {
        this.errores.pasinter = true;
        this.send_error("Pasivo Intereses Obligatoria!");
      } else if (!data.gtointer) {
        this.errores.gtointer = true;
        this.send_error("Gasto Intereses Obligatoria!");
      } else if (!data.pascesant) {
        this.errores.pascesant = true;
        this.send_error("Pasivo Cesantias Obligatoria!");
      } else if (!data.gtocesant) {
        this.errores.gtocesant = true;
        this.send_error("Gasto Cesantias Obligatoria!");
      } else if (!data.paspension) {
        this.errores.paspension = true;
        this.send_error("Pasivo Pensiones Obligatoria!");
      } else if (!data.passalud) {
        this.errores.passalud = true;
        this.send_error("Pasivo Salud Obligatoria!");
      } else if (!data.ctopension) {
        this.errores.ctopension = true;
        this.send_error("Costo Pensión Obligatoria!");
      } else if (!data.ctosalud) {
        this.errores.ctosalud = true;
        this.send_error("Costo Salud Obligatoria!");
      } else if (!data.gtopension) {
        this.errores.gtopension = true;
        this.send_error("Gasto Pensión Obligatoria!");
      } else if (!data.gtosalud) {
        this.errores.gtosalud = true;
        this.send_error("Gasto Salud Obligatoria!");
      } else if (!data.gtoauxtr) {
        this.errores.gtoauxtr = true;
        this.send_error("Gasto Auxilio Transporte Obligatoriao!");
      } else if (!data.paspila) {
        this.errores.paspila = true;
        this.send_error("Pasivo Pila Obligatoriao!");
      } else if (!data.idpila) {
        this.errores.idpila = true;
        this.send_error("Id Pila Obligatoriao!");
      } else if (!data.pasarl) {
        this.errores.pasarl = true;
        this.send_error("Pasivo ARL Obligatorio!");
      } else if (!data.gtoarl) {
        this.errores.gtoarl = true;
        this.send_error("Gasto ARL Obligatorio!");
      } else if (!data.pasnomina) {
        this.errores.pasnomina = true;
        this.send_error("Pasivo Nómina Obligatorio!");
      } else if (!data.mayorcto) {
        this.errores.mayorcto = true;
        this.send_error("Costo Nómina Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      // console.log(data);
      var año = data.año;
      var valor1 = data.salario ? data.salario.replace(/\,/g, "") : "0";
      var salario = parseInt(valor1);
      var valor2 = data.auxiliotr ? data.auxiliotr.replace(/\,/g, "") : "0";
      var auxiliotr = parseInt(valor2);

      var valor3 = data.saludempr ? data.saludempr.replace(/\,/g, "") : "0";
      var saludempr = valor3;
      var valor4 = data.saludcolab ? data.saludcolab.replace(/\,/g, "") : "0";
      var saludcolab = valor4;

      var valor5 = data.pensionempr ? data.pensionempr.replace(/\,/g, "") : "0";
      var pensionempr = valor5;
      var valor6 = data.pensioncolab
        ? data.pensioncolab.replace(/\,/g, "")
        : "0";
      var pensioncolab = valor6;

      var valor7 = data.cesantias ? data.cesantias.replace(/\,/g, "") : "0";
      var cesantias = valor7;

      var valor8 = data.intereses ? data.intereses.replace(/\,/g, "") : "0";
      var intereses = valor8;
      var valor9 = data.prima ? data.prima.replace(/\,/g, "") : "0";
      var prima = valor9;
      var valor10 = data.vacaciones ? data.vacaciones.replace(/\,/g, "") : "0";
      var vacaciones = valor10;

      var valor11 = data.caja ? data.caja.replace(/\,/g, "") : "0";
      var caja = valor11;
      var valor12 = data.sena ? data.sena.replace(/\,/g, "") : "0";
      var sena = valor12;
      var valor13 = data.icbf ? data.icbf.replace(/\,/g, "") : "0";
      var icbf = valor13;

      var valor14 = data.uvt ? data.uvt.replace(/\,/g, "") : "0";
      var uvt = parseInt(valor14);

      var arl = data.arl.identificacion_rut ? data.arl.identificacion_rut : "0";
      var idpila = data.idpila.identificacion_rut
        ? data.idpila.identificacion_rut
        : "0";
      var pasnomina = data.pasnomina.cod_puc ? data.pasnomina.cod_puc : "0";
      var mayorcto = data.mayorcto.cod_puc ? data.mayorcto.cod_puc : "0";
      var gtoarl = data.gtoarl.cod_puc ? data.gtoarl.cod_puc : "0";
      var pasarl = data.pasarl.cod_puc ? data.pasarl.cod_puc : "0";
      var gtoauxtr = data.gtoauxtr.cod_puc ? data.gtoauxtr.cod_puc : "0";
      var paspila = data.paspila.cod_puc ? data.paspila.cod_puc : "0";
      var gtosalud = data.gtosalud.cod_puc ? data.gtosalud.cod_puc : "0";
      var ctosalud = data.ctosalud.cod_puc ? data.ctosalud.cod_puc : "0";
      var passalud = data.passalud.cod_puc ? data.passalud.cod_puc : "0";
      var gtopension = data.gtopension.cod_puc ? data.gtopension.cod_puc : "0";
      var ctopension = data.ctopension.cod_puc ? data.ctopension.cod_puc : "0";
      var paspension = data.paspension.cod_puc ? data.paspension.cod_puc : "0";
      var gtocesant = data.gtocesant.cod_puc ? data.gtocesant.cod_puc : "0";
      var pascesant = data.pascesant.cod_puc ? data.pascesant.cod_puc : "0";
      var gtointer = data.gtointer.cod_puc ? data.gtointer.cod_puc : "0";
      var pasinter = data.pasinter.cod_puc ? data.pasinter.cod_puc : "0";
      var gtoprima = data.gtoprima.cod_puc ? data.gtoprima.cod_puc : "0";
      var pasprima = data.pasprima.cod_puc ? data.pasprima.cod_puc : "0";
      var gtovacac = data.gtovacac.cod_puc ? data.gtovacac.cod_puc : "0";
      var pasvacac = data.pasvacac.cod_puc ? data.pasvacac.cod_puc : "0";
      var gtocaja = data.gtocaja.cod_puc ? data.gtocaja.cod_puc : "0";
      var gtoicbf = data.gtoicbf.cod_puc ? data.gtoicbf.cod_puc : "0";
      var gtosena = data.gtosena.cod_puc ? data.gtosena.cod_puc : "0";
      var pasparaf = data.pasparaf.cod_puc ? data.pasparaf.cod_puc : "0";
      var servidor = data.servidor;
      var puerto = data.puerto;
      var usuario = data.usuario;
      var clave = data.clave;
      var omitecnfg = data.omitecnfg ? "1" : "0";

      var eliminar = data.eliminar ? "1" : "0";
      var exopara = data.exopara ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/Cfparamgth.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          año +
          "|" +
          salario +
          "|" +
          auxiliotr +
          "|" +
          saludempr +
          "|" +
          saludcolab +
          "|" +
          pensionempr +
          "|" +
          pensioncolab +
          "|" +
          cesantias +
          "|" +
          intereses +
          "|" +
          prima +
          "|" +
          vacaciones +
          "|" +
          caja +
          "|" +
          sena +
          "|" +
          icbf +
          "|" +
          arl +
          "|" +
          pasnomina +
          "|" +
          mayorcto +
          "|" +
          gtoarl +
          "|" +
          pasarl +
          "|" +
          gtoauxtr +
          "|" +
          gtosalud +
          "|" +
          ctosalud +
          "|" +
          passalud +
          "|" +
          gtopension +
          "|" +
          ctopension +
          "|" +
          paspension +
          "|" +
          gtocesant +
          "|" +
          pascesant +
          "|" +
          gtointer +
          "|" +
          pasinter +
          "|" +
          gtoprima +
          "|" +
          pasprima +
          "|" +
          gtovacac +
          "|" +
          pasvacac +
          "|" +
          gtocaja +
          "|" +
          gtoicbf +
          "|" +
          gtosena +
          "|" +
          pasparaf +
          "|" +
          servidor +
          "|" +
          puerto +
          "|" +
          usuario +
          "|" +
          clave +
          "|" +
          uvt +
          "|" +
          eliminar +
          "|" +
          exopara +
          "|" +
          idpila +
          "|" +
          paspila +
          "|" +
          omitecnfg +
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
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Parametros Año ";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfparamgthJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cargos",
            estado: true,
          });
        });
    },

    buscarNumero: function () {
      var clasifica = this.form.clasifica;
      if (clasifica) {
        var vlrclasifica = clasifica.value;
        post
          .postData({
            url: "Financiero/dlls/CfcargosN.dll",
            data: sessionStorage.Sesion + "|" + vlrclasifica + "|",
            method: "",
          })
          .then((data) => {
            this.form.codigo = data[0].nro;
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar registro",
              estado: true,
            });
          });
      }
    },

    get_ruts4() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 4 + "|",
          method: "",
        })
        .then((data) => {
          let filtro = data.filter(
            (el) => el.identificacion_rut && el.identificacion_rut.trim()
          );
          this.ruts4 = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Administradoras",
            estado: true,
          });
        });
    },

    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    get_pucg4: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "5" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPucg4 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },

    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },

    get_puc1: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "5" + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc1 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },

    get_pucp4: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPucp4 = data;
          this.get_pucp5();
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },

    get_pucp5: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "5" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPucg5 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
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
