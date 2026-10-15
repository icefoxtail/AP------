# AP수학 에듀테크 엔진·문항 DB·사업화 마스터 로드맵

> **문서 버전:** v1.1  
> **작성일:** 2026-10-15 (KST)  
> **문서 종류:** 토론 결과 통합 기록 / 단계별 업그레이드 의사결정 원장
> **Git 추가 기준 main:** 3e043cc72afdbbbc1b77feee97b9f12836a33d35 (작성 시점 스냅샷, 병합 시 SHA 변동 가능)  
> **상태:** `PLANNING_BASELINE` — 본 문서 작성만 완료. 아래 신규 기능 개발·배포가 완료됐다는 뜻이 아님.  
> **참조 저장소:** `icefoxtail/AP------`  
> **대화 중 상세 코드 분석 기준:** `main 90c78874dfcda1366924340d9e7e6b135abb0208`  
> **문서 작성 직전 확인한 최신 main:** `ac992b85fab2daf3fcac8de35567d05904ea2fee` (2026-10-15 14:37 KST경 커밋)  
> **중요:** 최신 main의 변경 내역 전수 감사는 실시하지 않았다. 파일 및 정본 설명을 근거로 한 현황과 실사용 E2E 검증을 구분한다.

---

## 0. 이 문서의 목적·사용 방법

이 문서는 APMS / AP Math OS, JS Archive 2.0, ALIVE 생성문항, RPM Meta, 평가·조판 엔진을 활용한 **수학 학원 사업화와 문항 생산 자동화** 논의를 하나의 장기 기준점으로 보존한다. 새 대화에서 다음 작업을 정할 때 전체 논의를 처음부터 반복하지 않기 위해 사용한다.

- 각 항목은 반드시 **이미 확인된 자산 / 개선 제안 / 아직 구현·검증되지 않은 내용**으로 구분한다.
- 프로젝트 내부 계약이나 기존 Git 정본을 이 문서가 덮어쓰지 않는다. 실제 작업 시 **Notion 「GPT 작업 전 필독 라우터」 → 해당 프로젝트 시작 페이지·생명주기 → 최신 Git main → 작업 대상 코드·정본**을 다시 확인한다.
- 사용자 현재 명시 지시가 프로젝트 내부 기존 관행보다 우선한다. 다만 권한·안전·개인정보 보호 및 수학적 사실 검증은 유지한다.
- 앞으로 사용자가 한 기능의 방향을 확정하면 `§12 결정 원장`에 기록하고, 해당 기능의 `현재 상태 / 수용 기준 / 다음 작업`만 증분 갱신한다.
- 이 문서의 **사업 KPI·비용·기간은 목표 또는 시뮬레이션**이다. 검증된 영업 실적이 아니다.

**현재 추천 다음 한 단계:** `S0` — 기존 JS → 파생 JSON 생성/동등성 검사의 소규모 설계를 고정하고, 원본 2~3개 시험지로 변환·UID·Meta·이미지·해설 왕복 검증 파일럿을 수행한다. 별개로 기존 Meta-first 프로젝트 M0→M5와 작업 의존성을 대조한다.

### 상태 용어

| 표기 | 뜻 |
|---|---|
| `EXISTS_CODE` | 관련 코드·파일이 존재함을 확인. 실제 운영 E2E 완료를 뜻하지 않음 |
| `PARTIAL` | 일부 구현·기능은 있으나 요구하는 연결/정확성이 부족하거나 미검증 |
| `PROPOSED` | 대화에서 제안한 아키텍처·업그레이드 후보 |
| `DECISION_PENDING` | 사용자 최종 설계 선택을 기다리는 항목 |
| `PLANNED` | 개발 단계만 정의됨 |
| `IN_PROGRESS` | 실제 착수했다는 작업 증거 확인 |
| `VERIFIED` | 지정 범위의 구현·테스트·실사용 증거 확인 |
| `HOLD / UNKNOWN` | 근거 부족 또는 실행 차단; 임의 PASS 금지 |

---

## 1. 사업 목표와 전략 (아르곤 원안 → AP수학 현실화)

### 1.1 목표 사업 모델

**포지셔닝:** 단순 교재 반복이나 외부 프랜차이즈에 의존하지 않고, 자체 검수된 수학 문항 및 개인별 학습 기록을 활용하여 학습 변화가 설명 가능한 프리미엄 수학 학원.

**핵심 교육 가치:** `진단 → 처방 → 수업 → 오답/클리닉 → 다른 문항 재확인 → 학부모 리포트`를 연결해, 강사의 지도 판단을 증거로 지원한다. AI가 학생을 단독으로 진단·확정 평가하는 사업이 아니다.

**장기 사업 구조:**
1. **직영 교육 서비스:** APMS+Archive를 실제 수업과 학부모 소통에 활용하여 수강료 매출·재원 유지 성과 검증.
2. **문항·평가 엔진:** 학교별 기출, ALIVE 변형, RPM Meta, 출력 엔진을 공통 평가 상품으로 활용.
3. **향후 B2B/SaaS:** 별도 프로젝트 Academy OS로 확장 가능성을 검토. APMS와 Academy OS는 같은 프로젝트가 아니며 코드·DB·학원 간 데이터를 자동 합치지 않는다.

### 1.2 원안에서 바로 수용하면 안 되는 주장

- **정원 100%**는 목표이며 보장치가 아니다. 강사·교실·시간표에 따른 실수용 정원을 먼저 계산해야 한다.
- **상담 등록 전환율 85%, 영업이익률 45%**는 검증된 실적이 아니다. 사업 가설로만 취급한다.
- **API·서버·검수·유지보수 비용 0원**은 사실이 아니다. 외부 라이선스 비용을 내부 연구개발·운영비로 대체하는 구조다.
- **문항 10초 검수, 품질 100% 보장, 1초 PDF 생성, 수만 문항 1~2개월 제작** 등은 측정·검증 전 홍보 문구로 사용하지 않는다.
- **12주 예상 점수 상승·예상 등급**은 예측 모델을 검증하기 전 수치 보증 금지. 대신 12주 지도계획과 실제 사전/사후 변화 기록을 제시한다.
- 학생 사례 홍보·학부모 커뮤니케이션에 필요한 개인정보·마케팅 동의, 저작권·기출/교재 활용 권리 검토가 필요하다.

