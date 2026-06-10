# CODEX_TASK.md — 왕지교육 공통 학생관리 v2 내부 준비판 구현

## 0. 작업 성격

이번 작업은 왕지교육 공통 학생관리 v2 내부 준비판 구현이다.

이전 1차 독립 화면을 더 크게 확장한다.

목표는 단순 skeleton이 아니라, 나중에 실제 운영 화면으로 전환할 수 있는 수준의 큰 화면 구조를 미리 만드는 것이다.

단, 기존 AP/EIE 원본 DB write는 아직 금지한다.

이번 작업에서 중요한 점은 다음이다.

* 내부 개발 단계이지만, 사용자에게 보이는 문구는 실제 운영 화면처럼 정돈한다.
* 화면에 “실험실”, “꺼내지 않을 화면”, “임시”, “mock”, “가짜 데이터” 같은 문구를 남발하지 않는다.
* 기능이 아직 연결되지 않은 곳은 “준비 중”, “연결 필요”, “저장 연결 전”처럼 차분하게 표시한다.
* 기존 AP/EIE 원본 데이터는 수정하지 않는다.
* 기존 AP/EIE 메뉴, 학생상세, 시간표, 상담, 출결은 교체하지 않는다.
* 새 학생관리 화면만 독립적으로 크게 만든다.

---

## 1. 작업 시작 전 필수

작업 시작 전에 반드시 CODEX_TASK.md를 먼저 읽는다.

이 방에서는 최종 결과 파일을 CODEX_RESULT.md로 저장한다.

CODEX_RESULT1.md에 저장하지 않는다.

---

## 2. 최상위 방향

처음에 정한 방향을 절대 바꾸지 않는다.

기존 AP/EIE 틀은 그대로 유지한다.

학생관리만 새로 따로 만든다.

기존 AP/EIE DB는 원본으로 유지한다.

기존 데이터를 새로 다시 입력하지 않는다.

처음에는 안전하게 읽고 연결한다.

나중에는 왕지 공통 학생관리로 입력 중심을 옮긴다.

하지만 원본 반영은 AP/EIE 공식 API 또는 검증된 write-through adapter 단계에서만 한다.

이번 작업은 화면과 구조를 크게 만들 수 있다.

그러나 기존 운영 화면을 침범하면 안 된다.

---

## 3. 이번 작업의 목표

이번 작업은 작은 skeleton이 아니라, 내부 준비판 기준으로 큰 화면을 만든다.

구현 목표:

1. EIE 전체 시간표 오표시 문제 보정
2. AP/EIE read-only adapter 안정화
3. 통합 학생관리 대형 화면 구성
4. 학생 검색/목록/필터 확장
5. 통합 학생 상세 확장
6. 연결 관리 섹션 확장
7. 공통 상담 섹션 확장
8. 공통 메모 섹션 추가
9. 학생 이력 섹션 추가
10. 운영 확인 항목 섹션 추가
11. adapter 상태/오류 섹션 추가
12. overlay/link/index schema draft 보강
13. 향후 write-through 자리만 disabled 상태로 마련

---

## 4. 절대 금지

아래는 이번 작업에서 절대 하지 않는다.

* 기존 AP 학생 전체를 새 DB에 복사
* 기존 EIE 학생 전체를 새 DB에 복사
* 기존 AP/EIE 데이터를 새로 재입력
* 기존 AP/EIE DB migration 적용
* 기존 AP/EIE 학생상세 교체
* 기존 AP/EIE 시간표 수정
* 기존 AP/EIE 상담 구조 변경
* 기존 AP/EIE 출결 구조 변경
* 기존 AP/EIE 메뉴 정식 교체
* 자동 병합
* AP/EIE 원본 DB write-through 실제 구현
* AP/EIE 원본 DB 직접 SQL write
* AP/EIE API POST/PATCH/DELETE 호출
* 배포
* git commit
* git push

---

## 5. 사용자에게 보이는 문구 정책

이번 작업에서 문구가 중요하다.

화면 문구는 실제 운영 화면으로 전환 가능한 톤으로 작성한다.

### 5.1 금지 문구

사용자 화면에 아래 표현을 쓰지 않는다.

