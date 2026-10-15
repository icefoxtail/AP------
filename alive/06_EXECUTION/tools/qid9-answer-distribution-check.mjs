#!/usr/bin/env node
// QID9 Answer Distribution static evidence checker. Does NOT prove correctness of math or actual exhaustive search.
import fs from 'node:fs';
const file=process.argv[2];
if(!file){console.error('Usage: node qid9-answer-distribution-check.mjs <evidence.json>');process.exit(2);}
const d=JSON.parse(fs.readFileSync(file,'utf8'));
const slots=['A1','A2','A3','B1','B2','B3','C1','C2','C3'];
const nums=['①','②','③','④','⑤'];
const errors=[];
const fail=(m)=>errors.push(m);
if(JSON.stringify(d.slots)!==JSON.stringify(slots))fail('slots must be A1,A2,A3,B1,B2,B3,C1,C2,C3');
if(!Array.isArray(d.answers)||d.answers.length!==9||d.answers.some(x=>!nums.includes(x)))fail('answers: exactly 9 single ①..⑤ required');
let counts=null,after=null,before=null,objective=null;
if(!errors.length){
 counts=nums.map(x=>d.answers.filter(a=>a===x).length);
 if(counts.some(x=>x<1||x>2))fail('HORIZONTAL_DISTRIBUTION_FAIL');
 before=slots.map(s=>d.before?.[s]);
 for(let i=0;i<9;i++){
  if(!Array.isArray(before[i])||before[i].length!==5||before[i].some(n=>!Number.isInteger(n)||n<0))fail('VERTICAL_BEFORE_INVALID_'+slots[i]);
 }
 if(!errors.length){
  after=before.map((a,i)=>a.map((v,k)=>v+Number(d.answers[i]===nums[k])));
  const range=a=>Math.max(...a)-Math.min(...a);
  objective=[after.reduce((s,a)=>s+range(a),0),Math.max(...after.map(range)),after.reduce((s,a)=>s+a.reduce((t,v)=>t+v*v,0),0)];
  const opt=d.optimization||{};
  if(!(Number.isInteger(opt.feasibleCandidateCount)&&opt.feasibleCandidateCount>=1))fail('FEASIBLE_CANDIDATE_COUNT_REQUIRED');
  if(JSON.stringify(opt.selectedObjective)!==JSON.stringify(objective))fail('SELECTED_OBJECTIVE_MISMATCH');
  if(JSON.stringify(opt.optimalObjective)!==JSON.stringify(objective))fail('OPTIMAL_OBJECTIVE_MISMATCH');
  if(!opt.proofRef||!opt.proofSha256||!(/^[0-9a-f]{64}$/.test(opt.proofSha256)))fail('OPTIMIZATION_SEARCH_PROOF_REF_SHA_REQUIRED');
  if(!Array.isArray(d.previousAnswers)||d.previousAnswers.length!==9)fail('PREVIOUS_PATTERN_REQUIRED');
  else if(JSON.stringify(d.answers)===JSON.stringify(d.previousAnswers))fail('PREVIOUS_QID_IDENTICAL_PATTERN');
 }
}
const report={status:errors.length?'FAIL':'PASS_STATIC_EVIDENCE_ONLY',qid:d.qid,horizontal:Object.fromEntries(nums.map((x,i)=>[x,counts?.[i]??null])),verticalAfter:after?Object.fromEntries(slots.map((s,i)=>[s,after[i]])):null,selectedObjective:objective,errors};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exit(1);
