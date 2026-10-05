import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXAM_ROOT = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h1');
const REPORT_DIR = path.join(ROOT, 'archive', 'analysis', 'line-equation-external-51');
const TARGET_UNITS = new Set(['H15-SA-10', 'H22-C2-02']);
const L = (a, b, c, label, color = '#2563eb', dash = '') => ({ a, b, c, label, color, dash });
const P = (label, x, y, color = '#dc2626') => ({ label, x, y, color });
const S = (x1, y1, x2, y2, color = '#16a34a', dash = '') => ({ x1, y1, x2, y2, color, dash });
const D = (lines, points, segments, notes, bounds, extra = {}) => ({ lines, points, segments, notes, bounds, policy: 'EQUAL_SCALE_REQUIRED', ...extra });
const K = (file, id) => `${file}#${id}`;

function esc(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
function fmt(value) { if (Math.abs(value) < 1e-9) return '0'; if (Math.abs(value - Math.round(value)) < 1e-9) return String(Math.round(value)); return Number(value.toFixed(4)).toString().replace('-', '−'); }
function lineText(item) { return `${fmt(item.a)}x${item.b < 0 ? '−' : '+'}${Math.abs(item.b) === 1 ? '' : fmt(Math.abs(item.b))}y${item.c < 0 ? '−' : '+'}${fmt(Math.abs(item.c))}=0`; }
function lineBox(item, bounds) {
  const [xmin, xmax, ymin, ymax] = bounds, out = [];
  if (Math.abs(item.b) > 1e-12) for (const x of [xmin, xmax]) { const y = -(item.a * x + item.c) / item.b; if (y >= ymin - 1e-9 && y <= ymax + 1e-9) out.push([x, y]); }
  if (Math.abs(item.a) > 1e-12) for (const y of [ymin, ymax]) { const x = -(item.b * y + item.c) / item.a; if (x >= xmin - 1e-9 && x <= xmax + 1e-9) out.push([x, y]); }
  const unique = out.filter((p, i) => out.findIndex(q => Math.abs(q[0] - p[0]) < 1e-9 && Math.abs(q[1] - p[1]) < 1e-9) === i);
  return unique.length >= 2 ? [unique[0], unique[1]] : [[xmin, -(item.a * xmin + item.c) / (item.b || 1)], [xmax, -(item.a * xmax + item.c) / (item.b || 1)]];
}
function renderSvg(key, diagram) {
  const [xmin, xmax, ymin, ymax] = diagram.bounds;
  const left = 38, top = 76, width = 480, height = 356;
  const scale = Math.min(width / (xmax - xmin), height / (ymax - ymin));
  const plotWidth = scale * (xmax - xmin), plotHeight = scale * (ymax - ymin);
  const ox = left + (width - plotWidth) / 2, oy = top + (height - plotHeight) / 2;
  const sx = x => ox + (x - xmin) * scale, sy = y => oy + (ymax - y) * scale;
  const body = [`<rect x="30" y="68" width="496" height="372" rx="12" fill="#fff" stroke="#cbd5e1"/>`];
  for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x += 1) body.push(`<line x1="${sx(x).toFixed(2)}" y1="${oy.toFixed(2)}" x2="${sx(x).toFixed(2)}" y2="${(oy + plotHeight).toFixed(2)}" stroke="#e5e7eb" stroke-width=".8"/>`);
  for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y += 1) body.push(`<line x1="${ox.toFixed(2)}" y1="${sy(y).toFixed(2)}" x2="${(ox + plotWidth).toFixed(2)}" y2="${sy(y).toFixed(2)}" stroke="#e5e7eb" stroke-width=".8"/>`);
  if (xmin <= 0 && xmax >= 0) body.push(`<line data-geometry="axis-y" x1="${sx(0).toFixed(2)}" y1="${oy.toFixed(2)}" x2="${sx(0).toFixed(2)}" y2="${(oy + plotHeight).toFixed(2)}" stroke="#111827" stroke-width="1.4"/><text x="${(sx(0) + 7).toFixed(2)}" y="${(oy + 15).toFixed(2)}" class="axis">y</text>`);
  if (ymin <= 0 && ymax >= 0) body.push(`<line data-geometry="axis-x" x1="${ox.toFixed(2)}" y1="${sy(0).toFixed(2)}" x2="${(ox + plotWidth).toFixed(2)}" y2="${sy(0).toFixed(2)}" stroke="#111827" stroke-width="1.4"/><text x="${(ox + plotWidth - 5).toFixed(2)}" y="${(sy(0) - 8).toFixed(2)}" text-anchor="end" class="axis">x</text>`);
  for (const item of diagram.lines) {
    const [[x1, y1], [x2, y2]] = lineBox(item, diagram.bounds);
    body.push(`<line data-geometry="line" data-a="${item.a}" data-b="${item.b}" data-c="${item.c}" data-model-x1="${x1}" data-model-y1="${y1}" data-model-x2="${x2}" data-model-y2="${y2}" data-equation="${esc(item.label || lineText(item))}" x1="${sx(x1).toFixed(2)}" y1="${sy(y1).toFixed(2)}" x2="${sx(x2).toFixed(2)}" y2="${sy(y2).toFixed(2)}" stroke="${item.color}" stroke-width="2.2" stroke-linecap="round"${item.dash ? ` stroke-dasharray="${item.dash}"` : ''}/>`);
  }
  for (const curve of diagram.curves || []) {
    const points = [];
    for (let i = 0; i <= 240; i += 1) { const x = curve.start + (curve.end - curve.start) * i / 240, y = curve.fn(x); if (Number.isFinite(y) && y >= ymin - 2 && y <= ymax + 2) points.push(`${sx(x).toFixed(2)},${sy(y).toFixed(2)}`); }
    body.push(`<polyline data-geometry="curve" data-equation="${esc(curve.label)}" points="${points.join(' ')}" fill="none" stroke="${curve.color || '#dc2626'}" stroke-width="2.2"/>`);
  }
  for (const polygon of diagram.polygons || []) body.push(`<polygon data-geometry="polygon" data-name="${esc(polygon.label || '도형')}" data-model-points="${polygon.points.map(p => p.join(',')).join(';')}" points="${polygon.points.map(([x, y]) => `${sx(x).toFixed(2)},${sy(y).toFixed(2)}`).join(' ')}" fill="${polygon.fill || '#dbeafe'}" fill-opacity=".48" stroke="#111827" stroke-width="2.1"/>`);
  for (const segment of diagram.segments) body.push(`<line data-geometry="segment" data-model-x1="${segment.x1}" data-model-y1="${segment.y1}" data-model-x2="${segment.x2}" data-model-y2="${segment.y2}" x1="${sx(segment.x1).toFixed(2)}" y1="${sy(segment.y1).toFixed(2)}" x2="${sx(segment.x2).toFixed(2)}" y2="${sy(segment.y2).toFixed(2)}" stroke="${segment.color}" stroke-width="2.1"${segment.dash ? ` stroke-dasharray="${segment.dash}"` : ''}/>`);
  for (const item of diagram.points) { const px = sx(item.x), py = sy(item.y), dx = item.dx ?? 7, labelDy = item.labelDy ?? -7, coordDy = item.coordDy ?? 14; body.push(`<g data-point-label="${esc(item.label)}" data-point-x="${item.x}" data-point-y="${item.y}"><circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="4.2" fill="${item.color}" stroke="#fff" stroke-width="1.4"/><text x="${(px + dx).toFixed(2)}" y="${(py + labelDy).toFixed(2)}" class="point" fill="${item.color}">${esc(item.label)}</text><text x="${(px + dx).toFixed(2)}" y="${(py + coordDy).toFixed(2)}" class="coord">(${fmt(item.x)}, ${fmt(item.y)})</text></g>`); }
  let panel = '<rect x="548" y="76" width="254" height="356" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><text x="566" y="108" class="panel">독립 계산 핵심</text>';
  let y = 133;
  for (const note of diagram.notes.slice(0, 13)) { panel += `<text x="566" y="${y}" class="note">${esc(note)}</text>`; y += 22; }
  const [file, id] = key.split('#');
  const factHash = crypto.createHash('sha256').update(JSON.stringify({ key, diagram })).digest('hex');
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 480" width="840" height="480" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-fact-hash="${factHash}" data-scale-policy="${diagram.policy}" data-axis-scale-mode="EQUAL_UNIT" data-geometry-style-version="AP_GEOMETRY_PRINT_V1_0_DRAFT" data-visual-provenance="external-review-independent-content-solution"><style>.axis{font:italic 13px serif;fill:#111827}.point{font:700 12px sans-serif}.coord{font:10px sans-serif;fill:#475569}.panel{font:700 16px sans-serif;fill:#0f172a}.note{font:12px sans-serif;fill:#334155}</style><title id="title">직선의 방정식 해설 도형 · 문항 ${id}</title><desc id="desc">문제 content와 solution에서 독립 계산한 실제 점·직선·관계를 표시한 좌표 도형</desc><rect width="840" height="480" fill="#fff"/><text x="38" y="32" font-size="22" font-weight="700">직선의 방정식 해설 도형 · 문항 ${id}</text><text x="38" y="55" font-size="12" fill="#475569">독립 계산값과 문제 핵심 관계를 표시</text>${body.join('')}${panel}<text x="38" y="462" font-size="11" fill="#64748b">축척: x,y 동일 단위 · content/solution 독립 계산 기반</text></svg>\n`;
}

