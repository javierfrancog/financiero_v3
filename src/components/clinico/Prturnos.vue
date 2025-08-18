<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12" align="center" class="pa-0">
            <div>
              <v-img :src="rutalogo" contain width="300"></v-img>
            </div>
          </v-col>
          <!-- <v-btn color="indigo" class="ma-2 white--text" @click="get_turnos()">
          </v-btn> -->

          <!-- <v-col cols="12" align="center" class="pa-0">
            <video controls width="70%" style="height: 30vh">
              <source
                src="https://titansoluciones.cloud/videos/CERAT.mp4"
                type="video/mp4"
              />
              Tu navegador no soporta la reproducción de videos.
            </video>
          </v-col> -->
          <v-col cols="12" class="pa-0">
            <!-- <v-btn
              class="ma-2"
              color="red"
              text
              @click="
                dialogo.estado = false;
                get_turnos();
              "
              >Refrescar</v-btn
            > -->
            <v-card class="mx-1">
              <v-card-text class="pa-0">
                <v-data-table
                  item-style="padding: 0px"
                  :headers="headers"
                  :items="turnos_tabla"
                  hide-default-footer
                  dense
                >
                  <template v-slot:item="{ item }">
                    <tr style="padding: 0">
                      <!-- <td class="text-center" style="font-size: 180%">
                        {{
                          item.abreviafila_rep.trim() +
                          " " +
                          parseFloat(item.consec_rep)
                        }}
                      </td> -->
                      <td class="text-center" style="font-size: 180%">
                        {{ item.descrip_paciente.trim() }}
                      </td>
                      <td class="text-center" style="font-size: 180%">
                        {{ item.abrevia_rep }}
                      </td>

                      <!-- <td class="text-center" style="font-size: 180%">
                        {{ item.estado_rep }}
                      </td> -->
                    </tr>
                  </template>
                  <!-- <template v-slot:item.consec_rep="{ item }">
                    <span style="font-size: 230% !important">{{
                      item.consec_rep
                    }}</span>
                  </template>

                  <template v-slot:item.abrevia_rep="{ item }">
                    <span style="font-size: 230% !important">{{
                      item.abrevia_rep
                    }}</span>
                  </template> -->
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pa-0">
            <div class="text-h6 text-center">
              <b>Fecha:</b>
              {{ fechaActual }}
              <br />
              <b>Hora:</b>
              {{ horaActual }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-dialog v-model="dialogo.estado" max-width="70%" persistent>
      <v-card>
        <!-- <v-card-title class="headline">Llamado</v-card-title> -->
        <div class="pa-12 px-6 display-2 text-center">
          Paciente
          <!-- <b>{{ dialogo.turno }} </b> -->
          <b>{{ dialogo.modulo }}</b>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import post from "../../methods.js";
// const textToSpeech = require("@google-cloud/text-to-speech");
// const client = new textToSpeech.TextToSpeechClient();

// const text = "¡Hola, mundo!";
// const request = {
//   input: { text },
//   voice: { languageCode: "es-ES", name: "es-ES-Wavenet-D" },
//   audioConfig: { audioEncoding: "MP3" },
// };

export default {
  beforeDestroy() {
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
      rutalogo: null,
      selectedVoice: null,
      voices: [],
      form: {},

      dialogo: {
        estado: false,
        turno: null,
        modulo: null,
      },
      headers: [
        // {
        //   text: "Turno En Atención",
        //   align: "center",
        //   value: "consec_rep",
        //   sortable: false,
        //   class: "text-h5",
        // },

        // {
        //   text: "Consecutivo",
        //   align: "center",
        //   value: "consec_rep",
        //   sortable: false,
        //   class: "text-h5",
        // },
        {
          text: "Paciente",
          align: "center",
          value: "descrip_paciente",
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
        // {
        //   text: "Fila",
        //   align: "center",
        //   value: "estado_rep",
        //   sortable: false,
        //   class: "text-h5",
        // },
      ],
      turnos: [],
      turnos_tabla: [],
      llamado: [],
      global: {
        tiempo_llamado: 0.5,
        cantidad_llamados: 2,
      },

      // voces: null,
    };
  },
  created() {
    this.rutalogo = `https://titansoluciones.cloud/img/${parseFloat(
      sessionStorage.Sesion.substr(0, 15)
    )}.png`;

    this.get_turnos();
    // this.prueba();

    this.startTimer();
    setInterval(this.get_date, 100);
    this.loadVoices();
  },

  methods: {
    // prueba() {
    //   client
    //     .synthesizeSpeech(request)
    //     .then((response) => {
    //       const audioContent = response[0].audioContent;
    //       // Aquí puedes hacer algo con el audio generado, por ejemplo, reproducirlo en tu proyecto Vue.js.
    //     })
    //     .catch((err) => {
    //       console.error("Error:", err);
    //     });
    // },
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
          url: "Clinico/dlls/Prturnos01J.dll",
          data: sessionStorage.Sesion + "|" + fila + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.turnos_tabla = [];

          this.loader = false;

          this.turnos_tabla = JSON.parse(JSON.stringify(data));

          // Busca turno con estado 3
          const turnoActivo = data.find((item) => item.estado_rep == 3);
          if (turnoActivo) {
            turnoActivo.turno =
              turnoActivo.abreviafila_rep.trim() +
              " " +
              parseFloat(turnoActivo.consec_rep);
            this.dialogo = {
              estado: true,
              turno: turnoActivo.turno,
              modulo: turnoActivo.descrip_paciente,
            };
            this.llamar(turnoActivo);
          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Turnos",
            estado: true,
          });
        });
    },
    get_date() {
      var actual = new Date();
      var fecha_format = actual.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      var hora_format = actual.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      this.fechaActual = fecha_format;
      this.horaActual = hora_format;
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
        .then((data) => {
          this.dialogo = {
            estado: false,
            turno: null,
            modulo: null,
          };
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
    llamar(item) {
      let texto =
        "Paciente " +
        item.descrip_paciente +
        " pasar a " +
        item.abrevia_rep.trim();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.rate = 1.0;
      utterance.pitch = 0.7;
      utterance.voice = this.voices[0];
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
    loadVoices() {
      this.voices = window.speechSynthesis.getVoices();
    },
    format_voces(val) {
      return `${val.name}`;
    },
  },
};
</script>