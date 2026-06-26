# CODEX LOOP 6 — 오답 출력 회귀 검수

> 범위: 유형(type) 출력 추가가 기존 학생/반/학년 출력·QR·렌더 엔진을 깨뜨리지 않았는지 검증.
> 방식: 정적 회귀 감사(diff 기반) + 기존 테스트 실행 + 문법/파서 검증. 실브라우저 렌더는 Loop 5 캡처로 보강.
> 작성일: 2026-06-26
> 대상: [apmath/js/clinic-print.js](apmath/js/clinic-print.js), [apmath/wrong_print_engine.html](apmath/wrong_print_engine.html)

---

## 1. 종합 판정: **PASS**

유형 출력 관련 변경은 전부 **신규 함수/분기 추가**이며, 기존 경로의 로직 라인은 **제거·변경되지 않았다.** 기존 렌더링 핵심 함수도 무수정이다(FAIL 기준 §9 “핵심 함수 불필요 수정” 미해당).

---

## 2. 회귀 항목별 결과 (계획서 Loop 6 체크리스트)

| 항목 | 결과 | 근거 |
|------|------|------|
| 기존 학생별 오답 출력 정상 | ✅ | `renderStudentPages` 무수정. `clinicPrintUpdateStudentList`는 최상단 type 가드만 추가, 기존 본문 무변경. 디스패치 `else → renderStudentPages` 유지. |
| 기존 반별 오답 출력 정상 | ✅ | `renderClassPages` 무수정. `payload.mode==='class'` 분기 유지. `clinicPrintBuildClassWrongItems` 무수정. |
| 기존 학년별 오답 출력 정상 | ✅ | `renderGradePages` 무수정. `mode==='grade'` 분기 유지. `clinicPrintBuildGradeWrongSource` 무수정. |
| 기존 QR payload 정상 | ✅ | `buildClassQrPayload`/`buildGradeQrPayload`/`buildStudentQrPayload`/`expandWrongQrPayload`/`compactWrongItem` 무수정. type은 별도 `buildTypeQrPayload`(신규). |
| 기존 archiveFile 문항 로드 정상 | ✅ | `loadAllQuestionBanks`는 `typeItems` 한 줄만 **추가**(students/class/grade 라인 유지). `findQuestionInBank`/`cloneQuestionForRender`/`fetchArchiveText` 무수정. |
| 이미지 문항 로드 정상 | ✅ | `renderQuestionImageHTML`/`getQuestionImageRaw`/`applyAutoImageSizeClasses` 무수정. type 항목도 동일 렌더 경로 사용. |
| 단원 없는 문항 누락 없음 | ✅ | §3 참조. |
| 콘솔 에러 없음 | ✅(정적) | 두 파일 문법/파서 검증 통과. Loop 5 실브라우저 캡처(문제지/해설지/정답표)에서 에러 없음. |
| 모바일 깨짐 없음 | ✅/주의 | 카드 그리드 반응형(4→2, 유형카드 3→1), 드래그 `touch-action:none`. Loop 5 모바일 캡처 정상(세로 스크롤만). 출력 엔진 A4 가로 스크롤은 **기존 엔진 고유 특성**(회귀 아님). |

---

## 3. 단원 미분류 누락 방지 (FAIL 기준 정면 검증)

체인 전 구간에서 `unitKey` 없는 문항을 **조용히 버리지 않는다.**

1. **패널 그룹핑**(`clinicPrintComputeScopeUnits`): `unitKey || '__UNCLASSIFIED__'` 버킷 → “기타 / 단원 미분류”가 **선택 가능 단원으로 노출**.
2. **payload 빌드**(`clinicPrintBuildTypePayload`, 단원 모드): `orderIndex.has(item.unitKey || '__UNCLASSIFIED__')` 로 필터 → 교사가 미분류를 선택했으면 포함, 미선택이면 제외(= 선택 단원만 출력하는 의도된 동작, 침묵 누락 아님).
3. **최다빈출/최다오답**: 단원 무관 전체 rate-통과 항목 포함 → 미분류도 출력.
4. **엔진 섹션화**(`getTypeSections`): `unitOrder`에 없는 잔여 단원도 뒤에 append하는 **안전망** 존재 → 엔진 단계 누락 0.

> 참고(비회귀, 설계상 제외): 정답률 산출 불가(`correctRate=null`) 항목은 50% 분기 대상이 아니므로 유형 출력에서 제외된다. 이는 단원 누락과 무관하며, 실데이터에선 오답 1건 = 제출 코호트 ≥ 1이라 거의 발생하지 않는다.

---

