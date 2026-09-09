import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';
import vm from 'node:vm';

const root = process.cwd();
const reportDir = path.join(root, 'reports', 'h2-s1-algebra-visual-upgrade');
const rel = value => String(value).replaceAll('\\', '/');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const exists = file => Boolean(file && fs.existsSync(path.join(root, rel(file))));
const rawSha = file => `sha256:${crypto.createHash('sha256').update(fs.readFileSync(path.join(root, rel(file)))).digest('hex')}`;
const git = (...args) => childProcess.execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

const inventory = readJson('reports/h2-s1-algebra-visual-upgrade/inventory.json');
const triage = readJson('reports/h2-s1-algebra-visual-upgrade/visual_triage.json');
const manifest = readJson('reports/h2-s1-algebra-visual-upgrade/candidate_manifest.json');
const bindings = readJson('reports/h2-s1-algebra-visual-upgrade/PRODUCTION_ASSET_BINDINGS.json');
const render = readJson('reports/h2-s1-algebra-visual-upgrade/browser_render_capture_matrix.json');
const renderRefresh = readJson('reports/h2-s1-algebra-visual-upgrade/browser_render_refresh_20260909.json');
const renderReview = readJson('reports/h2-s1-algebra-visual-upgrade/browser_render_review.json');
const specialist = readJson('reports/h2-s1-algebra-visual-upgrade/function_graph_specialist_pipeline_closure_v7.json');

const sourceQuestions = new Map();
for (const source of inventory.files) {
  const sourcePath = path.join(root, 'archive', source.sourceJsPath);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath, timeout: 5000 });
  const questions = Array.isArray(context.window.questionBank) ? context.window.questionBank : (Array.isArray(context.window.questions) ? context.window.questions : []);
  for (const question of questions) sourceQuestions.set(`${context.window.examTitle}::q${question.id}`, question);
}

const dispositionCounts = Object.fromEntries(['NO_VISUAL', 'KEEP_EXISTING', 'REBUILD_EXISTING', 'ADD_NEW_VISUAL'].map(value => [value, triage.rows.filter(row => row.disposition === value).length]));
const triageUids = triage.rows.map(row => row.questionUid);
const triageDuplicateUids = [...new Set(triageUids.filter((uid, index) => triageUids.indexOf(uid) !== index))].sort();
const candidateRows = manifest.rows.filter(row => row.candidateRef);
const bindingRows = bindings.files.flatMap(file => file.rows || []);
const candidateUids = new Set(candidateRows.map(row => row.questionUid));
const assetShaMismatches = [];
const missingCandidateRefs = [];
const missingAssetRefs = [];
for (const row of candidateRows) {
  if (!exists(row.candidateRef)) missingCandidateRefs.push(row.candidateRef);
  const binding = bindingRows.find(item => item.questionUid === row.questionUid);
  const assetPath = binding?.assetPath?.startsWith('archive/') ? binding.assetPath : binding?.assetPath ? `archive/${binding.assetPath}` : null;
  if (!assetPath || !exists(assetPath)) missingAssetRefs.push(assetPath || row.questionUid);
  if (exists(row.candidateRef) && assetPath && exists(assetPath) && rawSha(row.candidateRef) !== rawSha(assetPath)) assetShaMismatches.push(row.questionUid);
}
const visualNeed = { missingSourceQuestions: [], noVisualViolations: [], keepExistingMissing: [], activeCandidateMissing: [] };
for (const row of triage.rows) {
  const question = sourceQuestions.get(row.questionUid);
  if (!question) { visualNeed.missingSourceQuestions.push(row.questionUid); continue; }
  if (row.disposition === 'NO_VISUAL' && (question.solutionImage || question.solutionImageAlt || question.solutionImageCaption || /\[시각자료 읽기\]/u.test(String(question.solution || '')))) visualNeed.noVisualViolations.push(row.questionUid);
  if (row.disposition === 'KEEP_EXISTING') {
    const imagePath = question.image ? `archive/${String(question.image).replace(/^archive\//u, '')}` : null;
    const hasImage = Boolean(imagePath && exists(imagePath));
    const hasInlineVisual = /<svg[ >]/iu.test(String(question.content || '')) || /<svg[ >]/iu.test(String(question.solution || ''));
    if (!hasImage && !hasInlineVisual) visualNeed.keepExistingMissing.push(row.questionUid);
  }
  if (['ADD_NEW_VISUAL', 'REBUILD_EXISTING'].includes(row.disposition) && !candidateUids.has(row.questionUid)) visualNeed.activeCandidateMissing.push(row.questionUid);
}
visualNeed.missingSourceQuestions.sort();
visualNeed.noVisualViolations.sort();
visualNeed.keepExistingMissing.sort();
visualNeed.activeCandidateMissing.sort();
visualNeed.pass = Object.values(visualNeed).filter(value => Array.isArray(value)).every(value => value.length === 0);

