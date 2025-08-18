@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

echo Iniciando migracion masiva Vuetify 2 a 3...
echo.

set /a archivos_modificados=0
set /a total_cambios=0
set /a archivos_procesados=0

for /r %%f in (*.vue) do (
    set archivo=%%f
    
    rem Saltar carpetas excluidas
    echo !archivo! | findstr /i "node_modules .git dist build backup" >nul
    if errorlevel 1 (
        set /a archivos_procesados+=1
        
        rem Crear archivo temporal para los cambios
        set temp_file=!archivo!.tmp
        
        rem Aplicar transformaciones
        type "!archivo!" | powershell -Command "$input | ForEach-Object { $_ -replace ':item-text=', ':item-title=' -replace 'v-slot:activator=\"\\{\\s*on\\s*\\}\"', 'v-slot:activator=\"{ props }\"' -replace 'v-on=\"on\"', 'v-bind=\"props\"' }" > "!temp_file!"
        
        rem Verificar si hubo cambios
        fc /b "!archivo!" "!temp_file!" >nul 2>&1
        if errorlevel 1 (
            set /a archivos_modificados+=1
            move "!temp_file!" "!archivo!" >nul
            echo OK: %%~nxf
        ) else (
            del "!temp_file!" >nul
        )
    )
)

echo.
echo RESUMEN:
echo    Archivos procesados: !archivos_procesados!
echo    Archivos modificados: !archivos_modificados!
echo.
if !archivos_modificados! gtr 0 (
    echo Migracion completada exitosamente!
) else (
    echo Todos los archivos ya estaban migrados!
)

pause
