/* 현재 문항의 조건·목표를 유지하는 풀이. 탐구 모형은 t1~t7에 그대로 둡니다. */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { pt, add, sub, mul, mid, unit, dist, nt, cv, line, tick, ang, T, dot, segTag, fillPoly, fillSector, fillSeg, arcD, degOf, circle, angBetween, DEG } = G;
  const O = pt(0, 0), solvers = {};
  const n = nt, a = v => `${n(v)}^{\\circ}`, m = x => `$${x}$`;
  const sq = v => `${n(v)}^2`;
  const aux = (b, p, q, color = 'green') => line(b, p, q, color, 2.8, { dash: [6, 4] });
  const shade = (b, pts, color = 'green') => fillPoly(b, pts, color, 0.12);
  const angle = (b, V, A, B, label, color = 'green') => ang(b, V, A, B, { color, r: 23, label, size: 15 });
  const halfChord = (b, g, count = 1) => { tick(b, g.A, g.M, count); tick(b, g.M, g.B, count); b.right(g.M, O, g.B, { size: 12, color: 'green' }); };
  const labelPoint = (b, P, name) => { dot(b, P, 'green', 4); T(b, P, name, { dx: 13, dy: 15, color: 'green', size: 15 }); };
  const sameArc = (b, A, B, center = O) => {
    let aa = degOf(center, A), bb = degOf(center, B); while (bb < aa) bb += 360;
    if (bb - aa > 180) [aa, bb] = [bb, aa + 360];
    arcD(b, center, dist(center, A), aa, bb, 'amber', 5);
  };
  function lesson(target, value, unitText, condition, property, construction, calculation, draw, tex) {
    const result = tex || n(value), unit = unitText === '°' ? '^{\\circ}' : unitText ? `\\,\\mathrm{${unitText}}` : '';
    return {
      target, value, tex: result, display: unitText === '°' ? `${cv(value)}°` : result.replace(/\\sqrt\{([^}]+)\}/g, '√$1').replace(/\\pi/g, 'π'),
      steps: [condition, property, construction, calculation, `따라서 ${m(`${target}=${result}${unit}`)}이에요.`],
      draw
    };
  }
  const L = (target, value, lines, draw, tex) => lesson(target, value, 'cm', ...lines, draw, tex);
  const A = (target, value, lines, draw) => lesson(`\\angle ${target}`, value, '°', ...lines, draw);

  // ① 현: 각 변형에서 주어진 두 양으로 세 번째 양을 구합니다.
  solvers['c1-1'] = M => {
    const q = M.q, kind = q.kind, target = ['OM', 'AB', 'R'][kind], value = [q.om, 2 * q.am, q.R][kind], g = M.g;
    return L(target, value, [
      kind === 0 ? `주어진 값은 ${m(`OA=${q.R},\ AB=${2 * q.am}`)}이고, 구하는 값은 OM이에요.` : kind === 1 ? `주어진 값은 ${m(`OA=${q.R},\ OM=${q.om}`)}이고, 구하는 값은 현 AB의 길이예요.` : `주어진 값은 ${m(`AB=${2 * q.am},\ OM=${q.om}`)}이고, 구하는 값은 반지름 R이에요.`,
      '중심 O에서 현 AB에 내린 수선은 현을 이등분해요. △OAM과 △OBM은 RHS 합동이므로 AM=BM이에요.',
      kind === 1 ? `직각삼각형 OAM에서 ${m(`AM^2=OA^2-OM^2`)}를 사용해 반쪽 길이를 먼저 구해요.` : `현의 절반은 ${m(`AM=AB\\div2=${q.am}`)}이에요. OA가 빗변인 직각삼각형 OAM을 보세요.`,
      kind === 0 ? `${m(`OM^2=${sq(q.R)}-${sq(q.am)}=${q.om * q.om}`)}이고 길이는 양수예요.` : kind === 1 ? `${m(`AM^2=${sq(q.R)}-${sq(q.om)}=${q.am * q.am}`)}이므로 ${m(`AM=${q.am}`)}. 현 전체는 AM의 두 배예요.` : `${m(`R^2=${sq(q.am)}+${sq(q.om)}=${q.R * q.R}`)}이고 반지름은 양수예요.`
    ], (b, st) => { if (st >= 2) { aux(b, O, g.M); halfChord(b, g); } if (st >= 3) shade(b, [O, g.A, g.M]); });
  };
  solvers['c1-2'] = M => {
    const q = M.q, g = M.g, h = M.g2, kind = q.kind;
    return L(kind === 0 ? 'CD' : 'ON', kind === 0 ? 2 * q.a2 : q.d2, [
      `현 AB의 길이는 ${2 * q.a1}, 중심에서 AB까지의 거리는 ${q.d1}이에요. ${kind === 0 ? `다른 현까지의 거리 ON=${q.d2}에서 CD를 구해요.` : `다른 현 CD=${2 * q.a2}에서 ON을 구해요.`}`,
      '중심에서 현에 내린 수선은 현을 이등분해요. 두 직각삼각형의 빗변은 같은 원의 반지름이에요.',
      `${m(`AM=${q.a1}`)}이므로 ${m(`R^2=${sq(q.a1)}+${sq(q.d1)}=${q.R * q.R}`)}이에요. 이 반지름 제곱을 다른 현에도 사용해요.`,
      kind === 0 ? `${m(`CN^2=${q.R * q.R}-${sq(q.d2)}=${q.a2 * q.a2}`)}이므로 ${m(`CN=${q.a2}`)}. CD는 CN의 두 배예요.` : `${m(`CN=${q.a2},\ ON^2=${q.R * q.R}-${sq(q.a2)}=${q.d2 * q.d2}`)}이에요.`
    ], (b, st) => { if (st >= 2) { aux(b, O, g.M); aux(b, O, h.M); halfChord(b, g, 1); halfChord(b, h, 2); } if (st >= 3) { shade(b, [O, g.A, g.M], 'sky'); shade(b, [O, h.A, h.M], 'green'); } });
  };
  solvers['c1-3'] = M => {
    const q = M.q, g = M.g1, h = M.g2, k = q.kind, am = q.am;
    return L(['CD', 'ON', 'R'][k], [2 * am, q.om, q.R][k], [
      k === 0 ? `반지름은 ${q.R}, 두 현까지의 같은 거리는 ${q.om}이에요. 현 CD의 길이를 구해요.` : k === 1 ? `같은 길이의 두 현 AB, CD는 각각 ${2 * am}, 반지름은 ${q.R}이에요. 거리 ON을 구해요.` : `같은 두 거리 OM=ON=${q.om}, 현 CD=${2 * am}에서 반지름을 구해요.`,
      '한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같고, 길이가 같은 두 현은 중심으로부터의 거리가 같아요.',
      k === 0 ? 'ON을 그으면 △OCN은 직각삼각형이고 CN은 현 CD의 절반이에요.' : `수선을 내려 현을 이등분하면 ${m(`CN=${am}`)}이에요.`,
      k === 0 ? `${m(`CN^2=${sq(q.R)}-${sq(q.om)}=${am * am}`)}이므로 ${m(`CN=${am}`)}. CD는 그 두 배예요.` : k === 1 ? `${m(`ON^2=${sq(q.R)}-${sq(am)}=${q.om * q.om}`)}이에요.` : `${m(`R^2=${sq(am)}+${sq(q.om)}=${q.R * q.R}`)}이에요.`
    ], (b, st) => { if (st >= 2) { tick(b, O, g.M, 1); tick(b, O, h.M, 1); halfChord(b, g, 3); halfChord(b, h, 3); } if (st >= 3) shade(b, [O, h.A, h.M]); });
  };
  solvers['c1-4'] = M => {
    const q = M.q, k = q.kind, value = k === 2 ? q.om ** 2 : q.am ** 2;
    return lesson(k === 2 ? 'S_{\\text{작은 원}}' : 'S_{\\text{두 원 사이}}', value, 'cm^2',
      k === 0 ? `큰 반지름 ${q.R}, 작은 반지름 ${q.om}에서 두 원 사이의 넓이를 구해요.` : `현 AB=${2 * q.am}이고 작은 원에 접해요. ${k === 2 ? `큰 반지름은 ${q.R}이고 작은 원의 넓이를 구해요.` : '두 원 사이의 넓이를 구해요.'}`,
      '접점 M으로 향하는 작은 원의 반지름은 현 AB와 수직이에요. 따라서 M은 현 AB의 중점이에요.',
      `직각삼각형 OAM에서 ${m(`R^2-r^2=AM^2`)}이에요. ${k === 0 ? '두 원의 넓이 차는 π(R²−r²)이에요.' : `현의 절반 AM=${q.am}을 사용해요.`}`,
      k === 0 ? `${m(`S=\\pi(${sq(q.R)}-${sq(q.om)})`)}로 계산해요.` : k === 1 ? `${m(`S=\\pi AM^2=\\pi\\times${sq(q.am)}`)}로 계산해요.` : `${m(`r^2=${sq(q.R)}-${sq(q.am)}=${value}`)}이므로 작은 원의 넓이는 πr²이에요.`,
      (b, st) => { if (st >= 2) { aux(b, O, M.g.M); halfChord(b, M.g); } if (st >= 3) shade(b, [O, M.g.A, M.g.M]); }, `${n(value)}\\pi`);
  };
  function foldSolution(M, slide) {
    const q = M.q, R = M.R, h = R * Math.sqrt(3) / 2, A0 = pt(-h, R / 2), B0 = pt(h, R / 2), H = pt(0, R / 2), Op = pt(0, R);
    const k = q.kind, target = slide ? ['OM', 'AB', 'R'][k] : ['AB', 'R', 'OM', '\\angle AOB'][k];
    const value = slide ? [R / 2, Math.sqrt(3) * R, R][k] : [Math.sqrt(3) * R, R, R / 2, 120][k];
    const given = slide ? k === 0 ? `반지름 ${m(`R=${R}`)}` : m(`OM=${q.k}`) : k === 1 ? m(`AB=${n(Math.sqrt(3) * R)}`) : `반지름 ${m(`R=${R}`)}`;
    return lesson(target, value, target.startsWith('\\angle') ? '°' : 'cm',
      `현재 조건 ${given}에서 접힌 호가 중심 O를 지나요. ${m(target)}를 구해요.`,
      '접은 도형은 현 AB에 대해 대칭이에요. 접힌 원의 중심 O′을 표시하면 M은 OO′의 중점이에요.',
      '접힌 호가 O를 지나므로 O′O=R이에요. 따라서 OM=R÷2이고, △OAM에서 ∠AOM=60°, ∠OAM=30°예요.',
      target === 'OM' ? `${m(`OM=R\\div2=${R}\\div2`)}로 계산해요.` : target === 'R' ? slide ? `${m(`R=2OM=2\\times${q.k}`)}로 계산해요.` : `${m(`AB=\\sqrt{3}R`)}에 ${m(`AB=${n(Math.sqrt(3) * R)}`)}을 대입해 R을 구해요.` : target === 'AB' ? `${m(`AM^2=R^2-(R/2)^2=\\frac34R^2`)}이므로 ${m(`AB=2AM=\\sqrt{3}\\times${R}`)}이에요.` : 'OA=OB이고 OM은 꼭지각을 이등분하므로 ∠AOB=2×60°이에요.',
      (b, st) => { if (st >= 2) { aux(b, O, Op, 'violet'); aux(b, Op, A0, 'violet'); if (!slide) labelPoint(b, Op, 'O′'); tick(b, O, H, 2); tick(b, H, Op, 2); } if (st >= 3) { shade(b, [O, A0, H]); tick(b, A0, H, 1); tick(b, H, B0, 1); } });
  }
  solvers['c1-5'] = M => foldSolution(M, false);
  solvers['c1-6'] = M => foldSolution(M, true);
  solvers['c1-7'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return L(['R', 'AB', 'CM'][k], [q.R, 2 * q.am, q.h][k], [
      k === 0 ? `현 AB=${2 * q.am}, 아치 높이 CM=${q.h}에서 원래 원의 반지름을 구해요.` : k === 1 ? `반지름 R=${q.R}, 아치 높이 CM=${q.h}에서 현 AB를 구해요.` : `반지름 R=${q.R}, 현 AB=${2 * q.am}에서 작은 활꼴의 높이 CM을 구해요.`,
      '현의 중점 M을 지나는 수직이등분선 위에 중심 O가 있어요. O, M, C는 한 직선 위에 있어요.',
      k === 0 ? `${m(`AM=${q.am},\ OM=R-${q.h}`)}인 직각삼각형 OAM을 만들어요.` : k === 1 ? `${m(`OM=R-CM=${q.R}-${q.h}=${q.R - q.h}`)}이에요.` : `${m(`AM=AB\\div2=${q.am}`)}이에요. 먼저 OM을 구한 뒤 반지름에서 빼요.`,
      k === 0 ? `${m(`R^2=${sq(q.am)}+(R-${q.h})^2`)}을 정리하면 ${m(`${2 * q.h}R=${q.am ** 2 + q.h ** 2}`)}이에요.` : k === 1 ? `${m(`AM^2=${sq(q.R)}-${sq(q.R - q.h)}=${q.am ** 2}`)}이므로 현 AB는 AM의 두 배예요.` : `${m(`OM=\\sqrt{${sq(q.R)}-${sq(q.am)}}=${q.R - q.h}`)}이므로 ${m(`CM=${q.R}-${q.R - q.h}`)}이에요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.Oc, g.M); tick(b, g.A, g.M); tick(b, g.M, g.B); } if (st >= 3) shade(b, [g.Oc, g.A, g.M]); });
  };

  // ② 접선: 접점의 직각, 같은 점에서의 두 접선, 정확한 대응을 순서대로 표시합니다.
  solvers['c2-1'] = M => {
    const q = M.q, k = q.kind, T0 = pt(0, q.R), P0 = pt(q.L, q.R);
    return L(['OP', 'PT', 'R'][k], [q.OP, q.L, q.R][k], [
      k === 0 ? `반지름 OT=${q.R}, 접선 PT=${q.L}에서 OP를 구해요.` : k === 1 ? `반지름 OT=${q.R}, OP=${q.OP}에서 접선 PT를 구해요.` : `접선 PT=${q.L}, OP=${q.OP}에서 반지름을 구해요.`,
      '접점 T로 향하는 반지름 OT는 접선 PT와 수직이에요. ∠OTP=90°를 표시해요.',
      '△OTP의 빗변은 OP예요. 피타고라스 정리 OP²=OT²+PT²를 사용해요.',
      k === 0 ? `${m(`OP^2=${sq(q.R)}+${sq(q.L)}=${q.OP ** 2}`)}이에요.` : k === 1 ? `${m(`PT^2=${sq(q.OP)}-${sq(q.R)}=${q.L ** 2}`)}이에요.` : `${m(`R^2=${sq(q.OP)}-${sq(q.L)}=${q.R ** 2}`)}이에요.`
    ], (b, st) => { if (st >= 2) { aux(b, O, T0); b.right(T0, O, P0, { size: 14, color: 'green' }); } if (st >= 3) shade(b, [O, T0, P0]); });
  };
  solvers['c2-2'] = M => {
    const q = M.q, g = M.g, k = q.kind, theta = M.P2;
    const targets = ['AOB', 'APB', 'PAB', 'AOB', 'OAB'], values = [180 - q.th, 180 - q.th, (180 - q.th) / 2, 2 * q.th, q.th / 2];
    const givens = [`APB`, `AOB`, `APB`, `PAB`, `APB`];
    return A(targets[k], values[k], [
      `PA, PB는 원의 접선이고 ${m(`\\angle ${givens[k]}=${a(q.th)}`)}이에요. ${m(`\\angle ${targets[k]}`)}를 구해요.`,
      '반지름 OA, OB는 각각 접선 PA, PB와 수직이에요. 사각형 OAPB의 두 각이 직각이므로 ∠AOB+∠APB=180°예요.',
      k >= 2 ? '같은 점 P에서 그은 접선 PA=PB이므로 △PAB는 이등변삼각형이에요. OA=OB인 △OAB도 이등변삼각형이에요.' : '직각 두 개를 제외한 나머지 두 각의 합이 180°인 부분을 확인해요.',
      k <= 1 ? `${m(`\\angle ${targets[k]}=180^{\\circ}-${a(q.th)}`)}로 구해요.` : k === 2 ? `${m(`\\angle PAB=(180^{\\circ}-${a(q.th)})\\div2`)}예요.` : k === 3 ? `${m(`\\angle APB=180^{\\circ}-2\\times${a(q.th)}`)}이므로 중심각은 그 보각이에요.` : `${m(`\\angle AOB=180^{\\circ}-${a(q.th)}`)}이므로 ${m(`\\angle OAB=\\{180^{\\circ}-(180^{\\circ}-${a(q.th)})\\}\\div2`)}예요.`
    ], (b, st) => { if (st >= 2) { b.right(g.A, O, g.P, { size: 13, color: 'green' }); b.right(g.B, O, g.P, { size: 13, color: 'green' }); } if (st >= 3) { tick(b, g.P, g.A); tick(b, g.P, g.B); shade(b, k >= 3 ? [O, g.A, g.B] : [g.P, g.A, g.B]); } void theta; });
  };
  solvers['c2-3'] = M => {
    const q = M.q, g = M.g, k = q.kind, per = 2 * q.a, cd = per - q.c - q.d;
    return L(k === 0 ? 'P_{\\triangle PCD}' : 'PA', k === 0 ? per : q.a, [
      k === 0 ? `PA=${q.a}에서 삼각형 PCD의 둘레를 구해요.` : k === 1 ? `삼각형 PCD의 둘레가 ${per}일 때 PA를 구해요.` : `PC=${q.c}, PD=${q.d}, CD=${cd}에서 PA를 구해요.`,
      '같은 점에서 그은 접선 길이는 같아요. PA=PB, CA=CE, DB=DE를 같은 눈금으로 표시해요.',
      '둘레 PC+CD+DP=PC+(CE+ED)+DP=(PC+CA)+(PD+DB)=PA+PB=2PA예요.',
      k === 0 ? `${m(`P_{\\triangle PCD}=2\\times${q.a}`)}로 계산해요.` : k === 1 ? `${m(`2PA=${per}`)}이므로 둘레를 2로 나눠요.` : `${m(`2PA=${q.c}+${q.d}+${cd}=${per}`)}이에요.`
    ], (b, st) => { if (st >= 2) { tick(b, g.C, g.A, 1); tick(b, g.C, g.E, 1); tick(b, g.Dd, g.B, 2); tick(b, g.Dd, g.E, 2); } if (st >= 3) shade(b, [g.P, g.C, g.Dd]); });
  };
  solvers['c2-4'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return L(['EC', 'DE', 'P_{\\triangle CDE}'][k], [q.u, q.de, 2 * q.W][k], [
      `직사각형의 AB=${q.H}, BC=${q.W}이고 DE는 원에 접해요. ${['EC', 'DE', '△CDE의 둘레'][k]}를 구해요.`,
      '반지름 r=AB÷2예요. 같은 점에서 그은 접선을 이용하면 DT=DP=BC−r, ET=EV=BC−EC−r이에요.',
      `EC를 u라 두면 ${m(`DE=2\\times${q.W}-${q.H}-u=${2 * q.W - q.H}-u`)}이고 △DCE는 직각삼각형이에요.`,
      k === 2 ? `${m(`EC+DE+CD=u+(2\\times${q.W}-${q.H}-u)+${q.H}=2\\times${q.W}`)}이에요.` : `${m(`${sq(q.H)}+u^2=(${2 * q.W - q.H}-u)^2`)}을 풀면 ${m(`u=${q.u}`)}. ${k === 0 ? 'EC가 바로 u예요.' : `${m(`DE=${2 * q.W - q.H}-${q.u}`)}로 구해요.`}`
    ], (b, st) => { if (st >= 2) { tick(b, g.D, g.T, 1); tick(b, g.D, g.Pt, 1); tick(b, g.E, g.T, 2); tick(b, g.E, g.V, 2); } if (st >= 3) shade(b, [g.D, g.Cc, g.E]); });
  };
  solvers['c2-5'] = M => {
    const q = M.q, g = M.g, k = q.kind, h = add(g.O1, mul(unit(sub(g.A, g.O1)), q.r1 - q.r2)), length = 2 * Math.sqrt(q.r1 * q.r2);
    const equal = q.r1 === q.r2;
    return L(['AB', 'r_2', 'MP'][k], [length, q.r2, length / 2][k], [
      k === 1 ? `왼쪽 원의 반지름 ${m(`r_1=${q.r1}`)}, 공통접선 ${m(`AB=${n(length)}`)}에서 오른쪽 원의 반지름을 구해요.` : `외접하는 두 원의 반지름은 ${q.r1}, ${q.r2}이에요. ${k === 2 ? '두 공통접선의 교점 M에서 MP를 구해요.' : '공통접선 AB를 구해요.'}`,
      equal ? '두 반지름은 접선에 수직이고 길이가 같아요. 사각형 OABO′은 직사각형이므로 마주 보는 변 AB와 OO′이 같아요.' : `접선에 수직인 두 반지름은 평행해요. 오른쪽 원의 중심 O′에서 직선 OA에 수선을 그어 H를 만들어요. H는 ${q.r1 > q.r2 ? '선분 OA 위' : 'OA를 O 쪽으로 연장한 부분'}에 있어요.`,
      equal ? `직사각형에서 ${m(`AB=OO^{\\prime}=r_1+r_2=2r_1`)}이에요. 따라서 이 경우에도 ${m('AB^2=4r_1r_2')}가 성립해요.` : `직각삼각형 OHO′에서 ${m('OO^{\\prime}=r_1+r_2,\\ OH=\\lvert r_1-r_2\\rvert,\\ HO^{\\prime}=AB')}이므로 ${m('AB^2=(r_1+r_2)^2-(r_1-r_2)^2=4r_1r_2')}예요.`,
      k === 1 ? `${m(`${sq(length)}=4\\times${q.r1}\\times r_2`)}를 풀어요.` : k === 0 ? `${m(`AB^2=4\\times${q.r1}\\times${q.r2}=${length ** 2}`)}이에요.` : `같은 점 M에서 그은 접선은 ${m(`MA=MP=MB`)}이므로 ${m(`MP=AB/2=\\sqrt{${q.r1}\\times${q.r2}}`)}이에요.`
    ], (b, st) => {
      if (st >= 2) {
        if (equal) { aux(b, g.O1, g.O2); b.right(g.O1, g.A, g.O2, { size: 12, color: 'green' }); }
        else { aux(b, g.O2, h); if (q.r1 < q.r2) aux(b, g.O1, h); labelPoint(b, h, 'H'); b.right(h, g.O1, g.O2, { size: 12, color: 'green' }); }
      }
      if (st >= 3) shade(b, equal ? [g.O1, g.A, g.B, g.O2] : [g.O1, h, g.O2]);
      if (st >= 3 && k === 2) { tick(b, g.M, g.A); tick(b, g.M, g.P); tick(b, g.M, g.B); }
    });
  };
  solvers['c2-6'] = M => {
    const q = M.q, g = M.g, pa = q.pbFull * q.r / q.R, k = q.kind;
    return L(['PA', 'PB', 'AB'][k], [pa, q.pbFull, q.pbFull - pa][k], [
      `반지름 ${q.R}, ${q.r}인 두 원이 P에서 내접해요. ${k === 1 ? `PA=${n(pa)}` : `PB=${q.pbFull}`}에서 ${['PA', 'PB', 'AB'][k]}를 구해요.`,
      '△OPB와 △O′PA는 각각 이등변삼각형이고 P의 각이 같으므로 닮아요(AA).',
      `${m(`PA:PB=r:R=${q.r}:${q.R}`)}이에요. 작은 원의 길이 PA와 큰 원의 길이 PB의 대응을 확인해요.`,
      k === 0 ? `${m(`PA=${q.pbFull}\\times\\frac{${q.r}}{${q.R}}`)}이에요.` : k === 1 ? `${m(`PB=${n(pa)}\\times\\frac{${q.R}}{${q.r}}`)}이에요.` : `${m(`PA=${q.pbFull}\\times\\frac{${q.r}}{${q.R}}=${n(pa)}`)}을 구한 뒤 ${m(`AB=PB-PA=${q.pbFull}-${n(pa)}`)}예요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.O, g.B); aux(b, g.Op, g.A); } if (st >= 3) { shade(b, [g.O, g.P, g.B], 'sky'); shade(b, [g.Op, g.P, g.A], 'green'); } });
  };
  solvers['c2-7'] = M => {
    const q = M.q, g = M.g, ext = q.mode === 'ext', dh = ext ? Math.abs(q.r1 - q.r2) : q.r1 + q.r2;
    const H = add(g.O1, mul(unit(sub(g.A, g.O1)), ext ? q.r1 - q.r2 : q.r1 + q.r2));
    return L(q.kind < 2 ? 'AB' : 'OO^{\\prime}', q.kind < 2 ? q.len : q.d, [
      `두 반지름은 ${q.r1}, ${q.r2}이고 ${ext ? '공통외접선' : '공통내접선'}이에요. ${q.kind < 2 ? `중심 거리 ${q.d}에서 AB를 구해요.` : `접선 길이 AB=${q.len}에서 중심 거리를 구해요.`}`,
      `두 반지름이 접선과 수직이므로 평행해요. O′에서 OA${ext ? '' : '의 연장선'}에 수선을 내려 H를 만들어요.`,
      `${m(`OH=${ext ? '\\lvert r_1-r_2\\rvert' : 'r_1+r_2'}=${dh},\ HO^{\\prime}=AB`)}인 직각삼각형 OHO′을 보세요. 빗변은 OO′예요.`,
      q.kind < 2 ? `${m(`AB^2=${sq(q.d)}-${sq(dh)}=${q.len ** 2}`)}이에요.` : `${m(`OO^{\\prime 2}=${sq(q.len)}+${sq(dh)}=${q.d ** 2}`)}이에요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.O2, H); labelPoint(b, H, 'H'); b.right(H, g.O1, g.O2, { size: 12, color: 'green' }); } if (st >= 3) shade(b, [g.O1, H, g.O2]); });
  };

  // ③ 내접원·외접사각형
  const triTangents = (b, g) => [[g.A, g.D, g.F, 1], [g.B, g.D, g.E, 2], [g.C, g.E, g.F, 3]].forEach(([V, X, Y, k]) => { tick(b, V, X, k); tick(b, V, Y, k); });
  solvers['c3-1'] = M => {
    const q = M.q, g = M.g, k = q.kind, per = 2 * (q.x + q.y + q.z);
    return L(k === 2 ? 'P_{\\triangle ABC}' : 'AD', k === 2 ? per : q.x, [
      k === 0 ? `AB=${g.c}, BC=${g.a}, CA=${g.b}에서 AD를 구해요.` : k === 1 ? `BC=${g.a}, CA=${g.b}, BD=${q.y}에서 AD를 구해요.` : `AD=${q.x}, BE=${q.y}, CF=${q.z}에서 삼각형의 둘레를 구해요.`,
      '같은 꼭짓점에서 그은 두 접선은 같아요. AD=AF, BD=BE, CE=CF를 각각 같은 눈금으로 표시해요.',
      k === 1 ? `${m(`BE=BD=${q.y}`)}이므로 ${m(`CE=BC-BE=${g.a}-${q.y}=${q.z}`)}이에요.` : 'AB=AD+BD, BC=BE+CE, CA=CF+AF로 각 변을 접선 두 개로 나눠요.',
      k === 0 ? `${m(`AB+CA-BC=2AD`)}이므로 ${m(`AD=(${g.c}+${g.b}-${g.a})\\div2`)}예요.` : k === 1 ? `${m(`CF=CE=${q.z}`)}이고 ${m(`AD=AF=CA-CF=${g.b}-${q.z}`)}예요.` : `${m(`P_{\\triangle ABC}=2(AD+BE+CF)=2(${q.x}+${q.y}+${q.z})`)}예요.`
    ], (b, st) => { if (st >= 2) triTangents(b, g); if (st >= 3) { aux(b, g.I, g.D); aux(b, g.I, g.E); aux(b, g.I, g.F); } });
  };
  solvers['c3-2'] = M => {
    const q = M.q, g = M.g, k = q.kind, r = (q.p + q.q - q.h) / 2;
    return L(k === 2 ? 'AC' : 'r', k === 2 ? q.h : r, [
      k === 0 ? `직각을 낀 두 변 AB=${q.p}, BC=${q.q}에서 내접원의 반지름 r을 구해요.` : k === 1 ? `AB=${q.p}, 빗변 AC=${q.h}에서 내접원의 반지름 r을 구해요.` : `AB=${q.p}, 내접원 반지름 r=${n(r)}에서 빗변 AC를 구해요.`,
      '반지름 OD, OE는 두 직각변에 수직이에요. □BDOE는 정사각형이므로 BD=BE=r이에요.',
      '같은 접선의 길이로 AF=AB−r, CF=BC−r이므로 AC=AB+BC−2r이에요.',
      k === 0 ? `${m(`AC=\\sqrt{${sq(q.p)}+${sq(q.q)}}=${q.h}`)}를 먼저 구하고 ${m(`r=(${q.p}+${q.q}-${q.h})\\div2`)}예요.` : k === 1 ? `${m(`BC=\\sqrt{${sq(q.h)}-${sq(q.p)}}=${q.q}`)}를 먼저 구하고 ${m(`r=(${q.p}+${q.q}-${q.h})\\div2`)}예요.` : `${m(`AC=BC+${n(q.p - 2 * r)}`)}를 ${m(`AC^2=${sq(q.p)}+BC^2`)}에 대입하면 ${m(`BC=${q.q}`)}. 이를 AC 식에 대입해요.`
    ], (b, st) => { if (st >= 2) { shade(b, [g.B, g.D, g.I, g.E]); tick(b, g.B, g.D); tick(b, g.B, g.E); } if (st >= 3) { tick(b, g.A, g.D, 2); tick(b, g.A, g.F, 2); tick(b, g.C, g.E, 3); tick(b, g.C, g.F, 3); } });
  };
  solvers['c3-3'] = M => {
    const q = M.q, g = M.g, per = q.a + q.b + q.c, area = per * q.r / 2, wantArea = q.kind === 1;
    return lesson(wantArea ? 'S' : 'r', wantArea ? area : q.r, '',
      `세 변은 ${q.a}, ${q.b}, ${q.c}이에요. ${wantArea ? `반지름 r=${q.r}에서 넓이를 구해요.` : `넓이 S=${area}에서 내접원의 반지름을 구해요.`}`,
      '중심 O에서 접점에 그은 반지름은 각 변과 수직이에요. 세 작은 삼각형의 높이는 모두 r이에요.',
      `O와 세 꼭짓점을 이어 △OBC, △OCA, △OAB로 나눠요. ${m(`S=\\frac12r(a+b+c)`)}이고 둘레는 ${per}이에요.`,
      wantArea ? `${m(`S=\\frac12\\times${q.r}\\times${per}`)}로 계산해요.` : `${m(`${area}=\\frac12r\\times${per}`)}이므로 ${m(`r=\\frac{2\\times${area}}{${per}}`)}예요.`,
      (b, st) => { if (st >= 2) [g.D, g.E, g.F].forEach(P => aux(b, g.I, P)); if (st >= 3) { [g.A, g.B, g.C].forEach(P => aux(b, g.I, P)); shade(b, [g.I, g.B, g.C], 'sky'); shade(b, [g.I, g.C, g.A], 'green'); shade(b, [g.I, g.A, g.B], 'amber'); } });
  };
  solvers['c3-4'] = M => {
    const q = M.q, g = M.g, target = ['DA', 'BC', 'CD'][q.kind], e = { AB: q.a + q.b, BC: 2 * q.b, CD: q.a + q.b, DA: 2 * q.a };
    const calc = q.kind === 0 ? `DA=${e.AB}+${e.CD}-${e.BC}` : q.kind === 1 ? `BC=${e.AB}+${e.CD}-${e.DA}` : `CD=${e.BC}+${e.DA}-${e.AB}`;
    return L(target, e[target], [
      `원이 네 변에 접해요. ${Object.entries(e).filter(([name]) => name !== target).map(([name, v]) => `${name}=${v}`).join(', ')}에서 ${target}를 구해요.`,
      '같은 꼭짓점에서 원에 그은 두 접선의 길이는 같아요. 꼭짓점마다 서로 다른 눈금으로 표시해요.',
      '네 꼭짓점의 접선 길이를 한 번씩 더하면 AB+CD와 BC+DA가 모두 같은 합이 돼요.',
      `${m('AB+CD=BC+DA')}에 주어진 길이를 대입하면 ${m(calc)}이에요.`
    ], (b, st) => { if (st >= 2) [[g.A, 0, 1], [g.B, 1, 2], [g.C, 2, 3], [g.D, 3, 0]].forEach(([V, i, j], k) => { tick(b, V, g.T[i], k + 1); tick(b, V, g.T[j], k + 1); }); if (st >= 3) { line(b, g.A, g.B, 'sky', 4); line(b, g.C, g.D, 'sky', 4); line(b, g.B, g.C, 'green', 4); line(b, g.D, g.A, 'green', 4); } });
  };
  solvers['c3-5'] = M => {
    const q = M.q, g = M.g, h = 2 * q.a * q.b / (q.a + q.b), H = pt(g.D.x, g.B.y), target = ['AB', 'CD', 'r'][q.kind];
    return L(target, [h, q.a + q.b - h, h / 2][q.kind], [
      `원의 네 접선이 만드는 직각사다리꼴에서 AD=${q.a}, BC=${q.b}이에요. ${target}를 구해요.`,
      '원의 지름은 AB=2r이에요. 외접사각형의 성질 AB+CD=AD+BC도 사용해요.',
      `AB를 h라 두면 ${m(`CD=${q.a + q.b}-h`)}예요. D에서 BC 또는 그 연장선에 수선을 그으면 밑변 차는 ${Math.abs(q.b - q.a)}이에요.`,
      `${m(`(${q.a + q.b}-h)^2=${sq(Math.abs(q.b - q.a))}+h^2`)}을 풀면 ${m(`h=\\frac{2\\times${q.a}\\times${q.b}}{${q.a + q.b}}=${n(h)}`)}. ${q.kind === 0 ? 'AB가 h예요.' : q.kind === 1 ? `CD=${q.a + q.b}−h로 구해요.` : '반지름은 h의 절반이에요.'}`
    ], (b, st) => { if (st >= 2) { aux(b, g.O, g.tp); aux(b, g.O, g.tb); } if (st >= 3) { aux(b, g.D, H); if (Math.abs(q.a - q.b) > 1e-9) { aux(b, g.C, H); labelPoint(b, H, 'H'); b.right(H, g.D, g.C, { size: 12, color: 'green' }); shade(b, [g.D, H, g.C]); } } });
  };
  solvers['c3-6'] = M => {
    const q = M.q, g = M.g, k = q.kind, H = pt(g.C.x, g.D.y);
    return L(['AB', 'CD', 'AD'][k], [q.ab, q.a + q.b, q.a][k], [
      k === 2 ? `지름 AB=${q.ab}, 접선 BC=${q.b}에서 AD를 구해요.` : `접선 AD=${q.a}, BC=${q.b}에서 ${k === 0 ? '지름 AB' : '접선 CD'}를 구해요.`,
      '같은 점에서 그은 접선 DE=DA, CE=CB이므로 CD=AD+BC예요.',
      k === 1 ? '접점 E가 CD를 두 접선 길이로 나누는 것을 확인해요.' : 'D에서 직선 BC에 수선 DH를 그으면 DH=AB, HC=|BC−AD|인 직각삼각형이 생겨요.',
      k === 1 ? `${m(`CD=DE+EC=${q.a}+${q.b}`)}이에요.` : k === 0 ? `${m(`AB^2=(${q.a}+${q.b})^2-(${q.b}-${q.a})^2=4\\times${q.a}\\times${q.b}`)}이에요.` : `${m(`AB^2=4AD\\cdot BC`)}에 대입하면 ${m(`AD=\\frac{${sq(q.ab)}}{4\\times${q.b}}`)}이에요.`
    ], (b, st) => { if (st >= 2) { tick(b, g.D, g.A); tick(b, g.D, g.E); tick(b, g.C, g.B, 2); tick(b, g.C, g.E, 2); } if (st >= 3 && k !== 1) { aux(b, g.D, H); if (q.a !== q.b) { aux(b, g.C, H); labelPoint(b, H, 'H'); b.right(H, g.D, g.C, { size: 12, color: 'green' }); shade(b, [g.D, H, g.C]); } } });
  };

  // ④ 원주각
  solvers['c4-1'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return A(['APB', 'AOB', 'OAB'][k], [q.th / 2, q.th, 90 - q.th / 2][k], [
      k === 0 ? `중심각 ∠AOB=${q.th}°에서 원주각 ∠APB를 구해요.` : `원주각 ∠APB=${q.th / 2}°에서 ${k === 1 ? '중심각 ∠AOB' : '이등변삼각형의 밑각 ∠OAB'}를 구해요.`,
      '한 호 AB에 대한 중심각은 원주각의 두 배예요. 중심의 위치와 관계없이 같은 호를 보는지 먼저 확인해요.',
      k === 2 ? 'OA=OB이므로 △OAB의 두 밑각은 같아요. 중심각을 구한 뒤 남은 두 각을 똑같이 나눠요.' : '지름 PQ를 그으면 반지름으로 만든 이등변삼각형의 외각을 이용해 두 배 관계를 확인할 수 있어요.',
      k === 0 ? `${m(`\\angle APB=${a(q.th)}\\div2`)}예요.` : k === 1 ? `${m(`\\angle AOB=2\\times${a(q.th / 2)}`)}예요.` : `${m(`\\angle AOB=2\\times${a(q.th / 2)}=${a(q.th)}`)}이므로 ${m(`\\angle OAB=(180^{\\circ}-${a(q.th)})\\div2`)}예요.`
    ], (b, st) => { if (st >= 2) sameArc(b, g.A, g.B); if (st >= 3) { if (k === 2) { tick(b, O, g.A); tick(b, O, g.B); shade(b, [O, g.A, g.B]); } else { aux(b, g.P, g.Q); if (dist(g.Q, g.A) > .1 && dist(g.Q, g.B) > .1) labelPoint(b, g.Q, 'Q'); } } });
  };
  solvers['c4-2'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return A(k === 0 ? 'AQB' : k === 1 ? 'ARB' : 'APB', k === 1 ? 180 - q.th / 2 : q.th / 2, [
      k === 2 ? `중심각 ∠AOB=${q.th}°이고 P, Q는 현 AB의 같은 쪽에 있어요.` : `원주각 ∠APB=${q.th / 2}°이고 ${k === 0 ? 'P, Q는 현 AB의 같은 쪽' : 'P, R은 현 AB의 서로 반대쪽'}에 있어요.`,
      k === 1 ? '반대쪽 호 위의 P와 R이 보는 두 호의 크기는 합이 360°이므로 두 원주각의 합은 180°예요.' : '같은 호를 보는 원주각의 크기는 모두 같고, 중심각의 절반이에요.',
      k === 1 ? 'P가 보는 작은 호 AB와 R이 보는 큰 호 AB를 구분해요. 현 AB를 기준으로 점의 위치를 확인해요.' : 'P와 Q에서 A, B로 향하는 두 쌍의 선분이 같은 호 AB를 보는 것을 확인해요.',
      k === 0 ? `${m(`\\angle AQB=\\angle APB=${a(q.th / 2)}`)}예요.` : k === 1 ? `${m(`\\angle ARB=180^{\\circ}-${a(q.th / 2)}`)}예요.` : `${m(`\\angle APB=${a(q.th)}\\div2`)}예요.`
    ], (b, st) => { if (st >= 2) { sameArc(b, g.A, g.B); line(b, g.A, g.B, 'green', 3); } if (st >= 3) { shade(b, [g.P, g.A, g.B], 'sky'); shade(b, [k === 1 ? g.Rr : g.Q, g.A, g.B], 'green'); } });
  };
  solvers['c4-3'] = M => {
    const q = M.q, g = M.g, k = q.kind, kt = q.k * q.th, sum = (1 + q.k) * q.th;
    return A(['APD', 'CAD', 'APB'][k], [180 - sum, kt, sum][k], [
      k === 2 ? `∠ADB=${q.th}°, ∠CBD=${kt}°에서 교점 P의 ∠APB를 구해요.` : `호 CD는 호 AB의 ${q.k}배이고 ∠ADB=${q.th}°예요. ${k === 0 ? '∠APD' : '∠CAD'}를 구해요.`,
      '같은 원에서 호의 길이에 비례해 원주각의 크기도 변해요. 호의 비를 현 길이의 비로 바꾸지 않아요.',
      k === 2 ? `같은 호 CD를 보는 ${m(`\\angle CAD=\\angle CBD=${a(kt)}`)}이에요.` : `${m(`\\angle CAD=${q.k}\\times${a(q.th)}=${a(kt)}`)}이에요.`,
      k === 1 ? `∠CAD는 호 CD를 보는 원주각이므로 앞에서 얻은 ${kt}°가 구하는 각이에요.` : `${m(`\\angle APB=\\angle ADB+\\angle CAD=${a(q.th)}+${a(kt)}=${a(sum)}`)}${k === 0 ? `이고 ∠APD는 그 보각이므로 180°−${sum}°예요.` : '예요.'}`
    ], (b, st) => { if (st >= 2) { sameArc(b, g.A, g.B); sameArc(b, g.C, g.D); } if (st >= 3) { aux(b, g.A, g.D); shade(b, [g.A, g.P, g.D]); } });
  };
  solvers['c4-4'] = M => {
    const q = M.q, g = M.g, k = q.kind, lines = [
      k === 1 ? `지름 AB=${q.d}, AP=${q.a}에서 PB를 구해요.` : `지름 AB 위의 반원에서 ∠PAB=${q.th}°이에요. ${k === 0 ? '∠PBA' : '∠POB'}를 구해요.`,
      '지름 AB가 만드는 중심각은 180°이므로 반원에 대한 원주각 ∠APB는 90°예요.',
      k === 1 ? '△APB의 빗변은 지름 AB이고, AP와 PB는 직각을 낀 두 변이에요.' : k === 0 ? '△APB의 두 예각 ∠PAB와 ∠PBA의 합은 90°예요.' : '중심각 ∠POB와 원주각 ∠PAB는 같은 호 PB를 보아요.',
      k === 1 ? `${m(`PB^2=${sq(q.d)}-${sq(q.a)}=${q.b2 ** 2}`)}이에요.` : k === 0 ? `${m(`\\angle PBA=90^{\\circ}-${a(q.th)}`)}예요.` : `${m(`\\angle POB=2\\times${a(q.th)}`)}예요.`
    ];
    const draw = (b, st) => { if (st >= 2) b.right(g.P, g.A, g.B, { size: 15, color: 'green' }); if (st >= 3) { shade(b, [g.A, g.P, g.B]); if (k === 2) { aux(b, O, g.P); sameArc(b, g.P, g.B); } } };
    return k === 1 ? L('PB', q.b2, lines, draw) : A(k === 0 ? 'PBA' : 'POB', k === 0 ? 90 - q.th : 2 * q.th, lines, draw);
  };
  solvers['c4-5'] = M => {
    const q = M.q, g = M.g, s = Math.sin(q.A0 * DEG), bc = 2 * q.a * s, askR = q.ask === 'R';
    return L(askR ? 'R' : 'BC', askR ? q.a : bc, [
      `${m(`\\angle A=${a(q.A0)}`)}이고 ${askR ? `${m(`BC=${n(bc)}`)}에서 반지름 R을` : `반지름 ${m(`R=${q.a}`)}에서 BC를`} 구해요.`,
      'B를 지나는 지름 BD를 그으면 ∠BCD=90°예요. ∠BDC와 ∠BAC는 같은 호 BC에 대한 원주각이에요.',
      `${m(`\\sin${a(q.A0)}=\\frac{BC}{BD}=\\frac{BC}{2R}`)}이므로 ${m(`BC=2R\\sin${a(q.A0)}`)}예요.`,
      askR ? `${m(`R=\\frac{${n(bc)}}{2\\sin${a(q.A0)}}`)}에 특수각의 정확한 삼각비를 대입해요.` : `${m(`BC=2\\times${q.a}\\times\\sin${a(q.A0)}`)}에 특수각의 정확한 삼각비를 대입해요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.B, g.D); aux(b, g.C, g.D); labelPoint(b, g.D, 'D'); b.right(g.C, g.B, g.D, { size: 12, color: 'green' }); } if (st >= 3) shade(b, [g.B, g.C, g.D]); });
  };
  solvers['c4-6'] = M => {
    const q = M.q, g = M.g, central = 180 - 4 * q.th, k = q.kind, value = k === 0 ? central / (2 * q.th) * q.k : k === 1 ? central : central / 2;
    return lesson(k === 0 ? '\\widehat{CD}' : k === 1 ? '\\angle COD' : '\\angle CAD', value, k === 0 ? '' : '°',
      `지름 AB와 현 CD가 평행하고 ∠ADC=${q.th}°예요.${k === 0 ? ` 호 DB의 길이는 ${q.k}π예요.` : ''}`,
      '평행선의 엇각과 같은 호의 원주각을 이용하면 호 AC와 호 DB의 크기는 같아요.',
      `호 AC와 호 DB의 중심각은 각각 ${2 * q.th}°예요. 반원 180°에서 두 호를 빼면 호 CD가 남아요.`,
      `${m(`\\text{호 CD의 크기}=180^{\\circ}-2\\times${a(2 * q.th)}=${a(central)}`)}${k === 0 ? `이므로 길이는 ${m(`\\frac{${central}}{${2 * q.th}}\\times${q.k}\\pi`)}예요.` : k === 2 ? '이고 ∠CAD는 그 절반이에요.' : '예요.'}`,
      (b, st) => { if (st >= 2) { sameArc(b, g.A, g.C); sameArc(b, g.D, g.B); G.par(b, g.A, g.B); G.par(b, g.C, g.D); } if (st >= 3) { aux(b, O, g.C); aux(b, O, g.D); shade(b, [O, g.C, g.D]); } }, k === 0 ? `${n(value)}\\pi` : undefined);
  };
  solvers['c4-7'] = M => {
    const q = M.q, k = q.kind, pairs = [['B', 'C', 'A', 'D'], ['C', 'D', 'B', 'A'], ['D', 'A', 'B', 'C']][k];
    const [x, y, v, w] = pairs, value = q.arcs[k + 1] / 2;
    return A(`${x}${w}${y}`, value, [
      `네 점이 한 원 위에 있고 ∠${x}${v}${y}=${value}°예요. ∠${x}${w}${y}를 구해요.`,
      `두 꼭짓점 ${v}, ${w}는 현 ${x}${y}의 같은 쪽에 있어요. 두 각은 같은 호를 보는 원주각이에요.`,
      `현 ${x}${y}를 강조하고 ${v}, ${w}에서 두 끝점으로 이어진 삼각형을 비교해요.`,
      `${m(`\\angle ${x}${w}${y}=\\angle ${x}${v}${y}`)}이므로 주어진 각과 크기가 같아요.`
    ], (b, st) => { if (st >= 2) { line(b, M[x], M[y], 'green', 4); sameArc(b, M[x], M[y]); } if (st >= 3) { shade(b, [M[v], M[x], M[y]], 'sky'); shade(b, [M[w], M[x], M[y]], 'green'); } });
  };
  solvers['c4-8'] = M => {
    const q = M.q, g = M.g, k = q.kind, beta = 90 - q.th;
    return A(['OBC', 'BAC', 'OBA'][k], [beta, q.th, q.be - beta][k], [
      k === 1 ? `외심 O와 ∠OBC=${beta}°에서 ∠A를 구해요.` : `∠A=${q.th}°${k === 2 ? `, ∠ABC=${q.be}°이고 O는 삼각형 내부` : ''}에서 ∠${k === 0 ? 'OBC' : 'OBA'}를 구해요.`,
      '중심각 ∠BOC는 원주각 ∠A의 두 배이고, OB=OC이므로 △OBC는 이등변삼각형이에요.',
      '두 밑각을 같게 나누면 ∠OBC=(180°−2∠A)÷2=90°−∠A예요.',
      k === 0 ? `${m(`\\angle OBC=90^{\\circ}-${a(q.th)}`)}예요.` : k === 1 ? `${m(`\\angle A=90^{\\circ}-${a(beta)}`)}예요.` : `${m(`\\angle OBC=90^{\\circ}-${a(q.th)}=${a(beta)}`)}를 구한 뒤 ${m(`\\angle OBA=${a(q.be)}-${a(beta)}`)}예요.`
    ], (b, st) => { if (st >= 2) { aux(b, O, g.B); aux(b, O, g.C); tick(b, O, g.B); tick(b, O, g.C); } if (st >= 3) shade(b, [O, g.B, g.C]); });
  };

  // ⑤ 내접사각형
  solvers['c5-1'] = M => {
    const q = M.q, g = M.g, k = q.kind, value = k === 0 ? 180 - q.b : k === 1 ? 180 - q.a : q.x;
    return lesson(k === 2 ? 'x' : `\\angle ${k === 0 ? 'D' : 'C'}`, value, k === 2 ? '' : '°',
      k === 2 ? `∠A=(x+${q.a1})°, ∠C=(2x${q.c1 >= 0 ? '+' : ''}${q.c1})°에서 x를 구해요.` : `원에 내접하고 ∠${k === 0 ? 'B' : 'A'}=${k === 0 ? q.b : q.a}°예요. 마주 보는 각을 구해요.`,
      '내접사각형의 마주 보는 두 각은 원 전체를 나누는 두 호에 대한 원주각이므로 합이 180°예요.',
      k === 0 ? '∠B와 ∠D가 보는 두 호 AC를 확인해요.' : '∠A와 ∠C가 보는 두 호 BD를 확인해요.',
      k === 2 ? `${m(`(x+${q.a1})+(2x${q.c1 >= 0 ? '+' : ''}${q.c1})=180`)}이므로 ${m(`3x=${180 - q.a1 - q.c1}`)}이에요.` : `${m(`\\angle ${k === 0 ? 'D' : 'C'}=180^{\\circ}-${a(k === 0 ? q.b : q.a)}`)}예요.`,
      (b, st) => { if (st >= 2) aux(b, k === 0 ? g.A : g.B, k === 0 ? g.C : g.D); if (st >= 3) { shade(b, [g.A, g.B, g.C], 'sky'); shade(b, [g.A, g.D, g.C], 'green'); } });
  };
  solvers['c5-2'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return A(['DCE', 'BAD', 'BCD'][k], k === 2 ? 180 - q.a : q.a, [
      k === 0 ? `∠A=${q.a}°에서 변 BC의 연장선이 만드는 외각 ∠DCE를 구해요.` : `외각 ∠DCE=${q.a}°에서 ${k === 1 ? '대각 ∠A' : '이웃한 내각 ∠BCD'}를 구해요.`,
      '내접사각형에서 ∠A+∠BCD=180°이고, 일직선 위에서 ∠BCD+∠DCE=180°예요.',
      '두 식에서 같은 ∠BCD를 빼면 외각 ∠DCE는 대각 ∠A와 같아요.',
      k === 2 ? `${m(`\\angle BCD=180^{\\circ}-${a(q.a)}`)}예요.` : `${m(`\\angle DCE=\\angle A=${a(q.a)}`)}이에요.`
    ], (b, st) => { if (st >= 2) line(b, g.B, g.E, 'green', 3); if (st >= 3) { aux(b, g.B, g.D); shade(b, [g.A, g.B, g.D]); } });
  };
  solvers['c5-3'] = M => {
    const q = M.q, g = M.g, aa = (180 - q.p - q.q) / 2, k = q.kind;
    return A(['BAD', 'DQC', 'ABC'][k], [aa, q.q, 180 - aa - q.q][k], [
      k === 1 ? `∠A=${aa}°, ∠P=${q.p}°에서 ∠Q를 구해요.` : `∠P=${q.p}°, ∠Q=${q.q}°에서 ${k === 0 ? '∠A' : '∠ABC'}를 구해요.`,
      '연장선 위의 두 삼각형 PAD와 QAB를 찾고, 내접사각형의 ∠B+∠D=180°를 이용해요.',
      '두 삼각형의 내각 합을 더하면 ∠P+∠Q+2∠A=180°가 돼요.',
      k === 1 ? `${m(`\\angle Q=180^{\\circ}-${a(q.p)}-2\\times${a(aa)}`)}예요.` : `${m(`\\angle A=(180^{\\circ}-${a(q.p)}-${a(q.q)})\\div2=${a(aa)}`)}${k === 2 ? `이므로 △QAB에서 ${m(`\\angle ABC=180^{\\circ}-${a(aa)}-${a(q.q)}`)}예요.` : '예요.'}`
    ], (b, st) => { if (st >= 2) { line(b, g.P, g.A, 'green', 3); line(b, g.P, g.D, 'green', 3); } if (st >= 3) { shade(b, [g.P, g.A, g.D], 'sky'); shade(b, [g.Q, g.A, g.B], 'green'); } });
  };
  solvers['c5-4'] = M => {
    const q = M.q, g = M.g, k = q.kind, x = q.B0 + q.D0 - 180;
    return A(['ACE', 'CDE', 'ABC'][k], [x, q.D0, q.B0][k], [
      k === 0 ? `오각형에서 ∠B=${q.B0}°, ∠D=${q.D0}°이고 ∠ACE를 구해요.` : `∠ACE=${x}°, ∠${k === 1 ? 'B' : 'D'}=${k === 1 ? q.B0 : q.D0}°에서 나머지 각을 구해요.`,
      '대각선 AC, CE를 그으면 호 EA를 보는 원주각 ∠ACE를 만들 수 있어요.',
      '∠B가 보는 호 CDEA와 ∠D가 보는 호 EABC의 합은 원 전체에 호 EA를 한 번 더한 크기예요. 따라서 ∠B+∠D=180°+∠ACE예요.',
      k === 0 ? `${m(`\\angle ACE=${a(q.B0)}+${a(q.D0)}-180^{\\circ}`)}이에요.` : k === 1 ? `${m(`\\angle D=180^{\\circ}+${a(x)}-${a(q.B0)}`)}예요.` : `${m(`\\angle B=180^{\\circ}+${a(x)}-${a(q.D0)}`)}예요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.A, g.C); aux(b, g.C, g.E); } if (st >= 3) { sameArc(b, g.E, g.A); shade(b, [g.A, g.C, g.E]); } });
  };
  solvers['c5-5'] = M => {
    const q = M.q, g = M.g, k = q.kind, given = Math.round(angBetween(g.B, g.A, g.D));
    return A(['ADC', 'BAD', 'ACD'][k], [180 - q.a, q.a, given][k], [
      k === 0 ? `∠B=${q.a}°에서 원에 내접하도록 하는 ∠D를 구해요.` : k === 1 ? `외각 ∠DCE=${q.a}°에서 원에 내접하도록 하는 ∠A를 구해요.` : `B, C가 현 AD의 같은 쪽에 있고 ∠ABD=${given}°일 때 ∠ACD를 구해요.`,
      ['원에 내접하는 사각형은 마주 보는 두 각의 합이 180°예요.', '원의 내접사각형에서는 한 외각이 그 대각과 같아요.', '현의 같은 쪽에 있는 두 점에서 그 현을 보는 각이 같으면 네 점은 한 원 위에 있어요.'][k],
      ['∠B와 ∠D가 마주 보는 각인지 확인해요. 이웃한 두 각의 합과 혼동하지 않아요.', 'B, C, E가 한 직선 위에 있어요. ∠BCD를 두 보각 관계에서 제거해요.', '선분 AD를 강조하고 B와 C에서 AD를 보는 두 삼각형을 비교해요.'][k],
      k === 0 ? `${m(`\\angle D=180^{\\circ}-${a(q.a)}`)}이어야 해요.` : k === 1 ? `${m(`\\angle A=\\angle DCE=${a(q.a)}`)}이어야 해요.` : `${m(`\\angle ACD=\\angle ABD=${a(given)}`)}이어야 해요.`
    ], (b, st) => { if (st >= 2) aux(b, k === 2 ? g.A : g.A, k === 2 ? g.D : g.C); if (st >= 3) { shade(b, [g.A, g.B, g.D], 'sky'); shade(b, [g.A, g.C, g.D], 'green'); } });
  };
  solvers['c5-6'] = M => {
    const g = M.g, value = g.cyc ? 1 : 0;
    const out = lesson('\\text{판정}', value, '',
      `그림의 ${g.name}에서 ∠A=${g.a}°, ∠C=${g.cc}°예요. 원에 내접하는지 판단해요.`,
      '볼록사각형이 원에 내접할 필요충분조건은 마주 보는 두 각의 합이 180°인 것이에요.',
      '∠A와 ∠C를 같은 표시로 강조해요. 이웃한 각의 합이나 같은 변의 길이만으로 판단하지 않아요.',
      `${m(`${a(g.a)}+${a(g.cc)}=${a(g.a + g.cc)}`)}${g.cyc ? '로 180°와 같아요.' : '로 180°와 달라요.'}`,
      (b, st) => { if (st >= 2) { angle(b, g.A, g.B, g.D); angle(b, g.C, g.B, g.D); } if (st >= 3) aux(b, g.B, g.D); if (st >= 5) circle(b, g.c, g.r, g.cyc ? 'green' : 'ink', 2.8, { dash: g.cyc ? undefined : [6, 5], alpha: .65 }); });
    out.steps[4] = `따라서 이 ${g.name}${g.cyc ? '은 원에 내접해요.' : '은 원에 내접하지 않아요.'} 일반적인 평행사변형은 직사각형일 때, 마름모는 정사각형일 때 원에 내접해요.`;
    return out;
  };

  // ⑥ 접선과 현: 같은 호를 보는 각에서 닮음·곱 관계까지 이어집니다.
  solvers['c6-1'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return A(['ACB', 'BAT', 'AOB'][k], k === 2 ? q.th : q.th / 2, [
      `A에서의 접선 AT와 현 AB를 보세요. ${k === 1 ? '∠ACB' : '∠BAT'}=${q.th / 2}°에서 ∠${['ACB', 'BAT', 'AOB'][k]}를 구해요.`,
      '접선과 현이 이루는 각은 그 각의 내부에 있는 호를 보는 원주각과 같아요.',
      'A에서 원의 중심으로 반지름 OA를 그으면 OA⊥AT예요. 호 AB를 보는 ∠ACB와 연결해요.',
      k === 2 ? `${m(`\\angle AOB=2\\angle ACB=2\\times${a(q.th / 2)}`)}예요.` : `${m(`\\angle BAT=\\angle ACB=${a(q.th / 2)}`)}예요.`
    ], (b, st) => { if (st >= 2) { aux(b, O, g.A); b.right(g.A, O, g.T, { size: 12, color: 'green' }); } if (st >= 3) { sameArc(b, g.A, g.B); shade(b, [g.A, g.B, g.C]); } });
  };
  solvers['c6-2'] = M => {
    const q = M.q, g = M.g, k = q.kind, al = 180 - q.a - q.b2;
    return A(['BAC', 'T^{\\prime}AC', 'ACB'][k], [al, q.b2, q.a][k], [
      k === 1 ? `∠TAB=${q.a}°, ∠BAC=${al}°에서 ∠T′AC를 구해요.` : `직선 TAT′ 위에서 ∠TAB=${q.a}°, ∠T′AC=${q.b2}°예요. ${k === 0 ? '∠BAC' : '∠ACB'}를 구해요.`,
      k === 2 ? '접선과 현 AB가 이루는 ∠TAB는 호 AB에 대한 원주각 ∠ACB와 같아요.' : '접선은 직선이므로 A의 위쪽에 나란히 놓인 세 각의 합은 180°예요.',
      k === 2 ? '같은 호 AB를 강조하고 접선 각과 원주각이 보는 호를 확인해요.' : '∠TAB, ∠BAC, ∠CAT′를 차례로 따라가면 한 평각을 만들어요.',
      k === 0 ? `${m(`\\angle BAC=180^{\\circ}-${a(q.a)}-${a(q.b2)}`)}예요.` : k === 1 ? `${m(`\\angle T^{\\prime}AC=180^{\\circ}-${a(q.a)}-${a(al)}`)}예요.` : `${m(`\\angle ACB=\\angle TAB=${a(q.a)}`)}예요.`
    ], (b, st) => { if (st >= 2) line(b, g.Tt, g.T2, 'green', 3); if (st >= 3) { shade(b, [g.A, g.B, g.C]); if (k === 2) sameArc(b, g.A, g.B); } });
  };
  solvers['c6-3'] = M => {
    const q = M.q, g = M.g, k = q.kind, small = (90 - q.th) / 2;
    return A(['TAB', 'ATP', 'TPB'][k], [small, 90 + small, q.th][k], [
      k === 2 ? `AB는 지름이고 PT는 접선이에요. ∠PTB=${small}°에서 ∠P를 구해요.` : `AB는 지름이고 PT는 접선이에요. ∠P=${q.th}°에서 ∠${k === 0 ? 'TAB' : 'ATP'}를 구해요.`,
      '반지름 OT는 접선 PT와 수직이에요. 직각삼각형 OTP에서 ∠TOP+∠P=90°예요.',
      'O, B, P는 한 직선 위에 있어요. 호 TB의 중심각 ∠TOB는 원주각 ∠TAB의 두 배예요. 또 ∠ATB=90°예요.',
      k === 2 ? `${m(`\\angle TAB=\\angle PTB=${a(small)}`)}이므로 ${m(`\\angle P=90^{\\circ}-2\\times${a(small)}`)}예요.` : `${m(`\\angle TOB=90^{\\circ}-${a(q.th)},\ \\angle TAB=${a(90 - q.th)}\\div2=${a(small)}`)}${k === 1 ? `이고 ${m(`\\angle ATP=90^{\\circ}+${a(small)}`)}이에요.` : '이에요.'}`
    ], (b, st) => { if (st >= 2) { aux(b, O, g.T); b.right(g.T, O, g.P, { size: 12, color: 'green' }); } if (st >= 3) { aux(b, g.A, g.T); aux(b, g.B, g.T); shade(b, [O, g.T, g.P]); } });
  };
  solvers['c6-4'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return A(['BAC', 'BAT', 'ACB'][k], [180 - 2 * q.t, q.t, q.t][k], [
      `접선 AT와 현 BC가 평행해요. ${k === 0 ? `∠BAT=${q.t}°` : k === 1 ? `∠BAC=${180 - 2 * q.t}°` : `∠ABC=${q.t}°`}에서 ∠${['BAC', 'BAT', 'ACB'][k]}를 구해요.`,
      '접선과 현의 각으로 ∠BAT=∠ACB이고 평행선의 엇각으로 ∠BAT=∠ABC예요.',
      '△ABC의 두 밑각 ∠ABC와 ∠ACB가 같으므로 두 각을 같은 표시로 연결해요.',
      k === 0 ? `${m(`\\angle BAC=180^{\\circ}-2\\times${a(q.t)}`)}예요.` : k === 1 ? `${m(`\\angle BAT=(180^{\\circ}-${a(180 - 2 * q.t)})\\div2`)}예요.` : `${m(`\\angle ACB=\\angle ABC=${a(q.t)}`)}예요.`
    ], (b, st) => { if (st >= 2) { G.par(b, g.T2, g.Tt); G.par(b, g.B, g.C); } if (st >= 3) { tick(b, g.A, g.B); tick(b, g.A, g.C); shade(b, [g.A, g.B, g.C]); } });
  };
  solvers['c6-5'] = M => {
    const q = M.q, g = M.g, k = q.kind, base = (180 - q.be) / 2;
    return A(['BAT', 'ACB', 'BAC'][k], base, [
      `AB=BC인 이등변삼각형이고 ${k === 2 ? `∠BAT=${base}°` : `∠ABC=${q.be}°`}예요. ∠${['BAT', 'ACB', 'BAC'][k]}를 구해요.`,
      'AB=BC이므로 밑각 ∠BAC와 ∠ACB는 같아요. 접선과 현의 각 ∠BAT도 ∠ACB와 같아요.',
      '같은 길이인 AB, BC에 같은 눈금을 표시하고, 접선 각이 보는 호 AB를 확인해요.',
      k === 2 ? `${m(`\\angle BAC=\\angle ACB=\\angle BAT=${a(base)}`)}예요.` : `${m(`\\angle BAC=\\angle ACB=(180^{\\circ}-${a(q.be)})\\div2`)}${k === 0 ? '이고 ∠BAT도 그 각과 같아요.' : '예요.'}`
    ], (b, st) => { if (st >= 2) { tick(b, g.A, g.B); tick(b, g.B, g.C); } if (st >= 3) { sameArc(b, g.A, g.B); shade(b, [g.A, g.B, g.C]); } });
  };
  function productSolution(M, outside) {
    const q = M.q, g = M.g, k = q.kind, target = outside ? ['PD', 'PA', 'AB'][k] : ['PD', 'PA', 'PB'][k];
    const value = outside ? [q.d, q.a, q.b - q.a][k] : [q.d, q.a, q.b][k];
    const calc = k === 0 ? `PD=\\frac{${q.a}\\times${q.b}}{${q.c}}` : k === 1 ? `PA=\\frac{${q.c}\\times${q.d}}{${q.b}}` : outside ? `PB=\\frac{${q.c}\\times${q.d}}{${q.a}}=${q.b},\ AB=PB-PA=${q.b}-${q.a}` : `PB=\\frac{${q.c}\\times${q.d}}{${q.a}}`;
    return L(target, value, [
      k === 0 ? `PA=${q.a}, PB=${q.b}, PC=${q.c}에서 PD를 구해요.` : k === 1 ? `PB=${q.b}, PC=${q.c}, PD=${q.d}에서 PA를 구해요.` : `PA=${q.a}, PC=${q.c}, PD=${q.d}에서 ${target}를 구해요.`,
      outside ? '두 할선 P-A-B와 P-C-D에서 △PAD와 △PCB는 P의 각이 공통이고 나머지 각도 원주각으로 연결되어 닮아요.' : '두 현의 교점 P에서 △PAC와 △PDB는 맞꼭지각과 같은 호에 대한 원주각이 같으므로 닮아요.',
      `${m('PA\\cdot PB=PC\\cdot PD')}예요. ${outside ? 'PB와 PD는 원 밖 점 P부터 먼 교점까지의 전체 길이예요.' : '각 현을 P가 나눈 두 길이를 곱해요.'}`,
      `${m(calc)}로 계산해요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.A, outside ? g.D : g.C); aux(b, g.B, outside ? g.C : g.D); } if (st >= 3) { shade(b, outside ? [g.P, g.A, g.D] : [g.P, g.A, g.C], 'sky'); shade(b, outside ? [g.P, g.C, g.B] : [g.P, g.D, g.B], 'green'); } });
  }
  solvers['c6-6'] = M => productSolution(M, false);
  solvers['c6-7'] = M => productSolution(M, true);
  solvers['c6-8'] = M => {
    const q = M.q, g = M.g, k = q.kind;
    return L(['PT', 'PA', 'AB'][k], [q.t, q.a, q.b - q.a][k], [
      k === 0 ? `접선 PT와 할선 P-A-B에서 PA=${q.a}, PB=${q.b}일 때 PT를 구해요.` : k === 1 ? `PT=${q.t}, PB=${q.b}에서 PA를 구해요.` : `PT=${q.t}, PA=${q.a}에서 원 안의 길이 AB를 구해요.`,
      '△PTA와 △PBT는 P의 각이 공통이고, 접선과 현의 각으로 다른 각도 같으므로 닮아요.',
      `${m('PT^2=PA\\cdot PB')}예요. PB는 원 밖 점 P에서 먼 교점 B까지의 전체 길이예요.`,
      k === 0 ? `${m(`PT^2=${q.a}\\times${q.b}=${q.t ** 2}`)}이에요.` : k === 1 ? `${m(`PA=\\frac{${sq(q.t)}}{${q.b}}`)}예요.` : `${m(`PB=\\frac{${sq(q.t)}}{${q.a}}=${q.b}`)}을 구한 뒤 ${m(`AB=${q.b}-${q.a}`)}예요.`
    ], (b, st) => { if (st >= 2) { aux(b, g.T, g.A); aux(b, g.T, g.B); } if (st >= 3) { shade(b, [g.P, g.T, g.A], 'sky'); shade(b, [g.P, g.B, g.T], 'green'); } });
  };

  // ⑦ 넓이: 정확한 π·√ 표현을 유지하고 현재 목표 영역만 마지막에 강조합니다.
  const pi = v => `${n(v)}\\pi`;
  const triangleTex = (R, phi, factor = 1) => {
    if (phi === 90) return n(factor * R * R / 2);
    if (phi === 30 || phi === 150) return n(factor * R * R / 4);
    const frac = G.fracOf(factor * R * R / 4);
    return frac[1] === 1 ? `${frac[0] === 1 ? '' : frac[0]}\\sqrt{3}` : `\\frac{${frac[0] === 1 ? '' : frac[0]}\\sqrt{3}}{${frac[1]}}`;
  };
  solvers['c7-1'] = M => {
    const q = M.q, g = M.g, k = q.kind, sector = Math.PI * q.R ** 2 * q.phi / 360, triangle = q.R ** 2 * Math.sin(q.phi * DEG) / 2;
    const st = pi(q.R ** 2 * q.phi / 360), tt = triangleTex(q.R, q.phi), tex = k === 0 ? `${st}-${tt}` : k === 1 ? tt : st;
    return lesson('S', [sector - triangle, triangle, sector][k], '',
      `반지름 R=${q.R}, 중심각 ∠AOB=${q.phi}°에서 ${['활꼴 AB', '삼각형 OAB', '부채꼴 OAB'][k]}의 넓이를 구해요.`,
      k === 0 ? '활꼴은 호와 현 사이의 영역이에요. 부채꼴에서 중심을 꼭짓점으로 하는 삼각형을 빼요.' : k === 1 ? '삼각형은 두 반지름과 현으로 둘러싸여 있어요. 두 변과 그 사잇각으로 넓이를 구해요.' : '부채꼴은 두 반지름과 호로 둘러싸여 있어요. 중심각이 원 전체의 몇 분의 몇인지 사용해요.',
      k === 1 ? `${m(`S_{\\triangle OAB}=\\frac12R^2\\sin${a(q.phi)}`)}예요.` : `${m(`S_{\\text{부채꼴}}=\\pi R^2\\times\\frac{${q.phi}}{360}=${st}`)}이에요.`,
      k === 0 ? `${m(`S_{\\triangle OAB}=\\frac12\\times${sq(q.R)}\\times\\sin${a(q.phi)}=${tt}`)}이므로 부채꼴에서 이 넓이를 빼요.` : k === 1 ? `${m(`S=\\frac12\\times${sq(q.R)}\\times\\sin${a(q.phi)}`)}에 정확한 특수각 값을 대입해요.` : `${m(`S=\\pi\\times${sq(q.R)}\\times\\frac{${q.phi}}{360}`)}로 계산해요.`,
      (b, step) => { if (step === 2 && k !== 1) fillSector(b, O, q.R, g.a0, g.a1, 'rose', .12); if (step >= 3) { aux(b, O, g.A); aux(b, O, g.B); if (k !== 2 && step < 5) shade(b, [O, g.A, g.B], 'sky'); } if (step >= 5 && k === 0) fillSeg(b, O, q.R, g.a0, g.a1, 'amber', .2); }, tex);
  };
  solvers['c7-2'] = M => {
    const q = M.q, g = M.g, R = q.R, k = q.kind, tri = R * R * Math.sqrt(3) / 4, segment = Math.PI * R * R / 3 - tri;
    const tt = triangleTex(R, 120), tex = k === 0 ? n(R * Math.sqrt(3)) : k === 1 ? `${pi(R * R / 3)}-${tt}` : `${pi(2 * R * R / 3)}+${tt}`;
    return lesson(k === 0 ? 'CD' : 'S', [R * Math.sqrt(3), segment, Math.PI * R * R - segment][k], k === 0 ? 'cm' : '',
      `반지름 ${R}인 원에서 접힌 호가 O를 지나요. ${['접는 선 CD', '접힌 부분의 넓이', '접은 뒤 도형의 넓이'][k]}를 구해요.`,
      '접는 선의 중점 M은 원래 중심과 접힌 원의 중심의 중점이에요. 접힌 호가 O를 지나므로 OM=R÷2예요.',
      `${m(`OM=${n(R / 2)}`)}이고 △OMC에서 ∠COM=60°예요. 따라서 ∠COD=120°이고 ${m(`CD=\\sqrt{3}R`)}이에요.`,
      k === 0 ? `${m(`CD=\\sqrt{3}\\times${R}`)}예요.` : k === 1 ? `접어도 넓이는 같아요. 접힌 활꼴의 넓이는 ${m(`${pi(R * R / 3)}-${tt}`)}예요.` : `접은 뒤 겉모양은 원에서 원래 활꼴 하나를 뺀 영역이에요. ${m(`${pi(R * R)}-(${pi(R * R / 3)}-${tt})`)}로 계산해요.`,
      (b, st) => { if (st >= 2) { aux(b, O, g.M); b.right(g.M, O, g.D, { size: 12, color: 'green' }); labelPoint(b, g.M, 'M'); tick(b, g.C, g.M, 2); tick(b, g.M, g.D, 2); } if (st >= 3) shade(b, [O, g.C, g.M]); }, tex);
  };
  solvers['c7-3'] = M => {
    const q = M.q, g = M.g, phi = 2 * q.th, k = q.kind, sector = Math.PI * q.R ** 2 * phi / 360, tri = q.R ** 2 * Math.sin(phi * DEG) / 2;
    const st = pi(q.R ** 2 * phi / 360), tt = triangleTex(q.R, phi), tex = k === 0 ? `${st}-${tt}` : k === 1 ? st : `${pi(q.R ** 2 / 2)}-${triangleTex(q.R, phi, 2)}`;
    return lesson('S', [sector - tri, sector, Math.PI * q.R ** 2 / 2 - 2 * tri][k], '',
      `반지름 ${q.R}, 원주각 ∠ABC=${q.th}°에서 ${['활꼴 AC', '부채꼴 OAC', '반원에서 △ABC를 뺀 영역'][k]}의 넓이를 구해요.`,
      '같은 호 AC를 보는 중심각 ∠AOC는 원주각 ∠ABC의 두 배예요.',
      `${m(`\\angle AOC=2\\times${a(q.th)}=${a(phi)}`)}이에요. ${k === 2 ? 'O와 C를 이어 △ABC를 같은 높이의 두 삼각형으로 나누면 넓이는 △OAC의 두 배예요.' : 'O와 C를 이어 부채꼴과 삼각형을 구분해요.'}`,
      k === 0 ? `${m(`S_{\\text{부채꼴}}=${st},\ S_{\\triangle OAC}=${tt}`)}이므로 두 넓이를 빼요.` : k === 1 ? `${m(`S=\\pi\\times${sq(q.R)}\\times\\frac{${phi}}{360}`)}이에요.` : `반원의 넓이는 ${m(pi(q.R ** 2 / 2))}, △ABC의 넓이는 ${m(triangleTex(q.R, phi, 2))}이므로 두 넓이를 빼요.`,
      (b, step) => { if (step >= 2) { aux(b, O, g.C); sameArc(b, g.A, g.C); } if (step >= 3 && step < 5) { shade(b, [O, g.A, g.C], 'sky'); if (k === 2) shade(b, [O, g.B, g.C], 'green'); } if (step >= 5 && k === 0) fillSeg(b, O, q.R, 180 - phi, 180, 'amber', .2); }, tex);
  };

  (window.APL_CI_GROUPS || []).forEach(group => group.scenes.forEach(scene => {
    if (!solvers[scene.id]) throw new Error('현재 문항 풀이 누락: ' + scene.id);
    scene.ci.solve = solvers[scene.id];
  }));
})();
