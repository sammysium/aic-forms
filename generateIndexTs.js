const fs = require('fs');
const path = require('path');


const distDir = path.join(__dirname, 'dist');
const outputFile = path.join(distDir, 'index.d.ts');

function collectDtsFiles(directory, collectedFiles) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      collectDtsFiles(filePath, collectedFiles);
    } else if (filePath.endsWith('.d.ts')) {
      collectedFiles.push(filePath);
    }
  }
}

function createIndexDts() {
  const collectedFiles = [];
  collectDtsFiles(distDir, collectedFiles);

  const indexContent = collectedFiles
    .map((filePath) => {
      const relativePath = path.relative(distDir, filePath);
      return `/// <reference path="./${relativePath}" />`;
    })
    .join('\n');

  if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, '', { encoding: 'utf-8' });
  }

  fs.appendFileSync(outputFile, indexContent, { encoding: 'utf-8' });
  console.log(`Updated ${outputFile}`);
}

createIndexDts();
