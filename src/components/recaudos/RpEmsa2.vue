<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-file-cloud-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue Archivo Validacion Emsa</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
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
                      outlined
                      v-on="on"
                      :error="errores.fecha"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha"
                    @input="pickerFecha = false"
                  ></v-date-picker>
                </v-menu>
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
                  :accept="'.csv'"
                  v-model="form.adjunto"
                  id="archivo_adjunto"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
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
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      loader: false,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      convenios: [],
      ptosrecaudo: [],
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Radicado Emsa", align: "center", value: "cuponemsa_rep" },
        { text: "Cuenta Emsa", align: "left", value: "ctaemsa_rep" },        
        { text: "Valor Emsa", align: "center", value: "vlremsa_rep" },
        { text: "Inconsistencia", align: "center", value: "inconsistencia_rep" },
        { text: "Cuenta Titán", align: "center", value: "ctatitan_rep" },
        { text: "Valor Titán", align: "center", value: "vlrtitan_rep" },
      ],      
      pickerFecha: false,
      search: "",
      puntos: "",

      form: {},
      errores: {
        fechacierre: false,
        efectivo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    (this.form.fecha = this.$moment().format("YYYY-MM-DD")),
      (this.dialogo.estado = false);
  },
  computed: {},
  methods: {
    init_form() {
      this.form = {};

      this.errores = {
        codigo: false,
      };
    },

    subir_archivo() {
      var _this = this;
      var adjunto = this.form.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_CARGUE`;
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
            console.log("Res", res);
            if (res.code == 0) {
              this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      let convenio = this.form.convenio ? this.form.convenio.cod_rep : 0;
      this.contenido =[];

      let dll = "Rpemsa2J.dll";
      let fecha = this.form.fecha.replace(/\-/g, "");
      post
        .postData({
          url: "Recaudos/dlls/" + dll,
          data:
            sessionStorage.Sesion + "|" + fecha + "|" + nombre_adjunto + "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.$emit("snack", {
            color: "success",
            text: "Cargue generado correctamente",
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
