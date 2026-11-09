# 20 매산고 고1 1학기 기말 Q04 로컬 입력 초안

출처 결속: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 4; source main `ca13990f5ba49e16af134945e3c26bf35d7a89c5`, prepared source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, source git blob `830a02dfed7703f109a615015e658aadc3def794`. `item.json`은 위 원문 경로와 ordinal로 해당 런타임 행에 결속한다. 소유자는 `UNKNOWN`.

## 원문 문항 (정확 문자열)

```text
이차 부등식 $x^2+ax+b<0$의 해가 $-2<x<1$일 때, 이차부등식 $x^2+bx+a\le0$를 만족하는 해 중 정수 $x$값의 합은? [3.9점]
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
$x^2+ax+b<0$의 해가 $-2<x<1$이므로 두 근은 $-2,1$이다.
최고차항의 계수가 $1$이어서
$x^2+ax+b=(x+2)(x-1)=x^2+x-2$이다.
따라서 $a=1,\ b=-2$이다.
이 값을 두 번째 부등식에 대입하면
$x^2-2x+1\le0$, 즉 $(x-1)^2\le0$이다.
제곱은 음수가 될 수 없으므로 해는 $x=1$뿐이다.
정수해의 합은 $1$이고, 정답은 ②이다.
```

## 범위와 계획

두 답을 같은 해집합으로 혼합하지 않도록 첫 부등식 해 `−2<x<1`은 열린 SET 구간, 둘째 부등식의 점해 `x=1`은 별도 POINTS 행에 표현한다. 두 번째 행의 −2는 첫 구간 경계 참고점(HOLLOW)이지 둘째 부등식의 해가 아니며, 1만 그 부등식의 점해(FILLED)다.

이 number-line contract는 점 하나인 SET/RESULT를 허용하지 않아 두 번째 단일점 해를 POINTS 행으로 표시한다. POINTS 행은 계약상 두 점 이상이어야 하므로 −2와 1을 넣되 −2는 경계 참고점, 1만 점해라고 명시했다. `sourceQuote`를 쓰지 않는다. 숫자 간 간격은 모두 실제 해설의 −2와 1에서만 온다.

사용자 사유: “existing diagram replacement helps understanding”.

보호: 기존 Q03–Q20 SVG와 모든 PNG, 이 원본 시험지·JS, 다른 문항 패키지를 수정하지 않았다. Q04의 기존 SVG와 모든 원본 PNG는 덮어쓰거나 다시 렌더하지 않는다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회. 별개 `19 강남여고 고1 2기말 Q13` whole-item HOLD는 범위 밖이며 그대로 보존한다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 input checker, engine prepare/build, render/SVG/PNG, 전체 수학 검수, 시각·접근성 검수, CI, publication, handoff 모두 NOT_RUN. checker는 부모가 실행하기 전까지 실행하지 않는다. 입력은 source-runtime-bank.json의 해당 행에서 content/answer/solution을 그대로 옮겼으며 원문/자산은 수정하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `7d673e03500c20456a35f723cdf50b4b3befba44767cba4617b91586160fad0e`, `3f52ae8189962bdce65f25b5921719010d90741d55f0461d717ed796b89bf2fd`, `0e31994fb8386daf7c225cd6b7d8f3f89ebb25f8e1740f479022bfad3ba1f0b3`로 동결된 `graph-first` / `2026-11-09T01-19-51-457Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual expandNumberLineFigure input contract의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
