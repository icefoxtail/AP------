# 오답 클리닉 출력 및 학기 필터 검증 (2026-09-28)

현재 작업 폴더의 수정과 로컬 검증 결과다. 운영 배포, 운영 DB 수정, 실물 프린터 출력은 수행하지 않았다. 열려 있는 운영 출력창의 세트 URL은 제공되지 않았고 Computer Use가 브라우저 주소를 확인하지 못해 직접 내부 상태를 읽지 못했다.

## 재현한 문제

수정 전 HEAD의 `apmath/wrong_print_engine.html`을 `/AP------/` 하위에 배포한 조건에서 시험 원문과 QR 라이브러리를 제공해도 MathJax의 추가 로더가 `/archive/vendor/...`를 요청했다. 결과는 `ok:false`, `code:MATH_TYPESET_INCOMPLETE`였고 `print-area`의 텍스트는 비어 있었다. 초기 실패를 표시하지 않는 공통 렌더링 경로 때문에 사용자는 진행과 실패를 구분할 수 없었다.

오답 클리닉에는 기존 아카이브의 빠른 인쇄 모듈과 버튼도 연결되어 있지 않았다. 아카이브 2.0 blueprint가 가진 원본 문항 순번/UID가 오답 payload에서 누락되어, 원본 id가 중복될 때 잘못 복원하거나 합칠 수 있었다. 그룹 목록은 파일 기준으로 합치면서 응시 기록 조회에는 표시 제목 일치를 요구하는 불일치도 있었다.

## 수정

- MathJax, QR, 원문 파일 경로를 문서 기준으로 해석한다. QRious 4.0.2와 라이선스를 로컬 vendor로 보관했다. 학생 QR의 목적지는 기존 공개 주소를 유지한다.
- 생성 상태, 경과 시간, 준비 문항 수, 실패 안내, 재시도를 표시한다. 원문/서버 요청의 대기 시간을 제한하고 실패한 렌더로 인쇄하지 않는다.
- 기존 `APNativePrint.printGdi` 도우미로 빠른 인쇄, 부수 선택, 양면 옵션을 연결했다. 실패 시 일반 인쇄 버튼은 사용할 수 있다.
- blueprint 원본 순번과 UID를 학생별/학년/유형 payload와 저장 경로에 보존한다. compact QR에도 원본 순번을 보존한다. 파일/날짜/문항 수가 같은 응시 기록은 표시 제목이 달라도 연결한다.
- 클리닉 해설은 같은 컬럼 폭에서 24문항 단위로 수식을 준비하고 기존 배치/분할 로직으로 이동한다. 다른 출력 엔진은 명시적으로 이 옵션을 켜지 않는 한 기존 경로를 사용한다.
- 시험 목록 위에 전체/1학기 중간/1학기 기말/2학기 중간/2학기 기말 카드와 연도 선택을 추가했다. 학기는 응시 날짜가 아닌 원문 경로/이름 또는 저장된 시험 메타로 판단한다. 처음에는 현재 기간과 해당 기간의 최신 원문 연도를 표시하며, 반별 필터 선택은 저장된다. 분류 불명 시험은 기타 카드로 접근할 수 있다. 전체 선택은 보이는 시험에만 적용한다.

## 검증 결과

- 배포 하위 경로 + 외부 QR CDN 차단: 수정 전 빈 화면 실패 재현, 수정 후 정상 렌더.
- 중3 2학기 중간고사 원본 13파일, 전체 311문항: 문제지/해설지/정답표 생성 PASS. 복원 실패 경고 및 MathJax 오류 없음. 대량 해설은 수분이 소요되었으나 문항 수가 증가하며 완료했다.
- 원문 요청 실패: 이전 문서를 보존하고 오류를 표시하며 인쇄를 차단. 재시도/복구 PASS.
- 진행 중 렌더: 진행 상태 표시, 인쇄 비활성화, 완료 후 활성화 PASS.
- 빠른 인쇄: 인쇄 도우미 호출을 모킹하여 3부/양면/올바른 페이지 영역 전달 및 실패한 렌더의 전송 차단 PASS. 실제 도우미 통신/프린터 용지 출력은 미검증.
- 학생 수신자 2명: 개별 packet QR 및 해설/정답/복습 구성 PASS.
- 원본 id 중복: source ordinal로 복원, QR 왕복 보존, 잘못된 ordinal 차단 PASS.
- 학기/연도 필터: 기본 최신 연도, 기간 변경, 전체 연도, 현재 목록 전체 선택, 재열기 선택 유지, 실제 브라우저 화면 검사 PASS.
- workerd + 로컬 D1: 중3 원본 13개 각각 출제 → 학생 OMR 오답 저장 → blueprint 원본 연결 → 학년 오답 클리닉 생성 → 공개 set payload 재조회 PASS. 운영 학생 데이터는 사용하지 않았다.
- 단위/준비상태/미리보기/문항 연결: 18개 PASS. 공통 출력 생태계: 7개 PASS. 이미지/공유 해설 executor: 13개 PASS. worker 승인 문항 검증: 12개 PASS.

worker 테스트의 자동 조립 fixture는 `AP_ARCHIVE2_TEST_SOURCE_PREFIX=original/high/h1/1final/`로 선택했다. 작업 시작부터 수정되어 있던 별도 고1 기출 파일은 catalog fingerprint와 일치하지 않아 기본 자동 fixture로 사용할 수 없었다. 중3 13개는 자동 조립 승인 여부와 별개인 실제 원본 출제 경로로 모두 검증했다. 로컬 worker에는 Cloudflare Browser Rendering 바인딩이 없으므로 서버 PDF 생성은 예상된 실패이며, 출제/오답/클리닉 저장과 구분했다.

관련 로그/이미지는 `reports/clinic-print-20260928/`에 있다: `browser-results.json`, `browser-full-results.json`, `archive2-d1-runtime.txt`, `unit-tests.txt`, `shared-runtime-tests.txt`, `solution-executor-tests.txt`, `archive2-worker-validation.txt`, `semester-filter.png`.

재실행: 설치된 Playwright를 `AP_PLAYWRIGHT_MODULE`로 지정하고 `node tests/clinic-archive2-print-browser.cjs --full-midterms`를 실행한다. D1 전체 경로는 위 fixture 환경 변수와 함께 `node tests/archive2-worker-runtime.mjs --clinic-m3`로 확인한다.
