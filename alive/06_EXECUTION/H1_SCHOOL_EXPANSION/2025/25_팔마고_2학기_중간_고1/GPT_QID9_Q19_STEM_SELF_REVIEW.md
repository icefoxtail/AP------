# 팔마고 Q19 — 제작자 역발문·정확 경계검산 (2026-10-10)

원본 `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`. 원본 q19 문제·해설 기반 원과 직선 교점 개수 분류. 원본 PNG 육안 검증은 이번 실행에서 하지 않았고, 9개 신규 발문 모두 큰 원과 두 반원호의 방정식 및 상·하 부호를 명확히 표기하여 그림 없이 수학적 조건 완결.

RPM `H1-RPM-219` DIRECT_ACTIVE: **L3 원과 직선 / L4 교점 개수**, PT_CIRCLE_LINE_RELATION·TM_CIRCLE_INTERSECTION_COUNT 정본 재사용. Cond `COND_RANGE`; C2/C3 `COND_NATURAL_NUMBER`; 불필요 CrossConcept 생성하지 않음. RPM LOCKED 및 q01~q18 보호.

정확한 공통 판정은 직선 $y=m(x-p)$과 원 $(x-c)^2+y^2=r^2$ 사이 거리 $|m(c-p)|/\sqrt{1+m^2}$와 $r$ 비교. **추가로 y 부호/끝점/서로 다른 교점 수 판정**. 수치 검산: A1 0→3, 상한→4 / A2·A3 수평→4, 접점→4 / B1 접점→4 / B2 총 5 / B3 수평→4, 접점→4 / C1 0→6, 하한→5, 상한→3 / C2 n=4~7 4개 / C3 n=25~40 16개, n=24 접점 4개.

| UID | 정답 | 사고 경험 | 역발문 | 오답 4개 |
|---|---|---|---|---|
| ALITE-PALMA25-2MID-Q19-A1 | ① | 원점과 반원 끝점 겹침을 제거한 정확한 교점 5개 판정 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-A2 | ③ | 반원호의 반지름이 다른 경우 접선 거리와 수평 경계 확인 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-A3 | ④ | 좌우 반사된 합성 반원호에서 기울기 부호를 거꾸로 판정 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-B1 | ② | 다섯 점에서 네 점으로 바뀌는 접선 경계값의 역산 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-B2 | ⑤ | 고정 기울기에서 큰 원과 작은 반원호의 교점을 각각 판정 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-B3 | ③ | 중심 간격이 달라진 두 반원호에서 임계값의 변화를 계산 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-C1 | ④ | 서로 다른 접선 임계값 사이에서 4교점만 되는 구간 분리 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-C2 | ① | 실수 기울기 구간을 자연수 격자 조건으로 변환 | KEEP | 4/4 |
| ALITE-PALMA25-2MID-Q19-C3 | ② | 역제곱근 기울기의 접선 경계와 자연수 범위 | KEEP | 4/4 |

제작 결과 9/9; KEEP9·REVISED0·HOLD0. 답 분포 ①2②2③2④2⑤1, 오답 유도 경로 36건, answer/solution·수식 fence·각 UID L3/메타 일치 정적 확인. 자체 점검은 GPT 공개답 독립검수 완료를 의미하지 않음. 기술 출시 현황: Consumer/index 0/9, main NOT_DONE, Chrome NOT_TESTED. 다음 원본 q20.
