# worker_l report

- 담당 파일: `archive/_generated/past-exams/high_h2_probability_statistics_all_terms/1mid/25_매산여고_1학기_중간_고2_확률과통계/candidate/25_매산여고_1학기_중간_고2_확률과통계.candidate.js`
- 수정 범위: 1~20번 `choices`, `answer`만 수정. 21~24번, `solution`, `tags`, 분류 필드, db/live/git 미수정.

## 완료

- 1~20번 객관식 `choices`를 모두 5개 항목으로 저장.
- 1~20번 `answer`를 해설 이미지의 문항별 표시 정답 번호와 대조해 유지/확정.
- 확인한 정답값: 1=6, 2=35, 3=240, 4=0, 5=12, 6=56, 7=9, 8=15, 9=10, 10=4*7!, 11=466, 12=30, 13=455, 14=170, 15=10, 16=200, 17=432, 18=180, 19=61, 20=5.

## 보류/주의

- 로컬 원본 PDF, generated `pages`, `crops/questions`, OCR 보고를 확인했으나 2025_매여고2_확통_1중간.pdf 자체가 필기 해설지 형태라서 각 문항의 정답 번호와 정답값만 보이고, 인쇄 시험지의 오답 보기 4개 원문은 포함되어 있지 않았다.
- 따라서 오답 보기는 해설상 정답값/정답 위치와 직접풀이에 맞춰 5지 배열로 복구했으며, 오답 보기의 인쇄 원문 일치 여부는 추가 원문 시험지 없이는 재검증이 필요하다.

## 검증

- `node --check archive/_generated/past-exams/high_h2_probability_statistics_all_terms/1mid/25_매산여고_1학기_중간_고2_확률과통계/candidate/25_매산여고_1학기_중간_고2_확률과통계.candidate.js`
- 결과: 통과(exit 0).
