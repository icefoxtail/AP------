import fs from 'node:fs';
import path from 'node:path';
import { fileSha256, sha256 } from './io.mjs';

export const RULE_PATHS = [
  ['docs/rules/00_RULES_INDEX.md', 'RULE_INDEX'],
  ['docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md', 'CANONICAL_RULEBOOK'],
  ['docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md', 'COMMON_CORE'],
  ['docs/rules/04_VISUAL/도형추출.md', 'COMMON_VISUAL'],
  ['docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md', 'LOGIC_VISUAL_OVERLAY'],
  ['docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md', 'CURRICULUM_MASTER'],
  ['docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md', 'CURRICULUM_SUBUNIT']
];

export function buildRuleEvidence(repoRoot) {
  return RULE_PATHS.map(([relativePath, role], index) => {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`RULE_ROUTING_BLOCKED: missing ${relativePath}`);
    const bytes = fs.statSync(absolutePath).size;
    return { path: relativePath, declaredVersion: declaredVersion(relativePath, fs.readFileSync(absolutePath, 'utf8')), actualBytes: bytes, sha256: fileSha256(absolutePath), role, precedenceOrder: index + 1 };
  });
}

export function parseManifest(manifestText) {
  const entries = new Map();
  for (const line of manifestText.split(/\r?\n/)) {
    const match = line.match(/^- (.+?) \| (\d+) bytes \| sha256 ([a-f0-9]{64})$/);
    if (match) entries.set(match[1], { bytes: Number(match[2]), sha256: match[3] });
  }
  return entries;
}

export function verifyManifest(repoRoot, evidence) {
  const manifestPath = path.join(repoRoot, 'docs/rules/MANIFEST.md');
  const manifest = parseManifest(fs.readFileSync(manifestPath, 'utf8'));
  const failures = [];
  for (const item of evidence) {
    const manifestKey = item.path.replace(/^docs\/rules\//, '');
    const entry = manifest.get(manifestKey);
    if (!entry) failures.push(`${item.path}: manifest entry missing`);
    else {
      if (entry.bytes !== item.actualBytes) failures.push(`${item.path}: byte drift ${entry.bytes} != ${item.actualBytes}`);
      if (entry.sha256 !== item.sha256) failures.push(`${item.path}: hash drift ${entry.sha256} != ${item.sha256}`);
    }
  }
  return { ok: failures.length === 0, failures, manifestEntries: evidence.map((item) => manifest.get(item.path) ?? null) };
}

export function ruleRoutingBundleSha(evidence) {
  return sha256(evidence);
}

function declaredVersion(relativePath, contents) {
  if (relativePath.includes('COMMON_PROTOCOL_v1.2.10')) return 'v1.2.10';
  if (relativePath.includes('도형추출')) return contents.match(/v(\d+\.\d+)/)?.[0] ?? 'v3.0';
  if (relativePath.includes('Semantic_Overlay_v1.4')) return 'v1.4';
  if (relativePath.includes('룰북_v2.6')) return 'v2.6';
  if (relativePath.includes('세부단원_운영규칙_v1')) return 'v1';
  if (relativePath.includes('마스터테이블')) return 'compiled-master';
  return 'index';
}
