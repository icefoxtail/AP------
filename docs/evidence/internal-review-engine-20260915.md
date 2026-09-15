# JS아카이브 내부 검수 엔진 통합·성능개선 v0.3 — 인수·검증 증적

검증일: 2026-09-15 (Asia/Seoul)

기준 HEAD: `5abf17d8d05b4e8e6914be5d833833c2519ad1c8`

작업 브랜치: `codex/internal-review-engine-integration`

작업 worktree: `C:/Users/USER/.codex/worktrees/internal-review-engine-integration`

최신 `origin/main` 반영: `91d8b7528efd1a9099a2646bf89ee0edd17a02d2`를 `f3da72544ae80f0f75359d4066a24dba45f7ba2c` merge commit으로 이 feature branch에 반영했다.

원래 checkout `C:/Users/USER/Desktop/AP------`의 기존 수정 파일은 이 작업에 포함하지 않았고 그대로 보존했다.

## 변경 범위

- canonical 검수 엔트리는 `archive/internal-review-engine.html`과 `archive/internal-review-engine.js`다.
- `archive/internal-review-live.html`은 query string과 hash를 보존하는 redirect-only 호환 엔트리로 축소했다.
- 중복 구현인 `archive/internal-review-live.js`와 `archive/internal-review-live.css`는 제거했다.
- `archive/exams/**/*.js` production exam source는 수정하지 않았다. `git diff --name-status` 기준 production exam 데이터 변경은 0건이다.
- source-preserving writer, atomic session store, versioned preview bridge, save transaction, runtime/editor contract tests를 추가했다.
- writer는 bank를 JSON single-line이 아닌 2-space multiline/indent JSON literal로 저장하고, nested assignment의 line indent를 유지한다.
- post-write 검증 실패는 `beforeSource`, recovery source/file name, `writeCompleted`, `rollbackAttempted=false`를 포함하는 명시적 recovery contract로 전달하며 자동 rollback하지 않는다.

## 자동 검증

### 새 검수 엔진·runtime 대상 테스트

실행 명령:

```powershell
node --test tests/archive-review-source-writer.test.mjs tests/archive-review-session-store.test.mjs tests/archive-review-preview-bridge.test.mjs tests/archive-review-runtime-contract.test.mjs tests/archive-review-editor-contract.test.mjs tests/archive-review-save-contract.test.mjs tests/archive-review-save-transaction.test.mjs tests/archive-fast-engine-runtime.test.js tests/archive-engine-launch-fallback.test.js tests/archive-mathjax-render-loop.test.js tests/archive-solution-image.test.js tests/archive-render-authority-adapter.test.js tests/archive-canonical-identity-propagation.test.js tests/archive-adjacent-math-readability.test.mjs
```

결과: `72 passed / 0 failed`.

포함한 회귀 범위:

- source-preserving replacement, helper override 재사용, SHA-256 fingerprint, unsafe ambient capability fail-closed, production exam source inventory round-trip
- schema v2 single IndexedDB snapshot, fingerprint conflict 복원, queued `clear()` ordering
- bridge protocol tuple, origin/source rejection, newest-only coalescing, stale source/mode completion 폐기, child listener dispose
- review snapshot의 빈 bank, canonical `reviewSourceRef` 보존, normal fetch/script loader와의 분리
- sourceRef 기반 선택 및 null ID 편집, 파일 읽기 실패 시 현재 handle 보존, metadata markup escaping
- save 전 preview 대기, 외부 파일 변경 차단, post-write semantic mismatch 차단, legacy redirect
- multiline/indent formatting regression, post-write recovery artifact, beforeSource 보존, 무조건 rollback 금지, recovery snapshot persistence
- regular archive runtime, MathJax loop, render-authority adapter, solution image, canonical identity 회귀

### Source writer 전체 inventory

`archive/exams` 아래 JavaScript 465개 각각에 대해 다음을 수행했다.

