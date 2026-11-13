import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {dependencyLock} from './dependencies.mjs';
const require=createRequire(import.meta.url),contract=require('../../../archive2-output-contract.js');
const root=fileURLToPath(new URL('../../../../',import.meta.url));
export const PROBLEM_ENVELOPE_SEED_PATH='/__geometry/problem-output-seed.html';

export async function verifyPublishedProblemEnvelope(envelope,{bank,sourceId,url}={}){
  await contract.validateOutputEnvelope(envelope,{outputRequestId:envelope.outputRequestId,ownerId:envelope.ownerId,mode:'exam'});
  const reader=new URL(url);
  if(reader.pathname!=='/archive/engine.html'||reader.searchParams.get('archive2Context')!=='archive2'||reader.searchParams.get('archive2OutputContract')!==contract.CONTRACT_VERSION||reader.searchParams.get('outputRequestId')!==envelope.outputRequestId||reader.searchParams.get('outputOwnerId')!==envelope.ownerId||reader.searchParams.get('mode')!=='exam'||reader.searchParams.get('q')!==String(bank.length)||envelope.sourceId!==sourceId||envelope.meta.sourceArchiveFile!==sourceId||objectSha(envelope.questions)!==objectSha(bank))throw Error('PROBLEM_OUTPUT_ENVELOPE_BINDING_MISMATCH');
}

/** Historical evidence readback: verify the producer's raw bytes and the exact consumed reader identity.
 * Expiry is enforced by the actual consumer at capture time; artifact readback does not pretend to be a new read.
 */
