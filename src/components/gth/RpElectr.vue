3<template>
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
                >mdi-account-convert</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >EnvÃ­o NÃ³mina ElectrÃ³nica</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
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
                  v-model="form.fecha"
                  label="Fecha de NÃ³mina"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="6" sm="4">
            <v-autocomplete
              label="Agencia"
              v-model="form.agencia"
              :items="agencias"
              :item-text="format_agencias"
              item-value="codigo_agc"
              hide-details
              outlined
              return-object
              @change="errores.agencia = false"
              :error="errores.agencia"
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="12" sm="2">
            <v-switch
              v-model="ptedian"
              label="Solo Pendientes DIAN"
              @change="cargarcontenido()"
            >
            </v-switch>
          </v-col>

          <!-- <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Tipo"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>           -->
        </v-row>

        <v-row class="justify-end">
          <v-btn
            color="indigo"
            class="white--text mr-3"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
          <v-btn
            color="orange"
            class="white--text mr-3"
            large
            depressed
            @click="envio_masivo"
          >
            Envio masivo
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
          <v-btn
            color="success"
            class="white--text mr-3"
            large
            depressed
            :disabled="contenido.length == 0"
            @click="generar_excel"
          >
            Generar EXCEL
            <v-icon right>mdi-file-excel-box</v-icon>
          </v-btn>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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
              :expanded.sync="expanded"
              item-key="idnomina_rep"
              :search="search"
              show-select
              show-expand
              v-model="list_select"
              disable-pagination
            >
              <template v-slot:expanded-item="{ item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-btn
                            large
                            @click="envio_dian(item, 3)"
                            color="orange accent-3"
                            fab
                            icon
                            depressed
                          >
                            <v-icon>mdi-send</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <b>Reenviar</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            large
                            @click="change_cune(item)"
                            color="purple accent-3"
                            fab
                            icon
                            depressed
                          >
                            <v-icon>mdi-format-font</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <b>Actualizar Cune</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            large
                            @click="envio_dian(item, 1)"
                            color="purple accent-3"
                            fab
                            icon
                            depressed
                          >
                            <v-icon>mdi-send</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <b>Reenviar_2</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            large
                            @click="anula_dian(item)"
                            color="red accent-3"
                            fab
                            icon
                            depressed
                            :disabled="item.cuneanula_rep.trim() ? true : false"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <b>Anular</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            @click="consultadian_item(item, 3)"
                            color="green"
                            fab
                            icon
                            :disabled="
                              !item.cuneanula_rep.trim() ? true : false
                            "
                          >
                            <v-icon>mdi-shield-check</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <span>Consultar DIAN</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <v-btn
                            large
                            @click="change_number(item)"
                            color="success accent-3"
                            fab
                            icon
                            depressed
                          >
                            <v-icon>mdi-abugida-thai</v-icon>
                          </v-btn>
                        </td>
                        <td>
                          <b>Actualizar Consecutivo</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="envio_dian(item)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      :disabled="item.cune_rep.trim() ? true : false"
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
                      :disabled="item.cune_rep.trim() ? false : true"
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
                      :disabled="item.cune_rep.trim() ? false : true"
                    >
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Consultar Dian</span>
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
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="mb-4" cols="12">
              <v-text-field
                v-model="form.cune"
                label="Cune"
                single-line
                hide-details
              ></v-text-field>
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
            @click="procesar_cune()"
            >Procesar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

        <v-dialog v-model="dialogonumber.estado" persistent max-width="500px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">ReasignaciÃ³n de Consecutivo</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="mb-4" cols="6">
              <v-text-field
                v-model="form.consecutivo"
                label="Nuevo Consecutivo"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogonumber.estado = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="indigo white--text"
            depressed
            large
            @click="procesar_number()"
            >Procesar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoanula.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogoanula.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="mb-4" cols="2">
              <v-text-field
                v-model="form.folio"
                label="Folio"
                single-line
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="mb-4" cols="2">
              <v-btn
                class="ma-2 px-4"
                color="green white--text"
                depressed
                large
                text
                @click="consultadian_item(form.cune, 1)"
                >Consultar Folio
                <v-icon>mdi-shield-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mb-4" cols="12">
              <v-text-field
                v-model="form.cune"
                label="Cune"
                single-line
                hide-details
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
            @click="dialogoanula.estado = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="indigo white--text"
            depressed
            large
            @click="procesar_anula()"
            >Procesar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;


