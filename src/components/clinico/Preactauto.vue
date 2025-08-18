<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-decision-auto-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reactivar Autorizaciones</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Contrato"
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro"
                  hide-details
                  :loading="load_contrato"
                  v-model="selectContrato"
                  clearable
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Nro. Autorización"
                  v-model="form.nro_auto"
                ></v-text-field>
              </v-col>

            </v-row>
            <v-row justify="center">
              <v-col class="d-flex" cols="6">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="get_reactiva"
                >
                  Reactivar
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>

            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
export default {
  data() {
    return {
      condition: false,
      search: null,
      load_contrato: true,
      load_table: false,
      selectContrato: null,
      contratos: [],
      form: [],
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente"
        },
        { text: "Descripcion", align: "center", value: "desc_servicio" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente"
        },
        { text: "Opciones", value: "edit", align: "center" }
      ]
    };
  },
  created() {
    this.cargarContratos();
  },

  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter(e => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    }
  },
  methods: {
    format_contrato(val) {
      return val.nro + "-" + val.detalle;
    },
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.contratos = data;
          this.load_contrato = false;
        })
        .catch(err => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true
          });
        });
    },
    get_reactiva() {
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.selectContrato.identificacion +
        "|" +
        this.form.nro_auto +
        "|";
      post
        .postData({
          url: "Clinico/dlls/PrAnulaAut.dll",
          data: datos,
          method: ""
        })
        .then(data => {
          this.$emit("snack", {
            color: "success",
            text: "Autorizacion Activa para Facturar",
            estado: true,
          });

        })
        .catch(err => {
          console.log(err);
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al reactivar Autorización",
            estado: true
          });
        });
    }
  }
};
</script>
