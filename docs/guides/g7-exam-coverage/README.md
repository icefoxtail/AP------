# 중1 기말 범위 교재–실험실 대응표

이 문서는 실제로 읽은 교재 문항과 기존 실험실 장면을 연결한 현행 작업표다. **선택 수록된 문항 참조 중심 자료이며, 두 교재의 전수 완독·전수 수록 결과가 아니다.** 아래 전체 표는 JSON에 수록된 모든 대응행을 보여 준다는 뜻이다. 각 페이지의 모든 문항을 수록했다는 뜻으로 읽지 않는다.

현재 **322개 대응행, 고유 교재문항 320개**를 담고 있다. 입체도형과 겉넓이·부피에 함께 수록한 두 문항은 삭제하지 않고 각 단원의 검토 목적을 유지했다. 원문과 장면을 다시 대조한 독립 검수는 **15행·12쪽 표본** 범위이며, 322행 전체에 대한 독립 검수 PASS를 의미하지 않는다.

## 원본과 페이지 기준

| 교재 키 | 원본 PDF | PDF 페이지 수 |
|---|---|---:|
| `mid` | [Drive 원본](https://drive.google.com/file/d/110F8vung_mFpcl_FD9zjWJPA_T-Pl-3C/view) · `110F8vung_mFpcl_FD9zjWJPA_T-Pl-3C` | 182 |
| `final` | [Drive 원본](https://drive.google.com/file/d/1bzmRX1z7xvUBkVn6ifqxkUGYS_MXG0-y/view) · `1bzmRX1z7xvUBkVn6ifqxkUGYS_MXG0-y` | 184 |

`PDF p.`는 파일 첫 장부터 세는 1부터 시작하는 페이지 번호다. `인쇄 p.`는 JSON의 교재 표기 페이지이며 PDF 번호와 별도로 보존했다. 문항 식별에는 교재 키·PDF 페이지·문항 번호를 사용한다. `01`과 `1`, `고난도 기출문제 12`와 `12`처럼 번호가 같은 표기는 구조검사에서 정규화하며, 이름이 붙은 예제는 전체 이름을 유지한다.

## 상태와 읽는 방법

| JSON 상태 | 표의 이름 | 현재 의미와 필요한 후속 확인 |
|---|---|---|
| `covered` | 정적 대응 | 질문·개념·풀이 코드가 해당 유형에 대응한다는 정적 판단. 교재 수치·조건의 완전 재현, 조작·화면 검사 또는 브라우저 PASS가 아니다. |
| `diagram_upgrade` | 그림 보강 검토 | 기존 장면을 출발점으로 보조선·라벨·변형·비교 표현 등의 보강을 검토한다. 실제 결함 확정이나 수리 완료를 뜻하지 않는다. |
| `solution_upgrade` | 풀이 보강 검토 | 역산·서술·풀이 순서 등을 더 드러낼 필요가 있다는 검토 방향. 원문 조건 대조와 실제 단계 확인 후 보강 범위를 확정한다. |
| `new_scene` | 새 장면 검토 | 현재 연결만으로는 해당 조건·학습 목표의 충족을 확인하지 못해 별도 장면을 검토한다. 링크가 있어도 근접한 출발점이며, 기능 부재를 전수 확인했다는 판정이 아니다. |
| `evidence_debt` | 근거 추가 필요 | 문항 조건과 장면의 일치 근거가 부족하거나 연결이 아직 없다. 원문과 코드·화면을 더 대조해야 하며 누락·오류 확정이 아니다. |

표의 「부족 학습요소·후속 검토」는 원본 JSON의 `action`을 보존한다. 정적 대응 행의 “연결”은 추가 결함이 확인됐다는 뜻이 아니며, 다른 행의 “추가·보강”은 작업 제안이다. 「장면·대응 근거」는 `matches.reason`에 기록된 근거 수준 그대로 읽는다. 장면 링크를 열 수 있다는 사실만으로 내용 일치나 화면 정상 여부가 입증되지는 않는다. `—`는 연결 장면 미기록을 뜻한다.

난도는 `basic`(기초)·`standard`(표준)·`advanced`(심화)와 교재 코너/문항 요구의 근거를 함께 표시한다. 이는 정답률 측정이나 독립 난도 인증이 아니다. 우선순위는 데이터의 `P0` → `P1` → `P2` 순서이며, 출시 결함 등급이나 수리 완료 표시는 아니다.

## 단원별 수량

| 단원 | 대응행 | 정적 대응 | 그림 보강 검토 | 풀이 보강 검토 | 새 장면 검토 | 근거 추가 필요 | 원본 JSON |
|---|---:|---:|---:|---:|---:|---:|---|
| 다각형 | 106 | 0 | 32 | 41 | 33 | 0 | [polygons.json](polygons.json) |
| 원과 부채꼴 | 74 | 46 | 0 | 1 | 0 | 27 | [circle-sector.json](circle-sector.json) |
| 입체도형 | 75 | 16 | 0 | 46 | 13 | 0 | [solids.json](solids.json) |
| 겉넓이와 부피 | 67 | 13 | 0 | 31 | 23 | 0 | [surface-volume.json](surface-volume.json) |
| **합계** | 322 | 75 | 32 | 119 | 69 | 27 | — |

### 단원 간 공유 문항

| 원문 문항 | 함께 수록한 행 | 공유 이유 |
|---|---|---|
| `final` PDF 178쪽 12번 | SOL-074 · SV-055 | 축과 떨어진 원의 회전체·고리 단면을 두 단원에서 함께 검토 |
| `final` PDF 179쪽 13번 | SOL-075 · SV-056 | 원뿔 최단 경로와 넓이를 두 단원에서 함께 검토 |

공유 행은 아래 표의 ID 옆에 「공유」로 표시했다. 같은 교재문항이라도 단원별 장면과 보강 제안이 달라 상태·우선순위가 다를 수 있다. 고유문항을 세면서 이 차이를 지우지 않는다. 허용된 공유 관계는 [index.json](index.json)의 `sharedQuestions`에만 선언하며, 새 중복은 구조검사 오류다.

## 검토·미검토 범위

아래 범위는 제작자가 남긴 단원별 `reviewedPdfPages`와 `unreviewedRanges`를 그대로 옮겼다. 검토 페이지는 문항을 읽은 범위이지 해당 페이지의 모든 문항에 대한 독립 검증 범위가 아니다. 단원별 담당 범위가 다르므로 한 단원의 미검토 페이지가 다른 단원에는 검토 페이지로 실릴 수 있다. 접촉 시트로 위치만 확인한 페이지는 개별 문항 검토로 승격하지 않는다.

| 단원 | 교재 | 문항을 읽은 PDF 페이지 | 미검토로 기록한 PDF 범위·이유 |
|---|---|---|---|
| 다각형 | `mid` | 75–98 | 1-74, 99-182 — 다각형 본문 밖; 122-173 실전모의 및 174-182 부록의 다각형 문항은 미확인 |
| 다각형 | `final` | 개별 문항 검토 기록 없음 | 1-184 — 별도 범위 미검토; 이 파일은 중간권 다각형 본문만 수록 |
| 원과 부채꼴 | `mid` | 102–104, 180–182 | 99-101, 105-122, 174-179 — 접촉 시트로 범위만 살폈으며 개별 문항 검토 미완료 |
| 원과 부채꼴 | `final` | 8–13, 16–17, 176–177 | 5-7, 14-15, 18-26, 171-175, 178-184 — 접촉 시트로 범위만 살폈으며 개별 문항 검토 미완료 |
| 입체도형 | `mid` | 개별 문항 검토 기록 없음 | 1-182 — 본 담당에서 직접 확인하지 않음 |
| 입체도형 | `final` | 27–48, 176–184 | 1-26, 49-175 — 본 담당에서 직접 확인하지 않음; 179-181 중 겉넓이·부피는 별도 담당 가능하며 일부만 입체 관련 확인 |
| 겉넓이와 부피 | `mid` | 개별 문항 검토 기록 없음 | 1-182 — 해당 PDF 페이지의 개별 문항 미검토 |
| 겉넓이와 부피 | `final` | 53–59, 64–67, 178–181 | 1-52, 60-63, 68-177, 182-184 — 개별 문항 미검토 |

## 구조검사 실행

저장소 루트에서 실제 Chrome으로 수집한 장면 목록을 입력한다. 목록 형식은 `{ "lab-id": [{ "id": "scene-id", "title": "장면 이름" }] }`이다. 이 도구는 원본 PDF를 읽거나 브라우저를 실행하지 않는다. 장면 목록을 임의로 생성하거나 코드에서 추측한 목록으로 대체하지 않는다.

```powershell
node apmath/playground/next/tools/g7-coverage-check.mjs --scene-index .codex/g7-video-qa/scene-index.json
```

검사는 unit 필드, 행 ID 중복, 상태·난도·우선순위 enum, 출처 ID/URL, 정수 PDF 페이지 범위, 검토/미검토 스키마, 실제 장면 참조와 중복 교재문항을 확인한다. 알려진 공유 문항은 그대로 표시하며 새로운 중복은 실패한다. 정확한 행 개수는 PASS 조건으로 고정하지 않는다. 장면 목록 파일이 없거나 참조가 깨지면 종료 코드 1과 `FAIL`을 출력한다. 성공은 종료 코드 0과 `scope: structure-and-scene-references-only`이며 **구조검사만의 PASS**다.

이 문서에는 실행하지 않은 검사 결과를 기록하지 않았다. 브라우저·수학·교재 전수 검수 결과는 이 구조검사로 추정하지 않는다. 원시 캡처와 실행 로그는 운영 인덱스에 포함하지 않는다.

## 전체 대응행

### 다각형 · 106행

#### mid · PDF 78쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-001 | 인쇄 p.78 · **기출 Best 01**<br>다각형 판별 | 기초<br>기출 Best 기초 정의·개수 문항 | — | 새 장면 검토<br>`new_scene` | 평면의 닫힌 선분 도형과 원·입체를 비교한다. | P1 |
| POL-002 | 인쇄 p.78 · **기출 Best 02**<br>사각형 내각과 외각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 그림 보강 검토<br>`diagram_upgrade` | 사각형 두 꼭짓점에서 각각 내각과 외각의 보각을 표시하고 합을 구한다. | P1 |
| POL-003 | 인쇄 p.78 · **기출 Best 03**<br>정다각형 성질 판별 | 기초<br>기출 Best 기초 정의·개수 문항 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각 | 새 장면 검토<br>`new_scene` | 변만 같은 마름모와 각만 같은 직사각형을 반례로 비교한다. | P1 |
| POL-004 | 인쇄 p.78 · **기출 Best 04**<br>한 꼭짓점 대각선과 삼각형 | 기초<br>기출 Best 기초 정의·개수 문항 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할 | 풀이 보강 검토<br>`solution_upgrade` | 기존 칠각형 풀이 끝에 a+b=4+5=9라는 합 계산 문장을 보강한다. | P2<br>기존 p1-one은 한 꼭짓점에서 그은 대각선 4개와 나뉜 삼각형 5개를 다룬다. 원문이 묻는 a+b의 마지막 합 계산 문장만 보강 대상이다. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-005 | 인쇄 p.78 · **기출 Best 05**<br>한 꼭짓점 대각선에서 전체 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 한 꼭짓점의 8개에서 변의 수를 역산하고 전체를 중복 제거한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-006 | 인쇄 p.78 · **기출 Best 06**<br>원탁 악수와 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 그림 보강 검토<br>`diagram_upgrade` | 6명에서 양옆과 자신을 제외한 악수 선을 연결하고 중복을 반으로 줄인다. | P1 |

#### mid · PDF 79쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-007 | 인쇄 p.79 · **기출 Best 07**<br>삼각형 내각의 일차식 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 세 내각의 일차식을 합해 180도 방정식을 세운다. | P1 |
| POL-008 | 인쇄 p.79 · **기출 Best 08**<br>삼각형 외각 일차식 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 풀이 보강 검토<br>`solution_upgrade` | 외각과 떨어진 두 내각을 같은 문제 그림에서 대응해 방정식을 세운다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-009 | 인쇄 p.79 · **기출 Best 09**<br>한 내각의 이등분선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 그림 보강 검토<br>`diagram_upgrade` | 한 꼭짓점의 이등분선으로 분할된 삼각형의 각을 차례로 구한다. | P1 |
| POL-010 | 인쇄 p.79 · **기출 Best 10**<br>두 내각 이등분선 역산 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 교각 120도에서 꼭짓각을 역산하는 문제 변형을 제공한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-011 | 인쇄 p.79 · **기출 Best 11**<br>내각과 외각 이등분선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 내각·외각 이등분선을 표시하고 주어진 48도의 절반을 도출한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-012 | 인쇄 p.79 · **기출 Best 12**<br>이등변삼각형 연쇄 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-iso](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-iso) — 연결된 이등변삼각형과 외각<br>[g7-polygons#p2-chain](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-chain) — 등변 선분을 이어 각을 추적 | 그림 보강 검토<br>`diagram_upgrade` | AB=AC=CD의 같은 눈금 세 개를 표시하고 외각으로 각을 이어 구한다. | P1 |

#### mid · PDF 80쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-013 | 인쇄 p.80 · **기출 Best 13**<br>오목한 화살표 모양 각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-concave](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-concave) — 오목다각형의 내각과 작은 각 | 그림 보강 검토<br>`diagram_upgrade` | 오목 꼭짓점의 작은 각과 나머지 세 각의 관계를 그림에 강조한다. | P1 |
| POL-014 | 인쇄 p.80 · **기출 Best 14**<br>오각별 꼭짓각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각 | 풀이 보강 검토<br>`solution_upgrade` | 다섯 꼭짓각의 합 180도에서 주어진 네 각을 뺀다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-015 | 인쇄 p.80 · **기출 Best 15**<br>내각의 합에서 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 내각의 합 2160도에서 변의 수를 구한 뒤 전체 대각선을 계산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-016 | 인쇄 p.80 · **기출 Best 16**<br>오각형 내각과 외각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 그림 보강 검토<br>`diagram_upgrade` | 주어진 네 내각으로 남은 내각을 구하고 바깥 외각으로 전환한다. | P1 |
| POL-017 | 인쇄 p.80 · **기출 Best 17**<br>다각형 외각의 합 일차식 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 그림 보강 검토<br>`diagram_upgrade` | 외각 다섯 개 중 x와 x+20을 포함해 360도 식을 세운다. | P1 |
| POL-018 | 인쇄 p.80 · **기출 Best 18**<br>겹친 다각형 각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 교차한 선에 보조선을 긋고 다각형과 삼각형의 각 합으로 나눈다. | P1 |

#### mid · PDF 81쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-019 | 인쇄 p.81 · **기출 Best 19**<br>세 삼각형이 둘러싼 각 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 새 장면 검토<br>`new_scene` | 세 바깥 삼각형과 가운데 삼각형의 외각을 대응시켜 각의 합을 구한다. | P1 |
| POL-020 | 인쇄 p.81 · **기출 Best 20**<br>정다각형 외각에서 내각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 풀이 보강 검토<br>`solution_upgrade` | 외각 40도에서 변의 수와 내각의 합을 순서대로 구한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-021 | 인쇄 p.81 · **기출 Best 21**<br>내각 대 외각 비 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-ratio](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-ratio) — 내외각의 비에서 변의 수 | 풀이 보강 검토<br>`solution_upgrade` | 4 대 1과 보각 관계에서 한 외각을 구하고 변의 수를 찾는다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-022 | 인쇄 p.81 · **기출 Best 22**<br>정사각형과 정삼각형 내부 결합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-join](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-join) — 한 변을 공유하는 정다각형 | 새 장면 검토<br>`new_scene` | 정사각형 안의 정삼각형과 같은 변을 이용하여 두 각의 차를 찾는다. | P1 |
| POL-023 | 인쇄 p.81 · **기출 Best 23**<br>정오각형 두 대각선 교각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-diag](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-diag) — 정다각형 대각선의 교각 | 풀이 보강 검토<br>`solution_upgrade` | 정오각형의 이등변삼각형과 대각선 교각을 단계별로 표시한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-024 | 인쇄 p.81 · **기출 Best 24**<br>정오각형과 정팔각형 결합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-join](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-join) — 한 변을 공유하는 정다각형 | 풀이 보강 검토<br>`solution_upgrade` | 공유 꼭짓점에서 두 내각을 360도에서 뺀 남은 각을 직접 답한다. | P2<br>p4-join은 남는 각을 중간에 계산하지만 문제에서는 이어 만든 이등변삼각형의 밑각을 묻는다. |

