# RPM 2022 중학 부모 정본·호환 계약

기준일: 2026-11-13. 적용 범위: 2022 개정 RPM 중학 1–3학년, 1·2학기 6권의 L1/L2. 현재 사용자 지시에 따라 출판사의 공개 자료에서 장 구성을 확인하고, 기존 L3/L4를 보존한 채 현재 부모 정본을 추가한다.

## 1. 현재 권위와 보존 경계

현재 부모 정본은 [`rpm-middle-2022-parents.json`](../../../../../archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json)이다. 버전은 `RPM_MIDDLE_2022_PARENT_REFINEMENT_v1.1`, 상태는 `ACTIVE`이며, 24개 L1·54개 L2를 등록한다. 이 정본은 현재 화면의 소단원 선택과 공식 메타 Resolver의 새 L1/L2 입력에 모두 사용한다.

기존 [`CANONICAL_MASTER.json`](../rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json)의 2022 중학 부분은 24개 L1·51개 L2·155개 L3·326개 L4를 가진 잠긴 base snapshot이다. 그 SHA256은 `7358c7e703e67ebe1db83284918d148bf0ae90625a0dbb85438792136a9fea5c`이다. base snapshot과 기존 crosswalk의 ID·행·상태, source의 표준단원/세부단원 키, 기존 승인 영수증은 이 부모 정비에서 재작성하지 않는다.

- **현재 L1/L2:** 새 부모 정본의 `parents`와 `units`를 따른다.
- **L3/L4의 의미와 base identity:** 기존 locked snapshot의 155개 L3·326개 L4를 그대로 사용한다. 모든 base leaf는 정확히 한 effective parent에 연결된다.
- **PT/TPL·ACTIVE 바인딩:** 기존 공식 Resolver와 ACTIVE registry가 결정한다. 새 부모 등록은 PT/TPL이나 ACTIVE 바인딩 신설을 뜻하지 않는다.
- **2015와 고등:** 이번 정본의 변환 범위 밖이다. 원래 교육과정과 기존 처리 경로를 유지한다.

기존 [RPM Primary Policy](../rpm-primary-v1.0/00_POLICY/RPM_PRIMARY_POLICY.md)의 RPM 공개 목차 우선, L3/L4 의미 정규화, 전체 curriculum/course/path identity 원칙을 따른다. 해당 파일과 `MANIFEST.json`은 봉인된 snapshot의 일부이므로 수정하지 않는다. 정책에 남은 `제곱근과 그 실수`는 그 당시 base 표기를 보존하는 값이다. 2022 중학의 현재 장 선택에는 이 문서와 새 부모 정본에 기록한 공식 최신 장 구성을 적용한다.

## 2. 전체 L1/L2 표

괄호 숫자 앞 공백만 identity에서 제거한다. 예를 들어 출판사 목차의 `일차함수와 그 그래프 (1)`은 `일차함수와 그 그래프(1)`로 식별한다. 인쇄 원문 표기는 `sourceEvidence[].normalizedHeadingTable`의 source 필드에 별도로 보존한다. 다른 띄어쓰기·단어·L3·L4는 추정해서 고치지 않는다.

