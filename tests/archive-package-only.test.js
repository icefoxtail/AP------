const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const test = require('node:test');

const load = () => import('../archive/tools/materialize-archive-package-shards.mjs');
const shard = 'archive/data/archive2-source-verification/mixed-v1/context.json';
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-package-only-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'archive/data'), { recursive: true });
  fs.writeFileSync(path.join(root, 'archive/data/catalog.json'), 'registered\n');
  return { root, registeredFiles: [['archive/data/catalog.json', 'registered\n']], packageFiles: [[shard, 'temporary\n']] };
}
test('packaging writes only ignored shards and preserves registered bytes', async t => {
  const f = fixture(t); const { materializePackageShards } = await load();
  assert.deepEqual(materializePackageShards(f), { registeredFilesVerified: 1, temporaryFilesWritten: 1 });
  assert.equal(fs.readFileSync(path.join(f.root, 'archive/data/catalog.json'), 'utf8'), 'registered\n');
  assert.equal(fs.readFileSync(path.join(f.root, shard), 'utf8'), 'temporary\n');
  assert.deepEqual(materializePackageShards(f), { registeredFilesVerified: 1, temporaryFilesWritten: 1 });
});
test('stale registered authority is refused before any package write', async t => {
  const f = fixture(t); const { materializePackageShards } = await load();
  f.registeredFiles[0][1] = 'different version\n';
  assert.throws(() => materializePackageShards(f), /REGISTERED_PACKAGE_INPUT_MISMATCH/);
  assert.equal(fs.existsSync(path.join(f.root, shard)), false);
  assert.equal(fs.readFileSync(path.join(f.root, 'archive/data/catalog.json'), 'utf8'), 'registered\n');
});
test('packaging cannot target a shared authority or escape through a path or symlink', async t => {
  const f = fixture(t); const { materializePackageShards } = await load();
  for (const target of ['archive/data/catalog.json', shard.replace('context.json', '../catalog.json')]) {
    assert.throws(() => materializePackageShards({ ...f, packageFiles: [[target, 'bad']] }), /NOT_A_TEMPORARY_PACKAGE_SHARD/);
  }
  fs.mkdirSync(path.dirname(path.join(f.root, shard)), { recursive: true });
  fs.symlinkSync(path.join(f.root, 'archive/data/catalog.json'), path.join(f.root, shard));
  assert.throws(() => materializePackageShards(f), /PACKAGE_SHARD_SYMLINK/);
  assert.equal(fs.readFileSync(path.join(f.root, 'archive/data/catalog.json'), 'utf8'), 'registered\n');
});
