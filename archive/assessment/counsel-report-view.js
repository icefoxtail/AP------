(function (root, factory) {
  const deps = typeof module === "object" && module.exports
    ? { View: require("./diagnostic-report-view.js") }
    : { View: root.DiagnosticReportView };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CounselReportView = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (deps) {
  "use strict";

  // 상담지의 화면 층. CounselReportData.buildModel의 모델을 받아 한 장의 HTML 문자열을 만든다(DOM·저장소·네트워크 없음).
  // 진단평가 결과표의 뷰(DiagnosticReportView)는 도넛 그림·단원/유형/단계 행 만들기·이스케이프를 그대로 재사용한다.
  //
  // 넣는 것: 한 줄 요약, 틀린 문항의 유형 표, 단원·난이도별 정오, 문항 번호별 정오.
  // 넣지 않는 것: 반 정답률·석차 같은 비교 수치, 문제 본문·정답·해설, 예상 점수, "약점 확정" 같은 단정.
  // 문구는 "이번 시험에서 n문항 중 m개"처럼 관찰 사실만 쓴다. 학생 이름·시험 제목은 본문에만 두고 title·주소에는 두지 않는다.

  const { View } = deps;
  const { esc } = View;
  const NO_TYPE = "유형 정보 없음";
  const NO_UNIT = "단원 정보 없음";
  const NO_LEVEL = "단계 정보 없음";
  const TYPE_ROWS_MAX = 12;
  const ORG_NAME = "AP 수학학원";

  const nosText = (nos) => (nos.length ? nos.map((n) => `${n}번`).join(", ") : "–");
  const wrongCount = (wrong, total) => `${total}문항 중 <b>${wrong}개</b> 틀림`;
  const fmtDate = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    return m ? `${m[1]}. ${Number(m[2])}. ${Number(m[3])}.` : "";
  };

  // 틀린 문항이 있는 유형 행(많이 틀린 순). 유형 이름이 없는 문항은 한 줄 "유형 정보 없음"으로 묶는다.
  function wrongTypeRows(vm) {
    return vm.types
      .filter((row) => row.wrong > 0)
      .map((row) => ({
        label: row.unclassified ? NO_TYPE : row.label,
        unclassified: row.unclassified,
        n: row.n,
        wrong: row.wrong,
        nos: row.items.filter((it) => it.status === "wrong").map((it) => it.no),
      }))
      .sort((a, b) => Number(a.unclassified) - Number(b.unclassified));
  }

  function typeTable(rows) {
    if (!rows.length) return "";
    const shown = rows.slice(0, TYPE_ROWS_MAX);
    const rest = rows.slice(TYPE_ROWS_MAX);
    const body = shown.map((r) => `<tr${r.unclassified ? ' class="none"' : ""}><th scope="row">${esc(r.label)}</th><td class="num">${wrongCount(r.wrong, r.n)}</td><td class="num nos">${esc(nosText(r.nos))}</td></tr>`).join("");
    const more = rest.length
      ? `<tr class="rest"><th scope="row">그 밖의 ${rest.length}개 유형</th><td class="num">${wrongCount(rest.reduce((s, r) => s + r.wrong, 0), rest.reduce((s, r) => s + r.n, 0))}</td><td class="num nos">${esc(nosText(rest.flatMap((r) => r.nos).sort((a, b) => a - b)))}</td></tr>`
      : "";
    return `<table class="grid types"><thead><tr><th scope="col">유형</th><th scope="col">이번 시험</th><th scope="col">틀린 번호</th></tr></thead><tbody>${body}${more}</tbody></table>`;
  }

  function summaryText(model, typeRows) {
    const t = model.report.totals;
    const bits = [`이번 시험에서 <b>${t.total}문항 중 ${t.correct}개</b>를 맞혔고 ${t.wrong}개를 틀렸습니다.`];
    if (t.unchecked) bits.push(`${t.unchecked}문항은 정오가 확인되지 않았습니다.`);
    if (t.wrong === 0) return bits.join(" ");
    const named = typeRows.filter((r) => !r.unclassified);
    const loose = typeRows.find((r) => r.unclassified);
    if (named.length) bits.push(`틀린 문항은 ${named.length}개 유형에서 나왔습니다.`);
    if (loose) bits.push(`${loose.wrong}개 문항은 유형 정보가 없어 유형을 표시하지 못했습니다.`);
    return bits.join(" ");
  }

  // 단원 · 단계 표: 이름 | 정답/문항 | 틀린 번호
  function simpleTable(head, rows) {
    if (!rows.length) return `<p class="cap">표시할 항목이 없습니다.</p>`;
    const body = rows.map((r) => `<tr><th scope="row">${esc(r.name)}</th><td class="num"><b>${r.ok}</b> / ${r.n}</td><td class="num nos">${esc(nosText(r.wrongNos))}</td></tr>`).join("");
    return `<table class="grid"><thead><tr><th scope="col">${head}</th><th scope="col">정답</th><th scope="col">틀린 번호</th></tr></thead><tbody>${body}</tbody></table>`;
  }
  const unitRows = (vm) => vm.units.map((u) => ({ name: u.unclassified ? NO_UNIT : u.name, ok: u.ok, n: u.n, wrongNos: u.g.wrongNos }));
  const levelRows = (vm) => vm.groups.map((x) => ({ name: x.key === "none" ? NO_LEVEL : `${x.k} ${x.n}`, ok: x.g.correct, n: x.g.total, wrongNos: x.g.wrongNos }));

  function chips(report) {
    return report.sequence.map((s) => {
      const mark = s.status === "correct" ? "정답" : s.status === "wrong" ? "오답" : "미확인";
      const cls = s.status === "correct" ? "o" : s.status === "wrong" ? "x" : "u";
      return `<span class="c ${cls}" role="img" aria-label="${s.no}번 ${mark}">${s.no}</span>`;
    }).join("");
  }

  // 한 장의 HTML. 반환: { html, typeRowCount }
  function render(model) {
    const { report, vm, student, exam } = model;
    const typeRows = wrongTypeRows(vm);
    const donut = View.render(report).donut;
    const t = report.totals;
    const grade = [student.school, student.grade].filter(Boolean).join(" ");
    const typeBlock = report.totals.wrong === 0
      ? `<p class="cap">틀린 문항이 없습니다.</p>`
      : typeTable(typeRows);
    const noMeta = model.source === "wrong_answers"
      ? `<p class="note">이 시험은 문항별 단원·유형 정보가 저장되기 전에 응시한 것이라 번호별 정오만 표시합니다.</p>`
      : "";
    const html = `
<header class="head">
  <div><div class="kicker">수학 시험 결과 상담</div><h1>${esc(exam.title || "시험 결과")}</h1></div>
  <div class="org">${esc(ORG_NAME)}</div>
</header>
<dl class="who">
  <div><dt>학생</dt><dd>${esc(student.name) || "&nbsp;"}</dd></div>
  <div><dt>학교 · 학년</dt><dd>${esc(grade) || "&nbsp;"}</dd></div>
  <div><dt>시험일</dt><dd class="num">${esc(fmtDate(exam.date)) || "&nbsp;"}</dd></div>
  <div><dt>문항</dt><dd class="num">${t.total}문항</dd></div>
</dl>
<section class="top" aria-label="한 줄 요약">
  <div class="donut"><span>${donut}</span><div class="mid"><div class="big num">${t.correct}<span> / ${t.total}</span></div></div></div>
  <p class="verdict">${summaryText(model, typeRows)}</p>
</section>
${noMeta}
<section class="block" aria-labelledby="h-types">
  <h2 id="h-types">틀린 문항의 유형 <small>유형 이름 · 그 유형 문항 중 틀린 수</small></h2>
  ${typeBlock}
  ${typeRows.length ? `<p class="cap">한 유형의 문항 수가 적어, 이번 시험 한 번의 결과로 학습 상태를 단정하지 않고 관찰한 사실만 적었습니다.</p>` : ""}
</section>
<div class="two">
  <section class="block" aria-labelledby="h-units"><h2 id="h-units">단원별 정오</h2>${simpleTable("단원", unitRows(vm))}</section>
  <section class="block" aria-labelledby="h-levels"><h2 id="h-levels">난이도별 정오</h2>${simpleTable("난이도", levelRows(vm))}</section>
</div>
<section class="block" aria-labelledby="h-nos">
  <h2 id="h-nos">문항 번호별 정오 <small>번호가 클수록 어려운 문항입니다</small></h2>
  <div class="cells">${chips(report)}</div>
  <div class="legend"><span><i class="c o"></i>맞힌 문항</span><span><i class="c x"></i>틀린 문항</span></div>
</section>
<div class="slot" id="followupSlot" data-slot="similar-followup"></div>
<footer class="foot"><span>한 번의 시험에서 관찰한 결과입니다. 이어서 공부할 내용은 상담에서 함께 정합니다.</span></footer>`;
    return { html, typeRowCount: typeRows.length };
  }

  return Object.freeze({ NO_TYPE, NO_UNIT, NO_LEVEL, ORG_NAME, wrongTypeRows, summaryText, render });
});
