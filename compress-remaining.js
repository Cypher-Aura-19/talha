const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filesToConvert = [
  'public/global/footer-right-arrow.png',
  'public/global/logo.png',
  'public/global/site-icon.png',
  'public/symbols/s1-dark.png',
  'public/symbols/s1-light.png',
  'public/symbols/s2-dark.png',
  'public/symbols/s2-light.png',
  'public/symbols/s3-dark.png',
  'public/symbols/s3-light.png',
  'public/logo.png'
];

async function convertToWebP() {
  for (const file of filesToConvert) {
    if (fs.existsSync(file)) {
      try {
        const stats = fs.statSync(file);
        const sizeMB = stats.size / (1024 * 1024);
        
        console.log(`Converting: ${file} (${sizeMB.toFixed(2)}MB)`);
        
        const outputPath = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        
        await sharp(file)
          .webp({ quality: 85 })
          .toFile(outputPath);
        
        console.log(`✓ Created: ${outputPath}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    } else {
      console.log(`File not found: ${file}`);
    }
  }
}

convertToWebP().then(() => {
  console.log('✓ All remaining images converted!');
}).catch(err => {
  console.error('Error:', err);
});
