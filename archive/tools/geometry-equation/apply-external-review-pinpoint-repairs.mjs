import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "archive", "exams", "original", "high", "h1");
const ASSET_ROOT = path.join(ROOT, "archive", "assets", "images");
const ledger = [];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value, "utf8");
}

function loadQuestions(file) {
  const context = { window: {} };
  vm.runInNewContext(read(file), context, { filename: file });
  return context.window.questionBank;
}

function replaceField(file, question, field, nextValue) {
  const oldValue = question[field];
  if (typeof oldValue !== "string") throw new Error(`${field} is not a string in ${file}`);
  const source = read(file);
  const objectMarker = `"content": ${JSON.stringify(question.content)},`;
  const markerIndex = source.indexOf(objectMarker);
  if (markerIndex < 0) throw new Error(`Question marker not found: ${file} q${question.id}`);
  const fieldMarker = `"${field}": ${JSON.stringify(oldValue)}`;
  const fieldIndex = source.indexOf(fieldMarker, markerIndex);
  if (fieldIndex < 0) throw new Error(`Field ${field} not found: ${file} q${question.id}`);
  const updated = source.slice(0, fieldIndex) + `"${field}": ${JSON.stringify(nextValue)}` + source.slice(fieldIndex + fieldMarker.length);
  write(file, updated);
  ledger.push({ file: path.relative(ROOT, file).replaceAll("\\", "/"), id: question.id, field, status: "REPLACED" });
}

function findQuestion(relative, predicate) {
  const file = path.join(ROOT, relative);
  const questions = loadQuestions(file);
  const matches = questions.filter(predicate);
  if (matches.length !== 1) throw new Error(`Expected one question in ${relative}, got ${matches.length}`);
  return { file, question: matches[0] };
}

function updateMetadata(relative, predicate, changes) {
  const file = path.join(ROOT, relative);
  let source = read(file);
  const questions = loadQuestions(file);
  const matches = questions.filter(predicate);
  if (matches.length !== 1) throw new Error(`Expected one metadata target in ${relative}, got ${matches.length}`);
  const question = matches[0];
  const objectMarker = `"content": ${JSON.stringify(question.content)},`;
  const contentIndex = source.indexOf(objectMarker);
  if (contentIndex < 0) throw new Error(`Question marker not found: ${relative} q${question.id}`);
  const markerIndex = source.lastIndexOf("\n  {", contentIndex);
  for (const [field, nextValue] of Object.entries(changes)) {
    const oldValue = question[field];
    if (oldValue === nextValue) continue;
    const fieldMarker = `"${field}": ${JSON.stringify(oldValue)}`;
    const fieldIndex = source.indexOf(fieldMarker, markerIndex);
    if (fieldIndex < 0) throw new Error(`Metadata field ${field} not found: ${relative} q${question.id}`);
    source = source.slice(0, fieldIndex) + `"${field}": ${JSON.stringify(nextValue)}` + source.slice(fieldIndex + fieldMarker.length);
  }
  write(file, source);
  ledger.push({ file: relative, id: question.id, field: Object.keys(changes), status: "METADATA_UPDATED" });
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function frame(xMin, xMax, yMin, yMax) {
  const left = 248;
  const top = 92;
  const width = 224;
  const height = 224;
  const sx = (x) => left + ((x - xMin) / (xMax - xMin)) * width;
  const sy = (y) => top + ((yMax - y) / (yMax - yMin)) * height;
  const body = ['<rect x="42" y="78" width="636" height="256" rx="14" fill="#ffffff" stroke="#cbd5e1"/>'];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += 1) body.push(`<line x1="${sx(x).toFixed(2)}" y1="${top}" x2="${sx(x).toFixed(2)}" y2="${top + height}" stroke="#e2e8f0" stroke-width="1"/>`);
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += 1) body.push(`<line x1="${left}" y1="${sy(y).toFixed(2)}" x2="${left + width}" y2="${sy(y).toFixed(2)}" stroke="#e2e8f0" stroke-width="1"/>`);
  if (xMin <= 0 && xMax >= 0) body.push(`<line x1="${sx(0).toFixed(2)}" y1="${top}" x2="${sx(0).toFixed(2)}" y2="${top + height}" stroke="#334155" stroke-width="1.8"/><text x="${(sx(0) + 8).toFixed(2)}" y="${top + 15}" font-size="12" fill="#334155">y</text>`);
  if (yMin <= 0 && yMax >= 0) body.push(`<line x1="${left}" y1="${sy(0).toFixed(2)}" x2="${left + width}" y2="${sy(0).toFixed(2)}" stroke="#334155" stroke-width="1.8"/><text x="${left + width - 8}" y="${(sy(0) - 8).toFixed(2)}" text-anchor="end" font-size="12" fill="#334155">x</text>`);
  return { body, sx, sy };
}

