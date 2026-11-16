// Synthetic published receipts for native-continuity contract tests only.
// No production source, approval or question data is used here.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
export const CROSS='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
export const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
export const TAXONOMY='archive/data/meta-foundation/canonical/packs/synthetic/taxonomy.json';
export const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
export const SOURCE='original/middle/m2/1final/synthetic-issued-child.js';
export const META='archive/data/question_metadata.json',IDS='archive/data/question_identity_map.json';
export const RUNTIME='archive/data/meta-foundation/runtime/middle2-v1.json';
export const IMAGE='archive/assets/images/synthetic-issued-child/q1.png';
export const UID='qid_v1_'+ 'b'.repeat(64);
export const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
export const blob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
export const json=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
export const stable=value=>JSON.stringify(value,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const source=rows=>Buffer.from('window.questionBank = '+JSON.stringify(rows)+';\n');
const sf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,
  answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const cf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
export const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();

export function fixture(t,{kind='RPM_UNCHANGED_FP0',childChange,priorChange}={}) {
 const solution=kind==='SOLUTION_REBIND_FP1';
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'issued-child-continuity-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const write=(relative,value)=>{const p=path.join(root,relative);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,Buffer.isBuffer(value)?value:json(value));};
 const raw=relative=>fs.readFileSync(path.join(root,relative)),read=relative=>JSON.parse(raw(relative));
 const rpmPath={majorUnit:'unit',midUnit:'subunit',l3:'concept',l4:'method'};
 const q={id:1,content:'synthetic condition',choices:['one','two'],answer:'one',solution:'synthetic issued solution',
  courseKey:'M2-1',curriculum:'2022',rpmPrimaryId:'M2-RPM-SELECTED',rpmPrimaryPath:rpmPath,
  rpmL1:'unit',rpmL2:'subunit',rpmL3:'concept',rpmL4:'method',...(solution?{image:IMAGE.slice('archive/'.length)}:{})};
 const oldBank=[q,{id:2,content:'synthetic unselected neighbour',producer:'old'}];
 const beforeBank=structuredClone(oldBank);if(solution)beforeBank[0].solution='synthetic original solution';
 const beforeBytes=source(beforeBank),oldBytes=source(oldBank),imageBytes=Buffer.from('synthetic exact PNG bytes');
 git(root,'init','--quiet');git(root,'config','user.name','Synthetic Native Fixture');git(root,'config','user.email','fixture@example.invalid');
 write('archive/exams/'+SOURCE,beforeBytes);if(solution)write(IMAGE,imageBytes);
 git(root,'add','.');git(root,'commit','--quiet','-m','synthetic original source');
 let assetProofSourceCommit;
 if(solution){write('archive/exams/'+SOURCE,oldBytes);git(root,'add','.');git(root,'commit','--quiet','-m','synthetic published independent source');assetProofSourceCommit=git(root,'rev-parse','HEAD');}
 const cross={schemaVersion:'rpm-primary-active-crosswalk-v1',status:'ACTIVE_REFERENCE',rpmAuthority:{source:MASTER},
  records:[{id:'M2-RPM-SELECTED',curriculum:'2022',scope:'M2-1',rpmPath},{id:'M2-RPM-UNRELATED',curriculum:'2022',scope:'M2-1',rpmPath}],summary:{count:2}};
 const master={schemaVersion:'js-archive-taxonomy-rpm-primary-v1.0',authorityStatus:'LOCKED',records:[
  {curriculum:'2022',scope:'M2-1',majorUnit:'unit',midUnit:'subunit',concepts:[{concept:'concept',problemTypes:[{problemType:'method'}]}]}]};
 const taxonomy={schemaVersion:'synthetic-taxonomy',problemTypes:[{problemTypeKey:'PT_SYNTHETIC',ownerPack:'SYNTHETIC',status:'ACTIVE'}],
  templates:[{templateKey:'TPL_SYNTHETIC',parentProblemTypeKey:'PT_SYNTHETIC',ownerPack:'SYNTHETIC',status:'ACTIVE'}]};
 const proofPath='.archive-meta-register/evidence/synthetic-issued-child/original-proof.json';
 const proof=solution?{schemaVersion:'archive-narrow-metadata-independent-crosscheck-v1',questionUid:UID,sourceOrdinal:1,
  source:{path:'archive/exams/'+SOURCE,gitBlobSha1:blob(oldBytes),sha256:sha(oldBytes),head:'unverified-declared-head-not-used'},
  image:{path:IMAGE,sha256:sha(imageBytes),visuallyInspected:true}}:{role:'synthetic original independent approval'};
 const evidence=[[CROSS,cross],[MASTER,master],[TAXONOMY,taxonomy],[proofPath,proof]];
 const refs=evidence.map(([p,v])=>({path:p,sha256:sha(json(v))}));
 const priorId='synthetic-original-'+(solution?'fp1':'fp0'),priorPath=RECEIPTS+priorId+'.json';
 const current={questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:1,sourceQuestionNo:'1',metadataApprovalType:'FINAL_QA',
  metadataStatus:'approved_partial',reviewStatus:'reviewed_pass',tagStatus:'reviewed_pass',metadataApprovedBy:'synthetic-original-reviewer',
  metaFoundationPackId:'MIDDLE2',metaFoundationPackVersion:'1.0.7',curriculum:'2022',curriculumKey:'2022',courseKey:'M2-1',
  problemTypeKey:'PT_SYNTHETIC',templateKey:'TPL_SYNTHETIC',rpmPrimaryId:q.rpmPrimaryId,rpmPrimaryPath:rpmPath,
  rpmL1:'unit',rpmL2:'subunit',rpmL3:'concept',rpmL4:'method',sourceFingerprint:sf(q),contentFingerprint:cf(q),
  approvalEvidence:[priorPath],metadataRevision:`meta-foundation:MIDDLE2@1.0.7:exam-final_qa-v2:${priorId}`};
 const identity={questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:1,sourceQuestionNo:'1',sourceFingerprint:sf(q)};
 const runtimeRecord={...current,sourceIdentity:SOURCE+'#1'};
 const prior={schemaVersion:'archive-reviewed-exam-meta-registration-v2',metadataRegistrationStatus:'REGISTERED',requestId:priorId,
  requestSha256:'a'.repeat(64),examUid:'synthetic-exam',sourceArchiveFile:SOURCE,sourceBlobSha1:blob(oldBytes),sourceRawSha256:sha(oldBytes),
  scope:'PARTIAL_UIDS',totalQuestions:1,partialUidCount:1,expectedQuestionCount:2,
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-original-reviewer',evidenceRefs:refs},registryChanges:[],
  appliedRecords:[current],appliedIdentityRecords:[identity],runtimeRecords:[runtimeRecord],
  fingerprintRepairs:solution?[{questionUid:UID,sourceOrdinal:1,metadataBefore:{sourceFingerprint:sf(beforeBank[0]),contentFingerprint:cf(beforeBank[0])},
   identityBefore:{sourceFingerprint:sf(beforeBank[0])},after:{sourceFingerprint:sf(q),contentFingerprint:cf(q)},
   rebind:{priorSourceBlobSha1:blob(beforeBytes),priorContentFingerprint:cf(beforeBank[0])}}]:[],
  rpmPrimaryBindings:[{questionUid:UID,sourceOrdinal:1,recordId:q.rpmPrimaryId,crosswalkRef:refs[0],masterRef:refs[1],
   curriculum:'2022',scope:'M2-1',rpmPath,authorityUse:'RPM_PATH_PROVENANCE_ONLY',selectsPtTpl:false}]};
 priorChange?.(prior);for(const[p,v]of evidence)write(p,v);
 write('archive/exams/'+SOURCE,oldBytes);write(priorPath,prior);write(META,{records:prior.appliedRecords});
 write(IDS,{records:prior.appliedIdentityRecords});write(RUNTIME,{packId:'MIDDLE2',status:'ACTIVE',records:prior.runtimeRecords});
 git(root,'add','.');git(root,'commit','--quiet','-m','synthetic published original receipt');const priorCommit=git(root,'rev-parse','HEAD');
 const bank=structuredClone(oldBank);bank[1].producer='current';const bytes=source(bank);
 const liveCross=structuredClone(cross);liveCross.records.push({id:'M2-RPM-ADDED',curriculum:'2022',scope:'M2-1',rpmPath});liveCross.summary.count=3;
 write(CROSS,liveCross);write('archive/exams/'+SOURCE,bytes);
 const childId='synthetic-issued-child-'+(solution?'fp1':'fp0'),childPath=RECEIPTS+childId+'.json';
 const priorRef={path:priorPath,sha256:sha(json(prior))};
 const evidenceRefs=[...current.approvalEvidence,childPath],revision=`meta-foundation:MIDDLE2@1.0.7:exam-final_qa-v2:${childId}`;
 const child={schemaVersion:'archive-reviewed-exam-meta-registration-v2',metadataRegistrationStatus:'REGISTERED',requestId:childId,
  requestSha256:'c'.repeat(64),examUid:prior.examUid,sourceArchiveFile:SOURCE,sourceBlobSha1:blob(bytes),sourceRawSha256:sha(bytes),
  scope:'PARTIAL_UIDS',totalQuestions:1,partialUidCount:1,expectedQuestionCount:2,newMetadataApprovals:0,preservedMetadataApprovals:1,
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-preservation-actor',evidenceRefs:[priorRef],sourceRebind:{priorReceiptRef:priorRef}},
  registryChanges:[],fingerprintRepairs:[],appliedRecords:[{...current,approvalEvidence:evidenceRefs,metadataRevision:revision}],
  appliedIdentityRecords:[structuredClone(identity)],runtimeRecords:[{...runtimeRecord,approvalEvidence:evidenceRefs,metadataRevision:revision}]};
 childChange?.(child);write(childPath,child);write(META,{records:child.appliedRecords});write(IDS,{records:child.appliedIdentityRecords});
 write(RUNTIME,{packId:'MIDDLE2',status:'ACTIVE',records:child.runtimeRecords});git(root,'add','.');git(root,'commit','--quiet','-m','synthetic actual published source-preservation child');
 const childCommit=git(root,'rev-parse','HEAD');
 const sidecar={schemaVersion:'archive-native-issued-child-continuity-v1',kind,questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:1,
  expectedQuestionCount:2,childReceiptRef:{path:childPath,sha256:sha(json(child))},childPublishedCommit:childCommit,
  priorReceiptRef:priorRef,priorPublishedCommit:priorCommit,
  ...(solution?{imageProof:{sourceCommit:assetProofSourceCommit,assetRef:{path:IMAGE,sha256:sha(imageBytes)}}}:{})};
 const sidecarPath='archive/data/meta-foundation/evidence/native-issued-child-continuity/v1/'+childId+'.json';write(sidecarPath,sidecar);
 const input=()=>({root,receipt:child,nativeSource:{root,bytes,blobSha1:blob(bytes),bank,runtimeRecord:read(RUNTIME).records[0],runtimeStatus:'ACTIVE'},
  current:read(META).records[0],identity:read(IDS).records[0],ordinal:1});
 return{root,write,read,raw,kind,child,childPath,prior,priorPath,priorRef,priorCommit,childCommit,sidecar,sidecarPath,
  bytes,bank,oldBytes,oldBank,beforeBytes,beforeBank,imageBytes,input};
}
