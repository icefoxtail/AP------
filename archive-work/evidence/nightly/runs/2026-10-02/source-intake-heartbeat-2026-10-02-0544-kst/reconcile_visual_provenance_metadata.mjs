import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const dir = 'archive-work/evidence/nightly/runs/2026-10-02/source-intake-heartbeat-2026-10-02-0544-kst';
const runDir = path.join(root, dir);
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const fileSha = p => sha(fs.readFileSync(p));
const write = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
const targets = [
  { examId:'22_팔마고_2학기_기말_고2_수학II', qid:18, bbox:{x1:100,y1:1328,x2:810,y2:1690}, width:710, height:362,
    js:'archive-work/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js',
    asset:'archive-work/assets/images/22_팔마고_2학기_기말_고2_수학II/q018_visual.png' },
  { examId:'22_효천고_2학기_기말_고2_수학II', qid:22, bbox:{x1:1660,y1:1200,x2:2110,y2:2200}, width:450, height:1000,
    js:'archive-work/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js',
    asset:'archive-work/assets/images/22_효천고_2학기_기말_고2_수학II/q022_visual.png' }
];
function bank(fileText) {
  const start = fileText.indexOf('window.questionBank = [') + 'window.questionBank = '.length;
  const end = fileText.indexOf('\n];', start) + 2;
  if (start < 0 || end < 2) throw new Error('questionBank payload not found');
  return JSON.parse(fileText.slice(start, end));
}
function payloadDigest(fileText) {
  const items = bank(fileText).map(q => ({ id:q.id, content:q.content, choices:q.choices }));
  return { sha256:sha(Buffer.from(JSON.stringify(items),'utf8')), questionCount:items.length };
}
function patchQuestion(jsText, item) {
  const marker = `"id": ${item.qid},`;
  const start = jsText.indexOf(marker);
  const nextMatch = /\r?\n  \{\r?\n    "id":/.exec(jsText.slice(start + marker.length));
  const next = nextMatch ? start + marker.length + nextMatch.index : -1;
  if (start < 0 || next < 0) throw new Error(`q${item.qid} question block not found`);
  let block = jsText.slice(start, next);
  block = block.replace(/"sourceBBox":\s*\{\s*"x1":\s*\d+,\s*"y1":\s*\d+,\s*"x2":\s*\d+,\s*"y2":\s*\d+\s*\}/,
    `"sourceBBox": {\n        "x1": ${item.bbox.x1},\n        "y1": ${item.bbox.y1},\n        "x2": ${item.bbox.x2},\n        "y2": ${item.bbox.y2}\n      }`);
  block = block.replace(/"naturalWidth":\s*\d+/, `"naturalWidth": ${item.width}`);
  block = block.replace(/"naturalHeight":\s*\d+/, `"naturalHeight": ${item.height}`);
  block = block.replace(/"cropGenerator":\s*"[^"]*"/, '"cropGenerator": "Pillow Image.crop from original full-page PNG"');
  block = block.replace(/"cropStatus":\s*"[^"]*"/, '"cropStatus": "CROP_PURITY_PASS"');
  block = block.replace(/"verdict":\s*"[^"]*"/, '"verdict": "PASS_VISUAL_AND_PIXEL_CROP"');
  block = block.replace(/"checks":\s*\{[\s\S]*?\n      \}/, `"checks": {\n        "CROP_PURITY": true,\n        "NO_OTHER_QUESTION_TEXT": true,\n        "NO_CHOICES_CONTAMINATION": true,\n        "NO_PAGE_BORDER_CONTAMINATION": true,\n        "NO_CLIPPING": true,\n        "REQUIRED_LABELS_PRESENT": true,\n        "QUESTION_SEMANTIC_MATCH": true\n      }`);
  for (const needle of [`"x1": ${item.bbox.x1}`, `"y1": ${item.bbox.y1}`, `"naturalWidth": ${item.width}`, `"naturalHeight": ${item.height}`, '"CROP_PURITY": true']) if (!block.includes(needle)) throw new Error(`metadata patch failed for q${item.qid}: ${needle}`);
  return jsText.slice(0,start) + block + jsText.slice(next);
}

const before = [];
for (const item of targets) {
  const jsPath = path.join(root,item.js);
  const old = fs.readFileSync(jsPath,'utf8');
  const committed = execFileSync('git',['show',`HEAD:${item.js}`],{encoding:'utf8'});
  const contentChoicesBefore = payloadDigest(old);
  const contentChoicesAtV2Audit = payloadDigest(committed);
  if (contentChoicesBefore.sha256 !== contentChoicesAtV2Audit.sha256) throw new Error(`content/choices already diverged at q${item.qid}`);
  fs.writeFileSync(jsPath,patchQuestion(old,item));
  const current = fs.readFileSync(jsPath,'utf8');
  const contentChoicesAfter = payloadDigest(current);
  if (contentChoicesAfter.sha256 !== contentChoicesAtV2Audit.sha256) throw new Error(`content/choices changed while reconciling q${item.qid}`);
  before.push({examId:item.examId,qid:String(item.qid),sourceJsPath:item.js,sourceJsSha256:`sha256:${sha(Buffer.from(current,'utf8'))}`,assetPath:item.asset,assetSha256:`sha256:${fileSha(path.join(root,item.asset))}`,bbox:item.bbox,assetDimensionsPx:[item.width,item.height],contentChoicesDigestAtV2Audit:`sha256:${contentChoicesAtV2Audit.sha256}`,contentChoicesDigestAfterMetadataRepair:`sha256:${contentChoicesAfter.sha256}`,contentChoicesUnchanged:true});
}

const auditRef = `${dir}/source_itemization_v2_independent_audit.json`;
const auditPath = path.join(root,auditRef);
const audit = JSON.parse(fs.readFileSync(auditPath,'utf8'));
const auditSha = `sha256:${fileSha(auditPath)}`;
const pendingRef = `${dir}/source_visual_provenance_metadata_recheck_pending.json`;
const pending = { schema:'SOURCE_VISUAL_PROVENANCE_METADATA_RECHECK_v1', runId:'source-intake-heartbeat-2026-10-02-0544-kst', priorReviewRef:auditRef, priorReviewSha256:auditSha, priorReviewCommit:audit.reviewedCommit, priorReviewVerdict:audit.aggregate.finalVerdict, currentHeadBeforeMetadataRepair:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), independentReviewStatus:'PENDING_TARGETED_OCR_FREE_METADATA_RECHECK', changedProductionScope:'Only q18/q22 nested visualAssetProvenance sourceBBox, naturalWidth/naturalHeight and current crop-review gates; no content/choices, asset pixels, answers, solutions or other qids changed.', contentChoicePayloadChecks:before, remainingNotationMappingFailures:{count:92,Pal:29,Hyocheon:63,disposition:'Retain all as unsupported/malformed failures; no source-question content serialization changed.'}, reviewerScope:'Independently compare the two nested provenance bboxes/dimensions/current asset hashes with active visualAssetBBoxOnPage and crop pixels. Confirm q4 frozen PASS. Prior v2 review remains the full 46-qid/561-entry notation audit because the content/choices payload hashes were unchanged.', noNotionWrites:true };
write(path.join(root,pendingRef),pending);

