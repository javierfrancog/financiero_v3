<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-calendar-multiple-check</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Bloquear Fecha Historia Clinica cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center">
              <span style="font-size: 16px; font-weight: bold" class="mr-3"
                >Bloquea el cambio de fecha en la elaboración de la historia
                clínica</span
              >
            </v-row>

            <v-row class="d-flex mb-4 justify-center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="form.bloquear"
                  @change="get_bloqueo()"
                  :label="
                    form.bloquear ? 'Fecha Bloqueada' : 'Fecha Desbloqueada'
                  "
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  FlowerSpinner,

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      form: {
        bloquear: null,
      },
      drawer: false,
    };
  },
  created() {
    this.cargar_empresa();
  },
  methods: {
    get_bloqueo() {
      this.loader = true;
      let estado = this.form.bloquear ? 1 : 0;
      post
        .postData({
          url: "Clinico/dlls/PrBloqueohc.dll",
          data: sessionStorage.Sesion + "|" + estado + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargar_empresa();

          this.$emit("snack", {
            color: "success",
            text: "Estado de la historia clínica actualizado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar la solicitud",
            estado: true,
          });
        });
    },
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          if (data[0].bloqueohc_empr == 1) {
            this.form.bloquear = true;
          } else this.form.bloquear = false;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
  },
};
</script>