### 1.3 100명 목표 예시 — *실적 아닌 가정*

| 분기 | 목표 재원 | 가정한 운영 포인트 |
|---|---:|---|
| Q1 | 30명 | 무료 진단·지역 학교별 분석·초기 등록 |
| Q2 | 60명 | 첫 시험 결과 기반 재등록·소개 |
| Q3 | 85명 | 방학 특강 → 정규반 전환 |
| Q4 | 100명 | 예비 중1/고1 모집·학년 전환 유지 |

예시 월평균 수강료 40만 원: 재원 100명일 때 월 매출 4,000만 원(비용 차감 전). 영업이익률 45%라면 비용 총계가 월 2,200만 원 이하여야 하지만, 실제 인건비·임차료·광고비·세금 성격·운영시간을 산정해야 한다.

**정원 충원 예시 퍼널:** 유효 문의 250명 × 진단 방문 70% × 등록 전환 65% ≈ 114명 신규 등록, 이후 순감 14명 가정 시 연말 100명. 이 숫자는 기획용 시뮬레이션이며 실제 문의·등록 이력으로 지속 보정한다.

---

## 2. 이미 있는 기술 자산과 실제 부족한 지점

| 자산 / 근거 경로 | 기존 역할 | 이번 논의 기준 | 주요 미완·확인 과제 |
|---|---|---|---|
| `apmath/js/classroom.js`, `dashboard.js` | 반·교재별 수업 진도, 일지 | `EXISTS_CODE` | 다른 평가·리포트 연결의 최신 배포/현장 동작 확인 |
| `apmath/js/qr-omr.js` | QR/OMR, 시험 데이터 | `EXISTS_CODE` | 모든 응시의 문항 UID·선택 선지·문항 Meta 결속 확인 |
| `apmath/js/report-center.js`, `report-text.js`, `report-print.js` | 성적·오답·상담 리포트 | `EXISTS_CODE` | 입학진단 사전/사후 시계열, 발송·권한·교사 승인 연결 |
| `apmath/js/clinic-print.js`, `study-material-wrong.js` | 오답·클리닉 자료 | `EXISTS_CODE` | 추천→배부→재시험의 원인 추적 |
| `apmath/student/index.html` | 학생용 포털, 배정 시험·클리닉 | `EXISTS_CODE` | 진단·개인별 추천의 접근권한 E2E 검증 |
| `apmath/worker-backup/worker/schema.sql` | 등록·온보딩·상담·리포트·학부모 연락·메시지 로그 | `EXISTS_CODE` | 입학 전 lead DB와 재원생 전환 링크, 최소 수집 정책 |
| `archive/exams/original/**/*.js` | 검수 대상 기출 JS 원본 | `EXISTS_CODE` | 파생 JSON 무손실 추출 및 자동 동기화 |
| `archive/archive2-core.js`, `archive2-source.js`, `archive/engine.html` | 검색·원본 복원·출력 | `EXISTS_CODE` | JSON 신규 조회 경로가 기존 직접 출력과 동등한지 확인 |
| `archive/data/archive2-catalog.json` | 기출 검색 카탈로그 | `EXISTS_CODE` | Meta 불완전 영역과 UID 연결 검사 |
| `archive/data/generated-lite-consumer/v1/index.json`, `shards/` | 생성문항 JSON 학생용 파생 데이터 | `EXISTS_CODE` | 기출+생성 전체 일관 검색·출제 및 증분 등록 |
| `archive/problem-bank-meta.js`, `problem-bank-search.html` | 공통 Meta 검색·기출+생성 조회 화면 | `EXISTS_CODE/PARTIAL` | 실제 권한·출제·로그·전 학년 E2E/Meta coverage |
| `archive/problem-bank-assessment-recipes.js` | 평가 상품별 선택 기본 Recipe | `EXISTS_CODE` | 실제 Factory 출제·승인·배포 전체 수행 증거 |
| `archive/weakness-aggregator.js`, `weakness-metadata-join.js` | 개념군·유형·템플릿 중심 취약도·메타 연결 | `EXISTS_CODE/PARTIAL` | RPM L3/L4와 구별되는 분류 정합·운영 데이터 검증 |
| `archive/weakness-supplement-preset.js` | 취약점 기반 보강문항 후보 Recipe | `EXISTS_CODE`, 코드상 `non_operational` | 학생 실배부·쓰기·재시험 결과를 연결하는 운영 승격 |
| `archive/weakness-closed-loop.js`, `weakness-student-view.js` | 테스트/읽기 전용 폐루프·학생뷰 계약 | `EXISTS_CODE`, 코드상 비운영 | 실사용 권한·누적 응시·정확한 쓰기 경로 |
| ALIVE A/B/C, R1/R2/R3, SVG assets | 생성·수학 검수·해설·시각자료 | `EXISTS_CODE` | 범용 제약 기반 자동 템플릿 생성과 독립 Solver 연결 |

**주의:** 파일이 있다는 사실은 서비스가 정상 배포·가동된다는 의미가 아니다. 상세 코드 검토의 기준 SHA와 이후 main 증분을 실제 작업 시 재확인해야 한다.

### 2.1 이전 저장 수치의 올바른 사용

2026-10-09 문제은행 인계 문서에서는 **당시** Archive 검색 관련 보고서 554파일/13,194문항, Generated Consumer 346 승인 UID 등을 기록했다. 이 수치는 시점·범위가 있는 역사적 snapshot이다. **오늘의 실시간 정본 전체 문항 수 또는 전부 검수 PASS로 쓰지 않는다.** 원본 기출과 Generated의 UID·범위·중복 기준도 분리한다.

