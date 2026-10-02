import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const runRel = 'archive-work/evidence/nightly/runs/2026-10-02/source-intake-heartbeat-2026-10-02-0544-kst';
const runDir = path.join(root, runRel);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exams = [
  {
    examId: '22_팔마고_2학기_기말_고2_수학II', qid: '18', sourceQuestionNo: '18',
    js: 'archive-work/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js',
    asset: 'archive-work/assets/images/22_팔마고_2학기_기말_고2_수학II/q018_visual.png',
    bbox: { x1: 100, y1: 1328, x2: 810, y2: 1690 }, page: 5,
    note: 'Expanded upward and left to retain the complete printed condition line for this same question plus the full y-axis arrow/label and graph; no neighboring question, instructions, or answer choices enter the crop.'
  },
  {
    examId: '22_효천고_2학기_기말_고2_수학II', qid: '22', sourceQuestionNo: '서술형2',
    js: 'archive-work/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js',
    asset: 'archive-work/assets/images/22_효천고_2학기_기말_고2_수학II/q022_visual.png',
    bbox: { x1: 1660, y1: 1200, x2: 2110, y2: 2200 }, page: 3,
    note: 'Expanded the top margin to retain the y-axis arrow/label and complete curve tops; the full y=g(x) label remains and no prompt text or page divider enters the crop.'
  }
];
const writeJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
function patchJs(item, assetSha) {
  const p = path.join(root, item.js);
  let s = fs.readFileSync(p, 'utf8');
  const marker = `"id": ${item.qid === '서술형2' ? 22 : Number(item.qid)},`;
  const start = s.indexOf(marker);
  if (start < 0) throw new Error(`Could not locate ${marker} in ${item.js}`);
  const next = s.indexOf('\n  {\n    "id":', start + marker.length);
  const end = next < 0 ? s.length : next;
  let block = s.slice(start, end);
  block = block.replace(/"visualAssetBBoxOnPage":\s*\{\s*"x1":\s*\d+,\s*"y1":\s*\d+,\s*"x2":\s*\d+,\s*"y2":\s*\d+\s*\}/,
    `"visualAssetBBoxOnPage": {\n      "x1": ${item.bbox.x1},\n      "y1": ${item.bbox.y1},\n      "x2": ${item.bbox.x2},\n      "y2": ${item.bbox.y2}\n    }`);
  block = block.replace(/("assetSha256":\s*")sha256:[0-9a-f]+(")/, `$1sha256:${assetSha}$2`);
  if (!block.includes(`"y1": ${item.bbox.y1}`) || !block.includes(`sha256:${assetSha}`)) throw new Error(`JS update incomplete for ${item.qid}`);
  fs.writeFileSync(p, s.slice(0, start) + block + s.slice(end));
}
function patchAssetReview(o, item, assetSha, mode) {
  const a = o.assets?.find(x => x.qid === item.qid) ?? o.assetReviews?.find(x => x.qid === item.qid);
  if (!a) return false;
  if ('bbox' in a) a.bbox = item.bbox;
  if ('pageBBox' in a) a.pageBBox = item.bbox;
  a.assetSha256 = assetSha;
  if ('claimedAssetSha256' in a) a.claimedAssetSha256 = assetSha;
  if ('assetShaMatches' in a) a.assetShaMatches = true;
  if ('assetSha256VerifiedAgainstDisk' in a) a.assetSha256VerifiedAgainstDisk = true;
  if ('sourceToQuestionPageAndBbox' in a) a.sourceToQuestionPageAndBbox = { status: 'PENDING_FRESH_OCR_FREE_REVIEW', detail: 'Current source page, qid, bbox and asset binding were updated after a direct crop from the original page raster; independent verification is pending.' };
  if (mode === 'latest') {
    if (a.gates) for (const k of Object.keys(a.gates)) a.gates[k] = 'PENDING_FRESH_OCR_FREE_REVIEW';
    for (const k of ['cropPurity','contamination','clipping','requiredLabels','requiredLabel','questionSemanticMatch','pngDecode']) if (k in a) a[k] = 'PENDING_FRESH_OCR_FREE_REVIEW';
    if ('verdict' in a) a.verdict = 'TARGETED_RECHECK_PENDING';
    if ('finding' in a) a.finding = `Updated crop bbox ${JSON.stringify(item.bbox)} and SHA-256 ${assetSha}; fresh independent OCR-free review is pending. ${item.note}`;
    if ('assetShaMatches' in a) a.assetShaMatches = true;
  }
  return true;
}

