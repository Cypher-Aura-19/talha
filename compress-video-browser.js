const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const fs = require('fs');
const path = require('path');

async function compressVideo() {
  const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: require.resolve('@ffmpeg/core/dist/ffmpeg-core.js')
  });
  
  console.log('Loading FFmpeg...');
  await ffmpeg.load();
  console.log('FFmpeg loaded!');

  const videoPath = 'public/contact/vide.mp4';
  const outputPath = 'public/contact/vide-compressed.mp4';

  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    return;
  }

  console.log('Reading video file...');
  const videoData = fs.readFileSync(videoPath);
  
  console.log('Writing to FFmpeg filesystem...');
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoPath));

  console.log('Compressing video...');
  // Compress with H.264 codec, reduce bitrate, scale down if needed
  await ffmpeg.run(
    '-i', 'input.mp4',
    '-c:v', 'libx264',
    '-crf', '28',
    '-preset', 'medium',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    'output.mp4'
  );

  console.log('Reading compressed video...');
  const data = ffmpeg.FS('readFile', 'output.mp4');

  console.log('Writing compressed video to disk...');
  fs.writeFileSync(outputPath, data);

  const originalSize = (fs.statSync(videoPath).size / 1024 / 1024).toFixed(2);
  const compressedSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  
  console.log(`✓ Video compressed!`);
  console.log(`  Original: ${originalSize}MB`);
  console.log(`  Compressed: ${compressedSize}MB`);
  console.log(`  Saved: ${(originalSize - compressedSize).toFixed(2)}MB`);
  console.log(`  Output: ${outputPath}`);
}

compressVideo().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
