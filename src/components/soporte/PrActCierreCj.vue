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
                >Actualiza cierre de Caja</v-list-item-title
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
                  label=" Nro Cierre"
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

            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Ventas"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.ventas"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Seguro"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.seguro"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Rpc"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.rpc"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Egresos"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.egresos"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Avances"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.avances"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Red Bus"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.redbus"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Pin Bus"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.pinbus"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="T.Debito / Qr"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.debito"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="mt-3" color="#FF6F00"></v-divider>
            <v-card-text class="mt-2 font-weight-bold" style="font-size: 1rem">
              EFECTIVO ENTREGADO
            </v-card-text>
            <v-row class="mt-3">
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Billetes $100 k"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.billete100k"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Billetes $50 k"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.billete50k"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Billetes $20 k"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.billete20k"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Billetes $10 k"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.billete10k"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Billetes $2 k"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.billete2k"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Valor en Monedas"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.monedas"
                  hide-details
                ></v-text-field>
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
        ventas: 0,
        seguro: 0,
        rpc: 0,
        egresos: 0,
        avances: 0,
        redbus: 0,
        pinbus: 0,
        debito: 0,
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
      console.log(this.form);
      let consecutivo = this.form.consecutivo.trim();
      let agencia = this.form.puntos.id_agc;
      let ventas = this.form.ventas;
      let seguro = this.form.seguro;
      let rpc = this.form.rpc;
      let egresos = this.form.egresos;
      let avances = this.form.avances;
      let redbus = this.form.redbus;
      let pinbus = this.form.pinbus;
      let debito = this.form.debito;
      let billete100k = this.form.billete100k;
      let billete50k = this.form.billete50k;
      let billete20k = this.form.billete20k;
      let billete10k = this.form.billete10k;
      let billete2k = this.form.billete2k;
      let monedas = this.form.monedas;

      post
        .postData({
          url: "/transporte/dlls/PrCierreCjM.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            consecutivo +
            "|" +
            ventas +
            "|" +
            seguro +
            "|" +
            rpc +
            "|" +
            egresos +
            "|" +
            avances +
            "|" +
            redbus +
            "|" +
            pinbus +
            "|" +
            debito +
            "|" +
            billete100k +
            "|" +
            billete50k +
            "|" +
            billete20k +
            "|" +
            billete10k +
            "|" +
            billete2k +
            "|" +
            monedas +
            "|",
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
      this.clear_data();
      let tiquete = this.form.consecutivo.toString().padStart(12, "0");
      let agencia = this.form.puntos.id_agc;
      post
        .postData({
          url: "/transporte/dlls/PrCuadre2VJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + tiquete + "|",
          method: "",
        })
        .then((data) => {
          data = data[0];
          this.form.estado = false;
          this.form.ventas = parseFloat(data.ventas_cua.replace(/\,/g, ""));
          this.form.seguro = parseFloat(data.seguro_cua.replace(/\,/g, ""));
          this.form.rpc = parseFloat(data.rpc_cua.replace(/\,/g, ""));
          this.form.egresos = parseFloat(data.egresos_cua.replace(/\,/g, ""));
          this.form.avances = parseFloat(data.avances_cua.replace(/\,/g, ""));
          this.form.redbus = parseFloat(data.redbus_cua.replace(/\,/g, ""));
          this.form.pinbus = parseFloat(data.pinbus_cua.replace(/\,/g, ""));
          this.form.debito = parseFloat(data.tdebito_cua.replace(/\,/g, ""));
          this.form.billete100k = parseFloat(
            data.cant100_cua.replace(/\,/g, "")
          );
          this.form.billete50k = parseFloat(data.cant50_cua.replace(/\,/g, ""));
          this.form.billete20k = parseFloat(data.cant20_cua.replace(/\,/g, ""));
          this.form.billete10k = parseFloat(data.cant10_cua.replace(/\,/g, ""));
          this.form.billete2k = parseFloat(data.cant2_cua.replace(/\,/g, ""));
          this.form.monedas = parseFloat(
            data.vlrmonedas_cua.replace(/\,/g, "")
          );
        });
    },
    format_ptos(val) {
      return `${val.descrip_agc}`;
    },
    clear_data() {
      this.form.ventas = 0;
      this.form.seguro = 0;
      this.form.rpc = 0;
      this.form.egresos = 0;
      this.form.avances = 0;
      this.form.redbus = 0;
      this.form.pinbus = 0;
      this.form.debito = 0;
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
