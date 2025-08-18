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
                >Recibos de caja y Egresosxx</v-list-item-title
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
                disabled
                return-object
              ></v-autocomplete>
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
                  ></v-text-field>
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
                      <span>Anular RPC</span>
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
                  ></v-text-field>
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
                      <span>Anular Egreso</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="green"
                          icon
                          depressed
                          v-on="on"
                          @click="contabilizar_egr(item)"
                        >
                          <v-icon>mdi-human-edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Contabilizar Egreso</span>
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
                v-model="form_recibo.tipo"
                @change="asignar_consecutivo()"
                :error="errores_recibo.tipo"
                @input="errores_recibo.tipo = false"
                hide-details
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Consecutivo"
                v-model="form_recibo.consecutivo"
                outlined
                hide-details
                disabled
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="estados_recibo.egr">
            <v-col cols="12">
              <v-autocomplete
                label="Concepto"
                :items="conceptos_egr"
                outlined
                clearable
                :item-text="format_conceptos"
                v-model="form.conceptos"
                hide-details
                return-object
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Cédula"
                v-model="form.cedula"
                outlined
                hide-details
                clearable
                :error="errores_recibo.cedula"
                @input="errores_recibo.cedula = false"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Valor pagado"
                prefix="$"
                outlined
                hide-details
                clearable
                v-model="form.vlr"
                :value="formatNumero(form.vlr)"
                @keypress="lettersDisabled()"
                @input="input_mask('vlr', (errores_recibo.registros = false))"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Detalle"
                v-model="form.detalle"
                outlined
                hide-details
                clearable
              ></v-text-field>
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
      pickerFecha: false,
      abiertos: null,
      consecutivo: 0,
      tipos: [
        { text: "01 - RPC", value: "001" },
        { text: "02 - Egresos", value: "002" },
      ],
      placas: [],
      conceptos_rpc: [],
      convenios: [
        { text: "1 - V.PROPIO", value: "1" },
        { text: "2 - V.ADMON/CORBIMETA", value: "2" },
        { text: "3 - V.AJENO", value: "3" },
        { text: "4 - BRASILIA", value: "4" },
        { text: "5 - REDBUS", value: "5" },
        { text: "6 - PINBUS", value: "6" },
        { text: "7 - VARIOS", value: "7" },
      ],
      conceptos_egr: [],
      conductores: [],
      embarques: [],
      fechas: [],
      horarios: [],

      expanded: [],
      form: { estado: false },
      form_recibo: {},

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
      },
      errores_recibo: {},
      card_estado: false,
      embarquesIguales: false,

      ptosrecaudo: [],
      contenido_rpc: [],
      contenido_egr: [],

      estados_recibo: {},
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargarplacas();
    this.cargarconceptos();
    this.cargaragencias();
    this.cargarconsecutivo(13);
    this.cargarconsecutivo(14);
    this.estados_recibo.egr = true;

    // this.cargar(
    //   "conductores",
    //   "Financiero/dlls/Cfrutsj.dll",
    //   "Conductores principales"
    // );
    // this.cargar("embarques", "/transporte/dlls/PrembarquesJ.dll", "Embarques");
    // this.cargar("horarios", "/transporte/dlls/PrhorariosJ.dll", "Horarios");
  },
  methods: {
    asignar_consecutivo() {
      let tipo = this.form_recibo.tipo;

      if (tipo == "001") {
        this.cargarconsecutivo(13);

        this.estados_recibo.rpc = true;
        this.estados_recibo.egr = false;
        this.vaciar_concegr();

        this.form_recibo.convenio = undefined;
      } else if (tipo == "002") {
        this.cargarconsecutivo(14);
        this.estados_recibo.egr = true;
        this.estados_recibo.rpc = false;
      }
    },

    agregar_registro() {
      let registro = this.form_recibo.registroview;
      let errores = this.errores_recibo.registroview;
      if (!registro.conc) {
        errores.conc = true;
        this.send_error("Campo Obligatorio!");
      } else if (!registro.vlr) {
        errores.vlr = true;
        this.send_error("Campo Obligatorio!");
      } else if (!registro.rut) {
        errores.rut = true;
        this.send_error("Campo Obligatorio!");
      } else if (!registro.det) {
        errores.det = true;
        this.send_error("Campo Obligatorio!");
      }
    },
    asignar_concegr() {
      if (this.form_recibo.convenio) {
        let convenio = this.form_recibo.convenio;
        if (convenio == "1") {
          this.estados_recibo.conc_egr = true;
          console.log("1");
        } else this.vaciar_concegr();
      }
    },
    vaciar_concegr() {
      this.estados_recibo.conc_egr = false;
      this.form_recibo.registros = [];
    },
    asignar_cedula() {
      if (this.form_recibo.placa) {
        let placa = this.form_recibo.placa;
        this.form_recibo.cedula = parseFloat(placa.idprop_veh);
      } else this.form_recibo.cedula = null;
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

    contabilizar_egr(data) {
      let tipo = parseInt(data.tipo);
      let fecha = data.fechacorta.replace(/-/g, "");
      let consecutivo = parseInt(data.consecutivo);
      let placa = "";
      let rut = data.registros[0].idrut;
      let lote = data.doc_egreso.trim();
      let archivo = "";
      let detalle = data.registros[0].detalle.trim();
      let operador = data.idelabora.trim();
      let cuenta = data.registros[0].ctaconcepto.trim();
      let agencia = data.agencia;
      let valor = data.registros[0].valor.replace(/,/g, "").trim();

      let datos = {
        url: "taxmeta/app//TAX901.dll",
        setUrl: "https://server2ts.net/taxmeta/inc/index.php",
        data:
          tipo +
          "|" +
          fecha +
          "|" +
          consecutivo +
          "|" +
          placa +
          "|" +
          rut +
          "|" +
          lote +
          "|" +
          archivo +
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
          "|",
        method: "",
      };
      return new Promise((res, rej) => {
        post.postData(datos).then(res).catch(rej);
      });
    },
    cargarconsecutivo: function (nro) {
      this.loader = true;
      post
        .postData({
          url: "/transporte/dlls/PrConsecutivoJ.dll",
          data: sessionStorage.Sesion + "|" + nro + "|" + "0011" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          // console.log(data)
          let consec = JSON.parse(JSON.stringify(data))[0];
          this.form_recibo.consecutivo = consec.nro_cons.trim();
        })
        .catch((err) => {
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
          let punto = this.ptosrecaudo.find((el) => el.codigo_agc == "0011");
          this.form.puntos = punto;
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
            data: sessionStorage.Sesion + "|" + fecha + "|" + agencia + "|",
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
              el.estadoLetras = el.estado == "0" ? "Activo" : "Desactivado";

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
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      // let camposllenos = true;

      // Object.keys(this.errores).forEach((el) => {
      //   this.validarCampo(el, data);
      //   if (this.errores[el]) camposllenos = false;
      // });

      // if (camposllenos) {
      //   if (data.cedula) {
      //     this.errores.origen = true;
      //     this.errores.destino = true;
      //     this.send_error("Origen y destino no pueden ser iguales!");
      //     this.embarquesIguales = true;
      this.format_envio(data);
      // }
    },

    format_envio(data) {
      // console.log(this.form.puntos)
      this.card_estado = true;
      // let punto_taquilla = sessionStorage.llave_punto;
      // let punto = JSON.parse(atob(punto_taquilla));
      let agencia = this.form.puntos.codigo_agc;
      let tipo = this.form_recibo.tipo;
      let consec = this.form_recibo.consecutivo.trim();
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let convenio = "0";
      let cedula = this.form.cedula;
      let placa = "";
      let idconcepto = this.form.conceptos.id_conc;
      let valor = this.form.vlr;
      let nroconv = "0";
      let detalle = this.form.detalle;

      let datos = {
        url: "Transporte/dlls/PrComprobanteV.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          consec +
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
          // this.contabilizar_egr();
          this.limpiarformato();
          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    limpiarformato() {
      this.form.conceptos = null;
      this.form.cedula = "0";
      this.form.vlr = "0";
      this.form.detalle = "";
    },
    agregar_recibo() {
      this.init_formRecibo();
      // this.form.estado = true;
      this.dialogo.titulo = "Crear recibo";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_formRecibo() {
      this.form_recibo = { registros: [] };
      this.errores = {
        tipo: false,
        consecutivo: false,
        convenio: false,
        cedula: false,
        registros: false,
      };
      this.estados_recibo = {
        global: false,
        rpc: false,
        egr: false,
        conc_egr: false,
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
