# 2025 팔마고 고1 2학기 중간 — Q17~Q20 공개답 검수·핀포인트 수정

- 검수일: 2026-10-10 KST
- 브랜치: `work/alive-25-palma-h1-2mid-qid9`
- 범위: 원본 source Q17, Q18, Q19, Q20 × A1~C3 = **총 36 Generated UID**
- 검수 방식: **Generated ALIVE 공개답·발문 우선**. 완성된 학생용 발문·보기부터 검토 → 정답/해설 계산 전개·경계·정답 유일성 → 실제 오답 4개와 보기번호 결속 → Primary L3/단원·학년 적합성 확인. 기출 R1/R2 blind 인증이나 브라우저 렌더 인증을 수행한 것으로 주장하지 않음.
- 판정: **내용 검수 36/36 완료, 수정 반영 후 KEEP 26 / REVISED 10 / HOLD 0. 정답 변경 0, 발문 변경 0.**
- 형님 명시 범위: **검수·수정만, main 운영병합·학생 Consumer/index 등록·출시·Chrome QA 없음**.

## 문항별 disposition

| 원본 | A1 | A2 | A3 | B1 | B2 | B3 | C1 | C2 | C3 | 계 |
|---|---|---|---|---|---|---|---|---|---|---|
| Q17 | KEEP | KEEP | KEEP | REVISED | KEEP | KEEP | KEEP | REVISED | KEEP | 7/2 |
| Q18 | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | REVISED | 8/1 |
| Q19 | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | KEEP | 9/0 |
| Q20 | REVISED | REVISED | REVISED | KEEP | REVISED | KEEP | REVISED | REVISED | REVISED | 2/7 |

## 확정 수정 — source package 한정

1. **Q17-B1 (오답 ⑤):** `k=64`를 유도한다던 '반지름의 절반' 설명이 실제 계산 경로와 불일치. 잘못된 식 `m=r sin 45°` (정상식에서 2 누락) → `r=8, k=64`가 되도록 `distractorReasons`와 `distractorWitnesses`의 인과관계를 동기화.
2. **Q17-C2 (해설):** `P`가 반지름 3~5의 부채꼴 고리 영역에서 움직이는데 해설 앞부분이 원 위 '호 AB의 중점'을 등호 실현 점으로 잘못 사용함. 반사된 두 점 사이 거리 `√2 OP`, `OP≥3`, `OP=3`인 각의 이등분선 점 및 반지름 3 원 안의 실제 교점 `Q,R`이 각 5 길이 경계 선분 안에 있다는 등호 논증으로 교정. 최솟값 `3√2`, 정답 ⑤ 유지.
3. **Q18-C3 (오답 근거):** `ge`, `approx`, `t/3ge4` 등이 수식 명령어가 아닌 평문으로 남은 오류를 `\\ge`, `\\approx`, `\\dfrac{t}{3}\\ge4` 등 정상 LaTeX로 복원. `distractorReasons`와 각 `distractorWitnesses.mistake`를 동기화.
4. **Q20-A1/A2/A3/B2/C1/C2/C3 (학생용 해설):** 최솟값·최댓값이 실제 가능한지 보인 네 영역 인원 배열에 대응 관계가 없었음. '모두 / 첫째만 / 둘째만 / 아무것도 아님' 영역의 순서를 풀이 문장에 명시. 수치·조건·정답 유지.

## 수학 검수 근거

- **Q17 9 UID:** 원점 중심 두 반사 경계의 각 `θ`에서 하계 `2r sin θ` 및 경계 선분 내부 교점의 등호 가능성 확인. B2는 실제 `Q=(1/2,√3/2), R=(1,0), QR=1` 확인. C2의 최소 반지름 3, C3의 자연수 `19≤n≤32` (14개) 확인.
- **Q18 9 UID:** 각의 이등분선 정리 `BH:HC=AB:AC` 및 무게중심의 `BC`에 대한 높이 `1/3`을 이용하여 `[GHC]/[ABC]=AC/[3(AB+AC)]`, `[GHB]/[ABC]=AB/[3(AB+AC)]`를 독립 대조. C3 두 넓이 조건으로 최소 자연수 `t=8`.
- **Q19 9 UID:** 큰 원·위/아래 반원과 직선의 교점을 실제 원 방정식의 판별식 및 `y` 부호 필터로 계산. `m=0`, 접선 임계값, 임계값 사이/밖에서 같은 점 중복을 제거한 후 문제의 보기 범위·개수와 대조. C2는 `n=4,5,6,7`의 4개, C3은 `n=25..40`의 16개.
- **Q20 9 UID:** 전체 `N`, 두 모임 크기 `a,b`, 교집합 `x`를 두고 합집합 `a+b-x`, 정확히 한 곳 `a+b-2x`, 어느 곳에도 없음 `N-a-b+x`로 각 문항의 허용 정수 `x`를 전수 열거. 9개 정답과 양끝 달성 가능성 모두 일치.
- 27개 객관식 전부 5개 보기 및 오답 4개 witness-선지 값 매핑을 확인. Q20 서술형 9개는 `choices=[]`가 정상.
- 기존 source 기출 JS Blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`과 개별 UID, `stem`, `choices`, `answer`, `meta`를 수정하지 않음. Q18/Q20 Generated 전용 EXT registry 경로 존재 여부 확인; 전체 신규/출시용 Meta 권위 검증이나 소비자 동기화는 별도.

## 원본 대비 원격 package Blob 감사

| package | 최초 Blob | 수정 후 Blob | 변경 문항 |
|---|---|---|---|
| Q17 | `de12d493e198c3fd2d29b7b2ccd9966e49aa34cb` | `e06bd2f8373874aef7765f2cfe9da4dd496e3354` | B1,C2 |
| Q18 | `9282cd48b0b7e18a682acd1b4677effabb4647fb` | `90617d697f2e49369ec6edf583d0cacb83b739b3` | C3 |
| Q19 | `4a4636fe6f7412520b9752b82ebef14ea2f4fd3a` | 동일 | 없음 |
| Q20 | `9b70b089400edb928a68960169ce411976df9fe0` | `64005c59f8c425588396f4c28dde6e39245ccc2b` | A1,A2,A3,B2,C1,C2,C3 |

검수 후 모든 package는 JSON 파싱 가능, 9/9 UID 고유성 및 전체 36 UID 중복 0, 5지 선지·오답 witness 값 일치, 원본 대비 허용 필드 이외 변경 0.

## 상태 경계 및 인계

- **OPENBOOK_CONTENT_REVIEW_DONE / BRANCH_ONLY**: 범위 36 UID 내용 검수·필요 수정 완료.
- package 내부 `creatorSelfReview`, `reviewStatus: NOT_RUN...`, `publication`은 **제작 당시 상태/provenance**로 변경하지 않음. 이번 별도 검수의 증거는 이 ledger이며, Creator self-review를 독립검수로 둔갑시키지 않음.
- `CHROME/RENDER=NOT_TESTED` (실제 브라우저 실행 안 함), `CONSUMER/INDEX=NOT_REQUESTED`, `MAIN_MERGE=NOT_REQUESTED`; `MAIN_DONE` 주장 금지.
- 대상 Q17~Q20 밖 package·main·원본 기출·RPM LOCKED·기존 학생 Consumer/index는 변경하지 않음.
