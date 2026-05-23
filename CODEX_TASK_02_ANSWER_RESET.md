# CODEX_TASK_02_ANSWER_RESET.md

## 0. 작업 제목

교재형 JS아카이브 2단계: 정답 PDF를 기준으로 answer 전체 재작성, rawAnswer 보존, answerType 분류, structuredAnswer reports 생성을 수행하라.

이 문서는 교재 변환 3단계 중 2단계다.

2단계 목표:
- 문제 PDF/발문/태그/assets는 건드리지 않는다.
- 정답 PDF만 다시 읽는다.
- “답” 표시 뒤의 원문 rawAnswer를 보존한다.
- answerType을 분류한다.
- 기존 JS 구조가 배열 answer를 허용하지 않으면 answer에는 rawAnswer 문자열을 넣고 structuredAnswer는 reports에 저장한다.
- 문항 id와 questionBank 구조를 유지한다.

---

## 1. 작업 루트

최상위 프로젝트 루트:

C:\Users\USER\Desktop\AP------

작업 대상 루트:

C:\Users\USER\Desktop\AP------\archive\textbook

WSL 기준:

/mnt/c/Users/USER/Desktop/AP------/archive/textbook

---

## 2. 입력 파일

문제 PDF는 이번 라운드에서 재변환하지 않는다.

정답 PDF:
RPM 2-1 정답.pdf

실제 파일명은 archive/textbook listing으로 확인한다.

---

## 3. 절대 변경 금지

이번 라운드에서 아래는 절대 변경하지 마라.

- generated/js의 id
- question_id
- sourceQuestionNo
- questionBank 문항 수
- 단원별 JS 파일 수
- window.examTitle
- content
- choices
- tags
- standardUnitKey
- category
- originalCategory
- assets/image 경로
- solution
- layoutTag
- wide
- generated/assets
- crop 관련 reports의 의미
- 운영 archive
- git add/commit/push

변경 허용:
- generated/js의 answer 필드
- answer 관련 reports
- CODEX_RESULT.md
- 정답 전용 tools

---

## 4. 정답 추출 핵심 원칙

정답 PDF에는 풀이 과정 숫자, 중간 계산, 분수, 소수, 표, 채점 기준이 섞여 있다.
문항 번호 주변 숫자를 전부 answer 후보로 잡지 마라.

반드시 “답” 표시 기준으로 추출하라.

정답 추출 우선순위:
1. “답” 표시 바로 뒤 원문 전체를 rawAnswer로 보존한다.
2. 같은 줄 또는 같은 answer block 안의 최종 답만 사용한다.
3. 풀이 과정 중간의 계산식/분수/소수는 answer 후보에서 제외한다.
4. O/X 문항은 “답 ◯”, “답 ×”, “답 O”, “답 X”를 기준으로 한다.
5. 객관식은 “답 ④”, “답 ②, ④”처럼 선택지 기호를 기준으로 한다.
6. 빈칸형은 ㈎, ㈏, ㈐ 같은 label과 값을 모두 보존한다.
7. 변수형은 x=..., y=..., A=..., B=... 등을 모두 보존한다.
8. 식/다항식 정답은 원문을 보존한다.
9. 복수 정답을 첫 값 하나로 줄이지 마라.
10. 확정 불가하면 manual_review_required로 남긴다.

---

## 5. answerType 분류

각 문항의 rawAnswer를 아래 answerType 중 하나로 분류하라.

- single_choice
- multiple_choice
- ox
- blank_multi
- variable_multi
- expression
- text_pair
- manual_review_required

예시:

single_choice:
답 ④

multiple_choice:
답 ②, ④

ox:
답 ◯
답 ×
답 O
답 X

blank_multi:
답 ㈎ 5² ㈏ 100 ㈐ 0.25

variable_multi:
답 x=63, y=40
답 A=-3x²y, B=..., C=...

expression:
답 -4x²+11x+13
답 1/4<a<2

