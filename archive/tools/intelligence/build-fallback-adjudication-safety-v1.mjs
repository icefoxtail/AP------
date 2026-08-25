import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const auditPath = path.join(archiveDir, '_generated/intelligence/phase3/fallback-safety-audit/archive-subunit-fallback-safety-audit-v1.json');
const adjudicationPath = path.join(archiveDir, '_generated/intelligence/phase3/fallback-adjudication/archive-subunit-fallback-manual-adjudication-v1.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/fallback-adjudication');
const outputPath = path.join(outputDir, 'archive-subunit-fallback-safety-effective-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function buildFallbackAdjudicationSafetyV1() {
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
  const reviewed = Number(adjudication.totals?.reviewedQuestions || 0);
  const baselineBlocked = Number(audit.totals?.blockedAssignments || 0);
  if (baselineBlocked !== 28 || reviewed !== baselineBlocked) throw new Error(`fallback adjudication is incomplete: ${baselineBlocked}/${reviewed}`);
  if (adjudication.gates?.fallbackAssignmentsResolved !== true) throw new Error('manual adjudication gate is not resolved');
  const entries = adjudication.review.map(row => ({
    questionUid: row.questionUid,
    sourceArchiveFile: row.sourceArchiveFile,
    sourceOrdinal: row.sourceOrdinal,
    standardUnitKey: row.standardUnitKey,
    adjudicatedSubUnitKey: row.adjudicated.subUnitKey,
    action: 'MANUAL_ADJUDICATED',
    productionWriteAllowed: true,
    rationale: row.rationale
  }));
  const stable = {
    schemaVersion: 'archive-subunit-fallback-safety-effective-v1',
    baselineAuditDigest: audit.digest,
    adjudicationDigest: adjudication.digest,
    status: 'SAFE_AFTER_MANUAL_ADJUDICATION',
    productionWriteAllowed: true,
    totals: {
      baselineBlockedAssignments: baselineBlocked,
      adjudicatedAssignments: reviewed,
      remainingBlockedAssignments: 0,
      sourceFiles: new Set(entries.map(entry => entry.sourceArchiveFile)).size
    },
    gates: {
      baselineAuditLoaded: true,
      allFallbackAssignmentsAdjudicated: reviewed === baselineBlocked,
      noRemainingBlockedAssignments: true,
      adjudicationProductionGates: adjudication.gates,
      effectiveSafetyResolved: true,
      commitOrPush: false
    },
    entries
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildFallbackAdjudicationSafetyV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, status: report.status, totals: report.totals, gates: report.gates }, null, 2));
}
