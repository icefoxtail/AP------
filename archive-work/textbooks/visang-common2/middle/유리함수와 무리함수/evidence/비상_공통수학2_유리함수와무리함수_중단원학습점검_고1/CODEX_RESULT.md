# CODEX_RESULT — 유리함수와 무리함수 중단원 학습 점검

상태: 로컬 산출물 준비 완료. 통합 provider/V3 검수와 승격은 대기 중이다.

정본 파일은 `archive-work/textbooks/visang-common2/middle/유리함수와 무리함수/js/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1.js` 한 개이며, `assets/images/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1/`에 자산, `evidence/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1/`에 검증 자료를 두었다. candidate/lifecycle 경로와 중복 JS는 만들지 않았다.

원본 문제는 physical pp.35–36, 교과서 인쇄 pp.127–128이며 문항 분모는 12개다. 1–4번은 p.127, 5–12번은 p.128이다. 정답서 physical p.14에는 1번 답이 시작되고, 2–12번의 공식 풀이가 p.15에서 이어진다(정답서 인쇄 pp.155–156). 따라서 p.14만을 정답 풀이 전체의 근거로 볼 수 없다는 페이지 매핑 정정을 CURRENT 교과서 작업 원장에도 남겼다.

각 문항의 content/choices, 답, 독립 풀이와 단원·세부단원·문항 유형 태그를 채웠다. 문제 문구 parity 12/12 및 공식 답 crosswalk 12/12를 확인했다. 2025년 고1 2학기 중간고사 매산여고·효천고·순천여고 샘플의 1·5·9번 해설을 calibration 근거로 기록했다.

시각자료는 q02/q04 해설 그래프 SVG 2개, q12 교점 기준 SVG 1개, q08 원문 그래프 crop 1개다. item별 benefit 판정은 4 required, 8 exempt, 0 unresolved다. `q08_source-graph.png`는 문제 PDF 36쪽의 원문 그래프 crop이며, 문제 PDF와 정답서 PDF 원본은 작업 폴더에 넣지 않았다.

`node --check`, VM 로드·스키마·ID·태그·세부단원, source-freeze와의 exact content/choices 비교, 공식 answer crosswalk, 자산 경로, visual rule manifest hash, 렌더 캡처 존재 검사 등 static validation 13/13 PASS다. Archive `engine.html`에서 exam/sol/ans 각각 desktop/mobile 총 6/6 PASS를 캡처했다. 화면에서 12개 문항/답 행, MathJax, 이미지 디코딩을 확인했고 미렌더 수식·broken image·console/page/request 오류와 화면 overflow는 관찰되지 않았다.

관련 rule-pack의 버전·bytes·SHA 기록 및 preflight는 PASS다. Provider/V3 의미 검수는 수행되지 않아 대기 상태로 남겼다. 전체 작업을 최종 PASS 또는 production 승격으로 보고하지 않는다.

작업 브랜치 `codex/visang-common2-textbook`; commit/push는 하지 않았다. `archive-work/textbooks/`는 `.gitignore`의 `*textbook*` 규칙에 걸려 현재 산출물은 ignored 상태이며, coordinator가 최종 반영 시 의도적으로 포함해야 한다.