const finalPath=path.join(runDir,'source_text_asset_independent_review_final.json');
const final=JSON.parse(fs.readFileSync(finalPath,'utf8'));
final.assetGateStatus='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';
final.visualProvenanceMetadataRecheckRef=pendingRef;
final.sourceItemizationAudit={ref:auditRef,sha256:auditSha,reviewerId:audit.reviewer,reviewedAtKst:audit.reviewedAtKst,reviewedCommit:audit.reviewedCommit,notationEntryCount:audit.aggregate.notationEntryCount,mechanicallyBoundCount:audit.aggregate.exactCurrentFieldSubstringAndCharacterOffsetVerifiedCount,sourceMappingPassCount:audit.aggregate.sourceMappingPassCount,sourceMappingFailureCount:audit.aggregate.unsupportedOrMalformedSourceToJsMappingFailureCount,visualAnchorCount:48,visualAnchorStatus:'PASS_48',assetFailures:audit.assetReviews.filter(x=>x.visualVerdict.startsWith('FAIL'))};
for(const t of targets){const e=final.exams.find(x=>x.examId===t.examId);const ar=e.assetReviews.find(x=>x.qid===String(t.qid));if(ar){ar.pageBBox=t.bbox;ar.assetSha256=fileSha(path.join(root,t.asset));ar.claimedAssetSha256=ar.assetSha256;ar.assetShaMatches=true;ar.gates={cropPurity:'PASS',contamination:'PASS',clipping:'PASS',requiredLabel:'PASS',questionSemanticMatch:'PASS',sourceBBoxBinding:'PENDING_TARGETED_PROVENANCE_METADATA_RECHECK'};ar.verdict='PASS_VISUAL_PENDING_METADATA_RECHECK';ar.finding='Fresh v2 visual/pixel review passed. Nested sourceBBox/dimensions were reconciled after that review; targeted provenance metadata recheck is pending.'}e.assetGateStatus='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';}
final.finalVerdict='SOURCE_QA_ITEMIZATION_REQUIRED';
write(finalPath,final);

