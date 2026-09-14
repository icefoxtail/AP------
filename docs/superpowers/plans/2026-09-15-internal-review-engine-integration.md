# Internal Review Engine Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 통합된 정본 내부 수정엔진이 source-preserving 저장, 충돌 방지, persistent canonical preview, revision-safe IME 입력, 그리고 atomic session 복원을 제공하도록 만든다.

**Architecture:** `internal-review-engine.*`가 편집기 정본을 소유하고 `internal-review-live.html`은 query/hash를 보존하는 compatibility entry만 소유한다. 편집기와 최초 1회 로드된 `engine.html` 사이에는 versioned Review Preview Bridge를 두고, Bridge는 전체 snapshot을 기존 `APScreenRuntime`의 `SOURCE_CHANGE` 입력 adapter로 전달한다. 렌더링·MathJax·transaction·stale discard·rollback authority는 기존 runtime에 남기며, 저장은 source writer와 disk re-read/semantic validation을 통과한 뒤에만 반영한다.

**Tech Stack:** Browser JavaScript, File System Access API, IndexedDB, `postMessage`, existing `APScreenRuntime`, existing archive renderer/MathJax lifecycle, Node.js built-in test runner.

**Spec:** `C:\Users\USER\.codex\attachments\2558afb1-9f28-4785-958e-2fd4d5a49f5e\pasted-text.txt` (JS아카이브 내부 수정엔진 통합·성능개선 계획서 v0.3)

## Global Constraints

- 사용자에게 보이는 3열 구조와 기존 핵심 버튼/작업 순서를 유지한다.
- 저장 전까지 production 시험지 source를 변경하지 않는다.
- `Review Bridge = APScreenRuntime input adapter`; Review 전용 renderer, MathJax lifecycle, scheduler, pagination renderer를 추가하지 않는다.
- `review snapshot → serialize → Blob URL → fetch`를 정상 preview 경로로 사용하지 않는다.
- 실제 source identity를 보존하고 Blob URL을 canonical source identity로 사용하지 않는다.
- 일반 `engine.html`은 `preview=1 + reviewBridge=1`일 때만 review lifecycle을 활성화한다.
- 매 preview 요청은 `currentBank` 전체 snapshot을 전달하며 partial patch rendering은 구현하지 않는다.
- stale correctness는 `protocolVersion + bridgeEpoch + sourceEpoch + revision` 검증으로 보장하고 AbortController는 최적화로만 사용한다.
- 일반 render error는 기존 정상 preview를 유지하고 iframe full reload는 handshake/runtime fatal 상황에만 허용한다.
- preview cache-buster는 renderer URL 해석에만 적용하고 production `image` 필드는 오염시키지 않는다.
- `LAST_VISIBLE_PREVIEW_REVISION = SAVED_REVISION = POST_WRITE_VERIFIED_REVISION`인 상태에서만 같은 revision의 저장 성공을 보고한다.
- 변경이 없는 이동에는 confirm을 표시하지 않고, 미저장 변경이 있을 때만 discard guard를 표시한다.
- production 시험지 데이터와 무관한 파일은 수정하지 않는다.

---

### Task 1: Source-preserving writer and data-safety contract

**Files:**
- Create: `archive/review-source-writer.js`
- Test: `tests/archive-review-source-writer.test.mjs`
- Modify: `archive/internal-review-engine.js:340-405, 1613-1695` to consume the writer API after the module exists

**Interfaces:**
- Consumes: source text, file name, and edited question bank.
- Produces: `parseArchiveSource(source, fileName)`, `fingerprintText(source)`, `serializeQuestionBankLiteral(bank)`, `replaceQuestionBankPreservingSource(source, bank)`, and `validateRoundTrip(source, bank, fileName)`.

- [ ] **Step 1: Write the failing writer tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { parseArchiveSource, replaceQuestionBankPreservingSource, validateRoundTrip } from '../archive/review-source-writer.js';

const source = `// keep this comment\nwindow.examTitle = "보존 시험";\nwindow.examDisplayTitle = "표시 제목";\nconst helper = { keep: true };\nwindow.questionBank = [{ id: 1, content: "원본", choices: ["①"] }];\nwindow.extraMeta = { keep: "yes" };\n`;

