// 유형 은행(TYPE_BANK) 공용: 과목 설정, 등록부(분류표·크로스워크·선택표) 읽기, 메뉴 키 모으기.
// 기존 유사 도구(archive/tools/aistudio-similar)의 common.mjs 를 그대로 재사용한다.
import fs from 'node:fs';
import path from 'node:path';
import { HARNESS } from '../aistudio-similar/common.mjs';

export { HARNESS };
export { parseArgs, isMain, bankFromText, CIRCLED, choiceLib } from '../aistudio-similar/common.mjs';

const P = (...p) => path.join(HARNESS, ...p);
export const META_ROOT = P('archive/data/meta-foundation');
export const EXAMS_ROOT = P('archive/exams');
export const TYPES_DIR = P('archive/exams/types/high/h2');
export const INTEGRATION_PATTERNS = ['NONE', 'SEQUENTIAL', 'INTERDEPENDENT', 'REINTERPRETATION', 'CASE_BRANCH', 'DEEP_COMPOSITE'];
export const ROLES = {
  1: '기본형',
  2: '구조변형', 3: '구조변형',
  4: '사고확장', 5: '사고확장',
};

// 과목별 설정. 키·이름은 등록부 값 그대로다(손으로 만든 키 없음).
export const SUBJECTS = {
  geo: {
    methodExample: '평행이동한 직선으로 두 직선의 각을 한 평면 안의 각으로 바꾼다',
    label: '기하', curriculum: '2022', course: '기하', stemPrefix: '기하',
    selection: 'archive/tools/similar-import/selection/GEOMETRY.md',
    crosswalk: 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json',
    ccShards: ['coordinate-geometry', 'plane-geometry', 'trigonometry'],
    usagePrefixes: ['H22-GE', 'H15-GV'],
    anchor: 'archive/exams/original/high/h2/2mid/26_금당고_2학기_중간_고2_기하.js',
    anchorKeywords: /직선|평면|정사영|이면각|좌표|벡터|각/,
    boundary: '2022 개정 고2 「기하」(이차곡선, 평면벡터, 공간도형과 공간좌표). 이 범위 밖(미적분·확률과 통계·고등 범위를 넘는 정리)은 쓰지 않는다. 삼수선 정리·정사영·이면각·공간좌표·벡터의 내적은 써도 된다.',
    figureNote: '공간도형은 그림이 있어야 읽히는 경우가 많다. 그림이 필요한 문항은 발문에 [그림: ...]을 쓴다(점·좌표·길이·강조할 선·각을 정확히).',
  },
  calc2: {
    methodExample: '두 곡선의 교점을 구해 위아래 관계를 정한 뒤 정적분으로 넓이를 세운다',
    label: '미적분II', curriculum: '2022', course: '미적분II', stemPrefix: '미적분II',
    selection: 'archive/tools/similar-import/selection/H22_CALCULUS2.md',
    crosswalk: 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-calculus-calculus2.json',
    ccShards: ['calculus', 'functions', 'sequences', 'trigonometry'],
    usagePrefixes: ['H22-M2', 'H15-M2-09', 'H15-CALC'],
    anchor: 'archive/exams/original/high/h3/1mid/26_팔마고_1학기_중간_고3_미적분2.js',
    anchorKeywords: /정적분|적분|넓이|부피|속도|위치/,
    boundary: '2022 개정 「미적분II」(수열의 극한, 급수, 지수·로그·삼각함수의 미분, 여러 가지 미분법, 도함수의 활용, 여러 가지 적분법, 정적분의 활용). 급수·치환적분·부분적분은 써도 된다. 이 범위를 넘는 내용(예: 이상적분, 테일러 급수, 다변수)은 쓰지 않는다.',
    figureNote: '그래프가 필요한 문항은 발문에 [그림: ...]을 쓴다(곡선의 식, 교점 좌표, 색칠할 영역을 정확히). 식만으로 풀리면 그림을 넣지 않는다.',
  },
};

export const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));

/** 모든 팩의 taxonomy.json 에서 TPL/PT 를 찾는다. */
export function loadTaxonomy() {
  const dir = P('archive/data/meta-foundation/canonical/packs');
  const pts = new Map();
  const tpls = new Map();
  for (const pack of fs.readdirSync(dir)) {
    const f = path.join(dir, pack, 'taxonomy.json');
    if (!fs.existsSync(f)) continue;
    const t = readJson(f);
    for (const x of t.problemTypes || []) pts.set(x.problemTypeKey, { ...x, pack });
    for (const x of t.templates || []) tpls.set(x.templateKey, { ...x, pack });
  }
  return { pts, tpls };
}

/** 선택표(md)에서 단원 이름·소단원 이름을 읽는다. */
export function loadSelection(cfg) {
  const text = fs.readFileSync(P(cfg.selection), 'utf8');
  const units = new Map();
  let cur = null; let inSub = false;
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^## (H\d\d-[A-Z0-9]+-\d\d) (.+)$/);
    if (h) { cur = { key: h[1], name: h[2].trim(), subs: new Map() }; units.set(cur.key, cur); inSub = false; continue; }
    if (/^### 소단원/.test(line)) { inSub = true; continue; }
    if (/^### /.test(line)) { inSub = false; continue; }
    const s = line.match(/^- `([^`]+)` (.+)$/);
    if (cur && inSub && s) cur.subs.set(s[1], s[2].trim());
  }
  return units;
}

export function loadCrosswalk(cfg) {
  const rows = readJson(P(cfg.crosswalk)).records.filter(r => r.curriculum === cfg.curriculum);
  return rows.map(r => ({ ...r, path: [r.rpmPath?.majorUnit, r.rpmPath?.midUnit, r.rpmPath?.l3, r.rpmPath?.l4].filter(Boolean).join(' > ') }));
}

/** 교차개념(CC)·조건(Condition) 메뉴. 이 키만 쓸 수 있다. */
export function loadMenus(cfg) {
  const cc = new Map();
  for (const shard of cfg.ccShards) {
    const f = P('archive/data/meta-foundation/canonical/concepts', `${shard}.json`);
    for (const c of readJson(f).concepts) if (c.status === 'ACTIVE') cc.set(c.conceptKey, c.canonicalLabelKo);
  }
  const cond = new Map();
  for (const c of readJson(P('archive/data/meta-foundation/canonical/condition_registry.json')).conditions) {
    if (c.status === 'ACTIVE') cond.set(c.conditionKey, c.canonicalLabelKo);
  }
  return { cc, cond };
}

export const unitOrder = key => Number(String(key).match(/-(\d+)$/)?.[1] ?? 0);
export const oneLine = (s, n = 120) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
};
