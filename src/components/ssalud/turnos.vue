<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid class="px-0 pa-0" fill-height no-gutters>
        <v-layout
          align-center
          justify-center
          fill-height
          class="px-6 pa-6"
          :style="{ background: 'rgb(56, 97, 173)' }"
        >
          <v-row class="fill-height main-content" no-gutters>
            <v-col cols="12" md="7" lg="7" class="d-flex flex-column">
              <v-card
                max-height="90%"
                height="100%"
                width="100%"
                elevation="0"
                color="white"
                class="text-center d-flex align-center justify-center"
                tile
                :style="{
                  background:
                    'url(https://titansoluciones.cloud/img/901099286.png)',
                  'background-repeat': 'no-repeat',
                  'background-position': 'center center',
                }"
              ></v-card>
              <v-card
                max-height="10%"
                height="100%"
                width="100%"
                elevation="0"
                color="white"
                class="text-center d-flex align-center justify-center"
                tile
              >
                <div class="headline text-capitalize text-left">
                  <b>Fecha:</b>
                  {{ fechaActual }}
                  <br />
                  <b>Hora:</b>
                  {{ horaActual }}
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="5" lg="5" class="align-center d-flex">
              <v-card
                height="100%"
                width="100%"
                elevation="0"
                color="white"
                class="text-center pa-12"
                tile
              >
                <v-card-title
                  class="display-2 font-weight-medium"
                  :style="{ 'font-size': '200%!important' }"
                  >Pacientes</v-card-title
                >
                <v-card-text
                  :style="{ 'max-height': '76vh', overflow: 'auto' }"
                >
                  <v-data-table
                    :headers="headers"
                    :items="turnos_tabla"
                    :items-per-page="10"
                    hide-default-footer
                    disable-pagination
                    hide-default-header
                  >
                    <template v-slot:item.nombre_paciente="{ item }">
                      <span
                        class="title text-capitalize"
                        :style="{ 'font-size': '350%!important' }"
                        >{{ item.nombre_paciente.toLowerCase() }}</span
                      >
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-container>
    </v-content>
    <v-dialog v-model="dialogo.estado" max-width="70%">
      <v-card>
        <!-- <v-card-title class="headline">Llamado</v-card-title> -->
        <div class="pa-12 px-6 display-2 text-center">
          Paciente
          <b>{{ dialogo.nombre_paciente }}</b> favor pasar a
          <b>{{ dialogo.sala_paciente }}</b>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>


export default {
  data() {
    return {
      nit_empresa: null,
      fechaActual: null,
      horaActual: null,
      dialogo: {
        estado: false,
        nombre_paciente: null,
        sala_paciente: null,
      },
      headers: [
        {
          text: "Paciente",
          align: "left",
          value: "nombre_paciente",
          sortable: false,
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
    setInterval(this.get_date, 100);
    setInterval(this.nuevos_llamados, 100);
    this.nit_empresa = this.$route.params.empresa;
  },
  methods: {
    eliminar_llamado(item) {
      // console.log("Item", item);
      var index = this.llamado.indexOf(item);
      this.llamado.splice(index, 1);
      fb.$turnos.doc(item.id).set(
        {
          estado: 0,
        },
        {
          merge: true,
        }
      );
    },
    ventana_llamado(obj) {
      var $this = this;
      let sala = obj.sala;
      $this.dialogo.nombre_paciente = obj.nombre_paciente;
      $this.dialogo.sala_paciente = sala;

      let texto = `Paciente ${obj.nombre_paciente} favor pasar a ${sala}`;
      obj.llamado = true;
      obj.cantidad_llamados = obj.cantidad_llamados + 1;
      obj.tiempo_llamado = new Date().getTime();
      // console.log(new Date(), obj.nombre_paciente);
      if (obj.cantidad_llamados == this.global.cantidad_llamados) {
        $this.eliminar_llamado(obj);
      }
      $this.hablar(texto);

      $this.dialogo.estado = true;
    },
    nuevos_llamados() {
      var $this = this;
      this.llamado.forEach((obj) => {
        var startDate = new Date();
        var end_time = obj.tiempo_llamado;
        var seconds = (startDate.getTime() - end_time) / 1000;
        var minutos = seconds / 60;
        if (minutos > this.global.tiempo_llamado) {
          $this.ventana_llamado(obj);
          setTimeout(() => {
            $this.dialogo.estado = false;
          }, 8000);
        }
      });
    },
    llamar_turnos() {
      var $this = this;
      var llamados = this.llamado.filter((el) => !el.llamado);
      if (llamados.length > 0) {
        llamados.forEach(function (obj, index) {
          var time = index == 0 ? 0 : 5000;
          setTimeout(function () {
            obj.cantidad_llamados = 0;
            $this.ventana_llamado(obj);
            if (index + 1 == llamados.length) {
              setTimeout(() => {
                $this.dialogo.estado = false;
              }, 8000);
            }
          }, time * (index + 1));
        });
      }
    },

    hablar(texto) {
      let synth = window.speechSynthesis;
      let voices = synth.getVoices();
      var utterThis = new SpeechSynthesisUtterance(texto);
      utterThis.voice = voices[0];
      utterThis.rate = 0.6;
      utterThis.pitch = 0.8;
      synth.speak(utterThis);
    },

    _validaTurnos() {
      // 0 Sin atender
      // 1 Llamado
      var atendidos = this.turnos.filter(
        (el) => el.estado == 0 || el.estado == 3
      );
      atendidos.forEach((el) => {
        var buscar = this.llamado.find((item) => {
          let key = item.cita_id + item.cita_fecha + item.cita_hora;
          let key_el = el.cita_id + el.cita_fecha + el.cita_hora;
          return key == key_el;
        });

        if (buscar) {
          // console.log("Eliminado", buscar);
          var index = this.llamado.indexOf(buscar);
          this.llamado.splice(index, 1);
        }
      });

      var llamado = this.turnos.filter((el) => el.estado == 1);
      llamado.forEach((el) => {
        var buscar = this.llamado.find((item) => {
          let key = item.cita_id + item.cita_fecha + item.cita_hora;
          let key_el = el.cita_id + el.cita_fecha + el.cita_hora;
          return key == key_el;
        });
        if (!buscar) this.llamado.push(el);
      });

      this.llamar_turnos();
    },
    get_turnos() {
      var $this = this;
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate());
      var start = new Date().toLocaleString().split(",")[0];
       console.log(start);

      fb.$turnos
        .where("fecha_factura", "==", start)
        .onSnapshot(function (querySnapshot) {
          $this.turnos = [];
          querySnapshot.forEach(function (doc) {
            let obj = doc.data();
            obj.id = doc.id;
            $this.turnos.push(obj);
          });
          $this.turnos_tabla = $this.turnos.filter((el) => el.estado != 3);
          $this._validaTurnos();
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
  },
};
</script>
<style lang="sass">
.v-data-table__wrapper td
  padding: 10px 0!important
  line-height: 4!important
</style>