test('parses direct window.questionBank and preserves non-bank source bytes', async () => {
  const parsed = parseArchiveSource(source, 'fixture.js');
  const edited = [{ id: 1, content: '수정', choices: ['①', '②'] }];
  const rewritten = replaceQuestionBankPreservingSource(source, edited);
  assert.match(rewritten, /keep this comment/);
  assert.match(rewritten, /window\.extraMeta = \{ keep: "yes" \}/);
  assert.deepEqual(parseArchiveSource(rewritten, 'fixture.js').bank, edited);
  assert.equal(parsed.title, '보존 시험');
});

test('rejects identifier-backed question banks instead of rewriting unknown source structure', () => {
  assert.throws(() => replaceQuestionBankPreservingSource('const bank = []; window.questionBank = bank;', []), /SOURCE_WRITER_UNSUPPORTED_SHAPE/);
});

test('round-trip validation rejects a bank that differs from the intended snapshot', async () => {
  await assert.rejects(() => validateRoundTrip(source, [{ id: 1, content: '다른 값' }], 'fixture.js'), /ROUND_TRIP_SEMANTIC_MISMATCH/);
});
```

- [ ] **Step 2: Run the writer tests and verify the missing-module failure**

Run: `node --test tests/archive-review-source-writer.test.mjs`

Expected: FAIL because `archive/review-source-writer.js` does not exist.

- [ ] **Step 3: Implement the minimal structural writer**

Implement a balanced JavaScript scanner that ignores strings, template literals, line comments, block comments, and nested brackets. Locate a direct `questionBank` assignment whose RHS begins with an array literal, or a direct `questions`/`problems` array member inside a question-bank object. Replace only that balanced expression with a deterministic literal serializer; reject identifier-backed or executable RHS values with `SOURCE_WRITER_UNSUPPORTED_SHAPE`. Execute the source in an isolated `new Function('window', source)` sandbox for parsing, accept top-level `questionBank`, `.questions`, and `.problems`, and return `{ title, displayTitle, bank, bankShape }`. Compute `fingerprintText` with SHA-256 through `crypto.subtle.digest`, returning a lowercase hex digest.

- [ ] **Step 4: Run the writer tests and verify the green result**

Run: `node --test tests/archive-review-source-writer.test.mjs`

Expected: PASS with all writer, shape-rejection, and semantic round-trip assertions green.

- [ ] **Step 5: Commit the isolated writer contract**

```powershell
git add archive/review-source-writer.js tests/archive-review-source-writer.test.mjs
git commit -m "feat(review): add source-preserving archive writer"
```

### Task 2: Atomic session persistence and revision state model

**Files:**
- Create: `archive/review-session-store.js`
- Test: `tests/archive-review-session-store.test.mjs`
- Modify: `archive/internal-review-engine.js:12-40, 1917-2108`

**Interfaces:**
- Consumes: File System handles and editor/UI state.
- Produces: `createReviewSessionStore(options)`, `buildReviewSessionSnapshot(state, ui)`, `restoreReviewSession(snapshot, diskSource, fileName)`, and state fields `sourceFingerprint`, `sourceEpoch`, `draftRevision`, `requestedPreviewRevision`, `visiblePreviewRevision`, `saveRevision`, and `postWriteVerifiedRevision`.

- [ ] **Step 1: Write failing atomic-session tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReviewSessionSnapshot, restoreReviewSession } from '../archive/review-session-store.js';

test('builds one versioned logical snapshot without storing duplicated independent records', () => {
  const snapshot = buildReviewSessionSnapshot({
    sourceFingerprint: 'sha-a', sourceIdentity: 'foo.js', sessionRevision: 4,
    archiveDirHandle: { kind: 'directory' }, currentFileHandle: { kind: 'file' },
    editorState: { selectedSourceRef: 'foo.js#q1' }, uiState: { mode: 'exam' },
    draftState: { currentBank: [{ id: 1 }], originalBank: [{ id: 1 }] }, savedAt: 10
  });
  assert.equal(snapshot.schemaVersion, 2);
  assert.equal(snapshot.sourceFingerprint, 'sha-a');
  assert.deepEqual(Object.keys(snapshot).sort(), ['archiveDirHandle','currentFileHandle','draftState','editorState','savedAt','schemaVersion','sessionRevision','sourceFingerprint','sourceIdentity','uiState'].sort());
});

test('does not apply an old draft when the current disk fingerprint differs', () => {
  const snapshot = buildReviewSessionSnapshot({ sourceFingerprint: 'sha-a', sourceIdentity: 'foo.js', draftState: { currentBank: [{ id: 1 }] } });
  const restored = restoreReviewSession(snapshot, { sourceFingerprint: 'sha-b', bank: [{ id: 2 }] }, 'foo.js');
  assert.equal(restored.status, 'CONFLICT');
  assert.deepEqual(restored.currentBank, [{ id: 2 }]);
});
```

