/* Current-question solutions for all 39 similarity scenes.
 * The generated smPk is the only numerical source. Exploration stays independent.
 * Stage 1 preserves the problem drawing; later stages add the relevant geometry.
 */
(function () {
  'use strict';
  const G = window.APL_SM;
  const S = String.raw, F = (a, b) => `\\frac{${a}}{${b}}`, O = n => `\\overline{${n}}`;
  const ratio = (a, b) => { const d = G.gcd(a, b); return `${a / d}:${b / d}`; };
  const names = { tri: '정삼각형', sq: '정사각형', circ: '원', pent: '정오각형', rti: '직각이등변삼각형', rec: '직사각형', rho: '마름모', iso: '이등변삼각형', par: '평행사변형', trp: '사다리꼴', rtr: '직각삼각형' };
  const always = ['tri', 'sq', 'circ', 'pent', 'rti'];
  const solvers = {};
  const pack = (steps, answer, targets = {}) => ({ steps, answer, targets });
  solvers['sm1-corr'] = p => {
    const v = [6, 5, 2, 3], l = ['AB', 'BC', 'CD', 'DA'], r = ['EF', 'FG', 'GH', 'HE'];
    const a = p.kind === 2 ? 16 * p.n : v[p.ask] * p.n;
    return pack([
      '□ABCD ∽ □EFGH이므로 A↔E, B↔F, C↔G, D↔H 순서로 대응해요.',
      p.kind === 2 ? S`주어진 대응변은 $AB=${6 * p.m},\ EF=${6 * p.n}$이고, 작은 도형의 둘레는 ${16 * p.m} cm예요.` : S`길이를 모두 아는 대응변은 $${l[p.given]}=${v[p.given] * p.m},\ ${r[p.given]}=${v[p.given] * p.n}$예요.`,
      S`작은 도형 : 큰 도형의 닮음비는 $${p.m}:${p.n}=${ratio(p.m, p.n)}$예요. ${p.kind === 2 ? '둘레도 대응변을 모두 더한 길이이므로 같은 비로 커져요.' : `구하는 ${r[p.ask]}는 작은 도형의 ${l[p.ask]}와 대응해요.`}`,
      p.kind === 2 ? S`큰 도형의 둘레 $=${16 * p.m}\times${F(p.n, p.m)}=${a}$예요.` : S`$${v[p.ask] * p.m}:x=${p.m}:${p.n}$이므로 $x=${v[p.ask] * p.m}\times${F(p.n, p.m)}=${a}$예요.`
    ], a, p.kind === 2 ? {} : { x: a });
  };
  solvers['sm1-solid'] = p => {
    const base = { tet: [4, 3, 2], box: [3, 2, 2], cyl: [2, 4] }[p.type];
    const unknown = base.map((v, i) => i).filter(i => i !== p.given);
    const x = base[p.ask] * p.n, y = p.type === 'tet' ? base[unknown.find(i => i !== p.ask)] * p.n : 0;
    const a = p.type === 'tet' ? x + y : x;
    return pack([
      `그림에서 작은 입체와 큰 입체의 같은 위치에 있는 모서리${p.type === 'cyl' ? '·반지름·높이' : ''}를 짝지어요.`,
      S`길이를 모두 아는 대응 길이는 $${base[p.given] * p.m}$과 $${base[p.given] * p.n}$이므로 닮음비는 $${p.m}:${p.n}$예요.`,
      S`입체의 길이도 닮음비를 그대로 사용해요. $${base[p.ask] * p.m}:x=${p.m}:${p.n}$이므로 $x=${base[p.ask] * p.m}\times${F(p.n, p.m)}=${x}$예요.`,
      p.type === 'tet' ? S`다른 대응 모서리도 같은 비이므로 $y=${y}$예요. 따라서 $x+y=${x}+${y}=${a}$예요.` : S`구하는 길이는 $${x}$ cm예요. 길이에 넓이의 비나 부피의 비를 곱하지 않아요.`
    ], a, p.type === 'tet' ? { x, y } : { x });
  };
  solvers['sm1-len'] = p => {
    const known = p.ask === 0 ? p.q : p.p, ask = p.ask === 0 ? p.p : p.q, a = ask * p.n;
    return pack([
      `두 직사각형에서 가로끼리, 세로끼리 대응해요. 지금 구하는 x는 큰 직사각형의 ${p.ask === 0 ? '가로' : '세로'}예요.`,
      S`길이를 모두 아는 ${p.ask === 0 ? '세로' : '가로'}의 비는 $${known * p.m}:${known * p.n}=${ratio(p.m, p.n)}$예요.`,
      S`작은 도형에서 x에 대응하는 길이는 $${ask * p.m}$이므로 $${ask * p.m}:x=${p.m}:${p.n}$으로 놓아요.`,
      S`$x=${ask * p.m}\times${F(p.n, p.m)}=${a}$예요. 가로의 비와 세로의 비가 같아야 해요.`
    ], a, { x: a });
  };
  solvers['sm1-always'] = p => {
    const chosen = p.items.find(t => p.askAlways ? always.includes(t) : !always.includes(t));
    return pack([
      `문제는 '${p.askAlways ? '항상 닮은 도형' : '항상 닮는다고 할 수 없는 도형'}'을 묻고 있어요. 보기의 모양 하나만 보고 판단하지 않아요.`,
      '항상 닮으려면 크기가 달라져도 모든 대응변의 비가 같고 모든 대응각의 크기가 같아야 해요.',
      p.askAlways ? `${names[chosen]}은(는) ${chosen === 'circ' ? '반지름의 비로 전체를 확대·축소할 수 있어요.' : chosen === 'rti' ? '두 예각이 모두 45°로 정해져 AA 닮음이에요.' : '변의 비와 각이 정해져 있어 크기만 달라져요.'}` : `${names[chosen]}은(는) ${chosen === 'rec' ? '가로와 세로의 비' : chosen === 'rho' || chosen === 'par' ? '대응각의 크기' : chosen === 'iso' || chosen === 'rtr' ? '예각이나 꼭지각의 크기' : '두 밑변의 비와 각'}가 달라질 수 있어요. 서로 다른 모양을 하나만 만들어도 반례가 돼요.`,
      `${names[chosen]}이(가) 질문의 조건을 만족해요. '지금 두 그림이 닮음'과 '이 종류의 도형은 항상 닮음'을 구별해요.`
    ], names[chosen]);
  };
  solvers['sm2-tile'] = p => {
    const a = p.kind === 0 ? p.q ** 2 * p.c : p.kind === 1 ? ratio(p.p ** 2, p.q ** 2) : ratio(p.p, p.q);
    return pack([
      p.kind === 2 ? S`주어진 넓이의 비는 $${p.p ** 2}:${p.q ** 2}$예요.` : S`작은 도형 A : 큰 도형 B의 닮음비는 $${p.p}:${p.q}$예요.`,
      '닮은 도형은 가로와 높이가 같은 비로 변하므로 넓이는 그 비의 제곱으로 변해요.',
      S`$${p.p}^{2}:${p.q}^{2}=${p.p ** 2}:${p.q ** 2}$예요. ${p.kind === 2 ? '두 항이 각각 어떤 수의 제곱인지 확인해 길이의 비를 찾아요.' : '길이의 비를 그대로 넓이에 곱하지 않아요.'}`,
      p.kind === 0 ? S`B의 넓이 $=${p.p ** 2 * p.c}\times${F(p.q ** 2, p.p ** 2)}=${a}$ cm²예요.` : S`${p.kind === 1 ? '넓이의 비' : '닮음비'}를 가장 간단히 하면 $${a}$예요.`
    ], a, p.kind === 0 ? { x: a } : {});
  };
  solvers['sm2-cube'] = p => {
    const a = p.kind === 0 ? p.k ** 3 : ratio(p.p ** 2, p.q ** 2);
    return pack([
      p.kind === 0 ? S`작은 블록의 모서리는 ${p.a} cm, 큰 정육면체의 모서리는 ${p.a * p.k} cm예요.` : p.kind === 1 ? S`두 정육면체의 모서리 길이는 ${p.p} cm와 ${p.q} cm예요.` : S`주어진 부피는 ${p.p ** 3} cm³와 ${p.q ** 3} cm³예요.`,
      p.kind === 0 ? S`한 모서리에 $${p.a * p.k}\div${p.a}=${p.k}$개의 블록이 놓여요.` : p.kind === 2 ? S`$${p.p ** 3}=${p.p}^{3},\ ${p.q ** 3}=${p.q}^{3}$이므로 모서리의 비는 $${p.p}:${p.q}$예요.` : S`모서리의 비는 $${p.p}:${p.q}$예요.`,
      p.kind === 0 ? S`한 층에는 $${p.k}\times${p.k}=${p.k ** 2}$개, 층 수는 ${p.k}개예요.` : S`한 면의 넓이의 비는 $${p.p}^{2}:${p.q}^{2}$이고, 양쪽 모두 같은 면이 6개이므로 겉넓이도 같은 비예요.`,
      p.kind === 0 ? S`필요한 블록 수는 $${p.k ** 2}\times${p.k}=${a}$개예요.` : S`겉넓이의 비는 $${p.p ** 2}:${p.q ** 2}=${a}$예요.`
    ], a);
  };
  solvers['sm2-solid'] = p => {
    const e = p.kind === 0 || p.kind === 3 ? 2 : 3, a = p.kind < 2 ? (p.kind === 0 ? 22 : 6) * p.n ** e : ratio(p.m ** e, p.n ** e);
    return pack([
      p.kind < 2 ? S`주어진 대응 모서리의 비는 $${p.m}:${p.n}$이에요.` : p.kind === 2 ? S`주어진 겉넓이는 $${22 * p.m ** 2}$, $${22 * p.n ** 2}$예요.` : S`주어진 부피는 $${6 * p.m ** 3}$, $${6 * p.n ** 3}$예요.`,
      p.kind === 2 ? S`겉넓이의 비 $${p.m ** 2}:${p.n ** 2}=${p.m}^{2}:${p.n}^{2}$에서 닮음비는 $${p.m}:${p.n}$이에요.` : p.kind === 3 ? S`부피의 비 $${p.m ** 3}:${p.n ** 3}=${p.m}^{3}:${p.n}^{3}$에서 닮음비는 $${p.m}:${p.n}$이에요.` : '길이를 비교한 비를 먼저 정하고, 구하는 것이 넓이인지 부피인지 확인해요.',
      S`${e === 2 ? '겉넓이' : '부피'}의 비는 $${p.m}^{${e}}:${p.n}^{${e}}=${p.m ** e}:${p.n ** e}$이에요.`,
      p.kind < 2 ? S`큰 입체의 ${e === 2 ? '겉넓이' : '부피'} $=${(p.kind === 0 ? 22 : 6) * p.m ** e}\times${F(p.n ** e, p.m ** e)}=${a}$이에요.` : S`가장 간단한 비는 $${a}$이에요.`
    ], a, p.kind < 2 ? { x: a } : {});
  };
  solvers['sm2-cone'] = p => {
    const h = [p.h1, p.h1 + p.h2, p.h1 + p.h2 + p.h3], v = [h[0] ** 3, h[1] ** 3 - h[0] ** 3, h[2] ** 3 - h[1] ** 3], d = G.gcd(G.gcd(v[0], v[1]), v[2]);
    const a = p.kind === 0 ? v.map(x => x / d).join(':') : v[1] * p.c;
    return pack([
      S`꼭짓점에서 각 단면과 밑면까지의 높이는 $${h[0]},\ ${h[1]},\ ${h[2]}$예요. 조각 높이가 아니라 누적 높이를 비교해요.`,
      S`단면이 밑면과 평행하므로 세 원뿔이 닮아요. 누적 부피의 비는 $${h[0]}^{3}:${h[1]}^{3}:${h[2]}^{3}=${h.map(x => x ** 3).join(':')}$예요.`,
      S`둘째 조각은 가운데 원뿔에서 작은 원뿔을 빼고, 셋째 조각은 전체에서 가운데 원뿔을 빼요. 조각의 비는 $${v[0]}:(${h[1] ** 3}-${h[0] ** 3}):(${h[2] ** 3}-${h[1] ** 3})$예요.`,
      p.kind === 0 ? S`따라서 세 조각의 부피의 비는 $${v.join(':')}=${a}$예요.` : S`첫 조각 ${v[0] * p.c} cm³가 비의 ${v[0]}에 해당하므로 한 단위는 ${p.c} cm³예요. 둘째 조각 $=${v[1]}\times${p.c}=${a}$ cm³예요.`
    ], a, p.kind === 1 ? { x: a } : {});
  };
  solvers['sm3-par'] = p => {
    const g = G.geo.parGeo(p.m, p.k, p.r), a = p.kind === 0 ? g.DE : p.kind === 2 ? g.EC : g.BC;
    return pack([
      p.kind === 3 ? S`$AD=${g.AD},\ AB=${g.AB},\ DE=${g.DE}$이고 DE ∥ BC예요.` : S`$AD=${g.AD},\ DB=${g.DB}$이므로 $AB=${g.AD}+${g.DB}=${g.AB}$예요. DE ∥ BC도 표시해요.`,
      '평행선의 동위각으로 ∠ADE=∠ABC, ∠AED=∠ACB이므로 △ADE ∽ △ABC (AA)예요.',
      S`닮음비 $AD:AB=${p.m}:${p.m + p.k}$을 대응변 $AE:AC$와 $DE:BC$에 똑같이 사용해요.`,
      p.kind === 0 ? S`$DE=${g.BC}\times${F(p.m, p.m + p.k)}=${a}$예요.` : p.kind === 2 ? S`$AE:EC=AD:DB=${p.m}:${p.k}$이므로 $EC=${g.AE}\times${F(p.k, p.m)}=${a}$예요.` : S`$BC=${g.DE}\times${F(p.m + p.k, p.m)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm3-flip'] = p => {
    const g = G.geo.flipGeo(p.m, p.n, p.r), a = p.kind === 0 ? g.EC : g.BC;
    return pack([
      p.kind === 0 ? S`$AD=${g.AD},\ DB=${g.DB},\ AE=${g.AE}$이므로 $AB=${g.AD}+${g.DB}=${g.AB}$예요.` : S`$AD=${g.AD},\ AE=${g.AE},\ DE=${g.DE},\ AB=${g.AB}$을 확인해요.`,
      '∠A는 공통이고 ∠ADE=∠ACB예요. △ADE ∽ △ACB이므로 D↔C, E↔B로 엇갈려 대응해요.',
      S`$AE:AB=AD:AC=DE:CB=${2 * p.m}:${2 * p.n}=${ratio(p.m, p.n)}$이에요.`,
      p.kind === 0 ? S`$AC=${g.AD}\times${F(p.n, p.m)}=${g.AC}$이므로 $EC=AC-AE=${g.AC}-${g.AE}=${a}$예요.` : S`$BC=${g.DE}\times${F(p.n, p.m)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm3-rot'] = p => {
    const a = (p.kind === 0 ? 4 * p.m : 5 * p.n);
    return pack([
      S`두 직각삼각형에서 $AB=${3 * p.n},\ AD=${3 * p.m}$을 확인해요. ${p.kind === 0 ? `AC=${4 * p.n}이고 AE=x예요.` : `DE=${5 * p.m}이고 BC=x예요.`}`,
      '△ADE를 A 주위로 돌려 AD와 AB, AE와 AC의 방향을 맞춰요. 크기를 바꾸지 않았으므로 길이는 그대로예요.',
      S`대응은 A↔A, D↔B, E↔C예요. 닮음비는 $AD:AB=${p.m}:${p.n}$이에요.`,
      p.kind === 0 ? S`$AE:AC=AD:AB$이므로 $x=${4 * p.n}\times${F(p.m, p.n)}=${a}$예요.` : S`$DE:BC=AD:AB$이므로 $x=${5 * p.m}\times${F(p.n, p.m)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm3-sas'] = p => {
    const g = G.geo.sasGeo(p.m, p.n, p.q, p.a), a = p.kind === 0 ? 'SAS' : g.EC;
    return pack([
      S`$AD=${g.AD},\ DB=${g.DB},\ AE=${g.AE}$이므로 $AB=${g.AB}$이에요. ${p.kind === 0 ? `EC=${g.EC}이므로 AC=${g.AC}도 구해요.` : 'EC=x를 구할 거예요.'}`,
      p.kind === 0 ? S`$AD:AB=${g.AD}:${g.AB}=${ratio(p.m, p.n)}$, $AE:AC=${g.AE}:${g.AC}=${ratio(p.m, p.n)}$으로 두 쌍의 변의 비가 같아요.` : S`주어진 닮음 △ADE ∽ △ABC에서 $AD:AB=AE:AC=${p.m}:${p.n}$이에요.`,
      '두 변 사이의 ∠DAE와 ∠BAC는 같은 각이에요. 두 변의 비와 그 끼인각을 함께 확인해야 해요.',
      p.kind === 0 ? '따라서 SAS 닮음 조건이에요. 끼인각이 아닌 다른 각을 사용한 SSA와 구별해요.' : S`$AC=${g.AE}\times${F(p.n, p.m)}=${g.AC}$이므로 $EC=${g.AC}-${g.AE}=${a}$예요.`
    ], a, p.kind === 1 ? { x: a } : {});
  };
  solvers['sm3-multi'] = p => {
    const g = G.geo.multiGeo(p.a, p.bb, p.c, p.r), a = [g.DE, g.FG, g.BC][p.kind];
    return pack([
      S`$AD=${g.AD},\ DF=${g.DF},\ FB=${g.FB}$이므로 $AF=${g.AD + g.DF},\ AB=${g.AD + g.DF + g.FB}$이에요.`,
      'DE ∥ FG ∥ BC이므로 △ADE, △AFG, △ABC는 같은 두 각을 가지는 닮은 삼각형이에요.',
      S`대응 길이의 비는 $DE:FG:BC=AD:AF:AB=${p.a}:${p.a + p.bb}:${p.a + p.bb + p.c}$이에요.`,
      p.kind === 0 ? S`$DE=${g.BC}\times${F(p.a, p.a + p.bb + p.c)}=${a}$예요.` : p.kind === 1 ? S`$FG=${g.DE}\times${F(p.a + p.bb, p.a)}=${a}$예요.` : S`$BC=${g.DE}\times${F(p.a + p.bb + p.c, p.a)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm3-ssa'] = p => {
    const count = p.kind === 0 ? G.geo.ssaGeo(p.a, p.c, 30).cnt : p.c - Math.floor(p.c / 2) - 1;
    const lengths = Array.from({ length: p.c - Math.floor(p.c / 2) - 1 }, (_, i) => Math.floor(p.c / 2) + 1 + i);
    return pack([
      S`$AB=${p.c}$와 $\angle A=30^{\circ}$를 고정해요. ${p.kind === 0 ? `BC=${p.a}인 원과 반직선의 교점을 찾아요.` : '서로 다른 삼각형 두 개가 되는 BC의 정수 길이를 찾을 거예요.'}`,
      S`B에서 반직선에 수선을 내려 H라 하면, 30° 직각삼각형에서 $BH=${F(p.c, 2)}$예요.`,
      S`$${F(p.c, 2)}<BC<${p.c}$일 때 원이 반직선과 서로 다른 두 점에서 만나요. 끝값에서는 두 삼각형이 되지 않아요.`,
      p.kind === 0 ? `지금 BC=${p.a}이므로 ${count === 0 ? '원이 반직선에 닿지 않아 0개' : count === 2 ? '서로 다른 두 교점이 있어 2개' : '반직선 위의 교점이 하나여서 1개'}예요. SSA는 항상 하나로 정해지는 조건이 아니에요.` : `조건을 만족하는 정수는 ${lengths.join(', ')}이므로 모두 ${count}개예요.`
    ], count);
  };
  solvers['sm3-foldrect'] = p => {
    const v = p.typ === 'a' ? [8, 10, 6, 3, 5] : [9, 15, 12, 4, 5], [w, h, bf, ce, de] = v.map(x => x * p.j), fc = h - bf, a = p.kind === 0 ? ce : de;
    return pack([
      S`직사각형에서 $AB=${w},\ BF=${bf},\ FC=${fc}$예요. 접는 선 AE를 따라 D가 F에 포개져요.`,
      '접어도 각과 길이는 보존되어 ∠AFE=90°예요. ∠ABF=∠FCE=90°, ∠AFB=∠FEC이므로 △ABF ∽ △FCE예요.',
      S`대응변의 비 $AB:FC=BF:CE$에 현재 값을 넣으면 $${w}:${fc}=${bf}:CE$예요.`,
      p.kind === 0 ? S`$CE=${F(`${bf}\times${fc}`, w)}=${ce}$예요.` : S`$DE=DC-CE=${w}-${ce}=${de}$예요. 구하는 선분이 CE인지 DE인지 마지막에 확인해요.`
    ], a, { x: a });
  };
  solvers['sm3-foldequi'] = p => {
    const g0 = G.geo.eqGeo('off', 30, 1), g = p.flip ? G.geo.mirrorEq(g0) : g0, a = p.kind === 0 ? g.CE : g.EF;
    return pack([
      S`정삼각형을 접어 A가 F에 겹쳐요. $BD=${g.BD},\ BF=${g.BF}$${p.kind === 0 ? `, FC=${g.FC}` : `, AD=${g.DA}`}를 확인해요.`,
      '∠DBF=∠FCE=60°이고 접기로 생긴 각을 비교하면 ∠BDF=∠CFE예요. 따라서 △DBF ∽ △FCE예요.',
      p.kind === 0 ? S`$BD:FC=BF:CE$이므로 $${g.BD}:${g.FC}=${g.BF}:CE$예요.` : S`$BC=BD+AD=${g.BD}+${g.DA}=30$이고 $FC=30-${g.BF}=${g.FC}$예요. $BD:FC=BF:CE$를 사용해요.`,
      p.kind === 0 ? S`$CE=${F(`${g.BF}\times${g.FC}`, g.BD)}=${a}$예요.` : S`$CE=${F(`${g.BF}\times${g.FC}`, g.BD)}=${g.CE}$예요. $EF=EA=AC-CE=30-${g.CE}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm3-trap'] = p => {
    const a = p.kind === 0 ? p.a * p.bb * p.c : p.bb ** 2 * p.c;
    return pack([
      p.kind === 0 ? S`평행한 두 밑변 AD, BC 사이에서 위 삼각형의 넓이는 ${p.a ** 2 * p.c}, 아래 삼각형의 넓이는 ${p.bb ** 2 * p.c}예요.` : S`$AD=${2 * p.a},\ BC=${2 * p.bb}$이고 △AOD의 넓이는 ${p.a ** 2 * p.c}예요.`,
      '맞꼭지각과 평행선의 엇각으로 △AOD ∽ △COB예요. 대응하는 길이는 밑변 AD↔CB와 AO↔CO예요.',
      p.kind === 0 ? S`넓이의 비는 $${p.a ** 2}:${p.bb ** 2}=${p.a}^{2}:${p.bb}^{2}$이므로 $AO:OC=${p.a}:${p.bb}$예요. △AOD와 △COD는 D에서 AC까지의 높이가 같아요.` : S`닮음비 $${p.a}:${p.bb}$의 제곱이 넓이의 비이므로 $S_{AOD}:S_{COB}=${p.a ** 2}:${p.bb ** 2}$예요.`,
      p.kind === 0 ? S`따라서 $S_{COD}=${p.a ** 2 * p.c}\times${F(p.bb, p.a)}=${a}$예요. 양옆 두 삼각형의 넓이도 서로 같아요.` : S`$S_{COB}=${p.a ** 2 * p.c}\times${F(p.bb ** 2, p.a ** 2)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm4-conv'] = p => {
    const d = G.ri(G.seeded('f1d' + p.seed), 1, p.N - 1), ae = p.q * d, de = p.rr * d, a = p.kind === 0 ? p.q * (p.N - d) : p.kind === 1 ? de : ae + de;
    return pack([
      S`$AD=${p.p * d},\ DB=${p.p * (p.N - d)}$이므로 $AB=${p.p * p.N}$예요. DE ∥ BC를 확인해요.`,
      '동위각과 공통각으로 △ADE ∽ △ABC예요. 전체 길이 AB와 조각 DB를 구별해요.',
      S`$AD:AB=AE:AC=DE:BC=${d}:${p.N}$이고, $AD:DB=AE:EC=${d}:${p.N - d}$도 성립해요.`,
      p.kind === 0 ? S`$EC=${ae}\times${F(p.N - d, d)}=${a}$예요.` : p.kind === 1 ? S`$DE=${p.rr * p.N}\times${F(d, p.N)}=${a}$예요.` : S`$x=AE=${ae},\ y=DE=${de}$이므로 $x+y=${ae}+${de}=${a}$예요.`
    ], a, p.kind === 2 ? { x: ae, y: de } : { x: a });
  };
  solvers['sm4-x'] = p => {
    const g = G.geo.xGeo(p.m, p.n, p.r), a = p.kind === 0 ? g.BC : g.OA;
    return pack([
      p.kind === 0 ? S`$OA=${g.OA},\ OC=${g.OC},\ AD=${g.AD}$이고 AD ∥ BC예요.` : S`$OC=${g.OC},\ OD=${g.OD},\ OB=${g.OB}$이고 OA=x예요.`,
      'O에서 맞꼭지각이 같고 평행선의 엇각이 같으므로 △OAD ∽ △OCB예요. A↔C, D↔B를 표시해요.',
      S`$OA:OC=OD:OB=AD:CB=${p.m}:${p.n}$이에요. 같은 쪽에 있는 선분끼리 짝짓지 않아요.`,
      p.kind === 0 ? S`$BC=${g.AD}\times${F(g.OC, g.OA)}=${a}$예요.` : S`$OA=${g.OC}\times${F(g.OD, g.OB)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm4-ef'] = p => {
    const g = G.geo.efGeo(p.m, p.n), a = p.kind === 0 ? g.EF : g.EO;
    return pack([
      S`평행한 밑변의 길이는 $AD=${g.AD},\ BC=${g.BC}$예요. EF는 두 대각선의 교점 O를 지나고 밑변과 평행해요.`,
      S`△AOD ∽ △COB이므로 $AO:OC=AD:BC=${p.m}:${p.n}$, 따라서 $AO:AC=${p.m}:${p.m + p.n}$이에요.`,
      S`△AEO ∽ △ABC에서 $EO:BC=AO:AC$이므로 $EO=${g.BC}\times${F(p.m, p.m + p.n)}=${g.EO}$예요.`,
      p.kind === 0 ? S`△DFO ∽ △DCB에서도 $OF=${g.EO}$예요. 따라서 $EF=EO+OF=${g.EO}+${g.EO}=${a}$예요.` : S`구하는 것은 EF 전체가 아니라 EO이므로 $x=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm4-mid'] = p => {
    const a = p.kind === 0 ? p.r : p.kind === 1 ? 2 * p.r : p.p + p.q + p.r;
    return pack([
      'D는 AB의 중점, E는 AC의 중점이므로 AD=DB, AE=EC를 같은 길이 눈금으로 표시해요.',
      S`$AD:AB=AE:AC=1:2$이고 ∠A는 공통이므로 △ADE ∽ △ABC (SAS)예요.`,
      S`중점연결정리에 따라 DE ∥ BC이고 $DE:BC=1:2$예요. 둘레의 비도 $1:2$예요.`,
      p.kind === 0 ? S`$DE=${F(2 * p.r, 2)}=${a}$예요.` : p.kind === 1 ? S`$BC=2\times${p.r}=${a}$예요.` : S`△ADE의 둘레 $=${F(`${2 * p.p}+${2 * p.q}+${2 * p.r}`, 2)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm4-four'] = p => {
    const a = p.kind === 0 ? 12 * p.t : 6 * p.t ** 2;
    return pack([
      'D, E, F는 각각 AB, BC, CA의 중점이에요. 같은 변 위의 두 조각에 같은 눈금을 표시해요.',
      S`중점연결정리로 $DE=${F(1, 2)}AC,\ EF=${F(1, 2)}AB,\ FD=${F(1, 2)}BC$예요.`,
      p.kind === 0 ? S`세 변 길이는 각각 $${4 * p.t},\ ${3 * p.t},\ ${5 * p.t}$예요. 둘레는 이 세 길이를 더해요.` : S`네 작은 삼각형은 SSS 합동이에요. △ABC의 넓이는 $${F(`${6 * p.t}\times${8 * p.t}`, 2)}=${24 * p.t ** 2}$예요.`,
      p.kind === 0 ? S`△DEF의 둘레 $=${4 * p.t}+${3 * p.t}+${5 * p.t}=${a}$예요.` : S`△DEF의 넓이 $=${F(24 * p.t ** 2, 4)}=${a}$예요. 길이의 절반과 넓이의 4분의 1을 구별해요.`
    ], a, { x: a });
  };
  solvers['sm4-vari'] = p => {
    const a = p.kind === 0 ? p.a + p.bb : p.bb;
    return pack([
      'E, F, G, H는 사각형의 네 변의 중점이에요. 서로 다른 원래 변의 길이까지 같다는 뜻은 아니에요.',
      S`대각선 AC를 그으면 $EF=HG=${F(1, 2)}AC$이고, BD를 그으면 $FG=EH=${F(1, 2)}BD$예요.`,
      S`둘레 $=2\times${F(1, 2)}AC+2\times${F(1, 2)}BD=AC+BD$예요.`,
      p.kind === 0 ? S`따라서 둘레 $=${p.a}+${p.bb}=${a}$예요.` : S`주어진 둘레가 ${p.a + p.bb}이고 $AC=${p.a}$이므로 $BD=${p.a + p.bb}-${p.a}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm4-bis'] = p => {
    const a = p.kind === 0 ? p.m : p.kind === 1 ? p.n : ratio(p.m, p.n);
    return pack([
      S`$AB=${2 * p.m},\ AC=${2 * p.n}$이고 AD는 ∠A의 이등분선이에요. 두 작은 각을 같은 호로 표시해요.`,
      'C를 지나 AD와 평행한 직선을 그어 BA의 연장선과 E에서 만나게 해요. ∠ACE=∠AEC이므로 AC=AE예요.',
      S`평행선과 닮음으로 $BD:DC=AB:AC=${p.m}:${p.n}$이에요.`,
      p.kind === 0 ? S`$BC=${p.m + p.n}$이므로 $BD=${p.m + p.n}\times${F(p.m, p.m + p.n)}=${a}$예요.` : p.kind === 1 ? S`$BD=${p.m}$이므로 $DC=${p.m}\times${F(p.n, p.m)}=${a}$예요.` : S`따라서 $BD:DC=${ratio(p.m, p.n)}$이에요.`
    ], a, p.kind < 2 ? { x: a } : {});
  };
  solvers['sm4-bisx'] = p => {
    const m = p.n + p.g0, a = p.kind === 0 ? 2 * p.n : 2 * m;
    return pack([
      S`$AB=${m},\ AC=${p.n},\ BC=${2 * p.g0}$이고 AD는 A의 외각의 이등분선이에요. D는 BC의 연장선 위에 있어요.`,
      S`외각의 이등분선 성질로 $BD:CD=AB:AC=${m}:${p.n}$이에요.`,
      S`D가 C 바깥에 있으므로 $BD-CD=BC=${2 * p.g0}$예요. 비의 두 항의 차 ${m}-${p.n}=${p.g0}이 BC에 해당해요.`,
      S`한 단위는 $${2 * p.g0}\div${p.g0}=2$이므로 ${p.kind === 0 ? 'CD' : 'BD'} $=2\times${p.kind === 0 ? p.n : m}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm5-lmn'] = p => {
    const a = p.kind === 0 ? p.bb * p.u : p.kind === 1 ? p.bb : p.a * p.u;
    return pack([
      '세 직선 l, m, n이 평행해요. 두 가로지르는 직선에서 같은 평행선 사이의 조각 AB↔DE, BC↔EF를 대응시켜요.',
      'A에서 DF와 평행한 보조선을 그으면 평행사변형의 같은 변과 닮은 삼각형을 이용할 수 있어요.',
      S`따라서 $AB:BC=DE:EF$이고 $AB:AC=DE:DF$도 성립해요.`,
      p.kind === 0 ? S`$EF=${p.a * p.u}\times${F(p.bb, p.a)}=${a}$예요.` : p.kind === 1 ? S`$BC=${p.a}\times${F(p.bb * p.u, p.a * p.u)}=${a}$예요.` : S`$DE=${(p.a + p.bb) * p.u}\times${F(p.a, p.a + p.bb)}=${a}$예요. DF는 DE+EF 전체예요.`
    ], a, { x: a });
  };
  solvers['sm5-trap'] = p => {
    const bc = p.a + (p.m + p.n) * p.t, ef = p.a + p.m * p.t, a = p.kind === 0 ? ef : bc;
    return pack([
      S`$AD=${p.a},\ AE=${2 * p.m},\ EB=${2 * p.n}$이고 AD ∥ EF ∥ BC예요.`,
      'A에서 DC와 평행한 선을 그어 EF와 G, BC와 H에서 만나게 해요. 평행사변형이므로 GF=HC=AD예요.',
      S`△AEG ∽ △ABH에서 $EG:BH=AE:AB=${p.m}:${p.m + p.n}$이에요. $EG=EF-AD$, $BH=BC-AD$를 사용해요.`,
      p.kind === 0 ? S`$EG=(${bc}-${p.a})\times${F(p.m, p.m + p.n)}=${p.m * p.t}$이므로 $EF=${p.a}+${p.m * p.t}=${a}$예요.` : S`$BH=(${ef}-${p.a})\times${F(p.m + p.n, p.m)}=${(p.m + p.n) * p.t}$이므로 $BC=${p.a}+${(p.m + p.n) * p.t}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm5-tmid'] = p => {
    const a = p.kind === 0 ? p.a0 + p.b0 : p.kind === 1 ? 2 * p.b0 : p.b0 - p.a0;
    return pack([
      'E, F가 두 옆변의 중점이고 AD ∥ BC예요. 대각선과 EF의 교점을 P, Q로 두어요.',
      S`중점연결정리에 의해 $EP=QF=${F(2 * p.a0, 2)}=${p.a0}$이고, $EQ=${F(2 * p.b0, 2)}=${p.b0}$예요.`,
      S`따라서 $EF=${F('AD+BC', 2)}$이고, $PQ=${F('BC-AD', 2)}$예요.`,
      p.kind === 0 ? S`$EF=${F(`${2 * p.a0}+${2 * p.b0}`, 2)}=${a}$예요.` : p.kind === 1 ? S`$BC=2EF-AD=2\times${p.a0 + p.b0}-${2 * p.a0}=${a}$예요.` : S`$PQ=${p.b0}-${p.a0}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm6-trio'] = p => pack([
    'AH가 BC에 수직이므로 ∠BHA=∠AHC=90°예요. 원래 삼각형의 ∠BAC도 직각이에요.',
    '∠B는 △ABC와 △HBA가 공유하므로 △ABC ∽ △HBA (AA)예요. A↔H, B↔B, C↔A 순서예요.',
    '∠C도 공유하므로 △ABC ∽ △HAC예요. 따라서 △HBA ∽ △HAC에서 H↔H, B↔A, A↔C예요.',
    p.kind === 0 ? '△ABC와 △HBA에서 C↔A이므로 ∠BAH와 같은 각은 ∠C예요.' : S`$BH\leftrightarrow AH$, $AH\leftrightarrow CH$이므로 $BH:AH=AH:CH$예요. x에 들어갈 선분은 CH예요.`
  ], p.kind === 0 ? 'angle C' : 'CH');
  for (const [id, nm] of [['sm6-ab2', 'AB'], ['sm6-ac2', 'AC'], ['sm6-ah2', 'AH']]) solvers[id] = p => {
    const isH = nm === 'AH', isB = nm === 'AB', small = isH || isB ? p.b : p.c, whole = isH ? p.c : p.b + p.c;
    const a = p.kind === 0 ? small * whole : (isB ? 9 : 16) * p.t;
    const proof = isH ? '△HBA ∽ △HAC' : isB ? '△ABC ∽ △HBA' : '△ABC ∽ △HAC';
    const relation = isH ? S`BH:AH=AH:CH` : isB ? S`AB:BH=BC:AB` : S`AC:CH=BC:AC`;
    const product = isH ? S`BH\times CH` : isB ? S`BH\times BC` : S`CH\times BC`;
    return pack([
      p.kind === 0 ? S`$BH=${p.b},\ CH=${p.c}$이므로 $BC=${p.b + p.c}$예요. 지금은 ${nm}의 길이가 아니라 제곱의 값을 구해요.` : S`그림의 ${isH ? `AH=${12 * p.t}, BH=${9 * p.t}` : `${nm}=${(isB ? 15 : 20) * p.t}, BC=${25 * p.t}`}와 직각·수선을 확인해요.`,
      `${proof}이에요. 직각끼리, 같은 예각끼리 대응하도록 표시해요.`,
      S`$${relation}$에서 내항의 곱과 외항의 곱이 같으므로 $${nm}^{2}=${product}$예요.`,
      p.kind === 0 ? S`$${nm}^{2}=${small}\times${whole}=${a}$예요. 제곱의 값으로 답하면 돼요.` : S`$x=${F(`${(isH ? 12 : isB ? 15 : 20) * p.t}^{2}`, (isH ? 9 : 25) * p.t)}=${a}$예요.`
    ], a, p.kind === 1 ? { x: a } : {});
  };
  solvers['sm6-area'] = p => {
    const ab = 15 * p.t, ac = 20 * p.t, bc = 25 * p.t, ah = 12 * p.t, a = p.kind === 0 ? ah : bc;
    return pack([
      S`직각을 낀 두 변은 $AB=${ab},\ AC=${ac}$예요. A에서 BC에 내린 수선의 발은 H예요.`,
      S`AB를 밑변, AC를 높이로 보면 넓이는 $${F(`${ab}\times${ac}`, 2)}=${ab * ac / 2}$예요.`,
      S`BC를 밑변, AH를 높이로 보아도 같은 넓이이므로 $AB\times AC=BC\times AH$예요.`,
      p.kind === 0 ? S`$AH=${F(`${ab}\times${ac}`, bc)}=${a}$예요.` : S`$BC=${F(`${ab}\times${ac}`, ah)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm7-shadow'] = p => {
    const a = p.kind === 0 ? p.h * p.k : p.s;
    return pack([
      S`작은 막대의 높이는 ${p.h}이고, ${p.kind === 0 ? `작은 그림자는 ${p.s}, 큰 그림자는 ${p.s * p.k}` : `나무 높이는 ${p.h * p.k}, 큰 그림자는 ${p.s * p.k}`}예요.`,
      '막대와 나무는 땅에 수직이고 햇빛의 방향이 같아요. 두 직각삼각형은 AA 닮음이에요.',
      '높이끼리, 그림자 길이끼리 대응해요. (작은 높이) : (큰 높이) = (작은 그림자) : (큰 그림자)예요.',
      p.kind === 0 ? S`$x=${p.h}\times${F(p.s * p.k, p.s)}=${a}$예요.` : S`$x=${p.s * p.k}\times${F(p.h, p.h * p.k)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm7-river'] = p => {
    const a = p.kind === 0 ? p.m * p.w : p.n * p.u;
    return pack([
      S`그림에서 $${p.kind === 0 ? `QD=${p.m * p.u},\ AD=${p.n * p.u},\ AE=${p.n * p.w}` : `PQ=${p.m * p.w},\ QD=${p.m * p.u},\ AE=${p.n * p.w}`}$를 확인해요.`,
      'PQ와 AE가 각각 땅에 수직이고 D에서 맞꼭지각이 같으므로 △PQD ∽ △EAD예요.',
      S`대응은 P↔E, Q↔A, D↔D예요. 따라서 $PQ:EA=QD:AD$로 비례식을 세워요.`,
      p.kind === 0 ? S`$PQ=${p.n * p.w}\times${F(p.m * p.u, p.n * p.u)}=${a}$예요.` : S`$AD=${p.m * p.u}\times${F(p.n * p.w, p.m * p.w)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm8-proof'] = p => {
    const a = p.kind === 0 || p.kind === 2 ? p.t : p.s;
    return pack([
      'D, E가 각각 BC, AC의 중점이고 두 중선 AD, BE가 G에서 만나요.',
      S`중점연결정리로 DE ∥ AB이고 $DE:AB=1:2$예요. 따라서 △GDE ∽ △GAB예요.`,
      S`대응비 $GD:GA=GE:GB=1:2$에서 중선은 꼭짓점 쪽 : 중점 쪽 $=2:1$로 나뉘어요.`,
      p.kind === 0 ? S`$AD=${3 * p.t}$이므로 $GD=${3 * p.t}\times${F(1, 3)}=${a}$예요.` : p.kind === 1 ? S`$BG=${2 * p.s}$이므로 $GE=${F(2 * p.s, 2)}=${a}$예요.` : S`$AG=${2 * p.t}$이므로 $GD=${F(2 * p.t, 2)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm8-six'] = p => {
    const a = p.kind === 0 ? p.u : p.kind === 1 ? 6 * p.u : 2 * p.u;
    return pack([
      '세 중선은 무게중심 G에서 만나요. 각 중점이 변을 반으로 나누므로 같은 높이를 가진 작은 삼각형을 짝지을 수 있어요.',
      S`$S_{GBD}=S_{GCD}$이고, 나머지 두 변에서도 같은 관계가 성립해요.`,
      S`무게중심이 중선을 $2:1$로 나누므로 여섯 작은 삼각형의 넓이는 모두 같고, 각각 전체의 $${F(1, 6)}$이에요.`,
      p.kind === 0 ? S`$S_{GBD}=${F(6 * p.u, 6)}=${a}$예요.` : p.kind === 1 ? S`작은 삼각형 하나의 넓이가 ${p.u}이므로 전체 넓이는 $6\times${p.u}=${a}$예요.` : S`□AFGE는 작은 삼각형 두 개이므로 넓이는 $${6 * p.u}\times${F(2, 6)}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm8-gg'] = p => {
    const a = p.kind === 0 ? 2 * p.k : 6 * p.k;
    return pack([
      'D는 BC의 중점, P는 BD의 중점, Q는 DC의 중점이에요. G, G′는 각각 △ABD, △ADC의 무게중심이에요.',
      S`$BP=PD=DQ=QC$이므로 $PQ=${F(1, 2)}BC$예요.`,
      S`$AG:AP=AG^{\prime}:AQ=2:3$이고 ∠A는 공통이므로 △AGG′ ∽ △APQ예요. $GG^{\prime}=${F(2, 3)}PQ=${F(1, 3)}BC$예요.`,
      p.kind === 0 ? S`$GG^{\prime}=${F(6 * p.k, 3)}=${a}$예요.` : S`$BC=3GG^{\prime}=3\times${2 * p.k}=${a}$예요.`
    ], a, { x: a });
  };
  solvers['sm8-chain'] = p => {
    const a = p.kind === 0 ? p.c : 18 * p.c;
    return pack([
      'G는 △ABC의 무게중심이고, G′는 △GBC의 무게중심이에요. D는 BC의 중점이에요.',
      S`첫 번째 무게중심에서 $S_{GBC}=${F(1, 3)}S_{ABC}$예요. 같은 밑변 BC에 대한 높이가 3분의 1이에요.`,
      S`두 번째 무게중심에서도 $S_{G^{\prime}BC}=${F(1, 3)}S_{GBC}$예요. 또 $BD=DC$이므로 $S_{G^{\prime}BD}=${F(1, 2)}S_{G^{\prime}BC}$예요.`,
      p.kind === 0 ? S`$S_{G^{\prime}BD}=${18 * p.c}\times${F(1, 3)}\times${F(1, 3)}\times${F(1, 2)}=${a}$예요.` : S`$S_{G^{\prime}BD}=${F(1, 18)}S_{ABC}$이므로 $S_{ABC}=18\times${p.c}=${a}$예요.`
    ], a, { x: a });
  };
  G.solveQuestion = function (id, p, Q) {
    if (!solvers[id]) throw new Error('Missing current-question solution: ' + id);
    const out = solvers[id](p), choice = Q.choices.find(c => c.ok);
    out.steps.push(`따라서 답은 ${choice.h != null ? choice.h : '$' + choice.t + '$'}이에요. 문제에서 구한 길이·넓이·비의 종류를 다시 확인해요.`);
    return out;
  };

  // Geometry overlays intentionally live in this unit, using the same geometry
  // functions and the same generated values as each existing problem drawing.
  const { pt, add, mul, mid, lerp, centroid, line, poly, fillPoly, ang, T, tick, par, sideTag, bboxOf, fit } = G;
  function tri(b, P, color) { fillPoly(b, P, color, .08); poly(b, P, color, 3.8); }
  function pair(b, g, left, right, stage) {
    if (stage === 2) tri(b, left.map(k => g[k]), 'sky');
    if (stage >= 3) { tri(b, left.map(k => g[k]), 'sky'); tri(b, right.map(k => g[k]), 'green'); }
  }
  const equal = (b, V, A, B, n = 1) => ang(b, V, A, B, { color: 'rose', rings: n, r: 21, fa: .09 });
  function geometry(id, p) {
    const g = G.geo;
    switch (id) {
      case 'sm3-par': return g.parGeo(p.m, p.k, p.r);
      case 'sm3-flip': return g.flipGeo(p.m, p.n, p.r);
      case 'sm3-rot': return g.rotGeo(p.m, p.n, 210, 0);
      case 'sm3-sas': return g.sasGeo(p.m, p.n, p.q, p.a);
      case 'sm3-multi': return g.multiGeo(p.a, p.bb, p.c, p.r);
      case 'sm3-trap': return g.trapGeo(p.a, p.bb, p.c);
      case 'sm4-conv': {
        const d = G.ri(G.seeded('f1d' + p.seed), 1, p.N - 1), t = G.triTop(p.rr * p.N, p.q * p.N, p.p * p.N);
        return { ...t, D: lerp(t.A, t.B, d / p.N), E: lerp(t.A, t.C, d / p.N) };
      }
      case 'sm4-x': return g.xGeo(p.m, p.n, p.r);
      case 'sm4-ef': return g.efGeo(p.m, p.n);
      case 'sm4-mid': return g.midGeo(p.p, p.q, p.r);
      case 'sm4-four': return g.fourGeo(p.t);
      case 'sm4-vari': return g.vGeo(p.a, p.bb, p.th);
      case 'sm4-bis': return g.bisGeo(p.m, p.n);
      case 'sm4-bisx': return g.bisxGeo(p.n, p.g0);
      case 'sm5-lmn': return g.lmnGeo(p.a, p.bb, p.u);
      case 'sm5-trap': return g.trGeo(p.a, p.m, p.n, p.t);
      case 'sm5-tmid': return g.midTrGeo(p.a0, p.b0);
      case 'sm6-trio': return g.rtGeo(p.b, p.c);
      case 'sm6-ab2': case 'sm6-ac2': case 'sm6-ah2': return p.kind === 0 ? g.rtGeo(p.b, p.c) : g.rtGeo(9 * p.t, 16 * p.t);
      case 'sm6-area': return g.rtGeo(9 * p.t, 16 * p.t);
      case 'sm7-shadow': return g.shGeo(p.h, p.s, p.k);
      case 'sm7-river': return g.rvGeo(p.m, p.n, p.u, p.w);
      case 'sm8-proof': return g.cpGeo(p.t, p.s, p.th);
      case 'sm8-six': return g.sixGeo({}, true, p.u);
      case 'sm8-gg': return g.ggGeo({}, true, p.k);
      case 'sm8-chain': return g.chGeo({}, true, p.c);
      default: return null;
    }
  }
  G.drawSolution = function (b, D, s, M, C, sol) {
    const stage = Math.max(1, C.step || 1), p = M.pk, final = stage >= sol.steps.length;
    const originalText = b.text;
    // Only the queried labels become numbers at the final step. In x+y problems,
    // each label receives its own length, never the sum used by the answer choice.
    b.text = function (at, str, options) {
      let out = String(str);
      if (final) out = out.replace(/\b([xy])\b/g, (m, k) => sol.targets[k] == null ? m : String(sol.targets[k]));
      return originalText.call(b, at, out, options);
    };
    try {
      D.draw(b, s, M, { ...C, problem: true, review: false, full: false, step: 0, solution: true, solStep: stage, final, t: stage >= 3 ? 1 : 0 });
      if (stage < 2) return;
      const g = geometry(D.id, p);
      switch (D.id) {
        case 'sm1-corr': {
          const gap = 1.5 * Math.max(p.m, p.n) + 1.5, left = G.geo.trap(p.m, 0), right = G.geo.trap(p.n, 6 * p.m + gap);
          const sides = stage < 3 ? [p.kind === 2 ? 0 : p.given] : p.kind === 2 ? [0, 1, 2, 3] : [p.ask];
          for (const i of sides) { line(b, left[i], left[(i + 1) % 4], 'sky', 4.8); line(b, right[i], right[(i + 1) % 4], 'green', 4.8); }
          break;
        }
        case 'sm1-len': {
          const left = [pt(0, 0), pt(p.p * p.m, 0), pt(p.p * p.m, -p.q * p.m)], x2 = p.p * p.m + 3.8;
          const right = [pt(x2, 0), pt(x2 + p.p * p.n, 0), pt(x2 + p.p * p.n, -p.q * p.n)];
          const i = stage < 3 ? (p.ask === 0 ? 1 : 0) : p.ask;
          line(b, left[i], left[i + 1], 'sky', 4.8); line(b, right[i], right[i + 1], 'green', 4.8);
          break;
        }
        case 'sm1-always': {
          // The first two reasoning stages give every option the same treatment.
          // The selected family is marked only when the final answer is reached.
          if (final) {
            const i = p.items.findIndex(t => p.askAlways ? always.includes(t) : !always.includes(t)), cols = G.phone(b) ? 2 : 5;
            const center = pt((G.phone(b) ? 7.4 : 3.4) * (i % cols), 4 * Math.floor(i / cols) - 1.1);
            b.circle(center, 1.55, { color: 'amber', width: 3.5, dash: [6, 4] });
          }
          break;
        }
        case 'sm2-tile': {
          const a = 3.8 * p.p / p.q, z = 3.8, x2 = a + 1.4, h = Math.sqrt(3) / 2;
          for (const [x, w, c] of [[0, a, 'sky'], [x2, z, 'green']]) {
            line(b, pt(x, 0), pt(x + w, 0), c, 4.5);
            line(b, pt(x + w / 2, 0), pt(x + w / 2, -w * h), 'violet', 2.5, { dash: [6, 5] });
            b.right(pt(x + w / 2, 0), pt(x, 0), pt(x + w / 2, -w * h), { size: 12, color: 'violet' });
            if (stage >= 3) line(b, pt(x + w / 4, -w * h / 2), pt(x + w * 3 / 4, -w * h / 2), c, 1.6, { dash: [3, 4], alpha: .65 });
          }
          break;
        }
        case 'sm2-cube': case 'sm2-solid': {
          const cube = D.id === 'sm2-cube', k1 = cube ? p.kind === 0 ? 1 : p.p : p.m, k2 = cube ? p.kind === 0 ? p.k : p.q : p.n;
          const extent = cube ? G.geo.cubeExt : G.geo.boxExt, e1 = extent(k1), gap = cube ? 1.5 : 1.6 + .2 * p.n, x2 = e1.w + gap;
          for (const [ox, k, color] of [[0, k1, 'sky'], [x2, k2, 'green']]) {
            const w = k, h = (cube ? 1 : 3) * k, d = (cube ? 1 : 2) * k, P = (x, y, z) => G.geo.cubeP(ox, x, y, z);
            const front = [P(0, 0, 0), P(w, 0, 0), P(w, h, 0), P(0, h, 0)];
            poly(b, front, color, 4);
            if (stage >= 3) { line(b, P(w, h, 0), P(w, h, d), color, 4); line(b, P(w, 0, 0), P(w, 0, d), color, 4); line(b, P(0, h, 0), P(0, h, d), color, 4); }
          }
          break;
        }
        case 'sm2-cone': {
          const heights = [p.h1, p.h1 + p.h2, p.h1 + p.h2 + p.h3];
          const top = pt(0, 0), z = heights[stage < 3 ? 0 : 1];
          line(b, top, pt(-z / 2, z), 'sky', 4); line(b, top, pt(z / 2, z), 'sky', 4);
          line(b, pt(-z / 2, z), pt(z / 2, z), 'violet', 2.8, { dash: [6, 4] });
          if (stage >= 3) { const h = heights[0]; line(b, pt(-h / 2, h), pt(h / 2, h), 'rose', 3); }
          break;
        }
        case 'sm3-sas':
          // SAS uses the two side ratios and the single common included angle.
          // Adding all later corresponding angles crowds a small nested triangle
          // and obscures the condition that this stage is actually explaining.
          pair(b, g, ['A', 'D', 'E'], ['A', 'B', 'C'], stage);
          break;
        case 'sm3-par': case 'sm4-conv': case 'sm4-mid':
          pair(b, g, ['A', 'D', 'E'], ['A', 'B', 'C'], stage);
          equal(b, g.D, g.A, g.E, 1); equal(b, g.B, g.A, g.C, 1);
          if (stage >= 3) { equal(b, g.E, g.A, g.D, 2); equal(b, g.C, g.A, g.B, 2); }
          break;
        case 'sm3-ssa': {
          const q = G.geo.ssaGeo(p.kind === 0 ? p.a : p.c * .75, p.c, 30), h = mul(q.u, p.c * Math.cos(Math.PI / 6));
          line(b, q.B, h, 'violet', 2.8, { dash: [6, 4] }); b.right(h, q.B, q.A, { color: 'violet', size: 14 });
          T(b, h, 'H', { dy: -20, color: 'violet' }); T(b, mid(q.B, h), F(p.c, 2), { dx: 20, color: 'violet' });
          if (stage >= 3 && p.kind === 1) {
            for (const [i, point] of [q.C1, q.C2].entries()) if (point) { line(b, q.B, point, i ? 'green' : 'sky', 3, { dash: [6, 4] }); b.point(point, { color: i ? 'green' : 'sky', r: 5 }); T(b, point, i ? 'C′' : 'C', { dx: i ? 10 : -10, dy: -17 }); }
          }
          break;
        }
        case 'sm3-foldrect': {
          const q = G.geo.foldGeo(p.typ, p.j, 1);
          if (stage === 2) { line(b, q.A, q.D, 'sky', 4, { dash: [6, 4] }); line(b, q.D, q.E, 'sky', 4, { dash: [6, 4] }); line(b, q.A, q.F, 'green', 4); line(b, q.F, q.E, 'green', 4); }
          else { pair(b, q, ['A', 'B', 'F'], ['F', 'C', 'E'], 3); equal(b, q.F, q.B, q.A, 2); equal(b, q.E, q.C, q.F, 2); }
          break;
        }
        case 'sm3-foldequi': {
          let q = G.geo.eqGeo('off', 30, 1); if (p.flip) q = G.geo.mirrorEq(q);
          if (stage === 2) { line(b, q.D, q.A, 'sky', 4, { dash: [6, 4] }); line(b, q.A, q.E, 'sky', 4, { dash: [6, 4] }); line(b, q.D, q.F, 'green', 4); line(b, q.F, q.E, 'green', 4); }
          else { pair(b, q, ['D', 'B', 'F'], ['F', 'C', 'E'], 3); equal(b, q.F, q.B, q.D, 2); equal(b, q.E, q.C, q.F, 2); }
          break;
        }
        case 'sm3-flip':
          pair(b, g, ['A', 'D', 'E'], ['A', 'C', 'B'], stage);
          equal(b, g.D, g.A, g.E); equal(b, g.C, g.A, g.B);
          if (stage >= 3) { equal(b, g.E, g.A, g.D, 2); equal(b, g.B, g.A, g.C, 2); }
          break;
        case 'sm3-multi':
          pair(b, g, ['A', 'D', 'E'], stage === 2 ? ['A', 'F', 'Gp'] : ['A', 'B', 'C'], stage);
          if (stage >= 3) { line(b, g.F, g.Gp, 'violet', 3.5); equal(b, g.D, g.A, g.E); equal(b, g.F, g.A, g.Gp); equal(b, g.B, g.A, g.C); }
          break;
        case 'sm3-trap':
          pair(b, g, ['A', 'O', 'D'], ['C', 'O', 'B'], stage);
          if (stage >= 4 && p.kind === 0) tri(b, [g.C, g.O, g.D], 'amber');
          break;
        case 'sm4-x':
          // The generated ratio can run in either direction; sky stays the smaller triangle.
          pair(b, g, p.m <= p.n ? ['O', 'A', 'D'] : ['O', 'C', 'B'], p.m <= p.n ? ['O', 'C', 'B'] : ['O', 'A', 'D'], stage);
          // The original diagram uses rose/one for A↔C and violet/two for D↔B.
          equal(b, g.O, g.A, g.D, 3); equal(b, g.O, g.C, g.B, 3);
          break;
        case 'sm4-ef':
          if (stage === 2) pair(b, g, p.m <= p.n ? ['A', 'O', 'D'] : ['C', 'O', 'B'], p.m <= p.n ? ['C', 'O', 'B'] : ['A', 'O', 'D'], 3);
          else if (stage >= 4 && p.kind === 0) pair(b, g, ['D', 'O', 'F'], ['D', 'B', 'C'], 3);
          else pair(b, g, ['A', 'E', 'O'], ['A', 'B', 'C'], 3);
          if (stage >= 4 && p.kind === 0) { line(b, g.O, g.F, 'sky', 4); T(b, mid(g.O, g.F), String(g.EO), { dy: -20, color: 'sky' }); }
          break;
        case 'sm4-four':
          line(b, g.D, g.E, 'sky', 4); line(b, g.A, g.C, 'sky', 4);
          if (stage >= 3) { line(b, g.E, g.F, 'green', 4); line(b, g.A, g.B, 'green', 4); tri(b, [g.D, g.E, g.F], 'amber'); }
          break;
        case 'sm4-vari':
          line(b, g.A, g.C, 'sky', 3, { dash: [6, 5] }); line(b, g.E, g.F, 'sky', 4); line(b, g.H, g.Gp, 'sky', 4);
          if (stage >= 3) { line(b, g.B, g.D, 'green', 3, { dash: [6, 5] }); line(b, g.F, g.Gp, 'green', 4); line(b, g.E, g.H, 'green', 4); }
          break;
        case 'sm4-bis':
          line(b, g.A, g.E, 'violet', 2.8, { dash: [6, 5] }); line(b, g.C, g.E, 'violet', 3);
          T(b, g.E, 'E', { dy: -18, color: 'violet' }); par(b, g.C, g.E); par(b, g.A, g.D);
          if (stage >= 3) { equal(b, g.C, g.A, g.E); equal(b, g.E, g.A, g.C); tick(b, g.A, g.C, 2, 'green'); tick(b, g.A, g.E, 2, 'green'); }
          break;
        case 'sm4-bisx':
          line(b, g.B, g.D, 'green', 3); line(b, g.C, g.D, 'sky', 4);
          equal(b, g.A, g.C, g.D); equal(b, g.A, g.D, g.E);
          if (stage >= 3) { line(b, g.B, g.C, 'violet', 4); T(b, mid(g.B, g.C), `BD − CD = ${2 * p.g0}`, { dy: 48, size: 14, color: 'violet' }); }
          break;
        case 'sm5-lmn':
          if (stage >= 3) pair(b, g, ['A', 'B', 'M'], ['A', 'C', 'N'], 3);
          break;
        case 'sm5-trap':
          if (stage >= 3) pair(b, g, ['A', 'E', 'Gp'], ['A', 'B', 'H'], 3);
          if (stage >= 4) { line(b, g.Gp, g.F, 'green', 4); line(b, g.H, g.C, 'green', 4); }
          break;
        case 'sm5-tmid':
          line(b, g.A, g.C, 'violet', 2.5, { dash: [6, 4] }); line(b, g.B, g.D, 'violet', 2.5, { dash: [6, 4] });
          if (p.kind !== 2) { T(b, g.Pp, 'P', { dy: 16, color: 'violet' }); T(b, g.Qp, 'Q', { dy: 16, color: 'violet' }); }
          if (stage >= 3) { line(b, g.E, g.Pp, 'sky', 4); line(b, g.Qp, g.F, 'sky', 4); line(b, g.Pp, g.Qp, 'green', 4); }
          break;
        case 'sm6-trio': case 'sm6-ab2': case 'sm6-ac2': case 'sm6-ah2': case 'sm6-area':
          if (D.id === 'sm6-area') {
            if (stage === 2) { line(b, g.A, g.B, 'sky', 4); line(b, g.A, g.C, 'sky', 4); }
            else { line(b, g.B, g.C, 'green', 4); line(b, g.A, g.H, 'violet', 4); }
          } else {
            const small = D.id === 'sm6-ac2' ? ['H', 'A', 'C'] : ['H', 'B', 'A'];
            const other = D.id === 'sm6-ah2' || D.id === 'sm6-trio' ? ['H', 'A', 'C'] : ['A', 'B', 'C'];
            pair(b, g, small, other, stage);
            equal(b, g.A, g.B, g.H); equal(b, g.C, g.A, g.B);
            if (stage >= 3) { equal(b, g.A, g.H, g.C, 2); equal(b, g.B, g.A, g.C, 2); }
            if (final && p.kind === 0 && D.id !== 'sm6-trio') { const nm = D.id === 'sm6-ab2' ? 'AB' : D.id === 'sm6-ac2' ? 'AC' : 'AH'; T(b, mid(g.A, g[nm[1]]), `${nm}² = ${sol.answer}`, { dx: nm === 'AB' ? -34 : 34, size: 16, color: 'amber' }); }
          }
          break;
        case 'sm7-shadow':
          pair(b, g, ['A', 'Atip', 'Atop'], ['Bb', 'Btip', 'Btop'], stage);
          equal(b, g.Atip, g.A, g.Atop); equal(b, g.Btip, g.Bb, g.Btop);
          break;
        case 'sm7-river':
          pair(b, g, p.m <= p.n ? ['P', 'Q', 'D'] : ['E', 'A', 'D'], p.m <= p.n ? ['E', 'A', 'D'] : ['P', 'Q', 'D'], stage);
          equal(b, g.D, g.P, g.Q); equal(b, g.D, g.E, g.A);
          break;
        case 'sm8-proof':
          pair(b, g, ['G', 'D', 'E'], ['G', 'A', 'B'], stage);
          equal(b, g.D, g.G, g.E); equal(b, g.A, g.G, g.B);
          if (stage >= 3) { line(b, g.G, g.D, 'sky', 4.5); line(b, g.G, g.A, 'green', 4.5); }
          break;
        case 'sm8-six': {
          const pieces = [[g.A, g.F, g.G], [g.F, g.B, g.G], [g.B, g.D, g.G], [g.D, g.C, g.G], [g.C, g.E, g.G], [g.E, g.A, g.G]];
          const indices = stage < 3 ? [2, 3] : [0, 1, 2, 3, 4, 5];
          for (const i of indices) { tri(b, pieces[i], i % 2 ? 'green' : 'sky'); if (stage >= 3 && p.kind !== 2) T(b, centroid(pieces[i]), F(1, 6), { color: i % 2 ? 'green' : 'sky', size: 13, dy: -20 }); }
          break;
        }
        case 'sm8-gg':
          line(b, g.P, g.Q, 'violet', 4.5);
          if (stage >= 3) pair(b, g, ['A', 'G', 'Gq'], ['A', 'P', 'Q'], 3);
          break;
        case 'sm8-chain':
          tri(b, stage === 2 ? [g.G, g.B, g.C] : stage === 3 ? [g.Gq, g.B, g.C] : [g.Gq, g.B, g.D], stage === 2 ? 'sky' : stage === 3 ? 'green' : 'amber');
          break;
      }
    } finally { b.text = originalText; }
  };
  G.solutionGeometry = geometry;
})();
