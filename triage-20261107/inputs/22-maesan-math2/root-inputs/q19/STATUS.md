# 22 매산고 고2 수학II Q19 로컬 입력 초안

원문 인용(정확, 문항):

```text
<서술형 1>
아래의 그림과 같이 밑면의 반지름의 길이가 $12\mathrm{cm}$, 높이가 $9\mathrm{cm}$인 원뿔 모양의 그릇이 있다. 이 그릇에 수면의 높이가 매초 $1\mathrm{cm}$씩 올라가도록 물을 붓고 있다. 다음 물음에 답하시오. [10.0점]

<img src="assets/images/22_매산고_2학기_기말_고2_수학II/q19.png" style="max-width:300px; display:block; margin:10px auto;" />

(1) $t$초 후 수면의 높이를 $h\mathrm{cm}$, 수면의 반지름의 길이를 $r\mathrm{cm}$라 할 때, $h$와 $r$를 $t$에 대한 식으로 각각 나타내시오. [2.0점]
(2) $t$초 후 그릇에 담긴 물의 부피와 그때의 물의 부피 변화율을 $t$에 대한 식으로 각각 나타내시오. [6.0점]
(3) 수면의 높이가 $3\mathrm{cm}$일 때, 물의 부피 변화율을 구하시오. [2.0점]
```

원문 인용(정확, 정답):

```text
(1)\ h=t,\ r=\frac{4t}{3};\quad (2)\ V=\frac{16\pi}{27}t^3,\ \frac{dV}{dt}=\frac{16\pi}{9}t^2;\quad (3)\ 16\pi
```

원문 인용(정확, 해설):

```text
(1) 원뿔의 전체 높이는 $9\mathrm{cm}$, 윗면 반지름은 $12\mathrm{cm}$입니다. 물의 단면도 닮은 원뿔이므로 $r/h=12/9=4/3$입니다.
수면이 매초 $1\mathrm{cm}$씩 올라가고 처음에는 비어 있으므로 $0\le t\le9$에서 $h=t$, $r=4t/3$입니다.
(2) 원뿔의 부피 공식 $V=\frac13\pi r^2h$에 대입하면 $V(t)=\frac13\pi(4t/3)^2t=\frac{16\pi}{27}t^3\ (\mathrm{cm}^3)$입니다.
물의 부피 변화율은 시간을 기준으로 미분하여 $V'(t)=\frac{16\pi}{9}t^2\ (\mathrm{cm}^3/\mathrm{s})$입니다.
(3) 높이 $h=3$일 때 $t=3$이므로 $V'(3)=\frac{16\pi}{9}\cdot9=16\pi\ (\mathrm{cm}^3/\mathrm{s})$입니다.
```

표현 계획: 검수된 cone contract가 지원하는 아래 꼭짓점 배치 원뿔과 exact LEVEL section `at:"1/3"`를 쓴다. 이것은 원문이 요구하는 특정한 h=3cm, t=3초의 사례를 그리며, 전체 높이 9cm에 대한 section 비율이 1/3이므로 수면 반지름은 4cm다. 일반식은 캡션에 남기며 임의 시간이나 일반 시간 변화 그림을 주장하지 않는다.

검증 상태: item/plan/publish JSON 파싱, sourcePath·ordinal 결속, 원문 인용 대조, 1/3 section의 h=3 및 r=4 비례 산술 정적 확인을 수행한다. solid model/observer/expand, renderer, browser/visual QA, 독립 전체 수학 검토, prepare/build, 게시 및 인계는 NOT_RUN이다. 계약 경로 확인만으로 actual validator PASS 또는 READY라 하지 않는다. LOCAL_ONLY, DRAFT_ONLY.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `solveSolidFigure`, `solidFigureSpec`, `expandSolidFigure`: PASS. 이는 원뿔의 입력 계산·명세·확장 단계이며 최종 렌더나 시각 검수 결과가 아니다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.
