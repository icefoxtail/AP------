# 팔마고 원본 Q23 — 제작자 역발문·정확 수학 검산

- 원본: 2025 팔마고 고1 2학기 중간 서술형4, Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`
- Primary RPM L3: `점과 직선 사이의 거리` (`H1-RPM-216` DIRECT_ACTIVE), 원본 넓이 `80/3`
- 대상: A1~C3 9 UID, **서술형 9 / 객관식 0**, 기존 Q01~Q21 보호, Q22 별도 미제작 보존
- 제작자 상태: KEEP 9 / REVISED 0 / HOLD 0. GPT 별도 open-book 품질 검수 NOT_RUN. 학생 Consumer/index NOT_REGISTERED. Chrome NOT_TESTED. RELEASE NOT_DONE.
- 수학 검산: 각 거리식을 `±` 두 가지 직선으로 분기하고 네 교점·폭·길이·극값을 정확 분수/정수로 확인. 원본 정답/해설로 역산하지 않음.
- Visual 2축: 문제용 `NO_VISUAL`; 해설은 두 평행선 쌍의 네 교점·수직거리·둘레를 도식화할 교육적 이점 `BENEFICIAL`, 기존 팔마고 전용 SVG 보강 라인에서 실제 제작/렌더 필요. 실제 SVG/Chrome PASS 주장 금지.

| UID | 최종 학생 질문 | 답 | 검산 근거 | 역발문 |
|---|---|---|---|---|
| ALITE-PALMA25-2MID-Q23-A1 | 기본형 거리 자취와 넓이 | $30$ | EXACT_DISTANCE_FOUR_INTERSECTIONS | KEEP |
| ALITE-PALMA25-2MID-Q23-A2 | 정수 넓이가 나오는 다른 기울기 | $52$ | EXACT_DISTANCE_FOUR_INTERSECTIONS | KEEP |
| ALITE-PALMA25-2MID-Q23-A3 | 고정 거리·분수 길이로 넓이 계산 | $68$ | EXACT_DISTANCE_FOUR_INTERSECTIONS | KEEP |
| ALITE-PALMA25-2MID-Q23-B1 | 기준축을 수평선으로 바꾸어 거리식의 폭 판단 | $40$ | EXACT_HORIZONTAL_FOUR_INTERSECTIONS | KEEP |
| ALITE-PALMA25-2MID-Q23-B2 | 면적을 역으로 활용해 미지의 거리 구하기 | $t=4$ | EXACT_INVERSE_DISTANCE | KEEP |
| ALITE-PALMA25-2MID-Q23-B3 | 거리 자취의 평행이동 불변량 판단 | 넓이 $30$; 상수항과 무관 | EXACT_OFFSET_CANCELLATION | KEEP |
| ALITE-PALMA25-2MID-Q23-C1 | 넓이를 통해 기울기 매개변수 역결정 | $k=\dfrac34$ | EXACT_SLOPE_INVERSE | KEEP |
| ALITE-PALMA25-2MID-Q23-C2 | 직선 거리 자취에서 네 꼭짓점과 둘레 결정 | $20$ | EXACT_DISTANCE_FOUR_INTERSECTIONS_AND_PYTHAGORAS | KEEP |
| ALITE-PALMA25-2MID-Q23-C3 | 자연수 조건에서 평행사변형 넓이의 극값 판단 | 최솟값 $30$, 최댓값 $60$ | EXHAUSTIVE_POSITIVE_INTEGER_PAIRS | KEEP |

## 역발문 및 수정 판단
학생용 입력만 다시 읽어 (1) 두 거리조건과 미지량, (2) 4개의 교점이 실제로 존재하는지, (3) Primary L3 거리식 사용이 필수인지, (4) 답형·등호·경계가 명확한지 확인했다. 특히 B2의 t>0, C1의 k>0, C3의 a,b 양의 정수 조건을 최종 발문에 명시했다.
Q23은 전부 서술형이므로 5지 오답 경로 4/4는 NOT_APPLICABLE이다. 실제 정수/분수 검산값은 package의 `mathWitness`에 UID별 보존했다.
수정 전/후: 초안 제시 이전에 계산과 발문 조건을 정리해 최종 산출물만 보존, 확정본 발표 후 변경 없음. 사후 수정 또는 SVG 추가 시 해당 UID 관련 근거 재검 필요.
출시 여부: **creator candidate only**; 별도 공개답 검수/원장 명시 품질승인 전 main Student DB 승인 등록 금지.
