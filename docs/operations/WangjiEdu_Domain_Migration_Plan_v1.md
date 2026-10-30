# 왕지교육 서비스 도메인 이전 계획 (wangjiedu.com) v2 (최소 이전안)

- 작성: 2026-10-30 (v1.1·v1.2·v2 갱신: 2026-10-30)
- v2 갱신: 2026-10-30
- 상태: **계획 (미착수). 이전 날짜는 소유자 결정, 미정.** 이 문서만으로 실제 주소가 바뀐 것은 없다.
- **현재 금지 (소유자 지시, 2026-10-30):** Worker 설정, CORS(`ALLOWED_ORIGINS`), DNS, Pages 사용자 도메인은 아직 변경하지 않는다.
- 목적: 별도 세션이 현재 구조를 파악하고 이전을 진행할 수 있게 하는 인수인계용 계획서.
- 담당 구분:
  - **[소유자]** Cloudflare 대시보드, GitHub 저장소 설정 등 권한이 필요한 작업
  - **[코드]** 저장소 변경(브랜치 → PR → 병합)
- 선택 과제 A(주소 설정 통합) 작업 지시서(보류): [WangjiEdu_Domain_Migration_Stage1_WorkOrder_v1.md](WangjiEdu_Domain_Migration_Stage1_WorkOrder_v1.md)

### v2 변경 내역

- 소유자 사실·결정 반영(2026-10-30): 사용자는 소수다(소유자, 학원 선생님·원장님 몇 명, 학생). 학생은 학생 포털 하나로 모든 학생 기능(오답 제출·플래너 등 연결)을 쓴다. 그래서 안내 코드는 필요 없다.
- 계획을 **최소 이전안**으로 줄였다. 필수 작업은 두 가지다: ① Worker 3개의 CORS 허용 목록에 `https://wangjiedu.com` 추가, ② GitHub Pages Custom domain + Cloudflare DNS 연결. 순서는 ①이 먼저다(3절).
- 폐기: 대기열 비우기 화면, 초안 내보내기, 이전 안내 배너(v1.x 단계 1-B·1-C·1-D), 안내 코드를 N일 먼저 배포하는 조건, 학생 PIN 목록 재배포·카톡 공지의 필수 조건. 사람이 직접 안내하는 방식으로 대체했다(3절 "이전 당일 할 일").
- 선택 과제로 이동: 주소 설정 통합(v1.x 1-A), API 사용자 도메인(v1.x 단계 2), 짧은 주소(v1.x 단계 4), 정리(v1.x 단계 5). 이전과 무관하게 원할 때 한다.
- 1.4, 2.3, 5절, 6절의 해당 문구를 v2에 맞게 고쳤다.

### v1.2 변경 내역

- 소유자 결정 반영(2026-10-30):
  1. 이전 날짜는 소유자가 직접 정한다(미정). 참고 권장 시기: 2학기 기말 이후 겨울방학 초(12월 중순~말)의 주말, 시험 기간 피하기.
  2. 재로그인 안내 방법 4가지 확정(앱 안 배너, 선생님 단체방 공지, 학생·학부모 카톡 공지, 학생 PIN 목록 재배포). **v2에서 이것으로 대체되어 필수가 아니다.**
  3. 이전 때 로그인 방식은 바꾸지 않는다(2.3 신설).
  4. 추후 과제(이전과 별개) 7절 신설: 선생님 비밀번호 저장 방식 강화, 학생 포털 토큰 만료·폐기.
- 단계 3 선행 조건에 "학생 PIN 목록 재배포 완료", "안내 공지 발송" 추가(v2에서 폐기).
- 단계 1 배포 선행 일수 N(권장 7일)은 미정이었다(v2에서 해당 없음).

### v1.1 변경 내역