1. capability-limited evaluator로 parse
2. question bank만 source-preserving replacement
3. 다시 parse
4. canonical semantic round-trip 비교

결과: `files=465, ok=465, fail=0`.

### JavaScript syntax

다음 변경/신규 JavaScript 7개에 대해 `node --check`를 실행했다.

```text
archive/render-authority.js
archive/review-preview-bridge.js
archive/review-session-store.js
archive/review-source-writer.js
archive/review-save-transaction.js
archive/screen-runtime-adapter.js
archive/internal-review-engine.js
```

결과: 전부 exit code 0.

### Skill verification

작업 시작 시 기준 HEAD `5abf17d8d05b4e8e6914be5d833833c2519ad1c8`에서 `node tools/skills/verify-skills.mjs`는 PASS였다. 작업 중 전진한 최신 `origin/main` `91d8b7528efd1a9099a2646bf89ee0edd17a02d2`를 feature branch에 merge했고, 최신 merge 결과에서 최종 검증도 PASS였다. merge 대상은 현재 feature branch뿐이며 `main` checkout은 변경하지 않는다.

### 저장소 전체 러너

실행 명령: `node tools/run-tests.js`

결과: `PASS 164 / FAIL 6 / KNOWN-FAIL 0 (total 170)`, exit code 1.

정확히 같은 6개 실패가 기준 HEAD에서도 먼저 재현되어 baseline으로 기록되어 있다. 이번 변경으로 새로 추가된 실패는 확인하지 않았다.

```text
archive-answer-grid-layout.test.js
high2-math2-original-solution-review-masan-yeo.test.js
high2-math2-original-solution-review.test.js
print-render-authority-drift-ledger.test.js
print-render-authority-phase0-baseline.test.js
svg-point-decimal-labels.test.js
```

`print-render-authority-phase0-baseline.test.js`는 2026-09-06 historical frozen closure의 stale fixture/hash/direct-test denominator도 함께 검증하는 테스트이므로, 이번 브랜치의 canonical review entry migration과 별개로 기준선 실패로 남겨 두었다. 신규 `archive-engine-launch-fallback.test.js`에는 redirect query/hash 보존 검사를 추가했다.

## 이전 localhost 브라우저 smoke 검증

테스트 서버: `http://127.0.0.1:8765`

Fixture: `archive/exams/types/middle/m1/중1_1학기_문자의사용.js`

### 확인된 항목

- canonical internal review editor가 60문항을 읽고 preview iframe에서 15 exam pages를 렌더했다.
- child bridge 상태는 `READY`, 첫 source tuple은 `0:1:1`, parent preview 상태도 `READY`였다.
- 첫 문항을 선택한 뒤 content를 100회 연속 입력했다. 이 시나리오의 최종 상태는 `READY`, tuple `0:1:101`이었다. 첫 초기 edit를 포함해 revision 2–101이 생성되었고, metrics의 `coalescedRevisionCount`는 99, `fullReloadCount`는 0이었다.
- 100회 입력 전후 `#enginePreviewFrame`의 `src`가 같아 persistent iframe을 확인했다. 최종 편집 텍스트 `연속 편집 100`이 editor와 preview에 남았다.
- rendered 11번 문항에서 얻은 `data-source-ref`는 `types/middle/m1/중1_1학기_문자의사용.js#legacy:types/middle/m1/중1_1학기_문자의사용.js#ordinal:11`이었고, parent editor는 `id: 11` 문항을 열었다. 선택 연결은 표시 순번이 아니라 sourceRef를 기준으로 동작했다.
- 해설 모드 전환 후 child 상태는 `READY`, tuple은 `0:1:102`, preview는 9 solution pages였다. 첫 rendered question에 최종 편집 텍스트와 `[정답]`, `[키포인트]`가 표시되었고 iframe element는 교체되지 않았다.
- regular `archive/engine.html?data=...&prewarm=0` route도 `reviewBridge` 없이 60문항/15페이지를 렌더했다.
- legacy `archive/internal-review-live.html?...#keep` navigation은 canonical editor로 이동하면서 query와 hash를 보존했다.

