const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceFiles = [
  'apmath/index.html',
  ...fs.readdirSync(path.join(root, 'apmath/js'))
    .filter(name => name.endsWith('.js'))
    .map(name => `apmath/js/${name}`)
].sort();

const allowedGlobals = new Set([
  'window.open',
  'event.stopPropagation',
  'event.preventDefault',
  'Math',
  'Number',
  'String',
  'Array',
  'Object',
  'Date',
  'JSON'
]);

const ignoredBareCalls = new Set([
  'if',
  'for',
  'while',
  'switch',
  'catch',
  'function',
  'return',
  'typeof',
  'void',
  'setTimeout',
  'clearTimeout',
  'parseInt',
  'parseFloat',
  'isNaN',
  'isFinite',
  'encodeURIComponent',
  'decodeURIComponent',
  'alert',
  'confirm'
]);

function stripComments(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function matchAllNames(text, pattern) {
  return Array.from(text.matchAll(pattern), match => match[1]);
}

function extractDefinitions(text) {
  const source = stripComments(text);
  const asyncDeclarations = matchAllNames(source, /(?:^|[^\w$])async\s+function\s+([A-Za-z_$][\w$]*)\s*\(/g);
  const asyncDeclarationSet = new Set(asyncDeclarations);
  return new Set([
    ...matchAllNames(source, /(?:^|[^\w$])function\s+([A-Za-z_$][\w$]*)\s*\(/g)
      .filter(name => !asyncDeclarationSet.has(name)),
    ...asyncDeclarations,
    ...matchAllNames(source, /(?:^|[^\w$])window\.([A-Za-z_$][\w$]*)\s*=/g),
    ...matchAllNames(source, /(?:^|[^\w$])(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g)
  ]);
}

function extractOnclickAttributes(text) {
  const attrs = [];
  const pattern = /onclick\s*=\s*(["'])([\s\S]*?)\1/g;
  for (const match of text.matchAll(pattern)) {
    attrs.push(match[2]);
  }
  return attrs;
}

function extractCalls(expression) {
  const calls = new Set();
  const expressionWithoutStrings = expression.replace(/(['"`])(?:\\.|(?!\1)[\s\S])*?\1/g, '""');
  const memberPattern = /\b(window\.open|event\.stopPropagation|event\.preventDefault)\s*\(/g;
  for (const match of expressionWithoutStrings.matchAll(memberPattern)) {
    calls.add(match[1]);
  }

  const barePattern = /(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(/g;
  for (const match of expressionWithoutStrings.matchAll(barePattern)) {
    const name = match[1];
    if (!ignoredBareCalls.has(name)) calls.add(name);
  }

  return Array.from(calls);
}

const definitions = new Set();
for (const file of sourceFiles.filter(file => file.endsWith('.js'))) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const name of extractDefinitions(text)) definitions.add(name);
}

const undefinedCalls = [];
const onclickInventory = new Map();

assert.deepStrictEqual(
  extractOnclickAttributes(stripComments(`
    <!-- <button onclick="missingFromHtmlComment()"></button> -->
    // onclick="missingFromLineComment()"
    /* onclick="missingFromBlockComment()" */
  `)),
  [],
  'onclick scanner should ignore JS/HTML comment examples'
);

for (const file of sourceFiles) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  const attrs = extractOnclickAttributes(stripComments(text));
  attrs.forEach((attr, index) => {
    const calls = extractCalls(attr);
    onclickInventory.set(`${file}#${index + 1}`, calls);
    for (const call of calls) {
      if (allowedGlobals.has(call)) continue;
      if (!definitions.has(call)) {
        undefinedCalls.push({ file, index: index + 1, call, expression: attr });
      }
    }
  });
}

assert.deepStrictEqual(
  undefinedCalls,
  [],
  `onclick handlers should reference defined project functions only:\n${JSON.stringify(undefinedCalls, null, 2)}`
);

assert(
  Array.from(onclickInventory.values()).some(calls => calls.includes('event.stopPropagation')),
  'onclick scanner should capture event.stopPropagation before project calls'
);
assert(
  Array.from(onclickInventory.values()).some(calls => calls.includes('window.open')),
  'onclick scanner should capture window.open as an allowed browser API'
);
assert(definitions.has('toast'), 'toast must be treated as a project function definition, not an exception');
assert(definitions.has('closeModal'), 'closeModal must be treated as a project function definition, not an exception');
assert(definitions.has('showModal'), 'showModal must be treated as a project function definition, not an exception');

console.log('apmath onclick defined guard passed');
