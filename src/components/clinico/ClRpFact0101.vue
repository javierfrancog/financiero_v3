<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title class="mt-0">
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cart-arrow-right</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Facturación por Paciente Cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Sede de Facturación"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  return-object
                  @change="errores.punto_fact = false"
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-select
                  :items="[
                    { text: 'Todos los Ruts', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Rut a Procesar"
                  clearable
                  hide-details
                  v-model="form.ruts"
                  required
                  @change="errores.ruts = false"
                  :error="errores.ruts"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Seleccione el Rut"
                  v-model="form.selruts"
                  :items="tablaruts"
                  :item-text="format_ruts"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  v-if="form.ruts ? (form.ruts == 1 ? false : true) : true"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                  @change="errores.selectContrato = false"
                  :error="errores.selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  label="Descripcion"
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
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

              <v-col class="d-flex" cols="2">
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
              <v-col cols="2" class="justify-end">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                  depressed
                  large
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="justify-end" cols="2">
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="prest_servicios.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="soloanulados"
                  label="Solo Anulados"
                ></v-switch>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="pteradicar"
                  label="Solo Pendientes x Radicar"
                ></v-switch>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-switch
                  v-model="ptedian"
                  label="Solo Pendientes DIAN"
                  @change="consultarServicios"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row> </v-row>
            <v-divider color="succes" class="mb-2"></v-divider>

            <v-row v-if="prest_servicios.length != 0">
              <v-col class="d-flex justify-center">
                <v-btn
                  color="green"
                  class="white--text mr-2"
                  depressed
                  @click="open_rango()"
                >
                  Envio masivo Dian
                </v-btn>
                <v-btn
                  color="orange"
                  class="white--text"
                  depressed
                  @click="
                    open_rango();
                    dialogo_rango.tipo = 2;
                  "
                >
                  Descarga Masiva Dian
                </v-btn>
                <v-btn
                  color="purple"
                  class="white--text ml-2"
                  depressed
                  @click="
                    open_rango();
                    dialogo_rango.tipo = 3;
                  "
                >
                  Radicación Masiva Sispro
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="mt-2" color="succes"></v-divider>

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
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <div class="col-8 mx-auto">
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td class="text-left pl-5"><b>Rips: </b></td>
                            <td class="text-left">{{ item.rips }}</td>
                          </tr>
                          <tr>
                            <td class="text-left pl-5"><b>Régimen: </b></td>
                            <td class="text-left">{{ item.regimen }}</td>
                          </tr>
                          <tr>
                            <td class="text-left pl-5"><b>Cufe: </b></td>
                            <td class="text-left">{{ item.cufe }}</td>
                          </tr>
                          <tr>
                            <td class="text-left pl-5"><b>Cuv: </b></td>
                            <td class="text-left">{{ item.cuv }}</td>
                          </tr>
                          <tr>
                            <td class="text-left pl-5"><b>Fecha Cuv: </b></td>
                            <td class="text-left">{{ item.fechacuv }}</td>
                          </tr>
                          <tr>
                            <td class="text-left pl-5"><b>Rechazo Cuv: </b></td>
                            <td class="text-left">{{ item.rechazo }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </td>
              </template>
              <template v-slot:item.opc_dian="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="send_dian(item), (envio_masivo = false)"
                      :disabled="item.cufe.trim() ? false : false"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
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
                      :disabled="item.cufe.trim() ? false : true"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_xml_dian(item)"
                      :disabled="item.cufe.trim() ? false : false"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-file-xml-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Xml</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_dian(item)"
                      :disabled="item.cufe.trim() ? false : false"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Aplicar id</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_attach(item)"
                      :disabled="item.cufe.trim() ? false : false"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-xml</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Attachment</span>
                </v-tooltip>
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_rips(item, 0)"
                      :disabled="item.cufe.trim() ? false : false"
                      color="indigo"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-alpha-r-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Rips 2275 Validador Manual</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_docker(item)"
                      :disabled="item.cufe.trim() ? false : false"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-alpha-s-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Radicar Sispro</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_sispro(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.cuv || item.cuv.trim().length < 10"
                    >
                      <v-icon>mdi-alpha-v-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Sispro</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="get_pdf(item)"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir PDF</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="open_mail(item)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.cufe.trim() ? false : true"
                    >
                      <v-icon>mdi-email-fast-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Reenviar Correo</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_excel(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-microsoft-excel</v-icon>
                    </v-btn>
                  </template>
                  <span>Excel Factura</span>
                </v-tooltip>
              </template>

              <template v-slot:item.numero="{ item }">
                {{ parseInt(item.numero) }}
              </template>

              <template v-slot:item.identificacion="{ item }">
                {{ parseInt(item.identificacion) }}
              </template>

              <template v-slot:item.estado="{ item }">{{
                item.estado == "1" ? "Anulada" : "Activa"
              }}</template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <!-- <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay> -->

    <v-overlay :value="!!loader" class="mi-overlay">
      <v-card
        class="pa-4 d-flex align-center"
        flat
        tile
        elevation="0"
        color="transparent"
      >
        <flower-spinner
          class="mr-3"
          :animation-duration="2500"
          color="#0d47a1"
        />
        <span class="white--text font-weight-medium">
          {{ loader }}
        </span>
      </v-card>
    </v-overlay>

    <v-dialog v-model="dialogo_rango.estado" persistent max-width="400">
      <v-card :disabled="dialogo_rango.loader" :loading="dialogo_rango.loader">
        <v-card-title class="headline"> Rango a Procesar</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Número inicial"
                outlined
                hide-details
                v-model="dialogo_rango.numInicial"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Número final"
                outlined
                hide-details
                v-model="dialogo_rango.numFinal"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="dialogo_rango.tipo == 2">
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.soloxml"
                label="Solo Archivos Xml"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="init_dialogo_rango">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="procesar_rango">
            Procesar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogocorreo.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Reenvío Factura</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino"
                clearable
                outlined
                type="text"
                v-model="form.correo"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino2"
                clearable
                outlined
                type="text"
                v-model="form.correo2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Correo Destino3"
                clearable
                outlined
                type="text"
                v-model="form.correo3"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="mr-8 white--text"
                @click="send_mail(item_envio, 1)"
                >Reenviar Correo</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogocorreo.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-overlay :value="loader">
        <flower-spinner
          :animation-duration="2500"
          :size="100"
          color="#0d47a1"
        />
      </v-overlay>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { factura_titan } from "../../_formatos_sal";
import axios from "axios";

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
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      soloanulados: null,
      pteradicar: null,
      ptedian: null,
      prest_servicios: [],
      headerCsv: [],
      tablaruts: [],
      agencias: [],
      correo: [],
      tipo_envio: 0,
      correodestino: "",
      correodestino2: "",
      correodestino3: "",
      dialogocorreo: {
        estado: false,
      },

      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      item_envio: 0,
      item_mail: 0,
      envio_masivo: 0,
      id_cuv: 0,

      errores: {
        punto_fact: false,
        ruts: false,
        selectContrato: false,
      },

      form: {
        ruts: null,
        soloxml: null,
      },

      headers: [
        { text: "Dian", value: "opc_dian", align: "center" },
        { text: "Opciones", value: "edit", align: "center" },

        { text: "Prefijo", align: "center", value: "pref" },
        { text: "Numero", align: "center", value: "numero" },
        {
          text: "Fecha",
          align: "left",
          value: "fecha_Factura",
          width: "100px",
        },
        { text: "Cliente", align: "left", value: "Cliente", width: "100px" },
        { text: "Id_Paciente", align: "center", value: "identificacion" },
        { text: "Desc_Paciente", align: "left", value: "descrip_paciente" },
        { text: "Valor", align: "center", value: "valor" },
        { text: "Copago/Cuota M", align: "center", value: "copago" },

        { text: "Autorizacion", align: "center", value: "autorizacion" },
        { text: "Rips", align: "center", value: "rips" },
        { text: "Estado", align: "left", value: "estado" },
        { text: "Nro_Servicio", align: "center", value: "nroprserv" },
      ],
      empresa: [],
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      masivo_pdf: {
        data: [],
      },
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: 0,
        numFinal: 0,
        loader: false,
      },
    };
  },
  created() {
    this.cargarContratos();
    this.get_empresa();
    this.cargarTablaAg();
    this.cargarTablaruts();
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
    get_pdf(item) {
      let numero = parseFloat(item.numero);
      let prefijo = item.pref.trim();
      let fecha = item.fecha_Factura;
      this.imprimir_factura(numero, prefijo, fecha);
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
          console.error(err);
          this.send_error("Error al cargar Ruts");
        });
    },
    format_ruts: function (val) {
      return `${val.descripcion_rut}`;
    },
    consultadian_item(item, tipo) {
      let cufe = item.cufe.trim();
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;

      window.open(url, "_blank").focus();
    },
    procesar_rango() {
      if (this.dialogo_rango.numInicial && this.dialogo_rango.numFinal) {
        var tipo = this.dialogo_rango.tipo;
        var numInicial = parseInt(this.dialogo_rango.numInicial);
        var numFinal = parseInt(this.dialogo_rango.numFinal);
        var data = this.prest_servicios.filter(
          (el) => el.numero >= numInicial && el.numero <= numFinal
        );
        let envio_xml = this.form.soloxml ? 1 : 0;
        this.envio_masivo = 1;
        this.tipo_envio = 0;
        this.dialogo_rango.loader = true;

        if (tipo == 3) {
          this.radicar_masivo(data, 0);
        } else {
          if (envio_xml == 1) {
            this.dialogo_rango.tipo = 1;
            this.enviar_masivo(data, 1);
          } else {
            this.enviar_masivo(data, 0);
          }
        }
      }
    },

    async enviar_masivo(datos, tipo_envio) {
      var data = null;

      if (this.dialogo_rango.tipo == 2) {
        // data = datos.filter((el) => el.cufe.trim());
        data = datos;
        this.masivo.data = JSON.parse(JSON.stringify(data));
        let index = 0;

        this.pdf_masivo(data);
      } else {
        if (tipo_envio == 1) {
          data = datos.filter((el) => el.cufe.trim());
        } else {
          data = datos;
        }

        this.masivo.data = JSON.parse(JSON.stringify(data));
        let index = 0;
        if (data.length > 0) {
          if (tipo_envio == 0) {
            for (const elemento of data) {
              const resultado = await this.cargar_json_masivo(elemento);
              index++;
              if (index === data.length) {
                if (this.envio_masivo == true) {
                  this.dialogo_rango.estado = false;
                }
                this.dialogo_rango.loader = false;
                this.consultarServicios();
              }
            }
          } else {
            for (const elemento of data) {
              const resultado = await this.get_xml_dian(elemento);
              index++;
              if (index === data.length) {
                if (this.envio_masivo == true) {
                  this.dialogo_rango.estado = false;
                }
                this.dialogo_rango.loader = false;
                this.consultarServicios();
              }
            }
          }
        } else {
          this.dialogo_rango.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "No hay datos para procesar",
            estado: true,
          });
        }
      }
    },
    send_dian(item) {
      this.loader = "Enviando a la Dian...";

      this.cargar_json_masivo(item);
    },
    async cargar_json_masivo(item) {
      var numero = item.numero;
      var prefijo = item.pref.trim();
      var fecha = item.fecha_Factura.substring(0, 4);

      let key = prefijo + "|" + numero + "|" + fecha;
      let datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let resultado = null;

      this.loader = false;

      fecha = fecha.substring(0, 4);
      let urlconsulta = "Clinico/dlls/PrFactTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });
        this.loader = false;
        if (data[0].health_fields) {
          if (data[0].health_fields.users_info[0].health_type_user_id == 0) {
            this.send_error("Error en tipo usuario del Paciente!");
          } else {
            resultado = await this.envio_json_titan(data[0]);
          }
        } else {
          resultado = await this.envio_json_titan(data[0]);
        }

        return resultado;
      } catch (err) {
        this.dialogo_rango.loader = false;
        console.log("error", err);
        this.masivo.jsonEnvio.push({ error: true });
      }
    },
    async envio_json_titan(index) {
      this.loader = "Consultando Factura...";

      let factura = index;
      let tipo = factura.type_document_id;
      let items_fact = factura.invoice_lines.length;
      if (items_fact > 1) {
        factura.invoice_lines.pop();
      }
      factura.customer.name = factura.customer.name.trim();
      var _this = this;
      let urlEnvio = "https://server1ts.net/financiero/inc/api_dian/elect.titan.php";
      if (tipo == 15) {
        urlEnvio = "https://server1ts.net/financiero/inc/electPos.titan.php";
      }
      let observacion64 = window.atob(factura.Observaciones64.trim());
      if (observacion64) {
        factura.Observaciones64 = observacion64;
      }
      var formData = new FormData();
      this.loader = "enviando Factura a la Dian...";
      formData.append("factura", JSON.stringify(factura));
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error:1 al enviar la factura:", error);
          this.loader = false;
          this.dialogo_rango.loader = false;
        })
        .then(async (response) => {
          this.card.loader = false;
          this.card.disabled = false;
          if (response.exception) {
            this.$emit("snack", {
              color: "error",
              text: "Error en Configuración de Pacientes. Descargue el excel de la factura para validar",
              estado: true,
            });
          } else {
            let fecha_envio = factura.date.replace(/\-/g, "");
            if (response.json) {
              const jsonString = response.json;
              const jsonObject = JSON.parse(jsonString);
              fecha_envio = jsonObject.date.replace(/\-/g, "");
            }
            let valido = false;
            let mensaje = "";
            let cufe = response.cufe;
            this.loader = false;

            let item_envio = {
              prefijo: null,
              consecutivo: null,
              fecha: null,
            };
            let not_valido = "";
            let error_notvalido = "";

            if (response.ResponseDian) {
              not_valido =
                response.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.IsValid;
              error_notvalido =
                response.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.ErrorMessage;
            }
            if (not_valido == "false") {
              this.$emit("snack", {
                color: "error",
                text: error_notvalido,
                estado: true,
              });
              cufe = "";
              response.success = false;
              item_envio.prefijo = factura.prefix;
              item_envio.consecutivo = factura.number;
              item_envio.fecha = factura.date.substring(0, 4);
              await _this.grabar_cufe(item_envio, cufe, 1, fecha_envio);
            }

            if (not_valido == "true") {
              response.success = true;
            }

            if (response.success == true) {
              this.loader = false;
              item_envio.prefijo = factura.prefix;
              item_envio.consecutivo = factura.number;
              item_envio.fecha = factura.date.substring(0, 4);
              await _this.grabar_cufe(item_envio, cufe, 1, fecha_envio);
              await _this.send_mail(item_envio, cufe, 1);
            } else {
              mensaje = response.message;
              if (
                mensaje ===
                "Este documento ya fue enviado anteriormente, se registra en la base de datos."
              ) {
                cufe = response.cufe;
                valido = true;
              } else {
                this.loader = false;

                if (response.exception) {
                  this.loader = false;
                  this.$emit("snack", {
                    color: "error",
                    text: response.message,
                    estado: true,
                  });
                }

                if (response.errors) {
                  this.loader = false;
                  this.$emit("snack", {
                    color: "error",
                    text: response.errors,
                    estado: true,
                  });
                }

                mensaje =
                  response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.ErrorMessage.string;
                if (
                  mensaje ===
                  "Regla: 90, Rechazo: Documento procesado anteriormente."
                ) {
                  cufe =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.XmlDocumentKey;
                  // cufe = response.cufe;
                  valido = true;
                } else {
                  mensaje =
                    response.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.ErrorMessage.StatusDescription;
                  if (mensaje === "Procesado Correctamente.") {
                    cufe = response.cufe;
                    valido = true;
                  }
                }
              }
              this.loader = false;
              if (valido === true) {
                item_envio.prefijo = factura.prefix;
                item_envio.consecutivo = factura.number;
                item_envio.fecha = factura.date.substring(0, 4);
                await _this.grabar_cufe(item_envio, cufe, 1, fecha_envio);
                await _this.send_mail(item_envio, cufe, 1);
              }
            }
          }
        });
      this.loader = false;
    },
    async grabar_cufe(item, cufe, tipo, fecha_envio) {
      var prefijo = item.prefijo;
      var consecutivo = item.consecutivo;
      var fecha = item.fecha;
      this.loader = "Actualizando Cufe...";

      await new Promise((resolve) => setTimeout(resolve, 3000));

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
        "|" +
        fecha_envio +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClPrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.item_envio = item;
          if (!cufe == "") {
            this.$emit("snack", {
              color: "success",
              text: "Factura enviada a la Dian ",
              estado: true,
            });
          }
          if (this.envio_masivo == false) {
            this.consultarServicios();
            this.card.loader = false;
            this.card.disabled = false;
          }
          if (!cufe == "") {
            this.$emit("snack", {
              color: "success",
              text: "Cufe Grabado",
              estado: true,
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
          this.dialogo_rango.loader = false;
          this.send_error("Ha ocurrido un error grabando el CUFE del Tiquete.");
        });
    },
    async send_mail(item_envio, tipo) {
      if (tipo == 1) {
        this.dialogocorreo.estado = false;
        item_envio = {
          prefijo: item_envio.pref.trim(),
          consecutivo: parseFloat(item_envio.numero),
          fecha: item_envio.fecha_Factura.substring(0, 4),
        };
      }
      const $this = this;
      const blob = await this.print_item(item_envio, true);
      const pdfBase64 = await this.blobToBase64(blob);
      let pdfb64 = pdfBase64.split(",")[1];
      let urlEnvio = null;
      var prefijo = item_envio.prefijo.trim();

      let numero = parseFloat(item_envio.consecutivo);
      let correo = this.form.correo
        ? this.form.correo.trim()
        : this.correodestino.trim();
      let correo2 = this.form.correo2
        ? this.form.correo2.trim()
        : "facturae@titansoluciones.net";
      let correo3 = this.form.correo3
        ? this.form.correo3.trim()
        : "facturae@titansoluciones.net";

      let token = this.empresa.tokentitan_empr;

      this.correo.unshift({
        prefix: prefijo,
        number: "" + numero + "",
        showacceptrejectbuttons: false,
        email_cc_list: [
          {
            email: correo,
          },
          {
            email: correo2,
          },
          {
            email: correo3,
          },
        ],
        base64graphicrepresentation: pdfb64,
      });

      urlEnvio = "https://server1ts.net/financiero/inc/api_dian/email_fact.php";

      var formData = new FormData();
      this.loader = "Enviando Correo...";
      formData.append("token", token);
      formData.append("correo", JSON.stringify(this.correo[0]));
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          this.loader = false;
          this.$emit("snack", {
            color: "orange",
            text: "Correo Envíado con éxito",
            estado: true,
          });
        })
        .catch((error) => {
          this.dialogo_rango.loader = false;
          $this.send_error(error);
        })
        .then((data) => {
          this.loader = false;
          $this.card.loader = false;
          $this.card.disabled = false;
        });
    },

    async pdf_masivo(datos) {
      var data = datos.filter((el) => el.cufe.trim());
      if (data.length > 0) {
        this.masivo_pdf.data = JSON.parse(JSON.stringify(data));

        if (this.empresa.provfact_empr == "1") {
          datos.forEach((dato) => {
            this.get_pdf_facse(dato);
          });
        } else {
          await this.descargar_pdf_titan(0);
        }
        // this.card.loader = false;
        // this.card.disabled = false;
        // this.dialogo_rango.loader = false;
      }
    },
    async descargar_pdf_titan(index) {
      var $this = this;
      var item = this.masivo_pdf.data[index];
      if (!item) {
        $this.card.loader = false;
        $this.card.disabled = false;
        this.dialogo_rango.estado = false;
        return false;
      }

      var numero = parseInt(item.numero);
      var prefijo = item.pref.trim();
      let fecha = item.fecha_Factura.substr(0, 4);
      $this.card.loader = "Descargando Factura...";
      $this.card.disabled = true;

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
        .then(async (data) => {
          this.loader = false;
          data = data[0];
          await this.generar_pdf_2(data);
          index += 1;
          this.descargar_pdf_titan(index);
        })
        .catch((err) => {
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
          $this.card.loader = false;
          $this.card.disabled = false;
        });
    },
    open_rango() {
      this.dialogo_rango.estado = true;
      this.dialogo_rango.tipo = 1;
      this.dialogo_rango.numInicial = parseFloat(
        this.prest_servicios[0].numero
      );
      let final = this.prest_servicios[this.prest_servicios.length - 1];
      this.dialogo_rango.numFinal = parseFloat(final.numero);
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
    fin_proceso_pdf() {
      var _this = this;
      this.masivo_pdf = {
        data: [],
      };

      _this.card.loader = false;
      _this.card.disabled = false;

      this.init_dialogo_rango();
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

      if (this.tipo_envio == 1) {
        _this.consultarServicios();
      }
      this.init_dialogo_rango();
    },

    open_mail(item) {
      this.item_envio = item;
      this.item_envio.Comprobante = {
        Prefijo: item.pref,
        Numero: item.numero,
        Fecha: item.fecha_Factura,
        Token_fact: this.empresa.tokentitan_empr,
      };

      this.dialogocorreo.estado = true;
      this.form.correo = item.correo_fact.trim();
      this.form.correo2 = item.correo2_fact.trim();
      this.form.correo3 = item.correo3_fact.trim();
    },

    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    },
    async print_item(item, getBase64) {
      let prefijo = null;
      let numero = null;
      let fecha = null;

      prefijo = item.prefijo;
      numero = item.consecutivo;
      fecha = item.fecha;

      var key = prefijo + "|" + numero + "|" + fecha + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      return await post
        .postData({
          url: "Clinico/dlls/PrFact01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.correodestino = data[0].email_cliente.trim();
          this.correodestino2 = data[0].email2_cliente.trim();
          this.correodestino3 = data[0].email3_cliente.trim();
          this.card.loader = false;
          this.card.disabled = false;
          return await this.generar_pdf_2(data[0], getBase64);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async generar_pdf_2(data, getBase64) {
      let descripcion64 = " ";
      if (this.esBase64Valido(data.Observaciones64)) {
        console.log("Cadena decodificada:");
        // descripcion64 = window.atob(data.Observaciones64);
      } else {
        descripcion64 = data.Observaciones64;
      }

      if (descripcion64) {
        data.observaciones = descripcion64;
      }

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;
      let formato_imp = factura_titan;
      if (getBase64) return await formato_imp(data, getBase64);
      else formato_imp(data);
    },
    async get_xml_dian(item) {
      this.loader = "Obteniendo el Xml...";
      let cufe = item.cufe.trim();
      let idempresa = this.empresa.id_empr.substr(5, 15);
      let fechaxml = item.fecha_Factura.substr(2, 2);
      let consecutivo = item.numero.substr(2, 15);
      let infoxml = null;
      let fileName = "fv" + idempresa + "000" + fechaxml + consecutivo;
      let idempr = this.empresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/xml_fact.php";
      var formData = new FormData();
      formData.append("token", idempr);
      formData.append("cufe", cufe);
      const response = await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      infoxml =
        response.ResponseDian.Envelope.Body.GetXmlByDocumentKeyResponse
          .GetXmlByDocumentKeyResult.XmlBytesBase64;
      this.downloadBase64File(infoxml, fileName);
    },
    downloadBase64File(base64Data, fileName) {
      this.loader = false;
      const binaryData = atob(base64Data);
      const arrayBuffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: "application/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    },
    async get_dian(item) {
      this.loader = "Consultando factura en la Dian...";
      let cufe = item.cufe.trim();
      let idempr = this.empresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/statusfact.php";
      var formData = new FormData();
      formData.append("token", idempr);
      formData.append("cufe", cufe);
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.loader = false;
        })
        .then(async (response) => {
          this.loader = false;
          this.$emit("snack", {
            color: "indigo",
            text: "Id Actualizado Correctamente",
            estado: true,
          });
        });
    },
    print_reporte_excel() {
      var data = this.prest_servicios;
      var data_parse = [];
      var dato_contrato = this.selectContrato;

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.valor = parseFloat(el.valor.replace(/\,/g, "")) || 0;
        copia.copago = parseFloat(el.copago.replace(/\,/g, "")) || 0;

        if (el.observacion && typeof el.observacion === "string") {
          try {
            copia.observacion = window.atob(el.observacion);
          } catch (e) {
            copia.observacion = el.observacion.trim();
          }
        }
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Cliente",
          value: "Cliente",
        },
        {
          title: "Prefijo",
          value: "pref",
        },
        {
          title: "Numero",
          value: "numero",
        },
        {
          title: "Fecha Factura",
          value: "fecha_Factura",
          format: "fecha",
        },
        {
          title: "Cufe",
          value: "cufe",
          format: "string",
        },
        {
          title: "Nro.Servicio",
          value: "nroprserv",
          format: "string",
        },
        {
          title: "Fecha Servicio",
          value: "Fecha_Servicio",
        },
        {
          title: "Id.Paciente",
          value: "identificacion",
        },
        {
          title: "Descripcion Paciente",
          value: "descrip_paciente",
        },
        {
          title: "Régimen",
          value: "regimen",
        },
        {
          title: "Autorizacion",
          value: "autorizacion",
          format: "string",
        },
        {
          title: "Valor",
          value: "valor",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Copago/Cuota M.",
          value: "copago",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Id.Rips",
          value: "rips",
        },
        {
          title: "Detalle",
          value: "observacion",
        },
        {
          title: "Fecha Radicado",
          value: "fecha_radicado",
        },
        {
          title: "Nro Radicado",
          value: "nro_radicado",
        },
        {
          title: "Vlr Radicado",
          value: "vlor_radicado",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cuv",
          value: "cuv",
          format: "string",
        },

        {
          title: "Estado Servicio",
          value: "estado",
        },
      ];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var contrato = dato_contrato;
      var header_format = [
        { text: "REPORTE FACTURACION", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Contrato: ${contrato}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte facturación",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-FACTURACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text:
                parseFloat(k.nro) +
                " - " +
                k.descripcion.trim() +
                "-" +
                k.detalle.trim(),
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    consultarServicios() {
      if (!this.form.punto_fact) {
        this.errores.punto_fact = true;
        this.send_error("Seleccione sede de Facturación!");
      } else if (!this.form.ruts) {
        this.errores.ruts = true;
        this.send_error("Seleccione un rut!");
      } else if (!this.selectContrato) {
        this.errores.selectContrato = true;
        this.send_error("Seleccione un contrato!");
      } else {
        this.prest_servicios = [];
        let consulta = this.contratos.filter((e) => {
            if (e.nro == this.selectContrato) {
              return e;
            }
          }),
          estado_fecha = this._validarFechas();
        consulta = consulta[0];

        this.headerCsv = [
          "Reporte: , Facturacion por paciente," +
            "Contrato: ," +
            this.selectContrato +
            " - " +
            this.descripContrato +
            " , Fecha inicial: ," +
            this.fecha_ini +
            ", Fecha final: , " +
            this.fecha_final.replace(/-/g, "/"),
          "",
        ];
        let soloanulados = this.soloanulados ? 1 : 0;
        let pteradicar = this.pteradicar ? 1 : 0;
        let ptedian = this.ptedian ? 1 : 0;
        let rut = this.form.selruts ? this.form.selruts.identificacion_rut : 0;
        let agencia = this.form.punto_fact.codigo_agc;

        if (consulta) {
          if (estado_fecha) {
            this.loader = "Generando Reporte...";
            post
              .postData({
                url: "Clinico/dlls/ClRpFact0101J.dll",
                data:
                  sessionStorage.Sesion +
                  "|" +
                  consulta.nro +
                  "|" +
                  consulta.identificacion +
                  "|" +
                  this.fecha_ini.split("-").join("") +
                  "|" +
                  this.fecha_final.split("-").join("") +
                  "|" +
                  soloanulados +
                  "|" +
                  pteradicar +
                  "|" +
                  ptedian +
                  "|" +
                  rut +
                  "|" +
                  agencia +
                  "|",
                method: "",
              })
              .then((data) => {
                this.loader = false;
                data.pop();
                this.prest_servicios = data;
              })
              .catch((err) => {
                this.load_contrato = false;
                this.loader = false;
                this.$emit("snack", {
                  color: "error",
                  text: err.Mensaje[0].msg,
                  estado: true,
                });
              });
          }
        }
      }
    },
    get_empresa() {
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
            text: "Error al cargar información de la empresa",
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
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    imprimir_factura(key, pref, fecha_Factura) {
      this.loader = "Imprimiendo Factura...";
      var $this = this;
      var numero = key;
      var prefijo = pref.trim();
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
            fecha_Factura.substring(0, 4) +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          data = data[0];
          this.generar_pdf_2(data);
        })
        .catch((err) => {
          this.loader = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al generar impresión de la factura",
            estado: true,
          });
        });
    },
    async get_rips(item, tipo) {
      let ruta_url = "Clinico/dlls/Rips2275.dll";
      let prefijo = item.pref;
      let consecutivo = parseFloat(item.numero);
      let periodo = item.fecha_Factura.substr(0, 6);
      let contrato = item.contrato;
      let time = new Date();
      let hora = time.getMinutes() + time.getSeconds();
      let datos =
        `${sessionStorage.Sesion}|` +
        `0` +
        `|` +
        periodo +
        `|` +
        prefijo +
        `|` +
        consecutivo +
        `|` +
        contrato +
        `|`;
      try {
        let data = await post.postData({
          url: ruta_url,
          data: datos,
          method: "",
        });

        if (data[0].archivos[0].tipo) {
          this.$emit("snack", {
            color: "error",
            text:
              data[0].archivos[0].tipo + " " + data[0].archivos[0].descripcion,
            estado: true,
          });
          return;
        }

        var json = [
          sessionStorage.Sesion.substr(0, 15),
          `Rips +` + consecutivo + `_` + periodo + `.zip`,
          this.empresa.codciudad_empr || 95001,
        ];
        let data_envio = data;
        this.item_envio = item;


        if (tipo === 0 && item.cuv.trim() !== "") {
          if (parseFloat(item.nrocuv) < 1) {
            await this.get_cuv(item);
          } else {
            if (this.envio_masivo == 0) {
              await this.get_radicado(item);
            }
          }
        }

        return await this.extraer_facturas(data_envio, json, tipo);
      } catch (err) {
        console.log(err);
        this.$emit("snack", {
          color: "error",
          text: "Error al generar Rips",
          estado: true,
        });
      }
    },
    async extraer_facturas(data, json, tipo) {
      let ruta = data.flatMap((item) =>
        item.archivos.map((file) => file.archivo)
      );
      let prefijo = null;
      let consecutivo = 0;
      let factura = null;
      for (const item of ruta) {
        factura = item.substr(34, 15).replace(/\.[^.]+$/, "");
        prefijo = this.item_envio.pref.trim();
        consecutivo = this.item_envio.numero;
        // Retorna el JSON aquí
        return await this.get_cufe(prefijo, consecutivo, data, json, tipo);
      }
    },
    async get_cufe(prefijo, consecutivo, data_envio, json, tipo) {
      try {
        const data = await post.postData({
          url: "Clinico/dlls/PrFactcufe.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|" +
            consecutivo +
            "|" +
            2025 +
            "|",
          method: "POST",
        });
        this.loader = false;
        let cufe = data[0];

        // Siempre ejecuta get_text
        let resultado = await this.get_text(data_envio, tipo);

        // Solo descarga el XML si tipo !== 1
        if (tipo !== 1) {
          this.get_attach_dian(consecutivo, prefijo);
        }

        // Si tipo es 1, retorna el JSON
        if (tipo === 1) {
          return resultado;
        }
        // Si tipo es 0, no retorna nada (solo descarga)
      } catch (err) {
        console.log(err);
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "Error al consultar cufe",
          estado: true,
        });
      }
    },
    async get_text(data, tipo) {
      var formData = new FormData();
      let archivos = data[0].archivos;
      let nro_factura = null;

      archivos.forEach((archivo, index) => {
        formData.append(`archivo${index}`, archivo.archivo);
        nro_factura = archivo.archivo.substr(34, 46);
      });

      try {
        const response = await fetch(
          "https://server1ts.net/financiero/inc/clear_json.php",
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();

        if (result && result[0] && result[0].contenido) {
          let contenidoLimpio = Array.from(result[0].contenido)
            .filter((char) => {
              return char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127;
            })
            .join("");
          let contenidoJSON = JSON.parse(contenidoLimpio);

          if (tipo === 1) {
            // Si tipo es 1, retorna el JSON
            return contenidoJSON;
          } else {
            // Si no, descarga el archivo como antes
            let resultados = [
              {
                contenido: contenidoJSON,
              },
            ];
            let jsonResult = JSON.stringify(resultados[0].contenido);
            const blob = new Blob([jsonResult], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = nro_factura;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Agrega un return explícito para claridad (opcional)
            return true;
          }
        }
      } catch (error) {
        console.error("Error al leer los archivos:", error);
      }
    },
    async get_attach_dian(consecutivo, prefijo, tipo = 0) {
      let idempresa = this.empresa.id_empr.substr(5, 15);
      consecutivo = prefijo.trim() + parseFloat(consecutivo);
      let fileName = "Attachment-" + consecutivo + ".xml";
      let idempr = this.empresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/attach_fact.php";

      var formData = new FormData();
      formData.append("token", idempr);
      formData.append(
        "factura",
        parseFloat(idempresa) + "/" + fileName + "/BASE64"
      );

      try {
        const response = await fetch(urlEnvio, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        if (response.filebase64) {
          if (tipo === 1) {
            // Retorna el base64 sin decodificar
            return response.filebase64;
          } else {
            // Descarga como archivo (comportamiento actual)
            this.downloadBase64Attach(response.filebase64, fileName);
          }
        } else {
          console.error("Error: No se recibió un archivo en base64.");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    },
    async get_attach(item) {
      let consecutivo = item.pref.trim() + parseFloat(item.numero);
      let id_token = this.empresa.tokentitan_empr.trim();
      let cufe = item.cufe.trim();
      let fileName = "Attachment-" + consecutivo + ".xml";
      this.loader = "Descargando Attachment...";

      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/getxml_fact.php";

      var formData = new FormData();
      formData.append("token", id_token);
      formData.append("factura", cufe);

      try {
        const response = await fetch(urlEnvio, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        if (response.attacheddocument) {
          this.downloadBase64Attach(response.attacheddocument, fileName);
          this.loader = false;
        } else {
          console.error("Error: No se recibió un archivo en base64.");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    },
    esBase64Valido(cadena) {
      try {
        if (!cadena || typeof cadena !== "string") return false;

        // Expresión regular para validar caracteres de Base64
        const regexBase64 = /^[A-Za-z0-9+/]+={0,2}$/;
        if (!regexBase64.test(cadena)) return false;

        // Intentar decodificar con atob()
        atob(cadena);
        return true;
      } catch (e) {
        return false;
      }
    },
    downloadBase64Attach(base64, fileName) {
      const link = document.createElement("a");
      link.href = "data:application/xml;base64," + base64;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async get_excel(item) {
      var numero = item.numero;
      var prefijo = item.pref.trim();
      var fecha = item.fecha_Factura.substring(0, 4);
      post
        .postData({
          url: "Clinico/dlls/PrFactTitanJ.dll",
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
          this.excel_factura(data[0]);
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar factura",
            estado: true,
          });
        });
    },
    excel_factura(data) {
      var data_parse = [];

      data.health_fields.users_info.forEach((el) => {
        let copia = {
          cliente: data.customer.name.trim(),
          pref: data.prefix,
          numero: data.number,
          idpaciente: el.identification_number,
          nombre1: el.first_name,
          nombre2: el.middle_name,
          apellido1: el.surname,
          apellido2: el.second_surname,
          tipoid: el.health_type_document_identification_id,
          tipouser: el.health_type_user_id,
          poliza: el.policy_number,
        };
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Cliente",
          value: "cliente",
        },
        {
          title: "Prefijo",
          value: "pref",
        },
        {
          title: "Numero",
          value: "numero",
          format: "number",
        },
        {
          title: "Id_usuario",
          value: "idpaciente",
        },
        {
          title: "Primer Nombre",
          value: "nombre1",
        },
        {
          title: "Segundo Nombre",
          value: "nombre2",
        },
        {
          title: "Primer Apellido",
          value: "apellido1",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2",
        },
        {
          title: "Tipo Id",
          value: "tipoid",
        },
        {
          title: "Tipo User",
          value: "tipouser",
        },
        {
          title: "Poliza",
          value: "poliza",
        },
      ];
      var header_format = [{ text: "DETALLADO FACTURA", bold: true, size: 16 }];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Factura",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `  FACTURA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async get_docker(item) {
      const contenidoJSON = await this.get_rips(item, 1);
      const consecutivo = parseFloat(item.numero);
      const prefijo = item.pref.trim();
      this.item_envio = item;
      let mensaje = "";
      let cedulasispro = this.empresa.cedulasispro_empr
        ? String(parseFloat(this.empresa.cedulasispro_empr)).trim()
        : "";
      let passsispro = this.empresa.clavesispro_empr.trim();
      // Llama get_attach_dian con tipo=1 para obtener el base64 sin decodificar
      const attachBase64 = await this.get_attach_dian(consecutivo, prefijo, 1);

      this.error = null;
      this.resultado = null;
      //this.loading = true;

      const authPayload = {
        persona: {
          identificacion: {
            tipo: "CC",
            numero: cedulasispro,
          },
        },
        clave: passsispro,
        nit: String(parseFloat(this.empresa.id_empr)).trim(),
        tipoMecanismoValidacion: 0,
        reps: true,
      };

      // Aquí defines el rips y xmlFevFile como desees
      const ripsPayload = {
        rips: contenidoJSON,
        xmlFevFile: attachBase64,
      };

      try {
        // Paso 1: Obtener token
        this.loader = "Obteniendo datos RIPS...";

        const tkResponse = await axios.post(
          "https://server1ts.net/financiero/inc/api_titan/sispro_radicatk.php",
          authPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const dataTk = tkResponse.data;
        this.loader = false;
        ///inicio codigo anterior
        if (dataTk.success && dataTk.token) {
          // Paso 2: Llamar a docker_radica.php con token + datos rips
          this.loader = "Radicando en Sispro...";

          const radicaResponse = await axios.post(
            "https://server1ts.net/financiero/inc/api_titan/sispro_radica.php",
            {
              token: dataTk.token,
              ...ripsPayload,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          this.loader = false;

          this.resultado = radicaResponse.data;
          mensaje = this.resultado.respuesta.CodigoUnicoValidacion;
          let cuv = "";
          let fecha_radica = "";
          let id_cuv = "";

          if (this.resultado.success == true) {
            const resultado =
              this.resultado.respuesta.ResultadosValidacion.find(
                (item) =>
                  item.Descripcion ===
                  "El Código CUV ya fue aprobado previamente en otro proceso."
              );

            if (resultado) {
              cuv = resultado.Observaciones;
            } else {
              cuv = this.resultado.respuesta.CodigoUnicoValidacion;
            }
            fecha_radica = this.resultado.respuesta.FechaRadicacion;
            this.id_cuv = 0;
            //cuv = "b6659b24594720f1edff35bbfa666cdb92b1bd7ba17c433fd32b12cf1117f890d0ca148f6a774f81a647f5d93fb05989";
            if (cuv.includes("RECHAZADO")) {
              console.log("RECHAZADO");
            } else {
              this.loader = "Actualizando Cuv...";

              await this.get_cuv(item, dataTk.token, cuv);
              await this.grabar_cuv(
                this.item_envio,
                cuv,
                fecha_radica,
                this.id_cuv
              );
              await this.get_rips(item, 0);
            }
          } else {
            mensaje = this.resultado.respuesta.Mensaje;
            console.error("Error xxx al radicar en Sispro:", mensaje);
          }

          let resumen = "";
          if (this.resultado?.respuesta?.ResultadosValidacion?.length > 0) {
            resumen = this.resultado.respuesta.ResultadosValidacion.map(
              (val) => {
                const clase = val.Clase;
                const codigo = val.Codigo;
                const descripcion = val.Descripcion;
                const observaciones = val.Observaciones?.trim()
                  ? ` - ${val.Observaciones.trim()}`
                  : "";
                return `[${clase} - ${codigo}] ${descripcion}${observaciones}`;
              }
            ).join("\n");
          } else {
            resumen = mensaje; // Si no hay ResultadosValidacion, usamos el mensaje principal
          }

          mensaje = resumen;

          const index = this.prest_servicios.findIndex(
            (p) => p.numero === this.item_envio.numero
          );
          if (index !== -1) {
            this.$set(this.prest_servicios[index], "rechazo", resumen);
          }

          this.$emit("snack", {
            color: "orange",
            text: mensaje,
            estado: true,
          });
        } else {
          this.error = "Token no recibido o respuesta inválida.";
          console.error(this.error);
        }

        ///fin codigo anterior
      } catch (err) {
        this.loader = false;

        this.error = err.response?.data || err.message;
        mensaje = err.response.data.message;
        this.$emit("snack", {
          color: "red",
          text: mensaje,
          estado: true,
          timeout: 1000,
        });
      } finally {
        this.loading = false;
      }
    },
    async grabar_cuv(item, cuv, fecha_cuv, id_cuv) {
      var prefijo = item.pref.trim();
      var consecutivo = parseFloat(item.numero);
      var fecha = item.fecha_Factura.substring(0, 4);

      //await new Promise((resolve) => setTimeout(resolve, 3000));

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|" +
        fecha +
        "|" +
        cuv +
        "|" +
        fecha_cuv +
        "|" +
        id_cuv +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrCuv.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.item_envio = item;
          if (!cuv == "") {
            this.$emit("snack", {
              color: "success",
              text: "Factura Radicada Correctamente ",
              estado: true,
            });
          }
          this.consultarServicios();
        })
        .catch((err) => {
          console.log("error", err);
          this.dialogo_rango.loader = false;
          this.send_error("Ha ocurrido un error grabando el CUV.");
        });
    },
    async get_radicado(item) {
      let factura = item.pref.trim() + parseFloat(item.numero);
    },
    async get_radicado_cop(item) {
      let factura = item.pref.trim() + parseFloat(item.numero);
      let id_cuv = parseFloat(item.nrocuv);
      const data = {
        ResultState: true,
        ProcesoId: id_cuv,
        NumFactura: factura,
        CodigoUnicoValidacion: item.cuv.trim(),
        FechaRadicacion: item.fechacuv.trim(),
        RutaArchivos:
          "C:\\Users\\Facturacion\\Radicados\\" + factura + " ORIGINALXML",
        ResultadosValidacion: [],
      };

      const contenido = JSON.stringify(data, null, 2);
      const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      let fileName =
        `GET_RADICADOResultadoMSPS_` + factura + `_ID` + id_cuv + `_A_CUV.txt`;

      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = fileName;
      enlace.click();

      URL.revokeObjectURL(url);
    },    
    async get_cuv(item, id_token, id_cuv) {
      try {
        this.loader = "Obteniendo el Cuv...";

        if (id_token === undefined || id_token === null) {
          // Construye el payload de autenticación
          let cedulasispro = this.empresa.cedulasispro_empr
            ? String(this.empresa.cedulasispro_empr).trim()
            : "";
          let passsispro = this.empresa.clavesispro_empr;

          const authPayload = {
            persona: {
              identificacion: {
                tipo: "CC",
                numero: String(parseFloat(cedulasispro)).trim(),
              },
            },
            clave: passsispro,
            nit: String(parseFloat(this.empresa.id_empr)).trim(),
            tipoMecanismoValidacion: 0,
            reps: true,
          };

          // Paso 1: Obtener token
          const tkResponse = await axios.post(
            "https://server1ts.net/financiero/inc/api_titan/sispro_radicatk.php",
            authPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const dataTk = tkResponse.data;
          id_token = dataTk.token;
        }

        this.loader = false;

        if (id_token) {
          // Paso 2: Consultar CUV
          if (id_cuv) {
            item.cuv = id_cuv;
          }
          const cuvPayload = {
            token: id_token,
            codigoUnicoValidacion: item.cuv.trim(),
          };

          const radicaResponse = await axios.post(
            "https://server1ts.net/financiero/inc/api_titan/sispro_consultacuv.php",
            cuvPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          this.loader = false;

          this.resultado = radicaResponse.data;

          let mensaje = "";
          if (this.resultado.success) {
            this.id_cuv = this.resultado.respuesta.ProcesoId;
            let id_cuv = this.resultado.respuesta.ProcesoId;
            let factura = this.resultado.respuesta.NumeroDocumento;
            let cuv = this.resultado.respuesta.CodigoUnicoValidacion;
            let fecha_cuv = this.resultado.respuesta.FechaValidacion;

            const data = {
              ResultState: true,
              ProcesoId: id_cuv,
              NumFactura: factura,
              CodigoUnicoValidacion: cuv,
              FechaRadicacion: fecha_cuv,
              RutaArchivos:
                "C:\\Users\\Facturacion\\Radicados\\" +
                factura +
                " ORIGINALXML",
              ResultadosValidacion: [],
            };

            const contenido = JSON.stringify(data, null, 2);
            const blob = new Blob([contenido], {
              type: "text/plain;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            let fileName =
              `ResultadosMSPS_` + factura + `_ID` + id_cuv + `_A_CUV.txt`;
            // let fileName = `ResultadoMSPS_` + factura + `_ID` + id_cuv + `.txt`;

            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = fileName;
            enlace.click();

            URL.revokeObjectURL(url);

            mensaje = "Consulta CUV exitosa";
          } else {
            mensaje =
              this.resultado.respuesta?.Mensaje || "Consulta CUV fallida";
          }
          this.$emit("snack", {
            color: this.resultado.success ? "success" : "error",
            text: mensaje,
            estado: true,
          });
        } else {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Token no recibido o respuesta inválida.",
            estado: true,
          });
        }
      } catch (err) {
        this.loader = false;
        let mensaje =
          err.response?.data?.message || err.message || "Error general";
        this.$emit("snack", {
          color: "red",
          text: mensaje,
          estado: true,
        });
        console.error("Error en get_cuv:", mensaje);
      }
    },

    async radicar_masivo(datos) {
      this.dialogo_rango.loader = true;

      for (const item of datos) {
        // const cuv = (item.cuv || "").trim();

        try {
          await this.get_docker(item);
        } catch (error) {
          console.error("Error al procesar item:", item.numero, error);
        }
      }

      this.dialogo_rango.loader = false;
      this.dialogo_rango.estado = false;

      this.$emit("snack", {
        color: "green",
        text: "Radicación masiva completada.",
        estado: true,
      });
    },
    async get_sispro(item) {
      let cuv = item.cuv.trim();
      const url = `https://validadorderipscolombia.com/consulta-codigo-unico-de-validacion-cuv?cuv=${cuv}`;

      window.open(url, "_blank").focus();
    },
  },
};
// :disabled="!item.cuv || item.cuv.trim().length < 10"
</script>
<style lang="sass">
.mi-overlay
  z-index: 9999

.v-data-table__wrapper td
  line-height: 2 !important
</style>

