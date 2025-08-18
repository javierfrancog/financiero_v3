<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-credit-card-off-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Bloqueo Recaudos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      outlined
                      v-on="on"
                      :error="errores.fecha"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="pickerFecha = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-autocomplete
                  :items="ptosrecaudo"
                  label="Punto de Recaudo"
                  v-model="form.puntos"
                  :item-text="format_ptos"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="12" sm="5">
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
                  @change="errores.convenioman2 = false"
                  :error="errores.convenioman2"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-btn
                color="indigo"
                class="ma-5 white--text px-12"
                large
                depressed
                @click="consultar()"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </div>
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
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              disable-pagination
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="bloquear_pago(item)"
                      :color="`${item.estado_rep == '1' ? 'red' : 'green'}`"
                      fab
                      small
                      icon
                      v-on="on"
                      outlined
                    >
                      <v-icon>{{
                        item.estado_rep == "1"
                          ? "mdi-lock-off-outline"
                          : "mdi-lock-open-outline"
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{
                    item.estado_rep == "1"
                      ? "Desbloquear Pago"
                      : "Bloquear Pago"
                  }}</span>
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
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      convenios: [],
      ptosrecaudo: [],
      pickerFecha: false,
      search: "",
      puntos: "",

      form: {},
      headers: [
        { text: "Cajero", align: "left", value: "cajero_rep".trim() },
        { text: "Hora", align: "center", value: "hora_rep" },
        { text: "Factura", align: "left", value: "factura_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Estado", align: "left", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargaragencias();
    this.consultar_convenios();
    (this.form.fecha = this.$moment().format("YYYY-MM-DD")),
      (this.dialogo.estado = false);
  },
  computed: {},
  methods: {
    bloquear_pago(item) {
      var agencia = this.form.puntos.ciudad_agc;
      var fecha = this.form.fecha.replace(/\-/g, "");
      var entidad = this.form.convenio.cod_rep;
      var factura = item.factura_rep;
      var tipo = item.estado_rep;

      let data = [
        sessionStorage.Sesion,
        agencia,
        fecha,
        entidad,
        factura,
        tipo,
      ];
      this.postData({
        url: "Recaudos/dlls/PrBloqueo.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: data[0].msg,
            estado: true,
          });
          this.consultar();
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al Bloquear Pago",
            estado: true,
          });
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
    format_convenios(val) {
      return `${parseInt(val.cod_rep) || 0} - ${val.descrip_rep.trim()}`;
    },

    cargaragencias: function () {
      post
        .postData({
          url: "Recaudos/dlls/CfAgenciasJ.dll",
          data: 0 + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Puntos de Recaudo");
        });
    },
    consultar: function () {
      this.loader = true;
      var fecha = this.form.fecha.replace(/\-/g, "");
      var agencia = this.form.puntos.codigo_agc;
      var convenio = this.form.convenio.cod_rep;
      this.contenido = [];
      post
        .postData({
          url: "Recaudos/dlls/PrBloqueoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            convenio +
            "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = data;
        })
        .catch((err) => {
          this.loader = false;
          this.send_error(err.Mensaje[0].msg);
        });
    },

    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fechaInicial) {
        this.errores.fechacierre = true;
        this.send_error("Fecha Cierre Obligatoria!");
      } else if (!data.efectivo) {
        this.errores.efectivo = true;
        this.send_error("Efectivo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var fecha = this.form.fechaInicial.replace(/\-/g, "");
      var punto = this.form.punto.substr(0, 4);
      var efectivo = this.form.efectivo.replace(/\,/g, "");
      var cantidad = this.form.cantidad.replace(/\,/g, "");
      let datos = {
        url: "Recaudos/dlls/PrCierrepto.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          punto +
          "|" +
          efectivo +
          "|" +
          cantidad +
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
          this.consultar();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.operador = sessionStorage.User;
      this.form.fecha = this.form.fechaInicial;
      let punto_recaudo = sessionStorage.llave_punto;
      let data = JSON.parse(atob(punto_recaudo));

      this.form.punto = data.id + "_" + data.text;

      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {};

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
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
