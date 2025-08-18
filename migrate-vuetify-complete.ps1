# Script de migración completa de Vuetify 2 a 3
# PowerShell con codificación UTF-8 mejorada

param(
    [string]$Path = "src"
)

# Configurar múltiples niveles de codificación UTF-8 para evitar problemas con tildes y ñ
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'UTF8'
chcp 65001 > $null

Write-Host "🚀 Iniciando migración completa de Vuetify 2 a 3..." -ForegroundColor Green
Write-Host ""

# Verificar que existe la carpeta src
if (-not (Test-Path $Path)) {
    Write-Host "❌ Carpeta '$Path' no encontrada" -ForegroundColor Red
    exit 1
}

# Buscar todos los archivos .vue
$vueFiles = Get-ChildItem -Path $Path -Recurse -Filter "*.vue" | Where-Object {
    $_.FullName -notmatch "(node_modules|dist|build|backup|\.git)" 
}

Write-Host "📁 Encontrados $($vueFiles.Count) archivos .vue" -ForegroundColor Cyan
Write-Host ""

$totalChanges = 0
$processedFiles = 0

foreach ($file in $vueFiles) {
    Write-Host "Procesando: $($file.FullName)" -ForegroundColor Yellow
    
    try {
        # Leer archivo con codificación UTF-8 explícita y BOM
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $originalContent = $content
        $changes = 0

        # 1. Cambiar :item-text a :item-title
        $itemTextMatches = [regex]::Matches($content, ":item-text=")
        if ($itemTextMatches.Count -gt 0) {
            $content = $content -replace ":item-text=", ":item-title="
            $changes += $itemTextMatches.Count
            Write-Host "  - Cambiados $($itemTextMatches.Count) :item-text a :item-title" -ForegroundColor Green
        }

        # 2. Cambiar @change a @update:model-value
        $changeMatches = [regex]::Matches($content, "@change=")
        if ($changeMatches.Count -gt 0) {
            $content = $content -replace "@change=", "@update:model-value="
            $changes += $changeMatches.Count
            Write-Host "  - Cambiados $($changeMatches.Count) @change a @update:model-value" -ForegroundColor Green
        }

        # 3. Cambiar activators de tooltips
        $onActivators = [regex]::Matches($content, 'v-slot:activator="\s*\{\s*on\s*\}\s*"')
        if ($onActivators.Count -gt 0) {
            $content = $content -replace 'v-slot:activator="\s*\{\s*on\s*\}\s*"', 'v-slot:activator="{ props }"'
            $changes += $onActivators.Count
            Write-Host "  - Cambiados $($onActivators.Count) activators {on} a {props}" -ForegroundColor Green
        }

        # 4. Cambiar v-on="on" a v-bind="props"
        $vOnOn = [regex]::Matches($content, 'v-on="on"')
        if ($vOnOn.Count -gt 0) {
            $content = $content -replace 'v-on="on"', 'v-bind="props"'
            $changes += $vOnOn.Count
            Write-Host "  - Cambiados $($vOnOn.Count) v-on=`"on`" a v-bind=`"props`"" -ForegroundColor Green
        }

        # 5. Headers de data-table: cambiar 'text' a 'title'
        $textHeaders = [regex]::Matches($content, '\{\s*text:\s*[''"][^''"]*[''"],')
        if ($textHeaders.Count -gt 0) {
            $content = $content -replace '\{\s*text:\s*([''"][^''"]*[''"],)', '{ title: $1'
            $changes += $textHeaders.Count
            Write-Host "  - Cambiados $($textHeaders.Count) headers text a title" -ForegroundColor Green
        }

        # 6. v-model:expanded
        $expandedModel = [regex]::Matches($content, 'v-model="expanded"')
        if ($expandedModel.Count -gt 0) {
            $content = $content -replace 'v-model="expanded"', 'v-model:expanded="expanded"'
            $changes += $expandedModel.Count
            Write-Host "  - Cambiados $($expandedModel.Count) v-model=`"expanded`" a v-model:expanded" -ForegroundColor Green
        }

        # 7. Cambiar outlined a variant="outlined" (solo standalone)
        $outlined = [regex]::Matches($content, '\boutlined\b(?!=)')
        if ($outlined.Count -gt 0) {
            $content = $content -replace '\boutlined\b(?!=)', 'variant="outlined"'
            $changes += $outlined.Count
            Write-Host "  - Cambiados $($outlined.Count) outlined a variant=`"outlined`"" -ForegroundColor Green
        }

        # Solo escribir si hubo cambios
        if ($content -ne $originalContent) {
            # Escribir archivo con codificación UTF-8 sin BOM para mantener compatibilidad
            $utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBomEncoding)
            Write-Host "  ✅ Archivo actualizado con $changes cambios" -ForegroundColor Green
            $processedFiles++
            $totalChanges += $changes
        } else {
            Write-Host "  ⚪ Sin cambios necesarios" -ForegroundColor Gray
        }

    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "🎉 Migración completada!" -ForegroundColor Green
Write-Host "📊 Archivos procesados: $processedFiles/$($vueFiles.Count)" -ForegroundColor Cyan
Write-Host "🔄 Total de cambios aplicados: $totalChanges" -ForegroundColor Cyan

if ($processedFiles -gt 0) {
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "1. Revisa los cambios con git diff" -ForegroundColor Yellow
    Write-Host "2. Prueba la aplicación para verificar que todo funcione" -ForegroundColor Yellow
    Write-Host "3. Ajusta manualmente cualquier caso específico que requiera atención" -ForegroundColor Yellow
}
