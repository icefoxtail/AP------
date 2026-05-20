# 프로젝트 패치 작업 표준 흐름

## 0. 목적

이 문서는 Academy OS / APMS / JS아카이브 관련 패치 작업의 표준 흐름을 고정하기 위한 문서다.

작업자는 이 흐름을 기준으로 진행한다.

기본 원칙은 다음과 같다.

- 최신 소스 기준으로 패치를 만든다.
- 적용용 zip과 검수용 zip은 분리한다.
- 검수 전에는 최종 적용·배포·커밋·푸시 명령을 제공하지 않는다.
- 검수 PASS 후에는 압축 해제, 실제 경로 덮어쓰기, 검증, git add, git commit, git push, 배포까지 한 번에 이어지는 명령을 제공한다.
- 사용자가 명시적으로 검수 생략 또는 즉시 적용을 지시한 경우에는 해당 지시를 우선한다.

---

## 1. 기본 작업 순서

### 1단계. 최신 소스 압축파일 요청

작업자는 먼저 최신 소스 상태를 받는다.

기본 요청 대상:

- 수정 대상 파일
- 관련 문서
- 관련 테스트 파일
- `CODEX_RESULT.md`
- 필요한 경우 `package.json`, `vite.config`, `schema`, `migration`

PowerShell 압축 명령은 바로 실행 가능한 형태로 제공한다.

예시:

~~~powershell
cd C:\Users\USER\Desktop

$root = "C:\Users\USER\Desktop\academy-os-v2"
$out = "$env:USERPROFILE\Desktop\academy-os-v2_task_source_pack.zip"

$paths = @(
  "$root\web-react\src\pages\Timetable.jsx",
  "$root\web-react\src\App.jsx",
  "$root\web-react\src\index.css",
  "$root\web-react\package.json",
  "$root\docs",
  "$root\CODEX_RESULT.md"
)

$existing = $paths | Where-Object { Test-Path $_ }
$missing = $paths | Where-Object { -not (Test-Path $_) }

Write-Host "FOUND:" $existing.Count
$existing | ForEach-Object { Write-Host "  OK  $_" }

Write-Host ""
Write-Host "MISSING:" $missing.Count
$missing | ForEach-Object { Write-Host "  MISS $_" }

if (Test-Path $out) {
  Remove-Item $out -Force
}

Compress-Archive `
  -Path $existing `
  -DestinationPath $out `
  -Force

Write-Host ""
Write-Host "CREATED:"
Write-Host $out
~~~

---

### 2단계. 파일 수정 및 패치 제작

작업자는 받은 최신 소스 기준으로 직접 파일을 수정한다.

원칙:

- 요청 범위 외 파일 수정 금지
- 기존 문구·버튼명·화면명 임의 변경 금지
- DB migration은 명시 요청이 있을 때만 생성
- Phase / Round 범위를 넘는 기능 선구현 금지
- 기존 API / payload / session / 권한 흐름 회귀 금지
- 임시 파일, `.tmp`, `.bak`, 불필요한 `package-lock` 변경 금지

---

### 3단계. 적용용 zip + 검수용 zip + 검수요청서 제공

작업자는 수정 완료 후 바로 배포 명령을 주지 않는다.

반드시 아래 3가지를 먼저 제공한다.

1. 적용용 패치 zip
2. 검수용 zip
3. 검수요청서

#### 3.1 적용용 패치 zip

목적:

- 사용자가 로컬 프로젝트에 그대로 압축 해제해 적용하는 파일

파일명 예시:

~~~text
academy-os-v2_timetable_uiux_step1_patch.zip
~~~

#### 3.2 검수용 zip

목적:

- Gemini / Claude / ChatGPT 검수용
- 적용용 zip과 별도 제공
- 파일 수는 9개 이하 단위로 분할
- 큰 파일은 단독 zip으로 분리 가능

파일명 예시:

~~~text
academy-os-v2_timetable_uiux_step1_review_01_frontend.zip
academy-os-v2_timetable_uiux_step1_review_02_docs.zip
academy-os-v2_timetable_uiux_step1_review_03_worker.zip
~~~

#### 3.3 검수요청서

검수요청서에는 반드시 포함한다.

- 실제 확인할 zip 목록
- 실제 확인할 파일 목록
- 변경 범위
- 변경하지 말아야 할 범위
- 버그/오류 적극 탐색 요구
- import/export 누락 확인
- `node --check` 실패 가능성 확인
- React build 실패 가능성 확인
- undefined/null 접근 가능성 확인
- API 응답 구조 불일치 확인
- 기존 기능 회귀 확인
- UI 문구 회귀 확인
- 확인하지 않은 파일은 PASS 금지
- 근거 없는 PASS 금지

검수 결과 형식:

~~~markdown
# 검수 결과

## 1. 실제로 확인한 zip / 파일 목록

## 2. 확인한 핵심 함수 / 컴포넌트 / 상수 / 쿼리

## 3. 발견된 버그 / 오류

## 4. 재현 가능성

## 5. 수정 필요 여부

## 6. 회귀 위험

## 7. 최종 판정

PASS / CONDITIONAL PASS / FAIL
~~~

---

## 2. 검수 PASS 후 최종 적용·검증·배포·커밋·푸시

검수 PASS 후에는 아래 흐름을 기본으로 제공한다.

~~~text
압축 해제
→ 실제 파일 위치로 덮어쓰기
→ 임시 파일 정리
→ node --check / 필요한 검증
→ git status / git diff 확인
→ git add
→ git commit
→ git push
→ 배포
→ 최종 status 확인
~~~

프로젝트별로 배포 방식이 다르므로, 배포 명령은 해당 프로젝트 기준에 맞춘다.

---

## 3. APMS / AP Math OS 패치 적용 기본 명령

APMS / AP Math OS의 기본 로컬 경로는 아래를 우선한다.

~~~text
C:\Users\USER\Desktop\AP------
~~~

다운로드 폴더에 받은 패치 zip을 적용하는 기본 형태:

~~~powershell
cd C:\Users\USER\Desktop\AP------

Expand-Archive `
  -Path "$env:USERPROFILE\Downloads\<patch-file-name>.zip" `
  -DestinationPath . `
  -Force