| 권 | L1 | 현재 L2 전체 | L2 수 |
|---|---|---|---:|
| M1-1 | 소인수분해 | 1. 소인수분해; 2. 최대공약수와 최소공배수 | 2 |
| M1-1 | 정수와 유리수 | 1. 정수와 유리수; 2. 정수와 유리수의 계산 | 2 |
| M1-1 | 문자와 식 | 1. 문자의 사용과 식의 계산; 2. 일차방정식의 풀이; 3. 일차방정식의 활용 | 3 |
| M1-1 | 좌표평면과 그래프 | 1. 좌표와 그래프; 2. 정비례와 반비례 | 2 |
| M1-2 | 기본 도형 | 1. 기본 도형; 2. 위치 관계; 3. 작도와 합동 | 3 |
| M1-2 | 평면도형 | 1. 다각형; 2. 원과 부채꼴 | 2 |
| M1-2 | 입체도형 | 1. 다면체와 회전체; 2. 입체도형의 겉넓이와 부피 | 2 |
| M1-2 | 통계 | 1. 대푯값; 2. 도수분포표와 상대도수 | 2 |
| M2-1 | 유리수와 순환소수 | 1. 유리수와 순환소수 | 1 |
| M2-1 | 식의 계산 | 1. 단항식의 계산; 2. 다항식의 계산 | 2 |
| M2-1 | 일차부등식 | 1. 일차부등식; 2. 일차부등식의 활용 | 2 |
| M2-1 | 연립일차방정식 | 1. 연립일차방정식; 2. 연립일차방정식의 활용 | 2 |
| M2-1 | 일차함수 | 1. 일차함수와 그 그래프(1); 2. 일차함수와 그 그래프(2); 3. 일차함수와 일차방정식의 관계 | 3 |
| M2-2 | 삼각형의 성질 | 1. 삼각형의 성질; 2. 삼각형의 외심과 내심 | 2 |
| M2-2 | 사각형의 성질 | 1. 평행사변형; 2. 여러 가지 사각형 | 2 |
| M2-2 | 도형의 닮음과 피타고라스 정리 | 1. 도형의 닮음; 2. 평행선 사이의 선분의 길이의 비; 3. 삼각형의 무게중심; 4. 피타고라스 정리 | 4 |
| M2-2 | 확률 | 1. 경우의 수; 2. 확률 | 2 |
| M3-1 | 실수와 그 연산 | 1. 제곱근의 뜻과 성질; 2. 무리수와 실수; 3. 근호를 포함한 식의 계산 | 3 |
| M3-1 | 다항식의 곱셈과 인수분해 | 1. 다항식의 곱셈; 2. 다항식의 인수분해 | 2 |
| M3-1 | 이차방정식 | 1. 이차방정식의 풀이; 2. 이차방정식의 활용 | 2 |
| M3-1 | 이차함수 | 1. 이차함수의 그래프(1); 2. 이차함수의 그래프(2) | 2 |
| M3-2 | 삼각비 | 1. 삼각비; 2. 삼각비의 활용 | 2 |
| M3-2 | 원의 성질 | 1. 원과 직선; 2. 원주각; 3. 원주각의 활용 | 3 |
| M3-2 | 통계 | 1. 산포도; 2. 상자그림과 산점도 | 2 |

권별 L2 수는 **M1-1 9 / M1-2 9 / M2-1 10 / M2-2 10 / M3-1 9 / M3-2 7**, 합계 54개이다.

## 3. base 51개에서 새로 분리한 세 부모

공식 장 제목과 장 경계를 확인한 결과, 기존 base 부모 세 곳이 각각 두 장으로 나뉜다. 각 L3의 이동은 기존 leaf 의미와 해당 장의 내용을 확인하여 고정했다. 다음 L3는 출판사 L3 원문 목차를 인용한 것이 아니라 기존 Archive 정본의 의미 분류이다.

| 권 | 기존 base L2 | 기존 L3 | 현재 effective L2 |
|---|---|---|---|
| M2-1 | 일차함수와 그 그래프 | 일차함수의 뜻 | 일차함수와 그 그래프(1) |
| M2-1 | 일차함수와 그 그래프 | 일차함수의 그래프 | 일차함수와 그 그래프(1) |
| M2-1 | 일차함수와 그 그래프 | 그래프의 성질 | 일차함수와 그 그래프(2) |
| M2-1 | 일차함수와 그 그래프 | 식 구하기 | 일차함수와 그 그래프(2) |
| M3-1 | 제곱근과 그 실수 | 제곱근 | 제곱근의 뜻과 성질 |
| M3-1 | 제곱근과 그 실수 | 무리수와 실수 | 무리수와 실수 |
| M3-1 | 제곱근과 그 실수 | 수직선과 제곱근 | 무리수와 실수 |
| M3-2 | 원주각 | 원주각과 중심각 | 원주각 |
| M3-2 | 원주각 | 원주각의 활용 | 원주각의 활용 |

M2-1 그래프(1)는 함수·함숫값·일차함수 판별, 절편·기울기·그래프 그리기 영역이다. 그래프(2)의 기존 L3 `그래프의 성질`은 평행·일치 및 증가·감소이며 `식 구하기`는 두 점 또는 기울기와 한 점 등으로 식을 결정하는 영역이다. 그래프(1)에도 평행이동이나 증가량을 이용한 기울기가 나오므로 단어만 보고 그래프(2)로 이동시키지 않는다. 근거는 공식 PDF의 08장 시작 p67, 09장 p75, 10장 p84와 `splitEvidence`에 기록되어 있다.

