# PATCH_RESULT

## 1. 생성/수정 파일
- `eie/js/views/eie-timetable-v2.js`
- `tools/eie_apply_pdf_material_teachers_20260604.js`
- `eie_2026_teacher_timetable_material_teachers_truth.json`
- `PATCH_RESULT.md`

## 2. 구현 완료
- PDF `26년영어강사시간표.pdf` 기준으로 교재명과 월/화/수/목/금 요일별 담당만 정리한 truth JSON을 포함했다.
- 기존 학생 배정, cell id, 교시/시간 구조는 건드리지 않는 1회 실행 적용 스크립트를 추가했다.
- 현재 EIE timetable row를 불러온 뒤, PDF truth row와 교시/시간/순서 기준으로 매칭해 `updateTimetableCell` PATCH를 수행한다.
- 각 row에 다음 값만 반영하도록 제한했다.
  - `class_name_raw`
  - `material_text`
  - `material`
  - `teacher_names`
  - `teacher_name_raw`
  - `raw_meta_json.material_text`
  - `raw_meta_json.day_teachers`
  - `raw_meta_json.teacher_names_by_day`
  - `raw_meta_json.homeroom_teacher`
- weekly single-row 데이터에서도 요일별 담당이 카드에 표시되도록 `eie-timetable-v2.js`가 `raw_meta_json.day_teachers` / `teacher_names_by_day`를 읽도록 보강했다.
- `getPrimaryTeacherName()`이 `raw_meta_json.homeroom_teacher`를 우선 사용하도록 보강했다.
- 미니 클래스룸에서 요일별 담당 저장 시, weekday row가 아닌 weekly row에도 `day_teachers`가 저장되도록 보강했다.
- 학생 배정, 학생 명단, 퇴원, 출결/숙제/상담 구조는 건드리지 않았다.

## 3. 실행 결과
- `node --check eie/js/views/eie-timetable-v2.js` PASS
- `node --check tools/eie_apply_pdf_material_teachers_20260604.js` PASS

## 4. 결과 요약
- 이번 패치는 화면 구조 변경이 아니라 PDF 원본 기준 교재명/요일별 담당 반영을 위한 데이터 적용 패치다.
- 실제 D1/Worker 데이터는 프로젝트 파일 적용만으로 자동 변경되지 않는다.
- 적용 후 EIE 화면 Console에서 `tools/eie_apply_pdf_material_teachers_20260604.js` 내용을 1회 실행해야 현재 DB row에 반영된다.
- 실행 전 콘솔에 매칭 preview가 출력되고, 확인창을 거친 뒤 업데이트한다.
- 실행 후 `eie_pdf_material_teacher_apply_report_*.json` 리포트를 다운로드한다.

## 5. 다음 조치
1. 패치 적용
2. `node --check` 실행
3. EIE 시간표 화면 접속
4. `tools/eie_apply_pdf_material_teachers_20260604.js` 내용을 Console에서 1회 실행
5. 다운로드되는 apply report 업로드 또는 확인
6. 시간표에서 교재명/요일별 담당이 PDF와 맞는지 확인
