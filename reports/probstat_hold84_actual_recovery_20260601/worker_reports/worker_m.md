# Worker M Report

## Target
- archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/20_매산고_2학기_기말_고2_확률과통계/candidate/20_매산고_2학기_기말_고2_확률과통계.candidate.js

## Completed
- 1~14번 fullpage 이미지 확인 기준으로 객관식 5지선다 `choices` 복구.
- 1~14번 `content`를 fullpage 원문 기준으로 정리.
- 1~14번 `answer`를 정답표 및 직접 풀이 기준으로 확정.
- 불확실 표기였던 3번 `?, ?`는 `ㄱ, ㄴ`으로 확정.
- 불확실 표기였던 14번 `5?`는 `5π`로 확정.

## Remaining Hold
- 1~14번 남은 보류 없음.
- 해당 exam 폴더의 `question_crop_map.json`은 비어 있어 crop 이미지는 없었고, fullpage 이미지와 정답표/직접풀이로 확인함.

## Verification
- `node --check archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/20_매산고_2학기_기말_고2_확률과통계/candidate/20_매산고_2학기_기말_고2_확률과통계.candidate.js` 통과.
- readback 확인: 1~14번 모두 `choices.length === 5`, answer 불확실 표기 없음.

## Scope
- 수정 필드: `content`, `choices`, `answer`.
- `solution`, `tags`, 분류 필드, db/live/git, aggregate rebuild는 수정/실행하지 않음.
