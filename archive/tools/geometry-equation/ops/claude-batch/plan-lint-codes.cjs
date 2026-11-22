// plan-lint 가 엔진 거절 코드에 붙이는 사람용 이유와 고치는 법. 엔진 코드는 읽기만 하고 여기는 설명(글)만 둔다.
// 쓰임: explain(code, {plan, err, M, E, stage, extra}) → {reason, fix, [unknownKeys]}. 규칙마다 출처(엔진 파일:줄)를 주석으로 단다. 줄 번호는 2026-11-20 main 기준이다.
'use strict';
const fs = require('fs'), path = require('path');

// ---------------------------------------------------------------- lint 불가 코드
// Chrome 으로 그림을 측정·배치해야만 나오는 코드다. lint 가 OK 를 내도 렌더에서 나올 수 있다.
const NOT_LINTABLE = [
  [/^LAYOUT_INVENTORY_INCOMPLETE/, '라벨 자리 배치(Chrome 측정)'],
  [/DISPLAY_ENVELOPE/, '화면 표시 크기 측정(Archive 페이지를 Chrome 으로 연다)'],
  [/_NO_ROOM$/, '라벨 자리 배치(Chrome 측정)'], [/_TOO_CLOSE$/, '라벨 간격(Chrome 측정)'], [/^TEXT_CLIPPED/, '글자 잘림(Chrome 측정)'],
  [/^LEADER_CROSSING/, '지시선 교차(배치 결과)'], [/^DIMENSION_CROSSES_STROKE/, '치수선 교차(배치 결과)'],
  [/^TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL/, '눈금 라벨 배치(Chrome 측정)'], [/^MEASURED_OWNER_LAYOUT/, '라벨 배치(Chrome 측정)'],
  [/^NUMBER_LINE_LABEL_TOO_LARGE/, '라벨 크기(측정한 글자 크기에 따라 달라짐)'], [/^LABEL_NEAREST_CURVE_MISMATCH/, '완성된 SVG 를 관찰자가 읽어야 나옴'],
  [/^EQUAL_UNIT_SCALE_MISMATCH/, '완성된 SVG 를 관찰자가 읽어야 나옴'], [/^WORKER_TIMEOUT/, '조립(build) 단계 시간 초과(엔진 성능)'],
  [/^ARCHIVE_BANK_RESPONSE_MISMATCH/, 'Archive 반입 단계(환경)'], [/^ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL/, 'Archive 페이지를 Chrome 으로 여는 단계(환경)']
];
const notLintableReason = code => { const hit = NOT_LINTABLE.find(([re]) => re.test(String(code))); return hit ? hit[1] : null; };
const isNotLintable = code => notLintableReason(code) !== null;

// ---------------------------------------------------------------- 도우미
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const q = s => '"' + String(s) + '"';
// plan 안의 graphPlan 들(최상위, 패널, 두 번째 함수)
function graphPlansOf(plan) {
  const out = [];
  const add = g => { if (isObj(g)) out.push(g); };
  add(plan && plan.graphPlan);
  for (const p of (plan && plan.panels) || []) add(p && p.plan && p.plan.graphPlan);
  if (plan && plan.graphPlan && isObj(plan.graphPlan.referenceCurves)) add(plan.graphPlan.referenceCurves);
  return out;
}
const curveOf = (plan, id) => { for (const g of graphPlansOf(plan)) { const c = (g.curves || []).find(c => c && c.id === id); if (c) return c; } return null; };
// plan 에서 글자(문자열)를 가진 곳을 찾는다
function findString(node, test, pth = '') {
  if (typeof node === 'string') return test(node) ? { path: pth, text: node } : null;
  if (Array.isArray(node)) { for (let i = 0; i < node.length; i++) { const r = findString(node[i], test, `${pth}[${i}]`); if (r) return r; } return null; }
  if (isObj(node)) { for (const k of Object.keys(node)) { const r = findString(node[k], test, pth ? `${pth}.${k}` : k); if (r) return r; } }
  return null;
}
const uniq = a => [...new Set(a)];

