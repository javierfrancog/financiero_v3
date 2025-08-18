<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-format-list-text</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Eaav / Consulta de Factura</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="8" sm="6">
                <v-text-field
                  label="Nro.Factura"
                  clearable
                  outlined
                  type="number"
                  required
                  counter="2"
                  v-model="form.factura"
                  hide-details
                ></v-text-field>
              </v-col>
          <v-spacer></v-spacer>
          <v-btn
           class="ma-2 white--text px-12"
            color="indigo"
            depressed
            large
            @click="consultar_fact()"
            >Consultar</v-btn
          >
            </v-row>
            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-data-table
              id="tabla_consulta"
              :headers="headerconsulta"
              :items="pagos"
              item-key="descentidad_rep"
              :search="search"
              class="elevation-1"
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
      loader: false,
      dialogo: {
        estado: true,
        titulo: null,
        tipo: null,
      },
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      convenios: [],
      contenido: [],
      pagos: [],
      search: "",
      form: {},
      headerconsulta: [
        { text: "Entidad", align: "center", value: "descentidad_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Hora", align: "center", value: "hora_rep" },
        { text: "Punto Recaudo", align: "center", value: "descagc_rep" },
        { text: "Valor", align: "center", value: "valor_rep" },
        { text: "Cajero", align: "center", value: "cajero_rep" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    consultar_fact() {
      this.loader = true;
      var convenio = "892000265";
      var factura = this.form.factura;
      this.tabla_consulta = " ";

      let data = [sessionStorage.Sesion, convenio, factura];
      this.postData({
        url: "Recaudos/dlls/PrConsfactJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop()
          this.pagos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          console.log(err.Mensaje[0].msg);

          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
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
