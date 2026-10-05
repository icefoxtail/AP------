# CODEX_TASK_TEXT1_ANSWER_ONLY_FROM_ANSWER_TABLE_CROPS.md

## 작업 요약

`archive/text1`의 비상 공통수학1 crop 기반 JS 초안에 대해 정답표/정답 및 해설 영역에서 중단원학습점검, 대단원학습평가, 익힘책 문항의 정답만 추출해 `answer` 필드에 입력한다.

핵심:

- `answer` 필드만 수정한다.
- `solution`은 계속 빈 문자열로 둔다.
- 해설 작성과 정답 추측은 하지 않는다.
- `content`, `choices`, `id`, `image`, `tags`, `standardUnit*` 계열은 수정하지 않는다.
- 정답표/정답 영역 crop과 reports는 `archive/text1/generated` 아래에만 생성한다.
- `archive/textbook`, 운영 archive, git add/commit/push는 건드리지 않는다.

실행 명령:

```powershell
cd C:\Users\USER\Desktop\AP------\archive\text1
node tools/apply-answer-only-from-answer-table-crops.mjs
```
