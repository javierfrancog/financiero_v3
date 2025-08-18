<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-axis-y-rotate-clockwise
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cancelación de Agendas Salud</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
      </v-card>
      <v-dialog v-model="dialogo.estado" persistent max-width="600px">
        <v-card class="pa-4" elevation="10" tile>
          <v-card-title
            class="headline font-weight-bold grey--text text--darken-3"
          >
            Cancelación masiva de agendamiento
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="mt-4">
            <v-row>
              <v-col cols="12">
                <v-select
                  :items="[
                    { text: 'Cancelación por Profesional', value: 1 },
                    { text: 'Cancelación por Paciente', value: 2 },
                  ]"
                  label="Tipo de cancelación"
                  v-model="form.tipo"
                  outlined
                  dense
                  @change="seleccionar_tipo()"
                  hide-details
                  class="mt-2"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn text color="red" @click="dialogo.estado = false"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogo_profes.estado" persistent max-width="800px">
        <v-card
          class="pa-4"
          elevation="8"
          tile
          style="border: 2px solid #1976d2; border-radius: 8px"
        >
          <v-card-title
            class="headline font-weight-bold grey--text text--darken-3"
          >
            Cancelación masiva por Profesional
          </v-card-title>

          <v-divider class="my-2"></v-divider>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  label="Sede de Servicio"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  return-object
                  :error="errores.punto_fact"
                  @change="
                    get_profesionales();
                    errores.punto_fact = false;
                  "
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
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
                      label="Fecha Agenda"
                      append-icon="event"
                      hide-details
                      :error="errores.fechaorig"
                      @input="errores.fechaorig = false"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaorig"
                    @input="pickerAgendaOrig = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  label="Médico"
                  v-model="form.medOrigen"
                  :items="medicos"
                  :item-text="format_medico"
                  item-value="id"
                  clearable
                  return-object
                  hide-details
                  :error="errores.medicoorig"
                  @change="
                    errores.medicoorig = false;
                    get_agenda();
                  "
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Motivo"
                  v-model="form.motivocancela"
                  clearable
                  hide-details
                  :error="errores.motivocancela"
                  @input="errores.motivocancela = false"
                ></v-text-field>
              </v-col>
            </v-row>
                <v-row class="mt-4 d-flex justify-center" no-gutters>
              <v-col cols="12" sm="7" class="d-flex align-center">
                <v-btn
                  color="indigo"
                  class="mr-2 white--text"
                  @click="get_agenda()"
                >
                  Consultar
                </v-btn>
                <v-btn
                  color="purple darken-2"
                  class="white--text"
                  @click="procesar_cancelacion()"
                >
                  Procesar
                </v-btn>
                <v-btn
                  color="red darken-2"
                  class="ml-3 white--text"
                  @click="dialogo_profes.estado = false"
                >
                  Cerrar
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>

            <v-row v-if="agendas.length != 0">
              <v-col cols="12" sm="6">
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
              v-model="tabla"
              :loading="load_table"
              :headers="headers"
              :items="agendas"
              item-key="nro"
              :search="search"
              :show-select="true"
              hide-default-footer
              disable-pagination
              class="elevation-1"
            >
              <template v-slot:item.estado="{ item }">
                {{
                  item.estado === "0"
                    ? "Activo"
                    : item.estado === "2"
                    ? "Cancelada"
                    : "Desactivado"
                }}
              </template>
              <template v-slot:item.id_hora="{ item }">
                {{ item.id_hora }}
              </template>
            </v-data-table>
          </v-card-text>

          <v-card-actions class="justify-end"> </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogo_pacie.estado" persistent max-width="1000px">
        <v-card
          class="pa-4"
          elevation="8"
          tile
          style="border: 2px solid #1976d2; border-radius: 8px"
        >
          <v-card-title
            class="headline font-weight-bold grey--text text--darken-3"
          >
            Cancelación masiva por Paciente
          </v-card-title>

          <v-divider class="my-2"></v-divider>

          <v-card-text>
            <div class="pa-0 px-8">
              <v-card-text class="px-0 pa-0">
                <v-row class="d-flex justify-center" no-gutters>
                  <v-col class="d-flex" cols="3">
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

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Identificacion"
                      clearable
                      outlined
                      type="number"
                      required
                      v-model="id_numero"
                      @keyup.enter="buscar_paciente()"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="indigo"
                      class="ma-2 white--text"
                      @click="buscar_paciente()"
                      >Buscar</v-btn
                    >
                  </v-col>
                  <v-col
                    v-if="agendas_pac.length != 0"
                    class="mt-2 d-flex"
                    cols="3"
                  >
                    <v-btn
                      color="purple darken-2"
                      class="white--text"
                      @click="procesar_paciente()"
                    >
                      Procesar
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="mb-2 d-flex">
                    <v-text-field
                      label="Motivo"
                      v-model="form.motivocancela"
                      clearable
                      hide-details
                      outlined
                      :error="errores.motivocancela"
                      @input="errores.motivocancela = false"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row> </v-row>
                <v-divider class="my-4"></v-divider>

                <v-row justify="center"></v-row>

                <v-data-table
                  v-if="agendas_pac.length != 0"
                  v-model="tabla_pacie"
                  :loading="load_table"
                  :headers="headers_paci"
                  :items="agendas_pac"
                  item-key="index_rep"
                  :search="search"
                  :show-select="true"
                  hide-default-footer
                  disable-pagination
                  class="elevation-1"
                >
                  <template v-slot:item.id_hora="{ item }">
                    {{ item.id_hora }}
                  </template>
                </v-data-table>
              </v-card-text>
            </div>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn text color="red" @click="dialogo_pacie.estado = false"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