- 소유자 결정 일부 기록: 루트 `wangjiedu.com` = 허브, 권장안 A 채택, EIE 관리 화면 `eie-admin.wangjiedu.com`, 옛 주소 유지 기간(단계 0, 2.1, 6절).
- 보완점 4개 반영(이 중 대기열 비우기·초안 내보내기·안내 배너를 단계 1로 옮긴 부분은 v2에서 폐기):
  1. 이전 후에는 옛 출처의 저장값을 꺼낼 수 없다(1.4).
  2. 설치된 앱(서비스 워커)이 옛 출처에 남을 수 있다. CORS 제거·`workers.dev` 끄기를 서두르지 않는다(1.4, 선택 과제 D).
  3. `www` 처리를 DNS 항목에 추가.
  4. `icefoxtail.github.io` 출처는 같은 계정의 다른 저장소와 공유된다(1.4).
- 주소 설정 통합 착수 조건 명시: 화면 브랜치 `claude/jolly-carson-z0dxxs`(S20) 병합 후, S20 모듈을 확장한다. 작업 지시서 신설.

## 0. 현재 확정된 사실 (2026-10-30 기준)

| 항목 | 상태 |
|---|---|
| 도메인 | `wangjiedu.com` 구매 완료. Cloudflare DNS(네임서버 `elisa.ns.cloudflare.com`, `maxim.ns.cloudflare.com`) |
| 이미지 도메인 | `img.wangjiedu.com` → R2 버킷 사용자 도메인 연결 완료(Active) |
| 이미지 검증 | main 745b5f71 기준 `archive/assets/images/**` 9,705개(478,232,290바이트)가 `https://img.wangjiedu.com/exams/images/<경로>`에서 크기·MD5 전부 일치. 동시 16요청에도 429 없음 |
| r2.dev 주소 | `https://pub-496643d439ff4a8088346e6565ee2942.r2.dev`는 동시 16요청에서 HTTP 429 발생 → 운영 사용 금지(시험용) |
| Cloudflare API 토큰 | GitHub Actions 비밀값 `CLOUDFLARE_API_TOKEN` 등록 완료(Worker 자동 배포용, 별도 작업 S21) |
| R2 비밀값 | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`(값 열람 불가) |

## 1. 현재 구조

### 1.1 정적 사이트: GitHub Pages **한 개**에 모든 프론트엔드가 들어 있다

- 주소: `https://icefoxtail.github.io/AP------/`
- 배포: `.github/workflows/archive-pages-release.yml`(검증 관문 있음)
- 배포 대상 목록: `tools/archive-pages-release-manifest.json`
- 크기: 1GB 한도. 2026-10-30 기준 약 955MB이며, 이미지가 R2로 옮겨 가면 약 480MB가 줄어든다.

| 경로 | 화면 (`<title>`) | 대상 |
|---|---|---|
| `/` (`index.html`) | 왕지교육 — 교육 브랜드 허브 | 공개 |
| `/apmath-home/` | AP MATH — 중·고등 수학 전문관 | 공개 |
| `/eie-home/` | EIE 영어 — EiE 표현영어 | 공개 |
| `/cmath-home/` | 시매쓰 — 초등 사고력 수학관 | 공개 |
| `/apmath/` | AP Math OS (APMS, 교사용) | 교사 |
| `/apmath/student/` | AP Math OS 학생 포털 | 학생 |
| `/apmath/playground/` | AP MATH UNIVERSE (수학·도형 실험실) | 학생 |
| `/archive/` | 문제은행(Archive 2.0 workspace, 단원별 기출, 시험지 엔진 등) | 교사·학생 |
| `/eie/` | EIE 영어 관리 | 교사 |
| `/check/` | AP Math 오답 제출 | 학생 |
| `/planner/` | AP Math Planner | 학생 |
| `/shared/`, `/assets/` | 공용 모듈과 이미지 | — |

### 1.2 API: Cloudflare Workers 3개 (모두 `*.js-pdf.workers.dev`)

