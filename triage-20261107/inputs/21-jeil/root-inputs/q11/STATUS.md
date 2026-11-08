# 21 제일고 고1 2학기 기말 Q11

BRANCH DRAFT / NOT_RENDERED. 기존 OPEN_CONTENT 유지. READY_FOR_RENDER가 아니다.

ROOT가 원문 JS 발문·정답·해설을 읽고 작성한 item.json, plan.json, publish.json의 바이트를 그대로 보존한다. Q11에는 문제·해설 이미지 참조가 없고, 현재 main의 시험지 자산 폴더에도 Q11 그림이 없다.
- 대조 main: 13bd64dae3118ab965fcc08c30b0fbc8df202e67, source blob fec19bfcdf35e0c8f4151408a4da2b3c7f1581df.
- 작업 브랜치 기준: 330b6fad0c18194065c1e2be56982cc20cbaad7f, source blob 67d4a7c95cdb26f682d31cf1fb63608c856c6dea. 두 버전의 Q11 문항 객체는 동일하고 sourceQuote는 해설의 정확한 부분 문자열이다.
- JSON 구문 확인만 수행했다. 공식 plan/model validator, 렌더, 독립 시각·수학 검수, 학생 화면, 구현자 인계: NOT_RUN.

## 해석과 남은 내용 확인
발문은 eijlog부터 goljie까지의 사전식 배열이고, 현행 해설은 e<i<j<l<o<g라는 비표준 문자 순서를 사용한다. 계획은 이 해석을 명시한 발췌 수형도다. e와 i의 각 가지는 120개 묶음을 뜻하고 j 가지는 jeilog, jeilgo 두 개만 발췌한다. 모든 j 배열이나 720개 전체 순열을 그렸다고 주장하지 않는다. 원본 문제의 사전식 순서 의도와 제시 구간의 기존 의심은 해소하지 않았으며, 원문·정답·해설을 수정하지 않는다. 원본 확인 전에 콘텐츠 문제를 PASS 또는 구현 가능 확정으로 바꾸지 않는다.

## 시험지 전체와 기존 이력
현재 main 원장 blob a849eed70c877f0710fa4360ec988634ebf74533의 22문항은 PUBLISHED 10(Q02·03·04·05·06·07·09·18·20·22), EXEMPT 8(Q10·12·13·14·15·16·17·21), OPEN_UNSUPPORTED 3(Q01·08·19), OPEN_CONTENT 1(Q11)이다. PUBLISHED 10개는 현재 참조 SVG 실물과 geometry-visual-v1 마커를 확인했다. Q19의 기존 SVG는 신엔진 완료본으로 세지 않는다. Q01·08·19 입력은 이미 있고, 이번 추가 전 Q11만 0/3이었다. 기존 12문항 입력 48개 파일, 기존 판정표·원장·자산·승인·실패 이력은 변경하지 않는다.

현재 확인 가능한 작업 현황과 시험지명/jeil open PR 검색에는 Q11의 중복 작성 작업이 나타나지 않았다. 이것이 외부 로컬 작업자 부재를 증명하지는 않는다. 외부 현재 소유·잠금·누적 렌더 횟수는 UNKNOWN이며 0으로 초기화하지 않는다. 과거 9문항 인계는 Q02·04·05·06·07·09·18·20·22이며 Q11은 포함되지 않았다. 확인한 원격 판정·대화 이력에서 이 Q11 입력 보존 동작에 대한 심사 거절은 찾지 못했다. 다른 문항·대기열 작업의 거절을 해소하거나 재시도하지 않는다. 최신 지시상 구현 작업자는 중단 상태이므로 인계·재렌더·대기열 변경은 하지 않는다.


## Local schema-correction preparation (formal validator, render, review, and handoff: NOT_RUN)

- Exact removed sourceQuote text: 첫 글자가 $j$보다 앞선 $e$ 또는 $i$인 배열은 $2\times5!=240$개이다.
