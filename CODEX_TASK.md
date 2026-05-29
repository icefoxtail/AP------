cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업 목적

왕지교육 큰 대문과 AP MATH 소개 대문을 실제 HTML로 적용하기 전에, 기존 AP Math OS 운영 앱 경로를 절대 깨뜨리지 않도록 홈페이지 구조조정 준비 작업만 수행한다.

이번 작업은 실제 대문 HTML 적용 작업이 아니다.
이번 작업은 구조 확인, 새 폴더 준비, 링크 정책 문서화, 보존 경로 검증, 결과 보고까지가 범위다.

## 1. 프로젝트 루트

작업 루트는 아래 경로다.

C:\Users\USER\Desktop\AP------

반드시 위 경로에서 작업한다.

## 2. 절대 보존해야 할 기존 경로

아래 경로는 기존 운영 흐름과 직접 연결되어 있으므로 절대 삭제, 이동, 덮어쓰기, 이름 변경하지 않는다.

- apmath/
  - 기존 AP Math OS 로그인/운영 앱
  - 특히 apmath/index.html은 절대 덮어쓰지 않는다.

- apmath/student/
  - 기존 학생 포털
  - 절대 삭제하거나 이동하지 않는다.

- archive/
  - 기존 아카이브
  - 절대 삭제하거나 이동하지 않는다.

- 기존 APMS/AP Math OS 로그인, 로그아웃, 세션, dashboard 이동 흐름
  - 이번 작업에서 수정하지 않는다.

## 3. 새로 사용할 홈페이지 경로 정책

앞으로 사용할 홈페이지 구조는 아래처럼 고정한다.

AP------/
├─ index.html
│  ← 왕지교육 큰 대문으로 사용할 예정
│
├─ apmath-home/
│  └─ index.html
│     ← AP MATH 브랜드 소개 대문으로 사용할 예정
│
├─ apmath/
│  └─ index.html
│     ← 기존 AP Math OS 로그인/운영 앱, 절대 보존
│
├─ apmath/student/
│  ← 기존 학생 포털, 절대 보존
│
├─ archive/
│  ← 기존 아카이브, 절대 보존

## 4. 링크 정책

향후 HTML 적용 시 링크 정책은 아래 기준을 따른다.

### 왕지교육 큰 대문

- AP MATH 카드/CTA → /apmath-home/
- EIE English 카드/CTA → 실제 EIE 블로그 주소
  - 주소 미확정 시 href="#" 또는 TODO 주석
- CMath 카드/CTA → 준비중
  - href="#" 또는 #inquiry
- 상담 문의 → #inquiry
- 브랜드 보기 → #brands
- FAQ → #faq
- 블로그 바로가기 → 실제 블로그 주소 또는 TODO

### AP MATH 소개 대문

- AP Math OS 로그인 → /apmath/
- 학생 포털 → /apmath/student/
- 아카이브 → /archive/
- 왕지교육 홈 → ../ 또는 /
- 상담 문의 → #inquiry

## 5. 수행 작업

아래 작업만 수행한다.

1. 현재 루트 index.html 존재 여부를 확인한다.
2. 현재 루트 index.html의 역할을 간단히 확인한다.
3. apmath/index.html 존재 여부를 확인한다.
4. apmath/index.html이 기존 로그인/운영 앱과 관련 있는지 키워드 기준으로 확인한다.
   - login
   - dashboard
   - teacher
   - admin
   - student
   - session
   - AP Math
   - APMS
5. apmath/student/ 경로 존재 여부를 확인한다.
6. archive/ 경로 존재 여부를 확인한다.
7. apmath-home/ 폴더가 없으면 생성한다.
8. HOMEPAGE_STRUCTURE_PLAN.md 파일을 루트에 생성한다.
9. CODEX_RESULT.md 파일을 루트에 생성한다.
10. 실제 HTML 대문 파일 적용은 하지 않는다.
11. 기존 파일 삭제, 이동, 이름 변경, 덮어쓰기 금지.
12. git add, git commit, git push 금지.

## 6. 생성할 문서: HOMEPAGE_STRUCTURE_PLAN.md

루트에 HOMEPAGE_STRUCTURE_PLAN.md를 생성한다.

반드시 아래 구조로 작성한다.

# HOMEPAGE_STRUCTURE_PLAN