| Worker | 현재 주소 | 설정 파일 | 바인딩 |
|---|---|---|---|
| `ap-math-os-v2612` (APMS) | `https://ap-math-os-v2612.js-pdf.workers.dev/api` | `apmath/worker-backup/worker/wrangler.jsonc` | D1 `ap-math-os`, R2 `apmath-d1-backups`·`apmath-homework-photo`, BROWSER, Workflows `ap-math-os-d1-backup` |
| `wangji-eie-os` (EIE) | `https://wangji-eie-os.js-pdf.workers.dev` | `workers/wangji-eie-worker/wrangler.jsonc` | D1 `wangji-eie-os` |
| `wangji-common-worker` (공통) | `https://wangji-common-worker.js-pdf.workers.dev/api` | `workers/wangji-common-worker/wrangler.jsonc` | D1 `wangji-common-os` |

- 배포 방식은 지금까지 소유자가 wrangler로 직접 했다. APMS Worker는 자동 배포 작업(S21)이 진행 중이다.
- **CORS:**
  - APMS: `index.js`의 `DEFAULT_ALLOWED_ORIGINS = ['https://icefoxtail.github.io']`. 환경변수 `ALLOWED_ORIGINS`(쉼표 구분)가 있으면 그 목록이 우선한다.
  - 공통 Worker(`helpers/response.js`)도 같은 구조다.
  - EIE Worker는 `workers/wangji-eie-worker/index.js`와 `helpers/response.js`를 확인해야 한다.
  - 새 도메인을 허용 목록에 넣지 않으면 로그인과 데이터 요청이 전부 실패한다.

### 1.3 코드에 박힌 주소 (2026-10-30 main 기준)

| 주소 | 출현 수 | 대표 위치 |
|---|---|---|
| `https://icefoxtail.github.io/AP------…` | 17 | `apmath/js/archive-render.js:4`, `apmath/js/qr-omr.js:66`, `apmath/js/report-center.js:415-417`, `archive/progress.js`, `archive/native_print.js`, `apmath/wrong_print_engine.html`, Worker `helpers/archive2-questions.js`(5곳), `helpers/archive-saved-papers.js:141`(`env.ARCHIVE_PUBLIC_BASE_URL` 우선), `routes/exams.js`, `routes/exam-pdf.js`, `routes/wrong-clinics.js`, `wrangler.jsonc` |
| `https://ap-math-os-v2612.js-pdf.workers.dev/api` | 13 | `apmath/js/*` 등 프론트엔드 |
| `https://wangji-eie-os.js-pdf.workers.dev` | 2 | EIE 프론트엔드 |
| `https://wangji-common-worker.js-pdf.workers.dev/api` | 1 | 공통 |
| `R2_URL: 'https://r2.ap-math.com'` | 1 | `apmath/js/core.js:8`. 존재하지 않는 도메인이고 사용처가 없다. 이미지 주소 설정(S20)에서 정리한다 |

같은 목록을 다시 뽑는 명령:

```bash
git grep -n -I -E "icefoxtail\.github\.io|js-pdf\.workers\.dev|r2\.ap-math\.com|AP------" origin/main -- apmath eie check planner shared archive/*.js archive/*.html apmath-home eie-home cmath-home index.html apmath/worker-backup/worker workers
```

### 1.4 출처(origin)에 묶인 것: 주소가 바뀌면 사라지거나 다시 설정해야 한다

