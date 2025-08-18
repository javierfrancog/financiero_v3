const fs = require('fs');
const path = require('path');

console.log('Iniciando migración masiva Vuetify 2 → 3...');

function findVueFiles(dir) {
  let results = [];
  
  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        // Skip excluded directories
        if (!['node_modules', '.git', 'dist', 'build', 'backup'].includes(file)) {
          results = results.concat(findVueFiles(filePath));
        }
      } else if (file.endsWith('.vue')) {
        results.push(filePath);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
  }
  
  return results;
}

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let changes = 0;
    
    // 1. :item-text → :item-title
    if (content.includes(':item-text=')) {
      content = content.replace(/:item-text=/g, ':item-title=');
      changes++;
    }
    
    // 2. v-slot:activator="{ on }" → v-slot:activator="{ props }"
    if (content.includes('v-slot:activator="{ on }"')) {
      content = content.replace(/v-slot:activator="\{\s*on\s*\}"/g, 'v-slot:activator="{ props }"');
      changes++;
    }
    
    // 3. v-slot:activator="{ on, attrs }" → v-slot:activator="{ props }"
    if (content.includes('v-slot:activator="{ on, attrs }"')) {
      content = content.replace(/v-slot:activator="\{\s*on,\s*attrs\s*\}"/g, 'v-slot:activator="{ props }"');
      changes++;
    }
    
    // 4. v-on="on" → v-bind="props"
    if (content.includes('v-on="on"')) {
      content = content.replace(/v-on="on"/g, 'v-bind="props"');
      changes++;
    }
    
    // 5. v-bind="attrs" v-on="on" → v-bind="props"
    if (content.includes('v-bind="attrs"') && content.includes('v-on="on"')) {
      content = content.replace(/v-bind="attrs"\s+v-on="on"/g, 'v-bind="props"');
      changes++;
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      return { modified: true, changes };
    }
    
    return { modified: false, changes: 0 };
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    return { modified: false, changes: 0, error: err.message };
  }
}

// Main execution
const vueFiles = findVueFiles('./src');
console.log(`Found ${vueFiles.length} Vue files`);

let modifiedCount = 0;
let totalChanges = 0;

vueFiles.forEach(file => {
  const result = migrateFile(file);
  
  if (result.error) {
    console.log(`❌ ${path.basename(file)} - Error: ${result.error}`);
  } else if (result.modified) {
    modifiedCount++;
    totalChanges += result.changes;
    console.log(`✅ ${path.basename(file)} - ${result.changes} changes`);
  }
});

console.log('\n📊 SUMMARY:');
console.log(`   Files processed: ${vueFiles.length}`);
console.log(`   Files modified: ${modifiedCount}`);
console.log(`   Total changes: ${totalChanges}`);

if (modifiedCount > 0) {
  console.log('\n✨ Migration completed successfully!');
} else {
  console.log('\n🎉 All files already migrated!');
}
