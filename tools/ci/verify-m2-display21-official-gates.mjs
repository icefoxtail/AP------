#!/usr/bin/env node
// Closed, disposable-checkout verification. It never commits, pushes, authors
// exam sources, or substitutes an orchestration result for an official guard.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync, execFileSync} from 'node:child_process';
import {pathToFileURL, fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

// The publication owner replaces this sole digest after binding the public
// code/input parent. DRAFT scopes and an unset digest cannot execute gates.
export const SCOPE_SHA = '10c5b1b8d9cd45c9afe13a7d5c6439d793833fdb8407d6ba89b648906cf632ec';
const BRANCH = 'refs/heads/review-reference/m2-display21-official-gates-r4-20261116';
const SCOPE_PATH = 'docs/operations/m2-display21-official-gates-20261116/input-manifest.json';
const RUNNER_PATH = 'tools/ci/verify-m2-display21-official-gates.mjs';
const WORKFLOW_PATH = '.github/workflows/m2-display21-official-gates.yml';
const PINNED_REQUESTS = [
  {
    "path": ".archive-meta-register/inbox/m2s2-display21-current626-e017-public14-20261116.json",
    "sha256": "de9d7036b445b522514f74706b2895f668b33219bc17007373ec130f1f221202",
    "gitBlobSha1": "c52316e85123405653c9ca45f8c080787403e42f",
    "bytes": 104255,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedSourceBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "expectedQuestionCount": 23,
    "requestId": "m2s2-display21-current626-e017-public14-20261116",
    "selectedCount": 14,
    "questionUids": [
      "qid_v1_fc40513f50e6014b508eb1e8061f135682b5a065fbf336fa755918de6c97ccf7",
      "qid_v1_f867386595af4f85ce29e7ce9d88ded95c6ad8c288eceb582812d0b4b8d171f7",
      "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
      "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
      "qid_v1_56134964da05fe0b1f0c03da443c3f5b954bf9479a9ee8b7250ff9363f2db98d",
      "qid_v1_76f0b67bec2a21754fd8f036418aae1956e62d1f19d0f60bf9acd93ba2606cc8",
      "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
      "qid_v1_204dd3224ff8354e6989356a1f9151983e1bb875d1705e1aaf2d884aeafcfbc9",
      "qid_v1_9a1c71c7ed648940f63646fd8f2062e131ad914bdf109362eef3aef1a880d7f2",
      "qid_v1_f609573d96834aca9d5a21693e0ac6150be59ed77721e3cccc0005ed5f6e89fa",
      "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
      "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
      "qid_v1_8d5adb66553e5a1bd552ef118800a9e9daa315723365055741bff1a87eafa26d",
      "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472"
    ],
    "sourceOrdinals": [
      1,
      3,
      4,
      5,
      7,
      8,
      9,
      10,
      12,
      17,
      18,
      20,
      21,
      23
    ],
    "lane": "EXISTING_NATIVE_METADATA_DISPLAY_CONTINUITY",
    "typedProofKeys": [
      "nativeRpmCourseTransport",
      "m2ProblemRenderer21Continuity"
    ]
  },
  {
    "path": ".archive-meta-register/inbox/m2s2-display21-current626-e017-existing-rhs1-20261116.json",
    "sha256": "483dc0d666bfebe155e2f088f0fbbb9196550985206e883ecc5f1d157fcd898e",
    "gitBlobSha1": "04afa1ca7d8ba6cbe3938830575e77e9e61f1b2d",
    "bytes": 7732,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedSourceBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "expectedQuestionCount": 23,
    "requestId": "m2s2-display21-current626-e017-existing-rhs1-20261116",
    "selectedCount": 1,
    "questionUids": [
      "qid_v1_3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9"
    ],
    "sourceOrdinals": [
      2
    ],
    "lane": "EXISTING_NATIVE_METADATA_DISPLAY_CONTINUITY",
    "typedProofKeys": [
      "nativeRpmCourseTransport",
      "e017RhsContinuity"
    ]
  },
  {
    "path": ".archive-meta-register/inbox/m2s2-display21-current626-e023-public-private6-20261116.json",
    "sha256": "a887e9786c5cc0ab8befe38ea28e1e50e8776fca3c56d757e90ac81e4303a95d",
    "gitBlobSha1": "e8edcb62e9121f2ae64fe75e098a4711df260c37",
    "bytes": 50023,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedSourceBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
    "expectedQuestionCount": 24,
    "requestId": "m2s2-display21-current626-e023-public-private6-20261116",
    "selectedCount": 6,
    "questionUids": [
      "qid_v1_848012b5f539fa1f58a6358ff0c5aaea032b0acc9c134b9f91cba0b749a1e303",
      "qid_v1_8b5f4eefcea6be04066923235f2898bf46c052a4994adbd1161554f69511b5e4",
      "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
      "qid_v1_ac6ea5f6d4266e383b7db2063dbeb68348852d5420e02746ba76e62781138ede",
      "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
      "qid_v1_3cd4b66acdc9f4b61132f18d6577c7cc9166137ad5135988bb892f15d3b94643"
    ],
    "sourceOrdinals": [
      4,
      5,
      6,
      8,
      10,
      19
    ],
    "lane": "EXISTING_NATIVE_METADATA_DISPLAY_CONTINUITY",
    "typedProofKeys": [
      "nativeRpmCourseTransport",
      "m2ProblemRenderer21Continuity",
      "e023SolutionDisplayContinuity"
    ]
  }
];
const PINNED_SOURCES = [
  {
    "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
    "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
    "bytes": 66605,
    "expectedQuestionCount": 23
  },
  {
    "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "gitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
    "sha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
    "bytes": 65146,
    "expectedQuestionCount": 24
  }
];
const REQUIRED_CODE_PATHS = [
  "archive/tools/meta-foundation/auto-register-merged-source.mjs",
  "archive/tools/meta-foundation/native-reviewed-source-reuse.mjs",
  "archive/tools/meta-foundation/reviewed-m2-e023-solution-display-continuity.mjs",
  "archive/tools/meta-foundation/reviewed-m2-native-rpm-course.mjs",
  "archive/tools/meta-foundation/reviewed-m2-problem21-continuity.mjs",
  "archive/tools/meta-foundation/reviewed-source-binding.mjs",
  "archive/tools/meta-foundation/reviewed-source-reassessment.mjs",
  "docs/operations/m2-display21-reviewed-continuity-20261116.md",
  "tests/archive-m2-e023-solution-display-continuity.test.js",
  "tests/archive-reviewed-m2-native-rpm-course.test.js",
  "tests/archive-reviewed-m2-problem21-continuity.test.mjs",
  "tools/run-tests.js"
];
const EXPECTED = {
  "requests": 3,
  "selected": 21,
  "sourceBanks": 2,
  "publicProblemNormalizations": 20,
  "privateSolutionNormalizations": 6,
  "existingE017Rhs": 1,
  "nativeOldChecks": 21,
  "nativeCaughtUpChecks": 21,
  "typedConsumerChecked": 21,
  "typedConsumerSkipped": 0,
  "negativeColdReplayCases": 10,
  "negativeNativeChecks": 138
};
const SELF = fileURLToPath(import.meta.url);
const META = 'archive/data/question_metadata.json';
const ID = 'archive/data/question_identity_map.json';
const STATE = '.archive-meta-register/auto/state.json';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const objectHash = value => sha(stable(value));
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); };
const fail = code => { throw new Error(code); };
const exact = (actual, expected, code) => { if (stable(actual) !== stable(expected)) fail(code); };
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], {env:{...process.env,GIT_NO_LAZY_FETCH:'1'}, maxBuffer:128*1024*1024, timeout:120000, stdio:['ignore','pipe','pipe']});
const gitText = (root, ...args) => git(root, ...args).toString().trim();
const nullList = bytes => bytes.toString().split('\0').filter(Boolean);

