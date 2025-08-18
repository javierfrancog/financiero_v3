<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-file-download</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue de Rips cl</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  label="Consecutivo"
                  outlined
                  hide-details
                  v-model="consecutivo"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  multiple
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="2">
                <v-menu
                  v-model="pickerPeriodoini"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodoini_cargue"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodoini_cargue"
                    no-title
                    scrollable
                    @input="pickerPeriodoini = false"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-menu
                  v-model="pickerPeriodofin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodofin_cargue"
                      label="Fecha Final"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodofin_cargue"
                    no-title
                    scrollable
                    @input="pickerPeriodofin = false"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="2">
                <v-menu
                  v-model="pickerActual"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_rips"
                      label="Fecha de Rips"
                      append-icon="event"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_rips"
                    @input="pickerActual = false"
                  ></v-date-picker>
                </v-menu>
              </v-col> -->
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Max. Facturas x Rips"
                  outlined
                  hide-details
                  v-model="form.limite"
                  @change="errores.limite = false"
                  :error="errores.limite"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  :items="[
                    { text: 'Contributivo', value: 9 },
                    { text: 'Subsidiado', value: 1 },
                    { text: 'Particular', value: 2 },
                    { text: 'Todos', value: 0 },
                  ]"
                  label="Regimen"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.regimen"
                  item-text="text"
                  item-value="value"
                  required
                ></v-select>
              </v-col>

              <v-row justify="center">
                <v-switch v-model="form.vacio" label="Crear Vacio" class="mr-2"></v-switch>
                <v-switch v-model="form.nvaeps" label="Consolidar Nueva Eps" class="mr-2"></v-switch>
              </v-row>

              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargar_facturas"
                >
                  Cargar facturas
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="consecutivo !== null"
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
              v-if="consecutivo != null"
              :loading="load_table"
              :headers="headers"
              :items="facturas"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
            <template v-slot:item.nro_factura="{ item }">
                {{ parseInt(item.nro_factura) }}
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn
                  v-if="parseInt(item.estado) != 0"
                  color="success"
                  class="ma-2 white--text"
                  @click="asignarRips('1', item.nro_factura)"
                  >Agregar</v-btn
                >
                <v-btn
                  v-else
                  color="error"
                  class="ma-2 white--text"
                  @click="asignarRips('0', item.nro_factura)"
                  >Eliminar</v-btn
                >
              </template>
            </v-data-table>
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
      load_contrato: true,
      load_table: false,
      pickerPeriodoini: false,
      pickerPeriodofin: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      pickerActual: false,
      selectContrato: null,
      consecutivo: null,
      facturas: [],
      fecha_rips: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      form: [],
      errores: {
        limite: false,
      },

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "nro_factura" },
        {
          text: "Fecha",
          align: "center",
          value: "fecha",
        },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargarContratos();
    this.periodoini_cargue = this.$moment().format("YYYY-MM-DD");
    this.periodofin_cargue = this.$moment().format("YYYY-MM-DD");
  },
  watch: {},
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  methods: {
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: parseFloat(k.nro) + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    cargar_facturas() {
      if (!this.form.limite) {
        this.errores.limite = true;
        this.send_error(" Selecciona un limite de Facturas");
      } else {
        var vacio = this.form.vacio ? 1 : 0;
        var nvaeps = this.form.nvaeps ? 1 : 0;        
        let limite = this.form.limite;
        let regimen = this.form.regimen.value;
        let contrato1 = this.selectContrato[0];
        let contrato2 = this.selectContrato[1] ? this.selectContrato[1] : "0";
        let datos = {
          url: "Clinico/dlls/titcl104.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            contrato1 +
            "|" +
            contrato2 +
            "|" +
            this.periodoini_cargue.split("-").join("") +
            "|" +
            this.periodofin_cargue.split("-").join("") +
            // this.fecha_rips.split("-").join("") +
            "|" +
            vacio +
            "|" +
            limite +
            "|" +
            regimen +
            "|" +
            nvaeps +
            "|",
          method: "",
        };
        post
          .postData(datos)
          .then((data) => {
            this.consecutivo = data;
            this._cargarTablaFacturas();
          })
          .catch((err) => {
            this.load_contrato = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar facturas",
              estado: true,
            });
          });
      }
    },
    _cargarTablaFacturas() {
      post
        .postData({
          url: "Clinico/dlls/titcl104j.dll",
          data: sessionStorage.Sesion + "|" + this.consecutivo + "|",
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
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar facturas",
            estado: true,
          });
        });
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },

    asignarRips(estado, key) {
      let retornar = this.facturas.filter((e) => {
        if (e.nro_factura == key) {
          return e;
        }
      });
      retornar = retornar[0] || false;

      if (retornar) {
        let datos =
          sessionStorage.Sesion +
          "|" +
          this.consecutivo +
          "|01|" +
          retornar.prefijo +
          " |" +
          retornar.nro_factura +
          "|";
        post
          .postData({
            url: "Clinico/dlls/titcl104a.dll",
            data: datos,
            method: "",
          })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: data[0],
              estado: true,
            });
            this._cargarTablaFacturas();
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar factura",
              estado: true,
            });
          });
      }
    },
  },
};
</script>
