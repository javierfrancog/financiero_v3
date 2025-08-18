<template>
  <div>
    <!-- Banner superior dorado con información del salario mínimo -->
    <v-system-bar color="#FFC107" dark height="24" class="banner-superior">
      <v-container fluid class="pa-0">
        <div class="banner-text-wrapper d-flex align-center justify-center">
          <span class="banner-text">
            {{ bannerTexto }}
          </span>
        </div>
      </v-container>
    </v-system-bar>

    <!-- Barra principal azul -->
    <v-app-bar app clipped-right class="personal-shadow" color="#3861ad" dark height="64">
      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="hideNav"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <!-- Botón Actualizar -->
      <v-tooltip text="Actualizar Plataforma" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon @click="actualizar" v-bind="props">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <!-- Botón IA Chat -->
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

      <!-- Notificaciones -->
      <v-menu location="bottom" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-tooltip text="Notificaciones" location="bottom">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-btn
                icon
                v-bind="{ ...props, ...tooltipProps }"
              >
                <v-badge
                  v-show="true"
                  :content="cantidadMensajes"
                  :color="colorCampana"
                  :model-value="cantidadMensajes !== 100"
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

              <v-btn icon size="small" @click="eliminarMensaje(index)">
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card v-else class="pa-4">
          <span class="grey--text">No hay notificaciones</span>
        </v-card>
      </v-menu>

      <!-- Menú de usuario -->
      <div>
        <v-menu
          v-model="menu"
          :close-on-content-click="true"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-list density="compact" width="250" max-height="64" color="#3861ad">
              <v-list-item link v-bind="props">
                <template v-slot:prepend>
                  <v-list-item-title class="subtitle-2">
                    {{ user.nombre }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="caption font-weight-regular">
                    {{ user.identificaion }}
                  </v-list-item-subtitle>
                </template>

                <template v-slot:append>
                  <v-icon>mdi-menu-down</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </template>

          <v-card elevation="0">
            <v-list>
              <v-list-item @click="cambiarContrasena">
                <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
                </template>
                <v-list-item-title>Cambiar Contraseña</v-list-item-title>
              </v-list-item>

              <v-list-item @click="logout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Salir</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import AsistenteManual from "./AsistenteManual.vue";
import { ManualService } from "../services/ManualService";
import { eventBus } from "@/eventBus";

export default {
  components: {
    AsistenteManual,
  },
  data() {
    return {
      menu: false,
      mostrarAsistente: false,
      cantidadMensajes: 0,
      contenido_msg: [],
      colorCampana: "white",
      bannerTexto: "Salario Mínimo Mensual Legal Vigente 2025: $1.423.500 - Auxilio de Transporte: $162.000",
      user: {
        nombre: "JAVIER FRANCO",
        identificaion: "88007243",
      },
    };
  },
  created() {
    this.cargarNotificaciones();
    eventBus.on("nuevaNotificacion", this.agregarNotificacion);
  },
  beforeUnmount() {
    eventBus.off("nuevaNotificacion", this.agregarNotificacion);
  },
  methods: {
    hideNav() {
      eventBus.emit("toggleNav");
    },
    actualizar() {
      location.reload();
    },
    abrirChat() {
      this.mostrarAsistente = true;
    },
    cargarNotificaciones() {
      // Lógica para cargar notificaciones
      this.cantidadMensajes = this.contenido_msg.length;
      this.actualizarColorCampana();
    },
    agregarNotificacion(mensaje) {
      this.contenido_msg.push(mensaje);
      this.cantidadMensajes = this.contenido_msg.length;
      this.actualizarColorCampana();
    },
    eliminarMensaje(index) {
      this.contenido_msg.splice(index, 1);
      this.cantidadMensajes = this.contenido_msg.length;
      this.actualizarColorCampana();
    },
    actualizarColorCampana() {
      this.colorCampana = this.cantidadMensajes > 0 ? "red" : "white";
    },
    cambiarContrasena() {
      // Lógica para cambiar contraseña
      console.log("Cambiar contraseña");
    },
    logout() {
      // Lógica para cerrar sesión
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.personal-shadow {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
}

.banner-superior {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2001;
}

.banner-text-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.v-app-bar {
  margin-top: 24px !important;
}
</style>
