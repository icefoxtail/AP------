# CODEX_RESULT

## Round: Visang Common Math 2 Textbook Packs

- 작업 범위: 비상교육 공통수학2 교과서 PDF에서 중단원학습점검/대단원학습평가/익힘책 문항 full crop 및 발문 입력용 단원별 fresh pack 생성
- 입력 PDF: `archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서.pdf`
- 작업 폴더: `archive/textbook/_비상교육_ 고등_공통수학2(김원경)_교과서`
- 처리 방식: 텍스트 레이어 없음, 렌더링 이미지의 문항번호 marker 기반 visual-coordinate crop
- 생성 setKey 수: 9
- 생성 question full crop 수: 135
- crop 실패 수: 0
- JS 정규화 결과: tags 빈 배열 0, standardUnitKey unmapped 0, schema violation 0
- node --check 결과: PASS (9 files)
- 생성 fresh zip:
  - `generated/review_pack/by_unit_fresh/비상_공통수학2_도형의방정식_고1_fresh.zip` (crop 47개)
  - `generated/review_pack/by_unit_fresh/비상_공통수학2_집합과명제_고1_fresh.zip` (crop 45개)
  - `generated/review_pack/by_unit_fresh/비상_공통수학2_함수와그래프_고1_fresh.zip` (crop 43개)
- zip 내부 구조: `question_crop_images/`에 문항 full crop PNG가 각각 개별 파일로 포함됨
- 생성 report:
  - `generated/reports/visang2_question_crop_map.json`
  - `generated/reports/visang2_section_detection_report.json`
  - `generated/reports/visang2_crop_failed.json`
  - `generated/reports/visang2_fresh_unit_pack_report.json`
  - `generated/reports/standard_unit_mapping_validation.json`
  - `generated/reports/js_archive_schema_violation_report.json`
- archive/text1 수정 여부: false
- archive/textbook 밖 운영 archive 수정 여부: false
- git add/commit/push 여부: false
- 최종 판정: PASS

## Round: crop quality review

- crop quality review 실행 여부: true
- 대상 crop 수: 135
- pass 수: 127
- warning 수: 8
- recrop_candidate 수: 0
- recrop_applied 수: 0
- page_fallback 수: 0
- manual_review 수: 0
- corrupted_asset 수: 0
- contact sheet 수: 9
- question_crop_quality_report: `generated/reports/question_crop_quality_report.json`
- question_crop_manual_review_required: `generated/reports/question_crop_manual_review_required.json`
- validation 판정: pass

## Round: crop quality review

- crop quality review 실행 여부: true
- 대상 crop 수: 135
- pass 수: 127
- warning 수: 8
- recrop_candidate 수: 0
- recrop_applied 수: 0
- page_fallback 수: 0
- manual_review 수: 0
- corrupted_asset 수: 0
- contact sheet 수: 9
- question_crop_quality_report: `generated/reports/question_crop_quality_report.json`
- question_crop_manual_review_required: `generated/reports/question_crop_manual_review_required.json`
- validation 판정: pass
