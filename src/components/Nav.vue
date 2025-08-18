<template>
  <div>
    <v-navigation-drawer
      v-model="isOpen"
      app
      class="modern-nav"
      width="320"
    >
      <!-- Header del usuario -->
      <div class="user-header">
        <div class="company-logo-container">
          <v-img
            :src="logo_empresa"
            contain
            class="company-logo"
          ></v-img>
        </div>
      </div>

      <v-divider class="header-divider"></v-divider>

      <!-- Botón Principal -->
      <div class="nav-section">
        <v-btn
          v-if="hasPrincipalOption"
          class="nav-button principal-special-btn"
          variant="elevated"
          block
          @click="goToPrincipal"
        >
          <v-icon class="principal-icon">mdi-home</v-icon>
          <span class="principal-text">Principal</span>
        </v-btn>
      </div>

      <!-- Menu Principal con colores -->
      <div class="nav-sections">
        <template v-for="(item, index) in opciones" :key="index">
          <!-- Botón principal del menú con expansión -->
          <div class="nav-section" v-if="validar_menu(item)">
            <v-btn
              :class="getButtonClass(item.text, index)"
              variant="elevated"
              block
              @click="toggleSection(item.text)"
            >
              <v-icon class="nav-icon">{{ getButtonIcon(item.text) }}</v-icon>
              <span class="nav-text">{{ item.text }}</span>
              <v-spacer></v-spacer>
              <v-icon class="expand-icon">
                {{ expandedSections[item.text] ? '▲' : '▼' }}
              </v-icon>
            </v-btn>

            <!-- Submenu expandible -->
            <v-expand-transition>
              <div v-show="expandedSections[item.text]" class="submenu-container">
                <template v-for="(sub, j) in item.submenu" :key="`${index}-${j}`">
                  <!-- Items de submenu sin submenu2 -->
                  <v-btn
                    v-if="!sub.submenu2 && validar_submenu(sub)"
                    :to="item.ruta + sub.href"
                    class="submenu-btn"
                    variant="text"
                    block
                  >
                    <v-icon 
                      class="submenu-icon" 
                      :style="{ color: getSubmenuIconColor(sub.text, getParentIndex(item)) }"
                      size="30"
                    >
                      {{ getSubmenuIconV2(sub.text, sub.icono) }}
                    </v-icon>
                    <span class="submenu-text">{{ sub.text }}</span>
                  </v-btn>

                  <!-- Items de submenu con submenu2 -->
                  <div v-else-if="sub.submenu2 && validar_submenu(sub)" class="submenu-group">
                    <v-btn
                      class="submenu-btn group-btn"
                      variant="text"
                      block
                      @click="toggleSubmenu(sub.text)"
                    >
                      <v-icon 
                        class="submenu-icon" 
                        :style="{ color: getSubmenuIconColor(sub.text, getParentIndex(item)) }"
                        size="30"
                      >
                        {{ getSubmenuIconV2(sub.text, sub.icono) }}
                      </v-icon>
                      <span class="submenu-text">{{ sub.text }}</span>
                      <v-spacer></v-spacer>
                      <v-icon class="expand-icon small">
                        {{ expandedSubmenus[sub.text] ? '▲' : '▼' }}
                      </v-icon>
                    </v-btn>

                    <!-- Submenu level 2 -->
                    <v-expand-transition>
                      <div v-show="expandedSubmenus[sub.text]" class="submenu2-container">
                        <v-btn
                          v-for="(submenu, i) in sub.submenu2"
                          :key="`${index}-${j}-${i}`"
                          :to="item.ruta + submenu.href"
                          v-show="validar_submenu(submenu)"
                          class="submenu2-btn"
                          variant="text"
                          block
                        >
                          <v-icon 
                            class="submenu2-icon" 
                            :style="{ color: getSubmenuIconColor(submenu.text, getParentIndex(item)) }"
                            size="30"
                          >
                            {{ getSubmenuIconV2(submenu.text, submenu.icono) }}
                          </v-icon>
                          <span class="submenu2-text">{{ submenu.text }}</span>
                        </v-btn>
                      </div>
                    </v-expand-transition>
                  </div>
                </template>
              </div>
            </v-expand-transition>
          </div>
        </template>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import post from "../methods.js";
import { instance } from "@/global.js";
import { EventBus } from "@/eventBus";