export function sanitizedError(error) {
  const message = String(error?.message || error);
  return {name:/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(error?.name || '') ? error.name : 'Error',
    messageSha256:sha(message), messageBytes:Buffer.byteLength(message),
    codes:[...new Set(message.match(/\b[A-Z][A-Z0-9_]{2,100}\b/g) || [])].slice(0,20),
    questionUids:[...new Set(message.match(/\bqid_v1_[a-f0-9]{64}\b/g) || [])].slice(0,20),
    knownReasons:['source Git blob drift','evidence missing/drift','source denominator mismatch','UID denominator mismatch',
      'requestId reused with different content','Consumer metadata mismatch','Consumer metadata conflict','native receipt was not verified']
      .filter(reason=>message.includes(reason)),
    fieldHints:['curriculumKey','courseKey','sourceFingerprint','contentFingerprint','problemTypeKey','templateKey',
      'conditionKeys','crossConceptKeys','standardCourse','standardUnitKey','subUnitKey','primaryMethod','decisiveStep']
      .filter(field=>new RegExp('\\b'+field+'\\b').test(message))};
}

const SHA1=/^[a-f0-9]{40}$/, SHA256=/^[a-f0-9]{64}$/;
const own=(o,k)=>Object.hasOwn(o,k);
const object=o=>o&&typeof o==='object'&&!Array.isArray(o);
const exactKeys=(o,keys,code)=>{assert(object(o),code);exact(Object.keys(o).sort(),[...keys].sort(),code);};
function fileRef(r) {
  exactKeys(r,['path','gitBlobSha1','sha256','bytes'],'FILE_REF_KEYS');
  assert(typeof r.path==='string'&&!path.isAbsolute(r.path)&&!/[\\\x00-\x1f\x7f]/.test(r.path)&&
    !r.path.split('/').some(p=>!p||p==='.'||p==='..'),'FILE_REF_PATH');
  assert(SHA1.test(r.gitBlobSha1)&&SHA256.test(r.sha256),'FILE_REF_DIGEST');
  assert(Number.isSafeInteger(r.bytes)&&r.bytes>0,'FILE_REF_SIZE');
}
export function validateScope(s) {
  exactKeys(s,['schemaVersion','profile','bindingStatus','verificationHead','verificationTree','publicCodeCommit','publicInputCommit',
    'actualBeforeCommit','expected','requests','sources','protectedInputs','inputEvidence','canonicalOperations','requiredCode',
    'newMathematicalQa','newIndependentApprovalClaims','sourcePayloadUploads','sourceWrites','remoteWrites'],'SCOPE_KEYS');
  assert.equal(s.schemaVersion,'archive-m2-display21-official-gates-input-v1');
  assert.equal(s.profile,'EXACT_M2_E017_15_E023_6_EXISTING_NATIVE_DISPLAY_AND_COURSE');
  assert.equal(s.bindingStatus,'FINAL_PUBLIC_CODE_AND_REQUEST_PARENT','PUBLIC_BINDING_REQUIRED');
  for(const k of ['verificationHead','verificationTree','publicCodeCommit','publicInputCommit','actualBeforeCommit'])assert(SHA1.test(s[k]||''),'PUBLIC_GIT_REF_REQUIRED');
  exact(s.expected,EXPECTED,'SCOPE_COUNTS');exact(s.requests,PINNED_REQUESTS,'EXACT_REQUEST_COHORT');exact(s.sources,PINNED_SOURCES,'EXACT_SOURCE_COHORT');
  assert.equal(new Set(s.requests.flatMap(r=>r.questionUids)).size,21,'UID_DENOMINATOR');
  exact(s.canonicalOperations,[],'NO_CANONICAL_AUTHORITY_CHANGES');
  for(const key of ['protectedInputs','inputEvidence','requiredCode']){
    assert(Array.isArray(s[key])&&s[key].length,'FILE_INVENTORY_REQUIRED');
    assert.equal(new Set(s[key].map(r=>r.path)).size,s[key].length,'DUPLICATE_FILE_INVENTORY');s[key].forEach(fileRef);
  }
  exact(s.protectedInputs.map(r=>r.path).sort(),[META,ID,STATE].sort(),'BEFORE_AUTHORITY_INVENTORY');
  exact(s.requiredCode.map(r=>r.path).sort(),REQUIRED_CODE_PATHS,'CURRENT_CODE_INVENTORY');
  assert.equal(s.inputEvidence.length,10,'WRAPPER_EVIDENCE_DENOMINATOR');
  for(const k of ['sourcePayloadUploads','sourceWrites','remoteWrites','newIndependentApprovalClaims'])assert.equal(s[k],0,'ZERO_EFFECT_REQUIRED');
  assert.equal(s.newMathematicalQa,false,'NO_NEW_MATH_APPROVAL');return s;
}
function loadScope(file) {
  assert(SHA256.test(SCOPE_SHA||''),'CONTROL_SCOPE_NOT_FROZEN');
  const bytes=fs.readFileSync(file);assert.equal(sha(bytes),SCOPE_SHA,'SCOPE_RAW_SHA_MISMATCH');return validateScope(JSON.parse(bytes));
}
export function validateRequest(row,bytes) {
  assert.equal(sha(bytes),row.sha256,'REQUEST_RAW_DRIFT');assert.equal(blob(bytes),row.gitBlobSha1,'REQUEST_GIT_BLOB_DRIFT');
  assert.equal(bytes.length,row.bytes,'REQUEST_SIZE_DRIFT');const request=JSON.parse(bytes);
  assert.equal(request.schemaVersion,'archive-reviewed-exam-meta-register-request-v2');assert.equal(request.requestId,row.requestId);
  assert.equal(request.sourceArchiveFile,row.sourceArchiveFile);assert.equal(request.expectedSourceBlobSha1,row.expectedSourceBlobSha1);
  assert.equal(request.expectedQuestionCount,row.expectedQuestionCount);assert.equal(request.scope,'PARTIAL_UIDS');
  assert.equal(request.approval?.type,'FINAL_QA');assert.equal(request.approval.metadataReviewed,true);
  assert.equal(request.approval.sourceRebind,undefined);assert.equal(request.registrationMode,undefined);exact(request.registryChanges,[],'NO_REGISTRY_CHANGES');
  exact(request.items.map(i=>i.questionUid),row.questionUids,'REQUEST_UID_INVENTORY');exact(request.items.map(i=>i.sourceOrdinal),row.sourceOrdinals,'REQUEST_ORDINAL_INVENTORY');
  for(const patch of request.items){
    assert.equal(patch.rebind,undefined);assert(own(patch.before,'courseKey')&&patch.before.courseKey===null,'ORIGINAL_COURSE_BEFORE_NULL');
    assert(own(patch.after,'courseKey')&&patch.after.courseKey==='M2-2','EXACT_COURSE_AFTER');
    assert.equal(patch.targetParentRef?.nativeRpmCourseTransport?.schemaVersion,'archive-m2-native-rpm-course-transport-v1');
    const keys=['nativeRpmCourseTransport',...['m2ProblemRenderer21Continuity','e023SolutionDisplayContinuity','e017RhsContinuity'].filter(k=>own(patch.sourceReview,k))];
    exact(keys,row.typedProofKeys,'EXACT_TYPED_PROOF_INVENTORY');
  }
  return request;
}
export function requireConsumer(result) {
  assert.equal(result.status,'PASS','OFFICIAL_TYPED_CONSUMER_FAILED');
  exact(result.counts,{changed:21,checked:21,passed:21,skippedUnchanged:0},'CONSUMER_DENOMINATOR_OR_SKIP');
  assert.equal(result.failures.length,0,'CONSUMER_FAILURES');
}
export function requireNativeCounts(rows,expected,status='PASS') {
  assert.equal(rows.length,expected*2,'NATIVE_DENOMINATOR');
  assert.equal(new Set(rows.map(r=>r.questionUid+'#'+r.cursor)).size,expected*2,'NATIVE_DUPLICATE_UID_CURSOR');
  for(const cursor of ['ACTUAL_OLD','CAUGHT_UP']){const chosen=rows.filter(r=>r.cursor===cursor);assert.equal(chosen.length,expected,'NATIVE_CURSOR_DENOMINATOR');assert(chosen.every(r=>r.status===status),'NATIVE_OUTCOME');}
}
export function requirePhaseEvidence(observation,proof,phase,index=null,variant=null) {
  assert.equal(observation.exitCode,0,'CHILD_NONZERO_EXIT');assert.equal(observation.signal,null,'CHILD_SIGNAL');assert.equal(observation.processError,null,'CHILD_PROCESS_ERROR');
  assert.equal(proof?.status,'PASS','CHILD_PROOF_NOT_PASS');assert.equal(proof.inputManifestSha256,SCOPE_SHA,'CHILD_INPUT_BINDING');
  assert.equal(proof.phase,phase,'CHILD_PHASE');assert.equal(proof.index,index,'CHILD_INDEX');assert.equal(proof.variant,variant,'CHILD_VARIANT');
}
const VARIANTS=['sidecar','nativeRpmCourseTransport','m2ProblemRenderer21Continuity','e023SolutionDisplayContinuity','e017RhsContinuity'];
function opts(argv) {
  const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i];assert(['--root','--scope','--output','--private','--phase','--index','--variant'].includes(k),'UNKNOWN_ARGUMENT');
    assert(argv[i+1]&&!own(out,k.slice(2)),'MISSING_OR_DUPLICATE_ARGUMENT');out[k.slice(2)]=argv[i+1];}
  for(const k of ['root','scope','output','private']){assert(out[k],'REQUIRED_ARGUMENT');out[k]=path.resolve(out[k]);}
  assert(out.output!==out.root&&!out.output.startsWith(out.root+path.sep)&&out.private!==out.root&&!out.private.startsWith(out.root+path.sep),'OUTPUT_INSIDE_CANDIDATE');
  assert(out.output!==out.private&&!out.output.startsWith(out.private+path.sep)&&!out.private.startsWith(out.output+path.sep),'PRIVATE_ARTIFACT_OVERLAP');
  if(own(out,'index')){out.index=Number(out.index);assert(Number.isSafeInteger(out.index)&&out.index>=0&&out.index<3,'REQUEST_INDEX');}
  if(own(out,'variant'))assert(VARIANTS.includes(out.variant),'NEGATIVE_VARIANT');return out;
}
function ref(root,relative){const b=fs.readFileSync(path.join(root,relative));return{path:relative,gitBlobSha1:blob(b),sha256:sha(b),bytes:b.length};}
function checkPinnedFile(root,row){const actual=ref(root,row.path);for(const k of ['gitBlobSha1','sha256','bytes'])assert.equal(actual[k],row[k],'PINNED_INPUT_DRIFT:'+k);
  assert.equal(git(root,'ls-tree','-z','HEAD','--',row.path).toString(),`100644 blob ${row.gitBlobSha1}\t${row.path}\0`,'HEAD_INPUT_MODE_OR_OID_DRIFT');}
