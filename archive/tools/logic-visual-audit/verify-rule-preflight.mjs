import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { sha256, canonicalJson } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const RULES = path.join(ROOT, 'docs', 'rules');
const REPORT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const required = [
  ['docs/rules/00_RULES_INDEX.md', 'RULE_INDEX', 0],
  ['docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md', 'CANONICAL', 1],
  ['docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md', 'COMMON_CORE', 2],
  ['docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md', 'PIPELINE_EXECUTION_CONTRACT', 3],
  ['docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md', 'ADAPTIVE_BATCH', 4],
  ['docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md', 'MATH_VERIFICATION', 5],
  ['docs/rules/04_VISUAL/도형추출.md', 'COMMON_VISUAL', 6],
  ['docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md', 'EQUATION_SVG_REVIEW', 7],
  ['docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md', 'UNIT_OVERLAY_CANDIDATE', 8],
  ['docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md', 'CURRICULUM_MASTER', 9]
];
const declaredVersions = new Map([
  ['RULE_INDEX', 'INDEX'], ['CANONICAL', 'v2.6'], ['COMMON_CORE', 'v1.2.10'],
  ['PIPELINE_EXECUTION_CONTRACT', 'v1'], ['ADAPTIVE_BATCH', 'v1'], ['MATH_VERIFICATION', 'v2.1'],
  ['COMMON_VISUAL', 'v3.0'], ['EQUATION_SVG_REVIEW', 'v1.1'], ['UNIT_OVERLAY_CANDIDATE', 'v1.4'], ['CURRICULUM_MASTER', 'MASTER']
]);
const manifest = fs.readFileSync(path.join(RULES, 'MANIFEST.md'), 'utf8');
const records = required.map(([relativePath, role, precedenceOrder]) => {
  const absolute = path.join(ROOT, relativePath.replaceAll('/', path.sep));
  const exists = fs.existsSync(absolute);
  const bytes = exists ? fs.statSync(absolute).size : 0;
  const digest = exists ? crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex') : '';
  const manifestPath = relativePath.replace(/^docs\/rules\//, '');
  const line = manifest.split(/\r?\n/).find((item) => item.startsWith(`- ${manifestPath} |`));
  const declared = line?.match(/- (.+?) \| (\d+) bytes \| sha256 ([0-9a-f]+)/i);
  const declaredBytes = declared ? Number(declared[2]) : null;
  const declaredSha = declared?.[3] || null;
  return { path: relativePath, declaredVersion: declaredVersions.get(role) ?? null, actualBytes: bytes, sha256: `sha256:${digest}`, role, precedenceOrder, exists, manifestEntry: Boolean(line), manifestBytes: declaredBytes, manifestSha256: declaredSha ? `sha256:${declaredSha}` : null, pass: exists && Boolean(line) && bytes === declaredBytes && digest === declaredSha };
});
const failures = records.filter((record) => !record.pass).map((record) => record.path);
const result = { generatedAtKst: '2026-09-05', ruleStatus: 'CANDIDATE_QUALIFICATION_ONLY', canonicalForProduction: false, qualificationUseOnly: true, rules: records, ruleRoutingBundleSha: sha256(records.map(({ path: p, declaredVersion, actualBytes, sha256: digest, role, precedenceOrder }) => ({ path: p, declaredVersion, actualBytes, sha256: digest, role, precedenceOrder }))), status: failures.length ? 'RULE_ROUTING_BLOCKED' : 'PASS', failures };
fs.mkdirSync(REPORT, { recursive: true });
fs.writeFileSync(path.join(REPORT, 'rule_preflight.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, failures, ruleRoutingBundleSha: result.ruleRoutingBundleSha }, null, 2));
if (failures.length) process.exitCode = 1;
