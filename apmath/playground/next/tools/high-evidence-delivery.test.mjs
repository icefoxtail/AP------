import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildEvidenceDelivery, DELIVERY_PARTS, MAX_PART_BYTES } from './high-evidence-delivery.mjs';

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'high-delivery-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const input = path.join(root, 'original'), out = path.join(root, 'parts');
  const put = (relative, bytes) => {
    const file = path.join(input, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); return file;
  };
  const files = [
    'common-circle-eq--one--pc-paper--review-final--viewport.png',
    'common-circle-eq--one--pc-paper--review-final--scroll-001.png',
    'common-circle-eq--one--mobile-board--answer-revealed--viewport.png',
    'common-lines--two--tablet-landscape-board--failure.png',
    'common-lines--two--pc-board--initial.png'
  ];
  // Transport fixtures are opaque bytes; these tests make no image-render claim.
  for (const [i, file] of files.entries()) put(`after/${file}`, Buffer.from([137, 80, 78, 71, i, 0, 255]));
  const png = file => { const bytes = fs.readFileSync(path.join(input, 'after', file)); return { bytes: bytes.length, sha256: sha(bytes) }; };
  const report = {
    commit: 'b'.repeat(40), provenance: { sourceRole: 'CANDIDATE', sourceCommit: 'b'.repeat(40) },
    runs: ['pc-paper', 'pc-board', 'mobile-paper', 'mobile-board', 'tablet-landscape-board'].map(name => ({ name })),
    labs: [{ id: 'common-circle-eq', captures: files.slice(0, 3) }, { id: 'common-lines', captures: [files[3]] }],
    failures: [{ reason: 'existing-coverage-debt' }], reviewCapture: { complete: false }
  };
  const manifest = { entries: [{ lab: 'common-circle-eq', run: 'pc-paper', file: files[0], png: png(files[0]), supplementalFrames: [{ file: files[1], png: png(files[1]) }] }] };
  put('before/results.json', ' { "failures": ["baseline failure"] }\n');
  put('before/reference.png', 'excluded original baseline PNG bytes');
  put('before/source/binding.json', '{"source":"unchanged"}\n');
  put('after/results.json', JSON.stringify(report));
  put('after/review-capture-manifest.json', JSON.stringify(manifest));
  put('comparison.json', '{"candidateAllChecksPassed":false}\n');
  put('source.json', '{"head":"exact original"}\n');
  put('runner.log', 'unmodified non-JSON evidence\n');
  return { input, out, put, report, manifest, files };
}

test('all after PNGs and original metadata are partitioned once, including extra labs and tablet profiles', t => {
  const f = fixture(t), result = buildEvidenceDelivery(f);
  const { index } = result;
  assert.deepEqual(index.parts.map(part => part.name), DELIVERY_PARTS);
  assert.equal(index.summary.afterPNGs, 5);
  assert.equal(index.summary.registeredAfterPNGs, 4);
  assert.equal(index.summary.excludedBaselinePNGs, 1);
  assert.equal(new Set(index.files.map(file => file.relative)).size, index.files.length);
  assert.equal(index.parts.find(part => part.name === 'mobile-paper').originalFiles, 0);
  for (const entry of index.files) {
    const original = fs.readFileSync(path.join(f.input, entry.relative));
    const copied = fs.readFileSync(path.join(f.out, entry.part, entry.relative));
    assert.deepEqual(copied, original);
    assert.equal(entry.sourceSHA256, sha(original)); assert.equal(entry.copiedSHA256, sha(copied));
  }
  const tablet = index.files.find(file => file.relative.endsWith(f.files[3]));
  assert.equal(tablet.part, 'metadata'); assert.equal(tablet.category, 'additional-profile-after-png');
  const unregistered = index.files.find(file => file.relative.endsWith(f.files[4]));
  assert.equal(unregistered.part, 'pc-board'); assert.deepEqual(unregistered.registeredBy, []);
  for (const part of DELIVERY_PARTS) assert.equal(fs.existsSync(path.join(f.out, part, 'before/reference.png')), false);
  assert.equal(sha(fs.readFileSync(result.indexPath)), result.indexSHA256);
});

