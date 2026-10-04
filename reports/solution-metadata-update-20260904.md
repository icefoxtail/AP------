# 해설·세부단원 metadata 수정 및 독립 검수 보고

- 작업일: 2026-09-04 (Asia/Seoul)
- 작업 범위: 사용자가 확정한 기존 production JS의 solution, subUnitKey, subUnit
- 분리 범위: SVG 65개 HARD FAIL 및 geometry asset 수정은 본 작업에 포함하지 않음
- 수정 원칙: 승인된 문항·필드만 최소 수정, content·choices·answer·image·layoutTag·tags·wide 보호

## 수정 내역

### 해설 수정

| 시험지 | 문항 | 반영 내용 |
|---|---:|---|
| 22 순천여고 1기말 | q4, q5 | [보강]을 제거하고 핵심 설명 → 계산/판정 → 필요한 배제 → 마지막 결론 흐름으로 통합 |
| 23 제일고 1기말 | q16 | h=12/5를 “P에서 직선 AC에 내린 수선의 길이”로 명확히 하고 PQ=2h로 연결 |
| 25 순천고 2중간 | q7, q9, q10, q16, q17, q19, q22 | 결론 → [보강] 꼬리 구조를 제거하고 해당 풀이 단계에 설명·경우 판정·배제 근거를 삽입 |

25 순천고는 production JS와 생성 candidate JS를 동일하게 갱신했다.

### 세부단원 metadata 수정

| 시험지 | 문항 | 변경 후 subUnitKey |
|---|---:|---|
| 22 금당고 1기말 | q11 | H15-SA-11-INTERSECTION |
| 22 금당고 1기말 | q21 | H15-SA-11-TANGENT |
| 22 순천여고 1기말 | q4 | H15-SA-11-TANGENT |
| 22 제일고 1기말 | q15 | H22-C2-03-TANGENT |
| 22 제일고 1기말 | q16 | H22-C2-03-INTERSECTION |
| 22 제일고 1기말 | q17, q18 | H22-C2-03-TANGENT |
| 23 제일고 1기말 | q15 | H15-SA-11-INTERSECTION |
| 23 제일고 1기말 | q16, q17, q18 | H15-SA-11-TANGENT |
| 25 순천고 2중간 | q7, q10, q16, q19 | H22-C2-03-INTERSECTION |
| 25 순천고 2중간 | q9, q22 | H22-C2-03-TANGENT |
| 25 순천고 2중간 | q17 | 기존 H22-C2-03-TANGENT 유지 |

각 key의 subUnit 표시는 compiled master와 일치하도록 갱신했다. standardUnitKey는 변경하지 않았다.

## 정적 검증

- rules source pack: SOURCE_PACK_OK (MANIFEST의 현재 문서 해시 일치)
- node --check: 다섯 production JS 및 25 순천고 candidate 모두 PASS
- 문항 수: 22 금당고 21, 22 순천여고 23, 22 제일고 22, 23 제일고 22, 25 순천고 23
- ID 순서: 다섯 production 모두 순차 정합
- 보호 필드 diff lock: HEAD 대비 승인된 solution 및 지정된 subUnitKey/subUnit 외 변경 없음
- 25 순천고 candidate/production: byte-equal, SHA-256 parity PASS
- compiled master: 모든 대상 key가 존재하고 parent standardUnitKey 및 subUnit label 일치
- question-index: node archive/tools/build-question-index.mjs 실행, 10,980 records / source 10,980, duplicate qKey 0
- question-index target rows: 모든 대상 문항의 변경 key 반영 확인
- DB: 다섯 target의 file 및 qCount가 production JS와 일치
- archive audit: audit_archive_batch.mjs --repo . --strict-new로 다섯 시험지 실행, errors 0
- target solution asset references: 70개 참조 모두 파일 존재·0 byte 아님

실행한 archive audit 명령:

~~~powershell
node '.codex/skills/apmath-archive-exams/scripts/audit_archive_batch.mjs' --repo . --strict-new --exam 'exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js' --exam 'exams/original/high/h1/1final/22_순천여고_1학기_기말_고1_기출.js' --exam 'exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js' --exam 'exams/original/high/h1/1final/23_제일고_1학기_기말_고1_기출.js' --exam 'exams/original/high/h1/2mid/25_순천고_2학기_중간_고1_기출.js'
~~~

결과: ok: true, 다섯 report 모두 errors: [].

## 브라우저 렌더 검증

로컬 HTTP server에서 Codex In-app Browser로 아래 URL 계열을 qpp=4로 실제 로드했다. 각 mode에서 AX tree에 전체 문항과 마지막 문항이 나타나는지 확인했고, MathJax가 변환된 수식과 solution image 요소가 표시되는지 확인했다. 화면 캡처에서도 toolbar·시험지/해설지/정답표 레이아웃과 세로 스크롤이 정상적으로 표시되었다.

| 시험지 | exam | solution | answer | 확인 |
|---|---|---|---|---|
| 22 금당고 1기말 | PASS | PASS | PASS | q21 및 마지막 정답 확인 |
| 22 순천여고 1기말 | PASS | PASS | PASS | q4/q5 해설, q23 마지막 문항 확인 |
| 22 제일고 1기말 | PASS | PASS | PASS | q15~q18 metadata 대상, q22 마지막 문항 확인 |
| 23 제일고 1기말 | PASS | PASS | PASS | q16의 h=12/5, q22 마지막 문항 확인 |
| 25 순천고 2중간 | PASS | PASS | PASS | q7/q9/q10/q16/q17/q19/q22 해설, q23 마지막 문항 확인 |

브라우저에서 확인한 23 제일고 q16의 핵심 문장은 다음 의미로 렌더되었다.

~~~text
P에서 직선 AC에 내린 수선의 길이를 h라고 두면
5h/2 = 6, h = 12/5
접점현 PQ는 직선 AC에 수직이고 ... PQ = 2h = 24/5 = 4.8
~~~

## 독립 검수

독립 explorer 에이전트 Einstein이 현재 production JS를 별도로 읽고 다음을 확인했다.

- 다섯 production의 문항 수·순차 ID 정상
- 승인 목록 밖의 보호 필드 변경 없음
- 승인 solution 문항의 [보강] 꼬리표 제거 및 풀이 흐름 정상
- 직접 계산한 결과와 answer/solution 결론 일치
- 요청한 metadata 값 및 25 q17 유지 정상
- 25 candidate/production byte parity 정상
- 규칙 MANIFEST 해시 정상

독립 에이전트는 처음에 WARN을 제시했으나, 후속 확인 결과 이 사안은 정답 선택을 막는 오류가 아니라 양의 대표값 표기 convention으로 해소되는 경미한 source ambiguity로 판정되었다. 사용자가 해당 경고를 비차단 사항으로 승인했으므로 이 항목은 MASTER_ACCEPTED_PASS로 닫는다. 발문은 변경하지 않고, solution 안에 두 접선 표기의 양의 대표값 convention을 명시했다.

## 최종 판정

- 승인된 해설·metadata 수정 및 정적 무결성: PASS
- 독립 검수: MASTER_ACCEPTED_PASS (q4의 기존 발문 표현 모호성은 비차단 경고로 승인 종료)
- SVG HARD FAIL: 본 작업과 분리, 이 보고의 PASS/WARN 판정에 병합하지 않음
- production release — solution/metadata lane: PASS — q4 source ambiguity는 승인 종료되었고, SVG gate는 별도 범위로 유지
