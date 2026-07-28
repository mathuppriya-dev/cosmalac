const fs = require('fs');
const path = require('path');

// Source directory where the AI-generated images are stored
const sourceDir = 'C:\\Users\\VICTUS\\.gemini\\antigravity-ide\\brain\\1e1b6608-3e35-430c-b0be-f03debc42443';

const filesToCopy = {
  'luxury_skincare_hero_1785252970338.png': 'luxury_skincare_hero.png',
  'glow_cream_jar_1785252986507.png': 'glow_cream_jar.png',
  'hydrating_serum_dropper_1785253001148.png': 'hydrating_serum_dropper.png',
  'scientific_skincare_lab_1785253018446.png': 'scientific_skincare_lab.png'
};

const targetDir = path.join(__dirname, 'frontend', 'public', 'images');

function copyAssets() {
  console.log('🔄 Sourcing AI-generated cosmetic images...');

  // Ensure target folder exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`✅ Created public images folder: ${targetDir}`);
  }

  let successCount = 0;

  for (const [srcName, destName] of Object.entries(filesToCopy)) {
    const srcPath = path.join(sourceDir, srcName);
    const destPath = path.join(targetDir, destName);

    if (fs.existsSync(srcPath)) {
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ➡️  Copied: ${srcName} -> ${destName}`);
        successCount++;
      } catch (err) {
        console.error(`  ❌ Failed to copy ${srcName}:`, err.message);
      }
    } else {
      console.warn(`  ⚠️  Source asset not found: ${srcPath}`);
    }
  }

  if (successCount === 4) {
    console.log('🎉 All premium mockups copied successfully into frontend static assets!');
  } else {
    console.log(`⚠️  Copied ${successCount}/4 images. Ensure paths are correct.`);
  }
}

copyAssets();
