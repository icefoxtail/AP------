# 23 강남여고 고2 확률과통계 2기말 Q19

상태: OPEN · DRAFT_INPUTS_ONLY · NOT_RENDERED. READY, PASS, PUBLISHED 또는 시험지 완료 판정이 아니다.
이 파일은 ROOT 작성 입력 3종의 작업 브랜치 보존 기록이다. 원격 ref/commit/blob 확인 결과는 별도 작업 보고에서 확인한다.
공식 validator / render / independent mathematical review / layout / accessibility / sizeClass / implementation handoff: NOT_RUN.

## 보존 범위와 확인 시점
- 브랜치: codex/svg-triage-20261107.
- 보존 직전 HEAD: 559efcd735b76034bf0e2eedb3fc9d96d825c1d3. 대조한 main: 733b247a91aefab6072202f68a1ed41f065f342f.
- source: archive/exams/original/high/h2/2final/23_강남여고_2학기_기말_고2_확률과통계.js, main/triage blob 365ecc38fe7f0d05db928363bd39b55d92e3f191.
- 판정표: triage-20261107/23-gangnamgirls-stat.md, blob e7a9141ad892b192cba9ef9499e45a9b95adfc81. 판정표와 ledger는 변경하지 않는다.
- 25문항은 기존 판정상 OPEN 10(Q08·12·15·16·17·18·19·20·21·25), FIGURE 6(Q04·05·06·07·10·24), EXEMPT 9(Q01·02·03·09·11·13·14·22·23)이다. 이번 보존으로 10개 OPEN의 입력 3종을 추가하지만 OPEN을 닫지는 않는다.
- 기존 6세트 24개 파일(root tree 8553883762c9749eceec4b0ceaefba57be8990d1)과 15d0fb3f7cd39f50b45ae2f7ad2118cd434b9294 보존·과거 인계 이력을 유지한다. 과거 인계는 현재 신규 10세트의 구현 인계를 뜻하지 않는다.
- 최신 확인 main ledger 27d84fea1f1d8de400531f2d3c17b7cdffc72386에는 정확한 시험지 항목이 없고 runtime receipt 78f8cf940b9da8798028efd0c0f783fb94f259ca에도 정확한 시험지 HOLD가 없다. triage의 OPEN 분류를 main 판정으로 바꾸지 않는다.
- 유일한 원본 참조 이미지는 archive/assets/images/23_강남여고_2학기_기말_고2_확률과통계/q21.png, blob 7871c87bc2c70c4273074aee0ba13c2dcf8bd3ae, 38,356 bytes다. ROOT의 직접 픽셀 확인 보고와 별개로 보존 담당자는 경로·참조·blob을 확인했다. canonical 폴더에서 신규 엔진 solution SVG는 발견하지 못했다.
- PR #625 원문 출고, #632 Q04 메타 보완, #708 세부단원 이력과 열린 PR #1405의 4slot 메타 파일을 보존한다. 원문·그림·메타·engine·queue·기존 입력은 이번 변경 대상이 아니다.

## 소유·거절·인계 경계
확인한 현재 native 작업과 열린 PR에서 이 신규 10개 입력을 작성하는 별도 진행 작업은 확인되지 않았다. 현재 외부 구현 담당자, local lock, 누적 시도와 실행 상태는 UNKNOWN이며 담당자가 없다고 단정하지 않는다. 확인 범위에서 이 정확한 시험지 입력 업로드/접근 거절은 발견하지 못했다. 다른 시험지의 특정 거절을 재시도하거나 우회하지 않는다. 지정 구현 작업자가 중단된 상태이므로 새 인계·렌더·외부 지시는 하지 않았다.

## 입력의 정적 대조와 남은 검토
ROOT가 작성한 최신 item.json, plan.json, publish.json의 바이트를 그대로 보존한다. JSON 파싱, ordinal/sourcePath 및 아래 원문 인용의 정확 일치를 확인한 것만으로 공식 계약 검증 통과를 뜻하지 않는다.
원격 쓰기 전 ROOT가 stat-chart 5개 및 number-line 5개의 금지된 최상위 sourceQuote를 제거하고 모든 인용을 로컬 STATUS로 옮겼다. 현재 10개 plan 모두 그 키가 없음을 정적으로 확인했다. 나머지 계약·레이아웃·수학·답 노출 검토는 NOT_RUN이다. publish size는 실제 렌더 sizeClass 확인 전 확정하지 않는다.

표준정규분포 양쪽 z≤-2, z≥2 꼬리에 동일한 p를 붙인다. 문제에 주어진 표 값 P(0≤Z≤2)=0.475에 따라 합을 0.05로 계산하는 맥락을 유지한다. 정확한 Gaussian 적분의 양쪽 꼬리는 약 0.0455003이므로 실제 곡선 면적을 정확히 0.05라고 주장하지 않는다. 꼬리 면적 라벨·표 값 사용 및 가독성은 미검증이다.

## ROOT 로컬 STATUS 원문
아래는 보존 직전 로컬 초안 기록을 그대로 남긴 것이다. 그 안의 “원격 보존 NOT_RUN”은 이 브랜치 추가 전의 작성 시점 상태이며 현재 원격 확인 결과를 대신하지 않는다.

23 강남여고 고2 확률과통계 Q19. ROOT가 원문·정답·해설과 해당 기존 그림을 직접 확인해 계획했다. 기존 그림·소유·이력은 보존한다. 시험지 OPEN 전체를 함께 정리하는 로컬 초안이며 validator·원격 보존·인계 NOT_RUN.
원문 해설 인용: $k/3=2$, 즉 $k=6$이다.
