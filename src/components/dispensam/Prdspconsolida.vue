<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-set-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Proceso de Consolidación</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
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
                  label="Periodo"
                  hide-details
                  outlined
                  :error="errores.fechaInicial"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechaInicial"
                scrollable
                no-title
                type="month"
                :error="errores.fechaInicial"
                @change="pickeFechaIni = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="3">
            <v-btn
              color="indigo darken-3 white--text"
              class="white--text px-12"
              large
              depressed
              @click="consultar_reporte"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Procesar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-3" color="#FF6F00"></v-divider>
        <div class="pa-0 px-8"></div>
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
import { precargue } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      styleObject: { border: "2px solid #01579B" },

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
        metodo: null,
        index: null,
      },
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      disabled: {
        grabar: true,
        imprimir: true,
        error_saldo: true,
      },

      dialogPicker: false,
      dialogPickervence: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      singleExpand: true,
      pickerPeriodo: false,
      error_saldo: 0,
      edit_index: 0,
      contenido: [],
      agencias: [],
      medicamentos: [],
      moleculas: [],
      ubicasolic: [],
      ubica: [],
      formTitle: "",
      search: "",
      searchprod: null,
      form: {},
      drawer: false,
      detalle: [],
      empresa: [],

      card_estado: false,
      load: {
        btn_enviar: false,
        impresion: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },

      errores: {
        ubica_destino: false,
        moleculas: false,
        fechaFinal: false,
        fechaInicial: false,
      },
      headers: [
        { text: "Descripción", align: "center", value: "consec_rep" },
        { text: "Sede", align: "center", value: "descrpaciente_rep" },
        { text: "Cantidad", align: "center", value: "elabora_rep" },
        { text: "Consumo", align: "center", value: "descripeps_rep" },

        { text: "Saldo", align: "center", value: "autorizacion_rep" },
        { text: "Deficit", align: "center", value: "estado_rep" },
      ],
      card: {
        loader: false,
        estado: false,
        disabled: false,
      },
      comprobante: null,
    };
  },

  created() {
    this.loader = false;
    this.get_empresa();
  },
  methods: {
    async consultar_reporte() {
      if (!this.form.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Selecciona un periodo");
      } else {
        await this.get_reporte();
        await this.consolidar_2();
        await this.consolidar_3();
        await this.consolida_ptes();
        await this.consolida_ptes2();
      }
    },

    async get_reporte() {
      this.loader = true;
      var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      let data = [sessionStorage.Sesion, fechaInicial];

      this.postData({
        url: "dispensa/dlls/PrConsolida.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then(async (data) => {
          this.loader = false;
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
    },
    async consolidar_2() {
      if (!this.form.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Selecciona un periodo");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let data = [sessionStorage.Sesion, fechaInicial];
        this.postData({
          url: "dispensa/dlls/PrConsolida2.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: data[0],
              estado: true,
            });
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
    async consolidar_3() {
      if (!this.form.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Selecciona un periodo");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let data = [sessionStorage.Sesion, fechaInicial];
        this.postData({
          url: "dispensa/dlls/PrConsolida3.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: data[0],
              estado: true,
            });
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
    async consolida_ptes() {
      if (!this.form.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Selecciona un periodo");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let data = [sessionStorage.Sesion, fechaInicial];
        this.postData({
          url: "dispensa/dlls/Consolidaptes.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: data[0],
              estado: true,
            });
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
    async consolida_ptes2() {
      if (!this.form.fechaInicial) {
        this.errores.fechaInicial = true;
        this.send_error("Selecciona un periodo");
      } else {
        this.loader = true;
        var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
        let data = [sessionStorage.Sesion, fechaInicial];
        this.postData({
          url: "dispensa/dlls/Consolidaptes2.dll",
          data: data.join("|") + "|",
          method: "",
        })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: data[0],
              estado: true,
            });
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
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
