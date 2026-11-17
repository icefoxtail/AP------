# Q18 모바일 표시 업그레이드 요구

기존 기하/수학 정보 KEEP과 표시 개선 필요를 분리한다. 새 실행 사양0, 비실행 업그레이드 요구1.

{
  "kind": "NON_EXECUTABLE_PRESENTATION_UPGRADE_REQUIREMENT",
  "exam": "archive/exams/original/middle/m3/2final/16_왕의중_2학기_기말_중3_수학.js",
  "no": 18,
  "status": "UPGRADE_REQUIRED",
  "preserve": [
    "기존 4단계 접현각→이등변→닮음→계산",
    "주황/보라/초록 대응색",
    "AB10,AT6,PB16,PT=4√6 및 모든 각 표식"
  ],
  "reason": "776px 2열 합성을350px로축소하면 패널폭약173px, 글자13.2px, 기본선0.72px로 감소한다. 소스 기준 위험이며 실제 화면 결함 확정은 아니다.",
  "requirements": [
    "좁은 폭에서 세로 1열로 순서 유지",
    "4개 패널을 개별 자산 또는 반응형 패널로 분리",
    "분리 후 글꼴·선 두께의 가독성 유지",
    "집PC 실제 렌더로 겹침·잘림·색 대응 검수"
  ],
  "render": "NOT_RUN",
  "executableSpec": false,
  "publicationBlockedUntilVisualReview": true
}
