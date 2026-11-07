# 23 금당고 고1 2학기 기말 · SVG 초안 상태

원문 기준 파일: `archive/exams/original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js` (21문항). `AUTHOR_GUIDE.md`, `HANDOFF_SVG_CODEX.md`, `HANDOFF_SVG_ENGINE.md`, 루트/Visual 지침을 확인하고 Q7·Q10·Q11의 발문·정답·해설을 원문 JS와 대조했다.

| 문항 | 상태 | 결과 |
|---|---|---|
| Q7 | FAILED | 공식 renderer 5회. 최종 `STATIC_GRAPH_AUDIT_FAIL`: asymptote label placement errors. SVG 없음. 시도와 오류는 `drafts/Q07/render-status.json`에 기록. |
| Q10 | ARCHIVE_BOUND | 공식 renderer `piecewise-discontinuous-spike-v1`, repairs 0. `drafts/Q10/figure-solution.svg`. PNG 미리보기 시 열린 양끝과 감소 대응 확인. SHA-256 `080A0A689F3A4DB6E0BEA2FF04BE85CADD084FC423D4F338C55BC432C74D4FF7`. |
| Q11 | ARCHIVE_BOUND | 공식 renderer `rational-spike-v1`, repairs 0. `drafts/Q11/figure-solution.svg`. PNG 미리보기 시 점근선과 A=(0,2), B=(1,1) 확인. SHA-256 `77B472B1796A261A63D843BB7CC840DE91147809EB3296844B7DAEFB781EC74C`. |

Q11은 기존 입력 초안의 `1/(x−2)+3` 예시 대신 원문 해설에서 결정되는 실제 함수 `2/(x−2)+3`으로 수정했다. caption은 `a<0`이면 구간에서 `f(x)>3`임을 먼저 보여 최댓값 조건과 모순임을 밝히고, `a>0`일 때 `x<2`이므로 감소한다고 설명한다. Q10은 예시 함수를 제거하고 실제 대응 `f(x)=−x+1`을 그려 두 문항 사이 함수/예시 표기 혼동을 없앴다.

렌더 의존성 설치 스크립트는 npm registry DNS 오류(`ENOTFOUND`)로 실패했다. 원본 AP checkout의 기존 dependency 폴더는 읽기 전용으로 재사용했고, Python/font 의존성은 이 worktree 안에 복사했다. 원본 checkout branch와 Claude 전용 임시 폴더는 건드리지 않았다. Chromium 로컬 preflight는 상승 권한 실행 후 성공했다.

Q5는 수정하지 않았고 `CLAUDE_IN_PROGRESS`다. Q8·Q13·Q20은 기존 정합본을 확보하지 못해 `OPEN`이다. Q1–Q4, Q6, Q9, Q12, Q14–Q19, Q21은 이 작업에서 `NOT_RUN`이며, 시험지 JS, main, PR, 배포는 수정하지 않았다. PNG/renderer temp output은 `.tmp`에만 있고 커밋 대상이 아니다.
