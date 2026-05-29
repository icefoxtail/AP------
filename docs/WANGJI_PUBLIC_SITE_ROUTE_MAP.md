# WANGJI_PUBLIC_SITE_ROUTE_MAP

작성일: 2026-05-29  
갱신일: 2026-05-30  
기준 배포: https://icefoxtail.github.io/AP------/

---

## 현재 공개 구조

```text
AP------/  (= https://icefoxtail.github.io/AP------/)
│
├─ index.html                      ← 왕지교육 큰 대문 (브랜드 허브)
│
├─ apmath-home/
│  └─ index.html                   ← AP MATH 소개 대문 (브랜드 소개 + 빠른 입장)
│
├─ eie-home/
│  └─ index.html                   ← EIE 영어 공개 소개 대문
│
├─ cmath-home/
│  └─ index.html                   ← 시매쓰수학 공개 소개 대문
│
├─ apmath/
│  ├─ index.html                   ← AP Math OS 운영 앱 진입점
│  ├─ student/index.html           ← 학생 포털 (PIN 필요)
│  ├─ homework/index.html          ← 과제 제출 (PIN+로그인)
│  ├─ planner/index.html           ← 플래너 (PIN+로그인)
│  └─ wrong_print_engine.html      ← 오답 클리닉 출력 도구 (PIN)
│
├─ archive/
│  ├─ index.html                   ← JS아카이브 메인 (로그인)
│  ├─ engine.html                  ← 아카이브 출력 엔진 (PIN+로그인)
│  ├─ mixed_engine.html            ← 믹서 출력 (PIN+로그인)
│  └─ mixer.html                   ← 믹서 편집 (PIN+로그인)
│
├─ eie/
│  └─ index.html                   ← EIE 내부 관리 앱 (공개 소개 페이지 아님)
│
├─ planner/
│  └─ index.html                   ← 루트 레벨 플래너 (PIN+로그인)
│
├─ manual/
│  └─ index.html                   ← AP Math OS 사용설명서 (공개)
│
└─ check/
   └─ index.html                   ← 오답 제출 (공개)
```

---

## 진입 흐름도

```text
방문자
  │
  ▼
왕지교육 큰 대문 (/)
  ├─ AP MATH → /apmath-home/
  │     └─ 학습 관리 로그인 → /apmath/
  │     └─ 학생 포털 → /apmath/student/
  │     └─ 아카이브 → /archive/
  │     └─ 왕지교육 홈 → /
  │
  ├─ EIE 영어 → /eie-home/
  │     └─ 블로그 보기 → https://blog.naver.com/wha6615
  │     └─ 왕지교육 홈 → /
  │
  └─ 시매쓰수학 → /cmath-home/
        └─ 왕지교육 홈 → /
```

---

## 링크 정책 요약

| 출발지 | 링크 | 목적지 |
|--------|------|--------|
| / | AP MATH | apmath-home/ |
| / | EIE 영어 PC 브랜드 진입 | eie-home/ |
| / | EIE 영어 모바일 컴팩트 메인 | https://blog.naver.com/wha6615 |
| / | EIE 영어 모바일 컴팩트 보조 | eie-home/ |
| / | CMath | cmath-home/ |
| / | 블로그 | https://blog.naver.com/wha6615 |
| / | 상담 문의 | #inquiry |
| /apmath-home/ | 학습 관리 로그인 | ../apmath/ |
| /apmath-home/ | 학생 포털 | ../apmath/student/ |
| /apmath-home/ | 아카이브 | ../archive/ |
| /apmath-home/ | EIE 영어 | ../eie-home/ |
| /apmath-home/ | 시매쓰수학 | ../cmath-home/ |
| /apmath-home/ | 왕지교육 홈 | ../ |
| /eie-home/ | 왕지교육 홈 | ../ |
| /eie-home/ | AP MATH | ../apmath-home/ |
| /eie-home/ | 시매쓰수학 | ../cmath-home/ |
| /eie-home/ | 공식 블로그 | https://blog.naver.com/wha6615 |
| /cmath-home/ | 왕지교육 홈 | ../ |
| /cmath-home/ | AP MATH | ../apmath-home/ |
| /cmath-home/ | EIE 영어 | ../eie-home/ |

---

## GitHub Pages 경로 노트

현재 배포 URL: `https://icefoxtail.github.io/AP------/`

- 절대경로 `/apmath/`는 `https://icefoxtail.github.io/apmath/`로 해석되어 깨진다.
- 반드시 상대경로를 사용한다.
  - `/`에서: `apmath-home/`, `eie-home/`, `cmath-home/`, `apmath/`, `archive/`
  - `/apmath-home/`에서: `../apmath/`, `../apmath/student/`, `../archive/`, `../eie-home/`, `../cmath-home/`, `../`
  - `/eie-home/`에서: `../apmath-home/`, `../cmath-home/`, `../`
  - `/cmath-home/`에서: `../apmath-home/`, `../eie-home/`, `../`

2026-05-30 기준 EIE/CMath 공개 소개 페이지 경로 추가 및 상대경로 보정 완료.
