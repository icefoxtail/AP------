# 2025 금당고 고1 2학기 기말 — 학생용 작은칠판 해설 업그레이드

## 범위와 기록
- 원본: `archive/exams/original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`
- 작업 브랜치: `work/solution-upgrade-25-geumdang-h1-2final-20261015`
- 기준 main 커밋: `4692e220a230bb10cd0c0874f833b01fb972dbe8`
- 작업 전 JS Git blob: `44b8dc33534f3e40990bbebf9fc113d37d7f51ae`
- 작업 후 JS Git blob(본 보고서 작성 시점): `9412c07c5919cf3d556e72d60c40f3d87a083179`
- 22문항, 5개 배치 [1~5 / 6~10 / 11~15 / 16~20 / 21~22] 실제 분리 검산·변경·Git 커밋 완료.
- 수학 source-first 답안 기록: `source_first_math_freeze.json` → 해설·정답 비교: `final_math_compare_22.json`.
- 사용자 명시 범위: **제작 브랜치 작업만**, main 병합·PR merge·Pages 배포 금지.

## 문항별 판정
|문항|판정|실제 변경/근거|
|---|---|---|
|01|KEEP|객관적 집합 기준, 보기 ①~⑤ 검산|
|02|KEEP|부분집합·공집합, 다섯 보기 판정|
|03|KEEP|집합 동일 조건 a=6|
|04|KEEP|명제 진리값 다섯 보기 독립 판정|
|05|KEEP|진리집합에 따른 필요조건|
|06|KEEP|PNG 화살표 확인, 역함수 없음|
|07|UPGRADE|합성함수 대입 및 제곱 계산 세로 전개|
|08|UPGRADE|역함수 관계와 두 일차식의 뺄셈 계산 명시|
|09|UPGRADE|기존 유리함수 SVG의 좌표 보존, 제목·설명 보강|
|10|KEEP|근호 조건 −3≤x≤3, 정수 7개 이미 완결|
|11|KEEP|약수 집합 2⊆n⊆24, 곱48|
|12|KEEP|결론 거짓 범위 x<2,y<3 → 최솟값 k=12의 엄밀한 반례|
|13|KEEP|산술기하평균 등호 x=3,y=2|
|14|KEEP|합성 반복 f(2)=f(1)=1|
|15|UPGRADE|f와 역함수의 정의역·치역 명시; 기존 SVG 좌표 보존·접근성 보강|
|16|UPGRADE|a=3,b=2,c=2, 무리함수 시작점 및 제1·2사분면 Python 검산 SVG 신규|
|17|KEEP|집합의 소수 합 경우 두 가지 및 k=21,30|
|18|KEEP|원 x²+y²=10와 직선 2x−y=k의 수학·SVG 실제 geometry 검산|
|19|UPGRADE|0<k<5에서 절댓값 함수의 네 실근을 나타낸 SVG 신규|
|20|UPGRADE|각 구간의 치역 경계와 일대일 대응 조건을 나타낸 SVG 신규|
|21|UPGRADE|서술형 서로소 정의와 서로 다른 두 예시를 독립 판서|
|22|UPGRADE|D>0·작은 근≥0 및 경계 교점수 보강; 기존 SVG 설명 개선|

- KEEP 13, UPGRADE 9. 학생용 `solution` 실제 변경 5문항(7,8,15,21,22).
- 원래 해설 SVG 4개: q09 POLISH, q15 POLISH, q18 KEEP, q22 POLISH (기존 실제 geometry 바이트 그대로).
- 신규 해설 SVG 3개: q16(421 sampled points), q19(903), q20(652).
- `tags`는 새 그래프와 직접 연결된 q19·q20에만 "그래프" 추가. 신규 3개 시각자료는 `solutionImageSize:"full"`. `archive/engine.html`의 `image-medium` 높이 제한 145px을 피하기 위해 full 크기 선택; 실제 화면 렌더는 미실시.

