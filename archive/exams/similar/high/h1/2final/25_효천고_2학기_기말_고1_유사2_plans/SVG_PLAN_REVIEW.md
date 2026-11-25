# 2025 효천고 고1 2학기 기말 유사2 — 문제·해설 시각 플랜 검수 (Q01~Q12)

- 원문: `archive/exams/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사2.js` (23문항, Git blob `238337f860624411bfbe46073a53f49e1e566c98`, SHA-256 `52bf511e9ddb4376a079922615e8f80489f6632ec414015f8c05e17989c4c2eb`). `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사2/source-revision.json`과 SHA-256 일치.
- 배치: **Q01~Q12(12문항, 문제·해설 24축)**. Q13~Q23은 후속 배치. plan 경로는 이 `_plans/` 폴더 기준.
- 원문과 동일 버전에 결속된 기존 실행 계획 5개를 현행 발문·해설·실제 출력 필드로 대조해 제작 경로에 이관했다. Q10은 원문 함수값으로 여섯 화살표를 직접 계산해 **해설 plan을 새로 작성**했고 Q12는 도식에서 중심 라벨을 실제로 표시하도록 수정했다. 문제 축에 답이나 풀이값을 새로 드러내는 그림 없음. 면 채움 없음.
- 공식 검사: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <6개 plan>` **6/6 OK**, 동일 6개 `--jobs 2` **full 6/6 OK**. `DRAWN_FEATURE_PARITY`는 원문과 **실제 렌더 대상 JSON 필드**의 개별 대조이며, 실물 SVG·PNG·A4·학생 화면·JS 이미지 연결 변경은 **NOT_RUN/UNCHANGED**.

| 파일/qid | 축 | 판정과 사유 | capability | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY (원문 ↔ 실제 출력 필드) |
| --- | --- | --- | --- | --- | --- | --- |
| 효천2/Q01 | 문제 | EXEMPT — 참·거짓 판단의 문장·식만 제시 | — | — | N/A | N/A |
| 효천2/Q01 | 해설 | EXEMPT — 조건과 명제의 정의·반례로 완결 | — | — | N/A | N/A |
| 효천2/Q02 | 문제 | EXEMPT — 두 식과 정의역 {1,a}로 완결 | — | — | N/A | N/A |
| 효천2/Q02 | 해설 | EXEMPT — f(a)=g(a) 인수분해 계산 | — | — | N/A | N/A |
| 효천2/Q03 | 문제 | EXEMPT — 일차함수의 합성식만 존재 | — | — | N/A | N/A |
| 효천2/Q03 | 해설 | EXEMPT — 두 합성값의 식 대입으로 완결 | — | — | N/A | N/A |
| 효천2/Q04 | 문제 | EXEMPT — 역함수의 두 수치 조건만 존재 | — | — | N/A | N/A |
| 효천2/Q04 | 해설 | EXEMPT — 연립일차방정식으로 f 결정 | — | — | N/A | N/A |
| 효천2/Q05 | 문제 | EXEMPT — 유리식 세 항의 통분만 요구 | — | — | N/A | N/A |
| 효천2/Q05 | 해설 | EXEMPT — 통분·약분, 정의역 제외점은 식으로 확인 | — | — | N/A | N/A |
| 효천2/Q06 | 문제 | EXEMPT — P∪Q=Q 및 Q∩R=R의 집합식만 제시 | — | — | N/A | N/A |
| 효천2/Q06 | 해설 | BENEFICIAL — 두 포함 관계와 명제의 대우 | set-diagram-figure-v1 | `q06-solution.plan.json` | PASS/PASS | **PASS** — `diagram.kind=MEMBERSHIP_TABLE`, P·Q·R 소속 표: P⊆Q, R⊆Q를 만족하는 **예시** 5원소; 일반적 결론 r→q는 텍스트로 구분 |
| 효천2/Q07 | 문제 | EXEMPT — ㄱ·ㄴ·ㄷ 조건·보기 표가 글로 완결 | — | — | N/A | N/A |
| 효천2/Q07 | 해설 | BENEFICIAL — 충분하되 필요하지 않음을 반례로 비교 | set-diagram-figure-v1 | `q07-solution.plan.json` | PASS/PASS | **PASS** — `diagram.elements`: ㄱ (1,2)/(0,3), ㄴ (3,3)/(−3,−3), ㄷ 3/4, 각 P∩Q와 Q에만 속하는 반례 행을 구분 |
| 효천2/Q08 | 문제 | EXEMPT — 주어진 평행이동량을 그래프로 미리 풀면 판단 정보를 노출 | — | — | N/A | N/A |
| 효천2/Q08 | 해설 | BENEFICIAL — 무리함수의 평행이동·정의역·치역 | multi-curve-figure-v1 | `q08-solution.plan.json` | PASS/PASS | **PASS** — `curves` 원함수 y=√(2x)와 이동 후 y=√(2(x−2))−1, 시작점 (2,−1), `overlays.points` (4,1) |
| 효천2/Q09 | 문제 | EXEMPT — 정수 함수 방정식만 제시 | — | — | N/A | N/A |
| 효천2/Q09 | 해설 | EXEMPT — f(1),f(2),f(4) 순차 대입 계산 | — | — | N/A | N/A |
| 효천2/Q10 | 문제 | EXEMPT — f(x)=3x mod 7 정의가 완전하며 대응도를 미리 주면 추적 답을 유도 | — | — | N/A | N/A |
| 효천2/Q10 | 해설 | BENEFICIAL — 여섯 원소 순환·f¹⁵=f³ 추적 | set-diagram-figure-v1 | `q10-solution.plan.json` | PASS/PASS | **PASS** — 신규 `diagram.arrows` 1→3,2→6,3→2,4→5,5→1,6→4; `highlightPaths` 1→3→2→6 세 단계, 해설축에만 표시 |
| 효천2/Q11 | 문제 | EXEMPT — 무리함수식·정의역 조건만 주어짐 | — | — | N/A | N/A |
| 효천2/Q11 | 해설 | BENEFICIAL — 원함수·역함수 대칭 및 교점 | multi-curve-figure-v1 | `q11-solution.plan.json` | PASS/PASS | **PASS** — `curves` √(x−1)+3, 역함수 (x−3)²+1 (x≥3), y=x, `overlays.points` (5,5) |
| 효천2/Q12 | 문제 | EXEMPT — 유리함수식과 대칭축 조건만 제시 | — | — | N/A | N/A |
| 효천2/Q12 | 해설 | BENEFICIAL — 점근선 중심·대칭축·평행이동 | multi-curve-figure-v1 | `q12-solution.plan.json` | PASS/PASS | **PASS** — `curves` (2x+4)/(x−2)에서 자동 산출 점근선 x=2,y=2, `overlays.callouts[zC]`의 실제 라벨 C(2,2), `curves` 대칭축 y=−x+4 및 y=x |

**총계** 12문항·24축 = REQUIRED 0 + BENEFICIAL 6 + EXEMPT 18. 실사용 plan **6**, shallow/full **6/6**, field parity **6/6**, `ENGINE_CAPABILITY_PENDING` **0**, 렌더·PNG·학생화면·A4 **NOT_RUN**. 모든 EXEMPT는 각 축의 개별 수학·교육적 사유를 기록했다.
