# 제공 입력 초안 대조 기록 · 2026-11-07

기준 원문은 `archive/exams/original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js`이다. 아래 `q06/`, `q16/`, `q18/`, `q21/`은 사용자 메시지에 포함된 초안을 그대로 보존한 사본이며, renderer 계약 PASS나 학생 화면 검수를 뜻하지 않는다.

| 문항 | 원격 기록과 원문 대조 | 결정 |
|---|---|---|
| Q6 | 원격 `drafts/Q06/plan.json`은 분수 항의 대수적 소거 capability 계약을 확인하지 못해 OPEN이다. 제공 초안은 `+u`와 `−u`가 0이 되는 관계를 나타낼 뿐, 원문 `1/[k(k+1)] = 1/k − 1/(k+1)`의 인접 항 소거 또는 합 범위를 나타내지 않는다. | 입력은 보존. 기존 OPEN을 유지하고 공식 렌더 입력으로 승격하지 않음. |
| Q16 | 원문 함수는 `x<p`에서 `|1/x+q|`이며 `x=0`은 정의역에서 제외되고, `x≥p`에서는 제곱근이다. 제공 mapping은 `q=0,−3 → p=1/3`만 나열하고 두 조각 함수·`x=0` 제외·`0<t≤3` 교점 개수 경계는 시각화하지 않는다. 기존 plan은 혼합 piecewise 계약 미확인으로 OPEN이다. | 입력은 보존. 혼합 그래프 capability 근거가 없어 OPEN 유지. |
| Q18 | 원문은 `(g∘f)(x)=2`를 푼다. `g(u)=2`의 입력은 `u=1,3`; `f(x)=u` 역추적 결과 `x=1/2,3/2`이며 `x≥2`에서 `f(x)=4`이다. 제공 mapping은 `g(u)=2`까지만 나타내어 `f` 역추적을 빠뜨렸다. 원격 plan은 `f,g` 그래프의 `[0,2]` 공통 선분을 현재 계약이 표현하지 못해 OPEN이다. | 입력은 보존. 축약 mapping은 원문 관계 전체를 나타내지 못하고 그래프 계약도 미지원이므로 OPEN 유지. |
| Q21 | 제공 mapping은 `f(5)=3`, `g(3)=2`, `h(2)=2`만 표현한다. 원문 조건으로 `f(7)=7`, `g(5)=5`도 결정되며, `h(5),h(7)`은 `{3,5}`의 두 순서가 가능하다. 최종 합은 두 순서 모두에서 8이다. 기존 plan은 두 가능한 대응을 보존할 MAPPING 계약을 확인하지 못해 OPEN이다. | 입력은 보존. 한 mapping으로 두 대안을 표현할 수 없으므로 OPEN 유지. |

## 자료 누락 및 기존 기록

- 원격 브랜치와 원래 checkout에는 `root-inputs/`가 없었다. 사용자 메시지에 포함된 네 문항의 초안을 이 디렉터리에 별도 보존했다.
- 브랜치에는 Q1–Q4, Q6–Q7, Q9–Q12, Q14–Q19, Q21의 `drafts/` 입력이 있었다. Q8·Q13·Q20의 별도 `drafts/`나 사용자가 언급한 root-aligned 로컬 입력은 검색한 checkout들에서 확보되지 않았다. 따라서 이 세 OPEN 상태를 유지했으며 새 초안을 만들지 않았다.
- Q5는 `CLAUDE_IN_PROGRESS` 그대로 두었다.
- Q7의 기존 5회 실패 기록을 그대로 보존하고 추가 렌더하지 않았다.
- 원격 Q1 `drafts/`에는 item·plan·publish가 있으나 attempt log나 `render-status.json`은 없었다. 사용자가 제공한 사실은 두 시도가 있었고 두 번째가 Playwright 누락으로 실패했다는 내용뿐이다. 첫 시도 세부사항은 확보되지 않아 추정하지 않고 `drafts/Q01/attempt-history.md`에 출처를 구분해 기록했다.
- Q10/Q11의 기존 SVG, render status 및 SHA는 수정하지 않았다.

## 공식 환경 및 실행 상태

- 공식 `setup-spikes.mjs` 실행에서 npm(Playwright 1.58.2 포함) 및 Python 의존성 설치는 완료했다. 잠금 파일 지정 Noto Sans KR 글꼴 다운로드가 `raw.githubusercontent.com` DNS `EAI_AGAIN`으로 두 번 실패했다. 첫 설치 호출은 기본 npm 캐시 경로에 대한 ENOENT도 기록했으나 허용된 작업 디렉터리 캐시로 재실행해 npm 설치를 완료했다.
- 예상 Chromium 경로 `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`은 없었다. 시스템 Chromium 151.0.7922.173이 보였지만 pinned browser/font 대체로 사용하지 않았다.
- 공식 `render-plan.mjs`는 실행하지 않았다. 렌더 결과, 공식 계약 검증 PASS, 학생 화면 검수 PASS는 없다.
