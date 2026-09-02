# Experimental Visual Benchmark Lane

이 문서는 평면좌표·직선의 방정식·도형의 이동·함수·부등식·도형의 방정식·미적분 시각자료를 production 시험지에
투입하기 전에 짧게 반복 검증하는 방법이다. 이 lane의 결과는 `STAGED_EXAM`
후보나 Archive 등록물이 아니다.

## 실행

저장소 루트에서 다음 명령을 실행한다.

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py visual-benchmark --repeat 3 --json
```

특정 분야만 확인할 때는 `--topic coordinate_plane`, `--topic line_equation`,
`--topic shape_translation`, `--topic function`, `--topic inequality`,
`--topic conic`, `--topic calculus` 중 하나를 추가한다. 결과는 기본적으로
`alive/runtime/visual-benchmarks/{UTC run}/` 아래에 저장된다.

## 포함된 대표 사례

- 도형의 방정식 기초: 평면좌표의 점·선분
- 직선의 방정식: 두 점에서 계산한 기울기·절편과 직선
- 도형의 이동: 삼각형의 대응 꼭짓점·평행이동 벡터·위상
- 함수: 정의역이 있는 이차함수와 불연속을 가진 유리함수
- 부등식: 이차부등식의 수직선 해집합, 열린·닫힌 경계, 시험점 부호
- 도형의 방정식: 중심과 꼭짓점이 검증된 타원
- 미적분: 도함수로 계산한 접선과 정적분 영역

각 사례는 모델에서 곡선·경계·핵심점을 계산한 뒤 SVG를 만들며, 좌표·두 점
기울기·절편·이동 벡터·키 포인트의 식 잔차·부호 시험점·접선 기울기·영역
경계·결정론적 해시를 검사한다.

## 판정

`mathematicalAndSvgValidation=PASS_STRUCTURAL_ONLY`와
`determinism.status=PASS`는 실험용 계산·SVG 구조 검사가 통과했다는 뜻이다.
`overallStatus`가
`PASS_WITH_MANUAL_BROWSER_GATE`여도 `browserRender=NOT_RUN`이면 학생용
최종 PASS가 아니다. 실제 `exam`, `solution`, `answer` 브라우저 렌더와
마지막 문항·필수 해설 도형 확인을 별도로 마쳐야 한다.

실험 lane의 새 타입은 `visual_lane.py`가 받는 production `visualSpec` 타입과
분리되어 있다. 따라서 benchmark 통과만으로 Builder가 새 타입을 반환하게
하거나 staged capability를 `ACTIVE`로 올리지 않는다. production 승격은
시각 품질 최저선의 수학·시각·회귀·브라우저 조건을 모두 추가한 뒤 별도
변경으로 한다.
