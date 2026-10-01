# 2026-10-01 복성고1 review false-PASS regression fixture

대상: `26_복성고_2학기_중간_고1_기출`

권위:
- R2 false-PASS lineage: `work/line3/26-bokseong-h1-2mid-r2-full-reopen-20261001@21fdf9353a76e0007c6b6ffde5dd05594f5c18b7`
- R2 artifact commit: `422cc2f294250a1468117d7055b6d06a5154e5cb`
- R2 finalArtifactSha: `ee6c1575d10c4a78e8346e93bb3a057983565be0`
- GPT direct R3 FAIL: `work/line3/26-bokseong-h1-2mid-r3-retry-20261001@d890bd91583eff052c230bbb6d1831b20a89402d`
- R3 ledger blob: `fafd103cc33ae0c0e40f01dd5eaacf4ae2ae7403`
- R3 fail packet blob: `88526f6c2ad890523338b61e9d455b0f6c18b9c7`

이 폴더의 SVG는 **실패본을 고정한 Negative Sample**이다. production으로 복원하거나 Golden Sample로 사용하지 않는다.

## 회귀 1 — SVG actual geometry를 보지 않은 false PASS

R2 receipt는 `solutionSvgAuditCount=14/14`였지만 direct R3에서 아래 5개가 `VISUAL_SOLUTION_MISMATCH`로 FAIL했다.

- q1: 라벨은 기울기 `-5/6`, y절편 `-7/6`을 적었지만 실제 line primitive 좌표가 그 직선을 나타내지 않음.
- q3: 라벨은 `7x+y-15=0`인데 실제 line primitive는 반대 부호 기울기이고 PH와 수직도 아님.
- q7: 포물선 primitive가 라벨된 `A(-1/2,0)`, `B(0,-1)`을 실제로 지나지 않음.
- q8: 라벨은 `7x+y-20=0`인데 실제 접선 primitive의 기울기/접점 geometry가 불일치.
- q20: 라벨은 `3x+4y-8=0`인데 실제 line primitive 기울기가 `+3/4` 방향이라 PH와 수직이 아님.

검수자는 SVG 내부 문구가 아니라 **actual coordinates/topology에서 expected fact를 계산**해야 한다.

## 회귀 2 — 작은칠판 집계만 있고 실제 구조 미확인

R2 `smallBoardAuditCount=22/22`였지만:
- q2: ㄱ/ㄴ/ㄷ/ㄹ 판정이 한 문단에 붙음.
- q17: ㄱ/ㄴ/ㄷ 판정이 한 문단에 붙음.

source가 enumerated 구조이면 solution도 각 판단을 독립 block으로 분리한다.

## 회귀 3 — Meta N/N 자기보고

R2 `metadataFullAuditCount=22/22`였지만:
- q4: exact ACTIVE `PT_MOVE_LINE_TRANSLATION / TT_LINE_TRANSLATION_EQUATION` 재사용 가능인데 null.
- q11: exact ACTIVE `PT_MOVE_REFLECTION_SHORTEST / TT_SHORTEST_ONE_LINE` 재사용 가능인데 null.
- q21: `PT_SUBSET_COUNT` 아래 exact ACTIVE `TPL_SUBSET_COUNT_SET_CONDITION` 재사용 가능인데 template null.

모든 null에는 lookup evidence + `nullReason`이 필요하고, unique `EXACT_ACTIVE`가 있으면 null PASS 금지.

## 회귀 4 — source/runtime escape

R2 `sourceContentChoicesAuditCount=22/22`였지만 q2 final JS에는 corrected source candidate와 다른 doubled TeX escape가 남았다. q7/q20 solution에도 같은 family가 존재했다.

JS source 문자만 보지 말고 sandbox 평가 뒤 runtime `content/choices/answer/solution`을 검사한다.

## 사용법

CREATE/R1/R2/R3 시작 전 관련 Negative Sample calibration에서 이 README와 실패 SVG를 확인한다.

이 fixture의 목적은 별도 파일럿이 아니다. **현재 production 검수의 회귀 방지 HARD fixture**다.
