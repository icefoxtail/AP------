const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const targets = [
  'archive/tools/meta-foundation/rpm-active-resolver.test.mjs',
  'archive/tools/meta-foundation/rpm-primary-high-school-semantic-regression.test.mjs',
  'archive/tools/meta-foundation/semantic-authority-guard.test.mjs',
];

for (const target of targets) {
  test('Geumdang MI1 canonical validator: ' + target, () => {
    const result = spawnSync(process.execPath, ['--test', target], {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 60000,
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    assert.equal(result.status, 0, target + ' must pass');
  });
}