// 엔진의 onlyKeys(변수,[허용 목록]|상수) 거절에서 plan 의 어느 객체에 허용 밖 필드가 있는지 찾는다.
// 던진 오류의 스택에서 onlyKeys 를 부른 줄을 읽고(production/*.mjs:줄:칸) 허용 목록을 풀어, plan 에서 허용 밖 필드를 가진 객체를 찾는다.
function unknownKeysOf(err, plan, E) {
  try {
    const frames = String(err && err.stack || '').split('\n').filter(l => /\bat /.test(l));
    for (const l of frames) {
      const m = /\((?:file:\/\/\/)?([^()]+\.mjs):(\d+):(\d+)\)?\s*$/.exec(l.trim()) || /at (?:file:\/\/\/)?([^()]+\.mjs):(\d+):(\d+)\s*$/.exec(l.trim());
      if (!m) continue;
      const file = decodeURIComponent(m[1]).replace(/^\/([A-Za-z]:)/, '$1'), line = Number(m[2]);
      if (!fs.existsSync(file)) continue;
      const src = fs.readFileSync(file, 'utf8').split('\n');
      const text = src[line - 1] || '';
      if (/const onlyKeys=/.test(text)) continue; // 정의 줄
      const call = /^onlyKeys\(\s*([A-Za-z_][\w.]*)\s*,\s*(\[[^\]]*\]|[A-Z_][A-Z0-9_]*)/.exec(text.slice(Math.max(0, Number(m[3]) - 1)));
      if (!call) continue;
      let allowedText = call[2];
      if (!allowedText.startsWith('[')) { const def = new RegExp('(?:const|let)\\s+' + allowedText + '\\s*=\\s*(\\[[^\\]]*\\])').exec(src.join('\n')); if (!def) continue; allowedText = def[1]; }
      const allowed = [...allowedText.matchAll(/'([^']+)'/g)].map(x => x[1]);
      if (!allowed.length) continue;
      // plan 안에서 허용 밖 필드를 가진 객체 중 허용 필드와 가장 많이 겹치는 것(최상위는 변수 이름이 plan 일 때 우선)
      const cands = [];
      const walk = (node, pth) => {
        if (isObj(node)) {
          const keys = Object.keys(node), unk = keys.filter(k => !allowed.includes(k)), hit = keys.filter(k => allowed.includes(k)).length;
          if (unk.length && (hit > 0 || pth === '')) cands.push({ pth, unk, hit, allowed });
          for (const k of keys) walk(node[k], pth ? `${pth}.${k}` : k);
        } else if (Array.isArray(node)) node.forEach((x, i) => walk(x, `${pth}[${i}]`));
      };
      walk(plan, '');
      if (!cands.length) continue;
      cands.sort((a, b) => (call[1] === 'plan' ? (a.pth === '' ? -1 : 0) - (b.pth === '' ? -1 : 0) : 0) || b.hit - a.hit || a.pth.length - b.pth.length);
      return cands[0];
    }
  } catch { /* 설명이 없어도 코드는 그대로 나간다 */ }
  return null;
}

// ---------------------------------------------------------------- 규칙(코드 앞부분 → 이유·고치는 법)
// 각 규칙: [코드 정규식, (c, ctx) => ({reason, fix})]. c = {code, base, arg(첫 ':' 뒤), plan, extra}.
const R = [];
const rule = (re, fn) => R.push([re, fn]);

// --- multi-curve-figure-v1 (production/graph_framing.py)
rule(/^PLAN_(JSON_INVALID|NOT_OBJECT)$/, c => ({ reason: c.base === 'PLAN_JSON_INVALID' ? 'plan 파일이 올바른 JSON 이 아니다(따옴표·쉼표·괄호·백슬래시 이스케이프를 확인).' : 'plan 최상위가 객체가 아니다.', fix: 'JSON 문법을 고친다. 문자열 안의 큰따옴표·역슬래시·줄바꿈은 이스케이프한다.' }));
rule(/^MULTI_CURVE_COUNT_INVALID$/, c => { // graph_framing.py:4810-4811
  const n = (graphPlansOf(c.plan).find(g => Array.isArray(g.curves)) || {}).curves;
  const kinds = (n || []).map(x => x && (x.kind || (x.inverseOf ? '역함수' : '?'))).join(',');
  return { reason: `multi-curve-figure-v1 은 곡선이 2~6개일 때만 쓴다. 이 plan 의 곡선은 ${n ? n.length : '?'}개(${kinds})다.`,
    fix: '곡선이 하나면 multi-curve 를 쓰지 않는다: 직선·다항은 piecewise-polynomial-spike-v1, 지수는 exponential-affine-spike-v1, 로그는 logarithmic-affine-spike-v1(본보기 참조). 한 곡선의 일부 구간 강조(emphasis)·abs:true·regions 가 필요한 그림만 곡선 1개가 허용된다.' };
});
rule(/^MULTI_CURVE_LABEL_INVALID$/, c => { // graph_framing.py:4539(패턴) 4584-4592 4618
  const cv = curveOf(c.plan, c.arg), label = cv && cv.label;
  const bad = typeof label === 'string' ? uniq([...label].filter(ch => !/[0-9A-Za-z=+\-*/().^ ]/.test(ch))) : [];
  const why = typeof label === 'string' ? (label.length > 40 ? `40자를 넘는다(${label.length}자)` : bad.length ? `쓸 수 없는 글자 ${bad.map(q).join(' ')}가 있다` : '형식이 맞지 않는다') : '문자열이 아니다';
  return { reason: `곡선 ${c.arg}의 label ${q(label)} 는 ${why}. 곡선 label 은 영문·숫자와 = + - * / ( ) . ^ 공백만, 40자 이내다(한글·−·²·³·₃·<·> 불가).`,
    fix: 'ASCII 식으로 쓰거나(y=4x-6, y=x^3; 밑을 아래첨자로 쓴 log₃ 은 ASCII 로 못 쓴다) 쓸 수 없으면 label 을 지우고(엔진이 식을 쓴다) 기울기·범위 같은 설명은 caption 에 쓴다.' };
});
rule(/^MULTI_CURVE_COEFFICIENT_INVALID$/, c => { // graph_framing.py:4700-4763
  const cv = curveOf(c.plan, c.arg), n = cv && Array.isArray(cv.coefficients) ? cv.coefficients.length : null;
  return { reason: `곡선 ${c.arg}(${cv ? cv.kind : '?'})의 계수 형식이 틀렸다${n !== null ? `(계수 ${n}개)` : ''}. Y_OF_X·X_OF_Y 는 [c0,c1,c2] 세 개(c2≠0), LINE 은 [c0,c1] 두 개, 지수·로그는 그 형식의 필드를 쓴다. 정수·분수 문자열만 된다.`,
    fix: '삼차 이상은 multi-curve 로 못 그린다: piecewise-polynomial-spike-v1 에 쓴다. 계수는 "3/2" 같은 정확한 문자열로.' };
});
rule(/^MULTI_CURVE_NOT_QUADRATIC$/, c => ({ reason: `곡선 ${c.arg} 의 이차항 계수 c2 가 0 이다(이차가 아니다).`, fix: 'Y_OF_X 의 c2 는 0 이 아니어야 한다. 직선이면 kind:"LINE", coefficients:[c0,c1] 로 쓴다.' }));
rule(/^MULTI_CURVE_(DOMAIN_INVALID|TOO_NARROW|FRAME_DEGENERATE|WINDOW_REQUIRED|WINDOW_INVALID)$/, c => ({ reason: `multi-curve 의 정의역·viewport 가 맞지 않는다(${c.base}${c.arg ? ':' + c.arg : ''}).`, fix: '곡선마다 domain [lo,hi](lo<hi, 정확한 문자열)을 쓰고, 곡선이 좁게 보이면 viewport [xmin,xmax,ymin,ymax] 를 곡선에 맞춘다.' }));
rule(/^MULTI_CURVE_EXPONENTIAL_BASE_INVALID$/, c => ({ reason: `지수·로그 곡선 ${c.arg}의 밑이 잘못됐다(문자 밑·0 이하·1 은 안 된다).`, fix: 'base 는 정확한 양의 정수("2")·분수("1/2")·sqrt(n) 이고 1 이 아니어야 한다(생략하면 e).' }));

