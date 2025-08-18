const fs = require('fs');
const path = require('path');

function encontrarArchivosVue(dir, archivos = []) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorar carpetas innecesarias
        if (!['node_modules', '.git', 'dist', 'build', 'backup'].includes(item)) {
          encontrarArchivosVue(fullPath, archivos);
        }
      } else if (stat.isFile() && item.endsWith('.vue')) {
        archivos.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error leyendo directorio ${dir}:`, error.message);
  }
  
  return archivos;
}

function migrarArchivoVue(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let cambios = [];
    
    // 1. :item-text → :item-title
    let matches = content.match(/:item-text=/g);
    if (matches) {
      content = content.replace(/:item-text=/g, ':item-title=');
      cambios.push(`${matches.length} :item-text → :item-title`);
    }
    
    // 2. v-slot:activator="{ on }" → v-slot:activator="{ props }"
    matches = content.match(/v-slot:activator="\{\s*on\s*\}"/g);
    if (matches) {
      content = content.replace(/v-slot:activator="\{\s*on\s*\}"/g, 'v-slot:activator="{ props }"');
      cambios.push(`${matches.length} activator="{ on }" → activator="{ props }"`);
    }
    
    // 3. v-slot:activator="{ on, attrs }" → v-slot:activator="{ props }"
    matches = content.match(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g);
    if (matches) {
      content = content.replace(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g, 'v-slot:activator="{ props }"');
      cambios.push(`${matches.length} activator="{ on, attrs }" → activator="{ props }"`);
    }
    
    // 4. v-on="on" → v-bind="props"
    matches = content.match(/v-on="on"/g);
    if (matches) {
      content = content.replace(/v-on="on"/g, 'v-bind="props"');
      cambios.push(`${matches.length} v-on="on" → v-bind="props"`);
    }
    
    // 5. v-bind="attrs" v-on="on" → v-bind="props"
    matches = content.match(/v-bind="attrs"\s+v-on="on"/g);
    if (matches) {
      content = content.replace(/v-bind="attrs"\s+v-on="on"/g, 'v-bind="props"');
      cambios.push(`${matches.length} v-bind="attrs" v-on="on" → v-bind="props"`);
    }
    
    // 6. .sync → v-model:prop (excepto algunos casos especiales)
    matches = content.match(/(\w+)\.sync/g);
    if (matches) {
      const uniqueProps = [...new Set(matches.map(m => m.replace('.sync', '')))];
      uniqueProps.forEach(prop => {
        const regex = new RegExp(`\\b${prop}\\.sync\\b`, 'g');
        const propMatches = content.match(regex);
        if (propMatches) {
          content = content.replace(regex, `v-model:${prop}`);
          cambios.push(`${propMatches.length} ${prop}.sync → v-model:${prop}`);
        }
      });
    }
    
    // 7. Eliminar propiedades 'outlined' sobrantes (comentado para evitar problemas)
    // matches = content.match(/\s+outlined\s*\n/g);
    // if (matches) {
    //   content = content.replace(/\s+outlined\s*\n/g, '\n');
    //   cambios.push(`${matches.length} 'outlined' eliminados`);
    // }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      return { modificado: true, cambios };
    }
    
    return { modificado: false, cambios: [] };
    
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message);
    return { modificado: false, cambios: [], error: error.message };
  }
}

// Función principal
function ejecutarMigracion() {
  console.log('🚀 Iniciando migración masiva de Vuetify 2 → 3...\n');
  
  const archivosVue = encontrarArchivosVue('.');
  
  console.log(`📁 Encontrados ${archivosVue.length} archivos .vue\n`);
  
  let archivosModificados = 0;
  let totalCambios = 0;
  
  for (const archivo of archivosVue) {
    const resultado = migrarArchivoVue(archivo);
    
    if (resultado.error) {
      console.log(`❌ ${archivo} - Error: ${resultado.error}`);
    } else if (resultado.modificado) {
      archivosModificados++;
      totalCambios += resultado.cambios.length;
      
      console.log(`✅ ${archivo}`);
      resultado.cambios.forEach(cambio => {
        console.log(`   - ${cambio}`);
      });
    }
  }
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`   • Archivos procesados: ${archivosVue.length}`);
  console.log(`   • Archivos modificados: ${archivosModificados}`);
  console.log(`   • Total de cambios: ${totalCambios}`);
  
  if (archivosModificados > 0) {
    console.log(`\n✨ Migración completada exitosamente!`);
    console.log(`\n⚠️  REVISAR MANUALMENTE:`);
    console.log(`   • v-list-item-icon → usar template con prepend-icon`);
    console.log(`   • v-edit-dialog → implementar diálogos personalizados`);
    console.log(`   • v-flex → v-col`);
    console.log(`   • Verificar v-slot con modificadores`);
  } else {
    console.log(`\n🎉 Todos los archivos ya están migrados!`);
  }
}

// Ejecutar
ejecutarMigracion();
