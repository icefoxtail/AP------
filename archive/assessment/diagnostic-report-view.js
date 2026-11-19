(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DiagnosticReportView = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // 진단평가 결과표의 화면 층. `DiagnosticReportData.computeDiagnosticReport`의 출력(숫자·목록)을 받아
  // 결과지 두 쪽의 HTML 문자열과 SVG를 만든다. 순수 함수이며 저장소·네트워크·DOM을 읽지 않는다.
  //
  //  * 문구 톤: 학생·학부모를 평가하는 말이 아니라 "학원이 이렇게 진행한다"로 쓴다.
  //  * 내부 용어(PT, TPL, bucket, UID)와 키 글자는 만들지 않는다. 이름이 없는 유형은 "유형 미분류"다.
  //  * 작은 표본: 문항이 MIN_N(3)개 미만인 칸(단계·단원·단원×단계·유형)은 판정 문구·색을 내지 않고 맞은 수/문항 수만 쓴다.
  //  * 단원 간 강약: 두 단원의 정답률 차이를 약한 단원의 문항 수로 환산해 2문항 이상일 때만 말한다.
  //  * 색만으로 구분하지 않는다: 문항 칸 O/X는 채움·테두리, 단원×단계 칸은 농도·빗금·숫자, 판단은 글자 태그가 함께 있다.

  const MIN_N = 3;
  const STABLE = 0.7;
  const MID = 0.4;
  const UNCLASSIFIED_TYPE = "유형 미분류";
  const UNCLASSIFIED_UNIT = "단원 미분류";
  const TYPE_ROWS_MAX = 10;
  const WRONG_SINGLE_MAX = 8;
  const WRONG_DOUBLE_MAX = 28;

  const GROUPS = Object.freeze([
    Object.freeze({ key: "1", k: "1단계", n: "기초" }),
    Object.freeze({ key: "2", k: "2단계", n: "기본" }),
    Object.freeze({ key: "3", k: "3단계", n: "응용" }),
    Object.freeze({ key: "45", k: "4~5단계", n: "심화" }),
  ]);

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const pct = (x) => Math.round(x * 100);
  const num = (value, fallback) => (Number.isFinite(value) ? value : fallback);
  const rateOf = (g) => (g && g.total ? g.correct / g.total : 0);

  // ---- 단계 묶음(1 · 2 · 3 · 4~5 · 단계 정보 없음) ----
  function levelGroups(report) {
    const out = GROUPS.map((def, i) => ({
      key: def.key, k: def.k, n: def.n,
      g: def.key === "45" ? report.band45 : report.byLevel[i],
    }));
    if (report.noLevel && report.noLevel.total) out.push({ key: "none", k: "단계 정보 없음", n: "", g: report.noLevel });
    return out.filter((x) => x.g.total > 0);
  }
  function levelVerdict(g) {
    if (g.total < MIN_N) return null;
    const r = rateOf(g);
    if (r >= STABLE) return { label: "안정", cls: "s" };
    if (r >= MID) return { label: "진행 중", cls: "p" };
    return { label: "도전 단계", cls: "w" };
  }

  // ---- 단원 ----
  function unitRows(report) {
    const order = new Map();
    for (const q of report.questions) {
      const unit = q.unit || "";
      const o = Number(q.meta && q.meta.unitOrder);
      if (!order.has(unit) || (Number.isFinite(o) && o < order.get(unit))) order.set(unit, Number.isFinite(o) ? o : 9999);
    }
    const rows = report.byUnit.groups.map((g) => ({ name: g.key, g, order: num(order.get(g.key), 9999) }));
    rows.sort((a, b) => a.order - b.order);
    if (report.byUnit.missing.total) rows.push({ name: UNCLASSIFIED_UNIT, g: report.byUnit.missing, order: 99999, unclassified: true });
    return rows.map((row) => ({ ...row, n: row.g.total, ok: row.g.correct, r: rateOf(row.g) }));
  }
  // 두 단원의 정답률 차이를 "약한 단원 문항 수로 환산한 정답 수 차이"가 2 이상일 때만 강약을 말한다.
  function unitJudgement(units) {
    const judged = units.filter((u) => !u.unclassified && u.n >= MIN_N);
    if (judged.length < 2) return null;
    const best = judged.reduce((a, b) => (b.r > a.r || (b.r === a.r && b.n > a.n) ? b : a));
    const worst = judged.reduce((a, b) => (b.r < a.r || (b.r === a.r && b.n - b.ok > a.n - a.ok) ? b : a));
    if (best === worst) return null;
    return (best.r - worst.r) * worst.n >= 2 - 1e-9 ? { best, worst } : null;
  }

  // ---- 유형 ----
  function typeRows(report) {
    const byNo = new Map(report.questions.map((q) => [q.no, q]));
    const labeled = [];
    const loose = { key: null, label: UNCLASSIFIED_TYPE, items: [] };
    for (const g of report.byProblemType.groups) {
      if (g.label) labeled.push({ key: g.key, label: g.label, items: g.items });
      else loose.items.push(...g.items);
    }
    loose.items.push(...report.byProblemType.missing.items);
    const all = labeled.slice();
    if (loose.items.length) all.push(loose);
    const rows = all.map((row) => {
      const items = row.items.slice().sort((a, b) => a.no - b.no);
      const ok = items.filter((it) => it.status === "correct").length;
      const wrong = items.filter((it) => it.status === "wrong").length;
      const units = [];
      const levels = new Set();
      for (const it of items) {
        const q = byNo.get(it.no);
        const unit = (q && q.unit) || UNCLASSIFIED_UNIT;
        if (!units.includes(unit)) units.push(unit);
        if (it.difficulty != null) levels.add(it.difficulty);
      }
      return {
        label: row.label, unclassified: row.key === null, items, n: items.length, ok, wrong, r: items.length ? ok / items.length : 0,
        unit: units.length > 1 ? `${units[0]} 외 ${units.length - 1}` : units[0] || UNCLASSIFIED_UNIT,
        levels: [...levels].sort((a, b) => a - b),
        firstNo: items.length ? items[0].no : 0,
      };
    });
    // 약한 순서: 틀린 문항이 많은 것 → 정답률이 낮은 것 → 문항이 많은 것 → 처음 나온 번호. 전부 맞은 유형은 번호 순으로 뒤에 둔다.
    rows.sort((a, b) => b.wrong - a.wrong || a.r - b.r || b.n - a.n || a.firstNo - b.firstNo);
    return rows;
  }
  function typeVerdict(row) {
    if (row.n < MIN_N) return null;
    if (row.wrong === 0) return { label: "안정", cls: "s" };
    if (row.ok === 0) return { label: "보완 권장", cls: "w" };
    return { label: "다시 확인", cls: "p" };
  }
  const levelText = (levels) => (levels.length ? levels.map((l) => (l >= 4 ? "4~5" : String(l))).filter((v, i, a) => a.indexOf(v) === i).join("·") : "–");

  // ---- 다음 4주 수업 계획: 틀린 문항을 낮은 단계 → 많이 틀린 유형 순으로 놓는다 ----
  function planOf(rows, reach, next, report) {
    const wrongTypes = rows.filter((r) => r.wrong > 0)
      .map((r) => {
        const wrongLevels = r.items.filter((it) => it.status === "wrong" && it.difficulty != null).map((it) => it.difficulty);
        return { ...r, level: wrongLevels.length ? Math.min(...wrongLevels) : 9 };
      })
      .sort((a, b) => a.level - b.level || b.wrong - a.wrong || a.firstNo - b.firstNo);
    const byNo = new Map(report.questions.map((q) => [q.no, q]));
    const unitOf = (r) => { const q = byNo.get(r.items.find((it) => it.status === "wrong").no); return (q && q.unit) || ""; };
    const levelName = (l) => (l >= 9 ? "단계 정보가 없는" : l >= 4 ? "4~5단계" : `${l}단계`);
    const out = [];
    const first = wrongTypes[0];
    if (first) {
      const unit = unitOf(first);
      const same = wrongTypes.filter((r) => unitOf(r) === unit).slice(0, 2).map((r) => r.label);
      const names = same.filter((n) => n !== UNCLASSIFIED_TYPE);
      out.push({
        wk: "1~2주차", title: `${unit || first.label} 다시 세우기`,
        body: `${names.length ? names.join(", ") + " 유형을 " : "틀린 문항의 풀이를 "}수업에서 다시 다룹니다. ${levelName(first.level)} 문제에서 틀린 것이 있어 가장 먼저 진행합니다.`,
      });
      const second = wrongTypes.find((r) => unitOf(r) !== unit) || wrongTypes.find((r) => r !== first && !same.includes(r.label));
      if (second) {
        const u2 = unitOf(second);
        out.push({
          wk: "3주차", title: second.unclassified ? `${u2 || "남은"} 문제 풀이` : second.label,
          body: `${levelName(second.level)} 문제를 풀이 과정을 끝까지 쓰는 방식으로 지도합니다. 식을 세우는 단계마다 이유를 말로 확인합니다.`,
        });
      } else {
        out.push({ wk: "3주차", title: "풀이 과정 쓰기", body: "같은 유형의 문제를 풀이 과정을 끝까지 쓰는 방식으로 지도합니다. 식을 세우는 단계마다 이유를 말로 확인합니다." });
      }
    } else {
      out.push({ wk: "1~2주차", title: "상위 단계로 넓히기", body: "틀린 문항이 없어 지금 단계의 문제를 빠르게 점검한 뒤, 한 단계 높은 문제로 수업을 시작합니다." });
      out.push({ wk: "3주차", title: "풀이 과정 쓰기", body: "어려운 문제일수록 풀이 과정을 끝까지 쓰는 방식으로 지도합니다." });
    }
    const target = next ? next.k : reach ? reach.k : "전체 단계";
    out.push({
      wk: "4주차", title: "확인 평가",
      body: next ? `같은 구성의 확인 평가로 ${target} 정답률을 다시 확인합니다.` : "같은 구성의 확인 평가로 전체 단계 정답률을 다시 확인합니다.",
    });
    return out;
  }

  // ---- 한 장짜리 모델 ----
  function buildViewModel(report) {
    const groups = levelGroups(report);
    const judged = groups.filter((x) => x.key !== "none" && x.g.total >= MIN_N);
    let reach = null;
    let next = null;
    for (const x of judged) {
      if (rateOf(x.g) >= STABLE) reach = x;
      else { next = x; break; }
    }
    const units = unitRows(report);
    const judge = unitJudgement(units);
    const types = typeRows(report);
    return { report, groups, judged, reach, next, units, judge, types, plan: planOf(types, reach, next, report) };
  }

  // ---- 1쪽 위: 도넛, 총평, 세 칸 ----
  function donutSvg(totals) {
    const r = 70, c = 2 * Math.PI * r;
    const f = (totals.total ? totals.correct / totals.total : 0) * c;
    const arc = totals.correct > 0 ? `<circle cx="85" cy="85" r="${r}" fill="none" stroke="var(--ok)" stroke-width="15" stroke-linecap="round" stroke-dasharray="${f.toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 85 85)"/>` : "";
    // 정답 0이면 호를 그리지 않는다(길이 0에 둥근 끝을 주면 12시 방향에 점 하나가 찍힌다).
    return `<svg viewBox="0 0 170 170" role="img" aria-label="정답 ${totals.correct} / ${totals.total}"><circle cx="85" cy="85" r="${r}" fill="none" stroke="var(--wash)" stroke-width="15"/>${arc}</svg>`;
  }
  function summaryHtml(vm) {
    const { reach, next, judge, judged } = vm;
    const bits = [];
    if (!judged.length) {
      bits.push("문항이 적어 단계별 판정은 하지 않고, 단계마다 맞힌 문항 수를 그대로 보여 드립니다.");
    } else if (reach && next) {
      bits.push(`<b>${reach.k}(${reach.n})까지는 안정적으로 해결합니다.</b> ${next.k}(${next.n})에서는 ${next.g.total}문항 중 ${next.g.correct}문항을 맞혀, 이 단계부터 수업에서 함께 다집니다.`);
    } else if (reach) {
      // 틀린 문항이 하나도 없으면 "틀린 문항이 있는 부분" 꼬리 문장은 틀린 말이라 뺀다.
      const wrongTail = vm.report.totals.wrong > 0 ? " 틀린 문항이 있는 부분은 아래 유형별 결과에서 수업 때 확인합니다." : "";
      bits.push(`<b>${reach.k}(${reach.n})까지 모두 안정적으로 해결합니다.</b>${wrongTail}`);
    } else if (next) {
      bits.push(`<b>${next.k}(${next.n})부터 수업을 시작합니다.</b> ${next.g.total}문항 중 ${next.g.correct}문항을 맞혔고, 쉬운 문제부터 차근차근 짚어 갑니다.`);
    }
    if (judge) bits.push(`단원 가운데 먼저 다질 곳은 <b>${esc(judge.worst.name)}</b>입니다.`);
    return bits.join(" ");
  }
  function factsHtml(vm) {
    const { reach, next, judged } = vm;
    const cell = (dt, dd) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`;
    if (!judged.length) {
      return cell("안정적으로 해결하는 단계", "판정 없음") + cell("보완을 시작할 단계", "판정 없음") + cell("권장 시작 수준", "상담에서 정함");
    }
    const last = judged[judged.length - 1];
    return cell("안정적으로 해결하는 단계", reach ? `${reach.k}까지` : "해당 단계 없음")
      + cell("보완을 시작할 단계", next ? `${next.k}부터` : "해당 단계 없음")
      + cell("권장 시작 수준", reach && next ? `${reach.n} → ${next.n} 연결` : next ? `${next.n} 수준부터` : `${last.n} 이후 확장`);
  }

  // ---- 단계별 성취 ----
  function levelsHtml(vm) {
    const cols = vm.groups.map((x) => `${Math.max(x.g.total, 3)}fr`).join(" ");
    const html = vm.groups.map((x) => {
      const g = x.g;
      const verdict = levelVerdict(g);
      const r = rateOf(g);
      const cells = g.items.map((it) => {
        const st = it.status;
        const ok = st === "correct";
        const mark = ok ? "정답" : st === "wrong" ? "오답" : "미입력";
        return `<span class="c ${ok ? "o" : st === "wrong" ? "x" : "u"}" title="${it.no}번 · ${mark}">${it.no}</span>`;
      }).join("");
      const meter = verdict
        ? `<div class="meter ${r < STABLE ? "low" : ""}"><i style="width:${pct(r)}%"></i><u></u></div>`
        : `<div class="meter none" aria-hidden="true"></div>`;
      const score = verdict
        ? `<div class="score num"><b>${g.correct}</b> / ${g.total} · ${pct(r)}%</div>`
        : `<div class="score num"><b>${g.correct}</b> / ${g.total}문항 <span class="few">문항이 적어 판정하지 않습니다</span></div>`;
      const tag = verdict ? `<span class="tag ${verdict.cls}">${verdict.label}</span>` : "";
      return `<div class="lv"><div class="cells">${cells}</div>${meter}<div><div class="name">${esc(x.k)} <span>${esc(x.n)}</span>${tag}</div>${score}</div></div>`;
    }).join("");
    return { cols, html };
  }

  // ---- 꺾은선: 번호 순서(쉬운 문항부터)에 따른 누적 정답 수 ----
  function lineChart(vm) {
    const seq = vm.report.sequence;
    const n = seq.length;
    const W = 340, H = 190, L = 26, R = 44, T = 12, B = 30;
    const x = (i) => L + (W - L - R) * i / Math.max(n, 1);
    const y = (v) => T + (H - T - B) * (1 - v / Math.max(n, 1));
    const bandOf = (s) => (s.difficulty == null ? "none" : s.difficulty >= 4 ? "45" : String(s.difficulty));
    const bandName = { 1: "1단계", 2: "2단계", 3: "3단계", 45: "4~5단계", none: "단계 없음" };
    const pts = [[x(0), y(0)]];
    let cum = 0;
    seq.forEach((s, i) => { cum += s.status === "correct" ? 1 : 0; pts.push([x(i + 1), y(cum), s]); });
    let s = "";
    let i0 = 0;
    // 단계 띠: 단계마다 같은 바탕색(어려울수록 짙게). 띠마다 글자를 찍지 않는다 — 문항이 단계 순서로 정렬돼 있지 않으면 띠가 잘게 여러 번 바뀌어
    // 글자끼리 겹치기 때문이다. 단계 이름은 그래프 아래 범례 한 줄이, x축은 문항 번호 눈금이 맡는다.
    const bandsSeen = new Set();
    while (i0 < n) {
      let i1 = i0;
      while (i1 + 1 < n && bandOf(seq[i1 + 1]) === bandOf(seq[i0])) i1++;
      const x0 = x(i0), x1 = x(i1 + 1);
      const band = bandOf(seq[i0]);
      bandsSeen.add(band);
      s += `<rect class="bd bd${band}" x="${x0.toFixed(1)}" y="${T}" width="${(x1 - x0).toFixed(1)}" height="${H - T - B}"/>`;
      i0 = i1 + 1;
    }
    // x축 눈금: 문항 번호. 눈금 사이가 항상 MIN_GAP 이상이라 문항 수와 단계 순서가 어떻든 글자가 닿지 않는다.
    const MIN_GAP = 34;
    const unit = (W - L - R) / Math.max(n, 1);
    const tickNos = [];
    for (const c of [1, Math.ceil(n / 4), Math.ceil(n / 2), Math.ceil(3 * n / 4), n]) {
      const no = Math.min(Math.max(c, 1), n);
      const last = tickNos[tickNos.length - 1];
      if (last === undefined || (no > last && (no - last) * unit >= MIN_GAP)) tickNos.push(no);
    }
    if (n > 0 && tickNos[tickNos.length - 1] !== n) {
      if (tickNos.length > 1 && (n - tickNos[tickNos.length - 1]) * unit < MIN_GAP) tickNos.pop();
      tickNos.push(n);
    }
    for (const no of tickNos) s += `<text x="${x(no).toFixed(1)}" y="${H - 10}" text-anchor="middle">${no}번</text>`;
    const ticks = [...new Set([0, Math.round(n / 3), Math.round(2 * n / 3), n])];
    for (const v of ticks) s += `<line x1="${L}" x2="${W - R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="var(--rule)" stroke-width="1"/><text x="${L - 6}" y="${(y(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`;
    s += `<line x1="${x(0).toFixed(1)}" y1="${y(0).toFixed(1)}" x2="${x(n).toFixed(1)}" y2="${y(n).toFixed(1)}" stroke="var(--ink3)" stroke-width="1.2" stroke-dasharray="3 4"/><text x="${(x(n) + 6).toFixed(1)}" y="${(y(n) + 3.5).toFixed(1)}">전부 정답</text>`;
    s += `<polyline fill="none" stroke="var(--ok)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" points="${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")}"/>`;
    pts.slice(1).forEach((p) => {
      const st = p[2].status;
      const ok = st === "correct";
      s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${ok ? 2.6 : 3.8}" fill="${ok ? "var(--ok)" : "var(--paper)"}" stroke="${ok ? "var(--paper)" : "var(--warn)"}" stroke-width="${ok ? 1 : 1.8}"><title>${p[2].no}번 ${ok ? "정답" : "오답"}</title></circle>`;
    });
    const e = pts[n];
    s += `<text x="${(e[0] + 6).toFixed(1)}" y="${(e[1] + 4).toFixed(1)}" style="fill:var(--ink);font-weight:700;font-size:11px">${cum}문항</text>`;
    const chart = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="문항 번호에 따른 누적 정답 수">${s}</svg>`;
    const legend = `<div class="legend band-legend">${["1", "2", "3", "45", "none"].filter((k) => bandsSeen.has(k)).map((k) => `<span><i class="sw bd${k}"></i>${bandName[k]}</span>`).join("")}</div>`;
    const svg = chart + legend;
    const firstMiss = seq.find((q) => q.status === "wrong");
    let cap;
    if (!firstMiss) cap = "모든 문항을 맞혀 파란 선이 점선과 겹칩니다.";
    else {
      const wrongBy = {};
      for (const q of seq) if (q.status === "wrong") wrongBy[bandOf(q)] = (wrongBy[bandOf(q)] || 0) + 1;
      const top = Object.entries(wrongBy).sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0][0];
      cap = `파란 선이 점선에서 멀어질수록 틀린 문항이 쌓인 것입니다. ${firstMiss.no}번에서 처음 틀렸고, ${bandName[top]}에서 틀린 문항이 가장 많습니다.`;
    }
    return { svg, cap };
  }

  // ---- 단원별 성취 ----
  function unitBarsHtml(vm) {
    return vm.units.map((u) => {
      const few = u.n < MIN_N;
      const meter = few
        ? `<div class="meter none" aria-hidden="true"></div>`
        : `<div class="meter ${u.r < STABLE ? "low" : ""}"><i style="width:${pct(u.r)}%"></i><u></u></div>`;
      const value = few ? `<b>${u.ok}</b> / ${u.n}` : `<b>${u.ok}</b> / ${u.n} · ${pct(u.r)}%`;
      return `<div class="bar"><div class="l">${esc(u.name)}</div>${meter}<div class="v num">${value}</div></div>`;
    }).join("");
  }
  function unitCaption(vm) {
    if (vm.judge) {
      const { best, worst } = vm.judge;
      return `가장 안정적인 단원: ${esc(best.name)} (${best.n}문항 중 ${best.ok}). 먼저 다질 단원: ${esc(worst.name)} (${worst.n}문항 중 ${worst.ok}).`;
    }
    return "단원 사이의 정답 수 차이가 크지 않거나 문항이 적어, 강약은 나누지 않습니다.";
  }

  // ---- 단원 × 단계 ----
  function heatHtml(vm) {
    const rows = vm.report.levelByUnit.rows;
    const byUnit = new Map(rows.map((row) => [row.unit, row]));
    const cols = vm.groups;
    const colKey = (x) => (x.key === "45" ? "4-5" : x.key === "none" ? "none" : Number(x.key));
    const head = `<tr><th>단원</th>${cols.map((x) => `<th>${esc(x.k)}</th>`).join("")}</tr>`;
    const body = vm.units.map((u) => {
      const row = byUnit.get(u.unclassified ? null : u.name);
      const cells = cols.map((x) => {
        const g = row ? row.cells[colKey(x)] : null;
        if (!g || !g.total) return `<td class="h h-none">–</td>`;
        const r = rateOf(g);
        const cls = g.total < MIN_N ? "h0" : r >= 1 ? "h4" : r >= STABLE ? "h3" : r >= 0.5 ? "h2" : "h1";
        return `<td class="h num ${cls}">${g.correct} / ${g.total}</td>`;
      }).join("");
      return `<tr><td>${esc(u.name)}</td>${cells}</tr>`;
    }).join("");
    return head + body;
  }

  // ---- 2쪽: 유형별 결과 ----
  function typesHtml(vm) {
    const head = `<thead><tr><th>유형</th><th>단원</th><th class="n">단계</th><th>문항별 결과</th><th>판단</th></tr></thead>`;
    const shown = vm.types.slice(0, TYPE_ROWS_MAX);
    const rest = vm.types.slice(TYPE_ROWS_MAX);
    const rows = shown.map((r) => {
      const verdict = typeVerdict(r);
      const dots = r.items.map((it) => `<i class="${it.status === "correct" ? "" : "x"}" title="${it.no}번"></i>`).join("");
      const nos = r.items.map((it) => `${it.no}번`).join(", ");
      const judge = verdict ? `<span class="tag ${verdict.cls}">${verdict.label}</span>` : `<span class="num few-count">${r.ok} / ${r.n}</span>`;
      return `<tr><td><b>${esc(r.label)}</b></td><td>${esc(r.unit)}</td><td class="n">${levelText(r.levels)}</td><td><span class="dots">${dots}</span> <span class="num nos">${nos}</span></td><td>${judge}</td></tr>`;
    }).join("");
    let more = "";
    if (rest.length) {
      const items = rest.flatMap((r) => r.items);
      const ok = items.filter((it) => it.status === "correct").length;
      more = `<tr class="rest"><td colspan="4">그 밖의 ${rest.length}개 유형 · 문항 ${items.length}개</td><td class="num few-count">${ok} / ${items.length}</td></tr>`;
    }
    return head + `<tbody>${rows}${more}</tbody>`;
  }

  // ---- 2쪽: 틀린 문항 ----
  function wrongHtml(vm) {
    const list = vm.report.wrongList;
    const typeLabelByNo = new Map();
    for (const row of vm.types) for (const it of row.items) typeLabelByNo.set(it.no, row.label);
    const levelOf = (d) => (d == null ? "–" : d >= 4 ? "4~5" : String(d));
    const unitOf = (w) => w.unit || UNCLASSIFIED_UNIT;
    const cap = WRONG_DOUBLE_MAX;
    const shown = list.slice(0, cap);
    const extra = list.length - shown.length;
    if (!list.length) return { html: `<p class="cap">틀린 문항이 없습니다.</p>`, count: 0, layout: "none" };
    if (shown.length <= WRONG_SINGLE_MAX) {
      const body = shown.map((w) => `<tr><td class="n">${w.no}</td><td>${esc(unitOf(w))}</td><td>${esc(typeLabelByNo.get(w.no) || UNCLASSIFIED_TYPE)}</td><td class="n">${levelOf(w.difficulty)}</td></tr>`).join("");
      return { html: `<div class="scroll"><table><tr><th class="n">번호</th><th>단원</th><th>유형</th><th class="n">단계</th></tr>${body}</table></div>`, count: list.length, layout: "single" };
    }
    const half = Math.ceil(shown.length / 2);
    const table = (rows) => `<table class="half"><tr><th class="n">번호</th><th>단원 · 유형</th><th class="n">단계</th></tr>${rows.map((w) => `<tr><td class="n">${w.no}</td><td><b>${esc(typeLabelByNo.get(w.no) || UNCLASSIFIED_TYPE)}</b><span class="sub">${esc(unitOf(w))}</span></td><td class="n">${levelOf(w.difficulty)}</td></tr>`).join("")}</table>`;
    const more = extra > 0 ? `<p class="cap">그 밖의 ${extra}문항은 1쪽 단계별 성취의 문항 칸에서 확인합니다.</p>` : "";
    return { html: `<div class="two-tables">${table(shown.slice(0, half))}${table(shown.slice(half))}</div>${more}`, count: list.length, layout: "double" };
  }

  function planHtml(vm) {
    return vm.plan.map((p) => `<div><span class="wk">${esc(p.wk)}</span><b>${esc(p.title)}</b><p>${esc(p.body)}</p></div>`).join("");
  }

  // 화면이 쓰는 한 묶음: 모든 조각을 문자열로 돌려준다(DOM 없음).
  function render(report, ctx) {
    const vm = buildViewModel(report);
    const levels = levelsHtml(vm);
    const line = lineChart(vm);
    const wrong = wrongHtml(vm);
    const t = report.totals;
    return {
      vm,
      donut: donutSvg(t),
      donutBig: `${t.correct}<span> / ${t.total}</span>`,
      donutSub: `정답률 ${pct(rateOf(t))}%`,
      summary: summaryHtml(vm),
      facts: factsHtml(vm),
      levelsCols: levels.cols,
      levels: levels.html,
      line: line.svg,
      lineCap: line.cap,
      units: unitBarsHtml(vm),
      unitCap: unitCaption(vm),
      heat: heatHtml(vm),
      types: typesHtml(vm),
      wrong: wrong.html,
      wrongN: `${wrong.count}문항`,
      plan: planHtml(vm),
      typeRowsHidden: Math.max(0, vm.types.length - TYPE_ROWS_MAX),
      wrongLayout: wrong.layout,
    };
  }

  return Object.freeze({
    MIN_N, STABLE, MID, UNCLASSIFIED_TYPE, UNCLASSIFIED_UNIT, TYPE_ROWS_MAX, GROUPS,
    buildViewModel, render, levelVerdict, typeVerdict, unitJudgement, esc,
  });
});
