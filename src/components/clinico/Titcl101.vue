<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Prestación de servicios -Imagenología</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="
                    get_consecutivo();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Fecha"
                  outlined
                  v-model="info_servicios.fecha"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  v-model="info_servicios.consecutivo"
                  disabled
                  hide-details
                ></v-text-field>
              </v-col>

            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro"
                  hide-details
                  :loading="load.contratos"
                  v-model="contrato_select"
                  @change="get_servicios"
                  clearable
                  return-object
                  :error="errores.contrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4" v-if="division == 901099286">
                <v-select
                  :items="[
                    { text: 'Laboratorio', value: 1 },
                    { text: 'Salud Ocupacional', value: 2 },
                    { text: 'No Aplica', value: 99 },                    
                  ]"
                  label="División"
                  outlined
                  clearable
                  hide-details
                  @change="
                    errores.division = false;
                  "
                  v-model="info_servicios.division"
                  :error="errores.division"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-text-field
                  label="Autorización"
                  outlined
                  v-model="info_servicios.autorizacion"
                  hide-details
                  :error="errores.autorizacion"
                  @input="errores.autorizacion = false"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue"
                      fab
                      small
                      outlined
                      icon
                      v-on="on"
                      @click="abrir_qr()"
                    >
                      <v-icon>mdi-qrcode-scan</v-icon>
                    </v-btn>
                  </template>
                  <span>Escanear QR</span>
                </v-tooltip>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  v-model="error_auto"
                  disabled
                ></v-text-field>
              </v-col>

            </v-row>
            <v-divider
              class="mt-1 mb-3"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
            <v-row>
              <v-col class="d-flex mt-2" cols="12" sm="4">
                <v-text-field
                  label="Id_Paciente"
                  outlined
                  v-model="info_servicios.paciente"
                  hide-details
                  :error="errores.paciente"
                  @input="errores.paciente = false"
                  @change="errores.paciente = false"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start align-center" cols="12" sm="1">
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
              <v-col class="d-flex justify-start align-center" cols="12" sm="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="crear_paciente()"
                      color="green"
                      fab
                      small
                      icon
                      outlined
                      v-on="on"
                      class="mr-1"
                    >
                      <v-icon>mdi-plus-box-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar Paciente</span>
                </v-tooltip>
              </v-col>

              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  label="Descripcion Paciente"
                  outlined
                  disabled
                  v-model="info_servicios.descripaciente"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="3" cols="3">
                <v-select
                  :items="[
                    { text: 'Nivel 1', value: 1 },
                    { text: 'Nivel 2', value: 2 },
                    { text: 'Nivel 3', value: 3 },
                  ]"
                  label="Nivel"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.nivel"
                ></v-select>
              </v-col>
              <v-col sm="3" cols="3">
                <v-select
                  :items="regimen"
                  label="Régimen"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.regimen"
                ></v-select>
              </v-col>
              <v-col
                class="d-flex"
                cols="6"
                sm="6"
                v-if="info_servicios.paciente"
              >
                <v-autocomplete
                  outlined
                  label="Citas"
                  clearable
                  :items="citas"
                  hide-details
                  return-object
                  :loading="load.citas"
                  :item-value="format_val_cita"
                  :item-text="format_cita"
                  v-model="info_servicios.cita"
                  :error="errores.cita"
                  chips
                  multiple
                  @change="errores.cita = false"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
            <v-row>
              <v-col>
                <v-card-subtitle
                  class="
                    subtitle-1
                    font-weight-medium
                    grey--text
                    text--darken-2
                    m0
                  "
                  >Detalle servicios</v-card-subtitle
                >
              </v-col>
              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4"
                  dark
                  class
                  @click="
                    dialogo.estado = true;
                    dialogo.tipo = true;
                  "
                  depressed
                >
                  <v-icon size="20" left>mdi-basket-outline</v-icon>Agregar
                  servicio
                </v-btn>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:item.index="{ item }">
                  {{
                    tablaDetalle.data
                      .map(function (x) {
                        return x.codigo;
                      })
                      .indexOf(item.codigo) + 1
                  }}
                </template>
                <template v-slot:item.descripcion="{ item }">
                  <b>{{ item.descripcion.trim() }}</b>
                </template>
                <template v-slot:item.valor_iva="{ item }">
                  {{ formatNumero(item.iva_total) }}
                </template>
                <template v-slot:item.subtotal="{ item }">
                  {{
                    formatNumero(item.valor.replace(/\,/g, "") * item.cantidad)
                  }}
                </template>
                <template v-slot:item.sub_total="{ item }">
                  {{ formatNumero(item.sub_total) }}
                </template>
                <template v-slot:item.total="{ item }">
                  {{ formatNumero(item.total) }}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="
                          edit_item(item);
                          dialogo.tipo = false;
                        "
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Modificar item</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red darken-4"
                        fab
                        small
                        icon
                        v-on="on"
                        @click="delete_item(item)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar item</span>
                  </v-tooltip>
                </template>
                <template v-slot:body.append>
                  <td colspan="5" class="text-right">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.sub_total || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total_iva || 0) }}
                  </td>
                  <td class="text-xs-right text-center">
                    {{ formatNumero(tablaDetalle.totales.total || 0) }}
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="
                  subtitle-1
                  font-weight-medium
                  grey--text
                  text--darken-2
                  ma-0
                  mx-0
                "
                >Cierre de Servicio</v-card-subtitle
              >
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Copago"
                  outlined
                  hide-details
                  prefix="$"
                  v-money="money"
                  v-model="info_servicios.copago"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Cuota moderadora"
                  outlined
                  hide-details
                  prefix="$"
                  v-money="money"
                  v-model="info_servicios.cuotaModeradora"
                ></v-text-field>
              </v-col>
              <!-- <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Descuento"
                  outlined
                  hide-details
                  prefix="$"
                  v-money="money"
                  v-model="info_servicios.descuento"
                ></v-text-field>
              </v-col> -->
              <v-col sm="3" cols="12">
                <v-select
                  :items="[
                    { text: 'Efectivo', value: 1 },
                    { text: 'Crédito', value: 2 },
                    { text: 'Cortesia', value: 3 },
                  ]"
                  label="Medio de pago"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.medio_pago"
                ></v-select>
              </v-col>
              <v-col sm="12" cols="4">
                <v-autocomplete
                  :items="diagnosticos"
                  :item-text="format_diagnostico"
                  item-value="codigo"
                  label="Diagnostico"
                  outlined
                  clearable
                  hide-details
                  v-model="info_servicios.diagnostico"
                  :error="errores.diagnostico"
                  @change="errores.diagnostico = false"
                ></v-autocomplete>
              </v-col>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="info_servicios.observaciones"
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-end col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                @click="grabar_servicio"
                :disabled="grabar.disabled"
                >Grabar Servicio</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                @click="imprimir"
                :disabled="impresion.disabled"
                :loading="load.impresion"
                >Imprimir servicio</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions>
          <v-row class="d-flex justify-end col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                :loading="load.generar_factura"
                :disabled="disabled.generar_factura"
                @click="generar_factura"
                >Generar Factura</v-btn
              >
            </v-col>
            <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                :loading="load.imprimir_factura"
                :disabled="disabled.imprimir_factura"
                @click="imprimir_factura"
                >Imprimir Factura</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

    </v-flex>
    <v-dialog v-model="qr.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Escanea el código QR</v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Código"
            hide-details
            ref="codigo_qr"
            @keyup.enter="leer_qr"
            v-model="qr.codigo"
            clearable
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text large depressed @click="qr.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo.estado" max-width="600" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Agregar item</v-card-title>
        <v-form ref="formArticulo">
          <div class="pa-4 px-8">
            <v-row sm="12" no-gutters>
              <v-autocomplete
                label="Servicio"
                :items="servicios"
                outlined
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="servicio_select.codigo"
                :item-text="format_servicios"
                @change="change_servicio_modal"
                :loading="load.servicios"
              ></v-autocomplete>
            </v-row>
            <v-row>
              <v-col sm="6">
                <v-text-field
                  label="Grupo"
                  outlined
                  disabled
                  hide-details
                  v-model="servicio_select.grupo"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  label="IVA"
                  outlined
                  disabled
                  hide-details
                  v-model="servicio_select.tar_iva"
                  suffix="%"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Valor"
                  outlined
                  hide-details
                  suffix="$"
                  v-money="money"
                  v-model="servicio_select.valor"
                  @input="calcularSubtotal"
                  ref="input_valor"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-text-field
                  label="Cantidad"
                  outlined
                  hide-details
                  v-model="servicio_select.cantidad"
                  @input="calcularSubtotal"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col sm="6">
                <v-text-field
                  label="Total"
                  outlined
                  hide-details
                  disabled
                  v-model="servicio_select.total"
                  ref="input_total"
                  v-money="money2"
                  suffix="$"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-form>
        <v-card-actions>
          <v-row class="d-flex justify-end">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="red darken-4 "
                text
                class
                block
                @click="
                  dialogo.estado = false;
                  clear_form();
                "
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                v-if="dialogo.tipo"
                color="green darken-1"
                dark
                block
                depressed
                @click="agregar_servicio"
                >Agregar servicio</v-btn
              >
              <v-btn
                v-else
                color="green darken-1"
                dark
                block
                @click="modificar_servicio"
                >Modificar articulo</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogopac.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Agregar Paciente</span>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '1px', 'border-color': 'orange' }"
          />
        </v-card-title>

        <v-card-text class="pb-0" ref="form">
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="tipoid"
                label="Tipo identificacion"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.tipoid"
                :error="errores.tipoid"
                @input="errores.tipoid = false"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Id_Paciente"
                outlined
                required
                v-model="form.idpaciente"
                hide-details
                :error="errores.idpaciente"
                @input="errores.idpaciente = false"
                @change="errores.idpaciente = false"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="1er apellido"
                clearable
                outlined
                required
                v-model="form.primerApellido"
                :error="errores.primerApellido"
                @input="errores.primerApellido = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="2do apellido"
                clearable
                outlined
                v-model="form.segundoApellido"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Primer Nombre"
                clearable
                outlined
                required
                v-model="form.nombres"
                :error="errores.nombres"
                @input="errores.nombres = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Segundo Nombre"
                clearable
                outlined
                required
                v-model="form.nombre2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Correo"
                clearable
                outlined
                v-model="form.correo"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Telefono"
                clearable
                outlined
                v-model="form.telefono"
                counter="10"
                :rules="[(v) => (v && v.length <= 10) || 'Maximo 15 digitos']"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="5">
              <v-text-field
                label="Direccion"
                clearable
                outlined
                required
                v-model="form.direccion"
                :rules="[(v) => (v && v.length <= 60) || 'Maximo 60 digitos']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
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
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Ciudad"
                v-model="form.ciudad"
                :items="filterMunicipios"
                item-value="value"
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                ref="menu"
                v-model="pickerNacimiento"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.nacimiento"
                    :value="format_fecha_nacimiento"
                    label="Fecha de nacimiento"
                    append-icon="event"
                    outlined
                    v-on="on"
                    @change="calcularEdadpac"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.nacimiento"
                  @input="pickerNacimiento = false"
                  @change="calcularEdadpac"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Soltero', value: 0 },
                  { text: 'Casado', value: 1 },
                  { text: 'Union libre', value: 3 },
                ]"
                label="Estado civil"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.estadoCivil"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="regimen"
                label="Regimen"
                outlined
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
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Eps"
                v-model="form.eps"
                :items="eps"
                item-value="value"
                outlined
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Masculino', value: 0 },
                  { text: 'Femenino', value: 1 },
                ]"
                label="Genero"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.genero"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Edad"
                disabled
                outlined
                type="text"
                v-model="form.edad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Urbana', value: 0 },
                  { text: 'Rural', value: 1 },
                ]"
                label="Zona"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.zona"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Nivel 1', value: 1 },
                  { text: 'Nivel 2', value: 2 },
                  { text: 'Nivel 3', value: 3 },
                ]"
                label="Nivel"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.nivel"
                item-text="text"
                item-value="value"
                required
                :rules="[(v) => !!v || 'Campo es obligatorio']"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '1px', 'border-color': 'orange' }"
        />

        <v-card-actions>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_paciente()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogopac.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>

