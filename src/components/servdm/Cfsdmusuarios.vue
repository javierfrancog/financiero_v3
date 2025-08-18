<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Usuarios</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex justify-end">
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
              <v-col class="d-flex justify-end">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="imprimir_excel"
                >
                  Imprimir EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-left" no-gutters>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Ciudad"
                  v-model="form.ciudadbusq"
                  :items="ciudades_select"
                  item-value="value"
                  :item-text="format_ciudad"
                  outlined
                  clearable
                  return-object
                  :error="errores.ciudad"
                  @change="(errores.ciudad = false), cargarcontenido()"
                  hide-details
                ></v-autocomplete>
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Bloqueado" : "Activo"
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

          <v-col class="d-flex justify-end">
            <v-btn
              class="ma-2 white--text"
              color="red"
              large
              depressed
              @click="
                dialogo.estado = false;
                init_form();
              "
              >Cancelar</v-btn
            >
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              large
              depressed
              @click="grabar_usuario()"
            >
              Guardar
            </v-btn>
          </v-col>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información General</v-tab>
            <v-tab>Contrato</v-tab>
            <v-tab>Tabla Der.Conexion</v-tab>
            <v-tab>Tabla Inst.Interna</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Código"
                      clearable
                      outlined
                      required
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                      autocomplete="off"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Ruta"
                      v-model="form.ruta"
                      hide-details
                      outlined
                      @change="errores.ruta = false"
                      :error="errores.ruta"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="id.Contabilidad"
                      v-model="form.idcontab"
                      hide-details
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
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

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaNacim"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_nacim"
                          label="Fecha Nacimiento"
                          append-icon="event"
                          outlined
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_nacim"
                        @input="pickerFechaNacim = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="9">
                    <v-text-field
                      label="Actividad Economica"
                      clearable
                      outlined
                      required
                      v-model="form.actecon"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-select
                      label="Estrato"
                      v-model="form.estrato"
                      :items="item_estato"
                      item-value="estrato_rep"
                      hide-details
                      return-object
                      outlined
                      @change="errores.estrato = false"
                      :error="errores.estrato"
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Uso"
                      v-model="form.uso"
                      :items="usos"                      
                      item-value="uso_rep"
                      hide-details
                      return-object
                      outlined
                      @change="errores.uso = false"
                      :error="errores.uso"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
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
                      label="Barrio"
                      v-model="form.barrio"
                      :items="tablaBarrios"
                      :item-text="format_barrios"
                      item-value="value"
                      outlined
                      return-object
                      :error="errores.barrio"
                      @change="errores.barrio = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Apto/Piso"
                      clearable
                      required
                      outlined
                      v-model="form.apto"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Departamento"
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
                      return-object
                      :error="errores.ciudad"
                      @change="errores.ciudad = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Corregimientos"
                      v-model="form.corregimiento"
                      :items="corregim"
                      :item-text="format_corregim"
                      clearable
                      outlined
                      return-object
                      :error="errores.corregim"
                      @change="errores.corregim = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Latitud"
                      v-model="form.latitud"
                      hide-details
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Longitud"
                      v-model="form.longitud"
                      hide-details
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Altitud"
                      v-model="form.altitud"
                      hide-details
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Telefono"
                      clearable
                      outlined
                      required
                      v-model="form.telefono"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="9">
                    <v-text-field
                      label="Correo"
                      clearable
                      outlined
                      required
                      v-model="form.correo"
                      type="email"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4">
                    <v-select
                      label="Inf.Predial"
                      v-model="form.infopred"
                      :items="predial"
                      hide-details
                      return-object
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Nro Predial"
                      clearable
                      outlined
                      required
                      v-model="form.nropredial"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Nro Catastral"
                      clearable
                      outlined
                      required
                      v-model="form.nrocatastral"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="5">
                    <v-select
                      label="Condicion Predio"
                      v-model="form.condpredio"
                      :items="condicion"
                      hide-details
                      return-object
                      outlined
                    ></v-select>
                  </v-col>

                  <!-- <v-col class="d-flex" cols="4">
                    <v-select
                      label="Viv.Int. Prioritario"
                      v-model="form.vivienda"
                      :items="[
                        { text: 'Beneficio Estrato 1', value: 1 },
                        { text: 'Otro', value: 2 },
                      ]"
                      hide-details
                      return-object
                      outlined
                    ></v-select>
                  </v-col> -->
                  <v-col class="d-flex" cols="5">
                    <v-select
                      label="Subsidiado"
                      v-model="form.subsid"
                      :items="subsidiado"
                      hide-details
                      return-object
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <!-- <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaSol"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_solic"
                          label="Fecha Solicitud"
                          append-icon="event"
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_solic"
                        @input="pickerFechaSol = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col> -->
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaMatric"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_matric"
                          label="Fecha Matrícula"
                          append-icon="event"
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_matric"
                        @input="pickerFechaMatric = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaConst"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_const"
                          label="Fecha Construcción"
                          append-icon="event"
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_const"
                        @input="pickerFechaConst = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <!-- <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaRev"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_rev"
                          label="Fecha Revisión"
                          append-icon="event"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_rev"
                        @input="pickerFechaRev = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col> -->
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaInspecc"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_inspecc"
                          label="Fecha Inspección"
                          append-icon="event"
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_inspecc"
                        @input="pickerFechaInspecc = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Organismo de Inspección"
                      clearable
                      required
                      v-model="form.orginspecc"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Cod Acreditación"
                      clearable
                      required
                      v-model="form.codacred"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro.Certificado"
                      clearable
                      required
                      v-model="form.certificado"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <!-- <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaInst"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_inst"
                          label="Fecha Instalación"
                          append-icon="event"
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_inst"
                        @input="pickerFechaInst = false"
                        autocmplete="off"
                      ></v-date-picker>
                    </v-menu>
                  </v-col> -->

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro Medidor"
                      clearable
                      required
                      v-model="form.medidor"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro Regulador"
                      clearable
                      required
                      v-model="form.regulador"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Tipo Servicio"
                      v-model="form.tiposerv"
                      :items="tiposerv"
                      item-value="tiposerv"
                      hide-details
                      return-object
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Tasa Financiación"
                      clearable
                      required
                      v-model="form.tasafin"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="orange"></v-divider>
                <v-divider color="orange"></v-divider>

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-card-subtitle
                      class="subtitle-2 font-weight-medium grey--text text--darken-2 ma-0 mx-0 d-flex justify-center"
                    >
                      DERECHOS DE CONEXION
                    </v-card-subtitle>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Vlr Conexión"
                      clearable
                      v-model="form.vlr_conex"
                      @input="neto_conexion"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Sub.Alcaldía"
                      clearable
                      v-model="form.ini_conex"
                      @input="neto_conexion"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Abono Usuario"
                      clearable
                      v-model="form.abono_conex"
                      @input="neto_conexion"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Sdo a Financiar"
                      v-model="saldo_cx"
                      disabled
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Nro.Cuotas"
                      clearable
                      v-model="form.cuotas_conex"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro.Finaciación"
                      clearable
                      required
                      v-model="form.nrofin_conex"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-btn
                      color="purple"
                      class="ma-2 white--text"
                      depressed
                      @click="liquidacion_conexion()"
                    >
                      Liquidar Derechos
                    </v-btn>
                  </v-col>
                </v-row>

                <v-divider color="orange"></v-divider>
                <v-divider color="orange"></v-divider>

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-card-subtitle
                      class="subtitle-2 font-weight-medium grey--text text--darken-2 ma-0 mx-0 d-flex justify-center"
                    >
                      INSTALACION INTERNA
                    </v-card-subtitle>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Vlr Instalación"
                      clearable
                      v-model="form.vlr_inst"
                      @input="neto_instalacion"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Sub.Alcaldía"
                      clearable
                      required
                      v-model="form.ini_inst"
                      @input="neto_instalacion"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Abono Usuario"
                      clearable
                      required
                      v-model="form.abono_inst"
                      @input="neto_instalacion"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Sdo a Financiar ins"
                      required
                      v-model="sdo_inst"
                      disabled
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Nro.Cuotas"
                      clearable
                      required
                      v-model="form.cuotas_inst"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Nro.Finaciación"
                      clearable
                      required
                      v-model="form.nrofin_inst"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-btn
                      color="purple"
                      class="ma-2 white--text"
                      depressed
                      @click="generar_instalacion()"
                    >
                      Liquidar Instalación
                    </v-btn>
                  </v-col>
                </v-row>

                <v-divider color="orange"></v-divider>
                <v-divider color="orange"></v-divider>

                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaFinanc"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_financ"
                          label="Fecha Inicio Financiacion"
                          append-icon="event"
                          v-on="on"
                          color="indigo"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_financ"
                        @change="pickerFechaFinanc = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="d-flex justify-end">
                    <v-btn
                      color="red darken-2"
                      class="ma-2 white--text"
                      large
                      depressed
                      @click="imprimir_pdf(form)"
                    >
                      Imprimir Contrato
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <div class="pa-0 px-8">
                  <v-card-text class="px-0 pa-0">
                    <v-data-table
                      :items="table.items"
                      :headers="table.headers"
                      disable-pagination
                      hide-default-footer
                    >
                    </v-data-table>
                  </v-card-text>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <div class="pa-0 px-8">
                  <v-card-text class="px-0 pa-0">
                    <v-data-table
                      :items="table2.items"
                      :headers="table2.headers"
                      disable-pagination
                      hide-default-footer
                    >
                    </v-data-table>
                  </v-card-text>
                </div>
              </v-card>
            </v-tab-item>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { coingasco } from "../../_formatos.pdf.js";

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
      corregim: [],
      error: {
        rut: false,
      },
      table: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "nrocuota_rep",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "sdocapital_rep",
            align: "right",
          },
          {
            text: "Pago capital",
            value: "pagocapital_rep",
            align: "right",
          },
          {
            text: "Pago Int.",
            value: "pagointer_rep",
            align: "right",
          },
          {
            text: "Total Cuota",
            value: "totalcuota_rep",
            align: "right",
          },
          {
            text: "Sdo. capital",
            value: "saldocuota_rep",
            align: "right",
          },
          {
            text: "Fecha",
            value: "fechacuota_rep",
            align: "center",
          },
        ],
      },
      table2: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "nrocuota_rep",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "sdocapital_rep",
            align: "right",
          },
          {
            text: "Pago capital",
            value: "pagocapital_rep",
            align: "right",
          },
          {
            text: "Pago Int.",
            value: "pagointer_rep",
            align: "right",
          },
          {
            text: "Total Cuota",
            value: "totalcuota_rep",
            align: "right",
          },
          {
            text: "Sdo. capital",
            value: "saldocuota_rep",
            align: "right",
          },
          {
            text: "Fecha",
            value: "fechacuota_rep",
            align: "center",
          },
        ],
      },
      dialog: true,
      valid: false,
      pickerFechaRet: false,
      pickerFechaIng: false,
      pickerFechaInst: false,
      pickerFechaNacim: false,
      pickerFechaRev: false,
      pickerFechaSol: false,
      pickerFechaConst: false,
      pickerFechaMatric: false,
      pickerFechaInspecc: false,
      pickerFechaFinanc: false,
      tab1: null,
      tab2: null,
      tab3: null,

      singleExpand: true,
      expanded: [],
      ruts3: [],
      ruts4: [],
      rutsadmon: [],
      contenido: [],
      grado: [],
      tablaccosto: [],
      tablaPuc: [],
      tablaBases: [],
      tablaBarrios: [],
      agencias: [],
      ciudades_dian: [],
      ciudades_select: [],
      departamentos: [],
      item_estato: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "6", value: 6 },
        { text: "No Aplica", value: 9 },
      ],
      subsidiado: [
        { text: "Subsidiado", value: 1 },
        { text: "No Aplica", value: 2 },
      ],
      tiposerv: [
        { text: "Gas Propano", value: 1 },
        { text: "Gas Natural", value: 2 },
      ],

      condicion: [
        { text: "Hogar Comunitario/Sustituto ICBF", value: 1 },
        { text: "Vivienda Interes Prioritario", value: 2 },
        { text: "Asentamiento Indigena", value: 3 },
        { text: "No Aplica", value: 4 },
      ],

      search: "",
      saldo_cx: 0,
      sdo_inst: 0,
      consec_financ: 0,

      form: {
        vlr_conex: 0,
        ini_conex: 0,
        abono_conex: 0,
        corregimiento: null,

        vlr_inst: 0,
        ini_inst: 0,
        abono_inst: 0,

        listado_cargos: [],
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Código", align: "center", value: "cod_rep" },
        { text: "Ruta", align: "center", value: "ruta_rep" },
        { text: "Primer Apellido", align: "center", value: "apellido1_rep" },
        { text: "Segundo Apellido", align: "center", value: "apellido2_rep" },
        { text: "Nombres", align: "center", value: "nombres_rep" },
        { text: "Estrato", align: "center", value: "estrato_rep" },
        { text: "Uso", align: "center", value: "descruso_rep" },
        { text: "Dirección", align: "center", value: "direccion_rep" },
        { text: "Barrio", align: "center", value: "descripbarrio_rep" },
        { text: "Fecha Matricula", align: "center", value: "fechamat_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        ccosto: false,
        estudiante: false,
        grado: false,
        descripcion: false,
        estado: false,
        corregim: false,
        fecha_financ: false,
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
        precision: 0,
        masked: false,
      },
      filterMunicipios: [],
      usos: [
        { text: "Residencial", value: 1 },
        { text: "Comercial", value: 2 },
        { text: "Industrial", value: 8 },
        { text: "Oficial", value: 9 },
      ],

      predial: [
        { text: "Predial de Catastro", value: 1 },
        { text: "Numero Predial Nacional", value: 2 },
        { text: "Nuevo sin Homologar", value: 3 },
        { text: "Sin Cédula Catastral", value: 4 },
      ],
    };
  },
  created() {
    // this.cargarcontenido();
    this.get_ruts();
    this.get_basico();
    this.get_barrios();
    this.cargarCiudades();
    this.cargarCiudades2();
    this.cargarcorregim();

    this.$watch(
      "form.departamento",
      (e) => {
        this.get_municipios();
      },
      { deep: true }
    );
  },
  computed: {},
  methods: {
    async editar_item(data) {
      this.table.items = [];
      this.table2.items = [];
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo =
        item.apellido1_rep.trim() +
        " " +
        item.apellido2_rep.trim() +
        " " +
        item.nombres_rep.trim();
      this.dialogo.tipo = 1;
      let nrofin_conex = parseFloat(data.nrofinanconex_rep);
      let nrofin_inst = parseFloat(data.nrofinancinst_rep);

      if (nrofin_conex > 0) {
        await this.cargar_financia(data);
      }
      if (nrofin_inst > 0) {
        await this.cargar_financia2(data);
      }

      this.form.codigo = data.cod_rep.trim();
      this.form.ruta = data.ruta_rep.trim();
      this.form.apellido1 = data.apellido1_rep.trim();
      this.form.apellido2 = data.apellido2_rep.trim();
      this.form.nombres = data.nombres_rep.trim();
      this.form.direccion = data.direccion_rep.trim();
      this.form.medidor = data.medidor_rep.trim();
      this.form.telefono = data.telefono_rep.trim();
      this.form.correo = data.correo_rep.trim();
      this.form.fecha_rev = data.fecharev_rep;
      this.form.fecha_inspecc = data.fechainspec_rep;
      this.form.fecha_nacim = data.fechanacim_rep;
      this.form.cuotas_conex = parseFloat(data.cuotasconex_rep);
      this.form.cuotas_inst = parseFloat(data.cuotasinstala_rep);
      this.form.tasafin = parseFloat(data.tasafin_rep);
      this.form.nrofin_inst = parseFloat(data.nrofinancinst_rep);
      this.form.nrofin_conex = parseFloat(data.nrofinanconex_rep);

      this.form.latitud = data.latitud_rep.trim();
      this.form.longitud = data.longitud_rep.trim();
      this.form.altitud = data.altitud_rep.trim();
      this.form.orginspecc = data.orgacred_rep.trim();
      this.form.codacred = data.codacredita_rep.trim();
      this.form.certificado = data.certacredita_rep.trim();

      this.form.actecon = data.activecon_rep;

      this.form.idcontab = data.idcontab_rep.trim();

      let estrato = parseInt(item.estrato_rep);
      this.form.estrato = {
        text: estrato.toString(),
        value: estrato,
      };

      let uso = parseInt(item.uso_rep);
      let busq_select = this.usos.find((el) => el.value == uso);
      this.form.uso = busq_select;

      busq_select = this.item_estato.find((el) => el.value == estrato);
      this.form.estrato = busq_select;

      let busq_tiposerv = this.tiposerv.find(
        (el) => el.value == item.tiposerv_rep
      );
      this.form.tiposerv = busq_tiposerv;

      let busq_barrio = this.tablaBarrios.find(
        (el) => el.cod_rep == item.codbarrio_rep
      );
      this.form.barrio = busq_barrio;

      let busq_correg = this.corregim.find(
        (el) => parseFloat(el.cod_rep) == parseFloat(item.codcorregim_rep)
      );
      this.form.corregimiento = busq_correg;

      let departamento = item.ciudad_rep.substring(0, 2);
      let busqueda_departamento = this.departamentos.find(
        (el) => el.value == departamento
      );
      this.form.departamento = busqueda_departamento.value;

      let busqueda_subsid = this.subsidiado.find(
        (el) => el.value == item.subsidiado_rep
      );
      this.form.subsid = busqueda_subsid;

      await this.get_municipios();
      let busqueda_ciudad = this.filterMunicipios.find(
        (el) => el.value == item.ciudad_rep
      );
      this.$set(this.form, "ciudad", busqueda_ciudad);

      let infopred = parseInt(item.infopred_rep);
      let buscar_pred = this.predial.find((el) => el.value == infopred);
      this.form.infopred = buscar_pred;

      this.form.nropredial = data.nropredial_rep.trim();

      let hogar = parseInt(item.hogar_rep);
      let obj_hogar = {};
      if (hogar == 1) obj_hogar = { text: "Beneficio Estrato 1", value: 1 };
      else if (hogar == 2) obj_hogar = { text: "Otro", value: 2 };
      this.form.hogar = obj_hogar;

      // let vivienda = parseInt(item.vivienda_rep);
      // let obj_vivienda = {};

      // if (vivienda == 1)
      //   obj_vivienda = { text: "Beneficio Estrato 1", value: 1 };
      // else if (vivienda == 2) obj_vivienda = { text: "Otro", value: 2 };
      // this.form.vivienda = obj_vivienda;

      let buscar_condic = this.condicion.find(
        (el) => el.value == data.condicion_rep
      );
      this.form.condpredio = buscar_condic;

      this.form.nrocatastral = item.nrocatastral_rep.trim();
      this.form.regulador = item.regulador_rep.trim();
      this.form.apto = item.apto_rep.trim();

      this.form.fecha_solic = item.fechasol_rep;
      this.form.fecha_const = item.fechaconstr_rep;
      this.form.fecha_inst = item.fechainst_rep;
      this.form.fecha_rev = item.fecharev_rep;
      this.form.fecha_matric = item.fechamatric_rep;
      this.form.fecha_financ = item.fechainifinanc_rep;

      this.form.vlr_conex = this.formatNumero(parseInt(item.vlrconex_rep));
      this.form.ini_conex = this.formatNumero(parseInt(item.iniconex_rep));
      this.form.abono_conex = this.formatNumero(parseInt(item.abonoconex_rep));
      this.form.vlr_inst = this.formatNumero(parseInt(item.vlrinstala_rep));
      this.form.ini_inst = this.formatNumero(parseInt(item.iniinstala_rep));
      this.form.abono_inst = this.formatNumero(parseInt(item.abonoinstala_rep));

      let vlr_conex =
        parseInt(item.vlrconex_rep) -
        parseInt(item.iniconex_rep) -
        parseInt(item.abonoconex_rep);

      let neto = vlr_conex;
      this.saldo_cx = neto;

      let vlr_instala =
        parseInt(item.vlrinstala_rep) -
        parseInt(item.iniinstala_rep) -
        parseInt(item.abonoinstala_rep);
      let netoinst = vlr_instala;
      this.sdo_inst = netoinst;
    },
    cargar_financia(item) {
      let consecutivo = parseFloat(item.nrofinanconex_rep);
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
          this.table.items = data[0].cuotas_rep;
        })
        .catch((err) => {
          this.card.disabled = false;
          this.send_error("Error al cargar Financiación");
        });
    },
    cargar_financia2(item) {
      let consecutivo = parseFloat(item.nrofinancinst_rep);
      var key = consecutivo + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Servdm//dlls/PrFinanciaJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data[0].cuotas_rep.pop();
          this.table2.items = data[0].cuotas_rep;
        })
        .catch((err) => {
          this.card.disabled = false;
          this.send_error("Error al cargar Financiación");
        });
    },
    async grabar_usuario() {
      if (this.table.items.length) {
        await this.grabar_financiacion(1);
      }
      if (this.table2.items.length) {
        await this.grabar_financiacion(2);
      }

      await this.guardar();
    },
    guardar: function () {
      let data = JSON.parse(JSON.stringify(this.form));
      let codigo = data.codigo;
      let idcontab = data.idcontab;
      let ruta = data.ruta;
      let apellido1 = data.apellido1;
      let apellido2 = data.apellido2;
      let nombres = data.nombres;
      let estrato = data.estrato.value;
      let uso = data.uso.value;
      let direccion = data.direccion;
      let barrio = data.barrio ? data.barrio.cod_rep : 0;
      let apto = data.apto;
      let ciudad = data.ciudad.value;
      let corregim = data.corregimiento ? data.corregimiento.cod_rep : 0;
      let telefono = data.telefono;
      let correo = data.correo;
      let infopred = data.infopred ? data.infopred.value : "0";
      let nropredial = data.nropredial;
      let nrocatastral = data.nrocatastral;
      let hogar = data.hogar ? data.hogar.value : "0";
      let tasafin = data.tasafin ? data.tasafin : "0";
      // let vivienda = data.vivienda ? data.vivienda.value : "0";
      let condicion = data.condicion ? data.condicion.value : "4";
      let subsid = data.subsid ? data.subsid.value : "0";
      let tiposerv = data.tiposerv ? data.tiposerv.value : "0";
      let nrofin_conex = data.nrofin_conex ? data.nrofin_conex : "0";
      let nrofinancinst = data.nrofin_inst ? data.nrofin_inst : "0";
      let latitud = data.latitud ? data.latitud.trim() : "";
      let longitud = data.longitud ? data.longitud.trim() : "";
      let altitud = data.altitud ? data.altitud.trim() : "";
      let orginspecc = data.orginspecc ? data.orginspecc.trim() : "";
      let codacred = data.codacred ? data.codacred.trim() : "";
      let certificado = data.certificado ? data.certificado.trim() : "";

      let fecha_nacim = data.fecha_nacim
        ? data.fecha_nacim.replace(/\-/g, "")
        : "";

      let fecha_solic = data.fecha_solic
        ? data.fecha_solic.replace(/\-/g, "")
        : "";
      let fecha_const = data.fecha_const
        ? data.fecha_const.replace(/\-/g, "")
        : "";
      let fecha_inspecc = data.fecha_inspecc
        ? data.fecha_inspecc.replace(/\-/g, "")
        : "";

      let fecha_inst = data.fecha_inst
        ? data.fecha_inst.replace(/\-/g, "")
        : "";
      let fecha_matric = data.fecha_matric
        ? data.fecha_matric.replace(/\-/g, "")
        : "";
      let fecha_rev = data.fecha_rev ? data.fecha_rev.replace(/\-/g, "") : "";
      let fecha_financ = data.fecha_financ
        ? data.fecha_financ.replace(/\-/g, "")
        : "";

      let medidor = data.medidor ? data.medidor : "";
      let regulador = data.regulador ? data.regulador : "";
      let vlr_conex = this.form.vlr_conex.replace(/\,/g, "");
      let ini_conex = this.form.ini_conex.replace(/\,/g, "");
      let abono_conex = this.form.abono_conex.replace(/\,/g, "");
      let vlr_inst = this.form.vlr_inst.replace(/\,/g, "");
      let ini_inst = this.form.ini_inst.replace(/\,/g, "");
      let abono_inst = this.form.abono_inst.replace(/\,/g, "");
      let cuotas_conex = this.form.cuotas_conex;
      let cuotas_inst = this.form.cuotas_inst;
      let estado = data.estado ? "1" : "0";
      let actecon = data.actecon;
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Servdm/dlls/Cfusuarios.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          idcontab +
          "|" +
          ruta +
          "|" +
          apellido1 +
          "|" +
          apellido2 +
          "|" +
          nombres +
          "|" +
          estrato +
          "|" +
          uso +
          "|" +
          direccion +
          "|" +
          barrio +
          "|" +
          apto +
          "|" +
          ciudad +
          "|" +
          telefono +
          "|" +
          correo +
          "|" +
          infopred +
          "|" +
          nropredial +
          "|" +
          nrocatastral +
          "|" +
          condicion +
          "|" +
          subsid +
          "|" +
          fecha_solic +
          "|" +
          fecha_const +
          "|" +
          fecha_inst +
          "|" +
          fecha_matric +
          "|" +
          fecha_rev +
          "|" +
          medidor +
          "|" +
          regulador +
          "|" +
          vlr_conex +
          "|" +
          ini_conex +
          "|" +
          abono_conex +
          "|" +
          vlr_inst +
          "|" +
          ini_inst +
          "|" +
          abono_inst +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          fecha_nacim +
          "|" +
          fecha_inspecc +
          "|" +
          actecon +
          "|" +
          cuotas_conex +
          "|" +
          cuotas_inst +
          "|" +
          tiposerv +
          "|" +
          tasafin +
          "|" +
          fecha_financ +
          "|" +
          nrofin_conex +
          "|" +
          nrofinancinst +
          "|" +
          latitud +
          "|" +
          longitud +
          "|" +
          altitud +
          "|" +
          orginspecc +
          "|" +
          codacred +
          "|" +
          certificado +
          "|" +
          corregim +
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
    async grabar_financiacion(item) {
      var data = JSON.parse(JSON.stringify(this.form));
      let tabla_cuotas = await this.enviar_tabla(item);
      let consecutivo = 0;
      let rut = data.idcontab.trim();
      let codigo = data.codigo.trim();
      let fechaini = "";
      let valorini = 0;
      let cuotas = data.cuotas_inst;

      if (item == 1) {
        fechaini = this.table.items[0].fechacuota_rep.replace(/\-/g, "");
        valorini = this.table.items[0].sdocapital_rep.replace(/\,/g, "");
        consecutivo = parseFloat(data.nrofin_conex);
        cuotas = data.cuotas_conex;
      } else {
        fechaini = this.table2.items[0].fechacuota_rep.replace(/\-/g, "");
        valorini = this.table2.items[0].sdocapital_rep.replace(/\,/g, "");
        consecutivo = parseFloat(data.nrofin_inst);
        cuotas = data.cuotas_inst;
      }

      let tasa = data.tasafin;
      post
        .postData({
          url: "Servdm/dlls/PrsdmfinanciaU.dll",
          // url: "transporte/dlls/PrConsecutivoT.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              rut +
              "|" +
              codigo +
              "|" +
              fechaini +
              "|" +
              cuotas +
              "|" +
              valorini +
              "|" +
              tasa +
              "|" +
              item +
              "|",
            ...tabla_cuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Financiación Generada Correctamente",
            estado: true,
          });
        });
    },
    enviar_tabla(item) {
      return new Promise((res) => {
        let tablajson = {};
        if (item == 1) {
          this.table.items.forEach((item, index) => {
            let format_index = (index + 1).toString().padStart(3, "0");

            let saldo = item.sdocapital_rep.replace(/\,/g, "");
            let pago_capital = item.pagocapital_rep.replace(/\,/g, "");
            let interes = item.pagointer_rep.replace(/\,/g, "");
            let pago_no = item.nrocuota_rep;
            let fecha = item.fechacuota_rep.replace(/\-/g, "");
            tablajson[
              `DATOJ-${format_index}`
            ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${fecha}|`;
          });
        } else {
          this.table2.items.forEach((item, index) => {
            let format_index = (index + 1).toString().padStart(3, "0");

            let saldo = item.sdocapital_rep.replace(/\,/g, "");
            let pago_capital = item.pagocapital_rep.replace(/\,/g, "");
            let interes = item.pagointer_rep.replace(/\,/g, "");
            let pago_no = item.nrocuota_rep;
            let fecha = item.fechacuota_rep.replace(/\-/g, "");
            tablajson[
              `DATOJ-${format_index}`
            ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${fecha}|`;
          });
        }
        res(tablajson);
      });
    },
    async get_consecutivo() {
      var fecha = this.$moment().format("YYYYMMDD");
      post
        .postData({
          url: "financiero/dlls/PrConsecutivoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            "12" +
            "|" +
            "0001" +
            "|" +
            "001" +
            "|" +
            "0" +
            "|" +
            fecha +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.consec_financ = data[0].nro_cons.trim();
        })
        .catch((err) => {
          this.load.consecutivo = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    neto_conexion() {
      let vlr_conex =
        typeof this.form.vlr_conex === "string"
          ? parseFloat(this.form.vlr_conex.replace(/\,/g, ""))
          : 0;
      let ini_conex =
        typeof this.form.ini_conex === "string"
          ? parseFloat(this.form.ini_conex.toString().replace(/\,/g, ""))
          : 0;
      let abono_conex =
        typeof this.form.abono_conex === "string"
          ? parseFloat(this.form.abono_conex.toString().replace(/\,/g, ""))
          : 0;

      let neto = vlr_conex - ini_conex - abono_conex;
      // this.formatNumero(neto);
      this.saldo_cx = neto;
    },
    neto_instalacion() {
      let vlr_inst =
        typeof this.form.vlr_inst === "string"
          ? parseFloat(this.form.vlr_inst.replace(/\,/g, ""))
          : 0;
      let ini_inst =
        typeof this.form.ini_inst === "string"
          ? parseFloat(this.form.ini_inst.toString().replace(/\,/g, ""))
          : 0;
      let abono_inst =
        typeof this.form.abono_inst === "string"
          ? parseFloat(this.form.abono_inst.toString().replace(/\,/g, ""))
          : 0;

      let neto_ins = vlr_inst - ini_inst - abono_inst;
      // this.formatNumero(parseInt(neto_ins));
      this.sdo_inst = neto_ins;
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form.eliminar = false;
      this.form.corregimiento = "";
      this.form.listado_cargos = [];
    },
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];

      data_parse = [...data];

      let columnas = [
        {
          title: "Codigo",
          value: "cod_rep",
        },
        {
          title: "Id_Contabilidad",
          value: "idcontab_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Nombres",
          value: "nombres_rep",
          format: "string",
        },
        {
          title: "Dirección",
          value: "direccion_rep",
          format: "string",
        },
        {
          title: "Barrio",
          value: "descripbarrio_rep",
          format: "string",
        },
        {
          title: "Telefono",
          value: "telefono_rep",
        },
        {
          title: "Ciudad",
          value: "ciudad_rep",
        },
        {
          title: "Correo",
          value: "correo_rep",
          format: "string",
        },
        {
          title: "Fecha Matricula",
          value: "fechamatric_rep",
          format: "string",
        },
        {
          title: "Fecha Construccion",
          value: "fechaconstr_rep",
          format: "string",
        },
        {
          title: "Fecha Inspección",
          value: "fechainspec_rep",
          format: "string",
        },
        {
          title: "Fecha Revisión",
          value: "fecharev_rep",
          format: "string",
        },
        {
          title: "Medidor",
          value: "medidor_rep",
          format: "string",
        },
        {
          title: "Regulador",
          value: "regulador_rep",
          format: "string",
        },
        {
          title: "Organismo",
          value: "orgacred_rep",
          format: "string",
        },
        {
          title: "Codigo Acreditador",
          value: "codacredita_rep",
          format: "string",
        },
        {
          title: "Certificado",
          value: "certacredita_rep",
          format: "string",
        },
      ];

      let header_format = [
        { text: "INFORME CONFIGURACIÓN USUARIOS", bold: true, size: 16 },
        "",
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Informe configuración Usuarios",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `INFORME CONFIGURACIÓN DE USUARIOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          })
          .catch((error) => {
            console.log(error);
            this.send_error("Error al generar excel");
          });
      });
    },
    imprimir_pdf(data) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        coingasco(data).then(() => {
          console.log("Impresión finalizada");
        });
      });
    },
    cargarcontenido() {
      this.contenido = [];
      let ciudad = this.form.ciudadbusq.codigo_rep;
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/CfusuariosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + ciudad + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Usuarios",
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
          data: sessionStorage.Sesion + "|" + 5 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Estudiantes",
            estado: true,
          });
        });
    },
    cargarcorregim() {
      post
        .postData({
          url: "servdm/dlls/CfsdmcorregJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.corregim = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Corregiminetos",
            estado: true,
          });
        });
    },
    get_basico: function () {
      post
        .postData({
          url: "Servdm/dlls/CfcomptarJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Bases");
        });
    },
    get_barrios: function () {
      post
        .postData({
          url: "Servdm/dlls/CfBarriosJ.DLL",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBarrios = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Barrios");
        });
    },
    format_barrios: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },

    format_corregim(val) {
      return `${val.descrip_rep}`;
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
    get_municipios() {
      return new Promise((res) => {
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
        res();
      });
    },
    generar_liquidacion() {
      if (!this.form.fecha_financ) {
        this.errores.fecha_financ = true;
        this.send_error("Fecha Inicio financiacion Obligatorio!");
      } else {
        this.tab = 2;
        let tipo = 1;
        let empresa = sessionStorage.Sesion.substr(0, 15);
        if (empresa === "000000901122935") {
          tipo = 3;
        }
        if (tipo === 1) {
          this.liquidacion_factor();
        } else if (tipo === 3) {
          this.liquidacion_logigas();
        } else {
          this.liquidacion_cuota();
        }
      }
    },
    liquidacion_factor() {
      let valorconex = this.saldo_cx
        ? parseInt(this.saldo_cx.replace(/\,/g, ""))
        : 0;
      let valorinst = this.sdo_inst
        ? parseInt(this.sdo_inst.replace(/\,/g, ""))
        : 0;
      let tasafin = this.form.tasafin ? parseFloat(this.form.tasafin) : 0;

      let valor = valorconex + valorinst;
      let cuotas = parseInt(this.form.cuotas_inst);
      let tasa_interes = tasafin;

      let fecha_inicial = this.form.fecha_financ;
      let ano = fecha_inicial.substring(0, 4);
      let mes = fecha_inicial.substring(5, 7);
      let dia = fecha_inicial.substring(8, 10);
      if (mes > 1) {
        mes = mes - 1;
      } else {
        mes = mes * 1;
      }
      (mes = mes.toString().padStart(2, "0")),
        (fecha_inicial = ano + mes + dia);

      let factor1 = (tasa_interes / 100) * valor;
      let basepot = 1 + tasa_interes / 100;
      let potencia = Math.pow(basepot, -cuotas);
      let factor2 = 1 - potencia;
      let tcuota = (factor1 / factor2).toFixed(0);

      let list = [];
      let capital = parseFloat(valor);
      for (let i = 0; i < cuotas; i++) {
        let interes = (capital * (tasa_interes / 100)).toFixed(0);
        let monto_pago = tcuota;
        let pago_capital = (monto_pago - interes).toFixed(0);

        if (i === cuotas - 1) {
          pago_capital = saldo_capital;
          interes = monto_pago - pago_capital;
        }
        let saldo_capital = capital - pago_capital;
        let fecha = 0;

        if (i == 0) {
          fecha = this.$moment(fecha_inicial)
            .add(i + 0, "months")
            .format("YYYY-MM-DD");
        } else {
          fecha = this.$moment(fecha_inicial)
            .add(i + 0, "months")
            .format("YYYY-MM-DD");
        }

        list.push({
          sdocapital_rep: this.formatNumero(capital),
          pagocapital_rep: this.formatNumero(pago_capital),
          pagointer_rep: this.formatNumero(interes),
          totalcuota_rep: this.formatNumero(monto_pago),
          saldocuota_rep: this.formatNumero(saldo_capital),
          nrocuota_rep: i + 1,
          fechacuota_rep: fecha,
        });

        capital = saldo_capital;
      }

      this.table.items = list;
    },
    liquidacion_conexion() {
      if (!this.form.fecha_financ) {
        this.errores.fecha_financ = true;
        this.send_error("Fecha Inicio financiacion Obligatorio!");
      } else {
        this.tab = 2;
        let valorconex = this.saldo_cx ? parseInt(this.saldo_cx) : 0;
        let tasafin = this.form.tasafin ? parseFloat(this.form.tasafin) : 0;

        let valor = valorconex;
        let cuotas = parseInt(this.form.cuotas_conex);
        let tasa_interes = tasafin;

        let fecha_inicial = this.form.fecha_financ;
        let ano = fecha_inicial.substring(0, 4);
        let mes = fecha_inicial.substring(5, 7);
        let dia = fecha_inicial.substring(8, 10);
        if (mes > 1) {
          mes = mes * 1;
        } else {
          mes = mes * 1;
        }
        (mes = mes.toString().padStart(2, "0")),
          (fecha_inicial = ano + mes + dia);

        let factor1 = (tasa_interes / 100) * valor;
        let basepot = 1 + tasa_interes / 100;
        let potencia = Math.pow(basepot, -cuotas);
        let factor2 = 1 - potencia;
        let tcuota = (factor1 / factor2).toFixed(0);

        let list = [];
        let capital = parseFloat(valor);
        for (let i = 0; i < cuotas; i++) {
          // let pago_capital = (capital / cuotas).toFixed(0);
          // let interes = (capital * (tasa_interes / 100)).toFixed(0);
          // let monto_pago = parseFloat(pago_capital) + parseFloat(interes);
          // let saldo_capital = capital - pago_capital;

          let interes = (capital * (tasa_interes / 100)).toFixed(0);
          let monto_pago = tcuota;
          let pago_capital = (monto_pago - interes).toFixed(0);

          if (i === cuotas - 1) {
            pago_capital = saldo_capital;
            interes = monto_pago - pago_capital;
          }
          let saldo_capital = capital - pago_capital;
          let fecha = 0;

          if (i == 0) {
            fecha = this.$moment(fecha_inicial)
              .add(i + 0, "months")
              .format("YYYY-MM-DD");
          } else {
            fecha = this.$moment(fecha_inicial)
              .add(i + 0, "months")
              .format("YYYY-MM-DD");
          }

          list.push({
            sdocapital_rep: this.formatNumero(capital),
            pagocapital_rep: this.formatNumero(pago_capital),
            pagointer_rep: this.formatNumero(interes),
            totalcuota_rep: this.formatNumero(monto_pago),
            saldocuota_rep: this.formatNumero(saldo_capital),
            nrocuota_rep: i + 1,
            fechacuota_rep: fecha,
          });

          capital = saldo_capital;
        }

        this.table.items = list;
      }
    },
    generar_instalacion() {
      if (!this.form.fecha_financ) {
        this.errores.fecha_financ = true;
        this.send_error("Fecha Inicio financiacion Obligatorio!");
      } else {
        this.tab = 3;
        let valorinstal = this.sdo_inst ? parseInt(this.sdo_inst) : 0;
        let tasafin = this.form.tasafin ? parseFloat(this.form.tasafin) : 0;

        let valor = valorinstal;
        let cuotas = parseInt(this.form.cuotas_inst);
        let tasa_interes = tasafin;

        let fecha_inicial = this.form.fecha_financ;
        let ano = fecha_inicial.substring(0, 4);
        let mes = fecha_inicial.substring(5, 7);
        let dia = fecha_inicial.substring(8, 10);
        if (mes > 1) {
          mes = mes * 1;
        } else {
          mes = mes * 1;
        }
        (mes = mes.toString().padStart(2, "0")),
          (fecha_inicial = ano + mes + dia);

        let factor1 = (tasa_interes / 100) * valor;
        let basepot = 1 + tasa_interes / 100;
        let potencia = Math.pow(basepot, -cuotas);
        let factor2 = 1 - potencia;
        let tcuota = (factor1 / factor2).toFixed(0);

        let list = [];
        let capital = parseFloat(valor);
        for (let i = 0; i < cuotas; i++) {
          let interes = (capital * (tasa_interes / 100)).toFixed(0);
          let monto_pago = tcuota;
          let pago_capital = (monto_pago - interes).toFixed(0);

          if (i === cuotas - 1) {
            pago_capital = saldo_capital;
            interes = monto_pago - pago_capital;
          }
          let saldo_capital = capital - pago_capital;
          let fecha = 0;

          if (i == 0) {
            fecha = this.$moment(fecha_inicial)
              .add(i + 0, "months")
              .format("YYYY-MM-DD");
          } else {
            fecha = this.$moment(fecha_inicial)
              .add(i + 0, "months")
              .format("YYYY-MM-DD");
          }

          list.push({
            sdocapital_rep: this.formatNumero(capital),
            pagocapital_rep: this.formatNumero(pago_capital),
            pagointer_rep: this.formatNumero(interes),
            totalcuota_rep: this.formatNumero(monto_pago),
            saldocuota_rep: this.formatNumero(saldo_capital),
            nrocuota_rep: i + 1,
            fechacuota_rep: fecha,
          });

          capital = saldo_capital;
        }

        this.table2.items = list;
      }
    },
    liquidacion_logigas() {
      let valorconex = this.saldo_cx
        ? parseInt(this.saldo_cx.replace(/\,/g, ""))
        : 0;
      let valorinst = this.sdo_inst
        ? parseInt(this.sdo_inst.replace(/\,/g, ""))
        : 0;
      let tasafin = this.form.tasafin ? parseFloat(this.form.tasafin) : 0;

      let valor = valorconex + valorinst;
      let cuotas = parseInt(this.form.cuotas_inst);
      let tasa_interes = tasafin;

      let fecha_inicial = this.form.fecha_financ;
      let ano = fecha_inicial.substring(0, 4);
      let mes = fecha_inicial.substring(5, 7);
      let dia = fecha_inicial.substring(8, 10);

      if (mes > 1) {
        mes = mes - 1;
      } else {
        mes = mes * 1;
      }
      (mes = mes.toString().padStart(2, "0")),
        (fecha_inicial = ano + mes + dia);

      let list = [];
      let capital = parseFloat(valor);
      for (let i = 0; i < cuotas; i++) {
        let pago_capital = (capital / cuotas).toFixed(0);
        let monto_pago = (capital * tasa_interes).toFixed(0);
        let interes = (monto_pago - pago_capital).toFixed(0);

        let saldo_capital = capital - pago_capital;
        let fecha = 0;

        if (i == 0) {
          fecha = this.$moment(fecha_inicial)
            .add(i + 0, "months")
            .format("YYYY-MM-DD");
        } else {
          fecha = this.$moment(fecha_inicial)
            .add(i + 0, "months")
            .format("YYYY-MM-DD");
        }

        list.push({
          sdocapital_rep: this.formatNumero(capital),
          pagocapital_rep: this.formatNumero(pago_capital),
          pagointer_rep: this.formatNumero(interes),
          totalcuota_rep: this.formatNumero(monto_pago),
          saldocuota_rep: this.formatNumero(saldo_capital),
          nrocuota_rep: i + 1,
          fechacuota_rep: fecha,
        });
      }

      this.table.items = list;
    },
    liquidacion_cuota() {
      let cuotames = this.form.valorcuota.replace(/\,/g, "");
      let valor = this.form.valor.replace(/\,/g, "");
      let cuotas = parseInt(this.form.cuotas);
      let tasabase = this.form.tasa.replace(/\./g, "");
      let tasa_interes = parseFloat(this.form.tasa);
      let fecha_inicial = this.form.fecha_financ;

      let capitalmes = valor / cuotas;
      let intermes = cuotames - capitalmes;
      let tcuota = cuotames;

      let list = [];
      let capital = parseFloat(valor);
      for (let i = 0; i < cuotas; i++) {
        // let pago_capital = (capital / cuotas).toFixed(0);
        // let interes = (capital * (tasa_interes / 100)).toFixed(0);
        // let monto_pago = parseFloat(pago_capital) + parseFloat(interes);
        // let saldo_capital = capital - pago_capital;

        let interes = intermes.toFixed(0);
        let monto_pago = tcuota;
        let pago_capital = capitalmes.toFixed(0);
        let saldo_capital = capital - pago_capital;
        let fecha = this.$moment(fecha_inicial)

          .add(i + 1, "months")
          .format("YYYY-MM-DD");
        let nrocuota = i + 1;

        if (cuotas === nrocuota) {
          pago_capital = capital;
          interes = monto_pago - pago_capital;
          saldo_capital = 0;
        }

        list.push({
          nrocuota_rep: i + 1,
          sdocapital_rep: this.formatNumero(capital),
          pagocapital_rep: this.formatNumero(pago_capital),
          pagointer_rep: this.formatNumero(interes),
          totalcuota_rep: this.formatNumero(monto_pago),
          saldocuota_rep: this.formatNumero(saldo_capital),
          fechacuota_rep,
        });

        capital = saldo_capital;
      }

      this.table.items = list;
    },
    cargarCiudades2() {
      var datosEnvio = `${sessionStorage.Sesion}|`;
      post
        .postData({
          url: "Financiero/dlls/CfCiudadJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ciudades_select = data;
          this.ciudades_select.unshift({
            codigo_rep: "0",
            ciudad_rep: "Todas",
            dpto_rep: "Las Ciudades",
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
    format_ciudad: function (val) {
      return `${val.ciudad_rep.trim()} - ${val.dpto_rep.trim()}`;
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
