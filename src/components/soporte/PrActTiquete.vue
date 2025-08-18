<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-alien</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualiza Estado de Tiquete</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
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

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label=" Tiquete"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.consecutivo"
                  @keyup.enter="validar()"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-3"></v-divider>

            <v-row class="d-flex">
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch v-model="form.estado" label="Estado"></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2 white--text"
              color="indigo"
              depressed
              large
              @click="validar()"
              >validar</v-btn
            >

            <v-btn
              :disabled="disabled.eliminar"
              color="red"
              depressed
              large
              class="ma-2 white--text"
              @click="grabar()"
              >Grabar</v-btn
            >
          </v-card-actions>
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
      loader: false,
      pickerFecha: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      form: {
        puntos: null,
        estado: false,
      },
      ptosrecaudo: [],
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      disabled: {
        eliminar: true,
      },

      card_estado: false,
    };
  },
  created() {
    this.cargaragencias();
  },
  computed: {},
  methods: {
    grabar(item) {
      let tiquete = this.form.consecutivo.trim();
      let agencia = this.form.puntos.id_agc;
      post
        .postData({
          url: "/transporte/dlls/PrAnulaTiq.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          this.validar();
          this.$emit("snack", {
            color: "success",
            text: "Proceso correcto",
            estado: true,
          });
        })
        .catch((err) => {
          console.log("Error", err);
          this.loaderTable = false;
          this.send_error("Error al anular el tiquete");
        });
    },

    cargaragencias: function () {
      post
        .postData({
          url: "Transporte/dlls/CfAgencias00J.dll",
          data:
            "0000008920001130000000860072432021010711510301" +
            "|" +
            "901" +
            "|",
          method: "",
        })
        .then((data) => {
          this.ptosrecaudo = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    validar() {

      let tiquete = this.form.consecutivo.trim();
      let agencia = this.form.puntos.id_agc;
      post
        .postData({
          url: "/transporte/dlls/PrTiquetesJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|" + tiquete + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          this.form.estado = false;
          this.disabled.eliminar = false


          if (data.estado_tiq == 0) {
            this.form.estado = true;
          }
        });
    },
    format_ptos(val) {
      return `${val.descrip_agc}`;
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
