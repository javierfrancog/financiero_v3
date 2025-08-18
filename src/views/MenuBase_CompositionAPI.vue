<template>
  <v-app>
    <appBar @toggleNav="toggleNav" />
    <v-main>
      <v-container fluid class="pa-6">
        <v-row class="justify-center">
          <v-col
            class="d-flex"
            cols="12"
            sm="4"
            v-for="(item, index) in menus"
            :key="index"
          >
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-card class="mx-auto" max-width="300" v-bind="props">
                  <v-img :src="item.src"></v-img>
                  <v-fade-transition>
                    <v-overlay v-if="isHovering" class="d-flex align-center justify-center" contained>
                      <v-btn color="blue-darken-3" variant="elevated" :to="item.to">
                        Ingresar
                      </v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-card>
              </template>
            </v-hover>
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
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import appBar from "@/components/appBar.vue"
import post from "../methods.js"
import { EventBus } from "@/eventBus"

// Variables reactivas
const drawer = ref(true)
const overlay = ref(false)
const snackbar = ref({
  estado: false,
  color: '',
  text: ''
})

const menus = ref([])

// Computed properties
const logo = computed(() => {
  return `https://server1ts.net//Datos/image/clientes/${parseFloat(
    sessionStorage.Sesion.substr(0, 15)
  )}.png`
})