---

## 3. JS와 JSON의 차이, 전체 문항 JSON 전환 논의

### 3.1 개념 정리

- **JS**: 실행 가능한 JavaScript. 현 기출 `window.questionBank` 등 원본 실행·데이터 표현이 결합된 파일.
- **JSON**: 실행 코드 없는 데이터 교환·보관 형식. 단독으로 Solver나 SVG 생성 함수를 실행하지는 못한다.
- 수식 LaTeX, 이미지/SVG 경로, Meta, 정답·해설은 두 방식에 모두 표현할 수 있다. **JSON으로 바꾼 것만으로 문항 품질이 향상되지 않는다.**

### 3.2 이번 논의에서 나온 권장 구조 — `PROPOSED`, 최종 정본 전환 미확정

```
기존 JS 원본 (변경하지 않음)
   └─ 안전한 추출기/검증기
        ├─ 문항별 표준 JSON record (UID·출처·정답·해설·Meta·asset ref)
        ├─ 검색·출제용 JSON shards + 통합 UID index
        └─ 동등성·출처 SHA·증분 rebuild receipt
                               ├─ 교사 Compose / Factory
                               ├─ APMS OMR / 클리닉
                               └─ AI 생성·분석 입력
```

- **논리적으로는 모든 문항을 UID 단위 JSON record로 분리**한다. 물리적으로 문항 하나당 파일 하나를 만들 필요는 없다. 샤드/인덱스 구조가 적절할 수 있다.
- **기출 JS·생성 source는 원본 단일 authority로 보존**한다. JSON은 자동 생성되는 파생 DB; 사람이 양쪽을 따로 수정하지 않는다.
- 이미 JSON Consumer가 있는 Generated는 중복 복사보다 기존 shard 참조와 공통 projection 재사용을 우선 검토한다.
- 언젠가 JSON을 주 정본으로 전환하려면 별도 의사결정과 **원본 출력·정답·해설·에셋·권한 완전 동등성 검증**이 선행되어야 한다.
- 수학 템플릿 엔진의 내부 Recipe/파라미터는 JSON spec + JS/Python 실행 코드로 분리할 수 있다.

### 3.3 문항 JSON 논리 스키마 초안 (기존 정본 필드와 매핑 후 고정)

```json
{
  "uid": "기존-UID-그대로",
  "sourceKind": "original",
  "sourceFile": "exams/original/기존-파일.js",
  "sourceOrdinal": 17,
  "school": "예시학교",
  "year": 2025,
  "content": "문항 발문 원문",
  "choices": [],
  "answer": "기존 정답",
  "solution": "기존 해설",
  "assets": {
    "problem": [],
    "solution": []
  },
  "meta": {
    "standardCourse": "기존 과목 키",
    "standardUnitKey": "기존 표준단원 키",
    "subUnitKey": "기존 세부단원 키",
    "rpmL1": null,
    "rpmL2": null,
    "rpmL3": null,
    "rpmL4": null,
    "rpmL4Namespace": null,
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": null,
    "level": "중",
    "difficultyBucket": null
  },
  "quality": {
    "reviewStatus": "UNKNOWN",
    "studentEligible": false,
    "evidenceRefs": []
  },
  "provenance": {
    "sourceSha256": "실제-계산값으로-치환",
    "metaRevision": "실제-버전으로-치환"
  }
}
```

> **예시 데이터이며 실제 문항이 아님.** 위 `null`, `[]`, 문자열은 스키마 설명용이다. 실제 자료의 누락/미적용을 판단 없이 `null`이나 `NONE`으로 확정하지 않는다. `studentEligible:false`는 기본 차단 예시이며 승인/실사용 자격은 기존 계약을 따른다. 특히 Generated `l2` 물리 저장 버킷과 RPM semantic `rpmL2`는 동일시하지 않는다.

### 3.4 JSON 변환의 종료 조건

1. 원본 문항 inventory 확정: 파일 수·문항 수·문항 순서·UID 결속.
2. 발문·보기(객관식 5선지 포함)·정답·해설·문항/해설 이미지·SVG/수식의 손실·값 변형 0.
3. 동일 문항 UID·sourceOrdinal·SHA 및 Meta authority 상호 대조; 검수 증거와 변경 시점 보존.
4. 기출/Generated 중복 또는 서로 다른 UID가 한 문항으로 합쳐지는 사고 방지.
5. 원본 JS 직접 선택·미리보기·정답·해설·인쇄 회귀 0.
6. 사람이 JSON을 수동 수정하는 drift 방지; 소스 변경 시 **변경된 shard만** 증분 빌드.
7. 추출 실패 문항은 `CONVERSION_ERROR`로 분리·보고; 내용 추정·자동 삭제 금지.
8. 2~3개 대표 시험지 파일럿 성공 뒤 전체 inventory로 확대; 전체 재변환 후 검증이 실제 끝난 경우에만 `COMPLETE` 선언.

---

## 4. AI 문항 생산·품질 보장 전략

### 4.1 핵심 구분: TWIN vs ALIVE

| 트랙 | 목적 | 자동화 수준 제안 | 주요 품질 기준 |
|---|---|---|---|
| **TWIN / 수치 변형** | 검증된 원본의 동일 핵심 사고를 다른 수치로 반복 | 승인된 템플릿에서 결정론적·제약 기반 자동 생성 | 정답·선지·조건·풀이 경로·교육과정 유지 |
| **ALIVE A/B/C** | 추가 조건·사고 전환·후속·심화 문제 설계 | AI 설계 + 기존 검수 프로토콜 중심 | 최종 발문 자연성, 추가 사고의 정당성, 원본 Primary 유지 |

**중요:** A/B/C 위치 자체로 level/난이도를 자동 지정하지 않는다. 생성 후보량은 승인 가능 문항 수와 다르며 `yield = 승인 건수 / 생성 후보 건수`를 측정한다.

### 4.2 생성 파이프라인 제안

