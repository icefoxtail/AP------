const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const test = require('node:test');

const BASE = '92dd3614585fefadef3ce0ad6cf68aed5cef97da';
const NATIVE = 'c28641f67d91bfb27352b11faaef4552f46c45be';
const RPM = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const MODULE = path.resolve(__dirname, '../archive/tools/meta-foundation/reviewed-m2-native-rpm-course.mjs');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = value => sha(stable(value));
const oid = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const clone = value => structuredClone(value);
const json = bytes => JSON.parse(bytes.toString('utf8'));
const env = () => ({ ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' });
// Exercise the real private parser without adding a production export or
// copying its implementation into the fixture.
const moduleSource = fs.readFileSync(MODULE, 'utf8');
const bankStart = moduleSource.indexOf('function bank(bytes) {');
const bankEnd = moduleSource.indexOf('\nfunction checkScope(', bankStart);
assert(bankStart >= 0 && bankEnd > bankStart, 'exact production bank parser required');
const bank = Function('vm', 'fail', moduleSource.slice(bankStart, bankEnd) + '; return bank;')(
  vm, code => { throw new Error('M2_NATIVE_RPM_COURSE:' + code); });

// Reusable read-only fixture constructor for the parent integration harness.
// No student literals or review decisions are copied into this test file. The
// fixture reads their immutable public Git bytes; missing authority is a failure.
async function prepareCourseFixture({ gitDir, baseCommit = BASE, modulePath = MODULE, metadataRecords = [] } = {}) {
  gitDir ||= process.env.ARCHIVE_M2_NATIVE_RPM_COURSE_GIT_DIR || execFileSync('git', ['rev-parse', '--absolute-git-dir'],
    { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', env: env(), stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  gitDir = path.resolve(gitDir);
  const g = args => execFileSync('git', [`--git-dir=${gitDir}`, ...args], { env: env(), maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'] });
  const read = (commit, file) => g(['show', `${commit}:${file}`]);
  const ref = (commit, file) => { const bytes = read(commit, file); return { commit, path: file,
    gitBlobSha1: oid(bytes), sha256: sha(bytes), bytes: bytes.length }; };
  const mod = await import(pathToFileURL(modulePath).href);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-m2-course-'));
  const initEnv = env(); delete initEnv.GIT_DIR; delete initEnv.GIT_WORK_TREE;
  execFileSync('git', ['init', '-q', root], { env: initEnv, stdio: 'pipe' });
  fs.mkdirSync(path.join(root, '.git/objects/info'), { recursive: true });
  const objects = g(['rev-parse', '--path-format=absolute', '--git-path', 'objects']).toString().trim();
  fs.writeFileSync(path.join(root, '.git/objects/info/alternates'), `${objects}\n`);
  const local = new Map();
  const put = (file, bytes) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), bytes); local.set(file, Buffer.from(bytes)); };
  const currentRef = ref(baseCommit, RPM), originalRef = ref(NATIVE, RPM);
  put(RPM, read(baseCommit, RPM)); put(MASTER, read(baseCommit, MASTER));
  const masterRef = { path: MASTER, sha256: sha(local.get(MASTER)) };
  const taxonomy = json(read(baseCommit, 'archive/data/meta-foundation/compiled/taxonomy_registry.json'));
  const bindings = json(read(baseCommit, 'archive/data/meta-foundation/compiled/curriculum_bindings.json')).bindings;
  const tagMaster = json(read(baseCommit, 'archive/data/master_tables/js_archive_tag_master.json'));
  const tables = { pt: new Map(taxonomy.problemTypes.map(x => [x.problemTypeKey, x])),
    tpl: new Map(taxonomy.templates.map(x => [x.templateKey, x])),
    bindings: new Map(bindings.filter(x => x.status === 'ACTIVE').map(x =>
      [stable([x.curriculum, x.standardCourse, x.standardUnitKey, x.subUnitKey ?? null, x.problemTypeKey]), x])),
    master: new Map(tagMaster.filter(x => ['standardUnitKey', 'subUnitKey'].includes(x.keyType)).map(x => [x.key, x])), packs: new Map() };
  const groups = new Map(), metadata = new Map(metadataRecords.map(x => [x.questionUid, x]));
  for (const item of mod.M2_NATIVE_RPM_COURSE_ITEMS) {
    if (groups.has(item.sourceArchiveFile)) continue;
    const sourcePath = `archive/exams/${item.sourceArchiveFile}`, reviewBytes = read(NATIVE, item.reviewPath), review = json(reviewBytes);
    const originalBytes = read(review.baseSha, sourcePath), committedBytes = read(NATIVE, sourcePath), currentBytes = read(baseCommit, sourcePath);
    const reviewedBank = bank(originalBytes), committedBank = bank(committedBytes), currentBank = bank(currentBytes);
    put(item.reviewPath, reviewBytes); put(sourcePath, currentBytes);
    const sr = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: NATIVE, reviewPath: item.reviewPath,
      reviewRef: { path: item.reviewPath, sha256: sha(reviewBytes) } };
    const native = { spec: sr, review, sourceBlob: oid(originalBytes), sourceSha256: sha(originalBytes),
      committedBlob: oid(committedBytes), reviewedBank, committedBank, rows: new Map(review.items.map(x => [x.sourceOrdinal, x])),
      reviewer: review.judgedBy?.agent || review.owner };
    groups.set(item.sourceArchiveFile, { sourcePath, currentBytes, currentBank, sr, native });
  }
  for (const item of mod.M2_NATIVE_RPM_COURSE_ITEMS) {
    const row = groups.get(item.sourceArchiveFile).native.rows.get(item.sourceOrdinal), q = groups.get(item.sourceArchiveFile).currentBank[item.sourceOrdinal - 1];
    const b = tables.bindings.get(stable(['2015', '중2 수학', q.standardUnitKey, q.subUnitKey ?? null, row.after.problemTypeKey]));
    const owners = [b?.ownerPack, tables.pt.get(row.after.problemTypeKey)?.ownerPack, tables.tpl.get(row.after.templateKey)?.ownerPack].filter(Boolean);
    for (const owner of owners) if (!tables.packs.has(owner)) tables.packs.set(owner,
      { meta: json(read(baseCommit, `archive/data/meta-foundation/canonical/packs/${owner.toLowerCase().replaceAll('_', '-')}/pack.json`)) });
  }
  function caseFor(itemOrUid) {
    const item = typeof itemOrUid === 'string' ? mod.M2_NATIVE_RPM_COURSE_ITEMS.find(x => x.questionUid === itemOrUid) : itemOrUid;
    const group = groups.get(item.sourceArchiveFile), row = group.native.rows.get(item.sourceOrdinal), q = group.currentBank[item.sourceOrdinal - 1];
    const md = metadata.get(item.questionUid) || { questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, standardCourse: '중2 수학' };
    const after = { ...row.after, curriculum: '2015', standardCourse: '중2 수학', courseKey: 'M2-2',
      standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey,
      sourceFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
        answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })) };
    const refs = [group.sr.reviewRef, masterRef, { path: RPM, sha256: currentRef.sha256 }];
    const request = { scope: 'PARTIAL_UIDS', sourceArchiveFile: item.sourceArchiveFile,
      expectedQuestionCount: item.expectedQuestionCount, expectedSourceBlobSha1: oid(group.currentBytes), registryChanges: [],
      approval: { type: 'FINAL_QA', metadataReviewed: true, evidenceRefs: refs } };
    const patch = { questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, before: { courseKey: null, curriculum: null }, after,
      sourceReview: group.sr, evidenceRefs: refs, targetParentRef: { ...masterRef, curriculum: '2015', scope: 'M2-2',
        majorUnit: row.after.rpmPrimaryPath.majorUnit, midUnit: row.after.rpmPrimaryPath.midUnit,
        nativeRpmCourseTransport: { schemaVersion: mod.M2_NATIVE_RPM_COURSE_SCHEMA, field: 'courseKey',
          nativeRpmRef: originalRef, currentRpmRef: currentRef } } };
    return clone({ root, request, patch, native: group.native, row, metadata: md, question: q,
      committedQuestion: group.native.committedBank[item.sourceOrdinal - 1], accepted: row.after,
      final: { ...md, ...after }, canonicalBefore: tables, canonicalAfter: tables });
  }
  function committedFile(file, bytes) {
    const localEnv = env(); delete localEnv.GIT_DIR; delete localEnv.GIT_WORK_TREE;
    Object.assign(localEnv, { GIT_AUTHOR_NAME: 'course-test', GIT_AUTHOR_EMAIL: 'course-test@example.invalid',
      GIT_COMMITTER_NAME: 'course-test', GIT_COMMITTER_EMAIL: 'course-test@example.invalid' });
    const command = (args, input) => execFileSync('git', args, { cwd: root, env: localEnv, input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    let hash = command(['hash-object', '-w', '--stdin'], bytes), mode = '100644', type = 'blob';
    for (const name of file.split('/').reverse()) { hash = command(['mktree'], `${mode} ${type} ${hash}\t${name}\n`); mode = '040000'; type = 'tree'; }
    const commit = command(['commit-tree', hash, '-m', 'isolated exact RPM test object']);
    return { commit, path: file, gitBlobSha1: oid(bytes), sha256: sha(bytes), bytes: bytes.length };
  }
  return { root, mod, tables, groups, currentRef, originalRef, masterRef, local, caseFor, items: mod.M2_NATIVE_RPM_COURSE_ITEMS,
    committedFile,
    restore(file) { fs.writeFileSync(path.join(root, file), local.get(file)); },
    close() { fs.rmSync(root, { recursive: true, force: true }); } };
}

async function registerTests() {
  const f = await prepareCourseFixture(), bind = f.mod.bindReviewedM2NativeRpmCourse;
  const {buildReviewedSourceBinding, reviewedSourceBindingPath} = await import(pathToFileURL(
    path.join(path.dirname(MODULE), 'reviewed-source-binding.mjs')).href);
  test.after(() => f.close());
  for (const expression of ['window.constructor.constructor', 'console.log.constructor']) {
    test(`source VM rejects host constructor through ${expression}`, () => {
      assert.throws(() => bank(Buffer.from('window.questionBank = [{ escaped: typeof ' + expression +
        '("return process")() === "object" }];')), /M2_NATIVE_RPM_COURSE:SOURCE_BANK_REQUIRED/);
      assert.deepEqual(bank(Buffer.from('console.log("fixture"); window.questionBank = [{ ordinal: 1 }];')), [{ ordinal: 1 }]);
    });
  }
  const item = f.items[0], fresh = () => f.caseFor(item);
  const refused = (label, change, error = /M2_NATIVE_RPM_COURSE:/) => test(label, () => {
    const c = fresh(); change(c);
    assert.throws(() => bind(c), error);
  });
  test('absent opt-in preserves ordinary behavior and returns no fields', () => {
    assert.equal(bind({ patch: {} }), null);
    assert.equal(bind({ patch: { targetParentRef: {} } }), null);
  });
  for (const x of f.items) test(`immutable cohort ${x.questionUid.slice(-10)} carries only courseKey`, () => {
    const c = f.caseFor(x), before = hash({ request: c.request, patch: c.patch, row: c.row, metadata: c.metadata, question: c.question });
    const result = bind(c);
    assert.deepEqual(result.fields, { courseKey: 'M2-2' });
    assert.equal(result.proof.nativeItemSha256, x.nativeItemSha256);
    assert.equal(result.proof.rpmRecordSha256, x.rpmRecordSha256);
    assert.deepEqual(result.proof.transportedFields, ['courseKey']);
    assert.equal(result.proof.ordinaryParentValidationRequired, true);
    assert.equal(result.proof.crosswalkClassificationGranted, false);
    assert.equal(result.proof.newMathematicalQa, false);
    assert.equal(hash({ request: c.request, patch: c.patch, row: c.row, metadata: c.metadata, question: c.question }), before);
  });
  test('all three original RPM categories retain the same course-only contract', () => {
    const counts = {};
    for (const x of f.items) { const result = bind(f.caseFor(x)); const status = result.proof.originalRpmMappingStatus;
      counts[status] = (counts[status] || 0) + 1; assert.equal(result.proof.classificationAuthority, 'ORIGINAL_NATIVE_AFTER_AND_CURRENT_ACTIVE_TUPLE'); }
    assert.deepEqual(counts, { DIRECT_ACTIVE: 16, DIRECT_BINDING_GAP: 2, RPM_ONLY: 3 });
  });
  for (const value of [null, undefined, {}, [], 'M2-2']) refused(`reject malformed own carrier ${String(value)}`,
    c => { c.patch.targetParentRef.nativeRpmCourseTransport = value; });
  refused('reject unknown carrier field', c => { c.patch.targetParentRef.nativeRpmCourseTransport.approve = true; });
  refused('reject foreign cohort UID', c => { c.patch.questionUid = 'qid_v1_' + '0'.repeat(64); });
  refused('reject wrong ordinal', c => { c.patch.sourceOrdinal++; });
  refused('reject foreign source profile', c => { c.request.sourceArchiveFile = c.request.sourceArchiveFile.replace('/m2/', '/m3/'); });
  refused('reject wrong bank denominator', c => { c.request.expectedQuestionCount--; });
  refused('reject FULL_EXAM', c => { c.request.scope = 'FULL_EXAM'; });
  refused('reject BASIC approval', c => { c.request.approval.type = 'BASIC'; });
  refused('reject metadataReviewed false', c => { c.request.approval.metadataReviewed = false; });
  refused('reject registrationMode even null', c => { c.request.registrationMode = null; });
  refused('reject sourceRebind even null', c => { c.request.approval.sourceRebind = null; });
  refused('reject registry mutation', c => { c.request.registryChanges = [{}]; });
  refused('reject missing registryChanges closed empty list', c => { delete c.request.registryChanges; });
  for (const key of ['rebind', 'typeHold', 'basicScopeParentRef', 'semanticBinding', 'approvedMetadataRef'])
    refused(`reject mixed patch ${key}`, c => { c.patch[key] = null; });
  for (const key of ['nativeSourceReview', 'finalizedParent', 'unrecognized'])
    refused(`reject mixed target ${key}`, c => { c.patch.targetParentRef[key] = {}; });
  for (const value of [null, 'M2-1', undefined]) refused(`reject course after ${String(value)}`, c => { c.patch.after.courseKey = value; });
  refused('reject missing after course', c => { delete c.patch.after.courseKey; });
  refused('reject final course conflict', c => { c.final.courseKey = 'M2-1'; });
  refused('reject accepted already contains own course null', c => { c.accepted.courseKey = null; });
  refused('reject sourceFingerprint omitted', c => { delete c.patch.after.sourceFingerprint; });
  refused('reject sourceFingerprint final mismatch', c => { c.final.sourceFingerprint = '0'.repeat(64); });
  refused('reject resealed but noncurrent sourceFingerprint', c => { c.patch.after.sourceFingerprint = c.final.sourceFingerprint = '0'.repeat(64); },
    /M2_NATIVE_RPM_COURSE:CURRENT_SOURCE_FINGERPRINT_AFTER_REQUIRED/);
  refused('reject after curriculum', c => { c.patch.after.curriculum = '2022'; });
  refused('reject after standard course', c => { c.patch.after.standardCourse = '중3 수학'; });
  refused('reject before course own absent', c => { delete c.patch.before.courseKey; });
  refused('reject before course nonnull', c => { c.patch.before.courseKey = 'M2-2'; });
  for (const key of ['courseKey', 'curriculum', 'curriculumKey']) for (const value of [null, 'M3-2'])
    refused(`reject initial metadata ${key}=${String(value)}`, c => { c.metadata[key] = value; });
  refused('reject initial metadata course already populated', c => { c.metadata.courseKey = 'M2-2'; });
  for (const key of ['grade', 'gradeKey', 'courseSemester', 'semester'])
    refused(`reject conflicting metadata alias ${key}`, c => { c.metadata[key] = null; });
  refused('reject before current curriculum mismatch', c => { c.patch.before.curriculum = '2015'; });
  test('existing exact curriculum presence is recorded, never guessed', () => {
    const c = fresh(); c.metadata.curriculum = '2015'; c.patch.before.curriculum = '2015';
    const proof = bind(c).proof;
    assert.deepEqual(proof.metadataBeforeScopePresence.curriculum, { present: true, valueSha256: hash('2015') });
    assert.deepEqual(proof.metadataBeforeScopePresence.curriculumKey, { present: false });
  });
  test('verified issued proof replays original absence reconstructed as own null', () => {
    const c = fresh(), proof = bind(c).proof;
    c.metadata.courseKey = null; c.metadata.curriculum = null; c.metadata.curriculumKey = null; c.issuedProof = proof;
    assert.deepEqual(bind(c).proof, proof);
  });
  // This bounded receipt fixture models the *official post-write* view: the
  // registrar adds curriculumKey and FINAL_QA/ACTIVE, then cold replay overlays
  // patch.before. It deliberately retains the old empty PT/TPL in that view.
  // The separate real-v2 bounded integration uses unchanged public requests;
  // these tests mutate just one condition at a time without global generation.
  let issuedSequence = 0;
  function issuedView(item = f.items[0]) {
    const c = f.caseFor(item);
    c.request.schemaVersion = 'archive-reviewed-exam-meta-register-request-v2';
    c.request.requestId = `course-issued-view-${++issuedSequence}`;
    c.metadata.sourceArchiveFile = item.sourceArchiveFile;
    for (const [key, value] of Object.entries({problemTypeKey: '', templateKey: '', rpmPrimaryPath: null,
      sourceFingerprint: hash(['original-source', item.questionUid]), contentFingerprint: hash(['original-content', item.questionUid])})) {
      c.metadata[key] = value; c.patch.before[key] = value;
    }
    c.patch.after.contentFingerprint = hash(c.question);
    c.final = {...c.metadata, ...c.patch.after};
    c.request.items = [c.patch];
    const proof = bind(c).proof;
    const receiptPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${c.request.requestId}.json`;
    const sidecarPath = reviewedSourceBindingPath(c.request.requestId);
    Object.assign(c.final, {curriculumKey: '2015', metadataApprovalType: 'FINAL_QA', metaFoundationStatus: 'ACTIVE',
      metadataRevision: `meta-foundation:issued-test@1:exam-final_qa-v2:${c.request.requestId}`,
      approvalEvidence: [receiptPath, sidecarPath]});
    c.metadata = {...c.final, ...c.patch.before}; c.issuedProof = clone(proof);
    const repair = {questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      metadataBefore: {sourceFingerprint: c.patch.before.sourceFingerprint, contentFingerprint: c.patch.before.contentFingerprint},
      after: {sourceFingerprint: c.final.sourceFingerprint, contentFingerprint: c.final.contentFingerprint},
      sourceReview: {schemaVersion: 'archive-reviewed-source-reassessment-v1', questionUid: item.questionUid,
        sourceOrdinal: item.sourceOrdinal, nativeRpmCourseTransport: clone(proof)}};
    const receipt = {schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: c.request.requestId,
      requestSha256: hash(c.request), sourceArchiveFile: item.sourceArchiveFile, sourceBlobSha1: c.request.expectedSourceBlobSha1,
      sourceRawSha256: proof.currentSource.sha256, approval: clone(c.request.approval), scope: 'PARTIAL_UIDS',
      expectedQuestionCount: item.expectedQuestionCount, partialUidCount: 1, totalQuestions: 1,
      metadataRegistrationStatus: 'REGISTERED', registryChanges: [], appliedRecords: [clone(c.final)],
      fingerprintRepairs: [repair], nativeParentBindings: []};
    const write = (file, bytes) => { fs.mkdirSync(path.dirname(path.join(f.root, file)), {recursive: true});
      fs.writeFileSync(path.join(f.root, file), bytes); };
    const writeReceipt = () => write(receiptPath, JSON.stringify(receipt) + '\n');
    function seal() {
      const sidecar = buildReviewedSourceBinding({...receipt, request: c.request});
      const bytes = Buffer.from(JSON.stringify(sidecar) + '\n');
      write(sidecarPath, bytes); receipt.outputDigests = [{path: sidecarPath, sha256: sha(bytes)}]; writeReceipt();
    }
    seal();
    return {c, proof, receipt, repair, receiptPath, sidecarPath, write, writeReceipt, seal};
  }
  for (const item of f.items) test(`issued registrar before-view ${item.questionUid.slice(-10)} preserves exact original course proof`, () => {
    const x = issuedView(item), before = hash({request: x.c.request, metadata: x.c.metadata, final: x.c.final, receipt: x.receipt});
    assert.equal(x.c.metadata.curriculumKey, '2015');
    assert.equal(Object.hasOwn(x.c.patch.before, 'curriculumKey'), false);
    assert.equal(x.c.metadata.problemTypeKey, '');
    assert.equal(x.c.metadata.metadataApprovalType, 'FINAL_QA');
    assert.deepEqual(bind(x.c).proof, x.proof);
    assert.equal(hash({request: x.c.request, metadata: x.c.metadata, final: x.c.final, receipt: x.receipt}), before);
  });
  const issuedRefused = (label, change, error = /M2_NATIVE_RPM_COURSE:/) => test(label, () => {
    const x = issuedView(); change(x); assert.throws(() => bind(x.c), error);
  });
  issuedRefused('issued view rejects missing helper proof', x => { delete x.c.issuedProof; });
  issuedRefused('issued view rejects null helper proof', x => { x.c.issuedProof = null; });
  issuedRefused('issued view rejects missing receipt', x => { fs.unlinkSync(path.join(f.root, x.receiptPath)); });
  issuedRefused('issued view rejects missing typed sidecar', x => { fs.unlinkSync(path.join(f.root, x.sidecarPath)); });
  issuedRefused('issued view rejects sidecar bytes changed without digest', x => { fs.appendFileSync(path.join(f.root, x.sidecarPath), ' '); });
  issuedRefused('issued view rejects missing receipt typed course proof', x => { delete x.repair.sourceReview.nativeRpmCourseTransport; x.writeReceipt(); });
  issuedRefused('issued view rejects altered receipt typed course proof', x => {
    x.repair.sourceReview.nativeRpmCourseTransport.courseCarrierSha256 = '0'.repeat(64); x.seal();
  });
  issuedRefused('issued view rejects receipt request digest mismatch', x => { x.receipt.requestSha256 = '0'.repeat(64); x.writeReceipt(); });
  issuedRefused('issued view rejects another selected record', x => {
    x.receipt.appliedRecords[0].questionUid = f.items[1].questionUid; x.writeReceipt();
  });
  issuedRefused('issued view rejects receipt source blob mismatch', x => { x.receipt.sourceBlobSha1 = '0'.repeat(40); x.writeReceipt(); });
  issuedRefused('issued view rejects receipt raw source mismatch', x => { x.receipt.sourceRawSha256 = '0'.repeat(64); x.writeReceipt(); });
  issuedRefused('issued view rejects changed original fingerprint before', x => {
    x.repair.metadataBefore.contentFingerprint = '0'.repeat(64); x.seal();
  });
  issuedRefused('issued view rejects changed issued fingerprint after', x => {
    x.repair.after.contentFingerprint = '0'.repeat(64); x.seal();
  });
  issuedRefused('issued view rejects reconstructed metadata changed outside patch.before', x => { x.c.metadata.testOnlyExtra = true; });
  issuedRefused('issued view rejects reconstructed original PT changed', x => { x.c.metadata.problemTypeKey = 'PT_FOREIGN'; });
  issuedRefused('issued view rejects different request member', x => { x.c.request.items = []; });
  for (const value of [null, '2022', undefined]) issuedRefused(`issued view rejects final derived curriculum ${String(value)}`, x => {
    x.c.final.curriculumKey = value; x.c.metadata.curriculumKey = value;
    x.receipt.appliedRecords = [clone(x.c.final)]; x.seal();
  });
  for (const key of ['metadataApprovalType', 'metaFoundationStatus', 'metadataRevision'])
    issuedRefused(`issued view rejects missing registrar marker ${key}`, x => {
      delete x.c.final[key]; delete x.c.metadata[key]; x.receipt.appliedRecords = [clone(x.c.final)]; x.seal();
    });
  issuedRefused('issued view rejects removed sidecar provenance even when receipt matches', x => {
    x.c.final.approvalEvidence = [x.receiptPath]; x.c.metadata.approvalEvidence = [x.receiptPath];
    x.receipt.appliedRecords = [clone(x.c.final)]; x.seal();
  });
  issuedRefused('issued view rejects re-sealed explicit alias after instead of registrar-only derivation', x => {
    x.c.patch.after.curriculumKey = '2015'; x.receipt.requestSha256 = hash(x.c.request); x.seal();
  });
  issuedRefused('issued view rejects re-sealed explicit alias before conflict', x => {
    x.c.patch.before.curriculumKey = '2015'; x.receipt.requestSha256 = hash(x.c.request); x.seal();
  });
  for (const key of ['problemTypeKey', 'templateKey', 'rpmPrimaryPath'])
    issuedRefused(`issued view rejects re-sealed final Native ${key} conflict`, x => {
      x.c.final[key] = null; x.c.metadata = {...x.c.final, ...x.c.patch.before};
      x.receipt.appliedRecords = [clone(x.c.final)]; x.seal();
    }, /M2_NATIVE_RPM_COURSE:ORIGINAL_NATIVE_AFTER_AUTHORITY_REQUIRED/);
  issuedRefused('issued view still rejects current canonical after disagreement', x => {
    x.c.canonicalAfter = clone(x.c.canonicalAfter); x.c.canonicalAfter.bindings = new Map();
  }, /M2_NATIVE_RPM_COURSE:CURRENT_ACTIVE_TUPLE_OR_OWNER_CONFLICT/);
  issuedRefused('issued view still rejects current owner scope withdrawal', x => {
    for (const pack of x.c.canonicalBefore.packs.values()) pack.meta.standardCourses = [];
  }, /M2_NATIVE_RPM_COURSE:CURRENT_ACTIVE_TUPLE_OR_OWNER_CONFLICT/);
  function displayRequestView(x, keys) {
    const schemas = {m2ProblemRenderer21Continuity: 'archive-reviewed-m2-problem21-continuity-v1',
      e023SolutionDisplayContinuity: 'archive-m2-e023-solution-display6-continuity-v1',
      e017RhsContinuity: 'archive-m2-e017-existing-rhs-solution-continuity-v1', unknownDisplay: 'unknown'};
    const raw = clone(x.c.patch);
    for (const key of keys) {
      raw.sourceReview[key] = {schemaVersion: schemas[key], reviewCommit: NATIVE,
        reviewRef: {path: raw.sourceReview.reviewRef.path, sha256: raw.sourceReview.reviewRef.sha256}};
      x.repair.sourceReview[key] = {originalSourceReviewSha256: hash(['typed-comparison-view', key])};
    }
    x.c.request.items = [raw]; x.receipt.requestSha256 = hash(x.c.request); x.seal();
  }
  for (const [label, item, keys] of [
    ['E017 public option', f.items[0], ['m2ProblemRenderer21Continuity']],
    ['E017 existing RHS option', f.items.find(x => x.reviewPath.includes('/E017/') && x.sourceOrdinal === 2), ['e017RhsContinuity']],
    ['E023 disjoint options', f.items.find(x => x.reviewPath.includes('/E023/')), ['m2ProblemRenderer21Continuity', 'e023SolutionDisplayContinuity']],
  ]) test(`issued request comparison permits only central named removal: ${label}`, () => {
    const x = issuedView(item); displayRequestView(x, keys);
    assert.deepEqual(bind(x.c).proof, x.proof);
    assert.deepEqual(keys.filter(key => Object.hasOwn(x.c.patch.sourceReview, key)), []);
    assert.deepEqual(keys.filter(key => Object.hasOwn(x.c.request.items[0].sourceReview, key)), keys);
  });
  for (const key of ['unknownDisplay', 'e023SolutionDisplayContinuity', 'e017RhsContinuity'])
    issuedRefused(`issued request comparison rejects foreign option removal ${key}`, x => { displayRequestView(x, [key]); },
      /M2_NATIVE_RPM_COURSE:ISSUED_METADATA_REQUEST_VIEW_MISMATCH/);
  issuedRefused('issued request comparison rejects null removed option', x => {
    displayRequestView(x, ['m2ProblemRenderer21Continuity']);
    x.c.request.items[0].sourceReview.m2ProblemRenderer21Continuity = null;
    x.receipt.requestSha256 = hash(x.c.request); x.seal();
  });
  issuedRefused('issued request comparison rejects removed option without its issued typed proof', x => {
    displayRequestView(x, ['m2ProblemRenderer21Continuity']);
    delete x.repair.sourceReview.m2ProblemRenderer21Continuity; x.writeReceipt();
  });
  issuedRefused('issued request comparison rejects another changed after field', x => {
    displayRequestView(x, ['m2ProblemRenderer21Continuity']); x.c.patch.after.standardUnitKey = 'M2-FOREIGN';
  });
  issuedRefused('issued request comparison rejects another changed base sourceReview field', x => {
    displayRequestView(x, ['m2ProblemRenderer21Continuity']); x.c.patch.sourceReview.reviewCommit = BASE;
  });
  test('unrelated pack version and count advances keep current strict scope validation and issued course proof', () => {
    const c = fresh(), proof = bind(c).proof;
    c.issuedProof = proof; c.metadata.courseKey = null;
    for (const pack of c.canonicalBefore.packs.values()) { pack.meta.packVersion = '99.0.1'; pack.meta.bindingCount += 1; }
    // before/after are the same current context, as in replay with no registry changes.
    assert.deepEqual(bind(c).proof, proof);
    c.canonicalBefore.packs.get(proof.canonical.ownerPack).meta.standardCourses = [];
    assert.throws(() => bind(c), /M2_NATIVE_RPM_COURSE:CURRENT_ACTIVE_TUPLE_OR_OWNER_CONFLICT/);
  });
  for (const kind of ['deleted', 'null', 'wrong-uid', 'missing-presence', 'wrong-presence', 'extra-field', 'wrong-carrier-hash'])
    test(`reject issued replay proof ${kind}`, () => {
      const c = fresh(); c.issuedProof = bind(c).proof; c.metadata.courseKey = null;
      if (kind === 'deleted') delete c.issuedProof;
      if (kind === 'null') c.issuedProof = null;
      if (kind === 'wrong-uid') c.issuedProof.questionUid = f.items[1].questionUid;
      if (kind === 'missing-presence') delete c.issuedProof.metadataBeforeScopePresence;
      if (kind === 'wrong-presence') c.issuedProof.metadataBeforeScopePresence.courseKey = { present: true, valueSha256: hash('M2-2') };
      if (kind === 'extra-field') c.issuedProof.extra = true;
      if (kind === 'wrong-carrier-hash') c.issuedProof.courseCarrierSha256 = '0'.repeat(64);
      assert.throws(() => bind(c), /M2_NATIVE_RPM_COURSE:/);
    });
  for (const key of ['problemTypeKey', 'templateKey', 'rpmL1', 'rpmL2', 'rpmPrimaryPath'])
    refused(`reject unapproved native after ${key}`, c => { c.patch.after[key] = null; });
  refused('reject original item row mutation', c => { c.row.before.courseKey = null; });
  refused('reject wrong Native review commit', c => { c.patch.sourceReview.reviewCommit = BASE; });
  refused('reject Native review path alias', c => { c.patch.sourceReview.reviewPath = './' + c.patch.sourceReview.reviewPath; });
  refused('reject missing current RPM approval evidence', c => { c.request.approval.evidenceRefs = c.request.approval.evidenceRefs.filter(r => r.path !== RPM); });
  refused('reject missing master item evidence', c => { c.patch.evidenceRefs = c.patch.evidenceRefs.filter(r => r.path !== MASTER); });
  refused('reject historical and current same-path evidence collision', c => { c.patch.evidenceRefs.push({ path: RPM, sha256: f.originalRef.sha256 }); });
  refused('reject duplicate evidence binding', c => { c.patch.evidenceRefs.push(clone(c.patch.sourceReview.reviewRef)); });
  refused('reject altered Native hash even if both evidence lists updated', c => {
    c.patch.sourceReview.reviewRef.sha256 = '0'.repeat(64); c.request.approval.evidenceRefs[0].sha256 = '0'.repeat(64); c.patch.evidenceRefs[0].sha256 = '0'.repeat(64);
  });
  for (const key of ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes']) {
    refused(`reject changed original RPM ${key}`, c => { c.patch.targetParentRef.nativeRpmCourseTransport.nativeRpmRef[key] = key === 'bytes' ? 1 : 'wrong'; });
    refused(`reject changed current RPM ${key}`, c => { c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef[key] = key === 'bytes' ? 1 : 'wrong'; });
  }
  refused('reject unknown current RPM ref key', c => { c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef.extra = true; });
  refused('reject current RPM unsafe path', c => { c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef.path = '../middle2.json'; });
  refused('reject current RPM noncommit object', c => { c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef.commit = f.currentRef.gitBlobSha1; });
  refused('reject foreign current RPM file by exact ref', c => { c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef = {
    ...f.currentRef, path: MASTER, sha256: f.masterRef.sha256, bytes: f.local.get(MASTER).length, gitBlobSha1: oid(f.local.get(MASTER)) }; });
  for (const change of ['target-row', 'duplicate-row', 'missing-row', 'grade', 'schema']) test(`reject fully resealed immutable current RPM ${change}`, () => {
    const c = fresh(), doc = json(f.local.get(RPM)), row = doc.records.find(x => x.id === item.rpmRecordId);
    if (change === 'target-row') row.scope = 'M2-1';
    if (change === 'duplicate-row') doc.records.push(clone(row));
    if (change === 'missing-row') doc.records = doc.records.filter(x => x.id !== item.rpmRecordId);
    if (change === 'grade') doc.grade = 'M3';
    if (change === 'schema') doc.schemaVersion = 'foreign-crosswalk-v1';
    const bytes = Buffer.from(JSON.stringify(doc)), ref = f.committedFile(RPM, bytes);
    c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef = ref;
    for (const refs of [c.patch.evidenceRefs, c.request.approval.evidenceRefs]) for (const r of refs) if (r.path === RPM) r.sha256 = ref.sha256;
    fs.writeFileSync(path.join(f.root, RPM), bytes);
    try { assert.throws(() => bind(c), /M2_NATIVE_RPM_COURSE:EXACT_UNCHANGED_NATIVE_RPM_ROW_REQUIRED/); } finally { f.restore(RPM); }
  });
  test('an exact later RPM file may change an unrelated row while the target remains immutable', () => {
    const c = fresh(), doc = json(f.local.get(RPM));
    doc.records.find(x => x.id !== item.rpmRecordId).testOnlyUnrelatedRow = true;
    const bytes = Buffer.from(JSON.stringify(doc)), ref = f.committedFile(RPM, bytes);
    c.patch.targetParentRef.nativeRpmCourseTransport.currentRpmRef = ref;
    for (const refs of [c.patch.evidenceRefs, c.request.approval.evidenceRefs]) for (const r of refs) if (r.path === RPM) r.sha256 = ref.sha256;
    fs.writeFileSync(path.join(f.root, RPM), bytes);
    try { const result = bind(c); assert.deepEqual(result.fields, { courseKey: 'M2-2' });
      assert.equal(result.proof.rpmRecordSha256, item.rpmRecordSha256); } finally { f.restore(RPM); }
  });
  for (const key of ['scope', 'curriculum', 'majorUnit', 'midUnit', 'path'])
    refused(`reject foreign ordinary parent ${key}`, c => { c.patch.targetParentRef[key] = 'foreign'; });
  test('existing ordinary crosswalk ref remains exact and does not grant new fields', () => {
    const c = fresh(); c.patch.targetParentRef.crosswalkRef = { path: RPM, sha256: f.currentRef.sha256, recordId: item.rpmRecordId };
    assert.deepEqual(bind(c).fields, { courseKey: 'M2-2' });
  });
  refused('reject ordinary crosswalk disagreement', c => { c.patch.targetParentRef.crosswalkRef = { path: RPM, sha256: f.currentRef.sha256, recordId: f.items[1].rpmRecordId }; });
  for (const place of ['question', 'committedQuestion']) for (const value of [null, 'M2-1', 'M2-2'])
    refused(`reject ${place} own course ${String(value)}`, c => { c[place].courseKey = value; });
  for (const key of ['grade', 'gradeKey', 'courseSemester', 'semester', 'curriculumKey', 'standardCourse'])
    refused(`reject current source alias ${key}`, c => { c.question[key] = null; });
  refused('reject substituted native source bank', c => { c.native.reviewedBank.pop(); });
  refused('reject changed native source reference', c => { c.native.sourceBlob = '0'.repeat(40); });
  refused('reject after source blob mismatch', c => { c.request.expectedSourceBlobSha1 = '0'.repeat(40); });
  refused('reject approved prior primary conflict', c => { c.metadata.metadataApprovalType = 'FINAL_QA'; c.metadata.problemTypeKey = 'PT_FOREIGN'; });
  for (const map of ['bindings', 'pt', 'tpl', 'packs', 'master']) refused(`reject missing canonical ${map}`, c => { c.canonicalBefore[map] = new Map(); });
  for (const map of ['bindings', 'pt', 'tpl', 'packs', 'master']) refused(`reject changed canonical after ${map}`, c => { c.canonicalAfter = clone(c.canonicalAfter); c.canonicalAfter[map] = new Map(); });
  refused('reject inactive canonical binding', c => { c.canonicalBefore = clone(c.canonicalBefore);
    c.canonicalBefore.bindings.get(stable(['2015', '중2 수학', c.final.standardUnitKey, c.final.subUnitKey, c.final.problemTypeKey])).status = 'HOLD'; });
  refused('reject inactive canonical template', c => { c.canonicalBefore.tpl.get(c.final.templateKey).status = 'HOLD'; });
  refused('reject template owned by unrelated PT', c => { c.canonicalBefore.tpl.get(c.final.templateKey).parentProblemTypeKey = 'PT_OTHER'; });
  refused('reject unit parent mismatch', c => { c.canonicalBefore.master.get(c.final.subUnitKey).parentKey = 'M3-01'; });
  refused('reject unsupported owner course domain', c => { for (const p of c.canonicalBefore.packs.values()) p.meta.standardCourses = []; });
  for (const [label, file, transform] of [
    ['current RPM raw change', RPM, b => Buffer.concat([b, Buffer.from(' ')] )],
    ['native review raw change', item.reviewPath, b => Buffer.concat([b, Buffer.from(' ')] )],
    ['master bytes change', MASTER, b => Buffer.concat([b, Buffer.from(' ')] )],
    ['source course null with resealed after blob', `archive/exams/${item.sourceArchiveFile}`, b => Buffer.from(b.toString() + '\nwindow.questionBank[0].courseKey=null;\n')]
  ]) test(`reject live ${label}`, () => {
    const c = fresh(), changed = transform(f.local.get(file)); fs.writeFileSync(path.join(f.root, file), changed);
    if (label.includes('resealed')) c.request.expectedSourceBlobSha1 = oid(changed);
    try { assert.throws(() => bind(c), /M2_NATIVE_RPM_COURSE:/); } finally { f.restore(file); }
  });
  for (const change of ['duplicate-parent', 'not-selectable', 'missing-leaf']) test(`reject resealed master ${change}`, () => {
    const c = fresh(), master = json(f.local.get(MASTER)), rp = c.row.after.rpmPrimaryPath;
    const parent = master.records.find(x => x.curriculum === '2015' && x.scope === 'M2-2' && x.majorUnit === rp.majorUnit && x.midUnit === rp.midUnit);
    const concept = parent.concepts.find(x => x.concept === rp.l3);
    if (change === 'duplicate-parent') master.records.push(clone(parent));
    if (change === 'not-selectable') concept.problemTypes.find(x => x.problemType === rp.l4).defaultSelectable = false;
    if (change === 'missing-leaf') concept.problemTypes = concept.problemTypes.filter(x => x.problemType !== rp.l4);
    const changed = Buffer.from(JSON.stringify(master)); fs.writeFileSync(path.join(f.root, MASTER), changed);
    c.patch.targetParentRef.sha256 = sha(changed);
    for (const list of [c.patch.evidenceRefs, c.request.approval.evidenceRefs]) for (const r of list) if (r.path === MASTER) r.sha256 = sha(changed);
    try { assert.throws(() => bind(c), /M2_NATIVE_RPM_COURSE:EXACT_SELECTABLE_MASTER_LEAF_REQUIRED/); } finally { f.restore(MASTER); }
  });
  test('reject symlink live evidence even if bytes exact', () => {
    const c = fresh(), file = path.join(f.root, RPM), saved = file + '.saved'; fs.renameSync(file, saved); fs.symlinkSync(saved, file);
    try { assert.throws(() => bind(c), /M2_NATIVE_RPM_COURSE:SYMLINK_PATH/); } finally { fs.unlinkSync(file); fs.renameSync(saved, file); }
  });
}

module.exports = { prepareCourseFixture, BASE, NATIVE };
if (require.main === module) registerTests().catch(error => { console.error(error); process.exitCode = 1; });