- **로그인 세션과 브라우저 저장값(localStorage):**
  - 주요 키: `APMATH_SESSION`, `APMATH_THEME`, `AP_SYNC_QUEUE`, `AP_TODAY_EXAM`, `AP_LAST_EXAM_NAME`, `AP_LAST_ARCHIVE_FILE`, `WANGJI_EIE_ROLE`, `WANGJI_EIE_LOGIN_ID`, `PLANNER_SID`, `PLANNER_PIN`, 그리고 문제지 초안과 Archive 설정.
  - **`AP_SYNC_QUEUE`는 서버로 아직 보내지 않은 작업 대기열이다.** 이전 전에 비워지게(동기화 완료) 해야 데이터 유실이 없다. 선생님·원장님께 직접 확인을 부탁한다(3절 "이전 당일 할 일").
  - **옛 출처의 저장값은 이전 후 꺼낼 수 없다.** Pages에 사용자 도메인을 붙이는 즉시 GitHub이 옛 주소를 새 주소로 넘기므로 옛 출처(`icefoxtail.github.io`)의 페이지가 더 이상 열리지 않고, 그 출처의 localStorage에 접근할 방법이 없어진다. v2는 이를 위한 대기열 비우기·내보내기 코드를 만들지 않는다. 대신 사람이 이전 전에 동기화를 확인하고, 문제지 초안 등 브라우저 저장값은 새 주소에서 사라진다는 점을 안내한다(저장·출력이 필요하면 이전 전에 한다).
  - **`icefoxtail.github.io` 출처는 같은 계정의 다른 저장소 Pages와 공유된다.** 다른 저장소(예: my-life-os)가 Pages를 쓰면 브라우저 저장값이 같은 출처에 섞여 있다. 사용자 도메인 이동은 AP------ 경로(`/AP------/…`)에만 적용되고 다른 저장소에는 영향이 없다. 저장값을 비우거나 내보내는 코드는 AP------가 쓰는 키만 다뤄야 하고 다른 키를 지우면 안 된다.
- **같은 출처를 전제로 한 공유:** 문제은행(`/archive/`)이 APMS의 `APMATH_SESSION`(교사 세션)을 읽는다. 예: `archive/unit-past-exams.js`의 교사 확인. 그래서 **APMS와 archive를 서로 다른 하위 도메인(다른 출처)으로 나누면 교사 인증 공유가 깨진다.**
- **서비스 워커(앱 설치):** `apmath/service-worker.js`(APMS)와 `apmath/student/sw.js`(학생 포털). 새 출처에서는 다시 설치·등록해야 하고, 홈 화면에 추가한 앱도 다시 추가해야 한다.
  - **설치된 앱이 옛 출처에 남을 수 있다.** 서비스 워커가 옛 화면을 캐시로 계속 보여 주면 일부 기기는 이동되지 않고 옛 출처에서 옛 API 주소로 요청을 계속할 수 있다. 그래서 `github.io` CORS 허용은 최소 4주 유지하고 `workers.dev`는 계속 쓴다(3절). 학생 포털(`apmath/student/sw.js`)이 특히 해당한다.
- **인쇄된 QR 코드:** `apmath/js/qr-omr.js`가 만든 OMR QR은 `icefoxtail.github.io/AP------/archive/`를 가리킨다. 이미 인쇄된 종이가 있으므로 옛 주소가 계속 열려야 한다. GitHub Pages에 사용자 도메인을 붙이면 옛 주소가 새 주소로 자동 이동된다. 경로는 유지되고 `/AP------` 접두어만 빠진다.
- 외부 로그인(Google/Kakao)은 사용하지 않는다(main 기준 검색 결과 없음). 그래서 OAuth 리다이렉트 주소를 바꿀 필요는 없다.

## 2. 목표 주소 구조 (권장안 A 채택, 세부 일부 미정)

### 2.1 권장안 A (채택): 출처 하나 + 짧은 하위 주소는 경로로 넘기기

- 사이트 전체(Pages 한 개)를 **`https://wangjiedu.com`** 한 출처에 둔다.
  - 경로가 `/apmath/`, `/archive/`, `/apmath/student/` …로 그대로 유지된다.
  - APMS와 archive의 세션 공유도 그대로다.
- 루트 `wangjiedu.com`은 왕지교육 허브(현재 `/index.html`)이고, `www.wangjiedu.com`은 루트로 이동한다(소유자 결정).
- 짧은 주소는 Cloudflare **Redirect Rules**로 경로에 넘긴다(선택 과제 C). 주소창은 최종 경로로 바뀐다.

