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
                >Habilitar Agendas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6" sm="4">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  return-object
                  @change="
                    get_profesionales();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-menu
                  v-model="pickerAgenda"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_agenda"
                      label="Fecha agendamiento"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_agenda"
                    @input="pickerAgenda = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="7">
                <v-autocomplete
                  outlined
                  label="Sala"
                  :items="salas"
                  :item-text="format_salas"
                  item-value="nro"
                  hide-details
                  v-model="selectSala"
                  return-object
                  clearable
                  :error="errores.salas"
                ></v-autocomplete>
              </v-col>

              <!-- <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  outlined
                  label="Salas"
                  :items="[
                    { text: 'Sala rx', value: '9001' },
                    { text: 'Sala mamografia', value: '9002' },
                    { text: 'Sala ecografia', value: '9003' },
                    { text: 'Sala Biopsias', value: '9004' },
                    { text: 'Sala Densitomeria', value: '9005' },
                  ]"
                  v-model="selectSala"
                ></v-select>
              </v-col> -->
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Hora Inicio"
                  clearable
                  outlined
                  type="time"
                  v-model="hora_ini"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Hora Final"
                  clearable
                  outlined
                  type="time"
                  v-model="hora_fin"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="mes_total"
                  label="Procesar Todo el Mes "
                ></v-switch>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch v-model="eliminar" label="Eliminar"></v-switch>
              </v-col>

              <v-col class="d-flex" cols="12" sm="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="procesartodo()"
                  >Procesar</v-btn
                >
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
                  v-if="agendas.length != 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              v-if="agendas.length != 0"
              :loading="load_table"
              :headers="headers"
              :items="agendas"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estado="{ item }">
                {{ item.estado == "0" ? "Activo" : "Desactivado" }}
              </template>

              <template v-slot:item.action="{ item }">
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
      pickerAgenda: false,
      load_table: false,
      selectSala: null,
      fecha_agenda: this.$moment().format("YYYY-MM-DD"),
      hora_ini: this.$moment().format("HH:mm"),
      hora_fin: this.$moment().format("HH:mm"),
      mes_total: false,
      eliminar: null,
      salas: [],
      agendas: [],
      agencias: [],
      punto_fact:[],
      errores: {
        salas: false,
        punto_fact: false,
      },

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "center", value: "id_hora" },
        { text: "Estado", align: "center", value: "estado" },
        { text: "Opciones", value: "action", align: "center" },
      ],
    };
  },
  created() {
    this.cargarTablaAg();
  },
  watch: {},
  computed: {},
  methods: {
    delete_item: function (item) {
      let fecha = item.fecha;
      let hora = item.id_hora.replace(/\:/g, "");
      let idagenda = this.selectSala.codigo_sala;
      let datos =
        sessionStorage.Sesion +
        "|" +
        fecha +
        "|" +
        idagenda +
        "|" +
        hora +
        "|" +
        hora +
        "|" +
        0 +
        "|" +
        1 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/clPrHabagend.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Agenda Eliminada",
            estado: true,
          });
          this.get_agenda();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al eliminar agenda",
            estado: true,
          });
        });
    },
    procesartodo: function () {
      let mes_total = this.mes_total ? "1" : "0",
        fecha_agenda = this.fecha_agenda.split("-").join(""),
        hora_ini = this.hora_ini.split(":").join(""),
        hora_fin = this.hora_fin.split(":").join("");

      if (!fecha_agenda) {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar una fecha",
          estado: true,
        });
      } else if (parseInt(hora_fin) < parseInt(hora_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la inicial",
          estado: true,
        });
      } else if (!this.selectSala) {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar una sala",
          estado: true,
        });
      } else {
        let eliminar = this.eliminar ? "1" : "0";
        let datos =
          sessionStorage.Sesion +
          "|" +
          this.fecha_agenda.split("-").join("") +
          "|" +
          this.selectSala.codigo_sala +
          "|" +
          this.hora_ini.split(":").join("") +
          "|" +
          this.hora_fin.split(":").join("") +
          "|" +
          mes_total +
          "|" +
          eliminar +
          "|";
        post
          .postData({
            url: "Clinico/dlls/clPrHabagend.dll",
            data: datos,
            method: "",
          })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: "Agenda habilitada",
              estado: true,
            });
            this.get_agenda();
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al habilitar agenda",
              estado: true,
            });
          });
      }
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
    get_profesionales() {
      this.loader = true;
      let agencia = this.punto_fact.codigo_agc;
      post
        .postData({
          url: "Clinico/dlls/ClCfSalasJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.salas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Salas",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_salas(val) {
      return parseFloat(val.codigo_sala) + " - " + val.descrip_sala;
    },
    get_agenda: function () {
      post
        .postData({
          url: "Clinico/dlls/titcl102b.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.fecha_agenda.split("-").join("") +
            "|" +
            this.selectSala.codigo_sala +
            "|" +
            "01" +
            "|",
          method: "",
        })
        .then((data) => {
          let nro = 1;
          this.agendas = data;
          this.agendas.forEach((e) => {
            e.nro = nro++;
          });
        })
        .then((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendas",
            estado: false,
          });
        });
    },
  },
};
</script>
