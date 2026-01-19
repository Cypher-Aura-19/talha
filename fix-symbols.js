const fs = require('fs');
const path = require('path');

function fixSymbolReferences(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixSymbolReferences(fullPath);
    } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Revert symbol images back to .png
      content = content.replace(/\/symbols\/([^"']+)\.webp/g, '/symbols/$1.png');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`✓ Fixed: ${fullPath}`);
      }
    }
  }
}

fixSymbolReferences('./src');
console.log('✓ Symbol references fixed!');