import post from "../../methods.js";


export default {

  data() {
    return {
      pickerNacimiento: false,
      empresa: [],
      form: {},
      eps: [],
      ciudades_dian: [],
      departamentos: [],
      card_estado: false,
      filterMunicipios: [],
      tipoid: [
        { text: "Cedula Ciudadania", value: "CC" },
        { text: "Tarjeta Identidad", value: "TI" },
        { text: "Registro Civil", value: "RC" },
        { text: "Permiso Esp.Permanencia", value: "PE",},
        { text: "Cedula Extranjería", value: "CE" },
        { text: "Adulto Sin Identificar", value: "AS" },        
        { text: "Menor Sin Identificar", value: "MS" },
        { text: "Certificado Nacido Vivo", value: "NV" },
        { text: "Pasaporte", value: 'PA' },
        { text: "Carnet Diplomatico", value: "CD" },
        { text: "Salvo Conducto", value: "SC" },
        { text: "Permiso por Proteccion Temporal", value: "PT" },

      ],
      regimen: [
        { text: "Subsidiado", value: 1 },
        { text: "Contributivo", value: 8 },
        { text: "Particular", value: 2 },
        { text: "Especial", value: 3 },
        { text: "Excepción", value: 4 },
        { text: "Otro", value: 9 },
      ],

      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 20) || "Maximo 20 digitos",
      ],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+\..+/.test(v) || "E-mail no es valido",
        (v) => (v && v.length <= 60) || "Maximo 60 digitos",
      ],

      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      load: {
        contratos: false,
        pacientes: false,
        servicios: false,
        btn_enviar: false,
        citas: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
      },
      load_card: false,
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "index",
          },
          {
            text: "Código",
            align: "center",
            value: "codigo",
          },
          {
            text: "Lote",
            align: "center",
            value: "lote",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descripcion",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "Sub-total",
            align: "center",
            value: "sub_total",
          },
          {
            text: "Iva",
            align: "center",
            value: "valor_iva",
          },
          {
            text: "Total",
            align: "center",
            value: "total",
          },
          {
            text: " ",
            align: "center",
            value: "action",
          },
        ],
        data: [],
        totales: {},
      },
      contratos: [],
      pacientes: [],
      servicios: [],
      agencias: [],
      info_servicios: {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: null,
        cuotaModeradora: null,
        paciente: null,
        observaciones: null,
        descuento: null,
        idpaciente: null,
        medio_pago: 1,
        cita: null,
        descripaciente: null,
        diagnostico: null,
      },
      contrato_select: null,
      dialogo: {
        estado: false,
        tipo: true,
      },
      personal: [],
      error_auto: null,
      division: 0,

      servicio_select: {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      },
      edit_index: -1,
      errores: {
        contrato: false,
        paciente: false,
        autorizacion: false,
        copago: false,
        cuota: false,
        observaciones: false,
        cita: false,
        diagnostico: false,
        idpaciente: false,
        nombres: false,
        primerApellido: false,
        departamento: false,
        ciudad: false,
        nacimiento: false,
        regimen: false,
        division: false,
        eps: false,
        genero: false,
        zona: false,
        punto_fact: false,
      },
      citas: [],
      diagnosticos: [],
      impresion: {
        disabled: true,
        consecutivo: null,
        ruta_pdf: null,
        // consecutivo: "01000000000006"
      },
      grabar: {
        disabled: false,
      },
      disabled: {
        generar_factura: true,
        imprimir_factura: true,
      },
      datos_factura: {
        fecha_atencion: null,
        consecutivo: null,
      },
      qr: {
        estado: false,
      },
      format_fecha_nacimiento: null,
    };
  },
  created() {
    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        $this.tablaDetalle.totales.sub_total = 0;
        $this.tablaDetalle.totales.total_iva = 0;
        $this.tablaDetalle.totales.total = 0;

        e.forEach((val) => {
          let sub_total =
            parseFloat(val.sub_total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.sub_total += sub_total;

          let total_iva = parseFloat(val.iva_total) || 0;
          $this.tablaDetalle.totales.total_iva += total_iva;

          let total = parseFloat(val.total.toString().replace(/\,/g, "")) || 0;
          $this.tablaDetalle.totales.total += total;
        });
      },
      { deep: true }
    );

    this.load_card = true;
    this.cargar_empresa();
    // this.get_contratos();

    this.cargarTablaAg();
    this.get_diagnosticos();
    this.get_fecha();
    this.cargarEps();
    this.cargarCiudades();
    // this.registrar_turno();
  },
  watch: {},
  methods: {
    format_fecha() {
      let fecha = this.form.nacimiento || "";
      let format = fecha ? fecha.split("-").reverse().join("-") : null;
      this.format_fecha_nacimiento = format;
      this.calcularEdadpac();
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
    calcularEdadpac() {
      let fecha_nac = this.$moment(this.form.nacimiento).format("YYYY-MM-DD");
      // let hoy = this.$moment().format("YYYY-MM-DD");
      let dias = this.$moment().diff(fecha_nac, "days");
      let edad = null;

      if (dias < 30) {
        edad = dias + " - " + "dias";
      } else {
        if (dias < 365) {
          edad = this.$moment().diff(fecha_nac, "months") + " - meses";
        } else {
          edad = this.$moment().diff(fecha_nac, "years") + " - años";
        }
      }

      this.form.edad = edad;
    },
    cargarEps: function () {
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k, v) => {
            this.eps.push({
              value: k.codigo,
              text: k.nombre,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
        });
    },
    crear_paciente() {
      this.dialogopac.estado = true;
      this.form.departamento = this.pacientes.ciudad.substring(0, 2);
      this.get_municipios();
      this.form.idpaciente = this.info_servicios.paciente.trim();
      this.form.primerApellido = this.pacientes.primerApellido.trim();
      this.form.segundoApellido = this.pacientes.segundoApellido.trim();
      this.form.nombres = this.pacientes.nombres.trim();
      this.form.nombre2 = this.pacientes.nombre2.trim();
      this.form.correo = this.pacientes.correo.trim();
      this.form.telefono = this.pacientes.telefono.trim();
      this.form.direccion = this.pacientes.direccion.trim();
      let busqueda_tipo = this.tipoid.find(
        (el) => el.value == this.pacientes.tipoid.trim()
      );
      this.form.tipoid = busqueda_tipo;
      this.form.ciudad = this.pacientes.ciudad.trim() || null;
      this.form.nacimiento = this.$moment(this.pacientes.nacimiento).format(
        "YYYY-MM-DD"
      );
      this.form.estadoCivil = { value: parseInt(this.pacientes.estadoCivil) };
      this.form.regimen = { value: parseInt(this.pacientes.regimen) };
      this.form.eps = this.pacientes.eps;
      this.form.genero = { value: parseInt(this.pacientes.genero) };
      this.form.zona = { value: parseInt(this.pacientes.zona) };
      this.form.nivel = { value: parseInt(this.pacientes.nivel) };
      this.calcularEdadpac();

      // var busqueda_tipo = this.ruts3.find(
      //   (el) => el.identificacion_rut == item.idcolabora_rep
      // );

      // this.form.nacimiento = this.pacientes.nacimiento.trim();
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
    abrir_qr() {
      this.qr.estado = true;
      this.qr.codigo = null;
      setTimeout(() => {
        this.$refs.codigo_qr.focus();
      }, 200);
    },
    leer_qr() {
      var codigo = this.qr.codigo;
      var format = codigo.substr(1);
      format = format.substr(0, format.length - 1);

      var json = JSON.parse(`{${format}}`);
      var valor = json.Ubicacion + json.Autorizacion.padStart(8, "0");
      this.info_servicios.autorizacion = valor;
      this.qr.estado = false;
    },
    asignarTurno() {
      const cod_sede = this.info_servicios.cita[0].agencia;
      const cod_turno = parseFloat(this.info_servicios.cita[0].idagenda);
      let paciente = parseFloat(this.info_servicios.cita[0].id_paciente);

      post
        .postData({
          url: "Dispensa/dlls/Prfilaturno.dll",
          data: sessionStorage.Sesion + "|" + cod_sede + "|" + cod_turno + "|" + paciente + "|",
          method: "",
        })
        .then((dataTurno) => {
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al asignar turno",
            estado: true,
          });
        });
    },    
  
    registrar_turno() {
      var paciente = this.info_servicios.paciente;
      var citas = this.info_servicios.cita;
      var consecutivo = this.impresion.consecutivo;

      // var paciente = JSON.parse(
      //   '{"tipoid":"CC","identificacion":"000000000242476","primerApellido":"RODRIGUEZ           ","segundoApellido":"REY                 ","nombres":"DAVID               ","correo":"                                                            ","telefono":"0000001111","direccion":"VILLA ORTIZ                                                 ","ciudad":"50001","nacimiento":"19240512","estadoCivil":"0 ","regimen":"1 ","nomregimen":"subsidiado  ","nivel":"2 ","eps":"CCF055","genero":"0 ","edad":"0","zona":"0 ","contrasena":"123         ","fechaAct":"20200307","estado":"1 "}'
      // );
      // var citas = JSON.parse(
      //   '[{"identificacion":"000000000009001","nro_admon":"000000004400","descripcion":"SALA RX","fecha":"20200414","id_hora":"07:00","id_paciente":"000000000242476","descrip_paciente":"DAVID RODRIGUEZ REY","cod_servicio":"87.0.0.01","desc_servicio":"RADIOGRAFIA DE CRANEO SIMPLE"},{"identificacion":"000000000009003","nro_admon":"226540000000","descripcion":"SALA ECOGRAFIAS","fecha":"20200306","id_hora":"10:06","id_paciente":"000000000242476","descrip_paciente":"DAVID RODRIGUEZ REY","cod_servicio":"88.1.5.10","desc_servicio":"ECOGRAFIA TESTICULAR CON TRANSDUCTOR DE 7 MHZ O MAS"},{"identificacion":"000000000009002","nro_admon":"000000005020","descripcion":"SALA MAMOGRAFIA","fecha":"20200524","id_hora":"06:00","id_paciente":"000000000242476","descrip_paciente":"DAVID RODRIGUEZ REY","cod_servicio":"87.6.8.02","desc_servicio":"MAMOGRAFIA BILATERAL"}]'
      // );
      // var consecutivo = "01000000002889";
      var nit_paciente = parseInt(paciente);
      var descripcion = this.info_servicios.descripaciente.trim();

      // var descripcion = `${paciente.nombres.trim()} ${paciente.primerApellido.trim()} ${paciente.segundoApellido.trim()}`;
      var sede = consecutivo.substr(0, 2);
      var batch = fb.db.batch();
      citas.forEach((el) => {
        let obj = {
          nit_paciente,
          nombre_paciente: descripcion,
          empresa: parseInt(sessionStorage.Sesion.substr(0, 15)),
          fecha_registro: new Date().toLocaleString(),
          fecha_factura: new Date()
            .toLocaleString()
            .split(" ")[0]
            .replace(/,/g, ""),
          sede,
          consecutivo,
          cita_id: el.identificacion,
          cita_fecha: el.fecha,
          cita_hora: el.id_hora,
          estado: 0,
        };

        var docRef = fb.$turnos.doc();
        batch.set(docRef, obj);
      });

      batch
        .commit()
        .then((data) => {
          console.log("Turno agendado correctamente", data);
        })
        .catch((err) => {
          console.error(err);
          this.alerta_error("Ha ocurrido un error registrando el turno");
        });
    },
    buscar_paciente() {
      let $this = this;
      this.info_servicios.descripaciente = null;
      let paciente = this.info_servicios.paciente.trim();
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data[0];
          this.info_servicios.descripaciente =
            $this.pacientes.descrip_rep.trim();
          this.get_citas();
          this.get_autoriza(0);
          this.change_regimen();
        })
        .catch((err) => {
          console.log(err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    
    get_contratos() {
      var $this = this;
     let punto = $this.form.punto_fact.codigo_agc;
      // let punto = "0000";

      post
        .postData({
          url: "Clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion  + "|" + 2 + "|" + punto + "|",
          method: "POST",
        })
        .then((data) => {
          $this.contratos = data;
          $this.load.contratos = false;
          // $this.get_consecutivo();
        })
        .catch((err) => {
          $this.load.contratos = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    get_consecutivo() {
      var $this = this;
      let punto = this.form.punto_fact.codigo_agc;

      post
        .postData({
          url: "clinico/dlls/titCL101j.dll",
          data: sessionStorage.Sesion + "|" + punto + "|",
          method: "POST",
        })
        .then((data) => {
          $this.info_servicios.consecutivo = parseFloat(data[0].nro);
          this.get_contratos()
          // $this.get_pacientes();
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo",
            estado: true,
          });
        });
    },
    get_pacientes() {
      var $this = this;
      post
        .postData({
          url: "Clinico/dlls/titCL301j.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          $this.pacientes = data;
          $this.load.pacientes = false;
          $this.get_diagnosticos();
        })
        .catch((err) => {
          $this.load.pacientes = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true,
          });
        });
    },
    get_servicios() {
      this.error_auto = " ";
      var $this = this;
      $this.errores.contrato = false;
      if ($this.contrato_select) {
        $this.load.servicios = true;
        post
          .postData({
            url: "Clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + $this.contrato_select.nro + "|",
            method: "POST",
          })
          .then((data) => {
            $this.load.servicios = false;
            $this.servicios = data[0].servicios;
          })
          .catch((err) => {
            $this.load.servicios = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    get_fecha() {
      this.info_servicios.fecha = this.$moment().format("YYYY-MM-DD");
    },
    get_citas() {
      var $this = this;
      if (this.info_servicios.paciente) {
        $this.load.citas = true;
        var id_paciente = $this.info_servicios.paciente;
        post
          .postData({
            url: "Clinico/dlls/titCL102JP.dll",
            data: sessionStorage.Sesion + "|" + id_paciente + "|1|",
            method: "POST",
          })
          .then((data) => {
            data.pop();
            this
            $this.load.citas = false;
            $this.citas = data;

            $this.citas.unshift({
              id_hora: "00:00",
              desc_servicio: "Sin Asignar",
              cod_servicio: "0",
              descrip_paciente: "Sin Asignar",
              fecha: "0",
              id_paciente: "8600723",
              identificacion: "8600723",
              nro_admon: "111",
            });
          })
          .catch((err) => {
            console.error("Error: ", err);
            $this.load.citas = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar las citas del paciente",
              estado: true,
            });
          });
      } else {
        $this.citas = [];
        $this.info_servicios.cita = [];
      }
    },
    async get_autoriza(valida) {
      return new Promise((resolve)=> {
        let valida_auto = 0;

        if (this.contrato_select) {
          let eps = this.contrato_select.identificacion;
          let autorizacion = this.info_servicios.autorizacion;
          post
            .postData({
              url: "Clinico/dlls/ClAutorizaJ.dll",
              data: sessionStorage.Sesion +
              "|" +
              eps + 
              "|" +
              autorizacion +
              "|",
  
              method: "POST",
            })
            .then((data) => {
              resolve(valida_auto)
            })
            .catch((err) => {
              console.log(err)
              valida_auto = 1
              this.error_auto = err.Mensaje[0].msg
              this.$emit("snack", {
                color: "error",
                text: "Autorización ya Facturada",
                estado: true,
              });
              resolve(valida_auto)
            });
            // return valida_auto
        } else {
          resolve(valida_auto)
        }
      })
    },    
    change_regimen: function () {
      if (this.info_servicios.paciente) {
        var busqueda_regimen = this.regimen.find(
          (el) => el.value == parseInt(this.pacientes.regimen)
        );
        this.info_servicios.regimen = busqueda_regimen;
      }
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
    format_val_cita(val) {
      return val.identificacion + val.fecha + val.id_hora;
    },
    format_cita(val) {
      return (
        this.$moment(val.fecha).format("YYYY/MM/DD") +
        " " +
        val.id_hora +
        " - " +
        val.desc_servicio
      );
    },
    format_contrato(val) {
      return parseInt(val.nro.trim()) + " - " + val.detalle.trim();
    },
    format_pacientes(val) {
      return `${val.identificacion} - ${val.primerApellido} ${val.segundoApellido} ${val.nombres}`;
    },
    format_servicios(val) {
      return `${val.codigo} - ${val.descripcion}`;
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    calcularSubtotal() {
      var $this = this;
      var item = this.servicio_select;
      if (item.codigo) {
        var iva = parseFloat(item.tar_iva) || 0,
          parse_iva = iva / 100,
          valor_neto = parseFloat(item.valor.replace(/\,/g, "")) || 0,
          iva_tmp = parse_iva + 1,
          subtotal = valor_neto * iva_tmp,
          cantidad = parseFloat(item.cantidad) || 0,
          total = subtotal * cantidad;

        $this.servicio_select.total = total.toFixed(2);
        this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
          total.toFixed(2);

        var valor_iva = valor_neto * parse_iva;
        $this.servicio_select.valor_iva = valor_iva;
        $this.servicio_select.iva_total = valor_iva * cantidad;
        $this.servicio_select.sub_total = valor_neto * cantidad;
      }
    },
    change_servicio_modal(data) {
      if (data) {
        var copia = JSON.parse(JSON.stringify(data));
        this.servicio_select = copia;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          copia.valor;
        this.servicio_select.cantidad = this.servicio_select.cantidad || 1;
        this.calcularSubtotal();
      } else this.clear_form();
    },
    agregar_servicio() {
      var item = JSON.parse(JSON.stringify(this.servicio_select));
      let valor = item.valor;

      if (valor != 0) {
        item.lote = "00";
        item.total = item.total.replace(/\,/g, "");
        this.tablaDetalle.data.push(item);
        this.dialogo.estado = false;
        this.clear_form();
      } else {
        this.alerta_error("El valor no puede ser Cero");
      }
    },
    clear_form() {
      this.servicio_select = {};
      this.error_auto = " ";
      this.servicio_select = {
        grupo: null,
        tar_iva: null,
        valor: 0,
        total: 0,
      };
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = 0;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value = 0;
      this.edit_index = -1;
    },

    modificar_servicio() {
      var $this = this;
      if (this.edit_index > -1) {
        Object.assign(
          this.tablaDetalle.data[this.edit_index],
          $this.servicio_select
        );
      }

      this.dialogo.estado = false;
      this.clear_form();
    },
    edit_item(item) {
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
        item.valor;
      this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
        parseFloat(item.total.replace(/\,/g, "")).toFixed(2);

      this.dialogo.estado = true;
      this.servicio_select = JSON.parse(JSON.stringify(item));
      this.edit_index = this.tablaDetalle.data.indexOf(item);
    },
    delete_item: function (item) {
      const index = this.tablaDetalle.data.indexOf(item);
      this.tablaDetalle.data.splice(index, 1);
    },
    alerta_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    calcularEdad(dateString) {
      var today = new Date();
      var DOB = new Date(dateString);
      var totalMonths =
        (today.getFullYear() - DOB.getFullYear()) * 12 +
        today.getMonth() -
        DOB.getMonth();
      totalMonths += today.getDay() < DOB.getDay() ? -1 : 0;
      var years = today.getFullYear() - DOB.getFullYear();
      if (DOB.getMonth() > today.getMonth()) years = years - 1;
      else if (DOB.getMonth() === today.getMonth())
        if (DOB.getDate() > today.getDate()) years = years - 1;

      var days;
      var months;
      var a;

      if (DOB.getDate() > today.getDate()) {
        months = totalMonths % 12;
        if (months == 0) months = 11;
        var x = today.getMonth();
        switch (x) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12: {
            a = DOB.getDate() - today.getDate();
            days = 31 - a;
            break;
          }
          default: {
            a = DOB.getDate() - today.getDate();
            days = 30 - a;
            break;
          }
        }
      } else {
        days = today.getDate() - DOB.getDate();
        if (DOB.getMonth() === today.getMonth()) months = totalMonths % 12;
        else months = (totalMonths % 12) + 1;
      }

      return { años: years, meses: months, dias: days };
    },
    enviar_servicio(linea_envio) {
      var $this = this;
      this.load_card = true;
      post
        .postData({
          url: "clinico/dlls/TITCL101.dll",
          data: linea_envio,
          method: "POST",
        })
        .then((data) => {
          this.load_card = false;

          $this.load.btn_enviar = false;
          $this.grabar.disabled = true;
          $this.impresion.disabled = false;
          $this.impresion.consecutivo = data[0].consecutivo;
          $this.impresion.ruta_pdf = data[1].rutapdf;
          // $this.registrar_turno();
          this.asignarTurno();

          $this.$emit("snack", {
            color: "success",
            text: "Registro grabado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          $this.load.btn_enviar = false;
          $this.$emit("snack", {
            color: "error",
            text: err,
            estado: true,
          });
        });
    },
    async grabar_servicio() {
      var $this = this;
      if (!$this.contrato_select) {
        $this.errores.contrato = true;
        $this.alerta_error("Debes seleccionar un contrato");
      } else if (!$this.form.punto_fact) {
        $this.errores.punto_fact = true;
        $this.alerta_error("Debes seleccionar una sede");
      } else if (!$this.info_servicios.paciente) {
        $this.errores.paciente = true;
        $this.alerta_error("Debes seleccionar un paciente");
      } else if (!$this.info_servicios.autorizacion) {
        $this.errores.autorizacion = true;
        $this.alerta_error("Ingresa un número de autorización");
      } else if (!$this.info_servicios.cita) {
        $this.errores.cita = true;
        $this.alerta_error("Debes seleccionar una cita");
      } else if ($this.tablaDetalle.data.length <= 0) {
        $this.alerta_error("Debes ingresar al menos un servicio en el detalle");
      } else if (!$this.info_servicios.medio_pago) {
        $this.alerta_error("Selecciona un medio de pago");
      } else if (!$this.info_servicios.diagnostico) {
        $this.errores.diagnostico = true;
        $this.alerta_error("Selecciona un diagnostico");
      } else if (!$this.info_servicios.division && this.division == 901099286) {
        $this.errores.division = true;
        $this.alerta_error("Selecciona una División");
      } else {
        let valida = await this.get_autoriza(valida)
        if (valida == 1){
          this.$emit("snack", {
              color: "error",
              text: "Autorización ya Facturada",
              estado: true,
            });
        }else{
          this.load.btn_enviar = true;
        var fechaserv = this.info_servicios.fecha.replace(/\-/g, "");
        // var fecha_serv = this.info_servicios.fecha.replace(/\-/g, "")

        var fecha_actual = new Date(),
          mes = (fecha_actual.getMonth() + 1).toString().padStart(2, "0"),
          dia = fecha_actual.getDate().toString().padStart(2, "0"),
          año = fecha_actual.getFullYear().toString(),
          detalle = $this.tablaDetalle.data;

        // this.info_servicios.paciente.nacimiento = "19970908";
        var fecha = this.$moment($this.pacientes.nacimiento).format(
            "YYYY/MM/DD"
          ),
          edad = $this.calcularEdad(fecha);
        var punto = this.form.punto_fact.codigo_agc;
        let nivel = this.info_servicios.nivel ? this.info_servicios.nivel : 1;
        let division = this.info_servicios.division? this.info_servicios.division : 99;
        let regimen = this.info_servicios.regimen? this.info_servicios.regimen.value : 1;

        var linea_envio =
          sessionStorage.Sesion +
          "|" +
          this.info_servicios.consecutivo +
          "|" +
          fechaserv +
          // (año + mes + dia) +
          "|" +
          this.info_servicios.paciente +
          "|" +
          this.contrato_select.identificacion +
          "|" +
          edad.años +
          "|" +
          edad.meses +
          "|" +
          edad.dias +
          "|" +
          this.info_servicios.copago.replace(/\,/g, "") +
          "|" +
          this.info_servicios.cuotaModeradora.replace(/\,/g, "") +
          "|" +
          "0" +
          // this.info_servicios.descuento.replace(/\,/g, "") +
          "|" +
          this.info_servicios.medio_pago +
          "|" +
          this.tablaDetalle.data.length +
          "|" +
          this.contrato_select.nro +
          "|" +
          (this.info_servicios.observaciones || "") +
          "|" +
          this.info_servicios.autorizacion +
          "|" +
          // this.info_servicios.cita.nro_admon +
          0 +
          "|" +
          this.info_servicios.diagnostico.trim() +
          "|" +
          nivel +
          "|" +
          // this.info_servicios.cita.identificacion +
          0 +
          "|" +
          // this.info_servicios.cita.fecha +
          0 +
          "|" +
          // this.info_servicios.cita.id_hora +
          0 +
          "|" +
          0 +
          "|" +
          0 +
          "|" +
          regimen +
          "|" +
          punto +
          "|" +
          division +
          "|";

        var linea_items = "";
        detalle.forEach((item) => {
          linea_items +=
            item.codigo.trim() +
            ";" +
            item.cantidad +
            ";" +
            item.sub_total.toString() +
            ";" +
            item.iva_total.toString() +
            ";" +
            item.lote +
            ";";
        });

        var tabla_agenda = "";
        this.info_servicios.cita.forEach((obj) => {
          obj.id_hora = obj.id_hora? obj.id_hora.replace(/\:/g, "") : 0 
          tabla_agenda +=
            obj.identificacion +
            obj.fecha +
            obj.id_hora.replace(/\:/g, "") +            
            ";";
        });
        linea_envio += linea_items + "|" + tabla_agenda + "|";

        $this.enviar_servicio(linea_envio);

        //DESACTIVA DOCS-- SE DEBE DEJAR ACTIVA LA LINEA 1569///////
        // this.format_info_docs(detalle)
        //   .then(data => {
        //     if (data.code == 0) {
        //       var id_api = data.msj;
        //       var linea = "";
        //       id_api.forEach(val => {
        //         linea += `${val.id};`;
        //       });

        //       linea_envio += linea + "|";
        //       $this.enviar_servicio(linea_envio);
        //     } else {
        //       $this.load.btn_enviar = false;
        //       $this.$emit("snack", {
        //         color: "error",
        //         text:
        //           "Ha ocurrido un error creando los documentos en la nube. Contacte con el administrador.",
        //         estado: true
        //       });
        //     }
        //   })
        //   .catch(err => {
        //     $this.load.btn_enviar = false;
        //     $this.$emit("snack", {
        //       color: "error",
        //       text: "Ha ocurrido un error creando los documentos en la nube.",
        //       estado: true
        //     });
        //     console.error("Error", err);
        //   });
        //FIN DESACTIVA DOCS///////

        }

      }
    },
    format_info_docs(detalle) {
      return new Promise((resolve, reject) => {
        var consecutivo = parseInt(this.info_servicios.consecutivo)
          .toString()
          .padStart(8, "0");
        var documentos = [];
        detalle.forEach((val, index) => {
          var cod = val.codigo;
          var item = (index + 1).toString().padStart(2, "0");
          var key = `01${consecutivo}${cod}${item}`;
          documentos.push({
            titulo: key,
            // plantilla: cod,
            plantilla: "87.0.0.01",
            index,
          });
        });

        var envio = {
          documentos,
          correo_auth: "contacto@titansoluciones.com",
        };

        var formData = new FormData();
        formData.append("data", JSON.stringify(envio));

        fetch("https://server1ts.net//financiero/services/docs/add_file.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    },
    imprimir() {
      var $this = this;
      // $this.impresion.consecutivo = "01000000000041";

      var numero = $this.impresion.consecutivo,
        dato1 = numero.substring(0, 2),
        dato2 = numero.substring(2, numero.length);
      var fecha = $this.info_servicios.fecha.replace(/\-/g, "");

      $this.load.impresion = true;
      post
        .postData({
          url: "Clinico/dlls/titCL101R.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            dato1 +
            "|" +
            dato2 +
            "|" +
            fecha +
            "|",
          method: "POST",
        })
        .then((data) => {
          $this.load.impresion = false;
          data = data[0];
          //Llenar datos
          var subtotal = 0,
            subtotal_iva = 0,
            subtotal_total = 0;

          data.fecha_impresion = new Date().toJSON();
          Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
            if (val == "fecha2_atencion")
              $this.datos_factura.fecha_atencion = data[val];
            else if (val != "servicios")
              try {
                document.getElementsByClassName(val)[0].innerHTML +=
                  " " + data[val].trim();
              } catch (error) {
                console.error(`Parametro: ${val} - Error`, error);
              }
            else {
              var items = data[val];
              var parent = document
                .getElementById("pdf_body_titcl101")
                .getElementsByTagName("tbody")[0];

              items.forEach((val) => {
                var actual_row = parent.rows.length;
                var row = parent.insertRow(actual_row);
                row
                  .insertCell(0)
                  .appendChild(document.createTextNode(val.codigo));
                row
                  .insertCell(1)
                  .appendChild(document.createTextNode(val.nombre_servicio));
                row
                  .insertCell(2)
                  .appendChild(document.createTextNode(val.cantidad));
                row
                  .insertCell(3)
                  .appendChild(document.createTextNode(val.vlr_unit));
                row
                  .insertCell(4)
                  .appendChild(document.createTextNode(val.subtotal));
                row
                  .insertCell(5)
                  .appendChild(document.createTextNode(val.vlr_iva));
                row
                  .insertCell(6)
                  .appendChild(document.createTextNode(val.vlr_total));

                subtotal += parseFloat(val.subtotal.replace(/\,/g, "")) || 0;
                subtotal_iva += parseFloat(val.vlr_iva.replace(/\,/g, "")) || 0;
                subtotal_total +=
                  parseFloat(val.vlr_total.replace(/\,/g, "")) || 0;
              });

              document.getElementsByClassName(
                "subtotal_servicios"
              )[0].innerHTML += " " + $this.formatNumero(subtotal.toString());

              document.getElementsByClassName("subtotal_iva")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_iva.toString());

              document.getElementsByClassName("subtotal_total")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_total.toString());
            }
          });

          var descuento = parseFloat(data.descuento.replace(/\,/g, "")) || 0;
          var total = $this.formatNumero(
            (subtotal_total - descuento).toString()
          );
          document.getElementsByClassName(
            "total_servicios"
          )[0].innerHTML += `<b>${total}</b>`;

          this.reset_impresion();
          $this.grabar.disabled = false;
          imprimir_pdf();

          // Habilitar generar factura
          $this.disabled.generar_factura = true;
          $this.impresion.disabled = true;
        })
        .catch((err) => {
          $this.load.impresion = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar JSON de impresión",
            estado: true,
          });
        });
    },
  async cargar_empresa() {
    await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
          this.division = parseFloat(this.empresa[0].id_empr)
 //         var busqueda_sede = this.agencias.find(
  //          (el) => el.codigo_agc == this.empresa[0].agencia_empr
   //         );      
    //        this.form.punto_fact = busqueda_sede;
            // this.get_contratos();

        })
        .catch((err) => {
          console.log(err)
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
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

    guardar_paciente() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Tipo Id Obligatorio!");
      } else if (!data.idpaciente) {
        this.errores.idpaciente = true;
        this.send_error("Id Paciente Obligatorio!");
      } else if (!data.primerApellido) {
        this.errores.primerApellido = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nombres) {
        this.errores.nombres = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nacimiento) {
        this.errores.nacimiento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.regimen) {
        this.errores.regimen = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.eps) {
        this.errores.eps = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.envio_paciente(data);
      }
    },
    envio_paciente() {
      this.dialogopac.estado = false;
      let eliminar = this.form.eliminar ? 1 : 0,
        nacimiento = this.form.nacimiento.split("-");
      nacimiento = nacimiento[0] + nacimiento[1] + nacimiento[2];
      var datos = {
        url: "Clinico/dlls/titcl301.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.form.idpaciente.trim() +
          "|" +
          this.form.nombres +
          "|" +
          this.form.primerApellido +
          "|" +
          this.form.segundoApellido +
          "|" +
          this.form.tipoid.value +
          "|" +
          this.form.direccion +
          "|" +
          this.form.telefono +
          "|" +
          this.form.correo +
          "|" +
          this.form.ciudad +
          "|" +
          this.form.nacimiento.split("-").join("") +
          "|" +
          this.form.estadoCivil.value +
          "|" +
          this.form.regimen.value +
          "|" +
          this.form.eps +
          "|" +
          this.form.genero.value +
          "|" +
          this.form.zona.value +
          "|" +
          this.form.nivel.value +
          "|" +
          "0" +
          "|" +
          "9" +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          this.form.nombre2 +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Paciente Guardado",
            estado: true,
          });
          this.info_servicios.paciente = this.form.idpaciente.trim();
          this.buscar_paciente();
        })
        .catch((error) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al guardar paciente",
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
    reset_impresion() {
      this.contrato_select = null;
      this.info_servicios.consecutivo = null;
      this.info_servicios.autorizacion = null;
      this.info_servicios.paciente = null;
      this.info_servicios.nivel = null;
      this.info_servicios.regimen = null;
      this.info_servicios.cita = null;
      this.info_servicios.copago = null;
      this.info_servicios.cuotaModeradora = null;
      this.info_servicios.descuento = null;
      this.info_servicios.medio_pago = null;
      this.info_servicios.diagnostico = null;
      this.info_servicios.observaciones = null;
      this.tablaDetalle.data = [];
    },
    generar_factura() {
      var $this = this;
      var numero = $this.impresion.consecutivo,
        dato1 = numero.substring(0, 2),
        dato2 = numero.substring(2, numero.length);

      var datos = sessionStorage.Sesion + "|" + dato1 + "|" + dato2 + "|";
      $this.load.generar_factura = true;
      post
        .postData({
          url: "Clinico/dlls/Titcl103F.dll",
          data: datos,
          method: "POST",
        })
        .then((data) => {
          $this.load.generar_factura = false;
          $this.disabled.generar_factura = true;
          $this.disabled.imprimir_factura = false;
          $this.datos_factura.consecutivo = data[0];
        })
        .catch((err) => {
          $this.load.generar_factura = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar la factura",
            estado: true,
          });
        });
    },
    imprimir_factura() {
      var $this = this;
      $this.load.imprimir_factura = true;
      var datos =
        sessionStorage.Sesion +
        "|" +
        "01" +
        "|" +
        $this.datos_factura.consecutivo +
        "|";
      post
        .postData({
          url: "Clinico/dlls/Titcl103R.dll",
          data: datos,
          method: "POST",
        })
        .then((data) => {
          $this.load.imprimir_factura = false;
          data = data[0];
          Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
            var obj = document.getElementsByClassName(val + "2")[0];
            if (val == "servicios") {
              var pacientes = data[val].dato_paciente;
              var parent = document
                .getElementById("pdf2_body_titcl101")
                .getElementsByTagName("tbody")[0];

              var subtotal = 0,
                subtotal_iva = 0,
                subtotal_total = 0,
                subtotal_descuento = 0;

              pacientes.forEach((el) => {
                var actual_row = parent.rows.length;
                var row = parent.insertRow(actual_row);

                var cell = row.insertCell(0);
                cell.innerHTML = `<b>Paciente :</b> ${el.nombre_paciente} <b>${el.tipo_id} :</b> ${el.id_paciente} <b>Régimen :</b> ${el.regimen_paciente}`;
                cell.colSpan = 6;
                cell.style = "border-bottom: 1px solid;text-align: left;";

                var articulos = el.articulos;
                articulos.forEach((item) => {
                  var actual_row = parent.rows.length;
                  var row = parent.insertRow(actual_row);
                  row
                    .insertCell(0)
                    .appendChild(document.createTextNode(item.codigo));
                  row
                    .insertCell(1)
                    .appendChild(document.createTextNode(item.nombre_servicio));

                  var cell = row.insertCell(2);
                  cell.innerHTML = "<b>" + el.autorizacion + "</b>";

                  row
                    .insertCell(3)
                    .appendChild(document.createTextNode(item.cantidad));
                  row
                    .insertCell(4)
                    .appendChild(document.createTextNode(item.vlr_unit));
                  row
                    .insertCell(5)
                    .appendChild(document.createTextNode(item.subtotal));
                  row
                    .insertCell(6)
                    .appendChild(document.createTextNode(item.vlr_iva));
                  row
                    .insertCell(7)
                    .appendChild(document.createTextNode(item.vlr_total));

                  subtotal += parseFloat(item.subtotal.replace(/\,/g, "")) || 0;
                  subtotal_iva +=
                    parseFloat(item.vlr_iva.replace(/\,/g, "")) || 0;
                  subtotal_total +=
                    parseFloat(item.vlr_total.replace(/\,/g, "")) || 0;
                  subtotal_descuento +=
                    parseFloat(item.vlr_dcto.replace(/\,/g, "")) || 0;
                });
              });

              var subtotal_final = subtotal_total - subtotal_descuento;

              document.getElementsByClassName("subtotal_final")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_final.toString());

              document.getElementsByClassName(
                "factura_subtotal"
              )[0].innerHTML += " " + $this.formatNumero(subtotal.toString());

              document.getElementsByClassName("factura_iva")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_iva.toString());

              document.getElementsByClassName("factura_total")[0].innerHTML +=
                " " + $this.formatNumero(subtotal_total.toString());

              document.getElementsByClassName(
                "factura_descuento"
              )[0].innerHTML +=
                " " + $this.formatNumero(subtotal_descuento.toString());

              var copago = data.copago || 0,
                cuotam = data.cuotam || 0;

              var total_final = subtotal_final - copago - cuotam;
              document.getElementsByClassName("total_final")[0].innerHTML +=
                " " + $this.formatNumero(total_final.toString());
            } else if (obj) obj.innerHTML += " " + data[val].trim();
          });
          imprimir_pdf2();
        })
        .catch((err) => {
          $this.load.imprimir_factura = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
  },
};

