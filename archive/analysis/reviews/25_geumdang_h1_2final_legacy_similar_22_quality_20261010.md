# 25 금당고 2학기 기말 · 기존 유사문항 22개 품질검수 및 핀포인트 수정

- 작업 범위: `archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사.js` (q01~q22만)
- 비교 원본: `archive/exams/original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js`
- 기준 main: `3722fd8a1dbea04c3701aab8748ba9424b28ce3c`
- 최초 유사 JS blob: `f5c97b0e847d020b5edb499d8c17e97305d29305`
- 수정 JS blob: `dd61011746b3ae714bc56c0c5f017e03401a37d8`
- 상세 문항별 수학 재계산·Meta·source UID·Visual 결정 및 asset Git blob: [품질검수 원장 JSON](25_geumdang_h1_2final_legacy_similar_22_quality_20261010.json)

## 검수 결과

- 인벤토리 22/22 연속. 객관식 20개 × 보기 5개, 서술형 2개.
- 질문 자체의 조건으로 다시 계산한 답과 저장된 답 **22/22 일치**. 정답·보기 배열은 수정하지 않았다.
- 발문 최소 수정: **q02** (조건제시법 중 문장 분절), **q14** (반복합성 표기 정의), **q17** (집합 B/C의 문장 분절), **q19** (상수함수·함숫값의 의미를 정확히 명시).
- 해설 보강: **q04** (보기 5개별 참·거짓), **q12** (경계 k<9의 구체적 반례), **q18** (직각 자취의 A/B 제외 및 k=7 실재 교점), **q19** (서로 다른 네 근 조건의 완전한 경우 분석). 나머지 기존 해설은 KEEP.
- 문제용 Visual 판정 22/22. q06·q16 기존 SVG 실파일/코드를 확인해 KEEP, 나머지 발문은 숫자·식·조건만으로 구성 가능하므로 원본문제 그림 신규 생성 없음.
- 해설용 Visual 판정 22/22. **q09·q10·q12·q15·q16·q18·q19·q20·q22** 교육용 SVG 9개 추가. 별개 문제용 시각자료 복제는 없고, 가시적 함수 관계·경계·정수 구간·원/직선 교점이 새로 표시된다. 그 외 13개는 신규 도형이 핵심 개념을 추가로 전달하지 않아 EXEMPT.
- 시각자료 자산은 `archive/assets/images/25_금당고_2학기_기말_고1_유사/`에만 추가. `solutionImage`/alt/caption으로 source JS에 직접 연결. SVG 구조 검사(흰 배경, viewBox, title/desc, 라벨, foreignObject/script/LaTeX 금지)는 정적으로 수행. 원과 직선·함수/역함수·조각함수 및 무리함수의 핵심 좌표는 수치 재계산과 대조.
- Meta: 기존 기출 22문항의 **ACTIVE Meta Foundation** L1~L4/PT/TPL, CrossConcept/Condition 레지스트리를 참고해 유사문항 자체 근거로 검토한 값을 JS에 결속. q16의 원본 '사분면 판정' 타입은 유사문항의 실제 '함수식 복원 및 무리함수 시작점'과 불일치하므로 현재 유효한 함수식 구하기 L3/L4 및 PT/TPL로 교정. 22개 난이도 1~5 판정. `sourceKind=LEGACY_SIMILAR`과 qid 1:1 출처 결속. RPM LOCKED 원장은 변경하지 않았으며 Meta Foundation L3/L4가 곧 RPM LOCKED L3/L4임을 주장하지 않는다.

## 범위 경계 및 미실시 검사

형님의 최신 지시에 따라 **main 병합, DB/Catalog/Archive 2.0 통합 색인, Compose/Factory 공급 및 실제 학생 화면·출력 테스트는 이번 브랜치에서 수행하지 않는다.** 필요한 운영병합과 기술 QA는 Work가 맡는다. 현재 내용은 별도 독립 검수 세션의 formal `R1/R2` PASS 인증이 아니라, 본 GPT가 원문을 기준으로 재계산·교정한 **직접 품질검수 및 제작자 자체검사 결과**다. 실제 Chrome/인쇄 렌더 및 타 reviewer 독립 승인도 미실행이므로 `MAIN_DONE`, `RELEASED`, `FORMAL_INDEPENDENT_PASS`로 기록하지 않는다.

Work 인수 시 원본 파일·22문항 identity 및 보호 원본 비변경, 추가 SVG 9개의 실제 학생용 해설 렌더(수식·라벨·페이지 경계), 기존 문제용 SVG 2개 비회귀, source→Meta/검색 projection과 RPM namespace 분리를 확인한 뒤 latest main으로 병합한다. 신규 QID9 생성 금지.
