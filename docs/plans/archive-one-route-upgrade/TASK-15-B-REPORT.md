# TASK-15 B 검토 결과

## 완료 범위
PICK 및 tpl=null 입력 **3,331줄 전체**의 저장된 결정적 풀이(step)를 읽어 TPL 제안으로 묶었다. 대상 PT는 271개다. 결과표 C/D/T는 refs.json의 고정 SHA이며, 최신 main taxonomy 17개 팩을 비교했다.

초기 git ls-tree의 한글 경로 이스케이프 때문에 교과서 347줄이 누락되었으나, NUL 구분(-z) 전체 열거로 복구해 지시서와 같은 **3,331줄**을 확인했다. 초기 2,984줄은 일부 스냅샷이었으며, 이전 완료율·잔여량 기록은 이 최종 집계로 대체한다. 입력 인덱스는 보존하고 추가347줄을 뒤에 붙였다.

## 최종 수치
- 배정표 3,331줄 / 미검토 0줄
- TPL 제안 667묶음 / 한 문항 묶음 222개
- ACTIVE TPL 흡수 169줄
- 읽었으나 세부 풀이가 복합·불명확하여 bundle=null 7줄
- 중복 UID 0 / 무효 참조 0 / bundle count 불일치 0
- 원격 쓰기 0. 커밋·push·계획 보고서 반영은 부모 담당.

## 파일
- new-tpl-bundles.json: 최종 제안표
- new-tpl-assign.jsonl: 최종 문항 대응표
- review-evidence.json: 문항별 읽은 풀이와 배정 근거, null 이유
- summary.json: 기계 검증 집계
- refs.json / targets.json: 출처 SHA와 변경하지 않은 입력행
- unicode-path-additions.json: 한글 경로 복구347줄
- consolidation-map.json: 동일 PT의 중복 제안 통합 대응
- feedback-adjustments.json: 기존 정의보다 넓었던 흡수4묶음의 narrowExisting 전환
- final-definition-audit.json: 중등에서 고등팩으로의 흡수3묶음을 relatedKeys로 바꾼 기록 및 최종 동일팩 흡수
- validate.py: UID·입력·PT 일치, 묶음 고유성·참조·개수, ACTIVE TPL 상위PT 검증

## 기준 및 유의점
기존 판정의 PT를 바꾸지 않고 세부 풀이 골격을 정리했다. 기존 문항·그림을 모두 재열람한 독립 재판정이 아니며, 저장된 결정적 풀이를 읽은 TPL 제안 통합이다. 원문 확인 없이 세부 골격을 단정할 수 없는 7줄은 null과 사유를 기록했다. 원문·판정표·정본·등록기·레지스트리는 변경하지 않았다.

다른 학년/과목팩의 기존 키로 흡수하지 않았다. 특히 중등의 접기11줄·확률1줄·좌표거리4줄을 고등팩 흡수에서 제거하고 relatedKeys만 남겼다. 좁은 예제 정의를 넓은 새 묶음으로 억지 흡수하지 않았다. 새 키는 제안일 뿐 등록된 키가 아니다. 배정표의 conditionHints/crossConceptHints는 짧은 보조 태그이며, 수동 읽기와 행번호 대응으로 묶음을 만들었다.

이후 결과 브랜치에 추가된 줄은 별도 delta 검토가 필요하다. 부모가 저장 직전에 최신 브랜치와 비교할 것. 여기의 완결성은 명시한 SHA 기준이다.


## 원격 저장 전 증분 통합

# TASK-15 B 증분 검토

기준 3,331줄과 최신 결과브랜치를 git ls-tree -rz로 비교했다.

- 최신 대상 3,347줄: C 2,434 / D 408 / T 505
- 신규 16줄(D15,T1), 삭제 0, 공통 UID의 PT·step·exam·no 변경 0
- 신규16줄 저장된 결정적 풀이 검토 완료. 새 제안13묶음, 기존2묶음 각각1줄 추가, null0
- 동일 학년·팩 ACTIVE 흡수1줄(TT_COMPOSITE_MIXED)
- 기존 3,331줄 산출물 SHA256 불변 확인. 원격 쓰기0

## 최신 입력 SHA
C 52d2699b5ce8463fa9446e87a811863a275a3ab8
D 87ebdf34a3743d53139ab94aae2312e0e6c71274
T e73ea4c1ac790d04b0a8faa1c7e85673e0e1362d

C의 SHA는 초기 스냅샷과 동일하다. 추가15 PT_ONLY는 실제로 D에 반영되었다.

## 부모 반영 방법
1. new-tpl-bundles.add.json의13묶음을 기존 제안표에 추가한다.
2. new-tpl-assign.add.jsonl의16줄을 기존 배정표에 추가한다. UID 중복이 없는지 확인한다.
3. existing-bundle-increments.json의 두 묶음 count를 각각1 증가시킨다. 이는 전체 레코드 교체가 아니라 증분이며, 기존 examples는 유지해도 된다.
4. baseline이 667묶음/3,331줄 그대로일 때 합계는680묶음/3,347줄, ACTIVE흡수170줄, null7줄이다. 다른 작업자가 수정한 경우에는 현 상태에서 다시 계산한다.

원문 독립 재판정이 아니라 기존 판정의 저장된 step를 바탕으로 TPL을 통합했다. 기존 정본·판정결과·레지스트리 변경 없음. added/removed/changed/refs/summary/review-evidence 파일에 감사 근거를 남겼다.

통합 검증: 3,347 UID 정확 일치, 680 고유 묶음, PT·참조·count 불일치 0. 상단 3,331줄 완료는 최초 스냅샷이고 최신 수치는 이 절이 우선한다.


## 학년 횡단 흡수 교정

독립 검수에서 중2 시험지 3줄이 중1 ACTIVE TPL로 흡수된 것을 확인했다. 중1 1줄의 흡수는 유지하고 중2 3줄을 별도 묶음(absorbInto=null, relatedKeys만 연결)으로 분리했다. 기존 판정 PT는 변경하지 않았다. 최종 3,347줄 / 681묶음 / ACTIVE 흡수 167줄 / null 7줄. 앞선 680묶음·170줄 흡수 수치는 교정 전 이력이며 이 절이 우선한다.
