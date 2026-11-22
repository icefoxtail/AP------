#!/usr/bin/env node
// plan-autofix: plan-lint 가 짚은 오류 중 "고치는 법이 하나로 정해지고 학생이 보는 값이 바뀌지 않는 것"만 plan 파일을 직접 고친다.
//
//   node plan-autofix.cjs [--dry] [--json] [--list 파일(줄마다 plan 경로)] <plan.json | 폴더>…     (--dry: 파일을 쓰지 않고 결과만 낸다)
//   줄마다: <라벨>: <최종 lint 결과 OK|코드> | 수리 <종류, …|없음>   (--json: 줄마다 {file,changes,before,after})
//
// 고치는 것(lint 가 그 오류를 짚은 plan 에서만, 그 오류에 해당하는 곳만):
//   A11Y_REMOVE      stat/set/lattice/container plan 의 최상위 accessibilityDescription 삭제(엔진이 받지 않는 필드)
//   ANGLE_LABEL      planeMarks.angles[].label 의 ∠·°를 뺀다("∠A=40°"→"A=40", "40°"→"40": 엔진이 ° 를 붙인다)
//   CURVE_LABEL      곡선·직선 라벨의 −(U+2212)→-, 위첨자 숫자 ²³ 등→^2 ^3 (고친 글이 ASCII 패턴을 통과할 때만)
//   ADD_REQUIRED     엔진이 계산해 알려 준 극값·꼭짓점을 requiredPoints 에 새 id(사용하지 않는 대문자)로 추가
//   TICK_PI_END      삼각함수 axisTickValues.x 에서 sourceDomain.rangePi 끝값과 같은 π 눈금 삭제
//   TICK_ZERO        axisTickValues 에서 0 삭제(INVALID_AXIS_TICK_VALUE 가 짚은 축)
//   DECIMAL_EXACT    sourceDomain.range·불연속 조각 domain/coefficients 의 소수를 같은 값의 분수 문자열로
//   NORMAL_UNITS     정규분포 표준정규 곡선에 실제 값 text 를 쓴 눈금을 실제 단위(curve mean·sd, 눈금 x)로(숫자 text 눈금 둘 이상이 한 직선에 놓일 때만)
//   SET_SPLIT        벤다이어그램 원소 text 의 "4, 12"(숫자를 쉼표로 묶음)를 원소별 항목으로(고친 뒤 그 오류가 사라질 때만)
// 일부러 남기는 것(학생이 보는 값이 바뀌거나 판단이 필요하다): 곡선 삭제·capability 바꾸기·점 값 바꾸기·근호 눈금 삭제·행 label/수형도 label 줄이기·
//   sampleNote 삭제·requiredPoints 의 극한점 삭제·정규분포 눈금 단위 바꾸기·overlays 점과 겹치는 꼭짓점 추가 등. 이런 plan 은 lint 가 계속 짚는다.
'use strict';
const fs = require('fs'), path = require('path');
const { createLinter, collectPlanFiles, labelOf } = require('./plan-lint.cjs');

const NO_A11Y_CAPS = new Set(['stat-chart-figure-v1', 'set-diagram-figure-v1', 'lattice-path-figure-v1', 'container-fill-figure-v1']); // ds-plan-lib.cjs 와 같다
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const SUPER = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const LABEL_OK = /^[0-9A-Za-z=+\-*/().^ ]{1,40}$/;

