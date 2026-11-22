# 고1 1학기 중간 유사 — 2026년 6종 수학·SVG 실물 검수 보고서

> 작성 2026-11-22 KST · 브랜치 `work/solution-upgrade-h1-similar-1mid-20261122` · 실제 원본 JS/SVG 변경 없음

## 대상과 결과

기존 고1 2학기 기말 유사 23종이 모두 감사된 다음 순서다. 1학기 중간 유사는 11종 중 최신 2026년 **강남여고·금당고·매산고·매산여고·복성고·팔마고 6종**을 이번 묶음으로 검수했다. 다음 후보는 **2025년 강남여고·순천여고·제일고·팔마고** 및 2023년 매산고 순서다.

- 전 133문항의 현행 발문·보기·정답·해설을 판독하고 수학 핵심 산식을 직접 대조했다. **KEEP 133, UPGRADE 0, 수학 HOLD 0, UNREAD 0**. 이것은 심층 감사 초안이지 새로운 블라인드 R1 합격·운영 출고 승인이 아니다.
- JS에서 실제 연결한 **SVG 46/46개**를 렌더하고 7장의 연락처 시트에서 전 자산을 육안 확인했다. 참조 누락 0, 렌더 실패 0, 현재 연결 SVG에서 명백한 수학/레이블 결함 발견 0. 실제 Chrome·모바일·A4 인쇄 별도 QA는 NOT_RUN.
- **원본 기출과 이미지 역할을 대조해 미연결 24칸**을 발견했다: 문제 이미지 **6**, 해설 이미지 **18**. 구형 유사 생성 `problemPlanRef/solutionPlanRef`가 모두 있어도 21칸은 `EXEMPT`, **3칸은 `UNSUPPORTED`** 상태다. 2026-11-20 현행 ‘유사 1:1 그림은 기출의 같은 번호 그림을 계승’ 정책으로는 이 항목들을 단순 면제 PASS 처리하지 않는다.
- 위험도 분류: **P1 6칸, P2 18칸**. P1은 학생 도형 이해에 중요한 누락 또는 엔진 처리 제약(해설 구성 필수 포함)이다. 현행 46개를 고치는 건은 현재 발견되지 않았으므로, 계획은 새로운 24칸 연결 및 재검수 중심이다.
- 실제 렌더 원본 폴더에는 연결되지 않은 구형 SVG 2개(매산고 `q15.svg`, 팔마고 `q9.svg`)가 더 있어 총 48개가 렌더되었다. **학생 참조 46개와 구분**하며 2개를 삭제하거나 자동 연결하지 않는다.

| 시험지 | 문항 | 연결 SVG | 누락 문제 | 누락 해설 | 상세 문항 감사 |
| --- | ---: | ---: | ---: | ---: | --- |
| 강남여고 | 24 | 7 | 1 | 2 | [문항별 감사](26_강남여고_1학기_중간_고1_유사_DEEP_AUDIT.md) |
| 금당고 | 20 | 7 | 1 | 3 | [문항별 감사](26_금당고_1학기_중간_고1_유사_DEEP_AUDIT.md) |
| 매산고 | 20 | 8 | 0 | 1 | [문항별 감사](26_매산고_1학기_중간_고1_유사_DEEP_AUDIT.md) |
| 매산여고 | 23 | 5 | 0 | 4 | [문항별 감사](26_매산여고_1학기_중간_고1_유사_DEEP_AUDIT.md) |
| 복성고 | 24 | 8 | 4 | 6 | [문항별 감사](26_복성고_1학기_중간_고1_유사_DEEP_AUDIT.md) |
| 팔마고 | 22 | 11 | 0 | 2 | [문항별 감사](26_팔마고_1학기_중간_고1_유사_DEEP_AUDIT.md) |
| **합계** | **133** | **46** | **6** | **18** | — |

## 엔진 작업이 필요한 이미지 역할 24건

