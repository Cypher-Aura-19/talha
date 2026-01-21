# Video Compression Guide

## Option 1: Install FFmpeg (Recommended)

### Windows:
1. Download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
2. Extract the zip file
3. Add the `bin` folder to your system PATH
4. Restart your terminal
5. Run: `ffmpeg -version` to verify installation

### Then compress your video:
```bash
ffmpeg -i public/contact/vide.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart public/contact/vide-compressed.mp4
```

This will:
- Use H.264 codec for better compression
- CRF 28 (good quality, smaller size)
- Optimize for web streaming (faststart)
- Compress audio to 128k

## Option 2: Online Tools (Quick & Easy)

Use one of these free online tools:
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/
- https://www.ps2pdf.com/compress-mp4

Upload your video, compress it, and download the result.

## Option 3: HandBrake (GUI Tool)

1. Download HandBrake: https://handbrake.fr/
2. Open your video
3. Choose "Web" preset
4. Click "Start Encode"

## Current Video Location
- Input: `public/contact/vide.mp4`
- Output: `public/contact/vide-compressed.mp4` (after compression)

## After Compression
Update the video source in `src/app/contact/page.js`:
```javascript
<video src="/contact/vide-compressed.mp4" autoPlay loop playsInline preload="auto" loading="eager"></video>
```