export function validateProblemReaderEvidence(row,{root,sourcePath}){
  const evidence=row.outputEnvelopeEvidence,invalid=()=>{throw Error('PROBLEM_READER_ENVELOPE_EVIDENCE_INVALID');};
  if(!evidence||evidence.sourcePath!==sourcePath||evidence.boundaryChecks?.missingRequestId!=='REJECTED'||evidence.boundaryChecks?.wrongOwner!=='REJECTED')invalid();
  const envelope=JSON.parse(readBoundFile(root,evidence.ref)),candidate=readBoundFile(root,evidence.candidateRef),bank=JSON.parse(JSON.stringify(loadBank(candidate.toString('utf8'))));
  const {payloadHash,...unsigned}=envelope;
  const reader=new URL(row.url),sourceId=sourcePath.replace(/^archive\/exams\//,'');
  const received=(row.responses??[]).filter(r=>{try{return decodeURIComponent(new URL(r.url).pathname)==='/'+sourcePath;}catch{return false;}});
  if(bytesSha(candidate)!=='sha256:'+row.candidateSha256||objectSha(bank)!==evidence.questionBankSha256||objectSha(envelope.questions)!==evidence.questionBankSha256||bytesSha(Buffer.from(contract.canonicalizeOutputValue(unsigned))).slice(7)!==payloadHash||payloadHash!==evidence.payloadHash||envelope.outputRequestId!==evidence.outputRequestId||envelope.ownerId!==evidence.ownerId||envelope.contractVersion!==contract.CONTRACT_VERSION||envelope.mode!=='exam'||envelope.sourceId!==sourceId||envelope.meta.sourceArchiveFile!==sourceId||reader.pathname!=='/archive/engine.html'||reader.searchParams.get('archive2Context')!=='archive2'||reader.searchParams.get('archive2OutputContract')!==envelope.contractVersion||reader.searchParams.get('outputRequestId')!==envelope.outputRequestId||reader.searchParams.get('outputOwnerId')!==envelope.ownerId||received.length!==1||received[0].status!==200||received[0].sha256!==row.candidateSha256)invalid();
  const font=row.koreanFont,setup=font?.fontconfigRef?JSON.parse(readBoundFile(root,font.fontconfigRef)):null;
  if(font?.status!=='PASS'||font.fontSha256!==dependencyLock.font.sha256||setup?.fontSha256!==dependencyLock.font.sha256||setup.status!=='FONTCONFIG_HASH_VERIFIED'||setup.glyphCoverage!=='ALL_PRESENT'||setup.family!==font.family||!font.platformFonts?.some(f=>f.familyName===font.family&&f.glyphCount>0)||!font.uiPlatformFonts?.some(f=>f.familyName===font.family&&f.glyphCount>0))throw Error('PROBLEM_READER_KOREAN_FONT_EVIDENCE_INVALID');
  return {status:'PASS',envelopeSha256:evidence.ref.sha256,payloadHash,fontSha256:font.fontSha256};
}

// This is the same local producer -> IndexedDB -> request/owner-bound reader path used by Archive2.
// No strict guard, DOM context or reader state is overridden by the capture harness.
export async function seedProblemOutputEnvelope({page,base,item,folder,prefix}){
  if(item.problemEnvelope!==true||item.mode!=='exam'||!item.sourcePath?.startsWith('archive/exams/original/'))throw Error('PROBLEM_OUTPUT_ENVELOPE_INPUT_INVALID');
  await page.goto(base+PROBLEM_ENVELOPE_SEED_PATH,{waitUntil:'domcontentloaded'});
  for(const script of ['/archive/archive2-output-contract.js','/archive/archive2-output.js','/'+item.sourcePath])await page.addScriptTag({url:base+script});
  const sourceId=item.sourcePath.replace(/^archive\/exams\//,''),qpp=Number(new URL(item.urlPath,base).searchParams.get('qpp'));
  const produced=await page.evaluate(async({sourceId,qpp})=>{
    const questions=JSON.parse(JSON.stringify(window.questionBank??window.examData?.questions));
    const title=window.examTitle||window.examData?.title||sourceId.split('/').pop().replace(/\.js$/,'');
    const questionUids=questions.map(q=>q.questionUid||q.source_question_uid||q._sourceQuestionUid||null);
    const envelope=await window.Archive2Output.publishOutputEnvelope({sourceKind:'archive2-original',sourceId,mode:'exam',questionCount:questions.length,questionUids,meta:{title,identityTitle:title,sourceArchiveFile:sourceId,qpp,includeQr:false,questionUids,printHeaderOptions:{title}},questions});
    const url=window.Archive2Output.outputEnvelopeUrl('engine.html',new URL('/archive/',location.href).href,envelope,{studio:true});
    url.searchParams.set('fit','screen');url.searchParams.set('assetBase','off');
    let missingIdRejected=false,wrongOwnerRejected=false;
    try{await window.Archive2OutputContract.validateOutputEnvelope({...envelope,outputRequestId:''});}catch{missingIdRejected=true;}
    try{await window.Archive2Output.readOutputEnvelope(envelope.outputRequestId,crypto.randomUUID(),'exam');}catch{wrongOwnerRejected=true;}
    if(!missingIdRejected||!wrongOwnerRejected)throw Error('PROBLEM_OUTPUT_ENVELOPE_BOUNDARY_NOT_REJECTED');
    return {envelope,url:url.href,boundaryChecks:{missingRequestId:'REJECTED',wrongOwner:'REJECTED'}};
  },{sourceId,qpp});
  if(new URL(produced.url).origin!==new URL(base).origin)throw Error('PROBLEM_OUTPUT_ENVELOPE_ORIGIN_MISMATCH');
  const bank=JSON.parse(JSON.stringify(loadBank(fs.readFileSync(path.join(root,item.candidatePath),'utf8'))));
  await verifyPublishedProblemEnvelope(produced.envelope,{bank,sourceId,url:produced.url});
  const file=path.join(folder,prefix+'-output-envelope.json');fs.writeFileSync(file,JSON.stringify(produced.envelope,null,2)+'\n',{flag:'wx'});
  return {url:produced.url,evidence:{sourcePath:item.sourcePath,candidateRef:fileRef(root,item.candidatePath),ref:fileRef(root,path.relative(root,file).replaceAll('\\','/')),questionBankSha256:objectSha(bank),payloadHash:produced.envelope.payloadHash,outputRequestId:produced.envelope.outputRequestId,ownerId:produced.envelope.ownerId,contractVersion:produced.envelope.contractVersion,boundaryChecks:produced.boundaryChecks}};
}
