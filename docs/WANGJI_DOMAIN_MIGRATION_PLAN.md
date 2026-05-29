# WANGJI_DOMAIN_MIGRATION_PLAN

작성일: 2026-05-29

---

## 현재 상태

| 항목 | 값 |
|------|----|
| 현재 배포 URL | https://icefoxtail.github.io/AP------/ |
| 왕지교육 큰 대문 | / |
| AP MATH 소개 대문 | /apmath-home/ |
| 기존 운영 앱 | /apmath/ |
| 학생 포털 | /apmath/student/ |
| 아카이브 | /archive/ |

---

## 도메인 이전 후 목표 구조 (안)

### 안 A: 단일 도메인 + 하위 경로

```
wangjiedu.com/                   ← 왕지교육 큰 대문
wangjiedu.com/apmath/            ← AP MATH 브랜드 소개 대문 (현 apmath-home/)
wangjiedu.com/apmath/app/        ← 기존 운영 앱 (현 apmath/)
wangjiedu.com/apmath/student/    ← 학생 포털
wangjiedu.com/archive/           ← 아카이브
wangjiedu.com/eie/               ← EIE (외부 블로그 또는 내부)
wangjiedu.com/cmath/             ← CMath (준비중)
```

**장점**: 단순 구조, 관리 쉬움  
**단점**: 운영 앱과 브랜드 대문이 같은 도메인에 혼재

---

### 안 B: 서브도메인 분리 (권장)

```
wangjiedu.com/                   ← 왕지교육 큰 대문
apmath.wangjiedu.com/            ← AP MATH 브랜드 소개 대문
app.wangjiedu.com/               ← 기존 운영 앱 (또는 apmath.wangjiedu.com/app/)
student.wangjiedu.com/           ← 학생 포털 (또는 apmath.wangjiedu.com/student/)
archive.wangjiedu.com/           ← 아카이브
```

**장점**: 브랜드/운영 분리 명확, 서브도메인별 보안 정책 가능  
**단점**: DNS 설정 복잡, Cloudflare 설정 필요

---

## 이전 시 필수 보정 사항

### 경로 변경이 있을 경우

현재 `apmath/` 경로가 이전 후 달라진다면:

1. `apmath-home/index.html`의 `../apmath/` 링크를 새 경로로 업데이트
2. `index.html`의 `apmath-home/` 링크를 새 경로로 업데이트
3. Worker 엔드포인트 URL도 별도 업데이트 필요

### GitHub Pages → Cloudflare Pages 이전 고려

- Cloudflare Pages는 Worker 통합이 자연스럽다.
- 경로별 접근 제어(미들웨어)를 지원한다.
- 현재 Worker 코드 재사용이 가능하다.

---

## 주의 사항

**현재 /apmath/가 운영 앱이므로, 도메인 이전 시 운영 앱 경로 변경은 별도 작업으로 분리한다.**

이유:
- 현재 학생/선생님이 bookmarked URL을 사용하고 있을 수 있다.
- Worker 엔드포인트가 특정 Origin을 허용하도록 설정되어 있을 수 있다.
- 이전 시 기존 URL 유지 또는 리다이렉트 처리가 필요하다.

---

## 이전 단계별 계획

### 1단계: 도메인 구입 및 DNS 설정 (별도 진행)
- wangjiedu.com 또는 유사 도메인 구입
- Cloudflare DNS 등록

### 2단계: 브랜드 대문만 먼저 이전 (안전)
- 왕지교육 큰 대문(/) + AP MATH 소개 대문(/apmath-home/)만 새 도메인에 적용
- 기존 운영 앱은 GitHub Pages URL 유지

### 3단계: 운영 앱 이전 (별도 작업)
- 학생/선생님 공지 후 URL 이전
- 리다이렉트 처리 확인
- Worker 엔드포인트 Origin 업데이트

### 4단계: 아카이브 이전 (별도 작업)
- 아카이브 경로 이전 및 링크 정리