import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { nomina_elect } from "@/_formatos.pdf";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogonumber: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoanula: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      item_envio: {},
      item_select: [],
      ptedian: null,
      card: {
        loader: false,
        disabled: false,
      },

      search: "",
      user: "",
      activar: true,
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Opciones", value: "edit", align: "center" },

        { text: "Agencia", align: "left", value: "agencianomina_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Apellido2", align: "left", value: "Apellido2nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Neto Nomina", align: "left", value: "netonomina_rep" },
        { text: "Prov.Cesantias", align: "center", value: "cesantias_rep" },
        { text: "Prov.Intereses", align: "center", value: "intereses_rep" },
        { text: "Prov.Prima", align: "center", value: "prima_rep" },
        { text: "Prov.Vacaciones", align: "center", value: "vacaciones_rep" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      periodos: [
        { text: "Mensual", value: 1 },
        { text: "1ra Quincena", value: 2 },
        { text: "2da Quincena", value: 3 },
        { text: "Nomina Adicional", value: 4 },
      ],
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      empresa: {},
      list_select: [],
    };
  },
  created() {
    this.infoEmpresa();
    this.cargarTablaAg();

    this.form.agencia = {
      text: "Todas las Agencias",
      codigo_agc: "0",
    };
  },
  computed: {},
  methods: {
    anula_dian(item) {
      this.item_envio = item;
      this.dialogoanula.estado = true;
      this.dialogoanula.titulo =
        item.nombresnomina_rep.trim() + " " + item.Apellido1nomina_rep.trim();
      this.form.cune = item.cune_rep.trim();
    },
    async procesar_anula() {
      let res = await this.get_json_dian2();
      this.card.disabled = false;
      this.dialogoanula.estado = false;
    },
    async anula_ws(plano) {
      return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("nomina", plano);
        fetch(`https://server1ts.net//financiero//inc/api_dian/anulanom.php`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            let mensajedian = res.message;
            console.log("respuesta anula", mensajedian);
            if (
              mensajedian ==
              "Este documento ya fue enviado anteriormente, se registra en la base de datos."
            ) {
              let cunedian = res.cune.trim();

              this.guardar_cune(cunedian, null, this.item_envio, 2);
              this.cargarcontenido();
            }

            resolve(res);
          })
          .catch((err) => {
            this.loader = false;
            console.log("titan", err);
          });
      });
    },
    get_json_dian2() {
      return new Promise((resolve) => {
        var fecha = this.item_envio.fecha_rep;
        var folio = this.form.folio.trim();
        var cune = this.item_envio.cune_rep.trim();
        var datosEnvio =
          sessionStorage.Sesion + "|" + fecha + "|" + folio + "|" + cune + "|";
        let dll = "Financiero/dlls/RpNomTitan2J.dll";
        post
          .postData({
            url: dll,
            data: datosEnvio,
            method: "",
          })
          .then(async (data) => {
            let res = false;
            let plano = JSON.stringify(data[0]);
            await this.anula_ws(plano);

            this.loader = false;
            let respuesta_titan = res.errors;
            this.loader = false;
            resolve(res);
          })
          .catch((err) => {
            this.loader = false;
            resolve(false);
          });
      });
    },

    change_cune(item) {
      this.item_envio = item;
      this.dialogo.estado = true;
    },
    procesar_cune() {
      this.dialogo.estado = false;
      this.loader = true;
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var empleado = this.item_envio.idnomina_rep;
      var agencia = this.item_envio.agencianomina_rep;
      var cune = this.form.cune.trim();
      post
        .postData({
          url: "Financiero/dlls/RpNomCune.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            empleado +
            "|" +
            agencia +
            "|" +
            cune +
            "|" +
            0 +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
        });
    },
    change_number(item) {
      this.item_envio = item;
      this.dialogonumber.estado = true;
    },
   async procesar_number() {
      this.dialogonumber.estado = false;
      this.loader = true;
      let consecutivo = this.form.consecutivo.trim();
      let res = await this.get_json_dian(this.item_envio, 1, consecutivo);

    },
    async envio_masivo() {
      if (this.list_select.length === 0) {
        this.send_error("Debe Seleccionar por lo menos un empleado");
      } else {
        let lista = this.list_select;
        for (const item of lista) {
          let res = await this.get_json_dian(item);
          // if (res.Error) {
          //   console.log("Error", res);
          //   this.send_error(
          //     item.nombresnomina_rep.trim() + ": Ha ocurrido un error"
          //   );
          // }
        }

        this.card.loader = false;
        this.card.disabled = false;
      }
    },
    async envio_dian(item, tipo) {
      let res = await this.get_json_dian(item, tipo);
      this.card.disabled = false;
    },
    get_json_dian(item, tipo, consecutivo) {
      this.item_select = item;

      return new Promise((resolve) => {
        if (!tipo) {
          tipo = 0;
        }
        var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
        var empleado = item.idnomina_rep;
        var agencia = item.agencianomina_rep;
        let numero = consecutivo? consecutivo : "0";
        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          empleado +
          "|" +
          agencia +
          "|" +
          tipo +
          "|" +
          numero +
          "|";
        let proveedor = this.empresa.provnom_empr;
        let dll = null;
        if (proveedor === "2") dll = "Financiero/dlls/RpNomEkoJ.dll";
        else if (proveedor === "1") dll = "Financiero/dlls/RpNomEmisionJ.dll";
        else if (proveedor === "3") dll = "Financiero/dlls/RpNomDelcopJ.dll";
        else if (proveedor === "4") dll = "Financiero/dlls/RpNomTitanJ.dll";
        post
          .postData({
            url: dll,
            data: datosEnvio,
            method: "",
          })
          .then(async (data) => {
            let res = false;
            let nombre =
              item.Apellido1nomina_rep.trim() +
              " " +
              item.nombresnomina_rep.trim() +
              " ";

            if (proveedor === "2") {
              res = await this.consulta_ws("eko.nomina", data[0].plano);
              this.loader = false;
              if (typeof res.Error.ErrorCode === "string")
                this.send_error(nombre + res.Error.ErrorMessage);
              else {
                await this.guardar_cune(res.UUID, null, item);
                this.$emit("snack", {
                  color: "green",
                  text: "Documento enviado",
                  estado: true,
                });
                this.cargarcontenido();
              }
            } else if (proveedor === "1") {
              res = await this.consulta_ws(
                "ws.emision",
                JSON.stringify(data[0])
              );

              if (res.status === 0) {
                this.send_error(res.message);
              } else if (!res.id) {
                let msj_error = "";
                Object.values(res.errors).forEach((el) => {
                  msj_error += el.join("\n");
                });

                this.send_error(msj_error);
              } else {
                this.loader = false;
                await this.guardar_cune(null, res.id, item);
                let cune = await this.consultar_emision(res.id);
                await this.guardar_cune(cune, null, item);
                this.$emit("snack", {
                  color: "green",
                  text: "Documento enviado",
                  estado: true,
                });
                this.cargarcontenido();
              }
            } else if (proveedor === "4") {
              this.loader = true;
              res = await this.consulta_ws(
                "titan.nomina",
                JSON.stringify(data[0]),
                tipo
              );
              let respuesta_titan = res.errors;
              if (respuesta_titan) {
                this.$emit("snack", {
                  color: "red",
                  text: respuesta_titan,
                  estado: true,
                });
              }

              let respuestadian =
                res.ResponseDian.Envelope.Body.SendNominaSyncResponse
                  .SendNominaSyncResult.IsValid;
              let mensajedian =
                res.ResponseDian.Envelope.Body.SendNominaSyncResponse
                  .SendNominaSyncResult.ErrorMessage.string;

              if (respuestadian == "true") {
                let cune = res.cune;
                let diasvence = res.certificate_days_left;
                this.$emit("snack", {
                  color: "success",
                  text:
                    "NÃ³mina Procesada Correctamente -Dias para renovaciÃ³n:" +
                    diasvence +
                    "-",
                  estado: true,
                });
                await this.guardar_cune(cune, null, item);
                this.cargarcontenido();
              } else {
                if (
                  mensajedian ==
                  "Regla: 90, Rechazo: Documento procesado anteriormente."
                ) {
                  let cunedian =
                    res.ResponseDian.Envelope.Body.SendNominaSyncResponse.SendNominaSyncResult.StatusDescription.split(
                      "CUNE"
                    );
                  cunedian = cunedian[1].trim();
                  await this.guardar_cune(cunedian, null, item);
                  this.cargarcontenido();
                } else {
                  this.$emit("snack", {
                    color: "red",
                    text: mensajedian,
                    estado: true,
                  });
                }
              }
              this.loader = false;

              //     let cune_info = await this.consulta_cune(parseInt(lote));

              //   if (cune) {
              //     await this.guardar_cune(cune, null, item);
              //     this.$emit("snack", {
              //       color: "green",
              //       text: "Documento enviado",
              //       estado: true,
              //     });
              //     this.cargarcontenido();
              //   }
              // }
              this.loader = false;
            } else {
              console.log("No se ha definido un WS");
              resolve(false);
            }
            this.loader = false;
            resolve(res);
          })
          .catch((err) => {
            this.loader = false;
            resolve(false);
            let msj = "";
            if (err.Code == "8") msj = err.Mensaje[0].payroll.msg;
            else if (err.Code == "7" || err.Code == "4")
              msj = err.Mensaje[0].msg;
            else msj = err.Mensaje[0].Document;
            this.send_error(msj);
          });
      });
    },
    async guardar_cune(cune = "", idtrans = "", item, tipo) {
      this.loader = true;
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var empleado = item.idnomina_rep;
      var agencia = item.agencianomina_rep;

      if (tipo == 2) {
        idtrans = "AN";
      }

      await post
        .postData({
          url: "Financiero/dlls/RpNomCune.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            empleado +
            "|" +
            agencia +
            "|" +
            cune +
            "|" +
            idtrans +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
        });

      return true;
    },
    print_item(item) {
      var fecha = this.form.fecha.replace(/\-/g, "");
      var tipo = 0;
      var idNomina = item.idnomina_rep;
      var sesion = sessionStorage.Sesion;

      var datosEnvio =
        sesion + "|" + fecha + "|" + tipo + "|" + idNomina + "|" + 1 + "|";
      this.card.loader = true;
      this.card.disabled = true;
      post
        .postData({
          url: "Financiero/dlls/RpGthCpagoJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.format_impresion(data[0]);
        })
        .catch((err) => {
          console.log("error", err);
          this.card.loader = false;
          this.card.disabled = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al generar la impresiÃ³n",
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
          this.agencias.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas las Agencias",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    generar_excel() {
      var _this = this;
      var data = this.contenido;
      var data_parse = [];
      var titColumnas = [];
      var fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var periodo = this.form.fecha;
      var columnas = [
        {
          title: "Agencia",
          value: "nombreagencianomina_rep",
        },
        {
          title: "  Documento",
          value: "idnomina_rep",
        },
        {
          title: " Apellido 1",
          value: "Apellido1nomina_rep",
        },
        {
          title: " Apellido 2",
          value: "Apellido2nomina_rep",
        },
        {
          title: "  Nombres",
          value: "nombresnomina_rep",
        },
        {
          title: "Total Devengos",
          value: "totaldev_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

        {
          title: "Neto pagado",
          value: "netonomina_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Cune",
          value: "cune_rep",
          format: "string",
        },
      ];

      data.forEach((el) => {
        data_parse.push({
          nombreagencianomina_rep: el.nombreagencianomina_rep,
          idnomina_rep: el.idnomina_rep,
          Apellido1nomina_rep: el.Apellido1nomina_rep,
          Apellido2nomina_rep: el.Apellido2nomina_rep,
          nombresnomina_rep: el.nombresnomina_rep,
          cune_rep: el.cune_rep.trim(),
          totaldev_rep:
            el.totaldev_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
          netonomina_rep:
            el.netonomina_rep.replace(/\ /g, "").replace(/\,/g, "") || 0,
        });
      });

      // data_parse.pop();

      var header = [
        {
          text: _this.empresa.descrip_empr.trim(),
          bold: true,
          size: 16,
        },
        `NIT. ${parseInt(_this.empresa.id_empr)}`,
        "PLANILLA NOMINA ELECTRONICA",
        periodo,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Planilla Nomina Electronica",
            header: header,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `NOMINA-ELECTRONICA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    format_impresion(data, sendEmail) {
      var _this = this;
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.empresa = _this.empresa;
        data.logo = logo;

        nomina_elect(data, sendEmail).then((blob) => {
          this.card.loader = false;
          this.card.disabled = false;
        });
      });
    },
    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    consultar_emision(id) {
      this.loader = true;
      return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("id", id);
        fetch(`https://server1ts.net//financiero/inc/ws.emision.consulta.php`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            this.loader = false;
            resolve(res.data ? res.data.signed_xml_key : "");
          });
      });
    },

    infoEmpresa() {
      this.user = parseInt(sessionStorage.Sesion.substring(16, 30));
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion,
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        });
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },
    consulta_cune(lote) {
      return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("lote", lote);
        fetch(`https://server1ts.net//financiero/inc/delcop_tr.php`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            resolve(res);
          });
      });
    },
    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    cargarcontenido() {
      let fecha = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ptedian = this.ptedian ? 1 : 0;
      let agencia = this.form.agencia.codigo_agc;

      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/RpNomElect01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            ptedian +
            "|" +
            agencia +
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
            text: "Error al cargar NÃ³minas",
            estado: true,
          });
        });
    },
    async consulta_ws(ws, plano, tipo) {
      return new Promise((resolve) => {
        var formData = new FormData();
        formData.append("nomina", plano);
        fetch(`https://server1ts.net//financiero/inc/${ws}.php`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            let mensajedian = res.message;
            if (
              mensajedian ==
              "Este documento ya fue enviado anteriormente, se registra en la base de datos."
            ) {
              let cunedian = res.cune.trim();

              this.guardar_cune(cunedian, null, this.item_select);
              this.cargarcontenido();
            }

            resolve(res);
          })
          .catch((err) => {
            this.loader = false;
            console.log("titan", err);
          });
      });
    },
    consultadian_item(item, tipo) {
      let cufe = item.cune_rep;
      if (tipo == 1) {
        cufe = this.item_envio.cune_rep.trim();
      }

      if (tipo === 3) {
        cufe = item.cuneanula_rep;
      }

      const url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
      window.open(url, "_blank").focus();
    },
    send_error(res) {
      this.loader = false;
      console.error("Error", res);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>

