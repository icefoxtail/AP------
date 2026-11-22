#!/usr/bin/env node
// 유사문항 보기 순서·정답 번호 분포 도구. 규칙·기준의 정본: docs/agents/similar-choices.md
//
//   판정:        node archive/tools/similar-import/choice-order-check.mjs judge <시험지.js | 폴더>... [--tsv <출력.tsv>]
//                수 보기 크기순(결함 A·B), 같은 값 보기, 정답 번호 분포, 생김새 누설 경고를 보고한다. 결함이 있으면 종료 코드 1.
//   목표 배열:   node archive/tools/similar-import/choice-order-check.mjs target <시험지.js> [--lock 3,7]
//                현재 정답 번호 열이 기준을 통과하면 그대로, 아니면 기준을 통과하는 무작위 배열 400개 중 현재와 가장 많이 겹치는 것을 고른다.
//                --lock 은 자리를 고정할 객관식 번호(1부터). 복수정답·판독 불가 문항은 자동 고정.
//   새 시험지:   node archive/tools/similar-import/choice-order-check.mjs target --count 20 --seed <시험지 이름> [--lock 3=2,7=5]
//                (--lock 위치=번호 는 그 번호로 고정). 모델에게 "랜덤으로 정하라"고 맡기지 않고 이 배열을 프롬프트에 넣는다.
import fs from 'node:fs';
import path from 'node:path';
import { readBank } from './lib.mjs';
import { analyzeChoiceOrder, answerDistribution, answerTokens, chooseTargetAnswers, drawTargetAnswers, leakWarnings } from './choice-order-lib.mjs';

const args = process.argv.slice(2);
const cmd = args.shift();
const opt = name => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };

function collect(targets) {
  const out = [];
  const walk = p => {
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      for (const e of fs.readdirSync(p).sort()) {
        if (e.endsWith('_plans') || e === 'engine_evidence') continue;
        walk(path.join(p, e));
      }
    } else if (p.endsWith('.js')) out.push(p);
  };
  targets.forEach(walk);
  return out;
}

if (cmd === 'judge') {
  const tsv = opt('--tsv');
  const files = collect(args);
  let bad = 0;
  const rows = ['file\tobjective\tdefectsAB\tduplicates\tskewed\treasons\tleakWarnings\tanswerSequence'];
  for (const f of files) {
    const { bank } = readBank(f);
    const defects = [];
    const dups = [];
    let leaks = 0;
    for (const q of bank) {
      const a = analyzeChoiceOrder(q);
      if (a.status === 'A' || a.status === 'B') defects.push(`q${q.id}${a.status}`);
      if (a.dup) dups.push(`q${q.id}`);
      if (leakWarnings(q).length) leaks++;
    }
    const d = answerDistribution(bank);
    const flagged = defects.length || dups.length || d.skewed;
    if (flagged) bad++;
    console.log(`${flagged ? 'FAIL' : 'ok  '} ${path.basename(f)}  객관식 ${d.objective}${defects.length ? `  순서결함 ${defects.join(',')}` : ''}${dups.length ? `  중복 ${dups.join(',')}` : ''}${d.skewed ? `  분포결함 ${d.reasons.join('; ')}` : ''}${leaks ? `  생김새경고 ${leaks}건` : ''}`);
    rows.push([f, d.objective, defects.join(','), dups.join(','), d.skewed ? 'Y' : 'N', d.reasons.join('; '), leaks, d.sequence].join('\t'));
  }
  if (tsv) fs.writeFileSync(tsv, rows.join('\n') + '\n');
  console.log(`\n${files.length}개 시험지 중 결함 ${bad}개`);
  process.exit(bad ? 1 : 0);
} else if (cmd === 'target') {
  const count = opt('--count');
  const seed = opt('--seed');
  const lock = opt('--lock');
  if (count) {
    if (!seed) { console.error('--count 에는 --seed 가 필요합니다'); process.exit(2); }
    const fixed = {};
    for (const part of (lock || '').split(',').filter(Boolean)) { const [pos, num] = part.split('='); fixed[Number(pos) - 1] = num; }
    const r = drawTargetAnswers({ count: Number(count), seed, fixed });
    console.log(r.ok ? r.target.join(' ') : `실패: ${r.why}`);
    process.exit(r.ok ? 0 : 1);
  }
  const file = args[0];
  if (!file) { console.error('사용법은 이 파일 머리말을 보세요'); process.exit(2); }
  const { bank } = readBank(file);
  const tokens = answerTokens(bank);
  const locked = new Set((lock || '').split(',').filter(Boolean).map(Number));
  const allowed = tokens.map((t, i) => (locked.has(i + 1) ? [t] : ['1', '2', '3', '4', '5']));
  const r = chooseTargetAnswers({ tokens, allowed, seed: path.basename(file) });
  if (!r.ok) { console.log(`실패: ${r.why}`); process.exit(1); }
  console.log(`현재  ${tokens.join(' ')}${r.unchanged ? '  (기준 통과: 그대로)' : `  (결함: ${r.reasons.join('; ')})`}`);
  console.log(`목표  ${r.target.join(' ')}`);
  console.log(`바꿀 문항(객관식 번호): ${r.changed.map(i => i + 1).join(', ') || '없음'}`);
} else {
  console.error('사용법: judge <시험지.js|폴더>... | target <시험지.js> | target --count N --seed S');
  process.exit(2);
}
