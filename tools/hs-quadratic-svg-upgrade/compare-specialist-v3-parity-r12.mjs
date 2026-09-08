import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '81_specialist_v1_expected_facts_r12.json'), 'utf8'));
const V2 = JSON.parse(fs.readFileSync(path.join(REPORT, '85_specialist_v2_artifact_only_r12.json'), 'utf8'));
const VISUALS = JSON.parse(fs.readFileSync(path.join(REPORT, '82_specialist_candidate_visual_manifest_r12.json'), 'utf8'));
const BANKS = JSON.parse(fs.readFileSync(path.join(REPORT, '83_specialist_candidate_bank_manifest_r12.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '88_specialist_v3_parity_r12.json');

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

function norm(value) {
  return String(value ?? '')
    .replace(/\\(?:d?frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\(?:d?frac)\s*(\d+)\s*(\d+)/g, '$1/$2')
    .replaceAll('\\', '')
    .replaceAll('$', '')
    .replaceAll('dfrac', '')
    .replaceAll('frac', '')
    .replace(/[{}]/g, '')
    .replaceAll('√', 'sqrt')
    .replaceAll('≤', 'le')
    .replaceAll('≥', 'ge')
    .replaceAll('＜', 'lt')
    .replaceAll('＞', 'gt')
    .replaceAll('−', '-')
    .replace(/\s+/g, '');
}

function has(haystack, needle) {
  return norm(haystack).includes(norm(needle));
}

function valueText(value) {
  if (typeof value === 'number' && !Number.isInteger(value)) return value.toFixed(5).replace(/0+$/, '').replace(/\.$/, '');
  return String(value);
}

function artifactAnchors(item) {
  const fact = item.expectedFacts;
  const anchors = [];
  for (const key of ['validParameter', 'count', 'result', 'maximum', 'minimum', 'sum', 'width', 'rootProduct', 'discriminant', 'boundary']) {
    if (fact[key] !== undefined) anchors.push(valueText(fact[key]));
  }
  if (fact.integerSolutionsAtValidParameter) anchors.push(...fact.integerSolutionsAtValidParameter.map(String));
  if (fact.integerSolutions) anchors.push(...fact.integerSolutions.map(String));
  if (fact.solutionInterval) anchors.push(...fact.solutionInterval.filter(value => value !== null).map(valueText));
  if (fact.cases) for (const row of fact.cases) anchors.push(String(row.id), String(row.verdict));
  if (fact.trueCases) anchors.push(...fact.trueCases.map(String));
  if (fact.vertex) anchors.push(`(${fact.vertex[0]},${fact.vertex[1]})`);
  if (fact.parameterCandidates) anchors.push(...fact.parameterCandidates.map(String));
  if (fact.exact) anchors.push(fact.exact);
  return [...new Set(anchors.filter(Boolean))];
}

function solutionAnchors(item) {
  const fact = item.expectedFacts;
  const anchors = [];
  for (const key of ['validParameter', 'count', 'result', 'maximum', 'minimum', 'sum', 'width', 'rootProduct', 'discriminant', 'boundary']) {
    if (fact[key] !== undefined) {
      const value = String(fact[key]);
      anchors.push(value.includes('=') ? value.split('=').at(-1) : value);
    }
  }
  if (fact.exact) anchors.push(fact.exact);
  if (fact.trueCases?.length) anchors.push(...fact.trueCases);
  return [...new Set(anchors.filter(Boolean))];
}

const v2ByUid = new Map(V2.rows.map(row => [row.questionUid, row]));
const visualByUid = new Map(VISUALS.rows.map(row => [row.questionUid, row]));
const candidateBySource = new Map(BANKS.candidateFiles.map(file => [file.sourcePath, file]));
const rows = [];

for (const item of FACTS.rows) {
  const observed = v2ByUid.get(item.questionUid);
  const visual = visualByUid.get(item.questionUid);
  if (!observed || !visual) throw new Error(`missing V2/visual ${item.questionUid}`);
  const candidateFile = candidateBySource.get(item.sourceJsPath);
  if (!candidateFile) throw new Error(`missing candidate bank ${item.sourceJsPath}`);
  const bank = load(candidateFile.candidatePath);
  const question = bank.questionBank.find(row => Number(row.id) === item.id);
  if (!question) throw new Error(`missing candidate question ${item.questionUid}`);

  const artifactAnchorList = artifactAnchors(item);
  const missingArtifactAnchors = artifactAnchorList.filter(anchor => !has(observed.observedText, anchor));
  const solutionAnchorList = solutionAnchors(item);
  const missingSolutionAnchors = solutionAnchorList.filter(anchor => !has(question.solution, anchor));
  const artifactHashParity = observed.artifactFactHash === visual.factSha256;
  const expectedType = item.expectedVisualType;
  const caseTypeParity = expectedType === 'case-table'
    ? observed.artifactVisualType === 'case-table'
    : expectedType === observed.artifactVisualType;
  const verdict = artifactHashParity
    && caseTypeParity
    && missingArtifactAnchors.length === 0
    && missingSolutionAnchors.length === 0
    && typeof question.answer === 'string'
    && String(question.solution ?? '').trim().length > 0
    ? 'PASS'
    : 'FAIL';
  rows.push({
    questionUid: item.questionUid,
    id: item.id,
    artifactHashParity,
    caseTypeParity,
    artifactAnchorCount: artifactAnchorList.length,
    missingArtifactAnchors,
    solutionAnchorCount: solutionAnchorList.length,
    missingSolutionAnchors,
    answer: question.answer,
    verdict,
    status: verdict === 'PASS' ? 'V3_PARITY_PASS' : 'V3_PARITY_FAIL'
  });
}

const failCount = rows.filter(row => row.verdict === 'FAIL').length;
const output = {
  schemaVersion: 'HS_QUADRATIC_SPECIALIST_V3_PARITY_R12',
  status: failCount ? 'V3_PARITY_FAIL' : 'V3_PARITY_RECORDED_NO_FINAL_PASS',
  productionAuthorized: false,
  inputVisibilityProfile: 'FROZEN_V1_V2_PLUS_CANDIDATE_SOLUTION',
  rows,
  passCount: rows.length - failCount,
  failCount,
  note: 'V3 compares the fresh r12 source-only facts, artifact-only observed labels, and candidate solution evidence for 18 rows. It is not provider-attested full-scope closure.'
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: rows.length, passCount: output.passCount, failCount: output.failCount }, null, 2));