| 짧은 주소 | 이동할 곳 |
|---|---|
| `apmath.wangjiedu.com` | `https://wangjiedu.com/apmath-home/` |
| `eie.wangjiedu.com` | `https://wangjiedu.com/eie-home/` |
| `cmath.wangjiedu.com` | `https://wangjiedu.com/cmath-home/` |
| `apms.wangjiedu.com` | `https://wangjiedu.com/apmath/` |
| `student.wangjiedu.com` | `https://wangjiedu.com/apmath/student/` |
| `archive.wangjiedu.com` | `https://wangjiedu.com/archive/` |
| `lab.wangjiedu.com` | `https://wangjiedu.com/apmath/playground/` |
| `check.wangjiedu.com` / `planner.wangjiedu.com` | `https://wangjiedu.com/check/` / `/planner/` |
| 시매쓰 관리 화면 | 아직 없음 → 보류 |
| `eie-admin.wangjiedu.com` | `https://wangjiedu.com/eie/` |

- API 사용자 도메인은 선택 과제 B다. 이전 필수 범위에서는 `workers.dev` 주소를 그대로 쓴다. 아래는 선택 과제 B를 할 때의 목표다.

| 주소 | Worker |
|---|---|
| `api.wangjiedu.com` | `ap-math-os-v2612` |
| `eie-api.wangjiedu.com` | `wangji-eie-os` |
| `common-api.wangjiedu.com` | `wangji-common-worker` |

- 이미지: `img.wangjiedu.com`(연결 완료).

### 2.2 대안 B: 앱마다 진짜 하위 도메인 출처 (지금은 비권장)

- `apms.wangjiedu.com`이 주소창에 그대로 남는 방식이다. Pages를 저장소 여러 개로 나누거나 Cloudflare Worker 프록시를 써야 한다.
- 출처가 갈라져서 세션 공유(1.4)를 다시 설계해야 한다.
- Cloudflare Pages로 옮기는 경우 무료 플랜 배포당 파일 20,000개 한도에 걸린다. 현재 패키지는 20,145개이므로 이미지 이전 뒤에야 가능하다.

### 2.3 로그인 (이전 때 바꾸지 않음)

- 이전 때 로그인 방식은 바꾸지 않는다. 선생님은 아이디·비밀번호, 학생은 이름+PIN 그대로다.
- 출처가 바뀌므로 사용자는 새 주소에서 같은 정보로 **한 번 다시 로그인**한다(1.4). 안내는 3절 "이전 당일 할 일"을 본다.
- Google·카카오·이메일 로그인과 쿠키 세션 전환은 검토했으나 이번 이전 범위에서 제외한다. 필요해지면 별도 작업으로 한다. 자기 도메인이 있으므로 이후에도 가능하다.

## 3. 단계별 진행 계획 (v2 최소 이전)

사용자는 소수(소유자, 선생님·원장님 몇 명, 학생)이고 학생은 학생 포털 하나로 모든 기능을 쓴다. 그래서 필수 작업은 두 가지뿐이다. 각 단계는 **바로 되돌릴 수 있게** 한다. 옛 주소는 끊지 않는다.

### 단계 0. 결정 [소유자]
- [x] 2.1 권장안 A 채택
- [x] 루트 `wangjiedu.com` = 왕지교육 허브, `www.wangjiedu.com` → 루트로 이동
- [x] EIE 관리 화면 짧은 주소 = `eie-admin.wangjiedu.com`(선택 과제 C에서 적용)
- [x] 옛 주소 유지 기간: `github.io` 출처의 Worker CORS 허용은 이전 후 최소 4주(서두르지 않음), `workers.dev` 주소는 계속 사용
- [x] 로그인 방식은 이전 때 바꾸지 않는다(2.3)
- [x] 안내 코드(대기열 비우기 화면, 초안 내보내기, 이전 안내 배너)는 만들지 않는다(v2)
- [ ] 시매쓰 관리 화면 짧은 주소(관리 화면이 아직 없어 보류)
- [ ] 이전 날짜: 소유자가 직접 결정(미정). 참고 권장: 2학기 기말 이후 겨울방학 초(12월 중순~말)의 주말, 시험 기간 피하기.

