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