function protectedGitChanges(root,consumed=false,scope=null){
  const changed=[...new Set([...nullList(git(root,'diff','--name-only','-z','HEAD','--')),...nullList(git(root,'ls-files','--others','-z'))])];
  const forbidden=changed.filter(p=>p.startsWith('archive/exams/')||p.startsWith('archive/assets/')||p.startsWith('tools/')||p.startsWith('archive/tools/')||
    p.startsWith('tests/')||p.startsWith('.github/')||p.startsWith('docs/')||p.startsWith('archive/data/item-4slot/')||
    p===STATE||p==='.archive-meta-register/auto/writer-state.json'||p.startsWith('archive/data/meta-foundation/canonical/'));
  assert.equal(forbidden.length,0,'PROTECTED_SOURCE_CODE_COMPACT_CANONICAL_OR_STATE_CHANGED');
  const ownRequests=new Set(scope?.requests.map(r=>r.path)||[]);
  for(const p of changed.filter(p=>p.startsWith('.archive-meta-register/inbox/')))assert(consumed&&ownRequests.has(p),'FOREIGN_INBOX_CHANGED');return changed;
}
function runtimeDocs(root) {
  const names=nullList(git(root,'ls-tree','-r','--name-only','-z','HEAD','--','archive/data/meta-foundation/runtime/')).filter(p=>p.endsWith('.json'));
  return names.map(p=>({path:p,doc:json(path.join(root,p))}));
}
function activeRuntimeDocs(root) {
  const require=createRequire(import.meta.url);
  const core=require(path.join(root,'archive/archive2-core.js'));
  assert(Array.isArray(core.Canonical.RUNTIME_INPUT_PATHS),'OFFICIAL_ACTIVE_RUNTIME_INVENTORY_MISSING');
  return core.Canonical.RUNTIME_INPUT_PATHS.map(p=>({path:'archive/'+p,doc:json(path.join(root,'archive',p))}));
}
function recordHashes(records,selected) {
  const rows=records.filter(r=>!selected.has(r.questionUid)).map(r=>[r.questionUid,objectHash(r)]).sort((a,b)=>a[0].localeCompare(b[0],'en'));
  assert.equal(new Set(rows.map(r=>r[0])).size,rows.length,'DUPLICATE_NONSELECTED_UID');return rows;
}

