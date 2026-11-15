// Scratch-only request builder. It neither changes source/registries nor calls a writer.
// The official registrar dry-run remains authoritative; this is not an approval tool.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {isDeepStrictEqual as eq} from 'node:util';

const here = path.dirname(fileURLToPath(import.meta.url));
const fail = text => { throw new Error(text); };
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const need = (value, name) => typeof value === 'string' && value.trim() ? value : fail(name + ' required');
const SOURCE_FIELDS = ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','level','L3','L4',
  'problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket'];
const VALUE_FIELDS = new Set([...SOURCE_FIELDS,'sourceFingerprint','contentFingerprint','curriculum','curriculumKey','courseKey','L1','L2',
  'rpmL1','rpmL2','rpmL3','rpmL4','rpmPrimaryPath','rpmSemanticStatus','semanticSourceScope','semanticScopeRelation',
  'primaryMethod','decisiveStep','integrationReason','conceptClusterKey','secondaryConceptKeys','difficultyConfidence',
  'difficultyBoundaryFlag','legacyLevelCompatibility','curriculumApplicability','defaultSelectable']);
const STUDENT_FIELDS = ['id','questionType','content','choices','answer','solution','image','images','figureSvg',
  'solutionImage','solutionFigureSvg','layoutTag','wide'];
const RPM_MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const NATIVE_MASTER = 'archive/data/master_tables/js_archive_tag_master.json';
const SOURCE_ONLY_META = new Set(['category','originalCategory','standardUnitOrder','subUnitConfidence','subUnitClassificationDepth',
  'tagStatus','tagConfidence','reviewStatus','canonicalBindingStatus','runtimeMaterializationStatus',
  'rpmPrimaryRecordId','rpmScope','rpmCrosswalkStatus','rpmCurriculum','metaStatus','metaNullReason','projectionStatus']);

function args(argv) {
  if (argv.includes('--help')) {
    console.log('node build-reviewed-exam-v2-request.mjs --repo-root PATH --input approved-input.json --out .tmp/m1-meta-review/request.json');
    process.exit(0);
  }
  const values = {};
  for (let i=0; i<argv.length; i+=2) {
    if (!['--repo-root','--input','--out'].includes(argv[i]) || !argv[i+1]) fail('unknown/incomplete argument: ' + argv[i]);
    values[argv[i].slice(2)] = argv[i+1];
  }
  return values;
}

const options = args(process.argv.slice(2));
const root = fs.realpathSync(need(options['repo-root'], '--repo-root'));
const safe = rel => {
  if (typeof rel !== 'string' || path.isAbsolute(rel) || rel.split(/[\\/]/).includes('..')) fail('unsafe repo-relative path');
  const full = path.resolve(root, rel);
  if (!full.startsWith(root + path.sep)) fail('outside repository: ' + rel);
  return full;
};
const inputFile = path.resolve(need(options.input, '--input'));
const config = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const output = safe(need(options.out, '--out'));
if (!output.startsWith(path.join(root, '.tmp/m1-meta-review') + path.sep)) fail('scratch-only output required');
if (config.status !== 'READY_FOR_METADATA_REQUEST' || config.reviewScope !== 'METADATA_ONLY_CURRENT_SOURCE' ||
    config.approval?.type !== 'FINAL_QA' || config.approval?.metadataReviewed !== true)
  fail('DRAFT_NOT_APPROVED: explicit metadata-review owner confirmation is required; no inferred R1/R2/R3 approval');
