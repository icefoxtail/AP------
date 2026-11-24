const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const lib = () => import('../archive/tools/exam-image-ref-lib.mjs');

test('canonicalExamImageRef strips the archive/ prefix and leaves canonical refs alone', async () => {
  const { canonicalExamImageRef } = await lib();
  const key = 'assets/images/25_팔마중_2학기_기말_중1_유사/q02.svg';
  for (const form of [`archive/${key}`, `/archive/${key}`, `./archive/${key}`, `../archive/${key}`, `AP------/archive/${key}`]) {
    assert.equal(canonicalExamImageRef(form), key, form);
  }
  assert.equal(canonicalExamImageRef(`archive/${key}?v=2#x`), `${key}?v=2#x`);
  assert.equal(canonicalExamImageRef(key), key);
  assert.equal(canonicalExamImageRef('assets/generated-lite/x.svg'), 'assets/generated-lite/x.svg');
  assert.equal(canonicalExamImageRef('https://img.wangjiedu.com/exams/images/a/q1.png'), 'https://img.wangjiedu.com/exams/images/a/q1.png');
  assert.equal(canonicalExamImageRef(undefined), undefined);
});

test('scanExamSource flags image, images[], solutionImage and inline <img src>, and nothing else', async () => {
  const { scanExamSource } = await lib();
  const source = [
    'window.questionBank = [',
    '  {',
    '    "id": 3,',
    '    "image": "archive/assets/images/x/q03.png",',
    '    "solutionImage": "archive/assets/images/x/q03-solution.svg",',
    '    "images": ["archive/assets/images/x/a.png"],',
    '    "content": "그림<br><img src=\\"archive/assets/images/x/q03-problem.svg\\" alt=\\"a\\">",',
    '    "sourceAssetPaths": [',
    '      "archive/assets/images/x/q03.png"',
    '    ],',
    '    "evidence": "https://example.com/archive/assets/images/x/q03.png",',
    '    "okImage": "assets/images/x/ok.png"',
    '  },',
    '  {',
    '    "id": 4,',
    '    "images": [',
    '      "archive/assets/images/x/b.png"',
    '    ]',
    '  }',
    '];'
  ].join('\n');
  const hits = scanExamSource(source);
  assert.deepEqual(hits.map(h => [h.id, h.field, h.fixed]), [
    [3, 'image', 'assets/images/x/q03.png'],
    [3, 'solutionImage', 'assets/images/x/q03-solution.svg'],
    [3, 'images', 'assets/images/x/a.png'],
    [3, '본문 <img src>', 'assets/images/x/q03-problem.svg'],
    [4, 'images[]', 'assets/images/x/b.png']
  ]);
  // onlyLines limits the scan to the given (added) lines.
  assert.deepEqual(scanExamSource(source, { onlyLines: new Set([5]) }).map(h => h.field), ['solutionImage']);
  assert.deepEqual(scanExamSource('{"image": "assets/images/x/q1.png"}'), []);
});

test('findPrefixedImageRefsInQuestion checks parsed questions for the release gate', async () => {
  const { findPrefixedImageRefsInQuestion } = await lib();
  const question = {
    id: 2,
    image: 'archive/assets/images/x/q02.svg',
    solutionImage: 'assets/images/x/q02-solution.svg',
    images: ['archive/assets/images/x/a.png', 'assets/images/x/b.png'],
    content: '발문<img src="archive/assets/images/x/in.png" alt="a">',
    choices: ['<img src=\'assets/images/x/c.png\'>', '②'],
    sourceAssetPaths: ['archive/assets/images/x/q02.png']
  };
  assert.deepEqual(findPrefixedImageRefsInQuestion(question).map(h => [h.field, h.fixed]), [
    ['image', 'assets/images/x/q02.svg'],
    ['images', 'assets/images/x/a.png'],
    ['content <img src>', 'assets/images/x/in.png']
  ]);
  assert.deepEqual(findPrefixedImageRefsInQuestion({ image: 'assets/images/x/q.png' }), []);
});

