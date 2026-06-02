# 시험지 추출 파이프라인 V2 외부 자문 요청서

## 자문 대상

`past-exam-pipeline`을 문항별 crop 기반에서 full page Vision 기반 추출 파이프라인으로 바꾼 수정본입니다.

## 최우선 검수 기준

발문/보기 검수의 기준은 crop이 아니라 full page입니다.

```text
fullPageImagePath 또는 sourcePageEvidencePaths 기준으로
displayNo 위치를 확인하고,
JS content/choices와 원문을 비교한다.
cropPath는 확대 보조일 뿐, PASS/FAIL의 기준이 아니다.
```

검수 순서는 반드시 `full-page 발문/보기 검수 → 필요 시 crop 보조 확인 → 필요한 visual asset만 crop 검수`입니다. `crop 품질 검수 → 발문 검수` 순서로 판단하면 안 됩니다.

## 확인 목표

외부 검수자는 실제 파일을 열고 아래 사항을 확인해 주세요.

1. candidate JS의 `image`가 문항 전체 crop이나 full page를 가리킬 수 없는지 확인
2. `fullPageImagePath`는 근거 이미지로 유지되지만 `image`와 섞이지 않는지 확인
3. `visualAssetBBoxOnPage`로 그래프/도형/표/이미지 영역만 자르게 되어 있는지 확인
4. bbox가 너무 크거나 페이지 밖이면 crop하지 않고 manual review로 빠지는지 확인
5. visual asset crop 실패 시 question crop fallback을 쓰지 않는지 확인
6. answer/solution이 파이프라인에서 제외되어 있는지 확인
7. blank answer/solution이 `external_agent_required` 상태에서 validation 실패로 처리되지 않는지 확인
8. debug question crop이 candidate image에 연결될 가능성이 없는지 확인
9. Vision JSON schema/request가 GPT/Gemini 등 외부 호출에 충분한지 확인
10. 기존 문제집 파이프라인의 visual asset gate와 비교해 빠진 방어조건이 있는지 확인
11. `validate_final_candidates.py`가 `image` blank를 fullPageImagePath/cropPath로 fallback하지 않는지 확인
12. `contentSource == "vision_required"` 또는 `choicesSource == "vision_required"` 문항이 PASS처럼 보이지 않는지 확인

## 핵심 파일 확인 순서

1. `helpers/scanned_exam_pipeline.py`
2. `helpers/crop_visual_assets_from_full_pages.py`
3. `helpers/audit_generated_visual_asset_links.py`
4. `run-one-exam.mjs`
5. `lib/js-candidate.mjs`
6. `docs/PAST_EXAM_PIPELINE_V2_POLICY.md`
7. `docs/VISION_PAGE_EXTRACT_REQUEST_TEMPLATE.md`
8. `examples/vision_page_extract.example.json`
9. `pipeline.config.example.json`
10. `package.json`

## 반드시 찾을 위험

- `image = cropPath` 류의 회귀
- `image`가 `pages/page_p001.png`를 가리키는 회귀
- `crops/questions` 또는 `crops/debug_questions`가 candidate image에 연결되는 회귀
- visual bbox가 문항 전체 또는 페이지 전체를 잘라도 PASS되는 위험
- bbox 실패 시 full question crop으로 대체되는 위험
- answer/solution을 다시 파이프라인 안에서 채우려는 회귀
- content/choices가 비어 있거나 `vision_required`인데 성공으로 처리되는 위험
- Vision JSON이 깨졌을 때 candidate가 조용히 정상처럼 보이는 위험
- 외부 answer/solution 에이전트가 content/choices/image를 무단 수정할 수 있는 위험

## 검수 결과 형식

```text
# 외부 자문 결과

## 1. 실제 확인한 파일
- 파일명:
- 확인한 함수/상수/정책:

## 2. PASS 가능 항목

## 3. 발견된 버그/오류

## 4. 회귀 위험

## 5. 추가 보정 필요 여부

## 6. 최종 판정
PASS / CONDITIONAL PASS / FAIL
```

근거 없는 PASS는 금지합니다. 확인하지 않은 파일은 반드시 미검수로 표시해 주세요.
