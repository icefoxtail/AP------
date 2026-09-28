# 직선의 방정식 — 작업 결과

## 범위와 산출물

- setKey: `비상_공통수학2_직선의방정식_중단원학습점검_고1`
- 작업 범위: 직선의 방정식 한 소단원만. 평면좌표·원의 방정식·도형의 이동 및 후속 단원은 손대지 않음.
- 원본 문항 PDF: SHA-256 `c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c`
- 원본 정답·해설 PDF: SHA-256 `b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0`
- JS: `../js/비상_공통수학2_직선의방정식_중단원학습점검_고1.js`
- Evidence root: `./`
- Question crops: `../crops/비상_공통수학2_직선의방정식_중단원학습점검_고1/` (8개)
- Source asset: `../assets/비상_공통수학2_직선의방정식_중단원학습점검_고1/q09_diagram.png` (1개)

## 단계 기록

| 단계 | 결과 | elapsed |
| --- | --- | --- |
| 지침·현재 main·교재 pipeline·표준단원키 확인 | 완료 | 전체 단계 타이머 미기록 |
| 문제 p3–4 / 해설 p2 렌더 및 SHA 검증 | PASS, 원본 해시 일치 | PDF 렌더 도구 wall time 약 5초 |
| page/section mapping 및 allowlist freeze | PASS, 8/8 | 미계측 |
| crop 생성·시각검수 | PASS, 8 crops + diagram 1 | 실행 호출 약 3초 |
| 원문·choices 전사 및 parity | PASS, 8/8 | 미계측 |
| 독립 풀이·공식 해설 crosswalk | PASS, answer/solution 8/8 | 미계측 |
| static syntax/VM/schema/identity 검사 | PASS | 실행 호출 약 3초 |
| exam/solution/answer browser render | PASS, 3 modes | 약 2초의 브라우저 검사 호출들 |

총 세션 elapsed는 task dispatch 시점 타이머가 없어서 정확히 복원할 수 없음. 위 값은 도구 응답에서 직접 확인된 단계 실행 시간만 기입함.

## 동결된 문항 분모

8문항: printed displayNo `02, 03, 04, 06, 07, 08, 09, 10`.

- 물리 p3 / 인쇄 26쪽: `02, 03, 04`
- 물리 p4 / 인쇄 27쪽: `06, 07, 08, 09, 10`
- 공식 답·해설: 물리 p2 / 인쇄 143쪽
- 평면좌표 set과 공유하는 물리 p3–4 범위에서 직선 allowlist 밖 번호는 제외함.
- source identity는 `bookId + setKey + printed displayNo + problem PDF page + prompt fingerprint`로 잠금. 전체 목록·해시·fingerprint는 `source_identity_manifest.json` 참조.
- 원문/choices는 full-page image와 각 source crop을 대조해 exact parity 8/8. 선택지는 없는 문항들로 `choices: []`.

## 답·풀이 검증

먼저 직접 풀고 공식 해설 p143과 번호, 단원, 발문 지문을 함께 대조했다. 정답 일치 8/8, 학생 풀이 8/8, 예외/수동검수 0. item별 crosswalk는 `answer_solution_crosswalk.json` 참조.

협업자가 발견한 좌표 전사 오류(`(-1,,4)`, `(-1,,3)`)를 수정했다. 원인은 JS 문자열에서 이스케이프되지 않은 `\,`가 런타임에서 슬래시를 삼켜 쉼표 두 개로 출력된 것이었다. 전체 8문항의 content, answer, solution, choices를 재검색하고 원본 픽셀과 다시 대조했으며 잔여 중복쉼표/미이스케이프 쉼표 패턴은 0건이다. 수정 뒤 `node --check`, VM parse, 3개 브라우저 모드를 다시 실행했다.

## 분류와 메타

- L1: `H22-C2-02` / 직선의 방정식
- L2: `H22-C2-02-LINE_EQUATION` / 직선의 방정식
- subunit confidence/depth는 현행 canonical enum 사용.
- 난이도 `level`은 사용자 지시에 따라 미확정 공란. L3/L4 등 상위 메타는 임의로 채우지 않았다.
- 구형 textbook `archiveAllowedFields` 목록에는 현재 canonical 4개 `subUnit*` 분류 필드가 빠져 있음. 공통 pipeline은 수정하지 않았고, 이 작업의 정적 검사에서는 현재 분류 필드를 명시적으로 허용해 검사했다.

## 정적·브라우저 검증

- JS syntax: PASS; questionBank VM parse: PASS.
- 문항 수/ID 중복/allowlist/choices 배열/L1·L2 mapping: PASS, 8/8.
- answer + solution: 8/8, 공식 답·해설 일치 8/8.
- source image 1개(09 도식), 경로 존재 및 렌더 load PASS. full-page image나 문제 전체 crop은 JS `image`로 연결하지 않음.
- archive engine render: exam 8문항/2 pages, solution 8문항/3 pages, answer 8 entries/1 page. MathJax node 수는 각 41/146/11, load/render errors 0, horizontal overflow 0.
- 공용 엔진은 8문항 subset에 화면 번호 1–8을 순차 부여함. 원 인쇄 번호는 동결 manifest/crosswalk의 authority로 유지.
- 상세 정적/렌더 결과: `static_validation.json`, `browser_render_check.json`.

## Notion 및 handoff

Notion self, GPT 라우터, Archive lifecycle 문서를 읽고 textbook-specific 결과 record를 검색했으나 이 set의 진행 문서/상태판은 찾지 못했다. unrelated Archive CURRENT/HISTORY 페이지는 수정하지 않음; coordinator에게 이 결과와 commit/push SHA를 직접 handoff한다.

## 종료 상태

현재 상태, branch, commit 및 remote SHA는 coordinator handoff와 최종 응답에 적는다. 이 작업에서 별도 다음 소단원은 시작하지 않는다.
