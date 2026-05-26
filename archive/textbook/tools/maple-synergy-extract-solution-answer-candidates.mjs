import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const offsetsByUnit = new Map([
  ['도형의 방정식', 0],
  ['집합과 명제', 667],
  ['함수와 그래프', 1212],
]);

function walk(dir, predicate = () => true, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function loadQuestions(file) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context.window.questionBank || [];
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function circled(text) {
  return [...String(text)].find((ch) => {
    const code = ch.codePointAt(0);
    return code >= 0x2460 && code <= 0x2468;
  }) || '';
}

function answerToken(text) {
  const raw = String(text || '').trim();
  const c = circled(raw);
  if (c) return c;
  const ascii = raw
    .replaceAll('정답', '')
    .replace(/[^\x20-\x7E√π]/g, '')
    .trim();
  if (/^[-+]?\d{1,4}$/.test(ascii)) return ascii;
  if (/^[-+]?\d{1,3}\/[1-9]\d{0,2}$/.test(ascii)) return ascii;
  return '';
}

const textbook = path.join(ROOT, 'archive', 'textbook');
const files = walk(path.join(textbook, '22개정_마플시너지_공통수학2', 'generated', 'js', 'workbook'), (file) => file.endsWith('.js'));
const missing = new Map();
for (const file of files) {
  for (const q of loadQuestions(file)) {
    if (String(q.answer || '').trim()) continue;
    const offset = offsetsByUnit.get(q.standardUnit);
    if (offset === undefined) continue;
    const local = Number(String(q.displayNo || q.id).replace(/\D/g, ''));
    if (!local) continue;
    const global = local + offset;
    missing.set(String(global).padStart(4, '0'), {
      jsFile: rel(file),
      id: q.id,
      displayNo: q.displayNo,
      unit: q.standardUnit,
      global,
      sourcePageNo: q.sourcePageNo,
      sourceCropPath: q.sourceCropPath || '',
      content: String(q.content || '').slice(0, 100),
    });
  }
}

const dirs = [
  path.join(textbook, 'reports', 'solution_ocr_target_pages'),
  path.join(textbook, 'reports', 'solution_ocr_expanded_pages'),
];

const candidates = [];
for (const dir of dirs) {
  for (const file of walk(dir, (item) => /^p\d+\.json$/.test(path.basename(item))).sort()) {
    const page = JSON.parse(fs.readFileSync(file, 'utf8'));
    const rows = [...page.rows].sort((a, b) => a.y - b.y || a.x - b.x);
    const nums = [];
    for (const row of rows) {
      for (const match of String(row.text || '').matchAll(/\b(\d{4})\b/g)) {
        nums.push({ no: match[1], x: row.x, y: row.y, text: row.text });
      }
    }
    for (const noRow of nums) {
      const q = missing.get(noRow.no);
      if (!q) continue;
      const near = rows
        .filter((row) => Math.abs(row.y - noRow.y) < 26 && row.x > noRow.x + 220)
        .sort((a, b) => a.x - b.x)
        .map((row) => ({ token: answerToken(row.text), x: Math.round(row.x), y: Math.round(row.y), text: row.text }))
        .filter((row) => row.token);
      if (!near.length) continue;
      candidates.push({
        ...q,
        no: noRow.no,
        answer: near[0].token,
        solutionPdfPage: page.page,
        solutionOcrJson: rel(file),
        solutionOcrImage: rel(path.join(path.dirname(file), `p${String(page.page).padStart(3, '0')}.png`)),
        tokenRows: near.slice(0, 5),
      });
    }
  }
}

const dedup = [];
const seen = new Set();
for (const candidate of candidates) {
  const key = `${candidate.jsFile}|${candidate.id}|${candidate.answer}`;
  if (seen.has(key)) continue;
  seen.add(key);
  dedup.push(candidate);
}

const byUnit = {};
for (const item of dedup) byUnit[item.unit] = (byUnit[item.unit] || 0) + 1;

const out = {
  generatedAt: new Date().toISOString(),
  missingIndexed: missing.size,
  candidateCount: dedup.length,
  byUnit,
  candidates: dedup,
};

fs.writeFileSync(path.join(textbook, 'reports', 'maple_synergy_solution_ocr_answer_candidates.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(JSON.stringify({ candidateCount: out.candidateCount, byUnit, sample: dedup.slice(0, 40) }, null, 2));
