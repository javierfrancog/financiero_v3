# Script para reemplazar item-text por item-title en Compcontab.vue
$file = "src\components\financiero\Compcontab.vue"
$content = Get-Content $file -Raw

# Reemplazar todas las ocurrencias de item-text por item-title
$content = $content -replace ':item-text=', ':item-title='

# También eliminar outlined de los v-autocomplete para Vuetify 3
$content = $content -replace 'outlined\s*\n', ''

# Guardar el archivo
Set-Content $file $content -NoNewline

Write-Host "Reemplazos completados en $file"
