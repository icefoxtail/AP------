# CODEX_TASK_03_ASSET_CROP.md

## 0. 작업 제목

교재형 JS아카이브 3단계: 이미지/표/도형 문항의 assets PNG 실제 crop 생성, 품질 검수, bad crop 격리, pending 관리, JS 경로 검증을 수행하라.

이 문서는 교재 변환 3단계 중 3단계다.

3단계 목표:
- JS에 이미 들어간 assets 경로를 기준으로 실제 PNG를 생성한다.
- 문항 전체 crop이나 페이지 crop이 아니라 시각 요소만 crop한다.
- 잘못된 crop은 bad_crop으로 격리한다.
- 실제 PNG가 없으면 pending에 남긴다.
- JS 경로/실제 PNG/pending/bad_crop 일관성을 검증한다.
- 정답/발문/태그는 건드리지 않는다.

---

## 1. 작업 루트

최상위 프로젝트 루트:

C:\Users\USER\Desktop\AP------

작업 대상 루트:

C:\Users\USER\Desktop\AP------\archive\textbook

WSL 기준:

/mnt/c/Users/USER/Desktop/AP------/archive/textbook

---

## 2. 절대 변경 금지

이번 라운드에서 아래는 절대 변경하지 마라.

- id
- question_id
- sourceQuestionNo
- questionBank 문항 수
- 단원별 JS 파일 수
- window.examTitle
- content
- choices
- answer
- answerType
- structuredAnswer reports
- tags
- standardUnitKey
- category
- solution
- 정답 관련 reports 의미
- 운영 archive
- git add/commit/push

