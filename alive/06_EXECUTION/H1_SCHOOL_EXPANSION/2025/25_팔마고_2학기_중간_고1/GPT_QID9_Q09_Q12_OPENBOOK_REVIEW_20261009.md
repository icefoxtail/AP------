# 2025 팔마고 Q09~Q12 공개답 수학·발문·Meta 검수 — 2026-10-09

- 대상: 2025 팔마고 고1 2학기 중간 원본 Q09~Q12 × A1~C3 = 36 distinct generated UID. 원본 Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76` read-only.
- 방식: 학생 발문·보기·풀이의 공개답 수학 추적과 학교식 질문 검토, Primary L3 필수사고·오답 유도경로·Meta·시각자료 필요성 대조. 제작자 셀프검수와 별도 GPT 검수이며 기출 R1/R2 blind-first 검사 수행을 뜻하지 않음.
- 검수 전 package blob: Q9=`70ae370ebaaac994981dddcd51ed0566640ee58d`, Q10=`319569943f1d4e7c8cd5c6e3abfe7c72f116bdca`, Q11=`95a8f7c6a2776e4f943a2e161af807d16da3890c`, Q12=`cd5fe2f20d83e91dbb9d77f255bd4bb827972b42`.
- 결과: 36/36 내용 검수 `GPT_OPEN_BOOK_REVIEW_PASS`, 수학 정답 오류 0, 해설 결론 충돌 0, 보기 누락 0, HOLD 0. 내용 KEEP 24 / **Meta REVISED 9 (Q09)** / **CHOICE_DISPLAY REVISED 3 (Q11 A1~A3)**. 발문·정답·해설 수학 내용 변경 0; Q11 A1~A3의 15개 보기 HTML `<br>`를 plain-text UI가 읽을 수 있는 실제 개행으로 교체하고 corresponding 오답 witness 값 12개 동기화.
- 구조: UID 36개 중복 0, 180/180 보기, 144/144 오답설명과 오답 witness 위치·번호 대응을 확인. 오답 144개 전부를 별도 독립 코드로 수치 재연산했다고 주장하지 않음.
- 독립 계산: Q10 9개 집합 진리표 × 8 membership assignments의 보기 45/45 평가값과 정답 유일 9/9. Q09/Q12 수치형 선택값 독립 산술 17/17 일치, Q09 B3 내분비 2:1 별도 확인. Q11 B2 k=1,2,3, C1 k=2,3,4,6,8,9,10,12, C2 a=1,2,3, C3 a=3,4,5 재열거.
- Q10 SVG A1/A2/A3/B2: clip/mask 영역을 코드에서 직접 확인하여 수학적 shade mask 64/32/8/96과 대응. **실제 브라우저 렌더 NOT_TESTED**. Q10 나머지는 발문 자체에 집합 조건 제시.
- 수리 Q09 전 9 UID: `meta.subUnitKey`를 잘못된 `H22-C2-01-COORDINATE_METRIC`에서 current RPM crosswalk(H1-RPM-208/209)의 `H22-C2-01-GEOMETRY_APPLICATION`으로 교정, compiled master의 공식 라벨 `subUnit:"도형의 방정식 활용"` 보강. Q09 C3의 `t>0` 양수조건은 existing canonical `COND_POSITIVE`로 연결. RPM LOCKED/원본 변경 없음.
- Q11 A1~A3: 실제 학생 Consumer UI의 `textContent` + `white-space:pre-wrap` 계약에 맞춰 보기 15개의 `<br>` 태그를 `\\n`으로 교체. 학생 표시상의 2줄 유지, 조건·수식·정답 의미 불변. 원본 source fingerprint의 `<br>` provenance는 그대로 보존.
- Q11 원본 ⑤ 조건의 미선언 변수 `z`는 새 Generated Q11 문항들에는 복제되지 않아 Generated 결함으로 승계하지 않음.
- 원본 9~12 Primary L3: 삼각형의 무게중심/여집합과 차집합/필요조건·충분조건/원의 접선 유지. Q12 Generated EXT-L4는 RPM 공식 L4로 주장하지 않음.
- 출시 분리: 신규 36 UID의 Source→Meta→Consumer→Index 영구 저장 및 main·Chrome 기술 게이트는 아직 실행 전. 이 문서는 CONTENT REVIEW 판정이며 `MAIN_DONE`이나 Chrome PASS가 아님. 기존 승인 Q01~Q08와 시험지 원본은 보호.

## 문항별 판정
| 문항 | UID | 답 | 검수 판정 | 확인값/핵심 |
|---|---|---|---|---|
| Q09-A1 | `ALITE-PALMA25-2MID-Q09-A1` | ② | META_REVISED | 7 |
| Q09-A2 | `ALITE-PALMA25-2MID-Q09-A2` | ⑤ | META_REVISED | 5 |
| Q09-A3 | `ALITE-PALMA25-2MID-Q09-A3` | ① | META_REVISED | 8 |
| Q09-B1 | `ALITE-PALMA25-2MID-Q09-B1` | ④ | META_REVISED | p=3 |
| Q09-B2 | `ALITE-PALMA25-2MID-Q09-B2` | ③ | META_REVISED | 9 |
| Q09-B3 | `ALITE-PALMA25-2MID-Q09-B3` | ② | META_REVISED | 2:1 |
| Q09-C1 | `ALITE-PALMA25-2MID-Q09-C1` | ④ | META_REVISED | 4/3 |
| Q09-C2 | `ALITE-PALMA25-2MID-Q09-C2` | ① | META_REVISED | 3√13 |
| Q09-C3 | `ALITE-PALMA25-2MID-Q09-C3` | ⑤ | META_REVISED | 16 |
| Q10-A1 | `ALITE-PALMA25-2MID-Q10-A1` | ② | KEEP | mask64 |
| Q10-A2 | `ALITE-PALMA25-2MID-Q10-A2` | ⑤ | KEEP | mask32 |
| Q10-A3 | `ALITE-PALMA25-2MID-Q10-A3` | ① | KEEP | mask8 |
| Q10-B1 | `ALITE-PALMA25-2MID-Q10-B1` | ④ | KEEP | mask176 |
| Q10-B2 | `ALITE-PALMA25-2MID-Q10-B2` | ③ | KEEP | mask96 |
| Q10-B3 | `ALITE-PALMA25-2MID-Q10-B3` | ② | KEEP | mask112 |
| Q10-C1 | `ALITE-PALMA25-2MID-Q10-C1` | ④ | KEEP | mask84 |
| Q10-C2 | `ALITE-PALMA25-2MID-Q10-C2` | ① | KEEP | mask212 |
| Q10-C3 | `ALITE-PALMA25-2MID-Q10-C3` | ⑤ | KEEP | mask144 |
| Q11-A1 | `ALITE-PALMA25-2MID-Q11-A1` | ① | CHOICE_DISPLAY_REVISED | ① |
| Q11-A2 | `ALITE-PALMA25-2MID-Q11-A2` | ④ | CHOICE_DISPLAY_REVISED | ④ |
| Q11-A3 | `ALITE-PALMA25-2MID-Q11-A3` | ② | CHOICE_DISPLAY_REVISED | ② |
| Q11-B1 | `ALITE-PALMA25-2MID-Q11-B1` | ⑤ | KEEP | a>-1 |
| Q11-B2 | `ALITE-PALMA25-2MID-Q11-B2` | ③ | KEEP | k=1,2,3 |
| Q11-B3 | `ALITE-PALMA25-2MID-Q11-B3` | ④ | KEEP | a=1 |
| Q11-C1 | `ALITE-PALMA25-2MID-Q11-C1` | ① | KEEP | k=2,3,4,6,8,9,10,12 |
| Q11-C2 | `ALITE-PALMA25-2MID-Q11-C2` | ③ | KEEP | a=1,2,3→합6 |
| Q11-C3 | `ALITE-PALMA25-2MID-Q11-C3` | ② | KEEP | a=3,4,5 |
| Q12-A1 | `ALITE-PALMA25-2MID-Q12-A1` | ① | KEEP | 3 |
| Q12-A2 | `ALITE-PALMA25-2MID-Q12-A2` | ④ | KEEP | 5/2 |
| Q12-A3 | `ALITE-PALMA25-2MID-Q12-A3` | ② | KEEP | 4 |
| Q12-B1 | `ALITE-PALMA25-2MID-Q12-B1` | ⑤ | KEEP | 40 |
| Q12-B2 | `ALITE-PALMA25-2MID-Q12-B2` | ③ | KEEP | 10 |
| Q12-B3 | `ALITE-PALMA25-2MID-Q12-B3` | ④ | KEEP | 8 |
| Q12-C1 | `ALITE-PALMA25-2MID-Q12-C1` | ① | KEEP | 25/4 |
| Q12-C2 | `ALITE-PALMA25-2MID-Q12-C2` | ③ | KEEP | 6 |
| Q12-C3 | `ALITE-PALMA25-2MID-Q12-C3` | ② | KEEP | 88 |

## 기술 마감 남은 범위
- Q09~Q12 Generated source+metadata 및 student Consumer/index 36 UID 등록, Q10 SVG 4개 자산 연결.
- main 원격 SHA/readback, Meta L3/L4/CrossConcept/Condition parity 및 Chrome/동등한 학생용 실제 출력 테스트.
- 실제 미실행을 품질 검수 `PASS`로 갈음하거나 기술 PASS로 위조하지 않음.
