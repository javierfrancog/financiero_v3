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
              <v-icon size="30" color="blue darken-4 "
                >mdi-bus-stop-uncovered</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte de Tiquetes</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @change="
                      pickeFechaIni = false;
                      form.fechaFinal = form.fechaInicial;
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="4" md="4">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Taquilla"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  :error="errores.puntos"
                  @input="errores.puntos = false"
                  hide-details
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="4" md="3">
                <v-autocomplete
                  :items="placas"
                  label="Placa"
                  v-model="form.placas"
                  :item-text="format_placas"
                  item-value="codigo_agc"
                  clearable
                  :error="errores.placas"
                  @input="errores.placas = false"
                  hide-details
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="4" md="3">
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
                  @input="errores.fpago = false"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col class="d-flex" cols="6">
                <v-switch
                  v-model="form.anulados"
                  label="Solo anulados"
                ></v-switch>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-switch
                  v-model="form.pendientes"
                  label="Solo Pendientes Dian"
                  @change="consultar_reporte()"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="consultar_reporte"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="contenido.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>

              <v-btn
                color="purple"
                class="mt-2 ml-2 white--text px-12"
                large
                depressed
                :disabled="contenido.length == 0"
                @click="open_rango()"
              >
                Envio masivo Dian
              </v-btn>
            </v-row>

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
              :headers="headers"
              :items="contenido"
              item-key="index"
              :search="search"
            >
              <template v-slot:body.append>
                <tr>
                  <td colspan="5"></td>
                  <td class="font-weight-medium text-right">Totales</td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_cantidad) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_valor) }}
                  </td>
                </tr>
              </template>

              <template v-slot:item.estado_tiq="{ item }">{{
                item.estado_tiq == "1" ? "Anulado" : "Activo"
              }}</template>

              <template v-slot:item.libroviaje_tiq="{ item }">
                {{ parseInt(item.libroviaje_tiq) }}
              </template>

              <template v-slot:item.nro_tiq="{ item }">
                {{ parseInt(item.nro_tiq) }}
              </template>

              <template v-slot:item.dian="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="!item.iddian_tiq.trim() == ''"
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
                      :disabled="item.iddian_tiq.trim() == ''"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_json_dian(item)"
                      color="purple accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Reenviar DIAN</span>
                </v-tooltip>
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
                      @click="imprimir_tiquete(item)"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Tiquete</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red darken-4"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="
                        !item.idncdian_tiq.trim() == '' ||
                        item.bloqueo_tiq == '1'
                      "
                      @click="anular_tiquete(item)"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{ item.estado_tiq == "0" ? "Anular" : "Reactivar" }}
                  </span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.editar_tiq.trim() == '0'"
                      @click="editar_tiq(item)"
                    >
                      <v-icon>mdi-file-document-check-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Tiquete</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.nro_tiq > 0"
                      @click="get_consec(item)"
                    >
                      <v-icon>mdi-numeric</v-icon>
                    </v-btn>
                  </template>
                  <span>Asignar Numero</span>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="init_dialogo_rango">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="procesar_rango">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo.estado" persistent max-width="600px">
      <v-card class="px-6">
        <v-card-title class="d-flex justify-center">
          <span class="title col-12">Actualización Receptor Tiquete</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="d-flex justify-center col-12">
            <v-col class="d-flex" cols="5">
              <v-text-field
                label="Id Pasajero"
                clearable
                outlined
                required
                v-model="form.idpasajero"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center col-12">
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="mr-8 white--text"
                @click="grabar_tiquete()"
                >Guardar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ml-10 white--text"
                @click="dialogo.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
