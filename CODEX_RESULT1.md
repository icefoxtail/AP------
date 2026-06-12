# CODEX_RESULT1

## 수정 파일
- `apmath/js/dashboard-teacher.js`
- `apmath/css/dashboard-foundation.css`

## 수정 내용
- 학급관리 section inline `style="margin-bottom:0;"` 제거 → 공통 CSS 섹션 간격으로 관리
- 선생님 대시보드 전용 토큰에 `--ap-dash-card-radius(16px)`, `--ap-dash-card-padding(20px)` 추가 (기존 토큰 블록 병합)
- `.ap-dash-card` 큰 섹션 카드 규격 통일
  - radius `var(--ap-dash-card-radius)` (16px), padding `var(--ap-dash-card-padding)` (20px), margin-bottom 20px, border/background/box-shadow 통일
  - last-child margin-bottom 0
  - 640px 이하: card padding 16px
- `.ap-dash-card__title` 제목 하단 간격 12px 통일
- row 카드 규격 통일: `.ap-class-row` + `.ap-list-row` (실제 오늘일지 날짜 카드 렌더 기준)
  - min-height 52px, padding 0 16px, radius 16px, border/background 통일, 내부 gap 12px
  - 기존 `.ap-list-row`의 radius 4px / padding 12px 16px override
- `.ap-list-row.status-pending` 미작성 강조 약화 (border/background만, 문구·DOM 미변경)
- 내부 리스트 gap 통일: `.ap-dashboard-class-list` + `.journal-matrix` 8px, journal-matrix flex column 보강
- 상단 3카드 규격 유지 (이전 토큰 기반 규격 그대로)

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
- 학급관리 섹션 카드와 오늘일지 섹션 카드의 외곽 radius 동일 여부 시각 확인 불가
- 학급관리 반 카드(.ap-class-row)와 오늘일지 날짜 카드(.ap-list-row)의 폭·높이·radius 동일 여부 시각 확인 불가
- 반 카드 gap과 날짜 카드 gap 동일 여부 시각 확인 불가
- 오늘일정/주간일정 카드가 동일 섹션 카드 규격 안에 들어오는지 시각 확인 불가
- status-pending 강조 약화 결과 시각 확인 불가
- 모든 클릭 동작(출석부/시간표/아카이브/반카드/일지/일정) 실제 실행 확인 불가

## 비고
- 신규 여백은 4px 스케일(4/8/12/16/20/24)만 사용. status-pending의 `border-left: 3px`는 spacing이 아닌 보더 두께로 지시서 예시값 그대로 유지.
