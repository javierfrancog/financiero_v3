<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-greeting-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Solicitud de Créditos</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-cart-plus</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickerFechaini"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaini"
                    label="Buscar desde:"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    :error="errores.fechaini"
                    @input="errores.fechaini = false"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaini"
                  @input="
                    pickerFechaini = false;
                    errores.fechaini = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
              :single-expand="singleExpand"
              :search="search"
            >
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
                >
              </template>
              <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      class="mr-2"
                      icon
                      depressed
                      v-on="on"
                      @click="imprimir(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir</span>
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
    <v-dialog v-model="dialogoobserv.estado" persistent max-width="800px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" cols="4">
              <v-textarea
                outlined
                clearable
                label="Observaciones"
                v-model="form.observaciones"
                counter="600"
              ></v-textarea>
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
              dialogoobserv.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4 white--text"
            color="indigo"
            depressed
            large
            @click="guardar_observ()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Datos del solicitante</v-tab>
            <v-tab>Inf. Crédito</v-tab>
            <v-tab>Primas</v-tab>
            <v-tab>Inf. Financiera</v-tab>
            <v-tab>Codeudores</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Id_Solicitante"
                      outlined
                      v-model="form.idsolic"
                      hide-details
                      clearable
                      :error="errores.idsolic"
                      @input="errores.idsolic = false"
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
                          @click="buscar_id()"
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

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="form.ciudad"
                      :items="municipios"
                      item-text="municipio"
                      outlined
                      return-object
                      :error="errores.ciudad"
                      @change="errores.ciudad = false"
                      hide-details
                    ></v-autocomplete>
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
                          v-model="form.fecha"
                          label="Fecha"
                          append-icon="event"
                          hide-details
                          outlined
                          disabled
                          v-on="on"
                          :error="errores.fecha"
                          @input="errores.fecha = false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha"
                        @input="
                          pickerFecha = false;
                          errores.fecha = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="No solicitud"
                      outlined
                      type="text"
                      v-model="form.nosolicitud"
                      hide-details
                      disabled
                      @input="errores.nosolicitud = false"
                      :error="errores.nosolicitud"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Primer Apellido"
                      outlined
                      readonly
                      v-model="form.apellido1"
                      @input="errores.apellido1 = false"
                      :error="errores.apellido1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Segundo Apellido"
                      readonly
                      outlined
                      v-model="form.apellido2"
                      @input="errores.apellido2 = false"
                      :error="errores.apellido2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Nombres"
                      outlined
                      readonly
                      v-model="form.nombres"
                      @input="errores.nombres = false"
                      :error="errores.nombres"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Empresa Actual"
                      clearable
                      outlined
                      required
                      v-model="form.empresatr"
                      :error="errores.empresatr"
                      @input="errores.empresatr = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Dirección del trabajo"
                      clearable
                      outlined
                      required
                      v-model="form.direcciontr"
                      :error="errores.direcciontr"
                      @input="errores.direcciontr = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Barrio"
                      clearable
                      outlined
                      required
                      v-model="form.barriotr"
                      :error="errores.barriotr"
                      @input="errores.barriotr = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Teléfono fijo"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="form.teleftr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Activo"
                      v-model="form.activo"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      :error="errores.activo"
                      @change="errores.activo = false"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Pensionado"
                      v-model="form.pensionado"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      :error="errores.pensionado"
                      @change="errores.pensionado = false"
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Tipo de vivienda"
                      v-model="form.tipoVivienda"
                      :items="viviendas"
                      outlined
                      :error="errores.tipoVivienda"
                      @change="errores.tipoVivienda = false"
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Dirección de residencia"
                      clearable
                      outlined
                      required
                      v-model="form.direccionres"
                      :error="errores.direccionres"
                      @input="errores.direccionres = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Barrio"
                      clearable
                      outlined
                      required
                      v-model="form.barriores"
                      :error="errores.barriores"
                      @input="errores.barriores = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Celular"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="form.celularres"
                      :error="errores.celularres"
                      @input="errores.celularres = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Correo electrónico"
                      clearable
                      outlined
                      required
                      v-model="form.correo"
                      :error="errores.correo"
                      @input="errores.correo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="8">
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
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Solicitado"
                      clearable
                      outlined
                      required
                      :error="errores.vlrCred"
                      @keypress="lettersDisabled()"
                      @input="input_mask('vlrCred', (errores.vlrCred = false))"
                      :value="formatNumero(form.vlrCred)"
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
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="destino"
                      label="Destino"
                      hide-details
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.destino"
                      return-object
                      :error="errores.destino"
                      @input="errores.destino = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Valor Prima Comprometida"
                      clearable
                      outlined
                      required
                      :error="errores.vlrPrima"
                      @keypress="lettersDisabled()"
                      @input="
                        input_mask('vlrPrima', (errores.vlrPrima = false))
                      "
                      :value="formatNumero(form.vlrPrima)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="No. de cuotas"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="form.nrocuotas"
                      :error="errores.nrocuotas"
                      @input="errores.nrocuotas = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
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
                  <v-col class="d-flex" cols="12" sm="5">
                    <v-select
                      label="Tipo de Amortización"
                      v-model="form.amortizacion"
                      :items="tipoAmortizacion"
                      outlined
                      :error="errores.amortizacion"
                      @change="errores.amortizacion = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-row justify="center">
                <v-btn
                  class="ma-2 px-4 white--text"
                  @click="get_primas()"
                  color="orange"
                  depressed
                  large
                  >Calcular Primas
                </v-btn>
              </v-row>
              <v-card color="basil" flat>
                <div class="pa-0 px-8">
                  <v-card-text class="px-0 pa-0">
                    <v-data-table
                      :items="tableprimas.items"
                      :headers="tableprimas.headers"
                      :single-select="singleSelect"
                      item-key="numero_rep"
                      show-select
                      class="elevation-1"
                    >
                      <template v-slot:item.eliminar="{ item }">
                        <v-icon
                          small
                          class="mr-2"
                          @click="borrar_prima(item)"
                          color="red"
                          >delete</v-icon
                        >
                      </template>
                    </v-data-table>
                  </v-card-text>
                </div>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Sueldo/Mesada"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('sueldo1'), total_ing()"
                      :value="formatNumero(form.sueldo1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosing1'), total_ing()"
                      :value="formatNumero(form.otrosing1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total ingresos"
                      clearable
                      outlined
                      required
                      disabled
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaling1')"
                      :value="formatNumero(form.totaling1)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Descuentos COTREM"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('descuentos1'), total_ing()"
                      :value="formatNumero(form.descuentos1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros descuentos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosdesc1'), total_ing()"
                      :value="formatNumero(form.otrosdesc1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total egresos"
                      clearable
                      outlined
                      disabled
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaleg1')"
                      :value="formatNumero(form.totaleg1)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Activos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('activos1')"
                      :value="formatNumero(form.activos1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Pasivos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('pasivos1')"
                      :value="formatNumero(form.pasivos1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Casa"
                      v-model="form.casa1"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Vehículo"
                      v-model="form.vehiculo1"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-textarea
                      label="Observaciones"
                      rows="1"
                      clearable
                      outlined
                      required
                      v-model="form.observaciones"
                      hide-details
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />

                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Obligaciones financieras</span>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Banco"
                      clearable
                      outlined
                      required
                      v-model="form.bancos1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Saldo Actual"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldototal1')"
                      :value="formatNumero(form.saldototal1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cuota Mensual"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('cuota1')"
                      :value="formatNumero(form.cuota1)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      label="Estado"
                      v-model="form.estadoblig"
                      :items="[
                        { text: 'Al Dia', value: 1 },
                        { text: 'Vencido', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn
                    class="ma-2 px-4 white--text"
                    @click="add_bancos()"
                    color="orange"
                    depressed
                    large
                    >Agregar
                  </v-btn>
                </v-row>

                <v-row class="px-6 mt-0 justify-center">
                  <div class="pa-0 px-8">
                    <v-card-text class="px-0 pa-0">
                      <v-data-table
                        :items="tablebancos.items"
                        :headers="tablebancos.headers"
                      >
                        <template v-slot:item.eliminar="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="borrar_banco(item)"
                            color="red"
                            >delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </div>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Id_Codeudor_1"
                      outlined
                      v-model="form.idcodeudor1"
                      hide-details
                      clearable
                      :error="errores.idcodeudor1"
                      @input="errores.idcodeudor1 = false"
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
                          @click="buscar_idcod(1)"
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
                      label="Nombre Codeudor1 solidario"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.nombrecod1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Sueldo/Mesada"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('sueldo2')"
                      :value="formatNumero(form.sueldo2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosing2')"
                      :value="formatNumero(form.otrosing2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaling2')"
                      :value="formatNumero(form.totaling2)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Descuentos COTREM"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('descuentos2')"
                      :value="formatNumero(form.descuentos2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros descuentos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosdesc2')"
                      :value="formatNumero(form.otrosdesc2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total egresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaleg2')"
                      :value="formatNumero(form.totaleg2)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Activos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('activos2')"
                      :value="formatNumero(form.activos2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Pasivos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('pasivos2')"
                      :value="formatNumero(form.pasivos2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Casa"
                      v-model="form.casa2"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Vehículo"
                      v-model="form.vehiculo2"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Bancos"
                      clearable
                      outlined
                      required
                      v-model="form.bancos2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Saldo total"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldototal2')"
                      :value="formatNumero(form.saldototal2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Cuota"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('cuota2')"
                      :value="formatNumero(form.cuota2)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Obligaciones al día"
                      v-model="form.obligaciones2"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Id_Codeudor_2"
                      outlined
                      v-model="form.idcodeudor2"
                      hide-details
                      clearable
                      :error="errores.idcodeudor2"
                      @input="errores.idcodeudor2 = false"
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
                          @click="buscar_idcod(2)"
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
                      label="Nombre Codeudor2 solidario"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.nombrecod2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Sueldo/Mesada"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('sueldo3')"
                      :value="formatNumero(form.sueldo3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosing3')"
                      :value="formatNumero(form.otrosing3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaling3')"
                      :value="formatNumero(form.totaling3)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Descuentos COTREM"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('descuentos3')"
                      :value="formatNumero(form.descuentos3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros descuentos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosdesc3')"
                      :value="formatNumero(form.otrosdesc3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total egresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaleg3')"
                      :value="formatNumero(form.totaleg3)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Activos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('activos3')"
                      :value="formatNumero(form.activos3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Pasivos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('pasivos3')"
                      :value="formatNumero(form.pasivos3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Casa"
                      v-model="form.casa3"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Vehículo"
                      v-model="form.vehiculo3"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Bancos"
                      clearable
                      outlined
                      required
                      v-model="form.bancos3"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Saldo total"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldototal3')"
                      :value="formatNumero(form.saldototal3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Cuota"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('cuota3')"
                      :value="formatNumero(form.cuota3)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Obligaciones al día"
                      v-model="form.obligaciones3"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>

                <v-divider
                  class="mt-1"
                  :style="{ 'border-width': '1px', 'border-color': 'orange' }"
                />
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Id_Codeudor_3"
                      outlined
                      v-model="form.idcodeudor3"
                      hide-details
                      clearable
                      :error="errores.idcodeudor3"
                      @input="errores.idcodeudor3 = false"
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
                          @click="buscar_idcod(3)"
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
                      label="Nombre Codeudor3 solidario"
                      clearable
                      outlined
                      disabled
                      required
                      v-model="form.nombrecod3"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Sueldo/Mesada"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('sueldo4')"
                      :value="formatNumero(form.sueldo4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosing4')"
                      :value="formatNumero(form.otrosing4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total ingresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaling4')"
                      :value="formatNumero(form.totaling4)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Descuentos COTREM"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('descuentos4')"
                      :value="formatNumero(form.descuentos4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Otros descuentos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('otrosdesc4')"
                      :value="formatNumero(form.otrosdesc4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Total egresos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('totaleg4')"
                      :value="formatNumero(form.totaleg4)"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Activos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('activos4')"
                      :value="formatNumero(form.activos4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Pasivos"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('pasivos4')"
                      :value="formatNumero(form.pasivos4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Casa"
                      v-model="form.casa4"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Vehículo"
                      v-model="form.vehiculo4"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Bancos"
                      clearable
                      outlined
                      required
                      v-model="form.bancos4"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Saldo total"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('saldototal4')"
                      :value="formatNumero(form.saldototal4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Cuota"
                      clearable
                      outlined
                      required
                      @keypress="lettersDisabled()"
                      @input="input_mask('cuota4')"
                      :value="formatNumero(form.cuota4)"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Obligaciones al día"
                      v-model="form.obligaciones4"
                      :items="[
                        { text: 'Si', value: 1 },
                        { text: 'No', value: 2 },
                      ]"
                      outlined
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <v-divider color="#FF6F00"></v-divider>
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
import { solicitudCredito } from "../../_formatos_asoc.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      item_select: null,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoobserv: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      pickerFechaini: false,
      pickerFecha: false,
      pickerFecha1: false,
      pickerFecha2: false,
      pickerFecha3: false,
      pickerFecha4: false,
      pickerFecha5: false,
      pickerFecha6: false,
      pickerFecha7: false,
      pickerFecha8: false,
      pickerFecha9: false,
      pickerFecha10: false,
      pickerFecha11: false,
      pickerFecha12: false,

      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,

      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      bancos: [],
      tpcreditos: [],

      datosEmpresa: [],
      tab: 0,
      search: null,
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
      destino: [
        { text: "Mejora Vivienda", value: "1" },
        { text: "Estudio", value: "2" },
        { text: "Gastos Medicos", value: "3" },
        { text: "Gastos Personales", value: "4" },
      ],
      tipoconvenio: [
        { text: "Mercadeo", value: "1" },
        { text: "Seguros", value: "2" },
        { text: "Electrodomesticos", value: "3" },
        { text: "Turismo", value: "4" },
      ],

      form: {},
      error: {
        ccosto: false,
      },
      tableprimas: {
        items: [],
        headers: [
          {
            text: "No.",
            value: "pago_nro",
            align: "center",
          },

          {
            text: "Periodo",
            value: "perprima",
            align: "center",
          },
          {
            text: "Valor",
            value: "vlrprima",
            align: "center",
          },
        ],
      },

      tablebancos: {
        items: [],
        headers: [
          {
            text: "Banco",
            value: "tab_banco",
            align: "center",
          },
          {
            text: "Saldo Actual",
            value: "tab_saldototal",
            align: "center",
          },
          {
            text: "Valor Cuota",
            value: "tab_cuota",
            align: "center",
          },
          {
            text: "Estado",
            value: "tab_estado",
            align: "center",
          },
          {
            text: "Eliminar",
            value: "eliminar",
            align: "center",
          },
        ],
      },
      headers: [
        { text: "Consecutivo", align: "left", value: "nro_rep" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Solicitante", align: "left", value: "solicitante_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", align: "center", value: "action" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        empresatr: false,
      },
      card_estado: false,

      municipios: [],
      viviendas: [
        { text: "Propia", value: 1 },
        { text: "Familiar", value: 2 },
        { text: "Arrendada", value: 3 },
      ],
      credito: [
        { text: "Novación", value: 1 },
        { text: "Refinanción", value: 2 },
        { text: "Reestructuración", value: 3 },
      ],
      fpago: [
        { text: "Mensual", value: 1 },
        // { text: "Quincenal", value: 2 },
        { text: "Semestral", value: 3 },
      ],
      tipoAmortizacion: [
        { text: "Descuento por nómina", value: 1 },
        { text: "Pago por ventanilla", value: 2 },
      ],
    };
  },
  created() {
    this.get_empresa();
    this.form.fechaini = this.$moment().format("YYYY-MM-DD");
    this.cargarcontenido();
    this.cargarCiudades();
    this.cargartiposcr();
  },
  computed: {},
  methods: {
    guardar_observ() {
      let consecutivo = this.item_select.nro_rep.trim();
      let textob64 = window.btoa(
        unescape(encodeURIComponent(this.form.observaciones.trim()))
      );

      let datos = {
        url: "Asociados/dlls/PrSolcredObs.dll",
        data: sessionStorage.Sesion + "|" + consecutivo + "|" + textob64 + "|",
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
          this.dialogoobserv.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    imprimir(data) {
      let numero = parseFloat(data.nro_rep);
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/PrSolcred01J.dll",
          data: sessionStorage.Sesion + "|" + numero + "|",
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

          data_parse.observgestor = window.atob(
            data_parse.observB641_rep +
              data_parse.observB642_rep +
              data_parse.observB643_rep +
              data_parse.observB644_rep
          );

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_parse.logo = logo;
            solicitudCredito(data_parse).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir",
            estado: true,
          });
        });
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
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          let dptos = data.departamentos;
          let meta = dptos.filter((el) => el.codigo == "50");
          this.municipios = meta[0].municipios;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
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
    editar_item(data) {
      let descripcion = "";
      var item = JSON.parse(JSON.stringify(data));
      this.item_select = item;
      this.dialogoobserv.estado = true;
      this.dialogoobserv.titulo = "Modificar Registro";
      this.dialogoobserv.tipo = 1;
      this.form.estado = item.estado_pr;
      this.form.observaciones = window.atob(
        item.observB641_rep +
          item.observB642_rep +
          item.observB643_rep +
          item.observB644_rep
      );
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.idsolic) {
        this.errores.idsolic = true;
        this.send_error("Campo del id Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Campo de ciudad Obligatorio!");
      } else if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Campo de fecha Obligatorio!");
      } else if (!data.nosolicitud) {
        this.errores.nosolicitud = true;
        this.send_error("Campo del nro de solicitud Obligatorio!");
      } else if (!data.apellido1) {
        this.errores.apellido1 = true;
        this.send_error("Campo del primer apellido Obligatorio!");
      } else if (!data.apellido2) {
        this.errores.apellido2 = true;
        this.send_error("Campo del segundo apellido Obligatorio!");
      } else if (!data.nombres) {
        this.errores.nombres = true;
        this.send_error("Campo de nombres Obligatorio!");
      } else if (!data.empresatr) {
        this.errores.empresatr = true;
        this.send_error("Campo de Empresa Obligatorio!");
      } else if (!data.direcciontr) {
        this.errores.direcciontr = true;
        this.send_error("Campo de direccion del trabajo Obligatorio!");
      } else if (!data.barriotr) {
        this.errores.barriotr = true;
        this.send_error("Campo del barrio del trabajo Obligatorio!");
      } else if (!data.activo) {
        this.errores.activo = true;
        this.send_error("Campo de activo Obligatorio!");
      } else if (!data.pensionado) {
        this.errores.pensionado = true;
        this.send_error("Campo de pensionado Obligatorio!");
      } else if (!data.tipoVivienda) {
        this.errores.tipoVivienda = true;
        this.send_error("Campo del tipo de vivienda Obligatorio!");
      } else if (!data.direccionres) {
        this.errores.direccionres = true;
        this.send_error("Campo de direccion de residencia Obligatorio!");
      } else if (!data.barriores) {
        this.errores.barriores = true;
        this.send_error("Campo de barrio de residencia Obligatorio!");
      } else if (!data.celularres) {
        this.errores.celularres = true;
        this.send_error("Campo de celular Obligatorio!");
      } else if (!data.correo) {
        this.errores.correo = true;
        this.send_error("Campo de correo Obligatorio!");
      } else if (!data.vlrCred) {
        this.errores.vlrCred = true;
        this.send_error("Campo de valor de credito Obligatorio!");
      } else if (!data.nrocuotas) {
        this.errores.nrocuotas = true;
        this.send_error("Campo de nro cuotas Obligatorio!");
      } else if (!data.fpago) {
        this.errores.fpago = true;
        this.send_error("Campo de forma de pago Obligatorio!");
      } else if (!data.amortizacion) {
        this.errores.amortizacion = true;
        this.send_error("Campo de amortización Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    async format_envio(data) {
      this.card_estado = true;
      let id_sol = data.idsolic || "0";
      let nosolicitud = data.nosolicitud;
      let fecha = data.fecha.replace(/\-/g, "");
      let ciudad = data.ciudad.c_digo_dane_del_municipio;
      let empresa = data.empresatr;
      let barriores = data.barriores;
      let barriotr = data.barriotr;
      let direcciontr = data.direcciontr.trim();
      let direccionres = data.direccionres.trim();
      let correo = data.correo.trim();
      let activo = data.activo;
      let pensionado = data.pensionado;
      let vivienda = data.tipoVivienda;
      // let modalidad = data.modalidad.value;
      // let lineacred = data.linea.value;
      // let clasificacion = data.clasificacion.value;
      // let tipoord = data.tipoord ? data.tipoord.value : 0;
      // let tipoextra = data.tipoextra ? data.tipoextra.value : 0;
      // let tipoconvenio = data.tipoconvenio ? data.tipoconvenio.value : 0;
      // let tipo =
      //   parseInt(tipoord) + parseInt(tipoextra) + parseInt(tipoconvenio);
      let garantia = data.garantia ? data.garantia.value : 0;
      let destino = data.destino ? data.destino.value : 0;

      let valor = data.vlrCred;
      let cuotas = data.nrocuotas;
      let fpago = data.fpago;
      let amortizacion = data.amortizacion;

      let sueldot = data.sueldo1 || "0";
      let otrosingt = data.otrosing1 || "0";
      let descuentost = data.descuentos1 || "0";
      let otrosdesct = data.otrosdesc1 || "0";
      let activost = data.activos1 || "0";
      let pasivost = data.pasivos1 || "0";
      let casat = data.casa1 || "";
      let vehiculot = data.vehiculo1 || "";
      let bancost = data.bancos1 || "";
      let saldototalt = data.saldototal1 || "0";
      let cuotat = data.cuota1 || "0";
      let aldiat = data.obligaciones1 || "";
      let observacionest = data.observaciones || "";

      let idcod1 = data.idcodeudor1 || "0";
      let sueldoc1 = data.sueldo2 || "0";
      let otrosingc1 = data.otrosing2 || "0";
      let descuentosc1 = data.descuentos2 || "0";
      let otrosdescc1 = data.otrosdesc2 || "0";
      let activosc1 = data.activos2 || "0";
      let pasivosc1 = data.pasivos2 || "0";
      let casac1 = data.casa2 || "";
      let vehiculoc1 = data.vehiculo2 || "";
      let bancosc1 = data.bancos2 || "";
      let saldototalc1 = data.saldototal2 || "0";
      let cuotac1 = data.cuota2 || "0";
      let aldiac1 = data.obligaciones2 || "";
      let observacionesc1 = "";

      let idcod2 = data.idcodeudor2 || "0";
      let sueldoc2 = data.sueldo3 || "0";
      let otrosingc2 = data.otrosing3 || "0";
      let descuentosc2 = data.descuentos3 || "0";
      let otrosdescc2 = data.otrosdesc3 || "0";
      let activosc2 = data.activos3 || "0";
      let pasivosc2 = data.pasivos3 || "0";
      let casac2 = data.casa3 || "";
      let vehiculoc2 = data.vehiculo3 || "";
      let bancosc2 = data.bancos3 || "";
      let saldototalc2 = data.saldototal3 || "0";
      let cuotac2 = data.cuota3 || "0";
      let aldiac2 = data.obligaciones3 || "";
      let observacionesc2 = "";

      let idcod3 = data.idcodeudor3 || "0";
      let sueldoc3 = data.sueldo4 || "0";
      let otrosingc3 = data.otrosing4 || "0";
      let descuentosc3 = data.descuentos4 || "0";
      let otrosdescc3 = data.otrosdesc4 || "0";
      let activosc3 = data.activos4 || "0";
      let pasivosc3 = data.pasivos4 || "0";
      let casac3 = data.casa4 || "";
      let vehiculoc3 = data.vehiculo4 || "";
      let bancosc3 = data.bancos4 || "";
      let saldototalc3 = data.saldototal4 || "0";
      let cuotac3 = data.cuota4 || "0";
      let aldiac3 = data.obligaciones4 || "";
      let observacionesc3 = "";

      let primas = this.tableprimas.items;
      let bancos = this.tablebancos.items;
      let tpcreditos = this.form.tpcreditos.llave_rep;

      let dataPrimas = await this.enviar_primas(primas);
      this.enviar_bancos(bancos)
        .then((dataBancos) => {
          let datosEnvio =
            sessionStorage.Sesion +
            "|" +
            nosolicitud +
            "|" +
            ciudad +
            "|" +
            fecha +
            "|" +
            id_sol +
            "|" +
            barriotr +
            "|" +
            activo +
            "|" +
            pensionado +
            "|" +
            vivienda +
            "|" +
            // modalidad +
            // "|" +
            // lineacred +
            // "|" +
            // clasificacion +
            tpcreditos +
            // "|" +
            // tipo +
            "|" +
            garantia +
            "|" +
            valor +
            "|" +
            cuotas +
            "|" +
            fpago +
            "|" +
            amortizacion +
            "|" +
            sueldot +
            "|" +
            otrosingt +
            "|" +
            descuentost +
            "|" +
            otrosdesct +
            "|" +
            activost +
            "|" +
            pasivost +
            "|" +
            casat +
            "|" +
            vehiculot +
            "|" +
            bancost +
            "|" +
            saldototalt +
            "|" +
            cuotat +
            "|" +
            aldiat +
            "|" +
            observacionest +
            "|" +
            idcod1 +
            "|" +
            sueldoc1 +
            "|" +
            otrosingc1 +
            "|" +
            descuentosc1 +
            "|" +
            otrosdescc1 +
            "|" +
            activosc1 +
            "|" +
            pasivosc1 +
            "|" +
            casac1 +
            "|" +
            vehiculoc1 +
            "|" +
            bancosc1 +
            "|" +
            saldototalc1 +
            "|" +
            cuotac1 +
            "|" +
            aldiac1 +
            "|" +
            observacionesc1 +
            "|" +
            idcod2 +
            "|" +
            sueldoc2 +
            "|" +
            otrosingc2 +
            "|" +
            descuentosc2 +
            "|" +
            otrosdescc2 +
            "|" +
            activosc2 +
            "|" +
            pasivosc2 +
            "|" +
            casac2 +
            "|" +
            vehiculoc2 +
            "|" +
            bancosc2 +
            "|" +
            saldototalc2 +
            "|" +
            cuotac2 +
            "|" +
            aldiac2 +
            "|" +
            observacionesc2 +
            "|" +
            idcod3 +
            "|" +
            sueldoc3 +
            "|" +
            otrosingc3 +
            "|" +
            descuentosc3 +
            "|" +
            otrosdescc3 +
            "|" +
            activosc3 +
            "|" +
            pasivosc3 +
            "|" +
            casac3 +
            "|" +
            vehiculoc3 +
            "|" +
            bancosc3 +
            "|" +
            saldototalc3 +
            "|" +
            cuotac3 +
            "|" +
            aldiac3 +
            "|" +
            observacionesc3 +
            "|" +
            destino +
            "|" +
            empresa +
            "|" +
            direcciontr +
            "|" +
            direccionres +
            "|" +
            correo +
            "|" +
            barriores +
            "|";
          post
            .postData({
              url: "Asociados/dlls/Prsolcred.dll",
              data: { importarhtml: datosEnvio, ...dataPrimas, ...dataBancos },
              method: "",
              json: true,
            })
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
            .catch((err) => {
              console.error(err);
              this.send_error("Error al generar Pago");
            });
        })
        .catch((err) => {
          console.error(err);
          this.send_error(err);
        });
    },
    enviar_primas(primas) {
      return new Promise((resolve, reject) => {
        var nuevo = {};
        primas.forEach((el, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let periodo = el.perprima.replace(/\-/g, "");
          let valor = el.vlrprima;

          nuevo[`DATOJ_PR-${format_index}`] = `${periodo}|${valor}|`;
        });

        resolve(nuevo);
      });
    },
    enviar_bancos(bancos) {
      return new Promise((resolve, reject) => {
        var nuevo = {};
        bancos.forEach((el, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");
          let banco = el.tab_banco;
          let tab_cuota = el.tab_cuota;
          let tab_estado = el.tab_estado;
          let tab_saldototal = el.tab_saldototal;

          nuevo[
            `DATOJ_BC-${format_index}`
          ] = `${banco}|${tab_cuota}|${tab_estado}|${tab_saldototal}|`;
        });

        resolve(nuevo);
      });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.fecha = this.$moment().format("YYYY-MM-DD");
      this.cargarconsecutivo();

      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        estado: null,
        idsolic: null,
        nosolicitud: null,
        fecha: null,
        ciudad: null,

        apellido1: null,
        apellido2: null,
        nombres: null,
        direcciontr: null,
        barriotr: null,
        teleftr: null,
        activo: null,
        pensionado: null,
        tipoVivienda: null,
        direccionres: null,
        barriores: null,
        celularres: null,
        correo: null,

        modalidad: null,
        ordinario: null,
        segvarios: null,
        extraor: null,
        mercado: null,
        extraorPrima: null,
        electHog: null,
        credito: null,
        vlrCred: null,

        nrocuotas: null,
        fpago: null,
        amortizacion: null,

        eliminar: false,
      };

      this.errores = {
        estado: false,
        idsolic: false,
        nosolicitud: false,
        fecha: false,
        ciudad: false,

        apellido1: false,
        apellido2: false,
        nombres: false,
        direcciontr: false,
        barriotr: false,
        teleftr: false,
        activo: false,
        pensionado: false,
        tipoVivienda: false,
        direccionres: false,
        barriores: false,
        celularres: false,
        correo: false,

        modalidad: false,
        ordinario: false,
        segvarios: false,
        extraor: false,
        mercado: false,
        extraorPrima: false,
        electHog: false,
        credito: false,
        vlrCred: false,

        nrocuotas: false,
        fpago: false,
        amortizacion: false,
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
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let data_parse = JSON.parse(JSON.stringify(data));
          data_parse.pop();
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
    calcular_egresos() {
      let dctos = this.form.otrosdesc1
        ? parseFloat(this.form.otrosdesc1.replace(/\,/g, ""))
        : 0;
      let otrosdcto = this.form.totaleg1
        ? parseFloat(this.form.totaleg1.replace(/\,/g, ""))
        : 0;
      let tot_egr = dctos + otrosdcto;
      this.form.totaleg1 = tot_egr;
    },
    buscar_id() {
      this.loader = true;
      let idbusq = this.form.idsolic.trim();
      post
        .postData({
          url: "Asociados/dlls/CfRuts01J.dll",
          data: sessionStorage.Sesion + "|" + idbusq + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let datos = data[0];
          this.form.apellido1 = datos.primerApellido_rut.trim();
          this.form.apellido2 = datos.segundoApellido_rut.trim();
          this.form.nombres = datos.nombres_rut.trim();
          this.form.direccionres = datos.direccion_rut.trim();
          this.form.barriores = datos.barrio_rut.trim();
          this.form.barriotr = datos.barriotr_rut.trim();

          this.form.celularres = datos.telefono_rut.trim();
          this.form.correo = datos.correo_rut.trim();
          this.form.direcciontr = datos.dirlabora_rut.trim();
          this.form.teleftr = datos.telelabora_rut.trim();
          var busqueda_ciudad = this.municipios.find(
            (el) => el.c_digo_dane_del_municipio == datos.ciudad_rut
          );
          this.form.ciudad = busqueda_ciudad;
          this.form.empresatr = datos.empresalab_rut.trim();
          this.form.sueldo1 = datos.vlring_rut;
          this.form.otrosing1 = datos.otrosing_rut;
          this.form.totaling1 = datos.toting_rut;
          this.form.otrosdesc1 = datos.totegr_rut;
          this.form.activos1 = datos.totact_rut;
          this.form.pasivos1 = datos.totpas_rut;
          this.calcular_egresos();
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Asociado",
            estado: true,
          });
        });
    },
    buscar_idcod(item) {
      this.loader = true;
      let idbusq = 0;
      if (item === 1) {
        idbusq = this.form.idcodeudor1.trim();
      } else if (item === 2) {
        idbusq = this.form.idcodeudor2.trim();
      } else if (item === 3) {
        idbusq = this.form.idcodeudor3.trim();
      }
      post
        .postData({
          url: "Asociados/dlls/CfRuts01J.dll",
          data: sessionStorage.Sesion + "|" + idbusq + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let datos = data[0];
          if (item === 1) {
            this.form.nombrecod1 = datos.descripcion_rut;
          } else if (item === 2) {
            this.form.nombrecod2 = datos.descripcion_rut;
          } else if (item === 3) {
            this.form.nombrecod3 = datos.descripcion_rut;
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Asociado",
            estado: true,
          });
        });
    },
    cargarconsecutivo() {
      this.loader = true;
      post
        .postData({
          url: "Asociados/dlls/PrSolcredC.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.nosolicitud = parseInt(data[0].nro);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Consecutivo",
            estado: true,
          });
        });
    },
    total_ing() {
      let sueldo = parseInt(this.form.sueldo1);
      let otrosing = parseInt(this.form.otrosing1);
      let totaling = sueldo + otrosing;
      this.form.totaling1 = totaling;

      let descuentos1 = parseInt(this.form.descuentos1);
      let otrosdesc1 = parseInt(this.form.otrosdesc1);
      let totalegr = descuentos1 + otrosdesc1;
      this.form.totaleg1 = totalegr;
    },
    get_primas() {
      if (!this.form.nrocuotas) {
        this.errores.nrocuotas = true;
        this.send_error("Debe ingresar Nro de Cuotas!");
      } else {
        let cuotas = parseInt(this.form.nrocuotas);
        cuotas = cuotas / 12;
        let fecha_inicial = this.form.fecha;
        let ano = fecha_inicial.substring(0, 4);
        let mes = parseFloat(fecha_inicial.substring(5, 7));
        let dia = fecha_inicial.substring(8, 10);

        if (mes < 6) {
          mes = 6;
          dia = 30;
        } else {
          mes = 12;
          dia = 31;
        }
        mes = mes.toString().padStart(2, "0");
        dia = dia.toString().padStart(2, "0");

        let fecha_calc = ano + mes + dia;
        fecha_calc = this.$moment(fecha_calc).format("YYYY-MM-DD");

        const fechaInicio = new Date(fecha_calc);
        const fechaFin = new Date(fecha_inicial);
        fechaFin.setFullYear(fechaFin.getFullYear() + cuotas);

        const fechasSemestrales = [];

        let count = 0;

        while (fechaInicio < fechaFin) {
          ++count;
          fechasSemestrales.push({
            pago_nro: count,
            perprima: new Date(fechaInicio).toISOString().substr(0, 10),
            vlrprima: this.form.vlrPrima,
          });
          fechaInicio.setMonth(fechaInicio.getMonth() + 6);
        }
        this.tableprimas.items = fechasSemestrales;
      }
    },
    add_bancos() {
      let { bancos1, saldototal1, cuota1, estadoblig } = this.form;

      let sel_bancos1 = bancos1 ? bancos1 : "";
      let sel_saldototal1 = saldototal1 ? saldototal1 : "";
      let sel_cuota1 = cuota1 ? cuota1 : "0";
      let sel_estado = estadoblig ? estadoblig : "0";

      if (!sel_bancos1) {
        this.send_error("Debe asignar un banco");
      } else {
        const item = {
          tab_banco: sel_bancos1,
          tab_saldototal: sel_saldototal1,
          tab_cuota: sel_cuota1,
          tab_estado: sel_estado,
        };
        this.tablebancos.items.push(item);
      }
    },
    borrar_banco(item) {
      let index = this.tablebancos.items.indexOf(item);
      this.tablebancos.items.splice(index, 1);
    },
    borrar_prima(item) {
      let index = this.tableprimas.items.indexOf(item);
      this.tableprimas.items.splice(index, 1);
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
