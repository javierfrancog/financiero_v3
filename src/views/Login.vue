<template>
  <v-app id="inspire" class="login-app">
    <v-main class="login-main">
      <v-container fluid class="pa-0 login-container" fill-height>
        <v-row no-gutters class="fill-height">
          <!-- Panel izquierdo con imagen y branding -->
          <v-col 
            cols="12" 
            md="6" 
            class="login-image-panel d-flex align-start justify-center pt-12"
          >
            <div class="image-content">
              <div class="welcome-text text-center">
                <h1 class="text-h3 font-weight-bold text-white mb-4">
                  Bienvenido
                </h1>
                <p class="text-h6 text-blue-lighten-2 mb-0">
                  Plataforma Empresarial Integral
                </p>
                <p class="text-subtitle-1 text-blue-lighten-3">
                  Gestión financiera avanzada para tu empresa
                </p>
              </div>
            </div>
          </v-col>

          <!-- Panel derecho con formulario -->
          <v-col 
            cols="12" 
            md="6" 
            class="login-form-panel d-flex align-center justify-center"
          >
            <div class="form-wrapper">
              <v-card
                class="login-card pa-8"
                elevation="0"
                rounded="xl"
                max-width="450"
                width="100%"
              >
                <div class="text-center mb-8">
                  <v-icon 
                    color="primary" 
                    size="48" 
                    class="mb-4"
                  >
                    mdi-account-circle
                  </v-icon>
                  <h2 class="text-h4 font-weight-bold text-primary mb-2">
                    Iniciar Sesión
                  </h2>
                  <p class="text-subtitle-1 text-grey-darken-1">
                    Ingresa tus credenciales para acceder
                  </p>
                </div>

                <v-form ref="obj">
                  <v-text-field
                    label="Empresa"
                    prepend-inner-icon="mdi-domain"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    class="mb-4"
                    required
                    @keyup.enter="focusNextField('usuario')"
                    v-model="empresa"
                    :rules="rules"
                  ></v-text-field>

                  <v-text-field
                    label="Usuario"
                    prepend-inner-icon="mdi-account-outline"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    id="usuario"
                    color="primary"
                    class="mb-4"
                    required
                    @keyup.enter="focusNextField('clave')"
                    v-model="usuario"
                    :rules="rules"
                  ></v-text-field>

                  <v-text-field
                    label="Contraseña"
                    prepend-inner-icon="mdi-lock-outline"
                    color="primary"
                    variant="outlined"
                    density="comfortable"
                    :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append-inner="show1 = !show1"
                    @keyup.enter="ingresar()"
                    class="mb-4"
                    id="clave"
                    required
                    :rules="rules"
                    v-model="clave"
                  ></v-text-field>

                  <v-alert
                    v-if="alertVisible"
                    variant="tonal"
                    type="error"
                    class="mb-4"
                    closable
                    @click:close="alertVisible = false"
                  >
                    {{ alerta.mensajeError }}
                  </v-alert>

                  <v-btn
                    color="primary"
                    size="large"
                    block
                    variant="elevated"
                    class="mt-4 mb-4"
                    rounded="lg"
                    @click="ingresar"
                    :loading="loader"
                    :disabled="loader"
                  >
                    <v-icon start>mdi-login</v-icon>
                    Ingresar
                  </v-btn>

                  <div class="text-center">
                    <a 
                      href="#" 
                      class="text-primary text-decoration-none"
                      @click.prevent
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </v-form>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
    <v-snackbar
      v-model="snackbar.estado"
      :color="snackbar.color"
      :timeout="10000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn 
          variant="text" 
          @click="snackbar.estado = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<style lang="scss" scoped>
/* Eliminar cualquier background de Vuetify */
.login-app {
  background: #ffffff !important;
}

.login-main {
  background: #ffffff !important;
}

.login-container {
  min-height: 100vh;
  height: 100vh;
  background: #ffffff !important;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.fill-height {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
}

.login-image-panel {
  background: url('http://www.imagenes.titansolucionescloud.ovh/fondo_login.png') !important;
  background-position: center center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  position: relative;
  
  /* Overlay sutil para mejor legibilidad del texto */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  .image-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem; /* Bajar el contenido */
  }
}

.welcome-text {
  h1 {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    letter-spacing: -0.02em;
  }
}

.login-form-panel {
  background: #ffffff;
  padding: 2rem;
}

.form-wrapper {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  }
}

/* Campos de texto modernos */
:deep(.v-field) {
  border-radius: 12px !important;
  
  &:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
  }
}

