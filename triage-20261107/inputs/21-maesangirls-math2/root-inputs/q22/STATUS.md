# 21 매산여고 고2 수학II Q22 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob edfbd0d27672dc288fbbec741aad01de36967a4a; SHA-256 c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9; 제공된 source-exact.js 41,934 bytes. sourcePath와 ordinal 22를 결속했다. 사용자 사유: 실제로 이해를 돕는 도식을 준비하고, 리더 전략을 보조한다.

## 원문 문항 (정확 문자열)

```text
[주관식4 (서술형)] 함수 <br>$f(x)=(x^2+ax+b)(ax-b)$라 하자. 함수 $f(x)$의 역함수가 존재할 때 다음 물음에 답하여라. (단, $a,b$는 $a>0$, $b
e0$인 상수) [총 7점](부분점수 있음.)
1) 두 실수 $a,b$의 관계식을 구하여라. (4점)
2) 함수 $(x-a)f(x)$가 $x=4$에서 극솟값을 가질 때, 함수 $f(x)$를 구하여라. (3점)
```

## 원문 선택지 (정확 문자열)

```text
(선택지 없음)
```

## 원문 정답 (정확 문자열)

```text
$b=a^2$, $a=4$, $b=16$, $f(x)=4x^3-256$
```

## 원문 해설 (정확 문자열)

```text
전개하면
$f(x)=ax^3+(a^2-b)x^2-b^2$
$f'(x)=x(3ax+2(a^2-b))$이다.
역함수가 있으려면 삼차함수가 일대일이어야 한다. $a^2-b\ne0$이면 도함수의 부호가 바뀌어 함수가 일대일이 아니므로
$b=a^2$이다. 이때 $f(x)=ax^3-a^4$이다.
$H(x)=(x-a)f(x)$라 두면
$H'(x)=a(4x^3-3ax^2-a^3)$
$x=4$에서 극솟값을 가지므로 $H'(4)=0$이다.
$a(256-48a-a^3)=0$
$a>0$이고 $a^3+48a-256=(a-4)(a^2+4a+64)$이므로 $a=4$이다.
$H''(4)=6a\cdot4(8-a)>0$이어서 실제로 극솟값이다.
따라서 $b=16$이고 $f(x)=4x^3-256$이다.
```

## 초안 범위

CONTENT_HOLD. 원문 b 조건의 단일 역슬래시 손상 때문에 실행 가능한 도식을 만들지 않는다.
plan.json은 LOCAL_NON_EXECUTABLE_CONTENT_HOLD / NOT_APPLICABLE_CONTENT_HOLD이며 엔진 capability가 없다. 원문 답·해설 문자열은 인용으로만 보존했고 의미를 보정하거나 해석하지 않았다. publication 및 실행은 없다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 이 작업은 지정된 네 파일만 로컬 초안으로 기록하며 원문·엔진·assets·ledger·기존 패키지를 바꾸지 않는다. Q01/Q03 신규 엔진 결과, 기존 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 prior392files를 보존한다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **CONTENT_HOLD / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

원문 b 조건 손상으로 비실행 보류다. 첫 실행에서 동결 bytes 일치만 확인했고 JSON을 파싱하거나 엔진 계약을 호출하지 않았다. 원문 및 답·해설을 복원하지 않았다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
