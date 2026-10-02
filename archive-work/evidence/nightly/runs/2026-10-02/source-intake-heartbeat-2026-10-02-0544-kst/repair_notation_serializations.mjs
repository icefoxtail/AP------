import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const runRel = 'archive-work/evidence/nightly/runs/2026-10-02/source-intake-heartbeat-2026-10-02-0544-kst';
const runDir = path.join(root, runRel);
const BS = String.fromCharCode(92);
const initialAuditRel = `${runRel}/source_itemization_v2_independent_audit.json`;
const initialAudit = JSON.parse(fs.readFileSync(path.join(root, initialAuditRel), 'utf8'));
const writeJson = (file, obj) => fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const shaFile = file => sha(fs.readFileSync(file));

const examSpecs = [
  { examId:'22_팔마고_2학기_기말_고2_수학II', file:'archive-work/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js', sourcePdfSha256:'sha256:81806e70e69932928eeff5d90706d4c32ee45155133a421670e7c1d57ce929b3' },
  { examId:'22_효천고_2학기_기말_고2_수학II', file:'archive-work/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js', sourcePdfSha256:'sha256:3de860f5462f49674d3951cc3829e80539e0aaaef40e40874e127690a5ab7ab6' }
];

const failures = initialAudit.notationFailures;
if (failures.length !== 92) throw new Error(`Expected 92 audited failures; found ${failures.length}`);
const qidsByExam = new Map();
for (const item of failures) {
  if (!qidsByExam.has(item.examId)) qidsByExam.set(item.examId, new Set());
  qidsByExam.get(item.examId).add(Number(item.qid));
}

function parseBank(source) {
  const marker = 'window.questionBank = ';
  const assignment = source.indexOf(marker);
  if (assignment < 0) throw new Error('window.questionBank assignment not found');
  const start = assignment + marker.length;
  const end = source.indexOf('\n];', start);
  if (end < 0) throw new Error('questionBank closing bracket not found');
  return JSON.parse(source.slice(start, end + 2));
}

