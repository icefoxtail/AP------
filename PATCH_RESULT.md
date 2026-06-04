# 학생관리 배경/글씨 대비 보정 패치

## 변경 파일
- apmath/css/apms-theme-override.css
- apmath/js/management.js
- apmath/js/student.js

## 변경 범위
- 학생관리 목록/검색/반 필터/빈 상태 대비 보정
- 학생 상세 프로필/학생 수정/신규 학생 추가/퇴원생 관리 모달 대비 보정
- 학생관리 전용 wrapper/class 추가
- 전역 모달, 문구, 버튼명, 기능, 데이터 흐름 변경 없음

## 검증
- node --check management.js PASS
- node --check student.js PASS
