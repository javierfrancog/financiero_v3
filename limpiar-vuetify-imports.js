const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function limpiarImports(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.vue', '.sass', '.scss'].includes(ext)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    content = content.replace(/@import\s+['"]~vuetify\/src\/.*?['"]\s*;?/g, '');
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Limpio: ${filePath}`);
    }
  }
}

function recorrerDirectorio(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      recorrerDirectorio(fullPath);
    } else {
      limpiarImports(fullPath);
    }
  });
}

recorrerDirectorio(dir);
console.log('✅ Limpieza completada.');