변경 허용:
- generated/assets/rpm_m2_1_2022/*.png
- JS의 image/assets 경로 누락 보정
- crop/assets 관련 reports
- crop 품질 검수 tools
- CODEX_RESULT.md

---

## 3. assets 경로 고정 규칙

JS 내부 경로:

assets/rpm_m2_1_2022/qNNN.png

실제 파일 경로:

generated/assets/rpm_m2_1_2022/qNNN.png

예:

1번 -> assets/rpm_m2_1_2022/q001.png
7번 -> assets/rpm_m2_1_2022/q007.png
121번 -> assets/rpm_m2_1_2022/q121.png
1258번 -> assets/rpm_m2_1_2022/q1258.png

복수 이미지:

assets/rpm_m2_1_2022/q121.png
assets/rpm_m2_1_2022/q121_2.png
assets/rpm_m2_1_2022/q121_3.png

---

## 4. crop 대상 확정

대상은 아래에서 합쳐 dedupe한다.

- generated/reports/asset_tagged_questions.json
- generated/reports/crop_target_questions.json
- generated/reports/crop_pending_assets.json
- generated/reports/crop_review_report.json
- generated/js 안에서 이미지/표/도형 tag가 있는 문항
- generated/js 안에서 image/assets 경로가 있는 문항

결과 저장:

generated/reports/crop_target_questions.json

---

## 5. 실제 crop 원칙

최종 PNG는 문항 안의 시각 요소만 포함해야 한다.

시각 요소로 인정:
- 도형
- 그래프
- 좌표평면
- 표
- 그림
- 수직선
- 빈칸 도식
- 입체도형
- 색칠 영역
- 자료 해석 그림
- 식만으로 복원하기 어려운 배치형 그림

인정하지 않음:
- 문항 번호만
- 단원 라벨만
- 대표문제 라벨만
- 답 아이콘만
- 텍스트 발문 전체
- 풀이 과정 전체
- 페이지 장식
- 거의 빈 이미지
- 페이지 전체 또는 문항 전체

---

## 6. crop 실행 절차

1. 문제 PDF를 200~300 DPI로 페이지 렌더링한다.
2. 문항 번호 위치를 찾는다.
3. 다음 문항 번호 전까지 문항 영역을 잡는다.
4. 문항 영역 안에서 시각 요소 후보를 탐지한다.
5. 시각 요소만 8~24px 여백을 포함해 crop한다.
6. qNNN.png로 저장한다.
7. 여러 요소면 qNNN_2.png, qNNN_3.png로 저장한다.
8. 실패하면 pending에 남긴다.
9. 빈 PNG나 가짜 PNG는 만들지 않는다.

---

## 7. crop 상태값

crop_result_report.json에 다음 상태를 사용한다.

- crop_success
- crop_review_required
- no_visual_asset_found
- render_failed
- question_region_failed
- page_unresolved
- skipped_no_tool

---

## 8. crop 품질 검수

crop 생성 후 반드시 품질 검수를 한다.

품질 상태값:

- crop_quality_pass
- crop_quality_review
- crop_quality_fail_label_only
- crop_quality_fail_number_only
- crop_quality_fail_text_only
- crop_quality_fail_page_region
- crop_quality_fail_empty
- crop_quality_retry_needed
- crop_quality_pending

명백한 bad crop은 아래 폴더에 보존한 뒤 운영 assets에서 제거한다.

generated/reports/crop_quality_review/bad_crop

bad crop 예:
- 번호만 crop
- 라벨만 crop
- 대표문제 라벨만 crop
- 답 아이콘만 crop
- 텍스트만 crop
- 너무 넓은 문항/페이지 영역

---

## 9. pending 관리

실제 PNG가 없으면 반드시 pending에 기록한다.

generated/reports/crop_pending_assets.json

pending 상태:
- pending_manual_crop_needed
- pending_no_visual_asset_confirmed
- pending_page_region_failed
- pending_tool_limit
- pending_low_confidence
- pending_should_retry_later

JS 경로가 있는데 실제 PNG가 없고 pending에도 없으면 FAIL이다.

---

## 10. contact sheet

사람이 빠르게 볼 수 있도록 contact sheet를 생성하라.

기본 contact sheet:
- crop_success / crop_quality_pass
- crop_quality_review
- bad_crop
- retry_needed
- pending 대표 목록

저장 위치:

generated/reports/crop_contact_sheets
generated/reports/crop_quality_review/contact_sheets

각 썸네일에는 q번호와 status, 파일명이 보여야 한다.

---

## 11. assets 검증

반드시 아래를 검증한다.

- JS assets path 수
- 실제 PNG 수
- pending 수
- bad crop 수
- no visual confirmed 수
- missing actual without pending 수
- actual without JS reference 수
- visual-tagged without assets path 수
- node --check 결과

검증 스크립트:

tools/validate-rpm-assets.mjs

품질 검수 스크립트:

tools/review-rpm-crop-quality.mjs

필요하면 crop 실행 스크립트:

tools/crop-rpm-assets.mjs

---

## 12. 생성/갱신 reports

반드시 생성/갱신:

- generated/reports/crop_target_questions.json
- generated/reports/crop_tool_availability.json
- generated/reports/crop_result_report.json
- generated/reports/crop_pending_assets.json
- generated/reports/asset_file_existence_report.json
- generated/reports/js_asset_path_report.json
- generated/reports/asset_validation_report.json
- generated/reports/crop_contact_sheet_index.json
- generated/reports/crop_quality_review_report.json
- generated/reports/crop_quality_summary.json
- generated/reports/crop_pending_assets_review.json
- generated/reports/crop_quality_contact_sheet_index.json
- generated/reports/crop_quality_review/bad_crop/*
- generated/reports/crop_quality_review/contact_sheets/*.png

---

## 13. 검증 기준

PASS:
- node --check PASS
- validate-rpm-assets PASS
- missingQuestionNumbers 0
- questionBank shape preserved true
- answer unchanged true
- content unchanged true
- tags unchanged true
- JS 경로/실제 PNG/pending/bad_crop 일관성 PASS
- bad crop 격리
- contact sheet 생성

PARTIAL:
- 일부 crop만 성공했지만 pending과 reports가 정확함
- JS/PNG/pending 불일치 없음
- node --check PASS

FAIL:
- id 변경
- 문항 수 변경
- answer 변경
- content 변경
- tags 변경
- JS 문법 오류
- 실제 PNG 없음인데 pending 없음
- 실제 PNG 있음인데 JS 참조 없음
- bad crop 제거 후 pending 누락
- 운영 archive 수정
- git add/commit/push 실행

---

## 14. CODEX_RESULT.md 3단계 보고

archive/textbook/CODEX_RESULT.md에 아래 섹션을 추가하라.

## Round 3 assets crop and quality review

- crop target 문항 수:
- JS image/assets 경로 수:
- 실제 PNG 생성 수:
- crop_quality_pass 수:
- crop_quality_review 수:
- crop_quality_fail 수:
- bad_crop 이동 수:
- pending 수:
- contact sheet 생성 여부:
- node --check 결과:
- validate-rpm-assets 결과:
- questionBank shape preserved:
- missingQuestionNumbers:
- answer unchanged:
- content unchanged:
- tags unchanged:
- generated reports:
- 기존 운영 archive 수정 여부:
- git add/commit/push 여부:

---

## 15. 마지막 실행 지시

이 파일을 처음부터 끝까지 다시 읽고 그대로 실행하라.
정답/발문/태그는 건드리지 말고 assets crop과 품질 검수만 수행하라.
문항 전체 crop이나 페이지 전체 crop을 최종 assets로 만들지 마라.
가짜 PNG를 만들지 마라.
bad crop은 삭제 전 반드시 보존하라.
기존 운영 archive 파일은 수정하지 마라.
git add/commit/push는 하지 마라.
