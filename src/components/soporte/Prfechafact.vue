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
                >Actualiza Fecha Factura</v-list-item-title
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
                  label="Prefijo"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.pref"
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
            <v-row>
              <v-col cols="3">
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
                      v-model="form.fecha_fact"
                      label="Fecha Factura"
                      prepend-inner-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_fact"
                    @input="pickerFecha = false"
                  ></v-date-picker>
                </v-menu>
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
    grabar: function () {
      let id = this.form.id.trim();
      let ciudad = this.form.ciudad.trim();
      let agencia = this.form.agencia.trim();
      let pref = this.form.pref.trim();
      let nro = this.form.consec.trim();
      let fecha = this.form.fecha_fact.replace(/\-/g, "")
      post
        .postData({
          url: "Financiero/dlls/SopFechafact.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            id +
            "|" +
            agencia +
            "|" +
            pref +
            "|" +
            nro +
            "|" +
            ciudad +
            "|" +
            fecha +
            "|",

          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Documento Actualizado",
            estado: true,
          });
          this.disabled.eliminar = true;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al Actualizar Registro");
        });
    },
    validar() {
      this.form.descripcion = "";
      this.form.benefic = "";
      this.form.eliminar = false;

      let id = this.form.id.trim();
      let ciudad = this.form.ciudad.trim();
      let agencia = this.form.agencia.trim();
      let pref = this.form.pref.trim();
      let nro = this.form.consec.trim();
      post
        .postData({
          url: "Financiero/dlls/SopElimfactJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            id +
            "|" +
            agencia +
            "|" +
            pref +
            "|" +
            nro +
            "|" +
            ciudad +
            "|",
          method: "",
        })
        .then((data) => {
          // console.log(data)
          this.form.descripcion = data[0].emisor_rep.trim();
          this.form.benefic = data[0].receptor_rep.trim();
          this.form.fecha_fact = data[0].fecha_rep;

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