const diagrams = new Map();
diagrams.set(K('22_금당고_1학기_기말_고1_기출.js', 13), D(
  [L(3, -4, 0, 'OP: 3x−4y=0'), L(2, -1, -5, 'PQ: y=2x−5', '#16a34a')],
  [P('O', 0, 0), P('P', 4, 3), P('H', 4, 0), P('Q', 2.5, 0), P('I', 1.6, 1.2)],
  [S(0, 0, 4, 0, '#94a3b8'), S(2.5, 0, 4, 0, '#f59e0b'), S(2.5, 0, 1.6, 1.2, '#dc2626')],
  ['H=(4,0)', 'Q=(5/2,0)', 'I=(8/5,6/5)', 'QH=QI=3/2', 'PQ: y=2x−5'], [-1, 6, -2, 6]
));
diagrams.set(K('22_매산고_1학기_기말_고1_기출.js', 15), D(
  [L(1, 1, -3, 'P의 자취 x+y=3'), L(1, -1, 0, '예시 l: y=x', '#16a34a')],
  [P('P', 1.5, 1.5), P('Q', 1.5, 0), P('R', 0, 1.5), P('F', 3, 3)],
  [S(1.5, 0, 0, 1.5, '#f59e0b'), S(1.5, 1.5, 3, 3, '#dc2626')],
  ['QR의 기울기=−1', 'l은 QR에 수직', '예시 l: y=x', '고정점 F=(3,3)'], [-2, 6, -2, 6]
));
diagrams.set(K('22_순천여고_1학기_기말_고1_기출.js', 6), D(
  [L(1, -2, 3, 'd₁: x−2y+3=0'), L(2, 1, -2, 'd₂: 2x+y−2=0'), L(1, 3, -5, 'bisector 1: x+3y−5=0', '#16a34a'), L(3, -1, 1, 'bisector 2: 3x−y+1=0', '#dc2626')],
  [P('P₁', 0, 1), P('P₂', 2, 1)], [], ['두 직선까지의 거리가 같은 점의 자취', '두 각의 이등분선을 함께 표시', 'P₁=(0,1), P₂=(2,1)'], [-2, 4, -2, 3]
));
diagrams.set(K('22_순천여고_1학기_기말_고1_기출.js', 18), D(
  [L(1, -2, 8, 'l: x−2y+8=0'), L(2, 1, 1, '수선: y=−2x−1', '#dc2626')],
  [P('A', 0, 1), P('A′', 0, -1), P('B', -2, 3), P('C', -2, 0)],
  [S(0, -1, -2, 3, '#dc2626'), S(-2, 3, -2, 0, '#f59e0b')],
  ['A=(0,1), A′=(0,−1)', '최단 경로는 A′B', 'B=(−2,3)', 'C=(-2,0)'], [-4, 3, -2, 6]
));
diagrams.set(K('22_제일고_1학기_기말_고1_기출.js', 11), D(
  [L(2, -1, 0, 'd₁: y=2x'), L(3, 2, 7, 'd₂: 3x+2y+7=0'), L(1, 2, 5, '최대거리 직선: x+2y+5=0', '#16a34a')],
  [P('O', 0, 0), P('V', -1, -2)], [S(0, 0, -1, -2, '#f59e0b')],
  ['교점 V=(−1,−2)', 'OV에 수직인 직선이 최대거리', '구하는 직선: y=−x/2−5/2'], [-4, 3, -6, 4]
));
diagrams.set(K('22_제일고_1학기_기말_고1_기출.js', 12), D(
  [L(1, 2, -1, 'd₁: x+2y−1=0'), L(2, 1, -1, 'd₂: 2x+y−1=0'), L(1, -1, 0, 'bisector 1: y=x', '#16a34a'), L(3, 3, -2, 'bisector 2: 3x+3y−2=0', '#dc2626')],
  [P('P₁', -1 / 3, 1), P('P₂', 1, 1)], [], ['거리 같음의 두 자취', 'P₁=(−1/3,1)', 'P₂=(1,1)'], [-2, 3, -2, 3]
));
diagrams.set(K('22_팔마고_1학기_기말_고1_기출.js', 14), D(
  [L(1, -1, -4, '최대거리 직선 y=x+4')], [P('O', 0, 0), P('H', -2, 2)], [S(0, 0, -2, 2, '#f59e0b')],
  ['분모 최소: k=−5/2', '구하는 직선 y=x+4', 'OH는 직선에 수직', '최대거리=2√2'], [-6, 3, -2, 7]
));
diagrams.set(K('22_팔마고_1학기_기말_고1_기출.js', 22), D(
  [L(1, -1, -1, '첫 답: y=−x+1'), L(3, -1, -5, 'l: y=3x+5', '#dc2626'), L(1, -1, -3, 'd₁: x−y+3=0', '#64748b'), L(1, 1, -1, 'd₂: x+y−1=0', '#16a34a')],
  [P('V', -1, 2), P('A', 1, 0), P('X', -5.2, 0)], [S(-1, 2, 1, 0, '#16a34a'), S(2, 3, 2, 0, '#f59e0b'), S(2, 3, -5.2, 0, '#dc2626')],
  ['주어진 두 직선의 교점 V=(−1,2)', '첫 답 직선 y=−x+1', '두 번째 직선 l: y=3x+5', 'x절편=−26/5'], [-7, 5, -1, 7], { polygons: [{ label: '넓이 삼각형', points: [[2, 3], [2, 0], [-5.2, 0]], fill: '#fee2e2' }] }
));
diagrams.set(K('22_효천고_1학기_기말_고1_기출.js', 16), D(
  [L(1, 2, 4, '공통선: x+2y+4=0'), L(-2, -3, -3, 'k=0: −2x−3y−3=0'), L(1, 1, -1, 'k=1: x+y−1=0', '#dc2626')],
  [P('V', 6, -5)], [], ['모든 직선이 지나는 공통점 V=(6,−5)', 'k에 따른 직선족', 'ㄱ은 V가 제4사분면'], [-2, 8, -8, 3]
));
diagrams.set(K('23_강남여고_1학기_기말_고1_기출.js', 24), D(
  [L(1, -1, 2, 'a=1: l x−y+2=0'), L(4, 4, 2, 'a=1: m 4x+4y+2=0', '#16a34a'), L(1, -1, -2, 'a=1: n x−y−2=0', '#dc2626'), L(1, 4, 2, 'a=−4: l x+4y+2=0'), L(4, -1, 2, 'a=−4: m 4x−y+2=0', '#16a34a'), L(1, 4, -2, 'a=−4: n x+4y−2=0', '#dc2626')],
  [P('V₁', 0, 2), P('V₂', 0, -0.5)], [], ['ab=4', 'a=b−3', '해: (a,b)=(1,4), (−4,−1)', '두 경우 모두 a²+b²=17'], [-7, 5, -8, 6]
));
diagrams.set(K('23_금당고_1학기_기말_고1_기출.js', 7), D(
  [L(1, 2, -4, '수직이등분선: x+2y−4=0', '#dc2626')],
  [P('A', -1, 0), P('B', 1, 4), P('M', 0, 2), P('X', 4, 0)], [S(-1, 0, 1, 4, '#64748b'), S(0, 2, 4, 0, '#f59e0b')],
  ['AB의 중점 M=(0,2)', 'AB 기울기=2', '수직이등분선 y=−x/2+2', 'x절편 X=(4,0)'], [-3, 5, -1, 5]
));
diagrams.set(K('23_금당고_1학기_기말_고1_기출.js', 12), D(
  [L(1, -2, 2, 'L₁: x−2y+2=0'), L(1, -2, 1, 'L₂: x−2y+1=0', '#16a34a')], [], [],
  ['a=1에서 서로 다른 평행선', '사이 거리=1/√5', '두 선분을 변으로 갖는 정사각형', '넓이=1/5'], [-2, 2, -2, 3], { polygons: [{ label: '정사각형', points: [[0, 1], [0.4, 1.2], [0.6, 0.8], [0.2, 0.6]], fill: '#dcfce7' }] }
));
diagrams.set(K('23_순천여고_1학기_기말_고1_기출.js', 11), D(
  [L(2, 1, -1, 'AB: 2x+y−1=0', '#64748b'), L(1, -2, -3, '구하는 직선: x−2y−3=0', '#dc2626')],
  [P('A', -1, 3), P('B', 2, -3), P('C', 1, -1)], [S(-1, 3, 2, -3, '#64748b'), S(1, -1, 2.5, -0.25, '#dc2626')],
  ['C=(1,−1)', 'AB 기울기=−2', '구하는 직선의 기울기=1/2', 'C를 지나는 수직선'], [-4, 4, -5, 5]
));
diagrams.set(K('23_순천여고_1학기_기말_고1_기출.js', 21), D(
  [L(0, 1, 0, 'l₁: y=0'), L(24, -7, 0, 'l₂: y=24x/7', '#16a34a')],
  [P('O', 0, 0), P('P', 4, 3), P('H₁', 4, 0), P('H₂', 28 / 25, 96 / 25)], [S(4, 3, 4, 0, '#f59e0b'), S(4, 3, 28 / 25, 96 / 25, '#dc2626')],
  ['두 직선은 원점을 통과', 'P=(4,3)', 'PH₁=PH₂=3', 'y=24x/7'], [-1, 5, -1, 5]
));
diagrams.set(K('23_팔마고_1학기_기말_고1_기출.js', 17), D(
  [L(2, 1, -13, 'BP: 2x+y−13=0'), L(2, 1, -34, 'AC: y=−2x+17', '#64748b'), L(1, -7, 14, 'PQ: y=x/7+2', '#dc2626')],
  [P('A', 5, 7), P('B', 3, 5), P('C', 10, -3), P('Q', 0, 2), P('P', 7, 3)], [S(3, 5, 7, 3, '#16a34a'), S(0, 2, 10, -3, '#16a34a'), S(0, 2, 7, 3, '#dc2626')],
  ['Q=(0,2)', 'P=(7,3)', 'BP∥QC', 'PQ: y=x/7+2', 'n/m=14'], [-1, 11, -4, 19]
));
diagrams.set(K('23_팔마고_1학기_기말_고1_기출.js', 18), D(
  [L(1, 1, -5, 'PQ의 직선 y=−x+5', '#64748b'), L(-1, 3, 1, '이등분선 1: −x+3y+1=0'), L(3, 1, -3, '이등분선 2: 3x+y−3=0', '#16a34a')],
  [P('O', 0, 0), P('P', 4, 1), P('Q', -1, 6)], [S(4, 1, -1, 6, '#dc2626')],
  ['P=(4,1), Q=(−1,6)', '두 직선까지의 거리 같음', 'PQ 위 두 교점', '넓이=25/2'], [-3, 6, -2, 8], { polygons: [{ label: 'OPQ', points: [[0, 0], [4, 1], [-1, 6]], fill: '#fee2e2' }] }
));
diagrams.set(K('23_팔마고_1학기_기말_고1_기출.js', 22), D(
  [L(1, 0, -2, '수직선: x=2'), L(5, -12, 26, '두 번째 직선: y=5x/12+13/6', '#dc2626'), L(2, -1, -1, 'd₁: 2x−y−1=0', '#64748b'), L(1, -2, 4, 'd₂: x−2y+4=0', '#16a34a')],
  [P('V', 2, 3), P('A', 2, 0), P('B', -26 / 5, 0)], [S(2, 3, 2, 0, '#f59e0b'), S(2, 3, -26 / 5, 0, '#dc2626')],
  ['두 주어진 직선의 교점 V=(2,3)', 'x=2는 수직선', '두 번째 x절편=−26/5', '삼각형 넓이=54/5'], [-7, 4, -1, 6], { polygons: [{ label: '넓이 삼각형', points: [[2, 3], [2, 0], [-26 / 5, 0]], fill: '#fee2e2' }] }
));
diagrams.set(K('24_금당고_1학기_기말_고1_기출.js', 11), D(
  [L(2, -5, 20, '공통조건: 2x−5y+20=0'), L(1, 5, -5, '공통조건: x+5y−5=0'), L(2, -1, -12, 'P와 (−3,6): y=2x+12', '#dc2626')],
  [P('P', -5, 2), P('T', -3, 6), P('X', -6, 0), P('Y', 0, 12)], [S(-5, 2, -3, 6, '#dc2626')],
  ['항등식 공통점 P=(−5,2)', '직선 y=2x+12', 'x절편=−6', 'y절편=12', '좌표축과 넓이=36'], [-8, 2, -2, 14], { polygons: [{ label: '좌표축 삼각형', points: [[0, 0], [-6, 0], [0, 12]], fill: '#fee2e2' }] }
));
diagrams.set(K('24_제일고_1학기_중간_고1_기출.js', 14), D(
  [L(0, 1, -1, 'k=−1: y=1'), L(1, 2, -3, 'k=0: x+2y−3=0', '#16a34a'), L(2, 1, -3, 'k=1: 2x+y−3=0', '#dc2626'), L(6, -3, -1, '비교선: 6x−3y−1=0', '#9333ea')],
  [P('V', 1, 1)], [], ['ㄱ k=−1: 수평선', 'ㄴ k=0: 기울기 −1/2와 2로 수직', 'ㄷ 모든 k가 (1,1)을 통과', 'ㄹ k=1은 평행 아님'], [-3, 5, -2, 5]
));
diagrams.set(K('24_제일고_1학기_중간_고1_기출.js', 17), D(
  [L(1, -1, -1, 'PA: y=x+1'), L(-2, 1, -3, 'PB: y=2x+3', '#16a34a')],
  [P('P', -2, -1), P('A', 2, 5), P('B', 4, 1)], [S(2, 5, 4, 1, '#64748b')],
  ['공통 정점 P=(−2,−1)', 'P-A에서 m=1/7', 'P-B에서 m=−2/7', '선분 AB와 만나는 범위'], [-4, 6, -3, 7]
));
diagrams.set(K('24_제일고_1학기_중간_고1_기출.js', 20), D(
  [L(2, 1, -2 * Math.sqrt(21), '분할선: 2x+y=2√21', '#dc2626'), L(4, 5, -20, 'OA: 4x−5y=0', '#64748b'), L(1, 0, -6, 'OB: x−6=0', '#64748b')],
  [P('O', 0, 0), P('A', 5, 4), P('B', 6, 0), P('R', Math.sqrt(21), 0), P('S', 5 * Math.sqrt(21) / 7, 4 * Math.sqrt(21) / 7)], [S(0, 0, 6, 0, '#64748b'), S(0, 0, 5, 4, '#64748b'), S(0, 0, Math.sqrt(21), 0, '#f59e0b'), S(0, 0, 5 * Math.sqrt(21) / 7, 4 * Math.sqrt(21) / 7, '#f59e0b')],
  ['[AOB]=12', '분할선과 OB의 교점 R=(√21,0)', '분할선과 OA의 교점 S=(5√21/7,4√21/7)', '각 부분 넓이=6'], [-1, 7, -2, 6], { polygons: [{ label: 'AOB', points: [[0, 0], [5, 4], [6, 0]], fill: '#dbeafe' }] }
));
diagrams.set(K('21_순천고_2학기_중간_고1_기출.js', 21), D(
  [L(4, 3, -24, 'AC: 4x+3y−24=0')],
  [P('B', 0, 0), P('C', 6, 0), P('A', 0, 8), P('P', 3, 4), P('Q', 3, 0), P('R', 0, 4)], [S(3, 4, 3, 0, '#f59e0b'), S(3, 4, 0, 4, '#f59e0b')],
  ['P=(3,4)', 'BQ=3, QR=4', 'P에서 AB·BC로 내린 두 수선', '직사각형 둘레=14'], [-1, 7, -1, 9], { polygons: [{ label: 'BQPR', points: [[0, 0], [3, 0], [3, 4], [0, 4]], fill: '#dcfce7' }] }
));
diagrams.set(K('22_강남여고_2학기_중간_고1_기출.js', 13), D(
  [L(0, -1, 1, 'm=0: y=1', '#64748b'), L(3, -1, -8, '최대거리 직선: y=−3x−8', '#dc2626')],
  [P('P', -3, 1), P('A', 3, 3)], [S(-3, 1, 3, 3, '#f59e0b')],
  ['모든 직선이 P=(−3,1)을 통과', 'AP 기울기=1/3', '최대 직선의 기울기=−3', 'M=2√10'], [-5, 5, -5, 6]
));
diagrams.set(K('25_금당고_2학기_중간_고1_기출.js', 14), D(
  [L(1, -1, -1, 'A 수선: y=x+1'), L(2, 1, -16, 'C 수선: y=−2x+16', '#dc2626'), L(1, 1, -9, 'BC: x+y−9=0', '#64748b'), L(1, -2, -3, 'AB: x−2y−3=0', '#64748b')],
  [P('A', 1, 2), P('B', 7, 5), P('C', 4, 8), P('H', 5, 6)], [S(1, 2, 5, 6, '#f59e0b'), S(4, 8, 5, 6, '#f59e0b')],
  ['H=(5,6)', 'A 수선: y=x+1', 'C 수선: y=−2x+16', '넓이 [HBC]=3/2'], [0, 9, 0, 10], { polygons: [{ label: 'ABC', points: [[1, 2], [7, 5], [4, 8]], fill: '#dbeafe' }] }
));
diagrams.set(K('25_순천고_2학기_중간_고1_기출.js', 18), D(
  [L(3, -1, -1, 'BC: 3x−y−1=0'), L(1, 3, -24, 'AH: x+3y−24=0', '#dc2626')],
  [P('M', 0, -1), P('G', 3, 1), P('A', 9, 5), P('H', 2.7, 7.1)], [S(9, 5, 2.7, 7.1, '#f59e0b')],
  ['M=(0,−1), G=(3,1)', 'A=3G−2M=(9,5)', 'H=(27/10,71/10)', 'AH=21/√10'], [-2, 11, -2, 10]
));
diagrams.set(K('25_순천여고_2학기_중간_고1_공통수학2.js', 12), D(
  [L(1, -1, -4, 'BC: y=x+4'), L(1, 1, -5, '수선: y=−x+5', '#dc2626')],
  [P('A', 2, 3), P('B', -1, 3), P('C', 3, 7), P('M', 0.5, 4.5)], [S(2, 3, 0.5, 4.5, '#f59e0b'), S(-1, 3, 3, 7, '#64748b')],
  ['BC 기울기=1', '수선 기울기=−1', 'M=(1/2,9/2)', '4ab=9'], [-2, 5, 0, 7]
));
diagrams.set(K('25_제일고_2학기_중간_고1_기출.js', 15), D(
  [L(1, 1, -4, 'DE: x+y−4=0', '#dc2626'), L(1, 1, 4, 'BC: x+y+4=0', '#16a34a')],
  [P('A', 2, 5), P('B', -1, -1), P('C', 6, -8), P('D', 1, 3), P('E', 10 / 3, 2 / 3)], [S(2, 5, -1, -1, '#64748b'), S(2, 5, 6, -8, '#64748b'), S(1, 3, 10 / 3, 2 / 3, '#dc2626')],
  ['D=(1,3), E=(10/3,2/3)', 'DE∥BC', 'DE: y=−x+4', '넓이비 1:9 → 닮음비 1:3', 'a+b=3'], [-4, 8, -10, 8], { polygons: [{ label: 'ABC', points: [[2, 5], [-1, -1], [6, -8]], fill: '#dbeafe' }, { label: 'ADE', points: [[2, 5], [1, 3], [10 / 3, 2 / 3]], fill: '#fee2e2' }] }
));
diagrams.set(K('21_복성고_2학기_중간_고1_기출.js', 17), D(
  [L(2, 1, -4, '가까운 직선: 2x+y−4=0'), L(1, -2, 8, '다른 직선: x−2y+8=0')],
  [P('O', 0, 0), P('H', 8 / 5, 4 / 5)], [S(0, 0, 8 / 5, 4 / 5, '#f59e0b')],
  ['최솟값은 가까운 직선에서 결정', 'H=(8/5,4/5)', 'OH²=16/5'], [-3, 5, -3, 5]
));
diagrams.set(K('23_복성고_1학기_기말_고1_기출.js', 5), D(
  [L(1, 2, 0, '주어진 직선: x+2y=0'), L(2, -1, 3, '수직인 직선: 2x−y+3=0', '#16a34a')],
  [P('P', 1, 5)], [], ['주어진 기울기=−1/2', '수직 기울기=2', 'P=(1,5), y=2x+3'], [-3, 5, -2, 8]
));
diagrams.set(K('23_순천여고_1학기_기말_고1_기출.js', 13), D(
  [L(-3, 3, 3, '최대 조건: −3x+3y+3=0')],
  [P('O', 0, 0), P('H', 1 / 2, -1 / 2)], [S(0, 0, 1 / 2, -1 / 2, '#f59e0b')],
  ['k=−1에서 분모 최소', 'H=(1/2,−1/2)', 'OH는 직선에 수직', '최대거리=1/√2'], [-3, 4, -3, 3]
));
diagrams.set(K('24_금당고_1학기_기말_고1_기출.js', 5), D(
  [L(3, -4, 1, '3x−4y+1=0')],
  [P('P', 2, 3), P('H', 13 / 5, 11 / 5)], [S(2, 3, 13 / 5, 11 / 5, '#f59e0b')],
  ['P=(2,3)', 'H=(13/5,11/5)', 'PH=1', '수선의 발은 직선 위'], [0, 5, 0, 5]
));
diagrams.set(K('24_매산고_1학기_기말_고1_기출.js', 6), D(
  [L(1, 3, -3, '첫 직선: x/3+y−1=0'), L(3, -1, -2, '기준선: 3x−y−2=0', '#64748b'), L(2, 6, 1, '세 번째 직선: 2x+6y+1=0', '#16a34a')],
  [], [], ['a=4/3: 첫 직선', '기준선과 수직', 'b=5: 세 번째 직선', '첫 직선과 세 번째 직선은 평행'], [-4, 4, -4, 4]
));
diagrams.set(K('24_매산고_1학기_기말_고1_기출.js', 11), D(
  [L(2, -1, 5, '실제 교점 직선: y=2x+5')],
  [P('P', -1, 3), P('Q', 5, 15), P('R', 0, 5)], [S(-1, 3, 5, 15, '#64748b')],
  ['곡선 y=x²−2x', '직선 y=2x+5', 'P=(−1,3), Q=(5,15)', '1:5 내분점 R=(0,5)'], [-3, 7, -4, 18], { curves: [{ fn: x => x * x - 2 * x, start: -3, end: 6, label: 'y=x²−2x', color: '#dc2626' }] }
));
const q21As = [2 + Math.sqrt(3), 2 - Math.sqrt(3), -3 + 2 * Math.sqrt(2), -3 - 2 * Math.sqrt(2)];
const q21Lines = q21As.map((a, index) => L(3 * a, 4 * a, a * a + 1, `a${index + 1}: 3ax+4ay+a²+1=0`, ['#2563eb', '#16a34a', '#dc2626', '#9333ea'][index]));
const q21Points = [P('P', -1, 1), ...q21As.map((a, index) => { const value = a * a + a + 1; return P(`H${index + 1}`, -1 - (3 * value) / (25 * a), 1 - (4 * value) / (25 * a), '#f59e0b'); })];
q21Points[1].dx = 9; q21Points[1].labelDy = -18; q21Points[1].coordDy = 15;
q21Points[2].dx = -42; q21Points[2].labelDy = -18; q21Points[2].coordDy = 15;
q21Points[3].dx = 9; q21Points[3].labelDy = 16; q21Points[3].coordDy = 31;
q21Points[4].dx = -42; q21Points[4].labelDy = 16; q21Points[4].coordDy = 31;
diagrams.set(K('24_제일고_1학기_중간_고1_기출.js', 21), D(
  q21Lines, q21Points, q21As.map((a) => { const value = a * a + a + 1; return S(-1, 1, -1 - (3 * value) / (25 * a), 1 - (4 * value) / (25 * a), '#f59e0b'); }),
  ['P=(−1,1)', '거리식 |a²+a+1|=5|a|', 'a=2±√3, −3±2√2', '각 Hᵢ는 P에서의 수선의 발'], [-8, 5, -7, 6]
));
diagrams.set(K('25_순천여고_2학기_중간_고1_공통수학2.js', 19), D(
  [L(0, 1, -2, 'm=0: y=−2'), L(2 / 3, 1, -2, '경계 m=2/3: y=−2x/3+2', '#dc2626')],
  [], [], ['제1사분면과 교차하지 않음', 'm<0이면 교차', '0≤m≤2/3', '경계 x절편=(3,0)'], [-2, 6, -3, 5], { polygons: [{ label: '제1사분면 참고 영역', points: [[0, 0], [6, 0], [0, 5]], fill: '#dcfce7' }] }
));

