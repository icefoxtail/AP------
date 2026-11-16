import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyItem, summarize, COLUMNS } from '../archive/tools/completion/lib.mjs';
import { parseArgs, outputPath, selectFiles, figureFacts, formatReport } from '../archive/tools/completion/check.mjs';
const fixtures=JSON.parse(fs.readFileSync(new URL('./fixtures/completion-check/cases.json',import.meta.url)));
const base={question:{content:'Solve x+1=2',answer:0,solution:'Subtract one.'},meta:{standardUnitKey:'H22-U',subUnitKey:'S',standardUnit:'Unit',subUnit:'Sub',problemTypeKey:'P',templateKey:'T',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',fieldStatus:{standardUnit:'approved',subUnit:'approved',problemType:'approved',template:'approved',difficulty:'approved'}},unitLabels:new Map([['H22-U',{label:'Unit'}]]),subUnitLabels:new Map([['S',{label:'Sub',parent:'H22-U'}]]),registry:{status:'ACTIVE',problemTypes:new Map([['P',{status:'ACTIVE'}]]),templates:new Map([['T',{status:'ACTIVE',parentProblemTypeKey:'P'}]]),bindings:new Set(['2022\0H22-U\0S\0P'])},fourSlot:'REGISTERED'};
for(const f of fixtures)test(f.name,()=>{
 const input={...base,...f,question:{...base.question,...f.question},meta:{...base.meta,...f.meta,fieldStatus:{...base.meta.fieldStatus,...f.meta?.fieldStatus}}};
 const before=JSON.stringify(input),actual=classifyItem(input);
 for(const [k,v] of Object.entries(f.expect))assert.equal(actual[k],v,k);
 assert.equal(JSON.stringify(input),before,'pure classifier must not mutate');
});
test('canonical metadata wins and inline divergence is reported',()=>{const r=classifyItem({...base,question:{...base.question,difficultyBucket:5}});assert.equal(r.difficulty,'APPROVED');assert.deepEqual(r.inlineDiffers,['difficultyBucket']);});
test('registry unavailable fails closed without modifying registry',()=>assert.equal(classifyItem({...base,registry:{status:'UNAVAILABLE'}}).type,'INVALID'));
test('all state distributions partition total; TSV has summary and rows',()=>{const rows=fixtures.map(f=>classifyItem({...base,...f,question:{...base.question,...f.question},meta:{...base.meta,...f.meta,fieldStatus:{...base.meta.fieldStatus,...f.meta?.fieldStatus}}}));const summary=summarize(rows);for(const c of COLUMNS)assert.equal(Object.values(summary.distribution[c]).reduce((a,b)=>a+b,0),rows.length);assert.match(formatReport({note:'overlap',summary,byExam:[],rows},'tsv'),/# SUMMARY/);});
test('CLI selection and validation',()=>{assert.deepEqual(parseArgs(['--exam','a.js','--exam','b.js']).exams,['a.js','b.js']);for(const args of [[],['--all','--scope','a'],['--format','bad','--all'],['--require','bad','--all'],['--exam']])assert.throws(()=>parseArgs(args));});
test('real SVG XML parsing, missing files, no figures, output path safety and deterministic selection',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'completion-test-'));try{
 fs.mkdirSync(path.join(dir,'archive/assets'),{recursive:true});fs.mkdirSync(path.join(dir,'archive/exams/original'),{recursive:true});
 fs.writeFileSync(path.join(dir,'archive/assets/good.svg'),'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');fs.writeFileSync(path.join(dir,'archive/assets/bad.svg'),'<svg><g></svg>');
 assert.equal(figureFacts({content:'<svg><g>'},dir).state,'BROKEN_SVG');assert.equal(figureFacts({image:'data:image/svg+xml,%3Csvg/%3E'},dir).state,'OK');
 assert.equal(figureFacts({},dir).state,'NOT_NEEDED');assert.equal(figureFacts({image:'assets/good.svg'},dir).state,'OK');assert.equal(figureFacts({image:'assets/bad.svg'},dir).state,'BROKEN_SVG');assert.equal(figureFacts({image:'assets/no.svg'},dir).state,'FILE_MISSING');
 fs.writeFileSync(path.join(dir,'archive/exams/original/a.js'),'');assert.deepEqual(selectFiles({exams:[],scope:'original',all:false},dir),['original/a.js']);assert.throws(()=>selectFiles({exams:['../bad.js']},dir));
 assert.throws(()=>outputPath(path.join(dir,'report.json'),dir));const link=dir+'-link';fs.symlinkSync(dir,link);try{assert.throws(()=>outputPath(path.join(link,'report.json'),dir));}finally{fs.unlinkSync(link);}
 assert.equal(outputPath(dir+'-out.json',dir),dir+'-out.json');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('CLI refuses repository output before loading any data',()=>{const p=spawnSync(process.execPath,['archive/tools/completion/check.mjs','--all','--out','archive/forbidden-completion.json'],{encoding:'utf8'});assert.equal(p.status,2);assert.match(p.stderr,/outside repository/);assert.equal(fs.existsSync('archive/forbidden-completion.json'),false);});
