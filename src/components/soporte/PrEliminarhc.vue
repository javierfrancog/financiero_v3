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
                >Eliminar historia Clinica</v-list-item-title
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
                  @keyup.enter="focusNextField('ciudad')"
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
                  id="ciudad"
                  @keyup.enter="focusNextField('paciente')"
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
                  label=" Paciente"
                  clearable
                  outlined
                  type="text"
                  required
                  id="paciente"
                  @keyup.enter="focusNextField('consec')"
                  v-model="form.paciente"
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
                  @keyup.enter="validar()"
                  id="consec"
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

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Fecha"
                  clearable
                  outlined
                  disabled
                  required
                  v-model="form.fecha"
                  hide-details
                ></v-text-field>
              </v-col>

            </v-row>

            <v-divider></v-divider>
            <v-row justify="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
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
              @click="eliminar()"
              >Eliminar</v-btn
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      form: {
        benefic: null,
      },
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
    eliminar: function () {
      let eliminar = this.form.eliminar ? "1" : "0";

      if (eliminar == 1) {
        let id = this.form.id.trim();
        let ciudad = this.form.ciudad.trim();
        let paciente = this.form.paciente.trim();
        let nro = this.form.consec.trim();
        post
          .postData({
            url: "Financiero/dlls/SopElimHc.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              id +
              "|" +
              paciente +
              "|" +
              nro +
              "|" +
              ciudad +
              "|",

            method: "",
          })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: "Documento Eliminado",
              estado: true,
            });
            this.disabled.eliminar = true;
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al Eliminar Registro");
          });
      }
    },
    validar() {
      this.form.descripcion = "";
      this.form.benefic = null;
      this.form.fecha = null;
      this.form.eliminar = false;

      let id = this.form.id.trim();
      let ciudad = this.form.ciudad.trim();
      let paciente = this.form.paciente.trim();
      let nro = this.form.consec.trim();
      post
        .postData({
          url: "Financiero/dlls/SopElimHcJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            id +
            "|" +
            paciente +
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
          this.form.fecha = data[0].fecha_rep.trim();

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
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
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