// Methods
const validar_modulos = () => {
  const menuItems = [
    {
      nro: 1,
      titleBtn: "Financiero",
      src: "https://server1ts.net//Datos/image/botonfin.png",
      to: { name: "menu", params: { modulo: "financiero" } },
      name: "financiero_rep",
    },
    {
      nro: 2,
      titleBtn: "Mercancías",
      src: "https://server1ts.net//Datos/image/boton_mcia.png",
      to: { name: "menu", params: { modulo: "punto_venta" } },
      name: "punto_venta_rep",
    },
    {
      nro: 3,
      titleBtn: "Gestión T.H.",
      src: "https://server1ts.net//Datos/image/boton_gth.png",
      to: { name: "menu", params: { modulo: "gestion_th" } },
      name: "gth_rep",
    },
    {
      nro: 4,
      titleBtn: "Imagenología",
      src: "https://server1ts.net//Datos/image/boton_rx.png",
      to: { name: "menu", params: { modulo: "clinico" } },
      name: "cl_rx_rep",
    },
    {
      nro: 5,
      titleBtn: "H_Clinica",
      src: "https://server1ts.net//Datos/image/boton_hclinica.png",
      to: { name: "menu", params: { modulo: "hclinica" } },
      name: "hclinica_rep",
    },
    {
      nro: 6,
      titleBtn: "S.Salud",
      src: "https://server1ts.net//Datos/image/boton_ssalud.png",
      to: { name: "menu", params: { modulo: "ssalud" } },
      name: "ssalud_rep",
    },
    {
      nro: 7,
      titleBtn: "Fact_Colegios",
      src: "https://server1ts.net//Datos/image/boton_col.png",
      to: { name: "menu", params: { modulo: "colegio" } },
      name: "col_rep",
    },
    {
      nro: 8,
      titleBtn: "Molinos",
      src: "https://server1ts.net//Datos/image/boton_mol.png",
      to: { name: "menu", params: { modulo: "molino" } },
      name: "mol_rep",
    },
    {
      nro: 9,
      titleBtn: "Serv_Domiciliarios",
      src: "https://server1ts.net//Datos/image/boton_servdm.png",
      to: { name: "menu", params: { modulo: "servdm" } },
      name: "servdm_rep",
    },
    {
      nro: 10,
      titleBtn: "Tablero_Administrativo",
      src: "https://server1ts.net//Datos/image/boton_tablero.png",
      to: { name: "menu", params: { modulo: "tablero" } },
      name: "tablero_rep",
    },
    {
      nro: 11,
      titleBtn: "Recaudo_Servicios_Publicos",
      src: "https://server1ts.net//Datos/image/boton_recaudos.png",
      to: { name: "menu", params: { modulo: "recaudos" } },
      name: "recaudos_rep",
    },
    {
      nro: 12,
      titleBtn: "Gestión Asociados",
      src: "https://server1ts.net//Datos/image/boton_asociados.png",
      to: { name: "menu", params: { modulo: "asociados" } },
      name: "asociados_rep",
    },
    {
      nro: 13,
      titleBtn: "Mesa de Ayuda",
      src: "https://server1ts.net//Datos/image/boton_soporte.png",
      to: { name: "menu", params: { modulo: "soporte" } },
      name: "soporte_rep",
    },
    {
      nro: 14,
      titleBtn: "Transporte Intermunicipal",
      src: "https://server1ts.net//Datos/image/boton_transporte.png",
      to: { name: "menu", params: { modulo: "transporte" } },
      name: "transporte_rep",
    },
    {
      nro: 15,
      titleBtn: "Manual del Usuario",
      src: "https://server1ts.net//Datos/image/boton_manual.png",
      to: { name: "menu", params: { modulo: "manual" } },
      name: "manual_rep",
    },
    {
      nro: 16,
      titleBtn: "Resultados Médicos",
      src: "https://server1ts.net//Datos/image/boton_resmed.png",
      to: { name: "menu", params: { modulo: "resmed" } },
      name: "resmed_rep",
    },
    {
      nro: 17,
      titleBtn: "Transporte Especial",
      src: "https://server1ts.net//Datos/image/boton_trespecial.png",
      to: { name: "menu", params: { modulo: "trespecial" } },
      name: "trespecial_rep",
    },
    {
      nro: 18,
      titleBtn: "Dispensación Medicamentos",
      src: "https://server1ts.net//Datos/image/boton_dispensa.png",
      to: { name: "menu", params: { modulo: "dispensa" } },
      name: "dispensa_rep",
    },
    {
      nro: 19,
      titleBtn: "Documentos Electrónicos",
      src: "https://server1ts.net//Datos/image/boton_docelectr.png",
      to: { name: "menu", params: { modulo: "docselect" } },
      name: "doceletric_rep",
    },
    {
      nro: 20,
      titleBtn: "Pruebas",
      src: "https://server1ts.net//Datos/image/boton_testeo.png",
      to: { name: "menu", params: { modulo: "testeo" } },
      name: "testeo_rep",
    },
    {
      nro: 21,
      titleBtn: "Comercio a Plazos",
      src: "https://server1ts.net//Datos/image/boton_plazos.png",
      to: { name: "menu", params: { modulo: "plazos" } },
      name: "plazos_rep",
    },
    {
      nro: 22,
      titleBtn: "Autogestión Colaboradores",
      src: "https://server1ts.net//Datos/image/boton_autocolabora.png",
      to: { name: "menu", params: { modulo: "autocolabora" } },
      name: "autocolabora_rep",
    },
    {
      nro: 23,
      titleBtn: "Propiedad Horizontal",
      src: "https://server1ts.net//Datos/image/boton_phorizontal.png",
      to: { name: "menu", params: { modulo: "phorizontal" } },
      name: "phorizontal_rep",
    },
    {
      nro: 24,
      titleBtn: "Transporte Mercancías",
      src: "https://server1ts.net//Datos/image/boton_trmcias.png",
      to: { name: "menu", params: { modulo: "trmcias" } },
      name: "transmcias_rep",
    },
    {
      nro: 25,
      titleBtn: "Hseq",
      src: "https://server1ts.net//Datos/image/boton_hseq.png",
      to: { name: "menu", params: { modulo: "hseq" } },
      name: "hseq_rep",
    },
  ]

  post
    .postData({
      url: "Financiero/dlls/menuJ.dll",
      data: sessionStorage.Sesion + "|",
      method: "",
    })
    .then((datos) => {
      let modulos = datos[0]
      console.log("modulos", modulos)
      let filtro = menuItems.filter((el) => {
        let item = modulos[el.name] || false
        return item == "1" ? el : false
      })
      menus.value = filtro

      // this.activar_notificacion(datos[0].notifica);
    })
}

const activar_notificacion = (datos) => {
  datos.pop()
  let send_mensaje = "Hoy es el cumpleaños de "
  const startIndex = 0

  for (const item of datos.slice(startIndex)) {
    send_mensaje = send_mensaje + item.colaborador.trim()
    EventBus.emit("nuevaNotificacion", {
      mensaje: send_mensaje,
      colorTexto: "green",
    })
  }
}

const toggleNav = (data) => {
  drawer.value = !drawer.value
}

const snack = (data) => {
  snackbar.value = data
}

// Lifecycle hooks
onMounted(() => {
  EventBus.emit("actualizarModulo", "N/A")
  validar_modulos()
})
</script>