### 왜 이것으로 충분한가
- Pages에 사용자 도메인을 붙이면 `icefoxtail.github.io/AP------/…` 옛 주소는 경로를 유지한 채 새 주소로 자동 이동한다. 코드 안 하드코딩 링크, 북마크, 인쇄된 OMR QR이 그대로 동작한다.
- API는 `workers.dev` 주소를 그대로 써도 된다.
- 서비스 워커로 설치된 앱(특히 학생 포털 `apmath/student/sw.js`)은 캐시 때문에 옛 출처에 남을 수 있다. 그래도 `github.io` CORS 허용을 유지하는 동안 계속 동작한다. 그래서 `github.io` CORS는 **최소 4주** 유지하고(서두르지 않음) `workers.dev`는 계속 사용한다.

### 단계 1 (필수). Worker CORS에 새 도메인 추가 [코드/소유자]
**이 작업은 단계 2(Pages 도메인 연결)보다 먼저, 늦어도 같은 날 직전에 한다.** 새 주소가 열리는 순간 CORS가 막혀 있으면 로그인과 데이터 요청이 전부 실패한다.
- [ ] Worker 3개의 CORS 허용 목록에 `https://wangjiedu.com`을 **추가**한다. `https://icefoxtail.github.io`는 유지한다(허용 목록: `https://icefoxtail.github.io`, `https://wangjiedu.com`).
  - APMS `ap-math-os-v2612`: `index.js`의 `DEFAULT_ALLOWED_ORIGINS` 또는 환경변수 `ALLOWED_ORIGINS`(1.2). 환경변수가 이미 설정돼 있으면 그 목록이 우선하므로 대시보드 값을 먼저 확인한다.
  - 공통 `wangji-common-worker`: `helpers/response.js`(같은 구조).
  - EIE `wangji-eie-os`: 구조는 착수 시 확인한다(`workers/wangji-eie-worker/index.js`, `helpers/response.js`).
- [ ] [소유자] 세 Worker를 배포한다(wrangler 또는 대시보드 변수).
- 검증: `Origin: https://wangjiedu.com` 요청에 세 Worker 모두 `Access-Control-Allow-Origin`이 돌아오는지, `Origin: https://icefoxtail.github.io`도 여전히 돌아오는지 확인한다.
- 되돌리기: 추가한 항목을 빼고 다시 배포한다(옛 출처는 영향 없음).

### 단계 2 (필수). Pages 사용자 도메인 + DNS [소유자]
- **착수 조건:** 단계 1이 배포되어 있다. 단계 0의 이전 날짜가 소유자 결정으로 정해져 있다.
- [ ] GitHub → 저장소 Settings → Pages → Custom domain에 `wangjiedu.com`을 넣고 **Enforce HTTPS**를 켠다.
  - 먼저 계정 Settings → Pages → **Verified domains**에서 도메인 소유를 인증하면 도메인 탈취를 막을 수 있다(권장).
  - Actions 배포 방식이므로 CNAME 파일은 필요 없다.
- [ ] Cloudflare DNS에 루트 `wangjiedu.com` → GitHub Pages를 연결한다. A 레코드 `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` 4개나 `icefoxtail.github.io`로의 CNAME 평탄화 중 하나를 쓴다.
  - 인증서 발급 전까지 **프록시 끄기(DNS only)** 로 둔다.
  - 프록시를 켜려면 SSL 모드를 Full로 한다.
- [ ] `www`: Pages Custom domain에는 루트 `wangjiedu.com`을 넣고, Cloudflare DNS에 `www` CNAME → `icefoxtail.github.io`(DNS only)를 둔다. 그러면 GitHub이 `www`를 루트로 자동 이동시킨다.
- [ ] [코드] 사이트 경로 접두어 `/AP------/`에 기대는 코드가 없는지 다시 확인한다(2026-10-30 검색 결과 pathname 의존 코드 없음). 서비스 워커 2개의 범위·캐시 이름을 확인하고 새 출처에서 첫 설치가 정상인지 본다.
- 되돌리기: Pages Custom domain을 비우면 즉시 `github.io` 주소로 돌아간다.

