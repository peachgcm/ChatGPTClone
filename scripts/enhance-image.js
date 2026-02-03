const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the image path from command line or use default
const inputPath = process.argv[2] || path.join(os.homedir(), 'Downloads', 'IMG_9419.jpg');
const outputPath = process.argv[3] || path.join(os.homedir(), 'Downloads', 'IMG_9419-enhanced.jpg');

// Check if file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Image not found at ${inputPath}`);
  console.log('Trying common variations...');
  
  // Try different extensions
  const extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
  let found = false;
  
  for (const ext of extensions) {
    const testPath = inputPath.replace(/\.[^.]+$/, '') + ext;
    if (fs.existsSync(testPath)) {
      console.log(`Found: ${testPath}`);
      processImage(testPath, outputPath);
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.error('Could not find the image file. Please check the path.');
    process.exit(1);
  }
} else {
  processImage(inputPath, outputPath);
}

async function processImage(inputPath, outputPath) {
  try {
    console.log(`Processing: ${inputPath}`);
    console.log(`Output will be saved to: ${outputPath}`);
    
    await sharp(inputPath)
      // Aggressive sharpening for maximum clarity
      .sharpen({
        sigma: 2.5,  // Increased from 1.5
        flat: 2,     // Increased from 1
        jagged: 3    // Increased from 2
      })
      // Additional sharpening pass with unsharp mask
      .sharpen({
        sigma: 1.0,
        m1: 1,
        m2: 2,
        x1: 2,
        y2: 10,
        y3: 20
      })
      // Adjust brightness and contrast for stage lighting
      .modulate({
        brightness: 1.15,  // Increased brightness
        saturation: 1.2,   // More vibrant colors
      })
      // Enhance contrast for stage-like appearance
      .normalise()  // Normalize contrast
      .linear(1.4, -(128 * 0.4))  // Stronger contrast increase
      // Reduce noise while preserving details
      .median(2)  // Reduced from 3 to preserve more detail
      // Strong edge enhancement for clarity
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 12, -1, -1, -1, -1]  // Stronger edge enhancement
      })
      // Final sharpening pass
      .sharpen({
        sigma: 1.2,
        flat: 1.5,
        jagged: 2.5
      })
      // Convert to JPEG with maximum quality
      .jpeg({ quality: 98, mozjpeg: true })
      .toFile(outputPath);
    
    console.log('✅ Image enhanced successfully!');
    console.log(`📁 Saved to: ${outputPath}`);
    
    // Get file sizes for comparison
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    console.log(`\nFile size comparison:`);
    console.log(`Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
    console.log(`Enhanced: ${(outputStats.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('Error processing image:', error.message);
    process.exit(1);
  }
}
