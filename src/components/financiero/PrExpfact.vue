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
                >mdi-arrow-down-bold-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Exportar Facturas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Punto de Facturacion"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  return-object
                  hide-details
                  @change="
                    get_resolucion();
                    errores.punto_fact = false;
                  "
                  outlined
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Prefijo Facturacion"
                  v-model="form.pref_fact"
                  :items="prefijos"
                  :item-text="format_pref_fact"
                  item-value="prefijo_resd"
                  hide-details
                  outlined
                  return-object
                  @change="errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col sm="3" cols="12">
                <v-select
                  :items="[{ text: 'Csv_Prosoft', value: 1 }]"
                  label="Destino"
                  outlined
                  hide-details
                  v-model="form.destino"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
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
                      v-model="form.fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="3">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center">
                <v-btn
                  class="ma-2 px-4"
                  color="light-blue accent-4 white--text"
                  depressed
                  large
                  @click="guardar()"
                  ><v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
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
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      singleExpand: true,
      agencias: [],
      expanded: [],
      prefijos: [],
      contenido: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      headers: [],
      detalle: [],
      adjunto: null,
      errores: {
        codigo: false,
        estado: false,
      },

      loaderCard: false,
    };
  },
  created() {
    this.form = {
      fecha_ini: this.$moment().format("YYYY-MM"),
      fecha_final: this.$moment().format("YYYY-MM"),
    };
    this.cargarTablaAg();
  },
  methods: {
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },

    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      this.format_envio(data);
    },
    format_pref_fact: function (val) {
      return `${val.prefijo_resd} - ${val.documento_resd}`;
    },

    get_resolucion() {
      var $this = this;
      var prefijo = this.form.punto_fact.codigo_agc;
      post
        .postData({
          url: "financiero/dlls/CfResdianJ.dll",
          data: sessionStorage.Sesion + "|" + prefijo + "|" + "4" + "|",
          method: "POST",
        })
        .then((data) => {
          data.pop();
          this.prefijos = data;
          this.get_notifica();
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar Prefijos: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    format_envio(data) {
      this.card_estado = true;
      var sede = data.punto_fact.codigo_agc;
      let prefijo = data.pref_fact.prefijo_resd.trim()
      var destino = data.destino;
      var fechaini = data.fecha_ini.replace(/\-/g, "");
      var fechafin = data.fecha_final.replace(/\-/g, "");

      let datos = {
        url: "PtoVta/dlls/PrExpFactJ.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          sede +
          "|" +
          destino +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          prefijo +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          var nom_plano = data[0].archivo_rep;
          var formData = new FormData();
          formData.append("ruta", nom_plano.trim());

          fetch("https://server1ts.net//financiero/inc/get.plano.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((result) => {
              var csvContent = result;
              var blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              var url = URL.createObjectURL(blob);
              var pom = document.createElement("a");
              pom.href = url;
              pom.setAttribute("download", "FACTURAS_PROSOFT.csv");
              pom.click();
              this.$emit("snack", {
                color: "success",
                text: "Archivo generado correctamente",
                estado: true,
              });

              this.card_estado = false;
              this.dialogo.estado = false;
              this.init_form();
            });
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al generar plano");
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