text_pair:
답 1.4, 유한소수
답 0.333..., 무한소수

manual_review_required:
답 표시가 없거나, 답 블록이 깨져 자동 확정 불가한 경우

---

## 6. rawAnswer 보존 원칙

모든 문항에 대해 가능한 한 rawAnswer를 reports에 보존하라.

JS answer 필드:
- 기존 JS 구조가 배열 answer를 허용하지 않으면 rawAnswer 문자열을 저장한다.
- 기존 구조가 배열 answer를 허용하는 명확한 사례가 있을 때만 배열을 사용한다.
- 이번 프로젝트에서는 기존 배열형 answer 사용 사례가 없으면 answer에는 rawAnswer 문자열을 넣는다.

structuredAnswer:
- JS에 넣지 말고 reports에 저장한다.
- 복수 선택, 빈칸형, 변수형, O/X 표기 변형, 동치 답안은 structuredAnswer로 분리한다.

---

## 7. 정답 전용 reports

반드시 생성/갱신:

- generated/reports/answer_raw_blocks_by_question.json
- generated/reports/answer_type_classification_report.json
- generated/reports/answer_structured_variants_report.json
- generated/reports/answer_manual_review_required_reset.json
- generated/reports/answer_link_report_reset.json
- generated/reports/answer_map_from_answer_pdf_reset.json
- generated/reports/answer_correction_summary.json

필요하면 백업:

- generated/reports/answer_reset_backup/<timestamp>

---

## 8. 정답 전용 스크립트

권장 스크립트:

tools/repair-rpm-answers-reset.mjs

기능:
- 정답 PDF 페이지별 텍스트 추출
- “답” 표시 block 추출
- 문항번호와 rawAnswer 연결
- answerType 분류
- structuredAnswer 생성
- generated/js answer 필드만 재작성
- answer reports 생성
- node --check 실행
- coverage 유지 확인
- CODEX_RESULT.md 추가 보고

---

## 9. 검증 기준

PASS:
- 총 문항 수 유지
- missingQuestionNumbers 0
- questionBank shape preserved true
- content unchanged true
- choices unchanged true
- tags unchanged true
- assets unchanged true
- window.examTitle unchanged true
- node --check PASS
- answerType 총합 = JS 문항 수
- rawAnswer 가능한 문항은 reports에 보존
- manual_review_required 수 보고

FAIL:
- id 변경
- 문항 수 변경
- 발문 변경
- choices 변경
- tags 변경
- assets 변경
- 정답 추측
- 풀이 과정 숫자를 answer로 사용
- 복수 정답을 하나로 축소
- node --check 실패
- 운영 archive 수정
- git add/commit/push 실행

---

## 10. CODEX_RESULT.md 2단계 보고

archive/textbook/CODEX_RESULT.md에 아래 섹션을 추가하라.

## Round 2 answer reset

- 작업 범위:
- 정답 PDF:
- 총 문항 수:
- answer 채움 수:
- manual_review_required 수:
- single_choice 수:
- multiple_choice 수:
- ox 수:
- blank_multi 수:
- variable_multi 수:
- expression 수:
- text_pair 수:
- structured variants 기록 수:
- node --check 결과:
- questionBank shape preserved:
- missingQuestionNumbers:
- content unchanged:
- choices unchanged:
- tags unchanged:
- assets unchanged:
- generated reports:
- 기존 운영 archive 수정 여부:
- git add/commit/push 여부:

---

## 11. 마지막 실행 지시

이 파일을 처음부터 끝까지 다시 읽고 그대로 실행하라.
문제 PDF와 발문/태그/assets는 건드리지 마라.
정답 PDF만 기준으로 answer와 answer reports를 처리하라.
정답을 추측하지 마라.
“답” 표시 뒤 rawAnswer를 보존하라.
복수 정답/빈칸형/변수형을 하나로 줄이지 마라.
기존 운영 archive 파일은 수정하지 마라.
git add/commit/push는 하지 마라.
