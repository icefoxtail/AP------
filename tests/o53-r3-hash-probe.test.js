const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const sha256 = bytes => 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
const loadExam = rel => {
  const file = path.join(root, rel);
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: file });
  return { source, questions: sandbox.window.questionBank || sandbox.window.questions };
};

const targetRel = 'archive/exams/original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js';
const target = loadExam(targetRel);
const visuals = target.questions.filter(q => q.solutionImage).map(q => {
  const rel = 'archive/' + q.solutionImage.replace(/^assets\//, 'assets/');
  const bytes = fs.readFileSync(path.join(root, rel));
  return { qid: q.id, path: q.solutionImage, sha256: sha256(bytes) };
});

const goldenPaths = [
  'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
  'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js',
];
const golden = goldenPaths.map(rel => {
  const exam = loadExam(rel);
  return {
    path: rel,
    sha256: sha256(Buffer.from(exam.source)),
    questions: [1,10,20].map(qid => {
      const q = exam.questions.find(x => Number(x.id) === qid);
      const solution = String(q.solution || '');
      return {
        qid,
        solutionSha256: sha256(Buffer.from(solution)),
        solutionExcerpt: solution.slice(0, 100)
      };
    })
  };
});
const negRel = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const out = {
  target: {
    path: targetRel,
    sha256: sha256(Buffer.from(target.source)),
    questionCount: target.questions.length,
    visualCount: visuals.length,
  },
  visuals,
  golden,
  negative: { path: negRel, sha256: sha256(fs.readFileSync(path.join(root, negRel))) },
};
console.log('O53_HASH_PROBE_JSON=' + JSON.stringify(out));
