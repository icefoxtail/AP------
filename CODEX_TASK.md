
---

# AP Math 오답 클리닉 출력 엔진 복구 루프 지시서 v2

## 목표

`apmath/wrong_print_engine.html`의 오답 클리닉 출력 엔진을 기존 JS아카이브 출력 엔진 수준으로 복구한다.

수정 대상은 단순 UI가 아니다.
다음 5개 문제를 모두 해결해야 한다.

1. QR이 내부망/로컬 주소로 생성되어 학생/학부모 폰에서 안 열리는 문제
2. QR review에서 전체 문항이 다 안 뜨는 문제
3. 해설이 중간에 잘리는 문제
4. 반별/학년별/유형별 QR payload가 길어져 스캔 실패할 수 있는 문제
5. 학생명/반명/학년명/출력일 메타가 QR review에 보존되지 않는 문제

---

# LOOP 0 — 원인 고정 감사

## 수정 금지

이 루프에서는 코드 수정하지 않는다.
현재 구조를 확인하고 원인을 문서화한다.

## 확인 파일

```text id="ire043"
apmath/wrong_print_engine.html
archive/engine.html
archive/mixed_engine.html
apmath/js/clinic-print.js
```

## 확인 항목

### A. QR 주소 문제

`wrong_print_engine.html`의 `buildQrTargetUrl()`이 `window.location.href`를 기준으로 URL을 만드는지 확인한다.

문제 구조:

```js id="73qicg"
const url = new URL(window.location.href);
```

이 구조면 내부망에서 출력할 때 QR이 아래처럼 만들어질 수 있다.

```text id="172ywo"
http://192.168.x.x:3000/...
http://127.0.0.1:3000/...
http://localhost:3000/...
```

이 QR은 학생/학부모 폰에서 열리지 않는다.

---

### B. QR payload 문항 연결 문제

QR payload가 현재 어떤 필드로 문항을 복원하는지 확인한다.

필수 확인:

```text id="gaffvy"
archiveFile
questionNo
correctRate
```

확인해야 할 함수:

```text id="5r6ysk"
compactWrongItem()
expandWrongQrPayload()
loadAllQuestionBanks()
cloneQuestionForRender()
```

문항 복원 시 다음 중 하나라도 발생하면 FAIL이다.

```text id="t7seso"
archiveFile 없음
questionNo 없음
해당 archiveFile 로드 실패
questionNo와 일치하는 원본 문항 탐색 실패
payload 문항 수와 렌더링 문항 수 불일치
```

---

### C. 해설 잘림 문제

`wrong_print_engine.html`의 `placeSolutionItems()`가 자체 해설 출력기를 쓰는지 확인한다.

문제 조건:

```js id="4dxace"
targetCol.querySelectorAll('.sol-box').length === 1
```

이 조건이 있으면, 해설 박스 하나가 컬럼 높이를 넘어도 배치 성공 처리된다.

동시에 CSS가 아래처럼 되어 있으면 실제 출력에서는 뒤가 잘린다.

```css id="2ro4l2"
.grid-col { overflow: hidden; }
.q-box { overflow: hidden; }
```

---

### D. 기존 아카이브 엔진에는 보호 로직이 있는지 확인

`archive/engine.html`에 아래 흐름이 있는지 확인한다.

```text id="u9e24x"
makeSolutionHtmlChunks()
makeLongSolutionShell()
renderSplitSolutionBox()
placeSolutionBox()
```

이 로직은 긴 해설을 조각내서 다음 컬럼/다음 페이지로 넘기는 역할이다.

---

### E. 학생별 양면 인쇄 QR 위치 확인

학생별 출력에서 다음 구조를 확인한다.

```text id="71l8ic"
문제지 마지막 실제 페이지에 QR 삽입
학생별 페이지 수가 홀수면 빈 페이지 삽입
빈 페이지에는 QR 없음
다음 학생은 새 장에서 시작
```

이 구조는 유지해야 한다.

---

# LOOP 0 PASS 기준

아래 표를 보고서에 남긴다.

```text id="jf68s9"
항목 | 현재 상태 | 문제 여부 | 수정 필요 여부
QR URL 생성 | window.location.href 사용 | 문제 있음 | 수정 필요
QR payload 문항 연결 | archiveFile/questionNo 기반 | 검증 필요 | 보강 필요
해설 출력 | 오답엔진 자체 placeSolutionItems 사용 | 문제 있음 | 수정 필요
긴 해설 split | 오답엔진에는 없음 | 문제 있음 | 이식 필요
학생별 양면 빈 페이지 | 유지 필요 | 주의 | 회귀 금지
```

