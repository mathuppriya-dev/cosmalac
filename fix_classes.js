const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = content;
      // Replace class="style" -> className="style"
      modified = modified.replace(/\bclass="([^"]*)"/g, 'className="$1"');
      // Replace class='style' -> className='style'
      modified = modified.replace(/\bclass='([^']*)'/g, "className='$1'");
      // Replace class={expression} -> className={expression}
      modified = modified.replace(/\bclass=\{([^}]+)\}/g, 'className={$1}');
      
      if (modified !== content) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`✅ Refactored: ${path.relative(srcDir, fullPath)}`);
      }
    }
  }
}

console.log('🔄 Refactoring standard HTML class attributes to React className...');
walk(srcDir);
console.log('🎉 Refactoring complete! Try compiling again.');
