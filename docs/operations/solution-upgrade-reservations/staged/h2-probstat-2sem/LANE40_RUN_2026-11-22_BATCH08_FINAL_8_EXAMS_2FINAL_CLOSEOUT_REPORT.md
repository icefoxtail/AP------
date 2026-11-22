# lane40 제8회차 — 고2 확률과 통계 2학기 기말 잔여 8장 전수 감사·원본 목록 마감 보고

- 기준: **2026-11-22 KST**. 원본 `icefoxtail/AP------` 저장소 `main`, 전용 감사 MD 브랜치 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- **잔여 8/8 시험지 · 170/170문항**의 JS content·choices·answer·기존 solution 전문 보존 및 독립 수학 검산 완료. **KEEP 157, UPGRADE 13, UNREAD 0**.
- 원본문제 PNG **고유 13개/참조 13회** GitHub에서 실제 실물 다운로드·직접 육안 확인. `assets/images/`에 6개, `archive/assets/images/`에 7개가 나뉘어 있었음. 기존 학생풀이 SVG **99개 경로** 확인, 별도 SVG 렌더/Golden/Negative는 **NOT_RUN**.
- 시험지별 감사 MD **8개 개별 GitHub commit** 후, 동일한 브랜치에서 다시 `fetch_file`하여 **8/8 전문 완전일치**, Q 섹션 **170/170**, UPGRADE 섹션 **13/13** 확인.

