/* 실패 문구를 "일반 문구 + 어느 시험지 몇 번 문항인지 한 줄 + 접힌 상세" 세 층으로 만든다 (2026-11-18).
   - 화면마다 문구를 따로 만들지 않도록 문구를 만드는 곳은 describe() 한 곳이다.
   - 오류를 만든 쪽이 손에 든 파일·문항 번호·UID·코드를 error.apDetail에 싣고(annotate), 화면은 describe()로 읽는다.
     apDetail = { file, title, questionNo, uid, code, reason, failures: [{file, title, questionNo, uid, code, reason, raw}] }
   - 한글 한 문장은 그대로 일반 문구가 된다. 한글이 없는 원문(영문·코드)은 버리지 않고 상세의 "원문"에 남긴다.
   - 여러 문항이 실패하면 처음 5개만 나열하고 "외 N개"로 줄인다.
   - 상세는 버튼으로 열고 닫고(키보드 가능), 복사 버튼이 한 덩어리 글(파일·번호·코드·원문 200자·화면·시각)을 클립보드에 넣는다.
   의존성 없음. 브라우저에서는 window.Archive2ErrorDetail, 노드에서는 require로 쓴다. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.Archive2ErrorDetail = api;
    try { if (root.document && typeof root.document.addEventListener === "function") api.install(root.document); } catch { /* 화면 없이도 쓸 수 있다 */ }
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const HANGUL = /[가-힣]/;
  const CODE_PREFIX = /^[A-Z][A-Z0-9_]{3,}:\s*/;
  const WHOLE_CODE = /^([A-Z][A-Z0-9_]{3,})(?::(\S*))?$/;
  const GENERIC_MESSAGE = "작업을 처리하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
  const LOCATED_MESSAGE = "문제지를 불러오지 못했습니다.";
  const MAX_LISTED = 5;
  const MAX_COPY_LINES = 20;
  const DETAIL_RAW_LIMIT = 600;
  const COPY_RAW_LIMIT = 200;

  // 코드 → 선생님이 읽는 이유. error.apDetail.reason이 있으면 그것이 먼저다.
  const REASONS = {
    QUESTION_NOT_FOUND: "원본 파일에서 이 문항을 찾지 못했습니다.",
    QUESTION_CONTENT_CHANGED: "원본 파일의 이 문항이 목록에 기록된 내용과 달라졌습니다.",
    QUESTION_UID_MISMATCH: "이 문항의 고유 번호가 원본 파일에서의 위치와 맞지 않습니다.",
    SOURCE_META_CONFLICT: "목록의 분류 정보와 원본 파일의 분류 정보가 서로 다릅니다.",
    SOURCE_FETCH_FAILED: "원본 파일을 내려받지 못했습니다.",
    SOURCE_CHANGED: "원본 파일이 목록을 만든 뒤에 바뀌었습니다. 새로고침이 필요합니다.",
    SOURCE_EVALUATE_FAILED: "원본 파일을 읽는 중 오류가 났습니다. 파일 내용에 문제가 있을 수 있습니다.",
    SOURCE_BANK_MISSING: "원본 파일에서 문항 목록을 찾지 못했습니다.",
    SOURCE_HASH_MISSING: "원본 파일을 확인할 기준값이 없습니다.",
    SOURCE_BAD_PATH: "원본 파일 경로가 올바르지 않습니다.",
    GENERATED_RESTORE_FAILED: "유사 문항을 불러오지 못했습니다.",
    GENERATED_QUESTION_NOT_SELECTABLE: "이 유사 문항은 지금 선택할 수 없는 상태입니다.",
    GENERATED_CONSUMER_SHARD_SCHEMA_INVALID: "유사 문항 자료의 형식이 올바르지 않습니다.",
    GENERATED_UID_ORDINAL_NOT_UNIQUE: "유사 문항 자료에서 이 문항이 하나로 정해지지 않습니다.",
    GENERATED_QUESTION_PAYLOAD_INCOMPLETE: "유사 문항 자료에 빠진 내용이 있습니다.",
    GENERATED_CONTENT_FINGERPRINT_MISMATCH: "유사 문항 내용이 목록에 기록된 내용과 다릅니다.",
    GENERATED_QUESTION_UID_CONFLICT: "유사 문항의 고유 번호가 목록과 다릅니다.",
    GENERATED_REVIEW_ARTIFACT_CONFLICT: "유사 문항의 검수 기록이 목록과 다릅니다.",
    GENERATED_INDEX_SHARD_CONFLICT: "유사 문항 자료가 목록과 서로 다릅니다.",
    GENERATED_SHARD_LOAD_FAILED: "유사 문항 자료를 내려받지 못했습니다.",
  };

  const text = (value) => String(value ?? "").trim();
  const clip = (value, limit) => {
    const raw = text(value).replace(/\s+/g, " ");
    return raw.length > limit ? raw.slice(0, limit) + "…" : raw;
  };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function displayTitleApi() {
    if (root && root.ExamDisplayTitle) return root.ExamDisplayTitle;
    if (typeof module === "object" && module.exports && typeof require === "function") {
      try { return require("./exam-display-title.js"); } catch { /* 없어도 파일명을 정리해 보여 준다 */ }
    }
    return null;
  }

  // 선생님이 읽는 이름: 시험지 제목이 있으면 제목, 없으면 파일명에서 확장자·밑줄을 정리한 이름.
  function fileLabel(file, title) {
    const given = text(title);
    if (given) return given;
    const path = text(file);
    if (!path) return "";
    if (/^MIXED:/i.test(path)) return "단원별 문제지";
    const name = path.split(/[?#]/)[0].split(/[\\/]/).pop().replace(/\.js$/i, "");
    if (!name) return "";
    const reader = displayTitleApi();
    if (reader && typeof reader.readableExamTitle === "function") {
      const readable = reader.readableExamTitle(name);
      if (readable && readable !== name) return readable;
    }
    return name.replace(/_기출(?:_?c(?:ontent)?)?$/i, "").replace(/_+/g, " ").trim() || name;
  }

  // 오류 객체에 파일·문항 번호 같은 위치 정보를 실어 올린다. 이미 채워진 값(더 안쪽에서 아는 값)은 덮어쓰지 않는다.
  function annotate(error, extra) {
    const target = error && typeof error === "object" ? error : new Error(text(error));
    const current = target.apDetail && typeof target.apDetail === "object" ? target.apDetail : {};
    const next = { ...current };
    for (const [key, value] of Object.entries(extra || {})) {
      if (value === undefined || value === null || value === "") continue;
      if (next[key] === undefined || next[key] === null || next[key] === "") next[key] = value;
    }
    try { target.apDetail = next; } catch { /* 얼린 객체는 그대로 둔다 */ }
    return target;
  }

  function failureOf(error) {
    const detail = error && typeof error === "object" && error.apDetail ? error.apDetail : {};
    if (Array.isArray(detail.failures) && detail.failures.length) return detail.failures;
    const message = text(typeof error === "string" ? error : error?.message);
    return [{
      file: detail.file, title: detail.title, questionNo: detail.questionNo, ordinal: detail.ordinal, uid: detail.uid,
      code: detail.code, reason: detail.reason, raw: clip(text(error?.data?.error) || message, COPY_RAW_LIMIT),
    }];
  }

  // 여러 작업 중 일부가 실패해도 전부 끝까지 기다려 실패한 것을 모두 모은다. 하나라도 실패하면 첫 오류를 그대로 던지되
  // apDetail.failures에 실패 전체를 싣는다(성공/실패 판정은 Promise.all과 같다).
  async function allOrReport(promises) {
    const results = await Promise.allSettled(promises);
    const failed = results.filter((result) => result.status === "rejected");
    if (!failed.length) return results.map((result) => result.value);
    const failures = failed.flatMap((result) => failureOf(result.reason));
    const first = failed[0].reason;
    const error = first && typeof first === "object" ? first : new Error(text(first));
    try { error.apDetail = { ...(error.apDetail || {}), failures }; } catch { /* 얼린 객체 */ }
    throw error;
  }

  function reasonOf(failure) {
    if (text(failure.reason)) return text(failure.reason);
    const code = text(failure.code).split(":")[0];
    return REASONS[code] || "";
  }
  function numberPart(failure, short) {
    const no = text(failure.questionNo);
    if (no) return /^\d+$/.test(no) ? (short ? `${no}번` : `${no}번 문항`) : (short ? no : `${no} 문항`);
    const ordinal = text(failure.ordinal);
    if (ordinal) return short ? `${ordinal}번째` : `${ordinal}번째 문항`;
    const uid = text(failure.uid);
    return uid ? (short ? uid : `문항 ${uid}`) : "";
  }
  function labelOf(failure) {
    return fileLabel(failure.file, failure.title) || "";
  }
  function hasLocation(failure) {
    return Boolean(labelOf(failure) || text(failure.questionNo) || text(failure.ordinal) || text(failure.uid));
  }

  function whereOf(failures) {
    const located = failures.filter(hasLocation);
    if (!located.length) return "";
    if (located.length === 1) {
      const only = located[0];
      const head = [labelOf(only), numberPart(only, false)].filter(Boolean).join(", ");
      const reason = reasonOf(only);
      // 시험지 이름만 알고 번호도 이유도 모르면 한 줄에 쓸 말이 없다(이름은 상세에 있다).
      if (!numberPart(only, false) && !reason) return "";
      return reason ? `${head}: ${reason}` : head;
    }
    // 같은 시험지의 문항은 이름을 한 번만 쓴다: "2024 금당중 ... 23번, 24번 / 다른 시험지 3번".
    const groups = new Map();
    for (const item of located.slice(0, MAX_LISTED)) {
      const label = labelOf(item);
      if (!groups.has(label)) groups.set(label, []);
      const no = numberPart(item, true);
      if (no) groups.get(label).push(no);
    }
    const shown = [...groups].map(([label, numbers]) => [label, numbers.join(", ")].filter(Boolean).join(" ")).join(" / ");
    const more = located.length - MAX_LISTED;
    const reasons = new Set(located.map(reasonOf).filter(Boolean));
    const shared = reasons.size === 1 ? ` ${[...reasons][0]}` : "";
    return `${located.length}개 문항: ${shown}${more > 0 ? ` 외 ${more}개` : ""}.${shared}`;
  }

  function lineOf(failure) {
    const extras = [text(failure.file) ? `파일 ${text(failure.file)}` : "", text(failure.uid) ? `UID ${text(failure.uid)}` : "", text(failure.code)].filter(Boolean);
    return [labelOf(failure), numberPart(failure, true), extras.length ? `(${extras.join(", ")})` : ""].filter(Boolean).join(" ");
  }

  function describe(input, ctx) {
    ctx = ctx && typeof ctx === "object" ? ctx : {};
    const error = input && typeof input === "object" ? input : null;
    const message = text(typeof input === "string" ? input : error?.message);
    const serverRaw = text(error?.data?.error);
    const raw = serverRaw || message;
    const stripped = raw.replace(CODE_PREFIX, "");
    const wholeCode = WHOLE_CODE.exec(raw);
    const detail = error?.apDetail && typeof error.apDetail === "object" ? error.apDetail : {};
    const failures = Array.isArray(detail.failures) && detail.failures.length
      ? detail.failures
      : (hasLocation(detail) ? [detail] : []);
    const code = text(detail.code || error?.code || (wholeCode ? wholeCode[0] : (CODE_PREFIX.test(raw) ? raw.split(":")[0] : "")));
    const where = whereOf(failures);
    const hangul = HANGUL.test(stripped);
    const fallback = text(ctx.fallback);
    const headline = text(ctx.headline) ||
      (where ? (text(ctx.locatedFallback) || LOCATED_MESSAGE) : hangul ? stripped : (fallback || GENERIC_MESSAGE));
    const full = where ? `${headline} — ${where}` : headline;
    const hasDetail = Boolean(failures.length || (!hangul && raw) || (error && Number(error.status) > 0 && raw) || code || ctx.alwaysDetail);

    const first = failures[0] || {};
    const when = new Date(ctx.now ?? Date.now());
    const stamp = Number.isNaN(when.getTime()) ? "" : when.toISOString();
    const lines = (rawLimit) => {
      const out = [];
      const many = failures.length > 1; // 여럿이면 문항마다 한 줄씩 아래 목록에 쓴다.
      const label = labelOf(first);
      if (label && !many) out.push(`시험지: ${label}`);
      if (text(first.file) && !many) out.push(`파일: ${text(first.file)}`);
      const number = text(first.questionNo) || text(first.ordinal);
      if (number && !many) out.push(`문항 번호: ${number}`);
      if (text(first.uid) && !many) out.push(`문항 UID: ${text(first.uid)}`);
      if (code && !many) out.push(`오류 코드: ${code}`);
      if (error && Number(error.status) > 0) out.push(`서버 응답 상태: ${Number(error.status)}`);
      if (text(ctx.screen)) out.push(`화면: ${text(ctx.screen)}`);
      if (stamp) out.push(`시각: ${stamp}`);
      if (failures.length > 1) {
        out.push(`실패한 문항 ${failures.length}개:`);
        failures.slice(0, MAX_COPY_LINES).forEach((item) => out.push(`- ${lineOf(item)}`));
        if (failures.length > MAX_COPY_LINES) out.push(`- 외 ${failures.length - MAX_COPY_LINES}개`);
      }
      if (raw) out.push(`원문: ${clip(raw, rawLimit)}`);
      return out;
    };
    return {
      headline, where, message: full, hasDetail, code, raw, failures,
      status: error ? Number(error.status) || 0 : 0,
      detailText: lines(DETAIL_RAW_LIMIT).join("\n"),
      copyText: lines(COPY_RAW_LIMIT).join("\n"),
    };
  }

  // 상세 글은 화면 HTML에 넣지 않고 여기에 보관한다. 선생님이 "상세 보기"를 누를 때에야 상자에 채운다:
  // 서버 원문·내부 용어가 평소 화면(그리고 그 화면의 HTML)에 섞여 나오지 않게 하려는 것이다.
  const registry = new Map();
  const REGISTRY_LIMIT = 200;
  let sequence = 0;
  function lookup(id) {
    return registry.get(String(id)) || null;
  }
  // 상세 영역 HTML. 버튼 둘(상세 보기·복사)은 install()이 단 문서 클릭 처리가 움직인다.
  function markup(info) {
    if (!info || !info.hasDetail) return "";
    const id = `ap-error-detail-${++sequence}`;
    registry.set(id, { detailText: info.detailText, copyText: info.copyText });
    if (registry.size > REGISTRY_LIMIT) registry.delete(registry.keys().next().value);
    return `<div class="ap-error-detail"><button type="button" class="ap-error-detail-toggle" data-ap-error-toggle aria-expanded="false" aria-controls="${id}">상세 보기</button>` +
      `<div class="ap-error-detail-body" id="${id}" hidden><pre class="ap-error-detail-text"></pre>` +
      `<button type="button" class="ap-error-detail-copy" data-ap-error-copy data-ap-error-id="${id}">복사</button> ` +
      `<span class="ap-error-detail-note" role="status" aria-live="polite"></span></div></div>`;
  }

  function toggleFrom(button, doc) {
    const id = button.getAttribute("aria-controls");
    const panel = doc.getElementById(id);
    if (!panel) return false;
    const open = button.getAttribute("aria-expanded") !== "true";
    if (open) {
      const pre = panel.querySelector ? panel.querySelector(".ap-error-detail-text") : null;
      const entry = lookup(id);
      if (pre && entry && !pre.textContent) pre.textContent = entry.detailText;
    }
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "상세 닫기" : "상세 보기";
    return open;
  }

  async function copyText(value, env) {
    env = env || root;
    try {
      if (env.navigator?.clipboard?.writeText) { await env.navigator.clipboard.writeText(value); return true; }
    } catch { /* 아래 방법으로 다시 시도 */ }
    try {
      const doc = env.document;
      const area = doc.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      doc.body.appendChild(area);
      area.select();
      const ok = Boolean(doc.execCommand && doc.execCommand("copy"));
      doc.body.removeChild(area);
      return ok;
    } catch { return false; }
  }

  async function copyFrom(button, env) {
    const entry = lookup(button.getAttribute("data-ap-error-id"));
    const ok = entry ? await copyText(entry.copyText, env) : false;
    const note = button.parentNode?.querySelector?.(".ap-error-detail-note");
    if (note) note.textContent = ok ? "복사했습니다." : "복사하지 못했습니다. 위 글을 직접 선택해 복사해 주세요.";
    return ok;
  }

  const STYLE = `.ap-error-detail{margin:6px 0 0;font-size:14px}
.ap-error-detail-toggle,.ap-error-detail-copy{min-height:40px;padding:0 14px;border:1px solid var(--control-line);border-radius:var(--radius-pill);background:var(--surface);color:var(--ink);font:inherit;font-size:14px;cursor:pointer}
.ap-error-detail-body{margin-top:6px;padding:8px 10px;border:1px solid var(--line);border-radius:var(--radius-field);background:var(--chip);color:var(--ink)}
.ap-error-detail-text{margin:0 0 8px;white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;font-size:13px}
.ap-error-detail-note{color:var(--ink-2);font-size:13px}
/* 화면 위쪽 오류 알림 상자: 문장 아래 줄에 상세를 두고, 상세가 없으면 자리를 차지하지 않는다. */
.error-toast{flex-wrap:wrap}
.error-toast-detail{order:3;flex:1 0 100%}
.error-toast-detail:empty{display:none}
.error-toast-detail .ap-error-detail{margin:0 0 6px}`;

  function install(doc) {
    if (!doc || doc.__apErrorDetailInstalled) return;
    try { doc.__apErrorDetailInstalled = true; } catch { /* ignore */ }
    try {
      if (doc.head && typeof doc.createElement === "function" && !doc.getElementById("ap-error-detail-style")) {
        const style = doc.createElement("style");
        style.id = "ap-error-detail-style";
        style.textContent = STYLE;
        doc.head.appendChild(style);
      }
    } catch { /* 모양이 없어도 동작한다 */ }
    doc.addEventListener("click", (event) => {
      const target = event.target && event.target.closest ? event.target : null;
      const toggle = target && target.closest("[data-ap-error-toggle]");
      if (toggle) { toggleFrom(toggle, doc); return; }
      const copy = target && target.closest("[data-ap-error-copy]");
      if (copy) void copyFrom(copy, root);
    });
  }

  return { describe, annotate, allOrReport, failureOf, fileLabel, markup, lookup, install, toggleFrom, copyFrom, copyText, esc, REASONS, GENERIC_MESSAGE, LOCATED_MESSAGE };
});
