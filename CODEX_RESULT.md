# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `apmath/js/study-material-wrong.js`
- 수정: `apmath/worker-backup/worker/routes/study-material-wrongs.js`
- 수정: `apmath/js/ui.js`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료
- 화면명/메뉴명을 `수업자료`로 통일
- 상단 탭명을 `자료 등록 | 단원 설정 | 반 배정 | 제출 확인 | 오답 확인 | 복습 출력`으로 정리
- 버튼/안내 문구 정리
- 자료 종류/상태 화면 표시 한글화
- 오답 확인 선택 순서 `학년 > 반 > 학생 > 수업자료`로 변경
- 복습 출력 선택 순서 `학년 > 반 > 학생 > 수업자료`로 변경
- 학년/반/학생 선택에 따른 범위 자동 판정 조회 구현
- `material-wrongs/scope` API 추가
- `material-review/scope` API 추가
- 수업자료 미선택 시 전체 자료 기준 조회 허용
- 기존 학생 제출 완료 후 수정 금지 유지
- 학생 원문/PDF/archive 열기 기능 추가 없음
- 원장/관리자 대시보드 변경 없음

## 3. 실행 결과
- `node --check apmath/js/study-material-wrong.js` 결과: 성공
- `node --check apmath/worker-backup/worker/routes/study-material-wrongs.js` 결과: 성공
- `node --check apmath/js/ui.js` 결과: 성공
- wrangler 실행: 없음
- D1 migration 실행: 없음
- 배포 실행: 없음
- git add/commit/push 실행: 없음

## 4. 결과 요약
- 선생님 화면에서 `수업자료` 메뉴로 진입
- 학년만 선택해도 학년 오답/복습 출력 가능
- 반만 선택해도 반 오답/복습 출력 가능
- 학생 선택 시 학생 오답/복습 출력 가능
- 화면 영어/DB 값 직접 노출 최소화

## 5. 잘못한 점 / 위험했던 점 / 보존해야 할 것
- 잘못한 점: 없음
- 위험했던 점: 기존 legacy API는 `material_id` 필수 조건을 유지해야 해서 새 화면은 별도 `scope` API만 사용하도록 분리함
- 보존해야 할 것
  - 기존 문구/버튼명/화면명은 지정 범위 밖에서 변경하지 않음
  - 학생 제출 후 수정 기능 추가하지 않음
  - 학생 자료 원문 열기 기능 추가하지 않음
  - 원장/관리자 대시보드 변경하지 않음

## 6. 다음 조치
- 운영 필터에서 실제 학년/반/학생 범위 조회 수동 확인 필요
- 실제 자료 1개로 학년/반/학생 범위 조회 확인 필요
