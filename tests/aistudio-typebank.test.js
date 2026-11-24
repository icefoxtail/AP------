// 유형 은행(기하·미적분II) 반입 도구와 반입 결과의 온전성. 문항 수·내용 고정이 아니라 결함 조건(0이어야 하는 것)만 본다.
//  - 도구: 난이도 꼬리표 제거·역슬래시 복구·그림 자리표시 추출, 파일 이름에 못 쓰는 문자 제거 규칙.
//  - 결과: archive/exams/types/high/h2 의 `*_유형은행N.js` 마다 PT/TPL/난이도(정수 1~5)/RPM 리프가 있고, 키가 분류표·크로스워크에 있고,
//    정답이 보기 범위 안이며 해설 마지막 줄 정답과 같고, 짝이 되는 4칸 compact 파일이 있으며, 발문에 난이도 꼬리표가 남지 않았다.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const { pathToFileURL } = require('url');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const typesDir = path.join(root, 'archive/exams/types/high/h2');
const compactDir = path.join(root, 'archive/data/item-4slot/types/high/h2');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const CIRCLED = ['①', '②', '③', '④', '⑤'];

(async () => {
  const tb = await import(pathToFileURL(path.join(root, 'archive/tools/aistudio-typebank/typebank-geo.mjs')).href);

  // ---- 도구 규칙(순수 함수는 aistudio-typebank-geo.test.js 가 본다. 여기는 묶음 판정 펼치기) ----
  const q = { id: 1, content: '포물선 $y^2=4x$ 의 초점을 구하시오.', choices: ['$1$', '$2$', '$3$', '$4$', '$5$'], answer: '①' };
  const group = { stem: 's', info: { l4Ids: ['R1'] }, items: [q, { ...q, id: 2 }] };
  const { out, missing } = tb.expandBatchResult({ items: [{ stem: 's', qid: 1, crossConceptKeys: ['CC_A'], difficultyBucket: 1, slots: { goal: [], method: [], given: [], condition: [] }, answerFlag: true, answerFlagReason: '보기와 안 맞음' }, { stem: 'x', qid: 1 }] }, [group]);
  assert.strictEqual(out.get('s').length, 1);
  assert.strictEqual(out.get('s')[0].rpmRecordId, 'R1', '후보가 하나이거나 안 정하면 첫 L4 를 붙인다');
  assert.strictEqual(out.get('s')[0].answerDoubt, '보기와 안 맞음', 'answerFlag 는 정답 의심 목록으로 간다');
  assert.deepStrictEqual(missing, ['s#2'], '응답에 없는 문항은 누락으로 보고한다');

  // ---- 반입 결과 ----
  if (!fs.existsSync(typesDir)) { console.log('aistudio-typebank.test.js: types 폴더 없음, 결과 검사 건너뜀'); return; }
  const taxonomy = new Map(); const tplParent = new Map();
  const packs = path.join(root, 'archive/data/meta-foundation/canonical/packs');
  for (const d of fs.readdirSync(packs)) {
    const f = path.join(packs, d, 'taxonomy.json'); if (!fs.existsSync(f)) continue;
    const t = read(f);
    for (const p of t.problemTypes) taxonomy.set(p.problemTypeKey, true);
    for (const x of t.templates) tplParent.set(x.templateKey, x.parentProblemTypeKey);
  }
  const rpmIds = new Set();
  const cwDir = path.join(root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');
  for (const f of fs.readdirSync(cwDir).filter(f => f.endsWith('.json'))) { const d = read(path.join(cwDir, f)); for (const r of d.records || []) rpmIds.add(r.id); }

  // git 이 추적하는 파일만 본다(작업 중인 PREPPED 초안은 메타·4칸이 아직 없다). git 을 못 쓰면 폴더 전체.
  let tracked = null;
  try { tracked = new Set(execFileSync('git', ['ls-files', '--', 'archive/exams/types/high/h2'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean).map(p => path.basename(p))); } catch { /* 폴더 전체 */ }
  // 작업 중(커밋 안 된 수정) 파일은 뺀다. CI 에는 이런 파일이 없다.
  try { for (const p of execFileSync('git', ['diff', '--name-only', '--', 'archive/exams/types/high/h2'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)) tracked && tracked.delete(path.basename(p)); } catch { /* 무시 */ }
  const files = fs.readdirSync(typesDir).filter(f => /_유형은행\d+\.js$/.test(f) && (!tracked || tracked.has(f)));
  const problems = [];
  for (const f of files) {
    const ctx = { window: {} }; vm.createContext(ctx);
    new vm.Script(fs.readFileSync(path.join(typesDir, f), 'utf8'), { filename: f }).runInContext(ctx);
    const bank = ctx.window.questionBank;
    if (!Array.isArray(bank) || !bank.length) { problems.push(`${f}: 문항이 없다`); continue; }
    const stem = f.replace(/\.js$/, '');
    if (!fs.existsSync(path.join(compactDir, `${stem}.4slot.json`))) problems.push(`${f}: 4칸 compact 가 없다`);
    for (const q of bank) {
      const at = `${f} #${q.id}`;
      if (!q.problemTypeKey || !taxonomy.has(q.problemTypeKey)) problems.push(`${at}: PT ${q.problemTypeKey} 가 분류표에 없다`);
      if (!q.templateKey || tplParent.get(q.templateKey) !== q.problemTypeKey) problems.push(`${at}: TPL ${q.templateKey} 가 PT ${q.problemTypeKey} 아래에 없다`);
      if (!q.rpmPrimaryRecordId || !rpmIds.has(q.rpmPrimaryRecordId)) problems.push(`${at}: rpmPrimaryRecordId ${q.rpmPrimaryRecordId} 가 크로스워크에 없다`);
      if (!Number.isInteger(q.difficultyBucket) || q.difficultyBucket < 1 || q.difficultyBucket > 5) problems.push(`${at}: 난이도 ${q.difficultyBucket}`);
      if ('level' in q) problems.push(`${at}: 하/중/상(level)은 쓰지 않는다`);
      if (!Array.isArray(q.choices) || q.choices.length !== 5 || !CIRCLED.includes(q.answer)) problems.push(`${at}: 보기·정답 형식`);
      const last = String(q.solution || '').trim().split('\n').pop();
      if (!new RegExp(`정답은\\s*${q.answer}`).test(last)) problems.push(`${at}: 해설 마지막 줄이 정답 ${q.answer} 와 다르다`);
      if (/^\s*[\[(](최상|최하|상|중|하)[\])]|[\[(](최상|최하|상|중|하)[\])]\s*$/m.test(q.content)) problems.push(`${at}: 발문에 난이도 꼬리표가 남았다`);
    }
  }
  assert.deepStrictEqual(problems.slice(0, 20), [], `유형 은행 결함 ${problems.length}건`);
  console.log(`aistudio-typebank.test.js: ${files.length}개 파일 결함 0`);
})().catch(e => { console.error(e); process.exit(1); });
