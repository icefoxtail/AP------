/**
 * Diagnostic pack regeneration: 하10 / 중10 / 상4 = 24문항
 * - 단원 균등 배분
 * - 같은 유형(typeKey) 중복 없음 (1차: 같은 유형 제외, 2차: 채우기)
 * - 같은 문항(_qKey) 중복 없음 (팩 내/팩 간)
 * - 배열: 하(1-10) → 중(11-20) → 상(21-24)
 */

'use strict';
const fs = require('fs');
const path = require('path');

const EXAMS_BASE = path.resolve('./archive/exams');
const PACKS_FILE = path.resolve('./archive/assessment/assessment-packs-1sem.generated.js');

// ── 소스 로딩 ─────────────────────────────────────────────────────────────────

function loadFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const w = {};
    new Function('window', code)(w);
    const bank = (w.questionBank || w.examQuestions || []).filter(q => q && typeof q === 'object');
    const rel = path.relative(EXAMS_BASE, filePath).split(path.sep).join('/');
    const title = w.examTitle || path.basename(filePath, '.js');
    return bank.map(q => ({
      ...q,
      // 레벨 정규화: '[하]' → '하'
      level: String(q.level || '').replace(/[[\]]/g, '').trim(),
      _sourceTitle: title,
      _sourceFile: rel,
      _sourceQuestionNo: q.id,
      _qKey: rel + '_' + q.id,
      _assessmentSkill: q._assessmentSkill || q.skill || '',
      _assessmentQualityScore: q._assessmentQualityScore || q.qualityScore || 80,
    }));
  } catch { return []; }
}

function loadDirRec(dir) {
  if (!fs.existsSync(dir)) return [];
  let all = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) all = all.concat(loadDirRec(full));
    else if (e.name.endsWith('.js')) all = all.concat(loadFile(full));
  }
  return all;
}

function valid(qs) {
  return qs.filter(q => ['하', '중', '상'].includes(q.level) && !q.hasImage && !q.wide);
}

// ── 유형 키 추출 ──────────────────────────────────────────────────────────────

const FORM_TAGS = new Set(['객관식', '단답형', '서술형', '복수정답', '그림', '표',
  '계산', '참거짓', '추론', '활용', '문제해결', '측정', '증명']);

function getTypeKey(q) {
  // 모든 수학 개념 태그를 정렬해 유형 식별 (slice(0,3)은 정보 손실 있음)
  const contentTags = (q.tags || []).filter(t => !FORM_TAGS.has(t)).sort();
  return (q.standardUnitKey || '') + ':' + contentTags.join(',');
}

// ── 문항 선택 ─────────────────────────────────────────────────────────────────

/**
 * pool에서 n개 선택
 * - usedGlobal: 팩 간 중복 방지
 * - usedType: 같은 유형 중복 방지 (유연 처리)
 */
function selectN(pool, n, usedGlobal, usedType = new Set()) {
  if (n <= 0) return [];
  const sorted = pool
    .filter(q => !usedGlobal.has(q._qKey))
    .sort((a, b) => (b._assessmentQualityScore || 80) - (a._assessmentQualityScore || 80));

  const chosen = [];

  // 1차: 유형 중복 없이 선택
  for (const q of sorted) {
    if (chosen.length >= n) break;
    const tk = getTypeKey(q);
    if (usedType.has(tk)) continue;
    chosen.push(q);
    usedType.add(tk);
    usedGlobal.add(q._qKey);
  }

  // 2차: 유형 중복 허용하고 채우기 (부족한 경우). usedType도 갱신해 후속 그룹 간 중복 최소화
  if (chosen.length < n) {
    const chosenKeys = new Set(chosen.map(q => q._qKey));
    for (const q of sorted) {
      if (chosen.length >= n) break;
      if (chosenKeys.has(q._qKey) || usedGlobal.has(q._qKey)) continue;
      chosen.push(q);
      usedGlobal.add(q._qKey);
      usedType.add(getTypeKey(q));
    }
  }

  return chosen;
}

/**
 * unitGroups 기반 단원 배분 선택
 * unitGroups: [{ pool, ha, jung, sang }]
 * 반환: { ha[], jung[], sang[] }
 */
