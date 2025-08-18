const fs = require('fs');
const path = require('path');

// Función para procesar un archivo
function procesarArchivo(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let cambiosRealizados = [];
    
    // 1. Cambiar :item-text por :item-title
    const itemTextMatches = content.match(/:item-text=/g);
    if (itemTextMatches) {
      content = content.replace(/:item-text=/g, ':item-title=');
      cambiosRealizados.push(`${itemTextMatches.length} ocurrencias de :item-text → :item-title`);
    }
    
    // 2. Cambiar v-slot:activator="{ on }" por v-slot:activator="{ props }"
    const activatorMatches = content.match(/v-slot:activator="\{\s*on\s*\}"/g);
    if (activatorMatches) {
      content = content.replace(/v-slot:activator="\{\s*on\s*\}"/g, 'v-slot:activator="{ props }"');
      cambiosRealizados.push(`${activatorMatches.length} ocurrencias de activator="{ on }" → activator="{ props }"`);
    }
    
    // 3. Cambiar v-slot:activator="{ on, attrs }" por v-slot:activator="{ props }"
    const activatorAttrsMatches = content.match(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g);
    if (activatorAttrsMatches) {
      content = content.replace(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g, 'v-slot:activator="{ props }"');
      cambiosRealizados.push(`${activatorAttrsMatches.length} ocurrencias de activator="{ on, attrs }" → activator="{ props }"`);
    }
    
    // 4. Cambiar v-on="on" por v-bind="props"
    const vOnMatches = content.match(/v-on="on"/g);
    if (vOnMatches) {
      content = content.replace(/v-on="on"/g, 'v-bind="props"');
      cambiosRealizados.push(`${vOnMatches.length} ocurrencias de v-on="on" → v-bind="props"`);
    }
    
    // 5. Cambiar v-bind="attrs" v-on="on" por v-bind="props"
    const vBindAttrsMatches = content.match(/v-bind="attrs"\s+v-on="on"/g);
    if (vBindAttrsMatches) {
      content = content.replace(/v-bind="attrs"\s+v-on="on"/g, 'v-bind="props"');
      cambiosRealizados.push(`${vBindAttrsMatches.length} ocurrencias de v-bind="attrs" v-on="on" → v-bind="props"`);
    }
    
    // 6. Eliminar outlined de v-autocomplete, v-select, v-text-field (opcional)
    const outlinedMatches = content.match(/\s+outlined\s*\n/g);
    if (outlinedMatches) {
      content = content.replace(/\s+outlined\s*\n/g, '\n');
      cambiosRealizados.push(`${outlinedMatches.length} ocurrencias de 'outlined' eliminadas`);
    }
    
    // 7. Cambiar expanded.sync por v-model:expanded
    const expandedSyncMatches = content.match(/expanded\.sync/g);
    if (expandedSyncMatches) {
      content = content.replace(/expanded\.sync/g, 'v-model:expanded');
      cambiosRealizados.push(`${expandedSyncMatches.length} ocurrencias de expanded.sync → v-model:expanded`);
    }
    
    // 8. Cambiar otros .sync patterns por v-model:prop
    const syncMatches = content.match(/(\w+)\.sync/g);
    if (syncMatches) {
      const uniqueSync = [...new Set(syncMatches)];
      uniqueSync.forEach(syncPattern => {
        const propName = syncPattern.replace('.sync', '');
        if (propName !== 'expanded') { // Ya lo manejamos arriba
          const regex = new RegExp(syncPattern.replace('.', '\\.'), 'g');
          content = content.replace(regex, `v-model:${propName}`);
          cambiosRealizados.push(`${propName}.sync → v-model:${propName}`);
        }
      });
    }
    
    // Solo escribir el archivo si hubo cambios
    if (cambiosRealizados.length > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${filePath}`);
      cambiosRealizados.forEach(cambio => console.log(`   - ${cambio}`));
      return cambiosRealizados.length;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return 0;
  }
}

// Función para buscar archivos .vue recursivamente
function buscarArchivosVue(dir, archivos = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ignorar node_modules y otras carpetas innecesarias
      if (!['node_modules', '.git', 'dist', 'build', 'backup'].includes(item)) {
        buscarArchivosVue(fullPath, archivos);
      }
    } else if (stat.isFile() && item.endsWith('.vue')) {
      archivos.push(fullPath);
    }
  }
  
  return archivos;
}

// Función principal
function migrarVuetifyMasivo() {
  console.log('🚀 Iniciando migración masiva de Vuetify 2 → 3...\n');
  
  const directorioBase = process.cwd();
  const archivosVue = buscarArchivosVue(directorioBase);
  
  console.log(`📁 Encontrados ${archivosVue.length} archivos .vue\n`);
  
  let totalArchivosModificados = 0;
  let totalCambios = 0;
  
  for (const archivo of archivosVue) {
    const cambios = procesarArchivo(archivo);
    if (cambios > 0) {
      totalArchivosModificados++;
      totalCambios += cambios;
    }
  }
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`   • Archivos procesados: ${archivosVue.length}`);
  console.log(`   • Archivos modificados: ${totalArchivosModificados}`);
  console.log(`   • Total de cambios: ${totalCambios}`);
  console.log(`\n✨ Migración completada!`);
}

// Ejecutar
migrarVuetifyMasivo();
