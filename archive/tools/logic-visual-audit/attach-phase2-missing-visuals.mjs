import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { readJson, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const corpus = readJson(path.join(root, 'specs/phase2-missing-visual-corpus-v1.json'));
const byFile = new Map();
for (const item of corpus.cases) {
  const file = path.join(repoRoot, 'archive/exams/original/high/h1/2mid', `${item.examId}.js`);
  const list = byFile.get(file) ?? [];
  list.push(item);
  byFile.set(file, list);
}
const connected = [];
for (const [file, cases] of byFile) {
  let text = fs.readFileSync(file, 'utf8');
  for (const item of cases) {
    const idPos = text.indexOf(`"id": ${item.qid},`);
    const start = idPos < 0 ? -1 : text.lastIndexOf('\n  {', idPos);
    if (start < 0) throw new Error(`question object not found: ${item.questionUid}`);
    const next = text.indexOf('\n  },', start + 1);
    const end = next < 0 ? text.indexOf('\n  }\n]', start + 1) : next;
    if (end < 0) throw new Error(`question object end not found: ${item.questionUid}`);
    const object = text.slice(start, end + (next < 0 ? 5 : 4));
    const expectedImage = `assets/images/${item.examId}/q${String(item.qid).padStart(2, '0')}-solution.svg`;
    const existingImage = object.match(/"solutionImage":\s*"([^"]+)"/)?.[1] ?? null;
    if (existingImage && existingImage !== expectedImage) throw new Error(`existing solutionImage mismatch: ${item.questionUid}: ${existingImage} != ${expectedImage}`);
    const solutionMatch = object.match(/(\s*"solution":\s*)("(?:\\.|[^"\\])*")(,)/);
    if (!solutionMatch) throw new Error(`solution field missing: ${item.questionUid}`);
    const solution = JSON.parse(solutionMatch[2]);
    const note = `\n[시각자료 읽기] ${item.note.replaceAll('\n', ' ')}`;
    const updatedSolution = JSON.stringify(`${solution}${solution.includes('[시각자료 읽기]') ? '' : note}`, null, 0);
    let updated = object.replace(solutionMatch[0], `${solutionMatch[1]}${updatedSolution}${solutionMatch[3]}`);
    const image = expectedImage;
    updated = updated.replace(/^\s*"solutionImage(?:Alt|Caption|Size)?":.*(?:\r?\n|$)/gm, '');
    const insertAt = updated.indexOf('\n    "subUnitKey"');
    const fields = `\n    "solutionImage": ${JSON.stringify(image)},\n    "solutionImageAlt": ${JSON.stringify(item.title)},\n    "solutionImageCaption": ${JSON.stringify(item.note.replaceAll('\n', ' '))},\n    "solutionImageSize": "full",`;
    if (insertAt < 0) throw new Error(`subUnitKey insertion point missing: ${item.questionUid}`);
    updated = updated.slice(0, insertAt) + fields + updated.slice(insertAt);
    text = text.slice(0, start) + updated + text.slice(end + (next < 0 ? 5 : 4));
    connected.push({ questionUid: item.questionUid, sourceFile: path.relative(repoRoot, file).replaceAll('\\', '/'), image });
  }
  fs.writeFileSync(file, text, 'utf8');
}
const report = { attachVersion: 'logic-visual-phase2-missing-attach-v1', corpusCount: corpus.cases.length, connectedCount: connected.length, connected, status: connected.length === corpus.cases.length ? 'PASS' : 'FAIL' };
writeJson(path.join(root, 'reports/phase2-missing-visual-attach.json'), report);
console.log(JSON.stringify({ corpusCount: report.corpusCount, connectedCount: report.connectedCount, status: report.status }, null, 2));
if (report.status !== 'PASS') process.exitCode = 1;