const numericRepairKeys = new Set([
  K('21_복성고_2학기_중간_고1_기출.js', 17), K('22_금당고_1학기_기말_고1_기출.js', 13), K('22_매산고_1학기_기말_고1_기출.js', 15), K('22_순천여고_1학기_기말_고1_기출.js', 18), K('22_제일고_1학기_기말_고1_기출.js', 11), K('22_제일고_1학기_기말_고1_기출.js', 12), K('22_팔마고_1학기_기말_고1_기출.js', 14), K('22_팔마고_1학기_기말_고1_기출.js', 22), K('22_효천고_1학기_기말_고1_기출.js', 16), K('23_강남여고_1학기_기말_고1_기출.js', 22), K('23_복성고_1학기_기말_고1_기출.js', 5), K('23_순천여고_1학기_기말_고1_기출.js', 13), K('23_팔마고_1학기_기말_고1_기출.js', 17), K('23_팔마고_1학기_기말_고1_기출.js', 18), K('23_팔마고_1학기_기말_고1_기출.js', 22), K('24_금당고_1학기_기말_고1_기출.js', 5), K('24_매산고_1학기_기말_고1_기출.js', 6), K('24_매산고_1학기_기말_고1_기출.js', 11), K('24_제일고_1학기_중간_고1_기출.js', 21), K('25_순천여고_2학기_중간_고1_공통수학2.js', 19), K('25_제일고_2학기_중간_고1_기출.js', 15),
]);
const semanticRepairKeys = new Set([
  K('22_금당고_1학기_기말_고1_기출.js', 13), K('22_매산고_1학기_기말_고1_기출.js', 15), K('22_순천여고_1학기_기말_고1_기출.js', 6), K('22_순천여고_1학기_기말_고1_기출.js', 18), K('22_제일고_1학기_기말_고1_기출.js', 11), K('22_제일고_1학기_기말_고1_기출.js', 12), K('22_팔마고_1학기_기말_고1_기출.js', 14), K('22_팔마고_1학기_기말_고1_기출.js', 22), K('22_효천고_1학기_기말_고1_기출.js', 16), K('23_강남여고_1학기_기말_고1_기출.js', 24), K('23_금당고_1학기_기말_고1_기출.js', 7), K('23_금당고_1학기_기말_고1_기출.js', 12), K('23_순천여고_1학기_기말_고1_기출.js', 11), K('23_순천여고_1학기_기말_고1_기출.js', 21), K('23_팔마고_1학기_기말_고1_기출.js', 17), K('23_팔마고_1학기_기말_고1_기출.js', 18), K('23_팔마고_1학기_기말_고1_기출.js', 22), K('24_금당고_1학기_기말_고1_기출.js', 11), K('24_제일고_1학기_중간_고1_기출.js', 14), K('24_제일고_1학기_중간_고1_기출.js', 17), K('24_제일고_1학기_중간_고1_기출.js', 20), K('21_순천고_2학기_중간_고1_기출.js', 21), K('22_강남여고_2학기_중간_고1_기출.js', 13), K('25_금당고_2학기_중간_고1_기출.js', 14), K('25_순천고_2학기_중간_고1_기출.js', 18), K('25_순천여고_2학기_중간_고1_공통수학2.js', 12), K('25_제일고_2학기_중간_고1_기출.js', 15),
]);