- [ ] **Step 2: Run the session tests and verify they fail for the missing API**

Run: `node --test tests/archive-review-session-store.test.mjs`

Expected: FAIL because the atomic session module does not yet exist.

- [ ] **Step 3: Implement the versioned single-store adapter**

Create one IndexedDB database `apms-review-engine` at version 2 with one `session` object store and one key `current`. `putSnapshot` must use one readwrite transaction and update `IDB_WRITE_COUNT`, `IDB_WRITE_MS`, and `IDB_PAYLOAD_SIZE` metrics. The snapshot must include exactly `schemaVersion`, `sessionRevision`, `sourceFingerprint`, `sourceIdentity`, `archiveDirHandle`, `currentFileHandle`, `editorState`, `uiState`, `draftState`, and `savedAt`. `restoreReviewSession` must compare the stored fingerprint with the freshly read disk fingerprint and return `CONFLICT` plus the disk bank instead of applying stale draft data.

- [ ] **Step 4: Run the session tests and verify green**

Run: `node --test tests/archive-review-session-store.test.mjs`

Expected: PASS with schema, atomic shape, and disk-conflict assertions green.

- [ ] **Step 5: Commit the session contract**

```powershell
git add archive/review-session-store.js tests/archive-review-session-store.test.mjs
git commit -m "feat(review): persist one atomic session snapshot"
```

### Task 3: Versioned Review Preview Bridge protocol

**Files:**
- Create: `archive/review-preview-bridge.js`
- Test: `tests/archive-review-preview-bridge.test.mjs`
- Modify: `archive/internal-review-engine.html:1-12, 250-263`

**Interfaces:**
- Consumes: iframe window, origin, full review snapshot, mode, and revision tuple.
- Produces: `createReviewPreviewBridge(options)`, `installReviewPreviewReceiver(options)`, `REVIEW_BRIDGE_READY`, `REVIEW_SET_SOURCE`, `REVIEW_SET_MODE`, `REVIEW_RENDER_START`, `REVIEW_RENDER_DONE`, `REVIEW_RENDER_ERROR`, and `REVIEW_QUESTION_SELECT` messages.

- [ ] **Step 1: Write failing protocol tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { PROTOCOL_VERSION, createReviewMessage, isCurrentRevisionTuple, createReviewPreviewBridge } from '../archive/review-preview-bridge.js';

test('every message carries the protocol and three revision axes', () => {
  const message = createReviewMessage('REVIEW_SET_SOURCE', { sourceKind: 'review-snapshot' }, { bridgeEpoch: 2, sourceEpoch: 3, revision: 4 });
  assert.equal(message.protocolVersion, PROTOCOL_VERSION);
  assert.deepEqual({ bridgeEpoch: message.bridgeEpoch, sourceEpoch: message.sourceEpoch, revision: message.revision }, { bridgeEpoch: 2, sourceEpoch: 3, revision: 4 });
});

test('stale messages from an old iframe or source are rejected', () => {
  const current = { bridgeEpoch: 2, sourceEpoch: 3, revision: 4 };
  assert.equal(isCurrentRevisionTuple(current, current), true);
  assert.equal(isCurrentRevisionTuple({ bridgeEpoch: 1, sourceEpoch: 3, revision: 9 }, current), false);
  assert.equal(isCurrentRevisionTuple({ bridgeEpoch: 2, sourceEpoch: 2, revision: 9 }, current), false);
  assert.equal(isCurrentRevisionTuple({ bridgeEpoch: 2, sourceEpoch: 3, revision: 3 }, current), false);
});

