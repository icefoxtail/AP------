# lane40 실행 보고 — 고2 확률과 통계 2학기 중간·기말 5개 시험지

- 실행일: **2026-11-22 (KST)**
- 이번 회차 우선순위: 최신 연도부터 **2학기 중간고사 원본 5종**. 기말은 다음 회차 후보로 남김.
- 작업 브랜치: work/solution-upgrade-lane-40-probstat-2sem-20261122
- 완료 범위: **5/5개 시험지, 112/112문항 원문과 기존 풀이 심층 판정**, 원본 문제 그림 24개 실제 열람.
- 작업 상태: **EXAM_AUDIT_COMPLETE ×5 / DRAFT_STAGED ×1 / NOT_RELEASED**. 원본 JS·정답·보기·SVG·학생 서비스 미변경.

| 순서 | 학교·시험지 | 총 문항 | KEEP | UPGRADE | HOLD | UNREAD | GitHub 결과 | 커밋 | readback blob SHA |
|---:|---|---:|---:|---:|---:|---:|---|---|---|
| 1 | 26_순천고_2학기_중간_고2_확률과통계 | 24 | 24 | 0 | 0 | 0 | [심층 감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2026_suncheon_2mid_DEEP_AUDIT.md) | 7cca1365783a | 0e8789b39c44 |
| 2 | 26_제일고_2학기_중간_고2_확률과통계 | 21 | 21 | 0 | 0 | 0 | [심층 감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2026_jeil_2mid_DEEP_AUDIT.md) | ce9760bd93da | 1a859f09ca9f |
| 3 | 25_금당고_2학기_중간_고2_확률과통계 | 20 | 20 | 0 | 0 | 0 | [심층 감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_geumdang_2mid_DEEP_AUDIT.md) | c2ae8ba8433a | f83bbf66f560 |
| 4 | 25_순천고_2학기_중간_고2_확률과통계 | 24 | 24 | 0 | 0 | 0 | [심층 감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_suncheon_2mid_DEEP_AUDIT.md) | ad1b86dd3043 | 9cc236b3b742 |
| 5 | 25_제일고_2학기_중간_고2_확률과통계 | 23 | 22 | 1 | 0 | 0 | [심층 감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_jeil_2mid_DEEP_AUDIT.md) | 2f0ce9dfb52a | 1b634f4d91b0 |

## 실제 발견 사항과 검산

1. **2025 제일고 Q18**: 정규근사에 따른 출제 의도 답은 ④, a≈96. 그러나 정확한 B(150,0.6) 누적확률은 P(X≤95)≈0.820091006, P(X≤96)≈0.860919589라 원문 등식 P(X≤a)=0.8413이 정확하지 않다. 해당 시험지 MD에 *전체 수정 학생용 solution*과 SOURCE_WORDING_HOLD를 남김. 원본 문항 교정 승인 전 출고 금지.
2. **2026 제일고 Q12**: 정사각형 둘레 8점에서 삼각형 56−4=52개, 면적2인 경우8개, 면적0<넓이<2인 경우44개를 조합 전수계산으로 검산. 11/13 유지.
3. **2025 금당고 Q15**: 서로소 마주보는 쌍의 완전매칭 18개를 독립 열거하여 18×48=864 유지.
4. **2025 순천고 Q24**: 5! 순열의 최초 5배수 부분합 도달시점 빈도 (24,24,8,16,48), 분산 118/45를 완전열거하여 확인.
5. 그림 포함 모든 원문 문제 PNG 24개를 실제 판독했고, 좌표·격자 크기·자료표 수치를 각 문항에 연결. 기존 학생용 solution SVG *렌더*는 실행하지 않았으므로 PASS라 표시하지 않음.

## 후속 작업 게이트

- 각 문항의 출고 전 **Golden/Negative, 수학·문구 QA, 기존 SVG 렌더·학생 화면** 확인은 모두 NOT_RUN.
- 공유 claim/운영 보드 수정 및 main 병합: **NOT_DONE** (전용 브랜치 문서만 커밋).
- 후속 시작 cursor: next_exam=2학기 중간 남은 최신연도 원본 후보; next_qid=해당 시험지 Q01. 이번 다섯 시험지의 UNREAD=0.
- 다섯 문서의 원격 파일 본문은 모두 fetch_file readback으로 로컬 작성 내용과 **문자열 완전일치** 확인. 위 표의 커밋과 blob SHA가 근거.
