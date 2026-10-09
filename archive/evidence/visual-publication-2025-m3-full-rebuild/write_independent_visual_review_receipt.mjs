import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const manifestPath=path.join(HERE,'final-candidates/final-candidate-manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
if(manifest.status!=='PASS'||manifest.records.length!==130)throw Error('INDEPENDENT_REVIEW_MANIFEST_GATE_FAIL');
const reviews=[
  {reviewer:'visual_review_shinheung',status:'PASS',items:[
    ['25_금당중_2학기_기말_중3_기출',9],
    ...[3,5,6,7,8,9,11,21,22].map(qid=>['25_신흥중_2학기_기말_중3_기출',qid]),
    ['25_연향중_2학기_기말_中3_기출',5]
  ]},
  {reviewer:'visual_review_wangun',status:'PASS',items:[
    ['25_풍덕중_2학기_中3_수학',7],['25_풍덕중_2학기_中3_수학',13],
    ...[3,6,7,8,10,11,12,23].map(qid=>['25_왕운중_2학기_기말_中3_기출',qid])
  ]},
  {reviewer:'visual_review_pungdeok_final',status:'PASS',items:[
    ['25_연향중_2학기_기말_中3_기출',5],
    ...[1,7,21].map(qid=>['25_풍덕중_2학기_기말_中3_기출',qid])
  ]}
];
// Canonical exam labels in review logs use the exact inventory spellings.
const aliases=new Map([
  ['25_연향중_2학기_기말_中3_기출','25_연향중_2학기_기말_중3_기출'],
  ['25_풍덕중_2학기_中3_수학','25_풍덕중_2학기_중간_중3_수학'],
  ['25_왕운중_2학기_기말_中3_기출','25_왕운중_2학기_기말_중3_기출'],
  ['25_풍덕중_2학기_기말_中3_기출','25_풍덕중_2학기_기말_중3_기출'],
]);
const byKey=new Map();
for(const review of reviews)for(const [rawExam,qid] of review.items){
  const exam=aliases.get(rawExam)||rawExam,key=`${exam}#${qid}`;
  const row=byKey.get(key)||{exam,questionId:qid,reviewers:[],status:'PASS'};
  if(review.status==='PASS')row.reviewers.push(review.reviewer);else row.status='NEEDS_FIX';
  byKey.set(key,row);
}
const rows=[...byKey.values()];
if(rows.length!==24||rows.some(row=>row.status!=='PASS'))throw Error(`INDEPENDENT_REVIEW_DENOMINATOR_MISMATCH:${rows.length}`);
for(const row of rows){const item=manifest.records.find(candidate=>candidate.exam===row.exam&&Number(candidate.questionId)===row.questionId);if(!item||item.status!=='PASS')throw Error(`INDEPENDENT_REVIEW_ITEM_NOT_IN_FINAL_MANIFEST:${row.exam}:q${row.questionId}`);row.finalCandidateSvgSha256=item.candidateSvgSha256;}
const receipt={schemaVersion:'M3_INDEPENDENT_VISUAL_REVIEW_RECEIPT_v1',status:'PASS',reviewedRevisionCount:rows.length,
  candidateManifestPath:'archive/evidence/visual-publication-2025-m3-full-rebuild/final-candidates/final-candidate-manifest.json',
  candidateManifestSha256:sha(fs.readFileSync(manifestPath)),reviewBasis:'Final official-engine SVG, source question, verified solution, frozen geometry facts, and independent static audit. The final visual review checked mathematical values and point identities, explanation coverage, condition-box bindings, and visual readability. Existing production SVG bytes were not used as construction inputs.',
  records:rows};
const output=path.join(HERE,'independent-visual-review-receipt-v1.json');
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:receipt.status,reviewedRevisionCount:receipt.reviewedRevisionCount,output:path.basename(output)},null,2));
