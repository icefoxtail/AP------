# CODEX_TASK_01_TEXTBOOK_BASE.md

## 0. 작업 제목

교재 PDF 1권을 기존 JS아카이브 구조에 맞춰 단원별 JS 초안, 문항 id 체계, 필수 태그, assets 경로, reports 구조까지 생성하라.

이 문서는 교재 변환 3단계 중 1단계다.

1단계 목표:
- 문제 PDF에서 문항을 최대한 추출한다.
- 기존 JS아카이브 서식을 따른다.
- 모든 문항은 룰북 필수 필드와 필수 태그를 갖춘다.
- 이미지/표/도형 문항은 실제 crop 여부와 무관하게 JS에 assets 경로를 1차부터 넣는다.
- 본문 문제뿐 아니라 후반 추가 문제/대표문제 다시 풀기 섹션까지 별도 section으로 인식한다.
- 정답 완성이나 실제 이미지 crop 완성은 하지 않는다.
- 운영 archive에는 반영하지 않고 archive/textbook/generated 아래 staging 산출물만 만든다.

---

## 1. 작업 루트

최상위 프로젝트 루트:

C:\Users\USER\Desktop\AP------

WSL 기준:

/mnt/c/Users/USER/Desktop/AP------

실제 작업 대상 루트:

C:\Users\USER\Desktop\AP------\archive\textbook

WSL 기준:

/mnt/c/Users/USER/Desktop/AP------/archive/textbook

입력 PDF와 정답 PDF는 archive/textbook 안에 있다.
산출물도 archive/textbook/generated 아래에만 저장한다.

---

## 2. 입력 파일 식별

archive/textbook 안에서 PDF 목록을 먼저 확인하라.

예상 입력:

문제 PDF:
22개정 RPM 2-1.pdf

정답 PDF:
RPM 2-1 정답.pdf

실제 파일명이 다르면 현재 폴더 listing을 기준으로 가장 적절한 문제 PDF와 정답 PDF를 식별하라.
식별 실패 시 변환을 시작하지 말고 CODEX_RESULT.md에 BLOCKED로 보고하라.

---

## 3. 고정 book 정보

교재마다 아래 값을 config로 관리하라.
이번 RPM 2-1 기준은 아래처럼 고정한다.

bookTitle:
22개정 RPM 중학수학 2-1

bookId:
rpm_m2_1_2022

archiveTitlePrefix:
22개정 RPM 중학수학 2-1

assetsBasePath:
assets/rpm_m2_1_2022

generatedAssetsDir:
generated/assets/rpm_m2_1_2022

단원별 JS 파일명:

generated/js/rpm_m2_1_2022_u01.js
generated/js/rpm_m2_1_2022_u02.js
generated/js/rpm_m2_1_2022_u03.js
...

---

## 4. 작업 전 읽을 rules 문서

전체 rules를 무작정 전부 읽지 마라.
이번 작업에 필요한 JS아카이브/문항 추출/도형 추출/검수 관련 문서만 읽는다.

rules 위치:

C:\Users\USER\Desktop\AP------\rules

필수 확인:
- JS아카이브룰북
- 문제해설추출
- 도형추출
- JS아카이브 표준단원키 마스터 테이블
- JS아카이브 1차 검수 프로토콜
- 수학 문항 오류 검증 프로토콜 v2.1
- 무결성검수

보조 확인:
- JS_변환_프롬프트
- 수정후보고프로토콜

읽지 않아도 되는 것:
- 왕지교육 OS 구조/로드맵
- Worker/API/수납/운영모드 관련 문서
- AI스튜디오
- 프로젝트 컨텍스트
- 봉인
- 해설프로토콜
- JS아카이브 2차/3차 최종 검수 프로토콜
- 헬모드최종

---

## 5. 기존 JS아카이브 구조 확인

새 JS 포맷을 만들지 마라.
반드시 기존 archive JS 샘플을 먼저 확인하라.

확인 위치:

C:\Users\USER\Desktop\AP------\archive

