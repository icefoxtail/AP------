# 고1 명제 전수 품질 업그레이드 보고서

- 작업 기준 SHA: `7d98468764d1ba2112bba1400e06592f3dc08b84`
- 작업 브랜치: `codex/proposition-upgrade-20260904`
- 작업일: 2026-09-04
- 대상: `H15-SB-02`, `H22-C2-06`
- 대상 범위: 원본 168문항 + 유사 24문항 = 192문항
- 현재 상태: `TARGETED_UPGRADE_COMPLETE_WITH_SOURCE_REVIEW_NOTES`

## 1. 범위 및 inventory

현재 production JS를 VM으로 읽어 다음 수량을 재현했다.

| 구분 | H15-SB-02 | H22-C2-06 | 합계 |
|---|---:|---:|---:|
| 원본 | 144 | 24 | 168 |
| 유사 | 0 | 24 | 24 |
| 합계 | 144 | 48 | 192 |

재평가 결과:

- 대상 문항 로드: 192/192
- JS 평가 오류: 0
- 문항별 해설 공란: 0
- malformed 명제 LaTeX 패턴: 0
- 대상 파일 내 중복 id: 0

## 2. 적용한 수정

| 문항 | 변경 내용 |
|---|---|
| `original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js#3` | `x\\gta-7`, `-4\\gta-7`를 `x\\gt a-7`, `-4\\gt a-7`로 복구하고, `P=[-4,2]`와 `Q=(a-7,∞)`의 포함 관계를 설명하는 solution SVG 연결 |
| `original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js#15` | `a\\gtb\\gtc`를 `a\\gt b\\gt c`로 복구하여 연쇄 부등식이 정상 렌더되도록 수정 |
| `original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js#7` | `또는`의 부정, 경계 포함 여부, 자연수 추출 과정을 학생용 해설로 보강 |
| `original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js#14` | 필요조건 방향 `q→p`, 열린구간과 닫힌구간의 끝점 조건, 실제 달성 가능성을 보강 |
| `original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js#6` | `a<0`일 때 `Q=∅`인 공허한 포함관계를 누락하지 않도록 보강 |
| `original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js#22` | 공통수학2 학생 수준에 맞게 `mod 4` 합동식 대신 홀수 제곱의 전개와 나머지 설명으로 변경 |
| `original/high/h1/2mid/21_제일고_2학기_중간_고1_기출.js#11` | 운영 메모와 answer 문자열 설명을 제거하고, (가)~(마)가 모두 옳다는 학생용 결론으로 정리 |
| `original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js#6` | 중복 결론 문장을 제거하여 해설 마지막 문장을 하나로 정리 |

## 3. 신규 자산

`archive/assets/images/22_팔마고_2학기_중간_고1_기출/q03-solution.svg`

- `title`, `desc`, `viewBox`: 존재
- 외부 `href`, `image`, `script`, `foreignObject`: 없음
- 수직선의 닫힌 구간 `[-4,2]`, 열린 구간 `(a-7,∞)`, 포함 방향 표시
- 실제 solution mode에서 이미지 decode 및 표시 확인

## 4. 렌더 검증

팔마고 22 2학기 중간 production JS를 대상으로 실제 `archive/engine.html`을 열어 확인했다.

- `solution`: 문항 22개 표시, solutionImage 5개 decode 완료, overflow 없음
- `exam`: 전체 발문 렌더, 문제 이미지 4개 decode 완료, overflow 없음
- `answer`: `.ans-n` 22개, q3 정답 `②`, 복수정답 q9 `③, ⑤` 표시, overflow 없음
- 브라우저 console error/warn: 0

별도 정적 검사:

- 대상 192문항 VM 재평가: PASS
- `q03-solution.svg` XML parse: PASS
- solutionImage 상대 경로 존재: PASS
- `archive/question-index.js` 재생성: 10,980문항 / 중복 qKey 0

## 5. source review 메모

다음 기존 문항은 현재 production JS 내부에서 수학·형식상 추가 확인이 필요한 지점이 발견되었으나, 작업 범위를 임의로 넓히지 않고 보류했다.

- `original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js#9`: 정답이 `③, ⑤`인데 발문은 단수형 `항상 옳은 것은?`으로 보인다. 원본 스캔/PDF가 없으므로 content 또는 answer를 임의로 변경하지 않았다.
- `original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js#9`: `Q=∅` 가능성 때문에 현재 조건만으로는 ⑤가 항상 오답이라고 단정하기 어렵다. source 확인 없이 정답을 바꾸지 않았다.

이 두 문항은 수정 완료로 세지 않고 `SOURCE_REVIEW` 후보로 유지한다. 따라서 이번 보고서는 전체 정식 `FINAL PASS`가 아니라, 확인 가능한 결함을 수정하고 잔여 source ambiguity를 보존한 전수 업그레이드 후보 보고서다.

## 6. 범위 외 변경

함수 계열 작업에서 동시에 변경 중이던 SVG·리뷰 도구·보고서 파일은 이번 커밋에 포함하지 않는다. 명제 작업의 명시적 변경 파일만 stage한다.
