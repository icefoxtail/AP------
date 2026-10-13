#!/usr/bin/env node
/**
 * SCAN intake dynamic-dispatch v1 — READ ONLY.
 * Node 22+, no third-party dependencies.
 * Reconcile source-only Git inventory with student production, Git branch/PR,
 * Library and formal-stage evidence. Do not mutate Git, Library, or leases.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const LANES = [
  'CREATE-A','CREATE-A1','CREATE-A2','CREATE-A3',
  'CREATE-B','CREATE-B1','CREATE-B2','CREATE-B3',
  'CREATE-C','CREATE-C1','CREATE-C2','CREATE-C3',
];
// Pro->Plus changes only execution slot count. Logical lane ownership is immutable.
export const CAPACITY_PROFILES = Object.freeze({
  pro12: Object.freeze([...LANES]),
  plus5: Object.freeze(['CREATE-SLOT-1','CREATE-SLOT-2','CREATE-SLOT-3','CREATE-SLOT-4','CREATE-SLOT-5']),
});
export function executionSlotForLane(lane, profile='pro12') {
  const index=LANES.indexOf(lane);
  if(index<0) throw new Error('Unknown logical lane '+lane);
  if(!Object.hasOwn(CAPACITY_PROFILES,profile)) throw new Error('Unknown capacity profile '+profile);
  if(profile==='pro12') return lane;
  return CAPACITY_PROFILES.plus5[index % CAPACITY_PROFILES.plus5.length];
}
export const INTAKE_ROOT = '스캔_인테이크_산출물/';

export function normalizeExamId(filename) {
  if (typeof filename !== 'string') return null;
  const base = path.posix.basename(filename.trim()).replace(/\.js$/i,'');
  const m = base.match(/^(\d{2,4})_(.+?)_(1|2)학기_(중간|기말)_(중[1-3]|고[1-3])_(수학|기출)(?:c)?$/i);
  if (!m) return null;
  const year = m[1].length===2 ? Number(m[1]) : Number(m[1].slice(2));
  if (!Number.isInteger(year) || year<0 || year>99) return null;
  const school=m[2].replace(/\s+/g,'');
  return `${String(year).padStart(2,'0')}_${school}_${m[3]}학기_${m[4]}_${m[5]}_수학`;
}

export function parseIdentity(k) {
  const id=normalizeExamId(k);
  if (!id) return null;
  const m=id.match(/^(\d\d)_(.+?)_([12])학기_(중간|기말)_(중[1-3]|고[1-3])_수학$/);
  return { id,year:Number(m[1]),school:m[2],semester:Number(m[3]),examType:m[4],grade:m[5] };
}

function sortedUnique(a) { return [...new Set(a)].sort((a,b)=>a.localeCompare(b,'ko')); }
function sha(s){return crypto.createHash('sha256').update(s).digest('hex');}
function parseIndexArray(x,names){for(const k of names)if(Array.isArray(x?.[k]))return x[k];return Array.isArray(x)?x:[];}
function ixPaths(r){
  if(!r)return [];
  const a=parseIndexArray(r,['files','items','paths']);
  return a.map(v=>typeof v==='string'?v:v.path||v.filename||v.name).filter(Boolean);
}
function isStudentProduct(p){
  return /(?:^|\/)archive\/exams\/(?:original|product|production)\/(?:middle\/m[1-3]\/|middle\/|m[1-3]\/|)/i.test('/'+p.replace(/^\/+/,''))&&p.endsWith('.js');
}

// Read actual tree bytes via git. No fetch, checkout, write or Git mutation.
export function gitTreeFiles(ref, subdir='') {
  const args=['ls-tree','-r','-z',ref];
  if(subdir)args.push('--',subdir);
  const raw=execFileSync('git',args,{maxBuffer:60*1024*1024}).toString('utf8');
  return raw.split('\0').filter(Boolean).map(l=>{
    const m=l.match(/^\d+ (blob|tree) ([0-9a-f]{40})\t(.+)$/s);
    if(!m)throw new Error('Unexpected git ls-tree item '+l.slice(0,150));
    return {type:m[1],sha:m[2],path:m[3]};
  });
}
export function gitHead(ref){return execFileSync('git',['rev-parse',ref],{encoding:'utf8'}).trim();}
export function gitSnapshot({sourceRef,productionRef}){
  const sourceItems=gitTreeFiles(sourceRef,INTAKE_ROOT)
    .filter(x=>x.path.endsWith('.js')&&x.type==='blob')
    .filter(x=>{
      const q=x.path.slice(INTAKE_ROOT.length).split('/');return q.length===2 && q[1].replace(/\.js$/,'')===q[0];
    })
    .map(x=>({examId:x.path.slice(INTAKE_ROOT.length).split('/')[0],sourceBlobSha:x.sha,sourcePath:x.path}));
  return {source:{complete:true,ref:sourceRef,sha:gitHead(sourceRef),items:sourceItems},
    production:{complete:true,ref:productionRef,sha:gitHead(productionRef),files:gitTreeFiles(productionRef,'archive/exams/').filter(x=>x.type==='blob'&&isStudentProduct(x.path))}};
}

export function pinsV4(){
  // Frozen V4 ownership, not a fixed universe / not a static denominator.
  const streams={
   A:[
    '21_금당중_1학기_기말','21_신흥중_1학기_기말',
    '21_왕의중_1학기_기말','22_동산중_1학기_중간',
    '22_연향중_1학기_중간','22_향림중_1학기_중간',
    '23_연향중_1학기_중간','24_삼산중_1학기_중간',
    '24_왕운중_2학기_기말','24_향림중_1학기_중간'],
   B:[
    '21_동산중_1학기_기말','21_연향중_1학기_기말',
    '21_풍덕중_1학기_중간','22_매산중_1학기_기말',
    '22_풍덕중_1학기_기말','23_동산중_1학기_중간',
    '23_풍덕중_1학기_기말','24_신흥중_1학기_중간',
    '24_이수중_1학기_중간','25_연향중_1학기_중간'],
   C:[
    '21_매산중_1학기_기말','21_왕운중_1학기_기말',
    '22_동산중_1학기_기말','22_신흥중_1학기_중간',
    '22_향림중_1학기_기말','23_연향중_1학기_기말',
    '23_향림중_1학기_중간','24_연향중_1학기_중간',
    '24_풍덕중_2학기_기말']
  };
  const out={};
  for(const [stream,roster] of Object.entries(streams)){
    roster.forEach((name,i)=>{out[`${name}_중3_수학`]={stream,lane:`CREATE-${stream}${i%4===0?'':i%4}` ,pinned:true}});
  }
  return out;
}
function laneForNew(id){ // stable: no renumbering from new batches
  let high=-1,choice=LANES[0];
  for(const lane of LANES){const score=BigInt('0x'+sha(`${id}\0${lane}`).slice(0,16));if(score>high){high=score;choice=lane;}}
  return choice;
}
const nowIso=()=>new Date().toISOString();

/**
 * snapshots: source, production, branches, prs, library, receipts, ownership
 * Each external index must have `complete: true` to authorize new CREATE.
 * `verified:true` with an exact SHA is mandatory for trusting stage receipts.
 */