const outputs = [];
for (const item of exams) {
  const assetAbs = path.join(root, item.asset);
  const assetSha = sha(assetAbs);
  patchJs(item, assetSha);
  const jsSha = sha(path.join(root, item.js));
  const provPath = path.join(runDir, item.examId, 'source_asset_crop_provenance.json');
  const prov = JSON.parse(fs.readFileSync(provPath, 'utf8'));
  const provAsset = prov.assets.find(x => x.qid === item.qid);
  provAsset.bbox = item.bbox;
  provAsset.assetSha256 = `sha256:${assetSha}`;
  provAsset.cropper = 'Pillow Image.crop from original full-page PNG';
  provAsset.processing = { operations: ['crop'], rotation: 'none', deskew: 'none', contrast: 'none', reconstruction: 'none' };
  provAsset.sourcePixelsRestored = false;
  provAsset.repairNote = item.note;
  writeJson(provPath, prov);

  const auditPath = path.join(runDir, item.examId, 'source_asset_crop_audit.json');
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const auditAsset = audit.assets.find(x => x.qid === item.qid);
  if (auditAsset) {
    auditAsset.bbox = item.bbox;
    auditAsset.assetSha256 = assetSha;
    auditAsset.cropPurity = auditAsset.contamination = auditAsset.choiceContamination = auditAsset.pageBorderContamination = 'PENDING_FRESH_OCR_FREE_REVIEW';
    auditAsset.clipping = auditAsset.requiredLabels = auditAsset.questionSemanticMatch = auditAsset.pngDecode = 'PENDING_FRESH_OCR_FREE_REVIEW';
    auditAsset.targetedRecheckEvidence = null;
    auditAsset.initialReviewFinding = item.note;
  }
  audit.status = 'PENDING_FRESH_OCR_FREE_REVIEW';
  audit.repairPendingRef = `${runRel}/targeted_source_asset_crop_repair_pending.json`;
  writeJson(auditPath, audit);

  const jsText = fs.readFileSync(path.join(root, item.js), 'utf8');
  const blockStart = jsText.indexOf(`"id": ${item.qid === '서술형2' ? 22 : Number(item.qid)},`);
  const blockEnd = jsText.indexOf('\n  {\n    "id":', blockStart + 8);
  const block = jsText.slice(blockStart, blockEnd < 0 ? jsText.length : blockEnd);
  const qMatch = block.match(/"sourceQuestionNo":\s*"([^"]+)"/);
  const sourceQuestionNo = qMatch ? qMatch[1] : item.sourceQuestionNo;
  const sourcePdf = item.examId.includes('팔마고') ? 'D:/기출/(4)2기말/수2/2022_팔마고2_수2_2기말.pdf' : 'D:/기출/(4)2기말/수2/2022_효천고2_수2_2기말.pdf';
  const pdfSha = item.examId.includes('팔마고') ? 'sha256:81806e70e69932928eeff5d90706d4c32ee45155133a421670e7c1d57ce929b3' : 'sha256:3de860f5462f49674d3951cc3829e80539e0aaaef40e40874e127690a5ab7ab6';
  const pageRel = `${runRel}/${item.examId}/pages/page_p${String(item.page).padStart(3, '0')}.png`;
  outputs.push({ examId: item.examId, qid: item.qid, js: item.js, sourceJsSha256: `sha256:${jsSha}`, sourceQuestionNo, sourcePdf, sourcePdfSha256: pdfSha, sourcePageNo: item.page, sourcePagePath: pageRel, sourcePageSha256: `sha256:${sha(path.join(runDir, item.examId, 'pages', `page_p${String(item.page).padStart(3,'0')}.png`))}`, bbox: item.bbox, assetPath: item.asset, assetSha256: `sha256:${assetSha}`, cropper: 'Pillow Image.crop from original full-page PNG', operations: ['crop'], rotation: 'none', deskew: 'none', contrast: 'none', reconstruction: 'none', sourcePixelsRestored: false, currentGates: 'PENDING_FRESH_OCR_FREE_REVIEW', repairNote: item.note });

  const finalPath = path.join(runDir, 'source_text_asset_independent_review_final.json');
  const final = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
  const exam = final.exams.find(x => x.examId === item.examId);
  const review = exam.assetReviews.find(x => x.qid === item.qid);
  review.pageBBox = item.bbox;
  review.assetSha256 = assetSha;
  review.claimedAssetSha256 = assetSha;
  review.assetShaMatches = true;
  review.cropGenerator = 'Pillow Image.crop from original full-page PNG';
  review.actualProcessing = 'Direct rectangular crop from original source page PNG; no rotation, deskew, contrast adjustment, enhancement or reconstruction.';
  review.gates = Object.fromEntries(Object.keys(review.gates).map(k => [k, 'PENDING_FRESH_OCR_FREE_REVIEW']));
  review.verdict = 'TARGETED_RECHECK_PENDING';
  review.finding = `Updated crop bbox ${JSON.stringify(item.bbox)} and SHA-256 ${assetSha}; fresh independent OCR-free review is pending. ${item.note}`;
  exam.sourceJs.sha256 = `sha256:${jsSha}`;
  exam.sourceJs.providedSha256 = `sha256:${jsSha}`;
  exam.sourceJs.sha256Basis = 'raw working-tree bytes after bbox-only crop repair; commit receipt pending';
  exam.sourceJs.identityStatus = 'BBOX_ONLY_REPAIR_PENDING_COMMIT';
  exam.sourceJs.normalizedContentMatchesArtifactCommit = false;
  exam.assetGateStatus = 'PENDING_FRESH_OCR_FREE_REVIEW';
  exam.finalVerdict = 'SOURCE_QA_ITEMIZATION_REQUIRED';
  writeJson(finalPath, final);
  outputs.at(-1).dimensionsPx = [item.bbox.x2-item.bbox.x1, item.bbox.y2-item.bbox.y1];
}

