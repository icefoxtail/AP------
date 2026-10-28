const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const compilerPath = path.join(__dirname, '..', 'archive', 'tools', 'build-svg-accessibility-index.cjs');

function loadCompiler() {
  assert.ok(fs.existsSync(compilerPath), 'manifest compiler must exist');
  return require(compilerPath);
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, bytes])).digest('hex');
}

function refreshRecordHashes(files) {
  const bytes = fs.readFileSync(files.assetPath);
  const manifest = JSON.parse(fs.readFileSync(files.manifestPath, 'utf8'));
  manifest.records[0].svgSha256 = `sha256:${sha256(bytes)}`;
  manifest.records[0].gitBlobSha = gitBlobSha(bytes);
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest, null, 2));
}

function setSourceIndexRole(files, visualRole) {
  const sourceIndex = JSON.parse(fs.readFileSync(files.sourceIndexPath, 'utf8'));
  sourceIndex.uses = [{ assetRef: files.record.assetRef, uses: [{ visualRole, sourceExamRef: files.record.sourceExamRef, sourceQid: files.record.sourceQid }] }];
  fs.writeFileSync(files.sourceIndexPath, JSON.stringify(sourceIndex, null, 2));
}

function setSourceIndexUnreferenced(files) {
  const sourceIndex = JSON.parse(fs.readFileSync(files.sourceIndexPath, 'utf8'));
  sourceIndex.uses = [{ assetRef: files.record.assetRef, uses: [] }];
  fs.writeFileSync(files.sourceIndexPath, JSON.stringify(sourceIndex, null, 2));
}

function fixture(t) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-accessibility-'));
  t.after(() => fs.rmSync(repoRoot, { recursive: true, force: true }));
  const assetPath = path.join(repoRoot, 'archive', 'assets', 'images', 'sample.svg');
  fs.mkdirSync(path.dirname(assetPath), { recursive: true });
  const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-title svg-desc"><title id="svg-title">원과 중심</title><desc id="svg-desc">중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림</desc><circle r="5"/></svg>\n');
  fs.writeFileSync(assetPath, bytes);
  const record = {
    assetRef: 'assets/images/sample.svg',
    svgSha256: `sha256:${sha256(bytes)}`,
    gitBlobSha: gitBlobSha(bytes),
    visualRole: 'problem',
    titleKo: '원과 중심',
    descriptionKo: '중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림',
    sourceExamRef: 'archive/exams/sample.js',
    sourceQid: 'sample-q1',
    provenanceStatus: 'SOURCE_BOUND',
    answerHintFree: true
  };
  const manifestPath = path.join(repoRoot, 'archive', 'data', 'svg-accessibility-manifest.v1.json');
  const outputPath = path.join(repoRoot, 'archive', 'data', 'svg-accessibility-index.js');
  const sourceIndexPath = path.join(repoRoot, 'archive', 'analysis', 'svg-language-cleanup-20261014', 'stage3-source-index.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify({ schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1', recordCount: 1, records: [record] }, null, 2));
  fs.mkdirSync(path.dirname(sourceIndexPath), { recursive: true });
  fs.writeFileSync(sourceIndexPath, JSON.stringify({
    schemaVersion: 'SVG_LANGUAGE_STAGE3_SOURCE_INDEX_V1',
    uses: [{ assetRef: record.assetRef, uses: [{ visualRole: 'problem', sourceExamRef: record.sourceExamRef, sourceQid: record.sourceQid }] }]
  }, null, 2));
  return { repoRoot, manifestPath, outputPath, sourceIndexPath, assetPath, bytes, record };
}

test('manifest compiler validates current SVG hashes and emits the browser projection', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const report = compileManifest(files);
  const sourceIndexSha256 = `sha256:${sha256(fs.readFileSync(files.sourceIndexPath))}`;
  assert.deepEqual(report, { recordCount: 1, outputPath: files.outputPath, sourceIndexSha256 });
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(files.outputPath, 'utf8'), context);
  assert.equal(context.window.APSvgAccessibilityIndex.records[0].assetRef, files.record.assetRef);
  assert.equal(context.window.APSvgAccessibilityIndex.records[0].descriptionKo, files.record.descriptionKo);
  assert.equal(context.window.APSvgAccessibilityIndex.sourceIndexSha256, sourceIndexSha256);
  const firstProjection = fs.readFileSync(files.outputPath);
  compileManifest(files);
  assert.deepEqual(fs.readFileSync(files.outputPath), firstProjection);
});

