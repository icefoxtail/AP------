import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const PASS = 'PASS';
const REQUIRED_AXES = Object.freeze(['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY']);
const REQUIRED_NEGATIVE = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const sha256 = value => 'sha256:' + crypto.createHash('sha256').update(value).digest('hex');
const gitBlobSha = value => { const bytes=Buffer.isBuffer(value)?value:Buffer.from(value); return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'); };
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const array = value => Array.isArray(value) ? value : [];
const normalize = value => String(value || '').replaceAll('\\','/');

function findRepoRoot(examFile) {
  const starts=[path.dirname(path.resolve(examFile)), process.cwd()];
  for (const start of starts) {
    let dir=start;
    for (;;) {
      if (fs.existsSync(path.join(dir,'.git'))) return dir;
      const parent=path.dirname(dir); if (parent===dir) break; dir=parent;
    }
  }
  throw new Error('CALIBRATION_REPO_ROOT_NOT_FOUND');
}
function resolveRef(root, refPath) {
  const rel=normalize(refPath);
  if (!nonEmpty(rel) || rel.startsWith('/') || rel.includes('..')) throw new Error('CALIBRATION_REF_PATH_INVALID');
  const absolute=path.resolve(root,...rel.split('/'));
  if (!(absolute===root || absolute.startsWith(root+path.sep))) throw new Error('CALIBRATION_REF_ESCAPES_REPO');
  return {rel,absolute};
}
function bindRef(root, ref, issues, prefix, predicate=null) {
  if (!ref || !nonEmpty(ref.path) || !nonEmpty(ref.sha256) || !nonEmpty(ref.gitBlobSha)) { issues.push(prefix+'_REF_INCOMPLETE'); return null; }
  let resolved; try { resolved=resolveRef(root,ref.path); } catch (e) { issues.push(prefix+'_REF_INVALID:'+e.message); return null; }
  if (predicate && !predicate(resolved.rel)) { issues.push(prefix+'_PATH_FORBIDDEN:'+resolved.rel); return null; }
  if (!fs.existsSync(resolved.absolute) || !fs.statSync(resolved.absolute).isFile()) { issues.push(prefix+'_REF_NOT_FOUND:'+resolved.rel); return null; }
  const bytes=fs.readFileSync(resolved.absolute);
  if (sha256(bytes)!==ref.sha256) issues.push(prefix+'_SHA256_MISMATCH:'+resolved.rel);
  if (gitBlobSha(bytes)!==ref.gitBlobSha) issues.push(prefix+'_BLOB_SHA_MISMATCH:'+resolved.rel);
  return {...resolved,bytes};
}
function loadQuestions(file) {
  const source=fs.readFileSync(file,'utf8'), sandbox={window:{}}; vm.createContext(sandbox); vm.runInContext(source,sandbox,{filename:file,timeout:5000});
  const questions=sandbox.window.questionBank || sandbox.window.questions; if (!Array.isArray(questions) || !questions.length) throw new Error('QUESTION_BANK_REQUIRED'); return questions;
}

export function validateSolutionCalibration({ examFile, questions, evidence, stage }) {
  const issues=[], c=evidence?.solutionQualityCalibration;
  if (!c || typeof c!=='object') return ['SOLUTION_CALIBRATION_REQUIRED'];
  if (c.sampleReadBeforeWork!==true) issues.push('CALIBRATION_SAMPLE_READ_BEFORE_WORK_REQUIRED');
  if (c.calibrationStatus!==PASS) issues.push('CALIBRATION_STATUS_PASS_REQUIRED');
  const modes=stage==='CREATE' ? new Set(['SOURCE_ONLY_CREATE','FRESH_REWRITE_CREATE']) : stage==='SOLUTION_UPGRADE' ? new Set(['EXISTING_SOLUTION_UPGRADE']) : new Set(['INDEPENDENT_REVIEW']);
  if (!modes.has(c.solutionWorkMode)) issues.push('CALIBRATION_WORK_MODE_INVALID:'+stage);
  const order=stage==='CREATE' ? 'FRESH_SOLUTION_FROZEN_THEN_CALIBRATE' : stage==='SOLUTION_UPGRADE' ? 'BASELINE_REVIEW_THEN_CALIBRATE_THEN_UPGRADE' : 'BLIND_TARGET_DECISION_FROZEN_THEN_CALIBRATE';
  if (c.calibrationOrder!==order) issues.push('CALIBRATION_ORDER_INVALID:'+stage);
  const axes=new Set(array(c.calibrationAxes)); for (const axis of REQUIRED_AXES) if (!axes.has(axis)) issues.push('CALIBRATION_AXIS_REQUIRED:'+axis);
  const count=/^([0-9]+)\/([0-9]+)$/.exec(String(c.qualityCompareCount||''));
  if (!count || Number(count[1])!==questions.length || Number(count[2])!==questions.length) issues.push('CALIBRATION_QUALITY_COMPARE_COUNT_MISMATCH');
  let root; try { root=findRepoRoot(examFile); } catch(e) { issues.push(e.message); return issues; }
  const targetRel=normalize(path.relative(root,path.resolve(examFile)));
  const golden=array(c.goldenSampleRefs);
  if (![2,3].includes(golden.length) || new Set(golden.map(x=>normalize(x?.path))).size!==golden.length) issues.push('CALIBRATION_REQUIRES_2_OR_3_DISTINCT_GOLDEN_SAMPLES');
  const banks=new Map();
  for (const ref of golden) {
    const bound=bindRef(root,ref,issues,'GOLDEN_SAMPLE',p=>/^archive\/exams\/original\/.+\.js$/.test(p) && p!==targetRel);
    if (!bound) continue; try { banks.set(bound.rel,loadQuestions(bound.absolute)); } catch(e) { issues.push('GOLDEN_SAMPLE_JS_INVALID:'+bound.rel+':'+e.message); }
  }
  const seen=new Set(), counts=new Map();
  for (const ref of array(c.goldenSampleQuestionRefs)) {
    const p=normalize(ref?.path), qid=Number(ref?.qid), key=p+'|q'+qid;
    if (seen.has(key)) { issues.push('GOLDEN_SAMPLE_QUESTION_DUPLICATE:'+key); continue; } seen.add(key);
    const bank=banks.get(p), q=bank?.find(item=>Number(item.id)===qid);
    if (!bank || !Number.isInteger(qid) || !q || !nonEmpty(q.solution)) { issues.push('GOLDEN_SAMPLE_QUESTION_NOT_FOUND:'+key); continue; }
    if (ref.solutionSha256!==sha256(String(q.solution))) issues.push('GOLDEN_SAMPLE_SOLUTION_SHA_MISMATCH:'+key);
    if (!nonEmpty(ref.observation)) issues.push('GOLDEN_SAMPLE_QUESTION_OBSERVATION_REQUIRED:'+key);
    counts.set(p,(counts.get(p)||0)+1);
  }
  for (const p of banks.keys()) { const n=counts.get(p)||0; if (n<2 || n>5) issues.push('GOLDEN_SAMPLE_REPRESENTATIVE_QUESTION_COUNT_INVALID:'+p+':'+n); }
  const negatives=array(c.negativeSampleRefs); if (!negatives.length) issues.push('NEGATIVE_SAMPLE_REQUIRED');
  let bokseong=false; for (const ref of negatives) { const bound=bindRef(root,ref,issues,'NEGATIVE_SAMPLE'); if (bound?.rel===REQUIRED_NEGATIVE) bokseong=true; }
  if (!bokseong) issues.push('BOKSEONG_FALSE_PASS_NEGATIVE_SAMPLE_REQUIRED');
  return issues;
}
