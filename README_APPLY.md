# EIE PDF 기준 교재명/요일별 담당 적용 방법

## 목적
`26년영어강사시간표.pdf` 기준으로 교재명과 월/화/수/목/금 요일별 담당만 현재 EIE 시간표 row에 반영한다.
학생 배정, cell id, 교시/시간 구조는 건드리지 않는다.

## 적용 순서

PowerShell:

cd C:\Users\USER\Desktop\AP------
Expand-Archive -Path "$env:USERPROFILE\Downloads\eie_timetable_pdf_material_teacher_patch_v12_20260604.zip" -DestinationPath . -Force
node --check .\eie\js\views\eie-timetable-v2.js
node --check .\tools\eie_apply_pdf_material_teachers_20260604.js

그 다음:

1. EIE 시간표 화면을 연다.
2. F12 → Console을 연다.
3. `tools/eie_apply_pdf_material_teachers_20260604.js` 전체 내용을 붙여넣고 실행한다.
4. 콘솔 preview 표를 확인한다.
5. 확인창에서 진행한다.
6. 다운로드되는 `eie_pdf_material_teacher_apply_report_*.json`을 확인한다.

## 주의
- PDF 기준 정답을 반영한다.
- EIE 현재 화면은 수정 대상이지 정답 기준이 아니다.
- 학생 배정은 건드리지 않는다.