async function baseline(o,s) {
  assert.equal(gitText(o.root,'rev-parse','HEAD'),s.verificationHead,'WRONG_CANDIDATE_HEAD');assert.equal(gitText(o.root,'rev-parse','HEAD^{tree}'),s.verificationTree,'WRONG_CANDIDATE_TREE');
  assert.equal(gitText(o.root,'status','--porcelain=v1','--untracked-files=all'),'','CANDIDATE_NOT_PRISTINE');
  for(const c of [s.actualBeforeCommit,s.publicCodeCommit,s.publicInputCommit])git(o.root,'merge-base','--is-ancestor',c,s.verificationHead);
  for(const r of [...s.protectedInputs,...s.requiredCode,...s.inputEvidence,...s.sources])checkPinnedFile(o.root,r);
  for(const r of s.requests)validateRequest(r,fs.readFileSync(path.join(o.root,r.path)));
  const selected=new Set(s.requests.flatMap(r=>r.questionUids)),md=json(path.join(o.root,META)),id=json(path.join(o.root,ID));
  const canonical=nullList(git(o.root,'ls-tree','-r','--name-only','-z','HEAD','--','archive/data/meta-foundation/canonical/')).filter(p=>p.endsWith('.json'));
  const before={metadata:recordHashes(md.records,selected),identity:recordHashes(id.records,selected),runtimes:runtimeDocs(o.root).map(r=>({path:r.path,rows:recordHashes(r.doc.records||[],selected)})),
    selectedMetadata:md.records.filter(r=>selected.has(r.questionUid)),selectedIdentity:id.records.filter(r=>selected.has(r.questionUid)),
    canonicalFiles:canonical.map(p=>ref(o.root,p))};
  for(const key of ['selectedMetadata','selectedIdentity']){assert.equal(before[key].length,21,'SELECTED_BEFORE_DENOMINATOR');assert.equal(new Set(before[key].map(r=>r.questionUid)).size,21,'SELECTED_BEFORE_DUPLICATE');}
  writeJson(path.join(o.private,'baseline.json'),before);
  return{selected:21,requests:3,sourceBanks:2,nonselectedMetadata:before.metadata.length,nonselectedIdentity:before.identity.length,
    nonselectedRuntime:before.runtimes.reduce((n,r)=>n+r.rows.length,0),baselineDigests:{metadata:objectHash(before.metadata),identity:objectHash(before.identity),runtimes:objectHash(before.runtimes)},pristineWholeCheckout:true};
}
async function registration(o,s,phase) {
  const row=s.requests[o.index],request=validateRequest(row,fs.readFileSync(path.join(o.root,row.path)));
  const {registerReviewedExamV2}=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs')));
  const write=phase==='WRITE',projection=phase==='PROJECTION';
  const result=registerReviewedExamV2({root:o.root,request,write,verifyProjection:projection});
  assert.equal(result.status,'PASS','OFFICIAL_REGISTRAR_REFUSAL');
  assert.equal(result.replay,phase==='REPLAY'||projection,'UNEXPECTED_REPLAY_STATE');
  assert.equal(result.totalQuestions,row.selectedCount,'OFFICIAL_REQUEST_COUNT');
  for(const p of result.plannedPaths||[])assert(p.startsWith('archive/data/')&&!p.split('/').includes('..'),'REGISTRAR_PLANNED_WRITE_SCOPE');
  if(phase==='DRY')assert.equal(gitText(o.root,'status','--porcelain=v1','--untracked-files=all'),'','DRY_CHANGED_CHECKOUT');
  const record={requestId:row.requestId,requestPath:row.path,requestSha256:row.sha256,selected:row.selectedCount,
    replay:result.replay,write,projection,plannedPaths:result.plannedPaths||[],officialResultSha256:objectHash(result)};
  if(phase!=='DRY') {
    const p=RECEIPTS+request.requestId+'.json',receipt=json(path.join(o.root,p));
    assert.equal(receipt.requestSha256,objectHash(request),'ISSUED_REQUEST_BINDING');
    assert.equal(receipt.totalQuestions,row.selectedCount,'ISSUED_DENOMINATOR');
    assert.equal(receipt.sourceBlobSha1,row.expectedSourceBlobSha1,'ISSUED_SOURCE_BINDING');
    record.receipt={...ref(o.root,p),selected:receipt.totalQuestions,appliedRecordsSha256:objectHash(receipt.appliedRecords),
      appliedIdentityRecordsSha256:objectHash(receipt.appliedIdentityRecords),runtimeRecordsSha256:objectHash(receipt.runtimeRecords)};
  }
  protectedGitChanges(o.root,false,s);return record;
}
function runOfficial(o,name,argv,timeout=1200000) {
  const stdout=path.join(o.private,name+'.stdout'),stderr=path.join(o.private,name+'.stderr');
  const out=fs.openSync(stdout,'w'),err=fs.openSync(stderr,'w');let result;
  try{result=spawnSync(argv[0],argv.slice(1),{cwd:o.root,env:{...process.env,NODE_OPTIONS:'--max-old-space-size=4096',GIT_NO_LAZY_FETCH:'1'},
    timeout,stdio:['ignore',out,err],killSignal:'SIGKILL'});}finally{fs.closeSync(out);fs.closeSync(err);}
  const observation={command:argv,exitCode:result.status,signal:result.signal,error:result.error?sanitizedError(result.error):null,
    stdoutSha256:sha(fs.readFileSync(stdout)),stdoutBytes:fs.statSync(stdout).size,
    stderrSha256:sha(fs.readFileSync(stderr)),stderrBytes:fs.statSync(stderr).size};
  writeJson(path.join(o.output,'commands',name+'.json'),observation);
  return observation;
}
async function build(o,s) {
  const commands=[];
  commands.push(runOfficial(o,'compile-write',['node','archive/tools/meta-foundation/compile-meta-foundation.mjs','--write'],600000));
  assert.equal(commands.at(-1).exitCode,0,'COMPILE_FAILED');
  commands.push(runOfficial(o,'build-db-first',['python3','archive/build_db.py'],1200000));
  // Exactly the existing official writer's one generator fixed-point retry.
  if(commands.at(-1).exitCode!==0)commands.push(runOfficial(o,'build-db-fixed-point',['python3','archive/build_db.py'],1200000));
  assert.equal(commands.at(-1).exitCode,0,'OFFICIAL_BUILD_FAILED');
  for(const [name,argv] of [
    ['registration-parity',['node','archive/tools/verify-archive-registration.mjs']],
    ['catalog-check',['node','archive/tools/build-archive2-catalog.mjs','--check']],
    ['canonical-check',['node','archive/tools/meta-foundation/compile-meta-foundation.mjs','--canonical-only-check']]]) {
    const result=runOfficial(o,name,argv,600000);commands.push(result);assert.equal(result.exitCode,0,'OFFICIAL_DERIVED_GATE_FAILED');
  }
  protectedGitChanges(o.root,false,s);
  return {commands:commands.map(r=>({command:r.command,exitCode:r.exitCode,signal:r.signal})),sourceWrites:0,productionCodeWrites:0};
}
async function consumer(o,s,consumed) {
  const {verifyChangedUidConsumerApproval}=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs')));
  const requestPaths=s.requests.map(r=>consumed?path.join(o.private,'consumed-requests',path.basename(r.path)):r.path);
  if(consumed)for(const r of s.requests){assert(!fs.existsSync(path.join(o.root,r.path)),'OWN_INBOX_NOT_CONSUMED');validateRequest(r,fs.readFileSync(path.join(o.private,'consumed-requests',path.basename(r.path))));}
  const result=verifyChangedUidConsumerApproval({root:o.root,requestPaths});
  const report={officialStatus:result.status,counts:result.counts,consumed,
    failures:result.failures.map(f=>({uid:/^qid_v1_[a-f0-9]{64}$/.test(f.uid)?f.uid:null,reason:String(f.reason).replace(/[^A-Za-z0-9_]/g,'').slice(0,120),detailSha256:sha(String(f.detail||''))})),
    officialResultSha256:objectHash(result),assignmentPendingCount:result.assignmentPending?.length||0,unobservedFieldRows:result.unobservedFields?.length||0};
  writeJson(path.join(o.output,consumed?'consumed-consumer-observation.json':'consumer-observation.json'),report);
  requireConsumer(result);protectedGitChanges(o.root,consumed,s);return report;
}
async function consume(o,s) {
  fs.mkdirSync(path.join(o.private,'consumed-requests'),{recursive:true});
  for(const row of s.requests){const bytes=fs.readFileSync(path.join(o.root,row.path));validateRequest(row,bytes);const copy=path.join(o.private,'consumed-requests',path.basename(row.path));assert(!fs.existsSync(copy));fs.writeFileSync(copy,bytes,{flag:'wx'});fs.unlinkSync(path.join(o.root,row.path));}
  protectedGitChanges(o.root,true,s);return {consumedRequests:3,selected:21,allOriginalRequestBytesRetainedPrivately:true,otherInboxMutation:0};
}
async function native(o,s,expectRefusal=false) {
  const row=s.requests[o.index],raw=fs.readFileSync(path.join(o.private,'consumed-requests',path.basename(row.path))),request=validateRequest(row,raw);
  const mod=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/auto-register-merged-source.mjs')));
  const registryMod=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/active-registry.mjs')));
  const identityMod=await import(pathToFileURL(path.join(o.root,'archive/tools/intelligence/question-identity-contract.mjs')));
  const md=json(path.join(o.root,META)),identityMap=json(path.join(o.root,ID)),state=json(path.join(o.root,STATE));
  const byUid=new Map(md.records.map(r=>[r.questionUid,r])),ids=new Map(identityMap.records.map(r=>[r.questionUid,r]));
  const identityByJoin=new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
  const runtimes=activeRuntimeDocs(o.root),registry=registryMod.loadActiveMetaRegistry(o.root);assert.equal(registry.status,'ACTIVE');
  const source=request.sourceArchiveFile,bytes=fs.readFileSync(path.join(o.root,'archive/exams',source)),bank=mod.loadBank(bytes.toString(),source);
  assert.equal(blob(bytes),row.expectedSourceBlobSha1);assert.equal(bank.length,row.expectedQuestionCount);
  const testPath='tests/meta-foundation-middle-geometry-runtime.test.js',testBytes=fs.readFileSync(path.join(o.root,testPath)),text=testBytes.toString();
  const from=text.indexOf('function assertNativeApproval(input, label) {'),to=text.indexOf('\nfunction verifyHistoricalCohorts',from);
  assert(from>=0&&to>from,'EXACT_CI_NATIVE_FUNCTION_MISSING');const functionText=text.slice(from,to).trim();
  const assertNativeApproval=Function('assert','fs','path','sourceFingerprint','isUnambiguousLegacySourceUidAlias','validateActiveMetaFields','activeBindingContext','nativeReviewReceipt','return ('+functionText+');')(
    assert,fs,path,mod.sourceFingerprint,identityMod.isUnambiguousLegacySourceUidAlias,registryMod.validateActiveMetaFields,mod.activeBindingContext,mod.nativeReviewReceipt);
  const previous=new Map(),rows=[];
  for(const item of request.items) {
    const uid=item.questionUid,ordinal=item.sourceOrdinal,current=byUid.get(uid),id=ids.get(uid);
    const owners=runtimes.flatMap(r=>(r.doc.records||[]).filter(x=>x.questionUid===uid).map(record=>({pack:r.doc,record})));
    assert.equal(owners.length,1,'SELECTED_RUNTIME_OWNER_AMBIGUOUS');const {pack,record}=owners[0];assert.equal(pack.status,'ACTIVE');
    const base=state.pending?.[source+'#'+ordinal]?.baseCommit||state.lastProcessedCommit;assert(/^[a-f0-9]{40}$/.test(base),'OLD_CURSOR_MISSING');
    if(!previous.has(base)){const oldBytes=git(o.root,'show',base+':archive/exams/'+source);previous.set(base,{sha256:sha(oldBytes),bank:mod.loadBank(oldBytes.toString(),source)});}
    for(const cursor of ['ACTUAL_OLD','CAUGHT_UP']) {
      const input={question:bank[ordinal-1],previous:(cursor==='CAUGHT_UP'?bank:previous.get(base).bank)[ordinal-1],current,identity:id,registry,source,ordinal,runtimeOwner:pack.packId,
        nativeSource:{root:o.root,bytes,blobSha1:blob(bytes),bank,identityMap,identityByJoin,runtimeRecord:record,runtimeStatus:pack.status}};

      if(expectRefusal) {
        let refusal=null;try{assertNativeApproval(input,uid);}catch(error){refusal=error;}
        assert(refusal&&String(refusal.message).includes('native receipt was not verified'),'EXPECTED_TYPED_NATIVE_REFUSAL_NOT_OBSERVED');
        const plan=mod.planQuestion({...input,validate:registryMod.validateActiveMetaFields});
        assert.notEqual(plan.status,'ALREADY_REGISTERED','NEGATIVE_NATIVE_FALSE_REGISTERED');
        rows.push({questionUid:uid,sourceOrdinal:ordinal,cursor,status:'REJECTED',refusal:sanitizedError(refusal),planStatus:plan.status});
      } else {
        const nativeReceiptPath=assertNativeApproval(input,uid);assert.equal(nativeReceiptPath,RECEIPTS+request.requestId+'.json','NATIVE_ISSUED_RECEIPT_MISMATCH');
        const plan=mod.planQuestion({...input,validate:registryMod.validateActiveMetaFields});
        assert.equal(plan.status,'ALREADY_REGISTERED','NATIVE_PLAN_NOT_ALREADY_REGISTERED');assert.equal(plan.nativeReviewReceipt,nativeReceiptPath,'NATIVE_PLAN_RECEIPT_MISMATCH');
        rows.push({questionUid:uid,sourceOrdinal:ordinal,cursor,status:'PASS',nativeReceiptPath,planStatus:plan.status,
          oldCursorCommit:cursor==='ACTUAL_OLD'?base:null,oldSourceSha256:cursor==='ACTUAL_OLD'?previous.get(base).sha256:sha(bytes)});
      }
    }
  }
  requireNativeCounts(rows,row.selectedCount,expectRefusal?'REJECTED':'PASS');protectedGitChanges(o.root,true,s);
  return {requestId:row.requestId,selected:row.selectedCount,checks:rows.length,rows,
    exactCiNativeFunction:{path:testPath,gitBlobSha1:blob(testBytes),sha256:sha(testBytes),functionSha256:sha(functionText)},readOnly:true};
}

