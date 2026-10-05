import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SOURCE_ROOT = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h1');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const rel = (filePath) => path.relative(ROOT, filePath).split(path.sep).join('/');

function listFiles(directory) {
  const rows = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) rows.push(...listFiles(filePath));
    else if (entry.isFile() && entry.name.endsWith('.js')) rows.push(filePath);
  }
  return rows;
}

const rows = [];
for (const filePath of listFiles(SOURCE_ROOT).sort()) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 10000 });
  const bank = Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
  const examTitle = String(context.window.examTitle || context.window.examName || bank[0]?.examTitle || rel(filePath));
  for (const question of bank) {
    const id = question.id ?? question.displayNo;
    for (const field of ['content', 'solution']) {
      const value = typeof question[field] === 'string' ? question[field] : '';
      let index = 0;
      for (const match of value.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
        index += 1;
        const svg = match[0];
        rows.push({
          questionUid: `${rel(filePath)}|${examTitle}|${id}`,
          sourceJsPath: rel(filePath),
          id,
          field,
          inlineIndex: index,
          assetPath: `inline://${rel(filePath)}#${id}/${field}/${index}`,
          byteCount: Buffer.byteLength(svg, 'utf8'),
          assetSha256: sha(svg),
          svg,
        });
      }
    }
  }
}
fs.writeFileSync(path.join(REPORT, 'inline_svg_payload.json'), `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ inlineSvgCount: rows.length, questionCount: new Set(rows.map((row) => row.questionUid)).size }, null, 2));
