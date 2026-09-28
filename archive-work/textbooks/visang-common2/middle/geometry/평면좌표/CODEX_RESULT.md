# 비상 공통수학2 — 평면좌표 중단원학습점검

## 범위와 source identity

- setKey: `비상_공통수학2_평면좌표_중단원학습점검_고1`
- bookId: `VISANG_COMMON2_TEXTBOOK` (task-local, used with setKey/page/displayNo/prompt fingerprint)
- source PDF: Downloads 발췌본, 물리 p.3–4 / 인쇄 p.26–27; SHA-256 `c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c`
- 정답·해설 PDF: 물리 p.2 / 인쇄 p.143; SHA-256 `b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0`
- 두 원본 PDF는 입력 전용이며 이 branch에 복사하지 않았다.
- 확인한 최신 main base: `f100a1415193947152c29bdccdefc28126f5c433`.
- 대상은 배정된 L2 `평면좌표`의 중단원학습점검 JS 하나뿐이다. 이번 첫-wave 완료 후에도 후속 `직선의 방정식`, `원의 방정식`, 다음 순서의 `도형의 이동`, 대단원평가·익힘책 파일은 생성하지 않는다.

## Inventory 및 source transcription

물리 쪽수와 인쇄 쪽수를 full-page 이미지에서 확인했다. p.26에는 01–04, p.27에는 05–12가 있으며 인접 L2인 직선의 방정식과 allowlist가 겹치지 않는다. 지정된 01·05·11·12 네 문항을 전부 전사했다.

| 인쇄 번호 | 물리/인쇄 쪽 | question ID | source text / choices |
|---|---|---|---|
| 01 | 3 / 26 | `qid_v1_6ceb49fb80aa5faa49f6f0d06deb0f8d50535bd29dd8894c0f83132e03fb3a9f` | exact parity PASS / 원문 choices 없음 |
| 05 | 4 / 27 | `qid_v1_86472bbef148cdcbf3c3491f91bb6b16cd42c400f5e89170bda3bbf1c4ee4649` | exact parity PASS / 원문 choices 없음 |
| 11 | 4 / 27 | `qid_v1_bec5ac82adb49d81f59d123944c449072167e3c4136c10e66bea5e61f779bda9` | exact parity PASS / 원문 choices 없음 |
| 12 | 4 / 27 | `qid_v1_d4c641e17775b37f54a15ec0924a5cc686110a7f1c82e81e75a5a6f2163637e7` | exact parity PASS / 원문 choices 없음 |

각 ID는 `bookId + setKey + printed displayNo + problem PDF page + SHA-256(prompt)`로 생성했다. full page가 p.26의 01–04와 p.27의 05–12를 모두 뒷받침하고, 허용 문항 4/4 및 text/choice exact parity 4/4를 닫았다.

## 정답·학생용 해설

공식 해설의 문항 번호만으로 연결하지 않고 setKey, printed displayNo, 문제 PDF page, prompt fingerprint, question ID를 crosswalk에 결속했다. 각 답은 좌표/거리/닮음/수선 발을 이용해 별도로 계산한 뒤 공식 인쇄 해설 p.143의 결론과 대조했다.

| 번호 | 정답 결론 | 공식 해설 대조 |
|---|---|---|
| 01 | (1) `P(2, 7)` (2) `Q(0, 6)` | 일치 |
| 05 | `√5` | 일치 |
| 11 | `P(1, 1)`, `Q(2, 4)` | 일치 |
| 12 | 최댓값 `√89`, 최솟값 `4` | 일치 |

정답·학생용 해설 coverage 모두 4/4. q12 해설에는 최댓값의 꼭짓점 비교와 각 변의 최근접 거리를 포함해 최솟값이 CD에서 4라는 점까지 학생이 따라갈 수 있게 보강했다. 미해결 source/answer/solution 예외는 0건이다.

## 분류 및 asset

- 표준단원: `H22-C2-01 / 평면좌표 / order 1`.
- 세부단원: `H22-C2-01-COORDINATE_METRIC / 평면좌표와 거리`, active compiled master의 parent/label과 일치.
- 난이도 `level`과 difficulty 4-field는 `UNKNOWN`/공란으로 남겼다. 풀이만으로 결정하지 않은 상위 taxonomy도 final 처리하지 않았다.
- 별도 image asset 1개: q12 마름모 좌표도. question crop과 full page는 증거 전용이며 JS `image`에는 연결하지 않았다.
- asset crop의 점·축·수치 라벨 및 cutoff를 확인했고, exam browser mode에서 이미지 natural size 275×285로 정상 로드됐다.

## Validation / render

- `node --check` 및 Node VM `window.questionBank` parse: PASS.
- static validation: 21/21 PASS — question count, exact ID/order/coverage, source/answer page mapping, prompt fingerprint, crop/full-page SHA, choice/answer/solution completeness, answer/solution conclusion agreement, L1/L2/subunit master mapping, disjoint allowlist, asset provenance/path/hash/crop review, corrected PDF hashes.
- 기존 `archive/engine.html`에 task-local HTTP route로 지정 candidate JS를 공급해 실제 브라우저 렌더를 실행했다. production archive에 복사하지 않았다.
  - exam: 4/4, 1 page, q12 image load PASS, horizontal overflow 0, console/page/network error 0.
  - sol: 4/4, 2 pages, MathJax render PASS, horizontal overflow 0, console/page/network error 0.
  - ans: 4/4, 1 page, 4 answers, horizontal overflow 0, console/page/network error 0.
- 실제 출력 캡처: `evidence/{setKey}/browser-render-{exam,sol,ans}.png` 및 `browser-render-report.json`.
- DB/index 및 production/archive/exams는 이번 candidate-only 범위가 아니므로 실행/변경하지 않았다.

## Stage elapsed (approx.)

Notion CURRENT 원장의 시작시각 2026-09-28 21:12 KST부터 단계 시간을 근사 기록했다. 개별 stage 사이에는 이미지 확인과 ledger 보정이 이어져 분 단위 반올림이다.

| 단계 | 경과 |
|---|---:|
| 운영문서, canonical/master, main 기준, 원본 SHA 확인 | 약 7분 |
| task page-map, full-page render, 질문/diagram crop 및 시각확인 | 약 7분 |
| source freeze, 전사, source fingerprint/ID 생성 | 약 3분 |
| 독립 풀이, 해설 대조, 학생용 풀이와 L1/L2 분류 | 약 6분 |
| 정적/asset 검증, engine exam/sol/ans 렌더 및 보정 | 약 10분 |
| result/commit/push/Notion·coordinator closeout | 완료 시 갱신 |

## Artifact paths

- JS: `archive-work/textbooks/visang-common2/middle/geometry/평면좌표/js/비상_공통수학2_평면좌표_중단원학습점검_고1.js`
- assets: `archive-work/textbooks/visang-common2/middle/geometry/평면좌표/assets/비상_공통수학2_평면좌표_중단원학습점검_고1/`
- source full page, answer page, question crops, mapping/fingerprints, answer crosswalk, visual review, static/browser reports: `archive-work/textbooks/visang-common2/middle/geometry/평면좌표/evidence/비상_공통수학2_평면좌표_중단원학습점검_고1/`

## Branch closeout

- branch: `codex/visang-plane-coordinates`
- initial base: `f100a1415193947152c29bdccdefc28126f5c433`
- final commit and remote SHA: will be supplied in this result closeout after the scoped single commit is pushed.
- Notion CURRENT page: pending final commit/SHA update.