import { tiquete_transporte } from "../../_formatos_trans.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      placas: [],
      ptosrecaudo: [],
      search: "",
      total_valor: 0,
      total_cantidad: 0,
      total_rpc: 0,
      total_egresos: 0,
      total_redbus: 0,
      total_pinbus: 0,
      total_tdebito: 0,
      total_tcredito: 0,
      total_convenios: 0,
      item_select: null,
      envio_masivo: false,

      fpago: [
        { text: "Todas la formas de Pago", value: 0 },
        { text: "Efectivo", value: 1 },
        { text: "Yates", value: 6 },
        { text: "Convenio Brasilia", value: 9 },
        { text: "Redbus", value: 7 },
        { text: "PinBus", value: 10 },
        { text: "Tarjeta Crédito", value: 2 },
        { text: "Tarjeta Débito", value: 3 },
        { text: "Reserva", value: 8 },
        { text: "Gamarra", value: 11 },

        { text: "Otro", value: 4 },
      ],
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: 0,
        numFinal: 0,
        loader: false,
      },

      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Opciones", align: "center", value: "action" },
        { text: "Dian", align: "center", value: "dian" },
        { text: "Editar", align: "center", value: "pasajero" },

        { text: "Fecha", align: "left", value: "fechaelab_tiq" },
        { text: "Hora", align: "left", value: "horaelab_tiq" },
        { text: "Taquilla", align: "left", value: "nombreagencia_tiq" },
        { text: "Tiquete", align: "center", value: "nro_tiq" },
        { text: "Placa", align: "center", value: "placa_tiq" },
        { text: "Libro", align: "center", value: "libroviaje_tiq" },
        { text: "Pasajero", align: "left", value: "nombrepasaj_tiq" },
        { text: "Destino", align: "center", value: "destino_tiq" },
        { text: "Valor", align: "center", value: "vlr_tiq" },
        { text: "F_Pago", align: "center", value: "fpago_tiq" },
        { text: "Estado", align: "center", value: "estado_tiq" },
        { text: "Elaboró", align: "center", value: "nombreuser_tiq" },
      ],
      errores: {
        placas: false,
        puntos: false,
        fpago: false,
      },
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.cargar_placas();
    this.cargaragencias();
  },

  methods: {
    get_consec(item) {
      let tiquete = item.nro_tiq;
      let agencia = item.agencia_tiq;
      post
        .postData({
          url: "/transporte/dlls/PrTiqueteC.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.consultar_reporte();
          this.dialogo.estado = false;
        })
        .catch((err) => {
          this.send_error(err.Mensaje[0]);
        });
    },
    editar_tiq(item) {
      this.dialogo.estado = true;
      this.item_select = item;
    },
    grabar_tiquete() {
      let tiquete = this.item_select.nro_tiq;
      let agencia = this.item_select.agencia_tiq;
      let idpasaj = this.form.idpasajero.trim();
      post
        .postData({
          url: "/transporte/dlls/PrTiqueteM.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            tiquete +
            "|" +
            idpasaj +
            "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.dialogo.estado = false;
        })
        .catch((err) => {
          this.send_error(err.Mensaje[0]);
        });
    },
    open_rango() {
      this.dialogo_rango.estado = true;
      this.dialogo_rango.tipo = 1;
      this.dialogo_rango.numInicial = parseFloat(this.contenido[0].nro_tiq);
      let final = this.contenido[this.contenido.length - 1];
      this.dialogo_rango.numFinal = parseFloat(final.nro_tiq);
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
    procesar_rango() {
      if (this.dialogo_rango.numInicial && this.dialogo_rango.numFinal) {
        var tipo = this.dialogo_rango.tipo;
        var numInicial = parseInt(this.dialogo_rango.numInicial);
        var numFinal = parseInt(this.dialogo_rango.numFinal);
        var data = this.contenido.filter(
          (el) => el.nro_tiq >= numInicial && el.nro_tiq <= numFinal
        );
        this.enviar_masivo(data);
      }
    },

    async enviar_masivo(datos) {
      var data = datos.filter((el) => !el.iddian_tiq.trim());
      this.masivo.data = JSON.parse(JSON.stringify(data));
      let index = 0;
      if (data.length > 0) {
        for (const elemento of data) {
          const resultado = await this.cargar_json_masivo(elemento);
          index++;
          if (index === data.length) {
            this.consultar_reporte();
          }
        }
      } else {
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "No hay datos para procesar",
          estado: true,
        });
      }
    },

    async cargar_json_masivo(item) {
      this.loader = true;
      this.envio_masivo = true;
      this.dialogo_rango.estado = false;
      let agencia = item.agencia_tiq;
      let consecutivo = item.nro_tiq;
      let fecha = item.fechaemb_tiq.substr(0, 4);
      let prefijo = "DETP";
      this.item_mail = 1;
      var key = agencia + "|" + prefijo + "|" + consecutivo + "|" + fecha;
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Transporte/dlls/PrFactTitanJ.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });
        const resultado = await this.envio_json_titan(data[0]);
        return resultado;
      } catch (err) {
        this.loader = false;
        console.log("error", err);
        this.masivo.jsonEnvio.push({ error: true });

        let new_index = index + 1;
        if (new_index == this.masivo.data.length) {
          await this.envio_json_titan(new_index);
        } else {
          await this.cargar_json(new_index);
        }
      }
    },
    async envio_json_titan(index) {
      let factura = index;
      var _this = this;
      let urlEnvio = "https://server1ts.net/financiero/inc/elect_tr.titan.php";

      var formData = new FormData();
      formData.append("factura", JSON.stringify(factura));
      await fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .catch((error) => {
          this.loader = false;
          console.log("error_1");
        })
        .then(async (response) => {
          this.card.loader = false;
          this.card.disabled = false;
          let valido = false;
          let mensaje = "";
          let cufe = response.cufe;

          let item_envio = {
            agencia_tiq: null,
            nro_tiq: null,
            fechaelab_tiq: null,
          };
          if (response.success) {
            if (response.success == false) {
              mensaje = response.message;
              if (
                mensaje ===
                "Este documento ya fue enviado anteriormente, se registra en la base de datos."
              ) {
                cufe = response.cufe;
                valido = true;
              }
            } else {
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
          } else {
            let respuesta_dian = response.message;
            if (
              respuesta_dian ==
              "Este documento ya fue enviado anteriormente, se registra en la base de datos."
            ) {
              cufe = response.cufe;
              cufe = response.cufe;
              valido = true;
            } else {
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
                valido = true;
              } else {
                cufe = response.cufe;
                valido = true;
              }
            }
          }
          if (valido === true) {
            item_envio.agencia_tiq = factura.agencia_tiq;
            item_envio.nro_tiq = factura.consecutivo.trim();
            item_envio.fechaelab_tiq = factura.date;
            await _this.grabar_cufe(item_envio, cufe, 1);
          }
        });
      this.loader = false;
    },
    async grabar_cufe(item, cufe, tipo) {
      var agencia = item.agencia_tiq;
      var consecutivo = item.nro_tiq;
      var fecha = item.fechaelab_tiq.substr(0, 4);

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        tipo +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        cufe +
        "|" +
        fecha +
        "|";

      post
        .postData({
          url: "Transporte/dlls/PrFact01Id.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.item_envio = item;
          this.$emit("snack", {
            color: "success",
            text: "Tiquete enviado a la Dian ",
            estado: true,
          });
          if (this.envio_masivo == false) {
            this.consultar_reporte();
            this.card.loader = false;
            this.card.disabled = false;
          }

          this.$emit("snack", {
            color: "success",
            text: "Cufe Grabado",
            estado: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
          this.loader = false;
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Ha ocurrido un error grabando el CUFE del Tiquete.");
        });
    },
    async cargar_json(index) {
      var item = this.masivo.data[index];
      let agencia = item.agencia_tiq;
      let consecutivo = item.nro_tiq;
      let fecha = item.fechaemb_tiq.substr(0, 4);
      let prefijo = "DETP";
      // this.loader = true;
      this.item_mail = 1;
      //      var fecha = item.fecha_fact.substr(0, 4);
      var key = agencia + "|" + prefijo + "|" + consecutivo + "|" + fecha;
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Transporte/dlls/PrFactTitanJ.dll";

      await post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.masivo.jsonEnvio.push(data[0]);
          let new_index = index + 1;
          if (new_index == this.masivo.data.length) {
            await this.envio_json_titan(0);
          } else await this.cargar_json(new_index);
        })
        .catch(async (err) => {
          console.log("error", err);
          this.masivo.jsonEnvio.push({ error: true });
          let new_index = index + 1;
          if (new_index == this.masivo.data.length) {
            await this.envio_json_titan(new_index);
          } else await this.cargar_json(new_index);
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

          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todos",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    async get_json_dian_nc(item) {
      let agencia = item.agencia_tiq;
      let consecutivo = item.nro_tiq;
      let fecha = item.fechaemb_tiq.substr(0, 4);
      let prefijo = "DETP";
      // this.loader = true;
      this.item_mail = 1;
      //      var fecha = item.fecha_fact.substr(0, 4);
      var key = agencia + "|" + prefijo + "|" + consecutivo + "|" + fecha;
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Transporte/dlls/PrNcredTitanJ.dll";
      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = null;
          var urlEnvio = null;
          let nombre64 = " ";
          let observacion64 = null;

          let idpasajero = data[0].customer.identification_number;
          // this.calculardv(idpasajero);

          factura = data[0];
          let nro_envio = factura.number;
          urlEnvio =
            "https://server1ts.net/financiero/inc/api_dian/nc_elect_tr.titan.php";

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.loader = false;
              this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              this.card.loader = false;
              this.card.disabled = false;
              let cufe = null;
              let valido = false;
              let errordian = null;
              let error_fecha = null;

              if (response.errors) {
                this.send_error(response.errors);
                valido = false;
              } else {
                if (!response.ResponseDian) {
                  valido = response.success;
                  errordian = response.message;
                  cufe = response.cude;
                } else {
                  if (response.ResponseDian) {
                    cufe =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.XmlDocumentKey;

                    // valido =
                    //   response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    //     .SendBillSyncResult.IsValid;
                    valido = true;
                    errordian =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.ErrorMessage.string;
                  } else {
                    error_fecha = response.errors.date[0];
                  }
                }
              }

              // if (error_fecha) {
              //   errordian = error_fecha;
              //   valido = false;
              // }

              // if (response.errors.number) {
              //   errordian = response.errors.number[0];
              //   valido = false;
              // }

              if (valido === false) {
                if (
                  errordian ==
                  "Este documento ya fue enviado anteriormente, se registra en la base de datos."
                ) {
                  this.grabar_cufe(item, cufe, 2);
                } else {
                  this.send_error(errordian);
                }
              } else {
                cufe = response.cude;
                this.grabar_cufe(item, cufe, 2);
              }
            });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.log(err);
          this.send_error(err);
        });
    },
    async get_json_dian(item) {
      this.envio_masivo == false;
      let agencia = item.agencia_tiq;
      let consecutivo = item.nro_tiq;
      let fecha = item.fechaemb_tiq.substr(0, 4);
      let prefijo = "DETP";
      // this.loader = true;
      this.item_mail = 1;
      //      var fecha = item.fecha_fact.substr(0, 4);
      var key = agencia + "|" + prefijo + "|" + consecutivo + "|" + fecha;
      var datosEnvio = sessionStorage.Sesion + "|" + key + "|";
      let urlconsulta = "Transporte/dlls/PrFactTitanJ.dll";
      post
        .postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let factura = null;
          var urlEnvio = null;
          let nombre64 = " ";
          let observacion64 = null;

          let idpasajero = data[0].customer.identification_number;
          this.calculardv(idpasajero);

          factura = data[0];
          let nro_envio = factura.number;
          urlEnvio = "https://server1ts.net/financiero/inc/elect_tr.titan.php";

          var formData = new FormData();
          formData.append("factura", JSON.stringify(factura));
          fetch(urlEnvio, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .catch((error) => {
              this.loader = false;
              this.send_error(
                "Ha ocurrido un error durante el envío de la factura: " + error
              );
            })
            .then((response) => {
              this.card.loader = false;
              this.card.disabled = false;
              let cufe = null;
              let valido = false;
              let errordian = null;
              let error_fecha = null;

              if (response.errors) {
                this.send_error(response.errors);
                valido = false;
              } else {
                if (!response.ResponseDian) {
                  valido = response.success;
                  errordian = response.message;
                  cufe = response.cufe;
                } else {
                  if (response.ResponseDian) {
                    cufe =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.XmlDocumentKey;

                    // valido =
                    //   response.ResponseDian.Envelope.Body.SendBillSyncResponse
                    //     .SendBillSyncResult.IsValid;
                    valido = true;
                    errordian =
                      response.ResponseDian.Envelope.Body.SendBillSyncResponse
                        .SendBillSyncResult.ErrorMessage.string;
                  } else {
                    error_fecha = response.errors.date[0];
                  }
                }
              }

              // if (error_fecha) {
              //   errordian = error_fecha;
              //   valido = false;
              // }

              // if (response.errors.number) {
              //   errordian = response.errors.number[0];
              //   valido = false;
              // }

              if (valido === false) {
                if (
                  errordian ==
                  "Este documento ya fue enviado anteriormente, se registra en la base de datos."
                ) {
                  this.grabar_cufe(item, cufe, 1);
                } else {
                  this.send_error(errordian);
                }
              } else {
                cufe = response.cufe;
                this.grabar_cufe(item, cufe, 1);
              }
            });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          console.log(err);
          this.send_error(err);
        });
    },

    cargar_placas() {
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
          this.placas.unshift({
            placa_veh: "Todas las placas",
          });
          var busqueda_placa = this.placas.find(
            (el) => el.placa_veh == "Todas las placas"
          );
          this.placas.value = busqueda_placa;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },

    format_placas: function (val) {
      return `${val.placa_veh.trim()}`;
    },
    anular_tiquete(item) {
      let tiquete = item.nro_tiq;
      let agencia = item.agencia_tiq;
      post
        .postData({
          url: "/transporte/dlls/PrAnulaTiq.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Proceso correcto",
            estado: true,
          });
          if (item.estado_tiq == "0") {
            this.get_json_dian_nc(item);
          }
          this.consultar_reporte();
        })
        .catch((err) => {
          console.log("Error", err);
          this.loaderTable = false;
          this.send_error("Error al anular el tiquete");
        });
    },
    imprimir_tiquete(item) {
      let tiquete = item.nro_tiq;
      let agencia = item.agencia_tiq;
      post
        .postData({
          url: "/transporte/dlls/PrTiquetesJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          const _this = this;
          let fecha = this.$moment().format("YYYY-MM-DD");
          let hora = this.$moment().format("HH:mm");

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);
          var logoSuper_src = require("../../assets/image/clientes/supertransportes.png");

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            this.pdfs.getBase64(logoSuper_src).then((logoSuper) => {
              data.logoSuper = logoSuper;
              tiquete_transporte(data, fecha, hora).then(() => {
                console.log("Impresión terminada");
              });
            });
          });
        });
    },
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));
      let total_valor = 0;

      var data_parse = data.map((el) => {
        // let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
        let ventas = parseFloat(el.vlr_tiq.replace(/\,/g, "")) || 0;
        let seguro = parseFloat(el.seguro_tiq.replace(/\,/g, "")) || 0;

        el.vlr_tiq = ventas;
        el.seguro_tiq = seguro;

        if (el.id != 99) {
          total_valor += ventas;
        }

        return el;
      });

      var columnas = [
        {
          title: "Fecha",
          value: "fechaelab_tiq",
          format: "string",
        },
        {
          title: "Taquilla",
          value: "nombreagencia_tiq",
          format: "string",
        },
        {
          title: "Tiquete",
          value: "nro_tiq",
        },
        {
          title: "Placa",
          value: "placa_tiq",
        },
        {
          title: "Libro",
          value: "libroviaje_tiq",
        },
        {
          title: "Pasajero",
          value: "nombrepasaj_tiq",
        },
        {
          title: "Destino",
          value: "destino_tiq",
        },
        {
          title: "Valor",
          value: "vlr_tiq",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Seguro",
          value: "seguro_tiq",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cantidad",
          value: "pasajeros_tiq",
          totalsRowFunction: "sum",
        },
        {
          title: "F_Pago",
          value: "fpago_tiq",
        },
        {
          title: "Estado",
          value: "estado_tiq",
        },
        {
          title: "Despachador",
          value: "nombreuser_tiq",
        },
        {
          title: "Usuario Anula",
          value: "user_anula_tiq",
        },
        {
          title: "Fecha Anula",
          value: "fechaanula_tiq",
          format: "string",
        },


      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "REPORTE DE TIQUETES", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Tiquetes",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-TIQUETES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    print_reporte() {
      var data = this.contenido;
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      let valor_total = 0;
      let cantidad_total = 0;

      var data_parse = [];
      data.forEach((el) => {
        let valor = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
        valor_total += valor;
        cantidad_total += parseFloat(el.cantidad_rep);
        let item = [
          el.taquilla_rep.trim(),
          { text: el.cantidad_rep.trim(), alignment: "right" },
          { text: el.ventas_rep.trim(), alignment: "right" },
        ];
        data_parse.push(item);
      });

      data_parse.push([
        { text: "Totales " },
        { text: cantidad_total, alignment: "right" },
        { text: this.formatNumero(valor_total), alignment: "right" },
      ]);
      data_parse.unshift([
        { text: "Agencias", style: "header_table" },
        { text: "Cantidad", style: "header_table", alignment: "right" },
        { text: "Ventas", style: "header_table", alignment: "right" },
      ]);

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_parse,
          header_pdf: [
            {
              text: [{ text: "Fecha inicial: ", bold: true }, fecha_inicial],
            },
            {
              text: [{ text: "Fecha Final: ", bold: true }, fecha_final],
            },
          ],
          width_table: ["*", "*", "*"],
          logo,
          titulo: "Ventas del Dia",
          fontSize: 8,
        });
      });
    },
    consultadian_item(item, tipo) {
      let cufe = item.iddian_tiq.trim();
      if (tipo === 1) {
        cufe = item.idajustedian_fact;
      }
      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },

    async calculardv(identificacion) {
      var arreglo, x, y, documentoElementos, i, documento, dv1;
      documento = parseFloat(identificacion);
      if (!documento) {
        alert("Debe escribir el número de Identificación sin puntos.");
      } else {
        arreglo = [];
        x = 0;
        y = 0;
        documentoElementos = documento.length;
        arreglo[1] = 3;
        arreglo[2] = 7;
        arreglo[3] = 13;
        arreglo[4] = 17;
        arreglo[5] = 19;
        arreglo[6] = 23;
        arreglo[7] = 29;
        arreglo[8] = 37;
        arreglo[9] = 41;
        arreglo[10] = 43;
        arreglo[11] = 47;
        arreglo[12] = 53;
        arreglo[13] = 59;
        arreglo[14] = 67;
        arreglo[15] = 71;
        for (i = 0; i < documentoElementos; i++) {
          y = documento.substr(i, 1);
          x += y * arreglo[documentoElementos - i];
        }
        y = x % 11;
        if (y > 1) {
          dv1 = 11 - y;
        } else {
          dv1 = y;
        }
        let dv_calc = parseInt(dv1);
      }
    },

    consultar_reporte() {
      if (!this.form.puntos) {
        this.errores.puntos = true;
        this.send_error("Debe seleccionar una taquilla");
      } else if (!this.form.placas) {
        this.errores.placas = true;
        this.send_error("Debe seleccionar una placa");
      } else if (!this.form.fpago) {
        this.errores.fpago = true;
        this.send_error("Debe seleccionar una forma de pago");
      } else {
        this.loader = true;
        let fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let placa = this.form.placas.placa_veh;
        if (placa === "Todas las placas") placa = 0;
        var anulados = this.form.anulados ? "1" : "0";
        if (placa === "Todas las placas") placa = 0;
        let agencia = this.form.puntos.codigo_agc;
        let pendiente = this.form.pendientes ? "1" : "0";
        this.envio_masivo = false;
        this.contenido = [];

        let fpago = this.form.fpago.value;
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          placa,
          fpago,
          agencia,
          anulados,
          pendiente,
        ];
        this.postData({
          url: "Transporte/dlls/RpTiquetes04VJ.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));
            this.contenido.forEach((el) => {
              let valor = parseFloat(el.vlr_tiq.replace(/\,/g, "")) || 0;
              this.total_valor += valor;
              let cantidad =
                parseFloat(el.pasajeros_tiq.replace(/\,/g, "")) || 0;
              this.total_cantidad += cantidad;

              // el.vlr_tiq = this.formatNumero(el.vlr_tiq);
              el.pasajeros_tiq = this.formatNumero(el.pasajeros_tiq);
            });
          })
          .catch((err) => {
            this.loader = false;
            console.log("Error", err);
            this.$emit(
              "msj",
              err.Mensaje ? err.Mensaje[0].msg : err,
              "red",
              1000
            );
          });
      }
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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