function selectByUnitGroups(unitGroups, usedGlobal) {
  const allHa = [], allJung = [], allSang = [];
  // 난이도별 독립 유형 추적: 하끼리/중끼리/상끼리만 유형 중복 방지
  // (같은 유형이 하에도, 중에도 있는 것은 괜찮음 — 난이도가 다른 문제)
  const typeUsed = { 하: new Set(), 중: new Set(), 상: new Set() };

  for (const g of unitGroups) {
    const byLevel = {
      하: g.pool.filter(q => q.level === '하'),
      중: g.pool.filter(q => q.level === '중'),
      상: g.pool.filter(q => q.level === '상'),
    };
    allHa.push(...selectN(byLevel['하'], g.ha,   usedGlobal, typeUsed['하']));
    allJung.push(...selectN(byLevel['중'], g.jung, usedGlobal, typeUsed['중']));
    allSang.push(...selectN(byLevel['상'], g.sang, usedGlobal, typeUsed['상']));
  }

  return { ha: allHa, jung: allJung, sang: allSang };
}

// ── 소스 풀 로딩 ──────────────────────────────────────────────────────────────

const m1types = valid(loadDirRec(path.join(EXAMS_BASE, 'types/middle/m1')));
const m2orig  = valid(loadDirRec(path.join(EXAMS_BASE, 'original/middle/m2')));
const m3orig  = valid(loadDirRec(path.join(EXAMS_BASE, 'original/middle/m3')));
const m3sim   = valid(loadDirRec(path.join(EXAMS_BASE, 'similar/middle/m3')));
const m3all   = [...m3orig, ...m3sim];
const h1all   = valid(loadDirRec(path.join(EXAMS_BASE, 'original/high/h1')));
const h1mid   = h1all.filter(q => q._sourceFile.includes('/1mid/'));
const h1final = h1all; // 기말은 전체(중간+기말)

// ── 팩별 설정 ─────────────────────────────────────────────────────────────────

