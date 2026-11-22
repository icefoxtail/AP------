# lane40 제5회차 — 고2 확통 2학기 기말 첫 5개 원본 감사 보고

- 기준 일자: **2026-11-22 KST**; 독립 MD 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 범위: 고2 확률과 통계 **2학기 기말 원본** `archive/exams/original/high/h2/2final/` 중 최신 연도 순 첫 5장.
- **5/5 시험지 · 116/116문항** 원문·보기·정답·기존 해설 전문 전수 판독 및 수학 독립 검산. **KEEP 116, UPGRADE 0, UNREAD 0**.
- 원본문제 PNG **고유 18개, 문항별 참조 23회** 실물 직접 확인. 기존 solutionImage SVG 61개는 경로 조사만 수행(렌더 NOT_RUN).
- 시험지별 감사 MD 5개 각각 신규 커밋, 원격 readback 전문 일치 **5/5**, Q01~마지막 문항 섹션 전수 **116/116** 확인.

| # | 원본 시험지 | 문항 | KEEP | UPGRADE | 고유 PNG/참조 | 감사 MD | commit SHA | 감사 MD blob SHA |
|---:|---|---:|---:|---:|---:|---|---|---|
| 1 | 25_강남여고_2학기_기말_고2_확률과통계 | 24 | 24 | 0 | 5/10 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_gangnamyeo_2final_DEEP_AUDIT.md) | `702a04a87c56` | `9c69f4a7af3c` |
| 2 | 25_금당고_2학기_기말_고2_확률과통계 | 20 | 20 | 0 | 2/2 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_geumdang_2final_DEEP_AUDIT.md) | `b2c4c8eb392d` | `f66858ad7f47` |
| 3 | 25_순천고_2학기_기말_고2_확률과통계 | 24 | 24 | 0 | 8/8 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2025_suncheon_2final_DEEP_AUDIT.md) | `90c1c6f7cb77` | `6d4a9781b257` |
| 4 | 24_매산여고_2학기_기말_고2_확률과통계 | 23 | 23 | 0 | 2/2 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2024_maesanyeo_2final_DEEP_AUDIT.md) | `e71de0b8f1bf` | `99aacb5cb068` |
| 5 | 23_강남여고_2학기_기말_고2_확률과통계 | 25 | 25 | 0 | 1/1 | [전 문항 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2023_gangnamyeo_2final_DEEP_AUDIT.md) | `65bb8cc83c3f` | `c9de5263053a` |

## 실물 그림과 주요 독립 검산

- **2025 강남여고 Q09:** 세 정규밀도 그림에서 A/B는 같은 폭, B/C는 같은 대칭축, C는 더 넓은 분포. ㄱ·ㄴ·ㄷ·ㅁ 네 진술만 참이므로 **②**, 평균과 표준편차의 역할도 구별했다.
- **2025 강남여고 Q12/Q18:** 꺾은선 밀도의 전체 넓이에서 **P(X≥1)=7/12**; 이산분포 양끝 확률을 각 1/20 옮긴 결과 **5V(Y)=39**를 실물 그래프·표로 확인했다.
- **2025 금당고 Q07/Q16:** 실물 사다리꼴+삼각형 밀도에서 **P(2≤X≤6)=5/6**, 수직선 게임의 Q(5) 도달 확률은 **5/16**이다.
- **2025 순천고 Q04·Q07·Q08·Q10·Q18·Q19·Q22·Q23:** 확률표와 표준정규분포표 8개 PNG를 모두 눈으로 읽어 표본평균·이항정규근사 수치를 재계산했다. 서술형 Q24의 **V(X)=179/144**도 분포 전체 합으로 검산했다.
- **2024 매산여고 Q04/Q10:** 같은 평균에서 A가 더 좁은 정상곡선 그림으로 표준편차 순서를 확인하고, 표준정규 음영 **[-1,2]**를 대칭 변환해 **a=34**를 확인했다.
- **2023 강남여고 Q21:** 동일 표준편차5인 두 정규곡선의 교점이 x=10이고 중앙영역 각 **0.4987**인 실물 그림과 표에서 **m₂−m₁=30**을 확인했다.

## 원본 보존·근사 표기·출고 게이트

- **이번 5장에 정답·해설의 수학적 불일치 미발견.** 객관식 정답 인덱스와 선택지 개수도 전수 일치. 따라서 본 차수는 UPGRADE 0이며 단정적으로 학생 화면 PASS로 승격하지 않는다.
- 이항분포의 정규근사에 기초한 문항(예: 2025 금당고 Q12, 순천고 Q10, 2023 강남여고 Q06)은 주어진 표와 **연속성 보정 없는 교과서식 근삿값**을 적용한 것이지 정확한 이항확률이라는 의미가 아니다. 개별 MD에 계산 전제를 적었다.
- 기존 JS·`content`·`choices`·`answer`·`solution`·PNG·SVG·main을 변경하지 않았고 공유 claim을 갱신하지 않았다.
- 기존 SVG 실물 렌더, 학생용 UI의 Golden/Negative, 실제 인쇄 PDF 대조, 개정 교육과정 교차확인 및 운영 최종 승인 **NOT_RUN**. 본 결과는 독립 **DRAFT_STAGED / EXAM_AUDIT_COMPLETE**, 운영 출고 PASS 아님.

## 누적 진행과 다음 cursor

- 고2 확통 **2학기 중간 21/21장 · 463문항** 완료 상태 유지. 이번 기말 첫 5장/116문항 추가로 누적 **26장/579문항** 감사 기록.
- **2학기 기말 5/22장 완료, 잔여 17장**. 다음 최신 연도순 원본 cursor는 `23_금당고_2학기_기말_고2_확률과통계.js`.
- 다음 차수도 원본 JS 고정, 모든 문항 개별 실계산/PNG 확인, 오류가 있으면 MD에 완결된 대체 해설과 출처 게이트, 별도 커밋 및 원격 전문 readback 후 결과 보고. 유형·교과서 등 다른 자료 범위로 자동 전환하지 않는다.
