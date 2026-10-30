import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { planPagesSite } from '../tools/build-archive-pages-site.mjs';

// The Pages package keeps every file a page can request and only drops digest-verified inputs that no page requests.
// This test proves that on the real tree: the files left out of the site are not named by any shipped browser code or
// by the Worker that reads the site, and everything the canonical loader can fetch is in the site.
// It needs the CI-generated mixed verification data (tools/check-archive2-runtime.cjs builds it first).

const require = createRequire(import.meta.url);
const canonical = require('../archive/archive2-canonical.js');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = planPagesSite({ sourceRoot: root });
const shipped = new Set(plan.entries.map((entry) => entry.path));
const shippedBasenames = new Set(plan.entries.map((entry) => path.posix.basename(entry.path)));

function codeFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'worker-backup', 'tools', 'vendor', 'exams', 'assets', 'data', 'generated', 'prototypes'].includes(entry.name)) continue;
      codeFiles(child, out);
    } else if (/\.(?:js|mjs|cjs|html)$/.test(entry.name)) out.push(child);
  }
  return out;
}

function runtimeCode() {
  const files = [];
  const archiveRoot = path.join(root, 'archive');
  for (const entry of fs.readdirSync(archiveRoot, { withFileTypes: true }))
    if (entry.isFile() && /\.(?:js|html)$/.test(entry.name)) files.push(path.join(archiveRoot, entry.name));
  files.push(...codeFiles(path.join(archiveRoot, 'assessment')));
  files.push(...codeFiles(path.join(archiveRoot, 'prototypes', 'ap-galaxy')));
  for (const dir of ['apmath', 'shared', 'eie', 'check', 'planner', 'apmath-home', 'eie-home', 'cmath-home'])
    files.push(...codeFiles(path.join(root, dir)));
  files.push(path.join(root, 'index.html'));
  // The Worker is not shipped but reads the published site (ARCHIVE2_ASSETS / ARCHIVE_PUBLIC_BASE_URL).
  files.push(...codeFiles(path.join(root, 'apmath', 'worker-backup', 'worker', 'helpers')));
  files.push(...codeFiles(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes')));
  files.push(path.join(root, 'apmath', 'worker-backup', 'worker', 'index.js'));
  // question-index.js / question-identity.js are generated data wrappers, not request code.
  return files.filter((file) => !/archive[\\/](?:question-index|question-identity|db)\.js$/.test(file) && fs.existsSync(file));
}

test('digest-verified inputs left out of the site are not named by any shipped page or the Worker', () => {
  assert.ok(plan.buildOnly.length > 0, 'the package must declare which verified inputs it does not ship');
  const sources = runtimeCode().map((file) => ({ file: path.relative(root, file), text: fs.readFileSync(file, 'utf8') }));
  assert.ok(sources.length > 100, 'runtime code scan must cover the shipped pages');
  const offenders = [];
  for (const item of plan.buildOnly) {
    const base = path.posix.basename(item.path);
    const tail = item.path.replace(/^archive\//, '');
    // A file name only counts when it is a whole path segment or string (not the tail of a longer name such as
    // curriculum_bindings.json) and a name shared with a shipped file is matched by its full path only.
    // promotion_receipt.json is built by name in archive2-canonical.js only to check that
    // the receipt is listed in the manifest (manifestInputPathsFromRuntimePacks); nothing fetches it.
    const named = new RegExp(`(?:^|[/"'\`\\s])${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    for (const source of sources) {
      if (source.text.includes(tail)) offenders.push(`${item.path} <- ${source.file}`);
      else if (base !== 'promotion_receipt.json' && !shippedBasenames.has(base) && named.test(source.text)) offenders.push(`${item.path} (name) <- ${source.file}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('everything the canonical loader can fetch is shipped', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'), 'utf8'));
  const runtimePaths = canonical.runtimeInputPathsFromManifest(manifest.files);
  const packs = runtimePaths.map((runtimePath) => JSON.parse(fs.readFileSync(path.join(root, 'archive', runtimePath), 'utf8')));
  const fetched = [
    ...canonical.REQUIRED_INPUT_PATHS,
    ...runtimePaths,
    ...canonical.reviewedRegistrationProofPaths(packs),
    'data/archive2-canonical-input-manifest.json',
    'data/archive2-source-verification-index.json',
  ];
  for (const relative of fetched) {
    const packaged = relative.startsWith('../') ? relative.replace(/^\.\.\//, '') : `archive/${relative}`;
    assert.ok(shipped.has(packaged), `loader-fetched input is missing from the site: ${packaged}`);
  }
});

test('data fetched directly by shipped pages stays in the site', () => {
  for (const required of [
    'archive/data/archive2-catalog.json',
    'archive/data/question_metadata.json',
    'archive/data/school-fingerprints.json',
    'archive/data/archive2-crosswalk-inventory.json',
    'archive/data/generated-lite-consumer/v1/index.json',
    'archive/question-index.js',
    'archive/question-identity.js',
    'archive/db.js',
    // problem-bank-search.html lazily loads the key resolver, its extension index and the RPM crosswalks it follows.
    'archive/archive2-key-resolver.js',
    'archive/data/archive2-extension-keys.json',
    ...fs.readdirSync(path.join(root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0'))
      .filter((name) => name.endsWith('.json')).map((name) => `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/${name}`),
  ]) assert.ok(shipped.has(required), required);
});

test('every local script and stylesheet a shipped page names is in the site', () => {
  const missing = [];
  for (const entry of plan.entries) {
    if (!/^(?:archive\/[^/]+|archive\/assessment\/[^/]+|index)\.html$/.test(entry.path)) continue;
    const source = fs.readFileSync(path.join(root, entry.path), 'utf8');
    for (const match of source.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)=["']([^"'#?]+)/gi)) {
      const ref = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
      const target = ref.startsWith('/') ? ref.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(entry.path), ref));
      if (!shipped.has(target)) missing.push(`${entry.path} -> ${target}`);
    }
  }
  assert.deepEqual(missing, []);
});
