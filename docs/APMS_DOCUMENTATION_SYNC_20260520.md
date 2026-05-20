# APMS_DOCUMENTATION_SYNC_20260520

## 1. 점검 범위

이번 문서 업데이트는 사용자가 제공한 `docs.zip`과 `apmath.zip` 기준으로 진행했다.

확인 대상:

```text
docs/
apmath/
apmath/js/
apmath/student/index.html
apmath/planner/index.html
apmath/worker-backup/worker/routes/
apmath/worker-backup/worker/migrations/
```

## 2. 코드 기준으로 확인한 최신 반영 상태

### 성능 Round

```text
Round 1: a9c6bae Optimize APMS core report dashboard performance
Round 2: fe987a5 Optimize APMS classroom clinic performance
Round 3: 3b29b6d Optimize APMS student planner performance
```

현재 코드에는 다음 성능 보정 흐름이 반영되어 있다.

```text
core.js:
- apmsBuildDataIndexes()
- apmsGetDataIndexes()
- apmsInvalidateDataIndexes()
- 학생/반/출결/숙제/시험/상담/오답/blueprint 조회 보조 인덱스

classroom.js:
- 반 학생 조회, 오늘 출결/숙제 map, 학생 행 부분 갱신에서 공통 인덱스 helper 사용
- 출결/숙제 낙관 갱신 후 stale cache 방지

clinic-print.js:
- 반 학생, session별 오답, blueprint 조회에서 공통 helper 우선 사용

dashboard.js / cumulative.js / report.js:
- Round 1 기준 반복 find/filter 일부를 공통 helper와 Map 기반 흐름으로 보정

student/index.html:
- 학생 포털 homeData / OMR 데이터 인덱스 캐시 추가

planner/index.html:
- plannerIndex, 날짜별 plan map, upsert/patch/remove 기반 부분 상태 갱신
- 타이머, 뒤로가기, 30/45/60분 선택, 진동 피드백 반영

planner.js:
- POST 응답에 생성 plans 추가
- PATCH 응답에 수정 plan 추가
```

### 리포트 화면

`apmath/js/report.js` 기준으로 리포트 상단에는 발행일/시험날짜 표시 대신 선생님/학부모 사인란 구조가 반영되어 있다.

```text
- 발행일 표시 없음
- 시험날짜 표시 없음
- 오른쪽 상단 선생님/학부모 사인란
- 시험명은 학생 정보 밴드 오른쪽에 유지
```

### 시간표

`apmath/js/timetable.js` 기준으로 시간표는 별도 성능 Round에서 제외했으며, 기존 새학기/개편안/staging 구조를 보존한다.

```text
- TIMETABLE_RENDER_CONTEXT 기반 렌더링 캐시 존재
- 운영 시간표와 draft/개편안 모드 분리
- 학생 drag payload와 반 card drag payload 분리
- 새학기 적용 전 운영 데이터 직접 변경 금지 흐름 유지
```

## 3. 이번에 업데이트한 문서

```text
- docs/APMS_PERFORMANCE_ROUND1_RESULT.md
- docs/APMS_PERFORMANCE_ROUND2_RESULT.md
- docs/APMS_PERFORMANCE_ROUND3_RESULT.md
- docs/APMS_PLANNER_UX_TIMER_UPDATE_RESULT.md
- docs/APMS_DOCUMENTATION_SYNC_20260520.md
- docs/PROJECT_PATCH_WORKFLOW_STANDARD.md
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/WANGJI_OS_ROADMAP.md
- docs/WANGJI_OS_STRUCTURE.md
- docs/UPDATE_SUMMARY.md
```

## 4. 문서 누락 보정 내용

- Performance Round 1~3이 검수 전 상태처럼 남아 있던 부분에 최종 적용/커밋/푸시 상태를 추가했다.
- 플래너 뒤로가기/타이머/30·45·60분 선택/진동 피드백을 별도 결과 문서로 추가했다.
- 클로드/검수용 토큰 절약 패키징 기준을 표준 작업 문서에 추가했다.
- 최신 APMS 상태를 왕지교육 구조 문서와 로드맵에 반영했다.
- 리포트 상단 사인란 적용 상태를 최신 구조 요약에 기록했다.

## 5. 아직 문서상 별도 추적이 필요한 후보

아래는 이번 문서 업데이트에서 구현하지 않고 상태만 기록한다.

```text
- planner PIN URL 노출 구조 개선
- planner delete confirm() → 인앱 모달 전환
- planner 모바일 월간 보기/compact calendar 보강
- planner EXAM_DATE 하드코딩 제거 및 반별/학생별 시험일 연동
- 학생 포털/플래너 네트워크 offline/timeout 문구 보강
- report.js 한글/인코딩 기반 inline check 실패 로그 재검토
```

## 6. 최종 판정

문서 업데이트 기준으로 누락이 컸던 부분은 성능 Round 적용 상태와 플래너 UX 후속 보정이었다.

이번 문서 패치는 구현 코드를 변경하지 않고, 현재 코드와 운영 적용 이력을 문서에 맞추는 작업이다.
