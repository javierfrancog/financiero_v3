<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">flip_to_front</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reimpresión Documento Soporte</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  return-object
                  hide-details
                  outlined
                  @change="
                    get_resolucion();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
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

              <v-col cols="3">
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
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Prefijo"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
                  hide-details
                  outlined
                  return-object
                  @change="
                    cargarcontenido();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-btn
                  color="indigo"
                  class="white--text px-12 ma-1"
                  depressed
                  small
                  @click="cargarcontenido"
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
                <v-btn
                  color="orange"
                  class="white--text ml-6 px-12 ma-1"
                  small
                  depressed
                  @click="envio_masivo"
                >
                  Envio masivo
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
                <v-btn
                  color="purple"
                  class="white--text ml-6 px-12 ma-1"
                  small
                  depressed
                  @click="act_cuds"
                >
                  Actualizar Cuds
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="form.pendientes"
                  @change="cargarcontenido"
                  label="Solo Pendientes de Envio"
                ></v-switch>
              </v-col>
              <v-col class="d-flex">
                <v-btn
                  color="success"
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
              item-key="numero_fact"
              :search="search"
              show-select
              v-model="list_select"
              disable-pagination
              :expanded.sync="expanded"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <b>Anular</b>
                        </td>
                        <td>
                          <v-btn
                            large
                            @click="get_anula_dian(item)"
                            color="orange accent-3"
                            fab
                            icon
                            depressed
                            v-on="on"
                            >{{ item.docinter_rep }}
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <b>Eliminar</b>
                        </td>
                        <td>
                          <v-btn
                            large
                            @click="eliminar_item(item)"
                            color="red accent-3"
                            fab
                            icon
                            depressed
                            :disabled="item.iddian_fact ? true : false"
                            v-on="on"
                            >{{ item.docinter_rep }}
                            <v-icon>mdi-alert</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <v-btn
                            @click="change_date(item)"
                            color="pink"
                            fab
                            small
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-calendar-check-outline</v-icon>
                          </v-btn>
                          <span>Modificar Fecha</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.fpago_fact="{ item }">{{
                item.fpago_fact == "1" ? "Contado" : "Credito"
              }}</template>
              <template v-slot:item.estado_fact="{ item }">{{
                item.estado_fact == "1" ? "Anulada" : "Activa"
              }}</template>

              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <!-- <v-btn icon class="mr-2" color="blue darken-2">
                  <v-icon @click="print_item(item)">print</v-icon>
                </v-btn>-->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="print_item(item)"
                      :disabled="item.iddian_fact ? true : false"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir factura</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item)"
                      :disabled="item.iddian_fact ? false : false"
                      color="green"
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
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="print_item(item)"
                      :disabled="item.iddian_fact ? false : true"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir PDF</span>
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
                      :disabled="item.iddian_fact ? false : true"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="consultadian_item(item, 1)"
                      color="orange"
                      fab
                      x-large
                      icon
                      v-on="on"
                      :disabled="item.idajustedian_fact ? false : true"
                    >
                      <v-icon>mdi-alert-remove-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Nota Ajuste</span>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                label="Agencia"
                v-model="form.punto_cuds"
                :items="agencias"
                :item-text="format_punto_fact"
                item-value="codigo_agc"
                return-object
                hide-details
                outlined
                @change="errores.punto_fact = false"
                :error="errores.punto_fact"
              ></v-autocomplete>
            </v-col>
            <v-col cols="5">
              <v-file-input
                label="Buscar archivo"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept=".csv"
                v-model="adjunto"
                id="archivo_adjunto"
              ></v-file-input>
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
            color="indigo white--text"
            depressed
            large
            @click="procesar_cuds()"
            >Procesar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogofecha.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title>
          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <span class="title col-12">Cambio Fecha a Documento Soporte</span>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '1px', 'border-color': 'orange' }"
            />
          </v-row>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <h4 style="color: red" class="font-weight-bold text-h7 subtitles">
              Atención!!!.
            </h4>
            <h4 style="color: red" class="font-weight-bold text-h7 subtitles">
              El cambio de Fecha requiere Reprocesar
            </h4>
            <h4 style="color: red" class="font-weight-bold text-h7 subtitles">
              Documentos Soporte en Contabilidad
            </h4>
          </v-row>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="5">
              <v-menu
                ref="menu"
                v-model="dialogPicker"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_doc"
                    label="Fecha Nota"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_doc"
                  @change="dialogPicker = false"
                ></v-date-picker>
              </v-menu>
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
                @click="guardar_fecha"
                >Guardar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogofecha.estado = false"
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
import { doc_soporte } from "../../_formatos.pdf.js";

