# 2025 순천고 고1 2학기 기말 기존 유사문항 23개 품질 정리 — 브랜치 감사 원장

- 날짜: 2026-10-10 (KST). 작업형: 기존 유사문항 23개 검수·핀포인트 보정. **main 병합·DB 출고·배포 승인 없음**.
- 기준 Git main: `57d7fab7b9b47d8e142a496dfef3fe3524eb1bcb`; main tree: `f42f841e7f42a796e2ca53e1950be15fc47a4e58`.
- 유사 baseline: `archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js`, Git blob `ba1fd04de9fcd4fab20da916ddec471935a7c187`.
- 원본 read only: `archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js`, Git blob `6159f478e8e3edf7074d3967ba1cb7456f7762a3`.
- 변경 유사 final JS Git blob: `1cabaa3ccd227bcbb1f10fc777d9e20a2cd6b4b1`.
- 관련 규정: Notion GPT 작업 전 필독 라우터 / Archive 2.0 시작 페이지 / 전체 생명주기 / GPT Visual Production Contract v1 (CURRENT); Git AGENTS.md, 룰북 v2.6, Common Protocol v1.2.10, VISUAL v3.0, 원본↔유사 연계 및 품질 프로토콜.
- Canonical metadata table: `archive/data/master_tables/js_archive_tag_master.json`, Git blob `f0dc633dfac792ffd2fb4d8cbd3c7cb82d725593`. 23개 standardUnitKey·표시명·order·subUnit parent/label 대조에서 불일치 0.

## 1. Identity, provenance, UID, source mapping

원본 JS와 유사 JS 각각 실제 문항 수 23, id 1~23 연속. 원본 qid 1~23과 유사 id 1~23의 학교·학기·유형·단원 주제가 순서대로 대응한다. 각 유사의 출처는 같은 q번호 **유형상 대조 관계**로 기록하며 수학적 값·조건·보기는 다른 변형이다. 유사 JS에는 별도 `uid`, `sourceQid`, `sourceFile` 필드가 원래 없으므로 이 셋을 임의로 생성·삽입하지 않았다.

현재 유사 identity는 기존 `sourceJsPath|examId|qid` 계약으로 해석한다: 각 qNN의 `sourceJsPath=`archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js`, `examId=25_순천고_2학기_기말_고1_유사`, `qid=NN`. 원본과의 linkage `original archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js#qNN`은 **content/type/subunit 검토 기반 INFERRED**, 저장소에 명시적 provenance가 없으므로 자동 정식 confirmed 판정이 아니다.

원본 파일 수정·재작성·원본 PNG/SVG 수정 없음. 기존 유사 image 필드 q04/q10/q13 경로와 이미지 보존. 유사 자산 폴더에는 비참조 `q16.png`가 존재하며 이번 작업에서 삭제·변경하지 않았다. q16 문항의 증명박스는 content 안에 있으므로 추가 원본 이미지 변경 없이 검수했다.

## 2. 문항별 수학·보기·해설 및 문제/해설 visual triage

- 수학: 학생용 발문·보기에서 문제를 직접 재계산하고 기존 answer·해설과 대조했다. 객관식 1~17의 5개 보기를 확인하고 18~23의 단답·서술형도 결과/조건을 확인했다. 이는 **단일 검토 세션 수학 재풀이**이며 별도 reviewer/session에 의한 formal independent PASS는 아니다.
- 수학값을 먼저 확인한 사례: q15 f(x)−x=(x−6)(x−8)/2, q17의 두 교점 x=−1,0, q18 넓이 3√5/2, q23 x=1,2,3,4. Python SymPy 수치/식 검증 별도 실행 확인.
- 각 qid의 `visual` 설명은 문제와 해설 양쪽의 필요성을 분리해 판단한 실무 triage다. 신규 그림을 요구하지 않은 문항은 수학적인 그림 이해 이득이 작거나 기존 도형이 관계를 전달한다는 이유로 미생성했다.

