# 중1 1학기 통합 메타 검토 · 작업 인계

현재 상태: `RUNNING` — 완료 인계 전입니다.

## 작업 식별

- workKey: `M1-S1-META-FULL`
- taskId: `ef319e48-5efb-4d99-a4ac-5ded7ac1d74d`
- owner: `GPT_ROOT_75DAEF2BA0F3`
- 기준 main: `8c3b8fe05348d7235546d7d2d9ec063029d19e4d`
- 브랜치: `review/m1-s1-meta-full-20261114`
- 진행표: 같은 폴더 `progress.json`
- 실행 지시: https://app.notion.com/p/4180e68bd69f81a1820bd5aeddb464a4
- 재개 인덱스: https://app.notion.com/p/4180e68bd69f8185950ce1fc23821831

## 확정 분모와 경계

`archive/exams/original/middle/m1/1mid/` 8시험지와 `1final/` 4시험지, 총 12시험지·286문항. 정답·해설이 있는 4시험지 93문항과 SOURCE_ONLY 8시험지 193문항을 구별합니다. source, 등록된 UID, 순서, 정답·해설·그림·레이아웃은 보호합니다.

세 실제 서브에이전트가 서로 다른 시험지의 전체 메타를 검토하며 root가 시험지별 독립 표본·최소 검사·commit/push·원격 HEAD 확인을 담당합니다. 공용 metadata/registry/crosswalk/dictionary/DB/catalog/runtime 및 production inbox는 수정하지 않습니다.

SOURCE_ONLY의 method는 해설 근거가 없는 제안과 확정값을 구별합니다. 빈 해설을 생성하거나 새 전수 풀이로 범위를 넓히지 않습니다. 내용·근거 부채가 남으면 전량 완료 또는 운영 등록 가능으로 표시하지 않습니다.

## 다음 행동

진행표의 PENDING 시험지들을 각 담당자가 계속 검토합니다. 시험지별 저장이 완료되면 이 파일에 실제 검증 결과·남은 일·Codex 출고 순서를 갱신합니다. 현재 main 병합·공용 등록·배포는 미실행이며 이 작업에는 권한이 없습니다.
