'use strict';
// This is a closed successor for one published eight-image repair. It creates
// no vector, semantic, native, mathematical or display-repair approval.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const PINS=freeze(require('./m2s2-image8-pins.json'));
const generated=require('./m2s2-image8-generated-forward.cjs');
const GROUP='currentM2Image8Continuity';
const SCHEMA='m2-s2-image8-existing-vector-continuity-v1';
const SCOPE='EXACT_IMAGE8_POINTERS_KEEP_FULL_LITERAL_METADATA_SUCCESSOR';
const ZERO=['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites','nativeMetadataWrites'];
const CARRIER=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-image8-existing-vector-continuity\.json$/;
const EVIDENCE=/^(?:docs\/operations\/|\.archive-meta-register\/evidence\/|archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/)[A-Za-z0-9_가-힣./-]+\.json$/;
const ASSET=/^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const FULL=['commit','path','gitBlobSha1','sha256'],SHORT=['commit','path','sha256'];
const GIT=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/;
const own=(o,k)=>Object.hasOwn(o||{},k),has=d=>own(d?.evidence,GROUP);
const family=d=>PINS.sources.find(s=>s.sourceArchiveFile===d?.sourceArchiveFile)?.examId||null;
const hasFor=(d,id)=>has(d)&&family(d)===id;
const selected=(source,uid,ordinal)=>PINS.selected.some(r=>r.sourcePath==='archive/exams/'+source&&r.questionUid===uid&&r.sourceOrdinal===ordinal);
const git=(root,args)=>execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});

// Only immutable obligation discovery is cached per reader. The HEAD is checked
// again on every invocation. Live bytes and current tree entries are never cached.
function createObligationReader(root,{safe,sha,blob,stable}) {
  let loaded=false,failed=false,observedHead=null,claims=[];
  function load(head) {
    if(loaded)return;loaded=true;observedHead=head;
    try {
      const history=git(root,['log','--full-history','--format=%H',head,'--',':(glob)docs/operations/**/m2-image8-existing-vector-continuity.json']).toString().trim().split(/\s+/).filter(Boolean),seen=new Set();
      for(const commit of new Set([head,...history])) {
        const paths=git(root,['ls-tree','-r','-z','--name-only',commit,'--','docs/operations']).toString().split('\0').filter(p=>CARRIER.test(p));
        for(const path of paths) {
          safe(root,path);const raw=git(root,['show',commit+':'+path]),digest=sha(raw),key=path+'#'+digest;
          if(seen.has(key))continue;seen.add(key);
          const p=JSON.parse(raw),fixed=PINS.sources.find(s=>s.sourceArchiveFile===p.sourceArchiveFile);
          if(!fixed||p.schemaVersion!==SCHEMA||p.scope!==SCOPE||ZERO.some(k=>p[k]!==0)||p.fullItemsSha256!==fixed.fullItemsSha256||stable(p.priorValidatedCompactRef)!==stable(fixed.priorCompactRef))throw Error('CLAIM');
          const r=p.sourceRef;if(!r||stable(Object.keys(r).sort())!==stable([...FULL].sort())||!GIT.test(r.commit||'')||!['path','gitBlobSha1','sha256'].every(k=>r[k]===fixed.currentSourceRef[k]))throw Error('SOURCE');
          const b=git(root,['show',r.commit+':'+r.path]);if(sha(b)!==r.sha256||blob(b)!==r.gitBlobSha1)throw Error('SOURCE_BYTES');
          claims.push({sourceArchiveFile:p.sourceArchiveFile,path,sha256:digest,fullItemsSha256:p.fullItemsSha256});
        }
      }
    }catch{failed=true;}
  }
  return d=>{
    if(!family(d)&&!has(d))return {required:false,errors:[],digest:null};
    let head;try{head=git(root,['rev-parse','--verify','HEAD']).toString().trim();if(!GIT.test(head))throw Error('HEAD');}catch{return {required:true,errors:['M2_IMAGE8_HISTORY_UNAVAILABLE'],digest:null};}
    if(loaded&&head!==observedHead)return {required:true,errors:['M2_IMAGE8_HEAD_DRIFT'],digest:null};
    load(head);if(failed)return {required:true,errors:['M2_IMAGE8_HISTORY_UNAVAILABLE'],digest:null};
    const entries=claims.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile);
    if(!entries.length)return {required:has(d),errors:has(d)?['M2_IMAGE8_ISSUED_CLAIM_REQUIRED']:[],digest:null,entries};
    const r=d.evidence?.[GROUP]?.carrier,ok=entries.length===1&&has(d)&&r?.path===entries[0].path&&r.sha256===entries[0].sha256&&sha(stable(d.items))===entries[0].fullItemsSha256;
    return {required:true,errors:ok?[]:['M2_IMAGE8_OBLIGATION_REQUIRED'],digest:sha(stable(entries)),entries};
  };
}

