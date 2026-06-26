# CODEX LOOP 4 - 유형별 payload 연결

> 범위: 유형 카드 선택 결과를 실제 오답 출력 payload와 `wrong_print_engine.html` 렌더링에 연결.
> 원칙: 신규 DB 없음. 기존 학생/반/학년 집계 함수와 QR compact packer 재사용.
> 작성일: 2026-06-26
> 대상 파일: `apmath/js/clinic-print.js`, `apmath/wrong_print_engine.html`

---

## 1. 결과 요약

| 항목 | 상태 |
|------|------|
| 최다빈출 payload 생성 | 완료 |
| 최다오답 payload 생성 | 완료 |
| 단원별 payload 생성 | 완료 |
| 단원 선택 순서 출력 반영 | 완료 |
| 출력 엔진 `mode='type'` 라우팅 | 완료 |
| 문제지/해설지/정답표 typeItems 재사용 | 완료 |
| QR compact packer 변경 | 없음 |
| 기존 학생/반/학년 출력 경로 | 유지 |

---

## 2. payload 구조

`clinicPrintBuildTypePayload(classId)`를 추가했다.

```js
{
  mode: "type",
  typeMode: "frequent" | "mostWrong" | "unit",
  scope: "class" | "grade",
  rateRule: "gte50" | "lt50",
  selectedUnitKeys: [],
  unitOrder: [],
  typeItems: []
}
```

호환성을 위해 `scope === 'class'`이면 `classWrongItems`, `scope === 'grade'`이면 `gradeWrongItems`에도 같은 `typeItems`를 넣는다. 엔진은 type 모드에서 `typeItems`를 1차 원천으로 사용한다.

---

## 3. 필터 기준

- 최다빈출: `correctRate >= 50`, 오답수 내림차순
- 최다오답: `correctRate < 50`, 오답수 내림차순
- 단원별: 단원 패널의 `clinicPrintTypeState.unitRate` 기준을 사용하고, `unitOrder` 순서대로 재정렬
- 미분류 문항: `unitKey`가 없으면 `__UNCLASSIFIED__`로 유지하며 "기타 / 단원 미분류" 섹션에 포함

---

## 4. 출력 엔진

`wrong_print_engine.html`에 type 전용 헬퍼를 추가했다.

- `getTypeItems(payload)`
- `getTypeSections(payload)`
- `buildTypeQrPayload(payload)`
- `renderTypePages(area, payload)`

문제지 렌더:

- 일반 유형(`frequent`, `mostWrong`)은 하나의 묶음으로 출력
- 단원별(`unit`)은 `unitOrder` 기준으로 단원명 섹션을 만들고, 섹션별로 페이지 렌더

해설지/정답표/QR:

- 해설지: `renderSol`에서 `payload.mode === 'type'` 분기 추가
- 정답표: `collectAnswerRows`와 `renderAns`에서 `typeItems` 사용
- QR: `buildTypeQrPayload`가 기존 `compactWrongItem`을 그대로 사용

---

## 5. 검증

- `node --check apmath/js/clinic-print.js` 통과
- `wrong_print_engine.html` 인라인 script 파서 검증 통과

---

## 6. 다음 루프 권장

Loop 5에서 실제 브라우저로 확인할 항목:

- 유형 모드에서 제출 버튼이 항상 보이는지
- 최다빈출/최다오답 출력 문항 수가 미리보기와 일치하는지
- 단원별 출력 순서가 드래그 순서와 일치하는지
- 단원별 해설지/정답표/QR 리뷰가 `typeItems` 기준으로 열리는지
- 기존 학생/반/학년 출력이 변하지 않았는지
