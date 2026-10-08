import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspectCreateCandidate} from '../archive/tools/archive-create-preflight.mjs';

const q=(overrides={})=>({id:1,content:'기본 문항',choices:['1','2'],answer:'①',solution:'정답: $1$',...overrides});
const codes=report=>report.findings.map(f=>f.code);

test('unpaired inline and display delimiters report the qid, field, exact token and reason',()=>{
  const input='주어진 값 $B(n,2)를 계산하라.';
  const report=inspectCreateCandidate({questions:[q({content:input})]});
  const finding=report.findings.find(f=>f.code==='TEX_MATH_DELIMITER_UNPAIRED');
  assert.equal(report.status,'REVIEW_REQUIRED');
  assert.equal(finding.qid,1);
  assert.equal(finding.field,'content');
  assert.deepEqual(finding.locus,{start:input.indexOf('$'),end:input.indexOf('$')+1,text:'$'});
  assert.match(finding.reason,/no matching closer/);
  const display=inspectCreateCandidate({questions:[q({content:'식은 $$x+1$ 이다.'})]});
  assert.ok(display.findings.some(f=>f.code==='TEX_MATH_DELIMITER_UNPAIRED'&&f.locus.text==='$$'));
});

test('unpaired parenthesis and bracket wrappers are located without source mutation',()=>{
  const questions=[q({content:String.raw`조건은 \(x+1 이고, 범위는 0,2\]이다.`})];
  const before=JSON.stringify(questions);
  const report=inspectCreateCandidate({questions});
  const unpaired=report.findings.filter(f=>f.code==='TEX_MATH_DELIMITER_UNPAIRED');
  assert.deepEqual(unpaired.map(f=>f.locus.text).sort(),['\\(','\\]']);
  assert.ok(unpaired.every(f=>f.qid===1&&f.field==='content'&&f.reason));
  assert.equal(JSON.stringify(questions),before);
});

test('choice object text/content/value/answer fields are inspected and preserved',()=>{
  const choices=[{text:String.raw`\dfrac{1}{2}`,value:'option-A'},{content:'3'}];
  const questions=[q({choices,answer:'②',solution:'정답: $2$'})];
  const before=JSON.stringify(questions);
  const report=inspectCreateCandidate({questions});
  const finding=report.findings.find(f=>f.code==='TEX_COMMAND_OUTSIDE_MATH');
  assert.equal(finding.qid,1);
  assert.equal(finding.field,'choices[0].text');
  assert.equal(finding.locus.text,String.raw`\dfrac`);
  assert.match(finding.reason,/outside a recognized math wrapper/);
  assert.equal(JSON.stringify(questions),before);
  assert.ok(codes(report).includes('ANSWER_CHOICE_FINAL_VALUE_MISMATCH'));
  const bare=inspectCreateCandidate({questions:[q({choices:[{text:String.raw`\dfrac`} ]})]});
  assert.ok(bare.findings.some(f=>f.code==='TEX_COMMAND_OUTSIDE_MATH'&&f.field==='choices[0].text'));
});

test('paired inline/display wrappers, escaped dollars, plain math operators and code samples stay clear',()=>{
  const content=[
    String.raw`가격은 \$5, 식은 $2x+\frac{1}{2}$이다.`,
    String.raw`짝수 backslash 뒤의 달러는 구분자로 처리한다: \\$x$`,
    String.raw`리터럴 구분자 표기: \\(x 와 \\[y`,
    String.raw`$$\sqrt{4}=2$$`,
    String.raw`\(a+b\) 및 \[x^2\]`,
    String.raw`코드 ` + '`' + String.raw`\dfrac{1}{2}` + '`',
    String.raw`<code>\frac{1}{2}</code><pre>$$x$$</pre>`,
  ].join(' ');
  const report=inspectCreateCandidate({questions:[q({content})]});
  assert.deepEqual(report.findings,[]);
  assert.equal(report.status,'STRUCTURAL_PREFLIGHT_CLEAR');
});

test('a closed HTML code sample does not mask later visible TeX',()=>{
  const content=String.raw`<code>\dfrac{1}{2}</code> 이후 \dfrac{3}{4}`;
  const report=inspectCreateCandidate({questions:[q({content})]});
  const matches=report.findings.filter(f=>f.code==='TEX_COMMAND_OUTSIDE_MATH');
  assert.equal(matches.length,1);
  assert.equal(matches[0].qid,1);
  assert.equal(matches[0].field,'content');
  assert.equal(matches[0].locus.start,content.lastIndexOf(String.raw`\dfrac`));
  assert.equal(matches[0].locus.text,String.raw`\dfrac`);
});

test('existing --exam CLI emits the expanded review finding and keeps its exit status contract',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-create-preflight-cli-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const examFile=path.join(root,'fixture.js');
  fs.writeFileSync(examFile,'window.questionBank='+JSON.stringify([q({content:'닫히지 않은 $B(n,2)를 확인.'})])+';');
  const script=fileURLToPath(new URL('../archive/tools/archive-create-preflight.mjs',import.meta.url));
  const run=spawnSync(process.execPath,[script,'--exam',examFile],{encoding:'utf8'});
  assert.equal(run.status,1,run.stderr);
  const report=JSON.parse(run.stdout);
  assert.equal(report.status,'REVIEW_REQUIRED');
  assert.ok(report.findings.some(f=>f.qid===1&&f.field==='content'&&f.code==='TEX_MATH_DELIMITER_UNPAIRED'));
  assert.match(run.stdout,/"artifactRawSha256"/);
});

test('legacy findings and explicit choice-value checks remain active',()=>{
  const report=inspectCreateCandidate({questions:[
    q({id:7,itemStatus:'HOLD',content:'보기 \\begin{aligned}x=1\\end{aligned}',choices:['$dfrac{1}{2}$','$sqrt{2}$'],answer:'③'}),
  ],evidence:{itemHoldCount:0},unitMaster:{orders:new Map(),authority:{path:'fixture',sha256:'a'.repeat(64)}}});
  for(const code of ['ITEM_HOLD_REASON_MISSING','ITEM_HOLD_COUNT_MISMATCH','TEX_ENVIRONMENT_OUTSIDE_MATH','TEX_COMMAND_BACKSLASH_SUSPECT','ANSWER_CHOICE_INDEX_OUT_OF_RANGE','STANDARD_UNIT_ORDER_AUTHORITY_UNKNOWN'])assert.ok(codes(report).includes(code),code);
  assert.equal(report.holds.length,1);
  assert.equal(report.holds[0].qid,7);
  assert.equal(report.semanticApproval,false);
  assert.equal(report.sourceMutation,false);
});
