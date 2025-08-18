<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-format-strikethrough-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Recibos de caja y anticipos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_recibo()"
              >
                Agregar Recibo
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
          <v-row>
            <v-col cols="12" md="3">
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
                    :error="errores.fecha"
                    @input="errores.fecha = false"
                    outlined
                    v-on="on"
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
            <v-col class="d-flex" cols="12" md="4">
              <v-autocomplete
                :items="ptosrecaudo"
                label="Agencia"
                v-model="form.puntos"
                :item-text="format_ptos"
                :error="errores.puntos"
                @input="errores.puntos = false"
                hide-details
                outlined
                return-object
              >
              </v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-btn
                color="indigo"
                class="white--text mt-1"
                large
                depressed
                @click="cargarcontenido"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <div v-if="form.estado" class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="12">
                <v-card-title>
                  <h2 class="text-subtitle-2">COMPROBANTES RPC</h2>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search_rpc"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers_rpc"
                  :items="contenido_rpc"
                  :search="search_rpc"
                  :expanded_rpc.sync="expanded"
                  item-key="consecutivo"
                  show-expand
                  class="elevation-1"
                >
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <table class="col-8 mx-auto">
                        <tbody>
                          <tr>
                            <td>
                              <b>Cuenta concepto</b>
                            </td>
                            <td>{{ formatConcepto(item.registros[0]) }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Rut</b>
                            </td>
                            <td>{{ parseFloat(item.registros[0].idrut) }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Placa</b>
                            </td>
                            <td>{{ item.registros[0].placa }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Operador</b>
                            </td>
                            <td>{{ item.idelabora.trim() }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Detalle</b>
                            </td>
                            <td>{{ item.registros[0].detalle }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </template>
                  <template v-slot:item.action="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="red accent-3"
                          icon
                          depressed
                          v-on="on"
                          @click="anular(item)"
                        >
                          <v-icon>mdi-book-arrow-right-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Anular Comprobante</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="orange accent-3"
                          icon
                          depressed
                          v-on="on"
                          @click="recontab(item)"
                        >
                          <v-icon>mdi-human-edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Recontabilizar Comprobante</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12" class="mt-4">
                <v-card-title>
                  <h2 class="text-subtitle-2">COMPROBANTES EGRESOS</h2>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search_egr"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers_egr"
                  :items="contenido_egr"
                  item-key="consecutivo"
                  :expanded_rpc.sync="expanded"
                  :search="search_egr"
                  show-expand
                  class="elevation-1"
                >
                  <template v-slot:expanded-item="{ headers, item }">
                    <td
                      :colspan="headers.length"
                      v-if="item.registros[0].concepto == 0"
                    >
                      <table
                        class="col-8 mx-auto"
                        v-for="(reg, index) in item.registros"
                        :key="index"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <b>Valor convenio:</b>
                            </td>
                            <td>{{ `$${reg.valor.trim()}` }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Rut:</b>
                            </td>
                            <td>{{ parseFloat(reg.idrut) }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Placa:</b>
                            </td>
                            <td>{{ reg.placa }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Operador:</b>
                            </td>
                            <td>{{ item.idelabora.trim() }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Detalle:</b>
                            </td>
                            <td>{{ reg.detalle }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td :colspan="headers.length" v-else>
                      <table class="col-8 mx-auto">
                        <tbody>
                          <tr>
                            <td>
                              <b>Placa:</b>
                            </td>
                            <td>{{ item.registros[0].placa }}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Operador:</b>
                            </td>
                            <td>{{ item.idelabora.trim() }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="col-12">
                        <thead>
                          <tr>
                            <th>Concepto</th>
                            <th>Rut</th>
                            <th>Valor</th>
                            <th>Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(reg, index) in item.registros"
                            :key="index"
                          >
                            <td class="text-center">
                              {{ formatConcepto(reg) }}
                            </td>
                            <td class="text-center">
                              {{ parseFloat(reg.idrut) }}
                            </td>
                            <td class="text-center">
                              {{ `$${reg.valor.trim()}` }}
                            </td>
                            <td class="text-center">{{ reg.detalle }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
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
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="red accent-3"
                          icon
                          depressed
                          v-on="on"
                          @click="anular(item)"
                        >
                          <v-icon>mdi-book-arrow-right-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Anular Comprobante</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="orange accent-3"
                          icon
                          depressed
                          v-on="on"
                          @click="recontab(item)"
                        >
                          <v-icon>mdi-human-edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Recontabilizar Comprobante</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Tipo"
                :items="tipos"
                outlined
                v-model="form.recibo_tipo"
                @change="asignar_consecutivo()"
                :error="errores.recibo_tipo"
                @input="errores.recibo_tipo = false"
                hide-details
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Consecutivo"
                v-model="form.recibo_consecutivo"
                item-text="nro_cons"
                outlined
                hide-details
                filled
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" v-if="estados_recibo.egr">
              <v-autocomplete
                label="Convenios"
                :items="convenios"
                outlined
                clearable
                v-model="form.recibo_convenio"
                @change="asignar_vpropio()"
                :error="errores.recibo_convenio"
                @input="errores.recibo_convenio = false"
                hide-details
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="6" v-if="conveniosel === '4'">
              <v-text-field
                label="Pasajero"
                v-model="form.pasajero"
                outlined
                hide-details
                filled
                :error="errores.pasajero"
                @input="errores.pasajero = false"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="conveniosel === '4'">
              <v-btn
                color="orange"
                class="ma-2 white--text"
                large
                depressed
                @click="consultar_auto()"
              >
                Buscar Autorizaciones
                <v-icon right dark class="ml-4"
                  >mdi-tooltip-check-outline</v-icon
                >
              </v-btn>
            </v-col>
            <v-col cols="12" v-if="conveniosel === '4'">
              <v-autocomplete
                label="Autorizaciones"
                :items="autorizaciones"
                :item-text="format_auto"
                outlined
                return-object
                clearable
                v-model="form.autorizaciones"
                :error="errores.autorizaciones"
                @input="errores.autorizaciones = false"
                hide-details
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="placasel">
              <v-autocomplete
                label="Placa"
                :items="placas"
                outlined
                clearable
                :item-text="format_placas"
                v-model="form.recibo_placa"
                @change="asignar_cedula()"
                :error="errores.recibo_placa"
                @input="errores.recibo_placa = false"
                hide-details
                return-object
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="estados_recibo.cedula">
              <v-text-field
                label="Cédula"
                v-model="form.recibo_cedula"
                outlined
                hide-details
                clearable
                :error="errores.recibo_cedula"
                @input="errores.recibo_cedula = false"
                :disabled="parseInt(tipo) == '001' ? false : true"
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="estados_recibo.rpc">
              <v-autocomplete
                label="Concepto"
                :items="conceptos_rpc"
                outlined
                clearable
                :item-text="format_conceptos"
                v-model="form.recibo_concepto"
                :error="errores.recibo_concepto"
                @change="errores.recibo_concepto = false"
                hide-details
                return-object
              >
              </v-autocomplete>
            </v-col>

            <!-- <v-col cols="12" v-if="conceptos_rpc">
              <v-autocomplete
                label="Conductor"
                :items="conceptos_rpc"
                outlined
                clearable
                :item-text="format_conceptos"
                v-model="form.recibo_concepto"
                :error="errores.recibo_concepto"
                @input="errores.recibo_concepto = false"
                hide-details
                return-object
              >
              </v-autocomplete>
            </v-col> -->

            <v-col cols="12" v-if="estados_recibo.vlr">
              <v-text-field
                label="Valor pagado"
                prefix="$"
                outlined
                hide-details
                clearable
                v-model="form.recibo_vlr"
                :value="formatNumero(form.recibo_vlr)"
                @keypress="lettersDisabled()"
                @input="input_mask('vlr', (errores.recibo_vlr = false))"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :items="fpago"
                label="Forma de pago"
                outlined
                clearable
                hide-details
                v-model="form.fpago"
                item-value="value"
                return-object
                required
                :error="errores.fpago"
                @change="errores.fpago = false"
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="12" v-if="estados_recibo.global">
              <v-text-field
                label="Detalle Principal"
                v-model="form.recibo_detalle"
                outlined
                hide-details
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" v-if="estados_recibo.vpropio">
              <v-card class="pa-2" outlined tile>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      label="Concepto"
                      :items="conceptos_egr"
                      outlined
                      clearable
                      :item-text="format_conceptos"
                      v-model="form.recibo_regvpro_conc"
                      :error="errores.recibo_regvpro_conc"
                      @input="errores.recibo_regvpro_conc = false"
                      hide-details
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Valor"
                      v-model="form.recibo_regvpro_vlr"
                      outlined
                      hide-details
                      clearable
                      type="number"
                      :error="errores.recibo_regvpro_vlr"
                      @input="errores.recibo_regvpro_vlr = false"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Rut"
                      v-model="form.recibo_regvpro_rut"
                      outlined
                      hide-details
                      clearable
                      type="number"
                      :error="errores.recibo_regvpro_rut"
                      @input="errores.recibo_regvpro_rut = false"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-textarea
                      label="Detalle_Concepto"
                      v-model="form.recibo_regvpro_det"
                      outlined
                      hide-details
                      clearable
                      :error="errores.recibo_regvpro_det"
                      @input="errores.recibo_regvpro_det = false"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-btn
                      color="blue"
                      class="white--text"
                      depressed
                      @click="agregar_registro()"
                    >
                      <v-icon dark>mdi-plus-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-data-table
                      :headers="estados_recibo_table.headers"
                      :items="estados_recibo_table.data"
                      class="elevation-1"
                    >
                      <template v-slot:item.action="{ item }">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              color="red accent-3"
                              class="mr-2"
                              icon
                              depressed
                              v-on="on"
                              @click="delete_item(item)"
                            >
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Eliminar</span>
                        </v-tooltip>
                      </template>
                      <template v-slot:body.append>
                        <td colspan="1" class="text-left">
                          <strong>TOTAL EGRESO</strong>
                        </td>
                        <td class="text-xs-right text-center">
                          <strong>{{ formatNumero(totalegr || 0) }}</strong>
                        </td>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <!-- <v-col cols="12">
              <p class="text-subtitle-1">Estado</p>
              <v-switch v-model="form.estado" inset label="activo"></v-switch>
            </v-col> -->
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
              init_formRecibo();
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
import { recibo_caja } from "../../_formatos_trans.js";

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
      totalegr: "0",
      pickerFecha: false,
      abiertos: null,
      conveniosel: "0",
      placasel: false,

      tipos: [
        { text: "01 - RPC", value: "001" },
        { text: "02 - Egresos", value: "002" },
      ],
      placas: [],
      consecutivos: [],
      conceptos_rpc: [],
      convenios: [
        { text: "1 - V.PROPIO", value: "1" },
        { text: "2 - V.ADMON", value: "2" },
        { text: "3 - V.AJENO", value: "3" },
        // { text: "4 - BRASILIA", value: "4" },
        // { text: "5 - REDBUS", value: "5" },
        // { text: "6 - PINBUS", value: "6" },
        // { text: "7 - VARIOS", value: "7" },
      ],
      conceptos_egr: [],
      tipo: "0",
      numero: "0",

      conductores: [],
      embarques: [],
      fechas: [],
      horarios: [],
      expanded: [],
      disabled: {
        cedula: true,
      },

      fpago: [
        { text: "Efectivo", value: 1 },
        { text: "Codigo QR", value: 3 },
      ],
      form: {
        recibo_placa: "",
        recibo_regvpro_vlr: "",
        recibo_regvpro_rut: "",
        recibo_vlr: "",
        recibo_cedula: "",
        fpago: null,
      },

      form_recibo: { regvpro: { conc: null }, registros: [] },

      search_rpc: "",
      headers_rpc: [
        { text: "", align: "right", value: "data-table-expand" },
        { text: "Documento", align: "center", value: "documento" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Concepto", align: "center", value: "concepto" },
        { text: "Estado", align: "center", value: "estadoLetras" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Opciones", align: "center", value: "action" },
      ],
      search_egr: "",
      headers_egr: [
        { text: "", align: "right", value: "data-table-expand" },
        { text: "Documento", align: "center", value: "documento" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Convenio", align: "center", value: "convenio" },
        { text: "Estado", align: "center", value: "estadoLetras" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Opciones", align: "center", value: "action" },
      ],

      errores: {
        fecha: false,
        puntos: false,
        recibo_tipo: false,
        recibo_convenio: false,
        recibo_cedula: false,
        recibo_placa: false,
        recibo_concepto: false,
        recibo_vlr: false,
        recibo_regvpro_conc: false,
        recibo_regvpro_vlr: false,
        recibo_regvpro_rut: false,
        recibo_regvpro_det: false,
        pasajero: false,
        fpago: false,
      },
      errores_recibo: {},
      card_estado: false,
      embarquesIguales: false,

      ptosrecaudo: [],
      contenido_rpc: [],
      contenido_egr: [],
      autorizaciones: [],
      estados_recibo: {},
      estados_recibo_table: {
        headers: [
          { text: "Concepto", align: "center", value: "concepto.descrip_conc" },
          { text: "Valor", align: "center", value: "valor" },
          { text: "Detalle", align: "center", value: "detalle" },
          { text: "Accion", align: "center", value: "action" },
        ],
        data: [],
      },
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargarplacas();
    this.cargarconceptos();
    this.cargaragencias();

    // this.cargar(
    //   "conductores",
    //   "Financiero/dlls/Cfrutsj.dll",
    //   "Conductores principales"
    // );
    // this.cargar("embarques", "/transporte/dlls/PrembarquesJ.dll", "Embarques");
    // this.cargar("horarios", "/transporte/dlls/PrhorariosJ.dll", "Horarios");
  },
  methods: {
    delete_item(item) {
      this.totalegr -= parseInt(item.valor);
      let index = this.estados_recibo_table.data.indexOf(item);
      this.estados_recibo_table.data.splice(index, 1);
    },
    consultar_auto() {
      let orden = "0";
      let idpasaj = this.form.pasajero ? this.form.pasajero : "0";
      this.contenido = [];
      let datos = {
        url: "/transporte/dlls/PrConvtrJ.dll",
        data:
          sessionStorage.Sesion + "|" + "0" + "|" + idpasaj + "|" + orden + "|",
        method: "",
      };

      post
        .postData(datos)
        .then((data) => {
          data.pop();
          this.autorizaciones = data;
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al consultar Registro");
        });
    },
    anular(item) {
      let tipo = item.tipo;
      let fecha = item.fechacorta.replace(/\-/g, "");
      let consec = item.consecutivo.trim();
      let agencia = item.agencia;

      let datos = {
        url: "/transporte/dlls/PrAnulacbJ.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          fecha +
          "|" +
          consec +
          "|" +
          agencia +
          "|" +
          "1" +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Registro Anulado correctamente",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al anular Registro");
        });
    },
    recontab(item) {
      let tipo = item.tipo;
      let fecha = item.fechacorta.replace(/\-/g, "");
      let consec = item.consecutivo.trim();
      let agencia = item.agencia;

      let datos = {
        url: "/transporte/dlls/PrReimpcb1JV.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          consec +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.contabilizar(data[0]);
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al anular Registro");
        });
    },
    async contabilizar(data) {
      let tipo = data.tipo;
      let fecha = data.fechacorta.replace(/\-/g, "");
      let consec = data.consecutivo.trim();
      let agencia = data.agencia;
      let placa = data.registros[0].placa;
      let rut = data.registros[0].idrut;
      let ctaag = data.ctaagencia.trim();
      let fpago = data.fpago;

      let lote = data.doc_contab.trim();

      let plano = "ccc.txt";
      let detalle = data.destalle.trim();
      let operador = data.idelabora.trim();
      let cuenta = data.registros[0].ctaconcepto.trim();
      let valor = data.registros[0].valor.replace(/,/g, "").trim();

      let convenio = data.convenio.trim();
      let iderp = data.idelabora;
      let idpcont = data.idconterp;
      let ruterp = data.registros[0].idrut;

      let tablaDestino = {};

      let valorTotal = 0;

      data.registros.pop();
      data.registros.forEach((el, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        tablaDestino[
          `DATOJ-${format_index}`
        ] = `${"2"}|${convenio}|${agencia}|${fecha}|${consec}|${iderp.trim()}|${ctaag}|${ruterp}|${lote}|${
          el.ctaconcepto
        }|${el.valor.replace(/,/g, "").trim()}|${
          el.idrut
        }|${el.detalletab.trim()}|${el.ctavehiculo}|${el.ccosto}|`;
        valorTotal += parseInt(el.valor.replace(/,/g, "").trim());
      });
      if (convenio == "02") {
        valor = valorTotal;
      }
      let datos = {
        url: "taxmeta/app//TAX901V.dll",
        setUrl: "https://server2ts.net/taxmeta/inc/index.php",
        json: true,
        data: {
          importarhtml:
            tipo +
            "|" +
            fecha +
            "|" +
            consec +
            "|" +
            placa +
            "|" +
            rut +
            "|" +
            lote +
            "|" +
            plano +
            "|" +
            detalle +
            "|" +
            operador +
            "|" +
            cuenta +
            "|" +
            agencia +
            "|" +
            valor +
            "|" +
            idpcont +
            "|" +
            fpago +
            "|",
          ...tablaDestino,
        },
        method: "",
      };

      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;

          this.$emit("snack", {
            color: "success",
            text: "Registro registrado correctamente",
            estado: true,
          });
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al anular Registro");
        });
    },
    asignar_consecutivo() {
      this.form.recibo_concepto = null;
      this.form.recibo_detalle = null;
      // this.init_formRecibo();
      this.estados_recibo.global = true;
      let tipo = this.form.recibo_tipo;
      if (tipo == "001") {
        this.estados_recibo.rpc = true;
        this.estados_recibo.egr = false;
        this.vaciar_vpropio();
        this.estados_recibo.vlr = true;
        this.estados_recibo.cedula = true;

        this.cargarconsecutivo(13);
        this.placasel = true;
      } else if (tipo == "002") {
        this.estados_recibo.egr = true;
        this.estados_recibo.rpc = false;
        this.estados_recibo.vlr = true;
        this.estados_recibo.cedula = true;

        this.cargarconsecutivo(14);
        this.placasel = true;
      }
      this.tipo = tipo;
    },
    async contabilizar_guardar() {
      await this.contab_guardar();
    },
    contab_guardar() {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      let tipo = this.tipo;
      let consec = this.numero;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let datos = {
        url: "/transporte/dlls/PrReimpcb1JV.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          consec +
          "|",
        method: "",
      };

      post
        .postData(datos)
        .then((data) => {
          this.card_estado = false;
          this.contabilizar(data[0]);
        })
        .catch((error) => {
          console.log(error.Mensaje);
          this.card_estado = false;
          this.send_error("Error al anular Registro");
        });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.recibo_tipo) {
        this.send_error("Debe Seleccionar un Tipo");
        this.errores.convenio = true;
      } else {
        let tipo = this.form.recibo_tipo;
        if (tipo == "001") {
          if (!data.recibo_placa) {
            this.send_error("Debe Seleccionar una Placa");
            this.errores.recibo_placa = true;
          } else if (!data.recibo_cedula) {
            this.send_error("Debe registrar una cedula");
            this.errores.recibo_cedula = true;
          } else if (!data.recibo_concepto) {
            this.send_error("Debe Seleccionar un concepto");
            this.errores.recibo_concepto = true;
          } else if (!data.recibo_vlr) {
            this.send_error("Debe registrar un valor");
            this.errores.recibo_vlr = true;
          } else if (!data.fpago) {
            this.send_error("Debe seleccionar forma de Pago");
            this.errores.fpago = true;
          } else this.format_envio_rpc(data);
        } else {
          if (!data.recibo_convenio) {
            this.send_error("Debe Seleccionar un convenio");
            this.errores.recibo_convenio = true;
          } else this.format_envio_egr(data);
        }
      }
    },
    format_envio_rpc(data) {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      let tipo = 1;
      let consecutivo = data.recibo_consecutivo;
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let convenio = "0";
      let cedula = data.recibo_cedula;
      let placa = data.recibo_placa.placa_veh;
      let idconcepto = data.recibo_concepto.id_conc;
      let valor = data.recibo_vlr;
      let nroconv = "0";
      let detalle = data.recibo_detalle;
      let fpago = data.fpago.value;

      this.card_estado = true;
      let datos = {
        url: "Transporte/dlls/PrComprobanteV.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          agencia +
          "|" +
          convenio +
          "|" +
          cedula +
          "|" +
          placa +
          "|" +
          idconcepto +
          "|" +
          valor +
          "|" +
          nroconv +
          "|" +
          detalle +
          "|" +
          fpago +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.numero = data[0];
          this.card_estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Rpc guardado correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contabilizar_guardar();
          this.impresiones();
          this.cargarcontenido();
          this.init_formRecibo();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    format_envio_egr(data) {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      let tipo = 2;
      let consecutivo = data.recibo_consecutivo;
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let convenio = data.recibo_convenio;
      let cedula = data.recibo_cedula ? data.recibo_cedula : "0";
      let placa = data.recibo_placa.placa_veh
        ? data.recibo_placa.placa_veh
        : "";
      let idconcepto = 0;
      let valor = data.recibo_vlr ? data.recibo_vlr : "0";
      let nroconv = data.autorizaciones ? data.autorizaciones.nro_rep : "0";
      let detalle = data.recibo_detalle;

      let tablaDestino = {};
      this.estados_recibo_table.data.forEach((el, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        tablaDestino[
          `DATOJ-${format_index}`
        ] = `${el.concepto.id_conc}|${el.rut}|${el.valor}|${el.detalle}`;
      });

      this.card_estado = true;
      let datos = {
        url: "Transporte/dlls/PrComprobanteV.dll",
        json: true,
        data: {
          importarhtml:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            consecutivo +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            convenio +
            "|" +
            cedula +
            "|" +
            placa +
            "|" +
            idconcepto +
            "|" +
            valor +
            "|" +
            nroconv +
            "|" +
            detalle +
            "|",
          ...tablaDestino,
        },
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.numero = data[0];
          this.card_estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Egreso guardado correctamente",
            estado: true,
          });
          this.card_estado = false;
          this.dialogo.estado = false;
          this.contabilizar_guardar();
          this.impresiones();
          this.estados_recibo_table.data = [];
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_registro() {
      if (!this.form.recibo_regvpro_conc) {
        this.send_error("Concepto Obligatorio!");
      } else if (this.form.recibo_regvpro_vlr == "0") {
        this.send_error("Valor Obligatorio!");
      } else if (this.form.recibo_regvpro_rut == "0") {
        this.send_error("Rut Obligatorio!");
      } else {
        let concepto = this.form.recibo_regvpro_conc;
        let valor = this.form.recibo_regvpro_vlr;
        let rut = this.form.recibo_regvpro_rut;
        let detalle = this.form.recibo_regvpro_det;

        let item = {
          concepto,
          valor,
          rut,
          detalle,
        };

        this.estados_recibo_table.data.push(item);
        this.totalegr += parseInt(valor);
        this.form.recibo_regvpro_vlr = 0;
        this.form.recibo_regvpro_rut = "0";
        this.form.recibo_regvpro_det = " ";
      }
    },
    asignar_vpropio() {
      this.totalegr = 0;
      if (this.form.recibo_convenio) {
        let convenio = this.form.recibo_convenio;
        this.conveniosel = convenio;
        this.estados_recibo_table.data = [];
        this.form.recibo_regvpro_vlr = "0";
        this.form.recibo_regvpro_rut = "0";
        this.form.recibo_regvpro_det = "";

        if (convenio == "1" || convenio == "2") {
          this.estados_recibo.vpropio = true;
          this.estados_recibo.vlr = false;
        } else if (convenio == "4") {
          this.placasel = false;
          this.vaciar_vpropio();
        } else {
          this.placasel = true;
          this.vaciar_vpropio();
          this.estados_recibo.vpropio = false;
          this.estados_recibo.vlr = true;
        }
      }
    },
    vaciar_vpropio() {
      this.estados_recibo.vpropio = false;
      this.form.recibo_regvpro = undefined;
      this.form.recibo_registros = [];
    },
    asignar_cedula() {
      if (this.form.recibo_placa) {
        let placa = this.form.recibo_placa;
        this.form.recibo_cedula = parseFloat(placa.idprop_veh);
      } else this.form.recibo_cedula = null;
    },
    imprimir(data) {
      data.fecha_impr = this.$moment().format("YYYY-MM-DD");
      data.hora_impr = this.$moment().format("HH:mm");

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        this.pdfs.getBase64(logoSuper_src).then((logoSuper) => {
          data.logoSuper = logoSuper;
          data.marca_agua = "Original";
          recibo_caja(data).then(() => {
            console.log("Impresion terminada");
          });
        });
      });
    },
    async impresiones() {
      await this.imprimir_guardar();
    },

    async imprimir_guardar() {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      let tipo = this.tipo;
      let nro = this.numero;
      let fecha = this.form.fecha.replace(/\-/g, "");
      await post
        .postData({
          url: "/transporte/dlls/PrReimpcb1JV.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            tipo +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            nro +
            "|",
          method: "",
        })
        .then(async (data) => {
          this.loader = false;
          let datos = JSON.parse(JSON.stringify(data))[0];
          datos.registros.pop();
          data = datos;
          data.concepto = datos.registros[0].concepto;
          data.detallegral = datos.registros[0].detalle;
          data.documento = nro;
          data.estadoLetras = "Anulado";
          data.fecha_impr = datos.registros[0].fecha;
          data.hora_impr = datos.registros[0].hora;
          data.tipo = tipo;
          data.valor = datos.registros[0].valor;
          data.registrodetalle;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");

          const logo = await this.pdfs.getBase64(logo_src);
          data.logo = logo;

          const logoSuper = await this.pdfs.getBase64(logoSuper_src);
          data.logoSuper = logoSuper;
          data.marca_agua = "Original";

          await recibo_caja(data);
          data.marca_agua = "Copia";

          await recibo_caja(data);

          console.log("Impres ion terminada");
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al Imprimir");
        });
    },
    cargarconsecutivo: function (nro) {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      this.loader = true;
      post
        .postData({
          url: "/transporte/dlls/PrConsecutivoJ.dll",
          data: sessionStorage.Sesion + "|" + nro + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let consecutivo = JSON.parse(JSON.stringify(data))[0];
          this.form.recibo_consecutivo = parseInt(consecutivo.nro_cons.trim());
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.send_error("Error al cargar Consecutivo");
        });
    },
    cargaragencias: function () {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todos",
          });
          var busqueda_pto = this.ptosrecaudo.find(
            (el) => el.codigo_agc == "0"
          );
          this.form.puntos = busqueda_pto;
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Agencias");
        });
    },
    cargarconceptos: function () {
      this.loader = true;
      post
        .postData({
          url: "/transporte/dlls/CfConceptoJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let conceptos = JSON.parse(JSON.stringify(data));
          conceptos.forEach((el) => {
            if (el.tipo_conc == "1") this.conceptos_rpc.push(el);
            else if (el.tipo_conc == "2") this.conceptos_egr.push(el);
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Conceptos",
            estado: true,
          });
        });
    },
    cargarplacas: function () {
      this.loader = true;
      post
        .postData({
          url: "Transporte/dlls/PrVehiculosJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.placas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehículos",
            estado: true,
          });
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_auto(val) {
      return `${val.nro_rep} - ${val.nombrepasajero_rep}`;
    },
    cargarcontenido() {
      if (!this.form.fecha) {
        this.errores.fecha = true;
        this.form.estado = false;
        this.send_error("Campo Obligatorio!");
      } else if (!this.form.puntos) {
        this.errores.puntos = true;
        this.form.estado = false;
        this.send_error("Campo Obligatorio!");
      } else {
        this.loader = true;
        let fecha = this.form.fecha.replace(/\-/g, "");
        let agencia = this.form.puntos.codigo_agc;
        this.contenido_rpc = [];
        this.contenido_egr = [];
        post
          .postData({
            url: "/transporte/dlls/PrReimpcbJV.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              fecha +
              "|" +
              agencia +
              "|" +
              "0" +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.form.estado = true;
            data.pop();

            let datos = JSON.parse(JSON.stringify(data));

            datos.forEach((el) => {
              el.documento = `${el.agencia.substr(
                -2,
                2
              )}00${el.consecutivo.trim()}`;

              el.registros.pop();
              let valorTotal = 0;
              el.registros.forEach((el_reg) => {
                valorTotal += parseFloat(el_reg.valor.replace(/\,/g, "")) || 0;
              });
              el.valor = "$" + this.formatNumero(valorTotal);
              el.estadoLetras = el.estado == "0" ? "Activo" : "Anulado";

              if (el.tipo == "001") {
                el.concepto = this.formatConcepto(el.registros[0]);
                this.contenido_rpc.push(el);
              } else if (el.tipo == "002") this.contenido_egr.push(el);
            });
          })
          .catch((err) => {
            this.loader = false;
            this.form.estado = false;
            this.send_error("Error al cargar Contenido");
          });
      }
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.form_recibo, index, val_edit);
      if (callback) callback();
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
    },
    asignar_conductor() {
      if (this.form_recibo.placa) {
        let data = this.form_recibo;
        data.cedula = parseFloat(data.placa.idprop_veh);
      }
    },
    desactivarErroresEmbarques(emb) {
      if (this.embarquesIguales) {
        this.errores.origen = false;
        this.errores.destino = false;
        this.embarquesIguales = false;
      } else this.errores[emb] = false;
    },
    format_placas: function (val) {
      return val.placa_veh.trim();
    },
    format_conceptos: function (val) {
      return `${val.cuenta_conc} - ${val.descrip_conc.trim()}`;
    },
    format_conductores: function (val) {
      return `${parseFloat(
        val.identificacion_rut
      )} - ${val.descripcion_rut.trim()}`;
    },
    format_embarques: function (val) {
      return val.descrip_emb;
    },
    format_horarios: function (val) {
      return val.horasal_hor;
    },
    validarCampo(campo, data) {
      if (!data[campo]) {
        this.errores[campo] = true;
        this.send_error("Campo Obligatorio!");
      }
    },
    agregar_recibo() {
      this.init_formRecibo();
      this.form.fecha = this.$moment().format("YYYY-MM-DD");

      // this.form.estado = true;
      this.dialogo.titulo = "Crear recibo";
      this.placasel = false;
      this.dialogo.estado = true;
      this.form.fpago = null;
      this.estados_recibo.vpropio = false;
      this.dialogo.tipo = 0;
    },
    init_formRecibo() {
      this.vaciar_vpropio();
      this.form.recibo_cedula = 0;
      this.form.recibo_vlr = 0;
      this.form.recibo_placa = 0;
      this.form.recibo_tipo = 0;
      this.form.fpago = null;
      this.estados_recibo.vpropio = false;
      this.form_recibo = { registros: [] };

      this.errores = {
        tipo: false,
        consecutivo: false,
        convenio: false,
        cedula: false,
        placa: false,
        concepto: false,
        vlr: false,
        regvpro: {
          conc: false,
          vlr: false,
          rut: false,
        },
      };
      this.estados_recibo = {
        global: false,
        rpc: false,
        egr: false,
        vpropio: false,
      };
    },
    formatConcepto(e) {
      return `- ${e.concepto.trim()}`;
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
