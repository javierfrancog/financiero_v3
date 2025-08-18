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
                >Habilitar Agendas Salud</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="6">
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
                      clearable
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    multiple
                    v-model="fecha_agenda"
                    :picker-date.sync="pickerDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
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
                  @change="get_agenda()"
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
              <v-col class="d-flex" cols="3">
                <v-text-field
                  label="Hora Inicio"
                  clearable
                  outlined
                  type="time"
                  v-model="hora_ini"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
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
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="get_agenda()"
                  >Consultar</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-btn
                  color="purple"
                  class="ma-2 white--text"
                  @click="procesartodo()"
                  >Habilitar</v-btn
                >
              </v-col>
              <v-col class="d-flex" cols="4">
                <v-btn
                  color="red"
                  class="ma-2 white--text"
                  @click="eliminar_ag()"
                  >Eliminar</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-switch
                  v-model="mes_total"
                  label="Procesar Todo el Mes "
                ></v-switch>
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
              v-model="tabla"
              :loading="load_table"
              :single-expand="false"
              :headers="headers"
              :items="agendas"
              item-key="nro"
              :show-select="true"
              :search="search"
              hide-default-footer
              disable-pagination
            >
              <template v-slot:item.estado="{ item }">
                {{ item.estado == "0" ? "Activo" : "Desactivado" }}
              </template>
              <template v-slot:item.id_hora="{ item }">
                <td>{{ item.id_hora }}</td>
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
      pickerDate: null,
      load_table: false,
      selectMedico: null,
      tabla: null,
      eliminar: null,
      fecha_agenda: this.$moment().format("YYYY-MM-DD"),
      hora_ini: this.$moment().format("HH:mm"),
      hora_fin: this.$moment().format("HH:mm"),
      mes_total: false,
      medicos: [],
      agendas: [],
      punto_fact: [],
      agencias: [],
      errores: {
        medico: false,
        punto_fact: false,
      },

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Fecha", align: "center", value: "fecha" },
        { text: "Hora", align: "left", value: "id_hora" },
        { text: "Estado", align: "center", value: "estado" },
        { text: "Habilita", align: "left", value: "asigna_rep" },
        { text: "Fecha Habilita", align: "center", value: "fechaasigna_rep" },
        { text: "Hora Habilita", align: "center", value: "horaasigna_rep" },
      ],
    };
  },
  created() {
    this.cargarTablaAg();
  },
  // watch: {
  //   pickerDate(val) {
  //     this.fecha_agenda = null;
  //   },
  // },
  computed: {},
  methods: {
    procesartodo: async function () {
      let fecha_agenda = this.fecha_agenda,
        hora_ini = this.hora_ini.split(":").join(""),
        hora_fin = this.hora_fin.split(":").join("");

      if (!this.fecha_agenda) {
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
      } else if (!this.selectMedico) {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un Profesional",
          estado: true,
        });
      } else {
        for await (const item of fecha_agenda) {
          this.onProcesarTodo(item);
        }

        this.get_agenda();
      }
    },
    async onProcesarTodo(fecha_agenda) {
      try {
        let eliminar = this.eliminar ? "1" : "0";
        let mes_total = this.mes_total ? "1" : "0";
        let datos =
          sessionStorage.Sesion +
          "|" +
          fecha_agenda.split("-").join("") +
          "|" +
          this.selectMedico.id +
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
            this.get_agenda();
            this.$emit("snack", {
              color: "success",
              text: "Agenda habilitada",
              estado: true,
            });
            return true;
          })
          .catch((err) => {
            console.log(err);
            this.$emit("snack", {
              color: "error",
              text: "Error al habilitar agenda",
              estado: true,
            });
            return true;
          });
      } catch (error) {
        console.log("Error procesando: ", error);
        return true;
      }
    },

    delete_agenda(item) {
      let fecha_agenda = item.fecha;
      let medico = this.selectMedico.id;
      let hora = item.id_hora.replace(/\:/g, "");
      return new Promise((resolve) => {
        post
          .postData({
            url: "Clinico/dlls/clPrHabagend.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              fecha_agenda +
              "|" +
              medico +
              "|" +
              hora +
              "|" +
              hora +
              "|" +
              0 +
              "|" +
              1 +
              "|",
            method: "",
          })
          .then((data) => {
            resolve(true);
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al Eliminar Agenda",
              estado: true,
            });
          });
      });
    },

    async eliminar_ag() {
      this.loader = true;

      if (this.tabla) {
        let lista = this.tabla;
        for (const item of lista) {
          let res = await this.delete_agenda(item);
        }
        this.get_agenda2();
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe seleccionar el horario a eliminar!",
          estado: true,
        });
      }
      this.loader = false;
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
            text: "Error al cargar Salas",
            estado: true,
          });
        });
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
    },
    get_agenda: function () {
      this.agendas = [];
      let fecha = null;
      if (this.fecha_agenda.length > 0) {
        fecha = this.fecha_agenda[0].replace(/\-/g, "");
      } else {
        this.fecha_agenda.replace(/\-/g, "");
      }

      let fecha_fin = this.fecha_agenda[1]
        ? this.fecha_agenda[1].split("-").join("")
        : 0;

      if (fecha < 2000) {
        fecha = this.fecha_agenda.split("-").join("");
      } else {
        fecha = this.fecha_agenda[0].split("-").join("");
      }
      post
        .postData({
          url: "Clinico/dlls/titcl102b.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            this.selectMedico.id +
            "|" +
            "01" +
            "|" +
            "1" +
            "|" +
            fecha_fin +
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
    get_agenda2: function () {
      this.agendas = [];
      let fecha = null;

      if (Array.isArray(this.fecha_agenda) == false) {
        fecha = this.fecha_agenda.replace(/\-/g, "");
      } else {
        fecha = this.fecha_agenda[0].replace(/\-/g, "");
      }

      post
        .postData({
          url: "Clinico/dlls/titcl102b.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            this.selectMedico.id +
            "|" +
            "01" +
            "|" +
            "1" +
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
