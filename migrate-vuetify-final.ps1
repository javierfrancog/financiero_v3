# Script para migrar archivos Vue de Vuetify 2 a Vuetify 3
# Migración en lotes para evitar problemas de encoding

$ErrorActionPreference = "Continue"
$sourceDir = "C:\Titan\FinancieroV3\src"

Write-Host "Iniciando migración de Vuetify 3..." -ForegroundColor Green

# Obtener todos los archivos .vue
$vueFiles = Get-ChildItem -Path $sourceDir -Filter "*.vue" -Recurse

Write-Host "Encontrados $($vueFiles.Count) archivos .vue" -ForegroundColor Yellow

foreach ($file in $vueFiles) {
    try {
        Write-Host "Procesando: $($file.Name)" -ForegroundColor Cyan
        
        # Leer el archivo
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Aplicar las transformaciones
        $content = $content -replace ':item-text=', ':item-title='
        $content = $content -replace '@change=', '@update:model-value='
        $content = $content -replace 'v-on="on"', 'v-bind="props"'
        
        # Solo escribir si hubo cambios
        if ($content -ne $originalContent) {
            # Escribir con encoding UTF8 sin BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
            Write-Host "  ✓ Actualizado: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "  - Sin cambios: $($file.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  ❌ Error en $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nMigración completada!" -ForegroundColor Green
