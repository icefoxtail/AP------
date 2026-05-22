cd C:\Users\USER\Desktop\AP------

@'
# CODEX_TASK_03B_ASSET_CROP_QUALITY

## 0. 작업 제목

22개정 RPM 중학수학 2-1 교재형 JS아카이브 Round 3-B: assets crop 품질 검수·오탐 제거·재crop 보정 작업을 수행하라.

이번 작업은 Round 3에서 생성된 assets PNG와 crop reports를 품질 기준으로 재검토하는 작업이다.
목표는 “PNG 개수 늘리기”가 아니라 “잘못 crop된 이미지 제거/분리 + 실제 도형/그래프/표만 assets로 유지 + pending 목록 정리”다.

---

## 1. 작업 루트

최상위 프로젝트 루트:

C:\Users\USER\Desktop\AP------

WSL 기준:

/mnt/c/Users/USER/Desktop/AP------

작업 대상 루트:

C:\Users\USER\Desktop\AP------\archive\textbook

WSL 기준:

/mnt/c/Users/USER/Desktop/AP------/archive/textbook

반드시 archive/textbook 안의 generated staging 산출물만 수정한다.
기존 운영 archive 파일은 수정하지 않는다.

---

## 2. 현재 Round 3 결과 기준

현재 Round 3 결과는 구조적으로 PASS였지만 crop 품질은 PARTIAL이다.

기존 결과 요약:

- crop target 문항 수: 243
- JS image 경로 보정 수: 243
- 실제 PNG 생성 수: 99
  - crop_success: 93
  - crop_review_required: 6
- no_visual_asset_found: 139
- question_region_failed: 5
- pending assets: 150
- contact sheet: 5개
- node --check: PASS
- validate-rpm-assets: PASS
- missingQuestionNumbers: 0
- answer unchanged: true
- content unchanged: true
- tags unchanged: true

이번 작업은 위 구조를 깨지 말고 crop 품질만 보정한다.

---

## 3. 절대 변경 금지

아래 항목은 절대 변경하지 마라.

- generated/js의 문항 id
- question_id
- sourceQuestionNo
- questionBank 문항 수
- 단원별 JS 파일 수
- window.examTitle
- 발문/content
- choices
- answer
- answerType
- structuredAnswer 관련 reports
- tags
- standardUnitKey
- 단원 분류
- 정답 관련 reports의 의미
- 기존 운영 archive 파일
- 기존 운영 assets 파일
- rules 문서
- Worker/API/DB 파일
- git add
- git commit
- git push

이번 라운드에서 수정 가능한 것은 아래뿐이다.

- generated/assets/rpm_m2_1_2022 안의 잘못된 crop PNG 삭제 또는 quarantine 이동
- generated/assets/rpm_m2_1_2022 안의 실제 시각요소 PNG 재생성
- generated/js 안의 image/assets 경로를 pending 상태에 맞게 유지 또는 필요한 경우 제거/보정
- generated/reports 안의 crop/assets 관련 reports 생성 또는 갱신
- tools 안의 crop 품질 검수/재crop 보조 스크립트 생성 또는 수정
- CODEX_RESULT.md에 Round 3-B 결과 추가

---

## 4. 핵심 판정 원칙

이번 Round 3-B의 품질 기준은 다음이다.

최종 assets PNG는 문항 전체 crop이 아니고 페이지 crop도 아니다.
문항 안에 포함된 시각 요소만 crop해야 한다.

시각 요소로 인정:

- 도형
- 그래프
- 좌표평면
- 표
- 그림
- 수직선
- 빈칸이 포함된 도식
- 입체도형
- 색칠 영역
- 기하 그림
- 자료 해석용 표/그림
- 식만으로 복원하기 어려운 배치형 그림

시각 요소로 인정하지 않음:

- 문항 번호만 crop된 이미지
- 단원 라벨만 crop된 이미지
- “대표문제”, “꼭 풀어보기”, “RPM 비법 노트” 같은 라벨만 crop된 이미지
- 답 아이콘만 crop된 이미지
- 채점 기준표만 있는 이미지
- 텍스트 발문 전체 crop
- 풀이 과정 전체 crop
- 페이지 상단/하단 장식
- 거의 빈 흰 이미지
- 페이지 전체에 가까운 넓은 crop
- 좌우 페이지 일부가 통째로 들어간 crop

---

## 5. 반드시 먼저 확인할 파일

작업 시작 후 아래 파일들을 먼저 확인하라.