## 1. 목적

왕지교육 큰 대문과 AP MATH 소개 대문을 기존 AP Math OS 운영 앱과 분리하여 안전하게 추가하기 위한 구조 계획이다.

## 2. 현재 보존해야 할 경로

- apmath/
- apmath/index.html
- apmath/student/
- archive/

각 경로가 존재하는지 확인 결과를 함께 적는다.

## 3. 새로 추가할 경로

- apmath-home/

해당 경로의 목적을 적는다.

## 4. 최종 배치 계획

- 왕지교육 큰 대문: index.html
- AP MATH 소개 대문: apmath-home/index.html
- 기존 운영 앱: apmath/index.html
- 학생 포털: apmath/student/
- 아카이브: archive/

## 5. 링크 정책

왕지교육 큰 대문과 AP MATH 소개 대문의 링크 정책을 구분해서 적는다.

## 6. 절대 금지 작업

- apmath/index.html 덮어쓰기 금지
- apmath/student/ 이동/삭제 금지
- archive/ 이동/삭제 금지
- 기존 로그인/로그아웃/세션/dashboard 흐름 수정 금지
- 실제 HTML 적용 금지
- git add/commit/push 금지

## 7. 다음 작업

다음 라운드에서 아래 파일을 적용할 예정이라고 적는다.

- 왕지교육.html → index.html
- apmath.html → apmath-home/index.html

단, 적용 전 왕지교육.html 내부 AP MATH 링크가 /apmath/이면 /apmath-home/으로 보정해야 한다고 적는다.

## 7. 검증 명령

아래 명령을 실행하고 결과를 CODEX_RESULT.md에 기록한다.

PowerShell 기준:

Test-Path .\index.html
Test-Path .\apmath\index.html
Test-Path .\apmath\student
Test-Path .\archive
Test-Path .\apmath-home

git status --short --untracked-files=all

가능하면 아래 키워드 검색도 수행한다.

Select-String -Path .\apmath\index.html -Pattern "login|dashboard|teacher|admin|student|session|AP Math|APMS" -CaseSensitive:$false

## 8. 완료 보고: CODEX_RESULT.md

루트에 CODEX_RESULT.md를 생성한다.

반드시 아래 형식으로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

이번 작업에서 생성/수정한 파일 목록을 적는다.

## 2. 구조 확인 결과

아래 항목의 존재 여부를 적는다.

- index.html
- apmath/index.html
- apmath/student/
- archive/
- apmath-home/

## 3. 보존 경로

보존해야 할 경로와 이번 작업에서 건드리지 않았음을 적는다.

## 4. 새 홈페이지 경로

apmath-home/ 생성 여부와 목적을 적는다.

## 5. 실행 결과

실행한 Test-Path, Select-String, git status 결과를 요약한다.

## 6. 결과 요약

이번 작업은 구조조정 준비 작업이며 실제 HTML 적용은 하지 않았다고 명확히 적는다.

## 7. 다음 조치

다음 작업에서 아래 파일을 적용한다고 적는다.

- 왕지교육.html → index.html
- apmath.html → apmath-home/index.html

단, 적용 전 링크 정책 보정이 필요하다고 적는다.

## 8. 자체 검수 및 검수팩

codex-self-audit 결과와 codex-work-review-pack 생성 결과를 적는다.
검수팩 zip 경로를 마지막에 기록한다.

## 9. 금지 작업

이번 작업에서 아래 작업을 하지 않았다고 적는다.

- git add
- git commit
- git push
- apmath/index.html 덮어쓰기
- 기존 로그인/운영 앱 수정
- 실제 HTML 적용

## 9. 마무리 규칙

작업 완료 후 바로 보고하지 말고, 먼저 codex-self-audit 스킬을 적용해 자체 검수를 수행한다.

자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증한다.

그 다음 codex-work-review-pack 스킬을 적용해 이번 작업의 변경/신규 파일 중심 검수팩을 생성한다.

프로젝트 전체 압축은 금지한다.

검수팩에는 이번 작업으로 생성/수정된 파일 중심으로만 포함한다.

생성된 zip 경로를 CODEX_RESULT.md 마지막에 기록한다.

git add, git commit, git push는 하지 않는다.

## 10. 최종 실행 지시

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

현재 프로젝트 루트 C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.