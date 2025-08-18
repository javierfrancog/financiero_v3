<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-human-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Vinculacion Asociados</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
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
              :items="clientes"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Correo</th>
                        <th>Direcion</th>
                        <th>Ciudad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.ciudad }}</td>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  22
                </td>
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn fab icon class="mr-2">
                  <v-icon small @click="editar_item(item)">edit</v-icon>
                </v-btn>
                <v-btn fab icon>
                  <v-icon small class="mr-2" @click="imprimir(item)"
                    >mdi-printer</v-icon
                  >
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1150px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información Básica</v-tab>
            <v-tab>Información Adicional</v-tab>
            <v-tab>Información Financiera</v-tab>
            <v-tab>Referencias</v-tab>
            <v-tab>Cargue Documentos</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Cedula', value: 13 },
                        { text: 'Nit', value: 31 },
                      ]"
                      label="Tipo identificacion"
                      outlined
                      clearable
                      v-model="form.tipoid"
                      required
                      :error="errores.tipoid"
                      @change="
                        errores.tipoid = false;
                        form.rsocial = null;
                        form.apellido1 = null;
                        form.apellido2 = null;
                        form.nombres = null;
                      "
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Numero Identificación"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="form.numero"
                      :error="errores.numero"
                      @input="errores.numero = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col
                    class="d-flex justify-center align-center"
                    cols="12"
                    sm="3"
                  >
                    <v-text-field
                      label="Díg. Verificador"
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.dv"
                      :error="errores.dv"
                      @input="errores.dv = false"
                      hide-details
                    ></v-text-field>
                    <v-btn
                      color="light-blue accent-4 white--text"
                      @click="calculardv()"
                      depressed
                      class="ml-3"
                    >
                      <v-icon size="25" left class="mr-0">mdi-autorenew</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Expedida en:"
                      clearable
                      outlined
                      required
                      v-model="form.expedicion"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Primer Apellido"
                      clearable
                      outlined
                      required
                      v-model="form.apellido1"
                      :error="errores.apellido1"
                      @input="
                        errores.apellido1 = false;
                        form.apellido1 = form.apellido1.toUpperCase();
                      "
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Segundo Apellido"
                      clearable
                      outlined
                      v-model="form.apellido2"
                      @input="
                        errores.apellido2 = false;
                        form.apellido2 = form.apellido2.toUpperCase();
                      "
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Nombres"
                      clearable
                      outlined
                      required
                      v-model="form.nombres"
                      :error="errores.nombres"
                      @input="
                        errores.nombres = false;
                        form.nombres = form.nombres.toUpperCase();
                      "
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      v-model="pickerFechavinc"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechavinc"
                          label="Fecha de Vinculación"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.fechavinc"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechavinc"
                        @input="pickerFechavinc = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      v-model="pickerFecharet"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecharet"
                          label="Fecha de Retiro"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.fecharet"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecharet"
                        @input="pickerFecharet = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="estcivil"
                      label="Estado Civil"
                      outlined
                      clearable
                      return-object
                      v-model="form.ecivil"
                      required
                      :error="errores.ecivil"
                      @change="errores.ecivil = false"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="genero"
                      label="Sexo"
                      outlined
                      clearable
                      return-object
                      v-model="form.sexo"
                      required
                      :error="errores.sexo"
                      @change="errores.sexo = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="Cabeza de Familia ?"
                      outlined
                      clearable
                      return-object
                      v-model="form.cabezaf"
                      required
                      :error="errores.cabezaf"
                      @change="errores.cabezaf = false"
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Personas a Cargo:"
                      clearable
                      outlined
                      required
                      v-model="form.pcargo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Ocupación"
                      clearable
                      outlined
                      v-model="form.ocupacion"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
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
                          v-model="form.fechanac"
                          label="Fecha Nacimiento"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.fechanac"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechanac"
                        @input="pickerFecha = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Dpto Nacimiento"
                      v-model="form.dptonac"
                      :items="departamentos"
                      item-value="value"
                      outlined
                      :error="errores.dptonac"
                      @change="
                        errores.dptonac = false;
                        get_municipionac();
                      "
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="form.ciudadnac"
                      :items="filterMunicipionac"
                      item-value="value"
                      outlined
                      :error="errores.ciudadnac"
                      @change="errores.ciudadnac = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Direccion Domicilio"
                      clearable
                      outlined
                      required
                      v-model="form.direccion"
                      :error="errores.direccion"
                      @input="errores.direccion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Barrio:"
                      clearable
                      outlined
                      required
                      v-model="form.barrio"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-autocomplete
                      label="Dpto Dom"
                      v-model="form.departamento"
                      :items="departamentos"
                      item-value="value"
                      outlined
                      :error="errores.departamento"
                      @change="
                        errores.departamento = false;
                        get_municipios();
                      "
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="form.ciudad"
                      :items="filterMunicipios"
                      item-value="value"
                      outlined
                      :error="errores.ciudad"
                      @change="errores.ciudad = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Teléfono"
                      clearable
                      outlined
                      type="number"
                      v-model="form.telefono"
                      :error="errores.telefono"
                      @input="errores.telefono = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Correo"
                      clearable
                      outlined
                      v-model="form.correo"
                      type="email"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="[
                        { text: 'Primaria', value: 1 },
                        { text: 'Bachillerato', value: 2 },
                        { text: 'Técnico', value: 3 },
                        { text: 'Técnologo', value: 4 },
                        { text: 'Profesional', value: 5 },
                        { text: 'Especialización', value: 6 },
                      ]"
                      label="Escolaridad"
                      outlined
                      clearable
                      v-model="form.escolar"
                      required
                      :error="errores.escolar"
                      @change="errores.escolar = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Empresa donde Labora"
                      clearable
                      outlined
                      v-model="form.emprlab"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cargo"
                      clearable
                      outlined
                      v-model="form.cargo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-menu
                      v-model="pickerFechaing"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechaing"
                          label="F.Ingreso"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.fechaing"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechaing"
                        @input="pickerFechaing = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Act.Economica:"
                      clearable
                      outlined
                      v-model="form.actecon"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Dirección donde Labora:"
                      clearable
                      outlined
                      v-model="form.dirlab"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Dpto"
                      v-model="form.dptolab"
                      :items="departamentos"
                      item-value="value"
                      outlined
                      :error="errores.dptolab"
                      @change="
                        errores.dptolab = false;
                        get_municipiolab();
                      "
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="form.ciudadlab"
                      :items="filterMunicipiolab"
                      item-value="value"
                      outlined
                      :error="errores.ciudadlab"
                      @change="errores.ciudadlab = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Telefono:"
                      clearable
                      outlined
                      v-model="form.telelab"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Aporte Mensual:"
                      clearable
                      outlined
                      v-model="form.aporte"
                      v-money="money"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Banco:"
                      clearable
                      outlined
                      v-model="form.banco"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="[
                        { text: 'Ahorros', value: 1 },
                        { text: 'Corriente', value: 2 },
                      ]"
                      label="Tipo Cuenta:"
                      outlined
                      clearable
                      v-model="form.tipocta"
                      required
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro Cuenta:"
                      clearable
                      outlined
                      v-model="form.nrocta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Ing.Mensuales Act.Principal"
                      clearable
                      outlined
                      required
                      v-money="money"
                      v-model="form.ingprinc"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Otros Ingresos Mensuales"
                      clearable
                      outlined
                      required
                      v-money="money"
                      v-model="form.otrosing"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Descripcion Otros Ingresos"
                      clearable
                      outlined
                      required
                      v-model="form.descr_otrosing"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Total Ingresos"
                      clearable
                      outlined
                      required
                      v-money="money"
                      v-model="form.t_ingresos"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Total Egresos"
                      clearable
                      outlined
                      required
                      v-money="money"
                      v-model="form.t_egresos"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Total Activos"
                      clearable
                      outlined
                      required
                      v-money="money"
                      v-model="form.t_activos"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Total Pasivos"
                      clearable
                      outlined
                      required
                      v-money="money"
                      v-model="form.t_pasivos"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />

                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1"
                    >Operaciones en Moneda Extranjera</span
                  >
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="Realiza Op. en moneda Extranjera?"
                      outlined
                      clearable
                      v-model="form.op_ext"
                      required
                      :error="errores.opext"
                      @change="errores.opext = false"
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="8">
                    <v-text-field
                      label="Descripcion Op. Extranjeras"
                      clearable
                      outlined
                      required
                      v-model="form.descr_opext"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="Posee cuentas en moneda Extranjera?"
                      outlined
                      clearable
                      v-model="form.cta_ext"
                      required
                      :error="errores.ctaext"
                      @change="errores.ctaext = false"
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Banco"
                      clearable
                      outlined
                      required
                      v-model="form.banco_ctaext"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Moneda"
                      clearable
                      outlined
                      required
                      v-model="form.moneda_ctaext"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Nro Cuenta Ext:"
                      clearable
                      outlined
                      v-model="form.nroctaext"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Ciudad"
                      clearable
                      outlined
                      required
                      v-model="form.ciudad_ctaext"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Pais"
                      clearable
                      outlined
                      required
                      v-model="form.pais_ctaext"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="Administra Recursos Públicos ?"
                      outlined
                      clearable
                      return-object
                      v-model="form.recpub"
                      required
                      :error="errores.recpub"
                      @change="errores.recpub = false"
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="Persona Expuesta Politicamente ?"
                      outlined
                      clearable
                      return-object
                      v-model="form.perexp"
                      required
                      :error="errores.perexp"
                      @change="errores.perexp = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item> </v-tab-item> -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Referencias Personales</span>
                </v-row>
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="1.Nombres y Apellidos:"
                      clearable
                      outlined
                      required
                      v-model="form.nombrer1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="1.Telefono:"
                      clearable
                      outlined
                      required
                      v-model="form.telefonor1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="1.Identificación"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="form.idr1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Masculino', value: 1 },
                        { text: 'Femenino', value: 2 },
                      ]"
                      label="1.Sexo"
                      outlined
                      clearable
                      v-model="form.sexor1"
                      required
                      :error="errores.sexor1"
                      @change="errores.sexor1 = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="1.Antiguedad:"
                      clearable
                      outlined
                      required
                      v-model="form.antiguedad1"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="1.Parentezco:"
                      clearable
                      outlined
                      required
                      v-model="form.parentezr1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="1.Dependiente"
                      outlined
                      clearable
                      v-model="form.depr1"
                      required
                      :error="errores.depr1"
                      @change="errores.depr1 = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="2.Nombres y Apellidos:"
                      clearable
                      outlined
                      required
                      v-model="form.nombrer2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="2.Telefono:"
                      clearable
                      outlined
                      required
                      v-model="form.telefonor2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="2.Identificación"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="form.idr2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Masculino', value: 1 },
                        { text: 'Femenino', value: 2 },
                      ]"
                      label="2.Sexo"
                      outlined
                      clearable
                      v-model="form.sexor2"
                      required
                      :error="errores.sexor2"
                      @change="errores.sexor2 = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="2.Antiguedad:"
                      clearable
                      outlined
                      required
                      v-model="form.antiguedad2"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="2.Parentezco:"
                      clearable
                      outlined
                      required
                      v-model="form.parentezr2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      label="2.Dependiente"
                      outlined
                      clearable
                      v-model="form.depr2"
                      required
                      :error="errores.depr2"
                      @change="errores.depr2 = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex justify-center">
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Cargar Documentos"
                      accept=".pdf"
                      outlined
                      hide-details
                      v-model="form.pdf"
                    ></v-file-input>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Cargar Foto Asociado"
                      accept=".png"
                      outlined
                      hide-details
                      multiple
                      v-model="img_actual"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-divider v-if="form.pdf" color="succes"></v-divider>
                <v-row v-if="form.pdf">
                  <v-col class="d-flex justify-center">
                    <v-card
                      color="grey lighten-2"
                      height="200"
                      width="200"
                      elevation="0"
                      class="d-flex align-center justify-center"
                      link
                      @click="mostrar_pdf"
                    >
                      <v-icon size="60" color="red darken-2">
                        mdi-pdf-box
                      </v-icon>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row>
                  <v-col
                    v-for="(img, idx) in imagenes_src"
                    :key="idx"
                    class="d-block justify-center relative"
                    cols="4"
                  >
                    <v-img
                      :src="img.url"
                      class="grey lighten-2"
                      contain
                      height="200"
                    />
                    <v-card
                      :style="{ position: 'relative', bottom: '25px' }"
                      color="transparent"
                      flat
                    >
                      <v-row
                        align="end"
                        class="lightbox white--text fill-height pa-0 px-1"
                        no-gutters
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-btn
                            x-small
                            color="red darken-2"
                            class="white--text"
                            depressed
                            @click="_eliminarImagen(img)"
                          >
                            Eliminar
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row>
                  <v-col
                    class="d-block justify-center relative"
                    cols="4"
                    v-for="(img, idx) in imagenes_subidas"
                    :key="idx"
                  >
                    <div v-if="img.tipo != 'PDF'">
                      <v-img
                        :src="img.url"
                        class="grey lighten-2"
                        contain
                        height="200"
                      />
                      <v-card
                        :style="{ position: 'relative', bottom: '25px' }"
                        color="transparent"
                        flat
                      >
                        <v-row
                          align="end"
                          class="lightbox white--text fill-height pa-0 px-1"
                          no-gutters
                        >
                          <v-col cols="12" class="d-flex justify-center">
                            <v-btn
                              x-small
                              color="red darken-2"
                              class="white--text"
                              depressed
                              @click="_eliminarImagen(img)"
                            >
                              Eliminar
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                    <div v-else>
                      <v-card
                        color="grey lighten-2"
                        height="200"
                        width="200"
                        elevation="0"
                        class="d-flex align-center justify-center"
                        link
                        @click="mostrar_pdf_subido(img.url)"
                      >
                        <v-icon size="60" color="red darken-2">
                          mdi-pdf-box
                        </v-icon>
                      </v-card>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row justify="center">
            <v-col>
              <v-switch
                v-model="form.estado"
                label="Bloquear"
                hide-details
              ></v-switch>
            </v-col>
            <v-col>
              <v-switch
                v-model="form.eliminar"
                label="Eliminar"
                hide-details
              ></v-switch>
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
            class="ma-2 px-4"
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
import { vincAsociados } from "../../_formatos.pdf.js";


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
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickerFecha: false,
      pickerFechavinc: false,
      pickerFecharet: false,
      pickerFechar1: false,
      pickerFechar2: false,
      pickerFechaing: false,
      singleExpand: true,
      expanded: [],
      clientes: [],
      vehiculos: [],
      listas: [],
      asesor: [],
      tipoid: null,
      eps: [],
      search: "",
      vendedores: [],
      ciudades_dian: [],
      departamentos: [],
      img_actual: null,
      imagenes: [],
      imagenes_src: [],
      imagenes_subidas: [],
      estcivil: [
        { text: "Soltero", value: 1 },
        { text: "Casado", value: 2 },
        { text: "Union Libre", value: 3 },
        { text: "Separado", value: 4 },
        { text: "Divorciado", value: 5 },
        { text: "Viudo", value: 6 },
      ],
      genero: [
        { text: "Masculino", value: 1 },
        { text: "Femenino", value: 2 },
      ],

      form: {},
      tab: 0,
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Tipo Id", align: "center", value: "tipoid_rut" },
        {
          text: "Identificacion",
          align: "center",
          sortable: false,
          value: "identificacion_rut",
        },
        { text: "Descripcion", align: "left", value: "descripcion_rut" },
        { text: "Telefono", align: "center", value: "telefono_rut" },
        { text: "Estado", align: "rigth", value: "estado_rut" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        telecontacto: false,
        relacion: false,
        plazo: false,
        asesor: false,
        listas: false,
        ecivil: false,
        sexo: false,
        estado: false,
      },
      card_estado: false,
      filterMunicipios: [],
      filterMunicipionac: [],
      filterMunicipiolab: [],

      mostrar_cliente: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarRuts();
    this.cargarCiudades();

    this.$watch(
      "form.departamento",
      (e) => {
        this.get_municipios();
      },
      { deep: true }
    );
  },
  watch: {
    img_actual: function (val) {
      this.add_img();
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

    imprimir(data) {
      let data_impresion = data;
      let empresa = this.datosEmpresa;

      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: empresa.ideditado_empr,
        direccionEmpresa: empresa.direccion_empr,
        ciudadEmpresa: empresa.Ciudad,
        dptoEmpresa: empresa.Departamento,
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data_impresion.logo = logo;
        vincAsociados(data_impresion).then(() => {
          console.log("Impresion terminada");
        });
      });
    },

    mostrar_pdf() {
      var val = this.form.pdf;
      const fr = new FileReader();
      fr.readAsDataURL(val);
      fr.addEventListener("load", () => {
        let replace = fr.result.replace("data:application/pdf;base64,", "");
        var fileName = "PDF";
        let pdfWindow = window.open("");
        pdfWindow.document.write(
          "<html<head><title>" +
            fileName +
            "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>"
        );
        pdfWindow.document.write(
          "<body><embed width='100%' height='100%' src='data:application/pdf;base64, " +
            encodeURI(replace) +
            "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
        );
      });
    },
    _eliminarImagen(img) {
      let index = this.imagenes_src.findIndex((el) => el.name == img.name);
      this.imagenes.splice(index, 1);
      this.imagenes_src.splice(index, 1);
    },
    validar_imagenes() {
      var val = this.imagenes;
      this.imagenes_src = [];
      val.forEach((item, index) => {
        const fr = new FileReader();
        fr.readAsDataURL(item);
        fr.addEventListener("load", () => {
          this.imagenes_src.push({ url: fr.result, index, name: item.name });
        });
      });
    },
    add_img() {
      this.imagenes = [...this.img_actual, ...this.imagenes];
      this.validar_imagenes();
    },
    async get_imagenes(images) {
      var data = [];
      for (const img of images) {
        let folder = img.tipo == "PDF" ? "pdfs/" : "imagenes/";
        var archivo_obj = new FormData();
        archivo_obj.append("ruta", folder + img.valor.trim());
        var res = await fetch("https://server100ts.net/get.file.php", {
          method: "POST",
          body: archivo_obj,
        }).then((res) => res.text());

        if (img.tipo != "PDF") {
          data.push({
            name: img.valor.trim(),
            tipo: img.tipo,
            url: "data:image/png;base64," + res,
          });
        } else {
          data.push({
            name: img.valor.trim(),
            tipo: img.tipo,
            url: res,
          });
        }
      }
      this.imagenes_subidas = data;
    },
    get_municipios() {
      let dpto = this.form.departamento
      if (dpto == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == dpto) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
    },

    get_municipionac() {
      if (this.form.dptonac == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.dptonac) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipionac = registro;
    },
    get_municipiolab() {
      if (this.form.dptolab == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.dptolab) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipiolab = registro;
    },

    mostrar_pdf_subido(base64) {
      var fileName = "PDF";
      let pdfWindow = window.open("");
      pdfWindow.document.write(
        "<html<head><title>" +
          fileName +
          "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>"
      );
      pdfWindow.document.write(
        "<body><embed width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(base64) +
          "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
      );
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.get_imagenes(item.TablaArchivos_rep).then(() => {});

      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Asociado";
      this.dialogo.tipo = 1;

      this.form.tipoid = parseInt(item.tipoid_rut);
      this.form.numero = item.identificacion_rut;
      this.form.dv = item.dv_rut.trim() || "";
      this.form.expedicion = item.ciudadexp_rut.trim();
      this.form.apellido1 = item.primerApellido_rut;
      this.form.apellido2 = item.segundoApellido_rut;
      this.form.nombres = item.nombres_rut;

      var busqueda_estcivil = this.estcivil.find(
        (el) => el.value == item.estcivil_rut
      );
      this.form.ecivil = busqueda_estcivil;

      var busqueda_genero = this.genero.find(
        (el) => el.value == item.genero_rut
      );
      this.form.sexo = busqueda_genero;
      this.form.pcargo = item.perscargo_rut.trim();
      this.form.ocupacion = item.ocupacion_rut.trim();
      this.form.fechanac = item.fechanac_rut.trim();
      this.form.dptonac = item.ciudadnac_rut.substring(0, 2);
      this.get_municipionac();

      this.form.ciudadnac = item.ciudadnac_rut.trim() || null;
      this.form.direccion = item.direccion_rut.trim();
      this.form.barrio = item.barrio_rut.trim();
      this.form.departamento = item.ciudad_rut.substring(0, 2);
      this.form.ciudad = item.ciudad_rut.trim() || null;
      this.get_municipios(this.form.departamento);

      this.form.telefono = item.telefono_rut.trim();
      this.form.correo = item.correo_rut.trim() || null;
      this.form.escolar = parseInt(item.escolaridad_rut);
      this.form.emprlab = item.empresa_rut.trim();
      this.form.cargo = item.cargo_rut.trim();
      this.form.fechaing = item.fechaing_rut;
      this.form.actecon = item.actividad_rut.trim();
      this.form.dirlab = item.dirlabora_rut.trim();
      this.form.dirlab = item.dirlabora_rut.trim();
      this.form.dptolab = item.ciudadlab_rut.substring(0, 2);
      this.get_municipiolab();

      this.form.ciudadlab = item.ciudadlab_rut.trim() || null;
      this.form.telelab = item.telelabora_rut.trim();
      this.form.fechavinc = item.fechavin_rut;
      this.form.fecharet = item.fecharet_rut;
      this.form.antiguedad1 = item.antig1_rut.trim();
      this.form.antiguedad2 = item.antig2_rut.trim();

      this.form.banco = item.banco_rut.trim();
      this.form.tipocta = parseInt(item.tipocta_rut);
      this.form.nrocta = item.nrocta_rut.trim();
      this.form.ingprinc = parseInt(item.vlringreso_rut);
      this.form.otrosing = parseInt(item.otrosingreso_rut);
      this.form.aporte = parseInt(item.aporte_rut);
      this.form.descr_otrosing = item.descripotros_rut.trim();
      this.form.t_ingresos = parseInt(item.toting_rut);
      this.form.t_egresos = parseInt(item.totegr_rut);
      this.form.t_activos = parseInt(item.totact_rut);
      this.form.t_pasivos = parseInt(item.totpas_rut);
      this.form.op_ext = parseInt(item.opext_rut);
      this.form.recpub = parseInt(item.recpub_rut);
      this.form.perexp = parseInt(item.perexp_rut);
      this.form.cabezaf = parseInt(item.cabezaf_rut);
      this.form.descr_opext = item.descripopext_rut.trim();
      this.form.cta_ext = parseInt(item.ctaext_rut);
      this.form.banco_ctaext = item.bancoext_rut.trim();
      this.form.moneda_ctaext = item.monedaext_rut.trim();
      this.form.nroctaext = item.nroctaex_rut.trim();
      this.form.ciudad_ctaext = item.ciudadext_rut.trim();
      this.form.pais_ctaext = item.paisext_rut.trim();
      this.form.nombrer1 = item.nombreref1_rut.trim();
      this.form.telefonor1 = item.teleref1_rut.trim();
      this.form.idr1 = item.idref1_rut.trim();
      this.form.sexor1 = parseInt(item.sexoref1_rut);
      this.form.fechar1 = item.fecharef1_rut;
      this.form.parentezr1 = item.parentref1_rut;
      this.form.depr1 = parseInt(item.dependrf1_rut);

      this.form.nombrer2 = item.nombreref2_rut.trim();
      this.form.telefonor2 = item.teleref2_rut.trim();
      this.form.idr2 = item.idref2_rut.trim();
      this.form.sexor2 = parseInt(item.sexoref2_rut);
      this.form.fechar2 = item.fecharef2_rut;
      this.form.parentezr2 = item.parentref2_rut;
      this.form.depr2 = parseInt(item.dependrf2_rut);

      this.form.imagenes = item.TablaArchivos_rep;
    },
    subir_archivos(data) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = sessionStorage.Sesion.substr(0, 15);
        var placa = _this.form.numero;

        var adjuntos = [];
        var imagenes = this.imagenes;
        adjuntos = imagenes;
        var pdf = this.form.pdf;

        adjuntos.push(pdf);
        var archivos = new FormData();

        adjuntos.forEach((el, index) => {
          archivos.append(index, el);
        });

        archivos.append("nombre_archivo", empresa + placa);
        fetch("https://server100ts.net/up.file.php", {
          method: "POST",
          body: archivos,
        })
          .then((res) => res.json())
          .then((res) => {
            var formData = new FormData();
            formData.append("tipo", "adjuntosVeh");
            data.imagenes = data.imagenes || [];

            data.imagenes.forEach((el) => {
              res.correcto.push(el.valor.trim());
            });

            formData.append("data", JSON.stringify(res.correcto));

            fetch("https://server1ts.net//financiero/inc/planos.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((result) => {
                _this.imagenes = [];
                _this.imagenes_src = [];
                _this.form.pdf = null;
                // console.log("Adjuntos ->", result.mensaje, res);
                resolve(result.mensaje);
              })
              .catch((error) => reject(error));
          });
      });
    },
    guardar: function () {
      this.validar_envio();
    },
    validar_envio: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let imagenes = this.imagenes;
      let pdf = this.form.pdf;

      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Debe seleccionar un tipo de identificación");
      } else if (!data.numero) {
        this.errores.numero = true;
        this.send_error("Debe ingresar un número de identificación");
      } else if (!data.dv && data.dv != 0) {
        this.errores.dv = true;
        this.send_error("Debe ingresar el Digito de Verificación");
      } else if (data.tipoid == 31 && !data.rsocial) {
        this.errores.rsocial = true;
        this.send_error("Debe ingresar una razón social");
      } else if (data.tipoid == 13 && !data.apellido1) {
        this.errores.apellido1 = true;
        this.send_error("Debe ingresar el primer apellido");
      } else if (data.tipoid == 13 && !data.nombres) {
        this.errores.nombres = true;
        this.send_error("Debe ingresar los nombres");
      } else if (!data.direccion) {
        this.errores.direccion = true;
        this.send_error("Debe ingresar una dirección");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Debe seleccionar un departamento");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Debe seleccionar una ciudad");
      } else if (!data.telefono) {
        this.errores.telefono = true;
        this.send_error("Debe ingresar un teléfono");
      } else {
        // this.card_estado = true;
        this.format_envio(data);

        // this.subir_archivos(data).then((nom_plano) => {
        //   this.format_envio(data);
        // });
      }
    },
    format_envio(data) {
      // this.card_estado = true;
      var tipoId = data.tipoid;
      var identificacion = data.numero || "";
      var digitoVerificacion = data.dv || "";
      var ciudadexp = data.expedicion || "";
      var apellido1 = data.apellido1 || "";
      var apellido2 = data.apellido2 || "";
      var nombres = data.nombres || "";
      var ecivil = data.ecivil.value || "0";
      var sexo = data.sexo.value || "0";
      var pcargo = data.pcargo || "0";
      var ocupacion = data.ocupacion;
      var fechanac = data.fechanac ? data.fechanac.replace(/\-/g, "") : "";
      var ciudadnac = data.ciudadnac || "";
      var direccion = data.direccion || "";
      var barrio = data.barrio || "";
      var ciudad = data.ciudad || "";
      var telefono = data.telefono;
      var correo = data.correo || "";
      var escolar = data.escolar || "";
      var emprlab = data.emprlab || "";
      var cargo = data.cargo || "";
      var fechaing = data.fechaing ? data.fechaing.replace(/\-/g, "") : "";
      var actecon = data.actecon;
      var dirlab = data.dirlab;
      var ciudadlab = data.ciudadlab || "";
      var telelab = data.telelab;
      var arl = data.arl || "";
      var eps = data.eps || "";
      var pension = data.pension || "";
      var cesantias = data.cesantias || "";
      var banco = data.banco || "";
      var tipocta = data.tipocta || "";
      var nrocta = data.nrocta || "";
      var descr_otrosing = data.descr_otrosing;
      var ingprinc = data.ingprinc ? data.ingprinc.replace(/\,/g, "") : "0";
      var otrosing = data.otrosing ? data.otrosing.replace(/\,/g, "") : "0";
      var t_ingresos = data.t_ingresos.replace(/\,/g, "") || "0";
      var t_egresos = data.t_egresos.replace(/\,/g, "") || "0";
      var t_activos = data.t_activos.replace(/\,/g, "") || "0";
      var t_pasivos = data.t_pasivos.replace(/\,/g, "") || "0";
      var aporte = data.aporte ? data.aporte.replace(/\,/g, "") : "0";
      var op_ext = data.op_ext || "0";
      var descr_opext = data.descr_opext;
      var cta_ext = data.cta_ext || "0";
      var nrocta_ext = data.nroctaext || "0";
      var banco_ctaext = data.banco_ctaext;
      var moneda_ctaext = data.moneda_ctaext;
      var ciudad_ctaext = data.ciudad_ctaext;
      var pais_ctaext = data.pais_ctaext;
      var nombrer1 = data.nombrer1 || "";
      var telefonor1 = data.telefonor1;
      var idr1 = data.idr1;
      var sexor1 = data.sexor1 || "0";
      var fechar1 = data.fechar1 ? data.fechar1.replace(/\-/g, "") : "";
      var parentezr1 = data.parentezr1 || "";
      var depr1 = data.depr1 || "0";
      var nombrer2 = data.nombrer2 || "";
      var telefonor2 = data.telefonor1;
      var idr2 = data.idr1;
      var sexor2 = data.sexor1 || "0";
      var fechar2 = data.fechar2 ? data.fechar2.replace(/\-/g, "") : "";
      var parentezr2 = data.parentezr2 || "";
      var depr2 = data.depr1 || "0";
      var cabezaf = data.cabezaf ? data.cabezaf.value : "0";
      var recpub = data.recpub ? data.recpub.value : "0";
      var perexp = data.perexp ? data.perexp.value : "0";
      var fechavinc = data.fechavinc ? data.fechavinc.replace(/\-/g, "") : "";
      var fecharet = data.fecharet ? data.fecharet.replace(/\-/g, "") : "";
      var antig1 = data.antiguedad1 || "";
      var antig2 = data.antiguedad2 || "";

      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "asociados/dlls/Cfruts.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipoId +
          "|" +
          identificacion.trim() +
          "|" +
          digitoVerificacion +
          "|" +
          ciudadexp.trim() +
          "|" +
          apellido1.trim() +
          "|" +
          apellido2 +
          "|" +
          nombres.trim() +
          "|" +
          ecivil +
          "|" +
          sexo +
          "|" +
          pcargo +
          "|" +
          ocupacion +
          "|" +
          fechanac +
          "|" +
          ciudadnac +
          "|" +
          direccion.trim() +
          "|" +
          barrio.trim() +
          "|" +
          ciudad +
          "|" +
          telefono +
          "|" +
          correo +
          "|" +
          escolar +
          "|" +
          emprlab.trim() +
          "|" +
          cargo.trim() +
          "|" +
          fechaing +
          "|" +
          actecon +
          "|" +
          dirlab +
          "|" +
          ciudadlab +
          "|" +
          telelab +
          "|" +
          banco +
          "|" +
          tipocta +
          "|" +
          nrocta +
          "|" +
          ingprinc +
          "|" +
          otrosing +
          "|" +
          descr_otrosing +
          "|" +
          t_ingresos +
          "|" +
          t_egresos +
          "|" +
          t_activos +
          "|" +
          t_pasivos +
          "|" +
          op_ext +
          "|" +
          descr_opext +
          "|" +
          cta_ext +
          "|" +
          banco_ctaext +
          "|" +
          nrocta_ext +
          "|" +
          moneda_ctaext +
          "|" +
          ciudad_ctaext +
          "|" +
          pais_ctaext +
          "|" +
          nombrer1 +
          "|" +
          telefonor1 +
          "|" +
          idr1 +
          "|" +
          sexor1 +
          "|" +
          antig1 +
          "|" +
          parentezr1 +
          "|" +
          depr1 +
          "|" +
          nombrer2 +
          "|" +
          telefonor2 +
          "|" +
          idr2 +
          "|" +
          sexor2 +
          "|" +
          antig2 +
          "|" +
          parentezr2 +
          "|" +
          depr2 +
          "|" +
          fechavinc +
          "|" +
          fecharet +
          "|" +
          aporte +
          "|" +
          cabezaf +
          "|" +
          recpub +
          "|" +
          perexp +
          "|" +
          estado +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Rut guardado correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarRuts();
        })
        .catch((error) => {
          this.card_estado = false;
          console.log("Error grabando rut: ", error);
          this.send_error("Error al grabar rut");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Asociados";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        tipoid: null,
        numero: null,
        dv: null,
        rsocial: null,
        apellido1: null,
        apellido2: null,
        nombres: null,
        direccion: null,
        departamento: null,
        ciudad: null,
        telefono: null,
        correo: null,
        contacto: null,
        telecontacto: null,
        relacion: null,
        plazo: null,
        asesor: null,
        listas: null,
        estado: null,
        activacion: this.$moment().format("YYYY-MM-DD"),
        eliminar: false,
      };

      this.errores = {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        telecontacto: false,
        relacion: false,
        plazo: false,
        asesor: false,
        listas: false,
        estado: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k, v) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    cargarRuts() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|" + "10" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.clientes = JSON.parse(JSON.stringify(data));
          this.clientes.pop();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
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
    calculardv() {
      var arreglo, x, y, documentoElementos, i, documento, dv1;
      documento = this.form.numero;
      if (!documento) {
        alert("Debe escribir el número de Identificación sin puntos.");
      } else {
        arreglo = [];
        x = 0;
        y = 0;
        documentoElementos = documento.length;
        arreglo[1] = 3;
        arreglo[2] = 7;
        arreglo[3] = 13;
        arreglo[4] = 17;
        arreglo[5] = 19;
        arreglo[6] = 23;
        arreglo[7] = 29;
        arreglo[8] = 37;
        arreglo[9] = 41;
        arreglo[10] = 43;
        arreglo[11] = 47;
        arreglo[12] = 53;
        arreglo[13] = 59;
        arreglo[14] = 67;
        arreglo[15] = 71;
        for (i = 0; i < documentoElementos; i++) {
          y = documento.substr(i, 1);
          x += y * arreglo[documentoElementos - i];
        }
        y = x % 11;
        if (y > 1) {
          dv1 = 11 - y;
        } else {
          dv1 = y;
        }
        var copia = JSON.parse(JSON.stringify(this.form));
        copia.dv = parseInt(dv1);
        this.form = null;
        this.form = JSON.parse(JSON.stringify(copia));
      }
    },
  },
};
</script>
