#!/usr/bin/env node
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
const inputFingerprint=(rows,lane)=>sha(json({patterns:lane.inputs,parameters:lane.parameters||{},files:fingerprint(rows,lane.inputs)}));
const unstaged = root => unique([...splitZ(git(root,'diff','--name-only','--no-renames','-z')),
  ...splitZ(git(root,'ls-files','--others','--exclude-standard','-z'))]);
const changed = root => unique([...splitZ(git(root,'diff','HEAD','--name-only','--no-renames','-z')), ...unstaged(root)]);
function stage(root, files) {
  for(let i=0;i<files.length;i+=200)git(root,'--literal-pathspecs','add','--',...files.slice(i,i+200));
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

export function nativeLanes(root) {
  const config=read(root,'.archive-meta-register/auto/config.json',{});
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
  const code=['archive/tools/','archive/build_db.py','tools/ci/archive-registration-writer.mjs','tools/ci/archive-registration-whitespace.mjs',
    'tools/ci/archive-pages-registration.paths','tools/ci/archive-meta-register-commit.paths',
    'tools/ci/archive-pages-registration-derive.sh','archive/archive2-core.js','archive/archive2-canonical.js',
    'archive/problem-bank-meta.js','archive/meta-foundation-runtime.js','archive/mixer-selector.js',
    'archive/archive2-source.js','archive/unit-past-exams-core.js'];
  const registration=['archive/exams/','archive/data/question_identity_map.json','archive/data/question_metadata.json',
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
      'tools/ci/collect-reviewed-consumer-refusals.mjs',
      'tools/ci/archive-meta-register-trigger-paths.txt','tools/ci/verify-registered-consumer-approval.sh',
      'tests/archive-reviewed-exam-registration-v2.test.mjs','tests/archive-basic-scope-rebind.test.mjs',
      'tests/archive-difficulty5-register.test.mjs','tests/archive-finalqa-nonpt-register.test.mjs',
      'tests/archive-finalqa-nonpt-real-geumdang.test.mjs'],outputs:reviewed,scopedInputs:reviewedScoped,
      commands:[{...cmd('bash','tools/ci/reviewed-meta-register-pass.sh'),timeoutMs:55*60000}],alwaysFinal:true,
      finalCommands:({env})=>fs.existsSync(path.join(env.RUNNER_TEMP,'archive-meta-register-pass/requests'))
        // Reuse its real checks before commit; its old post-push summary names HEAD as registered,
        // so use this writer's accurate PREPARED summary and the push helper's exact SHA instead.
        ?[{...cmd('bash','tools/ci/verify-registered-consumer-approval.sh'),env:{GITHUB_STEP_SUMMARY:'/dev/null'}}]:[]},
    {id:'semantic',inputs:[...code,...registration,'.archive-meta-register/auto/config.json','.archive-meta-register/auto/state.json',
      'tools/ci/archive-main-auto-meta-pass.sh','tests/archive-question-identity-contract.test.mjs',
      'tests/archive-question-identity-runtime.test.mjs'],outputs:auto,enabled:config.enabled===true,
      commands:[cmd('bash','tools/ci/archive-main-auto-meta-pass.sh')],
      finalCommands:({env})=>fs.existsSync(path.join(env.RUNNER_TEMP,'archive-main-auto-meta/report.json'))
        ?[cmd('node','archive/tools/meta-foundation/auto-register-merged-source.mjs','--verify','--report',path.join(env.RUNNER_TEMP,'archive-main-auto-meta/report.json'))]:[],
      continuation:({root,env})=>{
        const pending=read(root,'.archive-meta-register/auto/state.json',{pending:{}}).pending||{};
        const report=read(env.RUNNER_TEMP,'archive-main-auto-meta/report.json',{results:[]});
        const attempted=new Set((report.results||[]).map(r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`));
        // Early native refusals can have no attemptSignature (for example a removed target). They
        // are still observed pending debt, not an unprocessed batch: retry only entries absent from
        // this exact run's results, otherwise stable refusals would rebuild forever on identical input.
        return Object.keys(pending).some(key=>!attempted.has(key));
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
    {id:'fourSlot',inputs:['archive/exams/','archive/data/question_identity_map.json','archive/data/item-4slot/',
      'archive/assets/','docs/architecture/4slot/','archive/item-4slot.js','tools/4slot/',
      'tools/ci/archive-four-slot-pass.sh','tools/ci/archive-registration-writer.mjs','tools/ci/archive-registration-whitespace.mjs','.archive-meta-register/auto/config.json'],
      // Preserve the existing independent 4slot failure policy; failed output is rolled back and
      // retryable, while validated ordinary exam publication can continue with the prior index.
      outputs:fourSlot,required:false,enabled:config.fourSlotEnabled!==false,
      commands:[cmd('bash','tools/ci/archive-four-slot-pass.sh')]}
  ];
}

export function executeCommands({root, work, lane, env}) {
  const advisories=[];
  for(const [n,command] of lane.commands.entries()) {
    const logfile=path.join(work,`${lane.logId||lane.id}-${n+1}.log`),fd=fs.openSync(logfile,'w');
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
    if(result.status!==0) {
      const detail={command:[command.program,...command.args],exitCode:result.status,signal:result.signal,
        log:logfile,error:String(result.error?.message||fs.readFileSync(logfile,'utf8').slice(-3000))};
      if(command.advisory){advisories.push(detail);continue;}
      const e=Error(`NATIVE_COMMAND_FAILED:${lane.id}:${n+1}`);e.detail=detail;throw e;
    }
  }
  return {advisories};
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

function assertClean(root) {
  if(git(root,'status','--porcelain=v1','--untracked-files=all').trim())throw Error('WRITER_REQUIRES_CLEAN_RUNNER');
}
function stateAt(root) {
  const state=read(root,STATE,{schemaVersion:VERSION,lanes:{},blockedLanes:[]});
  if(state.schemaVersion!==VERSION||!state.lanes||typeof state.lanes!=='object'||Array.isArray(state.lanes)
    ||(state.blockedLanes!==undefined&&!Array.isArray(state.blockedLanes)))throw Error('WRITER_STATE_SCHEMA_MISMATCH');
  return state;
}
function assess(rows,state,lanes) {
  const blocked=new Set(state.blockedLanes||[]);
  const results=lanes.map(lane=>{
    const enabled=lane.enabled!==false,inputDigest=inputFingerprint(rows,lane),outputDigest=fingerprint(rows,lane.outputs);
    const cached=state.lanes[lane.id];
    const scopedInputDigest=lane.scopedInputs?fingerprint(rows,lane.scopedInputs):undefined;
    const scopeChanged=lane.scopedInputs&&cached?.scopedInputDigest!==scopedInputDigest;
    const needed=Boolean(blocked.has(lane.id)||cached?.needsContinuation===true||cached?.enabled!==enabled||cached?.inputDigest!==inputDigest||cached?.outputDigest!==outputDigest||scopeChanged);
    return {id:lane.id,enabled,required:lane.required===true,needed,inputDigest,outputDigest,...(lane.scopedInputs?{scopedInputDigest}:{}),
      status:needed?'NEEDS_REGISTRATION':enabled?'VERIFIED_REUSED':'DISABLED'};
  });
  return {lanes:results,needed:results.some(r=>r.needed),
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

// Recovery checks only the checked-out snapshot. It does not fetch main, run producers or edit Git data.
export function checkRegistration({root=ROOT,work,lanes=nativeLanes(root),env=process.env}={}) {
  root=path.resolve(root);assertClean(root);
  const assessment=assess(indexRows(root),stateAt(root),lanes);
  const report={schemaVersion:VERSION,mode:'check',inputSha:git(root,'rev-parse','HEAD').trim(),...assessment,
    registrationReady:assessment.publishable,safeToPersist:false,changedPaths:[],
    status:assessment.needed?(assessment.publishable?'REGISTRATION_PARTIAL':'REGISTRATION_REQUIRED'):'REGISTERED'};
  if(work)writeEvidence(evidenceDir(root,work,env),report);
  return report;
}

export async function prepareRegistration({root=ROOT,work,execute=executeCommands,lanes=nativeLanes(root),env=process.env}={}) {
  root=path.resolve(root);assertClean(root);
  if(env.GITHUB_ACTIONS==='true'&&(env.GITHUB_EVENT_NAME==='pull_request'||env.GITHUB_REF!=='refs/heads/main'))throw Error('MAIN_ONLY_WRITER');
  if(new Set(lanes.map(l=>l.id)).size!==lanes.length||lanes.some((l,i)=>l.id==='fourSlot'&&i!==lanes.length-1))throw Error('INVALID_LANE_ORDER');
  work=evidenceDir(root,work,env);
  const inputSha=git(root,'rev-parse','HEAD').trim(),before=indexRows(root),old=stateAt(root);
  const initialSeals=read(root,'archive/data/meta-foundation/crosswalks/sealed-digests.v1.json',{entries:[]});
  const allOutputs=unique(lanes.flatMap(l=>l.outputs));
  const report={schemaVersion:VERSION,mode:'prepare',inputSha,status:'PREPARING',safeToPersist:false,registrationReady:false,
    sourceMutation:0,independentReviewClaim:false,lanes:[],changedPaths:[]};
  writeEvidence(work,report); // An interrupted retry cannot leave an earlier attempt's publishable report.
  const next={schemaVersion:VERSION,lanes:{...old.lanes},blockedLanes:[]};
  const laneState=new Map();
  // A retry gets fresh native reports; an earlier attempt's PASS may never certify the new snapshot.
  const nativeWork=path.join(work,'native');fs.rmSync(nativeWork,{recursive:true,force:true});fs.mkdirSync(nativeWork,{recursive:true});
  const writerEnv={...env,RUNNER_TEMP:nativeWork,RELEASE_EVIDENCE_DIR:path.join(work,'shared'),
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
    const current=indexRows(root),assessment=assess(current,old,[lane]).lanes[0];
    const needed=assessment.needed;
    const record={...assessment,status:needed?'RUNNING':'NO_OP',needed,verifiedInputDigest:assessment.inputDigest,
      verifiedOutputDigest:assessment.outputDigest,needsContinuation:false};
    report.lanes.push(record);laneState.set(lane.id,record);
    if(lane.enabled===false){record.status='DISABLED';continue;}
    if(!needed)continue;
    const started=Date.now();
    try {
      const executionEnv=environmentFor(lane,record,current);
      const result=await execute({root,work,lane,env:executionEnv,prior:laneState});
      const files=unstaged(root);guardFiles(files,lane.outputs,lane.id.toUpperCase());stage(root,files);
      checkPreserved(root,before,initialSeals);
      Object.assign(record,{status:'VERIFIED',durationMs:Date.now()-started,changedCount:files.length,advisories:result?.advisories||[],
        verifiedInputDigest:inputFingerprint(indexRows(root),lane),verifiedOutputDigest:fingerprint(indexRows(root),lane.outputs),
        needsContinuation:lane.continuation?lane.continuation({root,env:executionEnv}):false});
    } catch(error) {
      // Unexpected source writes are never waived or hidden behind lane isolation.
      if(/^UNEXPECTED_|^IMMUTABLE_|^EXISTING_CROSSWALK/.test(error.message))throw error;
      rollbackUnstaged(root,lane.outputs);
      Object.assign(record,{status:'FAILED',durationMs:Date.now()-started,error:error.message,...(error.detail?{detail:error.detail}:{})});
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
  const ready=assess(rows,next,lanes);
  Object.assign(report,{registrationReady:ready.publishable,publishable:ready.publishable,needed:ready.needed,
    inputDigest:ready.inputDigest,outputDigest:ready.outputDigest});
  if(JSON.stringify(next)!==JSON.stringify(old)) {
    fs.mkdirSync(path.dirname(path.join(root,STATE)),{recursive:true});fs.writeFileSync(path.join(root,STATE),json(next));stage(root,[STATE]);
  }
  guardFiles(changed(root),[...allOutputs,STATE],'TRANSACTION');
  if(unstaged(root).length)throw Error('UNSTAGED_TRANSACTION_OUTPUT');
  try {
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
  report.status=failed?'PREPARED_WITH_FAILURES':report.needed?'PREPARED_WITH_PENDING':report.changedPaths.length?'PREPARED':'NO_OP';
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
  const args=process.argv.slice(2),options={};let check=false;
  if(args[0]==='--unrelated-range') {
    const rootAt=args.indexOf('--root'),verdict=unrelatedRange({...(rootAt>0&&args[rootAt+1]?{root:path.resolve(args[rootAt+1])}:{}),base:args[1],head:args[2]});
    console.log(JSON.stringify(verdict));process.exitCode=verdict.unrelated?0:1;return;
  }
  for(let i=0;i<args.length;i++) {
    if(args[i]==='--check')check=true;
    else if(['--root','--work-dir'].includes(args[i])&&args[i+1])options[args[i]==='--root'?'root':'work']=args[++i];
    else throw Error('UNKNOWN_OR_VALUELESS_ARGUMENT:'+args[i]);
  }
  const result=check?checkRegistration(options):await prepareRegistration(options);
  console.log(json(result));
  if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,
    `writer_status=${result.status}\nsafe_to_persist=${result.safeToPersist}\nregistration_ready=${result.registrationReady}\npublishable=${result.publishable}\nneeded=${result.needed}\ninput_sha=${result.inputSha}\ninput_digest=${result.inputDigest}\noutput_digest=${result.outputDigest}\n`);
  if(process.env.GITHUB_STEP_SUMMARY&&result.whitespace)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `Git whitespace: ${result.whitespace.status}; raw Git exit=${result.whitespace.rawGitExitCode}; inherited source lines=${result.whitespace.inheritedLineCount}; byte-bound assets=${result.whitespace.inheritedAssets.length}. No source or derived SVG bytes were changed for this classification.\n\n`);
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `### Archive registration writer: ${result.status}\n\n| lane | result |\n| --- | --- |\n${result.lanes.map(r=>`| ${r.id} | ${r.status} |`).join('\n')}\n\nregistration_ready=${result.registrationReady}; staged paths=${result.changedPaths.length}\n`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
