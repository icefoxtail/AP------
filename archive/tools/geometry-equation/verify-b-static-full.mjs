import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(REPORTS, process.env.GEOMETRY_FACTS_FILE || 'a_independent_solve_facts_S6.json'), 'utf8'));
const build = JSON.parse(fs.readFileSync(path.join(REPORTS, process.env.GEOMETRY_SVG_SUMMARY || 'svg_build_summary_v22.json'), 'utf8'));
const generated = new Map(build.generatedAssets.map((asset) => [asset.questionUid, asset]));
const factMap = new Map(facts.facts.map((fact) => [fact.questionUid, fact]));
const geometryLines = fs.readFileSync(path.join(REPORTS, process.env.GEOMETRY_GEOMETRY_VERIFICATION || 'python_geometry_verification_v22.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
const geometry = new Map(geometryLines.map((line) => { const fields = line.split(','); return [fields[0], { status: fields[3], pointCount: Number(fields[4]), scalePolicy: fields[6], scaleError: Number(fields[9]) }]; }));
const blockedCode = (code) => /FAIL_PROBLEM|FAIL_ANSWER|SOURCE_|CHOICES_INCOMPLETE/.test(String(code));
const checks = [];
const cache = new Map();
for (const row of manifest.rows) {
  const fact = factMap.get(row.questionUid);
  const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  if (!cache.has(row.sourceJsPath)) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 4000 }); cache.set(row.sourceJsPath, context.window.questionBank || []); }
  const question = cache.get(row.sourceJsPath).find((candidate) => candidate.id === row.id);
  const codes = fact?.reasonCodes || [];
  const sourceBlocked = codes.some(blockedCode);
  const needsVisual = fact?.visualRequirement === 'VISUAL_REQUIRED';
  const ref = question?.solutionImage || '';
  const assetPath = ref ? path.join(STAGING, ref.replaceAll('/', path.sep)) : null;
  const issues = [];
  if (!question) issues.push('QUESTION_MISSING');
  if (sourceBlocked) { checks.push({ questionUid: row.questionUid, status: 'SOURCE_BLOCKED', reasonCodes: codes, visualRequirement: fact?.visualRequirement || null, solutionImageRef: question?.solutionImage || '', generated: Boolean(generated.get(row.questionUid)), issues: ['SOURCE_BLOCKED'] }); continue; }
  if (needsVisual && !ref) issues.push('VISUAL_REQUIRED_ASSET_REFERENCE_MISSING');
  if (ref && (!assetPath || !fs.existsSync(assetPath))) issues.push('ASSET_MISSING');
  let assetText = '';
  if (assetPath && fs.existsSync(assetPath)) assetText = fs.readFileSync(assetPath, 'utf8');
  if (assetText && (!/^\s*<svg\b/i.test(assetText) || !/<\/svg>\s*$/i.test(assetText))) issues.push('SVG_ROOT_INVALID');
  if (assetText && (!/\bviewBox\s*=\s*"[^"]+"/i.test(assetText) || !/\bwidth\s*=\s*"[^"]+"/i.test(assetText) || !/\bheight\s*=\s*"[^"]+"/i.test(assetText))) issues.push('SVG_DIMENSION_MISSING');
  if (assetText && /<br\b|\\frac|\\dfrac|\\sqrt|\$[^$]+\$|MathJax|mathjax/i.test(assetText)) issues.push('SVG_FORBIDDEN_TOKEN');
  if (assetText && /(?:href|xlink:href)\s*=\s*"(?:https?:|data:|\/\/)/i.test(assetText)) issues.push('SVG_EXTERNAL_RESOURCE');
  const pointCoordinateCount = assetText ? (assetText.match(/data-point-x="/g) || []).length : 0;
  const pointProvenanceCount = assetText ? (assetText.match(/data-point-provenance="/g) || []).length : 0;
  if (pointCoordinateCount !== pointProvenanceCount) issues.push('SEMANTIC_POINT_PROVENANCE_FAIL');
  const generatedAsset = generated.get(row.questionUid);
  const geom = geometry.get(row.questionUid);
  if (generatedAsset) {
    if (!assetText.includes(`data-fact-hash="${generatedAsset.independentFactHash}"`)) issues.push('FACT_HASH_MISMATCH');
    if (!geom || geom.status !== 'PASS') issues.push('PYTHON_GEOMETRY_FAIL_OR_MISSING');
    if (geom && geom.scalePolicy === 'EQUAL_SCALE_REQUIRED' && geom.scaleError > 1e-9) issues.push('EQUAL_SCALE_MODEL_FAIL');
    // The generic generator reports pointCount, but reviewed semantic SVGs
    // intentionally add labels to curves/regions/transform diagrams even
    // when the independent facts contain no extractable coordinate points.
    // Apply the point-count invariant only to the generic point-plane output.
    if (generatedAsset.visualKind === 'independent_fact_plane' && geom && (assetText.match(/data-point-label=/g) || []).length !== geom.pointCount) issues.push('POINT_COUNT_MISMATCH');
  }
  const status = issues.length ? 'FAIL' : ref ? (generatedAsset ? 'PASS_GENERATED_STATIC' : 'PASS_LEGACY_STATIC_ONLY') : needsVisual ? 'FAIL' : 'PASS_NO_VISUAL_REQUIRED';
  checks.push({ questionUid: row.questionUid, status, visualRequirement: fact?.visualRequirement || null, solutionImageRef: ref, assetSha256: assetText ? crypto.createHash('sha256').update(assetText).digest('hex') : null, generated: Boolean(generatedAsset), issues, reasonCodes: codes });
}
const result = { reportType: 'independent_B_static_full_audit', protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2', generatedAt: new Date().toISOString(), manifestSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'))).digest('hex'), releaseArtifactSha: JSON.parse(fs.readFileSync(path.join(REPORTS, 'current_release_artifact.json'), 'utf8')).releaseArtifactSha, coverage: { expected: manifest.rows.length, observed: checks.length }, summary: { passGenerated: checks.filter((check) => check.status === 'PASS_GENERATED_STATIC').length, passLegacyStaticOnly: checks.filter((check) => check.status === 'PASS_LEGACY_STATIC_ONLY').length, passNoVisualRequired: checks.filter((check) => check.status === 'PASS_NO_VISUAL_REQUIRED').length, sourceBlocked: checks.filter((check) => check.status === 'SOURCE_BLOCKED').length, fail: checks.filter((check) => check.status === 'FAIL').length, notTested: 0 }, checks };
fs.writeFileSync(path.join(REPORTS, 'b_static_full_audit.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(REPORTS, 'b_static_full_audit.md'), [`# B 정적 full audit\n\n- 상태: \`${result.summary.fail || result.summary.sourceBlocked ? 'REPAIR_REQUIRED' : 'PASS'}\`\n- coverage: ${result.coverage.observed}/${result.coverage.expected}\n- generated SVG static PASS: ${result.summary.passGenerated}\n- legacy SVG static-only PASS: ${result.summary.passLegacyStaticOnly}\n- no visual required: ${result.summary.passNoVisualRequired}\n- source blocked: ${result.summary.sourceBlocked}\n- fail: ${result.summary.fail}\n\n`, '| UID | status | visual | asset | generated | issues |\n|---|---|---|---|---|---|\n', ...checks.map((check) => `| ${check.questionUid} | ${check.status} | ${check.visualRequirement || ''} | ${check.solutionImageRef || ''} | ${check.generated} | ${check.issues.join(', ')} |\n`)].join(''), 'utf8');
console.log(JSON.stringify({ status: result.summary.fail || result.summary.sourceBlocked ? 'REPAIR_REQUIRED' : 'PASS', coverage: result.coverage, summary: result.summary }, null, 2));
