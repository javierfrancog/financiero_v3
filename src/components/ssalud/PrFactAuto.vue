<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="load.card"
        :disabled="load.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-alphabet-cyrillic</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Autorizaciones pendientes por Facturar</v-list-item-title
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
                        <v-col class="d-flex" cols="12" sm="7">
                          <v-autocomplete
                            outlined
                            label="Contrato"
                            :items="contratos"
                            :item-text="format_contrato"
                            item-value="nro"
                            hide-details
                            v-model="contrato_select"
                            @change="get_servicios"
                            clearable
                            :error="errores.contrato"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-card-actions></v-card-actions>
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
              <v-col class="d-flex" cols="12" sm="8">
                <v-autocomplete
                  outlined
                  label="Contrato"
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
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-row justify="center">
                <v-col class="d-flex" cols="12" sm="4">
                  <v-switch
                    v-model="form.sptes"
                    @change="consultarServicios()"
                    label="Solo pendientes"
                  ></v-switch>
                </v-col>

                <v-col class="d-flex align-center" cols="12" sm="4">
                  <v-btn
                    color="indigo"
                    class="white--text"
                    large
                    depressed
                    @click="consultarServicios"
                  >
                    Consultar
                    <v-icon right dark>mdi-file-upload-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-menu
                  v-model="fechaFactura_picker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fechaFactura"
                      label="Fecha de la Factura"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fechaFactura"
                    @input="fechaFactura_picker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  :items="anios_select"
                  label="Año del servicio"
                  outlined
                  clearable
                  hide-details
                  v-model="form.anoserv"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoserv"
                ></v-select>
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
              :search="search"
              v-if="prest_servicios.length != 0"
            >
              <template v-slot:item.idbase_rep="{ item }">
                {{ parseInt(item.idbase_rep) }}
              </template>

              <template v-slot:item.nrofactura_rep="{ item }">
                {{ parseInt(item.nrofactura_rep) }}
              </template>

              <template v-slot:item.soporte="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="orange"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      @click="get_autoriza(item)"
                      fab
                    >
                      <v-icon>mdi-auto-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Autorización</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="purple"
                      class="ma-2 white--text"
                      v-on="on"
                      depressed
                      small
                      fab
                      :disabled="
                        parseInt(item.nrofactura_rep.trim()) == 0 ? true : false
                      "
                      @click="subir_soportes(item)"
                    >
                      <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir soporte Factura</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="
                        parseInt(item.nrofactura_rep.trim()) == 0 ? true : false
                      "
                      color="red"
                      class="ma-2 white--text"
                      @click="get_soportes(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                    >
                      <v-icon>mdi-file-arrow-up-down</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Soportes Factura</span>
                </v-tooltip>
              </template>

              <template v-slot:item.genera="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="
                        parseInt(item.nrofactura_rep.trim()) > 0 ? true : false
                      "
                      color="green"
                      class="ma-2 white--text"
                      @click="confirmar_receptor(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                      :disabled="
                        parseInt(item.nrofactura_rep.trim()) == 0 ? false : true
                      "
                    >
                      <v-icon>mdi-currency-usd</v-icon>
                    </v-btn>
                  </template>
                  <span>Facturar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="
                        parseInt(item.nrofactura_rep.trim()) > 0 ? true : false
                      "
                      color="red"
                      class="ma-2 white--text"
                      @click="abrir_rechazo(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                      :disabled="
                        parseInt(item.nrofactura_rep.trim()) == 0 ? false : true
                      "
                    >
                      <v-icon>mdi-alert-remove-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Rechazo Facturación</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :hidden="
                        parseInt(item.nrofactura_rep.trim()) > 0 ? true : false
                      "
                      color="green"
                      class="ma-2 white--text"
                      @click="regenerar_factura(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                      :disabled="
                        parseInt(item.bloqueorec_rep) == 0 ? false : true
                      "
                    >
                      <v-icon>mdi-read</v-icon>
                    </v-btn>
                  </template>
                  <span>ReGenerar</span>
                </v-tooltip>
              </template>

              <template v-slot:item.dian="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="send_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="
                        parseInt(item.nrofactura_rep.trim()) == 0 ? true : false
                      "
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Enviar DIAN</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="consultadian_item(item, 0)"
                      color="green"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.iddian_rep.trim() == ''"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="
                        parseInt(item.nrofactura_rep.trim()) == 0 ? true : false
                      "
                      color="blue"
                      class="ma-2 white--text"
                      @click="imprimir_factura(item)"
                      v-on="on"
                      depressed
                      small
                      fab
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Factura</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
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
          <v-card-title>Adjuntar documento Pdf</v-card-title>
          <v-card-text>
            <v-col class="d-flex" cols="6">
              <v-file-input
                label="Cargar Soportes"
                accept=".pdf"
                outlined
                hide-details
                v-model="form.pdf"
                @change="errores.pdf = false"
              ></v-file-input>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
            <v-btn
              depressed
              color="blue darken-2"
              class="white--text px-12 mx-5"
              @click="up_file"
              >Subir archivo</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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

    <v-dialog v-model="dialogofact.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Receptor de la Factura</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-autocomplete
                label="Receptor"
                v-model="form.rut"
                :items="tablaruts"
                :item-text="format_ruts"
                item-value="item.identificacion"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col sm="12" cols="4">
              <v-textarea
                outlined
                clearable
                label="Observaciones"
                v-model="form.observaciones"
                counter="500"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="cerrar_receptor()"
                >Grabar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="dialogofact.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogorechazo.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Rechazo de Servicios</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                :items="[
                  { text: 'Error en Autorización', value: 1 },
                  { text: 'Error en fecha', value: 2 },
                  { text: 'Error en Sesion', value: 3 },
                ]"
                label="Motivo de rechazo"
                v-model="form.motivo"
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col sm="12" cols="4">
              <v-textarea
                outlined
                clearable
                label="Observaciones"
                v-model="form.observaciones"
                counter="500"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="grabar_rechazo()"
                >Grabar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="cerrar_rechazo()"
                >Salir</v-btn
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
import { factura_titan } from "../../_formatos_sal.js";
import { FlowerSpinner } from "epic-spinners";
export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      load_contrato: true,
      load_table: false,
      pickeFechaIni: false,
      fechaFactura_picker: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",

      fecha_final: this.$moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Soportes", value: "soporte", align: "center" },
        { text: "Procesos", value: "genera", align: "center" },
        { text: "Dian", value: "dian", align: "center" },

        // { text: "Sede", align: "center", value: "sede_rep" },
        // { text: "Numero", align: "center", value: "numero_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Id_Paciente", align: "center", value: "idbase_rep" },
        { text: "Desc_Paciente", align: "center", value: "descpaciente_rep" },
        { text: "Autorizacion", align: "center", value: "autorizacion_rep" },
        { text: "Estado", align: "center", value: "descrestado_rep" },
        { text: "Servicio", align: "center", value: "nombreserv_rep" },
        { text: "Cantidad", align: "center", value: "cantidad_rep" },

        { text: "Cuotas M/Copagos", align: "center", value: "tabonos_rep" },

        { text: "Entidad", align: "center", value: "entidad_rep" },
        { text: "Prefijo", align: "center", value: "pref_rep" },
        { text: "Factura", align: "center", value: "nrofactura_rep" },
      ],

      dialogofact: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogorechazo: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialog: false,
      valid: false,
      form: [],
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
        card: false,
      },
      card: {
        loader: false,
        disabled: false,
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
      item_select: [],
      contratos_clrpServ101: [],
      contratos: [],
      pacientes: [],
      servicios: [],
      tablaruts: [],
      info_servicios: {
        fecha: null,
        consecutivo: null,
        autorizacion: null,
        copago: null,
        cuotaModeradora: null,
        paciente: null,
        observaciones: null,
        descuento: null,
        medio_pago: 1,
        cita: null,
        diagnostico: null,
      },
      contrato_select: [],
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
        anoserv: false,
        diagnostico: false,
      },
      citas: [],
      item_fact: {},

      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
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
      fechaFactura: this.$moment().format("YYYY-MM-DD"),
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        ruta: null,
        consecutivo: null,
      },
      empresa: null,
    };
  },
  created() {
    this.cargarTablaruts();
    this.cargar_años();
    this.get_contratos();
    this.cargar_empresa();
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
    async get_autoriza(item) {
      let empresa = parseFloat(this.empresa.id_empr);
      let nro_auto = item.autorizacion_rep.trim();
      let id_cliente = parseFloat(item.idcliente_rep);
      let idFile = empresa + "PRAUTO_" + id_cliente + "_" + nro_auto + ".pdf";

      const url =
        "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

      const timestamp = new Date().getTime(); // Genera un timestamp único
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank"); // Abre el PDF
    },
    confirmar_receptor(item) {
      this.item_fact = item;

      var busqueda_cliente = this.tablaruts.find(
        (el) => el.identificacion_rut == item.idcliente_rep
      );
      this.form.rut = busqueda_cliente;
      this.form.observaciones = "";

      this.dialogofact.estado = true;
    },
    cerrar_receptor() {
      this.dialogofact.estado = false;
      this.generar_factura(this.item_fact);
    },
    consultadian_item(item, tipo) {
      let cufe = item.iddian_rep.trim();
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${parseFloat(val.identificacion_rut.trim())} - ${
        val.descripcion_rut
      }`;
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },

    async send_dian(item) {
      let agencia = item.sede_rep;
      var prefijo = item.pref_rep.trim();
      var numero = parseFloat(item.nrofactura_rep);
      var fecha = item.fechafact_rep.substring(0, 4);
      this.card.loader = true;
      this.card.disabled = true;
      let datosEnvio = null;
      datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        numero +
        "|" +
        fecha +
        "|" +
        agencia +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrFactTitanJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.masivo.jsonEnvio.push(data[0]);
          this.envio_json_titan(0);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "error",
            text: "Ha ocurrido un error durante el envio",
            estado: true,
          });
        });
    },
    async envio_json_titan(index) {
      let factura = this.masivo.jsonEnvio[index];
      let items_fact = factura.invoice_lines.length;
      if (items_fact > 1) {
        factura.invoice_lines.pop();
      }

      var _this = this;
      let urlEnvio = "https://server1ts.net/financiero/inc/elect.titan.php";

      let observacion64 = window.atob(factura.Observaciones64.trim());
      if (observacion64) {
        factura.Observaciones64 = observacion64;
      }

      var formData = new FormData();
      formData.append("factura", JSON.stringify(factura));
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          let new_index = index + 1;
          if (new_index == _this.masivo.jsonEnvio.length) {
            if (_this.masivo.res.length > 0) _this.grabar_cufe_masivo(0);
            else _this.fin_proceso_masivo();
          } else _this.envio_json_titan(new_index);
        })
        .then(async (response) => {
          this.card.loader = false;
          this.card.disabled = false;
          let valido = false;
          let mensaje = "";
          let cufe = response.cufe;
          let errordian = "";
          let error2_dian = "";

          let item_envio = {
            Comprobante: {
              Prefijo: null,
              Numero: null,
              Fecha: null,
              Token_fact: null,
            },
          };
          let respuesta_dian = null;
          if (response.ResponseDian) {
            respuesta_dian =
              response.ResponseDian.Envelope.Body.SendBillSyncResponse
                .SendBillSyncResult.IsValid;

            if (respuesta_dian == "false") {
              mensaje =
                response.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.ErrorMessage.string;
              this.send_error(mensaje);
            } else {
              let new_index = index + 1;

              if (new_index == _this.masivo.jsonEnvio.length) {
                if (_this.masivo.res.length > 0)
                  await _this.grabar_cufe_masivo(0);
                else _this.fin_proceso_masivo();
              } else await _this.envio_json_titan(new_index);
            }
          } else {
            if (response.success == false) {
              mensaje = response.message;
              if (
                mensaje ==
                "Este documento ya fue enviado anteriormente, se registra en la base de datos."
              ) {
                cufe = response.cufe;
                await _this.grabar_cufe_masivo(0, cufe);
              }
              this.send_error(mensaje);
            }
          }
        });
    },

    async grabar_cufe_masivo(index, cufe) {
      var _this = this;
      let item = this.masivo;

      var prefijo = item.jsonEnvio[0].prefix;
      var consecutivo = item.jsonEnvio[0].number;
      var fecha = item.jsonEnvio[0].fecha;
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";

      await post
        .postData({
          url: "Clinico/dlls/ClPrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let new_index = index + 1;
          if (new_index == this.masivo.res.length + 1)
            _this.fin_proceso_masivo();
          else _this.grabar_cufe_masivo(new_index);
          return true;
        })
        .catch((err) => {
          this.send_error(
            "Ha ocurrido un error grabando el CUFE de la factura."
          );
        });
    },
    fin_proceso_masivo() {
      var _this = this;
      this.masivo = {
        data: [],
        jsonEnvio: [],
        res: [],
      };

      _this.card.loader = false;
      _this.card.disabled = false;

      if (this.tipo_envio == 0) {
        _this.consultarServicios();
      }
      this.tipo_envio = 0;
      this.init_dialogo_rango();
    },
    init_dialogo_rango() {
      this.dialogo_rango = {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      };
    },
    imprimir_factura(item) {
      this.loader = true;
      var numero = parseFloat(item.nrofactura_rep);
      var prefijo = item.pref_rep;
      let fecha = item.fechafact_rep.substr(0, 4);

      post
        .postData({
          url: "Clinico/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|" +
            numero +
            "|" +
            fecha +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          this.loader = false;
          data = data[0];
          this.generar_pdf_2(data);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      descripcion64 = window.atob(data.Observaciones64);
      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      if (getBase64) return await factura_titan(data, getBase64);
      else factura_titan(data, false, true);
    },
    async up_file() {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let file = this.form.pdf;

      if (!file) {
        this.send_error("Debes adjuntar un documento");
      } else {
        this.dialogo_archivo.loader = true;
        let prefijo = this.item_select.pref_rep.trim();
        let consecutivo = this.item_select.numero_rep.trim();

        let nombre_pdf = empresa + "FACT_" + prefijo + consecutivo + ".pdf";
        let data = new FormData();
        data.append("nombre_pdf", nombre_pdf);
        data.append("file", this.form.pdf);

        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/salud.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());
        this.dialogo_archivo.loader = false;
        this.$emit("snack", {
          color: "success",
          text: "Soporte guardado Correctamente",
          estado: true,
        });
        this.cancelar_subida();
      }
    },
    get_soportes(item) {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      let prefijo = item.pref_rep.trim();
      let consecutivo = item.numero_rep.trim();
      let idFile = empresa + "FACT_" + prefijo + consecutivo + ".pdf";
      const url =
        "https://storage.googleapis.com/documentos_titan/SALUD/" + idFile;

      const timestamp = new Date().getTime(); // Genera un timestamp único
      const urlSinCache = `${url}?_=${timestamp}`;
      window.open(urlSinCache, "_blank"); // Abre el PDF
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.consecutivo = null;
    },
    subir_soportes(item) {
      this.item_select = item;
      this.dialogo_archivo.estado = true;
      this.dialogo_archivo.ruta_pdf = item.rutapdf;
      this.dialogo_archivo.consecutivo = item.numero.replace(/\ /g, "");
    },
    get_contratos: function () {
      post
        .postData({
          url: "Clinico/dlls/titCL304JL.dll",
          data: sessionStorage.Sesion + "|" + "01" + "|",
          method: "POST",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos_clrpServ101 = data;
          this.load.contratos = false;
          // this.get_pacientes();
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
          url: "Clinico/dlls/titCL301j.dll",
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
      if (this.contrato_select) {
        this.load.servicios = true;
        post
          .postData({
            url: "Clinico/dlls/titCL304j.dll",
            data: sessionStorage.Sesion + "|" + this.contrato_select + "|",
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
              text: "Error al cargar servicios",
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
            url: "Clinico/dlls/titCL102JP.dll",
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
    format_contrato(val) {
      return val.nro + " - " + val.descripcion + "-" + val.detalle;
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
      item.lote = "00";
      this.tablaDetalle.data.push(item);
      this.dialogo.estado = false;
      this.clear_form();
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
    generar_factura(item) {
      var $this = this;

      if (!this.form.anoserv) {
        this.errores.anoserv = true;
        this.send_error("Selecciona un año de Servicio");
      } else if (!this.fechaFactura) {
        $this.$emit("snack", {
          color: "error",
          text: "Selecciona la fecha de la factura",
          estado: true,
        });
      } else {
        this.load.card = true;
        var fechaFactura = this.fechaFactura.split("-").join("");
        var sede = item.sede_rep;
        var numero = parseFloat(item.numero_rep);
        var anoserv = this.form.anoserv;
        let cliente = this.form.rut.identificacion_rut;
        let autorizacion = item.autorizacion_rep.trim();
        let copago = item.copago_rep.trim();
        let cuotam = item.cuotam_rep.trim();
        var observaciones64 = this.form.observaciones
          ? window.btoa(this.form.observaciones)
          : "";
        var observaciones = observaciones64 || "";

        var datos =
          sessionStorage.Sesion +
          "|" +
          sede +
          "|" +
          numero +
          "|" +
          fechaFactura +
          "|" +
          anoserv +
          "|" +
          cliente +
          "|" +
          autorizacion +
          "|" +
          copago +
          "|" +
          cuotam +
          "|" +
          observaciones +
          "|";
        post
          .postData({
            url: "Clinico/dlls/PrFactAuto.dll",
            data: datos,
            method: "POST",
          })
          .then((data) => {
            this.load.card = false;
            this.consultarServicios();
            $this.$emit("snack", {
              color: "success",
              text: "Factura generada correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.load.card = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al generar la factura",
              estado: true,
            });
          });
      }
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
      let estado_fecha = this._validarFechas();
      var ptes = this.form.sptes ? "1" : "0";
      this.prest_servicios = [];
      if (this.selectContrato) {
        if (estado_fecha) {
          this.loader = true;
          post
            .postData({
              url: "Clinico/dlls/ClRpPrest0202J.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                1 +
                "|" +
                this.selectContrato.nro +
                "|" +
                this.selectContrato.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                ptes +
                "|",
              method: "",
            })
            .then((data) => {
              data.pop();
              this.prest_servicios = data;
              this.loader = false;
            })
            .catch((err) => {
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios",
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
    regenerar_factura(item) {
      var $this = this;

      if (!this.form.anoserv) {
        this.errores.anoserv = true;
        this.send_error("Selecciona un año de Servicio");
      } else if (!this.fechaFactura) {
        $this.$emit("snack", {
          color: "error",
          text: "Selecciona la fecha de la factura",
          estado: true,
        });
      } else {
        this.load.card = true;
        var fechaFactura = this.fechaFactura.split("-").join("");
        var sede = item.sede_rep;
        var numero = parseFloat(item.nrofactura_rep);
        var anoserv = this.form.anoserv;
        let cliente = item.idcliente_rep;
        let autorizacion = item.autorizacion_rep.trim();
        let copago = item.copago_rep.trim();
        let cuotam = item.cuotam_rep.trim();
        var observaciones64 = this.form.observaciones
          ? window.btoa(this.form.observaciones)
          : "";
        var observaciones = observaciones64 || "";

        var datos =
          sessionStorage.Sesion +
          "|" +
          sede +
          "|" +
          numero +
          "|" +
          fechaFactura +
          "|" +
          anoserv +
          "|" +
          cliente +
          "|" +
          autorizacion +
          "|" +
          copago +
          "|" +
          cuotam +
          "|" +
          observaciones +
          "|";
        post
          .postData({
            url: "Clinico/dlls/PrFactAutoR.dll",
            data: datos,
            method: "POST",
          })
          .then((data) => {
            this.load.card = false;
            this.consultarServicios();
            $this.$emit("snack", {
              color: "success",
              text: "Factura generada correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.load.card = false;
            $this.$emit("snack", {
              color: "error",
              text: "Error al generar la factura",
              estado: true,
            });
          });
      }
    },
    abrir_rechazo(item) {
      this.item_select = item;
      console.log(item);
      this.form.observaciones = "";

      this.dialogorechazo.estado = true;
    },
    grabar_rechazo() {
      function toBase64(texto) {
        return btoa(unescape(encodeURIComponent(texto)));
      }

      let autorizacion = this.item_select.autorizacion_rep.trim();
      let entidad = parseFloat(this.item_select.idcliente_rep.trim());
      let motivo = this.form.motivo;
      const observaciones = toBase64(this.form.observaciones.trim());

      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/PrRechazoAuto.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            autorizacion +
            "|" +
            entidad +
            "|" +
            motivo +
            "|" +
            observaciones +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.dialogorechazo.estado = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al grabar Rechazo",
            estado: true,
          });
        });
    },
    cerrar_rechazo() {
      this.dialogorechazo.estado = false;
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
