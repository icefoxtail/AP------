const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const collectorPath = path.join(__dirname, '..', 'archive', 'tools', 'collect-svg-accessibility-source-index.cjs');

function loadCollector() {
  assert.ok(fs.existsSync(collectorPath), 'durable production SVG source collector must exist');
  return require(collectorPath);
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-a11y-source-index-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dirs = ['archive/exams/original', 'archive/generated/lite', 'archive/textbook'];
  for (const dir of dirs) fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.writeFileSync(path.join(root, 'archive/exams/original/a.js'), `
window.examTitle = '시험 A';
window.questionBank = [
  { id: 1, image: './assets/images/a/q1.svg' },
  { id: 2, imageRef: 'archive/assets/images/a/q2.svg' },
  { id: 3, problemImage: ['assets/images/a/q3.svg', 'assets/images/a/q4.svg'] },
  { id: 4, solutionImage: 'assets/generated-lite/a/q4-solution.svg' },
  { questionUid: 'qid-5', solutionImageRef: 'assets/images/a/q5-solution.svg' }
];\n`);
  fs.writeFileSync(path.join(root, 'archive/generated/lite/b.js'), `
questionBank = [{ id: 9, image: 'assets/generated-lite/b/q9.svg', solutionImage: 'assets/generated-lite/b/q9-solution.svg' }];\n`);
  fs.writeFileSync(path.join(root, 'archive/textbook/book.js'), `
window.questions = [{ id: 12, problemImageRef: 'assets/images/book/q12.svg' }];\n`);
  fs.mkdirSync(path.join(root, 'archive/analysis/ignored'), { recursive: true });
  fs.writeFileSync(path.join(root, 'archive/analysis/ignored/not-production.js'), `window.questionBank=[{id:99,image:'assets/images/ignored.svg'}];`);
  return root;
}

test('durable collector scans current production source roots and normalizes canonical problem and solution fields', t => {
  const { collectSvgAccessibilitySourceIndex } = loadCollector();
  const root = fixture(t);
  const result = collectSvgAccessibilitySourceIndex({ repoRoot: root });
  assert.equal(result.jsParseErrors, 0);
  assert.deepEqual(result.uses.map(row => row.assetRef).sort(), [
    'assets/generated-lite/a/q4-solution.svg',
    'assets/generated-lite/b/q9-solution.svg',
    'assets/generated-lite/b/q9.svg',
    'assets/images/a/q1.svg',
    'assets/images/a/q2.svg',
    'assets/images/a/q3.svg',
    'assets/images/a/q4.svg',
    'assets/images/a/q5-solution.svg',
    'assets/images/book/q12.svg'
  ].sort());
  const q1 = result.uses.find(row => row.assetRef === 'assets/images/a/q1.svg');
  assert.equal(q1.uses[0].visualRole, 'problem');
  assert.equal(q1.uses[0].sourceExamRef, 'archive/exams/original/a.js');
  const solution = result.uses.find(row => row.assetRef === 'assets/generated-lite/a/q4-solution.svg');
  assert.equal(solution.uses[0].visualRole, 'solution');
  assert.equal(solution.uses[0].sourceQid, '4');
  assert.equal(result.uses.some(row => row.assetRef.includes('ignored')), false);
});

test('durable collector fails closed on unparseable current production source files', t => {
  const { collectSvgAccessibilitySourceIndex } = loadCollector();
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'archive/exams/original/bad.js'), 'window.questionBank = [{ image: ;');
  assert.throws(() => collectSvgAccessibilitySourceIndex({ repoRoot: root }), /SVG_ACCESSIBILITY_SOURCE_SCAN_PARSE_ERRORS/);
});

test('durable collector prefers the stable source question id over a human display label', t => {
  const { scanJavaScriptSource } = loadCollector();
  const uses = scanJavaScriptSource(`window.questionBank=[{id:22,sourceQuestionNo:'서답형 2',solutionImage:'assets/images/a/q22-solution.svg'}];`, 'archive/exams/original/a.js');
  assert.equal(uses.length, 1);
  assert.equal(uses[0].sourceQid, '22');
});

test('production delta scope finds changed SVGs and newly referenced refs without expanding to every old source use', t => {
  const { collectSvgAccessibilitySourceIndex, collectChangedSourceScope } = loadCollector();
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-a11y-source-delta-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  execFileSync('git', ['-C', root, 'init', '-q']);
  execFileSync('git', ['-C', root, 'config', 'user.email', 'svg-a11y@example.test']);
  execFileSync('git', ['-C', root, 'config', 'user.name', 'SVG Accessibility Test']);
  fs.mkdirSync(path.join(root, 'archive/exams/original'), { recursive: true });
  fs.mkdirSync(path.join(root, 'archive/assets/images'), { recursive: true });
  fs.writeFileSync(path.join(root, 'archive/assets/images/old.svg'), '<svg/>');
  fs.writeFileSync(path.join(root, 'archive/exams/original/a.js'), `window.questionBank=[{id:1,image:'assets/images/old.svg'}];\n`);
  execFileSync('git', ['-C', root, 'add', '.']);
  execFileSync('git', ['-C', root, 'commit', '-qm', 'baseline']);
  const baseRef = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

  fs.writeFileSync(path.join(root, 'archive/assets/images/old.svg'), '<svg><desc>updated</desc></svg>');
  fs.writeFileSync(path.join(root, 'archive/assets/images/new.svg'), '<svg><desc>new</desc></svg>');
  fs.writeFileSync(path.join(root, 'archive/exams/original/a.js'), `window.questionBank=[{id:1,image:'assets/images/old.svg'},{id:2,image:'assets/images/new.svg'}];\n`);
  const currentIndex = collectSvgAccessibilitySourceIndex({ repoRoot: root });
  const scope = collectChangedSourceScope({ repoRoot: root, baseRef, currentIndex });
  assert.deepEqual(scope.changedSvgRefs, ['assets/images/new.svg', 'assets/images/old.svg']);
  assert.deepEqual(scope.newUses.map(use => [use.assetRef, use.sourceQid, use.visualRole]), [['assets/images/new.svg', '2', 'problem']]);
  assert.equal(scope.baseRef, baseRef);
});
