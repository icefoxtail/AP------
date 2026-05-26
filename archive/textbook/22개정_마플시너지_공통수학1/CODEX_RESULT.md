# CODEX_RESULT

## Round: new4 fresh unit input packs

- 입력 PDF: 22개정_마플시너지_공통수학1.pdf
- 생성 폴더: C:\Users\USER\Desktop\AP------\archive\textbook\22개정_마플시너지_공통수학1
- section/setKey 수: 5
- question full crop 수: 1320
- 실패 page/section 항목 수: 55
- fresh zip 수: 5
- 표준단원 unresolved set 수: 3
- git add/commit/push: 하지 않음

## Round: crop quality review

- crop quality review 실행 여부: true
- 대상 crop 수: 1320
- pass 수: 1195
- warning 수: 116
- recrop_candidate 수: 0
- recrop_applied 수: 0
- page_fallback 수: 0
- manual_review 수: 9
- corrupted_asset 수: 0
- contact sheet 수: 46
- question_crop_quality_report: `generated/reports/question_crop_quality_report.json`
- question_crop_manual_review_required: `generated/reports/question_crop_manual_review_required.json`
- validation 판정: pass

## 2026-05-24 마플시너지 공통수학1 content/choices 입력

- 범위: `archive/textbook/22개정_마플시너지_공통수학1` 단일 교재만 작업
- 운영 JS 기준 total questions: 1320
- empty content: 1254 -> 7
- 새로 채운 content: 1247
- choices 포함 문항 수: 46 -> 46 (확실히 분리 가능한 신규 선택지는 없음)
- missing answer: 1320 (answer source 미확보로 추측 입력하지 않음)
- content 내 image/img/path 삽입: 0
- solution nonempty: 0 (solution 미수정)
- 남은 manual_review empty: 7 (`generated/reports/manual_review_remaining_empty.json`)
- 변경 JS 파일:
  - `generated\js\workbook\마플_마플시너지 공통수학1_경우의 수_문제집대단원_고1.js`
  - `generated\js\workbook\마플_마플시너지 공통수학1_다항식_문제집대단원_고1.js`
  - `generated\js\workbook\마플_마플시너지 공통수학1_모의평가_모의평가_고1.js`
  - `generated\js\workbook\마플_마플시너지 공통수학1_방정식과 부등식_문제집대단원_고1.js`
  - `generated\js\workbook\마플_마플시너지 공통수학1_행렬_문제집대단원_고1.js`
- 생성/갱신 report:
  - `generated/reports/maple_common1_ocr_content_fill_report.json`
  - `generated/reports/manual_review_remaining_empty.json`
  - `generated/reports/pipeline_book_summary.json`
- 검증: node --check PASS, questionBank parse PASS
- git add/commit/push 실행하지 않음