const metadataFixes = new Map([
  [K('22_매산고_1학기_기말_고1_기출.js', 9), ['H15-SA-10-EQUATION_BASIC', '방정식의 풀이']],
  [K('22_매산고_1학기_기말_고1_기출.js', 15), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('22_순천여고_1학기_기말_고1_기출.js', 3), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('22_순천여고_1학기_기말_고1_기출.js', 18), ['H15-SA-10-DISTANCE_ANGLE', '직선 사이의 거리와 각']],
  [K('22_제일고_1학기_기말_고1_기출.js', 11), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('22_제일고_1학기_기말_고1_기출.js', 12), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('22_팔마고_1학기_기말_고1_기출.js', 14), ['H15-SA-10-DISTANCE_ANGLE', '직선 사이의 거리와 각']],
  [K('22_팔마고_1학기_기말_고1_기출.js', 22), ['H15-SA-10-DISTANCE_ANGLE', '직선 사이의 거리와 각']],
  [K('23_강남여고_1학기_기말_고1_기출.js', 5), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_강남여고_1학기_기말_고1_기출.js', 22), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_금당고_1학기_기말_고1_기출.js', 5), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_금당고_1학기_기말_고1_기출.js', 7), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_매산고_1학기_기말_고1_기출.js', 7), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_복성고_1학기_기말_고1_기출.js', 5), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_순천여고_1학기_기말_고1_기출.js', 11), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_제일고_1학기_기말_고1_기출.js', 13), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('23_팔마고_1학기_기말_고1_기출.js', 17), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('24_금당고_1학기_기말_고1_기출.js', 6), ['H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행과 수직']],
  [K('24_매산고_1학기_기말_고1_기출.js', 14), ['H15-SA-10-DISTANCE_ANGLE', '직선 사이의 거리와 각']],
  [K('24_제일고_1학기_중간_고1_기출.js', 14), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('24_제일고_1학기_중간_고1_기출.js', 16), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('21_순천고_2학기_중간_고1_기출.js', 21), ['H15-SA-10-DISTANCE_ANGLE', '직선 사이의 거리와 각']],
  [K('21_효천고_2학기_중간_고1_기출.js', 13), ['H15-SA-10-DISTANCE_ANGLE', '직선 사이의 거리와 각']],
  [K('25_금당고_2학기_중간_고1_기출.js', 2), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('25_금당고_2학기_중간_고1_기출.js', 14), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('25_순천고_2학기_중간_고1_기출.js', 18), ['H22-C2-02-RELATION', '두 직선의 관계']],
  [K('25_순천여고_2학기_중간_고1_공통수학2.js', 12), ['H22-C2-02-RELATION', '두 직선의 관계']],
]);