export function dispatch(snapshots,{minYear=0,maxYear=25,grade='중3',pins=pinsV4(),generatedAt=nowIso(),campaign='SCAN_M3_DYNAMIC_V1',capacityProfile='pro12'}={}){
  if(!Object.hasOwn(CAPACITY_PROFILES,capacityProfile)) throw new Error('Invalid capacity profile: '+capacityProfile);
  const {source={},production={},branches={},prs={},library={},receipts={},ownership={}}=snapshots;
  const scope=(r)=>r && r.grade===grade && r.year>=minYear&&r.year<=maxYear;
  const sourceRows=parseIndexArray(source,['items','files']).map(x=>{
    let id=normalizeExamId(x.examId||x.target_id||x.sourcePath||x.path||'');
    if(!id&&typeof x==='string')id=normalizeExamId(x);
    return {id,sourcePath:x.sourcePath||x.path||null,sourceBlobSha:x.sourceBlobSha||x.sha||null};
  }).filter(x=>x.id&&scope(parseIdentity(x.id)));
  const sGroups=new Map();for(const r of sourceRows){if(!sGroups.has(r.id))sGroups.set(r.id,[]);sGroups.get(r.id).push(r);}
  const pIndex=new Map();
  for(const v of parseIndexArray(production,['files','items'])){
    const p=typeof v==='string'?v:v.path||v.filename;
    if(!p||!isStudentProduct(p))continue;
    const id=normalizeExamId(p);
    if(id){if(!pIndex.has(id))pIndex.set(id,[]);pIndex.get(id).push(p);}
  }
  const bIndex=new Map();
  for(const b of parseIndexArray(branches,['branches','refs'])){
    const ref=b.branch||b.name||b.ref||'UNKNOWN_REF';
    if(ref==='origin/main'||ref==='main')continue;
    for(const p of ixPaths(b)){
      if(!isStudentProduct(p))continue;
      const id=normalizeExamId(p);if(!id)continue;
      if(!bIndex.has(id))bIndex.set(id,[]);
      bIndex.get(id).push({ref,path:p});
    }
  }
  const prIndex=new Map();
  for(const pr of parseIndexArray(prs,['prs','pulls'])){
    for(const p of ixPaths(pr)){
      if(!isStudentProduct(p))continue;
      const id=normalizeExamId(p);if(!id)continue;
      if(!prIndex.has(id))prIndex.set(id,[]);
      prIndex.get(id).push({pr:pr.number||null,url:pr.url||null,path:p});
    }
  }
  const libIndex=new Map();
  for(const v of parseIndexArray(library,['items','files'])){
    const p=typeof v==='string'?v:(v.path||v.library_path||'');
    const m=p.match(/\/SCAN_M3_2021_2025\/[ABC]\/([^/]+)\/(?:CREATE|R1|R2|R3|source|$)/i);
    if(!m)continue;
    const id=normalizeExamId(m[1]);if(!id)continue;
    if(!libIndex.has(id))libIndex.set(id,[]);libIndex.get(id).push(p);
  }
  const rIndex=new Map();
  for(const r of parseIndexArray(receipts,['receipts','items'])){
    const id=normalizeExamId(r.examId||r.exam_id||'');if(!id)continue;
    if(!rIndex.has(id))rIndex.set(id,[]);rIndex.get(id).push(r);
  }
  const owned=ownership.assignments||ownership.owners||{};
  const coverage={
    source:source.complete===true, production:production.complete===true,
    branches:branches.complete===true, prs:prs.complete===true,
    library:library.complete===true, receipts:receipts.complete===true,
    ownership:ownership.complete===true
  };
  const requiredCoverage=Object.values(coverage).every(Boolean);
  const rows=[];
  for(const id of sortedUnique([...sGroups.keys()])){
    const orig=sGroups.get(id)||[], own=owned[id]||{}, pin=pins[id];
    const lane=own.lane||pin?.lane||laneForNew(id);
    const studentProducts=pIndex.get(id)||[], branchEvidence=bIndex.get(id)||[];
    const openPrs=prIndex.get(id)||[], libraryPaths=libIndex.get(id)||[];
    const rs=rIndex.get(id)||[];
    const validReceipt=rs.find(r=>
      r.verified===true && r.validation==='PASS' && r.remoteReadback===true &&
      r.stage==='CREATE' && /^[a-f0-9]{40}$/.test(r.artifactSha||''));
    const sourceChanged=!!own.sourceBlobSha && orig[0]?.sourceBlobSha!==own.sourceBlobSha;
    const lease=own.lease||null;
    let status,why;
    if(orig.length>1){status='DUPLICATE_REVIEW';why='Multiple distinct source paths for same exam identity';}
    else if(studentProducts.length){status='SKIP_PRODUCTION';why='Student production JS already present in main';}
    else if(sourceChanged){status='SOURCE_REVISION_REVIEW';why='Source blob SHA changed since claim; never silently overwrite';}
    else if(validReceipt){status='READY_R1';why='Explicit verified SHA-bound formal CREATE receipt';}
    else if(openPrs.length){status='PR_PENDING';why='An open PR already contains a student production candidate';}
    else if(lease?.active===true){status='IN_PROGRESS';why='Active writer lease; do not preempt';}
    else if(!requiredCoverage){status='INVENTORY_UNVERIFIED';why='At least one mandatory cross-system inventory incomplete';}
    else if(branchEvidence.length||libraryPaths.length||pin||own.lane){status='CREATE_RESUME';why='Existing owner/candidate or prior Library data must be inherited';}
    else {status='CREATE_NEW';why='No prior product, branch, PR or Library record in complete snapshots';}
    rows.push({id,year:parseIdentity(id).year,lane,executionSlot:executionSlotForLane(lane,capacityProfile),stream:lane.split('-')[1][0],pinned:!!pin,
      sourcePaths:orig.map(x=>x.sourcePath).filter(Boolean),sourceBlobSha:orig[0]?.sourceBlobSha||null,
      status,why,productionPaths:studentProducts,workingBranches:branchEvidence,openPrs,
      libraryFileCount:libraryPaths.filter(p=>p.includes('.')).length,libraryPaths:libraryPaths.slice(0,5),
      lease:lease?.active?lease:null,authoritativeReceiptSha:validReceipt?.artifactSha||null,
      mayStartCreate:status==='CREATE_NEW'||status==='CREATE_RESUME',gitWriteAllowed:false});
  }
  const counts=rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{});
  const lanes=Object.fromEntries(LANES.map(l=>[l,{count:0,new:0,resume:0,blocked:0,exams:[]}]));
  for(const x of rows){const lane=lanes[x.lane];if(!lane)throw new Error('Unknown lane '+x.lane);
    lane.count++;lane.exams.push({id:x.id,status:x.status});
    if(x.status==='CREATE_NEW')lane.new++;
    else if(x.status==='CREATE_RESUME')lane.resume++;
    else if(!x.mayStartCreate)lane.blocked++;
  }
  const workers=Object.fromEntries(CAPACITY_PROFILES[capacityProfile].map(slot=>
    [slot,{count:0,new:0,resume:0,blocked:0,logicalLanes:[],exams:[]}]
  ));
  for(const x of rows){
    const w=workers[x.executionSlot];
    w.count++; w.exams.push({id:x.id,lane:x.lane,status:x.status});
    if(!w.logicalLanes.includes(x.lane))w.logicalLanes.push(x.lane);
    if(x.status==='CREATE_NEW')w.new++;
    else if(x.status==='CREATE_RESUME')w.resume++;
    else w.blocked++;
  }
  for(const w of Object.values(workers))w.logicalLanes.sort();
  return {schemaVersion:2,campaign,generatedAt,policy:'READ_ONLY_NO_CLAIMS_NO_GIT_WRITES',
    capacityProfile,workerSlotCount:CAPACITY_PROFILES[capacityProfile].length,workers,
    sourceRef:source.ref||null,sourceHead:source.sha||null,
    mainRef:production.ref||null,mainHead:production.sha||null,
    completeForDispatch:requiredCoverage,inventoryCoverage:coverage,
    totals:{sourceCount:rows.length,pinnedExisting:rows.filter(x=>x.pinned).length,
      discoveredDynamic:rows.filter(x=>!x.pinned).length,statuses:counts},lanes,rows};
}

