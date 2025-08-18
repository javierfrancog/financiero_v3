const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.vue')) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                let modified = false;
                
                // Conversiones específicas para Vuetify 3
                if (content.includes(':item-text=')) {
                    content = content.replace(/:item-text=/g, ':item-title=');
                    modified = true;
                    console.log('Fixed :item-text in:', filePath);
                }
                
                if (content.includes('@change=')) {
                    content = content.replace(/@change=/g, '@update:model-value=');
                    modified = true;
                    console.log('Fixed @change in:', filePath);
                }
                
                // Arreglar v-slot:activator con {on} y attrs
                const vSlotPattern = /v-slot:activator="(\{[^}]*on[^}]*\})"/g;
                if (vSlotPattern.test(content)) {
                    content = content.replace(vSlotPattern, 'v-slot:activator="{ props }"');
                    modified = true;
                    console.log('Fixed v-slot:activator in:', filePath);
                }
                
                // Arreglar v-on="on" dentro de templates
                if (content.includes('v-on="on"')) {
                    content = content.replace(/v-on="on"/g, 'v-bind="props"');
                    modified = true;
                    console.log('Fixed v-on="on" in:', filePath);
                }
                
                if (modified) {
                    fs.writeFileSync(filePath, content, 'utf8');
                }
            } catch (error) {
                console.error('Error processing file:', filePath, error.message);
            }
        }
    });
}

console.log('Starting Vuetify 3 migration fixes...');
processDirectory('./src');
console.log('Migration completed!');