~~~

압축이 루트에 단일 파일로 풀린 경우 실제 위치로 덮어쓰기:

~~~powershell
cd C:\Users\USER\Desktop\AP------

Copy-Item .\report.js .\apmath\js\report.js -Force
Remove-Item .\report.js -Force
~~~

검증:

~~~powershell
cd C:\Users\USER\Desktop\AP------

node --check .\apmath\js\report.js

git status
git diff -- .\apmath\js\report.js
~~~

커밋 및 푸시:

~~~powershell
cd C:\Users\USER\Desktop\AP------

git add .\apmath\js\report.js
git commit -m "<commit message>"
git push

git status
~~~

---

## 4. Academy OS 패치 적용 기본 명령

다운로드 폴더에 받은 패치 zip을 적용하는 기본 형태:

~~~powershell
cd C:\Users\USER\Desktop

Expand-Archive `
  -Path "$env:USERPROFILE\Downloads\<patch-file-name>.zip" `
  -DestinationPath . `
  -Force

cd C:\Users\USER\Desktop\academy-os-v2
~~~

임시 파일 정리:

~~~powershell
cd C:\Users\USER\Desktop\academy-os-v2

Remove-Item .\web-react\src\pages\*.tmp -Force -ErrorAction SilentlyContinue
git restore .\web-react\package-lock.json 2>$null
~~~

기본 검증:

~~~powershell
cd C:\Users\USER\Desktop\academy-os-v2

node --check .\tools\test-timetable-round2.mjs
node --check .\tools\test-timetable-phase3.mjs

cd .\web-react

npm.cmd run build
npm.cmd run check

cd C:\Users\USER\Desktop\academy-os-v2

git status --short
~~~

배포:

~~~powershell
cd C:\Users\USER\Desktop\academy-os-v2\web-react

npx wrangler pages deploy .\dist --project-name academy-os-v2-web

cd C:\Users\USER\Desktop\academy-os-v2

git status --short
~~~

커밋 및 푸시:

~~~powershell
cd C:\Users\USER\Desktop\academy-os-v2

git add `
  .\CODEX_RESULT.md `
  .\<modified-file-1> `
  .\<modified-file-2>

git commit -m "<commit message>"

git push origin main

git status --short
~~~

---

## 5. Codex 사용 원칙

Codex는 기본 작업자가 아니다.

기본 흐름:

- ChatGPT가 소스팩을 받고 직접 패치 제작
- ChatGPT가 적용용 zip / 검수용 zip / 검수요청서 제공
- Gemini / Claude / ChatGPT 등으로 검수
- PASS 후 사용자가 적용·검증·배포·커밋·푸시

Codex는 아래 경우에만 사용한다.

- 특정 파일의 핀포인트 수정
- 작은 오류 보정
- 테스트 실패 원인 수정
- 사용자가 명시적으로 Codex 지시서를 요청한 경우

Codex 지시가 필요한 경우에도 전체 작업을 넘기지 말고 핀포인트로 제한한다.

---

## 6. 금지 사항

검수 PASS 전 금지:

- 최종 적용 명령 제공
- 배포 명령 제공
- `git add` 제공
- `git commit` 제공
- `git push` 제공
- remote DB migration 적용 명령 제공
- 운영 데이터 변경 명령 제공

항상 금지:

- 요청 범위 밖 기능 추가
- 기존 문구·버튼명·화면명 임의 변경
- 관리자 기능 무단 노출
- Phase 범위 초과 구현
- AP Math 전용 규칙을 Academy OS 본체에 삽입
- 임시 파일 포함 패치
- 불필요한 `package-lock` 변경 포함
- 근거 없는 PASS 처리

---

## 7. 완료 보고 기준

작업 완료 보고에는 반드시 포함한다.

~~~markdown
# 작업 완료 보고

## 1. 생성/수정 파일

## 2. 구현 완료 또는 확인 완료

## 3. 실행 결과

## 4. 결과 요약

## 5. 다음 조치

## 6. 잘못했거나 위험했던 점

## 7. 보존해야 할 점
~~~

특히 아래는 항상 확인한다.

- 기존 문구·버튼명·화면명 임의 변경 여부
- 요청 외 UI 노출 여부
- Phase 범위 초과 여부
- DB / migration 변경 여부
- 로그인 / 세션 / 권한 회귀 위험
- 기존 주요 흐름 회귀 위험

---

## 8. 한 줄 요약

~~~text
최신 소스팩 요청 → 직접 패치 제작 → 적용용 zip + 검수용 zip + 검수요청서 제공 → 검수 PASS 후 적용/검증/배포/커밋/푸시까지 진행
~~~
