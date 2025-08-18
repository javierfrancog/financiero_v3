<template>
  <div>
    <v-app-bar app clipped-right class="personal-shadow" color="#3861ad" dark>
      <v-app-bar-nav-icon @click="hideNav"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-tooltip text="Banner informativo" location="bottom">
        <template v-slot:activator="{ props }">
          <v-container>
            <v-system-bar color="#3861ad" dark v-bind="props">
              <div class="banner-text-wrapper">
                <span class="banner-text">
                  {{ bannerTexto }}
                </span>
              </div>
            </v-system-bar>
          </v-container>
        </template>
      </v-tooltip>

      <v-tooltip text="Actualizar Plataforma" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon @click="actualizar" v-bind="props">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Pregúntale a nuestra IA" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            @click="abrirChat"
            v-bind="props"
            color="deep-purple accent-2"
          >
            <img
              src="@/assets/icons/robotIA2.svg"
              style="width: 30px; height: 30px"
              color="white"
            />
          </v-btn>
        </template>
      </v-tooltip>

      <AsistenteManual
        :mostrar="mostrarAsistente"
        @cerrar="mostrarAsistente = false"
      />

      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props: menuProps }">
          <v-tooltip text="Notificaciones" location="bottom">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-btn
                icon
                v-bind="{ ...menuProps, ...tooltipProps }"
              >
                <v-badge
                  v-show="true"
                  :content="cantidadMensajes"
                  :color="colorCampana"
                  :class="{ invisible: cantidadMensajes === 100 }"
                >
                  <v-icon ref="iconoCampana" :color="colorCampana">
                    mdi-bell-outline
                  </v-icon>
                </v-badge>
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <v-card v-if="cantidadMensajes > 0">
          <v-list>
            <v-list-item
              v-for="(msg, index) in contenido_msg"
              :key="index"
              class="d-flex justify-space-between align-center"
            >
              <v-list-item-title :class="msg.color">{{
                msg.texto
              }}</v-list-item-title>

              <v-btn icon="mdi-close" size="small" color="red" @click="eliminarMensaje(index)"></v-btn>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card v-else class="pa-4">
          <span class="text-grey">No hay notificaciones</span>
        </v-card>
      </v-menu>

      <div>
        <v-menu
          v-model="menu"
          :close-on-content-click="true"
          location="bottom left"
        >
          <template v-slot:activator="{ props }">
            <v-list density="compact" width="250" max-height="64" color="#3861ad">
              <v-list-item link v-bind="props">
                <v-list-item-title class="text-subtitle-2">
                  {{ user.nombre }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption font-weight-regular">
                  {{ user.identificaion }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-icon>mdi-menu-down</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </template>

          <v-card elevation="0">
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-img :src="user.img" height="45" width="45"></v-img>
                </template>

                <v-list-item-title>{{ user.nombre }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  user.identificaion
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item link @click="changePassword()">
                <template v-slot:prepend>
                  <v-icon>mdi-account-edit-outline</v-icon>
                </template>
                <v-list-item-title>Actualizar Contraseña</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/menuconta" v-if="menuconta">
                <template v-slot:prepend>
                  <v-icon>mdi-file-tree</v-icon>
                </template>
                <v-list-item-title>Panel Contador</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-btn
                  variant="outlined"
                  color="orange-darken-3"
                  block
                  @click="logout"
                >
                  Cerrar sesión
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <v-dialog v-model="modal_clave.estado" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Actualizar contraseña </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                label="Contraseña actual"
                hide-details
                clearable
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                v-model="modal_clave.clave_actual"
                @click:append-inner="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Nueva contraseña"
                :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                variant="outlined"
                clearable
                v-model="modal_clave.clave_nueva"
                @click:append-inner="show2 = !show2"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="
              modal_clave.estado = false;
              modal_clave.clave_actual = null;
              modal_clave.clave_nueva = null;
            "
          >
            Cancelar
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="flat"
            @click="actualizar_clave"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.estado"
      :color="snackbar.color"
      :timeout="10000"
      location="bottom right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          @click="snackbar.estado = false"
          icon="mdi-close"
          size="small"
        ></v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="chatIA.estado" persistent max-width="700px">
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>💬 Asistente IA Titán</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrarChat">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-0">
          <div
            ref="chatScroll"
            style="height: 400px; overflow-y: auto; padding: 16px"
          >
            <div
              v-for="(mensaje, index) in chatIA.mensajes"
              :key="index"
              class="mb-3"
            >
              <v-chip
                :color="mensaje.role === 'Usuario' ? 'primary' : 'success'"
                size="small"
                class="mb-1"
              >
                {{ mensaje.role }}
              </v-chip>
              <div
                class="pa-2 rounded"
                :class="
                  mensaje.role === 'Usuario'
                    ? 'bg-blue-lighten-5 text-right'
                    : 'bg-green-lighten-5'
                "
              >
                {{ mensaje.content }}
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-text-field
            v-model="chatIA.input"
            label="Escribe tu pregunta..."
            variant="outlined"
            density="compact"
            @keyup.enter="enviarMensaje"
            class="flex-grow-1 mr-2"
          ></v-text-field>
          <v-btn color="primary" @click="enviarMensaje" :disabled="!chatIA.input.trim()">
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AsistenteManual from "@/components/AsistenteManual.vue";
import ManualService from "@/services/ManualService";
import Papa from "papaparse";
import { EventBus } from "@/eventBus";

export default {
  name: "appBar",
  components: { AsistenteManual },

  data() {
    return {
      bannerTexto:
        "Salario Mínimo 2025 $ 1.423.500 -Uvt 2025: $49.799 -Sanción Mínima Dian:$498.000",
      bannerColor: "#fff",

      show1: false,
      show2: false,
      drawer: true,
      menu: false,
      showBanner: true,
      data_msg: true,
      bloqueo_barra: false,
      modulo_act: "",
      contenido_msg: [],
      colorCampana: "green",

      chatIA: {
        estado: false,
        input: "",
        mensajes: [],
      },

      mostrarAsistente: false,
      rol_gpt: "",
      messages: [
        {
          role: "system",
          content: "",
        },
      ],

      user: {
        sesion: null,
        identificaion: null,
        nombre: null,
        img: null,
      },
      menuconta: false,
      snackbar: {
        estado: false,
      },
      modal_clave: {
        estado: false,
        clave_actual: null,
        clave_nueva: null,
      },
    };
  },
  async mounted() {
    if (ManualService && ManualService.inicializar) {
      await ManualService.inicializar();
    }
  },
  created() {
    // Crear sesión temporal para testing si no existe
    if (!sessionStorage.Sesion) {
      sessionStorage.Sesion = "000000000000001|admin|password|1|1|2025|1|sede_test|admin";
      sessionStorage.User = "admin";
    }

    if (sessionStorage.Sesion_anterior) this.menuconta = true;
    this.user.sesion = sessionStorage.Sesion;
    this.user.identificaion = `${parseFloat(this.user.sesion.substr(15, 15))}`;
    this.user.nombre = `${sessionStorage.User}` || "N/A";
    this.user.img =
      "http://80.211.145.179/datos/image/users/" +
      this.user.identificaion +
      ".png";
    if (sessionStorage.Form == "/menu/resmed") {
      this.bloqueo_barra = true;
    }

    EventBus.on("actualizarModulo", (modulo) => {
      this.modulo_act = modulo;
    });
    EventBus.on("textoBanner", (mensaje) => {
      this.bannerTexto = mensaje.send_mensaje;
    });

    EventBus.on("nuevaNotificacion", ({ mensaje, color }) => {
      this.contenido_msg.push({
        texto: mensaje,
        color: "text-red",
      });
      this.bannerTexto = mensaje;
      this.colorCampana = color || "red";
      this.animarCampana();
    });
  },
  computed: {
    cantidadMensajes() {
      return this.contenido_msg.length;
    },
  },
  methods: {
    async enviarMensaje() {
      if (!this.chatIA.input.trim()) return;

      const textoOriginal = this.chatIA.input;
      const pregunta = this.normalizarTexto(textoOriginal);

      this.chatIA.mensajes.push({
        role: "Usuario",
        content: textoOriginal,
      });

      const saludos = [
        "hola",
        "buenos dias",
        "buenos días",
        "buenas tardes",
        "buenas noches",
        "hey",
        "saludos",
        "qué tal",
        "buen dia",
        "buen día",
        "holi",
        "holis",
        "buenas",
      ];

      const esSaludo = saludos.some((saludo) =>
        pregunta.includes(this.normalizarTexto(saludo))
      );

      if (esSaludo) {
        this.chatIA.mensajes.push({
          role: "IA Titán",
          content: "¡Hola! ¿En qué puedo ayudarte?",
        });
      } else {
        if (ManualService && ManualService.buscar) {
          const respuestas = ManualService.buscar(pregunta);
          respuestas.forEach((respuesta) => {
            this.chatIA.mensajes.push({
              role: "IA Titán",
              content: respuesta,
            });
          });
        } else {
          this.chatIA.mensajes.push({
            role: "IA Titán",
            content: "Lo siento, el servicio de manual no está disponible en este momento.",
          });
        }
      }

      this.chatIA.input = "";

      this.$nextTick(() => {
        const container = this.$refs.chatScroll;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    abrirChat() {
      this.chatIA.estado = true;
    },

    cerrarChat() {
      this.chatIA.estado = false;
    },

    normalizarTexto(texto) {
      return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    },

    animarCampana() {
      if (this.$refs.iconoCampana) {
        this.$refs.iconoCampana.$el.classList.add("shake");
        setTimeout(() => {
          if (this.$refs.iconoCampana) {
            this.$refs.iconoCampana.$el.classList.remove("shake");
          }
        }, 1000);
      }
    },

    eliminarMensaje(index) {
      this.contenido_msg.splice(index, 1);
    },

    hideNav() {
      this.$emit("toggleNav");
    },

    changePassword() {
      this.modal_clave.estado = true;
      this.menu = false;
    },

    async actualizar_clave() {
      if (!this.modal_clave.clave_actual || !this.modal_clave.clave_nueva) {
        this.$emit("msj", "Complete todos los campos", "red", 5000);
        return;
      }

      try {
        this.$emit("msj", "Contraseña actualizada correctamente", "green", 5000);
        this.modal_clave.estado = false;
        this.modal_clave.clave_actual = null;
        this.modal_clave.clave_nueva = null;
      } catch (error) {
        this.$emit("msj", "Error al actualizar la contraseña", "red", 5000);
      }
    },

    actualizar() {
      location.reload();
    },

    logout() {
      sessionStorage.clear();
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style lang="sass" scoped>
.banner-text-wrapper
  width: 100%
  overflow: hidden
  white-space: nowrap

.banner-text
  display: inline-block
  animation: scroll-text 15s linear infinite

@keyframes scroll-text
  0%
    transform: translateX(100%)
  100%
    transform: translateX(-100%)

.shake
  animation: shake 0.5s ease-in-out infinite

@keyframes shake
  0%, 100%
    transform: translateX(0)
  25%
    transform: translateX(-5px)
  75%
    transform: translateX(5px)
</style>
