import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const OUTPUT = path.join(REPORT, '10_current_source_solution_static_audit_v2.json');

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]; const next = text[i + 1];
    if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; }
    if (ch === '"') { quoted = !quoted; continue; }
    if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; }
    if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; }
    cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}

function loadQuestion(sourcePath, id) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, sourcePath), 'utf8'), context, { filename: sourcePath, timeout: 10000 });
  const question = context.window.questionBank?.find(item => Number(item.id) === Number(id));
  if (!question) throw new Error(`question missing: ${sourcePath} q${id}`);
  return question;
}

function directionFlags(solution) {
  const flags = [];
  const text = String(solution || '');
  for (const match of text.matchAll(/이차항의\s*계수가\s*(양수|음수)[^\n.]{0,30}?(위로|아래로)\s*(?:볼록|열린)/g)) {
    const positive = match[1] === '양수'; const upward = match[2] === '위로';
    if (positive !== upward) flags.push({ token: match[0], code: 'PARABOLA_DIRECTION_WORDING_CONTRADICTION' });
  }
  return flags;
}

function main() {
  const rows = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const seen = new Set(); const issues = []; const questionRows = [];
  for (const row of rows) {
    const key = `${row.sourceJsPath}|${row.id}`;
    if (seen.has(key)) issues.push({ key, code: 'DUPLICATE_SOURCE_QID' });
    seen.add(key);
    const q = loadQuestion(row.sourceJsPath, row.id);
    const missing = ['content', 'answer', 'solution'].filter(field => q[field] === undefined || q[field] === null || String(q[field]).trim() === '');
    const placeholderTokens = [...String(q.solution || '').matchAll(/\[(?:TODO|보류|검토|미완성|판독불가|해설필요|그래프필요)[^\]]*\]/gi)].map(match => match[0]);
    const direction = directionFlags(q.solution);
    const genericPlaceholder = /^\s*주어진 식 또는 그래프에서[\s\S]*주어진 정답과 일치하는 결과는/.test(String(q.solution || ''));
    const staleAnswerConflict = /원문\s*(?:표시\s*)?정답[^.\n]{0,80}(?:충돌|다르|불일치)/.test(String(q.solution || ''));
    const questionIssue = [...missing.map(code => `MISSING_${code.toUpperCase()}`), ...placeholderTokens.map(() => 'PLACEHOLDER_TOKEN'), ...(genericPlaceholder ? ['GENERIC_SOLUTION_PLACEHOLDER'] : []), ...(staleAnswerConflict ? ['STALE_SOURCE_ANSWER_CONFLICT'] : []), ...direction.map(item => item.code)];
    if (questionIssue.length) issues.push({ key, codes: questionIssue, placeholderTokens, direction });
    questionRows.push({ questionUid: row.questionUid, sourceJsPath: row.sourceJsPath, id: q.id, contentPresent: !missing.includes('content'), answerPresent: !missing.includes('answer'), solutionPresent: !missing.includes('solution'), inlineSolutionSvgCount: (String(q.solution || '').match(/<svg\b/gi) || []).length, solutionImage: q.solutionImage || null, placeholderTokens, genericPlaceholder, staleAnswerConflict, directionFlags: direction, status: questionIssue.length ? 'REVIEW_REQUIRED' : 'STATIC_SOURCE_OK_NO_MATH_PASS' });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_SOURCE_SOLUTION_STATIC_AUDIT_V2', status: issues.length ? 'REVIEW_REQUIRED' : 'STATIC_SOURCE_OK_NO_MATH_PASS', scope: { inventory: INVENTORY.replaceAll(path.sep, '/'), targetRows: rows.length, uniqueSourceQids: seen.size }, counts: { missingOrBlankFieldRows: questionRows.filter(row => !row.contentPresent || !row.answerPresent || !row.solutionPresent).length, placeholderRows: questionRows.filter(row => row.placeholderTokens.length).length, genericSolutionPlaceholderRows: questionRows.filter(row => row.genericPlaceholder).length, staleAnswerConflictRows: questionRows.filter(row => row.staleAnswerConflict).length, directionContradictionRows: questionRows.filter(row => row.directionFlags.length).length, inlineSolutionSvgRows: questionRows.filter(row => row.inlineSolutionSvgCount > 0).length, externalSolutionImageRows: questionRows.filter(row => row.solutionImage).length, issueRows: issues.length }, issues, rows: questionRows, note: 'This is a current-source static scan. It does not establish independent math, pedagogy, visual semantics, render, or final PASS.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, targetRows: rows.length, counts: output.counts }, null, 2));
}

main();