M3-1은 제곱근 정의·성질 장이 p2에서 시작하고 무리수와 실수 장이 p11에서 시작한다. 수직선에서 무리수의 위치를 다루는 p13·p15 내용을 확인해 `수직선과 제곱근`을 후자로 연결했다. M3-2는 원주각·중심각 관계 장이 p34, 내접사각형·접선과 현의 각 등을 다루는 활용 장이 p41에서 시작한다. 페이지는 모두 공식 PDF의 1부터 시작하는 페이지 번호이다.

이 세 분리로 부모 L2는 51개에서 54개가 된다. 원래 L3/L4 문자열·leaf identity·crosswalk row ID와 기존 바인딩 상태는 유지된다.

## 4. 이전부터 넓게 합쳐져 있던 일곱 세부단원 키

기존 source의 다음 세부단원 키는 원래 base RPM에서도 서로 다른 L2를 하나의 키에 묶고 있었다. 현재 선택에서는 정확한 RPM 부모를 사용해 이들을 나눈다. 기존 키의 이름이나 번호를 일괄 바꾸지 않는다.

| 기존 subUnitKey | 각각 선택할 현재 L2 |
|---|---|
| `M1-04-GRAPH_RELATION` | 좌표와 그래프, 정비례와 반비례 |
| `M1-05-BASIC_FIGURE` | 기본 도형, 작도와 합동 |
| `M1-06-POLYGON_CIRCLE` | 다각형, 원과 부채꼴 |
| `M1-08-DATA_INTERPRETATION` | 대푯값, 도수분포표와 상대도수 |
| `M2-05-TRIANGLE_PROPERTIES` | 삼각형의 성질, 삼각형의 외심과 내심 |
| `M2-05-QUADRILATERAL_PROPERTIES` | 평행사변형, 여러 가지 사각형 |
| `M3-04-QUADRATIC_FUNCTION_GRAPH` | 이차함수의 그래프(1), 이차함수의 그래프(2) |

여기에 위 세 신규 분리에 대응하는 `M2-04-LINEAR_FUNCTION_BASIC`, `M3-01-SQUARE_ROOT_REAL_NUMBER`, `M3-06-CIRCLE_INSCRIBED_ANGLE`도 한 기존 키만으로 현재 부모를 정할 수 없는 경우가 된다. 총 열 개 broad key의 실제 후보 목록은 정본의 `legacySubUnitMappings`에 있다.

특히 중1 `기본 도형`·`위치 관계`·`작도와 합동`, `다각형`·`원과 부채꼴`, `대푯값`·`도수분포표와 상대도수`는 각각 다른 현재 부모이다. 작도나 삼각형 합동 문항을 다각형·원으로 분류하는 대체 규칙은 없다. 실제 문항의 핵심 풀이와 정확한 L3/L4를 읽고 연결해야 한다.

## 5. 키와 경로 계약

현재 부모 키는 JSON 문자열로 직렬화한 네 원소 tuple이다.

```json
["2022", "M1-2", "기본 도형", "작도와 합동"]
```

`parentKey`는 curriculum·권·L1·L2를 모두 포함한다. L2 이름만으로 전 학년의 identity를 만들지 않는다. `unitKey`는 현재 선택 화면용 L1 ID이며 예를 들어 `RPM22-M1-L1-05`이다. `legacyUnitKeys`가 기존 화면 단원 키와의 대응을 보존한다. 이 UI key를 기존 source의 `standardUnitKey`로 덮어쓰지 않는다.

브라우저/CommonJS 공용 [`rpm-middle-toc.js`](../../../../../archive/rpm-middle-toc.js)는 같은 정본에서 생성한 immutable payload와 다음 API를 제공한다.

