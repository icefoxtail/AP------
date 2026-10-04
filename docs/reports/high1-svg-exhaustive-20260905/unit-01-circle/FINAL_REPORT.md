# Unit 01 — 원의 방정식 전수 검수

- 상태: `COMPLETE_FOR_HANDOFF`
- 대상 key: `H15-SA-11`, `H22-C2-03`
- 원본 문항: **140**
- source files: **33**
- unique solution SVG: **140**
- circle-scope production diff at intake: **0**

## 판정 요약

| 게이트 | 결과 |
|---|---:|
| source-only expected-facts ledger | 140/140, unique 140, JSON parse error 0 |
| answer/solution artifact parity | 모든 기록된 batch PASS |
| SVG XML/static contract | 140/140 PASS |
| viewBox / forbidden node / external ref / numeric geometry | 140/140 PASS |
| scale-policy review | 46개 metadata repair + 25개 명시적 schematic exception으로 71건 해소 |
| render matrix | 33 source files × exam/solution/answer = 99 matrix entries |

## production repair

equal pixel grid가 관찰된 **46개** SVG는 `data-scale-policy="EQUAL_UNIT"`로 정규화하고,
수정된 root에는 `preserveAspectRatio="xMidYMid meet"`를 추가했다. 실제 변경 파일은
**41개**이고, 나머지 5개는 이미 동일한 post-repair 상태였다. 전후 SHA-256은
[`10_production_scale_repairs.json`](10_production_scale_repairs.json)에 기록했다.

정확한 pixel 거리로 수치를 읽게 하지 않는 25개 도식은 그림 안에서 값을 재측정하지 않고
오른쪽 계산 패널의 source fact를 읽도록 설계된 자료이므로 `PASS_EXPLICIT_SCHEMATIC_EXCEPTION`으로
종결했다. 이 25개에 대해 임의로 좌표축을 재설계하지 않았다.

## render evidence

기존 전체 브라우저 batch는 99회 시도·99회 load pass였고, 수정 후에는 새 탭에서 대표
`22_금당고_1학기_기말_고1_기출.js`의 시험지·해설지·정답표를 비동기 로드 완료까지 기다려
모두 populated DOM 및 screenshot으로 재확인했다. 세부 기록은
[`11_render_evidence.json`](11_render_evidence.json), matrix는
[`03_unit_render_matrix.csv`](03_unit_render_matrix.csv)에 있다.

빠른 99회 재순회 중 인앱 브라우저 탭이 충돌한 시도는 exam-data failure로 합산하지 않고
인프라 노이즈로 분리했다. source JS와 engine data는 바꾸지 않았으며, 수정 범위는 SVG root
metadata와 scale contract뿐이다.

## 다음 단원 경계

원의 방정식 단원은 여기서 마감한다. 다음 작업은 별도 intake로
`H15-SA-10` 직선의 방정식과 `H22-C2-02` 직선의 방정식을 대상으로 시작한다.
