# 엔진 공백 목록 — 학원 라인 (고2 2학기 기말 · 중3 2학기 기말)

중등·고1 목록은 [ENGINE_GAPS_MIDDLE.md](ENGINE_GAPS_MIDDLE.md)에 있다. 엔진 라인은 두 파일을 함께 본다.

규칙: 지시선·라벨 위치·패널 같은 기존 옵션을 모두 시도한 뒤에도 막힌 것만 적는다. 문항마다 시도한 옵션과 오류 코드를 남긴다. 해결되면 줄 끝에 `해결: PR #번호`를 붙인다.

## 그래프 계열

- **무리수 계수 삼차(√6) / 극값 없는 단조 삼차**
  - 오류: polynomial은 `LAYOUT_INVENTORY_INCOMPLETE:formula`, piecewise는 `PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED`·`EQUAL_UNIT_SCALE_MISMATCH`.
  - axisScale로 맞추면 렌더는 통과하지만 짧은 토막만 그려진다.
  - 시도: 영역 / hideLabels / 식 직접 지정 / 곡선만.
  - 사례: 25 매산여고 수2 Q23, 25 순천 수2 Q10. 두 문항 모두 구형 그림에 정답이 드러나 있어 교체가 시급하다.
- **piecewise-polynomial 창 지정 불가**
  - 원점 (0,0)을 강제로 포함한다(`graph_framing.py`의 `points=[(0,0)]+…`).
  - `displayWindow`는 rational 전용이다.
  - 그래서 원점을 뺀 확대 창이 필요하다.
  - 사례: 22 매산 수2 Q12. 극대 7과 극소 27/4의 간격 0.25가 보이지 않는다.
- **rational 계열 차수 제한**
  - 일차/일차와 상수/일차만 받는다.
  - 사례: 22 매산 수2 Q18. g(x)=x³−8x²+16x−16/x
- **3패널 합성 차수 제한**
  - 이차까지만 받는다. 시도한 composite-panels-v1은 `COMPOSITE_PLAN_INVALID`로 거절됐다.
  - 사례: 25 매산 수2 Q04. 위치(삼차)·속도(이차)·가속도(일차)를 한 그림에 그려야 한다.
- **piecewise 계열에서 `nameLabel`·callout 거절**
  - 곡선 이름이 곡선에서 떨어진다.
  - 사례: 25 매산 수2 Q10·Q16. 집 라인도 같은 증상이 있다.
- **piecewise 영역 중앙 값 라벨용 지시선(곡선 밖 점) 없음**
  - 사례: 22 순천 확통 Q09 (3/8)
- **referenceLines 옵션 없음**
  - 띠 라벨 끄기, 점 이름 숨김(hideName)이 안 된다.
  - 사례: 22 금당 수2 Q08

## 확률·통계

- **정규분포 영역 칠하기에 팔레트 색 옵션 없음**
  - tone 1·2 회색만 된다. 색 구분 최우선 원칙과 충돌한다.
  - 사례: 21 효천 확통 Q18. 지금은 진하기 두 단계로 우회한다.
  - 해결: PR #1627 (`shades` 항목의 `color`: BLUE·WARM·GREEN·ROSE·VIOLET, tone과 함께 못 씀)
- **수직선 점 최대 8개** (`NUMBER_LINE_POINTS_INVALID`)
  - 사례: 19 금당 확통 Q21. 10개 위치가 필요하다.
- **TREE 라벨**
  - 쌓임 옵션이 없다. 사례: 19 금당 확통 Q07 (24/25, 1/100이 근접)
  - 노드·가지 라벨이 가는 비수식 글꼴이다. 사례: 20 매산 확통 Q11
- **numberLineCaption 글꼴**
  - 예: u=(X−m)/k가 가는 일반 글꼴로 나온다.
  - 사례: 20 매산 확통 Q17
- **벤 집합 라벨이 원 선에 닿음**
  - 사례: 22 순천 확통 Q18 (F)

## 도식

- **경우의 수 도식 primitive 없음**
  - 사례: 24 효천 고1 2학기 기말 구형 SVG 9개
  - 필요한 도식: 소인수 지수 선택 상자, 고정 슬롯 배열, 그룹 선택 짝짓기, 자리 배열 패턴, 이중계산 비교 패널 등

## 해결됨

- 문자열 문항 id(q01 …) 시험지의 캡처 거절(`ORDINAL_NOT_IN_BANK`) — 해결: PR #1597
- 캡처 시간 제한 조절(`GEOMETRY_CAPTURE_TIMEOUT_MS`) — 해결: PR #1595
