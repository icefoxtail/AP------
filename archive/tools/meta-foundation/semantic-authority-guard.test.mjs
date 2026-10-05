import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const ROOT = new URL('../../../', import.meta.url);
const files = [
  'archive/tools/meta-foundation/materialize-h1-eqineq-ledger.mjs',
  'archive/tools/meta-foundation/backfill-h1-legacy-semantic-fields.mjs',
  'archive/tools/meta-foundation/repair-h1-permcomb-matrix-outliers.mjs',
].map((relativePath) => new URL(relativePath, ROOT));

const forbiddenSemanticGenerators = [
  /function\s+sourceMethod\s*\(/,
  /function\s+decisiveStep\s*\(/,
  /function\s+conditions\s*\(/,
  /function\s+supportingConcepts\s*\(/,
  /function\s+compositionPattern\s*\(/,
  /function\s+permPrimary\s*\(/,
  /function\s+conceptsForPerm\s*\(/,
  /function\s+conditionsForSource\s*\(/,
  /function\s+updatedPerm\s*\(/,
  /function\s+updatedMatrix\s*\(/,
  /methodByUnit\s*=\s*\{/,
  /const\s+supporting\s*=\s*unit\s*===/,
  /const\s+primaryMethod\s*=\s*complex\s*\?/,
];

test('H1 semantic repair scripts cannot assign semantic values', () => {
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const pattern of forbiddenSemanticGenerators) {
      assert.doesNotMatch(source, pattern, `${file.pathname} still contains ${pattern}`);
    }
  }
});

test('H1 semantic repair scripts declare direct-ledger authority boundaries', () => {
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW|CANDIDATE_HINT_ONLY|validator|materialize/i, `${file.pathname} lacks an explicit authority boundary`);
  }
});
