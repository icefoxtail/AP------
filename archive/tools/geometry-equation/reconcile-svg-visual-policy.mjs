import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const summaryPath = path.join(REPORTS, 'svg_build_summary_v22.json');
const facts = JSON.parse(fs.readFileSync(path.join(REPORTS, 'a_independent_solve_facts.json'), 'utf8'));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const factMap = new Map(facts.facts.map((fact) => [fact.questionUid, fact]));
const allowed = new Set(facts.facts.filter((fact) => fact.visualRequirement === 'VISUAL_REQUIRED' && fact.reasonCodes.includes('SOLUTION_VISUAL_MISSING') && !fact.reasonCodes.some((code) => /FAIL_PROBLEM|FAIL_ANSWER|SOURCE_|CHOICES_INCOMPLETE/.test(String(code)))).map((fact) => fact.questionUid));
const quarantineRoot = path.join(REPORTS, 'staging', '_quarantine', 'geometry-equation-visual-policy-excess');
const moved = [];
for (const asset of summary.generatedAssets) {
  if (allowed.has(asset.questionUid)) continue;
  const source = path.resolve(STAGING, asset.assetRef.replaceAll('/', path.sep));
  const root = path.resolve(STAGING, 'assets', 'images');
  if (!source.startsWith(`${root}${path.sep}`) || !fs.existsSync(source)) continue;
  const destination = path.resolve(quarantineRoot, asset.assetRef.replaceAll('/', path.sep));
  if (!destination.startsWith(`${quarantineRoot}${path.sep}`)) throw new Error(`Unsafe quarantine destination: ${destination}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.renameSync(source, destination);
  moved.push({ questionUid: asset.questionUid, assetRef: asset.assetRef, from: path.relative(ROOT, source).replaceAll('\\', '/'), to: path.relative(ROOT, destination).replaceAll('\\', '/'), sha256: crypto.createHash('sha256').update(fs.readFileSync(destination)).digest('hex'), reason: factMap.get(asset.questionUid)?.visualRequirement || 'NOT_SELECTED_BY_A' });
}
const result = { status: 'EXCESS_VISUALS_QUARANTINED', previousGeneratedCount: summary.generatedCount, allowedRequiredCount: allowed.size, movedCount: moved.length, moved };
fs.writeFileSync(path.join(REPORTS, 'svg_visual_policy_reconciliation.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, previousGeneratedCount: result.previousGeneratedCount, allowedRequiredCount: result.allowedRequiredCount, movedCount: result.movedCount }, null, 2));
