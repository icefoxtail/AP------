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
  assert.deepEqual(report, { recordCount: 1, qualityAdvisory: [], outputPath: files.outputPath, sourceIndexSha256 });
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

test('production compiler lists description-quality shortfalls as advisory and still blocks real SVG defects', t => {
  const { compileManifest } = loadCompiler();
  const files = productionFixture(t);
  const newSvg = path.join(files.repoRoot, 'archive', 'assets', 'images', 'new.svg');
  const write = (title, description, aria = 'svg-title svg-desc') => fs.writeFileSync(newSvg,
    `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${aria}"><title id="svg-title">${title}</title><desc id="svg-desc">${description}</desc><circle r="5"/></svg>\n`);
  // 설명 문구 품질 미달: 게시(색인 생성)를 막지 않고 목록에 남는다.
  write('도형의 관계', '문항의 핵심 관계를 표시한 도형');
  const report = compileManifest({ repoRoot: files.repoRoot, baseRef: files.baseRef });
  assert.equal(report.recordCount, 2);
  assert.ok(report.qualityAdvisory.some(row => row.assetRef === 'assets/images/new.svg' && row.code === 'SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE'), JSON.stringify(report.qualityAdvisory));
  // 실제 결함은 계속 막는다: 새 엔진 그림(엔진 표지)의 참조 깨짐, 학생 눈에 보이는 축척 안내.
  fs.writeFileSync(newSvg, '<svg xmlns="http://www.w3.org/2000/svg" data-engine-version="geometry-visual-v1" role="img" aria-labelledby="missing svg-desc"><title id="svg-title">직선과 점</title><desc id="svg-desc">한 점을 지나고 기울기가 일정한 직선을 나타낸 그림</desc></svg>\n');
  assert.throws(() => compileManifest({ repoRoot: files.repoRoot, baseRef: files.baseRef }), /SVG_STUDENT_LANGUAGE_CONTRACT_FAIL.*ARIA_REFERENCE_INVALID/);
});

test('production compiler lets a legacy SVG without accessibility markup through with a machine substitute name, but blocks engine output and visible defects', t => {
  const { compileManifest } = loadCompiler();
  const files = productionFixture(t);
  const newSvg = path.join(files.repoRoot, 'archive', 'assets', 'images', 'new.svg');
  const compile = () => compileManifest({ repoRoot: files.repoRoot, baseRef: files.baseRef });
  const rowOf = report => {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(files.outputPath, 'utf8'), context);
    return Array.from(context.window.APSvgAccessibilityIndex.records).find(record => record.assetRef === 'assets/images/new.svg');
  };
  // legacy: no title/desc/role/aria at all -> passes, listed, the row carries a machine substitute name and the marker field
  fs.writeFileSync(newSvg, '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle r="5"/></svg>\n');
  const report = compile();
  assert.equal(report.recordCount, 2);
  assert.ok(report.qualityAdvisory.some(row => row.assetRef === 'assets/images/new.svg' && row.code === 'SVG_ACCESSIBILITY_LEGACY_TEXT_SUBSTITUTED'), JSON.stringify(report.qualityAdvisory));
  assert.ok(report.qualityAdvisory.some(row => row.assetRef === 'assets/images/new.svg' && row.code === 'SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED'));
  const row = rowOf();
  assert.equal(row.textSource, 'MACHINE_SUBSTITUTE');
  assert.equal(row.titleKo, 'sample 2번 문제 그림');
  assert.equal(row.descriptionKo, row.titleKo);
  // legacy with real text but broken references/role: the real text is used (no substitute), still listed
  fs.writeFileSync(newSvg, '<svg xmlns="http://www.w3.org/2000/svg"><title>직선과 점</title><desc>한 점을 지나고 기울기가 일정한 직선을 나타낸 그림</desc></svg>\n');
  const withText = compile();
  assert.ok(withText.qualityAdvisory.some(item => item.code === 'SVG_ACCESSIBILITY_ROLE_IMG_REQUIRED'));
  assert.equal(rowOf().textSource, undefined);
  assert.equal(rowOf().titleKo, '직선과 점');
  // new engine output (engine marker) missing its markup is an engine regression: blocked
  fs.writeFileSync(newSvg, '<svg xmlns="http://www.w3.org/2000/svg" data-engine-version="geometry-visual-v1"><circle r="5"/></svg>\n');
  assert.throws(compile, /SVG_STUDENT_LANGUAGE_CONTRACT_FAIL.*TITLE_DESC_REQUIRED/);
  // other engine generators: stat-chart (confirmed marker) and composite (new-path marker; new.svg is a new file at the base) are blocked too
  fs.writeFileSync(newSvg, '<svg xmlns="http://www.w3.org/2000/svg" data-stat-chart="stat-chart-figure-v1" data-publication-profile="fragment-publication-spike-v1"><circle r="5"/></svg>\n');
  assert.throws(compile, /SVG_STUDENT_LANGUAGE_CONTRACT_FAIL.*TITLE_DESC_REQUIRED/);
  fs.writeFileSync(newSvg, '<svg xmlns="http://www.w3.org/2000/svg" data-composite="composite-panels-v1"><circle r="5"/></svg>\n');
  assert.throws(compile, /SVG_STUDENT_LANGUAGE_CONTRACT_FAIL.*TITLE_DESC_REQUIRED/);
  // visible defects, referenced duplicate ids and a missing root keep blocking even for legacy figures
  const legacyHead = '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d">';
  const body = '<title id="t">직선과 점</title><desc id="d">한 점을 지나고 기울기가 일정한 직선을 나타낸 그림</desc>';
  // scale guidance text: listed only for a legacy figure, blocked for engine output
  fs.writeFileSync(newSvg, `${legacyHead}${body}<text>축척: x,y 동일 단위</text></svg>\n`);
  assert.ok(compile().qualityAdvisory.some(row => row.assetRef === 'assets/images/new.svg' && row.code === 'SVG_SCALE_GUIDANCE_FORBIDDEN'));
  fs.writeFileSync(newSvg, `${legacyHead.replace('<svg ', '<svg data-engine-version="geometry-visual-v1" ')}${body}<text>축척: x,y 동일 단위</text></svg>\n`);
  assert.throws(compile, /SCALE_GUIDANCE_FORBIDDEN/);
  // a duplicate id that a shape points at (url(#id)) blocks; one nobody points at is only listed
  fs.writeFileSync(newSvg, `${legacyHead}${body}<g id="same"/><g id="same"/><rect fill="url(#same)"/></svg>\n`);
  assert.throws(compile, /DUPLICATE_ID/);
  fs.writeFileSync(newSvg, `${legacyHead}${body}<g id="same"/><g id="same"/></svg>\n`);
  assert.ok(compile().qualityAdvisory.some(row => row.assetRef === 'assets/images/new.svg' && row.code === 'SVG_ACCESSIBILITY_DUPLICATE_ID_UNREFERENCED'));
  fs.writeFileSync(newSvg, 'not an svg\n');
  assert.throws(compile, /SVG_ROOT_MISSING|SVG_STUDENT_LANGUAGE_CONTRACT_FAIL/);
});