export default {
  name: "Nav",
  props: {
    drawer: Boolean,
  },
  data() {
    return {
      isOpen: true,
      logo_empresa: null,
      opciones: [],
      filtro_opciones: [],
      bloqueo_ppal: false,
      nav_menu: instance.data().nav_menu,
      expandedSections: {},
      expandedSubmenus: {},
      userName: "ANDREA DEL PILAR GONZALEZ AVELLANEDA",
      userRole: "Contribuyente de Impuestos a la Renta",
      userStatus: "No Responsable de Impuestos a las Ventas",
      hasPrincipalOption: true,
    };
  },
  created() {
    // Crear sesión temporal para testing si no existe
    if (!sessionStorage.Sesion) {
      sessionStorage.Sesion = "000000000000001|admin|password|1|1|2025|1|sede_test|admin";
      sessionStorage.User = "admin";
    }
    
    this.logo_empresa =
      "https://server1ts.net/datos/image/clientes/" +
      `${parseFloat(sessionStorage.Sesion.substr(0, 15))}` +
      ".png";
    this.get_cargue();
  },
  methods: {
    get_cargue() {
      const { path } = this.$route;
      const modulo = path.split("/")[2];
      let data_notifica = [];

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
          data.pop();
          this.filtro_opciones = data;
          this.validar();
          EventBus.emit("actualizarModulo", modulo);
        })
        .catch((err) => {
          console.error("Error al cargar menú del servidor:", err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar menus",
            estado: true,
          });
        });
    },

    toggleSection(sectionName) {
      this.expandedSections[sectionName] = !this.expandedSections[sectionName];
    },

    toggleSubmenu(submenuName) {
      this.expandedSubmenus[submenuName] = !this.expandedSubmenus[submenuName];
    },

    getButtonClass(itemText, index) {
      const baseClass = "nav-button main-btn";
      if (itemText.toLowerCase().includes('proceso')) {
        return baseClass + " process-btn";
      } else if (itemText.toLowerCase().includes('reporte')) {
        return baseClass + " report-btn";
      } else if (itemText.toLowerCase().includes('configuraci')) {
        return baseClass + " config-btn";
      }
      return baseClass;
    },

    // Métodos para replicar iconos y colores de V2
    getParentIndex(item) {
      return this.opciones.findIndex(option => option === item);
    },

    // Función para asignar iconos V2 específicos a elementos de submenu
    getSubmenuV2Icon(submenuText, originalIcon) {
      // Si ya existe un ícono original, usarlo
      if (originalIcon && originalIcon !== 'mdi-clipboard-text-play-outline') {
        return originalIcon;
      }
      
      // Mapeo específico de iconos V2 para submenu financiero con iconos más distintivos
      const iconMap = {
        // Submenu Procesos - Financiero
        'contables': 'mdi-calculator-variant',
        'cierres': 'mdi-lock-clock', 
        'otros procesos': 'mdi-cogs',
        
        // Submenu Reportes - Financiero
        'reportes contables': 'mdi-file-chart',
        'tributarios': 'mdi-receipt',
        'entidades de control': 'mdi-shield-check',
        
        // Submenu Configuración - Financiero
        'configuración contable': 'mdi-tune',
        'mercancías': 'mdi-package-variant',
        'tributario': 'mdi-receipt-text',
        'otras configuraciones': 'mdi-wrench',
        
        // Submenu Punto de Venta
        'comercial': 'mdi-storefront',
        'remisiones': 'mdi-truck-delivery',
        'despachos': 'mdi-package-up',
        'ordenes compra': 'mdi-clipboard-list',
        'tesorería': 'mdi-cash-register',
        'propiedad, planta & equipo': 'mdi-factory',
        'facturación': 'mdi-receipt',
        'pedidos': 'mdi-clipboard-text',
        'asesores': 'mdi-account-tie',
        'cartera': 'mdi-wallet',
        'proveedores': 'mdi-truck',
        'punto de venta': 'mdi-point-of-sale',
        
        // Submenu Clínico
        'prestación servicios': 'mdi-hospital',
        'agendas': 'mdi-calendar-clock',
        'notas credito': 'mdi-note-minus',
        'paciente': 'mdi-account-heart',
        'productividad': 'mdi-chart-line-variant',
        'entidades control': 'mdi-shield-account',
        'e.p.s.': 'mdi-medical-bag'
      };
      
      const text = submenuText.toLowerCase();
      return iconMap[text] || 'mdi-folder';
    },

    getSubmenuIconV2(submenuText, originalIcon) {
      return this.getSubmenuV2Icon(submenuText, originalIcon);
    },

    getSubmenuIconColor(submenuText, parentIndex) {
      // Colores más intensos y visibles basados en el índice del menú padre como en V2
      if (parentIndex === 1) return '#1b5e20'; // green darken-4 (más intenso)
      else if (parentIndex === 2) return '#0d47a1'; // blue darken-4 (más intenso)  
      else if (parentIndex === 3) return '#4a148c'; // purple darken-4 (más intenso)
      else return '#212121'; // grey darken-4 por defecto (más intenso)
    },

    getButtonIcon(itemText) {
      if (itemText.toLowerCase().includes('proceso')) {
        return 'mdi-cogs';
      } else if (itemText.toLowerCase().includes('reporte')) {
        return 'mdi-chart-line';
      } else if (itemText.toLowerCase().includes('configuraci')) {
        return 'mdi-cog';
      }
      return 'mdi-menu';
    },

    getSubmenuIcon(submenuText, originalIcon) {
      const text = submenuText.toLowerCase();
      
      // Iconos específicos para opciones financieras
      if (text.includes('contab')) return 'mdi-calculator-variant';
      if (text.includes('cierre')) return 'mdi-calendar-check';
      if (text.includes('otros procesos')) return 'mdi-cogs';
      if (text.includes('pago') || text.includes('recibo')) return 'mdi-cash-multiple';
      if (text.includes('factur')) return 'mdi-file-document-outline';
      if (text.includes('cartera')) return 'mdi-account-cash';
      if (text.includes('banco')) return 'mdi-bank';
      if (text.includes('inventario')) return 'mdi-package-variant';
      if (text.includes('nomina')) return 'mdi-account-group';
      if (text.includes('presupuesto')) return 'mdi-chart-pie';
      if (text.includes('activo')) return 'mdi-home-city';
      if (text.includes('impuesto')) return 'mdi-percent';
      if (text.includes('tercero')) return 'mdi-account-multiple';
      if (text.includes('cuenta')) return 'mdi-format-list-numbered';
      if (text.includes('consulta')) return 'mdi-magnify';
      if (text.includes('reporte')) return 'mdi-file-chart';
      if (text.includes('config')) return 'mdi-cog-outline';
      if (text.includes('usuario')) return 'mdi-account-cog';
      if (text.includes('empresa')) return 'mdi-office-building';
      if (text.includes('periodo')) return 'mdi-calendar-month';
      
      // Si no coincide con ningún patrón, usar el ícono original o uno por defecto
      return originalIcon || 'mdi-circle-outline';
    },

    goToPrincipal() {
      this.$router.push('/');
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
      var ruta = this.$route.path.split("/")[2];
      var modulo = this.$route.params.modulo || ruta;
      if (modulo) {
        var nav = this.nav_menu[modulo];
        if (nav) this.opciones = nav;
        else this.$router.push({ path: "/" });
      }
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

    obtenerElementoNotifica(arr) {
      const resultado = arr.find((el) =>
        Object.prototype.hasOwnProperty.call(el, "notifica")
      );
      return resultado?.notifica || null;
    },
  },

  watch: {
    drawer: {
      handler(estado) {
        if (estado == this.estado) this.isOpen = !estado;
        else this.isOpen = estado;
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
/* Navigation drawer moderna */
.modern-nav {
  background-color: #f8f9fa !important;
  border-right: 1px solid #e9ecef !important;
}

/* Header del usuario */
.user-header {
  padding: 16px;
  color: white;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 8px;
}

.company-logo-container {
  flex-shrink: 0;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260px;
  height: 150px;
}

.company-logo {
  max-width: 200%;
  max-height: 200%;
}

.user-info {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.2;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.user-role,
.user-status {
  font-size: 10px;
  margin: 0 0 2px 0;
  opacity: 0.95;
  line-height: 1.3;
  font-weight: 400;
}

.header-divider {
  margin: 0 !important;
  border-color: #e9ecef !important;
}

/* Secciones del navegador */
.nav-sections {
  padding: 16px;
}

.nav-section {
  margin-bottom: 12px;
}

/* Botones principales */
.nav-button {
  height: 48px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  justify-content: flex-start !important;
  padding: 0 16px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
  margin-bottom: 8px;
}

.nav-icon {
  color: #ffffff !important;
  margin-right: 12px;
  font-size: 20px !important;
}

.nav-text {
  flex: 1;
  text-align: left;
}

.expand-icon {
  font-size: 18px !important;
  margin-left: 8px !important;
}

/* Botón Principal - Diseño especial único */
.principal-special-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border-radius: 0px !important;
  margin-bottom: 20px !important;
  padding: 16px 12px !important;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  position: relative;
  overflow: hidden;
}

.principal-special-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.principal-special-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.principal-special-btn:hover::before {
  left: 100%;
}

.principal-icon {
  color: #ffffff !important;
  margin-right: 12px;
  font-size: 24px !important;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.principal-text {
  font-size: 16px !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  letter-spacing: 0.5px;
}

/* Botón Principal anterior - mantener para otros elementos */
.principal-btn {
  background: linear-gradient(45deg, #4CAF50, #45a049) !important;
  color: white !important;
}

.principal-btn:hover {
  background: linear-gradient(45deg, #45a049, #4CAF50) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
}

/* Botón Procesos - Verde */
.process-btn {
  background: linear-gradient(45deg, #4CAF50, #66BB6A) !important;
  color: white !important;
}

.process-btn:hover {
  background: linear-gradient(45deg, #66BB6A, #4CAF50) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
}

/* Botón Reportes - Azul */
.report-btn {
  background: linear-gradient(45deg, #2196F3, #42A5F5) !important;
  color: white !important;
}

.report-btn:hover {
  background: linear-gradient(45deg, #42A5F5, #2196F3) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
}

/* Botón Configuración - Gris */
.config-btn {
  background: linear-gradient(45deg, #757575, #9E9E9E) !important;
  color: white !important;
}

.config-btn:hover {
  background: linear-gradient(45deg, #9E9E9E, #757575) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(117, 117, 117, 0.3) !important;
}

/* Contenedores de submenu */
.submenu-container {
  margin-top: 0px;
  padding-left: 0px;
  margin-left: 0px;
}

.submenu-group {
  margin-bottom: 8px;
}

/* Botones de submenu */
.submenu-btn {
  height: 50px !important;
  border-radius: 0px !important;
  text-transform: none !important;
  font-size: 16px !important;
  color: #333333 !important;
  font-weight: 400 !important;
  justify-content: flex-start !important;
  padding: 6px 32px 6px 16px !important;
  margin-bottom: 0px !important;
  background-color: transparent !important;
  border: none !important;
  transition: all 0.2s ease !important;
  text-align: left !important;
  display: flex !important;
  align-items: center !important;
}

.submenu-btn:hover {
  background-color: rgba(240, 240, 240, 0.8) !important;
  color: #1a202c !important;
}

.submenu-icon {
  margin-right: 12px !important;
  font-size: 26px !important;
  transition: all 0.2s ease !important;
  opacity: 1 !important;
  min-width: 26px !important;
  flex-shrink: 0 !important;
}

.submenu-btn:hover .submenu-icon {
  transform: none !important;
}

.submenu-btn.router-link-active {
  background-color: rgba(240, 240, 240, 0.9) !important;
}

.submenu-btn.router-link-active .submenu-text {
  font-weight: 500 !important;
}

.submenu-text {
  flex: 1;
  text-align: left;
  font-weight: 400 !important;
  font-size: 16px !important;
  color: #333333 !important;
  line-height: 1.3 !important;
  display: flex !important;
  align-items: center !important;
}

/* Submenu nivel 2 */
.submenu2-container {
  margin-top: 0px;
  padding-left: 16px;
  margin-left: 0px;
}

.submenu2-btn {
  height: 46px !important;
  border-radius: 0px !important;
  text-transform: none !important;
  font-size: 15px !important;
  color: #333333 !important;
  font-weight: 400 !important;
  justify-content: flex-start !important;
  padding: 6px 32px 6px 16px !important;
  margin-bottom: 0px !important;
  background-color: transparent !important;
  border: none !important;
  transition: all 0.2s ease !important;
  text-align: left !important;
  display: flex !important;
  align-items: center !important;
}

.submenu2-btn:hover {
  background-color: rgba(240, 240, 240, 0.8) !important;
  color: #1a202c !important;
}

.submenu2-icon {
  margin-right: 12px !important;
  font-size: 24px !important;
  transition: all 0.2s ease !important;
  opacity: 1 !important;
  min-width: 24px !important;
  flex-shrink: 0 !important;
}

.submenu2-text {
  flex: 1;
  text-align: left;
  font-weight: 400 !important;
  font-size: 15px !important;
  color: #333333 !important;
  line-height: 1.3 !important;
  display: flex !important;
  align-items: center !important;
}

.submenu2-btn.router-link-active {
  background-color: rgba(240, 240, 240, 0.9) !important;
}

.submenu2-btn.router-link-active .submenu2-text {
  font-weight: 500 !important;
}

.expand-icon.small {
  font-size: 16px !important;
}

/* Transiciones suaves */
.nav-button,
.submenu-btn,
.submenu2-btn {
  transition: all 0.2s ease !important;
}

/* Estados activos */
.v-btn--active {
  transform: scale(0.98);
}

/* Responsivo */
@media (max-width: 960px) {
  .modern-nav {
    width: 280px !important;
  }
  
  .user-name {
    font-size: 14px;
  }
  
  .nav-button {
    height: 44px !important;
  }
}
</style>

