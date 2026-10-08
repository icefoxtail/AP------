import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {
  buildSourceReferenceAssignmentMetadata,
  decideSourceReferencePolicy,
  validateSourceReferenceAssignmentMetadata,
} from './archive-source-reference-policy.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const defect = overrides => ({category:'UNCLEAR_CONDITION',qids:[4],scope:'QID_ONLY',reason:'The extracted stem leaves the bound of x unspecified.',findings:[{qid:4,detail:'The final condition on x is absent from the current extracted item.'}],...overrides});

test('all downstream stages default to extracted JS and assets; PDF availability alone does not change policy', () => {
  for (const stage of ['CREATE','R1','R2','R3']) {
    const policy = decideSourceReferencePolicy({stage});
    assert.equal(policy.sourceInputMode,'EXTRACTED_JS_ASSETS');
    assert.equal(policy.pdfReviewMode,'DEFECT_ONLY');
    assert.equal(policy.sourceParityBasis,'EXTRACTED_INPUT_BASELINE');
    assert.equal(policy.pdfActuallyReviewed,false);
    assert.equal(policy.originalReferencePlan,null);
  }
  const withAvailablePdf = decideSourceReferencePolicy({stage:'CREATE',workerIssueCategory:'CALCULATION_ERROR'});
  assert.equal(withAvailablePdf.pdfActuallyReviewed,false);
  assert.equal(withAvailablePdf.originalReferencePlan,null);
  assert.doesNotThrow(() => decideSourceReferencePolicy({stage:'R2'})); // No PDF path is required for a complete JS/assets student packet.
});

test('a concrete source defect creates an exact-qid original-reference plan', () => {
  const policy = decideSourceReferencePolicy({stage:'R1',sourceDefect:defect()});
  assert.deepEqual(policy.originalReferencePlan.qids,[4]);
  assert.equal(policy.originalReferencePlan.scope,'QID_ONLY');
  assert.equal(policy.originalReferencePlan.required,true);
  assert.equal(policy.pdfActuallyReviewed,false);
  assert.equal(policy.semanticVerdictCreated,false);
  const missingAsset=decideSourceReferencePolicy({stage:'CREATE',sourceDefect:defect({category:'MISSING_ASSET',reason:'The extracted item references a missing diagram asset.',findings:[{qid:4,detail:'The referenced assets/images/figure.svg file is absent.'}]})});
  assert.equal(missingAsset.originalReferencePlan.required,true);
  assert.equal(missingAsset.originalReferencePlan.scope,'QID_ONLY');
  const brief = decideSourceReferencePolicy({stage:'R2',sourceDefect:defect({reason:'x',findings:[{qid:4,detail:'y'}]})});
  assert.equal(brief.originalReferencePlan.required,true);
});

test('ordinary answer, calculation, formatting, rendering, hash, and receipt failures do not escalate by themselves', () => {
  for (const workerIssueCategory of ['ANSWER_MISMATCH','CALCULATION_ERROR','TEX_FORMAT','SVG_SOLUTION_ERROR','RENDER_ERROR','HASH_ERROR','RECEIPT_ERROR']) {
    const policy = decideSourceReferencePolicy({stage:'R3',workerIssueCategory});
    assert.equal(policy.originalReferencePlan,null,workerIssueCategory);
    assert.equal(policy.pdfActuallyReviewed,false,workerIssueCategory);
  }
});

test('blank reasons, broad scope, silent parity overrides, and unsupported worker categories fail closed', () => {
  assert.throws(() => decideSourceReferencePolicy({stage:'R1',sourceDefect:defect({reason:' '})}),/SPECIFIC_REASON_REQUIRED/);
  assert.throws(() => decideSourceReferencePolicy({stage:'R1',sourceDefect:defect({scope:'FULL_PAPER'})}),/QID_ONLY|FULL_PAPER/);
  assert.throws(() => decideSourceReferencePolicy({stage:'R1',workerIssueCategory:'MYSTERY_FAILURE'}),/UNSUPPORTED_WORKER_FINDING_CATEGORY/);
  const metadata = buildSourceReferenceAssignmentMetadata({stage:'R1'});
  metadata.sourceReferencePolicy.sourceParityBasis = 'SOURCE_TEXT_EXACT_PARITY';
  assert.throws(() => validateSourceReferenceAssignmentMetadata(metadata,{stage:'R1'}),/DEFAULT_OR_HONESTY_MISMATCH|CONTENT_MISMATCH/);
  const injected = buildSourceReferenceAssignmentMetadata({stage:'R1'});
  injected.sourceReferencePolicy.sourceTextExactParity = true;
  assert.throws(() => validateSourceReferenceAssignmentMetadata(injected,{stage:'R1'}),/CONTENT_MISMATCH/);
});

test('actual original-source review evidence uses a verified physical SHA and exact reviewed qids', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'source-reference-policy-'));
  t.after(() => fs.rmSync(root,{recursive:true,force:true}));
  const original = path.join(root,'original-source.pdf'),pdfBytes=Buffer.from('%PDF-1.4 test fixture');
  fs.writeFileSync(original,pdfBytes);
  const evidenceFile=path.join(root,'review-evidence.json'),evidenceBytes=Buffer.from('{"reviewedQids":[4],"observation":"read by reviewer"}');
  fs.writeFileSync(evidenceFile,evidenceBytes);
  const evidence = {originalPdf:{path:original,sha256:sha(pdfBytes)},evidence:{path:evidenceFile,sha256:sha(evidenceBytes)},reviewedQids:[4],reviewerId:'reviewer-4',reviewedAt:'2026-10-09T03:00:00.000Z'};
  const policy = decideSourceReferencePolicy({stage:'CREATE',sourceDefect:defect(),originalSourceReviewEvidence:evidence});
  assert.equal(policy.pdfActuallyReviewed,true);
  assert.equal(policy.originalReferencePlan.required,false);
  assert.deepEqual(policy.originalSourceReviewEvidence.originalPdf,{path:original,sha256:sha(pdfBytes)});
  assert.deepEqual(policy.originalSourceReviewEvidence.evidence,{path:evidenceFile,sha256:sha(evidenceBytes)});
  assert.equal(policy.originalSourceReviewEvidence.physicalPdfSha256Verified,true);
  assert.equal(policy.originalSourceReviewEvidence.pdfByteInspection,'SHA256_ONLY');
  assert.equal(policy.originalSourceReviewEvidence.readingAttestationBasis,'REVIEWER_EVIDENCE');
  assert.deepEqual(policy.originalSourceReviewEvidence.reviewedQids,[4]);
  assert.throws(() => decideSourceReferencePolicy({stage:'CREATE',sourceDefect:defect(),originalSourceReviewEvidence:{...evidence,originalPdf:{...evidence.originalPdf,sha256:'0'.repeat(64)}}}),/SHA256_MISMATCH/);
  assert.throws(() => decideSourceReferencePolicy({stage:'CREATE',sourceDefect:defect(),originalSourceReviewEvidence:{path:evidenceFile,sha256:sha(evidenceBytes),reviewedQids:[4],reviewerId:'reviewer-4',reviewedAt:'2026-10-09T03:00:00.000Z'}}),/ORIGINAL_PDF_REQUIRED/);
  assert.throws(() => decideSourceReferencePolicy({stage:'CREATE',sourceDefect:defect(),originalSourceReviewEvidence:{...evidence,reviewedQids:[4,5]}}),/QID_SCOPE_MISMATCH/);
});

test('reused intake provenance is physical, hash-bound, and does not claim a PDF review', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'source-reference-intake-'));
  t.after(() => fs.rmSync(root,{recursive:true,force:true}));
  const file=path.join(root,'intake-evidence.json'),bytes=Buffer.from('{"source":"intake"}');fs.writeFileSync(file,bytes);
  const policy=decideSourceReferencePolicy({stage:'R2',reusedIntakeEvidence:{path:file,sha256:sha(bytes)}});
  assert.equal(policy.sourceParityBasis,'REUSED_INTAKE_EVIDENCE');
  assert.equal(policy.pdfActuallyReviewed,false);
  assert.throws(()=>decideSourceReferencePolicy({stage:'R2',reusedIntakeEvidence:{path:file,sha256:'f'.repeat(64)}}),/SHA256_MISMATCH/);
});

test('CLI emits the same default assignment metadata and rejects a broad or blank source defect', () => {
  const script = fileURLToPath(new URL('./archive-source-reference-policy.mjs',import.meta.url));
  const run = args => spawnSync(process.execPath,[script,...args],{encoding:'utf8'});
  const normal=run(['decide','--stage','R3']);
  assert.equal(normal.status,0,normal.stderr);
  const value=JSON.parse(normal.stdout);
  assert.equal(value.schemaVersion,'JS_ARCHIVE_CODEX_SOURCE_REFERENCE_ASSIGNMENT_V1');
  assert.equal(value.sourceReferencePolicy.sourceInputMode,'EXTRACTED_JS_ASSETS');
  assert.equal(value.sourceReferencePolicy.pdfActuallyReviewed,false);
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'source-reference-cli-'));
  try {
    const input=path.join(root,'defect.json');fs.writeFileSync(input,JSON.stringify(defect({reason:''})));
    const bad=run(['decide','--stage','R1','--source-defect',input]);
    assert.equal(bad.status,2);
    assert.match(bad.stderr,/SOURCE_DEFECT_SPECIFIC_REASON_REQUIRED/);
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
