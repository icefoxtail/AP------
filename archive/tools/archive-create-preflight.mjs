import {readExam,sha256} from './archive-codex-artifact-io.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadUnitOrders,inspectUnitOrders} from './archive-unit-order.mjs';

const circled='①②③④⑤⑥⑦⑧⑨⑩';
const choiceTextFields=['text','content','value','answer'];

function choiceText(choice){
  if(typeof choice==='string')return choice;
  if(!choice||typeof choice!=='object'||Array.isArray(choice))return null;
  for(const key of choiceTextFields)if(typeof choice[key]==='string')return choice[key];
  return null;
}
function simple(value){const s=String(value).replace(/<[^>]*>/g,'').replace(/\$/g,'').trim();return /^[-+]?\d+(?:\.\d+)?$/.test(s)?String(Number(s)):null;}

function maskRange(chars,start,end){for(let i=start;i<end;i++)if(chars[i]!=='\n'&&chars[i]!=='\r')chars[i]=' ';}
function codeMaskedText(value){
  const chars=String(value).split('');
  const text=String(value);
  for(const match of text.matchAll(/<(code|pre)\b[^>]*>[\s\S]*?<\/\1\s*>/gi))maskRange(chars,match.index,match.index+match[0].length);
  const afterClosedHtml=chars.join('');
  for(const match of afterClosedHtml.matchAll(/<(code|pre)\b[^>]*>(?![\s\S]*<\/\1\s*>)[\s\S]*$/gi))maskRange(chars,match.index,chars.length);
  const afterHtml=chars.join('');
  for(const match of afterHtml.matchAll(/(`{3,})[\s\S]*?\1/g))maskRange(chars,match.index,match.index+match[0].length);
  const afterFences=chars.join('');
  for(const match of afterFences.matchAll(/`[^`\n]*`/g))maskRange(chars,match.index,match.index+match[0].length);
  const afterCode=chars.join('');
  for(const match of afterCode.matchAll(/<[^>]*>/g))maskRange(chars,match.index,match.index+match[0].length);
  return chars.join('');
}

function mathRegionsAndDelimiterFindings(value,qid,field){
  const text=codeMaskedText(value),tokens=[],findings=[],regions=[];
  for(let i=0;i<text.length;){
    if(text[i]==='\\'&&(text[i+1]==='('||text[i+1]===')'||text[i+1]==='['||text[i+1]===']')){
      let precedingSlashes=0;for(let j=i-1;j>=0&&text[j]==='\\';j--)precedingSlashes++;
      if(precedingSlashes%2===0){const token=text.slice(i,i+2),kind=token==='\\('||token==='\\)'?'paren':'bracket';tokens.push({start:i,end:i+2,token,kind,opening:token==='\\('||token==='\\['});}
      i+=2;continue;
    }
    if(text[i]==='$'){
      let slashes=0;for(let j=i-1;j>=0&&text[j]==='\\';j--)slashes++;
      if(slashes%2===0){const display=text[i+1]==='$';const length=display?2:1;tokens.push({start:i,end:i+length,token:text.slice(i,i+length),kind:display?'displayDollar':'inlineDollar'});i+=length;continue;}
    }
    i++;
  }
  const opens=new Map();
  for(const token of tokens){
    if(token.kind==='paren'||token.kind==='bracket'){
      if(token.opening){if(!opens.has(token.kind))opens.set(token.kind,[]);opens.get(token.kind).push(token);}
      else{const stack=opens.get(token.kind)||[];const open=stack.pop();if(open)regions.push({start:open.start,end:token.end,bodyStart:open.end,bodyEnd:token.start,kind:token.kind});else findings.push(delimiterFinding(qid,field,token,'Closing math delimiter has no matching opener.'));}
      continue;
    }
    const stack=opens.get(token.kind)||[];
    if(stack.length){const open=stack.pop();regions.push({start:open.start,end:token.end,bodyStart:open.end,bodyEnd:token.start,kind:token.kind});}
    else{if(!opens.has(token.kind))opens.set(token.kind,[]);opens.get(token.kind).push(token);}
  }
  for(const stack of opens.values())for(const open of stack)findings.push(delimiterFinding(qid,field,open,'Opening math delimiter has no matching closer.'));
  return {text,regions,findings};
}
function delimiterFinding(qid,field,token,reason){return {qid,field,code:'TEX_MATH_DELIMITER_UNPAIRED',locus:{start:token.start,end:token.end,text:token.token},reason};}
function hasMathAt(regions,index){return regions.some(region=>index>=region.bodyStart&&index<region.bodyEnd);}
function scanTexField(value,qid,field){
  const {text,regions,findings}=mathRegionsAndDelimiterFindings(value,qid,field);
  for(const command of text.matchAll(/\\(dfrac|tfrac|frac|sqrt)\b/g)){
    if(!hasMathAt(regions,command.index))findings.push({qid,field,code:'TEX_COMMAND_OUTSIDE_MATH',locus:{start:command.index,end:command.index+command[1].length+1,text:`\\${command[1]}`},reason:`TeX command \\${command[1]} occurs outside a recognized math wrapper.`});
  }
  for(const command of text.matchAll(/(?<![\\A-Za-z])(dfrac|tfrac|frac|sqrt)\s*\{/g)){
    if(hasMathAt(regions,command.index))findings.push({qid,field,code:'TEX_COMMAND_BACKSLASH_SUSPECT',locus:{start:command.index,end:command.index+command[1].length,text:command[1]},reason:`TeX command ${command[0].trim()} inside math is missing its leading backslash.`});
  }
  for(const environment of text.matchAll(/\\begin\{(?:aligned|cases|matrix|pmatrix|bmatrix)\}/g)){
    if(!hasMathAt(regions,environment.index))findings.push({qid,field,code:'TEX_ENVIRONMENT_OUTSIDE_MATH',locus:{start:environment.index,end:environment.index+environment[0].length,text:environment[0]},reason:'A math environment occurs outside a recognized math wrapper.'});
  }
  return findings;
}

export function inspectCreateCandidate({questions,evidence={},unitMaster}){
  const findings=[],holds=[],rows=new Map((evidence.rows||[]).map(r=>[Number(r.qid),r]));
  for(const q of questions){const qid=Number(q.id),row=rows.get(qid)||{};
    if(String(q.itemStatus||'').toUpperCase()==='HOLD'){const reason=q.itemHoldReason||q.holdReason||row.itemHoldReason||row.holdReason;holds.push({qid,reason:reason||null});if(!reason)findings.push({qid,code:'ITEM_HOLD_REASON_MISSING'});}
    const fields=[['content',q.content],['solution',q.solution]];
    for(let i=0;i<(q.choices||[]).length;i++){
      const choice=q.choices[i],base='choices['+i+']';
      if(typeof choice==='string')fields.push([base,choice]);
      else if(choice&&typeof choice==='object'&&!Array.isArray(choice))for(const key of choiceTextFields)if(typeof choice[key]==='string')fields.push([base+'.'+key,choice[key]]);
    }
    for(const [field,value] of fields)if(typeof value==='string')findings.push(...scanTexField(value,qid,field));
    const token=String(q.answer??'').trim(),index=circled.indexOf(token);
    if(index>=0&&(!q.choices||index>=q.choices.length))findings.push({qid,code:'ANSWER_CHOICE_INDEX_OUT_OF_RANGE'});
    const explicit=row.derivedFinalValue??q.solutionFinalAnswer;
    const terminal=String(q.solution||'').replace(/<[^>]*>/g,'\n').trim().match(/(?:정답|최종값|답)\s*[:：=]\s*(\$?[-+]?\d+(?:\.\d+)?\$?)\s*(?:이다|입니다)?[.。]?$/)?.[1];
    const final=simple(explicit??terminal??'');
    if(index>=0&&q.choices?.[index]!==undefined&&final!==null){const chosen=simple(choiceText(q.choices[index])??q.choices[index]);if(chosen!==null&&chosen!==final)findings.push({qid,code:'ANSWER_CHOICE_FINAL_VALUE_MISMATCH',chosenValue:chosen,explicitFinalValue:final});}
  }
  const declared=evidence.itemHoldCount??evidence.itemHolds?.count;
  if(declared!==undefined&&declared!==holds.length)findings.push({code:'ITEM_HOLD_COUNT_MISMATCH',declared,observed:holds.length});
  const unitOrder=unitMaster?inspectUnitOrders(questions,unitMaster):null;if(unitOrder)findings.push(...unitOrder.findings);
  return {schemaVersion:'JS_ARCHIVE_CREATE_PREFLIGHT_V1',status:findings.length?'REVIEW_REQUIRED':holds.length?'CARRY_ITEM_HOLD':'STRUCTURAL_PREFLIGHT_CLEAR',questionCount:questions.length,itemHoldCount:holds.length,holds,findings,unitOrder,semanticApproval:false,sourceMutation:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args={};for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(!['--exam','--evidence','--root'].includes(k))throw Error('UNKNOWN_ARGUMENT:'+k);args[k.slice(2)]=process.argv[++i];}if(!args.exam)throw Error('EXAM_REQUIRED');const exam=readExam(args.exam),report=inspectCreateCandidate({questions:exam.questions,evidence:args.evidence?JSON.parse(fs.readFileSync(args.evidence)):undefined,unitMaster:loadUnitOrders(path.resolve(args.root||'.'))});console.log(JSON.stringify({...report,artifactRawSha256:sha256(exam.bytes),artifactSha:exam.rawBufferGitBlobSha1},null,2));process.exitCode=report.findings.length?1:0;
}