// Repairs only the invalid spelling/escapes already established by the v2
// source-pixel audit. It never changes numerals, bounds, coefficients, signs,
// function names, words, choice order or answers.
function repairMathSerialization(value, qid) {
  let out = value;
  // The archived JS payload used several single-backslash TeX sequences inside
  // JSON string literals. JSON decoding therefore produced control characters.
  // Restore those exact TeX commands before normalizing the visible notation.
  out = out.replaceAll('\b'+'egin{cases}', '\\begin{cases}');
  out = out.replaceAll('\b'+'eta', '\\beta');
  out = out.replaceAll('\t'+'ext{', '\\text{');
  out = out.replaceAll('\t'+'oinfty', '\\to\\infty');
  out = out.replaceAll('\t'+'o', '\\to');
  out = out.replaceAll('\f'+'rac', '\\frac');
  out = out.replaceAll('\r'+'ight', '\\right');
  out = out.replaceAll('fprime', "f'").replaceAll('gprime', "g'").replaceAll('Fprime', "F'");
  out = out.replace(/\\?int(?=_|\s|\(|\{|l|\d)/g, '\\int');
  out = out.replace(/\\?dfrac(?=\{)/g, '\\dfrac');
  out = out.replace(/\\?dfrac(\d)(\d)(?=$|[^0-9{])/g, (_m, a, b) => `\\dfrac{${a}}{${b}}`);
  out = out.replaceAll(',dx', '\\,dx').replaceAll(',dy', '\\,dy').replaceAll(',dt', '\\,dt');
  out = out.replace(/\\?ge(?=[\d\s-])/g, '\\ge').replace(/\\?le(?=[\d\s<])/g, '\\le');
  out = out.replace(/\\?end\{cases\}/g, '\\end{cases}');
  out = out.replace(/\\?left\{/g, '\\left\\{').replace(/\\?right\}/g, '\\right\\}');
  out = out.replace(/\\?left\(/g, '\\left(');
  out = out.replace(/\\?toinfty/g, '\\to\\infty');
  out = out.replace(/\\?lim_(?=\{)/g, '\\lim_');
  if (qid === 19) out = out.replace(/\\?alpha/g, '\\alpha');
  out = out.replace(/\\?sum_\{/g, '\\sum_{');
  if (qid === 9) out = out.replace(`(x${BS}ge1)${BS}2x`, `(x${BS}ge1)${BS.repeat(2)}2x`);
  if (qid === 14) out = out.replace(`)${BS}-3(x-n+1)`, `)${BS.repeat(2)}-3(x-n+1)`);
  if (qid === 14 && out.endsWith(BS)) out += BS;
  if (qid === 24) out = out.replace(`(x<-3)${BS}int_0^x`, `(x<-3)${BS.repeat(2)}${BS}int_0^x`);
  return out;
}

function findJsonStringSpan(text, quoteIndex) {
  if (text[quoteIndex] !== '"') throw new Error(`Expected a JSON string at ${quoteIndex}`);
  let escaped = false;
  for (let i = quoteIndex + 1; i < text.length; i++) {
    const c = text[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (c === '"') return { start:quoteIndex, end:i+1, value:JSON.parse(text.slice(quoteIndex,i+1)) };
  }
  throw new Error(`Unterminated JSON string at ${quoteIndex}`);
}

function questionBlocks(source) {
  const markers = [...source.matchAll(/"id":\s*(\d+),/g)];
  return markers.map((m, i) => {
    const markerPos = m.index;
    const lineStart = source.lastIndexOf('\n  {', markerPos);
    const start = lineStart < 0 ? -1 : lineStart + 1;
    const nextObject = /\r?\n  \{\r?\n    "id":/.exec(source.slice(markerPos + m[0].length));
    const end = nextObject ? markerPos + m[0].length + nextObject.index + 1 : source.indexOf('\n];', markerPos);
    if (start < 0 || end < 0) throw new Error(`Could not find question object bounds for id ${m[1]}`);
    return { id:Number(m[1]), start, end };
  });
}

function patchFieldStrings(block, property, transformer) {
  const key = `"${property}"`;
  const keyPos = block.indexOf(key);
  if (keyPos < 0) throw new Error(`Question has no ${property} property`);
  let colon = block.indexOf(':', keyPos + key.length) + 1;
  while (/\s/.test(block[colon] ?? '')) colon++;
  if (property === 'content') {
    const span = findJsonStringSpan(block, colon);
    const value = transformer(span.value);
    return { block:block.slice(0,span.start) + JSON.stringify(value) + block.slice(span.end), values:[{index:null,before:span.value,after:value}] };
  }
  if (block[colon] !== '[') throw new Error('choices is not an array');
  let arrayDepth = 0, inString = false, escaped = false, arrayEnd = -1;
  for (let i=colon;i<block.length;i++) {
    const ch=block[i];
    if (inString) { if(escaped) escaped=false; else if(ch==='\\') escaped=true; else if(ch==='"') inString=false; continue; }
    if (ch==='"') { inString=true; continue; }
    if (ch==='[') arrayDepth++;
    if (ch===']' && --arrayDepth===0) { arrayEnd=i; break; }
  }
  if (arrayEnd < 0) throw new Error('choices array end not found');
  const spans = [];
  for (let i = colon + 1; i < arrayEnd; i++) {
    if (block[i] === '"') {
      const span = findJsonStringSpan(block, i);
      spans.push(span);
      i = span.end - 1;
    }
  }
  const values = spans.map((span,index) => ({index,before:span.value,after:transformer(span.value,index)}));
  let out = block;
  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    out = out.slice(0,span.start) + JSON.stringify(values[i].after) + out.slice(span.end);
  }
  return { block:out, values };
}

function fieldValue(question, field) {
  const m = /^choices\[(\d+)\]$/.exec(field);
  return m ? question.choices[Number(m[1])] : question[field];
}
function codepointSlice(value, start, count) { return Array.from(value).slice(start, start+count).join(''); }
function assertMathSerialization(text, where) {
  const bad = [
    [/(?<!\\)[fFg]prime/, 'bare derivative token'],
    [/(?<!\\)int(?=_|\s|\(|\{|\d)/, 'bare int'],
    [/(?<!\\)dfrac/, 'bare dfrac'],
    [/(?<!\\)sum_/, 'bare sum'],
    [/(?<!\\)end\{cases\}/, 'bare cases terminator'],
    [/(?<!\\)lim_\{/, 'bare limit command'],
    [/\b(?:x|\d)ge(?=[\d\s-])/, 'bare ge comparator'],
    [/\b(?:x|\d)le(?=[\d\s-])/, 'bare le comparator']
  ];
  for (const [pattern,label] of bad) if (pattern.test(text)) throw new Error(`${where}: ${label} remains`);
  if (/[\u0008\u0009\u000c\u000d]/.test(text)) throw new Error(`${where}: TeX escape control character remains`);
  if (/(?<!\\),d(?:x|y|t)\b/.test(text)) throw new Error(`${where}: raw differential comma remains`);
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) throw new Error(`${where}: unmatched inline math delimiter`);
  const beginCases = text.split('begin{cases}').length - 1;
  const endCases = text.split('end{cases}').length - 1;
  if (beginCases > 0 && !text.includes('\\begin{cases}')) throw new Error(`${where}: cases begin command missing backslash`);
  if (beginCases !== endCases) throw new Error(`${where}: cases begin/end mismatch ${beginCases}/${endCases}`);
  if (beginCases > 0 && !text.includes(BS.repeat(2))) throw new Error(`${where}: cases row separator missing doubled backslash`);
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}') depth--;
    if (depth < 0) throw new Error(`${where}: closing brace without opener`);
  }
  if (depth !== 0) throw new Error(`${where}: unbalanced braces ${depth}`);
}

const examData = new Map();
for (const spec of examSpecs) {
  const file = path.join(root,spec.file);
  const sourceBefore = fs.readFileSync(file,'utf8');
  const bankBefore = parseBank(sourceBefore);
  const bankAfter = structuredClone(bankBefore);
  const qids = qidsByExam.get(spec.examId);
  const fieldChanges = [];
  for (const qid of qids) {
    const before = bankBefore.find(q=>q.id===qid);
    const after = bankAfter.find(q=>q.id===qid);
    if (!before || !after) throw new Error(`${spec.examId} q${qid} not found`);
    const content = repairMathSerialization(before.content,qid);
    const choices = before.choices.map(choice=>repairMathSerialization(choice,qid));
    if (content === before.content && choices.every((x,i)=>x===before.choices[i])) throw new Error(`No serialization repair produced for ${spec.examId} q${qid}`);
    assertMathSerialization(content,`${spec.examId} q${qid} content`);
    choices.forEach((choice,i)=>assertMathSerialization(choice,`${spec.examId} q${qid} choice ${i+1}`));
    after.content = content;
    after.choices = choices;
    fieldChanges.push({qid,contentBefore:before.content,contentAfter:content,choicesBefore:before.choices,choicesAfter:choices});
  }

  let sourceAfter = sourceBefore;
  const blocks = questionBlocks(sourceBefore).filter(x=>qids.has(x.id)).sort((a,b)=>b.start-a.start);
  for (const bounds of blocks) {
    const originalBlock = sourceAfter.slice(bounds.start,bounds.end);
    let patched = originalBlock;
    const qid = bounds.id;
    const newQuestion = bankAfter.find(q=>q.id===qid);
    const contentPatch = patchFieldStrings(patched,'content',()=>newQuestion.content);
    patched = contentPatch.block;
    const choicesPatch = patchFieldStrings(patched,'choices',(old,index)=>newQuestion.choices[index]);
    patched = choicesPatch.block;
    sourceAfter = sourceAfter.slice(0,bounds.start)+patched+sourceAfter.slice(bounds.end);
  }
  const reparsed = parseBank(sourceAfter);
  if (JSON.stringify(reparsed)!==JSON.stringify(bankAfter)) throw new Error(`${spec.examId}: serialized source does not equal intended questionBank`);
  const changedIds = [];
  for (let i=0;i<bankBefore.length;i++) {
    const old=bankBefore[i], now=reparsed[i];
    if (old.id!==now.id) throw new Error(`${spec.examId}: qid order changed`);
    const beforeOther={...old}; delete beforeOther.content; delete beforeOther.choices;
    const afterOther={...now}; delete afterOther.content; delete afterOther.choices;
    if (JSON.stringify(beforeOther)!==JSON.stringify(afterOther)) throw new Error(`${spec.examId} q${old.id}: non-text question fields changed`);
    if (old.content!==now.content || JSON.stringify(old.choices)!==JSON.stringify(now.choices)) changedIds.push(old.id);
    if (old.answer!==now.answer || old.solution!==now.solution) throw new Error(`${spec.examId} q${old.id}: answer/solution changed`);
    if (!qids.has(old.id) && (old.content!==now.content || JSON.stringify(old.choices)!==JSON.stringify(now.choices))) throw new Error(`${spec.examId} q${old.id}: unrelated text/choices changed`);
  }
  if (JSON.stringify(changedIds.sort((a,b)=>a-b))!==JSON.stringify([...qids].sort((a,b)=>a-b))) throw new Error(`${spec.examId}: changed qid set mismatch`);
  fs.writeFileSync(file,sourceAfter);
  examData.set(spec.examId,{spec,bankBefore,bankAfter:reparsed,fieldChanges,changedIds,jsSha256:`sha256:${sha(Buffer.from(sourceAfter,'utf8'))}`});
}

// Bind every original failure to the exact repaired field substring and write
// the before/after map required for an independent review.
const repairEntries = [];
for (const item of failures) {
  const exam = examData.get(item.examId);
  const beforeQ = exam.bankBefore.find(q=>q.id===Number(item.qid));
  const afterQ = exam.bankAfter.find(q=>q.id===Number(item.qid));
  const beforeField = fieldValue(beforeQ,item.currentJsField);
  const afterField = fieldValue(afterQ,item.currentJsField);
  const beforeStart = item.characterOffsetInDecodedField;
  const beforeSub = item.currentStoredJsSubstring;
  if (codepointSlice(beforeField,beforeStart,Array.from(beforeSub).length)!==beforeSub) throw new Error(`Old substring binding failed ${item.examId} q${item.qid} entry ${item.entryIndex}`);
  const prefixAfter = repairMathSerialization(codepointSlice(beforeField,0,beforeStart),Number(item.qid));
  const afterSub = repairMathSerialization(beforeSub,Number(item.qid));
  const afterChars=Array.from(afterField),subChars=Array.from(afterSub),matches=[];
  for(let i=0;i<=afterChars.length-subChars.length;i++)if(subChars.every((ch,j)=>afterChars[i+j]===ch))matches.push(i);
  if(matches.length===0)throw new Error(`Repaired source fragment is absent from q${item.qid} ${item.currentJsField}: ${JSON.stringify(afterSub)}`);
  const estimatedStart=Array.from(prefixAfter).length;
  const afterStart=matches.sort((a,b)=>Math.abs(a-estimatedStart)-Math.abs(b-estimatedStart))[0];
  if (codepointSlice(afterField,afterStart,Array.from(afterSub).length)!==afterSub) throw new Error(`Repaired substring binding failed ${item.examId} q${item.qid} entry ${item.entryIndex}: ${JSON.stringify(afterSub)}`);
  repairEntries.push({
    examId:item.examId, qid:String(item.qid), entryIndex:item.entryIndex,
    printedSourceToken:item.printedSourceToken,
    inventorySourceVisualToken:item.inventorySourceVisualToken,
    currentJsField:item.currentJsField,
    beforeJsSerialization:beforeSub,
    beforeCharacterOffset:item.characterOffsetInDecodedField,
    beforeUtf8ByteOffset:item.utf8ByteOffsetInDecodedField,
    afterJsSerialization:afterSub,
    afterCharacterOffset:afterStart,
    afterUtf8ByteOffset:Buffer.byteLength(codepointSlice(afterField,0,afterStart),'utf8'),
    sourcePdfSha256:exam.spec.sourcePdfSha256,
    sourcePageNo:item.sourcePageNo,
    sourcePagePath:item.sourcePagePath,
    sourcePixelRegion:item.sourcePixelRegion,
    beforeMappingStatus:item.mappingStatus,
    staticSubstringBinding:'PASS',
    independentSourceReviewStatus:'PENDING_FRESH_OCR_FREE_REVIEW'
  });
}

const supplementalUnindexedRepairs=[
  {examId:'22_팔마고_2학기_기말_고2_수학II',qid:'18',entryIndex:null,printedSourceToken:'g′(a)=g′(e)=0',currentJsField:'content',beforeJsSerialization:'gprime(a)=gprime(e)=0',afterJsSerialization:"g'(a)=g'(e)=0",sourcePageNo:5,sourcePagePath:'archive-work/evidence/nightly/runs/2026-10-02/source-intake-heartbeat-2026-10-02-0544-kst/22_팔마고_2학기_기말_고2_수학II/pages/page_p005.png',sourcePixelRegion:[0.04,0.48,0.49,0.86],reason:'Printed in the q18 condition line but missing from the prior notation inventory.'},
  {examId:'22_팔마고_2학기_기말_고2_수학II',qid:'21',entryIndex:null,printedSourceToken:'F′(x)=f(x)',currentJsField:'content',beforeJsSerialization:'Fprime(x)=f(x)',afterJsSerialization:"F'(x)=f(x)",sourcePageNo:6,sourcePagePath:'archive-work/evidence/nightly/runs/2026-10-02/source-intake-heartbeat-2026-10-02-0544-kst/22_팔마고_2학기_기말_고2_수학II/pages/page_p006.png',sourcePixelRegion:[0.04,0.04,0.49,0.48],reason:'Printed in the q21 prompt but missing from the prior notation inventory.'}
];
for(const x of supplementalUnindexedRepairs){const e=examData.get(x.examId),q=e.bankBefore.find(v=>String(v.id)===x.qid),after=e.bankAfter.find(v=>String(v.id)===x.qid);if(!q.content.includes(x.beforeJsSerialization)||!after.content.includes(x.afterJsSerialization))throw new Error(`Unindexed supplemental binding failed q${x.qid}`)}

const sourceTextShaAfter = Object.fromEntries([...examData.entries()].map(([id,x])=>[id,x.jsSha256]));
const receipt = {
  schema:'SOURCE_NOTATION_SERIALIZATION_REPAIR_v1',
  runId:'source-intake-heartbeat-2026-10-02-0544-kst',
  repairType:'SOURCE_ONLY_PROMPT_AND_CHOICE_MATH_SERIALIZATION',
  priorFullAuditRef:initialAuditRel,
  priorFullAuditSha256:`sha256:${shaFile(path.join(root,initialAuditRel))}`,
  priorFullAuditReviewedCommit:initialAudit.reviewedCommit,
  repairMethod:'Exact character-level TeX/JS serialization corrections based on original full-page PNG pixels; no OCR used.',
  sourcePixelsReviewedWithoutOcr:true,
  changedExamIds:examSpecs.map(x=>x.examId),
  changedQuestionIds:Object.fromEntries([...examData.entries()].map(([id,x])=>[id,x.changedIds])),
  correctedNotationEntryCount:repairEntries.length,
  correctedEntries:repairEntries,
  supplementalUnindexedNotationRepairCount:supplementalUnindexedRepairs.length,
  supplementalUnindexedRepairs,
  totalSourceSerializationRepairCount:repairEntries.length+supplementalUnindexedRepairs.length,
  contentChoicesOnly:true,
  answerSolutionMetadataOrAssetChanges:false,
  answerSolutionValuesUnchangedAndEmpty:true,
  staticValidation:{status:'PASS',questionCounts:Object.fromEntries([...examData.entries()].map(([id,x])=>[id,x.bankAfter.length])),allOriginalSubstringsBoundBefore:true,allRepairedSubstringsBoundAfter:true,onlyAuthorizedQidContentAndChoicesChanged:true,answerAndSolutionFieldsUnchanged:true,knownInvalidSerializerFragmentsRemaining:0,unindexedSourceNotationTokensAddedAndMapped:2,externalIndependentReviewStatus:'PENDING_FRESH_OCR_FREE_REVIEW'},
  currentRunStatus:'SOURCE_QA_NOTATION_REPAIR_PENDING_FRESH_OCR_FREE_REVIEW',
  sourceQAReadyCount:0,
  notionWrites:'NOT_PERFORMED',
  handoffStatus:'PENDING_PARENT_EVIDENCE'
};
const receiptPath=path.join(runDir,'notation_serialization_repair_receipt.json');
writeJson(receiptPath,receipt);

const finalPath=path.join(runDir,'source_text_asset_independent_review_final.json');
const final=JSON.parse(fs.readFileSync(finalPath,'utf8'));
final.finalVerdict='SOURCE_QA_NOTATION_REPAIR_PENDING_FRESH_OCR_FREE_REVIEW';
final.handoffEligibility='PENDING_PARENT_EVIDENCE';
final.assetGateStatus='PASS_10_OF_10_CROPS';
final.sourceTextParity='PENDING_FRESH_OCR_FREE_REVIEW';
final.choicesParity='PENDING_FRESH_OCR_FREE_REVIEW';
final.currentNotationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;
final.currentNotationRepairSha256=`sha256:${shaFile(receiptPath)}`;
final.currentNotationRepairStatus='PENDING_FRESH_OCR_FREE_REVIEW';
final.notationInventoryRepair={
  status:'REPAIRED_PENDING_FRESH_OCR_FREE_REVIEW',
  priorFullAuditRef:initialAuditRel,
  priorFullAuditSha256:`sha256:${shaFile(path.join(root,initialAuditRel))}`,
  correctedMappingCount:repairEntries.length,
  staticSubstringBindingStatus:'PASS_92_OF_92',
  sourcePixelReviewPerformedByBuilder:true,
  independentReviewStatus:'PENDING_FRESH_OCR_FREE_REVIEW',
  priorMappingFailuresPreservedInAudit:true,
  currentFailureCount:0,
  currentReviewPendingCount:repairEntries.length,
  supplementalUnindexedNotationRepairCount:supplementalUnindexedRepairs.length,
  totalSourceSerializationReviewPendingCount:repairEntries.length+supplementalUnindexedRepairs.length,
  repairReceiptRef:`${runRel}/notation_serialization_repair_receipt.json`
};
for (const e of final.exams) {
  const ex=examData.get(e.examId);
  if (ex) {
    e.sourceJs.sha256=ex.jsSha256;
    e.sourceJs.providedSha256=ex.jsSha256;
    e.sourceJs.sha256Basis='raw working-tree bytes after source notation serialization repair';
    e.sourceJs.identityStatus='TEXT_REPAIR_PENDING_FRESH_REVIEW';
    e.sourceJs.normalizedContentMatchesArtifactCommit=false;
    e.finalVerdict='SOURCE_QA_NOTATION_REPAIR_PENDING_FRESH_OCR_FREE_REVIEW';
    e.sourceTextParity='PENDING_FRESH_OCR_FREE_REVIEW';
    e.choicesParity='PENDING_FRESH_OCR_FREE_REVIEW';
    e.notationSourceMappingFailureCount=0;
    e.notationSourceMappingReviewPendingCount=repairEntries.filter(x=>x.examId===e.examId).length;
    e.unindexedNotationRepairReviewPendingCount=supplementalUnindexedRepairs.filter(x=>x.examId===e.examId).length;
    e.notationQuestionCountPendingReview=ex.changedIds.length;
    e.currentNotationRepairStatus='PENDING_FRESH_OCR_FREE_REVIEW';
  }
}
writeJson(finalPath,final);

const runPath=path.join(runDir,'run.json');
const run=JSON.parse(fs.readFileSync(runPath,'utf8'));
run.status='SOURCE_QA_NOTATION_REPAIR_PENDING_FRESH_OCR_FREE_REVIEW';
run.finalVerdict=run.status;
run.reviewStatus=run.status;
run.independentReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
run.successCount=0;
run.successfulSourceOnlyCountForRun=0;
run.sourceQAReadyCount=0;
run.sourceTextExactParityStatus='PENDING_FRESH_OCR_FREE_REVIEW';
run.choicesExactParityStatus='PENDING_FRESH_OCR_FREE_REVIEW';
run.sourceAssetCropAuditStatus='PASS_10_OF_10_CROPS';
run.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
run.notationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;
run.notationRepairStaticStatus='PASS_92_OF_92_BINDINGS';
run.notationSourceMappingFailureCount=0;
run.notationSourceMappingReviewPendingCount=92;
run.supplementalUnindexedNotationRepairCount=supplementalUnindexedRepairs.length;
run.sourceNotationSerializationReviewPendingCount=repairEntries.length+supplementalUnindexedRepairs.length;
run.notationSourceMappingPassCount=469;
run.notationInventoryEntryCount=561;
run.notationReviewerTaskOrSubagentId='PENDING_FRESH_OCR_FREE_SUBAGENT';
run.handoffStatus='PENDING_PARENT_EVIDENCE';
run.notionsWrites='NOT_PERFORMED';
for (const e of run.exams) {
  const ex=examData.get(e.examId);
  if (ex) {
    e.sourceJsSha256=ex.jsSha256;
    e.sourceJsGitBlob='PENDING_NOTATION_REPAIR_COMMIT';
    e.sourceJsCommittedContentSha256='PENDING_NOTATION_REPAIR_COMMIT';
    e.independentReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
    e.sourceTextExactParityStatus='PENDING_FRESH_OCR_FREE_REVIEW';
    e.choicesExactParityStatus='PENDING_FRESH_OCR_FREE_REVIEW';
    e.finalVerdict='SOURCE_QA_NOTATION_REPAIR_PENDING_FRESH_OCR_FREE_REVIEW';
    e.notationMappingFailureCount=0;
    e.notationMappingReviewPendingCount=repairEntries.filter(x=>x.examId===e.examId).length;
    e.unindexedNotationRepairReviewPendingCount=supplementalUnindexedRepairs.filter(x=>x.examId===e.examId).length;
    e.notationQuestionCountPendingReview=ex.changedIds.length;
  }
}
writeJson(runPath,run);

const oldReceiptPath=path.join(runDir,'notation_inventory_repair_receipt.json');
const oldReceipt=JSON.parse(fs.readFileSync(oldReceiptPath,'utf8'));
oldReceipt.currentNotationSerializationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;
oldReceipt.currentNotationSerializationRepairSha256=`sha256:${shaFile(receiptPath)}`;
oldReceipt.currentNotationSerializationRepairStatus='PENDING_FRESH_OCR_FREE_REVIEW';
oldReceipt.correctedMappingCount=92;
oldReceipt.supplementalUnindexedNotationRepairCount=supplementalUnindexedRepairs.length;
oldReceipt.totalCurrentSourceSerializationReviewPendingCount=94;
oldReceipt.currentKnownNotationMappingFailureCount=0;
oldReceipt.notationMappingsPendingIndependentReview=92;
oldReceipt.supplementalUnindexedRepairsPendingIndependentReview=2;
oldReceipt.remainingAssetFailures=[];
writeJson(oldReceiptPath,oldReceipt);

const closePath=path.join(runDir,'source_qa_closeout.json');
const close=JSON.parse(fs.readFileSync(closePath,'utf8'));
close.status=run.status;
close.finalVerdict=run.finalVerdict;
close.reviewStatus=run.status;
close.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
close.handoffEligibility='PENDING_PARENT_EVIDENCE';
close.sourceQAReadyCount=0;
close.successfulExamCount=0;
close.notationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;
close.notationRepairStaticStatus='PASS_92_OF_92_BINDINGS';
close.notationMappingReviewPendingCount=92;
close.supplementalUnindexedNotationRepairCount=2;
close.sourceNotationSerializationReviewPendingCount=94;
close.notationRepairReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
close.notionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT';
close.notionWrites='NOT_PERFORMED';
writeJson(closePath,close);

const ledgerPath=path.join(root,'archive-work/evidence/nightly/ledger.json');
const ledger=JSON.parse(fs.readFileSync(ledgerPath,'utf8'));
ledger.currentRunStatus=run.status;
ledger.activeRunStatus=run.status;
ledger.sourceQACloseoutStatus=run.status;
ledger.successfulSourceOnlyCountForRun=0;
ledger.sourceQAReadyCount=0;
ledger.currentRunNotationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;
ledger.currentRunNotationRepairStatus='PENDING_FRESH_OCR_FREE_REVIEW';
ledger.currentRunNotationRepairStaticStatus='PASS_92_OF_92_BINDINGS';
ledger.currentRunNotationSourceMappingFailureCount=0;
ledger.currentRunNotationMappingReviewPendingCount=92;
ledger.currentRunSupplementalUnindexedNotationRepairCount=2;
ledger.currentRunSourceNotationSerializationReviewPendingCount=94;
ledger.currentRunNotionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT';
ledger.currentRunNotionWrites='NOT_PERFORMED';
const last=ledger.runs.at(-1);
if (last?.runId===run.runId) {
  last.status=run.status;last.successCount=0;last.sourceQAReadyCount=0;last.finalVerdict=run.finalVerdict;
  last.notationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;
  last.notationRepairStaticStatus='PASS_92_OF_92_BINDINGS';
  last.notationMappingReviewPendingCount=92;
  last.supplementalUnindexedNotationRepairCount=2;
  last.sourceNotationSerializationReviewPendingCount=94;
  last.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
  last.sourceAssetCropAuditStatus='PASS_10_OF_10_CROPS';
}
writeJson(ledgerPath,ledger);

const activePath=path.join(root,'archive-work/evidence/nightly/active-run.json');
const active=JSON.parse(fs.readFileSync(activePath,'utf8'));
active.status=run.status;active.reviewStatus=run.status;active.independentReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
active.sourceAssetCropStatus='PASS_10_OF_10_CROPS';active.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';
active.notationRepairRef=`${runRel}/notation_serialization_repair_receipt.json`;active.notationRepairStaticStatus='PASS_92_OF_92_BINDINGS';
active.notationMappingReviewPendingCount=92;active.sourceQAReadyCount=0;active.notionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT';
writeJson(activePath,active);

const finalHash=`sha256:${shaFile(finalPath)}`;
run.finalReconciledReviewReportSha256=finalHash;
writeJson(runPath,run);
oldReceipt.updatedFinalReportSha256=finalHash;
writeJson(oldReceiptPath,oldReceipt);
close.finalReconciledReportSha256=finalHash;
writeJson(closePath,close);
ledger.currentRunFinalReconciledReviewReportSha256=finalHash;
writeJson(ledgerPath,ledger);

console.log(JSON.stringify({
  repairedEntries:repairEntries.length,
  qids:Object.fromEntries([...examData.entries()].map(([id,x])=>[id,x.changedIds])),
  receipt:receiptPath,
  finalReportSha256:finalHash,
  status:run.status,
  sourceQAReadyCount:run.sourceQAReadyCount,
  fullPageEvidenceUsed:true,
  answerSolutionFieldsChanged:false
},null,2));