// plan 안의 모든 graphPlan(최상위, 패널, referenceCurves)
function graphPlans(plan) {
  const out = [];
  const add = g => { if (isObj(g)) out.push(g); };
  add(plan.graphPlan);
  for (const p of plan.panels || []) add(p && p.plan && p.plan.graphPlan);
  if (isObj(plan.graphPlan) && isObj(plan.graphPlan.referenceCurves)) add(plan.graphPlan.referenceCurves);
  return out;
}
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
// "-0.3" 또는 -0.3 → "-3/10"; 정수·이미 분수·근호 문자열은 null(바꾸지 않는다)
function decimalToFraction(v) {
  const t = typeof v === 'number' ? String(v) : v;
  const m = /^(-?)(\d+)\.(\d+)$/.exec(String(t));
  if (!m || m[3].length > 9) return null;
  const num = Number(m[2] + m[3]), den = 10 ** m[3].length, g = gcd(num, den), n = num / g, d = den / g;
  return d === 1 ? m[1] + n : `${m[1]}${n}/${d}`;
}
const fracVal = s => { const m = /^(-?\d+)(?:\/(\d+))?$/.exec(String(s)); return m ? Number(m[1]) / Number(m[2] || 1) : String(s); };
const ptKey = (x) => { const f = decimalToFraction(x); return String(fracVal(f ?? x)); };

