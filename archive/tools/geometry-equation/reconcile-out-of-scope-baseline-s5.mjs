import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const stage = path.join(reports, 'staging', 'archive');
const production = path.join(root, 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest_v22.json'), 'utf8'));
const frozenRows = fs.readFileSync(path.join(reports, 'out_of_scope_protection_manifest.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean);

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value ?? null;
};
const hashJson = (value) => crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const loadBank = (rootPath, sourceJsPath) => {
  const filePath = path.join(rootPath, 'exams', sourceJsPath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
};
const makePayload = (sourceJsPath, question) => ({
  questionUid: sourceJsPath + '_' + question.id,
  content: question.content || '',
  choices: question.choices || [],
  answer: question.answer || '',
  image: question.image || null,
  id: question.id,
  displayNo: question.displayNo || question.id,
  sourceIdentity: { sourceJsPath, id: question.id }
});

const parseFrozenProtected = (line) => {
  const fields = [];
  let current = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') { quoted = !quoted; continue; }
    if (ch === ',' && !quoted) { fields.push(current); current = ''; continue; }
    current += ch;
  }
  fields.push(current);
  return { sourceJsPath: fields[1], frozenHash: fields[4] };
};

const frozenBySource = new Map(frozenRows.map((line) => { const parsed = parseFrozenProtected(line); return [parsed.sourceJsPath, parsed.frozenHash]; }));
const sourcePaths = [...new Set(manifest.rows.map((row) => row.sourceJsPath))].sort();
const rows = [];
for (const sourceJsPath of sourcePaths) {
  const manifestRow = manifest.rows.find((row) => row.sourceJsPath === sourceJsPath);
  const targetIds = new Set(manifest.rows.filter((row) => row.sourceJsPath === sourceJsPath).map((row) => row.id));
  const stageBank = loadBank(stage, sourceJsPath);
  const productionBank = loadBank(production, sourceJsPath);
  const stagePayload = stageBank.filter((question) => !targetIds.has(question.id)).map((question) => makePayload(sourceJsPath, question));
  const productionPayload = productionBank.filter((question) => !targetIds.has(question.id)).map((question) => makePayload(sourceJsPath, question));
  const frozenHash = frozenBySource.get(sourceJsPath) || manifestRow.OUT_OF_SCOPE_BASELINE_HASH || null;
  const stagingHash = hashJson(stagePayload);
  const productionHash = hashJson(productionPayload);
  rows.push({ sourceJsPath, protectedQuestionCount: stagePayload.length, frozenBaselineHash: frozenHash, stagingCurrentHash: stagingHash, productionCurrentHash: productionHash, stagingEqualsProduction: stagingHash === productionHash, frozenEqualsStaging: frozenHash === stagingHash, frozenEqualsProduction: frozenHash === productionHash });
}

const mismatchRows = rows.filter((row) => !row.frozenEqualsStaging || !row.frozenEqualsProduction);
const stageProductionDiffRows = rows.filter((row) => !row.stagingEqualsProduction);
const output = {
  status: mismatchRows.length === 0 && stageProductionDiffRows.length === 0 ? 'OUT_OF_SCOPE_BASELINE_RECONCILIATION_PASS' : 'OUT_OF_SCOPE_BASELINE_RECONCILIATION_HOLD',
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  generatedAt: new Date().toISOString(),
  manifestPath: 'reports/geometry_equation_20260902/geometry_equation_manifest_v22.json',
  sourceCount: rows.length,
  frozenEqualsCurrentStaging: rows.filter((row) => row.frozenEqualsStaging).length + '/' + rows.length,
  frozenEqualsCurrentProduction: rows.filter((row) => row.frozenEqualsProduction).length + '/' + rows.length,
  stagingEqualsProduction: rows.filter((row) => row.stagingEqualsProduction).length + '/' + rows.length,
  frozenMismatchCount: mismatchRows.length,
  currentStageProductionDiffCount: stageProductionDiffRows.length,
  mismatchRows,
  disposition: mismatchRows.length === 0 && stageProductionDiffRows.length === 0 ? 'current protected baseline is stable' : 'historical frozen baseline mismatch is recorded; do not overwrite frozen manifest without explicit baseline re-freeze decision',
  sourceFilesModified: false,
  productionModified: false
};
fs.writeFileSync(path.join(reports, 'out_of_scope_baseline_reconciliation_S5.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const md = [
  '# Out-of-scope protection baseline reconciliation — S5', '',
  '- 상태: **' + output.status + '**',
  '- source JS: ' + output.sourceCount,
  '- frozen baseline = current staging: ' + output.frozenEqualsCurrentStaging,
  '- frozen baseline = current production: ' + output.frozenEqualsCurrentProduction,
  '- current staging = current production: ' + output.stagingEqualsProduction,
  '- frozen mismatch: ' + output.frozenMismatchCount,
  '- current staging/production protected diff: ' + output.currentStageProductionDiffCount,
  '',
  ...mismatchRows.map((row) => '- ' + row.sourceJsPath + ': frozen=' + row.frozenBaselineHash + ', staging=' + row.stagingCurrentHash + ', production=' + row.productionCurrentHash),
  '',
  '현재 staging과 production protected payload가 같더라도 historical frozen baseline hash를 승인 없이 덮어쓰지 않는다. baseline을 현재 production 기준으로 재동결하려면 manifest/evidence를 새 revision으로 만들고 A/B/C를 다시 실행해야 한다.'
].join('\n') + '\n';
fs.writeFileSync(path.join(reports, 'out_of_scope_baseline_reconciliation_S5.md'), md, 'utf8');
console.log(JSON.stringify({ status: output.status, sourceCount: output.sourceCount, frozenEqualsCurrentStaging: output.frozenEqualsCurrentStaging, frozenEqualsCurrentProduction: output.frozenEqualsCurrentProduction, stagingEqualsProduction: output.stagingEqualsProduction, frozenMismatchCount: output.frozenMismatchCount, currentStageProductionDiffCount: output.currentStageProductionDiffCount }, null, 2));
