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

function loadFormatter(engineFile) {
  const source = fs.readFileSync(path.join(root, engineFile), 'utf8');
  const start = source.indexOf('function applyQuestionContentBreaks');
  const end = source.indexOf('function normalizeQuestionTables', start);
  assert.ok(start >= 0, `${engineFile}: subjective formatter section was not found`);
  assert.ok(end > start, `${engineFile}: subjective formatter section boundary was not found`);

  const context = {
    console,
    state: { mode: 'exam' },
    wrapLatex(value) { return String(value ?? ''); }
  };
  vm.runInNewContext(
    `${source.slice(start, end)}\nthis.__api = { formatQuestionContent };`,
    context,
    { filename: engineFile }
  );
  return { formatQuestionContent: context.__api.formatQuestionContent, state: context.state };
}

test('all three engines split only an existing subjective heading into semantic blocks', () => {
  for (const engineFile of engineFiles) {
    const { formatQuestionContent } = loadFormatter(engineFile);
    const question = {
      content: '서술형 1. [5점]<br><br>다음 식의 값을 구하고 그 과정을 서술하시오.',
      __apExamSubjectiveSpacing: true
    };
    const output = formatQuestionContent(question.content, question);

    assert.match(output, /<div class="subjective-heading">서술형 1\. \[5점\]<\/div>/, engineFile);
    assert.match(output, /<div class="subjective-prompt">다음 식의 값을 구하고/, engineFile);
    assert.doesNotMatch(output, /<br><br>/, engineFile);
    assert.equal(formatQuestionContent(question.content, question), output, `${engineFile}: repeated formatting changed output`);
  }
});

test('general short-answer content does not receive subjective spacing', () => {
  for (const engineFile of engineFiles) {
    const loaded = loadFormatter(engineFile);
    const question = { content: '단답형 문항의 발문입니다.', choices: [], __apExamSubjectiveSpacing: true };
    const output = loaded.formatQuestionContent(question.content, question);
    assert.doesNotMatch(output, /subjective-heading/, engineFile);
    assert.equal(output, question.content, engineFile);
  }
});

test('bracketed, unnumbered, prefixed, and image-bearing subjective headings stay intact', () => {
  const fixtures = [
    {
      content: '[서술형 2] $x^2=4$의 해를 구하시오.',
      heading: '[서술형 2]',
      body: '$x^2=4$의 해를 구하시오.'
    },
    {
      content: '[서술형] 도형의 넓이를 구하시오.',
      heading: '[서술형]',
      body: '도형의 넓이를 구하시오.'
    },
    {
      content: '※ 풀이과정을 자세히 쓰시오.<br><br>[서술형 1] 답을 구하시오.',
      heading: '[서술형 1]',
      body: '답을 구하시오.'
    },
    {
      content: '서술형 3. [5점]<br><div><svg width="40" height="20"><line x1="0" y1="0" x2="40" y2="20" /></svg></div>그래프를 이용하시오.',
      heading: '서술형 3. [5점]',
      body: '<div><svg'
    }
  ];

  for (const engineFile of engineFiles) {
    const loaded = loadFormatter(engineFile);
    for (const fixture of fixtures) {
      const output = loaded.formatQuestionContent(fixture.content, { content: fixture.content, __apExamSubjectiveSpacing: true });
      assert.match(output, new RegExp(`<div class="subjective-heading">${fixture.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/div>`), `${engineFile}: ${fixture.heading}`);
      assert.match(output, new RegExp(`<div class="subjective-prompt">${fixture.body.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), `${engineFile}: ${fixture.heading} body`);
    }
  }
});

test('solution and answer paths do not opt into the exam-only marker', () => {
  for (const engineFile of engineFiles) {
    const loaded = loadFormatter(engineFile);
    const question = { content: '서술형 1. [5점]<br><br>해설용 원문입니다.', __apExamSubjectiveSpacing: false };
    if (engineFile.includes('wrong_print_engine')) loaded.state.mode = 'sol';
    const output = loaded.formatQuestionContent(question.content, question);
    assert.doesNotMatch(output, /subjective-heading/, engineFile);
  }
});

test('all engines carry the same minimal spacing contract', () => {
  for (const engineFile of engineFiles) {
    const source = fs.readFileSync(path.join(root, engineFile), 'utf8');
    assert.match(source, /\.q-content > \.subjective-heading \{ display: block; margin-bottom: 0\.8em; \}/, engineFile);
    assert.match(source, /class="subjective-heading"/, engineFile);
    assert.match(source, /class="subjective-prompt"/, engineFile);
  }
});
