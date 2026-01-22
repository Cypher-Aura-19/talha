# Contact Video Compression Guide

## Problem
Your contact page video (`public/contact/vide.mp4`) is **97.19 MB** which is causing:
- Video stuttering/stopping every few seconds
- Slow page load times
- Poor user experience

## Solution: Compress to ~5-10 MB

### Option 1: Online Compression (Easiest - No Installation)

1. **Go to:** https://www.freeconvert.com/video-compressor
   
2. **Upload** `public/contact/vide.mp4`

3. **Settings:**
   - Target Size: 10 MB (or use custom settings below)
   - OR Custom Settings:
     - Video Codec: H.264
     - Resolution: 1920x1080 (or keep original if smaller)
     - Frame Rate: 30 fps
     - Bitrate: 1000 kbps
     - Audio Bitrate: 128 kbps

4. **Download** the compressed video

5. **Replace:**
   - Backup original: Rename `vide.mp4` to `vide-original.mp4`
   - Use compressed: Rename downloaded file to `vide.mp4`

### Option 2: Using HandBrake (Free Desktop App)

1. **Download HandBrake:** https://handbrake.fr/downloads.php

2. **Open** `public/contact/vide.mp4` in HandBrake

3. **Settings:**
   - Preset: "Web" → "Gmail Large 3 Minutes 720p30"
   - OR Custom:
     - Video Codec: H.264
     - Quality: RF 28
     - Frame Rate: 30 fps constant
     - Resolution: 1920x1080 max
     - Audio: AAC, 128 kbps

4. **Start Encode**

5. **Replace** the original file

### Option 3: Install FFmpeg (For Future Use)

**Windows (using Chocolatey):**
```bash
# Install Chocolatey first if you don't have it
# Then run:
choco install ffmpeg

# After installation, run:
node compress-contact-video.js
```

**Windows (Manual):**
1. Download: https://www.gyan.dev/ffmpeg/builds/
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to PATH
4. Restart terminal
5. Run: `node compress-contact-video.js`

## Expected Results

- **Original:** 97.19 MB
- **Compressed:** ~5-10 MB (90% reduction!)
- **Quality:** Still looks great
- **Performance:** Smooth playback, no stuttering

## After Compression

The video will:
✅ Load instantly
✅ Play smoothly without stuttering
✅ Use less bandwidth
✅ Provide better user experience

## Need Help?

If you have issues, you can:
1. Send me the video and I'll compress it for you
2. Use CloudConvert: https://cloudconvert.com/mp4-converter
3. Use any online video compressor that supports MP4
