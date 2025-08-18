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
                >Historial Atención de Paciente</v-list-item-title
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
              show-expand
              class="elevation-1"
            >
              <template v-slot:item.estado="{ item }">
                <!-- {{ item.estado == "0" ? "Activo" : "Desactivado" }} -->
                {{ evaluar_estado(item.estado) }}
              </template>

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
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogocanc.estado" persistent max-width="900px">
      <v-card class="px-6">
        <v-card-title>
          <span class="title col-12">Anular Prestación de Servicios</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Motivo"
                clearable
                outlined
                type="text"
                v-model="motivocanc"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="grabar_anulacion()"
                >Grabar</v-btn
              >
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-btn
                color="red"
                class="ma-2 white--text"
                @click="dialogocanc.estado = false"
                >Salir</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Sede", align: "center", value: "sede" },
        { text: "Numero Atencion", align: "center", value: "numero" },
        { text: "Descripcion", align: "center", value: "descrip_paciente" },
        { text: "Identificacion", align: "center", value: "identificacion" },
        { text: "Régimen", align: "center", value: "regimen" },
        
        { text: "Servicio", align: "left", value: "nombreserv_rep" },
        
        { text: "Factura", align: "center", value: "factura" },
        { text: "Nro_Rips", align: "center", value: "rips" },

        { text: "Autorizacion", align: "center", value: "autorizacion" },
        { text: "Fecha Agenda", align: "center", value: "fechaagenda" },
        
        { text: "Estado", align: "center", value: "estado" },
      ],
    };
  },
  created() {
    this.cargar_años();
  },
  watch: {},
  computed: {},
  methods: {
    evaluar_estado(estado) {
      if (estado == "0") return "Activo";
      else if (estado == "1") return "Anulado";
      else if (estado == "2") return "Pte x Facturar";
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo_cargue = anioActual;
    },
    anular_item(item) {
      console.log("anula", item);
      this.dialogocanc.estado = true;
      this.nroprserv = item.nroprserv;
      this.anoprserv = item.fecha.substring(0, 4);
    },
    grabar_anulacion() {
      this.dialogocanc.estado = false;
      let data =
        sessionStorage.Sesion +
        "|" +
        this.anoprserv +
        "|" +
        this.nroprserv +
        "|" +
        this.motivocanc +
        "|";
      post
        .postData({
          url: "Clinico/dlls/prAnulapr.dll",
          data: data,
          method: "",
        })
        .then((data) => {
          this.descripaciente = null;

          this.$emit("snack", {
            color: "success",
            text: "Prestacion Anulada correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al anular prestacion",
            estado: true,
          });
        });
    },

    procesarbusqueda: function () {
      post
        .postData({
          url: "Clinico/dlls/ClRphispaciente.dll",
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
          console.log(data);
          this.agendas = data;
        })
        .then((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar datos paciente",
            estado: false,
          });
        });
    },
  },
};
</script>
