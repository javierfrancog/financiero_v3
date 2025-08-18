@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🚀 Iniciando migración completa de Vuetify 2 a 3...
echo.

rem Verificar que existe Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado o no está en el PATH
    pause
    exit /b 1
)

rem Verificar que existe la carpeta src
if not exist "src" (
    echo ❌ Carpeta 'src' no encontrada
    pause
    exit /b 1
)

echo 📁 Buscando archivos .vue...
echo.

rem Crear un script temporal de Node.js que maneje la migración
echo const fs = require('fs');> temp_migrate.js
echo const path = require('path');>> temp_migrate.js
echo.>> temp_migrate.js
echo function findVueFiles(dir) {>> temp_migrate.js
echo     let results = [];>> temp_migrate.js
echo     const list = fs.readdirSync(dir);>> temp_migrate.js
echo     list.forEach(file =^> {>> temp_migrate.js
echo         const fullPath = path.join(dir, file);>> temp_migrate.js
echo         const stat = fs.statSync(fullPath);>> temp_migrate.js
echo         if (stat ^&^& stat.isDirectory()) {>> temp_migrate.js
echo             if (!['node_modules', 'dist', 'build', 'backup', '.git'].includes(file)) {>> temp_migrate.js
echo                 results = results.concat(findVueFiles(fullPath));>> temp_migrate.js
echo             }>> temp_migrate.js
echo         } else if (file.endsWith('.vue')) {>> temp_migrate.js
echo             results.push(fullPath);>> temp_migrate.js
echo         }>> temp_migrate.js
echo     });>> temp_migrate.js
echo     return results;>> temp_migrate.js
echo }>> temp_migrate.js
echo.>> temp_migrate.js
echo function migrateFile(filePath) {>> temp_migrate.js
echo     try {>> temp_migrate.js
echo         console.log(`Procesando: ${filePath}`);>> temp_migrate.js
echo         let content = fs.readFileSync(filePath, 'utf8');>> temp_migrate.js
echo         let originalContent = content;>> temp_migrate.js
echo         let changes = 0;>> temp_migrate.js
echo.>> temp_migrate.js
echo         // 1. :item-text a :item-title>> temp_migrate.js
echo         const itemTextMatches = content.match(/:item-text=/g);>> temp_migrate.js
echo         if (itemTextMatches) {>> temp_migrate.js
echo             content = content.replace(/:item-text=/g, ':item-title=');>> temp_migrate.js
echo             changes += itemTextMatches.length;>> temp_migrate.js
echo             console.log(`  - Cambiados ${itemTextMatches.length} :item-text a :item-title`);>> temp_migrate.js
echo         }>> temp_migrate.js
echo.>> temp_migrate.js
echo         // 2. @change a @update:model-value>> temp_migrate.js
echo         const changeMatches = content.match(/@change=/g);>> temp_migrate.js
echo         if (changeMatches) {>> temp_migrate.js
echo             content = content.replace(/@change=/g, '@update:model-value=');>> temp_migrate.js
echo             changes += changeMatches.length;>> temp_migrate.js
echo             console.log(`  - Cambiados ${changeMatches.length} @change a @update:model-value`);>> temp_migrate.js
echo         }>> temp_migrate.js
echo.>> temp_migrate.js
echo         // 3. Activators {on} a {props}>> temp_migrate.js
echo         const onActivators = content.match(/v-slot:activator="\s*{\s*on\s*}\s*"/g);>> temp_migrate.js
echo         if (onActivators) {>> temp_migrate.js
echo             content = content.replace(/v-slot:activator="\s*{\s*on\s*}\s*"/g, 'v-slot:activator="{ props }"');>> temp_migrate.js
echo             changes += onActivators.length;>> temp_migrate.js
echo             console.log(`  - Cambiados ${onActivators.length} activators {on} a {props}`);>> temp_migrate.js
echo         }>> temp_migrate.js
echo.>> temp_migrate.js
echo         // 4. v-on="on" a v-bind="props">> temp_migrate.js
echo         const vOnOn = content.match(/v-on="on"/g);>> temp_migrate.js
echo         if (vOnOn) {>> temp_migrate.js
echo             content = content.replace(/v-on="on"/g, 'v-bind="props"');>> temp_migrate.js
echo             changes += vOnOn.length;>> temp_migrate.js
echo             console.log(`  - Cambiados ${vOnOn.length} v-on="on" a v-bind="props"`);>> temp_migrate.js
echo         }>> temp_migrate.js
echo.>> temp_migrate.js
echo         // 5. Headers text a title>> temp_migrate.js
echo         const textHeaders = content.match(/{\s*text:\s*['"][^'"]*['"],/g);>> temp_migrate.js
echo         if (textHeaders) {>> temp_migrate.js
echo             content = content.replace(/{\s*text:\s*(['"][^'"]*['"],)/g, '{ title: $1');>> temp_migrate.js
echo             changes += textHeaders.length;>> temp_migrate.js
echo             console.log(`  - Cambiados ${textHeaders.length} headers text a title`);>> temp_migrate.js
echo         }>> temp_migrate.js
echo.>> temp_migrate.js
echo         // 6. v-model:expanded>> temp_migrate.js
echo         const expandedModel = content.match(/v-model="expanded"/g);>> temp_migrate.js
echo         if (expandedModel) {>> temp_migrate.js
echo             content = content.replace(/v-model="expanded"/g, 'v-model:expanded="expanded"');>> temp_migrate.js
echo             changes += expandedModel.length;>> temp_migrate.js
echo             console.log(`  - Cambiados ${expandedModel.length} v-model="expanded"`);>> temp_migrate.js
echo         }>> temp_migrate.js
echo.>> temp_migrate.js
echo         if (content !== originalContent) {>> temp_migrate.js
echo             fs.writeFileSync(filePath, content, 'utf8');>> temp_migrate.js
echo             console.log(`  ✅ Archivo actualizado con ${changes} cambios\n`);>> temp_migrate.js
echo             return changes;>> temp_migrate.js
echo         } else {>> temp_migrate.js
echo             console.log(`  ⚪ Sin cambios necesarios\n`);>> temp_migrate.js
echo             return 0;>> temp_migrate.js
echo         }>> temp_migrate.js
echo     } catch (error) {>> temp_migrate.js
echo         console.error(`❌ Error procesando ${filePath}:`, error.message);>> temp_migrate.js
echo         return 0;>> temp_migrate.js
echo     }>> temp_migrate.js
echo }>> temp_migrate.js
echo.>> temp_migrate.js
echo const vueFiles = findVueFiles('src');>> temp_migrate.js
echo console.log(`📁 Encontrados ${vueFiles.length} archivos .vue\n`);>> temp_migrate.js
echo.>> temp_migrate.js
echo let totalChanges = 0;>> temp_migrate.js
echo let processedFiles = 0;>> temp_migrate.js
echo.>> temp_migrate.js
echo vueFiles.forEach(file =^> {>> temp_migrate.js
echo     const changes = migrateFile(file);>> temp_migrate.js
echo     if (changes ^> 0) {>> temp_migrate.js
echo         processedFiles++;>> temp_migrate.js
echo         totalChanges += changes;>> temp_migrate.js
echo     }>> temp_migrate.js
echo });>> temp_migrate.js
echo.>> temp_migrate.js
echo console.log('🎉 Migración completada!');>> temp_migrate.js
echo console.log(`📊 Archivos procesados: ${processedFiles}/${vueFiles.length}`);>> temp_migrate.js
echo console.log(`🔄 Total de cambios aplicados: ${totalChanges}`);>> temp_migrate.js
echo.>> temp_migrate.js
echo if (processedFiles ^> 0) {>> temp_migrate.js
echo     console.log('\n⚠️  IMPORTANTE:');>> temp_migrate.js
echo     console.log('1. Revisa los cambios con git diff');>> temp_migrate.js
echo     console.log('2. Prueba la aplicación para verificar que todo funcione');>> temp_migrate.js
echo     console.log('3. Ajusta manualmente cualquier caso específico');>> temp_migrate.js
echo }>> temp_migrate.js

rem Ejecutar el script temporal de Node.js
echo Ejecutando migración con Node.js...
node temp_migrate.js

rem Limpiar archivo temporal
del temp_migrate.js >nul 2>&1

echo.
echo ✅ Proceso completado.
echo.
pause
