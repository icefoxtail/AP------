const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const engineFiles = [
  'archive/engine.html',
  'archive/mixed_engine.html',
  'apmath/wrong_print_engine.html'
];

function loadNormalizer(engineFile) {
  const source = fs.readFileSync(path.join(root, engineFile), 'utf8');
  const start = source.indexOf('function normalizeConditionMarkerBreaks');
  const end = source.indexOf('function normalizeViewBlocks', start);
  assert.ok(start >= 0, `${engineFile}: condition normalizer missing`);
  assert.ok(end > start, `${engineFile}: condition normalizer boundary missing`);
  const context = { console };
  vm.runInNewContext(`${source.slice(start, end)}\nthis.__api = { normalizeConditionMarkerBreaks };`, context, { filename: engineFile });
  return context.__api.normalizeConditionMarkerBreaks;
}

function maskMarkup(input) {
  let value = String(input || '');
  const protectedRegions = [];
  const save = (kind, text) => {
    const token = `\u0000${kind}${protectedRegions.length}\u0000`;
    protectedRegions.push({ kind, text });
    return token;
  };
  value = value
    .replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$(?!\$)[\s\S]*?(?<!\$)\$/g, match => save('math', match))
    .replace(/<table\b[\s\S]*?<\/table>|<svg\b[\s\S]*?<\/svg>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, match => save('block', match))
    .replace(/<img\b[^>]*>/gi, match => save('image', match));
  return {
    visible: value
      .replace(/<br\s*\/?>(?:\s*)?/gi, '\n')
      .replace(/<(?!br\b)\/?[A-Za-z][^>]*>|<!--[\s\S]*?-->/gi, ''),
    protectedRegions
  };
}

function conditionMarkerSignature(value) {
  const visible = maskMarkup(value).visible;
  return [
    ...visible.matchAll(/[（(][가나다라마][）)]/g),
    ...visible.matchAll(/(?<!\S)[가나다라마]\./g)
  ].map(match => ({ index: match.index, text: match[0] }))
    .sort((left, right) => left.index - right.index)
    .map(match => match.text);
}

