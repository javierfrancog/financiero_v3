<template>
  <div>
    <!-- Versión Vue 3 con Vuetify 3 del Navigation Drawer -->
    <v-navigation-drawer
      app
      v-model="isDrawerOpen"
      class="personal-shadow"
      floating
      width="300"
      src="https://titansoluciones.cloud/img/12fondomenu.png"
    >
      <!-- Logo de la empresa -->
      <v-list-item>
        <template v-slot:prepend>
          <v-img
            :src="logo_empresa"
            contain
            class="white mx-auto"
            height="120"
            max-width="120%"
            max-height="100"
          ></v-img>
        </template>
      </v-list-item>
      
      <v-divider
        class="mt-6"
        :style="{ 'border-width': '1px', 'border-color': 'orange' }"
      />

      <v-list>
        <!-- Opción Principal -->
        <v-list-item
          link
          class="mb-0"
          :to="'/menu'"
          v-show="opciones.length === 0"
          :disabled="bloqueo_ppal"
        >
          <template v-slot:prepend>
            <v-icon size="26" color="orange">mdi-home-outline</v-icon>
          </template>
          <v-list-item-title class="black--text subtitle-1">Principal</v-list-item-title>
        </v-list-item>

        <!-- Grupos de menú principales -->
        <v-list-group
          v-for="(item, index) in opciones"
          :key="index"
          v-model="item.active"
          v-show="validar_menu(item)"
        >
          <template v-slot:activator="{ props }">
            <v-list-item 
              v-bind="props"
              :class="`d-inline pa-2 black--text rounded-pill text-center ${getColorMenu(index)}`"
            >
              <template v-slot:prepend>
                <v-icon>{{ item.icono }}</v-icon>
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </template>

          <!-- Subopciones -->
          <v-list-item
            v-for="(sub, j) in item.submenu"
            :key="j + 'sub'"
            :to="item.ruta + sub.href"
            link
            v-show="!sub.submenu2 ? validar_submenu(sub) : false"
          >
            <template v-slot:prepend>
              <v-icon :color="getColorIcon(index)" size="30">{{ sub.icono }}</v-icon>
            </template>
            <v-list-item-title>{{ sub.text }}</v-list-item-title>
          </v-list-item>

          <!-- Submenu anidado -->
          <v-list-group
            v-for="(sub, j) in item.submenu"
            :key="j + 'submenu'"
            v-model="sub.active"
            v-show="sub.submenu2 ? validar_submenu(sub) : false"
            sub-group
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon :color="getColorIcon(index)" size="30">{{ sub.icono }}</v-icon>
                </template>
                <v-list-item-title>{{ sub.text }}</v-list-item-title>
              </v-list-item>
            </template>
            
            <v-list-item
              v-for="(submenu, i) in sub.submenu2"
              :key="i"
              :to="item.ruta + submenu.href"
              link
              exact
              v-show="validar_submenu(submenu)"
            >
              <template v-slot:prepend>
                <v-icon :color="getColorIcon(index)" size="30">{{ submenu.icono }}</v-icon>
              </template>
              <v-list-item-title>{{ submenu.text }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
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
    opciones: [],
    filtro_opciones: [],
    bloqueo_ppal: false,
    // Estructura de menús para cada módulo
    nav_menu: {
      financiero: [
        {
          text: "Procesos",
          icono: "mdi-cog",
          ruta: "/menu/financiero",
          submenu: [
            { text: "Comprobantes Contables", href: "/Compcontab", icono: "mdi-file-document", id: "comp01" },
            { text: "Reimprimir Comprobantes", href: "/PrReimpCb", icono: "mdi-printer", id: "reimp01" },
            { text: "Documentos Soporte", href: "/Docsoporte", icono: "mdi-file-multiple", id: "docsp01" },
            { text: "Anular Comprobantes", href: "/PrAnulaCb", icono: "mdi-cancel", id: "anula01" }
          ],
          active: false,
          id: "proc_fin"
        },
        {
          text: "Reportes",
          icono: "mdi-file-chart",
          ruta: "/menu/financiero",
          submenu: [
            { text: "Balance General", href: "/balance", icono: "mdi-chart-line", id: "bal01" },
            { text: "Estado de Resultados", href: "/resultado", icono: "mdi-chart-bar", id: "res01" },
            { text: "Cartera", href: "/PrCartera", icono: "mdi-account-cash", id: "cart01" }
          ],
          active: false,
          id: "rep_fin"
        },
        {
          text: "Configuración",
          icono: "mdi-settings",
          ruta: "/menu/financiero",
          submenu: [
            { text: "Usuarios", href: "/usuarios", icono: "mdi-account-multiple", id: "usr01" },
            { text: "Parámetros", href: "/parametros", icono: "mdi-cog-outline", id: "par01" }
          ],
          active: false,
          id: "conf_fin"
        }
      ],
      // Se pueden agregar más módulos aquí
      basico: [
        {
          text: "Procesos",
          icono: "mdi-cog",
          ruta: "/menu/basico",
          submenu: [
            { text: "Clientes", href: "/clientes", icono: "mdi-account-group", id: "cli01" }
          ],
          active: false,
          id: "proc_bas"
        }
      ]
    }
  }),
  computed: {
    isDrawerOpen: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.$emit('update:drawer', value);
      }
    }
  },
  created() {
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
  methods: {
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
          if (data && data.length > 0) {
            data.pop();
            this.filtro_opciones = data;
            this.validar();
            EventBus.emit("actualizarModulo", modulo);
            console.log("Menú cargado correctamente");
          }
        })
        .catch((err) => {
          console.error("Error al cargar menú del servidor:", err);
          // En caso de error, usar estructura estática
          this.validar();
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
      var ruta = this.$route.path.split("/")[2];
      var modulo = this.$route.params.modulo || ruta;
      
      console.log("Validando menú para módulo:", modulo);
      
      if (modulo && this.nav_menu[modulo]) {
        this.opciones = this.nav_menu[modulo];
        console.log("Opciones de menú cargadas:", this.opciones);
      } else {
        console.log("No se encontraron opciones para el módulo:", modulo);
        // this.$router.push({ path: "/" });
      }
    },

    getColorMenu(index) {
      if (index === 0) return "green lighten-3";
      else if (index === 1) return "blue accent-2";
      else if (index === 2) return "indigo lighten-4";
      return "";
    },
    
    getColorIcon(index) {
      if (index === 0) return "green darken-3";
      else if (index === 1) return "blue darken-1";
      else if (index === 2) return "purple dark";
      return "grey";
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
.v-application--is-ltr .v-list-group--no-action.v-list-group--sub-group > .v-list-group__items > .v-list-item
  padding-left: 40px!important

.v-application .primary--text
  color: var(--v-info-darken2) !important
  caret-color: var(--v-info-darken2) !important

.v-application--is-ltr .v-list-group--no-action > .v-list-group__items > div > .v-list-item
    padding-left: 40px!important

.v-list-item__title,
.v-list-item--dense .v-list-item__title
  font-size: 14px!important
  font-weight: 400!important

.v-navigation-drawer
  max-height: 100%!important

.v-navigation-drawer .v-list .v-list-item--active
  box-shadow: inset 4px 0px 0px
  color: var(--v-yellow-darken2) !important

.personal-shadow
  box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.1) !important
</style>