test('coalescing keeps only the newest pending snapshot', async () => {
  const sent = [];
  const bridge = createReviewPreviewBridge({ post: message => sent.push(message), isReady: () => true, schedule: fn => fn() });
  const first = bridge.sendSnapshot({ revision: 1, questionBank: [{ id: 1 }] });
  const second = bridge.sendSnapshot({ revision: 2, questionBank: [{ id: 1, content: '최신' }] });
  await Promise.all([first.catch(() => {}), second.catch(() => {})]);
  assert.equal(sent.at(-1).type, 'REVIEW_SET_SOURCE');
  assert.equal(sent.at(-1).revision, 2);
});
```

- [ ] **Step 2: Run the protocol tests and verify expected missing-module failure**

Run: `node --test tests/archive-review-preview-bridge.test.mjs`

Expected: FAIL because the bridge module is absent.

- [ ] **Step 3: Implement parent/child protocol primitives**

Use `protocolVersion = 1`. Validate `event.origin === location.origin`, `event.source === expectedWindow`, compatible protocol version, current `bridgeEpoch`, current `sourceEpoch`, and non-decreasing current `revision` before applying any message. `createReviewPreviewBridge` must hold `BOOTING/READY/RENDERING/ERROR`, queue one latest snapshot, resolve/reject per revision, and increment `bridgeEpoch` only for fatal iframe fallback. `installReviewPreviewReceiver` must post READY once, accept only in-memory `sourceKind: 'review-snapshot'` payloads, and never create a Blob URL or fetch a review snapshot.

- [ ] **Step 4: Load the bridge only in review-capable pages**

Add `review-preview-bridge.js` to both HTML entry points. Keep the regular `engine.html` behavior unchanged unless `reviewBridge=1` is present; the editor entry uses `engine.html?preview=1&reviewBridge=1&prewarm=0` as the only persistent iframe URL.

- [ ] **Step 5: Run protocol tests and commit**

Run: `node --test tests/archive-review-preview-bridge.test.mjs`

Expected: PASS.

```powershell
git add archive/review-preview-bridge.js archive/internal-review-engine.html tests/archive-review-preview-bridge.test.mjs
git commit -m "feat(review): add versioned preview bridge protocol"
```

### Task 4: Canonical in-memory source adapter and sourceRef selection

**Files:**
- Modify: `archive/render-state-normalizer.js`
- Modify: `archive/screen-runtime-adapter.js:31-207, 215-396`
- Modify: `archive/engine.html:1-40, 658-682, 3142-3153`
- Modify: `archive/internal-review-engine.js:1-40, 542-645, 1148-1237`
- Test: `tests/archive-review-runtime-contract.test.mjs`

**Interfaces:**
- Consumes: immutable `{ sourceKind: 'review-snapshot', questionBank, examTitle, examDisplayTitle, sourceArchiveFile, bridgeEpoch, sourceEpoch, revision }` payloads.
- Produces: canonical `APScreenRuntime` candidates with existing normalization/render/MathJax lifecycle and DOM selection through `data-source-ref`.

- [ ] **Step 1: Write failing runtime contract tests**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const adapter = fs.readFileSync('archive/screen-runtime-adapter.js', 'utf8');
const engine = fs.readFileSync('archive/engine.html', 'utf8');
const editor = fs.readFileSync('archive/internal-review-engine.js', 'utf8');

test('review runtime accepts in-memory snapshots without Blob/fetch source conversion', () => {
  assert.match(adapter, /sourceKind\s*===\s*['"]review-snapshot['"]/);
  assert.match(adapter, /questionBank/);
  assert.match(engine, /reviewBridge=1/);
  assert.match(engine, /REVIEW_SET_SOURCE/);
  assert.doesNotMatch(editor, /serializeQuestionBank\(state\.examTitle, state\.currentBank\).*Blob/);
});

test('editor and rendered output use data-source-ref as the selection authority', () => {
  assert.match(editor, /data-source-ref/);
  assert.match(editor, /sourceRef/);
  assert.doesNotMatch(editor, /state\.currentBank\[displayNo - 1\]/);
});
```

- [ ] **Step 2: Run the runtime contract tests and verify they fail**

Run: `node --test tests/archive-review-runtime-contract.test.mjs`

Expected: FAIL because the in-memory adapter and sourceRef selection are not yet wired.

- [ ] **Step 3: Extend the immutable candidate contract**

Allow `sourceKind`, `reviewSnapshot`, `bridgeEpoch`, `sourceEpoch`, and `revision` in the input/source contract while preserving the existing normal archive fields. In `loadSource`, branch only for `sourceKind === 'review-snapshot'`; normalize the in-memory bank with the same `mergeArchiveQuestionMetadata`, `APRenderAuthority.normalizeArchiveQuestions`, and `N.canonicalRenderData` path used by fetched production source. For this branch, never append a script element, call `fetch`, create a Blob, or mutate the production file identity.

