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
                >mdi-debug-step-out</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Importar Inventario Fisico</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
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
                      v-model="form.fecha_doc"
                      label="Fecha del Inventario"
                      append-icon="event"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.fecha_doc"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
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
                  @click="procesar()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
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
import { contrato_titan } from "../../_formatos.pdf.js";

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
      periodo_cargue: this.$moment().format("YYYY-MM-DD"),
      agencias: [],
      expanded: [],
      contenido: [],
      selectObjContratos: [],
      load_contrato: true,
      selectContrato: null,
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
      fecha_doc: this.$moment().format("YYYY-MM-DD"),
      // fecha_doc: this.$moment().format("2025-02-28"),
    };
  },
  methods: {
    async procesar() {
      try {
        let fecha = this.form.fecha_doc.replace(/-/g, "");
        let periodo = fecha.substr(0, 6);
        let dll = "PtoVta/dlls/PrImpinvfis.dll";

        await post.postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + fecha + "|" + 0 + "|" + 1 + "|",
          method: "",
        });
        await this.cerrar_mes(periodo);
        await this.subir_archivo();

        this.loaderCard = false;
        this.$emit("snack", {
          color: "success",
          text: "Inventario registrado correctamente",
          estado: true,
        });
      } catch (err) {
        this.loaderCard = false;
        console.error("Error en procesar:", err);

        let mensajeError =
          err?.Mensaje?.[0] || "Error desconocido en el proceso";

        this.$emit("snack", {
          color: "error",
          text: mensajeError,
          estado: true,
        });
      }
    },

    async cerrar_mes(periodo) {
      try {
        const response = await post.postData({
          url: "PtoVta/dlls/PrCierreInv.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" + 0 + "|" + 0 + "|",
          method: "",
        });
        return response;
      } catch (err) {
        console.error("Error en cerrar_mes:", err);

        let mensajeError =
          err?.Mensaje?.[0] || "Error desconocido al generar cierre";
        throw new Error(mensajeError);
      }
    },

    async subir_archivo() {
      var _this = this;
      var adjunto = this.adjunto;
      if (adjunto) {
        _this.loaderCard = true;
        var sesion = sessionStorage.Sesion.substr(0, 15);
        var nombre_adjunto = `${sesion}_FACT`;
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
              _this.procesar_plano(nombre_adjunto);
            }
          });
      }
    },
    procesar_plano(nombre_adjunto) {
      let fecha = this.form.fecha_doc.replace(/-/g, "");
      let dll = "PtoVta/dlls/PrImpinvfis.dll";
      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            nombre_adjunto +
            "|" +
            0 +
            "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: "Inventario registrado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loaderCard = false;
          console.log("err:", err.Mensaje[0]);
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0],
            estado: true,
          });
        });
    },
  },
};
</script>