---

# LOOP 1 — QR 공개 주소 고정

## 목적

내부망/로컬에서 출력해도 QR은 항상 공개 URL로 생성한다.

## 수정 파일

```text id="9fauep"
apmath/wrong_print_engine.html
```

## 추가 상수

```js id="5ex4ru"
const WRONG_PRINT_PUBLIC_URL = 'https://icefoxtail.github.io/AP------/apmath/wrong_print_engine.html';
```

## 수정 함수

`buildQrTargetUrl(compactPayload)`를 아래 방식으로 수정한다.

```js id="dk0hfv"
function buildQrTargetUrl(compactPayload) {
    const url = new URL(WRONG_PRINT_PUBLIC_URL);
    url.searchParams.set('mode', 'review');
    url.searchParams.set('qr', '1');
    url.searchParams.set('wp', encodeWrongQrPayload(compactPayload));
    return url.toString();
}
```

## 유지 조건

아래 파라미터는 반드시 유지한다.

```text id="aiu8e7"
mode=review
qr=1
wp=...
```

## FAIL 조건

```text id="vb7q0k"
QR URL에 localhost 포함
QR URL에 127.0.0.1 포함
QR URL에 192.168 포함
QR URL에 내부망 IP 포함
mode=review 누락
qr=1 누락
wp 누락
```

---

# LOOP 2 — QR payload 문항 연결 보장

## 목적

QR review에서 “전체 문항”이 빠지지 않게 한다.

해설 잘림과 별개로, QR payload에서 문항을 다시 찾는 과정이 실패하면 해당 문항이 아예 안 뜰 수 있다.
따라서 문항 연결 검증을 별도 루프로 둔다.

## 확인해야 할 흐름

```text id="p6t3eb"
buildStudentQrPayload()
buildClassQrPayload()
buildGradeQrPayload()
buildTypeQrPayload()
compactWrongItem()
encodeWrongQrPayload()
decodeWrongQrPayload()
expandWrongQrPayload()
loadAllQuestionBanks()
cloneQuestionForRender()
```

## 수정 지침

### 1. compact payload에 원본 식별자 보강

현재 `archiveFile + questionNo`만으로 부족할 수 있으므로 가능한 경우 아래 필드를 보존한다.

```js id="reks42"
{
    archiveFile,
    questionNo,
    id,
    originalId,
    examTitle,
    correctRate
}
```

단, QR payload가 너무 길어지지 않게 필드명은 짧게 압축한다.

예시:

```js id="rr22g1"
{
    f: archiveFile,
    q: questionNo,
    id: id,
    e: examTitle,
    r: correctRate
}
```

### 2. 문항 복원 시 다단계 매칭

`cloneQuestionForRender()` 또는 해당 복원 흐름에서 아래 순서로 찾는다.

```text id="le3qiz"
1. archiveFile 일치
2. q.id === questionNo
3. q.id === id
4. q.questionNo === questionNo
5. 배열 index + 1 === questionNo
```

### 3. 못 찾은 문항은 조용히 버리지 말 것

못 찾은 문항이 있으면 출력물에 경고 박스를 표시한다.

예시:

```text id="ff2yhe"
[문항 로드 실패]
archiveFile: ...
questionNo: ...
이 문항은 원본 아카이브에서 찾지 못했습니다.
```

콘솔에도 warning을 남긴다.

## PASS 조건

```text id="v84bm1"
payload 문항 수 === 복원된 문항 수
복원 실패 문항이 있으면 출력물에 경고 표시
복원 실패를 조용히 무시하지 않음
학생별/반별/학년별/유형별 모두 검증
```

## FAIL 조건

```text id="cjphb4"
payload에는 있는데 해설지에는 없는 문항 발생
정답표에는 있는데 해설지에는 없는 문항 발생
복원 실패를 콘솔만 찍고 출력에서 누락
문항 번호가 중간에 건너뜀
```

---

# LOOP 3 — QR payload 메타 보존

## 목적

QR review 화면에서 학생명/반명/학년명/출력일이 사라지지 않게 한다.