- [ ] **Step 4: Route the child receiver through APScreenRuntime**

Install the receiver after `archiveScreenRuntime` is created. For `REVIEW_SET_SOURCE`, call `runtime.request({ type: 'SOURCE_CHANGE', foreground: true, payload: { sourceKind, questionBank, examTitle, examDisplayTitle, sourceArchiveFile, bridgeEpoch, sourceEpoch, revision, mode, qpp } })`. On completion post `REVIEW_RENDER_DONE`; on failure post `REVIEW_RENDER_ERROR` and keep the previous active snapshot. For `REVIEW_SET_MODE`, use the existing `MODE_CHANGE` intent. Do not call renderer, DOM replacement, or MathJax directly from the receiver.

- [ ] **Step 5: Replace number/index selection with sourceRef selection**

Add the same sourceRef derivation used by the canonical renderer (`sourceArchiveFile + questionUid/sourceQuestionUid`, falling back only to `legacy:<sourceArchiveFile>#ordinal:<sourceOrdinal>`). Put `data-source-ref` on editor cards and use the rendered node's existing `data-source-ref` in click messages. Keep `selectedId` only as a compatibility display value; resolve the actual selected object by sourceRef first.

- [ ] **Step 6: Run the runtime contract and existing runtime tests**

Run: `node --test tests/archive-review-runtime-contract.test.mjs tests/archive-fast-engine-runtime.test.js tests/archive-mathjax-render-loop.test.js`

Expected: PASS.

- [ ] **Step 7: Commit the canonical adapter integration**

```powershell
git add archive/render-state-normalizer.js archive/screen-runtime-adapter.js archive/engine.html archive/internal-review-engine.js tests/archive-review-runtime-contract.test.mjs
git commit -m "feat(review): route snapshots through canonical screen runtime"
```

### Task 5: Persistent editor iframe, IME-aware coalescing, and image revisions

**Files:**
- Modify: `archive/internal-review-engine.js:12-40, 294-336, 1148-1237, 1725-1878`
- Modify: `archive/internal-review-engine.html:104-220`
- Modify: `archive/internal-review-engine.css` only for the existing compact status/error affordance
- Test: `tests/archive-review-editor-contract.test.mjs`

**Interfaces:**
- Consumes: parent bridge, full current bank, sourceRef, editor DOM events, and image-map handles.
- Produces: one iframe load per bridge generation, `compositionstart/update/end` handling, short coalescing, asset-only cache revision, and minimal `READY/RENDERING/ERROR` UI.

- [ ] **Step 1: Write failing editor contract tests**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync('archive/internal-review-engine.js', 'utf8');

test('normal edits use a persistent preview iframe and never serialize a Blob URL', () => {
  assert.match(source, /engine\.html\?preview=1&reviewBridge=1&prewarm=0/);
  assert.match(source, /REVIEW_SET_SOURCE/);
  assert.doesNotMatch(source, /state\.liveDataUrl/);
  assert.doesNotMatch(source, /URL\.createObjectURL\(liveBlob\)/);
});

test('IME composition updates draft immediately but queues one render at compositionend', () => {
  assert.match(source, /compositionstart/);
  assert.match(source, /compositionend/);
  assert.match(source, /isComposing/);
  assert.match(source, /requestedPreviewRevision/);
});

