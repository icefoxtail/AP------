# HOMEPAGE_STRUCTURE_PLAN

갱신일: 2026-05-29

---

## 1. 현재 적용된 구조

```
AP------/  (https://icefoxtail.github.io/AP------/)
├─ index.html                    ← 왕지교육 큰 대문
├─ apmath-home/index.html        ← AP MATH 소개 대문
├─ apmath/index.html             ← 기존 AP Math OS 운영 앱 (절대 보존)
├─ apmath/student/               ← 기존 학생 포털 (절대 보존)
└─ archive/                      ← 기존 아카이브 (절대 보존)
```

---

## 2. 링크 정책 (상대경로 기준)

### 왕지교육 큰 대문 (index.html, / 기준)

| 버튼/CTA | 링크 | 비고 |
|---------|------|------|
| AP MATH | apmath-home/ | 상대경로 |
| EIE English | https://blog.naver.com/wha6615 | 외부 |
| CMath | #inquiry | 준비중 |
| 상담 문의 | #inquiry | 앵커 |
| 브랜드 보기 | #brands | 앵커 |
| FAQ | #faq | 앵커 |

### AP MATH 소개 대문 (apmath-home/index.html, /apmath-home/ 기준)

| 버튼/CTA | 링크 | 비고 |
|---------|------|------|
| 학습 관리 로그인 | ../apmath/ | 상대경로 |
| 학생 포털 | ../apmath/student/ | 상대경로 |
| 아카이브 | ../archive/ | 상대경로 |
| 왕지교육 홈 | ../ | 상대경로 |
| 상담 문의 | #inquiry | 앵커 |

---

## 3. 보존 경로

- apmath/index.html 수정 금지
- apmath/student/ 이동/삭제 금지
- archive/ 이동/삭제 금지

---

## 4. 적용 파일

- 왕지교육.html → index.html (적용 완료 2026-05-29)
- apmath.html → apmath-home/index.html (적용 완료 2026-05-29)

---

## 5. 보정 이력

| 날짜 | 내용 |
|------|------|
| 2026-05-29 | index.html 적용, /apmath/ → apmath-home/ 링크 보정 |
| 2026-05-29 | apmath-home/index.html 적용, 시안용 로그인 모달 제거 |
| 2026-05-29 | index.html: /apmath-home/ → apmath-home/ (절대→상대경로) |
| 2026-05-29 | apmath-home/index.html: /apmath/, /apmath/student/, /archive/ → ../apmath/, ../apmath/student/, ../archive/ (절대→상대경로) |

---

## 6. 다음 작업

- 로컬 브라우저 확인 (HOMEPAGE_LOCAL_CHECK.md 참고)
- GitHub Pages 배포 후 링크 클릭 확인
- 도메인 이전 계획 확정 (docs/WANGJI_DOMAIN_MIGRATION_PLAN.md 참고)
- /eie/ 내용 점검 및 공개 여부 결정
- Worker 인증 감사 (docs/APMATH_ACCESS_CONTROL_NEXT_PLAN.md 참고)
