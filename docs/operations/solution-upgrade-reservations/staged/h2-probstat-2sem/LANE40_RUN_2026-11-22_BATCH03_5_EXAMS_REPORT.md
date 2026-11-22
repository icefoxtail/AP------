# lane40 제3회차 고2 확통 2학기 중간 — 5개 시험지 실행 보고

- 일자: **2026-11-22 KST**; 독립 감사 MD 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 범위: 직전 10개 다음의 원본 5장 — 2023 순천고·제일고, 2022 복성고·순천고·효천고.
- **5/5 시험지, 111/111 실제 원문·정답·선택지·기존 풀이 전수 판독; KEEP 108, UPGRADE 3, UNREAD 0.**
- 원본 PNG **10/10장** 직접 실물로 확인(문제 본문 HTML 내 포함 3장 포함). 기존 해설 SVG 별도 렌더와 학생 서비스 QA는 **NOT_RUN**.
- 아래 5개 MD를 각각 커밋한 뒤 GitHub 원격 readback 전문이 작성 문자열과 정확히 같음을 비교하고, Q번호 섹션 111개를 검증.

| # | 원본 시험지 | 문항 | KEEP | UPGRADE | 원본 PNG | 감사 MD | commit SHA | blob SHA |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | 23_순천고_2학기_중간_고2_확률과통계 | 22 | 22 | 0 | 1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_suncheon_2mid_DEEP_AUDIT.md) | `2f2b36e9b40c` | `ad686895e0c6` |
| 2 | 23_제일고_2학기_중간_고2_확률과통계 | 24 | 22 | 2 | 7 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_jeil_2mid_DEEP_AUDIT.md) | `15019b4e59b3` | `f28a254b62d0` |
| 3 | 22_복성고_2학기_중간_고2_확률과통계 | 20 | 20 | 0 | 0 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2022_boksung_2mid_DEEP_AUDIT.md) | `c9d57d3d974a` | `8f8ace1fca79` |
| 4 | 22_순천고_2학기_중간_고2_확률과통계 | 21 | 21 | 0 | 1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2022_suncheon_2mid_DEEP_AUDIT.md) | `0ab868c4b7a3` | `053a4ec5ccad` |
| 5 | 22_효천고_2학기_중간_고2_확률과통계 | 24 | 23 | 1 | 1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2022_hyocheon_2mid_DEEP_AUDIT.md) | `9a3c472326cd` | `367104bbdba0` |

## 검산 발견 및 보강 필요 항목

1. **2023 제일고 Q09 — UPGRADE / SOURCE_CONDITION_HOLD:** $P(X=99)=100P(X=100)$에서 $100p^{99}$로 나누려면 $p>0$이 필요하다. 조건이 없으면 $p=0$도 등식을 만족하여 $E(X)+\sigma(X)=0$이며 기존 정답 **55**가 유일하지 않다. $0<p<1$을 전제로 한 완성 풀이와 결함 경고를 해당 MD에 병기했다.
2. **2023 제일고 Q21 — UPGRADE / APPROXIMATION_SCOPE_HOLD:** 표준정규표 사용 시 최대 $n=72$가 도출되지만, 문제의 부등식을 정확한 이항확률로 해석하면 **$n=75$도 $P(|X-25|\le8)\approx0.963531\ge0.96$**를 만족한다. 정규근사 방식과 엄밀 확률 해석을 구분한 완성 풀이를 MD에 추가했고, 근사 조건 명시가 출고 게이트다.
3. **2022 효천고 Q11 — UPGRADE / SOURCE_CONDITION_HOLD:** $P(X=3)=\frac35P(X=4)$를 나누려면 $0<p<1$이 필요하다. 원문에 없으면 $p=0,1$도 좌우 확률 0으로 성립해 $E(7X)$가 각각 **0, 56**이 되며 기존 정답 **32**는 유일하지 않다. 조건부 학생 풀이 전문과 원문 보강 필요를 MD에 수록했다.
4. **그림 실물 검산:** 2023 순천 Q03 삼각밀도 밑변 8·높이 $b$ → $a-b=7/4$; 2022 순천 Q17 원본 $4\times3$ 도로격자 최단경로 35개 중 홀수 방향전환 20개 → $p+q=11$; 2022 효천 Q07 꺾인 밀도함수 $(0,1/6),(2,1/3),(5,0)$ → $P(1\le X\le4)=53/72$. 2023 제일고의 정규표 7개도 각 문항의 제공 수치와 대조했다.
5. **서술형·근사 검산:** 2022 복성 Q19 세 요소 양품확률 $9/20$로 800상자 분산 198, Q20 이항합 정규근사 구간 $[-2,3]$로 0.9759; 2022 순천 Q20 정규밀도 평행이동과 대칭으로 0.2417, Q21 이항근사로 0.8185; 2022 효천 Q24 오른쪽 꼬리 급수로 $a=2$와 최대 확률 0.3830.

## 게이트·누적 진행·다음 cursor

- 문항별 감사 **EXAM_AUDIT_COMPLETE**, UPGRADE 수정학생용 해설 3개 **DRAFT_STAGED / SOURCE_CONDITION_HOLD_OPEN**. 원본 문제·보기·정답·이미지·JS·SVG 파일 수정 없음.
- 원본 해설 SVG 렌더, 새로운 도식/Golden·Negative, 실제 서비스 화면 검증, 학생 노출 전 교정 승인과 최종 출고 PASS는 전부 **NOT_RUN**. 본 리포트는 staged 감사 완료 증거일 뿐 출고 PASS가 아니다.
- 공유 claim 변경 없음; main 브랜치 변경 없음. 원격 readback 5/5 일치, 문항 Q섹션 111/111 확인.
- 앞선 두 회차까지 포함 누적 **15개/331문항**(112+108+111); 2학기 중간 원본 확통 **21장 중 15장**, 잔여 6장.
- 다음 고정 위치: **20_매산고_2학기_중간_고2_확률과통계.js**. 이후 2020 매산여고·제일고, 2019 매산여고·복성고·제일고의 원본 중간 6장 완료 후 원본 2학기 기말로 진행한다.
