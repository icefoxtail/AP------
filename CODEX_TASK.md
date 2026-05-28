cd C:\Users\USER\Desktop\AP------



@'

# CODEX_TASK - Backdoor Dashboard / Modal API Coverage Plan



## 0. 목적



백도어 backend-only 1차 API는 배포 완료 상태다.



이번 작업은 새 API 구현이 아니라, 다음 구현 라운드를 위한 "대시보드 화면 + 모달 화면 전체 백도어 API 설계 목록"을 만드는 것이다.



기존 운영 화면과 기존 API는 절대 수정하지 않는다.



이번 작업 결과물은 문서와 CODEX_RESULT append만 만든다.



압축/검수팩 생성은 하지 않는다.



---



## 1. 작업 루트



반드시 아래 루트에서 작업한다.



C:\Users\USER\Desktop\AP------



---



## 2. 절대 금지



아래 작업은 절대 하지 않는다.



- wrangler deploy

- npx wrangler deploy

- wrangler d1 execute

- npx wrangler d1 execute

- git add

- git commit

- git push

- git reset

- git checkout

- git clean

- npm install

- npm update

- pnpm install

- yarn install

- D1 migration 실행

- 운영 DB 쓰기

- apmath/js/* 수정

- apmath/index.html 수정

- apmath/worker-backup/worker/index.js 수정

- apmath/worker-backup/worker/routes/backdoor.js 수정

- 기존 /api/initial-data 수정

- 기존 운영 API 수정

- 프론트 연결

- 새 백도어 API 구현

- UI 문구 확정

- 시간표 UI compact 보정

- 학생 이름 표시 UI 보정

- 대시보드/모달 UI 구현

- Compress-Archive 실행

- zip 생성

- docs/review-packs 복구

- docs/review-packs 새 생성



리뷰팩 삭제분은 사용자가 의도적으로 삭제한 것이므로 복구하지 않는다.



---



## 3. 허용 작업



이번 작업에서 허용되는 것은 아래뿐이다.



- 파일 읽기

- git status 확인

- git diff 확인

- 기존 dashboard/modal 관련 함수 파악

- 기존 backdoor API 목록 확인

- 문서 생성

- CODEX_RESULT.md append

- node --check는 필요 시 확인용으로만 실행 가능



---



## 4. 확인 대상



우선 아래 파일을 읽는다.



- CODEX_RESULT.md

- CLAUDE_CODE_HANDOFF_BACKDOOR_20260528.md

- apmath/worker-backup/worker/index.js

- apmath/worker-backup/worker/routes/backdoor.js

- apmath/js/dashboard.js

- apmath/js/core.js

- apmath/js/ui.js



추가로 대시보드/모달 함수가 다른 파일에 있으면 검색해서 읽는다.



검색 키워드 후보:



- modal

- Modal

- open

- render

- dashboard

- attendance

- timetable

- billing

- payment

- student

- class

- consultation

- memo

- schedule

- report

- exam



---



## 5. 분석해야 할 것



현재 AP Math 대시보드에서 사용자가 볼 수 있는 주요 영역과 클릭 시 열리는 모달/패널을 목록화한다.



반드시 아래 관점으로 나눈다.



1. 첫 화면 카드/요약 영역

2. 오늘 운영 영역

3. 학생 관련 목록/상세

4. 반/수업 관련 목록/상세

5. 시간표 관련 화면/상세

6. 출결/숙제 관련 화면/상세

7. 수납/결제 관련 화면/상세

8. 상담/메모 관련 화면/상세

9. 시험/성적/리포트 관련 화면/상세

10. 설정성 또는 운영자 전용 영역



각 항목마다 아래를 기록한다.



- 현재 화면/모달 이름 또는 함수명

- 현재 의존 데이터

- 기존 API 또는 initial-data 의존 여부

- 백도어 첫 화면 summary API로 충분한지

- 클릭 후 detail API가 필요한지

- 개인정보/연락처/수납정보 노출 위험

- limit/offset 또는 기간 필터 필요 여부

- 우선순위

- 이번 라운드에서 구현하면 안 되는 항목



---



## 6. 백도어 API 설계 원칙



문서에 아래 원칙을 고정한다.



- 첫 진입은 summary API만 호출한다.

- 모달/상세는 클릭했을 때 on-demand detail API로 조회한다.

- /api/initial-data를 대체하지 않는다.

- 기존 운영 화면을 백도어 API로 교체하지 않는다.

- /api/backdoor/* namespace만 사용한다.

- admin-only 유지.

- GET-only/read-only부터 시작.

- raw dump 금지.

- 학생 연락처, 보호자 연락처, PIN은 기본 반환 금지.

- 수납 전체 목록 raw dump 금지.

- 목록 API는 limit/offset 또는 기간 필터 강제.

- 돈 관련 API는 summary, count, recent 일부만 먼저 제공한다.

- 상세 수정/삭제/정정 API는 이번 설계 범위에서 제외한다.



---



## 7. 생성 문서



아래 문서를 새로 생성한다.



docs/BACKDOOR_DASHBOARD_MODAL_API_PLAN_20260528.md



문서 구조는 아래 순서로 작성한다.



# BACKDOOR_DASHBOARD_MODAL_API_PLAN_20260528



## 1. 목적



## 2. 현재 배포된 백도어 API



- GET /api/backdoor/overview

- GET /api/backdoor/students

- GET /api/backdoor/classes

- GET /api/backdoor/today

- GET /api/backdoor/timetable

- GET /api/backdoor/billing-summary

- GET /api/backdoor/search



## 3. 화면/모달 인벤토리



표 형태로 작성한다.



컬럼:



- 구역

- 화면/모달/함수명

- 현재 데이터 의존

- 필요한 백도어 API

- summary/detail 구분

- 위험 데이터

- 필터/limit 필요

- 우선순위

- 비고



## 4. 1차로 충분한 API



이미 구현된 API로 커버 가능한 영역을 기록한다.



## 5. 추가가 필요한 detail API 후보



예시 후보는 아래처럼 잡되, 실제 코드 확인 결과에 맞춰 조정한다.



- GET /api/backdoor/students/:id

- GET /api/backdoor/students/:id/timeline

- GET /api/backdoor/students/:id/classes

- GET /api/backdoor/students/:id/attendance-summary

- GET /api/backdoor/students/:id/billing-summary

- GET /api/backdoor/students/:id/exam-summary

- GET /api/backdoor/students/:id/consultations

- GET /api/backdoor/classes/:id

- GET /api/backdoor/classes/:id/students

- GET /api/backdoor/classes/:id/timetable

- GET /api/backdoor/classes/:id/attendance-summary

- GET /api/backdoor/classes/:id/recent-records

- GET /api/backdoor/today/classes

- GET /api/backdoor/today/attendance-summary

- GET /api/backdoor/today/homework-summary

- GET /api/backdoor/billing/unpaid

- GET /api/backdoor/billing/recent

- GET /api/backdoor/reports/recent

- GET /api/backdoor/exams/recent



단, 이번 작업에서는 구현하지 않는다.



## 6. 다음 구현 라운드 추천



작게 나눈다.



Round A:

- 학생 상세 모달용 read-only detail API



Round B:

- 반 상세 모달용 read-only detail API



Round C:

- 오늘 운영 모달용 read-only detail API



Round D:

- 수납 상세 모달용 summary/detail API



Round E:

- 시험/리포트 summary API



## 7. 제외 범위



- 프론트 연결

- UI 구현

- 수정/삭제/정정 API

- 수납 raw list

- 연락처 노출

- D1 migration

- 기존 initial-data 대체



## 8. 최종 판단



다음 라운드에서 어떤 API부터 구현할지 추천한다.



추천은 보수적으로 한다.

돈/수납보다 학생/반/오늘 운영 detail부터 먼저 제안한다.



---



## 8. CODEX_RESULT.md append



CODEX_RESULT.md 끝에 아래 섹션을 추가한다.



# CODEX_RESULT_APPEND - Backdoor Dashboard Modal API Plan



포함 내용:



- 생성 문서

- 읽은 파일

- 확인한 주요 화면/모달 구역

- 현재 API로 커버 가능한 영역

- 추가 API가 필요한 영역

- 다음 구현 라운드 추천

- 수정하지 않은 파일

- 배포하지 않음

- 압축 생성하지 않음

- git add/commit/push 하지 않음



---



## 9. 검증



아래를 실행한다.



git status --short --untracked-files=all



git diff -- docs/BACKDOOR_DASHBOARD_MODAL_API_PLAN_20260528.md CODEX_RESULT.md



git diff -- apmath/js apmath/index.html



git diff -- apmath/worker-backup/worker/index.js apmath/worker-backup/worker/routes/backdoor.js



확인 기준:



- apmath/js diff 없음

- apmath/index.html diff 없음

- worker index/backdoor diff 없음

- 새 API 구현 없음

- 문서와 CODEX_RESULT.md만 변경

- docs/review-packs 복구 없음

- 압축 생성 없음



---



## 10. 최종 보고



작업 완료 후 아래만 짧게 보고한다.



- 생성 문서 경로

- 확인한 주요 파일

- 다음 구현 라운드 추천

- 수정하지 않은 파일

- 배포하지 않음

- 압축 생성하지 않음

- git add/commit/push 하지 않음



---



C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.

'@ | Set-Content -Path .\CODEX_TASK.md -Encoding UTF8