test('asset revision is separate from text revision and production image values remain untouched', () => {
  assert.match(source, /assetRevision/);
  assert.match(source, /lastModified/);
  assert.doesNotMatch(source, /q\.image\s*=.*\?revision/);
});
```

- [ ] **Step 2: Run editor contract tests and verify missing persistent bridge failure**

Run: `node --test tests/archive-review-editor-contract.test.mjs`

Expected: FAIL because the current editor still creates a Blob URL and resets the iframe on every render.

- [ ] **Step 3: Replace live frame rendering with one bridge generation**

Remove `liveDataUrl`, `renderLiveEngineFrame`, and the normal-path `iframe.src` replacement. Create the iframe source once with `new URL('engine.html', location.href)` plus `preview=1`, `reviewBridge=1`, and `prewarm=0`. Queue current full snapshots through `bridge.sendSnapshot`, keep the latest pending revision, and update only the small existing error/status area. Allow iframe reload only after handshake timeout, bridge initialization failure, runtime initialization fatal, or document termination; increment `bridgeEpoch` before fallback and resend the newest snapshot after READY.

- [ ] **Step 4: Add IME-safe coalescing**

On `compositionstart`, set `isComposing` and keep calling `commitEditorDraft` for current DOM values without sending a render. On `compositionupdate`, update the draft only. On `compositionend`, clear `isComposing`, commit the final DOM value, increment `draftRevision`, and dispatch the newest full snapshot immediately. For ordinary input, use a short 16ms coalescing timer. A save path must call the same DOM flush before reading the snapshot, even if a timer or composition is pending.

- [ ] **Step 5: Implement asset fingerprint invalidation**

For each referenced local image, derive a review-only asset fingerprint from normalized path plus `lastModified` and size when a `FileSystemFileHandle` is available. Increment `assetRevision` only when that fingerprint changes. Include it in the bridge snapshot and child renderer URL resolver; never write it into `question.image`. Support both changed image paths and replacement content at the same path.

- [ ] **Step 6: Run editor contract tests and commit**

Run: `node --test tests/archive-review-editor-contract.test.mjs`

Expected: PASS.

```powershell
git add archive/internal-review-engine.js archive/internal-review-engine.html archive/internal-review-engine.css tests/archive-review-editor-contract.test.mjs
git commit -m "perf(review): keep canonical preview iframe persistent"
```

### Task 6: Conflict-safe save, post-write verification, and compatibility entry

**Files:**
- Modify: `archive/internal-review-engine.js:340-405, 1613-1710, 1880-2108`
- Replace: `archive/internal-review-live.html` with a redirect-only compatibility entry
- Delete: `archive/internal-review-live.js`
- Delete: `archive/internal-review-live.css`
- Modify: `tests/archive-engine-launch-fallback.test.js` to cover the compatibility redirect
- Create: `tests/archive-review-save-contract.test.mjs`

**Interfaces:**
- Consumes: source writer, current file handle, loaded fingerprint, bridge `waitForRevision`, and atomic session store.
- Produces: safe save transaction, disk re-read verification, conflict error, conditional discard guard, and one canonical implementation.

- [ ] **Step 1: Write failing save/compatibility tests**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const editor = fs.readFileSync('archive/internal-review-engine.js', 'utf8');
const liveHtml = fs.readFileSync('archive/internal-review-live.html', 'utf8');

test('save checks the disk fingerprint, waits for visible revision, and verifies the re-read', () => {
  assert.match(editor, /loadedFingerprint/);
  assert.match(editor, /currentDiskFingerprint/);
  assert.match(editor, /postWriteVerifiedRevision/);
  assert.match(editor, /disk re-read|parse.*semantic|validateRoundTrip/i);
});

test('legacy live entry redirects while preserving query string and hash', () => {
  assert.match(liveHtml, /location\.replace/);
  assert.match(liveHtml, /location\.search/);
  assert.match(liveHtml, /location\.hash/);
  assert.doesNotMatch(liveHtml, /internal-review-live\.js/);
});
```

- [ ] **Step 2: Run save tests and verify they fail against the old writer/entry**

Run: `node --test tests/archive-review-save-contract.test.mjs`

Expected: FAIL because the current save rewrites the complete source, never compares the disk fingerprint, and the live page remains a full implementation.

- [ ] **Step 3: Implement the save transaction**

Flush the editor DOM, wait for the bridge to report `REVIEW_RENDER_DONE` for the latest revision, freeze `{ bank, source, revision }`, re-read the current file and compute its fingerprint, and abort with `파일을 연 이후 외부에서 파일이 변경되었습니다. 현재 변경 내용을 덮어쓸 수 없습니다.` when the fingerprint differs. Use `replaceQuestionBankPreservingSource` and `createWritable`, close the writer, re-read the file, parse it, compare the parsed bank/title to the frozen snapshot, and only then update `currentSource`, `originalBank`, `sourceFingerprint`, and `postWriteVerifiedRevision`. If another edit occurs while the write is in flight, keep it as a new unsaved draft against the verified saved baseline.

- [ ] **Step 4: Normalize discard protection**

Make `hasUnsavedChanges()` compare actual current/removed state. `confirmDiscardUnsaved()` returns immediately when clean and calls `window.confirm` only when dirty. Apply it to folder change, file open, file selection, page-leave/reload paths without adding a new required interaction.

- [ ] **Step 5: Replace the duplicate live implementation**

