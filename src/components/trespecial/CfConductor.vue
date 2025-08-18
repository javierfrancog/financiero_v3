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
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-tie-hat-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Conductores</v-list-item-title
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
                </td>
              </template>

              <template v-slot:item.relacion_rut="{ item }">
                {{ format_relacion(item.relacion_rut.trim()).text }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn fab icon small class="mr-2">
                  <v-icon @click="editar_item(item)">edit</v-icon>
                </v-btn>
                <v-btn fab icon small>
                  <v-icon class="mr-2" @click="imprimir(item)"
                    >mdi-printer</v-icon
                  >
                </v-btn>
                <v-btn fab icon small>
                  <v-icon
                    color="indigo"
                    class="mr-2"
                    @click="imprimir_blanco(item)"
                    >mdi-paper-roll</v-icon
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
            <v-tab>Referencias</v-tab>
            <v-tab>Vehículo</v-tab>
            <v-tab>Cargue Documentos</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex mt-1">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[{ text: 'Cedula', value: 13 }]"
                      label="Tipo identificacion"
                      outlined
                      clearable
                      v-model="form.tipoid"
                      required
                      :error="errores.tipoid"
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
                      label="Dígito Verificador"
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
                      class
                      @click="calculardv()"
                      depressed
                    >
                      <v-icon size="25" left>mdi-autorenew</v-icon>
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
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Direccion"
                      clearable
                      outlined
                      required
                      v-model="form.direccion"
                      :error="errores.direccion"
                      @input="errores.direccion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-autocomplete
                      label="Departamento"
                      v-model="form.departamento"
                      :items="departamentos"
                      item-value="value"
                      outlined
                      clearable
                      :error="errores.departamento"
                      @change="
                        errores.departamento = false;
                        get_municipios();
                      "
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
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
                  <v-col class="d-flex" cols="12" sm="4">
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

                  <v-col class="d-flex" cols="12" sm="5">
                    <v-text-field
                      label="Correo"
                      clearable
                      outlined
                      v-model="form.correo"
                      type="email"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />

                <v-row class="d-flex mt-1">
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Número Licencia"
                      clearable
                      outlined
                      v-model="form.licencia"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Categoria"
                      clearable
                      outlined
                      v-model="form.categoria"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Ciudad Licencia"
                      clearable
                      outlined
                      v-model="form.ciudadlicencia"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" sm="3">
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
                          v-model="form.vencelic"
                          label="Fecha Vence Licencia"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.fecha"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencelic"
                        @input="pickerFecha = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Afiliado a:"
                      clearable
                      outlined
                      v-model="form.afiliado"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Experiencia:"
                      clearable
                      outlined
                      v-model="form.experiencia"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="ARL:"
                      clearable
                      outlined
                      v-model="form.arl"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="EPS:"
                      clearable
                      outlined
                      v-model="form.eps"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Tipo Sangre:"
                      clearable
                      outlined
                      v-model="form.sangre"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Banco:"
                      clearable
                      outlined
                      v-model="form.banco"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
                    <v-text-field
                      label="Tipo Cuenta:"
                      clearable
                      outlined
                      v-model="form.tipocta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="16" sm="3">
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
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Contacto Familiar</span>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Nombre Familiar:"
                      clearable
                      outlined
                      required
                      v-model="form.nombresf"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Parentezco:"
                      clearable
                      outlined
                      required
                      v-model="form.parentezco"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Telefonos:"
                      clearable
                      outlined
                      required
                      v-model="form.telparentezco"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="11">
                    <v-text-field
                      label="Direccion Familiar:"
                      clearable
                      outlined
                      required
                      v-model="form.direccionf"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Referencias Empresariales</span>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="5">
                    <v-text-field
                      label="1.Empresa:"
                      clearable
                      outlined
                      required
                      v-model="form.empresa1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="1.Nombre Contacto:"
                      clearable
                      outlined
                      required
                      v-model="form.contacto1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="1.Cargo:"
                      clearable
                      outlined
                      required
                      v-model="form.cargo1"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="1.Telefono:"
                      clearable
                      outlined
                      required
                      v-model="form.telefono1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="5">
                    <v-text-field
                      label="2.Empresa:"
                      clearable
                      outlined
                      required
                      v-model="form.empresa2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="2.Nombre Contacto:"
                      clearable
                      outlined
                      required
                      v-model="form.contacto2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="2.Cargo:"
                      clearable
                      outlined
                      required
                      v-model="form.cargo2"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="2.Telefono:"
                      clearable
                      outlined
                      required
                      v-model="form.telefono2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Referencias Personales</span>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="1.Nombres Completos:"
                      clearable
                      outlined
                      required
                      v-model="form.nombre1p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="1.Dirección:"
                      clearable
                      outlined
                      required
                      v-model="form.direccion1p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="1.Ciudad:"
                      clearable
                      outlined
                      required
                      v-model="form.ciudad1p"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="1.Telefono:"
                      clearable
                      outlined
                      required
                      v-model="form.telefono1p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="2.Nombres Completos:"
                      clearable
                      outlined
                      required
                      v-model="form.nombre2p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="2.Dirección:"
                      clearable
                      outlined
                      required
                      v-model="form.direccion2p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="2.Ciudad:"
                      clearable
                      outlined
                      required
                      v-model="form.ciudad2p"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="2.Telefono:"
                      clearable
                      outlined
                      required
                      v-model="form.telefono2p"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item> </v-tab-item> -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="10" sm="4">
                    <v-autocomplete
                      label="Placa"
                      v-model="form.placa"
                      :items="vehiculos"
                      item-text="placa_rep"
                      item-value="placa_rep"
                      hide-details
                      outlined
                      return-object
                      @change="get_placa()"
                      :error="errores.placa"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Marca"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.marca"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Color"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.color"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Modelo"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.modelo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Tipo"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.tipo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Motor"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.motor"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Chasis"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.chasis"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Nro Trailer"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.trailer"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Marca Trailer"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.marcatr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Vence SOAT"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.soat"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Vence Tecnomecanica"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.tecno"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Satelital"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.satelital"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Propietario"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.propietario"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <!-- <v-card color="basil" flat>
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
                      label="Cargar Foto Conductor"
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
              </v-card> -->
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar"
              label="Eliminar"
              hide-details
            ></v-switch>
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
import { hoja_vida_conductor } from "../../_formatos_mol.js";

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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickerFecha: false,
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
        { text: "Relación", align: "rigth", value: "relacion_rut" },

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
        estado: false,
      },
      card_estado: false,
      filterMunicipios: [],
      mostrar_cliente: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarRuts();
    this.cargarCiudades();
    this.cargarVehiculos();
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
    imprimir_blanco(item) {
      let data_impresion = JSON.parse(JSON.stringify(item));
      let empresa = this.datosEmpresa;

      Object.getOwnPropertyNames(data_impresion).forEach(function (
        val,
        idx,
        array
      ) {
        data_impresion[val] = "";
      });

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
        hoja_vida_conductor(data_impresion).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    imprimir(item) {
      let data_impresion = item;
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
        hoja_vida_conductor(data_impresion).then(() => {
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
      console.log("Res", data);
      this.imagenes_subidas = data;
    },
    get_placa() {
      console.log(this.form.placa);
      this.form.marca = this.form.placa.marca_rep;
      this.form.color = this.form.placa.color_rep;
      this.form.modelo = this.form.placa.modelo_rep;
      this.form.tipo = this.form.placa.tipo_rep;
      this.form.motor = this.form.placa.motor_rep;
      this.form.chasis = this.form.placa.chasis_rep;
      this.form.trailer = this.form.placa.trailer_rep;
      this.form.marcatr = this.form.placa.marcatr_rep;
      this.form.soat = this.form.placa.vsoat_rep;
      this.form.tecno = this.form.placa.vtecno_rep;
      this.form.satelital = this.form.placa.satelite_rep;
      this.form.propietario = this.form.placa.propietario_rep;
    },
    cargarVehiculos() {
      post
        .postData({
          url: "Molinos/dlls/CfvehiculoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.vehiculos = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    cambio_relacion() {
      if (this.form.relacion && this.form.relacion == 1)
        this.mostrar_cliente = true;
      else this.mostrar_cliente = false;
    },
    format_relacion(relacion_rut) {
      var retornar = {};
      // O se puede usar un swich case

      switch (relacion_rut) {
        case "07":
          retornar.text = "Conductor";
          break;
        case "08":
          retornar.text = "Agricultor";
          break;
        case "09":
          retornar.text = "Prop.Vehiculo";
          break;
      }
      return retornar;
    },

    get_municipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
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
      this.dialogo.titulo = "Modificar Conductor";
      this.dialogo.tipo = 1;

      this.form.tipoid = parseInt(item.tipoid_rut);
      this.form.dv = item.dv_rut.trim() || "";
      this.form.numero = item.identificacion_rut;
      this.form.apellido1 = item.primerApellido_rut;
      this.form.apellido2 = item.segundoApellido_rut;
      this.form.nombres = item.nombres_rut;
      this.form.rsocial = item.descripcion_rut;
      this.form.direccion = item.direccion_rut.trim();
      this.form.departamento = item.ciudad_rut.substring(0, 2);
      this.form.ciudad = item.ciudad_rut.trim() || null;
      this.form.telefono = item.telefono_rut;
      this.form.correo = item.correo_rut.trim() || null;
      this.form.contacto = item.nombrecontac_rut.trim() || null;
      this.form.relacion = parseInt(item.relacion_rut);
      this.form.listas = item.listpr_rut;
      this.form.asesor =
        parseInt(item.asesor_rut) != 0 ? item.asesor_rut : null;
      this.form.telecontacto = item.telecontacto_rut;
      this.form.plazo = item.plazo_rut;
      this.form.estado = parseInt(item.estado_rut);
      this.form.activacion = this.$moment(item.fechaAct_rut).format(
        "YYYY-MM-DD"
      );
      this.form.expedicion = item.ciudadexp_rut.trim() || null;
      this.form.licencia = item.licencia_rut.trim() || null;
      this.form.categoria = item.categoria_rut.trim() || null;
      this.form.ciudadlicencia = item.ciudlicencia_rut.trim() || null;
      this.form.vencelic = item.fechavpase_rut.trim() || null;
      this.form.afiliado = item.afiliado_rut.trim() || null;
      this.form.experiencia = item.experiencia_rut.trim() || null;
      this.form.arl = item.arl_rut.trim() || null;
      this.form.eps = item.eps_rut.trim() || null;
      this.form.sangre = item.grpsang_rut.trim() || null;
      this.form.banco = item.banco_rut.trim() || null;
      this.form.tipocta = item.tipocta_rut.trim() || null;
      this.form.nrocta = item.nrocta_rut.trim() || null;
      this.form.nombresf = item.nombrefam_rut.trim() || null;
      this.form.parentezco = item.parentezco_rut.trim() || null;
      this.form.telparentezco = item.telefam_rut.trim() || null;
      this.form.direccionf = item.direccionfam_rut.trim() || null;
      this.form.empresa1 = item.empresa1_rut.trim() || null;
      this.form.contacto1 = item.contactoemp1_rut.trim() || null;
      this.form.cargo1 = item.cargoemp1_rut.trim() || null;
      this.form.telefono1 = item.teleemp1_rut.trim() || null;
      this.form.empresa2 = item.empresa2_rut.trim() || null;
      this.form.contacto2 = item.contactoemp2_rut.trim() || null;
      this.form.cargo2 = item.cargoemp2_rut.trim() || null;
      this.form.telefono2 = item.teleemp2_rut.trim() || null;
      this.form.nombre1p = item.nombrerf1_rut.trim() || null;
      this.form.direccion1p = item.direccionrf1_rut.trim() || null;
      this.form.ciudad1p = item.ciudadrf1_rut.trim() || null;
      this.form.telefono1p = item.telerf1_rut.trim() || null;
      this.form.nombre2p = item.nombrerf2_rut.trim() || null;
      this.form.direccion2p = item.direccionrf2_rut.trim() || null;
      this.form.ciudad2p = item.ciudadrf2_rut.trim() || null;
      this.form.telefono2p = item.telerf2_rut.trim() || null;

      this.form.imagenes = item.TablaArchivos_rep;

      let vehiculo = this.vehiculos.find(
        (el) => el.placa_rep == data.placa_rut
      );
      this.form.placa = vehiculo;
      this.get_placa();
      this.get_municipios();
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
            // console.log('Data', data.imagenes, res.correcto)

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
      } else if (!data.placa) {
        this.errores.placa = true;
        this.send_error("Debe seleccionar un vehiculo");
      } else if (
        (imagenes.length === 0 || !pdf) &&
        this.imagenes_subidas.length == 0
      ) {
        this.card_estado = true;
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var nom_plano = "";
      var identificacion = data.numero;
      var digitoVerificacion = data.dv || "";
      var tipoId = data.tipoid;
      var apellido1 = data.apellido1 || "";
      var apellido2 = data.apellido2 || "";
      var nombres = data.nombres || "";
      var direccion = data.direccion;
      var ciudad = data.ciudad;
      var telefono = data.telefono;
      var correo = data.correo || "";
      var ciudadexp = data.expedicion || "";
      var licencia = data.licencia || "";
      var categoria = data.categoria || "";
      var ciudadlic = data.ciudadlicencia || "";
      var vencelic = data.vencelic ? data.vencelic.replace(/\-/g, "") : "";
      var afiliado = data.afiliado || "";
      var experiencia = data.experiencia || "";
      var arl = data.arl || "";
      var eps = data.eps || "";
      var tiporh = data.sangre || "";
      var banco = data.banco || "";
      var tipocta = data.tipocta || "";
      var nrocta = data.nrocta || "";
      var nombrefam = data.nombresf || "";
      var parentezco = data.parentezco || "";
      var telefam = data.telparentezco || "";
      var direccfam = data.direccionf || "";
      var empresa1 = data.empresa1 || "";
      var contacto1 = data.contacto1 || "";
      var cargo1 = data.cargo1 || "";
      var telefono1 = data.telefono1 || "";
      var empresa2 = data.empresa2 || "";
      var contacto2 = data.contacto2 || "";
      var cargo2 = data.cargo2 || "";
      var telefono2 = data.telefono2 || "";
      var nombrerf1 = data.nombre1p || "";
      var direcrf1 = data.direccion1p || "";
      var ciudadrf1 = data.ciudad1p || "";
      var telefrf1 = data.telefono1p || "";
      var nombrerf2 = data.nombre2p || "";
      var direcrf2 = data.direccion2p || "";
      var ciudadrf2 = data.ciudad2p || "";
      var telefrf2 = data.telefono2p || "";
      var placa = data.placa ? data.placa.placa_rep : "";
      var estado = data.estado;
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Transporte/dlls/CfConduct.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          identificacion +
          "|" +
          digitoVerificacion +
          "|" +
          tipoId +
          "|" +
          apellido1.trim() +
          "|" +
          apellido2.trim() +
          "|" +
          nombres.trim() +
          "|" +
          direccion.trim() +
          "|" +
          ciudad +
          "|" +
          telefono +
          "|" +
          correo.trim() +
          "|" +
          ciudadexp.trim() +
          "|" +
          licencia.trim() +
          "|" +
          categoria.trim() +
          "|" +
          ciudadlic.trim() +
          "|" +
          vencelic.trim() +
          "|" +
          afiliado.trim() +
          "|" +
          experiencia.trim() +
          "|" +
          arl.trim() +
          "|" +
          eps.trim() +
          "|" +
          tiporh.trim() +
          "|" +
          banco.trim() +
          "|" +
          tipocta.trim() +
          "|" +
          nrocta.trim() +
          "|" +
          nombrefam.trim() +
          "|" +
          parentezco.trim() +
          "|" +
          telefam.trim() +
          "|" +
          direccfam.trim() +
          "|" +
          empresa1.trim() +
          "|" +
          contacto1.trim() +
          "|" +
          cargo1.trim() +
          "|" +
          telefono1.trim() +
          "|" +
          empresa2.trim() +
          "|" +
          contacto2.trim() +
          "|" +
          cargo2.trim() +
          "|" +
          telefono2.trim() +
          "|" +
          nombrerf1.trim() +
          "|" +
          direcrf1.trim() +
          "|" +
          ciudadrf1.trim() +
          "|" +
          telefrf1.trim() +
          "|" +
          nombrerf2.trim() +
          "|" +
          direcrf2.trim() +
          "|" +
          ciudadrf2.trim() +
          "|" +
          telefrf2.trim() +
          "|" +
          placa +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          nom_plano +
          "|",
        method: "",
      };
      console.log(datos.data);
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
      this.dialogo.titulo = "Agregar nuevo RUT";
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
          url: "Trespecial/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|" + "7" + "|",
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