### 브라우저 로그 해석

Chrome diagnostics에는 local URL에서 발생한 `A listener indicated an asynchronous response by returning true...` 형태의 확장 프로그램 메시지 채널 오류가 남았다. application stack이나 review bridge 오류로 분류되는 로그는 관찰하지 못했지만, 이 확장 프로그램 noise 때문에 “console error 0”이라고 주장하지 않는다.

별도 malformed source fixture `25_왕운중...`에서는 child가 `MATH_TYPESET_ERROR`로 전환되는 것을 재현했다. 동일 bridge로 정상 fixture가 통과했고, 오류는 해당 source의 math/typeset 입력 품질에 귀속되는 source-specific 결과로 기록했다.

## 이번 follow-up의 실제 FSA 저장 시나리오 시도

이번 follow-up에서는 새 branch worktree를 root로 `npx --yes live-server --host=127.0.0.1 --port=8765 --no-browser`를 실행해 Live Server를 기동했다. 실제 대상 fixture는 production exam이 아닌 임시 `archive/exams/test-fixtures/internal-review-live-save-fixture.js`로 준비했다.

Chrome에서 canonical editor를 열고 archive 폴더 열기 → 한국어 직접 입력 → preview → Ctrl+S → disk 재로드 → browser reload/session restore → 외부 변경 overwrite 차단을 실행하려 했으나, Chrome CUA helper가 새 tab 생성 직후부터 `getState()`와 기존 tab `getTab()` 모두 30–120초 timeout되어 kernel이 재설정되었다. 문서화된 reset/retry 절차까지 수행했지만 브라우저 window/tab을 재연결하지 못했다. 이 때문에 이번 follow-up에서 실제 FSA permission prompt, 실제 Ctrl+S, browser reload/session restore, 실제 외부 파일 overwrite 차단은 실행 완료로 주장하지 않는다.

임시 fixture는 테스트 inventory와 production diff에 남지 않도록 제거했으며 Live Server도 종료했다.

## 아직 실제 브라우저에서 실행하지 않은 항목

- File System Access API의 실제 directory/file permission prompt를 승인하지 못했으므로, 실제 UI 직접 저장과 browser reload 후 IndexedDB handle 복원은 fake-handle unit test로만 검증했다.
- 실제 운영체제 IME composition event sequence를 자동 입력으로 재현하지 않았다. `compositionstart/update/end` 핸들러와 direct Korean text 입력은 확인했다.
- 동일 경로 이미지 파일 교체, mode/file switch가 실제 렌더 중 겹치는 브라우저 시나리오, 장시간 Blob/listener leak 계수는 end-to-end로 실행하지 않았다. asset-only revision, object URL revoke/serial guard, bridge stale-race는 정적·단위 테스트와 위 browser stress metrics로 보강했다.
- source parser는 기존 production bank 형식 호환성을 위해 JavaScript 평가가 필요하므로 capability-limited evaluator와 fail-closed ambient identifier 검사를 사용한다. 이는 review page의 document/network/storage capability를 노출하지 않도록 하는 경계이며, 완전한 OS 수준 보안 sandbox를 의미하지 않는다.

## 결론

새 검수 엔진 변경과 대상 회귀 테스트는 통과했고, 이전 localhost browser smoke에서는 preview/bridge 최신 revision 수렴과 iframe persistence를 확인했다. 이번 follow-up의 실제 FSA 저장 시나리오는 CUA helper timeout으로 미완료이며, 저장소 전체 러너의 최종 결과와 이 제한을 숨기지 않고 함께 보고한다. 이 evidence를 기준으로 feature branch만 원격에 push하고, `main` merge/PR은 수행하지 않는다.