현재 학생별 QR review에서 학생명이 `오답`처럼 일반값으로 복원될 수 있다.
이러면 연결은 되어도 어떤 학생 출력물인지 식별이 어렵다.

## 수정 지침

QR compact payload에 최소 메타를 넣는다.

### 학생별

```js id="w8h5z1"
{
    v: 3,
    m: 'student',
    n: student.studentName || '',
    c: payload.className || '',
    t: payload.printTitle || '',
    d: payload.createdDate || '',
    i: compactItems
}
```

### 반별

```js id="ure0vw"
{
    v: 3,
    m: 'class',
    c: payload.className || '',
    t: payload.printTitle || '',
    d: payload.createdDate || '',
    i: compactItems
}
```

### 학년별

```js id="2g4x4i"
{
    v: 3,
    m: 'grade',
    g: payload.gradeName || '',
    t: payload.printTitle || '',
    d: payload.createdDate || '',
    i: compactItems
}
```

### 유형별

```js id="v4hrjh"
{
    v: 3,
    m: 'type',
    y: payload.typeMode || '',
    l: payload.typeLabel || '',
    s: payload.scopeLabel || '',
    t: payload.printTitle || '',
    d: payload.createdDate || '',
    i: compactItems
}
```

## 기존 payload 호환

`expandWrongQrPayload()`는 v2와 v3을 모두 복원해야 한다.

```text id="ga7l8a"
v2 QR → 기존 방식으로 정상 복원
v3 QR → 메타 포함 복원
```

## PASS 조건

```text id="51t4wv"
학생별 QR review 제목에 실제 학생명 표시
반별 QR review 제목에 실제 반명 표시
학년별 QR review 제목에 실제 학년 표시
출력일 유지
기존 v2 QR도 깨지지 않음
```

---

# LOOP 4 — QR 길이/스캔 안정성 검증

## 목적

반별/학년별/유형별 오답은 문항 수가 많아 QR URL이 너무 길어질 수 있다.
URL이 길면 QR이 너무 촘촘해져 스캔이 실패하거나, 브라우저/기기에서 열리지 않을 수 있다.

## 수정 지침

`buildQrTargetUrl()` 결과 URL 길이를 측정한다.

```js id="ayc1wu"
const qrUrl = url.toString();
```

아래 기준을 둔다.

```text id="3rb8a3"
1200자 이하: 정상
1201~1800자: 경고
1800자 초과: 위험
```

## 위험 처리

1800자를 초과하면 출력물에 QR을 그냥 박지 말고, QR 옆 또는 하단에 경고를 표시한다.

```text id="lc5n01"
QR 데이터가 너무 길어 일부 기기에서 스캔이 실패할 수 있습니다.
문항 수를 줄여 출력하거나 학생별로 출력해 주세요.
```

단, 이 루프에서 서버 저장형 short key까지 새로 만들지는 않는다.
서버 저장형 공유키는 별도 API/D1 설계가 필요하므로 이번 복구 범위에서는 **경고 및 실패 방지**까지만 한다.

## PASS 조건

```text id="nwa3sl"
QR URL 길이 측정
긴 QR 경고 표시
학생별 QR은 정상 생성
반별/학년별/유형별 긴 payload도 조용히 실패하지 않음
```

## FAIL 조건

```text id="3zlond"
긴 QR을 아무 경고 없이 출력
스캔 실패 가능성을 숨김
URL 길이 검증 없음
```

---

# LOOP 5 — 해설 출력기를 아카이브 엔진 방식으로 복구

## 목적

오답엔진의 해설 출력이 기존 `archive/engine.html`의 해설 출력 계약을 따르게 한다.

현재 오답엔진은 긴 해설을 한 컬럼에 넣고, 안 들어가도 성공 처리할 수 있다.
이 구조를 제거한다.

## 수정 파일

```text id="qig5m5"
apmath/wrong_print_engine.html
```

## 이식해야 할 개념

아카이브 엔진의 아래 흐름을 오답엔진에 맞게 이식한다.

```text id="ijhuo4"
makeSolutionHtmlChunks()
makeLongSolutionShell()
renderSplitSolutionBox()
placeSolutionBox()
```

## 필수 제거 조건

아래 조건은 제거한다.

```js id="i6m9zn"
targetCol.querySelectorAll('.sol-box').length === 1
```

정확히는 “해설 박스가 1개뿐이면 overflow여도 placed=true”가 되면 안 된다.

