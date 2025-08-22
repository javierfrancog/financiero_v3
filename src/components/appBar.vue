<template>
  <div>
    <!-- Barra principal azul con texto deslizante -->
    <v-app-bar app clipped-right class="personal-shadow" color="#3861ad" dark height="64">
      
      <v-app-bar-nav-icon @click="hideNav"></v-app-bar-nav-icon>
      
      <!-- Contenedor del texto deslizante -->
      <div class="slide-container">
        <div class="slide-text">
          {{ textoSlide }}
        </div>
      </div>
      
      <v-spacer></v-spacer>

      <!-- Botón Actualizar -->
      <v-tooltip text="Actualizar Plataforma" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn 
            @click="actualizar" 
            v-bind="props"
            class="refresh-btn"
            variant="text"
            size="small"
          >
            ⟳
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
                v-bind="{ ...props, ...tooltipProps }"
                class="notification-btn"
                variant="text"
              >
                🔔
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
      <v-menu
        v-model="menu"
        :close-on-content-click="true"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <div class="user-menu-activator" v-bind="props">
            <div class="user-info">
              <div class="user-name">JAVIER FRANCO</div>
              <div class="user-id">88007243</div>
            </div>
            <v-icon class="dropdown-icon">mdi-menu-down</v-icon>
          </div>
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
    </v-app-bar>
  </div>
</template>

<script>
import AsistenteManual from "./AsistenteManual.vue";
import { EventBus } from "@/eventBus";

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
      textoSlide: "Salario Mínimo 2025 $ 1.423.500 -Uvt 2025: $49.799 -Sanción Mínima Diaria $498.000",
    };
  },
  created() {
    this.cargarNotificaciones();
    EventBus.on("nuevaNotificacion", this.agregarNotificacion);
  },
  beforeUnmount() {
    EventBus.off("nuevaNotificacion", this.agregarNotificacion);
  },
  methods: {
    hideNav() {
      EventBus.emit("toggleNav");
    },
    actualizar() {
      location.reload();
    },
    abrirChat() {
      this.mostrarAsistente = true;
    },
    cargarNotificaciones() {
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
      console.log("Cambiar contraseña");
    },
    logout() {
      // Limpiar datos de sesión
      sessionStorage.clear();
      localStorage.clear();
      
      // Redirigir a la URL específica del login
      window.location.href = "http://localhost:5173/#/login";
    },
  },
};
</script>

<style scoped>
.personal-shadow {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
}

/* Contenedor del texto deslizante */
.slide-container {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0 20px;
  position: relative;
}

/* Texto que se desliza */
.slide-text {
  white-space: nowrap;
  color: #FFC107;
  font-weight: 500;
  font-size: 14px;
  animation: slide 15s linear infinite;
}

/* Animación de deslizamiento */
@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Estilos para el menú de usuario */
.user-menu-activator {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  height: 64px;
  min-width: 200px;
  color: white;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

.user-id {
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.2;
}

.dropdown-icon {
  margin-left: 8px;
}

/* Estilo específico para el botón de actualizar */
.refresh-btn {
  background-color: transparent !important;
  border: none !important;
  color: white !important;
  min-width: 48px !important;
  width: 48px !important;
  height: 48px !important;
  font-size: 28px !important;
  font-weight: bold !important;
}

.refresh-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Estilo específico para el botón de notificaciones */
.notification-btn {
  background-color: transparent !important;
  border: none !important;
  color: white !important;
  min-width: 48px !important;
  width: 48px !important;
  height: 48px !important;
  font-size: 24px !important;
}

.notification-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>