### 이전 당일 할 일 (사람 안내)
- **선생님·원장님께 직접:**
  - 이전 전에 APMS에서 동기화가 끝났는지 확인한다(`AP_SYNC_QUEUE`가 비어 있는 상태).
  - 이전 후 새 주소에서 같은 아이디·비밀번호로 다시 로그인한다.
- **학생:** 새 주소(또는 옛 주소 → 자동 이동)에서 이름+PIN으로 한 번 다시 로그인한다. PIN을 잊은 학생은 선생님이 APMS에서 확인해 알려 준다.
- 카톡 공지, 학생 PIN 목록 재배포, 앱 안 배너는 **필수가 아니다.**
- 문제지 초안 등 브라우저 저장값은 새 주소에서 사라진다. 필요하면 이전 전에 저장하거나 출력해 둔다.

### 검증 (이전 당일)
- 옛 주소 `https://icefoxtail.github.io/AP------/archive/...`이 경로를 유지한 채 새 주소로 넘어가는지 확인한다. 인쇄된 OMR QR 샘플로도 확인한다.
- 새 주소에서 APMS 로그인, 학생 포털 로그인, 문제은행 시험지 열기, EIE 화면이 CORS 오류 없이 동작하는지 PC·휴대폰에서 확인한다.
- 배포 관문(`archive-pages-release.yml`)의 사이트 Chrome 검사 `tools/check-archive-pages-site-browser.cjs`가 새 주소 기준으로도 맞는지 확인한다.
- 되돌리기: Pages Custom domain 비우기 → 즉시 `github.io`로 복귀.

### 선택 과제 (원할 때, 이전과 무관)
- **A. 주소 설정 통합** (v1.x 단계 1의 1-A): 사이트 기준 주소, API 주소 3개, 이미지 주소를 S20 이미지 주소 모듈을 확장해 한곳에서 읽게 한다. 화면 브랜치 `claude/jolly-carson-z0dxxs`(S20) 병합 후에 한다. 작업 지시서(보류): [WangjiEdu_Domain_Migration_Stage1_WorkOrder_v1.md](WangjiEdu_Domain_Migration_Stage1_WorkOrder_v1.md)
- **B. API 사용자 도메인** (v1.x 단계 2): Cloudflare → Workers → 각 Worker → Settings → Domains & Routes → Add Custom Domain으로 `api.`, `eie-api.`, `common-api.wangjiedu.com`을 연결한다. 연결 뒤 프론트엔드의 API 주소를 바꾸려면 선택 과제 A가 먼저 있는 편이 쉽다. `workers.dev`는 끄지 않는다.
- **C. 짧은 주소** (v1.x 단계 4): Cloudflare → `wangjiedu.com` → Rules → Redirect Rules로 2.1 표대로 301을 건다(`eie-admin` 포함). 하위 주소 DNS는 프록시를 켠 placeholder 레코드가 필요하다. 검증: 각 짧은 주소 → 최종 경로.
- **D. 정리** (v1.x 단계 5, 사실상 선택): `github.io` CORS 제거는 이전 후 최소 4주 이후에 결정한다. **인쇄된 QR 때문에 Pages의 옛 주소 이동 기능은 유지**해야 하며, 사용자 도메인이 붙어 있는 동안 자동으로 유지된다. `workers.dev` 비활성화는 최소 3개월 이후에 결정한다. 관련 정본 문서(AGENTS.md의 주소 언급, 운영 문서)도 갱신한다.
- 7절 추후 과제(비밀번호 해시, 학생 토큰 만료)는 이전과 별개로 그대로 둔다.

## 4. 반드시 지켜야 할 기존 규칙 (요약)