function loadBank(file) { const context = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 5000 }); return context.window.questionBank || []; }
function objectRange(text, content) { const marker = `"content": ${JSON.stringify(content)},`; const contentIndex = text.indexOf(marker); if (contentIndex < 0) throw new Error(`content marker not found: ${content.slice(0, 40)}`); return text.lastIndexOf('{', contentIndex); }
function valueRange(text, index) { let valueStart = index; while (/\s/.test(text[valueStart] || '')) valueStart += 1; const first = text[valueStart]; if (first === '"') { let escaped = false; for (let i = valueStart + 1; i < text.length; i += 1) { if (escaped) escaped = false; else if (text[i] === '\\') escaped = true; else if (text[i] === '"') return [valueStart, i + 1]; } } if (first === '[' || first === '{') { const open = first, close = first === '[' ? ']' : '}'; let depth = 0, quote = false, escaped = false; for (let i = valueStart; i < text.length; i += 1) { const ch = text[i]; if (quote) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quote = false; continue; } if (ch === '"') { quote = true; continue; } if (ch === open) depth += 1; else if (ch === close) { depth -= 1; if (depth === 0) return [valueStart, i + 1]; } } } const comma = text.indexOf(',', valueStart); return [valueStart, comma < 0 ? text.length : comma]; }
function replaceInObject(text, question, changes) { let next = text; let start = objectRange(next, question.content); for (const [field, value] of Object.entries(changes)) { const marker = `"${field}":`; const index = next.indexOf(marker, start); if (index < 0) throw new Error(`field ${field} not found for q${question.id}`); const [valueStart, valueEnd] = valueRange(next, index + marker.length); next = next.slice(0, valueStart) + JSON.stringify(value) + next.slice(valueEnd); start = objectRange(next, question.content); } return next; }
function updateMetadata(file, question, changes) { const before = fs.readFileSync(file, 'utf8'); const after = replaceInObject(before, question, changes); fs.writeFileSync(file, after, 'utf8'); }
function collectTargets() { const result = []; function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) walk(full); else if (entry.name.endsWith('.js')) { for (const q of loadBank(full)) if (TARGET_UNITS.has(q.standardUnitKey)) result.push({ file: full, relative: path.relative(ROOT, full).replaceAll(path.sep, '/'), q }); } } } walk(EXAM_ROOT); return result; }
function normalizeTags(q, diagram) { const tags = Array.isArray(q.tags) ? [...q.tags] : []; const add = tag => { if (!tags.includes(tag)) tags.push(tag); }; add('도형'); add('직선'); if ((diagram.curves || []).length) add('그래프'); const text = `${q.content}\n${q.solution}`; if (/평행/.test(text)) add('평행'); if (/수직|수선/.test(text)) add('수직'); if (/거리/.test(text)) add('거리'); if (/절편/.test(text)) add('절편'); if (/교점/.test(text)) add('교점'); if (/넓이/.test(text)) add('넓이'); return tags; }

