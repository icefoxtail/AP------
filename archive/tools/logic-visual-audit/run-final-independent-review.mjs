import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { readJson, sha256, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const baseSha = '9c4b2ac3c5784d1fb589980786484795a79a1c57';
const preflight = readJson(path.join(root, 'reports/rule-preflight.json'));
const inventory = readJson(path.join(root, 'reports/target-inventory.json'));
const denominator = readJson(path.join(root, 'reports/c-denominator.json'));
const artifacts = Object.values(readJson(path.join(root, 'reports/v2-evidence-freeze.json')).items);
const render = readJson(path.join(root, 'reports/qualification-render.json'));
const phase2Contract = readJson(path.join(root, 'reports/phase2-missing-visual-contract.json'));
const phase2Report = readJson(path.join(root, 'reports/phase2-pilot-report.json'));
const statusLines = execFileSync('git', ['-c', 'core.quotepath=false', 'status', '--porcelain=v1', '--untracked-files=all'], { cwd: repoRoot, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const changedFiles = execFileSync('git', ['-c', 'core.quotepath=false', 'diff', '--name-only', baseSha, 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const changedSvgs = changedFiles.filter((file) => file.endsWith('.svg'));
const changedJs = changedFiles.filter((file) => file.endsWith('.js'));
const changedSvgChecks = changedSvgs.map((file) => inspectSvg(path.join(repoRoot, file)));
const changedJsChecks = changedJs.map((file) => inspectJs(path.join(repoRoot, file)));
const requiredArtifactPass = denominator.logicVisualRequiredUidSet.every((uid) => artifacts.find((item) => item.questionUid === uid)?.artifactExists === true);
const renderPass = denominator.logicVisualRequiredUidSet.every((uid) => render.results.find((item) => item.questionUid === uid)?.pass === true);
const allChangedSvgPass = changedSvgChecks.every((item) => item.pass);
const allChangedJsPass = changedJsChecks.every((item) => item.pass);
const remoteMain = execFileSync('git', ['rev-parse', 'origin/main'], { cwd: repoRoot, encoding: 'utf8' }).trim();
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
const report = {
  reviewVersion: 'logic-visual-final-independent-review-v1',
  baseSha,
  headRemoteParity: head === remoteMain,
  worktreeClean: statusLines.length === 0,
  ruleRoutingPass: preflight.routingStatus === 'PASS',
  finalTargetCount: inventory.finalTargetCount,
  cRequiredCount: denominator.logicVisualRequiredUidSet.length,
  requiredArtifactPass,
  requiredRenderPass: renderPass,
  phase2ContractPass: phase2Contract.pass && phase2Contract.passCount === phase2Contract.results.length,
  phase2Status: phase2Report.phase2Status,
  changedSvgCount: changedSvgs.length,
  changedJsCount: changedJs.length,
  changedSvgChecks,
  changedJsChecks,
  allChangedSvgPass,
  allChangedJsPass,
  finalIndependentReviewPass: Boolean(head === remoteMain && statusLines.length === 0 && preflight.routingStatus === 'PASS' && requiredArtifactPass && renderPass && reportPhase2Contract(phase2Contract) && allChangedSvgPass && allChangedJsPass)
};
report.reportSha = sha256(report);
writeJson(path.join(root, 'reports/final-independent-review.json'), report);
console.log(JSON.stringify({ finalIndependentReviewPass: report.finalIndependentReviewPass, head, remoteMain, worktreeClean: report.worktreeClean, requiredArtifactPass, requiredRenderPass: renderPass, phase2ContractPass: report.phase2ContractPass, changedSvgCount: changedSvgs.length, changedJsCount: changedJs.length, reportSha: report.reportSha }, null, 2));
if (!report.finalIndependentReviewPass) process.exitCode = 1;

function reportPhase2Contract(value) {
  return value.pass === true && value.passCount === value.results.length && value.failCount === 0;
}

function inspectSvg(absolutePath) {
  if (!fs.existsSync(absolutePath)) return { path: path.relative(repoRoot, absolutePath), pass: false, reason: 'missing' };
  const svg = fs.readFileSync(absolutePath, 'utf8');
  const pass = /<svg\b/.test(svg) && /viewBox=/.test(svg) && /<title\b/.test(svg) && /<desc\b/.test(svg) && !/정답|answer|선택지/.test(svg) && !svg.includes('�');
  return { path: path.relative(repoRoot, absolutePath).replaceAll('\\', '/'), pass, sha256: sha256(svg) };
}

function inspectJs(absolutePath) {
  const source = fs.readFileSync(absolutePath, 'utf8');
  const window = {};
  try { vm.runInNewContext(source, { window }, { filename: absolutePath, timeout: 5000 }); } catch (error) { return { path: path.relative(repoRoot, absolutePath).replaceAll('\\', '/'), pass: false, reason: String(error?.message ?? error) }; }
  const questions = Array.isArray(window.questionBank) ? window.questionBank : [];
  const solutionPass = questions.every((question) => typeof question.solution === 'string' && question.solution.trim().length > 0);
  const linkedImagesPass = questions.filter((question) => typeof question.solutionImage === 'string').every((question) => fs.existsSync(path.join(repoRoot, 'archive', question.solutionImage)));
  return { path: path.relative(repoRoot, absolutePath).replaceAll('\\', '/'), pass: solutionPass && linkedImagesPass, questionCount: questions.length, solutionPass, linkedImagesPass };
}
