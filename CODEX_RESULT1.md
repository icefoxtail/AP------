# CODEX_RESULT1

## 수정 파일
- `apmath/css/dashboard-foundation.css`

## 수정 내용
- APMS 선생님 대시보드 전용 4px 스케일 토큰 추가 (`body.ap-teacher-dashboard-mode`)
  - `--ap-space-1~6`, `--ap-dash-section-gap(20px)`, `--ap-dash-inner-gap(8px)`, `--ap-dash-title-gap(12px)`
  - `--ap-dash-row-height(52px)`, `--ap-dash-row-padding-x(16px)`, `--ap-dash-row-radius(16px)`
  - `--ap-dash-toolbar-padding(4px)`, `--ap-dash-toolbar-gap(8px)`, `--ap-dash-toolbar-radius(16px)`
  - `--ap-dash-quick-height(72px)`, `--ap-dash-quick-radius(12px)`
- 상단 3카드 규격 토큰 기반으로 교체
  - `margin-bottom` 18px → `var(--ap-dash-section-gap)` (20px)
  - `padding` 18px 10px → `var(--ap-space-4) var(--ap-space-3)` (16px 12px)
  - `border-radius` 8px → `var(--ap-dash-quick-radius)` (12px)
- 420px 이하 모바일 토큰 오버라이드: `--ap-dash-quick-height: 56px`
- 학급관리 반 카드 + 오늘일지 날짜 카드 row 규격 통일
  - `min-height: 52px`, `padding: 0 16px`, `border-radius: 16px` 공통 적용
- `journal-matrix` gap 0→8px, display flex/column으로 변경
- `ap-dash-card` 섹션 간격 `var(--ap-dash-section-gap)` (20px) 통일, last-child margin 0
- `ap-dash-card__title` 제목 하단 간격 `var(--ap-dash-title-gap)` (12px) 통일

## 검수 결과

### node --check 결과
```
node --check apmath/js/dashboard-teacher.js → PASS
node --check apmath/js/dashboard.js → PASS
```

### PC 화면 확인 결과
미확인 (브라우저 직접 렌더링 불가 환경)

### 모바일 화면 확인 결과
미확인 (브라우저 직접 렌더링 불가 환경)

## 미확인 항목
- 상단 3카드 높이 72px / 모바일 56px 시각 확인 불가
- 학급관리 반 카드와 오늘일지 날짜 카드 row 높이·padding·radius 동일 여부 시각 확인 불가
- journal-matrix gap 8px 적용 후 줄 간격 시각 확인 불가
- 섹션 간격 20px 시각 확인 불가
- 섹션 제목 간격 12px 시각 확인 불가
- 출석부/시간표/아카이브 클릭 동작 실제 실행 확인 불가
