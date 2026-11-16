'use strict';
// Generated metadata and identity are not renderer source. Their original UI
// bytes stay pinned; only exact selected meaning plus registered cursor changes
// may cross a later HEAD. This module grants no registration authority.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {TextDecoder}=require('node:util');
const PATHS=['archive/data/question_metadata.json','archive/data/question_identity_map.json'];
const REQUEST_PREFIX='.archive-meta-register/inbox/';
const RECEIPT=/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_.-]+\.json$/;

// Parse one record at a time, never a second complete metadata/identity object.
// Ignored top-level indexes are syntax-checked, including duplicate JSON keys.
function selectedRecords(raw,selectedUids,sources) {
  const text=new TextDecoder('utf-8',{fatal:true}).decode(raw);let at=0,recordsSeen=false;
  const rows=[],seen=new Set(),ws=()=>{while(/[\x20\t\r\n]/.test(text[at]||'x'))at++;};
  const err=()=>{throw Error('M2_IMAGE8_GENERATED_JSON');};
  function string(){if(text[at++]!=='"')err();const begin=at-1;let slash=false;while(at<text.length){const c=text[at++];if(c==='"'&&!slash)return JSON.parse(text.slice(begin,at));if(c.charCodeAt(0)<32)err();if(c==='\\'&&!slash)slash=true;else slash=false;}err();}
  function value(depth=0,top=false){if(depth>64)err();ws();const c=text[at];
    if(c==='{'){at++;ws();const keys=new Set();if(text[at]==='}'){at++;return;}
      for(;;){ws();if(text[at]!=='"')err();const k=string();if(keys.has(k))err();keys.add(k);ws();if(text[at++]!==':')err();
        if(top&&k==='records'){if(recordsSeen)err();recordsSeen=true;ws();if(text[at++]!=='[')err();ws();if(text[at]!==']')for(;;){ws();const start=at;if(text[at]!=='{')err();value(depth+1);const row=JSON.parse(text.slice(start,at));if(selectedUids.has(row.questionUid)||sources.has(row.sourceArchiveFile)){if(seen.has(row.questionUid))throw Error('M2_IMAGE8_GENERATED_DUPLICATE_UID');seen.add(row.questionUid);rows.push(row);}ws();if(text[at]===']')break;if(text[at++]!==',')err();}at++;}
        else value(depth+1);ws();if(text[at]==='}'){at++;return;}if(text[at++]!==',')err();}
    }
    if(c==='['){at++;ws();if(text[at]===']'){at++;return;}for(;;){value(depth+1);ws();if(text[at]===']'){at++;return;}if(text[at++]!==',')err();}}
    if(c==='"'){string();return;}
    for(const word of ['true','false','null'])if(text.startsWith(word,at)){at+=word.length;return;}
    const n=/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(at,at+128));if(n){at+=n[0].length;return;}err();
  }
  value(0,true);ws();if(at!==text.length||!recordsSeen)err();return rows;
}

