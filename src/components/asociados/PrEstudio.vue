<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-male-board-poll</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Estudio de Créditos</v-list-item-title
              >
            </v-list-item-content>
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
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.estado_rep="{ item }">
                {{ item.estado_rep == "2" ? "Con Estudio" : "Pendiente" }}
              </template>

              <template v-slot:item.imprimir="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
                </v-tooltip>
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="orange">
            <v-tab>Info Básica</v-tab>
            <v-tab>Saldo Asociado</v-tab>
            <v-tab>Info Codeudor</v-tab>
            <v-tab>Deuda Asociado</v-tab>
            <v-tab>Estudio</v-tab>
            <v-tab>Amortización</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" class="mt-1">
            <!-- BASICA -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col col="6">
                    <v-menu
                      ref="menu"
                      v-model="pickerFecha_reg"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Fecha Registro"
                          outlined
                          v-model="form.fechareg"
                          disabled
                          hide-details
                          v-on="on"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechareg"
                        @input="fechareg = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Consecutivo"
                      clearable
                      outlined
                      disabled
                      type="text"
                      v-model="form.consecutivo"
                      hide-details
                      @input="errores.consecutivo = false"
                      :error="errores.consecutivo"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="id Solicitante"
                      clearable
                      outlined
                      disabled
                      type="text"
                      v-model="form.idsolicita"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Nombre"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.nombre"
                      :error="errores.nombre"
                      @input="
                        errores.nombre = false;
                        form.nombre = form.nombre.toUpperCase();
                      "
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Compañia"
                      clearable
                      outlined
                      v-model="form.compañia"
                      hide-details
                      @input="errores.compañia = false"
                      :error="errores.compañia"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFecha_inge"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.ingEntidad"
                          label="Fecha Ingreso"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.ingEntidad"
                          @input="errores.ingEntidad = false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.ingEntidad"
                        @input="
                          pickerFecha_inge = false;
                          errores.ingEntidad = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFecha_ingc"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.ingCia"
                          label="Fecha Afiliac.Cotrem"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.ingCia"
                          @input="errores.ingCia = false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.ingCia"
                        @input="
                          pickerFecha_ingc = false;
                          errores.ingCia = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Salario Actual"
                      clearable
                      outlined
                      v-model="form.salarioAct"
                      required
                      :error="errores.salarioAct"
                      @change="calcular_limite()"
                      @input="errores.salarioAct = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Limite de Desctos"
                      clearable
                      outlined
                      required
                      v-model="form.limiteDesc"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Otros Descuentos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.otrosDesc"
                      @input="
                        input_mask('otrosDesc', (errores.otrosDesc = false));
                        calcular_disponible();
                      "
                      :value="formatNumero(form.otrosDesc)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Descuentos Entidad"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.descEntidad"
                      @input="
                        input_mask(
                          'descEntidad',
                          (errores.descEntidad = false)
                        );
                        calcular_disponible();
                      "
                      :value="formatNumero(form.descEntidad)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Endeudamiento"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.endeudamiento"
                      @input="
                        input_mask(
                          'endeudamiento',
                          (errores.endeudamiento = false)
                        )
                      "
                      :value="formatNumero(form.endeudamiento)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFecha_proyc"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.proyContrato"
                          label="Proyecto Contrato"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.proyContrato"
                          @input="errores.proyContrato = false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.proyContrato"
                        @input="
                          pickerFecha_proyc = false;
                          errores.proyContrato = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col> -->
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Disponible de Descto"
                      clearable
                      outlined
                      required
                      disabled
                      @keypress="lettersDisabled()"
                      :error="errores.dispoDesc"
                      @input="
                        input_mask('dispoDesc', (errores.dispoDesc = false))
                      "
                      :value="formatNumero(form.dispoDesc)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFecha_ultnomPag"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.ultnomPag"
                          label="Ult. Nómina pagada"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          :error="errores.ultnomPag"
                          @input="errores.ultnomPag = false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.ultnomPag"
                        @input="
                          pickerFecha_ultnomPag = false;
                          errores.ultnomPag = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-divider color="#FF6F00"></v-divider>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="5">
                    <v-select
                      :items="modalidadap"
                      label="Modalidad de Ahorro/Aporte"
                      outlined
                      clearable
                      hide-details
                      v-model="form.modalidad1"
                      required
                      :error="errores.modalidad1"
                      return-object
                    >
                    </v-select>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Saldo Actual"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.saldoAct"
                      @input="
                        input_mask('saldoAct', (errores.saldoAct = false))
                      "
                      :value="formatNumero(form.saldoAct)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Descuento Acumulado"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.descAcum"
                      @input="
                        input_mask('descAcum', (errores.descAcum = false))
                      "
                      :value="formatNumero(form.descAcum)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="5">
                    <v-select
                      :items="modalidadap"
                      label="Modalidad de Ahorro/Aporte"
                      outlined
                      clearable
                      hide-details
                      v-model="form.modalidad2"
                      required
                      return-object
                    >
                    </v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Saldo Actual"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldoAct2')"
                      :value="formatNumero(form.saldoAct2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Descuento Acumulado"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('descAcum2')"
                      :value="formatNumero(form.descAcum2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row> -->
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Id_Deudor1"
                      outlined
                      v-model="form.iddeudor1"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col
                    class="d-flex justify-start align-center"
                    cols="12"
                    sm="1"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          @click="buscar_id(1)"
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
                      <span>Buscar Cedula</span>
                    </v-tooltip>
                  </v-col>

                  <v-col class="d-flex" cols="8">
                    <v-text-field
                      label="Nombre Deudor1"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.benefiCred1"
                      :error="errores.benefiCred1"
                      @input="errores.benefiCred1 = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Número Crédito"
                      clearable
                      outlined
                      required
                      :error="errores.nrocred1"
                      type="number"
                      @input="errores.nrocred1 = false"
                      v-model="form.nrocred1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Valor Inicial"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('vlrInicial1')"
                      :value="formatNumero(form.vlrInicial1)"
                      :error="errores.vlrInicial1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Saldo Actual"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldoAct1_cred')"
                      :value="formatNumero(form.saldoAct1_cred)"
                      :error="errores.saldoAct_cred1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Id_Deudor2"
                      outlined
                      v-model="form.iddeudor2"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col
                    class="d-flex justify-start align-center"
                    cols="12"
                    sm="1"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          @click="buscar_id(2)"
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
                      <span>Buscar Cedula</span>
                    </v-tooltip>
                  </v-col>

                  <v-col class="d-flex" cols="8">
                    <v-text-field
                      label="Nombre Deudor2"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.benefiCred2"
                      :error="errores.benefiCred2"
                      @input="errores.benefiCred2 = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Número Crédito"
                      clearable
                      outlined
                      required
                      type="number"
                      v-model="form.nrocred2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Valor Inicial"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('vlrInicial2')"
                      :value="formatNumero(form.vlrInicial2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Saldo Actual"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldoAct2_cred')"
                      :value="formatNumero(form.saldoAct2_cred)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- DEUDA ASOCIADO             -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-data-table
                  v-model="form.tab_deuda"
                  :headers="headersocio"
                  :items="deudasocio"
                  :single-select="singleSelect"
                  item-key="numero_rep"
                  show-select
                  class="elevation-1"
                  @input="enterSelect()"
                >
                  <template v-slot:item.numero_rep="{ item }">
                    {{ parseInt(item.numero_rep) }}
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>

            <!-- ESTUDIO             -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Número Solicitud"
                      clearable
                      outlined
                      required
                      disabled
                      :error="errores.nrosolicitud"
                      type="number"
                      @input="errores.nrosolicitud = false"
                      v-model="form.nrosolicitud"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="2">
                    <v-menu
                      v-model="pickerFecha_sol"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fsolicitud"
                          label="Fecha Solicitud"
                          append-icon="event"
                          hide-details
                          outlined
                          disabled
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fsolicitud"
                        @input="pickerFecha_sol = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="7">
                    <v-select
                      :items="tpcreditos"
                      :item-text="format_tiposcr"
                      label="Tipo Crédito"
                      hide-details
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.tpcreditos"
                      return-object
                      :error="errores.tpcreditos"
                      @input="errores.tpcreditos = false"
                      @change="get_interes()"
                    ></v-select>
                  </v-col>
                </v-row>

                <!--     

                    <v-col class="d-flex" cols="3">
                      <v-select
                        :items="modalidad"
                        label="Modalidad"
                        hide-details
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.modalidad"
                        return-object
                        :error="errores.modalidad"
                        @input="errores.modalidad = false"
                      ></v-select>
                    </v-col>
                    <v-col class="d-flex" cols="3">
                      <v-select
                        :items="linea"
                        label="Linea"
                        hide-details
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.linea"
                        return-object
                        :error="errores.linea"
                        @input="errores.linea = false"
                      ></v-select>
                    </v-col>
                    <v-col class="d-flex" cols="3">
                      <v-select
                        :items="clasificacion"
                        label="Clasificación"
                        hide-details
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.clasificacion"
                        return-object
                        :error="errores.clasificacion"
                        @input="errores.clasificacion = false"
                      ></v-select>
                    </v-col>
                    <v-col
                      class="d-flex"
                      cols="3"
                      v-if="
                        form.clasificacion
                          ? form.clasificacion.value === 1
                          : false
                      "
                    >
                      <v-select
                        :items="tipoord"
                        label="Tipo"
                        hide-details
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.tipoord"
                        return-object
                        :error="errores.tipoord"
                        @input="errores.tipoord = false"
                      ></v-select>
                    </v-col>

                    <v-col
                      class="d-flex"
                      cols="3"
                      v-if="
                        form.clasificacion
                          ? form.clasificacion.value === 2
                          : false
                      "
                    >
                      <v-select
                        :items="tipoextra"
                        label="Tipo"
                        hide-details
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.tipoextra"
                        return-object
                        :error="errores.tipoextra"
                        @input="errores.tipoextra = false"
                      ></v-select>
                    </v-col>

                    <v-col
                      class="d-flex"
                      cols="3"
                      v-if="
                        form.clasificacion
                          ? form.clasificacion.value === 3
                          : false
                      "
                    >
                      <v-select
                        :items="tipoconvenio"
                        label="Tipo"
                        hide-details
                        clearable
                        outlined
                        type="text"
                        required
                        v-model="form.tipoconvenio"
                        return-object
                        :error="errores.tipoconvenio"
                        @input="errores.tipoconvenio = false"
                      ></v-select>
                    </v-col> -->
                <!-- 

                  <v-col class="d-flex" cols="5">
                    <v-select
                      :items="modalidadcred"
                      label="Modalidad de Credito"
                      outlined
                      clearable
                      hide-details
                      v-model="form.modaliCred_es"
                      required
                      return-object
                    >
                    </v-select>
                  </v-col> -->

                <v-row class="mt-1 ml-1">
                  <!-- <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Abono Aportes"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('abonoApo')"
                      :value="formatNumero(form.abonoApo)"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dcto Papeleria"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('desctoPap')"
                      :value="formatNumero(form.desctoPap)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dcto Estudio"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('desctoEst')"
                      :value="formatNumero(form.desctoEst)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dcto Datacrédito"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('desctoDatacr')"
                      :value="formatNumero(form.desctoDatacr)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dcto Permanente"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('desctoPer')"
                      :value="formatNumero(form.desctoPer)"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                  <!-- <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cupo de Crédito"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('cupoCred')"
                      :value="formatNumero(form.cupoCred)"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                </v-row>
                <v-divider
                  class="mt-2"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Solicitado"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.vlrSolici"
                      @input="
                        input_mask('vlrSolici', (errores.vlrSolici = false))
                      "
                      :value="formatNumero(form.vlrSolici)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="garantia"
                      label="Garantía"
                      hide-details
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.garantia"
                      return-object
                      :error="errores.garantia"
                      @input="errores.garantia = false"
                    ></v-select>
                  </v-col>
                  <!-- <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Intereses Anticipados"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('intAnticipo')"
                      :value="formatNumero(form.intAnticipo)"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFecha_ini"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.iniDescto"
                          label="Inicia Descuentos"
                          append-icon="event"
                          hide-details
                          outlined
                          :error="errores.iniDescto"
                          @input="errores.iniDescto = false"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.iniDescto"
                        @input="
                          pickerFecha_ini = false;
                          errores.iniDescto = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Descuentos Voluntarios"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('desctoVol')"
                      :value="formatNumero(form.desctoVol)"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Aprobado"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('vlrAprobado')"
                      @change="errores.vlrAprobado = false"
                      :value="formatNumero(form.vlrAprobado)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-btn
                      color="light-blue accent-4 white--text"
                      class
                      @click="liquidar_cuota()"
                      depressed
                    >
                      <v-icon size="20" left>mdi-book-outline</v-icon>Calcular
                      Pagos
                    </v-btn>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Cuota"
                      clearable
                      outlined
                      disabled
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.vlrCuota_es"
                      @input="
                        input_mask('vlrCuota_es', (errores.vlrCuota_es = false))
                      "
                      :value="formatNumero(form.vlrCuota_es)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-2"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3">
                    <v-select
                      label="Forma de pago"
                      v-model="form.fpago"
                      :items="fpago"
                      outlined
                      :error="errores.fpago"
                      @change="errores.fpago = false"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Número de Cuotas"
                      clearable
                      outlined
                      required
                      :error="errores.nrocuotas"
                      type="number"
                      @input="errores.nrocuotas = false"
                      v-model="form.nrocuotas"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Tasa Mensual"
                      clearable
                      outlined
                      required
                      :error="errores.tasaMensual"
                      type="number"
                      @input="errores.tasaMensual = false"
                      v-model="form.tasaMensual"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Recoge saldo"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.recogeSal"
                      @input="
                        input_mask('recogeSal', (errores.recogeSal = false))
                      "
                      :value="formatNumero(form.recogeSal)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Destino"
                      clearable
                      outlined
                      required
                      v-model="form.destino"
                      :error="errores.destino"
                      @input="errores.destino = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="% Seguro Cartera"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('segCartera')"
                      :value="formatNumero(form.segCartera)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="% Seguro Fianza"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.segfianza"
                      @input="
                        input_mask('segfianza', (errores.segfianza = false))
                      "
                      :value="formatNumero(form.prestamosr)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor a girar"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      :error="errores.vlrGirar"
                      @input="
                        input_mask('vlrGirar', (errores.vlrGirar = false))
                      "
                      :value="formatNumero(form.vlrGirar)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Cuotas"
                      clearable
                      outlined
                      required
                      type="number"
                      v-model="form.cuotas"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Puntaje Datacredito"
                      clearable
                      outlined
                      required
                      type="number"
                      v-model="form.ptosdatacred"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" sm="4">
                    <v-menu
                      v-model="pickerFecha_datac"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fechadatac"
                          label="Fecha Datacredito"
                          append-icon="event"
                          hide-details
                          outlined
                          :error="errores.fechadatac"
                          @input="errores.fechadatac = false"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fechadatac"
                        @input="
                          pickerFecha_datac = false;
                          errores.fechadatac = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <!-- AMORTIZACION       -->
            <v-tab-item>
              <div class="pa-0 px-8">
                <v-card-text class="px-0 pa-0">
                  <v-data-table :items="table.items" :headers="table.headers">
                  </v-data-table>
                </v-card-text>
              </div>
            </v-tab-item>
          </v-tabs-items>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.bloquear" label="Bloquear"></v-switch>
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
            @click="validar_guardar()"
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
import { estudio } from "../../_formatos_asoc.js";

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
      pickerFecha_reg: false,
      pickerFecha_inge: false,
      pickerFecha_ingc: false,
      pickerFecha_proyc: false,
      pickerFecha_ultnomPag: false,
      pickerFecha_abo: false,
      pickerFecha_abo2: false,
      pickerFecha_abo3: false,
      pickerFecha_sol: false,
      pickerFecha_ini: false,
      pickerFecha_datac: false,

      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      fechafin: null,
      expanded: [],
      contenido: [],
      deudasocio: [],
      solicitud: [],
      nomina: [],
      datoasociado: [],

      seguro: "0",
      aportes: null,

      table: {
        items: [],
        headers: [
          {
            text: "Pago No.",
            value: "pago_no",
            align: "center",
          },

          {
            text: "Sdo. capital",
            value: "saldo",
            align: "center",
          },
          {
            text: "Pago capital",
            value: "pago_capital",
            align: "center",
          },
          {
            text: "Pago Int.",
            value: "interes",
            align: "center",
          },
          {
            text: "Seguro",
            value: "seguro",
            align: "right",
          },

          {
            text: "Total Cuota",
            value: "monto_pago",
            align: "center",
          },
          {
            text: "Sdo. capital",
            value: "saldo_capital",
            align: "center",
          },
          {
            text: "Fecha",
            value: "fecha",
            align: "center",
          },
        ],
      },
      modalidad: [{ text: "Consumo", value: "1" }],
      linea: [
        { text: "Crédito Personal", value: "1" },
        { text: "Crédito Libranza", value: "2" },
      ],
      clasificacion: [
        { text: "Ordinario", value: 1 },
        { text: "ExtraOrdinario", value: 2 },
        { text: "Convenio", value: 3 },
      ],
      tipoord: [
        { text: "Ordinario", value: "1" },
        { text: "Crédito Sobre Aportes", value: "2" },
        { text: "Compra de Cartera", value: "3" },
        { text: "Educativo", value: "4" },
      ],
      tipoextra: [
        { text: "Especial", value: "1" },
        { text: "Rotativo", value: "2" },
      ],
      garantia: [
        { text: "Pagaré-Libranza", value: "1" },
        { text: "Pagaré-Ventanilla", value: "2" },
        { text: "Fianza", value: "3" },
      ],
      tipoconvenio: [
        { text: "Mercadeo", value: "1" },
        { text: "Seguros", value: "2" },
        { text: "Electrodomesticos", value: "3" },
        { text: "Turismo", value: "4" },
      ],
      modalidadap: [
        { text: "Aportes Ordinarios", value: 1 },
        { text: "Aportes ExtraOrdinarios", value: 2 },
      ],
      modalidadcred: [
        { text: "Crédito Ordinario", value: 1 },
        { text: "Crédito ExtraOrdinario", value: 2 },
      ],
      fpago: [
        { text: "Mensual", value: 1 },
        { text: "Quincenal", value: 2 },
        { text: "Semestral", value: 3 },
      ],

      datosEmpresa: [],
      tpcreditos: [],
      tab: 0,
      search: null,
      form: {
        compañia: null,
        ingEntidad: null,
        desctoPap: null,
        desctoEst: null,
        tab_deuda:null,
        desctoDatacr:null,

      },
      error: {
        ccosto: false,
      },
      selected: [],
      singleSelect: false,
      headersocio: [
        { text: "Modalidad", align: "center", value: "modalidad_rep" },
        { text: "Numero", align: "center", value: "numero_rep" },
        { text: "Porc_Pagado", align: "center", value: "porcpagado_rep" },
        { text: "Saldo_Capital", align: "center", value: "saldocap_rep" },
        { text: "Saldo_Interes", align: "center", value: "saldoint_rep" },
        { text: "Saldo_Total", align: "center", value: "saldotot_rep" },
        { text: "Vlr_Cuota", align: "center", value: "vlrcuota_rep" },
        { text: "Ult_Abono", align: "center", value: "estado_rep" },
        { text: "Saldo_Mora", align: "center", value: "estado_rep" },
      ],
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Descripción", align: "left", value: "solicitante_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Montar", value: "edit", align: "center" },
        { text: "Imprimir", value: "imprimir", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        vlrAprobado: false,
        tasaMensual: false,
        nrocuotas: false,
        iniDescto: false,
        modalidad1: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
    this.cargartiposcr();
  },
  computed: {},
  methods: {
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_interes() {
      console.log(this.form.tpcreditos);
      this.form.desctoPap = this.form.tpcreditos.papeleria_rep;
      this.form.desctoEst = this.form.tpcreditos.estudio_rep;
    },

    cargartiposcr() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/CftiposJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.tpcreditos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tipo de Creditos",
            estado: true,
          });
        });
    },
    format_tiposcr: function (val) {
      return `${val.descripcion_rep}`;
    },
    async cargarconsecutivo(solicitud) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrEstcredC.dll",
          data: sessionStorage.Sesion + "|" + solicitud + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.consecutivo = parseInt(data[0].nro);
        })
        .catch((err) => {
          this.dialogo.estado = false;
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    async cargarasociado(idasociado) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrEstcred01J.dll",
          data: sessionStorage.Sesion + "|" + idasociado + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.datoasociado = data[0];
          this.form.compañia = this.datoasociado.empresa_rut;
          this.form.salarioAct = this.formatNumero(
            this.datoasociado.vlringreso_rut.trim()
          );
          this.form.ingEntidad = this.datoasociado.fechaing_rut;
        })
        .catch((err) => {
          this.dialogo.estado = false;
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    async cargarcreditos(idasociado) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrEstcred02J.dll",
          data: sessionStorage.Sesion + "|" + idasociado + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.deudasocio = data;
        })
        .catch((err) => {
          this.dialogo.estado = false;
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    async cargaraportes(idasociado) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrEstcred05J.dll",
          data: sessionStorage.Sesion + "|" + idasociado + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.aportes = data;
        })
        .catch((err) => {
          this.dialogo.estado = false;
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    async buscarnomina(idasociado) {
      this.loader = true;
      await post
        .postData({
          url: "Financiero/dlls/PrbusqnominaJ.dll",
          data: sessionStorage.Sesion + "|" + idasociado + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.nomina = data[0].fecha_rep;
          this.form.ultnomPag = data[0].fecha_rep;
          this.form.ingEntidad = data[0].fechaing_rep;
          this.form.salarioAct = data[0].basico_rep;
        })
        .catch((err) => {
          this.dialogo.estado = false;
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    print_item(item) {
      let consecutivo = item.nro_rep.trim();
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/PrEstcred04J.dll",
          data: sessionStorage.Sesion + "|" + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let data_parse = JSON.parse(JSON.stringify(data))[0];

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          data_parse.ciudad_emp = this.datosEmpresa.Ciudad;
          data_parse.dpto_emp = this.datosEmpresa.Departamento;
          data_parse.id_emp = this.datosEmpresa.ideditado_empr;

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_parse.logo = logo;
            estudio(data_parse).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir Estudio",
            estado: true,
          });
        });
    },
    async buscar_item(consecutivo) {
      this.loader = true;
      await post
        .postData({
          url: "Asociados/dlls/PrSolcred01J.dll",
          data: sessionStorage.Sesion + "|" + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.solicitud = data[0];

          this.form.idcodeudor1 = this.solicitud.idcodeudor1_rep
            ? parseFloat(this.solicitud.idcodeudor1_rep)
            : "0";
          this.form.idcodeudor2 = this.solicitud.idcodeudor2_rep
            ? parseFloat(this.solicitud.idcodeudor2_rep)
            : "0";
          this.form.benefiCred1 = this.solicitud.nombrecod1_rep;
          this.form.benefiCred2 = this.solicitud.nombrecod2_rep;

          var busqueda_tipo = this.tpcreditos.find(
            (el) => el.codigo_rep == this.solicitud.llave_rep
          );
          this.form.tpcreditos = busqueda_tipo;

          console.log(this.form.tpcreditos);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Solicitudes",
            estado: true,
          });
        });
    },
    async editar_item(data) {
      this.solicitud = [];
      this.dialogo.estado = true;
      this.dialogo.titulo = "Estudio de Crédito";
      this.dialogo.tipo = 1;
      this.form.fechareg = this.$moment().format("YYYY-MM-DD");
      let consecutivo = data.nro_rep.trim();
      await this.cargarconsecutivo(consecutivo);
      let idasociado = data.idrut_rep;
      await this.cargarasociado(idasociado);
      await this.calcular_limite();

      await this.cargarcreditos(idasociado);
      await this.cargaraportes(idasociado);
      await this.buscarnomina(idasociado);
      await this.buscar_item(consecutivo);

      this.form.nombre = this.solicitud.solicitante_rep.trim();
      this.form.idsolicita = this.solicitud.rut_rep.trim();
      this.form.nrosolicitud = this.solicitud.nro_rep.trim();
      this.form.fsolicitud = this.solicitud.fecha_rep;
      this.form.ingCia = this.datoasociado.fechaing_rut;
      this.form.compañia = this.datoasociado.empresa_rut;

      // this.form.abonoApo = parseInt(this.datoasociado.aporte_rut);
      // this.form.abonoApo = parseInt(this.datoasociado.aporte_rut);
      this.form.vlrSolici = parseInt(this.solicitud.valor_rep);
      this.form.nrocuotas = parseInt(this.solicitud.cuotas_rep);
      this.form.vlrAprobado = parseInt(this.solicitud.valor_rep);
      this.form.iniDescto = this.solicitud.fecha_rep;

      var busqueda_select = this.tpcreditos.find(
        (el) => el.llave_rep == this.solicitud.llavecred_rep
      );
      this.form.tpcreditos = busqueda_select;

      console.log(this.form.tpcreditos);
      let dctopapeleria = parseFloat(this.form.tpcreditos.papeleria_rep.trim());
      let desctoEst = parseFloat(this.form.tpcreditos.estudio_rep.trim());
      let desctoDatacr = parseFloat(this.form.tpcreditos.datacredito_rep.trim());

      let netogiro =
        parseFloat(this.form.vlrAprobado) - desctoEst - dctopapeleria - desctoDatacr;
      this.form.vlrGirar = netogiro;

      this.form.desctoPap = dctopapeleria;
      this.form.desctoEst = desctoEst;
      this.form.desctoDatacr = desctoDatacr;
      this.form.tasaMensual = parseFloat(
        this.form.tpcreditos.tasactual_rep.trim()
      );
      this.form.segCartera = 1.1;

      var busqueda_linea = this.linea.find(
        (el) => el.value == parseInt(this.solicitud.lineacred_rep)
      );
      this.form.linea = busqueda_linea;

      var busqueda_clasifica = this.clasificacion.find(
        (el) => el.value == this.solicitud.clasifcred_rep
      );
      this.form.clasificacion = busqueda_clasifica;

      var busqueda_garantia = this.garantia.find(
        (el) => el.value == this.solicitud.garantia_rep
      );
      this.form.garantia = busqueda_garantia;

      var busqueda_fpago = this.fpago.find(
        (el) => el.value == this.solicitud.fpago_rep
      );
      this.form.fpago = busqueda_fpago;
      let aportdinarios = this.aportes[0].ordinario_rep
        .trim()
        .replace(/\,/g, "");
      let aportextra = this.aportes[0].extraordinario_rep
        .trim()
        .replace(/\,/g, "");

      this.form.modalidad1 = 1;
      // this.form.modalidad2 = 2;
      this.form.saldoAct = aportdinarios;
      // this.form.saldoAct2 = aportextra;

      //  console.log(this.aportes[0].ordinario_rep)
    },
    async calcular_disponible() {
      let limite = parseInt(this.form.limiteDesc.replace(/\,/g, ""));
      let otrosdctos = this.form.otrosDesc ? parseInt(this.form.otrosDesc) : 0;
      let dctoentidad = this.form.descEntidad
        ? parseInt(this.form.descEntidad)
        : 0;
      let disponible = limite - otrosdctos - dctoentidad;
      this.form.dispoDesc = disponible;
    },
    async calcular_limite() {
      let salario = parseInt(this.form.salarioAct.replace(/\,/g, ""));
      let limite = (salario * 0.4).toFixed(0);
      this.form.limiteDesc = this.formatNumero(limite);
      this.calcular_disponible();
    },
    async validar_guardar() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Consecutivo Obligatorio!");
      } else if (!data.nombre) {
        this.errores.nombre = true;
        this.send_error("Nombre Obligatorio!");
      } else if (!data.compañia) {
        this.errores.compañia = true;
        this.send_error("Compañia Obligatorio!");
      } else if (!data.limiteDesc) {
        this.errores.limiteDesc = true;
        this.send_error("Limite Desc Obligatorio!");
      } else if (!data.ingEntidad) {
        this.errores.ingEntidad = true;
        this.send_error("IngEntidad Obligatorio!");
      } else if (!data.salarioAct) {
        this.errores.salarioAct = true;
        this.send_error("SalarioAct Obligatorio!");
      } else if (!data.dispoDesc) {
        this.errores.dispoDesc = true;
        this.send_error("Dispo Descuento Obligatorio!");
      } else if (!data.ingCia) {
        this.errores.ingCia = true;
        this.send_error("Ingreso Cia Obligatorio!");
      } else if (!data.modalidad1) {
        this.errores.modalidad1 = true;
        this.send_error("Modalidad Ahorro/Aportes Obligatoria!");
      } else if (!data.fechadatac) {
        this.errores.fechadatac = true;
        this.send_error("Datacredito Obligatoria!");
      } else if (!data.fechadatac) {
        this.errores.nrosolicitud = true;
        this.send_error("nrosolicitud Obligatorio!");
      } else if (!data.fsolicitud) {
        this.errores.fsolicitud = true;
        this.send_error("fsolicitud Obligatorio!");
      } else if (!data.vlrSolici) {
        this.errores.vlrSolici = true;
        this.send_error("vlrSolici Obligatorio!");
      } else if (!data.vlrCuota_es) {
        this.errores.vlrCuota_es = true;
        this.send_error("vlrCuota_es Obligatorio!");
      } else if (!data.garantia) {
        this.errores.garantia = true;
        this.send_error("garantia Obligatorio!");
      } else if (!data.iniDescto) {
        this.errores.iniDescto = true;
        this.send_error("iniDescto Obligatorio!");
      } else if (this.table.items.length && !this.solicitud.rotativo_rep == 1) {
        await this.grabar_financiacion(data);
      }
      await this.format_envio(data);
    },
    async grabar_financiacion(data) {
      console.log(data)
      let tabla_cuotas = await this.enviar_tabla();
      let consecutivo = parseFloat(data.consecutivo);
      let rut = data.idsolicita.trim().replace(/\,/g, "");
      let fechaini = this.table.items[0].fecha.replace(/\-/g, "");
      let cuotas = data.nrocuotas;
      let tpcreditos = data.tpcreditos.llave_rep;
      let valorini = data.vlrAprobado;
      let seguro = this.seguro.replace(/\,/g, "");
      seguro = parseFloat(seguro) * cuotas;
      let tasa = data.tasaMensual;
      post
        .postData({
          url: "Asociados/dlls/PrFinancia.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              rut +
              "|" +
              fechaini +
              "|" +
              cuotas +
              "|" +
              valorini +
              "|" +
              seguro +
              "|" +
              tasa +
              // "|" +
              // tpcreditos +
              "|",
            ...tabla_cuotas,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.dialogo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Financiación Generada Correctamente",
            estado: true,
          });
        });
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.table.items.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");

          let fecha = item.fecha.replace(/\-/g, "");
          let interes = item.interes.replace(/\,/g, "");
          let pago_capital = item.pago_capital.replace(/\,/g, "");
          let pago_no = item.pago_no;
          let seguro = item.seguro.replace(/\,/g, "");
          let saldo = item.saldo_capital.replace(/\,/g, "");

          tablajson[
            `DATOJ-${format_index}`
          ] = `${pago_no}|${saldo}|${pago_capital}|${interes}|${seguro}|${fecha}|`;
        });
        res(tablajson);
      });
    },

    async format_envio(data) {
      // this.card_estado = true;
      console.log("envio", data)
      let consecutivo = data.consecutivo;
      let idestudio = this.solicitud.rut_rep.trim().replace(/\,/g, "");
      let fecha = data.fechareg.replace(/\-/g, "");
      let nro_solic = data.nrosolicitud.trim();
      let estado = 0;
      let empresa = data.compañia.trim();
      let limiteDesc = data.limiteDesc.trim().replace(/\,/g, "") || "0";
      let ingEntidad = data.ingEntidad
        ? data.ingEntidad.trim().replace(/\-/g, "")
        : "0";
      // let nombre = data.nombre;
      let salarioAct = data.salarioAct || "0";
      let dispoDesc = data.dispoDesc || 0;
      let ingCia = data.ingCia ? data.ingCia.replace(/\-/g, "") : "";
      let otrosDesc = data.otrosDesc || 0;
      let endeudamiento = data.endeudamiento || 0;
      // let proyContrato = data.proyContrato
      //   ? data.proyContrato.replace(/\-/g, "")
      //   : "";
      let descEntidad = data.descEntidad || "0";
      let ultnomPag = data.ultnomPag || "0";
      let modalidad1 = data.modalidad1 ? data.modalidad1 : "0";
      let saldoAct1 = data.saldoAct || "0";
      let descAcum1 = data.descAcum || "0";

      let modalidad2 = data.modalidad2 ? data.modalidad2 : "0";
      let saldoAct2 = data.saldoAct2 ? data.saldoAct2 : "0";
      let descAcum2 = data.descAcum2 ? data.descAcum2 : "0";

      let benefiCred1 = data.iddeudor1 ? data.iddeudor1 : "0";
      let nrocred1 = data.nrocred1 ? data.nrocred1 : "0";
      let vlrInicial1 = data.vlrInicial1 ? data.vlrInicial1 : "0";
      let saldoAct_cred1 = data.saldoAct1_cred ? data.saldoAct1_cred : "0";

      let benefiCred2 = data.iddeudor2 ? data.iddeudor2 : "0";
      let nrocred2 = data.nrocred2 ? data.nrocred2 : "0";
      let vlrInicial2 = data.vlrInicial2 ? data.vlrInicial2 : "0";
      let saldoAct_cred2 = data.saldoAct2_cred ? data.saldoAct2_cred : "0";

      let vlrrecoge = data.recogeSal ? data.recogeSal : "0";
      let fechasol = data.fsolicitud.replace(/\-/g, "");

      // let modaliCred = data.modalidad.value;
      // let lineaCred = data.linea.value;
      // let clasifCred = data.clasificacion.value;
      let tipoCred = data.tpcreditos.codigo_rep;

      let abonoApo = data.abonoApo ? data.abonoApo : "0";

      let desctoPap = data.desctoPap ? data.desctoPap: "0";
      let desctoEst = data.desctoEst ? data.desctoEst: "0";
      let desctoPer = data.desctoPer ? data.desctoPer : "0";
      let desctoDatacr = data.desctoDatacr ? data.desctoDatacr : "0";
      let cupoCred = data.cupoCred ? data.cupoCred : "0";

      let vlrSolici = data.vlrSolici || "0";
      let vlrCuota_es = data.vlrCuota_es || "0";
      let garantia = data.garantia.value || "0";
      let intAnticipo = data.intAnticipo || "0";

      let fechainiDescto = data.iniDescto
        ? data.iniDescto.replace(/\-/g, "")
        : "";
      let tpcreditos = data.tpcreditos.llave_rep;
      let desctoVol = data.desctoVol ? data.desctoVol : "0";
      let vlrAprobado = data.vlrAprobado || "0";
      let fpago = data.fpago.value || "";
      let nrocuotas = data.nrocuotas || "0";
      let tasaMensual = data.tasaMensual || "0";
      let destino = data.destino || "";
      let segCartera = data.segCartera || "0";
      let segFianza = data.segfianza || "0";
      let vlrGirar = data.vlrGirar || "0";
      let ptosDatacredito = data.ptosdatacred || "0";
      let fechadatacredito = data.fechadatac.replace(/\-/g, "");

      let datos = {
        url: "Asociados/dlls/PrEstcred.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          consecutivo +
          "|" +
          idestudio +
          "|" +
          fecha +
          "|" +
          nro_solic +
          "|" +
          estado +
          "|" +
          empresa +
          "|" +
          limiteDesc +
          "|" +
          ingEntidad +
          "|" +
          salarioAct +
          "|" +
          dispoDesc +
          "|" +
          ingCia +
          "|" +
          otrosDesc +
          "|" +
          endeudamiento +
          "|" +
          descEntidad +
          "|" +
          ultnomPag +
          "|" +
          modalidad1 +
          "|" +
          saldoAct1 +
          "|" +
          descAcum1 +
          "|" +
          modalidad2 +
          "|" +
          saldoAct2 +
          "|" +
          descAcum2 +
          "|" +
          benefiCred1 +
          "|" +
          nrocred1 +
          "|" +
          vlrInicial1 +
          "|" +
          saldoAct_cred1 +
          "|" +
          benefiCred2 +
          "|" +
          nrocred2 +
          "|" +
          vlrInicial2 +
          "|" +
          saldoAct_cred2 +
          "|" +
          fechasol +
          "|" +
          tipoCred +
          "|" +
          abonoApo +
          "|" +
          desctoPap +
          "|" +
          desctoEst +
          "|" +
          desctoPer +
          "|" +
          cupoCred +
          "|" +
          vlrSolici +
          "|" +
          vlrCuota_es +
          "|" +
          garantia +
          "|" +
          intAnticipo +
          "|" +
          fechainiDescto +
          "|" +
          desctoVol +
          "|" +
          vlrAprobado +
          "|" +
          fpago +
          "|" +
          nrocuotas +
          "|" +
          tasaMensual +
          "|" +
          destino +
          "|" +
          segCartera +
          "|" +
          segFianza +
          "|" +
          vlrGirar +
          "|" +
          ptosDatacredito +
          "|" +
          fechadatacredito +
          "|" +
          vlrrecoge +
          "|" +
          tpcreditos +
          "|" +
          this.fechafin.replace(/\-/g, "") +
          "|" +
          desctoDatacr +
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
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
        clasifica: false,
        descripcion: false,

        consecutivo: false,
        nombre: false,
        compañia: false,
        limiteDesc: false,
        ingEntidad: false,
        salarioAct: false,
        dispoDesc: false,
        ingCia: false,
        otrosDesc: false,
        endeudamiento: false,
        proyContrato: false,
        descEntidad: false,
        ultnomPag: false,
        modalidadAhorro: false,
        saldoAct: false,
        descAcum: false,
        benefiCred: false,
        nrocred: false,
        vlrInicial: false,
        saldoAct_cred: false,
        recogeSal: false,
        modalicred: false,
        ncredDeu: false,
        porcpag: false,
        saldoCap: false,
        saldoInt: false,
        saldoTot: false,
        vlrCuota: false,
        ultAbono: false,
        saldoMora: false,
        nrosolicitud: false,
        fsolicitud: false,
        modaliCred_es: false,
        vlrSolici: false,
        vlrCuota_es: false,
        garantia: false,
        iniDescto: false,
        fpago: false,
        nrocuotas: false,
        tasaMensual: false,
        destino: false,
        prestamosr: false,
        vlrGirar: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/PrSolcredJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let data_parse = JSON.parse(JSON.stringify(data));
          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Solicitudes",
            estado: true,
          });
        });
    },
    liquidar_cuota() {
      if (!this.form.vlrAprobado) {
        this.errores.vlrAprobado = true;
        this.send_error("Debe ingresar valor Aprobado!");
      } else if (!this.form.tasaMensual) {
        this.errores.tasaMensual = true;
        this.send_error("Debe ingresar Tasa Mensual!");
      } else if (!this.form.nrocuotas) {
        this.errores.nrocuotas = true;
        this.send_error("Debe ingresar Nro de Cuotas!");
      } else if (!this.form.iniDescto) {
        this.errores.iniDescto = true;
        this.send_error("Debe ingresar Fecha Inicial del Credito!");
      } else {
        let valor = this.form.vlrAprobado;
        let porcseguro = parseFloat(this.form.segCartera);

        let cuotas = parseInt(this.form.nrocuotas);
        let tasafin = parseFloat(this.form.tasaMensual);
        let tasa_interes = tasafin;
        let vlrseguro = ((valor * porcseguro) / 100 / cuotas).toFixed(0);
        this.seguro = vlrseguro;

        let tasabase = this.form.tasaMensual;
        let fecha_inicial = this.form.iniDescto;
        let ano = fecha_inicial.substring(0, 4);
        let mes = fecha_inicial.substring(5, 7);
        let dia = fecha_inicial.substring(8, 10);

        if (mes > 1) {
          mes = mes - 1;
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

          let fecha = this.$moment(fecha_inicial)
            .add(i + 1, "months")
            .format("YYYY-MM-DD");
          this.fechafin = fecha;

          list.push({
            saldo: this.formatNumero(capital),
            pago_capital: this.formatNumero(pago_capital),
            interes: this.formatNumero(interes),
            seguro: vlrseguro,
            monto_pago: this.formatNumero(monto_pago),
            saldo_capital: this.formatNumero(saldo_capital),
            pago_no: i + 1,
            fecha: fecha,
          });

          this.form.vlrCuota_es = monto_pago;
          capital = saldo_capital;
        }
        this.table.items = list;
      }
    },
    buscar_id(item) {
      this.loader = true;
      let idbusq = 0;
      if (item === 1) {
        idbusq = this.form.iddeudor1.trim();
      } else {
        idbusq = this.form.iddeudor2.trim();
      }
      post
        .postData({
          url: "Asociados/dlls/PrEstcred03J.dll",
          data: sessionStorage.Sesion + "|" + idbusq + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          if (item === 1) {
            this.form.benefiCred1 = data[0].codeudor_rep.trim();
          } else {
            this.form.benefiCred2 = data[0].codeudor_rep.trim();
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar codeudor",
            estado: true,
          });
        });
    },
    enterSelect() {
      console.log(this.form.tab_deuda.map((e) => e));
      let recoge_deuda = 0;
      let seleccionado = this.form.tab_deuda.map((el) => {
        el.saldotot_rep = parseFloat(el.saldotot_rep) || 0;
        recoge_deuda = recoge_deuda + el.saldotot_rep 

      }     
      );
      console.log("Saldo",recoge_deuda)
      this.form.recogeSal = recoge_deuda

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
