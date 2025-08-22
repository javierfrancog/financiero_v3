import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import money3 from 'v-money3'
import moment from 'moment'

// AGREGAR: Importar servicio de Excel
import { _informe } from './_excel.js'

// Configurar moment en español
import 'moment/locale/es'
moment.locale('es')

const app = createApp(App)

// Agregar moment como propiedad global
app.config.globalProperties.$moment = moment

// AGREGAR: Configurar Excel como propiedad global
app.config.globalProperties.$excel = { _informe }
window.excel = { _informe }

// Registro global del plugin con configuración por defecto
app.use(money3, {
  precision: 2,
  decimal: '.',
  thousands: ',',
  prefix: '',
  suffix: '',
  masked: false
})

app.use(router)
app.use(vuetify)

app.mount('#app')

