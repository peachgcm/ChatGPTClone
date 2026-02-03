#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Image paths
const inputPath = path.join(os.homedir(), 'Downloads', 'IMG_9419.jpg');
const outputPath = path.join(os.homedir(), 'Downloads', 'IMG_9419-enhanced.png');

console.log('🔍 Looking for image at:', inputPath);

// Try different extensions
const extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.HEIC'];
let foundPath = null;

if (fs.existsSync(inputPath)) {
  foundPath = inputPath;
} else {
  // Try without extension first
  const basePath = inputPath.replace(/\.[^.]+$/, '');
  for (const ext of extensions) {
    const testPath = basePath + ext;
    if (fs.existsSync(testPath)) {
      foundPath = testPath;
      console.log(`✅ Found image: ${testPath}`);
      break;
    }
  }
}

if (!foundPath) {
  console.error('❌ Could not find IMG_9419 in Downloads folder');
  console.log('\nPlease check:');
  console.log('1. The file exists in ~/Downloads/');
  console.log('2. The filename is exactly IMG_9419 (case-sensitive)');
  process.exit(1);
}

async function processImage() {
  try {
    console.log(`\n🎨 Processing: ${foundPath}`);
    console.log('⏳ Enhancing image for stage quality...\n');
    
    await sharp(foundPath)
      // Maximum sharpening - very aggressive for clarity
      .sharpen({
        sigma: 3.5,  // Very high sharpness
        flat: 3,     // Maximum flat areas sharpening
        jagged: 4    // Maximum jagged edges sharpening
      })
      // Unsharp mask for detail enhancement
      .sharpen({
        sigma: 1.5,
        m1: 1.5,
        m2: 3,
        x1: 3,
        y2: 15,
        y3: 30
      })
      // Additional sharpening pass
      .sharpen({
        sigma: 2.0,
        flat: 2.5,
        jagged: 3.5
      })
      .modulate({
        brightness: 1.2,   // Brighter for clarity
        saturation: 1.25,  // More vibrant
      })
      .normalise()
      .linear(1.6, -(128 * 0.6))  // Very strong contrast
      // Minimal noise reduction to preserve all detail
      .median(1)  // Minimal to preserve maximum detail
      // Very strong edge enhancement
      .convolve({
        width: 3,
        height: 3,
        kernel: [-2, -2, -2, -2, 16, -2, -2, -2, -2]  // Maximum edge enhancement
      })
      // Another edge enhancement pass
      .convolve({
        width: 3,
        height: 3,
        kernel: [0, -1, 0, -1, 5, -1, 0, -1, 0]  // Additional sharpening kernel
      })
      // Final aggressive sharpening
      .sharpen({
        sigma: 2.5,
        flat: 3,
        jagged: 4
      })
      // Use PNG for maximum quality (no compression artifacts)
      .png({ quality: 100, compressionLevel: 0 })
      .toFile(outputPath.replace('.jpg', '.png'));
    
    console.log('✅ Image enhanced successfully!');
    console.log(`📁 Saved to: ${outputPath}\n`);
    
    // File size comparison
    const inputStats = fs.statSync(foundPath);
    const finalOutputPath = outputPath.replace('.jpg', '.png');
    const outputStats = fs.statSync(finalOutputPath);
    console.log('📊 File size comparison:');
    console.log(`   Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
    console.log(`   Enhanced: ${(outputStats.size / 1024).toFixed(2)} KB`);
    console.log('\n✨ Your image is now stage-ready with maximum clarity!');
    
  } catch (error) {
    console.error('❌ Error processing image:', error.message);
    if (error.message.includes('sharp')) {
      console.log('\n💡 Tip: Make sure sharp is installed: npm install sharp');
    }
    process.exit(1);
  }
}

processImage();