const PACK_CONFIGS = [
  // ── 중1 ───────────────────────────────────────────────────────────────────
  {
    id: 'DIAG_1SEM_M1_U12_25',
    unitGroups: [
      // M1-01: 소인수분해 (하5/중5/상2 = 12)
      { pool: m1types.filter(q => q.standardUnitKey === 'M1-01'), ha: 5, jung: 5, sang: 2 },
      // M1-02: 정수와 유리수 (하5/중5/상2 = 12)
      { pool: m1types.filter(q => q.standardUnitKey === 'M1-02'), ha: 5, jung: 5, sang: 2 },
    ],
    scopeLabel: '소인수분해(M1-01) 12문항, 정수와 유리수(M1-02) 12문항',
  },
  {
    id: 'DIAG_1SEM_M1_U34_25',
    unitGroups: [
      // 문자와 식 (ALGEBRAIC_EXPRESSION, 하5/중5/상2 = 12)
      { pool: m1types.filter(q => q.standardUnitKey === 'M1-03' && q.conceptClusterKey === 'ALGEBRAIC_EXPRESSION'), ha: 5, jung: 5, sang: 2 },
      // 일차방정식 (LINEAR_EQUATION, 하5/중5/상2 = 12)
      { pool: m1types.filter(q => q.standardUnitKey === 'M1-03' && q.conceptClusterKey === 'LINEAR_EQUATION'), ha: 5, jung: 5, sang: 2 },
    ],
    scopeLabel: '문자와 식 12문항, 일차방정식 12문항',
  },

  // ── 중2 ───────────────────────────────────────────────────────────────────
  {
    id: 'DIAG_1SEM_M2_U123_25',
    unitGroups: [
      // M2-01: 유리수와 순환소수 (하4/중3/상1 = 8)
      { pool: m2orig.filter(q => q.standardUnitKey === 'M2-01'), ha: 4, jung: 3, sang: 1 },
      // M2-02: 식의 계산 (하2/중4/상2 = 8) — 하 풀이 3개뿐이라 2개 선택
      { pool: m2orig.filter(q => q.standardUnitKey === 'M2-02'), ha: 2, jung: 4, sang: 2 },
      // M2-03: 일차부등식 (하4/중3/상1 = 8)
      { pool: m2orig.filter(q => q.standardUnitKey === 'M2-03'), ha: 4, jung: 3, sang: 1 },
    ],
    scopeLabel: '유리수와 순환소수(M2-01) 8문항, 식의 계산(M2-02) 8문항, 일차부등식(M2-03) 8문항',
  },

  // ── 중3 ───────────────────────────────────────────────────────────────────
  {
    id: 'DIAG_1SEM_M3_U12_25',
    unitGroups: [
      // M3-01: 실수와 그 계산 (하5/중5/상2 = 12)
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-01'), ha: 5, jung: 5, sang: 2 },
      // M3-02: 다항식의 곱셈과 인수분해 (하5/중5/상2 = 12)
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-02'), ha: 5, jung: 5, sang: 2 },
    ],
    scopeLabel: '실수와 그 계산(M3-01) 12문항, 다항식의 곱셈과 인수분해(M3-02) 12문항',
  },
  {
    id: 'DIAG_1SEM_M3_U34_25',
    unitGroups: [
      // M3-03: 이차방정식 (하5/중5/상2 = 12)
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-03'), ha: 5, jung: 5, sang: 2 },
      // M3-04: 이차함수 (하5/중5/상2 = 12)
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-04'), ha: 5, jung: 5, sang: 2 },
    ],
    scopeLabel: '이차방정식(M3-03) 12문항, 이차함수(M3-04) 12문항',
  },
  {
    id: 'DIAG_1SEM_M3_U1234_25',
    // U12, U34 이후 처리 → 전체 M3에서 중복 없이 선택
    unitGroups: [
      // M3-01: 하3/중3/상1 = 7
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-01'), ha: 3, jung: 3, sang: 1 },
      // M3-02: 하3/중3/상1 = 7
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-02'), ha: 3, jung: 3, sang: 1 },
      // M3-03: 하2/중2/상1 = 5
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-03'), ha: 2, jung: 2, sang: 1 },
      // M3-04: 하2/중2/상1 = 5
      { pool: m3all.filter(q => q.standardUnitKey === 'M3-04'), ha: 2, jung: 2, sang: 1 },
    ],
    scopeLabel: '실수(M3-01) 7문항, 인수분해(M3-02) 7문항, 이차방정식(M3-03) 5문항, 이차함수(M3-04) 5문항',
  },

  // ── 고1 ───────────────────────────────────────────────────────────────────
  {
    id: 'DIAG_1SEM_H1_MID_25',
    // 고1 중간: 다항식 + 방정식/부등식
    // 주요 단원 키: H15-SA-01~08, H15-SA-13, H22-C-01~05
    unitGroups: [
      // 다항식 연산군 (H15-SA-01, H22-C-01, H22-C-02, H22-C-03): 하4/중4/상2 = 10
      { pool: h1mid.filter(q => ['H15-SA-01', 'H22-C-01', 'H22-C-02', 'H22-C-03'].includes(q.standardUnitKey)), ha: 4, jung: 4, sang: 2 },
      // 방정식 군 (H15-SA-02~06, H22-C-04, H22-C-05): 하4/중4/상1 = 9
      { pool: h1mid.filter(q => ['H15-SA-02', 'H15-SA-03', 'H15-SA-04', 'H15-SA-05', 'H15-SA-06', 'H22-C-04', 'H22-C-05'].includes(q.standardUnitKey)), ha: 4, jung: 4, sang: 1 },
      // 부등식 군 (H15-SA-07, H15-SA-08, H15-SA-13): 하2/중2/상1 = 5
      { pool: h1mid.filter(q => ['H15-SA-07', 'H15-SA-08', 'H15-SA-13'].includes(q.standardUnitKey)), ha: 2, jung: 2, sang: 1 },
    ],
    scopeLabel: '다항식 10문항, 방정식 9문항, 부등식 5문항',
  },
  {
    id: 'DIAG_1SEM_H1_FINAL_25',
    // 고1 기말: 중간범위 + 기말 추가범위(도형의 방정식 H22-C-06~09)
    unitGroups: [
      // 기말 새 단원 (H22-C-06~09): 하5/중5/상2 = 12
      { pool: h1final.filter(q => ['H22-C-06', 'H22-C-07', 'H22-C-08', 'H22-C-09'].includes(q.standardUnitKey)), ha: 5, jung: 5, sang: 2 },
      // 중간범위 복습 (H15-SA-01~05, H22-C-04, H22-C-05): 하3/중3/상1 = 7
      { pool: h1final.filter(q => ['H15-SA-01', 'H15-SA-02', 'H15-SA-03', 'H15-SA-04', 'H15-SA-05', 'H22-C-04', 'H22-C-05'].includes(q.standardUnitKey)), ha: 3, jung: 3, sang: 1 },
      // 방정식/부등식 (H22-C-01~03, H15-SA-07, H15-SA-08): 하2/중2/상1 = 5
      { pool: h1final.filter(q => ['H22-C-01', 'H22-C-02', 'H22-C-03', 'H15-SA-07', 'H15-SA-08'].includes(q.standardUnitKey)), ha: 2, jung: 2, sang: 1 },
    ],
    scopeLabel: '도형의 방정식(H22-C-06~09) 12문항, 방정식/부등식 복습 12문항',
  },
];