```
원본·검수된 문항 선정
  → 수학적 불변량 / 자유 변형변수 분석
  → Template Spec(풀이 경로·오류 경로·허용 범위)
  → 제약을 충족하는 parameter 생성(정수·유일성·범위·미묘한 퇴화 방지)
  → 정답 독립 Solver / 경계값 / 복수정답·선지 검사
  → 해설 단계·교육과정·출제 의도 확인
  → SVG 좌표·라벨·뷰포트·브라우저 렌더 확인
  → 전문 검수·수정 / 증거+UID 봉인
  → 승인 문항만 Consumer·통합 JSON projection·출제 풀로 공급
```

### 4.3 품질 판정의 5축

1. **수학:** 문제 조건의 정합성, 정답·모든 오답 선지·정답 수, 분모 0·경계값·특수값 검산.
2. **교육과정:** 학년/학기 허용 풀이, 실제 학생이 따라갈 수 있는 계산 과정.
3. **출제 의도:** 원본 핵심 사고/필수 풀이 단계 보존. 숫자만 달라도 난이도·수학적 구조가 바뀔 수 있음.
4. **Meta:** RPM L1~L4, CrossConcept/Condition/Integration/PT/TPL, level vs difficultyBucket 별개 판정, 출처·UID·변형 관계.
5. **시각·조판:** 문제/해설 SVG 구분, 점·직선·그래프 좌표, 라벨, 잘림, 실제 인쇄/브라우저 안정성.

**구조 validator/계산 엔진 결과 = 수학·교육과정·학생 친화 품질의 100% 증거가 아니다.** 실제 고난도 문항은 별도 전문가 검토를 필요로 한다.

### 4.4 아르곤 템플릿 예제에서 발견한 결함(파일럿 체크리스트)

- 교점 x좌표 `alpha<0<beta`를 먼저 고른 뒤 계수를 역산하는 **Backward Design 자체는 유효한 출발점**.
- 예제는 `alpha+beta !== 0` 조합 12개 중 8개가 가짜 보기와 중복됨(파라미터 `a,m,n`과 무관). 즉 예제의 허용 조합 **2/3가 선지 유일성에서 실패**. 생성 실패 후 재시도 상한·후보 폐기·원인 집계가 없다.
- 포물선·직선 교점의 **y좌표가 viewBox 계산 입력에서 누락**되어 그림이 잘릴 수 있다.
- 오답은 단순히 답과 수치 중복이 없다는 것만으로 학생의 실제 오류 경로를 증명하지 못한다.
- `alpha`, `beta`가 정수이고 판별식이 맞더라도 원래 발문에서 요구한 풀이 방법·인지 난이도가 동일하다는 보장은 없다.
- 무한 재귀 재생성, 난수 시드 미보존, 경계값·중복 가족 검사 부재도 개선 대상.
- “10~15초 빠른 승인”은 자동 검산과 템플릿 인증이 충분히 축적된 후 **측정할 실험 지표**이지 보장된 작업시간이 아니다.

### 4.5 자동 생성 엔진 파일럿 우선 유형 — `PROPOSED`

- **유형 A:** 이차방정식 정수근·인수분해·근과 계수 관계(교육과정 적합 학년 확인).
- **유형 B:** 이차함수와 직선의 교점·위치관계(SVG 파라미터화 검증).
- 대표 원본 2~3개의 Template Spec부터 제작; 대량 생성 대신 template-level 승인·candidate yield·수학/렌더 실패 종류 측정.

---

## 5. APMS × Archive 데이터 브릿지

### 5.1 목표 데이터 흐름

```
학교별 문항 UID + 신뢰 가능한 Meta
       ↓
입학 전 lead_id 발급 → 진단 응시 attempt_id / 각 문항별 응답
       ↓
정오답·선택 선지 / sourceUid / 유형·난이도 연결
       ↓
취약 영역 후보 산출(표본 수, 난도, 근거 수준 함께 표시)
       ↓
강사 확인 후 클리닉 UID 선정·배부
       ↓
독립 재확인 응시 / 도움 여부 / 최초 대비 결과
       ↓
APMS 학습 이력 + 리포트에 근거 링크
       ↓
등록 시 lead_id ↔ student_id 관계 연결(기록 덮어쓰기 아님)
```

### 5.2 필수 키와 테이블 설계 후보 (`PROPOSED`, DB migration 아님)

| 데이터 개체 | 최소 식별자 | 보존할 핵심 속성 |
|---|---|---|
| Lead | `lead_id` | 문의·진단·동의·유입 경로, TTL/삭제 정책 |
| Student link | `lead_id` + `student_id` | 등록 시 매핑 날짜·원천·승인자, 기존 학습이력 유지 |
| Assessment | `assessment_id` / `paper_id` | 문항 UID 순서, 출제/검수 버전, 목적/범위 |
| Attempt | `attempt_id` | lead 또는 student, 시점, 문항별 응답·선택 선지, 제출 상태 |
| Attempt item | `attempt_id` + `question_uid` (+ 출제 위치) | 정답 여부, 채점 근거, 해당 시점 문제지·메타 스냅샷 |
| Intervention | `intervention_id` | 최초 오답과 연결된 보강 개념·문항 UID·강사 확인 |
| Recheck | `recheck_attempt_id` | 다른 문항 재확인, 도움 사용, 결과·일시 |
| Report | 기존 APMS 리포트 ID | 표시할 분석 집계·근거 참조·교사 승인·발송 이력 |

**구조화된 응시·클리닉·재확인 원자료를 `student_report_archives` 하나에 우겨 넣지 않는다.** 리포트 테이블은 학부모용 결과/스냅샷과 근거 참조를 보관하는 역할이 적절하다. 기존 APMS DB/API와 중복 테이블은 만들지 않고 field map을 먼저 확정한다.

### 5.3 취약점 분석 구현 주의

