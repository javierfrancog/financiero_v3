<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-attachment-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Bloqueo Contable</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row class= "d-flex mb-4 justify-center" no-gutters>
              <h4
                class="font-weight-bold text-h6 subtitles"
              >
                Bloquea/Desbloquea Registos Contables
              </h4>
            </v-row>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="años_select"
                  label="Año"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  @change="cargarPeriodos()"
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="cargarPeriodos()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>
            </v-row>

            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="false"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
                disable-pagination                
                hide-default-footer
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-4"
                        color="orange accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="bloquear_mes(item)"
                      >
                        <v-icon>mdi-lock-alert</v-icon>
                      </v-btn>
                    </template>
                    <span>Bloquear Mes</span>
                  </v-tooltip>

                </template>
                <template v-slot:item.estado_cie="{ item }">
                  <v-chip class="white--text" small label :color="`${item.estado_cie==1 ? 'red' : 'green'} darken-1`" >{{item.estado_cie == 1 ? 'Bloqueado' : 'Abierto'}}</v-chip>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="loader_periodos" persistent max-width="300">
      <v-card>
        <v-card-title class="headline"> Procesando </v-card-title>
        <v-card-text>
          <v-col class="subtitle-1 text-center" cols="12">
            Periodo : <b>{{ periodo_label }}</b>
          </v-col>
          <v-progress-linear
            v-model="periodos_progreso"
            color="blue darken-1"
            height="25"
          >
            <template v-slot:default="{ value }">
              <strong>{{ value }}%</strong>
            </template>
          </v-progress-linear>
        </v-card-text>
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
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      contenido: [],
      search: "",
      form: {},
      drawer: false,
      headers: [
        { text: "", value: "data-table-expand", width: "5%", align: "center" },
        {
          text: "Periodo",
          align: "center",
          value: "periodo_cie",
          width: "15%",
        },
        { text: "Opciones", align: "center", value: "action", width: "15%" },
        {
          text: "Fecha Cierre",
          align: "left",
          value: "fecha_cie",
          width: "5%",
        },
        {
          text: "Usuario",
          align: "left",
          value: "user_cie",
          width: "5%",
        },
        {
          text: "Estado",
          align: "center",
          value: "estado_cie",
          width: "5%",
        },

      ],
      detalle: [],
      años_select: [],
      errores: {
        anoselect: false,
      },
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      loader_periodos: false,
      periodos_progreso: 0,
      periodo_label: null,
    };
  },
  created() {
    this.loader = false;
    this.form = {
      fecha_doc: this.$moment().format("YYYY"),
    };
    this.cargar_años();
    this.cargarPeriodos();
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo_cargue = anioActual;      
    },
    cargarPeriodos: function () {
      var fecha = this.form.periodo_cargue;
      post
        .postData({
          url: "Financiero/dlls//PrCierreCbJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader.tipoDocumento = false;
          this.send_error("Error al cargar Documento Contable");
        });
    },
    bloquear_mes(data) {
      let periodo = data.periodo_cie;
      post
        .postData({
          url: "Financiero/dlls/PrBloqueoCb.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" ,
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          this.cargarPeriodos();          
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al Bloquear Mes",
            estado: true,
          });
        });
    },    
  },
};
</script>