// import JsonExcel from "vue-json-excel";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      anulados: null,
      prest_facturas: [],
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogofecha: {
        estado: false,
      },
      dialog: true,
      valid: false,
      adjunto: null,
      iddian_fact: null,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      item_envio: [],
      prefijos: [],
      contenido: [],
      list_select: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Agencia", align: "center", value: "agencia_fact" },
        { text: "Prefijo", align: "center", value: "pref_fact" },
        { text: "Numero", align: "center", value: "numero_fact" },
        { text: "Fecha", align: "center", value: "fecha_fact" },
        { text: "Cliente", align: "left", value: "cliente_fact" },
        { text: "Valor", align: "right", value: "valor_fact" },
        { text: "F_Pago", align: "center", value: "fpago_fact" },

        { text: "Estado", align: "center", value: "estado_fact" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
        mensaje: false,
      },
      card_estado: false,
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
      titulo_print: null,
      condicion_pdf: true,
    };
  },
  created() {
    this.cargarTablaAg();
    this.get_empresa();

    let nit = parseInt(sessionStorage.Sesion.substring(0, 15));
    if (nit == 999999901) this.condicion_pdf = false;
  },
  computed: {},
  methods: {
    change_date(item) {
      this.item_envio = item;
      this.dialogofecha.estado = true;
      this.form.fecha_doc = item.fechacorta_fact;
    },
    guardar_fecha() {
      this.card.loader = true;
      this.card.disabled = true;
      let fecha = this.form.fecha_doc.replace(/\-/g, "");

      var key =
        this.item_envio.agencia_fact +
        "|" +
        this.item_envio.pref_fact +
        "|" +
        this.item_envio.numero_fact +
        "|" +
        fecha +
        "|";

      var datosEnvio = sessionStorage.Sesion + "|" + key;
      let urlconsulta = post
        .postData({
          url: "Financiero/dlls/PrDspFecha.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.cargarcontenido();
          this.card.loader = false;
          this.$emit("snack", {
            color: "success",
            text: "Fecha Actualizada",
            estado: true,
          });
          this.dialogofecha.estado = false;
          this.card.loader = false;
          this.card.disabled = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Ha ocurrido un error actualizando fecha.");
        });
    },

    print_reporte_excel() {
      var data = this.contenido;

      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.valor_fact = parseFloat(el.valor_fact.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Agencia",
          value: "agencia_fact",
        },
        {
          title: "Prefijo",
          value: "pref_fact",
          format: "string",
        },
        {
          title: "Consecutivo",
          value: "numero_fact",
        },
        {
          title: "Fecha",
          value: "fecha_fact",
          format: "fecha",
        },
        {
          title: "Proveedor",
          value: "cliente_fact",
        },
        {
          title: "Valor",
          value: "valor_fact",
        },
        {
          title: "Estado",
          value: "estado_fact",
        },

        // {
        //   title: "Valor",
        //   value: "valor_fact",
        //   format: "money",
        //   totalsRowFunction: "sum",
        // },
      ];

      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var header_format = [
        { text: "REPORTE DOCUMENTO SOPORTE", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Documento Soporte",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-DOCUMENTO SOPORTE-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async envio_masivo() {
      if (this.list_select.length === 0) {
        this.send_error("Debe Seleccionar por lo menos un empleado");
      } else {
        let lista = this.list_select;
        for (const item of lista) {
          let res = await this.get_json_dian(item);
        }
        this.card.loader = false;
        this.card.disabled = false;
      }
    },
    async get_json_dian(item) {
      this.card.loader = true;
      this.card.disabled = true;
      this.iddian_fact = item.iddian_fact;
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = "Financiero/dlls/PrDocTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });

        const json = JSON.stringify(data[0]);
        var formData = new FormData();
        formData.append("factura", json);
        const response = await fetch(
          "https://server1ts.net/financiero/inc/dspelect.titan.php",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((result) => {
            let cufe = null;
            let envio_ok = false;
            console.log("respuesta:", result);

            if (result.ResponseDian) {
              envio_ok =
                result.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.IsValid === "true";
            }

            if (result.success === false) {
              envio_ok = true;
              cufe = result.cufe;
            } else if (result.ResponseDian.Envelope.Body) {
              cufe =
                result.ResponseDian.Envelope.Body.SendBillSyncResponse
                  .SendBillSyncResult.XmlDocumentKey;
            }

            let error_correo = "";
            let texto = " ";
            if (result.errors) {
              texto = JSON.stringify(result.errors);
            }

            let error_dv = "";
            error_dv = texto.includes("dv");

            if (error_dv) {
              console.log("mensaje", error_dv);
              this.$emit("snack", {
                color: "error",
                text: "Error en D.V.",
                estado: true,
              });
            } else {
              error_correo = texto.includes("mail");

              if (error_correo) {
                this.$emit("snack", {
                  color: "error",
                  text: "Error en correo",
                  estado: true,
                });
              } else {
                console.log("envio_ok", envio_ok, cufe);

                if (cufe) {
                  if (envio_ok === false) {
                    cufe = "";
                    let mensaje =
                      result.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.ErrorMessage;
                    this.send_error(mensaje);
                  }
                  this.grabarCufe(item, cufe, 0);
                } else {
                  this.card.loader = false;
                  this.card.disabled = false;
                  this.send_error("Error enviando el documento soporte");
                }
              }
            }
          });
        this.card.loader = false;
        this.card.disabled = false;
      } catch (error) {
        this.card.loader = false;
        this.card.disabled = false;
        console.error(error);
        this.send_error(error.Mensaje[0].Error);
      }
    },
    async get_anula_dian(item) {
      this.card.loader = true;
      this.card.disabled = true;
      this.iddian_fact = item.iddian_fact;
      var fecha = item.fecha_fact.substr(0, 4);
      var key =
        item.agencia_fact + "|" + item.pref_fact + "|" + item.numero_fact + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key + fecha + "|";
      let urlconsulta = "Financiero/dlls/PrAnulaDSP.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });

        const json = JSON.stringify(data[0]);
        var formData = new FormData();
        formData.append("factura", json);
        const response = await fetch(
          "https://server1ts.net/financiero/inc/api_dian/anuladspelect.titan.php",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((result) => {
            // console.log(
            //   result.ResponseDian.Envelope.Body.SendBillSyncResponse
            //     .SendBillSyncResult.StatusCode
            // );
            let error_correo = "";
            let texto = " ";
            if (result.errors) {
              texto = JSON.stringify(result.errors);
            }

            // console.log("result", result.errors["seller.dv"][0]);
            let error_dv = "";
            error_dv = texto.includes("dv");

            if (error_dv) {
              console.log("mensaje", error_dv);
              this.$emit("snack", {
                color: "error",
                text: "Error en D.V.",
                estado: true,
              });
            } else {
              error_correo = texto.includes("mail");

              if (error_correo) {
                this.$emit("snack", {
                  color: "error",
                  text: "Error en correo",
                  estado: true,
                });
              } else {
                let aprobado =
                  result.ResponseDian.Envelope.Body.SendBillSyncResponse
                    .SendBillSyncResult.StatusCode;
                let cuds = "";

                if (aprobado === "00") {
                  cuds =
                    result.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.XmlDocumentKey;
                  this.grabarCufe(item, cuds, 1);
                } else if (aprobado === "99") {
                  // console.log(result.ResponseDian.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.StatusCode)

                  cuds =
                    result.ResponseDian.Envelope.Body.SendBillSyncResponse
                      .SendBillSyncResult.XmlDocumentKey;
                  this.grabarCufe(item, cuds, 1);
                }
              }

              this.cargarcontenido();
            }

            // if (val_error === "DS") {
            //   if (val2_error === "DSFC02b") {
            //     this.grabarCufe(item, cuds);
            //     this.cargarcontenido();
            //   } else {
            //     this.$emit("snack", {
            //       color: "error",
            //       text: msg_error,
            //       estado: true,
            //     });
            //   }
            // } else
            //  if (msg_error) {
            //   console.log("mensaje", msg_error);
            //   this.$emit("snack", {
            //     color: "error",
            //     text: msg_error,
            //     estado: true,
            //   });
            //  }
            //  else {
            //   this.grabarCufe(item, cuds);
            // }
          });
        this.card.loader = false;
        this.card.disabled = false;
      } catch (error) {
        this.card.loader = false;
        this.card.disabled = false;
        console.error(error);
        this.send_error(error.Mensaje[0].Error);
      }
    },
    async grabarCufe(item, cuds, tipo) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);

      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|" +
        cuds +
        "|" +
        tipo +
        "|";

      var datosEnvio = sessionStorage.Sesion + "|" + key;
      let urlconsulta = post
        .postData({
          url: "Financiero/dlls/PrCuds.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async print_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);

      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";

      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrDocsoporte01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          let data_impresion = data[0];
          let empresa = this.datosEmpresa;
          await this.format_impresion(data_impresion, empresa);
        })
        .catch((err) => {
          console.log(err);
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    async format_impresion(data_impresion, empresa) {
      data_impresion = {
        ...data_impresion,
        desripEmpresa: empresa.descrip_empr,
        tipoId: empresa.tipo_id,
        idEmpresa: parseInt(empresa.id_empr),
        direccionEmpresa: empresa.direccion_empr,
        telEmpresa: empresa.telefono_empr,
        ciudadEmpresa:
          empresa.Ciudad.trim() + "-" + empresa.Departamento.trim(),
        correoEmpresa: empresa.email_empr.trim(),
      };

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then(async (logo) => {
        data_impresion.logo = logo;
        await doc_soporte(data_impresion).then(async (el) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.log("Impresión terminada");
        });
      });
    },
    get_resolucion() {
      var $this = this;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data:
            sessionStorage.Sesion + "|" + prefijo + "|" + "1" + "|" + "2" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar Resolución: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd.trim()}`;
    },
    anular_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);

      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";

      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrAnulaDSP.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: "Documento Anulado correctamente",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    eliminar_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var fecha = item.fecha_fact.substr(0, 4);

      var key =
        item.agencia_fact +
        "|" +
        item.pref_fact +
        "|" +
        item.numero_fact +
        "|" +
        fecha +
        "|";

      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrEliminaDSP.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "success",
            text: "Documento Anulado correctamente",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al imprimir el documento");
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      var estado_fecha = this._validarFechas();
      var agencia = this.form.punto_fact;
      let pendientes = this.form.pendientes ? "1" : "0";
      let prefijo = this.form.pref_fact.prefijo_resd;

      this.contenido = [];

      if (!agencia) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona una Agencia",
          estado: true,
        });
      } else if (!prefijo) {
        this.$emit("snack", {
          color: "error",
          text: "Selecciona un Prefijo",
          estado: true,
        });
      }
      {
        var fechaini = this.fecha_ini.split("-").join("");
        var fechafin = this.fecha_final.split("-").join("");
        this.loader = true;

        post
          .postData({
            url: "Financiero/dlls/PrDocsoporte02J.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              0 +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|" +
              pendientes +
              "|" +
              prefijo +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Ubicaciones",
              estado: true,
            });
          });
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
    consultadian_item(item, tipo) {
      let cufe = item.iddian_fact;

      if (tipo === 1) {
        cufe = item.idajustedian_fact;
      }

      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
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

    act_cuds() {
      this.dialogo.estado = true;
    },
    procesar_cuds() {
      this.dialogo.estado = false;
      var adjunto = this.adjunto;
      if (adjunto) {
        this.loader = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_CUDS`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch("https://server1ts.net//financiero/services/adjunto.impInv.php", {
          method: "POST",
          body: archivo,
        })
          .then((res) => res.json())
          .catch((err) => {
            this.loader = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            this.loader = false;
            // console.log("Res", res);
            if (res.code == 0) {
              this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      let agencia = this.form.punto_cuds.codigo_agc;
      let dll = "Financiero/dlls/PrImpCuds.dll";
      post
        .postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Cuds Actualizado correctamente",
            estado: true,
          });
          this.cargarcontenido();
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar Archivo",
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