검색 키워드:
- window.examTitle
- window.questionBank
- questionBank
- id
- content
- choices
- answer
- solution
- image
- assets
- tags
- standardUnitKey
- standardUnit
- category

최소 5개 이상의 기존 정상 JS 파일을 열어 다음을 확인하라.

1. window.examTitle 선언 방식
2. window.questionBank 선언 방식
3. id 필드 타입
4. content 필드명
5. choices 필드명
6. answer 필드명
7. solution 필드명
8. image/assets 필드명
9. tags 필드 구조
10. standardUnitKey / standardUnit 필드 구조
11. category / originalCategory 필드 구조
12. layoutTag / wide 등 룰북상 필수 서식

생성 JS는 기존 구조와 룰북을 기준으로 맞춘다.

---

## 6. 단원 제목과 window.examTitle 원칙

archive 출제/검색 화면에서 제목이 정확히 보이도록 각 단원 JS에는 정확한 window.examTitle을 넣어라.

형식:

window.examTitle = "22개정 RPM 중학수학 2-1 | 1단원 유리수와 순환소수";

단원별 title/examTitle은 파일명이나 u01 같은 임시값으로 두지 마라.

예시:

22개정 RPM 중학수학 2-1 | 1단원 유리수와 순환소수
22개정 RPM 중학수학 2-1 | 2단원 단항식의 계산
22개정 RPM 중학수학 2-1 | 3단원 다항식의 계산
22개정 RPM 중학수학 2-1 | 4단원 일차부등식
22개정 RPM 중학수학 2-1 | 5단원 일차방정식
22개정 RPM 중학수학 2-1 | 6단원 일차함수
22개정 RPM 중학수학 2-1 | 7단원 일차함수와 그래프
22개정 RPM 중학수학 2-1 | 8단원 일차함수와 일차방정식의 관계

실제 PDF 목차가 다르면 PDF 기준 단원명을 우선한다.
불확실하면 임의 확정하지 말고 reports에 남긴다.

---

## 7. 문항 id 절대 원칙

가장 중요한 것은 문항 id와 원본 문항번호의 안정성이다.

교재 원본 누적 문항번호 = JS id = question_id = assets q번호 = 정답 연결 번호

예:

원본 121번
→ id: 121
→ question_id: 121 또는 기존 구조에 맞는 대응 필드
→ image: "assets/rpm_m2_1_2022/q121.png"
→ generated/assets/rpm_m2_1_2022/q121.png
→ 정답지 121번

문항 id를 새로 만들지 마라.
단원별로 1부터 다시 시작시키지 마라.
페이지별 상대 번호를 id로 쓰지 마라.

---

## 8. 본문/추가 문제 섹션 분리 인식

교재 PDF는 본문 문제만 있는 구조가 아니다.

반드시 아래 섹션을 분리해서 인식하라.

1. 본문 문제 섹션
2. 정답 및 풀이 섹션
3. 대표문제 다시 풀기 섹션
4. 단원별 추가 문제 섹션
5. 기타 부록/복습/마무리 문제 섹션

중요:
본문 누적 문항이 끝난 뒤에도 추가 문제/대표문제 다시 풀기 문항이 존재할 수 있다.
본문에서 안정적으로 감지되는 번호가 예를 들어 1099번까지라고 해서 1101 이후를 가짜 문항으로 단정하지 마라.

추가 문제 섹션 탐색 키워드:
- 대표문제 다시 풀기
- 정답 및 풀이 이후 새 문제 페이지
- 단원 제목 재등장
- 01 유리수와 순환소수
- 02 단항식의 계산
- 03 다항식의 계산
- 04 일차부등식
- 05 일차방정식
- 06 일차함수
- 07 일차함수와 그래프
- 08 일차함수와 일차방정식의 관계
- 본책
- 추가 문제
- 마무리 문제

추가 문제 섹션의 화면 표시 번호 01, 02, 03 등은 원본 누적 id와 다를 수 있다.
이 경우 기존 누적 id는 유지하고, 원본 표시번호는 별도 필드 또는 reports에 기록하라.