test('delivery preserves failed/partial source results without claiming review PASS', t => {
  const f = fixture(t), { index } = buildEvidenceDelivery(f);
  assert.equal(index.status, 'BYTE_COPY_VERIFIED'); assert.equal(index.quality, 'NOT_ASSESSED_BY_TRANSPORT');
  assert.equal(index.sourceFailureCount, 1); assert.equal(index.fullSourceMirror, false);
  const copied = fs.readFileSync(path.join(f.out, 'metadata/after/results.json'));
  assert.deepEqual(copied, fs.readFileSync(path.join(f.input, 'after/results.json')));
  assert.equal(JSON.parse(copied).reviewCapture.complete, false);
});

test('hidden after PNG paths and hidden original metadata remain part of the byte-preserving contract', t => {
  const f = fixture(t), png = 'after/.nested/common-lines--two--mobile-paper--reference.png';
  f.put(png, 'hidden PNG transport fixture');
  f.put('before/.source/binding.json', '{"unchanged":true}\n');
  const { index } = buildEvidenceDelivery(f);
  assert.equal(index.summary.afterPNGs, 6);
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'mobile-paper', png)), fs.readFileSync(path.join(f.input, png)));
  assert.equal(index.files.find(file => file.relative === 'before/.source/binding.json').part, 'metadata');
});

test('registered raw references remain copied original bytes and are never silently omitted', t => {
  const f = fixture(t), raw = 'common-circle-eq--one--pc-paper--review-final.png';
  f.put(`after/${raw}`, 'historical raw PNG bytes');
  const bytes = fs.readFileSync(path.join(f.input, 'after', raw));
  f.manifest.entries[0].rawReference = { file: raw, png: { bytes: bytes.length, sha256: sha(bytes) } };
  f.put('after/review-capture-manifest.json', JSON.stringify(f.manifest));
  const { index } = buildEvidenceDelivery(f);
  assert.equal(index.summary.afterPNGs, 6);
  assert.ok(index.files.find(file => file.relative === `after/${raw}`).registeredBy.includes('review-capture-manifest'));
});

test('missing registered PNGs and changed registered bytes fail before producing deliverable parts', async t => {
  for (const change of ['missing', 'changed']) await t.test(change, t => {
    const f = fixture(t), file = path.join(f.input, 'after', f.files[1]);
    if (change === 'missing') fs.unlinkSync(file); else fs.appendFileSync(file, 'changed');
    assert.throws(() => buildEvidenceDelivery(f), change === 'missing' ? /Missing registered/ : /byte binding differs/);
    assert.equal(fs.existsSync(f.out), false);
  });
});

test('unclassified PNGs and wrong manifest profile associations fail rather than entering a fallback silently', async t => {
  for (const change of ['unknown-lab', 'unknown-run', 'wrong-manifest-run']) await t.test(change, t => {
    const f = fixture(t);
    if (change === 'wrong-manifest-run') { f.manifest.entries[0].run = 'mobile-paper'; f.put('after/review-capture-manifest.json', JSON.stringify(f.manifest)); }
    else f.put(`after/${change === 'unknown-lab' ? 'undeclared--s--pc-paper' : 'common-lines--s--undeclared'}--extra.png`, 'extra');
    assert.throws(() => buildEvidenceDelivery(f), /Unclassified|Misclassified/);
  });
});

test('every original JSON is required where promised and source references cannot traverse directories', async t => {
  for (const change of ['missing-json', 'missing-manifest', 'unsafe-reference', 'symlink']) await t.test(change, t => {
    const f = fixture(t);
    if (change === 'missing-json') fs.unlinkSync(path.join(f.input, 'comparison.json'));
    if (change === 'missing-manifest') fs.unlinkSync(path.join(f.input, 'after/review-capture-manifest.json'));
    if (change === 'unsafe-reference') { f.report.labs[0].captures.push('../before/reference.png'); f.put('after/results.json', JSON.stringify(f.report)); }
    if (change === 'symlink') fs.symlinkSync('source.json', path.join(f.input, 'linked.json'));
    assert.throws(() => buildEvidenceDelivery(f), /Missing original JSON|missing review capture manifest|Unsafe evidence path|regular files/);
  });
});

