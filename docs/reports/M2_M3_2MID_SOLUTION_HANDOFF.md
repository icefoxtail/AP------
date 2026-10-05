# 중2·중3 2학기 중간 해설 검수 — 인계 문서

새 세션에서 이 파일만 읽으면 바로 이어서 작업할 수 있도록 정리했다.
고2 작업 기록은 [H2_2MID_SOLUTION_REWRITE_LOG.md](H2_2MID_SOLUTION_REWRITE_LOG.md) 참고.

## 목표

`archive/exams/original/middle/m2/2mid/` (15개)와 `middle/m3/2mid/` (13개)의
모든 해설을 아래 **3세대 4종 헤딩** 형식으로 통일한다.

```
[키포인트] …
조건 정리: …
풀이 방향: …
정석 풀이: …
따라서 정답은 ③이다.        ← 객관식
따라서 구하는 값은 $17$이다.   ← 서술형·단답형
```

## 작업 규칙 (사용자 지시)

1. **해설에 메타 코멘트를 절대 넣지 않는다.** 학생이 보는 글이므로 원본 답안이 왜 틀렸는지,
   무엇을 정정했는지 같은 내용은 해설에 쓰지 않는다. 정답이 틀렸으면 **값만 조용히 고친다.**
   (정정 내역은 이 문서 같은 별도 기록에만 남긴다.)
2. **중간보고를 하지 않는다.** 작업 중간에 멈추고 보고하지 말고 끝까지 진행한 뒤 한 번에 보고한다.
3. 원본 해설 PDF를 베끼지 않고 **직접 풀어서** 작성하고, 기록된 `answer`와 대조해 검증한다.
4. 그래프·도형 판독 문항은 `archive/assets/images/…`의 스캔을 확대해 직접 읽는다.
   판독이 애매하면 D드라이브 원본 PDF(`D:/기출/(3)2중간/중2` 또는 `중3`)를 렌더해 확인한다.

## 진행 현황 (2026-07-25 기준)

**다른 창에서 병렬로 같은 작업이 진행 중이다.** 파일을 잡기 전에 반드시 아래 §도구의
상태 확인 스크립트를 먼저 돌려 최신 상태를 보고, 이미 완료된 파일은 건너뛴다.

| 학년 | 파일 | 총 문항 | 남은 문항 |
|---|---|---|---|
| 중2 | 15개 중 6개 완료 | 358 | **217** |
| 중3 | 13개 중 6개 완료 | 311 | **166** |

### 남은 파일

**중2** — 23_금당중(25), 23_신흥중(24), 23_연향중(24), 23_왕운중(24), 23_이수중(24),
23_향림중(24), 24_연향중(23), 25_삼산중(24), 25_왕운중(25)

**중3** — 23_왕운중(24), 23_풍덕중(24), 24_금당중(24), 24_신흥중(24), 24_연향중(23),
24_왕운중(23), 25_금당중(24)

### 이번 세션에서 끝낸 것

- 중3 `23_동산중` 25문항, `23_연향중` 24문항 — 정답 오류 없었음

## 도구

세션이 바뀌어도 살아 있도록 아래 경로에 복사해 두었다.

```
C:\Users\USER\AppData\Local\Temp\claude\_exam_solution_tools\
```

| 파일 | 용도 |
|---|---|
| `one.js` | js 한 개를 실행해 `questionBank`를 JSON으로 출력 |
| `dump.js` | 디렉터리 전체를 `{파일명: {title, bank}}`로 덤프 |
| `dump2.py` | `<디렉터리> <파일명(확장자 없이)>` → `scratchpad/cur.md`에 검수용 목록 생성 (완료 문항은 `[완료]` 표시) |
| `patch_sol.py` | **라벨형**(`"solution": "…"`) 파일의 해설 교체 |
| `patch_pos.js` | **위치 인수형**(`q(id, level, …, solution, image)`) 파일의 해설 교체 |
| `fixans.py` | `answer` 필드만 교체 (`<파일> <id> <기존값> <새값>`, 기존값 불일치 시 중단) |
| `fixfield.js` | `content` / `choices` 필드 교체 |
| `pg2.py` | `<PDF> <페이지,쉼표구분> [폭]` → 원본 PDF 페이지를 PNG로 렌더 |

