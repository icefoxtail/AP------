import {readExam,sha256} from './archive-codex-artifact-io.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const circled='①②③④⑤⑥⑦⑧⑨⑩';
function simple(value){const s=String(value).replace(/<[^>]*>/g,'').replace(/\$/g,'').trim();return /^[-+]?\d+(?:\.\d+)?$/.test(s)?String(Number(s)):null;}
export function inspectCreateCandidate({questions,evidence={}}){
  const findings=[],holds=[],rows=new Map((evidence.rows||[]).map(r=>[Number(r.qid),r]));
  for(const q of questions){const qid=Number(q.id),row=rows.get(qid)||{};
    if(String(q.itemStatus||'').toUpperCase()==='HOLD'){const reason=q.itemHoldReason||q.holdReason||row.itemHoldReason||row.holdReason;holds.push({qid,reason:reason||null});if(!reason)findings.push({qid,code:'ITEM_HOLD_REASON_MISSING'});}
    for(const [field,value] of [['content',q.content],['solution',q.solution],...(q.choices||[]).map((s,i)=>['choices['+i+']',s])]){if(typeof value!=='string')continue;
      const math=[...value.matchAll(/\$\$[\s\S]*?\$\$|(?<!\\)\$[^$]*?(?<!\\)\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g)];
      for(const region of math)if(/(?<![\\A-Za-z])(?:dfrac|tfrac|frac|sqrt)\s*\{/.test(region[0]))findings.push({qid,field,code:'TEX_COMMAND_BACKSLASH_SUSPECT'});
      let plain=value;for(const region of math)plain=plain.replace(region[0],'');if(/\\begin\{(?:aligned|cases|matrix|pmatrix|bmatrix)\}/.test(plain))findings.push({qid,field,code:'TEX_ENVIRONMENT_OUTSIDE_MATH'});
    }
    const token=String(q.answer??'').trim(),index=circled.indexOf(token);
    if(index>=0&&(!q.choices||index>=q.choices.length))findings.push({qid,code:'ANSWER_CHOICE_INDEX_OUT_OF_RANGE'});
    const explicit=row.derivedFinalValue??q.solutionFinalAnswer;
    const terminal=String(q.solution||'').replace(/<[^>]*>/g,'\n').trim().match(/(?:정답|최종값|답)\s*[:：=]\s*(\$?[-+]?\d+(?:\.\d+)?\$?)\s*(?:이다|입니다)?[.。]?$/)?.[1];
    const final=simple(explicit??terminal??'');
    if(index>=0&&q.choices?.[index]!==undefined&&final!==null){const chosen=simple(q.choices[index]);if(chosen!==null&&chosen!==final)findings.push({qid,code:'ANSWER_CHOICE_FINAL_VALUE_MISMATCH',chosenValue:chosen,explicitFinalValue:final});}
  }
  const declared=evidence.itemHoldCount??evidence.itemHolds?.count;
  if(declared!==undefined&&declared!==holds.length)findings.push({code:'ITEM_HOLD_COUNT_MISMATCH',declared,observed:holds.length});
  return {schemaVersion:'JS_ARCHIVE_CREATE_PREFLIGHT_V1',status:findings.length?'REVIEW_REQUIRED':holds.length?'CARRY_ITEM_HOLD':'STRUCTURAL_PREFLIGHT_CLEAR',questionCount:questions.length,itemHoldCount:holds.length,holds,findings,semanticApproval:false,sourceMutation:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args={};for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(!['--exam','--evidence'].includes(k))throw Error('UNKNOWN_ARGUMENT:'+k);args[k.slice(2)]=process.argv[++i];}if(!args.exam)throw Error('EXAM_REQUIRED');const exam=readExam(args.exam),report=inspectCreateCandidate({questions:exam.questions,evidence:args.evidence?JSON.parse(fs.readFileSync(args.evidence)):undefined});console.log(JSON.stringify({...report,artifactRawSha256:sha256(exam.bytes),artifactSha:exam.rawBufferGitBlobSha1},null,2));process.exitCode=report.findings.length?1:0;
}
