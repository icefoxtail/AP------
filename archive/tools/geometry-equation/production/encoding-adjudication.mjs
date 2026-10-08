import path from 'node:path';
import {readBoundFile,objectSha} from '../../pipeline-core/canonical.mjs';
import {parseQuestionUidV2} from '../../pipeline-core/question-uid.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';

function recompute(root,{originalVerificationRef,sourceRef,questionUid,decision}){
 if(decision?.authority!=='DIRECT_USER_INSTRUCTION'||!decision.request||decision.scope!=='ANSWER_ENCODING_ONLY')throw Error('ENCODING_ADJUDICATION_DECISION_REQUIRED');
 const original=JSON.parse(readBoundFile(root,originalVerificationRef));
 const blind=JSON.parse(readBoundFile(root,original.blindDecisionRef)),compare=JSON.parse(readBoundFile(root,original.compareRef));
 if(original.reviewContract!=='BLIND_FREEZE_COMPARE_v1'||original.output.status!=='FAIL'||blind.output.status!=='PASS'||compare.output.status!=='FAIL'||blind.contextId===compare.contextId)throw Error('ENCODING_ADJUDICATION_ORIGINAL_LINEAGE_INVALID');
 const {sourceExamId,sourceQuestionOrdinal}=parseQuestionUidV2(questionUid);
 if(path.posix.basename(sourceRef.path,'.js')!==sourceExamId)throw Error('ENCODING_ADJUDICATION_SOURCE_ID_MISMATCH');
 const question=JSON.parse(JSON.stringify(loadBank(readBoundFile(root,sourceRef).toString('utf8')).find(q=>q.id===sourceQuestionOrdinal)));
 const source={content:question.content,choices:question.choices??null,sourceImageRequired:!!question.image};
 if(objectSha(source)!==objectSha(blind.inputPacket.source)||blind.inputPacket.visibility!=='SOURCE_ONLY'||compare.inputPacket.visibility!=='COMPARE_ONLY'||compare.inputPacket.blindDecisionRef.sha256!==original.blindDecisionRef.sha256||objectSha(compare.inputPacket.independentDecision)!==objectSha(blind.payload))throw Error('ENCODING_ADJUDICATION_STUDENT_SOURCE_CHANGED');
 // This bounded correction supports an exactly recomputable x-axis
 // equidistance problem. Other mathematical disagreements remain FAIL.
 const text=question.content.replace(/[\s$]/g,'');
 const a=text.match(/A\((-?\d+),(-?\d+)\)/),b=text.match(/B\((-?\d+),(-?\d+)\)/);
 if(!a||!b||question.image||!text.includes('x축')||!text.includes('같은거리')||!text.includes('a+b'))throw Error('ENCODING_ADJUDICATION_PROOF_UNSUPPORTED');
 const A=a.slice(1).map(Number),B=b.slice(1).map(Number);
 if(![...A,...B].every(v=>Number.isSafeInteger(v)&&Math.abs(v)<=1e6)||A[0]===B[0])throw Error('ENCODING_ADJUDICATION_PROOF_INVALID');
 const body=text.replace(/\[[\d.]+점\]$/,'');
 if(body!==`두점A(${A.join(',')}),B(${B.join(',')})에서같은거리에있는x축위의점P의좌표를(a,b)라고할때,a+b의값은?`)throw Error('ENCODING_ADJUDICATION_EXTRA_SOURCE_CONDITIONS');
 const numerator=B[0]**2+B[1]**2-A[0]**2-A[1]**2,denominator=2*(B[0]-A[0]),value=numerator/denominator;
 if(!Number.isSafeInteger(value)||Math.abs(value)>1e6)throw Error('ENCODING_ADJUDICATION_PROOF_UNSUPPORTED');
 const choices=question.choices.map(v=>String(v).replace(/[\s$]/g,'')),matches=choices.map((v,i)=>v===String(value)?i:-1).filter(i=>i>=0);
 if(matches.length!==1)throw Error('ENCODING_ADJUDICATION_CHOICE_NOT_UNIQUE');
 const symbol='①②③④⑤'[matches[0]],answer=value+' ('+symbol+')';
 const reasoning=blind.payload.reasoning;
 if(question.answer!==symbol||!reasoning.includes('a='+value)||!reasoning.includes(symbol)||blind.payload.recomputedAnswer===answer||original.payload.reasoning!==reasoning)throw Error('ENCODING_ADJUDICATION_NOT_A_FIELD_ONLY_ERROR');
 const dA=(value-A[0])**2+A[1]**2,dB=(value-B[0])**2+B[1]**2;
 if(dA!==dB)throw Error('ENCODING_ADJUDICATION_RESIDUAL_NONZERO');
 return{original,answer,proof:{kind:'X_AXIS_EQUIDISTANCE_INTEGER_v1',A,B,numerator,denominator,value,symbol,distanceSquaredA:dA,distanceSquaredB:dB,residual:dA-dB,frozenReasoningSha256:objectSha(reasoning)}};
}

export function createSolutionEncodingAdjudication(root,request){
 const {original,answer,proof}=recompute(root,request);
 // Append a distinct operator decision; never edit either original freeze or
 // failed provider comparison, or pretend that the provider returned PASS.
 return{...original,reviewContract:'USER_DIRECTED_ENCODING_ADJUDICATION_v1',authority:'DIRECT_USER_INSTRUCTION',originalVerificationRef:request.originalVerificationRef,sourceRef:request.sourceRef,questionUid:request.questionUid,decision:request.decision,policySha256:request.policySha256??original.policySha256,inputBindingSha256:request.inputBindingSha256??original.inputBindingSha256,originalProviderComparisonStatus:'FAIL',proof,output:{status:'PASS'},payload:{...original.payload,recomputedAnswer:answer,solutionComparison:'Frozen reasoning and independent integer residual proof agree with current source; only the answer field encoding is corrected.'}};
}

export function validateSolutionEncodingAdjudication(root,record,policySha256,inputBindingSha256){
 try{
  if(record?.reviewContract!=='USER_DIRECTED_ENCODING_ADJUDICATION_v1'||record.authority!=='DIRECT_USER_INSTRUCTION'||record.policySha256!==policySha256||record.inputBindingSha256!==inputBindingSha256)return false;
  const expected=createSolutionEncodingAdjudication(root,record);
  return objectSha(expected)===objectSha(record);
 }catch{return false;}
}
