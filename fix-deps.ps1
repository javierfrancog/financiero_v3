# fix-deps.ps1
Write-Host "🔹 Eliminando node_modules y package-lock.json..."
Remove-Item -Recurse -Force node_modules -ErrorAction Ignore
Remove-Item -Force package-lock.json -ErrorAction Ignore

Write-Host "🔹 Limpiando caché de npm..."
npm cache clean --force

Write-Host "🔹 Instalando dependencias base..."
npm install --legacy-peer-deps

Write-Host "🔹 Instalando dependencias faltantes..."
npm install exceljs gapi-script jsbarcode papaparse fuse.js @ckeditor/ckeditor5-build-decoupled-document --legacy-peer-deps

Write-Host "✅ Dependencias reinstaladas correctamente"
