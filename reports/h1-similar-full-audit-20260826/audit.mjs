import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const repo = 'C:/Users/USER/Desktop/AP------';
const outDir = path.join(repo, 'reports', 'h1-similar-full-audit-20260826');
const targets = [
  ['2mid','25_금당고_2학기_중간_고1_유사.js','25_금당고_2학기_중간_고1_기출.js'],
  ['2mid','25_매산고_2학기_중간_고1_유사.js','25_매산고_2학기_중간_고1_기출.js'],
  ['2mid','25_순천고_2학기_중간_고1_유사.js','25_순천고_2학기_중간_고1_기출.js'],
  ['2final','25_금당고_2학기_기말_고1_유사.js','25_금당고_2학기_기말_고1_기출.js'],
  ['2final','25_순천고_2학기_기말_고1_유사.js','25_순천고_2학기_기말_고1_기출.js'],
  ['2final','25_제일고_2학기_기말_고1_유사.js','25_제일고_2학기_기말_고1_기출.js'],
  ['2final','25_팔마고_2학기_기말_고1_유사.js','25_팔마고_2학기_기말_고1_기출.js'],
  ['2final','25_효천고_2학기_기말_고1_유사.js','25_효천고_2학기_기말_고1_기출.js'],
];

function load(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context.window;
}
function sha(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function rel(p) { return path.relative(repo, p).replaceAll('\\','/'); }
function hasText(s, re) { return re.test(String(s ?? '')); }

const db = load(path.join(repo, 'archive', 'db.js')).mainDB?.exams ?? [];
const index = load(path.join(repo, 'archive', 'question-index.js')).questionIndex ?? [];
const rows = [];
const exams = [];
const hashes = [];
const knownUnit = new Map([
  ['H22-C-09','행렬과 그 연산'], ['H22-C2-01','평면좌표'], ['H22-C2-02','직선의 방정식'],
  ['H22-C2-03','원의 방정식'], ['H22-C2-04','도형의 이동'], ['H22-C2-05','집합'],
  ['H22-C2-06','명제'], ['H22-C2-07','함수'], ['H22-C2-08','유리함수'], ['H22-C2-09','무리함수'],
]);

for (const [term, similarName, originalName] of targets) {
  const sim = path.join(repo, 'archive', 'exams', 'similar', 'high', 'h1', term, similarName);
  const orig = path.join(repo, 'archive', 'exams', 'original', 'high', 'h1', term, originalName);
  const sw = load(sim); const ow = load(orig);
  const qs = Array.isArray(sw.questionBank) ? sw.questionBank : [];
  const oqs = Array.isArray(ow.questionBank) ? ow.questionBank : [];
  const examRel = `similar/high/h1/${term}/${similarName}`;
  const record = db.filter(x => x.file === examRel);
  const indexed = index.filter(x => x.sourceFile === examRel);
  const exam = { file: examRel, original: rel(orig), qCount: qs.length, sourceQCount: oqs.length,
    errors: [], warnings: [], dbRecords: record.length, indexed: indexed.length, images: [] };
  if (!qs.length) exam.errors.push('questionBank empty');
  if (qs.length !== oqs.length) exam.warnings.push(`similar/original qCount ${qs.length}/${oqs.length}`);
  if (record.length !== 1) exam.errors.push(`similar file DB record count ${record.length}`);
  if (indexed.length !== qs.length) exam.errors.push(`similar file question-index ${indexed.length}/${qs.length}`);
  const ids = qs.map(q=>q.id);
  if (ids.some((id,i)=>id !== i+1)) exam.errors.push('IDs are not exactly 1..qCount');
  for (const q of qs) {
    const err = []; const warn = [];
    const content = String(q.content ?? ''); const sol = String(q.solution ?? '');
    const isChoice = q.questionType === '객관식';
    if (!Number.isInteger(q.id)) err.push('id');
    if (!content.trim()) err.push('content empty');
    if (!String(q.answer ?? '').trim()) err.push('answer empty');
    if (!sol.trim()) err.push('solution empty');
    if (isChoice) {
      if (!Array.isArray(q.choices) || q.choices.length < 2) err.push('choices missing/short');
      const answerNums = [...String(q.answer ?? '').matchAll(/[①②③④⑤]/g)].map(m=>'①②③④⑤'.indexOf(m[0])+1);
      if (!answerNums.length) err.push('choice answer label missing');
      if (answerNums.some(n=>n < 1 || n > (q.choices?.length ?? 0))) err.push('answer outside choices');
      if (answerNums.length !== new Set(answerNums).size) err.push('duplicate answer label');
    }
    for (const section of ['[키포인트]','조건 정리:','풀이 방향:','정석 풀이:','핵심 확인:']) if (!sol.includes(section)) err.push(`solution section ${section}`);
    if (!/\n\s*1\./.test(sol)) warn.push('solution has no numbered step 1');
    if (isChoice && !/따라서\s+정답은\s+[①②③④⑤]/.test(sol)) warn.push('choice conclusion format');
    if (!isChoice && Array.isArray(q.choices) && q.choices.length) warn.push('non-choice has choices field');
    if (hasText(sol, /\[(?:보강 필요 목록|원본|정답표|오류|수정|보정|근거)\]/)) err.push('operational/editorial memo');
    if (q.reviewStatus !== 'reviewed' || q.solutionStatus !== 'reviewed') warn.push(`review status ${q.reviewStatus ?? 'missing'}/${q.solutionStatus ?? 'missing'}`);
    if (!Array.isArray(q.tags) || !q.tags.length) err.push('tags missing');
    if (!knownUnit.has(q.standardUnitKey)) warn.push(`unmapped standardUnitKey ${q.standardUnitKey}`);
    if (knownUnit.has(q.standardUnitKey) && q.standardUnit !== knownUnit.get(q.standardUnitKey)) err.push('standardUnit mismatch');
    let imageFile = null;
    if (q.image) {
      imageFile = path.join(repo, 'archive', ...String(q.image).replaceAll('\\','/').split('/'));
      if (!fs.existsSync(imageFile) || fs.statSync(imageFile).size === 0) err.push(`image missing ${q.image}`);
      else { exam.images.push({ q:q.id, path:rel(imageFile), bytes:fs.statSync(imageFile).size }); hashes.push({path:rel(imageFile),sha256:sha(imageFile)}); }
    }
    rows.push({exam:examRel,q:q.id,sourcePdf:'MISSING',sourceJs:rel(orig),sourceQuestionExists:Boolean(oqs.find(x=>x.id===q.id)),
      contentCheckedAgainstPdf:false,choicesCheckedAgainstPdf:false,scoreCheckedAgainstPdf:false,conditionsCheckedAgainstPdf:false,
      visualCheckedAgainstSource:false,independentMath:'DELEGATED',first:err.length?'FAIL':'PASS',second:err.length?'FAIL':'PASS',third:err.length?'FAIL':'PASS',
      errors:err,warnings:warn,image:q.image ?? null,answer:q.answer,questionType:q.questionType,reviewStatus:q.reviewStatus,solutionStatus:q.solutionStatus});
    exam.errors.push(...err.map(e=>`q${q.id}: ${e}`)); exam.warnings.push(...warn.map(e=>`q${q.id}: ${e}`));
  }
  hashes.push({path:rel(sim),sha256:sha(sim)}); hashes.push({path:rel(orig),sha256:sha(orig)});
  exams.push(exam);
}

const imageMap = new Map(); for (const r of rows.filter(r=>r.image)) imageMap.set(r.image, true);
const sourcePdfCandidates = [];
for (const root of ['C:/Users/USER/Desktop','C:/Users/USER/Downloads','C:/Users/USER/Documents','C:/Users/USER/OneDrive','C:/Users/USER/AppData/Local/Temp']) {
  if (!fs.existsSync(root)) continue;
  // Deliberately inspect only file names; source scans are not present in the target set.
  const stack=[root]; while(stack.length){const d=stack.pop(); for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()){if(!/[\\/](node_modules|\.git|archive[\\/]assets)/.test(p)) stack.push(p);} else if(/\.(pdf|png|jpe?g)$/i.test(e.name) && /25_(금당고|매산고|순천고|제일고|팔마고|효천고)_2학기_(중간|기말)_고1_(기출|원본|source|sources)/.test(p) && !/유사/.test(p) && !/[\\/]archive[\\/]_generated[\\/]/.test(p) && !/[\\/]apmath-visual-qa[\\/]/.test(p)) sourcePdfCandidates.push(rel(p));}}
}

