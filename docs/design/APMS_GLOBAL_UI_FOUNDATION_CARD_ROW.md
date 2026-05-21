# APMS Global UI Foundation Card and Row

## Card shell

Card는 하나의 정보 묶음을 감싸는 outer shell이다. 반복 항목을 card로 복제하지 않고, card 안에는 line row를 둔다.

## Card 안 card 금지

카드 제거가 목적이 아니다. card 안 card 제거가 목적이다. 기존 화면에서 outer card가 이미 의미 있는 묶음이면 유지하고, 내부 반복 항목만 line row로 정리한다.

## Line row

Line row는 반복 항목의 기본 단위다.

- 좌측: title/main.
- 중간: muted meta.
- 우측: status/actions/chevron.
- Row마다 강한 background, radius, shadow를 주지 않는다.
- Border와 hover만으로 구분한다.

## Clickable row

Clickable row는 버튼처럼 보이지 않게 한다. cursor와 은은한 hover, 필요 시 chevron 하나로만 진입 가능성을 표현한다.

## Empty state

Empty state는 card 내부의 조용한 문장이다. 새 이미지, 이모지, 장식 아이콘을 추가하지 않는다.