const targets = collectTargets();
if (targets.length !== 94) throw new Error(`expected 94 target questions, got ${targets.length}`);
const beforeFidelity = new Map(targets.map(({ relative, q }) => [K(path.basename(relative), q.id), { content: q.content, choices: q.choices, answer: q.answer }]));
const changed = [];
for (const [key, diagram] of diagrams) {
  const target = targets.find(row => K(path.basename(row.relative), row.q.id) === key);
  if (!target) throw new Error(`diagram target not found: ${key}`);
  const asset = path.join(ROOT, 'archive', 'assets', 'images', path.basename(target.file, '.js'), `q${String(target.q.id).padStart(2, '0')}-solution.svg`);
  fs.mkdirSync(path.dirname(asset), { recursive: true });
  fs.writeFileSync(asset, renderSvg(key, diagram), 'utf8');
  const fields = { tags: normalizeTags(target.q, diagram) };
  if (metadataFixes.has(key)) { const [subUnitKey, subUnit] = metadataFixes.get(key); fields.subUnitKey = subUnitKey; fields.subUnit = subUnit; }
  if (Object.keys(fields).length) updateMetadata(target.file, target.q, fields);
  changed.push({ key, visual: true, numeric: numericRepairKeys.has(key), semantic: semanticRepairKeys.has(key), metadata: metadataFixes.has(key), asset: path.relative(ROOT, asset).replaceAll(path.sep, '/') });
}
for (const [key, [subUnitKey, subUnit]] of metadataFixes) {
  if (changed.some(row => row.key === key)) continue;
  const target = targets.find(row => K(path.basename(row.relative), row.q.id) === key);
  if (!target) throw new Error(`metadata target not found: ${key}`);
  updateMetadata(target.file, target.q, { subUnitKey, subUnit, tags: normalizeTags(target.q, { curves: [] }) });
  changed.push({ key, visual: false, numeric: false, semantic: false, metadata: true });
}

