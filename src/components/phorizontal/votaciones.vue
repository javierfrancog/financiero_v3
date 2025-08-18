<template>
  <v-app>
    <v-layout align-center justify-center :style="{ background : '#e3f2fd'}">
      <v-flex lg6 class="d-flex justify-center pa-5 px-0">
        <v-card
          elevation="3"
          class="pa-6 pb-3 col-11 col-lg-9 col-md-8 col-sm-8 special-shadow pt-0"
          max-height="90%"
          :loading="load_card"
          :disabled="load_card"
        >
          <v-row class="d-flex justify-center pt-6">
            <v-img
              :src="require('../../assets/logo_cotrem.png')"
              max-height="200"
              max-width="60%"
              contain
            ></v-img>
          </v-row>
          <v-row v-if="formulario">
            <v-col class="text-center col-lg-7 col-12 col-md-8">
              <v-text-field
                label="Token"
                outlined
                hide-details
                append-icon="mdi-key-outline"
                color="green darken-2"
                v-model="input_token"
              ></v-text-field>
            </v-col>
            <v-col class="col-lg-5 col-12 d-flex align-center col-md-4">
              <v-btn color="green" depressed block x-large class="white--text" @click="ingresar">
                <v-icon left>mdi-send</v-icon>Ingresar
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="alerta.estado">
            <v-col cols="12" class="text-center">
              <v-alert dense :type="alerta.tipo" v-html="alerta.msj" class="mb-0"></v-alert>
            </v-col>
            <v-col class="cols-12">
              <v-btn depressed color="red" outlined @click="$router.go(-1)">
                <v-icon left>mdi-arrow-left-circle</v-icon>Regresar
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="loader">
            <v-col cols="12" class="text-center">
              <v-progress-circular :size="40" :width="4" color="blue darken-2" indeterminate></v-progress-circular>
              <br />
              <span>Verificando información. Por favor espere.</span>
            </v-col>
          </v-row>
          <div v-if="show.general">
            <v-row>
              <v-col class="text-center" cols="12">
                <span class="text-h5 font-weight-medium">{{asamblea ? asamblea.descripcion : null}}</span>
              </v-col>
              <v-col cols="12" class="text-center pt-0">
                <v-card outlined class="pa-2 rounded-sm" color="green lighten-5">
                  <span class="subtitle-1 font-weight-medium text-uppercase">
                    <b>{{usuario ? usuario.nombres : null}}</b>
                    <br />
                    {{usuario ? usuario.correo : null}}
                  </span>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="show.pregunta">
              <v-col>
                <v-card outlined class="pa-2 rounded-sm" color="grey lighten-4">
                  <v-row>
                    <v-col
                      cols="12"
                      class="text-center font-weight-medium text-h6 text-lg-h5 pb-0"
                    >{{pregunta ? pregunta.descripcion : null}}</v-col>
                    <v-col class="d-flex justify-center pb-0">
                      <v-chip
                        label
                        small
                        class="text-uppercase overline white--text"
                        color="blue accent-3"
                      >{{pregunta ? (pregunta.tipo_pregunta ? pregunta.tipo_pregunta.text : null) :null}}</v-chip>
                    </v-col>
                  </v-row>
                  <v-row class="d-flex justify-center">
                    <v-col
                      cols="11"
                      lg="8"
                      v-if="pregunta.tipo_pregunta ? pregunta.tipo_pregunta.value == 1 : false"
                    >
                      <v-checkbox
                        v-for="(item,i) in pregunta.respuestas"
                        :key="i"
                        :label="item"
                        :value="i"
                        hide-details
                        v-model="respuestas"
                        color="blue accent-3"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="11" lg="8" v-else>
                      <v-radio-group v-model="respuestas" :mandatory="false">
                        <v-radio
                          v-for="(item,i) in pregunta.respuestas"
                          :key="i"
                          :label="item"
                          :value="i"
                          color="blue accent-3"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        depressed
                        color="green darken-1"
                        class="white--text"
                        large
                        @click="guardar_respuesta"
                      >
                        <v-icon left>mdi-send</v-icon>Enviar respuesta
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-divider />
                      <div class="pa-2 pb-0 text-center">
                        Tiempo de respuesta
                        <br />
                        <b>{{ tiempo_respuesta_format}}</b>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="show.grafico">
              <v-col>
                <v-card outlined class="pa-2 rounded-sm" color="grey lighten-4">
                  <v-col
                    cols="12"
                    class="text-center font-weight-medium text-h6 text-lg-h5 pb-0"
                  >{{ grafico_pregunta}}</v-col>
                  <div>
                    <apexchart
                      ref="realtimeChart"
                      type="bar"
                      height="350"
                      :options="chartOptions"
                      :series="series"
                    ></apexchart>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-row no-gutters v-if="!show.pregunta">
              <v-col>
                <v-col cols="12">
                  <v-alert type="info" class="mb-0" text>No hay preguntas disponibles</v-alert>
                </v-col>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar.estado" :color="snackbar.color" :timeout="10000" bottom right>
      {{ snackbar.text }}
      <v-btn @click="snackbar.estado = false" icon class="white--text">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<style lang="sass" scoped>
.special-shadow
  box-shadow: 0 25px 20px -20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.06)!important

.theme--light.v-label
  color: #000!important
</style>
<script>
import post from "../../methods.js";

import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      token: null,
      loader: false,
      formulario: false,
      alerta: {
        estado: false,
        msj: null,
        tipo: null
      },
      input_token: null,
      usuario: null,
      asamblea: null,
      pregunta: {
        tipo_pregunta: null
      },
      show: {
        general: false,
        pregunta: false,
        grafico: false
      },
      respuestas: [],
      snackbar: {
        estado: false
      },
      load_card: false,
      series: [
        {
          name: "Votos",
          data: []
          // data: [21, 22, 10, 28, 16, 21, 13, 30]
        }
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function(chart, w, e) {
              // console.log(chart, w, e)
            }
          }
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true
          }
        },
        dataLabels: {
          enabled: true
        },
        legend: {
          show: false
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "12px"
            }
          }
        }
      },
      grafico_pregunta: null,
      tiempo_respuesta_format: null,
      verificando: false
    };
  },
  watch: {
    $route(to, from) {
      this.validar_ingreso();
    }
  },
  created() {
    setInterval(this.tiempo_respuesta, 100);
    this.validar_ingreso();
  },
  methods: {
    tiempo_respuesta() {
      if (this.pregunta && this.pregunta.id && !this.show.grafico) {
        var inicio = this.pregunta.activacion.inicio;
        var actual = new Date().getTime();
        var corrido = (actual - inicio) / 1000;
        var restante = this.pregunta.activacion.tiempo - corrido;
        this.tiempo_respuesta_format = this.sec2time(restante);

        if (restante < 0 && !this.show.grafico && !this.verificando) {
          this.verificando = true;
          this.show.pregunta = false;
          var envio = {
            pregunta: this.pregunta,
            usuario: this.usuario,
            respuestas: [],
            respondio: false,
            fechaRegistro: fb.firebaseObj.firestore.Timestamp.fromDate(
              new Date()
            )
          };

          this.load_card = true;
          fb.$ph_respuestas
            .add(envio)
            .then(ref => {
              this.load_card = false;
              this.show.pregunta = false;
              this.show.grafico = true;

              this.verificar_pregunta(this.pregunta);
              this.msj("Respuesta grabada correctamente", "green");
            })
            .catch(err => {
              this.load_card = false;
              this.msj(
                "Ha ocurrido un error mientras se graba tu respuesta. Por favor inténtalo de nuevo.",
                "error"
              );
              console.error(err);
            });
        }
      }
    },
    graficar(pregunta, respuestas) {
      // console.log(pregunta);
      var labels = [];
      var resultados = [];
      pregunta.respuestas.forEach((el, index) => {
        labels.push(el.split(" ").slice(0, 2));
        resultados.push(0);
      });

      respuestas.forEach(el => {
        el.respuestas.forEach(item => {
          resultados[item.id] += 1;
        });
      });

      console.log(resultados);
      this.grafico_pregunta = pregunta.descripcion;
      this.chartOptions.xaxis.categories = labels;
      if (this.$refs.realtimeChart) {
        this.$refs.realtimeChart.updateSeries(
          [
            {
              data: resultados
            }
          ],
          false,
          true
        );
        this.$refs.realtimeChart.updateOptions(this.chartOptions);
      }
    },
    graficar_pregunta(pregunta) {
      var $this = this;
      var id_pregunta = pregunta.id;
      fb.$ph_respuestas
        .where("pregunta.id", "==", id_pregunta)
        .onSnapshot(function(querySnapshot) {
          var respuestas = [];
          querySnapshot.forEach(function(doc) {
            let data = doc.data();
            data.id = doc.id;
            respuestas.push(data);
          });

          $this.graficar(pregunta, respuestas);
        });
    },
    verificar_pregunta(pregunta) {
      var $this = this;
      var id_pregunta = pregunta.id;
      var id_tercero = this.usuario.id;
      this.grafico_pregunta = null;

      console.log("Verificar", id_pregunta, id_tercero);
      fb.$ph_respuestas
        .where("pregunta.id", "==", id_pregunta)
        .where("usuario.id", "==", id_tercero)
        .get()
        .then(doc => {
          if (doc.empty) {
            $this.pregunta = pregunta;
            $this.show.pregunta = true;
            $this.show.grafico = false;
            $this.verificando = false;
          } else {
            $this.pregunta = null;
            $this.show.grafico = true;
            $this.show.pregunta = false;
            $this.graficar_pregunta(pregunta);
          }
        });
    },
    guardar_respuesta() {
      var $this = this;
      var respuesta = this.respuestas;
      if (
        respuesta == null ||
        (typeof respuesta === "object" && respuesta.length == 0)
      ) {
        this.msj("Debes seleccionar una respuesta");
      } else {
        var opciones = this.pregunta.respuestas;
        var tipo_pregunta = this.pregunta.tipo_pregunta.value;
        var respuestas_selecionadas = [];

        if (tipo_pregunta == 1) {
          respuesta.forEach(el => {
            var descripcion = opciones[el];
            respuestas_selecionadas.push({
              id: el,
              descripcion
            });
          });
        } else {
          var descripcion = opciones[respuesta];
          respuestas_selecionadas.push({
            id: respuesta,
            descripcion
          });
        }

        var envio = {
          pregunta: this.pregunta,
          usuario: this.usuario,
          respuestas: respuestas_selecionadas,
          respondio: true,
          fechaRegistro: fb.firebaseObj.firestore.Timestamp.fromDate(new Date())
        };

        this.load_card = true;

        var envio_dll = `0000008920993390000000173369632020050106194901|${this.asamblea.id}|${this.pregunta.id}|${this.usuario.id}|${respuestas_selecionadas[0].id}|`;
        console.log(envio_dll);
        post
          .postData({
            url: "phorizontal/dlls/PhPrvotacionJ.dll",
            data: envio_dll,
            method: "POST"
          })
          .then(data => {
            fb.$ph_respuestas
              .add(envio)
              .then(ref => {
                $this.load_card = false;
                $this.show.pregunta = false;
                $this.show.grafico = true;

                $this.verificar_pregunta(this.pregunta);
                $this.msj("Respuesta grabada correctamente", "green");
              })
              .catch(err => {
                console.error(err);
                $this.load_card = false;
                $this.msj(
                  "Ha ocurrido un error mientras se graba tu respuesta. Por favor inténtalo de nuevo.",
                  "error"
                );
              });
          })
          .catch(err => {
            console.error(err);
            $this.load_card = false;
            $this.msj("Votación ya realizada", "error");
          });
      }
    },
    consultar_preguntas() {
      var $this = this;
      var id_asamblea = this.asamblea.id;
      fb.$ph_preguntas
        .where("asamblea.id", "==", id_asamblea)
        .where("estado", "==", 0)
        .onSnapshot(function(querySnapshot) {
          $this.respuestas = null;
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function(doc) {
              let data = doc.data();
              data.id = doc.id;
              if (data.tipo_pregunta.value == 1) $this.respuestas = [];
              else $this.respuestas = null;
              $this.verificar_pregunta(data);
            });
          } else {
            $this.show.grafico = false;
            $this.pregunta = null;
            $this.show.pregunta = false;
          }
        });
    },
    validar_ingreso() {
      this.token = this.$route.params.token;
      if (!this.token) {
        this.formulario = true;
        this.show.general = false;
        this.input_token = null;
        this.alerta = {
          estado: false,
          msj: null,
          tipo: null
        };
      } else {
        this.formulario = false;
        this.consultar_usuario();
      }
    },
    ingresar() {
      var token = this.input_token;
      this.$router.push({ name: "votaciones", params: { token } });
    },
    consultar_asamblea() {
      var $this = this;
      var empresa = this.usuario.empresa;
      fb.$ph_asambleas
        .where("nit_empresa", "==", parseInt(empresa))
        .where("estado", "==", 0)
        .onSnapshot(function(querySnapshot) {
          if (querySnapshot.empty) {
            $this.error(
              "No se ha encontrado ninguna asamblea disponible. Por favor intenta de nuevo más tarde."
            );
          } else {
            $this.alerta.estado = false;
            querySnapshot.forEach(function(doc) {
              let data = doc.data();
              data.id = doc.id;
              $this.asamblea = data;
            });

            $this.show.general = true;
            $this.loader = false;
            $this.consultar_preguntas();
          }
        });
    },
    consultar_usuario() {
      var $this = this;
      var token = this.token;
      $this.loader = true;
      fb.$ph_usuarios
        .where("token", "==", parseInt(this.token))
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot.empty) {
            $this.error(
              "No se ha podido encontrar la información del usuario.<br> Por favor intenta nuevamente con otro <b>Token</b>."
            );
          } else {
            querySnapshot.forEach(function(doc) {
              let data = doc.data();
              data.id = doc.id;
              $this.usuario = data;
              $this.consultar_asamblea();
            });
          }
        })
        .catch(function(error) {
          console.error(error);
          $this.error(
            "Ha ocurrido un error durante la consulta. Intenta de nuevo más tarde."
          );
        });
    },
    sec2time(timeInSeconds) {
      var pad = function(num, size) {
          return ("000" + num).slice(size * -1);
        },
        time = parseFloat(timeInSeconds).toFixed(3),
        hours = Math.floor(time / 60 / 60),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);

      return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
    },
    msj(text, color) {
      this.snackbar.estado = true;
      this.snackbar.text = text;
      this.snackbar.color = color ? `${color} darken-2` : "red darken-3";
    },
    error(msj) {
      this.loader = false;
      this.alerta.tipo = "error";
      this.alerta.estado = true;
      this.alerta.msj = msj;
      this.show.general = false;
    }
  }
};
</script>