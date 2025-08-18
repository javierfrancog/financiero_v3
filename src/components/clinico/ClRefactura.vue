<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-language-r</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >ReFacturar Servicios</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Año Factura Origen"
                  outlined
                  hide-details
                  v-model="periodo"
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

              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  hide-details
                  v-model="consecutivo"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargarTablaFacturas"
                >
                  Consultar
                  <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-col class="d-flex" cols="12" sm="4">
              <v-menu
                v-model="fechaFactura_picker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fechaFactura"
                    label="Fecha de la Factura"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fechaFactura"
                  @input="fechaFactura_picker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-data-table
              v-if="consecutivo != null"
              :loading="load_table"
              :headers="headers"
              :items="facturas"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado_factura="{ item }">
                {{ item.estado_factura == "1" ? "Anulada" : "Activa" }}
              </template>

              <template v-slot:item.action="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="
                        edit_item(item);
                        dialogo.tipo = false;
                      "
                    >
                      <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Modificar item</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red darken-4"
                      fab
                      small
                      icon
                      v-on="on"
                      @click="delete_item(item)"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar item</span>
                </v-tooltip>
              </template>
            </v-data-table>

            <v-divider
              v-if="consecutivo != null"
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'indigo' }"
            />
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
      periodo: null,
      fechaFactura_picker: false,

      facturas: [],
      pagos: [],
      form: [],
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro Servicio", align: "center", value: "nroservicio" },
        { text: "Fecha", align: "center", value: "fecha_servicio" },
        { text: "Nombres", align: "center", value: "nombres" },
        { text: "Apellidos", align: "center", value: "primerApellido" },
        { text: "Servicio", align: "center", value: "nombre_servicio" },
        { text: "Estado", align: "center", value: "estado_factura" },
        { text: "Valor", align: "center", value: "vlr_total" },
        { text: " ", align: "center", value: "action" },
      ],
    };
  },
  created() {
    (this.periodo = 2022), (this.prefijo = "FE"),
    (this.fechaFactura = "2022-09-06"),
    (this.consecutivo = 44639);
  },
  watch: {},
  computed: {},

  methods: {
    cargarTablaFacturas() {
      post
        .postData({
          url: "clinico/dlls/ClRefacturaJ.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.prefijo +
            "|" +
            this.consecutivo +
            "|" +
            this.periodo +
            "|",
          method: "",
        })
        .then((data) => {
          let id = 1;
          data.map((elem) => {
            elem.nro = id++;
          });
          this.facturas = data;
          data.pop();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Servicios",
            estado: true,
          });
        });
    },
    delete_item: function (item) {
      const index = this.facturas.indexOf(item);
      this.facturas.splice(index, 1);
    },
    edit_item: function (item) {
      const index = this.facturas.indexOf(item);
    },
  },
};
</script>
