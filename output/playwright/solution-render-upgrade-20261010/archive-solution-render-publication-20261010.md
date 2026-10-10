# 해설 출력 전환 PREPARE 복구·main publication closeout

## 최종 결과

해설·정답 전환에서 발생하던 PREPARE latest-wins 실패를 수정하고, bounded idle prewarm 및 중복 해설 staging 비용 절감과 함께 main에 반영했다. implementation commit은 518280f7f5ab73ae5c08f9e591fbe9274c131945이며 origin/main readback에서 같은 SHA를 확인했다. main 병합 후 headed Chrome에서 시험→해설→정답→인쇄 readiness, 새로운 원본 전환, fullwidth 해설 SVG 경로를 검증했다.

## 재현된 cancellation 결함과 수정

수정 전 tests/archive-fast-engine-browser.cjs의 “PREPARE keeps DOM/state/URL/tab; late request wins and composes header delta”가 Chrome에서 재현됐다. switchOutputEnvelopeMode의 modeSwitchPending mutex가 새 mode 요청을 거부했고, 그보다 먼저 실행된 전환은 렌더 PREPARE 전에 AppState, URL, output envelope readiness와 탭을 변경했다. 더 늦은 HEADER_CHANGE가 screen transaction을 취소하면 오래된 전환의 catch가 새 상태까지 이전 값으로 rollback해 DISCARDED_STALE로 종료됐다. 수정 전 원문은 [cancellation-pre-fix.json](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\cancellation-pre-fix.json)에 보존했다.

archive/engine.html은 generation을 가진 output-mode transition을 사용하고, 빠른 후속 mode/header 입력을 최신 intent에 병합한다. Envelope는 foreground transaction 전에 완전 검증·저장하되 URL, AppState, reader readiness는 screen-runtime commit 때 함께 공개한다. 취소된 미커밋 Envelope는 owner/request 키로 정리한다. 오래된 요청은 stale result만 반환하며 새 요청 상태를 되감지 않는다. Header 변경도 현재 pending mode의 새 Envelope와 같은 transaction에서 반영된다.

archive/screen-runtime-adapter.js는 mode payload의 Envelope mode, owner, request id, q/qpp와 header를 route와 대조한다. 후보의 의미상 URL은 기존 semantic snapshot key에 유지하고 transport URL만 transaction commit 때 history에 기록한다. 이로써 random output request id가 의미상 동일한 sol/ans prewarm cache를 무효화하지 않는다. AppState.outputEnvelope, global readiness, snapshot-output class는 rollback journal에 포함한다. Envelope URL을 새 탭에서 다시 여는 초기 SOURCE_CHANGE도 envelope를 commit 시점까지 staging한다. Envelope payload가 없는 SOURCE_CHANGE commit은 이전 source의 envelope/readiness를 제거하고 새 session의 sol/ans snapshot을 비운다.

Snapshot 의미 key의 sourceArchiveFile, canonicalDataFingerprint, sourceEpoch 및 revision 결속은 유지한다. 기존 canonical 계약에 따라 targetSessionId와 sourceRequestId는 내용 key에서 제외하되, snapshot 재사용은 current session id와 실제 source/content key를 별도로 검증한다. 관련 unit test가 source file/content fingerprint/revision 변경을 key 변경으로, 다른 request/session provenance는 같은 의미 입력일 때만 동일 key로 확인한다.

## 검사와 Chrome 검증

**node tools/check-archive2-runtime.cjs** — PASS 42/42, exit 0. 원문은 [archive2-runtime-guard-current-main.log](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\archive2-runtime-guard-current-main.log)에 있다.

**node --test tests/archive-fast-engine-runtime.test.js tests/archive-render-authority-adapter.test.js tests/archive2-reader-controls.test.cjs tests/layout-authority.test.js tests/archive-solution-materializer-fit.test.cjs** — PASS 45/45, exit 0. [archive-runtime-tests-current-main.log](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\archive-runtime-tests-current-main.log)에 보존했다. node tests/archive-solution-image.test.js, owned JS/browser helper syntax checks, engine inline script syntax check 및 git diff --check도 모두 exit 0이다.

