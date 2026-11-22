#!/usr/bin/env node
// 사용법: node plan-answers.mjs <원본 시험지 저장소 경로> [--name <유사 시험지 이름>] [--out <target.json>]
//   예: node plan-answers.mjs archive/exams/original/high/h2/2mid/26_제일고_2학기_중간_고2_확률과통계.js
// 원본(origin/main)에서 객관식 문항을 찾아, 기준(docs/agents/similar-choices.md)을 통과하는 목표 정답 번호를 스크립트로 뽑는다.
// seed = 유사 시험지 파일 이름(기본: 원본 이름 + _유사). 같은 이름이면 항상 같은 배열이다.
// 출력: Gemini 요청에 붙일 한국어 줄(전체, 전반, 후반)과 target.json(나중에 lint-similar 가 대조).
import fs from 'node:fs';
import path from 'node:path';
import { choiceLib, gitShow, bankFromText, stemOf, parseArgs, isMain, WORK_ROOT, CIRCLED } from './common.mjs';

export const INSTRUCTION = '지정 번호 자리에 정답 값이 오도록 오답 4개를 새로 짓고 수 보기는 크기순으로 둔다. 오답은 가능한 값이되 제2 정답이 되면 안 되고, 정답이 생김새(혼자 근호·분수·음수·간격 튐)로 드러나지 않게 한다. 분수·근호 보기는 다섯 개를 같은 꼴(약분 여부, 분자·분모 모양)로 맞춘다. 보기 순서에 관례가 있는 문항(ㄱ·ㄴ·ㄷ 조합 등)은 관례를 지키고 그 문항의 번호 지정은 무시한다. 정답 번호가 바뀌면 해설 속 번호 언급도 맞춘다.';

export async function planAnswers({ originalPath, name = null }) {
  const C = await choiceLib();
  const origStem = stemOf(originalPath);
  const simStem = name || `${origStem}_유사`;
  const { bank } = bankFromText(gitShow(originalPath), originalPath);
  const objIdx = bank.map((q, i) => (C.isObjectiveItem(q) ? i : -1)).filter(i => i >= 0);
  const drawn = C.drawTargetAnswers({ count: objIdx.length, seed: simStem });
  if (!drawn.ok) throw new Error(`목표 정답 배열을 뽑지 못했습니다: ${drawn.why}`);
  const target = {};
  objIdx.forEach((bi, k) => { target[bank[bi].id] = Number(drawn.target[k]); });
  const conventional = objIdx.filter(i => C.analyzeChoiceOrder(bank[i]).status === 'NOT_NUMERIC').map(i => bank[i].id);
  return {
    schema: 'pilot-target-v1', seed: simStem, original: originalPath, count: bank.length,
    types: Object.fromEntries(bank.map(q => [q.id, q.questionType])),
    objectiveIds: objIdx.map(i => bank[i].id), target, nonNumericOriginalIds: conventional,
  };
}

export function formatLine(target, ids = null) {
  const keys = Object.keys(target).map(Number).filter(id => !ids || ids.includes(id)).sort((a, b) => a - b);
  return `정답 번호 지정: ${keys.map(id => `${id}번 ${CIRCLED[target[id] - 1]}`).join(', ')}`;
}

if (isMain(import.meta.url)) {
  const { pos, opt } = parseArgs(process.argv.slice(2));
  if (!pos[0]) { console.error('Usage: node plan-answers.mjs <원본 저장소 경로> [--name <유사 이름>] [--out <target.json>]'); process.exit(1); }
  try {
    const plan = await planAnswers({ originalPath: pos[0].replaceAll('\\', '/'), name: opt['--name'] });
    const out = opt['--out'] ? path.resolve(opt['--out']) : path.join(WORK_ROOT, plan.seed, 'target.json');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(plan, null, 2) + '\n', 'utf8');
    const half = Math.ceil(plan.count / 2);
    const all = Array.from({ length: plan.count }, (_, i) => i + 1);
    console.log(`# ${plan.seed} · ${plan.count}문항 중 객관식 ${plan.objectiveIds.length} · target: ${out}`);
    if (plan.nonNumericOriginalIds.length) console.log(`# 원본 보기가 수가 아닌 객관식(관례 순서일 수 있음): ${plan.nonNumericOriginalIds.join(', ')}번`);
    console.log('\n[전체]');
    console.log(formatLine(plan.target));
    console.log(`\n[전반 1~${half}번 요청에 붙일 것]`);
    console.log(formatLine(plan.target, all.slice(0, half)));
    console.log(`\n[후반 ${half + 1}~${plan.count}번 요청에 붙일 것]`);
    console.log(formatLine(plan.target, all.slice(half)));
    console.log(`\n[공통 지시 — 위 줄 바로 뒤에 붙인다]\n${INSTRUCTION}`);
  } catch (e) { console.error('ERROR:', e.message); process.exit(1); }
}
