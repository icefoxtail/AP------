/* Archive 2.0 consumes the existing engines' printHeaderOptions contract. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Output = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const text = (v, n) =>
    String(v ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, n);
  function displayTitle(exam = {}) {
    const year = String(exam.year || "").replace(/^(\d{2})$/, "20$1");
    const period =
      exam.examType === "mid"
        ? "중간고사"
        : exam.examType === "final"
          ? "기말고사"
          : "";
    return (
      [
        year,
        exam.school,
        exam.grade,
        exam.semester ? exam.semester + "학기" : "",
        period,
      ]
        .filter(Boolean)
        .join(" ") || text(exam.topic || exam.subject || "수학 시험지", 80)
    );
  }
  function normalize(raw = {}, fallback = "수학 시험지") {
    return {
      title: text(raw.title || fallback, 80),
      subtitle: text(raw.subtitle, 120),
      metaRight: text(raw.metaRight, 60),
      showNameLine: raw.showNameLine !== false,
      showScoreLine: raw.showScoreLine !== false,
      applyToSolution: raw.applyToSolution !== false,
      applyToAnswer: raw.applyToAnswer !== false,
    };
  }
  function settings(raw = {}) {
    return {
      header: normalize(raw.header),
      qpp: [4, 6, 8].includes(Number(raw.qpp)) ? Number(raw.qpp) : 4,
      includeQr: raw.includeQr === true,
    };
  }
  function markup(value = {}, prefix = "print", disabled = false) {
    const s = settings(value),
      esc = (v) =>
        String(v ?? "").replace(
          /[&<>"']/g,
          (c) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            })[c],
        ),
      off = disabled ? "disabled" : "";
    return `<div class="header-fields" data-output-settings="${prefix}">${[
      ["title", "시험지 제목"],
      ["subtitle", "부제"],
      ["metaRight", "오른쪽 표시"],
    ]
      .map(
        ([key, label]) =>
          `<label>${label}<input data-output-field="${key}" value="${esc(s.header[key])}" maxlength="${key === "subtitle" ? 120 : key === "title" ? 80 : 60}" ${off}></label>`,
      )
      .join(
        "",
      )}<label>한 쪽 문항 수<select data-output-field="qpp" ${off}>${[4, 6, 8].map((n) => `<option value="${n}" ${s.qpp === n ? "selected" : ""}>${n}문항</option>`).join("")}</select></label>${[
      ["showNameLine", "이름란"],
      ["showScoreLine", "점수란"],
      ["includeQr", "QR 포함"],
    ]
      .map(
        ([key, label]) =>
          `<label class="check"><input type="checkbox" data-output-field="${key}" ${(key === "includeQr" ? s.includeQr : s.header[key]) ? "checked" : ""} ${off}>${label}</label>`,
      )
      .join(
        "",
      )}<p class="muted">학생은 학생 포털의 ‘내 시험지’에서 확인합니다. QR은 필요할 때만 포함하세요.</p></div>`;
  }
  function read(element, current) {
    const next = settings(current),
      key = element.dataset.outputField,
      value = element.type === "checkbox" ? element.checked : element.value;
    if (key === "qpp") next.qpp = Number(value);
    else if (key === "includeQr") next.includeQr = value === true;
    else next.header[key] = value;
    return next;
  }
  function applyUrl(url, value) {
    const s = settings(value);
    url.searchParams.set("qpp", String(s.qpp));
    url.searchParams.set("submitQr", "0");
    url.searchParams.set("solQr", s.includeQr ? "1" : "0");
    url.searchParams.set("portalQr", "1");
    url.searchParams.set("preRegistered", "1");
    url.searchParams.set("assignmentRegistered", "1");
    return url;
  }
  return { displayTitle, normalize, settings, markup, read, applyUrl };
});
