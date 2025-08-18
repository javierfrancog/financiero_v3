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
                >Reimpresión Comprobantes de Mercancías</v-list-item-title
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
                :items="contenido"
                :search="search"
                :single-expand="true"
                item-key="llavedoc"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
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
                            <td class="text-left">{{ row.ubicacion }}</td>
                            <td>{{ row.rut }}</td>
                            <td class="text-right"></td>
                            <td class="text-right">{{ row.cantidad }}</td>
                            <td class="text-right">{{ row.valor }}</td>
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

import { doc_inventario } from "../../_formatos_disp.js";
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
          text: "Ubicacion",
          align: "center",
          value: "descrubicacion",
          width: "15%",
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
          value: "rut",
          width: "45%",
        },
        {
          text: "Fecha",
          align: "left",
          value: "fecha",
          width: "20%",
        },
        {
          text: "Documento",
          align: "left",
          value: "docext",
          width: "45%",
        },

        { text: "Imprimir", align: "center", value: "action", width: "15%" },
        // { text: "Contabilizar", value: "conta", align: "center" },
      ],
      contenido: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false,
      },
      logoSrc:
        "https://server3ts.com/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
    this.form = {
      fecha_doc: this.$moment().format("YYYY-MM"),
    };
    this.cargarTabladocc();
  },
  methods: {
    print_doc(item) {
      let tipoDocumento = this.form.tipoDocumento.llave_tpoper;
      let agencia = item.codagencia;
      let fecha = this.periodo_cargue.replace(/\-/g, "");
      let nro = item.consecutivo.replace(/\,/g, "").trim();
      let datosEnvio =
        sessionStorage.Sesion +
        "|" +
        tipoDocumento +
        "|" +
        fecha +
        "|" +
        nro +
        "|" +
        agencia +
        "|" +
        0 +
        "|";
      post
        .postData({
          url: "Dispensa/dlls/PrReimpinvJ.DLL",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.generar_pdf(data[0]);
        });
    },

    generar_pdf(data) {
      data.registros.pop();
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;
        data.fecha_impr = this.$moment().format("YYYY-MM-DD");
        data.hora_impr = this.$moment().format("HH:mm");

        doc_inventario(data).then(() => {
          console.log("Impresión terminada");
        });
      });
    },

    get_comprobantes() {
      this.contenido = [];
      var tipoDocumento = this.form.tipoDocumento.llave_tpoper;

      if (tipoDocumento) {
        this.loader.tabla_datos = true;
        var fecha = this.periodo_cargue.replace(/\-/g, "");

        var datosEnvio =
          sessionStorage.Sesion + "|" + tipoDocumento + "|" + fecha + "|";
        post
          .postData({
            url: "Dispensa/dlls/PrReimpinv2J.DLL",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader.tabla_datos = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            this.loader.tabla_datos = false;
            console.error(err);
            this.send_error("Error al consultar información de comprobantes");
          });
      } else {
        this.contenido = [];
      }
    },
    format_docc: function (val) {
      return `${val.llave_tpoper} - ${val.descrip_tpoper}`;
    },

    contabiliza_item(item) {
      this.card.loader = true;
      this.card.disabled = true;
      var nro = item.nro_liq.trim();
      var key = nro + "|";
      var datosEnvio = sessionStorage.Sesion + "|" + key;
      post
        .postData({
          url: "Financiero/dlls/PrGthVacacion02.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.card.loader = false;
          this.card.disabled = false;
          let empresa = this.datosEmpresa;
          let data_impresion = {
            ...data[0],
          };

          data_impresion = {
            ...data_impresion,
            desripEmpresa: empresa.descrip_empr,
            tipoId: empresa.tipo_id,
            idEmpresa: empresa.ideditado_empr,
            direccionEmpresa: empresa.direccion_empr,
            ciudadEmpresa: empresa.Ciudad,
            dptoEmpresa: empresa.Departamento,
          };

          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data_impresion.logo = logo;
            liquidagth(data_impresion).then(() => {
              console.log("Impresion terminada");
            });
          });
        })
        .catch((err) => {
          this.card.loader = false;
          this.card.disabled = false;
          this.send_error("Error al Contabilizar el documento");
        });
    },
    reiniciar_formulario() {},

    cargarTabladocc: function () {
      this.loader.tipoDocumento = true;
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.docc = data;
          this.loader.tipoDocumento = false;
        })
        .catch((err) => {
          console.error(err);
          this.loader.tipoDocumento = false;
          this.send_error("Error al cargar Documento Contable");
        });
    },
  },
};
</script>
