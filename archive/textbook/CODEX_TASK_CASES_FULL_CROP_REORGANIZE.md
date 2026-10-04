# CODEX_TASK_CASES_FULL_CROP_REORGANIZE.md

## 작업 요약

집 작업 폴더 `archive/text1`에서 비상 공통수학1 “경우의 수” 단원 문항 전체 crop을 setKey 기준으로 다시 정리한다.

이번 작업은 JS 생성, 발문 추출, 정답 추출, 최종 이미지 assets crop이 아니다.
이번 작업은 “경우의 수” 단원의 문항 전체 crop을 단원/섹션별로 안전하게 분리 저장하는 작업이다.

## 핵심 지시

- 모든 산출물은 `archive/text1` 아래에만 생성한다.
- `archive/textbook`은 수정하지 않는다.
- 기존 `generated/work/question_crops/test_pages` 및 `generated/reports/test_page_full_crop_*.json`은 삭제하지 않는다.
- 정답 PDF는 사용하지 않는다.
- git add/commit/push는 하지 않는다.
- crop 단위는 최상위 문항번호 1개다.
- (1)(2), 선택지, 보기, 표, 도형, 그래프는 같은 문항 내부 요소로 보고 분리하지 않는다.

## setKey

1. `비상_공통수학1_경우의수_중단원학습점검_고1`
2. `비상_공통수학1_경우의수_대단원학습평가_고1`
3. `비상_공통수학1_경우의수_익힘책_고1`

## 실행 명령

```powershell
cd C:\Users\USER\Desktop\AP------\archive\text1
node tools/reorganize-cases-full-crop.mjs
```

## 필수 reports

- `generated/reports/cases_crop_tool_availability.json`
- `generated/reports/section_set_detection_cases_report.json`
- `generated/reports/question_crop_id_map_cases.json`
- `generated/reports/cases_full_crop_result_report.json`
- `generated/reports/cases_full_crop_failed.json`
- `generated/reports/cases_full_crop_summary.json`
- `generated/reports/cases_full_crop_contact_sheet_index.json`
