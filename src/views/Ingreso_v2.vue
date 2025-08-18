<template>
  <v-main id="ingreso_v2">
    <v-row class="fill-height">
      <v-col
        class="d-flex align-center justify-center"
        :style="{ background: '#FFF' }"
      >
        <v-card width="80%" max-width="600" flat color="transparent">
          <v-row>
            <v-col class="mb-6">
              <v-img
                :src="require('../assets/titan_logo_2.png')"
                contain
                max-width="200px"
                class="mx-auto"
              ></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Empresa"
                outlined
                clearable
                hide-details
                prepend-inner-icon="domain"
                type="text"
                single-line
                v-model="form.empresa"
                :error="error.empresa"
                @input="error.empresa = false"
                :disabled="disabled_inpt"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Usuario"
                outlined
                clearable
                hide-details
                prepend-inner-icon="person_outline"
                type="text"
                single-line
                v-model="form.usuario"
                :error="error.usuario"
                @input="error.usuario = false"
                :disabled="disabled_inpt"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Contraseña"
                outlined
                clearable
                hide-details
                single-line
                prepend-inner-icon="lock_outline"
                :append-icon="mode_pass ? 'visibility_off' : 'visibility'"
                :type="mode_pass ? 'text' : 'password'"
                @click:append="mode_pass = !mode_pass"
                v-model="form.clave"
                :error="error.clave"
                @input="error.clave = false"
                :disabled="disabled_inpt"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                depressed
                color="blue accent-3"
                class="white--text"
                large
                @click="ingresar"
                :loading="loader_btn"
              >
                Ingresar
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col class="bg-right-v2">
        <div class="bg-right-wrapper">
          <svg
            class="auth-module--vector-bottom-right"
            width="304"
            height="493"
            viewBox="0 0 304 493"
            fill="none"
          >
            <path
              d="M3.7576e-06 177.766L1.22256e-06 390.35C1.20488e-06 391.833 0.820493 393.194 2.13181 393.887L188.647 492.403C191.311 493.81 194.515 491.879 194.515 488.866L194.515 180.176C194.515 178.694 193.695 177.333 192.385 176.64L5.86913 78.0601C3.20523 76.6521 4.94034e-06 78.5834 4.90441e-06 81.5965L3.7576e-06 177.766Z"
              fill="#003AAF"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M129.142 108.843C127.825 108.152 127 106.788 127 105.301L127 33.0803L127 4.00552C127 0.997467 130.196 -0.934235 132.859 0.463745L192.859 31.9565C194.175 32.6475 195 34.0116 195 35.4983L195 136.773C195 139.781 191.805 141.713 189.142 140.316L129.142 108.843ZM223.485 236.594C222.173 235.902 221.352 234.54 221.352 233.056L221.352 144.526L221.352 107.673C221.352 104.661 224.555 102.729 227.219 104.135L301.611 143.4C302.923 144.093 303.744 145.455 303.744 146.938L303.744 272.296C303.744 275.308 300.542 277.239 297.878 275.834L223.485 236.594Z"
              fill="#003AAF"
            ></path>
          </svg>
          <svg
            class="auth-module--vector-top-left"
            width="232"
            height="300"
            viewBox="0 0 232 300"
            fill="none"
          >
            <path
              d="M-9.96161e-06 71.9718L-3.24971e-06 225.522C-3.1847e-06 227.009 0.825095 228.374 2.14215 229.065L136.259 299.404C138.922 300.801 142.117 298.869 142.117 295.861L142.117 74.3899C142.117 72.9031 141.292 71.539 139.975 70.8481L5.85877 0.463562C3.19531 -0.934204 -1.3064e-05 0.997498 -1.29325e-05 4.00546L-9.96161e-06 71.9718Z"
              fill="#FFB91D"
            ></path>
            <path
              d="M166.873 60.174L166.873 129.227C166.873 130.711 167.695 132.073 169.007 132.765L225.754 162.697C228.417 164.102 231.62 162.171 231.62 159.159L231.62 62.5857C231.62 61.1023 230.799 59.7407 229.487 59.0482L172.74 29.0968C170.077 27.6907 166.873 29.6221 166.873 32.6342L166.873 60.174Z"
              fill="#FFD766"
            ></path>
          </svg>
          <svg
            class="auth-module--vector-top-right"
            width="224"
            height="454"
            viewBox="0 0 224 454"
            fill="none"
          >
            <path
              d="M31 167.652L31 358.999C31 360.481 31.8194 361.841 33.1293 362.534L200.129 450.894C202.793 452.303 206 450.372 206 447.358L206 170.06C206 168.579 205.181 167.218 203.872 166.525L36.8716 78.1087C34.2076 76.6982 31 78.6294 31 81.6438L31 167.652Z"
              fill="#003AAF"
            ></path>
            <path
              d="M3.41467e-06 103.652L1.11852e-06 296.203C1.10968e-06 296.944 0.409691 297.624 1.06466 297.971L172.065 388.447C173.397 389.152 175 388.186 175 386.679L175 104.856C175 104.115 174.591 103.435 173.936 103.089L2.93582 12.5543C1.60382 11.8491 4.49789e-06 12.8147 4.47992e-06 14.3219L3.41467e-06 103.652Z"
              fill="url(#pattern0)"
            ></path>
            <path
              d="M158 -12.2246L158 58.0861C158 59.57 158.821 60.9319 160.134 61.6241L218.02 92.1574C220.684 93.5625 223.886 91.631 223.886 88.6194L223.886 -9.81282C223.886 -11.2962 223.065 -12.6579 221.753 -13.3503L163.867 -43.9032C161.203 -45.3092 158 -43.3779 158 -40.3658L158 -12.2246Z"
              fill="#003AAF"
            ></path>
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlink:href="#image0"
                  transform="translate(1.00899 -0.868968) scale(0.00236298 0.00511753) rotate(90)"
                ></use>
              </pattern>
            </defs>
          </svg>
          <figure class="parallax-outer auth-module--image-top-right">
            <div
              class="parallax-inner"
              style="transform: translate3d(0%, 2.84451%, 0px)"
            >
              <div style="position: relative">
                <div
                  class="gatsby-image-wrapper"
                  style="position: relative; overflow: hidden"
                >
                  <div
                    aria-hidden="true"
                    style="width: 100%; padding-bottom: 215.556%"
                  ></div>
                  <!-- <picture
                    ><source
                      srcset="
                        https://stages.unikorns.work/static/97311cf5a90e48c45c6ebf5a8fe0d5b9/4c61b/auth-img-2.png  45w,
                        https://stages.unikorns.work/static/97311cf5a90e48c45c6ebf5a8fe0d5b9/8099b/auth-img-2.png  90w,
                        https://stages.unikorns.work/static/97311cf5a90e48c45c6ebf5a8fe0d5b9/d4144/auth-img-2.png 175w
                      "
                      sizes="(max-width: 175px) 100vw, 175px" />
                    <img
                      sizes="(max-width: 175px) 100vw, 175px"
                      srcset="
                        /static/97311cf5a90e48c45c6ebf5a8fe0d5b9/4c61b/auth-img-2.png  45w,
                        /static/97311cf5a90e48c45c6ebf5a8fe0d5b9/8099b/auth-img-2.png  90w,
                        /static/97311cf5a90e48c45c6ebf5a8fe0d5b9/d4144/auth-img-2.png 175w
                      "
                      src="https://stages.unikorns.work/static/97311cf5a90e48c45c6ebf5a8fe0d5b9/d4144/auth-img-2.png"
                      alt=""
                      loading="lazy"
                      style="
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center center;
                        opacity: 1;
                        transition: none 0s ease 0s;
                      "
                  /></picture> -->
                </div>
              </div>
            </div>
          </figure>
          <div class="auth-module--text-block">
            <v-carousel cycle height="150" hide-delimiters show-arrows-on-hover>
              <v-carousel-item v-for="(slide, i) in slides" :key="i">
                <v-sheet color="rgba(0,0,0,0.5)" height="100%">
                  <v-row class="fill-height" align="center" justify="center">
                    <div class="display-1">{{ slide }}</div>
                  </v-row>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="alerta.estado"
      :color="alerta.color"
      :timeout="5000"
      bottom
    >
      {{ alerta.msj }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="alerta.estado = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>
<script>
import post from "../methods.js";
export default {
  data() {
    return {
      mode_pass: false,
      form: {
        empresa: null,
        usuario: null,
        clave: null,
      },
      error: {
        empresa: false,
        usuario: false,
        clave: false,
      },
      alerta: {
        estado: false,
        msj: null,
        color: "red darken-2",
      },
      loader_btn: false,
      disabled_inpt: false,
      slides: [
        "Salario Mínimo 2021: $1.000.000",
        "Auxilio Transporte 2021: $117,172",        
        "Uvt 2021: 38,004",
        // "Third",
        // "Fourth",
        // "Fifth",
      ],
    };
  },
  methods: {
    ingresar() {
      let data = this.form;

      if (!data.empresa) {
        this.error.empresa = true;
        this.error_msj("Ingresa el nit de la empresa");
      } else if (!data.usuario) {
        this.error.usuario = true;
        this.error_msj("Ingresa el código del usuario");
      } else if (!data.clave) {
        this.error.clave = true;
        this.error_msj("Ingresa la contraseña");
      } else {
        this.loader_btn = true;
        this.disabled_inpt = true;

        let data_envio = {
          url: "Financiero/dlls/login.dll",
          data: data.empresa + "|" + data.usuario + "|" + data.clave + "|" + "1" + "|",
          method: "",
        };

        post
          .postData(data_envio)
          .then((datos) => {
            this.loader_btn = false;
            this.disabled_inpt = false;
            sessionStorage.Sesion = datos.data[0];
            sessionStorage.User = datos.data[1];
            sessionStorage.Form = datos.Form;
            this.$router.replace(`${datos.Form}`);
          })
          .catch((error) => {
            console.log(error);
            this.loader_btn = false;
            this.disabled_inpt = false;
            this.error_msj(error.Mensaje[0]);
          });
      }
    },
    error_msj(msj = null, estado = true) {
      this.alerta.estado = estado;
      this.alerta.msj = msj;
    },
  },
};
</script>
<style lang="sass">
.v-text-field--outlined.v-input--is-focused fieldset
  box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%)

.bg-right-v2
  display: block
  position: relative
  padding: 0
  background-color: #0056fb

.bg-right-wrapper
  position: relative
  height: 100%
  display: flex
  justify-content: center
  align-items: center

  .auth-module--vector-bottom-right
    position: absolute
    bottom: 1%
    right: 2%

  .auth-module--vector-top-left
    position: absolute
    top: 3%
    left: -4%

  .auth-module--vector-top-right
    position: absolute
    top: 0
    right: 2%

  .auth-module--image-top-right
    position: absolute
    width: 180px
    right: 7%
    top: 0

  .auth-module--text-block
    color: #fff
    width: 100%
    position: absolute
    left: 0
    bottom: 0
</style>
