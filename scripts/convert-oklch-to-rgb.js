import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parse, converter } from 'culori';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const walk = (dir) => {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (/\.(js|jsx|ts|tsx|css|scss)$/.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
};

const convertOklchToRgb = (oklchStr) => {
  const color = parse(oklchStr);
  if (!color) return oklchStr;
  const rgb = converter('rgb')(color);
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);
  return `rgb(${r}, ${g}, ${b})`;
};

const convertInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/oklch\([^)]+\)/g);
  if (!matches) return;

  let converted = content;
  matches.forEach((match) => {
    const rgb = convertOklchToRgb(match);
    converted = converted.split(match).join(rgb);
  });

  fs.writeFileSync(filePath, converted, 'utf8');
  console.log(`✅ Converted: ${filePath}`);
};

const files = walk(path.join(__dirname, '../src'));
files.forEach(convertInFile);