// --- 구간별 다항·불연속 조각함수 (production/graph_framing.py, phase2 계약)
rule(/^PIECEWISE_(POLY|DISCONTINUOUS)_(REFERENCE_CURVE_VERTEX|EXTREMUM)_NOT_IN_REQUIRED_POINTS$|^PIECEWISE_(POLY|DISCONTINUOUS)_EXTREMUM_NOT_IN_REQUIRED_POINTS$|^PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS$/, c => { // graph_framing.py (hintData.kind=ADD_REQUIRED_POINTS)
  const pts = c.extra && c.extra.hintData && c.extra.hintData.points;
  const list = Array.isArray(pts) ? pts.map(p => `{x:${q(p.x)},y:${q(p.y)}}`).join(', ') : '';
  return { reason: `조각 안쪽의 꼭짓점·극점·꺾임점${list ? ' ' + list : ''}이 graphPlan.requiredPoints 에 없다. 엔진이 정확히 계산한 꼭짓점은 전부 requiredPoints 에 있어야 한다(overlays 점의 curveX 로 대신할 수 없다).`,
    fix: `requiredPoints 에 ${list || '그 점들'} 을 새 id 로 추가한다(x·y 는 엔진이 계산한 값 그대로, 분수·근호 문자열도 그대로). 이차 조각의 꼭짓점이 구간 안쪽이면 항상 넣는다.` };
});
rule(/^PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_NOT_ON_CURVE$/, c => ({ reason: `requiredPoints 의 점 ${c.arg} 가 곡선 위에 없다. 열린 끝(빈 점)·극한값 점은 함숫값이 없어 곡선 위의 점이 아니다.`,
  fix: '그 점을 requiredPoints 에서 빼고 limitArrows:[{"at":"1","side":"LEFT","toY":"6"}] 로 극한을 보인다. 점이 꼭 필요하면 그 끝을 CLOSED 로 하거나 jumpValues 에 같은 점을 쓴다.' }));
rule(/^PIECEWISE_POLY_REQUIRED_POINT_OUTSIDE_SOURCE_DOMAIN$/, c => ({ reason: `requiredPoints 의 점 ${c.arg} 의 x 가 sourceDomain(문제가 정한 정의역) 밖이다.`, fix: '그 점을 빼거나 x 를 정의역 안으로 고친다. 열린 끝의 극한값 점은 requiredPoints 에 쓰지 않는다.' }));
rule(/^PIECEWISE_DISCONTINUITY_UNDECLARED$/, c => ({ reason: `x 가 같은 자리에서 양쪽 조각이 모두 열린 끝(OPEN)인데 그 x 의 함숫값이 선언되지 않았다(불연속 ${c.arg}번째).`,
  fix: 'graphPlan.jumpValues 에 {"x":"1","y":"3"} 로 그 x 의 함숫값을 쓴다(referenceCurves[0] 의 jumpValues 도 같다). 함숫값이 없는 구멍은 이 capability 로 못 그리니 값을 지어내지 말고 UNSUPPORTED.' }));
