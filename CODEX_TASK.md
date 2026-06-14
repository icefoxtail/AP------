# EIE 원내평가 후보 라벨 / 직접 입력 구조 정리 지시

## 목표

원내평가 `이번 달 시험` 후보를 영어 수업 평가 항목 중심으로 정리한다.

기본 후보에 `Homework`, `Retake`, `숙제 확인`, `재시험` 같은 운영성 항목을 두지 않는다.
특수 시험이나 임시 시험은 기본 후보가 아니라 `+ 시험 추가` 입력란에서 선생님이 직접 추가한다.

---

## 기본 후보

아래 항목만 기본 후보로 둔다.

```text
Monthly
Vocabulary
Grammar
Reading
Listening
Speaking
Writing
Dictation
Memo
```

---

## 제거할 후보

아래 항목은 기본 후보에서 제거한다.

```text
Homework
Retake
숙제 확인
재시험
```

아래 한글/혼합 라벨도 남기지 않는다.

```text
월말평가
단어시험
문법시험
Reading Test
Listening Test
Dictation Test
메모
```

---

## 라벨 매핑

기존 저장값 또는 기본값이 아래와 같으면 화면 표시 라벨은 다음처럼 정규화한다.

```text
월말평가 -> Monthly
단어시험 -> Vocabulary
문법시험 -> Grammar
Reading Test -> Reading
Listening Test -> Listening
Dictation Test -> Dictation
메모 -> Memo
```

`숙제 확인`, `재시험`, `Homework`, `Retake`는 기본 후보로 복원하지 않는다.

---

## 기본 화면 표시

기본 화면에는 선택된 시험만 chip으로 보여준다.

예시:

```text
이번 달 시험                         시험 고치기
[Monthly] [Vocabulary] [Reading] [Memo]
```

체크되지 않은 후보 전체가 기본 화면에 노출되면 안 된다.

---

## 시험 고치기 영역

`시험 고치기`를 펼쳤을 때만 기본 후보 체크박스를 보여준다.

```text
[ ] Monthly
[ ] Vocabulary
[ ] Grammar
[ ] Reading
[ ] Listening
[ ] Speaking
[ ] Writing
[ ] Dictation
[ ] Memo
```

---

## 직접 추가 입력란

특수 시험은 기본 후보에 넣지 말고 `+ 시험 추가`에서 직접 입력하게 한다.

예시:

```text
+ 시험 추가
시험명: [                 ]
입력 방식: 숫자 / 숫자+만점 / 메모
만점: [      ]  ※ 숫자+만점 선택 시만 표시
```

직접 추가한 시험은 현재 반/월의 시험 구성에만 포함한다.
기본 후보 목록에는 추가하지 않는다.

---

## 금지사항

```text
Homework / Retake 기본 후보 유지 금지
숙제 확인 / 재시험 기본 후보 유지 금지
한글 라벨 유지 금지
Reading Test / Listening Test / Dictation Test처럼 Test suffix 유지 금지
체크 안 된 후보를 기본 화면에 노출 금지
DB/API/Worker/migration 수정 금지
저장/재조회 로직 변경 금지
성적표 전체 레이아웃 재설계 금지
커밋/푸시 금지
```

---

## 테스트

```powershell
node --check eie/js/views/eie-grade-ledger.js
node tests/eie-grade-ledger-port.test.js
node tests/eie-grade-normalization.test.js
node tests/eie-exam-records-mvp.test.js
```

---

## 검수 기준

PASS:

```text
기본 후보가 Monthly/Vocabulary/Grammar/Reading/Listening/Speaking/Writing/Dictation/Memo만 남음
Homework/Retake/숙제 확인/재시험이 기본 후보에서 사라짐
한글 라벨과 Test suffix가 화면에 남지 않음
기본 화면에는 선택된 시험만 보임
특수 시험은 + 시험 추가 입력란으로 직접 추가 가능
```

FAIL:

```text
Homework 또는 Retake가 기본 후보에 남음
숙제 확인 또는 재시험이 남음
체크 안 된 후보가 기본 화면에 계속 보임
직접 추가 입력 흐름이 깨짐
저장/재조회 로직을 건드림
```