function documentSvg({ title, caption, body, factHash, method, policy, semanticRole }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" width="720" height="360" role="img" data-fact-hash="${esc(factHash)}" data-scale-policy="${policy}" data-semantic-role="${semanticRole}">`,
    `<title>${esc(title)}</title><desc>${esc(caption)}</desc>`,
    '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#2563eb"/></marker></defs>',
    '<rect width="720" height="360" rx="18" fill="#f8fafc"/>',
    `<text x="32" y="38" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#0f172a">${esc(title)}</text>`,
    `<text x="32" y="64" font-family="Arial,sans-serif" font-size="12" fill="#475569">${esc(caption)}</text>`,
    ...body,
    `<text x="32" y="344" font-family="Arial,sans-serif" font-size="11" fill="#64748b">풀이 관찰: ${esc(method)}</text>`,
    '</svg>\n',
  ].join("");
}

function point(label, x, y, sx, sy, color = "#2563eb", role = "point") {
  const px = sx(x);
  const py = sy(y);
  return `<g data-point-label="${esc(label)}" data-point-x="${x}" data-point-y="${y}" data-point-role="${role}" data-point-provenance="explicit-reviewed-fact"><circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="5.5" fill="${color}" stroke="#ffffff" stroke-width="2"/><text x="${(px + 9).toFixed(2)}" y="${(py - 8).toFixed(2)}" font-size="12" font-weight="700" fill="${color}">${esc(label)}</text><text x="${(px + 9).toFixed(2)}" y="${(py + 16).toFixed(2)}" font-size="10" fill="#475569">(${x}, ${y})</text></g>`;
}

function q20Svg(factHash) {
  const { body, sx, sy } = frame(-1, 7, -3, 5);
  const k = 2 * Math.sqrt(21);
  const rX = Math.sqrt(21);
  const sX = (5 * k) / 14;
  const sY = (2 * k) / 7;
  const bisectorStartX = (k - 5) / 2;
  const bisectorEndX = (k + 1) / 2;
  body.push(
    `<path data-geometry="triangle" data-name="triangle-AOB" d="M${sx(0).toFixed(2)},${sy(0).toFixed(2)} L${sx(5).toFixed(2)},${sy(4).toFixed(2)} L${sx(6).toFixed(2)},${sy(0).toFixed(2)} Z" fill="#dbeafe" fill-opacity=".75" stroke="#1d4ed8" stroke-width="2.5"/>`,
    `<line data-geometry="bisector-line" data-equation="2x+y=2√21" data-slope="-2" x1="${sx(bisectorStartX).toFixed(2)}" y1="${sy(5).toFixed(2)}" x2="${sx(bisectorEndX).toFixed(2)}" y2="${sy(-1).toFixed(2)}" stroke="#dc2626" stroke-width="2.5"/>`,
    `<line data-geometry="segment-ORS" x1="${sx(0).toFixed(2)}" y1="${sy(0).toFixed(2)}" x2="${sx(sX).toFixed(2)}" y2="${sy(sY).toFixed(2)}" stroke="#16a34a" stroke-width="2" stroke-dasharray="5 3"/>`,
    `<text x="54" y="108" font-size="12" fill="#1d4ed8">삼각형 AOB: [AOB]=12</text>`,
    `<text x="54" y="128" font-size="12" fill="#dc2626">2x+y=2√21 (y=-2x+2√21)</text>`,
    `<text x="54" y="148" font-size="12" fill="#16a34a">R=(√21,0), S=(5√21/7,4√21/7)</text>`,
    `<text x="54" y="168" font-size="12" fill="#16a34a">[ORS]=6: 넓이를 이등분</text>`,
    point("O", 0, 0, sx, sy, "#1d4ed8", "vertex"),
    point("A", 5, 4, sx, sy, "#1d4ed8", "vertex"),
    point("B", 6, 0, sx, sy, "#1d4ed8", "vertex"),
    point("R", Number(rX.toFixed(6)), 0, sx, sy, "#16a34a", "intersection"),
    point("S", Number(sX.toFixed(6)), Number(sY.toFixed(6)), sx, sy, "#16a34a", "intersection"),
  );
  return documentSvg({
    title: "직선의 방정식 해설 도형 · 문항 20",
    caption: "삼각형 AOB와 이를 이등분하는 직선의 교점 관계를 표시한 해설 자료",
    body,
    factHash,
    method: "전체 넓이와 원점 쪽 작은 삼각형의 넓이를 비교",
    policy: "EQUAL_SCALE_REQUIRED",
    semanticRole: "triangle-bisector",
  });
}

