# APMS 중3 1학기 기말 이미지 경로 보정 패치

## 수정 파일
- `archive/exams/original/middle/m3/1final/23_매산중_1학기_기말_중3_기출c.js`
- `archive/exams/original/middle/m3/1final/22_이수중_1학기_기말_중3_기출c.js`
- `archive/exams/original/middle/m3/1final/24_신흥중_1학기_기말_중3_기출c.js`

## 보정 내용
1. 매산중 기말 파일의 `수학` 표기를 운영 규칙에 맞게 `기출`로 정리했습니다.
   - 파일명: `23_매산중_1학기_기말_중3_수학c.js` → `23_매산중_1학기_기말_중3_기출c.js`
   - `window.examTitle`: `23_매산중_1학기_기말_중3_수학` → `23_매산중_1학기_기말_중3_기출`
   - 이미지 경로: `assets/images/23_매산중_1학기_기말_중3_수학/...` → `assets/images/23_매산중_1학기_기말_중3_기출/...`
2. JS 이미지 경로가 실제 에셋 파일명과 다르게 생성된 항목을 보정했습니다.
   - `22_이수중`: `q18_graph.png` → `q18.png`
   - `24_신흥중`: `q16_graph.png`, `q19_graph.png`, `q20_graph.png` → `q16.png`, `q19.png`, `q20.png`

## 수동 확인으로 남긴 항목
- `22_연향중` 19번 `qsub1.png`
- `22_이수중` 23번 `q서술3_figure.png`

위 2개는 보조그림 계열이라 자동 대체하지 않았습니다.