권장 필드 또는 report 항목:
- sectionType
- sourceDisplayNo
- originalDisplayNo
- sourcePage
- sourceSectionTitle
- sourceSectionOrder

---

## 9. 모든 문항의 JS 서식 완성 원칙

모든 문항은 룰북에 명시된 JS 서식을 갖춰야 한다.

비어 있는 필수 태그는 허용하지 않는다.

금지:
- tags: []
- tag: ""
- null tag
- undefined tag
- 빈 문자열 태그
- 의미 없는 임시 태그
- 룰북에 없는 임의 태그
- 이미지/표/도형 문항인데 이미지/표/도형 관련 태그 없음
- assets 경로가 필요한 문항인데 image/assets 참조 없음

확실한 태그를 판단하기 어려운 경우에도 룰북에서 허용되는 가장 안전한 태그를 부여하고, 해당 문항을 modified_or_inferred_questions.json에 기록하라.

---

## 10. assets 경로 1차 선삽입 원칙

이미지/표/도형 문항은 실제 PNG crop 성공 여부와 무관하게 1차 JS 생성 단계에서 image/assets 경로를 반드시 포함해야 한다.

고정 경로:

assets/rpm_m2_1_2022/qNNN.png

예:

1번 -> assets/rpm_m2_1_2022/q001.png
7번 -> assets/rpm_m2_1_2022/q007.png
21번 -> assets/rpm_m2_1_2022/q021.png
121번 -> assets/rpm_m2_1_2022/q121.png
1258번 -> assets/rpm_m2_1_2022/q1258.png

문항 하나에 이미지가 여러 개 있으면:

assets/rpm_m2_1_2022/q121.png
assets/rpm_m2_1_2022/q121_2.png
assets/rpm_m2_1_2022/q121_3.png

실제 PNG가 아직 없어도 JS 경로는 들어가야 한다.
단, 실제 PNG가 없으면 crop_pending_assets.json에 pending_crop으로 기록하라.

가짜 PNG, 빈 PNG, 페이지 전체 PNG를 최종 assets로 만들지 마라.

---

## 11. 발문 placeholder 금지 원칙

content가 아래처럼 남으면 안 된다.

[원본 PDF 문항 감지 실패]

만약 문항 번호는 감지했지만 발문을 못 찾은 경우:
1. 먼저 본문 섹션만 보지 말고 추가 문제/대표문제 다시 풀기 섹션까지 재탐색한다.
2. 그래도 못 찾으면 content를 임의 창작하지 않는다.
3. placeholder는 reports에만 남기고, 운영 후보 여부를 분리해 기록한다.
4. JS에 placeholder content를 남기는 것은 임시 staging에서는 허용하되, 최종 완료 보고에서는 placeholder 개수를 반드시 별도 보고한다.
5. 최종 검증에서 placeholder 0을 목표로 한다.

생성/갱신 reports:
- content_placeholder_report.json
- content_still_missing.json
- additional_section_question_index.json
- placeholder_additional_section_mapping.json

---

## 12. 정답은 1단계에서 완성하지 않는다

1단계에서는 answer를 완성하려 하지 마라.
정답은 2단계 전용 MD에서 정답 PDF를 기준으로 별도 처리한다.

1단계에서 허용:
- answer 필드를 기존 구조에 맞게 빈 값 또는 기본값으로 둠
- 정답 연결 가능성 report만 생성
- 정답 PDF 식별만 수행

1단계에서 금지:
- 정답 추측
- 풀이 과정 숫자를 answer로 사용
- 정답지 전체 파싱 결과를 완성본처럼 보고

---

## 13. 이미지 crop은 1단계에서 완성하지 않는다

1단계에서는 assets 경로와 crop 대상 목록을 만드는 것이 목표다.
실제 crop은 3단계 전용 MD에서 처리한다.

1단계에서 생성할 reports:
- asset_tagged_questions.json
- crop_target_questions.json
- crop_pending_assets.json

---

## 14. 1단계 자동화 스크립트

필수 스크립트:

archive/textbook/tools/build-rpm-textbook-archive.mjs

