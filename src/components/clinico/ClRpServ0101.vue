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
                >Reporte Prestacion de Servicios Cl.</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="1300px">
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Prestación de servicios</span>
                    </v-card-title>
                    <v-container>
                      <v-row>
                        <v-col class="d-flex" cols="4">
                          <v-autocomplete
                            label="Sede de Servicio"
                            v-model="form.punto_serv"
                            :items="agencias"
                            :item-text="format_punto_fact"
                            item-value="codigo_agc"
                            hide-details
                            outlined
                            clearable
                            return-object
                            @change="errores.punto_fact = false"
                            :error="errores.punto_fact"
                          ></v-autocomplete>
                        </v-col>

                        <v-col class="d-flex" cols="6">
                          <v-autocomplete
                            outlined
                            label="Contrato Prestación"
                            :items="contratos"
                            :item-text="format_contrato"
                            item-value="nro"
                            hide-details
                            return-object
                            v-model="contrato_select"
                            @change="get_servicios_cont"
                            clearable
                            :error="errores.contrato"
                          ></v-autocomplete>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="2">
                          <v-text-field
                            label="Consecutivo"
                            outlined
                            v-model="info_servicios.consecutivo"
                            disabled
                            hide-details
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="3">
                          <v-text-field
                            label="Fecha"
                            outlined
                            v-model="info_servicios.fecha"
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex" cols="12" sm="4">
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

                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
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
                          <v-col
                            class="d-flex justify-start align-center"
                            cols="12"
                            sm="1"
                          >
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
                          <v-col
                            class="d-flex justify-start align-center"
                            cols="12"
                            sm="1"
                          >
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

                        <v-col sm="3" cols="12">
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
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-card-subtitle
                            class="subtitle-1 font-weight-medium grey--text text--darken-2 m0"
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
                            <v-icon size="20" left>mdi-basket-outline</v-icon
                            >Agregar servicio
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
                              formatNumero(
                                item.valor.replace(/\,/g, "") * item.cantidad
                              )
                            }}
                          </template>
                          <template v-slot:item.sub_total="{ item }">
                            {{ formatNumero(item.sub_total) }}
                          </template>
                          <template v-slot:item.total="{ item }">
                            {{ formatNumero(item.total) }}
                          </template>
                          <!-- <template v-slot:item.estado="{ item }">
                            <v-chip></v-chip>
                          </template>-->

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
                              {{
                                formatNumero(
                                  tablaDetalle.totales.sub_total || 0
                                )
                              }}
                            </td>
                            <td class="text-xs-right text-center">
                              {{
                                formatNumero(
                                  tablaDetalle.totales.total_iva || 0
                                )
                              }}
                            </td>
                            <td class="text-xs-right text-center">
                              {{
                                formatNumero(tablaDetalle.totales.total || 0)
                              }}
                            </td>
                          </template>
                        </v-data-table>
                      </div>
                      <v-row>
                        <v-card-subtitle
                          class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                          >Cierre de Servicio</v-card-subtitle
                        >
                      </v-row>
                      <v-row>
                        <v-col class="d-flex" cols="12" sm="3">
                          <v-text-field
                            label="Copago"
                            outlined
                            hide-details
                            v-model="info_servicios.copago"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="3">
                          <v-text-field
                            label="Cuota moderadora."
                            outlined
                            hide-details
                            v-model="info_servicios.cuotaModeradora"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="3">
                          <v-text-field
                            label="Descuento"
                            outlined
                            hide-details
                            prefix="$"
                            v-money="money"
                            v-model="info_servicios.descuento"
                          ></v-text-field>
                        </v-col>
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
                      <v-row>
                        <v-col sm="3" cols="12">
                          <v-select
                            :items="[
                              { text: 'Activo', value: 0 },
                              { text: 'Anulado', value: 1 },
                              { text: 'Pendiente x Facturar', value: 2 },
                            ]"
                            label="Estado"
                            outlined
                            clearable
                            hide-details
                            v-model="info_servicios.estado"
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-card-actions>
                        <v-row class="d-flex justify-end col-12">
                          <v-col class="pa-0 px-0 mr-6" sm="3">
                            <v-btn
                              color="red darken-4 "
                              text
                              class
                              block
                              @click="
                                dialog = false;
                                clear_form_PrServ();
                              "
                              >Cerrar</v-btn
                            >
                          </v-col>
                          <v-col class="pa-0 px-0 mr-6" sm="3">
                            <v-btn
                              color="green darken-1"
                              class="white--text"
                              block
                              large
                              depressed
                              @click="grabar_servicio"
                              :loading="load.btn_enviar"
                              :disabled="grabar.disabled"
                              >Grabar Servicio</v-btn
                            >
                          </v-col>
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
                        </v-row>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact1"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="errores.punto_fact = false"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="8">
                <v-autocomplete
                  outlined
                  label="Contrato a Consultar"
                  clearable
                  :items="contratos_clrpServ101"
                  :item-text="format_contrato"
                  item-value="nro"
                  v-model="selectContrato"
                  :loading="load.contratos"
                  hide-details
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex justify-center" cols="3">
                <v-switch
                  v-model="form.pendientes"
                  @change="consultarServicios()"
                  label="Solo Pendientes por facturar"
                ></v-switch>
              </v-col>

              <v-col class="d-flex" cols="12">
                <v-btn
                  color="indigo"
                  class="mr-4 white--text"
                  @click="consultarServicios"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
                <v-btn
                  depressed
                  color="green darken-2"
                  class="white--text"
                  :disabled="hiddenExcel"
                  @click="imprimir_excel"
                >
                  Imprimir EXCEL
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
            >
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="numero"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
            >
              <template v-slot:item.estado="{ item }">
                <v-chip :color="format_estado(item.estado).color">{{
                  format_estado(item.estado).text
                }}</v-chip>
              </template>
              <template v-slot:item.factura="{ item }">
                {{ item.preffactura.trim() }} {{ parseInt(item.factura) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="indigo"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="imprimir(item.sede, item.numero, item.fecha, 0)"
                      fab
                    >
                      <v-icon>mdi-printer-wireless</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Prestación</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="teal darken-2"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="get_pdf(item)"
                      fab
                    >
                      <v-icon>mdi-cloud-print-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir soportes</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="orange"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="modificar_prestacion(item)"
                      fab
                    >
                      <v-icon>mdi-playlist-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Corregir Prestación </span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="purple darken-2"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="imprimir(item.sede, item.numero, item.fecha, 1)"
                      fab
                    >
                      <v-icon>mdi-printer-wireless</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Certificación</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="#f7dc6f"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="imprimir(item.sede, item.numero, item.fecha, 3)"
                      fab
                    >
                      <v-icon>mdi-printer-wireless</v-icon>
                    </v-btn>
                  </template>
                  <span>Prestación Formato 2</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="editar_servicio(item)"
                      fab
                    >
                      <v-icon>mdi-playlist-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Reg_Autorización </span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
      <div id="impresion_titcl101">
        <div id="cargando_pdf">
          <h3>Cargando impresión...</h3>
        </div>
        <table id="pdf_header_titcl101">
          <thead>
            <tr>
              <th>
                <img class="logo" :src="logoSrc" />
              </th>
              <th>
                <a class="nombre_ips"></a>
                <br />
                <a class="nit_ips">Nit.</a>
                <br />
                <a class="regimen_ips">Régimen común</a>
                <br />
                <a class="direccion_ips"></a>
                <br />
                <a class="ciudad_ips"></a>
                <br />
              </th>
              <th>
                <a class="fecha_atencion">
                  <b>Fecha atención:</b>
                  <br />
                </a>
                <br />
                <a class="nombre_cliente">
                  <b>Cliente:</b>
                </a>
                <br />
                <a class="nit_cliente">
                  <b>Nit:</b>
                </a>
                <br />
              </th>
              <th>
                <a>
                  <b style="text-transform: uppercase"
                    >Prestación de servicios</b
                  >
                </a>
                <br />
                <a>
                  <b class="nro_prestacion">No.</b>
                </a>
                <br />
                <a class="nro_admision">
                  <b>Admision:</b>
                </a>
                <br />
              </th>
            </tr>
            <tr>
              <th colspan="2">
                <a class="nombre_paciente">
                  <b>Paciente:</b>
                </a>
                <br />

                <a class="tipo_id_paciente">
                  <b>Id:</b>
                </a>
                <a class="id_paciente">
                  <b>:</b>
                </a>
                <br />
                <a class="direccion_paciente">
                  <b>Dirección :</b>
                </a>
                <br />
                <a class="telefono_paciente">
                  <b>Teléfono :</b>
                </a>
                <br />
                <a class="ciudad_paciente">
                  <b>Ciudad :</b>
                </a>
                <br />
                <a class="email_paciente">
                  <b>E-mail :</b>
                </a>
                <br />
              </th>
              <th>
                <a class="edad_paciente">
                  <b>Edad :</b>
                </a>
                <br />
                <a class="genero_paciente">
                  <b>Genero :</b>
                </a>
                <br />
                <a class="regimen_paciente">
                  <b>Regimen :</b>
                </a>
                <br />
                <a class="eps_paciente">
                  <b>Eps :</b>
                </a>
                <br />
                <a class="medio_pago">
                  <b>Medio pago :</b>
                </a>
                <br />
                <a class="p_atencion">
                  <b>P. Atención :</b>
                </a>
                <br />
              </th>
              <th class="info_qr">QR:</th>
            </tr>
          </thead>
        </table>
        <table id="pdf_body_titcl101">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Vlr. Unitario</th>
              <th>Sub total</th>
              <th>Vlr. Iva</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr>
              <td colspan="2"></td>
              <td colspan="2">
                <b>Subtotal servicios:</b>
              </td>
              <td class="subtotal_servicios"></td>
              <td class="subtotal_iva"></td>
              <td class="subtotal_total"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2">
                <b>Descuentos:</b>
              </td>
              <td></td>
              <td></td>
              <td class="descuento">$</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2">
                <b>Total servicios:</b>
              </td>
              <td></td>
              <td></td>
              <td class="total_servicios"></td>
            </tr>
            <tr>
              <td colspan="2" class="impreso">Impreso por:</td>
              <td colspan="2">
                <b>Copago:</b>
              </td>
              <td></td>
              <td></td>
              <td class="copago">$</td>
            </tr>
            <tr>
              <td colspan="2" class="fecha_impresion"></td>
              <td colspan="2">
                <b>Cuota moderadora:</b>
              </td>
              <td></td>
              <td></td>
              <td class="cuotam">$</td>
            </tr>
            <tr>
              <td colspan="2" class="autorizacion">Nro.Autorizacion:</td>
              <!-- <td colspan="2" class="autorizacion"></td> -->
            </tr>
            <tr>
              <td colspan="7" style="border: 1px solid; padding: 10px">
                <b>Observaciones:</b>
                <br />
                <br />
              </td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: center; padding-top: 30px">
                <hr style="width: 50%" />
                <b>PRESTADOR</b>
              </td>
              <td colspan="5" style="text-align: center; padding-top: 30px">
                <hr style="width: 50%" />
                <b>Recibí el Servicio a satisfacción,</b>
                <br />
                <b>PACIENTE</b>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </v-flex>
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
                  disabled
                  hide-details
                  suffix="$"
                  v-money="money"
                  v-model="servicio_select.valor"
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

    <v-dialog v-model="dialogo_actualiza.estado" max-width="800" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Actualiza comprobante</v-card-title>
        <div class="pa-4 px-8">
          <v-row sm="12" no-gutters>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Prestación"
                v-model="form.nroprest"
                disabled
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8">
              <v-text-field
                label="Paciente"
                v-model="form.paciente"
                disabled
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Autorización"
                v-model="form.autorizacion"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-menu
                v-model="pickerAutoriza"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fecha_autoriza"
                    label="Fecha Autorización"
                    append-icon="event"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fecha_autoriza"
                  @input="pickerAutoriza = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-end">
            <v-col class="mb-0" cols="4" sm="4">
              <v-btn
                color="red darken-4 "
                text
                class
                block
                @click="dialogo_actualiza.estado = false"
                >Cerrar</v-btn
              >
            </v-col>
            <v-col class="mb-4" cols="6" sm="6">
              <v-btn
                color="indigo darken-1"
                dark
                block
                depressed
                @click="grabar_prestacion"
                >Grabar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import {
  prestacionServicios2,
  prestacionServicios,
  compr_prestacionServ,
} from "../../_formatos_sal.js";

export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      pickerAutoriza: false,

      fecha_ini: this.$moment().format("YYYY-MM-01"),
      fecha_autoriza: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-31"),
      headers: [
        { text: "Sede", align: "center", value: "sede" },
        { text: "Numero", align: "center", value: "numero" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Id_Paciente", align: "center", value: "identificacion" },
        { text: "Desc_Paciente", align: "center", value: "descrip_paciente" },
        { text: "Autorizacion", align: "center", value: "autorizacion" },
        { text: "Contrato", align: "center", value: "contrato" },
        { text: "Factura", align: "center", value: "factura" },
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Estado", value: "estado", align: "center" },
        { text: "Observaciones", value: "observanula_rep", align: "center" },
      ],
      dialog: false,
      valid: false,
      form: [],
      agencias: [],
      itempr: {
        fecha: "",
        sede: "",
        numero: "",
      },
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
      load: {
        contratos: true,
        pacientes: true,
        servicios: false,
        btn_enviar: false,
        citas: false,
        impresion: false,
        generar_factura: false,
        imprimir_factura: false,
      },
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
      selectContrato: null,
      prest_servicios: [],
      contratos_clrpServ101: [],
      contratos: [],
      pacientes: [],
      empresa: [],
      paciente_envio: null,
      servicios: [],
      info_servicios: {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: null,
        cuotaModeradora: 0,
        paciente: null,
        descripaciente: null,
        observaciones: null,
        descuento: null,
        medio_pago: 1,
        cita: null,
        diagnostico: null,
      },
      contrato_select: [],

      dialogo_actualiza: {
        estado: false,
      },

      dialogo: {
        estado: false,
        tipo: true,
      },
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
      },
      citas: [],
      diagnosticos: [],
      impresion: {
        disabled: true,
        consecutivo: null,
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
      hiddenExcel: true,
    };
  },
  created() {
    var $this = this;
    this.fecha_ini = this.$moment().format("YYYY-MM-DD");
    this.cargar_empresa();
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
    this.cargarTablaAg();
    this.get_contratos();
    this.get_diagnosticos();
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
    fecha_ini() {
      this.fecha_final = this.fecha_ini;
    },
  },
  methods: {
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
          if (this.empresa[0].id_empr === "000000901467099") {
            this.disabled.valor = true;
          }
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    editar_servicio(item) {
      this.dialogo_actualiza.estado = true;
      this.form.autorizacion = item.autorizacion;
      this.form.nroprest = item.numero.trim();
      this.form.paciente = item.descrip_paciente.trim();
      this.itempr.fecha = item.fecha;
      this.itempr.sede = item.sede;
      this.itempr.numero = item.numero.trim();

      var busqueda_sede = this.agencias.find(
        (el) => el.codigo_agc == item.codsede_prestacion
      );
      this.form.colabora = busqueda_sede;
    },
    modificar_prestacion(item) {
      let factura = parseFloat(item.factura.substring(5, 17));
      let sede = item.sede;
      let numero = item.numero.trim();
      let fecha = item.fecha;

      this.clear_form_PrServ();

      if (factura > 0) {
        this.$emit("snack", {
          color: "error",
          text: "Servicio ya está facturado",
          estado: true,
        });
      } else {
        post
          .postData({
            url: "clinico/dlls/titcl101r.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              sede +
              "|" +
              numero +
              "|" +
              fecha +
              "|",
            method: "",
          })
          .then((data) => {
            data = data[0];
            var busqueda_contrato = this.contratos.find(
              (el) => el.nro == data.contrato
            );
            this.contrato_select = busqueda_contrato;

            this.dialog = true;

            var busqueda_sede = this.agencias.find(
              (el) => parseFloat(el.codigo_agc) == parseFloat(item.agencia)
            );
            this.form.punto_serv = busqueda_sede;

            this.info_servicios.consecutivo = data.nro_prestacion;
            this.info_servicios.fecha = this.$moment(
              data.fecha2_atencion
            ).format("YYYY-MM-DD");
            this.info_servicios.autorizacion = data.autorizacion;

            //   var busqueda_paciente = this.pacientes.find(
            //       (el) => el.identificacion_rut == item.data.id_paciente.trim()
            //   );

            // this.info_servicios.paciente = busqueda_paciente;

            this.info_servicios.paciente = data.id_paciente
              .split(",")
              .join("")
              .trim()
              .padStart(15, "0");

            data.servicios.forEach((k, v) => {
              this.tablaDetalle.data.push({
                codigo: k.codigo,
                lote: "00",
                descripcion: k.nombre_servicio,
                cantidad: parseFloat(k.cantidad),
                sub_total: k.subtotal.split(",").join("").trim(),
                iva_total: k.vlr_iva,
                total: k.vlr_total.split(",").join("").trim(),
                valor: k.subtotal.split(",").join("").trim(),
              });
            });
            this.info_servicios.cuotaModeradora = data.cuotam;
            this.info_servicios.descuento = data.descuento;
            this.form.punto_fact = data.codsede_prestacion;

            this.info_servicios.nivel = parseInt(data.nivel_paciente) || 0;
            this.info_servicios.medio_pago = parseInt(data.cod_medio) || 0;
            this.info_servicios.diagnostico = data.dx.padEnd(8, " ");

            this.info_servicios.nro_admon = data.nro_admision;
            this.info_servicios.id_agenda = data.id_agenda.split(",").join("");
            this.info_servicios.fecha_agenda = data.fecha_agenda;
            this.info_servicios.hora_agenda = data.hora_agenda;
            this.info_servicios.tipo_id_paciente = data.tipo_id_paciente;
            this.info_servicios.observaciones = data.tipo_id_paciente;
            this.info_servicios.estado = data.estado;
            this.get_servicios();
            this.buscar_paciente();

            this.info_servicios.cuotaModeradora = data.cuotam
              ? data.cuotam.replace(/\,/g, "").trim()
              : 0;

            this.info_servicios.copago = data.copago
              ? data.copago.replace(/\,/g, "").trim()
              : 0;
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios_2",
              estado: true,
            });
          });
      }
    },
    grabar_prestacion() {
      let nroprestacion = this.itempr.numero;
      let sede = this.itempr.sede;
      let fecha = this.itempr.fecha;
      let fecha_autoriza = this.itempr.fecha_autoriza;
      let autorizacion = this.form.autorizacion;
      post
        .postData({
          url: "clinico/dlls/ClActPrest.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            sede +
            "|" +
            nroprestacion +
            "|" +
            fecha +
            "|" +
            autorizacion +
            "|" +
            fecha_autoriza +
            "|",
          method: "",
        })
        .then((data) => {
          this.dialogo_actualiza.estado = false;
          this.consultarServicios();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al grabar servicios",
            estado: true,
          });
        });
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
    async buscar_paciente_enviar() {
      let paciente = this.info_servicios.paciente.trim();
      await post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.paciente_envio = data[0];
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

      return true;
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
          this.info_servicios.descripaciente = data[0].descrip_rep.trim();
          this.info_servicios.regimen = data[0].regimen;
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
    format_estado(estado) {
      var retornar = {};
      // O se puede usar un swich case

      switch (estado) {
        case "0":
          retornar.text = "Pte Facturar";
          retornar.color = "green";
          break;
        case "1":
          retornar.text = "Anulado";
          retornar.color = "red";
          break;

        case "3":
          retornar.text = "Modificado";
          retornar.color = "gray";
          break;

        case "4":
          retornar.text = "Bloqueado";
          retornar.color = "gray";
          break;

        case "5":
          retornar.text = "Facturado";
          retornar.color = "blue";
          break;

        case "6":
          retornar.text = "Rechazado por Médico";
          retornar.color = "gray";
          break;

        // if (estado == "1") {
        //   retornar.text = "Anulado";
        //   retornar.color = "red";
        // } else if (estado == "3") {
        //   retornar.text = "Pendiente";
        //   retornar.color = "green";
        // } else {
        //   retornar.text = "N/A";
        //   retornar.color = "gray";
        //   }
      }
      return retornar;
    },
    get_pdf(item) {
      let empresa = parseFloat(this.empresa[0].id_empr);
      let fecha = item.fecha;
      //    empresa = 900108793 MEDICOOP;

      if (empresa == 900108793) {
        let agencia = item.agencia;

        let consec = item.numero.trim();
        let idFile = empresa + "PRSERV_" + agencia + "-" + consec + ".pdf";
        const url =
          "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

        const timestamp = new Date().getTime(); // Genera un timestamp único
        const urlSinCache = `${url}?_=${timestamp}`;
        window.open(urlSinCache, "_blank"); // Abre el PDF
      } else if (fecha > 20250511) {
        this.down_file(item);
      } else {
        this.get_pdf_ant(item);
      }
    },
    down_file(item) {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let prefijo = item.preffactura.trim();
      let sede = item.sede.trim();
      let consecutivo = parseFloat(item.numero.trim());
      let idFile = "";
      let periodo = item.fecha.substr(0, 6);
      let fecha = item.fecha;

      if (empresa == 900767863) {
        if (fecha > 20250228 && fecha < 20250430) {
          idFile = empresa + "FACT_" + prefijo + consecutivo + ".pdf";
        } else {
          idFile = empresa + "PRSERV_" + sede + "_" + consecutivo + ".pdf";
        }
      }

      if (empresa == 900767863 && periodo < 202412) {
        let ruta = item.iddrive;
        const url =
          `https://drive.google.com/file/d/` +
          ruta.trim() +
          `/view?usp=drive_link`;
        window.open(url, "_blank").focus();
      } else {
        const url =
          "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

        const timestamp = new Date().getTime();
        const urlSinCache = `${url}?_=${timestamp}`;
        window.open(urlSinCache, "_blank");
      }
    },
    get_pdf_ant(item) {
      console.log("get_pdf_ant", item);
      this.load.card = true;
      var key = item.link_docs;
      let ruta = item.iddrive;

      let empresa = sessionStorage.Sesion.substr(0, 15);
      let prefijo = item.preffactura.trim();
      let consecutivo = parseFloat(item.numero.trim());
      let idFile = "";
      let fecha = item.fecha;

      if (empresa == 900767863 && fecha > 20250228 && fecha < 20250430) {
        idFile = empresa + "FACT_" + prefijo + consecutivo + ".pdf";
        const url =
          "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

        const timestamp = new Date().getTime();
        const urlSinCache = `${url}?_=${timestamp}`;
        window.open(urlSinCache, "_blank");
      } else {
        if (ruta && ruta.trim() !== "") {
          const url =
            `https://drive.google.com/file/d/` +
            ruta.trim() +
            `/view?usp=drive_link`;
          window.open(url, "_blank").focus();
        } else {
          var formData = new FormData();
          formData.append("key", key);

          fetch("https://server1ts.net//financiero/services/docs/get_pdf.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .catch((error) => {
              this.load.card = false;
              $this.$emit("snack", {
                color: "error",
                text: "Ha ocurrido un error consultando el PDF",
                estado: true,
              });
            })
            .then((result) => {
              this.load.card = false;
              if (result.code == 0) {
                var ruta = `https://server1ts.net//financiero/pdf/${result.msj}.pdf`;
                var win = window.open(ruta, "_blank");
                win.focus();

                var ruta2 = `https://server1ts.net//financiero/cerat/${item.nombrepdf}.pdf`;
                var win2 = window.open(ruta2, "_blank");
              } else {
                $this.$emit("snack", {
                  color: "error",
                  text: "Ha ocurrido un error consultando el PDF",
                  estado: true,
                });
              }
            });
        }
      }
    },
    get_salas: function () {
      post
        .postData({
          url: "clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "POST",
        })
        .then((data) => {
          this.salas = data;
        })
        .catch((err) => {
          this.load.contratos = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar salas",
            estado: true,
          });
        });
    },
    get_contratos: function () {
      post
        .postData({
          url: "clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "POST",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos_clrpServ101 = data;
          this.load.contratos = false;
        })
        .catch((err) => {
          this.load.contratos = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    get_pacientes() {
      post
        .postData({
          url: "clinico/dlls/titCL301j.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.pacientes = data;
          this.load.pacientes = false;
          this.get_diagnosticos();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar pacientes",
            estado: true,
          });
        });
    },
    get_diagnosticos() {
      post
        .postData({
          url: "datos/base/CIE10.json",
          data: sessionStorage.Sesion + "|",
          method: "GET",
        })
        .then((data) => {
          this.diagnosticos = data.cie10;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    get_servicios() {
      this.errores.contrato = false;
      let nro_contr = this.contrato_select.nro;
      if (this.contrato_select) {
        this.load.servicios = true;

        post
          .postData({
            url: "clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + nro_contr + "|",
            method: "POST",
          })
          .then((data) => {
            this.load.servicios = false;
            this.servicios = data[0].servicios;
          })
          .catch((err) => {
            this.load.servicios = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios_3",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    get_servicios_cont() {
      this.errores.contrato = false;
      let nro_contr = this.contrato_select.nro;
      if (this.contrato_select) {
        this.load.servicios = true;
        post
          .postData({
            url: "clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + nro_contr + "|",
            method: "POST",
          })
          .then((data) => {
            this.load.servicios = false;
            this.servicios = data[0].servicios;
          })
          .catch((err) => {
            this.load.servicios = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios_3",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    get_citas() {
      if (this.info_servicios.paciente) {
        this.load.citas = true;
        post
          .postData({
            url: "clinico/dlls/titCL102JP.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              this.info_servicios.paciente +
              "|1|",
            method: "POST",
          })
          .then((data) => {
            // this.citas = data;
          })
          .catch((err) => {
            this.load.citas = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar las citas del paciente",
              estado: true,
            });
          });
      }
    },
    format_contrato(val) {
      return parseInt(val.nro) + " - " + val.descripcion + "-" + val.detalle;
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
      var item = this.servicio_select;

      if (item.codigo) {
        var iva = parseFloat(item.tar_iva) || 0,
          parse_iva = iva / 100,
          valor_neto = parseFloat(item.valor.replace(/\,/g, "")) || 0,
          iva_tmp = parse_iva + 1,
          subtotal = valor_neto * iva_tmp,
          cantidad = parseFloat(item.cantidad) || 0,
          total = subtotal * cantidad;

        this.servicio_select.total = total.toFixed(2);
        this.$refs.input_total.$el.getElementsByTagName("input")[0].value =
          total.toFixed(2);

        var valor_iva = valor_neto * parse_iva;
        this.servicio_select.valor_iva = valor_iva;
        this.servicio_select.iva_total = valor_iva * cantidad;
        this.servicio_select.sub_total = valor_neto * cantidad;
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
      if (this.edit_index > -1) {
        Object.assign(
          this.tablaDetalle.data[this.edit_index],
          this.servicio_select
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
      // this.info_servicios.copago = data.copago;
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
      post
        .postData({
          url: "clinico/dlls/TITCL101.dll",
          data: linea_envio,
          method: "POST",
        })
        .then((data) => {
          $this.load.btn_enviar = false;
          // $this.grabar.disabled = true;
          this.clear_form_PrServ();
          this.consultarServicios();
          this.dialog = false;
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
      var $this = this,
        paciente = this.info_servicios.paciente.trim();
      paciente = paciente[0] || null;
      if (!$this.contrato_select) {
        $this.errores.contrato = true;
        $this.alerta_error("Debes seleccionar un contrato");
      } else if (!paciente) {
        $this.errores.paciente = true;
        $this.alerta_error("Debes seleccionar un paciente");
      } else if (!$this.info_servicios.autorizacion) {
        $this.errores.autorizacion = true;
        $this.alerta_error("Ingresa un número de autorización");
      } else if ($this.tablaDetalle.data.length <= 0) {
        $this.alerta_error("Debes ingresar al menos un servicio en el detalle");
      } else if (!$this.info_servicios.medio_pago) {
        $this.alerta_error("Selecciona un medio de pago");
      } else if (!$this.info_servicios.diagnostico) {
        $this.errores.diagnostico = true;
        $this.alerta_error("Selecciona un diagnostico");
      } else {
        let contrato = this.contratos.filter((e) => {
          if (this.contrato_select == e.nro) return e;
        });
        let cliente = this.contrato_select.identificacion;
        contrato = this.contrato_select.nro;

        await this.buscar_paciente_enviar();
        this.load.btn_enviar = true;
        var fecha_actual = new Date(),
          mes = (fecha_actual.getMonth() + 1).toString().padStart(2, "0"),
          dia = fecha_actual.getDate().toString().padStart(2, "0"),
          año = fecha_actual.getFullYear().toString(),
          detalle = $this.tablaDetalle.data;

        var fecha = this.$moment(this.paciente_envio.nacimiento).format(
            "YYYY/MM/DD"
          ),
          edad = $this.calcularEdad(fecha);

        var estado = this.info_servicios.estado;
        let eliminar = this.info_servicios.eliminar ? 1 : 0;
        let punto = this.form.punto_serv.codigo_agc;

        var linea_envio =
          sessionStorage.Sesion +
          "|" +
          this.info_servicios.consecutivo +
          "|" +
          this.info_servicios.fecha.split("-").join("") +
          "|" +
          this.info_servicios.paciente +
          "|" +
          cliente +
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
          this.info_servicios.descuento.replace(/\,/g, "") +
          "|" +
          this.info_servicios.medio_pago +
          "|" +
          this.tablaDetalle.data.length +
          "|" +
          contrato +
          "|" +
          (this.info_servicios.observaciones || "") +
          "|" +
          this.info_servicios.autorizacion +
          "|" +
          this.info_servicios.nro_admon +
          "|" +
          this.info_servicios.diagnostico +
          "|" +
          this.info_servicios.nivel +
          "|" +
          this.info_servicios.id_agenda +
          "|" +
          this.info_servicios.fecha_agenda +
          "|" +
          this.info_servicios.hora_agenda +
          "|" +
          estado +
          "|" +
          "1" +
          "|" +
          this.info_servicios.regimen.trim() +
          "|" +
          punto +
          "|" +
          "0" +
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

        linea_envio += linea_items + "|" + "0" + "|";

        this.enviar_servicio(linea_envio);
      }
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
          url: "clinico/dlls/Titcl103F.dll",
          data: datos,
          method: "POST",
        })
        .then((data) => {
          $this.load.generar_factura = false;
          $this.disabled.generar_factura = true;
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
    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    consultarServicios() {
      this.prest_servicios = [];
      let estado_fecha = this._validarFechas();
      let punto = this.form.punto_fact1.codigo_agc;
      let pendientes = this.form.pendientes ? "1" : "0";

      this.loader = true;
      if (this.selectContrato) {
        if (estado_fecha) {
          post
            .postData({
              url: "clinico/dlls/ClRpPrest0101J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                0 +
                "|" +
                this.selectContrato.nro +
                "|" +
                this.selectContrato.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                pendientes +
                "|" +
                punto +
                "|",
              method: "",
            })
            .then((data) => {
              data.pop();
              this.prest_servicios = data;
              this.hiddenExcel = false;
              this.loader = false;
            })
            .catch((err) => {
              this.hiddenExcel = false;
              this.loader = false;
              console.log(err);
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios_4",
                estado: true,
              });
            });
        }
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un contrato",
          estado: true,
        });
      }
    },
    imprimir_excel() {
      let data = [...this.prest_servicios];
      let data_parse = data;

      let columnas = [
        {
          title: "Sede",
          value: "sede",
          format: "string",
        },
        {
          title: "Número",
          value: "numero",
        },
        {
          title: "Fecha",
          value: "fecha",
        },
        {
          title: "Id_Paciente",
          value: "identificacion",
        },
        {
          title: "Desc_Paciente",
          value: "descrip_paciente",
        },
        {
          title: "Regimen",
          value: "regimen",
        },

        {
          title: "Valor",
          value: "valor",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Autorización",
          value: "autorizacion",
          format: "string",
        },
        {
          title: "Contrato",
          value: "contrato",
        },
        {
          title: "Factura",
          value: "factura",
          format: "string",
        },
      ];

      let header_format = [
        { text: "REPORTE PRESTACIÓN DE SERVICIOS", bold: true, size: 16 },
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
            sheetName: "Reporte prestación de servicios",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE PRESTACIÓN DE SERVICIOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion de excel terminada");
          });
      });
    },
    imprimir(sede, key, fecha, tipo) {
      this.loader = true;
      var numero = key.replace(/'' /g, "").trim();
      post
        .postData({
          url: "clinico/dlls/titcl101r.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            sede +
            "|" +
            numero +
            "|" +
            fecha +
            "|",
          method: "",
        })
        .then((data) => {
          // var $this = this;
          this.loader = false;
          data = JSON.parse(JSON.stringify(data))[0];

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          let empresa = sessionStorage.Sesion.substr(0, 15);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            data.fecha_actual = this.$moment().format("YYYY-MM-DD HH:mm");
            if (tipo === 1) {
              prestacionServicios2(data).then(() => {
                console.log("Impresion terminada");
              });
            } else if (tipo === 3) {
              data.nombrePaciente = data.nombre_paciente.replace(/'/g, "''");
              data.identificacion = data.id_paciente;
              data.servicio = data.servicios[0].nombre_servicio;
              data.telefono = data.telefono_paciente.replace(/,/g, "");
              data.fechaservicio = data.fecha_atencion;

              compr_prestacionServ(data).then(() => {
                console.log("Impresion terminada");
              });
            } else {
              prestacionServicios(data).then(() => {
                console.log("Impresion terminada");
              });
            }
          });
          //Llenar datos
          // var subtotal = 0,
          //   subtotal_iva = 0,
          //   subtotal_total = 0;

          // data.fecha_impresion = new Date().toJSON();
          // Object.getOwnPropertyNames(data).forEach((val, idx, array) => {
          //   if (val == "fecha2_atencion")
          //     $this.datos_factura.fecha_atencion = data[val];
          //   else if (
          //     (val != "servicios") &
          //     (val != "id_agenda") &
          //     (val != "dx") &
          //     (val != "fecha_agenda") &
          //     (val != "hora_agenda") &
          //     (val != "contrato") &
          //     (val != "nivel_paciente") &
          //     // (val != "tipo_id_paciente") &
          //     (val != "cod_medio")
          //   ) {
          //     document.getElementsByClassName(val).length > 0
          //       ? (document.getElementsByClassName(val)[0].innerHTML +=
          //           " " + data[val].trim())
          //       : false;
          //   } else if (
          //     (val != "id_agenda") &
          //     (val != "dx") &
          //     (val != "fecha_agenda") &
          //     (val != "hora_agenda") &
          //     (val != "contrato") &
          //     (val != "nivel_paciente") &
          //     (val != "tipo_id_paciente") &
          //     (val != "cod_medio")
          //   ) {
          //     var items = data[val];
          //     var parent = document
          //       .getElementById("pdf_body_titcl101")
          //       .getElementsByTagName("tbody")[0];
          //     // for (var i in parent) {
          //     // }
          //     items.forEach((val) => {
          //       var actual_row = parent.rows.length;
          //       var row = parent.insertRow(actual_row);
          //       row
          //         .insertCell(0)
          //         .appendChild(document.createTextNode(val.codigo));
          //       row
          //         .insertCell(1)
          //         .appendChild(document.createTextNode(val.nombre_servicio));
          //       row
          //         .insertCell(2)
          //         .appendChild(document.createTextNode(val.cantidad));
          //       row
          //         .insertCell(3)
          //         .appendChild(document.createTextNode(val.vlr_unit));
          //       row
          //         .insertCell(4)
          //         .appendChild(document.createTextNode(val.subtotal));
          //       row
          //         .insertCell(5)
          //         .appendChild(document.createTextNode(val.vlr_iva));
          //       row
          //         .insertCell(6)
          //         .appendChild(document.createTextNode(val.vlr_total));

          //       subtotal += parseFloat(val.subtotal.replace(/\,/g, "")) || 0;
          //       subtotal_iva += parseFloat(val.vlr_iva.replace(/\,/g, "")) || 0;
          //       subtotal_total +=
          //         parseFloat(val.vlr_total.replace(/\,/g, "")) || 0;
          //     });

          //     document.getElementsByClassName(
          //       "subtotal_servicios"
          //     )[0].innerHTML += " " + $this.formatNumero(subtotal.toString());

          //     document.getElementsByClassName("subtotal_iva")[0].innerHTML +=
          //       " " + $this.formatNumero(subtotal_iva.toString());

          //     document.getElementsByClassName("subtotal_total")[0].innerHTML +=
          //       " " + $this.formatNumero(subtotal_total.toString());
          //   }
          // });

          // var descuento = parseFloat(data.descuento.replace(/\,/g, "")) || 0;
          // var total = $this.formatNumero(
          //   (subtotal_total - descuento).toString()
          // );
          // document.getElementsByClassName(
          //   "total_servicios"
          // )[0].innerHTML += `<b>${total}</b>`;
          // imprimir_pdf();
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          // this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar servicios_1",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    clear_form_PrServ() {
      this.info_servicios = {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: 0,
        cuotaModeradora: 0,
        descripaciente: null,
        paciente: null,
        observaciones: null,
        descuento: null,
        medio_pago: 1,
        cita: null,
        diagnostico: null,
      };
      (this.contrato_select = []), (this.tablaDetalle.data = []);
      this.tablaDetalle.totales = {};
      this.info_servicios.cuotaModeradora = "0";
    },
  },
};
</script>