{
  const finalPath = path.join(runDir, 'source_text_asset_independent_review_final.json');
  const final = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
  final.assetGateStatus = 'PENDING_FRESH_OCR_FREE_REVIEW_AFTER_TARGETED_CROP_REPAIR';
  final.targetedCropRepairRef = `${runRel}/targeted_source_asset_crop_repair_pending.json`;
  writeJson(finalPath, final);
}

const pendingPath = path.join(runDir, 'targeted_source_asset_crop_repair_pending.json');
writeJson(pendingPath, { schema: 'SOURCE_ASSET_TARGETED_REPAIR_PENDING_v1', runId: 'source-intake-heartbeat-2026-10-02-0544-kst', createdAtKst: new Date(Date.now()+9*60*60*1000).toISOString().replace('Z','+09:00'), cropper: 'Pillow Image.crop from original full-page PNG', operations: ['crop'], prohibitedTransformsUsed: false, independentReviewStatus: 'PENDING_FRESH_OCR_FREE_REVIEW', frozenAsset: { examId: '22_효천고_2학기_기말_고2_수학II', qid: '4', disposition: 'FROZEN_PASS_UNCHANGED' }, repairedAssets: outputs });

const receiptPath = path.join(runDir, 'source_asset_and_text_repair_receipt.json');
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
receipt.assetRepairs = outputs.map(x => ({ examId:x.examId, qid:x.qid, bbox:x.bbox, assetPath:x.assetPath, assetSha256:x.assetSha256, operations:x.operations, independentReviewStatus:'PENDING_FRESH_OCR_FREE_REVIEW' }));
receipt.assetOperations = 'Direct rectangular crop from the original source full-page PNG only; no rotation, deskew, contrast, enhancement, restoration or reconstruction.';
receipt.recheckRequired = true;
receipt.nextReviewScope = 'Fresh OCR-free itemization audit over all 46 questions and all 561 notation mappings, plus repaired crops Pal q18 and Hyocheon q22; Hyocheon q4 remains frozen PASS.';
writeJson(receiptPath, receipt);

