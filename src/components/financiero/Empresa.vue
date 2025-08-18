<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cog-transfer-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Empresa</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Mostrar
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0"> </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card
        class="px-6"
        :loading="card_estado"
        :disabled="card_estado"
        :style="styleObject"
        elevation="2"
      >
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Cuentas</v-tab>
            <v-tab>Facturación</v-tab>
            <v-tab>Observaciones Facturación</v-tab>
            <v-tab>Firmas</v-tab>
            <v-tab>Correos</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="7">
                    <v-text-field
                      label="Empresa"
                      outlined
                      hide-details
                      v-model="form.empresa"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Rut"
                      outlined
                      hide-details
                      v-model="form.rut"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Tipo Id"
                      outlined
                      hide-details
                      v-model="form.tipoid"
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Client Token"
                      outlined
                      hide-details
                      v-model="form.cltoken"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Acces Token"
                      outlined
                      hide-details
                      v-model="form.acctoken"
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Dirección"
                      outlined
                      hide-details
                      v-model="form.direccion"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Teléfono"
                      outlined
                      hide-details
                      v-model="form.telefono"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Correo General"
                      outlined
                      hide-details
                      v-model="form.correo"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-select
                      :items="consorcio"
                      label="Tipo Consorcio"
                      outlined
                      hide-details
                      return-object
                      v-model="form.consorcio"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Color 1"
                      outlined
                      hide-details
                      v-model="form.color1"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Color 2"
                      outlined
                      hide-details
                      v-model="form.color2"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Color 3"
                      outlined
                      hide-details
                      v-model="form.color3"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Color 4"
                      outlined
                      hide-details
                      v-model="form.color4"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-switch
                      v-model="form.ctrccosto"
                      label="Ctrl Reportes C.Costo"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil">
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Auxiliar_1 Cartera"
                      v-model="form.ctacartera"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctacartera"
                      @change="errores.ctacartera = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Auxiliar_2 Cartera"
                      v-model="form.ctacartera2"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.RteFte Ventas"
                      v-model="form.ctartefte"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctartefte"
                      @change="errores.ctartefte = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.RteIca Ventas"
                      v-model="form.ctarteica"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctarteica"
                      @change="errores.ctarteica = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Mayor Anticipos (por Cobrar)"
                      v-model="form.ctaant"
                      :items="tablaPuc2"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctaant"
                      @change="errores.ctaant = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Mayor Retefte (Pasivo)"
                      v-model="form.rteftepas"
                      :items="tablaPuc2"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.rteftepas"
                      @change="errores.rteftepas = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Mayor Iva (Pasivo)"
                      v-model="form.ivapas"
                      :items="tablaPuc2"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ivapas"
                      @change="errores.ivapas = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Mayor RteIca (Pasivo)"
                      v-model="form.icapas"
                      :items="tablaPuc2"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.icapas"
                      @change="errores.icapas = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.RteIva (Pasivo)"
                      v-model="form.rteivapas"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.rteivapas"
                      @change="errores.rteivapas = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.Iva Descontable 5% (Pasivo)"
                      v-model="form.ivapas5"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.Iva Descontable 19% (Pasivo)"
                      v-model="form.ivapas19"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.Proveedores(Pasivo)"
                      v-model="form.pasproveed"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Mayor Capital Social (Patrimonio)"
                      v-model="form.capital"
                      :items="tablaPuc2"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.capital"
                      @change="errores.capital = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1"> </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.Autorrenta (Activo)"
                      v-model="form.autortact"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.autortact"
                      @change="errores.autortact = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Aux.Autorrenta (Pasivo)"
                      v-model="form.autortapas"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.autortapas"
                      @change="errores.autortapas = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cta Devoluciones Ventas"
                      v-model="form.ctadctos"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctadctos"
                      @change="errores.ctadctos = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Ajuste Peso (Ingreso)"
                      v-model="form.ctaajusteing"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctaajusteing"
                      @change="errores.ctaajusteing = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Ajuste Peso (Gasto)"
                      v-model="form.ctaajustegto"
                      :items="tablaPuc4"
                      :item-text="format_cuentac"
                      item-value="cod_puc"
                      hide-details
                      return-object
                      :error="errores.ctaajustegto"
                      @change="errores.ctaajustegto = false"
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="% Autorenta"
                      outlined
                      hide-details
                      v-model="form.autocree"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="% Retefte Ventas"
                      outlined
                      hide-details
                      v-model="form.porcvtas"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-select
                      :items="obligfact"
                      label="Obligado a Facturar?"
                      outlined
                      hide-details
                      return-object
                      v-model="form.obfact"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="8" sm="8">
                    <v-autocomplete
                      label="Id Ventas Predeterminado"
                      v-model="form.clientes"
                      :items="clientes"
                      :item-text="format_clientes"
                      return-object
                      hide-details
                      clearable
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.ctrvta"
                      label="Control Minimo de  Venta"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.ivainc"
                      label="Iva incluido en Precio Venta"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.barras"
                      label="Usa Codigo de Barras"
                    ></v-switch>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.ccostofact"
                      label="Centro Costos en Factura"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.poscotiza"
                      label="Impresion POS- Cotizacion-"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.posremision"
                      label="Impresion POS- Remisión-"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.poscambio"
                      label="Devueltas en Pago Factura"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.pagocont"
                      label="Pago Contado Factura"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.presentprod"
                      label="Presentación Producto"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.contarem"
                      label="Contabiliza Remisiones"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.ctrsdoinv"
                      label="Control Saldo Inventarios"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.causavtas"
                      label="Causar Impuestos en Ventas"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-switch
                      v-model="form.plazocuotas"
                      label="Plazo en cuotas"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Dia Máximo Pago"
                      outlined
                      hide-details
                      v-model="form.diamaxpago"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col sm="12" cols="4">
                    <v-textarea
                      outlined
                      clearable
                      label="Observaciones"
                      v-model="form.observaciones"
                      counter="270"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col cols="6">
                    <v-text-field
                      clearable
                      label="Representante/Gerente"
                      v-model="form.firmarlegal"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      clearable
                      label="Cargo"
                      v-model="form.cargorp"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col cols="6">
                    <v-text-field
                      clearable
                      label="Contador"
                      v-model="form.firmacontador"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <v-text-field
                      clearable
                      label="T.P"
                      v-model="form.tpcontador"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col cols="6">
                    <v-text-field
                      clearable
                      label="Revisor Fiscal"
                      v-model="form.firmarevisor"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      clearable
                      label="T.P"
                      v-model="form.tprevisor"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col cols="5">
                    <v-text-field
                      clearable
                      label="Coordinador Talento Humano"
                      v-model="form.firmatalento"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      clearable
                      label="Identificacion"
                      v-model="form.idthumano"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      clearable
                      label="Teléfono"
                      v-model="form.telethumano"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 ml-1">
                  <v-col cols="4">
                    <v-text-field
                      clearable
                      label="Historias Clinicas"
                      v-model="form.correohc"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      :append-icon="show1 ? 'visibility' : 'visibility_off'"
                      :type="show1 ? 'text' : 'password'"
                      @click:append="show1 = !show1"
                      clearable
                      label="Credenciales"
                      v-model="form.clavehc"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="3">
                    <v-text-field
                      clearable
                      label="Servidor"
                      v-model="form.servidorhc"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      clearable
                      label="Puerto"
                      v-model="form.puertohc"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false"
            >Cerrar</v-btn
          >
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      show1: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      error: {
        rut: false,
      },
      styleObject: { border: "2px solid #01579B" },

      dialog: true,
      valid: false,
      pickerFechaRet: false,
      pickerFechaIng: false,
      singleExpand: true,
      expanded: [],
      ruts3: [],
      ruts4: [],
      clientes: [],
      contenido: [],
      tablaPuc: [],
      tablaPuc2: [],
      tablaPuc4: [],
      empresa: [],
      obligfact: [
        { text: "Si", value: 1 },
        { text: "No Obligado", value: 2 },
      ],

      consorcio: [
        { text: "Mandato y/o Administración delegada", value: 1 },
        { text: "Consorcio y/o Unión Temporal", value: 2 },
        {
          text: "Exploración y Explotación de hidrocarburos, gases y minerales",
          value: 3,
        },
        { text: "Joint Venture", value: 4 },
        { text: "Cuentas en participación", value: 5 },
        { text: "Convenios de cooperación con entidades públicas", value: 6 },
        { text: "No Aplica", value: 9 },
      ],

      search: "",
      form: {
        listado_devengos: [],
        clientes: null,
      },
      headers: [],
      errores: {
        ctacartera: false,
        ctartefte: false,
        ctarteica: false,
        ctadctos: false,
        ctaant: false,
        rteftepas: false,
        ivapas: false,
        capital: false,
        rteivapas: false,
        autortact: false,
        autortapas: false,
        ctaajusteing: false,
        ctaajustegto: false,
        icapas: false,

        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      tab: 0,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 3,
        masked: false,
      },
    };
  },
  created() {
    this.get_puc4();
    // this.get_puc();
    this.get_puc2();
  },
  computed: {},
  methods: {
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
          this.dialogo.estado = true;
          this.form.empresa = this.empresa[0].descrip_empr;
          this.form.rut = this.empresa[0].id_empr;
          this.form.tipoid = this.empresa[0].tipo_empr;
          this.form.acctoken = this.empresa[0].actoken_empr;
          this.form.cltoken = this.empresa[0].cltoken_empr;
          this.form.direccion = this.empresa[0].direccion_empr;
          this.form.telefono = this.empresa[0].telefono_empr;
          this.form.correo = this.empresa[0].email_empr;
          this.form.ctrvta = parseInt(this.empresa[0].ctrvta_empr);
          this.form.ivainc = parseInt(this.empresa[0].ivainc_empr);
          this.form.barras = parseInt(this.empresa[0].barras_empr);
          this.form.ccostofact = parseInt(this.empresa[0].ccostofact_empr);
          this.form.poscotiza = parseInt(this.empresa[0].poscotiza_empr);
          this.form.posremision = parseInt(this.empresa[0].posremis_empr);
          this.form.poscambio = parseInt(this.empresa[0].poscambio_empr);
          this.form.pagocont = parseInt(this.empresa[0].fpagocont_empr);
          this.form.presentprod = parseInt(this.empresa[0].presentprod_empr);
          this.form.contarem = parseInt(this.empresa[0].contarem_empr);
          this.form.ctrsdoinv = parseInt(this.empresa[0].ctrsdoinv_empr);
          this.form.causavtas = parseInt(this.empresa[0].causavtas_empr);
          this.form.plazocuotas = parseInt(this.empresa[0].plazocuotas_empr);

          this.form.firmarlegal = this.empresa[0].rplegal_empr;
          this.form.cargorp = this.empresa[0].cargorplegal_empr;
          this.form.firmacontador = this.empresa[0].contador_empr;
          this.form.tpcontador = this.empresa[0].matcontador_empr;
          this.form.firmarevisor = this.empresa[0].revfiscal_empr;
          this.form.tprevisor = this.empresa[0].matrevfiscal_empr;
          this.form.firmatalento = this.empresa[0].firmatalento_empr;
          this.form.idthumano = parseFloat(this.empresa[0].idthumano_empr);
          this.form.telethumano = parseFloat(this.empresa[0].telethumano_empr);

          this.form.color1 = this.empresa[0].color1_empr.trim();
          this.form.color2 = this.empresa[0].color2_empr.trim();
          this.form.color3 = this.empresa[0].color3_empr.trim();
          this.form.color4 = this.empresa[0].color4_empr.trim();
          this.form.ctrccosto = this.empresa[0].ctrccosto_empr.trim();

          this.form.autocree = this.empresa[0].autocree_empr;
          this.form.porcvtas = this.empresa[0].porcrtefte_empr;
          this.form.observaciones = this.empresa[0].observacion_empr.trim();
          this.form.diamaxpago = this.empresa[0].diamxpago_empr;

          this.form.correohc = this.empresa[0].emailhc_empr;
          this.form.clavehc = this.empresa[0].passhc_empr;
          this.form.servidorhc = this.empresa[0].hosthc_empr;
          this.form.puertohc = this.empresa[0].puertohc_empr;

          var busqueda_consorc = this.consorcio.find(
            (el) => el.value == parseInt(this.empresa[0].tipoconsorc_empr)
          );
          this.form.consorcio = busqueda_consorc;

          var busqueda_oblig = this.obligfact.find(
            (el) => el.value == parseInt(this.empresa[0].obligfact_empr)
          );
          this.form.obfact = busqueda_oblig;

          var busqueda_cta = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctacartera_empr.trim()
          );
          this.form.ctacartera = busqueda_cta;

          var busqueda_cta2 = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctacartera2_empr.trim()
          );
          this.form.ctacartera2 = busqueda_cta2;

          var busqueda_rte = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctartefte_empr.trim()
          );
          this.form.ctartefte = busqueda_rte;

          var busqueda_ica = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctarteica_empr.trim()
          );
          this.form.ctarteica = busqueda_ica;

          this.form.ctadctos = busqueda_rte;
          var busqueda_dctos = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctadctos_empr.trim()
          );
          this.form.ctadctos = busqueda_dctos;

          var busqueda_antic = this.tablaPuc2.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctaantic_empr.trim()
          );
          this.form.ctaant = busqueda_antic;

          var busqueda_rtefte = this.tablaPuc2.find(
            (el) => el.cod_puc.trim() == this.empresa[0].mayorrte_empr.trim()
          );
          this.form.rteftepas = busqueda_rtefte;

          var busqueda_iva = this.tablaPuc2.find(
            (el) => el.cod_puc.trim() == this.empresa[0].mayoriva_empr.trim()
          );
          this.form.ivapas = busqueda_iva;

          let busqueda = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctaiva5pas_empr.trim()
          );
          this.form.ivapas5 = busqueda;

          busqueda = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ctaiva19pas_empr.trim()
          );
          this.form.ivapas19 = busqueda;

          busqueda = this.tablaPuc4.find(
            (el) =>
              el.cod_puc.trim() == this.empresa[0].ctaproveedor_empr.trim()
          );
          this.form.pasproveed = busqueda;

          var busqueda_capital = this.tablaPuc2.find(
            (el) => el.cod_puc.trim() == this.empresa[0].mayorcap_empr.trim()
          );
          this.form.capital = busqueda_capital;

          var busqueda_rteivapas = this.tablaPuc4.find(
            (el) =>
              el.cod_puc.trim() == this.empresa[0].ctarteivapas_empr.trim()
          );
          this.form.rteivapas = busqueda_rteivapas;

          var busqueda_rteicapas = this.tablaPuc2.find(
            (el) =>
              el.cod_puc.trim() == this.empresa[0].ctarteicapas_empr.trim()
          );
          this.form.icapas = busqueda_rteicapas;

          var busqueda_ajting = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ajusteing_empr.trim()
          );
          this.form.ctaajusteing = busqueda_ajting;

          var busqueda_ajtgto = this.tablaPuc4.find(
            (el) => el.cod_puc.trim() == this.empresa[0].ajustegto_empr.trim()
          );
          this.form.ctaajustegto = busqueda_ajtgto;

          var busqueda_autortact = this.tablaPuc4.find(
            (el) =>
              el.cod_puc.trim() == this.empresa[0].ctaautortact_empr.trim()
          );
          this.form.autortact = busqueda_autortact;

          var busqueda_autortpas = this.tablaPuc4.find(
            (el) =>
              el.cod_puc.trim() == this.empresa[0].ctaautortpas_empr.trim()
          );
          this.form.autortapas = busqueda_autortpas;
          var busqueda_rut = this.clientes.find(
            (el) =>
              el.identificacion_rut.trim() == this.empresa[0].clientepred_empr
          );
          this.form.clientes = busqueda_rut;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clientes = data;
          let cliente = "000000222222222";
          let busqueda_cli = this.clientes.find(
            (el) => el.identificacion_rut.trim() == cliente
          );
          this.form.clientes = busqueda_cli;
          this.cargar_empresa();
        })

        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.ctacartera) {
        this.errores.ctacartera = true;
        this.send_error("Error en Cuenta Cartera");
      } else if (!data.ctartefte) {
        this.errores.ctartefte = true;
        this.send_error("Error en Cuenta Retefuente");
      } else if (!data.ctarteica) {
        this.errores.ctarteica = true;
        this.send_error("Error en Cuenta ReteIca");
      } else if (!data.ctadctos) {
        this.errores.ctadctos = true;
        this.send_error("Error en Cuenta Devoluciones en ventas");
      } else if (!data.ctaant) {
        this.errores.ctaant = true;
        this.send_error("Error en Cuenta Anticipos");
      } else if (!data.rteftepas) {
        this.errores.rteftepas = true;
        this.send_error("Error en Cuenta Pasivo Retefuente");
      } else if (!data.ivapas) {
        this.errores.ivapas = true;
        this.send_error("Error en Cuenta Pasivo Iva");
      } else if (!data.capital) {
        this.errores.capital = true;
        this.send_error("Error en Cuenta Capital");
      } else if (!data.rteivapas) {
        this.errores.rteivapas = true;
        this.send_error("Error en Cuenta RteteIva");
      } else if (!data.autortact) {
        this.errores.autortact = true;
        this.send_error("Error en Cuenta Autorenta Activo");
      } else if (!data.autortapas) {
        this.errores.autortapas = true;
        this.send_error("Error en Cuenta Autorenta Pasivo");
      } else if (!data.ctaajusteing) {
        this.errores.ctaajusteing = true;
        this.send_error("Error en Cuenta Ajuste al Peso");
      } else if (!data.ctaajustegto) {
        this.errores.ctaajustegto = true;
        this.send_error("Error en Cuenta Ajuste al Peso");
      } else this.format_envio(data);
    },
    format_envio(data) {
      this.card_estado = true;
      var direccion = data.direccion;
      var telefono = data.telefono;
      var correo = data.correo;
      var ctacart = data.ctacartera.cod_puc.trim();
      var ctacart2 = data.ctacartera2 ? data.ctacartera2.cod_puc.trim() : 0;
      var ctarte = data.ctartefte.cod_puc.trim();
      var ctaica = data.ctarteica.cod_puc.trim();
      var ctadctos = data.ctadctos.cod_puc.trim();
      var ctaant = data.ctaant.cod_puc.trim();
      var ctarteftepas = data.rteftepas.cod_puc.trim();
      var ctaivapas = data.ivapas.cod_puc.trim();
      var ctapesoing = data.ctaajusteing.cod_puc.trim();
      var ctapesogto = data.ctaajustegto.cod_puc.trim();
      var ctacapital = data.capital.cod_puc.trim();
      var rteivapas = data.rteivapas ? data.rteivapas.cod_puc.trim() : 0;
      var pasproveed = data.pasproveed ? data.pasproveed.cod_puc.trim() : 0;
      var icapas = data.icapas ? data.icapas.cod_puc.trim() : 0;
      var ivapas5 = data.ivapas5 ? data.ivapas5.cod_puc.trim() : 0;
      var ivapas19 = data.ivapas19 ? data.ivapas19.cod_puc.trim() : 0;
      var autortapact = data.autortact.cod_puc.trim();
      var autortapas = data.autortapas.cod_puc.trim();
      let representante = data.firmarlegal ? data.firmarlegal.trim() : "";
      let cargorp = data.cargorp ? data.cargorp.trim() : "";
      let contador = data.firmacontador ? data.firmacontador.trim() : "";
      let tpcontador = data.tpcontador ? data.tpcontador.trim() : "";
      let firmarevisor = data.firmarevisor ? data.firmarevisor.trim() : "";
      let tprevisor = data.tprevisor ? data.tprevisor.trim() : "";
      let firmatalento = data.firmatalento ? data.firmatalento.trim() : "";
      let idthumano = data.idthumano ? data.idthumano : "";
      let telethumano = data.telethumano ? data.telethumano : "";

      let color1 = data.color1 ? data.color1.trim() : "";
      let color2 = data.color2 ? data.color2.trim() : "";
      let color3 = data.color3 ? data.color3.trim() : "";
      let color4 = data.color4 ? data.color4.trim() : "";

      var porccree = data.autocree;
      var porcrtefte = data.porcvtas;
      var ctrvta = data.ctrvta ? 1 : 0;
      var diamaxpago = data.diamaxpago;
      var ivainc = data.ivainc ? 1 : 2;
      var barras = data.barras ? 1 : 0;
      var ccostofact = data.ccostofact ? 1 : 0;
      var poscotiza = data.poscotiza ? 1 : 0;
      var posremis = data.posremision ? 1 : 0;
      var poscambio = data.poscambio ? 1 : 0;
      var pagocont = data.pagocont ? 1 : 0;
      var presentprod = data.presentprod ? 1 : 0;
      var contarem = data.contarem ? 1 : 0;
      var ctrsdoinv = data.ctrsdoinv ? 1 : 0;
      var causavtas = data.causavtas ? 1 : 0;
      var plazocuotas = data.plazocuotas ? 1 : 0;
      var ctrccosto = data.ctrccosto ? 1 : 0;

      var obfact = data.obfact ? data.obfact.value : 2;
      var consorcio = data.consorcio ? data.consorcio.value : 0;

      var cliente = data.clientes ? data.clientes.identificacion_rut : 0;
      var observaciones = data.observaciones;
      let correohc = data.correohc ? data.correohc.trim() : "";
      let clavehc = data.clavehc ? data.clavehc.trim() : "";
      let servidorhc = data.servidorhc ? data.servidorhc.trim() : "";
      let puertohc = data.puertohc ? data.puertohc.trim() : "";

      let datos = {
        url: "Financiero/dlls/Cfempresa2.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          direccion +
          "|" +
          telefono +
          "|" +
          correo +
          "|" +
          ctacart +
          "|" +
          ctrvta +
          "|" +
          porccree +
          "|" +
          ctarte +
          "|" +
          ctaica +
          "|" +
          ctadctos +
          "|" +
          ctaant +
          "|" +
          porcrtefte +
          "|" +
          ivainc +
          "|" +
          barras +
          "|" +
          ccostofact +
          "|" +
          obfact +
          "|" +
          posremis +
          "|" +
          poscotiza +
          "|" +
          poscambio +
          "|" +
          pagocont +
          "|" +
          presentprod +
          "|" +
          ctarteftepas +
          "|" +
          ctaivapas +
          "|" +
          ctacapital +
          "|" +
          consorcio +
          "|" +
          contarem +
          "|" +
          cliente +
          "|" +
          observaciones +
          "|" +
          ctrsdoinv +
          "|" +
          ctapesoing +
          "|" +
          ctapesogto +
          "|" +
          rteivapas +
          "|" +
          icapas +
          "|" +
          causavtas +
          "|" +
          ctacart2 +
          "|" +
          autortapact +
          "|" +
          autortapas +
          "|" +
          representante +
          "|" +
          cargorp +
          "|" +
          contador +
          "|" +
          tpcontador +
          "|" +
          firmarevisor +
          "|" +
          tprevisor +
          "|" +
          color1 +
          "|" +
          color2 +
          "|" +
          color3 +
          "|" +
          color4 +
          "|" +
          ctrccosto +
          "|" +
          plazocuotas +
          "|" +
          firmatalento +
          "|" +
          idthumano +
          "|" +
          telethumano +
          "|" +
          ivapas5 +
          "|" +
          ivapas19 +
          "|" +
          pasproveed +
          "|" +
          diamaxpago +
          "|" +
          correohc +
          "|" +
          clavehc +
          "|" +
          servidorhc +
          "|" +
          puertohc +
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
          this.cargar_empresa();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    get_puc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "6" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    get_puc2: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc2 = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    get_puc4: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc4 = data;
          this.get_Clientes();
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
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