need(config.approval.approvedBy, 'approval.approvedBy');
if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,100}$/.test(config.requestId || '')) fail('invalid immutable requestId');
if (!/^[a-f0-9]{40}$/.test(config.baselineMain || '')) fail('baselineMain full SHA required');
const source = need(config.sourceArchiveFile, 'sourceArchiveFile');
if (/^(archive\/|exams\/)/.test(source) || !/\.js$/.test(source)) fail('sourceArchiveFile must be archive/exams-relative');
const sourcePath = 'archive/exams/' + source;
const bytes = fs.readFileSync(safe(sourcePath));
const baselineBytes = execFileSync('git', ['show', `${config.baselineMain}:${sourcePath}`], {
  cwd: root, env: {...process.env, GIT_NO_LAZY_FETCH:'1'}, timeout:15000, maxBuffer:8*1024*1024
});
if (config.expectedCurrentSourceSha256 && sha(bytes) !== config.expectedCurrentSourceSha256) fail('current source raw SHA drift');
if (config.baselineSourceSha256 && sha(baselineBytes) !== config.baselineSourceSha256) fail('baseline source raw SHA drift');
const sourceBlob = execFileSync('git', ['hash-object','--path',sourcePath,'--stdin'], {
  cwd: root, input:bytes, timeout:15000, encoding:'utf8'
}).trim();
const parseBank = bytes => {
  const context = vm.createContext({window:{}, console:{log(){},warn(){},error(){}}});
  vm.runInContext(bytes.toString('utf8'), context, {timeout:5000});
  return {title:context.window.examTitle, bank:JSON.parse(JSON.stringify(context.window.questionBank || context.window.questions))};
};
const current = parseBank(bytes), baseline = parseBank(baselineBytes);
const count = config.expectedQuestionCount;
if (!Number.isInteger(count) || count < 1 || current.bank.length !== count || baseline.bank.length !== count ||
    config.items?.length !== count) fail('source/baseline/item denominator mismatch');
if (config.examUid !== current.title || current.title !== baseline.title) fail('exam title identity mismatch');
const sourceAllowed = new Set([...VALUE_FIELDS,...(config.permittedSourceOnlyMetadataFields || [])]);
for (const field of config.permittedSourceOnlyMetadataFields || []) if (!SOURCE_ONLY_META.has(field)) fail('unknown source-only metadata field: ' + field);
const payloadRows = [];
for (let i=0; i<count; i++) {
  const old = baseline.bank[i], next = current.bank[i];
  const protectedValue = value => Object.fromEntries(Object.entries(value).filter(([field]) => !sourceAllowed.has(field)));
  if (!eq(protectedValue(old), protectedValue(next))) fail('student/non-metadata payload changed: ordinal ' + (i+1));
  const studentValue = value => Object.fromEntries(STUDENT_FIELDS.map(field => [field,Object.hasOwn(value,field)?value[field]:null]));
  if (!eq(studentValue(old), studentValue(next))) fail('student payload changed: ordinal ' + (i+1));
  payloadRows.push({sourceOrdinal:i+1,studentPayloadSha256:sha(stable(studentValue(next))),
    nonMetadataPayloadSha256:sha(stable(protectedValue(next)))});
}
const projections = JSON.parse(execFileSync('python3',[path.join(here,'extract-reviewed-exam-projections.py'),root,source,String(count)],
  {timeout:120000,maxBuffer:8*1024*1024}));