수정 후 실제 Chrome cancellation audit은 PASS 20/20, exit 0이다. PREPARE 중 root/AppState/data/header/URL/tab와 기존 Envelope/readiness가 유지되고, 첫 두 stale mode result가 DISCARDED_STALE, 마지막 ans+header transaction은 한 번 commit됐으며 route/request/render readiness id와 reader-ready가 일치했다. 이후 committed answer Envelope URL을 새 Chrome page에서 다시 열어 ans mode 및 output snapshot을 복원하고 PRINT_READY dry-run까지 확인했다. 다른 SOURCE_CHANGE는 새 session을 만들고 old envelope를 정리했다. 원문 JSON/스크린샷은 [cancellation-current-main.json](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\cancellation-current-main.json)과 같은 prefix의 PNG다. PREPARE 판정·reader/cache-version 정적 테스트는 새로운 atomic route/header contract를 검사하도록 갱신했으며 gate의 분모·상한은 바꾸지 않았다.

## main Chrome 실제 학생 모드

main 기반 검증에는 Google Chrome 154.0.8037.98, headed 창, CSS viewport 1280×720, DPR 1을 사용했다. B 시험지는 1초 quiet 이후 sol, ans prewarm이 모두 READY된 것을 확인한 뒤 실제 mode 버튼을 눌렀다. 해설 click은 cache HIT 73ms였고 정답 click도 cache HIT였다. B 본문 SHA-256은 0438732059795b03aaf76adb493344aaa473366a6f4658a5f3ca749514cb9497, answer mode는 1페이지·24 answer cells이며 수식 미조판은 0이다. 일반 vector print readiness는 PRINT_READY, 78.5ms의 dry-run이었다. printDryRun=1로 실행해 OS/printer에 인쇄 명령은 보내지 않았다.

해설 content는 qid/sourceRef 순서로 answer와 해설 fragment textContent를 SHA-256으로 묶었고, HTML SHA는 각 .sol-exp.innerHTML을 별도 계산했다. Headed post-main B는 7페이지, 25 solution boxes, 24답, continuation 2, clipping 0, overflow 0px였다. pre-main headless B는 6페이지였지만 본문 SHA는 동일했다. headless/headed 세션 사이의 pagination/MathJax HTML byte parity를 주장하지 않는다. 두 결과 모두 같은 content hash를 보였고 headed 출력은 잘림 없이 readiness를 통과했다.

B의 answer 화면 뒤 remote-main C로 실제 SOURCE_CHANGE를 보냈다. session id가 바뀌고 B Envelope/ready id와 기존 sol/ans snapshots가 제거됐다. 이후 C solution click은 cache MISS 10.934초였으며 remote source가 재조판됐다: 15페이지, 30 solution boxes, 23답, continuation 18, SVG 18개 load, math 미조판 0, clipping 0, overflow 0px. C 본문 SHA-256은 d8dc60dda8efdb705c0c9d219d853984c664ece6c8b257899851c8f8f71fb55. 과거 local-source 측정의 14페이지/29상자/12 continuation과 분모가 다르므로 이를 exact layout parity로 주장하지 않는다. remote source SHA가 달라진 것이 확인됐다.

매산여고 장문 해설도 main Chrome에서 확인했다. 본문 SHA-256은 8bec4e403bba634204ec3396a851488fb74e0ab515046047a0aa9fb350e584b3, 23답, SVG 12개 모두 ready, math 미조판/잘림 0, print readiness PRINT_READY다. font wait는 5.7ms였다. headed 실행은 21페이지/41 boxes/34 continuations, overflow 2px였다. 과거 headless 수치 20/40/32와는 browser mode 및 main asset bytes가 달라 page/fragment 수 parity를 주장하지 않는다.

신흥중 fullwidth solution fixture도 main Chrome에서 exam→solution→safePrint readiness로 확인했다. 전체 10페이지에서 q9는 3쪽, fullwidth q10은 4쪽 단독, q11은 5쪽이었다. q10 SVG는 390×360px load 완료·box 안에 포함됐고 unrendered MathJax, clipping, page-body overflow는 0이었다. fullwidth 출력도 dry-run PRINT_READY를 통과했다.

모든 post-main Chrome 실행에서 console/page error는 0건이었다. 상세 원시 결과는 [post-main-final-mode-output-smoke.json](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\post-main-final-mode-output-smoke.json) 및 같은 prefix의 PNG들이다.

## Remote main, source, asset readback

