const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.resolve(__dirname, '../assets/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);
const assetsDir = path.resolve(__dirname, '../assets');

async function generate() {
  console.log('Generating icons from SVG...');

  // 1. Main app icon — 1024x1024
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('✅ icon.png');

  // 2. Android adaptive icon — 1024x1024
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('✅ adaptive-icon.png');

  // 3. Splash screen icon — 400x400
  await sharp(svgBuffer)
    .resize(400, 400)
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✅ splash-icon.png');

  // 4. Favicon for web — 48x48
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✅ favicon.png');

  const files = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];

  console.log('\nFile sizes:');
  files.forEach(f => {
    const filePath = path.join(assetsDir, f);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      console.log(`  ${f}: ${(size / 1024).toFixed(1)}KB`);
    } else {
      console.log(`  ${f}: MISSING ❌`);
    }
  });
}

generate().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