- generated/reports/crop_contact_sheet_index.json
- generated/reports/crop_contact_sheets/*.png
- generated/reports/crop_result_report.json
- generated/reports/crop_pending_assets.json
- generated/reports/asset_file_existence_report.json
- generated/reports/js_asset_path_report.json
- generated/reports/asset_validation_report.json
- generated/reports/asset_tagged_questions.json
- generated/js/*.js
- generated/assets/rpm_m2_1_2022/*.png

contact sheet 이미지를 기준으로 사람이 보기에도 이상한 crop 후보를 우선 분리하라.

이미 확인된 의심 후보는 반드시 재검토하라.

- q054
- q118
- q772
- q803
- q807
- q865
- q888
- q940

위 목록은 확정 삭제 목록이 아니라 “우선 재검토 대상”이다.
실제 파일을 열어 보고 판단하라.

---

## 6. Round 3-B 산출물 폴더

아래 폴더를 생성하라.

generated/reports/crop_quality_review
generated/reports/crop_quality_review/bad_crop
generated/reports/crop_quality_review/borderline_crop
generated/reports/crop_quality_review/good_crop
generated/reports/crop_quality_review/retry_needed
generated/reports/crop_quality_review/contact_sheets

잘못된 crop PNG를 바로 삭제하지 말고, 먼저 아래 quarantine 폴더에 복사 또는 이동하라.

generated/reports/crop_quality_review/bad_crop

운영용 generated/assets/rpm_m2_1_2022에서 제거하는 경우에도 bad_crop에 원본 사본을 남겨라.

---

## 7. crop 품질 검수 절차

아래 순서로 수행하라.

1. generated/assets/rpm_m2_1_2022/*.png 전체 목록을 만든다.
2. 각 PNG의 실제 이미지 크기, 평균 밝기, 비어 있는 정도, bounding box 비율을 계산한다.
3. crop_result_report.json의 bbox/status와 대조한다.
4. contact sheet를 기준으로 사람이 보기에도 시각 요소인지 판정한다.
5. 아래 상태로 재분류한다.

상태값:

- crop_quality_pass
- crop_quality_review
- crop_quality_fail_label_only
- crop_quality_fail_number_only
- crop_quality_fail_text_only
- crop_quality_fail_page_region
- crop_quality_fail_empty
- crop_quality_retry_needed
- crop_quality_pending

상태 설명:

crop_quality_pass:
실제 도형/그래프/표/그림이 잘 crop되어 있음.

crop_quality_review:
시각 요소는 있으나 경계가 애매하거나 텍스트가 조금 섞임.

crop_quality_fail_label_only:
단원명, 대표문제, 비법노트 등 라벨만 들어감.

crop_quality_fail_number_only:
문항 번호 또는 답 아이콘만 들어감.

crop_quality_fail_text_only:
텍스트 발문/풀이만 들어감.

crop_quality_fail_page_region:
문항 전체나 페이지 일부가 너무 넓게 들어감.

crop_quality_fail_empty:
거의 빈 이미지.

crop_quality_retry_needed:
시각 요소가 있어 보이지만 현재 crop은 실패했으므로 재crop 필요.

crop_quality_pending:
현재 실제 PNG가 없고 pending 목록에 있는 상태.

---

## 8. 잘못된 crop 처리 원칙

잘못된 crop으로 판정된 PNG는 아래처럼 처리한다.

1. generated/reports/crop_quality_review/bad_crop에 백업한다.
2. generated/assets/rpm_m2_1_2022에서는 제거한다.
3. 해당 문항은 generated/reports/crop_pending_assets.json에 다시 추가하거나 상태를 pending으로 갱신한다.
4. JS의 assets/image 경로는 다음 기준에 따라 처리한다.

JS assets/image 경로 처리 기준:

- 시각 요소가 확실히 있는 문항인데 crop만 실패한 경우:
  JS assets 경로는 유지한다.
  pending_assets에 기록한다.

- 실제로 시각 요소가 없는 것으로 판정된 문항:
  JS assets 경로를 제거한다.
  단, 이미지/표/도형 태그가 있으면 태그와 reports도 함께 검토해 “no_visual_asset_confirmed”로 기록한다.
  태그 자체는 이번 라운드에서 함부로 삭제하지 말고 reports에 보정 필요로 남긴다.

- 라벨/번호만 잘못 crop된 경우:
  JS assets 경로는 유지할지 제거할지 문항에 실제 시각 요소가 있는지 판단 후 결정한다.
  실제 시각 요소가 있다면 재crop 시도.
  실제 시각 요소가 없으면 JS 경로 제거 또는 pending 제거.

주의:
JS 경로를 제거하면 asset_file_existence_report와 js_asset_path_report를 반드시 갱신해야 한다.

---

## 9. 재crop 시도 기준

아래 경우는 재crop을 시도하라.

- 기존 crop이 번호/라벨만 잡았지만 같은 문항 영역 안에 도형/표/그래프가 있을 가능성이 있음
- crop_result_report에서 bbox가 너무 작거나 문항번호 근처에만 있음
- contact sheet에서 crop이 좁게 잘린 것으로 보임
- pending 문항 중 sourcePage가 확정되어 있고 시각 요소 관련 tag가 있음

재crop 방식:

1. 문제 PDF의 해당 sourcePage를 렌더링한다.
2. 해당 문항 번호 위치를 찾는다.
3. 다음 문항 번호 전까지 문항 영역을 잡는다.
4. 문항 영역 내부에서 시각 요소 후보를 다시 탐지한다.
5. 텍스트 줄만 있는 영역은 제외한다.
6. 도형/표/그래프 후보만 여백 8~24px 포함해 crop한다.
7. qNNN.png 또는 qNNN_2.png로 저장한다.
8. 재crop 결과를 crop_quality_review_report.json에 기록한다.

재crop이 불가능하면 pending으로 남겨라.
절대 빈 PNG나 가짜 PNG를 만들지 마라.

---

## 10. pending 150개 재검토

현재 pending assets 150개를 모두 재검토하라.

목표는 pending을 무조건 줄이는 것이 아니다.
목표는 pending의 이유를 명확히 하는 것이다.

pending 재분류 상태:

- pending_manual_crop_needed
- pending_no_visual_asset_confirmed
- pending_page_region_failed
- pending_tool_limit
- pending_low_confidence
- pending_should_retry_later

각 pending 항목에 다음을 기록하라.

- questionId
- sourceQuestionNo
- sourcePage
- expectedAssetPath
- previousReason
- newPendingStatus
- hasVisualTag
- hasJsAssetPath
- suggestedAction

저장 파일:

generated/reports/crop_pending_assets.json
generated/reports/crop_pending_assets_review.json

---

## 11. JS assets 경로 재검증

품질 보정 후 아래를 다시 검증하라.

1. JS에 assets/rpm_m2_1_2022/qNNN.png 경로가 있는 문항 목록
2. 실제 generated/assets/rpm_m2_1_2022/qNNN.png 파일 목록
3. pending assets 목록
4. bad_crop으로 이동된 목록
5. no_visual_asset_confirmed 목록

판정 기준:

- JS 경로 있음 + 실제 PNG 있음 = PASS
- JS 경로 있음 + 실제 PNG 없음 + pending 있음 = PENDING
- JS 경로 있음 + 실제 PNG 없음 + pending 없음 = FAIL
- 실제 PNG 있음 + JS 경로 없음 = FAIL
- no_visual_asset_confirmed인데 JS 경로 있음 = REVIEW 또는 FAIL
- bad_crop으로 이동했는데 JS 경로가 남고 pending 없음 = FAIL

갱신할 파일:

generated/reports/asset_file_existence_report.json
generated/reports/js_asset_path_report.json
generated/reports/asset_validation_report.json

---

## 12. contact sheet 재생성

Round 3-B 결과 기준으로 contact sheet를 다시 생성하라.

생성 위치:

generated/reports/crop_quality_review/contact_sheets

필수 contact sheet:

1. crop_quality_pass만 모은 sheet
2. crop_quality_review만 모은 sheet
3. crop_quality_fail/bad_crop만 모은 sheet
4. retry_needed만 모은 sheet
5. pending 대표 목록 sheet 또는 index

각 썸네일에는 최소 아래 텍스트가 보여야 한다.

- q번호
- status
- 파일명

contact sheet 생성이 어렵다면 crop_quality_contact_sheet_index.json에 대신 목록을 남기고 CODEX_RESULT.md에 사유를 적어라.

---

## 13. 생성/갱신해야 할 reports

이번 Round 3-B에서 반드시 생성 또는 갱신할 파일:

- generated/reports/crop_quality_review_report.json
- generated/reports/crop_quality_summary.json
- generated/reports/crop_pending_assets_review.json
- generated/reports/crop_pending_assets.json
- generated/reports/crop_result_report.json
- generated/reports/asset_file_existence_report.json
- generated/reports/js_asset_path_report.json
- generated/reports/asset_validation_report.json
- generated/reports/crop_quality_contact_sheet_index.json
- generated/reports/crop_quality_review/contact_sheets/*.png
- generated/reports/crop_quality_review/bad_crop/*
- CODEX_RESULT.md

가능하면 tools/crop-rpm-assets.mjs를 보정하거나, 별도 파일을 만든다.

허용 파일:

tools/review-rpm-crop-quality.mjs
tools/validate-rpm-assets.mjs

---

## 14. 보조 검증 스크립트

아래 스크립트를 작성하거나 갱신하라.

tools/review-rpm-crop-quality.mjs

역할:

- 실제 PNG 목록 스캔
- crop_result_report 대조
- 이미지 크기/빈 이미지/라벨성 crop 후보 탐지
- manual suspicious list 반영
- bad_crop quarantine 처리
- pending 갱신
- contact sheet 생성
- crop_quality reports 생성

아래 스크립트도 갱신 가능하다.

tools/validate-rpm-assets.mjs

검증 항목:

- JS assets path 수
- 실제 PNG 수
- pending 수
- bad crop 수
- no visual confirmed 수
- missing actual without pending 수
- actual without JS reference 수
- visual-tagged without assets path 수
- node --check 결과

---

## 15. 실행 명령

작업 대상 루트에서 실행한다.

cd /mnt/c/Users/USER/Desktop/AP------/archive/textbook

예상 실행:

node tools/review-rpm-crop-quality.mjs
node tools/validate-rpm-assets.mjs

node --check generated/js/rpm_m2_1_2022_u01.js
node --check generated/js/rpm_m2_1_2022_u02.js
node --check generated/js/rpm_m2_1_2022_u03.js
node --check generated/js/rpm_m2_1_2022_u04.js
node --check generated/js/rpm_m2_1_2022_u05.js
node --check generated/js/rpm_m2_1_2022_u06.js
node --check generated/js/rpm_m2_1_2022_u07.js
node --check generated/js/rpm_m2_1_2022_u08.js
node --check generated/js/rpm_m2_1_2022_u09.js
node --check generated/js/rpm_m2_1_2022_u10.js

---

## 16. CODEX_RESULT.md 추가 보고 형식

작업 완료 후 archive/textbook/CODEX_RESULT.md에 아래 섹션을 추가하라.

## Round 3-B crop quality review

- 작업 범위:
- 기존 실제 PNG 수:
- 품질 검수 대상 PNG 수:
- crop_quality_pass 수:
- crop_quality_review 수:
- crop_quality_fail 수:
- bad_crop 이동 수:
- 재crop 시도 수:
- 재crop 성공 수:
- pending 기존 수:
- pending 갱신 후 수:
- no_visual_asset_confirmed 수:
- JS assets 경로 제거/보정 수:
- contact sheet 재생성 여부:
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

## 17. 완료 판정

PASS:
- 명백한 bad crop이 quarantine 처리됨
- JS 경로/실제 PNG/pending/no_visual_confirmed 목록이 일관됨
- node --check PASS
- validate-rpm-assets PASS
- missingQuestionNumbers 0
- answer/content/tags unchanged true
- contact sheet 재생성됨

PARTIAL:
- 일부 crop 품질만 자동 판정 가능
- 나머지는 review/pending에 정확히 남김
- JS 경로/PNG/pending 불일치 없음
- node --check PASS

FAIL:
- 문항 id 변경
- 문항 누락 발생
- answer 변경
- content 변경
- tags 변경
- JS 문법 오류
- bad crop 제거 후 pending 기록 누락
- 실제 PNG 없음인데 pending 없음
- 실제 PNG 있음인데 JS 참조 없음
- 기존 운영 archive 파일 수정
- git add/commit/push 실행

---

## 18. 마지막 실행 지시

이 파일을 처음부터 끝까지 다시 읽고 그대로 실행하라.
작업 범위를 줄이지 마라.
정답/발문/태그를 다시 건드리지 말고 crop 품질 보정만 수행하라.
문항 전체 crop이나 페이지 전체 crop을 최종 assets로 만들지 마라.
가짜 PNG를 만들지 마라.
잘못된 crop은 삭제 전 bad_crop에 반드시 보존하라.
기존 운영 archive 파일은 수정하지 마라.
git add/commit/push는 하지 마라.
'@ | Set-Content -Path .\CODEX_TASK_03B_ASSET_CROP_QUALITY.md -Encoding UTF8

Get-Content .\CODEX_TASK_03B_ASSET_CROP_QUALITY.md -Raw