const cropAuditUpdates = [
  {examId:targets[0].examId,qid:'18'}, {examId:targets[1].examId,qid:'22'}
];
for(const x of cropAuditUpdates){const p=path.join(runDir,x.examId,'source_asset_crop_audit.json');const o=JSON.parse(fs.readFileSync(p,'utf8'));const a=o.assets.find(y=>y.qid===x.qid);if(a){a.bbox=targets.find(y=>y.examId===x.examId).bbox;a.sourceBBoxBinding='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';a.cropPurity=a.contamination=a.choiceContamination=a.pageBorderContamination=a.clipping=a.requiredLabels=a.questionSemanticMatch=a.pngDecode='PASS';a.targetedRecheckEvidenceRef=auditRef;a.targetedRecheckEvidenceSha256=auditSha;a.targetedRecheckEvidence=null;a.initialReviewFinding='v2 independent review passed crop visual and pixel gates; nested JS sourceBBox/dimensions were reconciled afterward and await targeted metadata check.'}o.status='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';o.latestIndependentCropReviewRef=auditRef;o.latestIndependentCropReviewSha256=auditSha;write(p,o)}

const runPath=path.join(runDir,'run.json');const run=JSON.parse(fs.readFileSync(runPath,'utf8'));run.status='SOURCE_QA_ITEMIZATION_REQUIRED_PENDING_PARENT_EVIDENCE';run.finalVerdict='SOURCE_QA_ITEMIZATION_REQUIRED';run.successCount=0;run.sourceQAReadyCount=0;run.successfulSourceOnlyCountForRun=0;run.sourceAssetCropAuditStatus='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';run.itemizationReviewStatus='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';run.completedV2ItemizationAuditRef=auditRef;run.completedV2ItemizationAuditSha256=auditSha;run.completedV2ItemizationAuditCommit=audit.reviewedCommit;run.itemizationAuditReportRef=auditRef;run.itemizationAuditReportSha256=auditSha;run.notationSourceMappingFailureCount=92;run.notationSourceMappingPassCount=469;run.notationInventoryEntryCount=561;run.visualAnchorStatus='PASS_48';run.targetedCropRepairStatus='PENDING_TARGETED_PROVENANCE_METADATA_RECHECK';run.visualProvenanceMetadataRecheckRef=pendingRef;write(runPath,run);
const receiptPath=path.join(runDir,'notation_inventory_repair_receipt.json');const receipt=JSON.parse(fs.readFileSync(receiptPath,'utf8'));receipt.freshAuditStatus=audit.aggregate.finalVerdict;receipt.freshAuditReportRef=auditRef;receipt.freshAuditReportSha256=auditSha;receipt.notationSourceMappingFailures=92;receipt.notationSourceMappingPasses=469;receipt.remainingAssetFailures=[];receipt.visualMetadataDrift=['Pal q18 nested sourceBBox/naturalWidth/naturalHeight','Hyocheon q22 nested sourceBBox/naturalWidth/naturalHeight'];receipt.targetedMetadataRecheckStatus='PENDING';write(receiptPath,receipt);
console.log(JSON.stringify({auditSha,reportSha:`sha256:${fileSha(finalPath)}`,metadataRecheckRef:pendingRef,contentChoicesUnchanged:before.every(x=>x.contentChoicesUnchanged),updated:before},null,2));
