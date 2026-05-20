# APMS_PERFORMANCE_ROUND2_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/core.js`
- 수정: `apmath/js/classroom.js`
- 수정: `apmath/js/clinic-print.js`
- 생성: `docs/APMS_PERFORMANCE_ROUND2_RESULT.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- 시간표 파일 `apmath/js/timetable.js`는 이번 Round에서 수정하지 않았다.
- Round 1의 공통 인덱스 helper를 반 화면과 클리닉 출력 흐름까지 확장했다.
- `core.js`에 출결/숙제 학생+날짜 조회 인덱스, 학생+날짜+시험명별 시험 기록 인덱스, 아카이브+문항번호별 blueprint 인덱스를 추가했다.
- `core.js`에 `apmsGetAttendanceRecordForStudentDate()`, `apmsGetHomeworkRecordForStudentDate()`, `apmsGetExamSessionsForStudentDateTitle()`, `apmsHasConsultationForStudentDate()`, `apmsGetExamBlueprintByArchiveQuestion()` helper를 추가했다.
- `classroom.js`의 반 학생 조회를 class_students 전체 filter + students includes 조합에서 공통 인덱스 기반 조회로 전환했다.
- `classroom.js`의 오늘 출결/숙제 map 생성과 학생 행 부분 갱신에서 전체 배열 반복/검색을 줄였다.
- 출결/숙제 상태를 낙관적으로 갱신하는 흐름에서 공통 인덱스 stale cache가 생기지 않도록 인덱스 무효화를 추가했다.
- `clinic-print.js`의 반 학생 조회, session별 오답 조회, blueprint 조회가 공통 인덱스 helper를 우선 사용하도록 보정했다.
- `clinic-print.js`의 오답 출력 조립 중 불필요한 `console.log('[clinic-print] archiveFile', ...)` 반복 출력을 제거했다.
- Worker route, DB migration, 시간표, UI 문구/버튼명/화면명은 변경하지 않았다.

## 3. 실행 결과

- `node --check apmath/js/core.js`: 통과
- `node --check apmath/js/classroom.js`: 통과
- `node --check apmath/js/clinic-print.js`: 통과

## 4. 결과 요약

Round 2는 시간표를 제외하고, 선생님이 자주 여는 반 화면과 오답 클리닉 출력 준비 흐름의 반복 조회 비용을 줄이는 작업이다. 기존 UI를 바꾸지 않고, Round 1에서 만든 공통 Map 인덱스 구조를 실제 현장 사용 빈도가 높은 화면에 연결했다.

## 5. 다음 조치

- 검수 전 적용 금지.
- 검수자는 `core.js`, `classroom.js`, `clinic-print.js`의 실제 변경 함수와 stale cache 방어를 확인해야 한다.
- 검수 PASS 후에만 적용/검증/커밋/푸시/배포 명령을 제공한다.

## 6. 잘못했거나 위험했던 점

- 공통 인덱스는 배열 참조가 그대로인 상태에서 내부 객체만 수정되면 stale cache가 될 수 있으므로, 반 화면의 출결/숙제 낙관 갱신 지점에 무효화 처리를 반드시 넣어야 했다.
- `classroom.js`는 현장 사용성이 큰 파일이라, 성능 개선 명목으로 문구/버튼/화면 구조를 바꾸면 회귀 위험이 크다.
- `clinic-print.js`는 아카이브/blueprint 연결이 민감하므로 경로 정규화와 문항번호 기준을 바꾸지 않았다.

## 7. 보존해야 할 점

- 시간표/새학기/개편안 로직은 이번 Round에서 건드리지 않는다.
- 반 화면의 기존 문구, 버튼명, 화면명, 상담/지각/보강/숙제/출결 흐름은 보존한다.
- 클리닉 출력의 기존 선택 방식, 학생별/반별 출력 방식, 아카이브 원문 연결 방식은 보존한다.
- Worker route와 DB migration은 이번 Round에서 수정하지 않는다.

## 8. 최종 적용 상태 — 2026-05-20

이 문서의 작업은 검수 PASS 후 로컬 적용, 문법 검증, git commit, git push까지 완료된 상태다.

```text
커밋: fe987a5 Optimize APMS classroom clinic performance
원격: origin/main 반영 완료
상태: working tree clean 확인 완료
적용 파일: core.js / classroom.js / clinic-print.js / APMS_PERFORMANCE_ROUND2_RESULT.md
```

### 적용 후 확인 기준

브라우저 수동 확인은 아래 흐름을 기준으로 한다.

```text
반 화면 출결·숙제 토글, 학생 행 갱신, 클리닉 출력 진입
```

### 보존 기준

- 시간표 파일과 새학기/개편안 흐름은 해당 Round 범위 밖이면 건드리지 않는다.
- 기존 UI 문구, 버튼명, 화면명은 성능 개선 명목으로 임의 변경하지 않는다.
- Worker route 또는 DB migration은 문서에 명시된 Round 외에는 추가하지 않는다.
