#!/usr/bin/env node
import { BOUNDED_RENDERER_UI_INPUTS } from '../4slot/bounded-renderer-ui-inputs.mjs';
import { sourceQualityHoldDependencyPaths } from '../../archive/tools/source-quality-holds.mjs';
import { inferRegistrationMode, REGISTRATION_MODE_ENV } from '../../archive/tools/meta-foundation/registration-mode.mjs';
import { canonicalParentRetryRequests, canonicalParentRetryDependencies } from '../../archive/tools/meta-foundation/canonical-parent-retry.mjs';
// One preparation transaction for the existing registration producers. This script never commits or pushes.
// Each successful lane stages its allowlisted output. Native `git diff`/reset guards then see that index as
// their baseline; a single final push helper commits the consistent result, requests and cursors together.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {checkStagedRegistrationWhitespace} from './archive-registration-whitespace.mjs';

export const VERSION = 'archive-registration-writer-v1';
export const STATE = '.archive-meta-register/auto/writer-state.json';
export { inferRegistrationMode };
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const json = v => JSON.stringify(v, null, 2) + '\n';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const unique = rows => [...new Set(rows)];
const splitZ = value => value.split('\0').filter(Boolean);
const git = (root, ...args) => execFileSync('git', args, {cwd:root, encoding:'utf8', maxBuffer:256*1024*1024, stdio:['ignore','pipe','pipe']});
const read = (root, rel, fallback) => fs.existsSync(path.join(root, rel)) ? JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')) : fallback;
const specs = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8').split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));