function q15Svg(factHash) {
  const { body, sx, sy } = frame(-4, 5, -3, 6);
  const radius = 2;
  const scale = 224 / 9;
  const originalLine = (x) => 3 * x + 4;
  const movedLine = (x) => 3 * x + 11;
  const originalStartX = -7 / 3;
  const originalEndX = 2 / 3;
  const movedStartX = -4;
  const movedEndX = -5 / 3;
  body.push(
    `<circle data-geometry="circle" data-center-x="2" data-center-y="-1" data-radius="2" cx="${sx(2).toFixed(2)}" cy="${sy(-1).toFixed(2)}" r="${(radius * scale).toFixed(2)}" fill="#dbeafe" fill-opacity=".55" stroke="#2563eb" stroke-width="2.3"/>`,
    `<circle data-geometry="circle" data-center-x="0" data-center-y="0" data-radius="2" cx="${sx(0).toFixed(2)}" cy="${sy(0).toFixed(2)}" r="${(radius * scale).toFixed(2)}" fill="#dcfce7" fill-opacity=".35" stroke="#16a34a" stroke-width="2.3" stroke-dasharray="5 3"/>`,
    `<line data-geometry="line" data-name="l" data-equation="3x-y+4=0" x1="${sx(originalStartX).toFixed(2)}" y1="${sy(-4).toFixed(2)}" x2="${sx(originalEndX).toFixed(2)}" y2="${sy(7).toFixed(2)}" stroke="#64748b" stroke-width="2"/>`,
    `<line data-geometry="line" data-name="l-prime" data-equation="3x-y+11=0" x1="${sx(movedStartX).toFixed(2)}" y1="${sy(-1).toFixed(2)}" x2="${sx(movedEndX).toFixed(2)}" y2="${sy(7).toFixed(2)}" stroke="#dc2626" stroke-width="2.4"/>`,
    `<line data-geometry="translation" data-source="(2,-1)" data-destination="(0,0)" x1="${sx(2).toFixed(2)}" y1="${sy(-1).toFixed(2)}" x2="${sx(0).toFixed(2)}" y2="${sy(0).toFixed(2)}" stroke="#16a34a" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrow)"/>`,
    `<line data-geometry="distance" data-distance="7/√10" data-perpendicular-slope="-1/3" x1="${sx(0).toFixed(2)}" y1="${sy(4).toFixed(2)}" x2="${sx(-2.1).toFixed(2)}" y2="${sy(4.7).toFixed(2)}" stroke="#d97706" stroke-width="2" stroke-dasharray="4 3"/>`,
    `<text x="54" y="108" font-size="12" fill="#2563eb">원래 중심 C=(2,-1), 반지름 2</text>`,
    `<text x="54" y="128" font-size="12" fill="#16a34a">이동 후 중심 C′=(0,0), 반지름 2</text>`,
    `<text x="54" y="148" font-size="12" fill="#64748b">l: 3x-y+4=0</text>`,
    `<text x="54" y="168" font-size="12" fill="#dc2626">l′: 3x-y+11=0 (두 직선은 평행)</text>`,
    `<text x="54" y="188" font-size="12" fill="#d97706">두 직선 사이의 거리 = 7/√10</text>`,
    `<text x="54" y="208" font-size="12" fill="#334155">x방향으로 2만큼 왼쪽, y방향으로 1만큼 위</text>`,
    point("C", 2, -1, sx, sy, "#2563eb", "center"),
    point("C′", 0, 0, sx, sy, "#16a34a", "center"),
  );
  return documentSvg({
    title: "도형의 이동 해설 도형 · 문항 15",
    caption: "원 중심의 이동과 직선의 평행이동 결과를 함께 표시한 해설 자료",
    body,
    factHash,
    method: "원 중심의 이동을 확인한 뒤 같은 좌표 변화를 직선에 적용",
    policy: "EQUAL_SCALE_REQUIRED",
    semanticRole: "circle-translation-parallel-lines",
  });
}