// ---------------------------------------------------------------- 수리 함수(바꾸면 사유 문자열, 아니면 null)
function removeA11y(plan, problem) {
  const u = problem.unknownKeys;
  if (!(u && u.path === '' && u.keys.includes('accessibilityDescription') && NO_A11Y_CAPS.has(plan.capability))) return null;
  delete plan.accessibilityDescription; return 'A11Y_REMOVE';
}
function angleLabels(plan) {
  let n = 0;
  const walk = o => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (isObj(o)) {
      if (isObj(o.planeMarks) && Array.isArray(o.planeMarks.angles)) for (const a of o.planeMarks.angles) {
        if (isObj(a) && typeof a.label === 'string' && /[∠°]/.test(a.label)) {
          const t = a.label.replace(/∠/g, '').replace(/°/g, '').trim();
          if (t) { a.label = t; n++; }
        }
      }
      for (const k of Object.keys(o)) walk(o[k]);
    }
  };
  walk(plan);
  return n ? 'ANGLE_LABEL' : null;
}
function fixLabelText(t) {
  if (typeof t !== 'string' || LABEL_OK.test(t)) return null;
  const f = t.replace(/−/g, '-').replace(/[⁰¹²³⁴-⁹]/g, c => '^' + SUPER[c]);
  return f !== t && LABEL_OK.test(f) ? f : null;
}
function curveLabel(plan, id) {
  let n = 0;
  for (const g of graphPlans(plan)) {
    for (const c of g.curves || []) if (isObj(c) && (id === undefined || c.id === id)) { const f = fixLabelText(c.label); if (f) { c.label = f; n++; } }
    for (const l of (g.overlays && g.overlays.lines) || []) if (isObj(l) && (id === undefined || l.id === id)) { const f = fixLabelText(l.label); if (f) { l.label = f; n++; } }
  }
  return n ? 'CURVE_LABEL' : null;
}
function piTickEnds(plan) {
  let n = 0;
  for (const g of graphPlans(plan)) {
    const r = g.sourceDomain && g.sourceDomain.rangePi, t = g.axisTickValues && g.axisTickValues.x;
    if (!Array.isArray(r) || !Array.isArray(t)) continue;
    const ends = new Set(r.map(ptKey)), keep = t.filter(v => !ends.has(ptKey(v)));
    if (keep.length !== t.length) { g.axisTickValues.x = keep; n++; }
  }
  return n ? 'TICK_PI_END' : null;
}
function tickZero(plan, axis) {
  let n = 0;
  for (const g of graphPlans(plan)) {
    const t = g.axisTickValues && g.axisTickValues[axis];
    if (!Array.isArray(t)) continue;
    const keep = t.filter(v => !(Number(String(v).split('/')[0]) === 0 && /^-?\d+(\.\d+)?(\/\d+)?$/.test(String(v))));
    if (keep.length !== t.length) { g.axisTickValues[axis] = keep; n++; }
  }
  return n ? 'TICK_ZERO' : null;
}
function decimals(plan) {
  let n = 0;
  for (const g of graphPlans(plan)) {
    if (g.sourceDomain && Array.isArray(g.sourceDomain.range)) g.sourceDomain.range = g.sourceDomain.range.map(v => { const f = decimalToFraction(v); if (f !== null) { n++; return f; } return v; });
    for (const p of g.pieces || []) if (isObj(p) && g.family === 'piecewise-discontinuous') {
      for (const k of ['domain', 'coefficients']) if (Array.isArray(p[k])) p[k] = p[k].map(v => { const f = decimalToFraction(v); if (f !== null) { n++; return f; } return v; });
    }
  }
  return n ? 'DECIMAL_EXACT' : null;
}
function setSplit(plan) {
  const d = plan.diagram; if (!isObj(d) || !Array.isArray(d.elements)) return null;
  let n = 0; const out = [];
  for (const e of d.elements) {
    if (isObj(e) && typeof e.text === 'string' && /^\d+(\s*,\s*\d+)+$/.test(e.text.trim()) && Object.keys(e).every(k => ['text', 'in', 'math'].includes(k))) {
      for (const part of e.text.split(',')) out.push({ ...e, text: part.trim() }); n++;
    } else out.push(e);
  }
  if (!n) return null; d.elements = out; return 'SET_SPLIT';
}
// 정규분포: 표준정규(mean 0, sd 1)에 눈금 x 는 z 값인데 text 에 실제 값("430")을 쓴 plan 을 실제 단위로 바꾼다.
// 숫자 text 가 있는 눈금 두 개 이상이 한 직선(text = 평균 + 표준편차·x)에 놓일 때만: curve mean·sd 를 그 평균·표준편차로, 눈금 x 를 실제 값으로, shades 의 from/to 를 새 눈금 글로. 그림은 같다.
function normalUnitsOne(plan) {
  const c = plan.chart;
  if (!isObj(c) || c.kind !== 'NORMAL_CURVE' || !Array.isArray(c.curves) || c.curves.length !== 1 || !Array.isArray(c.ticks)) return null;
  const cv = c.curves[0];
  if (!(isObj(cv) && Number(cv.mean) === 0 && Number(cv.sd) === 1)) return null;
  const num = v => (typeof v === 'number' || (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v))) ? Number(v) : null;
  const pairs = [];
  for (const t of c.ticks) {
    if (!isObj(t) || t.x === undefined || t.z !== undefined) return null; // z 눈금·문자열 눈금은 다루지 않는다
    const x = num(t.x), y = num(t.text);
    if (x === null) return null;
    if (y !== null) pairs.push([x, y]);
  }
  if (pairs.length < 2) return null;
  const [x1, y1] = pairs[0], [x2, y2] = pairs.find(p => p[0] !== x1) || [];
  if (x2 === undefined) return null;
  const sd = (y2 - y1) / (x2 - x1), mean = y1 - sd * x1;
  const eps = 1e-9, fmt = v => { const t = String(Math.round(v * 1e6) / 1e6); return Math.abs(v - Number(t)) < eps ? t : null; };
  if (!(sd > 0) || fmt(sd) === null || fmt(mean) === null) return null;
  if (!pairs.every(([x, y]) => Math.abs(mean + sd * x - y) < eps)) return null;
  const oldTicks = c.ticks, shown = [];
  const ticks = oldTicks.map(t => {
    const u = mean + sd * num(t.x), us = fmt(u); if (us === null) return null;
    const keepText = t.text !== undefined && num(t.text) === null;
    shown.push(keepText ? t.text : us);
    const out = { ...t, x: us }; if (!keepText) delete out.text; return out;
  });
  if (ticks.some(t => t === null)) return null;
  const refMap = ref => { if (typeof ref !== 'string') return ref; const i = oldTicks.findIndex(t => String(num(t.x)) === String(num(ref))); return i >= 0 && num(ref) !== null ? shown[i] : ref; };
  cv.mean = fmt(mean); cv.sd = fmt(sd); c.ticks = ticks;
  if (Array.isArray(c.shades)) c.shades = c.shades.map(sh => isObj(sh) ? { ...sh, ...(sh.from !== undefined && sh.from !== null ? { from: refMap(sh.from) } : {}), ...(sh.to !== undefined && sh.to !== null ? { to: refMap(sh.to) } : {}) } : sh);
  return 'NORMAL_UNITS';
}
function normalUnits(plan) { // 단독 그림과 합성 패널 안의 통계 plan 모두
  const hits = [plan, ...((plan.panels || []).map(p => p && p.plan))].filter(isObj).map(normalUnitsOne).filter(Boolean);
  return hits.length ? 'NORMAL_UNITS' : null;
}
// 극값·꼭짓점: 엔진이 hintData.points 로 알려 준 점만 requiredPoints 에 넣는다. overlays 점이 같은 자리에 있으면 중복 표시가 되므로 남긴다.
function addRequired(plan, problem, skipped) {
  const pts = problem.detail && problem.detail.hintData && problem.detail.hintData.points;
  if (!Array.isArray(pts) || !pts.length) return null;
  if (isObj(plan.graphPlan) && plan.graphPlan.referenceCurves !== undefined) { skipped.add('ADD_REQUIRED: 두 함수(referenceCurves) plan'); return null; }
  const panel = problem.detail && problem.detail.panel;
  const g = panel !== undefined ? (plan.panels && plan.panels[panel] && plan.panels[panel].plan && plan.panels[panel].plan.graphPlan) : plan.graphPlan;
  if (!isObj(g)) return null;
  const ids = new Set(); const collect = o => { if (Array.isArray(o)) o.forEach(collect); else if (isObj(o)) { if (typeof o.id === 'string') ids.add(o.id); Object.values(o).forEach(collect); } }; collect(g);
  const overlay = ((g.overlays && g.overlays.points) || []);
  const coincides = pt => overlay.some(o => (o.curveX !== undefined && ptKey(o.curveX) === ptKey(pt.x)) || (o.x !== undefined && o.y !== undefined && ptKey(o.x) === ptKey(pt.x) && ptKey(o.y) === ptKey(pt.y)));
  if (pts.some(coincides)) { skipped.add('ADD_REQUIRED: overlays 점이 같은 자리에 있음'); return null; }
  const letters = 'VWXYUTSRQPNMLKJHGFEDCBA'.split('').filter(c => !ids.has(c));
  if (letters.length < pts.length) return null;
  g.requiredPoints = Array.isArray(g.requiredPoints) ? g.requiredPoints : [];
  pts.forEach(pt => g.requiredPoints.push({ id: letters.shift(), x: String(pt.x), y: String(pt.y) }));
  return 'ADD_REQUIRED';
}

