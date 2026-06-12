# CODEX_RESULT1

## 수정 파일
- `apmath/css/dashboard-foundation.css`

## 수정 내용
- `ap-dash-quick-panel` 하단 여백 고정: `margin: 0 0 18px 0 !important`
- `ap-dash-quick-grid` gap/padding/border/border-radius/background 고정
  - `gap: 8px`, `padding: 4px`, `border: 1px solid var(--border)`, `border-radius: 16px`, `background: var(--surface-2)`
- `ap-dash-quick-card` 높이 확대: `min-height: 64px → 72px`, `padding: 14px 10px → 18px 10px`
- `@media (max-width: 420px)` 보정:
  - grid: `gap: 6px`, `padding: 4px`
  - 카드: `min-height: 48px → 56px`, `padding: 10px 6px → 12px 6px`
  - 타이틀: `white-space: nowrap` 추가

## 검수 결과

### node --check 결과
```
node --check apmath/js/dashboard-teacher.js → PASS
```

### PC 화면 확인 결과
미확인 (브라우저 직접 렌더링 불가 환경)

### 모바일 화면 확인 결과
미확인 (브라우저 직접 렌더링 불가 환경)

## 미확인 항목
- 출석부/시간표/아카이브 카드 3개 한 줄 배치 시각 확인 불가
- 카드 간격 8px(기본) / 6px(420px 이하) 시각 확인 불가
- 카드 높이 72px(기본) / 56px(420px 이하) 시각 확인 불가
- 하단 학급관리와의 18px 여백 시각 확인 불가
- 출석부/시간표/아카이브 클릭 동작 실제 실행 확인 불가
