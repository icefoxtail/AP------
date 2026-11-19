#!/usr/bin/env node
// 사용법: node refresh-stage.mjs <유사.js> <작업폴더> [--rebind 3,7]
// 판정을 받은 뒤 유사 JS 를 고쳤을 때(경량 검수에서 답·표현을 고침) 스테이지와 후보를 다시 만든다.
//  - 판정 파일은 덮지 않는다(build-candidates --force 를 쓰면 판정이 지워진다. 쓰지 않는다).
//  - 문항 내용이 바뀐 판정은 itemFingerprint 가 달라져 check-judgment 가 STALE_OR_EXAMPLE 로 막는다. 그 문항 목록을 보여 준다.
//  - --rebind 로 지정한 문항은 고친 문항을 읽고 판정(풀이·인용·단원·유형)을 다시 확인·수정했다는 뜻이다. 지문(itemFingerprint)만 새 값으로 맞춘다.
//    그 뒤 check-judgment 가 인용 포함·정답 일치를 다시 검사한다.
import fs from 'node:fs';
import path from 'node:path';
import { lib, parseArgs, isMain, bankFromText } from './common.mjs';
import { prepare } from './pack-judgment.mjs';

if (isMain(import.meta.url)) {
  const { pos, opt } = parseArgs(process.argv.slice(2));
  if (pos.length < 2) { console.error('Usage: node refresh-stage.mjs <유사.js> <작업폴더> [--rebind 3,7]'); process.exit(1); }
  const workDir = path.resolve(pos[1]);
  try {
    const L = await lib();
    const prep = await prepare({ simPath: path.resolve(pos[0]), workDir });
    const { bank } = bankFromText(fs.readFileSync(prep.stageJs, 'utf8'));
    const rebind = new Set((opt['--rebind'] || '').split(',').filter(Boolean).map(Number));
    const stale = []; const rebound = [];
    for (const q of bank) {
      const p = path.join(workDir, 'judgment', `q${String(q.id).padStart(2, '0')}.json`);
      const j = JSON.parse(fs.readFileSync(p, 'utf8'));
      const fp = L.itemFingerprint(q);
      if (j.itemFingerprint === fp) continue;
      if (rebind.has(q.id)) { j.itemFingerprint = fp; fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8'); rebound.push(q.id); }
      else stale.push(q.id);
    }
    console.log(JSON.stringify({ stage: prep.stageJs, 지문이_바뀌어_막힌_문항: stale, 지문을_새_값으로_맞춘_문항: rebound }));
    if (stale.length) console.log(`판정을 다시 읽고 고친 문항이면: node refresh-stage.mjs <유사.js> <작업폴더> --rebind ${stale.join(',')}  (바뀐 문항의 judgment 를 먼저 고친 뒤)`);
  } catch (e) { console.error('ERROR:', e.message); process.exit(1); }
}
