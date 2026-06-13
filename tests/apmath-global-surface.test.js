const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const updateFixtures = process.argv.includes('--update');

const targets = [
  { key: 'student', source: 'apmath/js/student.js', fixture: 'tests/fixtures/apmath-surface-student.json' },
  { key: 'classroom', source: 'apmath/js/classroom.js', fixture: 'tests/fixtures/apmath-surface-classroom.json' },
  { key: 'dashboard', source: 'apmath/js/dashboard.js', fixture: 'tests/fixtures/apmath-surface-dashboard.json' },
  { key: 'report', source: 'apmath/js/report.js', fixture: 'tests/fixtures/apmath-surface-report.json' }
];

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function countDuplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function matchAllNames(text, pattern) {
  return Array.from(text.matchAll(pattern), match => match[1]);
}

function extractSurface(sourceText) {
  const text = stripComments(sourceText);
  const asyncFunctionDeclarations = matchAllNames(text, /(?:^|[^\w$])async\s+function\s+([A-Za-z_$][\w$]*)\s*\(/g);
  const asyncFunctionSet = new Set(asyncFunctionDeclarations);
  const functionDeclarations = matchAllNames(text, /(?:^|[^\w$])function\s+([A-Za-z_$][\w$]*)\s*\(/g)
    .filter(name => !asyncFunctionSet.has(name));
  const windowAssignments = matchAllNames(text, /(?:^|[^\w$])window\.([A-Za-z_$][\w$]*)\s*=/g);
  const functionExpressions = matchAllNames(
    text,
    /(?:^|[^\w$])(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g
  );
  const callableDefinitions = [
    ...functionDeclarations,
    ...asyncFunctionDeclarations,
    ...functionExpressions
  ];

  return {
    counts: {
      functionDeclarations: uniqueSorted(functionDeclarations).length,
      asyncFunctionDeclarations: uniqueSorted(asyncFunctionDeclarations).length,
      windowAssignments: uniqueSorted(windowAssignments).length,
      functionExpressions: uniqueSorted(functionExpressions).length,
      allDefinitions: uniqueSorted([...callableDefinitions, ...windowAssignments]).length
    },
    functionDeclarations: uniqueSorted(functionDeclarations),
    asyncFunctionDeclarations: uniqueSorted(asyncFunctionDeclarations),
    windowAssignments: uniqueSorted(windowAssignments),
    functionExpressions: uniqueSorted(functionExpressions),
    duplicateDefinitions: countDuplicates(callableDefinitions)
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

for (const target of targets) {
  const sourcePath = path.join(root, target.source);
  const fixturePath = path.join(root, target.fixture);
  const actual = extractSurface(fs.readFileSync(sourcePath, 'utf8'));

  assert.deepStrictEqual(
    actual.duplicateDefinitions,
    [],
    `${target.source} should not define the same global/function surface name more than once`
  );

  if (updateFixtures) {
    fs.writeFileSync(fixturePath, `${JSON.stringify(actual, null, 2)}\n`);
    continue;
  }

  assert(fs.existsSync(fixturePath), `${target.fixture} fixture is missing; run this test with --update to create it`);
  assert.deepStrictEqual(actual, readJson(fixturePath), `${target.source} global function surface changed`);
}

console.log('apmath global surface guard passed');