- 기존 `weakness-aggregator.js`는 `concept / problemType / template / standardUnit` 그룹 기반. 이것을 곧바로 완전한 RPM L3/L4 진단이라고 부르지 않는다.
- 점수와 시도 수·최근성·반복 실패·회복 기록을 함께 보여 주며, 데이터 부족한 차원은 `UNKNOWN` 표시.
- `weakness-supplement-preset.js`는 현재 코드에 `exposure: non_operational`, `noDbWrite: true`, `noStudentExposure: true`가 있다. 테스트 fixture의 PASS는 실제 학생용 자동 배부 PASS가 아님.
- 1차 오답 복습과 2차 **새 문항·독립 해결**을 분리해야 진짜 학습 회복을 평가할 수 있다.
- 맞힌 후에도 해설을 보고 해결했는지/힌트를 썼는지를 구분해야 한다.

### 5.4 학부모 리포트 최소 상품

- **입학 직후:** 확인된 강점, 취약 영역 Top 3, 12주 보강 계획(예상 점수 보장 금지).
- **주간:** 진도, 과제/출결, 완료한 보강, 다음 주 행동 1~3개.
- **월간:** 동일하거나 비교 가능한 평가 간 최초→중간→재확인 변화, 표본 수·난이도 차이 주석.
- **운영 원칙:** 교사 승인 후 공개. 외부 홍보에 학생별 리포트·성적을 사용하려면 별도 동의·비식별화 검토.

---

## 6. 첫 90일 사업화·제품 연동 실행안 — 계획일 뿐 실행 착수 아님

| 기간(상대) | 범위 | 완료 조건 | 상태 |
|---|---|---|---|
| W1–W2 | JS/JSON/Meta/APMS field map, 기존 UID·응시 데이터 표본, 권한 정책 | 기술 설계 + 파일럿 원본 2~3개 동등성 확인 | `PLANNED` |
| W3–W4 | 입학 진단 15~20문항·OMR 연결·상담용 리포트 | 실사용 파일럿에서 시험지→응시→문항별 결과→리포트 연결 | `PLANNED` |
| W5–W6 | 취약 유형 분석 + 보강 문항 후보 제시 | 선정 근거·강사 수정·배부 이력 추적 | `PLANNED` |
| W7–W8 | 재확인·주간/월간 리포트 | 원오답→지도→새 문항 확인 이력 보존 | `PLANNED` |
| W9–W10 | 문의·상담·등록 퍼널과 지표 | lead→학생 전환, 전환율·미등록 사유 조회 | `PLANNED` |
| W11–W12 | 위험 신호 알림·대시보드 소규모 시범 | 알림마다 사실 근거·교사 조치 이력·권한 확인 | `PLANNED` |

기존 Meta-first 정본의 `M0→M5`가 실제 기술 의존성이다. 필요 범위와 우선순위를 구분해 병행하거나 선행한다. 새로운 대시보드만 먼저 만드는 것은 데이터 기반 없이 껍데기를 만드는 위험이 있다.

---

## 7. 신규 개발 우선순위: 단계별로 하나씩 확정

| ID | 단계명 | 핵심 결과물 | 선행 관계 | 현재 상태 |
|---|---|---|---|---|
| **S0** | JS→JSON 무손실 파생화 파일럿 | canonical field map, 추출기, 동일성·SHA 보고서 | 최신 Git/Meta 계약 조회 | `PROPOSED / NEXT` |
| **S1** | Meta 통합·영구보존 | Source→Consumer→projection field parity, unknown 격리 | 기존 M0~M5와 합의 | `PARTIAL` (기존 코드 존재, 전체 완료 미인증) |
| **S2** | APMS 문항 UID·응시 브릿지 | paper/attempt/item mapping + 읽기/쓰기 권한 | S0/S1 최소 데이터 계약 | `PROPOSED` |
| **S3** | 입학 정밀진단 MVP | 시험지, OMR, 교사 검토 리포트 | S2 | `PROPOSED` |
| **S4** | 클리닉·재확인 폐루프 | 추천→배부→재시험 근거 | S2/S3 | `PROPOSED` |
| **S5** | TWIN Template 2~3개 | Constraint+Solver+해설+SVG+approval recipe | S0/S1, 검수 원본 | `PROPOSED` |
| **S6** | 자동 생성·검수·등록 | 수율 계측, 승인된 UID만 출제 pool | S5 | `PROPOSED` |
| **S7** | 학부모·상담 CRM·유지 관리 | 리포트 시계열, 전환·유지 KPI | S3/S4 | `PROPOSED` |
| **S8** | B2B Academy OS 검토 | 독립 학원 데이터 격리·비용모델 | 직영 검증 성과 | `FUTURE` |

### S0 첫 번째 작업을 요청할 때 쓰는 실행 범위

**범위:** 기출 JS 2~3개(객관식·도형·해설 SVG 각각 포함)를 선정해 실제 schema 및 UID 대응을 설계하고, JSON으로 무손실 추출하며, 원본과 변환본의 내용·에셋·출력 동등성을 검증한다. 대상 이외 JS 내용은 변경하지 않는다.

**산출물:** field map MD, 변환기/테스트(필요한 경우), 원본↔JSON parity 결과, 미지원 구문·Meta 결손 목록, 확장 전 권장 구조.

**검증:** 유효한 원본에서 성공 / 해설·SVG 누락·중복 UID 등에 실패해야 함 / 기존 Archive 화면·원본 출력 회귀 없음. 실제 수행하지 않은 테스트는 `NOT_TESTED`로 기록.

**중요:** 파일럿은 곧바로 전수 변환 승인이나 JSON 정본 전환을 의미하지 않는다.

---

## 8. 출시·개인정보·지적재산·운영 비용 가드레일