const repairReceiptPath = path.join(runDir, 'notation_inventory_repair_receipt.json');
const repairReceipt = JSON.parse(fs.readFileSync(repairReceiptPath, 'utf8'));
repairReceipt.freshAuditStatus = 'PENDING_AFTER_TARGETED_CROP_REPAIR';
repairReceipt.remainingAssetFailures = outputs.map(x => ({ examId:x.examId, qid:x.qid, assetPath:x.assetPath, bbox:x.bbox, status:'TARGETED_RECHECK_PENDING' }));
repairReceipt.assetFilesChanged = true;
repairReceipt.sourceFilesChanged = true;
writeJson(repairReceiptPath, repairReceipt);

const runPath = path.join(runDir, 'run.json');
const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
run.status = 'SOURCE_QA_ITEMIZATION_REQUIRED_PENDING_PARENT_EVIDENCE';
run.finalVerdict = 'SOURCE_QA_ITEMIZATION_REQUIRED';
run.successCount = 0;
run.sourceQAReadyCount = 0;
run.successfulSourceOnlyCountForRun = 0;
run.itemizationReviewStatus = 'PENDING_FRESH_OCR_FREE_AUDIT';
run.remainingAssetFailures = outputs.map(x => ({ examId:x.examId, qid:x.qid, assetPath:x.assetPath, bbox:x.bbox, status:'TARGETED_RECHECK_PENDING' }));
run.targetedCropRepairRef = `${runRel}/targeted_source_asset_crop_repair_pending.json`;
run.targetedCropRepairStatus = 'PENDING_FRESH_OCR_FREE_REVIEW';
run.notionsWrites = 'NOT_PERFORMED';
for (const e of run.exams ?? []) {
  const item = outputs.find(x => x.examId === e.examId);
  if (item) {
    e.sourceJsSha256 = item.sourceJsSha256;
    e.sourceJsGitBlob = 'PENDING_CROP_REPAIR_COMMIT';
    e.sourceJsCommittedContentSha256 = 'PENDING_CROP_REPAIR_COMMIT';
    e.assetRepairQids = [...new Set([...(e.assetRepairQids ?? []), item.qid])];
    e.remainingCropFailureQids = [item.qid];
    e.itemizationReviewStatus = 'PENDING_FRESH_OCR_FREE_AUDIT';
  }
}
writeJson(runPath, run);

for (const [relPath, callback] of [
  ['archive-work/evidence/nightly/ledger.json', o => { o.currentRunStatus=run.status; o.activeRunStatus=run.status; o.successfulSourceOnlyCountForRun=0; o.sourceQAReadyCount=0; o.currentRunNotionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT'; o.currentRunNotionWrites='NOT_PERFORMED'; const last=o.runs?.at(-1); if(last?.runId===run.runId){last.status=run.status;last.successCount=0;last.sourceQAReadyCount=0;last.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_AUDIT';last.notationSourceMappingFailureCount=92;last.notionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT';last.notionWrites='NOT_PERFORMED';last.targetedCropRepairStatus='PENDING_FRESH_OCR_FREE_REVIEW';} }],
  ['archive-work/evidence/nightly/active-run.json', o => { o.runId=run.runId; o.status=run.status; o.lockStatus='RELEASED'; o.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_AUDIT'; o.sourceAssetCropStatus='PENDING_FRESH_OCR_FREE_REVIEW'; o.notationSourceMappingFailureCount=92; o.notionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT'; }],
  [`${runRel}/source_qa_closeout.json`, o => { o.status=run.status;o.finalVerdict='SOURCE_QA_ITEMIZATION_REQUIRED';o.handoffEligibility='PENDING_PARENT_EVIDENCE';o.itemizationReviewStatus='PENDING_FRESH_OCR_FREE_AUDIT';o.assetReviewStatus='PENDING_FRESH_OCR_FREE_REVIEW';o.sourceQAReadyCount=0;o.notionStatus='PENDING_PARENT_CHECKBOX_AND_COUNT';o.notionWrites='NOT_PERFORMED';o.targetedCropRepairRef=`${runRel}/targeted_source_asset_crop_repair_pending.json`; }]
]) { const p=path.join(root,relPath); const o=JSON.parse(fs.readFileSync(p,'utf8')); callback(o); writeJson(p,o); }
console.log(JSON.stringify({status:run.status,readyCount:run.sourceQAReadyCount,outputs},null,2));
