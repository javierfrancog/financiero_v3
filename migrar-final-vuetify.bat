@echo off
chcp 65001 > nul
echo Iniciando migración final de Vuetify 3...

cd /d "C:\Titan\FinancieroV3"

echo.
echo Convirtiendo :item-text a :item-title...
powershell -Command "Get-ChildItem -Path './src' -Filter '*.vue' -Recurse | ForEach-Object { $content = Get-Content $_.FullName -Raw -Encoding UTF8; if ($content -match ':item-text=') { $content = $content -replace ':item-text=', ':item-title='; $utf8NoBom = New-Object System.Text.UTF8Encoding($false); [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom); Write-Host 'Updated:' $_.Name } }"

echo.
echo Convirtiendo @change a @update:model-value...
powershell -Command "Get-ChildItem -Path './src' -Filter '*.vue' -Recurse | ForEach-Object { $content = Get-Content $_.FullName -Raw -Encoding UTF8; if ($content -match '@change=') { $content = $content -replace '@change=', '@update:model-value='; $utf8NoBom = New-Object System.Text.UTF8Encoding($false); [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom); Write-Host 'Updated:' $_.Name } }"

echo.
echo ¡Migración completada!
pause
