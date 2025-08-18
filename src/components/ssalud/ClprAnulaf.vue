<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-block-helper</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Anular Facturas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row justify="end">
          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field
              label="Año Factura"
              outlined
              hide-details
              v-model="año"
            ></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="6" sm="2">
            <v-text-field
              label="Prefijo"
              outlined
              hide-details
              v-model="prefijo"
              text-transform:uppercase
            ></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field
              label="Consecutivo"
              outlined
              hide-details
              v-model="consecutivo"
            ></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="3">
            <v-btn
              color="success"
              class="ma-2 white--text"
              @click="_cargarTablaFacturas"
            >
              Consultar
              <v-icon right dark>mdi-block-helper</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="success"
                  class="ma-2 white--text"
                  @click="anularFactura"
                >
                  Anular
                  <v-icon right dark>mdi-block-helper</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="facturas"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado_factura="{ item }">{{
                item.estado_factura == "1" ? "Anulada" : "Activa"
              }}</template>
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
      search: null,
      load_contrato: true,
      load_table: false,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      pickerActual: false,
      selectContrato: null,
      consecutivo: null,
      prefijo: null,
      facturas: [],
      form: [],
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "nro_factura" },
        { text: "Estado", align: "center", value: "estado_factura" },
        { text: "Fecha", align: "center", value: "fecha_factura" },
        { text: "Cliente", align: "center", value: "nombre_cliente" },
        { text: "Servicio", align: "center", value: "nro_servicio" },
        { text: "Paciente", align: "center", value: "descrip_paciente" },
        { text: "Id_Paciente", align: "center", value: "id_paciente" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {},
  watch: {},
  computed: {},

  methods: {
    _cargarTablaFacturas() {
      post
        .postData({
          url: "Clinico/dlls/ClprAnulafJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.prefijo +
            "|" +
            this.consecutivo +
            "|" +
            this.año +
            "|",
          method: "",
        })
        .then((data) => {
          let id = 1;
          data.map((elem) => {
            elem.nro = id++;
          });
          this.facturas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar facturas",
            estado: true,
          });
        });
    },
    anularFactura() {
      post
        .postData({
          url: "Clinico/dlls/ClprAnulaF.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.prefijo +
            "|" +
            this.consecutivo +
            "|" +
            this.año +
            "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "gren",
            text: "Factura Anulada",
            estado: true,
            timeout: "300",
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al anular factura",
            estado: true,
          });
        });
    },
  },
};
</script>
