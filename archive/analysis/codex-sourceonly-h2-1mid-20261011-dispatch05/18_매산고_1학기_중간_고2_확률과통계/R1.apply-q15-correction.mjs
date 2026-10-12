import fs from 'node:fs';
import crypto from 'node:crypto';
import {readExam} from '../../../tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP------';
const source=`${root}/archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js`;
const evidence=`${root}/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_매산고_1학기_중간_고2_확률과통계/R1.q15-source-correction.json`;
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const beforeBytes=fs.readFileSync(source),beforeSha=digest(beforeBytes);
if(beforeSha!=='80916c84a025c6db4f7289e85b7e61240fcbf22c3376fc71e36c373558e86d51')throw Error(`SOURCE_SHA_GUARD:${beforeSha}`);
const before=readExam(source).questions;const q15=before.find(q=>Number(q.id??q.qid)===15);
if(String(q15?.answer)!=='752'||!String(q15?.solution).includes('=8+144+600=752'))throw Error('Q15_EXPECTED_SOURCE_LOCUS_REQUIRED');
let text=beforeBytes.toString('utf8');
const marker=/"id"\s*:\s*15\b/g,match=marker.exec(text);if(!match)throw Error("Q15_BLOCK_START_MISSING");
const next=/"id"\s*:\s*16\b/g;next.lastIndex=match.index+match[0].length;const nextMatch=next.exec(text);if(!nextMatch)throw Error("Q16_BLOCK_BOUNDARY_MISSING");
let block=text.slice(match.index,nextMatch.index);
const answerPattern=/("answer"\s*:\s*")752("\s*,?)/;if(!answerPattern.test(block))throw Error("Q15_ANSWER_LITERAL_NOT_FOUND");
const priorBlock=block;block=block.replace(answerPattern,(_,prefix,suffix)=>`${prefix}632${suffix}`);if(block===priorBlock)throw Error("Q15_ANSWER_REPLACEMENT_NOOP");
if(block===priorBlock)throw Error('Q15_ANSWER_REPLACEMENT_NOOP');
if(!block.includes('=8+144+600=752'))throw Error('Q15_SOLUTION_ARITHMETIC_LITERAL_NOT_FOUND');
block=block.replace('=8+144+600=752','=8+144+480=632');
if(block.includes('=8+144+600=752')||!block.includes('=8+144+480=632'))throw Error('Q15_SOLUTION_REPLACEMENT_INVALID');
text=text.slice(0,match.index)+block+text.slice(nextMatch.index);
fs.writeFileSync(source,text);
const afterBytes=fs.readFileSync(source),after=readExam(source).questions,afterQ15=after.find(q=>Number(q.id??q.qid)===15);
if(String(afterQ15.answer)!=='632'||!String(afterQ15.solution).includes('=8+144+480=632'))throw Error('Q15_POSTPATCH_PARSE_FAILED');
for(const oldQ of before){const newQ=after.find(q=>Number(q.id??q.qid)===Number(oldQ.id??oldQ.qid));if(Number(oldQ.id??oldQ.qid)===15){if(oldQ.content!==newQ.content||JSON.stringify(oldQ.choices)!==JSON.stringify(newQ.choices))throw Error('Q15_STUDENT_FIELDS_CHANGED');}else if(oldQ.answer!==newQ.answer||oldQ.solution!==newQ.solution)throw Error(`UNRELATED_QID_MUTATION:${oldQ.id}`);}
const proof={schemaVersion:'JS_ARCHIVE_R1_QID_CORRECTION_V1',qid:15,sourcePath:source,beforeRawSha256:beforeSha,afterRawSha256:digest(afterBytes),changedFields:['answer','solution'],beforeAnswer:'752',afterAnswer:'632',beforeSolutionSha256:digest(Buffer.from(q15.solution,'utf8')),afterSolutionSha256:digest(Buffer.from(afterQ15.solution,'utf8')),correction:'For r=3 nonzero coordinates, choose positions C(4,3)=4, positive absolute-value compositions of 7 into 3 parts C(6,2)=15, signs 2^3=8; contribution is 4*15*8=480, not 600. Total with r=1,2 is 8+144+480=632.',studentFieldsExactParity:true,unrelatedQidsAnswerSolutionUnchanged:true,sourcePdfCompared:false};
fs.writeFileSync(evidence,JSON.stringify(proof,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(proof,null,2));


