# 21 제일고 2학기 중간 고1 q11 복구 증거

## 범위와 원문 탐색

- 대상 production JS: archive/exams/original/high/h1/2mid/21_제일고_2학기_중간_고1_기출.js
- 대상 문항: id=11
- SOURCE_SEARCHED_PATHS = C:\Users\USER\Desktop\AP------ 전체 재귀 검색; archive/_generated 전체; archive/assets/images/21_제일고_2학기_중간_고1_기출
- 로컬 검색 루트: C:\Users\USER\Desktop\AP------ 전체
- SOURCE_SEARCH_COMMANDS = 아래 명령 4개와 q11 asset 목록 검색 명령을 실제 실행
- SOURCE_FOUND = NO

실제로 실행한 검색 명령과 결과:

    COMMAND: rg --files -g '*.pdf' -g '*.PDF' | rg '제일고|효천고|21_|22_'
    HIT_COUNT=0

    COMMAND: rg --files | rg '(?i)(제일고|효천고).*(scan|source|원본|evidence)'
    HIT_COUNT=0

    COMMAND: rg --files | rg '(?i)(scan|source|원본|evidence).*(제일고|효천고)'
    HIT_COUNT=0

    COMMAND: rg --files archive/_generated | rg '21_제일고_2학기_중간_고1|22_효천고_2학기_중간_고1|제일고.*중간.*고1|효천고.*중간.*고1'
    HIT_COUNT=0

    COMMAND: rg --files archive/assets/images/21_제일고_2학기_중간_고1_기출 | rg 'q11|q011|solution'
    RESULT: q11/q011-specific asset hit=0; the returned solution hits were for other question numbers only.

따라서 대조 가능한 PDF, scan, source, past evidence, generated source page는 확인되지 않았다. 현재 production JS 자체와 git 이력은 문항 기록으로만 사용했으며 원문으로 간주하지 않았다.

## 불성립 원인과 최소 복구

복구 전 q11은 다섯 단계 (가)~(마)가 모두 참인데 answer가 정답 없음이어서 객관식으로 선택 가능한 답이 없었다. 학습 목표인 귀류법, √11의 무리수 증명, 증명 과정의 논리 검토는 유지했다.

원문 부재 상태의 최소 복구는 (라)의 부호 조건만 조정하는 방식으로 했다.

- 복구 전 (라): $k$는 정수
- 복구 후 (라): $k$는 음의 정수
- 이유: $a,b$를 자연수로 두고 $a=11k$이므로 $a>0$, $11>0$에서 $k=a/11$은 양의 정수이다. 따라서 음의 정수라는 설명만 거짓이다.
- 나머지 발문, 증명 과정, 보기 순서, 학습 목표는 유지했다.

## 5개 보기 독립 검산

| 보기 | 내용 | 독립 판정 | 근거 |
|---|---|---|---|
| ①/(가) | 유리수라고 가정 | 참 | 귀류법으로 무리수임을 보이기 위해 유리수라고 가정하는 것은 올바른 시작이다. |
| ②/(나) | $a,b$는 서로소인 자연수 | 참 | 유리수를 기약분수로 나타내면 분자와 분모를 서로소인 자연수로 둘 수 있다. |
| ③/(다) | $a^2$이 11의 배수이면 $a$도 11의 배수 | 참 | $a^2=11b^2$에서 $a^2$은 11의 배수이고, 제시된 명제를 적용할 수 있다. |
| ④/(라) | $a=11k$에서 $k$는 음의 정수 | 거짓 | $a$와 11은 양수이므로 $k=a/11$은 양의 정수이다. |
| ⑤/(마) | $b^2=11k^2$ | 참 | $a=11k$를 $a^2=11b^2$에 대입하면 $121k^2=11b^2$, 따라서 $b^2=11k^2$이다. |

## 기계 재검산 결과

실행한 검산은 q11을 production JS에서 VM으로 읽고, 보기 배열·answer·solution을 직접 확인했다.

    ACTUAL_CORRECT_CHOICE = ④
    CURRENT_ANSWER = ④
    SELECTABLE_CORRECT_ANSWER_COUNT = 1
    ANSWER_MATCH = PASS
    SOLUTION_MATCH = PASS
    QUESTION_VALIDITY = PASS
    OLD_NO_ANSWER_TEXT_IN_SOLUTION = NO

검산 기준상 ④만 잘못된 부분이고, answer와 해설의 결론이 모두 ④와 일치한다.