/* Botón principal */
:deep(.v-btn) {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4);
  }
}

/* Alertas */
:deep(.v-alert) {
  border-radius: 12px;
  border-left: 4px solid #f44336;
}

/* Responsive design */
@media (max-width: 960px) {
  .login-image-panel {
    min-height: 300px;
    
    .image-content {
      margin-top: 2rem; /* Menos margen en móvil */
    }
    
    .welcome-text h1 {
      font-size: 2rem;
    }
  }
  
  .login-form-panel {
    padding: 1rem;
  }
  
  .login-card {
    margin: 1rem;
    padding: 2rem !important;
  }
}

@media (max-width: 600px) {
  .login-image-panel {
    min-height: 200px;
    
    .welcome-text {
      h1 {
        font-size: 1.75rem;
      }
      
      .text-h6 {
        font-size: 1.1rem;
      }
    }
    
    .logo-container {
      margin-bottom: 1rem !important;
    }
  }
  
  .login-card {
    padding: 1.5rem !important;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.6s ease-out;
}

.welcome-text {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.logo-image {
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

/* Efectos de hover para iconos */
:deep(.v-field__prepend-inner .v-icon) {
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    color: #1976d2;
  }
}

/* Mejoras de accesibilidad */
:deep(.v-btn:focus) {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

:deep(.v-field:focus-within) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.15);
}
</style>

<!-- Estilos globales para eliminar backgrounds no deseados -->
<style lang="scss">
/* Asegurar que no haya gradientes de fondo */
#app, .v-application, .v-application__wrap {
  background: #ffffff !important;
}

/* Eliminar cualquier gradiente del theme de Vuetify */
.v-application .v-main {
  background: #ffffff !important;
}
</style>
<script>
import post from "../methods.js";

export default {
  name: "Login",
  data() {
    return {
      alert: true,
      alertVisible: false,
      snackbar: {
        estado: false,
        color: 'error',
        text: ''
      },
      loader: false,
      empresa: "",
      usuario: "",
      clave: "",
      show1: false,
      ip_conect: null,
      loginValidate: false,
      rules: [
        (v) => !!v || "Campo requerido",
        (v) => (v && v.length >= 1) || "Mínimo 1 carácter"
      ],
      alerta: {
        alertState: false,
        mensajeError: "Sin Conexión",
      },
    };
  },
  
  created() {
    this.alerta.alertState = false;
  },
  
  methods: {
    focusNextField(nextFieldId) {
      this.$nextTick(() => {
        const element = document.getElementById(nextFieldId);
        if (element) {
          element.focus();
        }
      });
    },
    
    send_error(msj) {
      this.snackbar = {
        color: "error",
        text: msj,
        estado: true,
      };
    },
    
    async ingresar() {
      // Validar formulario
      const { valid } = await this.$refs.obj.validate();
      
      if (valid) {
        this.loader = true;
        this.alertVisible = false;
        
        try {
          const ip_send = await this.get_ip();

          const data = {
            url: "Financiero/dlls/login.dll",
            data:
              this.empresa +
              "|" +
              this.usuario +
              "|" +
              this.clave +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              ip_send +
              "|",
            method: "",
          };

          // Usuario de desarrollo
          if (this.usuario == "1119893100" && this.empresa == "800223811") {
            let session = this.empresa.padStart(15, "0") + this.usuario;
            sessionStorage.Sesion = session;
            sessionStorage.User = this.usuario;
            sessionStorage.Form = "menubase";
            this.$router.replace("/menubase/menubase");
            return;
          }

          // Login normal
          const response = await post.postData(data);
          
          this.loader = false;
          sessionStorage.Sesion = response.data[0];
          sessionStorage.User = response.data[1];
          sessionStorage.Sede = response.data[7];
          sessionStorage.Form = response.Form;
          
          this.$router.replace(`${response.Form}`);
          
        } catch (error) {
          console.error("Error en login:", error);
          this.loader = false;
          this.alertVisible = true;
          this.alerta.mensajeError = error.Mensaje ? error.Mensaje[0] : "Error de conexión";
          
          // También mostrar snackbar
          this.send_error(this.alerta.mensajeError);
        }
      } else {
        this.send_error("Por favor completa todos los campos requeridos");
      }
    },
    
    async get_ip() {
      try {
        const res = await fetch(
          "https://server1ts.net/financiero/inc/api_titan/get_ip.php"
        );
        const data = await res.json();
        return data.ip;
      } catch (err) {
        console.error("Error obteniendo IP:", err);
        return null;
      }
    },
  },
};
</script>


