# CODEX_RESULT

## Round: MiraeN unit input packs

- 작업 범위: 미래앤 공통수학1 PDF에서 중단원마무리/대단원평가 문항 full crop 및 발문 입력용 단원별 fresh pack 생성
- 작업 폴더: `archive/textbook/_미래앤_고등_공통수학1_교과서`
- 입력 PDF: `archive/textbook/_미래앤_고등_공통수학1_교과서.pdf`
- 익힘책: 현재 PDF에서 별도 익힘책 영역 미탐지
- 생성 setKey 수: 8
- 생성 question full crop 수: 137
- crop 실패 수: 0
- 생성 JS skeleton 수: 8
- 생성 report:
  - `generated/reports/miraen_question_crop_map.json`
  - `generated/reports/miraen_section_detection_report.json`
  - `generated/reports/miraen_crop_failed.json`
  - `generated/reports/miraen_fresh_unit_pack_report.json`
- 생성 fresh zip:
- `generated/review_pack/by_unit_fresh/미래앤_공통수학1_다항식_고1_fresh.zip` (crop 39개)
- `generated/review_pack/by_unit_fresh/미래앤_공통수학1_방정식과부등식_고1_fresh.zip` (crop 54개)
- `generated/review_pack/by_unit_fresh/미래앤_공통수학1_경우의수_고1_fresh.zip` (crop 23개)
- `generated/review_pack/by_unit_fresh/미래앤_공통수학1_행렬_고1_fresh.zip` (crop 21개)
- zip 내부 구조: `question_crop_images/`에 원본 문항 full crop PNG가 각각 개별 파일로 포함됨
- archive/text1 수정 여부: false
- archive/textbook 밖 운영 archive 수정 여부: false
- git add/commit/push 여부: false
- 최종 판정: PASS

## Round: crop quality review

- crop quality review 실행 여부: true
- 대상 crop 수: 137
- pass 수: 106
- warning 수: 31
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
- 대상 crop 수: 137
- pass 수: 106
- warning 수: 31
- recrop_candidate 수: 0
- recrop_applied 수: 0
- page_fallback 수: 0
- manual_review 수: 0
- corrupted_asset 수: 0
- contact sheet 수: 9
- question_crop_quality_report: `generated/reports/question_crop_quality_report.json`
- question_crop_manual_review_required: `generated/reports/question_crop_manual_review_required.json`
- validation 판정: pass
