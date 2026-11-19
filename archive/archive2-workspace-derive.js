// Archive2 workspace, derive part: "이 시험지로 다시 만들기" (기준 시험지로 다시 만들기) 작은 창, 진입, 문제지 만들기로 넘기기.
// 선정 규칙은 archive2-derive.js(순수 함수)에 있고, 여기는 화면·원본 확인(정답·해설 빈 문항)·넘기기만 맡는다.
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const C = window.Archive2Core;
  const O = window.Archive2Output;
  const Source = window.Archive2Source;
  const Unified = window.Archive2UnifiedUnits;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, api, applyUidRoute, button, esc, generate, rememberCurrentHistoryEntry, replaceUrlState, resetWorkingDraft,
    routeUrl, save, showDialog, state, status, teacherErrorMessage, unifiedIndex, workspaceEligibility;
  WS.links.push(() => {
    ({
      $, api, applyUidRoute, button, esc, generate, rememberCurrentHistoryEntry, replaceUrlState, resetWorkingDraft,
      routeUrl, save, showDialog, state, status, teacherErrorMessage, unifiedIndex, workspaceEligibility
    } = WS.api);
  });
  const Derive = () => window.Archive2Derive;
  const LEVEL_NAME = Object.freeze({ same: "기본", "up-some": "응용", "up-one": "심화" });
  const LEVEL_HINT = Object.freeze({
    same: "기준과 같은 난이도 분포",
    "up-some": "절반쯤 한 단계 위로",
    "up-one": "모두 한 단계 위로 (5단계는 그대로)",
  });
  const TYPE_NAME = Object.freeze({ same: "같은 유형", different: "다른 유형" });
  const TYPE_HINT = Object.freeze({
    same: "같은 단원·같은 세부 유형의 다른 문항으로",
    different: "같은 단원에서 유형이 다른 문항으로",
  });
  const SOURCE_NAME = Object.freeze({ all: "전체", school: "학교 기출", similar: "유사", textbook: "교과서", workbook: "교재" });
  const KIND_NAME = Object.freeze({ school: "학교 기출", similar: "유사", textbook: "교과서", workbook: "교재" });
  const OLD_FORMAT_MESSAGE = "옛 형식 출제본이라 다시 뽑기를 지원하지 않습니다.";
  const MAX_BASE = 400;
  // dlg: the open dialog's choices and result.
  V.derive = { dlg: null, index: null, indexFor: null, unifiedFor: null, publishers: null, pending: null, busy: false, fileIndex: null };

  const text = (value) => (value == null ? "" : String(value)).trim();

  // ---- 색인 ----
  function eligible(record) {
    return Boolean(C.difficultyEligible && C.difficultyEligible(record)) && workspaceEligibility(record).ok;
  }
  function deriveIndex() {
    const D = Derive();
    const unified = unifiedIndex();
    if (!D || !unified || !state.catalog?.records) return null;
    const V2 = V.derive;
    if (V2.indexFor !== state.catalog.records || V2.unifiedFor !== unified) {
      V2.index = D.buildDeriveIndex(state.catalog.records, { unified, projectionPolicy: state.catalog.projectionPolicy, eligible });
      V2.indexFor = state.catalog.records;
      V2.unifiedFor = unified;
      V2.publishers = null;
      V2.fileIndex = null;
    }
    return V2.index;
  }
  function publishers() {
    const index = deriveIndex();
    if (!index) return [];
    if (!V.derive.publishers) {
      const found = new Set();
      for (const cand of index.byUid.values()) if (cand.srcKind === "textbook" && cand.publisher) found.add(cand.publisher);
      V.derive.publishers = [...found].sort((a, b) => a.localeCompare(b, "ko"));
    }
    return V.derive.publishers;
  }

  // ---- 기준 문항 되찾기: UID가 없는 옛 출제본은 원본 파일 + 문항 순번(번호)으로 찾는다 ----
  function fileIndex() {
    if (!V.derive.fileIndex) {
      const byOrdinal = new Map(), byNo = new Map();
      for (const record of state.catalog?.records || []) {
        const file = text(record.sourceFile);
        if (!record.questionUid || !file) continue;
        byOrdinal.set(`${file}#${record.sourceOrdinal}`, record.questionUid);
        const no = text(record.sourceQuestionNo);
        if (no) byNo.set(`${file}@${no}`, byNo.has(`${file}@${no}`) ? "" : record.questionUid);
      }
      V.derive.fileIndex = { byOrdinal, byNo };
    }
    return V.derive.fileIndex;
  }
  function normalizeFile(file) {
    return text(file).replace(/\\/g, "/").replace(/^\/?(?:archive\/)?exams\//, "").replace(/^\/+/, "");
  }
  // item: { uid, file, ordinal, no } → the catalog UID, or "" when it cannot be told.
  function resolveBaseItem(item) {
    const uid = text(item?.uid);
    if (uid && state.byUid?.has(uid)) return uid;
    const file = normalizeFile(item?.file);
    if (!file) return "";
    const index = fileIndex();
    const ordinal = Number(item?.ordinal);
    if (Number.isInteger(ordinal) && ordinal > 0) {
      const hit = index.byOrdinal.get(`${file}#${ordinal}`) || index.byOrdinal.get(`exams/${file}#${ordinal}`);
      if (hit) return hit;
    }
    const no = text(item?.no);
    return no ? index.byNo.get(`${file}@${no}`) || "" : "";
  }
  // The questions of an envelope / a message → identity items (never the problem text).
  function deriveItemsFromEnvelope(envelope) {
    const uids = Array.isArray(envelope?.questionUids) ? envelope.questionUids : [];
    const questions = Array.isArray(envelope?.questions) ? envelope.questions : [];
    const count = Math.max(uids.length, questions.length);
    const items = [];
    for (let i = 0; i < count; i++) {
      const q = questions[i] || {};
      items.push({
        uid: text(uids[i] || q.questionUid || q.source_question_uid || q._sourceQuestionUid),
        file: text(q.sourceArchiveFile || q.sourceFile || q._sourceFile),
        ordinal: Number(q.sourceOrdinal || q._sourceQuestionOrdinal) || 0,
        no: text(q.sourceQuestionNo ?? q._sourceQuestionNo),
      });
    }
    return items;
  }
  function deriveResolveBase(items) {
    const uids = [], seen = new Set();
    let unresolved = 0, recovered = 0;
    for (const item of (items || []).slice(0, MAX_BASE)) {
      const direct = text(item?.uid) && state.byUid?.has(text(item.uid));
      const uid = resolveBaseItem(item);
      if (!uid) { unresolved++; continue; }
      if (!direct) recovered++;
      if (seen.has(uid)) continue;
      seen.add(uid);
      uids.push(uid);
    }
    return { uids, unresolved, recovered };
  }

  // ---- 문구 ----
  const unitLabelOf = (uid) => unifiedIndex()?.byUid.get(uid)?.unitLabel || "";
  function sourceLabelOf(record) {
    const D = Derive();
    const src = D.sourceKindOf(record, null);
    const kind = KIND_NAME[src.kind] || "";
    if (src.kind === "school") {
      const no = record.sourceQuestionNo ?? record.sourceOrdinal;
      return [[record.year, record.school].filter(Boolean).join(" ") || kind, no ? `${no}번` : ""].filter(Boolean).join(" ");
    }
    return [kind, src.publisher].filter(Boolean).join(" ");
  }
  const baseTitleOf = (dlg) => dlg.baseTitle || "기준 시험지";

  // ---- 진입 ----
  function openDialog(dlg) {
    V.derive.dlg = dlg;
    renderDialog();
  }
  function newDialog({ baseUids, baseTitle, note, preset }) {
    return {
      baseUids, baseTitle, note: note || "",
      typeMode: preset?.typeMode || "same",
      level: preset?.level || "same",
      source: preset?.source || "all",
      publisher: preset?.publisher || "",
      seed: preset?.seed || freshSeed(),
      exclude: [...(preset?.exclude || [])],
      result: null, error: "",
    };
  }
  const freshSeed = () => crypto.randomUUID().slice(0, 8);
  // items: identity items from a window message or an envelope. A paper that cannot be traced says so and stops there.
  function deriveStartFromItems(items, { title, note } = {}) {
    if (!state.catalog?.records) { status("자료를 준비하는 중입니다. 준비가 끝나면 이어서 진행합니다."); V.derive.pending = { items, title, note }; return; }
    const base = deriveResolveBase(items);
    if (!base.uids.length) {
      showDialog("이 시험지로 다시 만들기",
        `<p class="error" role="alert" data-derive-unsupported>${esc(OLD_FORMAT_MESSAGE)}</p><p class="muted">시험지를 새로 만들려면 문제지 만들기에서 직접 고르세요.</p>`);
      return;
    }
    const notes = [];
    if (base.recovered) notes.push(`옛 출제본이라 원본 파일·번호로 ${base.recovered}문항을 찾았습니다.`);
    if (base.unresolved) notes.push(`기준 문항 ${base.unresolved}개는 지금 자료에서 찾지 못해 뺐습니다.`);
    if (note) notes.push(note);
    if (!deriveIndex()) { status("문항 목록을 준비하지 못했습니다. 새로고침한 뒤 다시 시도해 주세요.", true); return; }
    openDialog(newDialog({ baseUids: base.uids, baseTitle: title, note: notes.join(" ") }));
  }
  function openDeriveFromUrl() {
    const wanted = [...new Set(new URLSearchParams(location.search).getAll("derive").map(text).filter(Boolean))].slice(0, MAX_BASE);
    // A request that arrived before the catalog was ready waits here; an address with ?derive= is the fallback of the output window.
    startFromPending();
    if (!wanted.length) return;
    deriveStartFromItems(wanted.map((uid) => ({ uid })), { title: "기준 시험지" });
    try { replaceUrlState(); } catch {}
  }
  function startFromPending() {
    const pending = V.derive.pending;
    if (!pending || !state.catalog?.records) return;
    V.derive.pending = null;
    deriveStartFromItems(pending.items, pending);
  }
  // A small window (mixed_engine) asks this page, which holds the catalog, to open the dialog.
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "archive2-derive-request" || event.origin !== location.origin) return;
    if (!Array.isArray(data.items) || !data.items.length || data.items.length > MAX_BASE) return;
    try { event.source?.postMessage({ type: "archive2-derive-ack" }, location.origin); } catch {}
    const items = data.items.map((item) => ({ uid: text(item?.uid), file: text(item?.file), ordinal: Number(item?.ordinal) || 0, no: text(item?.no) }));
    try { window.focus(); } catch {}
    deriveStartFromItems(items, { title: text(data.title).slice(0, 80), note: data.assignment ? "출제한 시험지의 유형·난이도는 지금 자료 기준입니다." : "" });
  });
  // 출제 내역 row: the assignment's own paper (the server replays what was issued).
  async function startFromAssignment(assignmentId) {
    const id = text(assignmentId);
    if (!id) return;
    const row = (state.recentRows || []).find((a) => String(a.id) === id);
    status("출제한 시험지를 불러오고 있습니다.");
    try {
      const data = await api(`/class-exam-assignments/${encodeURIComponent(id)}/output?mode=exam`);
      const envelope = data?.envelope;
      if (!envelope) throw new Error("출제 당시 내용을 불러오지 못했습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
      status("");
      deriveStartFromItems(deriveItemsFromEnvelope(envelope), { title: row?.title || envelope.meta?.title || "출제한 시험지", note: "출제한 시험지의 유형·난이도는 지금 자료 기준입니다." });
    } catch (error) {
      status(teacherErrorMessage(error, "출제한 시험지를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요."), true, error);
    }
  }
  // 문제지 만들기의 "다시 뽑기": same choices, new seed, and what was already given is left out (the chain).
  async function startFromCompose() {
    const info = state.derive;
    if (!info || !Array.isArray(info.baseUids) || !info.baseUids.length) return;
    if (!deriveIndex()) { status("문항 목록을 준비하지 못했습니다. 새로고침한 뒤 다시 시도해 주세요.", true); return; }
    const dlg = newDialog({
      baseUids: info.baseUids, baseTitle: info.baseTitle,
      preset: { typeMode: info.typeMode, level: info.level, source: info.source, publisher: info.publisher, exclude: [...(info.exclude || []), ...(info.resultUids || [])] },
    });
    openDialog(dlg);
    await runDerive();
  }

  // ---- 화면 ----
  function optionRadios(name, values, names, hints, current) {
    return values.map((value) => `<label class="derive-choice"><input type="radio" name="derive-${name}" value="${esc(value)}" data-derive-field="${name}"${current === value ? " checked" : ""}> <span><strong>${esc(names[value])}</strong>${hints[value] ? `<small>${esc(hints[value])}</small>` : ""}</span></label>`).join("");
  }
  function optionsMarkup(dlg) {
    const pubs = publishers();
    const pubOptions = [`<option value="">전체 출판사</option>`, ...pubs.map((name) => `<option value="${esc(name)}"${dlg.publisher === name ? " selected" : ""}>${esc(name)}</option>`)].join("");
    return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · 기준 ${dlg.baseUids.length}문항</p>
      ${dlg.note ? `<p class="muted derive-note">${esc(dlg.note)}</p>` : ""}
      <fieldset class="derive-group"><legend>유형</legend><div class="derive-choices">${optionRadios("typeMode", ["same", "different"], TYPE_NAME, TYPE_HINT, dlg.typeMode)}</div></fieldset>
      <fieldset class="derive-group"><legend>난이도</legend><div class="derive-choices">${optionRadios("level", ["same", "up-some", "up-one"], LEVEL_NAME, LEVEL_HINT, dlg.level)}</div></fieldset>
      <div class="derive-group derive-source"><label>어디서 뽑을지
        <select data-derive-field="source">${Object.keys(SOURCE_NAME).map((key) => `<option value="${key}"${dlg.source === key ? " selected" : ""}>${esc(SOURCE_NAME[key])}</option>`).join("")}</select></label>
        <label class="derive-publisher"${dlg.source === "textbook" ? "" : " hidden"}>출판사<select data-derive-field="publisher"${dlg.source === "textbook" ? "" : " disabled"}>${pubOptions}</select></label></div>
      <p id="derive-error" class="error" role="alert"${dlg.error ? "" : " hidden"}>${esc(dlg.error)}</p>
      <div class="actions">${button("derive-run", "다시 뽑기", 'class="primary"')}</div>`;
  }
  function resultMarkup(dlg) {
    const out = dlg.result;
    const summary = out.summary;
    const count = out.items.length;
    const choices = `${TYPE_NAME[dlg.typeMode]} · ${LEVEL_NAME[dlg.level]}${dlg.source !== "all" ? ` · ${SOURCE_NAME[dlg.source]}${dlg.source === "textbook" && dlg.publisher ? ` ${esc(dlg.publisher)}` : ""}` : ""}`;
    if (!count) {
      return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · ${esc(choices)}</p>
        <p class="error" role="alert" data-derive-empty>이 조건에서는 뽑을 문항을 찾지 못했습니다. 유형·난이도·출처를 바꿔 다시 시도해 보세요.</p>
        ${noteList(dlg)}<div class="actions">${button("derive-edit", "조건 바꾸기", 'class="primary"')}</div>`;
    }
    const rows = out.perItem.map((item, i) => ({ item, i })).filter(({ item }) => item.pickedUid).map(({ item }, n) => {
      const record = out.items.find((r) => r.questionUid === item.pickedUid);
      const unit = unitLabelOf(item.pickedUid);
      const step = record?.difficultyBucket ? `${record.difficultyBucket}단계` : "";
      const rung = Derive().RUNG_LABEL[item.rung] || "";
      return `<li><span class="derive-q">${esc([unit, record ? sourceLabelOf(record) : ""].filter(Boolean).join(" · "))}</span> <span class="derive-meta">${esc([step, rung].filter(Boolean).join(" · "))}</span></li>`;
    }).join("");
    const mark = (summary.text || "").trim();
    return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · ${esc(choices)}</p>
      <p class="derive-total" data-derive-summary><strong>${count}문항</strong>${count < dlg.baseUids.length ? ` (기준 ${dlg.baseUids.length}문항)` : ""}${mark ? ` · ${esc(mark)}` : ""}</p>
      <p class="derive-level" data-derive-level>${esc(summary.levelText)}</p>
      ${noteList(dlg)}
      <details class="derive-list"><summary>뽑힌 문항 ${count}개 보기</summary><ol>${rows}</ol></details>
      <p id="derive-error" class="error" role="alert"${dlg.error ? "" : " hidden"}>${esc(dlg.error)}</p>
      <div class="actions derive-actions">${button("derive-popup", "시험지 열기", 'class="primary"')}${button("derive-compose", "문제지 만들기에서 이어서")}${button("derive-again", "다시 뽑기")}${button("derive-edit", "조건 바꾸기")}</div>`;
  }
  function noteList(dlg) {
    const notes = [...(dlg.result?.notes || [])];
    return notes.length ? `<ul class="derive-notes" data-derive-notes>${notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>` : "";
  }
  function renderDialog() {
    const dlg = V.derive.dlg;
    if (!dlg) return;
    const body = V.derive.busy
      ? `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · 기준 ${dlg.baseUids.length}문항</p><p class="muted" role="status" aria-busy="true">문항을 고르고 원본의 정답·해설을 확인하고 있습니다…</p>`
      : dlg.result ? resultMarkup(dlg) : optionsMarkup(dlg);
    showDialog("이 시험지로 다시 만들기", `<div class="derive-dialog">${body}</div>`);
  }
  document.addEventListener("change", (event) => {
    const field = event.target?.closest?.("[data-derive-field]");
    const dlg = V.derive.dlg;
    if (!field || !dlg || dlg.result) return;
    const name = field.dataset.deriveField;
    dlg[name] = field.value;
    if (name === "source") {
      const select = document.querySelector('select[data-derive-field="publisher"]');
      const label = document.querySelector(".derive-publisher");
      if (select) select.disabled = dlg.source !== "textbook";
      if (label) label.hidden = dlg.source !== "textbook";
      if (dlg.source !== "textbook") dlg.publisher = "";
    }
  });

  // ---- 뽑기 ----
  function sourceSpec(dlg) {
    if (dlg.source === "textbook") return dlg.publisher ? { kind: "textbook", publisher: dlg.publisher } : "textbook";
    return dlg.source === "all" ? "all" : dlg.source;
  }
  async function runDerive() {
    const dlg = V.derive.dlg;
    const D = Derive();
    const index = deriveIndex();
    if (!dlg || !D || !index || V.derive.busy) return;
    V.derive.busy = true;
    dlg.error = "";
    renderDialog();
    try {
      // Picking reads the catalog only: no source exam file is requested here (the originals are read when the paper is opened).
      const out = D.deriveFromPaper(dlg.baseUids, {
        typeMode: dlg.typeMode, level: dlg.level, sources: sourceSpec(dlg), seed: dlg.seed,
        exclude: dlg.exclude, includeBlank: true,
      }, index);
      const notes = [...(out.summary.notes || [])];
      if (dlg.typeMode === "same" && out.summary.counts && out.items.length &&
          out.summary.counts.type + out.summary.counts.concept + out.summary.counts.subunit + out.summary.counts.unit + out.summary.counts.none > 0)
        notes.unshift("같은 세부 유형이 모자란 자리는 한 단계씩 넓혀(같은 유형 → 같은 개념 → 같은 단원) 채웠습니다.");
      out.notes = notes;
      dlg.result = out;
    } catch (error) {
      dlg.error = teacherErrorMessage(error, "문항을 고르지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      console.warn("[archive2] derive failed:", error);
    } finally {
      V.derive.busy = false;
      renderDialog();
    }
  }
  function again() {
    const dlg = V.derive.dlg;
    if (!dlg?.result) return;
    // What was just given is left out of the next result, and the seed changes (a different tie-break too).
    dlg.exclude = [...new Set([...dlg.exclude, ...dlg.result.items.map((record) => record.questionUid)])];
    dlg.seed = freshSeed();
    dlg.result = null;
    runDerive();
  }

  // ---- 시험지 열기(작은 창) ----
  function gradeSubjectOf(records) {
    const entry = unifiedIndex()?.byUid.get(records[0]?.questionUid);
    const subject = entry && Unified?.subjectByValue ? Unified.subjectByValue(entry.grade, entry.subject)?.label || "" : "";
    return { grade: entry?.grade || "", subject };
  }
  // The window is opened here, before the first await, while the click is still a user gesture.
  function openPopup() {
    const dlg = V.derive.dlg;
    if (!dlg?.result?.items.length || V.derive.busy) return;
    const popup = window.open("about:blank", "_blank");
    if (!popup) { setError("새 창을 열 수 없습니다. 팝업 설정을 확인하세요."); return; }
    popup.document.body.textContent = "시험지를 준비하고 있습니다.";
    (async () => {
      try {
        const records = dlg.result.items;
        // The only place the originals are read: the questions of the paper being opened.
        const questions = await Source.restore(records, state.catalog);
        if (questions.some((q) => !q)) throw new Error("원본 문항을 불러오지 못했습니다. 다시 뽑아 주세요.");
        const questionUids = records.map((record) => record.questionUid);
        const { grade, subject } = gradeSubjectOf(records);
        const title = `${baseTitleOf(dlg)} 다시 만들기`.slice(0, 70);
        const meta = {
          title, customTitle: title, identityTitle: title, count: records.length, grade, subject, questionUids,
          printHeaderOptions: { title, subtitle: "", metaRight: "AP수학", showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
          includeQr: false, qpp: 4, sourceType: "mixed", indexVersion: state.catalog.indexVersion,
        };
        const envelope = await O.publishOutputEnvelope({
          sourceKind: "archive2-compose", sourceId: crypto.randomUUID(), mode: "exam",
          questionCount: records.length, questionUids, meta, questions,
        });
        popup.location.replace(O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, { studio: true }).href);
        status(`다시 만든 ${records.length}문항 시험지를 열었습니다.`);
      } catch (error) {
        popup.close();
        setError(teacherErrorMessage(error, "시험지를 준비하지 못했습니다. 잠시 뒤 다시 시도해 주세요."));
        console.warn("[archive2] derive popup failed:", error);
      }
    })();
  }
  function setError(message) {
    const dlg = V.derive.dlg;
    if (dlg) dlg.error = message;
    const slot = $("derive-error");
    if (slot) { slot.textContent = message; slot.hidden = false; }
    else status(message, true);
  }

  // ---- 문제지 만들기로 넘기기: 고른 문항 UID 목록이 범위(검색에서 고른 문항과 같은 길)이고, 서버가 같은 목록으로 다시 확인한다 ----
  function toCompose() {
    const dlg = V.derive.dlg;
    if (!dlg?.result?.items.length || V.derive.busy) return;
    if (state.saveResultState === "RESULT_UNKNOWN") { setError("현재 저장 결과를 먼저 확인한 뒤 이어서 진행하세요."); return; }
    const uids = dlg.result.items.map((record) => record.questionUid);
    const info = {
      baseUids: [...dlg.baseUids], baseTitle: dlg.baseTitle.slice(0, 120), typeMode: dlg.typeMode, level: dlg.level, source: dlg.source, publisher: dlg.publisher,
      seed: dlg.seed, exclude: [...dlg.exclude].slice(-4000), resultUids: uids,
      text: dlg.result.summary.text || "", levelText: dlg.result.summary.levelText || "", notes: (dlg.result.notes || []).slice(0, 6).map((note) => String(note).slice(0, 300)),
    };
    if (state.selected.length) save();
    rememberCurrentHistoryEntry();
    resetWorkingDraft();
    state.view = "compose";
    state.editSavedPaperId = "";
    state.urlUids = uids;
    applyUidRoute();
    if (state.uidRoute?.error) { setError(state.uidRoute.error); return; }
    state.derive = info;
    state.title = `${baseTitleOf(dlg)} 다시 만들기`.slice(0, 80);
    state.header = { ...state.header, title: state.title };
    if ($("modal")?.open) $("modal").close();
    history.pushState({ archive2ScrollY: 0 }, "", routeUrl());
    generate(false);
    status(state.selected.length === uids.length
      ? `다시 만든 ${uids.length}문항으로 문제지를 만들었습니다.`
      : `다시 만든 ${uids.length}문항 중 ${state.selected.length}문항이 문제지에 들어갔습니다.`);
  }

  // 문제지 만들기 결과 요약에 붙는 안내(지금 문항이 다시 만든 그대로일 때만)
  function deriveNoteMarkup() {
    const info = state.derive;
    if (!info || !Array.isArray(info.resultUids) || !state.selected.length) return "";
    const current = new Set(state.selected.map((record) => record.questionUid));
    if (current.size !== info.resultUids.length || info.resultUids.some((uid) => !current.has(uid))) return "";
    const parts = [info.text, info.levelText].filter(Boolean);
    return `<div class="callout derive-compose-note" role="status" data-derive-compose-note><strong>${esc(info.baseTitle || "기준 시험지")} 다시 만들기</strong> · ${esc(TYPE_NAME[info.typeMode] || "")} · ${esc(LEVEL_NAME[info.level] || "")}${parts.length ? `<p>${parts.map(esc).join("<br>")}</p>` : ""}${(info.notes || []).length ? `<ul>${info.notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>` : ""}<p>${button("derive-compose-again", "다시 뽑기", 'class="small"')}</p></div>`;
  }

  // ---- 단추 ----
  async function deriveAction(name, element) {
    if (name === "derive-run") return runDerive();
    if (name === "derive-again") return again();
    if (name === "derive-edit") { const dlg = V.derive.dlg; if (dlg) { dlg.result = null; dlg.error = ""; renderDialog(); } return undefined; }
    if (name === "derive-popup") return openPopup();
    if (name === "derive-compose") return toCompose();
    if (name === "derive-compose-again") return startFromCompose();
    if (name === "assignment-derive") return startFromAssignment(element?.dataset?.assignment);
    return undefined;
  }
  Object.assign(WS.api, {
    deriveAction,
    deriveNoteMarkup,
    deriveStartFromItems,
    deriveResolveBase,
    deriveItemsFromEnvelope,
    openDeriveFromUrl,
  });
})();
