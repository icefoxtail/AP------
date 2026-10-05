# CODEX_TASK_TEXT1_JS_FROM_CROPS.md

## 작업 요약

`archive/text1`에서 생성된 `generated/reports/text1_question_crop_map.json`과 문항 full crop을 기준으로 setKey별 JS 초안을 생성한다.

핵심 원칙:

- PDF 전체 plain text 흐름으로 문항을 다시 자르지 않는다.
- crop map의 bbox 내부 텍스트만 발문/choices 추출 근거로 사용한다.
- setKey별 JS 파일을 `generated/js/textbook` 또는 `generated/js/workbook`에 분리 저장한다.
- 정답 PDF는 사용하지 않는다.
- `answer`와 `solution`은 빈 값으로 둔다.
- 최종 assets crop은 하지 않는다.
- crop 파일 삭제/이동/이름 변경 및 `q001_full` alias 생성은 하지 않는다.
- 불확실한 문항은 manual review report에 남긴다.

실행 명령:

```powershell
cd C:\Users\USER\Desktop\AP------\archive\text1
node tools/generate-js-from-crops.mjs
```
