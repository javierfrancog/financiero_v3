<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-bus-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Listado de Cargues</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar Cargues
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
                  :min="form.activacion"
                  v-model="form.fecha"
                  @input="
                    pickerFecha = false;
                    errores.fecha = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
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
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch
                v-model="abiertos"
                label="Solo Cargues Abiertos"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" md="6">
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
              class="elevation-1"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>
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
            <v-col cols="12" md="5">
              <v-autocomplete
                label="Vehiculo"
                :items="placas"
                outlined
                clearable
                :item-text="format_placas"
                v-model="form.vehiculo"
                @change="consultar_vencimiento()"
                :error="errores.vehiculo"
                @input="errores.vehiculo = false"
                hide-details
                item-value="value"
                return-object
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="7">
              <v-autocomplete
                :items="conductores"
                label="Conductor principal"
                outlined
                clearable
                :item-text="format_conductores"
                hide-details
                v-model="form.conductor"
                item-value="value"
                return-object
                :error="errores.conductor"
                @input="errores.conductor = false"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="embarques"
                label="Origen"
                outlined
                clearable
                :item-text="format_embarques"
                hide-details
                v-model="form.origen"
                item-value="value"
                return-object
                required
                :error="errores.origen"
                @input="desactivarErroresEmbarques('origen')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="embarques"
                label="Destino"
                outlined
                clearable
                :item-text="format_embarques"
                hide-details
                v-model="form.destino"
                item-value="value"
                return-object
                :error="errores.destino"
                @input="desactivarErroresEmbarques('destino')"
              ></v-autocomplete>
            </v-col>

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
                  :min="form.activacion"
                  v-model="form.fecha"
                  @input="
                    pickerFecha = false;
                    errores.fecha = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col class="d-flex" cols="12" md="5">
              <v-autocomplete
                :items="horarios"
                label="Horario"
                outlined
                clearable
                :item-text="format_horarios"
                hide-details
                v-model="form.horario"
                item-value="value"
                return-object
                required
                :error="errores.horario"
                @input="errores.horario = false"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col cols="12">
              <p class="text-subtitle-1">Estado</p>
              <v-switch v-model="form.estado" inset label="activo"></v-switch>
            </v-col> -->
          </v-row>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-col class="mb-4" cols="3">
              <v-text-field
                label="Pendiente Recaudo"
                v-model="form.pendiente"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex mb-4">
            <v-col class="mb-4" cols="4">
              <v-text-field
                label="Autorizado por:"
                v-model="form.autoriza"
                :error="errores.autoriza"
                @input="errores.autoriza = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                :items="motivo"
                label="Motivo"
                clearable
                return-object
                hide-details
                v-model="form.motivo"
                :error="errores.motivo"
                @input="errores.motivo = false"
                @change="select_motivo()"
                required
              ></v-select>
            </v-col>
            <v-col class="mb-4" cols="3" v-if="this.motivo_select == 1">
              <v-text-field
                label="Valor Pagado"
                v-model="form.valorpago"
                :error="errores.valorpago"
                @input="errores.valorpago = false"
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
            @click="
              dialogo.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            :disabled="disabled.grabar"
            @click="guardar()"
            >Guardar</v-btn
          >

          <v-btn
            class="ma-2 white--text"
            color="purple"
            depressed
            large
            :disabled="disabled.grabar"
            @click="get_cartera()"
            >Ver Cartera
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogocart.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-data-table
              :headers="headers_cart"
              :items="tab_cartera"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
            </v-data-table>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            large
            @click="dialogocart.estado = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

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

      dialogocart: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      pickerFecha: false,
      abiertos: null,

      placas: [],
      conductores: [],
      embarques: [],
      fechas: [],
      horarios: [],

      disabled: {
        grabar: true,
      },
      motivo: [
        { text: "Acuerdo de Pago", value: 1 },
        { text: "Gerencia", value: 2 },
        { text: "Rodamiento", value: 3 },
      ],

      btnEnvio: {
        loader: false,
        disabled: false,
      },
      motivo_select: 0,

      expanded: [],
      contenido: [],
      tab_cartera:[],
      search: "",
      form: {
        pendiente: 0,
        motivo: null,
        autoriza: null,
        valorpago: null,
      },

      headers: [
        { text: "Id Cargue", align: "center", value: "id_cargue" },
        { text: "Agencia", align: "center", value: "agencia_cargue" },
        { text: "Hora_Salida", align: "center", value: "horario_cargue" },
        { text: "Id_Interno", align: "center", value: "nrointer_cargue" },
        { text: "Placa", align: "center", value: "placa_cargue" },
        { text: "Conductor", align: "center", value: "desconductor_cargue" },
        { text: "Estado", align: "center", value: "estado_cargue" },
        { text: "Origen", align: "center", value: "origen_cargue" },
        { text: "Destino", align: "center", value: "destino_cargue" },
        { text: " ", align: "center", value: "action" },
      ],
      headers_cart: [
        { text: "Vlr Diario", align: "center", value: "vlrdiario_rep" },
        { text: "Vlr Seguro", align: "center", value: "vlrseguro_rep" },
        { text: "Vlr Admon", align: "center", value: "vlradmon_rep" },
        { text: "Vlr Fondo", align: "center", value: "vlrfondo_rep" },
        { text: "Vlr Fondo R", align: "center", value: "vlrfondor_rep" },
        { text: "Vlr R.P.C", align: "center", value: "vlrrpc_rep" },
        { text: "Vlr Excluido", align: "center", value: "vlrexc_rep" },
        { text: "Vlr Cartera", align: "center", value: "vlrcartera_rep" },
        // { text: "Vlr Producido", align: "center", value: "vlrprod_rep" },
        { text: "Vlr Saldo", align: "center", value: "saldo_rep" },
      ],
      errores: {
        autoriza: false,
        motivo: false,
      },
      card_estado: false,
      embarquesIguales: false,
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    this.cargarcontenido();
    this.cargar("placas", "Transporte/dlls/PrVehiculosJ.dll", "Vehículos");
    this.cargar(
      "conductores",
      "Financiero/dlls/Cfrutsj.dll",
      "Conductores principales"
    );
    this.cargar("embarques", "/transporte/dlls/PrembarquesJ.dll", "Embarques");
    this.cargar("horarios", "/transporte/dlls/PrhorariosJ.dll", "Horarios");
  },
  methods: {
    get_cartera (){
      this.dialogocart.estado = true;
    },
    select_motivo() {
      this.motivo_select = this.form.motivo.value;
    },
    consultar_vencimiento() {
      this.loader = true;
      this.disabled.grabar = true;
      let placa = this.form.vehiculo.placa_veh;
      post
        .postData({
          url: "Transporte/dlls/PrVenceJ.dll",
          data: sessionStorage.Sesion + "|" + placa + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.disabled.grabar = false;
          this.asignar_conductor();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    async asignar_conductor() {
      if (this.form.vehiculo) {
        this.conductores.forEach((cond) => {
          if (cond.identificacion_rut == this.form.vehiculo.idcond1_veh) {
            this.form.conductor = cond;
            if (this.errores.conductor) this.errores.conductor = false;
          }
        });
        await this.validar_saldo();
      }
    },
    async validar_saldo() {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      let placa = this.form.vehiculo.placa_veh;
      this.form.pendiente = 0;
      this.tab_cartera = [];

      if (agencia == "0001" || agencia == "0002" || agencia == "0007") {
        post
          .postData({
            url: "Transporte/dlls/PrSaldoJ.dll",
            data: sessionStorage.Sesion + "|" + placa + "|",
            method: "",
          })
          .then((data) => {
            this.form.pendiente = data[0].saldo_rep.trim();
            this.tab_cartera = JSON.parse(JSON.stringify(data));
            console.log(this.tab_cartera)
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: err.Mensaje[0].msg,
              estado: true,
            });
          });
      }
    },
    desactivarErroresEmbarques(emb) {
      if (this.embarquesIguales) {
        this.errores.origen = false;
        this.errores.destino = false;
        this.embarquesIguales = false;
      } else this.errores[emb] = false;
    },
    cargar(cosa, url, msg) {
      this.loader = true;
      post
        .postData({
          url,
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this[cosa] = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar " + msg,
            estado: true,
          });
        });
    },
    format_placas: function (val) {
      return `${parseFloat(val.nrointer_veh)} - ${val.placa_veh.trim()}`;
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
      let camposllenos = true;
      let pendiente = parseFloat(data.pendiente);
      // pendiente = 0;

      Object.keys(this.errores).forEach((el) => {
        this.validarCampo(el, data);
        if (this.errores[el]) camposllenos = false;
      });

      if (camposllenos) {
        if (data.origen.id_emb == data.destino.id_emb) {
          this.errores.origen = true;
          this.errores.destino = true;
          this.send_error("Origen y destino no pueden ser iguales!");
          this.embarquesIguales = true;
        } else if (pendiente > 0) {
          if (!data.autoriza) {
            this.errores.autoriza = true;
            this.send_error("Debe indicar quien Autoriza");
          } else if (!data.motivo) {
            this.errores.motivo = true;
            this.send_error("Debe seleccionar un motivo");
          } else {
            this.format_envio(data);
          }
        } else {
          this.format_envio(data);
        }
      }
    },

    format_envio(data) {
      let punto_taquilla = sessionStorage.llave_punto;
      let punto = JSON.parse(atob(punto_taquilla));
      let agencia = punto.id;
      this.card_estado = true;
      let fecha = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      let valor = data.pendiente ? data.pendiente.replace(/\,/g, "") : "0";
      let placa = data.vehiculo.placa_veh.trim();
      let conductor = data.conductor.identificacion_rut;
      let horario = data.horario.id_hor;
      let origen = data.origen.id_emb;
      let destino = data.destino.id_emb;
      let autoriza = data.autoriza ? data.autoriza.trim() : "";
      let valorpago = data.valorpago ? data.valorpago.trim() : "";
      let motivo = data.motivo ? data.motivo.value : "0";
      let datos = {
        url: "Transporte/dlls/PrCarguesV.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          "0" +
          "|" +
          fecha +
          "|" +
          placa +
          "|" +
          conductor +
          "|" +
          "0" +
          "|" +
          horario +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          origen +
          "|" +
          destino +
          "|" +
          agencia +
          "|" +
          autoriza +
          "|" +
          motivo +
          "|" +
          valor +
          "|" +
          valorpago +
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

          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((error) => {
          let msg_error = error.Mensaje[0].msg;
          this.card_estado = false;
          this.send_error(msg_error);
        });
    },
    agregar_item() {
      this.init_form();
      // this.form.estado = true;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.form.fecha = this.form.activacion;
      this.dialogo.titulo = "Agregar nuevo Cargue";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {};
      this.errores = {
        vehiculo: false,
        conductor: false,
        origen: false,
        destino: false,
        fecha: false,
        horario: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let abiertos = this.abiertos ? 1 : 0;

      post
        .postData({
          url: "Transporte/dlls/PrCargues2VJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + abiertos + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
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
