import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const python=process.env.GEOMETRY_PYTHON||(process.platform==='win32'?'python':'python3');
test('CLI output remains UTF-8 under a CP949 default',()=>{
  const r=spawnSync(python,['-c',"import portable_root;import sys;print('한글 ✔');print('오류 ✔',file=sys.stderr)"],{cwd:here,env:{...process.env,PYTHONIOENCODING:'cp949',PYTHONUTF8:'0'},encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/한글 ✔/);assert.match(r.stderr,/오류 ✔/);
});
function fixture(){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'svg 한글 space ')), root=path.join(dir,'repo 한글');
  const tools=path.join(root,'archive/tools/geometry-equation/ops/svg-m1');fs.mkdirSync(tools,{recursive:true});fs.mkdirSync(path.join(root,'.git'));
  for(const f of ['portable_root.py','publish-exam.py','pubflow.py','ledger-upsert.py'])fs.copyFileSync(path.join(here,f),path.join(tools,f));
  fs.writeFileSync(path.join(root,'archive/tools/geometry-equation/visual-browser-runtime.mjs'),'');
  const src='archive/exams/original/23_금당중_중2_시험.js';fs.mkdirSync(path.dirname(path.join(root,src)),{recursive:true});
  fs.writeFileSync(path.join(root,src),'window.questionBank=[{id:1, solution:"x"}]');
  const d=path.join(dir,'run 한글');fs.mkdirSync(path.join(d,'out'),{recursive:true});
  const svg=path.join(d,'out/figure-solution.svg');fs.writeFileSync(svg,'<svg/>');
  fs.writeFileSync(path.join(d,'publish.json'),JSON.stringify({alt:'도형',caption:'풀이',size:'full'}));
  fs.writeFileSync(path.join(d,'figure.png'),'PNG');
  const rows=path.join(dir,'rows.json'),review=path.join(dir,'review.json');
  const exam=path.basename(src,'.js');
  fs.writeFileSync(path.join(d,'out/figure-result.json'),JSON.stringify({status:'ARCHIVE_BOUND',sizeClass:'full',identity:{questionUid:`${exam}|1`}}));
  fs.writeFileSync(rows,JSON.stringify([{ord:1,A:path.join(d,'figure.png')}]));
  const row={exam,ord:1,reviewer:'sol-1',reviewedAt:'2026-11-04T10:00:00+09:00',expected:'삼각형',publishSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(d,'publish.json'))).digest('hex'),A:{verdict:'PASS',findings:'확인',sha256:crypto.createHash('sha256').update(fs.readFileSync(svg)).digest('hex'),pngSha256:crypto.createHash('sha256').update('PNG').digest('hex')}};
  const save=v=>fs.writeFileSync(review,JSON.stringify(v));save([row]);
  const call=(program,args)=>spawnSync(python,[path.join(tools,program),...args],{cwd:dir,env:{...process.env,APMS_ROOT:root,PYTHONUTF8:'1'},encoding:'utf8'});
  return {dir,root,tools,src,exam,rows,review,row,save,call};
}
test('unicode and spaces work; empty and mismatched reviews fail closed',()=>{
  const x=fixture();try{
    const args=[x.exam,x.src,x.review,x.rows];assert.equal(x.call('publish-exam.py',args).status,0);
    x.save([]);assert.notEqual(x.call('publish-exam.py',args).status,0);
    x.save([{...x.row,ord:2}]);assert.notEqual(x.call('publish-exam.py',args).status,0);
    x.save([{...x.row,A:{...x.row.A,sha256:'0'.repeat(64)}}]);assert.notEqual(x.call('publish-exam.py',args).status,0);
    x.save([{...x.row,A:{...x.row.A,verdict:'FAIL'}}]);assert.notEqual(x.call('publish-exam.py',args).status,0);
    x.save([x.row]);fs.writeFileSync(path.join(path.dirname(x.rows),'run 한글','publish.json'),JSON.stringify({alt:'도형',caption:'수정된 설명'}));
    assert.notEqual(x.call('publish-exam.py',args).status,0);
  }finally{fs.rmSync(x.dir,{recursive:true,force:true});}
});
test('triage must cover source ords once with allowed decisions',()=>{
  const x=fixture();try{
    fs.writeFileSync(path.join(x.root,x.src),'window.questionBank=[{id:1},{id:2}]');
    const check=rows=>spawnSync(python,['-c',"import json,sys;from pathlib import Path;from portable_root import validate_triage;validate_triage(Path(sys.argv[1]),sys.argv[2],json.loads(sys.argv[3]))",x.root,x.src,JSON.stringify(rows)],{cwd:x.tools,env:{...process.env,PYTHONUTF8:'1'},encoding:'utf8'}).status;
    assert.equal(check([{ord:1,decision:'EXEMPT'},{ord:2,decision:'CONTENT'}]),0);
    assert.notEqual(check([{ord:1,decision:'EXEMPT'}]),0);
    assert.notEqual(check([{ord:1,decision:'EXEMPT'},{ord:1,decision:'EXEMPT'},{ord:2,decision:'EXEMPT'}]),0);
    assert.notEqual(check([{ord:1,decision:'EXEMPT'},{ord:2,decision:'UNKNOWN'}]),0);
    assert.notEqual(check([{ord:1,decision:'EXEMPT'},{ord:2,decision:'KEEP'}]),0);
  }finally{fs.rmSync(x.dir,{recursive:true,force:true});}
});
test('staged SVG is bound to review and changed staged bytes fail pre-apply check',()=>{
  const x=fixture();try{
    assert.equal(x.call('publish-exam.py',[x.exam,x.src,x.review,x.rows]).status,0);
    const r=JSON.parse(fs.readFileSync(path.join(x.tools,'runs',`publish-rows-${x.exam}.json`)))[0];
    fs.writeFileSync(path.join(path.dirname(x.rows),'run 한글','out','figure-solution.svg'),'<svg>changed</svg>');
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(r.svg)).digest('hex'),r.sha256);
    fs.writeFileSync(r.svg,'<svg>tampered</svg>');
    const check=spawnSync(python,['-c','from portable_root import require_hash;import sys;require_hash(sys.argv[1],sys.argv[2])',r.svg,r.sha256],{cwd:x.tools,encoding:'utf8'});
    assert.notEqual(check.status,0);
  }finally{fs.rmSync(x.dir,{recursive:true,force:true});}
});
// Synthetic metadata exercises publisher checks; it is not evidence of a real render.
test('render metadata requires bound status, matching identity and matching size',()=>{
  const x=fixture();try{
    const file=path.join(x.dir,'run 한글','out','figure-result.json');
    const valid={status:'ARCHIVE_BOUND',sizeClass:'full',identity:{questionUid:`${x.exam}|1`}};
    const check=v=>{fs.writeFileSync(file,JSON.stringify(v));return x.call('publish-exam.py',[x.exam,x.src,x.review,x.rows]).status;};
    assert.equal(check(valid),0);
    assert.notEqual(check({...valid,sizeClass:'medium'}),0);
    assert.notEqual(check({...valid,sizeClass:'invalid'}),0);
    assert.notEqual(check({...valid,status:'FAILED'}),0);
    assert.notEqual(check({...valid,identity:{questionUid:`${x.exam}|2`}}),0);
  }finally{fs.rmSync(x.dir,{recursive:true,force:true});}
});
test('direct ledger rejects partial and duplicate triage and preserves unresolved states',()=>{
  const x=fixture();try{
    fs.writeFileSync(path.join(x.root,x.src),'window.questionBank=[{id:1},{id:2}]');
    const ledger=path.join(x.root,'archive/tools/geometry-equation/production/exam-figure-ledger.json');
    fs.mkdirSync(path.dirname(ledger),{recursive:true});fs.writeFileSync(ledger,JSON.stringify({exams:[]}));
    const triage=path.join(x.dir,'triage.json'), spec=path.join(x.dir,'spec.json');
    fs.writeFileSync(spec,JSON.stringify({exam:x.exam,src:x.src,camp:'m2-test',triage,published:{},open:{}}));
    const go=rows=>{fs.writeFileSync(triage,JSON.stringify(rows));return x.call('ledger-upsert.py',[spec]);};
    assert.notEqual(go([{ord:1,decision:'EXEMPT'}]).status,0);
    assert.notEqual(go([{ord:1,decision:'EXEMPT'},{ord:1,decision:'EXEMPT'},{ord:2,decision:'EXEMPT'}]).status,0);
    assert.equal(go([{ord:1,decision:'CONTENT'},{ord:2,decision:'UNSUPPORTED'}]).status,0);
    const item=JSON.parse(fs.readFileSync(ledger)).exams[0];assert.equal(item.status,'OPEN');
    assert.deepEqual(item.items.map(i=>i.state),['OPEN_CONTENT','OPEN_UNSUPPORTED']);
  }finally{fs.rmSync(x.dir,{recursive:true,force:true});}
});
test('batch failure exits nonzero without Git mutation',()=>{
  const x=fixture();try{
    const manifest=path.join(x.dir,'batch.json');fs.writeFileSync(manifest,'[]');
    const before=fs.readdirSync(path.join(x.root,'.git'));const result=x.call('pubflow.py',['--batch',manifest]);
    assert.notEqual(result.status,0);assert.deepEqual(fs.readdirSync(path.join(x.root,'.git')),before);
  }finally{fs.rmSync(x.dir,{recursive:true,force:true});}
});

