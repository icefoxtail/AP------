// Usage: node unpack-judgment.cjs "<G:\내 드라이브\Google AI Studio\<prompt title>>" "<작업폴더>" [--repair-latex] [--dry]
// AI Studio 대화 파일(Drive 동기화, merge-prompt.cjs 와 같은 형식: chunkedPrompt.chunks, role model, isThought 아님)에서
// 모델 답의 ```json 블록(또는 배열)을 모두 꺼내 <작업폴더>/judgment/qNN.json 으로 쓴다.
//  - 나중 청크가 같은 qid 를 덮어쓴다(오류 되돌리기 답이 최신).
//  - itemFingerprint 와 review 칸은 작업폴더의 빈 틀(build-candidates 가 만든 것)의 값을 그대로 유지한다(모델이 바꾸지 못한다).
//  - 빈 틀이 없는 qid, qid 가 없는 블록, 파싱 실패 블록은 쓰지 않고 목록으로 알린다.
//  - 단일 모델 초안 표시: 판정 파일에 따로 쓰는 칸은 없다. 하네스는 apply-judgment 때 --judge <이름> 으로 표시한다
//    (등록 요청 reason "DRAFT_SINGLE_MODEL (<이름>)", metaRationale.draftTier "SINGLE_MODEL_DRAFT", 4칸 judgedBy.agent). PILOT_DRIVER.md 참고.
//  - --repair-latex: JSON 안의 \frac \times \beta \neq 같은 LaTeX 명령이 제어문자(\f \t \b \n)로 읽힌 경우 원래 글자로 되돌린다
//    (기본은 끔: check-judgment 의 CTRL_CHAR 가 그대로 잡도록. 켜면 Gemini 에 되돌리는 횟수를 아낀다).
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const [src, work] = args.filter(a => !a.startsWith('--'));
if (!src || !work) { console.error('Usage: node unpack-judgment.cjs <prompt file> <workdir> [--repair-latex] [--dry]'); process.exit(1); }

const pad2 = n => String(n).padStart(2, '0');
const j = JSON.parse(fs.readFileSync(src, 'utf8'));
const chunks = (j.chunkedPrompt && j.chunkedPrompt.chunks || []).filter(c => c.role === 'model' && !c.isThought && c.text);

function parseLoose(text) {
  const tries = [text];
  // JSON 에서 허용되지 않는 역슬래시(\o \d \l 등)를 \\ 로
  tries.push(text.replace(/\\(["\\/bfnrt]|u[0-9a-fA-F]{4})|\\/g, (m, ok) => (ok ? m : '\\\\')));
  // 끝 쉼표
  tries.push(tries[1].replace(/,\s*([}\]])/g, '$1'));
  for (let i = 0; i < tries.length; i++) { try { return { value: JSON.parse(tries[i]), repaired: i > 0 }; } catch (e) { /* 다음 */ } }
  return null;
}

const LATEX_FIX = [[/\f(?=rac|orall|lat)/g, '\\f'], [/\t(?=imes|heta|ext|an\b|au\b|riangle|o\b|ilde|op\b)/g, '\\t'], [/\x08(?=eta|ar\b|ig|inom|egin|ox|ullet|ot)/g, '\\b'], [/\n(?=eq|abla|u\b|ot\b|i\b|geq|leq|mid)/g, '\\n']];
function repairLatex(v, stats) {
  if (typeof v === 'string') { let s = v; for (const [re, to] of LATEX_FIX) s = s.replace(re, () => { stats.n++; return to; }); return s; }
  if (Array.isArray(v)) return v.map(x => repairLatex(x, stats));
  if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = repairLatex(v[k], stats); return o; }
  return v;
}

const blocks = []; // {chunk, value, repaired}
const failures = [];
chunks.forEach((c, ci) => {
  const re = /```(?:json|JSON)?\s*\n([\s\S]*?)```/g;
  let m, found = 0;
  while ((m = re.exec(c.text))) {
    found++;
    const r = parseLoose(m[1].trim());
    if (!r) { failures.push({ chunk: ci, head: m[1].trim().slice(0, 80) }); continue; }
    const arr = Array.isArray(r.value) ? r.value : [r.value];
    for (const v of arr) blocks.push({ chunk: ci, value: v, repaired: r.repaired });
  }
  if (!found) { const r = parseLoose(c.text.trim()); if (r) for (const v of Array.isArray(r.value) ? r.value : [r.value]) blocks.push({ chunk: ci, value: v, repaired: r.repaired }); }
});

const jdir = path.join(work, 'judgment');
const written = new Map(); // qid -> chunk
const skipped = [];
const latexStats = { n: 0 };
for (const b of blocks) {
  const q = Number(b.value && b.value.qid);
  if (!Number.isInteger(q) || q < 1) { skipped.push({ chunk: b.chunk, why: 'qid 없음' }); continue; }
  const p = path.join(jdir, `q${pad2(q)}.json`);
  if (!fs.existsSync(p)) { skipped.push({ qid: q, chunk: b.chunk, why: '작업폴더에 빈 틀 없음(문항 번호 확인)' }); continue; }
  const skel = JSON.parse(fs.readFileSync(p, 'utf8'));
  let v = flags.has('--repair-latex') ? repairLatex(b.value, latexStats) : b.value;
  const out = { ...v, qid: q, itemFingerprint: skel.itemFingerprint, review: skel.review };
  if (!flags.has('--dry')) fs.writeFileSync(p, JSON.stringify(out, null, 2) + '\n', 'utf8');
  written.set(q, b.chunk); // 나중 것이 덮어쓴다
}
const total = fs.readdirSync(jdir).filter(f => /^q\d+\.json$/.test(f)).length;
const missing = [];
for (let i = 1; i <= total; i++) if (!written.has(i)) missing.push(i);
console.log(JSON.stringify({
  modelChunks: chunks.length, blocks: blocks.length, written: [...written.keys()].sort((a, b) => a - b).join(','),
  missingQids: missing.join(','), parseFailures: failures, skipped, repairedBlocks: blocks.filter(b => b.repaired).length,
  latexRepairs: latexStats.n, dry: flags.has('--dry'),
}));
