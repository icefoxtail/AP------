import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {adjudicateSequentialBatch00718611880V1} from '../archive/tools/intelligence/adjudicate-sequential-batch-007-1861-1880-v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const outputPath=path.join(here,'..','archive','_generated','intelligence','phase3','sequential-review','archive-sequential-batch-007-1861-1880-adjudication-v1.json');
const saved=JSON.parse(fs.readFileSync(outputPath,'utf8'));
const report=adjudicateSequentialBatch00718611880V1();
if(report.digest!==saved.digest) throw new Error(`digest mismatch ${report.digest} !== ${saved.digest}`);
if(report.totals.records!==20||report.totals.answerRecheckConfirmed!==19||report.totals.wordingReviewRequired!==1) throw new Error(`unexpected totals ${JSON.stringify(report.totals)}`);
if(report.totals.status.ANSWER_SOURCE_DEFECT_HOLD!==1||report.records[0].sequenceOrder!==1861||report.records.at(-1).sequenceOrder!==1880) throw new Error('sequence/status mismatch');
if(report.records.find(r=>r.sequenceOrder===1878)?.candidateSubUnitKey!=='H15-SA-11-CIRCLE_EQUATION') throw new Error('1878 defect record mismatch');
console.log(JSON.stringify({ok:true,digest:report.digest,totals:report.totals},null,2));
