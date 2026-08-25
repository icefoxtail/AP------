import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const repo = process.env.AP_REPO || process.cwd();
const root = path.join(repo, 'archive/exams/original');
const rows = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (p.endsWith('.js')) {
      try {
        const ctx = { window: {} };
        vm.runInNewContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p, timeout: 5000 });
        const questions = Array.isArray(ctx.window.questionBank) ? ctx.window.questionBank : [];
        const ids = questions.filter(q => !String(q.answer ?? '').trim()).map(q => q.id);
        if (ids.length) rows.push({ file: path.relative(repo, p).replaceAll('\\', '/'), questionCount: questions.length, emptyAnswerCount: ids.length, emptyQuestionIds: ids });
      } catch (error) {
        rows.push({ file: path.relative(repo, p).replaceAll('\\', '/'), error: String(error?.message || error) });
      }
    }
  }
}
walk(root);
rows.sort((a, b) => a.file.localeCompare(b.file));
const report = {
  schemaVersion: 'archive-empty-answer-inventory-v1',
  generatedAt: new Date().toISOString(),
  scope: 'git-tracked archive/exams/original production JS',
  policy: '답안표 또는 원문 근거가 없는 문항은 정답을 추정하지 않고 예외로 기록한다.',
  totals: {
    filesWithEmptyAnswers: rows.filter(r => !r.error).length,
    emptyAnswerQuestions: rows.filter(r => !r.error).reduce((n, r) => n + r.emptyAnswerCount, 0),
    loadErrors: rows.filter(r => r.error).length
  },
  rows,
  gates: { noLoadErrors: rows.every(r => !r.error), noEmptyAnswers: rows.every(r => r.error || r.emptyAnswerCount === 0), reportOnlyNoWrites: true, commitOrPush: false }
};
const output = path.join(repo, 'archive/_generated/intelligence/phase3/archive-empty-answer-inventory-v1.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
const body = JSON.stringify(report, null, 2) + '\n';
fs.writeFileSync(output, body, 'utf8');
report.digest = crypto.createHash('sha256').update(body).digest('hex');
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ output: path.relative(repo, output).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
