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
              <v-icon size="30" color="blue darken-4 ">mdi-bus-school</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Vehículos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex" cols="6">
                <v-btn
                  color="success"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="print_reporte_excel"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-btn
                  color="indigo"
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
              </v-col>
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
              item-key="placa"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estadoestud_rep="{ item }">{{
                item.estadoestud_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Caracteristicas</v-tab>
            <v-tab>Información General</v-tab>
            <v-tab>Información Empresa</v-tab>
            <!-- <v-tab>Imagenes y Documentos</v-tab> -->
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex mt-1">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Placa"
                      clearable
                      outlined
                      required
                      v-model="form.placa"
                      :error="errores.placa"
                      @input="errores.placa = false"
                      autocomplete="off"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cedula Propietario"
                      clearable
                      outlined
                      required
                      v-model="form.ccpropietario"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="8">
                    <v-text-field
                      label="Convenio"
                      clearable
                      outlined
                      required
                      v-model="form.convenio"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col class="d-flex" cols="12" sm="5">
                    <v-autocomplete
                      label="Propietario"
                      v-model="form.propietario"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="errores.propietario = false"
                      :error="errores.propietario"
                    ></v-autocomplete>
                  </v-col> -->
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="5">
                    <v-select
                      :items="tipovehiculo"
                      label="Tipo Vehículo"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.tipovehic"
                      required
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Marca"
                      clearable
                      outlined
                      required
                      v-model="form.marca"
                      :error="errores.marca"
                      @input="errores.marca = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Modelo"
                      clearable
                      outlined
                      required
                      v-model="form.modelo"
                      :error="errores.modelo"
                      @input="errores.modelo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Color"
                      clearable
                      outlined
                      required
                      v-model="form.color"
                      :error="errores.color"
                      @input="errores.color = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro. Interno"
                      clearable
                      outlined
                      required
                      v-model="form.nrointerno"
                      :error="errores.nrointerno"
                      @input="errores.nrointerno = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro. Motor"
                      clearable
                      outlined
                      required
                      v-model="form.motor"
                      :error="errores.motor"
                      @input="errores.motor = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro. Chasis"
                      clearable
                      outlined
                      required
                      v-model="form.chasis"
                      :error="errores.chasis"
                      @input="errores.chasis = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="tipocombustible"
                      label="Tipo Combustible"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.tipocomb"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="naturaleza"
                      label="Naturaleza"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.tenencia"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="modalidad"
                      label="Modalidad"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.modalidad"
                      required
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro.Licencia"
                      clearable
                      outlined
                      required
                      v-model="form.licencia"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row  class="d-flex mt-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Conductor_1"
                      v-model="form.conductor1"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="errores.conductor1 = false"
                      :error="errores.conductor1"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Conductor_2"
                      v-model="form.conductor2"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Conductor_3"
                      v-model="form.conductor3"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFechaMat"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fmatricula"
                          label="Fecha Matricula"
                          append-icon="event"
                          hide-details
                          required
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fmatricula"
                        @input="pickerFechaMat = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro Soat"
                      clearable
                      outlined
                      required
                      v-model="form.nrosoat"
                      :error="errores.nrosoat"
                      @input="errores.nrosoat = false"
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
                          v-model="form.vencesoat"
                          label="Vence Soat"
                          append-icon="event"
                          hide-details
                          required
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencesoat"
                        @input="pickerFecha = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aseguradora"
                      clearable
                      outlined
                      required
                      v-model="form.asegsoat"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro Tecnomecanica"
                      clearable
                      outlined
                      required
                      v-model="form.nrotecno"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFechatec"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.vencetecno"
                          label="Vence Tecnomecanica"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencetecno"
                        @input="pickerFechatec = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nombre CDA"
                      clearable
                      outlined
                      required
                      v-model="form.cda"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro TodoRiesgo"
                      clearable
                      outlined
                      required
                      v-model="form.nrotodoriesgo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFechatodor"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.vencetodor"
                          label="Vence TodoRiesgo"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencetodor"
                        @input="pickerFechatodor = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aseguradora"
                      clearable
                      outlined
                      required
                      v-model="form.asegtodor"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro Contractual"
                      clearable
                      outlined
                      required
                      v-model="form.nrocontra"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFechacontra"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.vencecontra"
                          label="Vence Contractual"
                          append-icon="event"
                          hide-details
                          required
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencecontra"
                        @input="pickerFechacontra = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aseguradora"
                      clearable
                      outlined
                      required
                      v-model="form.asegcontra"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="T. Operación"
                      clearable
                      outlined
                      required
                      v-model="form.topera"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFechatopera"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.vencetopera"
                          label="Vence T.Operación"
                          append-icon="event"
                          hide-details
                          required
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencetopera"
                        @input="pickerFechatopera = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row  class="d-flex mt-1">
                  <v-col class="d-flex pb-0" cols="4">
                    <v-autocomplete
                      label="Centro de costos"
                      v-model="form.ccosto"
                      :items="tablaccosto"
                      :item-text="format_ccosto"
                      hide-details
                      return-object
                      outlined
                      :error="error.ccosto"
                      @change="error.ccosto = false"
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaReg"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_afiliacion"
                          label="Fecha Afiliación"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_afiliacion"
                        @input="pickerFechaReg = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Cuenta contable"
                      clearable
                      outlined
                      required
                      v-model="form.ctacontab"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="% Empresa"
                      clearable
                      outlined
                      required
                      v-model="form.porcempr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="% Fondo"
                      clearable
                      outlined
                      required
                      v-model="form.porfondo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="% Fondo R"
                      clearable
                      outlined
                      required
                      v-model="form.porfondor"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="% Fondo R"
                      clearable
                      outlined
                      required
                      v-model="form.porfondor"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex justify-center">
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Cargar Documentos"
                      accept=".pdf"
                      outlined
                      hide-details
                      v-model="pdf"
                    ></v-file-input>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Foto Vehiculo"
                      accept=".png"
                      outlined
                      hide-details
                      multiple
                      v-model="img_actual"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-divider v-if="pdf" color="succes"></v-divider>
                <v-row v-if="pdf">
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
            </v-tab-item> -->
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

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
        estado: true,
        titulo: null,
        tipo: null,
      },
      error: {
        rut: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      pickerFechaReg: false,
      pickerFechaMat: false,
      pickerFechacontra: false,
      pickerFechatodor: false,
      pickerFechatec: false,
      pickerFechatopera: false,
      pickerFecha: false,
      singleExpand: true,
      expanded: [],
      tablaccosto: [],
      tipovehiculo: [
        { text: "Camioneta Especial", value: 1 },
        { text: "Campero Especial", value: 2 },
        { text: "Camioneta", value: 3 },
        { text: "Microbus Especial", value: 4 },
        { text: "Bus", value: 5 },
        { text: "Buseta", value: 6 },
        { text: "Taxi", value: 7 },
      ],
      tipocombustible: [
        { text: "Gasolina", value: 1 },
        { text: "A.C.P.M.", value: 2 },
        { text: "Gas", value: 3 },
        { text: "Otros", value: 4 },
      ],
      naturaleza: [
        { text: "Ajeno", value: 1 },
        { text: "Propio", value: 2 },
        { text: "Leasing", value: 3 },
      ],

      modalidad: [
        { text: "Intermunicipal", value: 1 },
        { text: "Urbano", value: 2 },
        { text: "Turismo", value: 3 },
      ],

      ruts3: [],
      contenido: [],
      modelo: [],
      agencias: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Placa", align: "left", value: "placa_rep" },
        {
          text: "Conductor",
          align: "left",
          value: "conductor_rep",
        },
        {
          text: "Nro Interno",
          align: "left",
          value: "nrointer_rep",
        },
        { text: "Marca", align: "center", value: "marca_rep" },
        { text: "Modelo", align: "center", value: "modelo_rep" },
        { text: "Color", align: "center", value: "color_rep" },

        { text: "Estado", align: "center", value: "estadoestud_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        ccosto: false,
        estudiante: false,
        modelo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      tab: 0,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money: {
        decimal: ".",
        thousands: ",",
        precision: 3,
        masked: false,
      },
      img_actual: null,
      imagenes: [],
      imagenes_src: [],
      pdf: null,
      imagenes_subidas: [],
    };
  },
  created() {
    this.dialogo.estado = false;
    this.cargarcontenido();
    this.cargarTablaccostos();

    this.get_ruts();
  },
  watch: {
    img_actual: function (val) {
      this.add_img();
    },
  },
  methods: {
    subir_archivos(data) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = sessionStorage.Sesion.substr(0, 15);
        var placa = _this.form.placa;

        var adjuntos = [];
        var imagenes = this.imagenes;
        adjuntos = imagenes;
        var pdf = this.pdf;

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
                _this.pdf = null;
                resolve(result.mensaje);
              })
              .catch((error) => reject(error));
          });
      });
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
    mostrar_pdf() {
      var val = this.pdf;
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

      // console.log("Res", data);
      this.imagenes_subidas = data;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.placa = item.placa_rep;
      // this.form.propietario = parseInt(item.idprop_rep);
      this.form.ccpropietario = item.ccpropietario_rep
        ? parseInt(item.ccpropietario_rep)
        : "0";

      var busqueda_tvehiculo = this.tipovehiculo.find(
        (el) => el.value == item.tipo_rep
      );
      this.form.tipovehic = busqueda_tvehiculo;

      this.form.marca = item.marca_rep;
      this.form.modelo = item.modelo_rep;
      this.form.color = item.color_rep;
      this.form.nrointerno = parseInt(item.nrointer_rep);
      this.form.motor = item.motor_rep.trim();
      this.form.chasis = item.chasis_rep.trim();
      this.form.ctacontab = item.ctacontab_rep;
      this.form.convenio = item.convenio_rep.trim();
      

      var busqueda_tcombustible = this.tipocombustible.find(
        (el) => el.value == item.tipocomb_rep
      );
      this.form.tipocomb = busqueda_tcombustible;

      var busqueda_naturaleza = this.naturaleza.find(
        (el) => el.value == item.naturaleza_rep
      );
      this.form.tenencia = busqueda_naturaleza;

      this.form.licencia = parseInt(item.licencia_rep);

      var busqueda_conductor = this.ruts3.find(
        (el) => el.identificacion_rut == item.idcond_rep
      );
      this.form.conductor1 = busqueda_conductor;

      var busqueda_conductor2 = this.ruts3.find(
        (el) => el.identificacion_rut == item.idcond2_rep
      );
      this.form.conductor2 = busqueda_conductor2;

      var busqueda_conductor3 = this.ruts3.find(
        (el) => el.identificacion_rut == item.idcond3_rep
      );
      this.form.conductor3 = busqueda_conductor3;

      this.form.fmatricula = item.fechamat_rep;
      this.form.fecha_afiliacion = item.fafilia_rep;

      this.form.nrosoat = parseInt(item.nrosoat_rep);
      this.form.vencesoat = item.vsoat_rep;
      this.form.asegsoat = item.asegsoat_rep.trim();

      this.form.nrotecno = parseInt(item.nrotecno_rep);
      this.form.vencetecno = item.vtecno_rep;
      this.form.cda = item.cda_rep.trim();

      this.form.nrotodoriesgo = parseInt(item.nrotodor_rep);
      this.form.vencetodor = item.vtodor_rep;
      this.form.asegtodor = item.asegtodor_rep.trim();

      this.form.nrocontra = parseInt(item.nrocontra_rep);
      this.form.vencecontra = item.vcontra_rep;
      this.form.asegcontra = item.asegcontra_rep.trim();

      this.form.topera = parseInt(item.nrotopera_rep);
      this.form.vencetopera = item.vtopera_rep;

      var busqueda_ccosto = this.tablaccosto.find(
        (el) => el.llavecentro_cost == item.ccosto_rep
      );
      this.form.ccosto = busqueda_ccosto;

      this.form.porcempr = item.porcemp_rep;
      this.form.porfondor = item.porcfondor_rep;
      this.form.porfondo = item.porcfondo_rep;

      var busqueda_modalidad = this.modalidad.find(
        (el) => el.value == item.modalidad_rep
      );
      this.form.modalidad = busqueda_modalidad;

      this.form.estado = item.estado_rep == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));

      this.format_envio(data);
      this.card_estado = true;
    },
    format_envio(data) {
      var placa = data.placa;
      var conductor = data.conductor1
        ? data.conductor1.identificacion_rut
        : "0";
      var marca = data.marca;
      var modelo = data.modelo;
      var color = data.color;
      var motor = data.motor;
      var chasis = data.chasis;
      var tipoveh = data.tipovehic.value;
      var nrointerno = data.nrointerno;
      var tipocomb = data.tipocomb.value;
      var tenencia = data.tenencia.value;
      var nrolicencia = data.licencia;
      var toperacion = data.topera;
      var vencetopera = data.vencetopera
        ? data.vencetopera.replace(/\-/g, "")
        : 0;
      var conductor2 = data.conductor2
        ? data.conductor2.identificacion_rut
        : "0";
      var conductor3 = data.conductor3
        ? data.conductor3.identificacion_rut
        : "0";
      var fmatricula = data.fmatricula ? data.fmatricula.replace(/\-/g, "") : 0;
      var nrosoat = data.nrosoat;
      var asegsoat = data.asegsoat;
      var vencesoat = data.vencesoat ? data.vencesoat.replace(/\-/g, "") : 0;
      var nrotecno = data.nrotecno;
      var emprtecno = data.cda;
      var vencetecno = data.vencetecno ? data.vencetecno.replace(/\-/g, "") : 0;
      var nrotodor = data.nrotodoriesgo;
      var asegtodor = data.asegtodor;
      var vencetodor = data.vencetodor ? data.vencetodor.replace(/\-/g, "") : 0;
      var nrocontractual = data.nrocontra;
      var asegcontract = data.asegcontra;
      var vencecontract = data.vencecontra
        ? data.vencecontra.replace(/\-/g, "")
        : 0;
      var ccosto = data.ccosto ? data.ccosto.llavecentro_cost : 0;
      var fafiliacion = data.fecha_afiliacion
        ? data.fecha_afiliacion.replace(/\-/g, "")
        : 0;
      var porcempr = data.porcempr;
      var ctacontab = data.ctacontab;
      var naturaleza = data.tenencia.value;
      var modalidad = data.modalidad.value;
      var porcfondo = data.porfondo;
      var porcfondor = data.porfondor;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      let ccpropietario = data.ccpropietario ? data.ccpropietario : 0;
      let propietario = data.ccpropietario ? data.ccpropietario : 0;
      let convenio = data.convenio ? data.convenio.trim() : "";
      let cartera = 0;
      let excluido = 0;
      

      let datos = {
        url: "Transporte/dlls/CfvehiculoV.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          placa +
          "|" +
          propietario +
          "|" +
          conductor +
          "|" +
          marca +
          "|" +
          modelo +
          "|" +
          color +
          "|" +
          motor +
          "|" +
          chasis +
          "|" +
          tipoveh +
          "|" +
          nrointerno +
          "|" +
          tipocomb +
          "|" +
          tenencia +
          "|" +
          modalidad +
          "|" +
          nrolicencia +
          "|" +
          toperacion +
          "|" +
          conductor2 +
          "|" +
          conductor3 +
          "|" +
          fmatricula +
          "|" +
          nrosoat +
          "|" +
          asegsoat +
          "|" +
          vencesoat +
          "|" +
          nrotecno +
          "|" +
          emprtecno +
          "|" +
          vencetecno +
          "|" +
          nrotodor +
          "|" +
          asegtodor +
          "|" +
          vencetodor +
          "|" +
          nrocontractual +
          "|" +
          asegcontract +
          "|" +
          vencecontract +
          "|" +
          ccosto +
          "|" +
          fafiliacion +
          "|" +
          porcempr +
          "|" +
          naturaleza +
          "|" +
          porcfondo +
          "|" +
          porcfondor +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          vencetopera +
          "|" +
          ctacontab +
          "|" +
          ccpropietario +
          "|" +
          cartera +
          "|" +
          excluido +
          "|" +
          excluido +
          "|" +
          convenio + 
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
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
      };
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Transporte/dlls/CfvehiculoVJ.dll",
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
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 7 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
          this.ruts3.pop();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = [];
      var columnas = [
        {
          title: "Placa",
          value: "placa_rep",
        },
        {
          title: "id_Propietario",
          value: "idprop_rep",
        },
        {
          title: "Nombre_Propietario",
          value: "propietario_rep",
        },
        {
          title: "Marca",
          value: "marca_rep",
        },
        {
          title: "Modelo",
          value: "modelo_rep",
        },
        {
          title: "Color",
          value: "color_rep",
        },
        {
          title: "Nombre_Conductor",
          value: "conductor_rep",
        },

        {
          title: "Nro_Interno",
          value: "nrointer_rep",
        },

        {
          title: "Nro T.Operación",
          value: "nrosoat_rep",
        },
        {
          title: "Vence T. Operación",
          value: "vtopera_rep",
          format: "fecha",
        },
        {
          title: "Nro Soat",
          value: "nrosoat_rep",
        },
        {
          title: "Aseguradora Soat",
          value: "asegsoat_rep",
        },
        {
          title: "Vence Soat",
          value: "vsoat_rep",
          format: "fecha",
        },
        {
          title: "Nro Tecnomecanica",
          value: "nrotecno_rep",
        },
        {
          title: "CDA",
          value: "cda_rep",
        },
        {
          title: "Vence Tecnomecanica",
          value: "vtecno_rep",
          format: "fecha",
        },
        {
          title: "Nro TodoRiesgo",
          value: "nrosoat_rep",
        },
        {
          title: "Aseguradora TodoRiesgo",
          value: "asegtodor_rep",
        },
        {
          title: "Vence TodoRiesgo",
          value: "vtodor_rep",
          format: "fecha",
        },
        {
          title: "Nro Contractual",
          value: "nrosoat_rep",
        },
        {
          title: "Aseguradora Contractual",
          value: "asegcontra_rep",
        },
        {
          title: "Vence Contractual",
          value: "vcontra_rep",
          format: "fecha",
        },
        {
          title: "Centro de Costos",
          value: "ccosto_rep",
        },
        {
          title: "Cuenta Contable",
          value: "ctacontab_rep",
        },
        {
          title: "Fecha Afiliacion",
          value: "fafilia_rep",
          format: "fecha",
        },
      ];

      var header_format = [{ text: "REPORTE VEHICULOS", bold: true, size: 16 }];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Vehiculos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-VEHICULOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
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
