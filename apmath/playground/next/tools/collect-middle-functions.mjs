#!/usr/bin/env node
/** Read-only Archive intake for the middle function laboratories.
 * Full source snapshots and scan evidence go to the requested external directory,
 * never back into archive/exams. Signals select a generous review queue, not a
 * mathematical or visual PASS. Every image-bearing item without a signal stays
 * in IMAGE_REVIEW until a reviewer explicitly adjudicates it.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const n = argv.indexOf(name); return n < 0 ? fallback : argv[n + 1]; };
const out = path.resolve(arg('--out', path.join(ROOT, '.tmp/middle-functions-intake')));
const ref = arg('--ref', 'HEAD');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
const plain = (s) => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const textOf = (v) => typeof v === 'string' ? v : Array.isArray(v) ? v.map(textOf).join(' ') : v && typeof v === 'object' ? Object.values(v).map(textOf).join(' ') : '';
const head = git('rev-parse', ref).trim();
const files = git('ls-tree', '-r', '-z', '--full-tree', head, 'archive/exams/original/middle').split('\0').filter(Boolean).map((line) => {
  const [info, file] = line.split('\t');
  const [mode, kind, blob] = info.split(' ');
  return { file, blob, kind, mode };
}).filter(x => x.kind === 'blob' && x.file.endsWith('.js')).sort((a, b) => {
  const year = p => +(path.basename(p).match(/^(\d{2,4})_/) || [0, 0])[1];
  return year(b.file) - year(a.file) || a.file.localeCompare(b.file, 'ko');
});
fs.mkdirSync(out, { recursive: true });
const records = [], exams = [], failures = [];
const rules = [
  ['DIRECT_PROPORTION', /정비례|비례상수|direct.?proportion/i],
  ['INVERSE_PROPORTION', /반비례|inverse.?proportion/i],
  ['LINEAR_FUNCTION', /일차\s*함수|일차함수|linear.?function|slope|y[_ -]?intercept/i],
  ['QUADRATIC_FUNCTION', /이차\s*함수|포물선|quadratic.?function|parabola/i],
  ['COORDINATES', /좌표|순서쌍|사분면|원점|[xy][$\s-]*(?:좌표|축|절편)|coordinate|quadrant|intercept/i],
  ['FUNCTION_GRAPH', /함수|그래프|graph|function/i],
  ['LINEAR_EQUATION_GRAPH', /연립[\s\S]{0,30}(?:직선|그래프)|직선[\s\S]{0,30}연립|기울기|절편/],
  ['XY_RULE', /y\s*=\s*[^\n$]{0,55}x|[xy]\s*[=＝]\s*\\(?:d?frac)|\\frac\s*\{[^}]+\}\s*\{x\}|[xy]\s*[=＝][^\n$]{0,20}\/[xy]/i],
  ['ORDERED_POINT', /[A-Z]\s*\(\s*-?(?:\d|[a-z])[^)]{0,20},\s*-?(?:\d|[a-z])/],
  ['CURRICULUM_META', /M1-04|M2-04|M3-04|PROPORTION|COORDINATE|LINEAR_FUNCTION|QUADRATIC_FUNCTION/]
];
function assets(q) {
  const result = [];
  function walk(v, field) {
    if (typeof v === 'string') {
      const refs = v.match(/(?:\.\.\/)?(?:archive\/)?assets\/images\/[^\s"'<>`]+?\.(?:png|jpe?g|svg|webp|gif)/gi) || [];
      if (/image|figure|visual|picture/i.test(field) && /\.(?:png|jpe?g|svg|webp|gif)(?:[?#].*)?$/i.test(v.trim()) && !refs.length) refs.push(v.trim());
      for (let asset of refs) {
        try { asset = decodeURIComponent(asset); } catch {}
        const rel = asset.startsWith('archive/') ? asset : asset.startsWith('assets/') ? `archive/${asset}` : asset.replace(/^\.\.\//, 'archive/');
        const full = path.resolve(ROOT, rel);
        result.push({ field, ref: asset, path: rel, exists: full.startsWith(ROOT + path.sep) && fs.existsSync(full), role: /solution|answer/i.test(field) ? 'solution' : 'problem' });
      }
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${field}[${i}]`));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, field ? `${field}.${k}` : k));
  }
  walk(q, '');
  return [...new Map(result.map(x => [`${x.field}|${x.ref}`, x])).values()];
}
for (const { file, blob } of files) {
  const grade = file.match(/\/middle\/(m[123])\//)?.[1] || 'unknown';
  const raw = git('show', `${head}:${file}`);
  const sourceSha256 = hash(raw);
  const window = {}, context = vm.createContext({ window, console: { log() {}, warn() {}, error() {} } });
  let bank, title, sourceSchema;
  try {
    vm.runInContext(raw, context, { timeout: 1500, filename: file });
    bank = window.questionBank || window.examData?.questions || vm.runInContext('typeof questionBank !== "undefined" ? questionBank : (typeof examData !== "undefined" ? examData.questions : null)', context, { timeout: 100 });
    sourceSchema = Array.isArray(window.questionBank) ? 'window.questionBank' : window.examData?.questions ? 'window.examData.questions' : 'lexical-bank';
    title = window.examTitle || window.examData?.title || path.basename(file, '.js');
    if (!Array.isArray(bank)) throw new Error('No supported questionBank / examData.questions array');
  } catch (error) {
    failures.push({ sourcePath: file, sourceBlobSha1: blob, sourceSha256, grade, error: String(error.message) });
    exams.push({ sourcePath: file, grade, sourceBlobSha1: blob, sourceSha256, questionCount: null, status: 'PARSE_FAILED' });
    continue;
  }
  exams.push({ sourcePath: file, grade, examTitle: title, sourceSchema, sourceBlobSha1: blob, sourceSha256, questionCount: bank.length, status: 'PARSED' });
  bank.forEach((q, index) => {
    const images = assets(q), allText = textOf(q);
    // Metadata is a recall aid only. A later reviewer must read the actual item.
    const signals = rules.filter(([, re]) => re.test(allText)).map(([label]) => label);
    const problemImages = images.filter(x => x.role === 'problem');
    const content = q.content ?? q.question ?? '';
    const text = plain(content);
    const imageOnly = problemImages.length > 0 && text.replace(/[$\\{}]/g, '').length < 45;
    const status = signals.length ? 'RELEVANT_SIGNAL' : problemImages.length || imageOnly ? 'IMAGE_REVIEW' : 'NO_SIGNAL';
    const canonical = plain([content, ...[].concat(q.choices || [])].join('|')).replace(/\s+/g, '');
    const shape = canonical.replace(/-?\d+(?:\.\d+)?/g, '#');
    records.push({
      sourceRef: `${file}#q${q.id ?? index + 1}@${index + 1}`,
      grade, year: +(path.basename(file).match(/^(\d{2,4})_/) || [0, 0])[1],
      sourcePath: file, examTitle: title, sourceSchema, questionId: q.id ?? null, ordinal: index + 1, content,
      sourceBlobSha1: blob, sourceSha256, questionSha256: hash(JSON.stringify(q)),
      signals, candidateStatus: status, imageOnly, images,
      duplicateGroup: hash(canonical).slice(0, 16), nearGroup: hash(shape).slice(0, 16),
      visualReview: images.length ? 'NOT_RUN' : 'NOT_APPLICABLE',
      question: q
    });
  });
}
const count = xs => ({
  questions: xs.length, signalCandidates: xs.filter(x => x.candidateStatus === 'RELEVANT_SIGNAL').length,
  imageReviewCandidates: xs.filter(x => x.candidateStatus === 'IMAGE_REVIEW').length,
  noSignal: xs.filter(x => x.candidateStatus === 'NO_SIGNAL').length,
  problemImageQuestions: xs.filter(x => x.images.some(i => i.role === 'problem')).length,
  imageOnlyQuestions: xs.filter(x => x.imageOnly).length,
  missingAssetQuestions: xs.filter(x => x.images.some(i => !i.exists)).length
});
const summary = {
  schemaVersion: 1, sourceCommit: head, sourceRoot: 'archive/exams/original/middle',
  fileDenominator: files.length, parsedExams: exams.filter(x => x.status === 'PARSED').length,
  parseFailures: failures, ...count(records), grades: {},
  limitations: ['Signals are recall-first search candidates, not relevance or quality verdicts.', 'All source fields were parsed; all image-bearing nonmatches remain queued.', 'Image existence checks do not establish visual readability or mathematical accuracy.']
};
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n');
for (const grade of ['m1', 'm2', 'm3']) {
  const rows = records.filter(x => x.grade === grade), gradeExams = exams.filter(x => x.grade === grade);
  summary.grades[grade] = { exams: gradeExams.length, parsedExams: gradeExams.filter(x => x.status === 'PARSED').length, ...count(rows) };
  save(`${grade}-all.json`, rows);
  save(`${grade}-candidates.json`, rows.filter(x => x.candidateStatus !== 'NO_SIGNAL'));
  save(`${grade}-exams.json`, gradeExams);
}
save('summary.json', summary); save('exams.json', exams); save('parse-failures.json', failures);
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 2;
