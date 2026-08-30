const fs = require('fs');
const path = require('path');

const replacements = [
  [/bg-white\/5/g, 'bg-surface-container'],
  [/bg-white\/10/g, 'bg-surface-container-high'],
  [/bg-white\/20/g, 'bg-surface-container-highest'],
  [/border-white\/5/g, 'border-outline-variant'],
  [/border-white\/10/g, 'border-outline'],
  [/border-white\/20/g, 'border-outline'],
  [/border-white\/40/g, 'border-outline'],
  [/text-white\/30/g, 'text-on-surface-variant'],
  [/text-white\/40/g, 'text-on-surface-variant'],
  [/text-white\/50/g, 'text-on-surface-variant'],
  [/text-white\/60/g, 'text-on-surface-variant'],
  [/\btext-white\b(?!(\/))/g, 'text-on-surface'], // text-white but not followed by /
  [/bg-\[\#0A0A0A\]\/90/g, 'bg-background/90'],
  [/bg-black\/50/g, 'bg-surface'],
  [/placeholder-white\/30/g, 'placeholder-on-surface-variant'],
  [/text-on-surface hover:text-on-surface/g, 'text-on-surface-variant hover:text-on-surface'] // fix accidental replacement
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
      }
      // Specific fix for text-on-surface in primary buttons
      content = content.replace(/bg-primary text-on-surface/g, 'bg-primary text-on-primary');
      content = content.replace(/bg-error text-on-surface/g, 'bg-error text-on-error');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done!');
