# lane40 제4회차 — 고2 확통 2학기 중간 원본 잔여 6개 완료 보고

- 기준 일자: **2026-11-22 KST**, 독립 MD 브랜치: work/solution-upgrade-lane-40-probstat-2sem-20261122.
- 범위: 전 회차 누적 15개 시험지(331문항)에 이은 2020 매산고·매산여고·제일고 및 2019 매산여고·복성고·제일고 원본 6개.
- **6/6 시험지, 132/132 실제 원문·정답·선택지·기존 풀이 전수 검토; KEEP 127, UPGRADE 5, UNREAD 0.**
- 원본문제 PNG **고유 5개 파일/문항 참조 6회** 모두 다운로드·실물 판독. 2019 복성고 Q04/Q05는 동일 도로망을 재사용.
- 6개 MD 별도 커밋 후 GitHub 원격 readback 전문 비교; 132개 Q섹션 전부 검증.

| # | 원본 시험지 | 문항 | KEEP | UPGRADE | 원본 PNG | 감사 MD | commit SHA | blob SHA |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | 20_매산고_2학기_중간_고2_확률과통계 | 19 | 19 | 0 | 0 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2020_maesan_2mid_DEEP_AUDIT.md) | 186e9cad4d7d | 33f359e668e7 |
| 2 | 20_매산여고_2학기_중간_고2_확률과통계 | 23 | 23 | 0 | 0 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2020_maesanyeo_2mid_DEEP_AUDIT.md) | 1ca89f603182 | e96af1bd2038 |
| 3 | 20_제일고_2학기_중간_고2_확률과통계 | 22 | 22 | 0 | 0 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2020_jeil_2mid_DEEP_AUDIT.md) | cea9e6ed4d30 | a5062e7043e5 |
| 4 | 19_매산여고_2학기_중간_고2_확률과통계 | 22 | 19 | 3 | 1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_maesanyeo_2mid_DEEP_AUDIT.md) | 7d50db986c2c | a7fd354f646d |
| 5 | 19_복성고_2학기_중간_고2_확률과통계 | 24 | 23 | 1 | 4 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_boksung_2mid_DEEP_AUDIT.md) | 00647dda2746 | 121cfe6fdca3 |
| 6 | 19_제일고_2학기_중간_고2_확률과통계 | 22 | 21 | 1 | 0 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_jeil_2mid_DEEP_AUDIT.md) | 62295b79bc59 | 71592e5d71bb |

## 오류 및 원본 보존 게이트

1. **2019 매산여고 Q12 — UPGRADE:** 표준정규분포표 $z=2.0$행의 **0.4872**는 표준정규 중앙면적 **0.4772**와 다르다. 정답 계산은 $z=1.5$행 0.4332만 사용하므로 현행 정답 **0.9332**는 유지. 학생 노출 전 표 정정 게이트를 MD에 기록.
2. **2019 매산여고 Q14 — UPGRADE:** 동일 표의 $z=2.0$행 0.4872 오기, 오기값이 오답 선택지에도 등장한다. 풀이에 사용되는 $z=1.0,0.5$ 값은 정상이라 정규근사 정답 **0.5328** 유지. 원본 표 정정 게이트 기록.
3. **2019 매산여고 Q15 — UPGRADE:** 제공 표 $z=2.0$행 **0.4332**는 실제 $z=1.5$ 중앙면적이고, $z=2.0$은 약 **0.4772**다. 계산에 쓰는 $z=1.0$은 정상이라 정답 **0.8413** 유지. 표 정정 게이트 기록.
4. **2019 복성고 Q06 — UPGRADE / SOURCE_FIDELITY_HOLD:** 현재 JS의 선택지 ① **1455**와 독립 전수계산은 일치한다. 그러나 현재 기존 solution은 원본 인쇄본의 ①이 '32'였고 1455로 바로잡았다고 기술한다. 주장된 PDF와 JS의 차이 및 정정 이력은 PDF 직접 대조가 없어 **미확정**. 완성 풀이와 출처 확인 조건을 MD에 기록.
5. **2019 제일고 Q18 — UPGRADE / SOURCE_FIDELITY_HOLD:** 현행 JS 보기 ⑤는 구간 $[0,1]$ 바깥에서 $f=0$을 명시하므로 ③·⑤가 맞다. 다만 JS의 sourceRepairNote는 원본 PDF에서 그 조건이 누락되어 보강했다는 차이를 기술한다. 실제 PDF와 변경 승인 기록은 미검증으로 출처 확인 게이트를 남김. 현행 답의 수학적 오류는 아님.

## 실물 그림·독립 수학 검산

- **2019 복성 Q04/Q05:** 실물 계단형 도로망에서 최단경로 **42개**, 동일 속도·동시 출발 시 중간 교점 $(2,2)$ 또는 $(3,1)$에서 만날 확률 **25/49**로 $m+n=74$를 재계산했다.
- **2019 복성 Q07:** 원과 두 정사각형의 아홉 영역을 9색 배치 후 회전동치 4로 나누어 $9!/4$를 확인했다.
- **2019 매산여 Q03:** 실물 밑변8·꼭짓점 $x=3$인 삼각밀도에서 $P(1\le X\le3)=1/3$을 확인했다.
- **2019 복성 Q24:** 원본 수직선에서 P는 원점 왼쪽 두 칸이며, 게임 6번 후 좌측2 이동 조건의 세 경우 $(w,l,t)=(0,2,4),(1,3,2),(2,4,0)$를 서술형 지시에 맞춰 통분하지 않은 합으로 검산했다.
- **2019 복성 Q06:** $1\le x,y,z\le50$ 전수열거 **1455**. $z=2$ 표준정규 중앙면적도 독립 계산 약 **0.477249868**로 세 표 오기를 확인했다.

## 누적 진행·남은 게이트·다음 cursor

- **2학기 중간 확통 원본 21/21장 감사 완료**. 앞선 세 회차 15장/331문항 + 이번 6장/132문항 = 누적 **21장/463문항**. 해당 경로의 확통 원본 잔여 0.
- 이번 차수 UPGRADE 5개는 **DRAFT_STAGED / SOURCE_TABLE_OR_PROVENANCE_HOLD_OPEN**. 기존 해설 SVG 렌더, Golden/Negative, 학생 화면 검증, 개정과정 교차확인과 최종 출고 QA는 **NOT_RUN**이다. 본 MD는 운영 PASS가 아니다.
- 원본 JS·answer·choices·이미지·SVG·main 변경 없음. 공유 claim 갱신 없음. GitHub 원격 readback **6/6 전문 일치**.
- 다음 전담 범위는 고2 확통 **2학기 기말 원본** archive/exams/original/high/h2/2final/. 이 경로의 확통 JS 원본 **22개**를 확인했으며, 다음 첫 cursor는 **25_강남여고_2학기_기말_고2_확률과통계.js**. 이후 최신 연도부터 과거 연도 순서. 유사·유형·교과서 단계는 별도 전환 전 진행하지 않는다.
