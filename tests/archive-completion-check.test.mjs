import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyItem, summarize, COLUMNS } from '../archive/tools/completion/lib.mjs';
import { parseArgs, outputPath, selectFiles, figureFacts, formatReport, probePython, reportWarnings, requireFailure } from '../archive/tools/completion/check.mjs';
const fixtures=JSON.parse(fs.readFileSync(new URL('./fixtures/completion-check/cases.json',import.meta.url)));
const base={question:{content:'Solve x+1=2',answer:0,solution:'Subtract one.'},meta:{standardUnitKey:'H22-U',subUnitKey:'S',standardUnit:'Unit',subUnit:'Sub',problemTypeKey:'P',templateKey:'T',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',fieldStatus:{standardUnit:'approved',subUnit:'approved',problemType:'approved',template:'approved',difficulty:'approved'}},unitLabels:new Map([['H22-U',{label:'Unit'}]]),subUnitLabels:new Map([['S',{label:'Sub',parent:'H22-U'}]]),registry:{status:'ACTIVE',problemTypes:new Map([['P',{status:'ACTIVE'}]]),templates:new Map([['T',{status:'ACTIVE',parentProblemTypeKey:'P'}]]),bindings:new Set(['2022\0H22-U\0S\0P'])},fourSlot:'REGISTERED'};
for(const f of fixtures)test(f.name,()=>{
 const input={...base,...f,question:{...base.question,...f.question},meta:{...base.meta,...f.meta,fieldStatus:{...base.meta.fieldStatus,...f.meta?.fieldStatus}}};
 const before=JSON.stringify(input),actual=classifyItem(input);
 for(const [k,v] of Object.entries(f.expect))assert.equal(actual[k],v,k);
 assert.equal(JSON.stringify(input),before,'pure classifier must not mutate');
});
test('canonical metadata wins and inline divergence is reported',()=>{const r=classifyItem({...base,question:{...base.question,difficultyBucket:5}});assert.equal(r.difficulty,'APPROVED');assert.deepEqual(r.inlineDiffers,['difficultyBucket']);});
test('registry unavailable is an environment state, never COMPLETE, with reasons',()=>{
 for(const registry of [{status:'UNAVAILABLE',errors:['META_REGISTRY_FILE_MISSING:x']},undefined]){const r=classifyItem({...base,registry});assert.equal(r.type,'REGISTRY_UNAVAILABLE');assert.notEqual(r.overall,'COMPLETE');assert.ok(r.reasons.includes('ACTIVE_META_REGISTRY_UNAVAILABLE'));}
 assert.ok(classifyItem({...base,registry:{status:'UNAVAILABLE',errors:['E1']}}).reasons.includes('REGISTRY:E1'));
 assert.equal(classifyItem({...base,meta:{...base.meta,problemTypeKey:null,templateKey:null},registry:{status:'UNAVAILABLE'}}).type,'MISSING');
});
test('blank, markup-only and placeholder values are not content',()=>{
 const stat=(question)=>classifyItem({...base,question:{...base.question,...question}});
 for(const answer of [[''],{},[[],{a:' '}],'<p></p>','&nbsp;','  ',null])assert.equal(stat({answer}).answer,'MISSING',JSON.stringify(answer));
 for(const solution of ['<p></p>','<br>','<p>&nbsp;</p>',[''],{}])assert.equal(stat({solution}).solution,'MISSING',JSON.stringify(solution));
 for(const content of ['<p></p>','<br/>','&nbsp;',[]])assert.equal(stat({content}).stem,'MISSING',JSON.stringify(content));
 for(const answer of [0,'0',['', '3'],{a:'①'},'<img src="a.png">'])assert.equal(stat({answer}).answer,'OK',JSON.stringify(answer));
 // figure/formula-only content is content, not MISSING
 for(const solution of ['<p><img src="a.png"></p>','<svg></svg>','<math><mn>1</mn></math>','<mjx-container></mjx-container>'])assert.equal(stat({solution}).solution,'OK',solution);
 assert.equal(stat({solution:'',solutionImage:'assets/s.png'}).solution,'OK');
 assert.equal(stat({content:'',question:'Q'}).stem,'OK');
});
test('placeholder answers and solutions share the boilerplate state and block',()=>{
 for(const answer of ['.','-','?','TODO','null','undefined','<p>-</p>',['-'],' todo ']){const r=classifyItem({...base,question:{...base.question,answer}});assert.equal(r.answer,'BOILERPLATE',JSON.stringify(answer));assert.equal(r.overall,'BLOCKED');assert.ok(r.reasons.includes('ANSWER_PLACEHOLDER'));}
 for(const solution of ['.','-','TODO','undefined']){const r=classifyItem({...base,question:{...base.question,solution}});assert.equal(r.solution,'BOILERPLATE',solution);assert.equal(r.overall,'BLOCKED');}
 for(const answer of ['-1','x','.5','①','null값']){assert.equal(classifyItem({...base,question:{...base.question,answer}}).answer,'OK',answer);}
 assert.equal(classifyItem({...base,question:{...base.question,solution:'-',solutionImage:'assets/s.png'}}).solution,'OK');
});
test('unit mismatch reasons tell apart name differences from keys missing in the master',()=>{
 const r=m=>classifyItem({...base,meta:{...base.meta,...m}});
 assert.deepEqual(r({standardUnit:'wrong'}).reasons.filter(x=>/^UNIT/.test(x)),['UNIT_NAME_DIFFERS:wrong!=Unit']);
 assert.ok(r({standardUnitKey:'H22-NONE'}).reasons.includes('UNIT_KEY_NOT_IN_MASTER:H22-NONE'));
 assert.ok(r({subUnitKey:'NOPE'}).reasons.includes('SUBUNIT_KEY_NOT_IN_MASTER:NOPE'));
 assert.ok(r({subUnit:'other'}).reasons.includes('SUBUNIT_NAME_DIFFERS:other!=Sub'));
 for(const m of [{standardUnit:'wrong'},{standardUnitKey:'H22-NONE'}])assert.equal(r(m).unit,'LABEL_MISMATCH');
});
test('four-slot blocking reasons are surfaced and never read as register-ready',()=>{
 const wrote={...base,fourSlot:'WRITTEN'};
 assert.equal(classifyItem(wrote).overall,'PENDING_REGISTER');
 for(const reason of ['NOT_SUBMITTED','EXPLICIT_REVIEW_HOLD:SOME_REASON','SOURCE_UID_CONFLICT']){
  for(const fourSlot of ['WRITTEN','REGISTERED']){const r=classifyItem({...base,fourSlot,fourSlotReasons:['OTHER',reason]});assert.ok(r.reasons.includes(reason),reason);assert.equal(r.overall,'IN_PROGRESS',reason+fourSlot);}
 }
 assert.equal(classifyItem({...wrote,fourSlotReasons:['SOMETHING_ELSE']}).overall,'PENDING_REGISTER');
});
test('all state distributions partition total; TSV has summary and rows',()=>{const rows=fixtures.map(f=>classifyItem({...base,...f,question:{...base.question,...f.question},meta:{...base.meta,...f.meta,fieldStatus:{...base.meta.fieldStatus,...f.meta?.fieldStatus}}}));const summary=summarize(rows);for(const c of COLUMNS)assert.equal(Object.values(summary.distribution[c]).reduce((a,b)=>a+b,0),rows.length);assert.match(formatReport({note:'overlap',summary,byExam:[],rows},'tsv'),/# SUMMARY/);});
test('CLI selection and validation',()=>{assert.deepEqual(parseArgs(['--exam','a.js','--exam','b.js']).exams,['a.js','b.js']);for(const args of [[],['--all','--scope','a'],['--format','bad','--all'],['--require','bad','--all'],['--exam']])assert.throws(()=>parseArgs(args));});
test('real SVG XML parsing, missing files, no figures, output path safety and deterministic selection',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'completion-test-'));try{
 fs.mkdirSync(path.join(dir,'archive/assets'),{recursive:true});fs.mkdirSync(path.join(dir,'archive/exams/original'),{recursive:true});
 fs.writeFileSync(path.join(dir,'archive/assets/good.svg'),'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');fs.writeFileSync(path.join(dir,'archive/assets/bad.svg'),'<svg><g></svg>');
 assert.equal(figureFacts({content:'<svg><g>'},dir).state,'BROKEN_SVG');assert.equal(figureFacts({image:'data:image/svg+xml,%3Csvg/%3E'},dir).state,'OK');
 assert.equal(figureFacts({},dir).state,'NOT_NEEDED');assert.equal(figureFacts({image:'assets/good.svg'},dir).state,'OK');assert.equal(figureFacts({image:'assets/bad.svg'},dir).state,'BROKEN_SVG');assert.equal(figureFacts({image:'assets/no.svg'},dir).state,'FILE_MISSING');
 fs.writeFileSync(path.join(dir,'archive/exams/original/a.js'),'');assert.deepEqual(selectFiles({exams:[],scope:'original',all:false},dir),['original/a.js']);assert.throws(()=>selectFiles({exams:['../bad.js']},dir));
 assert.throws(()=>outputPath(path.join(dir,'report.json'),dir));
 assert.equal(outputPath(dir+'-out.json',dir),dir+'-out.json');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('CLI refuses repository output before loading any data',()=>{const p=spawnSync(process.execPath,['archive/tools/completion/check.mjs','--all','--out','archive/forbidden-completion.json'],{encoding:'utf8'});assert.equal(p.status,2);assert.match(p.stderr,/outside repository/);assert.equal(fs.existsSync('archive/forbidden-completion.json'),false);});
test('output path through a symlink into the repository is rejected (skipped only without symlink privilege)',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'completion-link-')),link=dir+'-link';
 try{
  try{fs.symlinkSync(dir,link,'junction');}catch(e){if(e.code==='EPERM'){t.skip('symlink creation needs privilege on this machine (EPERM)');return;}throw e;}
  try{assert.throws(()=>outputPath(path.join(link,'report.json'),dir));}finally{fs.unlinkSync(link);}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('figureFacts scans nested fields, img tags (quoted or not) and self-closing svg',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'completion-fig-'));try{
  fs.mkdirSync(path.join(dir,'archive/assets'),{recursive:true});
  fs.writeFileSync(path.join(dir,'archive/assets/good.svg'),'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');
  fs.writeFileSync(path.join(dir,'archive/assets/bad.svg'),'<svg><g></svg>');fs.writeFileSync(path.join(dir,'archive/assets/p.png'),'x');
  const st=q=>figureFacts(q,dir).state;
  assert.equal(st({choices:['<svg><g></svg>']}),'BROKEN_SVG');
  assert.equal(st({choices:[{text:'①',figure:'<svg><g></svg>'}]}),'BROKEN_SVG');
  assert.equal(st({explanation:{steps:['<p>x</p>','<svg><g></svg>']}}),'BROKEN_SVG');
  assert.equal(st({choices:['<svg xmlns="http://www.w3.org/2000/svg" width="3"/>']}),'OK','self-closing svg is valid');
  assert.equal(st({choices:['<svg xmlns="http://www.w3.org/2000/svg"><svg><g/></svg></svg>']}),'OK','nested svg');
  assert.equal(st({choices:['<svg xmlns="http://www.w3.org/2000/svg"><g/></svg> and <svg><g></svg>']}),'BROKEN_SVG');
  assert.equal(st({content:'<svg>'}),'BROKEN_SVG');
  assert.equal(st({content:'<img src=assets/p.png>'}),'OK');
  assert.equal(st({content:'<img src=assets/missing.png>'}),'FILE_MISSING');
  assert.equal(st({content:'<img src=assets/missing.png/>'}),'FILE_MISSING');
  assert.equal(st({content:"<img class='a' src='assets/missing.png'>"}),'FILE_MISSING');
  assert.equal(st({choices:['<img src=assets/bad.svg>']}),'BROKEN_SVG');
  assert.equal(st({content:'<img>'}),'FILE_MISSING');
  assert.equal(st({content:'<img alt="x" src="">'}),'FILE_MISSING');
  assert.equal(st({solutionImage:'assets/missing.png'}),'FILE_MISSING');
  assert.equal(st({solutionImages:['assets/p.png']}),'OK');
  assert.equal(st({choices:[{image:'assets/missing.png'}]}),'FILE_MISSING');
  const remote=figureFacts({content:'<img src="https://example.com/a.png">'},dir);assert.equal(remote.state,'FILE_MISSING');assert.deepEqual(remote.unverifiedRemote,['https://example.com/a.png']);
  assert.equal(st({content:'<p>no figure</p>',choices:['1','2']}),'NOT_NEEDED');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('python probe: stubs and failures are an environment error, never "all SVGs broken"',()=>{
 assert.throws(()=>probePython([['definitely-not-a-real-python-xyz']]),/PYTHON_UNAVAILABLE/);
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'completion-py-'));try{
  const stub=path.join(dir,'stub.cjs'),wrong=path.join(dir,'wrong.cjs'),right=path.join(dir,'right.cjs');
  fs.writeFileSync(stub,'process.exit(49)');fs.writeFileSync(wrong,"process.stdout.write('[false,false]')");fs.writeFileSync(right,"process.stdout.write('[true,false]')");
  assert.throws(()=>probePython([[process.execPath,stub]]),/PYTHON_UNAVAILABLE.*exit 49/);
  assert.throws(()=>probePython([[process.execPath,wrong]]),/PYTHON_UNAVAILABLE/);
  assert.deepEqual(probePython([['definitely-not-a-real-python-xyz'],[process.execPath,stub],[process.execPath,right]]),[process.execPath,right],'falls through to the next working candidate');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
 assert.ok(probePython().length>=1,'this machine needs a working python3/python for SVG validation');
});
test('warnings: registry problems and empty selections are shown and fail --require',()=>{
 assert.deepEqual(reportWarnings([],'ACTIVE',[{overall:'COMPLETE'}]),[]);
 const w=reportWarnings(['META_REGISTRY_INDEX_NOT_ACTIVE'],'UNAVAILABLE',[{overall:'IN_PROGRESS'}]);assert.match(w[0],/REGISTRY_UNAVAILABLE.*META_REGISTRY_INDEX_NOT_ACTIVE/);
 assert.match(reportWarnings([],'ACTIVE',[])[0],/NO_QUESTIONS/);
 const report={note:'n',summary:{},byExam:[],registryDiagnostics:['E'],warnings:w,rows:[{overall:'IN_PROGRESS'}]};
 assert.match(formatReport(report,'tsv'),/^# n\n# WARNING\tREGISTRY_UNAVAILABLE/);
 assert.match(requireFailure(report),/--require complete FAILED.*REGISTRY_UNAVAILABLE/);
 assert.equal(requireFailure({rows:[{overall:'COMPLETE'}],warnings:[]}),null);
 assert.match(requireFailure({rows:[],warnings:[]}),/FAILED/);
});
