import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { readJson, sha256, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const corpus = readJson(path.join(root, 'specs/phase2-missing-visual-corpus-v1.json'));
const generation = readJson(path.join(root, 'reports/phase2-missing-visual-generation.json'));
const attach = readJson(path.join(root, 'reports/phase2-missing-visual-attach.json'));
const artifacts = Object.values(readJson(path.join(root, 'reports/v2-evidence-freeze.json')).items);
const render = readJson(path.join(root, 'reports/qualification-render.json'));
const generatedByUid = new Map(generation.results.map((item) => [item.questionUid, item]));
const attachedByUid = new Map(attach.connected.map((item) => [item.questionUid, item]));
const artifactByUid = new Map(artifacts.map((item) => [item.questionUid, item]));
const renderByUid = new Map(render.results.map((item) => [item.questionUid, item]));
const results = corpus.cases.map((item) => {
  const generated = generatedByUid.get(item.questionUid);
  const connected = attachedByUid.get(item.questionUid);
  const artifact = artifactByUid.get(item.questionUid);
  const renderResult = renderByUid.get(item.questionUid);
  const assetAbsolute = generated ? path.join(repoRoot, generated.assetPath) : null;
  const svg = assetAbsolute && fs.existsSync(assetAbsolute) ? fs.readFileSync(assetAbsolute, 'utf8') : '';
  const sourceFile = path.join(repoRoot, 'archive/exams/original/high/h1/2mid', `${item.examId}.js`);
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, 'utf8') : '';
  const sourceObject = sourceQuestion(source, item.qid);
  const sourceLinkPass = sourceObject?.solutionImage === connected?.image;
  const factHashPass = generated?.factHash === sha256(item.fact);
  const svgContractPass = Boolean(svg && /<title\b/.test(svg) && /<desc\b/.test(svg) && !/answer|정답|선택지/.test(svg) && svg.includes(item.title));
  const artifactPass = artifact?.artifactExists === true && artifact.artifactSha === generated?.artifactSha;
  const pass = Boolean(generated && connected && sourceLinkPass && factHashPass && svgContractPass && artifactPass && renderResult?.pass);
  return { questionUid: item.questionUid, visualType: item.visualType, sourceLinkPass, factHashPass, svgContractPass, artifactPass, renderPass: renderResult?.pass === true, pass };
});
const report = { verifierVersion: 'logic-visual-phase2-missing-contract-v1', corpusSha: sha256(corpus), results, pass: results.every((item) => item.pass), passCount: results.filter((item) => item.pass).length, failCount: results.filter((item) => !item.pass).length };
report.reportSha = sha256(report);
writeJson(path.join(root, 'reports/phase2-missing-visual-contract.json'), report);
console.log(JSON.stringify({ caseCount: results.length, pass: report.pass, passCount: report.passCount, failCount: report.failCount, reportSha: report.reportSha }, null, 2));
if (!report.pass) process.exitCode = 1;

function sourceQuestion(source, qid) {
  const window = {};
  try {
    vm.runInNewContext(source, { window }, { timeout: 5000 });
    return window.questionBank?.find((item) => item.id === qid) ?? null;
  } catch {
    return null;
  }
}