function publishLiteral(source,ord,check){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'svg-active-bank-'));
  try{
    const src='archive/exams/original/dual-bank.js',file=path.join(root,src);
    fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(file,source);
    const svg=path.join(root,'figure.svg'),rows=path.join(root,'rows.json');
    fs.writeFileSync(svg,'<svg/>');
    fs.writeFileSync(rows,JSON.stringify([{src,ord,svg,alt:'Graph',caption:'Solution',size:'full'}]));
    const result=spawnSync(process.execPath,[path.join(here,'publish.mjs'),rows,root,'--apply'],
      {env:{...process.env,PUBLISH_REPORT:path.join(root,'report.json')},encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    const after=fs.readFileSync(file,'utf8'),window={};
    vm.runInNewContext(after,{window});
    check({after,window,report:JSON.parse(result.stdout),root});
  }finally{fs.rmSync(root,{recursive:true,force:true});}
}

test('publisher patches the direct active question and preserves the mirror and every other byte',()=>{
  const prefix='window.examTitle = "window.questionBank = [ ]";\r\n'
    +'window.questionBank = [{id:1, solution:"active", note:{id:1,solution:"nested"}';
  const tail='}, {id:2, solution:"untouched"}];\r\n'
    +'/* window.questionBank = [{id:1,solution:"decoy"}]; */\r\n'
    +'window.examData = {questions:[{id:1, solution:"mirror"}, {id:2, solution:"mirror"}]};\r\n';
  const fields={
    solutionImage:'assets/images/dual-bank/q1-solution.svg',solutionImageAlt:'Graph',
    solutionImageCaption:'Solution',solutionImageSize:'full'
  };
  publishLiteral(prefix+tail,1,({after,window,report,root})=>{
    assert.equal(report.figures,1);
    assert.deepEqual(report.skips,[]);
    const inserted=',\r\n'+Object.entries(fields).map(([k,v])=>JSON.stringify(k)+': '+JSON.stringify(v)).join(',\r\n');
    assert.equal(after,prefix+inserted+tail);
    for(const [key,value] of Object.entries(fields))assert.equal(window.questionBank[0][key],value);
    assert.equal(fs.readFileSync(path.join(root,'archive',fields.solutionImage),'utf8'),'<svg/>');
  });
});

test('publisher refuses multiple active assignments even when their banks match',()=>{
  const source='window.questionBank = [{id:1, solution:"same"}];\n'
    +'window["questionBank"] = [{id:1, solution:"same"}];\n';
  publishLiteral(source,1,({after,report,root})=>{
    assert.equal(report.figures,0);
    assert.deepEqual(report.skips,['dual-bank q1 QUESTION_OBJECT_NOT_LOCATED']);
    assert.equal(after,source);
    assert.equal(fs.existsSync(path.join(root,'archive/assets')),false);
  });
});

test('publisher still reads a legacy examData literal with or without the questionBank alias',()=>{
  const source='window.examData = {"questions":[{id:"q01", solution:"legacy"}]};\n';
  for(const suffix of ['', 'window.questionBank = window.examData.questions;\n']){
    publishLiteral(source+suffix,'q01',({after,window,report})=>{
      assert.equal(report.figures,1);
      assert.equal(window.examData.questions[0].solutionImage,'assets/images/dual-bank/q01-solution.svg');
      assert.ok(after.endsWith('}]};\n'+suffix));
    });
  }
});
