cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
긴급 수정 — foundation-sync 시간 파서 패치 오류 복구

## 상황
직전 시간 파서 수정 결과 `apmath/worker-backup/worker/index.js`의 해당 구간이 깨졌다.

현재 보이는 문제:
- `formatFoundationTime()` 닫는 중괄호가 누락된 형태로 보임
- `parseFoundationTimeLabel()` 안에 기존 구분자 방식 코드와 새 matchAll 방식 코드가 섞여 있음
- `parseFoundationTimeLabel()`에서 `raw` 선언 전에 `if (!raw)`가 나오는 형태로 보임
- 기존 코드가 `return` 이후 남아 있어 새 코드가 unreachable 상태일 가능성이 있음
- CODEX_RESULT에는 node --check 통과라고 되어 있으나, 현재 diff snippet 기준으로는 신뢰할 수 없음

## 목표
`apmath/worker-backup/worker/index.js`의 foundation-sync 시간 파서 구간만 정확히 복구한다.

이번 작업은 긴급 복구 작업이다.

## 절대 금지
- 대시보드 수정 금지
- UI 파일 수정 금지
- `timetable.js` 수정 금지
- DB migration 추가 금지
- schema.sql 수정 금지
- 기존 데이터 수정 금지
- `/api/foundation-sync/run` 실행 금지
- `/api/timetable-conflicts/scan` 실행 금지
- index.js 전체 리팩토링 금지
- 시간 파서 이외의 Worker 로직 수정 금지

## 수정 대상
`apmath/worker-backup/worker/index.js`에서 아래 함수 4개만 정리한다.

- `normalizeFoundationTimePart`
- `normalizeFoundationHour`
- `formatFoundationTime`
- `normalizeFoundationTimeRange`
- `parseFoundationTimeLabel`

기존 함수가 깨져 있으면 아래 완성본으로 해당 함수 구간을 통째로 교체한다.

## 교체할 완성 코드

`index.js`에서 기존 `normalizeFoundationTimePart`부터 `parseFoundationTimeLabel`까지의 시간 파서 함수 구간을 찾아 아래 코드로 정확히 교체한다.

function normalizeFoundationHour(hour) {
  if (!Number.isFinite(hour)) return null;
  if (hour >= 1 && hour <= 11) return hour + 12;
  if (hour === 12) return 12;
  if (hour >= 13 && hour <= 23) return hour;
  return null;
}

function formatFoundationTime(hour, minute) {
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (minute < 0 || minute > 59) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function normalizeFoundationTimeRange(first, second) {
  const startHour = normalizeFoundationHour(Number(first?.hour));
  const endHour = normalizeFoundationHour(Number(second?.hour));
  const startMinute = Number(first?.minute);
  const endMinute = Number(second?.minute);

  if (startHour === null || endHour === null) return null;

  const start = formatFoundationTime(startHour, startMinute);
  const end = formatFoundationTime(endHour, endMinute);

  if (!start || !end || start >= end) return null;

  return { start_time: start, end_time: end };
}

function normalizeFoundationTimePart(value) {
  const match = String(value || '').trim().match(/(\d{1,2})\s*:\s*(\d{1,2})/);
  if (!match) return null;

  const normalizedHour = normalizeFoundationHour(Number(match[1]));
  const minute = Number(match[2]);

  if (normalizedHour === null) return null;

  return formatFoundationTime(normalizedHour, minute);
}

function parseFoundationTimeLabel(timeLabel) {
  const raw = String(timeLabel || '').trim();
  if (!raw) return null;

  const matches = [...raw.matchAll(/(\d{1,2})\s*:\s*(\d{1,2})/g)];
  if (matches.length < 2) return null;

  const first = {
    hour: Number(matches[0][1]),
    minute: Number(matches[0][2])
  };

  const second = {
    hour: Number(matches[1][1]),
    minute: Number(matches[1][2])
  };

  return normalizeFoundationTimeRange(first, second);
}

## 반드시 확인할 것
교체 후 아래 문제가 없어야 한다.

- `formatFoundationTime()` 닫는 중괄호 누락 없음
- `parseFoundationTimeLabel()` 안에 old clean/match 구분자 방식 코드가 남아 있지 않음
- `parseFoundationTimeLabel()` 안에서 `raw` 선언 전에 사용하는 코드 없음
- `return` 이후 unreachable 코드 없음
- 동일 함수명 중복 선언 없음

## 기대값 테스트
임시 node snippet 또는 Worker 함수 주변 테스트로 아래 기대값을 확인하고 CODEX_RESULT.md에 적는다.

- `4:50~6:20` => `16:50 / 18:20`
- `6:30~8:00` => `18:30 / 20:00`
- `7:50~9:20` => `19:50 / 21:20`
- `3교시 7:50~9:20` => `19:50 / 21:20`
- `3êµ 7:50~9:20` => `19:50 / 21:20`
- `16:50~18:20` => `16:50 / 18:20`

## 검증 명령
반드시 실행한다.

node --check apmath/worker-backup/worker/index.js

그리고 변경 파일을 확인한다.

git diff --name-only

정상 기준:
- `apmath/worker-backup/worker/index.js`
- `CODEX_RESULT.md`
- `CODEX_TASK.md`는 현재 지시 파일 갱신 때문에 포함될 수 있음

UI 파일이 나오면 실패다.

## 배포 판단
CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- node --check 통과
- 시간 파서 기대값 전부 통과
- UI 파일 변경 없음
- 시간 파서 함수 구간 중복/잔재 코드 없음

배포 보류:
- node --check 실패
- 기대값 중 하나라도 실패
- old parse 코드 잔재 있음
- UI 파일 변경 있음

## 완료 보고
루트에 `CODEX_RESULT.md`를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- 깨진 시간 파서 함수 구간 복구
- old parse 코드 제거
- 중괄호/중복/잔재 코드 확인
- UI 파일 변경 없음 확인

## 3. 실행 결과
- node --check 결과
- 기대값 테스트 결과
- git diff --name-only 결과

## 4. 결과 요약
- Worker 배포 가능 여부
- preview 재확인 필요 여부
- migration 필요 여부

## 5. 다음 조치
- 배포 가능 시 Worker 배포
- /api/foundation-sync/preview 재확인
- time_slots.skipped 값 확인
- skipped_details 확인 후 /run 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF