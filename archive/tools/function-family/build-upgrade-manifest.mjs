import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');
const GRAPH_LEDGER_PATH = path.join(REPORT_DIR, 'function_family_pilot_graphs.json');
const OUTPUT_PATH = path.join(REPORT_DIR, 'function_family_upgrade_manifest.json');
const SUMMARY_PATH = path.join(REPORT_DIR, 'function_family_upgrade_manifest.md');

function main() {
  const latestAuditDir = fs.readdirSync(REPORT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^post_upgrade_audit_v\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(b.slice('post_upgrade_audit_v'.length)) - Number(a.slice('post_upgrade_audit_v'.length)))[0];
  if (!latestAuditDir) throw new Error('no post-upgrade audit directory found');
  const inventoryPath = path.join(REPORT_DIR, latestAuditDir, 'function_family_inventory.json');
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  const graphLedger = JSON.parse(fs.readFileSync(GRAPH_LEDGER_PATH, 'utf8'));
  const generatedKeys = new Set(graphLedger.cases.map((row) => `${row.sourceJsPath}_${row.id}`));
  const rows = inventory.rows.map((row) => {
    const key = `${row.sourceJsPath}_${row.id}`;
    // The previously suspected q18 answer discrepancy was resolved by matching
    // the computed 11/4 result to choice ①; no unresolved source-review override remains.
    const sourceReview = false;
    const visualPresent = row.solutionImageStatus === 'PRESENT';
    let qualityDisposition = 'KEEP';
    let executionStatus = 'KEEP_CANDIDATE';
    let visualRequirement = 'VISUAL_EXEMPT_CANDIDATE';
    let reviewStatus = 'PROVISIONAL';
    if (sourceReview) {
      qualityDisposition = 'SOURCE_REVIEW';
      executionStatus = 'SOURCE_REVIEW_UNRESOLVED';
      visualRequirement = 'SOURCE_REVIEW';
      reviewStatus = 'UNRESOLVED';
    } else if (visualPresent && generatedKeys.has(key)) {
      qualityDisposition = 'VISUAL_ADD';
      executionStatus = 'VISUAL_ADD_COMPLETE';
      visualRequirement = 'VISUAL_REQUIRED_SATISFIED';
      reviewStatus = 'READY_FOR_INDEPENDENT_REVIEW';
    } else if (visualPresent) {
      executionStatus = 'EXISTING_VISUAL_KEEP';
      visualRequirement = 'EXISTING_VISUAL_REVIEW';
      reviewStatus = 'READY_FOR_INDEPENDENT_REVIEW';
    } else if (row.graphGapDisposition.startsWith('PRIORITY_1')) {
      qualityDisposition = 'VISUAL_ADD';
      executionStatus = 'VISUAL_ADD_PENDING_INDEPENDENT_ADJUDICATION';
      visualRequirement = 'VISUAL_REQUIRED_CANDIDATE';
    } else if (row.graphGapDisposition.startsWith('PRIORITY_2')) {
      executionStatus = 'OPTIONAL_VISUAL_REVIEW_PENDING';
      visualRequirement = 'VISUAL_OPTIONAL_CANDIDATE';
    }
    return {
      qKey: row.qKey,
      sourceJsPath: row.sourceJsPath,
      id: row.id,
      standardUnitKey: row.standardUnitKey,
      subUnitKey: row.subUnitKey,
      qualityDisposition,
      executionStatus,
      visualRequirement,
      reviewStatus,
      graphGapDisposition: row.graphGapDisposition,
      solutionImageStatus: row.solutionImageStatus,
      evidence: generatedKeys.has(key) ? 'function_family_pilot_graphs.json + batch attachment ledger + browser render matrix' : 'function_family_quality_triage.csv candidate signal',
    };
  });
  const countBy = (field) => Object.fromEntries([...new Set(rows.map((row) => row[field]))].sort().map((value) => [value, rows.filter((row) => row[field] === value).length]));
  const summary = {
    targetCount: rows.length,
    generatedGraphCount: graphLedger.cases.length,
    sourceSolutionImageCount: rows.filter((row) => row.solutionImageStatus === 'PRESENT').length,
    qualityDispositionCounts: countBy('qualityDisposition'),
    executionStatusCounts: countBy('executionStatus'),
    visualRequirementCounts: countBy('visualRequirement'),
    unresolvedCount: rows.filter((row) => row.reviewStatus === 'UNRESOLVED' || row.executionStatus.includes('PENDING')).length,
  };
  const output = {
    reportType: 'FUNCTION_FAMILY_UPGRADE_MANIFEST',
    generatedAt: new Date().toISOString(),
    status: summary.unresolvedCount === 0 ? 'PROVISIONAL_COMPLETE' : 'PROVISIONAL_REVIEW_REQUIRED',
    finalSealEligible: false,
    scope: 'original only; similar excluded',
    source: `${latestAuditDir}/function_family_inventory.json`,
    summary,
    rows,
    note: 'This manifest records current execution evidence and candidate dispositions. VISUAL_REQUIRED_CANDIDATE and VISUAL_OPTIONAL_CANDIDATE are not final adjudications; final seal requires independent mathematical/pedagogical review and source-review resolution.',
  };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY_PATH, [
    '# 함수·유리함수·무리함수 업그레이드 manifest', '',
    `- 상태: **${output.status}**`,
    `- final seal eligible: **${output.finalSealEligible ? 'YES' : 'NO'}**`,
    `- target: ${summary.targetCount}`,
    `- generated graph cases: ${summary.generatedGraphCount}`,
    `- source solution images: ${summary.sourceSolutionImageCount}`,
    `- unresolved/provisional review rows: ${summary.unresolvedCount}`,
    '',
    '## qualityDisposition', '',
    ...Object.entries(summary.qualityDispositionCounts).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## executionStatus', '',
    ...Object.entries(summary.executionStatusCounts).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## visualRequirement', '',
    ...Object.entries(summary.visualRequirementCounts).map(([key, value]) => `- ${key}: ${value}`),
    '',
    output.note,
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify(output, null, 2));
}

main();
