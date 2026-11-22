/* "이 시험지로 다시 만들기" entry of the output window (mixed_engine). The window has no catalog, so it only names the
   questions of the paper (UID, source file, number: never the problem text) and asks the workspace page that opened it
   to show the dialog. Without that page it opens the workspace with the UIDs in the address. */
(function (root) {
  "use strict";
  const MAX_ITEMS = 400;
  const text = (value) => String(value ?? "").trim();

  function envelope() {
    return root.AppState?.outputEnvelope || root.__AP_OUTPUT_ENVELOPE__ || null;
  }
  // Only the teacher's own output window shows the button: not a student review, a preview frame or a QR solution page.
  function available() {
    const params = new URLSearchParams(location.search);
    return params.get("studio") === "1" && params.get("preview") !== "1" && params.get("studentReview") !== "1" &&
      params.get("qr") !== "1" && root.parent === root;
  }
  function itemsOf(output) {
    const uids = Array.isArray(output?.questionUids) ? output.questionUids : [];
    const questions = Array.isArray(output?.questions) ? output.questions : Array.isArray(root.AppState?.data) ? root.AppState.data : [];
    const count = Math.max(uids.length, questions.length);
    const items = [];
    for (let i = 0; i < count && i < MAX_ITEMS; i++) {
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
  function workspaceUrl(items) {
    const url = new URL("workspace.html", location.href);
    for (const item of items) if (item.uid) url.searchParams.append("derive", item.uid);
    return url;
  }
  function notify(message) {
    const old = document.getElementById("archive2-derive-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.id = "archive2-derive-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    toast.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;max-width:calc(100% - 32px);" +
      "background:#1f2937;color:#fff;padding:10px 16px;border-radius:10px;font:14px/1.5 system-ui,sans-serif;box-shadow:0 4px 16px #0004";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);
  }
  function start() {
    const output = envelope();
    const items = itemsOf(output);
    if (!items.length) { notify("시험지 내용을 아직 불러오는 중입니다. 잠시 뒤 다시 눌러 주세요."); return; }
    const payload = {
      type: "archive2-derive-request", version: 1,
      title: text(output?.meta?.title || output?.meta?.customTitle || ""),
      assignment: Boolean(output?.assignmentId),
      items,
    };
    let acked = false;
    const opener = root.opener && root.opener !== root && !root.opener.closed ? root.opener : null;
    const onAck = (event) => {
      if (event.origin === location.origin && event.data?.type === "archive2-derive-ack") acked = true;
    };
    root.addEventListener("message", onAck);
    if (opener) {
      try { opener.postMessage(payload, location.origin); } catch {}
    }
    // The page that opened this window answers when it is the workspace; if not (or it is gone), open the workspace here.
    setTimeout(() => {
      root.removeEventListener("message", onAck);
      if (acked) {
        try { opener.focus(); } catch {}
        notify("작업 창에서 이어서 선택해 주세요.");
        return;
      }
      const popup = root.open(workspaceUrl(items).href, "_blank");
      if (!popup) notify("작업 창을 열 수 없습니다. 팝업을 허용한 뒤 다시 눌러 주세요.");
    }, 700);
  }
  function mount() {
    if (!available()) return;
    const right = document.querySelector("#mode-ctrl .ctrl-right");
    if (!right || document.getElementById("btn-derive")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.id = "btn-derive";
    button.className = "mode-tab ctrl-btn";
    button.textContent = "이 시험지로 다시 만들기";
    button.addEventListener("click", start);
    right.insertBefore(button, right.firstChild);
  }
  root.Archive2DeriveEntry = { available, start, itemsOf };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})(typeof window !== "undefined" ? window : globalThis);
