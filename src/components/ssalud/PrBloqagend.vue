<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-lock-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Bloqueo de Agendas..></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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
                      label="Fecha agendamiento"
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
              <v-col class="d-flex" cols="12" sm="7">
                <v-autocomplete
                  outlined
                  label="Médico"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="selectMedico"
                  return-object
                  clearable
                  :error="errores.medico"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="procesartodo()"
                  >Procesar Todo el Dia</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-switch
                v-model="form.tipoproces"
                label="Bloquear/Desbloquear "
              ></v-switch>
            </v-row>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="selectMedico != null"
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
              v-if="selectMedico != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="horaasigna_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado="{ item }">
                <v-btn
                  class="white--text"
                  small
                  label
                  @click="bloquea_hora(item)"
                  :color="`${item.estado == 9 ? 'red' : 'green'} darken-1`"
                  >{{ item.estado == 9 ? "Bloqueada" : "Activa" }}</v-btn
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
      pickerActual: false,
      load_personal: true,
      selectPersonal: null,
      load_table: false,
      selectMedico: null,
      selectObjPersonal: [],
      form: [],
      agendaPaciente: [],
      medicos: [],
      errores: {
        paciente: false,
        punto_fact: false,
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        {
          text: "Boton Bloquear/Desbloquedar",
          align: "center",
          value: "estado",
        },
      ],
    };
  },
  created() {
    this.get_profesionales();
  },
  watch: {
    selectMedico: function (value) {
      this.cargarAgendamiento(this.selectMedico);
    },
  },
  computed: {},
  methods: {
    bloquea_hora: function (item) {
      let tipoproces = this.form.tipoproces ? "1" : "0";
      let datos = {
        url: "Clinico/dlls/titcl102B2.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.fecha_actual.split("-").join("") +
          "|" +
          this.selectMedico.id +
          "|" +
          item.id_hora.split(":").join("") +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.cargarAgendamiento(this.selectMedico);
          this.$emit("snack", {
            color: "success",
            text: "Agenda modificada",
            estado: true,
          });
        })
        .catch((error) => {
          console.log(error);
          this.$emit("snack", {
            color: "error",
            text: "Error al modificar Agenda",
            estado: true,
          });
        });
    },    
    procesartodo: function () {
      let tipoproces = this.form.tipoproces ? "1" : "0";
      let datos = {
        url: "Clinico/dlls/titcl102B1.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.fecha_actual.split("-").join("") +
          "|" +
          this.selectMedico.id +
          "|" +
          tipoproces +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.cargarAgendamiento(this.selectMedico);
          this.$emit("snack", {
            color: "success",
            text: "Agenda modificada",
            estado: true,
          });
        })
        .catch((error) => {
          console.log(error);
          this.$emit("snack", {
            color: "error",
            text: "Error al modificar Agenda",
            estado: true,
          });
        });
    },
    get_profesionales() {
      this.loader = true;
      let agencia = 1;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.medicos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Medicos",
            estado: true,
          });
        });
    },

    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
    },
    cargarAgendamiento: function (value) {
      this.load_table = true;
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.selectMedico.id +
        "|" +
        1 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl102B.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.agendaPaciente = [];
          data.forEach((k, v) => {
            k.nro = (v + 1).toString().padStart(2, "0");
            this.agendaPaciente.push(k);
          });
          this.load_table = false;
        })
        .catch((err) => {
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
            estado: true,
          });
        });
    },
  },
};
</script>