| ID | 시험지/qid | 슬롯 | 우선 | 기존 plan 상태 | 원본 기출의 이미지 경로 |
| --- | --- | --- | --- | --- | --- |
| F-01 | 강남여고 7번 | 문제 | P2 | `EXEMPT` | `archive/assets/images/26_강남여고_1학기_중간_고1_기출/q07.png` |
| F-02 | 강남여고 14번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_강남여고_1학기_중간_고1_기출/q14-solution.svg` |
| F-03 | 강남여고 24번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_강남여고_1학기_중간_고1_기출/q24-solution.svg` |
| F-04 | 금당고 4번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_금당고_1학기_중간_고1_기출_c/q4-solution.svg` |
| F-05 | 금당고 13번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_금당고_1학기_중간_고1_기출_c/q13-solution.svg` |
| F-06 | 금당고 16번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_금당고_1학기_중간_고1_기출_c/q16-solution-v2.svg` |
| F-07 | 금당고 19번 | 문제 | P2 | `EXEMPT` | `archive/assets/images/26_금당고_1학기_중간_고1_기출/q19.png` |
| F-08 | 매산고 9번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_매산고_1학기_중간_고1_기출c/q9-solution.svg` |
| F-09 | 매산여고 6번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q6-solution-v2.svg` |
| F-10 | 매산여고 11번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q11-solution.svg` |
| F-11 | 매산여고 13번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q13-solution-v2.svg` |
| F-12 | 매산여고 19번 | 해설 | P1 | `UNSUPPORTED` | `archive/assets/images/26_매산여고_1학기_중간_고1_기출_c/q19-solution-v2.svg` |
| F-13 | 복성고 1번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q1-solution-v2.svg` |
| F-14 | 복성고 5번 | 문제 | P1 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q05.png` |
| F-15 | 복성고 5번 | 해설 | P1 | `UNSUPPORTED` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q5-solution.svg` |
| F-16 | 복성고 7번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q7-solution-v2.svg` |
| F-17 | 복성고 11번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q11-solution.svg` |
| F-18 | 복성고 14번 | 문제 | P2 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q14.png` |
| F-19 | 복성고 18번 | 문제 | P1 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q18.png` |
| F-20 | 복성고 19번 | 문제 | P1 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q19.png` |
| F-21 | 복성고 19번 | 해설 | P1 | `UNSUPPORTED` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q19-solution.svg` |
| F-22 | 복성고 20번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_복성고_1학기_중간_고1_기출/q20-solution.svg` |
| F-23 | 팔마고 9번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_팔마고_1학기_중간_고1_기출_c/q9-solution.svg` |
| F-24 | 팔마고 18번 | 해설 | P2 | `EXEMPT` | `archive/assets/images/26_팔마고_1학기_중간_고1_기출_c/q18-solution.svg` |

정확한 학생용 도식 기대값, 기출 이미지 Blob SHA, 현행 plan SHA, 미지원 엔진 조건 및 새 SVG 인수 기준은 [Codex SVG 엔진 24칸 수정 실행 플랜](H1_1MID_SIMILAR_BATCH6_SVG_ENGINE_REPAIR_EXECUTION_PLAN_20261122.md)에 **역할별로** 작성했다. 이를 고쳤다는 뜻은 아니며 현재 24칸 모두 `OPEN`이다.

## 시각 검수 범위와 남은 문턱

1. 실측: Git 브랜치 `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`의 JS + 연결 SVG 46개 및 추가 비연결 2개를 로컬에서 렌더했다. 원본 복제본에서 CSS 클래스·중첩 SVG 처리만 렌더러용으로 보정했고 운영 소스/자산은 손대지 않았다.
2. 시각: 일곱 시트에서 도형·라벨·영역·끝점·점/곡선·좌표를 현행 설명과 대조했다. 작은 글자와 축 비율은 SVG 최종 판본과 모바일 크기에서 다시 확인해야 한다.
3. 기출 대조: 원본 6종의 연결 이미지 역할, 대표 기출 문제 PNG 6장(곡선·구·직육면체·카드·음영영역·원/정사각형)을 직접 확인했다. 원본 이미지 자체를 유사 시험지에 숫자 변화 무시한 채 복사하면 안 된다.
4. 미진행: 새 SVG의 엔진 렌더/게시, 대체 후보의 독립 A/B 검수, 브라우저 학생화면 시험/해설/정답, Golden·Negative 표본, 운영 JS 수정, PR/main 병합, 학생 배포 = `NOT_RUN`.
5. 후속 상태: `MATH_AUDIT_DRAFT_COMPLETE`; `LINKED_VISUAL_REVIEWED`; **`IMAGE_PARITY_HOLD_24`**; `ENGINE_NOT_RUN`. 다음 Codex 작업자는 P1부터 엔진 지원을 확인하고, 24개 슬롯을 건별로 수정·검산한 후 최종 재검수를 요청한다.
