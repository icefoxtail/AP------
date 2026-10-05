# CODEX_TASK_TEXT1_CROP_TARGET_SECTIONS_ONLY.md

## 작업 요약

`archive/text1`의 현재 교과서 PDF를 대상으로 아래 3종 섹션만 page crop 및 question full crop으로 정리한다.

대상 섹션:

1. 중단원 학습 점검
2. 대단원 학습 평가
3. 익힘책

JS 생성, 발문 추출, 정답 추출, 최종 assets crop은 하지 않는다.

## 핵심 규칙

- 모든 산출물은 `archive/text1/generated` 아래에만 생성한다.
- `archive/textbook`은 수정하지 않는다.
- 기존 `test_pages` 파일은 삭제하지 않는다.
- 정답 PDF는 사용하지 않는다.
- git add/commit/push는 하지 않는다.
- 문항 full crop은 `{setKey}_page{pageNo}_q{displayNo}_full.png` 형식으로만 저장한다.
- `q001_full.png` 같은 final alias는 만들지 않는다.

## 필수 reports

- `generated/reports/text1_section_crop_detection_report.json`
- `generated/reports/text1_question_crop_map.json`
- `generated/reports/text1_section_crop_result_report.json`
- `generated/reports/text1_section_crop_failed.json`
- `generated/reports/text1_section_crop_summary.json`
- `generated/reports/text1_section_crop_contact_sheet_index.json`
- `generated/reports/text1_crop_tool_availability.json`

## 실행 명령

```powershell
cd C:\Users\USER\Desktop\AP------\archive\text1
node tools/crop-target-sections-only.mjs
```
