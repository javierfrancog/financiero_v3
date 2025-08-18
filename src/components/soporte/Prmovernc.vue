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
                >Mover Nota Crédito</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Id_Cliente"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.id"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label=" Ciudad"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.ciudad"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="8">
                <v-text-field
                  label="Empresa"
                  clearable
                  outlined
                  disabled
                  required
                  v-model="form.descripcion"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label=" Agencia"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.agencia"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Consecutivo"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.consec"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  label="Beneficiario"
                  clearable
                  outlined
                  disabled
                  required
                  v-model="form.benefic"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row>
              <v-btn
                class="ma-4 white--text"
                color="indigo"
                depressed
                large
                @click="validar()"
                >validar</v-btn
              >
              <v-col class="d-flex" cols="4">
                <v-text-field
                  label="Consecutivo Final"
                  clearable
                  outlined
                  type="text"
                  required
                  :disabled="disabled.consecfinal"
                  v-model="form.consecfinal"
                  hide-details
                  :error="errores.consecfinal"
                    @input="errores.consecfinal = false"
                ></v-text-field>
              </v-col>

              <v-btn
                :disabled="disabled.eliminar"
                color="red"
                depressed
                large
                class="ma-4 white--text"
                @click="get_change()"
                >Procesar</v-btn
              >
            </v-row>
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      form: {},
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        consecfinal: false,
      },
      disabled: {
        eliminar: true,
        consecfinal: true,
      },

      card_estado: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    get_change: function () {
      let nro = this.form.consec.trim();
      let consecfinal = this.form.consecfinal.trim();

      if (consecfinal < 1) {
        this.errores.consecfinal = true;
        this.send_error("Consecutivo final Obligatori!");
      } else {
        let id = this.form.id.trim();
        let ciudad = this.form.ciudad.trim();

        let agencia = this.form.agencia.trim();

        post
          .postData({
            url: "Financiero/dlls/PrmoverNc.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              id +
              "|" +
              ciudad +
              "|" +
              agencia +
              "|" +
              nro +
              "|" +
              consecfinal +
              "|",
            method: "",
          })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: "Documento Procesado",
              estado: true,
            });
            this.form.consec = 0;
            this.disabled.eliminar = true;
            this.disabled.consecfinal = true;
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al Eliminar Registro");
          });
      }
    },
    validar() {
      this.form.descripcion = "";
      this.form.benefic = "";

      let id = this.form.id.trim();
      let ciudad = this.form.ciudad.trim();
      let agencia = this.form.agencia.trim();
      let nro = this.form.consec.trim();
      post
        .postData({
          url: "Financiero/dlls/PrmoverNcJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            id +
            "|" +
            ciudad +
            "|" +
            agencia +
            "|" +
            nro +
            "|",
          method: "",
        })
        .then((data) => {
          // console.log(data)
          this.form.descripcion = data[0].emisor_rep.trim();
          this.form.benefic = data[0].receptor_rep.trim();

          this.loader = false;
          this.disabled.eliminar = false;
          this.disabled.consecfinal = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].Msg,
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