| qid | 품질 처리 | 독립 풀이 근거·판정 | 시각자료 조치 |
|---|---|---|---|
| q01 | REPAIR | 명제·조건 판별: 변수식 ⑤만 조건; 기존 해설이 ③을 변수식이라고 오기 | 텍스트로 충분 |
| q02 | KEEP | q의 해 −2,4 모두 x≤a ⇒ a≥4, 선택지⑤ 유일 | 텍스트로 충분 |
| q03 | KEEP | 진수 조건 −1≤x≤7, 정수 9개, ④ 유일 | 정수 구간만으로 충분 |
| q04 | REPAIR | SVG 대응 f(1)=5, g(5)=8, f(3)=6 ⇒14=④; 기존 visualSpec의 g(5)=9 불일치 | 기존 문제 SVG 유지, visualSpec 수정 |
| q05 | KEEP | 모든 P≥0의 부정 어떤 P<0, ③ 유일 | 논리식 텍스트 |
| q06 | KEEP | P⊆Q ⇒P−Q=∅, ② 유일; 역포함·여집합 보기 모두 오답 | 논리식 텍스트 |
| q07 | KEEP | a=1, b=2 ⇒a+b=3, ④ 유일 | 단조성과 끝값을 텍스트로 설명 |
| q08 | KEEP | 치역 시작값 −6−a=−2 ⇒a=−4, ③ 유일 | 구간 끝값으로 충분 |
| q09 | REPAIR | 온전한 일대일대응: a>0, b=5; 양의 정수 a=1 ⇒4=⑤ | 치역 두 가지 관계를 SVG로 추가 |
| q10 | REPAIR | f(c)=b, f(b)=d ⇒f²(c)=d, ③ 유일; 구 SVG의 y=x 축척 오류 | 문제 SVG 좌표 재구성 |
| q11 | KEEP | P⊆R 및 Q⊆Rᶜ ⇒ㄱ·ㄴ만 참, ② 유일 | 논리식 텍스트 |
| q12 | KEEP | f(x)=2x+3 ⇒f⁻¹(13)=5, ③ 유일 | 식 전개 충분 |
| q13 | REPAIR | 점근선 x=2,y=1 및 영점3 ⇒① 유일; 그래프 바깥 polyline·눈금 존재 | 문제 SVG clip 및 주석 보강 |
| q14 | REPAIR | 네 사분면 통과 필요충분 −4<a<0 ⇒정수 3개=③ | 해설 SVG 예시 a=−2 추가 |
| q15 | REPAIR | a=24 유일, f(x)=x 두 해 6,8; 24+14=38=① | 원함수/역함수/대각선 해설 SVG 추가 |
| q16 | KEEP | (가)24a (나)6a (다)4 ⇒24·4−6·4=72=① | 증명 박스 유지, 별도 해설 그림 불필요 |
| q17 | REPAIR | t=√(x+1); 직선 k=−1에서 x=−1,0, k+r=−2=② | 절댓값 그래프와 두 교점 해설 SVG 추가 |
| q18 | REPAIR | u=x+1,v=1/u, u²+v²=7; PQ=√10, 넓이 3√5/2 | 원·현·삼각형 해설 SVG 추가 |
| q19 | KEEP | t=x−1>0: t/(t²+4)≤1/4 at t=2, a+4b=4 | 제곱식 부등식으로 충분 |
| q20 | KEEP | (바)와 (라)로 7번 카드 안 뒤집음; 1·3·5 뒤집어 34가 최대 | 경우를 문장으로 모두 설명 |
| q21 | KEEP | f=(1→1,2→3,3→2), g=(1→2,2→3,3→1) ⇒(3,1,3) | 유한대응 직접 검산, 텍스트로 충분 |
| q22 | REPAIR | f(x)<1 iff x<0; f²(x) 구간 x<0/0≤x<1/x≥1, 식 x+2/2x+3/4x+3 | 경계 포함을 보이는 해설 SVG 추가 |
| q23 | REPAIR | k=1에서 네 교점 x=1,2,3,4, 합10, 원래 답 그대로 | 두 무리함수 가지와 직선·교점 해설 SVG 추가 |

집계: 처리 23 / KEEP 12 / REPAIR 11 / HOLD 0 (**현재 수학·데이터 수정 분류**). 기존 reviewed_pass 상태의 q1도 기계적으로 통과시키지 않고 실제 해설 오류를 고쳤다.

## 3. 수정 내용

