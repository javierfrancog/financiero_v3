<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loaderCard"
        :disabled="loaderCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-order-bool-descending-variant</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Radicación de Facturas cl</v-list-item-title
              >
            </v-list-item-content>
            <v-col class="mr-10" sm="3" cols="4">
              <v-btn
                color="orange white--text"
                class
                @click="get_factura()"
                depressed
              >
                <v-icon size="20" left>mdi-book-outline</v-icon>
                Radicación por Factura
              </v-btn>
            </v-col>

            <v-col sm="3" cols="4">
              <v-btn
                color="indigo white--text"
                class
                @click="get_archivo()"
                depressed
              >
                <v-icon size="20" left>mdi-book-outline</v-icon>
                Radicación por Archivo
              </v-btn>
            </v-col>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <!-- <v-col class="d-flex align-center">
                <v-btn
                  color="green darken-3 white--text"
                  class="mr-8"
                  @click="contabilizar()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Contabilizar
                </v-btn>
              </v-col> -->
            <v-row class="d-flex align-center">
              <v-col cols="12">
                <div class="mt-3 pa-0 px-0">
                  <v-data-table
                    :headers="headers"
                    :items="detalle"
                    :search="search"
                    :single-expand="true"
                    item-key="consecutivo"
                    show-expand
                    :loading="loader.tabla_datos"
                    calculate-widths
                    :sort-by="['consecutivo']"
                    :sort-desc="[true, false]"
                  >
                  </v-data-table>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Prefijo Facturacion"
                v-model="form.pref_fact"
                :items="prefijos"
                :item-text="format_pref_fact"
                item-value="prefijo_resd"
                hide-details
                clearable
                return-object
                :error="errores.punto_fact"
              ></v-autocomplete>
            </v-col>

            <v-col class="mb-4" cols="2">
              <v-text-field
                v-model="form.consec"
                label="Consecutivo"
                single-line
                hide-details
                :error="errores.consec"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-menu
                ref="menu"
                v-model="pickerFecha"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha"
                    label="Fecha Radicación"
                    append-icon="event"
                    hide-details
                    v-on="on"
                    @change="errores.fecha = false"
                    :error="errores.fecha"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha"
                  @input="pickerFecha = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="mb-4" cols="4">
              <v-text-field
                v-model="form.nroradica"
                label="Nro Radicación"
                single-line
                hide-details
                :error="errores.nroradica"
              ></v-text-field>
            </v-col>

            <v-col sm="3">
              <v-text-field
                label="Vlr Radicación"
                outlined
                hide-details
                v-model="form.vlrradica"
                v-money="money0"
                ref="input_basico"
                :error="errores.vlrradica"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="indigo white--text"
            depressed
            large
            @click="procesar_factura()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoplano.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Procesar Archivo CSV</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-menu
                v-model="pickerPeriodo"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="periodo_cargue"
                    label="Periodo Radicación"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="periodo_cargue"
                  type="month"
                  no-title
                  scrollable
                  @input="pickerPeriodo = false"
                  @change="get_anteriores()"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-select
                :items="[
                  { text: 'Plano Titán', value: 1 },
                  { text: 'Plano Nueva Eps', value: 2 },
                ]"
                label="Origen"
                outlined
                clearable
                hide-details
                v-model="form.origen"
              ></v-select>
            </v-col>

            <v-col cols="5" v-if="form.origen">
              <v-file-input
                label="Buscar archivo"
                outlined
                chips
                counter
                color="blue darken-1"
                hide-details
                :show-size="1000"
                accept=".csv"
                v-model="adjunto"
                id="archivo_adjunto"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex align-left">
              <v-btn
                color="green white--text"
                class
                @click="plantilla()"
                depressed
              >
                <v-icon size="20" left>mdi-book-outline</v-icon>
                Descargar Plantilla
              </v-btn>
            </v-col>
            <v-btn
              class="ma-2"
              color="red"
              text
              @click="dialogoplano.estado = false"
              >Cancelar</v-btn
            >
            <v-btn
              class="ma-2 px-4"
              color="indigo white--text"
              depressed
              large
              @click="subir_archivo()"
              >Procesar</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      errores: {
        anoselect: false,
        punto_fact: false,
        pref_fact: false,
        consec: false,
        fecha: false,
        nroradica: false,
        vlrradica: false,
      },
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      card_estado: false,
      pickerFecha: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      prefijos: [],
      consec_contab: 0,
      data: [],
      search: "",
      form: null,
      drawer: false,
      detalle: [],
      adjunto: null,
      loaderCard: false,

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogoplano: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      headers: [
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          align: "center",
        },
        {
          text: "Consecutivo",
          align: "center",
          value: "consecutivo",
          width: "15%",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripc",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
      ],
    };
  },
  created() {
    this.get_resolucion();
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
  },
  methods: {
    procesar_factura() {
      var data = this.form;
      let valor = data.vlrradica.replace(/\,/g, "").trim();
      console.log(data);

      if (!data.pref_fact) {
        this.errores.punto_fact = true;
        this.send_error("Selecciona un prefijo de facturación");
      } else if (!data.consec) {
        this.errores.consec = true;
        this.send_error("Debe registrar un numero de Factura");
      } else if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Debe registrar Fecha de Radicación");
      } else if (!data.nroradica) {
        this.errores.nroradica = true;
        this.send_error("Debe registrar Número de Radicación");
      } else if (valor < 1) {
        this.errores.vlrradica = true;
        this.send_error("Debe registrar un valor de Radicación");
      }
      {
        let pref_fact = data.pref_fact.prefijo_resd;
        let consec = data.consec.trim();
        let fecha = data.fecha.replace(/\-/g, "");
        let nroradica = data.nroradica.trim();

        let consecutivo = this.consec_contab;
        post
          .postData({
            url: "Clinico/dlls/PrRadicaF.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              pref_fact +
              "|" +
              consec +
              "|" +
              fecha +
              "|" +
              nroradica +
              "|" +
              valor +
              "|",
            method: "",
          })
          .then((data) => {
            this.loaderCard = false;
            this.contabilizar(2, fecha, pref_fact, consec);

            this.$emit("snack", {
              color: "success",
              text: "Radicado contabilizado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loaderCard = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al contabilizar",
              estado: true,
            });
          });
      }
    },
    get_factura() {
      this.dialogo.estado = true;
    },
    get_archivo() {
      this.dialogoplano.estado = true;
    },

    get_anteriores() {
      this.detalle = [];
      this.loader = true;
      var fecha = this.periodo_cargue.replace(/\-/g, "");

      var datosEnvio =
        sessionStorage.Sesion + "|" + "0001" + "200" + "|" + fecha + "|";
      post
        .postData({
          url: "Financiero/dlls/PrReimpcbJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data = data.map((el) => {
            el.consecutivo = el.consecutivo.replace(/\,/g, "");
            return el;
          });

          data.pop();
          this.detalle = data;
        })
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al consultar información de comprobantes");
        });
    },
    contabilizar(tipo, fecha, pref_fact, consec) {
      var periodo = null;
      let consecutivo = null;
      let datourl = null;
      let data_envio = null;

      if (tipo == 1) {
        periodo = this.periodo_cargue.replace(/\-/g, "");
        consecutivo = this.consec_contab;
        datourl = "Clinico/dlls/ClContRadica.dll";
        data_envio =
          sessionStorage.Sesion + "|" + periodo + "|" + consecutivo + "|";
      } else {
        datourl = "Clinico/dlls/ClContRadica2.dll";
        data_envio =
          sessionStorage.Sesion +
          "|" +
          fecha +
          "|" +
          pref_fact +
          "|" +
          consec +
          "|";
      }

      post
        .postData({
          url: datourl,
          data: data_envio,
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Radicados contabilizados correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al contabilizar",
            estado: true,
          });
        });
    },
    subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_Radica`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch(
          "https://server1ts.net//financiero/services/adjunto.impFact.php",
          {
            method: "POST",
            body: archivo,
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    plantilla: function () {
      let url = "https://titansoluciones.cloud/plantillas/cl_radicacion.xlsx";
      window.open(url, "_blank");
    },
    procesar_plano(nombre_adjunto) {
      let tipo = this.form.origen;
      let url_envio = null;
      if (tipo == 1) {
        url_envio = "Clinico/dlls/ClprRadica1.dll";
      } else if (tipo == 2) {
        url_envio = "Clinico/dlls/ClprRadica2.dll";
      }
      var periodo = this.periodo_cargue.replace(/\-/g, "");
      post
        .postData({
          url: url_envio,
          data:
            sessionStorage.Sesion + "|" + nombre_adjunto + "|" + periodo + "|",
          method: "",
        })
        .then((data) => {
          this.consec_contab = data[0].msg;
          this.loaderCard = false;
          this.dialogoplano.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Facturas Procesadas=" + parseInt(data[0].procesados),
            estado: true,
          });
          this.contabilizar(1);
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar plano",
            estado: true,
          });
        });
    },
    get_resolucion() {
      var $this = this;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar resolucion: " + err.Mensaje[0].Error,
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

    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
  },
};
</script>
