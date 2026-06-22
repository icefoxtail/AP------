# EIE 원장 퇴원생 완전 삭제

## 변경

- 원장 권한의 학생관리 수정 화면에서 퇴원생에게만 `완전 삭제` 버튼을 표시한다.
- 완전 삭제 API는 원장 권한만 허용한다.
- 학생, 시간표 배정, 연락처, 담당교사, 출석, 성적, 상담, 성적 리포트를 함께 영구 삭제한다.
- 삭제 후 현재 시간표가 과거 엑셀 후보 데이터로 되살아나는 fallback을 차단한다.
- 일반 퇴원 처리는 기존처럼 2개월 동안 시간표에 표시한다.

## 검증

- `node --check workers/wangji-eie-worker/routes/eie.js`: PASS
- `node --check eie/js/views/eie-students.js`: PASS
- `node --check eie/js/views/eie-timetable.js`: PASS
- `node tests/eie-owner-hard-delete-student.test.js`: PASS
- `node tests/eie-worker-route-permissions.test.js`: PASS
- `node tests/eie-timetable-withdrawn-students.test.js`: PASS
- `node tests/eie-student-worker-crud-parity.test.js`: PASS
- `node tests/eie-students-breakdown-print.test.js`: PASS

## 리뷰

- Logic/routing: 직접 검증 PASS. DELETE 학생 경로는 원장 전용이며 일반 퇴원 흐름은 유지된다.
- UI/UX: 직접 코드 검증 PASS. 버튼은 원장 + 퇴원 상태 + 수정 화면에서만 노출된다.
- Regression: 집중 테스트 PASS.
- 별도 리뷰 에이전트: 세션 위임 정책상 호출하지 못해 UNVERIFIED.
- 실제 브라우저 클릭 및 배포 환경 D1 검증: UNVERIFIED.

## 문서 판단

- 정책이나 장기 로드맵 변경이 아닌 한정된 버그 수정이므로 3대 master 문서는 수정하지 않았다.
- 배포, remote D1, production smoke, git add/commit/push는 수행하지 않았다.
- 최종 review pack: `C:\Users\USER\Downloads\EIE_OWNER_HARD_DELETE_REVIEW_FINAL_20260622_1928.zip`
