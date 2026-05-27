# APMS Global UI Foundation Button and Chip

## Buttons

- Quiet button: 보조 행동. 얇은 border와 soft surface를 사용한다.
- Primary button: 저장/확정 같은 핵심 행동에만 사용한다.
- Danger button: 삭제/위험 행동에만 사용한다.

기존 버튼명과 onclick 흐름은 보존한다. button class는 기존 `.btn`과 병행할 수 있으나 새 foundation은 전역 `button` selector를 수정하지 않는다.

## Chips

Chip은 작은 상태 또는 meta 표시다. 과한 녹색/주황/빨강 강조는 금지하고, 텍스트 중심으로 표현한다.

## Typography

버튼은 13px / 500을 기준으로 한다. chip은 12px / 400~500을 기준으로 한다. 새 700/800/900 weight는 추가하지 않는다.

## 보존 원칙

버튼명, toast 문구, modal 제목, 화면명은 이번 작업에서 바꾸지 않는다.

