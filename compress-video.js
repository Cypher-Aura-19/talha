const { execSync } = require('child_process');
const fs = require('fs');

// Check if ffmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('FFmpeg found, compressing video...');
  
  // Compress the video
  execSync('ffmpeg -i "public/contact/vide.mp4" -vcodec libx264 -crf 28 -preset fast "public/contact/vide-compressed.mp4"', { stdio: 'inherit' });
  
  const originalSize = fs.statSync('public/contact/vide.mp4').size / (1024 * 1024);
  const compressedSize = fs.statSync('public/contact/vide-compressed.mp4').size / (1024 * 1024);
  
  console.log(`Original: ${originalSize.toFixed(2)}MB`);
  console.log(`Compressed: ${compressedSize.toFixed(2)}MB`);
  console.log('Replace the original file with vide-compressed.mp4 if satisfied');
  
} catch (err) {
  console.log('FFmpeg not found. Install it from: https://ffmpeg.org/download.html');
  console.log('Or use an online tool like: https://www.freeconvert.com/video-compressor');
}
