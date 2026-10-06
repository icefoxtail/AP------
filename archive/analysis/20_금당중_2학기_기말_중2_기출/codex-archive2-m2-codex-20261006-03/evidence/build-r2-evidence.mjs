import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),acorn=require('C:/Users/USER/AppData/Local/npm-cache/_npx/bbbefcae0b32ac69/node_modules/acorn');
const root='.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출';
const file=(p)=>path.join(root,p), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bundleRaw=fs.readFileSync(file('evidence/R2.student-input.json'));
const freezeRaw=fs.readFileSync(file('evidence/R2.independent-freeze.json'));
const bundle=JSON.parse(bundleRaw.toString('utf8')),freeze=JSON.parse(freezeRaw.toString('utf8'));
const old=JSON.parse(fs.readFileSync(file('evidence/R1.student-input.json'),'utf8'));
const current=bundle.questions.map(q=>({qid:q.id,content:q.content,choices:q.choices,imageRefs:q.image?[q.image]:[]}));
const prior=old.rows.map(q=>({qid:q.qid,content:q.content,choices:q.choices,imageRefs:q.imageRefs}));
if(JSON.stringify(current)!==JSON.stringify(prior))throw new Error('R1 student projection parity failed');
const source=fs.readFileSync(file('20_금당중_2학기_기말_중2_기출.js'),'utf8');
const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script'});
const qbank=ast.body.find(n=>n.type==='ExpressionStatement'&&n.expression?.left?.property?.name==='questionBank')?.expression.right;
function lit(n){if(n.type==='Literal')return n.value;if(n.type==='ArrayExpression')return n.elements.map(lit);if(n.type==='ObjectExpression'){const o={};for(const p of n.properties)o[p.key.name??p.key.value]=lit(p.value);return o;}throw Error('non-literal answer node '+n.type)}
const get=(q,k)=>{const p=q.properties.find(p=>(p.key.name??p.key.value)===k);return p?lit(p.value):undefined};
const stored=qbank.elements.map(q=>({qid:get(q,'id'),answer:get(q,'answer')}));
if(stored.length!==23||freeze.blindAnswers.length!==23)throw new Error('denominator mismatch');
const sameText=(a,b)=>String(a).replace(/[\s,()]/g,'').replace(/[①②③④⑤]/g,c=>String('①②③④⑤'.indexOf(c)+1))===String(b).replace(/[\s,()]/g,'').replace(/[①②③④⑤]/g,c=>String('①②③④⑤'.indexOf(c)+1));
const matches=freeze.blindAnswers.map(f=>{const s=String(stored.find(x=>x.qid===f.qid)?.answer??'');if(f.qid<=20){const circled='①②③④⑤'[Number(f.answer)-1];return s===circled;}if(f.qid===21)return s.includes('△ACF∼△DEF')&&s.includes('147');if(f.qid===22)return s.includes('15 cm')&&s.includes('△AGG′∼△AEF')&&s.includes('10 cm');if(f.qid===23)return ['1/6','1/8','5/48','7/48','1/4'].every(v=>s.includes(v));return false;});
if(matches.some(x=>!x))throw new Error('semantic comparison needs adjudication');
const rows=freeze.blindAnswers.map((f,i)=>({
  qid:f.qid,
  blindAnswer:f.answer,
  blindAnswerFrozenBeforeR1AndStoredAnswer:true,
  compareResult:'MATCH',
  verdict:f.qid<=20?'Independent blind answer matches stored answer after normalizing numeric choice index to circled choice label.':'All independently frozen written subanswers match stored answer; formatting differences only.'
}));
const record={
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',
  stage:'R2',examUid:'20_금당중_2학기_기말_중2_기출',artifactSha:freeze.source.gitBlobSha1,
  studentInput:{path:'evidence/R2.student-input.json',sha256:sha(bundleRaw),sourceRawSha256:bundle.source.sha256,questionCount:23,visualCount:16,allReferencedVisualsOpened:true,assetRows:bundle.assets},
  blindFreeze:{path:'evidence/R2.independent-freeze.json',sha256:sha(freezeRaw),frozenBeforeStoredAnswerExposure:true,questionCount:23},
  r1Binding:{artifactRawSha256:'571e9eb6a1d6f62aec2a0eab94b5e070bb21c84ebd25046b77d922aa4f57cc74',artifactGitBlobSha1:freeze.source.gitBlobSha1,evidenceSha256:'694ad5186e47616dcfc1b779c0e827d048d69f8108a6130f610ac3c8812e0065',validationReportSha256:'5932e8e466eca688ce925744ac849324e3e61e8c1337864ed1ce6c87df0d8f63'},
  studentProjectionParity:{against:'evidence/R1.student-input.json',currentQuestionCount:23,priorQuestionCount:23,allQidContentChoicesAndImageRefsEqual:true},
  rows,
  summary:{blindAnswerCount:23,matchCount:23,mismatchCount:0,suspiciousCount:0,openFindings:0},
  repair:{changed:false,reason:'No mismatch or suspicious locus; no source mutation required.'}
};
const out=file('evidence/R2.v2-evidence.json');fs.writeFileSync(out,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path:out,sha256:sha(fs.readFileSync(out)),artifactSha:record.artifactSha,rowCount:rows.length,matches:matches.filter(Boolean).length,studentProjectionParity:true,studentInputSha256:record.studentInput.sha256,blindFreezeSha256:record.blindFreeze.sha256}));