| API | 계약 |
|---|---|
| `units(grade)` / `parents(grade)` | 해당 중학 학년의 현재 L1/L2 목록. 학년 인수 생략 시 전체; 고등 등 범위 밖 인수는 빈 목록. |
| `parent(key)` / `unit(key)` | 정확한 현재 ID 조회. |
| `refinePath(path)` | base 또는 effective 경로를 정확히 대조해 `basePath`, `effectivePath`, `parentKey`, `unitKey`, `status`, `granularity` 반환. |
| `resolveRecord(record, grade)` | 기존 문항에서 정확한 RPM 경로 또는 모호하지 않은 기존 키를 읽어 현재 부모를 반환. 원본 record는 수정하지 않음. |
| `normalizePath(path)` / `toRpmPath(path)` | Core-shaped 경로와 공식 Resolver의 RPM-shaped 경로 간 명시적 변환. |
| `createAuthority(document)` | 공식 서버 Resolver가 파일에서 읽은 동일 정본으로 검증용 인덱스를 구성. |

`refinePath`의 full leaf는 `LEAF`, L3까지만 있는 정확한 경로는 `CONCEPT`, 부모만 유일하면 `PARENT` granularity를 갖는다. 신규 공식 의미 확정에는 **full leaf만** 허용한다. UI가 부모를 인식했다고 문항의 L3/L4 의미 검토나 메타 전체 승인이 완료된 것은 아니다.

`resolveRecord`는 `rpmPrimaryPath`, `rpmSemantic`, `metadataAssignmentEvidence.rpmMetadata`의 content-bound RPM 값, 명시적 RPM 필드, 기존 parent 필드 순서로 대조한다. 등록된 RPM 증거의 L1~L4를 읽을 수 있어야 하며 legacy 표시명만으로 연결하지 않는다. 학기 scope가 빠졌으면 학년과 정확한 L1/L2가 하나의 권을 가리킬 때만 scope를 보완한다. 명시된 `originalCurriculum`이 화면용 과정 값보다 우선한다.

### 모호하거나 충돌하는 기록

- 오래된 `일차함수와 그 그래프`, `제곱근과 그 실수`, `원주각` 부모만 있고 L3/L4가 없으면 `LEGACY_PARENT_AMBIGUOUS`이다.
- **옛 `원주각` 이름이 현재 두 자식 중 하나에도 남아 있어도** 부모 이름만으로 기본 원주각 장을 선택하지 않는다.
- 한 기존 `subUnitKey`가 여러 현재 부모에 연결되면 보류한다. 정확한 L3/leaf나 문항 의미 검토가 필요하다.
- 강한 RPM 증거가 모순되거나 없는 leaf를 가리키면, 약한 기존 표시명으로 조용히 덮어 분류하지 않는다.
- 새 L2 아래에 속하지 않는 L3/L4 조합은 `NOT_FOUND`이며, 공식 의미 확정은 기존 경로 검증의 HOLD 처리로 남는다.
- 2015와 고등은 `OUT_OF_SCOPE`이다. 출처 연도만으로 이 helper가 원래 교육과정을 변경하지 않는다.

## 6. 공식 Resolver와 운영 선택의 경계

공식 [`rpm-active-resolver.mjs`](../../../../../archive/tools/meta-foundation/rpm-active-resolver.mjs)는 기존 exact base 입력부터 종전 경로로 검증한다. 이 경우 refinement 파일을 authorityRefs에 끼워 넣거나 결과 필드를 추가하지 않아 이전 증거 재검증을 유지한다.

새 effective L1/L2 입력이 locked master에서 직접 발견되지 않을 때만 2022 중학 refinement를 적용한다. 새 정본이 `ACTIVE`이고 `baseAuthority.path` 및 SHA가 실제 locked master와 같아야 하며, 입력 L1~L4 전체가 유일한 base leaf로 역매핑되어야 한다. 이후 기존 crosswalk→ACTIVE owner→exact binding 검증을 같은 base leaf로 수행한다.

새 입력의 결과는 다음을 구분해 남긴다.

| 필드 | 내용 |
|---|---|
| `semanticInputBundle.semanticDecision.rpmPath` | 작업자가 판정한 새 effective 입력. 입력 bundle SHA에 결속. |
| `rpmPath`, `rpmSemantic` | 기존 crosswalk와 승인 체인이 사용하는 정확한 base 경로. |
| `effectivePath`, `effectiveParentKey` | 현재 부모 정본으로 검증한 새 경로/부모. L3/L4 문자열은 base와 같음. |
| `parentRefinementAuthority`, `authorityRefs` | 사용한 refinement 정본 경로·SHA·버전 및 `RPM_EFFECTIVE_PARENT_REFINEMENT` 역할. |

