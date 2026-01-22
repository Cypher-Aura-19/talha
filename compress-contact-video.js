const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputVideo = 'public/contact/vide.mp4';
const outputVideo = 'public/contact/vide-compressed.mp4';

console.log('🎬 Compressing contact video for optimal web performance...');
console.log(`📁 Input: ${inputVideo}`);

// Check if input exists
if (!fs.existsSync(inputVideo)) {
  console.error('❌ Input video not found!');
  process.exit(1);
}

// Get original size
const originalSize = fs.statSync(inputVideo).size / (1024 * 1024);
console.log(`📊 Original size: ${originalSize.toFixed(2)} MB`);

try {
  // Compress video with optimal settings for web
  // - CRF 28 for good quality/size balance
  // - Scale to max 1920 width (most screens)
  // - 30fps for smooth playback
  // - Fast decode preset for better browser performance
  const command = `ffmpeg -i "${inputVideo}" -c:v libx264 -crf 28 -preset medium -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -r 30 -c:a aac -b:a 128k -movflags +faststart "${outputVideo}" -y`;
  
  console.log('⚙️  Compressing... (this may take a minute)');
  execSync(command, { stdio: 'inherit' });
  
  // Get compressed size
  const compressedSize = fs.statSync(outputVideo).size / (1024 * 1024);
  const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  
  console.log(`\n✅ Compression complete!`);
  console.log(`📊 Compressed size: ${compressedSize.toFixed(2)} MB`);
  console.log(`💾 Saved: ${savings}% (${(originalSize - compressedSize).toFixed(2)} MB)`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Test the compressed video: public/contact/vide-compressed.mp4`);
  console.log(`   2. If quality is good, replace the original:`);
  console.log(`      - Backup: mv public/contact/vide.mp4 public/contact/vide-original.mp4`);
  console.log(`      - Replace: mv public/contact/vide-compressed.mp4 public/contact/vide.mp4`);
  
} catch (error) {
  console.error('❌ Compression failed:', error.message);
  console.log('\n💡 Make sure ffmpeg is installed:');
  console.log('   Windows: choco install ffmpeg');
  console.log('   Mac: brew install ffmpeg');
  console.log('   Linux: sudo apt install ffmpeg');
  process.exit(1);
}