필요하면 생성:
- archive/textbook/tools/rpm_m2_1_2022.config.json
- archive/textbook/tools/validate-generated-rpm.mjs

권장 기능:
- config 로딩
- 입력 PDF 식별
- 정답 PDF 식별
- rules 확인 결과 기록
- 기존 archive JS 구조 분석
- PDF 페이지 수 확인
- 본문/추가 문제 섹션 인덱싱
- 페이지별 텍스트 추출
- 문항번호 추출
- 단원 경계 추정
- 문항 객체 생성
- 룰북 필수 서식/태그 채우기
- 이미지/표/도형 문항 assets 경로 선삽입
- placeholder 감지 및 추가 섹션 재탐색
- 단원별 JS 저장
- reports 저장
- node --check
- CODEX_RESULT.md 작성

---

## 15. 1단계 reports

반드시 생성/갱신:

- generated/reports/progress.json
- generated/reports/rules_read_report.json
- generated/reports/archive_structure_inspection.json
- generated/reports/page_processing_log.json
- generated/reports/section_index_report.json
- generated/reports/additional_section_question_index.json
- generated/reports/question_id_coverage_report.json
- generated/reports/content_placeholder_report.json
- generated/reports/content_still_missing.json
- generated/reports/modified_or_inferred_questions.json
- generated/reports/asset_tagged_questions.json
- generated/reports/crop_target_questions.json
- generated/reports/crop_pending_assets.json
- generated/reports/validation_report.json

---

## 16. 1단계 검증 기준

PASS 조건:
- 단원별 JS 생성
- window.examTitle 정확함
- questionBank 배열 존재
- id 중복 없음
- 원본 감지 문항이 JS에 누락되지 않음
- placeholder 개수 보고됨
- 추가 문제 섹션 인덱싱 수행됨
- 모든 문항이 룰북 필수 서식 보유
- tags 빈 값 없음
- 이미지/표/도형 문항에 관련 tag 있음
- 이미지/표/도형 문항에 assets 경로 있음
- node --check PASS
- 운영 archive 수정 없음
- git add/commit/push 없음

FAIL 조건:
- id 변경/누락
- JS 문법 오류
- tags 빈 값
- 이미지/표/도형 문항 assets 경로 누락
- 추가 문제 섹션을 확인하지 않고 placeholder를 가짜 문항으로 단정
- 기존 운영 archive 수정
- git add/commit/push 실행

---

## 17. CODEX_RESULT.md 1단계 보고

archive/textbook/CODEX_RESULT.md에 아래 구조로 보고하라.

# CODEX_RESULT

## 1. 생성/수정 파일
## 2. 구현 완료 또는 확인 완료
## 3. 실행 결과
- 처리 페이지 수
- 생성 단원 JS 수
- 감지 문항 수
- JS 포함 문항 수
- placeholder 최초 수
- placeholder 복원 수
- 남은 placeholder 수
- 추가 문제 섹션 감지 여부
- tags 빈 값 위반 수
- 이미지/표/도형 태그 누락 수
- JS assets 경로 삽입 수
- node --check 결과
## 4. 결과 요약
## 5. 다음 조치

---

## 18. 금지 작업

- 운영 archive 파일 수정 금지
- 기존 archive/exams 수정 금지
- 기존 운영 assets 수정 금지
- Worker/API/DB 수정 금지
- 학생 포털 수정 금지
- 정답 추측 금지
- 실제 crop 완성 처리 금지
- 문항 id 새로 생성 금지
- placeholder 문항 임의 창작 금지
- git add 금지
- git commit 금지
- git push 금지

---

## 19. 마지막 실행 지시

이 파일을 처음부터 끝까지 다시 읽고 그대로 실행하라.
작업 범위를 줄이지 마라.
본문 문제뿐 아니라 후반 대표문제 다시 풀기/추가 문제 섹션까지 반드시 인덱싱하라.
정답 완성은 2단계에서 하며, 실제 assets crop은 3단계에서 한다.
기존 운영 archive 파일은 수정하지 마라.
git add/commit/push는 하지 마라.
