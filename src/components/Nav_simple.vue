<template>
  <div>
    <!-- DEBUG: Indicador visible -->
    <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; z-index: 9999;">
      NAV COMPONENT LOADED - Opciones: {{ opciones.length }}
    </div>
    
    <!-- Menu lateral simplificado -->
    <div style="
      position: fixed; 
      left: 0; 
      top: 0; 
      width: 300px; 
      height: 100vh; 
      background: linear-gradient(to bottom, #2196F3, #1976D2); 
      z-index: 1000; 
      overflow-y: auto;
      box-shadow: 2px 0 5px rgba(0,0,0,0.3);
    ">
      <!-- Logo -->
      <div style="padding: 20px; text-align: center; background: rgba(255,255,255,0.1);">
        <img :src="logo_empresa" style="max-width: 100%; height: 80px; object-fit: contain;" />
      </div>
      
      <!-- Opción Principal -->
      <div style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.2);">
        <div style="color: white; display: flex; align-items: center;">
          <v-icon color="orange" style="margin-right: 10px;">mdi-home-outline</v-icon>
          <span style="font-weight: bold;">Principal</span>
        </div>
      </div>
      
      <!-- Opciones del menú -->
      <div v-for="(item, index) in opciones" :key="index" style="margin: 10px 0;">
        <!-- Título de la sección -->
        <div 
          :class="`menu-section-header ${getColorMenu(index + 1)}`"
          style="
            margin: 10px 15px; 
            padding: 12px; 
            border-radius: 25px; 
            color: black; 
            font-weight: bold;
            cursor: pointer;
            text-align: center;
          "
          @click="item.active = !item.active"
        >
          <v-icon style="margin-right: 8px;">{{ item.icono }}</v-icon>
          {{ item.text }}
        </div>
        
        <!-- Subopciones -->
        <div v-if="item.active && item.submenu" style="padding-left: 20px;">
          <div 
            v-for="(sub, j) in item.submenu" 
            :key="j"
            style="
              padding: 8px 20px; 
              color: white; 
              cursor: pointer;
              border-left: 2px solid rgba(255,255,255,0.3);
              margin: 5px 0;
            "
            @click="navegarA(item.ruta + sub.href)"
          >
            <v-icon :color="getColorIcon(index + 1)" size="20" style="margin-right: 10px;">{{ sub.icono }}</v-icon>
            {{ sub.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import post from "../methods.js";
import { EventBus } from "@/eventBus";

export default {
  name: "Nav",
  props: {
    drawer: Boolean,
  },
  emits: ['update:drawer'],
  data: () => ({
    logo_empresa: null,
    opciones: [
      {
        text: "Procesos",
        icono: "mdi-cog",
        ruta: "/menu/financiero",
        submenu: [
          { text: "Comprobantes", href: "/Compcontab", icono: "mdi-file-document", id: "comp01" },
          { text: "Reimprimir", href: "/PrReimpCb", icono: "mdi-printer", id: "reimp01" }
        ],
        active: false
      },
      {
        text: "Reportes", 
        icono: "mdi-file-chart",
        ruta: "/menu/financiero",
        submenu: [
          { text: "Balance General", href: "/balance", icono: "mdi-chart-line", id: "bal01" },
          { text: "Estado de Resultados", href: "/resultado", icono: "mdi-chart-bar", id: "res01" }
        ],
        active: false
      },
      {
        text: "Configuración",
        icono: "mdi-settings",
        ruta: "/menu/financiero", 
        submenu: [
          { text: "Usuarios", href: "/usuarios", icono: "mdi-account-multiple", id: "usr01" },
          { text: "Parámetros", href: "/parametros", icono: "mdi-cog-outline", id: "par01" }
        ],
        active: false
      }
    ],
    filtro_opciones: [],
    bloqueo_ppal: false,
  }),
  computed: {
    isDrawerOpen: {
      get() {
        return true; // Forzar drawer siempre visible para testing
      },
      set(value) {
        this.$emit('update:drawer', value);
      }
    }
  },
  created() {
    console.log("Nav created, drawer prop:", this.drawer);
    
    // Crear sesión temporal para testing si no existe
    if (!sessionStorage.Sesion) {
      sessionStorage.Sesion = "000000000000001|admin|password|1|1|2025|1|sede_test|admin";
      sessionStorage.User = "admin";
      console.log("Sesión temporal creada para testing");
    }
    
    this.logo_empresa =
      "https://server1ts.net/datos/image/clientes/" +
      `${parseFloat(sessionStorage.Sesion.substr(0, 15))}` +
      ".png";
    this.get_cargue();
  },
  mounted() {
    console.log("Nav mounted, drawer:", this.drawer);
  },
  methods: {
    navegarA(ruta) {
      console.log("Navegando a:", ruta);
      this.$router.push(ruta);
    },
    
    get_cargue: function () {
      const { path } = this.$route;
      const modulo = path.split("/")[2];
      let data_notifica = [];

      console.log("Cargando menú para módulo:", modulo);

      if (modulo === "resmed" || modulo === "agendamed") {
        this.bloqueo_ppal = true;
      }
      post
        .postData({
          url: "Financiero/dlls/Menu01J.dll",
          data: sessionStorage.Sesion + "|" + modulo + "|",
          method: "",
        })
        .then((data) => {
          console.log("Respuesta del servidor Menu01J.dll:", data);
          data.pop();

          this.filtro_opciones = data;
          this.validar();
          EventBus.emit("actualizarModulo", modulo);

          console.log("Menú cargado correctamente");
        })
        .catch((err) => {
          console.error("Error al cargar menú del servidor:", err);
          
          // Mantener las opciones estáticas si falla el servidor
          console.log("Usando opciones estáticas por error del servidor");
        });
    },

    validar_menu(item) {
      if (!item.submenu) return false;
      else {
        let find = this.filtro_opciones.find((el) => el.ruta_rep === item.id);
        return find ? find.estado_rep === "1" : true;
      }
    },
    
    validar_submenu(item) {
      let find = this.filtro_opciones.find((el) => el.ruta_rep === item.id);
      return find ? find.estado_rep === "1" : true;
    },
    
    validar() {
      console.log("Validando opciones del menú:", this.filtro_opciones);
      
      // Por ahora mantenemos las opciones estáticas
      // Después podemos procesar this.filtro_opciones para generar el menú dinámico
      console.log("Opciones de menú:", this.opciones);
    },

    getColorMenu(index) {
      if (index === 1) return "green lighten-3";
      else if (index === 2) return "blue accent-2";
      else if (index === 3) return "indigo lighten-4";
    },
    
    getColorIcon(index) {
      if (index === 1) return "green darken-3";
      else if (index === 2) return "blue darken-1";
      else if (index === 3) return "purple dark";
    },
  },
  watch: {
    drawer: function (estado) {
      console.log("Drawer cambió:", estado);
    },
  },
};
</script>

<style lang="sass">
.menu-section-header:hover
  opacity: 0.8

.menu-section-header.green
  background-color: #C8E6C9 !important

.menu-section-header.blue  
  background-color: #BBDEFB !important

.menu-section-header.indigo
  background-color: #E1BEE7 !important
</style>
