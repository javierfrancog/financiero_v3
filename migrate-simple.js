const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migración de Vuetify 2 a 3...');

// Función para buscar archivos .vue
function findVueFiles(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat && stat.isDirectory()) {
                if (!['node_modules', 'dist', 'build', 'backup', '.git'].includes(file)) {
                    results = results.concat(findVueFiles(fullPath));
                }
            } else if (file.endsWith('.vue')) {
                results.push(fullPath);
            }
        });
    } catch (error) {
        console.error(`Error leyendo directorio ${dir}:`, error.message);
    }
    
    return results;
}

// Función principal de migración
function migrateFile(filePath) {
    try {
        console.log(`Procesando: ${filePath.replace(process.cwd(), '.')}`);
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changes = 0;

        // 1. :item-text a :item-title
        const itemTextMatches = content.match(/:item-text=/g);
        if (itemTextMatches) {
            content = content.replace(/:item-text=/g, ':item-title=');
            changes += itemTextMatches.length;
            console.log(`  ✓ ${itemTextMatches.length} :item-text → :item-title`);
        }

        // 2. @change a @update:model-value
        const changeMatches = content.match(/@change=/g);
        if (changeMatches) {
            content = content.replace(/@change=/g, '@update:model-value=');
            changes += changeMatches.length;
            console.log(`  ✓ ${changeMatches.length} @change → @update:model-value`);
        }

        // 3. Activators {on} a {props}
        const onActivators = content.match(/v-slot:activator="\s*{\s*on\s*}\s*"/g);
        if (onActivators) {
            content = content.replace(/v-slot:activator="\s*{\s*on\s*}\s*"/g, 'v-slot:activator="{ props }"');
            changes += onActivators.length;
            console.log(`  ✓ ${onActivators.length} activators {on} → {props}`);
        }

        // 4. v-on="on" a v-bind="props"
        const vOnOn = content.match(/v-on="on"/g);
        if (vOnOn) {
            content = content.replace(/v-on="on"/g, 'v-bind="props"');
            changes += vOnOn.length;
            console.log(`  ✓ ${vOnOn.length} v-on="on" → v-bind="props"`);
        }

        // 5. Headers text a title en data-tables
        const textHeaders = content.match(/{\s*text:\s*['"][^'"]*['"],/g);
        if (textHeaders) {
            content = content.replace(/{\s*text:\s*(['"][^'"]*['"],)/g, '{ title: $1');
            changes += textHeaders.length;
            console.log(`  ✓ ${textHeaders.length} headers text → title`);
        }

        // 6. v-model:expanded
        const expandedModel = content.match(/v-model="expanded"/g);
        if (expandedModel) {
            content = content.replace(/v-model="expanded"/g, 'v-model:expanded="expanded"');
            changes += expandedModel.length;
            console.log(`  ✓ ${expandedModel.length} v-model="expanded" → v-model:expanded`);
        }

        // Escribir cambios si los hay
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ ${changes} cambios aplicados\n`);
            return changes;
        } else {
            console.log(`  ⚪ Sin cambios necesarios\n`);
            return 0;
        }

    } catch (error) {
        console.error(`❌ Error en ${filePath}:`, error.message);
        return 0;
    }
}

// Ejecutar migración
try {
    const srcPath = path.join(__dirname, 'src');
    
    if (!fs.existsSync(srcPath)) {
        console.error('❌ Carpeta src no encontrada');
        process.exit(1);
    }

    const vueFiles = findVueFiles(srcPath);
    console.log(`📁 Encontrados ${vueFiles.length} archivos .vue\n`);
    
    let totalChanges = 0;
    let processedFiles = 0;
    
    vueFiles.forEach(file => {
        const changes = migrateFile(file);
        if (changes > 0) {
            processedFiles++;
            totalChanges += changes;
        }
    });
    
    console.log('🎉 ¡Migración completada!');
    console.log(`📊 Archivos procesados: ${processedFiles}/${vueFiles.length}`);
    console.log(`🔄 Total de cambios: ${totalChanges}`);
    
    if (processedFiles > 0) {
        console.log('\n⚠️  IMPORTANTE:');
        console.log('1. Revisa los cambios con: git diff');
        console.log('2. Prueba la aplicación');
        console.log('3. Ajusta casos específicos si es necesario');
    }
    
} catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
}
