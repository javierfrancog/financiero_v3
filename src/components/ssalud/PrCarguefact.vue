<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cart-arrow-down</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue de Facturas ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  :items="contratos"
                  :item-text="format_contrato"
                  item-value="nro"
                  hide-details
                  :loading="load_contrato"
                  v-model="selectContrato"
                  @change="get_servicios"
                  clearable
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="3" v-if="division == 901099286">
                <v-select
                  :items="[
                    { text: 'Laboratorio', value: 1 },
                    { text: 'Salud Ocupacional', value: 2 },
                    { text: 'No Aplica', value: 99 },
                  ]"
                  label="División"
                  outlined
                  clearable
                  hide-details
                  @change="errores.division = false"
                  v-model="form.division"
                  :error="errores.division"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerIniCargue"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_inicargue"
                      label="Fecha Inicial de Cargue"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_inicargue"
                    @input="pickerIniCargue = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerFinCargue"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_fincargue"
                      label="Fecha Final de Cargue"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_fincargue"
                    @input="pickerFinCargue = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-autocomplete
                  label="Servicio"
                  :items="servicios"
                  outlined
                  clearable
                  return-object
                  required
                  item-value="codigo"
                  v-model="form.servicio"
                  :item-text="format_servicios"
                ></v-autocomplete>
              </v-col>

              <v-col cols="3">
                <v-select
                  :items="regimen"
                  label="Régimen"
                  outlined
                  clearable
                  hide-details
                  v-model="form.regimen"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  outlined
                  label="Tipo de Cargue"
                  :items="[
                    { text: 'Factura por Paciente', value: '1' },
                    { text: 'MultiPacientes', value: '2' },
                  ]"
                  v-model="selectTipo"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-menu
                  v-model="pickerActual"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_actual"
                      label="Fecha de la Factura"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @input="pickerActual = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="get_facturas"
                >
                  Generar
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  label="Factura Inicial"
                  v-model="fact_ini"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  label="Factura Final"
                  v-model="fact_fin"
                ></v-text-field>
              </v-col>
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
      servicio: "Imagenologia",
      pickerIniCargue: false,
      pickerFinCargue: false,
      fecha_cargue: this.$moment().format("YYYY-MM"),
      load_contrato: true,
      load_table: false,
      pickerActual: false,
      selectContrato: null,
      selectTipo: null,
      fecha_factura: null,
      servicios: [],
      agencias: [],
      division: 0,
      errores: {
        division: false,
        punto_fact: false,
      },

      regimen: [
        { text: "Todos", value: 9 },
        { text: "Subsidiado", value: 1 },
        { text: "Contributivo", value: 8 },
      ],

      fact_ini: null,
      fact_fin: null,
      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      nameRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && v.length <= 60) || "Maximo 20 digitos",
      ],
      contratos: [],
      form: {
        division: 0
      },
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
        },
        { text: "Descripcion", align: "center", value: "desc_servicio" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarContratos();
    this.cargarTablaAg();
    this.fecha_inicargue = this.$moment().format("YYYY-MM-01");
    this.fecha_fincargue = this.$moment().format("YYYY-MM-01");
  },

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
    async cargar_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
          this.division = parseFloat(this.empresa[0].id_empr);
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },

    format_contrato(val) {
      return val.nro + " - " + val.detalle;
    },
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
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
    get_servicios() {
      var $this = this;
      if ($this.selectContrato) {
        post
          .postData({
            url: "Clinico/dlls/titCL304j.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              $this.selectContrato.nro +
              "|" +
              1 +
              "|",
            method: "POST",
          })
          .then((data) => {
            $this.servicios = data[0].servicios;
          })
          .catch((err) => {
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar servicios",
              estado: true,
            });
          });
      } else {
        $this.servicios = [];
      }
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_servicios(val) {
      return `${val.codigo} - ${val.descripcion}`;
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_facturas() {
      if (!this.form.division && this.division == 901099286) {
        this.errores.division = true;
        $this.alerta_error("Selecciona una División");
      } else {
        let punto = this.form.punto_fact.codigo_agc;
        let cups = this.form.servicio.codigo.trim();
        let regimen = this.form.regimen;
        let division = this.form.division
          ? this.form.division
          : 99;
        let datos =
          sessionStorage.Sesion +
          "|" +
          "01|" +
          this.selectContrato.identificacion +
          "|" +
          this.selectTipo +
          "|" +
          this.fecha_inicargue.split("-").join("") +
          "|" +
          this.fecha_fincargue.split("-").join("") +
          "|" +
          this.fecha_actual.split("-").join("") +
          "|" +
          this.selectContrato.nro +
          "|" +
          cups +
          "|" +
          regimen +
          "|" +
          punto +
          "|" +
          division +
          "|";
        post
          .postData({
            url: "Clinico/dlls/titcl103S.dll",
            data: datos,
            method: "",
          })
          .then((data) => {
            let resp = data[0].split("|");
            this.fact_ini = resp[0];
            this.fact_fin = resp[1];
          })
          .catch((err) => {
            console.log(err);
            this.load_contrato = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar facturas",
              estado: true,
            });
          });
      }
    },
  },
};
</script>