test('manifest compiler fails closed when either current SVG checksum is stale', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  fs.appendFileSync(files.assetPath, '<!-- changed -->');
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_HASH_MISMATCH/);
});

test('manifest compiler fails closed when accessible text differs from the current SVG title and description', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(files.manifestPath, 'utf8'));
  manifest.records[0].descriptionKo = '다른 그림 설명';
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_METADATA_MISMATCH/);
});

test('manifest compiler requires source refs for SOURCE_BOUND records and empty source refs for ASSET_ONLY records', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(files.manifestPath, 'utf8'));
  setSourceIndexUnreferenced(files);
  manifest.records[0].provenanceStatus = 'ASSET_ONLY';
  manifest.records[0].visualRole = 'solution';
  manifest.records[0].sourceExamRef = '';
  manifest.records[0].sourceQid = '';
  manifest.records[0].answerHintFree = false;
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.equal(compileManifest(files).recordCount, 1);

  manifest.records[0].provenanceStatus = 'SOURCE_BOUND';
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /INVALID_SVG_ACCESSIBILITY_PROVENANCE_REFS/);
  manifest.records[0].provenanceStatus = 'ASSET_ONLY';
  manifest.records[0].sourceExamRef = 'archive/exams/sample.js';
  manifest.records[0].sourceQid = 'sample-q1';
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /INVALID_SVG_ACCESSIBILITY_PROVENANCE_REFS/);
  manifest.records[0].sourceExamRef = '';
  manifest.records[0].sourceQid = '';
  manifest.records[0].answerHintFree = true;
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_ASSET_ONLY_NOT_HINT_CLEARED/);
});

test('manifest compiler does not erase source binding required by the final role roster', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  setSourceIndexRole(files, 'solution');
  const manifest = JSON.parse(fs.readFileSync(files.manifestPath, 'utf8'));
  manifest.records[0].visualRole = 'solution';
  manifest.records[0].provenanceStatus = 'ASSET_ONLY';
  manifest.records[0].sourceExamRef = '';
  manifest.records[0].sourceQid = '';
  manifest.records[0].answerHintFree = false;
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_PROVENANCE_SOURCE_INDEX_MISMATCH/);
});

test('manifest compiler will not project a problem description without source binding and answer-hint clearance', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(files.manifestPath, 'utf8'));
  manifest.records[0].visualRole = 'problem';
  manifest.records[0].provenanceStatus = 'ASSET_ONLY';
  manifest.records[0].sourceExamRef = '';
  manifest.records[0].sourceQid = '';
  manifest.records[0].answerHintFree = false;
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_PROBLEM_NOT_SOURCE_BOUND/);
});

test('manifest compiler rejects duplicate role keys and unsafe asset refs', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const duplicate = { ...files.record, titleKo: '다른 제목' };
  fs.writeFileSync(files.manifestPath, JSON.stringify({ schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1', recordCount: 2, records: [files.record, duplicate] }));
  assert.throws(() => compileManifest(files), /DUPLICATE_SVG_ACCESSIBILITY_RECORD/);
  fs.writeFileSync(files.manifestPath, JSON.stringify({
    schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1',
    recordCount: 1,
    records: [{ ...files.record, assetRef: '../../outside.svg' }]
  }));
  assert.throws(() => compileManifest(files), /INVALID_SVG_ACCESSIBILITY_ASSET_REF/);
  fs.writeFileSync(files.manifestPath, JSON.stringify({
    schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1',
    recordCount: 1,
    records: [{ ...files.record, assetRef: 'assets/%2e%2e/outside.svg' }]
  }));
  assert.throws(() => compileManifest(files), /INVALID_SVG_ACCESSIBILITY_ASSET_REF/);
});

test('manifest compiler preserves the exact asset and role denominator in the stage-three source index', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const sourceIndex = JSON.parse(fs.readFileSync(files.sourceIndexPath, 'utf8'));
  sourceIndex.uses.push({
    assetRef: 'assets/images/missing-role.svg',
    uses: [{ visualRole: 'solution', sourceExamRef: files.record.sourceExamRef, sourceQid: files.record.sourceQid }]
  });
  fs.writeFileSync(files.sourceIndexPath, JSON.stringify(sourceIndex));
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_MANIFEST_COVERAGE_MISMATCH/);
});

