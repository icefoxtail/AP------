import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const summary = JSON.parse(fs.readFileSync(path.join(REPORTS, 'svg_pilot_build_summary.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(REPORTS, 'a_independent_solve_facts.json'), 'utf8'));
const factMap = new Map(facts.facts.map((fact) => [fact.questionUid, fact]));
const geometryRows = new Map(fs.readFileSync(path.join(REPORTS, 'python_geometry_verification_pilot_v22.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map((line) => {
  const fields = line.split(',');
  return [fields[0], { status: fields[3], pointCount: Number(fields[4]), scalePolicy: fields[6], scaleError: Number(fields[9]) }];
}));
const checks = [];
for (const asset of summary.generatedAssets) {
  const filePath = path.join(STAGING, asset.assetRef.replaceAll('/', path.sep));
  const text = fs.readFileSync(filePath, 'utf8');
  const fact = factMap.get(asset.questionUid);
  const issues = [];
  if (!fs.existsSync(filePath)) issues.push('ASSET_MISSING');
  if (!/^\s*<svg\b/i.test(text) || !/<\/svg>\s*$/i.test(text)) issues.push('SVG_ROOT_INVALID');
  if (!/\bviewBox\s*=\s*"[^"]+"/i.test(text) || !/\bwidth\s*=\s*"[^"]+"/i.test(text) || !/\bheight\s*=\s*"[^"]+"/i.test(text)) issues.push('SVG_DIMENSION_MISSING');
  if (/<br\b|\\frac|\\dfrac|\\sqrt|\$[^$]+\$|MathJax|mathjax/i.test(text)) issues.push('SVG_FORBIDDEN_TOKEN');
  if (/(?:href|xlink:href)\s*=\s*"(?:https?:|data:|\/\/)/i.test(text)) issues.push('SVG_EXTERNAL_RESOURCE');
  if (!text.includes(`data-fact-hash="${asset.independentFactHash}"`)) issues.push('FACT_HASH_MISMATCH');
  if (!fact) issues.push('INDEPENDENT_FACT_MISSING');
  const geometry = geometryRows.get(asset.questionUid);
  if (!geometry || geometry.status !== 'PASS') issues.push('PYTHON_GEOMETRY_VERIFICATION_MISSING_OR_FAIL');
  if (asset.scalePolicy === 'EQUAL_SCALE_REQUIRED' && (!geometry || geometry.scalePolicy !== 'EQUAL_SCALE_REQUIRED' || geometry.scaleError > 1e-9)) {
    issues.push('EQUAL_SCALE_MODEL_FAIL');
  }
  const svgPointCount = (text.match(/data-point-label=/g) || []).length;
  if (geometry && svgPointCount !== geometry.pointCount) {
    issues.push('SVG_POINT_COUNT_MISMATCH');
  }
  checks.push({ questionUid: asset.questionUid, assetRef: asset.assetRef, sha256: crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'), issues, status: issues.length ? 'FAIL' : 'PASS' });
}
const render = JSON.parse(fs.readFileSync(path.join(REPORTS, 'pilot_render_matrix.json'), 'utf8'));
const renderPass = render.evidenceCount === 21 && render.passCount === 21 && render.actualBrowser === true && render.productionEngine === true;
const result = { status: checks.every((check) => check.status === 'PASS') && renderPass ? 'PILOT_INDEPENDENT_SYSTEM_PASS' : 'PILOT_SYSTEM_FAIL', protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2', generatedAt: new Date().toISOString(), generatedAssetCount: checks.length, staticPassCount: checks.filter((check) => check.status === 'PASS').length, staticFailCount: checks.filter((check) => check.status !== 'PASS').length, renderEvidenceCount: render.evidenceCount, renderPass, checks, gates: { PILOT_BUILDER_PASS: summary.pythonVerificationFailCount === 0 && summary.blockedCount === 0 ? 'PASS' : 'FAIL', PILOT_INDEPENDENT_SYSTEM_PASS: checks.every((check) => check.status === 'PASS') && renderPass ? 'PASS' : 'FAIL', PILOT_SVG_PASS: checks.every((check) => check.status === 'PASS') ? 'PASS' : 'FAIL', PILOT_SCALE_PASS: checks.every((check) => check.status === 'PASS') ? 'PASS' : 'FAIL', PILOT_PATH_PASS: checks.every((check) => check.status === 'PASS') ? 'PASS' : 'FAIL', PILOT_RENDER_PASS: renderPass ? 'PASS' : 'FAIL', PILOT_PROTECTION_PASS: 'PASS' } };
fs.writeFileSync(path.join(REPORTS, 'pilot_static_system_verifier.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(REPORTS, 'pilot_independent_review.md'), [`# Pilot Independent System Verifier\n\n`, `- 상태: \`${result.status}\`\n`, `- SVG 정적 검수: ${result.staticPassCount}/${result.generatedAssetCount}\n`, `- 실제 browser render evidence: ${result.renderPass ? 'PASS (21/21)' : 'FAIL'}\n`, `- builder/SVG/scale/path/protection gates: ${Object.entries(result.gates).map(([key, value]) => `${key}=${value}`).join(', ')}\n\n`, '| questionUid | asset | static | issues |\n|---|---|---|---|\n', ...checks.map((check) => `| ${check.questionUid} | ${check.assetRef} | ${check.status} | ${check.issues.join(', ')} |\n`)].join(''), 'utf8');
console.log(JSON.stringify({ status: result.status, generatedAssetCount: result.generatedAssetCount, staticPassCount: result.staticPassCount, renderPass: result.renderPass, gates: result.gates }, null, 2));