// ── 메인 ──────────────────────────────────────────────────────────────────────

const w = {};
new Function('window', fs.readFileSync(PACKS_FILE, 'utf8'))(w);
const data = w.APMATH_ASSESSMENT_PACKS_1SEM;

const usedGlobal = new Set(); // 팩 간 중복 방지

for (const cfg of PACK_CONFIGS) {
  const pack = data.packs.find(p => p.id === cfg.id);
  if (!pack) { console.warn('팩 없음:', cfg.id); continue; }

  const { ha, jung, sang } = selectByUnitGroups(cfg.unitGroups, usedGlobal);

  const haCount   = ha.length;
  const jungCount = jung.length;
  const sangCount = sang.length;
  const total     = haCount + jungCount + sangCount;

  if (haCount < 10 || jungCount < 10 || sangCount < 4) {
    console.warn(`WARNING ${cfg.id}: 하${haCount}/중${jungCount}/상${sangCount} (목표 10/10/4)`);
  }

  const questions = [...ha, ...jung, ...sang].map(q => ({ ...q, _assessmentPackId: cfg.id }));

  pack.questions     = questions;
  pack.questionCount = total;
  pack.difficultyMix = { 하: haCount, 중: jungCount, 상: sangCount };
  pack.estimatedMinutes = Math.round(total * 1.6);
  pack.scopeLabel    = cfg.scopeLabel || pack.scopeLabel;
  pack.unitLabel     = cfg.scopeLabel || pack.unitLabel;

  // 단원별 실제 배분 로그
  const unitDist = {};
  questions.forEach(q => {
    const uk = q.standardUnitKey || q.conceptClusterKey || 'none';
    if (!unitDist[uk]) unitDist[uk] = { 하:0,중:0,상:0 };
    unitDist[uk][q.level]++;
  });

  console.log(`\n${cfg.id} | 하${haCount} 중${jungCount} 상${sangCount} = ${total}`);
  Object.entries(unitDist).forEach(([uk, c]) => {
    console.log(`  ${uk}: 하${c.하||0} 중${c.중||0} 상${c.상||0}`);
  });
}

// ── 파일 쓰기 ─────────────────────────────────────────────────────────────────

data.sourceSummary = {
  ...data.sourceSummary,
  diagnosticRegen: '2026-06-04: 하10/중10/상4=24, 단원균등배분, 유형중복제거, 팩간중복제거',
};

const commentLine = fs.readFileSync(PACKS_FILE, 'utf8').split('\n')[0];
const newContent = commentLine + '\n(function(){\n  window.APMATH_ASSESSMENT_PACKS_1SEM = ' +
  JSON.stringify(data, null, 2) + '\n})();\n';

fs.writeFileSync(PACKS_FILE, newContent, 'utf8');
console.log('\n✓ 파일 저장 완료:', PACKS_FILE);