function structureSignature(value) {
  const count = pattern => (String(value).match(pattern) || []).length;
  return {
    tables: count(/<table\b/gi),
    tableEnds: count(/<\/table>/gi),
    svgs: count(/<svg\b/gi),
    svgEnds: count(/<\/svg>/gi),
    images: count(/<img\b/gi),
    choices: count(/class=["'][^"']*\bchoices\b[^"']*["']/gi),
    notes: count(/class=["'][^"']*\bquestion-note-box\b[^"']*["']/gi)
  };
}

function mathSignature(value) {
  return [...String(value || '').matchAll(/\$\$[\s\S]*?\$\$|\$(?!\$)[\s\S]*?(?<!\$)\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g)].map(match => match[0]);
}

function loadProductionQuestions() {
  const dbContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
  dbContext.globalThis = dbContext;
  vm.createContext(dbContext);
  vm.runInContext(fs.readFileSync(path.join(root, 'archive/db.js'), 'utf8'), dbContext, { filename: 'archive/db.js' });
  const questions = [];
  for (const record of dbContext.window.mainDB.exams) {
    const context = {
      window: {},
      console: { log() {}, warn() {}, error() {} },
      Math, JSON, Object, Array, RegExp, Number, String, Boolean, Date,
      parseInt, parseFloat, Infinity, undefined
    };
    context.globalThis = context;
    vm.createContext(context);
    const file = path.join(root, 'archive', 'exams', record.file);
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: record.file, timeout: 5000 });
    const bank = context.window.questionBank || context.window.__questionBank || [];
    const list = Array.isArray(bank) ? bank : (bank.questions || bank.items || []);
    list.forEach((question, index) => questions.push({
      key: `${record.file}#${index + 1}`,
      content: String(question?.content || question?.question || question?.text || question?.prompt || '')
    }));
  }
  return questions;
}

test('all three engines normalize both condition marker forms with one boundary break', () => {
  const fixtures = [
    ['(가) A (나) B (다) C', '(가) A<br>(나) B<br>(다) C'],
    ['(가) A<br>(나) B', '(가) A<br>(나) B'],
    ['(가) A<br><br>(나) B', '(가) A<br>(나) B'],
    ['(가) 짧은 조건 (나) 짧은 조건', '(가) 짧은 조건<br>(나) 짧은 조건'],
    ['빈칸 (가), (나), (다)에 들어갈 것을 고르시오.', '빈칸 (가), (나), (다)에 들어갈 것을 고르시오.'],
    ['빈칸 (가)~(마)에 들어갈 것을 고르시오.', '빈칸 (가)~(마)에 들어갈 것을 고르시오.'],
    ['가. A 나. B 다. C', '가. A<br>나. B<br>다. C']
  ];
  for (const engineFile of engineFiles) {
    const normalize = loadNormalizer(engineFile);
    for (const [input, expected] of fixtures) assert.equal(normalize(input), expected, `${engineFile}: ${input}`);
  }
});

test('condition normalization has complete boundary witnesses and preserves non-targets', () => {
  const fixtures = [
    { input: '(가) A (나) B', expected: '(가) A<br>(나) B', transition: true },
    { input: '가. A 나. B', expected: '가. A<br>나. B', transition: true },
    { input: '<b>가.</b> A <b>나.</b> B', expected: '<b>가.</b> A<br><b>나.</b> B', transition: true },
    { input: '<span>(가)</span> A <span>(나)</span> B', expected: '<span>(가)</span> A<br><span>(나)</span> B', transition: true },
    { input: '(가) A<br>(나) B', expected: '(가) A<br>(나) B', transition: true },
    { input: '(가) A<br><br>(나) B', expected: '(가) A<br>(나) B', transition: true },
    { input: '(가), (나), (다)', expected: '(가), (나), (다)', transition: false },
    { input: '(가)~(마)', expected: '(가)~(마)', transition: false },
    { input: '(가)와 (나)', expected: '(가)와 (나)', transition: false },
    { input: '$(가) A (나) B$', expected: '$(가) A (나) B$', transition: false },
    { input: '<div class="choices">(가) A (나) B</div>', expected: '<div class="choices">(가) A (나) B</div>', transition: false },
    { input: 'ㄱ. A ㄴ. B (가) C (나) D', expected: 'ㄱ. A ㄴ. B (가) C<br>(나) D', transition: true }
  ];

  for (const engineFile of engineFiles) {
    const normalize = loadNormalizer(engineFile);
    for (const fixture of fixtures) {
      const once = normalize(fixture.input);
      const twice = normalize(once);
      const thrice = normalize(twice);

      assert.equal(once, fixture.expected, `${engineFile}: completeness witness changed unexpectedly`);
      assert.equal(twice, once, `${engineFile}: second normalization changed output`);
      assert.equal(thrice, once, `${engineFile}: third normalization changed output`);
      assert.doesNotMatch(once, /__CONDITION_(?:BLOCK|MATH|TAG)_\d+__/, `${engineFile}: token leak`);
      assert.equal(
        (once.match(/<br\s*\/?>/gi) || []).length,
        fixture.transition ? 1 : 0,
        `${engineFile}: completeness witness break count`
      );
    }
  }
});

test('condition normalization protects math, tables, SVG, images, choices, and note wrappers', () => {
  const fixtures = [
    '<div class="question-note-box">(가) A (나) B</div>',
    '<div class="choices"><div class="choice-text">(가) A (나) B</div></div>',
    '<table><tr><td>(가) A</td><td>(나) B</td></tr></table>',
    '<svg><text>(가) A (나) B</text></svg>',
    '<img alt="(가) A (나) B" src="x.png"> (가) A (나) B',
    '$(가) A (나) B$ (가) A (나) B',
    '<div class="solution"><p>(가) A (나) B</p></div>',
    '<script>const marker = "(가) A (나) B";</script>',
    '<style>.marker::before { content: "(가) A (나) B"; }</style>',
    '<div data-marker="(가) A (나) B">보호된 attribute</div>',
    'ㄱ. A ㄴ. B (가) A (나) B',
    '(가) A'
  ];
  for (const engineFile of engineFiles) {
    const normalize = loadNormalizer(engineFile);
    for (const input of fixtures) {
      const output = normalize(input);
      assert.deepEqual(structureSignature(output), structureSignature(input), `${engineFile}: structure changed`);
      assert.deepEqual(mathSignature(output), mathSignature(input), `${engineFile}: math changed`);
      assert.equal(normalize(output), output, `${engineFile}: not idempotent`);
    }
  }
});

test('all production condition candidates pass mechanical marker and structure checks', () => {
  const production = loadProductionQuestions();
  assert.equal(production.length, 11226);
  const candidates = production.filter(question => {
    const visible = maskMarkup(question.content).visible;
    return (visible.match(/[（(][가나다라마][）)]/g) || []).length >= 2
      || (visible.match(/(?<!\S)[가나다라마]\./g) || []).length >= 2;
  });
  assert.equal(candidates.length, 364);

  for (const engineFile of engineFiles) {
    const normalize = loadNormalizer(engineFile);
    const failures = [];
    for (const question of candidates) {
      const once = normalize(question.content);
      if (normalize(once) !== once || normalize(normalize(once)) !== once) failures.push({ key: question.key, code: 'IDEMPOTENCE' });
      if (/__CONDITION_(?:BLOCK|MATH|TAG)_\d+__/.test(once)) failures.push({ key: question.key, code: 'TOKEN_LEAK' });
      if (conditionMarkerSignature(once).join('|') !== conditionMarkerSignature(question.content).join('|')) failures.push({ key: question.key, code: 'MARKER_SEQUENCE' });
      if (JSON.stringify(structureSignature(once)) !== JSON.stringify(structureSignature(question.content))) failures.push({ key: question.key, code: 'STRUCTURE' });
      if (JSON.stringify(mathSignature(once)) !== JSON.stringify(mathSignature(question.content))) failures.push({ key: question.key, code: 'MATH' });
    }
    assert.deepEqual(failures, [], `${engineFile}: ${failures.length} production failures`);
  }
});