function evidenceDigests(root,d,{safe,sha}) {
  const out={},g=d.evidence?.[GROUP];if(!g)return out;
  const refs=[g.carrier,...PINS.uiFiles,...generated.PATHS.map(path=>({path}))];
  try{const p=JSON.parse(fs.readFileSync(safe(root,g.carrier.path)));refs.push(...(p.historicalEvidenceRefs||[]),...(p.staticCopyRefs||[]));}catch{}
  for(const r of refs)if(r?.path){try{out[r.path]=sha(fs.readFileSync(safe(root,r.path)));}catch{out[r.path]=null;}}
  return out;
}

function validateFile(root,d,hp,replayHistorical) {
  if(!has(d))return [];
  const {safe,sha,blob,stable,loadBank,assetRefs,payloadHash,identity}=hp;
  const fail=s=>{throw Error('M2_IMAGE8_'+s);},same=(a,b)=>stable(a)===stable(b);
  const keys=(o,ks)=>{if(!o||typeof o!=='object'||Array.isArray(o)||!same(Object.keys(o).sort(),[...ks].sort()))fail('FIELDS');};
  const project=(r,ks=FULL)=>Object.fromEntries(ks.map(k=>[k,r?.[k]]));
  const equalBytes=(a,b)=>['path','gitBlobSha1','sha256'].every(k=>a?.[k]===b?.[k]);
  const changed=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const only=(rows,p,code)=>{if(!Array.isArray(rows))fail(code);const found=rows.filter(p);if(found.length!==1)fail(code);return found[0];};
  let head;
  const ancestor=c=>{try{git(root,['merge-base','--is-ancestor',c,head]);}catch{fail('UNMERGED_REFERENCE');}};
  function rawAt(commit,path) {
    if(!GIT.test(commit||''))fail('COMMIT');safe(root,path);
    const entry=git(root,['ls-tree','-z','--full-tree',commit,'--',path]).toString(),m=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
    if(!m||m[2]!==path)fail('IMMUTABLE_REGULAR_FILE');
    const b=git(root,['show',commit+':'+path]);if(blob(b)!==m[1])fail('IMMUTABLE_BLOB');return b;
  }
  function read(r,{short=false,live=false,current=false,merged=false}={}) {
    keys(r,short?SHORT:FULL);if(!GIT.test(r.commit||'')||!SHA.test(r.sha256||'')||!short&&!GIT.test(r.gitBlobSha1||''))fail('REFERENCE');
    const b=rawAt(r.commit,r.path);if(sha(b)!==r.sha256||!short&&blob(b)!==r.gitBlobSha1)fail('IMMUTABLE_BYTES');
    if(merged)ancestor(r.commit);
    if(current&&!rawAt(head,r.path).equals(b))fail('CURRENT_HEAD_BYTES');
    if(live){const file=safe(root,r.path);let now;try{const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink())fail('LIVE_REGULAR_FILE');now=fs.readFileSync(file);}catch(e){if(String(e.message).startsWith('M2_IMAGE8_'))throw e;fail('LIVE_UNAVAILABLE');}if(!b.equals(now))fail('LIVE_BYTES');}
    return b;
  }
  function currentTreeFence(refs) {
    const paths=refs.map(r=>r.path);if(new Set(paths).size!==paths.length)fail('UI_DEPENDENCY_DUPLICATE');
    const raw=git(root,['ls-tree','-r','-z','--full-tree',head,'--',...paths]).toString(),found=new Map();
    for(const line of raw.split('\0').filter(Boolean)){const m=/^100644 blob ([a-f0-9]{40})\t(.+)$/.exec(line);if(!m||found.has(m[2]))fail('UI_CURRENT_TREE_MODE');found.set(m[2],m[1]);}
    if(found.size!==paths.length)fail('UI_CURRENT_TREE_COVERAGE');
    for(const r of refs){safe(root,r.path);if(found.get(r.path)!==r.gitBlobSha1)fail('UI_CURRENT_TREE_BYTES');
      // A sparse checkout may omit renderer-only files. Any materialized copy
      // must still be exact; current source and bank assets are mandatory below.
      const file=safe(root,r.path);let st;try{st=fs.lstatSync(file);}catch(e){if(e.code!=='ENOENT')throw e;}if(st){if(!st.isFile()||st.isSymbolicLink())fail('UI_LIVE_REGULAR_FILE');const b=fs.readFileSync(file);if(blob(b)!==r.gitBlobSha1||sha(b)!==r.sha256)fail('UI_LIVE_BYTES');}
    }
  }
  try {
    head=git(root,['rev-parse','--verify','HEAD']).toString().trim();if(!GIT.test(head))fail('HEAD');
    const fixed=PINS.sources.find(s=>s.sourceArchiveFile===d.sourceArchiveFile);if(!fixed)fail('SOURCE_SCOPE');
    const group=d.evidence[GROUP];keys(group,['carrier']);if(!CARRIER.test(group.carrier?.path||''))fail('CARRIER_PATH');
    const p=JSON.parse(read(group.carrier,{short:true,live:true,current:true,merged:true}));
    keys(p,['schemaVersion','scope','transportAuthor','examId','sourceArchiveFile','expectedQuestionCount','priorValidatedCompactRef','sourceRef','staticRefs','staticCopyRefs','generatedForwardPolicy','uiPublicationCommit','uiEvidenceRefs','historicalEvidenceRefs','rows','currentAssets','fullItemsSha256',...ZERO]);
    if(p.schemaVersion!==SCHEMA||p.scope!==SCOPE||typeof p.transportAuthor!=='string'||!p.transportAuthor.trim()||p.transportAuthor==='M1'||p.examId!==fixed.examId||p.sourceArchiveFile!==fixed.sourceArchiveFile||p.expectedQuestionCount!==fixed.questionCount||p.fullItemsSha256!==fixed.fullItemsSha256||ZERO.some(k=>p[k]!==0)||own(d,'scope'))fail('SCOPE');
    if(!same(p.generatedForwardPolicy,PINS.generatedForwardPolicy))fail('GENERATED_FORWARD_POLICY');
    if(!same(p.priorValidatedCompactRef,fixed.priorCompactRef)||!equalBytes(p.sourceRef,fixed.currentSourceRef)||!same(p.staticRefs,PINS.staticRefs))fail('PINNED_AUTHORITY');
    const obligation=hp.m2Image8Obligation;
    if(!obligation?.required||obligation.errors.length||obligation.entries?.length!==1||obligation.entries[0].path!==group.carrier.path||obligation.entries[0].sha256!==group.carrier.sha256)fail('HISTORY_REQUIRED');
    const priorRaw=read(p.priorValidatedCompactRef,{merged:true}),literal=JSON.parse(priorRaw);
    if(!literal.evidence?.[fixed.metadataGroup]||has(literal))fail('PRIOR_METADATA_SUCCESSOR');
    const replay=replayHistorical(root,p.priorValidatedCompactRef,hp);
    if(replay.errors?.length||!same(replay.document,literal))fail('HISTORICAL_CHAIN:'+(replay.errors||[]).join('|'));
    const refs=replay.requiredLiveEvidence;
    if(!Array.isArray(refs)||!refs.length||!same(p.historicalEvidenceRefs,refs)||new Set(refs.map(r=>r.path)).size!==refs.length)fail('HISTORICAL_EVIDENCE_COVERAGE');
    for(const ref of refs){if(!EVIDENCE.test(ref.path||''))fail('HISTORICAL_EVIDENCE_PATH');read(ref,{live:true,current:true});}
    const oldCarrier=JSON.parse(read(literal.evidence[fixed.metadataGroup].carrier,{short:true,live:true,current:true}));
    if(!same(oldCarrier.sourceRef,fixed.priorSourceRef))fail('PRIOR_SOURCE');
    const before=loadBank(read(fixed.priorSourceRef)),bank=loadBank(read(p.sourceRef,{live:true,current:true,merged:true}));
    if(before.length!==fixed.questionCount||bank.length!==fixed.questionCount||literal.items.length!==fixed.questionCount||d.items?.length!==fixed.questionCount)fail('FULL_DENOMINATOR');
    if(sha(stable(literal.items))!==fixed.fullItemsSha256)fail('PRIOR_VECTOR');
    const expected=structuredClone(literal);expected.evidence[GROUP]=group;
    if(!same(expected,d))fail('EXACT_LITERAL_COMPACT');
    const scope=PINS.selected.filter(r=>r.sourcePath===fixed.sourcePath),expectedRows=[];
    for(let i=0;i<bank.length;i++) {
      const q=bank[i],old=before[i],ordinal=i+1,number=sourceNumber(q),qno=sourceIdentityNumber(q),s=scope.find(x=>x.sourceOrdinal===ordinal);
      const id=only(identity.records,r=>r.sourceArchiveFile===fixed.sourceArchiveFile&&r.sourceOrdinal===ordinal,'IDENTITY');
      if(!/^qid_v1_[a-f0-9]{64}$/.test(id.questionUid||'')||identity.records.filter(r=>r.questionUid===id.questionUid).length!==1||id.status!=null&&id.status!=='VERIFIED'||id.sourceQuestionNo!==qno||sourceNumber(old)!==number||sourceIdentityNumber(old)!==qno||old.questionUid!==q.questionUid)fail('IDENTITY');
      const item=only(literal.items,r=>r.ordinal===number,'COMPACT_NUMBER'),delta=changed(old,q);
      if(s){if(id.questionUid!==s.questionUid||!same(delta,['image'])||old.image!==s.oldAssetPath.slice(8)||q.image!==s.newAssetPath.slice(8)||own(item,'registrationHold')||sha(stable(old))!==s.reviewedWholeQuestionSha256)fail('EXACT_IMAGE_POINTER');}
      else if(!same(old,q))fail('UNSELECTED_WHOLE_QUESTION');
      expectedRows.push({questionUid:id.questionUid,sourceOrdinal:ordinal,sourceQuestionNo:qno,ordinal:number,priorWholeQuestionSha256:sha(stable(old)),currentWholeQuestionSha256:sha(stable(q)),priorStudentPayloadSha256:payloadHash(old),currentStudentPayloadSha256:payloadHash(q),compactItemSha256:sha(stable(item)),changedFields:delta});
    }
    if(!same(p.rows,expectedRows))fail('ROW_COVERAGE');
    const assetPaths=[...new Set(bank.flatMap(assetRefs))].sort();
    if(!Array.isArray(p.currentAssets)||!same(p.currentAssets.map(r=>r.path),assetPaths))fail('ASSET_COVERAGE');
    for(const ref of p.currentAssets){if(!ASSET.test(ref.path||'')||ref.commit!==p.sourceRef.commit)fail('ASSET_SCOPE');const b=read(ref,{live:true,current:true});const s=scope.find(r=>r.newAssetPath===ref.path);if(s){if(blob(b)!==s.approvedAssetGitBlobSha1||sha(b)!==s.approvedAssetSha256||b.length!==s.approvedAssetBytes||!b.equals(rawAt(PINS.approvedAssetCommit,s.newAssetPath)))fail('APPROVED_ASSET_BYTES');}else if(!b.equals(rawAt(fixed.priorSourceRef.commit,ref.path)))fail('UNCHANGED_ASSET_BYTES');}
    // Old figures remain evidence, even though the current question points to a
    // new file. Reading both ends prevents a path-only alias from passing.
    for(const s of scope){const b=rawAt(PINS.originalSourceCommit,s.oldAssetPath);if(blob(b)!==s.reviewedOldAssetGitBlobSha1||sha(b)!==s.reviewedOldAssetSha256||b.length!==s.reviewedOldAssetBytes||!rawAt(fixed.priorSourceRef.commit,s.oldAssetPath).equals(b)||!rawAt(head,s.oldAssetPath).equals(b))fail('ORIGINAL_ASSET_BYTES');}
    if(!Array.isArray(p.staticCopyRefs)||p.staticCopyRefs.length!==2)fail('STATIC_COPY_COVERAGE');
    const statics=p.staticRefs.map((r,i)=>{const original=read(r),copy=p.staticCopyRefs[i];if(copy.commit!==PINS.staticCopyPublicationCommit||copy.path!=='docs/operations/m2-problem-image8-current-ui-20261116/static-v'+(i+1)+'-original.json'||copy.sha256!==r.sha256||copy.gitBlobSha1!==r.gitBlobSha1)fail('STATIC_COPY_REF');const bytes=read(copy,{live:true,current:true,merged:true});if(!bytes.equals(original))fail('STATIC_COPY_BYTES');return JSON.parse(original);});
    if(statics.some(s=>s.profile!==PINS.profile||s.actualUi!=='PENDING'||s.newFullMathematicalQa!==false||['newReview2Claims','newMetadataApprovals','newDifficultyJudgments'].some(k=>s[k]!==0)||s.producer===s.reviewer||s.rows?.length!==8)||!same(project(statics[1].priorStaticRef),PINS.staticRefs[0]))fail('STATIC_AUTHORITY');
    for(const s of PINS.selected)for(const st of statics){const r=only(st.rows,r=>r.key===s.key,'STATIC_ROW');if(r.staticDecision!=='ACCEPTED'||r.newAssetRef.commit!==PINS.approvedAssetCommit||r.newAssetRef.path!==s.newAssetPath||r.newAssetRef.gitBlobSha1!==s.approvedAssetGitBlobSha1||r.newAssetRef.sha256!==s.approvedAssetSha256||r.newAssetRef.bytes!==s.approvedAssetBytes)fail('STATIC_ASSET_JOIN');}
    if(p.uiPublicationCommit!==PINS.uiPublicationCommit)fail('UI_PUBLICATION');ancestor(p.uiPublicationCommit);
    const uiRefs=PINS.uiFiles.map(r=>({commit:p.uiPublicationCommit,...project(r,['path','gitBlobSha1','sha256'])}));
    if(!same(p.uiEvidenceRefs,uiRefs))fail('UI_EVIDENCE_COVERAGE');
    const ui=new Map();for(let i=0;i<uiRefs.length;i++){const b=read(uiRefs[i],{live:true,current:true});if(b.length!==PINS.uiFiles[i].bytes)fail('UI_BYTES');ui.set(PINS.uiFiles[i].role==='ORIGINAL_SELECTED_CAPTURE'?PINS.uiFiles[i].path:PINS.uiFiles[i].role,b);}
    const technical=JSON.parse(ui.get('ORIGINAL_TECHNICAL')),visual=JSON.parse(ui.get('INDEPENDENT_VISUAL')),closure=JSON.parse(ui.get('CLOSEOUT')),fence=JSON.parse(ui.get('CURRENT_GIT_FENCE'));
    if(technical.checkoutCommit!==PINS.actualUiCommit||technical.status!=='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'||technical.releaseGate!=='PENDING_INDEPENDENT_VISUAL_REVIEW'||technical.completedLogicalCases!==48||technical.failures.length||technical.sourceWrites!==0||technical.solutionsOpened!==false||technical.newFullMathematicalQa!==false||technical.newFourSlotApprovals!==0)fail('UI_TECHNICAL');
    if(visual.author!=='M1'||visual.actualRunId!==PINS.runId||visual.actualCommit!==PINS.actualUiCommit||visual.approvalEffect!=='NONE'||visual.rows.length!==8||visual.newFullMathematicalQa!==false||['newFourSlotApprovals','newNativeApprovals','newDifficultyJudgments','newBrowserExecution','sourceAssetChanges'].some(k=>visual[k]!==0)||!visual.oldStaticActualUiPendingPreserved||!visual.originalTechnicalVisualPendingPreserved)fail('INDEPENDENT_VISUAL');
    if(closure.status!=='SELECTED_EIGHT_CURRENT_SCREEN_REVIEW_COMPLETE'||closure.transportProfile!==PINS.profile||closure.actualUiRun.runId!==PINS.runId||closure.selected.length!==8||closure.counts.logicalCasesObserved!==16||closure.counts.originalPngsObserved!==18||closure.print.actualVisualValidation!=='NOT_RUN'||closure.print.separateGeneralPrintingRequirementsWaived!==false||closure.authorityBoundary.newFourSlotApprovals!==0)fail('UI_CLOSURE');
    const capturePaths=[];
    for(const s of PINS.selected){const v=only(visual.rows,r=>r.key===s.key&&r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal,'VISUAL_PARTITION');if(v.decision!=='OBSERVED_NO_SCREEN_DISPLAY_BLOCKER'||v.mathematicalCorrectnessRejudged!==false||v.originalOrRepairedGeometryApproved!==false||v.views.length!==2)fail('VISUAL_DECISION');
      for(const view of v.views){const t=only(technical.results,r=>r.key===s.key&&r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal&&same(r.viewport,view.viewport),'UI_CASE');if(t.status!=='PASS'||t.visualReview!=='PENDING'||!view.allListedOriginalCapturesDirectlyViewed||!view.bodyAndDisplayedOptionsReadable||!view.diagramLabelsAndStrokesVisible||!view.noObservedCaptureClipping||!view.noObservedObstruction||t.pageErrors.length||t.requestFailures.length||t.externalRequests.length||!t.capture.coverage.complete)fail('UI_CASE_RESULT');
        if(!equalBytes(t.sourceRef,PINS.sources.find(x=>x.sourcePath===s.sourcePath).currentSourceRef)||t.assetRef.path!==s.newAssetPath||t.assetRef.gitBlobSha1!==s.approvedAssetGitBlobSha1||t.assetRef.sha256!==s.approvedAssetSha256||!same(t.screenshots,view.originalCaptures.map(r=>project(r,['tileIndex','path','sha256','bytes']))))fail('UI_INPUT_CAPTURE_JOIN');
        for(const r of t.screenshots){const name='docs/operations/m2-problem-image8-current-ui-20261116/captures/'+r.path,b=ui.get(name);if(!b||sha(b)!==r.sha256||b.length!==r.bytes)fail('CAPTURE_BYTES');capturePaths.push(name);}
      }
    }
    if(capturePaths.length!==18||new Set(capturePaths).size!==18||!same([...capturePaths].sort(),PINS.uiFiles.filter(r=>r.role==='ORIGINAL_SELECTED_CAPTURE').map(r=>r.path).sort()))fail('CAPTURE_COVERAGE');
    const declared=[...technical.servedFiles,...technical.mirroredAssets,...['manifestRef','checkerRef','captureHelperRef','identityRef','fontLicenseRef'].map(k=>technical[k])];
    const byPath=new Map();for(const r of declared){const prior=byPath.get(r.path);if(prior&&!equalBytes(prior,r))fail('UI_DEPENDENCY_CONFLICT');byPath.set(r.path,r);}
    if(byPath.size!==207||fence.entries.length!==207||fence.uniqueRefCount!==207||!same(fence.entries.map(r=>r.path).sort(),[...byPath.keys()].sort()))fail('UI_DEPENDENCY_COVERAGE');
    for(const r of fence.entries)if(!equalBytes(r.actualRef,byPath.get(r.path))||r.actualRef.commit!==PINS.actualUiCommit||r.allThreeExact!==true)fail('UI_FENCE_JOIN');
    for(const [i,label]of ['metadata','identity'].entries()){const r=byPath.get(generated.PATHS[i]);if(!r||r.gitBlobSha1!==PINS.generatedForwardPolicy[label+'UiBlobSha1']||r.sha256!==PINS.generatedForwardPolicy[label+'UiSha256'])fail('UI_ORIGINAL_GENERATED_BYTES');}
    const fixedInputs=[...byPath.values()].filter(r=>!generated.PATHS.includes(r.path));
    if(fixedInputs.length!==205||generated.PATHS.some(path=>!byPath.has(path)))fail('UI_FORWARD_PARTITION');
    currentTreeFence(fixedInputs);
    generated.verify(root,hp,PINS,head);
    if(git(root,['rev-parse','--verify','HEAD']).toString().trim()!==head)fail('HEAD_DRIFT');
    return [];
  }catch(e){return [String(e.message).startsWith('M2_IMAGE8_')?e.message:'M2_IMAGE8_EVIDENCE_UNAVAILABLE'];}
}
module.exports={GROUP,SCHEMA,SCOPE,ZERO,CARRIER,has,family,hasFor,selected,createObligationReader,evidenceDigests,validateFile};
