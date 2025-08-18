import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import money3 from 'v-money3' // ? Import plugin Vue 3
import moment from 'moment'

// Configurar moment en español
import 'moment/locale/es'
moment.locale('es')

const app = createApp(App)

// Agregar moment como propiedad global
app.config.globalProperties.$moment = moment

// Registro global del plugin con configuración por defecto
app.use(money3, {
  precision: 2,     // Número de decimales
  decimal: '.',     // Separador decimal
  thousands: ',',   // Separador de miles
  prefix: '',       // Prefijo (por ejemplo "$ ")
  suffix: '',       // Sufijo (por ejemplo " USD")
  masked: false     // true = retorna string formateado, false = número
})

app.use(router)
app.use(vuetify)

app.mount('#app')

