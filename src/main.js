import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import moment from 'moment'

// ✅ IMPORTAR ESTILOS GLOBALES
import './assets/css/global-styles.css'

// ✅ IMPORTAR SERVICIO DE EXCEL
import './_excel.js'
const app = createApp(App)

// ✅ CONFIGURAR MOMENT.JS GLOBALMENTE
app.config.globalProperties.$moment = moment

// ✅ CONFIGURAR MOMENT EN ESPAÑOL
moment.locale('es')

app.use(router)
app.use(vuetify)

app.mount('#app')

