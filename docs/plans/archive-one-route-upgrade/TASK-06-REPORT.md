# TASK-06 보고 — 꾸러미 목록과 읽기 전용 비교 초안

## 결과와 판본

- 코드 브랜치: `feat/exam-bundle-20261116`
- 시작 main 고정: `92dd3614585fefadef3ce0ad6cf68aed5cef97da`
- 게시 코드: `4d289869b30214cdd3f767779389d2ababfc405e`
- 코드 tree: `2c24bf287f2add8c08e8c375cd3b3f1e52b50031`. 원격 fetch 뒤 테스트한 로컬 tree와 전체 diff 0으로 확인.
- 보고 직전 계획: `6c1c8731149722548882afb935a7733167a0abc3`. TASK06/QUEUE/FEEDBACK 변경 없음, TASK10의 결과표 지시 변경 보존.
- main 병합·PR 생성·배포·운영 데이터 수정 없음. 코드 6파일만 추가/수정, 보고는 계획 브랜치에만 기록.

## 구현

- `docs/architecture/Archive_Exam_Bundle_v0_DRAFT.md`: 필드표·예시·포함/제외·난이도 요청 v1/검수 등록 v2/4칸 compact 대응. 봉인 MANIFEST에 없는 신규 초안이며 운영 저장 경로는 제안만 기록.
- `build-bundle.mjs`: 실제 JS/정본/identity map/compact/index/자산을 읽는 목록 생성. 실제 Git blob SHA-1·SHA-256, 문항 UID/순번/원표기 번호, 그림 파일 해시·누락, 인라인 그림 해시, 출처별 현재 메타와 필드명 충돌, fieldStatus/index/pending, 부분 표시를 기록. 필드명·상태는 Meta OS 2~3장 어휘 재사용.
- compact의 ordinal은 화면 번호이므로 공식 `tools/4slot/exam-items.cjs` 번호 함수를 재사용해 실제 배열 sourceOrdinal과 분리. 중복/다른 UID/번호 오류는 거부.
- `diff-bundle.mjs`: 같은 시험지만 비교. 커밋:경로의 실제 blob, 바이트 해시, 분모·문항 지문을 검증하고 git에서 읽은 옛/새 문항에 `source-delta.classify` 호출. body 지문·assets·meta·registration 변화를 독립 기록.
- 저장된 PASS/완료 선언을 승격하지 않음. 현재 시작 main에는 `archive/tools/completion/` 없음. `overall:null`, **작업 1 병합 뒤 연결**. 판정 로직 복사 없음.
- 발문/보기/정답/해설·원장·캡처 복사 없음. 메타/RPM/4칸 허용 구조만 투영하고 임의 중첩 원문은 거부. 출력은 저장소 밖 새 파일만, symlink 경계와 기존 출력 덮어쓰기를 방어.

## 검증

- `node --test tests/archive-exam-bundle.test.mjs`: **12/12 PASS**. 실파일/충돌/원문 제외, 자산 수정·누락·복수 이미지 필드, 경로와 symlink, UID·순번·번호 충돌, compact 표시번호/pending 결속, RPM 변경, malformed 중첩 원문, 실제 git 분류, dirty/해시 없는 입력, 다른 시험지·변조 지문 거부.
- `node --test tests/archive-source-delta.test.mjs`: **15/15 PASS**. 첫 실행은 sparse checkout에서 worker helper가 없어 ENOENT. 해당 단일 tracked 파일만 HEAD에서 materialize 후 통과. 검사 완화 없음.
- 두 신규 CLI `node --check`, `git diff --check`: PASS.
- `tools/run-tests.js` requiredCommands에 신규 테스트 등록.
- 독립 read-only 검토 1회 및 지적 변경분 확인 완료. 이미지 배열 누락, compact 표시번호 연결, RPM 경로 누락, 임의 nested 값 복사 4건을 작성자가 수정하고 반례 추가. 변경분 재검토 결과 남은 blocker 없음.

## 실제 3건 실행

`buildBundle({exam})`(CLI와 동일 함수)로 아래 3건을 저장소 밖 JSON에 생성. 시간은 대상 assets materialize 완료 후 최신 구현 1회 측정. JS/정본/identity/index/compact 모두 실제 파일 존재 확인. 중3 2개·고1 7개 그림이 sparse checkout으로 빠져 있었으므로 정확한 해당 tracked 자산만 HEAD에서 복원하여 환경 누락을 운영 누락으로 세지 않음.

| 시험지(exams 상대 경로) | 문항 | 생성 ms | 값이 다른 문항 | 그림 참조 PRESENT/MISSING | missing4slot / typeHold |
| --- | ---: | ---: | ---: | --- | --- |
| `original/middle/m3/1mid/16_경북장흥중_1학기_중간_중3_수학.js` | 24 | 1219.7 | 17 | 2 / 0 | 0 / 0 |
| `original/high/h1/1mid/19_강남여고_1학기_중간_고1_기출.js` | 26 | 636.5 | 3 | 7 / 0 | 0 / 0 |
| `similar/high/h1/1mid/23_매산고_1학기_중간_고1_유사.js` | 20 | 664.6 | 0 | 0 / 0 | 0 / 0 |

값이 다름은 같은 필드가 두 출처에 존재하면서 JSON 값이 다른 문항 수다. 빠진 값·의미상 별칭을 추정해 충돌로 세지 않는다. partial=0도 완료 PASS가 아니며 전 문항 overall=null이다.

3개 JS blob(위 순서): `21197c0b1b48d0df48777847ce19957c2075eb2a`, `2a87c0676132ed2ab93880b1ec5a2c069a285fd5`, `135396479fea0812337ba41f21c57b7fe0c030dd`. 메타 SHA-256 `d31132c09f3d18ba31e22ff77d19a41f496dc6f528e62b8692776f404625bbce`, identity `ec6938bd2ad20bad6242fb24f2be84c563ae047abd0e01bffec32e48e9d454f5`, index `48ac02c5ffe219971d7389f166344e28cc1a624a2cf17072f1502339e899e5dc`.

## 한계 / 다음 연결

- 등록 입력 생성, 학생 UI·수학/시각 검수, 전체 suite, CI/배포: **NOT_RUN**, 이번 읽기 전용 초안 범위 밖.
- completion 도구 병합 후 공식 API 어댑터를 붙여야 한다. 이 초안은 해당 경로의 도구가 생기면 임의로 완료 판정하지 않고 어댑터 필요 오류로 멈춘다.
- dirty 파일의 실제 해시는 기록하지만 commit 결속이 없으면 diff 본문 분류를 하지 않는다. git 객체가 없거나 해시가 없을 때도 null+이유이며 원문을 추측하지 않는다.
- 외부 그림 URL은 가져오지 않고 미확인 표시. source-delta의 기존 지문 정의가 inline SVG 변경을 지문에 포함하지 않더라도 자산 해시/분류는 별도로 탐지.
- steps는 현재 안전한 정수/정수 배열 목록만 관찰 지원. 임의 prose/nested 형식은 명시 거부하며 원문을 내보내지 않는다. 등록 권위/그림 내용 품질/CC↔4칸 의미 동등성을 새로 판단하지 않는다.
