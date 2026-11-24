// 마플 대응표(mapl-types-<과목>.md) + 대기열(queue-<과목>.json, pairs-<과목>.json) → 유형 id별 PT/TPL/L4 (기계적으로 붙인다, 문항별 판정 없음).
// 과목은 환경 변수 TYPEBANK_SUBJECT(geo | calc2, 기본 geo) 또는 명령줄 `--subject=calc2` 로 고른다. 이름은 geo-map 이지만 두 과목이 같이 쓴다.
// 입력 위치(저장소 밖 작업 자료): TYPEBANK_MAPL(대응표 md), TYPEBANK_QUEUE(대기열 폴더), TYPEBANK_OUT(생성 결과 폴더), TYPEBANK_WORK(작업 폴더). 환경 변수로 바꿀 수 있다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const argSubject = process.argv.find(x => x.startsWith('--subject='))?.split('=')[1] || null;
export const SUBJECT = argSubject || process.env.TYPEBANK_SUBJECT || 'geo';
if (!['geo', 'calc2'].includes(SUBJECT)) throw new Error(`UNKNOWN_SUBJECT ${SUBJECT} (geo|calc2)`);

const WORK_BASE = process.env.TYPEBANK_WORK || 'C:/AI_WS/tmp/typebank/intake';
// 과목별 입력(저장소 밖) 위치와 RPM 행 이름. geo 의 기본값은 이전 반입과 같다.
export const SUBJECT_IO = {
  geo: { mapl: 'C:/AI_WS/tmp/typebank/mapl-types-geo.md', out: 'C:/AI_WS/tmp/typebank/out', work: WORK_BASE, rpmPrefix: 'H2-GEO-RPM-' },
  calc2: { mapl: 'C:/AI_WS/tmp/typebank/mapl-types-calc2.md', out: 'C:/AI_WS/tmp/typebank/sol/out-sol', work: `${WORK_BASE}/calc2`, rpmPrefix: 'H2-CALC-RPM-' },
}[SUBJECT];
export const PATHS = {
  mapl: process.env.TYPEBANK_MAPL || SUBJECT_IO.mapl,
  queueDir: process.env.TYPEBANK_QUEUE || 'C:/Users/USER/Desktop/AP------/.tmp/typebank/queue',
  outDir: process.env.TYPEBANK_OUT || SUBJECT_IO.out,
  work: SUBJECT === 'geo' ? WORK_BASE : (process.env.TYPEBANK_WORK_SUBJECT || SUBJECT_IO.work),
};
export const RPM_PREFIX = SUBJECT_IO.rpmPrefix;
export const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const normName = s => String(s).replace(/[|/]/g, '/').replace(/\s+/g, ' ').trim();
const MAPL_ROW = /^\| (I|II|III)\b/;

export function loadMaplRows(file = PATHS.mapl) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => MAPL_ROW.test(l)).map(l => l.split('|').map(s => s.trim()).slice(1, -1));
}
export function loadQueue(subject = SUBJECT) { return readJson(path.join(PATHS.queueDir, `queue-${subject}.json`)); }
export function loadPairs(subject = SUBJECT) { return readJson(path.join(PATHS.queueDir, `pairs-${subject}.json`)); }

/** geo-tpl-map.json 의 typeOverride: 대응표에 PT/TPL 이 없는 유형을 레지스트리 키에 직접 붙인다(근거는 파일의 _note). */
let tplMap = null;
const loadTplMap = () => (tplMap ||= (() => { try { return readJson(path.join(path.dirname(fileURLToPath(import.meta.url)), 'geo-tpl-map.json')); } catch { return {}; } })());
const typeOverride = id => (loadTplMap().typeOverride || {})[id] || null;
/** 반입하지 않는 유형(교육과정 밖 등). 이유는 geo-tpl-map.json 의 skip 에 적는다. */
export const typeSkip = id => (loadTplMap().skip || {})[id] || null;

/** 유형 id(geo_004, calc2_001 등) → 대응표 한 줄. 대기열 순서와 대응표 순서가 같다(이름이 다르면 오류). */
export function typeInfo(id, ctx = null) {
  const queue = ctx?.queue || loadQueue();
  const rows = ctx?.rows || loadMaplRows();
  const i = queue.findIndex(e => e.id === id);
  if (i < 0) throw new Error(`QUEUE_ID_NOT_FOUND ${id}`);
  const e = queue[i]; const r = rows[i];
  if (!r || normName(r[3]) !== normName(e.type)) throw new Error(`MAPL_ROW_MISMATCH ${id}: 대기열 "${e.type}" ≠ 대응표 "${r && r[3]}"`);
  const l4 = (r[7].match(/^[\d,\s]+/)?.[0] || '').split(',').map(s => s.trim()).filter(Boolean).map(n => `${RPM_PREFIX}${n.padStart(3, '0')}`);
  const tplExisting = r[9] && r[9] !== '-' ? r[9] : '';
  const tplCandidate = SUBJECT === 'geo' && r[11] && r[11] !== '-' ? r[11] : '';
  const ov = typeOverride(id);
  return {
    id, stem: e.stem, type: e.type, sec: e.sec, n: e.n, answers: e.answers, major: r[0], mid: r[1], no: r[2], gist: r[4], status: r[10],
    l4Ids: l4, pt: ov?.pt || (r[8] === '-' || r[8] === 'NO_MATCH' ? '' : r[8]), tplRaw: ov?.tpl || tplExisting || tplCandidate, tplSource: ov ? 'override' : tplExisting ? 'existing' : tplCandidate ? 'candidate' : 'none',
    l4Paths: (r[7].match(/\(([^)]*)\)/)?.[1] || '').split(';').map(s => s.trim()),
  };
}

/** 생성 결과 파일 한 개 → [{questionIndex, srcImage→유형 id}] 규칙: 파일 이름이 대기열 id면 그 유형, 아니면 pairs 의 items[srcImage-1]. */
export function typesOfOutFile(file, ctx = null) {
  const base = path.basename(file, '.js');
  const queue = ctx?.queue || loadQueue();
  if (queue.some(e => e.id === base)) return { kind: 'single', items: [base] };
  const pair = (ctx?.pairs || loadPairs()).find(p => p.id === base || p.out === path.basename(file));
  if (!pair) throw new Error(`PAIR_NOT_FOUND ${base}: pairs-${SUBJECT}.json 에 없는 묶음`);
  return { kind: 'pair', items: pair.items, pair };
}
