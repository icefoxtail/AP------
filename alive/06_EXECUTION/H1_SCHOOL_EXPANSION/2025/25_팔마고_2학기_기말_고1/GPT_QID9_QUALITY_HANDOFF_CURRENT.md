# 팔마고 q01~q23 작업자 품질 HARD LOCK

## 절대 최우선 3축
1. **교육과정 내 풀이:** 공통수학2 범위 개념·용어·방법만 사용. 미분·적분·벡터 및 고등 상위 과정 금지. 수학적 참값 검증 뒤 교육과정 수준에서 다시 풀이를 작성한다.
2. **해설 품질:** 학생이 글만 읽고 따라 풀 수 있어야 하며 판단 기준, 선택지별 판단 근거, 정답 및 오류 경로를 빠짐없이 적는다. 복수정답 강제 단일화 금지. 각 보기가 그림이면 그래프 5/5를 독립 판정해야 한다.
3. **SVG 품질:** 문제용·해설용을 독립 판정. 실제 좌표/곡선/열린점·닫힌점/라벨과 수학의 일치, 모바일 가독성을 확인한다. 문제 그림에 정답 힌트 금지. 해설 SVG는 핵심 판단 시각화. 실제 브라우저 렌더하지 않았다면 PASS로 기록 금지.

## 매 qid 인계 증거
- curriculumWithinScope N/N, explanationReproducibility N/N, problemSVGActualChecked N/N, solutionSVGActualChecked N/N, browserStatus, metaRegistryCrosswalk, reverseStemChecks 필수.
- q01 A1~C3 9개 제작 완료, 45 그래프, 문제 SVG 9+해설 SVG 9, 정답 ①, ④ / ①, ②, ⑤ / ②, ③ / ①, ④, ⑤ / ②, ③ / ①, ③, ⑤ / ①, ④, ⑤ / ①, ④ / ②, ③, ⑤.
- Canonical H1-RPM-251, PT_FUNCTION_DEFINITION_JUDGMENT, TPL_FUNCTION_JUDGMENT_GRAPH. 원본/기존 유사 23문항 보호. 새 창 다음 작업 q02.
- SourceUid exact hash 9 unresolved. 별도 품질검수/브라우저/Consumer/main NOT_RUN. 임의 승인·출시 선언 금지.

## 난이도 임의 배정 금지 — q01 보정 사항
- 반드시 최종 발문·실제 그래프·필수 판단 단계별로 학습 `level=하/중/상`과 평가 `difficultyBucket=1~5`를 독립 판정한다. A/B/C 위치나 보기 종류 수만으로 높게 매기지 않는다.
- q01 실제 문항별 난이도 재판정: A1=중/3, A2=하/2, A3=중/3, B1=중/3, B2=중/3, B3=중/3, C1=중/3, C2=중/3, C3=중/3 (학습/평가). 모든 UID의 결정적 사고와 난이도 이유는 Q01_CREATE_DRAFT.json 각 review에 기록.
- 품질 3축 고정(교육과정 내 풀이, 학생 재현 해설, 문제/해설 SVG 실제 수학 일치)을 난이도 판단 이전에 유지하고 별도 출력 전 검증한다.

## q02 AUTHOR DRAFT — 2026-10-14
- 원본 q02 실제 PNG( Git blob ed1383becc8c672e67557224b8a6c1a5459ea1f6 )·원본 JS blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e 확인; f(2)=4,f(3)=2,f(4)=3, g(2)=2,g(3)=4,g(4)=3.
- L3 H1-RPM-253 합성함수 / L4 합성함수 계산 DIRECT_ACTIVE; UID별 ACTIVE PT/TPL·난도·조건·역발문·오답 근거는 q02 JSON 및 Metadata registry.
- A1~C3 9개 AUTHOR_DRAFT_ONLY, 문제 SVG 9개+해설 SVG 9개 Git blob 결속, 각 UID self math/choice/curriculum/Meta/visual 필요성 기록. Python 좌표 수치·수학 계산 실행; 실제 Archive 브라우저 렌더·외부 독립검수·Consumer·main은 NOT_RUN.
- q02 exact sourceUid 9개 EVIDENCE_DEBT. q01 9개 그대로 보호. 18/207 후보, next q03. q03은 같은 source-read→5축 설계·작성·검증·Git 누적.

## QID9 정답번호 3×3 분산 HARD — 2026-10-14 형님 직접 확인
- 신규 원본 qid A1~C3 9문항의 객관식 정답번호는 ①~⑤ 각 1~2개(2/2/2/2/1)로 분산한다. **3×3 가로 A/B/C와 세로 1/2/3 모두 번호 중복·쏠림을 각각 확인한다.** 숫자만으로 채우지 말고 최종 배치표를 제작 ledger에 남긴다.
- 정답 수학값/content/실제 함수/SVG는 바꾸지 않고, 보기의 순서가 가변적인 문항만 재배열한다. 그 때 choices/answer/solution 결론/오답 네 개의 번호→실제 계산값 근거/receipt를 동기화하여 최종값으로 표적 재검한다. 원문 보기 또는 순서의 의미가 잠긴 경우 임의 재배열 금지. 숫자 보기 오름차순 자체는 순서 보호 근거가 아니다.
- q02 수정 분포: A=[③,①,⑤], B=[②,④,①], C=[④,⑤,②]. 번호 빈도 ①2 ②2 ③1 ④2 ⑤2. q01 원문 그림 복수정답은 이 3×3 단일 정답 분산의 일괄 대상이 아님. q03 이후 제작 전/후 적용.
- q02 본문 수학과 그림 원본/문제SVG/해설SVG/Meta 난도는 불변. 9개 문항 선택지 순서·번호·결론·오답 근거만 재조정. 독립검수 및 브라우저는 NOT_RUN 유지.

## CURRENT USER OVERRIDE — 2026-10-14 정답번호 분산 최종 시험지에서 처리
- 이전 3×3 번호 분산은 현재 qid별 제작의 강제 마감 조건이 아니다. 23원본 × 9 = 207개 전체 문제의 마지막 제작이 끝났을 때 정답 분포를 최종 조정한다. 작성 중에는 답 인덱스 기록만 유지하고 수학·오답·해설·메타 품질을 우선한다.
- 이번 작업에서 독립 품질검사와 브라우저 출력은 사용자 지시로 제외하며 상태는 NOT_RUN. 이전 완료문항은 재검하거나 정답번호를 다시 바꾸지 않는다.
## q03 AUTHOR DRAFT — 2026-10-14
- 원본 q03 역함수 대응도 f(2)=4, g(4)=3 → f⁻¹(4)+g(4)=5; source JS blob 0d12b75e824ab47f08fc3b5a6180be595f882c6e, PNG blob ed1383becc8c672e67557224b8a6c1a5459ea1f6.
- 원본 L3 H1-RPM-255 역함수 DIRECT_ACTIVE. A1~C3 9개 신규 AUTHOR_DRAFT + 문제SVG9 + 해설SVG9 Git blob 기록; 각 UID 해설·정답·오답4·난이도2축·Meta·이미지 필요성 기록.
- q03 sourceUid exact 9건 EVIDENCE_DEBT, 독립검수/브라우저/Consumer/운영 main NOT_RUN. q01·q02 원본/후보/자산과 기존 유사문제 변경 0.
- 누적 27/207, 다음 시작 q04. 전체 207문항의 정답 분산은 마지막 종합단계로 미룬다.
