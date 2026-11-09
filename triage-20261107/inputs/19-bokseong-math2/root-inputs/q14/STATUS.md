# 19 복성고 고2 수학II 2학기 기말 Q14 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, byte length 44560, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). `item.json`은 sourcePath와 ordinal 14로 정확한 원문 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 그림으로 보조해 풀이 이해를 돕되, 원문과 기존 검수 자산·이력을 보존한다. 이 초안은 지정 문항 하나의 2D 시각 입력만 로컬에 준비하며 원문·메타·기존 검수·원격 기록은 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
오른쪽 그림과 같이 밑면의 반지름의 길이가 $6$이고 높이가 $18$인 원뿔에 내접하는 원기둥 중에서 부피가 최대인 원기둥의 밑면의 반지름의 길이는?
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $4$
2. $\dfrac{7}{2}$
3. $3$
4. $\dfrac{5}{2}$
5. $2$
~~~

## 원문 정답 (정확 문자열)

~~~text
①
~~~

## 원문 해설 (정확 문자열)

~~~text
원뿔의 밑면 반지름은 6, 높이는 18이다. 원기둥의 반지름을 $r$, 높이를 $h$라 하면 닮음으로
$\dfrac r6=\dfrac{18-h}{18}$
$h=18-3r$
따라서 원기둥의 부피는
$V=\pi r^2h=\pi r^2(18-3r)$
$V'(r)=36\pi r-9\pi r^2=9\pi r(4-r)$
$0<r<6$에서 $r=4$를 기준으로 $V'$의 부호가 $+\to-$로 바뀌므로 부피가 최대일 때의 반지름은 4이다.
정답은 ①이다.
~~~

## 수학 근거와 시각 계획

원뿔의 반지름 6, 높이 18에서 원기둥 반지름 r의 허용 범위 [0,6]에 대한 보조 함수 v(r)=V/π=18r²−3r³을 표시한다. 끝점의 부피는 0이고 최댓값은 r=4에서 V/π=96이다. 이때 원기둥 높이는 h=18−3r=6이므로 원문이 묻는 최대 부피 원기둥의 밑면 반지름은 4이다. 화면 표시에서는 y축 1단위의 길이를 x축 1단위의 1/16로 한다. 이 곡선은 부피 목적함수의 2D 도식이며 원뿔에 내접하는 3D 형상을 대체하거나 그린 것으로 주장하지 않는다. 따라서 밑면 반지름은 4이다.

- 원뿔 반지름 6, 높이 18에 내접하는 원기둥은 h=18−3r이고 0≤r≤6이다. V/π=r²h=18r²−3r³.
- (V/π)′=36r−9r²=9r(4−r)이므로 내부 임계점 r=4에서 증가에서 감소로 바뀐다. V/π at r=0,4,6 is 0,96,0; hence maximum radius 4 and cylinder height 6.
- 원문에 있는 3차원 원뿔 그림은 보호 원본 자산으로 유지한다. 이 초안은 단일 2차원 목적함수 도식만 준비하며 3차원 그림의 대체·수정이나 전체 3D 시각 검수를 주장하지 않는다.

원본 Q14 PNG/3D 그림은 보호 자산이다. 수정·대체하지 않고, 이 계획은 V/π 목적함수의 2D 그래프만 제안한다. 3D 입체 도식의 완성이나 검수를 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. pre-fix specFor FAIL; post-fix input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage 이력, 원본 자산(보호 Q08 SVG 및 Q14 PNG 포함), 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## Q14 축 제목 제한과 최소 수정

실제 pre-fix 입력 검사의 specFor 단계가 `AXIS_TITLE_INVALID:y`로 실패했다. 원인은 `axisTitles.y`의 `V/π` 문자열이 축 제목 계약을 통과하지 못한 것이다. 지정된 네 파일의 pre-fix 사본을 `preparation-19-bokseong-math2/corrections/q14-before-axis-title/`에 보존했다. 최소 수정으로 `axisTitles.y`를 `v(r)`로 바꾸고, 캡션과 publish caption에서 `v(r)=V/π`라는 정확한 보조함수 정의와 기존 1/16 표시 배율을 유지했다. post-fix checker 재실행 NOT_RUN. Q14 PNG/원본 asset, 3D 검수, 렌더, 독립 수학·시각 검토, CI, publication, handoff는 NOT_RUN이다.


## 정답 숫자 좌표 라벨 숨김

입력 단계에서 답과 같은 숫자가 좌표 라벨로 노출되지 않도록 M의 coordinate label만 숨겼다. `graphPlan.coordinateBand.hide`에 ID를 두고 `coordinateLeader`에서는 해당 ID만 제외했다. 점, 곡선, 영역, exactCoordinates 및 나머지 중간값 라벨은 보존했다. 실제 시각·가독성 검수 NOT_RUN; 이는 입력 단계의 정답 숫자 노출 방지이며 렌더 결과 판정이 아니다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-42-36-766Z` / `final4-corrected`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/final4-corrected/node-results-2026-11-09T00-42-36-766Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
