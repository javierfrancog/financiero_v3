# Script PowerShell para migración masiva de Vuetify 2 a 3
# Ejecutar desde la raíz del proyecto

Write-Host "🚀 Iniciando migración masiva de Vuetify 2 → 3..." -ForegroundColor Cyan
Write-Host ""

# Buscar todos los archivos .vue en el proyecto
$archivosVue = Get-ChildItem -Path . -Recurse -Include "*.vue" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*backup*" -and
    $_.FullName -notlike "*.git*"
}

Write-Host "📁 Encontrados $($archivosVue.Count) archivos .vue" -ForegroundColor Green
Write-Host ""

$totalArchivosModificados = 0
$totalCambios = 0

foreach ($archivo in $archivosVue) {
    $content = Get-Content $archivo.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $cambiosEnArchivo = @()
    
    # 1. :item-text → :item-title
    if ($content -match ':item-text=') {
        $matches = ([regex]':item-text=').Matches($content).Count
        $content = $content -replace ':item-text=', ':item-title='
        $cambiosEnArchivo += "$matches ocurrencias de :item-text → :item-title"
    }
    
    # 2. v-slot:activator="{ on }" → v-slot:activator="{ props }"
    if ($content -match 'v-slot:activator="\{\s*on\s*\}"') {
        $matches = ([regex]'v-slot:activator="\{\s*on\s*\}"').Matches($content).Count
        $content = $content -replace 'v-slot:activator="\{\s*on\s*\}"', 'v-slot:activator="{ props }"'
        $cambiosEnArchivo += "$matches ocurrencias de activator='{on}' → activator='{props}'"
    }
    
    # 3. v-slot:activator="{ on, attrs }" → v-slot:activator="{ props }"
    if ($content -match 'v-slot:activator="\{\s*on,\s*attrs\s*\}"') {
        $matches = ([regex]'v-slot:activator="\{\s*on,\s*attrs\s*\}"').Matches($content).Count
        $content = $content -replace 'v-slot:activator="\{\s*on,\s*attrs\s*\}"', 'v-slot:activator="{ props }"'
        $cambiosEnArchivo += "$matches ocurrencias de activator='{on,attrs}' → activator='{props}'"
    }
    
    # 4. v-on="on" → v-bind="props"
    if ($content -match 'v-on="on"') {
        $matches = ([regex]'v-on="on"').Matches($content).Count
        $content = $content -replace 'v-on="on"', 'v-bind="props"'
        $cambiosEnArchivo += "$matches ocurrencias de v-on='on' → v-bind='props'"
    }
    
    # 5. v-bind="attrs" v-on="on" → v-bind="props"
    if ($content -match 'v-bind="attrs"\s+v-on="on"') {
        $matches = ([regex]'v-bind="attrs"\s+v-on="on"').Matches($content).Count
        $content = $content -replace 'v-bind="attrs"\s+v-on="on"', 'v-bind="props"'
        $cambiosEnArchivo += "$matches ocurrencias de v-bind='attrs' v-on='on' → v-bind='props'"
    }
    
    # 6. .sync → v-model:prop
    if ($content -match '(\w+)\.sync') {
        $syncMatches = [regex]::Matches($content, '(\w+)\.sync')
        $uniqueProps = $syncMatches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
        
        foreach ($prop in $uniqueProps) {
            $syncPattern = "$prop\.sync"
            $vModelPattern = "v-model:$prop"
            $matches = ([regex]$syncPattern).Matches($content).Count
            $content = $content -replace $syncPattern, $vModelPattern
            $cambiosEnArchivo += "$matches ocurrencias de $prop.sync → v-model:$prop"
        }
    }
    
    # 7. Eliminar outlined (opcional - comentado para evitar romper estilos)
    # if ($content -match '\s+outlined\s*\n') {
    #     $matches = ([regex]'\s+outlined\s*\n').Matches($content).Count
    #     $content = $content -replace '\s+outlined\s*\n', "`n"
    #     $cambiosEnArchivo += "$matches ocurrencias de 'outlined' eliminadas"
    # }
    
    # Solo escribir si hubo cambios
    if ($content -ne $originalContent) {
        Set-Content -Path $archivo.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalArchivosModificados++
        $totalCambios += $cambiosEnArchivo.Count
        
        Write-Host "✅ $($archivo.FullName)" -ForegroundColor Green
        foreach ($cambio in $cambiosEnArchivo) {
            Write-Host "   - $cambio" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "   • Archivos procesados: $($archivosVue.Count)" -ForegroundColor White
Write-Host "   • Archivos modificados: $totalArchivosModificados" -ForegroundColor Green
Write-Host "   • Total de cambios aplicados: $totalCambios" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Migración completada!" -ForegroundColor Magenta

# Mostrar archivos que necesitan revisión manual
Write-Host ""
Write-Host "⚠️  REVISIÓN MANUAL RECOMENDADA:" -ForegroundColor Yellow
Write-Host "   • v-list-item-icon/v-list-item-content → usar template con prepend-icon" -ForegroundColor Gray
Write-Host "   • v-edit-dialog → implementar diálogos personalizados" -ForegroundColor Gray
Write-Host "   • v-flex → v-col" -ForegroundColor Gray
Write-Host "   • Verificar v-slot con modificadores (.body, .item, etc.)" -ForegroundColor Gray
