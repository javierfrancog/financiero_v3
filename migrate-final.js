const fs = require('fs');
const path = require('path');

// Función para procesar todos los archivos .vue en un directorio
function migrateVuetify3(dir) {
    console.log('Iniciando migración de Vuetify 3 en:', dir);
    
    function processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let hasChanges = false;
            
            // 1. Cambiar :item-text por :item-title
            if (newContent.includes(':item-text=')) {
                newContent = newContent.replace(/:item-text=/g, ':item-title=');
                hasChanges = true;
                console.log('✓ :item-text → :item-title en', path.basename(filePath));
            }
            
            // 2. Cambiar @change por @update:model-value
            if (newContent.includes('@change=')) {
                newContent = newContent.replace(/@change=/g, '@update:model-value=');
                hasChanges = true;
                console.log('✓ @change → @update:model-value en', path.basename(filePath));
            }
            
            // 3. Arreglar v-slot:activator con { on, attrs }
            const vSlotPattern = /v-slot:activator="(\{[^}]*(?:on|attrs)[^}]*\})"/g;
            if (vSlotPattern.test(newContent)) {
                newContent = newContent.replace(vSlotPattern, 'v-slot:activator="{ props }"');
                hasChanges = true;
                console.log('✓ v-slot:activator actualizado en', path.basename(filePath));
            }
            
            // 4. Cambiar v-on="on" por v-bind="props"
            if (newContent.includes('v-on="on"')) {
                newContent = newContent.replace(/v-on="on"/g, 'v-bind="props"');
                hasChanges = true;
                console.log('✓ v-on="on" → v-bind="props" en', path.basename(filePath));
            }
            
            // Guardar cambios si hubo modificaciones
            if (hasChanges) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log('💾 Guardado:', filePath);
            }
            
        } catch (error) {
            console.error('❌ Error procesando', filePath, ':', error.message);
        }
    }
    
    function walkDirectory(currentDir) {
        const files = fs.readdirSync(currentDir);
        
        files.forEach(file => {
            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDirectory(fullPath);
            } else if (file.endsWith('.vue')) {
                processFile(fullPath);
            }
        });
    }
    
    walkDirectory(dir);
    console.log('🎉 Migración completada!');
}

// Ejecutar la migración
const srcDir = path.join(__dirname, 'src');
migrateVuetify3(srcDir);
