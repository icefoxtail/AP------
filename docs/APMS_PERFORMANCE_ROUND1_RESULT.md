# APMS_PERFORMANCE_ROUND1_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/core.js`
- 수정: `apmath/js/dashboard.js`
- 수정: `apmath/js/cumulative.js`
- 수정: `apmath/js/report.js`
- 생성: `docs/APMS_PERFORMANCE_ROUND1_RESULT.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- 시간표 파일 `apmath/js/timetable.js`는 수정 대상에서 제외했다.
- `core.js`에 APMS 공통 데이터 인덱스 헬퍼를 추가했다.
- `loadData()`와 `refreshDataOnly()` 이후 공통 인덱스를 무효화하고 재생성하도록 했다.
- 학생/반/반배정/반별 학생/학생별 시험/학생별 상담/세션별 오답/반별 일지/일지별 진도 조회를 Map 기반 helper로 제공했다.
- `dashboard.js`의 `computeRiskStudents()`에서 학생마다 전체 배열을 반복 필터링하던 구조를 Map 기반 집계로 변경했다.
- `dashboard.js`의 원장 대시보드 학생-반 조회 helper 일부를 공통 인덱스 helper 우선 사용으로 변경했다.
- `cumulative.js`의 학생→반, 반명, 학생 조회를 공통 인덱스 helper 우선 사용으로 변경했다.
- `cumulative.js`의 월간 출석부 렌더링에서 학생 목록을 반별 Map으로 1회 그룹화해 반마다 반복 filter하는 흐름을 줄였다.
- `cumulative.js`의 성적표 중등/고등 필터 일부에서 반복 반 조회를 공통 helper 기반으로 보정했다.
- `report.js`의 보고문구 context 생성에서 학생/반/시험/상담/오답/최근 일지/진도 조회를 공통 helper 우선 사용으로 변경했다.
- Worker route는 이번 patch에서 직접 수정하지 않았다.
- DB migration은 생성하지 않았다.
- 기존 UI 문구, 버튼명, 화면명은 변경하지 않았다.

## 3. 실행 결과

- `node --check core.js`: 통과
- `node --check dashboard.js`: 통과
- `node --check cumulative.js`: 통과
- `node --check report.js`: 통과
- `node --check index.js`: 통과 확인, 단 index.js는 변경하지 않음

## 4. 결과 요약

이번 Round 1은 시간표 제외 APMS 화면의 반복 조회 비용을 줄이는 프론트 성능 Foundation 작업이다.

원본 `state.db` 배열 구조는 유지하면서 공통 Map 인덱스를 얹었다. 그래서 기존 화면/문구/데이터 흐름을 크게 바꾸지 않고, 원장 대시보드의 관리필요 학생 계산, 월간 출석부, 성적표, 보고문구 생성에서 반복 `find/filter/sort`를 줄였다.

## 5. 다음 조치

- 검수 전 적용 금지.
- Gemini / Claude / ChatGPT 검수에서 실제 파일 전체를 열어 확인한다.
- 검수 PASS 후에만 적용, 검증, 배포, 커밋, 푸시 명령을 제공한다.
- 검수 후 브라우저에서 원장 대시보드, 월간 출석부, 성적표, 보고문구 생성만 확인하면 된다.

## 6. 잘못했거나 위험했던 점

- 공통 인덱스는 `state.db` 배열 참조가 바뀔 때 자동 재생성되지만, 배열을 같은 참조로 직접 push만 하는 일부 흐름에서는 즉시 반영이 늦을 수 있다.
- 이번 patch에서는 출결/숙제 실시간 토글처럼 자주 변하는 데이터는 핵심 인덱스 대상으로 삼지 않았다.
- 성능 개선 명목으로 UI 구조를 개편하지 않았고, 반복 조회가 큰 화면에만 제한적으로 적용했다.

## 7. 보존해야 할 점

- 시간표 파일과 새학기/개편안/드래그/충돌확인 흐름은 건드리지 않는다.
- 기존 문구·버튼명·화면명은 유지한다.
- 원장/admin 기능을 새로 노출하지 않는다.
- DB migration은 이번 Round 1에 포함하지 않는다.
- 공통 인덱스는 원본 데이터의 대체물이 아니라 조회 보조 레이어로만 사용한다.

## 8. 최종 적용 상태 — 2026-05-20

이 문서의 작업은 검수 PASS 후 로컬 적용, 문법 검증, git commit, git push까지 완료된 상태다.

```text
커밋: a9c6bae Optimize APMS core report dashboard performance
원격: origin/main 반영 완료
상태: working tree clean 확인 완료
적용 파일: core.js / dashboard.js / cumulative.js / report.js / APMS_PERFORMANCE_ROUND1_RESULT.md
```

### 적용 후 확인 기준

브라우저 수동 확인은 아래 흐름을 기준으로 한다.

```text
원장 대시보드, 월간 출석부, 성적표, 보고문구 생성
```

### 보존 기준

- 시간표 파일과 새학기/개편안 흐름은 해당 Round 범위 밖이면 건드리지 않는다.
- 기존 UI 문구, 버튼명, 화면명은 성능 개선 명목으로 임의 변경하지 않는다.
- Worker route 또는 DB migration은 문서에 명시된 Round 외에는 추가하지 않는다.