## 새 배치 원칙

```text id="zm3b6s"
1. 현재 컬럼에 해설 박스를 넣는다.
2. MathJax typeset 한다.
3. 높이를 측정한다.
4. 들어가면 확정한다.
5. 안 들어가면 autoCompress 한다.
6. 그래도 안 들어가면 박스를 제거한다.
7. 현재 컬럼에 다른 해설이 있으면 다음 컬럼/다음 페이지로 보낸다.
8. 현재 컬럼에 이 해설 하나뿐인데도 안 들어가면 renderSplitSolutionBox()로 쪼개서 출력한다.
9. 마지막 chunk까지 반드시 출력한다.
```

## CSS 보정

아래 스타일을 추가한다.

```css id="t72im4"
.q-box.sol-box.sol-box-long {
    overflow: visible;
    padding-bottom: 1em;
    margin-bottom: 0;
}

.sol-chunk {
    display: inline;
}
```

기본 문제지용 `.grid-col`, `.q-box`의 `overflow:hidden`은 무작정 제거하지 않는다.
해설 분할 로직으로 해결한다.

## PASS 조건

```text id="s77ke0"
긴 해설이 다음 컬럼/다음 페이지로 이어짐
해설 마지막 문장까지 출력됨
긴 해설 뒤 문항도 출력됨
전체 문항 해설 수가 payload 문항 수와 일치
학생별/반별/학년별/유형별 모두 동일하게 동작
QR review 해설도 동일하게 동작
```

## FAIL 조건

```text id="m02zuc"
overflow:visible만 넣고 끝냄
긴 해설 마지막 문장 누락
긴 해설 뒤 문항 누락
해설 박스 1개라는 이유로 overflow 허용
정답표 문항 수와 해설지 문항 수 불일치
```

---

# LOOP 6 — QR review 전체 문항 출력 검증

## 목적

QR로 들어간 화면에서 정답표와 해설지가 전체 문항을 모두 포함하는지 확인한다.

## 검증 대상

```text id="8goqtq"
학생별 QR review
반별 QR review
학년별 QR review
유형별 QR review
```

## 검증 항목

각 모드에서 다음을 확인한다.

```text id="cxnew2"
payload 문항 수
정답표 문항 수
해설지 문항 수
DOM에 존재하는 .sol-box 개수
문항 번호 연속성
해설 마지막 문장 존재 여부
```

## PASS 조건

```text id="qoyiyd"
payload 문항 수 = 정답표 문항 수 = 해설지 문항 수
문항 번호가 1번부터 끝까지 연속
긴 해설 마지막 문장 존재
긴 해설 뒤 문항 존재
```

## FAIL 조건

```text id="2fcmdv"
정답표에는 있는데 해설지에는 없는 문항 발생
해설지 번호가 중간에 건너뜀
긴 해설 뒤 문항이 사라짐
QR review가 빈 화면 또는 일부 화면만 표시
```

---

# LOOP 7 — 학생별 양면 인쇄/QR 위치 회귀 검증

## 목적

학생별 전체 출력 시 양면 인쇄 구조를 유지한다.

## 기존 유지 조건

```text id="g1slbp"
학생 A 문제지 3페이지
→ 4페이지 빈 페이지
→ 5페이지 학생 B 시작
```

QR은 학생 A의 3페이지, 즉 **마지막 실제 문제 페이지**에 있어야 한다.
4페이지 빈 페이지에는 QR이 있으면 안 된다.

## 검증 항목

```text id="fwaiaw"
학생별 문제지 마지막 실제 페이지 QR 존재
학생별 빈 페이지 QR 없음
빈 페이지에 헤더 없음
빈 페이지에 페이지 번호 없음
다음 학생은 새 장에서 시작
```

## FAIL 조건

```text id="dqgkig"
빈 페이지에 QR 표시
빈 페이지에 헤더 표시
학생별 출력이 이어 붙어서 양면 인쇄 깨짐
마지막 실제 문제 페이지에 QR 없음
```

---

# LOOP 8 — 테스트 추가

## 권장 테스트 파일

```text id="swdpnp"
tests/apmath-wrong-print-qr-solution-regression.test.js
```

## 테스트 1 — QR 공개 주소

```text id="706uq4"
buildQrTargetUrl() 결과가 공개 URL로 시작
localhost 없음
127.0.0.1 없음
192.168 없음
mode=review 있음
qr=1 있음
wp 있음
```

