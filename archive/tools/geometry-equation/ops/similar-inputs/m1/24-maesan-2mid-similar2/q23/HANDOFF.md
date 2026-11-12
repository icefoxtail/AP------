# 매산중 유사2 Q23 — 정사각형의 합동과 교각

SAMPLE_ONLY. 최신 sourcePath archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js, sourceRef work/similar-m1-accumulate, source blob 4f300aeae1bae07e956a266c76a78a0c3e59b6b0, ordinal23. 중1 담당이 발문 답/해설 잔재를 제거한 뒤 직접 원문·해설을 재확인했다. 이전 샘플의 source snapshot은 별도 유지하고 이 실행을 분리했다. 기존 JS/자산/학년 파일 변경 없음.

정사각형 ABCD 및 주어진 BE=CF, AE와 BF 교점 P를 구성. 내부 길이는 정규화용이며 어떤 치수/중점 조건도 표시하지 않는다. 문제에는 BE=CF 한 쌍 표시만, APB 직각/합동 조건/SAS/답 숫자는 없다. 해설에는 AB=BC, 두 끼인 직각 및 결론 APB 직각을 추가한다. mathPlan은 같은 구조를 재사용한다.

일반 검산: 정사각형 한 변 s, BE=CF=t이면 AE 방향(t,-s), BF 방향(s,t)의 내적 ts-st=0으로 수직. ABE↔BCF의 두 변과 끼인각 일치로 SAS. 정규화 s6,t3의 교점 P=(12/5,6/5)를 분수로 확인. 정답과 일치한다. 출력 글리프 A,B,C,D,E,F,P만, 문제의 결론 직각 부재 확인.

양쪽 모델/독립 정적 primitive 및 plane-mark/headless 배치 검사 PASS. 공식 composeConstructionCandidate, engine snapshot1206d96c524b4fc50afc83311d2a6131c7e5ab46. Typography CALLER_SUPPLIED_UNVERIFIED. 직접 시각검수/actualArchive/qualification/publication NOT_RUN, productionAuthorized=false. PNG 별도 생성.

기존 같은 시험지 입력을 소유한 SVG 라인이 신규 q23 경로를 사용. 학년 담당의 발문 수리를 중복하지 않음. 외부 실시간 전체 소유는 인계 직전 확인 필요. 게시 계약/지정 담당은 여전히 미확인, main 병합/운영 연결/배포 없음.
