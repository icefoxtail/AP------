# EIE 학부모 상담용 누적 리포트 고도화 결과

## 수정 파일
- `eie/js/views/eie-students.js`
- `eie/css/eie-grade-report-print.css`
- `tests/eie-student-grade-report-print.test.js`
- `CODEX_RESULT.md`

## 목표
- EIE 학생상세 성적 탭 안의 학부모 상담용 누적 리포트를 실제 상담, 인쇄, 발송, 상담기록 저장에 쓸 수 있는 수준으로 고도화했다.
- AP MATH `apmath/js/report.js`의 흐름을 참고해 `자동 문구 생성 -> 교사 수정 -> 최종 복사 -> 상담기록 저장` 구조를 EIE 리포트에 맞게 이식했다.
- 프리셋 기간 선택을 제거하고, 선생님이 시작월/종료월을 직접 선택해 누적 리포트 기간을 결정하도록 바꿨다.

## AP MATH 참고 확인
- `apmath/js/report.js`
  - `buildReportContext()`
  - `buildParentReportText()`
  - `buildStudentReportText()`
  - `buildCounselReportText()`
  - `copyReport()`
  - `saveReportToConsultation()`
- 확인한 핵심 구조
  - 보고 문맥 생성
  - 대상별 자동 문구 생성
  - textarea에서 교사 검수/수정
  - 최종 textarea 값 복사
  - 최종 textarea 값 상담기록 저장
- EIE에는 AP MATH의 OMR, 오답 문항, 시험지 아카이브 구조를 가져오지 않고, EIE 전용 단어/문법/월말평가/재시험 흐름만 사용했다.

## 주요 변경
- 학생상세 성적 탭 내부의 기존 리포트 패널을 유지했다.
- 별도 라우트나 뒤로가기 흐름을 추가하지 않았다.
- Vocabulary / Grammar 기본 그래프 2개를 항상 유지했다.
- Reading, Listening, 교재, 월말평가는 선택 확장 그래프로 유지했다.
- 점수는 원점수가 아니라 100점 환산 월평균으로 계산한다.
- 기록이 없는 달은 그래프와 월별 요약표에서 `-`로 표시한다.
- 핵심요약, 그래프, 월별 요약표, 발송 문구, 상담기록 저장 내용이 모두 같은 선택 기간 기준으로 계산된다.

## 기간 선택 변경
- 최근 3/6/12개월 프리셋을 제거했다.
- `시작월`, `종료월` 직접 선택을 추가했다.
- 예: `2026-03` ~ `2026-06`
  - x축은 3월, 4월, 5월, 6월로 고정된다.
  - 4월 기록이 없어도 4월 칸은 유지되고 `-`로 표시된다.
- 시작월/종료월이 뒤집혀 입력되어도 내부 계산은 빠른 월부터 늦은 월 순서로 정렬한다.
- 발송 문구에는 `2026년 3월~6월 누적 리포트` 같은 기간 문구가 반영된다.

## 발송 문구/상담기록 흐름
- 기존 static `pre` 발송 문구를 제거했다.
- 발송 문구는 편집 가능한 `textarea`로 변경했다.
- 교사가 최종 문구 전체를 직접 수정할 수 있다.
- 복사 버튼은 화면의 최종 textarea 값을 그대로 복사한다.
- 상담기록 저장도 화면의 최종 textarea 값을 그대로 저장한다.
- textarea가 비어 있으면 복사/저장을 막고 안내한다.
- 상담 메모 수정 시 발송 문구가 자동으로 다시 생성되어 textarea와 인쇄용 mirror에 반영된다.

