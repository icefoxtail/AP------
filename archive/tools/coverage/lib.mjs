import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {curriculumForQuestion} from '../meta-foundation/active-registry.mjs';
import problemBank from '../../problem-bank-meta.js';
import runtime from '../../../tools/4slot/build-4slot-runtime.cjs';
import examItems from '../../../tools/4slot/exam-items.cjs';

export const NOTICE = '수학적으로 각 칸이 성립하는지는 판정하지 않는다. 공백 후보는 생성 지시나 승인 판정이 아니다.';
export const APPROVAL_SOURCE = 'archive/tools/build-archive2-catalog.mjs: approvedFieldStatus / buildMetaHint (field approval, exact source tuple and content fingerprint)';
// Copied verbatim from the catalog because that CLI performs writes on import.
export const approvedFieldStatus = (value) => /^approved(?:_|$)/i.test(String(value || ''));
const text = value => typeof value === 'string' ? value.trim() : '';
const key = row => JSON.stringify(row);
const bucket = value => Number.isInteger(value) && value >= 1 && value <= 5;
export const methodGroup = value => Array.isArray(value) && value.length && value.every(v => Number.isInteger(v) && v > 0)
  ? [...new Set(value)].sort((a,b)=>a-b) : null;
export function outsideOutput(root, out) {
  if (!out) throw Error('--out is required');
  const target=path.resolve(out), realRoot=fs.realpathSync(root);
  let parent=target;
  while(!fs.existsSync(parent)) parent=path.dirname(parent);
  const real=path.resolve(fs.realpathSync(parent),path.relative(parent,target));
  if(real===realRoot || real.startsWith(realRoot+path.sep)) throw Error('OUTPUT_INSIDE_REPOSITORY');
  return target;
}
export function parseArgs(argv, allowed) {
  const opts={};
  for(let i=0;i<argv.length;i+=2) {
    if(!allowed.includes(argv[i]) || !argv[i+1] || argv[i+1].startsWith('--') || opts[argv[i].slice(2)]!==undefined) throw Error('INVALID_ARGUMENT: '+argv[i]);
    opts[argv[i].slice(2)]=argv[i+1];
  }
  return opts;
}
const summary = () => ({total:0,complete:0,missingType:0,missingFourSlot:0,missingDifficulty:0,missingUnit:0,missingCurriculum:0,unknownAny:0});
const unitKey = r => key([r.curriculum,r.course,r.standardUnitKey,r.subUnitKey]);
const courseKey = r => key([r.curriculum,r.course]);
const identity = r => ({questionUid:r.questionUid,sourceArchiveFile:r.sourceArchiveFile,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo});
export function aggregate(records, {taxonomy={templates:[]}, selection={}}={}) {
  const views={};
  for(const mode of ['values','approved']) {
    const cells=new Map(), units=new Map(), courses=new Map(), observedTypes=new Map(), sourceTotals={}, totals=summary();
    for(const r of records) {
      sourceTotals[r.sourceKind]=(sourceTotals[r.sourceKind]||0)+1;
      const approved=mode==='approved';
      const unit=Boolean(r.standardUnitKey && r.subUnitKey && r.unitValid!==false && (!approved || r.approved.unit));
      const type=Boolean(r.problemTypeKey && r.templateKey && (!approved || r.approved.type));
      const method=methodGroup(r.method), four=Boolean(method && (!approved || r.approved.fourSlot));
      const diff=bucket(r.difficultyBucket) && (!approved || r.approved.difficulty);
      const curriculum=Boolean(r.curriculum && r.course);
      const missing={missingType:!type,missingFourSlot:!four,missingDifficulty:!diff,missingUnit:!unit,missingCurriculum:!curriculum};
      const complete=!Object.values(missing).some(Boolean);
      const update = s => {s.total++;s.complete+=Number(complete);s.unknownAny+=Number(!complete);for(const [k,v] of Object.entries(missing)) s[k]+=Number(v);};
      update(totals);
      const ck=courseKey(r);if(!courses.has(ck))courses.set(ck,{curriculum:r.curriculum,course:r.course,...summary()});update(courses.get(ck));
      // Unknown unit rows stay at course level: never allocate them to a guessed unit.
      if(unit){const uk=unitKey(r);if(!units.has(uk))units.set(uk,{curriculum:r.curriculum,course:r.course,standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,...summary()});update(units.get(uk));}
      if(unit&&type&&curriculum) {
        const tk=key([unitKey(r),r.problemTypeKey,r.templateKey]);
        if(!observedTypes.has(tk))observedTypes.set(tk,{curriculum:r.curriculum,course:r.course,standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,problemTypeKey:r.problemTypeKey,templateKey:r.templateKey,bySource:{original:0,similar:0,textbookWorkbook:0,generated:0,other:0},levels:[],levelExamples:{},methods:[],methodExamples:[],sourceExamples:{},examples:[]});
        const t=observedTypes.get(tk);t.bySource[r.sourceKind in t.bySource?r.sourceKind:'other']++;
        if(diff){if(!t.levels.includes(r.difficultyBucket))t.levels.push(r.difficultyBucket);const e=t.levelExamples[r.difficultyBucket]||(t.levelExamples[r.difficultyBucket]=[]);if(e.length<3)e.push(identity(r));}
        if(four){if(!t.methods.some(v=>key(v)===key(method)))t.methods.push(method);if(t.methodExamples.length<3)t.methodExamples.push(identity(r));}
        const se=t.sourceExamples[r.sourceKind]||(t.sourceExamples[r.sourceKind]=[]);if(se.length<3)se.push(identity(r));
        if(t.examples.length<3)t.examples.push(identity(r));
      }
      if(!complete)continue;
      const dims={curriculum:r.curriculum,course:r.course,standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,problemTypeKey:r.problemTypeKey,templateKey:r.templateKey,method, difficultyBucket:r.difficultyBucket};
      const ck2=key(dims);if(!cells.has(ck2))cells.set(ck2,{...dims,count:0,bySource:{original:0,similar:0,textbookWorkbook:0,generated:0,other:0},examples:[]});
      const c=cells.get(ck2);c.count++;c.bySource[r.sourceKind in c.bySource?r.sourceKind:'other']++;if(c.examples.length<3)c.examples.push(identity(r));
    }
    views[mode]={summary:totals,sourceTotals,observedTypes:[...observedTypes.values()],cells:[...cells.values()].sort((a,b)=>key(a).localeCompare(key(b))),units:[...units.values()],courses:[...courses.values()]};
  }
  return {schemaVersion:'archive-coverage-map-v1',notice:NOTICE,selection,approvalSource:APPROVAL_SOURCE,generatedSource:'archive/data/generated-lite-consumer/v1/index.json (consumer index only; candidate ledgers excluded); approval: problem-bank-meta.projectGenerated.verifiedEligible; no generated 4slot store joined',curriculumSource:'explicit value, then active-registry.curriculumForQuestion',fourSlotApprovalMeaning:'REGISTERED runtime vector, not an independent semantic review claim',views,mergeCandidates:similarTemplates(taxonomy.templates||[])};
}
function distance(a,b){let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const row=[i];for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+Number(a[i-1]!==b[j-1]));prev=row;}return prev[b.length];}
export function similarTemplates(templates) {
  const groups=new Map(), out=[];
  for(const t of templates.filter(t=>t.status==='ACTIVE')) {const p=t.parentProblemTypeKey;if(!groups.has(p))groups.set(p,[]);groups.get(p).push(t);}
  for(const [pt,rows] of groups)for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++) {
    const a=text(rows[i].canonicalLabelKo),b=text(rows[j].canonicalLabelKo);if(!a||!b)continue;
    const d=distance(a,b);if(d<=2 && d/Math.max(a.length,b.length)<=0.25)out.push({problemTypeKey:pt,templateKeys:[rows[i].templateKey,rows[j].templateKey],labels:[a,b],editDistance:d,automaticMerge:false});
  }
  return out;
}
function read(root,p){return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));}
function uniqueIndex(rows,getKey){const map=new Map();for(const r of rows){const k=getKey(r);map.set(k,map.has(k)?null:r);}return map;}
export function loadRecords(root,{scope,course}={}) {
  if(Boolean(scope)===Boolean(course))throw Error('Specify exactly one of --scope or --course');
  if(scope && (!/^[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/i.test(scope)))throw Error('INVALID_SCOPE');
  const metadata=read(root,'archive/data/question_metadata.json');
  const ids=uniqueIndex(read(root,'archive/data/question_identity_map.json').records,r=>r.sourceArchiveFile+'#'+r.sourceOrdinal);
  const metas=uniqueIndex(metadata.records,r=>r.questionUid);
  const taxonomy=read(root,'archive/data/meta-foundation/compiled/taxonomy_registry.json');
  const pts=new Set(taxonomy.problemTypes.filter(r=>r.status==='ACTIVE').map(r=>r.problemTypeKey));
  const tpls=new Map(taxonomy.templates.filter(r=>r.status==='ACTIVE').map(r=>[r.templateKey,r]));
  const tags=read(root,'archive/data/master_tables/js_archive_tag_master.json');
  const units=new Set(tags.filter(t=>t.status==='active'&&t.keyType==='standardUnitKey').map(t=>t.key));
  const subs=new Map(tags.filter(t=>t.status==='active'&&t.keyType==='subUnitKey').map(t=>[t.key,t]));
  const validUnit=(u,s)=>units.has(u)&&subs.get(s)?.standardUnitKey===u;
  const index=read(root,'archive/data/item-4slot-index.json');
  const registered=uniqueIndex(index.records||[],r=>r.questionUid);
  const indexFiles=new Map((index.files||[]).map(r=>[r.path,r]));
  const dicts=new Map();
  const dictDir=path.join(root,'docs/architecture/4slot');
  for(const name of fs.existsSync(dictDir)?fs.readdirSync(dictDir):[])if(/^term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/.test(name)) {
    const d=read(root,'docs/architecture/4slot/'+name);dicts.set(d.dictionaryVersion,{terms:new Map(d.terms.map(t=>[t.id,t]))});
  }
  const files=execFileSync('git',['-C',root,'ls-files','-z','archive/exams'],{encoding:'utf8',maxBuffer:16*1024*1024}).split('\0').filter(p=>p.endsWith('.js'));
  const records=[], issues=[];
  for(const rel of files) {
    const file=rel.slice('archive/exams/'.length);
    if(scope && !(file.startsWith(scope+'/')||file.includes('/'+scope+'/')))continue;
    const raw=fs.readFileSync(path.join(root,rel)); // Missing sparse files are an environment error, never zero coverage.
    let bank;try{bank=runtime.loadBank(raw);}catch(e){issues.push({sourceArchiveFile:file,reason:e.message,unquantified:true});continue;}
    const compactPath='archive/data/item-4slot/'+file.replace(/\.js$/,'.4slot.json');
    let compact=null, compactRaw=null;
    if(fs.existsSync(path.join(root,compactPath))){compactRaw=fs.readFileSync(path.join(root,compactPath));compact=JSON.parse(compactRaw);}
    else if(indexFiles.has(compactPath))throw Error('INDEXED_COMPACT_UNAVAILABLE: '+compactPath);
    const slots=uniqueIndex(compact?.items||[],r=>String(r.ordinal));
    const seenNumbers=new Map();for(const q of bank){let n;try{n=String(examItems.sourceNumber(q));}catch{continue;}seenNumbers.set(n,(seenNumbers.get(n)||0)+1);}
    for(const [i,q] of bank.entries()) {
      const ordinal=i+1,id=ids.get(file+'#'+ordinal),candidate=id&&metas.get(id.questionUid);
      const meta=candidate?.sourceArchiveFile===file&&candidate.sourceOrdinal===ordinal?candidate:{};
      const value=k=>meta[k]!==undefined && meta[k]!==null && meta[k]!=='' ? meta[k] : q[k]??'';
      const curriculum=text(value('curriculumKey')||value('curriculum')) || curriculumForQuestion({standardUnitKey:value('standardUnitKey'),sourceArchiveFile:file});
      const standardCourse=text(value('standardCourse')||value('courseKey'));
      if(course && standardCourse!==course)continue;
      let display=null;try{display=String(examItems.sourceNumber(q));}catch{}
      const slot=display && seenNumbers.get(display)===1 && compact?.sourceArchiveFile===file?slots.get(display):null;
      const dict=dicts.get(compact?.dictionaryVersion);
      const slotErrors=slot ? [
        ...(compact.schemaVersion!=='archive-meta-4slot-compact-v1'?['UNSUPPORTED_SCHEMA']:[]),
        ...(!dict?['DICTIONARY_VERSION_UNKNOWN']:runtime.validateItem(slot,dict))
      ]:[];
      if(slotErrors.length)issues.push({sourceArchiveFile:file,sourceOrdinal:ordinal,reason:slotErrors.join('|'),unquantified:false});
      const vector=slotErrors.length?null:methodGroup(slot?.method);
      const rr=id&&registered.get(id.questionUid),fi=indexFiles.get(compactPath);
      const registeredCurrent=Boolean(rr?.registrationStatus==='REGISTERED'&&rr.sourceArchiveFile===file&&rr.sourceOrdinal===ordinal&&String(rr.sourceQuestionNo)===examItems.sourceIdentityNumber(q)&&rr.compactPath===compactPath&&fi?.compactSha256===runtime.sha(compactRaw||'')&&fi.currentSourceBlobSha===runtime.blob(raw)&&JSON.stringify(methodGroup(rr.method))===JSON.stringify(vector)&&!slot?.registrationHold);
      const bound=Boolean(id&&meta.questionUid===id.questionUid&&String(id.sourceQuestionNo)===examItems.sourceIdentityNumber(q)&&meta.contentFingerprint===runtime.sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null})));
      const canonical=k=>meta[k]!==undefined && meta[k]!==null && meta[k]!=='' && JSON.stringify(meta[k])===JSON.stringify(value(k));
      const status=meta.fieldStatus||{},pt=text(value('problemTypeKey')),tpl=text(value('templateKey'));
      const typeValid=pts.has(pt)&&tpls.get(tpl)?.parentProblemTypeKey===pt;
      const sourceKind=file.startsWith('original/')?'original':file.startsWith('similar/')?'similar':/^(textbooks|workbooks|types)\//.test(file)?'textbookWorkbook':/^(generated|alive)\//i.test(file)?'generated':'other';
      records.push({questionUid:id?.questionUid||'',sourceArchiveFile:file,sourceOrdinal:ordinal,sourceQuestionNo:examItems.sourceIdentityNumber(q),sourceKind,curriculum,course:standardCourse,unitValid:validUnit(text(value('standardUnitKey')),text(value('subUnitKey'))),standardUnitKey:text(value('standardUnitKey')),subUnitKey:text(value('subUnitKey')),problemTypeKey:typeValid?pt:'',templateKey:typeValid?tpl:'',method:vector,difficultyBucket:value('difficultyBucket'),approved:{unit:bound&&canonical('standardUnitKey')&&canonical('subUnitKey')&&approvedFieldStatus(status.standardUnit)&&approvedFieldStatus(status.subUnit),type:bound&&canonical('problemTypeKey')&&canonical('templateKey')&&approvedFieldStatus(status.problemType)&&approvedFieldStatus(status.template)&&meta.foundationTaxonomyStatus!=='HOLD',difficulty:bound&&canonical('difficultyBucket')&&approvedFieldStatus(status.difficulty),fourSlot:registeredCurrent}});
    }
  }
  // Generated questions have a distinct, UID-indexed production store. Do not scan
  // candidate ledgers or double-count copies of the same generated UID.
  const generatedPath='archive/data/generated-lite-consumer/v1/index.json';
  if(fs.existsSync(path.join(root,generatedPath))) {
    const generated=read(root,generatedPath), seen=new Set();
    for(const row of generated.records||[]) {
      if(seen.has(row.uid))throw Error('DUPLICATE_GENERATED_UID');seen.add(row.uid);
      const v=problemBank.projectGenerated(row,null,generated.userDisabledUids||[]);
      const c=text(v.standardCourse)||text(row.subject),u=text(v.standardUnitKey),sub=text(v.subUnitKey);
      const source=String(row.sourceExamPath||v.sourceRelation?.sourceExamPath||'').replace(/^archive\/exams\//,'');
      const matchesScope=scope&&(source.startsWith(scope+'/')||source.includes('/'+scope+'/'));
      const gradeScope=scope&&/^middle\/m[123]$/.test(scope)&&u.startsWith('M'+scope.at(-1)+'-');
      if(scope&&!matchesScope&&!gradeScope)continue;
      if(course&&c!==course)continue;
      const validType=pts.has(v.problemTypeKey)&&tpls.get(v.templateKey)?.parentProblemTypeKey===v.problemTypeKey;
      records.push({questionUid:row.uid,sourceArchiveFile:row.shard||generatedPath,sourceOrdinal:row.localOrdinal||null,sourceQuestionNo:String(row.localOrdinal||''),sourceKind:'generated',curriculum:curriculumForQuestion({standardUnitKey:u,sourceArchiveFile:source}),course:c,unitValid:validUnit(u,sub),standardUnitKey:u,subUnitKey:sub,problemTypeKey:validType?v.problemTypeKey:'',templateKey:validType?v.templateKey:'',method:null,difficultyBucket:v.difficultyBucket,approved:{unit:Boolean(v.verifiedEligible),type:Boolean(v.verifiedEligible),difficulty:Boolean(v.verifiedEligible),fourSlot:false}});
    }
  } else issues.push({sourceArchiveFile:generatedPath,reason:'GENERATED_INDEX_UNAVAILABLE',unquantified:true});
  return {records,taxonomy,issues};
}
export function toTsv(map) {
  const cols=['view','curriculum','course','standardUnitKey','subUnitKey','problemTypeKey','templateKey','method','difficultyBucket','count','bySource'];
  const lines=['# '+map.notice,cols.join('\t')];
  for(const [view,data] of Object.entries(map.views))for(const cell of data.cells)lines.push(cols.map(c=>JSON.stringify(c==='view'?view:cell[c])).join('\t'));
  for(const [view,data] of Object.entries(map.views)) {lines.push('# summary '+view+' '+JSON.stringify(data.summary));for(const r of data.units)lines.push('# unit '+view+' '+JSON.stringify(r));for(const r of data.courses)lines.push('# course '+view+' '+JSON.stringify(r));}
  lines.push('# mergeCandidates '+JSON.stringify(map.mergeCandidates),'# inputIssues '+JSON.stringify(map.inputIssues||[]));return lines.join('\n')+'\n';
}
