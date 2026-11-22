# 고1 1학기 기말 유사 다음 5종 — 이미지 시각검수 기록

**실제 검수 범위**: 기존 연결 SVG 20개를 독립 PNG로 렌더하여 5개 연락판으로 전부 육안 검토하고, 기출 원본 문제 이미지 7개를 함께 살펴 문항·수치·도형 맥락을 비교했다. 신규 SVG 엔진 렌더·lint·publish는 시행하지 않았다.

## 집계

| 시험지 | 문항 | 현재 연결 SVG | 원본 역할 격차 | JSON 초안 | 내용 보류 역할 |
|---|---:|---:|---:|---:|---:|
| 순천고 | 23 | 2 | 9 | 9 | 0 |
| 순천여고 | 23 | 8 | 5 | 6 | 0 |
| 팔마고 | 22 | 3 | 13 | 13 | 0 |
| 효천고 | 26 | 7 | 7 | 7 | 0 |
| 강남여고 유사1 | 24 | 0 | 16 | 3 | 13 |
| **합계** | **118** | **20** | **50** | **38** | **13** |

- **기존 연결 20개**: 현물 이미지 렌더 및 육안 확인 완료. 다음 표의 SG q22 해설 외에 확정적인 수학·도형 결함은 확인하지 못했다. 이 표현은 자동 검증 PASS가 아니다.
- **원본에 있는 역할 50개**: 2026 네 종 34개와 2025 강남여고 16개. 2026 기존 정식 플랜에서 EXEMPT로 판단한 역할도 포함되어 있어 격차=무조건 제작 수량이 아니다.
- **엔진용 새 패킷 38개**: 2026 격차 34개, 강남여고 문제용 3개, 순천여고 기연결 q22 해설 교체 1개. 강남여고 해설용 13개는 콘텐츠 보류.
- **강남여고의 심각한 내용 결함**: 24문항 전부 해설 본문이 실제 풀이가 아닌 일반 임시 문구. 정확한 대수 전개·증명 복원 이전에 관련 그림을 게시해서는 안 된다.

## 기존 연결 자산별 확인

| 학교 | 문항 | 역할 | SVG 경로 | 육안 상태 |
|---|---:|:---:|---|---|
| SC | 19 | P | `archive/assets/images/26_순천고_1학기_기말_고1_유사/q19-problem-engine-v3.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SC | 19 | S | `archive/assets/images/26_순천고_1학기_기말_고1_유사/q19-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 5 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q5-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 6 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q6-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 8 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q8-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 17 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q17-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 20 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q20-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 22 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q22-solution.svg` | **FAIL — 해집합 오표현, NJ-38 교체 필요** |
| SG | 23 | P | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q23-problem.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| SG | 23 | S | `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q23-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| PM | 3 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_유사/q3-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| PM | 4 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_유사/q4-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| PM | 6 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_유사/q6-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 4 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q4-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 5 | P | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q05-problem-readable-v2.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 8 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q8-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 13 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q13-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 22 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q22-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 24 | P | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q24-problem-readable-v2.svg` | VIEWED — 새 엔진 검증은 아직 없음 |
| HC | 24 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q24-solution.svg` | VIEWED — 새 엔진 검증은 아직 없음 |

## 확정 수학적 시각 결함 — 순천여고 22번 해설

- 기존 연결: `archive/assets/images/26_순천여고_1학기_기말_고1_유사/q22-solution.svg` (실제 출력에서 두 수직선 구간 표시를 확인).
- 첫째 부등식의 정수 범위는 `2 ≤ x ≤ 7`. 둘째 조건은 `x ≤ n−3` 또는 `x ≥ n`이므로, 중간의 정수는 빠진다.
- 예시 `n=6`일 때 **해집합은 {2,3,6,7}**이다. 기존 그림의 **연속구간 3~6**은 유효한 n의 예시 해집합이 될 수 없다.
- **NJ-38** 해설그림 교체 초안은 포함 2·3·6·7을 채운 점으로, 제외 4·5를 ×점으로 구분한다. 실제 렌더에서 ×와 점·라벨의 충돌을 검사해야 한다.
- 기존 SVG 파일은 이 배치에서 삭제·수정하지 않았다. 엔진 코덱스에서 대체 이미지를 먼저 검증하고 소스 연결을 갱신한다.

## 검증 판정의 한계

1. 이미지 육안 검수는 소스 문항/조건과 현재 파일의 모양을 읽는 것이고, JSON 초안이 스키마를 통과했거나 새 파일의 계산·크기가 정상이라는 뜻은 아니다.
2. 기존에 EXEMPT라고 기록한 역할은 문항 목적에 따라 면제 유지할 수 있다. 패킷은 해당 역할이 필요해졌을 때 쓸 수 있는 재검토 초안이다.
3. 강남여고는 정답 표시값이 수기 검산에서 맞더라도 24개 실제 해설이 없어 출판 품질 기준을 충족하지 못한다.
4. 최종 통과 조건: 정식 author/엔진 가이드 준수 → schema lint → 실제 SVG 렌더 → 문항 수학·조건 교차검수 → 육안 판독성 검수 → publish → 추적 문서 기록.
