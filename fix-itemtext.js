const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'financiero', 'Compcontab.vue');

// Leer el archivo
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar todas las ocurrencias
content = content.replace(/:item-text=/g, ':item-title=');

// También eliminar outlined de los select/autocomplete para Vuetify 3
content = content.replace(/\s*outlined\s*\n/g, '\n');

// Guardar el archivo
fs.writeFileSync(filePath, content);

console.log('Reemplazos completados en Compcontab.vue');