최초 remote 조회 때 origin/main은 local 시작점보다 2 commit 전진해 3649f95201ef1a4cfa674bc6ec4ad6ecad45d62f였다. 113 변경 경로 중 이 작업의 소유 runtime/test/evidence path와 겹치는 것은 0이었다. main을 그 commit까지 fast-forward한 뒤 위 runtime guard와 Chrome audit을 실행했다. implementation commit 518280f7f5ab73ae5c08f9e591fbe9274c131945 push가 성공했고, 뒤이은 git fetch --no-tags origin main에서 HEAD와 origin/main이 같은 commit SHA를 가리켰다. commit의 68 tracked paths는 remote/commit/index blob id 68/68 일치했고, 핵심 코드/test/source/evidence 원문은 remote object bytes 대조 16/16 일치했다. [remote-readback-518280f7f.json](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\remote-readback-518280f7f.json)에 object ids와 raw SHA-256을 기록했다.

remote main에는 이 작업 전 다른 source/asset update가 포함돼 있었다. local checkout의 Hyocheon C JS raw SHA 80cc1d0d2af2a76471441583075d0c2a04f62986d9ac95349c4985a9b2f3e54c가 fetched main source blob과 달랐고, 매산여고/효천고 해설 SVG 중 일부 local blob도 remote tree와 달랐다. 이 source/asset은 owned scope가 아니므로 수정·stage/commit하지 않았다. post-main Chrome 용 read-only HTTP overlay는 fetched commit 518280f7f5ab73ae5c08f9e591fbe9274c131945의 4 roster source JS와 그 references 63 asset의 Git blob bytes를 메모리에서 제공했다. Chrome이 받은 engine/runtime module, 시험지 JS 및 실제 로드 image/SVG response는 remote main bytes와 75/75 SHA-256 일치했다. overlay source/asset 목록과 각 blob/raw SHA는 [post-main-source-asset-overlay.json](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\post-main-source-asset-overlay.json), Chrome response별 SHA는 [post-main-final-chrome-resource-parity.json](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\post-main-final-chrome-resource-parity.json)에 있다.

이 overlay는 로컬 serving QA 경로이며 배포 URL의 실시간 반영을 뜻하지 않는다. 저장소 설정에서 검증 가능한 배포 URL이 확인되지 않아 live deployment smoke는 주장하지 않는다.

## Main commit SHA와 owned file hashes

implementation commit: 518280f7f5ab73ae5c08f9e591fbe9274c131945. staged content의 raw SHA-256과 committed Git blob SHA-1은 다음과 같다.

| Owned path | Raw SHA-256 | Git blob SHA-1 |
|---|---|---|
| archive/engine.html | b2858ee6412495175984b32c17851042aa105c02127e62128b214e603fd7f094 | 824a4688db1d00f399998f2a72a0907af2c1630d |
| archive/solution-render-executor.js | b0fa2ee21092bd64c968f391e890db0865add6344580561c10eb9cd4b8c5e5c3 | 94c588f7fb3636239972d737f90b52137372aad0 |
| archive/layout-materializer.js | 2b5489e93ec6bffbb536f391e890db0865add6344580561c10eb9cd4b8c5e5c3 | 9b37edb4b84e7b0f0041adb4f8e2683a0c57d057 |
| archive/screen-runtime-adapter.js | f513ec6fec65628b9ff63335eb0d7470c89607b743dafa588fa2f233d2d5883a | 6a104c2accce6cb7ff7dbedbb6eac880e8784360 |
| tests/archive-fast-engine-browser.cjs | a2c5cddb5af1fd22bdc54d187b5d06501cccf9026019a20092566a94ff0eeb57 | 71e5628f2cbffb0574294a45388889fc9f786385 |
| tests/archive-fast-engine-runtime.test.js | 53165ebe06abd32afdd12deb9bba1ca0f3486a8f6022295bdab95f3b97c5cbfc | 4a4124ce428bea424a5ecebe10758cad8cf85e05 |
| tests/archive-render-authority-adapter.test.js | 0f357289f9957bd8e72bb18c886bc59e83f109e674ef32b5077d0909286aaa28 | 8851492cbbf18ab7762b3cd96c03c5553f00a822 |
| tests/archive2-reader-controls.test.cjs | 3ba204f45e1f0337649329eeced80f66e7c63eb015d740ba008a167b5299124c | d146369602e343732b2b73c094a057f9b51770ac |

A 이전 final report/raw A/B/C/experiment evidence는 upgrade directory에서 보존했다. 해당 text evidence의 CRLF→LF Git export normalization은 evidence-line-ending-normalization.json에 파일별 before/after SHA-256으로 기록했다. 시험지 JS와 assets는 이 작업에서 stage/commit하지 않았다. staged path 목록은 owned runtime/test 8개와 upgrade evidence 폴더의 파일만이었고 unrelated .playwright-cli 작업물은 제외했다.