rule(/^PIECEWISE_DISCONTINUOUS_PIECE_INVALID$/, c => ({ reason: `불연속 조각 ${c.arg}번째의 domain·계수·끝 상태가 형식에 맞지 않는다(소수 3.5 불가, 조각 차수 2 이하, 조각은 순서대로 겹치지 않아야 한다).`, fix: 'domain·coefficients·xWindow 의 소수는 분수 문자열("7/2")로, 조각 차수는 2 이하, start/end 는 "OPEN"|"CLOSED" 로 쓴다.' }));
rule(/^PIECEWISE_POLY_SAMPLE_NOTE_INVALID$/, () => ({ reason: 'sampleNote 에 쓸 수 없는 글자가 있다. 영문·숫자와 = + - * / ( ) . 공백만, 32자 이내다(한글·√·²·^ 불가).', fix: 'sampleNote 는 생략하고 식은 caption 에 쓴다. 꼭 쓰려면 "k=-2+2*sqrt(2)" 처럼 ASCII 로.' }));
rule(/^PIECEWISE_POLY_EXACT_COORDINATES_CONFLICT$/, () => ({ reason: 'requiredPoints 의 x·y 에 정확한 근호 문자열을 쓴 같은 id 를 exactCoordinates 에도 썼다(둘이 충돌).', fix: '근호 좌표 점은 requiredPoints 의 x·y 에만 쓰고 exactCoordinates 에는 쓰지 않는다. 정수·분수 좌표 점만 exactCoordinates 를 쓴다.' }));
rule(/^PIECEWISE_POLY_EXACT_VALUE_INVALID$/, () => ({ reason: 'plan 의 정확값 문자열이 문법에 맞지 않는다(숫자 + - * / ( ) sqrt 만 허용, 0 으로 나눔·소수·문자 불가).', fix: '정수·분수·p+q*sqrt(r) 형태로 쓴다(requiredPoints·breakpoints·referenceLines 의 값 전부).' }));
rule(/^PIECEWISE_POLY_PIECE_COUNT_INVALID$/, c => { // graph_framing.py:2134,2303
  const n = graphPlansOf(c.plan).map(g => Array.isArray(g.pieces) ? g.pieces.length : null).filter(x => x !== null);
  return { reason: `구간별 다항의 pieces 는 1~4개여야 한다. 이 plan 은 ${n.join('/') || '?'}개다.`, fix: '조각을 4개 이하로 줄인다(같은 식이 이어지는 조각은 하나로 합치고, 정의역을 좁혀 핵심 구간만 그린다). 5개 이상이 꼭 필요하면 UNSUPPORTED.' };
});
rule(/^PIECEWISE_POLY_SOURCE_DOMAIN_INVALID$/, c => { // graph_framing.py:2316-2321
  const sd = graphPlansOf(c.plan).map(g => g.sourceDomain).filter(Boolean)[0];
  return { reason: `sourceDomain 이 형식에 맞지 않는다${sd ? ': ' + JSON.stringify(sd) : ''}. {kind:"ALL_REALS"} 또는 {kind:"INTERVAL",range:[lo,hi],states:[…,…]} 이고 range 의 끝은 정수·분수 문자열이다(소수 "-0.3" 불가).`, fix: 'range 의 소수를 분수 문자열로 바꾼다("-0.3" → "-3/10", "2.4" → "12/5"). states 는 "OPEN"|"CLOSED" 두 개.' };
});
rule(/^REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED$/, c => ({ reason: `mathPlan 의 SOURCE_POINT 와 GIVEN/CONCLUSION 노드는 모두 ${c.arg || 'displayPoints 등 표시 목록'} 에 있어야 하는데 빠진 것이 있다.`, fix: '빠진 노드를 그 표시 목록에 넣거나, 그림에 그리지 않을 보조 노드면 factRole 을 DERIVED_INTERMEDIATE 로 바꾼다.' })); // phase2 계약
rule(/^PIECEWISE_POLY_(PIECE_COUNT_INVALID|SOURCE_DOMAIN_INVALID|REFERENCE_CURVES_INVALID|ROOT_NOT_CLOSED_FORM|INTERSECTION_MISMATCH|FEATURES_BELOW_RESOLUTION|HIGH_DEGREE_IRRATIONAL_UNSUPPORTED)$|^PIECEWISE_DISCONTINUOUS_(FEATURES_BELOW_RESOLUTION|LIMIT_ARROW_NO_ROOM|PAIR_LAYOUT_REQUIRED)$|^PIECEWISE_DOMAIN_OVERLAP$/, c => hintOnly(c, `구간별 함수의 plan 값이 엔진이 정확히 다시 계산한 결과와 맞지 않는다(${c.base}).`));
rule(/^PIECEWISE_POLY_CURVE_TOO_NARROW$/, () => ({ reason: '곡선이 그림에 너무 좁게 그려진다(구간 폭이 viewport 에 비해 지나치게 작다). 패널이면 해당 패널의 곡선이다.', fix: 'viewport 를 곡선 구간에 맞게 좁히거나 sourceDomain·domain 을 곡선이 충분히 넓게 보이도록 고친다(패널마다 따로).' }));

// --- 삼각함수
rule(/^TRIG_PI_TICK_OUTSIDE_VIEW$/, () => ({ reason: 'axisTickValues.x 의 π 배 눈금이 sourceDomain 의 끝과 같거나 밖에 있다(끝점은 엔진이 자동으로 라벨을 단다. 눈금은 구간 안쪽이어야 한다).', fix: 'axisTickValues.x 에서 구간 끝(rangePi 의 양 끝)과 같은 값을 뺀다.' })); // graph_framing.py:1775
rule(/^TRIG_(REFERENCE_LINES_REQUIRE_INTERVAL_PI|RATE_PI_REQUIRES_PLAIN_INTERVAL|LINE_SLOPE_ZERO|LINE_THROUGH_INTERVAL_END|LINE_INTERSECTION_COUNT_MISMATCH)$/, c => hintOnly(c, `삼각함수 plan 의 값·직선이 엔진 규칙과 맞지 않는다(${c.base}).`));

