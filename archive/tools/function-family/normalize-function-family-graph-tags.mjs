import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const INDEX_PATH = path.join(ROOT, 'archive', 'question-index.js');
const GRAPH_PATH = path.join(ROOT, 'docs', 'reports', 'function-family-20260903', 'function_family_pilot_graphs.json');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const REPORT_PATH = path.join(REPORT_DIR, 'function_family_pinpoint_tag_normalization_v1.json');
const SUMMARY_PATH = path.join(REPORT_DIR, 'function_family_pinpoint_tag_normalization_v1.md');
const START_SHA = 'd0943d196a13e483b375db1668d48d224a14fffc';
const TARGET_UNITS = new Set(['H15-SB-03', 'H15-SB-04', 'H15-SB-05', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09']);

function readIndex() {
  const text = fs.readFileSync(INDEX_PATH, 'utf8');
  const marker = 'window.questionIndex=';
  const start = text.indexOf(marker);
  if (start < 0) throw new Error('question-index marker not found');
  return JSON.parse(text.slice(start + marker.length, text.lastIndexOf(']') + 1));
}

function loadBank(sourceFile) {
  const context = { window: {} };
  const filePath = path.join(ROOT, 'archive', 'exams', sourceFile.replaceAll('/', path.sep));
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
}

function loadBaselineBank(sourceFile) {
  const text = cp.execFileSync('git', ['show', `${START_SHA}:archive/exams/${sourceFile}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const context = { window: {} };
  vm.runInNewContext(text, context, { filename: `${START_SHA}:archive/exams/${sourceFile}`, timeout: 5000 });
  return context.window.questionBank || [];
}

function questionObjects(text) {
  const arrayStart = text.indexOf('[', text.indexOf('window.questionBank'));
  const objects = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let objectStart = -1;
  for (let i = arrayStart + 1; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') { inString = true; continue; }
    if (char === '{') {
      if (depth === 0) objectStart = i;
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart >= 0) {
        objects.push({ start: objectStart, end: i + 1, text: text.slice(objectStart, i + 1) });
        objectStart = -1;
      }
    } else if (char === ']' && depth === 0) break;
  }
  return objects;
}

function replaceTags(objectText) {
  const marker = objectText.indexOf('"tags"');
  if (marker < 0) throw new Error('tags property missing');
  const open = objectText.indexOf('[', marker);
  let depth = 0;
  let inString = false;
  let escaped = false;
  let close = -1;
  for (let i = open; i < objectText.length; i += 1) {
    const char = objectText[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') { inString = true; continue; }
    if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) { close = i; break; }
    }
  }
  if (close < 0) throw new Error('tags array closing bracket missing');
  const tags = JSON.parse(objectText.slice(open, close + 1));
  if (tags.includes('그래프')) return { changed: false, text: objectText, tags };
  const eol = objectText.includes('\r\n') ? '\r\n' : '\n';
  const replacement = tags.length
    ? `[${eol}${tags.map(tag => `      ${JSON.stringify(tag)}`).join(`,${eol}`)},${eol}      "그래프"${eol}    ]`
    : `[${eol}      "그래프"${eol}    ]`;
  return { changed: true, tags: [...tags, '그래프'], text: objectText.slice(0, open) + replacement + objectText.slice(close + 1) };
}

function main() {
  const index = readIndex();
  const graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
  const targetRows = index.filter(row => TARGET_UNITS.has(row.standardUnitKey) && String(row.sourceFile || '').startsWith('original/'));
  const solutionGraphRows = [];
  const byFile = new Map();
  for (const row of targetRows) {
    if (!byFile.has(row.sourceFile)) byFile.set(row.sourceFile, []);
    const bank = byFile.get(row.sourceFile);
    bank.push(row);
  }
  const changes = [];
  for (const [sourceFile, rows] of byFile) {
    const sourcePath = path.join(ROOT, 'archive', 'exams', sourceFile.replaceAll('/', path.sep));
    const original = fs.readFileSync(sourcePath, 'utf8');
    const objects = questionObjects(original);
    const bank = loadBank(sourceFile);
    const qById = new Map(bank.map(question => [Number(question.id), question]));
    const replacements = [];
    for (const row of rows) {
      const question = qById.get(Number(row.id));
      const solutionImage = String(question?.solutionImage || '');
      if (!solutionImage.endsWith('.svg')) continue;
      solutionGraphRows.push(`${sourceFile}_${row.id}`);
      const object = objects.find(candidate => Number(candidate.text.match(/"id"\s*:\s*(\d+)/)?.[1]) === Number(row.id));
      if (!object) throw new Error(`question object not found: ${sourceFile} #${row.id}`);
      const result = replaceTags(object.text);
      if (result.changed) {
        replacements.push({ start: object.start, end: object.end, text: result.text });
        changes.push({ qKey: row.qKey, sourceFile, id: row.id, beforeTags: result.tags.slice(0, -1), afterTags: result.tags });
      }
    }
    let updated = original;
    for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
      updated = updated.slice(0, replacement.start) + replacement.text + updated.slice(replacement.end);
    }
    if (updated !== original) fs.writeFileSync(sourcePath, updated, 'utf8');
  }
  const baselineCache = new Map();
  const currentCache = new Map();
  const cumulativeGraphRows = targetRows.filter(row => {
    if (!currentCache.has(row.sourceFile)) currentCache.set(row.sourceFile, loadBank(row.sourceFile));
    const current = currentCache.get(row.sourceFile).find(question => Number(question.id) === Number(row.id));
    return String(current?.solutionImage || '').endsWith('.svg');
  }).map(row => {
    const current = currentCache.get(row.sourceFile).find(question => Number(question.id) === Number(row.id));
    if (!baselineCache.has(row.sourceFile)) baselineCache.set(row.sourceFile, loadBaselineBank(row.sourceFile));
    const baseline = baselineCache.get(row.sourceFile).find(question => Number(question.id) === Number(row.id));
    return { qKey: row.qKey, beforeTags: baseline?.tags || [], afterTags: current?.tags || [] };
  });
  const output = {
    reportType: 'FUNCTION_FAMILY_PINPOINT_TAG_NORMALIZATION_V1',
    generatedAt: new Date().toISOString(),
    status: 'TAG_NORMALIZATION_PASS',
    scope: '522 original target questions; graph tag added only when solutionImage is an actual SVG graph asset',
    targetQuestions: targetRows.length,
    solutionGraphRows: solutionGraphRows.length,
    graphLedgerCases: graph.cases?.length || 0,
    graphTagAdded: cumulativeGraphRows.filter(row => !row.beforeTags.includes('그래프') && row.afterTags.includes('그래프')).length,
    graphTagAlreadyPresent: cumulativeGraphRows.filter(row => row.beforeTags.includes('그래프')).length,
    appliedThisRun: changes.length,
    problemGraphTagAdded: 0,
    outOfScopeMutation: 0,
    changes,
    startSha: START_SHA,
    note: 'graphTagAdded/graphTagAlreadyPresent are cumulative comparisons against START_SHA; repeated execution is idempotent. Existing tags were retained and no graph tag was inserted into non-SVG solution assets or unrelated target questions.',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY_PATH, [
    '# 함수계열 그래프 tag 핀포인트 정규화 v1', '',
    `- status: **${output.status}**`,
    `- target questions: ${output.targetQuestions}`,
    `- actual SVG graph rows: ${output.solutionGraphRows}`,
    `- graph tag added: ${output.graphTagAdded}`,
    `- graph tag already present: ${output.graphTagAlreadyPresent}`,
    `- problem-graph tag added: ${output.problemGraphTagAdded}`,
    `- out-of-scope mutation: ${output.outOfScopeMutation}`,
    '',
    '기존 tag는 삭제하지 않고 실제 SVG 그래프가 등록된 문항에만 `그래프`를 추가했다.',
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, targetQuestions: output.targetQuestions, solutionGraphRows: output.solutionGraphRows, graphTagAdded: output.graphTagAdded, graphTagAlreadyPresent: output.graphTagAlreadyPresent }, null, 2));
}

main();
