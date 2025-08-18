<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-file-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Reimpresión Procesos Industriales</v-list-item-title
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
                    @change="get_comprobantes()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-autocomplete
                  label="Tipo Proceso "
                  v-model="form.tipoDocumento"
                  :items="tipos"
                  hide-details
                  return-object
                  outlined
                  clearable
                  @change="get_comprobantes()"
                  :loading="loader.tipoDocumento"
                >
                </v-autocomplete>
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
                >
                </v-text-field>
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="detalle"
                :search="search"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="pl-4">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Item</th>
                            <th class="text-left">Codigo</th>
                            <th class="text-left">Producto</th>
                            <th class="text-left">Ubicación</th>
                            <th class="text-left">Rut</th>
                            <th class="text-left">Documento</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-left">Valor</th>
                            <th class="text-left">Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in item.registros" :key="row.item">
                            <td>{{ row.item }}</td>
                            <td>{{ row.codigo }}</td>
                            <td class="text-left">{{ row.producto }}</td>
                            <td>{{ row.rut }}</td>
                            <td class="text-right">{{ row.cantidad }}</td>
                            <td class="text-right">{{ row.valor }}</td>
                            <td>{{ row.detalle }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </template>
                <template v-slot:item.imprimir="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-2"
                        color="blue accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="print_doc(item)"
                      >
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir comprobante</span>
                  </v-tooltip>
                </template>
                <template v-slot:item.reprocesar="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-2"
                        color="orange accent-3"
                        fab
                        small
                        icon
                        v-on="on"
                        outlined
                        @click="reprocesa_doc(item)"
                      >
                        <v-icon>mdi-axis-x-rotate-clockwise</v-icon>
                      </v-btn>
                    </template>
                    <span>Reprocesar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader_spinner">
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
import { proceso_trilla, proceso_secamiento } from "../../_formatos_mol.js";

export default {
  components: {
    FlowerSpinner,
  },


  data() {
    return {
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      tipos: [
        { text: "Secamiento", value: 1 },
        { text: "Trilla", value: 2 },
        { text: "Empaquetado", value: 3 },
        { text: "Extrusión", value: 4 },
        { text: "Traslados", value: 5 },
      ],
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
          text: "Ubicación",
          align: "center",
          value: "ubicacion",
          width: "15%",
        },

        {
          text: "Descripción",
          align: "left",
          value: "nombre",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
        { text: "Imprimir", align: "center", value: "imprimir", width: "15%" },
        {
          text: "Reprocesar",
          align: "center",
          value: "reprocesar",
          width: "15%",
        },
      ],
      detalle: [],
      loader_spinner: false,
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
  },
  methods: {
    print_doc(item) {
      var data = item;
      let tipoper = "";
      let agencia = data.agencia;
      let periodo = data.fechacorta;
      let consecutivo = data.consecutivo.trim();

      let tipoDocumento = this.form.tipoDocumento.value;
      if (tipoDocumento == 1) {
        tipoper = "E60";
      } else if (tipoDocumento == 2) {
        tipoper = "E61";
      }
      post
        .postData({
          url: "Molinos/dlls/PrImpInd01J.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            periodo +
            "|" +
            tipoper +
            "|" +
            consecutivo +
            "|",
          method: "",
        })
        .then((data) => {
          let dataParse = JSON.parse(JSON.stringify(data))[0];

          let registros = dataParse.registros.map((el) => {
            el.producto_rep = el.base1_pr
              ? window.atob(
                  el.base1_pr.trim() +
                    el.base2_pr.trim() +
                    el.base3_pr.trim() +
                    el.base4_pr.trim() +
                    el.base5_pr.trim()
                )
              : el.producto_rep;
            return el;
          });

          dataParse.registros = registros;

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            dataParse.logo = logo;

            if (tipoDocumento == 1) {
              proceso_secamiento(dataParse).then((res) => {
                console.log("Impresión terminada");
              });
            } else if (tipoDocumento == 2) {
              proceso_trilla(dataParse).then((res) => {
                console.log("Impresión terminada");
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al generar Impresion",
            estado: true,
          });
        });
    },
    reprocesa_doc(item) {
      this.loader_spinner = true;
      var data = item;
      let tipoper = "";
      let agencia = data.agencia;
      let periodo = data.fechacorta;
      let consecutivo = data.consecutivo.trim();

      let tipoDocumento = this.form.tipoDocumento.value;
      if (tipoDocumento == 1) {
        tipoper = "S60";
      } else if (tipoDocumento == 2) {
        tipoper = "S61";
      }
      post
        .postData({
          url: "Molinos/dlls/PrReprocPr.DLL",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            periodo +
            "|" +
            tipoper +
            "|" +
            consecutivo +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader_spinner = false;
          this.$emit("snack", {
            color: "success",
            text: "Comprobante Reprocesado",
            estado: true,
          });
        })
        .catch((err) => {
          this.loader_spinner = false;          
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al reprocesar",
            estado: true,
          });
        });
    },

    get_comprobantes() {
      this.detalle = [];
      var tipoDocumento = this.form.tipoDocumento.value;

      if (tipoDocumento) {
        this.loader.tabla_datos = true;
        var fecha = this.periodo_cargue.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion + "|" + tipoDocumento + "|" + fecha + "|";
        post
          .postData({
            url: "Molinos/dlls/PrReimpprocJ.DLL",
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
  },
};
</script>
