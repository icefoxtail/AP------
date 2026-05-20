# APMS_PLANNER_UX_TIMER_UPDATE_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/planner/index.html`

## 2. 구현 완료 또는 확인 완료

- 플래너 상단에 `‹ 뒤로가기` 버튼을 추가했다.
- 뒤로가기는 같은 origin referrer와 browser history가 있으면 `history.back()`을 우선 사용한다.
- 직접 진입이거나 history 복귀가 어려운 경우 `../student/`로 이동한다.
- 계획 항목에 `타이머` 버튼을 추가했다.
- 타이머는 하단 미니바 형태로 표시한다.
- 타이머는 매초 전체 `renderPlanner()`를 호출하지 않고, 미니바 DOM만 갱신한다.
- 타이머 선택 시간은 `30분 / 45분 / 60분`으로 제한했다.
- 기본 노출값은 `45분`이다.
- 마지막 선택 시간은 `localStorage`에 저장한다.
- 다음 타이머 실행 시 마지막 선택 시간을 유지한다.
- 타이머 종료 시 `toast('집중 시간이 끝났습니다.')`를 표시한다.
- 타이머 종료 시 진동 지원 브라우저에서 `navigator.vibrate([180, 80, 180])`를 호출한다.
- 진동 미지원 브라우저에서는 오류 없이 통과한다.
- `resetAuth()` 시 타이머 interval과 표시 상태를 정리한다.
- inline onclick 문자열 안전성을 위해 `escapeJsString()`을 추가했다.
- Worker route, DB migration, 학생 포털, 시간표는 수정하지 않았다.
- AI 코치 영역은 복구하지 않고 현재 단순 플래너 구조를 유지한다.

## 3. 실행 결과

- `apmath/planner/index.html` inline script 추출 후 `node --check`: 통과 보고 기준
- `apmath/worker-backup/worker/index.js` `node --check`: 통과 보고 기준
- 적용/커밋/푸시 완료

```text
커밋: d53dd20 Add custom planner timer durations
커밋: a098aa0 Add planner timer vibration feedback
원격: origin/main 반영 완료
상태: working tree clean 확인 완료
```

## 4. 결과 요약

이번 보정은 Round 3 이후 플래너 UX를 작게 보강한 작업이다.

학생이 계획을 보면서 바로 집중 시간을 시작할 수 있도록 타이머를 추가했고, 학생별 집중 시간 차이를 반영하기 위해 30분, 45분, 60분 중 선택할 수 있게 했다.

기본값은 45분으로 두었다. 기존에 논의되던 AI 코치는 화면을 복잡하게 만들 수 있어 복구하지 않고, 현재의 단순한 `할 일 확인 → 타이머 → 완료 체크` 흐름을 유지한다.

## 5. 다음 조치

브라우저에서 아래 흐름만 직접 확인하면 된다.

```text
1. 학생 포털에서 플래너 진입
2. 상단 뒤로가기 버튼 동작 확인
3. 계획의 타이머 버튼 클릭
4. 30 / 45 / 60분 선택 확인
5. 시작 / 일시정지 / 초기화 / 닫기 확인
6. 타이머 종료 시 toast와 모바일 진동 확인
7. 계획 추가 / 완료 / 삭제 기존 흐름 확인
```

## 6. 잘못했거나 위험했던 점

- 초기 검증 명령에서 한글 인코딩 깨짐으로 inline script `node --check`가 실패한 로그가 있었다.
- 실제 변경 diff는 타이머 관련 함수와 호출부 중심이었고, 최종 커밋/푸시는 완료되었다.
- 플래너 파일은 Round 3에서 변경량이 컸으므로 브라우저 수동 확인은 반드시 필요하다.

## 7. 보존해야 할 점

- 학생 포털 PIN/session 흐름을 임의로 바꾸지 않는다.
- Worker route와 DB migration은 타이머 UX 보정과 분리한다.
- AI 코치는 현재 단계에서 복구하지 않는다.
- 타이머는 기록/통계용 DB 기능이 아니라 로컬 화면 보조 기능으로 본다.
- 매초 전체 플래너를 다시 렌더링하지 않는다.