- 원본 학교 기출/시중 교재 문항의 권리·이용범위를 검토한다. 단순 수치 변형만으로 제3자 저작물을 자유롭게 재배포해도 된다고 가정하지 않는다.
- 미성년자·학부모의 개인식별정보 및 학습 데이터 수집 최소화, 접근권한 분리, 보유/삭제 기한, 진단 신청·마케팅 수신 동의를 분리한다.
- APMS 학생 데이터·학부모 연락처는 모델 훈련이나 제3자 SaaS에 자동 이전하지 않는다.
- 개인정보 포함 원자료를 Git의 공개 정적 파일 또는 JSON shard에 저장하지 않는다. 문항 DB와 개인별 채점/리포트 DB는 분리한다.
- 자동 생성과 시험지 수정에서 UID/source SHA/승인 증거 보존, 감사 로그, 구버전 freeze 보호.
- 승인된 데이터만 학생용 검색·출제 후보로 공급. 검증 미완전 Meta는 강사 직접 사용 자격과 자동 평가상품 자격을 구별한다.
- 배포 성공, 브라우저 실제 조회, 수학검수 PASS, 사용자 지시 승인, API/DB 마이그레이션 상태는 서로 다른 증거다.
- 비용: LLM/API, 서버/스토리지, 인건비(원장 포함), QA, 저작권·법무, 보안·장애 대응, 광고·수납/결제 비용 등 항목별 산정.

---

## 9. 운영 KPI — 반드시 측정하여 가설을 수정할 항목

### 9.1 교육/콘텐츠
- 시험지당 출제 소요 시간 / 수정 횟수 / 오답 검수 오류 발생률.
- JSON 추출 성공률, UID 동등성/Meta retention 실패 비율, 변환 후 렌더 회귀 건수.
- 자동 생성 candidate → validator PASS → 전문 승인 → 배포 가능 **각 단계 수율**.
- template당 개발·검수 시간 / 실제 사용 회수 / 문항당 한계비용.
- 초기 오답 → 도움 없이 **다른 문항 재확인** 성공률, 같은 오류 재발률(표본·난이도 보정).

### 9.2 사업/모집
- 유효 문의·방문·진단·상담·등록·재등록 건수 및 전환율.
- 학부모의 리포트 열람·상담 반응(동의자만), 소개 등록 경로.
- 월 신규/이탈/재원/반별 실제 수용 정원·강사 시간 대비 지도량.
- 월매출·직접비·간접비·강사비·개발/운영비·실질 영업이익률.

---

## 10. 기존 프로젝트 실행 정본과 충돌하지 않게 유지할 사항

1. 실제 Git 정본의 **물리 Source와 검색 Projection 분리** 원칙 우선. 이 문서는 JSON 전체 추출을 사업화 후보로 제안하는 것이지 원본 위치·UID·정본을 바꾸라는 작업 지시가 아님.
2. 기존 Meta-first 구현 순서 **M0 기존 필드 매핑 → M1 신규 Meta 영구보존 → M2 레거시 근거 기반 backfill → M3 기출/Generated 통합 검색 → M4 Factory 4종 Recipe → M5 증분 인덱싱**과 중복되는 개발을 새로 만들지 않는다.
3. 기존 JS `level=하/중/상`과 `difficultyBucket=1..5`는 독립 판정. `rpmL2`와 Generated 소비자 `l2` 저장 버킷도 별개.
4. 학생 권한과 강사 검색/직접 출제 자격은 별도. `UNKNOWN`, `NONE`, `[]`, `HOLD`를 서로 섞지 않는다.
5. 기존 R1/R2/R3·ALIVE 생성 및 검수·Library 예약 인계·Git 출고 흐름을 새 사업화 로드맵이 자동으로 변경하지 않는다. 변경이 필요하면 해당 작업을 별도로 명시한다.

---


## 10-A. 앞으로의 원본·유사문항 저장과 JSON 동기화 운영안 — v1.1 신규 기록

> 2026-10-15 / **PROPOSED·DOCUMENTATION_ONLY**. 이 장은 기존에 논의한 설계 방향이다. 구현, 품질승인, 예약라인 변경, 자동출고 또는 배포 완료를 의미하지 않는다. 기존 문제은행 Meta-first 정본과 최신 Git 구현을 우선한다.

### A. 새로운 학교 기출 원본 저장

1. 학교 시험지 원본·원본 그림을 확보하고 현행 JS Archive 형식으로 발문·전 보기·답·학생용 해설·필수 문제/해설 SVG를 만든다.
2. 원본과 신규 Meta(UID, sourceQid, L1~L4, level, difficultyBucket, PT/TPL, 조건/연결개념, 승인 evidence)를 연결하고 해당 기존 CREATE/R1/R2/R3 또는 별도 명시된 검수 절차를 수행한다. 기존 유효 PASS 재사용, 영향 UID 표적 수리 원칙을 유지한다.
3. GPT 예약은 기존 Library 누적 인계 후 별도 Work/Codex 출고 담당이 완료된 JS·필수 에셋을 main으로 출고한다. 개별 예약 단계에서 Git writer/PR을 새로 요구하지 않는다. 수동 제작 경로는 명시된 종료 조건을 따른다.
4. **추가 구현 목표:** Git main에 실제 반영된 승인된 Source를 기준으로 UID·ordinal·Meta·문항 내용·image/SVG·SHA parity를 검사하고 통합 JSON shard/index를 자동 갱신한다. 동기화 실패는 실패 문항·이유만 격리하고 기존 정상 소스와 배포 데이터를 보존한다.

### B. 앞으로 유사·변형문항 생성

| 트랙 | TWIN — 단순 수치·동형 변형 | ALIVE A/B/C — 사고·조건 확장 |
|---|---|---|
| 목표 | 원본 Primary 개념과 필수 풀이 경로 유지 | 원본 핵심 사고에 유의미한 추가 판단 부여 |
| 제작 | 검증된 Template + Constraint + Solver + 실제 오답 경로 + 필요시 파라미터 SVG | 기존 GPT 불변량·Blueprint·역산·역발문·오답 4개 근거·SVG 제작 |
| 구현 상태 | **범용 자동화 엔진은 PROPOSED** | **현행 제작·검수 체계 존재** |
| 승인 | 후보량과 승인 문항 수 분리, 생성 건별 수학/선지/해설/도형 검증 및 사람 품질 확인 | 기존 생성문항 검수·Meta·Consumer/학생 기술 검증 절차 |
| 식별 | 기존 원본과 다른 생성 UID, parent source UID/variant family/revision | 기존 ALIVE UID/sourceQid/family/revision/approval 연결 |

