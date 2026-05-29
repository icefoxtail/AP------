# HOMEPAGE_LOCAL_CHECK

작성일: 2026-05-29

---

## 1. 로컬 서버 실행

```
cd C:\Users\USER\Desktop\AP------
python -m http.server 8080
```

python이 안 되면:

```
py -m http.server 8080
```

---

## 2. 확인 주소

### 로컬

| 역할 | 주소 |
|------|------|
| 왕지교육 큰 대문 | http://localhost:8080/ |
| AP MATH 소개 대문 | http://localhost:8080/apmath-home/ |
| 기존 AP Math OS 운영 앱 | http://localhost:8080/apmath/ |
| 학생 포털 | http://localhost:8080/apmath/student/ |
| 아카이브 | http://localhost:8080/archive/ |

### GitHub Pages

| 역할 | 주소 |
|------|------|
| 왕지교육 큰 대문 | https://icefoxtail.github.io/AP------/ |
| AP MATH 소개 대문 | https://icefoxtail.github.io/AP------/apmath-home/ |
| 기존 AP Math OS 운영 앱 | https://icefoxtail.github.io/AP------/apmath/ |
| 학생 포털 | https://icefoxtail.github.io/AP------/apmath/student/ |
| 아카이브 | https://icefoxtail.github.io/AP------/archive/ |

---

## 3. 확인 항목

### 왕지교육 큰 대문 (/)
- [ ] 한글 깨짐 없음
- [ ] AP MATH 버튼 → apmath-home/ 이동 (상대경로)
- [ ] EIE 버튼 → https://blog.naver.com/wha6615 이동
- [ ] CMath → #inquiry 또는 준비중
- [ ] 상담 문의, 브랜드 보기, FAQ 앵커 정상

### AP MATH 소개 대문 (/apmath-home/)
- [ ] 한글 깨짐 없음
- [ ] 학습 관리 로그인 → ../apmath/ 이동 (상대경로)
- [ ] 학생 포털 → ../apmath/student/ 이동
- [ ] 아카이브 → ../archive/ 이동
- [ ] 왕지교육 홈 → ../ 이동
- [ ] 시안용 로그인 모달 없음
- [ ] data-open-login 없음

### 기존 운영 앱 (/apmath/)
- [ ] 기존 로그인/운영 화면 정상 표시
- [ ] Worker 연결 정상

---

## 4. GitHub Pages 하위경로 링크 주의

현재 배포: `https://icefoxtail.github.io/AP------/`

절대경로(`/apmath/`)는 이 배포에서 깨진다.  
**반드시 상대경로를 사용해야 한다.**

2026-05-29 기준 상대경로 보정 완료:
- index.html: `apmath-home/` (상대경로)
- apmath-home/index.html: `../apmath/`, `../apmath/student/`, `../archive/`, `../` (상대경로)