export function removeTypedProof(receipt,row,key) {
  assert(row.typedProofKeys.includes(key),'FOREIGN_TYPED_NEGATIVE');
  const changed=structuredClone(receipt);let removed=0;
  for(const uid of row.questionUids){const matches=changed.fingerprintRepairs?.filter(r=>r.questionUid===uid)||[];
    assert.equal(matches.length,1,'EXACT_NEGATIVE_REPAIR_INVENTORY');assert(own(matches[0].sourceReview,key),'NEGATIVE_PROOF_ALREADY_ABSENT');delete matches[0].sourceReview[key];removed++;}
  assert.equal(removed,row.selectedCount,'NEGATIVE_PROOF_REMOVAL_COUNT');return changed;
}
export async function withRestoredFile(full,change,action) {
  const original=fs.readFileSync(full),beforeSha=sha(original);
  try { change(full,original); return await action({originalSha256:beforeSha}); }
  finally {fs.writeFileSync(full,original);assert.equal(sha(fs.readFileSync(full)),beforeSha,'NEGATIVE_RESTORE_FAILED');}
}
async function negative(o,s) {
  const row=s.requests[o.index];assert(o.variant==='sidecar'||row.typedProofKeys.includes(o.variant),'NEGATIVE_NOT_APPLICABLE');
  const raw=fs.readFileSync(path.join(o.private,'consumed-requests',path.basename(row.path))),request=validateRequest(row,raw);
  const receiptPath=RECEIPTS+row.requestId+'.json',sidecarPath=RECEIPTS+row.requestId+'.source-review-binding.json';
  const target=o.variant==='sidecar'?sidecarPath:receiptPath,full=path.join(o.root,target);
  const result=await withRestoredFile(full,(file,original)=>{
    if(o.variant==='sidecar')fs.unlinkSync(file);else fs.writeFileSync(file,JSON.stringify(removeTypedProof(JSON.parse(original),row,o.variant),null,2)+'\n');
  },async({originalSha256})=>{
    const {registerReviewedExamV2}=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs')));
    let refusal=null;try{registerReviewedExamV2({root:o.root,request,write:false});}catch(error){refusal=error;}
    assert(refusal,'COLD_REPLAY_ACCEPTED_MISSING_TYPED_AUTHORITY');
    const nativeResult=await native(o,s,true);
    return {requestId:row.requestId,variant:o.variant,selected:row.selectedCount,coldReplay:'REJECTED',coldReplayRefusal:sanitizedError(refusal),
      nativeOldAndCurrentRefused:nativeResult.checks,nativeRows:nativeResult.rows,mutatedPath:target,originalSha256};
  });
  protectedGitChanges(o.root,true,s);return{...result,exactOriginalBytesRestored:true,sourceWrites:0};
}
async function continuity(o,s) {
  const before=json(path.join(o.private,'baseline.json')),selected=new Set(s.requests.flatMap(r=>r.questionUids));
  const md=json(path.join(o.root,META)),id=json(path.join(o.root,ID));
  exact(recordHashes(md.records,selected),before.metadata,'NONSELECTED_METADATA_DRIFT');exact(recordHashes(id.records,selected),before.identity,'NONSELECTED_IDENTITY_DRIFT');
  exact(runtimeDocs(o.root).map(r=>({path:r.path,rows:recordHashes(r.doc.records||[],selected)})),before.runtimes,'NONSELECTED_RUNTIME_DRIFT');
  for(const r of before.canonicalFiles)exact(ref(o.root,r.path),r,'CANONICAL_BYTES_CHANGED');
  for(const r of [...s.sources,...s.requiredCode,...s.inputEvidence])checkPinnedFile(o.root,r);
  protectedGitChanges(o.root,true,s);
  return{nonselectedMetadata:before.metadata.length,nonselectedIdentity:before.identity.length,nonselectedRuntime:before.runtimes.reduce((n,r)=>n+r.rows.length,0),
    wholeNonselectedRowsExact:true,sourceBanksByteExact:2,canonicalAddedRows:0,compactWrites:0,sourceWrites:0,productionCodeWrites:0};
}
const PHASES=new Set(['BASELINE','DRY','WRITE','REPLAY','BUILD','PROJECTION','CONSUMER','CONSUME','CONSUMED_CONSUMER','NATIVE','NEGATIVE','CONTINUITY']);
async function executePhase(o,s) {
  assert(PHASES.has(o.phase),'UNKNOWN_PHASE');const indexed=['DRY','WRITE','REPLAY','PROJECTION','NATIVE','NEGATIVE'].includes(o.phase);
  assert.equal(indexed,own(o,'index'),'PHASE_INDEX_SHAPE');assert.equal(o.phase==='NEGATIVE',own(o,'variant'),'PHASE_VARIANT_SHAPE');
  if(o.phase==='BASELINE')return baseline(o,s);
  if(['DRY','WRITE','REPLAY','PROJECTION'].includes(o.phase))return registration(o,s,o.phase);
  if(o.phase==='BUILD')return build(o,s);
  if(o.phase==='CONSUMER'||o.phase==='CONSUMED_CONSUMER')return consumer(o,s,o.phase==='CONSUMED_CONSUMER');
  if(o.phase==='CONSUME')return consume(o,s);
  if(o.phase==='NATIVE')return native(o,s);
  if(o.phase==='NEGATIVE')return negative(o,s);
  return continuity(o,s);
}
const labelFor=(phase,index,variant)=>phase.toLowerCase()+(index===undefined?'':'-'+String(index).padStart(2,'0'))+(variant?'-'+variant:'');
async function phaseMain(o,s) {
  const label=labelFor(o.phase,o.index,o.variant),output=path.join(o.output,'phases',label+'.json');assert(!fs.existsSync(output),'PHASE_PROOF_ALREADY_EXISTS');
  const proof={schemaVersion:'archive-m2-display21-official-phase-v1',verificationHead:s.verificationHead,verificationTree:s.verificationTree,
    inputManifestSha256:SCOPE_SHA,phase:o.phase,index:o.index??null,variant:o.variant??null,status:'FAIL',startedAt:new Date().toISOString(),remoteWrites:0};
  const start=Date.now();try{proof.result=await executePhase(o,s);proof.status='PASS';}catch(error){proof.error=sanitizedError(error);
    writeJson(path.join(o.private,label+'.error.json'),{name:String(error?.name),message:String(error?.message),stack:String(error?.stack)});}
  proof.elapsedMs=Date.now()-start;proof.resourceUsage=process.resourceUsage();writeJson(output,proof);
  console.log(JSON.stringify({phase:proof.phase,index:proof.index,variant:proof.variant,status:proof.status,elapsedMs:proof.elapsedMs,proofSha256:sha(fs.readFileSync(output))}));process.exitCode=proof.status==='PASS'?0:1;
}
function measuredChild(o,phase,index,timeout,variant) {
  const label=labelFor(phase,index,variant),perf=path.join(o.private,label+'.time'),stdout=path.join(o.private,label+'.stdout'),stderr=path.join(o.private,label+'.stderr');
  const args=['-f','{"maxRssKiB":%M,"elapsedSeconds":%e,"exitStatus":%x}','-o',perf,process.execPath,'--max-old-space-size=4096',SELF,
    '--root',o.root,'--scope',o.scope,'--output',o.output,'--private',o.private,'--phase',phase,...(index===undefined?[]:['--index',String(index)]),...(variant?['--variant',variant]:[])];
  const out=fs.openSync(stdout,'w'),err=fs.openSync(stderr,'w');let result;const started=Date.now();
  try{result=spawnSync('/usr/bin/time',args,{cwd:o.root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout,stdio:['ignore',out,err],killSignal:'SIGKILL'});}finally{fs.closeSync(out);fs.closeSync(err);}
  const metrics=fs.existsSync(perf)?fs.readFileSync(perf,'utf8').split('\n').filter(x=>x.startsWith('{')).map(x=>JSON.parse(x)).at(-1):null;
  const file=path.join(o.output,'phases',label+'.json'),phaseProof=fs.existsSync(file)?json(file):null;
  const observation={phase,index:index??null,variant:variant??null,exitCode:result.status,signal:result.signal,timeoutMs:timeout,elapsedMs:Date.now()-started,
    processError:result.error?sanitizedError(result.error):null,metrics,stdoutSha256:sha(fs.readFileSync(stdout)),stderrSha256:sha(fs.readFileSync(stderr)),
    proof:phaseProof?{path:'phases/'+label+'.json',sha256:sha(fs.readFileSync(file)),bytes:fs.statSync(file).size}:null};
  writeJson(path.join(o.output,'processes',label+'.json'),observation);requirePhaseEvidence(observation,phaseProof,phase,index??null,variant??null);return observation;
}
function systemResources() {
  let cgroupMemory=null;
  for(const p of ['/sys/fs/cgroup/memory.max','/sys/fs/cgroup/memory/memory.limit_in_bytes'])if(fs.existsSync(p)){
    const text=fs.readFileSync(p,'utf8').trim();if(/^\d+$/.test(text)){const n=Number(text);if(Number.isSafeInteger(n)&&n>0)cgroupMemory=Math.min(cgroupMemory??Infinity,n);}
  }
  return {totalMemoryBytes:os.totalmem(),freeMemoryBytes:os.freemem(),cgroupMemoryLimitBytes:cgroupMemory,cpuCount:os.cpus().length,nodeVersion:process.version};
}

