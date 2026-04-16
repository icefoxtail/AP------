# AP Math SVG Pipeline

형님용 도형 생성-치환-검증 최소 완성 파이프라인입니다.

## 목표
- AI는 **설계 보조 / SVG 초안 생성**까지만 사용
- 실제 JS 삽입은 **파이썬 치환기**
- 무결성 검증은 **파이썬 + Node 문법 검사**
- 형님 검수는 **미리보기 + 검수카드**만

## 구성
- `exam_svg_pipeline.py`  
  공통 함수 모듈
- `build_geumdang_q5.py`  
  금당중 5번 파일럿 SVG + 검수카드 생성
- `prepare_placeholder.py`  
  기존 JS 복사본에서 기존 SVG를 플레이스홀더로 바꾸기
- `inject_svg.py`  
  승인 SVG를 플레이스홀더 위치에 정확히 1회 삽입
- `verify_injection.py`  
  삽입 전/후 비교, 해시 비교, 비도형 영역 무변경 검사
- `run_geumdang_q5_pilot.py`  
  금당중 5번 전체 파일럿 자동 실행

## 핵심 규칙
1. 삽입은 AI가 아니라 파이썬이 한다.
2. 치환 대상이 정확히 1개가 아니면 중단한다.
3. 삽입 전 `.bak` 백업을 남긴다.
4. 승인 SVG와 삽입 SVG의 SHA-256을 비교한다.
5. 삽입 후 Node 문법 검사(`node --check`)를 통과해야 완료본으로 인정한다.

## 권장 입력 형식
```text
[도형 설계 입력]
- 파일명:
- 문항 id:
- 위치 필드:
- 도형 유형:
- 문제 조건:
- 반드시 들어가야 할 라벨:
- 기준 길이/좌표/비율:
- 시험지 스타일 요구:
- 플레이스홀더:
```

## 일반 사용 순서

### 1) 파일럿 SVG + 검수카드 생성
```bash
python build_geumdang_q5.py
```

### 2) 기존 JS에서 SVG를 플레이스홀더로 바꾼 복사본 만들기
```bash
python prepare_placeholder.py \
  --source "/path/to/source.js" \
  --output "/path/to/output_placeholder.js" \
  --id 5 \
  --field content \
  --placeholder "{{SVG_Q5}}"
```

### 3) 승인 SVG 삽입
```bash
python inject_svg.py \
  --file "/path/to/output_placeholder.js" \
  --id 5 \
  --field content \
  --placeholder "{{SVG_Q5}}" \
  --svg-file "/path/to/geumdang_q5.svg"
```

### 4) 삽입 무결성 검증
```bash
python verify_injection.py \
  --before "/path/to/output_placeholder.js" \
  --after "/path/to/output_placeholder.js" \
  --id 5 \
  --field content \
  --placeholder "{{SVG_Q5}}" \
  --svg-file "/path/to/geumdang_q5.svg"
```

## 금당중 5번 파일럿 한 번에 실행
```bash
python run_geumdang_q5_pilot.py
```

실행 후 `pilot_outputs/` 안에 아래가 생깁니다.
- `geumdang_q5.svg`
- `geumdang_q5_review_card.json`
- `25_금당중_1학기_중간_중3_기출__placeholder.js`
- `25_금당중_1학기_중간_중3_기출__injected.js`
- `step1_prepare_report.json`
- `step2_inject_report.json`
- `step3_verify_report.json`

## 검수카드만 보는 방식
형님은 SVG 전체를 읽지 않습니다. 아래 4개만 보면 됩니다.
- 배치 맞는가
- 라벨 맞는가
- 핵심 관계 맞는가
- 액박 없는가

검수카드에서는 특히 아래만 봅니다.
- `핵심점`
- `특수요소`
- `라벨`
- `조건반영`

## 주의
- 이 파이프라인은 **플레이스홀더 치환 방식** 기준입니다.
- 기존 구조를 유지하고, **본문/보기/정답/해설을 건드리지 않는 것**이 최우선입니다.
- `String.raw`, `svg` 필드 분리는 현재 기본 규격에 포함하지 않았습니다.
