# 매산중 중1 2중간 유사2 Q7 — 수선과 거리

SAMPLE_ONLY. 문제/해설 입력 각3종 및 실제 엔진 SVG 각1개 보존. sourcePath archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js, sourceRef work/similar-m1-accumulate, source blob b928c4c8fa415aaabd65a5a05ebd9cd4de20e852, ordinal7. 기존 JS/메타/원본 자산/학년 체크리스트는 수정하지 않음.

## 수학·표시 계획
A(0,3),B(0,0),C(6,0),D(4,3)의 정규화 도식. H는 D의 수선발(4,0). 숫자는 내부 구성용이고 원문에 없는 길이 조건으로 표시하지 않는다. 상단 AD∥하단 BC, B 직각, DH 수선이 원문의 조건이다. 문제 그림은 이 조건과 이름만 표시하며 정답 선택지나 AB/DH 강조선은 없다. 문제/해설 mathPlan 동일. 해설에서만 AB와 DH를 강조해 거리와 수선발을 구분한다.
벡터 내적/외적으로 평행·직각·수선발을 확인. C에서 AB로 내린 수선발은 B이며 A가 아니다. AB와 CD가 평행하지 않아 AD를 둘 사이 거리라고 하지 않는다. ㄱㄴ 참, ㄷㄹ 거짓, 정답②와 일치한다.

## 검증
공식 composeConstructionCandidate API 사용, engine snapshot1206d96c524b4fc50afc83311d2a6131c7e5ab46. 모델/독립 정적 관측/plane-mark/headless 배치 검사 양쪽 PASS. SVG 글리프 재독해 A,B,C,D,H만 확인. 원문 발문 불변, 문제에 답/숫자/추가풀이 힌트 없음.
Typography는 CALLER_SUPPLIED_UNVERIFIED. 실제 Archive 측정·게시·qualification 및 직접 시각 검수 NOT_RUN. productionAuthorized=false. PNG 미리보기는 별도 생성했고 Git에는 SVG와검증자료만 보존한다.

## 소유·차단
이전 같은 시험지 Q1/Q3 입력을 소유한 별도 SVG 라인이 Q7을 추가. 중1 기존 담당은 MD/JS 변환을 담당하며 SVG 미제작 체크리스트였다. 전용 입력에 기존 Q7 없음 확인, 새 경로만 작성. 외부 작업자 실시간 소유 전체 확인은 불가하므로 운영 인계 전 재확인할 것. 원문에 있는 범용 UNSUPPORTED 문자열은 실제 엔진 심사 거절 이력으로 확인되지 않았다.
original-only 운영 측정 제약과 지정 운영 게시 담당은 미확인 상태 유지. 샘플생성과 원격보존을 운영인계나게시 완료로 취급하지 않는다. 새 PR/main 병합/배포 없음.