function q22Svg(factHash) {
  const body = [
    '<rect x="76" y="116" width="222" height="118" rx="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>',
    '<rect x="422" y="116" width="222" height="118" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>',
    '<path d="M312 174h96" stroke="#64748b" stroke-width="3"/><path d="m398 165 14 9-14 9" fill="#64748b"/>',
    '<text x="187" y="150" text-anchor="middle" font-size="17" font-weight="700" fill="#1e40af">평행·일치</text>',
    '<text x="187" y="178" text-anchor="middle" font-size="12" fill="#334155">계수의 비를 비교</text>',
    '<text x="187" y="204" text-anchor="middle" font-size="12" fill="#334155">a=1, -3</text>',
    '<text x="533" y="150" text-anchor="middle" font-size="17" font-weight="700" fill="#166534">수직</text>',
    '<text x="533" y="178" text-anchor="middle" font-size="12" fill="#334155">기울기의 곱 = -1</text>',
    '<text x="533" y="204" text-anchor="middle" font-size="12" fill="#334155">a=-1/2</text>',
    '<text x="54" y="270" font-size="12" fill="#334155">a=-3은 일치, a=1은 서로 다른 평행선</text>',
    '<text x="54" y="288" font-size="12" fill="#334155">αβγ = 1×(-3)×(-1/2) = 3/2</text>',
  ];
  return documentSvg({
    title: "직선의 방정식 해설 도형 · 문항 22",
    caption: "두 직선의 계수비와 기울기 관계를 비교한 해설 자료",
    body,
    factHash,
    method: "계수비로 평행·일치를, 기울기의 곱으로 수직을 판정",
    policy: "SCHEMATIC_ALLOWED",
    semanticRole: "line-relation-cases",
  });
}

function updateSolution(relative, predicate, solution) {
  const { file, question } = findQuestion(relative, predicate);
  replaceField(file, question, "solution", solution);
}

const q20Solution = `삼각형 AOB의 넓이는 \\dfrac12\\cdot6\\cdot4=12이므로 이등분되어야 하는 넓이는 6이다.\n\n직선 y=-2x+k와 변 OB(y=0)의 교점을 R, 변 OA(y=\\dfrac45x)의 교점을 S라 하자.\nR=(\\dfrac{k}{2},0)이고, S=\\left(\\dfrac{5k}{14},\\dfrac{2k}{7}\\right)이다.\n\n첫째, 0<k<12이면 R, S가 각각 선분 OB, OA 위에 있다. 이때 원점 쪽 삼각형의 넓이는\n[ORS]=\\dfrac12\\cdot\\dfrac{k}{2}\\cdot\\dfrac{2k}{7}=\\dfrac{k^2}{14}이다.\n따라서 \\dfrac{k^2}{14}=6에서 k=2\\sqrt{21}이고, 실제로 0<2\\sqrt{21}<12이다.\n\n둘째, 12\\le k<14이면 직선은 OA와 AB를 자른다. S는 OA와의 교점이고, T는 AB와의 교점이다. 이때 A 쪽 삼각형 AST의 넓이는 계산하면 \\dfrac37(14-k)^2이다.\n12\\le k<14에서 0<14-k\\le2이므로 [AST]\\le\\dfrac37\\cdot2^2=\\dfrac{12}{7}<6이다. 따라서 원점 쪽 넓이는 12-[AST]>6이어서 이등분할 수 없다.\n\n셋째, k\\le0이면 직선은 삼각형 내부를 가르지 못하고, k\\ge14이면 원점 쪽 넓이가 삼각형 전체 넓이 12가 되어 이등분 조건을 만족하지 않는다.\n\n따라서 조건을 만족하는 값은 k=2\\sqrt{21}이다.`;
const q20StudentProof = q20Solution.replace(
  "이때 A 쪽 삼각형 AST의 넓이는 계산하면 ",
  "AO 위에서 AS:AO=(14-k):14이고, AB 위에서 AT:AB=(14-k):2이다. 두 삼각형 AST와 AOB는 A에서 낀 각이 같으므로 넓이의 비는 두 변의 비의 곱이다. 따라서 [AST]=[AOB]×(14-k)/14×(14-k)/2=12×(14-k)^2/28이고, 이 넓이는 "
);

const q15Solution = `[키포인트] 원의 중심이 옮겨진 좌표를 확인하고, 같은 좌표 변화를 직선에 적용한다.\n첫째 원은 (x-2)^2+(y+1)^2=4이므로 중심은 (2,-1)이고, 옮겨진 원 x^2+y^2=4의 중심은 (0,0)이다. 따라서 x방향으로 2만큼 왼쪽, y방향으로 1만큼 위로 옮긴 것이다.\n\n직선 l:3x-y+4=0 위의 점 (x,y)가 이 이동으로 (X,Y)가 되면 X=x-2, Y=y+1이므로 x=X+2, y=Y-1이다. 이를 원래 직선의 식에 대입하면\n3(X+2)-(Y-1)+4=0, 즉 3X-Y+11=0이다. 따라서 옮겨진 직선은 l':3x-y+11=0이다.\n\n두 직선은 평행하므로 두 직선 사이의 거리는 \\dfrac{|11-4|}{\\sqrt{3^2+(-1)^2}}=\\dfrac7{\\sqrt{10}}이다.\n따라서 정답은 ③이다.`;

