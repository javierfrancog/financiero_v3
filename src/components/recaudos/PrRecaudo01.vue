<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loaderCard"
        :disabled="loaderCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-cash-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Recaudo Servicios Públicos</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                v-model="pickerMes"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_doc"
                    label="Fecha Recaudo"
                    append-icon="event"
                    hide-details
                    outlined
                    disabled
                    v-on="on"
                    class="fecha"
                    Autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_doc"
                  scrollable
                  no-title
                  type="month"
                  @input="pickerMes = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex align-center justify-center">
                <div class="text-h4 text-uppercase mx-auto">
                  {{ punto_recaudo }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="10" sm="10">
                <v-text-field
                  label="Codigo de Barras"
                  color="red darken-3"
                  prepend-inner-icon="mdi-format-line-weight"
                  autocomplete="off"
                  clearable
                  outlined
                  type="text"
                  required
                  filled
                  shaped
                  height="80"
                  counter="50"
                  class="inputbarra"
                  v-model="form.barras"
                  hide-details
                  @keyup.enter="consultar_barras('B')"
                  ref="input_cod_barras"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex align-center">
              <v-col class="d-flex mr-0" cols="2">
                <v-btn
                  id="btn_grabar"
                  color="green darken-1 white--text"
                  depressed
                  :disabled="disabled_btn_grabar"
                  @click="guardar"
                >
                  Grabar
                </v-btn>
              </v-col>
              <v-col class="d-flex mr-0 ml-0" cols="2">
                <v-btn
                  color="pink darken-3 white--text"
                  depressed
                  @click="
                    diagmanual.estado = true;
                    disabled.imprimir_factura = false;
                  "
                >
                  Registro Manual
                </v-btn>
              </v-col>
              <v-col class="d-flex mr-0" cols="2">
                <v-btn
                  color="light-blue darken-3 accent-4 white--text"
                  @click="dialogo.estado = true"
                  depressed
                >
                  Consultar Pago
                </v-btn>
              </v-col>
              <v-col class="d-flex mr-0" cols="2">
                <v-btn
                  color="indigo darken-3 white--text"
                  depressed
                  @click="
                    contenido = [];
                    form.barras = null;
                  "
                >
                  Limpiar Registros
                </v-btn>
              </v-col>
              <v-col class="d-flex mr-0" cols="2">
                <v-btn
                  color="black white--text"
                  @click="
                    historial.estado = true;
                    consulta_pago();
                  "
                  depressed
                >
                  Historial de Pagos
                </v-btn>
              </v-col>
              <v-col class="d-flex mr-0" cols="2">
                <v-btn
                  color="purple white--text"
                  @click="
                    asociado.estado = true;
                    consulta_asociado();
                  "
                  depressed
                >
                  Pago Asociado
                </v-btn>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>
          </v-card-text>
        </div>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
              <template v-slot:item.item="{ item }">{{
                contenido.indexOf(item) + 1
              }}</template>
              <template v-slot:item.accion="{ item }">
                <v-btn
                  fab
                  x-small
                  color="red darken-2"
                  outlined
                  depressed
                  @click="delete_item(item)"
                  ><v-icon> mdi-delete </v-icon>
                </v-btn>
              </template>
              <template v-slot:body.append>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-right"><b>Total: </b></td>
                  <td class="text-center">$ {{ formatNumero(valor_total) }}</td>
                  <td></td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
        <v-divider
          class="mt-6"
          :style="{ 'border-width': '2px', 'border-color': 'orange' }"
        />
        <div class="pa-6 px-8 d-flex justify-center">
          <v-card class="px-0 pa-0" max-width="500px" flat>
            <v-data-table
              id="tabla_resumen"
              :headers="resumen.headers"
              :items="resumen.data"
              class=""
              disable-pagination
              dense
            >
              <template v-slot:body.append>
                <tr>
                  <td class="text-right font-weight-medium">Total:</td>
                  <td class="text-center">{{ total_resumen }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Consulta de Facturas</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Año a Consultar"
                outlined
                hide-details
                v-model="form.añofact"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Convenio"
                v-model="form.convenio"
                :items="convenios"
                :item-text="format_convenios"
                item-value="cod_rep"
                hide-details
                clearable
                return-object
                outlined
                @change="errores.convenio = false"
                :error="errores.convenio"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Factura"
                clearable
                outlined
                type="number"
                required
                counter="2"
                v-model="form.factura"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />

          <v-data-table
            id="tabla_consulta"
            :headers="headerconsulta"
            :items="pagos"
            item-key="descentidad_rep"
            :search="search"
            class="elevation-1"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="consultar_fact()"
            >Consultar</v-btn
          >
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoaport.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Recaudo Aportes Asociados</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Asociado"
                v-model="form.asociado"
                :items="ruts3"
                :item-text="format_asociados"
                item-value="identificacion_rut"
                hide-details
                return-object
                clearable
                outlined
                @change="errores.asociado = false"
                :error="errores.asociado"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-menu
                v-model="pickerPeriodo"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.periodo_aporte"
                    label="Periodo de Aporte  "
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    @change="errores.periodo_aporte = false"
                    :error="errores.periodo_aporte"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.periodo_aporte"
                  type="month"
                  no-title
                  scrollable
                  @input="pickerPeriodo = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Valor"
                clearable
                outlined
                type="text"
                :value="formatNumero(form.vlraporte)"
                @input="format_mask('vlraporte')"
                hide-details
                @change="errores.vlraporte = false"
                :error="errores.vlraporte"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text px-6"
            color="indigo"
            depressed
            large
            @click="confirmar_aporte()"
            >Confirmar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogoaport.estado = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="historial.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Historial de Pagos</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />

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
            id="tabla_consulta"
            :headers="headerhistorial"
            :items="tablahistorial"
            item-key="factura_rep"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.accion="{ item }">
              <v-btn
                fab
                x-small
                color="blue darken-2"
                outlined
                depressed
                @click="print_item(item)"
                ><v-icon> mdi-printer </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="historial.estado = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="asociado.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Créditos del Asociado</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-divider
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />

          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Id_Asociado"
                outlined
                v-model="form.idasociado"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start align-center" cols="12" sm="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="cargarcreditos()"
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
                <span>Buscar Asociado</span>
              </v-tooltip>
            </v-col>

            <v-col class="d-flex" cols="8">
              <v-text-field
                label="Nombre Asociado"
                clearable
                outlined
                required
                disabled
                v-model="form.nombreasoci"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-data-table
            id="tabla_consulta"
            :headers="headerasociado"
            :items="tablaasociado"
            item-key="numero_rep"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.numero_rep="{ item }">
              {{ parseInt(item.numero_rep) }}
            </template>

            <template v-slot:item.accion="{ item }">
              <v-btn
                fab
                x-small
                color="red darken-2"
                outlined
                depressed
                @click="print_item(item)"
                ><v-icon> mdi-currency-usd </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="asociado.estado = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="diagmanual.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_manual" :disabled="card_manual">
        <v-card-title>
          <span class="title col-12">Registro Manual</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row v-if="!mostrar_validacion">
            <v-col class="d-flex" cols="12" sm="4">
              <v-autocomplete
                label="Convenio"
                v-model="form.convenioman1"
                :items="convenios"
                :item-text="format_convenios"
                item-value="cod_rep"
                hide-details
                clearable
                return-object
                outlined
                @change="
                  errores.convenioman1 = false;
                  get_imagen();
                "
                :error="errores.convenioman1"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                :label="`${
                  form.convenioman1
                    ? form.convenioman1.consolidado_rep == '1'
                      ? 'Cantidad'
                      : 'Factura'
                    : 'Factura'
                }`"
                clearable
                outlined
                type="number"
                required
                counter="2"
                v-model="form.facturaman1"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" sm="2">
              <v-menu
                v-model="pickerFechaman1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaman1"
                    label="Vence"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaman1"
                  @input="pickerFechaman1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Valor"
                clearable
                outlined
                type="text"
                :value="formatNumero(form.vlrman1)"
                @input="format_mask('vlrman1')"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col
              class="d-flex"
              cols="8"
              sm="3"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 8002249728
                  : false
              "
            >
              <v-text-field
                label="Celular"
                clearable
                outlined
                type="number"
                v-model="form.celular"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col
              class="d-flex"
              cols="8"
              sm="3"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 8001217521
                  : false
              "
            >
              <v-text-field
                label="Nombres"
                clearable
                outlined
                type="text"
                required
                v-model="form.nombres"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col
              class="d-flex"
              cols="8"
              sm="3"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 8001217521
                  : false
              "
            >
              <v-text-field
                label="Apellidos"
                clearable
                outlined
                type="text"
                required
                v-model="form.apellidos"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col
              class="d-flex"
              cols="8"
              sm="3"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 999999901
                  : false
              "
            >
              <v-text-field
                label="Cedula"
                clearable
                outlined
                type="number"
                required
                v-model="form.cedula1"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="d-flex"
              cols="8"
              sm="3"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 6804428
                  : false
              "
            >
              <v-text-field
                label="Id:Estudiante"
                clearable
                outlined
                type="number"
                required
                v-model="form.id_estud"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col
              class="d-flex"
              cols="8"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 6804428
                  : false
              "
            >
              <v-text-field
                label="Nombre Estudiante"
                clearable
                outlined
                type="text"
                required
                v-model="form.nombre_estud"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 6804428
                  : false
              "
            >
              <v-menu
                v-model="pickerFechanac"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechanac"
                    label="F.Nacimiento"
                    append-icon="event"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechanac"
                  @input="pickerFechanac = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              class="d-flex"
              cols="4"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 6804428
                  : false
              "
            >
              <v-autocomplete
                label="Municipio"
                v-model="form.municipio"
                :items="items_municipio"
                return-object
                :error="errores.municipio"
                @change="errores.municipio = false"
              ></v-autocomplete>
            </v-col>
            <v-col
              class="d-flex"
              cols="5"
              v-if="
                form.convenioman1
                  ? parseInt(form.convenioman1.cod_rep) == 6804428
                  : false
              "
            >
              <v-autocomplete
                label="Colegio"
                v-model="form.colegio"
                :items="items_colegio"
                :item-text="format_ruts"
                return-object
                :error="errores.colegio"
                @change="errores.colegio = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-if="imagen_1">
            <v-col class="d-flex align-center justify-center">
              <v-img width="100" height="100" contain :src="imagen_1" />
            </v-col>
          </v-row>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
          <v-card-actions class="d-flex justify-center">
            <v-btn
              class="ma-2 px-4"
              color="indigo darken-3 white--text"
              depressed
              large
              @click="validar"
              >Validar</v-btn
            >
          </v-card-actions>
          <v-divider
            class="mt-0"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
          <v-row v-if="mostrar_validacion">
            <v-col class="d-flex" cols="12" sm="4">
              <v-autocomplete
                label="Convenio"
                v-model="form.convenioman2"
                :items="convenios"
                :item-text="format_convenios"
                item-value="cod_rep"
                hide-details
                clearable
                return-object
                outlined
                @change="
                  errores.convenioman2 = false;
                  get_imagen2();
                "
                :error="errores.convenioman2"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                :label="`${
                  form.convenioman2
                    ? form.convenioman2.consolidado_rep == '1'
                      ? 'Cantidad'
                      : 'Factura'
                    : 'Factura'
                }`"
                clearable
                outlined
                type="number"
                required
                counter="2"
                v-model="form.facturaman2"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" sm="2">
              <v-menu
                v-model="pickerFechaman2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaman2"
                    label="Vence"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaman2"
                  @input="pickerFechaman2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Valor"
                clearable
                outlined
                type="text"
                :value="formatNumero(form.valorman2)"
                @input="format_mask('valorman2')"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            v-if="
              form.convenioman2
                ? parseInt(form.convenioman2.cod_rep) == 999999901
                : false
            "
          >
            <v-col class="d-flex" cols="8" sm="3">
              <v-text-field
                label="Cedula"
                clearable
                outlined
                type="number"
                required
                v-model="form.cedula2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="imagen_2">
            <v-col class="d-flex align-center justify-center">
              <v-img width="100" height="100" contain :src="imagen_2" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            :disabled="disabled_btn_validar"
            large
            @click="validar_registro_manual"
            >Aceptar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              reset_manual();
              diagmanual.estado = false;
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="alerta_error.estado" persistent max-width="350">
      <v-card>
        <v-alert type="error" class="mb-0">
          <v-row align="center">
            <v-col cols="12" class="pt-0">
              {{ alerta_error.msj }}
            </v-col>
            <v-col class="d-flex align-end justify-end pt-0 pb-0">
              <v-btn depressed @click="focus_barras">Aceptar</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_emsa.estado" persistent max-width="300">
      <v-card>
        <v-card-title class="text-h5">
          {{ dialogo_emsa.titulo }}
        </v-card-title>
        <v-card-text>
          <b> Nombre: </b> {{ dialogo_emsa.nombre }} <br />
          <b> Fecha vencimiento: </b> {{ dialogo_emsa.fecha }}<br />
          <b> Valor a pagar: </b> {{ formatNumero(dialogo_emsa.valor) }} <br />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialogo_emsa.estado = false"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff

.inputbarra fieldset
  border-width: 2px!important
  color: #ffa500
</style>
<style>
.inputbarra {
  font-size: 28px !important;
}
.fecha {
  font-size: 28px !important;
}

#tabla_resumen .v-data-table__wrapper td {
  padding: 3px !important;
}
</style>


<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";
import { validacion_rc } from "../../_formatos.pdf.js";
import { validacion2_rc } from "../../_formatos.pdf.js";

export default {
  FlowerSpinner,

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money1: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      disabled: {
        btn_validar: false,
      },

      loader: false,
      pickerMes: false,
      pickerFecha: false,
      pickerFechaman1: false,
      pickerFechaman2: false,
      pickerFechanac: false,
      homologado: 0,

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoaport: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      diagmanual: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      items_municipio: [
        { text: "Acacias", value: 50006 },
        { text: "Castilla La Nueva", value: 50150 },
        { text: "Cubarral", value: 50223 },
        { text: "Cumaral", value: 50226 },
        { text: "Fuente de Oro", value: 50287 },
        { text: "Palmeras/San Carlos", value: 50680 },
        { text: "San Juan de Arama", value: 50683 },
        { text: "San Martin", value: 50689 },
        { text: "Vista Hermosa", value: 50711 },
      ],

      historial: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      asociado: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
        colegio: false,
        municipio: false,
        estudiante: false,
        idestudiante: false,
        asociado: false,
        periodo_aporte: false,
        vlraporte: false,
      },

      card_estado: false,
      card_manual: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,

      msg_extendido: "",
      agencias: [],
      items_colegio: [],
      expanded: [],
      contenido: [],
      tablahistorial: [],
      convenios: [],
      pagos: [],
      extendido: "0",
      cargue: [],
      data: [],
      tablaasociado: [],
      ruts3: [],
      idregistrounico: 0,
      search: "",
      envio_manual: {
        facturam: "0",
        valorm: "0",
        vencem: "0",
        cedula: "0",
      },
      form: {
        vlrman1: null,
        valorman2: null,
        vlraporte: null,
      },
      drawer: false,
      detalle: [],
      adjunto: null,
      loaderCard: false,
      headers: [
        { text: "Item", align: "center", value: "item" },
        { text: "Convenio", align: "center", value: "convenio" },
        { text: "Entidad", align: "left", value: "entidad" },
        { text: "Factura", align: "left", value: "factura" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Vence", align: "center", value: "vence" },
        { text: "Metodo", align: "center", value: "metodo" },
        { text: "Cedula", align: "center", value: "cedula" },
        { text: "Homologado", align: "center", value: "homologado" },
        { text: "Borrar", align: "center", value: "accion" },
      ],
      headerhistorial: [
        { text: "Entidad", align: "left", value: "entidad_rep" },
        { text: "Factura", align: "left", value: "factura_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Imprimir", align: "center", value: "accion" },
      ],
      headerasociado: [
        { text: "Nro", align: "center", value: "numero_rep" },
        { text: "Valor Cuota", align: "center", value: "vlrcuota_rep" },
        { text: "Pagar", align: "center", value: "accion" },
      ],

      headerconsulta: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Hora", align: "center", value: "hora_rep" },
        { text: "Punto Recaudo", align: "center", value: "descagc_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Cajero", align: "center", value: "cajero_rep" },
        { text: "Asobanca", align: "center", value: "asobanca_rep" },
        { text: "Radicado", align: "center", value: "radicado_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      punto_recaudo: null,
      agencia_recaudo: null,
      consulta_ws: 0,

      valor_total: 0,
      resumen: {
        headers: [
          {
            text: "Entidad",
            value: "entidad_rep",
            width: "80%",
          },
          {
            text: "Cantidad",
            value: "cantidad_rep",
            align: "center",
            width: "20%",
          },
        ],
        data: [],
      },
      total_resumen: 0,
      alerta_error: {
        estado: false,
        msj: null,
      },
      mostrar_validacion: false,
      disabled_btn_grabar: false,
      disabled_btn_validar: false,
      imagen_1: null,
      imagen_2: null,

      dialogo_emsa: {
        estado: false,
        titulo: "Error en fecha",
        nombre: null,
        fecha: null,
        valor: null,
      },
    };
  },
  created() {
    this.cargarRuts();
    this.cargarAsociados();

    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
    };
    this.form.añofact = this.$moment().format("YYYY");

    let punto_recaudo = sessionStorage.llave_punto;
    let data = JSON.parse(atob(punto_recaudo));
    this.punto_recaudo = data.text;
    this.agencia_recaudo = data.id;
    this.consultar_cierre();
    this.abrir_caja();
    this.consultar_convenios();
    this.focus_barras();

    // let fecha_temp = this.$moment().add('days', 1).format("YYYY-MM-DD");
    // this.sumarDias(fecha_temp)

    const _this = this;
    this.$watch("contenido", (e) => {
      _this.valor_total = 0;
      e.forEach((el) => {
        let valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;
        _this.valor_total += valor;
      });
    });

    this.dialogo.estado = false;
  },

  methods: {
    get_aportes() {
      post
        .postData({
          url: "Asociados/dlls/RpAportes02J.dll",
          data: sessionStorage.Sesion + "|" + "5" + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Aportes");
        });
    },
    cargarRuts() {
      this.loader = true;
      let data = [sessionStorage.Sesion + "|" + "12" + "|"];
      this.postData({
        url: "Financiero/dlls/Cfrutsj.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          this.items_colegio = JSON.parse(JSON.stringify(data));
          this.items_colegio.pop();
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
    cargarAsociados: function () {
      post
        .postData({
          url: "Financiero/dlls/CfRutsLiteJ.dll",
          data: sessionStorage.Sesion + "|" + "5" + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.descripcion_rut}`;
    },
    print_item(item) {
      let agencia_base64 = JSON.parse(atob(sessionStorage.llave_punto));
      let impresora = agencia_base64.impresora;
      if (impresora === "2") {
        validacion2_rc(item).then(() => {
          console.log("Impresion2 terminada");
        });
      } else {
        validacion_rc(item).then(() => {
          console.log("Impresion terminada");
        });
      }
    },
    consulta_ws_eeav(barras) {
      return new Promise((res, rej) => {
        let fecha_format = this.$moment().format("DDMMYYYY");
        let valor = barras.substring(33, 42);
        // console.log('consulta_ws_eeav', valor)

        var formData = new FormData();
        formData.append("fecha", fecha_format);
        formData.append("nro_fact", barras.substring(20, 28));

        fetch("https://server1ts.net//financiero/inc/ws.eaav.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.result == "Ok") {
              if (parseInt(result.valor) != parseInt(valor))
                res({ code: false, msj: "El valor no coincide" });
              else
                result.fecha_vencimiento = result.fecha_limite.substring(0, 10);
              res({ code: true, msj: result.fecha_vencimiento });
            } else res({ code: false });
          });
      });
    },
    registro_emsa(cliente, valorws, consecutivo) {
      const _this = this;
      return new Promise((res, rej) => {
        var formData = new FormData();
        formData.append("cliente", cliente);
        formData.append("valor", valorws);
        formData.append("consecutivo", consecutivo);

        fetch("https://emsacotrem.app/ws.emsapagos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            console.log("res", result);
            res();
          })
          .catch((err) => {
            console.log("Error", err);
          });
      });
    },
    consulta_ws_emsa(barras) {
      const _this = this;
      return new Promise((res, rej) => {
        let valor = barras.substring(35, 44);
        var formData = new FormData();
        formData.append("cliente", barras.substring(20, 30));

        const controller = new AbortController();
        const timeoutId =
          setTimeout(() => controller.abort(), 3000) |
          fetch("https://emsacotrem.app/ws.consultaemsa.php", {
          //fetch("https://emsacotrem.app/ws.consultaemsatest2.php", {
            signal: controller.signal,
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              clearTimeout(timeoutId);
              if (!result) {
                this.$emit("msj", "Error en Webservice");
                res({ code: false });
              } else {
                _this.dialogo_emsa.nombre = result.nombre;
                _this.dialogo_emsa.fecha = result.fecha_vencimiento;
                _this.dialogo_emsa.valor = result.valor_a_pagar;
                _this.dialogo_emsa.vlremsa = result.valor_emsa;
                let venci = result.fecha_vencimiento;
                let fecha_format = [
                  venci.split("/")[1],
                  venci.split("/")[0],
                  venci.split("/")[2],
                ];
                if (result.valor_emsa > 0) {
                  if (parseInt(valor) != parseInt(result.valor_emsa)) {
                    this.$emit("msj", "Valor diferente");
                    _this.dialogo_emsa.titulo = "Error en valor";
                    _this.dialogo_emsa.estado = true;
                    this.form.barras = null;
                    this.reset_manual();

                    res({ code: false });
                  } else res({ code: true, msj: result.fecha_vencimiento });
                } else {
                  if (parseInt(valor) != parseInt(result.valor_a_pagar)) {
                    this.$emit("msj", "Valor diferente");
                    _this.dialogo_emsa.titulo = "Error en valor";
                    _this.dialogo_emsa.estado = true;
                    this.form.barras = null;
                    this.reset_manual();

                    res({ code: false });
                  } else res({ code: true, msj: result.fecha_vencimiento });
                }
              }
            })
            .catch((err) => {
              this.reset_manual();
              console.log("Error consulta emsa", err);
              res(false);
            });
      });
    },
    consulta_ws_llanogas(barras) {
      return new Promise((res, rej) => {
        this.loader = true;
        var formData = new FormData();
        let factura = parseInt(barras.substring(21, 30));
        let valor = parseInt(barras.substring(34, 44));
        let vence = barras.substring(46, 55);
        let respuesta_ws = null;
        let mensaje_ws = null;

        formData.append("idfactura", factura);
        formData.append("valorfactura", valor);
        formData.append("vencefactura", vence);
        formData.append("idconvenio", 322);
        fetch("https://server1ts.net//financiero/inc/ws.llanogas.php", {
          // fetch("https://server1ts.net//financiero/inc/test.llanogas.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((result) => {
            this.loader = false;

            result = result.trim();
            result = JSON.parse(result);

            respuesta_ws = result[0].code;
            mensaje_ws = result[0].msm;
            this.homologado = 0;

            if (respuesta_ws == "000" || respuesta_ws == "008") {
              res({ code: true, msj: "proceso correcto" });
              if (mensaje_ws.includes("Homologado")) {
                console.log("es homologado");
                this.homologado = 1;
              }
            } else if (respuesta_ws == "003") {
              this.$emit("snack", {
                color: "red",
                text: "El cliente no tiene Valores disponibles para pago",
                estado: true,
              });
            } else res({ code: false, msj: mensaje_ws });
          });
      });
    },
    consulta_ws_bioagricola(barras) {
      return new Promise((res, rej) => {
        this.loader = true;
        var formData = new FormData();
        let factura = parseInt(barras.substring(21, 30));
        let valor = parseInt(barras.substring(34, 44));
        let vence = barras.substring(46, 55);
        let respuesta_ws = null;
        let mensaje_ws = null;

        formData.append("idfactura", factura);
        formData.append("valorfactura", valor);
        formData.append("vencefactura", vence);
        formData.append("idconvenio", 317);
        fetch("https://server1ts.net//financiero/inc/ws.llanogas.php", {
          // fetch("https://server1ts.net//financiero/inc/test.llanogas.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((result) => {
            this.loader = false;

            result = result.trim();
            result = JSON.parse(result);

            respuesta_ws = result[0].code;
            mensaje_ws = result[0].msm;
            this.homologado = 0;

            if (respuesta_ws == "000" || respuesta_ws == "008") {
              res({ code: true, msj: "proceso correcto" });
              if (mensaje_ws.includes("Homologado")) {
                console.log("es homologado");
                this.homologado = 1;
              }
            } else res({ code: false, msj: mensaje_ws });
          });
      });
    },
    consulta_ws_bioagricola25(barras) {
      const _this = this;
      return new Promise((res, rej) => {
        let valor = barras.substring(35, 44);
        var formData = new FormData();
        formData.append("cliente", barras.substring(20, 30));

        const controller = new AbortController();
        const timeoutId =
          setTimeout(() => controller.abort(), 3000) |
          //fetch("https://emsacotrem.app/ws.consultaemsa.php", {
          fetch("https://emsacotrem.app/ws.consultaemsatest2.php", {
            signal: controller.signal,
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              clearTimeout(timeoutId);
              if (!result) {
                this.$emit("msj", "Error en Webservice");
                res({ code: false });
              } else {
                _this.dialogo_emsa.nombre = result.nombre;
                _this.dialogo_emsa.fecha = result.fecha_vencimiento;
                _this.dialogo_emsa.valor = result.valor_a_pagar;
                _this.dialogo_emsa.vlremsa = result.valor_emsa;
                let venci = result.fecha_vencimiento;
                let fecha_format = [
                  venci.split("/")[1],
                  venci.split("/")[0],
                  venci.split("/")[2],
                ];
                if (result.valor_emsa > 0) {
                  if (parseInt(valor) != parseInt(result.valor_emsa)) {
                    this.$emit("msj", "Valor diferente");
                    _this.dialogo_emsa.titulo = "Error en valor";
                    _this.dialogo_emsa.estado = true;
                    this.form.barras = null;
                    this.reset_manual();

                    res({ code: false });
                  } else res({ code: true, msj: result.fecha_vencimiento });
                } else {
                  if (parseInt(valor) != parseInt(result.valor_a_pagar)) {
                    this.$emit("msj", "Valor diferente");
                    _this.dialogo_emsa.titulo = "Error en valor";
                    _this.dialogo_emsa.estado = true;
                    this.form.barras = null;
                    this.reset_manual();

                    res({ code: false });
                  } else res({ code: true, msj: result.fecha_vencimiento });
                }
              }
            })
            .catch((err) => {
              this.reset_manual();
              console.log("Error consulta emsa", err);
              res(false);
            });
      });
    },
    get_imagen2() {
      let convenio = this.form.convenioman2;
      if (convenio) {
        let url = `https://titansoluciones.cloud/img/${parseInt(
          convenio.cod_rep
        )}.png`;
        this.imagen_2 = url;
      } else {
        this.imagen_2 = null;
      }
    },
    get_imagen() {
      let convenio = this.form.convenioman1;
      if (convenio.cod_rep == "000000892099339") {
        this.diagmanual.estado = false;
        this.dialogoaport.estado = true;
        this.form.asociado = null;
        this.form.periodo_aporte = null;
        this.form.vlraporte = null;
      } else {
        if (convenio) {
          let url = `https://titansoluciones.cloud/img/${parseInt(
            convenio.cod_rep
          )}.png`;
          this.imagen_1 = url;
        } else {
          this.imagen_1 = null;
        }
      }
    },
    format_mask(obj) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form, obj, val_edit);
    },
    validar() {
      if (!this.mostrar_validacion) {
        this.mostrar_validacion = true;

        this.form.convenioman2 = null;
        this.form.facturaman2 = null;
        this.form.fechaman2 = null;
        this.form.vlrman2 = null;
        this.imagen_1 = null;
      }
    },
    abrir_caja() {
      let sesion = sessionStorage.Sesion;
      let punto_recaudo = sessionStorage.llave_punto;
      let data = JSON.parse(atob(punto_recaudo));
      let punto = data.id;
      let datosEnvio = [sesion, punto];
      this.postData({
        url: "Recaudos/dlls/PrCierre02.dll",
        data: datosEnvio.join("|") + "|",
        method: "",
      })
        .then((data) => {})
        .catch((err) => {
          this.send_error("Error al consultar cierre");
        });
    },
    consulta_asociado() {},
    consulta_pago() {
      this.tablahistorial = [];
      let sesion = sessionStorage.Sesion;
      let punto_recaudo = sessionStorage.llave_punto;
      let data = JSON.parse(atob(punto_recaudo));
      let punto = data.id;
      let datosEnvio = [sesion, punto, this.extendido];
      this.postData({
        url: "Recaudos/dlls/PrRecaudo03J.dll",
        data: datosEnvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          data.pop();
          this.tablahistorial = data;
        })
        .catch((err) => {
          this.send_error("Error al consultar pagos");
        });
    },
    validar_registro_manual() {
      let data = this.form;
      let convenio1 = data.convenioman1;
      let factura1 = data.facturaman1;
      let fecha1 = data.fechaman1;
      let valor1 = data.vlrman1;
      let cedula1 = data.cedula1;

      let convenio2 = data.convenioman2;
      let factura2 = data.facturaman2;
      let fecha2 = data.fechaman2;
      let valor2 = data.valorman2;
      let cedula2 = data.cedula2;
      if (convenio1.cod_rep !== 999999901) {
        cedula1 = "0";
        cedula2 = "0";
      }

      if (
        !convenio1 ||
        !factura1 ||
        !fecha1 ||
        !valor1 ||
        !cedula1 ||
        !convenio2 ||
        !factura2 ||
        !fecha2 ||
        !valor2 ||
        !cedula2
      ) {
        this.$emit("snack", {
          color: "error",
          text: "Debes ingresar todos los campos",
          estado: true,
        });
        this.reset_manual();
      } else {
        if (
          convenio1 != convenio2 ||
          factura1 != factura2 ||
          fecha1 != fecha2 ||
          valor1 != valor2 ||
          cedula1 != cedula2
        ) {
          this.$emit("snack", {
            color: "error",
            text: "No coincide la información ingresada",
            estado: true,
          });
          this.reset_manual();
        } else {
          let valor = data.vlrman1.padStart(10, "0");
          let factura = data.facturaman1.padStart(10, "0");
          let fecha = data.fechaman1.replace(/\-/g, "");
          let cedula = data.cedula1;

          let barras =
            `415` +
            data.convenioman1.idbarras_rep +
            "8020" +
            factura +
            "3900" +
            valor +
            "96" +
            fecha;
          this.form.barras = barras;
          setTimeout(() => {
            this.consultar_barras("M");
          }, 200);

          this.envio_manual.facturam = factura;
          this.envio_manual.vencem = fecha;
          this.envio_manual.valorm = valor;
          this.envio_manual.cedula = cedula;
          this.diagmanual.estado = false;
        }
      }
    },
    guardarxxx() {
      let item = {};
      this.registrar_pago(item);
    },
    guardar() {
      let datos = this.contenido;
      this.form.barras = null;

      if (datos.length > 0) {
        this.disabled_btn_grabar = true;
        this.get_plano(datos).then((plano) => {
          let sesion = sessionStorage.Sesion;
          let punto_recaudo = sessionStorage.llave_punto;
          let data = JSON.parse(atob(punto_recaudo));
          let punto = data.id;
          let extendido = this.extendido;
          let ip = "";
          let datosEnvio = [sesion, punto, ip, plano, extendido];
          this.postData({
            url: "Recaudos/dlls/PrRecaudo.dll",
            data: datosEnvio.join("|") + "|",
            method: "",
          })
            .then((data) => {
              this.consultar_resumen();
              this.$emit("snack", {
                color: "success",
                text: "Recaudo guardado correctamente",
                estado: true,
              });
              this.disabled_btn_grabar = false;

              this.imprimir_pago();
              // this.contenido = [];
            })
            .catch((err) => {
              console.log(err);
              this.send_error("Error al grabar la recaudo");
              this.disabled_btn_grabar = false;
            });
        });
      }
    },
    format_convenios(val) {
      return `${parseInt(val.cod_rep) || 0} - ${val.descrip_rep.trim()}`;
    },
    consultar_fact() {
      this.loader = true;
      var convenio = this.form.convenio.cod_rep;
      var factura = this.form.factura;
      let periodo = this.form.añofact;
      this.tabla_consulta = " ";

      let data = [sessionStorage.Sesion, convenio, factura, periodo];
      this.postData({
        url: "Recaudos/dlls/PrConsfactJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          this.pagos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al consultar pagos",
            estado: true,
          });
        });
    },
    get_plano(detalle) {
      let error_homo = 0;
      return new Promise((res, rej) => {
        let data = detalle.map((el) => {
          el.valor = el.valor.replace(/\,/g, "");
          if (
            el.convenio == "7709998013612" ||
            el.convenio == "7709998014466"
          ) {
            error_homo = error_homo + el.homologado;
          }
          return el;
        });
        if (
          error_homo == 1 ||
          error_homo == 3 ||
          error_homo == 5 ||
          error_homo == 7 ||
          error_homo == 9
        ) {
          this.send_error("Error al registrar Homologado");
          this.disabled_btn_grabar = false;
        } else {
          var formData = new FormData();
          formData.append("tipo", "PrRecaudo01");
          formData.append("sesion", sessionStorage.Sesion.substr(15, 15));
          formData.append("data", JSON.stringify(data));

          fetch("https://server1ts.net//financiero/inc/planos.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.code == "0") res(result.mensaje);
              else rej(result.mensaje);
            })
            .catch((error) => rej(error));
        }
      });
    },
    async imprimir_pago() {
      //xavier
      // this.consulta_ws = 1;
      let tabla = this.contenido;
      let usuario = parseFloat(sessionStorage.Sesion.substr(15, 15));

      for (const item of tabla) {
        await this.proceso_imprimir(item);

        if (this.consulta_ws == 1) {
          let convenio = item.barras.substring(3, 16);
          if (convenio == "7709998014466" || convenio == "7709998013612") {
            if (usuario == "1121832978_000") {
              await this.registrar_pago(item);
            }
            // console.log("registrar pago")
          }
        }
      }
      this.contenido = [];
      this.form.barras = null;
      this.envio_manual.facturam = "0";
      this.envio_manual.vencem = "0";
      this.envio_manual.valorm = "0";
      this.envio_manual.cedula = "0";
      this.reset_manual();
    },

    sumarDias: function (fecha) {
      let nuevafecha = this.$moment(fecha).add("days", 1).format("YYYY-MM-DD");
      return nuevafecha;
    },

    formatearFecha(fecha) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    proceso_imprimir(item) {
      return new Promise((res) => {
        let agencia_base64 = JSON.parse(atob(sessionStorage.llave_punto));
        let agencia = agencia_base64.id;
        let entidad = item.convenio;
        let factura = item.factura;
        let fecha = this.form.fecha_doc.replace(/\-/g, "");
        // this.extendido = 1

        let vence = item.vence;
        let key =
          agencia +
          "|" +
          entidad +
          "|" +
          fecha +
          "|" +
          factura +
          "|" +
          vence +
          "|" +
          this.extendido +
          "|";

        let datosEnvio = sessionStorage.Sesion + "|" + key;
        this.postData({
          url: "Recaudos/dlls/PrpagorcJ.dll",
          data: datosEnvio,
          method: "",
        })
          .then(async (data) => {
            let data_impresion = data[0];
            let convenio = item.barras.substring(3, 16);
            this.idregistrounico = data_impresion.consecutivo_rep;
            // validacion_rc(data_impresion);
            if (agencia === "111") {
              validacion2_rc(data_impresion).then(async () => {
                console.log("Proceso terminado");
                res();
              });
            } else {
              validacion_rc(data_impresion).then(async () => {
                //   if (convenio == "7709998002449") {
                //     await this.registro_emsa(
                //       data_impresion.cliente_rep,
                //       data_impresion.valorws_rep,
                //       data_impresion.consecutivo_rep
                //     );
                //   }

                res();
              });
            }
          })
          .catch((err) => {
            console.log("Ha ocurrido un error:", err);
            res();
          });
      });
    },

    async registrar_pago(item) {
      let entidad = item.convenio;
      let fecha = this.form.fecha_doc.replace(/\-/g, "");
      let mensaje = "";
      let id_pago = "";

      let idfactura = item.factura;
      let valorfactura = item.valor;
      let idregistrounico = this.idregistrounico;

      let idconvenio = 322;

      if (item.convenio == "7709998013612") {
        idconvenio = 317;
      }

      // let idfactura = 38750643;
      // let valorfactura = 39582;
      // let idregistrounico = 5757010;
      let respuesta = "";

      // idconvenio = 317;
      var formData = new FormData();
      formData.append("idfactura", idfactura);
      formData.append("valorfactuidconveniora", valorfactura);
      formData.append("idregistrounico", idregistrounico);
      formData.append("idconvenio");

      let response = await fetch(
        "https://server1ts.net//financiero/inc/ws.llanogas_pago.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());

      (mensaje = response[0].msm),
        (id_pago = response[0].id_pago),
        //this.log_pago(fecha, entidad, idfactura, id_pago, mensaje);
        this.log_pago();

      // )
      //   .then(
      //     (result) =>
      //       this.$emit("snack", {
      //         color: "indigo",
      //         text: result[0].msm,
      //         estado: true,
      //       }),
      //     mensaje = result[0].msm,
      //     id_pago = result[0].id_pago,

      //     this.log_pago(fecha, entidad, idfactura, id_pago, mensaje)
      //   )
      //   .catch((error) => console.error(error));

      let convenio_envio = "";
      if (idconvenio == 322) {
        convenio_envio = " Llanogas:";
      } else {
        convenio_envio = " Bioagricola:";
      }

      // post
      //   .postData({
      //     setUrl: url,
      //     data: {},
      //   })
      //   .then((response) => {
      //     try {
      //       if (error) {
      //         resolve(false);
      //         console.log("-> Error", error);
      //       }
      //       let res = response.body;
      //       let json = JSON.parse(res);
      //       // let respuesta = json[0].msm;
      //       let respuesta = json[0].msm;
      //       console.log(json[0]);
      //       let msj = `[${new Date().toJSON()}] "Factura:"${idfactura}, "Valor:"${valorfactura}, "Consecutivo:"${idregistrounico}, "Respuesta" ${convenio_envio} ":"${respuesta} \n`;
      //       let fecha = new Date();
      //       this.log_pago(fecha, item.convenio, idfactura, msj, respuesta);

      // if (respuesta == "Pago Procesado Correctamente.")
      //   resolve(json.mensaje);
      // else if (
      //   respuesta == "Pago ya aplicado, se identifica Reintento."
      // ) {
      //   resolve(true);
      // } else resolve(false);
      //   } catch (error) {
      //     console.log("-> Error Funcion registrar_pago", error);
      //     resolve(false);
      //   }
      // });

      // request(options, async (error, response) => {
      //   try {
      //     if (error) {
      //       resolve(false);
      //       console.log("-> Error", error);
      //     }
      //     let res = response.body;
      //     let json = JSON.parse(res);
      //     // let respuesta = json[0].msm;
      //     let respuesta = json[0].msm;
      //     console.log(json[0]);
      //     let msj = `[${new Date().toJSON()}] "Factura:"${idfactura}, "Valor:"${valorfactura}, "Consecutivo:"${idregistrounico}, "Respuesta" ${convenio_envio} ":"${respuesta} \n`;
      //     let fecha = new Date();
      //     this.log_pago(fecha, item.convenio, idfactura, msj, respuesta);

      //     // if (respuesta == "Pago Procesado Correctamente.")
      //     //   resolve(json.mensaje);
      //     // else if (
      //     //   respuesta == "Pago ya aplicado, se identifica Reintento."
      //     // ) {
      //     //   resolve(true);
      //     // } else resolve(false);
      //   } catch (error) {
      //     console.log("-> Error Funcion registrar_pago", error);
      //     resolve(false);
      //   }
      // });
    },
    async log_pago() {
      console.log("registrar_log");
    },
    async log_pagoxxx(fecha, convenio, idfactura, msj, respuesta) {
      console.log(convenio, msj, fecha, respuesta);
      var datosEnvio =
        sesion +
        "|" +
        fecha +
        "|" +
        convenio +
        "|" +
        idfactura +
        "|" +
        msj +
        "|" +
        respuesta +
        "|";
      await post
        .postData({
          url: "Recaudos/dlls/PrLogAplica.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.$emit("snack", {
            color: "indigo",
            text: "Pago Aplicado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.loadCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al registrar pago",
            estado: true,
          });
        });
    },

    delete_item(item) {
      const index = this.contenido.indexOf(item);
      this.contenido.splice(index, 1);
    },
    llenar_tabla(metodo) {
      let indexact = 0;
      let homo_llanogas = 0;

      if (this.cargue[0].codentidad_rep == 7709998013612) {
        indexact = this.contenido.length;
        if (indexact > 0) {
          homo_llanogas = this.contenido[indexact - 1].homologado;
        }
        if (homo_llanogas == 1) {
          this.homologado = homo_llanogas;
        }
      }

      let homologado = this.homologado;
      let convenio = this.cargue[0].codentidad_rep;
      let factura = this.cargue[0].factura_rep;
      let valor = this.cargue[0].valor_rep;
      let entidad = this.cargue[0].descentidad_rep;
      let vence = this.cargue[0].fecha_rep;
      let barras = this.form.barras;
      let cedula = this.form.cedula1 ? this.form.cedula1 : 0;
      let nombres = this.form.nombres ? this.form.nombres.trim() : "";
      let apellidos = this.form.apellidos ? this.form.apellidos.trim() : "";
      let celular = this.form.celular ? this.form.celular.trim() : "0";

      let id_estud = this.form.id_estud ? this.form.id_estud : 0;
      let nombre_estud = this.form.nombre_estud ? this.form.nombre_estud : "";
      let fechanac = this.form.fechanac
        ? this.form.fechanac.replace(/\-/g, "")
        : "";
      let municipio = this.form.municipio ? this.form.municipio.value : 0;
      let colegio = this.form.colegio
        ? this.form.colegio.identificacion_rut
        : 0;

      let buscar = this.contenido.find(
        (el) => el.convenio == convenio && el.factura == factura
      );

      if (!buscar) {
        let data_tabla = [
          ...this.contenido,
          {
            convenio,
            entidad,
            factura,
            valor: this.formatNumero(parseFloat(valor)),
            vence,
            metodo,
            cedula,
            barras,
            id_estud,
            nombre_estud,
            fechanac,
            municipio,
            colegio,
            homologado,
            nombres,
            apellidos,
            celular,
          },
        ];

        this.contenido = data_tabla;
      }
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    async consultar_cierre() {
      var fecha = this.form.fecha_doc.replace(/\-/g, "");
      let punto_recaudo = sessionStorage.llave_punto;
      let data = JSON.parse(atob(punto_recaudo));
      this.contenido = [];
      await post
        .postData({
          url: "Recaudos/dlls/PrCierreptoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            data.id +
            "|" +
            "1" +
            "|",
          method: "",
        })
        .then((data) => {
          this.msg_extendido = false;
          let mensaje = data[0].msg;
          if (mensaje == "Extendido") {
            this.msg_extendido = mensaje;
            this.extendido = 1;
            this.punto_recaudo =
              this.punto_recaudo.trim() +
              " -Horario " +
              this.msg_extendido +
              "-";
          }
          this.consultar_resumen();
        })
        .catch((err) => {
          let estado = err.Code;
          let franquicia = err.Mensaje[0].msg;
          if (estado == 5) this.extendido = 1;
          else {
            this.send_error(err.Mensaje[0].msg);
            setTimeout(() => {
              this.$router.push({ path: "/menubase" });
            }, 500);
          }
        });
    },
    consultar_resumen() {
      let punto_recaudo = sessionStorage.llave_punto;
      let data2 = JSON.parse(atob(punto_recaudo));
      let punto = data2.id;
      let data = [sessionStorage.Sesion, punto, this.extendido];
      this.postData({
        url: "Recaudos/dlls/PrRecaudo02J.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          data.pop();

          let total = 0;
          data.forEach((el) => (total += parseInt(el.cantidad_rep)));
          this.total_resumen = total;

          this.resumen.data = data;
        })
        .catch((err) => {
          console.log("Error", err);
          this.$emit("msj", err.Mensaje ? err.Mensaje[0].msg : err);
        });
    },
    consultar_convenios() {
      this.loader = true;
      let data = [sessionStorage.Sesion];
      this.postData({
        url: "Recaudos/dlls/CfConveniorcJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          this.convenios = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
    },
    reset_manual() {
      this.form.convenioman1 = null;
      this.form.facturaman1 = null;
      this.form.fechaman1 = null;
      this.form.vlrman1 = null;
      this.form.cedula1 = null;
      this.form.nombres = null;
      this.form.celular = null;
      this.form.apellidos = null;
      this.form.convenioman2 = null;
      this.form.facturaman2 = null;
      this.form.fechaman2 = null;
      this.form.valorman2 = null;
      this.form.cedula2 = null;
      this.form.municipio = null;
      this.form.colegio = null;
      this.form.id_estud = null;
      this.form.nombre_estud = null;
      this.form.fechanac = null;

      this.mostrar_validacion = false;
      this.imagen_1 = null;
      this.imagen_2 = null;
    },
    async cargarcreditos() {
      let idasociado = this.form.idasociado;

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
          this.tablaasociado = data;
          this.form.nombreasoci = data[0].nombre_rep.trim();
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
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    format_asociados(val) {
      return `${val.descripcion_rut.trim()}`;
    },
    confirmar_aporte() {
      if (!this.form.asociado) {
        this.errores.asociado = true;
        this.send_error("Debe seleccionar un Asociado");
      } else if (!this.form.periodo_aporte) {
        this.errores.periodo_aporte = true;
        this.send_error("Debe seleccionar un Periodo");
      } else if (!this.form.vlraporte) {
        this.errores.vlraporte = true;
        this.send_error("Debe registrar un valor");
      } else {
        let valor = this.form.vlraporte.padStart(10, "0");
        let factura = this.form.periodo_aporte.replace(/\-/g, "");
        let fecha = this.form.fecha_doc.replace(/\-/g, "");

        let cedula = this.form.asociado.identificacion_rut;
        this.form.cedula1 = this.form.asociado.identificacion_rut;

        let barras =
          `415` +
          this.form.convenioman1.idbarras_rep +
          "8020" +
          factura +
          "3900" +
          valor +
          "96" +
          fecha;
        this.form.barras = barras;
        setTimeout(() => {
          this.consultar_barras("M");
        }, 200);

        this.envio_manual.facturam = factura;
        this.envio_manual.vencem = fecha;
        this.envio_manual.valorm = valor;
        this.envio_manual.cedula = cedula;
        this.dialogoaport.estado = false;
      }
    },
    focus_barras() {
      this.alerta_error.estado = false;
      setTimeout(() => {
        this.$refs.input_cod_barras.$refs.input.focus();
      }, 500);
    },
    async consultar_barras(metodo) {
      let anterior = this.contenido.length - 1;
      let ultimo_homo = 0;
      if (anterior > -1) {
        ultimo_homo = this.contenido[anterior].homologado;
      }
      let barras = this.form.barras;
      this.homologado = 0;

      if (!barras) {
        this.$emit("msj", "Debe ingresar una factura");
      } else {
        let convenio = barras.substring(3, 16);
        let activo = this.convenios.find((e) => {
          if (convenio == e.idbarras_rep) return e.consulta_rep;
        });
        let res_ws = { code: true };
        //xavier
        //  activo.consulta_rep = 1;
        this.consulta_ws = activo.consulta_rep;

        if (
          convenio == "7709998000414" &&
          metodo == "B" &&
          activo.consulta_rep == 1
        ) {
          res_ws = await this.consulta_ws_eeav(barras);
          if (res_ws) this.envio_manual.vencem = res_ws.msj.replace(/\-/g, "");
        } else if (convenio == "7709998002449" && activo.consulta_rep == 1) {
          res_ws = await this.consulta_ws_emsa(barras);
          if (res_ws.code)
            this.envio_manual.vencem = res_ws.msj.replace(/\//g, "");
        } else if (convenio == "7709998014466" && activo.consulta_rep == 1) {
          res_ws = await this.consulta_ws_llanogas(barras);
          if (res_ws.code)
            this.envio_manual.vencem = res_ws.msj.replace(/\//g, "");
        }
        if (
          convenio == "7709998013612" &&
          ultimo_homo == 1 &&
          activo.consulta_rep == 1
        ) {
          res_ws = await this.consulta_ws_bioagricola(barras);
          if (res_ws.code)
            this.envio_manual.vencem = res_ws.msj.replace(/\//g, "");
        }

        // console.log("res_ws", res_ws);
        if (activo.consulta_rep == 0) {
          this.envio_manual.vencem = barras.substring(46, 55);
          // this.envio_manual.vencem = barras.substring(3, 16);
          // this.envio_manual.vencem = barras.substring(3, 16);
          // this.envio_manual.vencem = barras.substring(3, 16);
        }
        // console.log(this.envio_manual.vencem);

        if (res_ws.code || activo.consulta_rep == 0) {
          let facturam = this.envio_manual.facturam;
          let valorm = this.envio_manual.valorm;
          let vencem = this.envio_manual.vencem;

          let agencia = this.agencia_recaudo;

          let data = [
            sessionStorage.Sesion,
            barras,
            valorm,
            vencem,
            facturam,
            agencia,
          ];
          this.postData({
            url: "Recaudos/dlls/PrRecaudo01J.dll",
            data: data.join("|") + "|",
            method: "",
          })
            .then((data) => {
              // this.$emit("msj", data[0].msg, "green");
              this.cargue = JSON.parse(JSON.stringify(data));
              this.llenar_tabla(metodo);
              this.form.barras = null;
              this.envio_manual.facturam = "0";
              this.envio_manual.vencem = "0";
              this.envio_manual.valorm = "0";
              this.envio_manual.cedula = "0";
              this.reset_manual();
            })
            .catch((err) => {
              this.envio_manual.facturam = "0";
              this.envio_manual.vencem = "0";
              this.envio_manual.valorm = "0";
              this.envio_manual.cedula = "0";
              this.reset_manual();
              this.form.barras = null;
              this.alerta_error.msj = err.Mensaje ? err.Mensaje[0].msg : err;
              this.alerta_error.estado = true;
              // this.$emit(
              //   "msj",
              //   err.Mensaje ? err.Mensaje[0].msg : err,
              //   "red",
              //   1000
              // );
            });
        } else {
          this.form.barras = null;
          this.$emit("msj", res_ws.msj);
        }
      }
    },
  },
};
</script>