test('actual part bytes include generated indexes, and exceeding the cap cannot drop or recompress images', t => {
  const f = fixture(t), { index } = buildEvidenceDelivery(f);
  const size = directory => fs.readdirSync(directory, { withFileTypes: true }).reduce((n, item) => n + (item.isDirectory() ? size(path.join(directory, item.name)) : fs.statSync(path.join(directory, item.name)).size), 0);
  for (const part of index.parts) assert.equal(part.actualDirectoryBytes, size(path.join(f.out, part.name)));
  const large = fixture(t);
  large.put('after/common-lines--two--pc-paper--large.png', Buffer.alloc(2 * 1024 * 1024));
  assert.throws(() => buildEvidenceDelivery({ ...large, maxPartBytes: 1024 * 1024 }), /exceeds byte cap without dropping files: pc-paper/);
  assert.equal(fs.existsSync(large.out), false);
  assert.throws(() => buildEvidenceDelivery({ ...large, maxPartBytes: MAX_PART_BYTES + 1 }), /no greater than 400 MiB/);
});

test('outputs cannot overwrite existing evidence or enter the source tree', t => {
  const f = fixture(t); buildEvidenceDelivery(f);
  const original = fs.readFileSync(path.join(f.out, 'metadata/delivery-index.json'));
  assert.throws(() => buildEvidenceDelivery(f), /already exists/);
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'metadata/delivery-index.json')), original);
  assert.throws(() => buildEvidenceDelivery({ ...f, out: path.join(f.input, 'parts') }), /separate from source/);
});

test('additive workflow parts keep the original artifact, aggregate pattern and strict candidate gate', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const workflow = fs.readFileSync(path.resolve(here, '../../../../.github/workflows/high-lab-browser.yml'), 'utf8');
  assert.match(workflow, /name: high-labs-\$\{\{ github\.run_id \}\}-\$\{\{ matrix\.course \}\}/);
  assert.match(workflow, /pattern: high-labs-\$\{\{ github\.run_id \}\}-\*/);
  assert.match(workflow, /high-lab-compare\.mjs[^\n]+--strict-candidate/);
  assert.match(workflow, /--out "\$RUNNER_TEMP\/high-evidence\/after" --review-captures/);
  assert.equal((workflow.match(/name: high-review-delivery-/g) || []).length, 5);
  assert.equal((workflow.match(/always\(\) && steps\.delivery\.outcome == 'success'/g) || []).length, 5);
  assert.equal((workflow.match(/include-hidden-files: true/g) || []).length, 5);
  for (const part of DELIVERY_PARTS) assert.ok(workflow.includes(`matrix.course }}-${part}`));
});

test('both jobs running delivery contract tests check out the workflow directory in cone mode', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const workflow = fs.readFileSync(path.resolve(here, '../../../../.github/workflows/high-lab-browser.yml'), 'utf8');
  for (const [job, next] of [['scope', 'browser'], ['browser', 'review-captures']]) {
    const start = workflow.indexOf(`\n  ${job}:\n`), end = workflow.indexOf(`\n  ${next}:\n`);
    assert.ok(start >= 0 && end > start, `Missing ${job} job boundary`);
    const block = workflow.slice(start, end);
    assert.match(block, /node --test/);
    const checkout = block.match(/sparse-checkout: \|\n((?: {12}[^\n]*\n)+)/);
    assert.ok(checkout, `${job} must declare both checkout directories`);
    const directories = checkout[1].trim().split('\n').map(line => line.trim());
    assert.deepEqual(directories, ['apmath/playground', '.github/workflows']);
    assert.doesNotMatch(block, /sparse-checkout-cone-mode: false/);
  }
});