// --- 눈금·라벨(python visual_engine)
rule(/^INVALID_AXIS_TICK_VALUE$/, c => { // visual_engine/engine.py:525-529
  const axis = c.arg, vals = [];
  for (const g of graphPlansOf(c.plan)) for (const v of ((g.axisTickValues || {})[axis] || [])) vals.push(String(v));
  const badV = vals.filter(v => !/^-?\d+(\.\d+)?(\/\d+)?$/.test(v) || Number(v.split('/')[0]) === 0);
  return { reason: `axisTickValues.${axis} 에 0 이거나 정수·분수 문자열이 아닌 값이 있다${badV.length ? ': ' + badV.map(q).join(' ') : ''}(눈금은 0 이 아닌 정수·분수 문자열만 된다. sqrt(2) 같은 근호는 불가).`,
    fix: '0 과 근호 값을 눈금에서 뺀다. 근호·0 의 위치는 점 이름·좌표 라벨(requiredPoints)로 보이고 값은 caption 에 쓴다.' };
});
rule(/^AXIS_TICK_VALUE_OUT_OF_VIEW$/, c => ({ reason: `axisTickValues.${c.arg} 의 눈금이 viewport 밖에 있다.`, fix: '눈금을 viewport 안의 값으로 줄이거나 viewport 를 넓힌다.' })); // visual_engine/engine.py:530
rule(/^UNSUPPORTED_MATH_TOKEN$/, c => { // visual_engine/math_expression.py:29 (TOKEN 에 ∠ 가 없다)
  const first = c.arg ? [...c.arg][0] : null;
  const body = { ...c.plan }; for (const k of ['caption', 'accessibilityDescription', 'sourceConditions', 'newVisualInformation']) delete body[k]; // 그림 안 글만 찾는다
  const hit = c.arg ? findString(body, s => s.includes(c.arg.slice(0, 6)) || (first && s.includes(first))) : null;
  const angle = first === '∠';
  return { reason: `라벨·식 글에 엔진이 읽지 못하는 글자가 있다: ${q(c.arg || '?')}${hit ? ` (plan ${hit.path}: ${q(hit.text.slice(0, 40))})` : ''}. 허용: 숫자·영문·그리스 문자·+ * / ^ _ - = < > ( ) , ° √ π. ∠·한글·≤ 등은 안 된다.`,
    fix: angle ? 'planeMarks.angles[].label 에서 ∠ 와 °를 뺀다("∠A=40°" → "A=40", "40°" → "40"). 도(°)는 엔진이 숫자 각도 라벨 뒤에 붙인다.' : '라벨에서 그 글자를 빼고 한글 설명은 caption 에 쓴다.' };
});
rule(/^MATHJAX_TYPESET_ERROR$/, c => {
  const t = c.extra && c.extra.labelText ? String(c.extra.labelText) : '';
  const deg = /\^\{\\circ\}\^\{\\circ\}/.test(t);
  return { reason: `라벨 ${q(c.extra && c.extra.labelId || '?')} 의 수식${t ? ' ' + q(t) : ''}을 MathJax 가 조판하지 못한다${deg ? '(각도 라벨에 °를 직접 써서 엔진이 붙이는 °와 두 번 겹쳤다)' : '(식 문법 오류)'}.`,
    fix: deg ? 'planeMarks.angles[].label 에서 °를 뺀다("40°" → "40", "x=40°" → "x=40"). 도(°)는 엔진이 숫자 각도 라벨 뒤에 붙인다.' : '그 라벨의 글(각도 θ, 첨자, 식)을 엔진 문법(영문자·숫자·그리스 문자·+-*/^()=)으로 단순하게 고치거나 라벨을 뺀다.' };
}); // typography.mjs:53
rule(/^(UNSUPPORTED_MULTILINE_LABEL)$/, c => ({ reason: `라벨 ${q(c.extra && c.extra.labelId || '?')} 가 여러 줄 조건 상자라서 이 그림에 쓸 수 없다.`, fix: '조건 문장은 caption 에 쓰고 그림에는 값만 둔다.' }));
rule(/^DUPLICATE_SEMANTIC_LABEL$/, () => ({ reason: '같은 종류·같은 대상·같은 글의 라벨이 둘 이상이다(곡선 식 라벨 "f" 가 둘, 같은 점 좌표 둘 등).', fix: '한 곡선만 글을 두고 나머지는 "hideLabels":["formula","asymptotes"] 를 쓴다. 한 함수를 조각으로 나눠 그리지 않는다.' })); // visual_engine/svg_composer.py:144
rule(/^PUBLICATION_TEXT_NOT_READY$/, () => ({ reason: '그림에 학생이 읽을 값(점 이름·좌표·식·눈금)이 하나도 없다(축 이름 x, y 만 남는다).', fix: 'axisTickValues·overlays 점의 coordinates·곡선 식 라벨 중 풀이가 쓰는 값을 보이게 한다(정답이 보여도 해설 그림은 된다).' })); // verify-rendered-layout.mjs:412
rule(/^OVERLAY_LABEL_INVALID$/, c => ({ reason: `overlays 의 ${c.arg} 라벨에 쓸 수 없는 글자가 있다. 영문·숫자와 = + - * / ( ) . ^ 공백만, 40자 이내다(한글·′·²·≤·<·>·√ 불가).`, fix: '"t"·"l"·"y=3x+5" 처럼 쓰거나 label 을 생략한다(엔진이 식을 쓴다). 기울기·조건은 caption 에 쓴다.' }));
rule(/^(INVALID_ACCESSIBILITY_DESCRIPTION)$/, () => ({ reason: 'accessibilityDescription 이 비었거나 500자를 넘거나 줄바꿈이 있다.', fix: '한두 문장 평문으로 쓴다(줄바꿈 없이 500자 이내).' }));
rule(/^PLAN_CAPTION_REQUIRED$/, () => ({ reason: '최상위 caption 문자열이 없다.', fix: 'caption 에 풀이 요약을 쓴다.' }));