test('addedLinesByFile reads new-file line numbers from a -U0 diff', async () => {
  const { addedLinesByFile } = await import('../tools/check-staged-exam-image-paths.mjs');
  const diff = [
    'diff --git a/archive/exams/a.js b/archive/exams/a.js',
    '--- a/archive/exams/a.js',
    '+++ b/archive/exams/a.js',
    '@@ -3,0 +4,2 @@',
    '+x',
    '+y',
    '@@ -10 +12 @@',
    '-old',
    '+new',
    'diff --git a/archive/exams/gone.js b/archive/exams/gone.js',
    '--- a/archive/exams/gone.js',
    '+++ /dev/null',
    '@@ -1 +0,0 @@',
    '-bye'
  ].join('\n');
  const map = addedLinesByFile(diff);
  assert.deepEqual([...map.get('archive/exams/a.js')], [4, 5, 12]);
  assert.equal(map.has('archive/exams/gone.js'), false);
});

function run(cwd, command, args) {
  return spawnSync(command, args, { cwd, encoding: 'utf8' });
}

test('installed pre-commit hook blocks a newly added archive/assets image path and passes canonical ones', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'image-path-guard-'));
  try {
    const repo = path.join(dir, 'repo');
    fs.mkdirSync(path.join(repo, 'tools'), { recursive: true });
    fs.mkdirSync(path.join(repo, 'archive', 'tools'), { recursive: true });
    fs.mkdirSync(path.join(repo, 'archive', 'exams', 'similar'), { recursive: true });
    for (const rel of ['tools/check-staged-exam-image-paths.mjs', 'archive/tools/exam-image-ref-lib.mjs']) {
      fs.copyFileSync(path.join(root, rel), path.join(repo, rel));
    }
    assert.equal(run(repo, 'git', ['init', '-q']).status, 0);
    for (const [key, value] of [['user.email', 't@t'], ['user.name', 't'], ['core.autocrlf', 'false']]) run(repo, 'git', ['config', key, value]);
    const hook = path.join(repo, '.git', 'hooks', 'pre-commit');
    fs.writeFileSync(hook, '#!/bin/sh\necho "[old-hook] ran"\n');
    // Installer: first run installs, second run changes nothing, --check agrees.
    const install = args => run(root, process.execPath, [path.join(root, 'tools', 'install-image-path-guard-hook.mjs'), '--hook', hook, ...args]);
    assert.equal(install(['--check']).status, 1);
    assert.equal(install([]).status, 0);
    const once = fs.readFileSync(hook, 'utf8');
    assert.equal(install([]).status, 0);
    assert.equal(fs.readFileSync(hook, 'utf8'), once);
    assert.equal(install(['--check']).status, 0);
    assert.equal((once.match(/>>> image-path-guard/g) || []).length, 1);
    assert.ok(once.includes('[old-hook] ran'), 'the existing hook body is kept');

    const exam = path.join(repo, 'archive', 'exams', 'similar', '시험_유사.js');
    const body = image => ['window.questionBank = [', '  {', '    "id": 7,', `    "image": "${image}",`, '    "answer": "①"', '  }', '];', ''].join('\n');

    // Legacy line already committed with the wrong form (the hook was not installed yet at that time).
    fs.writeFileSync(exam, body('archive/assets/images/old/q07.png'));
    run(repo, 'git', ['add', '.']);
    assert.equal(run(repo, 'git', ['commit', '-q', '-n', '-m', 'legacy']).status, 0);

    // Touching another line of the file does not trip over the old line.
    fs.writeFileSync(exam, body('archive/assets/images/old/q07.png').replace('"①"', '"②"'));
    run(repo, 'git', ['add', '.']);
    const untouched = run(repo, 'git', ['commit', '-q', '-m', 'other line']);
    assert.equal(untouched.status, 0, untouched.stderr);

    // A newly written wrong path is blocked, with file, question and the fixed form named.
    fs.writeFileSync(exam, body('archive/assets/images/new/q07.svg'));
    run(repo, 'git', ['add', '.']);
    const blocked = run(repo, 'git', ['commit', '-q', '-m', 'bad']);
    assert.notEqual(blocked.status, 0);
    assert.match(blocked.stderr, /그림 경로 오류 1곳/);
    assert.match(blocked.stderr, /시험_유사\.js/);
    assert.match(blocked.stderr, /문항 7 \(image\)/);
    assert.match(blocked.stderr, /archive\/assets\/images\/new\/q07\.svg → assets\/images\/new\/q07\.svg/);

    // The canonical form passes.
    fs.writeFileSync(exam, body('assets/images/new/q07.svg'));
    run(repo, 'git', ['add', '.']);
    const passed = run(repo, 'git', ['commit', '-q', '-m', 'good']);
    assert.equal(passed.status, 0, passed.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
