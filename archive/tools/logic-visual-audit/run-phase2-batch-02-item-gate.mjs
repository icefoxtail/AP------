import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const denominator = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_batch_02_c_denominator_frozen.json'), 'utf8'));
const parity = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_batch_02_semantic_parity.json'), 'utf8'));
const adjudication = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_batch_02_requirement_adjudication.json'), 'utf8'));
const sourceByUid = new Map([
  ['archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|13', ['archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', 13, 'archive/assets/images/22_금당고_2학기_중간_고1_기출/q13-solution.svg']],
  ['archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|16', ['archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', 16, 'archive/assets/images/22_금당고_2학기_중간_고1_기출/q16-solution.svg']],
  ['archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|6', ['archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js', 6, 'archive/assets/images/22_매산고_2학기_중간_고1_기출/q06-solution.svg']]
]);
const parityByUid = new Map(parity.results.map((entry) => [entry.questionUid, entry]));
const actionByUid = new Map(adjudication.entries.map((entry) => [entry.questionUid, entry.visualAction]));
function question(relative, qid) { const context = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, relative.replaceAll('/', path.sep)), 'utf8'), context, { timeout: 5000 }); return context.window.questionBank.find((item) => Number(item.id) === qid); }
const results = [...sourceByUid.entries()].map(([uid, [source, qid, asset]]) => {
  const q = question(source, qid); const absolute = path.join(ROOT, asset.replaceAll('/', path.sep)); const svg = fs.readFileSync(absolute, 'utf8'); const staticIssues = [];
  if (!/<svg\b[^>]*\bviewBox=["'][^"']+["']/i.test(svg)) staticIssues.push('viewBoxMissing');
  if (!/<title\b[^>]*>[\s\S]*?<\/title>/i.test(svg)) staticIssues.push('titleMissing');
  if (!/<desc\b[^>]*>[\s\S]*?<\/desc>/i.test(svg)) staticIssues.push('descMissing');
  if (/<(script|foreignObject|iframe|object|embed)\b/i.test(svg)) staticIssues.push('unsafeSvgNode');
  if (!q.solutionImageAlt || q.solutionImageAlt.length < 20) staticIssues.push('specificAltMissing');
  if (!q.solutionImageCaption || q.solutionImageCaption.length < 20) staticIssues.push('specificCaptionMissing');
  const semantic = parityByUid.get(uid)?.semanticParity;
  const action = actionByUid.get(uid);
  return { questionUid: uid, visualAction: action, artifactAttached: Boolean(q.solutionImage && fs.existsSync(absolute)), semanticParity: semantic, staticIssues, logicVisualActionParity: action === 'KEEP_EXISTING' || action === 'REBUILD_EXISTING' ? 'PASS' : 'FAIL', logicVisualItemStatus: semantic === 'PASS' && staticIssues.length === 0 ? 'PASS' : 'FAIL', artifactSha: sha256(fs.readFileSync(absolute)) };
});
const required = denominator.logicVisualRequiredUidSet;
const targetUids = [...sourceByUid.keys()].sort();
const denominatorParity = denominator.status === 'FROZEN' && required.length === targetUids.length && required.every((uid) => targetUids.includes(uid)) && required.every((uid) => denominator.coreFinalCRequiredUidSet.includes(uid));
const output = { generatedAtKst: '2026-09-05', phase: 'LOGIC_VISUAL_PHASE_2_BATCH_02_ITEM_SEMANTIC_GATE', status: results.every((entry) => entry.logicVisualItemStatus === 'PASS') && denominatorParity ? 'PASS_TYPED_ITEM_SEMANTIC_GATE' : 'FAIL_TYPED_ITEM_SEMANTIC_GATE', scope: 'Pilot-scoped C semantic item gate only; D and qualification render remain separate.', denominatorStatus: denominator.status, denominatorParity, logicVisualItemPassCount: results.filter((entry) => entry.logicVisualItemStatus === 'PASS').length, logicVisualItemFailCount: results.filter((entry) => entry.logicVisualItemStatus === 'FAIL').length, qualificationRenderStatus: 'PENDING_BATCH_02_BROWSER_OBSERVATION', results, reportSha: sha256(results) };
fs.writeFileSync(path.join(OUT, 'phase2_batch_02_item_gate.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, passCount: output.logicVisualItemPassCount, failCount: output.logicVisualItemFailCount, denominatorParity: output.denominatorParity, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_ITEM_SEMANTIC_GATE') process.exitCode = 1;
