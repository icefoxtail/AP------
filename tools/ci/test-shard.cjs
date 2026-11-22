'use strict';
// 전체 테스트(tools/run-tests.js)를 여러 러너에 나눠 돌리기 위한 결정적 분할.
// - 같은 입력(이름 목록 + 시간 자료)이면 어느 러너에서 계산해도 같은 분할이 나온다.
// - 합집합 == 전체, 교집합 == 공집합이다(항목마다 정확히 한 샤드). 시간 자료에 없는 항목은 기본 시간으로 넣는다.
// - 시간 자료(tools/ci/test-durations.json)는 분할을 고르게 하는 힌트일 뿐이라, 낡거나 비어도 어떤 테스트도 빠지지 않는다.
const fs = require('fs');
const path = require('path');

const DURATIONS_FILE = path.join(__dirname, 'test-durations.json');
const FALLBACK_SECONDS = 5;

function parseShardArg(value) {
  const match = /^([1-9]\d{0,2})\/([1-9]\d{0,2})$/.exec(String(value ?? ''));
  if (!match) throw new Error('usage: --shard <index>/<total> (1-based, e.g. 2/3)');
  const index = Number(match[1]);
  const total = Number(match[2]);
  if (index > total) throw new Error(`shard index ${index} is greater than the shard count ${total}`);
  return { index, total };
}

function loadDurations(file = DURATIONS_FILE) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const seconds = data && typeof data.seconds === 'object' && data.seconds ? data.seconds : {};
    const fallback = Number.isFinite(data?.defaultSeconds) && data.defaultSeconds > 0 ? data.defaultSeconds : FALLBACK_SECONDS;
    return { seconds, defaultSeconds: fallback };
  } catch {
    return { seconds: {}, defaultSeconds: FALLBACK_SECONDS };
  }
}

// items: [{ name, ... }]. 이름은 한 실행 안에서 유일해야 한다(같으면 목록 순서로 구분한다).
// 반환: items의 부분 배열(원래 순서 유지). 가장 긴 것부터 가장 가벼운 샤드에 넣는 탐욕 분할(LPT).
function assignShards(items, total, durations = loadDurations()) {
  if (!Number.isInteger(total) || total < 1) throw new Error('shard total must be a positive integer');
  const weight = item => {
    const known = durations.seconds[item.name];
    return Number.isFinite(known) && known > 0 ? known : durations.defaultSeconds;
  };
  const order = items.map((item, position) => ({ item, position, weight: weight(item) }))
    .sort((a, b) => b.weight - a.weight || (a.item.name < b.item.name ? -1 : a.item.name > b.item.name ? 1 : a.position - b.position));
  const load = new Array(total).fill(0);
  const shardOf = new Array(items.length);
  for (const entry of order) {
    let best = 0;
    for (let s = 1; s < total; s += 1) if (load[s] < load[best]) best = s;
    load[best] += entry.weight;
    shardOf[entry.position] = best + 1;
  }
  return { shardOf, load };
}

function selectShard(items, { index, total }, durations = loadDurations()) {
  if (total === 1) return items.slice();
  const { shardOf } = assignShards(items, total, durations);
  return items.filter((_, position) => shardOf[position] === index);
}

module.exports = { DURATIONS_FILE, FALLBACK_SECONDS, parseShardArg, loadDurations, assignShards, selectShard };
