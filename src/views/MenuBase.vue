<template>
  <v-app>
    <appBar @toggleNav="toggleNav" />
    <v-main>
      <v-container fluid class="pa-6">
        <v-row class="justify-center">
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="(item, index) in menus"
            :key="index"
            class="d-flex"
          >
            <div class="w-100">
              <v-hover v-slot="{ isHovering, props }">
                <v-card 
                  class="mx-auto menu-card w-100" 
                  max-width="280" 
                  elevation="3" 
                  v-bind="props"
                  style="position: relative;"
                >
                  <!-- Imagen o fallback con color -->
                  <v-img 
                    :src="item.src" 
                    height="200"
                    cover
                    class="menu-image"
                  >
                    <template v-slot:error>
                      <!-- Fallback: mostrar color con icono y título -->
                      <div 
                        class="d-flex flex-column align-center justify-center text-white w-100 h-100"
                        :style="`background: ${item.color}; height: 200px;`"
                      >
                        <v-icon size="48" color="white" class="mb-2">mdi-application-cog</v-icon>
                        <div class="text-subtitle-1 font-weight-bold text-center px-3">
                          {{ item.titleBtn }}
                        </div>
                      </div>
                    </template>
                  </v-img>
                  
                  <!-- Overlay al hacer hover -->
                  <v-fade-transition>
                    <div 
                      v-if="isHovering"
                      class="overlay-container d-flex align-center justify-center"
                      style="
                        position: absolute; 
                        top: 0; 
                        left: 0; 
                        right: 0; 
                        bottom: 0; 
                        z-index: 2;
                        background-color: rgba(223, 238, 242, 0.95);
                        border-radius: 12px;
                      "
                    >
                      <v-btn 
                        color="blue-darken-3" 
                        variant="flat"
                        size="large"
                        class="text-white font-weight-bold d-flex align-center justify-center"
                        style="min-width: 140px; height: 48px;"
                        elevation="4"
                        rounded
                        @click="navegarA(item)"
                      >
                        <v-icon class="me-2" size="20">mdi-login</v-icon>
                        <span class="text-center">Ingresar</span>
                      </v-btn>
                    </div>
                  </v-fade-transition>
                </v-card>
              </v-hover>
            </div>
          </v-col>
        </v-row>

        <v-container fluid>
          <v-row justify="space-around">
            <v-col
              cols="5"
              class="d-flex align-center justify-center"
            >
              <v-img
                :src="logo"
                height="150"
                max-width="400"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
    <v-footer app></v-footer>
    <v-snackbar
      v-model="snackbar.estado"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text" 
          @click="snackbar.estado = false"
        >
          cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style lang="sass">
main
  background: #f1f5fb

.personal-shadow
  box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.1) !important

.menu-card
  transition: all 0.3s ease-in-out
  border-radius: 12px !important
  overflow: hidden
  &:hover
    transform: translateY(-4px) scale(1.02)
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important

.menu-image
  border-radius: 12px 12px 0 0
  
.overlay-container
  display: flex !important
  align-items: center !important
  justify-content: center !important
  width: 100% !important
  height: 100% !important

.v-btn
  text-align: center !important
  display: flex !important
  align-items: center !important
  justify-content: center !important
  
.v-btn .v-btn__content
  display: flex !important
  align-items: center !important
  justify-content: center !important
  width: 100% !important
  
.w-100
  width: 100%

.h-100
  height: 100%
</style>
<script>
import appBar from "@/components/appBar.vue";
import post from "../methods.js";
import { EventBus } from "@/eventBus";

