<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-auto-mode</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Restaura Dlls</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="12">
                <v-btn
                  class="ma-2 white--text"
                  color="indigo"
                  depressed
                  large
                  @click="restaurar()"
                  >validar</v-btn
                >
              </v-col>
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
      },
      disabled: {
        eliminar: true,
      },

      card_estado: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    async restaurar() {
      var formData = new FormData();
      const response = await fetch(
        "https://server1ts.net/financiero/inc/CopyDll.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());

      this.$emit("snack", {
        color: "success",
        text: "Factura Enviada Correctamente",
        estado: true,
      });
    },

    xrestaurar() {
      post
        .postData({
          url: "Financiero/dlls/CopyDll.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          console.log(data);
          this.loader = false;
          this.disabled.eliminar = false;
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
