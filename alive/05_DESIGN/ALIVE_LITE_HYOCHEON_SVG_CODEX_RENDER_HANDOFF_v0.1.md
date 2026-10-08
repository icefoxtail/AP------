# 효천고 ALIVE LITE — Codex SVG 전용 렌더 인계

작성: 2026-10-08 KST
상태: 준비 / 대상 신규 SVG 4개 / 실제 Codex 렌더 미실행.
대상: **14·15·18·20번의 생성 후보를 Git 반입한 뒤 SVG가 필수인 문항만**.
상위: `ALIVE_GPT_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md`. 정본 원본/기출 또는 현재 Archive2 runtime 변경 금지.

## 렌더 대상 (4개)
- `ALITE-20261008-HYC26-Q15-003`
- `ALITE-20261008-HYC26-Q15-004`
- `ALITE-20261008-HYC26-Q18-004`
- `ALITE-20261008-HYC26-Q20-004`

SVG 예상 경로: `archive/assets/generated-lite/<UID>.svg`.
본문은 해당 L2 생성 shard에 있는 `image: "assets/generated-lite/<UID>.svg"`를 통해 참조. 실제 path parity는 렌더 시 확인.

## Codex용 짧은 실행 지시
```text
origin/main과 해당 ALIVE LITE pilot 브랜치를 fetch하고 AGENTS.md, archive/AGENTS.md 및
ALIVE_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md를 읽어라.
로컬 batch009·011의 16문항이 pilot branch에 정상 반입된 것을 먼저 확인한다.
미반입이면 SVG 검수를 완료로 보고하지 말고 상태를 기록하라.

SVG 4문항 Q15-003, Q15-004, Q18-004, Q20-004만 실제 Archive exam 엔진에 렌더하라.
각 생성 문항의 발문·해설·graphSpec·SVG가 일치하는지 화면 캡처로 확인하고,
좌표·x절편·교점·축·라벨·표 수치·잘림·도형 비율·이미지 로드 경로를 검수하라.
q20은 조립제법 표의 1/2와 계수/나머지가 원래 다항식 계산과 일치하는지 확인하라.
문항 수학·해설 전체를 다시 전수검수하거나 정상 문항의 조판을 기계적으로 변경하지 마라.
실패한 SVG/경로만 핀포인트 수정하고 관련 캡처와 asset SHA, receipt 기록 후 커밋·푸시하라.
실제 검수하지 않은 SVG는 PASS 표시하지 마라.
```

## 상태 분리
- 16문항 Git import는 **별도 단계**. Git indexed=94 확인 전에는 SVG 검수 작업을 중단하고 오류를 보고.
- SVG `GENERATED`는 `VISUAL_QA_VERIFIED`가 아니다.
- Codex 실제 렌더는 위 4문항만. 나머지 12개는 SVG-render 대상이 아니다.
- 독립 수학검수·curriculum gate·학생 공급 승인은 다른 작업/receipt.
- 생성된 기존 78개와 16개 신규 산출물 원본을 덮어쓰지 않는다.
