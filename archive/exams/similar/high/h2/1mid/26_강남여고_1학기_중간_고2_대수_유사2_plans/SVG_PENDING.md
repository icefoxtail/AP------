# 26_강남여고_1학기_중간_고2_대수_유사2 SVG 후속 장부

- 문제용 필수 그림: Q01~Q25 전부 EXEMPT. Q19는 바깥/안쪽 부채꼴 반지름과 두 호·두 직선 경계를 발문에 모두 기술해 도형이 없어도 풀이 가능.
- 해설용 그림: Q19 q19-solution.plan.json 1건 SVG_TO_CREATE / NOT_RUN. 고리 부채꼴에서 호와 반지름을 시각화하는 보조도이며, 운영 JS 해설은 그림 없이 완결됨.
- 해설 SVG 렌더 0/1, PNG 육안 검수 0/1, 게시 0/1; 실제 solutionImage 경로 없음.
- 나머지 Q01~Q18, Q20~Q25 해설 보조 SVG는 EXEMPT (판서 수식 충분).
- 별도 시각 개선 때 Q17 사다리꼴, Q25 삼각함수 구간을 재평가할 것.
- 메타 독립 승인, CI, 학생 사이트 배포를 SVG 완료나 main 병합과 혼동하지 않음.

## 공식 SVG 엔진 제작·검수·JS 연결 완료 (2026-11-25)

- 전체 `plan-lint.cjs`(NotoSansKR.ttf 포함): **1/1 OK**
- 공식 `render-plan.mjs`: **1/1 ARCHIVE_BOUND**
- `assertSvgStudentLanguage`: **1/1 PASS**
- PNG 실물 육안 검수: **1/1 PASS**

| 문항 | 축 | 엔진 결과 | 크기 | PNG 검수 | 연결된 JS 경로 |
| --- | --- | --- | --- | --- | --- |
| Q19 | solution | `ARCHIVE_BOUND` | full | PASS | `assets/images/26_강남여고_1학기_중간_고2_대수_유사2/q19-solution.svg` |

## FIRST_FORMAL 추가 검수·문제 그림 결함 인계 (2026-11-26)

- 위의 최초 제작 당시 기록은 역사적 기록이다. **현행 Q19 문제용 시각 축은 BENEFICIAL**이며 기존 `assets/images/26_강남여고_1학기_중간_고2_대수_유사/q19.svg`를 연결했던 것은 오류였다. 기존 그림의 바깥 원 반지름이 8, 안쪽 원 반지름이 6으로 **3/4**인데 현재 발문의 비율은 **1/2**이다. 학생에게 틀린 그림을 노출하지 않도록 이번 정식 검수에서 문제의 `image`·`imageSize` 참조를 제거했다. 발문은 두 호·두 선분·반지름 비율을 완전하게 서술해 독립적으로 풀이된다.
- 신규 `q19-problem.plan.json`은 안쪽/바깥쪽 반지름을 모식도 값 **4/8=1/2**로 고정했고, 두 호·두 연결 선분·영역 및 분할비를 전부 대조했다. 발문에 없는 구체적 중심각 60°는 표시하지 않는 모식도용 생성 좌표일 뿐이다. 정답이나 해설 공식은 문제 플랜·캡션에 노출하지 않는다. 공식 shallow/full lint는 둘 다 **PASS**.
- 현행 해설 SVG `assets/images/26_강남여고_1학기_중간_고2_대수_유사2/q19-solution.svg`는 반지름이 **8·4**로 맞으며 기존의 공식 렌더·PNG 기록은 위 표 그대로 보존한다. 이번 검수에서 `q19-solution.plan.json`의 원문 불일치 `sourceQuote`만 실제 해설 인용으로 고쳤고 shallow/full lint **PASS**.
- 신규 Q19 문제 SVG의 **공식 렌더·PNG 시각검수·JS 연결은 NOT_RUN / 후속**이다. 이번 환경에서 공식 `render-plan.mjs`를 시도했으나 `ARCHIVE_PREFLIGHT_FAIL`(Chrome 채널 실행 파일 `/opt/google/chrome/chrome` 부재)로 그림 파일을 만들지 못했다. 해설 SVG는 이 턴에서 재렌더하지 않았다. 환경 장애를 실제 렌더 성공으로 표시하지 않는다.
- 학생 배포의 새 문제 그림 필요 여부는 후속 SVG 담당이 올바른 `q19-problem.plan.json`을 공식 엔진으로 렌더·PNG·학생 화면 검수한 후 결정한다. Q17 사다리꼴과 Q25 구간은 이번 독립 검수에서 좌표/구간을 모두 문자로 산출할 수 있어 EXEMPT로 재판정했다(세부 사유는 시험지별 2축 장부).
