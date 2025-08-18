<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-heart-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Información del Paciente</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center" no-gutters>
              <v-col class="d-flex" cols="4">
                <v-select
                  :items="años_select"
                  label="Año a Consultar"
                  outlined
                  clearable
                  hide-details
                  v-model="form.periodo_cargue"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.anoselect"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-text-field
                  label="Identificacion"
                  clearable
                  outlined
                  type="number"
                  required
                  @keyup.enter="procesarbusqueda()"
                  v-model="id_numero"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="procesarbusqueda()"
                  >Buscar</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center"></v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="agendas.length != 0"
            >
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              v-if="agendas.length != 0"
              :loading="load_table"
              :headers="headers"
              :items="agendas"
              item-key="numero"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:item.numero="{ item }">
                {{ parseInt(item.numero) }}
              </template>

              <template v-slot:item.identificacion="{ item }">
                {{ parseInt(item.identificacion) }}
              </template>

              <template v-slot:item.rips="{ item }">
                {{ parseInt(item.rips) }}
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-8 mx-auto">
                    <tbody>
                      <tr>
                        <td>
                          <v-btn
                            color="orange"
                            class="ma-2 white--text"
                            @click="anular_item(item)"
                          >
                            Anular{{ item.nroprserv_rep }}</v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
            </v-data-table>
            <v-row class="justify-center">
              <v-card-subtitle
              v-if="agendas.length != 0"
                class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                >Historial de Entregas</v-card-subtitle
              >
            </v-row>

            <v-row class="justify-center">
              <v-data-table
                v-if="agendas.length != 0"
                :headers="headers_paciente"
                sort-by="fecha_rep"
                :sort-desc="true"
                :items="contenido_paciente"
              >
                <template v-slot:item.consec_rep="{ item }">
                  {{ parseInt(item.consec_rep) }}
                </template>
              </v-data-table>
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
      search: null,
      motivocanc: null,
      nroprserv: 0,
      anoprserv: 0,

      contenido_paciente: [],

      load_table: false,
      id_numero: "",
      form: {},
      años_select: [],
      expanded: [],
      singleExpand: true,

      dialogocanc: {
        estado: false,
      },

      errores: {
        anoselect: false,
      },

      agendas: [],
      headers: [
        { text: "Descripcion", align: "center", value: "nombres" },
        { text: "Identificacion", align: "center", value: "identificacion" },
        { text: "Entidad", align: "center", value: "descripeps" },
        { text: "Contrato", align: "center", value: "contrato" },
        { text: "Régimen", align: "center", value: "nomregimen" },
        { text: "Nivel", align: "center", value: "nivel" },
        { text: "Ciudad", align: "center", value: "ciudad_rep" },

        { text: "Estado", align: "center", value: "estado" },
      ],
      headers_paciente: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Dispensación", align: "center", value: "consec_rep" },
        { text: "Sede", align: "center", value: "agencia_rep" },
        { text: "Medicamento", align: "left", value: "descripprod_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        // { text: "Seleccionar", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargar_años();
  },
  watch: {},
  computed: {},
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
    get_historial() {
      this.contenido_paciente = [];
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/RpDispensa02J.DLL",
          data: sessionStorage.Sesion + "|" + this.id_numero + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido_paciente = data;
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente Sin historial",
            estado: true,
          });
        });
    },
    procesarbusqueda() {
      this.agendas = [];
      post
        .postData({
          url: "Dispensa/dlls/ClPrdatopaciente.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.id_numero +
            "|" +
            this.form.periodo_cargue +
            "|",
          method: "",
        })
        .then((data) => {
          this.agendas = data;
          this.get_historial(this.id_numero);
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
  },
};
</script>
