<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-arrow-decision-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Traslado de Agendas Salud</v-list-item-title
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
                  v-model="form.punto_fact"
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
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerAgendaOrig"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaorig"
                      label="Fecha Origen"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechaorig"
                      @input="errores.fechaorig = false"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaorig"
                    @input="pickerAgendaOrig = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="3">
                <v-menu
                  v-model="pickerAgendaDest"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechadest"
                      label="Fecha Destino"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                      :error="errores.fechadest"
                      @input="errores.fechadest = false"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechadest"
                    @input="pickerAgendaDest = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="Médico Origen"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="form.medOrigen"
                  return-object
                  clearable
                  :error="errores.medicoorig"
                  @change="(errores.medicoorig = false), get_agenda()"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="6">
                <v-autocomplete
                  outlined
                  label="Médico Destino"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="nro"
                  hide-details
                  v-model="form.medDestino"
                  return-object
                  clearable
                  :error="errores.medicodest"
                  @change="errores.medicodest = false"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="get_agenda()"
                  >Consultar</v-btn
                >
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-btn
                  color="purple"
                  class="ma-2 white--text"
                  @click="procesar_traslado()"
                  >Trasladar</v-btn
                >
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-text-field
                  label="Motivo"
                  v-model="form.motivocancela"
                  hide-details
                  clearable
                  outlined
                  :error="errores.motivocancela"
                  @input="errores.motivocancela = false"
                ></v-text-field>
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
      pickerAgendaOrig: false,
      pickerAgendaDest: false,
      pickerDate: null,
      load_table: false,
      selectMedico: null,
      tabla: null,
      eliminar: null,
      fecha_agenda: this.$moment().format("YYYY-MM-DD"),
      hora_ini: this.$moment().format("HH:mm"),
      hora_fin: this.$moment().format("HH:mm"),
      mes_total: false,
      form: {},
      medicos: [],
      agendas: [],
      punto_fact: [],
      agencias: [],
      errores: {
        fechaorig: false,
        fechadest: false,
        medicoorig: false,
        medicodest: false,
        punto_fact: false,
        motivocancela: false,
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
    async procesar_traslado() {
      if (!this.form.punto_fact) {
        this.errores.punto_fact = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar una sede de Servicio",
          estado: true,
        });
      } else if (!this.form.fechaorig) {
        this.errores.fechaorig = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar una fecha de Origen",
          estado: true,
        });
      } else if (!this.form.fechadest) {
        this.errores.fechadest = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar una fecha de Destino",
          estado: true,
        });
      } else if (!this.form.medOrigen) {
        this.errores.medicoorig = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un Médico de Origen",
          estado: true,
        });
      } else if (!this.form.medDestino) {
        this.errores.medicodest = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un Médico de Destino",
          estado: true,
        });
      } else if (!this.form.motivocancela) {
        this.errores.motivocancela = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe indicar un motivo",
          estado: true,
        });
      } else {
        if (this.tabla) {
          let lista = this.tabla;
          for (const item of lista) {
            let res = await this.mover_agenda(item, 0);
            await this.mover_agenda(item, 1);
            
          }
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Debe seleccionar el horario a trasladar!",
            estado: true,
          });
        }
        this.loader = false;
      }
    },
    async mover_agenda(item, tipo) {
      let sede = this.form.punto_fact.codigo_agc;
      let fecha_orig = item.fecha;
      let hora_orig = item.id_hora.split(":").join("");
      let fecha_dest = this.form.fechadest.split("-").join("");
      let med_orig = this.form.medOrigen.id;
      let med_dest = this.form.medDestino.id;
      let motivo = this.form.motivocancela.trim();

      return new Promise((resolve) => {
        post
          .postData({
            url: "Clinico/dlls/PrTraslagend.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              sede +
              "|" +
              fecha_orig +
              "|" +
              fecha_dest +
              "|" +
              med_orig +
              "|" +
              med_dest +
              "|" +
              hora_orig +
              "|" +
              motivo +
              "|" +              
              tipo +
              "|",
            method: "",
          })
          .then((data) => {
            resolve(true);
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al Trasladar Agenda",
              estado: true,
            });
          });
      });
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
    get_agenda() {
      this.agendas = [];
      let fecha_ini = this.form.fechaorig.replace(/\-/g, "");
      let medico = this.form.medOrigen.id;

      post
        .postData({
          url: "Clinico/dlls/titcl102b.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha_ini +
            "|" +
            medico +
            "|" +
            "01" +
            "|" +
            "1" +
            "|" +
            fecha_ini +
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