function optionArgs(args){let o={};for(let i=0;i<args.length;i++){
 const a=args[i];if(!a.startsWith('--'))throw Error('Unexpected argument '+a);
 if(a==='--help'||a==='--from-git'){o[a.slice(2)]=true;continue;}
 if(i+1>=args.length||args[i+1].startsWith('--'))throw Error('Missing argument '+a);
 o[a.slice(2)]=args[++i];
}return o;}
function readJson(f, def={complete:false}){return f?JSON.parse(fs.readFileSync(f,'utf8')):def;}
function main(argv){
 const opts=optionArgs(argv);
 if(opts.help){console.log('Usage: node scan-dispatch.mjs --source-index source.json --production-index main.json --branches-index branches.json --prs-index prs.json --library-index library.json --receipts-index receipts.json --ownership-index previous.json --output out.json [--min-year 0] [--max-year 25] [--profile pro12|plus5]  OR --from-git --source-ref origin/codex/scan-intake-deliverables-20261012 --production-ref origin/main [external indexes...]');return;}
 let git={};if(opts['from-git']!==undefined){
    git=gitSnapshot({sourceRef:opts['source-ref']||'origin/codex/scan-intake-deliverables-20261012',productionRef:opts['production-ref']||'origin/main'});
 }
 const snapshots={source:readJson(opts['source-index'],git.source),production:readJson(opts['production-index'],git.production),
   branches:readJson(opts['branches-index']),prs:readJson(opts['prs-index']),
   library:readJson(opts['library-index']),receipts:readJson(opts['receipts-index']),
   ownership:readJson(opts['ownership-index'])};
 if(!snapshots.source||!snapshots.production)throw Error('Need source and production snapshots (or --from-git)');
 const maxYear=opts['max-year']===undefined?25:Number(opts['max-year']);
 const minYear=opts['min-year']===undefined?0:Number(opts['min-year']);
 const output=dispatch(snapshots,{maxYear,minYear,grade:opts.grade||'중3',capacityProfile:opts.profile||'pro12'});
 const dest=opts.output||'scan-dispatch.json';fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(output,null,2)+'\n');
 const csv=['examId,lane,executionSlot,status,pinned,sourceBlobSha,reason',...output.rows.map(x=>
 [x.id,x.lane,x.executionSlot,x.status,x.pinned,x.sourceBlobSha||'',x.why].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n')+'\n';
 fs.writeFileSync(dest.replace(/\.json$/i,'')+'.csv',csv);
 console.log(JSON.stringify({output:dest,coverage:output.inventoryCoverage,totals:output.totals},null,2));
 if(!output.completeForDispatch){console.error('Not safe for autonomous dispatch: required inventory snapshot(s) missing/incomplete.');process.exitCode=2;}
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{main(process.argv.slice(2));}catch(e){console.error(e.stack||e);process.exitCode=1;}
}
