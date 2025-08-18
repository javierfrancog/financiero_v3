# Migracion masiva de Vuetify 2 a 3
Write-Host "Iniciando migracion masiva de Vuetify 2 a 3..." -ForegroundColor Green
Write-Host ""

function Process-ArchivoVue {
    param([string]$FilePath)
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding Default
        $originalContent = $content
        $cambios = @()
        
        # 1. :item-text -> :item-title
        $foundMatches = ([regex]':item-text=').Matches($content)
        if ($foundMatches.Count -gt 0) {
            $content = $content -replace ':item-text=', ':item-title='
            $cambios += "$($foundMatches.Count) :item-text -> :item-title"
        }
        
        # 2. v-slot:activator="{ on }" -> v-slot:activator="{ props }"
        $foundMatches = ([regex]'v-slot:activator="\{\s*on\s*\}"').Matches($content)
        if ($foundMatches.Count -gt 0) {
            $content = $content -replace 'v-slot:activator="\{\s*on\s*\}"', 'v-slot:activator="{ props }"'
            $cambios += "$($foundMatches.Count) activator con on -> activator con props"
        }
        
        # 3. v-slot:activator="{ on, attrs }" -> v-slot:activator="{ props }"
        $foundMatches = ([regex]'v-slot:activator="\{\s*on,\s*attrs\s*\}"').Matches($content)
        if ($foundMatches.Count -gt 0) {
            $content = $content -replace 'v-slot:activator="\{\s*on,\s*attrs\s*\}"', 'v-slot:activator="{ props }"'
            $cambios += "$($foundMatches.Count) activator con on y attrs -> activator con props"
        }
        
        # 4. v-on="on" -> v-bind="props"
        $foundMatches = ([regex]'v-on="on"').Matches($content)
        if ($foundMatches.Count -gt 0) {
            $content = $content -replace 'v-on="on"', 'v-bind="props"'
            $cambios += "$($foundMatches.Count) v-on=on -> v-bind=props"
        }
        
        # 5. v-bind="attrs" v-on="on" -> v-bind="props"
        $foundMatches = ([regex]'v-bind="attrs"\s+v-on="on"').Matches($content)
        if ($foundMatches.Count -gt 0) {
            $content = $content -replace 'v-bind="attrs"\s+v-on="on"', 'v-bind="props"'
            $cambios += "$($foundMatches.Count) attrs y on -> props"
        }
        
        # 6. .sync -> v-model:prop
        $foundMatches = ([regex]'(\w+)\.sync').Matches($content)
        if ($foundMatches.Count -gt 0) {
            $uniqueProps = $foundMatches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
            foreach ($prop in $uniqueProps) {
                $propMatches = ([regex]"\b$prop\.sync\b").Matches($content)
                if ($propMatches.Count -gt 0) {
                    $content = $content -replace "\b$prop\.sync\b", "v-model:$prop"
                    $cambios += "$($propMatches.Count) $prop.sync -> v-model:$prop"
                }
            }
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $FilePath -Value $content -Encoding Default
            return @{ modificado = $true; cambios = $cambios }
        }
        
        return @{ modificado = $false; cambios = @() }
        
    } catch {
        Write-Host "Error procesando $FilePath : $($_.Exception.Message)" -ForegroundColor Red
        return @{ modificado = $false; cambios = @(); error = $_.Exception.Message }
    }
}

# Buscar todos los archivos .vue
$archivosVue = Get-ChildItem -Path . -Recurse -Include "*.vue" | 
    Where-Object { $_.DirectoryName -notmatch "(node_modules|\.git|dist|build|backup)" }

Write-Host "Encontrados $($archivosVue.Count) archivos .vue" -ForegroundColor Yellow
Write-Host ""

$archivosModificados = 0
$totalCambios = 0

foreach ($archivo in $archivosVue) {
    $resultado = Process-ArchivoVue -FilePath $archivo.FullName
    
    if ($resultado.error) {
        Write-Host "ERROR $($archivo.Name) - $($resultado.error)" -ForegroundColor Red
    } elseif ($resultado.modificado) {
        $archivosModificados++
        $totalCambios += $resultado.cambios.Count
        
        Write-Host "OK $($archivo.Name)" -ForegroundColor Green
        foreach ($cambio in $resultado.cambios) {
            Write-Host "   - $cambio" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "RESUMEN:" -ForegroundColor Cyan
Write-Host "   • Archivos procesados: $($archivosVue.Count)" -ForegroundColor White
Write-Host "   • Archivos modificados: $archivosModificados" -ForegroundColor White
Write-Host "   • Total de cambios: $totalCambios" -ForegroundColor White

if ($archivosModificados -gt 0) {
    Write-Host ""
    Write-Host "Migracion completada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "REVISAR MANUALMENTE:" -ForegroundColor Yellow
    Write-Host "   • v-list-item-icon -> usar template con prepend-icon" -ForegroundColor White
    Write-Host "   • v-edit-dialog -> implementar dialogos personalizados" -ForegroundColor White
    Write-Host "   • v-flex -> v-col" -ForegroundColor White
    Write-Host "   • Verificar v-slot con modificadores" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Todos los archivos ya estan migrados!" -ForegroundColor Green
}
