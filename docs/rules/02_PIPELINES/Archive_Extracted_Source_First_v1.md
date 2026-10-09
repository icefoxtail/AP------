# Archive CODEX — 추출 JS·에셋 우선, 원본은 결함 시에만 참조

status: CURRENT / DIRECT USER OVERRIDE — 2026-10-09

사용자 지시: 발문·보기·수식과 문제 에셋이 추출된 순간부터 CREATE/R1/R2/R3의 기본 작업 입력은 해당 JS와 실제 이미지 에셋이다. PDF는 원문 확인이 실제로 필요한 문항 결함이 생겼을 때만 제한적으로 대조한다. 이 지시는 과거의 routine PDF 재열람·전 페이지 대조 요구보다 우선한다. 품질 계약 버전, 독립 답안 freeze, 실제 자산 열람, R3 렌더 및 publication 기준은 변경하지 않는다.

## 1. 추출과 제작·검수의 경계

- 최초 PDF/scan → 발문·보기·수식·그림 추출은 source intake 작업이다. 이 작업에 필요한 원본 판독은 계속 수행한다.
- 추출 이후 CREATE는 기존 발문·보기·공통 자료·문제 에셋을 받아 정답·해설·decisiveStep·Meta·필요한 해설 SVG를 제작한다. PDF를 다시 읽거나 전사하는 것을 CREATE 시작 조건으로 두지 않는다.
- R1은 JS·실제 에셋으로 독립 풀이와 4축 검수를 한다. PDF 전수 대조를 반복하지 않는다.
- R2는 완전한 학생용 bundle과 모든 참조 에셋만으로 blind sweep을 한다. freeze 전 PDF·답안·upstream 해설을 공개하지 않는다.
- R3는 변경/open/direct dependency, 전체 구조 integrity와 실제 출력을 확인한다. PDF는 렌더나 release 검수의 기본 입력이 아니다.
- 원본 PDF가 존재하거나 경로가 assignment에 있다는 사실 자체는 열람 사유가 아니다. 이미 추출된 시험지의 매 단계 PDF 렌더·OCR·전 페이지 탐색을 하지 않는다.

## 2. 기본 입력 검사와 정직한 provenance

ROOT는 현재 JS SHA·qid 분모·발문/보기와 에셋 참조·실제 파일/asset SHA·기존 intake evidence를 기술적으로 결속한다. PDF SHA·페이지·문항 위치·추출 provenance는 제공된 근거를 재사용한다. 원본 파일을 다시 렌더하거나 읽어야만 이 결속을 할 수 있는 구조로 만들지 않는다.

`sourceInputMode: EXTRACTED_JS_ASSETS`, `pdfReviewMode: DEFECT_ONLY`를 assignment의 기본값으로 기록한다. 정책 metadata는 학생용 지문·보기 또는 정답 추론 정보에 삽입하지 않는다.

JS와 에셋을 확인했다는 이유만으로 `원본 PDF 실제 대조 완료`나 `원문 100% 일치`를 새로 선언하지 않는다. 기존 원본 대조 근거를 재사용했는지, 현재 추출 baseline와의 동일성을 검수했는지, 해당 문항 PDF를 실제로 봤는지 구분한다. 원문 충실도에 대한 최초 추출의 책임은 source intake에 남는다. provenance가 불완전하면 그 한계를 기록하며 원본 대조 PASS를 만들어 내지 않는다.

## 3. PDF로 확대할 수 있는 실제 결함

먼저 JS·필수 에셋과 해당 worker의 계산·조건 해석으로 문제를 확인한다. 다음과 같은 구체적 원본 의존 문제가 있을 때만 해당 qid·페이지/문항 영역을 대조한다.

- 조건·단위·수식·보기의 누락, 오독 또는 서로 충돌하는 전사 흔적
- 필수 문제 그림/표/도형의 누락·잘림·판독 불가, JS 조건과 실제 문제 에셋의 충돌
- 추출 입력만으로 조건·답의 유일성을 결정할 수 없는 실제 문항 결함
- 시험지·문항 identity 또는 원본 연결이 실제로 잘못됐다는 근거
- JS·에셋만으로 정리되지 않은 문항 결함에 대해 worker가 원본에서 확인해야 하는 사실을 특정한 경우

단순 답 불일치, 계산/선택기호 실수, TeX 구분자·줄바꿈, 해설 SVG 오류, capture·경로·SHA·receipt 오류만으로 PDF를 자동 열지 않는다. 다만 이 문제가 원문 조건의 누락·오독에 연결된다는 구체적인 근거가 생기면 scoped 원본 확인으로 확대할 수 있다.

`qid`, 발견된 결함, JS·에셋에서 이미 확인한 근거, 원본에서 확인할 사실, 실제 열람한 범위·결과·SHA를 남긴다. 답 불일치를 해결하려고 답안지를 먼저 찾거나 전체 시험지를 재대조하지 않는다. 관련 공통 자료나 직접 의존 문항이 필요하면 그 qid 범위와 이유를 추가로 명시한다. 제작·검수 helper는 QID_ONLY만 허용한다. identity 또는 추출 전체의 실제 손상이 발견되면 별도 source intake 복구로 routing하며 정상 stage의 전수 PDF 대조로 확장하지 않는다.

## 4. 부족 입력과 복구

필수 학생 입력이 빠져 있으면 불완전한 상태로 freeze하지 않는다. ROOT가 intake/원 stage owner에게 누락된 범위 복구를 연결한다. R1/R2 worker에게 freeze 전에 답안·해설을 포함한 원본을 전달하는 방식으로 복구하지 않는다.

원본을 확인한 문항의 실패·수정 근거와 원 freeze는 보존한다. 학생 조건·보기·결정적 문제 visual이 바뀌면 worker가 freeze validity를 판단하고 무효 범위만 fresh 검수한다. 계산·기호 정정이나 의미 불변 조판은 기존 session의 근거 있는 최소 adjudication/correction-review를 따른다. 필요한 PDF 확인도 하지 않은 채 알려진 문항 결함을 PASS하거나 source HOLD를 강제 해제하지 않는다.

ROOT는 원본 확인의 필요 범위·routing·기술 receipt를 담당한다. 원문·수학·Meta·visual 판정은 해당 worker가 담당한다. 완료된 시험지의 역사 receipt를 이 정책을 적용하기 위해 소급 변환하거나 재검수하지 않는다.
