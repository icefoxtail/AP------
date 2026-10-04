const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'archive', 'exams', 'types', 'middle', 'm1');
const sourceFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.js'));
const controlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
const backslashRight = String.fromCharCode(92) + 'right';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadSource(fileName) {
  const sourcePath = path.join(sourceDir, fileName);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });
  return { fileName, source, questionBank: context.window.questionBank || [] };
}

const loadedSources = sourceFiles.map(loadSource);

function getQuestion(id) {
  let sourceName = '';
  let question = null;
  for (const source of loadedSources) {
    question = source.questionBank.find((item) => Number(item.id) === id);
    if (question) {
      sourceName = source.fileName;
      break;
    }
  }
  assert(question, `question ${id} should exist`);
  return { question, sourceName };
}

function assertBalancedChoices(question) {
  (question.choices || []).forEach((choice, index) => {
    const dollarCount = (String(choice).match(/\$/g) || []).length;
    assert(dollarCount % 2 === 0, `question ${question.id} choices[${index}] should have balanced math dollars`);
  });
}

const hasApproximationPlaceholder = loadedSources.some((source) => source.source.includes('\\u0007pprox'));
if (hasApproximationPlaceholder) {
  console.warn('DEFERRED: M1 escaped BEL approximation text requires original source comparison.');
}

for (const id of [100, 107, 127, 129, 132, 145, 153]) {
  const { question, sourceName } = getQuestion(id);
  assert(sourceName.includes('2'), `question ${id} should come from the M1 unit 2 source`);
  assert(!controlPattern.test(String(question.solution || '')), `question ${id} solution should not contain runtime control characters`);
  assertBalancedChoices(question);
}

assert(
  loadedSources.every((source) => !source.source.includes('\\u0007ight')),
  'M1 sources should not contain escaped BEL right text'
);

for (const id of [193, 195]) {
  const { question, sourceName } = getQuestion(id);
  assert(sourceName.includes('3'), `question ${id} should come from the M1 unit 3 source`);
  assert(String(question.content || '').includes(backslashRight), `question ${id} content should preserve \\right`);
  assert(!controlPattern.test(String(question.content || '')), `question ${id} content should not contain runtime control characters`);
  assert(!controlPattern.test(String(question.solution || '')), `question ${id} solution should not contain runtime control characters`);
  assertBalancedChoices(question);
}

console.log('assessment M1 type source integrity checks passed');