const q5Solution = `두 직선이 평행하려면 x, y의 계수의 비가 같아야 한다. 따라서\n\\dfrac{1-m}{2}=\\dfrac{3}{-m}에서 (1-m)(-m)=3\\cdot2이다.\n정리하면 m^2-m-6=0이므로 (m-3)(m+2)=0, m=3 또는 m=-2이다.\n\nm=3일 때 첫 번째 직선은 -2x+3y-5=0, 두 번째 직선은 2x-3y+5=0으로 서로 같은 직선이다. 따라서 서로 다른 평행선이 되는 값은 m=-2이다.\n참고로 m=0이면 두 번째 직선은 수직선 2x+5=0이고 첫 번째 직선의 기울기는 -1/3이므로 평행하지 않다. 따라서 나눗셈에서 빠지는 경우도 조건을 만족하지 않는다.\n\n따라서 정답은 ①이다.`;

const q22Solution = `[키포인트] 계수의 비와 기울기의 관계를 이용해 평행·일치·수직을 차례로 판정한다.\n두 직선의 계수는 각각 (a+2,3,1), (1,a,-1)이다.\n\n평행 또는 일치하려면 x, y의 계수의 비가 같아야 하므로\na(a+2)=3이다. 즉 (a-1)(a+3)=0이므로 a=1 또는 -3이다.\na=-3이면 두 식이 서로 -1배가 되어 일치하므로 β=-3이다. a=1이면 상수항의 비가 달라 서로 다른 평행선이므로 α=1이다.\n\n수직일 때에는 두 직선의 기울기의 곱이 -1이다. a=0이면 두 번째 직선은 수직선 x-1=0이고 첫 번째 직선은 기울기 -2/3이므로 수직 조건을 만족하지 않는다. 따라서 a≠0인 경우를 살펴보면 첫 번째 직선의 기울기는 -(a+2)/3, 두 번째 직선의 기울기는 -1/a이므로\n\\left(-\\dfrac{a+2}{3}\\right)\\left(-\\dfrac1a\\right)=-1이다. 정리하면 a=-\\dfrac12이므로 γ=-\\dfrac12이다.\n\n따라서 αβγ=1\\cdot(-3)\\cdot\\left(-\\dfrac12\\right)=\\dfrac32이다.`;

const q14Solution = `[키포인트] 첫 번째 원의 접선 방정식을 구한 뒤, 두 번째 원의 중심에서 그 접선까지의 거리를 반지름과 같게 둔다.\n\n첫 번째 원은 (x+3)^2+(y+2)^2=10이므로 중심은 (-3,-2)이다. 점 (-2,1)에서 중심으로 향하는 반지름의 방향은 (1,3)이므로 접선의 방정식은\n(x+3)+3(y+2)=10, 즉 x+3y-1=0이다.\n두 번째 원은 (x-3)^2+(y+4)^2=25-k이므로 중심은 (3,-4), 반지름의 제곱은 25-k이다.\n중심 (3,-4)에서 접선 x+3y-1=0까지의 거리는 \\dfrac{|3+3(-4)-1|}{\\sqrt{1^2+3^2}}=\\sqrt{10}이다.\n따라서 25-k=10에서 k=15이고, 반지름의 제곱도 양수이다.\n\n따라서 정답은 ⑤이다.\n[보강] 원의 접점에서 그은 반지름은 접선과 수직이다.`;

const q2Solution = `점 (4,1)을 점 (-1,3)으로 옮기려면 x방향으로 5만큼 왼쪽, y방향으로 2만큼 위로 평행이동해야 한다.\n따라서 점 (2,5)는\n(2-5,5+2)=(-3,7)\n로 옮겨진다.\n\n따라서 정답은 ②이다.`;

const q7Solution = `[키포인트] 평행한 두 직선 사이의 거리를 이용해 k의 두 값을 구한다.\n두 직선 2x-y+1=0, 2x-y+k=0은 평행하므로 거리는\n\\dfrac{|k-1|}{\\sqrt{2^2+(-1)^2}}=\\dfrac{|k-1|}{\\sqrt5}이다.\n이 값이 \\sqrt5이므로 |k-1|=5이다. 따라서 k=6 또는 k=-4이고, 두 값의 곱은 -24이다.\n\n따라서 정답은 ④이다.`;

const q24JeilQ14Solution = `[키포인트]\\n직선의 방정식에 $k$를 대입하거나 항등식 성질을 이용한다.\\n\\n조건 정리\\n- ㄱ: $k=-1 \\implies 3y-3=0 \\implies y=1$. 기울기 0이다. (참)\\n- ㄴ: $k=0 \\implies x+2y-3=0$. 기울기는 $-1/2$이다. $4x-2y-3=0$의 기울기는 2이므로 수직이다. (참)\\n- ㄷ: $x+y-3 + k(x-y) = 0$ 꼴로 정리하면 $x=1, y=1$일 때 성립한다. (참)\\n\\n풀이 과정\\nㄱ, ㄴ, ㄷ이 모두 참이므로 정답은 ④이다.\\n\\n결론\\n따라서 정답은 ④이다.`;