test('manifest compiler binds each SOURCE_BOUND record to a source exam and question in the current role roster', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(files.manifestPath, 'utf8'));
  manifest.records[0].sourceQid = 'other-qid';
  fs.writeFileSync(files.manifestPath, JSON.stringify(manifest));
  assert.throws(() => compileManifest(files), /SVG_ACCESSIBILITY_SOURCE_REF_NOT_IN_ROSTER/);
});

test('manifest compiler runs the student-facing English and aria contract on final SVG bytes', t => {
  const { compileManifest } = loadCompiler();
  const files = fixture(t);
  fs.writeFileSync(files.assetPath, '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-title svg-desc"><title id="svg-title">원과 중심</title><desc id="svg-desc">중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림</desc><text>negative branch</text></svg>\n');
  refreshRecordHashes(files);
  assert.throws(() => compileManifest(files), /SVG_STUDENT_LANGUAGE_CONTRACT_FAIL/);

  fs.writeFileSync(files.assetPath, '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="missing svg-desc"><title id="svg-title">원과 중심</title><desc id="svg-desc">중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림</desc></svg>\n');
  refreshRecordHashes(files);
  assert.throws(() => compileManifest(files), /SVG_STUDENT_LANGUAGE_CONTRACT_FAIL/);
});

test('production compiler discovers a newly referenced SVG without a task audit source-index', t => {
  const { compileManifest } = loadCompiler();
  const files = productionFixture(t);
  const report = compileManifest({ repoRoot: files.repoRoot, baseRef: files.baseRef });
  assert.equal(report.scopeMode, 'EXPLICIT_BASE');
  assert.equal(report.recordCount, 2);
  assert.equal(report.sourceIndexPath, undefined);
  const projection = { window: {} };
  vm.runInNewContext(fs.readFileSync(files.outputPath, 'utf8'), projection);
  assert.deepEqual(
    Array.from(projection.window.APSvgAccessibilityIndex.records, record => record.assetRef).sort(),
    ['assets/images/new.svg', 'assets/images/sample.svg']
  );
  const discovered = projection.window.APSvgAccessibilityIndex.records.find(record => record.assetRef === 'assets/images/new.svg');
  assert.equal(discovered.visualRole, 'problem');
  assert.equal(discovered.sourceQid, 'sample-q2');
  assert.equal(discovered.answerHintFree, true);
  assert.equal(discovered.semanticClearanceOrigin, 'PRODUCTION_SOURCE_IMAGE_BINDING');
  assert.ok(fs.statSync(files.outputPath).size < 20_000, 'projection includes roster digest, not embedded source-index bytes');
  assert.doesNotMatch(fs.readFileSync(files.outputPath, 'utf8'), /sourceIndexBytes/);
});

test('production compiler retains a byte-current managed problem clearance when its exact source binding remains current', t => {
  const { compileManifest } = loadCompiler();
  const files = productionFixture(t);
  const report = compileManifest({ repoRoot: files.repoRoot, baseRef: files.baseRef });
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(files.outputPath, 'utf8'), context);
  const current = Array.from(context.window.APSvgAccessibilityIndex.records).find(record => record.assetRef === 'assets/images/sample.svg');
  assert.equal(report.recordCount, 2);
  assert.equal(current.answerHintFree, true);
  assert.equal(current.semanticClearanceOrigin, 'MANAGED_VERIFIED_RECORD');
});