* 실험실
* 안 꺼낼 화면
* 임시 화면
* mock
* fake
* 가짜 데이터
* 테스트용 데이터
* 대충 연결
* 나중에 고침
* 미완성이라 위험
* 개발자만 보는 화면
* 숨김 메뉴

### 5.2 허용 문구

아래처럼 차분하고 운영 친화적인 문구를 사용한다.

* 통합 학생관리
* 안전 모드
* 읽기 전용 연결
* 원본 데이터 보호
* 저장 연결 준비 중
* 연결 상태 확인 필요
* 학생별 시간표 연결 필요
* 공통 상담 저장소 연결 전
* 원본 수정은 아직 지원하지 않습니다
* AP/EIE 원본 정보는 읽기 전용으로 표시됩니다

### 5.3 상단 안내 문구 예시

화면 상단에는 아래 취지의 문구를 넣는다.

왕지 통합 학생관리 준비 화면입니다. 기존 AP/EIE 원본 데이터는 읽기 전용으로 표시되며, 원본 수정은 아직 지원하지 않습니다.

또는

통합 학생관리 안전 모드입니다. AP/EIE 원본 데이터는 보호되며, 공통 연결·상담·메모 저장은 overlay 저장소 연결 후 활성화됩니다.

---

## 6. 구현 파일 원칙

가능하면 아래 파일만 수정한다.

* apmath/wangji-student-management.html
* apmath/js/wangji-student-management.js
* apmath/css/wangji-student-management.css
* docs/WANGJI_STUDENT_MANAGEMENT_V1_SCHEMA_DRAFT.sql
* CODEX_RESULT.md

기존 AP/EIE 핵심 파일은 수정하지 않는다.

수정 금지 후보:

* apmath/js/student.js
* apmath/js/classroom.js
* apmath/js/management.js
* eie/css/eie.css
* eie/js/views/eie-attendance.js
* EIE 시간표 핵심 파일
* AP 시간표 핵심 파일

기존 변경 파일이 git status에 보이더라도 이번 작업에서 건드리지 말고 CODEX_RESULT.md에 기존 변경으로 분리 보고한다.

---

## 7. 필수 보정 — EIE 전체 시간표 오표시 제거

이전 구현에서 EIE adapter가 /api/eie/timetable 전체 결과를 선택 학생의 schedules처럼 넣는 구조가 있다면 반드시 제거한다.

금지:

GET /api/eie/timetable 결과 전체를 선택 학생 schedule로 표시

보정:

EIE 학생별 시간표 endpoint가 확정되지 않은 경우, 선택 학생의 schedules에는 전체 timetable을 넣지 않는다.

대신 EIE 섹션에 다음 의미를 표시한다.

EIE 학생별 시간표 연결이 필요합니다. 전체 시간표 데이터는 학생별 수업시간으로 표시하지 않습니다.

section_errors에도 동일한 취지를 기록한다.

---

## 8. 필수 보정 — AP+EIE / 연결 후보 안내

AP+EIE / 연결 후보 필터는 아직 실제 overlay DB 기반 후보가 아니다.

따라서 화면에 안내를 추가한다.

문구 예시:

AP+EIE / 연결 후보는 현재 표시 기준입니다. 실제 후보 매칭과 확정 연결은 공통 연결 저장소가 연결된 뒤 활성화됩니다.

이 문구는 학생 목록 필터 근처에 작게 표시한다.

---

## 9. 화면 확장 구조

이번 화면은 크게 만든다.

전체 구조:

* 상단 헤더
* 상태 요약 바
* 좌측 검색/목록
* 중앙 또는 우측 통합 상세
* 상세 내부 탭 또는 섹션 카드
* 하단 adapter 상태/검증 영역

권장 탭:

* 요약
* AP
* EIE
* 연결
* 상담
* 메모
* 이력
* 확인 항목
* 상태

단, 탭 UI가 과하면 카드 섹션 방식으로 구현해도 된다.

---

## 10. 상단 헤더

상단에는 다음을 표시한다.

* 왕지 통합 학생관리
* 안전 모드 배지
* 읽기 전용 연결 배지
* 원본 데이터 보호 안내
* overlay 저장소 연결 상태

문구는 운영 친화적으로 작성한다.

나쁜 예:

Lab 모드입니다. 아직 안 꺼낼 화면입니다.