function verify(root,hp,pins,head) {
  const {safe,sha,blob,stable,identity}=hp,policy=pins.generatedForwardPolicy;
  const fail=s=>{throw Error('M2_IMAGE8_GENERATED_'+s);},same=(a,b)=>stable(a)===stable(b);
  const git=(args,maxBuffer=32*1024*1024)=>execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer,stdio:['ignore','pipe','pipe']});
  const ids=new Set(pins.generatedBaselineRows.map(r=>r.questionUid)),sources=new Set(pins.sources.map(r=>r.sourceArchiveFile));
  const without=(r,fields)=>Object.fromEntries(Object.entries(r).filter(([k])=>!fields.includes(k)));
  const full=(r,keys)=>Object.fromEntries(keys.map(k=>[k,r[k]]));
  function rawAt(path){safe(root,path);const m=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(git(['ls-tree','-z','--full-tree',head,'--',path]).toString());if(!m||m[2]!==path)fail('HEAD_REGULAR_FILE');const limit=PATHS.includes(path)?128*1024*1024:32*1024*1024,declared=Number(git(['cat-file','-s',m[1]]).toString().trim());if(!Number.isSafeInteger(declared)||declared<1||declared>limit)fail('HEAD_SIZE');const raw=git(['cat-file','blob',m[1]],limit);if(raw.length!==declared||blob(raw)!==m[1])fail('HEAD_BLOB');return raw;}
  function live(path){const file=safe(root,path);let st;try{st=fs.lstatSync(file);}catch{fail('LIVE_UNAVAILABLE');}if(!st.isFile()||st.isSymbolicLink())fail('LIVE_REGULAR_FILE');if(st.size<1||st.size>(PATHS.includes(path)?128:32)*1024*1024)fail('LIVE_SIZE');return fs.readFileSync(file);}
  const parsed=new Map();
  function rows(raw){const key=sha(raw);if(!parsed.has(key))parsed.set(key,selectedRecords(raw,ids,sources));return parsed.get(key);}
  function partition(values,label){if(values.length!==47||new Set(values.map(r=>r.questionUid)).size!==47)fail(label+'_PARTITION');const m=new Map(values.map(r=>[r.questionUid,r]));for(const pin of pins.generatedBaselineRows){const r=m.get(pin.questionUid);if(!r||!same(full(r,['questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo']),full(pin,['questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo'])))fail(label+'_IDENTITY');}return m;}
  const headMeta=partition(rows(rawAt(PATHS[0])),'HEAD_METADATA'),headIds=partition(rows(rawAt(PATHS[1])),'HEAD_IDENTITY');
  const liveMeta=partition(rows(live(PATHS[0])),'LIVE_METADATA'),liveIds=partition(rows(live(PATHS[1])),'LIVE_IDENTITY');
  const supplied=partition((identity?.records||[]).filter(r=>ids.has(r.questionUid)||sources.has(r.sourceArchiveFile)),'CURRENT_IDENTITY');
  if(!same([...supplied].sort(),[...liveIds].sort()))fail('IDENTITY_INPUT_DRIFT');
  function check(meta,id,phase){
    const receiptCache=new Map();
    const receipt=path=>{if(!RECEIPT.test(path))return null;if(!receiptCache.has(path)){try{
      const raw=phase==='HEAD'?rawAt(path):live(path),r=JSON.parse(raw);
      if(phase==='LIVE'){
        let committed=null;try{committed=rawAt(path);}catch{}
        if(committed){if(!committed.equals(raw))fail('LIVE_RECEIPT_DRIFT');}
        else{
          // An uncommitted official write is supported only when HEAD already
          // contains the exact complete pending request. A receipt alone grants
          // nothing; selected meanings remain pinned independently below.
          if(!/^[A-Za-z0-9_.-]+$/.test(r.requestId||''))fail('PENDING_REQUEST_ID');
          const req=JSON.parse(rawAt(REQUEST_PREFIX+r.requestId+'.json'));
          if(req.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||req.requestId!==r.requestId||sha(stable(req))!==r.requestSha256||req.sourceArchiveFile!==r.sourceArchiveFile||req.expectedSourceBlobSha1!==r.sourceBlobSha1||req.expectedQuestionCount!==r.expectedQuestionCount||req.scope!=='PARTIAL_UIDS'||r.scope!==req.scope||!same(req.approval,r.approval)||req.approval?.metadataReviewed!==true||!same(req.registryChanges,[])||!same(r.registryChanges,[])||!Array.isArray(req.items)||req.items.length!==r.totalQuestions||new Set(req.items.map(x=>x.questionUid)).size!==req.items.length)fail('PENDING_REQUEST');
          for(const item of req.items){const old=headMeta.get(item.questionUid),now=meta.get(item.questionUid),applied=(r.appliedRecords||[]).filter(x=>x.questionUid===item.questionUid);
            if(!old||!now||old.sourceArchiveFile!==req.sourceArchiveFile||old.sourceOrdinal!==item.sourceOrdinal||applied.length!==1||!same(applied[0],now)||!item.before||!item.after||Object.entries(item.before).some(([k,v])=>!same(old[k],v))||Object.entries(item.after).some(([k,v])=>!same(now[k],v))||!(old.approvalEvidence||[]).every(x=>now.approvalEvidence?.includes(x)))fail('PENDING_COMPLETE_ROWS');
          }
        }
      }
      receiptCache.set(path,r);
    }catch{receiptCache.set(path,null);}}return receiptCache.get(path);};
    for(const pin of pins.generatedBaselineRows){const m=meta.get(pin.questionUid),i=id.get(pin.questionUid);
      if(sha(stable(without(m,policy.metadataCursorFields)))!==pin.metadataMeaningSha256||sha(stable(without(i,policy.identityCursorFields)))!==pin.identityTupleSha256)fail('SELECTED_MEANING_OR_TUPLE_CHANGED');
      const metadataChanged=sha(stable(m))!==pin.metadataWholeSha256,identityChanged=sha(stable(i))!==pin.identityWholeSha256;
      if(!metadataChanged&&!identityChanged)continue;
      if(!Array.isArray(m.approvalEvidence)||new Set(m.approvalEvidence).size!==m.approvalEvidence.length||!pin.originalApprovalEvidence.every(r=>m.approvalEvidence.includes(r)))fail('CURSOR_RECEIPT_REQUIRED');
      if(m.sourceFingerprint!==pin.baselineSourceFingerprint&&m.sourceFingerprint!==pin.currentSourceFingerprint||m.contentFingerprint!==pin.baselineContentFingerprint&&m.contentFingerprint!==pin.currentContentFingerprint||identityChanged&&i.sourceFingerprint!==pin.currentSourceFingerprint)fail('CURSOR_SOURCE_FINGERPRINT');
      const matches=m.approvalEvidence.filter(p=>typeof p==='string'&&RECEIPT.test(p)).map(receipt).filter(r=>r?.schemaVersion==='archive-reviewed-exam-meta-registration-v2'&&r.metadataRegistrationStatus==='REGISTERED'&&r.sourceArchiveFile===pin.sourceArchiveFile&&r.approval?.metadataReviewed===true&&r.appliedRecords?.filter(x=>x.questionUid===pin.questionUid&&same(x,m)).length===1&&(!identityChanged||r.appliedIdentityRecords?.filter(x=>x.questionUid===pin.questionUid&&same(x,i)).length===1));
      const source=pins.sources.find(s=>s.sourceArchiveFile===pin.sourceArchiveFile);
      const issued=matches.filter(r=>r.sourceBlobSha1===source.currentSourceRef.gitBlobSha1&&r.sourceRawSha256===source.currentSourceRef.sha256&&r.expectedQuestionCount===source.questionCount&&/^[a-f0-9]{64}$/.test(r.requestSha256||'')&&Number.isSafeInteger(r.totalQuestions)&&r.totalQuestions>0&&r.totalQuestions<=source.questionCount&&r.appliedRecords.length===r.totalQuestions&&new Set(r.appliedRecords.map(x=>x.questionUid)).size===r.totalQuestions&&Array.isArray(r.appliedIdentityRecords)&&r.appliedIdentityRecords.length===r.totalQuestions&&new Set(r.appliedIdentityRecords.map(x=>x.questionUid)).size===r.totalQuestions);
      if(!issued.length)fail('CURSOR_NOT_EXACT_ISSUED_ROW');
      for(const r of issued){if(!/^[A-Za-z0-9_.-]+$/.test(r.requestId||'')||!m.approvalEvidence.includes('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+r.requestId+'.json'))fail('RECEIPT_PATH');}
    }
  }
  check(headMeta,headIds,'HEAD');check(liveMeta,liveIds,'LIVE');
  return {schemaVersion:policy.schemaVersion,selectedUidCount:47,originalUiRawPreserved:true,headAndLiveSelectedMeaningsPreserved:true,newApprovals:0};
}
module.exports={PATHS,selectedRecords,verify};
