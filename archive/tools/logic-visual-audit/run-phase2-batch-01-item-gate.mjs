import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateFact } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const OUT = path.join(TOOL, 'reports');
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const denominator = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_batch_01_c_denominator_frozen.json'), 'utf8'));
const typedParity = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_typed_semantic_parity.json'), 'utf8'));
const q14Parity = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_q14_typed_semantic_parity.json'), 'utf8'));
const adjudication = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_batch_01_requirement_adjudication.json'), 'utf8'));
const batch = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_pilot_repair_batch_01.json'), 'utf8'));
const parityByUid = new Map(typedParity.results.map((entry) => [entry.questionUid, entry]));
const q14Uid = 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|14';
const q17Uid = 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17';
const q20Uid = 'archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js|22_금당고_2학기_기말_고1_기출|20';
const targets = [q20Uid, q17Uid, q14Uid];
const artifactByUid = new Map(batch.results.map((entry) => [entry.questionUid, entry.solutionImage]));
const sourceByUid = new Map([
  [q20Uid, 'archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js'],
  [q17Uid, 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js'],
  [q14Uid, 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js']
]);
const actionByUid = new Map(adjudication.entries.map((entry) => [entry.questionUid, entry.visualAction]));

function loadQuestion(relative, qid) {
  const context = { window: {} };
  const absolute = path.join(ROOT, relative.replaceAll('/', path.sep));
  vm.runInNewContext(fs.readFileSync(absolute, 'utf8'), context, { timeout: 5000 });
  return context.window.questionBank.find((item) => Number(item.id) === qid);
}

const qidByUid = new Map([[q20Uid, 20], [q17Uid, 17], [q14Uid, 14]]);
const results = targets.map((uid) => {
  const question = loadQuestion(sourceByUid.get(uid), qidByUid.get(uid));
  const relativeAsset = artifactByUid.get(uid);
  const absoluteAsset = path.join(ROOT, 'archive', relativeAsset.replaceAll('/', path.sep));
  const svg = fs.readFileSync(absoluteAsset, 'utf8');
  const staticIssues = [];
  if (!/<svg\b[^>]*\bviewBox=["'][^"']+["']/i.test(svg)) staticIssues.push('viewBoxMissing');
  if (!/<title\b[^>]*>[\s\S]*?<\/title>/i.test(svg)) staticIssues.push('titleMissing');
  if (!/<desc\b[^>]*>[\s\S]*?<\/desc>/i.test(svg)) staticIssues.push('descMissing');
  if (/<(script|foreignObject|iframe|object|embed)\b/i.test(svg)) staticIssues.push('unsafeSvgNode');
  if (typeof question.solutionImageAlt !== 'string' || question.solutionImageAlt.length < 20) staticIssues.push('specificAltMissing');
  if (typeof question.solutionImageCaption !== 'string' || question.solutionImageCaption.length < 20) staticIssues.push('specificCaptionMissing');
  const parity = uid === q14Uid ? q14Parity.status : parityByUid.get(uid)?.semanticParity;
  const itemStatus = parity === 'PASS_TYPED_SEMANTIC_PARITY' || parity === 'PASS' ? (staticIssues.length ? 'FAIL' : 'PASS') : 'FAIL';
  return {
    questionUid: uid,
    visualAction: actionByUid.get(uid),
    artifactAttached: Boolean(question.solutionImage && fs.existsSync(absoluteAsset)),
    semanticParity: parity,
    staticIssues,
    logicVisualActionParity: question.solutionImage && fs.existsSync(absoluteAsset) && actionByUid.get(uid) === 'REBUILD_EXISTING' ? 'PASS' : 'FAIL',
    logicVisualItemStatus: itemStatus,
    artifactSha: sha256(fs.readFileSync(absoluteAsset))
  };
});
const denominatorParity = denominator.logicVisualRequiredUidSet.length === targets.length && targets.every((uid) => denominator.logicVisualRequiredUidSet.includes(uid)) && denominator.logicVisualRequiredUidSetSha === denominator.coreFinalCRequiredUidSetSha;
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_01_ITEM_SEMANTIC_GATE',
  status: results.every((entry) => entry.logicVisualItemStatus === 'PASS') && denominatorParity ? 'PASS_TYPED_ITEM_SEMANTIC_GATE' : 'FAIL_TYPED_ITEM_SEMANTIC_GATE',
  scope: 'Pilot-scoped C semantic item gate only; Common Core D and qualification render remain separate.',
  denominatorStatus: denominator.status,
  denominatorParity,
  logicVisualItemPassCount: results.filter((entry) => entry.logicVisualItemStatus === 'PASS').length,
  logicVisualItemFailCount: results.filter((entry) => entry.logicVisualItemStatus === 'FAIL').length,
  qualificationRenderStatus: 'NOT_TESTED_LOCAL_BROWSER_FILE_URL_BLOCKED',
  commonCoreDStatus: 'SEPARATE_AUTHORITY_NOT_TESTED',
  results,
  reportSha: sha256(results)
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_item_gate.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, itemPassCount: output.logicVisualItemPassCount, itemFailCount: output.logicVisualItemFailCount, denominatorParity: output.denominatorParity, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_ITEM_SEMANTIC_GATE') process.exitCode = 1;