## 자동 문구 엔진
- EIE 전용 자동 문구 생성 규칙을 추가했다.
- Vocabulary는 최근 2~3개월 흐름을 기준으로 상승/유지/하락/기록 부족을 판정한다.
- Grammar도 같은 방식으로 상승/유지/하락/기록 부족을 판정한다.
- 월말평가 최근 결과를 문구에 반영한다.
- 재시험/보완 기록이 있으면 보완 포인트에 자동 포함한다.
- 기록 부족 시 별도 안내 문구를 생성한다.
- 자동 문구에는 아래 섹션을 포함한다.
  - 최근 학습 흐름
  - 성취 영역
  - 보완 영역
  - 가정 학습 안내
  - 다음 목표
  - 상담 코멘트

## 인쇄 UX
- 인쇄는 기존처럼 `window.print()`와 `body.eie-printing-grade-report`를 사용한다.
- 인쇄 시 앱 헤더, 버튼, 옵션, 입력 컨트롤은 숨긴다.
- `#eie-grade-report-sheet`만 A4 리포트 형태로 출력되도록 유지했다.
- 화면에서는 발송 문구를 textarea로 편집한다.
- 인쇄에서는 textarea 자체가 잘리지 않도록 같은 최종 문구를 static mirror 블록으로 출력한다.

## 테스트 보강
- `tests/eie-student-grade-report-print.test.js`에 아래 계약을 추가했다.
  - 발송 문구는 `textarea`여야 한다.
  - `pre` 출력 구조가 남아 있으면 실패한다.
  - 복사/상담기록 저장은 최종 수정 문구 함수를 사용해야 한다.
  - AP MATH식 확장 문구 섹션을 포함해야 한다.
  - 기간 선택은 시작월/종료월 month input이어야 한다.
  - 최근 3/6/12개월 프리셋 문구가 패널에 남아 있으면 실패한다.

## 검증 결과
- `node --check eie/js/views/eie-students.js`: PASS
- `node --check eie/js/views/eie-grade-ledger.js`: PASS
- `node tests/eie-student-grade-report-print.test.js`: PASS
- `node tests/eie-exam-records-mvp.test.js`: PASS
- `node tests/eie-attendance-consultation-connect.test.js`: PASS
- `node tests/eie-students-click-handlers.test.js`: PASS
- `node tests/eie-student-worker-crud-parity.test.js`: PASS
- `git diff --check`: PASS
  - CRLF 변환 warning만 표시됨

## 리뷰 봇 결과
- Codex B 로직/라우팅 리뷰: PASS
  - 시작월/종료월이 유일한 리포트 기간 기준임을 확인했다.
  - 선택 범위 월이 x축에 고정되고 빈 달이 `-`로 표시됨을 확인했다.
  - 그래프, 월별표, 핵심요약, 발송 문구, 저장 내용이 같은 선택 기간 기준임을 확인했다.
  - AP MATH OMR/오답 구조 유입 없음.
  - 신규 router/back-stack 동작 없음.
- Codex C UI/CSS 리뷰: PASS
  - 프리셋 UI 제거 확인.
  - 시작월/종료월 month input 확인.
  - month input 스타일과 모바일 접힘 확인.
  - 실제 브라우저/인쇄 미리보기는 UNVERIFIED.
- Codex D 테스트/회귀 리뷰: PASS
  - focused verification 명령 통과.
  - 실제 브라우저 클릭 흐름, 모바일 화면, 인쇄 미리보기는 UNVERIFIED.

## 수정하지 않은 항목
- 새 DB 테이블 추가 없음.
- 새 API 추가 없음.
- 기존 EIE 성적 입력, 상담 CRUD, 학생상세 라우팅 변경 없음.
- AP MATH 수학 오답/OMR/시험지 아카이브 구조 이식 없음.

## 남은 확인 필요
- 실제 브라우저에서 시작월/종료월 선택 후 그래프/문구 갱신 확인.
- 실제 브라우저에서 textarea 수정 후 복사/상담기록 저장 클릭 확인.
- 모바일 화면에서 month input과 버튼 배치 확인.
- 브라우저 인쇄 미리보기에서 A4 출력 여백과 긴 발송 문구 출력 확인.
