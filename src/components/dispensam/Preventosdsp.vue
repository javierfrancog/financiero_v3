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
                >mdi-comment-alert-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Eventos Dispensación</v-list-item-title
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
                    @input="pickeFechaIni = false"
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
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Sede"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="consultar_reporte(), (errores.puntos = false)"
                  :error="errores.puntos"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col>
                <v-btn
                  color="indigo darken-3 white--text"
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
              </v-col>
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="form.ressede"
            >
              <v-col cols="12">
                <canvas id="grafico1"></canvas>
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
              item-key="index"
              :search="search"
            >

            <template v-slot:item.estado_rep="{ item }">
                <v-chip
                  class="white--text"
                  small
                  label
                  :color="item.color_rep"
                  >{{ item.estado_rep }}</v-chip
                >
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>
              <template v-slot:item.idpac_rep="{ item }">
                {{ parseInt(item.idpac_rep) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="printdispos_item(item, 0)"
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Tirilla Entrega</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-image-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Actualizar</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogoactualiza.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Actualiza dispensación</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Nro Autorización:"
                v-model="form.autorizacion"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickerFechaauto"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaauto"
                    label="Fecha Autorización:"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaauto"
                  @input="pickerFechaauto = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickerFechapte"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechapte"
                    label="Fecha Pte Mantis:"
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechapte"
                  @input="pickerFechapte = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Copago:"
                v-model="form.copago"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="C. Moderadora:"
                v-model="form.cuotam"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                :items="itemstipoorden"
                label="Tipo Orden"
                clearable
                hide-details
                return-object
                v-model="form.tipoorden"
                item-text="text"
                item-value="value"
                required
                :error="errores.tipoorden"
                @change="errores.tipoorden = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-select
                :items="itemstipocontrato"
                label="Tipo Contrato"
                clearable
                hide-details
                return-object
                v-model="form.tipocontr"
                item-text="text"
                item-value="value"
                required
                :error="errores.tipocontr"
                @change="errores.tipocontr = false"
              ></v-select>
            </v-col>
          </v-row>

          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Diagnostico:"
                v-model="form.diagnostico"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Nro.Entrega:"
                v-model="form.nroentrega"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Observacion:"
                v-model="form.observ"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>


          <v-row justify="center" class="d-flex">
            <v-btn
              color="purple"
              class="white--text mr-3 px-12"
              depressed
              large
              @click="grabar_change"
            >
              Guardar
            </v-btn>

            <v-btn
              color="red accent-4"
              class="white--text px-12"
              depressed
              large
              @click="dialogoactualiza.estado = false"
            >
              Cerrar
            </v-btn>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="12">
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1.5px', 'border-color': 'orange' }"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogomotivo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Motivo Anulacion</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="10">
              <v-text-field
                hide-details
                clearable
                v-model="form.motivo"
                :error="errores.motivo"
                @input="errores.motivo = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-btn
              color="purple"
              class="white--text mr-3 px-12"
              depressed
              large
              :disabled="!form.motivo"
              @click="grabar_anular"
            >
              Guardar
            </v-btn>

            <v-btn
              color="red accent-4"
              class="white--text px-12"
              depressed
              large
              @click="dialogomotivo.estado = false"
            >
              Cerrar
            </v-btn>
          </v-row>
          <v-row justify="center" class="d-flex">
            <v-col class="d-flex" cols="12">
              <v-divider
                class="mt-6"
                :style="{ 'border-width': '1.5px', 'border-color': 'orange' }"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { dispensacion_pos } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      pickerFechaauto: false,
      pickerFechapte: false,
      pterad: null,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      item_sel: [],
      expanded: [],
      contenido: [],
      tablaruts: [],
      convenios: [],
      ptosrecaudo: [],
      empresa: [],
      data_change: [],
      dialogomotivo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoactualiza: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      itemstipocontrato: [
        { text: "Capitado", value: 2 },
        { text: "Evento", value: 1 },
      ],
      itemstipoorden: [
        { text: "No aplica", value: 0 },
        { text: "Mipres", value: 1 },
        { text: "Voucher", value: 2 },
        { text: "Masiva", value: 3 },
      ],

      search: "",
      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Sede", align: "left", value: "agencia_rep" },
        { text: "Consecutivo", align: "center", value: "consec_rep" },
        { text: "Paciente", align: "center", value: "descrpaciente_rep" },
        { text: "Id Paciente", align: "center", value: "idpac_rep" },
        { text: "Dispensa", align: "center", value: "elabora_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      errores: {
        puntos: false,
        motivo: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.get_empresa();
    this.cargaragencias();
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
          this.idusuario = parseFloat(sessionStorage.Sesion.substr(15, 15));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    async editar_item(item) {
      this.item_sel = item;
      await this.get_dispensa(item);
      this.dialogoactualiza.estado = true;

      console.log(this.data_change)
      this.form.autorizacion = this.data_change.autorizacion.trim();
      this.form.fechaauto = this.data_change.fechaautoriza;
      this.form.copago = this.data_change.copago.replace(/\,/g, "").trim();
      this.form.cuotam = this.data_change.moderadora.replace(/\,/g, "").trim();
      this.form.fechapte = this.data_change.fechamantis
        .replace(/\,/g, "")
        .trim();
      var busqueda_tipoorden = this.itemstipoorden.find(
        (el) => el.value == this.data_change.codtipoorden
      );
      this.form.tipoorden = busqueda_tipoorden;

      var busqueda_tipocontr = this.itemstipocontrato.find(
        (el) => el.value == this.data_change.codtipocontrato
      );
      this.form.tipocontr = busqueda_tipocontr;
      this.form.diagnostico = this.data_change.dx;


    },
    async get_dispensa(item) {
      return new Promise((resolve) => {
        let agencia = item.idagenc_rep;
        let consecutivo = item.consec_rep;

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          consecutivo +
          "|" +
          "1" +
          "|";
        post
          .postData({
            url: "Dispensa/dlls/PrDispensa01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            resolve((this.data_change = data[0]));
            // this.data_change = data[0];
          })
          .catch((err) => {
            console.log(err);
            this.send_error("Error al consultar Dispensacion");
          });
      });
    },
    anular_item(item) {
      this.dialogomotivo.estado = true;
      this.item_sel = item;
    },
    grabar_change() {
      this.dialogoactualiza.estado = false;
      let agencia = this.item_sel.idagenc_rep;
      let consecutivo = this.item_sel.consec_rep;
      let autorizacion = this.form.autorizacion.trim();
      let copago = this.form.copago;
      let cmodera = this.form.cuotam;
      let fechapte = this.form.fechapte.replace(/\-/g, "").trim();
      let fechaauto = this.form.fechaauto.replace(/\-/g, "");
      let tipoorden = this.form.tipoorden.value;
      let tipocontr = this.form.tipocontr.value;
      let diagnostico = this.form.diagnostico;
      let nroentrega = this.form.nroentrega;
      let observ = this.form.observ;

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        autorizacion +
        "|" +
        fechaauto +
        "|" +
        copago +
        "|" +
        cmodera +
        "|" +
        fechapte +
        "|" +
        tipoorden +
        "|" +
        tipocontr +
        "|" +
        diagnostico +
        "|" +
        nroentrega +
        "|" +
        observ +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensaM.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Procesado",
            estado: true,
          });
          this.consultar_reporte();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al Actualizar Dispensacion");
        });
    },
    async grabar_anular() {
      let agencia = this.item_sel.idagenc_rep;
      let consecutivo = this.item_sel.consec_rep;
      let motivo = this.form.motivo.trim();
      this.dialogomotivo.estado = false

      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        agencia +
        "|" +
        consecutivo +
        "|" +
        motivo +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrAnulaDispensa.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Procesado",
            estado: true,
          });
          this.consultar_reporte();
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },
    async printdispos_item(item, tipo) {
      let agencia = item.idagenc_rep;
      let consecutivo = item.consec_rep;

      var datosEnvio =
        sessionStorage.Sesion + "|" + agencia + "|" + consecutivo + "|";
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa01J.dll",
          data: datosEnvio,
          method: "",
        })
        .then(async (data) => {
          if (tipo == 0) {
            data = data[0];
            var logo_src = require(`../../assets/image/clientes/${parseFloat(
              sessionStorage.Sesion.substr(0, 15)
            )}.png`);

            this.pdfs.getBase64(logo_src).then((logo) => {
              data.logo = logo;
              dispensacion_pos(data).then(() => {
                console.log("Impresión terminada");
              });
            });
          } else {
            this.data_change = data[0];
          }
        })
        .catch((err) => {
          console.log(err);
          this.send_error("Error al imprimir Dispensacion");
        });
    },

    cargaragencias: function () {
      post
        .postData({
          url: "Financiero/dlls/CfAgenciasJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
          this.ptosrecaudo.unshift({
            codigo_agc: "0",
            descripcion_agc: "Todas",
          });

          this.form.ptosrecaudo = {
            codigo_agc: "0",
            descripcion_agc: "Todas",
          };
        })
        .catch((err) => {
          this.send_error("Error al cargar Sedes");
        });
    },
    format_ptos(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Bloqueado";
    },
    consultar_reporte() {
      if (!this.form.puntos) {
        this.errores.puntos = true;
        this.send_error("Selecciona una sede");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
        let punto = this.form.puntos.codigo_agc;
        let ressede = this.form.ressede ? 1 : 0;
        let resfunc = this.form.resfunc ? 1 : 0;

        this.contenido = [];
        let data = [
          sessionStorage.Sesion,
          fechaInicial,
          fechaFinal,
          punto,
          ressede,
          resfunc,
        ];
        this.postData({
          url: "dispensa/dlls/RpDispensa01J.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            data.pop();
            this.contenido = JSON.parse(JSON.stringify(data));

            if (this.form.ressede) this.graficar(this.contenido);
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
    calcular_final() {
      this.form.fechaFinal = this.form.fechaInicial;
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
