# HOMEPAGE_STRUCTURE_PLAN

갱신일: 2026-05-30

---

## 1. 현재 적용 구조

```text
AP------/  (https://icefoxtail.github.io/AP------/)
├─ index.html                    ← 왕지교육 큰 대문
├─ apmath-home/index.html        ← AP MATH 소개 대문
├─ eie-home/index.html           ← EIE 영어 공개 소개 대문
├─ cmath-home/index.html         ← 시매쓰수학 공개 소개 대문
├─ apmath/index.html             ← 기존 AP Math OS 운영 앱 (절대 보존)
├─ apmath/student/               ← 기존 학생 포털 (절대 보존)
├─ archive/                      ← 기존 아카이브 (절대 보존)
└─ eie/index.html                ← EIE 내부 관리 앱 (공개 소개 페이지 아님)
```

---

## 2. 링크 정책

### 왕지교육 큰 대문 (index.html, / 기준)

| 버튼/CTA | 링크 | 비고 |
|---------|------|------|
| AP MATH | apmath-home/ | 상대경로 |
| EIE 영어 PC 브랜드 카드 | eie-home/ | 공개 소개 페이지 |
| EIE 영어 모바일 컴팩트 메인 | https://blog.naver.com/wha6615 | 원장님 블로그 노출 우선 |
| EIE 영어 모바일 컴팩트 보조 | eie-home/ | 영어관 소개 |
| CMath | cmath-home/ | 공개 소개 페이지 |
| 블로그 | https://blog.naver.com/wha6615 | 헤더/모바일 메뉴/푸터 유지 |
| 상담 문의 | #inquiry | 앵커 |
| 브랜드 보기 | #brands | 앵커 |
| FAQ | #faq | 앵커 |

### AP MATH 소개 대문 (apmath-home/index.html, /apmath-home/ 기준)

| 버튼/CTA | 링크 | 비고 |
|---------|------|------|
| 학습 관리 로그인 | ../apmath/ | 상대경로 |
| 학생 포털 | ../apmath/student/ | 상대경로 |
| 아카이브 | ../archive/ | 상대경로 |
| EIE 영어 | ../eie-home/ | 상대경로 |
| 시매쓰수학 | ../cmath-home/ | 상대경로 |
| 왕지교육 홈 | ../ | 상대경로 |
| 상담 문의 | #inquiry | 앵커 |

### EIE 영어 소개 대문 (eie-home/index.html, /eie-home/ 기준)

| 버튼/CTA | 링크 | 비고 |
|---------|------|------|
| 왕지교육 홈 | ../ | 상대경로 |
| AP MATH | ../apmath-home/ | 상대경로 |
| 시매쓰수학 | ../cmath-home/ | 상대경로 |
| EIE 블로그 | https://blog.naver.com/wha6615 | 수업 소식 채널 |
| 상담 문의 | #inquiry | 앵커 |

### 시매쓰수학 소개 대문 (cmath-home/index.html, /cmath-home/ 기준)

| 버튼/CTA | 링크 | 비고 |
|---------|------|------|
| 왕지교육 홈 | ../ | 상대경로 |
| AP MATH | ../apmath-home/ | 상대경로 |
| EIE 영어 | ../eie-home/ | 상대경로 |
| 상담 문의 | #inquiry | 앵커 |

---

## 3. 보존 경로

- apmath/index.html 수정 금지
- apmath/student/ 이동/삭제 금지
- archive/ 이동/삭제 금지
- eie/index.html은 내부 관리 앱으로 공개 소개 페이지와 분리
- 한글 파일명/기존 백업 파일은 직접 삭제/이름변경하지 않음

---

## 4. 적용 파일

- index.html
- apmath-home/index.html
- eie-home/index.html
- cmath-home/index.html
- docs/WANGJI_PUBLIC_SITE_ROUTE_MAP.md
- HOMEPAGE_STRUCTURE_PLAN.md

---

## 5. 보정 이력

| 날짜 | 내용 |
|------|------|
| 2026-05-29 | index.html 적용, /apmath/ → apmath-home/ 링크 보정 |
| 2026-05-29 | apmath-home/index.html 적용, 시안용 로그인 모달 제거 |
| 2026-05-30 | 모바일 컴팩트/지도 카드/하단 CTA 보강 |
| 2026-05-30 | EIE/CMath 공개 소개 페이지 경로 추가 |
| 2026-05-30 | EIE 모바일 컴팩트 정책 확정: 메인 블로그, 보조 영어관 소개 |

---

## 6. 다음 작업

- 로컬 브라우저에서 index.html, apmath-home/index.html, eie-home/index.html, cmath-home/index.html 확인
- GitHub Pages 배포 후 전체 링크 클릭 확인
- EIE 내부 관리 앱(/eie/)과 공개 소개 페이지(/eie-home/) 혼동 여부 확인
- 도메인 이전 계획 확정
