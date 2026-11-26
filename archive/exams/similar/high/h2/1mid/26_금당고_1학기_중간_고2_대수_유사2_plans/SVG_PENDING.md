# 26_금당고_1학기_중간_고2_대수_유사2 — SVG 후속 및 병렬 작업 정합성

21문항의 그림 필요성을 독립 판정하였다. Q08·Q19는 R1에서 발문·풀이 구조가 바뀌었으며, 같은 날 다른 라인이 먼저 제작한 SVG는 **R1 수정 전 문제**에 대한 그림이므로 현재 학생용 JS에 연결하지 않는다. 기존 파일은 보존하되 R1 의미의 그림으로 재제작해야 한다. Q21은 문항 조건이 바뀌지 않았고, 병렬 작업의 실제 SVG를 재렌더해 수학 내용과 가독성을 확인했다.

| 번호 | 축 | R1 최종 상태 | 물리적 근거와 후속 조치 | plan |
| --- | --- | --- | --- | --- |
| Q08 | 문제 보조 | **SVG_TO_CREATE / NOT_RUN** | 이전 SVG 실물은 `y=2^x`, `f(0)=1`을 표시하지만 최종 문항은 `y=2^x+3`, P의 y=7, Q의 x=4이다. 의미 불일치로 JS `image` 연결 제거. 수정된 계획으로 다시 렌더·시각검수해야 한다. | `q08-problem-svg-pending.plan.json` |
| Q19 | 해설 | **SVG_TO_CREATE / NOT_RUN** | 이전 SVG 실물은 가능한 k를 `-8,2,12`로 표시하지만 최종 정답을 결정하는 값은 `-2,2,6`이다. 의미 불일치로 JS `solutionImage` 연결 제거. 수정 계획 재렌더 필요. | `q19-solution-svg-pending.plan.json` |
| Q21 | 해설 | **SVG_ASSET_READY / R1_VISUAL_PASS / JS_UNBOUND** | SVG를 Inkscape PNG로 재렌더해 포물선, `u=1/4,3/4`, `y=5/16`의 교점·라벨을 확인했다. 다만 정규 `q21-solution.plan.json`이 `EXEMPT`라 `solutionImage` 연결 시 공식 하네스가 FAIL이다. 임의 승격하지 않고 연결 보류. | `q21-solution-svg-pending.plan.json` |

## 검사 이력과 범위

- 병렬 SVG 제작 라인(2026-11-25)은 당시 문제 기준으로 전체 `plan-lint` 3/3, `render-plan.mjs` 3/3 ARCHIVE_BOUND, 학생 언어 검사 3/3, PNG 시각검수 3/3이라고 기록하였다. **이는 R1에서 수리된 Q08·Q19 문제와의 의미 일치를 증명하지 않는다.** 실제 그림을 R1 문제와 비교한 결과 두 그림은 불일치하였다.
- 독립 R1 수리 계획의 `plan-lint --shallow`는 Q08·Q19·Q21 모두 OK(3/3). 이 로컬 환경의 깊은 `plan-lint`는 Q19 OK, Q08·Q21에서는 `NotoSansKR.ttf` 미설치(`ENOENT`)로 미완료였다. Q08·Q19의 **수정 계획 기반 공식 재렌더는 아직 NOT_RUN**이다.
- Q21의 기존 실제 SVG는 수리 후에도 문항 조건이 그대로이며 이번 독립 R1에서 물리적 재렌더·시각 확인을 완료했다. 다만 정규 계획 EXEMPT로 활성 연결은 미완료이며 이 작업은 별도 도형 운영계획·엔진 증거 확보 후에만 가능하다. `R1_VISUAL_PASS`는 **별도 파일의 시각 내용 판정이지 연결 승인이나 운영 런타임 PASS가 아니다**.
- 42개 정규 운영 판정 계획(`qNN-problem.plan.json`, `qNN-solution.plan.json`)은 종전대로 EXEMPT이며, 후속 선택 그림은 별도 pending 계획에 보존한다. 세 SVG 파일은 삭제하지 않되 정규 엔진 승인 전에는 어느 것도 JS에 연결하지 않는다.

## 2026-11-26 FIRST_FORMAL 독립 사후검수 — 현행 JS 기준

- 실제 발문·해설·기존 SVG 실물을 다시 대조해 21문항의 42개 축 중 **39개 EXEMPT, 3개 BENEFICIAL**로 독립 기록하였다. 정식 결속 증거의 정본은 인접한 `<시험지>.svg-followup-ledger.json`과 `<시험지>.finalqa-evidence.json`이다. 기존 R1의 42개 정규 EXEMPT 파일은 당시의 이력으로 보존하며 위 새 분류와 혼동하지 않는다.
- **Q08 문제:** 선택 그래프는 지수함수 `y=2^x+3`의 증가·상방 이동만 보여 주도록 `q08-problem-svg-pending.plan.json`에서 `P(x=2)`, `Q(y=19)`의 파생 좌표에 종속된 점·양축 안내선을 제거했다. 문제에서 묻는 `p`, `q`, `q-p`의 값은 그림에 드러내지 않는다. 현재 학생용 JS에 기존 `q08-problem.svg`를 연결하지 않는다. 새 계획의 렌더·PNG·학생 화면은 `NOT_RUN / SVG_TO_CREATE`이다.
- **Q19 해설:** `q19-solution-svg-pending.plan.json`에 현행 해설에서 나온 `k=-2,2,6`과 `6-(-2)=8`의 출처 조건·제작 의도를 결속했다. 기존 `q19-solution.svg`는 R1 전 수치와 다르므로 참조하지 않는다. 수정 계획의 렌더·PNG는 `NOT_RUN / SVG_TO_CREATE`이다.
- **Q21 해설:** `q21-solution-svg-pending.plan.json`의 과거 비일치 `sourceQuote`를 현재 작은칠판 풀이의 `$u^2-u+\\dfrac3{16}=0$`와 두 양의 해 `1/4, 3/4` 문장에 맞췄다. 기존 SVG의 R1 시각검수 이력은 유지하되 이번 FIRST_FORMAL에서는 직접 재렌더·PNG 판정을 하지 않아 `NOT_RUN`이다. 아직 JS에 `solutionImage` 참조를 연결하지 않는다.
- 3개 후속 제작용 계획 모두 **공식 `plan-lint --shallow` 3/3 OK, full 3/3 OK**(NotoSansKR/정규 Python·MathJax 의존성 사용). 이 결과는 제작 가능성의 정적 검증이며 실제 렌더·시각 QA 합격이 아니다. 다른 39개 축은 해당 문항의 수식·조건·판서 설명을 근거로 각각 불필요함을 판단했다.
