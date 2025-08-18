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
                >mdi-arrow-up-thin-circle-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Importar Lecturas</v-list-item-title
              >
            </v-list-item-content>
            <v-col sm="3" cols="4">
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

          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerMes"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      Autocomplete="off"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    scrollable
                    no-title
                    type="month"
                    @change="cargarciclos()"
                    @input="pickerMes = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  label="Ciclo"
                  :items="ciclos"
                  outlined
                  clearable
                  return-object
                  persistent-hint
                  v-model="form.ciclos"
                  :item-text="format_ciclos"
                  :error="errores.ciclos"
                  @change="errores.ciclos = false"
                ></v-select>
              </v-col>

              <v-col cols="5">
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
                <v-btn
                  color="red accent-4 white--text"
                  class
                  @click="agregar_item()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Borrar
                  Lecturas
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
      pickerMes: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      ciclos: [],
      data: [],
      search: "",
      form: null,
      drawer: false,
      headers: [],
      detalle: [],
      adjunto: null,
      loaderCard: false,
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    // this.cargarTablaAg();
  },
  methods: {
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Eliminar Facturas Subidas sin Envio a la Dian";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    cargarciclos() {
      this.loader = true;
      var fecha = this.form.fecha.replace(/\-/g, "");      
      fecha = fecha.substr(0,6)
      post
        .postData({
          url: "servdm/dlls/CfciclosJ.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.ciclos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ciclos",
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
        var nombre_adjunto = `${sesion}_LECTSDM`;
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
    procesar_plano(nombre_adjunto) {
      var fecha = this.form.fecha.replace(/\-/g, "");
      console.log(this.form.ciclos)
      
      var ciclo = this.form.ciclos.cod_rep;      
      post
        .postData({
          url: "Servdm/dlls/prsdmlect01.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha + 
            "|" + 
            nombre_adjunto + 
            "|" +
            ciclo +
            "|",
          method: "",
        })
        .then((data) => {
          let cantidad = data[0].trim()
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: cantidad + "  Lecturas guardadas",
            estado: true,
          });
        })
        .catch((err) => {
          let mensaje = err.Mensaje[0]
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: mensaje,
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

    plantilla: function () {
    let url = "https://titansoluciones.cloud/plantillas/LECTURA_SDM.xlsx"
    window.open(url, '_blank')
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
  },
};
</script>
