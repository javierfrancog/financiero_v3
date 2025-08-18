<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12" align="center" class="pa-0">
            <div>
              <v-img
                src="https://titansoluciones.cloud/img/830512772.png"
                contain
                width="300"
              ></v-img>
            </div>
          </v-col>

          <v-col cols="12" class="pa-0">
            <v-card class="mx-1">
              <v-card-text class="pa-0">
                <v-data-table
                  item-style="padding: 0px"
                  :headers="headers"
                  :items="turnos_tabla"
                  :items-per-page="8"
                  hide-default-footer
                  dense
                >
                  <template v-slot:item="{ item }">
                    <tr style="padding: 0">
                      <td class="text-center" style="font-size: 180%">
                        {{
                          item.abreviafila_rep.trim() +
                          " " +
                          parseFloat(item.consec_rep)
                        }}
                      </td>
                      <td class="text-center" style="font-size: 180%">
                        {{ item.abrevia_rep }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="pa-0">
            <div class="text-h6 text-center">
              <b>Fecha:</b> {{ fechaActual }} <br />
              <b>Hora:</b> {{ horaActual }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="dialogo.estado" max-width="70%" persistent>
      <v-card>
        <div class="pa-12 px-6 display-2 text-center">
          Turno
          <b>{{ dialogo.turno }} </b>
          <b>{{ dialogo.modulo }}</b>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import post from "../../methods.js";

// 🔹 Import modular desde firebaseConfig.js
import {
  db,
  $turnos,
  $ph_usuarios,
  $ph_asambleas,
  $ph_preguntas,
  $ph_respuestas
} from "../../firebaseConfig.js";

export default {
  beforeUnmount() { // Vue 3 usa beforeUnmount
    console.log("cerrado");
    clearInterval(this.intervalId);
    this.intervalId = null;
  },
  data() {
    return {
      timer: null,
      nit_empresa: null,
      fechaActual: null,
      horaActual: null,
      intervalId: null,
      iniciar: true,
      dialogo: {
        estado: false,
        turno: null,
        modulo: null,
      },
      headers: [
        {
          text: "Turno En Atención",
          align: "center",
          value: "consec_rep",
          sortable: false,
          class: "text-h5",
        },
        {
          text: "Módulo",
          align: "center",
          value: "abrevia_rep",
          sortable: false,
          class: "text-h5",
        },
      ],
      turnos: [],
      turnos_tabla: [],
      llamado: [],
      global: {
        tiempo_llamado: 0.5,
        cantidad_llamados: 2,
      },
    };
  },
  created() {
    this.get_turnos();
    this.startTimer();
    setInterval(this.get_date, 100);
  },
  methods: {
    startTimer() {
      const interval = 5000;
      this.intervalId = setInterval(() => {
        this.get_turnos();
      }, interval);
      this.timer_ini = false;
    },
    get_turnos() {
      let fila = 0;
      let agencia = sessionStorage.Sede;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/Prturnos01J.dll",
          data: sessionStorage.Sesion + "|" + fila + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.turnos_tabla = JSON.parse(JSON.stringify(data));
          this.loader = false;

          const turnoActivo = data.find((item) => item.estado_rep == 3);
          if (turnoActivo) {
            turnoActivo.turno =
              turnoActivo.abreviafila_rep.trim() +
              " " +
              parseFloat(turnoActivo.consec_rep);
            this.dialogo = {
              estado: true,
              turno: turnoActivo.turno,
              modulo: turnoActivo.abrevia_rep,
            };
            this.llamar(turnoActivo);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.Code == 3) {
            this.logout();
          }
          this.loader = false;
          this.$emit("snack", {
            color: "indigo",
            text: "Esperando llamado...",
            estado: true,
          });
        });
    },
    get_date() {
      const actual = new Date();
      this.fechaActual = actual.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      this.horaActual = actual.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
    },
    marcar(item) {
      let agenciatr = item.agencia_rep;
      let codtr = item.cod_rep;
      let idtr = item.consec_rep;
      let agenciavt = item.agencia_rep;
      let idvt = 99;
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/Prfilaturno01.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agenciatr +
            "|" +
            codtr +
            "|" +
            idtr +
            "|" +
            agenciavt +
            "|" +
            idvt +
            "|" +
            "3" +
            "|",
          method: "",
        })
        .then(() => {
          this.dialogo = { estado: false, turno: null, modulo: null };
          this.get_turnos();
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al marcar Turnos",
            estado: true,
          });
        });
    },
    logout() {
      let ruta = null;
      let data_auth = sessionStorage.data_auth
        ? JSON.parse(atob(sessionStorage.data_auth))
        : false;
      if (!data_auth) {
        ruta = "/";
      } else if (data_auth?.modulo === "rc") ruta = { name: "loginrc" };
      else if (data_auth?.modulo === "tr") ruta = { name: "logintr" };
      else if (data_auth?.modulo === "pr") ruta = { name: "loginpr" };
      else if (data_auth?.modulo === "resmed") ruta = { name: "Loginresmerakids" };

      sessionStorage.clear();
      this.$router.push(ruta);
    },
    llamar(item) {
      let texto = "Turno " + item.turno + " pasar a " + item.abrevia_rep.trim();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.rate = 1.0;
      utterance.pitch = 0.7;
      let count = 0;

      const hablar = () => {
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => {
          count++;
          if (count === 1) {
            this.marcar(item);
          } else {
            hablar();
          }
        };
      };
      hablar();
    },
  },
};
</script>