좋은 예:

통합 학생관리 안전 모드입니다. AP/EIE 원본 정보는 읽기 전용으로 표시됩니다.

---

## 11. 상태 요약 바

상단 또는 본문 상단에 상태 요약 카드를 만든다.

표시 후보:

* AP 연결 상태
* EIE 연결 상태
* overlay 저장소 상태
* 학생별 시간표 연결 상태
* 공통 상담 저장 상태
* 원본 write-through 상태

write-through 상태는 다음처럼 표시한다.

원본 수정: 후속 단계에서 연결 예정

또는

AP/EIE 원본 수정은 아직 지원하지 않습니다.

---

## 12. 좌측 학생 검색/목록 패널

좌측에는 다음을 구현한다.

* 검색창
* 검색 버튼
* 필터 탭
* 결과 목록
* 결과 없음 상태
* adapter 오류 상태

필터:

* 전체
* AP
* EIE
* AP+EIE
* 연결 후보
* 공통 학생
* 상담 후속
* 오늘 수업

결과 카드 표시:

* 학생명
* 학교
* 학년
* source_app 배지
* 연결 상태 배지
* AP/EIE 배지
* 상담 후속 여부
* 수업시간 후보
* 오류 표시

실제 overlay API가 없으면 연결 상태는 저장된 상태처럼 보이면 안 된다.

표시 예:

연결 준비

후보 확인 필요

저장소 연결 전

---

## 13. 통합 상세 — 요약 섹션

학생 선택 시 요약 섹션을 표시한다.

표시:

* 학생명
* 학교
* 학년
* 연락처 snapshot
* AP 원본 연결 상태
* EIE 원본 연결 상태
* 공통 학생 anchor 상태
* 오늘 수업 후보
* 상담 후속 후보
* adapter 오류 요약
* 원본 수정 가능 여부

원본 수정 가능 여부는 반드시 false 또는 disabled로 표시한다.

문구:

원본 수정은 후속 단계에서 AP/EIE 공식 API 검증 후 연결됩니다.

---

## 14. 통합 상세 — AP 섹션

AP 섹션에는 read-only로 다음을 표시한다.

* AP 원본 학생 정보
* AP 반
* AP 과목
* AP 수업시간
* AP 상담 read-only 요약
* AP 상세 열기 버튼 후보

deeplink가 확정되지 않았으면 버튼은 비활성으로 둔다.

문구:

AP 상세 연결 방식 확인 필요

AP 원본 정보는 읽기 전용입니다.

---

## 15. 통합 상세 — EIE 섹션

EIE 섹션에는 read-only로 다음을 표시한다.

* EIE 원본 학생 정보
* EIE 반/셀 정보
* EIE 상담 read-only 요약
* EIE 학생별 시간표 연결 필요 안내
* EIE 상세 열기 버튼 후보

전체 timetable을 학생별 schedule로 표시하지 않는다.

문구:

EIE 학생별 수업시간 연결이 필요합니다. 전체 시간표는 학생별 수업시간으로 표시하지 않습니다.

---

## 16. 연결 섹션

연결 섹션은 크게 만든다.

구성:

* 공통 학생 anchor 상태
* AP link 상태
* EIE link 상태
* candidate / active / rejected / archived 상태 설명
* AP 학생 link 후보 추가 버튼
* EIE 학생 link 후보 추가 버튼
* candidate 확정 버튼
* candidate 거절 버튼
* link 보관 버튼

단, overlay API가 없으면 버튼은 disabled 상태로 둔다.

문구:

공통 연결 저장소가 연결되면 저장할 수 있습니다.

자동 병합은 지원하지 않는다.

문구:

이름이나 연락처가 같아도 자동으로 같은 학생으로 확정하지 않습니다. 관리자가 직접 확인해야 합니다.

---

## 17. 상담 섹션

상담 섹션은 거의 완성형 UI로 만든다.

필드:

* 상담일
* 상담 범위 COMMON / AP / EIE
* 상담 유형
* 상담 내용
* 다음 조치
* 후속 상태
* 공개 범위
* 작성자 표시 후보

저장 버튼은 overlay API가 없으면 disabled 처리한다.

문구:

공통 상담은 왕지 공통 저장소에만 저장됩니다. AP/EIE 원본 상담에는 저장하지 않습니다.

AP/EIE 원본 상담 write-through는 후속 단계입니다.

---

## 18. 메모 섹션

공통 운영 메모 UI를 만든다.

필드:

* 메모 제목
* 메모 내용
* 중요도
* 태그
* 작성자
* 작성일

저장 버튼은 overlay API가 없으면 disabled 처리한다.

문구:

공통 메모 저장소 연결 후 저장할 수 있습니다.

---

## 19. 이력 섹션

학생 이력 timeline 구조를 만든다.

표시 후보:

* AP 원본 조회 이벤트
* EIE 원본 조회 이벤트
* 공통 anchor 생성 예정
* link candidate 예정
* 상담 작성 예정
* 메모 작성 예정

주의:

실제 데이터가 없으면 운영 데이터처럼 보이는 샘플을 넣지 않는다.

표시 문구:

이력 저장소 연결 후 학생별 변경 이력이 표시됩니다.

---

## 20. 확인 항목 섹션

운영자가 확인해야 할 항목을 표시하는 섹션을 만든다.

후보:

* AP/EIE 연결 후보 확인 필요
* EIE 학생별 시간표 endpoint 확인 필요
* AP 상세 deeplink 확인 필요
* EIE 상세 deeplink 확인 필요
* overlay DB 위치 결정 필요
* write-through 단계 결정 필요

이 섹션은 다음 작업을 명확히 만드는 용도다.

---

## 21. 상태 섹션

상태 섹션에는 다음을 표시한다.

* AP adapter 상태
* EIE adapter 상태
* overlay API 상태
* deeplink 상태
* 저장 가능 여부
* section_errors

개인정보 raw payload 전체를 그대로 노출하지 않는다.

---

## 22. overlay/link/index API 상태 처리

이번 작업에서 overlay DB 위치가 미확정이면 실제 저장 구현을 하지 않는다.

대신 아래 상태 모델을 만든다.

overlayApi.status:

* unavailable
* planned
* connected

현재는 unavailable 또는 planned로 둔다.

버튼 동작:

overlay API 없음:

* disabled
* 저장소 연결 후 사용 가능 표시

overlay API 있음:

* overlay DB에만 저장
* AP/EIE 원본 DB write 금지

---

## 23. read-only adapter 유지

AP/EIE adapter는 이번 작업에서도 read-only다.

허용:

* GET
* existing API read
* 실패 시 section_errors 표시

금지:

* POST
* PATCH
* DELETE
* AP/EIE 원본 write
* 전체 데이터를 학생별 데이터처럼 표시

---

## 24. 장기 write-through 자리만 만들기

장기적으로 왕지 공통 학생관리가 입력 중심이 될 예정이다.

따라서 UI에 후속 단계 자리는 만들 수 있다.

예시:

* 학생 정보 수정
* AP 반 배정 수정
* EIE 시간표 배정 수정
* AP/EIE 상담 반영

단, 실제 버튼은 disabled 처리한다.

문구:

write-through는 후속 단계에서 AP/EIE 공식 API 검증 후 연결됩니다.

---

## 25. schema draft 보강

docs/WANGJI_STUDENT_MANAGEMENT_V1_SCHEMA_DRAFT.sql을 보강할 수 있다.

단, 이 파일은 여전히 draft다.

금지:

* worker/migrations에 추가
* D1 apply
* 기존 AP/EIE DB에 적용
* migration처럼 보이는 위치로 이동

schema draft에는 다음 개념을 명시한다.

* overlay/link/index 역할
* 원본 DB 아님
* AP/EIE 데이터 재입력 금지
* write-through 후속 확장용 상태 필드
* audit/log 후보
* link 상태 candidate/active/rejected/archived

---

## 26. 검증

필수:

git status -sb

JS 파일을 수정했다면:

node --check apmath/js/wangji-student-management.js

가능하면 브라우저에서 HTML을 열어 화면 구조를 확인한다.

브라우저 확인을 못 했으면 CODEX_RESULT.md에 명시한다.

금지:

* 배포 검증
* 원격 DB 적용
* migration apply
* git commit
* git push

---

## 27. 작업 종료 전 재확인

작업 종료 전 생성/수정한 파일을 다시 열어 확인한다.