- Archive 2.0 런타임 계약: 구현·병합 전에 `node tools/check-archive2-runtime.cjs`, 흐름을 바꾸면 실제 Chrome 검증까지 한다. 정본은 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`.
- 원본 시험지 직접 열기 경로 `archive/engine.html?data=exams/<file>&mode=exam|sol|ans`는 그대로 유지한다.
- 학생 사이트 배포는 검증 관문을 통과해야 한다(2026-10-29 사용자 결정, `docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md`). 병합은 CI와 독립이다.
- 검증하지 않은 항목을 PASS로 기록하지 않는다.

## 5. 함께 진행 중인 관련 작업 (2026-10-30)

| 작업 | 내용 | 상태 |
|---|---|---|
| PR #1001 | 메타 등록 건별 처리, 배포 검증 관문, CI 신호 정리 | main 병합 |
| PR #1024 | Pages 패키지 1GB 이내 축소(954.7MB) | main 병합, 첫 배포 확인 중 |
| S20 (화면 브랜치 `claude/jolly-carson-z0dxxs`) | 시험지 이미지 주소를 설정 하나로(기본값 현재 주소, `img.wangjiedu.com` 전환 준비). 선택 과제 A(주소 통합)가 이 모듈을 확장 | 진행 중 |
| S21 (인프라 브랜치 `claude/jolly-carson-z0dxxs-infra`) | APMS Worker 테스트 통과 후 자동 배포 + Pages보다 먼저 배포되는 순서 관문 | 예정 |
| 이미지 전환 | 설정을 `https://img.wangjiedu.com`으로 바꾼 뒤 Pages 패키지에서 이미지 제외(−약 480MB) | S20 이후 |

## 6. 소유자 질문과 답변 (2026-10-30)

| # | 질문 | 답변 |
|---|---|---|
| 1 | 루트 `wangjiedu.com`에 허브를 둘 것인가, `www`를 따로 둘 것인가? | 루트 = 왕지교육 허브(현재 `/index.html`). `www.wangjiedu.com` → 루트로 이동 |
| 2 | EIE 관리 화면과 시매쓰 관리 화면의 짧은 주소 이름은? | EIE 관리 = `eie-admin.wangjiedu.com`. 시매쓰 관리 화면은 아직 없음 → 보류 |
| 3 | 이전 날짜와 재로그인 안내 방법은? | 날짜: 소유자가 직접 정한다(미정). 참고 권장: 2학기 기말 이후 겨울방학 초(12월 중순~말)의 주말, 시험 기간 피하기. 안내: 선생님·원장님께 직접 안내, 학생은 재로그인만(v2). 카톡 공지·PIN 목록 재배포·앱 배너는 필수 아님 |
| 4 | 옛 주소를 얼마나 유지할 것인가? | `github.io` 출처의 Worker CORS 허용: 이전 후 최소 4주(서두르지 않음). `workers.dev` 주소: 계속 사용(비활성화는 최소 3개월 이후, 사실상 선택) |
| 5 | 안내 코드를 이전보다 며칠 먼저 배포할 것인가? | 해당 없음(v2에서 안내 코드 폐기) |
| 6 | 이전 때 로그인 방식을 바꿀 것인가? | 바꾸지 않는다. 선생님 아이디·비밀번호, 학생 이름+PIN 그대로. Google·카카오·이메일 로그인과 쿠키 세션 전환은 이번 범위에서 제외(2.3) |

## 7. 추후 과제 (이전과 별개, 화면 변화 없음, 급하지 않음)

도메인 이전 일정과 묶지 않는다. 위치는 2026-10-30 main 기준 검색으로 확인했다.

| # | 과제 | 현재 상태 | 위치 |
|---|---|---|---|
| 1 | 선생님 비밀번호 저장 방식 강화 | 솔트 없는 SHA-256으로 저장·비교한다 | `apmath/worker-backup/worker/helpers/admin-db.js`의 `sha256hex`, `apmath/worker-backup/worker/routes/auth.js` 로그인(21행)·비밀번호 변경(70행) |
| 2 | 학생 포털 토큰 만료·폐기 | 토큰이 학생 번호+PIN으로 결정적으로 계산되어 만료가 없고, PIN을 바꾸기 전에는 끊을 수 없다 | `apmath/worker-backup/worker/routes/student-portal.js`의 `buildStudentPortalToken`(같은 이름의 함수가 `routes/study-material-wrongs.js`에도 있으므로 함께 고친다) |