// ---------------------------------------------------------------- 한 plan 수리(lint 가 짚은 것만, 더 고칠 것이 없을 때까지)
async function autofixPlan(plan0, linter) {
  const cur = JSON.parse(JSON.stringify(plan0)), changes = [], skipped = new Set();
  const before = await linter.lint(cur);
  let last = before;
  for (let round = 0; round < 8 && last.status === 'FAIL'; round++) {
    let progressed = false;
    for (const p of (last.problems || [last]).filter(x => x.status === 'FAIL')) {
      const base = String(p.code).replace(/^PANEL_\d+:/, '').split(':')[0], arg = String(p.code).split(':').slice(1).join(':');
      let c = null;
      c = removeA11y(cur, p);
      if (!c && (base === 'UNSUPPORTED_MATH_TOKEN' && /^∠/.test(arg))) c = angleLabels(cur);
      if (!c && base === 'MATHJAX_TYPESET_ERROR' && p.detail && /\^\{\\circ\}\^\{\\circ\}/.test(String(p.detail.labelText || ''))) c = angleLabels(cur);
      if (!c && (base === 'MULTI_CURVE_LABEL_INVALID' || base === 'OVERLAY_LABEL_INVALID')) c = curveLabel(cur, arg.split(':')[0]);
      if (!c && /^PIECEWISE_(POLY|DISCONTINUOUS)_EXTREMUM_NOT_IN_REQUIRED_POINTS$/.test(base)) c = addRequired(cur, p, skipped);
      if (!c && base === 'TRIG_PI_TICK_OUTSIDE_VIEW') c = piTickEnds(cur);
      if (!c && base === 'INVALID_AXIS_TICK_VALUE') c = tickZero(cur, arg.split(':')[0]);
      if (!c && (base === 'PIECEWISE_POLY_SOURCE_DOMAIN_INVALID' || base === 'PIECEWISE_DISCONTINUOUS_PIECE_INVALID')) c = decimals(cur);
      if (!c && (base === 'STAT_NORMAL_TICK_TEXT_MISMATCH' || base === 'STAT_NORMAL_BOUNDARY_NOT_TICKED')) {
        const snapshot = JSON.stringify(cur);
        c = normalUnits(cur);
        if (c) { const t = await linter.lint(cur); if ((t.problems || [t]).some(x => /^(PANEL_\d+:)?STAT_NORMAL_(TICK_TEXT_MISMATCH|BOUNDARY_NOT_TICKED)/.test(x.code))) { for (const k of Object.keys(cur)) delete cur[k]; Object.assign(cur, JSON.parse(snapshot)); c = null; skipped.add('NORMAL_UNITS: 바꿔도 눈금·경계 오류가 남음'); } }
      }
      if (!c && base === 'SET_ELEMENT_TEXT_UNSUPPORTED') {
        const snapshot = JSON.stringify(cur.diagram);
        c = setSplit(cur);
        if (c) { const t = await linter.lint(cur); if ((t.problems || [t]).some(x => x.code === 'SET_ELEMENT_TEXT_UNSUPPORTED')) { cur.diagram = JSON.parse(snapshot); c = null; skipped.add('SET_SPLIT: 쪼개도 다른 원소 text 가 걸림'); } }
      }
      if (c) { changes.push(c); progressed = true; }
    }
    if (!progressed) break;
    last = await linter.lint(cur);
  }
  return { plan: cur, changes, skipped: [...skipped], before, after: last };
}

