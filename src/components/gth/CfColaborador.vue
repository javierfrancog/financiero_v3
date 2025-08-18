<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-handsup</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Colaboradores</v-list-item-title
              >
            </v-list-item-content>
            <v-row class="d-flex justify-end">
              <v-btn
                color="orange"
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
              <v-col>
                <v-btn
                  color="green"
                  class="ml-2 white--text px-12"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="print_reporte_excel"
                >
                  Imprimir excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="cargarcontenido()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.anterior"
                  hide-details
                  label="Clonar Año Anterior"
                ></v-switch>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.actsmin"
                  hide-details
                  label="Actualizar Sal. Minimo"
                ></v-switch>
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
              item-key="idcolabora_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.basicocolabora_rep="{ item }">{{
                formatNumero(item.basicocolabora_rep)
              }}</template>

              <template v-slot:item.estadocolabora_rep="{ item }">{{
                item.estadocolabora_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.idcolabora_rep="{ item }">
                {{ parseInt(item.idcolabora_rep) }}
              </template>

              <template v-slot:item.editar="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-account-box-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </template>
              <template v-slot:item.upcontrato="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="up_contrato(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-arrow-up-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir Contrato</span>
                </v-tooltip>
              </template>
              <template v-slot:item.vercontrato="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="item.contrato_rep == 0"
                      @click="get_contrato(item)"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Contrato</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-divider class="mt-4" color="orange"></v-divider>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Configuración</v-tab>
            <v-tab>Devengos/Deducciones</v-tab>
            <v-tab>Depuración Retención</v-tab>
            <v-tab>Documentos HV</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="8">
                    <v-autocomplete
                      label="Colaborador"
                      v-model="form.colabora"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="select_colabora()"
                      :error="errores.colabora"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-btn
                      class="ma-2 px-4 white--text"
                      color="indigo"
                      depressed
                      large
                      @click="open_contrato()"
                      >Generar Contrato</v-btn
                    >
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col sm="6">
                    <v-text-field
                      label="Dirección"
                      hide-details
                      filled
                      disabled
                      v-model="form.direccion"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="2">
                    <v-text-field
                      label="Telefono"
                      disabled
                      hide-details
                      filled
                      v-model="form.telefono"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="4">
                    <v-text-field
                      label="Correo"
                      hide-details
                      disabled
                      filled
                      v-model="form.correo"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaIng"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_ing"
                          label="Fecha Ingreso"
                          append-icon="event"
                          outlined
                          hide-details
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_ing"
                        @input="pickerFechaIng = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaRet"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_ret"
                          label="Fecha Retiro"
                          append-icon="event"
                          outlined
                          hide-details
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_ret"
                        @input="pickerFechaRet = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaNac"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_nac"
                          label="Fecha Nacimiento"
                          append-icon="event"
                          outlined
                          hide-details
                          v-on="on"
                          @change="errores.fecha_nac = false"
                          :error="errores.fecha_nac"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_nac"
                        @input="pickerFechaNac = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-autocomplete
                      label="Cargo"
                      v-model="form.cargo"
                      :items="cargos"
                      :item-text="format_cargo"
                      item-value="llavecargo_rep"
                      hide-details
                      return-object
                      outlined
                      @change="errores.cargo = false"
                      :error="errores.cargo"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Agencia"
                      v-model="form.agencia"
                      :items="agencias"
                      :item-text="format_agencias"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      return-object
                      @change="errores.agencia = false"
                      :error="errores.agencia"
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="6" sm="6">
                    <v-autocomplete
                      label="Tipo empleado"
                      v-model="form.tipoemp"
                      :items="tipoempleado"
                      hide-details
                      outlined
                      @change="select_tipoempl()"
                      return-object
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="5">
                    <v-select
                      :items="tipocont"
                      label="Tipo Contrato"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.tipo_cont"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1 mb-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Período Pago"
                      v-model="form.perpago"
                      :items="periodos"
                      hide-details
                      outlined
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-autocomplete
                      label="Departamento Labores"
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
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="Ciudad donde Labora"
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

                <v-row class="mt-1 ml-1 mr-1 mb-1 d-flex">
                  <v-col class="d-flex" cols="8">
                    <v-autocomplete
                      label="Lider"
                      v-model="form.lider"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col sm="2">
                    <v-text-field
                      label="Basico Mensual"
                      outlined
                      hide-details
                      v-model="form.basico"
                      v-money="money0"
                      ref="input_basico"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="2">
                    <v-text-field
                      label="Tarifa ARL"
                      outlined
                      hide-details
                      v-model="form.arl"
                      v-money="money"
                      ref="input_arl"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="2">
                    <v-switch
                      v-model="form.salminimo"
                      label="Salario Minimo"
                      @change="asignar_minimo()"
                      hide-details
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.integral"
                      label="Salario Integral"
                      hide-details
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.altoriesgo"
                      label="Emp.Alto Riesgo"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-switch
                      v-model="form.cotminima"
                      label="Omite Cotización Minima"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="8" sm="4">
                    <v-select
                      :items="tipocta"
                      label="Tipo Cuenta"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.tipocta"
                      required
                    ></v-select>
                  </v-col>
                  <v-col sm="4">
                    <v-text-field
                      label="Nro Cuenta"
                      outlined
                      hide-details
                      v-model="form.nrocta"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="4">
                    <v-select
                      :items="bancos"
                      label="Banco"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.banco"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="id_Pensión"
                      v-model="form.pension"
                      :items="ruts4"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="id_Eps"
                      v-model="form.eps"
                      :items="ruts4"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="id_Fondo Cesantias"
                      v-model="form.cesantias"
                      :items="ruts4"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="id_Caja"
                      v-model="form.caja"
                      :items="ruts4"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Gasto/Costo"
                      v-model="form.ctagasto"
                      :items="tablaPuc"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="Centro de costos"
                      v-model="form.ccosto"
                      :items="tablaccosto"
                      :item-text="format_ccosto"
                      item-value="llavecentro_cost"
                      hide-details
                      return-object
                      outlined
                      :error="errores.ccosto"
                      @change="errores.ccosto = false"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Devengos/Deducciones"
                      v-model="form.bases"
                      :items="tablaBases"
                      :item-text="format_bases"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex justify-center align-center" cols="2">
                    <v-btn
                      color="blue"
                      fab
                      small
                      depressed
                      class="white--text"
                      @click="add_devengo()"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-card>
                      <v-card-text>
                        <v-simple-table
                          height="350"
                          class="elevation-0"
                          fixed-header
                          v-model="form.tabladev"
                        >
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left" colspan="2">
                                  Descripcion
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in form.listado_devengos"
                                :key="item.llavebase_rep"
                              >
                                <td>{{ item.descrbase_rep }}</td>

                                <td class="d-flex align-center justify-end">
                                  <v-btn
                                    icon
                                    color="blue"
                                    small
                                    @click="editar_devengo(item)"
                                  >
                                    <v-icon
                                      >mdi-file-document-edit-outline</v-icon
                                    >
                                  </v-btn>
                                </td>
                                <td class="d-flex align-center justify-end">
                                  <v-btn
                                    icon
                                    color="red"
                                    small
                                    @click="delete_devengo(item)"
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col sm="3">
                    <v-text-field
                      label="Vlr Interés P.Vivienda"
                      outlined
                      hide-details
                      v-model="form.vivienda"
                      v-money="money0"
                      ref="input_vivienda"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="3">
                    <v-text-field
                      label="Pagos Med.Prepagada"
                      outlined
                      hide-details
                      v-model="form.prepagada"
                      v-money="money0"
                      ref="input_prepagada"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="3">
                    <v-text-field
                      label="Pagos Seguros Salud"
                      outlined
                      hide-details
                      v-model="form.ssalud"
                      v-money="money0"
                      ref="input_ssalud"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="3">
                    <v-text-field
                      label="Dependientes Económicos"
                      outlined
                      hide-details
                      v-model="form.depend"
                      v-money="money0"
                      ref="input_depend"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1 d-flex">
                  <v-col cols="12">
                    <table width="100%">
                      <thead>
                        <tr>
                          <th>Documento</th>
                          <th>Datos</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td rowspan="5" style="text-align: center">
                            Documentos Basicos
                          </td>
                          <td style="text-align: left">Hoja de Vida</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(1)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(1)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr v-for="el in documentos.hojaVida" :key="el">
                          <td>{{ el.txt }}</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(el.index)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(el.index)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>

                        <tr>
                          <td rowspan="1" style="text-align: center">
                            Estudios realizados
                          </td>
                          <td style="text-align: left">Soportes Academicos</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(5)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(5)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr
                          v-for="el in documentos.estudiosRealizados"
                          :key="el"
                        >
                          <td>{{ el.txt }}</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(el.index)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(el.index)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>

                        <tr>
                          <td rowspan="1" style="text-align: center">
                            Experiencia
                          </td>
                          <td style="text-align: left">Referencia Laborales</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(11)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(11)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr v-for="el in documentos.experiencia" :key="el">
                          <td>{{ el.txt }}</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(el.index)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(el.index)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr>
                          <td rowspan="2" style="text-align: center">
                            Legales
                          </td>
                          <td style="text-align: left">Soporte RETHUS</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(13)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(13)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr v-for="el in documentos.legales" :key="el">
                          <td>{{ el.txt }}</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(el.index)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(el.index)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr>
                          <td rowspan="3" style="text-align: center">
                            Información Seguridad
                          </td>
                          <td style="text-align: left">
                            Antecedentes Judiciales
                          </td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(15)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(15)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr
                          v-for="el in documentos.informacionSeguridad"
                          :key="el"
                        >
                          <td>{{ el.txt }}</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(el.index)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(el.index)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>

                        <tr>
                          <td rowspan="6" style="text-align: center">
                            Afiliaciones Seguridad Social
                          </td>
                          <td style="text-align: left">Afiliación ARL</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(18)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(18)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr v-for="el in documentos.infoafiliacion" :key="el">
                          <td>{{ el.txt }}</td>
                          <td style="text-align: center">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="blue accent-3"
                                  small
                                  icon
                                  v-on="on"
                                  @click="cargue_file(el.index)"
                                >
                                  <v-icon>mdi-upload</v-icon>
                                </v-btn>
                              </template>
                              <span>Subir PDF</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  color="red darken-4"
                                  fab
                                  small
                                  icon
                                  v-on="on"
                                  @click="down_file(el.index)"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <span>Ver PDF</span>
                            </v-tooltip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider class="mt-4" color="orange"></v-divider>

          <v-row justify="center">
            <v-col class="d-flex" cols="3">
              <v-switch
                v-model="form.exsalud"
                label="Excluído Salud"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-switch v-model="form.ops" label="Empleado OPS"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="3">
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
                    @click="get_ruts3(), get_ruts4(), get_puc()"
                    depressed
                  >
                    <v-icon size="30" center>mdi-autorenew</v-icon>
                  </v-btn>
                </template>
                <span>Actualiza Tablas</span>
              </v-tooltip>
            </v-col>

            <v-col class="justify-end d-flex align-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="orange accent-4 white--text"
                    class="mr-2"
                    @click="get_check()"
                    depressed
                  >
                    <v-icon size="30" center>mdi-check</v-icon>
                  </v-btn>
                </template>
                <span>Imprimir Check</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false"
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
    <v-dialog v-model="dialogoEditar.estado" max-width="600" persistent>
      <v-card :loading="dialogoEditar.load" :disabled="dialogoEditar.load">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo_devengo }}</span>
        </v-card-title>

        <!-- <v-card-title class="headline">Fijar Valores por periodo</v-card-title> -->

        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Cantidad"
                outlined
                hide-details
                v-model="dialogoEditar.valores.cantidad_rep"
                v-money="money0"
                ref="input_cantidad"
                :disabled="dialogoEditar.valores.editcant_rep == '0'"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Valor"
                outlined
                hide-details
                v-model="dialogoEditar.valores.valor_rep"
                v-money="money0"
                :disabled="dialogoEditar.valores.editvlr_rep == '0'"
                ref="input_valor"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            @click="cancelar_modificar"
            >Cancelar</v-btn
          >
          <v-btn
            color="green"
            class="white--text"
            depressed
            @click="cerrar_modificar"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoCargue.estado" persistent max-width="600px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogoCargue.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8">
              <v-file-input
                label="Buscar PDF"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogoCargue.model"
                id="archivo_pdf"
              ></v-file-input>
            </v-col>
          </v-row>

          <v-divider color="#FF6F00"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogoCargue.estado = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4 white--text"
            color="indigo"
            depressed
            large
            :loading="load_guardar"
            @click="up_file()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoContrato.estado" persistent max-width="600px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogoContrato.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="d-flex justify-center">
            <v-col cols="4">
              <v-text-field
                label="Nro Contrato"
                outlined
                hide-details
                v-model="form.nroctto"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-btn
              class="ma-2 px-4 white--text"
              color="purple"
              depressed
              large
              @click="generar_contrato()"
              >Grabar Contrato</v-btn
            >
            <!-- <v-btn
              class="ma-2 px-4 white--text"
              color="purple"
              depressed
              large
              @click="generar_contrato()"
              >Contrato para firmas</v-btn
            >
 -->
          </v-row>

          <v-divider class="mt-4" color="#FF6F00"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4 white--text"
            color="red"
            depressed
            large
            @click="dialogoContrato.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogo_archivo.estado"
      width="600"
      max-width="90%"
      persistent
    >
      <v-card
        :loading="dialogo_archivo.loader"
        :disabled="dialogo_archivo.loader"
      >
        <v-card-title>Adjuntar Contrato Firmado</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-file-input
                label="Buscar PDF"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept="application/pdf"
                v-model="dialogo_archivo.model"
                id="archivo_pdf"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
          <v-btn
            depressed
            color="blue darken-2"
            class="white--text px-12 mx-5"
            :loading="load_upfile"
            @click="up_file_drive"
            >Subir archivo</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { listaChequeo, contratoTrabajo } from "../../_formatos_gth.js";

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
      dialogoContrato: {
        estado: false,
        titulo: null,
      },
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      dialogoCargue: {
        estado: false,
        titulo: null,
        model: null,
        loader: false,
        ruta: null,

        tipo: null,
      },

      error: {
        rut: false,
      },

      dialog: true,
      valid: false,
      pickerFechaRet: false,
      pickerFechaIng: false,
      pickerFechaNac: false,
      singleExpand: true,
      salario_min: "0",
      item_select: null,
      item_pdf: null,
      expanded: [],
      empresa: [],
      data_select: [],
      ruts3: [],
      ruts4: [],
      rutsadmon: [],
      contenido: [],
      cargos: [],
      tablaccosto: [],
      tablaPuc: [],
      tablaBases: [],
      agencias: [],
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],
      load_guardar: false,
      load_upfile: false,
      dialogoEditar: {
        estado: false,
        load: false,
        valores: {},
        llave: null,
      },

      search: "",
      form: {
        basico: "0",
        listado_devengos: [],
        tabladev: [],
      },
      headers: [
        { text: "Editar", value: "editar", align: "center" },
        { text: "Subir Contrato", value: "upcontrato", align: "center" },
        { text: "Pdf Contrato", value: "vercontrato", align: "center" },

        {
          text: "Primer Apellido",
          align: "center",
          value: "Apellido1colabora_rep",
        },
        {
          text: "Segundo Apellido",
          align: "left",
          value: "Apellido2colabora_rep",
        },
        { text: "Nombres", align: "left", value: "nombrescolabora_rep" },
        { text: "Cargo", align: "left", value: "nombrecargo_rep" },
        { text: "Basico", align: "center", value: "basicocolabora_rep" },
        { text: "Agencia", align: "center", value: "descripagenc_agc" },
        { text: "Contrato", align: "center", value: "contrato_rep" },
        { text: "Id", align: "center", value: "idcolabora_rep" },

        { text: "Estado", align: "center", value: "estadocolabora_rep" },
      ],
      periodos: [
        { text: "Mensual", value: 1 },
        { text: "Quincenal", value: 2 },
        { text: "Semanal", value: 3 },
      ],
      tipoempleado: [
        { text: "Dependiente", value: 1 },
        { text: "Servicio Domestico", value: 2 },
        { text: "Madre Comunitaria", value: 4 },
        { text: "Aprendices Sena Etapa Lectiva", value: 12 },
        { text: "Aprendices Sena Etapa Productiva", value: 19 },
        { text: "Funcionario Publico sin tope de IBC", value: 18 },
        { text: "Estudiante Postgrado en Salud", value: 21 },
        { text: "Profesor Establecimiento Particular", value: 22 },
        { text: "Estudiante Aportes solo Riesgos Laborales", value: 23 },
        { text: "Dependiente Entidades publicas regimen salud", value: 30 },
        { text: "Cooperados o Cooperativas Trabajo Asociado", value: 31 },
        { text: "Trabajador Dependiente Entidad SGP", value: 47 },
        { text: "Trabajador Tiempo Parcial", value: 51 },
        { text: "Pre Pensionado Aportante Voluntario a Salud", value: 56 },
        { text: "Estudiante Practicas Entidad Publica", value: 58 },
      ],
      tipocont: [
        { text: "Termino Fijo", value: 1 },
        { text: "Termino Indefinido", value: 2 },
        { text: "Obra o labor", value: 3 },
        { text: "Aprendizaje", value: 4 },
        { text: "Prácticas o Pasantías", value: 5 },
      ],
      tipocta: [
        { text: "Ahorros", value: 0 },
        { text: "Corriente", value: 1 },
        { text: "Nequi", value: 5 },
        { text: "Ahorro a la Mano", value: 6 },
        { text: "Daviplata", value: 7 },
        { text: "Dale", value: 8 },
        { text: "Efectivo", value: 9 },
      ],
      bancos: [
        { text: "Banco de Bogotá", value: 1 },
        { text: "Banco Popular", value: 2 },
        { text: "Bancolombia", value: 7 },
        { text: "BBVA Colombia", value: 13 },
        { text: "Scotiabank - Red Multibanca Colpatria S. A", value: 19 },
        { text: "Banco Caja Social", value: 32 },
        { text: "Banco Agrario", value: 40 },
        { text: "Banco Davivienda", value: 51 },
        { text: "Banco AV Villas", value: 52 },
        { text: "Nequi", value: 98 },
        { text: "Efectivo", value: 99 },
      ],

      errores: {
        codigo: false,
        ccosto: false,
        colabora: false,
        cargo: false,
        descripcion: false,
        estado: false,
        anoselect: false,
        fecha_nac: false,
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

      documentos: {
        hojaVida: [
          { txt: "Copia de cedula de ciudadanía al 150 %", index: 2 },
          { txt: "Copia libreta militar", index: 3 },
          { txt: "Copia licencia de conducir", index: 4 },
          { txt: "Actualización Datos", index: 22 },
        ],
        estudiosRealizados: [
          // { txt: "Soportes Academicos", index: 6 },
          // { txt: "Estudios realizados Tecnólogo", index: 7 },
          // { txt: "Técnico", index: 8 },
          // { txt: "Cursos aplicables al cargo", index: 9 },
          // { txt: "Pregrado - Posgrado - Diplomados", index: 10 },
        ],
        // experiencia: [{ txt: "Referencias Personales", index: 12 }],
        legales: [
          { txt: "Soporte Resolución de la Secretaria de Salud", index: 14 },
        ],
        informacionSeguridad: [
          { txt: "Antecedentes Disciplinario", index: 16 },
          { txt: "Antecedentes Fiscales", index: 17 },
        ],
        infoafiliacion: [
          { txt: "Afiliación Salud", index: 19 },
          { txt: "Afiliación Pensión", index: 20 },
          { txt: "Afiliación Caja", index: 21 },
        ],
      },
    };
  },
  created() {
    this.form.actsmin = false;
    this.cargar_empresa();
    this.cargar_años();
    this.get_puc();
    this.get_cargos();
    this.get_ccostos();
    this.get_ruts3();
    this.get_ruts4();
    this.get_basico();
    this.cargarTablaAg();
    this.cargarcontenido();
    this.cargarCiudades();
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
    select_tipoempl() {
      let devengos = [];

      let tipo = this.form.tipoemp.value;
      if (tipo == 12 || tipo == 19) {
        devengos = [
          { nombre: "Sueldo Basico", valor: "1001" },
          { nombre: "Auxilio de Trans", valor: "1002" },
          { nombre: "Deduccion Salud", valor: "2001" },
        ];
      } else {
        devengos = [
          { nombre: "Sueldo Basico", valor: "1001" },
          { nombre: "Auxilio de Trans", valor: "1002" },
          { nombre: "Deduccion Salud", valor: "2001" },
          { nombre: "Deduccion Pension", valor: "2002" },
        ];
      }
      this.listado_devengos = [];
      this.form.tabladev = null;
      this.form.listado_devengos = [];

      devengos.forEach((el) => {
        let busqueda = this.tablaBases.find(
          (base) => base.llavebase_rep == el.valor
        );
        if (busqueda) {
          this.form.listado_devengos.push(busqueda);
        }
      });
    },

    up_contrato(item) {
      this.dialogo_archivo.estado = true;
      this.item_select = item;
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
    },
    async up_file_drive() {
      let file = this.dialogo_archivo.model;
      this.load_upfile = true;
      if (!file) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        let empresa = parseFloat(this.empresa.id_empr);
        let consecutivo = this.item_select.contrato_rep;
        let nombre_pdf = empresa + "_CONTRATO_" + consecutivo + ".pdf";
        let data = new FormData();
        data.append("nombre_pdf", nombre_pdf);
        data.append("file", this.dialogo_archivo.model);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/cargue_gth.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.dialogo_archivo.loader = false;
        this.dialogo_archivo.estado = false;
        this.load_upfile = false;
        this.cancelar_subida();

        this.$emit("snack", {
          color: "success",
          text: "Contrato Guardado Correctamente",
          estado: true,
        });
      }
    },
    async get_contrato(item) {
      let empresa = parseFloat(this.empresa.id_empr);
      let consecutivo = item.contrato_rep;
      let idFile = empresa + "_CONTRATO_" + consecutivo + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/GTH/" + idFile;

      // window.open(url, "_blank").focus();

      const timestamp = new Date().getTime(); // Genera un timestamp único
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank"); // Abre el PDF
    },
    generar_contrato() {
      var periodo = this.form.periodo_cargue;
      let tipo = parseFloat(this.item_select.tipocont_rep);
      let colabora = parseFloat(this.item_select.idcolabora_rep);
      let numero = parseFloat(this.form.nroctto);
      post
        .postData({
          url: "Financiero/dlls/CfContratogth.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            numero +
            "|" +
            colabora +
            "|" +
            periodo +
            "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.cargarcontenido();
          this.dialogoContrato.estado = false;
        })
        .catch((err) => {
          // console.log(err.Mensaje[0].msg)
          let error_msg = err.Mensaje[0].msg;
          this.$emit("snack", {
            color: "error",
            text: error_msg,
            estado: true,
          });
        });
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
    get_check() {
      //lo coloca en esta funcion
      let data_impresion;
      let empresa = this.empresa;

      data_impresion = {
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
        listaChequeo(data_impresion).then(() => {
          console.log("Impresion terminada");
        });
      });
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    down_file(item) {
      let empresa = parseFloat(this.empresa.id_empr);
      let consec = parseFloat(this.item_select.idcolabora_rep);
      let tipodoc = item;
      let nombre_pdf = empresa + "_HV_" + consec + "_" + tipodoc + ".pdf";
      const url =
        "https://storage.googleapis.com/documentos_titan/GTH/" + nombre_pdf;

      const timestamp = new Date().getTime();
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank");

      // "https://storage.googleapis.com/documentos_titan/GTH/" + nombre_pdf;
    },
    cargue_file(item) {
      this.item_pdf = item;
      this.dialogoCargue.model = null;
      this.dialogoCargue.estado = true;
      this.dialogoCargue.titulo = "Cargue Archivo";
    },
    open_contrato() {
      this.dialogoContrato.estado = true;
      this.dialogoContrato.titulo =
        "Contrato de trabajo " +
        this.item_select.nombrescolabora_rep.trim() +
        this.item_select.Apellido1colabora_rep.trim();
      this.form.nroctto = null;
    },
    async up_file() {
      if (!this.dialogoCargue.model) {
        this.send_error("Seleccione un Pdf para Cargar!");
      } else {
        // this.card_estado = true;
        this.load_guardar = true;
        // this.loader = true;
        let session = sessionStorage.Sesion;
        let agencia = sessionStorage.Sede;
        let empresa = parseFloat(this.empresa.id_empr);
        let cargue_pdf = this.dialogoCargue.model.name;
        let consec = parseFloat(this.item_select.idcolabora_rep);
        let tipodoc = 1;
        let item = this.item_pdf;
        let nombre_pdf = empresa + "_HV_" + consec + "_" + item + ".pdf";

        let data = new FormData();
        data.append("empresa", empresa);
        data.append("session", session);
        data.append("cargue_pdf", cargue_pdf);
        data.append("nombre_pdf", nombre_pdf);
        data.append("tipodoc", tipodoc);
        data.append("item", item);
        data.append("consecutivo", consec);
        data.append("agencia", agencia);
        data.append("file", this.dialogoCargue.model);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/cargue_gth.php",
          // "https://server1ts.net//financiero/inc/cargue.drive.gth.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.card_estado = false;
        this.dialogoCargue.estado = false;
        this.dialogoCargue.model = "";
        this.load_guardar = false;

        this.$emit("snack", {
          color: "success",
          text: "Soporte Guardado Correctamente",
          estado: true,
        });
        // this.dialogo.estado = false;
        // this.loader = false;
      }
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;

      this.form.periodo_cargue = anioActual;
    },
    delete_devengo(item) {
      let index = this.form.listado_devengos.indexOf(item);
      this.form.listado_devengos.splice(index, 1);
    },
    add_devengo() {
      var item = this.form.bases;
      if (item) {
        let buscar = this.form.listado_devengos.find(
          (el) => el.llavebase_rep == item.llavebase_rep
        );

        if (!buscar) {
          this.form.listado_devengos.push(item);
          this.form.bases = null;
        } else {
          this.send_error("El item ya fue registrado");
        }
      } else {
        this.send_error("Debes seleccionar un item");
      }
    },
    editar_item(data) {
      this.form.eliminar = false;
      this.data_select = data;
      var item = JSON.parse(JSON.stringify(data));
      this.item_select = item;
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.listado_devengos = [];
      this.form.tabladev = null;
      this.form.listado_devengos = [];
      this.salario_min = item.minimoano_rep.replace(/\,/g, "").trim();
      this.form.departamento = item.ciudadctrto_rep.substring(0, 2);
      this.get_municipios();

      var busqueda_select = this.periodos.find(
        (el) => el.value == item.perpago_rep
      );
      this.form.perpago = busqueda_select;
      this.form.ciudad = item.ciudadctrto_rep;

      var busqueda_colaborador = this.ruts3.find(
        (el) => el.identificacion_rut == item.idcolabora_rep
      );
      this.form.colabora = busqueda_colaborador;

      var busqueda_lider = this.ruts3.find(
        (el) => el.identificacion_rut == item.lider_rep
      );
      this.form.lider = busqueda_lider;

      var busqueda_cargo = this.cargos.find(
        (el) => el.llavecargo_rep == item.cargocolabora_rep
      );
      this.form.cargo = busqueda_cargo;

      var busqueda_tipoemp = this.tipoempleado.find(
        (el) => el.value == item.tipoempl_rep
      );
      this.form.tipoemp = busqueda_tipoemp;

      var busqueda_tipocta = this.tipocta.find(
        (el) => el.value == item.tipocta_rep
      );
      this.form.tipocta = busqueda_tipocta;
      this.form.nrocta = item.nrocta_rep.trim();

      var busqueda_banco = this.bancos.find((el) => el.value == item.banco_rep);
      this.form.banco = busqueda_banco;

      this.form.altoriesgo = item.altoriesgo_rep == "1" ? true : false;
      this.form.cotminima = item.omiteminss_rep == "1" ? true : false;
      this.form.integral = item.integral_rep == "1" ? true : false;
      this.form.salminimo = item.salminimo_rep == "1" ? true : false;
      this.form.exsalud = item.exsalud_rep == "1" ? true : false;
      this.form.ops = item.ops_rep == "1" ? true : false;

      var busqueda_tipocont = this.tipocont.find(
        (el) => el.value == item.tipocont_rep
      );
      this.form.tipo_cont = busqueda_tipocont;

      var fechaing_format = this.$moment(item.fechaingcolabora_rep).format(
        "YYYY-MM-DD"
      );
      var fecharet_format =
        parseInt(item.fecharetcolabora_rep) == 0
          ? null
          : this.$moment(item.fecharetcolabora_rep).format("YYYY-MM-DD");
      this.form.fecha_ing = fechaing_format;
      this.form.fecha_ret = fecharet_format;
      this.form.fecha_nac = item.fechanacim_rep;
      this.form.direccion = item.direcccolabora_rep;
      this.form.telefono = item.telefonocolabora_rep;
      this.form.correo = item.correocolabora_rep;

      this.form.basico = parseInt(item.basicocolabora_rep);
      if (this.$refs.input_basico)
        this.$refs.input_basico.$el.getElementsByTagName("input")[0].value =
          this.form.basico;

      this.form.arl = item.arlcolabora_rep;
      if (this.$refs.input_arl)
        this.$refs.input_arl.$el.getElementsByTagName("input")[0].value =
          this.form.arl;

      this.form.vivienda = parseInt(item.viviendacolabora_rep);
      if (this.$refs.input_vivienda)
        this.$refs.input_vivienda.$el.getElementsByTagName("input")[0].value =
          this.form.vivienda;

      this.form.prepagada = parseInt(item.prepagadacolabora_rep);
      if (this.$refs.input_prepagada)
        this.$refs.input_prepagada.$el.getElementsByTagName("input")[0].value =
          this.form.prepagada;

      this.form.ssalud = parseInt(item.ssaludcolabora_rep);
      if (this.$refs.input_ssalud)
        this.$refs.input_ssalud.$el.getElementsByTagName("input")[0].value =
          this.form.ssalud;

      this.form.depend = parseInt(item.dependiente_rep);
      if (this.$refs.input_depend)
        this.$refs.input_depend.$el.getElementsByTagName("input")[0].value =
          this.form.depend;

      var busqueda_pension = this.ruts4.find(
        (el) => el.identificacion_rut == item.pensioncolabora_rep
      );
      this.form.pension = busqueda_pension;

      var busqueda_eps = this.ruts4.find(
        (el) => el.identificacion_rut == item.epscolabora_rep
      );
      this.form.eps = busqueda_eps;

      var busqueda_cesantias = this.ruts4.find(
        (el) => el.identificacion_rut == item.cesantiacolabora_rep
      );
      this.form.cesantias = busqueda_cesantias;

      var busqueda_caja = this.ruts4.find(
        (el) => el.identificacion_rut == item.cajacolabora_rep
      );
      this.form.caja = busqueda_caja;

      var busqueda_cta = this.tablaPuc.find(
        (el) => el.cod_puc.trim() == item.ctagtocolabora_rep.trim()
      );
      this.form.ctagasto = busqueda_cta;

      var busqueda_costo = this.tablaccosto.find(
        (el) => el.llavecentro_cost == item.ccostocolabora_rep
      );
      this.form.ccosto = busqueda_costo;

      var busqueda_agencia = this.agencias.find(
        (el) => el.codigo_agc == item.agenciacolabora_rep
      );
      this.form.agencia = busqueda_agencia;

      this.form.estado = item.estadocargo_rep == "1" ? true : false;

      var devengos = item.basescolabora_rep;

      devengos.forEach((el) => {
        let busqueda = this.tablaBases.find(
          (base) => base.llavebase_rep == el.codigo_rep
        );
        if (busqueda) {
          el.vlrfijo_rep = el.vlrfijo_rep ? el.vlrfijo_rep : 0;
          busqueda.cantidad_rep = el.cantfijo_rep;
          busqueda.valor_rep = this.formatNumero(el.vlrfijo_rep);
          busqueda.cajacantidad_rep = el.cantfijo_rep;
          busqueda.cajavlr_rep = this.formatNumero(el.vlrfijo_rep);
          this.form.listado_devengos.push(busqueda);
        }
      });
    },
    asignar_minimo() {
      this.form.basico = this.salario_min;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      let items = data.listado_devengos;
      if (data.eliminar) {
        data.fecha_nac = "2000-10-01";
        data.tipoemp = 1;
        data.tipocta = 1;
        data.tipo_cont = 1;
        data.perpago = 1;
      }

      if (!data.colabora) {
        this.send_error("Debe seleccionar un colaborador");
      } else if (!items.length) {
        this.send_error("Los devengos no pueden estar vacíos");
      } else if (!data.fecha_nac) {
        this.errores.fecha_nac = true;
        this.send_error("Fecha de Nacimiento Obligatoria!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Debe seleccionar una ciudad");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var periodo = data.periodo_cargue;
      var colabora = data.colabora ? data.colabora.identificacion_rut : "0";
      let lider = data.lider ? data.lider.identificacion_rut : "0";
      var cargo = data.cargo.llavecargo_rep || "0";
      var agencia = data.agencia.codigo_agc || "0";

      var fechaing = data.fecha_ing ? data.fecha_ing.replace(/\-/g, "") : "";
      var fecharet = data.fecha_ret
        ? data.fecha_ret.indexOf("Invalid date") == 0
          ? "0"
          : data.fecha_ret.replace(/\-/g, "")
        : "0";
      var fechanac = data.fecha_nac ? data.fecha_nac.replace(/\-/g, "") : "";
      var valor1 = data.basico
        ? data.basico.toString().replace(/\,/g, "")
        : "0";
      var basico = parseInt(valor1);
      var arl = data.arl || "0";
      var pension = data.pension ? data.pension.identificacion_rut : "0";
      var eps = data.eps ? data.eps.identificacion_rut : "0";
      var cesantias = data.cesantias ? data.cesantias.identificacion_rut : "0";
      var caja = data.caja ? data.caja.identificacion_rut : "0";
      var ctagasto = data.ctagasto ? data.ctagasto.cod_puc : "0";
      var ccosto = data.ccosto ? data.ccosto.llavecentro_cost : "0";
      var valor2 = data.vivienda
        ? data.vivienda.toString().replace(/\,/g, "")
        : "0";
      var vivienda = parseInt(valor2);
      var valor3 = data.prepagada
        ? data.prepagada.toString().replace(/\,/g, "")
        : "0";
      var prepagada = parseInt(valor3);
      var valor4 = data.ssalud
        ? data.ssalud.toString().replace(/\,/g, "")
        : "0";
      var ssalud = parseInt(valor4);

      var valor5 = data.depend
        ? data.depend.toString().replace(/\,/g, "")
        : "0";
      var dependiente = parseInt(valor5);

      var tipoemp = data.tipoemp ? data.tipoemp.value : "0";
      var integral = data.integral ? "1" : "0";
      var minimo = data.salminimo ? "1" : "0";
      var altoriesgo = data.altoriesgo ? "1" : "0";
      var cotminima = data.cotminima ? "1" : "0";
      var tipocta = data.tipocta ? data.tipocta.value : "0";
      var tipocont = data.tipo_cont ? data.tipo_cont.value : "0";
      var nrocta = data.nrocta;
      var banco = data.banco ? data.banco.value : "0";
      var ciudadctto = data.ciudad;
      var perpago = data.perpago.value;

      var estado = data.estado ? "1" : "0";
      var exsalud = data.exsalud ? "1" : "0";
      var ops = data.ops ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      this.get_plano(data).then((plano) => {
        let datos = {
          url: "Financiero/dlls/Cfcolabora.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            colabora +
            "|" +
            cargo +
            "|" +
            agencia +
            "|" +
            fechaing +
            "|" +
            fecharet +
            "|" +
            basico +
            "|" +
            arl +
            "." +
            "|" +
            pension +
            "|" +
            eps +
            "|" +
            caja +
            "|" +
            ctagasto +
            "|" +
            ccosto +
            "|" +
            vivienda +
            "|" +
            prepagada +
            "|" +
            ssalud +
            "|" +
            dependiente +
            "|" +
            tipoemp +
            "|" +
            integral +
            "|" +
            altoriesgo +
            "|" +
            tipocta +
            "|" +
            nrocta +
            "|" +
            banco +
            "|" +
            tipocont +
            "|" +
            estado +
            "|" +
            eliminar +
            "|" +
            plano +
            "|" +
            periodo +
            "|" +
            minimo +
            "|" +
            exsalud +
            "|" +
            ops +
            "|" +
            cotminima +
            "|" +
            cesantias +
            "|" +
            fechanac +
            "|" +
            ciudadctto +
            "|" +
            perpago +
            "|" +
            lider +
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
            this.cargarcontenido();
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al grabar Registro");
          });
      });
    },
    get_plano(data) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var detalle = data.listado_devengos;
        var colabora = data.colabora ? data.colabora : "0";
        var nuevo = [];

        detalle.forEach((el) => {
          let valor = el.valor_rep || "0";
          nuevo.push({
            colaborador: colabora.identificacion_rut,
            llavebase_rep: el.llavebase_rep,
            cantidad_rep: el.cantidad_rep || "0",
            valor_rep: parseFloat(valor.toString().replace(/\,/g, "")),
          });
        });

        var formData = new FormData();
        formData.append("tipo", "gthDevengos");
        formData.append("data", JSON.stringify(nuevo));
        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    agregar_item() {
      if (!this.form.periodo_cargue) {
        this.errores.anoselect = true;
        this.send_error("Seleccione un año");
      } else {
        this.form.estado = 0;
        this.dialogo.titulo = "Agregar nuevo Registro";
        this.dialogo.estado = true;
        this.dialogo.tipo = 0;
        this.form.colabora = null;
        this.form.direccion = null;
        this.form.telefono = null;
        this.form.correo = null;
        this.form.fecha_ing = null;
        this.form.fecha_ret = null;
        this.form.fecha_nac = null;
        this.form.cargo = null;
        this.form.agencia = null;
        this.form.tipoemp = null;
        this.form.tipo_cont = null;
        this.form.lider = null;
        this.form.basico = null;
        this.form.arl = null;
        this.form.salminimo = null;
        this.form.altoriesgo = null;
        this.form.cotminima = null;
        this.form.tipocta = null;
        this.form.nrocta = null;
        this.form.banco = null;
        this.form.pension = null;
        this.form.eps = null;
        this.form.cesantias = null;
        this.form.caja = null;
        this.form.ccosto = null;
        this.listado_devengos = [];
        this.form.tabladev = null;
        this.form.listado_devengos = [];
      }
    },
    select_colabora() {
      this.form.direccion = this.form.colabora.direccion_rut;
      this.form.telefono = this.form.colabora.telefono_rut;
      this.form.correo = this.form.colabora.correo_rut;
      this.errores.colabora = false;
    },
    init_form() {
      this.form = {
        eliminar: false,
        listado_devengos: [],
      };

      if (this.$refs.input_basico)
        this.$refs.input_basico.$el.getElementsByTagName("input")[0].value =
          "0";

      if (this.$refs.input_arl)
        this.$refs.input_arl.$el.getElementsByTagName("input")[0].value = "0";
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      this.loader = true;
      var periodo = this.form.periodo_cargue;
      var anterior = this.form.anterior ? "1" : "0";
      let actsmin = this.form.actsmin ? "1" : "0";

      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            "0" +
            "|" +
            anterior +
            "|" +
            actsmin +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.form.actsmin = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    format_cargo: function (val) {
      return `${val.llavecargo_rep + " - " + val.descrcargo_rep} `;
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_bases: function (val) {
      return `${val.llavebase_rep} - ${val.descrbase_rep}`;
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar colaboradores",
            estado: true,
          });
        });
    },
    get_ruts4() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 4 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts4 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Administradoras",
            estado: true,
          });
        });
    },
    get_cargos() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfCargosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargos = JSON.parse(JSON.stringify(data));
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
    get_ccostos: function () {
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
    get_puc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "5" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    get_basico: function () {
      post
        .postData({
          url: "Financiero/dlls/CfGthbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Bases Gth");
        });
    },
    editar_devengo(item) {
      this.dialogoEditar.estado = true;

      this.dialogoEditar.llave = item.llavebase_rep;
      // this.dialogo.titulo = "Fijar Valores por periodo\n"  + item.descrbase_rep;
      this.dialogo.titulo_devengo = item.descrbase_rep;

      let valor = item.cajavlr_rep.replace(/\,/g, "") || 0;
      this.dialogoEditar.valores.valor_rep = valor;
      this.dialogoEditar.valores.cantidad_rep = item.cajacantidad_rep;
    },
    cancelar_modificar() {
      this.dialogoEditar.estado = false;
      this.dialogoEditar.valores.cantidad_rep = "0";
      this.dialogoEditar.valores.valor_rep = "0";
    },
    cerrar_modificar() {
      let { valores, llave } = this.dialogoEditar;

      let cantidad = valores.cantidad_rep || 0;
      let valor_rep = valores.valor_rep.replace(/\,/g, "") || 0;

      let index = this.form.listado_devengos.findIndex(
        (el) => el.llavebase_rep === llave
      );
      if (index >= 0) {
        this.form.listado_devengos[index].cantidad_rep = cantidad;
        this.form.listado_devengos[index].valor_rep = valor_rep;
      }

      this.dialogoEditar.estado = false;
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    print_reporte_excel() {
      var data = this.contenido;
      var data_parse = data;
      data_parse.pop();

      var columnas = [
        {
          title: "Id_Colaborador",
          value: "idcolabora_rep",
        },
        {
          title: "Primer Apellido",
          value: "Apellido1colabora_rep",
        },
        {
          title: "Segundo Apellido",
          value: "Apellido2colabora_rep",
        },
        {
          title: "Nombres",
          value: "nombrescolabora_rep",
        },
        {
          title: "Cargo",
          value: "nombrecargo_rep",
        },
        {
          title: "Agencia",
          value: "descripagenc_agc",
        },
        {
          title: "Contrato",
          value: "contrato_rep",
        },

        {
          title: "Dirección",
          value: "direcccolabora_rep",
          format: "string",
        },
        {
          title: "Correo",
          value: "correocolabora_rep",
          format: "string",
        },
        {
          title: "Teléfono",
          value: "telefonocolabora_rep",
          format: "number",
        },

        {
          title: "Fecha Nacimiento",
          value: "fechanacim_rep",
          format: "string",
        },

        {
          title: "Fecha Ingreso",
          value: "fechaingcolabora_rep",
          format: "date",
        },
        {
          title: "Fecha Retiro",
          value: "fecharetcolabora_rep",
          format: "date",
        },

        {
          title: "Basico",
          value: "basicocolabora_rep",
          format: "number",
        },
        {
          title: "Pension",
          value: "descrpension_rep",
          format: "string",
        },
        {
          title: "Salud",
          value: "descrsalud_rep",
          format: "string",
        },
        {
          title: "Caja",
          value: "descrcaja_rep",
          format: "string",
        },

        {
          title: "% Arl",
          value: "arlcolabora_rep",
          format: "number",
        },
      ];
      var header_format = [
        { text: "REPORTE COLABORADORES", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte colaboradores",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `COLABORADORES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
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
