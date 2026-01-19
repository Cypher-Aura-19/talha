const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImages(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await compressImages(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
      try {
        const stats = fs.statSync(fullPath);
        const sizeMB = stats.size / (1024 * 1024);
        
        if (sizeMB > 0.5) { // Only compress if > 500KB
          console.log(`Compressing: ${fullPath} (${sizeMB.toFixed(2)}MB)`);
          
          await sharp(fullPath)
            .resize(1920, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
          
          console.log(`✓ Created WebP version`);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

compressImages('./public').then(() => {
  console.log('✓ Image compression complete!');
}).catch(err => {
  console.error('Error:', err);
});