test('the new-file check reads the base asset list with git once, lazily, and fails loudly when git fails', () => {
  const { createBaseAssetLookup } = loadCompiler();
  const calls = [];
  const run = (program, args) => { calls.push([program, ...args]); return 'archive/assets/images/한글 폴더/old.svg\0archive/assets/images/b.svg\0'; };
  const isNew = createBaseAssetLookup('/repo', 'abc123', run);
  assert.equal(calls.length, 0, 'nothing is read until the first question');
  for (let i = 0; i < 1000; i++) assert.equal(isNew('assets/images/b.svg'), false);
  assert.equal(isNew('assets/images/한글 폴더/old.svg'), false);
  assert.equal(isNew('assets/images/new.svg'), true);
  assert.equal(calls.length, 1, 'one git call for every lookup');
  assert.ok(calls[0].includes('-z') && calls[0].includes('ls-tree') && calls[0].includes('abc123'));
  const failing = createBaseAssetLookup('/repo', 'abc123', () => { throw Object.assign(new Error('boom'), { stderr: Buffer.from('bad object') }); });
  assert.throws(() => failing('assets/images/x.svg'), /SVG_ACCESSIBILITY_GIT_SCOPE_FAILED.*bad object/);
});

test('the new-file question is asked only for a figure with a new-path marker and no confirmed marker', () => {
  const { isEngineSvg } = require(path.join(__dirname, '..', 'archive', 'tools', 'svg-language-contract.cjs'));
  let asked = 0;
  const newPath = () => { asked += 1; return true; };
  const svg = marker => `<svg xmlns="http://www.w3.org/2000/svg" ${marker}></svg>`;
  assert.equal(isEngineSvg(svg(''), { newPath }), false);
  assert.equal(isEngineSvg(svg('data-engine-version="geometry-visual-v1"'), { newPath }), true);
  assert.equal(isEngineSvg(svg('data-stat-chart="stat-chart-figure-v1" data-composite="composite-panels-v1"'), { newPath }), true);
  assert.equal(asked, 0, 'unmarked and confirmed-marker figures never ask');
  assert.equal(isEngineSvg(svg('data-composite="composite-panels-v1"'), { newPath }), true);
  assert.equal(asked, 1);
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

test('student SVG accessibility index tracks the manifest hash and current Geumdang metadata', () => {
  const manifestPath = path.join(__dirname, '..', 'archive', 'data', 'svg-accessibility-manifest.v1.json');
  const indexPath = path.join(__dirname, '..', 'archive', 'data', 'svg-accessibility-index.js');
  const assetRefs = [
    'assets/images/24_금당고_2학기_중간_고1_기출/q03-solution.svg',
    'assets/images/24_금당고_2학기_중간_고1_기출/q16-solution.svg'
  ];
  const manifestText = fs.readFileSync(manifestPath, 'utf8').replace(/\r\n/g, '\n');
  const manifest = JSON.parse(manifestText);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(indexPath, 'utf8'), context);
  const index = context.window.APSvgAccessibilityIndex;
  assert.equal(index.manifestSha256, `sha256:${sha256(Buffer.from(manifestText, 'utf8'))}`);
  for (const assetRef of assetRefs) {
    const source = manifest.records.find(record => record.assetRef === assetRef && record.visualRole === 'solution');
    const current = Array.from(index.records).find(record => record.assetRef === assetRef && record.visualRole === 'solution');
    assert.ok(source);
    assert.ok(current);
    const bytes = execFileSync('git', ['show', `HEAD:archive/${assetRef}`], { cwd: path.join(__dirname, '..') });
    assert.equal(source.svgSha256, `sha256:${sha256(bytes)}`);
    assert.equal(source.gitBlobSha, gitBlobSha(bytes));
    assert.equal(current.svgSha256, source.svgSha256);
    assert.equal(current.gitBlobSha, source.gitBlobSha);
    assert.equal(current.titleKo, source.titleKo);
    assert.equal(current.descriptionKo, source.descriptionKo);
  }
});

test('--quality-report lists every flagged SVG with its exams and text, English/math-markup findings first, and never blocks', t => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-quality-report-'));
  t.after(() => fs.rmSync(repoRoot, { recursive: true, force: true }));
  const dir = path.join(repoRoot, 'archive', 'assets', 'images');
  fs.mkdirSync(dir, { recursive: true });
  const svg = (title, desc) => `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d"><title id="t">${title}</title><desc id="d">${desc}</desc></svg>\n`;
  fs.writeFileSync(path.join(dir, 'good.svg'), svg('원과 중심', '중심에서 원 위의 점까지의 거리가 같은 원을 나타낸 그림'));
  fs.writeFileSync(path.join(dir, 'generic.svg'), svg('도형의 관계', '문항의 핵심 관계를 표시한 도형'));
  fs.writeFileSync(path.join(dir, 'english.svg'), svg('similar triangles', 'Right triangle ADE with a right angle at D and a parallel segment BC'));
  fs.writeFileSync(path.join(dir, 'broken.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>\n');
  const uses = { uses: [{ assetRef: 'assets/images/english.svg', uses: [{ visualRole: 'solution', sourceExamRef: 'archive/exams/a.js', sourceQid: 'q3' }, { visualRole: 'solution', sourceExamRef: 'archive/exams/b.js', sourceQid: 'q9' }] }] };
  const { writeQualityReport } = require(path.join(__dirname, '..', 'archive', 'tools', 'svg-quality-report.cjs'));
  const out = path.join(repoRoot, 'report.tsv');
  const result = writeQualityReport({ repoRoot, outPath: out, uses });
  assert.equal(result.scanned, 4);
  assert.equal(result.flagged, 3);
  const rows = fs.readFileSync(out, 'utf8').trim().split('\n').slice(1).map(line => line.split('\t'));
  assert.equal(rows[0][0], 'assets/images/english.svg', 'English/math-markup findings come first');
  assert.equal(rows[0][1], 'quality');
  assert.equal(rows[0][4], 'archive/exams/a.js;archive/exams/b.js');
  assert.equal(rows[0][5], 'archive/exams/a.js#q3;archive/exams/b.js#q9');
  assert.ok(rows.some(row => row[0] === 'assets/images/generic.svg' && /DESCRIPTION_NOT_SUBSTANTIVE/.test(row[2])));
  // 옛 그림의 접근성 표기 누락은 막지 않는 항목(legacy-a11y), 대체 문구 열이 채워진다(시험지 연결이 있을 때).
  assert.ok(rows.some(row => row[0] === 'assets/images/broken.svg' && row[1] === 'legacy-a11y'));
  fs.writeFileSync(path.join(dir, 'visible.svg'), svg('도형', '축척과 관계없이 점 A와 B를 잇는 선분을 나타낸 그림').replace('<svg ', '<svg data-engine-version="geometry-visual-v1" ').replace('</svg>', '<text>축척: x,y 동일 단위</text></svg>'));
  fs.writeFileSync(path.join(dir, 'engine.svg'), '<svg xmlns="http://www.w3.org/2000/svg" data-engine-version="geometry-visual-v1"><circle r="5"/></svg>\n');
  const more = writeQualityReport({ repoRoot, outPath: path.join(repoRoot, 'more.tsv'), uses });
  assert.equal(more.flagged, 5);
  const moreRows = fs.readFileSync(path.join(repoRoot, 'more.tsv'), 'utf8').trim().split('\n').slice(1).map(line => line.split('\t'));
  assert.equal(moreRows.find(row => row[0] === 'assets/images/visible.svg')[1], 'defect', 'scale guidance in engine output is a defect');
  assert.equal(moreRows.find(row => row[0] === 'assets/images/engine.svg')[1], 'defect', 'engine output missing markup is a defect, not legacy');
  const jsonOut = path.join(repoRoot, 'report.json');
  assert.equal(writeQualityReport({ repoRoot, outPath: jsonOut, uses }).flagged, 5);
  assert.equal(JSON.parse(fs.readFileSync(jsonOut, 'utf8')).rows.length, 5);
});