export function phasePlan(scope) {
  const p=[['BASELINE',null,300000]];
  for(const phase of ['DRY','WRITE','REPLAY'])for(let i=0;i<3;i++)p.push([phase,i,300000]);
  p.push(['BUILD',null,3000000]);for(let i=0;i<3;i++)p.push(['PROJECTION',i,600000]);
  p.push(['CONSUMER',null,1200000],['CONSUME',null,300000],['CONSUMED_CONSUMER',null,1200000]);
  for(let i=0;i<3;i++)p.push(['NATIVE',i,600000]);
  for(let i=0;i<3;i++)for(const variant of ['sidecar',...scope.requests[i].typedProofKeys])p.push(['NEGATIVE',i,600000,variant]);
  p.push(['CONTINUITY',null,600000]);return p;
}
export function requireCompletedPlan(observations,s) {
  exact(observations.map(r=>[r.phase,r.index,r.variant??null]),phasePlan(s).map(([p,i,,v])=>[p,i,v??null]),'INCOMPLETE_OR_REORDERED_GATES');
  assert(observations.every(r=>r.exitCode===0&&r.signal===null&&r.processError===null),'FAILED_GATE_PRESENT');
}
async function allMain(o,s) {
  assert.equal(process.env.GITHUB_ACTIONS,'true','GITHUB_ACTIONS_ONLY');assert.equal(process.env.GITHUB_REF,BRANCH,'CLOSED_BRANCH_ONLY');
  fs.mkdirSync(o.output,{recursive:true});fs.mkdirSync(o.private,{recursive:true});
  const control=path.resolve(path.dirname(SELF),'../..'),codeHead=gitText(control,'rev-parse','HEAD');
  assert.equal(codeHead,process.env.GITHUB_SHA,'WORKFLOW_CHECKOUT_MISMATCH');
  exact(gitText(control,'show','-s','--format=%P','HEAD').split(' '),[s.verificationHead],'WORKFLOW_PARENT_MISMATCH');
  exact(nullList(git(control,'diff','--name-only','-z',s.verificationHead,'HEAD','--')).sort(),[WORKFLOW_PATH,RUNNER_PATH,SCOPE_PATH].sort(),'CONTROL_CODE_SCOPE');
  const report={schemaVersion:'archive-m2-display21-official-gates-proof-v1',status:'FAIL',workflowCommit:codeHead,verificationHead:s.verificationHead,verificationTree:s.verificationTree,
    publicCodeCommit:s.publicCodeCommit,publicInputCommit:s.publicInputCommit,actualBeforeCommit:s.actualBeforeCommit,inputManifestSha256:SCOPE_SHA,
    runnerSha256:sha(fs.readFileSync(SELF)),workflowSha256:sha(fs.readFileSync(path.join(control,WORKFLOW_PATH))),resources:systemResources(),commands:[],testCheckoutOnly:true,
    mainRegistrationPerformed:false,sourcePayloadUploads:0,artifactContainsStudentPayloadOrWholeMetadataRecords:false,newMathematicalQa:false,newIndependentApprovalClaims:0,remoteWrites:0};
  let disk=fs.statfsSync(o.root);report.resources.freeDiskBytesBefore=disk.bavail*disk.bsize;const save=()=>writeJson(path.join(o.output,'proof.json'),report);save();
  try {
    assert(Math.min(report.resources.totalMemoryBytes,report.resources.cgroupMemoryLimitBytes??Infinity)>=5*1024**3,'RUNNER_MEMORY_BELOW_BOUNDED_CONTRACT');
    for(const [phase,index,timeout,variant] of phasePlan(s)){const observation=measuredChild(o,phase,index===null?undefined:index,timeout,variant);report.commands.push(observation);save();
      console.log(JSON.stringify({phase,index,variant:variant??null,status:'PASS',elapsedMs:observation.elapsedMs,maxRssKiB:observation.metrics?.maxRssKiB??null}));}
    requireCompletedPlan(report.commands,s);
    report.verified={officialDryRequests:3,officialWriteRequests:3,officialColdReplayRequests:3,projectionRequests:3,typedConsumer:21,consumedTypedConsumer:21,skipped:0,
      nativeOld:21,nativeCaughtUp:21,sourceBanksPreserved:2,negativeColdReplayCases:10,negativeNativeChecks:138};report.status='PASS';
  } catch(error){report.error=sanitizedError(error);}
  report.finishedAt=new Date().toISOString();disk=fs.statfsSync(o.root);report.resources.freeDiskBytesAfter=disk.bavail*disk.bsize;save();
  console.log(JSON.stringify({status:report.status,completedCommands:report.commands.length,proofSha256:sha(fs.readFileSync(path.join(o.output,'proof.json')))}));process.exitCode=report.status==='PASS'?0:1;
}
export async function selfTest(draft) {
  let passed=0;const ok=fn=>{fn();passed++},no=fn=>{assert.throws(fn);passed++};
  const s=structuredClone(draft);s.bindingStatus='FINAL_PUBLIC_CODE_AND_REQUEST_PARENT';for(const k of ['verificationHead','verificationTree','publicCodeCommit','publicInputCommit'])s[k]='a'.repeat(40);
  ok(()=>validateScope(s));
  for(const change of [x=>x.bindingStatus='DRAFT_AWAITING_PUBLIC_CODE_AND_REQUEST_PARENT',x=>x.verificationHead=null,x=>x.requests.pop(),x=>x.requests[0].selectedCount=13,
    x=>x.requests[0].questionUids[1]=x.requests[0].questionUids[0],x=>x.requests[0].sourceOrdinals[0]=2,x=>x.sources[0].gitBlobSha1='0'.repeat(40),
    x=>x.canonicalOperations.push({unapproved:true}),x=>x.expected.typedConsumerSkipped=1,x=>x.expected.negativeNativeChecks=137,
    x=>x.inputEvidence.pop(),x=>x.inputEvidence[0].path='../escape',x=>x.requiredCode.pop(),x=>x.unknown=true,x=>x.newMathematicalQa=true])no(()=>{const x=structuredClone(s);change(x);validateScope(x)});
  const good={status:'PASS',counts:{changed:21,checked:21,passed:21,skippedUnchanged:0},failures:[]};ok(()=>requireConsumer(good));
  for(const change of [x=>x.status='FAIL',x=>x.counts.checked=20,x=>x.counts.skippedUnchanged=1,x=>x.failures.push({reason:'fixture'})])no(()=>{const x=structuredClone(good);change(x);requireConsumer(x)});
  const n=[{questionUid:'fixture',cursor:'ACTUAL_OLD',status:'PASS'},{questionUid:'fixture',cursor:'CAUGHT_UP',status:'PASS'}];ok(()=>requireNativeCounts(n,1));
  no(()=>requireNativeCounts(n.slice(0,1),1));no(()=>requireNativeCounts([n[0],n[0]],1));no(()=>requireNativeCounts([n[0],{...n[1],status:'REJECTED'}],1));
  ok(()=>requireNativeCounts(n.map(r=>({...r,status:'REJECTED'})),1,'REJECTED'));
  const observation={exitCode:0,signal:null,processError:null},proof={status:'PASS',phase:'DRY',index:0,variant:null,inputManifestSha256:SCOPE_SHA};
  ok(()=>requirePhaseEvidence(observation,proof,'DRY',0));
  for(const [o,p] of [[{...observation,exitCode:1},proof],[{...observation,signal:'SIGKILL'},proof],[observation,null],[observation,{...proof,status:'FAIL'}],
    [observation,{...proof,index:1}],[observation,{...proof,variant:'sidecar'}],[observation,{...proof,inputManifestSha256:'changed'}]])no(()=>requirePhaseEvidence(o,p,'DRY',0));
  const complete=phasePlan(s).map(([phase,index,,variant])=>({phase,index,variant:variant??null,...observation}));ok(()=>requireCompletedPlan(complete,s));
  no(()=>requireCompletedPlan(complete.slice(0,-1),s));no(()=>requireCompletedPlan([...complete.slice(0,1),...complete.slice(2),complete[1]],s));
  no(()=>requireCompletedPlan(complete.map((r,i)=>i===1?{...r,exitCode:1}:r),s));
  const row=s.requests[0],receipt={fingerprintRepairs:row.questionUids.map(questionUid=>({questionUid,sourceReview:Object.fromEntries(row.typedProofKeys.map(k=>[k,{fixture:true}]))}))};
  const before=stable(receipt);ok(()=>{const changed=removeTypedProof(receipt,row,'nativeRpmCourseTransport');assert(changed.fingerprintRepairs.every(r=>!own(r.sourceReview,'nativeRpmCourseTransport')));assert.equal(stable(receipt),before);});
  no(()=>removeTypedProof(receipt,row,'unknown'));no(()=>removeTypedProof({fingerprintRepairs:receipt.fingerprintRepairs.slice(1)},row,'nativeRpmCourseTransport'));
  no(()=>removeTypedProof({...receipt,fingerprintRepairs:[...receipt.fingerprintRepairs,receipt.fingerprintRepairs[0]]},row,'nativeRpmCourseTransport'));
  no(()=>removeTypedProof(removeTypedProof(receipt,row,'nativeRpmCourseTransport'),row,'nativeRpmCourseTransport'));
  ok(()=>{const e=sanitizedError(new Error('synthetic private solution literal SOURCE_DRIFT'));assert(!JSON.stringify(e).includes('synthetic private'));assert.deepEqual(e.codes,['SOURCE_DRIFT']);});
  const synthetic={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-course',sourceArchiveFile:'original/middle/m2/2mid/synthetic.js',
    expectedSourceBlobSha1:'a'.repeat(40),expectedQuestionCount:23,scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA',metadataReviewed:true},registryChanges:[],
    items:[{questionUid:'qid_v1_'+'b'.repeat(64),sourceOrdinal:1,before:{courseKey:null},after:{courseKey:'M2-2'},sourceReview:{m2ProblemRenderer21Continuity:{}},
      targetParentRef:{nativeRpmCourseTransport:{schemaVersion:'archive-m2-native-rpm-course-transport-v1'}}}]};
  const encode=q=>Buffer.from(JSON.stringify(q)),syntheticRef=q=>{const b=encode(q);return{requestId:q.requestId,sourceArchiveFile:q.sourceArchiveFile,
    expectedSourceBlobSha1:q.expectedSourceBlobSha1,expectedQuestionCount:q.expectedQuestionCount,questionUids:q.items.map(i=>i.questionUid),sourceOrdinals:q.items.map(i=>i.sourceOrdinal),
    typedProofKeys:['nativeRpmCourseTransport','m2ProblemRenderer21Continuity'],sha256:sha(b),gitBlobSha1:blob(b),bytes:b.length};};
  ok(()=>validateRequest(syntheticRef(synthetic),encode(synthetic)));
  no(()=>validateRequest(syntheticRef(synthetic),Buffer.from(JSON.stringify(synthetic)+' ')));
  for(const change of [q=>q.items[0].before.courseKey='M2-2',q=>delete q.items[0].before.courseKey,q=>q.items[0].after.courseKey='M3-2',
    q=>q.registryChanges.push({unapproved:true}),q=>q.approval.sourceRebind={},q=>q.items[0].rebind={},q=>q.items[0].sourceReview.e017RhsContinuity={}])
    no(()=>{const q=structuredClone(synthetic);change(q);validateRequest(syntheticRef(q),encode(q));});
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'display21-control-test-')),file=path.join(tmp,'proof.json'),original=Buffer.from('synthetic exact original\n');
  try {
    fs.writeFileSync(file,original);
    await withRestoredFile(file,f=>fs.unlinkSync(f),async()=>{assert(!fs.existsSync(file));});assert.deepEqual(fs.readFileSync(file),original);passed++;
    await assert.rejects(()=>withRestoredFile(file,f=>fs.writeFileSync(f,'mutated'),async()=>{throw new Error('EXPECTED_ACTION_FAILURE')}),/EXPECTED_ACTION_FAILURE/);
    assert.deepEqual(fs.readFileSync(file),original);passed++;
    await assert.rejects(()=>withRestoredFile(file,f=>{fs.unlinkSync(f);throw new Error('EXPECTED_MUTATION_FAILURE')},async()=>{}),/EXPECTED_MUTATION_FAILURE/);
    assert.deepEqual(fs.readFileSync(file),original);passed++;
  } finally {fs.rmSync(tmp,{recursive:true,force:true});}
  return{status:'PASS',passed,failed:0,skipped:0,actualOfficialGatesRun:0,phaseCount:phasePlan(s).length,negativeColdCases:10,negativeNativeChecks:138};
}
async function main() {
  if(process.argv[2]==='--self-test'){assert.equal(process.argv.length,4);console.log(JSON.stringify(await selfTest(json(path.resolve(process.argv[3])))));return;}
  if(process.argv[2]==='--input-head'){assert.equal(process.argv.length,4);console.log(loadScope(path.resolve(process.argv[3])).verificationHead);return;}
  const o=opts(process.argv.slice(2)),s=loadScope(o.scope);if(o.phase)await phaseMain(o,s);else await allMain(o,s);
}
if(process.argv[1]&&path.resolve(process.argv[1])===SELF)main().catch(error=>{console.error(JSON.stringify({status:'FAIL',error:sanitizedError(error)}));process.exitCode=1;});