확인할 것:

* EIE 전체 timetable을 학생 schedule로 표시하지 않는가
* AP+EIE/연결 후보 필터 안내가 있는가
* 기존 AP/EIE 원본 write가 없는가
* 기존 데이터 재입력/복사가 없는가
* 자동 병합이 없는가
* overlay 저장 범위가 명확한가
* write-through는 후속으로만 남겼는가
* 기존 핵심 파일을 수정하지 않았는가
* 사용자 화면에 실험실/임시/mock/가짜 같은 표현이 없는가
* 문구가 실제 운영 화면으로 전환 가능한 톤인가

---

## 28. 작업 종료 전 CODEX_TASK.md 재확인

작업을 끝내기 직전에 반드시 CODEX_TASK.md를 다시 읽는다.

마지막에 아래를 확인한다.

* 지시와 충돌하는 구현이 있는지
* 누락한 필수 요구가 있는지
* 금지 항목을 어기지 않았는지
* CODEX_RESULT.md에 최종 결과를 저장했는지
* git status 보고가 정확한지

---

## 29. 최종 결과 저장 — CODEX_RESULT.md 필수

이 방에서는 최종 결과 파일을 CODEX_RESULT.md로 고정한다.

CODEX_RESULT1.md에 저장하지 않는다.

CODEX_RESULT.md 형식:

# CODEX_RESULT — 왕지교육 공통 학생관리 v2 내부 준비판 구현

## 1. 읽은 파일

* 실제 확인한 파일 목록

## 2. 구현한 내용

* EIE adapter 보정
* 화면 확장 내용
* 요약 섹션
* AP 섹션
* EIE 섹션
* 연결 섹션
* 상담 섹션
* 메모 섹션
* 이력 섹션
* 확인 항목 섹션
* 상태 섹션
* overlay API 상태 처리
* schema draft 보정 여부

## 3. 문구 정책 확인

* 사용자 화면에 실험실/임시/mock/가짜/안 꺼낼 화면 표현 없음
* 운영 전환 가능한 문구 사용
* read-only와 저장소 연결 전 상태를 차분하게 표시

## 4. 기존 구조 보호 확인

* 기존 AP/EIE 학생상세 교체 없음
* 기존 AP/EIE DB migration 없음
* 기존 AP/EIE write 없음
* 기존 메뉴 정식 교체 없음
* 기존 변경 파일 미수정

## 5. 구현하지 않은 항목

* AP/EIE write-through 없음
* AP/EIE 상담 저장 없음
* AP/EIE 수강 배정 저장 없음
* 기존 데이터 복사 없음
* 자동 병합 없음
* 배포 없음
* git commit/push 없음

## 6. 남은 결정사항

* overlay DB 실제 위치
* 신규 Worker 여부
* AP adapter 인증 방식
* EIE adapter 인증 방식
* AP/EIE deeplink 방식
* write-through 도입 단계
* EIE 학생별 시간표 endpoint

## 7. 검증 결과

* git status -sb
* node --check 결과
* 브라우저 확인 여부
* 수행하지 못한 검증과 이유

## 8. 작업 종료 전 재확인

* 생성/수정 파일을 다시 열어 읽고 지시와 충돌하지 않는지 확인했습니다.
* 작업 종료 직전에 CODEX_TASK.md를 다시 읽고 지시와 충돌하지 않는지 확인했습니다.

---

## 30. 압축 파일 생성 규칙

검수용 zip을 만들 경우 반드시 Downloads 폴더에 생성한다.

기준 위치:

C:\Users\USER\Downloads

금지:

* repo 루트에 zip 생성
* 작업 폴더 안에 zip 생성

zip 생성은 사용자가 요청한 경우에만 한다.

---

## 31. 채팅 최종 보고

채팅 최종 보고에는 아래를 포함한다.

* CODEX_RESULT.md 저장 완료 여부
* 생성/수정 파일 목록
* 코드 수정 범위
* DB 변경 없음
* 배포 없음
* git commit/push 없음
* 기존 변경 파일 보호 여부
* EIE adapter 보정 여부
* 화면 확장 내용
* 문구 정책 준수 여부
* overlay 저장 구현 여부
* 검증 결과
* 남은 결정사항
