# Batch ledger

| Batch | Primary L2 | Source qids | Creator | Candidate count | Independent review | Supply status |
|---|---|---|---|---:|---|---|
| B01 | 원의 방정식 | 3, 6, 12, 19, 22 | create_b01_general | 6 | 6 content PASS; q22 difficulty Meta recheck PASS | q12/q19 EXT-L4 pending promotion; four existing-mapped candidates eligible |
| B02 | 집합의 연산 | 8, 10, 16 (source HOLD), 20 | create_b02_general | 3 | q8/q20 PASS; q10 HOLD | q10 actual SVG engine render pending |
| B03 | 명제 | 2, 11 (source HOLD), 14, 21 | create_b03_general | 4 | 4 PASS | content PASS; existing mapped fields retained |
| B04 | 도형의 이동 | 7, 15, 17 | create_b04_transformations | 3 | 3 PASS | content PASS; prompt/choice freeze parity PASS |
| B05 | 평면좌표 | 4, 9, 18 | create_b05_coordinates | 3 | 3 content PASS | q4 EXT-L4 pending promotion; q9/q18 existing RPM-backed |
| B06 | 직선의 방정식 | 5, 23 | create_b06_lines | 3 | 3 PASS | content PASS; no visual required |
| B07 | 집합의 뜻과 포함 관계 | 1, 13 | create_b07_set_membership | 5 | 5 content PASS | q13 BP03 projection binding HOLD; other four active mappings recorded |

Source denominator: 23/23. q11 and q16 are source-level HOLD and generated zero candidates. Candidate denominator: 27. Independent content review: PASS 26 / REJECT 0 / HOLD 1 (B02 q10 render). Supply HOLDs: q10 render, three EXT-L4 candidates, one projection binding. Content PASS and supply eligibility are separate axes.


## CURRENT — GPT 직접 문항 교육 목적·편집 품질 재평가 (2026-10-09)
**범위 27/27:** Git main의 7배치 후보 문서. 기존 REVIEW 26 PASS/1 SVG HOLD는 **변경 전 역사적 수학검수**이며 새 문항의 clean-blind/re-render PASS를 뜻하지 않는다. GPT가 원본·학생용 발문·보기·해설을 정적 비교하여 다음과 같이 *교육 목적*을 분류했다. 최종 student supply gate는 별개다.

| batch | candidate | 3×3 학습 목적 | 직접 편집 품질 판정 | 학생 공급 |
|---|---|---|---|---|
| B01 | 0001 | A 반복 숙달 | 보존: 원 중심 조건 | HOLD: projection |
| B01 | 0002 | A 반복 숙달 | 보존: 반지름 조건 역산 | HOLD: projection |
| B01 | 0003 | C 실전 평가 | 보존: 현 길이 조건·정수 경계 | HOLD: projection |
| B01 | 0004 | B 사고 확장 | 보존: 접점 현의 거리 역산 | HOLD: EXT L4 재판정 |
| B01 | 0005 | C 실전 평가 | 보존: 호·교점 개수·중복 판단, 가독성 유의 | HOLD: EXT L4 재판정 |
| B01 | 0006 | A 반복 숙달 | **한국어 해설 보정**: 외접원 기본형 | HOLD: projection |
| B02 | Q08 BP01 | A 반복 숙달 | 보존: 배수 집합의 대칭차 | HOLD: projection |
| B02 | Q10 BP01 | B 사고 확장 | 수학·정적 SVG 보존 | **HOLD: 필수 SVG 실렌더 미실행** |
| B02 | Q20 BP01 | C 실전 평가 | 보존: 집합 신청수 극값·가능성 | HOLD: projection |
| B03 | Q02 P01 | A 반복 숙달 | **조건의 한국어·수식 표현 보정** | HOLD: projection |
| B03 | Q02 P02 | A 반복 숙달 | **조건의 한국어·수식 표현 보정** | HOLD: projection |
| B03 | Q14 P01 | B 사고 확장 | **이차함수 볼록 방향·발문 보정** | HOLD: projection |
| B03 | Q21 P01 | C 실전 평가 | 보존: 조건의 진리집합·일방 함의 | HOLD: projection |
| B04 | Q07 C01 | B 사고 확장 | 보존: 이동 역추적 | HOLD: projection |
| B04 | Q15 C01 | B 사고 확장 | 보존: 순서가 다른 이동 비교 | HOLD: projection |
| B04 | Q17 C01 | B 사고 확장 | 보존: 대칭축 역산 | HOLD: projection |
| B05 | Q04 C01 | A 반복 숙달 | **신규 EXT-L4 주장 철회, 수치 인스턴스로 보존** | HOLD: projection 재분류 |
| B05 | Q09 C01 | B 사고 확장 | 보존: 무게중심에서 내분비 역산 | HOLD: projection |
| B05 | Q18 C01 | C 실전 평가 | 보존: 각 이등분선·무게중심·면적 역산 | HOLD: projection |
| B06 | Q05 C01 | A 반복 숙달 | **영어 해설 → 한국어 보정** | HOLD: projection |
| B06 | Q05 C02 | A 반복 숙달 | **영어 해설 → 한국어 보정** | HOLD: projection |
| B06 | Q23 C01 | C 실전 평가 | **영어 해설 → 한국어·절댓값 전해 검산** | HOLD: projection |
| B07 | Q01 BP01 | B 사고 확장 | **선택지의 명제 형식에 맞춰 발문 수정** | 기존 학생용 4개 중 1개 수정 |
| B07 | Q01 BP02 | A 반복 숙달 | 보존: 중근의 집합 원소 중복 제외 | 기존 학생용 4개 중 1개 |
| B07 | Q13 BP01 | A 반복 숙달 | 보존: 부분집합 포함·같음 | 기존 학생용 4개 중 1개 |
| B07 | Q13 BP02 | B 사고 확장 | 보존: 매개변수 포함 범위 | 기존 학생용 4개 중 1개 |
| B07 | Q13 BP03 | C 실전 평가 | 보존: 크기 조건이 있는 부분집합 순서쌍 | HOLD: candidate-specific projection |

**교육 목적 집계:** A 11, B 9, C 7 = 총 27. 3×3의 목적 분류는 ALIVE 런타임 MODE나 신규 semantic Blueprint 승인 증거와 다르다.
**편집 품질 수정 문서:** B01 0006, B03 Q02 P01/P02·Q14, B05 Q04, B06 Q05 C01/C02·Q23, B07 Q01 BP01 = 후보 MD 9개. 
**폐기 판단:** 이번 27개 중 수학/출제목적상 반드시 폐기해야 한다는 근거가 확정된 것은 없음. 약한 문항도 A 반복 숙달로 유효한 경우 보존하되, 중복을 독립 신규 유형으로 세지 않음. 실렌더·active projection 미완료 문항은 Consumer에 출시하지 않는다.
**학생 공급 정합성:** 등록 4개 / 공급 보류 23개. B07 기존 4개는 생산 JS·Consumer shard·index 수정까지 수행했으나 **수정 후 Chrome 재조회 미실행**. 과거 Chrome PASS를 수정된 바이트의 새 PASS로 가장하지 않는다.
