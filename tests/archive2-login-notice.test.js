// 보관함·출제 내역 without a teacher login (2026-11-10): one calm notice, no API call, no alert, no toast.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { workspaceHarness, okJson } = require("./helpers/archive2-workspace-ui-harness.cjs");

const sessionSource = fs.readFileSync(path.join(__dirname, "..", "archive", "archive2-session.js"), "utf8");
const SESSIONS = {
  student: { role: "student", session_token: "t", login_id: "s1" },
  parent: { role: "parent", session_token: "t" },
  "token without role": { session_token: "t" },
  expired: { role: "teacher", session_token: "t", expires_at: "2020-01-01T00:00:00Z" },
  none: null,
};
const TEACHER = { role: "teacher", session_token: "t", login_id: "t1" };

function harness(session, fetcher) {
  const calls = [];
  const h = workspaceHarness(async (url, options) => {
    calls.push(String(url));
    return fetcher ? fetcher(url, options) : okJson({ assignments: [], classes: [] });
  });
  vm.runInContext(sessionSource, h.ctx);
  h.ctx.localStorage.setItem("APMATH_SESSION", session === null ? "" : JSON.stringify(session));
  h.calls = calls;
  return h;
}
const viewClick = (view) => {
  const button = { dataset: { view }, disabled: false };
  return { closest: (selector) => (selector === "button" ? button : null) };
};
const click = (h, view) => h.event("click", viewClick(view), { preventDefault() {}, stopPropagation() {} });
const noAlert = (html) => assert.doesNotMatch(html, /callout danger|role="alert"|class="error/);

test("출제 내역 without a teacher session shows one login notice and never calls the API", async () => {
  for (const [label, session] of Object.entries(SESSIONS)) {
    const h = harness(session);
    h.workspace.setView("recent");
    assert.equal(await h.workspace.loadRecent(), false, label);
    assert.equal(h.calls.length, 0, label + ": no request");
    const html = h.node("content").innerHTML;
    assert.match(html, /data-login-notice="recent"/, label);
    assert.match(html, /선생님 계정으로 로그인하면 출제 내역을 볼 수 있습니다\./, label);
    assert.match(html, /<a class="button-like primary" href="\.\.\/apmath\/" target="_blank" rel="noopener">선생님 로그인<\/a>/, label);
    assert.match(html, /로그인한 뒤 이 화면으로 돌아오면 됩니다\./, label);
    assert.equal((html.match(/선생님 로그인</g) || []).length, 1, label + ": one login button");
    noAlert(html);
    assert.equal(h.node("status").textContent, "", label + ": nothing in the status line or toast");
  }
});

test("출제 내역: a 401/403 from the server (expired session) is the same single notice, not an alert", async () => {
  for (const status of [401, 403]) {
    const h = harness(TEACHER, async (url) => {
      if (String(url).endsWith("/qr-classes")) return okJson({ classes: [] });
      return { ok: false, status, json: async () => ({ error: "Unauthorized" }) };
    });
    h.workspace.setView("find");
    await click(h, "recent");
    const html = h.node("content").innerHTML;
    assert.match(html, /data-login-notice="recent"/, String(status));
    noAlert(html);
    assert.equal(h.node("status").textContent, "", String(status) + ": no second message in the status line");
    assert.equal(h.workspace.state.recentAuth, true);
  }
});

test("출제 내역: a real failure is shown once, in the list, with 다시 시도", async () => {
  const h = harness(TEACHER, async (url) => {
    if (String(url).endsWith("/qr-classes")) return okJson({ classes: [] });
    return { ok: false, status: 500, json: async () => ({ error: "출제 내역 서버가 응답하지 않습니다" }) };
  });
  h.workspace.setView("find");
  await click(h, "recent");
  assert.equal(h.node("status").textContent, "", "the list carries the message; the status line/toast does not repeat it");
  const markup = h.workspace.recentAssignmentMarkup();
  assert.equal((markup.match(/출제 내역 서버가 응답하지 않습니다/g) || []).length, 1);
  assert.match(markup, /data-action="recent-retry"[^>]*>다시 시도/);
  assert.equal(h.workspace.state.recentAuth, false);
});

test("보관함: no teacher session -> one notice, the saved-paper API is never asked", () => {
  for (const [label, session] of Object.entries(SESSIONS)) {
    const h = harness(session);
    let asked = 0;
    h.ctx.Archive2Library = { render: async () => { asked += 1; return true; }, invalidatePendingRequests() {} };
    h.workspace.setView("saved");
    h.workspace.renderContent();
    assert.equal(asked, 0, label);
    assert.equal(h.calls.length, 0, label);
    const html = h.node("content").innerHTML;
    assert.match(html, /data-login-notice="saved"/, label);
    assert.match(html, /선생님 계정으로 로그인하면 보관함을 볼 수 있습니다\./, label);
    noAlert(html);
    assert.equal(h.node("status").textContent, "");
  }
});

test("보관함: a 401/403 shows the notice; any other failure shows one alert with 다시 시도", async () => {
  const tick = () => new Promise((resolve) => setImmediate(resolve));
  for (const status of [401, 403]) {
    const h = harness(TEACHER);
    h.ctx.Archive2Library = { render: async () => { throw Object.assign(new Error("Forbidden"), { status }); }, invalidatePendingRequests() {} };
    h.workspace.setView("saved");
    h.workspace.renderContent();
    await tick();
    assert.match(h.node("content").innerHTML, /data-login-notice="saved"/);
    noAlert(h.node("content").innerHTML);
    assert.equal(h.node("status").textContent, "");
  }
  const h = harness(TEACHER);
  h.ctx.Archive2Library = { render: async () => { throw Object.assign(new Error("문제지 서버가 응답하지 않습니다"), { status: 500 }); }, invalidatePendingRequests() {} };
  h.workspace.setView("saved");
  h.workspace.renderContent();
  await tick();
  const html = h.node("content").innerHTML;
  assert.equal((html.match(/문제지 서버가 응답하지 않습니다/g) || []).length, 1);
  assert.match(html, /data-action="library-reload"[^>]*>다시 시도/);
  assert.doesNotMatch(html, /data-login-notice/);
  assert.equal(h.node("status").textContent, "", "no toast / status line copy of the same message");
});

test("the login notice puts the explanation below the button, and success sentences are not printed", () => {
  const workspace = fs.readFileSync(path.join(__dirname, "..", "archive", "archive2-workspace.js"), "utf8");
  assert.match(workspace, /<p><a class="button-like primary" href="\.\.\/apmath\/"[^>]*>선생님 로그인<\/a><\/p><p class="muted">로그인한 뒤 이 화면으로 돌아오면 됩니다\.<\/p>/);
  assert.doesNotMatch(workspace, /status\("저장한 시험지를 불러왔습니다\."\)|status\("저장한 시험지를 서버에서 불러오고 있습니다\."\)/);
  const library = fs.readFileSync(path.join(__dirname, "..", "archive", "archive2-library.js"), "utf8");
  assert.match(library, /저장한 문제지를 다시 열어/);
  assert.doesNotMatch(library, /저장한 시험지를 다시 열어/);
});
