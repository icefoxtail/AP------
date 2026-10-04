import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT_DIR = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const CANDIDATE_DIR = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r62-scoped-rebased', 'exams');
const OUTPUT = path.join(REPORT_DIR, '833_current_branch_svg_inventory_checkpoint.json');

function gitFiles(pattern) {
  return execFileSync('git', ['ls-files', '--', pattern], { cwd: ROOT, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
}
function walk(directory) {
  const rows = [];
  if (!fs.existsSync(directory)) return rows;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) rows.push(...walk(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) rows.push(full);
  }
  return rows;
}
function loadBank(file) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { timeout: 1000 });
  return Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
}

const candidateFiles = fs.existsSync(CANDIDATE_DIR) ? fs.readdirSync(CANDIDATE_DIR).filter(name => name.endsWith('.js')).sort() : [];
const candidateBanks = [];
const referencedAssets = new Map();
let questionCount = 0;
for (const name of candidateFiles) {
  const relative = `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r62-scoped-rebased/exams/${name}`;
  const questions = loadBank(path.join(ROOT, relative));
  questionCount += questions.length;
  for (const question of questions) {
    if (!question.solutionImage) continue;
    const asset = String(question.solutionImage);
    const rows = referencedAssets.get(asset) || [];
    rows.push({ candidateFile: relative, qid: question.id });
    referencedAssets.set(asset, rows);
  }
  candidateBanks.push({ path: relative, questionCount: questions.length });
}

const allCandidateAssets = walk(path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908'))
  .map(full => path.relative(ROOT, full).split(path.sep).join('/'))
  .filter(relative => /candidate-r\d+\/assets\/.+\.svg$/i.test(relative))
  .sort();
const trackedAssets = new Set(gitFiles('archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r*/assets/*.svg'));
const missingReferenced = [...referencedAssets.keys()].filter(asset => !fs.existsSync(path.join(ROOT, asset))).sort();
const untrackedReferenced = [...referencedAssets.keys()].filter(asset => !trackedAssets.has(asset)).sort();
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: ROOT, encoding: 'utf8' }).trim();
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
const remoteHead = execFileSync('git', ['rev-parse', 'origin/codex/hs-quadratic-svg-upgrade'], { cwd: ROOT, encoding: 'utf8' }).trim();
const svgCommits = execFileSync('git', ['log', '--format=%h %s', '--all', '--', 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r*/assets/*.svg'], { cwd: ROOT, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);

const output = {
  schemaVersion: 'HS_QUADRATIC_BRANCH_SVG_INVENTORY_R1',
  status: 'SVG_INVENTORY_CHECKPOINT_NO_SEMANTIC_PASS',
  productionAuthorized: false,
  branch,
  head,
  remoteHead,
  headMatchesRemote: head === remoteHead,
  candidateBankCount: candidateFiles.length,
  candidateQuestionCount: questionCount,
  candidateAssetCountPhysical: allCandidateAssets.length,
  candidateAssetCountTracked: trackedAssets.size,
  referencedSolutionSvgCountUnique: referencedAssets.size,
  referencedSolutionSvgMissing: missingReferenced,
  referencedSolutionSvgUntracked: untrackedReferenced,
  candidateBanks,
  referencedAssets: Object.fromEntries([...referencedAssets.entries()].sort(([left], [right]) => left.localeCompare(right))),
  svgHistoryCommits: svgCommits,
  note: 'This inventory proves branch/file custody and reference coverage only. It does not certify SVG semantic correctness, V1/V2/V3 parity, readability, or final PASS. User-side H2/source-recovery untracked assets are intentionally outside this H1 quadratic inventory.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, branch, headMatchesRemote: output.headMatchesRemote, candidateBankCount: output.candidateBankCount, candidateQuestionCount: output.candidateQuestionCount, candidateAssetCountTracked: output.candidateAssetCountTracked, referencedSolutionSvgCountUnique: output.referencedSolutionSvgCountUnique, missingReferenced: missingReferenced.length, untrackedReferenced: untrackedReferenced.length }, null, 2));