Make `internal-review-live.html` contain only an inline redirect that creates a URL for `internal-review-engine.html`, copies `location.search` and `location.hash`, and calls `location.replace`. Remove `internal-review-live.js` and `.css` only after all functionality is present in the engine entry and tests have no references to either file.

- [ ] **Step 6: Run save/compatibility tests and commit**

Run: `node --test tests/archive-review-save-contract.test.mjs tests/archive-engine-launch-fallback.test.js`

Expected: PASS.

```powershell
git add archive/internal-review-engine.js archive/internal-review-live.html tests/archive-review-save-contract.test.mjs tests/archive-engine-launch-fallback.test.js
git rm archive/internal-review-live.js archive/internal-review-live.css
git commit -m "fix(review): make save conflict-safe and remove duplicate entry"
```

### Task 7: Full regression, browser acceptance, and release evidence

**Files:**
- Modify: `tests/archive-review-editor-contract.test.mjs` only if a verified browser observation requires a precise contract assertion
- Create: `docs/evidence/internal-review-engine-20260915.md`

**Interfaces:**
- Consumes: the completed editor/runtime and a localhost server.
- Produces: command output, browser acceptance evidence, race-stress metrics, and a clean branch ready for push.

- [ ] **Step 1: Run targeted unit and static tests**

Run: `node --test tests/archive-review-source-writer.test.mjs tests/archive-review-session-store.test.mjs tests/archive-review-preview-bridge.test.mjs tests/archive-review-runtime-contract.test.mjs tests/archive-review-editor-contract.test.mjs tests/archive-review-save-contract.test.mjs tests/archive-fast-engine-runtime.test.js tests/archive-engine-launch-fallback.test.js tests/archive-mathjax-render-loop.test.js`

Expected: PASS with zero failures.

- [ ] **Step 2: Run the inline-script syntax and engine contract checks**

Run: `node --test tests/archive-canonical-identity-propagation.test.js tests/archive-render-authority-adapter.test.js tests/archive-solution-image.test.js`

Expected: PASS; any baseline failure must be listed separately and not hidden.

- [ ] **Step 3: Exercise the real localhost browser flow**

Serve the repository, open `archive/internal-review-engine.html`, and record these observable checks: folder open, file open, content edit, 100 ordinary text edits with zero iframe reloads, continuous Korean IME input with final text present, MathJax edit, SVG/PNG preview, same-path image replacement, exam/solution/answer mode changes, save, disk re-read, reload/restore, file switch, and return to the original file. Capture `data-source-ref`, bridge status, revision tuple, `FULL_RELOAD_COUNT`, and save/post-write metrics from the page.

- [ ] **Step 4: Run race and leak stress checks**

Perform fast typing, IME composition, mode switch during render, question selection during render, file switch during render, save immediately after the final character/image replacement, and 50–100 edit/render iterations. Confirm no stale preview, stale selection, blank iframe, infinite spinner, missing final character, preview/save mismatch, duplicate listener, or growing Blob URL count.

- [ ] **Step 5: Write evidence and run the complete repository suite**

Record exact commands, pass/fail counts, baseline failures, browser observations, and unresolved limitations in `docs/evidence/internal-review-engine-20260915.md`. Run `node tools/run-tests.js` and preserve its exit code/output summary. Do not claim the unrelated pre-existing six failures are fixed unless their tests independently pass after this change.

- [ ] **Step 6: Review the final diff and commit evidence**

```powershell
git status --short
git diff --check
git diff --stat main...HEAD
git add docs/evidence/internal-review-engine-20260915.md
git commit -m "test(review): record internal engine acceptance evidence"
```

- [ ] **Step 7: Push the isolated branch**

```powershell
git push -u origin codex/internal-review-engine-integration
```

Expected: remote branch `origin/codex/internal-review-engine-integration` points to the final verification commit.

---

## Self-review checklist

- [ ] Every plan requirement from data safety, source preservation, conflict guard, post-write verification, unsaved guard, bridge protocol, persistent iframe, sourceRef identity, IME, image invalidation, atomic IDB session, preview/save parity, and browser QA maps to a task above.
- [ ] No production archive exam file is in any task's file list.
- [ ] Every new module has a named test and a red-green sequence.
- [ ] All public names used by later tasks are defined in an earlier task's Interfaces block.
- [ ] Full reload is limited to bridge/runtime fatal recovery.
- [ ] Final completion is evidence-based and records existing baseline failures separately.
