import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.resolve(process.env.GEOMETRY_ARCHIVE_ROOT || path.join(ROOT, 'archive'));
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const MANIFEST_PATH = path.join(REPORTS, 'geometry_equation_manifest.json');
const OUTPUT_PATH = path.join(REPORTS, 'geometry_equation_build_pack.json');

function readBank(relativePath) {
  const filePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 4000 });
  return context.window.questionBank || [];
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const byFile = new Map();
  for (const row of manifest.rows) {
    if (!byFile.has(row.sourceJsPath)) byFile.set(row.sourceJsPath, readBank(row.sourceJsPath));
  }
  const rows = manifest.rows.map((row) => {
    const question = byFile.get(row.sourceJsPath).find((item) => item.id === row.id);
    if (!question) throw new Error(`Question not found: ${row.qKey}`);
    return {
      ...row,
      content: question.content || '',
      choices: question.choices || [],
      answer: question.answer || '',
      solution: question.solution || '',
      image: question.image || '',
      tags: question.tags || [],
      questionType: question.questionType || '',
      level: question.level || '',
      solutionImage: question.solutionImage || '',
      solutionImageAlt: question.solutionImageAlt || '',
      solutionImageCaption: question.solutionImageCaption || '',
      solutionImageSize: question.solutionImageSize || '',
    };
  });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    manifestSha: manifest.manifestSha || null,
    rows,
  }, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ output: OUTPUT_PATH, rowCount: rows.length, missingSolution: rows.filter((row) => !row.solution.trim()).length }, null, 2));
}

main();