- q01: 정답 ⑤ 유지. 기존 해설이 ③/⑤의 문장 인덱스를 서로 잘못 참조하고 ④의 진릿값 설명도 뒤섞었던 오류를 수정.
- q04: 실제 q04.svg에서 `f(1)=5,f(3)=6,g(5)=8` 확인. 기존 visualSpec의 잘못된 `g(5)=9`→`g(5)=8` 최소 보정, SVG는 기존 geometry 보존하고 title/desc·글씨 크기만 보정.
- q10: 그래프 이미지의 `y=x` 기울기와 동일한 문자 눈금 관계를 맞춰 SVG 재작성. f 값의 순서와 정답 ③ 보존.
- q13: 기존 유리함수 polyline의 화면 밖 분기 및 잘린 tick 문제에 clipPath와 안전영역 적용, 그래프의 절편/점근선 수학 의미 불변.
- q09/q14/q15/q17/q18/q22/q23: 해설용 SVG 7개 신규 작성하고 JS의 `solutionImage`, Alt/Caption/Size 연결; 시각자료 태그가 없던 대상에는 맞춤 그래프/도형 태그만 보강.
- 원본·유사 양쪽 문항의 id/내용(content)/choices/answer/기존 image 경로, standardCourse/standardUnitKey/subUnitKey, questionType/layoutTag/wide 모두 불변. 기존 q17/q18의 학생용 풀이 수식도 그대로 보존했다.
- `reviewStatus=reviewed_pass` 등 기존 레거시 승인 태그는 이번 작업이 별도 공식 재승인 작업이 아니므로 일괄 변경하지 않았으며 본 원장이 이번 검수 결과를 기록한다.

## 4. SVG 파일 경로 및 static 결과

자산 폴더: `archive/assets/images/25_순천고_2학기_기말_고1_유사/`. 신규 **7개**, 기존 문제 SVG **3개 수정**. q04는 구조/읽기 쉬움, q10은 수학 좌표, q13은 클리핑.

| 구분 | 경로(아래 자산 폴더 기준) | 최종 Git blob |
|---|---|---|
| KEEP 기존 문제 | q04.svg (title/desc 및 문자 가독성 보정) | 10a426dbe5d320582bd72b7c9b30356b5e06b3ad |
| REBUILD 문제 | q10.svg | 8e9b1d77aeeab927ac38aece54c4ff410a07888e |
| REPAIR 문제 | q13.svg | 12394d169cc85a907b13f5a34e2d60314d8bdfd5 |
| ADD 해설 | q09-solution.svg | 3dc6f882f71584ce90c4246974b53a52504bda01 |
| ADD 해설 | q14-solution.svg | 47fa3fb8c998d7e2abd28b8e687507488eb5405f |
| ADD 해설 | q15-solution.svg | 57c556b2914e103f25d5e0b34bb137b78c92ec1f |
| ADD 해설 | q17-solution.svg | b29fb6c745991f8cc85a22ef6082fdd67f485452 |
| ADD 해설 | q18-solution.svg | 8ec82ad7e5e776561f7e2486f2668757dcd44376 |
| ADD 해설 | q22-solution.svg | db22ac9807338704eea4bb0722ccae3f0912d327 |
| ADD 해설 | q23-solution.svg | a6111821bc2a38c43dd1f285923e146b54e9fbbe |

- SVG text root/tag, title, desc, viewBox 및 primitive 존재를 정적으로 확인; q04/q10/q13 문제 visual과 신규 해설 visual의 수학식/주요 좌표를 원문·풀이와 대조.
- 주의: 이번 GPT 세션에서 **Chrome/Archive 실제 exam·solution·answer render 실행하지 않았음** → `BROWSER_RENDER=NOT_TESTED`. student-visible 레이아웃·폰트·클리핑 최종 PASS 주장 불가. SVG는 JS blob과 결속되지만 새 자산은 공식 독립 시각 검수와 최종 화면 QA가 필요.
- 원본 PNG의 바이너리 그림 내용을 GitHub 커넥터로 시각 판독하지 못했으며 `SOURCE_PNG_VISUAL_PARITY=NOT_VERIFIED`. 외부 renderer의 SVG↔actual Chrome parity 도 `NOT_TESTED`.

## 5. RPM / 출시 상태 / 남은 이슈

- 23/23 canonical 표준단원·세부단원 parent/label 정합성 확인. **RPM L1~L4/Primary L3 링크는 이 레거시 유사 JS에 명시적 키가 없고 정본 RPM 데이터와의 개별 링크를 검증하지 못했으므로 `RPM_LINK=NOT_VERIFIED`**; 함부로 새 유형키나 PASS를 만들지 않았다.
- 개별 문항의 수학적 결과는 위 표대로 유지·수정했으나 정식 다른 세션 독립검수/Chrome·PNG 시각 일치/RPM 가맹 확정이 남아 있어 `FINAL_PRODUCTION_SEAL=BLOCKED`, `MAIN_MERGE=NOT_REQUESTED`, `DEPLOY=NOT_REQUESTED`.
- 후속: 형님의 별도 출시 지시가 있기 전에는 브랜치 검수 산출물로 유지. 실제 Chrome 렌더·SVG geometry independent reviewer·RPM canonical junction 검증 뒤 출시 판단한다. 기존 UID / 원본을 바꾸거나 문제를 임의 대체하지 않는다.
