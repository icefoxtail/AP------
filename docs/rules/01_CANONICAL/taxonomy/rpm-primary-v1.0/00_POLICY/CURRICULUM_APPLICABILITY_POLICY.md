# Curriculum Applicability Policy v0.3

## 목적
Taxonomy에 존재하는 유형과 실제 학교 시험지의 기본 출력 허용 여부를 분리한다.

**중요:** `교육과정 밖 = taxonomy DELETE`가 아니다.
RPM 문제집, 심화 문제, 과거 기출 또는 실제 아카이브 문항에서 의미 있는 유형이면 canonical taxonomy에 보존할 수 있다.
대신 현행 교육과정 기본 출력에서는 제외한다.

## 값

### `DEFAULT_SCOPE`
- 해당 교육과정/과목의 기본 출력 후보.
- production migration 승인 후 기본 선택 가능.

### `RPM_EXTENDED`
- 공식 교육과정의 기본 요구 범위를 넘을 수 있으나 RPM에서 실제 유형으로 확인된 확장 유형.
- taxonomy에는 유지.
- `defaultSelectable=false`.
- Archive에서 `확장 유형 포함`을 명시적으로 켠 경우에만 현행 교육과정 출력 후보.

### `RPM_EXTENDED_CANDIDATE`
- RPM/심화 문제에서 사용될 가능성이 높거나 실제 아카이브에 존재할 수 있어 삭제하면 손실 위험이 있으나,
  현재 정본팩에서 RPM 본문 근거가 아직 완전히 잠기지 않은 유형.
- taxonomy에는 임시 보존.
- `defaultSelectable=false`.
- 문항 migration 과정에서 실제 RPM/문항 증거를 확인해 `RPM_EXTENDED` 또는 `DELETE`로 재판정.

## 출력 규칙

현행 교육과정 기본 출력:
- `DEFAULT_SCOPE`만 포함.

확장/심화 출력:
- `DEFAULT_SCOPE + RPM_EXTENDED` 포함 가능.
- `RPM_EXTENDED_CANDIDATE`는 검수 완료 전 자동출제에 사용하지 않는다.

과거 시험지 재현:
- 문항의 원래 curriculum/source metadata가 우선한다.
- 현행 교육과정 필터 때문에 과거 기출의 역사적 분류를 삭제하지 않는다.

## 이번 감사에서 적용한 예
- 2022 중1 최대공약수·최소공배수 활용: DELETE하지 않고 `RPM_EXTENDED_CANDIDATE`, 기본 출력 제외.
- 2022 공통수학2 외분점: DELETE하지 않고 `RPM_EXTENDED_CANDIDATE`, 기본 출력 제외.
- 2022 중3 이상치 관련 유형: 별도 확장 후보로 보존, 기본 출력 제외.
- 2015 확률과통계 모비율 추정: 2015 RPM/curriculum 근거가 없어 2015 branch에서는 삭제.
