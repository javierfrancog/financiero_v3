<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-box-multiple-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Procesos Financieros -Manual del Usuario-</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row class="d-flex mb-4 justify-center" no-gutters>
          <v-col cols="6">
            <v-form @submit.prevent="comprobar(search)">
              <v-text-field
                label="Buscar"
                prepend-inner-icon="mdi-magnify"
                append-outer-icon="mdi-send"
                v-model="search"
                clearable
                @click:append-outer="comprobar(search)"
              >
              </v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <div class="py-1 px-8">
          <ul>
            <li><a href="#procesos">1_.Procesos</a></li>
            <li><a href="#conexiones">2_.Reportes</a></li>
            <li><a href="#conexiones">3_.Configuración</a></li>            
            <li><a href="#otro1">Otro 1</a></li>
            <li><a href="#otro2">Otro 2</a></li>
          </ul>
        </div>
        <div class="pt-10 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="mb-6" no-gutters>
              <h4
                class="font-weight-bold text-h6 col-12 subtitles"
                id="procesos"
              >
                1.Procesos Contables
              </h4>
              <p id="procesos_pf">
                Opción que permite registrar las diferentes operaciones de la compañia (comprobantes de egreso, recibos de caja, notas contables)
                
              </p>
              <v-img
                lazy-src="https://titansoluciones.cloud/imgmanual/FIN_1.png"
                max-height="600"
                max-width="800"
                :aspect-ratio="16 / 9"
                src="https://titansoluciones.cloud/imgmanual/FIN_1.png"
              ></v-img>

            </v-row>

            <v-row class="mb-6" no-gutters>
              <h4
                class="font-weight-bold text-h6 col-12 subtitles"
                id="conexiones"
              >
                Conexiones seguras SSL
              </h4>
              <p id="conexiones_pf">
                En e-Misión estamos comprometidos con la seguridad de la
                información suya y de sus clientes, por eso todos nuestros
                recursos están protegidos con conexiones seguras SSL. SSL es el
                acrónimo de Secure Sockets Layer (capa de sockets seguros), la
                tecnología estándar para mantener segura una conexión a
                Internet, así como para proteger cualquier información
                confidencial que se envía entre dos sistemas e impedir que los
                delincuentes lean y modifiquen cualquier dato que se transfiera,
                incluida información que pudiera considerarse personal.
              </p>
            </v-row>

            <v-row class="mb-6" no-gutters>
              <h4 id="otro1" class="font-weight-bold text-h6 col-12 subtitles">
                Otro 1
              </h4>
              <p id="otro1_pf">
                En e-Misión estamos comprometidos con la seguridad de la
                información suya y de sus clientes, por eso todos nuestros
                recursos están protegidos con conexiones seguras SSL. SSL es el
                acrónimo de Secure Sockets Layer (capa de sockets seguros), la
                tecnología estándar para mantener segura una conexión a
                Internet, así como para proteger cualquier información
                confidencial que se envía entre dos sistemas e impedir que los
                delincuentes lean y modifiquen cualquier dato que se transfiera,
                incluida información que pudiera considerarse personal.
              </p>

              <v-img
                lazy-src="https://titansoluciones.cloud/imgmanual/FIN_1.png"
                max-height="600"
                max-width="800"
                :aspect-ratio="16 / 9"
                src="https://titansoluciones.cloud/imgmanual/FIN_1.png"
              ></v-img>
            </v-row>

            <v-row class="mb-6" no-gutters>
              <h4 class="font-weight-bold text-h6 col-12 subtitles" id="otro2">
                Otro 2
              </h4>
              <p id="otro2_pf">
                En e-Misión estamos comprometidos con la seguridad de la
                información suya y de sus clientes, por eso todos nuestros
                recursos están protegidos con conexiones seguras SSL. SSL es el
                acrónimo de Secure Sockets Layer (capa de sockets seguros).
              </p>

              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/SRNmSeUqB0o"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import { FlowerSpinner } from "epic-spinners";

export default {


  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      search: "",
      form: {},
      textosManual: {
        procesos: "",
        procesos_pf: "",
        conexiones: "",
        conexiones_pf: "",
        otro1: "",
        otro1_pf: "",
        otro2: "",
        otro2_pf: "",
      },

      primeroEncontrado: false,
    };
  },
  created() {
    window.scroll(0, 0);
  },
  computed: {},
  methods: {
    comprobar(esto) {
      let textosManual = this.textosManual;
      let elementoActual;

      Object.keys(textosManual).forEach((k) => {
        elementoActual = document.getElementById(k);
        if (textosManual[k] == "") {
          textosManual[k] = elementoActual.innerHTML;
        }

        if (elementoActual.innerHTML.includes(esto)) {
          elementoActual.innerHTML = textosManual[k]
            .split(esto)
            .join("<b style='color:red'>" + esto + "</b>");
          
            if (!this.primeroEncontrado) {
              elementoActual.scrollIntoView();
              this.primeroEncontrado = true;
            } 
        } else {
          elementoActual.innerHTML = textosManual[k];
        }
      });

      this.primeroEncontrado = false;
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>

<style scoped>
.subtitles {
  scroll-margin-top: 70px;
}
</style>