const afterTargets = collectTargets();
for (const { relative, q } of afterTargets) {
  const before = beforeFidelity.get(K(path.basename(relative), q.id));
  if (!before) continue;
  if (JSON.stringify(before.content) !== JSON.stringify(q.content) || JSON.stringify(before.choices) !== JSON.stringify(q.choices) || JSON.stringify(before.answer) !== JSON.stringify(q.answer)) throw new Error(`content/choices/answer changed: ${relative}#${q.id}`);
}
const report = {
  status: 'PASS',
  baseSha: '5958eedf933f306bb044bb350f2763dafe8b1343',
  latestMainUsed: '08ed4f102fc992ad839b75c1dff0f8208fb463dc',
  targetCount: 94,
  h15Count: afterTargets.filter(row => row.q.standardUnitKey === 'H15-SA-10').length,
  h22Count: afterTargets.filter(row => row.q.standardUnitKey === 'H22-C2-02').length,
  externalReviewFindingCategories: { reportedFailQuestions: 51, numericHardFails: 21, semanticVisualFails: 27, subUnitResidualFindings: 10, overlapsIncluded: true },
  modifiedVisualCount: changed.filter(row => row.visual).length,
  modifiedMetadataCount: changed.filter(row => row.metadata).length,
  modifiedQuestionKeys: changed,
  contentChoicesAnswerPreserved: true,
  answerMathPreserved: true,
};
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'repair-ledger.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, targetCount: report.targetCount, h15Count: report.h15Count, h22Count: report.h22Count, modifiedVisualCount: report.modifiedVisualCount, modifiedMetadataCount: report.modifiedMetadataCount, numericHardFails: report.externalReviewFindingCategories.numericHardFails, semanticVisualFails: report.externalReviewFindingCategories.semanticVisualFails }, null, 2));