#### mid · PDF 82쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-025 | 인쇄 p.82 · **기출 Best 쌍둥이 01**<br>다각형 그림 판별 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | — | 새 장면 검토<br>`new_scene` | 열린 선분·곡선·입체를 닫힌 선분 도형과 비교한다. | P1 |
| POL-026 | 인쇄 p.82 · **기출 Best 쌍둥이 02**<br>두 외각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 삼각형 두 꼭짓점의 외각을 각각 내각의 보각으로 표시해 합한다. | P1 |
| POL-027 | 인쇄 p.82 · **기출 Best 쌍둥이 03**<br>정다각형 조건과 변의 수 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각 | 새 장면 검토<br>`new_scene` | 변과 각이 각각 같고 꼭짓점 수와 변 수의 합이 18인 조건을 해석한다. | P1 |
| POL-028 | 인쇄 p.82 · **기출 Best 쌍둥이 04**<br>한 꼭짓점 대각선과 내부 점 분할 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할 | 새 장면 검토<br>`new_scene` | 한 꼭짓점 11개에서 변의 수를 찾고 내부 한 점에서 꼭짓점으로 이어진 삼각형 수를 센다. | P1 |
| POL-029 | 인쇄 p.82 · **기출 Best 쌍둥이 05**<br>전체 대각선에서 변의 수 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-find](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-find) — 전체 대각선 수에서 변의 수 역산 | 풀이 보강 검토<br>`solution_upgrade` | 대각선 35개로부터 가능한 변의 수를 찾아 검산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-030 | 인쇄 p.82 · **기출 Best 쌍둥이 06**<br>원탁 일곱 명의 악수 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 그림 보강 검토<br>`diagram_upgrade` | 양옆을 제외한 연결을 대각선으로 대응하고 중복을 제거한다. | P1 |

#### mid · PDF 83쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-031 | 인쇄 p.83 · **기출 Best 쌍둥이 07**<br>삼각형 세 내각의 비 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 새 장면 검토<br>`new_scene` | 1 대 2 대 3의 각을 같은 단위로 두어 180도를 나눈다. | P1 |
| POL-032 | 인쇄 p.83 · **기출 Best 쌍둥이 08**<br>두 삼각형 외각 연결 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 공유 직선과 교차점의 보각·외각을 차례대로 표시한다. | P1 |
| POL-033 | 인쇄 p.83 · **기출 Best 쌍둥이 09**<br>내각 이등분선과 외각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 그림 보강 검토<br>`diagram_upgrade` | 한 내각의 이등분선과 반대쪽 외각이 주어진 삼각형으로 재구성한다. | P1 |
| POL-034 | 인쇄 p.83 · **기출 Best 쌍둥이 10**<br>두 내각 이등분선 교각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 꼭짓각 110도에서 두 이등분선의 교각을 구하는 단계를 연결한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-035 | 인쇄 p.83 · **기출 Best 쌍둥이 11**<br>내각 외각 이등분선 역산 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 교각 32도에서 원래 꼭짓각을 두 배로 역산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-036 | 인쇄 p.83 · **기출 Best 쌍둥이 12**<br>이등변삼각형 연쇄와 외각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-iso](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-iso) — 연결된 이등변삼각형과 외각<br>[g7-polygons#p2-chain](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-chain) — 등변 선분을 이어 각을 추적 | 그림 보강 검토<br>`diagram_upgrade` | AD=BD=BC의 동일한 눈금을 모두 나타내고 외각을 따라 역산한다. | P1 |

#### mid · PDF 84쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-037 | 인쇄 p.84 · **기출 Best 쌍둥이 13**<br>오목 화살표의 나머지 각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-concave](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-concave) — 오목다각형의 내각과 작은 각 | 그림 보강 검토<br>`diagram_upgrade` | 작은 오목 각 130도와 양 끝 각으로 위쪽 각을 역산한다. | P1 |
| POL-038 | 인쇄 p.84 · **기출 Best 쌍둥이 14**<br>오각별 각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각 | 풀이 보강 검토<br>`solution_upgrade` | 주어진 네 꼭짓각과 미지의 꼭짓각을 같은 별에서 묶는다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-039 | 인쇄 p.84 · **기출 Best 쌍둥이 15**<br>한 꼭짓점 대각선에서 내각 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 풀이 보강 검토<br>`solution_upgrade` | 대각선 8개에서 변의 수를 구하고 삼각형 분할로 내각 합을 계산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-040 | 인쇄 p.84 · **기출 Best 쌍둥이 16**<br>육각형의 한 내각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 그림 보강 검토<br>`diagram_upgrade` | 육각형의 주어진 다섯 각을 빼서 남은 내각을 찾는다. | P1 |
| POL-041 | 인쇄 p.84 · **기출 Best 쌍둥이 17**<br>외각의 합과 배수식 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 그림 보강 검토<br>`diagram_upgrade` | x와 2x가 포함된 다섯 외각을 한 바퀴로 모은다. | P1 |
| POL-042 | 인쇄 p.84 · **기출 Best 쌍둥이 18**<br>오목 겹친 도형 각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-concave](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-concave) — 오목다각형의 내각과 작은 각 | 새 장면 검토<br>`new_scene` | 겹친 도형에 보조선을 그어 오목 부분의 두 각의 합을 구한다. | P1 |

#### mid · PDF 85쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-043 | 인쇄 p.85 · **기출 Best 쌍둥이 19**<br>사각형 주변 네 삼각형 각 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 새 장면 검토<br>`new_scene` | 사각형 바깥 네 삼각형의 여덟 각을 중심 외각 합과 연결한다. | P1 |
| POL-044 | 인쇄 p.85 · **기출 Best 쌍둥이 20**<br>내각 합에서 정다각형 외각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각 | 풀이 보강 검토<br>`solution_upgrade` | 내각의 합 2880도에서 변의 수를 찾고 한 외각을 구한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-045 | 인쇄 p.85 · **기출 Best 쌍둥이 21**<br>내외각 비에서 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-ratio](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-ratio) — 내외각의 비에서 변의 수<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 7 대 2로 한 외각과 변의 수를 찾은 뒤 대각선을 계산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-046 | 인쇄 p.85 · **기출 Best 쌍둥이 22**<br>정사각형 정삼각형 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-join](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-join) — 한 변을 공유하는 정다각형 | 새 장면 검토<br>`new_scene` | 내접 정삼각형과 정사각형 대각선이 함께 만드는 각을 구한다. | P1 |
| POL-047 | 인쇄 p.85 · **기출 Best 쌍둥이 23**<br>정오각형 대각선 두 각의 차 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-diag](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-diag) — 정다각형 대각선의 교각<br>[g7-polygons#p4-fan](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-fan) — 정다각형 대각선이 나누는 각 | 그림 보강 검토<br>`diagram_upgrade` | 대각선 교각과 꼭짓점의 각을 구별하고 두 값의 차를 구한다. | P1 |
| POL-048 | 인쇄 p.85 · **기출 Best 쌍둥이 24**<br>정팔각형 정육각형 결합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-join](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-join) — 한 변을 공유하는 정다각형 | 풀이 보강 검토<br>`solution_upgrade` | 두 정다각형의 공통 꼭짓점에서 남는 각을 직접 구한다. | P2<br>p4-join은 남는 각을 중간에 계산하지만 문제에서는 이어 만든 이등변삼각형의 밑각을 묻는다. |

#### mid · PDF 86쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-049 | 인쇄 p.86 · **집중공략 1 예제**<br>내각 외각 이등분선 발상 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 두 삼각형에서 같은 외각을 각각 표현하여 교각이 꼭짓각의 반임을 유도한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-050 | 인쇄 p.86 · **집중공략 연습 1-1**<br>이등분선 교각 순방향 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 꼭짓각 50도에서 교각을 구하고 발상과 등식을 같은 그림으로 제시한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-051 | 인쇄 p.86 · **집중공략 연습 1-2**<br>이등분선 교각 역방향 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 교각 15도에서 꼭짓각을 역으로 구한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |

#### mid · PDF 87쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-052 | 인쇄 p.87 · **집중공략 2 예제**<br>교차된 도형의 보조선 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 보조선 두 개로 사각형과 삼각형으로 분해하여 각의 합을 시각화한다. | P0 |
| POL-053 | 인쇄 p.87 · **집중공략 연습 2-1**<br>겹친 삼각형의 각 합 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 안쪽과 바깥 삼각형으로 나누어 표시된 여섯 각을 합한다. | P0 |
| POL-054 | 인쇄 p.87 · **집중공략 연습 2-2**<br>겹친 다각형의 각 합 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 교차 구조에 보조선을 그어 아홉 각을 다각형 내각 합으로 변환한다. | P0 |

#### mid · PDF 88쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-055 | 인쇄 p.88 · **서술형 1 예제**<br>삼각형 외각 방정식 서술 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 풀이 보강 검토<br>`solution_upgrade` | 그림과 동일한 50도, x+10도, 3x+10도로 식과 근거를 순서대로 쓴다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-056 | 인쇄 p.88 · **서술형 연습 1-1**<br>내각 외각 미지수 서술 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 두 외각과 미지수 식을 같은 삼각형에 표시하고 풀이를 서술한다. | P1 |
| POL-057 | 인쇄 p.88 · **서술형 연습 1-2**<br>맞꼭지각과 삼각형 각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 새 장면 검토<br>`new_scene` | 교차한 두 삼각형에서 맞꼭지각을 이어 양쪽 내각 합을 사용한다. | P1 |

#### mid · PDF 89쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-058 | 인쇄 p.89 · **서술형 2 예제**<br>내외각 비에서 대각선 서술 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-ratio](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-ratio) — 내외각의 비에서 변의 수<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 5 대 1에서 외각, 변의 수, 대각선 수를 같은 풀이에서 연결한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-059 | 인쇄 p.89 · **서술형 연습 2-1**<br>내외각 비와 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-ratio](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-ratio) — 내외각의 비에서 변의 수<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 3 대 1에서 정다각형과 대각선 수를 서술한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-060 | 인쇄 p.89 · **서술형 연습 2-2**<br>내외각 비와 내각 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-ratio](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-ratio) — 내외각의 비에서 변의 수<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 풀이 보강 검토<br>`solution_upgrade` | 3 대 2에서 정다각형을 찾고 내각 합까지 연결한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |

#### mid · PDF 90쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-061 | 인쇄 p.90 · **실전문제 1회 02**<br>한 꼭짓점 대각선과 분할 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할 | 풀이 보강 검토<br>`solution_upgrade` | 이십각형의 대각선과 삼각형 개수를 각각 구하여 더한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-062 | 인쇄 p.90 · **실전문제 1회 03**<br>대각선에서 정다각형 판정 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-find](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-find) — 전체 대각선 수에서 변의 수 역산 | 풀이 보강 검토<br>`solution_upgrade` | 대각선 14개와 같은 변·각 조건을 함께 사용해 정다각형을 찾는다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-063 | 인쇄 p.90 · **실전문제 1회 04**<br>여섯 동 전체 직통 회선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 새 장면 검토<br>`new_scene` | 모든 동 사이의 연결은 변도 포함하므로 대각선 수에 변의 수를 더한다. | P1 |
| POL-064 | 인쇄 p.90 · **실전문제 1회 05**<br>삼각형 내각의 비 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 새 장면 검토<br>`new_scene` | 2 대 3 대 4로 내각을 나누어 가장 큰 각을 찾는다. | P1 |
| POL-065 | 인쇄 p.90 · **실전문제 1회 06**<br>연결된 삼각형의 외각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 교차각 130도와 연장선이 있는 두 삼각형을 순서대로 연결한다. | P1 |

#### mid · PDF 91쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-066 | 인쇄 p.91 · **실전문제 1회 07**<br>이등변삼각형과 이등분선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각<br>[g7-polygons#p2-iso](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-iso) — 연결된 이등변삼각형과 외각 | 새 장면 검토<br>`new_scene` | 등변 표시로 밑각을 구한 뒤 한 밑각 이등분선을 이용한다. | P1 |
| POL-067 | 인쇄 p.91 · **실전문제 1회 08**<br>두 내각 이등분선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 꼭짓각 76도에서 이등분선 교각을 설명한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-068 | 인쇄 p.91 · **실전문제 1회 09**<br>등변 네 선분의 연쇄 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-chain](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-chain) — 등변 선분을 이어 각을 추적 | 그림 보강 검토<br>`diagram_upgrade` | AB=AC=CD=DE 네 선분에 같은 눈금을 넣고 외각을 이어 간다. | P1 |
| POL-069 | 인쇄 p.91 · **실전문제 1회 10**<br>별 내부 교각과 꼭짓각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각 | 그림 보강 검토<br>`diagram_upgrade` | 별 내부의 교각 65도와 두 꼭짓각을 삼각형 외각으로 연결한다. | P1 |
| POL-070 | 인쇄 p.91 · **실전문제 1회 11**<br>내각 합과 대각선 통합 판별 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거<br>[g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할 | 풀이 보강 검토<br>`solution_upgrade` | 1440도에서 변의 수·대각선·삼각형 수를 순서대로 검증한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-071 | 인쇄 p.91 · **실전문제 1회 12**<br>오각형 내각과 외각 혼합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 그림 보강 검토<br>`diagram_upgrade` | 내각과 외각이 섞인 다섯 꼭짓점을 같은 기준으로 변환한다. | P1 |

#### mid · PDF 92쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-072 | 인쇄 p.92 · **실전문제 1회 13**<br>사각형 외각과 내각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 그림 보강 검토<br>`diagram_upgrade` | 사각형의 주어진 내각과 외각을 통일해 한 바퀴로 합한다. | P1 |
| POL-073 | 인쇄 p.92 · **실전문제 1회 14**<br>교차한 다각형의 여섯 각 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 교차 도형을 삼각형과 사각형으로 분해해 표시된 각들을 모은다. | P1 |
| POL-074 | 인쇄 p.92 · **실전문제 1회 15**<br>정다각형 한 내각과 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 한 내각 160도에서 외각과 변의 수를 구하고 대각선을 계산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-075 | 인쇄 p.92 · **실전문제 1회 16**<br>정다각형 외각과 한 꼭짓점 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각<br>[g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할 | 풀이 보강 검토<br>`solution_upgrade` | 외각 45도에서 변의 수를 구하고 n-3을 적용한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-076 | 인쇄 p.92 · **실전문제 1회 17**<br>정오각형 내부 정삼각형과 정사각형 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각 | 새 장면 검토<br>`new_scene` | 세 정다각형의 공유 꼭짓점과 교차선에서 각을 차례로 표시한다. | P1 |
| POL-077 | 인쇄 p.92 · **실전문제 1회 18**<br>정오각형 변의 연장 교점 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각 | 새 장면 검토<br>`new_scene` | 두 변의 연장으로 생긴 삼각형에 정오각형 외각을 옮겨 두 각의 차를 구한다. | P1 |

#### mid · PDF 93쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-078 | 인쇄 p.93 · **실전문제 1회 서술형 19**<br>삼각형 분할 수에서 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 한 꼭짓점에서 생긴 삼각형 14개로 변의 수와 대각선 수를 서술한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-079 | 인쇄 p.93 · **실전문제 1회 서술형 20**<br>내외각 이등분선 역산 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 이등분선 교각 42도에서 꼭짓각을 도출하는 이유를 쓴다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-080 | 인쇄 p.93 · **실전문제 1회 서술형 21**<br>외각의 합 일차식 서술 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 그림 보강 검토<br>`diagram_upgrade` | 직각·135도 내각과 두 미지 외각을 한 바퀴로 묶어 식을 쓴다. | P1 |
| POL-081 | 인쇄 p.93 · **실전문제 1회 서술형 22**<br>정육각형 대각선 교각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-diag](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-diag) — 정다각형 대각선의 교각 | 그림 보강 검토<br>`diagram_upgrade` | 정육각형에서 두 대각선과 교점 각을 표시하고 등변 삼각형으로 해설한다. | P1 |

#### mid · PDF 94쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-082 | 인쇄 p.94 · **실전문제 2회 01**<br>정다각형 성질 반례 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각 | 새 장면 검토<br>`new_scene` | 변이 같은 사각형도 정사각형이 아닐 수 있음을 마름모로 보인다. | P1 |
| POL-083 | 인쇄 p.94 · **실전문제 2회 02**<br>한 꼭짓점 대각선과 분할 역산 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할 | 풀이 보강 검토<br>`solution_upgrade` | 대각선 수와 삼각형 수의 합 25에서 변의 수를 구한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-084 | 인쇄 p.94 · **실전문제 2회 03**<br>한 꼭짓점과 전체 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 십이각형의 한 꼭짓점 대각선과 전체 대각선을 각각 계산해 합한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-085 | 인쇄 p.94 · **실전문제 2회 04**<br>세 같은 선분과 삼각형 각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-iso](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-iso) — 연결된 이등변삼각형과 외각 | 새 장면 검토<br>`new_scene` | AD=BD=CD를 모두 표시하고 두 이등변삼각형의 각을 결합한다. | P1 |
| POL-086 | 인쇄 p.94 · **실전문제 2회 05**<br>삼각형 분할과 외각의 차 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 안쪽 선분이 나눈 두 각과 외각을 한 그림에 표시하여 차를 구한다. | P1 |
| POL-087 | 인쇄 p.94 · **실전문제 2회 06**<br>이등분선과 외각의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각<br>[g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 그림 보강 검토<br>`diagram_upgrade` | 꼭짓각의 이등분과 양쪽 외각을 따라 x+y를 구한다. | P1 |

#### mid · PDF 95쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-088 | 인쇄 p.95 · **실전문제 2회 07**<br>내외각 이등분선 교각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각 | 풀이 보강 검토<br>`solution_upgrade` | 꼭짓각 60도와 외각 이등분선으로 교각을 구한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-089 | 인쇄 p.95 · **실전문제 2회 08**<br>등변 선분 연쇄 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-chain](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-chain) — 등변 선분을 이어 각을 추적<br>[g7-polygons#p2-iso](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-iso) — 연결된 이등변삼각형과 외각 | 그림 보강 검토<br>`diagram_upgrade` | AD=BD=BC 세 선분의 같은 눈금과 38도에서 미지각을 찾는다. | P1 |
| POL-090 | 인쇄 p.95 · **실전문제 2회 09**<br>오목 사각형의 각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-concave](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-concave) — 오목다각형의 내각과 작은 각 | 그림 보강 검토<br>`diagram_upgrade` | 오목 꼭짓점의 작은 140도와 다른 각으로 나머지 각을 구한다. | P1 |
| POL-091 | 인쇄 p.95 · **실전문제 2회 10**<br>별 내부 두 교각 차 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각 | 그림 보강 검토<br>`diagram_upgrade` | 별 내부의 교점 각과 꼭짓각을 외각 성질로 연결한다. | P1 |
| POL-092 | 인쇄 p.95 · **실전문제 2회 11**<br>대각선 수에서 내각 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-find](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-find) — 전체 대각선 수에서 변의 수 역산<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 풀이 보강 검토<br>`solution_upgrade` | 대각선 27개로 변의 수를 찾아 내각의 합을 계산한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-093 | 인쇄 p.95 · **실전문제 2회 12**<br>사각형 두 내각 이등분선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-bis](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-bis) — 삼각형의 내각·외각 이등분선 교각<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 사각형의 나머지 두 각에서 이등분된 두 각의 합과 교각을 구한다. | P1 |

#### mid · PDF 96쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-094 | 인쇄 p.96 · **실전문제 2회 13**<br>내각과 외각 전체의 합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 풀이 보강 검토<br>`solution_upgrade` | 각 꼭짓점에서 내각과 외각이 180도인 점을 이용해 변의 수를 구한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-095 | 인쇄 p.96 · **실전문제 2회 14**<br>복잡한 교차 도형 각 합 | 심화<br>실전문제 문항의 상 표시 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 안팎의 다각형과 교차점을 분리해 알려진 125도를 제외한다. | P0 |
| POL-096 | 인쇄 p.96 · **실전문제 2회 15**<br>오각형 대각선이 나눈 각 합 | 심화<br>실전문제 문항의 상 표시 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각 | 새 장면 검토<br>`new_scene` | 다각형의 모든 대각선이 분할한 열 각을 원래 내각의 합으로 묶는다. | P0 |
| POL-097 | 인쇄 p.96 · **실전문제 2회 16**<br>정십이각형 조건 통합 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-reg](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-reg) — 정다각형의 내각과 외각<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거<br>[g7-polygons#p1-one](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-one) — 한 꼭짓점 대각선과 삼각형 분할<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 풀이 보강 검토<br>`solution_upgrade` | 변 12개에서 외각·대각선·내각 합을 각각 대조한다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-098 | 인쇄 p.96 · **실전문제 2회 17**<br>정삼각형 안 같은 길이와 교각 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-iso](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-iso) — 연결된 이등변삼각형과 외각 | 새 장면 검토<br>`new_scene` | DB=EC 조건과 정삼각형을 이용해 두 삼각형의 각을 연결한다. | P0 |
| POL-099 | 인쇄 p.96 · **실전문제 2회 18**<br>정다각형 셋의 꼭짓점 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-join](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-join) — 한 변을 공유하는 정다각형 | 그림 보강 검토<br>`diagram_upgrade` | 정사각형·정오각형·정육각형이 만나는 한 점의 남는 각을 구한다. | P1 |

