// Main-merge metadata registration. It applies declared metadata, never invents a semantic review.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const VERSION = 'archive-main-merge-meta-v1';
export const AUTO = '.archive-meta-register/auto';
const META = 'archive/data/question_metadata.json';
const IDENTITY = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime';
const STATE = `${AUTO}/state.json`;
const CONFIG = `${AUTO}/config.json`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const FIELDS = ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit',
  'curriculum','curriculumKey','courseKey','problemTypeKey','templateKey','crossConceptKeys',
  'conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence',
  'difficultyBoundaryFlag','legacyLevelCompatibility','level','primaryMethod','decisiveStep',
  'rpmPrimaryId','rpmPrimaryPath','rpmL1','rpmL2','rpmL3','rpmL4','secondaryConceptKeys'];
const CORE = ['content','choices','answer','image','images','figureSvg'];
const STUDENT = [...CORE, 'solution','solutionImage','solutionFigureSvg','questionType','layoutTag','wide'];
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k,x[k]])) : x);
export const sha256 = v => crypto.createHash('sha256').update(v).digest('hex');
const hash = v => sha256(stable(v));
const equal = (a,b) => stable(a ?? null) === stable(b ?? null);
const pick = (v, keys) => Object.fromEntries(keys.map(k => [k, v?.[k] ?? null]));
const json = v => JSON.stringify(v, null, 2) + '\n';
const git = (root, ...args) => execFileSync('git', args, {cwd:root, encoding:'utf8', maxBuffer:64*1024*1024, stdio:['pipe','pipe','pipe']});
const read = (root, rel, fallback) => fs.existsSync(path.join(root,rel)) ? JSON.parse(fs.readFileSync(path.join(root,rel),'utf8')) : fallback;
const write = (root, rel, value) => { const f=path.join(root,rel); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,json(value)); };
export const sourceFingerprint = q => sha256(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
export const contentFingerprint = q => sha256(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
export function sourcePath(value) {
  if (typeof value !== 'string' || !value.endsWith('.js') || value.startsWith('/') || value.includes('\\') || /[\x00-\x1f]/.test(value) || value.split('/').some(s=>!s||s==='.'||s==='..')) throw Error('SOURCE_PATH_INVALID');
  return value;
}
export function loadBank(text, name='source') {
  if (Buffer.byteLength(text)>16*1024*1024) throw Error('SOURCE_TOO_LARGE');
  const ctx=vm.createContext({window:{}});
  vm.runInContext(text,ctx,{filename:name,timeout:3000});
  const bank=ctx.window.questionBank||ctx.window.questions||ctx.questionBank||ctx.questions||ctx.window.examData?.questions;
  if (!Array.isArray(bank)||!bank.length) throw Error('SOURCE_BANK_MISSING');
  return JSON.parse(JSON.stringify(bank));
}
const archived = (root,commit,file) => {
  try { return loadBank(git(root,'show',`${commit}:archive/exams/${file}`),file); }
  catch(e) { if (String(e.stderr||'').includes('does not exist in') || String(e.stderr||'').includes('exists on disk, but not in')) return []; throw e; }
};
const mapUnique = (rows, key, label) => { const m=new Map(); for(const r of rows||[]){const k=key(r);if(m.has(k))throw Error(`DUPLICATE_${label}:${k}`);m.set(k,r);}return m; };
const semantic = q => pick(q,FIELDS);

// Only a previously fingerprint-bound, independently reviewed metadata row can
// be carried across a solution-only edit. The edited solution itself has no new
// independent math-review approval from this registrar.
export function classifySourceFingerprintDrift({question,previous,current,identity}) {
  const after=sourceFingerprint(question);
  if(identity?.sourceFingerprint===after)return {cause:'CURRENT_MATCH',canRebind:false};
  if(!previous)return {cause:'PREVIOUS_SOURCE_NOT_FOUND',canRebind:false};
  const before=sourceFingerprint(previous);
  if(identity?.sourceFingerprint!==before)return {cause:'OLD_FINGERPRINT_NOT_ANCHORED',canRebind:false};
  if(current?.sourceFingerprint!==before||current?.contentFingerprint!==contentFingerprint(previous))
    return {cause:'METADATA_IDENTITY_DIVERGED',canRebind:false};
  if(contentFingerprint(question)!==contentFingerprint(previous))
    return {cause:'QUESTION_OR_IMAGE_CHANGED',canRebind:false};
  const withoutSolution=v=>Object.fromEntries(Object.entries(v??{}).filter(([k])=>k!=='solution'));
  if(!equal(withoutSolution(previous),withoutSolution(question)))
    return {cause:'ANSWER_OR_OTHER_FIELDS_CHANGED',canRebind:false};
  if(typeof previous.solution!=='string'||!previous.solution.trim()||
     typeof question.solution!=='string'||!question.solution.trim()||previous.solution===question.solution)
    return {cause:'SOLUTION_EVIDENCE_INCOMPLETE',canRebind:false};
  const reviewed=current.reviewStatus==='reviewed_pass'||String(current.metadataStatus||'').startsWith('approved_');
  if(!reviewed||!Array.isArray(current.approvalEvidence)||!current.approvalEvidence.some(x=>typeof x==='string'&&x.trim())||
     current.registrationUpdateState)
    return {cause:'REVIEWED_METADATA_EVIDENCE_MISSING',canRebind:false};
  return {cause:'SOLUTION_ONLY_PROVEN',canRebind:true,before,after,contentFingerprint:contentFingerprint(question)};
}

// The official ACTIVE validator is supplied by loadContext; fixtures use the same public interface.
export function planQuestion({question:q, previous, current, identity, registry, validate, source, ordinal, runtimeOwner, priorReceipt}) {
  const reject = (...reasons) => ({status:'SUPPLEMENT_PENDING',reasons,questionUid:identity?.questionUid||current?.questionUid||null,sourceArchiveFile:source,sourceOrdinal:ordinal});
  if (!identity || !current || identity.questionUid!==current.questionUid || identity.sourceArchiveFile!==source || current.sourceArchiveFile!==source || Number(identity.sourceOrdinal)!==ordinal || Number(current.sourceOrdinal)!==ordinal) return reject('UID_JOIN_MISMATCH');
  if (q.questionUid && q.questionUid!==identity.questionUid) return reject('SOURCE_UID_CONFLICT');
  if (identity.status && identity.status!=='VERIFIED') return reject('UID_NOT_VERIFIED');
  const questionNo=String(q.sourceQuestionNo??q.id??'');
  if (identity.sourceQuestionNo!=null && String(identity.sourceQuestionNo)!==questionNo) return reject('SOURCE_ORDINAL_CHANGED');
  if(previous&&String(previous.sourceQuestionNo??previous.id??'')!==questionNo)return reject('SOURCE_ORDINAL_CHANGED');
  const fp=sourceFingerprint(q), cf=contentFingerprint(q);
  const drift=classifySourceFingerprintDrift({question:q,previous,current,identity});
  if(identity.sourceFingerprint!==fp&&!drift.canRebind)
    return {...reject('IDENTITY_SOURCE_FINGERPRINT_MISMATCH'),fingerprintCause:drift.cause};
  if(current.sourceFingerprint!==fp && (!previous||current.sourceFingerprint!==sourceFingerprint(previous))) return reject('METADATA_SOURCE_FINGERPRINT_CONFLICT');
  const coreChanged=Boolean(previous&&!equal(pick(previous,CORE),pick(q,CORE)));
  const sourceMetaChanged=Boolean(!previous||!equal(semantic(previous),semantic(q)));
  if(current.metadataStatus==='SOURCE_HOLD')return reject('EXPLICIT_SOURCE_HOLD');
  const studentChanged=Boolean(previous&&!equal(pick(previous,STUDENT),pick(q,STUDENT)));
  const candidate={...current};
  // Absent source fields do not erase reviewed sidecars. Explicit changes are authoritative only for this UID.
  for(const k of FIELDS) if(Object.hasOwn(q,k)) {
    const changed=!previous||!equal(previous[k],q[k]);
    const approved=current.reviewStatus==='reviewed_pass'||String(current.metadataStatus||'').startsWith('approved_');
    if(changed&&approved&&candidate[k]!=null&&candidate[k]!==''&&!equal(candidate[k],previous?.[k])&&!equal(candidate[k],q[k]))return reject('FIELD_AUTHORITY_CONFLICT:'+k);
    if(changed || candidate[k]==null || candidate[k]==='') candidate[k]=structuredClone(q[k]);
  }
  if(!candidate.problemTypeKey||!candidate.templateKey) return reject('DECLARED_PT_TPL_MISSING');
  const check=validate({...candidate,sourceArchiveFile:source},registry,{requireFields:true});
  if(check.status!=='VALIDATED'||!check.activeBinding||!check.difficultyComplete) return reject(...check.errors, ...(!check.difficultyComplete?['DIFFICULTY_INCOMPLETE']:[]), ...(!check.activeBinding?['ACTIVE_BINDING_MISSING']:[]));
  const pt=registry.problemTypes.get(candidate.problemTypeKey),tpl=registry.templates.get(candidate.templateKey);
  const bindings=registry.bindingRows.filter(b=>b.status==='ACTIVE'&&b.curriculum===check.curriculum&&b.standardUnitKey===candidate.standardUnitKey&&(b.subUnitKey??null)===(candidate.subUnitKey??null)&&b.problemTypeKey===candidate.problemTypeKey&&String(b.standardCourse||'').replaceAll(' ','')===String(candidate.standardCourse||'').replaceAll(' ',''));
  if(bindings.length!==1) return reject('EXACT_COURSE_BINDING_MISSING_OR_AMBIGUOUS');
  const binding=bindings[0],pack=registry.activePacks.get(pt.ownerPack);
  if(!pack||tpl.ownerPack!==pt.ownerPack) return reject('ACTIVE_OWNER_PACK_MISMATCH');
  if(runtimeOwner && runtimeOwner!==pt.ownerPack) return reject('EXISTING_RUNTIME_OWNER_CONFLICT');
  // Existing declarations are evidence of what was merged, not proof of independent mathematical QA.
  if(sourceMetaChanged && (!String(q.primaryMethod||'').trim()||!String(q.decisiveStep||'').trim())) return reject('SOURCE_SEMANTIC_RATIONALE_MISSING');
  if(!binding.L1||!binding.L2||!pt.canonicalLabelKo||!tpl.canonicalLabelKo) return reject('CANONICAL_LABELS_MISSING');
  const final={...candidate,sourceFingerprint:fp,contentFingerprint:cf,curriculum:check.curriculum,curriculumKey:check.curriculum,
    courseKey:check.curriculum===current.curriculumKey&&current.courseKey?current.courseKey:candidate.standardCourse,
    L1:binding.L1,L2:binding.L2,L3:pt.canonicalLabelKo,L4:tpl.canonicalLabelKo,
    foundationTaxonomyStatus:'CONFIRMED',projectionStatus:'REUSE',metaFoundationStatus:'ACTIVE',
    metaFoundationPackId:pt.ownerPack,metaFoundationPackVersion:pack.version,
    metadataRegistrationStatus:'REGISTERED',metadataRegistrationBasis:'MAIN_MERGED_EXPLICIT_METADATA',
    independentMathReviewStatus:studentChanged?'NOT_PERFORMED_BY_AUTO_REGISTRAR':current.independentMathReviewStatus||'NOT_PERFORMED_BY_AUTO_REGISTRAR',
    l3Disposition:'ASSIGNED',l4Disposition:'ASSIGNED',curriculumApplicability:current.curriculumApplicability||'DEFAULT_SCOPE',
    defaultSelectable:current.defaultSelectable!==false};
  // Do not manufacture FINAL_QA/REVIEW2. Unchanged reviewed metadata retains its original authority.
  const preserveReview=!coreChanged&&!sourceMetaChanged;
  if(!preserveReview) {
    final.metadataStatus='registered_merged_source';
    final.reviewStatus='review_required';
    final.tagStatus='review_required';
    final.metadataApprovalType='MAIN_MERGE';
    final.fieldStatus={...current.fieldStatus};
    const groups={standardUnit:['standardCourse','standardUnitKey','standardUnit'],subUnit:['subUnitKey','subUnit'],concept:['L1','L2','L3','L4'],problemType:['problemTypeKey'],template:['templateKey'],crossConcept:['crossConceptKeys'],condition:['conditionKeys'],integrationPattern:['integrationPattern'],difficulty:['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']};
    for(const [field,keys] of Object.entries(groups))if(keys.some(k=>!equal(current[k],final[k])))final.fieldStatus[field]='registered_main_merge';
  }
  const inputHash=hash({source,ordinal,student:pick(q,STUDENT),metadata:semantic(q),registry:registry.registrySha});
  // A rerun after a build can canonicalize summary fields; compare actual registered values, not wall-clock data.
  const effectiveFields=[...FIELDS.filter(k=>Object.hasOwn(final,k)), 'sourceFingerprint','contentFingerprint','L1','L2','L3','L4'];
  if(!drift.canRebind&&priorReceipt?.inputHash===inputHash&&priorReceipt.metadataRegistrationStatus==='REGISTERED'&&effectiveFields.every(k=>equal(current[k],final[k]))) return {status:'ALREADY_REGISTERED',questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,inputHash};
  return {status:'APPLY',questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,inputHash,ownerPack:pt.ownerPack,final,
    changedFields:effectiveFields.filter(k=>!equal(current[k],final[k])),preserveReview,coreChanged,sourceMetaChanged,
    studentPayloadHash:hash(pick(q,STUDENT)),sourceQuestionNo:questionNo,
    fingerprintCause:drift.canRebind?drift.cause:null,rebindIdentity:drift.canRebind,
    ...(drift.canRebind?{rebindProof:{before:drift.before,after:drift.after,contentFingerprint:drift.contentFingerprint}}:{})};
}

async function context(root) {
  const {loadActiveMetaRegistry,validateActiveMetaFields}=await import('./active-registry.mjs');
  const {refreshRuntime}=await import('./reviewed-runtime-summary.mjs');
  const registry=loadActiveMetaRegistry(root);
  if(registry.status!=='ACTIVE') throw Error('ACTIVE_REGISTRY_UNAVAILABLE:'+registry.errors.join('|'));
  const metadata=read(root,META),identity=read(root,IDENTITY);
  if(!metadata?.records||!identity?.records)throw Error('IDENTITY_OR_METADATA_MISSING');
  const metaByUid=mapUnique(metadata.records,r=>r.questionUid,'METADATA_UID');
  mapUnique(metadata.records,r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`,'METADATA_SOURCE');
  const identityByJoin=mapUnique(identity.records,r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`,'IDENTITY_SOURCE');
  mapUnique(identity.records,r=>r.questionUid,'IDENTITY_UID');
  const runtimes=new Map(),owners=new Map();
  for(const name of fs.readdirSync(path.join(root,RUNTIME)).filter(n=>n.endsWith('.json')&&n!=='runtime-bridge-receipt.json')) {
    const rel=`${RUNTIME}/${name}`,data=read(root,rel);
    if(!Array.isArray(data.records)||!data.packId)continue;
    if(runtimes.has(data.packId))throw Error('DUPLICATE_RUNTIME_PACK');
    runtimes.set(data.packId,{rel,data});
    for(const r of data.records){if(owners.has(r.questionUid))throw Error('DUPLICATE_RUNTIME_UID');owners.set(r.questionUid,data.packId);}
  }
  return {registry,validate:validateActiveMetaFields,refreshRuntime,metadata,identity,metaByUid,identityByJoin,runtimes,owners};
}

export function selectTargets(root, state, config, head) {
  const base=state.lastProcessedCommit||config.bootstrapBase;
  if(!/^[a-f0-9]{40}$/.test(base||''))throw Error('BOOTSTRAP_BASE_REQUIRED');
  git(root,'merge-base','--is-ancestor',base,head);
  const files=git(root,'diff','--name-only','-z',base,head,'--','archive/exams/').split('\0').filter(p=>p.endsWith('.js'));
  const selected=new Map(Object.entries(structuredClone(state.pending||{})));
  for(const rel of files) {
    const source=sourcePath(rel.slice('archive/exams/'.length));
    if(!fs.existsSync(path.join(root,rel)))continue; // Native identity sync owns deletions; never invent a UID relocation.
    const now=loadBank(fs.readFileSync(path.join(root,rel),'utf8'),rel),before=archived(root,base,source);
    for(let i=0;i<now.length;i++)if(!equal(now[i],before[i])) selected.set(`${source}#${i+1}`,{sourceArchiveFile:source,sourceOrdinal:i+1,baseCommit:base});
  }
  for(const seed of config.pilotTargets||[]) {
    const key=`${sourcePath(seed.sourceArchiveFile)}#${seed.sourceOrdinal}`;
    if(!state.completedPilots?.includes(key))selected.set(key,{...seed,baseCommit:seed.baseCommit||base,pilot:true});
  }
  return [...selected.entries()].sort(([a],[b])=>a.localeCompare(b,'en'));
}

export async function registerMergedSource({root=ROOT,write:doWrite=false,reportPath}={}) {
  root=path.resolve(root);
  const config=read(root,CONFIG); if(config?.enabled!==true){const r={status:'DISABLED',processed:0,results:[]};if(reportPath)fs.writeFileSync(reportPath,json(r));return r;}
  const head=git(root,'rev-parse','HEAD').trim();
  if(doWrite&&process.env.GITHUB_ACTIONS==='true'&&process.env.GITHUB_REF!=='refs/heads/main')throw Error('MAIN_ONLY_WRITER');
  const state=read(root,STATE,{schemaVersion:VERSION,lastProcessedCommit:config.bootstrapBase,pending:{},completedPilots:[],latestReceipts:{}});
  const targets=selectTargets(root,state,config,head);
  const report={schemaVersion:VERSION,head,base:state.lastProcessedCommit,write:doWrite,results:[],studentFilesChanged:0,unrelatedMetadataChanged:0};
  if(!targets.length){report.status='NO_CHANGE';if(reportPath)fs.writeFileSync(reportPath,json(report));return report;}
  const c=await context(root),banks=new Map(),previousBanks=new Map(),changedPacks=new Set(),outputs=new Map();
  const nextState=structuredClone(state);nextState.pending={...state.pending};nextState.latestReceipts={...state.latestReceipts};nextState.completedPilots=[...(state.completedPilots||[])];
  const beforeRows=new Map(c.metadata.records.map(r=>[r.questionUid,hash(r)])),touched=new Set(),sourceHashes=new Map();
  const beforeIdentityRows=new Map(c.identity.records.map(r=>[r.questionUid,hash(r)])),reboundUids=new Set();
  const max=config.maxQuestionsPerRun||100;
  if(!Number.isInteger(max)||max<1||max>500)throw Error('BATCH_LIMIT_INVALID');
  const sourceDelta=git(root,'diff','--name-only',state.lastProcessedCommit,head,'--','archive/exams/').trim();
  let acted=0;
  for(let ti=0;ti<targets.length;ti++) {
    const [key,target]=targets[ti];
    if(acted>=max){nextState.pending[key]=target;continue;}
    const source=sourcePath(target.sourceArchiveFile),ordinal=Number(target.sourceOrdinal),rel=`archive/exams/${source}`;
    if(!Number.isInteger(ordinal)||ordinal<1)throw Error('INVALID_TARGET_ORDINAL');
    let result,attempted=false;
    try {
      if(!banks.has(source)){
        const bytes=fs.readFileSync(path.join(root,rel));sourceHashes.set(rel,sha256(bytes));
        banks.set(source,loadBank(bytes.toString('utf8'),rel));
      }
      const prevKey=`${target.baseCommit}:${source}`;
      if(!previousBanks.has(prevKey))previousBanks.set(prevKey,archived(root,target.baseCommit,source));
      const q=banks.get(source)[ordinal-1];if(!q)throw Error('TARGET_REMOVED_OR_REORDERED');
      const id=c.identityByJoin.get(key),current=c.metaByUid.get(id?.questionUid);
      const priorPath=state.latestReceipts?.[id?.questionUid];
      if(priorPath&&!new RegExp('^\\.archive-meta-register/auto/receipts/[A-Za-z0-9_-]+\\.json$').test(priorPath))throw Error('RECEIPT_PATH_INVALID');
      const prior=priorPath?read(root,priorPath):null;
      // Version the pending decision: old fingerprint failures must receive one safe S1 re-evaluation.
      const attemptSignature=hash({decisionContract:'solution-only-rebind-s1',source:sourceHashes.get(rel),
        metadata:current,identityFingerprint:id?.sourceFingerprint,registry:c.registry.registrySha});
      if(state.pending?.[key]?.attemptSignature===attemptSignature) {
        report.results.push({status:'SUPPLEMENT_PENDING_UNCHANGED',sourceArchiveFile:source,sourceOrdinal:ordinal,reasons:state.pending[key].lastReasons});
        continue;
      }
      acted++;attempted=true;target.attemptSignature=attemptSignature;
      result=planQuestion({question:q,previous:previousBanks.get(prevKey)[ordinal-1],current,identity:id,registry:c.registry,validate:c.validate,source,ordinal,runtimeOwner:c.owners.get(id?.questionUid),priorReceipt:prior});
      if(result.status==='APPLY') {
        const rt=c.runtimes.get(result.ownerPack);if(!rt||rt.data.status!=='ACTIVE')throw Error('OWNER_RUNTIME_MISSING');
        const requestId=`main-${result.questionUid.slice(7,23)}-${result.inputHash.slice(0,24)}`;
        const reqPath=`${AUTO}/requests/${requestId}.json`,receiptPath=`${AUTO}/receipts/${requestId}.json`;
        const final=result.final;
        final.metadataRevision=`${VERSION}:${requestId}`;
        final.registrationEvidence=[...new Set([...(current.registrationEvidence||[]),receiptPath])];
        const request={schemaVersion:VERSION,requestId,questionUid:result.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,
          inputHash:result.inputHash,sourceSha256:sourceHashes.get(rel),sourceCommit:git(root,'log','-1','--format=%H','--',rel).trim(),registrySha:c.registry.registrySha,
          approvalBasis:'MAIN_MERGED_EXPLICIT_METADATA',independentReviewClaim:false,
          before:pick(current,result.changedFields),after:pick(final,result.changedFields),changedFields:result.changedFields,
          ...(result.rebindIdentity?{solutionOnlyRebindProof:{
            previousSourceCommit:target.baseCommit,
            previousSourceBlobSha1:git(root,'rev-parse',`${target.baseCommit}:archive/exams/${source}`).trim(),
            sourceOrdinal:ordinal,questionUid:result.questionUid,
            beforeFingerprint:result.rebindProof.before,afterFingerprint:result.rebindProof.after,
            unchangedContentFingerprint:result.rebindProof.contentFingerprint,
            changedSourceField:'solution',newIndependentMathReviewClaim:false}}:{})};
        const receipt={...request,metadataRegistrationStatus:'REGISTERED',consumerStatus:'PENDING_VERIFICATION',
          studentPayloadHash:result.studentPayloadHash,coreChanged:result.coreChanged,reviewPreserved:result.preserveReview,
          values:pick(final,[...FIELDS,'sourceFingerprint','contentFingerprint','L1','L2','L3','L4'])};
        const existing=read(root,reqPath);
        if(existing&&!equal(existing,request))throw Error('IMMUTABLE_REQUEST_CONFLICT');
        const priorStoredReceipt=read(root,receiptPath);
        if(priorStoredReceipt&&!equal(priorStoredReceipt,receipt))throw Error('IMMUTABLE_RECEIPT_CONFLICT');
        outputs.set(reqPath,request);outputs.set(receiptPath,receipt);
        Object.assign(current,final);touched.add(result.questionUid);
        if(result.rebindIdentity){id.sourceFingerprint=result.rebindProof.after;reboundUids.add(result.questionUid);}
        const rr={...structuredClone(final),sourceQuestionNo:result.sourceQuestionNo,sourceIdentity:key,
          approvedSourceFingerprint:final.sourceFingerprint,legacyLevel:final.level,
          runtimeSelectable:final.defaultSelectable&&final.curriculumApplicability==='DEFAULT_SCOPE'};
        rt.data.records=rt.data.records.filter(r=>r.questionUid!==result.questionUid);rt.data.records.push(rr);
        c.owners.set(result.questionUid,result.ownerPack);changedPacks.add(result.ownerPack);
        nextState.latestReceipts[result.questionUid]=receiptPath;
        result={...result,requestId,receiptPath};delete result.final;
      }
      if(['APPLY','ALREADY_REGISTERED'].includes(result.status)) {
        delete nextState.pending[key];
        if(target.pilot&&!nextState.completedPilots.includes(key))nextState.completedPilots.push(key);
      } else nextState.pending[key]={...target,lastReasons:result.reasons};
    }catch(e) { if(!attempted)acted++;result={status:'SUPPLEMENT_PENDING',sourceArchiveFile:source,sourceOrdinal:ordinal,reasons:[String(e.message)]};nextState.pending[key]={...target,lastReasons:result.reasons}; }
    report.results.push(result);
  }
  // A queued batch is durable in the SAME commit as its cursor. Missed events are caught up from this cursor.
  if(sourceDelta||touched.size||acted&&targets.some(([,t])=>t.pilot&&!state.completedPilots?.includes(`${t.sourceArchiveFile}#${t.sourceOrdinal}`)))nextState.lastProcessedCommit=head;
  for(const row of c.metadata.records)if(!touched.has(row.questionUid)&&beforeRows.get(row.questionUid)!==hash(row))throw Error('UNRELATED_UID_MUTATION');
  for(const row of c.identity.records)if(!reboundUids.has(row.questionUid)&&beforeIdentityRows.get(row.questionUid)!==hash(row))
    throw Error('UNRELATED_IDENTITY_MUTATION');
  if(reboundUids.size){
    const stableIdentity={...c.identity};delete stableIdentity.generatedAt;delete stableIdentity.identityDigest;
    c.identity.identityDigest=sha256(JSON.stringify(stableIdentity));
    outputs.set(IDENTITY,c.identity);
  }
  for(const [rel,sha]of sourceHashes)if(sha256(fs.readFileSync(path.join(root,rel)))!==sha)throw Error('STUDENT_SOURCE_MUTATION');
  if(touched.size) {
    c.metadata.counts={...c.metadata.counts,records:c.metadata.records.length,uidUnique:true,sourceJoinUnique:true};
    for(const [field,marker] of [['explicitProblemTypeHolds','problemType'],['explicitTemplateHolds','template'],['explicitDifficultyHolds','difficulty']]) {
      if(Object.hasOwn(c.metadata.counts,field))c.metadata.counts[field]=c.metadata.records.filter(r=>r.fieldStatus?.[marker]==='manual_review_pending').length;
    }
    if(Object.hasOwn(c.metadata,'reviewedPassCount'))c.metadata.reviewedPassCount=c.metadata.records.filter(r=>r.reviewStatus==='reviewed_pass').length;
    if(Object.hasOwn(c.metadata.counts,'semanticallyReviewed'))c.metadata.counts.semanticallyReviewed=c.metadata.records.filter(r=>r.reviewStatus==='reviewed_pass'||['approved_semantic_review','approved_exam_meta_source'].includes(r.metadataStatus)).length;
    if(Object.hasOwn(c.metadata,'digest')){delete c.metadata.digest;c.metadata.digest=sha256(JSON.stringify(c.metadata));}
    outputs.set(META,c.metadata);
    for(const p of changedPacks){const rt=c.runtimes.get(p);rt.data.records.sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en'));c.refreshRuntime(rt.data);outputs.set(rt.rel,rt.data);}
  }
  if(!equal(state,nextState))outputs.set(STATE,nextState);
  report.fingerprintCauses=Object.fromEntries([...new Set(report.results.map(r=>r.fingerprintCause).filter(Boolean))]
    .sort().map(cause=>[cause,report.results.filter(r=>r.fingerprintCause===cause).length]));
  report.identityRebound=reboundUids.size;
  report.status=report.results.some(r=>r.status.startsWith('SUPPLEMENT_PENDING'))?'REGISTERED_WITH_SUPPLEMENTS':touched.size?'REGISTERED':'NO_CHANGE';
  report.unrelatedMetadataDigest=hash(c.metadata.records.filter(r=>!touched.has(r.questionUid)).sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')));
  report.sourceHashes=Object.fromEntries(sourceHashes);
  report.applied=touched.size;report.pending=Object.keys(nextState.pending).length;report.plannedPaths=[...outputs.keys()];
  if(doWrite)for(const [rel,obj]of outputs)write(root,rel,obj);
  if(reportPath)fs.writeFileSync(reportPath,json(report));
  return report;
}

export async function verifyMergedSource({root=ROOT,reportPath}) {
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8')),c=await context(root);
  const {loadResolvedConsumerCatalog}=await import('./reviewed-exam-registration-v2.mjs');
  const catalog=loadResolvedConsumerCatalog(root),byUid=new Map((catalog.records||[]).map(r=>[r.questionUid,r]));
  const appliedUids=new Set(report.results.filter(r=>r.status==='APPLY').map(r=>r.questionUid));
  if(report.unrelatedMetadataDigest&&hash(c.metadata.records.filter(r=>!appliedUids.has(r.questionUid)).sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')))!==report.unrelatedMetadataDigest)throw Error('BUILD_CHANGED_UNRELATED_METADATA');
  for(const [rel,digest] of Object.entries(report.sourceHashes||{}))if(sha256(fs.readFileSync(path.join(root,rel)))!==digest)throw Error('BUILD_CHANGED_SOURCE');
  const verified=[];
  for(const r of report.results.filter(r=>r.status==='APPLY')) {
    const receipt=read(root,r.receiptPath),row=c.metaByUid.get(r.questionUid),owner=c.owners.get(r.questionUid),rt=c.runtimes.get(owner)?.data.records.find(x=>x.questionUid===r.questionUid),consumer=byUid.get(r.questionUid);
    if(!receipt||!row||!rt||!consumer)throw Error('REGISTERED_UID_MISSING:'+r.questionUid);
    const identity=c.identityByJoin.get(`${r.sourceArchiveFile}#${r.sourceOrdinal}`);
    if(identity?.questionUid!==r.questionUid||identity.sourceFingerprint!==receipt.values.sourceFingerprint)
      throw Error('REGISTERED_IDENTITY_FINGERPRINT_PARITY:'+r.questionUid);
    if(receipt.solutionOnlyRebindProof&&row.independentMathReviewStatus!=='NOT_PERFORMED_BY_AUTO_REGISTRAR')
      throw Error('REBOUND_SOLUTION_REVIEW_MISCLAIM:'+r.questionUid);
    for(const f of ['problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket']) {
      if(!equal(row[f],receipt.values[f])||!equal(rt[f],receipt.values[f]))throw Error(`REGISTERED_PARITY:${r.questionUid}.${f}`);
    }
    const q=loadBank(fs.readFileSync(path.join(root,'archive/exams',r.sourceArchiveFile),'utf8'))[r.sourceOrdinal-1];
    if(hash(pick(q,STUDENT))!==receipt.studentPayloadHash)throw Error('REGISTERED_SOURCE_CHANGED');
    // The actual consumer can expose a recorded-metadata lane without conferring an independent QA approval.
    const cpt=consumer.problemTypeKey||consumer.metaHintPT;
    const ctpl=consumer.templateKey||consumer.metaHintTPL;
    if(cpt!==row.problemTypeKey||ctpl!==row.templateKey)throw Error('CONSUMER_PT_TPL_MISMATCH:'+r.questionUid+':'+JSON.stringify({cpt,ctpl,metaBinding:consumer.metaBinding,keys:Object.keys(consumer).filter(k=>/meta|ype|emplate/i.test(k))}));
    if(consumer.sourceFile!==r.sourceArchiveFile||Number(consumer.sourceOrdinal)!==r.sourceOrdinal)throw Error('CONSUMER_UID_JOIN_MISMATCH');
    if(!(consumer.problemTypeKey&&consumer.templateKey)&&!['exact','content'].includes(consumer.metaBinding))throw Error('CONSUMER_METADATA_NOT_SOURCE_BOUND');
    if(Number(consumer.difficultyBucket)!==Number(row.difficultyBucket))throw Error('CONSUMER_DIFFICULTY_MISMATCH');
    for(const field of ['crossConceptKeys','conditionKeys'])if(Object.hasOwn(consumer,field)&&!equal(consumer[field],row[field]))throw Error('CONSUMER_'+field+'_MISMATCH');
    verified.push({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,problemTypeKey:cpt,templateKey:ctpl,metaBinding:consumer.metaBinding||null});
  }
  const result={status:'PASS',verifiedCount:verified.length,verified,studentMutation:0};
  if(verified.length)write(root,`${AUTO}/last-verification.json`,{schemaVersion:VERSION,head:report.head,...result});
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const a=process.argv.slice(2),get=k=>a.includes(k)?a[a.indexOf(k)+1]:undefined;
  try {
    const root=get('--root')||ROOT,reportPath=get('--report')||path.join(process.env.RUNNER_TEMP||'/tmp','archive-auto-meta-report.json');
    const result=a.includes('--verify')?await verifyMergedSource({root,reportPath}):await registerMergedSource({root,write:a.includes('--write'),reportPath});
    console.log(JSON.stringify(result,null,2));
  }catch(e){console.error('AUTO_META_FAILED:',e.stack||e);process.exitCode=1;}
}