현재 선택 화면은 이 부모 ID와 정확히 분류된 후보 UID를 이용해 이전에 합쳐 보이던 L2 풀을 나눈다. 기존 제출 요청의 base 경로와 source 승인 재검증 경로는 보존한다. 따라서 표시 이름만 바꾼 상태가 아니며, 동시에 새 부모를 이유로 기존 승인 정보를 다시 써 넣지도 않는다.

**M2/M3의 2022 ACTIVE 연결이 이번 작업으로 완성되는 것은 아니다.** 기존 PT/TPL projection이나 exact curriculum binding이 없으면 기존 pending/unmaterialized 상태를 그대로 반환한다. 잘못된 다른 의미의 PT/TPL을 넣어 빈칸을 없애지 않는다. 해당 수리는 별도의 의미 근거와 add-only 바인딩 작업 범위로 진행한다.

## 7. 공식 6권 근거

출판사 `imath.kr` 공개 게시물에서 제공한 PDF를 기준으로 장 제목과 시작 페이지를 확인했다. 정본의 `sourceEvidence`에는 아래 URL·PDF SHA·크기·페이지 수·54개 장 제목과 시작 페이지가 들어 있다. `splitEvidence`는 기존 L3를 세 분리된 부모에 배치한 의미 근거이다. 문항·정답·해설 원문은 이 정본과 문서에 복사하지 않는다.