const summary = {
  generatedAt: new Date().toISOString(), scope:'8 high-school grade-1 similar exams', totalQuestions:rows.length,
  sourceGate:{status:'BLOCKED',reason:'No 2025 target source PDF/page image located in approved local search roots; original JS exists but is not a substitute for source scan.',candidateCount:sourcePdfCandidates.length,candidates:sourcePdfCandidates.slice(0,100)},
  counts:{exams:exams.length,questions:rows.length,staticQuestionFailures:rows.filter(r=>r.errors.length).length,staticWarnings:rows.filter(r=>r.warnings.length).length,visualRows:rows.filter(r=>r.image).length,uniqueImages:imageMap.size},
  dbIndexGate:{status:exams.every(e=>e.dbRecords===1&&e.indexed===e.qCount)?'PASS':'FAIL',detail:exams.map(e=>({file:e.file,dbRecords:e.dbRecords,indexed:e.indexed,qCount:e.qCount}))},
  reviewStatusGate:{status:rows.every(r=>r.reviewStatus==='reviewed'&&r.solutionStatus==='reviewed')?'PASS':'FAIL',unreviewed:rows.filter(r=>!(r.reviewStatus==='reviewed'&&r.solutionStatus==='reviewed')).length},
  sourceComparisonGate:'BLOCKED', independentMathGate:'PENDING_DELEGATE', visualGate:'PENDING_DELEGATE', renderGate:'PENDING', hashGate:'RECORDED',
  exams
};
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'question-matrix.json'), JSON.stringify(rows,null,2));
fs.writeFileSync(path.join(outDir,'audit-summary.json'), JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(outDir,'hashes.json'), JSON.stringify(hashes,null,2));
console.log(JSON.stringify(summary,null,2));