| # | 원본 시험지 | 문항 | KEEP | UPGRADE | PNG | 풀이 SVG | 감사 전문 MD | commit SHA | MD blob SHA |
|---:|---|---:|---:|---:|---:|---:|---|---|---|
| 1 | 21_효천고_2학기_기말_고2_확률과통계 | 24 | 24 | 0 | 2 | 14 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2021_hyocheon_2final_DEEP_AUDIT.md) | `1a8183e0b41c` | `5f99b278d365` |
| 2 | 20_매산여고_2학기_기말_고2_확률과통계 | 23 | 14 | 9 | 0 | 12 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2020_maesanyeo_2final_DEEP_AUDIT.md) | `ab3264e72bbc` | `d89a5e87a1c4` |
| 3 | 20_매산고_2학기_기말_고2_확률과통계 | 19 | 18 | 1 | 2 | 9 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2020_maesan_2final_DEEP_AUDIT.md) | `3805725f531c` | `e4038857716a` |
| 4 | 2019_매산고_2학기_기말_고2_확률과통계 | 19 | 19 | 0 | 5 | 10 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_maesan_2final_standalone_DEEP_AUDIT.md) | `2671817ec9b8` | `612c61418b2a` |
| 5 | 19_순천고_2학기_기말_고2_확률과통계 | 21 | 21 | 0 | 1 | 17 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_suncheon_2final_DEEP_AUDIT.md) | `8d4bebfe9a32` | `546a54777947` |
| 6 | 19_복성고_2학기_기말_고2_확률과통계 | 20 | 18 | 2 | 1 | 11 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_boksung_2final_DEEP_AUDIT.md) | `5753e562ea08` | `12f811cf8a9b` |
| 7 | 19_매산여고_2학기_기말_고2_확률과통계 | 22 | 21 | 1 | 0 | 14 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_maesanyeo_2final_DEEP_AUDIT.md) | `dfde6ce9ed43` | `3e1ec7555c74` |
| 8 | 19_금당고_2학기_기말_고2_확률과통계 | 22 | 22 | 0 | 2 | 12 | [감사 MD](https://github.com/icefoxtail/AP------/blob/work/solution-upgrade-lane-40-probstat-2sem-20261122/docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2019_geumdang_2final_DEEP_AUDIT.md) | `1759c6c5acd8` | `ba7c1ef9c888` |

## 수정 검토 13건 — 원본 보존, 학생용 대체 문항/풀이 분리

1. **2020 매산여고 Q07/Q09/Q10/Q13/Q15/Q17/Q18 (7건):** 원본 HTML 표의 첫 행 제목 `P(0≤Z≤z)` 아래에는 실제로 z값이 적혀 있고, 둘째 제목 `z` 아래에는 확률 면적이 적혀 있는 **정규표 행 제목 역전사**를 발견했다. 두 제목만 바꾸면 해당 7문항의 기존 정답은 모두 유지된다. 각 Q별로 정상 표 읽기와 **완전한 원문 학생풀이**를 감사 MD에 병기.
2. **2020 매산여고 Q14 (1건) — 잘못된 95% 신뢰도 임계값으로 자연수 개수 불일치:** 원문 `P(0≤Z≤2)=.475`는 실제 .4772이므로 95% z는 1.96이다. 진짜 95%로 길이 조건을 풀면 **n=16…61, 46개**인데 원답은 가상 z=2에 따른 **49개**. 보기와 표까지 포함한 수정안 작성.
3. **2020 매산여고 Q23 (1건) — `√30=5`라는 중대한 근삿값 오류:** `√30≈5.4772`이며 원본문의 잘못된 대입으로 95% 신뢰구간을 `[4.02,5.98]`로 과도하게 좁혔다. 기존 학교식 표본분산을 유지해 계산하면 **약 [3.93,6.07]**. 단서와 서술형 정답 수정안 제시.
4. **2020 매산고 Q19 (1건) — '실수 신뢰도 최댓값'과 표값 근사 혼용:** 90%의 실제 z≈1.6448536에서 길이비 12/11의 진짜 실수 최대 신뢰도는 **약 92.7248%**. 원답 **93%**는 정수 근사표 풀이로만 도출되며 정확 부등식은 만족하지 않는다. 문제에서 근삿값을 묻도록 하거나 정확 실수 답을 채점하도록 수정해야 함.
5. **2019 복성고 Q13 (1건) — 정규표 수치 오기:** z=1.84와1.86 행에 적힌 `.460,.465`는 실제 `.4671,.4686`과 다름. 사용된 z=1.88의 면적 .470은 적합한 근사여서 **기존 94% 정답은 유지**, 표 일부 교정 필요.
6. **2019 복성고 Q17 (1건) — 서술형 비유일해:** 원문 정상분포 조건 `Φ(6/σ)−Φ(2/σ)=.2417`은 양의 실수 σ에 대해 **두 해(약 3.6385, 4.0065)**를 가진다. 원해설 `σ=4` 단정은 추가 조건 없이 불가능. 모표준편차 양의 정수와 표 반올림 계산 조건을 추가하면 학교식 답 `a=1/4,b=−11/4`를 유지할 수 있음. 수정문·수학검산·학생용 해설 전문 수록.
7. **2019 매산여고 Q10 (1건) — 실물 표 정규면적 오류 및 정답 변경:** z=.5/1/1.5/2의 원본 면적 `.20,.35,.43,.48`은 실제 `.1915,.3413,.4332,.4772`로 고쳐야 한다. `S~N(60,16)`, `P(S≥64)=P(Z≥1)`이므로 원답 `0.15`가 아닌 **0.1587**. 보기도 함께 교정해야 한다.

모든 UPGRADE는 해당 문항의 **원문 조건과 오류 영향, 교정 문제·표·보기, 수정 후 학생 풀이와 정답, SOURCE_FIDELITY_HOLD**를 분리 기재했다. 원본을 슬쩍 고치거나 운영 출고를 승인하지 않았다.

## 그림 및 독립 수학 교차검산

- **2021 효천고 Q03/Q23:** 평균 a,b의 높고 좁은 정규밀도 곡선과 원본 공의 1:2:5 숫자 개수 그림 판독; 원문 ㄱㄴ, 복원 합200회 `μ=500,σ=10`에서 무보정 z2 확률 .0228 재확인.
- **2020 매산고 Q05/Q11:** 꼭짓점 (2,k),(6,0)의 삼각형 밀도에서 `P(4≤X≤6)=1/6`; 동심원 반지름5·3·2의 음영 고리 면적비 1/5에서 총점 표준편차 **28** 재계산.
- **2019 매산고 Q07/Q13/Q15/Q18/Q19:** 원본 z표 z1/2/3=.3413/.4772/.4987, 중심10 정규음영 [5,15], 두 삼각형 밀도와 확률분포표, 비교 정규곡선 및 곡선 표, 직선·이차함수 판별식8a−23의 그림/수치 상호 대조.
- **2019 순천고 Q19:** 사분원 2개, 선분, 양쪽 삼각형의 실물 면적에서 `r²=2/(π+6)`, `P(|X|≤r)=(π+4)/(π+6)` 재확인.
- **2019 복성고 Q08:** 구간0~4의 삼각 밀도 꼭짓점(3,a) 실물 확인, `P(1≤X≤3)=2/3`.
- **2019 금당고 Q02/Q03:** 양옆 2석·상하 3석인 직사각 탁자 실물에서 `10!/2` 반회전 동치 확인, 점수1/2/3인 원판의 5개 화살 경우 17개 전수 분류. Q18은 명칭 없는 (3,2,2) 팀 분할 경우 **66**을 전체 배정 열거로 교차 검산.
- 정확 표준정규 함수의 참값과 비단조 방정식 뿌리, 원본 이항·정규근사 계산을 별도 도구로 확인. 과거 2final의 2025 제일고 Q21 '정규근사144 / 정확 이항164' 분기 역시 기존 감사 MD에 유지.

## 기말 전수 마감 상태 — 23/23장

- 원본 `archive/exams/original/high/h2/2final/`의 `확률과통계` 기말 JS 원본 **23개를 모두 재열거**했고, 2019/2020 별도 파일과 2025 제일고 `_기출.js`를 포함해 누락없이 처리했다.
- 기말 1차: **5장 116문항**, 2차: **5장 110문항**, 3차: **5장 111문항**, 최종: **8장 170문항**. 따라서 **기말 23장/507문항 전 문항 READ_EVIDENCED; 잔여 시험지 0장, 잔여 문항 0개**.
- 기말 문항 상태 총계: **KEEP 480 / UPGRADE 27** (1차0, 2차8, 3차6, 최종13). 수정안 27건은 원본에 자동 반영되지 않음.
- 앞서 완료된 2학기 중간 **21장/463문항**은 그대로 보존. 중간+기말 통합 **44장/970문항 감사 완료**.
- 이 라인의 **고2 확통 2학기 중간·기말 '원본 기출 해설 심층 감사 MD' 범위는 전수 완료**. `next_exam=NONE; UNREAD=[]; EXAM_CORPUS_AUDIT_COMPLETE`. 다른 과목·학기·유사/유형으로 자동 이동하지 않는다.
- **엄밀한 완료 범위:** 모든 원문 JS·보기·정답·원해설·PNG·SVG·main **무변경**; 감사/수정제안 MD만 전용 브랜치에 신규 커밋. 원본 인쇄 PDF 대조, 원해설 SVG 렌더/Golden/Negative, 학생 UI, 수정안의 JS 적용 및 운영 병합, 공유 claims 갱신은 별도 **NOT_RUN / SOURCE_FIDELITY_HOLD_OPEN**. 수학 감사 전수 완료와 운영 배포 PASS를 혼동하지 않는다.
