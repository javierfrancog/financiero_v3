<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-delete-forever-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Anulación Comprobante Recaudos</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  label="Tipo Documento"
                  v-model="form.tipoDocumento"
                  :items="docc"
                  :item-text="format_docc"
                  hide-details
                  return-object
                  outlined
                  clearable
                  @change="get_comprobantes()"
                  :loading="loader.tipoDocumento"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row class="d-flex mb-4 justify-center" no-gutters>
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
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                :single-expand="true"
                item-key="consecutivo"
                show-expand
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.estado="{ item }">
                  <v-chip
                    class="white--text"
                    small
                    label
                    :color="`${item.estado == 1 ? 'red' : 'green'} darken-1`"
                    >{{ item.estado == 1 ? "Anulado" : "Activo" }}</v-chip
                  >
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Item</th>
                            <th class="text-left">Cuenta</th>
                            <th class="text-left">Rut</th>
                            <th class="text-left">Documento</th>
                            <th class="text-left">C. Costo</th>
                            <th class="text-left">Débito</th>
                            <th class="text-left">Crédito</th>
                            <th class="text-left">Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in item.registros" :key="row.item">
                            <td>{{ row.item }}</td>
                            <td class="text-left">{{ row.cuenta }}</td>
                            <td class="text-left">{{ row.rut }}</td>
                            <td>{{ row.nroext }}</td>
                            <td>{{ row.ccosto }}</td>
                            <td>{{ row.debito }}</td>
                            <td>{{ row.credito }}</td>
                            <td>{{ row.detalle }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-4"
                        color="red accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="borrar_doc(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Anular Comprobante</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";

export default {

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
      periodo_cargue: this.$moment().format("YYYY-MM"),
      expanded: [],
      docc: [],
      search: "",
      form: null,
      drawer: false,
      headers: [
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          align: "center",
        },
        {
          text: "Consecutivo",
          align: "center",
          value: "consecutivo",
          width: "15%",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripc",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
        {
          text: "Estado",
          align: "left",
          value: "estado",
          width: "5%",
        },

        { text: "Opciones", align: "center", value: "action", width: "15%" },
      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    this.cargarTabladocc();
  },
  methods: {
    borrar_doc(item) {
      var tipoDocumento =
        this.form.tipoDocumento.agencia_docc +
        this.form.tipoDocumento.codigo_docc;
      var fecha = this.periodo_cargue.replace(/\-/g, "");
      var nro = parseInt(item.consecutivo.replace(",", ""));
      post
        .postData({
          url: "PHorizontal/dlls/PrAnulaCb.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            tipoDocumento +
            "|" +
            nro +
            "|",
          method: "",
        })
        .then((data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante anulado",
            estado: true,
          });
          this.get_comprobantes();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },

    get_comprobantes() {
      this.detalle = [];
      var tipoDocumento = this.form.tipoDocumento;
      if (tipoDocumento) {
        this.loader.tabla_datos = true;
        var fecha = this.periodo_cargue.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion +
          "|" +
          tipoDocumento.agencia_docc +
          tipoDocumento.codigo_docc +
          "|" +
          fecha +
          "|";
        post
          .postData({
            url: "Financiero/dlls/PrReimpcbJ.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader.tabla_datos = false;
            this.detalle = data;
          })
          .catch((err) => {
            this.loader.tabla_datos = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.detalle = [];
      }
    },
    format_docc: function (val) {
      return `${val.agencia_docc + val.codigo_docc} - ${val.descrip_docc}`;
    },
    cargarTabladocc: function () {
      this.docc.unshift({
        codigo_docc: "001",
        agencia_docc: "0001",
        descrip_docc: "RECIBOS DE CAJA",
      });
    },

  },
};
</script>
