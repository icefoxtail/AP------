# 26_왕운중_1학기_기말_중3_유사2: SVG 후속 제작·검수

- 23문항 × 발문/해설 = 46축. 문제용 23 EXEMPT(필수 조건 모두 본문에 기술), 해설용 BENEFICIAL 8(Q14, Q15, Q16, Q18, Q19, Q20, Q22, Q23), 해설용 EXEMPT 15. REQUIRED 0.
- 46개 plan 파일 중 제작용 8개, EXEMPT 판정 스텁 38개.
- 공식 `plan-lint --shallow`: 제작용 8/8 PASS (2026-11-25, Q14·15·16·18·19·20·22·23).
- 공식 전체 `plan-lint`: Q14부터 고정 글꼴 `.tmp/apmath-visual-engine/dependencies/NotoSansKR.ttf` 부재로 `ENOENT` 중단. 나머지 7개 전체 lint PASS 여부는 확인되지 않았다.
- `verify_similar_exam --phase=draft`: 16개 error (위 8건 각각 assetPath / engineEvidence 미연결), `DRAFT_PHASE` 경고. SVG 연결 전 단계이므로 정식 출고 PASS가 아니다.
- 후속: 위 8개 해설용 plan의 공식 엔진 렌더, PNG 시각 QA, 실제 assetPath·engineEvidence 연결 및 재검사. 검증되지 않은 image 또는 solutionImage 경로를 JS에 연결하지 않는다.
- 수학적 답과 필수 조건은 JS 텍스트만으로 완결된다. BENEFICIAL 렌더는 main-first 후속 처리다.
- 엔진 렌더·PNG 육안 QA는 NOT_RUN이다. 실제 글꼴 의존성을 해결하고 전체 lint를 재시도한 후 후속 검수한다.