// --- 수직선·입체·평면 도형(number-line-v1.mjs, solid-figure-v1.mjs, plane-marks.mjs)
rule(/^NUMBER_LINE_ROW_LABEL_INVALID$/, c => { // number-line-v1.mjs (행 label: 한 줄 6자 이내)
  const rows = ((c.plan.numberLine || {}).rows) || [];
  const bad = rows.map((r, i) => ({ i, l: r && r.label })).filter(x => typeof x.l === 'string' && (x.l.length > 6 || /[<>&"\\$\u0000-\u001f]/.test(x.l)));
  return { reason: `수직선 행 label 은 6자 이내 한 줄이고 < > & " \\ $ 와 제어 문자가 없어야 한다${bad.length ? '. 걸린 label: ' + bad.map(x => `rows[${x.i}] ${q(x.l)}`).join(', ') : ''}.`,
    fix: '행 label 에는 변수나 짧은 말만 쓴다("m", "범위"). 부등식·문장은 caption 에 쓰고 행에는 hideSetLabel 과 짧은 label 을 쓴다.' };
});
rule(/^NUMBER_LINE_POINTS_INVALID$/, c => {
  const rows = ((c.plan.numberLine || {}).rows) || [];
  const pr = rows.filter(r => r && r.kind === 'POINTS');
  const ids = pr.flatMap(r => (r.points || []).map(p => p && p.id));
  const n = pr.map(r => (r.points || []).length);
  return { reason: `POINTS 행은 점 2~4개이고 점 id 는 영문 대문자 한 글자(또는 지정한 기호) 여야 한다. 이 plan: 점 개수 ${n.join('/')}, id ${ids.map(q).join(' ')}.`,
    fix: 'id 를 A·B·C 처럼 대문자 한 글자로 바꾸고(P0·소문자 불가), 점이 4개를 넘으면 행을 나누거나 핵심 점만 둔다. 점 이름을 안 보이게 하려면 hideName 을 쓴다.' };
});
rule(/^NUMBER_LINE_(ROWS_INVALID|PIECE_INVALID)$/, c => hintOnly(c, `수직선 rows 형식 오류(${c.base}).`));
rule(/^SOLID_MARK_RAY_NOT_DRAWN$/, c => ({ reason: `입체 marks ${c.arg} 가 가리키는 각의 두 변이 그려진 모서리·segments 가 아니다.`, fix: '직각·각 표시의 두 변을 입체의 모서리(edge)로 두거나 segments 에 그 선분을 추가한다.' })); // solid-figure-v1.mjs:1539,1596
rule(/^SOLID_(MARK_GROUP_AMBIGUOUS|VREF_AMBIGUOUS|DIM_LABEL_INVALID|DIMS_INVALID|CAPTION_INVALID)$/, c => hintOnly(c, `입체 plan 의 표시·치수 형식 오류(${c.base}${c.arg ? ':' + c.arg : ''}).`));
rule(/^MARK_TARGET_UNKNOWN$/, c => ({ reason: `planeMarks 가 가리키는 ${q(c.arg)} 가 이 그림에 없다(점·선분 id 오타이거나 displayPoints/displaySegments 에 없다).`, fix: 'planeMarks 의 id 를 displayPoints·displaySegments 에 있는 id 로 맞추거나 그 점·선분을 추가한다.' })); // plane-marks.mjs:336 plane-callouts.mjs:89
rule(/^ANGLE_MARK_FACT_MISMATCH$/, c => { const m = /declared=([^:]+):drawn=([\d.]+)/.exec(String(c.arg || '') + ':' + String(c.rest || '')) || /declared=([^:]+):drawn=([\d.]+)/.exec(c.code); // plane-marks.mjs
  return { reason: `각 ${c.arg} 의 value${m ? `(${m[1]}°)` : ''} 가 실제로 그려지는 각${m ? `(${Number(m[2]).toFixed(1)}°)` : ''}과 다르다(오차 0.5° 이내여야 한다).`, fix: 'value 를 그려지는 각으로 고치거나, 작도(POLAR_POINT 의 angleDeg·방향)를 value 에 맞게 고친다. 숫자만 바꾸지 말고 점 위치를 확인한다.' }; });
rule(/^(ANGLE_MARK_DEGENERATE|ANGLE_RING_INVALID|MARK_FIELD_INVALID|REGION_BOUNDARY_UNKNOWN|POINT_DISPLAY_NAME_INVALID|INVALID_HIDDEN_POINT_NAMES|INVALID_LABEL_DIRECTIONS|REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED|DUPLICATE_NODE|INVALID_EXACT_INTEGER|INVALID_POLAR_ANGLE|FUNCTION_CALL_REQUIRED|UNSUPPORTED_RATIONAL_NUMERATOR_GRAMMAR)$/, c => hintOnly(c, `평면도형·작도 plan 형식 오류(${c.base}${c.arg ? ':' + c.arg : ''}).`));
rule(/^ELLIPSE_LABEL_NO_ROOM$/, c => ({ reason: `타원 그림의 라벨 ${c.extra && c.extra.labelId ? q(c.extra.labelId) + ' 가' : '하나가'} 놓일 자리가 없다(가장 작은 글자 크기로 배치해도 점·선·곡선과 겹친다).`, fix: '라벨 수를 줄인다: 좌표(coordinates:true)를 보이는 점·길이 라벨·직선 식 라벨 중 풀이에 꼭 필요한 것만 남기고 값은 caption 에 쓴다. 점이 많으면 장면을 둘로 나눈다(composite-panels-v1).' })); // ellipse-figure-v1.mjs:410
rule(/^(ELLIPSE_POINT_INVALID|ELLIPSE_LINE_INVALID)$/, c => ({ reason: `ellipse-figure-v1 의 ${c.base === 'ELLIPSE_POINT_INVALID' ? '점' : '직선'} 정의가 엔진 형식에 맞지 않는다(종류별 필수 필드·정확값 문법·타원 위의 점 여부).`, fix: '본보기 plan(ellipse)의 점 kind 별 필드(VERTEX end, ON_ELLIPSE x+branch, POINT x,y …)를 그대로 따르고 x·y 는 정수·분수·p+q*sqrt(r) 로 쓴다. ON_ELLIPSE 의 x 는 실제 타원 위의 값이어야 한다.' }));

// --- 복합·통계·집합·격자 (stat-chart-v1.mjs, set-diagram-v1.mjs, lattice-path-v1.mjs)
rule(/^UNSUPPORTED_DISPLAY_ENVELOPE$/, c => ({ reason: `합성 그림의 전체 크기(${c.extra && c.extra.size ? c.extra.size.width + 'x' + c.extra.size.height : '?'})가 화면 표시 한계를 넘는다. 렌더에서 폭 828 이상·높이 820 이상은 모두 거절됐다(폭 776·높이 768 이하는 통과). 이 줄은 크기만 보는 추정이다.`, fix: '패널 수를 줄이거나(위아래로 쌓이는 높이의 합), 패널 안 그래프의 viewport·축 범위를 줄여 그림 한 장의 높이를 770 이하·폭을 780 이하로 한다. 한 패널로 줄이고 나머지는 caption 에 쓴다.' })); // composite-candidate-svg-v1.mjs:43
rule(/^COMPOSITE_PLAN_INVALID$/, () => ({ reason: 'composite-panels-v1 의 최상위·패널 구조가 형식에 맞지 않는다(패널 수·허용 필드·패널 안 plan 의 caption 금지 등).', fix: '패널 2~6개, 각 패널은 {caption:{text|math},plan:{...}}. 패널 안 plan 에는 caption·sourceConditions·newVisualInformation 을 쓰지 않는다.' }));
rule(/^STAT_NORMAL_TICK_TEXT_MISMATCH$/, () => ({ reason: '정규분포 눈금의 text 가 숫자인데 그 눈금의 위치 x 와 다르다(예 {x:"-2",text:"430"}: -2 자리에 430 이라고 적을 수 없다).', fix: '곡선을 실제 단위로 둔다: curves[].mean·sd 를 실제 평균·표준편차(예 "450","10")로 하고 ticks 는 {x:"430"} 처럼 실제 값으로 쓴다. 표준화(z) 눈금은 {z:"-2"}.' })); // stat-chart-v1.mjs:798
rule(/^STAT_NORMAL_CURVE_NAME_Z_NOT_STANDARD$/, () => ({ reason: '정규분포 곡선 이름이 Z인데 평균 0·표준편차 1인 표준정규분포가 아니다(평균·σ가 실제 값이나 문자인 곡선을 Z라 부르면 학생이 표준정규분포로 읽는다).', fix: '곡선 이름(label)을 문제의 변수(X, H, Y 등)로 바꾼다. z 눈금 줄이 필요하면 zAxis:true 를 쓴다(z 표기는 그대로). 평균 0·σ 1인 표준정규분포만 Z 라고 쓴다.' })); // stat-chart-v1.mjs normal curves
rule(/^STAT_NORMAL_XLABEL_Z_NOT_STANDARD$/, () => ({ reason: '정규분포 x축 이름(xLabel)이 z(Z)인데 곡선이 평균 0·표준편차 1이 아니고 눈금이 실제 값이다(z축은 표준화한 변수의 축이다).', fix: 'xLabel 을 문제의 변수(기본 x, 또는 X, h 등)로 바꾸거나 쓰지 않는다. z 눈금 줄이 필요하면 zAxis:true 를 쓴다. 표준정규분포(평균 0, σ 1) 곡선이면 xLabel:"z" 를 쓴다.' }));
rule(/^STAT_NORMAL_BOUNDARY_NOT_TICKED$/, () => ({ reason: 'shades 의 from/to 경계가 ticks 에 없는 위치다(경계는 눈금으로 표시된 곳이어야 한다).', fix: 'shades 의 from/to 를 ticks 의 x(또는 text) 와 같게 하고, 색칠 경계가 되는 값은 모두 ticks 에 넣는다.' })); // stat-chart-v1.mjs:809
rule(/^STAT_NORMAL_(TICK_TEXT_INVALID|AREA_LABEL_INVALID|AREA_LABEL_MISMATCH|WINDOW_TOO_WIDE)$/, c => hintOnly(c, `정규분포 plan 의 ${c.base === 'STAT_NORMAL_WINDOW_TOO_WIDE' ? '곡선들이 한 창에 안 들어간다(평균 차이가 표준편차의 6배 이내여야 한다)' : '눈금·넓이 글 형식이 맞지 않는다'}(${c.base}).`));
rule(/^STAT_TREE_LABEL_INVALID$/, () => ({ reason: '수형도 가지 label 이 6자를 넘거나 < > & " \\ 가 있다(label 은 1~6자).', fix: 'label 을 6자 이내 짧은 말로("A 1", "그 외")하고 설명은 caption 에 쓴다.' })); // stat-chart-v1.mjs:1003
rule(/^STAT_TREE_TOO_DEEP$/, () => ({ reason: '수형도 단계가 3단계를 넘는다.', fix: '3단계 이내로 줄이거나 필요한 가지만 그린다.' })); // stat-chart-v1.mjs:1005
rule(/^SET_ELEMENT_TEXT_UNSUPPORTED$/, () => ({ reason: '벤다이어그램 원소 text 에 쉼표로 묶은 여러 값("4, 12")·구간·부등호·집합 기호가 있다. 원소 text 하나는 원소 하나다.', fix: 'elements 항목 하나에 원소 하나씩 쓴다(text:"4" 와 text:"12" 를 같은 in 으로). 묶음은 개수 라벨로 나타낸다.' })); // set-diagram-v1.mjs:49
rule(/^LATTICE_(ENDPOINT_INVALID|SEGMENT_INVALID|SEGMENT_DUPLICATE)$/, c => hintOnly(c, `격자 최단경로 plan 의 형식 오류(${c.base}).`));
rule(/^(STAT|SET|LATTICE)_[A-Z_]+$/, c => hintOnly(c, `${c.base} 형식 오류.`));

// 엔진 영문 안내(hints.mjs)를 그대로 보여 주는 대체 규칙
function hintOnly(c, reason) {
  const H = c.M && c.M.hints ? c.M.hints.hintFor(c.code) : [];
  return { reason, fix: H.length ? '엔진 안내(영문): ' + H[0].replace(/\s+/g, ' ').slice(0, 260) : '엔진 코드의 뜻을 production/AUTHOR_GUIDE.md 에서 찾는다.' };
}

// ---------------------------------------------------------------- 진입점
function explain(code, ctx = {}) {
  const c0 = String(code);
  // 복합 패널 안의 오류는 PANEL_<n>:<코드> 로 온다
  let panelNote = '', inner = c0;
  const pm = /^PANEL_(\d+):(.*)$/.exec(c0);
  if (pm) { panelNote = `패널 ${Number(pm[1]) + 1}: `; inner = pm[2]; }
  const i = inner.indexOf(':');
  const base = i < 0 ? inner : inner.slice(0, i), arg = i < 0 ? '' : inner.slice(i + 1);
  const c = { code: inner, base, arg, plan: ctx.plan || {}, extra: ctx.extra || {}, M: ctx.M, err: ctx.err };
  // 1) onlyKeys 거절(…_PLAN_INVALID 등): 허용 밖 필드를 짚는다
  if (ctx.err && ctx.err.stack && ctx.plan) {
    const u = unknownKeysOf(ctx.err, ctx.plan, ctx.E);
    if (u) {
      const where = u.pth ? u.pth : 'plan 최상위';
      const acc = u.unk.includes('accessibilityDescription');
      return { reason: panelNote + `${where}에 이 형태가 받지 않는 필드가 있다: ${u.unk.join(', ')}. 받는 필드: ${u.allowed.join(', ')}.` + (acc ? ' 이 capability 는 접근성 설명을 엔진이 형태별 고정 문장으로 쓴다.' : ''),
        fix: acc && u.unk.length === 1 ? 'accessibilityDescription 을 plan 에서 지운다(caption 은 그대로 쓴다).' : `${u.unk.join(', ')} 을(를) 지우거나 본보기의 필드 이름으로 바꾼다.`, unknownKeys: { path: u.pth, keys: u.unk } };
    }
  }
  for (const [re, fn] of R) {
    if (re.test(base)) { try { const r = fn(c, ctx); return { ...r, reason: panelNote + r.reason }; } catch { break; } }
  }
  const H = ctx.M && ctx.M.hints ? ctx.M.hints.hintFor(c0) : [];
  return { reason: panelNote + `엔진이 plan 을 거절했다(${base}${arg ? ':' + arg : ''}).`, fix: H.length ? '엔진 안내(영문): ' + H[0].replace(/\s+/g, ' ').slice(0, 260) : 'production/AUTHOR_GUIDE.md 에서 이 코드를 찾아 본보기 plan 과 맞춘다.' };
}

module.exports = { explain, isNotLintable, notLintableReason, NOT_LINTABLE, unknownKeysOf };