## 테스트 2 — payload 복원 수량

학생별/반별/학년별/유형별 mock payload를 만든다.

검증:

```text id="g55w6u"
encode → decode → expand 후 문항 수 유지
archiveFile 유지
questionNo 유지
메타 유지
```

## 테스트 3 — 긴 해설 분할

mock 문항을 만든다.

조건:

```text id="gdzq5a"
문항 3개 이상
2번 문항 해설 매우 김
2번 해설 마지막 문장에 고유 문자열 삽입
예: LONG_SOLUTION_END_MARKER
```

검증:

```text id="5m0n37"
1번 해설 존재
2번 해설 존재
LONG_SOLUTION_END_MARKER 존재
3번 해설 존재
```

## 테스트 4 — QR review 전체 문항

검증:

```text id="b7kxl8"
정답표 문항 수 = payload 문항 수
해설지 문항 수 = payload 문항 수
문항 번호 연속
```

## 테스트 5 — QR 길이 경고

긴 class/grade/type payload를 만든다.

검증:

```text id="zo1xub"
URL 길이 측정됨
기준 초과 시 경고 표시
조용히 실패하지 않음
```

---

# LOOP 9 — 실제 출력 검수

## 학생별

```text id="r7xwou"
내부망에서 학생별 오답 출력
QR URL 공개 주소 확인
문제지 마지막 실제 페이지 QR 확인
빈 페이지 QR 없음 확인
QR 접속
정답표 전체 문항 확인
해설지 전체 문항 확인
긴 해설 마지막 문장 확인
```

## 반별

```text id="4vy0ew"
반별 공통 오답 출력
QR 접속
정답표 문항 수 확인
해설지 문항 수 확인
긴 해설 잘림 없음 확인
```

## 학년별

```text id="b010rw"
학년별 공통 오답 출력
QR 접속
전체 문항 해설 확인
QR 길이 경고 여부 확인
```

## 유형별

```text id="3f5v74"
최다오답
최다빈출
단원별 오답
각각 QR review 확인
정답표/해설지 전체 문항 확인
```

---

# 최종 제출 보고 형식

```text id="urafkr"
# AP Math 오답 클리닉 출력 엔진 복구 결과

## 수정 파일
- apmath/wrong_print_engine.html
- tests/...

## 해결 항목
1. QR 공개 URL 고정
2. QR payload 문항 연결 보강
3. QR payload 메타 보존
4. QR 길이 검증/경고
5. 긴 해설 분할 출력 복구
6. QR review 전체 문항 출력 보장
7. 학생별 양면 인쇄 QR 위치 유지

## 검수 결과
- 학생별 QR: PASS/FAIL
- 반별 QR: PASS/FAIL
- 학년별 QR: PASS/FAIL
- 유형별 QR: PASS/FAIL
- QR URL 공개 주소: PASS/FAIL
- QR 길이 검증: PASS/FAIL
- payload 문항 수 = 정답표 문항 수 = 해설지 문항 수: PASS/FAIL
- 긴 해설 마지막 문장 출력: PASS/FAIL
- 학생별 빈 페이지 QR 없음: PASS/FAIL
- 콘솔 에러: 0개 / N개

## 재출력 필요 여부
- 기존 출력물은 내부망 QR일 수 있으므로 재출력 필요: YES

## 남은 리스크
- 있으면 명시
- 없으면 없음
```

---

# 최종 FAIL 기준

아래 중 하나라도 있으면 최종 FAIL입니다.

```text id="np39c2"
1. QR URL에 localhost / 127.0.0.1 / 192.168 / 내부망 IP 포함
2. QR review가 열리지 않음
3. payload 문항 수와 정답표 문항 수 불일치
4. payload 문항 수와 해설지 문항 수 불일치
5. 원본 문항 복원 실패를 조용히 무시
6. 긴 해설 마지막 문장 누락
7. 긴 해설 뒤 문항 누락
8. 해설 박스 1개라는 이유로 overflow 성공 처리
9. 반별/학년별/유형별 검수 생략
10. QR 길이 검증 없음
11. 학생별 빈 페이지에 QR 표시
12. 기존 v2 QR payload 호환 깨짐
13. 테스트 없이 PASS 보고
14. 실제 긴 해설 데이터 없이 PASS 보고
```

---
