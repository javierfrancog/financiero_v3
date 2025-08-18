<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cash-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content> 
              <v-list-item-title class="headline"
                >Cierre de Caja--</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="mb-8 justify-center">
              <v-col cols="12" sm="6" md="3">
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
              <v-col class="d-flex" cols="12" sm="6" md="3">
                <v-text-field
                  label="Operador"
                  v-model="form.operador"
                  outlined
                  hide-details
                  clearable
                  disabled
                  filled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6" md="2">
                <v-text-field
                  label="Turno"
                  v-model="form.turno"
                  outlined
                  hide-details
                  clearable
                  disabled
                  filled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6" md="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="consultar()"
                >
                  Consultar
                  <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mb-4" v-if="caja_estado">
              <v-col cols="12">
                <v-row class="justify-end">
                  <v-col cols="12" md="3">
                    <v-btn
                      class="ma-2 white--text"
                      color="green darken-2"
                      large
                      block
                      depressed
                      @click="consultar_anexo()"                      
                    >
                      Descargar anexo
                      <v-icon right dark class="ml-4"
                        >mdi-file-excel-box</v-icon
                      >
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="justify-center mt-0">
                  <v-col cols="12" md="8">
                    <v-row class="text-body-1 font-weight-medium" no-gutters>
                      <v-col cols="12">
                        <v-card
                          class="py-4 d-flex justify-center"
                          tile
                          outlined
                        >
                          CIERRE DE CAJA
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-card class="pa-2" tile outlined>
                          Fecha: {{ contenido.fecha_cua }}</v-card
                        >
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card class="pa-2" tile outlined>
                          Turno: {{ contenido.turno_cua }}</v-card
                        >
                      </v-col>
                      <v-col cols="12">
                        <v-card class="pa-2" tile outlined>
                          Despachador: {{ contenido.iddespacha_cua }}
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          <span class="font-weight-regular mr-1"
                            >Tiquete inicial:
                          </span>
                          {{ contenido.tiqini_rep }}
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          <span class="font-weight-regular mr-1"
                            >RPC inicial:
                          </span>
                          0
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          <span class="font-weight-regular mr-1"
                            >Tiquete final:
                          </span>
                          {{ contenido.tiqfin_rep }}
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          <span class="font-weight-regular mr-1"
                            >RPC final:
                          </span>
                          0
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          <span class="font-weight-regular mr-1"
                            >Total tiquetes:
                          </span>
                          {{ contenido.canttiq_rep }}
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-card
                          class="py-4 d-flex justify-center"
                          tile
                          outlined
                        >
                          INGRESOS INTERMUNICIPALES
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          CONCEPTO
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-center"
                          tile
                          outlined
                        >
                          VALOR
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Saldo Inicial
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(this.saldoinicial) }}
                        </v-card>
                      </v-col>

                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Ventas
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.ventas_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Seguro
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.seguro_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          RPC
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.rpc_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Egresos
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.egresos_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Avances
                        </v-card>
                      </v-col>

                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.avances_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Redbus
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.redbus_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Gamarra
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                        ${{ formatNumero(contenido.gamarra_rep) }}
                        </v-card>
                      </v-col>

                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Tarjeta débito/Qr
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ contenido.tdebito_rep }}
                        </v-card>
                      </v-col>
                      <!-- <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Tarjeta crédito
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ contenido.tcredito_cua }}
                        </v-card>
                      </v-col> -->
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Brasilia
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.brasilia_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          Pinbus
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.pinbus_rep) }}
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card class="pa-2 d-flex justify-end" tile outlined>
                          TOTALES:
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(contenido.totales) }}
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-card
                          class="py-4 d-flex justify-center"
                          tile
                          outlined
                        >
                          EFECTIVO ENTREGADO
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2" tile outlined>
                          Denominación
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2" tile outlined> Cantidad </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2" tile outlined> Total </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $100,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.cienk.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('cienk', 100000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.cienk.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $50,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.cincuentak.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('cincuentak', 50000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.cincuentak.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $20,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.veintek.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('veintek', 20000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.veintek.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $10,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.diezk.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('diezk', 10000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.diezk.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $5,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.cincok.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('cincok', 5000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.cincok.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $2,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.dosk.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('dosk', 2000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.dosk.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          $1,000
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.unk.cantidad"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('unk', 1000)"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.unk.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          Moneda
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card class="pa-2 font-weight-regular" tile outlined>
                          <v-text-field
                            v-model="form_denom.moneda"
                            @keypress="lettersDisabled()"
                            @input="multiplicarVlr('moneda')"
                            type="number"
                            min="0"
                            outlined
                            hide-details
                            dense
                            clearable
                          ></v-text-field>
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card
                          class="pa-4 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.moneda) }}
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-card class="pa-2 d-flex justify-end" tile outlined>
                          TOTAL EFECTIVO:
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.total) }}
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-card class="pa-2 d-flex justify-end" tile outlined>
                          DIFERENCIA:
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card
                          class="pa-2 d-flex justify-end font-weight-regular"
                          tile
                          outlined
                        >
                          ${{ formatNumero(form_denom.diferencia) }}
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-col cols="12" md="9">
                    <v-textarea
                      label="Observaciones"
                      v-model="form_denom.observaciones"
                      outlined
                      hide-details
                      clearable
                      rows="2"
                      no-resize
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row class="justify-end">
                  <v-col cols="12" md="3">
                    <v-btn
                      class="ma-2 white--text"
                      color="indigo"
                      large
                      block
                      depressed
                      :disabled="!btnCerrar"
                      @click="cerrar_caja()"
                    >
                      Cerrar caja
                      <v-icon right dark class="ml-4">mdi-cash-lock</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-btn
                      class="ma-2 white--text"
                      color="teal accent-4"
                      large
                      block
                      depressed
                      @click="imprimir_caja()"
                    >
                      Imprimir
                      <v-icon right dark class="ml-4">mdi-cash-lock</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
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

<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";
import { cierre_caja } from "../../_formatos.pdf";
import { cuadre_cajatr } from "../../_formatos_trans.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      // dialogo: {
      //   estado: false,
      //   titulo: null,
      //   tipo: null,
      // },
      pickerFecha: false,
      punto_taquilla: {},
      consecutivo: "0",
      saldoinicial: "0",

      form: {},
      caja_estado: false,
      contenido: {},
      form_denom: {
        cienk: {},
        cincuentak: {},
        veintek: {},
        diezk: {},
        cincok: {},
        dosk: {},
        unk: {},
      },
      ventas: "0",
      seguro: "0",
      empresa: {},

      errores: { fecha: false },
      btnCerrar: true,
    };
  },
  created() {
    this.form.fecha = this.$moment().format("YYYY-MM-DD");
    let punto_taquilla = sessionStorage.llave_punto;
    let data = JSON.parse(atob(punto_taquilla));
    this.form.operador = sessionStorage.User;
    this.form.turno = data.turno;

    this.punto_taquilla.codigo = data.id;
    this.punto_taquilla.turno = data.turno;
    this.montar_consecutivo();
  },
  methods: {
    get_consecutivo() {
      var $this = this;
      this.load.consecutivo = true;
      var fecha = this.form.fecha.replace(/-/g, "");
      var prefijo = $this.form.pref_fact.prefijo_resd;

      post
        .postData({
          url: "financiero/dlls/PrConsecutivoJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            2 +
            "|" +
            this.form.punto_fact.codigo_agc +
            "|" +
            this.form.pref_fact.tipoper_resd +
            "|" +
            0 +
            "|" +
            fecha +
            "|" +
            prefijo +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.load.consecutivo = false;
          this.form.consecutivo = data[0].nro_cons.trim();
        })
        .catch((err) => {
          this.load.consecutivo = false;
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    consultar() {
      if (!this.form.fecha) {
        this.caja_estado = false;
        this.errores.fecha = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.loader = true;
        let fecha = this.form.fecha.replace(/\-/g, "");
        let turno = this.punto_taquilla.turno;
        let agencia = this.punto_taquilla.codigo;
        post
          .postData({
            url: "/transporte/dlls/PrCuadreVJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              fecha +
              "|" +
              turno +
              "|" +
              agencia +
              "|" +
              0 +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            this.caja_estado = true;
            this.cargar_saldo();
            this.buscar_cargues();
            this.buscar_tiquetes();
            await this.buscar_lviajes();
            this.buscar_comprobantes();
            this.btnCerrar = true;            
            // this.contenido = JSON.parse(JSON.stringify(data))[0];
            // this.form_denom = {
            //   cienk: { cantidad: parseFloat(this.contenido.cant100_cua) || 0 },
            //   cincuentak: { cantidad: parseFloat(this.contenido.cant50_cua) || 0 },
            //   veintek: { cantidad: parseFloat(this.contenido.cant20_cua) || 0 },
            //   diezk: { cantidad: parseFloat(this.contenido.cant10_cua) || 0 },
            //   cincok: { cantidad: parseFloat(this.contenido.cant5_cua) || 0 },
            //   dosk: { cantidad: parseFloat(this.contenido.cant2_cua) || 0 },
            //   unk: { cantidad: parseFloat(this.contenido.cant1_cua) || 0 }
            // };
          })
          .catch((err) => {
            this.loader = false;
            this.caja_estado = false;
            console.log(err);
          });
      }
    },

    buscar_cargues() {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      post
        .postData({
          url: "/transporte/dlls/Prcargues3VJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.btnCerrar = true;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err.Mensaje[0].msg);
          this.send_error(err.Mensaje[0].msg);
          this.btnCerrar = false;
        });
    },
    cargar_saldo: function () {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let cuenta = "1105050190";
      let agencia = this.punto_taquilla.codigo;
        
      post
        .postData({
          url: "/transporte/dlls/PrSaldoAux.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + cuenta + "|" + agencia + "|" + 1 + "|" ,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.saldoinicial = data[0].saldo
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Conceptos",
            estado: true,
          });
        });
    },
    buscar_tiquetes() {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let turno = this.punto_taquilla.turno;
      let agencia = this.punto_taquilla.codigo;
      post
        .postData({
          url: "/transporte/dlls/Prtiquetes04VJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            turno +
            "|" +
            agencia +
            "|",
          method: "",
        })
        .then((data) => {
          let tiquetes = JSON.parse(JSON.stringify(data))[0].msg.split("-");
          this.contenido = {
            ...this.contenido,
            tiqini_rep: tiquetes[0],
            tiqfin_rep: tiquetes[1],
            canttiq_rep: parseInt(tiquetes[2]),
          };
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
    async buscar_lviajes() {
      this.loader = true;
      let agencia = this.punto_taquilla.codigo;      
      let fecha = this.form.fecha.replace(/\-/g, "");
      await post
        .postData({
          url: "/transporte/dlls/RpresLViajesVJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + "0" + "|" +  agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = this.contenido = {
            ...this.contenido,
            ...JSON.parse(JSON.stringify(data))[0],
          };
          this.ventas = parseInt(data[0].ventas_rep) || 0;
          this.seguro = parseInt(data[0].seguro_rep) || 0;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });

      return true;
    },
    buscar_comprobantes() {
      this.loader = true;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let agencia = this.punto_taquilla.codigo;            
      post
        .postData({
          url: "/transporte/dlls/RpReimpcb01VJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + "0" + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = {
            ...this.contenido,
            ...JSON.parse(JSON.stringify(data))[0],
          };
          if (!this.contenido.rpc_rep) {
            this.rpc = "0";
          } else {
            this.rpc = parseFloat(this.contenido.rpc_rep.trim());
          }

          if (!this.contenido.egresos_rep) {
            this.egresos = "0";
          } else {
            this.egresos = parseFloat(this.contenido.egresos_rep.trim());
          }
          if (!this.contenido.avances_rep) {
            this.avances = "0";
          } else {
            this.avances = parseFloat(this.contenido.avances_rep.trim());
          }
          if (!this.contenido.gamarra_rep) {
            this.gamarra = "0";
          } else {
            this.gamarra = parseFloat(this.contenido.gamarra_rep.trim());
          }
          if (!this.contenido.tdebito_rep) {
            this.tdebito = "0";
          } else {
            this.tdebito = parseFloat(this.contenido.tdebito_rep.trim());
          }

          let ventas = this.ventas || 0;
          let seguro = this.seguro || 0;
          let rpc = this.rpc || 0;
          let egresos = this.egresos || 0;
          let avances = this.avances || 0;          
          let gamarra = this.gamarra || 0;      
          let tdebito = this.tdebito || 0;      
              
          
          let saldoini = this.saldoinicial || 0;
          
          ventas = ventas + seguro;

          let totales =
            parseFloat(ventas) +
            parseFloat(rpc) -
            parseFloat(egresos) -
            parseFloat(tdebito) -
            parseFloat(avances) +
            parseFloat(saldoini);
          //   -
          //   parseFloat(this.contenido.egresos_rep.trim());
          this.contenido.totales = parseFloat(totales);

          this.form_denom = {
            cienk: {},
            cincuentak: {},
            veintek: {},
            diezk: {},
            cincok: {},
            dosk: {},
            unk: {},
            diferencia: totales,
          };
        })
        .catch((err) => {
          this.loader = false;
          console.log("Comprobantes", err);
        });
    },
    consultar_anexo(){
      let fecha = this.form.fecha.replace(/\-/g, "");
      let idtaquillero = sessionStorage.Sesion.substring(16, 30);
      let turno = 0;
      let agencia = this.punto_taquilla.codigo;            
      let consecutivo = 999999999
      post
        .postData({
          url: "Transporte/dlls/RpAnexocajaJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            idtaquillero +
            "|" +
            turno +
            "|" +
            agencia +
            "|" +
            consecutivo +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenidoExcel = data;
          this.print_reporte_excel()
        })
        .catch((err) => {
          console.log(err);
          this.send_error(err.Mensaje[0].msg);
        });
    },

    print_reporte_excel() {
      var data = this.contenidoExcel;
      var data_parse = data;

      // var data_parse = data.map((el) => {
      //     let valor = parseInt(el.valor_rep.trim()) || 0;
      //     let documento = el.tipodoc_rep.trim();
      //     if (documento =="EGRESO"){
      //       valor = valor * -1
      //     } 
      //     el.valor_rep = valor;
      //   return el;
      // });

      var columnas = [
        {
          title: "Fecha",
          value: "fecha_rep",
          format: "string",          
        },
        {
          title: "Tipo Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Agencia",
          value: "agencia_rep",
          format: "string",          
        },
        {
          title: "Número",
          value: "documento_rep",
        },
        {
          title: "Ventas",
          value: "ventas_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Seguro",
          value: "seguro_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "RPC",
          value: "rpc_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Egresos",
          value: "egreso_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Avances",
          value: "avances_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Redbus",
          value: "redbus_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Pinbus",
          value: "pinbus_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },
        {
          title: "Gamarra",
          value: "gamarra_rep",
          format: "money",          
          totalsRowFunction: "sum",          
        },

      ];
      var header_format = [
        {
          text: "Anexo Cierre",
          bold: true,
          size: 16,
        },
        // `Responsable: ${this.form.placas.placa_veh}`,
        `Periodo Inicial: ${this.form.fecha}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Anexo cierre-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    multiplicarVlr(index, vlr) {
      let denominacion = this.form_denom[index];
      let total = 0;

      if (index !== "moneda") {
        denominacion.total = vlr * denominacion.cantidad;
      }

      Object.keys(this.form_denom).forEach((key) => {
        if (key.includes("k")) {
          total += this.form_denom[key].total || 0;
        }
      });
      total += parseFloat(this.form_denom.moneda) || 0;

      this.form_denom.total = total;
      this.form_denom.diferencia = this.contenido.totales - total;
    },

    montar_consecutivo() {
      let agencia = this.punto_taquilla.codigo;
      post
        .postData({
          url: "/transporte/dlls/PrconsecutivoJ.dll",
          data: sessionStorage.Sesion + "|" + "17" + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.consecutivo = data[0].nro_cons.trim();
        })
        .catch((err) => {
          console.log(err);
          this.loaderTable = false;
          this.send_error("Error al cargar consecutivos");
        });
    },
    cerrar_caja() {
      // this.loader = true;
      let data = { ...this.contenido, ...this.form_denom };
      let agencia = this.punto_taquilla.codigo;
      let consecutivo = this.consecutivo;
      let fecha = this.form.fecha.replace(/\-/g, "");
      let turno = this.punto_taquilla.turno;
      let tiq_ini = data.tiqini_rep;
      let tiq_fin = data.tiqfin_rep;
      let ventas = data.ventas_rep? data.ventas_rep.trim() : 0;
      let seguro = data.seguro_rep? data.seguro_rep.trim() : 0;
      let rpc = data.rpc_rep? data.rpc_rep.trim() : 0;
      let egresos = data.egresos_rep? data.egresos_rep.trim() : 0;
      let avances = data.avances_rep? data.avances_rep.trim() : 0;
      let redbus = data.redbus_rep? data.redbus_rep.trim() : 0;
      let pinbus = data.pinbus_rep? data.pinbus_rep.trim() : 0;
      let gamarra = data.gamarra_rep? data.gamarra_rep.trim() : 0;
      let tdebito = data.tdebito_rep? data.tdebito_rep.trim() : 0;
      
      let gtotal = data.totales || 0;
      let sdoini = this.saldoinicial || 0;
      let tcredito = "0";
      let convenios = "0";
      let monedas = data.moneda || 0;
      let cant1 = data.unk.cantidad || 0;
      let cant2 = data.dosk.cantidad || 0;
      let cant5 = data.cincok.cantidad || 0;
      let cant10 = data.diezk.cantidad || 0;
      let cant20 = data.veintek.cantidad || 0;
      let cant50 = data.cincuentak.cantidad || 0;
      let cant100 = data.cienk.cantidad || 0;
      let observacion = data.observaciones || "";
      post
        .postData({
          url: "/transporte/dlls/PrCuadrev.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            consecutivo +
            "|" +
            fecha +
            "|" +
            turno +
            "|" +
            tiq_ini +
            "|" +
            tiq_fin +
            "|" +
            ventas +
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
            tdebito +
            "|" +
            tcredito +
            "|" +
            convenios +
            "|" +
            monedas +
            "|" +
            cant1 +
            "|" +
            cant2 +
            "|" +
            cant5 +
            "|" +
            cant10 +
            "|" +
            cant20 +
            "|" +
            cant50 +
            "|" +
            cant100 +
            "|" +
            observacion +
            "|" +
            seguro +
            "|" +
            sdoini +
            "|" +
            gtotal +
            "|" +
            gamarra +
            "|",
          method: "",
        })
        .then((data) => {
          this.consecutivo = data[0];
          this.$emit("snack", {
              color: "success",
              text: "Cierre grabado correctamente",
              estado: true,
            });
            this.btnCerrar = false;
          // Impresión pdf
          cierre_caja(data[0]).then(() => {
            console.log("Impresión terminada");
          });
        });
    },
    imprimir_caja: function (item) {
      this.loader = true;
      this.caja_estado = false;      
      let consecutivo = this.consecutivo;

      // let consecutivo = "0001000000000809";
      post
        .postData({
          url: "/transporte/dlls/PrCuadre2VJ.dll",
          data: sessionStorage.Sesion + "|" + consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          let dataImpresion = JSON.parse(JSON.stringify(data));

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataImpresion[0].logo = logo;
            cuadre_cajatr(dataImpresion[0]).then(() => {
              console.log("Impresión terminada");
            });
          });
        })
        .catch((err) => {
          this.loader = false;
          console.log("err", err);
          this.send_error("Error al cargar Cierre");
        });
    },
    lettersDisabled() {
      let evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46)
        evt.preventDefault();
      else return true;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    // buscar(url, msg) {
    //   this.loader = true;
    //   let fecha = this.form.fecha.replace(/\-/g, "");
    //   post
    //     .postData({
    //       url,
    //       data: sessionStorage.Sesion + "|" + fecha + "|",
    //       method: "",
    //     })
    //     .then((data) => {
    //       this.loader = false;
    //       console.log(data);
    //     })
    //     .catch((err) => {
    //       this.loader = false;
    //       console.log(err);
    //       this.send_error("Error al cargar " + msg);
    //     });
    // },
  },
};
</script>