export default {
  name: "Home",
  data() {
    return {
      drawer: true,
      overlay: false,
      snackbar: {
        estado: false,
        color: '',
        text: ''
      },
      logo: `https://server1ts.net//Datos/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`,
      menus: [],
    }
  },
  created() {
    // Crear una sesión temporal para pruebas si no existe
    if (!sessionStorage.Sesion) {
      sessionStorage.Sesion = "000000000000001000000000000001"; // Sesión temporal
      sessionStorage.User = "Usuario de Prueba";
    }
    
    EventBus.emit("actualizarModulo", "N/A");    
    this.validar_modulos();
  },
  components: {
    appBar,
  },
  methods: {
    
    validar_modulos() {
      var menus = [
        {
          nro: 1,
          titleBtn: "Financiero",
          src: "https://server1ts.net//Datos/image/botonfin.png",
          color: "#4CAF50",
          to: { name: "menu", params: { modulo: "financiero" } },
          name: "financiero_rep",
        },
        {
          nro: 2,
          titleBtn: "Mercancías",
          src: "https://server1ts.net//Datos/image/boton_mcia.png",
          color: "#2196F3",
          to: { name: "menu", params: { modulo: "punto_venta" } },
          name: "punto_venta_rep",
        },
        {
          nro: 3,
          titleBtn: "Gestión T.H.",
          src: "https://server1ts.net//Datos/image/boton_gth.png",
          color: "#FF9800",
          to: { name: "menu", params: { modulo: "gestion_th" } },
          name: "gth_rep",
        },

        {
          nro: 4,
          titleBtn: "Imagenología",
          src: "https://server1ts.net//Datos/image/boton_rx.png",
          color: "#9C27B0",
          to: { name: "menu", params: { modulo: "clinico" } },
          name: "cl_rx_rep",
        },
        {
          nro: 5,
          titleBtn: "H_Clinica",
          src: "https://server1ts.net//Datos/image/boton_hclinica.png",
          color: "#E91E63",
          to: { name: "menu", params: { modulo: "hclinica" } },
          name: "hclinica_rep",
        },
        {
          nro: 6,
          titleBtn: "S.Salud",
          src: "https://server1ts.net//Datos/image/boton_ssalud.png",
          color: "#607D8B",
          to: { name: "menu", params: { modulo: "ssalud" } },
          name: "ssalud_rep",
        },

        {
          nro: 7,
          titleBtn: "Fact_Colegios",
          src: "https://server1ts.net//Datos/image/boton_col.png",
          color: "#795548",
          to: { name: "menu", params: { modulo: "colegio" } },
          name: "col_rep",
        },
        {
          nro: 8,
          titleBtn: "Molinos",
          src: "https://server1ts.net//Datos/image/boton_mol.png",
          color: "#3F51B5",
          to: { name: "menu", params: { modulo: "molino" } },
          name: "mol_rep",
        },

        {
          nro: 9,
          titleBtn: "Serv_Domiciliarios",
          src: "https://server1ts.net//Datos/image/boton_servdm.png",
          color: "#009688",
          to: { name: "menu", params: { modulo: "servdm" } },
          name: "servdm_rep",
        },

        {
          nro: 10,
          titleBtn: "Tablero_Administrativo",
          src: "https://server1ts.net//Datos/image/boton_tablero.png",
          color: "#FF5722",
          to: { name: "menu", params: { modulo: "tablero" } },
          name: "tablero_rep",
        },

        {
          nro: 11,
          titleBtn: "Recaudo_Servicios_Publicos",
          src: "https://server1ts.net//Datos/image/boton_recaudos.png",
          color: "#8BC34A",
          to: { name: "menu", params: { modulo: "recaudos" } },
          name: "recaudos_rep",
        },

        {
          nro: 12,
          titleBtn: "Gestión Asociados",
          src: "https://server1ts.net//Datos/image/boton_asociados.png",
          color: "#CDDC39",
          to: { name: "menu", params: { modulo: "asociados" } },
          name: "asociados_rep",
        },
        {
          nro: 13,
          titleBtn: "Mesa de Ayuda",
          src: "https://server1ts.net//Datos/image/boton_soporte.png",
          color: "#FFC107",
          to: { name: "menu", params: { modulo: "soporte" } },
          name: "soporte_rep",
        },
        {
          nro: 14,
          titleBtn: "Transporte Intermunicipal",
          src: "https://server1ts.net//Datos/image/boton_transporte.png",
          color: "#E65100",
          to: { name: "menu", params: { modulo: "transporte" } },
          name: "transporte_rep",
        },

        {
          nro: 15,
          titleBtn: "Manual del Usuario",
          src: "https://server1ts.net//Datos/image/boton_manual.png",
          color: "#37474F",
          to: { name: "menu", params: { modulo: "manual" } },
          name: "manual_rep",
        },
        {
          nro: 16,
          titleBtn: "Resultados Médicos",
          src: "https://server1ts.net//Datos/image/boton_resmed.png",
          color: "#1B5E20",
          to: { name: "menu", params: { modulo: "resmed" } },
          name: "resmed_rep",
        },
        {
          nro: 17,
          titleBtn: "Transporte Especial",
          src: "https://server1ts.net//Datos/image/boton_trespecial.png",
          color: "#4A148C",
          to: { name: "menu", params: { modulo: "trespecial" } },
          name: "trespecial_rep",
        },
        {
          nro: 18,
          titleBtn: "Dispensación Medicamentos",
          src: "https://server1ts.net//Datos/image/boton_dispensa.png",
          color: "#B71C1C",
          to: { name: "menu", params: { modulo: "dispensa" } },
          name: "dispensa_rep",
        },
        {
          nro: 19,
          titleBtn: "Documentos Electrónicos",
          src: "https://server1ts.net//Datos/image/boton_docelectr.png",
          color: "#006064",
          to: { name: "menu", params: { modulo: "docselect" } },
          name: "doceletric_rep",
        },
        {
          nro: 20,
          titleBtn: "Pruebas",
          src: "https://server1ts.net//Datos/image/boton_testeo.png",
          color: "#F57C00",
          to: { name: "menu", params: { modulo: "testeo" } },
          name: "testeo_rep",
        },

        {
          nro: 21,
          titleBtn: "Comercio a Plazos",
          src: "https://server1ts.net//Datos/image/boton_plazos.png",
          color: "#2E7D32",
          to: { name: "menu", params: { modulo: "plazos" } },
          name: "plazos_rep",
        },
        {
          nro: 22,
          titleBtn: "Autogestión Colaboradores",
          src: "https://server1ts.net//Datos/image/boton_autocolabora.png",
          color: "#C62828",
          to: { name: "menu", params: { modulo: "autocolabora" } },
          name: "autocolabora_rep",
        },
        {
          nro: 23,
          titleBtn: "Propiedad Horizontal",
          src: "https://server1ts.net//Datos/image/boton_phorizontal.png",
          color: "#1565C0",
          to: { name: "menu", params: { modulo: "phorizontal" } },
          name: "phorizontal_rep",
        },
        {
          nro: 24,
          titleBtn: "Transporte Mercancías",
          src: "https://server1ts.net//Datos/image/boton_trmcias.png",
          color: "#558B2F",
          to: { name: "menu", params: { modulo: "trmcias" } },
          name: "transmcias_rep",
        },
        {
          nro: 25,
          titleBtn: "Hseq",
          src: "https://server1ts.net//Datos/image/boton_hseq.png",
          color: "#AD1457",
          to: { name: "menu", params: { modulo: "hseq" } },
          name: "hseq_rep",
        },
      ];
      
      var _this = this;
      
      // Activar la funcionalidad completa de servidor
      post
        .postData({
          url: "Financiero/dlls/menuJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((datos) => {
          let modulos = datos[0];
          console.log("modulos", modulos);
          let filtro = menus.filter((el) => {
            let item = modulos[el.name] || false;
            return item == "1" ? el : false;
          });
          _this.menus = filtro;

          // this.activar_notificacion(datos[0].notifica);
        })
        .catch((error) => {
          console.log("Error connecting to server, showing demo modules:", error);
          // Si falla la conexión, mostrar módulos de ejemplo
          _this.menus = menus.slice(0, 12); // Mostrar los primeros 12 menús como ejemplo
        });
      return;
      
      // Si no hay sesión, mostrar algunos menús de ejemplo para prueba
      if (!sessionStorage.Sesion) {
        console.warn("No hay sessionStorage.Sesion, mostrando menús de ejemplo");
        this.menus = menus.slice(0, 8); // Mostrar los primeros 8 menús
        console.log("Menús de ejemplo cargados:", this.menus);
        return;
      }
      
      console.log("Iniciando petición al servidor...");
      post
        .postData({
          url: "Financiero/dlls/menuJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((datos) => {
          console.log("✅ Respuesta exitosa del servidor:", datos);
          let modulos = datos[0];
          console.log("modulos recibidos:", modulos);
          let filtro = menus.filter((el) => {
            let item = modulos[el.name] || false;
            console.log(`Evaluando ${el.name}: ${item}`);
            return item == "1" ? el : false;
          });
          this.menus = filtro;
          console.log("✅ Menús filtrados y asignados:", this.menus);

//          this.activar_notificacion(datos[0].notifica);
        })
        .catch((error) => {
          console.error("❌ Error al cargar menús desde servidor:", error);
          console.log("Usando menús de ejemplo debido al error");
          // En caso de error, mostrar algunos menús de ejemplo
          this.menus = menus.slice(0, 8);
          console.log("Menús de ejemplo cargados por error:", this.menus);
        });
    },
    activar_notificacion(datos) {
      datos.pop();
      let send_mensaje = "Hoy es el cumpleaños de ";
      const startIndex = 0;

      for (const item of datos.slice(startIndex)) {
        send_mensaje = send_mensaje + item.colaborador.trim();
        EventBus.emit("nuevaNotificacion", {
          mensaje: send_mensaje,
          colorTexto: "green",
        });
      }
    },
    toggleNav(data) {
      this.drawer = !this.drawer;
    },
    snack(data) {
      this.snackbar = data;
    },
    onImageError(event) {
      if (event && event.target) {
        console.warn("Error cargando imagen:", event.target.src);
      } else {
        console.warn("Error cargando imagen");
      }
    },
    navegarA(item) {
      console.log("🚀 Navegando a módulo:", item.titleBtn);
      console.log("📍 Ruta destino original:", item.to);
      
      // Construir la ruta completa como en Vue 2: /menu/{modulo}/base
      const rutaCompleta = `/menu/${item.to.params.modulo}/base`;
      console.log("📍 Ruta completa construida:", rutaCompleta);
      
      try {
        // Navegar usando la ruta completa (como hace Vue 2)
        this.$router.push(rutaCompleta);
        console.log("✅ Navegación exitosa a:", rutaCompleta);
        
        // Actualizar el módulo actual como hace Vue 2 con EventBus
        EventBus.emit("actualizarModulo", item.to.params.modulo);
        
      } catch (error) {
        console.error("❌ Error en navegación:", error);
        // Mostrar mensaje de error al usuario
        this.snackbar = {
          estado: true,
          color: 'error',
          text: `Error al acceder al módulo ${item.titleBtn}`
        };
      }
    },
  },
};
</script>
