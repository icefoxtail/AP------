import fs from 'node:fs';
import crypto from 'node:crypto';
import { gitBlobSha } from '../../../tools/archive-stage-validator.mjs';
const root=process.cwd();
const packet='archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX';
const js='archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const asset='archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution.svg';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const entry=p=>{const b=fs.readFileSync(p);return {path:p,absolutePath:new URL(p,'file:///'+root.replaceAll('\\','/')+'/').pathname,bytes:b.length,sha256:digest(b),gitBlobSha:gitBlobSha(b)}};
const evidence={
  schemaVersion:'ARCHIVE_ITEM_RECOVERY_CONTAMINATED_ATTEMPT_TRACE_V1',
  examUid:'24_매산여고_1학기_중간_고2_수학I',qid:21,stage:'ITEM_RECOVERY',executionLine:'CODEX',
  status:'FAILED_CONTAMINATED_SESSION_RESTORED',
  contamination:{
    cause:'The first full current-JS read printed q21.itemHoldReason before the independent source-sufficiency decision was persisted.',
    exactExposedField:'q21.itemHoldReason in the current source JS',
    exactExposedText:'The original source only states that f has a maximum 5 at x=1 and a minimum −1 at x=3 on [0,4], and period 4. It does not state that these extrema locations are unique or provide a graph. For an arbitrary period-4 function, tied extrema can give multiple maximizing/minimizing x values for h on [5,9], so a and c (and ad+bc) are not uniquely determined. Scoped PDF page 6 q21 visual check (PDF SHA 5332ac375ccd364e2d0eaea7d23d3967412dff7dae2bca8aff254eb6534b98f8) confirmed exact parity and no omitted uniqueness clause/figure; do not add an assumption absent from source.',
    separateReviewerReportsOpened:false,
    decisionOrder:'FAILED_CONTAMINATED; fresh clean session required'
  },
  sourceArtifact:{before:entry(packet+'/current-js-before.js'),failedAuthoredAttempt:entry(packet+'/FAILED_ATTEMPT.q21-authored.js'),restoredCurrent:entry(js),restorationExactParity:true},
  solutionAsset:{
    beforeExpectedSha256:'c0c2dd8bdba0d8cf7f5a7f5b533a9e606fb69dc4a23c85c9c433a142cf7fcd48',
    beforeBytes:1627,
    expectedBoundBy:['CREATE archive-stage receipt','R1 asset receipt','R2 asset receipt','R3 asset receipt'],
    reconstructedFrom:'archive/analysis/24_매산여고_1학기_중간_고2_수학I/CREATE_20261010_CODEX/CREATE.make-visuals.mjs q21 wrapper and make[21] payload',
    failedAuthoredAttempt:entry(packet+'/FAILED_ATTEMPT.q21-authored-solution.svg'),
    restoredCurrent:entry(asset),
    restoredCopy:entry(packet+'/RESTORED.q21-solution.svg'),
    exactExpectedShaParity:true
  },
  preflight:{
    command:'node archive/tools/solution-calibration-gate.mjs --exam <pre-edit snapshot> --evidence <ITEM_RECOVERY.solution-calibration.preflight.json> --stage ITEM_RECOVERY --preflight',
    observedCliReport:JSON.parse(fs.readFileSync(packet+'/ITEM_RECOVERY.solution-calibration.preflight.report.json','utf8')),
    reportPath:packet+'/ITEM_RECOVERY.solution-calibration.preflight.report.json',
    reuseDisposition:'DO_NOT_CLAIM_OR_REUSE_FOR_FRESH_SESSION; contaminated session'
  },
  authoringDisposition:{
    q21WasTemporarilyEdited:true,
    candidateAndPreviewPreserved:true,
    finalQuestionAuthoringStatus:'NOT_CLOSED; fresh ITEM_RECOVERY required',
    r1Refresh:'NOT_RUN',r2Refresh:'NOT_RUN',r3Refresh:'NOT_RUN',
    rootNextAction:'Dispatch fresh clean q21 ITEM_RECOVERY using restored current artifact SHA; do not carry upstream hold rationale into that worker packet.'
  }
};
fs.writeFileSync(packet+'/ITEM_RECOVERY.contaminated-attempt.trace.json',JSON.stringify(evidence,null,2)+'\\n');
console.log(JSON.stringify({tracePath:packet+'/ITEM_RECOVERY.contaminated-attempt.trace.json',js:evidence.sourceArtifact.restoredCurrent,asset:evidence.solutionAsset.restoredCurrent},null,2));