두 패처 모두 **교체 후 node로 재파싱해 `solution` 외 모든 필드가 동일한지 자동 검증**하고,
어긋나면 파일을 쓰지 않고 종료한다.

### 파일 형식 구분

`head -c 300` 으로 첫 줄을 보면 된다.

- `window.questionBank = [ { "id": 1, … } ]` 또는 `{id:1,…}` → **라벨형** → `patch_sol.py`
- `function q(id,level,category,key,content,choices,answer,solution,image){…}` → **위치 인수형** → `patch_pos.js`

중3 `2mid`는 지금까지 확인한 파일이 모두 위치 인수형이었다.

### 상태 확인 (작업 시작 전 필수)

```bash
python - <<'EOF'
import os, subprocess, json
T=os.environ['TEMP']+"/claude/_exam_solution_tools"
H=["[키포인트]","조건 정리:","풀이 방향:","정석 풀이:"]
for tag,d in [("중2","archive/exams/original/middle/m2/2mid"),
              ("중3","archive/exams/original/middle/m3/2mid")]:
    r=subprocess.run(["node",os.path.join(T,"dump.js"),d],capture_output=True,text=True,encoding='utf-8')
    for k,v in sorted(json.loads(r.stdout).items()):
        b=v.get('bank') or []
        ns=sum(1 for q in b if all(h in (q.get('solution') or '') for h in H))
        if ns!=len(b): print("남음 %s %-40s %d/%d" % (tag,k,ns,len(b)))
EOF
```

### 한 파일 처리 순서

```bash
# 1) 검수용 목록 뽑기
python "$T/dump2.py" "archive/exams/original/middle/m3/2mid" "24_금당중_2학기_중간_중3_수학"
#    → scratchpad/cur.md 를 읽고 문항을 직접 풀어 answer 검증

# 2) 해설 작성: sol_cur.py 에 S[1]…S[n] = r"""…""" 로 쓰고 sol_cur.json 생성
python "$T/../<세션>/scratchpad/sol_cur.py"

# 3) 패치 (형식에 맞는 패처 선택)
node "$T/patch_pos.js" "<js경로>" "<sol_cur.json 경로>"

# 4) 확인
python "$T/dump2.py" "<디렉터리>" "<파일명>"   # cur.md 의 [완료] 개수가 전체와 같은지
```

`sol_cur.py`는 매번 새로 쓰는 작업 파일이라 도구 폴더에 넣지 않았다. 형식은 아래와 같다.

```python
# -*- coding: utf-8 -*-
import json, io, os
SP = "<scratchpad 경로>"
S = {}
S[1] = r"""[키포인트] …
조건 정리: …
풀이 방향: …
정석 풀이: …
따라서 정답은 ③이다."""
# … S[n] 까지
io.open(SP+"/sol_cur.json","w",encoding="utf-8").write(
    json.dumps({str(k):v for k,v in S.items()}, ensure_ascii=False, indent=1))
```

## 마무리 검증

전 파일을 끝낸 뒤 다음을 확인한다.

```bash
node archive/tools/exam-lint.mjs "2학기_중간_중2"
node archive/tools/exam-lint.mjs "2학기_중간_중3"
```

`FAIL 0 / WARN 0`이어야 한다. 린터의 '추측성 표현' 패턴에 `가능성`이 들어 있어
**`미분가능성` 같은 정상 용어가 오탐**으로 걸린다. 이때는 문구를 `미분가능 여부` 등으로 바꾼다.

추가로 4종 헤딩 완비 여부, `$` 짝, 결론 문장 유무를 스크립트로 전수 확인한다.

## 주의

- **개행**: 이 작업으로 파일이 LF → CRLF로 바뀌지만 git `core.autocrlf` 덕분에
  `git status`에는 실제 내용 변경만 잡힌다. 커밋에 영향 없다.
- **작업 범위 밖 변경**: 고2 작업 때 `25_금당고 확률과통계.js`에서 빈 `image: ""` 필드
  19개가 사라진 변경이 발견됐다. 해설 작업으로 생긴 것이 아니므로 그대로 두었다.
  같은 일이 또 보이면 되돌리지 말고 기록만 남긴다.
