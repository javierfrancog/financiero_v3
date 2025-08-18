const fs = require('fs');

// Archivos específicos que necesitan migración
const targetFiles = [
    'C:\\Titan\\FinancieroV3\\src\\components\\trmcias\\Prtregreso.vue',
    'C:\\Titan\\FinancieroV3\\src\\components\\trmcias\\Prsolicitud.vue',
    'C:\\Titan\\FinancieroV3\\src\\components\\trespecial\\Trprextracto.vue'
];

console.log('🚀 Migración final de archivos específicos...');

targetFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        console.log(`\n📁 Procesando: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let changes = 0;
        
        // Reemplazar :item-text por :item-title
        if (content.includes(':item-text=')) {
            content = content.replace(/:item-text=/g, ':item-title=');
            changes++;
            console.log('  ✅ :item-text → :item-title');
        }
        
        // Reemplazar @change por @update:model-value
        if (content.includes('@change=')) {
            content = content.replace(/@change=/g, '@update:model-value=');
            changes++;
            console.log('  ✅ @change → @update:model-value');
        }
        
        if (changes > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  💾 Archivo guardado con ${changes} cambio(s)`);
        } else {
            console.log('  ℹ️  No se requieren cambios');
        }
    } else {
        console.log(`❌ Archivo no encontrado: ${filePath}`);
    }
});

console.log('\n🎉 ¡Migración completada!');
console.log('Verifica que todos los componentes funcionen correctamente.');
