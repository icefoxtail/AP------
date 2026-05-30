# APMS_ASSESSMENT_MVP_SCOPE_LABEL_PATCH_20260530

## 1. 목적

시험지 보관함 카드에서 원장님/선생님이 평가 범위를 바로 확인할 수 있도록 보정했다.

## 2. 수정 파일

- archive/assessment/assessment-mvp.html
- archive/assessment/assessment-packs-1sem.generated.js
- archive/assessment/assessment-question-index-1sem.generated.js

## 3. 보정 내용

- 대문 제목을 `시험지 보관함`으로 정리
- 대문 설명을 `진단평가·단원평가·중간·기말평가를 범위 확인 후 바로 출력합니다.`로 정리
- 검색 placeholder에 `범위` 포함
- 모든 평가팩에 `scopeLabel`, `scopeUnits`, `scopeNote` 추가
- 카드에 `범위` 라인 표시
- 진단평가도 어디부터 어디까지인지 보이도록 범위 계산
- 중간·기말평가도 시험 대비 범위가 보이도록 범위 계산

## 4. 정책

- 평가팩 문항 구성은 변경하지 않음
- 출력/정답/해설 동작은 변경하지 않음
- SVG 감사팩은 포함하지 않음
- 대시보드 연결은 이번 패치 범위에 포함하지 않음