| 권 | 공식 게시물 / PDF | L2 수 | PDF SHA256 |
|---|---|---:|---|
| M1-1 | [[정답&정오표] 22개정 RPM 중학 수학 1-1](https://www.imath.kr/app/board/detail/keys?boardKey=c2a9f7e7-7a8d-4116-a275-6368eaefe990&itemKey=fcee70f3-cf63-4e5c-8714-104b009ed017) · [공식 PDF](https://file.airklass.biz/imath/9ac944e2-b53c-49d2-9358-18f39e940413/22%EA%B0%9C%EC%A0%95%20RPM%20%EC%A4%91%ED%95%99%20%EC%88%98%ED%95%991-1_%EC%A0%95%EB%8B%B5%EB%B0%8F%ED%92%80%EC%9D%B4.pdf) | 9 | `43394ba96b0a2266e264a85716f7dfa7711a1b350e8c70522fcb0420799414ce` |
| M1-2 | [[정답&정오표] 22개정 RPM 중학 수학 1-2](https://www.imath.kr/app/board/detail/keys?boardKey=c2a9f7e7-7a8d-4116-a275-6368eaefe990&itemKey=8ffc7225-13fa-4403-be48-03f540fdb5fd) · [공식 PDF](https://file.airklass.biz/imath/881fe4b1-a884-4f93-8348-cfb58542b5ce/22%EA%B0%9C%EC%A0%95_%EC%A4%91%EB%93%B1RPM1-2_%EC%A0%95%EB%8B%B5.pdf) | 9 | `69b5c9638dbb21d12081fd7d4f190cab8d3b546071ffd2cd3ad8eba0014ba898` |
| M2-1 | [[정답] 22개정 RPM 중학 수학 2-1](https://www.imath.kr/app/board/detail/keys?boardKey=c2a9f7e7-7a8d-4116-a275-6368eaefe990&itemKey=3f2b30e9-d900-476b-b890-3991ea15909c) · [공식 PDF](https://file.airklass.biz/imath/a50500ae-6f7a-4569-a614-e86904bf9af5/%5B%EC%A0%95%EB%8B%B5%5D%2022%EA%B0%9C%EC%A0%95%20RPM%20%EC%A4%91%ED%95%99%20%EC%88%98%ED%95%99%202-1.pdf) | 10 | `7dc7b73c3a2010a97111225b9d97411fda39d2920b1b7e2e4871467a84ca61c2` |
| M2-2 | [[정답&정오표] 22개정 RPM 중학 수학 2-2](https://www.imath.kr/app/board/detail/keys?boardKey=c2a9f7e7-7a8d-4116-a275-6368eaefe990&itemKey=380189a4-5f13-4f2b-9779-9f5f3d8f2187) · [공식 PDF](https://file.airklass.biz/imath/a331eac5-4a31-4429-8f7d-fb1a72601ae6/22%EA%B0%9C%EC%A0%95_RPM%20%EC%A4%91%ED%95%99%20%EC%88%98%ED%95%99%202-2_%EC%A0%95%EB%8B%B5%20%EB%B0%8F%20%ED%92%80%EC%9D%B4_%EC%9B%B9%EC%9A%A9%20%281%ED%8C%901%EC%87%84%29.pdf) | 10 | `a71730860bb80f23053c5caf9d2627acf81eff428952a56a92d6cbedfb7b09c7` |
| M3-1 | [[정답] 22개정 RPM 중학 수학 3-1](https://www.imath.kr/app/board/detail/keys?boardKey=c2a9f7e7-7a8d-4116-a275-6368eaefe990&itemKey=1fcae8cb-18d0-41e7-85af-c44f4a89de8e) · [공식 PDF](https://file.airklass.biz/imath/531d42aa-565a-4dc1-b594-9e8e2964e2ef/22%EA%B0%9C%EC%A0%95_RPM%20%EC%A4%91%ED%95%99%20%EC%88%98%ED%95%99%203-1_%EB%B3%B8%EB%AC%B8_%EC%A0%95%EB%8B%B5_%EC%9B%B9%EC%9A%A9%281%ED%8C%901%EC%87%84%29.pdf) | 9 | `2415655cd681ffa60da64c2c6fd114cc9f66ae9cad571cfb5e06de54ad38b8ab` |
| M3-2 | [[정답] 22개정 RPM 중학 수학 3-2](https://www.imath.kr/app/board/detail/keys?boardKey=c2a9f7e7-7a8d-4116-a275-6368eaefe990&itemKey=1543188f-53aa-4e88-a07f-3bd73bd7f756) · [공식 PDF](https://file.airklass.biz/imath/c0a0d193-5365-4af9-990b-8c8dfad97443/22%EA%B0%9C%EC%A0%95_RPM%20%EC%A4%91%ED%95%99%20%EC%88%98%ED%95%99%203-2_%EB%B3%B8%EB%AC%B8_%EC%A0%95%EB%8B%B5_%EC%9B%B9%EC%9A%A9%281%ED%8C%901%EC%87%84%29.pdf) | 7 | `2675a96f079d582fadc3d402df0aa960d29c5a8e6597a5b9555546679682fea6` |

원래 six-book 확인 packet SHA256은 `92f4282174d928b2430679aa6fd2ac1443030428c420532e1bb0961f687c3d5c`이며 `sourceEvidencePacket`에도 기록한다. M2-1 경계 확인 packet SHA256은 `f9535d7559e33b852e5561435fd5e8aeacd91a2eb105e7945866b3f5e5b8dfcc`이다. scratch packet 경로가 없어져도 운영 정본에 필요한 출처와 배치 근거가 남는다.

## 8. 재생성과 직접 영향 검증

정본 수정 후 공용 helper payload를 재생성하고, 아래 직접 영향 검사를 수행한다.

```bash
node archive/tools/meta-foundation/build-rpm-middle-toc.mjs
node archive/tools/meta-foundation/build-rpm-middle-toc.mjs --check
node --test archive/tools/meta-foundation/rpm-middle-toc.test.mjs archive/tools/meta-foundation/rpm-active-resolver.test.mjs
```

검사는 공식 6권 24/54 구성, locked master SHA, 326 leaf 전체 범위, L3/L4·crosswalk ID 보존, base/effective 왕복, 세 분리의 정확한 경계, broad parent 보류, nested bound RPM 읽기, 2015/고등 제외, 새 부모 입력의 base 저장과 기존 projection 상태 보존, 증거 tampering 및 잘못된 authority SHA의 거절을 확인한다.

Archive 2.0 UI·선택 풀·배포 검증은 이 단위 검사와 별개로 연결 소비자의 변경 범위에서 수행한다. 이번 부모 정비를 근거로 기존 시험지 R1/R2/R3 전체를 다시 실행하거나 모든 문항의 의미 검토를 완료했다고 기록하지 않는다. 개별 시험지 검토와 PR/main 마감은 원래의 시험지별 진행 기록에 이어서 남긴다.
