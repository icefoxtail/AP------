// Archive2 workspace, find part: home, school exam finder, similar list, 자료 점검.
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const C = window.Archive2Core;
  const O = window.Archive2Output;
  const Similar = window.Archive2Similar;
  const Unified = window.Archive2UnifiedUnits;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, HOME_GRADES, Quick, UNPLACED_REASON_LABELS, badge, button, catalogExams, drafts, esc, finderIdentityMatch,
    finderSchoolValues, gradeClass, isQuickAssessmentView, options, reconcileFinderSchool, render,
    replaceFinderUrlState, showDialog, state, taxonomyRowsForFilters, unifiedIndex, unique, urlState,
    workspaceScopeParent;
  WS.links.push(() => {
    ({
      $, HOME_GRADES, Quick, UNPLACED_REASON_LABELS, badge, button, catalogExams, drafts, esc, finderIdentityMatch,
      finderSchoolValues, gradeClass, isQuickAssessmentView, options, reconcileFinderSchool, render,
      replaceFinderUrlState, showDialog, state, taxonomyRowsForFilters, unifiedIndex, unique, urlState,
      workspaceScopeParent
    } = WS.api);
  });
  const HOME_PRODUCT_REGISTRY = Object.freeze([
    Object.freeze({
      productKey: "school-exams",
      label: "학교 기출",
      availability: true,
      routeOwner: "finder",
      routeResolver: () =>
        new URL("workspace.html?view=find&material=exam", location.href).href,
    }),
    Object.freeze({
      productKey: "generated-bank",
      label: "모의고사",
      availability: true,
      routeOwner: "generated-consumer",
      routeResolver: () => new URL("generated-bank.html", location.href).href,
    }),
    Object.freeze({
      productKey: "five-minute-test",
      label: "5분 테스트",
      availability: true,
      routeOwner: "five-minute-test",
      routeResolver: () =>
        new URL("workspace.html?view=five-minute", location.href).href,
    }),
    Object.freeze({
      productKey: "subunit-assessment",
      label: "소단원 평가",
      availability: true,
      routeOwner: "subunit-assessment",
      routeResolver: () =>
        new URL("workspace.html?view=subunit-test", location.href).href,
    }),
    Object.freeze({
      productKey: "unit-assessment",
      label: "중단원 평가",
      availability: true,
      routeOwner: "unit-assessment",
      routeResolver: () =>
        new URL("workspace.html?view=unit-test", location.href).href,
    }),
    Object.freeze({
      productKey: "exam-prep",
      label: "종합평가",
      availability: true,
      routeOwner: "monthly-assessment",
      routeResolver: () =>
        new URL("workspace.html?view=monthly-test", location.href).href,
    }),
  ]);
  // 수업 양식: print forms that are not assessments. A static link (like the grade buttons), so it needs no catalog and no click code.
  const HOME_FORMS = Object.freeze([
    Object.freeze({ label: "빈 풀이노트 인쇄", note: "문제집 수업용 A4 풀이 양식", href: "note-sheet.html" }),
  ]);
  function homeProductMarkup(product) {
    const attrs = `data-product-key="${esc(product.productKey)}" data-route-owner="${esc(product.routeOwner || "")}" data-availability="${String(product.availability)}"`;
    if (product.availability && typeof product.routeResolver === "function")
      return button(
        "home-product",
        esc(product.label),
        `type="button" class="archive-home-product is-available" ${attrs}`,
      );
    return `<div class="archive-home-product is-unavailable" ${attrs} aria-disabled="true"><span>${esc(product.label)}</span></div>`;
  }

  function scheduleFinderFilterRender() {
    clearTimeout(V.finderFilterRenderTimer);
    V.finderFilterRenderTimer = setTimeout(() => {
      V.finderFilterRenderTimer = null;
      if (state.view !== "find") return;
      const activeFilter = document.activeElement?.dataset?.group === "find"
        ? document.activeElement.dataset.filter
        : null;
      render();
      if (activeFilter) {
        [...document.querySelectorAll('[data-group="find"][data-filter]')]
          .find((el) => el.dataset.filter === activeFilter)
          ?.focus?.({ preventScroll: true });
      }
    }, 0);
  }

  function finderCourseOptions(filters) {
    const courseLabel = (value) =>
      /^M([123])-([12])$/.test(value)
        ? value.replace(/^M([123])-([12])$/, "중$1 · $2학기")
        : value;
    const projected = C.hasSubjectProjection?.(filters.grade) === true;
    return projected
      ? C.subjectProjectionOptions(filters.grade)
      : unique(
          taxonomyRowsForFilters({ ...filters, courseKey: "" })
            .map((r) => r.courseKey),
        ).map((value) => ({ value, label: courseLabel(value) }));
  }
  // ---- 학교별 기출을 목록만으로 먼저 그리기 (2026-11-23) ----
  // 시험지 목록(state.light)만 있고 카탈로그가 아직 없을 때: 시험지 단위 값(학교·연도·학기·학년·종류·검색어의 시험지 글자)으로 먼저 보이고,
  // 레코드에서 판정하는 것(교육과정·과목, 문항 단위 검색어, 레코드 기준 학년)은 전체 자료가 온 뒤 같은 화면이 다시 그려져 채워진다.
  const findLight = () => !state.catalog && Boolean(state.light);
  // 교육과정·과목·계열은 목록만으로 판정하지 않는다: 이런 조건이 주소에 있으면 전체 자료를 기다린다(준비 중 화면).
  const LIGHT_BLOCKED_FILTERS = ["curriculumKey", "courseKey", "semanticSubject", "family"];
  const lightFindUsable = () => findLight() && !LIGHT_BLOCKED_FILTERS.some((key) => state.find[key]);
  // 통합 과목 목록(학년별 고정 목록)이 있는 화면으로 그린다: 전체 자료가 오기 전에도 칸 모양이 같다.
  const finderUnified = () => Boolean(unifiedIndex()) || findLight();
  // 목록만으로 보인 결과가 전체 자료가 오면 달라질 수 있는 조건(검색어, 학년): 이때만 "준비하는 중" 줄을 보이고 "결과 없음"을 단정하지 않는다.
  const lightResultsPending = () => findLight() && Boolean(state.find.query || state.find.grade);
  // The finder screen can be drawn from the exam list alone (see lightFindUsable): main part asks before it draws.
  // Finder filters in the unified vocabulary: the subject comes from the unified list for the
  // chosen grade (all unified subjects while no grade is chosen); the old subject family, the
  // semester-course select and shared-matcher subject rules no longer apply.
  function reconcileFinderFilters(filters) {
    if (!finderUnified()) return C.reconcileFinderFilters(filters, state.catalog.taxonomy);
    const next = C.reconcileFinderFilters(
      { ...filters, semanticSubject: "", family: "", courseKey: "" },
      state.catalog?.taxonomy || [],
    );
    const subject = filters.semanticSubject || Unified.subjectForFamily(filters.family);
    next.semanticSubject = Unified.isKnownSubject(next.grade || "", subject) ? subject : "";
    next.family = "";
    next.courseKey = "";
    return next;
  }
  // What changing one finder filter (a select, the grade buttons) does besides storing the value.
  function applyFinderFilterChange(key) {
    if (key === "grade") {
      state.sources = [];
      state.find.semanticSubject = "";
      state.find.family = "";
    }
    if (key === "semanticSubject") {
      state.find.courseKey = "";
      state.find.family = "";
    }
    if (["grade", "curriculumKey", "courseKey", "semanticSubject"].includes(key))
      Object.assign(state.find, reconcileFinderFilters(state.find));
    if (["material", "grade", "curriculumKey", "courseKey", "semanticSubject"].includes(key))
      reconcileFinderSchool(state.find);
    state.page = 0;
    urlState();
  }
  function finderFamilyLabel(value) {
    return (
      {
        COMMON_1: "공통수학1 계열",
        COMMON_2: "공통수학2 계열",
        ALGEBRA: "대수 계열",
        CALCULUS: "미적분 기초 계열",
        CALCULUS_ADVANCED: "미적분 심화 계열",
        PROB_STATS: "확률과통계",
        GEOMETRY: "기하",
      }[value] || value
    );
  }
  function finderAxisLabel(value) {
    return (
      {
        "1-mid": "1학기 중간",
        "1-final": "1학기 기말",
        "2-mid": "2학기 중간",
        "2-final": "2학기 기말",
      }[value] || value
    );
  }
  function finderResettable(filters = state.find) {
    return Boolean(
      filters.curriculumKey ||
        filters.courseKey ||
        filters.semanticSubject ||
        filters.school ||
        filters.axis ||
        filters.yearFrom ||
        filters.yearTo ||
        filters.family ||
        filters.file ||
        filters.query ||
        filters.grade ||
        filters.similarOnly,
    );
  }
  // Same look as the home search: a large pill box and 찾기. Words are matched together (AND).
  function finderSearchMarkup(filters) {
    return `<div class="find-search-row"><label class="visually-hidden" for="finder-query">학교, 학년, 시험으로 검색</label><input id="finder-query" type="search" value="${esc(filters.query || "")}" placeholder="${filters.material === "textbook" ? "미래엔 공통수학1 다항식" : "순천고 고1 1학기 중간"}" autocomplete="off" enterkeyhint="search">${button("finder-search", "찾기", 'type="button" class="primary find-search-submit"')}</div>`;
  }
  const FINDER_TERMS = Object.freeze([
    ["1-mid", "1학기 중간"], ["1-final", "1학기 기말"], ["2-mid", "2학기 중간"], ["2-final", "2학기 기말"],
  ]);
  // Grade buttons (grade colors, press again to clear) and the four exam terms.
  function finderQuickMarkup(filters) {
    const grades = HOME_GRADES.map(([label, id]) =>
      button("finder-grade", esc(label), `type="button" class="find-grade grade-${id}" data-grade="${label}" aria-pressed="${filters.grade === label}"`)).join("");
    // 교과서에는 시험 시기가 없어 학년 단추만 두고, 과목 아래에 출판사 단추를 보인다.
    if (filters.material === "textbook")
      return `<div class="find-quick"><div class="find-grades" role="group" aria-label="학년">${grades}</div></div>${finderSubjectsMarkup(filters)}${finderPublishersMarkup(filters)}`;
    const terms = FINDER_TERMS.map(([value, label]) =>
      button("finder-axis-quick", esc(label), `type="button" class="find-term" data-axis="${value}" aria-pressed="${filters.axis === value}"`)).join("");
    return `<div class="find-quick"><div class="find-grades" role="group" aria-label="학년">${grades}</div><span class="find-divider" aria-hidden="true"></span><div class="find-terms" role="group" aria-label="시험 시기">${terms}</div></div>${finderSubjectsMarkup(filters)}`;
  }
  // Subjects of the chosen grade (고1 공통수학1·2, 고2·고3 five subjects) as a row right under the grade
  // buttons. Middle school (one subject) and "no grade yet" show nothing. It reads and writes the same
  // state.find.semanticSubject as the 과목 select in the fold, so the two never disagree.
  function finderSubjectChoices(filters) {
    if (!filters.grade || !finderUnified()) return [];
    const subjects = Unified.subjectChoices(filters.grade);
    return subjects.length >= 2 ? subjects : [];
  }
  function finderSubjectsMarkup(filters) {
    const subjects = finderSubjectChoices(filters);
    if (!subjects.length) return "";
    const current = filters.semanticSubject || Unified.subjectForFamily(filters.family) || "";
    const buttons = [{ value: "", label: "전체" }, ...subjects].map(({ value, label }) =>
      button("finder-subject", esc(label), `type="button" class="find-subject" data-subject="${esc(value)}" aria-pressed="${current === value}"${findLight() ? " disabled" : ""}`)).join("");
    return `<div class="find-subjects" role="group" aria-label="과목">${buttons}</div>`;
  }
  // 출판사 단추(교과서 칸): 학년·과목 조건에 맞는 교과서의 출판사만 보이고, 고른 값은 학교 조건(state.find.school) 그대로다.
  function finderPublishersMarkup(filters) {
    const publishers = finderSchoolValues({ ...filters, school: "" });
    if (publishers.length < 2) return "";
    const buttons = [{ value: "", label: "전체 출판사" }, ...publishers.map((value) => ({ value, label: value }))].map(({ value, label }) =>
      button("finder-publisher", esc(label), `type="button" class="find-subject find-publisher" data-publisher="${esc(value)}" aria-pressed="${(filters.school || "") === value}"`)).join("");
    return `<div class="find-subjects find-publishers" role="group" aria-label="출판사">${buttons}</div>`;
  }
  // The one-exam filter (a link to a file) is shown by the exam's title, never by its file name.
  function finderFileLabel(file) {
    const exam = catalogExams().find((item) => C.normalizeFile(item.file) === C.normalizeFile(file));
    return exam ? O.displayTitle(exam) : "선택한 시험지";
  }
  function finderActiveMarkup(filters) {
    const active = [
      [filters.material === "textbook" ? "출판사" : "학교", filters.school],
      ["시험지", filters.file ? finderFileLabel(filters.file) : ""],
      [
        "연도",
        filters.yearFrom || filters.yearTo
          ? `${filters.yearFrom || "…"}~${filters.yearTo || "…"}`
          : "",
      ],
      finderUnified()
        ? ["", ""]
        : ["과목 계열", filters.family ? finderFamilyLabel(filters.family) : ""],
    ].filter(([, value]) => value);
    return `<div class="finder-active-zone"><div class="finder-active-row">${active
      .map(
        ([label, value]) =>
          `<span class="finder-chip">${esc(label)} ${esc(value)}</span>`,
      )
      .join("")}</div>${
      finderResettable(filters)
        ? button(
            "finder-reset",
            "검색 조건 지우기",
            'class="finder-reset-action"',
          )
        : ""
    }</div>`;
  }
  // The filters that stay out of the way: 교육과정, 과목, 학교, 연도 (and the old 과목 계열 while no unified list exists).
  // Grade and term are the buttons above; nothing was dropped, only moved.
  function finderMoreFiltersMarkup(filters) {
    const schools = finderSchoolValues(filters);
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true,
      projected = C.hasSubjectProjection?.(filters.grade) === true;
    let subjectField = "";
    if (finderUnified()) {
      const subjects = Unified.subjectChoices(filters.grade || "");
      if (subjects.length)
        subjectField = `<label class="finder-field finder-course"><span>과목</span><select data-filter="semanticSubject" data-group="find"${findLight() ? " disabled" : ""}>${options(subjects, filters.semanticSubject || Unified.subjectForFamily(filters.family), "전체 과목")}</select></label>`;
    } else {
      const courses = finderCourseOptions(filters);
      subjectField = projected
        ? `<label class="finder-field finder-course"><span>과목</span><select data-filter="semanticSubject" data-group="find">${options(courses, filters.semanticSubject, highSemantic ? "과목 선택" : "전체 과목")}</select></label>`
        : `<label class="finder-field finder-course"><span>과목</span><select data-filter="courseKey" data-group="find">${options(courses, filters.courseKey, "전체 과목")}</select></label>`;
    }
    const familyField = filters.grade || finderUnified()
      ? ""
      : `<label class="finder-field finder-family"><span>과목 계열</span><select data-filter="family" data-group="find">${options(
          [
            { value: "COMMON_1", label: "공통수학1 계열" },
            { value: "COMMON_2", label: "공통수학2 계열" },
            { value: "ALGEBRA", label: "대수 계열" },
            { value: "CALCULUS", label: "미적분 기초 계열" },
            { value: "CALCULUS_ADVANCED", label: "미적분 심화 계열" },
            { value: "PROB_STATS", label: "확률과통계" },
            { value: "GEOMETRY", label: "기하" },
          ],
          filters.family,
          "전체 계열",
        )}</select></label>`;
    // A subject chosen with the buttons under the grade does not pop the fold open.
    const subjectOpens = filters.semanticSubject && !finderSubjectChoices(filters).length;
    const open = state.findMoreOpen || filters.curriculumKey || filters.courseKey || subjectOpens || (filters.school && filters.material !== "textbook") || filters.yearFrom || filters.yearTo || filters.family;
    return `<details class="find-more"${open ? " open" : ""}><summary>과목 · 학교 · 연도</summary><div class="find-more-fields"><label class="finder-field"><span>교육과정</span><select data-filter="curriculumKey" data-group="find"${findLight() ? " disabled" : ""}>${options(["2015", "2022"], filters.curriculumKey, "전체 교육과정")}</select></label>${subjectField}<label class="finder-field finder-school"><span>${filters.material === "textbook" ? "출판사" : "학교"}</span><select data-filter="school" data-group="find">${options(schools, filters.school, filters.material === "textbook" ? "전체 출판사" : "전체 학교")}</select></label><label class="finder-field finder-year"><span>연도</span><span class="finder-year-range"><input type="number" min="2000" max="2100" data-filter="yearFrom" data-group="find" value="${esc(filters.yearFrom || "")}" placeholder="시작 연도"><b>~</b><input type="number" min="2000" max="2100" data-filter="yearTo" data-group="find" value="${esc(filters.yearTo || "")}" placeholder="끝 연도"></span></label>${familyField}</div></details>`;
  }


  // Search text per exam, built once per catalog: the exam's visible values (never JSON keys) plus
  // the uid and L1-L4 text of its questions. Exact current middle-school parents are search
  // aliases from the shared selection index; stored source/request paths remain unchanged.
  let findSearchIndex = null;
  const lightSearchText = new WeakMap();
  function findSearchText(exam) {
    const catalog = state.catalog;
    // 목록만 있을 때는 시험지 글자까지만(문항의 uid·L1~L4는 전체 자료가 온 뒤 더해진다).
    if (!catalog) {
      let lightText = lightSearchText.get(exam);
      if (lightText === undefined) lightSearchText.set(exam, (lightText = examSearchParts(exam).join("\n")));
      return lightText;
    }
    if (!findSearchIndex || findSearchIndex.exams !== catalog.exams || findSearchIndex.records !== catalog.records) {
      const questionsByFile = new Map();
      const index = unifiedIndex();
      for (const r of catalog.records) {
        const entry = index?.byUid.get(r.questionUid);
        const parent = entry?.rpmParentStatus === "EXACT" ? entry.rpmParent : null;
        const text = C.normalizeSearch([r.questionUid, r.L1, r.L2, r.L3, r.L4, parent?.L1, parent?.L2].filter(Boolean).join(" "));
        if (!text) continue;
        const list = questionsByFile.get(r.sourceFile);
        if (list) list.push(text);
        else questionsByFile.set(r.sourceFile, [text]);
      }
      findSearchIndex = { exams: catalog.exams, records: catalog.records, questionsByFile, text: new WeakMap() };
    }
    let text = findSearchIndex.text.get(exam);
    if (text === undefined) {
      const parts = examSearchParts(exam);
      parts.push(...(findSearchIndex.questionsByFile.get(exam.file) || []));
      text = parts.join("\n");
      findSearchIndex.text.set(exam, text);
    }
    return text;
  }
  // The exam's own visible values plus its card title.
  function examSearchParts(exam) {
    const parts = [];
    const collect = (value, depth) => {
      if (typeof value === "string" || typeof value === "number") {
        const piece = C.normalizeSearch(value);
        if (piece) parts.push(piece);
      } else if (depth < 4 && value && typeof value === "object") {
        for (const item of Array.isArray(value) ? value : Object.values(value)) collect(item, depth + 1);
      }
    };
    collect(exam, 0);
    // The card title ("2026 팔마고 고3 1학기 중간고사") is built from separate fields, so words
    // such as "1학기" or "중간고사" only exist in the displayed title.
    collect(O.displayTitle(exam), 0);
    return parts;
  }
  // One rule for every way into the finder (menu, address, back button): without a material it lists
  // 학교 기출; a link to one exam file keeps listing every kind so the file is found.
  function applyDefaultFinderMaterial() {
    if (state.find.material === undefined && !state.find.file) state.find.material = "exam";
  }
  function findExams(f = state.find) {
    // Words are separated by spaces and may come in any order; "1학기 기말" stays one word.
    const terms = String(f.query || "")
      .replace(/(\d)\s*학기\s*(기말|중간)/g, "$1학기$2")
      .split(/\s+/)
      .map(C.normalizeSearch)
      .filter(Boolean);
    return catalogExams().filter((exam) => {
      const hasYearFilter = Boolean(f.yearFrom || f.yearTo);
      const examYear = Number(exam.year);
      if (
        !O.matchesMaterial(exam, f.material) ||
        (f.school && f.school !== exam.school) ||
        (hasYearFilter && !Number.isFinite(examYear)) ||
        (f.yearFrom && examYear < Number(f.yearFrom)) ||
        (f.yearTo && examYear > Number(f.yearTo))
      )
        return false;
      if (f.file && C.normalizeFile(exam.file) !== C.normalizeFile(f.file)) return false;
      if (f.axis && `${exam.semester}-${exam.examType}` !== f.axis)
        return false;
      if (!finderUnified() && f.family && !f.grade && !exam.courseFamilies.includes(f.family))
        return false;
      if (!finderIdentityMatch(exam, f)) return false;
      if (f.similarOnly && findSimilarFilterApplies(f) && !similarPairs().setsFor(exam.file).length) return false;
      if (!terms.length) return true;
      const text = findSearchText(exam);
      return terms.every((term) => text.includes(term));
    }).sort(f.material === "textbook" ? compareTextbookRows : compareFindRows);
  }
  // Newest year first (the shared rule); inside one year the later term comes first (2학기 기말 → 1학기 중간).
  function compareFindRows(a, b) {
    const byYear = C.compareNewest(a, b);
    if (byYear) return byYear;
    const term = (exam) => (Number(exam.semester) || 0) * 2 + (exam.examType === "final" ? 1 : 0);
    return term(b) - term(a);
  }
  function renderOriginalReceipts() {
    const host = $("original-receipts");
    if (!host) return;
    const receipts = state.originalReceipts || [];
    if (!receipts.length) {
      host.replaceChildren();
      return;
    }
    const pdfPending = receipts.some((receipt) => receipt.pdfStatus !== "ready");
    host.innerHTML = `<div class="callout original-receipts-callout">
      <strong>${receipts.length}개 반에 출제했습니다</strong>
      <p>학생에게는 출제할 때 저장한 내용 그대로 나갑니다.${pdfPending ? " PDF 준비가 필요한 반은 그 반의 PDF만 다시 준비할 수 있습니다." : ""}</p>
      <div class="original-receipt-list">${receipts.map((receipt) => {
        const ready = receipt.pdfStatus === "ready";
        return `<article class="original-receipt-row" data-assignment-id="${esc(receipt.id)}">
          <div><strong>${esc(receipt.className || "선택한 반")}</strong><div class="muted">출제 번호 · <code>${esc(receipt.id)}</code></div>
            <div class="muted">${ready ? "PDF 준비 완료" : "출제 완료 · PDF 확인 필요"}${receipt.pdfError ? ` · ${esc(receipt.pdfError)}` : ""}</div></div>
          <div class="actions" role="group" aria-label="${esc(receipt.className || "선택한 반")} 출제 ${esc(receipt.id)} 시험지·해설·정답·학생별 확인">
            ${[ ["exam", "시험지"], ["sol", "해설"], ["ans", "정답"] ].map(([mode, label]) => button("assignment-output-direct", label, `data-assignment="${esc(receipt.id)}" data-mode="${mode}" class="small"`)).join("")}
            ${ready ? "" : button("assignment-pdf", "PDF 다시 준비", `data-assignment="${esc(receipt.id)}" class="small"`)}
            ${button("assignment-status", "학생별 확인", `data-assignment="${esc(receipt.id)}" class="small"`)}
          </div>
        </article>`;
      }).join("")}</div>
    </div>`;
  }
  // ---- Home ----------------------------------------------------------------------------------
  // "Recently opened" is a light record kept only in this browser. Every read and write is
  // guarded: a blocked or full storage must never stop an exam from opening (runtime contract).
  const RECENT_EXAMS_KEY = "APMATH_ARCHIVE2_RECENT_EXAMS_v1";
  const RECENT_EXAMS_MAX = 8;
  function readRecentExams() {
    try {
      const rows = JSON.parse(localStorage.getItem(RECENT_EXAMS_KEY) || "[]");
      return (Array.isArray(rows) ? rows : [])
        .filter((row) => row && typeof row.file === "string" && row.file)
        .slice(0, RECENT_EXAMS_MAX);
    } catch {
      return [];
    }
  }
  function rememberRecentExam(exam, now = Date.now()) {
    try {
      const file = String(exam?.file || "");
      if (!file) return;
      const rows = readRecentExams().filter((row) => row.file !== file);
      rows.unshift({ file, at: now });
      localStorage.setItem(RECENT_EXAMS_KEY, JSON.stringify(rows.slice(0, RECENT_EXAMS_MAX)));
    } catch {
      /* a recent-open record is optional */
    }
  }
  // Schools with the most original exams, computed from the loaded catalog (never a fixed list).
  function homeSchoolChips(limit = 8) {
    const counts = new Map();
    for (const exam of catalogExams()) {
      if (!exam.school || !O.matchesMaterial(exam, "exam")) continue;
      counts.set(exam.school, (counts.get(exam.school) || 0) + 1);
    }
    return [...counts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
      .slice(0, limit)
      .map(([school, count]) => ({ school, count }));
  }
  function relativeDayLabel(at, now = Date.now()) {
    const days = Math.floor((startOfDay(now) - startOfDay(at)) / 86400000);
    if (!Number.isFinite(days) || days < 0) return "";
    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;
    if (days < 14) return "지난주";
    const date = new Date(at);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  function startOfDay(value) {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }
  // Recently opened exams that still exist in the catalog; with no record yet, the newest exams.
  function homeExamList(limit = 5) {
    const exams = catalogExams();
    const indexByFile = new Map(exams.map((exam, index) => [exam.file, index]));
    const opened = [];
    for (const row of readRecentExams()) {
      const index = indexByFile.get(row.file);
      if (index !== undefined) opened.push({ index, exam: exams[index], at: row.at });
      if (opened.length >= limit) break;
    }
    if (opened.length) return { kind: "opened", rows: opened };
    const newest = exams
      .map((exam, index) => ({ index, exam }))
      .filter((row) => O.matchesMaterial(row.exam, "exam"))
      .sort((a, b) => C.compareNewest(a.exam, b.exam))
      .slice(0, Math.min(limit, 3));
    return { kind: "newest", rows: newest };
  }
  // ---- One exam row (shared by 학교별 기출 and the home list) -------------------------------------
  // Spine (year + grade), title, subject · count · range, the exam buttons and, on the right, the
  // similar problems of this exam. Both screens draw rows with this one function so they never drift.
  const NO_SIMILAR = Object.freeze({
    setsFor: () => [], originalFileFor: () => null, unlinked: [],
    stats: Object.freeze({ sets: 0, linked: 0, unlinked: 0, originalsWithSimilar: 0, byRule: {} }),
  });
  function similarPairs() {
    return Similar?.pairsFor?.({ exams: catalogExams() }) || NO_SIMILAR;
  }
  // The "유사문제 있는 시험만" check only means something for original exams.
  const findSimilarFilterApplies = (filters) => !filters.material || filters.material === "exam";
  let examIndexCache = null;
  function examIndexOf(exam) {
    const exams = catalogExams();
    if (!examIndexCache || examIndexCache.exams !== exams)
      examIndexCache = { exams, byFile: new Map(exams.map((item, index) => [item.file, index])) };
    return examIndexCache.byFile.get(exam?.file) ?? -1;
  }
  // Opening a similar set counts as opening its exam for the home "최근 연 기출" list.
  function recentTarget(exam) {
    const originalFile = similarPairs().originalFileFor(exam?.file);
    const index = originalFile ? examIndexOf({ file: originalFile }) : -1;
    return index >= 0 ? catalogExams()[index] : exam;
  }
  // ---- 교과서 칸 (2026-11-22) ----
  // 카탈로그의 교과서 줄: school=출판사, primaryStandardCourse=과목, topic="출판사 과목 단원 …"(출판사·과목은 줄임말·로마숫자일 수 있음).
  // 새 필드·저장 형식 없이 위 값에서 읽어, 줄은 출판사·과목·단원명이 먼저 읽히게 하고 목록은 과목 → 출판사 → 단원 순으로 둔다.
  const TEXTBOOK_SUBJECT_ORDER = Object.freeze(["공통수학1", "공통수학2", "대수", "미적분I", "확률과 통계", "기하"]);
  const normTextbookWord = (value) =>
    String(value || "").replace(/\s+/g, "").replace(/Ⅱ|II/g, "2").replace(/Ⅰ|I/g, "1");
  function textbookParts(exam) {
    const publisher = String(exam?.school || "").trim();
    const subject = String(exam?.primaryStandardCourse || exam?.subject || "").trim();
    const words = String(exam?.topic || exam?.identityTitle || "").trim().split(/[\s_]+/).filter(Boolean);
    const first = words[0] || "";
    if (first && publisher && (publisher.startsWith(first) || first.startsWith(publisher))) words.shift();
    const wanted = normTextbookWord(subject);
    let consumed = "";
    for (let i = 0; wanted && i < words.length; i++) {
      consumed += words[i];
      if (normTextbookWord(consumed).startsWith(wanted)) {
        words.splice(0, i + 1);
        break;
      }
    }
    return { publisher, subject, unit: words.join(" ") };
  }
  function compareTextbookRows(a, b) {
    const order = (exam) => {
      const at = TEXTBOOK_SUBJECT_ORDER.indexOf(textbookParts(exam).subject);
      return at < 0 ? TEXTBOOK_SUBJECT_ORDER.length : at;
    };
    const byText = (x, y) => String(x).localeCompare(String(y), "ko", { numeric: true });
    return (
      order(a) - order(b) ||
      byText(a.school || "", b.school || "") ||
      byText(textbookParts(a).unit || a.topic || "", textbookParts(b).unit || b.topic || "")
    );
  }
  function examRowRangeText(exam) {
    const units = (list) => unique(list.map((value) => String(value || "").trim())).join(" ~ ");
    const ranges = (exam.courseRanges || [])
      .map((range) => ({ course: range.standardCourse || "", text: units([range.rangeStartUnit, range.rangeEndUnit]) }))
      .filter((range) => range.text);
    if (!ranges.length) return units([exam.rangeStartUnit, exam.rangeEndUnit]);
    return ranges.length === 1 ? ranges[0].text : ranges.map((range) => `${range.course} ${range.text}`.trim()).join(" · ");
  }
  // ---- 여러 시험지 한꺼번에 출제 (2026-11-22) ----
  // 학교별 기출 목록의 원본 줄(맨 앞 칸)·유사 시험지 줄에 체크 칸을 두고, 고른 시험지를 한 번에 출제 패널(items[])로 넘긴다.
  // 고른 것은 이 화면(메모리)에만 있다: 필터·검색·쪽을 바꿔도 남고, 저장소·서버에는 쓰지 않는다. 고른 순서가 출제 순서다.
  const multiPicked = [];
  const multiPickedExams = () => {
    const exams = catalogExams();
    return multiPicked.map((file) => exams[examIndexOf({ file })]).filter(Boolean);
  };
  function multiPickButton(exam, index, extraClass = "") {
    const on = multiPicked.includes(exam.file);
    return button("multi-pick", "함께 출제",
      `type="button" role="checkbox" aria-checked="${on}" class="multi-pick${on ? " on" : ""}${extraClass}" data-exam="${index}" title="한꺼번에 출제할 시험지로 고르기" aria-label="${esc(O.displayTitle(exam))} 한꺼번에 출제할 시험지로 고르기"`);
  }
  function multiBarMarkup() {
    const n = multiPicked.length;
    if (!n) return "";
    const stacked = state.sources.length ? " stacked" : "";
    return `<div class="floating finder-selection-bar multi-assign-bar${stacked}" role="region" aria-label="한꺼번에 출제"><strong>고른 시험지 ${n}개</strong><div class="actions">${button("multi-pick-clear", "선택 지우기")}${button("multi-assign", `${n}개 시험지 한꺼번에 출제`, 'class="primary"')}</div></div>`;
  }
  // 체크 칸과 아래 단추를 다시 그리지 않고 제자리에서 맞춘다(목록 위치·열린 대화상자를 건드리지 않는다).
  function refreshMultiPick() {
    const exams = catalogExams();
    document.querySelectorAll('[data-action="multi-pick"]').forEach((el) => {
      const file = exams[Number(el.dataset.exam)]?.file;
      const on = multiPicked.includes(file);
      el.setAttribute("aria-checked", String(on));
      el.classList.toggle("on", on);
      if (el.classList.contains("lead")) el.closest(".exam-row")?.classList.toggle("multi-on", on);
    });
    const slot = document.querySelector("[data-multi-slot]");
    if (slot) slot.innerHTML = multiBarMarkup();
  }
  function toggleMultiPick(exam) {
    if (!exam?.file) return;
    const at = multiPicked.indexOf(exam.file);
    if (at < 0) multiPicked.push(exam.file);
    else multiPicked.splice(at, 1);
    refreshMultiPick();
  }
  function clearMultiPick() {
    multiPicked.length = 0;
    refreshMultiPick();
  }
  function similarCellMarkup(exam, index, pairs, multi = false) {
    const sets = pairs.setsFor(exam.file);
    if (!sets.length) return '<div class="exam-row-sim none">유사문제 없음</div>';
    if (sets.length === 1) {
      const set = sets[0];
      const setIndex = examIndexOf(set);
      const setTitle = O.displayTitle(set);
      return `<div class="exam-row-sim has"><div class="exam-row-sim-head"><strong>유사문제</strong>${set.qCount ? ` <span>· ${esc(set.qCount)}문항</span>` : ""}</div><div class="exam-row-sim-actions" role="group" aria-label="${esc(setTitle)} 열기·출제">${multi ? multiPickButton(set, setIndex) : ""}${button("source-output-direct", "열기", `type="button" data-exam="${setIndex}" data-mode="exam" aria-label="${esc(setTitle)} 시험지 열기"`)}${button("source-issue", "출제", `type="button" class="primary" data-exam="${setIndex}" aria-label="${esc(setTitle)} 반에 출제"`)}</div></div>`;
    }
    return `<div class="exam-row-sim has"><div class="exam-row-sim-head"><strong>유사문제</strong> <span>${sets.length}세트</span></div><div class="exam-row-sim-actions">${button("similar-list", "보기", `type="button" data-exam="${index}" aria-label="${esc(O.displayTitle(exam))} 유사문제 ${sets.length}세트 보기"`)}</div></div>`;
  }
  // options: { at } relative-day label, { range } show the unit range, { more } 더보기 menu, { selected }.
  function examRowMarkup(exam, index, options = {}) {
    const pairs = options.pairs || similarPairs();
    const kind = O.materialKind?.(exam) || "exam";
    const year = String(exam.year || "").slice(-2);
    const title = O.displayTitle(exam);
    // The spine already shows year and grade, so an exam row title is school + term only; any missing field keeps the full title.
    const period = exam.examType === "mid" ? "중간고사" : exam.examType === "final" ? "기말고사" : "";
    // 교과서 줄: 출판사·과목이 단원 이름 위에 먼저 읽히고, 옆 띠에는 학년과 "교과서"를 보인다(연도·학교 자리).
    const book = kind === "textbook" ? textbookParts(exam) : null;
    const shortTitle = book
      ? book.unit || title
      : exam.school && period && exam.semester && kind === "exam"
        ? `${exam.school} ${exam.semester}학기 ${period}` : title;
    const subject = exam.primaryStandardCourse || unique((exam.courseRanges || []).map((range) => range.standardCourse)).join(" · ") || (globalThis.ExamDisplayTitle?.displaySubjectOfExam?.(exam) ?? exam.subject);
    const meta = [book ? "" : subject, exam.qCount ? `${exam.qCount}문항` : "", options.at ? relativeDayLabel(options.at) : ""]
      .filter(Boolean).join(" · ");
    const badges = `${kind !== "exam" && exam.contentType ? badge(exam.contentType) : ""}${exam.gradeConflict ? badge("학년 충돌", "warn") : ""}`;
    const originalFile = kind === "similar" ? pairs.originalFileFor(exam.file) : null;
    const original = originalFile ? catalogExams()[examIndexOf({ file: originalFile })] : null;
    const tag = original
      ? `<div class="exam-row-tag">${esc(O.displayTitle(original))} 기출의 유사문제</div>`
      : book
        ? `<div class="exam-row-tbhead">${esc([book.publisher, book.subject].filter(Boolean).join(" · "))}</div>`
        : "";
    const range = options.range ? examRowRangeText(exam) : "";
    const withSimilarCell = kind === "exam";
    const similarCount = withSimilarCell ? pairs.setsFor(exam.file).length : 0;
    const direct = ([mode, label]) =>
      button("source-output-direct", label, `type="button" data-exam="${index}" data-mode="${mode}"`);
    const titleButton = button("source-output-direct", esc(shortTitle), `type="button" class="exam-row-title" title="${esc(title)}" aria-label="${esc(title)} 시험지 열기" data-exam="${index}" data-mode="exam"`);
    const picked = options.multi && multiPicked.includes(exam.file);
    const more = options.more
      ? `<details class="finder-card-more"><summary>더보기</summary><div class="finder-card-more-menu">${button("source-toggle", options.selected ? "선택됨" : "문항 선택", `data-exam="${index}" aria-pressed="${!!options.selected}" class="small"`)}</div></details>`
      : "";
    return `<article class="exam-row ${gradeClass(exam.grade)}${options.selected ? " selected" : ""}${picked ? " multi-on" : ""}${options.multi ? " has-pick" : ""}${withSimilarCell ? "" : " no-sim"}" data-similar-count="${similarCount}">
      ${options.multi ? multiPickButton(exam, index, " lead") : ""}<div class="exam-row-spine"><span class="exam-row-year">${esc(book ? exam.grade || "–" : year || "–")}</span><span class="exam-row-grade">${esc(book ? "교과서" : exam.grade || "")}</span></div>
      <div class="exam-row-main">${book ? tag + titleButton : titleButton + tag}<div class="exam-row-meta">${esc(meta)}${badges}</div>${range ? `<div class="exam-row-range">범위 ${esc(range)}</div>` : ""}</div>
      <div class="exam-row-actions" role="group" aria-label="${esc(title)} 시험지·해설·정답·출제">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(direct).join("")}${button("source-issue", "출제", `type="button" class="primary" data-exam="${index}" aria-label="${esc(title)} 반에 출제"`)}${more}</div>
      ${withSimilarCell ? similarCellMarkup(exam, index, pairs, options.multi) : ""}
    </article>`;
  }
  // Two or more similar sets: one dialog lists them with the same four buttons as the exam.
  function openSimilarList(exam) {
    const sets = similarPairs().setsFor(exam?.file);
    if (!sets.length) return;
    const rows = sets.map((set) => {
      const setIndex = examIndexOf(set);
      const setTitle = O.displayTitle(set);
      const detail = [set.primaryStandardCourse || globalThis.ExamDisplayTitle?.displaySubjectOfExam?.(set) || set.subject, set.qCount ? `${set.qCount}문항` : ""].filter(Boolean).join(" · ");
      const direct = ([mode, label]) =>
        button("source-output-direct", label, `type="button" data-exam="${setIndex}" data-mode="${mode}"`);
      return `<article class="similar-set"><div class="similar-set-main"><strong>${esc(setTitle)}</strong><div class="muted">${esc(detail)}</div></div><div class="similar-set-actions" role="group" aria-label="${esc(setTitle)} 시험지·해설·정답·출제">${multiPickButton(set, setIndex)}${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(direct).join("")}${button("source-issue", "출제", `type="button" class="primary" data-exam="${setIndex}" aria-label="${esc(setTitle)} 반에 출제"`)}</div></article>`;
    }).join("");
    showDialog(`${O.displayTitle(exam)} · 유사문제`, `<p class="muted">이 기출의 유사문제 ${sets.length}세트입니다.</p><div class="similar-sets">${rows}</div>`);
  }
  const homeExamRowMarkup = ({ index, exam, at }) => examRowMarkup(exam, index, { at });
  // ---- First screen first (2026-11-10) ----------------------------------------------------------
  // The catalog (tens of thousands of questions) takes seconds to download, verify and resolve. The home,
  // 보관함 and 출제 내역 do not need it, so they are drawn first. The two home parts that read the catalog
  // (school chips, recent exam rows) start as placeholders of the final height and are filled in place.
  const HOME_CHIP_PLACEHOLDERS = 8; // homeSchoolChips() returns at most 8
  const bootWaitText = '<p class="boot-wait-text"><span data-boot-label>자료 준비 중</span> <span data-boot-count aria-hidden="true"></span></p><div class="boot-progress-track" aria-hidden="true"><span class="boot-progress-bar" data-boot-bar></span></div>';
  // The home needs only the exam list: the small list it opened on (state.light) or the full catalog.
  const hasExamList = () => Boolean(state.catalog || state.light);
  function homeChipsMarkup() {
    if (!hasExamList())
      return state.bootError ? "" : '<span class="home-chip is-pending" aria-hidden="true"></span>'.repeat(HOME_CHIP_PLACEHOLDERS);
    return homeSchoolChips().map(({ school }) => button("home-school", esc(school), `type="button" class="home-chip" data-school="${esc(school)}"`)).join("");
  }
  function homeRecentTitle() {
    if (!hasExamList()) return readRecentExams().length ? "최근 연 기출" : "최근 연도 기출";
    return homeExamList().kind === "opened" ? "최근 연 기출" : "최근 연도 기출";
  }
  function homeRecentBodyMarkup() {
    if (!hasExamList()) {
      if (state.bootError)
        return `<p class="callout danger" role="alert">${esc(state.bootError)} ${button("boot-retry", "다시 시도", 'class="small"')}</p>`;
      return `<div class="home-recent-pending" data-boot-wait="loading" aria-busy="true"><div class="home-recent-skeleton" aria-hidden="true"><span></span><span></span><span></span></div><div class="home-recent-status">${bootWaitText}</div></div>`;
    }
    const examList = homeExamList();
    return examList.rows.length
      ? `<div class="exam-rows">${examList.rows.map(homeExamRowMarkup).join("")}</div>`
      : '<p class="muted">기출 목록을 불러오면 이곳에 표시됩니다.</p>';
  }
  // Called when the exam list or the catalog arrives (or fails): replaces only the two placeholder hosts, so text typed in
  // the search box and keyboard focus stay where they are.
  function fillHomeFromCatalog() {
    if (state.view !== "home") return;
    const chips = document.querySelector('[data-home-fill="chips"]');
    const body = document.querySelector('[data-home-fill="recent"]');
    const title = document.getElementById("home-recent-title");
    if (chips) chips.innerHTML = homeChipsMarkup();
    if (title) title.textContent = homeRecentTitle();
    if (body) body.innerHTML = homeRecentBodyMarkup();
  }
  const PREPARING_TITLES = { find: "학교별 기출", compose: "문제지 만들기", health: "자료 점검" };
  // Body of a screen that cannot be drawn before the catalog: the screen name and the live progress.
  // The menu already switched; when the catalog is ready the real screen replaces this by itself.
  function preparingMarkup() {
    const title = (isQuickAssessmentView() && Quick?.PRODUCTS[state.view]?.title) || PREPARING_TITLES[state.view] || "아카이브";
    if (state.bootError)
      return `<section class="panel boot-wait" data-boot-wait="failed"><h1>${esc(title)}</h1><p class="callout danger" role="alert">${esc(state.bootError)}</p><p>${button("boot-retry", "다시 시도", 'class="primary"')}</p></section>`;
    return `<section class="panel boot-wait" data-boot-wait="loading" aria-busy="true"><h1>${esc(title)}</h1>${bootWaitText}<p class="muted">자료 준비가 끝나면 이 화면이 저절로 열립니다.</p></section>`;
  }
  function renderHome() {
    const recent = drafts().slice(0, 3);
    // 학교 기출 is the search above; the four quick assessments come first, 모의고사(생성문제) last.
    const products = HOME_PRODUCT_REGISTRY
      .filter((product) => product.productKey !== "school-exams")
      .sort((a, b) => (a.productKey === "generated-bank") - (b.productKey === "generated-bank"));
    const productMarkup = (product) => {
      const count = Quick?.PRODUCTS?.[
        { "five-minute-test": "five-minute", "subunit-assessment": "subunit-test", "unit-assessment": "unit-test", "exam-prep": "monthly-test" }[product.productKey]
      ]?.count;
      return button(
        "home-product",
        `<span>${esc(product.label)}</span>${count ? `<span class="home-quick-count"><span class="home-quick-num">${count}</span>문항</span>` : '<span class="home-quick-open">열기</span>'}`,
        `type="button" class="home-quick-item" data-product-key="${esc(product.productKey)}" data-route-owner="${esc(product.routeOwner || "")}" data-availability="${String(product.availability)}"`,
      );
    };
    return `<div class="archive-home">
      <h1 class="visually-hidden">JS 아카이브 홈</h1>
      <div class="home-top">
        <section class="home-find" aria-labelledby="home-find-title">
          <h2 id="home-find-title" class="home-title">학교 기출 찾기</h2>
          <form id="archive-home-search" class="home-search" role="search">
            <label class="visually-hidden" for="archive-home-query">학교, 학년, 시험으로 검색</label>
            <input id="archive-home-query" type="search" placeholder="순천고 고1 1학기 중간" autocomplete="off" enterkeyhint="search">
            ${button("home-search", "찾기", 'type="button" class="primary home-search-submit"')}
          </form>
          <p class="home-hint">학교, 학년, 시험을 띄어 쓰면 모두 맞는 시험지만 나옵니다. 유사문제가 있는 기출은 옆에 함께 나옵니다.</p>
          <div class="home-chips" aria-label="시험지가 많은 학교"><span class="home-chip-list" data-home-fill="chips">${homeChipsMarkup()}</span>${button("home-all-schools", "전체 학교", 'type="button" class="home-link"')}</div>
        </section>
        <section class="home-units" aria-labelledby="home-units-title">
          <h2 id="home-units-title" class="home-title">단원별로 난이도 골라 주기</h2>
          <div class="home-grades">${HOME_GRADES.map(([label, id]) => `<a class="home-grade grade-${id}" href="unit-past-exams.html?ready=1&amp;grade=${id}">${label}</a>`).join("")}</div>
          <p class="home-hint">학년을 누르면 그 학년의 단원별 기출이 열립니다.</p>
        </section>
      </div>
      <section class="home-recent" aria-labelledby="home-recent-title">
        <div class="home-section-head"><h2 id="home-recent-title">${homeRecentTitle()}</h2>${button("home-all-schools", "학교별 기출 전체 보기", 'type="button" class="home-link"')}</div>
        <div data-home-fill="recent">${homeRecentBodyMarkup()}</div>
      </section>
      <div class="home-bottom">
        <section class="home-drafts" aria-labelledby="home-drafts-title">
          <h2 id="home-drafts-title">만들던 문제지</h2>
          ${recent.length
            ? recent.map((d, i) => `<div class="home-draft"><div class="home-draft-main"><div class="home-draft-title">${esc(d.header?.title || d.title || "문제지")}</div><div class="home-draft-meta">${esc(new Date(d.updatedAt).toLocaleString("ko-KR"))} · ${d.selected?.length || 0}문항 · ${d.round || 1}차</div></div><div class="home-draft-actions">${button("restore", "이어하기", `type="button" data-draft="${i}"`)}${button("delete-draft", "삭제", `type="button" data-draft-id="${esc(d.draftId)}" class="danger" aria-label="${esc(d.header?.title || d.title || "문제지")} 삭제"`)}</div></div>`).join("")
            : '<p class="muted home-empty">저장된 작업이 없습니다.</p>'}
        </section>
        <section class="home-quick" aria-labelledby="home-quick-title">
          <h2 id="home-quick-title">빠른 평가</h2>
          <div class="home-quick-list">${products.map(productMarkup).join("")}</div>
        </section>
        <section class="home-forms" aria-labelledby="home-forms-title">
          <h2 id="home-forms-title">수업 양식</h2>
          <ul class="home-form-list">${HOME_FORMS.map((form) => `<li><a class="home-form-link" href="${esc(form.href)}"><span class="home-form-text"><strong>${esc(form.label)}</strong><span class="home-form-note">${esc(form.note)}</span></span><span class="home-quick-open">열기</span></a></li>`).join("")}</ul>
        </section>
      </div>
    </div>`;
  }

  // "순천고 고1 기출 14개": the conditions in words, then what is being counted.
  function findSummaryText(filters, count) {
    const query = String(filters.query || "").trim();
    const squash = (value) => String(value || "").replace(/\s+/g, "");
    const parts = [];
    if (query) parts.push(query);
    if (filters.school && !squash(query).includes(squash(filters.school))) parts.push(filters.school);
    if (filters.grade && !squash(query).includes(filters.grade)) parts.push(filters.grade);
    if (filters.axis) {
      const label = finderAxisLabel(filters.axis);
      if (!squash(query).includes(squash(label))) parts.push(label);
    }
    if (filters.yearFrom || filters.yearTo) parts.push(`${filters.yearFrom || "…"}~${filters.yearTo || "…"}년`);
    const material = filters.material;
    const kind = material === "exam" ? "기출" : material === "textbook" ? "교과서" : material ? "기출 외 시험지" : "시험지";
    // With no condition the heading uses the name of the view the teacher chose.
    const viewName = material === "exam" ? "학교 기출" : material === "textbook" ? "교과서" : material ? "기출 외 시험지" : "전체 시험지";
    return `${parts.length ? `${parts.join(" ")} ${kind}` : viewName} ${count.toLocaleString()}개`;
  }
  // Nothing in 학교 기출: say so, and tell the teacher when the same conditions do match other material
  // (counted only now, never during a normal render).
  function emptyFindMarkup() {
    const f = state.find;
    if (f.material === "exam" && !f.similarOnly) {
      const other = findExams({ ...f, material: "nonexam" }).length;
      if (other)
        return `<div class="empty find-empty-other"><p>학교 기출에는 없습니다. 기출 외 시험지에 ${other.toLocaleString()}개가 있습니다.</p>${button("material", "기출 외 시험지 보기", 'data-material="nonexam" class="primary"')}</div>`;
    }
    return '<div class="empty">현재 조건에 맞는 자료가 없습니다. 학교·연도·교육과정 중 하나를 넓혀 보세요.</div>';
  }
  function renderFind() {
    reconcileFinderSchool(state.find);
    const exams = findExams();
    const lastPage = Math.max(0, Math.ceil(exams.length / 18) - 1);
    if (state.page > lastPage) {
      state.page = lastPage;
      replaceFinderUrlState();
    }
    const page = exams.slice(state.page * 18, (state.page + 1) * 18);
    const pairs = similarPairs();
    const withSimilar = exams.filter((exam) => pairs.setsFor(exam.file).length).length;
    const showSimilarFilter = findSimilarFilterApplies(state.find);
    const rows = page
      .map((e) => examRowMarkup(e, examIndexOf(e), {
        pairs, range: true, more: true, multi: true, selected: state.sources.includes(e.file),
      }))
      .join("");
    return `<div class="finder-surface find-surface"><div class="intro finder-intro"><h1>학교별 기출</h1>${button("go-compose", "문제지 만들기")}</div>
      <div class="material-switch" aria-label="찾을 시험지 종류">${[["exam","학교 기출"],["textbook","교과서"],["nonexam","기출 외 시험지"],["","전체"]].map(([value,label]) => button("material",label,`data-material="${value}" aria-pressed="${value === "nonexam" ? !!state.find.material && state.find.material !== "exam" && state.find.material !== "textbook" : (state.find.material || "") === value}"`)).join("")}</div><div class="material-nav" ${!state.find.material || state.find.material === "exam" || state.find.material === "textbook" ? "hidden" : ""}><label>자료 종류<select data-filter="material" data-group="find">${options([{value:"exam",label:"학교 기출"},{value:"textbook",label:"교과서"},{value:"nonexam",label:"기출 외 전체"},{value:"similar",label:"유사문제 · 유형"},{value:"unit",label:"단원평가"},{value:"other",label:"기타 자료"}],state.find.material,"전체 자료")}</select></label></div>
      <section class="find-panel" aria-label="검색 조건">${finderSearchMarkup(state.find)}${finderQuickMarkup(state.find)}<div class="find-options">${showSimilarFilter ? `<label class="find-check"><input type="checkbox" data-filter="similarOnly" data-group="find"${state.find.similarOnly ? " checked" : ""}>유사문제 있는 시험만</label>` : ""}${finderMoreFiltersMarkup(state.find)}</div>${finderActiveMarkup(state.find)}</section>
      ${state.find.material && state.find.material !== "exam" && state.find.material !== "textbook" ? '<a class="assessment-entry" href="assessment/assessment-mvp.html"><span><strong>평가 보관함</strong><small>진단·단원·학기 평가용으로 준비된 시험지</small></span><span>시험지 보기</span></a>' : ""}
      ${lightResultsPending() ? '<p class="muted find-light-note" role="status" aria-live="polite">문항 단위 검색을 준비하는 중…</p>' : ""}
      <div class="find-resultbar"><h2>${esc(findSummaryText(state.find, exams.length))}</h2>${showSimilarFilter && withSimilar ? `<span class="find-sim-count">유사문제 있는 시험 ${withSimilar.toLocaleString()}개</span>` : ""}${exams.length ? '<span class="find-multi-hint">체크하면 여러 시험지를 한꺼번에 출제할 수 있습니다.</span>' : ""}</div>
      <div class="exam-rows find-rows">${showSimilarFilter && exams.length ? '<div class="exam-rows-head" aria-hidden="true"><span>기출</span><span>이 시험의 유사문제</span></div>' : ""}${rows}</div>
      ${!exams.length ? (lightResultsPending() ? '<div class="empty find-empty-pending">문항까지 찾는 중입니다. 준비가 끝나면 결과가 나옵니다.</div>' : emptyFindMarkup()) : ""}
      <div class="pager">${button("page-prev", "이전", state.page === 0 ? "disabled" : "")}<span>${state.page + 1} / ${Math.max(1, Math.ceil(exams.length / 18))}</span>${button("page-next", "다음", (state.page + 1) * 18 >= exams.length ? "disabled" : "")}</div>
      <div class="multi-assign-slot" data-multi-slot>${multiBarMarkup()}</div>
      ${state.sources.length ? `<div class="floating finder-selection-bar"><strong>선택한 시험 ${state.sources.length}개</strong><div class="actions">${button("sources-clear", "선택 비우기")}${button("go-compose", "선택한 자료로 문제지 만들기", 'data-use-sources="true"')}</div></div>` : ""}</div>`;
  }
  // Korean labels for every exclusion reason code that basicEligibility and the
  // canonical assignment validator can emit. An unknown code is still shown
  // (with its raw code) so a nonzero reason can never be hidden.
  const HEALTH_REASON_LABELS = {
    identity: "문항 식별 정보 확인 필요",
    source: "원본 무결성 확인 필요",
    source_release: "승인된 원본 버전과 불일치",
    source_issue: "원본 문제 의심(보류)",
    solution: "정답·해설 수리 필요",
    SOURCE_GRADE_UNRESOLVED: "출처 학년 확인 불가",
    SOURCE_GRADE_CONFLICT: "출처 학년과 문항 학년 충돌",
    taxonomy: "승인된 단원 분류 없음(분류 항목 종합)",
    course_namespace_invalid: "학년·교육과정·과목 조합 확인 필요",
    assignment_missing: "승인된 단원 배정 없음",
    assignment_conflict: "단원 배정이 둘 이상",
    assignment_identity_mismatch: "단원 배정과 문항 식별 불일치",
    assignment_fingerprint_mismatch: "단원 배정 지문 불일치",
    assignment_not_approved: "단원 배정 미승인",
    assignment_review_evidence_missing: "단원 배정 검수 근거 없음",
    assignment_taxonomy_version_mismatch: "단원 배정의 분류 버전 불일치",
    assignment_target_mismatch: "단원 배정과 문항 분류 불일치",
    canonical_parent_missing: "기준 단원 목록에 없음",
    canonical_authority_missing: "기준 분류 정보 없음",
    canonical_validator_unavailable: "기준 분류 검사기 사용 불가",
    source_identity_unverified: "문항 식별 미검증",
    source_identity_conflict: "문항 식별 충돌",
    review: "검수 보류·제외",
    semantic: "의미 분류 보류·제외",
    applicability: "기본 출력 범위 밖",
    conflict: "원본 분류 정보 충돌",
  };
  function healthExclusionRows(reasons) {
    return Object.entries(reasons || {})
      .filter(([, count]) => Number(count) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]) || a[0].localeCompare(b[0]))
      .map(([code, count]) => ({ code, count: Number(count), label: HEALTH_REASON_LABELS[code] || "" }));
  }
  // Counts of general-use records (one per UID) by how the unified unit list places them.
  function unifiedHealth() {
    const index = unifiedIndex();
    if (!index) return null;
    const result = { placed: 0, unit: 0, unclassified: 0, unplaced: 0, unplacedReasons: {} };
    const seen = new Set();
    for (const record of state.catalog.records) {
      if (!record.questionUid || seen.has(record.questionUid) || !C.generalUseEligibility(record).ok) continue;
      seen.add(record.questionUid);
      const entry = index.byUid.get(record.questionUid);
      if (!entry) {
        const reason = Unified.classify(record).reason || "UNPLACED";
        result.unplaced++;
        result.unplacedReasons[reason] = (result.unplacedReasons[reason] || 0) + 1;
        continue;
      }
      result.placed++;
      if (entry.unclassified) result.unclassified++;
      else result.unit++;
    }
    return result;
  }
  // Both counts are needed only by the 자료 점검 screen; they used to be computed at boot (about 1s).
  function ensureHealthStats() {
    if (state.healthComposeScope !== null || !state.catalog?.records) return;
    state.healthUnified = unifiedHealth();
    state.healthComposeScope = state.healthUnified
      ? state.healthUnified.placed
      : state.catalog.records.reduce(
        (n, record) => n + (C.generalUseEligibility(record).ok && workspaceScopeParent(record) ? 1 : 0), 0);
  }
  function renderHealth() {
    ensureHealthStats();
    const h = state.catalog.health,
      total = Number(h.questions) || 0,
      fmt = (n) => Number(n || 0).toLocaleString(),
      composeScope = state.healthComposeScope,
      rows = healthExclusionRows(h.exclusionReasons);
    return `<div class="intro"><div><h1>데이터 상태</h1><p class="muted">전체 자료, 검수까지 끝난 범위, 문제지 만들기 범위를 구분합니다. 제외 사유는 서로 중복될 수 있습니다.</p></div>${button("health-export", "진단 JSON 내보내기")}</div><div class="metrics">${[
      ["시험", h.exams],
      ["전체 문항", h.questions],
      ["검수까지 끝난 문항", h.automatic],
      ["문제지 만들기 범위에 포함", composeScope],
      ...(state.healthUnified
        ? [["단원에 배치", state.healthUnified.unit], ["단원 미분류로 제공", state.healthUnified.unclassified], ["학년 근거 없어 제외", state.healthUnified.unplaced]]
        : []),
      ["metadata records", h.metadataRecords],
    ]
      .map(
        ([l, n]) =>
          `<div class="metric"><span class="muted">${l}</span><strong>${n == null ? "확인 불가" : fmt(n)}</strong></div>`,
      )
      .join(
        "",
      )}</div><section class="panel"><h2>검수까지 끝난 문항에서 빠진 이유</h2><table class="health-table"><tbody>${rows.length
      ? rows
          .map(
            ({ code, count, label }) =>
              `<tr><th>${label ? `${esc(label)} <span class="muted">(${esc(code)})</span>` : esc(code)}</th><td>${fmt(count)}${total ? ` <span class="muted">· ${((count / total) * 100).toFixed(1)}%</span>` : ""}</td></tr>`,
          )
          .join("")
      : '<tr><th>제외 사유 없음</th><td>0</td></tr>'}</tbody></table><div class="callout">검수까지 끝난 문항은 단원 분류와 검수가 모두 끝난 문항입니다(엄격한 기준이며 사용 조건이 아닙니다). 문제지 만들기는 원본 식별·무결성이 확인된 모든 문항을 제공합니다. 원본에 대한 검수·품질 표시(보류 표시 등)와 메타데이터 검수 대기는 사용을 막지 않고 별도 검수 라인에서 처리합니다. 미분류는 보류와 다른 상태이며 기존 난이도 하·중·상을 숫자로 추정하지 않습니다. 검수 대기나 원본 불일치는 원본 시험 열기를 막지 않습니다.</div><div class="callout">${state.healthUnified ? `교육과정 통합 표시: 문제지 만들기는 2015·2022 개정 문항을 2022 개정 단원 기준 하나의 목록으로 묶어 보여줍니다. 묶음은 표시와 선택에만 적용하며 문항의 원본 교육과정·키·메타데이터는 바꾸지 않습니다. 원본 교육과정은 세부 조건에서 고를 수 있습니다. 단원 근거가 없는 문항은 학년·과목별 ‘단원 미분류’로 제공합니다.${Object.entries(state.healthUnified.unplacedReasons).map(([code, count]) => ` ${esc(UNPLACED_REASON_LABELS[code] || code)} ${fmt(count)}개는 학년이 없어 학년별 목록에 넣지 못했습니다.`).join("")} ` : ""}교육과정 간 연결 검수(엄격한 승인 지표): 기존 연결 ${state.crosswalkInventory?.total ?? "확인 불가"}개 · 승인된 EXACT ${state.crosswalkInventory?.reviewedExact ?? "확인 불가"}개. <a href="data/archive2-crosswalk-inventory.json" target="_blank">연결 근거 보기</a> · <a href="data/archive2-unified-unit-policy.json" target="_blank">통합 표시 정책</a></div><p class="muted">정본: RPM Primary v1.0 · Difficulty v1.3 · Metadata Contract v2<br>문항 목록 버전 ${esc(state.catalog.indexVersion.slice(0, 16))}</p></section>${renderUnlinkedSimilar()}`;
  }
  // Similar sets whose original exam could not be told for certain (see archive2-similar.js).
  function renderUnlinkedSimilar() {
    const pairs = similarPairs();
    const rows = pairs.unlinked || [];
    const title = `원본 기출과 연결되지 않은 유사문제 ${rows.length.toLocaleString()}개`;
    if (!rows.length) return `<p class="muted health-unlinked-none">${esc(title)}</p>`;
    return `<details class="health-unlinked"><summary>${esc(title)}</summary><p class="muted">같은 학교·학년·연도·학기·시험의 기출을 하나로 정할 수 없는 유사문제입니다. 틀린 짝보다 짝이 없는 편이 안전해서 연결하지 않았습니다. 파일 이름을 <code>&lt;원본 기출 이름&gt;_유사</code> 꼴로 고치면 연결됩니다.</p><table class="health-table"><tbody>${rows.map(({ exam, reason }) =>
      `<tr><th>${esc(String(exam.file || "").split("/").pop().replace(/\.js$/i, ""))}</th><td>${esc(reason)}</td></tr>`).join("")}</tbody></table></details>`;
  }
  Object.assign(WS.api, {
    HOME_PRODUCT_REGISTRY,
    HOME_FORMS,
    homeProductMarkup,
    scheduleFinderFilterRender,
    finderCourseOptions,
    reconcileFinderFilters,
    applyFinderFilterChange,
    finderFamilyLabel,
    finderAxisLabel,
    finderResettable,
    finderSearchMarkup,
    finderPublishersMarkup,
    textbookParts,
    FINDER_TERMS,
    finderQuickMarkup,
    finderFileLabel,
    finderActiveMarkup,
    finderMoreFiltersMarkup,
    findSearchText,
    applyDefaultFinderMaterial,
    findExams,
    compareFindRows,
    renderOriginalReceipts,
    RECENT_EXAMS_KEY,
    RECENT_EXAMS_MAX,
    readRecentExams,
    rememberRecentExam,
    homeSchoolChips,
    relativeDayLabel,
    startOfDay,
    homeExamList,
    NO_SIMILAR,
    similarPairs,
    findSimilarFilterApplies,
    examIndexOf,
    recentTarget,
    examRowRangeText,
    similarCellMarkup,
    examRowMarkup,
    multiPickedExams,
    toggleMultiPick,
    clearMultiPick,
    openSimilarList,
    homeExamRowMarkup,
    HOME_CHIP_PLACEHOLDERS,
    bootWaitText,
    homeChipsMarkup,
    homeRecentTitle,
    homeRecentBodyMarkup,
    fillHomeFromCatalog,
    lightFindUsable,
    PREPARING_TITLES,
    preparingMarkup,
    renderHome,
    findSummaryText,
    emptyFindMarkup,
    renderFind,
    HEALTH_REASON_LABELS,
    healthExclusionRows,
    unifiedHealth,
    ensureHealthStats,
    renderHealth,
    renderUnlinkedSimilar,
  });
})();
