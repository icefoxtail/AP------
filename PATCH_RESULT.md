# PATCH_RESULT

## 1. 패치명
EIE 시간표 카드형 1차 v4 보정 패치

## 2. 생성/수정 파일
- `eie/js/views/eie-timetable-v2.js`
- `eie/css/eie.css`
- `PATCH_RESULT.md`

## 3. 보정 내용
- v3 검수에서 지적된 `같은 교시 + 같은 반명/class_name_raw + 다른 교재` 카드가 하나로 병합될 수 있는 문제를 보정했다.
- `classGroupKey()`가 `getClassName()`의 기본값 `수업명 없음`에 먼저 걸려 `materialText()` fallback을 막던 구조를 제거했다.
- `rawClassName()`을 추가해 실제 `class_name_raw/class_name/name` 값만 class key에 사용하도록 했다.
- `classGroupKey()`가 `materialKey`를 반드시 포함하도록 변경했다.
- `cardGroupKey()`가 `source_row/card_key/group_key`가 있는 경우에도 `material/class` 그룹키를 함께 포함하도록 변경했다.
- 같은 교시, 같은 담당 선생님, 같은 class_name_raw라도 교재가 다르면 별도 카드로 분리되게 했다.
- `class_name_raw`가 비어 있어도 교재가 다르면 별도 카드로 분리되게 했다.
- `source_row/card_key/group_key`가 같아도 교재가 다르면 별도 카드로 분리되게 했다.

## 4. 유지한 범위
- Worker/API/DB 파일 수정 없음
- 클래스룸 본격 연동 추가 없음
- AP Math/APMS 파일 수정 없음
- 기존 카드형 시간표 레이아웃 유지
- `imported` 상태 포함 유지
- API fallback 시 기존 rows 유지
- `inactive: 비활성` 라벨 유지

## 5. 검증 결과
- `node --check eie/js/views/eie-timetable-v2.js` PASS
- Node VM 샘플 테스트 PASS
  - 같은 교시 + 같은 선생님 + 같은 `class_name_raw` + 다른 `material_text` → 카드 2개 분리 확인
  - 같은 교시 + 같은 선생님 + `class_name_raw` 공백 + 다른 `material_text` → 카드 2개 분리 확인
  - 같은 `card_key` + 다른 `material_text` → 카드 2개 분리 확인
  - 같은 교재의 월/화 row는 하나의 주간 카드로 병합 유지 확인

## 6. 다음 단계 메모
- 다음 단계는 시간표 카드 클릭 후 AP Math식 EIE 클래스룸 연동이다.
- 클래스룸 안 교재 관리는 선택형/마스터형이 아니라 자유 텍스트 수정 버튼 하나로 처리한다.
- 출석/결석/지각/보강/상담 구조는 AP Math 클래스룸 흐름을 최대한 그대로 따른다.
