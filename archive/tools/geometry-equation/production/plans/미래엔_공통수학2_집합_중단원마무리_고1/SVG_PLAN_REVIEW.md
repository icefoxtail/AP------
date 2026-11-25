# 미래엔 공통수학Ⅱ 집합 — 문제·해설 2축 판정 (q01–q08)

- 원문 JS: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_집합_중단원마무리_고1/미래엔_공통수학2_집합_중단원마무리_고1.js`.
- 이번 배치 **8문항/16축**; q09–q12는 후속. 신규 해설 집합 plan 4개(문제 그림 정답 비노출·면 채움 없음).
- **CONTENT_ERROR 별도:** q08 원문 해설의 결과 `−1,0,4`는 `x=6`을 누락했다. x=6이면 A={48,4,6}, B={6}이므로 A∩B=B가 참이다. 실제 정수 해는 **−1,0,4,6**. 이번 변경은 계획 전용이라 원본 JS/답은 수정하지 않으며 반드시 후속 내용 수리 필요.

| qid | 문제축/개별 근거 | 해설축/개별 근거 | capability | 계획 경로 | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 집합 정의의 판단 문장 | EXEMPT — 기준의 명확성만으로 ×·○·× 판정 | — | — | N/A | N/A |
| q02 | EXEMPT — 원소나열법 문제의 유한·식 조건 | EXEMPT — 21의 약수 및 (x−1)(x−6)=0의 열거 | — | — | N/A | N/A |
| q03 | EXEMPT — 두 쌍의 집합이 원소로 규정 | BENEFICIAL — A⊂B, B⊂A의 반대 포함 방향을 두 패널로 대비 | composite-panels-v1 / set-diagram-figure-v1 | `q03-solution.plan.json` | PASS/PASS | PASS: 첫 포함 A⊂B, 두 번째 B⊂A 및 원소 소속 |
| q04 | EXEMPT — 집합별 원소 수 세 값 완결 | EXEMPT — n(A∩B)=18+23−30=11의 계산 하나로 충분 | — | — | N/A | N/A |
| q05 | EXEMPT — U,A,B의 모든 원소 조건 제시 | BENEFICIAL — U=1~10을 A∩B, A만, B만, 둘 다 밖의 영역으로 배열 | set-diagram-figure-v1 | `q05-solution.plan.json` | PASS/PASS | PASS: 총 10원소 소속·교집합 1,5,10 |
| q06 | EXEMPT — U와 A 유한집합 조건 완결 | BENEFICIAL — A의 바깥 원소 {3,5}만으로 서로소 부분집합을 만듦 | set-diagram-figure-v1 | `q06-solution.plan.json` | PASS/PASS | PASS: A={1,2,4}, U−A={3,5} |
| q07 | EXEMPT — A,B와 X의 집합 연산 조건 완결 | BENEFICIAL — B−A={12,16,20}을 실제 겹침 영역과 분리 | set-diagram-figure-v1 | `q07-solution.plan.json` | PASS/PASS | PASS: A만 1,2; 공통 4,8; B만 12,16,20 |
| q08 | EXEMPT — 집합식의 원소 조건 자체는 완결 | EXEMPT + CONTENT_ERROR — 원본 해설이 x=6을 잘못 제외; 도식보다 원문 수리 선행 | — | — | N/A | N/A (원문 수리 필요) |

- 공식 `plan-lint.cjs --shallow` 및 full: 각각 **4/4 PASS**.
- 각 도안의 `diagram.elements[].in`, `subset` 등 원소·포함·겹침을 독립 원본 수치와 비교해 **DRAWN_FEATURE_PARITY 4/4 PASS**. 색칠 없음.
- **q08 CONTENT_ERROR는 엔진 미지원이 아니라 원문 수학 오류**이며, 신규 plan 미작성/EXEMPT 판단으로 덮지 않는다.
- 실제 SVG 렌더·PNG/학생화면/A4 QA·JS 링크/게시: **NOT_RUN**.