function imprimir_pdf() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print").innerHTML}</style>`
  );

  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    reset_impresion();
    // location.reload();
  }, 2000);
}

function reset_impresion() {
  document.getElementsByClassName("nombre_ips")[0].innerHTML = "";
  document.getElementsByClassName("nit_ips")[0].innerHTML = "Nit. ";
  document.getElementsByClassName("regimen_ips")[0].innerHTML = "Régimen común";
  document.getElementsByClassName("direccion_ips")[0].innerHTML =
    "Régimen común";
  document.getElementsByClassName("ciudad_ips")[0].innerHTML = "Régimen común";
  document.getElementsByClassName("fecha_atencion")[0].innerHTML =
    "  <b>Fecha atención:</b><br />";
  document.getElementsByClassName("nombre_cliente")[0].innerHTML =
    "  <b>Cliente:</b>";
  document.getElementsByClassName("nit_cliente")[0].innerHTML = "  <b>Nit:</b>";
  document.getElementsByClassName("nro_prestacion")[0].innerHTML = "No.";
  document.getElementsByClassName("nro_admision")[0].innerHTML =
    "  <b>Admision:</b>";
  document.getElementsByClassName("nombre_paciente")[0].innerHTML =
    "  <b>Paciente:</b>";
  document.getElementsByClassName("tipo_id_paciente")[0].innerHTML =
    "  <b>Id:</b>";
  document.getElementsByClassName("id_paciente")[0].innerHTML = "  <b>:</b>";
  document.getElementsByClassName("direccion_paciente")[0].innerHTML =
    "  <b>Dirección :</b>";
  document.getElementsByClassName("telefono_paciente")[0].innerHTML =
    "  <b>Teléfono :</b>";
  document.getElementsByClassName("ciudad_paciente")[0].innerHTML =
    "  <b>Ciudad :</b>";
  document.getElementsByClassName("email_paciente")[0].innerHTML =
    "  <b>E-mail :</b>";
  document.getElementsByClassName("edad_paciente")[0].innerHTML =
    "  <b>Edad :</b>";
  document.getElementsByClassName("genero_paciente")[0].innerHTML =
    "  <b>Genero :</b>";
  document.getElementsByClassName("regimen_paciente")[0].innerHTML =
    "  <b>Regimen :</b>";
  document.getElementsByClassName("eps_paciente")[0].innerHTML =
    "  <b>Eps :</b>";
  document.getElementsByClassName("medio_pago")[0].innerHTML =
    "  <b>Medio pago :</b>";
  document.getElementsByClassName("p_atencion")[0].innerHTML =
    "  <b>P. Atención :</b>";
  document
    .getElementById("pdf_body_titcl101")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  document.getElementsByClassName("subtotal_servicios")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_iva")[0].innerHTML = "";
  document.getElementsByClassName("subtotal_total")[0].innerHTML = "";
  document.getElementsByClassName("descuento")[0].innerHTML = "$";
  document.getElementsByClassName("total_servicios")[0].innerHTML = "";
  document.getElementsByClassName("impreso")[0].innerHTML = "Impreso por: ";
  document.getElementsByClassName("copago")[0].innerHTML = "$";
  document.getElementsByClassName("fecha_impresion")[0].innerHTML = "";
  document.getElementsByClassName("cuotam")[0].innerHTML = "$";
  document.getElementsByClassName("autorizacion")[0].innerHTML =
    "Nro.Autorizacion:";
}

function imprimir_pdf2() {
  var impresion = window.open("", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_print2").innerHTML}</style>`
  );

  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    location.reload();
  }, 2000);
}
</script>