#### mid · PDF 97쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-100 | 인쇄 p.97 · **실전문제 2회 서술형 19**<br>맞꼭지각과 삼각형 서술 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p2-ext](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-ext) — 삼각형 내각과 외각의 관계 | 새 장면 검토<br>`new_scene` | 두 삼각형 교점의 맞꼭지각을 연결해 x+y를 서술한다. | P1 |
| POL-101 | 인쇄 p.97 · **실전문제 2회 서술형 20**<br>내부 한 점 분할과 대각선 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거<br>[g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합 | 새 장면 검토<br>`new_scene` | 내부 점에서 꼭짓점으로 이어 생긴 삼각형 12개와 변의 수를 대응한다. | P1 |
| POL-102 | 인쇄 p.97 · **실전문제 2회 서술형 21**<br>내외각 비에서 대각선 서술 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-ratio](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-ratio) — 내외각의 비에서 변의 수<br>[g7-polygons#p1-all](../../../apmath/playground/next/labs/g7-polygons.html#s=p1-all) — 전체 대각선과 중복 제거 | 풀이 보강 검토<br>`solution_upgrade` | 9 대 1에서 한 외각·정다각형 이름·대각선 수를 순서대로 쓴다. | P2<br>기존 장면은 정리·5지선다 방식; 같은 숫자의 문제와 풀이를 연결하는 최신 풀이 중심 형식 필요. 장면 코드 정적 대조이며 브라우저 검수 NOT_RUN. |
| POL-103 | 인쇄 p.97 · **실전문제 2회 서술형 22**<br>정오각형 정팔각형 연장 교점 | 표준<br>기출 Best 또는 학교 시험 수준 실전문제·서술형 섹션 | [g7-polygons#p4-join](../../../apmath/playground/next/labs/g7-polygons.html#s=p4-join) — 한 변을 공유하는 정다각형 | 그림 보강 검토<br>`diagram_upgrade` | 두 변의 연장 교점과 삼각형을 표시해 정다각형의 외각을 연결한다. | P1 |

#### mid · PDF 98쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| POL-104 | 인쇄 p.98 · **최다오답 예제**<br>칠각별 외곽 각의 합 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각<br>[g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 새 장면 검토<br>`new_scene` | 안쪽 칠각형 외각 두 벌을 일곱 삼각형 내각 합에서 빼는 발상을 나타낸다. | P0 |
| POL-105 | 인쇄 p.98 · **최다오답 유사문제 1**<br>삼각형과 사각형이 둘러싼 각 합 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p3-inO](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-inO) — 다각형의 내각 합<br>[g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 새 장면 검토<br>`new_scene` | 내부 오각형과 바깥 삼각형 셋·사각형 둘을 구별해 합한다. | P0 |
| POL-106 | 인쇄 p.98 · **최다오답 유사문제 2**<br>칠각별 주어진 각 제외 | 심화<br>교재 집중공략·최다오답 섹션 또는 실전문제의 상 표시 | [g7-polygons#p2-star](../../../apmath/playground/next/labs/g7-polygons.html#s=p2-star) — 별 모양 꼭짓각<br>[g7-polygons#p3-ext360](../../../apmath/playground/next/labs/g7-polygons.html#s=p3-ext360) — 다각형 외각의 합 | 새 장면 검토<br>`new_scene` | 칠각별 전체 꼭짓각의 합에서 주어진 60도와 80도를 뺀다. | P0 |

### 원과 부채꼴 · 74행

#### mid · PDF 102쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-001 | 인쇄 p.102 · **01**<br>원의 요소 | 표준<br>기출 Best | [g7-circle-sector#1101](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1101) — 현·호·활꼴·부채꼴 정의를 판단하는 동일 유형 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-002 | 인쇄 p.102 · **02**<br>중심각과 호의 길이 | 표준<br>기출 Best | [g7-circle-sector#1102](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1102) — 같은 원의 호와 중심각 비례 및 x+y | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-003 | 인쇄 p.102 · **03**<br>호의 비와 중심각 | 표준<br>기출 Best | [g7-circle-sector#1103](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1103) — 세 호의 비로 중심각을 구함 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-004 | 인쇄 p.102 · **04**<br>평행선과 호 | 표준<br>기출 Best | [g7-circle-sector#1104](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1104) — 평행한 현과 중심각을 이용한 호 길이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-005 | 인쇄 p.102 · **05**<br>반원과 평행선 | 표준<br>기출 Best | [g7-circle-sector#1105](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1105) — 반원 속 평행선과 보조선으로 호 길이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-006 | 인쇄 p.102 · **06**<br>중심각과 넓이 | 표준<br>기출 Best | [g7-circle-sector#1106](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1106) — 두 부채꼴의 중심각과 넓이 비 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |

#### mid · PDF 103쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-007 | 인쇄 p.103 · **07**<br>중심각에 비례하는 양 | 표준<br>기출 Best | [g7-circle-sector#1207](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1207) — 중심각과 호·현·넓이를 비교 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-008 | 인쇄 p.103 · **08**<br>반원들의 둘레와 넓이 | 표준<br>기출 Best | [g7-circle-sector#f4-swirl](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-swirl) — 원 안의 반원으로 구성한 곡선의 넓이 | 근거 추가 필요<br>`evidence_debt` | 해당 문항 조건과 기존 장면을 추가 대조 | P1 |
| CIR-009 | 인쇄 p.103 · **09**<br>부채꼴의 호와 넓이 | 표준<br>기출 Best | [g7-circle-sector#1209](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1209) — 반지름과 중심각에서 호와 넓이를 계산 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-010 | 인쇄 p.103 · **10**<br>부채꼴 넓이와 호 | 표준<br>기출 Best | [g7-circle-sector#1210](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1210) — 반지름과 넓이로 호를 구하는 관계 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-011 | 인쇄 p.103 · **11**<br>고리 부채꼴 | 표준<br>기출 Best | [g7-circle-sector#f1-ring](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ring) — 큰 부채꼴과 작은 부채꼴의 차 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-012 | 인쇄 p.103 · **12**<br>잎 모양 둘레 | 표준<br>기출 Best | [g7-circle-sector#f3-leaf-len](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-leaf-len) — 정사각형 안 두 사분원의 호로 둘레 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |

#### mid · PDF 104쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-013 | 인쇄 p.104 · **13**<br>사분원과 색칠 넓이 | 표준<br>기출 Best | [g7-circle-sector#f1-star](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-star) — 정사각형에서 네 사분원을 빼는 구성 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-014 | 인쇄 p.104 · **14**<br>반원의 회전 | 표준<br>기출 Best | [g7-circle-sector#rot](../../../apmath/playground/next/labs/g7-circle-sector.html#s=rot) — 한 점을 중심으로 반원을 회전한 색칠 영역 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-015 | 인쇄 p.104 · **15**<br>두 반원과 정사각형 | 표준<br>기출 Best | [g7-circle-sector#f4-sq12](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-sq12) — 정사각형 안의 두 반원을 옮겨 넓이를 봄 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-016 | 인쇄 p.104 · **16**<br>같은 넓이와 직사각형 | 표준<br>기출 Best | [g7-circle-sector#f3-rect-sector](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-rect-sector) — 직사각형과 부채꼴의 색칠 넓이가 같음 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-017 | 인쇄 p.104 · **17**<br>원을 감싼 끈 | 표준<br>기출 Best | [g7-circle-sector#f5-sq4](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f5-sq4) — 정사각형으로 배치한 같은 반지름의 네 원을 감싼 끈: 직선 8r와 곡선 2πr의 합. 원문 r=4에서 32+8π로 일치 | 정적 대응<br>`covered` | 기존 f5-sq4 장면에서 반지름 4의 끈 길이 풀이에 연결 | P1<br>mid PDF 104쪽 17번 원문과 f05.js의 f5-sq4를 정적으로 대조했다. 네 직선 길이 합 8r와 호의 중심각 합 360°에 따른 2πr가 원문 조건에 대응한다. 브라우저 검수 NOT_RUN. |
| CIR-018 | 인쇄 p.104 · **18**<br>회전하는 점의 거리 | 표준<br>기출 Best | — | 근거 추가 필요<br>`evidence_debt` | 해당 문항 조건과 기존 장면을 추가 대조 | P1 |

#### final · PDF 8쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-019 | 인쇄 p.8 · **01**<br>원의 요소 | 표준<br>기출 Best | [g7-circle-sector#1101](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1101) — 현·호·활꼴·부채꼴 정의를 판단하는 동일 유형 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-020 | 인쇄 p.8 · **02**<br>중심각과 호의 길이 | 표준<br>기출 Best | [g7-circle-sector#1102](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1102) — 같은 원의 호와 중심각 비례 및 x+y | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-021 | 인쇄 p.8 · **03**<br>호의 비와 중심각 | 표준<br>기출 Best | [g7-circle-sector#1103](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1103) — 세 호의 비로 중심각을 구함 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-022 | 인쇄 p.8 · **04**<br>평행선과 호 | 표준<br>기출 Best | [g7-circle-sector#1104](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1104) — 평행한 현과 중심각을 이용한 호 길이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-023 | 인쇄 p.8 · **05**<br>반원과 평행선 | 표준<br>기출 Best | [g7-circle-sector#1105](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1105) — 반원 속 평행선과 보조선으로 호 길이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-024 | 인쇄 p.8 · **06**<br>중심각과 넓이 | 표준<br>기출 Best | [g7-circle-sector#1106](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1106) — 두 부채꼴의 중심각과 넓이 비 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |

#### final · PDF 9쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-025 | 인쇄 p.9 · **07**<br>중심각에 비례하는 양 | 표준<br>기출 Best | [g7-circle-sector#1207](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1207) — 중심각과 호·현·넓이를 비교 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-026 | 인쇄 p.9 · **08**<br>반원들의 둘레와 넓이 | 표준<br>기출 Best | [g7-circle-sector#f4-swirl](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-swirl) — 원 안의 반원으로 구성한 곡선의 넓이 | 근거 추가 필요<br>`evidence_debt` | 해당 문항 조건과 기존 장면을 추가 대조 | P1 |
| CIR-027 | 인쇄 p.9 · **09**<br>부채꼴의 호와 넓이 | 표준<br>기출 Best | [g7-circle-sector#1209](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1209) — 반지름과 중심각에서 호와 넓이를 계산 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-028 | 인쇄 p.9 · **10**<br>부채꼴 넓이와 호 | 표준<br>기출 Best | [g7-circle-sector#1210](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1210) — 반지름과 넓이로 호를 구하는 관계 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-029 | 인쇄 p.9 · **11**<br>고리 부채꼴 | 표준<br>기출 Best | [g7-circle-sector#f1-ring](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ring) — 큰 부채꼴과 작은 부채꼴의 차 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-030 | 인쇄 p.9 · **12**<br>잎 모양 둘레 | 표준<br>기출 Best | [g7-circle-sector#f3-leaf-len](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-leaf-len) — 정사각형 안 두 사분원의 호로 둘레 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |

#### final · PDF 10쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-031 | 인쇄 p.10 · **13**<br>사분원과 색칠 넓이 | 표준<br>기출 Best | [g7-circle-sector#f1-star](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-star) — 정사각형에서 네 사분원을 빼는 구성 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-032 | 인쇄 p.10 · **14**<br>반원의 회전 | 표준<br>기출 Best | [g7-circle-sector#rot](../../../apmath/playground/next/labs/g7-circle-sector.html#s=rot) — 한 점을 중심으로 반원을 회전한 색칠 영역 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-033 | 인쇄 p.10 · **15**<br>두 반원과 정사각형 | 표준<br>기출 Best | [g7-circle-sector#f4-sq12](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-sq12) — 정사각형 안의 두 반원을 옮겨 넓이를 봄 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-034 | 인쇄 p.10 · **16**<br>같은 넓이와 직사각형 | 표준<br>기출 Best | [g7-circle-sector#f3-rect-sector](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-rect-sector) — 직사각형과 부채꼴의 색칠 넓이가 같음 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-035 | 인쇄 p.10 · **17**<br>원을 감싼 끈 | 표준<br>기출 Best | — | 근거 추가 필요<br>`evidence_debt` | 해당 문항 조건과 기존 장면을 추가 대조 | P1 |
| CIR-036 | 인쇄 p.10 · **18**<br>회전하는 점의 거리 | 표준<br>기출 Best | — | 근거 추가 필요<br>`evidence_debt` | 해당 문항 조건과 기존 장면을 추가 대조 | P1 |

#### final · PDF 11쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-037 | 인쇄 p.11 · **01**<br>원의 요소 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1101](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1101) — 그림의 반지름·현·호와 부채꼴 판단 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-038 | 인쇄 p.11 · **02**<br>중심각과 호 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1102](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1102) — 중심각과 호의 비례로 x+y | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-039 | 인쇄 p.11 · **03**<br>호의 비 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1103](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1103) — 세 호의 비에서 중심각 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-040 | 인쇄 p.11 · **04**<br>평행한 현 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1104](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1104) — 평행한 현과 호의 길이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-041 | 인쇄 p.11 · **05**<br>반원의 보조선 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1105](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1105) — 반원에 보조선을 그려 호의 비 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-042 | 인쇄 p.11 · **06**<br>중심각과 부채꼴의 넓이 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1106](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1106) — 두 중심각과 두 넓이의 비 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |

#### final · PDF 12쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-043 | 인쇄 p.12 · **07**<br>중심각의 비례 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1207](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1207) — 중심각과 호·부채꼴 넓이의 비 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-044 | 인쇄 p.12 · **08**<br>반원 합차 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#f4-swirl](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-swirl) — 반원으로 이뤄진 색칠 부분의 넓이 | 근거 추가 필요<br>`evidence_debt` | 문항의 구체 도형·조건과 기존 장면의 풀이 일치 여부 확인 | P1<br>원문은 큰 원의 지름 14, 두 작은 반원의 지름 10과 4인 비대칭 구성으로 둘레 14π, 넓이 (π/2)(7²+5²−2²)=35π이다. f4-swirl은 두 작은 반원의 크기가 같은 구성이어서 정확히 대응하지 않는다. f02.js의 sj1/y11은 개념 후보일 뿐 직접 대응 근거가 아니며 evidence_debt를 유지한다. 브라우저 검수 NOT_RUN. |
| CIR-045 | 인쇄 p.12 · **09**<br>호에서 중심각 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1209](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1209) — 반지름·호와 중심각의 관계 | 근거 추가 필요<br>`evidence_debt` | 주어진 반지름과 호의 길이에서 중심각을 역산하는 풀이의 대응 여부를 추가 확인 | P1<br>1209는 반지름 r와 중심각 θ로 호의 길이 l을 구하는 정방향을 다룬다. 원문 final PDF 12쪽 09번은 주어진 l에서 θ를 역산하며, 이에 직접 대응하는 역산 풀이가 1209에 없어 evidence_debt로 남긴다. 브라우저 검수 NOT_RUN. |
| CIR-046 | 인쇄 p.12 · **10**<br>호·넓이에서 반지름 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#1210](../../../apmath/playground/next/labs/g7-circle-sector.html#s=1210) — 넓이 ÷ 호의 길이 = 반지름 ÷ 2 관계를 역으로 이용 | 풀이 보강 검토<br>`solution_upgrade` | 넓이와 호에서 반지름을 구하는 역방향 풀이 보강 | P1 |
| CIR-047 | 인쇄 p.12 · **11**<br>고리 넓이 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#f1-ring](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ring) — 두 부채꼴 넓이의 차 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-048 | 인쇄 p.12 · **12**<br>사분원과 반원 둘레 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#f1-ss2](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ss2) — 사분원과 반원의 호를 경계로 사용 | 근거 추가 필요<br>`evidence_debt` | 문항의 구체 도형·조건과 기존 장면의 풀이 일치 여부 확인 | P1 |

#### final · PDF 13쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-049 | 인쇄 p.13 · **13**<br>잎 모양 넓이 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#f3-leaf-area](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-leaf-area) — 두 사분원의 공통 부분 넓이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-050 | 인쇄 p.13 · **14**<br>회전한 반원 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#rot](../../../apmath/playground/next/labs/g7-circle-sector.html#s=rot) — 반원 회전으로 생긴 색칠 넓이 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-051 | 인쇄 p.13 · **15**<br>반원과 부채꼴 넓이 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#f1-ss2](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ss2) — 반원과 부채꼴이 겹치는 면적 | 근거 추가 필요<br>`evidence_debt` | 문항의 구체 도형·조건과 기존 장면의 풀이 일치 여부 확인 | P1 |
| CIR-052 | 인쇄 p.13 · **16**<br>직사각형과 부채꼴 | 표준<br>기출 Best 쌍둥이 | [g7-circle-sector#f3-rect-sector](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-rect-sector) — 색칠한 두 영역의 넓이가 같은 조건 | 정적 대응<br>`covered` | 기존 장면의 탐구·풀이에 연결 | P2 |
| CIR-053 | 인쇄 p.13 · **17**<br>원을 감싼 끈 | 표준<br>기출 Best 쌍둥이 | — | 근거 추가 필요<br>`evidence_debt` | 문항의 구체 도형·조건과 기존 장면의 풀이 일치 여부 확인 | P1 |
| CIR-054 | 인쇄 p.13 · **18**<br>회전하는 점 | 표준<br>기출 Best 쌍둥이 | — | 근거 추가 필요<br>`evidence_debt` | 문항의 구체 도형·조건과 기존 장면의 풀이 일치 여부 확인 | P1 |

#### final · PDF 16쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-055 | 인쇄 p.16 · **1**<br>반원 합차 서술 | 표준<br>서술형문제 | [g7-circle-sector#f4-swirl](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-swirl) — 반원 합차로 색칠 영역을 구하는 접근 | 근거 추가 필요<br>`evidence_debt` | 서술 과정과 둘레·넓이 각각의 대응 확인 | P1 |
| CIR-056 | 인쇄 p.16 · **1-1**<br>반원 합차 서술 | 표준<br>서술형문제 | [g7-circle-sector#f4-swirl](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f4-swirl) — 반원들의 둘레와 넓이 합차 | 근거 추가 필요<br>`evidence_debt` | 서술 과정과 둘레·넓이 각각의 대응 확인 | P1 |
| CIR-057 | 인쇄 p.16 · **1-2**<br>큰 반원에서 작은 반원 둘 | 표준<br>서술형문제 | [g7-circle-sector#f1-semis](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-semis) — 큰 반원에서 작은 반원 둘을 빼는 구조 | 정적 대응<br>`covered` | 기존 그림과 서술 풀이 연결 | P2 |

#### final · PDF 17쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-058 | 인쇄 p.17 · **2**<br>부채꼴에서 반원 빼기 | 표준<br>서술형문제 | [g7-circle-sector#f1-ss2](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ss2) — 변 6인 사분원에서 반원을 빼는 같은 도형 | 정적 대응<br>`covered` | 기존 그림과 서술 풀이 연결 | P2 |
| CIR-059 | 인쇄 p.17 · **2-1**<br>잎 모양 바깥 넓이 | 표준<br>서술형문제 | [g7-circle-sector#f1-lens](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-lens) — 정사각형에서 잎 모양을 빼는 구성 | 정적 대응<br>`covered` | 기존 그림과 서술 풀이 연결 | P2 |
| CIR-060 | 인쇄 p.17 · **2-2**<br>사분원과 반원 사이 | 표준<br>서술형문제 | [g7-circle-sector#f1-ex22](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f1-ex22) — 정사각형 안 사분원과 반원 사이 색칠 | 정적 대응<br>`covered` | 기존 그림과 서술 풀이 연결 | P2 |

#### final · PDF 176쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-061 | 인쇄 p.176 · **01**<br>시계 숫자와 각 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-062 | 인쇄 p.176 · **02**<br>이등변삼각형과 호 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-063 | 인쇄 p.176 · **03**<br>육상 트랙 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-064 | 인쇄 p.176 · **04**<br>두 부채꼴의 면적 차 | 심화<br>고난도 기출문제 | [g7-circle-sector#f3-leaf-area](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-leaf-area) — 겹친 두 사분원의 공통 영역과 색칠 영역 | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |

#### final · PDF 177쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-065 | 인쇄 p.177 · **05**<br>직사각형과 부채꼴 면적 | 심화<br>고난도 기출문제 | [g7-circle-sector#f3-rect-sector](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-rect-sector) — 사분원과 직사각형 영역의 넓이 조건 | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-066 | 인쇄 p.177 · **06**<br>원 굴리기 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-067 | 인쇄 p.177 · **07**<br>육각형 울타리와 끈 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |

#### mid · PDF 180쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-068 | 인쇄 p.180 · **27**<br>시계 숫자와 각 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-069 | 인쇄 p.180 · **28**<br>사분원 네 개의 공통 영역 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-070 | 인쇄 p.180 · **29**<br>대각선과 네 잎 넓이 | 심화<br>고난도 기출문제 | [g7-circle-sector#f3-four-leaf](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-four-leaf) — 정사각형 안 네 잎 모양 | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |

#### mid · PDF 181쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| CIR-071 | 인쇄 p.181 · **30**<br>두 부채꼴의 넓이 차 | 심화<br>고난도 기출문제 | [g7-circle-sector#f3-leaf-area](../../../apmath/playground/next/labs/g7-circle-sector.html#s=f3-leaf-area) — 사분원 두 개와 세 색칠 영역의 면적 관계 | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-072 | 인쇄 p.181 · **31**<br>직각삼각형 회전 넓이 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-073 | 인쇄 p.181 · **32**<br>반원 접기 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |
| CIR-074 | 인쇄 p.181 · **33**<br>부채꼴 둘레의 원 굴리기 | 심화<br>고난도 기출문제 | — | 근거 추가 필요<br>`evidence_debt` | 정확한 도형·풀이 대응을 확인한 뒤 장면 보강 여부 결정 | P1 |

### 입체도형 · 75행

#### final · PDF 30쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-001 | 인쇄 p.30 · **기출 Best 01**<br>다면체와 평면도형·곡면체 판별 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-0](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-0) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 평면도형도 다면체가 아님을 함께 판정하는 풀이 추가 | P2<br>삼각형과 원뿔을 함께 제외하는 문항 |
| SOL-002 | 인쇄 p.30 · **기출 Best 02**<br>칠면체를 면의 개수로 찾기 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 각기둥·각뿔·각뿔대 후보의 면 수를 한 표에서 비교 | P1<br>여러 종류를 동시에 비교 |
| SOL-003 | 인쇄 p.30 · **기출 Best 03**<br>서로 다른 입체의 면·모서리·꼭짓점 계산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-1](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p1-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 세 입체의 값을 구해 식에 대입하는 단계 제공 | P1<br>a−b+c 결합 |
| SOL-004 | 인쇄 p.30 · **기출 Best 04**<br>꼭짓점 수로 각기둥 역산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-1](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 2n=12에서 n과 면·모서리 합을 순서대로 설명 | P1<br>역산 후 두 값을 합산 |
| SOL-005 | 인쇄 p.30 · **기출 Best 05**<br>각기둥·각뿔·각뿔대 옆면 판별 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 옆면 모양 비교 장면 연결 | P2<br>종류에 따른 옆면 비교 |
| SOL-006 | 인쇄 p.30 · **기출 Best 06**<br>각뿔대 두 밑면의 평행과 합동 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-6](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 각뿔대 판별 장면 연결 | P2<br>두 밑면이 평행하지만 합동이 아님 |

#### final · PDF 31쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-007 | 인쇄 p.31 · **기출 Best 07**<br>모서리와 밑면 조건으로 각뿔 식별 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 옆면 삼각형으로 각뿔을 찾고 2n=12를 역산 | P1<br>조건 결합 |
| SOL-008 | 인쇄 p.31 · **기출 Best 08**<br>정다면체의 조건과 다섯 종류 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-1](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p2-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 정다면체 조건 및 표 연결 | P2<br>모든 면의 합동만으로는 정의가 부족함 |
| SOL-009 | 인쇄 p.31 · **기출 Best 09**<br>정팔면체 모서리와 정육면체 꼭짓점 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 두 정다면체 값을 따로 선택해 더하는 풀이 제공 | P2<br>서로 다른 정다면체 결합 |
| SOL-010 | 인쇄 p.31 · **기출 Best 10**<br>정삼각형 면과 꼭짓점에 모인 면으로 결정 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 면 모양과 한 꼭짓점에 모인 면 수 비교 | P2<br>정사면체 식별 |
| SOL-011 | 인쇄 p.31 · **기출 Best 11**<br>정육면체 전개도 겹치는 꼭짓점 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p3-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p3-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 접기 단계로 같은 점을 추적 | P1<br>기출 Best 전개도 |
| SOL-012 | 인쇄 p.31 · **기출 Best 12**<br>정육면체 단면으로 불가능한 도형 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p4-1](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 가능한 단면과 불가능한 직각삼각형을 비교하고 이유 제시 | P1<br>단면 전체를 고려 |

#### final · PDF 32쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-013 | 인쇄 p.32 · **기출 Best 13**<br>복합·구멍 있는 회전체 판별 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-7](../../../apmath/playground/next/labs/g7-solids.html#s=s1-7) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 구멍과 복합 곡면 입체도 회전으로 생성되는지 판별 | P1<br>기본 장면 선택지는 원기둥·원뿔·구·원뿔대와 다면체 |
| SOL-014 | 인쇄 p.32 · **기출 Best 14**<br>겨냥도에서 회전 전 복합 도형 찾기 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-6](../../../apmath/playground/next/labs/g7-solids.html#s=s1-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 원기둥과 원뿔대가 결합된 형상 및 후보 대조 추가 | P1<br>원기둥+원뿔대, 기존 pencil은 원기둥+원뿔; 코드 주의: s1-6은 축 양쪽 대칭 도형을 틀렸다고 단정하지만 양쪽 대칭 도형도 같은 회전체를 만들 수 있어 원래 도형의 유일성 주장 재검토 필요. |
| SOL-015 | 인쇄 p.32 · **기출 Best 15**<br>축을 포함하는 단면의 모양 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-2](../../../apmath/playground/next/labs/g7-solids.html#s=s2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 입체별 단면을 축과 함께 비교 | P2<br>반구·원뿔대 포함 |
| SOL-016 | 인쇄 p.32 · **기출 Best 16**<br>원뿔의 축 포함 최대 단면 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-3](../../../apmath/playground/next/labs/g7-solids.html#s=s2-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 지름과 높이를 읽고 최대 삼각형 넓이를 설명 | P1<br>밑면에 수직인 절단 중 최대임을 비교 |
| SOL-017 | 인쇄 p.32 · **기출 Best 17**<br>원뿔 전개도 호와 밑면 둘레 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s3-2](../../../apmath/playground/next/labs/g7-solids.html#s=s3-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 밑면 둘레와 호 길이의 대응 강조 | P2<br>모선 길이는 호 계산에 불필요 |
| SOL-018 | 인쇄 p.32 · **기출 Best 18**<br>수직·축 포함 단면의 성질 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-2](../../../apmath/playground/next/labs/g7-solids.html#s=s2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-5](../../../apmath/playground/next/labs/g7-solids.html#s=s2-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 단면의 합동 여부와 선대칭을 함께 판정 | P2<br>절단 방향별 차이 |

#### final · PDF 33쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-019 | 인쇄 p.33 · **기출 Best 쌍둥이 01**<br>그림으로 다면체 판별 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-0](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-0) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 평면 사각형과 회전체를 제외하는 그림 선택 추가 | P2<br>기출 Best 01의 쌍둥이지만 그림 제시 |
| SOL-020 | 인쇄 p.33 · **기출 Best 쌍둥이 02**<br>다면체별 면 수 비교 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 다섯 입체의 면 수를 나란히 비교 | P2<br>최대값 선택 |
| SOL-021 | 인쇄 p.33 · **기출 Best 쌍둥이 03**<br>서로 다른 입체 요소 합 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-1](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p1-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 각 입체의 계산을 합산하는 설명 추가 | P2<br>기출 Best 03과 숫자·대상 구별 |
| SOL-022 | 인쇄 p.33 · **기출 Best 쌍둥이 04**<br>모서리 수로 각뿔대 역산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 3n=30에서 n을 구하고 면과 꼭짓점을 계산 | P1<br>각기둥 역산과 다른 뿔대 |
| SOL-023 | 인쇄 p.33 · **기출 Best 쌍둥이 05**<br>옆면이 사각형이 아닌 다면체 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 기둥·뿔·뿔대의 옆면 비교 | P2<br>삼각형 옆면 선택 |
| SOL-024 | 인쇄 p.33 · **기출 Best 쌍둥이 06**<br>오각뿔대의 요소와 옆면 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p1-6](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 각뿔과 각기둥과의 면·꼭짓점 차이 비교 | P2<br>오각뿔대 구체 적용 |

#### final · PDF 34쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-025 | 인쇄 p.34 · **기출 Best 쌍둥이 07**<br>십면체와 밑면·옆면 조건 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 면의 수 n+2와 옆면 형태를 결합해 역산 | P1<br>면 수와 형태 동시 조건 |
| SOL-026 | 인쇄 p.34 · **기출 Best 쌍둥이 08**<br>정다면체에 모인 면의 수 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p2-6](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 면 모양과 한 꼭짓점에 모인 면 수 비교 | P2<br>최대 5개 |
| SOL-027 | 인쇄 p.34 · **기출 Best 쌍둥이 09**<br>정십이면체 요소 산술 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 한 꼭짓점에 모인 면·면·꼭짓점 수를 대입 | P2<br>a−b+c 계산 |
| SOL-028 | 인쇄 p.34 · **기출 Best 쌍둥이 10**<br>정삼각형 면과 모서리 수로 정다면체 찾기 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 면과 모서리 두 조건을 동시에 걸러 정팔면체 판별 | P2<br>모서리 12개 조건 |
| SOL-029 | 인쇄 p.34 · **기출 Best 쌍둥이 11**<br>정사면체 전개도와 꼬인 모서리 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p3-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p3-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p3-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p3-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 전개도를 접고 지정 모서리와 꼬인 모서리 연결 추적 | P1<br>전개도와 꼬인 위치 결합 |
| SOL-030 | 인쇄 p.34 · **기출 Best 쌍둥이 12**<br>세 꼭짓점을 지나는 정육면체 단면 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p4-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 세 점을 지나 평면을 확장하여 단면 찾기 | P1<br>기출 표시 꼭짓점은 장면 이름과 다를 수 있음 |

#### final · PDF 35쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-031 | 인쇄 p.35 · **기출 Best 쌍둥이 13**<br>회전체가 아닌 입체 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-7](../../../apmath/playground/next/labs/g7-solids.html#s=s1-7) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 회전으로 만드는 입체와 다면체 비교 | P2<br>육각뿔 제외 |
| SOL-032 | 인쇄 p.35 · **기출 Best 쌍둥이 14**<br>복합 평면도형을 축에 돌린 입체 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s1-6](../../../apmath/playground/next/labs/g7-solids.html#s=s1-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 반원+삼각형·떨어진 삼각형 등 회전체 단면 추적 | P1<br>기존은 직사각형·직각삼각형과 제한된 복합형 |
| SOL-033 | 인쇄 p.35 · **기출 Best 쌍둥이 15**<br>축에 수직인 단면이 모두 합동 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 높이에 따른 원기둥과 원뿔의 반지름 비교 | P2<br>원기둥 판별 |
| SOL-034 | 인쇄 p.35 · **기출 Best 쌍둥이 16**<br>사다리꼴 회전의 축 포함 단면 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-3](../../../apmath/playground/next/labs/g7-solids.html#s=s2-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 단면 사다리꼴의 두 밑변이 원래 길이의 두 배임을 표시 | P1<br>반지름 2·4 높이 3 |
| SOL-035 | 인쇄 p.35 · **기출 Best 쌍둥이 17**<br>원기둥 전개도 둘레에서 반지름 역산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s3-1](../../../apmath/playground/next/labs/g7-solids.html#s=s3-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 직사각형 가로 12π=2πr에서 r을 역산 | P2<br>직접 계산 방향과 역방향 구별 |
| SOL-036 | 인쇄 p.35 · **기출 Best 쌍둥이 18**<br>축에 따른 회전체와 단면 설명 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-2](../../../apmath/playground/next/labs/g7-solids.html#s=s2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 직각삼각형 빗변 회전의 두 원뿔을 비교 | P1<br>각 변을 축으로 돌리면 항상 원뿔이라는 오개념 |

#### final · PDF 36쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-037 | 인쇄 p.36 · **집중공략 1-1**<br>정다면체 각 면의 중심을 이어 만든 다면체 | 심화<br>교재 집중공략 또는 최다오답 | [g7-polyhedra#p2-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p4-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 다섯 정다면체의 대응 쌍을 표와 그림으로 판별 | P1<br>정십이면체↔정이십면체도 필요 |
| SOL-038 | 인쇄 p.36 · **집중공략 1-2**<br>정십이면체 면 중심 연결 후 모서리 수 | 심화<br>교재 집중공략 또는 최다오답 | [g7-polyhedra#p2-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p4-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 면 중심 개수로 새 꼭짓점을 구하고 모서리까지 연결 | P1<br>쌍대 입체의 두 단계 역추론 |

#### final · PDF 37쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-039 | 인쇄 p.37 · **집중공략 2-1**<br>사다리꼴에서 원뿔대를 만드는 회전축 | 심화<br>교재 집중공략 또는 최다오답 | [g7-solids#s1-3](../../../apmath/playground/next/labs/g7-solids.html#s=s1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 사다리꼴의 각 변과 대각선을 회전축으로 비교 | P1<br>단일 축 장면에서 축 후보 비교로 확장 |
| SOL-040 | 인쇄 p.37 · **집중공략 2-2**<br>직사각형 대각선을 축으로 회전 | 심화<br>교재 집중공략 또는 최다오답 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 대각선 양쪽 삼각형의 자취를 합쳐 겨냥도 제작 | P1<br>두 뿔을 단순히 더한 형태와 내부 중복을 구별 |

#### final · PDF 38쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-041 | 인쇄 p.38 · **서술유형 1-1**<br>각뿔 꼭짓점 수에서 면·모서리 역산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | n+1에서 n을 먼저 구하고 b−a 서술 | P1<br>과정 서술형 |
| SOL-042 | 인쇄 p.38 · **서술유형 1-2**<br>각뿔대 모서리와 꼭짓점의 합으로 역산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 3n+2n=40에서 밑면과 면 수를 구하는 단계 | P1<br>두 종류의 합으로 역산 |

#### final · PDF 39쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-043 | 인쇄 p.39 · **서술유형 2-1**<br>원뿔대 축 포함 단면 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-3](../../../apmath/playground/next/labs/g7-solids.html#s=s2-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 두 지름과 높이로 사다리꼴 넓이 설명 | P2<br>윗반지름 3 아랫반지름 5 높이 6 |
| SOL-044 | 인쇄 p.39 · **서술유형 2-2**<br>빗변 회전 시 최대 원형 단면 반지름 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 삼각형 넓이의 두 표현으로 빗변에 내린 높이를 구함 | P1<br>6·8·10을 이용하는 중1 넓이 풀이 |

#### final · PDF 40쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-045 | 인쇄 p.40 · **실전문제 1회 04**<br>면과 꼭짓점의 차로 각기둥 역산 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-1](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 2n−(n+2)=12를 해석해 모서리 구하기 | P1<br>절댓값의 가능한 부호와 n≥3 고려 |
| SOL-046 | 인쇄 p.40 · **실전문제 1회 06**<br>구면체·평행 밑면·사다리꼴 옆면 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p1-6](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 형태를 먼저 결정하고 면 n+2=9를 역산 | P1<br>조건과 계산 결합 |

#### final · PDF 41쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-047 | 인쇄 p.41 · **실전문제 1회 09**<br>정십이면체 전개도와 마주 보는 면 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p3-6](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p3-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 정십이면체 전개도 접기와 면의 대응 판정 추가 | P1<br>현재 p3-6의 qspecs는 정팔면체 중심 |
| SOL-048 | 인쇄 p.41 · **실전문제 1회 10**<br>정이십면체 면 중심 연결 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-5](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p4-4](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 정이십면체에서 정십이면체로의 변환 시각화 | P1<br>쌍대 입체의 역방향 |
| SOL-049 | 인쇄 p.41 · **실전문제 1회 12**<br>축에서 떨어진 삼각형의 회전체 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 축과 떨어진 직각삼각형이 만드는 빈 원뿔대 형태 묘사 | P1<br>기존 이격은 직사각형 |

#### final · PDF 42쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-050 | 인쇄 p.42 · **실전문제 1회 14**<br>원뿔대의 여러 절단 방향 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-2](../../../apmath/playground/next/labs/g7-solids.html#s=s2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 비스듬한 절단까지 비교하는 조절 가능한 단면 추가 | P1<br>수직과 축 포함만으로 보기 판정 불충분 |
| SOL-051 | 인쇄 p.42 · **실전문제 1회 15**<br>축에서 떨어진 직사각형의 고리 단면 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 바깥 원에서 안쪽 원을 빼는 고리 넓이 단계 제공 | P1<br>반지름 6과 2의 차이 |
| SOL-052 | 인쇄 p.42 · **실전문제 1회 16**<br>원뿔대 전개도의 둘레 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s3-5](../../../apmath/playground/next/labs/g7-solids.html#s=s3-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 큰 호·작은 호와 양쪽 모선의 길이를 더함 | P1<br>옆넓이와 둘레는 다른 질문 |

#### final · PDF 43쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-053 | 인쇄 p.43 · **실전문제 1회 18**<br>면의 수에서 각뿔대 모서리·꼭짓점 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | n+2=18 역산 후 3n−2n 서술 | P1<br>서술형 |
| SOL-054 | 인쇄 p.43 · **실전문제 1회 20**<br>두 단면에서 원기둥 반지름과 높이 역추론 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-4](../../../apmath/playground/next/labs/g7-solids.html#s=s2-4) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 수직 단면과 축 포함 직사각형의 지름·높이 연결 | P1<br>직사각형 가로는 지름 |
| SOL-055 | 인쇄 p.43 · **실전문제 1회 21**<br>원뿔 모선·반지름에서 전개도 호와 중심각 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s3-2](../../../apmath/playground/next/labs/g7-solids.html#s=s3-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s3-3](../../../apmath/playground/next/labs/g7-solids.html#s=s3-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 호=밑면 둘레 다음 중심각을 구하는 풀이 연결 | P2<br>모선 12 반지름 5 |

#### final · PDF 44쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-056 | 인쇄 p.44 · **실전문제 2회 02**<br>잘린 정육면체와 오일러 공식 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-7](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-7) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-polyhedra#p4-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 그림의 꼭짓점·모서리·면을 세고 V−E+F 확인 | P1<br>모든 꼭짓점을 자른 p4-2와 그림은 서로 다름 |
| SOL-057 | 인쇄 p.44 · **실전문제 2회 03**<br>각뿔대 꼭짓점 수에서 밑면 결정 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 2n=18에서 n각형을 구하는 역산 | P2<br>밑면 이름 묻기 |

#### final · PDF 45쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-058 | 인쇄 p.45 · **실전문제 2회 09**<br>정팔면체 전개도에서 겹치는 모서리 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p3-6](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p3-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 선택한 두 모서리가 접혀 만나는 과정 표시 | P1<br>정팔면체 전개도 |
| SOL-059 | 인쇄 p.45 · **실전문제 2회 10**<br>세 꼭짓점을 지나는 단면의 각 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p4-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 각 면의 대각선이 같은 길이임을 보여 단면 각 도출 | P1<br>모양 판별에서 각 계산으로 확장 |
| SOL-060 | 인쇄 p.45 · **실전문제 2회 11**<br>속이 빈 원뿔대 겨냥도에서 원래 도형 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-6](../../../apmath/playground/next/labs/g7-solids.html#s=s1-6) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 속이 빈 입체의 축 포함 단면에서 원래 도형 후보 비교 | P1<br>기존 역추론 네 종류에는 구멍 있는 원뿔대 없음 |
| SOL-061 | 인쇄 p.45 · **실전문제 2회 12**<br>사다리꼴의 회전축 선택 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-3](../../../apmath/playground/next/labs/g7-solids.html#s=s1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 각 변과 대각선의 회전 결과를 비교 | P1<br>37쪽 집중공략 2-1과 도형 배치 다름 |

#### final · PDF 46쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-062 | 인쇄 p.46 · **실전문제 2회 14**<br>복합 회전체의 축 포함 단면 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s2-3](../../../apmath/playground/next/labs/g7-solids.html#s=s2-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 직사각형과 사다리꼴의 단면 넓이를 합산 | P1<br>원래 평면도형 넓이의 두 배 |
| SOL-063 | 인쇄 p.46 · **실전문제 2회 15**<br>부채꼴 전개도에서 밑면 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s3-2](../../../apmath/playground/next/labs/g7-solids.html#s=s3-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s3-3](../../../apmath/playground/next/labs/g7-solids.html#s=s3-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 중심각과 모선에서 밑면 반지름을 역산한 뒤 제곱 | P1<br>호 길이 동등 관계를 역이용 |
| SOL-064 | 인쇄 p.46 · **실전문제 2회 17**<br>원뿔 한 바퀴 최단 경로 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s4-1](../../../apmath/playground/next/labs/g7-solids.html#s=s4-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 원뿔 옆면을 펼쳐 두 A 사이 직선을 확인 | P2<br>핸드오프에서 최단거리 심화 표시 |

#### final · PDF 47쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-065 | 인쇄 p.47 · **실전문제 2회 19**<br>꼭짓점 수와 형태 조건으로 각뿔 결정 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p1-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 밑면 1개와 삼각형 옆면으로 각뿔 식별 후 n+1=12 | P1<br>면과 모서리 합까지 서술 |
| SOL-066 | 인쇄 p.47 · **실전문제 2회 20**<br>정삼각형 면으로 이뤄진 비정다면체 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-polyhedra#p2-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p2-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 정적 대응<br>`covered` | 서로 다른 꼭짓점에 모이는 면 수를 비교 | P1<br>합동인 면만으로 정다면체가 되지 않음 |
| SOL-067 | 인쇄 p.47 · **실전문제 2회 21**<br>빗변 회전 최대 단면의 넓이 | 표준<br>기출 Best 또는 실전·서술형 문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 삼각형 넓이를 이용해 빗변에 내린 높이와 원의 넓이 계산 | P1<br>15·20·25, 중1의 삼각형 넓이 사용 |

#### final · PDF 48쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-068 | 인쇄 p.48 · **최다오답 유사문제 1**<br>복합 평면도형 회전의 축 포함 단면 넓이 | 심화<br>교재 집중공략 또는 최다오답 | [g7-solids#s2-3](../../../apmath/playground/next/labs/g7-solids.html#s=s2-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 복합 도형을 직사각형과 사다리꼴로 나눠 두 배 | P1<br>겨냥도보다 단면을 먼저 그리는 발상 |
| SOL-069 | 인쇄 p.48 · **최다오답 유사문제 2**<br>부채꼴에서 삼각형을 뺀 도형의 회전 단면 | 심화<br>교재 집중공략 또는 최다오답 | [g7-solids#s2-2](../../../apmath/playground/next/labs/g7-solids.html#s=s2-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 반원에서 두 삼각형을 빼는 단면 풀이 | P1<br>원호와 직선이 섞인 비정형 단면 |

#### final · PDF 177쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-070 | 인쇄 p.177 · **고난도 기출문제 08**<br>각뿔대 면·꼭짓점·모서리 합 역산 | 심화<br>부록 고난도 기출문제 | [g7-polyhedra#p1-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p1-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | n+2+2n+3n=56을 세워 n 역산 | P1<br>부록 고난도 문항 |

#### final · PDF 178쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-071 | 인쇄 p.178 · **고난도 기출문제 09**<br>정육면체 꼭짓점 절단 후 요소 계산 | 심화<br>부록 고난도 기출문제 | [g7-polyhedra#p4-2](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 절단 후 F,V,E를 각각 구하고 a−b+c 결합 | P1<br>각 모서리 삼등분점에서 모두 절단 |
| SOL-072 | 인쇄 p.178 · **고난도 기출문제 10**<br>정팔면체 겉면 최단거리 | 심화<br>부록 고난도 기출문제 | [g7-polyhedra#p3-7](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p3-7) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 정팔면체의 지정된 여러 면을 펼쳐 최단 경로 설명 | P2<br>현재 p3-7은 정육면체 중심, 심화 |
| SOL-073 | 인쇄 p.178 · **고난도 기출문제 11**<br>정육면체 꼭짓점으로 만드는 정삼각형 개수 | 심화<br>부록 고난도 기출문제 | [g7-polyhedra#p4-3](../../../apmath/playground/next/labs/g7-polyhedra.html#s=p4-3) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 정육면체의 선택된 세 점과 면 대각선들을 체계적으로 세기 | P2<br>기존 단면 모양 판별과 다른 조합 세기 |
| SOL-074 **공유** | 인쇄 p.178 · **고난도 기출문제 12**<br>축과 떨어진 원의 회전과 고리 단면 | 심화<br>부록 고난도 기출문제 | [g7-solids#s1-5](../../../apmath/playground/next/labs/g7-solids.html#s=s1-5) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s2-1](../../../apmath/playground/next/labs/g7-solids.html#s=s2-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 새 장면 검토<br>`new_scene` | 원 회전으로 생기는 고리와 큰 원·작은 원의 넓이 차 | P1<br>반지름 5, 축과 원 사이 3 |

#### final · PDF 179쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SOL-075 **공유** | 인쇄 p.179 · **고난도 기출문제 13**<br>원뿔 최단 경로 아래 영역의 넓이 | 심화<br>부록 고난도 기출문제 | [g7-solids#s4-1](../../../apmath/playground/next/labs/g7-solids.html#s=s4-1) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시<br>[g7-solids#s3-2](../../../apmath/playground/next/labs/g7-solids.html#s=s3-2) — 해당 장면의 정의·문제·풀이 코드와 이 문항의 핵심 개념을 대조; 추가 단계는 action에 명시 | 풀이 보강 검토<br>`solution_upgrade` | 전개도에서 부채꼴과 삼각형의 넓이 차를 단계별 표현 | P2<br>최단거리 심화, 12와 3 |

### 겉넓이와 부피 · 67행

#### final · PDF 53쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-001 | 인쇄 p.53 · **07**<br>구멍 뚫린 기둥의 겉넓이와 부피 | 표준<br>기본 공식 적용; 사각 구멍의 겉넓이와 부피를 함께 묻는다 | [g7-surface-volume#sv5-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv5-2) — 사각 구멍의 겉넓이와 부피를 함께 묻는다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-002 | 인쇄 p.53 · **08**<br>직사각형 회전체의 겉넓이 | 심화<br>복합 조건 또는 역산; 회전축을 중심으로 직사각형을 회전시킨다 | [g7-surface-volume#sv1-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1) — 회전축을 중심으로 직사각형을 회전시킨다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-003 | 인쇄 p.53 · **09**<br>정사각뿔의 겉넓이 | 표준<br>기본 공식 적용; 밑면과 합동인 네 옆면의 넓이를 더한다 | [g7-surface-volume#sv2-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-5) — 밑면과 합동인 네 옆면의 넓이를 더한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-004 | 인쇄 p.53 · **10**<br>원뿔의 겉넓이 | 표준<br>기본 공식 적용; 반지름 5와 모선 13으로 겉넓이를 구한다 | [g7-surface-volume#sv2-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-3) — 반지름 5와 모선 13으로 겉넓이를 구한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-005 | 인쇄 p.53 · **11**<br>삼각뿔의 부피 | 표준<br>기본 공식 적용; 삼각형 밑넓이와 높이로 뿔의 부피를 구한다 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 삼각형 밑넓이와 높이로 뿔의 부피를 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-006 | 인쇄 p.53 · **12**<br>원뿔의 부피 | 표준<br>기본 공식 적용; 반지름과 높이로 원뿔 부피를 구한다 | [g7-surface-volume#sv2-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-3) — 반지름과 높이로 원뿔 부피를 구한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 54쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-007 | 인쇄 p.54 · **13**<br>정육면체를 자른 삼각뿔 | 심화<br>복합 조건 또는 역산; 세 꼭짓점을 지나는 절단면에서 삼각뿔을 찾는다 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 세 꼭짓점을 지나는 절단면에서 삼각뿔을 찾는다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-008 | 인쇄 p.54 · **14**<br>원뿔대의 겉넓이 | 심화<br>복합 조건 또는 역산; 두 밑면 반지름과 모선으로 겉넓이를 구한다 | [g7-surface-volume#sv2-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-4) — 두 밑면 반지름과 모선으로 겉넓이를 구한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-009 | 인쇄 p.54 · **15**<br>원뿔대의 부피 | 심화<br>복합 조건 또는 역산; 큰 원뿔에서 작은 원뿔을 뺀다 | [g7-surface-volume#sv2-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-4) — 큰 원뿔에서 작은 원뿔을 뺀다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-010 | 인쇄 p.54 · **16**<br>원뿔 전개도에서 겉넓이 | 심화<br>복합 조건 또는 역산; 부채꼴 중심각과 반지름에서 밑면 반지름을 역산한다 | [g7-surface-volume#sv2-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-2) — 부채꼴 중심각과 반지름에서 밑면 반지름을 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-011 | 인쇄 p.54 · **17**<br>직각삼각형 회전체 부피 | 심화<br>복합 조건 또는 역산; 축이 삼각형 바깥 변에 놓여 회전체 부피를 구한다 | [g7-surface-volume#sv4-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-1) — 축이 삼각형 바깥 변에 놓여 회전체 부피를 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-012 | 인쇄 p.54 · **18**<br>지름으로 구의 겉넓이 | 심화<br>복합 조건 또는 역산; 지름을 반지름으로 바꾸어 구의 겉넓이를 구한다 | [g7-surface-volume#sv3-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-1) — 지름을 반지름으로 바꾸어 구의 겉넓이를 구한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 55쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-013 | 인쇄 p.55 · **19**<br>겉넓이로부터 구의 부피 | 심화<br>복합 조건 또는 역산; 겉넓이에서 반지름을 먼저 구한다 | [g7-surface-volume#sv3-6](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-6) — 겉넓이에서 반지름을 먼저 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-014 | 인쇄 p.55 · **20**<br>반구의 겉넓이 | 심화<br>복합 조건 또는 역산; 곡면과 원형 단면을 더한다 | [g7-surface-volume#sv3-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-2) — 곡면과 원형 단면을 더한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-015 | 인쇄 p.55 · **21**<br>구의 일부를 자른 부피 | 심화<br>복합 조건 또는 역산; 구의 4분의 1을 잘라낸 나머지 부피이다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 구의 4분의 1을 잘라낸 나머지 부피이다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-016 | 인쇄 p.55 · **22**<br>동심 사분원 회전체의 부피 | 심화<br>복합 조건 또는 역산; 동심 사분원 띠를 회전한 속이 빈 구를 다룬다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 동심 사분원 띠를 회전한 속이 빈 구를 다룬다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-017 | 인쇄 p.55 · **23**<br>원기둥에 꼭 맞는 구의 부피비 | 심화<br>복합 조건 또는 역산; 구 부피에서 원기둥 부피를 역으로 구한다 | [g7-surface-volume#sv3-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-3) — 구 부피에서 원기둥 부피를 역으로 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-018 | 인쇄 p.55 · **24**<br>정육면체에 든 구와 사각뿔 부피비 | 심화<br>복합 조건 또는 역산; 정육면체 구 사각뿔 세 입체의 부피비를 비교한다 | [g7-surface-volume#sv3-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-3) — 정육면체 구 사각뿔 세 입체의 부피비를 비교한다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 56쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-019 | 인쇄 p.56 · **01**<br>사다리꼴 밑면 기둥 겉넓이 | 표준<br>기본 공식 적용; 사다리꼴 밑면 둘레와 넓이를 사용한다 | [g7-surface-volume#sv1-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1) — 사다리꼴 밑면 둘레와 넓이를 사용한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-020 | 인쇄 p.56 · **02**<br>원기둥 겉넓이로 높이 찾기 | 표준<br>기본 공식 적용; 겉넓이와 반지름으로 높이를 역산한다 | [g7-surface-volume#sv1-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1) — 겉넓이와 반지름으로 높이를 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-021 | 인쇄 p.56 · **03**<br>삼각기둥 부피로 높이 찾기 | 표준<br>기본 공식 적용; 부피와 직각삼각형 밑면에서 높이를 역산한다 | [g7-surface-volume#sv1-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-4) — 부피와 직각삼각형 밑면에서 높이를 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-022 | 인쇄 p.56 · **04**<br>원기둥 부피로 반지름 찾기 | 표준<br>기본 공식 적용; 부피와 높이로 반지름을 역산한다 | [g7-surface-volume#sv1-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-4) — 부피와 높이로 반지름을 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-023 | 인쇄 p.56 · **05**<br>원기둥 전개도 겉넓이 | 표준<br>기본 공식 적용; 원 둘과 직사각형 전개도에서 겉넓이를 구한다 | [g7-surface-volume#sv1-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1) — 원 둘과 직사각형 전개도에서 겉넓이를 구한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-024 | 인쇄 p.56 · **06**<br>부채꼴기둥 부피 | 표준<br>기본 공식 적용; 중심각 270도인 밑넓이와 높이로 부피를 구한다 | [g7-surface-volume#sv1-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-2) — 중심각 270도인 밑넓이와 높이로 부피를 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 57쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-025 | 인쇄 p.57 · **07**<br>관 모양 기둥 겉넓이와 부피 | 표준<br>기본 공식 적용; 안쪽 곡면과 바깥 곡면을 함께 세고 부피를 뺀다 | [g7-surface-volume#sv5-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv5-1) — 안쪽 곡면과 바깥 곡면을 함께 세고 부피를 뺀다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-026 | 인쇄 p.57 · **08**<br>직사각형 회전체 부피 | 심화<br>복합 조건 또는 역산; 직사각형의 회전으로 원기둥을 만든다 | [g7-surface-volume#sv1-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-4) — 직사각형의 회전으로 원기둥을 만든다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-027 | 인쇄 p.57 · **09**<br>정사각뿔 겉넓이로 옆면 높이 찾기 | 표준<br>기본 공식 적용; 전체 겉넓이에서 옆면 높이를 역산한다 | [g7-surface-volume#sv2-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-5) — 전체 겉넓이에서 옆면 높이를 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-028 | 인쇄 p.57 · **10**<br>원뿔 겉넓이로 모선 찾기 | 표준<br>기본 공식 적용; 반지름과 겉넓이에서 모선을 역산한다 | [g7-surface-volume#sv2-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-3) — 반지름과 겉넓이에서 모선을 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-029 | 인쇄 p.57 · **11**<br>사각뿔 부피로 높이 찾기 | 표준<br>기본 공식 적용; 부피와 밑넓이를 이용해 높이를 역산한다 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 부피와 밑넓이를 이용해 높이를 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-030 | 인쇄 p.57 · **12**<br>원뿔 부피로 높이 찾기 | 표준<br>기본 공식 적용; 부피와 밑면 반지름으로 높이를 역산한다 | [g7-surface-volume#sv2-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-3) — 부피와 밑면 반지름으로 높이를 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 58쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-031 | 인쇄 p.58 · **13**<br>직육면체에서 삼각뿔을 자른 부피 | 심화<br>복합 조건 또는 역산; 직육면체 부피에서 세 꼭짓점의 삼각뿔을 뺀다 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 직육면체 부피에서 세 꼭짓점의 삼각뿔을 뺀다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-032 | 인쇄 p.58 · **14**<br>사각뿔대 겉넓이 | 심화<br>복합 조건 또는 역산; 사다리꼴 옆면 네 개와 두 밑면을 더한다 | [g7-surface-volume#sv2-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-5) — 사다리꼴 옆면 네 개와 두 밑면을 더한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-033 | 인쇄 p.58 · **15**<br>사각뿔대 부피 | 심화<br>복합 조건 또는 역산; 큰 뿔에서 작은 뿔을 빼는 구조이다 | [g7-surface-volume#sv2-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-5) — 큰 뿔에서 작은 뿔을 빼는 구조이다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-034 | 인쇄 p.58 · **16**<br>사각뿔 전개도의 겉넓이 | 심화<br>복합 조건 또는 역산; 정사각형과 합동인 삼각형 네 개를 더한다 | [g7-surface-volume#sv2-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-5) — 정사각형과 합동인 삼각형 네 개를 더한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-035 | 인쇄 p.58 · **17**<br>사다리꼴 회전체 겉넓이 | 심화<br>복합 조건 또는 역산; 회전한 원뿔대의 겉넓이를 구한다 | [g7-surface-volume#sv4-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-2) — 회전한 원뿔대의 겉넓이를 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-036 | 인쇄 p.58 · **18**<br>원기둥과 반구를 붙인 겉넓이 | 심화<br>복합 조건 또는 역산; 붙은 원은 빼고 외부의 곡면과 밑면만 더한다 | [g7-surface-volume#sv4-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-4) — 붙은 원은 빼고 외부의 곡면과 밑면만 더한다 | 정적 대응<br>`covered` | 해당 장면에서 개념과 계산을 연결한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 59쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-037 | 인쇄 p.59 · **19**<br>원뿔과 반구의 부피 | 심화<br>복합 조건 또는 역산; 맞붙인 원뿔과 반구의 부피를 더한다 | [g7-surface-volume#sv4-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-4) — 맞붙인 원뿔과 반구의 부피를 더한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-038 | 인쇄 p.59 · **20**<br>구의 4분의 1 절단 후 겉넓이 | 심화<br>복합 조건 또는 역산; 남은 곡면과 새 단면 두 개를 더한다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 남은 곡면과 새 단면 두 개를 더한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-039 | 인쇄 p.59 · **21**<br>구의 8분의 1 절단 후 부피 | 심화<br>복합 조건 또는 역산; 구 부피의 7/8을 구한다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 구 부피의 7/8을 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-040 | 인쇄 p.59 · **22**<br>삼각형과 사분원의 복합 회전체 겉넓이 | 심화<br>복합 조건 또는 역산; 원뿔과 안쪽 반구의 복합 회전면을 센다 | [g7-surface-volume#sv4-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-1) — 원뿔과 안쪽 반구의 복합 회전면을 센다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-041 | 인쇄 p.59 · **23**<br>원기둥에 꼭 맞는 구 두 개 | 심화<br>복합 조건 또는 역산; 원기둥 부피로 구 한 개의 부피를 역산한다 | [g7-surface-volume#sv3-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-3) — 원기둥 부피로 구 한 개의 부피를 역산한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P1<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-042 | 인쇄 p.59 · **24**<br>구에 꼭 맞는 정팔면체 부피 | 심화<br>복합 조건 또는 역산; 구의 반지름에서 정팔면체의 부피를 구한다 | [g7-surface-volume#sv3-6](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-6) — 구의 반지름에서 정팔면체의 부피를 구한다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 64쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-043 | 인쇄 p.64 · **1**<br>원뿔의 물을 원기둥에 옮기기 | 심화<br>서술형 배점과 과정 제시 요구; 원뿔과 원기둥의 물 부피가 같다는 과정을 서술한다 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 원뿔과 원기둥의 물 부피가 같다는 과정을 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-044 | 인쇄 p.64 · **1-1**<br>원뿔에서 다른 반지름 원기둥으로 물 옮기기 | 심화<br>서술형 배점과 과정 제시 요구; 서로 다른 밑면 반지름과 물 높이를 연결해 서술한다 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 서로 다른 밑면 반지름과 물 높이를 연결해 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-045 | 인쇄 p.64 · **1-2**<br>병을 거꾸로 세워 부피 구하기 | 심화<br>서술형 배점과 과정 제시 요구; 병을 뒤집은 물과 빈 공간의 높이를 함께 이용한다 | [g7-surface-volume#sv1-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-4) — 병을 뒤집은 물과 빈 공간의 높이를 함께 이용한다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 65쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-046 | 인쇄 p.65 · **2**<br>구 일부 절단 후 겉넓이와 부피 서술 | 심화<br>서술형 배점과 과정 제시 요구; 4분의 1 절단 뒤 곡면 단면과 부피를 각각 서술한다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 4분의 1 절단 뒤 곡면 단면과 부피를 각각 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-047 | 인쇄 p.65 · **2-1**<br>구의 8분의 1 절단 후 부피 서술 | 심화<br>서술형 배점과 과정 제시 요구; 남은 8분의 7의 부피를 서술한다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 남은 8분의 7의 부피를 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-048 | 인쇄 p.65 · **2-2**<br>구의 8분의 1 조각 겉넓이 서술 | 심화<br>서술형 배점과 과정 제시 요구; 곡면과 세 단면의 합을 서술한다 | [g7-surface-volume#sv3-5](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-5) — 곡면과 세 단면의 합을 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 66쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-049 | 인쇄 p.66 · **3**<br>사다리꼴 회전체의 겨냥도와 부피 서술 | 심화<br>서술형 배점과 과정 제시 요구; 원뿔대 겨냥도와 두 원뿔 부피의 차를 서술한다 | [g7-surface-volume#sv4-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-2) — 원뿔대 겨냥도와 두 원뿔 부피의 차를 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-050 | 인쇄 p.66 · **3-1**<br>축과 떨어진 직사각형의 회전체 부피 | 심화<br>서술형 배점과 과정 제시 요구; 떨어진 회전축으로 원기둥 구멍이 생긴다 | [g7-surface-volume#sv5-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv5-1) — 떨어진 회전축으로 원기둥 구멍이 생긴다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-051 | 인쇄 p.66 · **3-2**<br>삼각형과 사분원 회전체 겉넓이 서술 | 심화<br>서술형 배점과 과정 제시 요구; 원뿔과 반구가 맞붙는 회전체의 겉넓이를 서술한다 | [g7-surface-volume#sv4-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-4) — 원뿔과 반구가 맞붙는 회전체의 겉넓이를 서술한다 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 해당 입체 또는 회전 조건의 장면을 검토한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 67쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-052 | 인쇄 p.67 · **4**<br>원기둥에 든 구 세 개 사이 빈 공간 | 심화<br>서술형 배점과 과정 제시 요구; 원기둥 부피에서 구 세 개를 빼는 과정을 서술한다 | [g7-surface-volume#sv3-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-3) — 원기둥 부피에서 구 세 개를 빼는 과정을 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-053 | 인쇄 p.67 · **4-1**<br>원기둥에 든 야구공 세 개 사이 빈 공간 | 심화<br>서술형 배점과 과정 제시 요구; 같은 구 세 개의 부피와 원기둥 부피 차를 서술한다 | [g7-surface-volume#sv3-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-3) — 같은 구 세 개의 부피와 원기둥 부피 차를 서술한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |
| SV-054 | 인쇄 p.67 · **4-2**<br>원기둥에서 구를 꺼낸 뒤 물 높이 | 심화<br>서술형 배점과 과정 제시 요구; 구를 넣었다 꺼낸 뒤 남은 물의 부피로 높이를 구한다 | [g7-surface-volume#sv3-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-4) — 구를 넣었다 꺼낸 뒤 남은 물의 부피로 높이를 구한다 | 풀이 보강 검토<br>`solution_upgrade` | 문제의 역산 또는 서술 과정을 기존 장면에 보강한다. | P0<br>장면 코드의 질문과 원리 기준 대응이며 교재 문항 숫자의 재현 여부 및 화면 검수는 별도 확인 필요 |

#### final · PDF 178쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-055 **공유** | 인쇄 p.178 · **12**<br>원을 축 밖에서 회전시킨 입체의 단면 | 심화<br>교재 고난도 기출문제; 원과 축이 떨어진 회전체의 고리 모양 단면 | [g7-surface-volume#sv4-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-1) — 원과 축이 떨어진 회전체의 고리 모양 단면 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |

#### final · PDF 179쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-056 **공유** | 인쇄 p.179 · **13**<br>원뿔 옆면을 따라 도는 최단선 아래 넓이 | 심화<br>교재 고난도 기출문제; 원뿔을 전개해 최단선과 그 아래 넓이를 구함 | [g7-surface-volume#sv2-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-2) — 원뿔을 전개해 최단선과 그 아래 넓이를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-057 | 인쇄 p.179 · **14**<br>정육면체를 여러 번 잘라 겉넓이 합 | 심화<br>교재 고난도 기출문제; 101개 직육면체의 겉넓이 합에서 생긴 단면을 셈 | [g7-surface-volume#sv5-3](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv5-3) — 101개 직육면체의 겉넓이 합에서 생긴 단면을 셈 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-058 | 인쇄 p.179 · **15**<br>정육면체 7개를 붙인 겉넓이 | 심화<br>교재 고난도 기출문제; 부피로 모서리를 구하고 외부에 드러난 면을 셈 | [g7-surface-volume#sv5-6](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv5-6) — 부피로 모서리를 구하고 외부에 드러난 면을 셈 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-059 | 인쇄 p.179 · **16**<br>정사각형에 그린 원기둥 전개도 부피 | 심화<br>교재 고난도 기출문제; 전개도와 정사각형의 길이 관계로 반지름과 높이를 구함 | [g7-surface-volume#sv1-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1) — 전개도와 정사각형의 길이 관계로 반지름과 높이를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |

#### final · PDF 180쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-060 | 인쇄 p.180 · **17**<br>겹친 두 원기둥의 공통 부피 | 심화<br>교재 고난도 기출문제; 두 원의 공통 부분을 밑면으로 하여 부피를 구함 | [g7-surface-volume#sv1-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-4) — 두 원의 공통 부분을 밑면으로 하여 부피를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-061 | 인쇄 p.180 · **18**<br>정사각형을 접어 만든 입체 부피 | 심화<br>교재 고난도 기출문제; 삼각형들로 접은 입체의 밑면과 높이를 찾아 부피를 구함 | [g7-surface-volume#sv2-1](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-1) — 삼각형들로 접은 입체의 밑면과 높이를 찾아 부피를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-062 | 인쇄 p.180 · **19**<br>원뿔을 굴린 횟수로 겉넓이 | 심화<br>교재 고난도 기출문제; 꼭짓점 둘레를 굴린 횟수에서 모선을 찾아 겉넓이를 구함 | [g7-surface-volume#sv2-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-2) — 꼭짓점 둘레를 굴린 횟수에서 모선을 찾아 겉넓이를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-063 | 인쇄 p.180 · **20**<br>뒤집은 병의 부피 | 심화<br>교재 고난도 기출문제; 물과 빈 공간의 높이를 더해 병 전체 부피를 구함 | [g7-surface-volume#sv1-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-4) — 물과 빈 공간의 높이를 더해 병 전체 부피를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |

#### final · PDF 181쪽

| 행 ID | 교재 문항 · 학습요소 | 난도 · 근거 | 장면 · 대응 근거 | 상태 | 부족 학습요소·후속 검토 | 우선순위 · 비고 |
|---|---|---|---|---|---|---|
| SV-064 | 인쇄 p.181 · **21**<br>굴린 원뿔대의 옆넓이 | 심화<br>교재 고난도 기출문제; 세 바퀴 굴러 돌아오는 조건과 두 반지름으로 옆넓이를 구함 | [g7-surface-volume#sv2-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv2-4) — 세 바퀴 굴러 돌아오는 조건과 두 반지름으로 옆넓이를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-065 | 인쇄 p.181 · **22**<br>평면도형 회전체의 부피 | 심화<br>교재 고난도 기출문제; 평행사변형 회전으로 생기는 입체의 부피를 구함 | [g7-surface-volume#sv4-2](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv4-2) — 평행사변형 회전으로 생기는 입체의 부피를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-066 | 인쇄 p.181 · **23**<br>구 세 개가 든 원기둥에 남은 물 | 심화<br>교재 고난도 기출문제; 원기둥 안에 꼭 맞는 구 세 개와 남은 물의 부피를 비교함 | [g7-surface-volume#sv3-4](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-4) — 원기둥 안에 꼭 맞는 구 세 개와 남은 물의 부피를 비교함 | 풀이 보강 검토<br>`solution_upgrade` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
| SV-067 | 인쇄 p.181 · **24**<br>구에 꼭 맞는 정팔면체의 부피 | 심화<br>교재 고난도 기출문제; 구의 부피에서 반지름을 역산하고 정팔면체 부피를 구함 | [g7-surface-volume#sv3-6](../../../apmath/playground/next/labs/g7-surface-volume.html#s=sv3-6) — 구의 부피에서 반지름을 역산하고 정팔면체 부피를 구함 | 새 장면 검토<br>`new_scene` | 기존 장면을 출발점으로 문제 조건과 풀이 단계를 추가 검토한다. | P0<br>가까운 원리의 장면이며 문제 조건을 그대로 재현하는 것은 아님; 화면 검수 필요 |
