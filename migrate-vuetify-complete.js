const fs = require('fs');
const path = require('path');

// Función para buscar archivos .vue recursivamente
function findVueFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat && stat.isDirectory()) {
            // Ignorar carpetas node_modules, dist, build, backup
            if (!['node_modules', 'dist', 'build', 'backup', '.git'].includes(file)) {
                results = results.concat(findVueFiles(fullPath));
            }
        } else if (file.endsWith('.vue')) {
            results.push(fullPath);
        }
    });
    
    return results;
}

// Función para aplicar las transformaciones de Vuetify 2 a 3
function migrateVuetifyFile(filePath) {
    try {
        console.log(`Procesando: ${filePath}`);
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changes = 0;

        // 1. Cambiar :item-text a :item-title
        const itemTextMatches = content.match(/:item-text=/g);
        if (itemTextMatches) {
            content = content.replace(/:item-text=/g, ':item-title=');
            changes += itemTextMatches.length;
            console.log(`  - Cambiados ${itemTextMatches.length} :item-text a :item-title`);
        }

        // 2. Cambiar @change a @update:model-value en autocompletes y text-fields
        const changeMatches = content.match(/@change=/g);
        if (changeMatches) {
            content = content.replace(/@change=/g, '@update:model-value=');
            changes += changeMatches.length;
            console.log(`  - Cambiados ${changeMatches.length} @change a @update:model-value`);
        }

        // 3. Cambiar activators de tooltips de {on} a {props}
        const onActivators = content.match(/v-slot:activator="\s*{\s*on\s*}\s*"/g);
        if (onActivators) {
            content = content.replace(/v-slot:activator="\s*{\s*on\s*}\s*"/g, 'v-slot:activator="{ props }"');
            changes += onActivators.length;
            console.log(`  - Cambiados ${onActivators.length} activators {on} a {props}`);
        }

        // 4. Cambiar v-on="on" a v-bind="props"
        const vOnOn = content.match(/v-on="on"/g);
        if (vOnOn) {
            content = content.replace(/v-on="on"/g, 'v-bind="props"');
            changes += vOnOn.length;
            console.log(`  - Cambiados ${vOnOn.length} v-on="on" a v-bind="props"`);
        }

        // 5. Cambiar @input a @update:model-value en date-pickers
        const inputDatePicker = content.match(/@input=".*picker.*false"/g);
        if (inputDatePicker) {
            content = content.replace(/@input="/g, '@update:model-value="');
            console.log(`  - Cambiados eventos @input en date-pickers`);
        }

        // 6. Headers de data-table: cambiar 'text' a 'title'
        const textHeaders = content.match(/{\s*text:\s*['"][^'"]*['"],/g);
        if (textHeaders) {
            content = content.replace(/{\s*text:\s*(['"][^'"]*['"],)/g, '{ title: $1');
            changes += textHeaders.length;
            console.log(`  - Cambiados ${textHeaders.length} headers text a title`);
        }

        // 7. v-model:expanded en lugar de v-model para expanded
        const expandedModel = content.match(/v-model="expanded"/g);
        if (expandedModel) {
            content = content.replace(/v-model="expanded"/g, 'v-model:expanded="expanded"');
            changes += expandedModel.length;
            console.log(`  - Cambiados ${expandedModel.length} v-model="expanded" a v-model:expanded`);
        }

        // 8. item-key en lugar de item-value para data-table keys
        const itemValue = content.match(/item-value="[^"]*"/g);
        if (itemValue) {
            // Solo cambiar si está en contexto de data-table
            const dataTableContext = content.includes('v-data-table');
            if (dataTableContext) {
                content = content.replace(/item-value="/g, 'item-key="');
                console.log(`  - Cambiados item-value a item-key en data-tables`);
            }
        }

        // 9. Cambiar outlined a variant="outlined"
        const outlined = content.match(/\boutlined\b(?!=)/g);
        if (outlined) {
            content = content.replace(/\boutlined\b(?!=)/g, 'variant="outlined"');
            changes += outlined.length;
            console.log(`  - Cambiados ${outlined.length} outlined a variant="outlined"`);
        }

        // Solo escribir el archivo si hubo cambios
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Archivo actualizado con ${changes} cambios\n`);
            return changes;
        } else {
            console.log(`  ⚪ Sin cambios necesarios\n`);
            return 0;
        }

    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
        return 0;
    }
}

// Función principal
function main() {
    const srcPath = path.join(__dirname, 'src');
    
    if (!fs.existsSync(srcPath)) {
        console.error('❌ Carpeta src no encontrada');
        return;
    }

    console.log('🚀 Iniciando migración completa de Vuetify 2 a 3...\n');
    
    const vueFiles = findVueFiles(srcPath);
    console.log(`📁 Encontrados ${vueFiles.length} archivos .vue\n`);
    
    let totalChanges = 0;
    let processedFiles = 0;
    
    vueFiles.forEach(file => {
        const changes = migrateVuetifyFile(file);
        if (changes > 0) {
            processedFiles++;
            totalChanges += changes;
        }
    });
    
    console.log('🎉 Migración completada!');
    console.log(`📊 Archivos procesados: ${processedFiles}/${vueFiles.length}`);
    console.log(`🔄 Total de cambios aplicados: ${totalChanges}`);
    
    if (processedFiles > 0) {
        console.log('\n⚠️  IMPORTANTE:');
        console.log('1. Revisa los cambios con git diff');
        console.log('2. Prueba la aplicación para verificar que todo funcione');
        console.log('3. Ajusta manualmente cualquier caso específico que requiera atención');
    }
}

// Ejecutar el script
if (require.main === module) {
    main();
}

module.exports = { migrateVuetifyFile, findVueFiles };
