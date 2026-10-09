# 팔마고 Q21~Q23 Generated 27문항 공개답 검수·핀포인트 수정 — 2026-10-10

- **Scope:** 원본 source q21, q22, q23 × A1~C3 27 UID; `work/alive-25-palma-h1-2mid-qid9`.
- **검수 결과:** CONTENT_REVIEW_DONE 27/27, KEEP 11 / REVISED 16 / HOLD 0. 수학 정답 변경 0, 총 문항·UID 변경 0.
- **운영 경계:** 형님 최신 명시 지시에 따라 이 브랜치에서 검수·수정만 수행. main 병합, 학생 Consumer/index 등록, 출판/Chrome 실행은 하지 않음.

## 문항별 disposition

| 원본 | KEEP | REVISED | HOLD | 결정 |
|---|---:|---:|---:|---|
| Q21 | 0 | 9 | 0 | A1~C3 해설 개행 9개, A3 소문항 발문 완결, C3 정수조건 Meta |
| Q22 | 7 | 2 | 0 | B3 해설 그림과 y축 교점, C1 양수 k 범위 Meta |
| Q23 | 4 | 5 | 0 | A1/A2/A3/B2/C2 발문 내신식 문장 |
| **합계** | **11** | **16** | **0** | |

## 실제 수정

1. Q21 9개: solution 문자열 내 리터럴 `\n` 3개씩을 실제 개행으로 복구해 JSON/JS 런타임에서 학생용 문장 경계가 명확해지게 함. Q21-A3 (1)(2) 질문을 완결된 동사형으로 수정. Q21-C3는 양의 정수 `k` 범위에서 정수 선택이 실제 결정적이므로 기존 정본 `COND_INTEGER`를 `COND_RANGE`와 함께 부여.
2. Q22-B3: 외접원 `(x-2)^2+(y-5)^2=9`의 y축 `x=0` 교점 `D(0,5+√5)`, `E(0,5−√5)`를 기존 solution SVG의 실제 원 좌표변환에 결속. 수치 생성: 화면 중심 `(170,145)`, 반지름 104px, x-screen `100.6667`, 교점 y-screen `67.4830, 222.5170`. 기존 중심·원·삼각형·직각 표시 보존. solution·alt·visual benefit도 두 교점과 일치하도록 수정.
3. Q22-C1: 반지름에서 `k^2=100`까지 얻은 뒤 `k>0`으로 `k=10`을 택하므로 실수 허용범위가 결정적. 기존 `COND_RANGE` 정본 키로 메타데이터 보강.
4. Q23-A1/A2/A3/B2/C2: '서로 다른 네 점은 ...'/'각각 모두' 등 역전·중복 발문을 한국어 학교식 질문으로 변경. 직선 방정식·거리·양수 조건·구하는 값 모두 유지.

## 수학 재대조

- Q21 A1~A3: `Q⊂R`, B1: `R⊂Q`, B2: `R=Q`, B3: 양방향 반례; C1: `k≤−6 or k≥2`, C2: `0≤t≤1`, C3: `k=1,2,3,4,5` (5개) 검증.
- Q22 독립 좌표 재계산: A1 `M(4,4),r²=32`; A2 `(1,3),10`; A3 `(2,4),10`; B1 `(3,2),10`; B2 `(5/2,3),13/4`; B3 `(2,5),9`; C1 `(5,5),50`; C2 `(2,6),40`; C3 `(1/2,3/2),5/2`. 원래 SVG 9개 실제 파일 존재 및 주요 center/vertex metadata 일치. B3 새 점 D/E 계산은 독립 Python 수치 확인. 수정 B3 실렌더 미실시.
- Q23 네 교점 평행사변형 `S=4ab√(1+m²)` 검산 (x=0과 y=mx): A1 30 / A2 52 / A3 68 / B2 t=4 / B3 30 / C1 k=3/4 / C2 둘레20 / C3 S 최소30 최대60. B1 y=0과 3x+4y=0은 넓이 40. 기존 정답 유지.

## 정본·보호 및 후속 게이트

- 원본 기출 JS, Q01~Q20, RPM LOCKED, 기존 승인·Consumer/index, main 모두 변경 0. Q23 Generated-only EXT L4 2개와 EXT Condition/CrossConcept 레지스트리 존재 확인; Q21/Q22 condition 등록은 기존 canonical만 사용.
- 이전 `creatorSelfReview`/`reviewStatus=NOT_RUN_CREATOR_ONLY`는 제작 당시 기록 그대로 보존; 이번 검수 완료 판정은 이 별도 원장이 담당한다.
- 실제 Archive desktop `mode=sol` SVG publication render, Chrome 학생 조회/출력은 **NOT_TESTED**. Q23 solution SVG 9개 신규 제작은 형님이 별도로 분리한 팔마고 시각화 라인, 이번 검수·수정 요청의 작업 범위 외. 릴리스 완료 주장 없음.

## 입력 Git Blob
- Q21: `b6dd6ba4985ff9e2b75be48d888e881f517498fa`
- Q22: `8a9ea555a4b602594680f92cfa651521b92b8f5c`
- Q23: `e6e914c5e6e9f976c94e5f9a5dc712daa14ed8a1`
- Q22-B3 SVG: `f3225fb2ad1773eae7e14c1d50a942fac23ea277`
