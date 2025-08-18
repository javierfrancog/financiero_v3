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
                >mdi-arrow-up-bold-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Importar Nómina</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-menu
                  ref="menu"
                  v-model="dialogPicker"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  required
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Periodo Registro"
                      outlined
                      v-model="form.fecha"
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    type="month"
                    @input="dialogPicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6" sm="6">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.agencia"
                  :items="agencias"
                  :item-text="format_agencias"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="errores.agencia = false"
                  :error="errores.agencia"
                ></v-autocomplete>
              </v-col>

              <v-col sm="4" cols="12">
                <v-select
                  :items="[
                    { text: 'Prosoft_V.RM', value: 1 },
                    { text: 'Prosoft_V.Nueva', value: 6 },
                    { text: 'Devengos/Deducciones', value: 3 },
                    { text: 'Sysman-Nómina', value: 2 },
                    { text: 'Sysman-Primas', value: 4 },
                    { text: 'Sysman-Liquidacion', value: 5 },
                    { text: 'Sysman-Cesantías', value: 7 },
                  ]"
                  label="Origen"
                  outlined
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

              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
                <!-- <v-btn
                  color="red accent-4 white--text"
                  class
                  @click="agregar_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Borrar Facturas
                </v-btn> -->
              </v-col>
              <v-col class="d-flex align-center">
                <v-btn
                  color="red white--text"
                  class
                  @click="validar()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Ver
                  Inconsistencias
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              :expanded.sync="expanded"
              item-key="idnomina_rep"
              :search="search"
            >
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Numero Inicial"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.inicial"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Numero Final"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.final"
                hide-details
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
            color="success"
            depressed
            large
            @click="eliminar_facturas()"
            >Eliminar</v-btn
          >
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
      },

      card_estado: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      detalle: [],
      adjunto: null,
      loaderCard: false,

      headers: [
        { text: "Descripcion", align: "left", value: "error_rep" },
        { text: "Base", align: "left", value: "base_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1_rep" },
        { text: "Nombre", align: "left", value: "nombres_rep" },
      ],
    };
  },
  created() {
    this.form = {
      fecha: this.$moment().format("YYYY-MM"),
    };
    this.cargarTablaAg();
  },
  methods: {
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },

    subir_archivo() {
      this.contenido = [];
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_NOM`;
        var archivo = new FormData();
        archivo.append("archivo", adjunto);
        archivo.append("nombre", nombre_adjunto);

        fetch("https://server1ts.net//financiero/services/adjunto.impInv.php", {
          method: "POST",
          body: archivo,
        })
          .then((res) => res.json())
          .catch((err) => {
            _this.loaderCard = false;
            console.log("-> Error", err);
          })
          .then((res) => {
            console.log("Res", res);
            if (res.code == 0) {
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
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

    validar: function () {
      let fecha = this.form.fecha.replace(/\-/g, "");
      var nom_plano = `D:\\TITAN\\Log\\${fecha}.txt`;
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
                type: "text/txt;charset=utf-8;",
              });
              var url = URL.createObjectURL(blob);
              var pom = document.createElement("a");
              pom.href = url;
              pom.setAttribute("download", fecha + ".txt");
              pom.click();
        });
    },

    procesar_plano(nombre_adjunto) {
      let fecha = this.form.fecha.replace(/\-/g, "");
      let agencia = this.form.agencia.codigo_agc;
      let origen = this.form.origen;

      let dll = "0";
      if (origen === 1) dll = "Financiero/dlls/PrGthImpnom1.dll";
      else if (origen === 2) dll = "Financiero/dlls/PrGthImpnom2N.dll";
      else if (origen === 3) dll = "Financiero/dlls/PrGthImpnom3.dll";
      else if (origen === 4) dll = "Financiero/dlls/PrGthImpnom4.dll";
      else if (origen === 5) dll = "Financiero/dlls/PrGthImpnom5.dll";
      else if (origen === 6) dll = "Financiero/dlls/PrGthImpnom1.dll";
      else if (origen === 7) dll = "Financiero/dlls/PrGthImpnom7.dll";
      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            nombre_adjunto +
            "|" +
            origen +
            "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Nómina cargada correctamente",
            estado: true,
          });
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
    eliminar_facturas() {
      var nroini = this.form.inicial.trim();
      var nrofin = this.form.final.trim();
      post
        .postData({
          url: "Ptovta/dlls/prfact03B.dll",
          data: sessionStorage.Sesion + "|" + nroini + "|" + nrofin + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.dialogo.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Facturas Eliminadas correctamente",
            estado: true,
          });
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

    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    get_comprobantes() {
      var data = this.form;
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var agencia = data.punto_fact.codigo_agc;
      var docconta = data.punto_fact.docconta_agc;
      var tipoper = data.punto_fact.tipoper_agc;
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrFact01R.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            docconta +
            "|" +
            tipoper +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar comprobantes",
            estado: true,
          });
        });
    },
  },
};
</script>