// Existing path lists use literal paths, directory prefixes and Git's non-glob-mode `*` (including '/').
export function matches(file, patterns) {
  return patterns.some(pattern => pattern.endsWith('/') ? file.startsWith(pattern)
    : new RegExp('^' + pattern.split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*') + '$').test(file));
}

export function indexRows(root) {
  return splitZ(git(root, 'ls-files', '--stage', '-z')).map(row => {
    const m=/^(\d+) ([a-f0-9]{40}) (\d)\t([\s\S]+)$/.exec(row);
    if(!m||m[3]!=='0')throw Error('UNMERGED_OR_INVALID_INDEX');
    return {path:m[4], mode:m[1], blob:m[2]};
  });
}
export function fingerprint(rows, patterns) {
  return sha(rows.filter(r=>r.path!==STATE&&matches(r.path,patterns)).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0)
    .map(r=>`${r.path}\0${r.mode}\0${r.blob}\n`).join(''));
}
// A lane may also name `derivedInputs(rows)`: a digest of dependencies that a path pattern cannot express (a few rows of a big file).
// It joins the fingerprint only when the lane has one, so the fingerprint of every other lane keeps its form.
export const inputFingerprint=(rows,lane)=>sha(json({patterns:lane.inputs,parameters:lane.parameters||{},files:fingerprint(rows,lane.inputs),
  ...(typeof lane.derivedInputs==='function'?{derived:safeDerived(lane,rows)}:{})}));
// If the dependency cannot be read the digest is unreadable-and-unique-per-message, which differs from any stored one: the lane runs.
function safeDerived(lane,rows) {
  try { return lane.derivedInputs(rows); } catch(error) { return 'UNREADABLE:'+String(error.message||error).split('\n')[0]; }
}

// ---- the 4slot lane's dependence on registered metadata ----
// The 4slot builder (tools/4slot/build-4slot-runtime.cjs) reads question_metadata.json, the Meta Foundation runtime packs and reviewed-exam-meta
// evidence only through its continuity modules. Every other exam's 4칸 comes from the exam source, the 4칸 file, the dictionary and the
// identity map, never from a problem type (PT/TPL). So a request that only changes types (receipt kind TYPE_ONLY) of exams no module reads must not
// start the lane, and a change to anything a module reads must. Measured on the 214-request type batch (2026-11-19): the lane re-ran for 364 s and
// changed 25 inputHash cache keys and the inputDigest of item-4slot-index.json, and 0 of 17,954 records.
//
// What each module reads (rows of question_metadata.json / runtime packs), and what the fingerprint holds for it:
//   module                                                         rows it reads                                         in the fingerprint
//   existing-registered-vector-continuity (+ -ui, -svg7-ui)        its own questions, by uid                              rows of the uids named in its docs/tools
//   existing-registered-vector-svg7-derived-continuity             WHOLE bank of 3 exams (75 rows, every field) and the   every row of an exam the tool names, and the
//                                                                  global row count (28,890 pinned)                       total row count
//   registered-renderer-continuity (.cjs, .mjs worker)             its own questions, by uid; runtime row + status/pack   uid rows, runtime rows of those uids
//   m1s2-problem-renderer-continuity (+ -ui)                       its 7 questions (uids written as 'qid_v1_'+hash)       hash-token match, so the split is read too
//   m3s2-layout-continuity, m3-e052-q5-complete-given-continuity   one question each (+ q5: its runtime pack row)           uid / exam match
//   original-source-error-hold                                     one exam source and its bank                           exam match
//   renderer-registration-hold -> metadata-registration-hold ->    only for a compact file that claims it                 a compact file with such a claim (none today)
//     verify-hold-metadata-replay.mjs                              (registrationHold.metadataTransportEvidence)          makes the digest whole-file, as before
//   partial-submission, rebind-*, validate/import-4slot, ...       no metadata or runtime row                             nothing
// A "named" question is found by text, not by a list kept here: every 64-hex token (a uid written whole or as 'qid_v1_'+hash) in the 4slot
// registration docs and tools/4slot/*. A whole bank is named by the two tools that compare banks (WHOLE_BANK_TOOLS): every '<name>.js' in them that is
// the source file name of a metadata row. Exams that only a doc or a by-uid module mentions are not whole banks: those modules read their own rows.
// tests/archive-registration-writer.test.mjs runs the modules' own readers and checks every row they read is one of these rows.
// The Meta Foundation canonical/compiled registry stays a path input: the cohort checks validate their rows against the active registry, so a
// batch whose requests add registry keys (registryChanges) still starts the lane. Narrowing that to the registry entries the cohort rows use
// needs the 4slot cohort owners; it is not guessed here.
const FOUR_SLOT_META='archive/data/question_metadata.json';
const FOUR_SLOT_META_SHARDS='archive/data/question-metadata/v1/';
const FOUR_SLOT_RUNTIME='archive/data/meta-foundation/runtime/';
const FOUR_SLOT_EVIDENCE='archive/data/meta-foundation/evidence/reviewed-exam-meta/';
const FOUR_SLOT_COMPACT='archive/data/item-4slot/';
// requestId prefixes td- (direct), tc- (carrier) and tr- (replacing a draft type), made by build-type-judgment-requests.mjs; each receipt is
// fieldScope TYPE_ONLY (tests/archive-registration-writer.test.mjs checks every such file), next to it the request's type ledger.
export const TYPE_ONLY_EVIDENCE=/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/t[cdr]-[0-9a-f]{12}-[0-9a-f]{8}(?:\.type-ledger)?\.json$/;
const FOUR_SLOT_COHORT_FILES=/^(?:\.archive-meta-register\/4slot-|tools\/4slot\/[^/]+\.(?:cjs|mjs|js)$)/;
// The only tools/4slot files that read every metadata row of an exam (the 75-row, every-field comparison of three m2s1 banks).
export const WHOLE_BANK_TOOLS=new Set(['existing-registered-vector-svg7-derived-continuity.cjs','existing-registered-vector-svg7-ui.cjs']);
const HEX64=/[0-9a-f]{64}/g;
const SOURCE_NAME=/[^\s"'`\\/<>:,;()[\]{}]+\.js\b/g;
// A compact 4칸 file that claims a metadata continuation sends the builder to verify-hold-metadata-replay.mjs, which reads rows no text names.
const METADATA_CLAIM=/metadataTransportEvidence|metadataContinuity/;
export const FOUR_SLOT_DERIVED_VERSION='archive-four-slot-cohort-inputs-v3';
const smallText=new Map(),claimFlag=new Map(),heavyMemo=new Map();
const memoHeavy=(key,make)=>{
  if(heavyMemo.has(key))return heavyMemo.get(key);
  const value=make();heavyMemo.set(key,value);
  while(heavyMemo.size>8)heavyMemo.delete(heavyMemo.keys().next().value);
  return value;
};
const baseName=file=>String(file||'').split('/').pop();
// `git cat-file --batch`: many blobs in one process. Returns Map(blob -> Buffer).
export function readBlobsBatch(root, blobs) {
  const out=new Map();if(!blobs.length)return out;
  const buffer=execFileSync('git',['cat-file','--batch'],{cwd:root,input:blobs.join('\n')+'\n',maxBuffer:1<<30,stdio:['pipe','pipe','pipe']});
  let at=0;
  for(const blob of blobs) {
    const eol=buffer.indexOf(10,at),header=buffer.toString('latin1',at,eol).split(' ');
    if(header[1]!=='blob')throw Error('GIT_BLOB_UNREADABLE:'+blob);
    const size=Number(header[2]);out.set(blob,buffer.subarray(eol+1,eol+1+size));at=eol+1+size+1;
  }
  return out;
}
function loadTexts(blobs, readBlob, readBlobs, cache) {
  const missing=[...new Set(blobs)].filter(blob=>!cache.has(blob));
  if(missing.length) {
    const got=readBlobs?readBlobs(missing):new Map(missing.map(blob=>[blob,readBlob(blob)]));
    for(const blob of missing)cache.set(blob,Buffer.from(got.get(blob)).toString('utf8'));
  }
}
// The questions and exam files the 4slot modules name, and the metadata/runtime rows that belong to them.
export function fourSlotCohort(rows, readBlob, readBlobs) {
  const files=rows.filter(row=>FOUR_SLOT_COHORT_FILES.test(row.path));
  loadTexts(files.map(row=>row.blob),readBlob,readBlobs,smallText);
  const hex=new Set(),names=new Set();
  for(const row of files) {
    const text=smallText.get(row.blob);
    for(const m of text.matchAll(HEX64))hex.add(m[0]);
    if(WHOLE_BANK_TOOLS.has(baseName(row.path)))for(const m of text.matchAll(SOURCE_NAME))names.add(m[0]);
  }
  const scope=sha([...hex].sort().join('\n')+'\u0001'+[...names].sort().join('\n'));
  const uidIn=uid=>typeof uid==='string'&&uid.startsWith('qid_v1_')&&hex.has(uid.slice(7));
  const named=record=>uidIn(record?.questionUid)||names.has(baseName(record?.sourceArchiveFile));
  const picked=records=>{const list=records||[];return {count:list.length,rows:list.filter(named).map(record=>[record.questionUid,JSON.stringify(record)])};};
  const metadata=new Map();let total=0;
  const meta=rows.find(row=>row.path===FOUR_SLOT_META);
  const metaSources=meta?[meta]:rows.filter(row=>row.path.startsWith(FOUR_SLOT_META_SHARDS)&&row.path.endsWith('.json')&&!row.path.endsWith('/_head.json'));
  for(const row of metaSources) {
    const got=memoHeavy(`meta|${row.blob}|${scope}`,()=>{const data=JSON.parse(Buffer.from(readBlob(row.blob)).toString('utf8'));return picked(meta?data.records:data);});
    total+=got.count;for(const [uid,text] of got.rows)if(!metadata.has(uid))metadata.set(uid,text);
  }
  const uids=new Set([...metadata.keys()]);
  for(const h of hex)uids.add('qid_v1_'+h);
  const uidScope=sha([...uids].sort().join('\n'));
  const runtime=rows.filter(row=>row.path.startsWith(FOUR_SLOT_RUNTIME)&&row.path.endsWith('.json')&&row.path!==FOUR_SLOT_RUNTIME+'runtime-bridge-receipt.json')
    .sort((a,b)=>a.path<b.path?-1:1).map(row=>memoHeavy(`runtime|${row.path}|${row.blob}|${scope}|${uidScope}`,()=>{
      const data=JSON.parse(Buffer.from(readBlob(row.blob)).toString('utf8'));
      const chosen=(data.records||[]).filter(record=>uids.has(record?.questionUid)||named(record));
      return {path:row.path,status:data.status??null,packId:data.packId??null,rows:chosen.map(record=>JSON.stringify(record))};
    }));
  // compact 4칸 files: a metadata claim is the one thing that makes the builder read rows no text names
  const compact=rows.filter(row=>row.path.startsWith(FOUR_SLOT_COMPACT)&&row.path.endsWith('.json'));
  const unseen=compact.filter(row=>!claimFlag.has(row.blob));
  if(unseen.length) {
    const texts=new Map();loadTexts(unseen.map(row=>row.blob),readBlob,readBlobs,texts);
    for(const row of unseen)claimFlag.set(row.blob,METADATA_CLAIM.test(texts.get(row.blob)));
  }
  const claimed=compact.some(row=>claimFlag.get(row.blob));
  return {hex,names,uids,metadata,metadataTotal:total,runtime,claimed,metaSources,runtimeFiles:rows.filter(row=>row.path.startsWith(FOUR_SLOT_RUNTIME)&&row.path.endsWith('.json'))};
}
export function fourSlotDerivedInputs(rows, readBlob, readBlobs) {
  const cohort=fourSlotCohort(rows,readBlob,readBlobs);
  const evidence=rows.filter(row=>row.path.startsWith(FOUR_SLOT_EVIDENCE)&&!TYPE_ONLY_EVIDENCE.test(row.path))
    .sort((a,b)=>a.path<b.path?-1:1).map(row=>`${row.path}\0${row.mode}\0${row.blob}`);
  // Fail closed: with a metadata claim in play the lane depends on metadata and runtime as a whole, exactly like the old whole-file inputs.
  const whole=cohort.claimed?[...cohort.metaSources,...cohort.runtimeFiles].sort((a,b)=>a.path<b.path?-1:1).map(row=>`${row.path}\0${row.mode}\0${row.blob}`):null;
  const uids=[...cohort.uids].sort();
  return sha(json({version:FOUR_SLOT_DERIVED_VERSION,cohortUids:uids,metadataTotal:cohort.metadataTotal,
    metadataRows:[...cohort.metadata.entries()].sort(([a],[b])=>a<b?-1:1).map(([,text])=>text),runtime:cohort.runtime,evidence,whole}));
}
// Refusal/pending records are named like their request, so .gitignore (for example `*textbook*`) can match them.
// Those two directories alone are listed without the ignore rules; every other ignored file stays unlisted.
const RECORD_DIRS=['.archive-meta-register/rejected/','.archive-meta-register/pending-supplement/'];
const unstaged = root => unique([...splitZ(git(root,'diff','--name-only','--no-renames','-z')),
  ...splitZ(git(root,'ls-files','--others','--exclude-standard','-z')),
  ...splitZ(git(root,'ls-files','--others','-z','--',...RECORD_DIRS))]);
const changed = root => unique([...splitZ(git(root,'diff','HEAD','--name-only','--no-renames','-z')), ...unstaged(root)]);
function stage(root, files) {
  for(let i=0;i<files.length;i+=200)git(root,'--literal-pathspecs','add','-f','--',...files.slice(i,i+200));
}
function guardFiles(files, allowed, label) {
  const bad=files.filter(f=>!matches(f,allowed));
  if(bad.length)throw Error(`UNEXPECTED_${label}_PATHS:${bad.slice(0,15).join(',')}`);
}
function rollbackUnstaged(root, allowed) {
  const files=unstaged(root); guardFiles(files,allowed,'FAILED_LANE');
  const tracked=new Set(indexRows(root).map(r=>r.path));
  for(const file of files) {
    if(tracked.has(file))git(root,'--literal-pathspecs','restore','--worktree','--',file);
    else fs.rmSync(path.join(root,file),{force:true});
  }
}
function rollbackStaged(root, allowed) {
  const files=changed(root); guardFiles(files,allowed,'SHARED_ROLLBACK');
  // Only this fresh runner's explicitly allowlisted output is restored; raw inputs are never rollback targets.
  const inHead=new Set(splitZ(git(root,'ls-tree','-r','--name-only','-z','HEAD')));
  const inIndex=new Set(indexRows(root).map(r=>r.path));
  for(const file of files) {
    if(inHead.has(file))git(root,'--literal-pathspecs','restore','--source=HEAD','--staged','--worktree','--',file);
    else {
      if(inIndex.has(file))git(root,'--literal-pathspecs','rm','--cached','-f','--',file);
      fs.rmSync(path.join(root,file),{force:true});
    }
  }
}

const gitBlob=(root,blob)=>execFileSync('git',['cat-file','blob',blob],{cwd:root,maxBuffer:1<<30,stdio:['ignore','pipe','pipe']});
export function nativeLanes(root,{readBlob=blob=>gitBlob(root,blob),readBlobs=blobs=>readBlobsBatch(root,blobs)}={}) {
  const config=read(root,'.archive-meta-register/auto/config.json',{});
  const parentRetry=canonicalParentRetryRequests(root)[0]||null;
  const shared=specs(root,'tools/ci/archive-pages-registration.paths');
  const reviewed=specs(root,'tools/ci/archive-meta-register-commit.paths');
  const reviewedScoped=specs(root,'tools/ci/archive-meta-register-trigger-paths.txt').filter(p=>!p.includes('*'));
  const auto=[...shared,'.archive-meta-register/auto/state.json','.archive-meta-register/auto/requests/*.json',
    '.archive-meta-register/auto/receipts/*.json','.archive-meta-register/auto/last-verification.json'];
  const generated=[...shared,'archive/generated/lite/v1/','archive/data/generated-lite-consumer/v1/',
    'archive/assets/generated-lite/','archive/data/meta-foundation/crosswalks/sealed-digests.v1.json'];
  const fourSlot=['archive/data/item-4slot-index.json','.archive-meta-register/auto/4slot/last-verification.json',
    '.archive-meta-register/auto/4slot/receipts/*.json'];
  const studentIndexes=['archive/data/svg-accessibility-index.js','archive/data/archive2-extension-keys.json'];
  // Advancing the accessibility coverage base can discard prior unmanifested derived rows. Retain the
  // committed compiler's fixed base, then record that parameter with this lane's byte-bound proof.
  let accessibilityBase=read(root,STATE,{lanes:{}}).lanes?.studentIndexes?.parameters?.accessibilityBase;
  if(!accessibilityBase) {
    const context={};vm.runInNewContext(fs.readFileSync(path.join(root,studentIndexes[0]),'utf8'),context,{timeout:5000});
    accessibilityBase=context.APSvgAccessibilityIndex?.buildScope?.baseRef;
  }
  if(!/^[a-f0-9]{40}$/.test(accessibilityBase||''))throw Error('ACCESSIBILITY_FIXED_COVERAGE_BASE_REQUIRED');
  const code=['archive/tools/','archive/build_db.py','tools/ci/archive-registration-writer.mjs','tools/ci/archive-registration-build-db.mjs','tools/ci/archive-registration-whitespace.mjs',
    'tools/ci/archive-pages-registration.paths','tools/ci/archive-meta-register-commit.paths',
    'tools/ci/archive-pages-registration-derive.sh','archive/archive2-core.js','archive/archive2-canonical.js',
    'archive/problem-bank-meta.js','archive/meta-foundation-runtime.js','archive/mixer-selector.js',
    'archive/archive2-source.js','archive/exam-source-reader.js','archive/unit-past-exams-core.js'];
  const registration=[...sourceQualityHoldDependencyPaths(root),'archive/exams/','archive/data/question_identity_map.json','archive/data/question_metadata.json',
    'archive/data/meta-foundation/','archive/data/master_tables/','archive/data/r2e-intake/',
    'archive/data/basic-scope-source-links.json','archive/data/basic-scope-parent-groups.json',
    'archive/data/textbook-source-manifest-v1.json','archive/data/basic-scope-parent-links.json',
    'archive/data/archive2-canonical-projection-policy.json',
    'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'];
  const cmd=(program,...args)=>({program,args});
  const sharedCommands=[cmd('bash','tools/ci/archive-pages-registration-derive.sh','materialize'),
    cmd('node','archive/tools/verify-archive-registration.mjs'),
    cmd('node','archive/tools/build-archive2-catalog.mjs','--check')];
  return [
    {id:'reviewed',inputs:[...code,...registration,'.archive-meta-register/inbox/',
      'tools/ci/reviewed-meta-register-pass.sh','tools/ci/register-reviewed-meta-requests.mjs',
      'tools/ci/archive-pr-native-preview.mjs',
      'tools/ci/collect-reviewed-consumer-refusals.mjs','tools/ci/verify-reviewed-projection-requests.mjs',
      'tools/ci/archive-meta-register-trigger-paths.txt','tools/ci/verify-registered-consumer-approval.sh',
      'tests/archive-reviewed-exam-registration-v2.test.mjs','tests/archive-reviewed-projection-phase.test.mjs','tests/archive-basic-scope-rebind.test.mjs',
      'tests/archive-difficulty5-register.test.mjs','tests/archive-type-judgment-registration.test.mjs','tests/archive-finalqa-nonpt-register.test.mjs',
      'tests/archive-finalqa-nonpt-real-geumdang.test.mjs'],outputs:reviewed,scopedInputs:reviewedScoped,
      commands:[{...cmd('bash','tools/ci/reviewed-meta-register-pass.sh'),timeoutMs:120*60000}],alwaysFinal:true,
      finalCommands:({env})=>fs.existsSync(path.join(env.RUNNER_TEMP,'archive-meta-register-pass/requests'))
        // Reuse its real checks before commit; its old post-push summary names HEAD as registered,
        // so use this writer's accurate PREPARED summary and the push helper's exact SHA instead.
        ?[{...cmd('bash','tools/ci/verify-registered-consumer-approval.sh'),env:{GITHUB_STEP_SUMMARY:'/dev/null'}}]:[]},
    // digestContinuation: queued backlog (needsContinuation) is drained by digest runs only; a merge run reruns this lane
    // only when its inputs changed, and never reports the backlog as finished.
    {id:'semantic',digestContinuation:true,inputs:[...code,...registration,...canonicalParentRetryDependencies(root),'.archive-meta-register/auto/config.json','.archive-meta-register/auto/state.json',
      'tools/ci/archive-main-auto-meta-pass.sh','tests/archive-question-identity-contract.test.mjs',
      'tests/archive-question-identity-runtime.test.mjs'],outputs:auto,enabled:config.enabled===true,
      commands:[{...cmd('bash','tools/ci/archive-main-auto-meta-pass.sh'),...(parentRetry?{env:{ARCHIVE_CANONICAL_PARENT_RETRY_REQUEST:parentRetry.path,ARCHIVE_CANONICAL_PARENT_RETRY_SHA256:parentRetry.sha256}}:{})}],
      finalCommands:({env})=>fs.existsSync(path.join(env.RUNNER_TEMP,'archive-main-auto-meta/report.json'))
        ?[cmd('node','archive/tools/meta-foundation/auto-register-merged-source.mjs','--verify','--report',path.join(env.RUNNER_TEMP,'archive-main-auto-meta/report.json'))]:[],
      continuation:({root,env})=>{
        const pending=read(root,'.archive-meta-register/auto/state.json',{pending:{}}).pending||{};
        const report=read(env.RUNNER_TEMP,'archive-main-auto-meta/report.json',{results:[]});
        const attempted=new Set((report.results||[]).map(r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`));
        // Early native refusals can have no attemptSignature (for example a removed target). They
        // are still observed pending debt, not an unprocessed batch: retry only entries absent from
        // this exact run's results, otherwise stable refusals would rebuild forever on identical input.
        return canonicalParentRetryRequests(root).length>0||Object.keys(pending).some(key=>!attempted.has(key));
      }},
    {id:'shared',inputs:[...code,...registration,'archive/assets/','archive/data/generated-lite-consumer/v1/',
      'archive/db.js','archive/question-index.js','archive/question-identity.js'],outputs:shared,required:true,
      commands:sharedCommands,finalCommands:sharedCommands},
    {id:'generated',inputs:[...code,'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/',
      'archive/exams/','archive/generated/lite/v1/','archive/assets/generated-lite/',
      'archive/data/generated-source-import-roots-v1.json','archive/data/evidence-authority/v1/',
      'archive/data/generated-lite-consumer/v1/','archive/data/meta-foundation/'],outputs:generated,required:true,
      commands:[cmd('node','archive/tools/generated-meta/compile-qid9-main-source.mjs','--write'),
        cmd('node','archive/tools/generated-meta/compile-qid9-main-source.mjs','--check'),
        cmd('node','archive/tools/generated-meta/auto-register-approved-qid9.mjs','--write'),
        {...cmd('node','archive/tools/generated-meta/auto-register-approved-qid9.mjs','--check'),advisory:true},
        cmd('node','archive/tools/generated-meta/rebuild-main-source-consumer.mjs','--write'),
        cmd('node','archive/tools/generated-meta/rebuild-main-source-consumer.mjs','--check'),
        cmd('node','archive/tools/generated-meta/verify-qid9-main-source-projection.mjs')],
      finalCommands:[cmd('node','archive/tools/generated-meta/rebuild-main-source-consumer.mjs','--check'),
        cmd('node','archive/tools/generated-meta/verify-qid9-main-source-projection.mjs')]},
    {id:'studentIndexes',inputs:['archive/exams/','archive/generated/','archive/textbook/','archive/assets/',
      'archive/data/svg-accessibility-manifest.v1.json','archive/data/meta-foundation/extensions/',
      'archive/data/generated-source-import-roots-v1.json',...code],outputs:studentIndexes,required:true,
      parameters:{accessibilityBase},
      commands:[cmd('node','archive/tools/build-svg-accessibility-index.cjs','--base',accessibilityBase),
        cmd('node','archive/tools/build-archive2-extension-keys.mjs')]},
    {id:'fourSlot',inputs:[...BOUNDED_RENDERER_UI_INPUTS,'archive/exams/','archive/data/question_identity_map.json','archive/data/item-4slot/',
      '.archive-meta-register/4slot-existing-vector-continuity/',
      '.archive-meta-register/4slot-renderer-continuity/','.archive-meta-register/4slot-*','.archive-meta-register/evidence/',
      'archive/data/meta-foundation/canonical/','archive/data/meta-foundation/compiled/','archive/tools/meta-foundation/',
      'archive/assets/','docs/architecture/4slot/','archive/item-4slot.js','tools/4slot/',
      'tools/ci/archive-four-slot-pass.sh','tools/ci/archive-registration-writer.mjs','tools/ci/archive-registration-whitespace.mjs','.archive-meta-register/auto/config.json'],
      // Preserve the existing independent 4slot failure policy; failed output is rolled back and
      // retryable, while validated ordinary exam publication can continue with the prior index.
      // question_metadata.json, the Meta Foundation runtime packs and the reviewed-exam-meta evidence are not listed as paths: the lane depends on
      // them only through its continuity cohorts, so derivedInputs() digests exactly those (fourSlotDerivedInputs above).
      outputs:fourSlot,required:false,enabled:config.fourSlotEnabled!==false,derivedInputs:rows=>fourSlotDerivedInputs(rows,readBlob,readBlobs),
      commands:[cmd('bash','tools/ci/archive-four-slot-pass.sh')]}
  ];
}

export function executeCommands({root, work, lane, env}) {
  const advisories=[],commandTimings=[];
  for(const [n,command] of lane.commands.entries()) {
    const logfile=path.join(work,`${lane.logId||lane.id}-${n+1}.log`),fd=fs.openSync(logfile,'w'),startedAt=Date.now();
    let result;
    const isolatedGroup=process.platform!=='win32';
    try { result=spawnSync(command.program,command.args,{cwd:root,env:{...env,...command.env},stdio:['ignore',fd,fd],
      timeout:command.timeoutMs??25*60000,killSignal:'SIGKILL',detached:isolatedGroup}); }
    finally {
      // A timed-out shell must not leave a native child writing after the lane has been rolled back.
      // These commands own no long-lived servers: clean only the process group created for this command.
      if(isolatedGroup&&result?.pid) {
        try { process.kill(-result.pid,'SIGKILL'); }
        catch(error) { if(error.code!=='ESRCH')throw Error('UNEXPECTED_CHILD_PROCESS_CLEANUP_FAILURE:'+error.code); }
      }
      fs.closeSync(fd);
    }
    // Instrumentation only: wall time of this native command, bounded label, never part of any digest.
    commandTimings.push({n:n+1,command:[command.program,...command.args].join(' ').slice(0,120),durationMs:Date.now()-startedAt,exitCode:result.status});
    if(result.status!==0) {
      const detail={command:[command.program,...command.args],exitCode:result.status,signal:result.signal,
        log:logfile,error:String(result.error?.message||fs.readFileSync(logfile,'utf8').slice(-3000))};
      if(command.advisory){advisories.push(detail);continue;}
      const e=Error(`NATIVE_COMMAND_FAILED:${lane.id}:${n+1}`);e.detail=detail;e.commandTimings=commandTimings;throw e;
    }
  }
  return {advisories,commandTimings};
}

function checkPreserved(root,beforeRows,beforeSeals) {
  const afterRows=indexRows(root), byPath=new Map(afterRows.map(r=>[r.path,r]));
  const immutable=['archive/exams/','archive/assets/images/','archive/data/item-4slot/','alive/',
    '.archive-meta-register/auto/receipts/','.archive-meta-register/auto/4slot/receipts/',
    'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/',
    'archive/data/generated-lite-consumer/v1/meta-browse-alias-receipt-20261009.json',
    'archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json'];
  for(const row of beforeRows.filter(r=>matches(r.path,immutable))) {
    const after=byPath.get(row.path);
    if(!after||after.blob!==row.blob||after.mode!==row.mode)throw Error('IMMUTABLE_INPUT_OR_RECEIPT_CHANGED:'+row.path);
  }
  const seals=read(root,'archive/data/meta-foundation/crosswalks/sealed-digests.v1.json',{entries:[]});
  const after=new Map((seals.entries||[]).map(e=>[`${e.path}\0${e.sha256}`,JSON.stringify(e)]));
  for(const e of beforeSeals.entries||[])if(after.get(`${e.path}\0${e.sha256}`)!==JSON.stringify(e))throw Error('EXISTING_CROSSWALK_SEAL_CHANGED');
}

// A request that left the inbox must be applied (the pass's applied list) or have its rejected/pending record in the
// index. A new record whose name .gitignore matches (for example `*textbook*`) never reaches the index, so only the
// inbox deletion would be committed: the request would vanish, neither applied nor rejected.
const INBOX='.archive-meta-register/inbox/',REJECTED='.archive-meta-register/rejected/',PENDING='.archive-meta-register/pending-supplement/';
export function silentInboxDrops(root,before,nativeWork) {
  const after=new Set(indexRows(root).map(r=>r.path)),appliedFile=path.join(nativeWork,'archive-meta-register-pass','applied.txt');
  const applied=new Set(fs.existsSync(appliedFile)?fs.readFileSync(appliedFile,'utf8').split(/\r?\n/).filter(Boolean).map(p=>path.posix.basename(p.replace(/\\/g,'/'))):[]);
  return before.map(r=>r.path).filter(p=>p.startsWith(INBOX)&&p.endsWith('.json')&&!p.slice(INBOX.length).includes('/')&&!after.has(p))
    .map(p=>p.slice(INBOX.length)).filter(name=>!applied.has(name)
      &&!(after.has(REJECTED+name)&&after.has(REJECTED+name.replace(/\.json$/,'.rejection.json')))&&!after.has(PENDING+name));
}

function assertClean(root) {
  if(git(root,'status','--porcelain=v1','--untracked-files=all').trim())throw Error('WRITER_REQUIRES_CLEAN_RUNNER');
}
function stateAt(root) {
  const state=read(root,STATE,{schemaVersion:VERSION,lanes:{},blockedLanes:[]});
  if(state.schemaVersion!==VERSION||!state.lanes||typeof state.lanes!=='object'||Array.isArray(state.lanes)
    ||(state.blockedLanes!==undefined&&!Array.isArray(state.blockedLanes)))throw Error('WRITER_STATE_SCHEMA_MISMATCH');
  return state;
}
function assess(rows,state,lanes,mode='digest') {
  const blocked=new Set(state.blockedLanes||[]);
  const results=lanes.map(lane=>{
    const enabled=lane.enabled!==false,inputDigest=inputFingerprint(rows,lane),outputDigest=fingerprint(rows,lane.outputs);
    const cached=state.lanes[lane.id];
    const scopedInputDigest=lane.scopedInputs?fingerprint(rows,lane.scopedInputs):undefined;
    const scopeChanged=lane.scopedInputs&&cached?.scopedInputDigest!==scopedInputDigest;
    const deferrable=mode==='merge'&&lane.digestContinuation===true;
    const needed=Boolean(blocked.has(lane.id)||(cached?.needsContinuation===true&&!deferrable)||cached?.enabled!==enabled||cached?.inputDigest!==inputDigest||cached?.outputDigest!==outputDigest||scopeChanged);
    // Not needed in a merge run is not the same as nothing left: the queued backlog stays visible.
    const backlogDeferred=!needed&&enabled&&deferrable&&cached?.needsContinuation===true;
    return {id:lane.id,enabled,required:lane.required===true,needed,inputDigest,outputDigest,...(lane.scopedInputs?{scopedInputDigest}:{}),
      ...(backlogDeferred?{backlogDeferred:true}:{}),
      status:needed?'NEEDS_REGISTRATION':enabled?(backlogDeferred?'VERIFIED_REUSED_BACKLOG_REMAINS':'VERIFIED_REUSED'):'DISABLED'};
  });
  return {lanes:results,needed:results.some(r=>r.needed),backlogDeferred:results.some(r=>r.backlogDeferred),
    publishable:results.filter(r=>r.required&&r.enabled).every(r=>!r.needed)&&results.some(r=>r.required&&r.enabled),
    inputDigest:sha(json(results.map(({id,enabled,inputDigest})=>({id,enabled,inputDigest})))),
    outputDigest:fingerprint(rows,unique(lanes.flatMap(l=>l.outputs)))};
}
function evidenceDir(root,work,env) {
  const dir=path.resolve(work||path.join(env.RUNNER_TEMP||'/tmp','archive-registration-writer'));
  if(dir===root||dir.startsWith(root+path.sep))throw Error('WRITER_EVIDENCE_MUST_BE_OUTSIDE_CHECKOUT');
  fs.mkdirSync(dir,{recursive:true});
  return dir;
}
function writeEvidence(work,report,outputs) {
  fs.writeFileSync(path.join(work,'report.json'),json(report));
  if(outputs)fs.writeFileSync(path.join(work,'commit.paths'),[...outputs,STATE].join('\n')+'\n');
}

// Read-only run instrumentation. Everything below only reads the native producers' uncommitted run files and
// writes into this writer's evidence report; no lane digest, writer-state.json or committed output uses it.
const TOP_N=20;
const readJsonSafe=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}};
const embeddedJson=text=>{const a=text.indexOf('{'),b=text.lastIndexOf('}');if(a<0||b<a)return null;try{return JSON.parse(text.slice(a,b+1));}catch{return null;}};
export function readStageTimes(file) {
  let text;try{text=fs.readFileSync(file,'utf8');}catch{return null;}
  const rows=[];
  for(const line of text.split(/\r?\n/)) {
    if(!line.trim()||rows.length>=40)continue;
    try{const r=JSON.parse(line);if(typeof r.stage==='string'&&Number.isFinite(r.durationMs)){
      // A step time below zero is a wall-clock step-back, never a duration: show 0 and keep the fact it was adjusted.
      const adjusted=r.clockAdjusted===true||r.durationMs<0;
      rows.push({stage:r.stage.slice(0,64),durationMs:Math.max(0,r.durationMs),exitCode:Number(r.exitCode)||0,...(adjusted?{clockAdjusted:true}:{})});
    }}catch{/* partial last line */}
  }
  return rows;
}
// materialize-meta-v2-payloads silently skips a META_V2 payload whose recorded exam blob differs from the current
// exam source (it only lists them in its own stdout JSON). Lift that list: per payload file, with its question count.
export function staleMaterializedPayloads(root, summary) {
  if(!summary||typeof summary!=='object'||!Array.isArray(summary.stalePayloads))return null;
  const base=path.resolve(root),files=summary.stalePayloads.map(rel=>{
    const row={payload:String(rel).slice(0,200),sourceArchiveFile:null,rows:null},full=path.resolve(base,String(rel));
    if(full.startsWith(base+path.sep)) {
      const p=readJsonSafe(full);
      if(p){row.sourceArchiveFile=typeof p.sourceArchiveFile==='string'?p.sourceArchiveFile.slice(0,200):null;row.rows=Array.isArray(p.rows)?p.rows.length:null;}
    }
    return row;
  }).sort((a,b)=>(b.rows??0)-(a.rows??0)||(a.payload<b.payload?-1:a.payload>b.payload?1:0));
  return {reason:'SOURCE_BLOB_MISMATCH',count:Number.isInteger(summary.stalePayloadCount)?summary.stalePayloadCount:files.length,
    questions:files.reduce((n,f)=>n+(f.rows||0),0),questionsUnknownFor:files.filter(f=>f.rows===null).length,
    files:files.slice(0,TOP_N),otherFiles:Math.max(0,files.length-TOP_N),otherQuestions:files.slice(TOP_N).reduce((n,f)=>n+(f.rows||0),0)};
}
export function laneInstrumentation({laneId, nativeWork, sharedEvidence, root, result}) {
  const out={};
  if(Array.isArray(result?.commandTimings)&&result.commandTimings.length)out.commands=result.commandTimings.slice(0,24);
  try {
    if(laneId==='semantic') {
      const dir=path.join(nativeWork,'archive-main-auto-meta'),stages=readStageTimes(path.join(dir,'stage-times.jsonl'));
      if(stages)out.stages=stages;
      const auto=readJsonSafe(path.join(dir,'report.json'))?.instrumentation;
      if(auto)out.autoMeta=auto;
      const stale=staleMaterializedPayloads(root,readJsonSafe(path.join(dir,'materialize.json')));
      if(stale)out.staleMetaV2Payloads=stale;
    } else if(laneId==='fourSlot') {
      const stages=readStageTimes(path.join(nativeWork,'archive-four-slot','stage-times.jsonl'));
      if(stages)out.stages=stages;
    } else if(laneId==='shared') {
      let text=null;try{text=fs.readFileSync(path.join(sharedEvidence,'meta-v2-materializer-write.log'),'utf8');}catch{/* lane did not materialize */}
      const stale=text&&staleMaterializedPayloads(root,embeddedJson(text));
      if(stale)out.staleMetaV2Payloads=stale;
    }
  } catch(error) { out.collectionError=String(error.message||error).slice(0,200); }
  return Object.keys(out).length?out:undefined;
}

// Bounded human-readable view of the run instrumentation (tables are cut; full data stays in report.json).
function renderInstrumentation(lanes, cell) {
  const lines=[],sec=n=>Number.isFinite(n)?(n/1000).toFixed(1):'-',withInstr=lanes.filter(r=>r.instrumentation);
  const timed=lanes.filter(r=>Number.isFinite(r.durationMs));
  if(timed.length)lines.push('','#### Lane time','','| lane | result | seconds |','| --- | --- | ---: |',
    ...timed.slice(0,24).map(r=>`| ${cell(r.id,64)} | ${cell(r.status,32)} | ${sec(r.durationMs)} |`));
  for(const r of withInstr.slice(0,8)) {
    const i=r.instrumentation;
    if(i.stages?.length)lines.push('',`#### ${cell(r.id,40)}: time per step`,'','| step | seconds | exit |','| --- | ---: | ---: |',
      ...i.stages.slice(0,24).map(s=>`| ${cell(s.stage,48)} | ${sec(s.durationMs)} | ${Number(s.exitCode)||0} |`));
    else if(i.commands?.length>1)lines.push('',`#### ${cell(r.id,40)}: time per command`,'','| command | seconds | exit |','| --- | ---: | ---: |',
      ...i.commands.slice(0,12).map(c=>`| ${cell(c.command,64)} | ${sec(c.durationMs)} | ${Number(c.exitCode)||0} |`));
  }
  const auto=[...withInstr].reverse().find(r=>r.instrumentation.autoMeta)?.instrumentation.autoMeta;
  if(auto?.run) {
    const run=auto.run,o=auto.origin,b=auto.backlogAfterRun;
    lines.push('','#### Automatic registration (this run)','',
      `targets=${run.targets}; attempted=${run.attempted} (limit ${run.batchLimit}); registered=${run.applied} UIDs (${run.requestFiles} request, ${run.receiptFiles} receipt files); already registered=${run.alreadyRegistered}; refused=${run.refused}; skipped unchanged=${run.unchangedSkipped}; not reached (limit)=${run.notReachedBudget}`);
    const g=auto.registration;
    if(g)lines.push('','| registration | value |','| --- | --- |',
      `| mode | ${cell(g.mode,16)} (${g.mode==='merge'?'only the questions this merge changed':'this merge plus the queued backlog'}) |`,
      `| backlog remaining (all queued) | ${Number(g.backlogRemaining)||0} |`,
      `| this merge's questions not processed (limit) | ${Number(g.mergeNotReached)||0} |`,
      `| merge leftovers still queued | ${Number(g.mergeBacklog)||0} |`);
    if(o?.available)lines.push('',`This merge's questions: ${o.thisMergeDiff.questions} (${o.thisMergeDiff.changedExamFiles} exam files; attempted ${o.thisMergeDiff.attempted}; not reached because of the limit ${o.thisMergeQuestionsNotReachedBecauseOfBudget}). Queued backlog questions in this run: ${o.queuedBacklog.questions} (attempted ${o.queuedBacklog.attempted}).`);
    const files=auto.attemptedByFile;
    if(files?.top?.length)lines.push('','| attempted exam file | attempted | registered | already | refused |','| --- | ---: | ---: | ---: | ---: |',
      ...files.top.slice(0,TOP_N).map(f=>`| ${cell(f.name,80)} | ${f.total} | ${f.registered} | ${f.alreadyRegistered} | ${f.refused} |`),
      ...(files.otherFiles?[`| (${files.otherFiles} more files) | ${files.otherCount} | | | |`]:[]));
    if(b) {
      lines.push('',`Backlog after run: pending=${b.pendingTotal} (before run ${auto.pendingBeforeRun}); never signed/attempted=${b.withoutAttemptSignature}; attempted and refused=${b.attemptedRefused}; refusal reason atoms=${b.reasonAtomTotal} (an entry can carry several reasons: ${b.entriesWithMultipleReasons} do); distinct base commits=${b.distinctBaseCommits}`);
      if(b.oldestBaseCommit)lines.push(`Oldest base commit: ${cell(b.oldestBaseCommit.commit,12)} (${cell(b.oldestBaseCommit.committedAt,25)}), ${b.oldestBaseCommit.count} entries.`);
      if(b.reasons?.top?.length)lines.push('','| refusal reason | entries |','| --- | ---: |',
        ...b.reasons.top.slice(0,10).map(x=>`| ${cell(x.name,80)} | ${x.count} |`),
        ...(b.reasons.top.length>10||b.reasons.otherNames?[`| (other reasons) | ${b.reasons.top.slice(10).reduce((n,x)=>n+x.count,0)+b.reasons.otherCount} |`]:[]));
    }
  }
  for(const r of withInstr.slice(0,8)) {
    const s=r.instrumentation.staleMetaV2Payloads;
    if(!s)continue;
    lines.push('',`#### Reviewed payloads skipped because the exam source changed (${cell(r.id,40)}): ${s.count} payloads, ${s.questions} questions`);
    if(s.files.length)lines.push('','| payload | exam file | questions |','| --- | --- | ---: |',
      ...s.files.slice(0,10).map(f=>`| ${cell(f.payload,80)} | ${cell(f.sourceArchiveFile,60)} | ${f.rows??'?'} |`),
      ...(s.files.length>10||s.otherFiles?[`| (${Math.max(0,s.files.length-10)+s.otherFiles} more payloads) | | ${s.files.slice(10).reduce((n,f)=>n+(f.rows||0),0)+s.otherQuestions} |`]:[]));
  }
  return lines;
}

// Native producers retain their complete JSON/error summaries in the uploaded
// evidence directory. Only this bounded overview reaches GitHub's 1 MiB step
// summary, including when a main race repeats preparation in the persist step.
export function renderRegistrationSummary(result) {
  const cell=(value,max=96)=>String(value??'').replace(/[|\r\n]/g,' ').slice(0,max);
  const lanes=Array.isArray(result.lanes)?result.lanes:[], shown=lanes.slice(0,24);
  const failed=lanes.filter(r=>['FAILED','ROLLED_BACK','STALE_DEPENDENCY'].includes(r.status)).length;
  const lines=[`### Archive registration writer: ${cell(result.status)}`,'',
    `registration_ready=${result.registrationReady===true}; staged paths=${result.changedPaths?.length||0}; lanes=${lanes.length}; failed or rolled back=${failed}`,'',
    '| lane | result | error code |','| --- | --- | --- |',
    ...shown.map(r=>`| ${cell(r.id,64)} | ${cell(r.status,48)} | ${cell(r.error,100)} |`)];
  if(shown.length<lanes.length)lines.push('',`${lanes.length-shown.length} additional lane records are in report.json.`);
  if(result.backlogDeferred===true)lines.push('','Queued registration work remains (not needed in this merge run). The scheduled or manual digest run continues it; this is not a completed registration.');
  // A malformed instrumentation object must never turn a finished preparation into a failed run.
  try { lines.push(...renderInstrumentation(lanes,cell)); }
  catch { lines.push('','Instrumentation summary could not be rendered (see report.json).'); }
  if(result.whitespace)lines.push('',`Git whitespace: ${cell(result.whitespace.status)}; raw Git exit=${cell(result.whitespace.rawGitExitCode,12)}; inherited source lines=${Number(result.whitespace.inheritedLineCount)||0}; byte-bound assets=${result.whitespace.inheritedAssets?.length||0}.`);
  lines.push('','Full report.json, native-step-summary.md and native command logs are retained in the archive-main-registration workflow artifact.','');
  return lines.join('\n');
}

// Recovery checks only the checked-out snapshot. It does not fetch main, run producers or edit Git data.
export function checkRegistration({root=ROOT,work,lanes=nativeLanes(root),env=process.env}={}) {
  root=path.resolve(root);assertClean(root);
  const registration=inferRegistrationMode(env);
  const assessment=assess(indexRows(root),stateAt(root),lanes,registration);
  const report={schemaVersion:VERSION,mode:'check',registrationMode:registration,inputSha:git(root,'rev-parse','HEAD').trim(),...assessment,
    registrationReady:assessment.publishable,safeToPersist:false,changedPaths:[],
    status:assessment.needed?(assessment.publishable?'REGISTRATION_PARTIAL':'REGISTRATION_REQUIRED'):assessment.backlogDeferred?'REGISTERED_WITH_BACKLOG':'REGISTERED'};
  if(work)writeEvidence(evidenceDir(root,work,env),report);
  return report;
}

export async function prepareRegistration({root=ROOT,work,execute=executeCommands,lanes=nativeLanes(root),env=process.env}={}) {
  root=path.resolve(root);assertClean(root);
  if(env.GITHUB_ACTIONS==='true'&&(env.GITHUB_EVENT_NAME==='pull_request'||env.GITHUB_REF!=='refs/heads/main'))throw Error('MAIN_ONLY_WRITER');
  if(new Set(lanes.map(l=>l.id)).size!==lanes.length||lanes.some((l,i)=>l.id==='fourSlot'&&i!==lanes.length-1))throw Error('INVALID_LANE_ORDER');
  work=evidenceDir(root,work,env);
  const registration=inferRegistrationMode(env);
  const inputSha=git(root,'rev-parse','HEAD').trim(),before=indexRows(root),old=stateAt(root);
  const initialSeals=read(root,'archive/data/meta-foundation/crosswalks/sealed-digests.v1.json',{entries:[]});
  const allOutputs=unique(lanes.flatMap(l=>l.outputs));
  const report={schemaVersion:VERSION,mode:'prepare',registrationMode:registration,inputSha,status:'PREPARING',safeToPersist:false,registrationReady:false,
    sourceMutation:0,independentReviewClaim:false,lanes:[],changedPaths:[]};
  writeEvidence(work,report); // An interrupted retry cannot leave an earlier attempt's publishable report.
  // A lane this run does not handle (--required-only) keeps its earlier cache entry and blocked mark.
  const next={schemaVersion:VERSION,lanes:{...old.lanes},blockedLanes:(old.blockedLanes||[]).filter(id=>!lanes.some(lane=>lane.id===id))};
  const laneState=new Map();
  // A retry gets fresh native reports; an earlier attempt's PASS may never certify the new snapshot.
  const nativeWork=path.join(work,'native');fs.rmSync(nativeWork,{recursive:true,force:true});fs.mkdirSync(nativeWork,{recursive:true});
  const buildPrepareId=crypto.randomUUID();
  const writerEnv={...env,RUNNER_TEMP:nativeWork,RELEASE_EVIDENCE_DIR:path.join(work,'shared'),
    ARCHIVE_REGISTRATION_BUILD_PREPARE_ID:buildPrepareId,
    ARCHIVE_REGISTRATION_BUILD_CACHE_DIR:path.join(work,'build-cache',buildPrepareId),
    GITHUB_STEP_SUMMARY:path.join(work,'native-step-summary.md'),
    [REGISTRATION_MODE_ENV]:registration,
    NODE_OPTIONS:env.NODE_OPTIONS||'--max-old-space-size=6144'};
  fs.mkdirSync(writerEnv.RELEASE_EVIDENCE_DIR,{recursive:true});
  let sharedPassed=true,finalChecked=false;
  const environmentFor=(lane,record,rows=indexRows(root))=>{
    if(!lane.scopedInputs)return writerEnv;
    const scopedInputDigest=fingerprint(rows,lane.scopedInputs);
    record.scopedInputDigest=scopedInputDigest;
    record.scopedValidationRequired=record.scopedValidationRequired||old.lanes[lane.id]?.scopedInputDigest!==scopedInputDigest;
    return {...writerEnv,ARCHIVE_META_SCOPED:String(record.scopedValidationRequired)};
  };

  const rollbackShared=()=>{
    rollbackStaged(root,allOutputs);
    for(const previous of report.lanes.filter(r=>r.status==='VERIFIED'&&r.id!=='fourSlot'))previous.status='ROLLED_BACK';
    const shared=laneState.get('shared');
    if(shared&&shared.status==='NO_OP')shared.status='ROLLED_BACK';
    sharedPassed=false;
  };
  const proofMatches=(lane,record,rows=indexRows(root))=>record.verifiedInputDigest===inputFingerprint(rows,lane)
    &&record.verifiedOutputDigest===fingerprint(rows,lane.outputs);
  const finishShared=async()=>{
    if(finalChecked)return;finalChecked=true;
    if(!sharedPassed)return;
    // A final rebuild can alter an earlier producer's dependencies. Revalidate on the actual staged
    // tree, at most two convergence rounds, and never relabel an old PASS with the new digest.
    const finalLanes=lanes.filter(l=>laneState.has(l.id)&&l.enabled!==false);
    finalLanes.sort((a,b)=>Number(b.id==='shared')-Number(a.id==='shared'));
    for(let round=0;round<2;round++) {
      for(const lane of finalLanes) {
        const record=laneState.get(lane.id);
        if(!['VERIFIED','NO_OP'].includes(record.status))continue;
        const dependencyChanged=!proofMatches(lane,record);
        if(!dependencyChanged&&!(lane.alwaysFinal&&record.status==='VERIFIED'&&!record.finalChecked))continue;
        const executionEnv=environmentFor(lane,record);
        const checks=typeof lane.finalCommands==='function'?lane.finalCommands({root,work,env:executionEnv}):(lane.finalCommands||[]);
        // With no reusable native report (for example a previously NO_OP AutoMeta lane), run its
        // real producer/validation again. An empty final command list is not evidence for new inputs.
        const regenerated=checks.length===0;
        const finalId=lane.id+(regenerated?'Regenerated':'Final')+(round?String(round+1):'');
        const finalLane={...lane,id:regenerated?lane.id:lane.id+'Final',logId:finalId,
          commands:regenerated?lane.commands:checks};
        const finalRecord={id:finalId,status:'RUNNING',reason:dependencyChanged?'DEPENDENCY_OR_OUTPUT_CHANGED':'FINAL_CONSUMER'};
        report.lanes.push(finalRecord);
        try {
          const result=await execute({root,work,lane:finalLane,env:executionEnv,prior:laneState});
          const finalInstrumentation=regenerated?laneInstrumentation({laneId:lane.id,nativeWork,sharedEvidence:writerEnv.RELEASE_EVIDENCE_DIR,root,result}):undefined;
          if(finalInstrumentation)finalRecord.instrumentation=finalInstrumentation;
          // AutoMeta's native verify persists its deterministic last-verification record.
          const files=unstaged(root);guardFiles(files,lane.outputs,'FINAL_CONSUMER');stage(root,files);
          checkPreserved(root,before,initialSeals);
          const verifiedRows=indexRows(root);
          Object.assign(record,{status:'VERIFIED',finalChecked:true,verifiedInputDigest:inputFingerprint(verifiedRows,lane),
            verifiedOutputDigest:fingerprint(verifiedRows,lane.outputs),
            needsContinuation:lane.continuation?lane.continuation({root,env:executionEnv}):false});
          Object.assign(finalRecord,{status:'VERIFIED',changedCount:files.length,advisories:result?.advisories||[]});
        } catch(error) {
          if(/^UNEXPECTED_|^IMMUTABLE_|^EXISTING_CROSSWALK/.test(error.message))throw error;
          Object.assign(finalRecord,{status:'FAILED',error:error.message,...(error.detail?{detail:error.detail}:{})});
          rollbackShared();return;
        }
      }
      if(finalLanes.every(l=>!['VERIFIED','NO_OP'].includes(laneState.get(l.id).status)||proofMatches(l,laneState.get(l.id))))return;
    }
    for(const lane of finalLanes) {
      const record=laneState.get(lane.id);
      if(['VERIFIED','NO_OP'].includes(record.status)&&!proofMatches(lane,record)) {
        record.status='STALE_DEPENDENCY';record.error='FINAL_INPUT_OR_OUTPUT_DID_NOT_CONVERGE';
      }
    }
    if(finalLanes.some(l=>l.required&&laneState.get(l.id).status==='STALE_DEPENDENCY'))rollbackShared();
  };

  for(const lane of lanes) {
    // 4slot consumes the final verified identity map, or the preserved baseline after shared rollback.
    if(lane.id==='studentIndexes'||lane.id==='fourSlot')await finishShared();
    const current=indexRows(root),assessment=assess(current,old,[lane],registration).lanes[0];
    const needed=assessment.needed;
    // A lane that does not run keeps the queued-work flag it had: skipping it never erases remaining backlog.
    const record={...assessment,status:needed?'RUNNING':'NO_OP',needed,verifiedInputDigest:assessment.inputDigest,
      verifiedOutputDigest:assessment.outputDigest,needsContinuation:!needed&&old.lanes[lane.id]?.needsContinuation===true};
    report.lanes.push(record);laneState.set(lane.id,record);
    if(lane.enabled===false){record.status='DISABLED';continue;}
    if(!needed)continue;
    const started=Date.now();
    try {
      const executionEnv=environmentFor(lane,record,current);
      const result=await execute({root,work,lane,env:executionEnv,prior:laneState});
      const instrumentation=laneInstrumentation({laneId:lane.id,nativeWork,sharedEvidence:writerEnv.RELEASE_EVIDENCE_DIR,root,result});
      const files=unstaged(root);guardFiles(files,lane.outputs,lane.id.toUpperCase());stage(root,files);
      checkPreserved(root,before,initialSeals);
      Object.assign(record,{status:'VERIFIED',durationMs:Date.now()-started,changedCount:files.length,advisories:result?.advisories||[],
        ...(instrumentation?{instrumentation}:{}),
        verifiedInputDigest:inputFingerprint(indexRows(root),lane),verifiedOutputDigest:fingerprint(indexRows(root),lane.outputs),
        needsContinuation:lane.continuation?lane.continuation({root,env:executionEnv}):false});
    } catch(error) {
      // Unexpected source writes are never waived or hidden behind lane isolation.
      if(/^UNEXPECTED_|^IMMUTABLE_|^EXISTING_CROSSWALK/.test(error.message))throw error;
      const instrumentation=laneInstrumentation({laneId:lane.id,nativeWork,sharedEvidence:writerEnv.RELEASE_EVIDENCE_DIR,root,result:error});
      rollbackUnstaged(root,lane.outputs);
      Object.assign(record,{status:'FAILED',durationMs:Date.now()-started,error:error.message,...(error.detail?{detail:error.detail}:{}),
        ...(instrumentation?{instrumentation}:{})});
      if(lane.id==='shared')rollbackShared();
    }
  }
  await finishShared();
  const rows=indexRows(root);
  for(const lane of lanes) {
    const result=laneState.get(lane.id);
    if(['VERIFIED','NO_OP'].includes(result.status)) {
      if(!proofMatches(lane,result,rows))throw Error('FINAL_DEPENDENCY_DRIFT:'+lane.id);
      next.lanes[lane.id]={enabled:true,inputDigest:result.verifiedInputDigest,outputDigest:result.verifiedOutputDigest,
        needsContinuation:result.needsContinuation===true,...(lane.parameters?{parameters:lane.parameters}:{}),
        ...(lane.scopedInputs?{scopedInputDigest:result.scopedInputDigest}:{})};
    } else if(result.status==='DISABLED')next.lanes[lane.id]={enabled:false,inputDigest:inputFingerprint(rows,lane),
      outputDigest:fingerprint(rows,lane.outputs),needsContinuation:false,...(lane.parameters?{parameters:lane.parameters}:{})};
    else next.blockedLanes.push(lane.id);
  }
  // A failed final shared proof must stay blocked across restarts even when rollback restored old bytes.
  if(!sharedPassed&&!next.blockedLanes.includes('shared'))next.blockedLanes.push('shared');
  next.blockedLanes.sort();
  const ready=assess(rows,next,lanes,registration);
  Object.assign(report,{registrationReady:ready.publishable,publishable:ready.publishable,needed:ready.needed,backlogDeferred:ready.backlogDeferred,
    inputDigest:ready.inputDigest,outputDigest:ready.outputDigest});
  if(JSON.stringify(next)!==JSON.stringify(old)) {
    fs.mkdirSync(path.dirname(path.join(root,STATE)),{recursive:true});fs.writeFileSync(path.join(root,STATE),json(next));stage(root,[STATE]);
  }
  guardFiles(changed(root),[...allOutputs,STATE],'TRANSACTION');
  if(unstaged(root).length)throw Error('UNSTAGED_TRANSACTION_OUTPUT');
  try {
    const dropped=silentInboxDrops(root,before,nativeWork);
    if(dropped.length) {
      const names=dropped.slice(0,15).join(',');
      if(env.GITHUB_STEP_SUMMARY)fs.appendFileSync(env.GITHUB_STEP_SUMMARY,`\nSILENT_INBOX_DROP: ${names}: left the inbox with no applied record and no committed rejected/pending record; nothing is committed and the requests stay in the inbox.\n`);
      throw Error(`SILENT_INBOX_DROP:${names}: left the inbox with no applied record and no committed rejected/pending record (the rejected copy may have been dropped by .gitignore, for example a name containing "textbook")`);
    }
    report.whitespace=checkStagedRegistrationWhitespace(root);
    checkPreserved(root,before,initialSeals);
  } catch(error) {
    Object.assign(report,{status:'FINAL_GATE_FAILED',safeToPersist:false,registrationReady:false,publishable:false,
      error:error.message,changedPaths:changed(root)});
    writeEvidence(work,report,allOutputs);
    throw error;
  }
  report.changedPaths=changed(root);report.safeToPersist=true;
  const failed=report.lanes.some(r=>['FAILED','ROLLED_BACK','STALE_DEPENDENCY'].includes(r.status));
  report.status=failed?'PREPARED_WITH_FAILURES':report.needed?'PREPARED_WITH_PENDING':report.changedPaths.length?(ready.backlogDeferred?'PREPARED_WITH_BACKLOG':'PREPARED'):(ready.backlogDeferred?'NO_OP_WITH_BACKLOG':'NO_OP');
  // Include the entire allowlist: regeneration after a main race may touch different derived files.
  writeEvidence(work,report,allOutputs);
  return report;
}

// Only provably unrelated changes may reuse the verified commit; anything uncertain regenerates.
// Producers import many archive modules, so any archive/ change is never "clearly unrelated"; diff5 fixtures feed the reviewed lane.
const PROTECTED_PREFIXES=['archive/','tests/fixtures/diff5/','.archive-meta-register/','tools/ci/','tools/lib/','.github/workflows/archive-'];
const PROTECTED_FILES=[STATE,'package.json','package-lock.json'];
const isProtectedExtra=f=>PROTECTED_PREFIXES.some(p=>f.startsWith(p))||PROTECTED_FILES.includes(f)
  ||['.gitignore','.gitattributes'].includes(f.split('/').pop());
export function unrelatedRange({root=ROOT,base,head,lanes}={}) {
  const verdict={unrelated:false,base,head,changedCount:0,firstProtectedHit:null};
  try {
    for(const sha of [base,head])if(!/^[a-f0-9]{40}$/.test(sha||''))throw Error('MALFORMED_SHA:'+sha);
    if(spawnSync('git',['merge-base','--is-ancestor',base,head],{cwd:root}).status!==0)throw Error('BASE_NOT_ANCESTOR_OF_HEAD');
    const patterns=unique((lanes||nativeLanes(root)).flatMap(l=>[l.inputs,l.outputs,l.scopedInputs].flatMap(v=>Array.isArray(v)?v:[])));
    const files=splitZ(git(root,'diff','--name-only','--no-renames','-z',base,head));
    verdict.changedCount=files.length;
    verdict.firstProtectedHit=files.find(f=>isProtectedExtra(f)||matches(f,patterns))||null;
    verdict.unrelated=verdict.firstProtectedHit===null;
  } catch(error) {
    verdict.unrelated=false;verdict.error=String(error.message||error).split('\n')[0];
    console.error('UNRELATED_RANGE_UNKNOWN:'+verdict.error);
  }
  return verdict;
}

async function main() {
  const args=process.argv.slice(2),options={};let check=false,requiredOnly=false;
  if(args[0]==='--unrelated-range') {
    const rootAt=args.indexOf('--root'),verdict=unrelatedRange({...(rootAt>0&&args[rootAt+1]?{root:path.resolve(args[rootAt+1])}:{}),base:args[1],head:args[2]});
    console.log(JSON.stringify(verdict));process.exitCode=verdict.unrelated?0:1;return;
  }
  for(let i=0;i<args.length;i++) {
    if(args[i]==='--check')check=true;
    else if(args[i]==='--required-only')requiredOnly=true;
    else if(['--root','--work-dir'].includes(args[i])&&args[i+1])options[args[i]==='--root'?'root':'work']=args[++i];
    else throw Error('UNKNOWN_OR_VALUELESS_ARGUMENT:'+args[i]);
  }
  // --required-only: prepare just the lanes publication needs (first save of a two-save run); the others stay needed for the full pass.
  if(requiredOnly&&!check)options.lanes=nativeLanes(options.root?path.resolve(options.root):ROOT).filter(lane=>lane.required);
  const result=check?checkRegistration(options):await prepareRegistration(options);
  console.log(json(result));
  if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,
    `writer_status=${result.status}\nsafe_to_persist=${result.safeToPersist}\nregistration_ready=${result.registrationReady}\npublishable=${result.publishable}\nneeded=${result.needed}\ninput_sha=${result.inputSha}\ninput_digest=${result.inputDigest}\noutput_digest=${result.outputDigest}\n`);
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    renderRegistrationSummary(result));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
