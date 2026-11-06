import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { readScope } from './archive-ci-scope.mjs';

export const playgroundTests = [
  'catalog', 'hub-no-legacy', 'alg-sequence-plus', 'polyhedra-names',
  'cube-section', 'polyhedra-dual', 'video', 'label-sweep',
].map(name => `apmath/playground/next/tools/${name}.test.mjs`);

export function commandsForScope(scope) {
  if (scope.mode === 'full') return null;
  if (scope.mode === 'archive-content') return [['archive/tools/verify-archive-content-scope.mjs', '--scope']];
  if (scope.mode !== 'playground') throw new Error('unknown test scope');
  const tests = new Set([...playgroundTests,
    ...(scope.changedFiles || []).filter(file => /^apmath\/playground\/.*\.test\.(?:mjs|js|cjs)$/.test(file)),
  ]);
  return [
    ['tests/student-portal-geometry-lab-entry.test.js'],
    ['tests/apms-drawer-nav.test.js'],
    ...[...tests].sort().map(file => ['--test', file]),
  ];
}

export function runScopedTests({ root, scopeFile, run = spawnSync }) {
  const scope = readScope(scopeFile, root);
  const commands = commandsForScope(scope);
  console.log(`CI scope: ${scope.mode}; ${scope.reason}. Excluded suites are NOT_APPLICABLE, not verified PASS.`);
  if (commands === null) return false;
  const failures = [];
  for (const original of commands) {
    const args = original.at(-1) === '--scope' ? [...original, path.resolve(scopeFile)] : original;
    const result = run(process.execPath, args, { cwd: root, stdio: 'inherit', timeout: 180000 });
    if (result.error) console.error(result.error.message);
    if (result.error || result.status !== 0) failures.push(original[0] === '--test' ? original[1] : original[0]);
  }
  console.log(`Selected scope ${scope.mode}: ${commands.length - failures.length} passed / ${failures.length} failed (${commands.length} executed commands).`);
  if (failures.length) throw new Error('Scoped checks failed: ' + failures.join(', '));
  return true;
}