## 4. 핵심 렌더 엔진 무수정 확인 (diff 증거)

엔진에서 제거된 비헤더 라인은 **단 2줄**, 둘 다 분기 추가에 따른 재포맷:
- `loadAllQuestionBanks`의 `gradeWrongItems` 줄 끝에 `,` 추가(다음 줄 `typeItems` append용).
- `collectAnswerRows`의 `const list =` 에 type 삼항 prepend.

다음 핵심 함수는 **제거/변경 라인 0**: `renderMeasuredExamPages`, `placeSolutionItems`, `buildQuestionBoxHTML`, `cloneQuestionForRender`, `findQuestionInBank`, `wrapLatex`, `autoCompress`, `fitQuestionBox`.

clinic-print.js에서 제거된 라인은 **전부 모달 UI 교체**(라디오 3개 → 카드 4개, 섹션 래퍼, 제출 버튼 id 부여, 초기화 호출 교체)뿐. 기존 집계/빌드 함수(`clinicPrintBuildStudentWrongItems`, `clinicPrintBuildClassWrongItems`, `clinicPrintBuildGradeWrongSource`, `clinicPrintBuildExamCohortCounts`, `clinicPrintBuildPayload`)는 **제거 라인 0**, 재사용만 함.

---

## 5. 실행 검증

```text
node --check apmath/js/clinic-print.js                         → PASS
wrong_print_engine.html 인라인 script 2개 new Function 파서     → errors: 0
tests/apmath-clinic-print-assignment-visibility.test.js        → PASS
tests/assessment-archive-print-flow.test.js                    → PASS
```

기존 계약 테스트 통과 = 과제 가시성 기준일(2026-06-01), class_exam_assignments 읽기, archive 출력 흐름 등 기존 계약 무손상.

---

## 6. 디스패치/필드 호환성

- 엔진 `render()` 분기 순서: `ans → review → sol`(state.mode) 다음 `type → grade → class → student`(payload.mode). type을 **앞에 추가**, 기존 분기 순서·동작 유지.
- payload 구조: 기존 `students`/`classWrongItems`/`gradeWrongItems` 키 유지. type은 `typeItems`/`typeGroups`(엔진은 `getTypeSections`로 파생)·`typeMode`/`scope`/`rateRule`/`selectedUnitKeys`/`unitOrder` **추가**. (계획서 §6 일치)
- `clinicPrintBuildTypePayload`는 기존 `clinicPrintBuildPayload`를 호출해 베이스(exams/options/className/createdDate 등)를 만든 뒤 type 필드만 오버라이드 → 포맷 일관성 보장.

---

## 7. 잔여 리스크 (비회귀 / 후속 권고)

정적 검수로는 “회귀 없음”이 확인됐다. 다음은 결함이 아니라 **운영 환경 최종 확인 권고**다.

1. **풀 APMS 실로그인 런타임 콘솔 에러**: 본 검수는 문법/파서/계약 테스트 + Loop 5 하네스 캡처까지. 실제 역할 로그인 + 실 DB로 학생/반/학년/유형 4종을 한 번씩 출력해 콘솔 0 에러 최종 확인 권고.
2. **권한 범위(학년 데이터)**: 학년 모드는 `state.db.classes/exam_sessions` 적재 범위에 종속(계획서 §1). 역할별로 권한 밖 학년/반이 노출되지 않는지 실데이터 확인 권고.
3. **모바일 출력 엔진 가로 스크롤**: 기존 A4 인쇄 엔진 특성(회귀 아님). 교사 모바일 검토 편의 개선은 별도 과제.

---

## 8. PASS 기준 대조 (계획서 §8)

| PASS 기준 | 충족 |
|-----------|------|
| 학생/반/학년/유형 카드 구조 적용 | ✅ |
| 기존 학생별/반별/학년별 출력 유지 | ✅ (무수정) |
| 유형 카드 안 최다빈출/최다오답/단원별 표시 | ✅ |
| 최다빈출 = 정답률 50% 이상 | ✅ |
| 최다오답 = 정답률 50% 미만 | ✅ |
| 단원별 = 마스터 단원키 기준 | ✅ (unitKey 그룹핑 + 순서 어댑터) |
| 단원 선택 순서가 출력 순서 반영 | ✅ (`unitOrder` → 엔진 섹션 정렬) |
| 단원 미분류 누락 없음 | ✅ |
| 기존 출력 엔진 회귀 없음 | ✅ |
| 모바일 사용 가능 | ✅ (세로 스크롤; 인쇄 엔진 가로 스크롤은 기존 특성) |

**결론: Loop 0~6 전 구간 PASS. 회귀 없음.**