const freezeLatest = new Map();
for (const filename of fs.readdirSync(reportDir).filter(name => /^solution_freeze_batch_\d+\.json$/.test(name))) {
  const batch = readJson(`reports/h2-s1-algebra-visual-upgrade/${filename}`);
  for (const row of batch.rows || []) {
    const prior = freezeLatest.get(row.questionUid);
    if (!prior || Number(batch.batchNo) > prior.batchNo) freezeLatest.set(row.questionUid, { batchNo: Number(batch.batchNo), row });
  }
}
const freezeBlocked = [...freezeLatest.values()].filter(item => item.row.logicStatus !== 'PASS').map(item => item.row.questionUid).sort();

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const sourceFiles = walk(path.join(root, 'archive', 'exams', 'original', 'high', 'h2')).filter(file => file.endsWith('.js'));
const nodeCheckFailures = sourceFiles.filter(file => childProcess.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' }).status !== 0).map(file => rel(path.relative(root, file)));

const branch = git('branch', '--show-current');
const originMain = git('rev-parse', 'origin/main');
const originMainIncluded = childProcess.spawnSync('git', ['merge-base', '--is-ancestor', 'origin/main', 'HEAD'], { cwd: root }).status === 0;

const checks = {
  inventory: {
    sourceFileCount: inventory.summary.sourceFileCount,
    candidateQuestionCount: inventory.summary.candidateQuestionCount,
    targetQuestionCount: inventory.summary.targetQuestionCount,
    excludedQuestionCount: inventory.summary.excludedQuestionCount,
    countsPass: inventory.summary.sourceFileCount === 22 && inventory.summary.candidateQuestionCount === 475 && inventory.summary.targetQuestionCount === 459 && inventory.summary.excludedQuestionCount === 16,
  },
  triage: { targetCount: triage.rows.length, dispositionCounts, duplicateUids: triageDuplicateUids, countsPass: triage.rows.length === 459 && !triageDuplicateUids.length && Object.values(dispositionCounts).reduce((sum, value) => sum + value, 0) === 459 },
  visualNeed,
  candidates: { manifestRows: manifest.rows.length, passRows: candidateRows.filter(row => row.v1Status === 'PASS' && row.v2Status === 'PASS' && row.v3Status === 'PASS').length, missingCandidateRefs, missingAssetRefs, assetShaMismatches, countsPass: manifest.rows.length === 39 && candidateRows.length === 39 && candidateRows.every(row => row.v1Status === 'PASS' && row.v2Status === 'PASS' && row.v3Status === 'PASS') && !missingCandidateRefs.length && !missingAssetRefs.length && !assetShaMismatches.length },
  solutionFreeze: { unique: freezeLatest.size, pass: freezeLatest.size - freezeBlocked.length, blocked: freezeBlocked, countsPass: freezeLatest.size === 459 && !freezeBlocked.length },
  render: { baseline: { status: render.status, expectedCases: render.expectedCases, observedCases: render.observedCases, passCases: render.passCases, failCases: render.failCases }, refresh: { status: renderRefresh.status, expectedCases: renderRefresh.expectedCases, observedCases: renderRefresh.observedCases, passCases: renderRefresh.passCases, failCases: renderRefresh.failCases }, reviewStatus: renderReview.status, countsPass: render.status === 'PASS' && render.expectedCases === 72 && render.observedCases === 72 && render.passCases === 72 && render.failCases === 0 && renderRefresh.status === 'PASS' && renderRefresh.expectedCases === 18 && renderRefresh.observedCases === 18 && renderRefresh.passCases === 18 && renderRefresh.failCases === 0 && renderReview.status === 'PASS' },
  nodeCheck: { sourceFileCount: sourceFiles.length, failureCount: nodeCheckFailures.length, failures: nodeCheckFailures, status: nodeCheckFailures.length ? 'FAIL' : 'PASS' },
  specialistRoute: { status: specialist.status, candidateCount: specialist.candidateCount, candidatePassCount: specialist.candidatePassCount, solutionFreeze: specialist.solutionFreeze, render: specialist.render, renderRefresh: specialist.renderRefresh, errors: specialist.errors, pass: specialist.status === 'PASS' && specialist.candidateCount === 39 && specialist.candidatePassCount === 39 && !specialist.errors.length },
};
const mechanicalPass = Object.values(checks).every(check => check.countsPass === true || check.status === 'PASS' || check.pass === true);
const output = {
  schemaVersion: 'apmath-h2-s1-algebra-final-audit-v1',
  generatedAt: new Date().toISOString(),
  branch: { name: branch, originMain, originMainIncluded, note: 'The audit report intentionally excludes its own commit hash to avoid self-referential evidence.' },
  scope: { sourceFileCount: 22, candidateQuestionCount: 475, targetQuestionCount: 459, excludedQuestionCount: 16 },
  checks,
  mechanicalStatus: mechanicalPass ? 'PASS' : 'FAIL',
  canonicalProviderFinalAudit: 'NOT_RUN',
  academyUserVisualReview: 'PENDING',
  mainMerge: 'NOT_AUTHORIZED',
  productionAuthorized: false,
  status: mechanicalPass ? 'MACHINE_AUDIT_PASS_CANONICAL_SEAL_HOLD' : 'MACHINE_AUDIT_FAIL',
  blockingGates: mechanicalPass ? ['PROVIDER_ATTESTED_FINAL_AUDIT_NOT_RUN', 'ACADEMY_USER_VISUAL_REVIEW_PENDING', 'MAIN_MERGE_NOT_AUTHORIZED'] : ['MACHINE_AUDIT_FAILURE'],
};
fs.writeFileSync(path.join(reportDir, 'FINAL_AUDIT_EVIDENCE.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, mechanicalStatus: output.mechanicalStatus, target: output.scope.targetQuestionCount, candidatePass: checks.candidates.passRows, freeze: `${checks.solutionFreeze.pass}/${checks.solutionFreeze.unique}`, render: `${checks.render.baseline.passCases}/${checks.render.baseline.expectedCases}`, refresh: `${checks.render.refresh.passCases}/${checks.render.refresh.expectedCases}`, originMainIncluded }, null, 2));