- 원본 하나에서 TWIN 3개와 ALIVE 9개를 만드는 것은 **설명 예시일 뿐 자동 할당량이 아니다**. A/B/C에 level/난이도를 기계 배정하지 않는다.
- 정답 계산 일치만으로 출제 의도·교육과정·5지 오답의 실제 오류 계산·SVG 렌더 품질이 보장되지는 않는다.
- 원본과 Generated의 물리 Source를 섞거나 원본 UID를 재발급하지 않는다. 생성문항은 고유 UID로 원본·파생 가족·타입·승인 이력에 연결한다.

### C. 통합 JSON DB의 위치와 역할

- **JS 및 기존 Generated source = 계속 권위 있는 원본. JSON = 자동 생성되는 검색·분석·출제용 파생 데이터.** 사람이 JS와 JSON을 각각 수정하는 이중 정본을 만들지 않는다.
- 논리적으로 UID별 record를 사용하되 물리적으로 1문항 1파일 강제 없이 shard/index 형태로 운영한다. 현행 Generated Consumer JSON을 재사용하고 중복 전체 복제 금지.
- JSON에는 문항 본문·보기·답·해설·asset reference·RPM L1~L4·조건·난이도·정확한 source SHA/quality status를 보존한다. UNKNOWN을 가짜 NONE으로 채우거나 Generated 저장 bucket의 l2를 RPM L2로 간주하지 않는다.
- 승인된 문항만 적절한 학생 출제 풀에 공급하고, 교사 직접 출제와 검증된 Factory 자동평가의 eligibility를 구분한다.
- APMS는 문항 UID를 응시/답안/보강·재확인 이력에 연결하되 학생 개인정보를 공개 문항 JSON에 저장하지 않는다.
- 기존 시험지 원본 직접 열기, exam/solution/answer 출력, frozen paper·과거 학생 응시를 JSON 동기화 때문에 변형하지 않는다.

### D. 개발 단계와 완료 조건

| 우선 | 작업 | 완료 증거 |
|---|---|---|
| S0 | 기출 2~3개 JS→JSON 무손실 파생 파일럿 | 문항 수·순서·모든 보기·답·해설·이미지/SVG·UID·SHA 완전 동등성과 기존 출력 회귀 |
| S1 | 기존 Meta-first M0→M5와 파생 JSON 계약 통합 | Source/Consumer/index 정확한 Meta 보존·UNKNOWN 구분 |
| S2 | 승인 후 JSON 증분 동기화 | 승인 Source 변경·철회 시 UID별 갱신, 미승인/HOLD 제외, 원격 읽기/렌더 확인 |
| S3 | TWIN 핵심 2~3유형 파일럿 | 템플릿 제약·독립 검산·오답 실제 오류경로·SVG 좌표 및 수율 측정 |
| S4 | 기출/TWIN/ALIVE 통합 활용 | 교사 검색·선택·출력, APMS 문제별 채점/클리닉 연결 실사용 확인 |

**이번 Git 반영:** 문서 1개 신규 추가만. JS, Meta, DB, API, 검수도구, 예약, CI, 학생배포는 변경하지 않음.

---

## 11. 아직 결정하지 않은 설계 질문 (선택 전 코딩 금지)

| 질문 ID | 선택지 / 검토 관점 | 현재 제안 |
|---|---|---|
| Q01 | JSON을 **파생 데이터**로 운영할지, 장기적으로 JS를 대체할 **정본**으로 둘지 | 우선 파생 JSON, 정본 변경은 별도 결정 |
| Q02 | 전수 JSON의 저장 단위 | 논리 문항별 record + 물리 shard/index를 우선 검토 |
| Q03 | JS→JSON 추출 방식 | 안전한 AST/전용 parser 또는 기존 신뢰 가능한 로더 재사용. 임의 JS 평가·실행의 보안 위험 검토 |
| Q04 | 학부모 리포트 공개 채널 | 기존 APMS 메시지 체계 재사용 여부 및 정보보호 검토 |
| Q05 | 진단 범위/학년 | 실제 모집 대상 학년·학교를 정한 후 검증된 문항 pool 지정 |
| Q06 | 수학 Solver 선택 | JS 정수/유리수 전용 vs Python SymPy; CI/운영환경 비용 비교 |
| Q07 | TWIN 자동 승인 범위 | template 자체 인증 후 생성물 전건 기계검증 + 표본 전문 검토 vs 모든 생성물 전문가 승인 |
| Q08 | 유료 B2B 공급 | 직영 운영 성과·권리·지원비 검증 후 별도 결정 |
| Q09 | 전체 변환의 출처/자산 정책 | 원본 보존 및 정책·권리 검토, 기존 Generated shard와 중복 방지 |

---

## 12. 결정 원장 (이후 반드시 갱신)

> `CONFIRMED_USER`는 사용자가 명시적으로 채택한 결정에만 사용한다. 대화에서 AI가 좋다고 평가한 내용은 사용자 지시가 없는 한 `RECOMMENDED`다.

