# v0.2 독립 전수검수 45건 재판정

독립 보고서는 전체 221 L2 / 676 L3 / 1,399 L4를 100% 검사했고 core JSON/CSV/26개 Markdown의 구조 동기화는 PASS로 판정했다.
본 v0.3은 그 보고서를 그대로 기계 수용하지 않고 RPM-primary, 교육과정 applicability 분리, course-scoped identity 원칙으로 재판정했다.

## 결과
- ACCEPT: 35
- MODIFIED: 7
- REJECT: 3
- TOTAL: 45

| # | v0.3 판정 | 반영 내용 |
|---:|---|---|
| 01 | MODIFIED | DELETE 기각. 2022 최대공약수·최소공배수 활용을 RPM_EXTENDED_CANDIDATE로 보존, 기본 출력 제외. |
| 02 | ACCEPT | 2015 확률과통계 모비율 추정 branch 삭제. |
| 03 | MODIFIED | DELETE 기각. 2022 공통수학2 외분점을 RPM_EXTENDED_CANDIDATE로 보존, 기본 출력 제외. |
| 04 | ACCEPT | 2022 미적분I에 롤의 정리와 평균값 정리 L3/L4 추가. |
| 05 | REJECT | RPM-primary 위배. 2022 최신 RPM 공개 목차의 L2 `제곱근과 그 실수`를 유지. |
| 06 | MODIFIED | HOLD 대신 잘못 생성된 `역삼각형 기본` L4 제거. `역함수 미분`만 유지. |
| 07 | MODIFIED | 2022 미적분II도 동일하게 잘못 생성된 L4 제거. |
| 08 | MODIFIED | MERGE 대신 맥락 구분 RENAME: `일차함수 그래프의 평행·일치` / `두 직선의 평행·일치`. |
| 09 | MODIFIED | 2022 중2-1도 동일 정책. |
| 10 | ACCEPT | 2015 수학I `삼각함수` L2 내부의 중복 그래프 L3 제거, 별도 RPM L2에 통합. |
| 11 | ACCEPT | 2022 대수도 동일. |
| 12 | ACCEPT | 2015 확통 `확률의 뜻과 활용`의 중복 독립시행 branch 제거, 조건부확률 쪽 유지. |
| 13 | ACCEPT | 2022 확통도 동일. |
| 14 | REJECT | 과목 간 canonical identity는 전체 경로로 구분. 수학(하)와 확통의 순열 계열은 course-scoped로 병행 유지. |
| 15 | REJECT | 공통수학1과 확통의 순열 계열도 course-scoped 병행 유지. |
| 16 | ACCEPT | 2015 중2-2 대각선 성질 명칭을 전략/도형별로 구분. |
| 17 | ACCEPT | 2022 중2-2 동일. |
| 18 | ACCEPT | 2015 중2-2 generic 복합도형 3건을 핵심 정리 기반으로 RENAME. |
| 19 | ACCEPT | 2022 중2-2 동일. |
| 20 | ACCEPT | 2015 중3-1 수의 계산을 곱셈공식/인수분해 전략별로 RENAME. |
| 21 | ACCEPT | 2022 중3-1 동일. |
| 22 | ACCEPT | 2015 중3-1 식의 값을 전략별로 RENAME. |
| 23 | ACCEPT | 2022 중3-1 동일. |
| 24 | ACCEPT | 2015 중1-1 일차방정식 활용 catch-all L3를 도형 활용/생활 속 관계식으로 SPLIT. |
| 25 | ACCEPT | 2022 중1-1 동일. |
| 26 | ACCEPT | 2015 중2-1 연립방정식 기타 활용을 도형 활용/일의 양으로 SPLIT. |
| 27 | ACCEPT | 2022 중2-1 동일. |
| 28 | ACCEPT | 2015 중2-1 특수한 연립방정식을 복잡한 꼴/해가 특수한 경우로 SPLIT. |
| 29 | ACCEPT | 2022 중2-1 동일. |
| 30 | ACCEPT | 2015 중2-2 주사위·동전·카드 L4를 전략 기반 `경우를 나누어 구하는 확률`로 RENAME. |
| 31 | ACCEPT | 2022 중2-2 동일. |
| 32 | ACCEPT | 2015 중3-1 근과 계수 조건을 `이차방정식과 해`로 MOVE/RENAME. |
| 33 | ACCEPT | 2022 중3-1 동일. |
| 34 | ACCEPT | 2015 중3-2 접선 길이/각 L4 SPLIT. |
| 35 | ACCEPT | 2022 중3-2 동일. |
| 36 | ACCEPT | 2015 수학(하) 유리함수 최대·최소/교점 SPLIT. |
| 37 | ACCEPT | 2022 공통수학2 동일. |
| 38 | ACCEPT | 2015 수학(하) 무리함수 역함수/교점 SPLIT. |
| 39 | ACCEPT | 2022 공통수학2 동일. |
| 40 | ACCEPT | 2015 확통 표현수단 `표·나무그림` L4 제거. representation tag 영역으로 이동 예정. |
| 41 | ACCEPT | 2022 확통 동일. |
| 42 | ACCEPT | 2022 중3-2 `상자그림과 산점도 종합`을 판단목표 중심으로 RENAME. |
| 43 | MODIFIED | `이상치·분포 해석`을 삭제하지 않고 `이상치를 포함한 자료 해석` RPM_EXTENDED_CANDIDATE로 분리·보존. |
| 44 | ACCEPT | Pilot을 master 단일 authority에 맞춰 재생성. |
| 45 | ACCEPT | 최종 STATS 후 MANIFEST를 재생성하여 seal 불일치 제거. |

## 핵심 정책 수정
1. `교육과정 밖 = DELETE` 금지.
2. RPM/실제 유형으로 보존할 가치가 있으면 `RPM_EXTENDED` 또는 `RPM_EXTENDED_CANDIDATE`로 taxonomy에 유지하고 기본 출력에서 제외.
3. canonical identity는 label 전역값이 아니라 curriculum/course/path 전체 경로.
4. RPM-primary L1/L2 명칭은 단순 자연어 선호로 RENAME하지 않음.