export default {
  inject: ["setLoader", "setLoaderText"],

  data() {
    return {
      search: null,
      pickerAgendaOrig: false,
      pickerAgendaDest: false,
      pickerDate: null,
      load_table: false,
      selectMedico: null,
      tabla: [],
      tabla_pacie: [],
      eliminar: null,
      fecha_agenda: this.$moment().format("YYYY-MM-DD"),
      hora_ini: this.$moment().format("HH:mm"),
      hora_fin: this.$moment().format("HH:mm"),
      form: {},
      medicos: [],
      agendas: [],
      agendas_pac: [],
      punto_fact: [],
      agencias: [],
      años_select: [],
      id_numero: "",
      dialogo: {
        estado: true,
        titulo: null,
        tipo: null,
      },
      dialogo_profes: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_pacie: {
        estado: false,
        titulo: null,
        tipo: null,
      },
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
      headers_paci: [
        { text: "Item", align: "center", value: "index_rep" },
        { text: "Fecha", align: "center", value: "fecha_ag", width: "120px" },
        { text: "Hora", align: "left", value: "hora_ag" },
        { text: "Estado", align: "center", value: "descrestado_rep" },
        { text: "Profesional", align: "left", value: "sala_rep" },
      ],
    };
  },
  created() {
    this.cargarTablaAg();
    this.cargar_años();
  },
  // watch: {
  //   pickerDate(val) {
  //     this.fecha_agenda = null;
  //   },
  // },

  methods: {
    seleccionar_tipo() {
      let tipo = this.form.tipo;
      if (tipo == 1) {
        this.dialogo_profes.estado = true;
        this.dialogo.estado = false;
      } else if (tipo == 2) {
        this.dialogo_pacie.estado = true;
        this.dialogo.estado = false;
      }
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
    async procesar_cancelacion() {
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
      } else if (!this.form.medOrigen) {
        this.errores.medicoorig = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un Médico de Origen",
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
          this.setLoader(true);

          for (const item of lista) {
            let res = await this.procesar_agenda(item);
          }
          this.get_agenda();
          this.setLoader(false);
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Debe seleccionar el horario a cancelar !",
            estado: true,
          });
        }
        this.setLoader(false);
      }
    },
    async procesar_paciente() {
      if (!this.form.motivocancela) {
        this.errores.motivocancela = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe indicar un motivo",
          estado: true,
        });
      } else {
        if (this.tabla_pacie) {
          let lista = this.tabla_pacie;
          this.setLoader(true, "Cancelando Agenda...");

          for (const item of lista) {
            let res = await this.procesar_agenda_pac(item);
          }
          this.buscar_paciente();
          this.setLoader(false);
        } else {
          this.$emit("snack", {
            color: "error",
            text: "Debe seleccionar el horario a cancelar !",
            estado: true,
          });
        }
        this.setLoader(false);
      }
    },
    async procesar_agenda_pac(item) {
      let sede = "0001";
      let fecha_orig = item.fecha_ag.replace(/\-/g, "");
      let hora_orig = item.hora_ag.split(":").join("");
      let med_orig = item.idagenda_ag;
      let motivo = this.form.motivocancela.trim();

      return new Promise((resolve) => {
        post
          .postData({
            url: "Clinico/dlls/PrCancegenda.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              sede +
              "|" +
              fecha_orig +
              "|" +
              med_orig +
              "|" +
              hora_orig +
              "|" +
              motivo +
              "|",
            method: "",
          })
          .then((data) => {
            resolve(true);
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al Cancelar Agenda",
              estado: true,
            });
          });
      });
    },
    async procesar_agenda(item) {
      let sede = this.form.punto_fact.codigo_agc;
      let fecha_orig = item.fecha;
      let hora_orig = item.id_hora.split(":").join("");
      let med_orig = this.form.medOrigen.id;
      let motivo = this.form.motivocancela.trim();

      return new Promise((resolve) => {
        post
          .postData({
            url: "Clinico/dlls/PrCancegenda.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              sede +
              "|" +
              fecha_orig +
              "|" +
              med_orig +
              "|" +
              hora_orig +
              "|" +
              motivo +
              "|",
            method: "",
          })
          .then((data) => {
            resolve(true);
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al Cancelar Agenda",
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
      this.setLoader(true, "Consultado Profesionales...");
      let agencia = this.punto_fact.codigo_agc;
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.setLoader(false);
          this.medicos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.setLoader(false);
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
      console.log(this.form);
      let fecha_ini = this.form.fechaorig.replace(/\-/g, "");
      let medico = this.form.medOrigen.id;
      if (this.validar_Fecha(fecha_ini)) {
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
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Fecha ingresada no puede ser inferior a la Actual !",
          estado: true,
        });
      }
    },
    validar_Fecha(fecha) {
      const año = parseInt(fecha.substring(0, 4), 10);
      const mes = parseInt(fecha.substring(4, 6), 10) - 1;
      const dia = parseInt(fecha.substring(6, 8), 10);

      const fechaIngresada = new Date(año, mes, dia);
      fechaIngresada.setHours(0, 0, 0, 0);
      const fecha_actual = new Date();
      fecha_actual.setHours(0, 0, 0, 0);
      return fechaIngresada >= fecha_actual;
    },
    buscar_paciente() {
      post
        .postData({
          url: "Clinico/dlls/PrAgendaPacJ.dll",
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
          const dataConIndex = data.map((item, index) => ({
            ...item,
            index_rep: index + 1,
          }));

          this.agendas_pac = dataConIndex;
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
