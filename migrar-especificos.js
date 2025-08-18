const fs = require('fs');
const path = require('path');

// Lista de archivos que necesitan migración (basado en grep_search)
const archivosPorMigrar = [
  'src/components/trmcias/Prtregreso.vue',
  'src/components/trmcias/Prsolicitud.vue', 
  'src/components/trmcias/PrRemision.vue'
];

function migrarArchivo(filePath) {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Archivo no encontrado: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let cambios = [];
    
    // 1. :item-text → :item-title
    const itemTextCount = (content.match(/:item-text=/g) || []).length;
    if (itemTextCount > 0) {
      content = content.replace(/:item-text=/g, ':item-title=');
      cambios.push(`${itemTextCount} :item-text → :item-title`);
    }
    
    // 2. v-slot:activator="{ on }" → v-slot:activator="{ props }"
    const activatorOnCount = (content.match(/v-slot:activator="\{\s*on\s*\}"/g) || []).length;
    if (activatorOnCount > 0) {
      content = content.replace(/v-slot:activator="\{\s*on\s*\}"/g, 'v-slot:activator="{ props }"');
      cambios.push(`${activatorOnCount} activator="{ on }" → activator="{ props }"`);
    }
    
    // 3. v-slot:activator="{ on, attrs }" → v-slot:activator="{ props }"
    const activatorAttrsCount = (content.match(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g) || []).length;
    if (activatorAttrsCount > 0) {
      content = content.replace(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g, 'v-slot:activator="{ props }"');
      cambios.push(`${activatorAttrsCount} activator="{ on, attrs }" → activator="{ props }"`);
    }
    
    // 4. v-on="on" → v-bind="props"
    const vOnCount = (content.match(/v-on="on"/g) || []).length;
    if (vOnCount > 0) {
      content = content.replace(/v-on="on"/g, 'v-bind="props"');
      cambios.push(`${vOnCount} v-on="on" → v-bind="props"`);
    }
    
    // 5. v-bind="attrs" v-on="on" → v-bind="props"
    const vBindAttrsCount = (content.match(/v-bind="attrs"\s+v-on="on"/g) || []).length;
    if (vBindAttrsCount > 0) {
      content = content.replace(/v-bind="attrs"\s+v-on="on"/g, 'v-bind="props"');
      cambios.push(`${vBindAttrsCount} v-bind="attrs" v-on="on" → v-bind="props"`);
    }
    
    // 6. .sync → v-model:prop
    const syncMatches = content.match(/(\w+)\.sync/g) || [];
    const uniqueSync = [...new Set(syncMatches)];
    uniqueSync.forEach(syncPattern => {
      const propName = syncPattern.replace('.sync', '');
      const regex = new RegExp(syncPattern.replace('.', '\\.'), 'g');
      const count = (content.match(regex) || []).length;
      content = content.replace(regex, `v-model:${propName}`);
      cambios.push(`${count} ${propName}.sync → v-model:${propName}`);
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ ${filePath}`);
      cambios.forEach(cambio => console.log(`   - ${cambio}`));
      return true;
    } else {
      console.log(`ℹ️  ${filePath} - Sin cambios necesarios`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Ejecutar migración
console.log('🚀 Migrando archivos específicos de Vuetify 2 → 3...\n');

let archivosModificados = 0;

// Primero terminar de migrar Compcontab.vue
console.log('📝 Terminando migración de Compcontab.vue...');
if (migrarArchivo('src/components/financiero/Compcontab.vue')) {
  archivosModificados++;
}

console.log('\n📁 Migrando otros archivos con :item-text...');
archivosPorMigrar.forEach(archivo => {
  if (migrarArchivo(archivo)) {
    archivosModificados++;
  }
});

console.log(`\n✨ Migración completada: ${archivosModificados} archivos modificados`);