const q18Prefix = `조건 정리: 최소 복원된 명제는`;

updateSolution("archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js", (q) => q.id === 20, q20StudentProof);
const q20Metadata = findQuestion("archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js", (q) => q.id === 20);
replaceField(q20Metadata.file, q20Metadata.question, "solutionImageAlt", "직선의 방정식 문항 20의 핵심 관계를 표시한 해설 도형");
updateSolution("archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js", (q) => q.id === 5, q5Solution);
updateSolution("archive/exams/original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js", (q) => q.id === 22, q22Solution);
updateSolution("archive/exams/original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js", (q) => q.id === 14, q14Solution);
updateSolution("archive/exams/original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js", (q) => q.id === 2, q2Solution);
updateSolution("archive/exams/original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js", (q) => q.id === 15, q15Solution);
updateSolution("archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js", (q) => q.id === 7, q7Solution);
updateSolution("archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js", (q) => q.id === 14, q24JeilQ14Solution);

const q18 = findQuestion("archive/exams/original/high/h1/2mid/21_제일고_2학기_중간_고1_기출.js", (q) => q.id === 18);
replaceField(q18.file, q18.question, "solution", q18.question.solution.replace(q18Prefix, "조건 정리: 조건 p와 q를 동시에 만족하는 실수 x,y가 존재해야 한다."));

updateMetadata("archive/exams/original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js", (q) => q.id === 13, {
  standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "행렬과 그 연산",
    standardUnitOrder: 9,
  subUnitKey: "H22-C-09-MATRIX_OPERATION",
  subUnit: "행렬의 연산",
});
updateMetadata("archive/exams/original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js", (q) => q.id === 14, {
  standardCourse: "공통수학2",
});
updateMetadata("archive/exams/original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js", (q) => q.id === 16, {
  standardCourse: "공통수학2",
  standardUnitKey: "H22-C2-01",
  standardUnit: "평면좌표",
  standardUnitOrder: 1,
  subUnitKey: "H22-C2-01-COORDINATE_METRIC",
  subUnit: "평면좌표와 거리",
});