for (const name of ['metadata','identity']) {
  const expected = config.expectedProjectionBlobs?.[name];
  if (expected && projections[name+'Snapshot'].blobSha1 !== expected) fail(name + ' projection snapshot drift');
}
const reference = value => {
  const rel = typeof value === 'string' ? value : value?.path;
  const bytes = fs.readFileSync(safe(need(rel,'evidence path')));
  if (rel.startsWith('.tmp/')) fail('durable repo evidence required: ' + rel);
  const actual = sha(bytes);
  if (typeof value === 'object' && value.sha256 && value.sha256 !== actual) fail('evidence SHA mismatch: ' + rel);
  return {path:rel,sha256:actual};
};
const references = values => {
  if (!Array.isArray(values) || !values.length) fail('nonempty evidenceRefs required');
  return [...new Map(values.map(reference).map(ref => [ref.path,ref])).values()];
};
const rootRefs = references(config.approval.evidenceRefs);
const registryChanges = (config.registryChanges || []).map(change => {
  // Same-exam spelling repair only. The official v2 registrar still checks every
  // out-of-scope approved consumer; this builder cannot waive that guard.
  if (change.path === 'archive/data/meta-foundation/canonical/packs/middle1/bindings.json' &&
      change.collection === 'bindings' && change.before !== null) {
    const before = change.before, after = change.after;
    const keys = ['curriculum','standardUnitKey','subUnitKey','problemTypeKey','ownerPack'];
    const targetUids = new Set(config.items.map(item => item.questionUid));
    const rows = JSON.parse(fs.readFileSync(safe(change.path),'utf8')).bindings;
    if (!before || before.status !== 'ACTIVE' || before.ownerPack !== 'MIDDLE1' ||
        before.curriculum !== '2022' || before.standardCourse !== '中1 수학' ||
        !eq(after,{...before,standardCourse:'중1 수학'}) ||
        !eq(Object.keys(change.match || {}).sort(),[...keys].sort()) ||
        !keys.every(key => change.match[key] === before[key]))
      fail('same-exam binding repair may only correct the exact MIDDLE1 course spelling');
    const matched = rows.filter(row => keys.every(key => row[key] === change.match[key]));
    if (matched.length !== 1 || !eq(matched[0],before) ||
        !Array.isArray(before.supportingQuestionUids) || !before.supportingQuestionUids.length ||
        !before.supportingQuestionUids.every(uid => targetUids.has(uid)))
      fail('binding spelling repair has ambiguous before state or supporting UID outside this exam');
    const tupleKeys = ['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'];
    if (rows.some(row => tupleKeys.every(key => row[key] === after[key])))
      fail('correctly spelled binding already exists; do not create a duplicate');
    return {...change,evidenceRefs:references(change.evidenceRefs)};
  }
  // This reviewed course alias is required for exact M1-1 RPM parent references.
  // All other pack fields, including version and ownership, remain unchanged.
  if (!change.collection && [
    'archive/data/meta-foundation/canonical/packs/middle1/pack.json',
    'archive/data/meta-foundation/canonical/packs/functions-graphs/pack.json'
  ].includes(change.path)) {
    const current = JSON.parse(fs.readFileSync(safe(change.path),'utf8'));
    const before = change.before, after = change.after;
    if (!eq(current,before) || !before || !after) fail('whole-pack exact before mismatch');
    if (!Array.isArray(before.standardCourses) || before.standardCourses.includes('M1-1') ||
      !eq(after,{...before,standardCourses:[...before.standardCourses,'M1-1']}))
      fail('reviewed pack scope must only append the M1-1 alias');
    return {...change,evidenceRefs:references(change.evidenceRefs)};
  }
  // The one approved integration repair extends this existing pack's scope only.
  // Keep its version/ownership/definitions intact; the official compiler owns bumps.
  if (!change.collection && change.path==='archive/data/meta-foundation/canonical/packs/middle-geometry/pack.json') {
    const current = JSON.parse(fs.readFileSync(safe(change.path),'utf8'));
    const before = change.before, after = change.after;
    if (!eq(current,before) || !before || !after) fail('whole-pack exact before mismatch');
    for (const field of new Set([...Object.keys(before),...Object.keys(after)]))
      if (!['curricula','standardCourses'].includes(field) && !eq(before[field],after[field])) fail('pack scope repair may not change '+field);
    for (const [field, additions] of [['curricula',['2022']],['standardCourses',['중1 수학','M1-2']]]) {
      if (!Array.isArray(before[field]) || !Array.isArray(after[field]) ||
        !eq(after[field], [...before[field],...additions.filter(value=>!before[field].includes(value))]))
        fail('pack scope must use the precise reviewed append: '+field);
    }
    return {...change,evidenceRefs:references(change.evidenceRefs)};
  }
  if (change.before !== null || !change.after || !change.collection || !change.match)
    fail('this skeleton only builds add-only registry rows with explicit before:null');
  const doc = JSON.parse(fs.readFileSync(safe(change.path),'utf8'));
  const rows = change.collection === '$' ? doc : doc[change.collection];
  if (!Array.isArray(rows)) fail('registry collection missing: ' + change.path);
  if (rows.some(row => Object.entries(change.match).every(([key,value]) => eq(row[key],value))))
    fail('registry key appeared concurrently; re-review existing row: ' + JSON.stringify(change.match));
  if (!Object.entries(change.match).every(([key,value]) => eq(change.after[key],value))) fail('registry match/after identity differs');
  return {...change,evidenceRefs:references(change.evidenceRefs)};
});
const read = rel => JSON.parse(fs.readFileSync(safe(rel),'utf8'));
const require = createRequire(import.meta.url);
const middleToc = require(safe('archive/rpm-middle-toc.js'));
const parentEvidence = [];
const items = [], seen = new Set();
const byOrdinal = new Map(config.items.map(item => [Number(item.sourceOrdinal), item]));
if (byOrdinal.size !== count) fail('duplicate item ordinals');
for (let ordinal=1; ordinal<=count; ordinal++) {
  const decision = byOrdinal.get(ordinal) || fail('missing ordinal ' + ordinal);
  const question = current.bank[ordinal-1];
  const metas = projections.metadata.filter(row => Number(row.sourceOrdinal)===ordinal);
  const ids = projections.identity.filter(row => Number(row.sourceOrdinal)===ordinal);
  if (metas.length !== 1 || ids.length !== 1) fail('ambiguous source ordinal ' + ordinal);
  const row = metas[0], identity = ids[0];
  if (row.questionUid !== identity.questionUid || decision.questionUid !== row.questionUid || seen.has(row.questionUid)) fail('UID/ordinal identity mismatch');
  seen.add(row.questionUid);
  const after = {};
  if (decision.preserveCurrentSourceMetadata === true) {
    for (const field of VALUE_FIELDS) if (Object.hasOwn(question,field) && !['sourceFingerprint','contentFingerprint'].includes(field)) after[field] = question[field];
  }
  for (const [field,value] of Object.entries(decision.after || {})) {
    if (!VALUE_FIELDS.has(field)) fail('unsupported registrar value field: ' + field);
    after[field] = value;
  }
  const sourceFingerprint = sha(JSON.stringify({content:question.content??null,choices:Array.isArray(question.choices)?question.choices:null,
    answer:question.answer??null,solution:question.solution??null,image:question.image??null}));
  const contentFingerprint = sha(JSON.stringify({content:question.content??null,choices:Array.isArray(question.choices)?question.choices:null,image:question.image??null}));
  after.sourceFingerprint = sourceFingerprint;
  after.contentFingerprint = contentFingerprint;
  if (decision.rpmEvidenceDebt) {
    need(decision.rpmEvidenceDebt,'RPM evidence debt reason');
    if (decision.crosswalkRecordId || decision.semanticBinding) fail('RPM debt cannot name an exact RPM mapping');
    for (const field of ['rpmPrimaryPath','rpmL1','rpmL2','rpmL3','rpmL4']) after[field] = null;
    after.rpmSemanticStatus = 'HOLD';
    if (question.rpmPrimaryPath != null || question.rpmPrimaryRecordId != null) fail('source must explicitly clear wrong RPM path/id before registration');
  }
  const final = {...row,...after};
  need(final.problemTypeKey,'native PT'); need(final.templateKey,'native TPL');
  need(final.curriculum || final.curriculumKey,'curriculum'); need(final.standardCourse || final.courseKey,'course');
  for (const field of SOURCE_FIELDS) if (Object.hasOwn(question,field) && !eq(question[field]??null,final[field]??null))
    fail('source must be reconciled by its owner before requesting registration: ' + ordinal + '.' + field);
  const patch = {questionUid:row.questionUid,sourceOrdinal:ordinal,
    before:Object.fromEntries([...new Set([...Object.keys(after),'L1','L2','L3','L4'])].map(field=>[field,row[field]??null])),after,
    reason:need(decision.reason,'item reason'),evidenceRefs:references(decision.evidenceRefs)};
  if (identity.sourceFingerprint !== sourceFingerprint) patch.identityBefore = {sourceFingerprint:identity.sourceFingerprint??null};
  if (decision.crosswalkRecordId) {
    const crosswalkPath = need(decision.crosswalkPath,'crosswalkPath');
    const doc = read(crosswalkPath), rows = (doc.records || []).filter(row=>row.id===decision.crosswalkRecordId);
    const cross = rows[0];
    const listedFamily = cross?.mappingStatus==='FAMILY_ACTIVE' &&
      (cross.templateCandidates || []).some(candidate=>candidate.templateKey===final.templateKey);
    if (doc.status !== 'ACTIVE_REFERENCE' || rows.length !== 1 || cross.bindingStatus !== 'ACTIVE' ||
      cross.problemTypeKey !== final.problemTypeKey || cross.templateKey !== final.templateKey && !listedFamily ||
      cross.curriculum !== (final.curriculum || final.curriculumKey) || cross.standardUnitKey !== final.standardUnitKey || cross.subUnitKey !== final.subUnitKey)
      fail('crosswalk is not the exact ACTIVE native mapping: ordinal ' + ordinal);
    if (listedFamily && decision.preserveNativeParentLabels!==true)
      fail('listed FAMILY requires explicit native-label preservation; v2 targetParentRef only accepts a direct TPL row');
    const p = cross.rpmPath || {};
    const basePath = {curriculumKey:cross.curriculum,courseKey:cross.scope,L1:p.majorUnit,L2:p.midUnit,L3:p.l3,L4:p.l4};
    const masterRows = read(RPM_MASTER).records || [];
    if (!masterRows.some(record=>record.curriculum===cross.curriculum && record.scope===cross.scope &&
      record.majorUnit===p.majorUnit && record.midUnit===p.midUnit &&
      (record.concepts || []).some(concept=>concept.concept===p.l3 &&
        (concept.problemTypes || []).some(type=>type.problemType===p.l4)))) fail('crosswalk leaf is not in locked base master');
    const refined = middleToc.refinePath(basePath);
    if (refined.status !== 'EXACT') fail('effective parent cannot be resolved: ordinal ' + ordinal);
    const crossRef = reference(crosswalkPath), masterRef = reference(RPM_MASTER);
    patch.evidenceRefs = references([...patch.evidenceRefs,crossRef,masterRef]);
    if (!listedFamily) patch.targetParentRef = {path:RPM_MASTER,curriculum:cross.curriculum,scope:cross.scope,majorUnit:p.majorUnit,midUnit:p.midUnit,
      crosswalkRef:{...crossRef,recordId:cross.id}};
    parentEvidence.push({sourceOrdinal:ordinal,questionUid:row.questionUid,crosswalkRecordId:cross.id,
      basePath:refined.basePath,effectivePath:refined.effectivePath,parentKey:refined.parentKey,
      nativeLabelAuthority:listedFamily?'DEFAULT_NATIVE_BINDING_AND_MASTER':'LOCKED_BASE_TARGET_PARENT_REF',
      mappingStatus:cross.mappingStatus,selectedTemplateKey:final.templateKey});
  }
  if (Object.hasOwn(decision,'targetParentRef')) {
    // This binds only an existing official parent; it cannot supply an RPM leaf or clear debt.
    if (patch.targetParentRef) fail('direct and generated targetParentRef cannot be combined: ordinal ' + ordinal);
    const ref = decision.targetParentRef;
    const fields = ['path','curriculum','scope','majorUnit','midUnit'];
    if (!ref || typeof ref !== 'object' || Array.isArray(ref) || Object.keys(ref).length !== fields.length ||
      fields.some(field=>!Object.hasOwn(ref,field))) fail('parent-only targetParentRef requires exactly five parent fields');
    for (const field of fields) need(ref[field],'parent-only targetParentRef.' + field);
    if (ref.path !== RPM_MASTER || ref.curriculum !== (final.curriculum || final.curriculumKey) ||
      ref.scope !== need(final.courseKey,'parent-only courseKey')) fail('parent-only curriculum/course/master mismatch: ordinal ' + ordinal);
    const masterRows = read(RPM_MASTER).records || [];
    if (!masterRows.some(record=>record.curriculum===ref.curriculum && record.scope===ref.scope &&
      record.majorUnit===ref.majorUnit && record.midUnit===ref.midUnit)) fail('parent-only target is not in locked base master: ordinal ' + ordinal);
    const nativeRows = read(NATIVE_MASTER);
    if (!Array.isArray(nativeRows)) fail('native unit master must be an array');
    const activeRows = (key,keyType) => nativeRows.filter(record=>record.key===key && record.keyType===keyType &&
      ['active','ACTIVE'].includes(record.status));
    const units = activeRows(final.standardUnitKey,'standardUnitKey');
    const subs = final.subUnitKey ? activeRows(final.subUnitKey,'subUnitKey') : [];
    const compact = value => String(value).normalize('NFC').replace(/\s/g,'');
    if (units.length !== 1 || final.subUnitKey && subs.length !== 1 ||
      ![...units,...subs].some(record=>compact(record.labelKo)===compact(ref.midUnit)))
      fail('parent-only midUnit must match an ACTIVE native unit/subunit label after NFC/whitespace normalization: ordinal ' + ordinal);
    patch.targetParentRef = Object.fromEntries(fields.map(field=>[field,ref[field]]));
    patch.evidenceRefs = references([...patch.evidenceRefs,reference(RPM_MASTER)]);
    parentEvidence.push({sourceOrdinal:ordinal,questionUid:row.questionUid,parentOnly:true,
      targetParentRef:patch.targetParentRef,leafMapping:null,crosswalkRecordId:null,
      nativeLabelAuthority:'ACTIVE_NATIVE_UNIT_OR_SUBUNIT_LABEL',
      rpmEvidenceDebt:decision.rpmEvidenceDebt || null,rpmEvidenceDebtPreserved:Boolean(decision.rpmEvidenceDebt)});
  }
  items.push(patch);
}
const request = {schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:config.requestId,
  examUid:config.examUid,sourceArchiveFile:source,expectedSourceBlobSha1:sourceBlob,expectedQuestionCount:count,
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:config.approval.approvedBy,evidenceRefs:rootRefs},registryChanges,items};
const report = {schemaVersion:'metadata-only-v2-request-build-report-v1',status:'BUILT_NOT_REGISTERED_NOT_VALIDATED',
  reviewScope:config.reviewScope,mathFinalQaPerformed:false,baselineMain:config.baselineMain,
  sourceArchiveFile:source,baselineSourceSha256:sha(baselineBytes),currentSourceSha256:sha(bytes),sourceBlob,
  protectedPayloadIdentical:true,questionCount:count,metadataSnapshot:projections.metadataSnapshot,
  identitySnapshot:projections.identitySnapshot,studentPayloads:payloadRows,parentEvidence,
  rpmEvidenceDebts:config.items.filter(item=>item.rpmEvidenceDebt).map(item=>({sourceOrdinal:item.sourceOrdinal,questionUid:item.questionUid,reason:item.rpmEvidenceDebt})),
  fingerprintRepairCount:items.filter(item=>item.before.sourceFingerprint!==item.after.sourceFingerprint).length,
  identityFingerprintRepairCount:items.filter(item=>item.identityBefore).length,
  requestSha256:sha(json(request)),officialDryRun:'node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request ' + options.out};
fs.mkdirSync(path.dirname(output),{recursive:true});
if (fs.existsSync(output) && fs.readFileSync(output,'utf8') !== json(request))
  fail('existing request bytes differ; choose a new immutable requestId and output filename');
fs.writeFileSync(output,json(request));
fs.writeFileSync(output+'.build-report.json',json(report));
console.log(json({output,report:output+'.build-report.json',requestSha256:report.requestSha256,status:report.status,
  questionCount:count,registryChanges:registryChanges.length,rpmEvidenceDebtCount:report.rpmEvidenceDebts.length}));
