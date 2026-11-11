# 학원 라인 해설 그림 게시 도구(2026-11 보관본)

학원 PC에서 중등·고등 2학기 기말 해설 그림을 만들고 게시할 때 쓴 스크립트다. 작업 워크트리의 `.tmp/work/`에만 있던 것을 워크트리를 지우기 전에 옮겼다. 경로가 `.tmp/work/…`, `.tmp/svg-m1/…`로 박혀 있으므로 다시 쓰려면 저장소 루트에서 `.tmp/work/`로 복사해 쓴다. 공식 게시 흐름(`pubflow.py`, `publish-exam.py`, `ledger-upsert.py`)은 한 단계 위 폴더에 있다.

| 파일 | 하는 일 |
|---|---|
| `EXTRA-common.md` | 구현·검수 지시서에 덧붙인 공통 규칙(색 구분, 세로분수, 답은 caption 끝에만, 닮은 도형은 닮음비대로 등) |
| `build-pub.py` | 검수 끝난 문항 폴더에서 게시 재료(review·rows·triage)를 만든다 |
| `pub-loop.sh` | `pubflow.py`를 돌리고 쪽 나눔 실패 문항을 빼 가며 반복한다 |
| `pub-keep.py` | 일부 문항만 게시하도록 재료를 줄인다(아래 주의) |
| `pub-exclude.sh`, `pub-reset.sh` | 한 문항 빼기, 실패한 게시 되돌리기 |
| `a11y.sh` | 렌더한 SVG에 role·title을 넣는다 |
| `jscheck.cjs` | 시험지 JS가 그림 필드만 바뀌었는지 HEAD와 비교한다 |
| `refadd.cjs` | 시험지 JS가 참조하는 새 그림 파일 목록을 낸다(`git add`용) |
| `sheet.py` | 그림 모아보기 PNG를 만든다 |
| `merge-when-green.sh` | PR CI가 전부 통과하면 병합한다 |
| `next-sonnet.sh` | 다음 시험지 작업 지시를 띄운다 |
| `publish-qfig.cjs`, `qswap.cjs` | 문제 그림을 검정 SVG로 교체한다(`image` 필드 / 본문 `<img>` 경로) |
| `padrecrop.py` | 다시 자른 좁고 긴 문제 그림에 좌우 여백을 넣는다 |
| `applyfix2.cjs`, `ctl.cjs` | 원문 수정 적용, 제어문자·역슬래시 빠진 LaTeX 점검 |
| `planmatch.py` | 게시된 SVG와 같은 렌더 결과를 찾아 작도 원본(plan)을 고른다 |
| `ledger-repair.cjs` | 장부에서 OPEN으로 덮인 문항을 이력에서 복구한다 |

## 주의: 일부 문항만 게시하면 장부가 덮인다

`pub-keep.py`로 rows를 일부 문항만 넘겨 게시하면, 같은 시험지의 이미 게시된 나머지 문항이 장부에서 `OPEN_LAYOUT`으로 덮인다(triage는 시험지 전체, rows는 일부). 시험지 JS의 그림은 그대로이고 CI도 잡지 못한다. 2026-11-11에 402문항이 이렇게 덮여 `ledger-repair.cjs`로 복구했다(PR #1778). 부분 게시 뒤에는 커밋 전에 `node ledger-repair.cjs`(쓰기 없이)를 돌려 "items to repair"가 늘지 않았는지 확인한다.
