# lane40 제2회차 확통 2학기 중간 — 다음 5개 시험지 실행 보고

- 일자: **2026-11-22 KST**, 단독 MD 브랜치: work/solution-upgrade-lane-40-probstat-2sem-20261122.
- 범위: 직전 회차 2026/2025년 원본 5장에 이은 다음 원본 5장 — 2024년 매산여고, 2023년 강남여고·금당고·매산여고·복성고.
- **5/5 시험지, 실제 문제·정답·기존 풀이 전수 읽기 108/108 문항, KEEP 106, UPGRADE 2, HOLD 0, UNREAD 0**.
- 원본 문제 그림 16개 전부 직접 PNG로 판독; 기존 해설 SVG의 별도 렌더와 학생 서비스 QA는 **NOT_RUN**.
- 각 MD의 본문은 실제 원격 readback으로 작성 문자열과 정확히 일치 확인. 아래의 커밋 SHA 및 blob SHA 증거.

| # | 원본 시험지 | 문항 | KEEP | UPGRADE | 문제 그림 | 커밋된 MD | commit SHA | blob SHA |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | 24_매산여고_2학기_중간_고2_확률과통계 | 23 | 23 | 0 | 2 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2024_maesanyeo_2mid_DEEP_AUDIT.md) | ccda20286089 | f711bd897497 |
| 2 | 23_강남여고_2학기_중간_고2_확률과통계 | 25 | 25 | 0 | 1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_gangnamyeo_2mid_DEEP_AUDIT.md) | beafecdb9d03 | dd4f5ec606da |
| 3 | 23_금당고_2학기_중간_고2_확률과통계 | 18 | 18 | 0 | 3 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_geumdang_2mid_DEEP_AUDIT.md) | 7a5e5eb5818c | d3a222f90859 |
| 4 | 23_매산여고_2학기_중간_고2_확률과통계 | 22 | 22 | 0 | 1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_maesanyeo_2mid_DEEP_AUDIT.md) | aa945efbac8a | d09376b73438 |
| 5 | 23_복성고_2학기_중간_고2_확률과통계 | 20 | 18 | 2 | 9 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_boksung_2mid_DEEP_AUDIT.md) | bb7c87749e3d | 3673a5dd5bdf |

## 실제 수학 검산과 개선 발견

1. **2023 복성고 Q19 — UPGRADE:** 문제는 표준정규분포표·곡선을 써서 이항확률합을 구하는 서술형. 정규근사 값은 0.8664이나 이항분포의 직접 계산 정확값은 약 **0.8875113898**. 기존 풀이의 근사 표시와 실제 곡선이 빠진 부분을 보강한 *완성 수정 학생용 풀이*를 MD에 작성. 별도 정규곡선 중앙 음영 SVG_REQUEST 및 원문 표현 QA 게이트를 명시.
2. **2023 복성고 Q20 — UPGRADE:** 상위 2% → 약20등 및 상위20% → 약78.4점의 두 계산을 각각 정규분포로 풀고, 원문에서 명시적으로 요청한 **서로 다른 종형곡선 2개**(z=2 오른쪽 0.02 음영, z=0.84 오른쪽 0.20 음영)의 제작 명세를 남김. 원본 source에 solutionImage 없음. 실제 SVG 렌더는 미실행.
3. **2023 금당고 Q18:** 단조 함수·홀짝 조건 만족 함수 **105개**를 10^4가지 함수 직접 전수열거로 검산.
4. **2024 매산여고 Q18/Q19/Q23:** 이차식 판별식에 맞는 주사위쌍12개, 100의 배수 곱인 짝수쌍31개 중 합60 이상23개, 주사위 2회 반복 이동의 E(X²)=520을 독립 계산으로 확인.

## 남은 게이트와 다음 작업 위치

- 모든 문항의 EXAM_AUDIT_COMPLETE; 학생용 수정문장 2개는 DRAFT_STAGED. **원본 SVG 생성/Golden·Negative·학생 화면 렌더/수학 최종 출고 QA는 NOT_RUN.** 원본 JS, choices, answer, image 및 운영 main 변경 없음.
- 유사 문제/유형 문제/교과서 문제로 건너뛰지 않음. 다음 후보는 **2023 순천고 2학기 중간**부터 연도 최신순을 계속 진행하며, 2학기 중간 원본을 마친 뒤 2학기 기말 원본으로 이동.
- 공유 claim 갱신은 이 사용자 지정 독립 라인의 필수조건이 아니며 실행하지 않음.