async function main() {
  const argv = process.argv.slice(2), inputs = []; let dry = false, json = false;
  for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (a === '--list') { inputs.push(...fs.readFileSync(argv[++i], 'utf8').split('\n').map(x => x.trim()).filter(Boolean)); continue; } if (a === '--dry') dry = true; else if (a === '--json') json = true; else if (a.startsWith('--')) { console.error('모르는 옵션: ' + a); process.exit(2); } else inputs.push(a); }
  if (!inputs.length) { console.error('usage: plan-autofix.cjs [--dry] [--json] <plan.json | 폴더>…'); process.exit(2); }
  const files = collectPlanFiles(inputs), linter = await createLinter();
  const tag = r => r.status === 'OK' ? 'OK' : String(r.code);
  for (const f of files) {
    const orig = fs.readFileSync(f, 'utf8'), plan = JSON.parse(orig);
    const r = await autofixPlan(plan, linter);
    const changed = r.changes.length > 0;
    if (changed && !dry) fs.writeFileSync(f, JSON.stringify(r.plan, null, 2) + (orig.endsWith('\n') ? '\n' : ''));
    if (json) console.log(JSON.stringify({ file: f, changes: [...new Set(r.changes)], skipped: r.skipped, before: tag(r.before), after: tag(r.after), afterAll: r.after.status === 'OK' ? [] : (r.after.problems || [r.after]).map(p => ({ code: p.code, reason: p.reason })) }));
    else console.log(`${labelOf(f)}: ${tag(r.before)} → ${tag(r.after)} | 수리 ${changed ? [...new Set(r.changes)].join(', ') : '없음'}${r.skipped.length ? ' | 남김 ' + r.skipped.join('; ') : ''}`);
  }
  linter.close();
}
module.exports = { autofixPlan };
if (require.main === module) main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(2); });