function productionFixture(t, sourceRoot = 'archive/exams') {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-accessibility-production-'));
  t.after(() => fs.rmSync(repoRoot, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'SVG test');
  const assetDir = path.join(repoRoot, 'archive', 'assets', 'images');
  const sourceDir = path.join(repoRoot, sourceRoot);
  const manifestDir = path.join(repoRoot, 'archive', 'data');
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(manifestDir, { recursive: true });
  const svg = (title, description) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-title svg-desc"><title id="svg-title">${title}</title><desc id="svg-desc">${description}</desc><circle r="5"/></svg>\n`);
  const oldBytes = svg('원과 중심', '중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림');
  fs.writeFileSync(path.join(assetDir, 'sample.svg'), oldBytes);
  const sourceRef = `${sourceRoot}/sample.js`;
  fs.writeFileSync(path.join(repoRoot, sourceRef), "window.questions=[{qid:'sample-q1',image:'assets/images/sample.svg'}];\n");
  const managedRecord = {
    assetRef: 'assets/images/sample.svg', svgSha256: `sha256:${sha256(oldBytes)}`, gitBlobSha: gitBlobSha(oldBytes),
    visualRole: 'problem', titleKo: '원과 중심', descriptionKo: '중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림',
    sourceExamRef: sourceRef, sourceQid: 'sample-q1', provenanceStatus: 'SOURCE_BOUND', answerHintFree: true
  };
  fs.writeFileSync(path.join(manifestDir, 'svg-accessibility-manifest.v1.json'), JSON.stringify({ schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1', recordCount: 1, records: [managedRecord] }));
  fs.writeFileSync(path.join(manifestDir, 'svg-accessibility-index.js'), '');
  git('add', '.');
  git('commit', '-qm', 'fixture baseline');
  const baseRef = git('rev-parse', 'HEAD');
  const newBytes = svg('직선과 점', '한 점을 지나고 기울기가 일정한 직선을 나타낸 그림');
  fs.writeFileSync(path.join(assetDir, 'new.svg'), newBytes);
  fs.writeFileSync(path.join(repoRoot, sourceRef), "window.questions=[{qid:'sample-q1',image:'assets/images/sample.svg'},{qid:'sample-q2',image:'assets/images/new.svg'}];\n");
  return { repoRoot, baseRef, outputPath: path.join(manifestDir, 'svg-accessibility-index.js') };
}

test('production compiler derives a new Generated problem row from the current source image binding', t => {
  const { compileManifest } = loadCompiler();
  const files = productionFixture(t, 'archive/generated/lite/v1/shards');
  compileManifest({ repoRoot: files.repoRoot, baseRef: files.baseRef });
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(files.outputPath, 'utf8'), context);
  const generated = Array.from(context.window.APSvgAccessibilityIndex.records).find(record => record.assetRef === 'assets/images/new.svg');
  assert.equal(generated.sourceExamRef, 'archive/generated/lite/v1/shards/sample.js');
  assert.equal(generated.answerHintFree, true);
  assert.equal(generated.semanticClearanceOrigin, 'GENERATED_PRODUCTION_SOURCE_IMAGE_BINDING');
});

test('student SVG accessibility index tracks the manifest hash and current Q03 metadata', () => {
  const manifestPath = path.join(__dirname, '..', 'archive', 'data', 'svg-accessibility-manifest.v1.json');
  const indexPath = path.join(__dirname, '..', 'archive', 'data', 'svg-accessibility-index.js');
  const assetRef = 'assets/images/24_금당고_2학기_중간_고1_기출/q03-solution.svg';
  const manifestText = fs.readFileSync(manifestPath, 'utf8').replace(/\r\n/g, '\n');
  const manifest = JSON.parse(manifestText);
  const source = manifest.records.find(record => record.assetRef === assetRef && record.visualRole === 'solution');
  assert.ok(source);

  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(indexPath, 'utf8'), context);
  const index = context.window.APSvgAccessibilityIndex;
  const current = Array.from(index.records).find(record => record.assetRef === assetRef && record.visualRole === 'solution');
  assert.ok(current);
  assert.equal(index.manifestSha256, `sha256:${sha256(Buffer.from(manifestText, 'utf8'))}`);
  assert.equal(current.titleKo, source.titleKo);
  assert.equal(current.descriptionKo, source.descriptionKo);
});
