const fs = require('fs');
const path = require('path');

function updateImageReferences(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      updateImageReferences(fullPath);
    } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Replace .png and .jpg with .webp in src attributes
      content = content.replace(/src="([^"]+)\.(png|jpg|jpeg)"/gi, 'src="$1.webp"');
      content = content.replace(/src='([^']+)\.(png|jpg|jpeg)'/gi, "src='$1.webp'");
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`✓ Updated: ${fullPath}`);
      }
    }
  }
}

updateImageReferences('./src');
console.log('✓ Image references updated!');