| ID | 날짜 | 내용 | 상태 | 근거/다음 확인 |
|---|---|---|---|---|
| D-001 | 2026-10-15 | 기존 APMS·JS Archive 기술자산을 살려 아르곤 원안을 보완·사업화 방향을 검토 | `DISCUSSION_DIRECTION` | 본 대화 사업계획 비교 |
| D-002 | 2026-10-15 | JS 문항 **전체를 JSON으로 변환해 별도 저장**하는 구상을 사용자 제기 | `USER_PROPOSED` | 정확한 정본·동기화 정책은 추가 확정 필요 |
| D-003 | 2026-10-15 | 기존 JS 원본 유지 + 파생 JSON shard/index 생성 | `RECOMMENDED` | 현재 Git Source·Projection 계약과 정합 |
| D-004 | 2026-10-15 | TWIN 결정론적 변형과 ALIVE B/C 고난도 사고 변형의 품질 트랙 분리 | `RECOMMENDED` | 구현·검수 scope 확정 필요 |
| D-005 | 2026-10-15 | P0 기반(JSON·Meta·UID 연결)을 입학진단·고급 생성보다 먼저 검토 | `RECOMMENDED` | 단계별 실제 착수는 미지시 |
| D-006 | 2026-10-15 | 이번 대화를 업그레이드용 단일 Markdown으로 보존 | `CONFIRMED_USER` | 본 문서 v1.0 생성 |

| D-007 | 2026-10-15 | 원본 JS/Generated 원본 보존 + 검증된 파생 JSON 자동동기화·TWIN/ALIVE 분리 방향을 차기 업그레이드 제안으로 기록 | RECOMMENDED | §10-A, 별도 구현 승인 전에는 문서만 |
| D-008 | 2026-10-15 | 마스터 로드맵을 Git에 저장해 향후 단계별 업그레이드 기록 유지 | CONFIRMED_USER | PR 및 main readback으로 실제 저장 확인 |

### 다음 결정 추가 양식

```md
### D-XXX — YYYY-MM-DD — [결정 제목]
- 요청/문제:
- 비교한 대안:
- 최종 선택 및 선택 주체:
- 적용 범위 / 비적용 범위:
- 기존 코드·정본 영향:
- 필요한 검증:
- 완료 조건:
- 연결 PR/commit/artifact:
- 상태: PROPOSED | CONFIRMED_USER | IMPLEMENTED | VERIFIED | SUPERSEDED
```

---

## 13. 업그레이드 실행 기록 양식

한 번에 한 소기능을 정한 뒤 아래 항목을 복사해 기록한다.

```md
### U-XXX — [작업명]
- 날짜/담당:
- 사용자의 정확한 지시:
- 시작 기준: Notion router / 프로젝트 lifecycle / Git main SHA
- 변경 대상 파일·UID·API:
- 재사용할 기존 구현:
- 작업 전 데이터·품질 위험:
- 구현 범위(무엇을 하지 않는지도 명시):
- 실제 변경 내용:
- 수행한 최소 검증/결과:
- 실제 브라우저·DB·배포 확인 범위:
- 결과 파일/PR/commit/sha:
- 남은 문제 / 다음 한 단계:
- 상태: NOT_STARTED | PARTIAL | HOLD | VERIFIED
```

---

## 14. 출처·재검증 진입점

### Notion
- [GPT 작업 전 필독 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)
- [APMS / AP Math OS 시작 페이지](https://app.notion.com/p/3e10e68bd69f81758c4af4f88ade1c17)
- [Archive 2.0 / JS Archive 시작 페이지](https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398)
- [Archive 전체 작업 생명주기](https://app.notion.com/p/3e10e68bd69f81fdb161ffc3f6227b6e)
- [Archive 2.0 단계별 제품 확장 로드맵](https://app.notion.com/p/3e30e68bd69f81ed8c1ff01f752335d1)

### GitHub
- [현재 저장소 main](https://github.com/icefoxtail/AP------/tree/main)
- [문제은행 프로젝트 Meta-first 인계 정본](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/Problem_Bank_Project_Master_Handoff_And_Roadmap_CURRENT.md)
- [공통 Meta 및 평가상품 연결 계약](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/Problem_Bank_Unified_Meta_Assessment_Contract_CURRENT_v1.md)
- [문항 물리 저장·분류·조회 정본](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/Problem_Bank_Storage_And_Retrieval_Current_v1.md)
- [Weakness aggregator](https://github.com/icefoxtail/AP------/blob/main/archive/weakness-aggregator.js)
- [Weakness supplement preset](https://github.com/icefoxtail/AP------/blob/main/archive/weakness-supplement-preset.js)
- [문제은행 검색 화면](https://github.com/icefoxtail/AP------/blob/main/archive/problem-bank-search.html)
- [APMS 리포트 센터](https://github.com/icefoxtail/AP------/blob/main/apmath/js/report-center.js)
- [APMS DB 스키마](https://github.com/icefoxtail/AP------/blob/main/apmath/worker-backup/worker/schema.sql)

**소스 유의:** 링크는 움직이는 `main`을 가리키므로 개별 구현 시 반드시 commit SHA를 고정하여 비교한다. 과거 문서의 '현재' 숫자는 해당 문서의 측정 시점에 한정된다.

---

## 15. 변경 이력

| 버전 | 날짜 | 변경 | 코드·배포 변경 |
|---|---|---|---|
| **v1.1** | **2026-10-15** | 신규 원본·TWIN/ALIVE 유사문항 저장 및 JSON 자동 동기화 제안, Git 최초 등록 | **문서만 변경·코드/배포 없음** |
| **v1.0** | **2026-10-15** | 아르곤 원안/보완안, APMS×Archive 연계, JS/JSON 비교, 통합 JSON 제안, TWIN/ALIVE 품질·SVG 문제, 사업 KPI 및 단계별 업그레이드 방향을 하나로 문서화 | **없음 — 문서 작성만 수행** |

---

## 16. 다음 대화에서 사용할 시작 문구

> **“AP수학 마스터 로드맵 v1.1의 S0부터 검토하자. 우선 최신 Notion 라우터·Git main을 확인하고 현재 JS→JSON 추출 경로와 겹치는 개발을 찾아서, 파일럿의 최소 작업·검증·완료조건만 확정해 줘. 아직 승인하지 않은 전체 전환이나 운영 변경은 하지 마.”**

**문서 작성 완료 ≠ S0~S8 개발 완료.** 이 문서는 단계별 결정을 축적할 수 있는 기준점이다.