const fs = require('fs');

const filePath = 'C:\\Titan\\FinancieroV3\\src\\components\\trmcias\\Prsolicitud.vue';

console.log('🔧 Migrando Prsolicitud.vue...');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Contar patrones antes
    const itemTextMatches = (content.match(/:item-text=/g) || []).length;
    const changeMatches = (content.match(/@change=/g) || []).length;
    
    console.log(`📊 Patrones encontrados:`);
    console.log(`  :item-text= : ${itemTextMatches}`);
    console.log(`  @change= : ${changeMatches}`);
    
    // Aplicar transformaciones
    if (content.includes(':item-text=')) {
        content = content.replace(/:item-text=/g, ':item-title=');
        changes++;
        console.log('✅ Convertido :item-text → :item-title');
    }
    
    if (content.includes('@change=')) {
        content = content.replace(/@change=/g, '@update:model-value=');
        changes++;
        console.log('✅ Convertido @change → @update:model-value');
    }
    
    if (changes > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`💾 Archivo actualizado con ${changes} tipo(s) de cambio(s)`);
        
        // Verificar resultados
        const newContent = fs.readFileSync(filePath, 'utf8');
        const remainingItemText = (newContent.match(/:item-text=/g) || []).length;
        const remainingChange = (newContent.match(/@change=/g) || []).length;
        
        console.log(`📊 Patrones restantes:`);
        console.log(`  :item-text= : ${remainingItemText}`);
        console.log(`  @change= : ${remainingChange}`);
    } else {
        console.log('ℹ️ No se requieren cambios');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('🎉 Proceso completado para Prsolicitud.vue');