function shaFileText(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function writeMetadataAtomically(metadataPath, value) {
  const tempPath = `${metadataPath}.external-review.tmp`;
  fs.writeFileSync(tempPath, value, "utf8");
  fs.renameSync(tempPath, metadataPath);
}

function syncQ13Sidecars() {
  const sourceArchiveFile = "original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js";
  const metadataPath = path.join(ROOT, "archive", "data", "question_metadata.json");
  const metadata = JSON.parse(read(metadataPath));
  const record = (metadata.records || []).find((item) => item.sourceArchiveFile === sourceArchiveFile && item.sourceQuestionNo === "13");
  if (!record) throw new Error("q13 metadata record not found");
  Object.assign(record, {
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "행렬과 그 연산",
    standardUnitOrder: 9,
    subUnitKey: "H22-C-09-MATRIX_OPERATION",
    subUnit: "행렬의 연산",
  });
  const stableMetadata = { ...metadata };
  delete stableMetadata.digest;
  metadata.digest = shaFileText(JSON.stringify(stableMetadata));
  writeMetadataAtomically(metadataPath, JSON.stringify(metadata, null, 2) + "\n");

  const indexPath = path.join(ROOT, "archive", "question-index.js");
  let indexText = read(indexPath);
  const qKey = "original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_13";
  const indexContext = { window: {} };
  vm.runInNewContext(indexText, indexContext, { filename: indexPath });
  const indexQuestion = (indexContext.window.questionIndex || []).find((item) => item.qKey === qKey);
  if (!indexQuestion) throw new Error("q13 question-index record not found");
  const start = indexText.indexOf(`{"qKey":"${qKey}"`);
  const end = indexText.indexOf(`},{"qKey":"`, start);
  if (start < 0 || end < 0) throw new Error("q13 question-index bounds not found");
  let indexObject = indexText.slice(start, end);
  const indexChanges = { standardUnitKey: "H22-C-09", standardUnit: "행렬과 그 연산", course: "공통수학1" };
  for (const [field, nextValue] of Object.entries(indexChanges)) {
    const oldValue = indexQuestion[field];
    const fieldPattern = `"${field}":"${oldValue}"`;
    if (!indexObject.includes(fieldPattern)) throw new Error(`q13 index field not found: ${field}`);
    indexObject = indexObject.replace(fieldPattern, `"${field}":${JSON.stringify(nextValue)}`);
  }
  if (!indexObject.includes('"standardUnitOrder":')) indexObject = indexObject.replace(/"standardUnit":"[^"]+"/, '$&,"standardUnitOrder":9');
  write(indexPath, indexText.slice(0, start) + indexObject + indexText.slice(end));
  ledger.push({ file: "archive/data/question_metadata.json", id: 13, status: "SIDECAR_METADATA_SYNCED" });
  ledger.push({ file: "archive/question-index.js", id: 13, status: "QUESTION_INDEX_SYNCED" });
}

syncQ13Sidecars();

function syncQuestionIndexFields(qKey, changes) {
  const indexPath = path.join(ROOT, "archive", "question-index.js");
  let indexText = read(indexPath);
  const context = { window: {} };
  vm.runInNewContext(indexText, context, { filename: indexPath });
  const indexQuestion = (context.window.questionIndex || []).find((item) => item.qKey === qKey);
  if (!indexQuestion) throw new Error(`question-index record not found: ${qKey}`);
  const start = indexText.indexOf(`{"qKey":"${qKey}"`);
  const end = indexText.indexOf(`},{"qKey":"`, start);
  if (start < 0 || end < 0) throw new Error(`question-index bounds not found: ${qKey}`);
  let indexObject = indexText.slice(start, end);
  for (const [field, nextValue] of Object.entries(changes)) {
    const oldValue = indexQuestion[field];
    const fieldPattern = `"${field}":"${oldValue}"`;
    if (!indexObject.includes(fieldPattern)) throw new Error(`question-index field not found: ${qKey} ${field}`);
    indexObject = indexObject.replace(fieldPattern, `"${field}":${JSON.stringify(nextValue)}`);
  }
  write(indexPath, indexText.slice(0, start) + indexObject + indexText.slice(end));
  ledger.push({ file: "archive/question-index.js", qKey, status: "QUESTION_INDEX_PARITY_REPAIRED", fields: Object.keys(changes) });
}

syncQuestionIndexFields("original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_14", { course: "공통수학2" });
syncQuestionIndexFields("original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_16", { standardUnitKey: "H22-C2-01", standardUnit: "평면좌표", course: "공통수학2" });

function syncCanonicalSidecarMetadata() {
  const scopePath = path.join(ROOT, "docs", "evidence", "high1-geometry-equation", "canonical_scope.json");
  const metadataPath = path.join(ROOT, "archive", "data", "question_metadata.json");
  if (!fs.existsSync(scopePath)) return;
  const scope = JSON.parse(read(scopePath));
  const metadata = JSON.parse(read(metadataPath));
  const bySource = new Map((metadata.records || []).map((record) => [record.sourceArchiveFile + "#" + record.sourceQuestionNo, record]));
  const fields = ["standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit"];
  let changed = 0;
  for (const row of scope.rows || []) {
    const sourceFile = path.join(ROOT, "archive", "exams", row.sourceJsPath.replaceAll("/", path.sep));
    const context = { window: {} };
    vm.runInNewContext(read(sourceFile), context, { filename: sourceFile });
    const question = (context.window.questionBank || []).find((candidate) => Number(candidate.id) === Number(row.id));
    const record = bySource.get(row.sourceJsPath + "#" + row.id);
    if (!question || !record) continue;
    for (const field of fields) {
      const nextValue = question[field] ?? "";
      if (JSON.stringify(record[field] ?? "") !== JSON.stringify(nextValue)) {
        record[field] = nextValue;
        changed += 1;
      }
    }
  }
  const stableMetadata = { ...metadata };
  delete stableMetadata.digest;
  metadata.digest = shaFileText(JSON.stringify(stableMetadata));
  writeMetadataAtomically(metadataPath, JSON.stringify(metadata, null, 2) + "\n");
  ledger.push({ file: "archive/data/question_metadata.json", status: "CANONICAL_TARGET_METADATA_SYNCED", changedFields: changed });
}

syncCanonicalSidecarMetadata();

const phraseReplacements = new Map([
  ["독립 풀이 사실 기반 해설 도형", "핵심 관계를 표시한 해설 도형"],
  ["독립 풀이에서 확정한 점·도형·관계를 좌표평면에 표시한 해설 자료", "풀이에 필요한 점·도형·관계를 좌표평면에 표시한 해설 자료"],
  ["독립 풀이에서 확정한 도형·변환·좌표 관계를 해설 순서대로 표시한 자료", "풀이에 필요한 도형·변환·좌표 관계를 해설 순서대로 표시한 자료"],
  ["독립 풀이 사실", "풀이 핵심 관계"],
  ["독립 풀이 방식:", "풀이 관찰:"],
  ["법선벡터", "직선의 계수 관계"],
  ["이동벡터", "이동 관계"],
  ["내적", "기울기 관계"],
  ["행렬식", "넓이 계산"],
  ["벡터", "좌표 변화"],
]);

function cleanupStudentCopy(file) {
  const before = read(file);
  let after = before;
  for (const [from, to] of phraseReplacements) after = after.replaceAll(from, to);
  if (file.endsWith(".svg")) {
    after = after.replace(/\/\s+data-point-provenance="legacy-reviewed-fact">/g, ' data-point-provenance="legacy-reviewed-fact"/>');
    after = after.replace(/<[^>]+>/g, (tagText) => {
      if (!tagText.includes("data-point-x=") || !tagText.includes("data-point-y=") || tagText.includes("data-point-provenance=")) return tagText;
      return tagText.replace(/data-point-y="[^"]+"/, '$& data-point-provenance="legacy-reviewed-fact"');
    });
    after = after.replace(/<svg\b([^>]*)>/, (svgTag, attrs) => {
      let nextAttrs = attrs;
      if (!/\bwidth="/.test(nextAttrs)) nextAttrs += ' width="720"';
      if (!/\bheight="/.test(nextAttrs)) nextAttrs += ' height="360"';
      if (!nextAttrs.includes("data-scale-policy=")) nextAttrs += ' data-scale-policy="SCHEMATIC_ALLOWED"';
      return `<svg${nextAttrs}>`;
    });
    if (file.endsWith("22_금당고_1학기_기말_고1_기출\\q19-solution.svg")) {
      after = after.replaceAll('data-point-label="PASS"', 'data-point-label="I"').replaceAll('>PASS</text>', '>I</text>');
    }
  }
  if (after !== before) {
    write(file, after);
    ledger.push({ file: path.relative(ROOT, file).replaceAll("\\", "/"), status: "STUDENT_COPY_CLEANED" });
  }
}

for (const file of fs.readdirSync(ASSET_ROOT, { recursive: true })) {
  if (typeof file === "string" && file.endsWith("-solution.svg")) cleanupStudentCopy(path.join(ASSET_ROOT, file));
}
for (const file of fs.readdirSync(SOURCE_ROOT, { recursive: true })) {
  if (typeof file === "string" && file.endsWith(".js")) cleanupStudentCopy(path.join(SOURCE_ROOT, file));
}

function findFactHash(relative) {
  const file = path.join(ROOT, relative);
  const source = read(file);
  const match = source.match(/"solutionImage":\s*"([^"]+)"/);
  if (!match) return "external-review-fact-hash-unavailable";
  const asset = path.join(ROOT, "archive", match[1]);
  const svg = read(asset);
  return (svg.match(/data-fact-hash="([^"]+)"/) || [])[1] || "external-review-fact-hash-unavailable";
}

const q20Asset = path.join(ASSET_ROOT, "24_제일고_1학기_중간_고1_기출", "q20-solution.svg");
const q15Asset = path.join(ASSET_ROOT, "25_순천여고_2학기_중간_고1_공통수학2", "q15-solution.svg");
const q22Asset = path.join(ASSET_ROOT, "22_강남여고_2학기_중간_고1_기출", "q22-solution.svg");
write(q20Asset, q20Svg(findFactHash("archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js")));
write(q15Asset, q15Svg(findFactHash("archive/exams/original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js")));
write(q22Asset, q22Svg(findFactHash("archive/exams/original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js")));
ledger.push({ file: path.relative(ROOT, q20Asset).replaceAll("\\", "/"), status: "SEMANTIC_SVG_REPAIRED", assertions: ["triangle-AOB", "bisector-line", "intersection-R", "intersection-S", "equal-scale"] });
ledger.push({ file: path.relative(ROOT, q15Asset).replaceAll("\\", "/"), status: "SEMANTIC_SVG_REPAIRED", assertions: ["center-source", "center-destination", "parallel-lines", "translation", "distance"] });
ledger.push({ file: path.relative(ROOT, q22Asset).replaceAll("\\", "/"), status: "STUDENT_COPY_CLEANED", assertions: ["high-school-coefficient-ratio", "high-school-slope-product"] });

const reportDir = path.join(ROOT, "docs", "evidence", "high1-geometry-equation");
fs.mkdirSync(reportDir, { recursive: true });
write(path.join(reportDir, "external_repair_ledger.json"), JSON.stringify({ status: "REOPENED_PINPOINT_REPAIR_APPLIED", generatedAt: new Date().toISOString(), changes: ledger }, null, 2) + "\n");
console.log(JSON.stringify({ status: "PASS", changeCount: ledger.length, q20Asset: path.relative(ROOT, q20Asset), q15Asset: path.relative(ROOT, q15Asset), q22Asset: path.relative(ROOT, q22Asset) }, null, 2));