## 수학 핵심과 교육과정
- q16: `y=√(3x+2)+2`, 정의역 [−2/3,∞), 치역 [2,∞), 제1·2사분면.
- q19: `(x−3)²=5+k` / `(x−3)²=5−k`로 분기; 정수 k=1,2,3,4의 합 10.
- q20: x<1 구간 치역 (−∞,5); x≥1 구간 치역 [5,∞)을 잇도록 a=2,b=−4, g(3)=13.
- q21: `A∩B=∅`, 구체적인 두 쌍의 서로소 예시.
- q22: `t=√(x−2)≥0`, `t²−t+(k+2)=0`, 판별식과 작은 근 범위로 `−2≤k<−7/4`. k=−2 포함(두 점), k=−7/4 제외(한 점).
- 22/22의 답은 source-first 독립 수학 계산 기록과 비교 시 수학적으로 일치. 내용/보기/정답/기존 문제 PNG/신원/출처/provenance 보호 및 기출 메타 parent·label 일치.
- 고1 공통수학2와 이전 중등·고1 개념만 사용. 미분·벡터·상위 선택과목 방법 추가 없음.

## 실제 수행한 정적/수치 확인
- JS: V8 평가 및 문항뱅크 구조 로드 22/22, id·보기 수·정답·보호 필드 차이 0, 수정 해설 LaTeX 달러 쌍 검사.
- Metadata: 해당 22개 `subUnitKey`와 최신 compiled master(`archive/data/master_tables/js_archive_tag_master.json`, blob `f0dc633dfac792ffd2fb4d8cbd3c7cb82d725593`) parent·label 불일치 0.
- SVG: q09/q15/q18/q22 기존 geometry 4/4 바이트 정합, q16/q19/q20 실수 함수에 대해 Python 원식·특수점·범위 검산 및 저장된 polyline pixel→math 역산 일치.
- SVG 현재 파일 7/7 존재 및 JS 참조 일치. DOM viewBox/title/desc 정적 점검, script·foreignObject 신규 없음.
- 원본 문제 이미지 q06/q16 Git 실파일 열람 및 문제식/풀이와 대조.
- 원본 JS 구조를 정규화하거나 공유 engine/validator/db/catalog/index/타 시험지를 수정하지 않음.

## 미실행 검증 — PASS라 주장하지 않음
- `node --check` 로컬 Node CLI 실제 실행: `NOT_RUN` (Git connector를 통한 JS V8 eval·parse는 수행).
- Golden/Negative calibration 명세 판독 및 비교 수행; 공식 `solution-calibration-gate.mjs` 실행: `NOT_RUN` (실제 실행을 PASS로 승격하지 않음).
- Archive 프로덕션 브라우저 `exam / sol / ans` 실제 출력·인쇄·겹침·잘림: `NOT_RUN` (Git connector 세션에는 실제 브라우저 실행·캡처 경로 없음).
- 별도 모델/세션 완전 blind 독립 검증: `NOT_RUN`, 동일 세션의 독립 source-first 풀이 동결/비교만 수행.

## 현재 종료 상태
- `BRANCH_CONTENT_READY`: 22/22 수학적 검산 및 학생용 텍스트·SVG 제작, 변경 범위 보호, 브랜치 누적 커밋까지 완료.
- `RENDER_PENDING / NOT_FINAL_SEAL`: 실제 Archive 학생용 화면 렌더 검사는 남음. 따라서 공식 출판/브라우저 최종 PASS를 주장하지 않음.
- **main 미병합, 배포 미실시.** 형님이 별도 운영병합 지시할 때만 출고·브라우저 기술 검증 단계 진입.

## 적용 품질 기준
- Notion GPT 작업 전 필독 라우터 → Archive 시작 페이지 → Archive 생명주기 → 작은칠판 해설 규정(2026-10-13/14 현행).
- `AGENTS.md` blob `de297c6a6903413790387e411a89e06dd650d4cf`.
- `JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md`, `도형추출.md v3.0`, `COMMON_PROTOCOL_v1.2.10`, Golden Sample 25 매산여고 2중간/25 순천고 2중간, 복성고 False-PASS Negative Sample 및 병합된 강남여고 PR #442.
